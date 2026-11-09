## Tóm tắt
[FR-03] Phím Enter không kích hoạt gửi form chuyển bước

## Truy vết
- Bug key: BUG-GUI-012
- Checklist IDs: GUI-012
- Requirement IDs: USR-KBD-NAV
- Căn cứ: checklist-extension
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
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-012
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
enter-key

## Kết quả thực tế
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Bước 2|Mã OTP/i')
Expected: visible
Error: strict mode violation: locator('text=/Bước 2|Mã OTP/i') resolved to 2 elements:
    1) <div class="bg-green-100 text-green-800 p-3 rounded tex

## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-5c9c8-m-on-both-step-1-and-step-2-chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-012"
- Kết quả sau fix: Not Run
