import { test, expect } from '../fixtures/test.js';

test.describe('Cross-Platform Cloud Smoke', () => {
  test('remote_session_smoke @smoke', async ({ page, sutURLs, captureContext }) => {
    // Navigate to web app
    await page.goto(sutURLs.web, { waitUntil: 'domcontentloaded' });

    // Assert page is accessible
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();

    // Verify context
    const ctx = captureContext();
    if (ctx) {
      expect(ctx.identity.id).toBeTruthy();
      expect(ctx.identity.platformId).toBeTruthy();
    }
  });
});
