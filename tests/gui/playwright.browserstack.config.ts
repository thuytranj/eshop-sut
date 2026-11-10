import { defineConfig } from '@playwright/test';
import { PLATFORMS } from './cross-platform/config.js';

export default defineConfig({
  testDir: './specs',
  testMatch: [
    '**/fr03.spec.ts',
    '**/fr05.spec.ts',
    '**/fr07.spec.ts',
    '**/fr15.spec.ts',
    '**/cross-platform-smoke.spec.ts',
  ],
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'artifacts/gui/html-cloud' }],
    ['./reporting/attempt-reporter.ts'],
  ],
  use: {
    actionTimeout: 20000,
    navigationTimeout: 60000,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
  },
  projects: PLATFORMS.map(platform => ({
    name: platform.id,
    metadata: {
      platformId: platform.id,
      transport: platform.transport,
    },
    use: {
      viewport: platform.transport === 'desktop' ? { width: 1440, height: 900 } : null,
    },
  })),
  webServer: undefined,
});
