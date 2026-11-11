import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import type {
  CloudRunOptions,
  RunSummary,
  PlatformCell,
  VerifiedSession,
  SessionArtifact,
  CloudEnv,
  PlatformId,
} from './types.js';
import { PLATFORMS, loadCloudEnv } from './config.js';
import { startLocalEnvironment } from './local-environment.js';
import { startLocalTunnel } from './local-tunnel.js';

export function acquireRunnerLock(
  lockFilePath: string,
  runId: string
): { acquired: boolean; existingPid?: number } {
  fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });

  if (fs.existsSync(lockFilePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(lockFilePath, 'utf-8'));
      const pid = content.pid;
      // Check if process is still running
      try {
        process.kill(pid, 0);
        // Process is alive
        return { acquired: false, existingPid: pid };
      } catch {
        // Process is dead, stale lock can be overwritten
      }
    } catch {
      // Malformed lock file, can be overwritten
    }
  }

  const payload = {
    pid: process.pid,
    runId,
    startedAt: new Date().toISOString(),
  };
  fs.writeFileSync(lockFilePath, JSON.stringify(payload, null, 2), 'utf-8');
  return { acquired: true };
}

export function releaseRunnerLock(lockFilePath: string): void {
  try {
    if (fs.existsSync(lockFilePath)) {
      fs.unlinkSync(lockFilePath);
    }
  } catch {}
}

export async function waitForSessionEnd(
  sessionId: string,
  env: CloudEnv,
  timeoutMs = 60000,
  apiFetcher?: (id: string) => Promise<any>
): Promise<void> {
  const startTime = Date.now();
  const pollInterval = 2000;

  while (Date.now() - startTime < timeoutMs) {
    let status = 'done';
    if (apiFetcher) {
      const details = await apiFetcher(sessionId);
      status = details?.automation_session?.status || 'done';
    }
    if (status !== 'running') {
      return;
    }
    await new Promise(r => setTimeout(r, pollInterval));
  }

  throw new Error(`Session ${sessionId} did not reach terminal state within ${timeoutMs}ms`);
}

export async function collectSessionArtifacts(
  session: VerifiedSession,
  env: CloudEnv,
  outDir: string,
  options?: { fetchSessionDetails?: (id: string) => Promise<any> }
): Promise<SessionArtifact[]> {
  fs.mkdirSync(outDir, { recursive: true });
  const artifacts: SessionArtifact[] = [];

  let sessionData: any = null;
  try {
    if (options?.fetchSessionDetails) {
      sessionData = await options.fetchSessionDetails(session.id);
    }
  } catch {}

  const autoSession = sessionData?.automation_session;

  // Video artifact
  if (autoSession?.video_url) {
    artifacts.push({
      sessionId: session.id,
      kind: 'video',
      state: 'available',
      path: autoSession.video_url,
    });
  } else {
    artifacts.push({
      sessionId: session.id,
      kind: 'video',
      state: 'unavailable',
      reason: 'Video recording pending or not available for platform',
    });
  }

  // Logs artifact
  if (autoSession?.logs) {
    artifacts.push({
      sessionId: session.id,
      kind: 'log',
      state: 'available',
      path: autoSession.logs,
    });
  } else {
    artifacts.push({
      sessionId: session.id,
      kind: 'log',
      state: 'unavailable',
      reason: 'Logs not yet processed',
    });
  }

  return artifacts;
}

export async function runPlatforms(
  options: CloudRunOptions,
  deps?: {
    executeProject?: (platformId: PlatformId) => Promise<void>;
    checkDrift?: () => boolean;
    isOrphanSession?: (err: Error) => boolean;
    lockFile?: string;
  }
): Promise<RunSummary> {
  const lockFile =
    deps?.lockFile ||
    path.resolve('artifacts/gui/cross-platform', `runner-${options.runId}.lock`);

  const lockResult = acquireRunnerLock(lockFile, options.runId);
  if (!lockResult.acquired) {
    throw new Error(
      `Exclusive coordinator lock rejected: process ${lockResult.existingPid} is currently active.`
    );
  }

  let infrastructureErrors = 0;
  const platformIds: PlatformId[] = [
    'p1-chrome-win11',
    'p2-firefox-win11',
    'p3-android-chrome',
  ];

  try {
    for (const pid of platformIds) {
      // Check source drift before spawning next platform
      if (deps?.checkDrift && deps.checkDrift()) {
        throw new Error(`Source drift detected before running ${pid}. Cohort execution aborted.`);
      }

      if (deps?.executeProject) {
        try {
          await deps.executeProject(pid);
        } catch (err: any) {
          if (deps.isOrphanSession && deps.isOrphanSession(err)) {
            // Unreleased remote slot or orphan session: stop cohort
            infrastructureErrors++;
            throw err;
          }
          // Product assertion failures continue to next platform
          if (err.message?.includes('assertion') || err.message?.includes('Product')) {
            // Product failure
          } else {
            infrastructureErrors++;
          }
        }
      }
    }

    return {
      runId: options.runId,
      cells: [],
      infrastructureErrors,
      evidenceGaps: 0,
    };
  } finally {
    releaseRunnerLock(lockFile);
  }
}

