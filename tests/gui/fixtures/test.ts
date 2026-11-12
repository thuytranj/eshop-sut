import { captureEndOfTest, registerNativeCapture } from '../cross-platform/evidence.ts';
import { test as baseTest, expect, type BrowserContext, type Page } from '@playwright/test';
import { PLATFORMS, loadCloudEnv } from '../cross-platform/config.js';
import { openRemoteSession, setRemoteStatus, selectTestPage } from '../cross-platform/session.js';
import type {
  SutURLs,
  CaptureContext,
  PlatformId,
  VerifiedSession,
  RemoteSession,
  ItemId,
  Mode,
} from '../cross-platform/types.js';

export interface TestFixtures {
  sutURLs: SutURLs;
  runnerURLs: SutURLs;
  captureContext: () => CaptureContext | null;
}

export const test = baseTest.extend<TestFixtures>({
  sutURLs: async ({}, use) => {
    const web = process.env.SUT_WEB_BASE_URL || 'http://localhost:5173';
    const admin = process.env.SUT_ADMIN_BASE_URL || 'http://localhost:5174';
    const api = process.env.SUT_API_BASE_URL || 'http://localhost:3000/api';
    await use({ web, admin, api });
  },

  runnerURLs: async ({}, use) => {
    await use({
      web: 'http://localhost:5173',
      admin: 'http://localhost:5174',
      api: 'http://localhost:3000/api',
    });
  },

  // Override context to connect to remote session when cloud project is active
  context: [async ({ playwright }, use, testInfo) => {
    const platformId = testInfo.project.metadata?.platformId as PlatformId | undefined;

    if (!platformId) {
      // Local execution fallback: create standard local browser context
      // Note: we let default playwright context work
      const browser = testInfo.project.use.defaultBrowserType
        ? await (playwright as any)[testInfo.project.use.defaultBrowserType].launch()
        : await playwright.chromium.launch();
      const localContext = await browser.newContext(testInfo.project.use);
      try {
        await use(localContext);
      } finally {
        await localContext.close();
        await browser.close();
      }
      return;
    }

    // Cloud execution path
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (!platform) {
      throw new Error(`Unknown platformId "${platformId}" in project metadata`);
    }

    const runId =
      (testInfo.project.metadata?.runId as string) || process.env.RUN_ID || 'default-run';
    const env = loadCloudEnv(
      process.env,
      {
        clientVersion: '1.65.0',
        remoteVersions: {
          'p1-chrome-win11': 'latest',
          'p2-firefox-win11': 'latest',
          'p3-android-chrome': 'latest',
        },
        verified: true,
      },
      runId,
      { phase: 'qualification', verifiedMapping: true }
    );

    const testTitle = `${platform.id}/${testInfo.title}`;
    const buildName =
      (testInfo.project.metadata?.buildName as string) ||
      process.env.BUILD_NAME ||
      `hw03-cp-${runId}`;

    let remoteSession: RemoteSession | null = null;
    try {
      remoteSession = await openRemoteSession(
        playwright,
        platform,
        env,
        testTitle,
        buildName
      );

      // Attach verified session metadata to testInfo annotations
      testInfo.annotations.push({
        type: 'sessionIdentity',
        description: JSON.stringify(remoteSession.identity),
      });

      if (typeof remoteSession.context.setDefaultNavigationTimeout === 'function') {
        remoteSession.context.setDefaultNavigationTimeout(60000);
      }
      if (typeof remoteSession.context.setDefaultTimeout === 'function') {
        remoteSession.context.setDefaultTimeout(30000);
      }

      if(remoteSession.nativeScreenshot) registerNativeCapture(remoteSession.context,remoteSession.nativeScreenshot);
      await use(remoteSession.context);
    } finally {
      if (remoteSession) {
        await remoteSession.close();
      }
    }
  }, { scope: 'test', timeout: 120000 }],

  page: async ({ context }, use, testInfo) => {
    const page = await selectTestPage(context, testInfo.project.metadata?.platformId as string | undefined);
    if (testInfo.project.metadata?.platformId) {
      await page.bringToFront();
    }
    if (typeof page.setDefaultNavigationTimeout === 'function') {
      page.setDefaultNavigationTimeout(60000);
    }
    if (typeof page.setDefaultTimeout === 'function') {
      page.setDefaultTimeout(30000);
    }
    try {
      await use(page);
    } finally {
      try { await captureEndOfTest(page, testInfo); } catch {}
      const platformId = testInfo.project.metadata?.platformId as PlatformId | undefined;
      if (platformId) {
        try {
          const status = testInfo.status === 'passed' ? 'passed' : 'failed';
          const reason =
            testInfo.error?.message?.slice(0, 200) || `Test finished with status ${status}`;
          await setRemoteStatus(page, status, reason);
        } catch {}
      } else {
        try {
          await page.close();
        } catch {}
      }
    }
  },

  captureContext: async ({}, use, testInfo) => {
    const getContext = (): CaptureContext | null => {
      const platformId = testInfo.project.metadata?.platformId as PlatformId | undefined;
      if (!platformId) return null;

      const identityAnnotation = testInfo.annotations.find(a => a.type === 'sessionIdentity');
      if (!identityAnnotation?.description) return null;

      let identity: VerifiedSession;
      try {
        identity = JSON.parse(identityAnnotation.description);
      } catch {
        return null;
      }

      const itemId = (testInfo.annotations.find(a => a.type === 'itemId')?.description ||
        'GUI-000') as ItemId;
      const caseId =
        testInfo.annotations.find(a => a.type === 'caseId')?.description || testInfo.title;
      const mode = (testInfo.annotations.find(a => a.type === 'mode')?.description ||
        'live') as Mode;
      const requirementIds = (
        testInfo.annotations.find(a => a.type === 'requirementIds')?.description || ''
      )
        .split(';')
        .filter(Boolean);
      const attempt = testInfo.retry + 1;
      const runId = (testInfo.project.metadata?.runId as string) || 'default-run';
      const sutSourceSha = process.env.SUT_SOURCE_SHA || '';

      return {
        runId,
        identity,
        itemId,
        caseId,
        attempt,
        mode,
        sutSourceSha,
        requirementIds,
      };
    };

    await use(getContext);
  },
});

export { expect };
