import test from 'node:test';
import assert from 'node:assert/strict';
import { holdRecordedWatermark } from '../cross-platform/evidence.ts';

test('recording watermark is visible on the foreground tab before the hold', async () => {
  const events: string[] = [];
  const page: any = {
    bringToFront: async () => events.push('foreground'),
    url: () => 'http://bs-local.com:5173/cart',
    evaluate: async (_: any, arg: any) => {
      assert.ok(arg.lines[0].includes('23120367@student.hcmus.edu.vn'));
      events.push('watermark');
    },
    waitForTimeout: async (ms: number) => { assert.equal(ms,4000); events.push('hold'); },
  };
  const context: any = {runId:'test',itemId:'GUI-044',caseId:'confirm',attempt:1,
    identity:{id:'real-session',browser:'chrome',browserVersion:'1',os:'Windows',osVersion:'11'}};
  const marker=await holdRecordedWatermark(page, context);
  assert.deepEqual(events,['foreground','watermark','hold']);
  assert.equal(marker.actualURL,'http://bs-local.com:5173/cart');
  assert.equal(marker.sessionId,'real-session');
});

test('native device capture uses the verified context device, not a page screenshot', async () => {
  const {registerNativeCapture,captureNativeDeviceFrame}=await import('../cross-platform/evidence.ts');
  const context:any={};const calls:string[]=[];
  registerNativeCapture(context,async path=>{calls.push(path);});
  const page:any={context:()=>context};
  assert.equal(await captureNativeDeviceFrame(page,'device.png'),true);
  assert.deepEqual(calls,['device.png']);
  assert.equal(await captureNativeDeviceFrame({context:()=>({})} as any,'other.png'),false);
});
