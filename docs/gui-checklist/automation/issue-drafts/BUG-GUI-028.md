## Tóm tắt
[FR-05] Thiếu hiệu ứng skeleton/loading khi đang tải danh sách sản phẩm

## Truy vết
- Bug key: BUG-GUI-028
- Checklist IDs: GUI-028
- Requirement IDs: FR05-LOADING; USR-STATE-SKELETON
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
2. Thực thi kiểm tra GUI-028
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
loading-indicator

## Kết quả thực tế
Error: expect(locator).toBeVisible() failed

Locator: .loading, .skeleton, text=/Đang tải|Loading/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".loading, .skeleton, text=/Đang tải|Loading/i". Did you mean to CSS.escape it?



## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-028"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-028 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7e5ff0377687b7b1a88879147c68402d49ea104c) |
| GUI-028 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/4b69664b30244a6821a621ab23fe6ae15b2646a7) |
| GUI-028 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/836e6d07d68728176154a16912882fe87c647716) |
