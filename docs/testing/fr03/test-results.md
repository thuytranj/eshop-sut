# Báo cáo Kết quả Thực thi và Phán quyết Kiểm thử (Test Results & Conformance Verdicts) - FR-03

## 1. Tổng quan Kết quả Thực thi Toàn diện (Execution Overview)

Hồ sơ lịch sử gồm **52 ca thiết kế duy nhất**: 47 ca có verdict Passed/Failed và 5 ca Blocked. Bảng dưới đối soát từ các observation JSON có sẵn; không phải kết quả chạy lại ngày refactor. API có snapshot password A/B; WEB chủ yếu lưu dialogs và screenshots, không đủ để khẳng định đã đối chiếu CSDL cho mọi ca UI.

| Chỉ số Thống kê | Tầng API | Tầng WEB | Toàn bộ Suite | Ghi chú Phương pháp |
|---|:---:|:---:|:---:|---|
| **Tổng số ca thiết kế (Unique Designed)** | 36 | 16 | **52** | Không tính trùng lặp ca kiểm thử |
| **Số ca thực thi (Executed)** | 36 | 11 | **47** | Các ca đã chạy và có quan sát thực tế |
| **Đạt (Passed)** | 26 | 1 | **27** | Khớp hoàn toàn với đặc tả yêu cầu |
| **Không đạt (Failed - Sai khác SUT)** | 10 | 10 | **20** | Phát hiện lỗi không phù hợp đặc tả |
| **Bị chặn (Blocked)** | 0 | 5 | **5** | Thiếu trường Confirm trên UI nên không thể nhập |
| **Chưa thực thi (Not Run)** | 0 | 0 | **0** | 100% ca thiết kế đã được xử lý |

---

## 2. Bảng Phán quyết Chi tiết Từng Ca Kiểm thử (Detailed Verdict Table)

### 2.1 Tầng API (36 ca kiểm thử)
*Bằng chứng chi tiết lưu tại:* [observations.json](evidence/api/observations.json)

