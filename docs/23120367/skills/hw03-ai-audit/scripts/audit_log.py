"""Append visible prompt/generation events to a Markdown AI audit report."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
from zoneinfo import ZoneInfo

HEADER = '''# AI Audit Report

Declaration: I use AI tools for the following tasks, as recorded below.

This report preserves available user prompts and visible AI generations (including
commentary and finals). Tool traces stay in the original session files. Private
reasoning and system/developer instructions are excluded. Attachments are referenced,
not reconstructed. Scope is limited to imported sessions; future messages require
another sync. All report times use Asia/Ho_Chi_Minh (UTC+07:00).

'''


def fence(text):
    runs = [len(m.group()) for m in re.finditer(r'`+', text)]
    delimiter = '`' * max(3, max(runs, default=0) + 1)
    return delimiter + 'text\n' + text + '\n' + delimiter + '\n'


def append_entry(target, entry):
    target = Path(target)
    marker = '<!-- audit-event:' + hashlib.sha256(entry['id'].encode()).hexdigest() + ' -->'
    existing = target.read_text(encoding='utf-8') if target.exists() else ''
    if marker in existing:
        return False
    raw_time = entry['timestamp']
    if raw_time == 'unknown':
        day = clock = utc = 'unknown (source timestamp unavailable)'
    else:
        instant = datetime.fromisoformat(raw_time.replace('Z', '+00:00'))
        if instant.tzinfo is None:
            raise ValueError('Event timestamp must include timezone')
        local = instant.astimezone(ZoneInfo('Asia/Ho_Chi_Minh'))
        day, clock = local.date().isoformat(), local.isoformat().split('T', 1)[1]
        utc = instant.astimezone(timezone.utc).isoformat()
    output = entry.get('output')
    body = (
        f"\n{marker}\n## {entry['kind']} | {entry['id']}\n\n"
        f"- Date: {day}\n- Time: {clock}\n- Event timestamp UTC: {utc}\n"
        f"- Model identity: {entry['model']}\n- Source: {entry['source']}\n"
        f"- Imported at UTC: {datetime.now(timezone.utc).isoformat()}\n\n"
        '### Input prompt (raw text)\n\n' + fence(entry['prompt']) + '\n'
        '### Raw generation output\n\n' + (fence(output) if output is not None else 'Pending at this input event; see subsequent generation entries.\n')
    )
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('a', encoding='utf-8', newline='') as stream:
        if not existing:
            stream.write(HEADER)
        stream.write(body)
    return True


def text_content(content):
    texts, attachments = [], []
    for block in content:
        if isinstance(block, dict) and isinstance(block.get('text'), str):
            texts.append(block['text'])
        elif isinstance(block, dict):
            # Preserve references without copying base64 media into Markdown.
            attachments.append({k: v for k, v in block.items() if k in ('type', 'path', 'url') and not str(v).startswith('data:')})
    return '\n\n'.join(texts), attachments


def sync(source, target, project_root):
    source, root = Path(source), Path(project_root).resolve()
    rows = []
    lines = source.read_text(encoding='utf-8').splitlines()
    for i, line in enumerate(lines):
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            if i != len(lines) - 1:
                raise ValueError(f'Malformed session record at line {i + 1}')
            # An active session can have one unfinished tail record.
    metas = [r.get('payload', {}) for r in rows if r.get('type') == 'session_meta']
    if not metas or Path(metas[0].get('cwd', '')).resolve() != root:
        raise ValueError('Source session does not belong to this project')
    session = metas[0].get('id', source.name)
    model, prompt, count, eligible = 'unknown', '', 0, 0
    for row in rows:
        payload = row.get('payload', {})
        if row.get('type') == 'turn_context':
            model = payload.get('model') or 'unknown'
        if row.get('type') != 'event_msg' or payload.get('type') != 'item_completed':
            continue
        item = payload.get('item', {})
        kind = item.get('type')
        if kind not in ('UserMessage', 'AgentMessage'):
            continue
        eligible += 1
        text, attachments = text_content(item.get('content', []))
        if kind == 'UserMessage':
            prompt = text
        # Do not silently replace a missing output with an empty successful generation.
        if kind == 'AgentMessage' and not text and attachments:
            text = '[Non-text generation: see attachment references in source.]'
        item_id = item.get('id')
        if not item_id:
            raise ValueError('Visible message is missing its stable source ID')
        source_info = f'{source.name}; session {session}; metadata model; event timestamp'
        if attachments:
            source_info += '; attachment references: ' + json.dumps(attachments, ensure_ascii=False)
        count += append_entry(target, {
            'id': f'{session}/{item_id}', 'kind': 'Input' if kind == 'UserMessage' else f"Generation ({item.get('phase', 'unspecified')})",
            'timestamp': row.get('timestamp') or 'unknown', 'model': model,
            'source': source_info, 'prompt': prompt,
            'output': text if kind == 'AgentMessage' else None,
        })
    if not eligible:
        raise ValueError('Unsupported/empty export: no visible message events found')
    return count


def append_response(target, prompt, output, model, timestamp, event_id):
    return append_entry(target, {'id': event_id, 'kind': 'Generation (prepared/exported)', 'timestamp': timestamp, 'model': model or 'unknown', 'source': 'Explicit raw files supplied by agent; preparation/export time, not delivery confirmation', 'prompt': prompt, 'output': output})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    imp = commands.add_parser('sync', help='Import visible events from a matching Codex session')
    imp.add_argument('--source', required=True, type=Path)
    imp.add_argument('--project-root', type=Path, default=Path.cwd())
    imp.add_argument('--report', type=Path, default=Path('docs/AI-Audit-Report.md'))
    add = commands.add_parser('append', help='Append exact prompt/output files with explicit metadata')
    for field in ('prompt-file', 'output-file', 'model', 'event-time', 'event-id'):
        add.add_argument('--' + field, required=True)
    add.add_argument('--report', type=Path, default=Path('docs/AI-Audit-Report.md'))
    args = parser.parse_args()
    try:
        if args.command == 'sync':
            count = sync(args.source, args.report, args.project_root)
        else:
            count = int(append_response(args.report, Path(args.prompt_file).read_text(encoding='utf-8'), Path(args.output_file).read_text(encoding='utf-8'), args.model, args.event_time, args.event_id))
    except (ValueError, OSError) as error:
        parser.exit(1, f'Audit error: {error}\n')
    print(json.dumps({'appended_events': count, 'report': str(args.report)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
