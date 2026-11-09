import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readChecklist } from '../checklist/excel-store.ts';
import { validateChecklist } from '../checklist/validate.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const SOURCE_WORKBOOK = path.join(REPO_ROOT, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');
const REQUIREMENTS_PATH = path.join(REPO_ROOT, 'docs/gui-checklist/requirements.csv');

test('validates_70_items_and_requirements_mapping', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const errors = await validateChecklist(items, REQUIREMENTS_PATH);
  assert.deepEqual(errors, []);
});

test('flags_missing_requirement_reference', async () => {
  const { items } = await readChecklist(SOURCE_WORKBOOK);
  const cloned = JSON.parse(JSON.stringify(items));
  cloned[0].requirement_ids = 'UNKNOWN-REQ-999';
  const errors = await validateChecklist(cloned, REQUIREMENTS_PATH);
  assert.ok(errors.some(e => e.includes('unknown requirement UNKNOWN-REQ-999')));
});
