import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ExcelJS from 'exceljs';
import { readChecklist, commitResults } from '../checklist/excel-store.ts';
import { type ItemResult } from '../contracts.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '../../..');
const SOURCE_WORKBOOK = path.join(REPO_ROOT, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

test('reads_70_unique_ids_and_four_aspects', async () => {
  const { items, sourceSha256 } = await readChecklist(SOURCE_WORKBOOK);
  assert.equal(items.length, 70);
  assert.ok(sourceSha256 && sourceSha256.length === 64);

  const ids = new Set(items.map(i => i.id));
  assert.equal(ids.size, 70);

  const aspectCounts = items.reduce((acc, item) => {
    acc[item.ia] = (acc[item.ia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  assert.deepEqual(aspectCounts, {
    'IA-01': 18,
    'IA-02': 18,
    'IA-03': 16,
    'IA-04': 18,
  });
});

test('patches_by_id_after_sort_and_header_reorder', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const { items, sourceSha256 } = await readChecklist(tmpWorkbook);
    assert.equal(items.length, 70);

    const update: ItemResult[] = [
      {
        id: 'GUI-067',
        status: 'Failed',
        actual_result: 'Network abort error test',
        notes: 'run=test; target=chrome-local',
        evidence_path: 'artifacts/gui/test/error.png',
      },
    ];

    const receipt = await commitResults(tmpWorkbook, update, sourceSha256);
    assert.deepEqual(receipt.changedIds, ['GUI-067']);
    assert.ok(fs.existsSync(receipt.backupPath));

    const { items: patchedItems } = await readChecklist(tmpWorkbook);
    const patched = patchedItems.find(i => i.id === 'GUI-067');
    assert.ok(patched);
    assert.equal(patched.status, 'Failed');
    assert.equal(patched.actual_result, 'Network abort error test');
    assert.equal(patched.notes, 'run=test; target=chrome-local');
    assert.equal(patched.evidence_path, 'artifacts/gui/test/error.png');

    // All other 69 items must still be Not Run
    const otherItems = patchedItems.filter(i => i.id !== 'GUI-067');
    assert.equal(otherItems.length, 69);
    for (const other of otherItems) {
      assert.equal(other.status, 'Not Run');
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('preserves_every_non_result_cell_and_sheet', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const wbBefore = new ExcelJS.Workbook();
    await wbBefore.xlsx.readFile(tmpWorkbook);
    const sheetNamesBefore = wbBefore.worksheets.map(ws => ws.name);

    const { sourceSha256 } = await readChecklist(tmpWorkbook);
    const update: ItemResult[] = [
      {
        id: 'GUI-001',
        status: 'Passed',
        actual_result: 'Pass observation',
        notes: 'notes',
        evidence_path: '',
      },
    ];
    await commitResults(tmpWorkbook, update, sourceSha256);

    const wbAfter = new ExcelJS.Workbook();
    await wbAfter.xlsx.readFile(tmpWorkbook);
    const sheetNamesAfter = wbAfter.worksheets.map(ws => ws.name);
    assert.deepEqual(sheetNamesAfter, sheetNamesBefore);
    assert.equal(sheetNamesAfter.length, 5);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('rejects_duplicate_or_missing_id', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const { sourceSha256 } = await readChecklist(tmpWorkbook);
    const invalidUpdate: ItemResult[] = [
      {
        id: 'GUI-999' as any,
        status: 'Passed',
        actual_result: 'Not existing',
        notes: '',
        evidence_path: '',
      },
    ];

    await assert.rejects(
      async () => {
        await commitResults(tmpWorkbook, invalidUpdate, sourceSha256);
      },
      /Unknown item ID|ID not found|GUI-999/
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('detects_concurrent_edit_and_lock', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const { sourceSha256 } = await readChecklist(tmpWorkbook);

    // Modify file externally to simulate concurrent edit
    fs.appendFileSync(tmpWorkbook, 'corrupt');

    const update: ItemResult[] = [
      {
        id: 'GUI-001',
        status: 'Passed',
        actual_result: 'Pass',
        notes: '',
        evidence_path: '',
      },
    ];

    await assert.rejects(
      async () => {
        await commitResults(tmpWorkbook, update, sourceSha256);
      },
      /SHA mismatch|concurrent edit|Lock error/
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('failed_temp_write_keeps_original', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const originalContent = fs.readFileSync(tmpWorkbook);
    const { sourceSha256 } = await readChecklist(tmpWorkbook);

    // Invalid result causing failure
    await assert.rejects(async () => {
      await commitResults(
        tmpWorkbook,
        [{ id: 'GUI-001', status: 'InvalidStatus' as any, actual_result: '', notes: '', evidence_path: '' }],
        sourceSha256
      );
    });

    const currentContent = fs.readFileSync(tmpWorkbook);
    assert.deepEqual(currentContent, originalContent);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('writes_untrusted_text_as_text', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'excel-test-'));
  const tmpWorkbook = path.join(tmpDir, 'test.xlsx');
  fs.copyFileSync(SOURCE_WORKBOOK, tmpWorkbook);

  try {
    const { sourceSha256 } = await readChecklist(tmpWorkbook);
    const update: ItemResult[] = [
      {
        id: 'GUI-001',
        status: 'Failed',
        actual_result: '=1+1',
        notes: '+CMD|"/C calc"!A0',
        evidence_path: '@evil',
      },
    ];

    await commitResults(tmpWorkbook, update, sourceSha256);

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(tmpWorkbook);
    const sheet = wb.getWorksheet('Checklist');
    assert.ok(sheet);

    // Find row with GUI-001
    let targetRow: ExcelJS.Row | undefined;
    sheet.eachRow((row) => {
      if (row.getCell(1).value === 'GUI-001') {
        targetRow = row;
      }
    });

    assert.ok(targetRow);
    let actualCol = 14;
    sheet.getRow(1).eachCell((cell, colNumber) => {
      if (cell.value === 'actual_result') actualCol = colNumber;
    });
    const actualCell = targetRow.getCell(actualCol);
    assert.equal(typeof actualCell.value, 'string');
    assert.equal(actualCell.value, '=1+1');
    assert.equal(actualCell.formula, undefined);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
