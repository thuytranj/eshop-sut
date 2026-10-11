"""Behavior checks for the audit CLI; all evidence here is synthetic."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('audit.py')


class AuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.log = self.root / 'audit.jsonl'
        self.prompt = self.root / 'prompt.txt'
        self.output = self.root / 'output.txt'
        self.prompt.write_text('Giá > 0?\n', encoding='utf-8')
        self.output.write_text('AI says accept 0\n```text\nPASS\n```\n', encoding='utf-8')

    def cli(self, *args, ok=True):
        result = subprocess.run([sys.executable, str(SCRIPT), '--log', str(self.log), *args],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode == 0, ok, result.stderr)
        return result

    def record(self, *args):
        return self.cli('record', '--tool', 'Codex', '--prompt-file', str(self.prompt),
                        '--output-file', str(self.output), *args).stdout.strip()

    def test_exact_content_and_unknown_occurrence(self):
        self.output.write_bytes(b'original\r\nline two\r\n')
        self.record()
        event = json.loads(self.log.read_text())
        self.assertEqual(event['prompt'], self.prompt.read_text())
        self.assertEqual(event['output'], self.output.read_bytes().decode('utf-8'))
        self.assertIsNone(event['occurred_at'])
        self.assertIsNone(event['model'])
        self.assertTrue(event['recorded_at'].endswith('+07:00'))

    def test_review_preserves_original_and_history(self):
        ident = self.record('--occurred-at', '2026-10-11T15:00:00+07:00')
        original = self.log.read_bytes()
        change = self.root / 'changes.txt'
        change.write_text('Learner: Reject at 0; Not Run', encoding='utf-8')
        self.cli('review', '--interaction-id', ident, '--reviewer', 'Student',
                 '--decision', 'rejected', '--changes-file', str(change))
        self.assertTrue(self.log.read_bytes().startswith(original))
        self.assertEqual(len(self.log.read_text().splitlines()), 2)
        self.assertEqual(json.loads(self.log.read_text().splitlines()[0])['output'], self.output.read_text())

    def test_modified_review_requires_revised_output(self):
        ident = self.record()
        self.cli('review', '--interaction-id', ident, '--reviewer', 'Student',
                 '--decision', 'modified', '--changes-file', str(self.prompt), ok=False)
        self.assertEqual(len(self.log.read_text().splitlines()), 1)

    def test_invalid_timestamp_does_not_write(self):
        self.cli('record', '--tool', 'Codex', '--prompt-file', str(self.prompt),
                 '--output-file', str(self.output), '--occurred-at', '2026-10-11T12:00:00', ok=False)
        self.assertFalse(self.log.exists())

    def test_export_handles_fences_and_pending_review(self):
        self.record()
        report = self.root / 'appendix.md'
        self.cli('export', '--output', str(report))
        body = report.read_text()
        self.assertIn('````text\n' + self.output.read_text() + '````', body)
        self.assertIn('Pending learner review', body)
        self.assertIn('Draft declaration for learner confirmation', body)
        self.assertIn('Unknown', body)
        self.assertIn('partial', body.lower())
        self.cli('export', '--output', str(report), ok=False)

    def test_orphan_review_and_corrupt_ledger_fail(self):
        self.cli('review', '--interaction-id', 'absent', '--reviewer', 'Student',
                 '--decision', 'accepted', '--changes-file', str(self.prompt), ok=False)
        self.log.write_text('{broken\n', encoding='utf-8')
        previous = self.log.read_bytes()
        self.cli('record', '--tool', 'Codex', '--prompt-file', str(self.prompt),
                 '--output-file', str(self.output), ok=False)
        self.assertEqual(self.log.read_bytes(), previous)

    def test_modified_output_and_repeat_review_export(self):
        ident = self.record()
        revised = self.root / 'revised.txt'
        revised.write_text('Reject at 0; Not Run', encoding='utf-8')
        for decision in ('modified', 'accepted'):
            args = ['review', '--interaction-id', ident, '--reviewer', 'Student',
                    '--decision', decision, '--changes-file', str(self.prompt)]
            if decision == 'modified':
                args += ['--revised-output-file', str(revised)]
            self.cli(*args)
        report = self.root / 'appendix.md'
        self.cli('export', '--output', str(report))
        self.assertIn('Reject at 0; Not Run', report.read_text())
        self.assertEqual(len(self.log.read_text().splitlines()), 3)

    def test_unterminated_ledger_is_preserved(self):
        self.record()
        self.log.write_bytes(self.log.read_bytes().rstrip(b'\n'))
        before = self.log.read_bytes()
        self.cli('record', '--tool', 'Codex', '--prompt-file', str(self.prompt),
                 '--output-file', str(self.output), ok=False)
        self.assertEqual(self.log.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
