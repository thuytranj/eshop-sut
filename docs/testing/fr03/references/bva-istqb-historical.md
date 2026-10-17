# Bản thiết kế BVA lịch sử trước khi có slide

> Bản lưu trước refactor ngày 2026-10-17. Phương pháp bên dưới là quy ước ISTQB 3-value đã dùng trước đây, **không phải phương pháp BVA môn học**. Các trạng thái Not Run là trạng thái ở bước thiết kế, không thay thế kết quả lịch sử trong [test-results.md](../test-results.md). Xem [bva-report.md](../bva-report.md) cho thiết kế hiện hành. Bản lưu giữ cả lỗi diễn giải cũ để truy vết; không dùng làm hướng dẫn hiện tại.

# Boundary Value Analysis - BVA - FR-03

## 1. Methodology & Convention

### 1.1 Quy ước Phương pháp luận
Báo cáo này áp dụng phương pháp **Phân tích Giá trị Biên 3 giá trị (ISTQB 3-value BVA)** theo quy ước chuẩn kỹ thuật tại [.agents/skills/boundary-value-analysis/SKILL.md](../../../../.agents/skills/boundary-value-analysis/SKILL.md):
- Không gian đầu vào xét trên các chiều thứ tự số học (Ordered Dimensions): tập các số nguyên không âm $\mathbb{N}_0 = \{0, 1, 2, \dots\}$.
- Bước nhảy phân giải (Step size): $h = 1$ (1 ký tự hoặc 1 đơn vị đếm).
- Kỹ thuật 3-value BVA xác định với mỗi điểm biên hữu hạn $b$: tập kiểm thử bao gồm điểm biên $b$, phần tử đứng trước $b - 1$ (nếu nằm trong không gian hợp lệ $\mathbb{N}_0$) và phần tử đứng sau $b + 1$.
- Các biến không có thứ tự số học (email tồn tại/không tồn tại, token khớp/lệch sở hữu, chuỗi khớp xác nhận $p = c$) là các vị từ phân loại hoặc bề mặt tương đương đã được kiểm thử đầy đủ trong phương pháp Kiểm thử Miền (Domain Testing) và không thuộc phạm vi BVA số học.

---

## 2. Partitions & Endpoints

Ta xác định 6 chiều thứ tự số học độc lập trong FR-03:

### 2.1 Chiều 1: Độ dài Mật khẩu mới ($\text{length}(p)$)
- **Phân vùng không hợp lệ:** $[0, 7]$ (ngắn hơn 8 ký tự).
- **Phân vùng hợp lệ:** $[8, \infty)$ (từ 8 ký tự trở lên; đặc tả không đặt giới hạn trên).
- **Các điểm biên hữu hạn (Finite Endpoints):**
  - Biên dưới cùng của phân vùng không hợp lệ: $0$.
  - Biên trên cùng của phân vùng không hợp lệ: $7$.
  - Biên dưới cùng của phân vùng hợp lệ: $8$.

### 2.2 Chiều 2–5: Số lượng Ký tự theo 4 Lớp Yêu cầu
Gồm: Số chữ hoa ($\text{count}_{\text{upper}}$), số chữ thường ($\text{count}_{\text{lower}}$), số chữ số ($\text{count}_{\text{digit}}$), và số ký tự đặc biệt quy định ($\text{count}_{\text{special}}$):
- **Phân vùng không hợp lệ:** $\{0\}$ (thiếu hoàn toàn lớp ký tự đó).
- **Phân vùng hợp lệ:** $[1, \infty)$ (có ít nhất 1 ký tự thuộc lớp đó).
- **Các điểm biên hữu hạn (Finite Endpoints):**
  - Biên vùng không hợp lệ: $0$.
  - Biên vùng hợp lệ: $1$.

### 2.3 Chiều 6: Độ dài Chuỗi Mã OTP ($\text{length}(token)$)
- **Phân vùng không hợp lệ phía dưới:** $[0, 5]$.
- **Phân vùng hợp lệ về hình thức (Format valid):** $\{6\}$.
- **Phân vùng không hợp lệ phía trên:** $[7, \infty)$.
- **Các điểm biên hữu hạn (Finite Endpoints):**
  - Điểm biên dưới cùng: $0$.
  - Điểm biên trên của vùng dưới: $5$.
  - Điểm giá trị hợp lệ: $6$.
  - Điểm biên dưới của vùng trên: $7$.

---

## 3. Dẫn xuất Lân cận Biên 3 Giá trị (Derivation of 3-Value Neighborhoods)

