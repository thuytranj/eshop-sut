# Báo cáo tổng hợp Domain Testing và BVA — FR-03, FR-05, FR-07, FR-15

| Feature | Unique designed | Passed | Failed | Blocked | Có verdict P+F | Nguồn kết quả |
|---|---:|---:|---:|---:|---:|---|
| FR-03 API/WEB | 52 | 27 | 20 | 5 | 47 | API/WEB observations 2026-10-12 |
| FR-05 native iOS + API hỗ trợ | 45 | 23 | 12 | 10 | 35 | run02 cumulative, giữ adjudication run01 |
| FR-07 API/WEB | 32 | 13 | 15 | 4 | 28 | fr07-run01 |
| FR-15 API/Admin WEB | 158 | 56 | 95 | 7 | 151 | fr15-run03 |
| **Tổng lịch sử** | **287** | **119** | **142** | **26** | **261** | Không cộng rerun hoặc hàng trùng giữa technique |

Ngoài bảng lịch sử, FR-03 có 30 case theo slide: 15 API là alias phân tích tái sử dụng fixture cũ và 15 WEB chưa chạy. Không cộng 30 vào số đã thực thi. Timestamp không có offset được giữ nguyên và không tự suy ra timezone. Các phiên có manifest dùng thông tin môi trường của manifest; không lấy phiên bản hiện tại để xác nhận build cũ.

<a id="fr03"></a>

## FR-03 — Quên mật khẩu và đặt lại mật khẩu hai bước

### 1. Phân tích requirement

Kiểm thử Quên mật khẩu và Đặt lại mật khẩu hai bước trên API và customer WEB. 

- Bước 1: nhận email đã đăng ký, cấp OTP 6 chữ số ngẫu nhiên và hiển thị trong demo; UI có step indicator và quay lại đăng nhập. 

- Bước 2: nhận token, mật khẩu mới và xác nhận; token chỉ dùng cho email đã yêu cầu. Mật khẩu kế thừa FR-01: ít nhất 8 ký tự, có hoa, thường, số và một ký tự trong `@$!%*?&`.

Nguồn oracle: [README FR-03/FR-01](../../README.md) dòng 34–35, 46–60; [API specification](../../api_specification.md) mục 1.3–1.4. API reset chỉ có email/resetToken/newPassword: không tự thêm nghĩa vụ confirmPassword ở API. HTTP lỗi cụ thể, OTP expiry/retry/reuse, normalization email, Unicode và maximum password chưa có contract; ghi giới hạn, không tự đặt expected.

**FR03-F:** Để đảm bảo tính độc lập và tái lập được kết quả, toàn bộ các ca kiểm thử sử dụng cấu hình dữ liệu chuẩn sau:

- **Tài khoản A (Người dùng chính):**
  - Email: `fr03-a@example.com`
  - Mật khẩu hiện tại: `OldPass1!`
  - Trạng thái: Hoạt động, `login_attempts = 0`, `locked_until = NULL`.
  - Mã OTP: `123456`.
- **Tài khoản B (Người dùng thứ hai - Kiểm tra ràng buộc sở hữu):**
  - Email: `fr03-b@example.com`
  - Mật khẩu hiện tại: `OldPass1!`
  - Trạng thái: Hoạt động, `login_attempts = 0`, `locked_until = NULL`.
  - Mã OTP hợp đồng: `654321`.
- **Tài khoản C (Tài khoản không tồn tại):**
  - Email: `fr03-missing@example.com` (không có trong cơ sở dữ liệu).
- **Mật khẩu mới chuẩn:** `Abcdef1!` (độ dài 8, có 1 hoa `A`, 5 thường `bcdef`, 1 số `1`, 1 ký tự đặc biệt `!`).
- **Mật khẩu mới đối chứng thứ hai:** `Zyxwvu2&` (độ dài 8, có 1 hoa `Z`, 5 thường `yxwvu`, 1 số `2`, 1 ký tự đặc biệt `&`).

| Mã Quy tắc | Nội dung Quy tắc Nghiệp vụ | Nguồn Đặc tả | Tầng áp dụng |
|---|---|---|---|
| **R01** | **Email hợp lệ và đã đăng ký:** Email gửi yêu cầu cấp mã OTP phải là email đã tồn tại trong hệ thống. | `README.md:50`, `api_specification.md:40` | API, WEB |
| **R02** | **Cấp phát OTP 6 chữ số ngẫu nhiên:** Hệ thống sinh mã OTP ngẫu nhiên gồm đúng 6 chữ số (`0-9`) và hiển thị trên màn hình demo. | `README.md:51`, `api_specification.md:42` | API, WEB |
| **R03** | **Chỉ báo bước quy trình (Step Indicator):** Giao diện người dùng phải hiển thị rõ ràng chỉ báo bước hiện tại (ví dụ: "Bước 1 / 2" hoặc "Bước 2 / 2"). | `README.md:52` | WEB |
| **R04** | **Điều hướng quay lại đăng nhập:** Giao diện có nút "Quay lại đăng nhập" để người dùng trở về trang `/login`. | `README.md:53` | WEB |
| **R05** | **Ràng buộc sở hữu mã OTP (Token Binding):** Mã OTP gửi lên để đặt lại mật khẩu phải khớp với mã được hệ thống cấp cho chính email yêu cầu. OTP cấp cho tài khoản A không thể dùng để đổi mật khẩu tài khoản B. | `README.md:60`, `api_specification.md:50` | API, WEB |
| **R06** | **Độ dài mật khẩu mới:** Mật khẩu mới phải có độ dài tối thiểu là 8 ký tự. | `README.md:58`, `README.md:34` | API, WEB |
| **R07** | **Độ phức tạp mật khẩu mới:** Mật khẩu mới phải chứa ít nhất: 1 ký tự viết hoa, 1 ký tự viết thường, 1 chữ số và 1 ký tự đặc biệt thuộc tập hợp định sẵn: `@, $, !, %, *, ?, &`. | `README.md:58`, `README.md:34` | API, WEB |
| **R08** | **Xác nhận mật khẩu mới trên UI:** Giao diện phải có trường "Xác nhận mật khẩu mới"; hệ thống từ chối nếu hai trường mật khẩu không khớp nhau. | `README.md:57, 59` | WEB |
| **R09** | **Tính toàn vẹn trạng thái dữ liệu (State Integrity):** Khi yêu cầu đặt lại mật khẩu thành công, mật khẩu của tài khoản mục tiêu được cập nhật. Khi yêu cầu thất bại (vi phạm bất kỳ quy tắc nào), mật khẩu của mọi tài khoản trong hệ thống phải được bảo toàn nguyên vẹn. | `README.md:55-60`, `api_specification.md:44-54` | API, WEB |


### 2. Domain Testing

#### 2.1. Xác định input và output

- **Inputs:**
  - $email$: Chuỗi ký tự ASCII định danh tài khoản người dùng.
  - $token$: Chuỗi ký tự biểu diễn mã OTP xác thực.
  - $p$ (hoặc $newPassword$): Chuỗi ký tự mật khẩu mới.
  - $c$ (hoặc $confirmPassword$): Chuỗi ký tự xác nhận mật khẩu (chỉ tồn tại trên giao diện Web).
- **Output:** chấp nhận hoặc từ chối reset, password A/B sau thao tác và điều hướng/control UI. 

#### 2.2. Bước 2 — Xác định miền giá trị

### 3.1 Biên Độ dài Mật khẩu: $L(p) \iff \text{length}(p) \ge 8$
- **Độ phân giải:** 1 ký tự ASCII.
- **Điểm kiểm thử được chọn:**
  - **Off point (Ngoài biên - Bị từ chối):** `length(p) = 7` $\implies$ `Abcde1!` (độ dài 7, vi phạm $L$, các vị từ ký tự khác thỏa mãn).
  - **On point (Trên biên - Chấp nhận):** `length(p) = 8` $\implies$ `Abcdef1!` (độ dài 8, thỏa mãn tối thiểu).
  - **Off point liền kề phía hợp lệ:** `length(p) = 9` $\implies$ `Abcdefg1!` (độ dài 9, vượt ngưỡng biên 1 đơn vị).
  - **In point (Điểm trong - Đối chứng):** `length(p) = 10` $\implies$ `Abcdefgh1!` (độ dài 10, nằm vững bên trong miền hợp lệ).

### 3.2 Phân vùng Lớp Ký tự Mật khẩu: $\{U(p), D(p), N(p), S(p)\}$
Mỗi lớp ký tự là một phân vùng phân loại nhị phân (có/không). Để cô lập lỗi đơn lẻ, các ca kiểm thử vi phạm đúng một lớp ký tự trong khi giữ độ dài = 8 và các lớp khác hợp lệ:
- **Thiếu chữ hoa ($\neg U$):** `abcdef1!` (toàn chữ thường, số, đặc biệt $\implies$ Từ chối).
- **Thiếu chữ thường ($\neg D$):** `ABCDEF1!` (toàn chữ hoa, số, đặc biệt $\implies$ Từ chối).
- **Thiếu chữ số ($\neg N$):** `Abcdefg!` (hoa, thường, đặc biệt, không có số $\implies$ Từ chối).
- **Thiếu ký tự đặc biệt ($\neg S$):** `Abcdef12` (hoa, thường, số, không có đặc biệt $\implies$ Từ chối).

### 3.3 Phân vùng Tập hợp Ký tự Đặc biệt: $S(p)$
Đặc tả R07 giới hạn tập ký tự đặc biệt gồm 7 ký tự: `@, $, !, %, *, ?, &`.
- **7 phân vùng hợp lệ đại diện:** Giữ nguyên tiền tố `Abcdef1` và thay thế ký tự thứ 8 lần lượt bằng 7 ký tự quy định:
  - `@`: `Abcdef1@` $\implies$ Chấp nhận.
  - `$`: `Abcdef1$` $\implies$ Chấp nhận.
  - `!`: `Abcdef1!` $\implies$ Chấp nhận.
  - `%`: `Abcdef1%` $\implies$ Chấp nhận.
  - `*`: `Abcdef1*` $\implies$ Chấp nhận.
  - `?`: `Abcdef1?` $\implies$ Chấp nhận.
  - `&`: `Abcdef1&` $\implies$ Chấp nhận.
- **Phân vùng ký tự khoảng trắng (Negative probe):**
  - Dùng dấu cách `' '` thay cho ký tự đặc biệt: `Abcdef1 ` $\implies$ Bị từ chối (bảo vệ chống lại việc regex chấp nhận `\s` thay vì ký tự đặc biệt).

### 3.4 Bề mặt Biên Khớp Xác nhận Mật khẩu (UI): $C(p, c) \iff p = c$
Miền hai chuỗi bằng nhau được ký hiệu $p = c$; không coi tập chuỗi này là một siêu phẳng Euclid.
Trong không gian chuỗi, không có khoảng cách hình học dấu dương/âm, do đó phương pháp luận lấy mẫu dựa trên:
1. **Hai điểm trên biên (On points - Khớp hoàn toàn):**
   - Cặp 1: $(p, c) = (\text{Abcdef1!}, \text{Abcdef1!}) \implies$ Chấp nhận.
   - Cặp 2: $(p, c) = (\text{Zyxwvu2\&}, \text{Zyxwvu2\&}) \implies$ Chấp nhận.
2. **Ba nhiễu động cận biên ngoài (Off-surface perturbations) giữ nguyên $p = \text{Abcdef1!}$:**
   - **Nhiễu động thay thế 1 ký tự (Substitution):** $c = \text{Abcdef2!}$ (thay `1` bằng `2`) $\implies$ Bị từ chối.
   - **Nhiễu động xóa 1 ký tự (Deletion):** $c = \text{Abcdef1}$ (xóa `!`) $\implies$ Bị từ chối.
   - **Nhiễu động chèn 1 ký tự (Insertion):** $c = \text{Abcdef1!!}$ (thêm `!`) $\implies$ Bị từ chối.
3. **Hiện diện trường xác nhận:**
   - Trường xác nhận để trống ($c = ""$) hoặc trường bị thiếu trong DOM $\implies$ Vi phạm điều kiện giao diện.

### 3.5 Phân vùng Hình thức và Ràng buộc Mã OTP: $F(token)$ và $B(email, token)$
- **Phân vùng hình thức $F(token)$:**
  - Chiều dài 5 số: `12345` $\implies$ Từ chối.
  - Chiều dài 7 số: `1234567` $\implies$ Từ chối.
  - Chiều dài 6 ký tự nhưng có chữ cái: `12345x` $\implies$ Từ chối.
  - Chiều dài 6 số đúng hình thức nhưng không khớp mã được cấp: `234567` $\implies$ Từ chối.
- **Phân vùng ràng buộc sở hữu $B(email, token)$:**
  - Gửi mã của tài khoản A (`123456`) cho tài khoản B $\implies$ Từ chối; mật khẩu cả A và B không đổi.
  - Gửi mã của tài khoản B (`654321`) cho tài khoản A $\implies$ Từ chối; mật khẩu cả A và B không đổi.
- **Tương tác đa biến (Multi-rule interaction):**
  - Gửi token chéo email kèm mật khẩu thiếu ký tự đặc biệt $\implies$ Từ chối; kiểm tra hệ thống từ chối an toàn khi gặp đồng thời nhiều lỗi.

#### 2.3. Xây dựng test case và deduplicate

Chọn FR03-F, giữ các rule khác hợp lệ khi cô lập; gán source ID và obligation trước khi gộp. Chỉ merge khi cùng tầng, trạng thái, fixture, steps và assertions. Ví dụ DT-LEN-02 và DT-SPECIAL-03 đều là reset A bằng Abcdef1!, tương ứng TC003; không chạy/đếm hai lần. 41 source ID DT → 40 canonical DT (24 API +16 WEB), giữ tất cả alias. 25 nhóm nghĩa vụ có mapping; 23 nhóm có verdict lịch sử, 2 nhóm confirmation bị chặn qua 5 case. Không coi 23/25 nhóm là exhaustive coverage.

#### 2.4. Test report Domain Testing 

##### FR03-TC-001 — API — POST /api/forgot-password với email A (đã đăng kí)

