## Tóm tắt
[FR-07] Thêm cùng một sản phẩm nhiều lần không tự động cộng dồn số lượng

## Truy vết
- Bug key: BUG-GUI-043
- Checklist IDs: GUI-043
- Requirement IDs: FR07-ACCUMULATE
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.027Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-043
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
merge-same-product

## Kết quả thực tế
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('tbody tr')

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-043"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-043 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/4c96e7e8f2ca12a8fe31a84201ce8ea4f9ec07a8) |
| GUI-043 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7a6aa5dc6bb4a2e557db105b8368da172f32afb7) |
| GUI-043 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/98a56deaeb4aee62b0a02f3a4e012db7a7fc61aa) |
