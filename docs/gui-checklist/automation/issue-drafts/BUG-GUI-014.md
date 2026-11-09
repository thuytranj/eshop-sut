## Tóm tắt
[GUI-014] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC

## Truy vết
- Bug key: BUG-GUI-014
- Checklist IDs: GUI-014
- Requirement IDs: FR03-OTP-BIND
- Căn cứ: README
- Severity / Priority: S2 / P1, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T14:35:47.336Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-014
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
bind-email

## Kết quả thực tế
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
[2m  - → POST http://localhost:3000/api/forgot-password[22m
[2m    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17[22m
[2m    - accept: */*[22m
[2m    - accept-en

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-82088-en-for-another-user-account-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-014"
- Kết quả sau fix: Not Run
