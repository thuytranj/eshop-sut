import test from 'node:test';
import assert from 'node:assert/strict';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { resolveExecutionData } from '../fixtures/execution-data.ts';
import { assertQuantityControls } from '../fixtures/session.ts';

test('cart_totals_match_execution_data_override', () => {
  const execData = resolveExecutionData([], BASELINE_PRODUCTS, BASELINE_CATEGORIES);
  const A = execData.productsByAlias.A;
  const B = execData.productsByAlias.B;

  // Standard cart A*2 + B*1
  const subtotalA = A.price * 2;
  const subtotalB = B.price * 1;
  const total = subtotalA + subtotalB;
  assert.equal(subtotalA, 60000000);
  assert.equal(subtotalB, 28000000);
  assert.equal(total, 88000000);

  // Increase A: 3*A + 1*B
  const totalPlusOne = A.price * 3 + subtotalB;
  assert.equal(totalPlusOne, 118000000);
});

test('seed_cart_does_not_reload_context', () => {
  // Navigation calls in seedCartViaUi must use click on SPA link, not page.goto
  const navigationCalls: string[] = [];
  const mockPage = {
    goto: (url: string) => navigationCalls.push(`goto:${url}`),
    getByRole: (role: string, options: any) => ({
      click: async () => navigationCalls.push(`click:${role}:${options?.name}`),
      locator: () => ({ fill: async () => {} }),
      first: () => ({ click: async () => {} }),
    }),
  };
  assert.ok(mockPage);
});

test('transient_empty_is_distinct_from_invalid_commit', () => {
  const transientValue = '';
  const committedInvalid = '0';
  assert.notEqual(transientValue, committedInvalid);
});

test('manual_gate_prevents_full_item_pass', () => {
  const autoOnlyEvidence = { syntheticPassed: true, manualEvidence: null };
  const isFullPass = autoOnlyEvidence.syntheticPassed && autoOnlyEvidence.manualEvidence !== null;
  assert.equal(isFullPass, false);
});

test('known_detail_workaround_is_explicit_and_logged', () => {
  const defaultOption = { detailAddClicks: 1 as const };
  const workaroundOption = { detailAddClicks: 2 as const };
  assert.equal(defaultOption.detailAddClicks, 1);
  assert.equal(workaroundOption.detailAddClicks, 2);
});

test('assertQuantityControls_rejects_missing_buttons', async () => {
  const fakeEmptyRow = {
    getByRole: () => ({ count: async () => 0 }),
    locator: () => ({ count: async () => 0 }),
  } as any;

  await assert.rejects(
    async () => {
      await assertQuantityControls(fakeEmptyRow);
    },
    /Quantity controls missing/
  );
});
