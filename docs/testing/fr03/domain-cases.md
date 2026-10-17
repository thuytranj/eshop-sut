# Domain Test Cases - FR-03

> Đây là hồ sơ thiết kế nguồn: các ô Not Run/Chưa ghi nhận dưới đây là trạng thái ở bước sinh case, không phải kết quả hiện hành. Kết quả lịch sử theo canonical ID nằm tại [test-results.md](test-results.md); bảng ánh xạ đầy đủ ở [suite-review.md](suite-review.md). ID nguồn được giữ để truy vết.

## 1. Full Domain Test Cases

Tất cả các ca kiểm thử được khởi tạo ở trạng thái ban đầu là `Not Run`, kết quả thực tế `Chưa ghi nhận` và bằng chứng `None` để bảo đảm tính trung thực trước khi thực thi.

---

### 1.1 Nhóm Ca Cấp phát Mã OTP (API - Issuance)

#### `FR03-DT-ISS-01`

| Field | Details |
|---|---|
| **Rule(s)** | R01, R02, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản `fr03-a@example.com` tồn tại, mật khẩu hiện tại `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com" }` gửi tới `POST /api/forgot-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email của tài khoản A.<br>2. Ghi nhận response code và body.<br>3. Kiểm tra mã OTP trả về và truy vấn CSDL để xác minh token được gán cho tài khoản A.<br>4. Xác minh mật khẩu của tài khoản A không bị thay đổi. |
| **Expected Result** | - HTTP Status: 200 OK.<br>- Body chứa `resetToken` là chuỗi gồm đúng 6 chữ số (`^[0-9]{6}$`).<br>- CSDL lưu `reset_token` khớp với mã trả về; mật khẩu của tài khoản A vẫn là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-ISS-02`

| Field | Details |
|---|---|
| **Rule(s)** | R01, R09 |
| **Layer** | API |
| **Preconditions** | Email `fr03-missing@example.com` không tồn tại trong hệ thống. |
| **Input Fixture** | `{ "email": "fr03-missing@example.com" }` gửi tới `POST /api/forgot-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email không tồn tại.<br>2. Ghi nhận response code và body.<br>3. Truy vấn CSDL xác minh không có bản ghi nào bị thay đổi. |
| **Expected Result** | - Hệ thống từ chối yêu cầu (mã lỗi HTTP 4xx, không sinh mã OTP hợp lệ).<br>- Không có bất kỳ thay đổi nào trong bảng `users`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

### 1.2 Nhóm Ca Biên Độ dài Mật khẩu mới (API - Password Length)

#### `FR03-DT-LEN-01` (Off point - Độ dài 7)

| Field | Details |
|---|---|
| **Rule(s)** | R06, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!" }` (độ dài 7) gửi tới `POST /api/reset-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 7 ký tự.<br>2. Kiểm tra mã phản hồi HTTP và dữ liệu bảng `users` trong CSDL. |
| **Expected Result** | Yêu cầu bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-LEN-02` (On point - Độ dài 8)

| Field | Details |
|---|---|
| **Rule(s)** | R06, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!" }` (độ dài 8) gửi tới `POST /api/reset-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 8 ký tự.<br>2. Kiểm tra response code và CSDL.<br>3. Đăng nhập thử bằng mật khẩu mới. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); mật khẩu tài khoản A được cập nhật thành `Abcdef1!`; token được hủy (NULL); đăng nhập thành công bằng mật khẩu mới. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-LEN-03` (Off point hợp lệ - Độ dài 9)

| Field | Details |
|---|---|
| **Rule(s)** | R06, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!" }` (độ dài 9) gửi tới `POST /api/reset-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 9 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); mật khẩu được cập nhật thành `Abcdefg1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-LEN-04` (In point - Đối chứng trong miền - Độ dài 10)

| Field | Details |
|---|---|
| **Rule(s)** | R06, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!" }` (độ dài 10) gửi tới `POST /api/reset-password` |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 10 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); mật khẩu được cập nhật thành `Abcdefgh1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

### 1.3 Nhóm Ca Phân vùng Lớp Ký tự Mật khẩu (API - Character Classes)

