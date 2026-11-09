import fs from 'node:fs';
import path from 'node:path';
import { type ChecklistItem } from '../contracts.ts';
import { readChecklist } from './excel-store.ts';

const ASPECTS = new Set(['IA-01', 'IA-02', 'IA-03', 'IA-04']);

export interface Requirement {
  requirement_id: string;
  ia: string;
  requirement: string;
  source: string;
  applicable: string;
  reason: string;
}

export function parseCsv(content: string): Record<string, string>[] {
  const clean = content.replace(/^\ufeff/, '').trim();
  const lines = clean.split(/\r?\n/);
  if (!lines.length) return [];

  // Parse CSV header
  const parseRow = (line: string): string[] => {
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    return row;
  };

  const headers = parseRow(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    rows.push(obj);
  }

  return rows;
}

export async function validateChecklist(
  items: ChecklistItem[],
  requirementsPath: string
): Promise<string[]> {
  const errors: string[] = [];

  if (!fs.existsSync(requirementsPath)) {
    errors.push(`Requirements file not found at ${requirementsPath}`);
    return errors;
  }

  const reqContent = fs.readFileSync(requirementsPath, 'utf-8');
  const rawRequirements = parseCsv(reqContent);

  const inventory = new Map<string, Requirement>();
  for (const r of rawRequirements) {
    const rid = r.requirement_id?.trim();
    if (!rid || inventory.has(rid)) {
      errors.push(`Duplicate or empty requirement ID: ${rid}`);
    }
    const req: Requirement = {
      requirement_id: rid,
      ia: r.ia?.trim(),
      requirement: r.requirement?.trim(),
      source: r.source?.trim(),
      applicable: r.applicable?.trim(),
      reason: r.reason?.trim(),
    };
    inventory.set(rid, req);

    if (!ASPECTS.has(req.ia)) {
      errors.push(`${rid}: invalid IA ${req.ia}`);
    }
    if (req.applicable !== 'yes' && req.applicable !== 'no') {
      errors.push(`${rid}: applicable must be yes/no`);
    }
    if (req.applicable === 'no' && !req.reason) {
      errors.push(`${rid}: non-applicable requirement needs reason`);
    }
  }

  if (items.length < 41) {
    errors.push('Checklist must contain at least 41 items');
  }

  const coveredReqs = new Set<string>();
  const observedGroups = new Set<string>();
  const seenIds = new Set<string>();
  const seenChecks = new Set<string>();

  for (const row of items) {
    const iid = row.id?.trim();
    if (!iid || seenIds.has(iid)) {
      errors.push(`Duplicate or empty item ID: ${iid}`);
    }
    seenIds.add(iid);

    const ia = row.ia?.trim();
    observedGroups.add(ia);
    if (!ASPECTS.has(ia)) {
      errors.push(`${iid}: invalid IA ${ia}`);
    }

    for (const key of ['screen', 'check', 'expected'] as const) {
      if (!row[key] || !row[key].trim()) {
        errors.push(`${iid}: missing ${key}`);
      }
    }

    const signature = `${row.screen}|${row.check}|${row.expected}`.toLowerCase().replace(/\s+/g, ' ');
    if (seenChecks.has(signature)) {
      errors.push(`Duplicate check signature for item ${iid}`);
    }
    seenChecks.add(signature);

    if (row.origin !== 'AI' && row.origin !== 'Human') {
      errors.push(`${iid}: origin must be AI/Human`);
    }
    if (row.origin === 'Human' && !row.addition_reason?.trim()) {
      errors.push(`${iid}: Human item needs addition_reason`);
    }

    const refs = (row.requirement_ids || '')
      .split(';')
      .map((r) => r.trim())
      .filter(Boolean);

    if (!refs.length) {
      errors.push(`${iid}: missing requirement_ids`);
    }

    for (const rid of refs) {
      const req = inventory.get(rid);
      if (!req) {
        errors.push(`${iid}: unknown requirement ${rid}`);
      } else if (req.ia !== ia || req.applicable !== 'yes') {
        errors.push(`${iid}: IA/applicability mismatch for ${rid}`);
      } else {
        coveredReqs.add(rid);
      }
    }
  }

  for (const aspect of ASPECTS) {
    if (!observedGroups.has(aspect)) {
      errors.push(`Missing aspect: ${aspect}`);
    }
  }

  for (const [rid, req] of inventory.entries()) {
    if (req.applicable === 'yes' && !coveredReqs.has(rid)) {
      errors.push(`Uncovered requirement: ${rid}`);
    }
  }

  return errors;
}

// CLI execution
async function main() {
  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const workbookPath = path.join(repoRoot, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');
  const requirementsPath = path.join(repoRoot, 'docs/gui-checklist/requirements.csv');

  console.log(`Validating workbook: ${workbookPath}`);
  const { items } = await readChecklist(workbookPath);
  const errors = await validateChecklist(items, requirementsPath);

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} errors:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`Validation SUCCESS: ${items.length} items validated with 0 errors across 4 aspects.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
