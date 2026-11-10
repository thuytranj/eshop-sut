import type { Page } from '@playwright/test';
import type { CaptureContext } from './types.js';

export const STUDENT_WATERMARK =
  '23120367 - Trần Ngọc Diễm Thúy - 23120367@student.hcmus.edu.vn';

export function formatWatermarkLines(
  currentUrl: string,
  context: CaptureContext
): string[] {
  const identity = context.identity;
  const devicePart = identity.device ? ` | Device: ${identity.device}` : '';
  const now = new Date();
  const timeStr = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  return [
    STUDENT_WATERMARK,
    `URL: ${currentUrl}`,
    `Browser: ${identity.browser}/${identity.browserVersion} | OS: ${identity.os}/${identity.osVersion}${devicePart}`,
    `Run: ${context.runId} | Item: ${context.itemId} | Case: ${context.caseId} | Attempt: a${context.attempt} | Session: ${identity.id} | ${timeStr} (UTC+7)`,
  ];
}

export async function injectWatermark(
  page: Page,
  context: CaptureContext
): Promise<() => Promise<void>> {
  const currentUrl = page.url();
  const lines = formatWatermarkLines(currentUrl, context);

  await page.evaluate(
    ({ lines, action }) => {
      const existing = document.getElementById('hw03-evidence-watermark');
      if (existing) {
        existing.remove();
      }

      if (action === 'remove') return;

      const overlay = document.createElement('div');
      overlay.id = 'hw03-evidence-watermark';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.position = 'fixed';
      overlay.style.bottom = '10px';
      overlay.style.right = '10px';
      overlay.style.zIndex = '2147483647';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.88)';
      overlay.style.color = '#ffffff';
      overlay.style.padding = '8px 12px';
      overlay.style.borderRadius = '6px';
      overlay.style.fontSize = '12px';
      overlay.style.lineHeight = '1.4';
      overlay.style.fontFamily = 'monospace, system-ui, sans-serif';
      overlay.style.pointerEvents = 'none';
      overlay.style.userSelect = 'none';
      overlay.style.maxWidth = '90vw';
      overlay.style.wordBreak = 'break-all';
      overlay.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';

      for (const lineText of lines) {
        const line = document.createElement('div');
        line.textContent = lineText;
        overlay.appendChild(line);
      }

      document.body.appendChild(overlay);
    },
    { lines, action: 'inject' }
  );

  return async () => {
    try {
      await page.evaluate(({ action }) => {
        const el = document.getElementById('hw03-evidence-watermark');
        if (el) el.remove();
      }, { action: 'remove' });
    } catch {}
  };
}
