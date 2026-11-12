## Tóm tắt
[FR-03] Thiếu trường nhập xác nhận mật khẩu tại Bước 2

## Truy vết
- Bug key: BUG-GUI-006
- Checklist IDs: GUI-006
- Requirement IDs: FR22-PWD; FR03-RESET-INPUTS
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
2. Thực thi kiểm tra GUI-006
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
password-fields

## Kết quả thực tế
Error: Confirm password input must exist

expect(locator).toBeVisible() failed

Locator: locator('input[type="password"]').nth(1)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Confirm password input must exist locator('

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-006"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-006 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/569cba8455f71f8a3fb9e91eae24765ea0c9ca38) |
| GUI-006 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/034b53f63d33c8374f2d26a42b08e236e0cbec20) |
| GUI-006 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/90b09ddf69e520e2fda77e420b54e0ec84a58a14) |