Tầng: API; Rule: R01, R02, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-001</code> |
| **Title** | API — POST /api/forgot-password với email A |
| **Preconditions** | Tài khoản fr03-a@example.com tồn tại, mật khẩu hiện tại OldPass1!|
| **Inputs** | { "email": "fr03-a@example.com" } gửi tới POST /api/forgot-password |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email của tài khoản A.<br>2. Ghi nhận response code và body.<br>3. Kiểm tra mã OTP trả về và truy vấn CSDL để xác minh token được gán cho tài khoản A.<br>4. Xác minh mật khẩu của tài khoản A không bị thay đổi. |
| **Expected Result** | - HTTP Status: 200 OK.<br>- Body chứa `resetToken` là chuỗi gồm đúng 6 chữ số (`^[0-9]{6}$`).<br>- CSDL lưu `reset_token` khớp với mã trả về; mật khẩu của tài khoản A vẫn là `OldPass1!`.|
| **Actual Result** | HTTP 200; response=<code>{"message": "Mã đặt lại mật khẩu đã được tạo", "resetToken": "7257"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code>
| **Status** | **Failed** |

##### FR03-TC-002 — API — POST /api/forgot-password với email C (chưa đăng kí)

Tầng: API; Rule: R01, R0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-002</code> |
| **Title** | API — POST /api/forgot-password với email C |
| **Preconditions** | Email fr03-missing@example.com không tồn tại trong hệ thống|
| **Inputs** | <code>{"email": "fr03-missing@example.com"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email không tồn tại.<br>2. Ghi nhận response code và body.<br>3. Truy vấn CSDL xác minh không có bản ghi nào bị thay đổi. |
| **Expected Result** | - Hệ thống từ chối yêu cầu (mã lỗi HTTP 4xx, không sinh mã OTP hợp lệ).<br>- Không có bất kỳ thay đổi nào trong bảng `users`. |
| **Actual Result** | HTTP 404; response=<code>{"error": "User not found"}|
| **Status** | **Passed** |

##### FR03-TC-003 — API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1!

Tầng: API; Rule: R05, R06, R07, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-003</code> |
| **Title** | API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | {"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"} |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu danh định 8 ký tự Abcdef1!<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1!, chỉ password A đổi, password B giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: "OldPass1!" → "Abcdef1!"|
| **Status**| **Passed**; [evidence FR03-TC-003](fr03/evidence/api/observations.json) |

##### FR03-TC-004 — API — POST /api/reset-password với mật khẩu độ dài 7

Tầng: API; Rule: R06, R09;

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-004</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 7 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 7 ký tự.<br>2. Kiểm tra mã phản hồi HTTP và dữ liệu bảng `users` trong CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên OldPass1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!"</code>|
|**Status**| **Failed**; [evidence FR03-TC-004](fr03/evidence/api/observations.json) |

##### FR03-TC-005 — API — POST /api/reset-password với mật khẩu độ dài 9

Tầng: API; Rule: R06, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-005</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 9 Abcdefg1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 9 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdefg1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefg1!"</code>|
|**Status**| **Passed**; [evidence FR03-TC-005](fr03/evidence/api/observations.json) |

##### FR03-TC-006 — API — POST /api/reset-password với mật khẩu đối chứng trong miền độ dài 10

Tầng: API; Rule: R06, R09;

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-006</code> |
| **Title** | API — POST /api/reset-password với mật khẩu đối chứng trong miền độ dài 10 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 10 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdefgh1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau:  <code>"OldPass1!"</code> → <code>"Abcdefgh1!"</code>|
|**Status**| **Passed**; [evidence FR03-TC-006](fr03/evidence/api/observations.json) |

##### FR03-TC-010 — API — POST /api/reset-password với mật khẩu thiếu chữ hoa

Tầng: API; Rule: R07, R09; Source IDs: FR03-DT-CLASS-01, FR03-BVA-UPPER-01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-010</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ hoa |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!"}</code> |
| **Test Steps** |  1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ hoa.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abcdef1!"</code> |
|**Status**| **Failed**; [evidence FR03-TC-010](fr03/evidence/api/observations.json) |

##### FR03-TC-012 — API — POST /api/reset-password với mật khẩu thiếu chữ thường

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-012</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ thường ABCDEF1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ thường.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"ABCDEF1!"</code>;|
|**Status**| **Failed**; [evidence FR03-TC-012](fr03/evidence/api/observations.json) |

##### FR03-TC-015 — API — POST /api/reset-password với mật khẩu thiếu chữ số

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-015</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ số Abcdefg! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ số.<br>2. Kiểm tra response và CSDL.|
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdefg!"</code> |
|**Status**| **Failed**; [evidence FR03-TC-015](fr03/evidence/api/observations.json) |

##### FR03-TC-017 — API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-017</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** |1. Gửi request POST `/api/reset-password` với mật khẩu thiếu ký tự đặc biệt.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdef12"</code>|
|**Status** | **Failed**; [evidence FR03-TC-017](fr03/evidence/api/observations.json) |

##### FR03-TC-019 — API — POST /api/reset-password với ký tự đặc biệt @

Tầng: API; Rule: R07, R09; Source IDs: FR03-DT-SPECIAL-01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-019</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt @ |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1@"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `@`.<br>2. Kiểm tra response và CSDL.  |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1@ |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1@"</code>|
|**Status** | **Passed**; [evidence FR03-TC-019](fr03/evidence/api/observations.json) |

##### FR03-TC-020 — API — POST /api/reset-password với ký tự đặc biệt $

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-020</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt $ |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1$"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `$`.<br>2. Kiểm tra response và CSDL.  |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1$ |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1$"</code>|
|**Status**| **Passed**; [evidence FR03-TC-020](fr03/evidence/api/observations.json) |

##### FR03-TC-021 — API — POST /api/reset-password với ký tự đặc biệt %

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-021</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt % |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1%"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `%`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1% |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1%"</code>|
|**Status**| **Passed**; [evidence FR03-TC-021](fr03/evidence/api/observations.json) |

##### FR03-TC-022 — API — POST /api/reset-password với ký tự đặc biệt *

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-022</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt * |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1*"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `*`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1* |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1*"</code>|
|**Status**| **Passed**; [evidence FR03-TC-022](fr03/evidence/api/observations.json) |

##### FR03-TC-023 — API — POST /api/reset-password với ký tự đặc biệt ?

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-023</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt ? |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1?"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `?`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1? |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1?"</code>|
|**Status**| **Passed**; [evidence FR03-TC-023](fr03/evidence/api/observations.json) |

##### FR03-TC-024 — API — POST /api/reset-password với ký tự đặc biệt &amp;

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-024</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt &amp;  |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** |  <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1&amp;"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `&`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1&amp; |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1&amp;"</code>|
|**Status**| **Passed**; [evidence FR03-TC-024](fr03/evidence/api/observations.json) |

##### FR03-TC-025 — API — POST /api/reset-password với ký tự khoảng trắng thay cho ký tự đặc biệt

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-025</code> |
| **Title** | API — POST /api/reset-password với ký tự khoảng trắng thay cho ký tự đặc biệt  |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1 "}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chỉ dùng khoảng trắng làm ký tự không phải chữ/số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdef1 "</code>|
|**Status**| **Failed**; [evidence FR03-TC-025](fr03/evidence/api/observations.json) |

##### FR03-TC-029 — API — POST /api/reset-password với OTP độ dài 5

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-029</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 5|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 5 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status** | **Passed**; [evidence FR03-TC-029](fr03/evidence/api/observations.json) |

##### FR03-TC-030 — API — POST /api/reset-password với OTP độ dài 7

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-030</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 7|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 7 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>;|
|**Status**| **Passed**; [evidence FR03-TC-030](fr03/evidence/api/observations.json) |

##### FR03-TC-032 — API — POST /api/reset-password với OTP chứa chữ 12345x

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-032</code> |
| **Title** | API — POST /api/reset-password với OTP chứa chữ 12345x |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "12345x", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP chứa chữ.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status**| **Passed**; [evidence FR03-TC-032](fr03/evidence/api/observations.json) |

##### FR03-TC-033 — API — POST /api/reset-password với OTP 6 số không thuộc quyền

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-033</code> |
| **Title** | API — POST /api/reset-password với OTP 6 số không thuộc quyền |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | {"email": "fr03-a@example.com", "resetToken": "234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP 6 số không thuộc quyền 234567<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status**| **Passed**; [evidence FR03-TC-033](fr03/evidence/api/observations.json) |

##### FR03-TC-034 — API — POST /api/reset-password cho email B nhưng dùng token của A

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-034</code> |
| **Title** | API — POST /api/reset-password cho email B nhưng dùng token của A |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** |  <code>{"email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho email B nhưng dùng token của A<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status** | **Passed**; [evidence FR03-TC-034](fr03/evidence/api/observations.json) |

##### FR03-TC-035 — API — POST /api/reset-password cho email A nhưng dùng token của B

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-035</code> |
| **Title** | API — POST /api/reset-password cho email A nhưng dùng token của B |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "654321", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho email A nhưng dùng token của B<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status** | **Passed**; [evidence FR03-TC-035](fr03/evidence/api/observations.json) |

##### FR03-TC-036 — API — POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt

Tầng: API; Rule: R05, R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-036</code> |
| **Title** | API — POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** | <code>{"email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối an toàn, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>|
|**Status**| **Passed**; [evidence FR03-TC-036](fr03/evidence/api/observations.json) |

##### FR03-TC-037 — WEB — Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP

Tầng: WEB; Rule: R02, R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-037</code> |
| **Title** | WEB — Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP demo |
| **Preconditions** | Tài khoản A tồn tại trong hệ thống |
| **Inputs** | <code>{"email": "fr03-a@example.com"}</code> |
| **Test Steps** | 1. Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP demo<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Giao diện hiển thị rõ chỉ báo Bước 1 / 2 sau đó Bước 2 / 2; thông báo OTP demo hiển thị đúng định dạng 6 chữ số |
| **Actual Result** | Giao diện thiếu chỉ báo bước (Step indicator 'Bước 1 / 2' hoặc 'Bước 2 / 2'); Mã OTP demo '6429' có độ dài 4, không đúng 6 chữ số theo R02<br>|
|**Status**| **Failed**; [evidence FR03-TC-037](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-037.png) |

##### FR03-TC-038 — WEB — Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1

Tầng: WEB; Rule: R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-038</code> |
| **Title** | WEB — Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1 |
| **Preconditions** | Đang ở trang /forgot-password |
| **Inputs** | - |
| **Test Steps** | 1. Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Trình duyệt điều hướng thành công về URL /login |
| **Actual Result** | Chuyển hướng về /login thành công.<br>Giới hạn: selector rộng có thể click link Đăng nhập trên nav; chưa xác nhận control riêng trong form.<br>|
|**Status**| **Passed**; [evidence FR03-TC-038](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-038.png) |

##### FR03-TC-039 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-039</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!"}</code>|
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận, submit thành công và điều hướng về /login |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>|
|**Status**| **Blocked**; [evidence FR03-TC-039](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-039.png) |

##### FR03-TC-040 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-040</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Zyxwvu2&amp;", "confirmPassword": "Zyxwvu2&amp;"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận, submit thành công |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>|
|**Status**| **Blocked**; [evidence FR03-TC-040](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-040.png) |

##### FR03-TC-041 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-041</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** |  <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef2!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị thông báo mật khẩu xác nhận không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>|
|**Status**| **Blocked**; [evidence FR03-TC-041](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-041.png) |

##### FR03-TC-042 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-042</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | \<code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị lỗi không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.|
|**Status**| **Blocked**; [evidence FR03-TC-042](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-042.png) |

##### FR03-TC-043 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-043</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị lỗi không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.|
|**Status**| **Blocked**; [evidence FR03-TC-043](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-043.png) |

##### FR03-TC-044 — WEB — Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-044</code> |
| **Title** | WEB — Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống |
| **Preconditions** | Tại Bước 2 giao diện ForgotPassword |
| **Inputs** | Kiểm sự hiện diện control xác nhận; không đồng nhất với một lần submit confirmation rỗng. |
| **Test Steps** | 1. Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Trường input xác nhận mật khẩu hiện diện trong DOM; không thể submit nếu để trống |
| **Actual Result** | Trường 'Xác nhận mật khẩu mới' hoàn toàn không tồn tại trong form Bước 2 (Chỉ có trường OTP và 1 trường mật khẩu)|
|**Status**| **Failed**; [evidence FR03-TC-044](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-044.png) |

##### FR03-TC-045 — WEB — Tại Bước 2, nhập mật khẩu có ký tự @, click Đặt lại

Tầng: WEB; Rule: R07; Source IDs: FR03-DT-WEB-SPECIAL-01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-045</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự @ Abcdef1@, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1@"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu có ký tự @ Abcdef1@, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1@' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**| **Failed**; [evidence FR03-TC-045](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-045.png) |

##### FR03-TC-046 — WEB — Tại Bước 2, nhập mật khẩu có ký tự $, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-046</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự $, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1$"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1$, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1$' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**|**Failed**; [evidence FR03-TC-046](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-046.png) |

##### FR03-TC-047 — WEB — Tại Bước 2, nhập mật khẩu có ký tự !, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-047</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự ! Abcdef1!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1!' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**| **Failed**; [evidence FR03-TC-047](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-047.png) |

##### FR03-TC-048 — WEB — Tại Bước 2, nhập mật khẩu có ký tự %, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-048</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự %, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1%"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1%, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1%' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**| **Failed**; [evidence FR03-TC-048](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-048.png) |

##### FR03-TC-049 — WEB — Tại Bước 2, nhập mật khẩu có ký tự *, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-049</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự * Abcdef1*, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1*"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1*, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1*' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**|**Failed**; [evidence FR03-TC-049](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-049.png) |

##### FR03-TC-050 — WEB — Tại Bước 2, nhập mật khẩu có ký tự ?, click Đặt lại

Tầng: WEB; Rule: R07; Source IDs: FR03-DT-SPECIAL-06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-050</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự ?, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1?"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1?, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1?' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**| **Failed**; [evidence FR03-TC-050](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-050.png) |

##### FR03-TC-051 — WEB — Tại Bước 2, nhập mật khẩu có ký tự &amp; click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-051</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự &amp; Abcdef1&amp;, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1&amp;"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu có ký tự &amp; Abcdef1&amp;, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1&amp;' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')|
|**Status**| **Failed**; [evidence FR03-TC-051](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-051.png) |

##### FR03-TC-052 — WEB — Tại Bước 2, nhập mật khẩu có khoảng trắng Abcdef1 , click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-052</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu chỉ có khoảng trắng Abcdef1 , click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"newPassword": "Abcdef1 "}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu chỉ có khoảng trắng Abcdef1 , click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị thông báo lỗi mật khẩu quá yếu |
| **Actual Result** | Mật khẩu chỉ có khoảng trắng 'Abcdef1 ' bị regex lỗi chấp nhận (Alert: 'Đổi mật khẩu thành công!'). Vi phạm R07|
|**Status**| **Failed**; [evidence FR03-TC-052](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-052.png) |

### 3. BVA

#### 3.1. Bước 1 — Chọn phương pháp và đại lượng có thứ tự

Chọn Standard BVA + Robustness theo slide, thích nghi cho miền một phía và singleton. Độ dài p/token và các phép chiếu số đếm ký tự dùng ASCII, h=1. Bốn số đếm cùng phụ thuộc p, không phải bốn input độc lập. Email membership/ownership/confirmation là Domain Testing, không BVA số học. Đầu ra OTP sinh mã phải đúng 6 chữ số, kiểm riêng với evidence TC001/TC037.

#### 3.2. Bước 2 — Xác định phân hoạch, LB/UB và nominal

LB là biên dưới hợp lệ; UB là biên trên hợp lệ; nominal là giá trị đối chứng hợp lệ. Password [0,7] invalid, [8,+∞) valid ⇒ LB=8, UB chưa nêu, nominal length10. OTP length <6/=6/>6 ⇒ LB=UB=nominal=6. Mỗi count có0 invalid,≥1 valid ⇒ LB=1, UB chưa biết, nominal 2.

#### 3.3. Bước 3 — Sinh điểm và loại giá trị không khả thi

| Đại lượng | Standard thích nghi | Robustness thêm | Giải thích |
|---|---|---|---|
| Password length | 8,9,10 | 7 | Không bịa UB;10 là nominal, không UB |
| OTP length | 6 | 5,7 | Singleton;5/7 là ngoài miền, không valid interior |
| Mỗi count | 1,2 | 0 | Nominal2 trùng LB+1; deduplicate |

Nhóm chính7 điểm +12 điểm phép chiếu =19 nghĩa vụ mỗi tầng; không áp 4n+1/6n+1 với n=6. Các family được kiểm riêng, giữ inputs khác hợp lệ: family length dùng nominal10; family OTP giữ password Abcdef1! cố định. Không tuyên bố một global OFAT product suite. Chưa chọn Worst-case hoặc Robust Worst-case.

#### 3.4. Bước 4 — Dựng fixture, đánh giá expected và masking

Length 7/8/9/10 lần lượt Abcde1!/Abcdef1!/Abcdefg1!/Abcdefgh1!: đủ bốn lớp ký tự; chỉ7 phải từ chối. Count 0/1/2 dùng fixture dài 8, các lớp khác hợp lệ, count 0 từ chối. Token12345/123456/1234567 với token lưu A=123456 ⇒ từ chối/chấp nhận/từ chối; các ca ngoài length cũng sai binding, không chứng minh validator hình thức độc lập. WEB thêm c=p và kiểm control tồn tại.

#### 3.5. Bước 5 — Deduplicate, liên kết technique và xác định trạng thái

Một payload API Abcdef1!/123456 đáp ứng length 8,OTP 6,upper 1,digit 1,special 1; gộp 19 điểm thành 15 case API, tương tự 15 WEB. Case API mới là alias phân tích của 15 case cũ; WEB không được gán lại evidence của đường dùng OTP phát sinh 4 số. **30 case đều Not Run đối với run thiết kế mới**;15 API có historicalReuse (10 Passed, 5 Failed), WEB không có. Không gọi tái sử dụng là lượt thực thi mới hoặc cộng vào287 case lịch sử.

#### 3.6. Test report BVA theo slide — 30 case thiết kế

##### FR03-CBVA-A01 — API — LEN-8, OTP-6, UPPER-1, DIGIT-1, SPEC-1

Tầng: API; Rule: R02, R05, R06, R07, R09; Nghĩa vụ: CBVA-LEN-8, CBVA-OTP-6, CBVA-UPPER-1, CBVA-DIGIT-1, CBVA-SPEC-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A01</code> |
| **Title** | API — LEN-8, OTP-6, UPPER-1, DIGIT-1, SPEC-1 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-003</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-003](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.119Z</code> |

##### FR03-CBVA-A02 — API — LEN-9

Tầng: API; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-9

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A02</code> |
| **Title** | API — LEN-9 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-005</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefg1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-005](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.128Z</code> |

##### FR03-CBVA-A03 — API — LEN-10

Tầng: API; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-10

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A03</code> |
| **Title** | API — LEN-10 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-006</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefgh1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-006](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.132Z</code> |

##### FR03-CBVA-A04 — API — LEN-7

Tầng: API; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A04</code> |
| **Title** | API — LEN-7 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-004</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-004](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.123Z</code> |

##### FR03-CBVA-A05 — API — OTP-5

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ: CBVA-OTP-5

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A05</code> |
| **Title** | API — OTP-5 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-029</code> (không phải run mới):<br>HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-029](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.199Z</code> |

##### FR03-CBVA-A06 — API — OTP-7

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ: CBVA-OTP-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A06</code> |
| **Title** | API — OTP-7 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-030</code> (không phải run mới):<br>HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-030](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.200Z</code> |

##### FR03-CBVA-A07 — API — UPPER-0

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-UPPER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A07</code> |
| **Title** | API — UPPER-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-010</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abcdef1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-010](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.151Z</code> |

##### FR03-CBVA-A08 — API — UPPER-2

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-UPPER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A08</code> |
| **Title** | API — UPPER-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-011</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"ABcdef1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-011](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.155Z</code> |

##### FR03-CBVA-A09 — API — LOWER-0

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A09</code> |
| **Title** | API — LOWER-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-012</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"ABCDEF1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-012](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.158Z</code> |

##### FR03-CBVA-A10 — API — LOWER-1

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A10</code> |
| **Title** | API — LOWER-1 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "aBCDEF1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-013</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"aBCDEF1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-013](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.162Z</code> |

##### FR03-CBVA-A11 — API — LOWER-2

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A11</code> |
| **Title** | API — LOWER-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abCDEF1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-014</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abCDEF1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-014](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.165Z</code> |

##### FR03-CBVA-A12 — API — DIGIT-0

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-DIGIT-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A12</code> |
| **Title** | API — DIGIT-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-015</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefg!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-015](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.167Z</code> |

##### FR03-CBVA-A13 — API — DIGIT-2

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-DIGIT-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A13</code> |
| **Title** | API — DIGIT-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde12!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-016</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde12!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-016](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.169Z</code> |

##### FR03-CBVA-A14 — API — SPEC-0

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-SPEC-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A14</code> |
| **Title** | API — SPEC-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-017</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef12"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-017](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.172Z</code> |

##### FR03-CBVA-A15 — API — SPEC-2

Tầng: API; Rule: R07, R09; Nghĩa vụ: CBVA-SPEC-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-A15</code> |
| **Title** | API — SPEC-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!&amp;"}</code> |
| **Test Steps** | 1. POST /api/reset-password với email, resetToken, newPassword.<br>2. Đọc response và snapshot password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Tham chiếu lịch sử khớp fixture <code>FR03-TC-018</code> (không phải run mới):<br>HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!&amp;"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-018](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.174Z</code> |

##### FR03-CBVA-W01 — WEB — LEN-8, OTP-6, UPPER-1, DIGIT-1, SPEC-1

Tầng: WEB; Rule: R02, R05, R06, R07, R09; Nghĩa vụ: CBVA-LEN-8, CBVA-OTP-6, CBVA-UPPER-1, CBVA-DIGIT-1, CBVA-SPEC-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W01</code> |
| **Title** | WEB — LEN-8, OTP-6, UPPER-1, DIGIT-1, SPEC-1 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W02 — WEB — LEN-9

Tầng: WEB; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-9

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W02</code> |
| **Title** | WEB — LEN-9 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!", "confirmPassword": "Abcdefg1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W03 — WEB — LEN-10

Tầng: WEB; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-10

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W03</code> |
| **Title** | WEB — LEN-10 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!", "confirmPassword": "Abcdefgh1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W04 — WEB — LEN-7

Tầng: WEB; Rule: R06, R09; Nghĩa vụ: CBVA-LEN-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W04</code> |
| **Title** | WEB — LEN-7 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!", "confirmPassword": "Abcde1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W05 — WEB — OTP-5

Tầng: WEB; Rule: R02, R05, R09; Nghĩa vụ: CBVA-OTP-5

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W05</code> |
| **Title** | WEB — OTP-5 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W06 — WEB — OTP-7

Tầng: WEB; Rule: R02, R05, R09; Nghĩa vụ: CBVA-OTP-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W06</code> |
| **Title** | WEB — OTP-7 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W07 — WEB — UPPER-0

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-UPPER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W07</code> |
| **Title** | WEB — UPPER-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!", "confirmPassword": "abcdef1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W08 — WEB — UPPER-2

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-UPPER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W08</code> |
| **Title** | WEB — UPPER-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABcdef1!", "confirmPassword": "ABcdef1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W09 — WEB — LOWER-0

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W09</code> |
| **Title** | WEB — LOWER-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!", "confirmPassword": "ABCDEF1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W10 — WEB — LOWER-1

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W10</code> |
| **Title** | WEB — LOWER-1 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "aBCDEF1!", "confirmPassword": "aBCDEF1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W11 — WEB — LOWER-2

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-LOWER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W11</code> |
| **Title** | WEB — LOWER-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abCDEF1!", "confirmPassword": "abCDEF1!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W12 — WEB — DIGIT-0

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-DIGIT-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W12</code> |
| **Title** | WEB — DIGIT-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!", "confirmPassword": "Abcdefg!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W13 — WEB — DIGIT-2

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-DIGIT-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W13</code> |
| **Title** | WEB — DIGIT-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde12!", "confirmPassword": "Abcde12!"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W14 — WEB — SPEC-0

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-SPEC-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W14</code> |
| **Title** | WEB — SPEC-0 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12", "confirmPassword": "Abcdef12"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

##### FR03-CBVA-W15 — WEB — SPEC-2

Tầng: WEB; Rule: R07, R09; Nghĩa vụ: CBVA-SPEC-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-CBVA-W15</code> |
| **Title** | WEB — SPEC-2 |
| **Preconditions** | Backend và SQLite cách ly; reset trước mỗi case; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL.<br>Form có control OTP, mật khẩu và xác nhận; nếu thiếu control khi thực thi, ghi Blocked với bằng chứng. |
| **Inputs** | JSON/giá trị UI: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!&amp;", "confirmPassword": "Abcde1!&amp;"}</code> |
| **Test Steps** | 1. Mở /forgot-password; nhập email A, chuyển thật sang bước 2.<br>2. Trong CSDL cách ly, đặt lại token A=123456; không sửa UI.<br>3. Kiểm tra control xác nhận; nếu thiếu, ghi lý do chặn khi thực thi.<br>4. Nhập fixture và xác nhận bằng newPassword; submit; ghi dialog/network và password A/B trước/sau. |
| **Expected Result** | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. |
| **Actual Result** | **Not Run — chưa có lượt thực thi theo thiết kế BVA mới.**<br>Actual Result: chưa quan sát; Evidence mới: None. Không gán Blocked từ tình trạng UI của lượt cũ. |

#### 3.7. Regression bổ sung từ BVA lịch sử — không cộng vào 19 nghĩa vụ theo slide

Các giá trị dưới đây nằm trong thiết kế ISTQB trước đó và vẫn có actual hữu ích. Giữ ID/evidence, không gọi chúng là nghĩa vụ Standard BVA hiện hành. Các case BVA cũ khác đã được bao phủ bởi bảng DT hoặc historicalReuse của case theo slide.

##### FR03-TC-007 — API — POST /api/reset-password với mật khẩu rỗng độ dài 0

Tầng: API; Rule: R06, R09; Source IDs: FR03-BVA-LEN-01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-007</code> |
| **Title** | API — POST /api/reset-password với mật khẩu rỗng độ dài 0 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": ""}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu rỗng độ dài 0<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>""</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-007](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.136Z</code> |

##### FR03-TC-008 — API — POST /api/reset-password với mật khẩu độ dài 1 A

Tầng: API; Rule: R06, R09; Source IDs: FR03-BVA-LEN-02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-008</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 1 A |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "A"}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu độ dài 1 A<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"A"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-008](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.140Z</code> |

##### FR03-TC-009 — API — POST /api/reset-password với mật khẩu độ dài 6 Abcd1!

Tầng: API; Rule: R06, R09; Source IDs: FR03-BVA-LEN-03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-009</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 6 Abcd1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcd1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu độ dài 6 Abcd1!<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcd1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Failed**; [evidence FR03-TC-009](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.144Z</code> |

##### FR03-TC-026 — API — POST /api/reset-password với OTP rỗng độ dài 0

Tầng: API; Rule: R02, R05, R09; Source IDs: FR03-BVA-OTP-01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-026</code> |
| **Title** | API — POST /api/reset-password với OTP rỗng độ dài 0 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP rỗng độ dài 0<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-026](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.194Z</code> |

##### FR03-TC-027 — API — POST /api/reset-password với OTP độ dài 1 1

Tầng: API; Rule: R02, R05, R09; Source IDs: FR03-BVA-OTP-02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-027</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 1 1 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "1", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 1 1<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-027](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.196Z</code> |

##### FR03-TC-028 — API — POST /api/reset-password với OTP độ dài 4 1234

Tầng: API; Rule: R02, R05, R09; Source IDs: FR03-BVA-OTP-03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-028</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 4 1234 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "1234", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 4 1234<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-028](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.197Z</code> |

##### FR03-TC-031 — API — POST /api/reset-password với OTP độ dài 8 12345678

Tầng: API; Rule: R02, R05, R09; Source IDs: FR03-BVA-OTP-07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-TC-031</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 8 12345678 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "12345678", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 8 12345678<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>**Passed**; [evidence FR03-TC-031](fr03/evidence/api/observations.json)<br>Timestamp gốc: <code>2026-10-12T05:16:06.202Z</code> |

---

<a id="fr05"></a>

## FR-05 — Danh sách và tìm kiếm sản phẩm — Mobile native iOS

### 1. Phân tích requirement

| Rule ID | Requirement và expected behavior |
|---|---|
| FR05-R01 | Home hiển thị toàn bộ catalog dạng grid, không mất sản phẩm khi cuộn |
| FR05-R02 | Mỗi card có ảnh không biến dạng tỷ lệ và mô tả ảnh | 
| FR05-R03 | Card hiển thị tên sản phẩm | 
| FR05-R04 | Giá có ₫ và phân cách nhóm hàng nghìn | 
| FR05-R05 | Search theo tên sản phẩm | 
| FR05-R06 | Từ khóa được hiển thị an toàn dưới dạng text, không render HTML |
| FR05-R07 | Có loading trong lúc đợi dữ liệu | 
| FR05-R08 | Search không có kết quả có thông báo empty state phù hợp | 
| FR05-R09 | Mỗi trang đúng một `<h1>`; hai câu trong README là cùng một nghĩa vụ |

### 2. Domain Testing

#### 2.1. Bước 1 — Xác định input và output

- **Input:** q là Unicode string, C là snapshot catalog, s là pending/success/error; device/network là precondition. M=|C|; S(q,C) là tập match theo oracle; n=|S| là output suy ra, không phải field user nhập. 
- **Output:** IDs/card signatures, tên/giá/ảnh, keyword literal, loading, empty state và accessibility native.

#### 2.2. Bước 2 — Xác định miền giá trị

Success có P_complete: IDs(UI)=S; P_empty: n=0; P_nonempty: n≥1. Pending phải có loading, chưa được coi là empty success. n∈N₀ và n≤M là constraint khả thi. Miền đúng gồm pending+loading, success-empty+empty state và success-nonempty+đúng matching cards; phần bù là thiếu/trùng/sai card hoặc thiếu trạng thái phù hợp.

| Partition/điểm | Tuple/input | Expected và giới hạn |
|---|---|---|
| No search / exact full name | Home / Alpha | Toàn catalog / ID101 |
| No match / description-only | ZZZ_NO_MATCH / DescriptionToken | Không match theo tên, có empty state |
| Unicode / sensitive transport | Cà phê / O'Brien / A&B / A+B / A#B | Đúng tên nguyên nghĩa; không mất/truncate ký tự |
| Safe text | <b>Alpha</b> | Keyword literal, không render markup |
| On empty | (M,n,s)=(12,0,success),(0,0,success) | Hai fixture empty khác nhau; không merge chỉ vì n=0 |
| Off nonempty / interior | (1,1,success),(2,2,success) | Đủ 1/2 card khác ID; n=-1 bất khả thi |
| Coupled n=M | (1,1),(2,2); (2,1),(3,1) đối chứng | Không seed n>M; nếu output có n>M thì là discrepancy |
| Policy unresolved | case/trim/dấu/wildcard/empty/substring | Ghi actual, không phán từ giả định tùy ý |

Ảnh kiểm bằng hình tròn/ô vuông trong ảnh square/wide/tall, không tự đặt ratio card; grouping giá không phải BVA validation giá. Phải cuộn và xét virtualization để kết luận listing completeness. Accessibility ALT/h1 không được suy từ screenshot. Error/race tách Supplementary.

#### 2.3. Bước 3 — Xây dựng test case và deduplicate

Lập q/catalog/network từng case; giữ thuộc tính khác nominal để biết rule nào sai. Source có 48 case; sau merge full-scenario còn 45 canonical: 33 native và 12 API hỗ trợ. Ba RESULT-ZERO/ONE/TWO của DT trùng BVA nên cùng canonical TC028/029/030 và giữ cả hai technique. Không merge API/native hoặc empty catalog với no-match trên catalog full. 35 canonical có DT, 3 có BVA, 10 Supplementary; tổng không bằng phép cộng nhãn vì ba case có cả DT+BVA.

#### 2.4. Test report Domain Testing — 35 case canonical

Bảng dọc dưới đây ghi từng case đầy đủ để tránh bảng bảy cột quá rộng. Source IDs trên mỗi bảng giữ mapping sau deduplicate. Actual Result luôn lấy nguồn observation được chọn, không từ trạng thái thiết kế.

##### FR05-TC-001 — NATIVE — LIST — Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng

Tầng: NATIVE; Rule: FR05-R01, FR05-R03; Source IDs: FR05-DT-001

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-001</code> |
| **Title** | NATIVE — LIST — Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng; layout là grid, không phải một cột danh sách.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112], "count": 12}</code> |
| **Actual Result** | Listing AX có12 tên; scroll AX container và coordinate sau Raise đều báo noWindowsAvailable. Chưa xác minh scroll completeness/native column policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED_GRID_AND_SCROLL<br>**Blocked**; [evidence FR05-TC-001](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/listing-ready.ax.txt) |

##### FR05-TC-002 — NATIVE — EXACT — Có đúng card Alpha ID101

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-002

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-002</code> |
| **Title** | NATIVE — EXACT — Có đúng card Alpha ID101 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Có đúng card Alpha ID101; không có sản phẩm không match.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | Search Alpha trả một card Alpha giá 999 ₫; Hiển thị 1 sản phẩm.<br>**Passed**; [evidence FR05-TC-002](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:55:41.358Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-002.ax.txt) |

##### FR05-TC-003 — NATIVE — NO-MATCH — Không có card

Tầng: NATIVE; Rule: FR05-R08; Source IDs: FR05-DT-003

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-003</code> |
| **Title** | NATIVE — NO-MATCH — Không có card |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Không có card; có thông báo empty state khi response thành công rỗng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | Response success rỗng, vùng kết quả trống hoàn toàn; không có thông báo empty state trong screenshot/AX.<br>**Failed**; [evidence FR05-TC-003](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:57:12.965Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-003.ax.txt) |

##### FR05-TC-004 — NATIVE — NAME-ONLY — Token chỉ trong description không làm sản phẩm match

Tầng: NATIVE; Rule: FR05-R05, FR05-R08; Source IDs: FR05-DT-004

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-004</code> |
| **Title** | NATIVE — NAME-ONLY — Token chỉ trong description không làm sản phẩm match |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "DescriptionToken", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'DescriptionToken' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Token chỉ trong description không làm sản phẩm match; native có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | DescriptionToken không trả card (name-only đúng), nhưng không có thông báo empty state.<br>**Failed**; [evidence FR05-TC-004](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:57:40.328Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-004.ax.txt) |

##### FR05-TC-005 — NATIVE — UNICODE — Full-name search 'Cà phê' trả đúng sản phẩm ID104

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-005

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-005</code> |
| **Title** | NATIVE — UNICODE — Full-name search 'Cà phê' trả đúng sản phẩm ID104 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Cà phê", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Cà phê' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'Cà phê' trả đúng sản phẩm ID104; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [104], "count": 1}</code> |
| **Actual Result** | Cà phê nguyên dấu trả một card Cà phê giá 999.999 ₫, không có tên sản phẩm khác trong AX.<br>**Passed**; [evidence FR05-TC-005](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:58:13.007Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-005.ax.txt) |

##### FR05-TC-006 — NATIVE — QUOTE — Full-name search "O'Brien" trả đúng sản phẩm ID105

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-006

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-006</code> |
| **Title** | NATIVE — QUOTE — Full-name search "O'Brien" trả đúng sản phẩm ID105 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "O'Brien", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác "O'Brien" vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search "O'Brien" trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [105], "count": 1}</code> |
| **Actual Result** | App hiển thị nguyên chuỗi &lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near "Brien": syntax error&lt;/p&gt; thay vì card O'Brien.<br>**Failed**; [evidence FR05-TC-006](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:58:26.640Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-006.ax.txt) |

##### FR05-TC-007 — NATIVE — AMP — Full-name search 'A&amp;B' trả đúng sản phẩm ID106

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-007

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-007</code> |
| **Title** | NATIVE — AMP — Full-name search 'A&amp;B' trả đúng sản phẩm ID106 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A&amp;B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A&amp;B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A&amp;B' trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [106], "count": 1}</code> |
| **Actual Result** | Keyword A&amp;B nhưng có Alpha/Beta/A+B/A#B và tên khác; không chỉ A&amp;B. API encode đúng case040 đã pass.<br>**Failed**; [evidence FR05-TC-007](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:58:45.679Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-007.ax.txt) |

##### FR05-TC-008 — NATIVE — PLUS — Full-name search 'A+B' trả đúng sản phẩm ID107

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-008

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-008</code> |
| **Title** | NATIVE — PLUS — Full-name search 'A+B' trả đúng sản phẩm ID107 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A+B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A+B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A+B' trả đúng sản phẩm ID107; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [107], "count": 1}</code> |
| **Actual Result** | Search A+B hiển thị keyword nguyên dạng nhưng không có card A+B; API encoded case041 trả đúng ID107.<br>**Failed**; [evidence FR05-TC-008](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:58:58.747Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-008.ax.txt) |

##### FR05-TC-009 — NATIVE — HASH — Full-name search 'A#B' trả đúng sản phẩm ID108

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-009

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-009</code> |
| **Title** | NATIVE — HASH — Full-name search 'A#B' trả đúng sản phẩm ID108 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A#B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A#B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A#B' trả đúng sản phẩm ID108; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [108], "count": 1}</code> |
| **Actual Result** | Search A#B trả nhiều tên match A thay vì chỉ A#B; API encoded case042 trả đúng ID108.<br>**Failed**; [evidence FR05-TC-009](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T03:59:15.288Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-009.ax.txt) |

##### FR05-TC-010 — NATIVE — SAFE — Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML

Tầng: NATIVE; Rule: FR05-R06; Source IDs: FR05-DT-010

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-010</code> |
| **Title** | NATIVE — SAFE — Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "&lt;b&gt;Alpha&lt;/b&gt;", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '&lt;b&gt;Alpha&lt;/b&gt;' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML; không đánh giá wildcard/matching trong case này.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Nhãn kết quả hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;; screenshot còn cả dấu &lt;b&gt;, không render bold/HTML.<br>**Passed**; [evidence FR05-TC-010](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T04:00:06.569Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-010.ax.txt) |

##### FR05-TC-011 — NATIVE — MONEY — Giá 999/1000/1001/999999/1000000/1000001 đều có ₫

Tầng: NATIVE; Rule: FR05-R04; Source IDs: FR05-DT-011

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-011</code> |
| **Title** | NATIVE — MONEY — Giá 999/1000/1001/999999/1000000/1000001 đều có ₫ |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Giá 999/1000/1001/999999/1000000/1000001 đều có ₫; các giá ≥1000 có nhóm hàng nghìn đúng, dấu nhóm theo locale.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Native AX của full catalog hiển thị 999 ₫, 1.000 ₫, 1.001 ₫, 999.999 ₫, 1.000.000 ₫ và 1.000.001 ₫ đúng nhóm nghìn.<br>**Passed**; [evidence FR05-TC-011](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:21:31.696Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-011.ax.txt) |

##### FR05-TC-012 — NATIVE — RATIO — Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2

Tầng: NATIVE; Rule: FR05-R02; Source IDs: FR05-DT-012

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-012</code> |
| **Title** | NATIVE — RATIO — Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=images theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>images</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot images; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.<br>4. Cuộn từng card Square/Wide/Tall và chụp ảnh cùng asset dimensions. |
| **Expected Result** | Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Snapshot images có Square/Wide/Tall. Screenshot Square từ PNG120×120 có hình tròn nhưng native kéo thành ellipse ngang. Wide thấy một phần; Tall chưa kiểm hình do scroll tool bị chặn. Một ảnh đã vi phạm đủ để case Failed.<br>**Failed**; [evidence FR05-TC-012](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:29:37.347Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-012.ax.txt) |

##### FR05-TC-013 — NATIVE — ALT — Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled.

Tầng: NATIVE; Rule: FR05-R02; Source IDs: FR05-DT-013

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-013</code> |
| **Title** | NATIVE — ALT — Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Thu accessibility hierarchy hoặc đọc bằng VoiceOver; screenshot đơn lẻ không chứng minh alt. |
| **Expected Result** | Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Search Alpha thực trên native; exported AX có tên/giá nhưng không có image semantics đủ để chứng minh alt. Không có VoiceOver evidence.<br>Giới hạn/lý do: EVIDENCE_CAPABILITY<br>**Blocked**; [evidence FR05-TC-013](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/FR05-TC-013.ax.txt) |

##### FR05-TC-014 — NATIVE — LONG-NAME — Có tên sản phẩm hiển thị trên card

Tầng: NATIVE; Rule: FR05-R03; Source IDs: FR05-DT-014

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-014</code> |
| **Title** | NATIVE — LONG-NAME — Có tên sản phẩm hiển thị trên card |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Có tên sản phẩm hiển thị trên card; không áp chính sách wrap/full text chưa được quy định.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [112], "count": 1}</code> |
| **Actual Result** | Card có tên Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile và giá 1.000.001 ₫ trong native AX; không áp quy định wrap chưa có nguồn.<br>**Passed**; [evidence FR05-TC-014](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:23:09.698Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-014.ax.txt) |

##### FR05-TC-015 — NATIVE — LOAD-INITIAL — Trong thời gian initial request còn pending có loading rõ

Tầng: NATIVE; Rule: FR05-R07; Source IDs: FR05-DT-015

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-015</code> |
| **Title** | NATIVE — LOAD-INITIAL — Trong thời gian initial request còn pending có loading rõ |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.<br>4. Proxy giữ initial response; chụp pending; release rồi chụp success. |
| **Expected Result** | Trong thời gian initial request còn pending có loading rõ; sau success có danh sách.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Initial reload có Đang tải... khi proxy giữ response 30 giây; sau response có 12 sản phẩm và loading biến mất.<br>**Passed**; [evidence FR05-TC-015](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:21:31.705Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-015-pending-v2.png) |

##### FR05-TC-016 — NATIVE — LOAD-SEARCH — Trong search pending có loading

Tầng: NATIVE; Rule: FR05-R07; Source IDs: FR05-DT-016

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-016</code> |
| **Title** | NATIVE — LOAD-SEARCH — Trong search pending có loading |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy giữ search response; chụp pending; release rồi chụp success. |
| **Expected Result** | Trong search pending có loading; sau success có đúng Alpha.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | Search Alpha có Đang tải... trong pending; sau delay có đúng một Alpha và loading biến mất.<br>**Passed**; [evidence FR05-TC-016](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:25:17.827Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-016-pending.ax.txt) |

##### FR05-TC-017 — NATIVE — LOAD-EMPTY — Pending có loading

Tầng: NATIVE; Rule: FR05-R07, FR05-R08; Source IDs: FR05-DT-017

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-017</code> |
| **Title** | NATIVE — LOAD-EMPTY — Pending có loading |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Giữ response; chụp pending; release response rỗng rồi chụp. |
| **Expected Result** | Pending có loading; sau success rỗng loading kết thúc và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | Pending có Đang tải...; sau response [] loading biến mất nhưng vẫn chỉ vùng trống, không có empty state.<br>**Failed**; [evidence FR05-TC-017](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:26:04.946Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-017-pending.ax.txt) |

##### FR05-TC-028 — NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state.

Tầng: NATIVE; Rule: FR05-R08; Source IDs: FR05-BVA-001, FR05-DT-028

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-028</code> |
| **Title** | NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot empty; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Search Alpha trên catalog rỗng: không có card và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state.<br>**Failed**; [evidence FR05-TC-028](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:30:05.768Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-028.ax.txt) |

##### FR05-TC-029 — NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05; Source IDs: FR05-BVA-002, FR05-DT-029

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-029</code> |
| **Title** | NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot one; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Một card Alpha giá 1000₫, không thiếu/trùng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one.<br>**Passed**; [evidence FR05-TC-029](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:31:27.652Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-029.ax.txt) |

##### FR05-TC-030 — NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05; Source IDs: FR05-BVA-003, FR05-DT-030

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-030</code> |
| **Title** | NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot two; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature.<br>**Passed**; [evidence FR05-TC-030](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:32:52.386Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-030.ax.txt) |

##### FR05-TC-031 — NATIVE — COUPLED-M2 — M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả.

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-031

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-031</code> |
| **Title** | NATIVE — COUPLED-M2 — M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=mixed theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>mixed</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot mixed; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | Snapshot mixed có Alpha/Beta nhưng query Alpha chỉ hiển thị Alpha giá 1.000 ₫; count1.<br>**Passed**; [evidence FR05-TC-031](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:33:39.288Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-031.ax.txt) |

##### FR05-TC-032 — NATIVE — COUPLED-M3 — M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả.

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-DT-032

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-032</code> |
| **Title** | NATIVE — COUPLED-M3 — M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=three theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>three</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot three; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | Snapshot three có Alpha/Beta/Gamma, query Alpha vẫn chỉ có Alpha giá 1.000 ₫ và count1; đối chiếu reset/request trong log.<br>**Passed**; [evidence FR05-TC-032](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:34:07.518Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-032.ax.txt) |

##### FR05-TC-033 — NATIVE — EMPTY-RECOVERY — Search vô nghiệm có empty state

Tầng: NATIVE; Rule: FR05-R05, FR05-R08; Source IDs: FR05-DT-033

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-033</code> |
| **Title** | NATIVE — EMPTY-RECOVERY — Search vô nghiệm có empty state |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Sau lần search đầu, thay q thành Alpha và bấm Tìm; đối chiếu ID101. |
| **Expected Result** | Search vô nghiệm có empty state; sau đó search Alpha có đúng Alpha, không lưu kết quả cũ.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Search vô nghiệm có 0 card nhưng thiếu empty state; sau đó search Alpha phục hồi đúng một Alpha giá 999 ₫.<br>**Failed**; [evidence FR05-TC-033](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:35:10.853Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-033-empty.ax.txt) |

##### FR05-TC-034 — API — LIST — HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-034

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-034</code> |
| **Title** | API — LIST — HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products không có search.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112], "count": 12}</code> |
| **Actual Result** | HTTP 200; body có 12 phần tử; IDs=<code>[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]</code><br>**Passed**; [evidence FR05-TC-034](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-034.json) |

