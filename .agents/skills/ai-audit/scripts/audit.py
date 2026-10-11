"""Append-only AI audit events and Markdown export (Python 3.9+, macOS/Linux)."""
import argparse
from datetime import datetime
import fcntl
import json
from pathlib import Path
import re
import sys
import uuid
from zoneinfo import ZoneInfo


def now():
    return datetime.now(ZoneInfo('Asia/Ho_Chi_Minh')).isoformat(timespec='seconds')


def timestamp(value):
    if value is None:
        return None
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        raise ValueError('Timestamp must include a UTC offset.')
    return parsed.isoformat()


def text_file(path):
    return Path(path).read_bytes().decode('utf-8')


def load(stream):
    stream.seek(0)
    events, interactions, ids = [], set(), set()
    for index, line in enumerate(stream, 1):
        if not line.endswith('\n'):
            raise ValueError(f'Unterminated event at line {index}; inspect the ledger before continuing.')
        event = json.loads(line)
        if not isinstance(event, dict) or event.get('version') != 1:
            raise ValueError(f'Invalid event at line {index}')
        ident = event['id']
        if ident in ids:
            raise ValueError(f'Duplicate event ID at line {index}')
        ids.add(ident)
        timestamp(event['recorded_at'])
        timestamp(event['occurred_at'])
        kind = event['kind']
        if kind == 'interaction':
            for key in ('tool', 'prompt', 'output', 'source', 'capture'):
                if not isinstance(event[key], str):
                    raise ValueError(f'Invalid {key} at line {index}')
            if not event['tool'].strip() or event['capture'] not in ('complete', 'partial', 'summary'):
                raise ValueError(f'Invalid interaction at line {index}')
            interactions.add(ident)
        elif kind == 'review':
            if event['interaction_id'] not in interactions:
                raise ValueError(f'Orphan review at line {index}')
            if event['decision'] not in ('accepted', 'modified', 'rejected'):
                raise ValueError(f'Invalid decision at line {index}')
            for key in ('reviewer', 'changes', 'source'):
                if not isinstance(event[key], str):
                    raise ValueError(f'Invalid {key} at line {index}')
            if event['decision'] == 'modified' and not isinstance(event['revised_output'], str):
                raise ValueError(f'Missing revised output at line {index}')
        else:
            raise ValueError(f'Unknown event kind at line {index}')
        events.append(event)
    return events


def fence(value):
    runs = [len(x) for x in re.findall(r'`+', value)]
    marker = '`' * max(3, max(runs, default=0) + 1)
    return marker + 'text\n' + value + ('' if value.endswith('\n') else '\n') + marker + '\n'


def export(events):
    interactions = [e for e in events if e['kind'] == 'interaction']
    reviews = [e for e in events if e['kind'] == 'review']
    lines = ['# AI Audit Report\n',
             'Draft declaration for learner confirmation: I use AI tools for the tasks recorded below.\n',
             'Scope: recorded interactions only; session history may be partial. '
             'Unknown timestamps/models and partial or summary captures remain explicit. '
             'Review decisions do not certify execution results.\n',
             f'Interactions: {len(interactions)}; learner review events: {len(reviews)}.\n']
    for item in interactions:
        lines.append(f'## Interaction {item["id"]}\n')
        metadata = {key: item.get(key) or 'Unknown' for key in
                    ('tool', 'model', 'task', 'occurred_at', 'recorded_at', 'source', 'capture')}
        lines += [fence(json.dumps(metadata, ensure_ascii=False, indent=2)),
                  '### Original prompt\n', fence(item['prompt']),
                  '### Original AI output\n', fence(item['output'])]
        linked = [e for e in reviews if e['interaction_id'] == item['id']]
        if not linked:
            lines.append('Pending learner review.\n')
        for review in linked:
            lines.append(f'### Learner review {review["id"]}\n')
            metadata = {key: review.get(key) or 'Unknown' for key in
                        ('reviewer', 'decision', 'occurred_at', 'recorded_at', 'source')}
            lines += [fence(json.dumps(metadata, ensure_ascii=False, indent=2)),
                      'Changes supplied by learner:\n', fence(review['changes'])]
            if review.get('reason') is not None:
                lines += ['Reason supplied by learner:\n', fence(review['reason'])]
            if review.get('revised_output') is not None:
                lines += ['Revised output supplied by learner:\n', fence(review['revised_output'])]
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--log', required=True, type=Path)
    commands = parser.add_subparsers(dest='command', required=True)
    record = commands.add_parser('record', help='Append a visible AI interaction')
    record.add_argument('--tool', required=True)
    record.add_argument('--model')
    record.add_argument('--task')
    record.add_argument('--prompt-file', required=True)
    record.add_argument('--output-file', required=True)
    record.add_argument('--capture', choices=['complete', 'partial', 'summary'], default='partial')
    review = commands.add_parser('review', help='Append actual learner feedback')
    review.add_argument('--interaction-id', required=True)
    review.add_argument('--reviewer', required=True)
    review.add_argument('--decision', choices=['accepted', 'modified', 'rejected'], required=True)
    review.add_argument('--changes-file', required=True)
    review.add_argument('--reason-file')
    review.add_argument('--revised-output-file')
    for subparser in (record, review):
        subparser.add_argument('--occurred-at', help='Evidence-backed ISO time with UTC offset; omit if unknown')
        subparser.add_argument('--source', default='current task; visible content supplied by operator')
    render = commands.add_parser('export', help='Export all recorded events into a new Markdown file')
    render.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    if args.command == 'export':
        with args.log.open('r', encoding='utf-8') as stream:
            fcntl.flock(stream, fcntl.LOCK_SH)
            events = load(stream)
        if not events:
            raise ValueError('No events: cannot declare AI use from an empty log.')
        if args.output.resolve() == args.log.resolve():
            raise ValueError('Export cannot overwrite the event log.')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open('x', encoding='utf-8', newline='\n') as stream:
            stream.write(export(events))
        print(args.output)
        return
    event = dict(version=1, id=str(uuid.uuid4()), kind='interaction' if args.command == 'record' else 'review',
                 recorded_at=now(), occurred_at=timestamp(args.occurred_at), source=args.source)
    if args.command == 'record':
        if not args.tool.strip():
            raise ValueError('Tool must be nonempty.')
        event.update(tool=args.tool, model=args.model, task=args.task, capture=args.capture,
                     prompt=text_file(args.prompt_file), output=text_file(args.output_file))
    else:
        if not args.reviewer.strip():
            raise ValueError('Reviewer must be nonempty.')
        if args.decision == 'modified' and not args.revised_output_file:
            raise ValueError('A modified decision requires --revised-output-file.')
        event.update(interaction_id=args.interaction_id, reviewer=args.reviewer, decision=args.decision,
                     changes=text_file(args.changes_file),
                     reason=text_file(args.reason_file) if args.reason_file else None,
                     revised_output=text_file(args.revised_output_file) if args.revised_output_file else None)
    args.log.parent.mkdir(parents=True, exist_ok=True)
    with args.log.open('a+', encoding='utf-8', newline='\n') as stream:
        fcntl.flock(stream, fcntl.LOCK_EX)
        events = load(stream)
        if args.command == 'review' and not any(e['kind'] == 'interaction' and e['id'] == args.interaction_id for e in events):
            raise ValueError('Interaction ID does not exist.')
        stream.seek(0, 2)
        stream.write(json.dumps(event, ensure_ascii=False) + '\n')
        stream.flush()
    print(event['id'])


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f'Audit error: {error}', file=sys.stderr)
        sys.exit(1)
