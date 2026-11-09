## Tóm tắt
[GUI-006] Error: Confirm password input must exist

[2mexpect([22m[31mlocator[39m[2m)

## Truy vết
- Bug key: BUG-GUI-006
- Checklist IDs: GUI-006
- Requirement IDs: FR22-PWD; FR03-RESET-INPUTS
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

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
2. Thực thi kiểm tra GUI-006
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
password-fields

## Kết quả thực tế
Error: Confirm password input must exist

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('input[type="password"]').nth(1)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Confirm password input must exist locator('

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-723d2-ds-exist-with-type-password-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-006"
- Kết quả sau fix: Not Run
