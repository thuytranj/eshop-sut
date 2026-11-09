## Tóm tắt
[GUI-048] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpect

## Truy vết
- Bug key: BUG-GUI-048
- Checklist IDs: GUI-048
- Requirement IDs: FR21-H1
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
2. Thực thi kiểm tra GUI-048
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
admin-single-h1

## Kết quả thực tế
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

Expected pattern: [32m/Quản lý Sản phẩm|Sản phẩm/i[39m
Received string:  [31m"EShop Admin"[39m

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-6c27d-scribing-product-management-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-048"
- Kết quả sau fix: Not Run
