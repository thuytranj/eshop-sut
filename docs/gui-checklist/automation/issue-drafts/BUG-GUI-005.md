## Tóm tắt
[GUI-005] Error: Step indicator (Bước 1/2) must be visible on step 1

[2mexpect([22m[31

## Truy vết
- Bug key: BUG-GUI-005
- Checklist IDs: GUI-005
- Requirement IDs: FR22-STEP; FR03-STEP-IND
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

## Môi trường
- Build/commit + dirty flag: HEAD, clean
- Run ID và timestamp có timezone: 2026-11-09T14:35:47.335Z
- Nền tảng, OS/device và browser version thật: darwin, Google Chrome
- URL, viewport và mode: http://localhost:5173; 1440x900; mock-ui
- Mock đang bật: none
- Công cụ hỗ trợ nếu có: None

## Tiền điều kiện và dữ liệu
Dữ liệu 5 sản phẩm baseline điện tử (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, MacBook Pro M3, AirPods Pro 2, Keychron Q1)

## Các bước tái hiện
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-005
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
step-indicator

## Kết quả thực tế
Error: Step indicator (Bước 1/2) must be visible on step 1

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: .step-indicator, text=/Bước 1/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".step-indicator, text=/Bước 1/i". Did you

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-7d6f2-t-step-out-of-total-2-steps-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-005"
- Kết quả sau fix: Not Run