### 3.1 Dẫn xuất cho Chiều Độ dài Mật khẩu
- Tại endpoint $0$: lân cận gồm $\{0, 1\}$ (bỏ $-1$ vì độ dài chuỗi không âm).
- Tại endpoint $7$: lân cận gồm $\{6, 7, 8\}$.
- Tại endpoint $8$: lân cận gồm $\{7, 8, 9\}$.
- **Hợp các giá trị cần kiểm thử (Union of values):**
  $$\{0, 1\} \cup \{6, 7, 8\} \cup \{7, 8, 9\} = \{0, 1, 6, 7, 8, 9\}$$
- *Giải thích:* Nếu chỉ kiểm tra $\{7, 8, 9\}$ thì mới chỉ là 2-value BVA quanh ngưỡng chấp nhận 8; việc bổ sung $0$ và $1$ hoàn thiện đầy đủ chuẩn 3-value BVA trên phân vùng đóng $[0, 7]$.

### 3.2 Dẫn xuất cho Chiều Số lượng Ký tự 4 Lớp
Với mỗi lớp trong 4 lớp ký tự (Hoa, Thường, Số, Đặc biệt):
- Tại endpoint $0$: lân cận gồm $\{0, 1\}$.
- Tại endpoint $1$: lân cận gồm $\{0, 1, 2\}$.
- **Hợp các giá trị cần kiểm thử (Union of values):**
  $$\{0, 1\} \cup \{0, 1, 2\} = \{0, 1, 2\}$$

### 3.3 Dẫn xuất cho Chiều Độ dài Chuỗi Mã OTP
- Tại endpoint $0$: lân cận gồm $\{0, 1\}$.
- Tại endpoint $5$: lân cận gồm $\{4, 5, 6\}$.
- Tại endpoint $6$: lân cận gồm $\{5, 6, 7\}$.
- Tại endpoint $7$: lân cận gồm $\{6, 7, 8\}$.
- **Hợp các giá trị cần kiểm thử (Union of values):**
  $$\{0, 1\} \cup \{4, 5, 6\} \cup \{5, 6, 7\} \cup \{6, 7, 8\} = \{0, 1, 4, 5, 6, 7, 8\}$$

---

## 4. Thiết kế Dữ liệu Kiểm thử (Test Fixtures) và Hiện tượng Masking

### 4.1 Bộ dữ liệu Kiểm thử Độ dài Mật khẩu ($\{0, 1, 6, 7, 8, 9\}$)
- $0$: Chuỗi rỗng `""` $\implies$ Kỳ vọng: Từ chối. (*Ghi chú Masking:* Độ dài 0 vi phạm đồng thời cả 4 lớp ký tự, không thể cô lập riêng lỗi độ dài).
- $1$: Chuỗi `"A"` $\implies$ Kỳ vọng: Từ chối. (*Ghi chú Masking:* Độ dài 1 không thể chứa đủ 4 lớp ký tự).
- $6$: `"Abcd1!"` (1 hoa, 3 thường, 1 số, 1 đặc biệt) $\implies$ Kỳ vọng: Từ chối vì độ dài 6, các lớp ký tự thỏa mãn.
- $7$: `"Abcde1!"` (1 hoa, 4 thường, 1 số, 1 đặc biệt) $\implies$ Kỳ vọng: Từ chối vì độ dài 7.
- $8$: `"Abcdef1!"` (1 hoa, 5 thường, 1 số, 1 đặc biệt) $\implies$ Kỳ vọng: Chấp nhận (điểm biên tối thiểu hợp lệ).
- $9$: `"Abcdefg1!"` (1 hoa, 6 thường, 1 số, 1 đặc biệt) $\implies$ Kỳ vọng: Chấp nhận.

