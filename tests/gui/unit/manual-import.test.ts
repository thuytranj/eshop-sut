import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { importManualResults } from '../runner/import-manual.ts';
import { type RunManifest } from '../contracts.ts';

const baseManifest: RunManifest = {
  runId: 'test-run-1',
  sourceSha256: 'a'.repeat(64),
  buildCommit: '597cf2d',
  dirty: false,
  scope: ['GUI-065'],
  targetIds: ['chrome-local'],
  kind: 'qualification',
  startedAt: new Date().toISOString(),
  executionDataPath: '',
};

test('rejects_manual_evidence_from_wrong_build', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manual-test-'));
  const jsonPath = path.join(tmpDir, 'manual.json');

  const invalidData = [
    {
      itemId: 'GUI-065',
      caseId: 'ime-manual',
      mode: 'manual',
      reviewer: 'QA Lead',
      device: 'MacBook Pro',
      tool: 'macOS Telex',
      environment: { buildCommit: 'wrong-sha-000' },
      outcome: 'passed',
      actual: 'Passed typing',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    },
  ];

  fs.writeFileSync(jsonPath, JSON.stringify(invalidData), 'utf-8');

  try {
    await assert.rejects(
      async () => {
        await importManualResults(jsonPath, baseManifest);
      },
      /mismatch with manifest/
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
