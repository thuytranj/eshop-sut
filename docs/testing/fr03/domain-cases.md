# Danh mục Ca Kiểm thử Miền (Domain Test Cases) - FR-03

> Đây là hồ sơ thiết kế nguồn: các ô Not Run/Chưa ghi nhận dưới đây là trạng thái ở bước sinh case, không phải kết quả hiện hành. Kết quả lịch sử theo canonical ID nằm tại [test-results.md](test-results.md); bảng ánh xạ đầy đủ ở [suite-review.md](suite-review.md). ID nguồn được giữ để truy vết.

## 1. Danh sách Ca Kiểm thử Miền Đầy đủ (Full Domain Test Cases)

Tất cả các ca kiểm thử được khởi tạo ở trạng thái ban đầu là `Not Run`, kết quả thực tế `Chưa ghi nhận` và bằng chứng `None` để bảo đảm tính trung thực trước khi thực thi.

### 1.1 Nhóm Ca Cấp phát Mã OTP (API - Issuance)

#### `FR03-DT-ISS-01`
- **Quy tắc:** R01, R02, R09
- **Tầng:** API
- **Tiền điều kiện:** Tài khoản `fr03-a@example.com` tồn tại, mật khẩu hiện tại `OldPass1!`.
- **Dữ liệu đầu vào:** `{ "email": "fr03-a@example.com" }` gửi tới `POST /api/forgot-password`.
- **Các bước thực hiện:**
  1. Gửi request HTTP POST tới `/api/forgot-password` với email của tài khoản A.
  2. Ghi nhận response code và body.
  3. Kiểm tra mã OTP trả về và truy vấn CSDL để xác minh token được gán cho tài khoản A.
  4. Xác minh mật khẩu của tài khoản A không bị thay đổi.
- **Kết quả kỳ vọng:**
  - HTTP Status: 200 OK.
  - Body chứa `resetToken` là chuỗi gồm đúng 6 chữ số (`^[0-9]{6}$`).
  - CSDL lưu `reset_token` khớp với mã trả về; mật khẩu của tài khoản A vẫn là `OldPass1!`.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

#### `FR03-DT-ISS-02`
- **Quy tắc:** R01, R09
- **Tầng:** API
- **Tiền điều kiện:** Email `fr03-missing@example.com` không tồn tại trong hệ thống.
- **Dữ liệu đầu vào:** `{ "email": "fr03-missing@example.com" }` gửi tới `POST /api/forgot-password`.
- **Các bước thực hiện:**
  1. Gửi request HTTP POST tới `/api/forgot-password` với email không tồn tại.
  2. Ghi nhận response code và body.
  3. Truy vấn CSDL xác minh không có bản ghi nào bị thay đổi.
- **Kết quả kỳ vọng:**
  - Hệ thống từ chối yêu cầu (mã lỗi HTTP 4xx, không sinh mã OTP hợp lệ).
  - Không có bất kỳ thay đổi nào trong bảng `users`.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

---

### 1.2 Nhóm Ca Biên Độ dài Mật khẩu mới (API - Password Length)

#### `FR03-DT-LEN-01` (Off point - Độ dài 7)
- **Quy tắc:** R06, R09
- **Tầng:** API
- **Tiền điều kiện:** Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`.
- **Dữ liệu đầu vào:** `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!" }` (độ dài 7) gửi tới `POST /api/reset-password`.
- **Các bước thực hiện:** Gửi request đổi mật khẩu với mật khẩu 7 ký tự; kiểm tra response và CSDL.
- **Kết quả kỳ vọng:** Yêu cầu bị từ chối; mật khẩu tài khoản A giữ nguyên là `OldPass1!`.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

#### `FR03-DT-LEN-02` (On point - Độ dài 8)
- **Quy tắc:** R06, R09
- **Tầng:** API
- **Tiền điều kiện:** Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`.
- **Dữ liệu đầu vào:** `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!" }` (độ dài 8) gửi tới `POST /api/reset-password`.
- **Các bước thực hiện:** Gửi request đổi mật khẩu với mật khẩu 8 ký tự; kiểm tra response và CSDL; đăng nhập thử bằng mật khẩu mới.
- **Kết quả kỳ vọng:** Chấp nhận thành công (HTTP 200); mật khẩu tài khoản A được cập nhật thành `Abcdef1!`; token được hủy (NULL); đăng nhập thành công bằng mật khẩu mới.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

