## Tóm tắt
[FR-05] Thẻ sản phẩm dùng đơn vị tiền tệ "VND" thay vì ký hiệu "₫"

## Truy vết
- Bug key: BUG-GUI-018
- Checklist IDs: GUI-018
- Requirement IDs: FR21-CURRENCY; USR-UI-ALIGN
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
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-018
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
currency-format

## Kết quả thực tế
Error: Currency must use '₫', found 'VND' in "30.000.000 VND"

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-018"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-018 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/058b0bd1b500900c1eb1f5ced602d09ad9efd841) |
| GUI-018 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ef7aa76ae0ad2aac5c39ed0ab3a50f5ef0e1279d) |
| GUI-018 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/53c57df3ae92d857a0109376d6c5a767a5061c9d) |
