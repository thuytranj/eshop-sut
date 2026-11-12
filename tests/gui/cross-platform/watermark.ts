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
    ({ lines, action, compactMobile, avoidHeader }) => {
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

      let displayLines = lines;
      if (compactMobile) {
        const viewport = window.visualViewport;
        overlay.style.left = `${(viewport?.offsetLeft || 0) + 8}px`;
        overlay.style.top = `${(viewport?.offsetTop || 0) + 8}px`;
        overlay.style.right = 'auto';
        overlay.style.bottom = 'auto';
        overlay.style.width = `${Math.max(240, (viewport?.width || window.innerWidth) - 16)}px`;
        overlay.style.maxWidth = 'none';
        overlay.style.boxSizing = 'border-box';
        overlay.style.padding = '6px 8px';
        const email = lines[0].match(/\S+@\S+/)?.[0] || lines[0];
        const item = lines[3].match(/Item: ([^|]+)/)?.[1]?.trim() || '';
        displayLines = [email, lines[1], lines[2], `Item: ${item}`];
      }
      for (const lineText of displayLines) {
        const line = document.createElement('div');
        line.textContent = lineText;
        if (lineText === lines[0]) line.style.wordBreak = 'normal';
        overlay.appendChild(line);
      }

      document.body.appendChild(overlay);
      if(compactMobile && avoidHeader) {
        const viewport=window.visualViewport;
        const offset=viewport?.offsetTop || 0;
        overlay.style.top=`${Math.max(offset+112,offset+(viewport?.height || window.innerHeight)-overlay.getBoundingClientRect().height-120)}px`;
      }
    },
    { lines, action: 'inject', compactMobile: context.identity.realMobile,
      avoidHeader:currentUrl.includes(':5174') || ['GUI-024','GUI-039','GUI-040','GUI-056','GUI-057'].includes(context.itemId) }
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
