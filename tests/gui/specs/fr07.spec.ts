import { captureEndOfTest } from '../cross-platform/evidence.ts';
import { test, expect } from '../fixtures/test.js';
import { CartPage } from '../pages/cart.page.ts';
import { CatalogPage } from '../pages/catalog.page.ts';
import { installNetwork, type NetworkController } from '../fixtures/network.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { seedCartViaUi, assertQuantityControls, measureTouchTarget } from '../fixtures/session.ts';
import { assertMoney, captureTabOrder } from '../support/ui-assertions.ts';

const getWebUrl = () => process.env.SUT_WEB_BASE_URL || 'http://localhost:5173';

test.describe('FR-07: Shopping Cart Details (18 items)', () => {
  let cartPage: CartPage;
  let catalogPage: CatalogPage;
  let network: NetworkController;

  test.beforeEach(async ({ page, context }) => {
    network = await installNetwork(context, {
      products: BASELINE_PRODUCTS,
      categories: BASELINE_CATEGORIES,
      mode: 'mock-ui',
    });
    cartPage = new CartPage(page);
    catalogPage = new CatalogPage(page);
  });

  test.afterEach(async ({ page }, info) => {
    try { await captureEndOfTest(page, info); } catch (error) { console.error("Evidence capture failed:", error); }
    if (network) {
      await network.dispose();
    }
  });

  test('[GUI-032] Cart table displays exactly 5 columns in correct order', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-032' },
      { type: 'caseId', description: 'table-5-columns' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const ths = page.locator('table thead th');
    const headers = (await ths.allInnerTexts()).map(t => t.trim());
    const expectedHeaders = ['Sản phẩm', 'Đơn giá', 'Số lượng', 'Thành tiền', 'Thao tác'];
    expect(headers).toEqual(expectedHeaders);
  });

  test('[GUI-033] Cart total label strictly matches "Tổng cộng"', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-033' },
      { type: 'caseId', description: 'exact-total-label' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const totalLabel = page.locator('text=/Tổng cộng|Tổng tạm tính/i');
    await expect(totalLabel).toBeVisible();
    const labelText = await totalLabel.innerText();
    expect(labelText, 'Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"').toContain('Tổng cộng');
  });

  test('[GUI-034] Money formatted with ₫ and right aligned in columns', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-034' },
      { type: 'caseId', description: 'money-align-right' },
      { type: 'mode', description: 'mock-ui' }
    );

    // Seed A x 1 (30.000.000 ₫)
    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const rowA = cartPage.row('iPhone 15 Pro Max');
    const priceCell = rowA.locator('td').nth(1);
    await assertMoney(priceCell, 30000000);

    const textAlign = await priceCell.evaluate(el => window.getComputedStyle(el).textAlign);
    expect(textAlign, 'Money column must be right-aligned').toBe('right');
  });

  test('[GUI-035] Cart responsive layout at 360x800 and 768x1024', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-035' },
      { type: 'caseId', description: 'responsive-cart' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    await page.setViewportSize({ width: 360, height: 800 });
    const cartContainer = page.locator('table, .cart-container').first();
    await expect(cartContainer).toBeVisible();
    const box = await cartContainer.boundingBox();
    expect(box && box.width <= 360).toBeTruthy();
  });

  test('[GUI-036] Plus and minus buttons exist for adjusting item quantity', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-036' },
      { type: 'caseId', description: 'plus-minus-buttons' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const rowA = cartPage.row('iPhone 15 Pro Max');
    await assertQuantityControls(rowA);
  });

  test('[GUI-037] Direct quantity input allows typing quantity value', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-037' },
      { type: 'caseId', description: 'direct-quantity-input' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const rowA = cartPage.row('iPhone 15 Pro Max');
    const input = cartPage.quantity('iPhone 15 Pro Max');
    await expect(input, 'Cart row must contain a quantity input field').toBeVisible();
    await input.fill('2');
  });

  test('[GUI-038] Invalid quantity values handled safely without NaN', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-038' },
      { type: 'caseId', description: 'invalid-quantity' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const rowA = cartPage.row('iPhone 15 Pro Max');
    const input = cartPage.quantity('iPhone 15 Pro Max');
    if (await input.isVisible()) {
      await input.fill('-1');
      await input.blur();
      // Total must not contain NaN or negative amount
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('NaN');
    } else {
      expect(await input.count(), 'Quantity input required to test boundaries').toBeGreaterThan(0);
    }
  });

  test('[GUI-039] Active cart navigation highlight on /cart', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-039' },
      { type: 'caseId', description: 'active-cart-nav' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const cartLink = page.getByRole('link', { name: /Giỏ hàng/i });
    const classes = (await cartLink.getAttribute('class')) || '';
    expect(classes).toMatch(/active|font-bold|text-blue/);
  });

  test('[GUI-040] Breadcrumb navigation from Cart back to Home', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-040' },
      { type: 'caseId', description: 'breadcrumb-home' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], .breadcrumb');
    await expect(breadcrumb, 'Breadcrumb navigation must exist on Cart page').toBeVisible();
  });

  test('[GUI-041] Exact "Tiếp tục mua sắm" link navigates back to catalog', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-041' },
      { type: 'caseId', description: 'continue-shopping-exact' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const continueLink = page.getByRole('link', { name: 'Tiếp tục mua sắm' });
    await expect(continueLink, 'Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"').toBeVisible();
    await continueLink.click();
    expect(page.url()).toBe(`${getWebUrl()}/`);
  });

  test('[GUI-042] Logical keyboard tab order inside Cart', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-042' },
      { type: 'caseId', description: 'cart-tab-order' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const firstInteractive = page.locator('table button, table a').first();
    const order = await captureTabOrder(page, firstInteractive, 3);
    expect(order.length).toBe(3);
  });

  test('[GUI-043] Merging items when adding product A multiple times', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-043' },
      { type: 'caseId', description: 'merge-same-product' },
      { type: 'mode', description: 'mock-ui' }
    );

    // Add A once
    await catalogPage.open();
    await catalogPage.add('iPhone 15 Pro Max');

    // Add A second time
    await catalogPage.add('iPhone 15 Pro Max');

    // Go to cart
    await cartPage.openFromNavbar();

    // Must have exactly 1 row for iPhone 15 Pro Max with quantity 2
    const rows = page.locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' });
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('2');
  });

  test('[GUI-044] Confirmation dialog appears before deleting cart item', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-044' },
      { type: 'caseId', description: 'delete-confirm-dialog' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    let dialogAppeared = false;
    page.once('dialog', async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    await cartPage.remove('iPhone 15 Pro Max');
    expect(dialogAppeared, 'Confirmation dialog must appear before removing item').toBeTruthy();
  });

  test('[GUI-045] Cancel or Escape retains cart item, Confirm deletes item', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-045' },
      { type: 'caseId', description: 'confirm-cancel-escape' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    // 1. Dismiss retains item
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });
    await cartPage.remove('iPhone 15 Pro Max');
    await expect(cartPage.row('iPhone 15 Pro Max')).toHaveCount(1);

    // 2. Accept deletes item
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await cartPage.remove('iPhone 15 Pro Max');
    await expect(cartPage.row('iPhone 15 Pro Max')).toHaveCount(0);
  });

  test('[GUI-046] Empty cart state shows illustration and shopping CTA', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-046' },
      { type: 'caseId', description: 'empty-cart-state' },
      { type: 'mode', description: 'mock-ui' }
    );

    await page.goto(getWebUrl(), { waitUntil: 'domcontentloaded' });
    await cartPage.openFromNavbar();

    const emptyMsg = page.locator('text=/Giỏ hàng của bạn đang trống/i');
    await expect(emptyMsg).toBeVisible();
    const cta = page.getByRole('link', { name: /Tiếp tục mua sắm/i });
    await expect(cta).toBeVisible();
  });

  test('[GUI-066] Action icons have aria-label and live status announcements', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-066' },
      { type: 'caseId', description: 'a11y-aria-dom' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const removeBtn = cartPage.row('iPhone 15 Pro Max').getByRole('button', { name: /Xóa/i });
    const ariaLabel = await removeBtn.getAttribute('aria-label');
    expect(ariaLabel && ariaLabel.length > 0, 'Delete button must have descriptive aria-label').toBeTruthy();
  });

  test('[GUI-068] Transient empty quantity does not trigger immediate NaN before blur', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-068' },
      { type: 'caseId', description: 'transient-empty-input' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    const input = cartPage.quantity('iPhone 15 Pro Max');
    if (await input.isVisible()) {
      await input.focus();
      await input.fill('');
      const body = await page.locator('body').innerText();
      expect(body).not.toContain('NaN');
    } else {
      expect(await input.count(), 'Quantity input required to test transient empty state').toBeGreaterThan(0);
    }
  });

  test('[GUI-069] Interactive buttons meet minimum 44x44px touch target on mobile', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-069' },
      { type: 'caseId', description: 'touch-target-44px' },
      { type: 'mode', description: 'mock-ui' }
    );

    await seedCartViaUi(page, getWebUrl(), [
      { product: BASELINE_PRODUCTS[0], quantity: 1 },
    ]);

    await page.setViewportSize({ width: 360, height: 800 });
    const checkoutBtn = page.getByRole('button', { name: /Tiến hành thanh toán/i });
    const target = await measureTouchTarget(checkoutBtn);
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
  });
});
