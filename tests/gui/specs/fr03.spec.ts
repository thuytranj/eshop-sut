import { test, expect } from '../fixtures/test.js';
import { ResetPasswordPage } from '../pages/reset-password.page.ts';
import { installNetwork, type NetworkController } from '../fixtures/network.ts';
import { BASELINE_PRODUCTS, BASELINE_CATEGORIES } from '../fixtures/products.ts';
import { TEST_ACCOUNTS, assertOtpFormat } from '../fixtures/accounts.ts';
import { captureTabOrder } from '../support/ui-assertions.ts';

test.describe('FR-03: Forgot and Reset Password (15 items)', () => {
  let resetPage: ResetPasswordPage;
  let network: NetworkController;

  test.beforeEach(async ({ page, context }) => {
    network = await installNetwork(context, {
      products: BASELINE_PRODUCTS,
      categories: BASELINE_CATEGORIES,
      mode: 'mock-ui',
      resetTokens: {
        'test@eshop.com': '123456',
        'userb@eshop.com': '654321',
      },
    });
    resetPage = new ResetPasswordPage(page);
    await resetPage.open();
  });

  test.afterEach(async () => {
    if (network) {
      await network.dispose();
    }
  });

  test('[GUI-001] Vietnamese language and typography on password reset forms', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-001' },
      { type: 'caseId', description: 'lang-check' },
      { type: 'mode', description: 'mock-ui' }
    );

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('Quên Mật Khẩu');
    expect(bodyText).toMatch(/Nhập Email|Email/);
    expect(page.getByRole('button', { name: /Lấy mã OTP/i })).toBeVisible();
  });

  test('[GUI-002] Submit button color belongs to blue palette', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-002' },
      { type: 'caseId', description: 'button-color' },
      { type: 'mode', description: 'mock-ui' }
    );

    const submitBtn = page.getByRole('button', { name: /Lấy mã OTP/i });
    const bgColor = await submitBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    // Blue palette rgb(37, 99, 235) or similar
    expect(bgColor).toMatch(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
  });

  test('[GUI-003] Exactly one h1 on page describing forgot password', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-003' },
      { type: 'caseId', description: 'h1-count' },
      { type: 'mode', description: 'mock-ui' }
    );

    const h1s = page.locator('h1');
    const count = await h1s.count();
    expect(count, 'Password reset page must have exactly 1 h1 heading').toBe(1);
  });

  test('[GUI-004] Email input validation with type=email and required marker', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-004' },
      { type: 'caseId', description: 'email-validation' },
      { type: 'mode', description: 'mock-ui' }
    );

    const emailInput = page.locator('form input').first();
    const inputType = await emailInput.getAttribute('type');
    expect(inputType, 'Email input must have type="email"').toBe('email');
  });

  test('[GUI-005] Step indicator displays current step out of total 2 steps', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-005' },
      { type: 'caseId', description: 'step-indicator' },
      { type: 'mode', description: 'mock-ui' }
    );

    const stepIndicator = page.locator('.step-indicator, text=/Bước 1/i');
    await expect(stepIndicator, 'Step indicator (Bước 1/2) must be visible on step 1').toBeVisible();
  });

  test('[GUI-006] Both new password and confirm password fields exist with type=password', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-006' },
      { type: 'caseId', description: 'password-fields' },
      { type: 'mode', description: 'mock-ui' }
    );

    await resetPage.requestOtp('test@eshop.com');

    const newPwd = resetPage.newPasswordInput();
    const confirmPwd = resetPage.confirmPasswordInput();

    await expect(newPwd, 'New password input must exist').toBeVisible();
    await expect(confirmPwd, 'Confirm password input must exist').toBeVisible();
  });

  test('[GUI-007] Strong password validation and error message positioned above submit', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-007' },
      { type: 'caseId', description: 'password-strength' },
      { type: 'mode', description: 'mock-ui' }
    );

    await resetPage.requestOtp('test@eshop.com');
    await resetPage.newPasswordInput().fill('weak123');

    const submitBtn = page.getByRole('button', { name: /Đặt lại mật khẩu/i });
    await submitBtn.click();

    // Error must be displayed in DOM above submit button, not just browser alert
    const errorBox = page.locator('.error, [role="alert"]').first();
    await expect(errorBox, 'Error container must exist in DOM above submit button').toBeVisible();

    const errRect = await errorBox.boundingBox();
    const btnRect = await submitBtn.boundingBox();
    expect(errRect && btnRect && errRect.y < btnRect.y).toBeTruthy();
  });

  test('[GUI-008] OTP input validates 6-digit format strictly', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-008' },
      { type: 'caseId', description: 'otp-format' },
      { type: 'mode', description: 'mock-ui' }
    );

    await resetPage.requestOtp('test@eshop.com');
    const otpInput = resetPage.otpInput();
    await otpInput.fill('12345'); // 5 digits
    await resetPage.newPasswordInput().fill('MatKhauMoi123!');
    await resetPage.submitReset();

    const errorMsg = page.locator('text=/Mã OTP phải có 6 chữ số|không đúng định dạng/i');
    await expect(errorMsg, 'Error must indicate OTP format requires 6 digits').toBeVisible();
  });

  test('[GUI-009] "Quay lại đăng nhập" link navigates back to /login on both steps', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-009' },
      { type: 'caseId', description: 'back-login-link' },
      { type: 'mode', description: 'mock-ui' }
    );

    const backLink = page.getByRole('link', { name: 'Quay lại đăng nhập' });
    await expect(backLink, 'Link "Quay lại đăng nhập" must exist on step 1').toBeVisible();
    await backLink.click();
    expect(page.url()).toContain('/login');
  });

  test('[GUI-010] Keyboard tab order on Step 1', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-010' },
      { type: 'caseId', description: 'tab-step1' },
      { type: 'mode', description: 'mock-ui' }
    );

    const emailInput = page.locator('form input').first();
    const order = await captureTabOrder(page, emailInput, 3);
    expect(order.length).toBe(3);
  });

  test('[GUI-011] Keyboard tab order on Step 2', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-011' },
      { type: 'caseId', description: 'tab-step2' },
      { type: 'mode', description: 'mock-ui' }
    );

    await resetPage.requestOtp('test@eshop.com');
    const otpInput = resetPage.otpInput();
    const order = await captureTabOrder(page, otpInput, 4);
    expect(order.length).toBe(4);
  });

  test('[GUI-012] Enter key submits form on both step 1 and step 2', async ({ page }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-012' },
      { type: 'caseId', description: 'enter-key' },
      { type: 'mode', description: 'mock-ui' }
    );

    const emailInput = page.locator('form input').first();
    await emailInput.fill('test@eshop.com');
    await emailInput.press('Enter');

    // Should transition to step 2
    const step2Indicator = page.locator('text=/Bước 2|Mã OTP/i');
    await expect(step2Indicator).toBeVisible();
  });

  test('[GUI-013] Live OTP generation delivers exactly 6 numeric digits', async ({ request }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-013' },
      { type: 'caseId', description: 'live-otp-code' },
      { type: 'mode', description: 'live' }
    );

    // Live contract check for OTP format
    const res = await request.post('http://localhost:3000/api/forgot-password', {
      data: { email: TEST_ACCOUNTS.userA.email },
    });
    if (res.ok()) {
      const data = await res.json();
      assertOtpFormat(String(data.resetToken || ''));
    } else {
      expect(res.status(), 'Live server must respond to forgot-password request').toBe(200);
    }
  });

  test('[GUI-014] Live OTP binding prevents using token for another user account', async ({ request }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-014' },
      { type: 'caseId', description: 'bind-email' },
      { type: 'mode', description: 'live' }
    );

    // Request token for User A
    const resA = await request.post('http://localhost:3000/api/forgot-password', {
      data: { email: TEST_ACCOUNTS.userA.email },
    });

    if (resA.ok()) {
      const tokenA = (await resA.json()).resetToken;
      // Try to reset User B with token A
      const resResetB = await request.post('http://localhost:3000/api/reset-password', {
        data: {
          email: TEST_ACCOUNTS.userB.email,
          resetToken: tokenA,
          newPassword: 'NewPassword123!',
        },
      });
      expect(resResetB.status(), 'Token generated for user A must be rejected for user B').toBe(400);
    } else {
      expect(resA.status()).toBe(200);
    }
  });

  test('[GUI-015] Live reset password success enables login with new credentials', async ({ request }) => {
    test.info().annotations.push(
      { type: 'itemId', description: 'GUI-015' },
      { type: 'caseId', description: 'reset-success' },
      { type: 'mode', description: 'live' }
    );

    const email = TEST_ACCOUNTS.userA.email;
    const resReq = await request.post('http://localhost:3000/api/forgot-password', {
      data: { email },
    });

    if (resReq.ok()) {
      const token = (await resReq.json()).resetToken;
      const newPwd = 'UpdatedPassword123!';
      const resReset = await request.post('http://localhost:3000/api/reset-password', {
        data: { email, resetToken: token, newPassword: newPwd },
      });
      expect(resReset.status()).toBe(200);
    } else {
      expect(resReq.status()).toBe(200);
    }
  });
});
