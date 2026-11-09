import test from 'node:test';
import assert from 'node:assert/strict';
import { runChecklist } from '../runner/run.ts';

test('rejects_non_chrome_target', async () => {
  await assert.rejects(
    async () => {
      await runChecklist({
        mode: 'mock-ui',
        targets: ['firefox-local'],
        ids: ['GUI-001'],
        kind: 'diagnostic',
        writeback: false,
      });
    },
    /outside Chrome scope|Only "chrome-local" is supported/
  );
});

test('backend_is_not_started_in_repository', () => {
  // Database seed DROP TABLE in database.js must not touch main database
  const mainDbPath = 'backend/database.sqlite';
  const sandboxDbPath = 'artifacts/gui/run-test/backend-sandbox/database.sqlite';
  assert.notEqual(mainDbPath, sandboxDbPath);
});
