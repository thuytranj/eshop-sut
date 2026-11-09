# Báo Cáo Lỗi GUI (Bug Report) — EShop SUT (HW03)

## 1. Tổng quan Thực thi

- **Run ID**: `run-1794234716427`
- **Build commit**: `HEAD`
- **Thời gian bắt đầu**: 2026-11-09T14:31:56.478Z
- **Tổng số mục checklist**: 70
- **Passed**: 20
- **Failed**: 48
- **Not Run**: 2
- **Tổng số Bug Candidates**: 48

## 2. Danh sách Lỗi Phát hiện Được

| Bug Key | Checklist ID | Mức độ (Severity) | Ưu tiên (Priority) | Căn cứ | Tóm tắt lỗi |
| --- | --- | :---: | :---: | :---: | --- |
| **BUG-GUI-003** | `GUI-003` | S3 | P2 | README | [FR-03] Trang Quên mật khẩu thiếu thẻ tiêu đề h1 duy nhất |
| **BUG-GUI-004** | `GUI-004` | S3 | P2 | README | [FR-03] Ô nhập Email thiếu thuộc tính type="email" |
| **BUG-GUI-005** | `GUI-005` | S3 | P2 | README | [FR-03] Thiếu chỉ báo tiến trình bước (Bước 1/2) tại Bước 1 |
| **BUG-GUI-006** | `GUI-006` | S3 | P2 | README | [FR-03] Thiếu trường nhập xác nhận mật khẩu tại Bước 2 |
| **BUG-GUI-007** | `GUI-007` | S3 | P2 | README | [FR-03] Thiếu khối hiển thị lỗi validation phía trên nút gửi |
| **BUG-GUI-008** | `GUI-008` | S3 | P2 | README | [FR-03] Ô nhập OTP không thông báo lỗi khi không đúng định dạng 6 chữ số |
| **BUG-GUI-009** | `GUI-009` | S3 | P2 | README | [FR-03] Thiếu liên kết "Quay lại đăng nhập" tại Bước 1 |
| **BUG-GUI-012** | `GUI-012` | S3 | P2 | checklist-extension | [FR-03] Phím Enter không kích hoạt gửi form chuyển bước |
| **BUG-GUI-013** | `GUI-013` | S3 | P2 | README | [FR-03] Lỗi kết nối Backend API khi kiểm tra sinh mã OTP |
| **BUG-GUI-014** | `GUI-014` | S2 | P1 | README | [FR-03] Lỗi kết nối Backend API khi kiểm tra ràng buộc OTP với email |
| **BUG-GUI-015** | `GUI-015` | S2 | P1 | checklist-extension | [FR-03] Lỗi kết nối Backend API khi kiểm tra hoàn tất đặt lại mật khẩu |
| **BUG-GUI-018** | `GUI-018` | S3 | P2 | README | [FR-05] Thẻ sản phẩm dùng đơn vị tiền tệ "VND" thay vì ký hiệu "₫" |
| **BUG-GUI-019** | `GUI-019` | S3 | P2 | README | [FR-05] Trang danh sách sản phẩm tồn tại 2 thẻ h1 thay vì duy nhất 1 |
| **BUG-GUI-020** | `GUI-020` | S3 | P2 | checklist-extension | [FR-05] Độ tương phản màu sắc chữ trên thẻ sản phẩm không đạt chuẩn WCAG AA |
| **BUG-GUI-021** | `GUI-021` | S3 | P2 | README | [FR-05] Từ khóa tìm kiếm render trực tiếp thẻ HTML <b> chưa được escape |
| **BUG-GUI-024** | `GUI-024` | S3 | P2 | README | [FR-05] Mục "Trang chủ" trên Navbar không có trạng thái active khi đang xem |
| **BUG-GUI-025** | `GUI-025` | S3 | P2 | README | [FR-05] Badge số lượng giỏ hàng trên Navbar không cập nhật sau khi thêm hàng |
| **BUG-GUI-026** | `GUI-026` | S3 | P2 | checklist-extension | [FR-05] Nhấp vào thẻ sản phẩm không điều hướng sang trang Chi tiết |
| **BUG-GUI-028** | `GUI-028` | S3 | P2 | README | [FR-05] Thiếu hiệu ứng skeleton/loading khi đang tải danh sách sản phẩm |
| **BUG-GUI-029** | `GUI-029` | S3 | P2 | README | [FR-05] Thiếu giao diện empty state thân thiện khi tìm kiếm không có kết quả |
| **BUG-GUI-030** | `GUI-030` | S4 | P3 | README | [FR-05] Hình ảnh sản phẩm thiếu thuộc tính alt mô tả nội dung |
| **BUG-GUI-031** | `GUI-031` | S3 | P2 | README | [FR-05] Thiếu thông báo toast phản hồi trực quan khi bấm Thêm vào giỏ hàng |
| **BUG-GUI-032** | `GUI-032` | S3 | P2 | README | [FR-07] Bảng giỏ hàng không hiển thị đầy đủ 5 cột theo quy định đặc tả |
| **BUG-GUI-033** | `GUI-033` | S3 | P2 | README | [FR-07] Nhãn tổng tiền hiển thị sai thành "Tổng tạm tính" thay vì "Tổng cộng" |
| **BUG-GUI-034** | `GUI-034` | S3 | P2 | README | [FR-07] Các cột số tiền trong bảng giỏ hàng không được căn lề phải |
| **BUG-GUI-036** | `GUI-036` | S3 | P2 | README | [FR-07] Dòng giỏ hàng thiếu cụm nút tăng giảm số lượng (+/-) và ô nhập |
| **BUG-GUI-037** | `GUI-037` | S3 | P2 | checklist-extension | [FR-07] Giỏ hàng thiếu trường nhập trực tiếp số lượng bằng bàn phím |
| **BUG-GUI-038** | `GUI-038` | S3 | P2 | checklist-extension | [FR-07] Không thể kiểm thử giá trị số lượng biên do thiếu ô nhập liệu |
| **BUG-GUI-039** | `GUI-039` | S3 | P2 | README | [FR-07] Mục "Giỏ hàng" trên Navbar không được highlight active khi đang xem |
| **BUG-GUI-040** | `GUI-040` | S3 | P2 | README | [FR-07] Trang Giỏ hàng thiếu thanh điều hướng phân cấp Breadcrumb |
| **BUG-GUI-041** | `GUI-041` | S3 | P2 | README | [FR-07] Nút tiếp tục mua sắm hiển thị nhãn "← Mua tiếp" thay vì "Tiếp tục mua sắm" |
| **BUG-GUI-043** | `GUI-043` | S3 | P2 | README | [FR-07] Thêm cùng một sản phẩm nhiều lần không tự động cộng dồn số lượng |
| **BUG-GUI-044** | `GUI-044` | S3 | P2 | README | [FR-07] Thiếu hộp thoại xác nhận trước khi xóa sản phẩm khỏi giỏ hàng |
| **BUG-GUI-045** | `GUI-045` | S3 | P2 | README | [FR-07] Thao tác Hủy hoặc phím Escape không giữ lại sản phẩm trong giỏ hàng |
| **BUG-GUI-047** | `GUI-047` | S3 | P2 | README | [FR-15] Tiêu đề các cột trong bảng quản trị sản phẩm Admin chưa được Việt hóa |
| **BUG-GUI-048** | `GUI-048` | S3 | P2 | README | [FR-15] Trang Quản lý sản phẩm thiếu thẻ tiêu đề h1 duy nhất |
| **BUG-GUI-050** | `GUI-050` | S3 | P2 | README | [FR-15] Các trường bắt buộc trong form sản phẩm thiếu ký hiệu dấu sao (*) |
| **BUG-GUI-051** | `GUI-051` | S3 | P2 | README | [FR-15] Trường tên sản phẩm không giới hạn độ dài tối đa 255 ký tự |
| **BUG-GUI-052** | `GUI-052` | S3 | P2 | README | [FR-15] Không hiển thị thông báo lỗi khi nhập giá sản phẩm nhỏ hơn hoặc bằng 0 |
| **BUG-GUI-055** | `GUI-055` | S3 | P2 | README | [FR-15] Khối thông báo lỗi form sản phẩm không nằm phía trên nút submit |
| **BUG-GUI-057** | `GUI-057` | S3 | P2 | README | [FR-15] Nút đăng xuất dùng nhãn "Thoát"/"Log out" thay vì "Đăng xuất" |
| **BUG-GUI-059** | `GUI-059` | S3 | P2 | README | [FR-15] Form Sửa sản phẩm không mở dưới dạng modal có bẫy focus bàn phím |
| **BUG-GUI-060** | `GUI-060` | S2 | P1 | README | [FR-15] Cập nhật thông tin sản phẩm không đảm bảo tính cô lập dữ liệu |
| **BUG-GUI-061** | `GUI-061` | S3 | P2 | checklist-extension | [FR-15] Thiếu modal xác nhận cảnh báo trước khi xóa sản phẩm quản trị |
| **BUG-GUI-066** | `GUI-066` | S3 | P2 | checklist-extension | [FR-07] Nút Xóa sản phẩm thiếu thuộc tính aria-label cho công nghệ hỗ trợ |
| **BUG-GUI-067** | `GUI-067` | S3 | P2 | checklist-extension | [FR-05] Thiếu giao diện thông báo lỗi mạng và nút "Thử lại" khi mất kết nối API |
| **BUG-GUI-068** | `GUI-068` | S3 | P2 | checklist-extension | [FR-07] Ô nhập số lượng giỏ hàng xử lý chưa an toàn khi xóa trắng giá trị |
| **BUG-GUI-070** | `GUI-070` | S3 | P2 | checklist-extension | [FR-05] Nút Thêm vào giỏ hàng thiếu cơ chế chống click spam liên tục |

