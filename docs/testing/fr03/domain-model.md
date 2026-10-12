# Mô hình Kiểm thử Miền (Domain Testing Model) - FR-03

## 1. Cơ sở Lý thuyết và Quy ước Kiểm thử Miền (Domain Testing Convention)

### 1.1 Quy ước Phương pháp luận
Báo cáo này áp dụng phương pháp **Kiểm thử Miền (Domain Testing)** theo quy ước chuẩn kỹ thuật tại [.agents/skills/domain-testing/SKILL.md](file:///.agents/skills/domain-testing/SKILL.md):
- Chuyển hóa các quy tắc nghiệp vụ thành các vị từ toán học với toán tử chính xác (nghiêm ngặt $\ge, =, \in$).
- Xác định miền chấp nhận hợp lệ (Valid Acceptance Region) và phần bù không hợp lệ (Invalid Region).
- Định nghĩa các biên quyết định (Decision Boundaries / Equality Surfaces).
- Lấy mẫu các điểm kiểm thử có chủ đích:
  - **Điểm trên biên (On point):** Nằm trực tiếp trên bề mặt phương trình biên.
  - **Điểm ngoài biên liền kề (Off point):** Nằm lệch khỏi biên đúng 1 bước phân giải tối thiểu (1 ký tự ASCII) về phía đối diện.
  - **Điểm trong miền (In point / Interior control):** Nằm sâu bên trong miền hợp lệ để làm đối chứng.
- Cô lập từng lỗi đơn lẻ (Single-fault isolation): Khi kiểm thử một biên, tất cả các vị từ khác phải được giữ ở trạng thái thỏa mãn (True).

---

## 2. Thiết lập Dữ liệu Môi trường Chuẩn (Reference Fixtures)

Để đảm bảo tính độc lập và tái lập được kết quả, toàn bộ các ca kiểm thử sử dụng cấu hình dữ liệu chuẩn sau:

- **Tài khoản A (Người dùng chính):**
  - Email: `fr03-a@example.com`
  - Mật khẩu hiện tại: `OldPass1!`
  - Trạng thái: Hoạt động, `login_attempts = 0`, `locked_until = NULL`.
  - Mã OTP hợp đồng (Contract Seeded Token): `123456`.
- **Tài khoản B (Người dùng thứ hai - Kiểm tra ràng buộc sở hữu):**
  - Email: `fr03-b@example.com`
  - Mật khẩu hiện tại: `OldPass1!`
  - Trạng thái: Hoạt động, `login_attempts = 0`, `locked_until = NULL`.
  - Mã OTP hợp đồng (Contract Seeded Token): `654321`.
- **Tài khoản C (Tài khoản không tồn tại):**
  - Email: `fr03-missing@example.com` (không có trong cơ sở dữ liệu).
- **Mật khẩu mới chuẩn (Nominal Strong Password):** `Abcdef1!` (độ dài 8, có 1 hoa `A`, 5 thường `bcdef`, 1 số `1`, 1 ký tự đặc biệt `!`).
- **Mật khẩu mới đối chứng thứ hai:** `Zyxwvu2&` (độ dài 8, có 1 hoa `Z`, 5 thường `yxwvu`, 1 số `2`, 1 ký tự đặc biệt `&`).

---

## 3. Không gian Miền, Biên và Lựa chọn Điểm (Boundaries & Points Derivation)

### 3.1 Biên Độ dài Mật khẩu mới: $L(p) \iff \text{length}(p) \ge 8$
- **Bề mặt biên:** $\text{length}(p) = 8$. Toán tử $\ge$ là bao gồm (inclusive), nên biên nằm trong miền hợp lệ.
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
Mối quan hệ tương đương giữa 2 chuỗi là một bề mặt siêu phẳng đối xứng $p = c$.
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
- **Phân vùng hình thức $F(token)$ (OTP Shape):**
  - Chiều dài 5 số: `12345` $\implies$ Từ chối.
  - Chiều dài 7 số: `1234567` $\implies$ Từ chối.
  - Chiều dài 6 ký tự nhưng có chữ cái: `12345x` $\implies$ Từ chối.
  - Chiều dài 6 số đúng hình thức nhưng không khớp mã được cấp: `234567` $\implies$ Từ chối.
- **Phân vùng ràng buộc sở hữu $B(email, token)$ (Token Binding):**
  - Gửi mã của tài khoản A (`123456`) cho tài khoản B $\implies$ Từ chối; mật khẩu cả A và B không đổi.
  - Gửi mã của tài khoản B (`654321`) cho tài khoản A $\implies$ Từ chối; mật khẩu cả A và B không đổi.
- **Tương tác đa biến (Multi-rule interaction):**
  - Gửi token chéo email kèm mật khẩu thiếu ký tự đặc biệt $\implies$ Từ chối; kiểm tra hệ thống từ chối an toàn khi gặp đồng thời nhiều lỗi.

---

## 4. Bảng Vị từ và Véctơ Chân trị (Truth Vectors Summary)

| Họ Ca kiểm thử | $E$ | $F$ | $B$ | $L$ | $U$ | $D$ | $N$ | $S$ | $C$ | $P_c$ | Kỳ vọng Kết quả |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| Yêu cầu OTP email tồn tại | T | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Thành công, sinh OTP 6 số |
| Yêu cầu OTP email không tồn tại | F | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Từ chối |
| Đặt lại MK - Hợp lệ danh định | T | T | T | T | T | T | T | T | T | T | Thành công, đổi MK |
| Đặt lại MK - Độ dài 7 (Off point) | T | T | T | **F** | T | T | T | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Thiếu chữ hoa | T | T | T | T | **F** | T | T | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Thiếu chữ thường | T | T | T | T | T | **F** | T | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Thiếu chữ số | T | T | T | T | T | T | **F** | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Thiếu ký tự đặc biệt | T | T | T | T | T | T | T | **F** | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Ký tự cách (Space) | T | T | T | T | T | T | T | **F** | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - OTP sai độ dài/ký tự | T | **F** | F | T | T | T | T | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - OTP không khớp sở hữu | T | T | **F** | T | T | T | T | T | T | T | Từ chối, giữ nguyên MK |
| Đặt lại MK - Không khớp xác nhận (UI)| T | T | T | T | T | T | T | T | **F** | T | Từ chối trên UI |
| Đặt lại MK - Thiếu trường xác nhận (UI)| T | T | T | T | T | T | T | T | N/A | **F** | Lỗi yêu cầu (Missing control)|
