import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ExcelJS from 'exceljs';
import {
  type ChecklistItem,
  type ItemResult,
  type CommitReceipt,
  type ItemId,
  type IA,
  type Screen,
  type Status,
} from '../contracts.ts';

function computeSha256(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function readChecklist(
  filePath: string
): Promise<{ items: ChecklistItem[]; sourceSha256: string }> {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Workbook not found at ${resolvedPath}`);
  }
  const sourceSha256 = computeSha256(resolvedPath);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(resolvedPath);

  const worksheet = workbook.getWorksheet('Checklist');
  if (!worksheet) {
    throw new Error("Sheet 'Checklist' not found in workbook");
  }

  // Header mapping from row 1
  const headerMap = new Map<string, number>();
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const header = String(cell.value || '').trim();
    if (header) {
      headerMap.set(header, colNumber);
    }
  });

  const getColVal = (row: ExcelJS.Row, colName: string): string => {
    const colNumber = headerMap.get(colName);
    if (!colNumber) return '';
    const val = row.getCell(colNumber).value;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object' && 'text' in val) {
      return String((val as any).text || '');
    }
    return String(val);
  };

  const items: ChecklistItem[] = [];

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const id = getColVal(row, 'id').trim() as ItemId;
    if (!id || !/^GUI-\d{3}$/.test(id)) {
      continue;
    }

    const item: ChecklistItem = {
      id,
      ia: getColVal(row, 'ia').trim() as IA,
      screen: getColVal(row, 'screen').trim() as Screen,
      requirement_ids: getColVal(row, 'requirement_ids').trim(),
      check: getColVal(row, 'check').trim(),
      expected: getColVal(row, 'expected').trim(),
      preconditions: getColVal(row, 'preconditions').trim(),
      test_data: getColVal(row, 'test_data').trim(),
      steps: getColVal(row, 'steps').trim(),
      measurement: getColVal(row, 'measurement').trim(),
      evidence_needed: getColVal(row, 'evidence_needed').trim(),
      priority: getColVal(row, 'priority').trim(),
      status: (getColVal(row, 'status').trim() as Status) || 'Not Run',
      actual_result: getColVal(row, 'actual_result'),
      notes: getColVal(row, 'notes'),
      evidence_path: getColVal(row, 'evidence_path'),
      origin: getColVal(row, 'origin').trim(),
      addition_reason: getColVal(row, 'addition_reason').trim(),
    };

    items.push(item);
  }

  return { items, sourceSha256 };
}

export async function commitResults(
  filePath: string,
  results: ItemResult[],
  expectedSha256: string
): Promise<CommitReceipt> {
  const resolvedPath = path.resolve(filePath);
  const lockPath = `${resolvedPath}.lock`;

  // 1. Acquire exclusive lock using 'wx' flag
  let lockFd: number | null = null;
  try {
    lockFd = fs.openSync(lockPath, 'wx');
  } catch (err: any) {
    throw new Error(`Lock error: Unable to acquire sidecar lock ${lockPath} (${err.message})`);
  }

  try {
    // 2. Check source SHA256 for concurrent edit detection
    const currentSha256 = computeSha256(resolvedPath);
    if (currentSha256 !== expectedSha256) {
      throw new Error(`SHA mismatch / concurrent edit detected. Expected ${expectedSha256}, got ${currentSha256}`);
    }

    // 3. Create full byte backup
    const backupDir = path.join(path.dirname(resolvedPath), 'backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${path.basename(resolvedPath)}.${timestamp}.bak`);
    fs.copyFileSync(resolvedPath, backupPath);

    // 4. Read workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(resolvedPath);
    const worksheet = workbook.getWorksheet('Checklist');
    if (!worksheet) {
      throw new Error("Sheet 'Checklist' not found in workbook");
    }

    // Header mapping
    const headerMap = new Map<string, number>();
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const header = String(cell.value || '').trim();
      if (header) {
        headerMap.set(header, colNumber);
      }
    });

    const statusCol = headerMap.get('status');
    const actualCol = headerMap.get('actual_result');
    const notesCol = headerMap.get('notes');
    const evidenceCol = headerMap.get('evidence_path');
    const idCol = headerMap.get('id');

    if (!idCol || !statusCol || !actualCol || !notesCol || !evidenceCol) {
      throw new Error('Required result columns (id, status, actual_result, notes, evidence_path) missing in sheet');
    }

    // Map existing rows by ID
    const rowById = new Map<string, ExcelJS.Row>();
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const idVal = String(row.getCell(idCol).value || '').trim();
      if (idVal) {
        rowById.set(idVal, row);
      }
    });

    // Validate all results exist and statuses are valid
    const validStatuses: Status[] = ['Not Run', 'Passed', 'Failed'];
    for (const res of results) {
      if (!rowById.has(res.id)) {
        throw new Error(`Unknown item ID: ${res.id}`);
      }
      if (!validStatuses.includes(res.status)) {
        throw new Error(`Invalid status: ${res.status} for item ${res.id}`);
      }
    }

    // Apply patches to the 4 columns
    const setCellString = (cell: ExcelJS.Cell, textVal: string) => {
      cell.value = textVal;
      if ((cell as any).formula) {
        delete (cell as any).formula;
      }
    };

    const changedIds: ItemId[] = [];
    for (const res of results) {
      const row = rowById.get(res.id)!;

      // Untrusted text protection: assign as plain string, no formula
      setCellString(row.getCell(statusCol), String(res.status));
      setCellString(row.getCell(actualCol), String(res.actual_result || ''));
      setCellString(row.getCell(notesCol), String(res.notes || ''));
      setCellString(row.getCell(evidenceCol), String(res.evidence_path || ''));

      changedIds.push(res.id);
    }

    // 5. Write to temporary file in same directory
    const tempPath = path.join(path.dirname(resolvedPath), `.${path.basename(resolvedPath)}.${Date.now()}.tmp`);
    await workbook.xlsx.writeFile(tempPath);

    // 6. Verify temp file
    const verifyWorkbook = new ExcelJS.Workbook();
    await verifyWorkbook.xlsx.readFile(tempPath);
    const verifySheet = verifyWorkbook.getWorksheet('Checklist');
    if (!verifySheet) {
      fs.unlinkSync(tempPath);
      throw new Error('Temp file verification failed: missing Checklist sheet');
    }

    // 7. Re-check source SHA before atomic rename
    const finalSha256 = computeSha256(resolvedPath);
    if (finalSha256 !== expectedSha256) {
      fs.unlinkSync(tempPath);
      throw new Error(`Source file changed right before commit! Expected ${expectedSha256}, got ${finalSha256}`);
    }

    // 8. Atomic rename
    fs.renameSync(tempPath, resolvedPath);
    const outputSha256 = computeSha256(resolvedPath);

    return {
      backupPath,
      outputSha256,
      changedIds,
    };
  } finally {
    // Release lock
    if (lockFd !== null) {
      try {
        fs.closeSync(lockFd);
      } catch {}
      try {
        fs.unlinkSync(lockPath);
      } catch {}
    }
  }
}
