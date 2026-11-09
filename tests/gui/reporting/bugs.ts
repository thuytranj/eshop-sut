import {
  type RunMatrix,
  type BugCandidate,
  type ItemResult,
  type ItemId,
} from '../contracts.ts';

export function buildBugCandidates(matrix: RunMatrix): BugCandidate[] {
  const failedItems = matrix.items.filter((i) => i.status === 'Failed');
  const candidates: BugCandidate[] = [];

  // Group by root cause / item
  for (const item of failedItems) {
    const itemAttempts = matrix.attempts.filter(
      (a) => a.itemId === item.id && (a.outcome === 'assertion-failed' || a.failureKind === 'product')
    );
    const itemCases = matrix.cases.filter((c) => c.itemId === item.id);

    const reqIds: string[] = [];
    itemCases.forEach((c) => {
      c.requirementIds.forEach((r) => {
        if (!reqIds.includes(r)) reqIds.push(r);
      });
    });

    // Determine basis
    const isReadme = reqIds.some((r) => r.startsWith('FR'));
    const basis: 'README' | 'checklist-extension' = isReadme ? 'README' : 'checklist-extension';

    // Stable bug key
    const key = `BUG-${item.id}`;

    // Determine severity & priority
    let severity: 'S1' | 'S2' | 'S3' | 'S4' = 'S3';
    let priority: 'P1' | 'P2' | 'P3' = 'P2';

    if (item.id === 'GUI-060' || item.id === 'GUI-014' || item.id === 'GUI-015') {
      severity = 'S2';
      priority = 'P1';
    } else if (item.id === 'GUI-019' || item.id === 'GUI-048' || item.id === 'GUI-033') {
      severity = 'S3';
      priority = 'P2';
    } else if (item.id === 'GUI-030' || item.id === 'GUI-064') {
      severity = 'S4';
      priority = 'P3';
    }

    const title = `[${item.id}] ${item.actual_result.slice(0, 80)}`;

    const candidate: BugCandidate = {
      key,
      itemIds: [item.id],
      requirementIds: reqIds,
      targetIds: ['chrome-local'],
      title,
      severity,
      priority,
      expected: [itemCases[0]?.caseId || 'Expected behavior according to checklist specification'],
      actual: [item.actual_result],
      steps: [
        `1. Mở trang liên quan (${itemCases[0]?.screen || 'SUT'})`,
        `2. Thực thi kiểm tra ${item.id}`,
        `3. Quan sát kết quả hiển thị trên Google Chrome`,
      ],
      evidence: item.evidence_path ? [item.evidence_path] : [],
      expected_raw: [],
      expected_resolved: [],
      environment: itemAttempts.map((a) => a.environment || {}),
      basis,
    };

    candidates.push(candidate);
  }

  return candidates;
}

export function renderBugReport(matrix: RunMatrix, bugs: BugCandidate[]): string {
  const passedCount = matrix.items.filter((i) => i.status === 'Passed').length;
  const failedCount = matrix.items.filter((i) => i.status === 'Failed').length;
  const notRunCount = matrix.items.filter((i) => i.status === 'Not Run').length;

  let report = `# Báo Cáo Lỗi GUI (Bug Report) — EShop SUT (HW03)\n\n`;
  report += `## 1. Tổng quan Thực thi\n\n`;
  report += `- **Run ID**: \`${matrix.manifest.runId}\`\n`;
  report += `- **Build commit**: \`${matrix.manifest.buildCommit}\`\n`;
  report += `- **Thời gian bắt đầu**: ${matrix.manifest.startedAt}\n`;
  report += `- **Tổng số mục checklist**: 70\n`;
  report += `- **Passed**: ${passedCount}\n`;
  report += `- **Failed**: ${failedCount}\n`;
  report += `- **Not Run**: ${notRunCount}\n`;
  report += `- **Tổng số Bug Candidates**: ${bugs.length}\n\n`;

  report += `## 2. Danh sách Lỗi Phát hiện Được\n\n`;
  report += `| Bug Key | Checklist ID | Mức độ (Severity) | Ưu tiên (Priority) | Căn cứ | Tóm tắt lỗi |\n`;
  report += `| --- | --- | :---: | :---: | :---: | --- |\n`;

  for (const bug of bugs) {
    report += `| **${bug.key}** | \`${bug.itemIds.join(', ')}\` | ${bug.severity} | ${bug.priority} | ${bug.basis} | ${bug.title} |\n`;
  }

  report += `\n## 3. Chi tiết Từng Lỗi và Bước Tái hiện\n\n`;

  for (const bug of bugs) {
    report += `### ${bug.key}: ${bug.title}\n\n`;
    report += `- **Checklist IDs**: ${bug.itemIds.map((id) => `\`${id}\``).join(', ')}\n`;
    report += `- **Yêu cầu liên quan**: ${bug.requirementIds.map((r) => `\`${r}\``).join(', ')}\n`;
    report += `- **Căn cứ**: ${bug.basis}\n`;
    report += `- **Severity / Priority**: ${bug.severity} / ${bug.priority}\n\n`;
    report += `**Các bước tái hiện**:\n`;
    bug.steps.forEach((s) => (report += `${s}\n`));
    report += `\n**Kết quả thực tế**:\n\`\`\`\n${bug.actual.join('\n')}\n\`\`\`\n\n`;
    report += `**Bằng chứng (Evidence)**:\n`;
    if (bug.evidence.length > 0) {
      bug.evidence.forEach((ev) => (report += `- \`${ev}\`\n`));
    } else {
      report += `- (Chưa đính kèm ảnh lỗi)\n`;
    }
    report += `\n---\n\n`;
  }

  return report;
}