## 3. Chi tiết Từng Lỗi và Bước Tái hiện

### BUG-GUI-003: [FR-03] Trang Quên mật khẩu thiếu thẻ tiêu đề h1 duy nhất

- **Checklist IDs**: `GUI-003`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-003
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Password reset page must have exactly 1 h1 heading

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-1ed77--describing-forgot-password-chrome-local/test-failed-1.png`

---

### BUG-GUI-004: [FR-03] Ô nhập Email thiếu thuộc tính type="email"

- **Checklist IDs**: `GUI-004`
- **Yêu cầu liên quan**: `FR22-REQ`, `FR22-EMAIL`, `FR03-EMAIL-INPUT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-004
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Email input must have type="email"

expect(received).toBe(expected) // Object.is equality

Expected: "email"
Received: "text"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-cab66-e-email-and-required-marker-chrome-local/test-failed-1.png`

---

### BUG-GUI-005: [FR-03] Thiếu chỉ báo tiến trình bước (Bước 1/2) tại Bước 1

- **Checklist IDs**: `GUI-005`
- **Yêu cầu liên quan**: `FR22-STEP`, `FR03-STEP-IND`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-005
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Step indicator (Bước 1/2) must be visible on step 1

expect(locator).toBeVisible() failed

Locator: .step-indicator, text=/Bước 1/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".step-indicator, text=/Bước 1/i". Did you
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-7d6f2-t-step-out-of-total-2-steps-chrome-local/test-failed-1.png`

