## Tóm tắt
[FR-07] Ô nhập số lượng giỏ hàng xử lý chưa an toàn khi xóa trắng giá trị

## Truy vết
- Bug key: BUG-GUI-068
- Checklist IDs: GUI-068
- Requirement IDs: USR-QTY-VALID
- Căn cứ: checklist-extension
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
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-068
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
transient-empty-input

## Kết quả thực tế
Error: Quantity input required to test transient empty state

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-068"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-068 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/02d611929d30724af0ef0f5ab92938dcc0b527ff) |
| GUI-068 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ec58d3dd88d22d89d5cb4bb95af45190b41130ed) |
| GUI-068 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f774a3e0656a3ba3f4fcfd60b96832862889ceb9) |
