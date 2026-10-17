# Báo cáo Rà soát, Hợp nhất và Đối chiếu Kỹ thuật (Suite Review & Deduplication) - FR-03

> Hồ sơ này mô tả suite lịch sử 52 ca. Thiết kế BVA hiện hành theo slide nằm ở mục 5 bên dưới và [bva-report.md](bva-report.md). Không đổi nhãn phương pháp của lượt chạy cũ.

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
| 1 | **Phân tách nghĩa vụ BVA và Domain Testing** | Nguy cơ coi kiểm tra email và token binding là BVA | Phân định rõ: Email membership, token binding, confirmation equality là Domain Testing. BVA chỉ áp dụng trên 2 đại lượng độ dài và 4 phép chiếu số đếm có thứ tự; các phép chiếu không độc lập. | Tránh gán nhãn sai phương pháp BVA cho các biến danh mục/không có thứ tự. |
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

Các ca kiểm thử còn lại (gồm các ca cấp phát OTP, các ký tự đặc biệt cụ thể, các điểm regression bổ sung 0/1/4/8 của thiết kế ISTQB lịch sử, ràng buộc tài khoản chéo, và toàn bộ 16 ca WEB) là duy nhất và được gán mã từ `FR03-TC-001` đến `FR03-TC-052`.

---

## 4. Thống kê Bộ Kiểm thử Đóng băng (Suite Freeze Statistics)

- **Đường dẫn tệp chuẩn hóa:** `tests/fr03/suite.json`
- **Mã băm toàn vẹn (SHA-256):** `fab47bd71806b5d065c584b3ab12087278c70a437c9cc471588887aa4e5a1bf9`
- **Phân bổ theo Tầng giao diện:**
  - Tầng API: **36 ca kiểm thử** (`FR03-TC-001` đến `FR03-TC-036`)
  - Tầng WEB: **16 ca kiểm thử** (`FR03-TC-037` đến `FR03-TC-052`)
  - **Tổng số ca kiểm thử chuẩn hóa duy nhất:** **52 ca**
- **Độ bao phủ Nghĩa vụ Thiết kế:**
  - Nghĩa vụ Domain Testing được gán mapping trong mô hình: **25 / 25**; đây là 25 nhóm, không phải mọi nghĩa vụ con đều được thực thi
  - Nghĩa vụ BVA theo quy ước ISTQB lịch sử trên API: **25 / 25**; không phải mẫu số BVA theo slide và không đại diện WEB
  - Quy tắc có case thiết kế: **R01 đến R09**; không đồng nghĩa đã kiểm tra mọi hành vi/nhánh hoặc chứng minh tính ngẫu nhiên R02
- **Trạng thái trước thực thi:** 100% (52/52 ca) ở trạng thái `Not Run`.


## 5. Refactor theo slide ngày 2026-10-17

### 5.1 Quyết định review hiện hành

| Vấn đề được kiểm tra | Quyết định và lý do |
|---|---|
| Phương pháp trước đây | ISTQB 3-value là fallback lịch sử; không được gọi là chuẩn môn học |
| Phương pháp hiện hành | Standard + Robustness (slide 21–23); Worst-case 5^n và Robust Worst-case 7^n được giải thích nhưng không chọn cho suite này |
| Thiếu maximum mật khẩu | Chỉ áp dụng biên dưới; nominal=10 không phải UB |
| OTP đúng 6 ký tự | Standard singleton {6}; Robustness thêm {5,7}; không coi 5/7 là valid interior |
| Số đếm lớp ký tự | Các phép chiếu phụ thuộc một password; không áp công thức với n=6 |
| Các điểm rất ngắn cũ | Giữ làm supplementary regression, không loại evidence/bug do phương pháp đổi |
| DT vs BVA | Cùng fixture có thể liên kết hai kỹ thuật; phép chiếu chuỗi không trở thành phép đo hình học |
| Độ phủ DT lịch sử | 25 nhóm, 23 nhóm có kết luận và 2 nhóm bị chặn; 5 case bị chặn, không phải 4 nhóm |
| Hồ sơ source-case | Có 41 ID nguồn DT, ứng với 40 canonical case có DT; số 34 trước đây không khớp suite |

Đây là assistant review trên tài liệu và evidence có sẵn, không phải một lượt learner sign-off hay kiểm thử SUT mới.

### 5.2 Case theo slide và tái sử dụng evidence

[course-suite.json](course-suite.json) giữ ID mới FR03-CBVA-Axx/Wxx cùng 19 nghĩa vụ mỗi tầng. Có 30 case thiết kế (15 API, 15 WEB). 15 API là ánh xạ tham chiếu đến 15 case canonical cũ với cùng trạng thái/fixture/steps và các assertion password cần thiết; không tính thành 15 lần thực thi mới. 15 WEB có quy trình khác nên Not Run, dù giá trị password có thể giống ca cũ. Không cộng 52+30 thành số ca đã chạy.

Một case API có thể đáp ứng nhiều nghĩa vụ, ví dụ `FR03-TC-003` đồng thời length=8, upper=1, digit=1, special=1, OTP=6. Nghĩa vụ mới length nominal=10 liên kết đến `FR03-TC-006`, dù case cũ chỉ có nhãn DT. Điều này là thêm mapping trong báo cáo mới, không sửa suite đã đóng băng.

