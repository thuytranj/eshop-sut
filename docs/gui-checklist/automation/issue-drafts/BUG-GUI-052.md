## Tóm tắt
[GUI-052] Error: Error message required for price <= 0

[2mexpect([22m[31mlocator[39m

## Truy vết
- Bug key: BUG-GUI-052
- Checklist IDs: GUI-052
- Requirement IDs: FR15-PRICE-REQ
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T14:35:47.339Z
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

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=/Giá phải lớn hơn 0|không hợp lệ/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Error message required for pr

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-ba58a-pts-only-positive-amounts-0-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-052"
- Kết quả sau fix: Not Run
