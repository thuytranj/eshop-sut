## Tóm tắt
[FR-03] Lỗi kết nối Backend API khi kiểm tra ràng buộc OTP với email

## Truy vết
- Bug key: BUG-GUI-014
- Checklist IDs: GUI-014
- Requirement IDs: FR03-OTP-BIND
- Căn cứ: README
- Severity / Priority: S2 / P1, lý do: Tác động đến người dùng trên Google Chrome

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
2. Thực thi kiểm tra GUI-014
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
bind-email

## Kết quả thực tế
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
  - → POST http://localhost:3000/api/forgot-password
    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17
    - accept: */*
    - accept-en

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-014"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-014 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/80da17ac3404cdbf4a28fdcbf876835074a76e25) |
| GUI-014 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/238d624dbdfdd40f8220d7fa9d9f17f56f47346c) |
| GUI-014 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a7c4720f7f024fd307c57210fd3e5a87843913b4) |
