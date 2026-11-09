## Tóm tắt
[GUI-060] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32me

## Truy vết
- Bug key: BUG-GUI-060
- Checklist IDs: GUI-060
- Requirement IDs: FR15-ISOLATE
- Căn cứ: README
- Severity / Priority: S2 / P1, lý do: Tác động đến người dùng trên Google Chrome

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
2. Thực thi kiểm tra GUI-060
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
isolate-update

## Kết quả thực tế
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

Locator: locator('tbody tr').filter({ hasText: 'Samsung Galaxy S24 Ultra' })
Expected substring: [32m"28000000"[39m
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-f39a4-d-does-not-modify-product-B-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-060"
- Kết quả sau fix: Not Run