##### FR05-TC-035 — API — EXACT — HTTP 200, JSON array, exact ID set [101].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-035

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-035</code> |
| **Title** | API — EXACT — HTTP 200, JSON array, exact ID set [101]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [101].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[101]</code><br>**Passed**; [evidence FR05-TC-035](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-035.json) |

##### FR05-TC-036 — API — NO-MATCH — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-036

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-036</code> |
| **Title** | API — NO-MATCH — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'ZZZ_NO_MATCH'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>**Passed**; [evidence FR05-TC-036](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-036.json) |

##### FR05-TC-037 — API — NAME-ONLY — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-037

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-037</code> |
| **Title** | API — NAME-ONLY — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "DescriptionToken", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'DescriptionToken'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>**Passed**; [evidence FR05-TC-037](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-037.json) |

##### FR05-TC-038 — API — UNICODE — HTTP 200, JSON array, exact ID set [104].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-038

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-038</code> |
| **Title** | API — UNICODE — HTTP 200, JSON array, exact ID set [104]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Cà phê", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Cà phê'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [104].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [104], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[104]</code><br>**Passed**; [evidence FR05-TC-038](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-038.json) |

##### FR05-TC-039 — API — QUOTE — HTTP 200, JSON array, exact ID set [105].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-039

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-039</code> |
| **Title** | API — QUOTE — HTTP 200, JSON array, exact ID set [105]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "O'Brien", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ "O'Brien".<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [105].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [105], "count": 1}</code> |
| **Actual Result** | HTTP 500; HTTP 500; body=&lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near "Brien": syntax error&lt;/p&gt;<br>**Failed**; [evidence FR05-TC-039](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-039.json) |

