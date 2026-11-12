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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

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
Ảnh cũ đã được thay bằng các liên kết chuẩn trong mục bằng chứng bổ sung bên dưới.

---

## Ảnh bằng chứng chuẩn (phiên chụp bổ sung)

Ảnh dưới đây thuộc phiên chụp bổ sung được ghi rõ trong manifest, không thay đổi môi trường, thời gian hoặc kết quả của lượt chạy lịch sử ở trên. Với báo cáo macOS cũ, ảnh Windows/Android là bằng chứng tái hiện riêng, không phải ảnh macOS gốc.

[Toàn bộ ảnh đã duyệt và độ phủ trên ba nền tảng](../cross-platform/browser-evidence/README.md). Bảng dưới liệt kê các checklist ID được nhắc trong báo cáo này.

| Checklist | Nền tảng chụp | Ảnh chuẩn | Kết quả ca tự động của phiên chụp | Phiên thật |
|---|---|---|---|---|
| GUI-003 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-003.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a9463dfc60c152adcef2d5fb97e7d6f0c7c2b4e5) |
| GUI-003 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-003.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/124734b556902aaac895e1caa4d7ac7eaefb37fb) |
| GUI-003 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-003.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5abadcac9067f40ebb6d0947804e390f42045453) |
| GUI-004 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-004.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c26bb9f5b9657715d7367cad8194ba37804c954e) |
| GUI-004 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-004.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e6b5ec44aada622fd7343755fd68c435ec0ed1c7) |
| GUI-004 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-004.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/6de2d32bc96eea1a2f94e4c1fdce4944031c1f74) |
| GUI-005 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-005.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5ab5ad4d9669782adaaec4a59922f66788e690f8) |
| GUI-005 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-005.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/365b98c4131105c1547e6eca68da39bd7c899cc8) |
| GUI-005 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-005.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/55c72dd618a8ad2a0289d004d4ca8000f614f1ae) |
| GUI-006 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/569cba8455f71f8a3fb9e91eae24765ea0c9ca38) |
| GUI-006 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/034b53f63d33c8374f2d26a42b08e236e0cbec20) |
| GUI-006 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-006.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/90b09ddf69e520e2fda77e420b54e0ec84a58a14) |
| GUI-007 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-007.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/37ad72d06c2304c4d2279f3b58b117c76fc5d488) |
| GUI-007 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-007.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c2c8f51bb9e7251bcdc04c59f023d21ed87aee4f) |
| GUI-007 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-007.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ca692491a6fb1299e812eb0f62f274084e0eb2af) |
| GUI-008 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cc10c0e6d2cd2ccde868ab3e799567490db11e22) |
| GUI-008 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/6c34c337038b4847e66db0d4e2d31601542c45fd) |
| GUI-008 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-008.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/9b9c135468fa48f5b7e1cfc4e43bc0b29f6462c6) |
| GUI-009 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-009.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/222509689cd5d9fe54f98d21fee2118ec549feed) |
| GUI-009 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-009.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e752091369a6bd62b9295b9cb554a5b0a247aedb) |
| GUI-009 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-009.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/961c035b73fdc25dec858997171d32dd8b73bd0a) |
| GUI-012 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-012.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/592d4051c482bbbc5ad089d8d6ee4744e0220c3d) |
| GUI-012 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-012.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7bbd221789c7141ca9f3ddae7cfc1f4c73fdaa89) |
| GUI-012 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-012.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/60617966321f60ad0a2ca2c4df7f2673a2f00c41) |
| GUI-013 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-013.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/16cdfb162c4542ba2b5c997ba4dc1080ab8f3ffa) |
| GUI-013 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-013.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/061bdd57b524c96378c75f1b015b41e5edcd850e) |
| GUI-013 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-013.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d3ee10ea3dd4c55af8a442dd63b72d6a272a1a79) |
| GUI-014 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/80da17ac3404cdbf4a28fdcbf876835074a76e25) |
| GUI-014 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/238d624dbdfdd40f8220d7fa9d9f17f56f47346c) |
| GUI-014 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-014.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a7c4720f7f024fd307c57210fd3e5a87843913b4) |
| GUI-015 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-015.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/261acfa0157ee2be71a297f0e450536386364649) |
| GUI-015 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-015.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cae55fac98fef6a040d2f65d7663373965211c85) |
| GUI-015 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-015.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e8af52922f98a6aa8b2cb3caf1abb4bd055f17a2) |
| GUI-018 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/058b0bd1b500900c1eb1f5ced602d09ad9efd841) |
| GUI-018 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ef7aa76ae0ad2aac5c39ed0ab3a50f5ef0e1279d) |
| GUI-018 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-018.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/53c57df3ae92d857a0109376d6c5a767a5061c9d) |
| GUI-019 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-019.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/11092800711be08785da43b48492491dc8b06d0a) |
| GUI-019 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-019.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/bcd5841161120d1f77c80edc9a5eb32c09a9f7d0) |
| GUI-019 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-019.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/380014aa596943055dea9e538b1503417fd0af05) |
| GUI-020 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-020.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5ebee47a12efe067bfbe080dc89c9e59d07d9efd) |
| GUI-020 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-020.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/657cc1160b66e2f80746f45336858e61dfb576a1) |
| GUI-020 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-020.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d0b6076be41547b08abf12bc140b4c76355b44ab) |
| GUI-021 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-021.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d9676b65ca07a119728691970e93ca7e2aaf90f5) |
| GUI-021 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-021.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/39dc33b5de8eb6fbaa5ac2695d5466ec098d03a3) |
| GUI-021 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-021.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/de6af8947281141747da17efdf51f27d65376b1c) |
| GUI-024 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-024.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/28c17efc84af2119d909963eafa83eae1e7a05e2) |
| GUI-024 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-024.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/be8a135fb1bb0cf121d791bcc532a0cb11daf1d1) |
| GUI-024 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-024.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/853cea673e1c147921f5b58df960ba6ef98d7e5f) |
| GUI-025 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-025.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/63a39b800632720c2f218427152530097cf02d03) |
| GUI-025 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-025.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7af1a880105e68184d7c76aafa43e8b744b373b7) |
| GUI-025 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-025.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/2469699e42cc8c1422892cd558200f61ff6f617d) |
| GUI-026 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-026.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/723bd513287882b9197c60540e7cccdf9af9a390) |
| GUI-026 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-026.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c4816d2fe67df2946b67270a9b8dfc8f22346151) |
| GUI-026 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-026.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/24abe05e40cd8ece2267583ff96beffb50f9c8e6) |
| GUI-028 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7e5ff0377687b7b1a88879147c68402d49ea104c) |
| GUI-028 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/4b69664b30244a6821a621ab23fe6ae15b2646a7) |
| GUI-028 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-028.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/836e6d07d68728176154a16912882fe87c647716) |
| GUI-029 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a3276497db69f34beea317a901a37da1934119bb) |
| GUI-029 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1e4a508bda1c40807c305a2e119efe439822ab53) |
| GUI-029 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-029.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e3126dd35c88debd3f660921db7a3f36ac90a7e9) |
| GUI-030 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-030.png) | passed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/9938e081f919b1ee79fb3eec5659f9930f36a7a4) |
| GUI-030 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-030.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1b5cff6a22e7bf1273a93c26f13f18cf833a0b66) |
| GUI-030 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-030.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/3aa092311c927fa69054693bee36b05c776b2caf) |
| GUI-031 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-031.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/33aa6ae9da708ca54fdbd365b9410e4516260465) |
| GUI-031 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-031.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/2817fe8d52a14abfd5d174c94cc17af1f9b3c3b1) |
| GUI-031 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-031.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/6cf8860e4ba5490400ecb70ab3a0cf9a8c12efae) |
| GUI-032 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-032.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7a8c031b464fa3c82817037e2fa15c6a45c1a06a) |
| GUI-032 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-032.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d66b5cbf8cf442a3b52e4b511f4dd947e1700f0e) |
| GUI-032 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-032.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a4b8d57ef2bdb6fdb71a683e932cbd87738c357e) |
| GUI-033 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-033.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ca1a783ec2b06e1a9155817d121f10fbac99a6ac) |
| GUI-033 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-033.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/41f2f00a4482aa4d4c391f88ec277301a4b10de3) |
| GUI-033 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-033.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/2e5e2e801331e68bf8aaa02ff808b3c04284892d) |
| GUI-034 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-034.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/897f09942a2e0c5e857f8898194cba191d5b3c67) |
| GUI-034 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-034.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/600920fc152dd8fde40ad57b1f798948a5760e4c) |
| GUI-034 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-034.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/01c3646bad52c5b6f63a3ee176154c956c14ccd5) |
| GUI-036 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-036.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e7f1d57eefb1ad64b6a1483e28f7b178901dfe4c) |
| GUI-036 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-036.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/8d53b6b89dfc8c0b13260b2f5ab7f0c636b9610e) |
| GUI-036 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-036.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/8558cf5cb1bc5bf89432ccff34939a0c6276e3de) |
| GUI-037 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-037.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7d7c1dc6df85171424a86911fe808285f43e4577) |
| GUI-037 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-037.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1e128a1b9a16eabe4bd63f8f037737f19be093cc) |
| GUI-037 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-037.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/0493cc34f3f45ce851cc507da02073396b263cc5) |
| GUI-038 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-038.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/86bf6da49265c2c4d99449a08cab4c869415bee4) |
| GUI-038 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-038.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/87d42d13ac5556354f2663dc9b6f806d647f43f6) |
| GUI-038 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-038.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/91271b543958ea3bce8d1fbdbe60607a57c1369d) |
| GUI-039 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-039.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/861ded2b1a4ed08a0cb7195946bdad2cb10b546d) |
| GUI-039 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-039.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cfb0b5527394a9af00e6e1434e5329e1357216f7) |
| GUI-039 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-039.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/849183512c1534d983eadb74be4c7e7a09134a29) |
| GUI-040 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-040.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/228614bc8f39a2cf9435c5729d8e5e0b80d58e31) |
| GUI-040 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-040.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c3e643a9bb996d6ee0ff9c16af5853408ff2f9d6) |
| GUI-040 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-040.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a9d2c6880220381f0819cdc3b4366ffd6c2b6841) |
| GUI-041 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-041.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d6dbc508e6c8b0ddaf2a0d53f8e838c885168371) |
| GUI-041 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-041.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/40cca0826dd912b79fcb843a525d51290ef3d443) |
| GUI-041 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-041.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1f4fc0d45b47a924eef6021b9c093b3ed7364944) |
| GUI-043 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/4c96e7e8f2ca12a8fe31a84201ce8ea4f9ec07a8) |
| GUI-043 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7a6aa5dc6bb4a2e557db105b8368da172f32afb7) |
| GUI-043 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-043.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/98a56deaeb4aee62b0a02f3a4e012db7a7fc61aa) |
| GUI-044 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-044.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/aa6d4bca2d3e7fa4638ce2cd3052b9c87f6f1117) |
| GUI-044 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-044.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c11dc65a57e5654eacbd04ce6cf4260cd6ea6209) |
| GUI-044 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-044.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e2aac05ee8b9cc43bf2b6cd49962ea6edd5a311b) |
| GUI-045 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-045.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e3066d431b1898a7d4cf2c3fba755a1591b9a73b) |
| GUI-045 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-045.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a345536043c16368c4595d656158ed10a8b5a8c2) |
| GUI-045 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-045.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f080592898c651f9943b5f3fdc491bf745e227e8) |
| GUI-047 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/afbd73711233aa6e106d845371fcaade2328150d) |
| GUI-047 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/eec8f6a648027064e4d8d7fc0b4bea80bc71cddc) |
| GUI-047 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-047.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/cbdb71d9c2df2ad92ddcf6d28448fc488ccb1cf7) |
| GUI-048 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-048.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/a91f8e60af879b801ceb396cc3b10063131a1da9) |
| GUI-048 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-048.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/69dd2f9dfebe1425adff0c5dde31ac509f340415) |
| GUI-048 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-048.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/b24ffae2dfb3485c82c6a0dddadf5692449b78b0) |
| GUI-050 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/057cac35935177c1f2ad4c9e78a2d95658c644a0) |
| GUI-050 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/8077a2fb48a925ca36c7f1f6e9f8214adc1b9dc2) |
| GUI-050 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-050.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/7e2d3fad37d45d1245823e6a3fa5c6bcbafdb032) |
| GUI-051 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-051.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5227c7a360dfb8d623ad1ddcb8d4b5742ae09768) |
| GUI-051 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-051.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/478f87edd74900c6f6c792ed0e4530dcb79664ce) |
| GUI-051 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-051.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/8131a7a343425072b26d31a7faf487ed6133ad9e) |
| GUI-052 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/2a62cec3af291fa4b10ec3972981edf41ce35311) |
| GUI-052 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/aa4e16e0e8fd35051be5ff80b36c1a1a86dac0c4) |
| GUI-052 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-052.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/641545c1d386ce14eff86b6fdf9f27e63c9618d0) |
| GUI-055 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-055.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/27c57bf3bfcbf3e1644eb3272baa028f343df6b9) |
| GUI-055 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-055.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1621a75af9e31add4f26a3cbc5ba6b49d0b84c98) |
| GUI-055 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-055.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/668807de8cb623bed3c64278ad6181cd38393ae1) |
| GUI-057 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-057.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/5504f4eb002a4c049838106e5af86f68a61ef8bd) |
| GUI-057 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-057.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/14d57ad35a873931bf01541e98021b30f9314056) |
| GUI-057 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-057.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ed2471195a193d09d62317160058dbff6da71bdd) |
| GUI-059 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-059.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/e017de0a97a1ec9d2b1ceaf08b558081023c29fd) |
| GUI-059 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-059.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/249dcb5e7fc37b257ae919171298204721b18945) |
| GUI-059 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-059.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/60650d2da2d2eea0785c93553cf116d49a0605f3) |
| GUI-060 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f42c21f807fa66a1b9b9f95f1f4619aef357e746) |
| GUI-060 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/d35e62df80c1b6e118c0b82df8c448510d996fa0) |
| GUI-060 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-060.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/aa07fe6ec4633d6b2c01daf0f1b64ad755b5d318) |
| GUI-061 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-061.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/52924137dd5a60640185f9a940c3990bf1dc243f) |
| GUI-061 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-061.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/c66774b950ebba34a79aae75f4503a08f5317d56) |
| GUI-061 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-061.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/09adfc8ee2c79ab3d128b748dfcd2073efd8282b) |
| GUI-066 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/1c88c681a8ff706ba8fd4404b19b976496a8d9de) |
| GUI-066 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/54d9faa6b177c8461ce283474a00428e515573c5) |
| GUI-066 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-066.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/b76a2c23f2c624cd04485a68a20d3f89734d77ec) |
| GUI-067 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-067.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/10da3c8bc6fdb81630b0c8b2c862e38e9b8dffbe) |
| GUI-067 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-067.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/008dc72b0784ab7df8e2b34cc7d90444372aafd4) |
| GUI-067 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-067.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/eca20f6d9e5817d5c705b845bc0f7f0a5d5f552d) |
| GUI-068 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/02d611929d30724af0ef0f5ab92938dcc0b527ff) |
| GUI-068 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/ec58d3dd88d22d89d5cb4bb95af45190b41130ed) |
| GUI-068 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-068.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f774a3e0656a3ba3f4fcfd60b96832862889ceb9) |
| GUI-070 | p1-chrome-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p1-chrome-win11/GUI-070.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/f470c7ad48e6fcb438372db1102426115c5d54c8) |
| GUI-070 | p2-firefox-win11 | [Xem ảnh](../cross-platform/browser-evidence/images/p2-firefox-win11/GUI-070.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/6e6bb37271a4de2a0149de4307090dc54642c031) |
| GUI-070 | p3-android-chrome | [Xem ảnh](../cross-platform/browser-evidence/images/p3-android-chrome/GUI-070.png) | assertion-failed | [BrowserStack](https://automate.browserstack.com/dashboard/v2/sessions/00eb702bec73ebf65ba23332a132ccd51d3d6192) |
