## Tóm tắt
[FR-07] Trang Giỏ hàng thiếu thanh điều hướng phân cấp Breadcrumb

## Truy vết
- Bug key: BUG-GUI-040
- Checklist IDs: GUI-040
- Requirement IDs: FR23-BREADCRUMB
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
2. Thực thi kiểm tra GUI-040
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
breadcrumb-home

## Kết quả thực tế
Error: Breadcrumb navigation must exist on Cart page

expect(locator).toBeVisible() failed

Locator: locator('nav[aria-label="breadcrumb"], .breadcrumb')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Breadcrumb navigati

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-966ef-tion-from-Cart-back-to-Home-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-040"
- Kết quả sau fix: Not Run
