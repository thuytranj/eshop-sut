# Báo cáo Rà soát, Hợp nhất và Đối chiếu Kỹ thuật (Suite Review & Deduplication) - FR-03

## 1. Mục tiêu và Cơ sở Rà soát (Review Objectives)

Báo cáo này thực hiện bước chuyển giao quan trọng giữa giai đoạn thiết kế lý thuyết và giai đoạn thực thi:
1. **Rà soát kỹ thuật độc lập (Independent Technical Review):** Kiểm tra tính nhất quán toán học, các phép toán so sánh, hiện tượng che khuất lỗi (masking), và việc loại trừ các chính sách chưa được đặc tả.
2. **Hợp nhất kịch bản trùng lặp (Scenario-based Deduplication):** Loại bỏ việc thực thi trùng thừa khi các ca từ Domain Testing và BVA có cùng dữ liệu đầu vào, trạng thái ban đầu, các bước và kỳ vọng kết quả, trong khi vẫn bảo toàn đầy đủ các định danh nguồn (`sourceCaseIds`) và nghĩa vụ kiểm thử (`obligations`).
3. **Phân tách tầng giao diện (Interface Layer Separation):** Tuyệt đối không gộp các ca kiểm thử giữa tầng API và tầng WEB, dù có cùng giá trị dữ liệu.
4. **Đóng băng bộ kiểm thử (Suite Freeze):** Đóng gói bộ ca kiểm thử chuẩn hóa thành tệp `tests/fr03/suite.json` trước khi thực thi.

---

## 2. Sổ Ghi nhận Rà soát và Hiệu chỉnh Kỹ thuật (Correction Ledger)

*Lưu ý minh bạch:* Quá trình rà soát này do Trợ lý AI thực hiện tự động (Assistant Self-Review) theo quy trình SDD; chưa có sự can thiệp hay phê duyệt trực tiếp của người học (Learner Review Pending).

| STT | Hạng mục rà soát | Trạng thái ban đầu | Hiệu chỉnh sau rà soát | Lý do kỹ thuật |
|:---:|---|---|---|---|
| 1 | **Phân tách nghĩa vụ BVA và Domain Testing** | Nguy cơ coi kiểm tra email và token binding là BVA | Phân định rõ: Email membership, token binding, confirmation equality là Domain Testing. BVA chỉ áp dụng trên 6 chiều số học có thứ tự ($\mathbb{N}_0$). | Tránh gán nhãn sai phương pháp BVA cho các biến danh mục/không có thứ tự. |
| 2 | **Hiện tượng che khuất lỗi (Masking) ở BVA độ dài 0 và 1** | Có thể bị hiểu lầm là cô lập được riêng lỗi độ dài | Ghi chú rõ: Mật khẩu rỗng hoặc độ dài 1 đồng thời vi phạm cả 4 lớp ký tự. Kết quả từ chối phản ánh vi phạm liên hợp, không thể khẳng định riêng bộ lọc độ dài hoạt động. | Bảo đảm tính trung thực của bằng chứng kiểm thử. |
| 3 | **Trường xác nhận mật khẩu ở API** | Không có trường `confirmPassword` trong spec API | Xác nhận chỉ kiểm tra R08 trên tầng WEB; tầng API không có trường này. | Tuân thủ nghiêm ngặt `api_specification.md`. |
| 4 | **Hiện diện trường trên UI (`FR03-DT-WEB-CONF-06`)** | Nếu thiếu trường thì không thể submit mismatch | Định danh ca kiểm tra sự hiện diện của control trước. Nếu control vắng mặt, ghi nhận lỗi yêu cầu (Requirement Defect) và đánh dấu các ca mismatch là Blocked. | Phản ánh chính xác hiện trạng ứng dụng mà không tạo dữ liệu giả. |
| 5 | **Mã OTP hợp lệ về hình thức vs. hợp lệ về sở hữu** | Độ dài 6 số có thể bị nhầm là luôn được chấp nhận | Phân biệt: Độ dài 6 số chỉ là điều kiện cần về hình thức ($F(token)$). Token phải khớp với mã được cấp cho chính email đó ($B(email, token)$) mới được chấp nhận. | Tránh ngộ nhận về tính toàn vẹn quyền sở hữu. |

---

## 3. Quy tắc và Bảng Hợp nhất Ca Kiểm thử (Deduplication Rules & Table)

### 3.1 Quy tắc Hợp nhất
Hai hay nhiều ca kiểm thử chỉ được hợp nhất thành một ca kiểm thử chuẩn hóa (Canonical Test Case - `FR03-TC-xxx`) khi và chỉ khi thỏa mãn đồng thời:
1. **Cùng tầng giao diện (Same Layer):** Cùng là API hoặc cùng là WEB.
2. **Cùng trạng thái ban đầu (Same Initial State):** Cùng tài khoản, cùng token lưu trữ, cùng mật khẩu hiện tại.
3. **Cùng dữ liệu đầu vào (Same Exact Fixture):** Giá trị chuỗi gửi lên hoàn toàn giống nhau.
4. **Cùng các bước và kỳ vọng (Same Steps & Expected Assertions):** Cùng kiểm tra phản hồi và xác minh CSDL.