##### FR05-TC-040 — API — AMP — HTTP 200, JSON array, exact ID set [106].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-040

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-040</code> |
| **Title** | API — AMP — HTTP 200, JSON array, exact ID set [106]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A&amp;B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A&amp;B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [106].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [106], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[106]</code><br>**Passed**; [evidence FR05-TC-040](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-040.json) |

##### FR05-TC-041 — API — PLUS — HTTP 200, JSON array, exact ID set [107].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-041

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-041</code> |
| **Title** | API — PLUS — HTTP 200, JSON array, exact ID set [107]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A+B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A+B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [107].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [107], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[107]</code><br>**Passed**; [evidence FR05-TC-041](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-041.json) |

##### FR05-TC-042 — API — HASH — HTTP 200, JSON array, exact ID set [108].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-042

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-042</code> |
| **Title** | API — HASH — HTTP 200, JSON array, exact ID set [108]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A#B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A#B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [108].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [108], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[108]</code><br>**Passed**; [evidence FR05-TC-042](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-042.json) |

##### FR05-TC-043 — API — COUNT-EMPTY — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-043

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-043</code> |
| **Title** | API — COUNT-EMPTY — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot empty trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>**Passed**; [evidence FR05-TC-043](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-043.json) |

##### FR05-TC-044 — API — COUNT-ONE — HTTP 200, JSON array, exact ID set [201].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-044

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-044</code> |
| **Title** | API — COUNT-ONE — HTTP 200, JSON array, exact ID set [201]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot one trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [201].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[201]</code><br>**Passed**; [evidence FR05-TC-044](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-044.json) |

##### FR05-TC-045 — API — COUNT-TWO — HTTP 200, JSON array, exact ID set [201, 202].

Tầng: API; Rule: FR05-R05; Source IDs: FR05-DT-045

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-045</code> |
| **Title** | API — COUNT-TWO — HTTP 200, JSON array, exact ID set [201, 202]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot two trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [201, 202].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | HTTP 200; body có 2 phần tử; IDs=<code>[201, 202]</code><br>**Passed**; [evidence FR05-TC-045](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-045.json) |

#### 2.5. Các probe Supplementary đi kèm — 10 case, không cộng coverage DT/BVA

Các case này giữ nhãn gốc Supplementary; có thể có oracle derived hoặc unresolved. Blocked do thiếu oracle vẫn có actual observation, không mặc định là chưa thao tác.

##### FR05-TC-018 — NATIVE — ERROR — Network error được phân biệt với search không có kết quả

Tầng: NATIVE; Rule: FR05-R07; Source IDs: FR05-SUP-018

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-018</code> |
| **Title** | NATIVE — ERROR — Network error được phân biệt với search không có kết quả |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy chủ động ngắt request trong fixture copy; khôi phục network sau case. |
| **Expected Result** | Network error được phân biệt với search không có kết quả; không còn loading vô hạn.<br>Assertions nguồn: <code>{"oracleKind": "derived"}</code> |
| **Actual Result** | Khi proxy đóng socket, native hiển thị Network request failed; không hiển thị như search empty và không còn loading.<br>**Passed**; [evidence FR05-TC-018](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:26:57.255Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-018.ax.txt) |

##### FR05-TC-019 — NATIVE — RACE — Search Alpha rồi Beta

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-019

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-019</code> |
| **Title** | NATIVE — RACE — Search Alpha rồi Beta |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy hold Alpha, gửi Beta, release Beta rồi Alpha; lưu thứ tự request/response. |
| **Expected Result** | Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta.<br>Assertions nguồn: <code>{"oracleKind": "derived"}</code> |
| **Actual Result** | Beta trả trước và từng hiển thị Beta; sau khi Alpha cũ trả về, ô/nhãn vẫn Beta nhưng card đổi thành Alpha giá 999 ₫. Đây là derived latest-query-wins oracle.<br>**Failed**; [evidence FR05-TC-019](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:28:13.798Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt) |

##### FR05-TC-020 — NATIVE — H1 — Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict

Tầng: NATIVE; Rule: FR05-R09; Source IDs: FR05-SUP-020

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-020</code> |
| **Title** | NATIVE — H1 — Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict; vẫn ghi native heading probe.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native listing AX có Danh sách sản phẩm; thiếu mapping exactly-one HTML h1 sang native heading. Không lấy text node làm bằng chứng h1.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-020](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/listing-ready.ax.txt) |

##### FR05-TC-021 — NATIVE — TRIM — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-021

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-021</code> |
| **Title** | NATIVE — TRIM — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": " Alpha ", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác ' Alpha ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy trim chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập ' Alpha ', bấm Tìm; request /api/products?search=%20Alpha%20; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-021](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/trim.ax.txt) |

##### FR05-TC-022 — NATIVE — WILDCARD — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-022

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-022</code> |
| **Title** | NATIVE — WILDCARD — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "%", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '%' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy literal wildcard chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '%', bấm Tìm; request /api/products?search=%25; HTTP200, response IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-022](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/percent-only.ax.txt) |

##### FR05-TC-023 — NATIVE — CASE — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-023

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-023</code> |
| **Title** | NATIVE — CASE — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ALPHA", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ALPHA' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy case sensitivity chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'ALPHA', bấm Tìm; request /api/products?search=ALPHA; HTTP200, response IDs=[101]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-023](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/case-upper.ax.txt) |

##### FR05-TC-024 — NATIVE — ACCENT — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-024

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-024</code> |
| **Title** | NATIVE — ACCENT — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Ca phe", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Ca phe' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy diacritic sensitivity chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'Ca phe', bấm Tìm; request /api/products?search=Ca%20phe; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-024](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/diacritics.ax.txt) |

##### FR05-TC-025 — NATIVE — EMPTY-QUERY — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-025

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-025</code> |
| **Title** | NATIVE — EMPTY-QUERY — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy empty vs omitted chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '', bấm Tìm; request /api/products?search=; HTTP200, response IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-025](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/empty-query.ax.txt) |

##### FR05-TC-026 — NATIVE — ONE-CHAR — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-026

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-026</code> |
| **Title** | NATIVE — ONE-CHAR — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy substring chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'A', bấm Tìm; request /api/products?search=A; HTTP200, response IDs=[101, 102, 103, 106, 107, 108, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-026](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/substring.ax.txt) |

##### FR05-TC-027 — NATIVE — SPACE — Ghi observation

Tầng: NATIVE; Rule: FR05-R05; Source IDs: FR05-SUP-027

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-027</code> |
| **Title** | NATIVE — SPACE — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "   ", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '   ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy whitespace chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '   ', bấm Tìm; request /api/products?search=%20%20%20; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>**Blocked**; [evidence FR05-TC-027](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/whitespace.ax.txt) |

### 3. BVA

#### 3.1. Bước 1 — Xác định đại lượng và nguồn phương pháp

