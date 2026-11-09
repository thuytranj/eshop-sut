## Tóm tắt
[FR-05] Từ khóa tìm kiếm render trực tiếp thẻ HTML <b> chưa được escape

## Truy vết
- Bug key: BUG-GUI-021
- Checklist IDs: GUI-021
- Requirement IDs: FR05-SEARCH-SEC
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

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
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-021
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
xss-search-safe

## Kết quả thực tế
Error: Search term must be escaped text literal, not raw HTML <b> tag

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-89571--execution-or-tag-injection-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-021"
- Kết quả sau fix: Not Run
