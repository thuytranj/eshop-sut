import unittest
from validate_checklist import validate


class CoverageTests(unittest.TestCase):
    def fixture(self):
        requirements = [dict(requirement_id=f'R{i}', ia=f'IA-0{i}', applicable='yes', reason='') for i in range(1, 5)]
        items = [dict(id=f'GUI-{i}', ia=f'IA-0{i % 4 + 1}', requirement_ids=f'R{i % 4 + 1}', screen='Cart', check=f'Observable check {i}', expected=f'Expected {i}', origin='AI', addition_reason='') for i in range(41)]
        return items, requirements

    def test_complete_matrix(self):
        self.assertEqual(validate(*self.fixture()), [])

    def test_missing_group_and_uncovered_requirement(self):
        items, requirements = self.fixture()
        items = [x for x in items if x['ia'] != 'IA-04']
        errors = '\n'.join(validate(items, requirements))
        self.assertIn('IA-04', errors)
        self.assertIn('R4', errors)
        self.assertIn('41', errors)

    def test_duplicates_and_missing_human_reason(self):
        items, requirements = self.fixture()
        items[-1] = dict(items[0], origin='Human')
        errors = '\n'.join(validate(items, requirements))
        self.assertIn('Duplicate', errors)
        self.assertIn('addition_reason', errors)

    def test_na_needs_reason_and_unknown_reference(self):
        items, requirements = self.fixture()
        requirements[0]['applicable'] = 'no'
        items[0]['requirement_ids'] = 'UNKNOWN'
        errors = '\n'.join(validate(items, requirements))
        self.assertIn('reason', errors)
        self.assertIn('UNKNOWN', errors)


if __name__ == '__main__':
    unittest.main()
