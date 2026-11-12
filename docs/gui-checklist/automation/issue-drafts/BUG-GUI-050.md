## Tóm tắt
[FR-15] Các trường bắt buộc trong form sản phẩm thiếu ký hiệu dấu sao (*)

## Truy vết
- Bug key: BUG-GUI-050
- Checklist IDs: GUI-050
- Requirement IDs: FR22-REQ
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
2. Thực thi kiểm tra GUI-050
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
required-field-markers

## Kết quả thực tế
Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

expect(received).toContain(expected) // indexOf

Expected substring: "*"
Received string:    "Thêm sản phẩm mới
Điện thoại
Laptop


## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-050"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-050 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/057cac35935177c1f2ad4c9e78a2d95658c644a0) |
| GUI-050 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/8077a2fb48a925ca36c7f1f6e9f8214adc1b9dc2) |
| GUI-050 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7e2d3fad37d45d1245823e6a3fa5c6bcbafdb032) |
