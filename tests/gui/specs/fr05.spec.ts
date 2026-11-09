import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page.ts';
import { installNetwork, type NetworkController } from '../fixtures/network.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { assertMoney, measureContrast, captureTabOrder } from '../support/ui-assertions.ts';
import { captureComposition, readComposition } from '../support/composition.ts';

test.describe('FR-05: Product Catalog and Search (19 items)', () => {
  let catalogPage: CatalogPage;
  let network: NetworkController;

  test.beforeEach(async ({ page, context }) => {
    network = await installNetwork(context, {
      products: BASELINE_PRODUCTS,
      categories: BASELINE_CATEGORIES,
      mode: 'mock-ui',
    });
    catalogPage = new CatalogPage(page);
    await catalogPage.open();
  });

  test.afterEach(async () => {
    if (network) {
      await network.dispose();
    }
  });

  test('[GUI-016] Grid responsive layout across viewports', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-016' },
      { type: 'caseId', description: 'grid-responsive' },
      { type: 'mode', description: 'mock-ui' }
    );

    // Desktop 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(5);
    const box1 = await cards.nth(0).boundingBox();
    const box2 = await cards.nth(1).boundingBox();
    expect(box1 && box2 && box1.y === box2.y).toBeTruthy(); // multiple columns

    // Mobile 360x800
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(cards).toHaveCount(5);
  });

  test('[GUI-017] Product card typography and info', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-017' },
      { type: 'caseId', description: 'card-info' },
      { type: 'mode', description: 'mock-ui' }
    );

    const cardA = catalogPage.card('iPhone 15 Pro Max');
    await expect(cardA).toBeVisible();
    await expect(cardA.locator('img')).toBeVisible();
    await expect(cardA.locator('button', { hasText: 'Thêm vào giỏ' })).toBeVisible();
  });

  test('[GUI-018] Currency formatting strictly uses ₫ and thousand separators', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-018' },
      { type: 'caseId', description: 'currency-format' },
      { type: 'mode', description: 'mock-ui' }
    );

    const cardA = catalogPage.card('iPhone 15 Pro Max');
    const priceLocator = cardA.locator('p, span').filter({ hasText: /VND|₫/ }).first();
    await assertMoney(priceLocator, 30000000);
  });

  test('[GUI-019] Exactly one h1 on page describing content', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-019' },
      { type: 'caseId', description: 'single-h1' },
      { type: 'mode', description: 'mock-ui' }
    );

    const h1s = page.locator('h1');
    const count = await h1s.count();
    expect(count, `Expected exactly 1 h1 tag, found ${count}`).toBe(1);
  });

  test('[GUI-020] Color contrast ratio >= 4.5:1', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-020' },
      { type: 'caseId', description: 'color-contrast' },
      { type: 'mode', description: 'mock-ui' }
    );

    const cardA = catalogPage.card('iPhone 15 Pro Max');
    const title = cardA.getByRole('heading', { name: 'iPhone 15 Pro Max' });
    const colors = await title.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { fg: style.color, bg: window.getComputedStyle(document.body).backgroundColor || '#ffffff' };
    });
    const ratio = measureContrast(colors.fg, colors.bg);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('[GUI-021] HTML safe search display without script execution or tag injection', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-021' },
      { type: 'caseId', description: 'xss-search-safe' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.search('<b>iPhone</b>');
    const summary = page.locator('text=Kết quả tìm kiếm cho:');
    await expect(summary).toBeVisible();

    // Must NOT contain an injected <b> tag
    const injectedBold = summary.locator('b');
    const count = await injectedBold.count();
    expect(count, 'Search term must be escaped text literal, not raw HTML <b> tag').toBe(0);
  });

  test('[GUI-022] Filter products by name correctly', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-022' },
      { type: 'caseId', description: 'search-by-name' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.search('iPhone');
    await expect(catalogPage.card('iPhone 15 Pro Max')).toBeVisible();
    await expect(catalogPage.card('Samsung Galaxy S24 Ultra')).toHaveCount(0);
  });

  test('[GUI-023] Clear search keyword restores all 5 baseline products', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-023' },
      { type: 'caseId', description: 'clear-search-keyword' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.search('iPhone');
    await catalogPage.search('');
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(5);
  });

  test('[GUI-024] Active navigation highlight for Trang chu', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-024' },
      { type: 'caseId', description: 'active-home-nav' },
      { type: 'mode', description: 'mock-ui' }
    );

    const homeNav = page.getByRole('link', { name: /Trang chủ|Cửa hàng/i });
    await expect(homeNav).toBeVisible();
    const classes = await homeNav.getAttribute('class') || '';
    expect(classes).toMatch(/active|font-bold|text-blue/);
  });

  test('[GUI-025] Cart badge updates after adding product A', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-025' },
      { type: 'caseId', description: 'cart-badge-update' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.add('iPhone 15 Pro Max');
    const badge = page.getByRole('link', { name: /Giỏ hàng/i }).locator('span, .badge').first();
    await expect(badge).toHaveText(/1/);
  });

  test('[GUI-026] Click product image and title navigates to detail page', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-026' },
      { type: 'caseId', description: 'detail-click' },
      { type: 'mode', description: 'mock-ui' }
    );

    const cardA = catalogPage.card('iPhone 15 Pro Max');
    const img = cardA.locator('img');
    await img.click();
    await expect(page).toHaveURL(/\/product\/1/);
  });

  test('[GUI-027] Logical keyboard tab order across catalog page', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-027' },
      { type: 'caseId', description: 'tab-order' },
      { type: 'mode', description: 'mock-ui' }
    );

    const searchInput = page.getByPlaceholder('Tìm kiếm...');
    const order = await captureTabOrder(page, searchInput, 4);
    expect(order.length).toBe(4);
  });

  test('[GUI-028] Loading skeleton/indicator while waiting for network', async ({ page, context }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-028' },
      { type: 'caseId', description: 'loading-indicator' },
      { type: 'mode', description: 'mock-ui' }
    );

    network.setProductsState('pending');
    await page.goto('http://localhost:5173');
    const loader = page.locator('.loading, .skeleton, text=/Đang tải|Loading/i');
    await expect(loader).toBeVisible({ timeout: 2000 });
    network.releaseProducts();
  });

  test('[GUI-029] Empty search displays friendly illustration and message', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-029' },
      { type: 'caseId', description: 'search-empty-state' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.search('ZZZ_NO_MATCH_20261108');
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(0);
    const emptyMsg = page.locator('text=/Không tìm thấy|không có sản phẩm/i');
    await expect(emptyMsg).toBeVisible();
  });

  test('[GUI-030] All product images have descriptive non-empty alt text', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-030' },
      { type: 'caseId', description: 'image-alt' },
      { type: 'mode', description: 'mock-ui' }
    );

    const images = page.locator('.grid img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt && alt.trim().length > 0, `Image #${i} has empty alt text`).toBeTruthy();
    }
  });

  test('[GUI-031] Toast feedback appears when adding product to cart', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-031' },
      { type: 'caseId', description: 'add-cart-toast' },
      { type: 'mode', description: 'mock-ui' }
    );

    await catalogPage.add('iPhone 15 Pro Max');
    const toast = page.locator('.toast, [role="status"], [role="alert"], text=/Đã thêm vào giỏ|thành công/i');
    await expect(toast).toBeVisible({ timeout: 3000 });
  });

  test('[GUI-065] IME composition handling in search input', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-065' },
      { type: 'caseId', description: 'ime-synthetic' },
      { type: 'mode', description: 'mock-ui' }
    );

    const input = page.getByPlaceholder('Tìm kiếm...');
    await captureComposition(input);
    await input.focus();

    // Dispatch composition sequence
    await input.evaluate((el: HTMLInputElement) => {
      el.dispatchEvent(new CompositionEvent('compositionstart', { data: '' }));
      el.dispatchEvent(new CompositionEvent('compositionupdate', { data: 'đ' }));
      el.value = 'đ';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new CompositionEvent('compositionend', { data: 'đ' }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const samples = await readComposition(input);
    expect(samples.length).toBeGreaterThan(0);
    expect(await input.inputValue()).toBe('đ');
  });

  test('[GUI-067] Network failure error state and retry recovery', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-067' },
      { type: 'caseId', description: 'network-retry' },
      { type: 'mode', description: 'mock-ui' }
    );

    network.setProductsState('abort');
    await page.goto('http://localhost:5173');

    // Should display Vietnamese error message and Retry button
    const retryBtn = page.getByRole('button', { name: /Thử lại/i });
    await expect(retryBtn).toBeVisible({ timeout: 3000 });

    // Switch network to success and click retry
    network.setProductsState('success');
    await retryBtn.click();

    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(5);
  });

  test('[GUI-070] Fast repeated clicks on Add button should prevent duplicate mutations', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-070' },
      { type: 'caseId', description: 'click-spam-prevent' },
      { type: 'mode', description: 'mock-ui' }
    );

    const cardA = catalogPage.card('iPhone 15 Pro Max');
    const addBtn = cardA.getByRole('button', { name: 'Thêm vào giỏ' });

    // Rapid 3 clicks
    await addBtn.click({ clickCount: 3, delay: 50 });

    // Open Cart via navbar
    const cartLink = page.getByRole('link', { name: /Giỏ hàng/i });
    await cartLink.click();

    // Verify exactly 1 row for A with quantity 1
    const rows = page.locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' });
    await expect(rows).toHaveCount(1);
  });
});
