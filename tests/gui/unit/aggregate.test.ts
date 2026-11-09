import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateResults, classifyFailure } from '../reporting/aggregate.ts';
import { type RunManifest, type CaseDefinition, type Attempt } from '../contracts.ts';

const baseManifest: RunManifest = {
  runId: 'test-run-1',
  sourceSha256: 'a'.repeat(64),
  buildCommit: '597cf2d',
  dirty: false,
  scope: ['GUI-065', 'GUI-067', 'GUI-028', 'GUI-019'],
  targetIds: ['chrome-local'],
  kind: 'diagnostic',
  startedAt: new Date().toISOString(),
  executionDataPath: 'path/to/data.json',
};

test('chrome_only_requires_no_other_platform', () => {
  const caseDef: CaseDefinition = {
    itemId: 'GUI-019',
    caseId: 'single-h1',
    screen: 'FR-05',
    ia: 'IA-01',
    mode: 'mock-ui',
    required: true,
    targetIds: ['chrome-local'],
    requirementIds: ['FR21-H1-COUNT'],
  };

  const attempt: Attempt = {
    runId: 'test-run-1',
    itemId: 'GUI-019',
    caseId: 'single-h1',
    targetId: 'chrome-local',
    mode: 'mock-ui',
    retry: 0,
    outcome: 'passed',
    actual: 'Single h1 confirmed',
    evidence: [],
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    environment: { browser: 'chrome' },
  };

  const matrix = aggregateResults(baseManifest, [caseDef], [attempt]);
  const itemResult = matrix.items.find(i => i.id === 'GUI-019');
  assert.ok(itemResult);
  assert.equal(itemResult.status, 'Passed');
});

test('confirmed_product_failure_marks_failed', () => {
  const caseDef: CaseDefinition = {
    itemId: 'GUI-067',
    caseId: 'network-retry',
    screen: 'FR-05',
    ia: 'IA-04',
    mode: 'mock-ui',
    required: true,
    targetIds: ['chrome-local'],
    requirementIds: ['USR-NET-RETRY'],
  };

  const failedAttempt: Attempt = {
    runId: 'test-run-1',
    itemId: 'GUI-067',
    caseId: 'network-retry',
    targetId: 'chrome-local',
    mode: 'mock-ui',
    retry: 0,
    outcome: 'assertion-failed',
    failureKind: 'product',
    actual: 'Retry button absent after abort',
    error: 'AssertionError: expected retry button to be visible',
    evidence: ['artifacts/gui/test-run-1/GUI-067-error.png'],
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    environment: { browser: 'chrome' },
  };

  const matrix = aggregateResults(baseManifest, [caseDef], [failedAttempt]);
  const itemResult = matrix.items.find(i => i.id === 'GUI-067');
  assert.ok(itemResult);
  assert.equal(itemResult.status, 'Failed');
  assert.equal(itemResult.evidence_path, 'artifacts/gui/test-run-1/GUI-067-error.png');
});

test('partial_manual_or_missing_target_is_not_run', () => {
  // GUI-065 requires synthetic (mock-ui) AND manual
  const cases: CaseDefinition[] = [
    { itemId: 'GUI-065', caseId: 'ime-synthetic', screen: 'FR-05', ia: 'IA-02', mode: 'mock-ui', required: true, targetIds: ['chrome-local'], requirementIds: [] },
    { itemId: 'GUI-065', caseId: 'ime-manual', screen: 'FR-05', ia: 'IA-02', mode: 'manual', required: true, targetIds: ['chrome-local'], requirementIds: [] },
  ];

  const onlySyntheticAttempt: Attempt = {
    runId: 'test-run-1',
    itemId: 'GUI-065',
    caseId: 'ime-synthetic',
    targetId: 'chrome-local',
    mode: 'mock-ui',
    retry: 0,
    outcome: 'passed',
    actual: 'Synthetic events passed',
    evidence: [],
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    environment: {},
  };

  const matrix = aggregateResults(baseManifest, cases, [onlySyntheticAttempt]);
  const itemResult = matrix.items.find(i => i.id === 'GUI-065');
  assert.ok(itemResult);
  // Manual case is still missing, so item must be Not Run
  assert.equal(itemResult.status, 'Not Run');
});

test('infra_timeout_is_not_product_failure', () => {
  const caseDef: CaseDefinition = {
    itemId: 'GUI-028',
    caseId: 'loading-indicator',
    screen: 'FR-05',
    ia: 'IA-04',
    mode: 'mock-ui',
    required: true,
    targetIds: ['chrome-local'],
    requirementIds: [],
  };

  const timeoutAttempt: Attempt = {
    runId: 'test-run-1',
    itemId: 'GUI-028',
    caseId: 'loading-indicator',
    targetId: 'chrome-local',
    mode: 'mock-ui',
    retry: 0,
    outcome: 'timed-out',
    failureKind: 'infra',
    actual: 'Connection refused',
    error: 'ECONNREFUSED 127.0.0.1:5173',
    evidence: [],
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    environment: {},
  };

  const matrix = aggregateResults(baseManifest, [caseDef], [timeoutAttempt]);
  const itemResult = matrix.items.find(i => i.id === 'GUI-028');
  assert.ok(itemResult);
  assert.equal(itemResult.status, 'Not Run');
});
