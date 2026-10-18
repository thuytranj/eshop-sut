# Báo cáo tổng hợp Domain Testing và BVA — FR-03, FR-05, FR-07, FR-15

Quy ước ID trong báo cáo: `FRxx-DT-nnn` cho Domain Testing, `FRxx-BVA-nnn` cho BVA và `FRxx-SUP-nnn` cho probe bổ sung; mỗi nhóm đánh số từ 001 theo thứ tự trình bày. Case chung giữa hai kỹ thuật có ID trình bày riêng nhưng chỉ tính một case gốc. [Bảng ánh xạ ID](test-case-id-map.csv) liên kết từng ID báo cáo với ID trong suite/evidence lịch sử. Việc đổi mã không thay đổi Inputs, Expected Result, Actual Result hoặc Status; dữ liệu thực thi và đường dẫn evidence giữ nguyên.

| Feature | Unique designed | Passed | Failed | Blocked | Có verdict P+F | Nguồn kết quả |
|---|---:|---:|---:|---:|---:|---|
| FR-03 API/WEB | 52 | 27 | 20 | 5 | 47 | API/WEB observations 2026-10-12 |
| FR-05 native iOS + API hỗ trợ | 45 | 23 | 12 | 10 | 35 | run02 cumulative, giữ adjudication run01 |
| FR-07 API/WEB | 32 | 13 | 15 | 4 | 28 | fr07-run01 |
| FR-15 API/Admin WEB | 158 | 56 | 95 | 7 | 151 | fr15-run03 |
| **Tổng lịch sử** | **287** | **119** | **142** | **26** | **261** | Không cộng rerun hoặc hàng trùng giữa technique |

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

#### 2.2. Xác định miền giá trị

**Biên Độ dài Mật khẩu: $L(p) \iff \text{length}(p) \ge 8$**
- **Độ phân giải:** 1 ký tự ASCII.
- **Điểm kiểm thử được chọn:**
  - **Off point (Ngoài biên - Bị từ chối):** `length(p) = 7` $\implies$ `Abcde1!` (độ dài 7, vi phạm $L$, các vị từ ký tự khác thỏa mãn).
  - **On point (Trên biên - Chấp nhận):** `length(p) = 8` $\implies$ `Abcdef1!` (độ dài 8, thỏa mãn tối thiểu).
  - **Off point liền kề phía hợp lệ:** `length(p) = 9` $\implies$ `Abcdefg1!` (độ dài 9, vượt ngưỡng biên 1 đơn vị).
  - **In point (Điểm trong - Đối chứng):** `length(p) = 10` $\implies$ `Abcdefgh1!` (độ dài 10, nằm vững bên trong miền hợp lệ).

**Phân vùng Lớp Ký tự Mật khẩu: $\{U(p), D(p), N(p), S(p)\}$**
Mỗi lớp ký tự là một phân vùng phân loại nhị phân (có/không). Để cô lập lỗi đơn lẻ, các ca kiểm thử vi phạm đúng một lớp ký tự trong khi giữ độ dài = 8 và các lớp khác hợp lệ:
- **Thiếu chữ hoa ($\neg U$):** `abcdef1!` (toàn chữ thường, số, đặc biệt $\implies$ Từ chối).
- **Thiếu chữ thường ($\neg D$):** `ABCDEF1!` (toàn chữ hoa, số, đặc biệt $\implies$ Từ chối).
- **Thiếu chữ số ($\neg N$):** `Abcdefg!` (hoa, thường, đặc biệt, không có số $\implies$ Từ chối).
- **Thiếu ký tự đặc biệt ($\neg S$):** `Abcdef12` (hoa, thường, số, không có đặc biệt $\implies$ Từ chối).

**Phân vùng Tập hợp Ký tự Đặc biệt: $S(p)$**
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

**Bề mặt Biên Khớp Xác nhận Mật khẩu (UI): $C(p, c) \iff p = c$**
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

**Phân vùng Hình thức và Ràng buộc Mã OTP: $F(token)$ và $B(email, token)$**
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

#### 2.3. Test report Domain Testing 

##### FR03-DT-001 — API — POST /api/forgot-password với email A (đã đăng kí)

