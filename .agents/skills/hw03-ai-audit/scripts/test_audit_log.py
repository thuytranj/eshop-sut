import json
from pathlib import Path
import tempfile
import unittest
from audit_log import sync, append_response


class AuditTests(unittest.TestCase):
    def fixture(self, root):
        source = root / 'session.jsonl'
        rows = [
            {'timestamp': '2026-11-08T10:00:00Z', 'type': 'session_meta', 'payload': {'id': 's1', 'cwd': str(root)}},
            {'timestamp': '2026-11-08T10:00:01Z', 'type': 'turn_context', 'payload': {'model': 'known-model'}},
            {'timestamp': '2026-11-08T10:00:02Z', 'type': 'event_msg', 'payload': {'type': 'item_completed', 'item': {'type': 'UserMessage', 'id': 'u1', 'content': [{'type': 'text', 'text': 'Exact prompt\n```\n'}]}}},
            {'timestamp': '2026-11-08T10:00:03Z', 'type': 'response_item', 'payload': {'type': 'reasoning', 'text': 'DO NOT EXPORT'}},
            {'timestamp': '2026-11-08T10:00:04Z', 'type': 'event_msg', 'payload': {'type': 'item_completed', 'item': {'type': 'AgentMessage', 'id': 'a1', 'phase': 'final', 'content': [{'type': 'Text', 'text': '  Raw output\n```\nTiếng Việt\n'}]}}},
        ]
        source.write_text(''.join(json.dumps(r) + '\n' for r in rows), encoding='utf-8')
        return source, root / 'docs/AI-Audit-Report.md'

    def test_raw_text_time_model_and_idempotency(self):
        with tempfile.TemporaryDirectory() as folder:
            source, target = self.fixture(Path(folder))
            self.assertEqual(sync(source, target, Path(folder)), 2)
            output = target.read_text()
            self.assertIn('17:00:04+07:00', output)
            self.assertIn('known-model', output)
            self.assertIn('  Raw output\n```\nTiếng Việt\n', output)
            self.assertNotIn('DO NOT EXPORT', output)
            self.assertEqual(sync(source, target, Path(folder)), 0)
            self.assertEqual(target.read_text(), output)

    def test_wrong_project_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            source, target = self.fixture(Path(folder))
            with self.assertRaises(ValueError):
                sync(source, target, Path(folder) / 'other')
            self.assertFalse(target.exists())

    def test_pending_final_can_be_logged_and_deduplicated(self):
        with tempfile.TemporaryDirectory() as folder:
            source, target = self.fixture(Path(folder))
            append_response(target, 'prompt', 'final exactly\n', 'unknown', '2026-11-08T10:00:00Z', 'manual-1')
            self.assertFalse(append_response(target, 'prompt', 'final exactly\n', 'unknown', '2026-11-08T10:00:00Z', 'manual-1'))
            self.assertIn('final exactly\n', target.read_text())


if __name__ == '__main__':
    unittest.main()
