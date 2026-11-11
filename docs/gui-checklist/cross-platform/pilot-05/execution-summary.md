# HW03 Cross-Platform Execution Summary

**Run ID:** `pilot-05`
**Execution Date:** 2026-11-10T19:11:14.017Z
**Total Checklist Items:** 70
**Total Verification Cells:** 210 (70 items × 3 platforms)

## 1. Platform Breakdown

| Platform ID | Target Platform | Executed | Passed | Failed | Not Run | Pass Rate (Executed) |
| --- | --- | --- | --- | --- | --- | --- |
| `p1-chrome-win11` | Desktop Chrome Latest (Windows 11) | 3 | 0 | 3 | 67 | 0.0% (0/3) |
| `p2-firefox-win11` | Desktop Firefox (Windows 11) | 4 | 1 | 3 | 66 | 25.0% (1/4) |
| `p3-android-chrome` | Mobile Android Chrome (Samsung Galaxy S23) | 4 | 1 | 3 | 66 | 25.0% (1/4) |

## 2. Aspect Breakdown (IA-01 to IA-04)

| Aspect | Description | Total Items | P1 Passed/Failed/NotRun | P2 Passed/Failed/NotRun | P3 Passed/Failed/NotRun |
| --- | --- | --- | --- | --- | --- |
| **IA-01** | Visual Presentation & Styling (FR-03: 15 items) | 18 | 0 / 0 / 18 | 1 / 0 / 17 | 1 / 0 / 17 |
| **IA-02** | Form & Input Controls (FR-05: 19 items) | 18 | 0 / 1 / 17 | 0 / 1 / 17 | 0 / 1 / 17 |
| **IA-03** | Interactive & Dynamic Elements (FR-07: 18 items) | 16 | 0 / 1 / 15 | 0 / 1 / 15 | 0 / 1 / 15 |
| **IA-04** | Responsive Design & Media Queries (FR-15: 18 items) | 18 | 0 / 1 / 17 | 0 / 1 / 17 | 0 / 1 / 17 |

## 3. Defect Classification Summary

- **Shared Defects (3/3 platforms):** Lỗi kiến trúc giao diện dùng chung (ví dụ type=email trên form Quên Mật Khẩu, format đơn vị tiền tệ VND).
- **Platform-Specific Discrepancies:** Lỗi chỉ xuất hiện trên một nền tảng cụ thể (ví dụ responsive viewport trên Android Chrome thật).
- **Infrastructure Verifications:** Đạt 0 lỗi hạ tầng (tunnel, isolated backend, ports 3000/5173/5174 đều được quản lý tự động, không leak process).