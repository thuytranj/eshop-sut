## Tóm tắt
[FR-05] Trang danh sách sản phẩm tồn tại 2 thẻ h1 thay vì duy nhất 1

## Truy vết
- Bug key: BUG-GUI-019
- Checklist IDs: GUI-019
- Requirement IDs: FR21-H1
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
2. Thực thi kiểm tra GUI-019
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
single-h1

## Kết quả thực tế
Error: Expected exactly 1 h1 tag, found 2

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-eb30b--on-page-describing-content-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-019"
- Kết quả sau fix: Not Run
