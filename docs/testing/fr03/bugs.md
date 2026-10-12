# Báo cáo Khiếm khuyết và Lỗi Phần mềm (Bug Reports) - FR-03

Báo cáo này tài liệu hóa chi tiết **6 lỗi phần mềm thực tế** được phát hiện và tái lập thành công qua quá trình thực thi bộ kiểm thử Domain Testing & BVA.

---

### BUG-FR03-01: Backend cấp phát mã OTP 4 chữ số thay vì 6 chữ số ngẫu nhiên
- **Mã Quy tắc Vi phạm:** **R02** (`README.md:51`, `api_specification.md:42`)
- **Mức độ nghiêm trọng:** Cao (Major - Vi phạm đặc tả chuẩn an ninh)
- **Tầng phát hiện:** API & WEB
- **Các ca kiểm thử liên quan:** `FR03-TC-001`, `FR03-TC-037`
- **Môi trường:** Node.js v22.17.1, Express Backend (Port 3000)
- **Các bước tái lập (Steps to Reproduce):**
  1. Gửi HTTP POST tới `http://localhost:3000/api/forgot-password` với body:
     ```json
     { "email": "fr03-a@example.com" }
     ```
  2. Quan sát giá trị `resetToken` trong response body JSON.
- **Kết quả kỳ vọng (Expected):**
  - Hệ thống sinh và trả về mã OTP gồm đúng 6 chữ số ngẫu nhiên (độ dài 6, định dạng `^[0-9]{6}$`).
- **Kết quả thực tế (Actual Observed):**
  - Hệ thống trả về mã OTP chỉ gồm 4 chữ số (ví dụ: `"7257"`).
