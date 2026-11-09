import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../playwright.config.ts';

test('project_identity_is_explicit', () => {
  assert.deepEqual(config.projects?.map(p => p.name), ['chrome-local']);
  assert.equal(config.projects?.find(p => p.name === 'chrome-local')?.use?.channel, 'chrome');
});

test('failure_evidence_enabled', () => {
  assert.deepEqual(config.use?.screenshot, { mode: 'only-on-failure', fullPage: true });
  assert.equal(config.use?.trace, 'retain-on-failure');
});

test('no_automatic_expected_failures', () => {
  assert.equal(config.retries, 0);
});
