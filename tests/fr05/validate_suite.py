"""Validate FR05 traceability and reconcile observations; never derive SUT verdicts."""
import argparse
from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCENARIO = ('interface', 'platform', 'preconditions', 'fixtureId', 'input', 'steps', 'expected')


def validate_suite(suite, observations=None):
    errors = []
    cases, sources, obligations = (suite[k] for k in ('cases', 'sourceCases', 'obligations'))
    for name, rows in [('case', cases), ('source', sources), ('obligation', obligations)]:
        counts = Counter(r['id'] for r in rows)
        errors.extend(f'duplicate {name} {i}' for i, n in counts.items() if n > 1)
    smap = {r['id']: r for r in sources}
    omap = {r['id']: r for r in obligations}
    rules = set(suite['rules'])
    mapped_sources, mapped_obligations = set(), set()
    for c in cases:
        for field in SCENARIO + ('id', 'sourceCaseIds', 'techniques', 'obligationIds', 'ruleIds'):
            if field not in c:
                errors.append(f'{c.get("id")} missing {field}')
        if not set(c.get('ruleIds', [])) <= rules:
            errors.append(f'{c["id"]} unknown rule')
        if not c.get('sourceCaseIds'):
            errors.append(f'{c["id"]} missing source')
        expected_o, expected_t, expected_r = set(), set(), set()
        for sid in c.get('sourceCaseIds', []):
            mapped_sources.add(sid)
            source = smap.get(sid)
            if source is None:
                errors.append(f'unknown source {sid}')
                continue
            if any(c.get(f) != source.get(f) for f in SCENARIO):
                errors.append(f'{c["id"]} scenario mismatch source {sid}')
            expected_o.update(source['obligationIds'])
            expected_t.add(source['technique'])
            expected_r.update(source['ruleIds'])
        if set(c.get('obligationIds', [])) != expected_o:
            errors.append(f'{c["id"]} obligation mapping mismatch {sorted(expected_o)}')
        if set(c.get('techniques', [])) != expected_t:
            errors.append(f'{c["id"]} technique mismatch')
        if set(c.get('ruleIds', [])) != expected_r:
            errors.append(f'{c["id"]} rule mapping mismatch')
        for oid in c.get('obligationIds', []):
            mapped_obligations.add(oid)
            o = omap.get(oid)
            if o is None:
                errors.append(f'unknown obligation {oid}')
            elif o['interface'] != c['interface'] or o['technique'] not in c['techniques']:
                errors.append(f'{oid} interface/technique mismatch')
    exclusions = {x['sourceCaseId'] for x in suite.get('exclusions', []) if x.get('reason')}
    errors.extend(f'orphan source {i}' for i in set(smap) - mapped_sources - exclusions)
    errors.extend(f'orphan obligation {i}' for i in set(omap) - mapped_obligations)
    for s in sources:
        if s.get('status') != 'Not Run' or s.get('actual') is not None:
            errors.append(f'source baseline changed {s["id"]}')
        for oid in s['obligationIds']:
            if oid not in omap or s['id'] not in omap[oid]['sourceCaseIds']:
                errors.append(f'source obligation backreference {s["id"]} {oid}')
    if sorted(o.get('value') for o in obligations if o['technique'] == 'BVA') != [0, 1, 2]:
        errors.append('BVA values must retain 0,1,2')
    if observations is not None:
        cmap = {c['id']: c for c in cases}
        counts = Counter((o.get('runId'), o.get('caseId')) for o in observations)
        errors.extend(f'duplicate observation {key}' for key, n in counts.items() if n > 1)
        present = {o.get('caseId') for o in observations}
        errors.extend(f'missing observation {i}' for i in set(cmap) - present)
        errors.extend(f'unknown observation {i}' for i in present - set(cmap))
        if len({o.get('runId') for o in observations}) != 1:
            errors.append('one runId required per observation file')
        for o in observations:
            cid = o.get('caseId')
            c = cmap.get(cid)
            if c and (o.get('interface') != c['interface'] or o.get('platform') != c['platform']):
                errors.append(f'{cid} interface/platform mismatch')
            status = o.get('status')
            if status not in ('Passed', 'Failed', 'Blocked', 'Not Run'):
                errors.append(f'{cid} unknown status')
            if status in ('Passed', 'Failed'):
                if not o.get('actual') or not o.get('assertions'):
                    errors.append(f'{cid} verdict needs actual and assertions')
                flags = [a.get('passed') for a in o.get('assertions', [])]
                if not flags or any(type(f) is not bool for f in flags):
                    errors.append(f'{cid} assertions need boolean passed')
                elif (status == 'Passed') != all(flags):
                    errors.append(f'{cid} status contradicts assertions')
                if c and c['expected']['oracleKind'] == 'unresolved':
                    errors.append(f'{cid} unresolved oracle has verdict')
            if status == 'Blocked' and not o.get('reason'):
                errors.append(f'{cid} blocked reason missing')
            if status != 'Not Run' and not o.get('evidence'):
                errors.append(f'{cid} evidence missing')
            for f in o.get('evidence', []):
                path = (ROOT / f).resolve()
                if not path.is_relative_to(ROOT) or not path.is_file():
                    errors.append(f'{cid} evidence missing or outside repository: {f}')
    return {'errors': sorted(set(errors)), 'stats': {'canonical': len(cases), 'sources': len(sources),
            'native': sum(c['interface'] == 'NATIVE' for c in cases),
            'api': sum(c['interface'] == 'API' for c in cases), 'obligations': len(obligations)}}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--suite', required=True)
    parser.add_argument('--observations')
    args = parser.parse_args()
    try:
        result = validate_suite(json.loads(Path(args.suite).read_text()),
                                json.loads(Path(args.observations).read_text()) if args.observations else None)
    except (ValueError, KeyError, TypeError) as exc:
        result = {'errors': [f'invalid schema: {exc}']}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(bool(result['errors']))
