# Phân tích Yêu cầu Kỹ thuật FR-03: Quên Mật khẩu & Đặt lại Mật khẩu

## 1. Test Basis & Scope

### 1.1 Test Basis
1. **README.md (dòng 46–60):** Đặc tả chức năng FR-03 (Quên mật khẩu & Đặt lại mật khẩu 2 bước).
2. **README.md (dòng 34–35):** Quy tắc độ mạnh mật khẩu kế thừa từ FR-01.
3. **api_specification.md (dòng 34–54):** Giao diện API (`POST /api/forgot-password` và `POST /api/reset-password`).
4. **docs/2026.HW02.Domain Testing_En.pdf:** Hướng dẫn thực hành bài tập lớn môn Kiểm thử phần mềm (mục 6, 9, 12).
5. **Quy chuẩn kỹ thuật (.agents/skills):**
   - [.agents/skills/domain-testing/SKILL.md](../../../.agents/skills/domain-testing/SKILL.md): Quy ước phân tích miền (Domain Testing) on/off/in/out.
   - [.agents/skills/boundary-value-analysis/SKILL.md](../../../.agents/skills/boundary-value-analysis/SKILL.md): Hướng dẫn chọn biến thể BVA theo slide; xem Standard và Robustness trong bva-report.md.

6. **Slide được cung cấp ngày 2026-10-17:** [KCPM Bài 4](references/KCPM-Bai4-EP-BVA.pdf), trang 6–18 (EP), 19–26 (BVA). Nguồn này thay thế quy ước ISTQB tạm thời cho BVA môn học.

### 1.2 Methodology Limitations
- Domain Testing on/off/in vẫn là quy ước của skill; slide Bài 4 không xác lập riêng phương pháp domain-surface này. BVA hiện hành chọn Standard + Robustness thích nghi, giải thích đầy đủ ở [bva-report.md](bva-report.md).
- Cả hai phương pháp đều được trình bày tường minh quá trình biến đổi từ yêu cầu sang mô hình vị từ, phân vùng, biên, điểm kiểm thử và tập ca kiểm thử độc lập trước khi tổng hợp.
- Phạm vi kiểm thử: Chức năng FR-03 trên 2 giao diện: **API** (`backend`) và **Giao diện Web khách hàng** (`frontend-web`). Không kiểm thử ứng dụng mobile hay mở rộng sang các tính năng khác.

---

## 2. Traceable Business Rules

Để đảm bảo khả năng truy vết (traceability) xuyên suốt các kỹ thuật kiểm thử, các quy tắc của FR-03 được định danh từ **R01** đến **R09**:

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

---

## 3. Inputs & Predicates

### 3.1 Không gian đầu vào và trạng thái lưu trữ
- **Các biến đầu vào (Inputs):**
  - $email$: Chuỗi ký tự ASCII định danh tài khoản người dùng.
  - $token$ (hoặc $resetToken$): Chuỗi ký tự biểu diễn mã OTP xác thực.
  - $p$ (hoặc $newPassword$): Chuỗi ký tự mật khẩu mới.
  - $c$ (hoặc $confirmPassword$): Chuỗi ký tự xác nhận mật khẩu (chỉ tồn tại trên giao diện Web).
- **Trạng thái lưu trữ (Stored State):**
  - $\text{RegisteredUsers}$: Tập hợp các tài khoản đã đăng ký trong hệ thống kèm mật khẩu hiện tại.
  - $\text{IssuedTokens}$: Ánh xạ $(email \mapsto \text{active\_token})$ lưu mã OTP đang hiệu lực.

### 3.2 Định nghĩa các vị từ đơn lẻ (Atomic Predicates)
Độ phân giải lấy mẫu trên chuỗi là từng ký tự ASCII (resolution = 1 character).

1. **Vị từ đăng ký email:**
   $$E(email) \iff email \in \text{RegisteredUsers}$$
2. **Vị từ định dạng mã OTP:**
   $$F(token) \iff \text{length}(token) = 6 \land \forall i \in [1, 6], token[i] \in \{'0'..'9'\}$$
3. **Vị từ liên kết sở hữu mã OTP:**
   $$B(email, token) \iff \text{IssuedTokens}(email) = token$$
4. **Vị từ độ dài mật khẩu mới:**
   $$L(p) \iff \text{length}(p) \ge 8$$
5. **Vị từ ký tự hoa:**
   $$U(p) \iff \exists c \in p: c \in \{'A'..'Z'\}$$
6. **Vị từ ký tự thường:**
   $$D(p) \iff \exists c \in p: c \in \{'a'..'z'\}$$
7. **Vị từ chữ số:**
   $$N(p) \iff \exists c \in p: c \in \{'0'..'9'\}$$
