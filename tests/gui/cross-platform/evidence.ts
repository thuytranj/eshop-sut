import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Page, TestInfo, Locator } from '@playwright/test';
import type { CaptureContext, EvidenceRecord } from './types.js';
import { injectWatermark } from './watermark.js';

export async function captureEvidence(
  page: Page,
  info: TestInfo,
  context: CaptureContext,
  observed?: Locator
): Promise<EvidenceRecord> {
  const actualURL = page.url();
  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const targetDir = path.join(
    repoRoot,
    'docs/screenshots/cross-platform',
    context.identity.platformId,
    context.runId
  );

  fs.mkdirSync(targetDir, { recursive: true });

  const safeCaseId = context.caseId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const filename = `${context.itemId}__${safeCaseId}__a${context.attempt}__${timestamp}.png`;
  const screenshotPath = path.join(targetDir, filename);

  let cleanupWatermark: (() => Promise<void>) | null = null;
  try {
    cleanupWatermark = await injectWatermark(page, context);

    const buffer = await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    const sha256 = crypto
      .createHash('sha256')
      .update(buffer || fs.readFileSync(screenshotPath))
      .digest('hex');

    if (info && typeof info.attach === 'function') {
      await info.attach(`evidence-${context.itemId}`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    }

    return {
      path: screenshotPath,
      sha256,
      actualURL,
      capturedAt: new Date().toISOString(),
      context,
    };
  } finally {
    if (cleanupWatermark) {
      await cleanupWatermark();
    }
  }
}
