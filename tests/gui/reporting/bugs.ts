import {
  type RunMatrix,
  type BugCandidate,
  type ItemResult,
  type ItemId,
} from '../contracts.ts';

export function stripAnsi(str: string): string {
  return str.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
}

export const FRIENDLY_BUG_TITLES: Record<string, string> = {
  'GUI-003': '[FR-03] Trang Quên mật khẩu thiếu thẻ tiêu đề h1 duy nhất',
  'GUI-004': '[FR-03] Ô nhập Email thiếu thuộc tính type="email"',
  'GUI-005': '[FR-03] Thiếu chỉ báo tiến trình bước (Bước 1/2) tại Bước 1',
  'GUI-006': '[FR-03] Thiếu trường nhập xác nhận mật khẩu tại Bước 2',
  'GUI-007': '[FR-03] Thiếu khối hiển thị lỗi validation phía trên nút gửi',
  'GUI-008': '[FR-03] Ô nhập OTP không thông báo lỗi khi không đúng định dạng 6 chữ số',
  'GUI-009': '[FR-03] Thiếu liên kết "Quay lại đăng nhập" tại Bước 1',
  'GUI-012': '[FR-03] Phím Enter không kích hoạt gửi form chuyển bước',
  'GUI-013': '[FR-03] Lỗi kết nối Backend API khi kiểm tra sinh mã OTP',
  'GUI-014': '[FR-03] Lỗi kết nối Backend API khi kiểm tra ràng buộc OTP với email',
  'GUI-015': '[FR-03] Lỗi kết nối Backend API khi kiểm tra hoàn tất đặt lại mật khẩu',
  'GUI-018': '[FR-05] Thẻ sản phẩm dùng đơn vị tiền tệ "VND" thay vì ký hiệu "₫"',
  'GUI-019': '[FR-05] Trang danh sách sản phẩm tồn tại 2 thẻ h1 thay vì duy nhất 1',
  'GUI-020': '[FR-05] Độ tương phản màu sắc chữ trên thẻ sản phẩm không đạt chuẩn WCAG AA',
  'GUI-021': '[FR-05] Từ khóa tìm kiếm render trực tiếp thẻ HTML <b> chưa được escape',
  'GUI-024': '[FR-05] Mục "Trang chủ" trên Navbar không có trạng thái active khi đang xem',
  'GUI-025': '[FR-05] Badge số lượng giỏ hàng trên Navbar không cập nhật sau khi thêm hàng',
  'GUI-026': '[FR-05] Nhấp vào thẻ sản phẩm không điều hướng sang trang Chi tiết',
  'GUI-028': '[FR-05] Thiếu hiệu ứng skeleton/loading khi đang tải danh sách sản phẩm',
  'GUI-029': '[FR-05] Thiếu giao diện empty state thân thiện khi tìm kiếm không có kết quả',
  'GUI-030': '[FR-05] Hình ảnh sản phẩm thiếu thuộc tính alt mô tả nội dung',
  'GUI-031': '[FR-05] Thiếu thông báo toast phản hồi trực quan khi bấm Thêm vào giỏ hàng',
  'GUI-032': '[FR-07] Bảng giỏ hàng không hiển thị đầy đủ 5 cột theo quy định đặc tả',
  'GUI-033': '[FR-07] Nhãn tổng tiền hiển thị sai thành "Tổng tạm tính" thay vì "Tổng cộng"',
  'GUI-034': '[FR-07] Các cột số tiền trong bảng giỏ hàng không được căn lề phải',
  'GUI-036': '[FR-07] Dòng giỏ hàng thiếu cụm nút tăng giảm số lượng (+/-) và ô nhập',
  'GUI-037': '[FR-07] Giỏ hàng thiếu trường nhập trực tiếp số lượng bằng bàn phím',
  'GUI-038': '[FR-07] Không thể kiểm thử giá trị số lượng biên do thiếu ô nhập liệu',
  'GUI-039': '[FR-07] Mục "Giỏ hàng" trên Navbar không được highlight active khi đang xem',
  'GUI-040': '[FR-07] Trang Giỏ hàng thiếu thanh điều hướng phân cấp Breadcrumb',
  'GUI-041': '[FR-07] Nút tiếp tục mua sắm hiển thị nhãn "← Mua tiếp" thay vì "Tiếp tục mua sắm"',
  'GUI-043': '[FR-07] Thêm cùng một sản phẩm nhiều lần không tự động cộng dồn số lượng',
  'GUI-044': '[FR-07] Thiếu hộp thoại xác nhận trước khi xóa sản phẩm khỏi giỏ hàng',
  'GUI-045': '[FR-07] Thao tác Hủy hoặc phím Escape không giữ lại sản phẩm trong giỏ hàng',
  'GUI-047': '[FR-15] Tiêu đề các cột trong bảng quản trị sản phẩm Admin chưa được Việt hóa',
  'GUI-048': '[FR-15] Trang Quản lý sản phẩm thiếu thẻ tiêu đề h1 duy nhất',
  'GUI-050': '[FR-15] Các trường bắt buộc trong form sản phẩm thiếu ký hiệu dấu sao (*)',
  'GUI-051': '[FR-15] Trường tên sản phẩm không giới hạn độ dài tối đa 255 ký tự',
  'GUI-052': '[FR-15] Không hiển thị thông báo lỗi khi nhập giá sản phẩm nhỏ hơn hoặc bằng 0',
  'GUI-055': '[FR-15] Khối thông báo lỗi form sản phẩm không nằm phía trên nút submit',
  'GUI-057': '[FR-15] Nút đăng xuất dùng nhãn "Thoát"/"Log out" thay vì "Đăng xuất"',
  'GUI-059': '[FR-15] Form Sửa sản phẩm không mở dưới dạng modal có bẫy focus bàn phím',
  'GUI-060': '[FR-15] Cập nhật thông tin sản phẩm không đảm bảo tính cô lập dữ liệu',
  'GUI-061': '[FR-15] Thiếu modal xác nhận cảnh báo trước khi xóa sản phẩm quản trị',
  'GUI-066': '[FR-07] Nút Xóa sản phẩm thiếu thuộc tính aria-label cho công nghệ hỗ trợ',
  'GUI-067': '[FR-05] Thiếu giao diện thông báo lỗi mạng và nút "Thử lại" khi mất kết nối API',
  'GUI-068': '[FR-07] Ô nhập số lượng giỏ hàng xử lý chưa an toàn khi xóa trắng giá trị',
  'GUI-070': '[FR-05] Nút Thêm vào giỏ hàng thiếu cơ chế chống click spam liên tục',
};

export function cleanTitle(id: string, text: string): string {
  if (FRIENDLY_BUG_TITLES[id]) {
    return FRIENDLY_BUG_TITLES[id];
  }
  const clean = stripAnsi(text);
  const firstLine = (clean.split('\n').find((l) => l.trim().length > 0) || clean)
    .trim()
    .replace(/\|/g, '-')
    .replace(/\s+/g, ' ');
  return `[${id}] ${firstLine}`;
}

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

    const title = cleanTitle(item.id, item.actual_result);

    const candidate: BugCandidate = {
      key,
      itemIds: [item.id],
      requirementIds: reqIds,
      targetIds: ['chrome-local'],
      title,
      severity,
      priority,
      expected: [itemCases[0]?.caseId || 'Expected behavior according to checklist specification'],
      actual: [stripAnsi(item.actual_result)],
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
