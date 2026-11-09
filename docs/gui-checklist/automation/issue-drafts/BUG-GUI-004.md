## Tóm tắt
[GUI-004] Error: Email input must have type="email"

[2mexpect([22m[31mreceived[39m[2

## Truy vết
- Bug key: BUG-GUI-004
- Checklist IDs: GUI-004
- Requirement IDs: FR22-REQ; FR22-EMAIL; FR03-EMAIL-INPUT
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
2. Thực thi kiểm tra GUI-004
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
email-validation

## Kết quả thực tế
Error: Email input must have type="email"

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m"email"[39m
Received: [31m"text"[39m

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-cab66-e-email-and-required-marker-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-004"
- Kết quả sau fix: Not Run
