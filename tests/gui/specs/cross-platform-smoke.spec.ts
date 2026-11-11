import { test, expect } from '../fixtures/test.js';

test.describe('Cross-Platform Cloud Smoke', () => {
  test('remote_session_smoke @smoke', async ({ page, sutURLs, captureContext }) => {
    // Navigate to web app with cold-start retry
    let navError: any = null;
    for (let i = 0; i < 2; i++) {
      try {
        await page.goto(sutURLs.web, { timeout: 60000 });
        navError = null;
        break;
      } catch (err) {
        navError = err;
        await page.waitForTimeout(3000);
      }
    }
    if (navError) throw navError;

    // Assert page is accessible
    const pageTitle = await page.evaluate(() => document.title);
    expect(pageTitle).toBeTruthy();

    // Verify context
    const ctx = captureContext();
    if (ctx) {
      expect(ctx.identity.id).toBeTruthy();
      expect(ctx.identity.platformId).toBeTruthy();
    }
  });
});