Khi hợp nhất:
- Ca chuẩn hóa lưu trữ danh sách tất cả các mã nguồn trong mảng `sourceCaseIds`.
- Trường `techniques` là hợp của các kỹ thuật (`["Domain Testing", "BVA"]`).
- Trường `obligations` là hợp của tất cả các mã nghĩa vụ tương ứng.

### 3.2 Bảng Đối chiếu Hợp nhất Chính (Key Deduplication Mappings)

| Mã Chuẩn hóa | Tầng | Dữ liệu Đầu vào chính | Các Ca Nguồn được Hợp nhất | Kỹ thuật Đại diện | Nghĩa vụ được Đáp ứng |
|---|:---:|---|---|---|---|
| **FR03-TC-003** | API | `newPassword = "Abcdef1!"`, token `123456` | `FR03-DT-LEN-02`<br>`FR03-DT-SPECIAL-03`<br>`FR03-BVA-LEN-05`<br>`FR03-BVA-UPPER-02`<br>`FR03-BVA-DIGIT-02`<br>`FR03-BVA-SPECIAL-02`<br>`FR03-BVA-OTP-05` | Domain Testing,<br>BVA | OBL-DT-04, OBL-DT-11,<br>OBL-BVA-LEN-8, OBL-BVA-UPPER-1,<br>OBL-BVA-DIGIT-1, OBL-BVA-SPEC-1,<br>OBL-BVA-OTP-6 |
| **FR03-TC-004** | API | `newPassword = "Abcde1!"` (độ dài 7) | `FR03-DT-LEN-01`<br>`FR03-BVA-LEN-04` | Domain Testing,<br>BVA | OBL-DT-03,<br>OBL-BVA-LEN-7 |
| **FR03-TC-005** | API | `newPassword = "Abcdefg1!"` (độ dài 9) | `FR03-DT-LEN-03`<br>`FR03-BVA-LEN-06` | Domain Testing,<br>BVA | OBL-DT-05,<br>OBL-BVA-LEN-9 |
| **FR03-TC-010** | API | `newPassword = "abcdef1!"` (thiếu hoa) | `FR03-DT-CLASS-01`<br>`FR03-BVA-UPPER-01` | Domain Testing,<br>BVA | OBL-DT-07,<br>OBL-BVA-UPPER-0 |
| **FR03-TC-012** | API | `newPassword = "ABCDEF1!"` (thiếu thường) | `FR03-DT-CLASS-02`<br>`FR03-BVA-LOWER-01` | Domain Testing,<br>BVA | OBL-DT-08,<br>OBL-BVA-LOWER-0 |
| **FR03-TC-015** | API | `newPassword = "Abcdefg!"` (thiếu số) | `FR03-DT-CLASS-03`<br>`FR03-BVA-DIGIT-01` | Domain Testing,<br>BVA | OBL-DT-09,<br>OBL-BVA-DIGIT-0 |
| **FR03-TC-017** | API | `newPassword = "Abcdef12"` (thiếu đặc biệt) | `FR03-DT-CLASS-04`<br>`FR03-BVA-SPECIAL-01` | Domain Testing,<br>BVA | OBL-DT-10,<br>OBL-BVA-SPEC-0 |
| **FR03-TC-029** | API | `resetToken = "12345"` (độ dài OTP 5) | `FR03-DT-TOKEN-01`<br>`FR03-BVA-OTP-04` | Domain Testing,<br>BVA | OBL-DT-13,<br>OBL-BVA-OTP-5 |
| **FR03-TC-030** | API | `resetToken = "1234567"` (độ dài OTP 7) | `FR03-DT-TOKEN-02`<br>`FR03-BVA-OTP-06` | Domain Testing,<br>BVA | OBL-DT-14,<br>OBL-BVA-OTP-7 |

Các ca kiểm thử còn lại (gồm các ca cấp phát OTP, các ký tự đặc biệt cụ thể, các điểm biên 0/1/4/8 của BVA, ràng buộc tài khoản chéo, và toàn bộ 16 ca WEB) là duy nhất và được gán mã từ `FR03-TC-001` đến `FR03-TC-052`.

---

## 4. Thống kê Bộ Kiểm thử Đóng băng (Suite Freeze Statistics)

- **Đường dẫn tệp chuẩn hóa:** `tests/fr03/suite.json`
- **Mã băm toàn vẹn (SHA-256):** `fab47bd71806b5d065c584b3ab12087278c70a437c9cc471588887aa4e5a1bf9`
- **Phân bổ theo Tầng giao diện:**
  - Tầng API: **36 ca kiểm thử** (`FR03-TC-001` đến `FR03-TC-036`)
  - Tầng WEB: **16 ca kiểm thử** (`FR03-TC-037` đến `FR03-TC-052`)
  - **Tổng số ca kiểm thử chuẩn hóa duy nhất:** **52 ca**
- **Độ bao phủ Nghĩa vụ Thiết kế:**
  - Nghĩa vụ Domain Testing: **25 / 25 (100%)**
  - Nghĩa vụ BVA: **25 / 25 (100%)**
  - Tổng số quy tắc nghiệp vụ bao phủ: **R01 đến R09 (100%)**
- **Trạng thái trước thực thi:** 100% (52/52 ca) ở trạng thái `Not Run`.