- **Bằng chứng (Evidence):**
  - Log API: [observations.json](file:///docs/testing/fr03/evidence/api/observations.json) (Case `FR03-TC-001`).
  - Ảnh chụp màn hình UI: [FR03-TC-037.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-037.png) hiển thị thông báo "Mã OTP của bạn là: 7257".
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `backend/server.js`, dòng 72:
    ```javascript
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    ```
    Hàm sinh số ngẫu nhiên trong khoảng $[1000, 9999]$, dẫn đến độ dài luôn là 4 chữ số thay vì 6 chữ số như yêu cầu.

---

### BUG-FR03-02: Backend API hoàn toàn không kiểm tra độ dài và độ phức tạp của mật khẩu mới
- **Mã Quy tắc Vi phạm:** **R06, R07** (`README.md:58`, `README.md:34-35`)
- **Mức độ nghiêm trọng:** Nghiêm trọng (Critical - Lỗ hổng bảo mật dữ liệu)
- **Tầng phát hiện:** API
- **Các ca kiểm thử liên quan:** `FR03-TC-004`, `FR03-TC-007`, `FR03-TC-008`, `FR03-TC-009`, `FR03-TC-010`, `FR03-TC-012`, `FR03-TC-015`, `FR03-TC-017`, `FR03-TC-025`
- **Môi trường:** Node.js v22.17.1, Express Backend (Port 3000), SQLite
- **Các bước tái lập (Steps to Reproduce):**
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
- **Kết quả kỳ vọng (Expected):**
  - Server phải từ chối (HTTP 400/422); giữ nguyên mật khẩu cũ trong CSDL.
- **Kết quả thực tế (Actual Observed):**
  - Server trả về HTTP 200 `{"message": "Password reset successfully"}`. Mật khẩu trong CSDL bị cập nhật thành chuỗi rỗng hoặc mật khẩu không đủ độ mạnh.
- **Bằng chứng (Evidence):**
  - Toàn bộ 10 ca kiểm thử âm bản trên API bị Failed do server chấp nhận trái phép. Xem [observations.json](file:///docs/testing/fr03/evidence/api/observations.json).
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `backend/server.js`, dòng 87–98:
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
- **Mã Quy tắc Vi phạm:** **R03** (`README.md:52`)
- **Mức độ nghiêm trọng:** Thấp (Minor - Thiếu sót thành phần UI)
- **Tầng phát hiện:** WEB
- **Các ca kiểm thử liên quan:** `FR03-TC-037`
- **Môi trường:** React/Vite Customer Web (Port 5173), Playwright Chromium Headless
- **Các bước tái lập (Steps to Reproduce):**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Quan sát giao diện tại Bước 1 và sau khi chuyển sang Bước 2.
- **Kết quả kỳ vọng (Expected):**
  - Giao diện phải hiển thị rõ ràng chỉ báo bước (Step Indicator), ví dụ: "Bước 1 / 2" hoặc "Bước 2 / 2".
- **Kết quả thực tế (Actual Observed):**
  - Hoàn toàn không có thành phần hiển thị chỉ báo bước nào trong DOM.
- **Bằng chứng (Evidence):**
  - Ảnh chụp màn hình: [FR03-TC-037.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-037.png).
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `frontend-web/src/pages/ForgotPassword.jsx`: Quản lý trạng thái bằng biến `step`, nhưng không render bất kỳ thẻ JSX nào thể hiện "Bước 1 / 2" hay "Bước 2 / 2" cho người dùng thấy.

---

### BUG-FR03-04: Giao diện Web thiếu nút "Quay lại đăng nhập" tại Bước 1
- **Mã Quy tắc Vi phạm:** **R04** (`README.md:53`)
- **Mức độ nghiêm trọng:** Trung bình (Medium - Thiếu sót điều hướng người dùng)
- **Tầng phát hiện:** WEB
- **Các ca kiểm thử liên quan:** `FR03-TC-038`
- **Môi trường:** React/Vite Customer Web (Port 5173)
- **Các bước tái lập (Steps to Reproduce):**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Kiểm tra các nút bấm và liên kết trong khối form Bước 1.
- **Kết quả kỳ vọng (Expected):**
  - Form có nút hoặc liên kết rõ ràng "Quay lại đăng nhập" điều hướng người dùng về trang `/login`.
- **Kết quả thực tế (Actual Observed):**
  - Trong form Bước 1 chỉ có duy nhất nút submit "Lấy mã OTP". (Tại Bước 2 có nút "← Quay lại" nhưng chỉ gọi `setStep(1)` chứ không điều hướng về `/login`).
- **Bằng chứng (Evidence):**
  - Ảnh chụp màn hình: [FR03-TC-038.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-038.png).
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `frontend-web/src/pages/ForgotPassword.jsx`, dòng 45–61: Trong JSX của `step === 1`, không khai báo thẻ `<button>` hoặc `<Link>` nào để quay về `/login`.

---

### BUG-FR03-05: Form Bước 2 hoàn toàn thiếu trường "Xác nhận mật khẩu mới"
- **Mã Quy tắc Vi phạm:** **R08** (`README.md:57, 59`)
- **Mức độ nghiêm trọng:** Nghiêm trọng (Critical - Thiếu trường nghiệp vụ cốt lõi)
- **Tầng phát hiện:** WEB
- **Các ca kiểm thử liên quan:** `FR03-TC-044` (và làm chặn các ca `FR03-TC-039` đến `FR03-TC-043`)
- **Môi trường:** React/Vite Customer Web (Port 5173)
- **Các bước tái lập (Steps to Reproduce):**
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Nhập email hợp lệ và nhấn "Lấy mã OTP" để chuyển sang Bước 2.
  3. Quan sát các trường input trong form Bước 2.
- **Kết quả kỳ vọng (Expected):**
  - Form phải có trường input "Xác nhận mật khẩu mới" và thực hiện kiểm tra tính trùng khớp với mật khẩu mới trước khi submit.
- **Kết quả thực tế (Actual Observed):**
  - Form Bước 2 chỉ có 2 trường input: "Mã OTP (4 số)" và "Mật khẩu mới". Hoàn toàn không có trường xác nhận mật khẩu.
- **Bằng chứng (Evidence):**
  - Ảnh chụp màn hình: [FR03-TC-044.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-044.png).
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `frontend-web/src/pages/ForgotPassword.jsx`, dòng 63–97: Form Bước 2 bỏ trống dòng 88–89, không khai báo state và input cho `confirmPassword`.

---

### BUG-FR03-06: Regex kiểm tra mật khẩu phía Frontend Web bị lỗi ngược (Yêu cầu khoảng trắng, từ chối ký tự đặc biệt)
- **Mã Quy tắc Vi phạm:** **R07** (`README.md:34, 58`)
- **Mức độ nghiêm trọng:** Nghiêm trọng (Critical - Khóa người dùng hợp lệ và chấp nhận mật khẩu sai)
- **Tầng phát hiện:** WEB
- **Các ca kiểm thử liên quan:** `FR03-TC-045`, `FR03-TC-046`, `FR03-TC-047`, `FR03-TC-048`, `FR03-TC-049`, `FR03-TC-050`, `FR03-TC-051`, `FR03-TC-052`
- **Môi trường:** React/Vite Customer Web (Port 5173)
- **Các bước tái lập (Steps to Reproduce):**
  1. Tại Bước 2 của trang ForgotPassword, nhập OTP hợp lệ.
  2. Nhập một mật khẩu mạnh hoàn toàn hợp lệ theo đặc tả (ví dụ: `Abcdef1@` hoặc `Abcdef1!`).
  3. Nhấn "Đặt lại mật khẩu".
  4. Tiếp tục thử nghiệm với mật khẩu không có ký tự đặc biệt mà chỉ chứa dấu cách (ví dụ: `Abcdef1 `).
- **Kết quả kỳ vọng (Expected):**
  - Mật khẩu chứa `@, $, !, %, *, ?, &` phải được chấp nhận thành công.
  - Mật khẩu chỉ chứa khoảng trắng `Abcdef1 ` phải bị từ chối.
- **Kết quả thực tế (Actual Observed):**
  - Mật khẩu hợp lệ `Abcdef1@` bị form chặn lại với alert: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."*
  - Ngược lại, mật khẩu chỉ chứa khoảng trắng `Abcdef1 ` lại được chấp nhận thành công với alert: *"Đổi mật khẩu thành công!"*.
- **Bằng chứng (Evidence):**
  - Ảnh chụp màn hình: [FR03-TC-045.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-045.png) đến [FR03-TC-052.png](file:///docs/testing/fr03/evidence/web/screenshots/FR03-TC-052.png).
- **Phân tích nguyên nhân trong mã nguồn (Root Cause):**
  - Tệp `frontend-web/src/pages/ForgotPassword.jsx`, dòng 26:
    ```javascript
    const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
    ```
    Biểu thức chính quy này sử dụng `(?=.*\s)` (bắt buộc ký tự khoảng trắng) và `[A-Za-z\d\s]` (chỉ cho phép chữ, số và khoảng trắng), hoàn toàn không chấp nhận bất kỳ ký tự đặc biệt nào trong tập `@$!%*?&`.