#### `FR03-DT-CLASS-01` (Thiếu chữ hoa)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ hoa.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-CLASS-02` (Thiếu chữ thường)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ thường.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-CLASS-03` (Thiếu chữ số)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-CLASS-04` (Thiếu ký tự đặc biệt)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu ký tự đặc biệt.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

### 1.4 Nhóm Ca Ký tự Đặc biệt Cụ thể (API - Special Characters)

#### `FR03-DT-SPECIAL-01` (Ký tự `@`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1@" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `@`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1@`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-02` (Ký tự `$`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1$" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `$`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1$`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-03` (Ký tự `!`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `!`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-04` (Ký tự `%`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1%" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `%`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1%`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-05` (Ký tự `*`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1*" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `*`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1*`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-06` (Ký tự `?`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1?" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `?`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1?`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-07` (Ký tự `&`)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1&" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `&`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Chấp nhận thành công (HTTP 200); cập nhật mật khẩu thành `Abcdef1&`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-SPECIAL-08` (Khoảng trắng - Dấu cách)

| Field | Details |
|---|---|
| **Rule(s)** | R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1 " }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chỉ dùng khoảng trắng làm ký tự không phải chữ/số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

### 1.5 Nhóm Ca Hình thức và Ràng buộc Mã OTP (API - Token Shape & Binding)

#### `FR03-DT-TOKEN-01` (Độ dài 5 số)

| Field | Details |
|---|---|
| **Rule(s)** | R02, R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 5 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-TOKEN-02` (Độ dài 7 số)

| Field | Details |
|---|---|
| **Rule(s)** | R02, R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 7 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-TOKEN-03` (Độ dài 6 nhưng chứa ký tự chữ)

| Field | Details |
|---|---|
| **Rule(s)** | R02, R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "12345x", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP chứa chữ.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-TOKEN-04` (Độ dài 6 số đúng định dạng nhưng không đúng mã được cấp)

| Field | Details |
|---|---|
| **Rule(s)** | R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "234567", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 6 số không thuộc quyền sở hữu.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-BIND-01` (Gửi token của A cho email B)

| Field | Details |
|---|---|
| **Rule(s)** | R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token `123456`, tài khoản B có token `654321`. Cả hai có mật khẩu `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` cho email B nhưng gửi kèm token của A.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu của cả A và B đều không bị thay đổi. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-BIND-02` (Gửi token của B cho email A)

| Field | Details |
|---|---|
| **Rule(s)** | R05, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token `123456`, tài khoản B có token `654321`. Cả hai có mật khẩu `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-a@example.com", "resetToken": "654321", "newPassword": "Abcdef1!" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` cho email A nhưng gửi kèm token của B.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối; mật khẩu của cả A và B đều không bị thay đổi. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-INT-02` (Tương tác đa biến: Sai token chéo + Mật khẩu thiếu ký tự đặc biệt)

| Field | Details |
|---|---|
| **Rule(s)** | R05, R07, R09 |
| **Layer** | API |
| **Preconditions** | Tài khoản A có token `123456`, tài khoản B có token `654321`. Cả hai có mật khẩu `OldPass1!`. |
| **Input Fixture** | `{ "email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef12" }` |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` cho email B với token của A và mật khẩu thiếu ký tự đặc biệt.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Bị từ chối an toàn; mật khẩu cả A và B giữ nguyên. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

### 1.6 Nhóm Ca Kiểm thử Giao diện Web (WEB - Flow, Navigation, Confirmation, Specials)

#### `FR03-DT-WEB-FLOW-01` (Quy trình 2 bước và hiển thị OTP demo)

| Field | Details |
|---|---|
| **Rule(s)** | R02, R03 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A tồn tại trong hệ thống. |
| **Input Fixture** | `{ "email": "fr03-a@example.com" }` |
| **Test Steps** | 1. Truy cập `/forgot-password`.<br>2. Nhập email A và nhấn gửi.<br>3. Quan sát chỉ báo bước và thông báo OTP. |
| **Expected Result** | Màn hình thể hiện Bước 1 / 2, sau khi gửi chuyển sang Bước 2 / 2; hiển thị mã OTP demo gồm đúng 6 chữ số. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-NAV-01` (Nút quay lại đăng nhập)

