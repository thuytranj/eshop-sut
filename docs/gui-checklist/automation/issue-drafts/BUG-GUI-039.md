## Tóm tắt
[FR-07] Mục "Giỏ hàng" trên Navbar không được highlight active khi đang xem

## Truy vết
- Bug key: BUG-GUI-039
- Checklist IDs: GUI-039
- Requirement IDs: FR23-NAV-ACT
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
2. Thực thi kiểm tra GUI-039
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
active-cart-nav

## Kết quả thực tế
Error: expect(received).toMatch(expected)

Expected pattern: /active|font-bold|text-blue/
Received string:  "hover:underline"

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-955e4-avigation-highlight-on-cart-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-039"
- Kết quả sau fix: Not Run
