import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import {
  calculateBudgetEstimate,
  freezeQualificationInput,
  computeFileSha256,
} from '../cross-platform/qualification-freeze.js';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');

test('budget_estimate_calculates_from_pilot_measurements', () => {
  const estimate = calculateBudgetEstimate();
  assert.equal(estimate.measuredSessions, 12);
  assert.ok(estimate.totalEstimatedMinutes > 150, 'Estimate should be realistic (~3 hours)');
  assert.equal(estimate.parallelSessionsMaxAllowed, 1);
  assert.ok(estimate.perPlatformSeconds['p1-chrome-win11'] > 0);
  assert.ok(estimate.perPlatformSeconds['p2-firefox-win11'] > 0);
  assert.ok(estimate.perPlatformSeconds['p3-android-chrome'] > 0);
});

test('freeze_qualification_input_captures_all_required_provenance', () => {
  const tempOut = path.join(REPO_ROOT, 'artifacts/gui/cross-platform/test-freeze');
  const freeze = freezeQualificationInput({
    repoRoot: REPO_ROOT,
    runId: 'test-qual-01',
    outDir: tempOut,
  });

  assert.equal(freeze.runId, 'test-qual-01');
  assert.ok(freeze.harness.gitSha.length >= 7);
  assert.equal(typeof freeze.harness.isDirty, 'boolean');
  assert.ok(freeze.sut.backendContentDigest.length === 64);
  assert.ok(freeze.sut.frontendWebContentDigest.length === 64);
  assert.ok(freeze.sut.frontendAdminContentDigest.length === 64);
  assert.equal(freeze.checklist.itemCount, 70);
  assert.ok(freeze.checklist.sha256.length === 64);
  assert.ok(freeze.budgetEstimate.totalEstimatedMinutes > 0);

  const written = JSON.parse(fs.readFileSync(path.join(tempOut, 'qualification-freeze.json'), 'utf8'));
  assert.equal(written.runId, 'test-qual-01');

  // Cleanup test-freeze
  fs.rmSync(tempOut, { recursive: true, force: true });
});
