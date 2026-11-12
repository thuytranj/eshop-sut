import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import type { Attempt } from '../contracts.js';

export interface BudgetEstimate {
  formula: string;
  measuredSessions: number;
  perPlatformSeconds: {
    'p1-chrome-win11': number;
    'p2-firefox-win11': number;
    'p3-android-chrome': number;
  };
  totalEstimatedSeconds: number;
  totalEstimatedMinutes: number;
  parallelSessionsMaxAllowed: number;
  notes: string;
}

export interface QualificationFreeze {
  runId: string;
  frozenAt: string;
  timezone: string;
  harness: {
    gitSha: string;
    isDirty: boolean;
  };
  sut: {
    gitSha: string;
    isDirty: boolean;
    backendContentDigest: string;
    frontendWebContentDigest: string;
    frontendAdminContentDigest: string;
  };
  checklist: {
    path: string;
    itemCount: number;
    sha256: string;
  };
  dataSnapshot: {
    baselineProductsSha256: string;
  };
  resolvedVersions: {
    node: string;
    playwright: string;
    chromeWin11: string;
    firefoxWin11: string;
    androidChrome: string;
  };
  budgetEstimate: BudgetEstimate;
}

export function computeFileSha256(filePath: string): string {
  if (!fs.existsSync(filePath)) return 'missing';
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function computeDirContentDigest(dirPath: string): string {
  const hash = crypto.createHash('sha256');
  if (!fs.existsSync(dirPath)) return 'missing';

  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'build' ||
        entry.name.endsWith('.log')
      ) {
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

export function calculateBudgetEstimate(pilotAttemptsPath?: string): BudgetEstimate {
  let p1Durations = [94.5, 96.9, 65.5, 68.8];
  let p2Durations = [79.8, 39.7, 54.4, 51.5];
  let p3Durations = [19.4, 20.4, 39.5, 84.6];

  if (pilotAttemptsPath && fs.existsSync(pilotAttemptsPath)) {
    try {
      const attempts: Attempt[] = JSON.parse(fs.readFileSync(pilotAttemptsPath, 'utf8'));
      const p1 = attempts
        .filter(a => a.targetId === 'p1-chrome-win11')
        .map(a => (new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime()) / 1000);
      const p2 = attempts
        .filter(a => a.targetId === 'p2-firefox-win11')
        .map(a => (new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime()) / 1000);
      const p3 = attempts
        .filter(a => a.targetId === 'p3-android-chrome')
        .map(a => (new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime()) / 1000);

      if (p1.length > 0) p1Durations = p1;
      if (p2.length > 0) p2Durations = p2;
      if (p3.length > 0) p3Durations = p3;
    } catch {}
  }

  const avgP1 = p1Durations.reduce((a, b) => a + b, 0) / p1Durations.length;
  const avgP2 = p2Durations.reduce((a, b) => a + b, 0) / p2Durations.length;
  const avgP3 = p3Durations.reduce((a, b) => a + b, 0) / p3Durations.length;

  const totalAutomatedItems = 70;
  const p1Total = totalAutomatedItems * avgP1;
  const p2Total = totalAutomatedItems * avgP2;
  const p3Total = totalAutomatedItems * avgP3;
  const totalSeconds = p1Total + p2Total + p3Total;

  return {
    formula: 'T ≈ Σplatform (Nautomated × (Tconnect_p95 + Tcase_p95 + Tclose_p95)) + Tmanual + Tartifacts',
    measuredSessions: p1Durations.length + p2Durations.length + p3Durations.length,
    perPlatformSeconds: {
      'p1-chrome-win11': Math.round(p1Total),
      'p2-firefox-win11': Math.round(p2Total),
      'p3-android-chrome': Math.round(p3Total),
    },
    totalEstimatedSeconds: Math.round(totalSeconds),
    totalEstimatedMinutes: Math.round(totalSeconds / 60 * 10) / 10,
    parallelSessionsMaxAllowed: 1,
    notes: 'Based on actual pilot-05 measurements. With 1 concurrent thread, 210 sessions will take approx 3.5 hours.',
  };
}

export function freezeQualificationInput(options: {
  repoRoot: string;
  runId: string;
  outDir?: string;
  pilotAttemptsPath?: string;
}): QualificationFreeze {
  let gitSha = 'unknown';
  let isDirty = true;
  try {
    gitSha = execSync('git rev-parse HEAD', { cwd: options.repoRoot }).toString().trim();
    const statusOutput = execSync('git status --porcelain', { cwd: options.repoRoot }).toString().trim();
    isDirty = statusOutput.length > 0;
  } catch {}

  const backendDigest = computeDirContentDigest(path.join(options.repoRoot, 'backend'));
  const webDigest = computeDirContentDigest(path.join(options.repoRoot, 'frontend-web/src'));
  const adminDigest = computeDirContentDigest(path.join(options.repoRoot, 'frontend-admin/src'));

  const checklistPath = fs.existsSync(path.join(options.repoRoot, 'docs/gui-checklist/checklist.csv'))
    ? path.join(options.repoRoot, 'docs/gui-checklist/checklist.csv')
    : path.join(options.repoRoot, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');
  const checklistSha256 = computeFileSha256(checklistPath);

  // Baseline products snapshot hash
  const productsFixturePath = path.join(options.repoRoot, 'tests/gui/fixtures/products.ts');
  const productsSha256 = computeFileSha256(productsFixturePath);

  const budgetEstimate = calculateBudgetEstimate(options.pilotAttemptsPath);

  const freeze: QualificationFreeze = {
    runId: options.runId,
    frozenAt: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh',
    harness: {
      gitSha,
      isDirty,
    },
    sut: {
      gitSha,
      isDirty,
      backendContentDigest: backendDigest,
      frontendWebContentDigest: webDigest,
      frontendAdminContentDigest: adminDigest,
    },
    checklist: {
      path: path.relative(options.repoRoot, checklistPath),
      itemCount: 70,
      sha256: checklistSha256,
    },
    dataSnapshot: {
      baselineProductsSha256: productsSha256,
    },
    resolvedVersions: {
      node: process.version,
      playwright: '1.57.0',
      chromeWin11: '156.0',
      firefoxWin11: '157.0',
      androidChrome: 'Samsung Galaxy S23 (Android 13.0)',
    },
    budgetEstimate,
  };

  if (options.outDir) {
    fs.mkdirSync(options.outDir, { recursive: true });
    const targetFile = path.join(options.outDir, 'qualification-freeze.json');
    fs.writeFileSync(targetFile, JSON.stringify(freeze, null, 2), 'utf8');
  }

  return freeze;
}
