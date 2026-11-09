## Tóm tắt
[FR-05] Thiếu giao diện empty state thân thiện khi tìm kiếm không có kết quả

## Truy vết
- Bug key: BUG-GUI-029
- Checklist IDs: GUI-029
- Requirement IDs: FR05-EMPTY; FR24-EMPTY
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T16:53:30.026Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-029
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
search-empty-state

## Kết quả thực tế
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Không tìm thấy|không có sản phẩm/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=/Không tìm thấy|không có sản phẩ

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-d0ce8-ly-illustration-and-message-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-029"
- Kết quả sau fix: Not Run
