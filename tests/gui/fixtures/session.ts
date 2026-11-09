import { type Page, type Locator } from '@playwright/test';
import { type Product } from './products.ts';
import { CatalogPage } from '../pages/catalog.page.ts';

export interface SeedOptions {
  detailAddClicks?: 1 | 2;
}

export async function seedCartViaUi(
  page: Page,
  baseURL: string,
  lines: { product: Product; quantity: number }[],
  options?: SeedOptions
): Promise<void> {
  const detailClicks = options?.detailAddClicks || 1;
  const catalog = new CatalogPage(page, baseURL);
  await catalog.open();

  for (const line of lines) {
    if (line.quantity === 1) {
      // Add directly from catalog
      await catalog.add(line.product.name);
    } else {
      // Navigate via SPA link to detail page to select quantity
      const card = catalog.card(line.product.name);
      const detailLink = card.getByRole('link', { name: /Xem chi tiết/i });
      await detailLink.click();

      // Change quantity input
      const qtyInput = page.locator('input[type="number"]');
      await qtyInput.fill(String(line.quantity));

      // Click add button (workaround detailAddClicks if configured)
      const addDetailBtn = page.getByRole('button', { name: /Thêm vào giỏ hàng/i });
      for (let i = 0; i < detailClicks; i++) {
        await addDetailBtn.click();
      }

      // Return to catalog via SPA navbar link
      const homeLink = page.getByRole('link', { name: /Trang chủ|Cửa hàng/i });
      await homeLink.click();
    }
  }

  // Navigate to Cart via SPA navbar link (NOT page.goto)
  const cartLink = page.getByRole('link', { name: /Giỏ hàng/i });
  await cartLink.click();
}

export async function assertQuantityControls(row: Locator): Promise<void> {
  const minus = row.getByRole('button', { name: /−|-|giảm/i });
  const plus = row.getByRole('button', { name: /\+|tăng/i });
  const input = row.locator('input[type="number"], input');

  const hasMinus = (await minus.count()) > 0;
  const hasPlus = (await plus.count()) > 0;
  const hasInput = (await input.count()) > 0;

  if (!hasMinus || !hasPlus || !hasInput) {
    throw new Error(
      `Quantity controls missing in cart row: minus=${hasMinus}, plus=${hasPlus}, input=${hasInput}`
    );
  }
}

export async function measureTouchTarget(locator: Locator): Promise<{ width: number; height: number }> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Element bounding box unavailable for touch measurement');
  }
  return { width: box.width, height: box.height };
}

export async function loginViaUi(
  page: Page,
  baseURL: string,
  account: { email: string; password: string }
): Promise<void> {
  await page.goto(baseURL);
  // If login form is shown
  const emailInput = page.locator('input[type="email"], input').first();
  const pwdInput = page.locator('input[type="password"]');
  const loginBtn = page.getByRole('button', { name: /Đăng nhập/i });

  if (await loginBtn.isVisible()) {
    await emailInput.fill(account.email);
    await pwdInput.fill(account.password);
    await loginBtn.click();
  }
}
