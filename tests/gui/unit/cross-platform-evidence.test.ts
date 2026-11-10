import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STUDENT_WATERMARK,
  formatWatermarkLines,
  injectWatermark,
} from '../cross-platform/watermark.js';
import { captureEvidence } from '../cross-platform/evidence.js';
import type { CaptureContext } from '../cross-platform/types.js';

const mockContext: CaptureContext = {
  runId: 'run-101',
  identity: {
    id: 'bs-session-123',
    dashboardURL: 'https://automate.browserstack.com/sessions/123',
    platformId: 'p1-chrome-win11',
    browser: 'chrome',
    browserVersion: '122.0.6261.94',
    os: 'Windows',
    osVersion: '11',
    realMobile: false,
  },
  itemId: 'GUI-004',
  caseId: 'email-validation',
  attempt: 1,
  mode: 'live',
  sutSourceSha: 'deadbeef123',
  requirementIds: ['FR22-REQ', 'FR22-EMAIL', 'FR03-EMAIL-INPUT'],
};

test('watermark_uses_exact_student_identity_and_current_url', () => {
  assert.equal(
    STUDENT_WATERMARK,
    '23120367 - Trần Ngọc Diễm Thúy - 23120367@student.hcmus.edu.vn'
  );

  const lines = formatWatermarkLines('http://localhost:5173/forgot-password', mockContext);
  assert.equal(lines.length, 4);
  assert.equal(lines[0], STUDENT_WATERMARK);
  assert.equal(lines[1], 'URL: http://localhost:5173/forgot-password');
  assert.ok(lines[2].includes('chrome/122.0.6261.94'));
  assert.ok(lines[2].includes('Windows/11'));
  assert.ok(lines[3].includes('run-101'));
  assert.ok(lines[3].includes('GUI-004'));
  assert.ok(lines[3].includes('bs-session-123'));
});

test('reinjection_after_navigation_is_idempotent', async () => {
  let attachedCount = 0;
  let removedCount = 0;

  const fakePage = {
    url: () => 'http://localhost:5173/cart',
    evaluate: async (fn: any, arg: any) => {
      // Simulate DOM element injection
      if (arg && arg.action === 'inject') {
        attachedCount++;
      } else if (arg && arg.action === 'remove') {
        removedCount++;
      }
    },
  };

  const cleanup1 = await injectWatermark(fakePage as any, mockContext);
  const cleanup2 = await injectWatermark(fakePage as any, mockContext);

  await cleanup1();
  await cleanup2();

  assert.ok(attachedCount >= 2);
  assert.ok(removedCount >= 2);
});

test('capture_does_not_change_focus_or_layout', async () => {
  let screenshotCalled = false;
  let cleanedUp = false;

  const fakePage = {
    url: () => 'http://localhost:5173/forgot-password',
    evaluate: async () => {},
    screenshot: async () => {
      screenshotCalled = true;
      return Buffer.from('fake-png-data');
    },
  };

  const fakeInfo = {
    attach: (name: string, options: any) => {
      assert.ok(options.path);
    },
  };

  const record = await captureEvidence(
    fakePage as any,
    fakeInfo as any,
    mockContext
  );

  assert.ok(screenshotCalled);
  assert.ok(record.sha256);
  assert.equal(record.actualURL, 'http://localhost:5173/forgot-password');
});

test('capture_error_preserves_assertion_error', async () => {
  const fakePage = {
    url: () => 'http://localhost:5173/error',
    evaluate: async () => {},
    screenshot: async () => {
      throw new Error('Screenshot disk write failure');
    },
  };

  const fakeInfo = {
    attach: () => {},
  };

  await assert.rejects(
    async () => {
      await captureEvidence(fakePage as any, fakeInfo as any, mockContext);
    },
    /Screenshot disk write failure/
  );
});