---

### BUG-GUI-006: [FR-03] Thiếu trường nhập xác nhận mật khẩu tại Bước 2

- **Checklist IDs**: `GUI-006`
- **Yêu cầu liên quan**: `FR22-PWD`, `FR03-RESET-INPUTS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-006
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirm password input must exist

expect(locator).toBeVisible() failed

Locator: locator('input[type="password"]').nth(1)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Confirm password input must exist locator('
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-723d2-ds-exist-with-type-password-chrome-local/test-failed-1.png`

---

### BUG-GUI-007: [FR-03] Thiếu khối hiển thị lỗi validation phía trên nút gửi

- **Checklist IDs**: `GUI-007`
- **Yêu cầu liên quan**: `FR03-PWD-RULES`, `FR03-PWD-CONFIRM`, `FR22-ERR-POS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-007
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error container must exist in DOM above submit button

expect(locator).toBeVisible() failed

Locator: locator('.error, [role="alert"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Error container must e
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-9b4a8-age-positioned-above-submit-chrome-local/test-failed-1.png`

---

### BUG-GUI-008: [FR-03] Ô nhập OTP không thông báo lỗi khi không đúng định dạng 6 chữ số

- **Checklist IDs**: `GUI-008`
- **Yêu cầu liên quan**: `FR03-RESET-INPUTS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-008
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error must indicate OTP format requires 6 digits

expect(locator).toBeVisible() failed

Locator: locator('text=/Mã OTP phải có 6 chữ số|không đúng định dạng/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Error
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-7deef-tes-6-digit-format-strictly-chrome-local/test-failed-1.png`

