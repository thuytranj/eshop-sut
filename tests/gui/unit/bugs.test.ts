import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { buildBugCandidates } from '../reporting/bugs.ts';
import { exportIssueDrafts } from '../reporting/export-issues.ts';
import { type RunMatrix } from '../contracts.ts';

const mockMatrix: RunMatrix = {
  manifest: {
    runId: 'run-1',
    sourceSha256: 'a'.repeat(64),
    buildCommit: '597cf2d',
    dirty: false,
    scope: ['GUI-019', 'GUI-030'],
    targetIds: ['chrome-local'],
    kind: 'qualification',
    startedAt: new Date().toISOString(),
    executionDataPath: '',
  },
  cases: [
    { itemId: 'GUI-019', caseId: 'single-h1', screen: 'FR-05', ia: 'IA-01', mode: 'mock-ui', required: true, targetIds: ['chrome-local'], requirementIds: ['FR21-H1-COUNT'] },
    { itemId: 'GUI-030', caseId: 'image-alt', screen: 'FR-05', ia: 'IA-04', mode: 'mock-ui', required: true, targetIds: ['chrome-local'], requirementIds: ['USR-IMG-ALT'] },
  ],
  attempts: [
    {
      runId: 'run-1',
      itemId: 'GUI-019',
      caseId: 'single-h1',
      targetId: 'chrome-local',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'assertion-failed',
      failureKind: 'product',
      actual: 'Expected 1 h1 tag, found 2',
      error: 'AssertionError: expected 1 h1, found 2',
      evidence: ['artifacts/gui/run-1/error-019.png'],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
    {
      runId: 'run-1',
      itemId: 'GUI-030',
      caseId: 'image-alt',
      targetId: 'chrome-local',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'assertion-failed',
      failureKind: 'product',
      actual: 'Image #0 has empty alt',
      error: 'AssertionError: alt is empty',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
  ],
  items: [
    {
      id: 'GUI-019',
      status: 'Failed',
      actual_result: 'Expected 1 h1 tag, found 2',
      notes: 'notes',
      evidence_path: 'artifacts/gui/run-1/error-019.png',
    },
    {
      id: 'GUI-030',
      status: 'Failed',
      actual_result: 'Image #0 has empty alt',
      notes: 'notes',
      evidence_path: '',
    },
  ],
};

test('different_expected_failures_are_not_merged', () => {
  const bugs = buildBugCandidates(mockMatrix);
  assert.equal(bugs.length, 2);
  assert.equal(bugs[0].key, 'BUG-GUI-019');
  assert.equal(bugs[1].key, 'BUG-GUI-030');
});

test('blocked_is_not_a_bug', () => {
  const matrixWithBlocked: RunMatrix = {
    ...mockMatrix,
    items: [
      { id: 'GUI-001', status: 'Not Run', actual_result: 'Blocked before assertion: server down', notes: '', evidence_path: '' },
    ],
  };
  const bugs = buildBugCandidates(matrixWithBlocked);
  assert.equal(bugs.length, 0);
});

test('checklist_extension_keeps_its_source', () => {
  const bugs = buildBugCandidates(mockMatrix);
  const bug030 = bugs.find(b => b.key === 'BUG-GUI-030');
  assert.ok(bug030);
  assert.equal(bug030.basis, 'checklist-extension');

  const bug019 = bugs.find(b => b.key === 'BUG-GUI-019');
  assert.ok(bug019);
  assert.equal(bug019.basis, 'README');
});

test('rerun_export_does_not_duplicate', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bugs-export-'));
  try {
    const bugs = buildBugCandidates(mockMatrix);
    const firstExport = await exportIssueDrafts(bugs, tmpDir);
    assert.equal(firstExport.markdownPaths.length, 2);

    const secondExport = await exportIssueDrafts(bugs, tmpDir);
    assert.equal(secondExport.markdownPaths.length, 2);
    const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.md'));
    assert.equal(files.length, 2);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