// CLI Execution entry point
async function cli(): Promise<void> {
  const args = process.argv.slice(2);
  let phase: 'preflight' | 'pilot' | 'qualification' = 'qualification';
  let runId = `run-${Date.now()}`;
  let resume = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--phase' && args[i + 1]) {
      phase = args[i + 1] as any;
      i++;
    } else if (args[i] === '--run-id' && args[i + 1]) {
      runId = args[i + 1];
      i++;
    } else if (args[i] === '--resume') {
      resume = true;
    }
  }

  // Load .env if present
  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const envPath = path.join(repoRoot, 'tests/gui/.env');
  if (fs.existsSync(envPath) && typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile(envPath);
  }

  console.log(`Starting Cross-Platform Runner [Phase: ${phase}, RunId: ${runId}]`);

  const runDir = path.join(repoRoot, 'artifacts/gui/cross-platform', runId);
  fs.mkdirSync(runDir, { recursive: true });

  let localEnv: any = null;
  let tunnel: any = null;

  try {
    const remoteHost = 'bs-local.com';
    console.log(`Starting SUT local environment (backend, web, admin on ${remoteHost})...`);
    localEnv = await startLocalEnvironment({
      repoRoot,
      runDir,
      remoteHost,
    });
    console.log('SUT local environment is healthy and ready.');

    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
    if (!accessKey) {
      throw new Error('BROWSERSTACK_ACCESS_KEY is required in .env');
    }
    const localIdentifier = `hw03-23120367-${runId}`;
    console.log(`Starting BrowserStack Local tunnel (identifier: ${localIdentifier})...`);
    tunnel = await startLocalTunnel({
      accessKey,
      localIdentifier,
    });
    console.log('BrowserStack Local tunnel is active and ready.');

    const summary = await runPlatforms(
      { runId, phase, resume },
      {
        executeProject: async (platformId: PlatformId) => {
          console.log(`\n========================================`);
          console.log(`Executing Project: ${platformId} (workers: 1)`);
          console.log(`========================================\n`);

          const playwrightArgs = [
            'test',
            '--config=playwright.browserstack.config.ts',
            `--project=${platformId}`,
          ];

          if (phase === 'preflight') {
            playwrightArgs.push('-g', '@smoke');
          } else if (phase === 'pilot') {
            playwrightArgs.push('-g', 'GUI-004|GUI-017|GUI-041|GUI-044');
          }

          await new Promise<void>((resolve, reject) => {
            const child = spawn('npx', ['playwright', ...playwrightArgs], {
              cwd: path.join(repoRoot, 'tests/gui'),
              env: {
                ...process.env,
                RUN_ID: runId,
                RUN_DIR: runDir,
                SUT_WEB_BASE_URL: localEnv.remoteURLs.web,
                SUT_ADMIN_BASE_URL: localEnv.remoteURLs.admin,
                SUT_API_BASE_URL: localEnv.remoteURLs.api,
              },
              stdio: 'inherit',
            });

            child.on('close', code => {
              if (code === 0) {
                resolve();
              } else {
                // Non-zero exit code might be test assertion failure
                console.warn(`Project ${platformId} completed with exit code ${code}`);
                resolve();
              }
            });

            child.on('error', err => reject(err));
          });
        },
      }
    );

    console.log(`\nRunner completed. Infrastructure errors: ${summary.infrastructureErrors}`);
  } finally {
    if (tunnel) {
      console.log('Stopping BrowserStack Local tunnel...');
      await tunnel.stop().catch(() => {});
    }
    if (localEnv) {
      console.log('Stopping SUT local environment...');
      await localEnv.stop().catch(() => {});
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('run.ts')) {
  cli().catch(err => {
    console.error('Cross-Platform Runner error:', err);
    process.exit(1);
  });
}