---

### BUG-GUI-009: [FR-03] Thiếu liên kết "Quay lại đăng nhập" tại Bước 1

- **Checklist IDs**: `GUI-009`
- **Yêu cầu liên quan**: `FR03-BACK-LOGIN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-009
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Link "Quay lại đăng nhập" must exist on step 1

expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Quay lại đăng nhập' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Link "Quay lại đăng n
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-45871-back-to-login-on-both-steps-chrome-local/test-failed-1.png`

---

### BUG-GUI-012: [FR-03] Phím Enter không kích hoạt gửi form chuyển bước

- **Checklist IDs**: `GUI-012`
- **Yêu cầu liên quan**: `USR-KBD-NAV`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-012
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Bước 2|Mã OTP/i')
Expected: visible
Error: strict mode violation: locator('text=/Bước 2|Mã OTP/i') resolved to 2 elements:
    1) <div class="bg-green-100 text-green-800 p-3 rounded tex
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-5c9c8-m-on-both-step-1-and-step-2-chrome-local/test-failed-1.png`

---

### BUG-GUI-013: [FR-03] Lỗi kết nối Backend API khi kiểm tra sinh mã OTP

- **Checklist IDs**: `GUI-013`
- **Yêu cầu liên quan**: `FR03-OTP-GEN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-013
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
  - → POST http://localhost:3000/api/forgot-password
    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17
    - accept: */*
    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-0456a-rs-exactly-6-numeric-digits-chrome-local/test-failed-1.png`

---

### BUG-GUI-014: [FR-03] Lỗi kết nối Backend API khi kiểm tra ràng buộc OTP với email

- **Checklist IDs**: `GUI-014`
- **Yêu cầu liên quan**: `FR03-OTP-BIND`
- **Căn cứ**: README
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-014
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
  - → POST http://localhost:3000/api/forgot-password
    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17
    - accept: */*
    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-82088-en-for-another-user-account-chrome-local/test-failed-1.png`

---

### BUG-GUI-015: [FR-03] Lỗi kết nối Backend API khi kiểm tra hoàn tất đặt lại mật khẩu

- **Checklist IDs**: `GUI-015`
- **Yêu cầu liên quan**: `USR-FEEDBACK-RESET`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-015
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
  - → POST http://localhost:3000/api/forgot-password
    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17
    - accept: */*
    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-f5213--login-with-new-credentials-chrome-local/test-failed-1.png`

---

### BUG-GUI-018: [FR-05] Thẻ sản phẩm dùng đơn vị tiền tệ "VND" thay vì ký hiệu "₫"

- **Checklist IDs**: `GUI-018`
- **Yêu cầu liên quan**: `FR21-CURRENCY`, `USR-UI-ALIGN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-018
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Currency must use '₫', found 'VND' in "30.000.000 VND"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-eb74b-s-₫-and-thousand-separators-chrome-local/test-failed-1.png`

---

### BUG-GUI-019: [FR-05] Trang danh sách sản phẩm tồn tại 2 thẻ h1 thay vì duy nhất 1

