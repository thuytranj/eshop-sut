import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  acquireRunnerLock,
  releaseRunnerLock,
  runPlatforms,
  waitForSessionEnd,
  collectSessionArtifacts,
} from '../cross-platform/run.js';
import type { VerifiedSession, CloudEnv } from '../cross-platform/types.js';

const mockEnv: CloudEnv = {
  username: 'u',
  accessKey: 'k',
  webURL: 'http://localhost:5173',
  adminURL: 'http://localhost:5174',
  apiURL: 'http://localhost:3000/api',
  sutSourceSha: 'sha1',
  localIdentifier: 'hw03-23120367-test',
  clientVersion: '1.65.0',
  remoteVersions: {
    'p1-chrome-win11': 'latest',
    'p2-firefox-win11': 'latest',
    'p3-android-chrome': 'latest',
  },
};

test('runner_lock_rejects_second_process', () => {
  const lockDir = path.resolve('artifacts/gui/cross-platform/test-locks');
  fs.mkdirSync(lockDir, { recursive: true });
  const lockFile = path.join(lockDir, 'runner.lock');

  try {
    if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);

    const lock1 = acquireRunnerLock(lockFile, 'run-1');
    assert.equal(lock1.acquired, true);

    // Second acquire must fail
    const lock2 = acquireRunnerLock(lockFile, 'run-2');
    assert.equal(lock2.acquired, false);
    assert.equal(lock2.existingPid, process.pid);

    releaseRunnerLock(lockFile);
    assert.equal(fs.existsSync(lockFile), false);
  } finally {
    if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
  }
});

test('max_active_session_is_one and next_project_waits_for_remote_close', async () => {
  let activeSessions = 0;
  let maxConcurrent = 0;
  const executionOrder: string[] = [];

  const fakeRunner = async (platformId: string) => {
    activeSessions++;
    maxConcurrent = Math.max(maxConcurrent, activeSessions);
    executionOrder.push(`start-${platformId}`);
    // Simulate test duration
    await new Promise(r => setTimeout(r, 20));
    activeSessions--;
    executionOrder.push(`end-${platformId}`);
  };

  const summary = await runPlatforms(
    { runId: 'run-test-concurrency', phase: 'pilot', resume: false },
    {
      executeProject: fakeRunner,
      checkDrift: () => false,
      lockFile: path.resolve('artifacts/gui/cross-platform/test-concurrency.lock'),
    }
  );

  assert.equal(maxConcurrent, 1, 'Max concurrent sessions must be exactly 1');
  assert.deepEqual(executionOrder, [
    'start-p1-chrome-win11',
    'end-p1-chrome-win11',
    'start-p2-firefox-win11',
    'end-p2-firefox-win11',
    'start-p3-android-chrome',
    'end-p3-android-chrome',
  ]);
});

test('continues_after_product_failure_but_stops_on_orphan_session', async () => {
  // P1 fails with product failure -> P2 still runs
  const ran: string[] = [];
  await runPlatforms(
    { runId: 'run-test-product-fail', phase: 'pilot', resume: false },
    {
      executeProject: async (platformId: string) => {
        ran.push(platformId);
        if (platformId === 'p1-chrome-win11') {
          throw new Error('Product assertion failure');
        }
      },
      checkDrift: () => false,
      isOrphanSession: () => false,
      lockFile: path.resolve('artifacts/gui/cross-platform/test-fail.lock'),
    }
  );

  assert.ok(ran.includes('p1-chrome-win11'));
  assert.ok(ran.includes('p2-firefox-win11'));

  // Orphan session error -> cohort stops immediately
  const ranWithOrphan: string[] = [];
  await assert.rejects(
    async () => {
      await runPlatforms(
        { runId: 'run-test-orphan', phase: 'pilot', resume: false },
        {
          executeProject: async (platformId: string) => {
            ranWithOrphan.push(platformId);
            if (platformId === 'p1-chrome-win11') {
              throw new Error('Orphan session: remote slot was not freed');
            }
          },
          checkDrift: () => false,
          isOrphanSession: (err: Error) => err.message.includes('Orphan session'),
          lockFile: path.resolve('artifacts/gui/cross-platform/test-orphan.lock'),
        }
      );
    },
    /Orphan session/
  );

  assert.deepEqual(ranWithOrphan, ['p1-chrome-win11']);
});

test('source_drift_stops_cohort', async () => {
  let calls = 0;
  await assert.rejects(
    async () => {
      await runPlatforms(
        { runId: 'run-drift', phase: 'pilot', resume: false },
        {
          executeProject: async () => {
            calls++;
          },
          checkDrift: () => calls > 0, // Drifts after first platform
          lockFile: path.resolve('artifacts/gui/cross-platform/test-drift.lock'),
        }
      );
    },
    /Source drift detected/
  );

  assert.equal(calls, 1, 'Only first platform ran before drift stopped cohort');
});

test('collector_keeps_pending_and_missing_artifacts', async () => {
  const session: VerifiedSession = {
    id: 'test-sess-1',
    dashboardURL: 'https://automate.browserstack.com/sessions/1',
    platformId: 'p1-chrome-win11',
    browser: 'chrome',
    browserVersion: '120.0',
    os: 'Windows',
    osVersion: '11',
    realMobile: false,
  };

  const artifacts = await collectSessionArtifacts(session, mockEnv, '/tmp/artifacts-test', {
    fetchSessionDetails: async () => ({
      automation_session: {
        logs: 'https://browserstack.com/logs/1',
        video_url: null, // video not ready or pending
      },
    }),
  });

  const videoArtifact = artifacts.find(a => a.kind === 'video');
  assert.ok(videoArtifact);
  assert.equal(videoArtifact.state, 'unavailable');
});
