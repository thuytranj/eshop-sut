import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import crypto from 'node:crypto';
import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import type { Page } from '@playwright/test';
import type { LocalEnvironment, SutURLs } from './types.js';
import { startIsolatedBackend } from '../runner/isolated-backend.js';

export function validateHostMapping(
  remoteHost: 'localhost' | 'bs-local.com',
  customUrls?: Partial<SutURLs>
): SutURLs {
  const host = remoteHost === 'bs-local.com' ? 'bs-local.com' : 'localhost';
  const defaultWeb = `http://${host}:5173`;
  const defaultAdmin = `http://${host}:5174`;
  const defaultApi = `http://${host}:3000/api`;

  if (!customUrls) {
    return { web: defaultWeb, admin: defaultAdmin, api: defaultApi };
  }

  const web = customUrls.web || defaultWeb;
  const admin = customUrls.admin || defaultAdmin;
  const api = customUrls.api || defaultApi;

  // Check host consistency
  const webHost = new URL(web).hostname;
  const adminHost = new URL(admin).hostname;
  const apiHost = new URL(api).hostname;

  if (webHost !== host || adminHost !== host || apiHost !== host) {
    throw new Error(
      `Host mapping inconsistent: all services must match remoteHost "${host}". Got web=${webHost}, admin=${adminHost}, api=${apiHost}`
    );
  }

  return { web, admin, api };
}

async function isPortFree(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

function computeDirDigest(dirPath: string): string {
  const hash = crypto.createHash('sha256');
  if (!fs.existsSync(dirPath)) return 'missing';

  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
        continue;
      }
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        hash.update(entry.name);
        hash.update(fs.readFileSync(full));
      }
    }
  }

  walk(dirPath);
  return hash.digest('hex');
}

export async function probeRemoteSut(
  page: Page,
  urls: SutURLs,
  expectedProductsSha256?: string
): Promise<void> {
  // Navigate to web
  await page.goto(urls.web, { waitUntil: 'domcontentloaded' });

  // In-page evaluate fetch to probe API reachability through tunnel
  const probeResult = await page.evaluate(async (apiUrl: string) => {
    try {
      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) {
        return { ok: false, status: res.status, error: `HTTP ${res.status}` };
      }
      const data = await res.json();
      return { ok: true, status: res.status, productsCount: Array.isArray(data) ? data.length : 0 };
    } catch (err: any) {
      return { ok: false, status: 0, error: err?.message || String(err) };
    }
  }, urls.api);

  if (!probeResult.ok) {
    throw new Error(`Remote SUT API probe failed via remote browser: ${probeResult.error}`);
  }
}

export async function startLocalEnvironment(options: {
  repoRoot: string;
  runDir: string;
  remoteHost: 'localhost' | 'bs-local.com';
  portOverrides?: Record<string, number>;
}): Promise<LocalEnvironment> {
  const backendPort = options.portOverrides?.backend ?? 3000;
  const webPort = options.portOverrides?.web ?? 5173;
  const adminPort = options.portOverrides?.admin ?? 5174;

  // Check ports are free
  for (const [name, port] of [
    ['backend', backendPort],
    ['web', webPort],
    ['admin', adminPort],
  ] as const) {
    const free = await isPortFree(port);
    if (!free) {
      throw new Error(`Port conflict: port ${port} is already in use by another process (${name})`);
    }
  }

  const runnerURLs: SutURLs = {
    web: `http://localhost:${webPort}`,
    admin: `http://localhost:${adminPort}`,
    api: `http://localhost:${backendPort}/api`,
  };

  const remoteURLs = validateHostMapping(options.remoteHost);

  // Compute digests
  const sourceSha = 'hw03-local-source';
  const contentSha256 = computeDirDigest(path.join(options.repoRoot, 'backend'));

  const spawnedProcesses: ChildProcess[] = [];

  // Bundle modules before crossing the remote tunnel: dev-mode module waterfalls
  // can leave React unhydrated for most of a cloud test's time budget.
  const frontendMode = process.env.CP_STATIC_FRONTEND === '0' ? 'dev' : 'preview';
  if (frontendMode === 'preview') {
    for (const frontend of ['frontend-web', 'frontend-admin']) {
      execFileSync('npm', ['run', 'build'], {
        cwd: path.join(options.repoRoot, frontend),
        env: { ...process.env, VITE_API_URL: remoteURLs.api },
        stdio: 'inherit',
      });
    }
  }

  // Start isolated backend
  const backend = await startIsolatedBackend({
    repoRoot: options.repoRoot,
    runDir: options.runDir,
    port: backendPort,
  });

  // Start frontend-web Vite process
  const webDir = path.join(options.repoRoot, 'frontend-web');
  const webProc = spawn(
    'npm',
    ['run', frontendMode, '--', '--host', '127.0.0.1', '--port', String(webPort), '--strictPort'],
    {
      cwd: webDir,
      env: {
        ...process.env,
        VITE_API_URL: remoteURLs.api,
        __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: 'bs-local.com',
      },
      stdio: 'ignore',
    }
  );
  spawnedProcesses.push(webProc);

  // Start frontend-admin Vite process
  const adminDir = path.join(options.repoRoot, 'frontend-admin');
  const adminProc = spawn(
    'npm',
    ['run', frontendMode, '--', '--host', '127.0.0.1', '--port', String(adminPort), '--strictPort'],
    {
      cwd: adminDir,
      env: {
        ...process.env,
        VITE_API_URL: remoteURLs.api,
        __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: 'bs-local.com',
      },
      stdio: 'ignore',
    }
  );
  spawnedProcesses.push(adminProc);

  // Poll until web and admin frontends are ready
  const startWait = Date.now();
  while (Date.now() - startWait < 30000) {
    try {
      const [resWeb, resAdmin] = await Promise.all([
        fetch(runnerURLs.web),
        fetch(runnerURLs.admin),
      ]);
      if (resWeb.ok && resAdmin.ok) {
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }

  return {
    runnerURLs,
    remoteURLs,
    sourceSha,
    contentSha256,
    stop: async () => {
      await backend.stop().catch(() => {});
      for (const p of spawnedProcesses) {
        try {
          p.kill('SIGTERM');
        } catch {}
      }
    },
  };
}