- **Checklist IDs**: `GUI-019`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-019
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Expected exactly 1 h1 tag, found 2

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-eb30b--on-page-describing-content-chrome-local/test-failed-1.png`

---

### BUG-GUI-020: [FR-05] Độ tương phản màu sắc chữ trên thẻ sản phẩm không đạt chuẩn WCAG AA

- **Checklist IDs**: `GUI-020`
- **Yêu cầu liên quan**: `USR-CONTRAST`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-020
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 4.5
Received:    1
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-ff674--Color-contrast-ratio-4-5-1-chrome-local/test-failed-1.png`

---

### BUG-GUI-021: [FR-05] Từ khóa tìm kiếm render trực tiếp thẻ HTML <b> chưa được escape

- **Checklist IDs**: `GUI-021`
- **Yêu cầu liên quan**: `FR05-SEARCH-SEC`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-021
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Search term must be escaped text literal, not raw HTML <b> tag

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-89571--execution-or-tag-injection-chrome-local/test-failed-1.png`

---

### BUG-GUI-024: [FR-05] Mục "Trang chủ" trên Navbar không có trạng thái active khi đang xem

- **Checklist IDs**: `GUI-024`
- **Yêu cầu liên quan**: `FR23-NAV-ACT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-024
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /Trang chủ|Cửa hàng/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('link', { name: /Trang chủ|Cửa hàng/i
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-befb3-ion-highlight-for-Trang-chu-chrome-local/test-failed-1.png`

---

### BUG-GUI-025: [FR-05] Badge số lượng giỏ hàng trên Navbar không cập nhật sau khi thêm hàng

- **Checklist IDs**: `GUI-025`
- **Yêu cầu liên quan**: `FR23-CART-BADGE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-025
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('link', { name: /Giỏ hàng/i }).locator('span, .badge').first()
Expected pattern: /1/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveT
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-558f4-ates-after-adding-product-A-chrome-local/test-failed-1.png`

---

### BUG-GUI-026: [FR-05] Nhấp vào thẻ sản phẩm không điều hướng sang trang Chi tiết

- **Checklist IDs**: `GUI-026`
- **Yêu cầu liên quan**: `USR-NAV-PROD-DETAIL`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-026
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/product\/1/
Received string:  "http://localhost:5173/"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator 
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-70860-le-navigates-to-detail-page-chrome-local/test-failed-1.png`

---

### BUG-GUI-028: [FR-05] Thiếu hiệu ứng skeleton/loading khi đang tải danh sách sản phẩm

- **Checklist IDs**: `GUI-028`
- **Yêu cầu liên quan**: `FR05-LOADING`, `USR-STATE-SKELETON`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-028
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: .loading, .skeleton, text=/Đang tải|Loading/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".loading, .skeleton, text=/Đang tải|Loading/i". Did you mean to CSS.escape it?


```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-51b25-r-while-waiting-for-network-chrome-local/test-failed-1.png`

---

### BUG-GUI-029: [FR-05] Thiếu giao diện empty state thân thiện khi tìm kiếm không có kết quả

- **Checklist IDs**: `GUI-029`
- **Yêu cầu liên quan**: `FR05-EMPTY`, `FR24-EMPTY`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-029
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Không tìm thấy|không có sản phẩm/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=/Không tìm thấy|không có sản phẩ
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-d0ce8-ly-illustration-and-message-chrome-local/test-failed-1.png`

---

### BUG-GUI-030: [FR-05] Hình ảnh sản phẩm thiếu thuộc tính alt mô tả nội dung

- **Checklist IDs**: `GUI-030`
- **Yêu cầu liên quan**: `FR24-ALT`
- **Căn cứ**: README
- **Severity / Priority**: S4 / P3

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-030
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Image #0 has empty alt text

expect(received).toBeTruthy()

Received: ""
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-c1c4f-criptive-non-empty-alt-text-chrome-local/test-failed-1.png`

---

### BUG-GUI-031: [FR-05] Thiếu thông báo toast phản hồi trực quan khi bấm Thêm vào giỏ hàng

- **Checklist IDs**: `GUI-031`
- **Yêu cầu liên quan**: `FR24-ADD-FEEDBACK`, `USR-STATE-TOAST`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-031
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: .toast, [role="status"], [role="alert"], text=/Đã thêm vào giỏ|thành công/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".toast, [role="status"], [role="alert"], text=/Đã 
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-48431-when-adding-product-to-cart-chrome-local/test-failed-1.png`

---

### BUG-GUI-032: [FR-07] Bảng giỏ hàng không hiển thị đầy đủ 5 cột theo quy định đặc tả

- **Checklist IDs**: `GUI-032`
- **Yêu cầu liên quan**: `FR07-COLS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-032
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Array [
    "Sản phẩm",
-   "Đơn giá",
+   "Giá",
    "Số lượng",
    "Thành t
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-cd1fa--5-columns-in-correct-order-chrome-local/test-failed-1.png`

---

### BUG-GUI-033: [FR-07] Nhãn tổng tiền hiển thị sai thành "Tổng tạm tính" thay vì "Tổng cộng"

- **Checklist IDs**: `GUI-033`
- **Yêu cầu liên quan**: `FR07-TOTAL-LABEL`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-033
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

expect(received).toContain(expected) // indexOf

Expected substring: "Tổng cộng"
Received string:    "Tổng tạm tính: 30.000.000 ₫"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-0bb04-strictly-matches-Tổng-cộng--chrome-local/test-failed-1.png`

---

### BUG-GUI-034: [FR-07] Các cột số tiền trong bảng giỏ hàng không được căn lề phải

- **Checklist IDs**: `GUI-034`
- **Yêu cầu liên quan**: `FR21-CURRENCY`, `USR-UI-ALIGN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-034
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Money column must be right-aligned

expect(received).toBe(expected) // Object.is equality

Expected: "right"
Received: "left"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-decca-nd-right-aligned-in-columns-chrome-local/test-failed-1.png`

---

### BUG-GUI-036: [FR-07] Dòng giỏ hàng thiếu cụm nút tăng giảm số lượng (+/-) và ô nhập

- **Checklist IDs**: `GUI-036`
- **Yêu cầu liên quan**: `FR07-QTY-CTRL`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-036
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity controls missing in cart row: minus=false, plus=false, input=false
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-f2b27-for-adjusting-item-quantity-chrome-local/test-failed-1.png`

---

### BUG-GUI-037: [FR-07] Giỏ hàng thiếu trường nhập trực tiếp số lượng bằng bàn phím

- **Checklist IDs**: `GUI-037`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-037
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Cart row must contain a quantity input field

expect(locator).toBeVisible() failed

Locator: locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).locator('input[type="number"], input')
Expected: visible
Timeout: 5000ms
Error: element(s) no
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-1a78a-llows-typing-quantity-value-chrome-local/test-failed-1.png`

---

### BUG-GUI-038: [FR-07] Không thể kiểm thử giá trị số lượng biên do thiếu ô nhập liệu

- **Checklist IDs**: `GUI-038`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-038
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity input required to test boundaries

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-bd610--handled-safely-without-NaN-chrome-local/test-failed-1.png`

---

### BUG-GUI-039: [FR-07] Mục "Giỏ hàng" trên Navbar không được highlight active khi đang xem

- **Checklist IDs**: `GUI-039`
- **Yêu cầu liên quan**: `FR23-NAV-ACT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-039
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(received).toMatch(expected)

Expected pattern: /active|font-bold|text-blue/
Received string:  "hover:underline"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-955e4-avigation-highlight-on-cart-chrome-local/test-failed-1.png`

---

### BUG-GUI-040: [FR-07] Trang Giỏ hàng thiếu thanh điều hướng phân cấp Breadcrumb

- **Checklist IDs**: `GUI-040`
- **Yêu cầu liên quan**: `FR23-BREADCRUMB`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-040
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Breadcrumb navigation must exist on Cart page

expect(locator).toBeVisible() failed

Locator: locator('nav[aria-label="breadcrumb"], .breadcrumb')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Breadcrumb navigati
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-966ef-tion-from-Cart-back-to-Home-chrome-local/test-failed-1.png`

---

### BUG-GUI-041: [FR-07] Nút tiếp tục mua sắm hiển thị nhãn "← Mua tiếp" thay vì "Tiếp tục mua sắm"

- **Checklist IDs**: `GUI-041`
- **Yêu cầu liên quan**: `FR07-CONTINUE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-041
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Tiếp tục mua sắm' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Link text
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-1e735-k-navigates-back-to-catalog-chrome-local/test-failed-1.png`

---

### BUG-GUI-043: [FR-07] Thêm cùng một sản phẩm nhiều lần không tự động cộng dồn số lượng

- **Checklist IDs**: `GUI-043`
- **Yêu cầu liên quan**: `FR07-ACCUMULATE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-043
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-e44e8-ng-product-A-multiple-times-chrome-local/test-failed-1.png`

---

### BUG-GUI-044: [FR-07] Thiếu hộp thoại xác nhận trước khi xóa sản phẩm khỏi giỏ hàng

- **Checklist IDs**: `GUI-044`
- **Yêu cầu liên quan**: `FR07-DEL-CONFIRM`, `FR24-DEL-CONFIRM`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-044
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirmation dialog must appear before removing item

expect(received).toBeTruthy()

Received: false
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-c397b-s-before-deleting-cart-item-chrome-local/test-failed-1.png`

---

### BUG-GUI-045: [FR-07] Thao tác Hủy hoặc phím Escape không giữ lại sản phẩm trong giỏ hàng

- **Checklist IDs**: `GUI-045`
- **Yêu cầu liên quan**: `FR07-DEL-CONFIRM`, `FR24-DEL-CONFIRM`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-045
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-4d096-t-item-Confirm-deletes-item-chrome-local/test-failed-1.png`

---

### BUG-GUI-047: [FR-15] Tiêu đề các cột trong bảng quản trị sản phẩm Admin chưa được Việt hóa

- **Checklist IDs**: `GUI-047`
- **Yêu cầu liên quan**: `FR15-CRUD-VIEW`, `FR21-LANG`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-047
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 2

  Array [
    "Ảnh",
-   "Tên sản phẩm",
+   "Tên SP",
    "Giá",
-   "Danh mục
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-73049-s-Vietnamese-column-headers-chrome-local/test-failed-1.png`

---

### BUG-GUI-048: [FR-15] Trang Quản lý sản phẩm thiếu thẻ tiêu đề h1 duy nhất

- **Checklist IDs**: `GUI-048`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-048
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(received).toMatch(expected)

Expected pattern: /Quản lý Sản phẩm|Sản phẩm/i
Received string:  "EShop Admin"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-6c27d-scribing-product-management-chrome-local/test-failed-1.png`

---

### BUG-GUI-050: [FR-15] Các trường bắt buộc trong form sản phẩm thiếu ký hiệu dấu sao (*)

- **Checklist IDs**: `GUI-050`
- **Yêu cầu liên quan**: `FR22-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-050
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

expect(received).toContain(expected) // indexOf

Expected substring: "*"
Received string:    "Thêm sản phẩm mới
Điện thoại
Laptop

```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-75675-ields-show-asterisk-marker--chrome-local/test-failed-1.png`

---

### BUG-GUI-051: [FR-15] Trường tên sản phẩm không giới hạn độ dài tối đa 255 ký tự

- **Checklist IDs**: `GUI-051`
- **Yêu cầu liên quan**: `FR15-NAME-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-051
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Product name must be truncated or blocked at max 255 chars

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 255
Received:    256
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-1b73d-ax-length-of-255-characters-chrome-local/test-failed-1.png`

---

### BUG-GUI-052: [FR-15] Không hiển thị thông báo lỗi khi nhập giá sản phẩm nhỏ hơn hoặc bằng 0

- **Checklist IDs**: `GUI-052`
- **Yêu cầu liên quan**: `FR15-PRICE-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-052
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error message required for price <= 0

expect(locator).toBeVisible() failed

Locator: locator('text=/Giá phải lớn hơn 0|không hợp lệ/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Error message required for pr
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-ba58a-pts-only-positive-amounts-0-chrome-local/test-failed-1.png`

---

### BUG-GUI-055: [FR-15] Khối thông báo lỗi form sản phẩm không nằm phía trên nút submit

- **Checklist IDs**: `GUI-055`
- **Yêu cầu liên quan**: `FR22-ERR-POS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-055
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Validation error element must appear in DOM

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-eeb70-irectly-above-submit-button-chrome-local/test-failed-1.png`

---

### BUG-GUI-057: [FR-15] Nút đăng xuất dùng nhãn "Thoát"/"Log out" thay vì "Đăng xuất"

- **Checklist IDs**: `GUI-057`
- **Yêu cầu liên quan**: `FR23-LOGOUT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-057
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"

expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Đăng xuất' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Lo
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-91514--label-in-header-or-sidebar-chrome-local/test-failed-1.png`

---

### BUG-GUI-059: [FR-15] Form Sửa sản phẩm không mở dưới dạng modal có bẫy focus bàn phím

- **Checklist IDs**: `GUI-059`
- **Yêu cầu liên quan**: `FR21-TABORDER`, `USR-KBD-NAV`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-059
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Editing must open in an accessible modal dialog with focus trap

expect(locator).toBeVisible() failed

Locator: locator('dialog, [role="dialog"], .modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Editing mus
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-34786-lements-keyboard-focus-trap-chrome-local/test-failed-1.png`

---

### BUG-GUI-060: [FR-15] Cập nhật thông tin sản phẩm không đảm bảo tính cô lập dữ liệu

- **Checklist IDs**: `GUI-060`
- **Yêu cầu liên quan**: `FR15-ISOLATE`
- **Căn cứ**: README
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-060
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toContainText(expected) failed

Locator: locator('tbody tr').filter({ hasText: 'Samsung Galaxy S24 Ultra' })
Expected substring: "28000000"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-f39a4-d-does-not-modify-product-B-chrome-local/test-failed-1.png`

---

### BUG-GUI-061: [FR-15] Thiếu modal xác nhận cảnh báo trước khi xóa sản phẩm quản trị

- **Checklist IDs**: `GUI-061`
- **Yêu cầu liên quan**: `USR-DELETE-ADMIN`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-061
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirmation modal must appear before deleting product

expect(locator).toBeVisible() failed

Locator: locator('dialog, [role="dialog"], .modal').filter({ hasText: /Xác nhận xóa|Cảnh báo/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-18c6b-ars-before-deleting-product-chrome-local/test-failed-1.png`

---

### BUG-GUI-066: [FR-07] Nút Xóa sản phẩm thiếu thuộc tính aria-label cho công nghệ hỗ trợ

- **Checklist IDs**: `GUI-066`
- **Yêu cầu liên quan**: `USR-A11Y-SR`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-066
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Delete button must have descriptive aria-label

expect(received).toBeTruthy()

Received: null
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-d6cf4-d-live-status-announcements-chrome-local/test-failed-1.png`

---

### BUG-GUI-067: [FR-05] Thiếu giao diện thông báo lỗi mạng và nút "Thử lại" khi mất kết nối API

- **Checklist IDs**: `GUI-067`
- **Yêu cầu liên quan**: `USR-STATE-NET-ERR`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-067
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Thử lại/i })
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: /Thử lại/i }) with timeout 3
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-c3e25-or-state-and-retry-recovery-chrome-local/test-failed-1.png`

---

### BUG-GUI-068: [FR-07] Ô nhập số lượng giỏ hàng xử lý chưa an toàn khi xóa trắng giá trị

- **Checklist IDs**: `GUI-068`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-068
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity input required to test transient empty state

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-cb537-r-immediate-NaN-before-blur-chrome-local/test-failed-1.png`

---

### BUG-GUI-070: [FR-05] Nút Thêm vào giỏ hàng thiếu cơ chế chống click spam liên tục

- **Checklist IDs**: `GUI-070`
- **Yêu cầu liên quan**: `USR-STATE-DEBOUNCE`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-070
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: 1
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-64afc-prevent-duplicate-mutations-chrome-local/test-failed-1.png`

---

