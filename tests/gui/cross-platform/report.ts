import type {
  ChecklistItem,
  CaseDefinition,
  PlatformCell,
  ItemId,
  PlatformId,
  Attempt,
  EvidenceRecord,
  SessionArtifact,
} from './types.js';

export function buildExecutionCoverage(
  items: ChecklistItem[],
  cases: CaseDefinition[]
): { automated: string[]; manual: string[]; gaps: string[] } {
  const caseItemIds = new Set(cases.map(c => c.itemId));
  const automatedSet = new Set<string>();
  const manualSet = new Set<string>();

  for (const c of cases) {
    if (c.mode === 'manual') {
      manualSet.add(c.itemId);
    } else {
      automatedSet.add(c.itemId);
    }
  }

  const gaps: string[] = [];
  for (const item of items) {
    if (!caseItemIds.has(item.id)) {
      gaps.push(item.id);
    }
  }

  return {
    automated: Array.from(automatedSet).sort(),
    manual: Array.from(manualSet).sort(),
    gaps,
  };
}

export function buildPlatformMatrix(
  items: ChecklistItem[],
  cases: CaseDefinition[],
  attempts: Attempt[],
  evidence: EvidenceRecord[]
): PlatformCell[] {
  const platforms: PlatformId[] = [
    'p1-chrome-win11',
    'p2-firefox-win11',
    'p3-android-chrome',
  ];

  const cells: PlatformCell[] = [];

  for (const item of items) {
    for (const platformId of platforms) {
      const platformAttempts = attempts.filter(
        a => a.itemId === item.id && a.targetId === platformId
      );
      const platformEvidence = evidence.filter(
        e => e.context.itemId === item.id && e.context.identity.platformId === platformId
      );

      let status = item.status;
      let reason = 'Chưa đánh giá';

      if (platformAttempts.length === 0) {
        status = 'Not Run';
        reason = 'No execution attempt recorded';
      } else {
        const productFailedAttempt = platformAttempts.find(
          a =>
            a.failureKind === 'product' ||
            (a.outcome === 'assertion-failed' && a.failureKind !== 'infra')
        );

        const infraAttempt = platformAttempts.find(
          a => a.failureKind === 'infra' || (a.outcome === 'timed-out' && a.failureKind !== 'product')
        );

        if (productFailedAttempt) {
          status = 'Failed';
          reason = productFailedAttempt.actual || productFailedAttempt.error || 'Assertion failed';
        } else if (infraAttempt) {
          status = 'Not Run';
          reason = `Infra error (not product failure): ${infraAttempt.actual || infraAttempt.error}`;
        } else {
          // Check if all required cases are covered
          const requiredCases = cases.filter(
            c => c.itemId === item.id && c.required && c.targetIds.includes(platformId)
          );
          const executedCaseIds = new Set(
            platformAttempts.filter(a => a.outcome === 'passed').map(a => a.caseId)
          );
          const missingCases = requiredCases.filter(c => !executedCaseIds.has(c.caseId));

          if (missingCases.length > 0) {
            status = 'Not Run';
            reason = `Missing required cases: ${missingCases.map(c => c.caseId).join(', ')}`;
          } else {
            status = 'Passed';
            reason = 'All required cases passed';
          }
        }
      }

      cells.push({
        itemId: item.id,
        platformId,
        status,
        reason,
        attempts: platformAttempts,
        evidence: platformEvidence,
      });
    }
  }

  return cells;
}

export function renderComparison(cells: PlatformCell[]): string {
  const rows: string[] = [
    '# HW03 Cross-Platform Comparison Matrix',
    '',
    '| Item ID | Chrome Latest / Win11 | Firefox / Win11 | Android Chrome / Galaxy S23 | Discrepancies & Notes |',
    '| --- | --- | --- | --- | --- |',
  ];

  const itemIds = Array.from(new Set(cells.map(c => c.itemId))).sort();
  for (const id of itemIds) {
    const p1 = cells.find(c => c.itemId === id && c.platformId === 'p1-chrome-win11');
    const p2 = cells.find(c => c.itemId === id && c.platformId === 'p2-firefox-win11');
    const p3 = cells.find(c => c.itemId === id && c.platformId === 'p3-android-chrome');

    const p1Status = p1?.status ?? 'Not Run';
    const p2Status = p2?.status ?? 'Not Run';
    const p3Status = p3?.status ?? 'Not Run';

    let discrepancy = 'Consistent across platforms';
    if (p1Status !== p2Status || p2Status !== p3Status) {
      discrepancy = `Discrepancy: P1=${p1Status}, P2=${p2Status}, P3=${p3Status}`;
    }

    rows.push(`| ${id} | ${p1Status} | ${p2Status} | ${p3Status} | ${discrepancy} |`);
  }

  return rows.join('\n');
}

export function renderCrossPlatformIssue(
  cells: PlatformCell[],
  itemId: ItemId
): string {
  const itemCells = cells.filter(c => c.itemId === itemId);
  const allFailed = itemCells.length === 3 && itemCells.every(c => c.status === 'Failed');
  const defectClassification = allFailed ? 'shared defect' : 'platform-specific discrepancy';

  return [
    `# [Cross-Platform] Issue for ${itemId}`,
    '',
    `Classification: **${defectClassification}**`,
    '',
    '## Affected Platforms',
    ...itemCells.map(c => `- ${c.platformId}: ${c.status} (${c.reason})`),
  ].join('\n');
}

// CLI entry point
async function cli(): Promise<void> {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { readChecklist } = await import('../checklist/excel-store.js');
  const { getCaseCatalog } = await import('../checklist/case-catalog.js');

  const args = process.argv.slice(2);
  let runId = 'default-run';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--run-id' && args[i + 1]) {
      runId = args[i + 1];
      i++;
    }
  }

  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const workbookPath = path.join(repoRoot, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');
  const { items } = await readChecklist(workbookPath);
  const targetIds: PlatformId[] = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const cases = getCaseCatalog(items, targetIds);

  const attemptsPath = path.join(repoRoot, 'artifacts/gui/cross-platform', runId, 'attempts.json');
  let attempts: Attempt[] = [];
  if (fs.existsSync(attemptsPath)) {
    try {
      attempts = JSON.parse(fs.readFileSync(attemptsPath, 'utf-8'));
    } catch {}
  }

  const cells = buildPlatformMatrix(items, cases, attempts, []);
  const reportMarkdown = renderComparison(cells);

  const outDir = path.join(repoRoot, 'docs/gui-checklist/cross-platform', runId);
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'comparison-report.md'), reportMarkdown, 'utf-8');

  // matrix.csv
  const csvRows = [
    'item_id,p1_chrome_win11,p2_firefox_win11,p3_android_chrome,notes',
    ...items.map(item => {
      const p1 = cells.find(c => c.itemId === item.id && c.platformId === 'p1-chrome-win11')?.status || 'Not Run';
      const p2 = cells.find(c => c.itemId === item.id && c.platformId === 'p2-firefox-win11')?.status || 'Not Run';
      const p3 = cells.find(c => c.itemId === item.id && c.platformId === 'p3-android-chrome')?.status || 'Not Run';
      return `${item.id},${p1},${p2},${p3},"Cross-platform report"`;
    }),
  ];
  fs.writeFileSync(path.join(outDir, 'matrix.csv'), csvRows.join('\n'), 'utf-8');

  console.log(`Report generated successfully in: ${outDir}`);
}

if (process.argv[1] && process.argv[1].endsWith('report.ts')) {
  cli().catch(err => {
    console.error('Report CLI error:', err);
    process.exit(1);
  });
}

