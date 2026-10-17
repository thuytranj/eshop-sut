# Bug Reports - FR-03

Báo cáo giữ **6 hồ sơ lỗi lịch sử** dựa trên observation/screenshot đã có. Refactor ngày 2026-10-17 không chạy lại SUT và không xác nhận lại môi trường lịch sử. Các lỗi không mất giá trị khi BVA được phân loại lại theo slide; đối chiếu mức bằng chứng trong [test-results.md](test-results.md).

---

### BUG-FR03-01: Backend cấp phát mã OTP 4 chữ số thay vì 6 chữ số ngẫu nhiên

- **Violated Rule(s):** **R02** ([README.md:51](../../../README.md#L51), [api_specification.md:42](../../../api_specification.md#L42))
- **Severity:** Major (Vi phạm đặc tả chuẩn an ninh)
- **Layer:** API & WEB
- **Related Test Cases:** `FR03-TC-001`, `FR03-TC-037`
- **Environment:** Node.js v22.17.1, Express Backend (Port 3000)
- **Steps to Reproduce:**
  1. Gửi HTTP POST tới `http://localhost:3000/api/forgot-password` với body:
     ```json
     { "email": "fr03-a@example.com" }
     ```
  2. Quan sát giá trị `resetToken` trong response body JSON.
- **Expected Result:**
  - Hệ thống sinh và trả về mã OTP gồm đúng 6 chữ số ngẫu nhiên (độ dài 6, định dạng `^[0-9]{6}$`).
- **Actual Result:**
  - Hệ thống trả về mã OTP chỉ gồm 4 chữ số (ví dụ: `"7257"`).
- **Evidence:**
  - API Log: [observations.json](./evidence/api/observations.json) (Case `FR03-TC-001`).
  - UI Screenshot: [FR03-TC-037.png](./evidence/web/screenshots/FR03-TC-037.png) hiển thị OTP `6429` theo observation WEB (khác OTP `7257` trong lượt API).
- **Root Cause Analysis:**
  - Tệp [backend/server.js:72](../../../backend/server.js#L72):
    ```javascript
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    ```
    Hàm sinh số ngẫu nhiên trong khoảng $[1000, 9999]$, dẫn đến độ dài luôn là 4 chữ số thay vì 6 chữ số như yêu cầu.

---

### BUG-FR03-02: Backend API hoàn toàn không kiểm tra độ dài và độ phức tạp của mật khẩu mới

- **Violated Rule(s):** **R06, R07** ([README.md:58](../../../README.md#L58), [README.md:34-35](../../../README.md#L34-L35))
- **Severity:** Critical (Lỗ hổng bảo mật dữ liệu)
- **Layer:** API
- **Related Test Cases:** `FR03-TC-004`, `FR03-TC-007`, `FR03-TC-008`, `FR03-TC-009`, `FR03-TC-010`, `FR03-TC-012`, `FR03-TC-015`, `FR03-TC-017`, `FR03-TC-025`
- **Environment:** Node.js v22.17.1, Express Backend (Port 3000), SQLite
- **Steps to Reproduce:**
  1. Chuẩn bị tài khoản `fr03-a@example.com` có token `123456`.
  2. Gửi HTTP POST tới `http://localhost:3000/api/reset-password` với mật khẩu không hợp lệ (ví dụ: chuỗi rỗng `""`, độ dài 7 `"Abcde1!"`, thiếu chữ hoa `"abcdef1!"`, hoặc chỉ chứa dấu cách `"Abcdef1 "`):
     ```json
     {
       "email": "fr03-a@example.com",
       "resetToken": "123456",
       "newPassword": ""
     }
     ```
  3. Kiểm tra response và dữ liệu trong bảng `users`.
- **Expected Result:**
  - Server phải từ chối và giữ nguyên mật khẩu cũ trong CSDL; mã HTTP lỗi cụ thể chưa được đặc tả.
- **Actual Result:**
  - Server trả về HTTP 200 `{"message": "Password reset successfully"}`. Mật khẩu trong CSDL bị cập nhật thành chuỗi rỗng hoặc mật khẩu không đủ độ mạnh.
- **Evidence:**
  - 9 ca reset với password không hợp lệ bị Failed (TC004, TC007–TC010, TC012, TC015, TC017, TC025); lỗi API thứ 10 là cấp phát OTP tại TC001. Các ca password bị server chấp nhận trái phép, xem [observations.json](./evidence/api/observations.json).
- **Root Cause Analysis:**
  - Tệp [backend/server.js:87-98](../../../backend/server.js#L87-L98):
    ```javascript
    app.post("/api/reset-password", (req, res) => {
      const { email, resetToken, newPassword } = req.body;
      db.run(
        "UPDATE users SET password = ?, reset_token = NULL WHERE email = ? AND reset_token = ?",
        [newPassword, email, resetToken], ...
    ```
    Backend hoàn toàn không có bất kỳ dòng lệnh nào kiểm tra tính hợp lệ của `newPassword` trước khi thực hiện câu lệnh `UPDATE`.

---

### BUG-FR03-03: Giao diện Web thiếu chỉ báo bước (Step Indicator)

- **Violated Rule(s):** **R03** ([README.md:52](../../../README.md#L52))
- **Severity:** Minor (Thiếu sót thành phần UI)
- **Layer:** WEB
- **Related Test Cases:** `FR03-TC-037`
- **Environment:** React/Vite Customer Web (Port 5173), Playwright Chromium Headless
- **Steps to Reproduce:**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Quan sát giao diện tại Bước 1 và sau khi chuyển sang Bước 2.
- **Expected Result:**
  - Giao diện phải hiển thị rõ ràng chỉ báo bước (Step Indicator), ví dụ: "Bước 1 / 2" hoặc "Bước 2 / 2".
- **Actual Result:**
  - Hoàn toàn không có thành phần hiển thị chỉ báo bước nào trong DOM.
- **Evidence:**
  - UI Screenshot: [FR03-TC-037.png](./evidence/web/screenshots/FR03-TC-037.png).
- **Root Cause Analysis:**
  - Tệp [frontend-web/src/pages/ForgotPassword.jsx](../../../frontend-web/src/pages/ForgotPassword.jsx): Quản lý trạng thái bằng biến `step`, nhưng không render bất kỳ thẻ JSX nào thể hiện "Bước 1 / 2" hay "Bước 2 / 2" cho người dùng thấy.

---

### BUG-FR03-04: Giao diện Web thiếu nút "Quay lại đăng nhập" tại Bước 1

> Trạng thái hiện tại: hồ sơ nghi vấn cần probe riêng. TC038 ghi Passed khi click selector rộng có thể chọn link trên nav; chưa đủ để kết luận thất bại R04 nếu liên kết Đăng nhập chung cũng đáp ứng yêu cầu. Giữ ghi nhận form bên dưới, không đổi verdict hoặc tạo reproduction mới.

- **Violated Rule(s):** **R04** ([README.md:53](../../../README.md#L53))
- **Severity:** Medium (Thiếu sót điều hướng người dùng)
- **Layer:** WEB
- **Related Test Cases:** `FR03-TC-038`
- **Environment:** React/Vite Customer Web (Port 5173)
- **Steps to Reproduce:**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Kiểm tra các nút bấm và liên kết trong khối form Bước 1.
- **Expected Result:**
  - Form có nút hoặc liên kết rõ ràng "Quay lại đăng nhập" điều hướng người dùng về trang `/login`.
- **Actual Result:**
  - Trong form Bước 1 chỉ có duy nhất nút submit "Lấy mã OTP". (Tại Bước 2 có nút "← Quay lại" nhưng chỉ gọi `setStep(1)` chứ không điều hướng về `/login`).
- **Evidence:**
  - UI Screenshot: [FR03-TC-038.png](./evidence/web/screenshots/FR03-TC-038.png).
- **Root Cause Analysis:**
  - Tệp [frontend-web/src/pages/ForgotPassword.jsx:45-61](../../../frontend-web/src/pages/ForgotPassword.jsx#L45-L61): Trong JSX của `step === 1`, không khai báo thẻ `<button>` hoặc `<Link>` nào để quay về `/login`.

---

### BUG-FR03-05: Form Bước 2 hoàn toàn thiếu trường "Xác nhận mật khẩu mới"

- **Violated Rule(s):** **R08** ([README.md:57, 59](../../../README.md#L57-L59))
- **Severity:** Critical (Thiếu trường nghiệp vụ cốt lõi)
- **Layer:** WEB
- **Related Test Cases:** `FR03-TC-044` (và làm chặn các ca `FR03-TC-039` đến `FR03-TC-043`)
- **Environment:** React/Vite Customer Web (Port 5173)
- **Steps to Reproduce:**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Nhập email hợp lệ và nhấn "Lấy mã OTP" để chuyển sang Bước 2.
  3. Quan sát các trường input trong form Bước 2.
- **Expected Result:**
  - Form phải có trường input "Xác nhận mật khẩu mới" và thực hiện kiểm tra tính trùng khớp với mật khẩu mới trước khi submit.
- **Actual Result:**
  - Form Bước 2 chỉ có 2 trường input: "Mã OTP (4 số)" và "Mật khẩu mới". Hoàn toàn không có trường xác nhận mật khẩu.
- **Evidence:**
  - UI Screenshot: [FR03-TC-044.png](./evidence/web/screenshots/FR03-TC-044.png).
- **Root Cause Analysis:**
  - Tệp [frontend-web/src/pages/ForgotPassword.jsx:63-97](../../../frontend-web/src/pages/ForgotPassword.jsx#L63-L97): Form Bước 2 bỏ trống dòng 88–89, không khai báo state và input cho `confirmPassword`.

---

### BUG-FR03-06: Regex kiểm tra mật khẩu phía Frontend Web bị lỗi ngược (Yêu cầu khoảng trắng, từ chối ký tự đặc biệt)

- **Violated Rule(s):** **R07** ([README.md:34, 58](../../../README.md#L34))
- **Severity:** Critical (Khóa người dùng hợp lệ và chấp nhận mật khẩu sai)
- **Layer:** WEB
- **Related Test Cases:** `FR03-TC-045`, `FR03-TC-046`, `FR03-TC-047`, `FR03-TC-048`, `FR03-TC-049`, `FR03-TC-050`, `FR03-TC-051`, `FR03-TC-052`
- **Environment:** React/Vite Customer Web (Port 5173)
- **Steps to Reproduce:**
  1. Tại Bước 2 của trang ForgotPassword, nhập OTP hợp lệ.
  2. Nhập một mật khẩu mạnh hoàn toàn hợp lệ theo đặc tả (ví dụ: `Abcdef1@` hoặc `Abcdef1!`).
  3. Nhấn "Đặt lại mật khẩu".
  4. Tiếp tục thử nghiệm với mật khẩu không có ký tự đặc biệt mà chỉ chứa dấu cách (ví dụ: `Abcdef1 `).
- **Expected Result:**
  - Mật khẩu chứa `@, $, !, %, *, ?, &` phải được chấp nhận thành công.
  - Mật khẩu chỉ chứa khoảng trắng `Abcdef1 ` phải bị từ chối.
- **Actual Result:**
  - Mật khẩu hợp lệ `Abcdef1@` bị form chặn lại với alert: _"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."_
  - Ngược lại, mật khẩu chỉ chứa khoảng trắng `Abcdef1 ` lại được chấp nhận thành công với alert: _"Đổi mật khẩu thành công!"_.
- **Evidence:**
  - UI Screenshots: [FR03-TC-045.png](./evidence/web/screenshots/FR03-TC-045.png) đến [FR03-TC-052.png](./evidence/web/screenshots/FR03-TC-052.png).
- **Root Cause Analysis:**
  - Tệp [frontend-web/src/pages/ForgotPassword.jsx:26](../../../frontend-web/src/pages/ForgotPassword.jsx#L26):
    ```javascript
    const flawedStrongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
    ```
    Biểu thức chính quy này sử dụng `(?=.*\s)` (bắt buộc ký tự khoảng trắng) và `[A-Za-z\d\s]` (chỉ cho phép chữ, số và khoảng trắng), hoàn toàn không chấp nhận bất kỳ ký tự đặc biệt nào trong tập `@$!%*?&`.


## Ghi chú phân loại sau khi có slide

- BUG-FR03-01 liên quan độ dài OTP đầu ra (R02), không được lấy token synthetic để chứng minh chức năng sinh mã.
- Lỗi nhận password rỗng/1 ký tự vẫn có evidence lịch sử; các case đó là regression bổ sung trong thiết kế mới, không gọi là nghĩa vụ Standard BVA môn học.
- Lỗi UI chỉ có dialog/screenshot thì giữ kết luận ở mức quan sát đó; chưa có snapshot password cho mọi đường UI. Không gán lại ngày tái lập mới hay mặc định toàn bộ phiên bản runtime đã được xác minh.
- OTP format/binding và password nhiều vi phạm có masking; case từ chối không đủ chứng minh mọi validator độc lập. Phân tích nguyên nhân từ code là bằng chứng hỗ trợ, tách với hành vi đã quan sát.
