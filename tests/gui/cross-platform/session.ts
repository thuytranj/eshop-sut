import type {
  PlatformSpec,
  CloudEnv,
  VerifiedSession,
  RemoteSession,
  Playwright,
  Page,
} from './types.js';
import { buildCapabilities } from './config.js';

export function assertSessionIdentity(
  rawDetails: unknown,
  platform: PlatformSpec
): VerifiedSession {
  if (!rawDetails || typeof rawDetails !== 'object' || Object.keys(rawDetails).length === 0) {
    throw new Error('Invalid or missing session details from provider');
  }

  const details = rawDetails as Record<string, any>;
  const id = details.hashed_id || details.id || '';
  const dashboardURL = details.browser_url || details.dashboard_url || details.public_url || '';
  const browser = String(details.browser || '').toLowerCase();
  const browserVersion = String(details.browser_version || details.browserVersion || '');
  const os = String(details.os || '');
  const osVersion = String(details.os_version || details.osVersion || '');
  const device = details.device || details.deviceName;
  const realMobile = Boolean(details.realMobile === true || details.real_mobile === true || (details.realMobile === 'true'));

  if (!id && !dashboardURL) {
    throw new Error('Invalid or missing session details: session id is empty');
  }

  if (platform.id === 'p1-chrome-win11') {
    if (os.toLowerCase() !== 'windows') {
      throw new Error(`Remote OS mismatch: expected Windows, got ${os}`);
    }
    if (osVersion !== '11') {
      throw new Error(`Remote OS version mismatch: expected 11, got ${osVersion}`);
    }
    if (!browser.includes('chrome')) {
      throw new Error(`Remote browser mismatch: expected chrome, got ${browser}`);
    }
  } else if (platform.id === 'p2-firefox-win11') {
    if (os.toLowerCase() !== 'windows') {
      throw new Error(`Remote OS mismatch: expected Windows, got ${os}`);
    }
    if (osVersion !== '11') {
      throw new Error(`Remote OS version mismatch: expected 11, got ${osVersion}`);
    }
    if (!browser.includes('firefox')) {
      throw new Error(`Remote browser mismatch: expected firefox, got ${browser}`);
    }
  } else if (platform.id === 'p3-android-chrome') {
    if (!realMobile) {
      throw new Error('Real mobile device required for Android Chrome execution');
    }
    if (os.toLowerCase() !== 'android') {
      throw new Error(`Remote OS mismatch: expected android, got ${os}`);
    }
    const expectedDevice = platform.requested.deviceName;
    if (expectedDevice && (!device || !String(device).toLowerCase().includes(expectedDevice.toLowerCase()))) {
      throw new Error(`Device mismatch: expected ${expectedDevice}, got ${device || 'unknown'}`);
    }
    if (!browser.includes('chrome')) {
      throw new Error(`Remote browser mismatch: expected chrome, got ${browser}`);
    }
  }

  return {
    id,
    dashboardURL,
    platformId: platform.id,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    realMobile,
  };
}

export async function setRemoteStatus(
  page: Page,
  status: 'passed' | 'failed',
  reason: string
): Promise<void> {
  try {
    const payload = JSON.stringify({
      action: 'setSessionStatus',
      arguments: {
        status,
        reason,
      },
    });
    await page.evaluate((_: unknown) => {}, `browserstack_executor: ${payload}`);
  } catch (err) {
    // If provider is already closed or disconnected, ignore status error so we don't mask test outcome
    console.error('Failed to set remote session status:', err);
  }
}

export async function openRemoteSession(
  playwright: Playwright,
  platform: PlatformSpec,
  env: CloudEnv,
  name: string,
  build: string,
  options?: {
    fetchSessionDetails?: (page: Page) => Promise<any>;
  }
): Promise<RemoteSession> {
  const caps = buildCapabilities(platform, env, name, build);
  const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
    JSON.stringify(caps)
  )}`;

  let allocatedBrowser: any = null;
  let allocatedDevice: any = null;
  let context: any = null;

  try {
    if (platform.transport === 'desktop') {
      allocatedBrowser = await playwright.chromium.connect({
        wsEndpoint,
        timeout: 90000,
      });

      context = await allocatedBrowser.newContext({
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh',
        viewport: { width: 1440, height: 900 },
      });
    } else {
      // Android transport via Playwright Android API
      const android = (playwright as any)._android;
      if (!android) {
        throw new Error('Playwright _android API is not available on this version');
      }

      allocatedDevice = await android.connect(wsEndpoint, {
        timeout: 90000,
      });

      // Launch browser on device
      context = await allocatedDevice.launchBrowser({
        command: 'chrome',
      });
    }

    // Retrieve and verify session identity using temporary bootstrap page
    let rawDetails: any;
    if (options?.fetchSessionDetails) {
      rawDetails = await options.fetchSessionDetails(null as any);
    } else {
      const bootstrapPage = await context.newPage();
      try {
        const rawJson = await bootstrapPage.evaluate(
          (_: unknown) => {},
          'browserstack_executor: {"action": "getSessionDetails"}'
        );
        rawDetails = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      } finally {
        await bootstrapPage.close().catch(() => {});
      }
    }

    const identity = assertSessionIdentity(rawDetails, platform);

    return {
      context,
      identity,
      close: async () => {
        try {
          if (context) await context.close();
        } catch {}
        try {
          if (allocatedBrowser) await allocatedBrowser.close();
        } catch {}
        try {
          if (allocatedDevice) await allocatedDevice.close();
        } catch {}
      },
    };
  } catch (error) {
    // If setup failed after allocating resources, clean up immediately
    try {
      if (context) await context.close();
    } catch {}
    try {
      if (allocatedBrowser) await allocatedBrowser.close();
    } catch {}
    try {
      if (allocatedDevice) await allocatedDevice.close();
    } catch {}
    throw error;
  }
}