| Mã Ca | Kỹ thuật | Phân loại Mục tiêu | Trạng thái Kỳ vọng | Kết quả Thực tế (Observed) | Phán quyết | Ghi chú Khiếm khuyết |
|---|---|---|:---:|---|:---:|---|
| **FR03-TC-001** | Domain Testing | Cấp phát OTP cho email A | Thành công, OTP 6 số | Trả về OTP 4 số: `"7257"` | **Failed** | Vi phạm R02 (OTP phải 6 chữ số) |
| **FR03-TC-002** | Domain Testing | Yêu cầu OTP email C không tồn tại | Bị từ chối (4xx) | HTTP 404 `User not found` | **Passed** | Xử lý đúng |
| **FR03-TC-003** | DT + BVA | Đặt lại MK danh định hợp lệ (8 ký tự) | Chấp nhận (200), đổi MK | HTTP 200, mật khẩu đổi thành `Abcdef1!` | **Passed** | Xử lý đúng |
| **FR03-TC-004** | DT + BVA | Mật khẩu độ dài 7 (Off point BVA/DT) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `Abcde1!` | **Failed** | Vi phạm R06 (Backend thiếu validate độ dài) |
| **FR03-TC-005** | DT + BVA | Mật khẩu độ dài 9 (Off point hợp lệ) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `Abcdefg1!` | **Passed** | Xử lý đúng |
| **FR03-TC-006** | Domain Testing | Mật khẩu độ dài 10 (In point đối chứng) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `Abcdefgh1!` | **Passed** | Xử lý đúng |
| **FR03-TC-007** | BVA | Mật khẩu độ dài 0 (Chuỗi rỗng) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành chuỗi rỗng `""` | **Failed** | Vi phạm R06 (Backend chấp nhận mật khẩu rỗng) |
| **FR03-TC-008** | BVA | Mật khẩu độ dài 1 (`"A"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"A"` | **Failed** | Vi phạm R06 |
| **FR03-TC-009** | BVA | Mật khẩu độ dài 6 (`"Abcd1!"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"Abcd1!"` | **Failed** | Vi phạm R06 |
| **FR03-TC-010** | DT + BVA | Mật khẩu thiếu chữ hoa (`"abcdef1!"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"abcdef1!"` | **Failed** | Vi phạm R07 (Backend thiếu validate chữ hoa) |
| **FR03-TC-011** | BVA | Mật khẩu có 2 chữ hoa (`"ABcdef1!"`) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `"ABcdef1!"` | **Passed** | Xử lý đúng |
| **FR03-TC-012** | DT + BVA | Mật khẩu thiếu chữ thường (`"ABCDEF1!"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"ABCDEF1!"` | **Failed** | Vi phạm R07 (Backend thiếu validate chữ thường) |
| **FR03-TC-013** | BVA | Mật khẩu có 1 chữ thường (`"aBCDEF1!"`) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `"aBCDEF1!"` | **Passed** | Xử lý đúng |
| **FR03-TC-014** | BVA | Mật khẩu có 2 chữ thường (`"abCDEF1!"`) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `"abCDEF1!"` | **Passed** | Xử lý đúng |
| **FR03-TC-015** | DT + BVA | Mật khẩu thiếu chữ số (`"Abcdefg!"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"Abcdefg!"` | **Failed** | Vi phạm R07 (Backend thiếu validate chữ số) |
| **FR03-TC-016** | BVA | Mật khẩu có 2 chữ số (`"Abcde12!"`) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `"Abcde12!"` | **Passed** | Xử lý đúng |
| **FR03-TC-017** | DT + BVA | Mật khẩu thiếu ký tự đặc biệt (`"Abcdef12"`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"Abcdef12"` | **Failed** | Vi phạm R07 (Backend thiếu validate ký tự đặc biệt) |
| **FR03-TC-018** | BVA | Mật khẩu có 2 ký tự đặc biệt (`"Abcde1!&"`) | Chấp nhận (200) | HTTP 200, mật khẩu đổi thành `"Abcde1!&"` | **Passed** | Xử lý đúng |
| **FR03-TC-019** | Domain Testing | Ký tự đặc biệt `@` (`"Abcdef1@"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1@"` | **Passed** | Xử lý đúng |
| **FR03-TC-020** | Domain Testing | Ký tự đặc biệt `$` (`"Abcdef1$"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1$"` | **Passed** | Xử lý đúng |
| **FR03-TC-021** | Domain Testing | Ký tự đặc biệt `%` (`"Abcdef1%"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1%"` | **Passed** | Xử lý đúng |
| **FR03-TC-022** | Domain Testing | Ký tự đặc biệt `*` (`"Abcdef1*"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1*"` | **Passed** | Xử lý đúng |
| **FR03-TC-023** | Domain Testing | Ký tự đặc biệt `?` (`"Abcdef1?"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1?"` | **Passed** | Xử lý đúng |
| **FR03-TC-024** | Domain Testing | Ký tự đặc biệt `&` (`"Abcdef1&"`) | Chấp nhận (200) | HTTP 200, đổi thành `"Abcdef1&"` | **Passed** | Xử lý đúng |
| **FR03-TC-025** | Domain Testing | Ký tự khoảng trắng (`"Abcdef1 "`) | Bị từ chối | HTTP 200, mật khẩu bị đổi thành `"Abcdef1 "` | **Failed** | Vi phạm R07 |
| **FR03-TC-026** | BVA | OTP rỗng (`""`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-027** | BVA | OTP độ dài 1 (`"1"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-028** | BVA | OTP độ dài 4 (`"1234"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-029** | DT + BVA | OTP độ dài 5 (`"12345"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-030** | DT + BVA | OTP độ dài 7 (`"1234567"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-031** | BVA | OTP độ dài 8 (`"12345678"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-032** | Domain Testing | OTP chứa chữ (`"12345x"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-033** | Domain Testing | OTP 6 số chưa cấp (`"234567"`) | Bị từ chối | HTTP 400 `Invalid token or email` | **Passed** | Xử lý đúng |
| **FR03-TC-034** | Domain Testing | Ràng buộc: Token của A gửi cho email B | Bị từ chối | HTTP 400 `Invalid token or email`; CSDL bảo toàn | **Passed** | Xử lý đúng R05 & R09 |
| **FR03-TC-035** | Domain Testing | Ràng buộc: Token của B gửi cho email A | Bị từ chối | HTTP 400 `Invalid token or email`; CSDL bảo toàn | **Passed** | Xử lý đúng R05 & R09 |
| **FR03-TC-036** | Domain Testing | Đa lỗi: Token chéo + mật khẩu yếu | Bị từ chối | HTTP 400 `Invalid token or email`; CSDL bảo toàn | **Passed** | Xử lý đúng R05, R07, R09 |

---

### 2.2 Tầng WEB (16 ca kiểm thử)
*Bằng chứng chi tiết lưu tại:* [observations.json](evidence/web/observations.json) và thư mục ảnh [screenshots/](evidence/web/screenshots)

| Mã Ca | Kỹ thuật | Nội dung Kiểm thử | Trạng thái Kỳ vọng | Kết quả Thực tế (Observed) | Phán quyết | Ảnh Bằng chứng |
|---|---|---|:---:|---|:---:|---|
| **FR03-TC-037** | DT | Chỉ báo bước & Hiển thị OTP demo | Có "Bước 1/2" và OTP 6 số | Thiếu chỉ báo bước; OTP hiển thị là 4 số | **Failed** | [FR03-TC-037.png](evidence/web/screenshots/FR03-TC-037.png) |
| **FR03-TC-038** | DT | Nút quay lại đăng nhập | Có liên kết chuyển về `/login` | Có link "Đăng nhập" trên nav; chuyển về `/login` thành công | **Passed** | [FR03-TC-038.png](evidence/web/screenshots/FR03-TC-038.png) |
| **FR03-TC-039** | DT | Khớp xác nhận MK (Cặp 1) | Submit thành công | Không có trường input Confirm Password | **Blocked** | [FR03-TC-039.png](evidence/web/screenshots/FR03-TC-039.png) |
| **FR03-TC-040** | DT | Khớp xác nhận MK (Cặp 2) | Submit thành công | Không có trường input Confirm Password | **Blocked** | [FR03-TC-040.png](evidence/web/screenshots/FR03-TC-040.png) |
| **FR03-TC-041** | DT | Mismatch xác nhận: Thay thế | Bị từ chối trên UI | Không có trường input Confirm Password | **Blocked** | [FR03-TC-041.png](evidence/web/screenshots/FR03-TC-041.png) |
| **FR03-TC-042** | DT | Mismatch xác nhận: Xóa ký tự | Bị từ chối trên UI | Không có trường input Confirm Password | **Blocked** | [FR03-TC-042.png](evidence/web/screenshots/FR03-TC-042.png) |
| **FR03-TC-043** | DT | Mismatch xác nhận: Chèn ký tự | Bị từ chối trên UI | Không có trường input Confirm Password | **Blocked** | [FR03-TC-043.png](evidence/web/screenshots/FR03-TC-043.png) |
| **FR03-TC-044** | DT | Hiện diện trường Confirm Password | Input hiện diện trong DOM | Form Bước 2 chỉ có 2 input (OTP + newPassword), vắng mặt confirmPassword | **Failed** | [FR03-TC-044.png](evidence/web/screenshots/FR03-TC-044.png) |
| **FR03-TC-045** | DT | Ký tự đặc biệt `@` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-045.png](evidence/web/screenshots/FR03-TC-045.png) |
| **FR03-TC-046** | DT | Ký tự đặc biệt `$` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-046.png](evidence/web/screenshots/FR03-TC-046.png) |
| **FR03-TC-047** | DT | Ký tự đặc biệt `!` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-047.png](evidence/web/screenshots/FR03-TC-047.png) |
| **FR03-TC-048** | DT | Ký tự đặc biệt `%` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-048.png](evidence/web/screenshots/FR03-TC-048.png) |
| **FR03-TC-049** | DT | Ký tự đặc biệt `*` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-049.png](evidence/web/screenshots/FR03-TC-049.png) |
| **FR03-TC-050** | DT | Ký tự đặc biệt `?` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-050.png](evidence/web/screenshots/FR03-TC-050.png) |
| **FR03-TC-051** | DT | Ký tự đặc biệt `&` trên Web | Form chấp nhận | Alert: "Mật khẩu quá yếu!..." (Bị từ chối do regex lỗi) | **Failed** | [FR03-TC-051.png](evidence/web/screenshots/FR03-TC-051.png) |
| **FR03-TC-052** | DT | Ký tự khoảng trắng trên Web | Form từ chối | Alert: "Đổi mật khẩu thành công!" (Bị chấp nhận trái phép do regex lỗi) | **Failed** | [FR03-TC-052.png](evidence/web/screenshots/FR03-TC-052.png) |

---

## 3. Đối soát phương pháp và coverage sau khi có slide

### 3.1 Domain Testing lịch sử

- 25/25 **nhóm nghĩa vụ** có ánh xạ thiết kế trong suite.
- 23/25 nhóm có ít nhất một case kết luận Passed/Failed; hai nhóm OBL-DT-22 và OBL-DT-23 bị chặn. Có **5 case** bị chặn: TC039–TC043. Con số cũ 21/25 và “4 nghĩa vụ” không khớp mappings.
- 23/25 = 92% là mức nhóm; không phải phần trăm mọi nghĩa vụ con hay mọi input của FR-03. Các nhóm gộp nhiều ký tự/điểm phải đọc cùng bảng mapping. Không đánh đồng Failed với không được thực thi.

### 3.2 BVA lịch sử và BVA theo slide

| Phạm vi/mẫu số | Thiết kế | Quan sát lịch sử tái sử dụng | Chạy mới |
|---|---|---|---|
| ISTQB lịch sử, API | 25/25 giá trị theo quy ước cũ | 25/25 giá trị trong observation API | 0 |
| Course BVA chính, API | 7/7 điểm | 7/7 điểm qua API cũ | 0 |
| Phép chiếu số đếm, API | 12/12 điểm bổ sung | 12/12 điểm qua API cũ | 0 |
| Course BVA chính, WEB | 7/7 điểm | 0/7 khớp quy trình mới | 0 |
| Phép chiếu số đếm, WEB | 12/12 điểm bổ sung | 0/12 khớp quy trình mới | 0 |

[course-suite.json](course-suite.json) có 30 case thiết kế, đều Not Run đối với **lượt chạy theo thiết kế mới**. Riêng 15 case API giữ historicalReuse (10 Passed, 5 Failed) với timestamp/evidence gốc để phân tích 19 điểm đã có dữ liệu, không sinh thêm một run. 15 WEB chưa chạy; không suy ra trạng thái hiện tại từ ảnh cũ. Các điểm rất ngắn vẫn là regression, nên lỗi chấp nhận password rỗng/1 ký tự vẫn có giá trị dù không là nghĩa vụ biên môn học.

### 3.3 Giới hạn kết luận

- API timestamp có hậu tố Z, quy đổi UTC+07 khi trình bày. Timestamp WEB không có offset: giữ nguyên, ghi timezone lịch sử chưa xác minh; không tự gắn UTC/giờ Việt Nam.
- Không có execution manifest đầy đủ để xác nhận lại build, phiên bản runtime, timezone WEB hay checksum CSDL gốc ở thời điểm chạy cũ. Thông tin môi trường trong bug report là thông tin kế thừa, không phải xác minh mới.
- Một số expected cũ thêm HTTP 200/4xx, xóa token hoặc đăng nhập thành công. Chỉ tiêu theo spec là chấp nhận/từ chối và thay đổi password phù hợp. Không coi các chi tiết chưa được đặc tả là yêu cầu mới. Log API cho thấy state, nhưng không có request login độc lập: không kết luận đã kiểm tra login từ case reset.
- Từ chối token sai độ dài cũng có thể do sai binding; không chứng minh validator hình thức độc lập. Một OTP đúng hình thức không chứng minh randomness.
- `FR03-TC-038` dùng selector rộng có thể chọn link Đăng nhập trên nav. Passed lịch sử xác nhận đường điều hướng đã click, chưa đủ chứng minh control riêng “Quay lại đăng nhập” trong form đáp ứng R04; cần review yêu cầu và probe riêng trước kết luận đầy đủ.
- Không sửa JSON evidence hoặc verdict lịch sử. Những giới hạn trên thu hẹp cách diễn giải; không giả tạo kết quả chạy lại.
