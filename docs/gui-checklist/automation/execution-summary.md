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