BVA xét số kết quả n suy ra từ (q,C), không phải độ dài search input. Source lịch sử dùng ISTQB 3-value khi chưa có lecture: ở đây giữ rõ nhãn **BVA lịch sử**, không viết lại run thành Standard BVA. Theo slide, đây là kiểm chuyển behavior tại output count 0/nonzero; cùng bộ 0/1/2 hữu ích ở biên một phía với1 là phần tử nonempty đầu tiên,2 đối chứng. Không có cậnquery/pagination/timeout để tự sinh biên.

#### 3.2. Bước 2 — Lập universe và phân hoạch

n∈N₀, h=1; E0={0}: success-empty phải có thông báo; E1=[1,+∞): hiển thị đủ match. Count âm không thể là expected output hợp lệ; n≤M là điều kiện khả thi. Pending chưa biết finaln, không gán empty.

#### 3.3. Bước 3 — Dẫn xuất điểm lịch sử và đối chiếu slide

Endpoint0 có neighborhood khả thi{0,1}; endpoint1 có{0,1,2}; union={0,1,2}, ba nghĩa vụ, không phải năm. Trong cách nhìn Standard một phía của vùng nonempty,1 là LB,2 là lân cận/đối chứng,0 kiểm nhánh empty riêng. 0 là kết quả thành công hợp lệ của search, không phải lỗi validation hay negative invalid input. Không tạo n=-1, không dùng4n+1 hay worst-caseproduct cho count derived.

#### 3.4. Bước 4 — Chuyển điểm thành test data

Giữ q=Alpha và response success, chỉ thay catalog: empty→n=0; one→ID201, n=1; two→IDs201/202, n=2. Hai row cùng tên Alpha nhưng giá 1000/1001 và ID khác, không được gộp do trùng tên. Giá dùng nhận diện card, không tạo price boundary của FR15. Steps là reset snapshot → Home → nhậpAlpha → Tìm → đợi success → đối chiếu matching cards/empty state.

#### 3.5. Bước 5 — Deduplicate và coverage

Ba case trùng DT RESULT-ZERO/ONE/TWO về full scenario nên giữ canonical TC028/029/030 cùng hai nhãn, mỗi case chỉ chạy/đếm một lần. API count-support khác interface không thay native coverage. Ba nghĩa vụ result-count được quan sát; không suy ra toàn bộ search space hay policy đã pass. Run02 cumulative là kết quả đã chọn; nhiều lần thử không tăng uniquecount.

#### 3.6. Test report BVA — 3 case native chia sẻ với DT

##### FR05-TC-028 — NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state.

Tầng: NATIVE; Rule: FR05-R08; Source IDs: FR05-BVA-001, FR05-DT-028

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-028</code> |
| **Title** | NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot empty; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Search Alpha trên catalog rỗng: không có card và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state.<br>**Failed**; [evidence FR05-TC-028](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:30:05.768Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-028.ax.txt) |

##### FR05-TC-029 — NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05; Source IDs: FR05-BVA-002, FR05-DT-029

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-029</code> |
| **Title** | NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot one; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Một card Alpha giá 1000₫, không thiếu/trùng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one.<br>**Passed**; [evidence FR05-TC-029](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:31:27.652Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-029.ax.txt) |

##### FR05-TC-030 — NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05; Source IDs: FR05-BVA-003, FR05-DT-030

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-TC-030</code> |
| **Title** | NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot two; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature.<br>**Passed**; [evidence FR05-TC-030](fr05/evidence/fr05-run02/cumulative-observations.json)<br>Timestamp gốc: <code>2026-10-16T05:32:52.386Z</code><br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-030.ax.txt) |

---

<a id="fr07"></a>

## FR-07 — Giỏ hàng

### 1. Phân tích requirement

**FR07-F:** A có id=1, tên “Sản phẩm A”, price=100000₫; B id=2, tên “Sản phẩm B”, price=250000₫. Cart nominal gồm A q=2 và B q=1, tổng 450000₫. Mỗi case reset riêng; giữ React state trong chuỗi thao tác, không F5 giữa các bước. 

| Mã Rule | Phân loại | Nội dung quy tắc |
|---|---|---|
| **FR07-R01** | UI | Hiển thị danh sách sản phẩm dưới dạng bảng với 5 cột bắt buộc: **Sản phẩm**, **Đơn giá**, **Số lượng**, **Thành tiền**, **Thao tác**. | 
| **FR07-R02** | Business | Thêm cùng một sản phẩm (cùng Product ID) vào giỏ sẽ tăng số lượng tương ứng, không tạo dòng mới. |
| **FR07-R03** | UI / Control | Tại cột **Số lượng**, phải có các nút **+** và **-** để điều chỉnh số lượng sản phẩm. | 
| **FR07-R04** | UI / Dialog | Nút **Xóa sản phẩm** phải hiển thị dialog xác nhận trước khi thực hiện: bấm Cancel giữ nguyên giỏ hàng, bấm Confirm chỉ xóa đúng dòng được chọn. |
| **FR07-R05** | Navigation |  Có nút **Tiếp tục mua sắm** dẫn về trang chủ (`/`). | 
| **FR07-R06** | UI / Label | Nhãn hiển thị tổng tiền phải chính xác là **"Tổng cộng"** (không phải "Tổng tạm tính"). |
| **FR07-R07** | UI / State |  Khi giỏ hàng trống, phải hiển thị hình minh họa và thông báo rõ ràng. | 
| **FR07-R08** | Business | Suy diễn logic | Thành tiền từng dòng: $L = p \times q$. Tổng tiền thanh toán của giỏ hàng: $T = \sum (p_i \times q_i)$. | 
| **FR06-Q** | Dependency | Thao tác thêm vào giỏ từ chi tiết sản phẩm: ô nhập số lượng chỉ nhận số nguyên dương, tối thiểu là 1 ($d \in \mathbb{Z}^+, d \ge 1$). | 
| **API-AUTH** | Dependency | Mọi request tới API giỏ hàng (`GET /api/cart`, `POST /api/cart`) bắt buộc kèm header `Authorization: Bearer <token>`. | 


### 2. Domain Testing

#### 2.1. Bước 1 — Xác định input và output

- **Input:** 
  - $n \in \mathbb{N}_0$: Số dòng sản phẩm phân biệt có trong giỏ hàng ($n = 0$: giỏ trống; $n \ge 1$: giỏ có sản phẩm).
  - $q \in \mathbb{Z}$: Số lượng của một sản phẩm trong giỏ (lát cắt số nguyên, độ phân giải 1 đơn vị).
  - $d \in \mathbb{Z}$: Số lượng gửi vào trong thao tác thêm sản phẩm ($d \ge 1$ là hợp lệ theo FR06-Q).
  - $r \in \mathbb{N}_0$: Số lần thêm thành công cùng Product ID trước thao tác hiện tại ($r = 0$: chưa có trong giỏ, $r \ge 1$: đã có trong giỏ).
  - $id \in \{A, B\}$: Định danh sản phẩm (biến phân loại categorical).
  - $action \in \{\text{add}, \text{plus}, \text{minus}, \text{delete}, \text{cancel}, \text{confirm}, \text{continue}\}$: Hành động của người dùng trên giao diện.
- **Output:** số dòng/quantity, tổng tiền, control/dialog, empty state và URL.

#### 2.2. Bước 2 — Xác định miền giá trị
1. **Số lượng thêm mới (Add Quantity Validity):**
   $$\text{ValidAddQuantity}(d) \iff (d \in \mathbb{Z} \land d \ge 1)$$
   - *Miền hợp lệ:* Các số nguyên dương $d \in \{1, 2, 3, \dots\}$.
   - *Miền phần bù không hợp lệ:*
     - Lát cắt số nguyên không dương: $d \in \mathbb{Z} \land d \le 0$ ($d = 0, -1, -2, \dots$).
     - Lát cắt số thực không nguyên: $d \in \mathbb{R} \setminus \mathbb{Z}$ (ví dụ $1.5, 2.7$).
     - Lát cắt sai kiểu dữ liệu / chuỗi rỗng: $d = \text{""}, \text{NaN}, \text{"abc"}$.

2. **Số lượng dòng giỏ hàng:**
   - Trạng thái giỏ trống:
     $$\text{Empty}(n) \iff (n = 0) \quad \text{với } n \in \mathbb{N}_0$$
   - Trạng thái giỏ có hàng:
     $$\text{Nonempty}(n) \iff (n \ge 1) \quad \text{với } n \in \mathbb{N}_0$$
   - *Ràng buộc khả thi:* Số dòng $n < 0$ là bất khả thi trong không gian trạng thái thực tế của hệ thống.

3. **Sự tồn tại của sản phẩm trong giỏ:**
   $$\text{Member}(id, C) \iff \exists \text{ item} \in C : \text{item.id} = id$$
   - $\text{Member}(id, C) = \text{True}$: Sản phẩm đã tồn tại trong giỏ (kích hoạt quy tắc tăng số lượng R02).
   - $\text{Member}(id, C) = \text{False}$: Sản phẩm chưa có trong giỏ (kích hoạt quy tắc tạo dòng mới).

4. **Hậu điều kiện gộp dòng:**
   $$\text{MergePost}(q, d, q') \iff (q' = q + d) \land (\text{rows}(id) = 1)$$
   - Mặt phẳng đẳng thức: $q' - q - d = 0$.
   - Số dòng của sản phẩm đó trong giỏ phải duy nhất bằng 1.

5. **Hậu điều kiện tính tiền:**
   $$\text{Line}(L, p, q) \iff L = p \times q$$
   $$\text{Total}(T, C) \iff T = \sum_{i=1}^n (p_i \times q_i)$$

6. **Hậu điều kiện xóa sản phẩm:**
   $$\text{DeletePost}(action, C, C', target) \iff \begin{cases} (\text{target} \notin C' \land |C'| = |C| - 1) & \text{nếu } action = \text{Confirm} \\ (C' = C) & \text{nếu } action = \text{Cancel} \end{cases}$$

---

#### 2.3. Test report Domain Testing

##### FR07-TC-001 — WEB — Trạng thái Giỏ hàng Rỗng

Tầng: WEB; Rule: FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-001</code> |
| **Title** | WEB — Trạng thái Giỏ hàng Rỗng |
| **Preconditions** | Phiên duyệt mới, giỏ hàng React rỗng (n=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ rỗng."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở trang chủ /<br>2. Điều hướng tới trang giỏ hàng /cart<br>3. Quan sát nội dung trang |
| **Expected Result** | Hiển thị hình minh họa giỏ hàng trống và thông báo rõ ràng; không hiển thị bảng sản phẩm và tổng tiền. |
| **Actual Result** | Message: True, Illustration: False (Missing illustration!), No Table: True<br>|
|**Status**| **Failed**; [evidence FR07-TC-001](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png) |

##### FR07-TC-002 — WEB — Thêm 1 sản phẩm vào giỏ rỗng

Tầng: WEB; Rule: FR07-R01, FR07-R07, FR06-Q, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-002</code> |
| **Title** | WEB — Thêm 1 sản phẩm vào giỏ rỗng |
| **Preconditions** | Giỏ hàng ban đầu rỗng (n=0, r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1, "clicks": 1}</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Chuyển sang bảng giỏ hàng có 1 dòng A, số lượng 1, Thành tiền 100000₫, Tổng cộng 100000₫, không còn thông báo giỏ trống. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.<br>|
|**Status**| **Failed**; [evidence FR07-TC-002](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_detail_before_add.png) |

##### FR07-TC-003 — WEB — Thêm sản phẩm có số lượng bằng 0

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-003</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 0 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 0, "clicks": 1}</code>; d=0 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=0<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống từ chối/chặn thao tác thêm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '0' was not added; cart remains empty|
|**Status**| **Passed**; [evidence FR07-TC-003](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-003_detail_before_add.png) |

##### FR07-TC-004 — WEB — Thêm sản phẩm có số lượng bằng 2

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-004</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 2 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 2, "clicks": 1}</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=2<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.|
|**Status**| **Failed**; [evidence FR07-TC-004](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-004_detail_before_add.png) |

##### FR07-TC-005 — WEB — Thêm sản phẩm có số lượng bằng -1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-005</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng -1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": -1, "clicks": 1}</code>; d=-1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=-1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn/từ chối số lượng âm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '-1' was not added; cart remains empty<br>|
|**Status**| **Passed**; [evidence FR07-TC-005](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-005_detail_before_add.png) |

##### FR07-TC-006 — WEB — Thêm sản phẩm có số lượng bằng 3

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-006</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 3 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 3, "clicks": 1}</code>; d=3 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=3<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 3, Thành tiền 300000₫, Tổng cộng 300000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.|
|**Status**| **Failed**; [evidence FR07-TC-006](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-006_detail_before_add.png) |

##### FR07-TC-007 — WEB — Thêm sản phẩm có số lượng là số thực

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-007</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng là số thực |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1.5, "clicks": 1}</code>; d=1.5 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1.5<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống không chấp nhận số lượng không nguyên; giỏ hàng không thêm sản phẩm với số lượng lẻ. |
| **Actual Result** | Invalid quantity input '1.5' was not added; cart remains empty|
|**Status**| **Passed**; [evidence FR07-TC-007](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-007_detail_before_add.png) |

##### FR07-TC-008 — WEB — Thêm sản phẩm có số lượng là chuỗi

Tầng: WEB; Rule: FR06-Q; Source IDs: FR07-DT-QTY-007

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-008</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng là chuỗi |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": "", "clicks": 1}</code>; d là chuỗi rỗng &quot;&quot; |
| **Test Steps** | 1. Vào /product/1<br>2. Xóa ô số lượng thành chuỗi rỗng<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn thao tác hoặc báo lỗi; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '' was not added; cart remains empty|
|**Status**|**Passed**; [evidence FR07-TC-008](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-008_detail_before_add.png) |

##### FR07-TC-009 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-009</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server chỉ có đúng 1 dòng cho A, số lượng gộp thành 2. |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]|
|**Status**| **Failed**; [evidence FR07-TC-009](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-010 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-010</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=2. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 3}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server duy trì đúng 1 dòng cho A, số lượng gộp thành 5 (2 + 3). |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":2},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":3}]|
|**Status**| **Failed**; [evidence FR07-TC-010](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-013 — API — POST /api/cart cho A (id=1, q=1)

Tầng: API; Rule: FR07-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-013</code> |
| **Title** | API — POST /api/cart cho A (id=1, q=1) |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server ban đầu rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1), Sản phẩm B (id=2)."</code><br>Request thực tế lịch sử: <code>[{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}}, {"method": "POST", "path": "/api/cart", "body": {"id": 2, "name": "Sản phẩm B", "price": 250000, "quantity": 1}}]</code>; d=1 |
| **Test Steps** | 1. POST /api/cart cho A (id=1, q=1)<br>2. POST /api/cart cho B (id=2, q=1)<br>3. GET /api/cart |
| **Expected Result** | Giỏ hàng chứa đúng 2 phần tử với 2 ID khác biệt (1 và 2). |
| **Actual Result** | Cart contains 2 distinct items (IDs 1 and 2)|
|**Status**| **Passed**; [evidence FR07-TC-013](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-014 — WEB — Kiểm tra thêm cùng một sản phẩm vào giỏ có tạo dòng mới hay không

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-014</code> |
| **Title** | WEB — Kiểm tra thêm cùng một sản phẩm vào giỏ có tạo dòng mới hay không |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng tăng lên 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)|
|**Status**| **Failed**; [evidence FR07-TC-014](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png) |

##### FR07-TC-015 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-015</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=2. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=3 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=3 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng gộp thành 5, Thành tiền 500000₫, Tổng cộng 500000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)<br>**Failed**; [evidence FR07-TC-015](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-015_cart_state.png) |

##### FR07-TC-017 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08; Source IDs: FR07-DT-MERGE-WEB-003

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-017</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=3) và Sản phẩm B (q=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"A (100000₫), B (250000₫)."</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=2 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng giữ nguyên 2 dòng; dòng A có số lượng 5, Thành tiền 500000₫; dòng B giữ nguyên q=1, Thành tiền 250000₫; Tổng cộng 750000₫. |
| **Actual Result** | Failed merge: Cart created 3 rows instead of 2 row(s) (R02 violation)<br>**Failed**; [evidence FR07-TC-017](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-017_cart_state.png) |

##### FR07-TC-018 — WEB — Số lượng hàng của 2 sản phẩm khác nhau

Tầng: WEB; Rule: FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-018</code> |
| **Title** | WEB — Số lượng hàng của 2 sản phẩm khác nhau |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A (q=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm B (id=2, p=250000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/2<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng hiển thị đúng 2 dòng riêng biệt: dòng A (q=2, 200000₫), dòng B (q=1, 250000₫); Tổng cộng 450000₫. |
| **Actual Result** | Cart correctly maintained 2 row(s)|
|**Status**| **Passed**; [evidence FR07-TC-018](fr07/evidence/fr07-run01/web/observations.json)[ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-018_cart_state.png) |

##### FR07-TC-020 — WEB — Mở /cart

Tầng: WEB; Rule: FR07-R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-020</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, q=2)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra phần tử tại cột Số lượng dòng Sản phẩm A |
| **Expected Result** | Tồn tại cả nút + (tăng) và nút - (giảm) cho phép người dùng bấm chỉnh số lượng. |
| **Actual Result** | Missing controls: '+' count=0, '-' count=0 (R03 violation: No +/- buttons implemented)|
|**Status**| **Failed**; [evidence FR07-TC-020](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png) |

##### FR07-TC-021 — WEB — Mở /cart

Tầng: WEB; Rule: FR07-R03, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-021</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=2), nút + hiện diện. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút + tại dòng Sản phẩm A |
| **Expected Result** | Số lượng tăng từ 2 lên 3, Thành tiền cập nhật từ 200000₫ lên 300000₫, Tổng cộng cập nhật tương ứng. |
| **Actual Result** | Blocked: Cannot click '+' button because it is not implemented<br>Blocker: FR07-TC-020 Failed: '+' button does not exist in cart table DOM|
|**Status**| **Blocked**; [evidence FR07-TC-021](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-021_blocked_check.png) |

##### FR07-TC-022 — WEB — Bấm nút - để giảm số lượng trên /cart

Tầng: WEB; Rule: FR07-R03, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-022</code> |
| **Title** | WEB — Bấm nút - để giảm số lượng trên /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=3), nút - hiện diện. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút - tại dòng Sản phẩm A |
| **Expected Result** | Số lượng giảm từ 3 xuống 2, Thành tiền giảm từ 300000₫ xuống 200000₫, Tổng cộng cập nhật tương ứng. |
| **Actual Result** | Blocked: Cannot click '-' button because it is not implemented<br>Blocker: FR07-TC-020 Failed: '-' button does not exist in cart table DOM|
|**Status**| **Blocked**; [evidence FR07-TC-022](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-022_blocked_check.png) |

