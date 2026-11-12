import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertSessionIdentity,
  openRemoteSession,
  setRemoteStatus,
} from '../cross-platform/session.js';
import { PLATFORMS, loadCloudEnv } from '../cross-platform/config.js';
import type { Playwright, CloudEnv, PlatformSpec } from '../cross-platform/types.js';

const mockEnv: CloudEnv = {
  username: 'test_user',
  accessKey: 'test_key',
  webURL: 'http://localhost:5173',
  adminURL: 'http://localhost:5174',
  apiURL: 'http://localhost:3000/api',
  sutSourceSha: 'abc1234',
  localIdentifier: 'hw03-23120367-run1',
  clientVersion: '1.65.0',
  remoteVersions: {
    'p1-chrome-win11': 'latest',
    'p2-firefox-win11': 'latest',
    'p3-android-chrome': 'latest',
  },
};

test('assertSessionIdentity throws on missing or empty details', () => {
  assert.throws(() => assertSessionIdentity({}, PLATFORMS[0]), /Invalid or missing session details/);
  assert.throws(() => assertSessionIdentity(null, PLATFORMS[1]), /Invalid or missing session details/);
  assert.throws(() => assertSessionIdentity({}, PLATFORMS[2]), /Invalid or missing session details/);
});

test('rejects_wrong_remote_os', () => {
  const p1 = PLATFORMS.find(p => p.id === 'p1-chrome-win11')!;

  // Windows 10 given when Windows 11 required
  const win10Details = {
    hashed_id: 'bs_session_1',
    browser_url: 'https://automate.browserstack.com/builds/1/sessions/1',
    browser: 'chrome',
    browser_version: '120.0',
    os: 'Windows',
    os_version: '10',
  };
  assert.throws(() => assertSessionIdentity(win10Details, p1), /Remote OS version mismatch: expected 11, got 10/);

  // MacOS given when Windows 11 required
  const macDetails = {
    hashed_id: 'bs_session_2',
    browser_url: 'https://automate.browserstack.com/builds/1/sessions/2',
    browser: 'chrome',
    browser_version: '120.0',
    os: 'OS X',
    os_version: 'Sonoma',
  };
  assert.throws(() => assertSessionIdentity(macDetails, p1), /Remote OS mismatch: expected Windows, got OS X/);

  // Valid Windows 11 Chrome details
  const validP1 = assertSessionIdentity(
    {
      hashed_id: 'bs_session_3',
      browser_url: 'https://automate.browserstack.com/builds/1/sessions/3',
      browser: 'chrome',
      browser_version: '120.0.1',
      os: 'Windows',
      os_version: '11',
    },
    p1
  );
  assert.equal(validP1.platformId, 'p1-chrome-win11');
  assert.equal(validP1.os, 'Windows');
  assert.equal(validP1.osVersion, '11');
  assert.equal(validP1.browser, 'chrome');
});

test('rejects_emulated_android', () => {
  const p3 = PLATFORMS.find(p => p.id === 'p3-android-chrome')!;

  // Emulated android (realMobile is false or missing)
  const emulatedDetails = {
    hashed_id: 'bs_session_android_emu',
    browser_url: 'https://automate.browserstack.com/builds/1/sessions/emu',
    browser: 'chrome',
    browser_version: '120.0',
    os: 'android',
    os_version: '13.0',
    device: 'Samsung Galaxy S23',
    realMobile: false,
  };
  assert.throws(() => assertSessionIdentity(emulatedDetails, p3), /Real mobile device required/);

  // Wrong device model
  const wrongDeviceDetails = {
    hashed_id: 'bs_session_android_wrong',
    browser_url: 'https://automate.browserstack.com/builds/1/sessions/wrong',
    browser: 'chrome',
    browser_version: '120.0',
    os: 'android',
    os_version: '13.0',
    device: 'Google Pixel 7',
    realMobile: true,
  };
  assert.throws(() => assertSessionIdentity(wrongDeviceDetails, p3), /Device mismatch: expected Samsung Galaxy S23/);

  // Valid Samsung Galaxy S23 details
  const validP3 = assertSessionIdentity(
    {
      hashed_id: 'bs_session_android_real',
      browser_url: 'https://automate.browserstack.com/builds/1/sessions/real',
      browser: 'chrome',
      browser_version: '120.0.6099.144',
      os: 'android',
      os_version: '13.0',
      device: 'Samsung Galaxy S23',
      realMobile: true,
    },
    p3
  );
  assert.equal(validP3.platformId, 'p3-android-chrome');
  assert.equal(validP3.realMobile, true);
  assert.equal(validP3.device, 'Samsung Galaxy S23');
});

test('context_and_page_share_remote_session', async () => {
  let contextClosed = false;
  let browserClosed = false;

  const mockContext = {
    isMockContext: true,
    close: async () => {
      contextClosed = true;
    },
    pages: () => [],
  };

  const mockBrowser = {
    newContext: async () => mockContext,
    close: async () => {
      browserClosed = true;
    },
  };

  const mockPlaywright: Partial<Playwright> = {
    chromium: {
      connect: async () => mockBrowser,
    } as any,
  };

  const p1 = PLATFORMS.find(p => p.id === 'p1-chrome-win11')!;

  const session = await openRemoteSession(
    mockPlaywright as Playwright,
    p1,
    mockEnv,
    'smoke-test',
    'build-101',
    {
      fetchSessionDetails: async () => ({
        hashed_id: 'mock_sess_1',
        browser_url: 'https://automate.browserstack.com/sessions/mock_sess_1',
        browser: 'chrome',
        browser_version: '121.0',
        os: 'Windows',
        os_version: '11',
      }),
    }
  );

  assert.equal(session.context, mockContext as any);
  assert.equal(session.identity.id, 'mock_sess_1');

  await session.close();
  assert.ok(contextClosed, 'context was closed');
  assert.ok(browserClosed, 'browser was closed');
});

test('partial_setup_closes_allocated_resource', async () => {
  let browserClosed = false;

  const mockBrowser = {
    newContext: async () => {
      throw new Error('newContext failed simulate failure');
    },
    close: async () => {
      browserClosed = true;
    },
  };

  const mockPlaywright: Partial<Playwright> = {
    chromium: {
      connect: async () => mockBrowser,
    } as any,
  };

  const p1 = PLATFORMS.find(p => p.id === 'p1-chrome-win11')!;

  await assert.rejects(
    async () => {
      await openRemoteSession(
        mockPlaywright as Playwright,
        p1,
        mockEnv,
        'failing-setup',
        'build-102'
      );
    },
    /newContext failed simulate failure/
  );

  assert.ok(browserClosed, 'browser closed upon partial setup failure');
});

test('android test page replaces bootstrap tabs so native recording follows the only tab', async () => {
  const { selectTestPage } = await import('../cross-platform/session.js');
  const calls: string[] = [];
  const bootstrap = {close:async()=>calls.push('close-bootstrap')};
  const page = {bringToFront:async()=>calls.push('foreground')};
  const context:any={pages:()=>[bootstrap],newPage:async()=>{calls.push('new-page');return page;}};
  assert.equal(await selectTestPage(context,'p3-android-chrome'),page);
  assert.deepEqual(calls,['new-page','foreground','close-bootstrap']);
});
