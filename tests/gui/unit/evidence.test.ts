import test from 'node:test';
import assert from 'node:assert/strict';
import { runCheck } from '../support/evidence.ts';

test('captures_before_cleanup_and_rethrows_original', async () => {
  let attached = false;
  const mockTestInfo = {
    attach: async (name: string, data: any) => {
      attached = true;
    },
  } as any;

  const mockPage = {
    screenshot: async () => Buffer.from('fake-png'),
  } as any;

  await assert.rejects(
    async () => {
      await runCheck(mockTestInfo, mockPage, 'step-fail', async () => {
        throw new Error('Specific assertion error');
      });
    },
    /Specific assertion error/
  );

  assert.equal(attached, true);
});

test('screenshot_error_preserves_assertion_error', async () => {
  const mockTestInfo = {
    attach: async () => {},
  } as any;

  const failingPage = {
    screenshot: async () => {
      throw new Error('Screenshot failed');
    },
  } as any;

  await assert.rejects(
    async () => {
      await runCheck(mockTestInfo, failingPage, 'step-fail', async () => {
        throw new Error('Original assertion error');
      });
    },
    /Original assertion error/
  );
});
