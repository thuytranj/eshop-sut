import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Normalizes unicode whitespace (NBSP, thin space, etc.) into standard space
 */
export function normalizeSpaces(str: string): string {
  return str.replace(/[\u00a0\u202f\u2000-\u200a]/g, ' ').trim();
}

/**
 * Checks money formatting according to FR-21:
 * - Symbol ₫
 * - Thousands separator (. or ,)
 * - Rejects VND
 */
export async function assertMoney(locator: Locator, expected: number): Promise<void> {
  const text = normalizeSpaces(await locator.innerText());

  if (text.includes('VND')) {
    throw new Error(`Currency must use '₫', found 'VND' in "${text}"`);
  }

  if (!text.includes('₫')) {
    throw new Error(`Currency must contain symbol '₫', found: "${text}"`);
  }

  // Format expected number with Vietnamese formatting (e.g. 30.000.000 or 30,000,000)
  const dotFormatted = expected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const commaFormatted = expected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const matchesNumber = text.includes(dotFormatted) || text.includes(commaFormatted);
  if (!matchesNumber) {
    throw new Error(`Expected formatted money for ${expected} in "${text}"`);
  }
}

/**
 * Converts hex (#RRGGBB or #RGB) or rgb(r, g, b) to relative luminance
 */
function parseRgb(color: string): [number, number, number] {
  color = color.trim().toLowerCase();
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }
  return [0, 0, 0];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const transform = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

/**
 * Calculates WCAG contrast ratio between foreground and background colors
 */
export function measureContrast(fg: string, bg: string): number {
  const [r1, g1, b1] = parseRgb(fg);
  const [r2, g2, b2] = parseRgb(bg);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

/**
 * Captures tab order starting from an element
 */
export async function captureTabOrder(
  page: Page,
  start: Locator,
  count: number
): Promise<string[]> {
  await start.focus();
  const order: string[] = [];

  for (let i = 0; i < count; i++) {
    const descriptor = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'none';
      const role = el.getAttribute('role') || el.tagName.toLowerCase();
      const name = el.getAttribute('aria-label') || (el as HTMLElement).innerText?.trim() || el.getAttribute('placeholder') || '';
      return `${role}:${name.slice(0, 30)}`;
    });
    order.push(descriptor);
    await page.keyboard.press('Tab');
  }

  return order;
}