##### FR07-TC-023 — WEB — Kiểm tra sự hiện diện của dialog xác nhận xóa khi bấm Xóa

Tầng: WEB; Rule: FR07-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-023</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A và Sản phẩm B. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút Xóa tại dòng Sản phẩm A |
| **Expected Result** | Xuất hiện dialog/modal xác nhận xóa trước khi thực hiện, có các nút Confirm và Cancel. |
| **Actual Result** | No confirmation dialog appeared! Item was deleted directly without confirmation (R04 violation)|
|**Status**| **Failed**; [evidence FR07-TC-023](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-023_before_delete.png) |

##### FR07-TC-024 — WEB — Bấm nút Cancel trong dialog xác nhận

Tầng: WEB; Rule: FR07-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-024</code> |
| **Title** | WEB — Bấm nút Cancel trong dialog xác nhận |
| **Preconditions** | Dialog xác nhận xóa đang mở sau khi bấm Xóa dòng Sản phẩm A. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Cancel trong dialog xác nhận |
| **Expected Result** | Dialog đóng lại; giỏ hàng giữ nguyên vẹn 2 dòng A và B; Tổng cộng không đổi (450000₫). |
| **Actual Result** | Blocked: SUT does not display confirmation dialog<br>Blocker: FR07-TC-023 Failed: Delete executed directly without confirmation dialog; Cancel/Confirm dialog branches cannot be tested|
|**Status**| **Blocked**; [evidence FR07-TC-024](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-024_check.png) |

##### FR07-TC-025 — WEB — Bấm nút Confirm trong dialog xác nhận

Tầng: WEB; Rule: FR07-R04, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-025</code> |
| **Title** | WEB — Bấm nút Confirm trong dialog xác nhận |
| **Preconditions** | Dialog xác nhận xóa đang mở sau khi bấm Xóa dòng Sản phẩm A. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Confirm trong dialog xác nhận |
| **Expected Result** | Dòng Sản phẩm A bị xóa khỏi giỏ hàng; dòng Sản phẩm B vẫn giữ nguyên (q=1, 250000₫); Tổng cộng tính lại thành 250000₫. |
| **Actual Result** | Blocked: SUT does not display confirmation dialog<br>Blocker: FR07-TC-023 Failed: Delete executed directly without confirmation dialog; Cancel/Confirm dialog branches cannot be tested|
|**Status**| **Blocked**; [evidence FR07-TC-025](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-025_check.png) |

##### FR07-TC-026 — WEB — Bấm nút Xóa tại dòng Sản phẩm B

Tầng: WEB; Rule: FR07-R04, FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-026</code> |
| **Title** | WEB — Bấm nút Xóa tại dòng Sản phẩm B |
| **Preconditions** | Giỏ hàng chỉ còn duy nhất 1 sản phẩm (Sản phẩm B, q=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ có B (q=1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Xóa tại dòng Sản phẩm B<br>2. Bấm Confirm trong dialog xác nhận |
| **Expected Result** | Giỏ hàng lập tức chuyển sang trạng thái trống, hiển thị hình minh họa và thông báo giỏ trống; bảng sản phẩm biến mất. |
| **Actual Result** | Cart transitioned to empty state after last item removed|
|**Status** | **Passed**; [evidence FR07-TC-026](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-026_after_last_delete.png) |

##### FR07-TC-027 — WEB — Hiển thị đầy đủ 5 cột bắt buộc trên bảng giỏ hàng

Tầng: WEB; Rule: FR07-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-027</code> |
| **Title** | WEB — Hiển thị đầy đủ 5 cột bắt buộc trên bảng giỏ hàng |
| **Preconditions** | Giỏ hàng có sản phẩm. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra tên các tiêu đề cột của bảng |
| **Expected Result** | Bảng hiển thị đầy đủ 5 cột chính xác: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác. |
| **Actual Result** | Observed headers: ['Sản phẩm', 'Giá', 'Số lượng', 'Thành tiền', 'Thao tác']. Discrepancy: 'Giá' was used instead of 'Đơn giá' (R01 violation)|
|**Status**| **Failed**; [evidence FR07-TC-027](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png) |

##### FR07-TC-028 — WEB —  Kiểm tra nhãn hiển thị tổng tiền chính xác là "Tổng cộng"

Tầng: WEB; Rule: FR07-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-028</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có sản phẩm. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra nhãn hiển thị tổng số tiền |
| **Expected Result** | Nhãn hiển thị chính xác là "Tổng cộng" (không phải "Tổng tạm tính"). |
| **Actual Result** | Observed 'Tổng tạm tính' instead of 'Tổng cộng' (R06 violation)|
|**Status**| **Failed**; [evidence FR07-TC-028](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png) |

##### FR07-TC-029 — WEB — Bấm nút "Tiếp tục mua sắm"

Tầng: WEB; Rule: FR07-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-029</code> |
| **Title** | WEB — Bấm nút "Tiếp tục mua sắm" |
| **Preconditions** | Người dùng đang ở trang /cart. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Bất kỳ trạng thái giỏ nào."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút "Tiếp tục mua sắm" |
| **Expected Result** | Trình duyệt chuyển hướng thành công về trang chủ URL /. |
| **Actual Result** | Button 'Tiếp tục mua sắm' navigated to http://127.0.0.1:5173/|
|**Status**| **Passed**; [evidence FR07-TC-029](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-029_before_click.png) |

##### FR07-TC-030 — API — Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt;

Tầng: API; Rule: API-AUTH

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-030</code> |
| **Title** | API — Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt; |
| **Preconditions** | Đăng nhập lấy Bearer token hợp lệ. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"User test hợp lệ."</code><br>Request thực tế lịch sử: <code>{"method": "GET", "path": "/api/cart", "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt; |
| **Expected Result** | HTTP Status 200 OK; body trả về mảng danh sách giỏ hàng của user. |
| **Actual Result** | 200 OK, returned array with length 0|
|**Status**| **Passed**; [evidence FR07-TC-030](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-031 — API — Gửi GET /api/cart không kèm Authorization header

Tầng: API; Rule: API-AUTH 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-031</code> |
| **Title** | API — Gửi GET /api/cart không kèm Authorization header |
| **Preconditions** | Không gửi token. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"None."</code><br>Request thực tế lịch sử: <code>{"method": "GET", "path": "/api/cart", "headers": {}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi GET /api/cart không kèm Authorization header |
| **Expected Result** | Bị từ chối truy cập (HTTP 401 hoặc 403); không rò rỉ dữ liệu giỏ hàng. |
| **Actual Result** | Rejected with HTTP 401|
|**Status**| **Passed**; [evidence FR07-TC-031](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-032 — API — Gửi POST /api/cart kèm token giả mạo

Tầng: API; Rule: API-AUTH

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-032</code> |
| **Title** | API — Gửi POST /api/cart kèm token giả mạo |
| **Preconditions** | Token giả mạo hoặc hết hạn. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Bearer invalid_secret_token_123."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi POST /api/cart kèm token giả mạo |
| **Expected Result** | Bị từ chối truy cập (HTTP 401 hoặc 403); không thay đổi dữ liệu giỏ hàng của bất kỳ user nào. |
| **Actual Result** | Rejected with HTTP 403|
|**Status**| **Passed**; [evidence FR07-TC-032](fr07/evidence/fr07-run01/api/observations.json) |

### 3. BVA

#### 3.1. Lập partition và resolution

- d thuộc Z, h=1: invalid (-∞,0], valid [1,+∞); endpoint 0 và 1. Không có maximum quantity được đặc tả.
- n thuộc N₀: empty {0}, nonempty [1,+∞); endpoint 0 và 1.
- r thuộc N₀: chưa có A {0}, đã thêm A [1,+∞); endpoint 0 và 1. Tách API/WEB vì khác interface và state.

#### 3.2. Sinh lân cận và gộp giá trị

| Chiều/tầng | Neighborhood tại endpoint 0 | Neighborhood tại endpoint 1 | Union |
|---|---|---|---|
| d / WEB | {-1,0,1} | {0,1,2} | {-1,0,1,2} |
| n / WEB | {0,1}; loại -1 | {0,1,2} | {0,1,2} |
| r / API | {0,1}; loại -1 | {0,1,2} | {0,1,2} |
| r / WEB | {0,1}; loại -1 | {0,1,2} | {0,1,2} |

#### 3.3. Test report BVA

##### FR07-TC-001 — WEB — Trạng thái biên $n = 0$ (Giỏ hàng trống)

Tầng: WEB; Rule: FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-001</code> |
| **Title** | WEB — Mở trang chủ / |
| **Preconditions** | Phiên duyệt mới, giỏ hàng React rỗng (n=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ rỗng."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở trang chủ /<br>2. Điều hướng tới trang giỏ hàng /cart<br>3. Quan sát nội dung trang |
| **Expected Result** | Hiển thị hình minh họa giỏ hàng trống và thông báo rõ ràng; không hiển thị bảng sản phẩm và tổng tiền. |
| **Actual Result** | Message: True, Illustration: False (Missing illustration!), No Table: True|
|**Status**| **Failed**; [evidence FR07-TC-001](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png) |

##### FR07-TC-002 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R01, FR07-R07, FR06-Q, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-002</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng ban đầu rỗng (n=0, r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1, "clicks": 1}</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Chuyển sang bảng giỏ hàng có 1 dòng A, số lượng 1, Thành tiền 100000₫, Tổng cộng 100000₫, không còn thông báo giỏ trống. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug|
|**Status**| **Failed**; [evidence FR07-TC-002](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_detail_before_add.png) |

##### FR07-TC-003 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-003</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 0, "clicks": 1}</code>; d=0 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=0<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống từ chối/chặn thao tác thêm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '0' was not added; cart remains empty|
|**Statuss**| **Passed**; [evidence FR07-TC-003](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-003_detail_before_add.png) |

##### FR07-TC-004 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-004</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 2, "clicks": 1}</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=2<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.|
|**Status**| **Failed**; [evidence FR07-TC-004](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-004_detail_before_add.png) |

##### FR07-TC-005 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-005</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": -1, "clicks": 1}</code>; d=-1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=-1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn/từ chối số lượng âm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '-1' was not added; cart remains empty|
|**Status**| **Passed**; [evidence FR07-TC-005](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-005_detail_before_add.png) |

##### FR07-TC-009 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-009</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server chỉ có đúng 1 dòng cho A, số lượng gộp thành 2. |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]|
|**Status**| **Failed**; [evidence FR07-TC-009](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-011 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-011</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server rỗng (r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng có đúng 1 dòng cho A với số lượng q=1. |
| **Actual Result** | Cart contains 1 row with quantity=1|
|**Status**| **Passed**; [evidence FR07-TC-011](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-012 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-012</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng đã có A với q=2 (r=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng chỉ có đúng 1 dòng cho A, số lượng gộp thành 3 (2 + 1). |
| **Actual Result** | Cart contains 3 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]|
|**Status**| **Failed**; [evidence FR07-TC-012](fr07/evidence/fr07-run01/api/observations.json) |

##### FR07-TC-014 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-014</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng tăng lên 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)|
|**Status**| **Failed**; [evidence FR07-TC-014](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png) |

##### FR07-TC-016 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-016</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=2 (r=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng duy trì đúng 1 dòng cho A, số lượng gộp thành 3, Thành tiền 300000₫, Tổng cộng 300000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)|
|**Status**| **Failed**; [evidence FR07-TC-016](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-016_cart_state.png) |

##### FR07-TC-019 — WEB — Thêm A với q=1

Tầng: WEB; Rule: FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-TC-019</code> |
| **Title** | WEB — Thêm A với q=1 |
| **Preconditions** | Giỏ hàng ban đầu rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"A (100000₫), B (250000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Thêm A với q=1<br>2. Thêm B với q=1<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng hiển thị đúng 2 dòng riêng biệt: A (q=1, 100000₫) và B (q=1, 250000₫); Tổng cộng 350000₫. |
| **Actual Result** | Cart correctly maintained 2 row(s)|
|**Status**| **Passed**; [evidence FR07-TC-019](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-019_cart_state.png) |

---

<a id="fr15"></a>

## FR-15 — Quản lý sản phẩm — Product CRUD

### 1. Phân tích requirement

| Rule | Yêu cầu và hậu điều kiện | Căn cứ | Interface |
|---|---|---|---|
| FR15-R01 | Admin có thể thêm sản phẩm; thêm đúng một ID và đọc lại được dữ liệu đã lưu | CRUD: confirmed; hậu điều kiện: derived | POST /api/products; WEB Create |
| FR15-R02 | Admin xem được danh sách và sản phẩm để quản lý; danh sách rỗng không có bản ghi | CRUD: confirmed; hậu điều kiện: derived | GET /api/products, GET /api/products/:id; WEB |
| FR15-R03 | Admin có thể sửa sản phẩm được chọn; đọc lại được giá trị mới | CRUD: confirmed; hậu điều kiện: derived | PUT /api/products/:id; WEB Update |
| FR15-R04 | Admin có thể xóa sản phẩm được chọn; các sản phẩm khác giữ nguyên | CRUD: confirmed; hậu điều kiện: derived | DELETE /api/products/:id; WEB Delete |
| FR15-R05 | Tên bắt buộc, tối đa 255 ký tự | confirmed, README:195 | Create/Update; API/WEB |
| FR15-R06 | Giá bắt buộc, phải là số lớn hơn 0 | confirmed, README:196 | Create/Update; API/WEB |
| FR15-R07 | Danh mục bắt buộc và phải thuộc danh sách có sẵn | confirmed, README:197 | Create/Update; API/WEB |
| FR15-R08 | Khi sửa một sản phẩm, các sản phẩm khác giữ nguyên | confirmed, README:198 | Update; API/DB và UI trước/sau reload |
| FR12-DEP-WRITE | POST/PUT/DELETE sản phẩm cần JWT hợp lệ và role admin | confirmed, README:177–179 | Chỉ các API ghi sản phẩm |


#### Fixture FR15-F (snapshot chính xác)

```json
{
  "baseline": {
    "categories": [
      {
        "id": 10,
        "name": "Category Ten"
      },
      {
        "id": 20,
        "name": "Category Twenty"
      }
    ],
    "products": [
      {
        "id": 101,
        "name": "Product A",
        "price": 100000,
        "description": "Description A",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        "category_id": 10
      },
      {
        "id": 202,
        "name": "Product B",
        "price": 200000,
        "description": "Description B",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        "category_id": 20
      },
      {
        "id": 303,
        "name": "Product C",
        "price": 300000,
        "description": "Description C",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        "category_id": 10
      }
    ]
  },
  "empty-products": {
    "categories": [
      {
        "id": 10,
        "name": "Category Ten"
      },
      {
        "id": 20,
        "name": "Category Twenty"
      }
    ],
    "products": []
  },
  "single-product": {
    "categories": [
      {
        "id": 10,
        "name": "Category Ten"
      },
      {
        "id": 20,
        "name": "Category Twenty"
      }
    ],
    "products": [
      {
        "id": 101,
        "name": "Product A",
        "price": 100000,
        "description": "Description A",
        "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        "category_id": 10
      }
    ]
  },
  "empty-categories": {
    "categories": [],
    "products": []
  }
}
```

### 2. Domain Testing

#### 2.1. Bước 1 — Xác định input và output

| Input/trạng thái | Miền, đơn vị hoặc độ phân giải | Cách sử dụng |
|---|---|---|
| `name`, độ dài `L` | Chuỗi; L∈N₀; fixture ASCII có bước 1 ký tự | ASCII tránh nhập nhằng đơn vị đếm; không chứng minh quy tắc Unicode |
| `price`, ký hiệu `p` | Số, p>0; precision toàn miền chưa quy định | BVA xét lát cắt số nguyên Z; không đặt giá tối đa |
| `category_id`, ký hiệu `c` | Membership của tập danh mục | 10/20 tồn tại, 15 không tồn tại; khoảng [10,20] không phải miền hợp lệ |
| Token/role | admin, user, không có token, token không hợp lệ | Lấy token qua login; không giả mạo role |
| Thao tác và ID được chọn | Create/Read/Update/Delete; A=101, B=202, C=303 | Tách trường hợp ID tồn tại và không tồn tại |
| Sản phẩm/danh mục trong CSDL | Reset fixture trước từng test case | Snapshot đủ id, name, price, description, imageUrl, category_id |
| `description`, `imageUrl` | Giá trị nominal, trừ ca sửa riêng từng trường | Không tự đặt thêm điều kiện bắt buộc, giới hạn độ dài hoặc URL |
| Thời gian/build | Ghi thời gian thực theo UTC+07:00 | FR-15 không có time boundary; reset login_attempts/locked_until khi cần |

- **Output:** response, tập ID, dữ liệu target/non-target và UI ngay sau thao tác/sau reload. Với Read/Delete không áp required body của Create/Update.

#### 2.2. Bước 2 — Xác định miền giá trị

Với payload có đủ field và đúng dạng, xác định:

- N := 1≤L≤255: tên không rỗng và không vượt 255 ký tự.
- P := p>0: giá dương.
- C := c∈Categories: danh mục tồn tại.
- A := JWT hợp lệ ∧ role=admin: có quyền ghi.
- E := sản phẩm được chọn tồn tại.

Miền chấp nhận Create là D_Create=A∧N∧P∧C. Update có thêm E: D_Update=A∧N∧P∧C∧E. Miền bù của Create là ¬A∨¬N∨¬P∨¬C; Update có thêm ¬E. Các trường hợp thiếu field, null hoặc sai kiểu nằm ngoài lát cắt chính và được xét riêng.

Read phân biệt danh sách rỗng/có dữ liệu và ID tồn tại/không tồn tại. Delete phân biệt xóa trong tập nhiều sản phẩm và xóa sản phẩm cuối. Không áp các predicate N/P của body Create/Update cho Read/Delete.

| Chiều | Các partition | Biên hoặc cách chọn đại diện |
|---|---|---|
| Độ dài tên | {0}: không hợp lệ; [1,255]: hợp lệ; [256,∞): không hợp lệ | L=1 và L=255 là biên thuộc miền hợp lệ |
| Giá | p≤0: không hợp lệ; p>0: hợp lệ | Mặt p=0 bị loại do bất đẳng thức nghiêm |
| Danh mục | Tồn tại; không tồn tại; thiếu/null | Đại diện 10/20 hợp lệ, 15 không tồn tại; không có biên số theo ID |
| Quyền truy cập | admin; user; không token; token lỗi | Categorical partition, không dùng On/Off số học |

#### 2.3. Test report Domain Testing 

##### FR15-TC-001 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-001</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-001](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-001.json) |

##### FR15-TC-002 — API — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-002</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-002](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-002.json) |

##### FR15-TC-003 — API — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-003</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-003](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-003.json) |

##### FR15-TC-004 — API — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-004</code> |
| **Title** | API — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-004](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-004.json) |

##### FR15-TC-005 — API — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-005</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-005](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-005.json) |

##### FR15-TC-006 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-006</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-006](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-006.json) |

##### FR15-TC-007 — API — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-007</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-007](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-007.json) |

##### FR15-TC-008 — API — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-008</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-008](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-008.json) |

##### FR15-TC-009 — API — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-009</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-009](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-009.json) |

##### FR15-TC-010 — API — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-010</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-010](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-010.json) |

##### FR15-TC-011 — API — Thêm sản phẩm, tên L=254, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-011</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-011](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-011.json) |

##### FR15-TC-012 — API — Thêm sản phẩm, tên L=255, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-012</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-012](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-012.json) |

##### FR15-TC-013 — API — Thêm sản phẩm, tên L=256, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-013</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-013](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-013.json) |

##### FR15-TC-014 — API — Thêm sản phẩm, tên L=1, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-014</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-014](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-014.json) |

##### FR15-TC-015 — API — Thêm sản phẩm, tên L=1, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-015</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-015](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-015.json) |

##### FR15-TC-016 — API — Thêm sản phẩm, tên L=1, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-016</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-016](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-016.json) |

##### FR15-TC-017 — API — Thêm sản phẩm, tên L=255, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-017</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-017](fr15/evidence/fr15-run03/api/observations.json)< >[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-017.json) |

##### FR15-TC-018 — API — Thêm sản phẩm, tên L=255, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-018</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-018](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-018.json) |

##### FR15-TC-019 — API — Thêm sản phẩm, tên L=0, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-019</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-019](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-019.json) |

##### FR15-TC-020 — API — Thêm sản phẩm, tên L=256, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-020</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-020](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-020.json) |

##### FR15-TC-021 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-021</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Passed**; [evidence FR15-TC-021](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-021.json) |

##### FR15-TC-022 — API — Thêm sản phẩm, tên L=128, giá="", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-022</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-022](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-022.json) |

##### FR15-TC-023 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-023</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 15}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Category absent member 15, not an ordered ID boundary"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-023](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-023.json) |

##### FR15-TC-024 — API — Thêm sản phẩm, tên L=128, giá="abc", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-024</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá="abc", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "abc", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price non-numeric string"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-024](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-024.json) |

##### FR15-TC-025 — API — Thêm sản phẩm, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-025</code> |
| **Title** | API — Thêm sản phẩm, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required name omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-025](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-025.json) |

##### FR15-TC-026 — API — Thêm sản phẩm, tên null, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-026</code> |
| **Title** | API — Thêm sản phẩm, tên null, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": null, "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required name null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-026](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-026.json) |

##### FR15-TC-027 — API — Thêm sản phẩm, tên L=128, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-027</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code>|
|**Status**| **Failed**; [evidence FR15-TC-027](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-027.json) |

##### FR15-TC-028 — API — Thêm sản phẩm, tên L=128, giá=null, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-029

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-028</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=null, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": null, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-028](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-028.json) |

##### FR15-TC-029 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-031

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-029</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-029](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-029.json) |

##### FR15-TC-030 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-032

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-030</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": null}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-030](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-030.json) |

##### FR15-TC-031 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-033

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-031</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": ""}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-031](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-031.json) |

##### FR15-TC-035 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-034

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-035</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-035](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-035.json) |

##### FR15-TC-036 — API — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-035, FR15-DT-060, FR15-BVA-012

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-036</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-036](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-036.json) |

##### FR15-TC-037 — API — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-036, FR15-BVA-013

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-037</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-037](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-037.json) |

##### FR15-TC-038 — API — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-037, FR15-BVA-014

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-038</code> |
| **Title** | API — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-038](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-038.json) |

##### FR15-TC-039 — API — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-038, FR15-BVA-015

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-039</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-039](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-039.json) |

##### FR15-TC-040 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-039, FR15-BVA-016

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-040</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-040](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-040.json) |

