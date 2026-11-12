## Tóm tắt
[FR-03] Ô nhập OTP không thông báo lỗi khi không đúng định dạng 6 chữ số

## Truy vết
- Bug key: BUG-GUI-008
- Checklist IDs: GUI-008
- Requirement IDs: FR03-RESET-INPUTS
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
2. Thực thi kiểm tra GUI-008
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
otp-format

## Kết quả thực tế
Error: Error must indicate OTP format requires 6 digits

expect(locator).toBeVisible() failed

Locator: locator('text=/Mã OTP phải có 6 chữ số|không đúng định dạng/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Error

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-008"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-008 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cc10c0e6d2cd2ccde868ab3e799567490db11e22) |
| GUI-008 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/6c34c337038b4847e66db0d4e2d31601542c45fd) |
| GUI-008 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/9b9c135468fa48f5b7e1cfc4e43bc0b29f6462c6) |
