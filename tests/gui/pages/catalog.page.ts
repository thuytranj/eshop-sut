import { type Page, type Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = process.env.SUT_WEB_BASE_URL || 'http://localhost:5173') {
    this.page = page;
    this.baseURL = baseURL;
  }

  async open(): Promise<void> {
    await this.page.goto(this.baseURL);
  }

  async search(keyword: string): Promise<void> {
    const input = this.page.getByPlaceholder('Tìm kiếm...');
    await input.fill(keyword);
    // Submit via button or Enter
    const submitBtn = this.page.getByRole('button', { name: 'Tìm' });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    } else {
      await input.press('Enter');
    }
  }

  card(name: string): Locator {
    return this.page.locator('.grid > div').filter({
      has: this.page.getByRole('heading', { name }),
    });
  }

  async add(name: string): Promise<void> {
    const productCard = this.card(name);
    const addBtn = productCard.getByRole('button', { name: 'Thêm vào giỏ' });
    await addBtn.click();
  }
}
