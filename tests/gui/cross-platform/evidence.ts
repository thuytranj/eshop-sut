import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Page, TestInfo, Locator } from '@playwright/test';
import type { CaptureContext, EvidenceRecord } from './types.js';
import { injectWatermark } from './watermark.js';

export async function captureEvidence(
  page: Page,
  info: TestInfo,
  context: CaptureContext,
  observed?: Locator
): Promise<EvidenceRecord> {
  const actualURL = page.url();
  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const targetDir = path.join(
    repoRoot,
    'docs/gui-checklist/cross-platform/browser-evidence/captures',
    context.identity.platformId,
    context.runId
  );

  fs.mkdirSync(targetDir, { recursive: true });

  const safeCaseId = context.caseId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const filename = `${context.itemId}__${safeCaseId}__a${context.attempt}__${timestamp}.png`;
  const screenshotPath = path.join(targetDir, filename);

  let cleanupWatermark: (() => Promise<void>) | null = null;
  try {
    cleanupWatermark = await injectWatermark(page, context);

    const buffer = await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    const sha256 = crypto
      .createHash('sha256')
      .update(buffer || fs.readFileSync(screenshotPath))
      .digest('hex');

    if (info && typeof info.attach === 'function') {
      await info.attach(`evidence-${context.itemId}`, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    }

    return {
      path: screenshotPath,
      sha256,
      actualURL,
      capturedAt: new Date().toISOString(),
      context,
    };
  } finally {
    if (cleanupWatermark) {
      await cleanupWatermark();
    }
  }
}

// Leave the overlay on the real page until session teardown so the provider's
// desktop/device recording includes both native browser chrome and identity.
export async function holdRecordedWatermark(page: Page, context: CaptureContext) {
  await page.bringToFront();
  if (context.identity.realMobile) await page.waitForTimeout(12000);
  await injectWatermark(page, context);
  const visibleFrom = new Date().toISOString();
  await page.waitForTimeout(4000);
  return {
    actualURL: page.url(), sessionId: context.identity.id,
    visibleFrom, visibleUntil: new Date().toISOString(), context,
  };
}

const capturedTests = new WeakSet<TestInfo>();
export async function captureEndOfTest(page: Page, info: TestInfo): Promise<void> {
  if (capturedTests.has(info) || page.isClosed()) return;
  if (info.status === info.expectedStatus && process.env.CAPTURE_BROWSER_CHROME !== '1') return;
  capturedTests.add(info);
  const identityText=info.annotations.find(a=>a.type==='sessionIdentity')?.description;
  if (!identityText) return;
  const identity=JSON.parse(identityText);
  const itemId=info.title.match(/GUI-\d{3}/)?.[0] as CaptureContext['itemId'];
  const runId=process.env.RUN_ID || 'local';
  const dir=path.resolve(import.meta.dirname,'../../../docs/gui-checklist/cross-platform/browser-evidence/captures',identity.platformId,runId);
  fs.mkdirSync(dir,{recursive:true});
  const marker=await holdRecordedWatermark(page,{
    runId, identity, itemId,
    caseId:info.annotations.find(a=>a.type==='caseId')?.description || info.title,
    attempt:info.retry+1,mode:(info.annotations.find(a=>a.type==='mode')?.description || 'mock-ui') as CaptureContext['mode'],sutSourceSha:process.env.SUT_SOURCE_SHA || '',requirementIds:[],
  });
  fs.writeFileSync(path.join(dir,`${itemId}-recording-marker.json`),JSON.stringify(marker,null,2));
  const nativePath=path.join(dir,`${itemId}-native.png`);
  const nativeCaptured=await captureNativeDeviceFrame(page,nativePath);
  if (nativeCaptured) {
    fs.writeFileSync(path.join(dir,`${itemId}-recording-marker.json`),JSON.stringify({...marker,nativePath,nativeCapturedAt:new Date().toISOString()},null,2));
    await info.attach('native-device-screen',{path:nativePath,contentType:'image/png'});
  }
  if (process.env.CAPTURE_BROWSER_CHROME === '1') {
    await info.attach('recording-marker', {path:path.join(dir,`${itemId}-recording-marker.json`),contentType:'application/json'});
  } else if (!nativeCaptured) {
    const screenshotPath=path.join(dir,`${itemId}-page-${Date.now()}.png`);
    await page.screenshot({path:screenshotPath,timeout:5000});
    await info.attach('watermarked-page',{path:screenshotPath,contentType:'image/png'});
  }
  await page.evaluate(() => document.getElementById('hw03-evidence-watermark')?.remove());
}

const nativeCaptures = new WeakMap<object, (path:string)=>Promise<void>>();
export function registerNativeCapture(context: object, capture:(path:string)=>Promise<void>) { nativeCaptures.set(context,capture); }
export async function captureNativeDeviceFrame(page: Page, filePath:string):Promise<boolean> {
  const capture=nativeCaptures.get(page.context());
  if(!capture)return false;
  await capture(filePath);
  return true;
}
