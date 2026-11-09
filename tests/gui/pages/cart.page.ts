import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = 'http://localhost:5173') {
    this.page = page;
    this.baseURL = baseURL;
  }

  async openFromNavbar(): Promise<void> {
    const cartLink = this.page.getByRole('link', { name: /Giỏ hàng/i });
    await cartLink.click();
  }

  row(name: string): Locator {
    return this.page.locator('tbody tr').filter({
      hasText: name,
    });
  }

  quantity(name: string): Locator {
    const productRow = this.row(name);
    // In current implementation it's td:nth-child(3), or an input if exists
    const input = productRow.locator('input[type="number"], input');
    return input;
  }

  async remove(name: string): Promise<void> {
    const productRow = this.row(name);
    const removeBtn = productRow.getByRole('button', { name: /Xóa/i });
    await removeBtn.click();
  }
}