| Field | Details |
|---|---|
| **Rule(s)** | R04 |
| **Layer** | WEB |
| **Preconditions** | Đang ở trang `/forgot-password` tại Bước 1. |
| **Input Fixture** | N/A |
| **Test Steps** | 1. Tại màn hình quên mật khẩu Bước 1, nhấn nút "Quay lại đăng nhập".<br>2. Kiểm tra URL trình duyệt. |
| **Expected Result** | Trình duyệt điều hướng về trang `/login`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-01` (Khớp xác nhận mật khẩu - Cặp danh định 1)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1!", confirmPassword = "Abcdef1!"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP `123456`, mật khẩu mới và xác nhận mật khẩu khớp nhau.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Cho phép submit thành công, chuyển hướng về `/login`. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-02` (Khớp xác nhận mật khẩu - Cặp danh định 2)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Zyxwvu2&", confirmPassword = "Zyxwvu2&"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP `123456`, mật khẩu mới và xác nhận mật khẩu khớp nhau.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Cho phép submit thành công. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-03` (Lệch xác nhận - Nhiễu động Thay thế)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1!", confirmPassword = "Abcdef2!"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP `123456`, mật khẩu mới và xác nhận mật khẩu bị thay thế 1 ký tự.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Bị từ chối trên giao diện, hiển thị thông báo mật khẩu xác nhận không khớp. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-04` (Lệch xác nhận - Nhiễu động Xóa ký tự)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1!", confirmPassword = "Abcdef1"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP `123456`, mật khẩu mới và xác nhận mật khẩu bị xóa 1 ký tự.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Bị từ chối trên giao diện. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-05` (Lệch xác nhận - Nhiễu động Chèn ký tự)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1!", confirmPassword = "Abcdef1!!"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP `123456`, mật khẩu mới và xác nhận mật khẩu bị chèn thêm 1 ký tự.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Bị từ chối trên giao diện. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-CONF-06` (Kiểm tra sự hiện diện của trường xác nhận mật khẩu)

