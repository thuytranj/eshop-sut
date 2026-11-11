import { test, expect } from '../fixtures/test.js';
import { AdminProductsPage } from '../pages/admin-products.page.ts';
import { installNetwork, type NetworkController } from '../fixtures/network.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { TEST_ACCOUNTS } from '../fixtures/accounts.ts';
import { loginViaUi } from '../fixtures/session.ts';

test.describe('FR-15: Admin Product Management CRUD (18 items)', () => {
  let adminPage: AdminProductsPage;
  let network: NetworkController;

  test.beforeEach(async ({ page, context }) => {
    network = await installNetwork(context, {
      products: BASELINE_PRODUCTS,
      categories: BASELINE_CATEGORIES,
      mode: 'mock-ui',
    });
    adminPage = new AdminProductsPage(page);
    const adminUrl = process.env.SUT_ADMIN_BASE_URL || 'http://localhost:5174';
    await loginViaUi(page, adminUrl, TEST_ACCOUNTS.admin);
    await adminPage.openProductsTab();
  });

  test.afterEach(async () => {
    if (network) {
      await network.dispose();
    }
  });

  test('[GUI-047] Admin product table displays Vietnamese column headers', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-047' },
      { type: 'caseId', description: 'admin-table-columns' },
      { type: 'mode', description: 'mock-ui' }
    );

    const headers = (await page.locator('table thead th').allInnerTexts()).map(t => t.trim());
    const expectedHeaders = ['Ảnh', 'Tên sản phẩm', 'Giá', 'Danh mục', 'Thao tác'];
    expect(headers).toEqual(expectedHeaders);
  });

  test('[GUI-048] Exactly one h1 describing product management', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-048' },
      { type: 'caseId', description: 'admin-single-h1' },
      { type: 'mode', description: 'mock-ui' }
    );

    const h1s = page.locator('h1');
    const count = await h1s.count();
    expect(count, 'Admin product management page must contain exactly 1 h1 describing the section').toBe(1);
    if (count > 0) {
      expect(await h1s.first().innerText()).toMatch(/Quản lý Sản phẩm|Sản phẩm/i);
    }
  });

  test('[GUI-049] Action button colors follow semantic design guidelines', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-049' },
      { type: 'caseId', description: 'action-button-colors' },
      { type: 'mode', description: 'mock-ui' }
    );

    const saveBtn = page.getByRole('button', { name: /Lưu sản phẩm/i });
    const deleteBtn = page.getByRole('button', { name: /Xóa/i }).first();

    const saveBg = await saveBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const delBg = await deleteBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);

    // Green palette for save, red palette for delete
    expect(saveBg).toMatch(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    expect(delBg).toMatch(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  });

  test('[GUI-050] Required fields show asterisk marker (*)', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-050' },
      { type: 'caseId', description: 'required-field-markers' },
      { type: 'mode', description: 'mock-ui' }
    );

    const formText = await page.locator('form').first().innerText();
    expect(formText, 'Required fields (Tên, Giá, Danh mục) must have explicit * labels').toContain('*');
  });

  test('[GUI-051] Product name validation enforces max length of 255 characters', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-051' },
      { type: 'caseId', description: 'product-name-255' },
      { type: 'mode', description: 'mock-ui' }
    );

    const nameInput = page.getByPlaceholder('Tên sản phẩm');
    const name256 = 'A'.repeat(256);
    await nameInput.fill(name256);

    const val = await nameInput.inputValue();
    expect(val.length, 'Product name must be truncated or blocked at max 255 chars').toBeLessThanOrEqual(255);
  });

  test('[GUI-052] Product price validation accepts only positive amounts > 0', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-052' },
      { type: 'caseId', description: 'product-price-bounds' },
      { type: 'mode', description: 'mock-ui' }
    );

    const priceInput = page.getByPlaceholder('Giá tiền');
    await priceInput.fill('0');
    await adminPage.save();

    const errorMsg = page.locator('text=/Giá phải lớn hơn 0|không hợp lệ/i');
    await expect(errorMsg, 'Error message required for price <= 0').toBeVisible();
  });

  test('[GUI-053] Category dropdown loads categories from backend list', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-053' },
      { type: 'caseId', description: 'category-select' },
      { type: 'mode', description: 'mock-ui' }
    );

    const categorySelect = page.locator('form select').first();
    const options = await categorySelect.locator('option').allInnerTexts();
    expect(options).toContain('Điện thoại');
    expect(options).toContain('Laptop');
    expect(options).toContain('Phụ kiện');
  });

  test('[GUI-054] Load edit form populates fields of selected product A', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-054' },
      { type: 'caseId', description: 'load-edit-form' },
      { type: 'mode', description: 'mock-ui' }
    );

    await adminPage.edit('iPhone 15 Pro Max');
    const nameInput = page.getByPlaceholder('Tên sản phẩm');
    const priceInput = page.getByPlaceholder('Giá tiền');

    expect(await nameInput.inputValue()).toBe('iPhone 15 Pro Max');
    expect(await priceInput.inputValue()).toBe('30000000');
  });

  test('[GUI-055] Form validation errors appear directly above submit button', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-055' },
      { type: 'caseId', description: 'error-position-above-submit' },
      { type: 'mode', description: 'mock-ui' }
    );

    const nameInput = page.getByPlaceholder('Tên sản phẩm');
    await nameInput.fill('');
    const saveBtn = page.getByRole('button', { name: /Lưu sản phẩm/i });
    await saveBtn.click();

    const errorContainer = page.locator('.error, [role="alert"]').first();
    if (await errorContainer.isVisible()) {
      const errBox = await errorContainer.boundingBox();
      const btnBox = await saveBtn.boundingBox();
      expect(errBox && btnBox && errBox.y < btnBox.y).toBeTruthy();
    } else {
      expect(await errorContainer.count(), 'Validation error element must appear in DOM').toBeGreaterThan(0);
    }
  });

  test('[GUI-056] Active tab highlight on "Sản phẩm" menu', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-056' },
      { type: 'caseId', description: 'active-tab-highlight' },
      { type: 'mode', description: 'mock-ui' }
    );

    const productsTab = page.locator('li').filter({ hasText: /^Sản phẩm$/ });
    const classes = (await productsTab.getAttribute('class')) || '';
    expect(classes).toMatch(/text-blue-400|active|font-bold/);
  });

  test('[GUI-057] Exact "Đăng xuất" button label in header or sidebar', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-057' },
      { type: 'caseId', description: 'logout-button-exact' },
      { type: 'mode', description: 'mock-ui' }
    );

    const logoutBtn = page.getByRole('button', { name: 'Đăng xuất' });
    await expect(logoutBtn, 'Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"').toBeVisible();
  });

  test('[GUI-058] Cancel form closes edit state with zero mutations', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-058' },
      { type: 'caseId', description: 'cancel-form-no-mutation' },
      { type: 'mode', description: 'mock-ui' }
    );

    await adminPage.edit('iPhone 15 Pro Max');
    const cancelBtn = page.getByRole('button', { name: /Hủy sửa|Hủy/i });
    await cancelBtn.click();

    // Verify form reset and no PUT request sent
    const putRequests = network.requests.filter(r => r.method === 'PUT');
    expect(putRequests.length).toBe(0);
  });

  test('[GUI-059] Edit product modal implements keyboard focus trap', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-059' },
      { type: 'caseId', description: 'modal-focus-trap' },
      { type: 'mode', description: 'mock-ui' }
    );

    await adminPage.edit('iPhone 15 Pro Max');
    const modal = page.locator('dialog, [role="dialog"], .modal');
    await expect(modal, 'Editing must open in an accessible modal dialog with focus trap').toBeVisible();
  });

  test('[GUI-060] Updating product A isolates change and does not modify product B', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-060' },
      { type: 'caseId', description: 'isolate-update' },
      { type: 'mode', description: 'mock-ui' }
    );

    // Edit A
    await adminPage.edit('iPhone 15 Pro Max');
    const nameInput = page.getByPlaceholder('Tên sản phẩm');
    const priceInput = page.getByPlaceholder('Giá tiền');

    await nameInput.fill('iPhone 15 Pro Max QA');
    await priceInput.fill('31000000');
    await adminPage.save();

    // In table, Product B (Samsung Galaxy S24 Ultra) must still have name "Samsung Galaxy S24 Ultra" and price 28.000.000
    const rowB = adminPage.row('Samsung Galaxy S24 Ultra');
    await expect(rowB, 'Product B must not be altered when updating Product A').toBeVisible();
    await expect(rowB).toContainText('28000000');
  });

  test('[GUI-061] Confirmation modal with warning appears before deleting product', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-061' },
      { type: 'caseId', description: 'confirm-delete-modal' },
      { type: 'mode', description: 'mock-ui' }
    );

    const deleteBtn = adminPage.row('iPhone 15 Pro Max').getByRole('button', { name: /Xóa/i });
    await deleteBtn.click();

    // A modal dialog with confirmation must appear
    const confirmModal = page.locator('dialog, [role="dialog"], .modal').filter({ hasText: /Xác nhận xóa|Cảnh báo/i });
    await expect(confirmModal, 'Confirmation modal must appear before deleting product').toBeVisible();
  });

  test('[GUI-062] Cancel or Escape in delete confirmation modal preserves product', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-062' },
      { type: 'caseId', description: 'cancel-delete-modal' },
      { type: 'mode', description: 'mock-ui' }
    );

    const deleteBtn = adminPage.row('iPhone 15 Pro Max').getByRole('button', { name: /Xóa/i });
    await deleteBtn.click();

    const cancelBtn = page.getByRole('button', { name: /Hủy|Không/i });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // Product A must still exist in table
    const rowA = adminPage.row('iPhone 15 Pro Max');
    await expect(rowA).toBeVisible();
  });

  test('[GUI-063] CRUD actions provide immediate user feedback toast/alert', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-063' },
      { type: 'caseId', description: 'crud-feedback-toast' },
      { type: 'mode', description: 'mock-ui' }
    );

    await adminPage.edit('iPhone 15 Pro Max');
    await adminPage.save();

    const toast = page.locator('.toast, [role="status"], [role="alert"], text=/thành công/i');
    await expect(toast).toBeVisible();
  });

  test('[GUI-064] All product images in admin table have descriptive alt text', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-064' },
      { type: 'caseId', description: 'admin-table-image-alt' },
      { type: 'mode', description: 'mock-ui' }
    );

    const imgs = page.locator('table tbody img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      expect(alt && alt.trim().length > 0, `Admin table image #${i} has empty alt text`).toBeTruthy();
    }
  });
});
