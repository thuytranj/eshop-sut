import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../playwright.browserstack.config.js';
import {
  PLATFORMS,
  loadCloudEnv,
  buildCapabilities,
  redactSecrets,
} from '../cross-platform/config.js';
import type { CompatibilityLock } from '../cross-platform/types.js';

const mockCompatibility: CompatibilityLock = {
  clientVersion: '1.65.0',
  remoteVersions: {
    'p1-chrome-win11': 'latest',
    'p2-firefox-win11': 'latest',
    'p3-android-chrome': 'latest',
  },
  verified: true,
};

test('config_contract', () => {
  assert.equal(config.workers, 1);
  assert.equal(config.fullyParallel, false);
  assert.equal(config.retries, 0);
  assert.equal(config.webServer, undefined);
  assert.deepEqual(PLATFORMS.map(p => p.id), [
    'p1-chrome-win11',
    'p2-firefox-win11',
    'p3-android-chrome',
  ]);
});

test('accepts_local_urls_and_rejects_missing_credentials_or_public_targets', () => {
  // Missing credentials
  assert.throws(
    () =>
      loadCloudEnv(
        {
          BROWSERSTACK_USERNAME: '',
          BROWSERSTACK_ACCESS_KEY: 'secret123',
        },
        mockCompatibility,
        'run-01'
      ),
    /BROWSERSTACK_USERNAME/
  );

  assert.throws(
    () =>
      loadCloudEnv(
        {
          BROWSERSTACK_USERNAME: 'user1',
          BROWSERSTACK_ACCESS_KEY: '',
        },
        mockCompatibility,
        'run-01'
      ),
    /BROWSERSTACK_ACCESS_KEY/
  );

  // Valid localhost URLs
  const validEnv = loadCloudEnv(
    {
      BROWSERSTACK_USERNAME: 'valid_user',
      BROWSERSTACK_ACCESS_KEY: 'valid_key_12345',
      SUT_WEB_BASE_URL: 'http://localhost:5173',
      SUT_ADMIN_BASE_URL: 'http://localhost:5174',
      SUT_API_BASE_URL: 'http://localhost:3000/api',
      SUT_SOURCE_SHA: 'abcd1234ef',
    },
    mockCompatibility,
    'run-01'
  );
  assert.equal(validEnv.webURL, 'http://localhost:5173');
  assert.equal(validEnv.adminURL, 'http://localhost:5174');
  assert.equal(validEnv.apiURL, 'http://localhost:3000/api');

  // Rejects public targets in qualification
  assert.throws(
    () =>
      loadCloudEnv(
        {
          BROWSERSTACK_USERNAME: 'valid_user',
          BROWSERSTACK_ACCESS_KEY: 'valid_key_12345',
          SUT_WEB_BASE_URL: 'https://eshop.example.com',
        },
        mockCompatibility,
        'run-01',
        { phase: 'qualification' }
      ),
    /Public target or disallowed host/
  );

  // Rejects credentials embedded in URL
  assert.throws(
    () =>
      loadCloudEnv(
        {
          BROWSERSTACK_USERNAME: 'valid_user',
          BROWSERSTACK_ACCESS_KEY: 'valid_key_12345',
          SUT_WEB_BASE_URL: 'http://admin:pass@localhost:5173',
        },
        mockCompatibility,
        'run-01'
      ),
    /Embedded credentials/
  );

  // Rejects port outside allowlist
  assert.throws(
    () =>
      loadCloudEnv(
        {
          BROWSERSTACK_USERNAME: 'valid_user',
          BROWSERSTACK_ACCESS_KEY: 'valid_key_12345',
          SUT_WEB_BASE_URL: 'http://localhost:8080',
        },
        mockCompatibility,
        'run-01',
        { phase: 'qualification' }
      ),
    /Disallowed port/
  );
});

test('does_not_send_desktop_version_to_firefox_or_android', () => {
  const env = loadCloudEnv(
    {
      BROWSERSTACK_USERNAME: 'my_user',
      BROWSERSTACK_ACCESS_KEY: 'my_secret_key_12345',
    },
    mockCompatibility,
    'test-run-123'
  );

  const p1 = PLATFORMS.find(p => p.id === 'p1-chrome-win11')!;
  const p2 = PLATFORMS.find(p => p.id === 'p2-firefox-win11')!;
  const p3 = PLATFORMS.find(p => p.id === 'p3-android-chrome')!;

  const capsP1 = buildCapabilities(p1, env, 'test-p1', 'build-1');
  const capsP2 = buildCapabilities(p2, env, 'test-p2', 'build-1');
  const capsP3 = buildCapabilities(p3, env, 'test-p3', 'build-1');

  // P1 Chrome has browser_version
  assert.equal(capsP1.browser, 'chrome');
  assert.equal(capsP1.browser_version, 'latest');
  assert.equal(capsP1.os, 'Windows');
  assert.equal(capsP1.os_version, '11');

  // P2 Firefox MUST NOT have browser_version
  assert.equal(capsP2.browser, 'playwright-firefox');
  assert.equal(capsP2.browser_version, undefined);
  assert.equal(capsP2.os, 'Windows');
  assert.equal(capsP2.os_version, '11');

  // P3 Android MUST have realMobile='true' and NO os_version / browser_version
  assert.equal(capsP3.browser, 'chrome');
  assert.equal(capsP3.realMobile, 'true');
  assert.equal(capsP3.deviceName, 'Samsung Galaxy S23');
  assert.equal(capsP3.osVersion, '13.0');
  assert.equal(capsP3.os_version, undefined);
  assert.equal(capsP3.browser_version, undefined);
});

test('redacts_plain_and_urlencoded_access_key', () => {
  const env = loadCloudEnv(
    {
      BROWSERSTACK_USERNAME: 'test_user',
      BROWSERSTACK_ACCESS_KEY: 'secretKey999',
    },
    mockCompatibility,
    'run-02'
  );

  const rawString =
    'Connecting wss://test_user:secretKey999@cdp.browserstack.com or key=secretKey999 or encoded key=secretKey%39%39%39';
  const scrubbed = redactSecrets(rawString, env) as string;

  assert.ok(!scrubbed.includes('secretKey999'));
  assert.ok(!scrubbed.includes(encodeURIComponent('secretKey999')));
  assert.ok(scrubbed.includes('[REDACTED]'));

  // Object scrub
  const obj = {
    url: 'wss://test_user:secretKey999@cdp.browserstack.com',
    nested: {
      auth: 'Basic dGVzdF91c2VyOnNlY3JldEtleTk5OQ==',
      key: 'secretKey999',
    },
  };
  const scrubbedObj = redactSecrets(obj, env) as typeof obj;
  assert.ok(!JSON.stringify(scrubbedObj).includes('secretKey999'));
  assert.ok(!JSON.stringify(scrubbedObj).includes('dGVzdF91c2VyOnNlY3JldEtleTk5OQ=='));
});
