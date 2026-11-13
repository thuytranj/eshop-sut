"""Check structural coverage; source completeness still needs human review."""
import argparse
import csv
import json
import re
from collections import Counter

ASPECTS = {f'IA-0{i}' for i in range(1, 5)}


def validate(items, requirements):
    errors = []
    inventory = {}
    for r in requirements:
        rid = r.get('requirement_id', '').strip()
        if not rid or rid in inventory:
            errors.append(f'Duplicate or empty requirement ID: {rid}')
        inventory[rid] = r
        if r.get('ia') not in ASPECTS:
            errors.append(f'{rid}: invalid IA')
        if r.get('applicable') not in ('yes', 'no'):
            errors.append(f'{rid}: applicable must be yes/no')
        if r.get('applicable') == 'no' and not r.get('reason', '').strip():
            errors.append(f'{rid}: non-applicable requirement needs reason')
    if len(items) < 41:
        errors.append('Checklist must contain at least 41 items')
    covered, groups, ids, checks = set(), set(), set(), set()
    for row in items:
        iid = row.get('id', '').strip()
        if not iid or iid in ids:
            errors.append(f'Duplicate or empty item ID: {iid}')
        ids.add(iid)
        ia = row.get('ia', '')
        groups.add(ia)
        if ia not in ASPECTS:
            errors.append(f'{iid}: invalid IA {ia}')
        for key in ('screen', 'check', 'expected'):
            if not row.get(key, '').strip():
                errors.append(f'{iid}: missing {key}')
        signature = tuple(re.sub(r'\s+', ' ', row.get(k, '')).strip().casefold() for k in ('screen', 'check', 'expected'))
        if signature in checks:
            errors.append(f'Duplicate check: {iid}')
        checks.add(signature)
        if row.get('origin') not in ('AI', 'Human'):
            errors.append(f'{iid}: origin must be AI/Human')
        if row.get('origin') == 'Human' and not row.get('addition_reason', '').strip():
            errors.append(f'{iid}: Human item needs addition_reason')
        refs = [r.strip() for r in row.get('requirement_ids', '').split(';') if r.strip()]
        if not refs:
            errors.append(f'{iid}: missing requirement_ids')
        for rid in refs:
            req = inventory.get(rid)
            if req is None:
                errors.append(f'{iid}: unknown requirement {rid}')
            elif req.get('ia') != ia or req.get('applicable') != 'yes':
                errors.append(f'{iid}: IA/applicability mismatch for {rid}')
            else:
                covered.add(rid)
    for ia in sorted(ASPECTS - groups):
        errors.append(f'Missing aspect: {ia}')
    for rid, req in inventory.items():
        if req.get('applicable') == 'yes' and rid not in covered:
            errors.append(f'Uncovered requirement: {rid}')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('checklist')
    parser.add_argument('requirements')
    args = parser.parse_args()
    def read(path):
        with open(path, encoding='utf-8-sig', newline='') as stream:
            return list(csv.DictReader(stream))
    items, requirements = read(args.checklist), read(args.requirements)
    errors = validate(items, requirements)
    print(json.dumps({'items': len(items), 'aspect_counts': dict(Counter(r.get('ia') for r in items)), 'errors': errors, 'semantic_review_required': True}, ensure_ascii=False, indent=2))
    return int(bool(errors))


if __name__ == '__main__':
    raise SystemExit(main())
