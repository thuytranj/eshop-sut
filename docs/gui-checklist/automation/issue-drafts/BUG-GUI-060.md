## Tóm tắt
[FR-15] Cập nhật thông tin sản phẩm không đảm bảo tính cô lập dữ liệu

## Truy vết
- Bug key: BUG-GUI-060
- Checklist IDs: GUI-060
- Requirement IDs: FR15-ISOLATE
- Căn cứ: README
- Severity / Priority: S2 / P1, lý do: Tác động đến người dùng trên Google Chrome

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
2. Thực thi kiểm tra GUI-060
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
isolate-update

## Kết quả thực tế
Error: expect(locator).toContainText(expected) failed

Locator: locator('tbody tr').filter({ hasText: 'Samsung Galaxy S24 Ultra' })
Expected substring: "28000000"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-060"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-060 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f42c21f807fa66a1b9b9f95f1f4619aef357e746) |
| GUI-060 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d35e62df80c1b6e118c0b82df8c448510d996fa0) |
| GUI-060 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/aa07fe6ec4633d6b2c01daf0f1b64ad755b5d318) |
