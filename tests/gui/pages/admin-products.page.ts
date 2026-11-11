import { type Page, type Locator } from '@playwright/test';

export class AdminProductsPage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = process.env.SUT_ADMIN_BASE_URL || 'http://localhost:5174') {
    this.page = page;
    this.baseURL = baseURL;
  }

  async openProductsTab(): Promise<void> {
    await this.page.goto(this.baseURL);
    const productsTab = this.page.locator('li').filter({ hasText: /^Sản phẩm$/ });
    await productsTab.click();
  }

  row(name: string): Locator {
    return this.page.locator('tbody tr').filter({
      hasText: name,
    });
  }

  async edit(name: string): Promise<void> {
    const productRow = this.row(name);
    const editBtn = productRow.getByRole('button', { name: /Sửa/i });
    await editBtn.click();
  }

  async save(): Promise<void> {
    const saveBtn = this.page.getByRole('button', { name: /Lưu sản phẩm/i });
    await saveBtn.click();
  }

  async remove(name: string): Promise<void> {
    const productRow = this.row(name);
    const removeBtn = productRow.getByRole('button', { name: /Xóa/i });
    await removeBtn.click();
  }
}
