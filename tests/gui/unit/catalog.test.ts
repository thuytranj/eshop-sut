import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readChecklist } from '../checklist/excel-store.ts';
import { getCaseCatalog, getAllItemBlueprints } from '../checklist/case-catalog.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { resolveExecutionData } from '../fixtures/execution-data.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const SOURCE_WORKBOOK = path.join(REPO_ROOT, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

test('registry_has_exactly_70_unique_item_ids', () => {
  const blueprints = getAllItemBlueprints();
  assert.equal(blueprints.length, 70);
  const ids = new Set(blueprints.map(b => b.itemId));
  assert.equal(ids.size, 70);

  // Check ID range GUI-001 to GUI-070
  for (let i = 1; i <= 70; i++) {
    const padId = `GUI-${String(i).padStart(3, '0')}`;
    assert.ok(ids.has(padId as any), `Missing ${padId}`);
  }
});

test('fr05_has_19_items', () => {
  const blueprints = getAllItemBlueprints().filter(b => b.screen === 'FR-05');
  assert.equal(blueprints.length, 19);
  const expectedIds = [
    'GUI-016', 'GUI-017', 'GUI-018', 'GUI-019', 'GUI-020',
    'GUI-021', 'GUI-022', 'GUI-023', 'GUI-024', 'GUI-025',
    'GUI-026', 'GUI-027', 'GUI-028', 'GUI-029', 'GUI-030',
    'GUI-031', 'GUI-065', 'GUI-067', 'GUI-070',
  ];
  assert.deepEqual(blueprints.map(b => b.itemId).sort(), expectedIds.sort());
});

test('baseline_matches_five_screenshot_products', () => {
  assert.equal(BASELINE_PRODUCTS.length, 5);
  const names = BASELINE_PRODUCTS.map(p => p.name);
  assert.ok(names.includes('iPhone 15 Pro Max'));
  assert.ok(names.includes('Samsung Galaxy S24 Ultra'));
  assert.ok(names.includes('MacBook Pro M3'));
  assert.ok(names.includes('Tai nghe AirPods Pro 2'));
  assert.ok(names.includes('Bàn phím cơ Keychron Q1'));
});

test('resolves_execution_examples_without_rewriting_excel', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const execData = resolveExecutionData(items, BASELINE_PRODUCTS, BASELINE_CATEGORIES);

  assert.equal(execData.productsByAlias.A.name, 'iPhone 15 Pro Max');
  assert.equal(execData.productsByAlias.A.price, 30000000);
  assert.equal(execData.productsByAlias.B.name, 'Samsung Galaxy S24 Ultra');
  assert.equal(execData.productsByAlias.B.price, 28000000);

  // Cart sums: A*2 + B*1 = 60tr + 28tr = 88tr
  const cartSubtotalA = execData.productsByAlias.A.price * 2;
  const cartSubtotalB = execData.productsByAlias.B.price * 1;
  const cartTotal = cartSubtotalA + cartSubtotalB;
  assert.equal(cartTotal, 88000000);

  // A*3 + B*1 = 90tr + 28tr = 118tr
  const cartTotal3A = execData.productsByAlias.A.price * 3 + cartSubtotalB;
  assert.equal(cartTotal3A, 118000000);

  assert.ok(execData.substitutions.length >= 7);
});