Tầng: API; Rule: R01, R02, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-001</code> |
| **Title** | API — POST /api/forgot-password với email A |
| **Preconditions** | Tài khoản fr03-a@example.com tồn tại, mật khẩu hiện tại OldPass1!|
| **Inputs** | { "email": "fr03-a@example.com" } gửi tới POST /api/forgot-password |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email của tài khoản A.<br>2. Ghi nhận response code và body.<br>3. Kiểm tra mã OTP trả về và truy vấn CSDL để xác minh token được gán cho tài khoản A.<br>4. Xác minh mật khẩu của tài khoản A không bị thay đổi. |
| **Expected Result** | - HTTP Status: 200 OK.<br>- Body chứa `resetToken` là chuỗi gồm đúng 6 chữ số (`^[0-9]{6}$`).<br>- CSDL lưu `reset_token` khớp với mã trả về; mật khẩu của tài khoản A vẫn là `OldPass1!`.|
| **Actual Result** | HTTP 200; response=<code>{"message": "Mã đặt lại mật khẩu đã được tạo", "resetToken": "7257"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code> |
| **Status** | **Failed** |

##### FR03-DT-002 — API — POST /api/forgot-password với email C (chưa đăng kí)

Tầng: API; Rule: R01, R0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-002</code> |
| **Title** | API — POST /api/forgot-password với email C |
| **Preconditions** | Email fr03-missing@example.com không tồn tại trong hệ thống|
| **Inputs** | <code>{"email": "fr03-missing@example.com"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/forgot-password` với email không tồn tại.<br>2. Ghi nhận response code và body.<br>3. Truy vấn CSDL xác minh không có bản ghi nào bị thay đổi. |
| **Expected Result** | - Hệ thống từ chối yêu cầu (mã lỗi HTTP 4xx, không sinh mã OTP hợp lệ).<br>- Không có bất kỳ thay đổi nào trong bảng `users`. |
| **Actual Result** | HTTP 404; response=<code>{"error": "User not found"}</code> |
| **Status** | **Passed** |

##### FR03-DT-003 — API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1!

Tầng: API; Rule: R05, R06, R07, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-003</code> |
| **Title** | API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | {"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"} |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu danh định 8 ký tự Abcdef1!<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1!, chỉ password A đổi, password B giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: "OldPass1!" → "Abcdef1!"<br>[evidence FR03-DT-003](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-004 — API — POST /api/reset-password với mật khẩu độ dài 7

Tầng: API; Rule: R06, R09;

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-004</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 7 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 7 ký tự.<br>2. Kiểm tra mã phản hồi HTTP và dữ liệu bảng `users` trong CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên OldPass1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!"</code><br>[evidence FR03-DT-004](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-005 — API — POST /api/reset-password với mật khẩu độ dài 9

Tầng: API; Rule: R06, R09; 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-005</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 9 Abcdefg1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 9 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdefg1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefg1!"</code><br>[evidence FR03-DT-005](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-006 — API — POST /api/reset-password với mật khẩu đối chứng trong miền độ dài 10

Tầng: API; Rule: R06, R09;

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-006</code> |
| **Title** | API — POST /api/reset-password với mật khẩu đối chứng trong miền độ dài 10 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefgh1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 10 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdefgh1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau:  <code>"OldPass1!"</code> → <code>"Abcdefgh1!"</code><br>[evidence FR03-DT-006](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-007 — API — POST /api/reset-password với mật khẩu thiếu chữ hoa

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-007</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ hoa |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!"}</code> |
| **Test Steps** |  1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ hoa.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abcdef1!"</code><br>[evidence FR03-DT-007](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-008 — API — POST /api/reset-password với mật khẩu thiếu chữ thường

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-008</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ thường ABCDEF1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ thường.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"ABCDEF1!"</code>;<br>[evidence FR03-DT-008](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-009 — API — POST /api/reset-password với mật khẩu thiếu chữ số

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-009</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ số Abcdefg! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ số.<br>2. Kiểm tra response và CSDL.|
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdefg!"</code><br>[evidence FR03-DT-009](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-010 — API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-010</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** |1. Gửi request POST `/api/reset-password` với mật khẩu thiếu ký tự đặc biệt.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdef12"</code><br>[evidence FR03-DT-010](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-011 — API — POST /api/reset-password với ký tự đặc biệt @

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-011</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt @ |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1@"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `@`.<br>2. Kiểm tra response và CSDL.  |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1@ |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1@"</code><br>[evidence FR03-DT-011](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-012 — API — POST /api/reset-password với ký tự đặc biệt $

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-012</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt $ |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1$"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `$`.<br>2. Kiểm tra response và CSDL.  |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1$ |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1$"</code><br>[evidence FR03-DT-012](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-013 — API — POST /api/reset-password với ký tự đặc biệt %

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-013</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt % |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1%"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `%`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1% |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1%"</code><br>[evidence FR03-DT-013](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-014 — API — POST /api/reset-password với ký tự đặc biệt *

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-014</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt * |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1*"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `*`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1* |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1*"</code><br>[evidence FR03-DT-014](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-015 — API — POST /api/reset-password với ký tự đặc biệt ?

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-015</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt ? |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1?"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `?`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1? |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1?"</code><br>[evidence FR03-DT-015](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-016 — API — POST /api/reset-password với ký tự đặc biệt &amp;

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-016</code> |
| **Title** | API — POST /api/reset-password với ký tự đặc biệt &amp;  |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** |  <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1&amp;"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chứa ký tự `&`.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1&amp; |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdef1&amp;"</code><br>[evidence FR03-DT-016](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-017 — API — POST /api/reset-password với ký tự khoảng trắng thay cho ký tự đặc biệt

Tầng: API; Rule: R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-017</code> |
| **Title** | API — POST /api/reset-password với ký tự khoảng trắng thay cho ký tự đặc biệt  |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1 "}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu chỉ dùng khoảng trắng làm ký tự không phải chữ/số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdef1 "</code><br>[evidence FR03-DT-017](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-DT-018 — API — POST /api/reset-password với OTP độ dài 5

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-018</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 5|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 5 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-018](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-019 — API — POST /api/reset-password với OTP độ dài 7

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-019</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 7|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 7 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>;<br>[evidence FR03-DT-019](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-020 — API — POST /api/reset-password với OTP chứa chữ 12345x

Tầng: API; Rule: R02, R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-020</code> |
| **Title** | API — POST /api/reset-password với OTP chứa chữ 12345x |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "12345x", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP chứa chữ.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-020](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-021 — API — POST /api/reset-password với OTP 6 số không thuộc quyền

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-021</code> |
| **Title** | API — POST /api/reset-password với OTP 6 số không thuộc quyền |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | {"email": "fr03-a@example.com", "resetToken": "234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP 6 số không thuộc quyền 234567<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-021](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-022 — API — POST /api/reset-password cho email B nhưng dùng token của A

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-022</code> |
| **Title** | API — POST /api/reset-password cho email B nhưng dùng token của A |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** |  <code>{"email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho email B nhưng dùng token của A<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-022](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-023 — API — POST /api/reset-password cho email A nhưng dùng token của B

Tầng: API; Rule: R05, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-023</code> |
| **Title** | API — POST /api/reset-password cho email A nhưng dùng token của B |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "654321", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho email A nhưng dùng token của B<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-023](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-024 — API — POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt

Tầng: API; Rule: R05, R07, R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-024</code> |
| **Title** | API — POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt |
| **Preconditions** | Tài khoản A có token 123456, B có token 654321 |
| **Inputs** | <code>{"email": "fr03-b@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** | 1. POST /api/reset-password cho B với token A và mật khẩu thiếu ký tự đặc biệt<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối an toàn, mật khẩu A và B đều không đổi |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-DT-024](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-DT-025 — WEB — Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP

Tầng: WEB; Rule: R02, R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-025</code> |
| **Title** | WEB — Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP demo |
| **Preconditions** | Tài khoản A tồn tại trong hệ thống |
| **Inputs** | <code>{"email": "fr03-a@example.com"}</code> |
| **Test Steps** | 1. Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP demo<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Giao diện hiển thị rõ chỉ báo Bước 1 / 2 sau đó Bước 2 / 2; thông báo OTP demo hiển thị đúng định dạng 6 chữ số |
| **Actual Result** | Giao diện thiếu chỉ báo bước (Step indicator 'Bước 1 / 2' hoặc 'Bước 2 / 2'); Mã OTP demo '6429' có độ dài 4, không đúng 6 chữ số theo R02<br>[evidence FR03-DT-025](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-037.png) |
| **Status** | **Failed** |

##### FR03-DT-026 — WEB — Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1

Tầng: WEB; Rule: R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-026</code> |
| **Title** | WEB — Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1 |
| **Preconditions** | Đang ở trang /forgot-password |
| **Inputs** | - |
| **Test Steps** | 1. Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Trình duyệt điều hướng thành công về URL /login |
| **Actual Result** | Chuyển hướng về /login thành công.<br>Giới hạn: selector rộng có thể click link Đăng nhập trên nav; chưa xác nhận control riêng trong form.<br>[evidence FR03-DT-026](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-038.png) |
| **Status** | **Passed** |

##### FR03-DT-027 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-027</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!"}</code>|
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận Abcdef1!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận, submit thành công và điều hướng về /login |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>[evidence FR03-DT-027](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-039.png) |
| **Status** | **Blocked** |

##### FR03-DT-028 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-028</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Zyxwvu2&amp;", "confirmPassword": "Zyxwvu2&amp;"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Zyxwvu2&amp;, xác nhận Zyxwvu2&amp;, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận, submit thành công |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>[evidence FR03-DT-028](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-040.png) |
| **Status** | **Blocked** |

##### FR03-DT-029 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-029</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** |  <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef2!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai thay thế Abcdef2!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị thông báo mật khẩu xác nhận không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>[evidence FR03-DT-029](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-041.png) |
| **Status** | **Blocked** |

##### FR03-DT-030 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-030</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | \<code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai xóa ký tự Abcdef1, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị lỗi không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>[evidence FR03-DT-030](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-042.png) |
| **Status** | **Blocked** |

##### FR03-DT-031 — WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-031</code> |
| **Title** | WEB — Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!", "confirmPassword": "Abcdef1!!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập OTP 123456, mật khẩu mới Abcdef1!, xác nhận sai chèn ký tự Abcdef1!!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị lỗi không khớp |
| **Actual Result** | Bị chặn thực thi: Giao diện web không có trường input 'Xác nhận mật khẩu mới' để nhập kiểm tra so khớp.<br>[evidence FR03-DT-031](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-043.png) |
| **Status** | **Blocked** |

##### FR03-DT-032 — WEB — Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống

Tầng: WEB; Rule: R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-032</code> |
| **Title** | WEB — Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống |
| **Preconditions** | Tại Bước 2 giao diện ForgotPassword |
| **Inputs** | Kiểm sự hiện diện control xác nhận; không đồng nhất với một lần submit confirmation rỗng. |
| **Test Steps** | 1. Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Trường input xác nhận mật khẩu hiện diện trong DOM; không thể submit nếu để trống |
| **Actual Result** | Trường 'Xác nhận mật khẩu mới' hoàn toàn không tồn tại trong form Bước 2 (Chỉ có trường OTP và 1 trường mật khẩu)<br>[evidence FR03-DT-032](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-044.png) |
| **Status** | **Failed** |

##### FR03-DT-033 — WEB — Tại Bước 2, nhập mật khẩu có ký tự @, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-033</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự @ Abcdef1@, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1@"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu có ký tự @ Abcdef1@, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1@' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-033](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-045.png) |
| **Status** | **Failed** |

##### FR03-DT-034 — WEB — Tại Bước 2, nhập mật khẩu có ký tự $, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-034</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự $, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1$"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1$, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1$' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-034](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-046.png) |
| **Status** | **Failed** |

##### FR03-DT-035 — WEB — Tại Bước 2, nhập mật khẩu có ký tự !, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-035</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự ! Abcdef1!, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1!, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1!' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-035](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-047.png) |
| **Status** | **Failed** |

##### FR03-DT-036 — WEB — Tại Bước 2, nhập mật khẩu có ký tự %, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-036</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự %, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1%"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1%, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1%' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-036](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-048.png) |
| **Status** | **Failed** |

##### FR03-DT-037 — WEB — Tại Bước 2, nhập mật khẩu có ký tự *, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-037</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự * Abcdef1*, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1*"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1*, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1*' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-037](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-049.png) |
| **Status** | **Failed** |

##### FR03-DT-038 — WEB — Tại Bước 2, nhập mật khẩu có ký tự ?, click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-038</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự ?, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1?"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu: Abcdef1?, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1?' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-038](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-050.png) |
| **Status** | **Failed** |

##### FR03-DT-039 — WEB — Tại Bước 2, nhập mật khẩu có ký tự &amp; click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-039</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu có ký tự &amp; Abcdef1&amp;, click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | <code>{"newPassword": "Abcdef1&amp;"}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu có ký tự &amp; Abcdef1&amp;, click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form chấp nhận mật khẩu hợp lệ |
| **Actual Result** | Mật khẩu hợp lệ 'Abcdef1&amp;' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')<br>[evidence FR03-DT-039](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-051.png) |
| **Status** | **Failed** |

##### FR03-DT-040 — WEB — Tại Bước 2, nhập mật khẩu có khoảng trắng Abcdef1 , click Đặt lại

Tầng: WEB; Rule: R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-DT-040</code> |
| **Title** | WEB — Tại Bước 2, nhập mật khẩu chỉ có khoảng trắng Abcdef1 , click Đặt lại |
| **Preconditions** | Tài khoản A có token 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"newPassword": "Abcdef1 "}</code> |
| **Test Steps** | 1. Tại Bước 2, nhập mật khẩu chỉ có khoảng trắng Abcdef1 , click Đặt lại<br>2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối. |
| **Expected Result** | Form từ chối submit, hiển thị thông báo lỗi mật khẩu quá yếu |
| **Actual Result** | Mật khẩu chỉ có khoảng trắng 'Abcdef1 ' bị regex lỗi chấp nhận (Alert: 'Đổi mật khẩu thành công!'). Vi phạm R07<br>[evidence FR03-DT-040](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-052.png) |
| **Status** | **Failed** |

### 3. BVA

#### 3.1. Xác định miền giá trị và endpoint

| Đại lượng | Phân vùng không hợp lệ | Phân vùng hợp lệ | Endpoint hữu hạn |
|---|---|---|---|
| Độ dài mật khẩu L thuộc N₀ | [0,7] | [8,+∞); chưa có maximum | 0,7,8 |
| Mỗi số đếm lớp ký tự thuộc N₀ | {0} | [1,+∞) | 0,1 |
| Độ dài OTP T thuộc N₀ | [0,5] và [7,+∞) | {6}, chỉ hợp lệ về độ dài | 0,5,6,7 |

Không thể tạo độ dài/số đếm âm; +∞ không là endpoint hữu hạn để chọn test data. OTP length=6 chưa đủ để reset: token phải là chữ số và khớp email yêu cầu. Không đặt thêm cận trên mật khẩu hoặc precision Unicode chưa có trong đặc tả.

#### 3.2. Dẫn xuất từng lân cận rồi hợp tập

| Đại lượng | Endpoint → lân cận khả thi | Hợp tập giá trị | Số nghĩa vụ |
|---|---|---|---:|
| Độ dài mật khẩu | 0→{0,1}; 7→{6,7,8}; 8→{7,8,9} | {0,1,6,7,8,9} | 6 |
| Chữ hoa | 0→{0,1}; 1→{0,1,2} | {0,1,2} | 3 |
| Chữ thường | 0→{0,1}; 1→{0,1,2} | {0,1,2} | 3 |
| Chữ số | 0→{0,1}; 1→{0,1,2} | {0,1,2} | 3 |
| Ký tự đặc biệt | 0→{0,1}; 1→{0,1,2} | {0,1,2} | 3 |
| Độ dài OTP | 0→{0,1}; 5→{4,5,6}; 6→{5,6,7}; 7→{6,7,8} | {0,1,4,5,6,7,8} | 7 |

Tổng **6 + 4×3 + 7 = 25 nghĩa vụ giá trị trên API**. Các số lặp trong cùng một chiều chỉ tính một lần; cùng số 1 ở hai lớp ký tự vẫn là hai nghĩa vụ khác nhau. Tập {7,8,9} đơn lẻ chưa đủ convention này vì còn các endpoint của miền không hợp lệ. 

#### 3.3. Chọn fixture và tính Expected Result

Dùng trạng thái FR03-F: A/B có password OldPass1!, token seed A=123456 và B=654321; reset độc lập trong CSDL cách ly trước mỗi case. Đây là token synthetic phục vụ kiểm reset, không phải evidence chức năng sinh OTP.

| Chiều | Giá trị → fixture cụ thể | Expected |
|---|---|---|
| Độ dài mật khẩu | 0→chuỗi rỗng; 1→A; 6→Abcd1!; 7→Abcde1!; 8→Abcdef1!; 9→Abcdefg1! | 0/1/6/7 từ chối; 8/9 chấp nhận |
| Chữ hoa | 0→abcdef1!; 1→Abcdef1!; 2→ABcdef1! | 0 từ chối; 1/2 chấp nhận |
| Chữ thường | 0→ABCDEF1!; 1→aBCDEF1!; 2→abCDEF1! | 0 từ chối; 1/2 chấp nhận |
| Chữ số | 0→Abcdefg!; 1→Abcdef1!; 2→Abcde12! | 0 từ chối; 1/2 chấp nhận |
| Special | 0→Abcdef12; 1→Abcdef1!; 2→Abcde1!& | 0 từ chối; 1/2 chấp nhận |
| OTP length | 0→chuỗi rỗng; 1→1; 4→1234; 5→12345; 6→123456; 7→1234567; 8→12345678 | Chỉ token 123456 khớp A và được chấp nhận với mật khẩu mạnh |

Khi kiểm password, giữ email A và token 123456; khi kiểm OTP, giữ password Abcdef1!. Các fixture số đếm đều dài 8 và giữ những lớp khác hợp lệ. Password rỗng hoặc A vi phạm nhiều rule cùng lúc nên không cô lập riêng length. Token sai độ dài đồng thời không khớp token lưu; từ chối không chứng minh riêng validator hình thức. Những giới hạn masking này không bị che đi khi ghi kết quả.

#### 3.4. Deduplicate, mapping và coverage

25 nghĩa vụ được gộp thành **21 case API**. FR03-BVA-001 (cùng case gốc với FR03-DT-003) đồng thời đáp ứng length=8, upper=1, digit=1, special=1 và OTP length=6; vì cùng trạng thái, payload, steps và oracle nên chỉ thực thi/đếm một case. Case chung với Domain Testing vẫn xuất hiện ở cả hai bảng để tra cứu, không cộng trùng vào 52 case của FR-03.

#### 3.6. Test report BVA 

##### FR03-BVA-001 — API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1!

Tầng: API; Rule: R05, R06, R07, R09; Nghĩa vụ BVA: OBL-BVA-LEN-8, OBL-BVA-UPPER-1, OBL-BVA-DIGIT-1, OBL-BVA-SPEC-1, OBL-BVA-OTP-6

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-001</code> |
| **Title** | API — POST /api/reset-password với mật khẩu 8 ký tự Abcdef1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | {"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef1!"} |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu danh định 8 ký tự Abcdef1!<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdef1!, chỉ password A đổi, password B giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: "OldPass1!" → "Abcdef1!"<br>[evidence FR03-BVA-001](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-002 — API — POST /api/reset-password với mật khẩu độ dài 7

Tầng: API; Rule: R06, R09; Nghĩa vụ BVA: OBL-BVA-LEN-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-002</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 7 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 7 ký tự.<br>2. Kiểm tra mã phản hồi HTTP và dữ liệu bảng `users` trong CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên OldPass1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!"</code><br>[evidence FR03-BVA-002](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-003 — API — POST /api/reset-password với mật khẩu độ dài 9

Tầng: API; Rule: R06, R09; Nghĩa vụ BVA: OBL-BVA-LEN-9

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-003</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 9 Abcdefg1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg1!"}</code> |
| **Test Steps** | 1. Gửi request HTTP POST tới `/api/reset-password` với mật khẩu 9 ký tự.<br>2. Kiểm tra response code và CSDL. |
| **Expected Result** | Status 200, mật khẩu A đổi thành Abcdefg1! |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcdefg1!"</code><br>[evidence FR03-BVA-003](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-004 — API — POST /api/reset-password với mật khẩu rỗng độ dài 0

Tầng: API; Rule: R06, R09; Nghĩa vụ BVA: OBL-BVA-LEN-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-004</code> |
| **Title** | API — POST /api/reset-password với mật khẩu rỗng độ dài 0 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": ""}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu rỗng độ dài 0<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>""</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-004](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-005 — API — POST /api/reset-password với mật khẩu độ dài 1 A

Tầng: API; Rule: R06, R09; Nghĩa vụ BVA: OBL-BVA-LEN-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-005</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 1 A |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "A"}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu độ dài 1 A<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"A"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-005](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-006 — API — POST /api/reset-password với mật khẩu độ dài 6 Abcd1!

Tầng: API; Rule: R06, R09; Nghĩa vụ BVA: OBL-BVA-LEN-6

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-006</code> |
| **Title** | API — POST /api/reset-password với mật khẩu độ dài 6 Abcd1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcd1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với mật khẩu độ dài 6 Abcd1!<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcd1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-006](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-007 — API — POST /api/reset-password với mật khẩu thiếu chữ hoa

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-UPPER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-007</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ hoa |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abcdef1!"}</code> |
| **Test Steps** |  1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ hoa.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abcdef1!"</code><br>[evidence FR03-BVA-007](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-008 — API — UPPER-2

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-UPPER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-008</code> |
| **Title** | API — UPPER-2 |
| **Preconditions** | CSDL cách ly; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. Reset riêng trước case. |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABcdef1!"}</code> |
| **Test Steps** | 1. Chuẩn bị fixture FR03-F và snapshot password A/B.<br>2. POST /api/reset-password với body trong Inputs.<br>3. Đọc response và snapshot A/B sau request; đối chiếu Expected Result. |
| **Expected Result** | Chấp nhận reset; password A đổi thành newPassword; password B giữ nguyên OldPass1!. |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"ABcdef1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-008](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-009 — API — POST /api/reset-password với mật khẩu thiếu chữ thường

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-LOWER-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-009</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ thường ABCDEF1! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "ABCDEF1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ thường.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"ABCDEF1!"</code>;<br>[evidence FR03-BVA-009](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-010 — API — LOWER-1

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-LOWER-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-010</code> |
| **Title** | API — LOWER-1 |
| **Preconditions** | CSDL cách ly; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. Reset riêng trước case. |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "aBCDEF1!"}</code> |
| **Test Steps** | 1. Chuẩn bị fixture FR03-F và snapshot password A/B.<br>2. POST /api/reset-password với body trong Inputs.<br>3. Đọc response và snapshot A/B sau request; đối chiếu Expected Result. |
| **Expected Result** | Chấp nhận reset; password A đổi thành newPassword; password B giữ nguyên OldPass1!. |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"aBCDEF1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-010](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-011 — API — LOWER-2

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-LOWER-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-011</code> |
| **Title** | API — LOWER-2 |
| **Preconditions** | CSDL cách ly; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. Reset riêng trước case. |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "abCDEF1!"}</code> |
| **Test Steps** | 1. Chuẩn bị fixture FR03-F và snapshot password A/B.<br>2. POST /api/reset-password với body trong Inputs.<br>3. Đọc response và snapshot A/B sau request; đối chiếu Expected Result. |
| **Expected Result** | Chấp nhận reset; password A đổi thành newPassword; password B giữ nguyên OldPass1!. |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"abCDEF1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-011](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-012 — API — POST /api/reset-password với mật khẩu thiếu chữ số

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-DIGIT-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-012</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu chữ số Abcdefg! |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdefg!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mật khẩu thiếu chữ số.<br>2. Kiểm tra response và CSDL.|
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdefg!"</code><br>[evidence FR03-BVA-012](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-013 — API — DIGIT-2

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-DIGIT-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-013</code> |
| **Title** | API — DIGIT-2 |
| **Preconditions** | CSDL cách ly; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. Reset riêng trước case. |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde12!"}</code> |
| **Test Steps** | 1. Chuẩn bị fixture FR03-F và snapshot password A/B.<br>2. POST /api/reset-password với body trong Inputs.<br>3. Đọc response và snapshot A/B sau request; đối chiếu Expected Result. |
| **Expected Result** | Chấp nhận reset; password A đổi thành newPassword; password B giữ nguyên OldPass1!. |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde12!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-013](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-014 — API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-SPEC-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-014</code> |
| **Title** | API — POST /api/reset-password với mật khẩu thiếu ký tự đặc biệt |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcdef12"}</code> |
| **Test Steps** |1. Gửi request POST `/api/reset-password` với mật khẩu thiếu ký tự đặc biệt.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"Abcdef12"</code><br>[evidence FR03-BVA-014](fr03/evidence/api/observations.json) |
| **Status** | **Failed** |

##### FR03-BVA-015 — API — SPEC-2

Tầng: API; Rule: R07, R09; Nghĩa vụ BVA: OBL-BVA-SPEC-2

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-015</code> |
| **Title** | API — SPEC-2 |
| **Preconditions** | CSDL cách ly; A/B tồn tại; password A/B=OldPass1!; token A=123456, B=654321; login_attempts=0, locked_until=NULL. Reset riêng trước case. |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": "Abcde1!&amp;"}</code> |
| **Test Steps** | 1. Chuẩn bị fixture FR03-F và snapshot password A/B.<br>2. POST /api/reset-password với body trong Inputs.<br>3. Đọc response và snapshot A/B sau request; đối chiếu Expected Result. |
| **Expected Result** | Chấp nhận reset; password A đổi thành newPassword; password B giữ nguyên OldPass1!. |
| **Actual Result** | HTTP 200; response=<code>{"message": "Password reset successfully"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"Abcde1!&amp;"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-015](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-016 — API — POST /api/reset-password với OTP rỗng độ dài 0

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-0

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-016</code> |
| **Title** | API — POST /api/reset-password với OTP rỗng độ dài 0 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP rỗng độ dài 0<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-016](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-017 — API — POST /api/reset-password với OTP độ dài 1 1

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-1

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-017</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 1 1 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "1", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 1 1<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-017](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-018 — API — POST /api/reset-password với OTP độ dài 4 1234

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-4

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-018</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 4 1234 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "1234", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 4 1234<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-018](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-019 — API — POST /api/reset-password với OTP độ dài 5

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-5

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-019</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 5|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "12345", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 5 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-019](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-020 — API — POST /api/reset-password với OTP độ dài 7

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-7

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-020</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 7|
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | <code>{"email": "fr03-a@example.com", "resetToken": "1234567", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. Gửi request POST `/api/reset-password` với mã OTP 7 chữ số.<br>2. Kiểm tra response và CSDL. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: <code>"OldPass1!"</code> → <code>"OldPass1!"</code>;<br>[evidence FR03-BVA-020](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

##### FR03-BVA-021 — API — POST /api/reset-password với OTP độ dài 8 12345678

Tầng: API; Rule: R02, R05, R09; Nghĩa vụ BVA: OBL-BVA-OTP-8

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR03-BVA-021</code> |
| **Title** | API — POST /api/reset-password với OTP độ dài 8 12345678 |
| **Preconditions** | Tài khoản A có token hợp lệ 123456 |
| **Inputs** | Fixture/inputs nguồn: <code>{"email": "fr03-a@example.com", "resetToken": "12345678", "newPassword": "Abcdef1!"}</code> |
| **Test Steps** | 1. POST /api/reset-password với OTP độ dài 8 12345678<br>2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected. |
| **Expected Result** | Yêu cầu bị từ chối, mật khẩu A giữ nguyên |
| **Actual Result** | HTTP 400; response=<code>{"error": "Invalid token or email"}</code><br>Password trước/sau: A <code>"OldPass1!"</code> → <code>"OldPass1!"</code>; B <code>"OldPass1!"</code> → <code>"OldPass1!"</code><br>[evidence FR03-BVA-021](fr03/evidence/api/observations.json) |
| **Status** | **Passed** |

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

#### 2.1. Xác định input và output

- **Input:** q là Unicode string, C là snapshot catalog, s là pending/success/error; device/network là precondition. M=|C|; S(q,C) là tập match theo oracle; n=|S| là output suy ra, không phải field user nhập. 
- **Output:** IDs/card signatures, tên/giá/ảnh, keyword literal, loading, empty state và accessibility native.

#### 2.2. Xác định miền giá trị

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

#### 2.3. Xây dựng test case và deduplicate

Lập q/catalog/network từng case; giữ thuộc tính khác nominal để biết rule nào sai. Source có 48 case; sau merge full-scenario còn 45 canonical: 33 native và 12 API hỗ trợ. Ba RESULT-ZERO/ONE/TWO của DT trùng BVA nên FR05-DT-018/019/020 tương ứng FR05-BVA-001/002/003, cùng ánh xạ về ba case gốc và giữ cả hai technique. Không merge API/native hoặc empty catalog với no-match trên catalog full. 35 canonical có DT, 3 có BVA, 10 Supplementary; tổng không bằng phép cộng nhãn vì ba case có cả DT+BVA.

#### 2.4. Test report Domain Testing

##### FR05-DT-001 — NATIVE — LIST — Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng

Tầng: NATIVE; Rule: FR05-R01, FR05-R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-001</code> |
| **Title** | NATIVE — LIST — Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng; layout là grid, không phải một cột danh sách.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112], "count": 12}</code> |
| **Actual Result** | Listing AX có12 tên; scroll AX container và coordinate sau Raise đều báo noWindowsAvailable. Chưa xác minh scroll completeness/native column policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED_GRID_AND_SCROLL<br>[evidence FR05-DT-001](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/listing-ready.ax.txt) |
| **Status** | **Blocked** |

##### FR05-DT-002 — NATIVE — EXACT — Có đúng card Alpha ID101

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-002</code> |
| **Title** | NATIVE — EXACT — Có đúng card Alpha ID101 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Có đúng card Alpha ID101; không có sản phẩm không match.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | Search Alpha trả một card Alpha giá 999 ₫; Hiển thị 1 sản phẩm.<br>[evidence FR05-DT-002](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-002.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-003 — NATIVE — NO-MATCH — Không có card

Tầng: NATIVE; Rule: FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-003</code> |
| **Title** | NATIVE — NO-MATCH — Không có card |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Không có card; có thông báo empty state khi response thành công rỗng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | Response success rỗng, vùng kết quả trống hoàn toàn; không có thông báo empty state trong screenshot/AX.<br>[evidence FR05-DT-003](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-003.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-004 — NATIVE — NAME-ONLY — Token chỉ trong description không làm sản phẩm match

Tầng: NATIVE; Rule: FR05-R05, FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-004</code> |
| **Title** | NATIVE — NAME-ONLY — Token chỉ trong description không làm sản phẩm match |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "DescriptionToken", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'DescriptionToken' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Token chỉ trong description không làm sản phẩm match; native có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | DescriptionToken không trả card (name-only đúng), nhưng không có thông báo empty state.<br>[evidence FR05-DT-004](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-004.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-005 — NATIVE — UNICODE — Full-name search 'Cà phê' trả đúng sản phẩm ID104

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-005</code> |
| **Title** | NATIVE — UNICODE — Full-name search 'Cà phê' trả đúng sản phẩm ID104 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Cà phê", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Cà phê' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'Cà phê' trả đúng sản phẩm ID104; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [104], "count": 1}</code> |
| **Actual Result** | Cà phê nguyên dấu trả một card Cà phê giá 999.999 ₫, không có tên sản phẩm khác trong AX.<br>[evidence FR05-DT-005](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-005.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-006 — NATIVE — QUOTE — Full-name search "O'Brien" trả đúng sản phẩm ID105

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-006</code> |
| **Title** | NATIVE — QUOTE — Full-name search "O'Brien" trả đúng sản phẩm ID105 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "O'Brien", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác "O'Brien" vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search "O'Brien" trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [105], "count": 1}</code> |
| **Actual Result** | App hiển thị nguyên chuỗi &lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near "Brien": syntax error&lt;/p&gt; thay vì card O'Brien.<br>[evidence FR05-DT-006](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-006.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-007 — NATIVE — AMP — Full-name search 'A&amp;B' trả đúng sản phẩm ID106

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-007</code> |
| **Title** | NATIVE — AMP — Full-name search 'A&amp;B' trả đúng sản phẩm ID106 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A&amp;B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A&amp;B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A&amp;B' trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [106], "count": 1}</code> |
| **Actual Result** | Keyword A&amp;B nhưng có Alpha/Beta/A+B/A#B và tên khác; không chỉ A&amp;B. API encode đúng case040 đã pass.<br>[evidence FR05-DT-007](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-007.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-008 — NATIVE — PLUS — Full-name search 'A+B' trả đúng sản phẩm ID107

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-008</code> |
| **Title** | NATIVE — PLUS — Full-name search 'A+B' trả đúng sản phẩm ID107 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A+B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A+B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A+B' trả đúng sản phẩm ID107; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [107], "count": 1}</code> |
| **Actual Result** | Search A+B hiển thị keyword nguyên dạng nhưng không có card A+B; API encoded case041 trả đúng ID107.<br>[evidence FR05-DT-008](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-008.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-009 — NATIVE — HASH — Full-name search 'A#B' trả đúng sản phẩm ID108

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-009</code> |
| **Title** | NATIVE — HASH — Full-name search 'A#B' trả đúng sản phẩm ID108 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A#B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A#B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Full-name search 'A#B' trả đúng sản phẩm ID108; không lỗi/truncate/đổi ký tự.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [108], "count": 1}</code> |
| **Actual Result** | Search A#B trả nhiều tên match A thay vì chỉ A#B; API encoded case042 trả đúng ID108.<br>[evidence FR05-DT-009](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-009.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-010 — NATIVE — SAFE — Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML

Tầng: NATIVE; Rule: FR05-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-010</code> |
| **Title** | NATIVE — SAFE — Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "&lt;b&gt;Alpha&lt;/b&gt;", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '&lt;b&gt;Alpha&lt;/b&gt;' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML; không đánh giá wildcard/matching trong case này.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Nhãn kết quả hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;; screenshot còn cả dấu &lt;b&gt;, không render bold/HTML.<br>[evidence FR05-DT-010](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-010.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-011 — NATIVE — MONEY — Giá 999/1000/1001/999999/1000000/1000001 đều có ₫

Tầng: NATIVE; Rule: FR05-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-011</code> |
| **Title** | NATIVE — MONEY — Giá 999/1000/1001/999999/1000000/1000001 đều có ₫ |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Giá 999/1000/1001/999999/1000000/1000001 đều có ₫; các giá ≥1000 có nhóm hàng nghìn đúng, dấu nhóm theo locale.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Native AX của full catalog hiển thị 999 ₫, 1.000 ₫, 1.001 ₫, 999.999 ₫, 1.000.000 ₫ và 1.000.001 ₫ đúng nhóm nghìn.<br>[evidence FR05-DT-011](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-011.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-012 — NATIVE — RATIO — Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2

Tầng: NATIVE; Rule: FR05-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-012</code> |
| **Title** | NATIVE — RATIO — Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2 |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=images theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>images</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot images; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.<br>4. Cuộn từng card Square/Wide/Tall và chụp ảnh cùng asset dimensions. |
| **Expected Result** | Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Snapshot images có Square/Wide/Tall. Screenshot Square từ PNG120×120 có hình tròn nhưng native kéo thành ellipse ngang. Wide thấy một phần; Tall chưa kiểm hình do scroll tool bị chặn. Một ảnh đã vi phạm đủ để case Failed.<br>[evidence FR05-DT-012](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-012.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-013 — NATIVE — ALT — Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled.

Tầng: NATIVE; Rule: FR05-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-013</code> |
| **Title** | NATIVE — ALT — Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Thu accessibility hierarchy hoặc đọc bằng VoiceOver; screenshot đơn lẻ không chứng minh alt. |
| **Expected Result** | Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Search Alpha thực trên native; exported AX có tên/giá nhưng không có image semantics đủ để chứng minh alt. Không có VoiceOver evidence.<br>Giới hạn/lý do: EVIDENCE_CAPABILITY<br>[evidence FR05-DT-013](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/FR05-TC-013.ax.txt) |
| **Status** | **Blocked** |

##### FR05-DT-014 — NATIVE — LONG-NAME — Có tên sản phẩm hiển thị trên card

Tầng: NATIVE; Rule: FR05-R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-014</code> |
| **Title** | NATIVE — LONG-NAME — Có tên sản phẩm hiển thị trên card |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Có tên sản phẩm hiển thị trên card; không áp chính sách wrap/full text chưa được quy định.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [112], "count": 1}</code> |
| **Actual Result** | Card có tên Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile và giá 1.000.001 ₫ trong native AX; không áp quy định wrap chưa có nguồn.<br>[evidence FR05-DT-014](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-014.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-015 — NATIVE — LOAD-INITIAL — Trong thời gian initial request còn pending có loading rõ

Tầng: NATIVE; Rule: FR05-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-015</code> |
| **Title** | NATIVE — LOAD-INITIAL — Trong thời gian initial request còn pending có loading rõ |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.<br>4. Proxy giữ initial response; chụp pending; release rồi chụp success. |
| **Expected Result** | Trong thời gian initial request còn pending có loading rõ; sau success có danh sách.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Initial reload có Đang tải... khi proxy giữ response 30 giây; sau response có 12 sản phẩm và loading biến mất.<br>[evidence FR05-DT-015](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-015-pending-v2.png) |
| **Status** | **Passed** |

##### FR05-DT-016 — NATIVE — LOAD-SEARCH — Trong search pending có loading

Tầng: NATIVE; Rule: FR05-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-016</code> |
| **Title** | NATIVE — LOAD-SEARCH — Trong search pending có loading |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy giữ search response; chụp pending; release rồi chụp success. |
| **Expected Result** | Trong search pending có loading; sau success có đúng Alpha.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | Search Alpha có Đang tải... trong pending; sau delay có đúng một Alpha và loading biến mất.<br>[evidence FR05-DT-016](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-016-pending.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-017 — NATIVE — LOAD-EMPTY — Pending có loading

Tầng: NATIVE; Rule: FR05-R07, FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-017</code> |
| **Title** | NATIVE — LOAD-EMPTY — Pending có loading |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Giữ response; chụp pending; release response rỗng rồi chụp. |
| **Expected Result** | Pending có loading; sau success rỗng loading kết thúc và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | Pending có Đang tải...; sau response [] loading biến mất nhưng vẫn chỉ vùng trống, không có empty state.<br>[evidence FR05-DT-017](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-017-pending.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-018 — NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state.

Tầng: NATIVE; Rule: FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-018</code> |
| **Title** | NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot empty; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Search Alpha trên catalog rỗng: không có card và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state.<br>[evidence FR05-DT-018](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-028.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-019 — NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-019</code> |
| **Title** | NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot one; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Một card Alpha giá 1000₫, không thiếu/trùng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one.<br>[evidence FR05-DT-019](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-029.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-020 — NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-020</code> |
| **Title** | NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot two; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature.<br>[evidence FR05-DT-020](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-030.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-021 — NATIVE — COUPLED-M2 — M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả.

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-021</code> |
| **Title** | NATIVE — COUPLED-M2 — M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=mixed theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>mixed</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot mixed; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | Snapshot mixed có Alpha/Beta nhưng query Alpha chỉ hiển thị Alpha giá 1.000 ₫; count1.<br>[evidence FR05-DT-021](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-031.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-022 — NATIVE — COUPLED-M3 — M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả.

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-022</code> |
| **Title** | NATIVE — COUPLED-M3 — M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=three theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>three</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot three; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | Snapshot three có Alpha/Beta/Gamma, query Alpha vẫn chỉ có Alpha giá 1.000 ₫ và count1; đối chiếu reset/request trong log.<br>[evidence FR05-DT-022](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-032.ax.txt) |
| **Status** | **Passed** |

##### FR05-DT-023 — NATIVE — EMPTY-RECOVERY — Search vô nghiệm có empty state

Tầng: NATIVE; Rule: FR05-R05, FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-023</code> |
| **Title** | NATIVE — EMPTY-RECOVERY — Search vô nghiệm có empty state |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Sau lần search đầu, thay q thành Alpha và bấm Tìm; đối chiếu ID101. |
| **Expected Result** | Search vô nghiệm có empty state; sau đó search Alpha có đúng Alpha, không lưu kết quả cũ.<br>Assertions nguồn: <code>{"oracleKind": "explicit"}</code> |
| **Actual Result** | Search vô nghiệm có 0 card nhưng thiếu empty state; sau đó search Alpha phục hồi đúng một Alpha giá 999 ₫.<br>[evidence FR05-DT-023](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-033-empty.ax.txt) |
| **Status** | **Failed** |

##### FR05-DT-024 — API — LIST — HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-024</code> |
| **Title** | API — LIST — HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products không có search.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112], "count": 12}</code> |
| **Actual Result** | HTTP 200; body có 12 phần tử; IDs=<code>[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]</code><br>[evidence FR05-DT-024](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-034.json) |
| **Status** | **Passed** |

##### FR05-DT-025 — API — EXACT — HTTP 200, JSON array, exact ID set [101].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-025</code> |
| **Title** | API — EXACT — HTTP 200, JSON array, exact ID set [101]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [101].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [101], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[101]</code><br>[evidence FR05-DT-025](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-035.json) |
| **Status** | **Passed** |

##### FR05-DT-026 — API — NO-MATCH — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-026</code> |
| **Title** | API — NO-MATCH — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ZZZ_NO_MATCH", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'ZZZ_NO_MATCH'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>[evidence FR05-DT-026](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-036.json) |
| **Status** | **Passed** |

##### FR05-DT-027 — API — NAME-ONLY — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-027</code> |
| **Title** | API — NAME-ONLY — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "DescriptionToken", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'DescriptionToken'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>[evidence FR05-DT-027](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-037.json) |
| **Status** | **Passed** |

##### FR05-DT-028 — API — UNICODE — HTTP 200, JSON array, exact ID set [104].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-028</code> |
| **Title** | API — UNICODE — HTTP 200, JSON array, exact ID set [104]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Cà phê", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Cà phê'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [104].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [104], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[104]</code><br>[evidence FR05-DT-028](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-038.json) |
| **Status** | **Passed** |

##### FR05-DT-029 — API — QUOTE — HTTP 200, JSON array, exact ID set [105].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-029</code> |
| **Title** | API — QUOTE — HTTP 200, JSON array, exact ID set [105]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "O'Brien", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ "O'Brien".<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [105].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [105], "count": 1}</code> |
| **Actual Result** | HTTP 500; HTTP 500; body=&lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near "Brien": syntax error&lt;/p&gt;<br>[evidence FR05-DT-029](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-039.json) |
| **Status** | **Failed** |

##### FR05-DT-030 — API — AMP — HTTP 200, JSON array, exact ID set [106].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-030</code> |
| **Title** | API — AMP — HTTP 200, JSON array, exact ID set [106]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A&amp;B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A&amp;B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [106].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [106], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[106]</code><br>[evidence FR05-DT-030](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-040.json) |
| **Status** | **Passed** |

##### FR05-DT-031 — API — PLUS — HTTP 200, JSON array, exact ID set [107].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-031</code> |
| **Title** | API — PLUS — HTTP 200, JSON array, exact ID set [107]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A+B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A+B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [107].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [107], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[107]</code><br>[evidence FR05-DT-031](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-041.json) |
| **Status** | **Passed** |

##### FR05-DT-032 — API — HASH — HTTP 200, JSON array, exact ID set [108].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-032</code> |
| **Title** | API — HASH — HTTP 200, JSON array, exact ID set [108]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A#B", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot full trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'A#B'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [108].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [108], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[108]</code><br>[evidence FR05-DT-032](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-042.json) |
| **Status** | **Passed** |

##### FR05-DT-033 — API — COUNT-EMPTY — HTTP 200, JSON array, exact ID set [].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-033</code> |
| **Title** | API — COUNT-EMPTY — HTTP 200, JSON array, exact ID set []. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot empty trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | HTTP 200; body có 0 phần tử; IDs=<code>[]</code><br>[evidence FR05-DT-033](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-043.json) |
| **Status** | **Passed** |

##### FR05-DT-034 — API — COUNT-ONE — HTTP 200, JSON array, exact ID set [201].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-034</code> |
| **Title** | API — COUNT-ONE — HTTP 200, JSON array, exact ID set [201]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot one trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [201].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | HTTP 200; body có 1 phần tử; IDs=<code>[201]</code><br>[evidence FR05-DT-034](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-044.json) |
| **Status** | **Passed** |

##### FR05-DT-035 — API — COUNT-TWO — HTTP 200, JSON array, exact ID set [201, 202].

Tầng: API; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-DT-035</code> |
| **Title** | API — COUNT-TWO — HTTP 200, JSON array, exact ID set [201, 202]. |
| **Preconditions** | Backend copy đang chạy; không dùng DB working tree.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset snapshot two trong DB copy.<br>2. GET /api/products với search được URL-encode từ 'Alpha'.<br>3. Lưu status/raw body; đối chiếu expected ID set độc lập. |
| **Expected Result** | HTTP 200, JSON array, exact ID set [201, 202].<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | HTTP 200; body có 2 phần tử; IDs=<code>[201, 202]</code><br>[evidence FR05-DT-035](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/api/FR05-TC-045.json) |
| **Status** | **Passed** |

#### 2.5. Các probe Supplementary đi kèm — 10 case, không cộng coverage DT/BVA

Các case này giữ nhãn gốc Supplementary; có thể có oracle derived hoặc unresolved. Blocked do thiếu oracle vẫn có actual observation, không mặc định là chưa thao tác.

##### FR05-SUP-001 — NATIVE — ERROR — Network error được phân biệt với search không có kết quả

Tầng: NATIVE; Rule: FR05-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-001</code> |
| **Title** | NATIVE — ERROR — Network error được phân biệt với search không có kết quả |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy chủ động ngắt request trong fixture copy; khôi phục network sau case. |
| **Expected Result** | Network error được phân biệt với search không có kết quả; không còn loading vô hạn.<br>Assertions nguồn: <code>{"oracleKind": "derived"}</code> |
| **Actual Result** | Khi proxy đóng socket, native hiển thị Network request failed; không hiển thị như search empty và không còn loading.<br>[evidence FR05-SUP-001](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-018.ax.txt) |
| **Status** | **Passed** |

##### FR05-SUP-002 — NATIVE — RACE — Search Alpha rồi Beta

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-002</code> |
| **Title** | NATIVE — RACE — Search Alpha rồi Beta |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.<br>4. Proxy hold Alpha, gửi Beta, release Beta rồi Alpha; lưu thứ tự request/response. |
| **Expected Result** | Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta.<br>Assertions nguồn: <code>{"oracleKind": "derived"}</code> |
| **Actual Result** | Beta trả trước và từng hiển thị Beta; sau khi Alpha cũ trả về, ô/nhãn vẫn Beta nhưng card đổi thành Alpha giá 999 ₫. Đây là derived latest-query-wins oracle.<br>[evidence FR05-SUP-002](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt) |
| **Status** | **Failed** |

##### FR05-SUP-003 — NATIVE — H1 — Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict

Tầng: NATIVE; Rule: FR05-R09

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-003</code> |
| **Title** | NATIVE — H1 — Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": null, "mode": "home"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog. |
| **Expected Result** | Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict; vẫn ghi native heading probe.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native listing AX có Danh sách sản phẩm; thiếu mapping exactly-one HTML h1 sang native heading. Không lấy text node làm bằng chứng h1.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-003](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/listing-ready.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-004 — NATIVE — TRIM — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-004</code> |
| **Title** | NATIVE — TRIM — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": " Alpha ", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác ' Alpha ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy trim chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập ' Alpha ', bấm Tìm; request /api/products?search=%20Alpha%20; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-004](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/trim.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-005 — NATIVE — WILDCARD — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-005</code> |
| **Title** | NATIVE — WILDCARD — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "%", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '%' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy literal wildcard chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '%', bấm Tìm; request /api/products?search=%25; HTTP200, response IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-005](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/percent-only.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-006 — NATIVE — CASE — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-006</code> |
| **Title** | NATIVE — CASE — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "ALPHA", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'ALPHA' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy case sensitivity chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'ALPHA', bấm Tìm; request /api/products?search=ALPHA; HTTP200, response IDs=[101]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-006](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/case-upper.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-007 — NATIVE — ACCENT — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-007</code> |
| **Title** | NATIVE — ACCENT — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "Ca phe", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Ca phe' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy diacritic sensitivity chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'Ca phe', bấm Tìm; request /api/products?search=Ca%20phe; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-007](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/diacritics.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-008 — NATIVE — EMPTY-QUERY — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-008</code> |
| **Title** | NATIVE — EMPTY-QUERY — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy empty vs omitted chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '', bấm Tìm; request /api/products?search=; HTTP200, response IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-008](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/empty-query.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-009 — NATIVE — ONE-CHAR — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-009</code> |
| **Title** | NATIVE — ONE-CHAR — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "A", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'A' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy substring chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập 'A', bấm Tìm; request /api/products?search=A; HTTP200, response IDs=[101, 102, 103, 106, 107, 108, 112]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-009](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/substring.ax.txt) |
| **Status** | **Blocked** |

##### FR05-SUP-010 — NATIVE — SPACE — Ghi observation

Tầng: NATIVE; Rule: FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-SUP-010</code> |
| **Title** | NATIVE — SPACE — Ghi observation |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=full theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>full</code>; inputs=<code>{"search": "   ", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot full; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác '   ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Ghi observation; chưa verdict do policy whitespace chưa có trong requirement. Không tính vào BVA length coverage.<br>Assertions nguồn: <code>{"oracleKind": "unresolved"}</code> |
| **Actual Result** | Native nhập '   ', bấm Tìm; request /api/products?search=%20%20%20; HTTP200, response IDs=[]; screenshot/AX đã thu. Có probe thực, matching verdict vẫn Blocked vì chưa có policy.<br>Giới hạn/lý do: ORACLE_UNRESOLVED<br>[evidence FR05-SUP-010](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run02/native/whitespace.ax.txt) |
| **Status** | **Blocked** |

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

Ba case trùng DT RESULT-ZERO/ONE/TWO về full scenario nên FR05-BVA-001/002/003 tương ứng FR05-DT-018/019/020; mỗi cặp cùng ánh xạ về một case gốc, mỗi case chỉ chạy/đếm một lần. API count-support khác interface không thay native coverage. Ba nghĩa vụ result-count được quan sát; không suy ra toàn bộ search space hay policy đã pass. Run02 cumulative là kết quả đã chọn; nhiều lần thử không tăng uniquecount.

#### 3.6. Test report BVA — 3 case native chia sẻ với DT

##### FR05-BVA-001 — NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state.

Tầng: NATIVE; Rule: FR05-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-BVA-001</code> |
| **Title** | NATIVE — RESULT-ZERO — Search Alpha trên catalog rỗng: không có card và có empty state. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=empty theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>empty</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot empty; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Search Alpha trên catalog rỗng: không có card và có empty state.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [], "count": 0}</code> |
| **Actual Result** | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state.<br>[evidence FR05-BVA-001](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-028.ax.txt) |
| **Status** | **Failed** |

##### FR05-BVA-002 — NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-BVA-002</code> |
| **Title** | NATIVE — RESULT-ONE — Một card Alpha giá 1000₫, không thiếu/trùng. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=one theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>one</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot one; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Một card Alpha giá 1000₫, không thiếu/trùng.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201], "count": 1}</code> |
| **Actual Result** | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one.<br>[evidence FR05-BVA-002](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-029.ax.txt) |
| **Status** | **Passed** |

##### FR05-BVA-003 — NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.

Tầng: NATIVE; Rule: FR05-R03, FR05-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR05-BVA-003</code> |
| **Title** | NATIVE — RESULT-TWO — Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. |
| **Preconditions** | Target native/build/locale/network như manifest.<br>Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.<br>Catalog snapshot=two theo FR05-F; reset riêng trước case.<br>Native iOS theo manifest; API supporting không thay thế UI native. |
| **Inputs** | Snapshot <code>two</code>; inputs=<code>{"search": "Alpha", "mode": "search"}</code> |
| **Test Steps** | 1. Reset backend về snapshot two; kiểm tra row count và hash fixture.<br>2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.<br>3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending. |
| **Expected Result** | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.<br>Assertions nguồn: <code>{"oracleKind": "explicit", "ids": [201, 202], "count": 2}</code> |
| **Actual Result** | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature.<br>[evidence FR05-BVA-003](fr05/evidence/fr05-run02/cumulative-observations.json)<br>[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-030.ax.txt) |
| **Status** | **Passed** |

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

##### FR07-DT-001 — WEB — Trạng thái Giỏ hàng Rỗng

Tầng: WEB; Rule: FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-001</code> |
| **Title** | WEB — Trạng thái Giỏ hàng Rỗng |
| **Preconditions** | Phiên duyệt mới, giỏ hàng React rỗng (n=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ rỗng."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở trang chủ /<br>2. Điều hướng tới trang giỏ hàng /cart<br>3. Quan sát nội dung trang |
| **Expected Result** | Hiển thị hình minh họa giỏ hàng trống và thông báo rõ ràng; không hiển thị bảng sản phẩm và tổng tiền. |
| **Actual Result** | Message: True, Illustration: False (Missing illustration!), No Table: True<br>[evidence FR07-DT-001](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png) |
| **Status** | **Failed** |

##### FR07-DT-002 — WEB — Thêm 1 sản phẩm vào giỏ rỗng

Tầng: WEB; Rule: FR07-R01, FR07-R07, FR06-Q, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-002</code> |
| **Title** | WEB — Thêm 1 sản phẩm vào giỏ rỗng |
| **Preconditions** | Giỏ hàng ban đầu rỗng (n=0, r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1, "clicks": 1}</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Chuyển sang bảng giỏ hàng có 1 dòng A, số lượng 1, Thành tiền 100000₫, Tổng cộng 100000₫, không còn thông báo giỏ trống. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.<br>[evidence FR07-DT-002](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_detail_before_add.png) |
| **Status** | **Failed** |

##### FR07-DT-003 — WEB — Thêm sản phẩm có số lượng bằng 0

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-003</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 0 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 0, "clicks": 1}</code>; d=0 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=0<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống từ chối/chặn thao tác thêm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '0' was not added; cart remains empty<br>[evidence FR07-DT-003](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-003_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-DT-004 — WEB — Thêm sản phẩm có số lượng bằng 2

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-004</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 2 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 2, "clicks": 1}</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=2<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.<br>[evidence FR07-DT-004](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-004_detail_before_add.png) |
| **Status** | **Failed** |

##### FR07-DT-005 — WEB — Thêm sản phẩm có số lượng bằng -1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-005</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng -1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": -1, "clicks": 1}</code>; d=-1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=-1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn/từ chối số lượng âm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '-1' was not added; cart remains empty<br>[evidence FR07-DT-005](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-005_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-DT-006 — WEB — Thêm sản phẩm có số lượng bằng 3

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-006</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng bằng 3 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 3, "clicks": 1}</code>; d=3 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=3<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 3, Thành tiền 300000₫, Tổng cộng 300000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.<br>[evidence FR07-DT-006](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-006_detail_before_add.png) |
| **Status** | **Failed** |

##### FR07-DT-007 — WEB — Thêm sản phẩm có số lượng là số thực

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-007</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng là số thực |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1.5, "clicks": 1}</code>; d=1.5 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1.5<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống không chấp nhận số lượng không nguyên; giỏ hàng không thêm sản phẩm với số lượng lẻ. |
| **Actual Result** | Invalid quantity input '1.5' was not added; cart remains empty<br>[evidence FR07-DT-007](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-007_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-DT-008 — WEB — Thêm sản phẩm có số lượng là chuỗi

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-008</code> |
| **Title** | WEB — Thêm sản phẩm có số lượng là chuỗi |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": "", "clicks": 1}</code>; d là chuỗi rỗng &quot;&quot; |
| **Test Steps** | 1. Vào /product/1<br>2. Xóa ô số lượng thành chuỗi rỗng<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn thao tác hoặc báo lỗi; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '' was not added; cart remains empty<br>[evidence FR07-DT-008](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-008_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-DT-009 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-009</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server chỉ có đúng 1 dòng cho A, số lượng gộp thành 2. |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]<br>[evidence FR07-DT-009](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Failed** |

##### FR07-DT-010 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-010</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=2. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 3}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:3}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server duy trì đúng 1 dòng cho A, số lượng gộp thành 5 (2 + 3). |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":2},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":3}]<br>[evidence FR07-DT-010](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Failed** |

##### FR07-DT-011 — API — POST /api/cart cho A (id=1, q=1)

Tầng: API; Rule: FR07-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-011</code> |
| **Title** | API — POST /api/cart cho A (id=1, q=1) |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server ban đầu rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1), Sản phẩm B (id=2)."</code><br>Request thực tế lịch sử: <code>[{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}}, {"method": "POST", "path": "/api/cart", "body": {"id": 2, "name": "Sản phẩm B", "price": 250000, "quantity": 1}}]</code>; d=1 |
| **Test Steps** | 1. POST /api/cart cho A (id=1, q=1)<br>2. POST /api/cart cho B (id=2, q=1)<br>3. GET /api/cart |
| **Expected Result** | Giỏ hàng chứa đúng 2 phần tử với 2 ID khác biệt (1 và 2). |
| **Actual Result** | Cart contains 2 distinct items (IDs 1 and 2)<br>[evidence FR07-DT-011](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Passed** |

##### FR07-DT-012 — WEB — Kiểm tra thêm cùng một sản phẩm vào giỏ có tạo dòng mới hay không

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-012</code> |
| **Title** | WEB — Kiểm tra thêm cùng một sản phẩm vào giỏ có tạo dòng mới hay không |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng tăng lên 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)<br>[evidence FR07-DT-012](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png) |
| **Status** | **Failed** |

##### FR07-DT-013 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-013</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=2. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=3 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=3 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng gộp thành 5, Thành tiền 500000₫, Tổng cộng 500000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)<br>[evidence FR07-DT-013](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-015_cart_state.png) |
| **Status** | **Failed** |

##### FR07-DT-014 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-014</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=3) và Sản phẩm B (q=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"A (100000₫), B (250000₫)."</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=2 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng giữ nguyên 2 dòng; dòng A có số lượng 5, Thành tiền 500000₫; dòng B giữ nguyên q=1, Thành tiền 250000₫; Tổng cộng 750000₫. |
| **Actual Result** | Failed merge: Cart created 3 rows instead of 2 row(s) (R02 violation)<br>[evidence FR07-DT-014](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-017_cart_state.png) |
| **Status** | **Failed** |

##### FR07-DT-015 — WEB — Số lượng hàng của 2 sản phẩm khác nhau

Tầng: WEB; Rule: FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-015</code> |
| **Title** | WEB — Số lượng hàng của 2 sản phẩm khác nhau |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A (q=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm B (id=2, p=250000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/2<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng hiển thị đúng 2 dòng riêng biệt: dòng A (q=2, 200000₫), dòng B (q=1, 250000₫); Tổng cộng 450000₫. |
| **Actual Result** | Cart correctly maintained 2 row(s)<br>[evidence FR07-DT-015](fr07/evidence/fr07-run01/web/observations.json)[ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-018_cart_state.png) |
| **Status** | **Passed** |

##### FR07-DT-016 — WEB — Mở /cart

Tầng: WEB; Rule: FR07-R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-016</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, q=2)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra phần tử tại cột Số lượng dòng Sản phẩm A |
| **Expected Result** | Tồn tại cả nút + (tăng) và nút - (giảm) cho phép người dùng bấm chỉnh số lượng. |
| **Actual Result** | Missing controls: '+' count=0, '-' count=0 (R03 violation: No +/- buttons implemented)<br>[evidence FR07-DT-016](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png) |
| **Status** | **Failed** |

##### FR07-DT-017 — WEB — Mở /cart

Tầng: WEB; Rule: FR07-R03, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-017</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=2), nút + hiện diện. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút + tại dòng Sản phẩm A |
| **Expected Result** | Số lượng tăng từ 2 lên 3, Thành tiền cập nhật từ 200000₫ lên 300000₫, Tổng cộng cập nhật tương ứng. |
| **Actual Result** | Blocked: Cannot click '+' button because it is not implemented<br>Blocker: FR07-TC-020 Failed: '+' button does not exist in cart table DOM<br>[evidence FR07-DT-017](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-021_blocked_check.png) |
| **Status** | **Blocked** |

##### FR07-DT-018 — WEB — Bấm nút - để giảm số lượng trên /cart

Tầng: WEB; Rule: FR07-R03, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-018</code> |
| **Title** | WEB — Bấm nút - để giảm số lượng trên /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A (q=3), nút - hiện diện. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút - tại dòng Sản phẩm A |
| **Expected Result** | Số lượng giảm từ 3 xuống 2, Thành tiền giảm từ 300000₫ xuống 200000₫, Tổng cộng cập nhật tương ứng. |
| **Actual Result** | Blocked: Cannot click '-' button because it is not implemented<br>Blocker: FR07-TC-020 Failed: '-' button does not exist in cart table DOM<br>[evidence FR07-DT-018](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-022_blocked_check.png) |
| **Status** | **Blocked** |

##### FR07-DT-019 — WEB — Kiểm tra sự hiện diện của dialog xác nhận xóa khi bấm Xóa

Tầng: WEB; Rule: FR07-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-019</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có Sản phẩm A và Sản phẩm B. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Bấm nút Xóa tại dòng Sản phẩm A |
| **Expected Result** | Xuất hiện dialog/modal xác nhận xóa trước khi thực hiện, có các nút Confirm và Cancel. |
| **Actual Result** | No confirmation dialog appeared! Item was deleted directly without confirmation (R04 violation)<br>[evidence FR07-DT-019](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-023_before_delete.png) |
| **Status** | **Failed** |

##### FR07-DT-020 — WEB — Bấm nút Cancel trong dialog xác nhận

Tầng: WEB; Rule: FR07-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-020</code> |
| **Title** | WEB — Bấm nút Cancel trong dialog xác nhận |
| **Preconditions** | Dialog xác nhận xóa đang mở sau khi bấm Xóa dòng Sản phẩm A. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Cancel trong dialog xác nhận |
| **Expected Result** | Dialog đóng lại; giỏ hàng giữ nguyên vẹn 2 dòng A và B; Tổng cộng không đổi (450000₫). |
| **Actual Result** | Blocked: SUT does not display confirmation dialog<br>Blocker: FR07-TC-023 Failed: Delete executed directly without confirmation dialog; Cancel/Confirm dialog branches cannot be tested<br>[evidence FR07-DT-020](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-024_check.png) |
| **Status** | **Blocked** |

##### FR07-DT-021 — WEB — Bấm nút Confirm trong dialog xác nhận

Tầng: WEB; Rule: FR07-R04, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-021</code> |
| **Title** | WEB — Bấm nút Confirm trong dialog xác nhận |
| **Preconditions** | Dialog xác nhận xóa đang mở sau khi bấm Xóa dòng Sản phẩm A. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Confirm trong dialog xác nhận |
| **Expected Result** | Dòng Sản phẩm A bị xóa khỏi giỏ hàng; dòng Sản phẩm B vẫn giữ nguyên (q=1, 250000₫); Tổng cộng tính lại thành 250000₫. |
| **Actual Result** | Blocked: SUT does not display confirmation dialog<br>Blocker: FR07-TC-023 Failed: Delete executed directly without confirmation dialog; Cancel/Confirm dialog branches cannot be tested<br>[evidence FR07-DT-021](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-025_check.png) |
| **Status** | **Blocked** |

##### FR07-DT-022 — WEB — Bấm nút Xóa tại dòng Sản phẩm B

Tầng: WEB; Rule: FR07-R04, FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-022</code> |
| **Title** | WEB — Bấm nút Xóa tại dòng Sản phẩm B |
| **Preconditions** | Giỏ hàng chỉ còn duy nhất 1 sản phẩm (Sản phẩm B, q=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ có B (q=1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút Xóa tại dòng Sản phẩm B<br>2. Bấm Confirm trong dialog xác nhận |
| **Expected Result** | Giỏ hàng lập tức chuyển sang trạng thái trống, hiển thị hình minh họa và thông báo giỏ trống; bảng sản phẩm biến mất. |
| **Actual Result** | Cart transitioned to empty state after last item removed<br>[evidence FR07-DT-022](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-026_after_last_delete.png) |
| **Status** | **Passed** |

##### FR07-DT-023 — WEB — Hiển thị đầy đủ 5 cột bắt buộc trên bảng giỏ hàng

Tầng: WEB; Rule: FR07-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-023</code> |
| **Title** | WEB — Hiển thị đầy đủ 5 cột bắt buộc trên bảng giỏ hàng |
| **Preconditions** | Giỏ hàng có sản phẩm. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra tên các tiêu đề cột của bảng |
| **Expected Result** | Bảng hiển thị đầy đủ 5 cột chính xác: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác. |
| **Actual Result** | Observed headers: ['Sản phẩm', 'Giá', 'Số lượng', 'Thành tiền', 'Thao tác']. Discrepancy: 'Giá' was used instead of 'Đơn giá' (R01 violation)<br>[evidence FR07-DT-023](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png) |
| **Status** | **Failed** |

##### FR07-DT-024 — WEB —  Kiểm tra nhãn hiển thị tổng tiền chính xác là "Tổng cộng"

Tầng: WEB; Rule: FR07-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-024</code> |
| **Title** | WEB — Mở /cart |
| **Preconditions** | Giỏ hàng có sản phẩm. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Nominal cart A(2), B(1)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở /cart<br>2. Kiểm tra nhãn hiển thị tổng số tiền |
| **Expected Result** | Nhãn hiển thị chính xác là "Tổng cộng" (không phải "Tổng tạm tính"). |
| **Actual Result** | Observed 'Tổng tạm tính' instead of 'Tổng cộng' (R06 violation)<br>[evidence FR07-DT-024](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png) |
| **Status** | **Failed** |

##### FR07-DT-025 — WEB — Bấm nút "Tiếp tục mua sắm"

Tầng: WEB; Rule: FR07-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-025</code> |
| **Title** | WEB — Bấm nút "Tiếp tục mua sắm" |
| **Preconditions** | Người dùng đang ở trang /cart. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Bất kỳ trạng thái giỏ nào."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Bấm nút "Tiếp tục mua sắm" |
| **Expected Result** | Trình duyệt chuyển hướng thành công về trang chủ URL /. |
| **Actual Result** | Button 'Tiếp tục mua sắm' navigated to http://127.0.0.1:5173/<br>[evidence FR07-DT-025](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-029_before_click.png) |
| **Status** | **Passed** |

##### FR07-DT-026 — API — Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt;

Tầng: API; Rule: API-AUTH

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-026</code> |
| **Title** | API — Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt; |
| **Preconditions** | Đăng nhập lấy Bearer token hợp lệ. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"User test hợp lệ."</code><br>Request thực tế lịch sử: <code>{"method": "GET", "path": "/api/cart", "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi GET /api/cart kèm Authorization: Bearer &lt;token&gt; |
| **Expected Result** | HTTP Status 200 OK; body trả về mảng danh sách giỏ hàng của user. |
| **Actual Result** | 200 OK, returned array with length 0<br>[evidence FR07-DT-026](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Passed** |

##### FR07-DT-027 — API — Gửi GET /api/cart không kèm Authorization header

Tầng: API; Rule: API-AUTH 

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-027</code> |
| **Title** | API — Gửi GET /api/cart không kèm Authorization header |
| **Preconditions** | Không gửi token. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"None."</code><br>Request thực tế lịch sử: <code>{"method": "GET", "path": "/api/cart", "headers": {}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi GET /api/cart không kèm Authorization header |
| **Expected Result** | Bị từ chối truy cập (HTTP 401 hoặc 403); không rò rỉ dữ liệu giỏ hàng. |
| **Actual Result** | Rejected with HTTP 401<br>[evidence FR07-DT-027](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Passed** |

##### FR07-DT-028 — API — Gửi POST /api/cart kèm token giả mạo

Tầng: API; Rule: API-AUTH

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-DT-028</code> |
| **Title** | API — Gửi POST /api/cart kèm token giả mạo |
| **Preconditions** | Token giả mạo hoặc hết hạn. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Bearer invalid_secret_token_123."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Gửi POST /api/cart kèm token giả mạo |
| **Expected Result** | Bị từ chối truy cập (HTTP 401 hoặc 403); không thay đổi dữ liệu giỏ hàng của bất kỳ user nào. |
| **Actual Result** | Rejected with HTTP 403<br>[evidence FR07-DT-028](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Passed** |

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

##### FR07-BVA-001 — WEB — Trạng thái biên $n = 0$ (Giỏ hàng trống)

Tầng: WEB; Rule: FR07-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-001</code> |
| **Title** | WEB — Mở trang chủ / |
| **Preconditions** | Phiên duyệt mới, giỏ hàng React rỗng (n=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Giỏ rỗng."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Mở trang chủ /<br>2. Điều hướng tới trang giỏ hàng /cart<br>3. Quan sát nội dung trang |
| **Expected Result** | Hiển thị hình minh họa giỏ hàng trống và thông báo rõ ràng; không hiển thị bảng sản phẩm và tổng tiền. |
| **Actual Result** | Message: True, Illustration: False (Missing illustration!), No Table: True<br>[evidence FR07-BVA-001](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png) |
| **Status** | **Failed** |

##### FR07-BVA-002 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R01, FR07-R07, FR06-Q, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-002</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng ban đầu rỗng (n=0, r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 1, "clicks": 1}</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Chuyển sang bảng giỏ hàng có 1 dòng A, số lượng 1, Thành tiền 100000₫, Tổng cộng 100000₫, không còn thông báo giỏ trống. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug<br>[evidence FR07-BVA-002](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_detail_before_add.png) |
| **Status** | **Failed** |

##### FR07-BVA-003 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-003</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 0, "clicks": 1}</code>; d=0 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=0<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống từ chối/chặn thao tác thêm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '0' was not added; cart remains empty<br>[evidence FR07-BVA-003](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-003_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-BVA-004 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q, FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-004</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": 2, "clicks": 1}</code>; d=2 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=2<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Thêm thành công Sản phẩm A với số lượng 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.<br>[evidence FR07-BVA-004](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-004_detail_before_add.png) |
| **Status** | **Failed** |

##### FR07-BVA-005 — WEB — Vào /product/1

Tầng: WEB; Rule: FR06-Q

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-005</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1)."</code><br>Request thực tế lịch sử: <code>{"productId": 1, "quantityInput": -1, "clicks": 1}</code>; d=-1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập số lượng d=-1<br>3. Bấm Thêm vào giỏ hàng<br>4. Mở /cart |
| **Expected Result** | Hệ thống chặn/từ chối số lượng âm; giỏ hàng giữ nguyên trạng thái rỗng. |
| **Actual Result** | Invalid quantity input '-1' was not added; cart remains empty<br>[evidence FR07-BVA-005](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-005_detail_before_add.png) |
| **Status** | **Passed** |

##### FR07-BVA-006 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-006</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng trên server chỉ có đúng 1 dòng cho A, số lượng gộp thành 2. |
| **Actual Result** | Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]<br>[evidence FR07-BVA-006](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Failed** |

##### FR07-BVA-007 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-007</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng trên server rỗng (r=0). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng có đúng 1 dòng cho A với số lượng q=1. |
| **Actual Result** | Cart contains 1 row with quantity=1<br>[evidence FR07-BVA-007](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Passed** |

##### FR07-BVA-008 — API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}

Tầng: API; Rule: FR07-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-008</code> |
| **Title** | API — POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1} |
| **Preconditions** | User đăng nhập hợp lệ, giỏ hàng đã có A với q=2 (r=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, price=100000)."</code><br>Request thực tế lịch sử: <code>{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}<br>2. GET /api/cart |
| **Expected Result** | Giỏ hàng chỉ có đúng 1 dòng cho A, số lượng gộp thành 3 (2 + 1). |
| **Actual Result** | Cart contains 3 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]<br>[evidence FR07-BVA-008](fr07/evidence/fr07-run01/api/observations.json) |
| **Status** | **Failed** |

##### FR07-BVA-009 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-009</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=1 (r=1). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng chỉ có đúng 1 dòng cho A, số lượng tăng lên 2, Thành tiền 200000₫, Tổng cộng 200000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)<br>[evidence FR07-BVA-009](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png) |
| **Status** | **Failed** |

##### FR07-BVA-010 — WEB — Vào /product/1

Tầng: WEB; Rule: FR07-R02, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-010</code> |
| **Title** | WEB — Vào /product/1 |
| **Preconditions** | Giỏ hàng đang có Sản phẩm A với q=2 (r=2). |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"Sản phẩm A (id=1, p=100000₫)."</code>; d=1 |
| **Test Steps** | 1. Vào /product/1<br>2. Nhập d=1 và bấm Thêm vào giỏ hàng<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng duy trì đúng 1 dòng cho A, số lượng gộp thành 3, Thành tiền 300000₫, Tổng cộng 300000₫. |
| **Actual Result** | Failed merge: Cart created 2 rows instead of 1 row(s) (R02 violation)<br>[evidence FR07-BVA-010](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-016_cart_state.png) |
| **Status** | **Failed** |

##### FR07-BVA-011 — WEB — Thêm A với q=1

Tầng: WEB; Rule: FR07-R01, FR07-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR07-BVA-011</code> |
| **Title** | WEB — Thêm A với q=1 |
| **Preconditions** | Giỏ hàng ban đầu rỗng. |
| **Inputs** | Dữ liệu/thao tác nguồn: <code>"A (100000₫), B (250000₫)."</code>; action/giá trị thao tác theo Test Steps |
| **Test Steps** | 1. Thêm A với q=1<br>2. Thêm B với q=1<br>3. Mở /cart |
| **Expected Result** | Bảng giỏ hàng hiển thị đúng 2 dòng riêng biệt: A (q=1, 100000₫) và B (q=1, 250000₫); Tổng cộng 350000₫. |
| **Actual Result** | Cart correctly maintained 2 row(s)<br>[evidence FR07-BVA-011](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-019_cart_state.png) |
| **Status** | **Passed** |

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

##### FR15-DT-001 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-001</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-001](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-001.json) |
| **Status** | **Passed** |

##### FR15-DT-002 — API — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-002</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-002](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-002.json) |
| **Status** | **Failed** |

##### FR15-DT-003 — API — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-003</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-003](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-003.json) |
| **Status** | **Passed** |

##### FR15-DT-004 — API — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-004</code> |
| **Title** | API — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-004](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-004.json) |
| **Status** | **Passed** |

##### FR15-DT-005 — API — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-005</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-005](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-005.json) |
| **Status** | **Passed** |

##### FR15-DT-006 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-006</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-006](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-006.json) |
| **Status** | **Passed** |

##### FR15-DT-007 — API — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-007</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-007](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-007.json) |
| **Status** | **Failed** |

##### FR15-DT-008 — API — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-008</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-008](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-008.json) |
| **Status** | **Failed** |

##### FR15-DT-009 — API — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-009</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-009](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-009.json) |
| **Status** | **Failed** |

##### FR15-DT-010 — API — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-010</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-010](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-010.json) |
| **Status** | **Passed** |

##### FR15-DT-011 — API — Thêm sản phẩm, tên L=254, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-011</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-011](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-011.json) |
| **Status** | **Passed** |

##### FR15-DT-012 — API — Thêm sản phẩm, tên L=255, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-012</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-012](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-012.json) |
| **Status** | **Passed** |

##### FR15-DT-013 — API — Thêm sản phẩm, tên L=256, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-013</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-013](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-013.json) |
| **Status** | **Failed** |

##### FR15-DT-014 — API — Thêm sản phẩm, tên L=1, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-014</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-014](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-014.json) |
| **Status** | **Failed** |

##### FR15-DT-015 — API — Thêm sản phẩm, tên L=1, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-015</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-015](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-015.json) |
| **Status** | **Failed** |

##### FR15-DT-016 — API — Thêm sản phẩm, tên L=1, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-016</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-016](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-016.json) |
| **Status** | **Passed** |

##### FR15-DT-017 — API — Thêm sản phẩm, tên L=255, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-017</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-017](fr15/evidence/fr15-run03/api/observations.json)< >[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-017.json) |
| **Status** | **Failed** |

##### FR15-DT-018 — API — Thêm sản phẩm, tên L=255, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-018</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-018](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-018.json) |
| **Status** | **Failed** |

##### FR15-DT-019 — API — Thêm sản phẩm, tên L=0, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-019</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-019](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-019.json) |
| **Status** | **Failed** |

##### FR15-DT-020 — API — Thêm sản phẩm, tên L=256, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-020</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-020](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-020.json) |
| **Status** | **Failed** |

##### FR15-DT-021 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-021</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-021](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-021.json) |
| **Status** | **Passed** |

##### FR15-DT-022 — API — Thêm sản phẩm, tên L=128, giá="", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-022</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-022](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-022.json) |
| **Status** | **Failed** |

##### FR15-DT-023 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-023</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 15}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Category absent member 15, not an ordered ID boundary"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-023](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-023.json) |
| **Status** | **Failed** |

##### FR15-DT-024 — API — Thêm sản phẩm, tên L=128, giá="abc", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-024</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá="abc", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "abc", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price non-numeric string"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-024](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-024.json) |
| **Status** | **Failed** |

##### FR15-DT-025 — API — Thêm sản phẩm, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-025</code> |
| **Title** | API — Thêm sản phẩm, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required name omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-025](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-025.json) |
| **Status** | **Failed** |

##### FR15-DT-026 — API — Thêm sản phẩm, tên null, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-026</code> |
| **Title** | API — Thêm sản phẩm, tên null, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": null, "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required name null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-026](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-026.json) |
| **Status** | **Failed** |

##### FR15-DT-027 — API — Thêm sản phẩm, tên L=128, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-027</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-027](fr15/evidence/fr15-run03/api/observations.json) [ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-027.json) |
| **Status** | **Failed** |

##### FR15-DT-028 — API — Thêm sản phẩm, tên L=128, giá=null, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-028</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=null, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": null, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-028](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-028.json) |
| **Status** | **Failed** |

##### FR15-DT-029 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-029</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-029](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-029.json) |
| **Status** | **Failed** |

##### FR15-DT-030 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-030</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": null}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-030](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-030.json) |
| **Status** | **Failed** |

##### FR15-DT-031 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-031</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": ""}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required category_id empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-031](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-031.json) |
| **Status** | **Failed** |

##### FR15-DT-032 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-032</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-032](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-035.json) |
| **Status** | **Passed** |

##### FR15-DT-033 — API — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-033</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-033](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-036.json) |
| **Status** | **Failed** |

##### FR15-DT-034 — API — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-034</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-034](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-037.json) |
| **Status** | **Passed** |

##### FR15-DT-035 — API — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-035</code> |
| **Title** | API — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-035](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-038.json) |
| **Status** | **Passed** |

##### FR15-DT-036 — API — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-036</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-036](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-039.json) |
| **Status** | **Passed** |

##### FR15-DT-037 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-037</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-037](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-040.json) |
| **Status** | **Passed** |

##### FR15-DT-038 — API — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-038</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-038](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-041.json) |
| **Status** | **Failed** |

##### FR15-DT-039 — API — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-039</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-039](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-042.json) |
| **Status** | **Failed** |

##### FR15-DT-040 — API — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-040</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-040](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-043.json) |
| **Status** | **Failed** |

##### FR15-DT-041 — API — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-041</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-041](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-044.json) |
| **Status** | **Passed** |

##### FR15-DT-042 — API — Sửa sản phẩm, tên L=254, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-042</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-042](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-045.json) |
| **Status** | **Passed** |

##### FR15-DT-043 — API — Sửa sản phẩm, tên L=255, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-043</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-043](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-046.json) |
| **Status** | **Passed** |

##### FR15-DT-044 — API — Sửa sản phẩm, tên L=256, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-044</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-044](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-047.json) |
| **Status** | **Failed** |

##### FR15-DT-045 — API — Sửa sản phẩm, tên L=1, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-045</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-045](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-048.json) |
| **Status** | **Failed** |

##### FR15-DT-046 — API — Sửa sản phẩm, tên L=1, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-046</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-046](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-049.json) |
| **Status** | **Failed** |

##### FR15-DT-047 — API — Sửa sản phẩm, tên L=1, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-047</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-047](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-050.json) |
| **Status** | **Passed** |

##### FR15-DT-048 — API — Sửa sản phẩm, tên L=255, giá=-1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-048</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-048](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-051.json) |
| **Status** | **Failed** |

##### FR15-DT-049 — API — Sửa sản phẩm, tên L=255, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-049</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-049](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-052.json) |
| **Status** | **Failed** |

##### FR15-DT-050 — API — Sửa sản phẩm, tên L=0, giá=1, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-050</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-050](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-053.json) |
| **Status** | **Failed** |

##### FR15-DT-051 — API — Sửa sản phẩm, tên L=256, giá=0, target=101

Tầng: API; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-051</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-051](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-054.json) |
| **Status** | **Failed** |

##### FR15-DT-052 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-052</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-052](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-055.json) |
| **Status** | **Passed** |

##### FR15-DT-053 — API — Sửa sản phẩm, tên L=128, giá="", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-053</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-053](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-056.json) |
| **Status** | **Failed** |

##### FR15-DT-054 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-054</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 15}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Category absent member 15, not an ordered ID boundary"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-054](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-057.json) |
| **Status** | **Failed** |

##### FR15-DT-055 — API — Sửa sản phẩm, tên L=128, giá="abc", target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-055</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá="abc", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "abc", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price non-numeric string"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-055](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-058.json) |
| **Status** | **Failed** |

##### FR15-DT-056 — API — Sửa sản phẩm, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-056</code> |
| **Title** | API — Sửa sản phẩm, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required name omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-056](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-059.json) |
| **Status** | **Failed** |

##### FR15-DT-057 — API — Sửa sản phẩm, tên null, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-057</code> |
| **Title** | API — Sửa sản phẩm, tên null, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": null, "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required name null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-057](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-060.json) |
| **Status** | **Failed** |

##### FR15-DT-058 — API — Sửa sản phẩm, tên L=128, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-058</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-058](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-061.json) |
| **Status** | **Failed** |

##### FR15-DT-059 — API — Sửa sản phẩm, tên L=128, giá=null, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-059</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=null, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": null, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-059](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-062.json) |
| **Status** | **Failed** |

##### FR15-DT-060 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-060</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id omitted"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-060](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-063.json) |
| **Status** | **Failed** |

##### FR15-DT-061 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-061</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": null}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id null"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-061](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-064.json) |
| **Status** | **Failed** |

##### FR15-DT-062 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-062</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": ""}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required category_id empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-062](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-065.json) |
| **Status** | **Failed** |

##### FR15-DT-063 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R01

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-063</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-063](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-069_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-064 — WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-064</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-064](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-070_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-065 — WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-065</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-065](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-071_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-066 — WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-066</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-066](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-072_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-067 — WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-067</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-067](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-073_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-068 — WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-068</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-068](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-074_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-069 — WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-069</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-069](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-070 — WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-070</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-070](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-071 — WEB — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-071</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-071](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-077_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-072 — WEB — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-072</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-072](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-078_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-073 — WEB — Thêm sản phẩm, tên L=254, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-073</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-073](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-079_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-074 — WEB — Thêm sản phẩm, tên L=255, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-074</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-074](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-080_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-075 — WEB — Thêm sản phẩm, tên L=256, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-075</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-075](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-081_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-076 — WEB — Thêm sản phẩm, tên L=1, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-076</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-076](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-082_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-077 — WEB — Thêm sản phẩm, tên L=1, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-077</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-077](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-083_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-078 — WEB — Thêm sản phẩm, tên L=1, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-078</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-078](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-084_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-079 — WEB — Thêm sản phẩm, tên L=255, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-079</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-079](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-085_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-080 — WEB — Thêm sản phẩm, tên L=255, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-080</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-080](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-086_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-081 — WEB — Thêm sản phẩm, tên L=0, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-081</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-081](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-087_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-082 — WEB — Thêm sản phẩm, tên L=256, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-082</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-082](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-088_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-083 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-083</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "20"}</code><br>[evidence FR15-DT-083](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-089_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-084 — WEB — Thêm sản phẩm, tên L=128, giá="", target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-084</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "", "category_id": "10"}</code><br>[evidence FR15-DT-084](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-090_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-085 — WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-085</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Interior / valid nominal CRUD"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-085](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-092_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-086 — WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-086</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-086](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-093_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-087 — WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-087</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-087](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-094_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-088 — WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-088</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-088](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-095_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-089 — WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-089</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-089](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-096_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-090 — WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-090</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-090](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-097_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-091 — WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-091</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-091](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-098_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-092 — WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-092</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-092](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-099_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-093 — WEB — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-093</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-093](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-100_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-094 — WEB — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-094</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-094](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-101_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-095 — WEB — Sửa sản phẩm, tên L=254, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-095</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=254,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-095](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-102_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-096 — WEB — Sửa sản phẩm, tên L=255, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-096</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=255,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-096](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-103_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-097 — WEB — Sửa sản phẩm, tên L=256, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-097</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-097](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-104_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-098 — WEB — Sửa sản phẩm, tên L=1, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-098</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-098](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-105_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-099 — WEB — Sửa sản phẩm, tên L=1, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-099</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=1,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-099](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-106_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-100 — WEB — Sửa sản phẩm, tên L=1, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-100</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Separated surface/corner L=1,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-100](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-107_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-101 — WEB — Sửa sản phẩm, tên L=255, giá=-1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-101</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=-1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-DT-101](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-108_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-102 — WEB — Sửa sản phẩm, tên L=255, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-102</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=255,p=0; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-102](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-109_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-103 — WEB — Sửa sản phẩm, tên L=0, giá=1, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-103</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=0,p=1; evaluate both predicates"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "1", "category_id": "10"}</code><br>[evidence FR15-DT-103](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-110_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-104 — WEB — Sửa sản phẩm, tên L=256, giá=0, target=101

Tầng: WEB; Rule: FR15-R05, FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-104</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "0", "category_id": "10"}</code><br>[evidence FR15-DT-104](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-111_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-105 — WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-105</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Category second existing member 20"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": "20"}</code><br>[evidence FR15-DT-105](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-112_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-106 — WEB — Sửa sản phẩm, tên L=128, giá="", target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-106</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá="", target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": "", "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Required price empty"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "", "category_id": "10"}</code><br>[evidence FR15-DT-106](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-113_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-107 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-107</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-products theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in empty-products"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": [], "failures": [], "beforeCount": 0, "afterCount": 0}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-107](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-115.json) |
| **Status** | **Passed** |

##### FR15-DT-108 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-108</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in baseline"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": [{"id": 101, "name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, {"id": 202, "name": "Product B", "price": 200000, "description": "Description B", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, {"id": 303, "name": "Product C", "price": 300000, "description": "Description C", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}], "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-108](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-116.json) |
| **Status** | **Passed** |

##### FR15-DT-109 — API — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-109</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read detail target 101"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"id": 101, "name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-109](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-117.json) |
| **Status** | **Passed** |

##### FR15-DT-110 — API — Xem sản phẩm, tên L=128, giá=100000, target=202

Tầng: API; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-110</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/202 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read detail target 202"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"id": 202, "name": "Product B", "price": "200000", "description": "Description B", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-110](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-118.json) |
| **Status** | **Passed** |

##### FR15-DT-111 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-111</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in baseline; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 3, "afterCount": 2}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-111](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-119.json) |
| **Status** | **Passed** |

##### FR15-DT-112 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-112</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot single-product theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in single-product; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 1, "afterCount": 0}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-112](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-120.json) |
| **Status** | **Passed** |

##### FR15-DT-113 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-113</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field name; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-113](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-121.json) |
| **Status** | **Passed** |

##### FR15-DT-114 — API — Sửa sản phẩm, tên L=9, giá=123456, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-114</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=123456, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 123456, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field price; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-114](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-122.json) |
| **Status** | **Passed** |

##### FR15-DT-115 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-115</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Changed description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field description; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-115](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-123.json) |
| **Status** | **Passed** |

##### FR15-DT-116 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-116</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=#changed", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field imageUrl; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-116](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-124.json) |
| **Status** | **Passed** |

##### FR15-DT-117 — API — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-117</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field category_id; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-117](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-125.json) |
| **Status** | **Passed** |

##### FR15-DT-118 — API — Sửa sản phẩm, tên L=9, giá=100000, target=202

Tầng: API; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-118</code> |
| **Title** | API — Sửa sản phẩm, tên L=9, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed B", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/202 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update target B (202), contrast A/C"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[202]</code><br>[evidence FR15-DT-118](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-126.json) |
| **Status** | **Passed** |

##### FR15-DT-119 — WEB — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-119</code> |
| **Title** | WEB — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-products theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xem với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in empty-products"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 0, "afterCount": 0, "mutationCount": 0, "htmlBlocked": false, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>[evidence FR15-DT-119](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-127_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-120 — WEB — Xem sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-120</code> |
| **Title** | WEB — Xem sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "list"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xem với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Trả đúng danh sách/chi tiết theo fixture; không làm thay đổi dữ liệu.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Read", "description": "Read list in baseline"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": false, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>[evidence FR15-DT-120](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-128_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-121 — WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-121</code> |
| **Title** | WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xóa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in baseline; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 2, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product deleted"}}}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>[evidence FR15-DT-121](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-129_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-122 — WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-122</code> |
| **Title** | WEB — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot single-product theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Xóa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target bị xóa; các sản phẩm còn lại giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Delete", "description": "Delete target 101 in single-product; retain all other IDs"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 1, "afterCount": 0, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product deleted"}}}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>null</code><br>[evidence FR15-DT-122](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-130_immediate.png) |
| **Status** | **Passed** |

##### FR15-DT-123 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-123</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field name; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Renamed A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-123](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-131_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-124 — WEB — Sửa sản phẩm, tên L=9, giá=123456, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-124</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=123456, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 123456, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field price; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "123456", "category_id": "10"}</code><br>[evidence FR15-DT-124](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-132_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-125 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-125</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Changed description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field description; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-125](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-133_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-126 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-126</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=#changed", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field imageUrl; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-126](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-134_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-127 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-127</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Product A", "price": 100000, "description": "Description A", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 20}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update only field category_id; preserve others and all non-targets"}</code>; oracleStatus=<code>derived</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "Product A", "price": "100000", "category_id": "20"}</code><br>[evidence FR15-DT-127](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-135_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-128 — WEB — Sửa sản phẩm, tên L=9, giá=100000, target=202

Tầng: WEB; Rule: FR15-R03, FR15-R08

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-128</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=9, giá=100000, target=202 |
| **Preconditions** | token partition=admin.<br>Target=202 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "Renamed B", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 202, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Update target B (202), contrast A/C"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[202]</code><br>Input thực tế sau nhập UI: <code>{"name": "Renamed B", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-DT-128](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-136_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-129 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-129</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-129](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-137.json) |
| **Status** | **Failed** |

##### FR15-DT-130 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-130</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-130](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-138.json) |
| **Status** | **Failed** |

##### FR15-DT-131 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-131</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-131](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-139.json) |
| **Status** | **Failed** |

##### FR15-DT-132 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-132</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-132](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-140.json) |
| **Status** | **Failed** |

##### FR15-DT-133 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-133</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-133](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-141.json) |
| **Status** | **Failed** |

##### FR15-DT-134 — API — Sửa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-134</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-DT-134](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-142.json) |
| **Status** | **Failed** |

##### FR15-DT-135 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-135</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=none.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized none must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-135](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-143.json) |
| **Status** | **Failed** |

##### FR15-DT-136 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-136</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=invalid.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "invalid", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized invalid must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-136](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-144.json) |
| **Status** | **Failed** |

##### FR15-DT-137 — API — Xóa sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR12-DEP-WRITE

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-137</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | token partition=user.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "user", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Delete", "description": "Unauthorized user must not mutate products"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 2}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[101]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-137](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-145.json) |
| **Status** | **Failed** |

##### FR15-DT-138 — WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: WEB; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-138</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-categories theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "No categories: reject creation despite valid name/price"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 0, "afterCount": 1, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 1}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[1]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "100000", "category_id": ""}</code><br>[evidence FR15-DT-138](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-146_immediate.png) |
| **Status** | **Failed** |

##### FR15-DT-139 — API — Thêm sản phẩm, tên L=128, giá=100000, target=101

Tầng: API; Rule: FR15-R07

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-DT-139</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=100000, target=101 |
| **Preconditions** | Reset snapshot empty-categories theo FR15-F trước case; token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "No categories: category 10 is not an existing member"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 1}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 0, "afterCount": 1}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[1]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-DT-139](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-147.json) |
| **Status** | **Failed** |

#### 2.4. Các probe Supplementary đi kèm — 11 case, không cộng coverage DT/BVA

Các case này giữ nhãn gốc Supplementary; có thể có oracle derived hoặc unresolved. Blocked do thiếu oracle vẫn có actual observation, không mặc định là chưa thao tác.

##### FR15-SUP-001 — API — Thêm sản phẩm, tên L=128, giá=0.5, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-001</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-001](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-032.json) |
| **Status** | **Passed** |

##### FR15-SUP-002 — API — Thêm sản phẩm, tên L=3, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-002</code> |
| **Title** | API — Thêm sản phẩm, tên L=3, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "   ", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Create", "description": "Whitespace name characterization; trim undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-002](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-033.json) |
| **Status** | **Blocked** |

##### FR15-SUP-003 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-003</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("😀",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Create", "description": "Unicode emoji name characterization; length unit undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-003](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-034.json) |
| **Status** | **Blocked** |

##### FR15-SUP-004 — API — Sửa sản phẩm, tên L=128, giá=0.5, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-004</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-SUP-004](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-066.json) |
| **Status** | **Passed** |

##### FR15-SUP-005 — API — Sửa sản phẩm, tên L=3, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-005</code> |
| **Title** | API — Sửa sản phẩm, tên L=3, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "   ", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Whitespace name characterization; trim undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-SUP-005](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-067.json) |
| **Status** | **Blocked** |

##### FR15-SUP-006 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-006</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("😀",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Unicode emoji name characterization; length unit undefined"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-SUP-006](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-068.json) |
| **Status** | **Blocked** |

##### FR15-SUP-007 — WEB — Thêm sản phẩm, tên L=128, giá=0.5, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-007</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0.5", "category_id": "10"}</code><br>[evidence FR15-SUP-007](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-091_immediate.png) |
| **Status** | **Passed** |

##### FR15-SUP-008 — WEB — Sửa sản phẩm, tên L=128, giá=0.5, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-008</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0.5, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0.5, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Representable positive price 0.5 satisfies numeric &gt;0; adjacency precision remains unresolved"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0.5", "category_id": "10"}</code><br>[evidence FR15-SUP-008](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-114_immediate.png) |
| **Status** | **Failed** |

##### FR15-SUP-009 — API — Xem sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R02

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-009</code> |
| **Title** | API — Xem sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "detail"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; GET /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Read", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-009](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-148.json) |
| **Status** | **Blocked** |

##### FR15-SUP-010 — API — Sửa sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R03

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-010</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Update", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-010](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-149.json) |
| **Status** | **Blocked** |

##### FR15-SUP-011 — API — Xóa sản phẩm, tên L=128, giá=100000, target=999999

Tầng: API; Rule: FR15-R04

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-SUP-011</code> |
| **Title** | API — Xóa sản phẩm, tên L=128, giá=100000, target=999999 |
| **Preconditions** | token partition=admin.<br>Target=999999 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 999999, "auth": "admin", "mode": "delete"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; DELETE /api/products/999999 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chưa có oracle đủ để kết luận Pass/Fail; ghi nhận hành vi và bảo toàn trạng thái để review.<br>Oracle nguồn: <code>{"outcome": "observe", "stateContract": "Delete", "description": "Missing target characterization; exact response not specified"}</code>; oracleStatus=<code>unresolved</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product deleted"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Giới hạn oracle: oracle-unresolved<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-SUP-011](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-150.json) |
| **Status** | **Blocked** |

### 3. BVA

#### 3.1. Phân hoạch và endpoint lịch sử

| Chiều | Các partition | Endpoints |
|---|---|---|
| Tên L thuộc N₀ | {0} invalid; [1,255] valid; [256,+∞) invalid | 0,1,255,256 |
| Giá p thuộc Z | (-∞,0] invalid; [1,+∞) valid trên slice Z | 0,1 |

#### 3.2. Sinh điểm trước, rồi hợp tập

- Tên: endpoint 0 → {0,1}; 1 → {0,1,2}; 255 → {254,255,256}; 256 → {255,256,257}. Union={0,1,2,254,255,256,257}, có 7 điểm. Loại L=-1 vì không thể có độ dài âm.
- Giá nguyên: endpoint 0 → {-1,0,1}; 1 → {0,1,2}. Union={-1,0,1,2}, có 4 điểm: 1/2 chấp nhận, -1/0 từ chối. ±1 không phải closest-neighbor đã biết của toàn miền giá thực.
- (7+4) điểm × 2 thao tác Create/Update × 2 tầng API/WEB = 44 nghĩa vụ trong registry. Đây không phải công thức 4n+1 hoặc 6n+1, cũng không phải toàn bộ không gian input.

#### 3.3. Test report BVA

##### FR15-BVA-001 — API — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-001</code> |
| **Title** | API — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-001](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-002.json) |
| **Status** | **Failed** |

##### FR15-BVA-002 — API — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-002</code> |
| **Title** | API — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-002](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-003.json) |
| **Status** | **Passed** |

##### FR15-BVA-003 — API — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-003</code> |
| **Title** | API — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-003](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-004.json) |
| **Status** | **Passed** |

##### FR15-BVA-004 — API — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-004</code> |
| **Title** | API — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-004](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-005.json) |
| **Status** | **Passed** |

##### FR15-BVA-005 — API — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-005</code> |
| **Title** | API — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-005](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-006.json) |
| **Status** | **Passed** |

##### FR15-BVA-006 — API — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-006</code> |
| **Title** | API — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-006](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-007.json) |
| **Status** | **Failed** |

##### FR15-BVA-007 — API — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-007</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-007](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-008.json) |
| **Status** | **Failed** |

##### FR15-BVA-008 — API — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-008</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-008](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-009.json) |
| **Status** | **Failed** |

##### FR15-BVA-009 — API — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-009</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-009](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-010.json) |
| **Status** | **Passed** |

##### FR15-BVA-010 — API — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-010</code> |
| **Title** | API — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-010](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-036.json) |
| **Status** | **Failed** |

##### FR15-BVA-011 — API — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-011</code> |
| **Title** | API — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-011](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-037.json) |
| **Status** | **Passed** |

##### FR15-BVA-012 — API — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-012</code> |
| **Title** | API — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-012](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-038.json) |
| **Status** | **Passed** |

##### FR15-BVA-013 — API — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-013</code> |
| **Title** | API — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-013](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-039.json) |
| **Status** | **Passed** |

##### FR15-BVA-014 — API — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-014</code> |
| **Title** | API — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-014](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-040.json) |
| **Status** | **Passed** |

##### FR15-BVA-015 — API — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-015</code> |
| **Title** | API — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-015](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-041.json) |
| **Status** | **Failed** |

##### FR15-BVA-016 — API — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-016</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-016](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-042.json) |
| **Status** | **Failed** |

##### FR15-BVA-017 — API — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-017</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-017](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-043.json) |
| **Status** | **Failed** |

##### FR15-BVA-018 — API — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-018</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-018](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-044.json) |
| **Status** | **Passed** |

##### FR15-BVA-019 — WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-019</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-019](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-070_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-020 — WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-020</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-020](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-071_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-021 — WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-021</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-021](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-072_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-022 — WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-022</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-022](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-073_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-023 — WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-023</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-023](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-074_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-024 — WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-024</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-024](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-025 — WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-025</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-BVA-025](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-026 — WEB — Thêm sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-026</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>[evidence FR15-BVA-026](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-077_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-027 — WEB — Thêm sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-027</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>[evidence FR15-BVA-027](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-078_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-028 — WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-028</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=0, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=0; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 3, "mutationCount": 0, "htmlBlocked": true, "response": null}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": "", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-028](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-093_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-029 — WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-029</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=1, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "A", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=1; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "A", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-029](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-094_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-030 — WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-030</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=2, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": "AA", "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=2; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": "AA", "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-030](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-095_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-031 — WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-031</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=254, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",254), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=254; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",254), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-031](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-096_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-032 — WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-032</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=255, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",255), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Name single-boundary L=255; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",255), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-032](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-097_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-033 — WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-033</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=256, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Name single-boundary L=256; hold price/category/auth valid"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",256), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-033](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-098_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-034 — WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-034</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=-1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=-1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "-1", "category_id": "10"}</code><br>[evidence FR15-BVA-034](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-099_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-035 — WEB — Sửa sản phẩm, tên L=128, giá=0, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-035</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=0, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 0, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "Price boundary p=0; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "0", "category_id": "10"}</code><br>[evidence FR15-BVA-035](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-100_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-036 — WEB — Sửa sản phẩm, tên L=128, giá=1, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-036</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=1, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "Price boundary p=1; strict zero excludes equality"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "1", "category_id": "10"}</code><br>[evidence FR15-BVA-036](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-101_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-037 — API — Thêm sản phẩm, tên L=257, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-037</code> |
| **Title** | API — Thêm sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-037](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-151.json) |
| **Status** | **Failed** |

##### FR15-BVA-038 — API — Thêm sản phẩm, tên L=128, giá=2, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-038</code> |
| **Title** | API — Thêm sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; POST /api/products với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": [], "beforeCount": 3, "afterCount": 4}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>[evidence FR15-BVA-038](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-152.json) |
| **Status** | **Passed** |

##### FR15-BVA-039 — API — Sửa sản phẩm, tên L=257, giá=100000, target=101

Tầng: API; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-039</code> |
| **Title** | API — Sửa sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 3}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-039](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-153.json) |
| **Status** | **Failed** |

##### FR15-BVA-040 — API — Sửa sản phẩm, tên L=128, giá=2, target=101

Tầng: API; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-040</code> |
| **Title** | API — Sửa sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; PUT /api/products/101 với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"http": 200, "body": {"message": "Product updated"}, "failures": [], "beforeCount": 3, "afterCount": 3}</code><br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>[evidence FR15-BVA-040](fr15/evidence/fr15-run03/api/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-154.json) |
| **Status** | **Passed** |

##### FR15-BVA-041 — WEB — Thêm sản phẩm, tên L=257, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-041</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Create", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",257), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-041](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-155_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-042 — WEB — Thêm sản phẩm, tên L=128, giá=2, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-042</code> |
| **Title** | WEB — Thêm sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Thêm đúng một sản phẩm, đọc lại đúng payload; mọi sản phẩm cũ giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Create", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": [], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}</code><br>Snapshot: thêm IDs=<code>[304]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "2", "category_id": "10"}</code><br>[evidence FR15-BVA-042](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-156_immediate.png) |
| **Status** | **Passed** |

##### FR15-BVA-043 — WEB — Sửa sản phẩm, tên L=257, giá=100000, target=101

Tầng: WEB; Rule: FR15-R05

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-043</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=257, giá=100000, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",257), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.<br>Oracle nguồn: <code>{"outcome": "reject", "stateContract": "Update", "description": "ISTQB 3-value name=257; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: Dữ liệu thay đổi dù input phải bị từ chối<br>Assertion: Không có tín hiệu từ chối phù hợp<br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Assertion: UI sau reload không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",257), "price": "100000", "category_id": "10"}</code><br>[evidence FR15-BVA-043](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-157_immediate.png) |
| **Status** | **Failed** |

##### FR15-BVA-044 — WEB — Sửa sản phẩm, tên L=128, giá=2, target=101

Tầng: WEB; Rule: FR15-R06

| Trường | Nội dung |
|---|---|
| **Test Case ID** | <code>FR15-BVA-044</code> |
| **Title** | WEB — Sửa sản phẩm, tên L=128, giá=2, target=101 |
| **Preconditions** | token partition=admin.<br>Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau. |
| **Inputs** | Input dự định: <code>{"body": {"name": repeat("A",128), "price": 2, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}</code> |
| **Test Steps** | 1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.<br>2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.<br>3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.<br>4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate. |
| **Expected Result** | Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.<br>Oracle nguồn: <code>{"outcome": "accept", "stateContract": "Update", "description": "ISTQB 3-value price=2; other inputs nominal"}</code>; oracleStatus=<code>confirmed</code> |
| **Actual Result** | Quan sát: <code>{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}</code><br>Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng<br>Snapshot: thêm IDs=<code>[]</code>; xóa IDs=<code>[]</code>; sửa IDs=<code>[101]</code><br>Input thực tế sau nhập UI: <code>{"name": repeat("A",128), "price": "2", "category_id": "10"}</code><br>[evidence FR15-BVA-044](fr15/evidence/fr15-run03/web/observations.json)<br>[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-158_immediate.png) |
| **Status** | **Failed** |

---
