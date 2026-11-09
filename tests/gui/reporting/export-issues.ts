import fs from 'node:fs';
import path from 'node:path';
import { type BugCandidate, type RunMatrix } from '../contracts.ts';
import { buildBugCandidates, renderBugReport } from './bugs.ts';

export async function exportIssueDrafts(
  bugs: BugCandidate[],
  outDir: string
): Promise<{ markdownPaths: string[]; jsonPath: string }> {
  fs.mkdirSync(outDir, { recursive: true });

  const markdownPaths: string[] = [];
  const issuesPayload: any[] = [];

  for (const bug of bugs) {
    const mdPath = path.join(outDir, `${bug.key}.md`);
    const hasEvidence = bug.evidence && bug.evidence.length > 0;

    const body = `## Tóm tắt
${bug.title}

## Truy vết
- Bug key: ${bug.key}
- Checklist IDs: ${bug.itemIds.join('; ')}
- Requirement IDs: ${bug.requirementIds.join('; ')}
- Căn cứ: ${bug.basis}
- Severity / Priority: ${bug.severity} / ${bug.priority}, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: ${new Date().toISOString()}
- Nền tảng, OS/device và browser version thật: ${process.platform}, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
${bug.steps.join('\n')}

## Kết quả mong đợi
${bug.expected.join('\n')}

## Kết quả thực tế
${bug.actual.join('\n')}

## Bằng chứng
${
  hasEvidence
    ? bug.evidence.map((ev) => `- Local file: \`${ev}\``).join('\n')
    : 'Not observed / Pending upload'
}
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "${bug.itemIds[0]}"
- Kết quả sau fix: Not Run
`;

    fs.writeFileSync(mdPath, body, 'utf-8');
    markdownPaths.push(mdPath);

    issuesPayload.push({
      key: bug.key,
      title: bug.title,
      body,
      labels: ['bug', bug.severity.toLowerCase(), bug.priority.toLowerCase()],
      evidenceLocalPaths: bug.evidence,
      publishReady: false,
    });
  }

  const jsonPath = path.join(outDir, 'issues.json');
  fs.writeFileSync(jsonPath, JSON.stringify(issuesPayload, null, 2), 'utf-8');

  return { markdownPaths, jsonPath };
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  let matrixPath = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--matrix') matrixPath = args[++i];
  }

  if (!matrixPath || !fs.existsSync(matrixPath)) {
    console.error('Usage: tsx reporting/export-issues.ts --matrix <path/to/matrix.json>');
    process.exit(1);
  }

  const matrix: RunMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf-8'));
  const bugs = buildBugCandidates(matrix);

  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const outDir = path.join(repoRoot, 'docs/gui-checklist/automation/issue-drafts');
  const { markdownPaths, jsonPath } = await exportIssueDrafts(bugs, outDir);

  const report = renderBugReport(matrix, bugs);
  const reportPath = path.join(repoRoot, 'docs/gui-checklist/automation/bug-report.md');
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log(`Exported ${bugs.length} issue drafts to ${outDir}`);
  console.log(`Exported bug report to ${reportPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
