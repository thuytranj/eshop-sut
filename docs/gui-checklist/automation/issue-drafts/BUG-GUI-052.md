## Tóm tắt
[FR-15] Không hiển thị thông báo lỗi khi nhập giá sản phẩm nhỏ hơn hoặc bằng 0

## Truy vết
- Bug key: BUG-GUI-052
- Checklist IDs: GUI-052
- Requirement IDs: FR15-PRICE-REQ
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
2. Thực thi kiểm tra GUI-052
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
product-price-bounds

## Kết quả thực tế
Error: Error message required for price <= 0

expect(locator).toBeVisible() failed

Locator: locator('text=/Giá phải lớn hơn 0|không hợp lệ/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Error message required for pr

## Bằng chứng
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-052"
- Kết quả sau fix: Not Run

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-052 | p1-chrome-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/2a62cec3af291fa4b10ec3972981edf41ce35311) |
| GUI-052 | p2-firefox-win11 | [Xem ảnh](../../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/aa4e16e0e8fd35051be5ff80b36c1a1a86dac0c4) |
| GUI-052 | p3-android-chrome | [Xem ảnh](../../cross-platform/browser-evidence/images/p3-android-chrome/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/641545c1d386ce14eff86b6fdf9f27e63c9618d0) |
