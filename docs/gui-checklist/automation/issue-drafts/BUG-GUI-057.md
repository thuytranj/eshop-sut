## Tóm tắt
[FR-15] Nút đăng xuất dùng nhãn "Thoát"/"Log out" thay vì "Đăng xuất"

## Truy vết
- Bug key: BUG-GUI-057
- Checklist IDs: GUI-057
- Requirement IDs: FR23-LOGOUT
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.028Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-057
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
logout-button-exact

## Kết quả thực tế
Error: Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"

expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Đăng xuất' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Lo

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-91514--label-in-header-or-sidebar-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-057"
- Kết quả sau fix: Not Run
