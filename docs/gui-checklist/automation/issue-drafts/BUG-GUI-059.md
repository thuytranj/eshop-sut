## Tóm tắt
[FR-15] Form Sửa sản phẩm không mở dưới dạng modal có bẫy focus bàn phím

## Truy vết
- Bug key: BUG-GUI-059
- Checklist IDs: GUI-059
- Requirement IDs: FR21-TABORDER; USR-KBD-NAV
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.029Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-059
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
modal-focus-trap

## Kết quả thực tế
Error: Editing must open in an accessible modal dialog with focus trap

expect(locator).toBeVisible() failed

Locator: locator('dialog, [role="dialog"], .modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Editing mus

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-34786-lements-keyboard-focus-trap-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-059"
- Kết quả sau fix: Not Run