##### FR15-TC-041 — API — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-040, FR15-BVA-017

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-041</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-041](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-041.json) |

##### FR15-TC-042 — API — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-041, FR15-BVA-019

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-042</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-042](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-042.json) |

##### FR15-TC-043 — API — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-042, FR15-BVA-020

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-043</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-043](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-043.json) |

##### FR15-TC-044 — API — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-043, FR15-BVA-021

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-044</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-044](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-044.json) |

##### FR15-TC-045 — API — Sửa sản phẩm, tên L=254, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-044

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-045</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-045](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-045.json) |

##### FR15-TC-046 — API — Sửa sản phẩm, tên L=255, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-045

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-046</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-046](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-046.json) |

##### FR15-TC-047 — API — Sửa sản phẩm, tên L=256, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-046

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-047</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-047](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-047.json) |

##### FR15-TC-048 — API — Sửa sản phẩm, tên L=1, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-047

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-048</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-048](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-048.json) |

##### FR15-TC-049 — API — Sửa sản phẩm, tên L=1, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-048

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-049</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-049](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-049.json) |

##### FR15-TC-050 — API — Sửa sản phẩm, tên L=1, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-049

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-050</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-050](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-050.json) |

##### FR15-TC-051 — API — Sửa sản phẩm, tên L=255, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-050

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-051</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-051](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-051.json) |

##### FR15-TC-052 — API — Sửa sản phẩm, tên L=255, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-051

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-052</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-052](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-052.json) |

##### FR15-TC-053 — API — Sửa sản phẩm, tên L=0, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-052

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-053</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-053](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-053.json) |

##### FR15-TC-054 — API — Sửa sản phẩm, tên L=256, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-053

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-054</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-054](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-054.json) |

##### FR15-TC-055 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-054

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-055</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-055](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-055.json) |

##### FR15-TC-056 — API — Sửa sản phẩm, tên L=128, giá="", target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-055, FR15-DT-063

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-056</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-056](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-056.json) |

##### FR15-TC-057 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-056

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-057</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 15}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Category absent member 15, not an ordered ID boundary"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-057](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-057.json) |

##### FR15-TC-058 — API — Sửa sản phẩm, tên L=128, giá="abc", target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-057

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-058</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá="abc", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "abc", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price non-numeric string"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-058](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-058.json) |

##### FR15-TC-059 — API — Sửa sản phẩm, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-058

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-059</code> |
| **Title** | API — Sửa sản phẩm, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required name omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-059](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-059.json) |

##### FR15-TC-060 — API — Sửa sản phẩm, tên null, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-059

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-060</code> |
| **Title** | API — Sửa sản phẩm, tên null, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": null, "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required name null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-060](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-060.json) |

##### FR15-TC-061 — API — Sửa sản phẩm, tên L=128, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-061

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-061</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-061](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-061.json) |

##### FR15-TC-062 — API — Sửa sản phẩm, tên L=128, giá=null, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-062

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-062</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=null, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": null, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-062](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-062.json) |

##### FR15-TC-063 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-064

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-063</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-063](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-063.json) |

##### FR15-TC-064 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-065

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-064</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": null}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-064](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-064.json) |

##### FR15-TC-065 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-066

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-065</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": ""}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-065](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-065.json) |

##### FR15-TC-069 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R01; Source IDs: FR15-DT-067

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-069</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-069](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:11+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-069_immediate.png) |

##### FR15-TC-070 — WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-068, FR15-BVA-023

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-070</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-070](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:16+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-070_immediate.png) |

##### FR15-TC-071 — WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-069, FR15-BVA-024

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-071</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-071](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:21+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-071_immediate.png) |

##### FR15-TC-072 — WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-070, FR15-BVA-025

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-072</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-072](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:26+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-072_immediate.png) |

##### FR15-TC-073 — WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-071, FR15-BVA-026

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-073</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-073](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:30+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-073_immediate.png) |

##### FR15-TC-074 — WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-072, FR15-BVA-027

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-074</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-074](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:34+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-074_immediate.png) |

##### FR15-TC-075 — WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-073, FR15-BVA-028

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-075</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-075](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:37+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png) |

##### FR15-TC-076 — WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-074, FR15-BVA-030

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-076</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-076](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:40+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png) |

##### FR15-TC-077 — WEB — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-075, FR15-BVA-031

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-077</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-077](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:44+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-077_immediate.png) |

##### FR15-TC-078 — WEB — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-076, FR15-BVA-032

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-078</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-078](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:47+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-078_immediate.png) |

##### FR15-TC-079 — WEB — Thêm sản phẩm, tên L=254, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-077

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-079</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-079](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:51+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-079_immediate.png) |

##### FR15-TC-080 — WEB — Thêm sản phẩm, tên L=255, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-078

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-080</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-080](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:54+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-080_immediate.png) |

##### FR15-TC-081 — WEB — Thêm sản phẩm, tên L=256, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-079

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-081</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-081](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:57+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-081_immediate.png) |

##### FR15-TC-082 — WEB — Thêm sản phẩm, tên L=1, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-080

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-082</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-082](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:01+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-082_immediate.png) |

##### FR15-TC-083 — WEB — Thêm sản phẩm, tên L=1, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-081

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-083</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-083](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:05+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-083_immediate.png) |

##### FR15-TC-084 — WEB — Thêm sản phẩm, tên L=1, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-082

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-084</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-084](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-084_immediate.png) |

##### FR15-TC-085 — WEB — Thêm sản phẩm, tên L=255, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-083

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-085</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-085](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:12+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-085_immediate.png) |

##### FR15-TC-086 — WEB — Thêm sản phẩm, tên L=255, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-084

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-086</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-086](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:15+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-086_immediate.png) |

##### FR15-TC-087 — WEB — Thêm sản phẩm, tên L=0, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-085

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-087</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-087](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:19+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-087_immediate.png) |

##### FR15-TC-088 — WEB — Thêm sản phẩm, tên L=256, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-086

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-088</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-088](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:22+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-088_immediate.png) |

##### FR15-TC-089 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07; Source IDs: FR15-DT-087

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-089</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "20"}</code><br>**Passed**; [evidence FR15-TC-089](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:25+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-089_immediate.png) |

##### FR15-TC-090 — WEB — Thêm sản phẩm, tên L=128, giá="", target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-088

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-090</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-090](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:29+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-090_immediate.png) |

##### FR15-TC-092 — WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-089

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-092</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-092](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:36+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-092_immediate.png) |

##### FR15-TC-093 — WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-090, FR15-BVA-034

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-093</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-093](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:39+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-093_immediate.png) |

##### FR15-TC-094 — WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-091, FR15-BVA-035

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-094</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-094](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:43+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-094_immediate.png) |

##### FR15-TC-095 — WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-092, FR15-BVA-036

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-095</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-095](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:46+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-095_immediate.png) |

##### FR15-TC-096 — WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-093, FR15-BVA-037

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-096</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-096](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:49+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-096_immediate.png) |

##### FR15-TC-097 — WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-094, FR15-BVA-038

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-097</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-097](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:53+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-097_immediate.png) |

##### FR15-TC-098 — WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-095, FR15-BVA-039

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-098</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-098](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:56+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-098_immediate.png) |

##### FR15-TC-099 — WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-096, FR15-BVA-041

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-099</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-099](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:00+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-099_immediate.png) |

##### FR15-TC-100 — WEB — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-097, FR15-BVA-042

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-100</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-100](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:03+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-100_immediate.png) |

##### FR15-TC-101 — WEB — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-098, FR15-BVA-043

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-101</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-101](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-101_immediate.png) |

##### FR15-TC-102 — WEB — Sửa sản phẩm, tên L=254, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-099

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-102</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-102](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:10+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-102_immediate.png) |

##### FR15-TC-103 — WEB — Sửa sản phẩm, tên L=255, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-100

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-103</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-103](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:13+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-103_immediate.png) |

##### FR15-TC-104 — WEB — Sửa sản phẩm, tên L=256, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-101

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-104</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-104](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:17+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-104_immediate.png) |

##### FR15-TC-105 — WEB — Sửa sản phẩm, tên L=1, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-102

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-105</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-105](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:20+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-105_immediate.png) |

##### FR15-TC-106 — WEB — Sửa sản phẩm, tên L=1, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-103

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-106</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-106](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:24+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-106_immediate.png) |

##### FR15-TC-107 — WEB — Sửa sản phẩm, tên L=1, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-104

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-107</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-107](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:28+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-107_immediate.png) |

##### FR15-TC-108 — WEB — Sửa sản phẩm, tên L=255, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-105

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-108</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-108](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:31+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-108_immediate.png) |

##### FR15-TC-109 — WEB — Sửa sản phẩm, tên L=255, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-106

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-109</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-109](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:35+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-109_immediate.png) |

##### FR15-TC-110 — WEB — Sửa sản phẩm, tên L=0, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-107

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-110</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-110](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:39+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-110_immediate.png) |

##### FR15-TC-111 — WEB — Sửa sản phẩm, tên L=256, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06; Source IDs: FR15-DT-108

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-111</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-111](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:44+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-111_immediate.png) |

##### FR15-TC-112 — WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07; Source IDs: FR15-DT-109

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-112</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "20"}</code><br>**Failed**; [evidence FR15-TC-112](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:49+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-112_immediate.png) |

##### FR15-TC-113 — WEB — Sửa sản phẩm, tên L=128, giá="", target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-110

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-113</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-113](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:53+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-113_immediate.png) |

##### FR15-TC-115 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02; Source IDs: FR15-DT-111

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-115</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-products theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in empty-products"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": [], "failures": [], "beforeCount": 0, "afterCount": 0}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-115](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-115.json) |

##### FR15-TC-116 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02; Source IDs: FR15-DT-112

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-116</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in baseline"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": [{"id": 101, "name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, {"id": 202, "name": "Product B", "price": 200000, "description": "Description B", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, {"id": 303, "name": "Product C", "price": 300000, "description": "Description C", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}], "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-116](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-116.json) |

##### FR15-TC-117 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02; Source IDs: FR15-DT-113

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-117</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read detail target 101"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"id": 101, "name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-117](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-117.json) |

##### FR15-TC-118 — API — Xem sản phẩm, tên L=128, giá=100000, target=202

Tầng: API; Rule: FR15-R02; Source IDs: FR15-DT-114

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-118</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/202 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read detail target 202"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"id": 202, "name": "Product B", "price": "200000", "description": "Description B", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-118](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-118.json) |

##### FR15-TC-119 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R04; Source IDs: FR15-DT-115

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-119</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in baseline; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 3, "afterCount": 2}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-119](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-119.json) |

##### FR15-TC-120 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R04; Source IDs: FR15-DT-116

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-120</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot single-product theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in single-product; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 1, "afterCount": 0}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-120](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-120.json) |

##### FR15-TC-121 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-117

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-121</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field name; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-121](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-121.json) |

