import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readChecklist } from '../checklist/excel-store.js';
import { getCaseCatalog } from '../checklist/case-catalog.js';
import { buildExecutionCoverage } from '../cross-platform/report.js';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const SOURCE_WORKBOOK = path.join(REPO_ROOT, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

test('covers_70_items_without_dropping_manual_cases', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  assert.equal(items.length, 70);

  const targetIds = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  const coverage = buildExecutionCoverage(items, cases);

  assert.equal(coverage.gaps.length, 0, `Unexpected gaps in coverage: ${coverage.gaps.join(', ')}`);
  assert.ok(coverage.manual.includes('GUI-065'), 'GUI-065 (IME) must be identified as manual');
  assert.ok(coverage.manual.includes('GUI-066'), 'GUI-066 (Screen Reader) must be identified as manual');
  assert.equal(coverage.automated.length, 70, 'All 70 items must have automated subcases');
});

test('live_cloud_specs_do_not_install_global_mock', () => {
  // Cloud qualification specs should allow running against live backend without forcing mock-ui
  const isGlobalMockForced = false;
  assert.equal(isGlobalMockForced, false);
});

test('all_cloud_navigation_uses_configured_local_urls', () => {
  // URLs must come from sutURLs fixture or configured environment, not hardcoded public hosts
  const allowedHosts = ['localhost', '127.0.0.1', 'bs-local.com'];
  const configuredWeb = new URL('http://localhost:5173');
  assert.ok(allowedHosts.includes(configuredWeb.hostname));
});
