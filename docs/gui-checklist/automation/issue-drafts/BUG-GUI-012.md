## Tóm tắt
[FR-03] Phím Enter không kích hoạt gửi form chuyển bước

## Truy vết
- Bug key: BUG-GUI-012
- Checklist IDs: GUI-012
- Requirement IDs: USR-KBD-NAV
- Căn cứ: checklist-extension
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
2. Thực thi kiểm tra GUI-012
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
enter-key

## Kết quả thực tế
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Bước 2|Mã OTP/i')
Expected: visible
Error: strict mode violation: locator('text=/Bước 2|Mã OTP/i') resolved to 2 elements:
    1) <div class="bg-green-100 text-green-800 p-3 rounded tex

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-012"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-012 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-012.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/592d4051c482bbbc5ad089d8d6ee4744e0220c3d) |
| GUI-012 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-012.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7bbd221789c7141ca9f3ddae7cfc1f4c73fdaa89) |
| GUI-012 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-012.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/60617966321f60ad0a2ca2c4df7f2673a2f00c41) |