### 4.2 Bộ dữ liệu Kiểm thử Số lượng Ký tự 4 Lớp ($\{0, 1, 2\}$)
Tất cả các ca đều sử dụng độ dài danh định 8 ký tự, giữ các lớp khác hợp lệ:
- **Chữ hoa (Uppercase):**
  - count 0: `abcdef1!` (0 hoa, 6 thường, 1 số, 1 đặc biệt) $\implies$ Từ chối.
  - count 1: `Abcdef1!` (1 hoa, 5 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
  - count 2: `ABcdef1!` (2 hoa, 4 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
- **Chữ thường (Lowercase):**
  - count 0: `ABCDEF1!` (6 hoa, 0 thường, 1 số, 1 đặc biệt) $\implies$ Từ chối.
  - count 1: `aBCDEF1!` (5 hoa, 1 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
  - count 2: `abCDEF1!` (4 hoa, 2 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
- **Chữ số (Digits):**
  - count 0: `Abcdefg!` (1 hoa, 6 thường, 0 số, 1 đặc biệt) $\implies$ Từ chối.
  - count 1: `Abcdef1!` (1 hoa, 5 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
  - count 2: `Abcde12!` (1 hoa, 4 thường, 2 số, 1 đặc biệt) $\implies$ Chấp nhận.
- **Ký tự đặc biệt (Specials):**
  - count 0: `Abcdef12` (1 hoa, 5 thường, 2 số, 0 đặc biệt) $\implies$ Từ chối.
  - count 1: `Abcdef1!` (1 hoa, 5 thường, 1 số, 1 đặc biệt) $\implies$ Chấp nhận.
  - count 2: `Abcde1!&` (1 hoa, 4 thường, 1 số, 2 đặc biệt) $\implies$ Chấp nhận.

### 4.3 Bộ dữ liệu Kiểm thử Độ dài OTP ($\{0, 1, 4, 5, 6, 7, 8\}$)
Tài khoản A có token hợp lệ được cấp trong CSDL là `123456`:
- $0$: `""` $\implies$ Từ chối.
- $1$: `"1"` $\implies$ Từ chối.
- $4$: `"1234"` $\implies$ Từ chối.
- $5$: `"12345"` $\implies$ Từ chối.
- $6$: `"123456"` $\implies$ Chấp nhận (khớp mã A đã cấp và đúng hình thức 6 chữ số).
- $7$: `"1234567"` $\implies$ Từ chối.
- $8$: `"12345678"` $\implies$ Từ chối.

---

## 5. Danh sách Ca Kiểm thử BVA Chi tiết (Detailed BVA Test Cases)

### 5.1 Nhóm Ca Biên Độ dài Mật khẩu (API)
- `FR03-BVA-LEN-01`: Độ dài 0 (`""`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-LEN-02`: Độ dài 1 (`"A"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-LEN-03`: Độ dài 6 (`"Abcd1!"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-LEN-04`: Độ dài 7 (`"Abcde1!"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-LEN-05`: Độ dài 8 (`"Abcdef1!"`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-LEN-06`: Độ dài 9 (`"Abcdefg1!"`), Kỳ vọng: Chấp nhận | Status: Not Run

### 5.2 Nhóm Ca Biên Số lượng Ký tự 4 Lớp (API)
- `FR03-BVA-UPPER-01`: 0 chữ hoa (`abcdef1!`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-UPPER-02`: 1 chữ hoa (`Abcdef1!`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-UPPER-03`: 2 chữ hoa (`ABcdef1!`), Kỳ vọng: Chấp nhận | Status: Not Run

- `FR03-BVA-LOWER-01`: 0 chữ thường (`ABCDEF1!`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-LOWER-02`: 1 chữ thường (`aBCDEF1!`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-LOWER-03`: 2 chữ thường (`abCDEF1!`), Kỳ vọng: Chấp nhận | Status: Not Run

- `FR03-BVA-DIGIT-01`: 0 chữ số (`Abcdefg!`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-DIGIT-02`: 1 chữ số (`Abcdef1!`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-DIGIT-03`: 2 chữ số (`Abcde12!`), Kỳ vọng: Chấp nhận | Status: Not Run

- `FR03-BVA-SPECIAL-01`: 0 ký tự đặc biệt (`Abcdef12`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-SPECIAL-02`: 1 ký tự đặc biệt (`Abcdef1!`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-SPECIAL-03`: 2 ký tự đặc biệt (`Abcde1!&`), Kỳ vọng: Chấp nhận | Status: Not Run

### 5.3 Nhóm Ca Biên Độ dài Mã OTP (API)
- `FR03-BVA-OTP-01`: Độ dài 0 (`""`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-OTP-02`: Độ dài 1 (`"1"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-OTP-03`: Độ dài 4 (`"1234"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-OTP-04`: Độ dài 5 (`"12345"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-OTP-05`: Độ dài 6 (`"123456"`), Kỳ vọng: Chấp nhận | Status: Not Run
- `FR03-BVA-OTP-06`: Độ dài 7 (`"1234567"`), Kỳ vọng: Từ chối | Status: Not Run
- `FR03-BVA-OTP-07`: Độ dài 8 (`"12345678"`), Kỳ vọng: Từ chối | Status: Not Run

### 5.4 Nhóm Ca Kiểm thử Biên trên Giao diện Web (WEB)
Giao diện Web cho phép kiểm thử các biên tương tự thông qua form người dùng:
- `FR03-BVA-WEB-LEN-01..06`: Kiểm tra 6 giá trị độ dài mật khẩu trên UI.
- `FR03-BVA-WEB-UPPER-01..03`: Kiểm tra số lượng chữ hoa 0, 1, 2 trên UI.
- `FR03-BVA-WEB-LOWER-01..03`: Kiểm tra số lượng chữ thường 0, 1, 2 trên UI.
- `FR03-BVA-WEB-DIGIT-01..03`: Kiểm tra số lượng chữ số 0, 1, 2 trên UI.
- `FR03-BVA-WEB-SPECIAL-01..03`: Kiểm tra số lượng ký tự đặc biệt 0, 1, 2 trên UI.
- `FR03-BVA-WEB-OTP-01..07`: Kiểm tra 7 giá trị độ dài OTP trên form Bước 2.

---

## 6. Ma trận Nghĩa vụ Giá trị Biên (BVA Obligations & Traceability)

| Chiều kiểm thử BVA | Điểm biên hữu hạn | Giá trị lân cận 3-value | Mã Nghĩa vụ BVA | Ca kiểm thử đáp ứng |
|---|---|---|---|---|
| Độ dài mật khẩu | 0, 7, 8 | 0 | **OBL-BVA-LEN-0** | `FR03-BVA-LEN-01` |
| | | 1 | **OBL-BVA-LEN-1** | `FR03-BVA-LEN-02` |
| | | 6 | **OBL-BVA-LEN-6** | `FR03-BVA-LEN-03` |
| | | 7 | **OBL-BVA-LEN-7** | `FR03-BVA-LEN-04` |
| | | 8 | **OBL-BVA-LEN-8** | `FR03-BVA-LEN-05` |
| | | 9 | **OBL-BVA-LEN-9** | `FR03-BVA-LEN-06` |
| Chữ hoa | 0, 1 | 0 | **OBL-BVA-UPPER-0** | `FR03-BVA-UPPER-01` |
| | | 1 | **OBL-BVA-UPPER-1** | `FR03-BVA-UPPER-02` |
| | | 2 | **OBL-BVA-UPPER-2** | `FR03-BVA-UPPER-03` |
| Chữ thường | 0, 1 | 0 | **OBL-BVA-LOWER-0** | `FR03-BVA-LOWER-01` |
| | | 1 | **OBL-BVA-LOWER-1** | `FR03-BVA-LOWER-02` |
| | | 2 | **OBL-BVA-LOWER-2** | `FR03-BVA-LOWER-03` |
| Chữ số | 0, 1 | 0 | **OBL-BVA-DIGIT-0** | `FR03-BVA-DIGIT-01` |
| | | 1 | **OBL-BVA-DIGIT-1** | `FR03-BVA-DIGIT-02` |
| | | 2 | **OBL-BVA-DIGIT-2** | `FR03-BVA-DIGIT-03` |
| Ký tự đặc biệt | 0, 1 | 0 | **OBL-BVA-SPEC-0** | `FR03-BVA-SPECIAL-01` |
| | | 1 | **OBL-BVA-SPEC-1** | `FR03-BVA-SPECIAL-02` |
| | | 2 | **OBL-BVA-SPEC-2** | `FR03-BVA-SPECIAL-03` |
| Độ dài OTP | 0, 5, 6, 7 | 0 | **OBL-BVA-OTP-0** | `FR03-BVA-OTP-01` |
| | | 1 | **OBL-BVA-OTP-1** | `FR03-BVA-OTP-02` |
| | | 4 | **OBL-BVA-OTP-4** | `FR03-BVA-OTP-03` |
| | | 5 | **OBL-BVA-OTP-5** | `FR03-BVA-OTP-04` |
| | | 6 | **OBL-BVA-OTP-6** | `FR03-BVA-OTP-05` |
| | | 7 | **OBL-BVA-OTP-7** | `FR03-BVA-OTP-06` |
| | | 8 | **OBL-BVA-OTP-8** | `FR03-BVA-OTP-07` |

### Thống kê Nghĩa vụ BVA:
- **Tổng số giá trị biên định danh độc lập:** 6 (độ dài MK) + 12 (4 lớp ký tự $\times$ 3 giá trị) + 7 (độ dài OTP) = **25 nghĩa vụ giá trị biên**.
- **Độ bao phủ thiết kế BVA:** 25 / 25 (100% nghĩa vụ BVA được tạo ca kiểm thử).
- **Trạng thái ban đầu:** 100% `Not Run`.