8. **Vị từ ký tự đặc biệt hợp lệ:**
   $$S(p) \iff \exists c \in p: c \in \{'@', '\$', '!', '\%', '*', '?', '\&'\}$$
9. **Vị từ khớp xác nhận mật khẩu (UI):**
   $$C(p, c) \iff p = c$$
10. **Vị từ hiện diện của trường xác nhận mật khẩu trên UI:**
    $$P_{c} \iff \text{Trường input Confirm Password hiện diện trong form DOM}$$

### 3.3 Vị từ chấp nhận đặt lại mật khẩu tổng hợp (Acceptance Predicates)
- **Điều kiện chấp nhận tại tầng API:**
  $$\Phi_{\text{API}} = E(email) \land F(token) \land B(email, token) \land L(p) \land U(p) \land D(p) \land N(p) \land S(p)$$
- **Điều kiện chấp nhận tại tầng WEB:**
  $$\Phi_{\text{WEB}} = \Phi_{\text{API}} \land P_{c} \land C(p, c)$$

---

## 4. Ambiguity Register

Theo nguyên tắc của SUT, các điểm chưa rõ trong đặc tả không được tự ý giải quyết bằng cách đọc code hiện tại, mà phải được ghi nhận rõ ràng:

1. **Sự vắng mặt của trường xác nhận mật khẩu ở API:**
   - *Ghi nhận:* `api_specification.md` chỉ nhận `{ email, resetToken, newPassword }`, không có trường `confirmPassword`.
   - *Quyết định:* R08 chỉ áp dụng cho kiểm thử giao diện WEB. API không có nghĩa vụ kiểm tra trường này.
2. **Thời hạn hiệu lực của OTP (TTL) và giới hạn số lần nhập sai (Retry Limit):**
   - *Ghi nhận:* Đặc tả không nêu rõ OTP hết hạn sau bao lâu và có bị khóa sau bao nhiêu lần nhập sai mã hay không.
   - *Quyết định:* Không thiết kế các ca kiểm thử assert Pass/Fail về thời gian hết hạn hoặc số lần thử; chỉ kiểm thử tính hợp lệ tức thời của OTP.
3. **Chính sách cấp phát lại (Reissuance) và tiền tố số 0 (Leading Zero):**
   - *Ghi nhận:* Đặc tả chỉ yêu cầu "6 chữ số ngẫu nhiên", không chỉ định OTP có được phép bắt đầu bằng `0` (ví dụ `012345`) hay không.
   - *Quyết định:* Kiểm tra định dạng chuỗi 6 ký tự số nguyên thập phân `^[0-9]{6}$`.
4. **Ký tự đặc biệt ngoài tập hợp quy định:**
   - *Ghi nhận:* Đặc tả yêu cầu ít nhất 1 ký tự thuộc `@, $, !, %, *, ?, &`. Không quy định rõ nếu mật khẩu có thêm ký tự đặc biệt khác (như `#`, `_`) bên cạnh ký tự hợp lệ thì có được chấp nhận hay không.
   - *Quyết định:* Bộ kiểm thử tập trung vào 7 ký tự chuẩn và trường hợp chỉ dùng khoảng trắng làm ký tự đặc biệt để phát hiện lỗi regex.
5. **Độ dài tối đa của mật khẩu:**
   - *Ghi nhận:* Đặc tả chỉ nêu "tối thiểu 8 ký tự", không nêu biên trên (maximum length).
   - *Quyết định:* Không tự bịa ra biên trên (như 32 hay 64); chỉ tập trung kiểm thử phân vùng quanh ngưỡng biên dưới $L(p) \ge 8$.
6. **Mã HTTP status phản hồi khi từ chối:**
   - *Ghi nhận:* Đặc tả không quy định cụ thể mã lỗi (400, 401, 404, hay 422).
   - *Quyết định:* Đánh giá phán quyết (verdict) dựa trên: yêu cầu có bị từ chối hay không, và mật khẩu trong cơ sở dữ liệu có bị thay đổi trái phép hay không (R09).


## 5. Trạng thái tài liệu và giới hạn evidence

[README FR-03](README.md) phân biệt thiết kế theo slide với suite/kết quả lịch sử. Các R01–R09 giữ nguyên; sửa phương pháp không đổi business oracle. R09 được quan sát bằng password A/B trong API log; chưa chứng minh trạng thái mọi tài khoản hay toàn bộ đường UI. R02 có đầu ra OTP cần đúng 6 chữ số; không có giới hạn output số học khác trong đặc tả để áp BVA. Không coi lỗi status/copy chưa được đặc tả là bug chỉ vì không khớp giả định trong harness cũ.
