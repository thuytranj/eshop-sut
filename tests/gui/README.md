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
- `playwright.config.ts`: Cấu hình Playwright (chỉ project `chrome-local`, viewport 1440x900)
- `contracts.ts`: Hợp đồng dữ liệu chung
- `pages/`: Page Object Models cho từng màn hình (FR-05, FR-07, FR-03, FR-15)
- `checklist/`: Đọc/ghi/kiểm tra an toàn file Excel checklist
- `fixtures/`: Mock dữ liệu sản phẩm, tài khoản, network
- `support/`: Helper chụp bằng chứng, assertion UI, composition
- `specs/`: Test specs cho FR-05, FR-07, FR-03, FR-15
- `reporting/`: Attempt reporter, tổng hợp ma trận kết quả, triage và export bug drafts
- `runner/`: Bộ điều phối thực thi và isolated backend

## Các lệnh chính
- Chạy unit tests: `npm --prefix tests/gui run test:unit`
- Typecheck: `npm --prefix tests/gui run typecheck`
- Kiểm tra hợp lệ checklist: `npm --prefix tests/gui run checklist:validate`
- Chạy Playwright E2E: `npm --prefix tests/gui run test:e2e`
- Chạy bộ điều phối runner: `npm --prefix tests/gui run gui:run`
