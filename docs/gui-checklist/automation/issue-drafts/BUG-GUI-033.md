## Tóm tắt
[GUI-033] Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

[2mexpe

## Truy vết
- Bug key: BUG-GUI-033
- Checklist IDs: GUI-033
- Requirement IDs: FR07-TOTAL-LABEL
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T14:35:47.337Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-033
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
exact-total-label

## Kết quả thực tế
Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

[2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected substring: [32m"Tổng cộng"[39m
Received string:    [31m"Tổng tạm tính: 30.000.000 ₫"[39m

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-0bb04-strictly-matches-Tổng-cộng--chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-033"
- Kết quả sau fix: Not Run
