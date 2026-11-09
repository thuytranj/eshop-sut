import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: 0,
  workers: process.env.LIVE_RUN === 'true' ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'artifacts/gui/html' }],
    ['./reporting/attempt-reporter.ts'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    serviceWorkers: 'block',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chrome-local',
      use: {
        channel: 'chrome',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: [
    {
      command: 'npm --prefix ../../frontend-web run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !isCI,
      cwd: new URL('.', import.meta.url).pathname,
      timeout: 30000,
    },
    {
      command: 'npm --prefix ../../frontend-admin run dev -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: !isCI,
      cwd: new URL('.', import.meta.url).pathname,
      timeout: 30000,
    },
  ],
});
