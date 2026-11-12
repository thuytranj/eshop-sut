## Tóm tắt
[FR-05] Thiếu giao diện empty state thân thiện khi tìm kiếm không có kết quả

## Truy vết
- Bug key: BUG-GUI-029
- Checklist IDs: GUI-029
- Requirement IDs: FR05-EMPTY; FR24-EMPTY
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.026Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-029
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
search-empty-state

## Kết quả thực tế
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Không tìm thấy|không có sản phẩm/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=/Không tìm thấy|không có sản phẩ

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-029"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-029 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a3276497db69f34beea317a901a37da1934119bb) |
| GUI-029 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1e4a508bda1c40807c305a2e119efe439822ab53) |
| GUI-029 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e3126dd35c88debd3f660921db7a3f36ac90a7e9) |