### 5.3 Bảng ánh xạ đầy đủ của suite lịch sử

| Canonical ID | Tầng | Source IDs (giữ nguyên) | Kỹ thuật lịch sử | Evidence/verdict |
|---|---|---|---|---|
| `FR03-TC-001` | API | `FR03-DT-ISS-01` | Domain Testing | [Failed](evidence/api/observations.json) |
| `FR03-TC-002` | API | `FR03-DT-ISS-02` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-003` | API | `FR03-DT-LEN-02`, `FR03-DT-SPECIAL-03`, `FR03-BVA-LEN-05`, `FR03-BVA-UPPER-02`, `FR03-BVA-DIGIT-02`, `FR03-BVA-SPECIAL-02`, `FR03-BVA-OTP-05` | Domain Testing, BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-004` | API | `FR03-DT-LEN-01`, `FR03-BVA-LEN-04` | Domain Testing, BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-005` | API | `FR03-DT-LEN-03`, `FR03-BVA-LEN-06` | Domain Testing, BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-006` | API | `FR03-DT-LEN-04` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-007` | API | `FR03-BVA-LEN-01` | BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-008` | API | `FR03-BVA-LEN-02` | BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-009` | API | `FR03-BVA-LEN-03` | BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-010` | API | `FR03-DT-CLASS-01`, `FR03-BVA-UPPER-01` | Domain Testing, BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-011` | API | `FR03-BVA-UPPER-03` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-012` | API | `FR03-DT-CLASS-02`, `FR03-BVA-LOWER-01` | Domain Testing, BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-013` | API | `FR03-BVA-LOWER-02` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-014` | API | `FR03-BVA-LOWER-03` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-015` | API | `FR03-DT-CLASS-03`, `FR03-BVA-DIGIT-01` | Domain Testing, BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-016` | API | `FR03-BVA-DIGIT-03` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-017` | API | `FR03-DT-CLASS-04`, `FR03-BVA-SPECIAL-01` | Domain Testing, BVA | [Failed](evidence/api/observations.json) |
| `FR03-TC-018` | API | `FR03-BVA-SPECIAL-03` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-019` | API | `FR03-DT-SPECIAL-01` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-020` | API | `FR03-DT-SPECIAL-02` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-021` | API | `FR03-DT-SPECIAL-04` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-022` | API | `FR03-DT-SPECIAL-05` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-023` | API | `FR03-DT-SPECIAL-06` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-024` | API | `FR03-DT-SPECIAL-07` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-025` | API | `FR03-DT-SPECIAL-08` | Domain Testing | [Failed](evidence/api/observations.json) |
| `FR03-TC-026` | API | `FR03-BVA-OTP-01` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-027` | API | `FR03-BVA-OTP-02` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-028` | API | `FR03-BVA-OTP-03` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-029` | API | `FR03-DT-TOKEN-01`, `FR03-BVA-OTP-04` | Domain Testing, BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-030` | API | `FR03-DT-TOKEN-02`, `FR03-BVA-OTP-06` | Domain Testing, BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-031` | API | `FR03-BVA-OTP-07` | BVA | [Passed](evidence/api/observations.json) |
| `FR03-TC-032` | API | `FR03-DT-TOKEN-03` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-033` | API | `FR03-DT-TOKEN-04` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-034` | API | `FR03-DT-BIND-01` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-035` | API | `FR03-DT-BIND-02` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-036` | API | `FR03-DT-INT-02` | Domain Testing | [Passed](evidence/api/observations.json) |
| `FR03-TC-037` | WEB | `FR03-DT-WEB-FLOW-01` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-038` | WEB | `FR03-DT-WEB-NAV-01` | Domain Testing | [Passed](evidence/web/observations.json) |
| `FR03-TC-039` | WEB | `FR03-DT-WEB-CONF-01` | Domain Testing | [Blocked](evidence/web/observations.json) |
| `FR03-TC-040` | WEB | `FR03-DT-WEB-CONF-02` | Domain Testing | [Blocked](evidence/web/observations.json) |
| `FR03-TC-041` | WEB | `FR03-DT-WEB-CONF-03` | Domain Testing | [Blocked](evidence/web/observations.json) |
| `FR03-TC-042` | WEB | `FR03-DT-WEB-CONF-04` | Domain Testing | [Blocked](evidence/web/observations.json) |
| `FR03-TC-043` | WEB | `FR03-DT-WEB-CONF-05` | Domain Testing | [Blocked](evidence/web/observations.json) |
| `FR03-TC-044` | WEB | `FR03-DT-WEB-CONF-06` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-045` | WEB | `FR03-DT-WEB-SPECIAL-01` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-046` | WEB | `FR03-DT-WEB-SPECIAL-02` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-047` | WEB | `FR03-DT-WEB-SPECIAL-03` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-048` | WEB | `FR03-DT-SPECIAL-04` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-049` | WEB | `FR03-DT-SPECIAL-05` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-050` | WEB | `FR03-DT-SPECIAL-06` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-051` | WEB | `FR03-DT-SPECIAL-07` | Domain Testing | [Failed](evidence/web/observations.json) |
| `FR03-TC-052` | WEB | `FR03-DT-WEB-SPECIAL-08` | Domain Testing | [Failed](evidence/web/observations.json) |
