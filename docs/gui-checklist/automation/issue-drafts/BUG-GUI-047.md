## Tóm tắt
[FR-15] Tiêu đề các cột trong bảng quản trị sản phẩm Admin chưa được Việt hóa

## Truy vết
- Bug key: BUG-GUI-047
- Checklist IDs: GUI-047
- Requirement IDs: FR15-CRUD-VIEW; FR21-LANG
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.028Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-047
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
admin-table-columns

## Kết quả thực tế
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 2

  Array [
    "Ảnh",
-   "Tên sản phẩm",
+   "Tên SP",
    "Giá",
-   "Danh mục

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-047"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-047 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/afbd73711233aa6e106d845371fcaade2328150d) |
| GUI-047 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/eec8f6a648027064e4d8d7fc0b4bea80bc71cddc) |
| GUI-047 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cbdb71d9c2df2ad92ddcf6d28448fc488ccb1cf7) |
