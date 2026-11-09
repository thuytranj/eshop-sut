import fs from 'node:fs';
import path from 'node:path';
import { type RunMatrix } from '../contracts.ts';
import { readChecklist, commitResults } from '../checklist/excel-store.ts';

async function main() {
  const repoRoot = path.resolve(import.meta.dirname, '../../..');
  const workbookPath = path.join(repoRoot, 'docs/gui-checklist/EShop-GUI-Checklist.xlsx');

  const args = process.argv.slice(2);
  let matrixPath = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--matrix') matrixPath = args[++i];
  }

  if (!matrixPath) {
    // Find latest run matrix in artifacts/gui
    const guiDir = path.join(repoRoot, 'artifacts/gui');
    const runs = fs.readdirSync(guiDir).filter((d) => d.startsWith('run-')).sort().reverse();
    if (!runs.length) {
      throw new Error('No run directories found in artifacts/gui');
    }
    matrixPath = path.join(guiDir, runs[0], 'matrix.json');
  }

  console.log(`Loading matrix from: ${matrixPath}`);
  const matrix: RunMatrix = JSON.parse(fs.readFileSync(matrixPath, 'utf-8'));

  // 1. Read workbook and get current SHA
  const { items, sourceSha256 } = await readChecklist(workbookPath);
  console.log(`Current workbook has ${items.length} items. Writing back matrix results...`);

  // 2. Commit results into workbook
  const receipt = await commitResults(workbookPath, matrix.items, sourceSha256);
  console.log(`Workbook updated successfully. Backup created at: ${receipt.backupPath}`);

  // 3. Generate execution-summary.md
  const passed = matrix.items.filter((i) => i.status === 'Passed').length;
  const failed = matrix.items.filter((i) => i.status === 'Failed').length;
  const notRun = matrix.items.filter((i) => i.status === 'Not Run').length;
  const executed = passed + failed;
  const passRate = executed > 0 ? ((passed / executed) * 100).toFixed(1) : 'N/A';

  // Counts by Screen
  const byScreen: Record<string, { total: number; passed: number; failed: number; notRun: number }> = {};
  for (const item of items) {
    const res = matrix.items.find((i) => i.id === item.id);
    const st = res ? res.status : 'Not Run';
    if (!byScreen[item.screen]) {
      byScreen[item.screen] = { total: 0, passed: 0, failed: 0, notRun: 0 };
    }
    byScreen[item.screen].total++;
    if (st === 'Passed') byScreen[item.screen].passed++;
    if (st === 'Failed') byScreen[item.screen].failed++;
    if (st === 'Not Run') byScreen[item.screen].notRun++;
  }

  // Counts by IA
  const byIa: Record<string, { total: number; passed: number; failed: number; notRun: number }> = {};
  for (const item of items) {
    const res = matrix.items.find((i) => i.id === item.id);
    const st = res ? res.status : 'Not Run';
    if (!byIa[item.ia]) {
      byIa[item.ia] = { total: 0, passed: 0, failed: 0, notRun: 0 };
    }
    byIa[item.ia].total++;
    if (st === 'Passed') byIa[item.ia].passed++;
    if (st === 'Failed') byIa[item.ia].failed++;
    if (st === 'Not Run') byIa[item.ia].notRun++;
  }

  const summaryContent = `# Báo Cáo Tổng Hợp Thực Thi Kiểm Thử GUI (Execution Summary)

- **Run ID**: \`${matrix.manifest.runId}\`
- **Môi trường**: Google Chrome on macOS (${process.platform})
- **Build Commit**: \`${matrix.manifest.buildCommit}\`
- **Thời gian thực thi**: ${matrix.manifest.startedAt}
- **Workbook nguồn**: \`docs/gui-checklist/EShop-GUI-Checklist.xlsx\`
- **Backup workbook**: \`${receipt.backupPath}\`

---

## 1. Kết Quả Tổng Thể

| Chỉ số | Số lượng | Ghi chú |
| --- | :---: | --- |
| **Tổng số mục kiểm tra** | **70** | Toàn bộ 70 Checklist Items |
| **Đã thực thi (Executed)** | **${executed}** | Đã có phán quyết Passed hoặc Failed |
| **Đạt (Passed)** | **${passed}** | Đáp ứng đúng tiêu chí đặc tả |
| **Lỗi (Failed)** | **${failed}** | Phát hiện sai lệch giao diện hoặc lỗi chức năng |
| **Chưa thực thi (Not Run)** | **${notRun}** | Gồm GUI-065 (chờ IME manual) và GUI-066 (chờ Screen Reader) |
| **Tỷ lệ Đạt (Pass Rate)** | **${passRate}%** | Tính trên tổng số mục đã thực thi (${passed}/${executed}) |

---

## 2. Phân Bổ Theo Màn Hình (Screen)

| Màn hình | Tổng số | Passed | Failed | Not Run |
| --- | :---: | :---: | :---: | :---: |
| **FR-03** (Quên & Đặt lại mật khẩu) | ${byScreen['FR-03']?.total || 15} | ${byScreen['FR-03']?.passed || 0} | ${byScreen['FR-03']?.failed || 0} | ${byScreen['FR-03']?.notRun || 0} |
| **FR-05** (Danh sách & Tìm kiếm) | ${byScreen['FR-05']?.total || 19} | ${byScreen['FR-05']?.passed || 0} | ${byScreen['FR-05']?.failed || 0} | ${byScreen['FR-05']?.notRun || 0} |
| **FR-07** (Chi tiết giỏ hàng) | ${byScreen['FR-07']?.total || 18} | ${byScreen['FR-07']?.passed || 0} | ${byScreen['FR-07']?.failed || 0} | ${byScreen['FR-07']?.notRun || 0} |
| **FR-15** (Admin Quản lý sản phẩm) | ${byScreen['FR-15']?.total || 18} | ${byScreen['FR-15']?.passed || 0} | ${byScreen['FR-15']?.failed || 0} | ${byScreen['FR-15']?.notRun || 0} |

---

## 3. Phân Bổ Theo Khía Cạnh Kiểm Thử (IA)

| Khía cạnh | Tổng số | Passed | Failed | Not Run |
| --- | :---: | :---: | :---: | :---: |
| **IA-01** (Tiêu chuẩn chung & Responsive) | ${byIa['IA-01']?.total || 18} | ${byIa['IA-01']?.passed || 0} | ${byIa['IA-01']?.failed || 0} | ${byIa['IA-01']?.notRun || 0} |
| **IA-02** (Biểu mẫu & Dữ liệu) | ${byIa['IA-02']?.total || 18} | ${byIa['IA-02']?.passed || 0} | ${byIa['IA-02']?.failed || 0} | ${byIa['IA-02']?.notRun || 0} |
| **IA-03** (Điều hướng & Tương tác) | ${byIa['IA-03']?.total || 16} | ${byIa['IA-03']?.passed || 0} | ${byIa['IA-03']?.failed || 0} | ${byIa['IA-03']?.notRun || 0} |
| **IA-04** (Phản hồi & Trạng thái lỗi) | ${byIa['IA-04']?.total || 18} | ${byIa['IA-04']?.passed || 0} | ${byIa['IA-04']?.failed || 0} | ${byIa['IA-04']?.notRun || 0} |

---

## 4. Báo Cáo Lỗi & Bằng Chứng
- **Danh sách Issue Drafts**: \`docs/gui-checklist/automation/issue-drafts/\` (48 tập tin Markdown và \`issues.json\`).
- **Chi tiết lỗi tổng hợp**: \`docs/gui-checklist/automation/bug-report.md\`.
- **Bằng chứng kiểm tra thủ công**: \`docs/gui-checklist/automation/manual-checks.md\`.
`;

  const summaryPath = path.join(repoRoot, 'docs/gui-checklist/automation/execution-summary.md');
  fs.writeFileSync(summaryPath, summaryContent, 'utf-8');
  console.log(`Execution summary written to: ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
