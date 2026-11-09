## Tóm tắt
[GUI-041] Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

[2mexpect(

## Truy vết
- Bug key: BUG-GUI-041
- Checklist IDs: GUI-041
- Requirement IDs: FR07-CONTINUE
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T14:35:47.338Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-041
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
continue-shopping-exact

## Kết quả thực tế
Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('link', { name: 'Tiếp tục mua sắm' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Link text

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-1e735-k-navigates-back-to-catalog-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-041"
- Kết quả sau fix: Not Run
