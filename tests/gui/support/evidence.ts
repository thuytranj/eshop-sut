import fs from 'node:fs';
import path from 'node:path';
import { type Page, type TestInfo } from '@playwright/test';
import { type Attempt, type ItemResult } from '../contracts.ts';

export async function runCheck(
  testInfo: TestInfo,
  page: Page,
  stepName: string,
  check: () => Promise<void>
): Promise<void> {
  try {
    await check();
  } catch (err: any) {
    try {
      const screenshotDir = path.resolve('artifacts/gui/screenshots');
      try {
        fs.mkdirSync(screenshotDir, { recursive: true });
      } catch {}
      const safeStep = stepName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const screenshotPath = path.join(screenshotDir, `fail-${Date.now()}-${safeStep}.png`);
      const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });

      await testInfo.attach(`assertion-failure-${stepName}`, {
        path: fs.existsSync(screenshotPath) ? screenshotPath : undefined,
        body: screenshot,
        contentType: 'image/png',
      });
      await testInfo.attach(`assertion-error-${stepName}`, {
        body: JSON.stringify(
          {
            stepName,
            message: err.message,
            stack: err.stack,
          },
          null,
          2
        ),
        contentType: 'application/json',
      });
    } catch (captureErr) {
      // Screenshot error must not swallow original assertion error
      console.warn(`Failed to capture error screenshot for step "${stepName}":`, captureErr);
    }
    throw err;
  }
}

export async function writeEvidenceManifest(
  item: ItemResult,
  attempts: Attempt[],
  outDir: string
): Promise<string> {
  const manifestPath = path.join(outDir, `${item.id}-evidence.json`);
  fs.mkdirSync(outDir, { recursive: true });

  const data = {
    itemId: item.id,
    status: item.status,
    actual_result: item.actual_result,
    notes: item.notes,
    evidence_path: item.evidence_path,
    attempts: attempts.map((a) => ({
      caseId: a.caseId,
      targetId: a.targetId,
      mode: a.mode,
      retry: a.retry,
      outcome: a.outcome,
      failureKind: a.failureKind,
      actual: a.actual,
      error: a.error,
      evidence: a.evidence,
      startedAt: a.startedAt,
      endedAt: a.endedAt,
    })),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2), 'utf-8');
  return manifestPath;
}