#### `FR03-DT-LEN-03` (Off point hợp lệ - Độ dài 9)
- **Quy tắc:** R06, R09
- **Tầng:** API
- **Tiền điều kiện:** Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`.
- **Dữ liệu đầu vào:** `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!" }` (độ dài 9) gửi tới `POST /api/reset-password`.
- **Các bước thực hiện:** Gửi request đổi mật khẩu với mật khẩu 9 ký tự; kiểm tra response và CSDL.
- **Kết quả kỳ vọng:** Chấp nhận thành công (HTTP 200); mật khẩu được cập nhật thành `Abcdefg1!`.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

#### `FR03-DT-LEN-04` (In point - Đối chứng trong miền - Độ dài 10)
- **Quy tắc:** R06, R09
- **Tầng:** API
- **Tiền điều kiện:** Tài khoản A có token hợp lệ `123456`, mật khẩu cũ `OldPass1!`.
- **Dữ liệu đầu vào:** `{ "email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!" }` (độ dài 10) gửi tới `POST /api/reset-password`.
- **Các bước thực hiện:** Gửi request đổi mật khẩu với mật khẩu 10 ký tự; kiểm tra response và CSDL.
- **Kết quả kỳ vọng:** Chấp nhận thành công (HTTP 200); mật khẩu được cập nhật thành `Abcdefgh1!`.
- **Kết quả thực tế:** Chưa ghi nhận
- **Trạng thái:** Not Run
- **Bằng chứng:** None

---

### 1.3 Nhóm Ca Phân vùng Lớp Ký tự Mật khẩu (API - Character Classes)

#### `FR03-DT-CLASS-01` (Thiếu chữ hoa)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:** `newPassword = "abcdef1!"` (chỉ có thường, số, đặc biệt).
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu tài khoản A giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-CLASS-02` (Thiếu chữ thường)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:** `newPassword = "ABCDEF1!"` (chỉ có hoa, số, đặc biệt).
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu tài khoản A giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-CLASS-03` (Thiếu chữ số)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:** `newPassword = "Abcdefg!"` (chỉ có hoa, thường, đặc biệt).
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu tài khoản A giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-CLASS-04` (Thiếu ký tự đặc biệt)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:** `newPassword = "Abcdef12"` (chỉ có hoa, thường, số).
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu tài khoản A giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

---

### 1.4 Nhóm Ca Ký tự Đặc biệt Cụ thể (API - Special Characters)

#### `FR03-DT-SPECIAL-01` đến `FR03-DT-SPECIAL-07` (7 ký tự hợp lệ)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:**
  - SPECIAL-01: `newPassword = "Abcdef1@"`
  - SPECIAL-02: `newPassword = "Abcdef1$"`
  - SPECIAL-03: `newPassword = "Abcdef1!"`
  - SPECIAL-04: `newPassword = "Abcdef1%"`
  - SPECIAL-05: `newPassword = "Abcdef1*"`
  - SPECIAL-06: `newPassword = "Abcdef1?"`
  - SPECIAL-07: `newPassword = "Abcdef1&"`
- **Kết quả kỳ vọng:** Cả 7 ca đều được chấp nhận thành công (HTTP 200); cập nhật mật khẩu tương ứng.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-SPECIAL-08` (Khoảng trắng - Dấu cách)
- **Quy tắc:** R07, R09
- **Tầng:** API
- **Dữ liệu đầu vào:** `newPassword = "Abcdef1 "` (chỉ dùng khoảng trắng làm ký tự không phải chữ/số).
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu tài khoản A giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

---

### 1.5 Nhóm Ca Hình thức và Ràng buộc Mã OTP (API - Token Shape & Binding)

#### `FR03-DT-TOKEN-01` (Độ dài 5 số)
- **Quy tắc:** R02, R05, R09
- **Dữ liệu đầu vào:** `resetToken = "12345"`
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-TOKEN-02` (Độ dài 7 số)
- **Quy tắc:** R02, R05, R09
- **Dữ liệu đầu vào:** `resetToken = "1234567"`
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-TOKEN-03` (Độ dài 6 nhưng chứa ký tự chữ)
- **Quy tắc:** R02, R05, R09
- **Dữ liệu đầu vào:** `resetToken = "12345x"`
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-TOKEN-04` (Độ dài 6 số đúng định dạng nhưng không đúng mã được cấp)
- **Quy tắc:** R05, R09
- **Dữ liệu đầu vào:** `resetToken = "234567"`
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu A giữ nguyên; token A vẫn là `123456`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-BIND-01` (Gửi token của A cho email B)
- **Quy tắc:** R05, R09
- **Dữ liệu đầu vào:** `email = "fr03-b@example.com", resetToken = "123456"` (mã của A)
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu của cả A và B đều không bị thay đổi.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-BIND-02` (Gửi token của B cho email A)
- **Quy tắc:** R05, R09
- **Dữ liệu đầu vào:** `email = "fr03-a@example.com", resetToken = "654321"` (mã của B)
- **Kết quả kỳ vọng:** Bị từ chối; mật khẩu của cả A và B đều không bị thay đổi.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-INT-02` (Tương tác đa biến: Sai token chéo + Mật khẩu thiếu ký tự đặc biệt)
- **Quy tắc:** R05, R07, R09
- **Dữ liệu đầu vào:** `email = "fr03-b@example.com", resetToken = "123456", newPassword = "Abcdef12"`
- **Kết quả kỳ vọng:** Bị từ chối an toàn; mật khẩu cả A và B giữ nguyên.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

