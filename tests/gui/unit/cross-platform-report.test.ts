import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readChecklist } from '../checklist/excel-store.js';
import { getCaseCatalog } from '../checklist/case-catalog.js';
import {
  buildPlatformMatrix,
  renderComparison,
  renderCrossPlatformIssue,
} from '../cross-platform/report.js';
import type { Attempt, EvidenceRecord } from '../cross-platform/types.js';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const SOURCE_WORKBOOK = path.join(REPO_ROOT, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

test('chrome_pass_does_not_pass_missing_firefox_android', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const targetIds = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  // No attempts -> exactly 210 Not Run cells
  const emptyCells = buildPlatformMatrix(items, cases, [], []);
  assert.equal(emptyCells.length, 210);
  assert.equal(emptyCells.filter(c => c.status === 'Not Run').length, 210);
  assert.equal(new Set(emptyCells.map(c => `${c.itemId}/${c.platformId}`)).size, 210);

  // P1 Passed attempt for GUI-001
  const p1Attempts: Attempt[] = [
    {
      runId: 'run-1',
      itemId: 'GUI-001',
      caseId: 'lang-check',
      targetId: 'p1-chrome-win11',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'passed',
      actual: 'Passed verification',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
  ];

  const cells = buildPlatformMatrix(items, cases, p1Attempts, []);

  const p1Cell = cells.find(c => c.itemId === 'GUI-001' && c.platformId === 'p1-chrome-win11');
  const p2Cell = cells.find(c => c.itemId === 'GUI-001' && c.platformId === 'p2-firefox-win11');
  const p3Cell = cells.find(c => c.itemId === 'GUI-001' && c.platformId === 'p3-android-chrome');

  assert.equal(p1Cell?.status, 'Passed');
  assert.equal(p2Cell?.status, 'Not Run');
  assert.equal(p3Cell?.status, 'Not Run');
});

test('infra_assertion_is_not_product_failure', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const targetIds = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  const infraAttempt: Attempt[] = [
    {
      runId: 'run-1',
      itemId: 'GUI-002',
      caseId: 'button-color',
      targetId: 'p1-chrome-win11',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'timed-out',
      failureKind: 'infra',
      actual: 'WebSocket connection closed abruptly by cloud host',
      error: 'WebSocket timeout',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
  ];

  const cells = buildPlatformMatrix(items, cases, infraAttempt, []);
  const cell = cells.find(c => c.itemId === 'GUI-002' && c.platformId === 'p1-chrome-win11');

  // Infra failure must NOT be classified as confirmed product failure (remains Not Run with reason)
  assert.equal(cell?.status, 'Not Run');
  assert.ok(cell?.reason.includes('WebSocket') || cell?.reason.includes('infra'));
});

test('partial_manual_keeps_not_run', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const targetIds = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  // GUI-065 has automated ime-synthetic AND manual ime-manual
  const syntheticOnlyAttempt: Attempt[] = [
    {
      runId: 'run-1',
      itemId: 'GUI-065',
      caseId: 'ime-synthetic',
      targetId: 'p1-chrome-win11',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'passed',
      actual: 'Synthetic IME passed',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
  ];

  const cells = buildPlatformMatrix(items, cases, syntheticOnlyAttempt, []);
  const cell = cells.find(c => c.itemId === 'GUI-065' && c.platformId === 'p1-chrome-win11');

  // Since manual case is still missing, status must remain Not Run
  assert.equal(cell?.status, 'Not Run');
  assert.ok(cell?.reason.includes('ime-manual'));
});

test('identical_three_platform_bug_is_shared', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const targetIds = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  const sharedBugAttempts: Attempt[] = [
    {
      runId: 'run-1',
      itemId: 'GUI-018',
      caseId: 'currency-format',
      targetId: 'p1-chrome-win11',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'assertion-failed',
      failureKind: 'product',
      actual: 'Expected ₫, found VND',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
    {
      runId: 'run-1',
      itemId: 'GUI-018',
      caseId: 'currency-format',
      targetId: 'p2-firefox-win11',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'assertion-failed',
      failureKind: 'product',
      actual: 'Expected ₫, found VND',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
    {
      runId: 'run-1',
      itemId: 'GUI-018',
      caseId: 'currency-format',
      targetId: 'p3-android-chrome',
      mode: 'mock-ui',
      retry: 0,
      outcome: 'assertion-failed',
      failureKind: 'product',
      actual: 'Expected ₫, found VND',
      evidence: [],
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      environment: {},
    },
  ];

  const cells = buildPlatformMatrix(items, cases, sharedBugAttempts, []);
  const issueDraft = renderCrossPlatformIssue(cells, 'GUI-018');

  assert.ok(issueDraft.includes('p1-chrome-win11: Failed'));
  assert.ok(issueDraft.includes('p2-firefox-win11: Failed'));
  assert.ok(issueDraft.includes('p3-android-chrome: Failed'));
});
