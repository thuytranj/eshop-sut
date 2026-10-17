"""Read-only checks for FR-03 reports, course fixtures and historical evidence."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import unquote

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    manifest = json.loads((HERE / 'course-suite.json').read_text())
    old_path = (HERE / manifest['historicalSuite']['path']).resolve()
    check(sha(old_path) == manifest['historicalSuite']['sha256'], 'Historical suite changed')
    old = json.loads(old_path.read_text())
    old_by_id = {c['id']: c for c in old}
    check(sha(HERE / manifest['source']) == manifest['sourceSha256'], 'Lecture changed')
    for filename, expected in manifest['protectedEvidenceSha256'].items():
        check(sha(ROOT / filename) == expected, f'Protected evidence changed: {filename}')
    observations = {}
    for layer in ('api', 'web'):
        entries = json.loads((HERE / f'evidence/{layer}/observations.json').read_text())
        for item in entries:
            check(item['caseId'] not in observations, 'Duplicate observation ID')
            observations[item['caseId']] = item
    check(set(observations) == set(old_by_id), 'Historical case/evidence mismatch')
    check(Counter(x['verdict'] for x in observations.values()) ==
          Counter(Passed=27, Failed=20, Blocked=5), 'Historical counts changed')
    groups = {o for c in old for o in c['obligations'] if o.startswith('OBL-DT-')}
    exercised = {o for c in old if observations[c['id']]['verdict'] in ('Passed', 'Failed')
                 for o in c['obligations'] if o.startswith('OBL-DT-')}
    check((len(groups), len(exercised)) == (25, 23), 'DT group coverage mismatch')
    cases = manifest['cases']
    check(len(cases) == 30 and len({c['id'] for c in cases}) == 30, 'Course case IDs')
    for layer in ('API', 'WEB'):
        layer_cases = [c for c in cases if c['layer'] == layer]
        check(len(layer_cases) == 15, f'{layer}: expected 15 unique scenarios')
        obligations = {o['id'] for c in layer_cases for o in c['obligations']}
        check(len(obligations) == 19, f'{layer}: expected 7 core + 12 derived points')
        fingerprints = [json.dumps([c['preconditions'], c['fixture'], c['steps'], c['expected']],
                                   sort_keys=True) for c in layer_cases]
        check(len(set(fingerprints)) == 15, f'{layer}: duplicate scenario')
        for c in layer_cases:
            f = c['fixture']
            p, token = f['newPassword'], f['resetToken']
            check(c['status'] == 'Not Run' and c['evidence'] is None,
                  f'{c["id"]}: refactor invented a fresh execution')
            valid = (len(p) >= 8 and any(x.isupper() for x in p) and
                     any(x.islower() for x in p) and any(x.isdigit() for x in p) and
                     any(x in '@$!%*?&' for x in p) and token == '123456')
            check(valid == c['expected'].startswith('Chấp nhận;'), f'{c["id"]}: oracle')
            for o in c['obligations']:
                kind, number = o['id'].removeprefix('CBVA-').rsplit('-', 1)
                actual = {'LEN': len(p), 'OTP': len(token),
                          'UPPER': sum(x.isupper() for x in p),
                          'LOWER': sum(x.islower() for x in p),
                          'DIGIT': sum(x.isdigit() for x in p),
                          'SPEC': sum(x in '@$!%*?&' for x in p)}[kind]
                check(actual == int(number), f'{c["id"]}: fixture does not cover {o["id"]}')
            if layer == 'API':
                historical = old_by_id[c['historicalCaseId']]
                check(f == historical['fixture'], f'{c["id"]}: historical fixture mismatch')
                observed = observations[historical['id']]
                check(observed['request']['body'] == f, f'{c["id"]}: request mismatch')
                for account in ('userA', 'userB'):
                    check(observed['stateBefore'][account]['password'] == 'OldPass1!',
                          f'{c["id"]}: fixture reset mismatch')
                changed = (observed['stateAfter']['userA']['password'] != 'OldPass1!')
                accepted = (observed['response']['status'] == 200 and changed)
                check(observed['stateAfter']['userB']['password'] == 'OldPass1!',
                      f'{c["id"]}: historical B integrity mismatch')
                expected_verdict = 'Passed' if accepted == valid else 'Failed'
                check(expected_verdict == c['historicalReuse']['recordedVerdict'],
                      f'{c["id"]}: historical verdict incompatible with course oracle')
            else:
                check(f['confirmPassword'] == p and c['historicalCaseId'] is None,
                      f'{c["id"]}: WEB must remain a separate unexecuted scenario')
    # Check portable current document links. Archives are explicitly original historical text.
    for doc in HERE.glob('*.md'):
        text = doc.read_text()
        check('file:///' not in text, f'{doc.name}: broken file URI')
        for target in re.findall(r'\]\(([^)]+)\)', text):
            if '://' in target or target.startswith('#'):
                continue
            path = unquote(target.split('#')[0])
            check((doc.parent / path).exists(), f'{doc.name}: missing link {target}')
    gap = (HERE / 'ai-gap-analysis.md').read_text()
    critique = gap.split('## 3. AI Critique', 1)[1].split('\n\n', 1)[1].split('\n\nSố từ', 1)[0]
    check(200 <= len(critique.split()) <= 300, 'Critique must contain 200–300 words')
    print('PASS: source/suite/evidence hashes; 52 historical cases (27/20/5);')
    print('      23/25 DT groups; 30 new designs, 19 points per layer;')
    print('      fixtures/oracles/reuse, portable links and 200–300-word critique.')
    print('No SUT execution performed.')


if __name__ == '__main__':
    main()
