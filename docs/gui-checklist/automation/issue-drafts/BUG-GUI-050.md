## Tóm tắt
[GUI-050] Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

[2mexp

## Truy vết
- Bug key: BUG-GUI-050
- Checklist IDs: GUI-050
- Requirement IDs: FR22-REQ
- Căn cứ: README
- Severity / Priority: S3 / P2, lý do: Tác động đến người dùng trên Google Chrome

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
2. Thực thi kiểm tra GUI-050
3. Quan sát kết quả hiển thị trên Google Chrome

## Kết quả mong đợi
required-field-markers

## Kết quả thực tế
Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

[2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected substring: [32m"*"[39m
Received string:    [31m"Thêm sản phẩm mới[39m
[31mĐiện thoại[39m
[31mLaptop[39m


## Bằng chứng
- Local file: `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-75675-ields-show-asterisk-marker--chrome-local/test-failed-1.png`
- Quan sát trên Chrome: Đã xác minh trên Google Chrome

## Tái hiện và kiểm thử lại
- Attempts: 1/1; retries/flaky: 0
- Lệnh chạy lại: npx playwright test --grep "GUI-050"
- Kết quả sau fix: Not Run
