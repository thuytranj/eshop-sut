import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { type APIRequestContext } from '@playwright/test';
import { type Product, type Category } from '../fixtures/products.ts';
import { type TestAccount, TEST_ACCOUNTS } from '../fixtures/accounts.ts';

export async function startIsolatedBackend(options: {
  repoRoot: string;
  runDir: string;
  port?: number;
}): Promise<{ apiURL: string; stop(): Promise<void> }> {
  const port = options.port || 3000;
  const sandboxDir = path.join(options.runDir, 'backend-sandbox');
  fs.mkdirSync(sandboxDir, { recursive: true });

  // Copy server files into isolated sandbox
  const backendSrc = path.join(options.repoRoot, 'backend');
  fs.copyFileSync(path.join(backendSrc, 'server.js'), path.join(sandboxDir, 'server.js'));
  fs.copyFileSync(path.join(backendSrc, 'database.js'), path.join(sandboxDir, 'database.js'));
  fs.copyFileSync(path.join(backendSrc, 'package.json'), path.join(sandboxDir, 'package.json'));

  // Link node_modules
  const targetNodeModules = path.join(sandboxDir, 'node_modules');
  if (!fs.existsSync(targetNodeModules)) {
    try {
      fs.symlinkSync(path.join(backendSrc, 'node_modules'), targetNodeModules, 'dir');
    } catch {
      // Fallback: directory junction on Windows or copy if needed
    }
  }

  let stderrLogs = '';
  let proc: ChildProcess | null = spawn('node', ['server.js'], {
    cwd: sandboxDir,
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stderr?.on('data', (chunk) => {
    stderrLogs += chunk.toString();
  });

  const apiURL = `http://127.0.0.1:${port}/api`;

  // Poll until server is ready (max 30 seconds)
  const startTime = Date.now();
  let isReady = false;
  while (Date.now() - startTime < 30000) {
    try {
      const res = await fetch(`${apiURL}/products`);
      if (res.ok) {
        isReady = true;
        break;
      }
    } catch {
      try {
        const resLocal = await fetch(`http://localhost:${port}/api/products`);
        if (resLocal.ok) {
          isReady = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  if (!isReady) {
    if (proc) {
      proc.kill();
    }
    throw new Error(`Isolated backend failed to start on port ${port} within timeout. Stderr: ${stderrLogs}`);
  }

  return {
    apiURL,
    async stop() {
      if (proc) {
        proc.kill('SIGTERM');
        proc = null;
      }
    },
  };
}

export async function prepareLiveFixtures(
  api: APIRequestContext,
  apiURL: string,
  runId: string
): Promise<{ products: Product[]; categories: Category[]; accounts: TestAccount[] }> {
  const prodRes = await api.get(`${apiURL}/products`);
  const products: Product[] = await prodRes.json();

  const catRes = await api.get(`${apiURL}/categories`);
  const categories: Category[] = await catRes.json();

  return {
    products,
    categories,
    accounts: Object.values(TEST_ACCOUNTS),
  };
}

export async function restoreProductBaseline(
  api: APIRequestContext,
  apiURL: string,
  baseline: Product[]
): Promise<void> {
  // Restore products baseline in sandbox if modified
  for (const prod of baseline) {
    try {
      await api.put(`${apiURL}/products/${prod.id}`, {
        data: prod,
      });
    } catch {}
  }
}