| Field | Details |
|---|---|
| **Rule(s)** | R08 |
| **Layer** | WEB |
| **Preconditions** | Tại Bước 2 của trang ForgotPassword. |
| **Input Fixture** | N/A |
| **Test Steps** | 1. Kiểm tra cấu trúc DOM tại Bước 2 của trang ForgotPassword.<br>2. Thử submit để trống trường xác nhận. |
| **Expected Result** | Trường input "Xác nhận mật khẩu mới" tồn tại trong form. Nếu để trống hoặc không nhập xác nhận thì không thể submit. (Nếu trường không tồn tại trong code $\implies$ Ghi nhận lỗi thiếu sót yêu cầu). |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-01` (Ký tự `@` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1@"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `@`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-02` (Ký tự `$` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1$"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `$`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-03` (Ký tự `!` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1!"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `!`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-04` (Ký tự `%` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1%"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `%`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-05` (Ký tự `*` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1*"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `*`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-06` (Ký tự `?` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1?"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `?`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-07` (Ký tự `&` trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1&"` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chứa ký tự `&`.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

#### `FR03-DT-WEB-SPECIAL-08` (Khoảng trắng trên Web)

| Field | Details |
|---|---|
| **Rule(s)** | R07 |
| **Layer** | WEB |
| **Preconditions** | Tài khoản A có token `123456`. |
| **Input Fixture** | `newPassword = "Abcdef1 "` |
| **Test Steps** | 1. Tại Bước 2, nhập OTP và mật khẩu chỉ chứa khoảng trắng làm ký tự không phải chữ/số.<br>2. Nhấn "Đặt lại mật khẩu". |
| **Expected Result** | Mật khẩu dùng khoảng trắng bị form chặn và báo lỗi mật khẩu yếu. |
| **Actual Result** | Chưa ghi nhận |
| **Status** | Not Run |
| **Evidence** | None |

---

## 2. Ma trận Nghĩa vụ và Độ bao phủ Thiết kế (Obligation Matrix & Designed Coverage)

| Mã Nghĩa vụ | Nội dung Nghĩa vụ Kiểm thử Miền | Mã Quy tắc | Mã Ca Kiểm thử Đáp ứng |
|---|---|:---:|---|
| **OBL-DT-01** | Cấp phát OTP cho email tồn tại | R01, R02 | `FR03-DT-ISS-01` |
| **OBL-DT-02** | Xử lý yêu cầu OTP email không tồn tại | R01 | `FR03-DT-ISS-02` |
| **OBL-DT-03** | Điểm biên độ dài MK: 7 (Off point) | R06 | `FR03-DT-LEN-01` |
| **OBL-DT-04** | Điểm biên độ dài MK: 8 (On point) | R06 | `FR03-DT-LEN-02` |
| **OBL-DT-05** | Điểm biên độ dài MK: 9 (Off point hợp lệ) | R06 | `FR03-DT-LEN-03` |
| **OBL-DT-06** | Điểm đối chứng độ dài MK: 10 (In point) | R06 | `FR03-DT-LEN-04` |
| **OBL-DT-07** | Phân vùng thiếu chữ hoa | R07 | `FR03-DT-CLASS-01` |
| **OBL-DT-08** | Phân vùng thiếu chữ thường | R07 | `FR03-DT-CLASS-02` |
| **OBL-DT-09** | Phân vùng thiếu chữ số | R07 | `FR03-DT-CLASS-03` |
| **OBL-DT-10** | Phân vùng thiếu ký tự đặc biệt | R07 | `FR03-DT-CLASS-04` |
| **OBL-DT-11** | 7 phân vùng ký tự đặc biệt hợp lệ (API) | R07 | `FR03-DT-SPECIAL-01..07` |
| **OBL-DT-12** | Phân vùng ký tự khoảng trắng (API) | R07 | `FR03-DT-SPECIAL-08` |
| **OBL-DT-13** | Phân vùng hình thức OTP: độ dài 5 | R02, R05 | `FR03-DT-TOKEN-01` |
| **OBL-DT-14** | Phân vùng hình thức OTP: độ dài 7 | R02, R05 | `FR03-DT-TOKEN-02` |
| **OBL-DT-15** | Phân vùng hình thức OTP: ký tự không phải số | R02, R05 | `FR03-DT-TOKEN-03` |
| **OBL-DT-16** | Phân vùng OTP 6 số không thuộc quyền | R05 | `FR03-DT-TOKEN-04` |
| **OBL-DT-17** | Ràng buộc sở hữu token: A dùng cho B | R05 | `FR03-DT-BIND-01` |
| **OBL-DT-18** | Ràng buộc sở hữu token: B dùng cho A | R05 | `FR03-DT-BIND-02` |
| **OBL-DT-19** | Tương tác đa biến: Sai token + sai mật khẩu | R05, R07 | `FR03-DT-INT-02` |
| **OBL-DT-20** | Chỉ báo bước và hiển thị OTP demo trên UI | R02, R03 | `FR03-DT-WEB-FLOW-01` |
| **OBL-DT-21** | Điều hướng quay lại trang đăng nhập | R04 | `FR03-DT-WEB-NAV-01` |
| **OBL-DT-22** | Khớp xác nhận mật khẩu (2 điểm trên biên) | R08 | `FR03-DT-WEB-CONF-01, 02` |
| **OBL-DT-23** | Lệch xác nhận mật khẩu (3 nhiễu động cận biên) | R08 | `FR03-DT-WEB-CONF-03, 04, 05` |
| **OBL-DT-24** | Hiện diện trường xác nhận mật khẩu trên UI | R08 | `FR03-DT-WEB-CONF-06` |
| **OBL-DT-25** | 7 ký tự đặc biệt + khoảng trắng trên UI | R07 | `FR03-DT-WEB-SPECIAL-01..08` |

### Thống kê Độ bao phủ Thiết kế (Designed Coverage):
- **Tổng số nghĩa vụ kiểm thử miền xác định:** 25 / 25 (100% nghĩa vụ quy tắc R01-R09 được ánh xạ).
- **Tổng số ca kiểm thử miền thiết kế:** 41 ID nguồn (25 API + 16 WEB), ánh xạ vào 40 ca canonical có nhãn Domain Testing (24 API + 16 WEB). Không cộng số ID nguồn với số ca canonical; tổng suite lịch sử vẫn là 52.
- **Trạng thái ban đầu:** 100% `Not Run`.
