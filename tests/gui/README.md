# EShop Playwright GUI Automation

Bộ kiểm thử tự động hóa GUI cho hệ thống EShop SUT (HW03) sử dụng Playwright, TypeScript và Google Chrome.

## Cài đặt và Yêu cầu
- Node.js >= 20
- Google Chrome cài đặt trên máy chạy
- Cài đặt dependencies:
  ```bash
  npm install --prefix tests/gui
  ```

## Cấu trúc thư mục
- `playwright.config.ts`: Cấu hình Playwright local (chỉ project `chrome-local`, viewport 1440x900)
- `playwright.browserstack.config.ts`: Cấu hình Playwright Cross-Platform trên BrowserStack Automate (3 nền tảng: Chrome Win11, Firefox Win11, Android Chrome trên thiết bị thật Samsung Galaxy S23)
- `contracts.ts`: Hợp đồng dữ liệu chung
- `cross-platform/`: Module điều phối cross-platform, quản lý BrowserStack Local tunnel, session identity, watermark, thu thập bằng chứng và lập báo cáo ma trận
- `pages/`: Page Object Models cho từng màn hình (FR-05, FR-07, FR-03, FR-15)
- `checklist/`: Đọc/ghi/kiểm tra an toàn file Excel checklist
- `fixtures/`: Mock dữ liệu sản phẩm, tài khoản, network, remote browser fixtures
- `support/`: Helper chụp bằng chứng, assertion UI, composition
- `specs/`: Test specs cho FR-05, FR-07, FR-03, FR-15 và smoke
- `reporting/`: Attempt reporter, tổng hợp ma trận kết quả, triage và export bug drafts
- `runner/`: Bộ điều phối thực thi và isolated backend

## Các lệnh chính
- Chạy unit tests: `npm --prefix tests/gui run test:unit`
- Typecheck: `npm --prefix tests/gui run typecheck`
- Kiểm tra hợp lệ checklist: `npm --prefix tests/gui run checklist:validate`
- Chạy Playwright E2E local: `npm --prefix tests/gui run test:e2e`
- Chạy bộ điều phối runner local: `npm --prefix tests/gui run gui:run`

### Kiểm thử Cross-Platform trên BrowserStack Automate
1. Cấu hình file `.env` từ `.env.example`:
   ```bash
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_access_key
   ```
2. Các lệnh chạy cloud theo giai đoạn:
   - **G0 Preflight**: Kiểm tra credentials, tunnel, service health và smoke test:
     ```bash
     npm --prefix tests/gui run cp:preflight -- --run-id <id>
     ```
   - **Pilot**: Chạy thử nghiệm pilot 4 màn hình đại diện và kiểm tra capture:
     ```bash
     npm --prefix tests/gui run cp:pilot -- --run-id <id>
     ```
   - **Qualification**: Chạy bộ test đầy đủ 70 checklist items trên 3 nền tảng:
     ```bash
     npm --prefix tests/gui run cp:run -- --run-id <id>
     ```
   - **Báo cáo so sánh**: Xuất ma trận 210 ô so sánh và dự thảo issue:
     ```bash
     npm --prefix tests/gui run cp:report -- --run-id <id>
     ```
