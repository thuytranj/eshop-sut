import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  type ItemId,
  type RunManifest,
  type RunMatrix,
  type CaseDefinition,
  type Attempt,
  type Mode,
} from '../contracts.ts';
import { readChecklist, commitResults } from '../checklist/excel-store.ts';
import { getCaseCatalog } from '../checklist/case-catalog.ts';
import { aggregateResults } from '../reporting/aggregate.ts';
import { startIsolatedBackend } from './isolated-backend.ts';

export interface RunOptions {
  mode: Mode;
  targets: string[];
  ids: ItemId[] | 'all';
  kind: 'diagnostic' | 'qualification';
  writeback: boolean;
  runDir?: string;
  workbookPath?: string;
}

export async function runChecklist(options: RunOptions): Promise<{
  runDir: string;
  exitCode: number;
  matrix: RunMatrix;
}> {
  // Reject non-chrome targets
  for (const t of options.targets) {
    if (t !== 'chrome-local') {
      throw new Error(`Target "${t}" is outside Chrome scope. Only "chrome-local" is supported.`);
    }
  }

  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const workbookPath = options.workbookPath || path.join(repoRoot, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

  const runId = `run-${Date.now()}`;
  const runDir = options.runDir || path.join(repoRoot, 'artifacts/gui', runId);
  fs.mkdirSync(runDir, { recursive: true });

  const { items, sourceSha256 } = await readChecklist(workbookPath);
  const catalog = getCaseCatalog(items, ['chrome-local']);

  const scopeIds: ItemId[] = options.ids === 'all'
    ? items.map((i) => i.id)
    : options.ids;

  const manifest: RunManifest = {
    runId,
    sourceSha256,
    buildCommit: process.env.BUILD_COMMIT || 'HEAD',
    dirty: false,
    scope: scopeIds,
    targetIds: ['chrome-local'],
    kind: options.kind,
    startedAt: new Date().toISOString(),
    executionDataPath: path.join(runDir, 'execution-data.json'),
  };

  let backendServer: { stop(): Promise<void> } | null = null;
  if (options.mode === 'live') {
    backendServer = await startIsolatedBackend({
      repoRoot,
      runDir,
      port: 3000,
    });
  }

  let exitCode = 0;
  const attemptsPath = path.join(runDir, 'attempts.json');

  try {
    // Run playwright tests
    const grepPattern = options.ids === 'all'
      ? undefined
      : `(${scopeIds.join('|')})`;

    const args = ['test', '--project=chrome-local'];
    if (grepPattern) {
      args.push('--grep', grepPattern);
    }

    const testProc = spawn('npx', ['playwright', ...args], {
      cwd: path.resolve(import.meta.dirname, '..'),
      env: {
        ...process.env,
        RUN_ID: runId,
        RUN_DIR: runDir,
        LIVE_RUN: options.mode === 'live' ? 'true' : 'false',
      },
      stdio: 'inherit',
    });

    exitCode = await new Promise<number>((resolve) => {
      testProc.on('close', (code) => resolve(code ?? 1));
      testProc.on('error', () => resolve(1));
    });
  } finally {
    if (backendServer) {
      await backendServer.stop();
    }
  }

  let attempts: Attempt[] = [];
  if (fs.existsSync(attemptsPath)) {
    attempts = JSON.parse(fs.readFileSync(attemptsPath, 'utf-8'));
  }

  const matrix = aggregateResults(manifest, catalog, attempts);
  const matrixPath = path.join(runDir, 'matrix.json');
  fs.writeFileSync(matrixPath, JSON.stringify(matrix, null, 2), 'utf-8');

  if (options.writeback && options.kind === 'qualification') {
    await commitResults(workbookPath, matrix.items, sourceSha256);
  }

  return { runDir, exitCode, matrix };
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  let mode: Mode = 'mock-ui';
  let writeback = false;
  let kind: 'diagnostic' | 'qualification' = 'diagnostic';
  let targets = ['chrome-local'];
  let ids: ItemId[] | 'all' = 'all';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode') mode = args[++i] as Mode;
    if (args[i] === '--writeback') writeback = args[++i] === 'true';
    if (args[i] === '--kind') kind = args[++i] as any;
    if (args[i] === '--targets') targets = args[++i].split(',');
    if (args[i] === '--ids') {
      const val = args[++i];
      ids = val === 'all' ? 'all' : (val.split(',') as ItemId[]);
    }
  }

  const result = await runChecklist({
    mode,
    targets,
    ids,
    kind,
    writeback,
  });

  process.exit(result.exitCode);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
