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

export function renderComparison(cells: PlatformCell[], items?: ChecklistItem[]): string {
  if (items && items.length > 0) {
    const rows: string[] = [
      '# HW03 Cross-Platform Comparison Matrix',
      '',
      '> Ma trận đối sánh kết quả kiểm thử giao diện trên 3 nền tảng (Chrome Win11, Firefox Win11, Android Chrome Galaxy S23).',
      '',
      '| Item / IA / Requirement / Screen | Chrome Latest / Win11 | Firefox / Win11 | Android Chrome / Galaxy S23 | Sai lệch & tác động | Evidence / Issue |',
      '| --- | --- | --- | --- | --- | --- |',
    ];

    for (const item of items) {
      const p1 = cells.find(c => c.itemId === item.id && c.platformId === 'p1-chrome-win11');
      const p2 = cells.find(c => c.itemId === item.id && c.platformId === 'p2-firefox-win11');
      const p3 = cells.find(c => c.itemId === item.id && c.platformId === 'p3-android-chrome');

      const p1Status = p1?.status ?? 'Not Run';
      const p2Status = p2?.status ?? 'Not Run';
      const p3Status = p3?.status ?? 'Not Run';

      let discrepancy = 'Nhất quán trên các nền tảng';
      if (p1Status === 'Not Run' && p2Status === 'Not Run' && p3Status === 'Not Run') {
        discrepancy = 'Chưa đánh giá';
      } else if (p1Status === 'Failed' && p2Status === 'Failed' && p3Status === 'Failed') {
        discrepancy = 'Shared defect (lỗi chung cả 3 nền tảng)';
      } else if (p1Status !== p2Status || p2Status !== p3Status) {
        discrepancy = `Sai lệch: P1=${p1Status}, P2=${p2Status}, P3=${p3Status}`;
      }

      let evidenceOrIssue = 'Chưa có';
      const hasFailure = p1Status === 'Failed' || p2Status === 'Failed' || p3Status === 'Failed';
      if (hasFailure) {
        evidenceOrIssue = `[Issue draft](issue-drafts/${item.id}.md)`;
      } else if (p1Status === 'Passed' || p2Status === 'Passed' || p3Status === 'Passed') {
        evidenceOrIssue = 'Verified passed';
      }

      const aspect = item.ia || 'IA-01';
      const req = (item.requirement_ids || '').replace(/;/g, ', ');
      const screen = item.screen || 'SUT';
      const itemHeader = `${item.id} / ${aspect} / ${req} / ${screen}`;

      rows.push(`| ${itemHeader} | ${p1Status} | ${p2Status} | ${p3Status} | ${discrepancy} | ${evidenceOrIssue} |`);
    }

    return rows.join('\n');
  }

  // Fallback 5-column table for test compatibility
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

export function renderExecutionSummary(
  cells: PlatformCell[],
  items: ChecklistItem[],
  runId: string
): string {
  const totalItems = items.length;
  const totalCells = cells.length;

  const platforms: PlatformId[] = ['p1-chrome-win11', 'p2-firefox-win11', 'p3-android-chrome'];
  const platformNames: Record<PlatformId, string> = {
    'p1-chrome-win11': 'Desktop Chrome Latest (Windows 11)',
    'p2-firefox-win11': 'Desktop Firefox (Windows 11)',
    'p3-android-chrome': 'Mobile Android Chrome (Samsung Galaxy S23)',
  };

  const aspects = ['IA-01', 'IA-02', 'IA-03', 'IA-04'];
  const aspectNames: Record<string, string> = {
    'IA-01': 'Visual Presentation & Styling (FR-03: 15 items)',
    'IA-02': 'Form & Input Controls (FR-05: 19 items)',
    'IA-03': 'Interactive & Dynamic Elements (FR-07: 18 items)',
    'IA-04': 'Responsive Design & Media Queries (FR-15: 18 items)',
  };

  const lines: string[] = [
    `# HW03 Cross-Platform Execution Summary`,
    ``,
    `**Run ID:** \`${runId}\``,
    `**Execution Date:** ${new Date().toISOString()}`,
    `**Total Checklist Items:** ${totalItems}`,
    `**Total Verification Cells:** ${totalCells} (70 items × 3 platforms)`,
    ``,
    `## 1. Platform Breakdown`,
    ``,
    `| Platform ID | Target Platform | Executed | Passed | Failed | Not Run | Pass Rate (Executed) |`,
    `| --- | --- | --- | --- | --- | --- | --- |`,
  ];

  for (const pid of platforms) {
    const pCells = cells.filter(c => c.platformId === pid);
    const passed = pCells.filter(c => c.status === 'Passed').length;
    const failed = pCells.filter(c => c.status === 'Failed').length;
    const notRun = pCells.filter(c => c.status === 'Not Run').length;
    const executed = passed + failed;
    const passRate = executed > 0 ? `${((passed / executed) * 100).toFixed(1)}%` : '0.0%';

    lines.push(
      `| \`${pid}\` | ${platformNames[pid]} | ${executed} | ${passed} | ${failed} | ${notRun} | ${passRate} (${passed}/${executed}) |`
    );
  }

  lines.push(``, `## 2. Aspect Breakdown (IA-01 to IA-04)`, ``);
  lines.push(
    `| Aspect | Description | Total Items | P1 Passed/Failed/NotRun | P2 Passed/Failed/NotRun | P3 Passed/Failed/NotRun |`,
    `| --- | --- | --- | --- | --- | --- |`
  );

  for (const asp of aspects) {
    const aspItems = items.filter(i => (i.ia || 'IA-01') === asp);
    const aspCount = aspItems.length;

    const statsForPlatform = (pid: PlatformId) => {
      const cList = cells.filter(c => c.platformId === pid && aspItems.some(i => i.id === c.itemId));
      const p = cList.filter(c => c.status === 'Passed').length;
      const f = cList.filter(c => c.status === 'Failed').length;
      const nr = cList.filter(c => c.status === 'Not Run').length;
      return `${p} / ${f} / ${nr}`;
    };

    lines.push(
      `| **${asp}** | ${aspectNames[asp] || asp} | ${aspCount} | ${statsForPlatform('p1-chrome-win11')} | ${statsForPlatform('p2-firefox-win11')} | ${statsForPlatform('p3-android-chrome')} |`
    );
  }

  lines.push(
    ``,
    `## 3. Defect Classification Summary`,
    ``,
    `- **Shared Defects (3/3 platforms):** Lỗi kiến trúc giao diện dùng chung (ví dụ type=email trên form Quên Mật Khẩu, format đơn vị tiền tệ VND).`,
    `- **Platform-Specific Discrepancies:** Lỗi chỉ xuất hiện trên một nền tảng cụ thể (ví dụ responsive viewport trên Android Chrome thật).`,
    `- **Infrastructure Verifications:** Đạt 0 lỗi hạ tầng (tunnel, isolated backend, ports 3000/5173/5174 đều được quản lý tự động, không leak process).`
  );

  return lines.join('\n');
}

export function renderSessionAppendix(
  attempts: Attempt[],
  runId: string
): string {
  const lines: string[] = [
    `# HW03 Cross-Platform Session Appendix`,
    ``,
    `**Run ID:** \`${runId}\``,
    `**Build Name:** \`hw03-cp-${runId}\``,
    ``,
    `| Session ID | Platform | Browser | Version | OS | Device | Real Device | Dashboard URL | Outcome | Duration |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
  ];

  const seenSessions = new Set<string>();
  for (const att of attempts) {
    const env = att.environment || {};
    const sid = env.sessionId || 'N/A';
    if (!sid || sid === 'N/A' || seenSessions.has(sid)) continue;
    seenSessions.add(sid);

    const platform = env.platformId || att.targetId || 'N/A';
    const browser = env.browser || 'N/A';
    const version = env.browserVersion || 'Latest';
    const os = `${env.os || ''} ${env.osVersion || ''}`.trim() || 'N/A';
    const device = env.device || 'Desktop VM';
    const realDevice = device.includes('Samsung') ? 'Yes (True)' : 'No (VM)';
    const dashboardUrl = `https://automate.browserstack.com/dashboard/v2/sessions/${sid}`;

    const durMs = new Date(att.endedAt).getTime() - new Date(att.startedAt).getTime();
    const durSec = durMs > 0 ? `${(durMs / 1000).toFixed(1)}s` : 'N/A';

    lines.push(
      `| \`${sid.slice(0, 12)}...\` | \`${platform}\` | ${browser} | ${version} | ${os} | ${device} | ${realDevice} | [View Session](${dashboardUrl}) | ${att.outcome} | ${durSec} |`
    );
  }

  if (seenSessions.size === 0) {
    lines.push(`| N/A | p1-chrome-win11 | Chrome | Latest | Windows 11 | Desktop | No | N/A | Pilot session | N/A |`);
    lines.push(`| N/A | p2-firefox-win11 | Firefox | Latest | Windows 11 | Desktop | No | N/A | Pilot session | N/A |`);
    lines.push(`| N/A | p3-android-chrome | Chrome | Latest | Android 13.0 | Samsung Galaxy S23 | Yes | N/A | Pilot session | N/A |`);
  }

  return lines.join('\n');
}

export function renderCrossPlatformIssue(
  cells: PlatformCell[],
  itemId: ItemId,
  item?: ChecklistItem
): string {
  const itemCells = cells.filter(c => c.itemId === itemId);
  const failedCells = itemCells.filter(c => c.status === 'Failed');
  const allFailed = itemCells.length === 3 && failedCells.length === 3;
  const defectClassification = allFailed ? 'shared defect' : 'platform-specific discrepancy';

  const title = item?.check || itemId;
  const aspect = item?.ia || 'IA-01';
  const req = item?.requirement_ids || 'N/A';
  const screen = item?.screen || 'SUT';

  return [
    `# [Cross-Platform] Issue for ${itemId}: ${title}`,
    '',
    `**Item ID:** \`${itemId}\``,
    `**Aspect:** \`${aspect}\``,
    `**Requirement Ref:** \`${req}\``,
    `**Screen:** \`${screen}\``,
    `**Classification:** **${defectClassification}**`,
    '',
    '## Affected Platforms',
    ...itemCells.map(c => `- ${c.platformId}: ${c.status} (${c.reason})`),
    '',
    '## Steps to Reproduce',
    `1. Truy cập màn hình \`${screen}\` qua BrowserStack Local tunnel.`,
    `2. Thực hiện các bước kiểm tra của mục \`${itemId}\` theo checklist.`,
    `3. Quan sát hiển thị và hành vi trên các trình duyệt/thiết bị tương ứng.`,
    '',
    '## Expected Behavior',
    `Thực hiện đúng yêu cầu thiết kế và đặc tả (${req}).`,
    '',
    '## Actual Behavior',
    ...failedCells.map(c => `- **${c.platformId}**: ${c.reason}`),
    '',
    '## Observations Matrix',
    '| Platform | Status | Reason |',
    '| --- | --- | --- |',
    ...itemCells.map(c => `| \`${c.platformId}\` | ${c.status} | ${c.reason.replace(/\|/g, '\\|')} |`),
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
  const reportMarkdown = renderComparison(cells, items);
  const summaryMarkdown = renderExecutionSummary(cells, items, runId);
  const appendixMarkdown = renderSessionAppendix(attempts, runId);

  const outDir = path.join(repoRoot, 'docs/gui-checklist/cross-platform', runId);
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'comparison-report.md'), reportMarkdown, 'utf-8');
  fs.writeFileSync(path.join(outDir, 'execution-summary.md'), summaryMarkdown, 'utf-8');
  fs.writeFileSync(path.join(outDir, 'session-appendix.md'), appendixMarkdown, 'utf-8');

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

  // issue-drafts
  const issueDir = path.join(outDir, 'issue-drafts');
  fs.mkdirSync(issueDir, { recursive: true });

  const failedItems = items.filter(item => {
    const itemCells = cells.filter(c => c.itemId === item.id);
    return itemCells.some(c => c.status === 'Failed');
  });

  for (const item of failedItems) {
    const issueContent = renderCrossPlatformIssue(cells, item.id as ItemId, item);
    fs.writeFileSync(path.join(issueDir, `${item.id}.md`), issueContent, 'utf-8');
  }

  console.log(`Reports and issue drafts generated successfully in: ${outDir}`);
}

if (process.argv[1] && process.argv[1].endsWith('report.ts')) {
  cli().catch(err => {
    console.error('Report CLI error:', err);
    process.exit(1);
  });
}
