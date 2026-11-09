## Tóm tắt
[FR-03] Thiếu liên kết "Quay lại đăng nhập" tại Bước 1

## Truy vết
- Bug key: BUG-GUI-009
- Checklist IDs: GUI-009
- Requirement IDs: FR03-BACK-LOGIN
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.025Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-009
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
back-login-link

## Kết quả thực tế
Error: Link "Quay lại đăng nhập" must exist on step 1

expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Quay lại đăng nhập' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Link "Quay lại đăng n

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-45871-back-to-login-on-both-steps-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-009"
- Kết quả sau fix: Not Run
