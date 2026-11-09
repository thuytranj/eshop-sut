import fs from 'node:fs';
import path from 'node:path';
import { type ManualResult, type RunManifest } from '../contracts.ts';

export async function importManualResults(
  manualJsonPath: string,
  manifest: RunManifest
): Promise<ManualResult[]> {
  const resolved = path.resolve(manualJsonPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Manual results file not found at ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  const list: ManualResult[] = JSON.parse(raw);

  if (!Array.isArray(list)) {
    throw new Error('Manual results file must be a JSON array of ManualResult objects');
  }

  for (const item of list) {
    if (item.mode !== 'manual') {
      throw new Error(`Item ${item.itemId} has invalid mode: ${item.mode}, expected 'manual'`);
    }
    if (!item.reviewer || !item.device || !item.tool) {
      throw new Error(`Item ${item.itemId} missing required reviewer, device, or tool metadata`);
    }
    if (!item.itemId || !item.caseId) {
      throw new Error('Manual result missing itemId or caseId');
    }
    if (item.environment?.buildCommit && item.environment.buildCommit !== manifest.buildCommit) {
      throw new Error(
        `Manual evidence buildCommit ${item.environment.buildCommit} mismatch with manifest ${manifest.buildCommit}`
      );
    }
  }

  return list;
}
