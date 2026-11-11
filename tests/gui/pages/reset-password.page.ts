import { type Page, type Locator } from '@playwright/test';

export class ResetPasswordPage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string = process.env.SUT_WEB_BASE_URL || 'http://localhost:5173') {
    this.page = page;
    this.baseURL = baseURL;
  }

  async open(): Promise<void> {
    await this.page.goto(`${this.baseURL}/forgot-password`);
  }

  async requestOtp(email: string): Promise<void> {
    // Label or placeholder or input
    const emailInput = this.page.locator('form input').first();
    await emailInput.fill(email);
    const submitBtn = this.page.getByRole('button', { name: /Lấy mã OTP/i });
    await submitBtn.click();
  }

  otpInput(): Locator {
    return this.page.locator('input').filter({ hasNot: this.page.locator('[type="password"]') }).first();
  }

  newPasswordInput(): Locator {
    return this.page.locator('input[type="password"]').first();
  }

  confirmPasswordInput(): Locator {
    // If confirm password exists, it's the second password input
    return this.page.locator('input[type="password"]').nth(1);
  }

  async submitReset(): Promise<void> {
    const submitBtn = this.page.getByRole('button', { name: /Đặt lại mật khẩu/i });
    await submitBtn.click();
  }
}