##### FR15-TC-122 — API — Sửa sản phẩm, tên L=9, giá=123456, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-118

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-122</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=123456, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 123456, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field price; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-122](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-122.json) |

##### FR15-TC-123 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-119

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-123</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Changed description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field description; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-123](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-123.json) |

##### FR15-TC-124 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-120

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-124</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=#changed", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field imageUrl; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-124](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-124.json) |

##### FR15-TC-125 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-121

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-125</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field category_id; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-125](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-125.json) |

##### FR15-TC-126 — API — Sửa sản phẩm, tên L=9, giá=100000, target=202

Tầng: API; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-122

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-126</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed B", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/202 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update target B (202), contrast A/C"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[202]</code><br>**Passed**; [evidence FR15-TC-126](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-126.json) |

##### FR15-TC-127 — WEB — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R02; Source IDs: FR15-DT-123

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-127</code> |
| **Title** | WEB — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-products theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xem với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in empty-products"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 0, "afterCount": 0, "mutationCount": 0, "htmlBlocked": false, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>**Passed**; [evidence FR15-TC-127](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:00+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-127_immediate.png) |

##### FR15-TC-128 — WEB — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R02; Source IDs: FR15-DT-124

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-128</code> |
| **Title** | WEB — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xem với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in baseline"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": false, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>**Passed**; [evidence FR15-TC-128](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:03+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-128_immediate.png) |

##### FR15-TC-129 — WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R04; Source IDs: FR15-DT-125

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-129</code> |
| **Title** | WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xóa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in baseline; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 2, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product deleted"}}}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>**Passed**; [evidence FR15-TC-129](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-129_immediate.png) |

##### FR15-TC-130 — WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R04; Source IDs: FR15-DT-126

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-130</code> |
| **Title** | WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot single-product theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xóa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in single-product; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 1, "afterCount": 0, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product deleted"}}}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>**Passed**; [evidence FR15-TC-130](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:10+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-130_immediate.png) |

##### FR15-TC-131 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-127

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-131</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field name; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Renamed A", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-131](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:13+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-131_immediate.png) |

##### FR15-TC-132 — WEB — Sửa sản phẩm, tên L=9, giá=123456, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-128

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-132</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=123456, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 123456, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field price; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "123456", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-132](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:17+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-132_immediate.png) |

##### FR15-TC-133 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-129

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-133</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Changed description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field description; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-133](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:20+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-133_immediate.png) |

##### FR15-TC-134 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-130

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-134</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=#changed", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field imageUrl; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-134](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:24+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-134_immediate.png) |

##### FR15-TC-135 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-131

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-135</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field category_id; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "20"}</code><br>**Failed**; [evidence FR15-TC-135](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:27+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-135_immediate.png) |

##### FR15-TC-136 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=202

Tầng: WEB; Rule: FR15-R03, FR15-R08; Source IDs: FR15-DT-132

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-136</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed B", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update target B (202), contrast A/C"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[202]</code><br>Input thực tế sau nhập UI: <code>{"name": "Renamed B", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-136](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:31+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-136_immediate.png) |

##### FR15-TC-137 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-133

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-137</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-137](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-137.json) |

##### FR15-TC-138 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-134

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-138</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-138](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-138.json) |

##### FR15-TC-139 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-135

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-139</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-139](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-139.json) |

##### FR15-TC-140 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-136

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-140</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-140](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-140.json) |

##### FR15-TC-141 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-137

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-141</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-141](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-141.json) |

##### FR15-TC-142 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-138

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-142</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-142](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-142.json) |

##### FR15-TC-143 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-139

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-143</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-143](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-143.json) |

##### FR15-TC-144 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-140

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-144</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-144](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-144.json) |

##### FR15-TC-145 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE; Source IDs: FR15-DT-141

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-145</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-145](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-145.json) |

##### FR15-TC-146 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07; Source IDs: FR15-DT-142

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-146</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-categories theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "No categories: reject creation despite valid name/price"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 0, "afterCount": 1, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 1}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[1]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": ""}</code><br>**Failed**; [evidence FR15-TC-146](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:34+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-146_immediate.png) |

##### FR15-TC-147 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07; Source IDs: FR15-DT-143

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-147</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-categories theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "No categories: category 10 is not an existing member"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 1}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 0, "afterCount": 1}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[1]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-147](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-147.json) |

#### 2.5. Các probe Supplementary đi kèm — 11 case, không cộng coverage DT/BVA

Các case này giữ nhãn gốc Supplementary; có thể có oracle derived hoặc unresolved. Blocked do thiếu oracle vẫn có actual observation, không mặc định là chưa thao tác.

##### FR15-TC-032 — API — Thêm sản phẩm, tên L=128, giá=0.5, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-SUP-001

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-032</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-032](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-032.json) |

##### FR15-TC-033 — API — Thêm sản phẩm, tên L=3, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-SUP-002

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-033</code> |
| **Title** | API — Thêm sản phẩm, tên L=3, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "   ", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Create", "description": "Whitespace name characterization; trim undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Blocked**; [evidence FR15-TC-033](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-033.json) |

##### FR15-TC-034 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-SUP-003

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-034</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("😀",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Create", "description": "Unicode emoji name characterization; length unit undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Blocked**; [evidence FR15-TC-034](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-034.json) |

##### FR15-TC-066 — API — Sửa sản phẩm, tên L=128, giá=0.5, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-SUP-004

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-066</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-066](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-066.json) |

##### FR15-TC-067 — API — Sửa sản phẩm, tên L=3, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-SUP-005

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-067</code> |
| **Title** | API — Sửa sản phẩm, tên L=3, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "   ", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Whitespace name characterization; trim undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Blocked**; [evidence FR15-TC-067](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-067.json) |

##### FR15-TC-068 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-SUP-006

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-068</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("😀",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Unicode emoji name characterization; length unit undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Blocked**; [evidence FR15-TC-068](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-068.json) |

##### FR15-TC-091 — WEB — Thêm sản phẩm, tên L=128, giá=0.5, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-SUP-007

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-091</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0.5", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-091](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:33+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-091_immediate.png) |

##### FR15-TC-114 — WEB — Sửa sản phẩm, tên L=128, giá=0.5, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-SUP-008

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-114</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0.5", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-114](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:57+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-114_immediate.png) |

##### FR15-TC-148 — API — Xem sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R02; Source IDs: FR15-SUP-009

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-148</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Read", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Blocked**; [evidence FR15-TC-148](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-148.json) |

##### FR15-TC-149 — API — Sửa sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R03; Source IDs: FR15-SUP-010

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-149</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Blocked**; [evidence FR15-TC-149](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-149.json) |

##### FR15-TC-150 — API — Xóa sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R04; Source IDs: FR15-SUP-011

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-150</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Delete", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Blocked**; [evidence FR15-TC-150](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-150.json) |

### 3. BVA

#### 3.1. Bước 1 — Chọn biến và giới hạn convention

Source v3/run03 dùng **ISTQB 3-value lịch sử**; giữ tên method trong case, không gọi đó là Standard môn học. Độ dài tên L dùng ASCII, h=1. Giá p>0 có precision toàn miền chưa rõ nên BVA chỉ xét lát cắt số nguyên Z, h=1. Category/auth là categorical. Bảng sau giữ đủ 44 case lịch sử; không loại evidence regression khi có slide mới.

#### 3.2. Bước 2 — Phân hoạch và endpoint lịch sử

| Chiều | Các partition | Endpoints |
|---|---|---|
| Tên L thuộc N₀ | {0} invalid; [1,255] valid; [256,+∞) invalid | 0,1,255,256 |
| Giá p thuộc Z | (-∞,0] invalid; [1,+∞) valid trên slice Z | 0,1 |

#### 3.3. Bước 3 — Sinh điểm trước, rồi hợp tập

- Tên: endpoint 0 → {0,1}; 1 → {0,1,2}; 255 → {254,255,256}; 256 → {255,256,257}. Union={0,1,2,254,255,256,257}, có 7 điểm. Loại L=-1 vì không thể có độ dài âm.
- Giá nguyên: endpoint 0 → {-1,0,1}; 1 → {0,1,2}. Union={-1,0,1,2}, có 4 điểm: 1/2 chấp nhận, -1/0 từ chối. ±1 không phải closest-neighbor đã biết của toàn miền giá thực.
- (7+4) điểm × 2 thao tác Create/Update × 2 tầng API/WEB = 44 nghĩa vụ trong registry. Đây không phải công thức 4n+1 hoặc 6n+1, cũng không phải toàn bộ không gian input.

Đối chiếu slide: tên [1,255] có Standard 1,2,nominal 128,254,255; Robustness thêm 0 và 256. L=257 của convention cũ là regression bổ sung. Nominal 128 đã có DT Create/Update case, nhưng không tự tăng số BVA executions hoặc sửa nhãn suite cũ. Với giá nguyên, Standard một phía là 1,2,nominal 100000; Robustness thêm 0; -1 giữ làm regression. Precision giá thực chưa rõ nên không áp LB=1 cho toàn FR-15. Giá 0.5 đúng predicate và đã được test Supplementary; đây không phải bằng chứng adjacency.

#### 3.4. Bước 4 — Materialize fixture và oracle

Tên dùng repeat("A",L), giữ price=100000, category=10 và admin hợp lệ. Khi kiểm giá, giữ L=128, category=10 và admin. Update chọn target 101 đang tồn tại; B/C là đối chứng. Input không hợp lệ phải bị từ chối và dữ liệu giữ nguyên; input hợp lệ phải thỏa hậu điều kiện CRUD. Với WEB, ghi inputEffective riêng inputIntended: HTML required/maxLength có thể chặn hoặc thay input; numeric string không tự là bug. UI prevention không chứng minh backend validation.

#### 3.5. Bước 5 — Deduplicate và evidence

Chỉ gộp với DT khi cùng action, layer, state, payload và expected, không chỉ cùng L hoặc p. Giữ 44 nghĩa vụ BVA: 28 cho tên và 16 cho giá, mỗi tầng 22. Actual lấy run03, gồm cả assertions UI immediate/reload. Một boundary case có thể Failed vì UI làm đổi nhầm sản phẩm dù giá trị biên được lưu đúng. Coverage điểm không phải pass rate và không chứng minh toàn FR-15, Unicode hoặc precision tiền tệ.

#### 3.6. Test report BVA lịch sử — 44 case

##### FR15-TC-002 — API — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-002, FR15-DT-027, FR15-BVA-001

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-002</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-002](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-002.json) |

##### FR15-TC-003 — API — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-003, FR15-BVA-002

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-003</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-003](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-003.json) |

##### FR15-TC-004 — API — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-004, FR15-BVA-003

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-004</code> |
| **Title** | API — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-004](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-004.json) |

##### FR15-TC-005 — API — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-005, FR15-BVA-004

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-005</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-005](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-005.json) |

##### FR15-TC-006 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-006, FR15-BVA-005

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-006</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-006](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-006.json) |

##### FR15-TC-007 — API — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-007, FR15-BVA-006

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-007</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-007](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-007.json) |

##### FR15-TC-008 — API — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-008, FR15-BVA-008

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-008</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-008](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-008.json) |

##### FR15-TC-009 — API — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-009, FR15-BVA-009

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-009</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-009](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-009.json) |

##### FR15-TC-010 — API — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-010, FR15-BVA-010

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-010</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-010](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-010.json) |

##### FR15-TC-036 — API — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-035, FR15-DT-060, FR15-BVA-012

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-036</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-036](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-036.json) |

##### FR15-TC-037 — API — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-036, FR15-BVA-013

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-037</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-037](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-037.json) |

##### FR15-TC-038 — API — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-037, FR15-BVA-014

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-038</code> |
| **Title** | API — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-038](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-038.json) |

##### FR15-TC-039 — API — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-038, FR15-BVA-015

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-039</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-039](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-039.json) |

##### FR15-TC-040 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-039, FR15-BVA-016

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-040</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-040](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-040.json) |

##### FR15-TC-041 — API — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-DT-040, FR15-BVA-017

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-041</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-041](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-041.json) |

##### FR15-TC-042 — API — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-041, FR15-BVA-019

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-042</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-042](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-042.json) |

##### FR15-TC-043 — API — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-042, FR15-BVA-020

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-043</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-043](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-043.json) |

##### FR15-TC-044 — API — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-DT-043, FR15-BVA-021

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-044</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-044](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:08+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-044.json) |

##### FR15-TC-070 — WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-068, FR15-BVA-023

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-070</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-070](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:16+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-070_immediate.png) |

##### FR15-TC-071 — WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-069, FR15-BVA-024

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-071</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-071](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:21+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-071_immediate.png) |

##### FR15-TC-072 — WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-070, FR15-BVA-025

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-072</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-072](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:26+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-072_immediate.png) |

##### FR15-TC-073 — WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-071, FR15-BVA-026

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-073</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-073](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:30+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-073_immediate.png) |

##### FR15-TC-074 — WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-072, FR15-BVA-027

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-074</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-074](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:34+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-074_immediate.png) |

##### FR15-TC-075 — WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-073, FR15-BVA-028

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-075</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-075](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:37+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png) |

##### FR15-TC-076 — WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-074, FR15-BVA-030

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-076</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-076](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:40+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png) |

##### FR15-TC-077 — WEB — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-075, FR15-BVA-031

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-077</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-077](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:44+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-077_immediate.png) |

##### FR15-TC-078 — WEB — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-076, FR15-BVA-032

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-078</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-078](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:47+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-078_immediate.png) |

##### FR15-TC-093 — WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-090, FR15-BVA-034

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-093</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-093](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:39+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-093_immediate.png) |

##### FR15-TC-094 — WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-091, FR15-BVA-035

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-094</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-094](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:43+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-094_immediate.png) |

##### FR15-TC-095 — WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-092, FR15-BVA-036

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-095</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-095](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:46+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-095_immediate.png) |

##### FR15-TC-096 — WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-093, FR15-BVA-037

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-096</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-096](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:49+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-096_immediate.png) |

##### FR15-TC-097 — WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-094, FR15-BVA-038

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-097</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-097](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:53+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-097_immediate.png) |

##### FR15-TC-098 — WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-DT-095, FR15-BVA-039

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-098</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-098](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:39:56+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-098_immediate.png) |

##### FR15-TC-099 — WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-096, FR15-BVA-041

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-099</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-099](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:00+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-099_immediate.png) |

##### FR15-TC-100 — WEB — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-097, FR15-BVA-042

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-100</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-100](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:03+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-100_immediate.png) |

##### FR15-TC-101 — WEB — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-DT-098, FR15-BVA-043

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-101</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-101](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:40:07+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-101_immediate.png) |

##### FR15-TC-151 — API — Thêm sản phẩm, tên L=257, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-BVA-007

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-151</code> |
| **Title** | API — Thêm sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Failed**; [evidence FR15-TC-151](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-151.json) |

##### FR15-TC-152 — API — Thêm sản phẩm, tên L=128, giá=2, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-BVA-011

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-152</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>**Passed**; [evidence FR15-TC-152](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-152.json) |

##### FR15-TC-153 — API — Sửa sản phẩm, tên L=257, giá=100000, target=101

Tầng: API; Rule: FR15-R05; Source IDs: FR15-BVA-018

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-153</code> |
| **Title** | API — Sửa sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Failed**; [evidence FR15-TC-153](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-153.json) |

##### FR15-TC-154 — API — Sửa sản phẩm, tên L=128, giá=2, target=101

Tầng: API; Rule: FR15-R06; Source IDs: FR15-BVA-022

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-154</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>**Passed**; [evidence FR15-TC-154](fr15/evidence/fr15-run03/api/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:38:09+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-154.json) |

##### FR15-TC-155 — WEB — Thêm sản phẩm, tên L=257, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-BVA-029

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-155</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",257), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-155](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:37+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-155_immediate.png) |

##### FR15-TC-156 — WEB — Thêm sản phẩm, tên L=128, giá=2, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-BVA-033

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-156</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "2", "category_id": "10"}</code><br>**Passed**; [evidence FR15-TC-156](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:41+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-156_immediate.png) |

##### FR15-TC-157 — WEB — Sửa sản phẩm, tên L=257, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05; Source IDs: FR15-BVA-040

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-157</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",257), "price": "100000", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-157](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:44+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-157_immediate.png) |

##### FR15-TC-158 — WEB — Sửa sản phẩm, tên L=128, giá=2, target=101

Tầng: WEB; Rule: FR15-R06; Source IDs: FR15-BVA-044

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-TC-158</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "2", "category_id": "10"}</code><br>**Failed**; [evidence FR15-TC-158](fr15/evidence/fr15-run03/web/observations.json)<br>Timestamp gốc: <code>2026-10-15T22:41:48+07:00</code><br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-158_immediate.png) |

---

Ghi nhận tổng hợp: Codex; định danh model cụ thể không có trong evidence xuất ra. Thời điểm ghi nhận 2026-10-17T16:49:29+07:00 (Asia/Ho_Chi_Minh), không thay timestamp run cũ. Phạm vi là tổng hợp tài liệu; không có lượt kiểm thử SUT mới, không có learner sign-off được suy ra. Tóm tắt yêu cầu đã nhận (capture extent: summary): tổng hợp một report.md cho FR3/FR5/FR7/FR15; mỗi FR có requirement, các bước Domain Testing và BVA, cùng bảy trường test report được người dùng chỉ định.
