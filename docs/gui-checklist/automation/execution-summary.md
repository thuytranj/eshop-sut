# Báo Cáo Tổng Hợp Thực Thi Kiểm Thử GUI (Execution Summary)

- **Run ID**: `run-1794234716427`
- **Môi trường**: Google Chrome on macOS (darwin)
- **Build Commit**: `HEAD`
- **Thời gian thực thi**: 2026-11-09T14:31:56.478Z
- **Workbook nguồn**: `docs/gui-checklist/EShop-GUI-Checklist.xlsx`
- **Backup workbook**: `/Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/backups/EShop-GUI-Checklist.xlsx.2026-11-09T14-36-16-786Z.bak`

---

## 1. Kết Quả Tổng Thể

| Chỉ số | Số lượng | Ghi chú |
| --- | :---: | --- |
| **Tổng số mục kiểm tra** | **70** | Toàn bộ 70 Checklist Items |
| **Đã thực thi (Executed)** | **68** | Đã có phán quyết Passed hoặc Failed |
| **Đạt (Passed)** | **20** | Đáp ứng đúng tiêu chí đặc tả |
| **Lỗi (Failed)** | **48** | Phát hiện sai lệch giao diện hoặc lỗi chức năng |
| **Chưa thực thi (Not Run)** | **2** | Gồm GUI-065 (chờ IME manual) và GUI-066 (chờ Screen Reader) |
| **Tỷ lệ Đạt (Pass Rate)** | **29.4%** | Tính trên tổng số mục đã thực thi (20/68) |

---

## 2. Phân Bổ Theo Màn Hình (Screen)

| Màn hình | Tổng số | Passed | Failed | Not Run |
| --- | :---: | :---: | :---: | :---: |
| **FR-03** (Quên & Đặt lại mật khẩu) | 15 | 4 | 11 | 0 |
| **FR-05** (Danh sách & Tìm kiếm) | 19 | 5 | 13 | 1 |
| **FR-07** (Chi tiết giỏ hàng) | 18 | 4 | 14 | 0 |
| **FR-15** (Admin Quản lý sản phẩm) | 18 | 7 | 10 | 1 |

---

## 3. Phân Bổ Theo Khía Cạnh Kiểm Thử (IA)

| Khía cạnh | Tổng số | Passed | Failed | Not Run |
| --- | :---: | :---: | :---: | :---: |
| **IA-01** (Tiêu chuẩn chung & Responsive) | 18 | 7 | 11 | 0 |
| **IA-02** (Biểu mẫu & Dữ liệu) | 18 | 4 | 13 | 1 |
| **IA-03** (Điều hướng & Tương tác) | 16 | 6 | 10 | 0 |
| **IA-04** (Phản hồi & Trạng thái lỗi) | 18 | 3 | 14 | 1 |

---

## 4. Báo Cáo Lỗi & Bằng Chứng
- **Danh sách Issue Drafts**: `docs/gui-checklist/automation/issue-drafts/` (48 tập tin Markdown và `issues.json`).
- **Chi tiết lỗi tổng hợp**: `docs/gui-checklist/automation/bug-report.md`.
- **Bằng chứng kiểm tra thủ công**: `docs/gui-checklist/automation/manual-checks.md`.

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-065 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-065.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/64178bc5609b0048ab0e74d6874acda0af1a89ea) |
| GUI-065 | p2-firefox-win11 | Not Run — chờ kiểm tra thủ công | — | — |
| GUI-065 | p3-android-chrome | Not Run — chờ kiểm tra thủ công | — | — |
| GUI-066 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1c88c681a8ff706ba8fd4404b19b976496a8d9de) |
| GUI-066 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/54d9faa6b177c8461ce283474a00428e515573c5) |
| GUI-066 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/b76a2c23f2c624cd04485a68a20d3f89734d77ec) |