---

### 1.6 Nhóm Ca Kiểm thử Giao diện Web (WEB - Flow, Navigation, Confirmation, Specials)

#### `FR03-DT-WEB-FLOW-01` (Quy trình 2 bước và hiển thị OTP demo)
- **Quy tắc:** R02, R03
- **Tầng:** WEB
- **Các bước:** Truy cập `/forgot-password`, nhập email A, nhấn gửi; quan sát chỉ báo bước và thông báo OTP.
- **Kết quả kỳ vọng:** Màn hình thể hiện Bước 1 / 2, sau khi gửi chuyển sang Bước 2 / 2; hiển thị mã OTP demo gồm đúng 6 chữ số.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-NAV-01` (Nút quay lại đăng nhập)
- **Quy tắc:** R04
- **Tầng:** WEB
- **Các bước:** Tại màn hình quên mật khẩu Bước 1, nhấn nút "Quay lại đăng nhập".
- **Kết quả kỳ vọng:** Trình duyệt điều hướng về trang `/login`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-01` (Khớp xác nhận mật khẩu - Cặp danh định 1)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Dữ liệu đầu vào:** `newPassword = "Abcdef1!", confirmPassword = "Abcdef1!"`
- **Kết quả kỳ vọng:** Cho phép submit thành công, chuyển hướng về `/login`.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-02` (Khớp xác nhận mật khẩu - Cặp danh định 2)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Dữ liệu đầu vào:** `newPassword = "Zyxwvu2&", confirmPassword = "Zyxwvu2&"`
- **Kết quả kỳ vọng:** Cho phép submit thành công.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-03` (Lệch xác nhận - Nhiễu động Thay thế)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Dữ liệu đầu vào:** `newPassword = "Abcdef1!", confirmPassword = "Abcdef2!"`
- **Kết quả kỳ vọng:** Bị từ chối trên giao diện, hiển thị thông báo mật khẩu xác nhận không khớp.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-04` (Lệch xác nhận - Nhiễu động Xóa ký tự)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Dữ liệu đầu vào:** `newPassword = "Abcdef1!", confirmPassword = "Abcdef1"`
- **Kết quả kỳ vọng:** Bị từ chối trên giao diện.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-05` (Lệch xác nhận - Nhiễu động Chèn ký tự)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Dữ liệu đầu vào:** `newPassword = "Abcdef1!", confirmPassword = "Abcdef1!!"`
- **Kết quả kỳ vọng:** Bị từ chối trên giao diện.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-CONF-06` (Kiểm tra sự hiện diện của trường xác nhận mật khẩu)
- **Quy tắc:** R08
- **Tầng:** WEB
- **Các bước:** Kiểm tra cấu trúc DOM tại Bước 2 của trang ForgotPassword.
- **Kết quả kỳ vọng:** Trường input "Xác nhận mật khẩu mới" tồn tại trong form. Nếu để trống hoặc không nhập xác nhận thì không thể submit. (Nếu trường không tồn tại trong code $\implies$ Ghi nhận lỗi thiếu sót yêu cầu).
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

#### `FR03-DT-WEB-SPECIAL-01` đến `FR03-DT-WEB-SPECIAL-08` (7 ký tự đặc biệt + khoảng trắng trên Web)
- **Quy tắc:** R07
- **Tầng:** WEB
- **Dữ liệu đầu vào:** Nhập lần lượt 7 mật khẩu hợp lệ với `@, $, !, %, *, ?, &` và mật khẩu với khoảng trắng `Abcdef1 `.
- **Kết quả kỳ vọng:** 7 mật khẩu có ký tự đặc biệt hợp lệ được form chấp nhận; mật khẩu dùng khoảng trắng bị form chặn và báo lỗi mật khẩu yếu.
- **Kết quả thực tế:** Chưa ghi nhận | **Trạng thái:** Not Run | **Bằng chứng:** None

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
