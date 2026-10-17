# FR-03 — Phân tích giá trị biên theo slide bài giảng

## 1. Cơ sở và lựa chọn phương pháp

Nguồn phương pháp là [KCPM Bài 4](references/KCPM-Bai4-EP-BVA.pdf): slide 6–18 giải thích phân hoạch tương đương; slide 19–26 giải thích BVA. Đặc tả nghiệp vụ vẫn là [README](../../../README.md) FR-03 và điều kiện mật khẩu FR-01; giao diện theo [API specification](../../../api_specification.md). Slide cung cấp phương pháp, không thay thế yêu cầu của EShop.

Báo cáo hiện hành chọn **Standard BVA, bổ sung Robustness thành nhóm riêng**. Đây là lựa chọn áp dụng của báo cáo vì cần kiểm tra cả giá trị bị từ chối. Slide không bắt buộc phải chạy cả bốn biến thể. Bản [ISTQB 3-value lịch sử](references/bva-istqb-historical.md) được giữ để truy vết, không gọi là “chuẩn môn học”.

| Biến thể | Chọn điểm cho miền hợp lệ [LB,UB], bước h | Kết hợp n đầu vào độc lập, hữu hạn, điểm phân biệt |
|---|---|---|
| Standard (slide 22) | LB, LB+h, nominal, UB-h, UB | Thay đổi từng biến, các biến khác danh định; 4n+1 |
| Robustness (slide 23) | Standard cộng LB-h, UB+h | Thay đổi từng biến; 6n+1, đã gồm Standard |
| Worst-case (slide 24) | Tập Standard mỗi biến | Tích Descartes; 5^n |
| Robust Worst-case (slide 25) | Tập Robustness mỗi biến | Tích Descartes; 7^n |

LB (lower bound) là biên dưới hợp lệ; UB (upper bound) là biên trên hợp lệ; nominal là giá trị đại diện hợp lệ dùng làm đối chứng; h là bước phân giải. OFAT nghĩa là thay đổi một đầu vào mỗi lần, giữ các đầu vào khác ở giá trị danh định hoặc ít nhất còn hợp lệ.

Các số mũ đã được kiểm tra trên hình slide. FR-03 không đáp ứng giả thiết của các công thức: mật khẩu thiếu UB; OTP là singleton; bốn số đếm ký tự cùng phụ thuộc một chuỗi. Vì vậy báo cáo liệt kê điểm khả thi và khử trùng thực tế, không tính n=6 rồi áp 4n+1 hay 6n+1. Worst-case không được chọn; không có tuyên bố coverage tích Descartes.

## 2. Bước 1 — Xác định input, output và đơn vị

| Biến/đại lượng | Quy tắc | Miền hợp lệ | Đơn vị/độ phân giải | Vai trò |
|---|---|---|---|---|
| p = newPassword | R06 | length(p) ≥ 8 | Ký tự ASCII, h=1 | Độ dài đầu vào |
| token = resetToken | R02, R05 | 6 chữ số và khớp email | Ký tự ASCII, h=1 | Độ dài đầu vào; phải xét binding |
| count_upper/lower/digit/special(p) | R07 | Mỗi số đếm ≥1 | Số ký tự, h=1 | Phép chiếu bổ sung, không độc lập |
| OTP do hệ thống sinh | R02 | Chính xác 6 chữ số | Độ dài chuỗi đầu ra | Kiểm tra biên đầu ra |
| email, token binding, p=c | R01, R05, R08 | Quan hệ/phân loại | Không có thứ tự số học | Domain Testing, không BVA số học |

Không tự đặt maximum mật khẩu, TTL/retry OTP hay quy ước Unicode. Response thành công/thất bại là kết quả phân loại; không có thêm biên số học đầu ra được đặc tả. Tính ngẫu nhiên không thể chứng minh bằng một vài OTP.

## 3. Bước 2 — Lập phân hoạch và xác định biên hợp lệ

- Mật khẩu: không hợp lệ về độ dài [0,7], hợp lệ [8,+∞). **LB=8; UB chưa được đặc tả**. 0 và 7 là phần tử của miền không hợp lệ, không biến thành LB hợp lệ. Chọn nominal length=10, không coi 10 là UB.
- OTP: độ dài <6, =6, >6; **LB=UB=6**, nominal=6. Hình thức đúng chưa đủ để reset: phải khớp mã A đã được cấp.
- Mỗi số đếm lớp ký tự: {0} không hợp lệ, [1,+∞) hợp lệ; LB=1, UB chưa biết. Dùng nominal count=2, trùng với LB+1 nên khử trùng. Các phép chiếu này bổ sung kiểm tra R07, không phải bốn đầu vào độc lập.

## 4. Bước 3 — Chọn điểm theo biến thể và giải thích

| Nhóm | Standard thích nghi | Robustness thêm | Vì sao không lấy đủ công thức hai phía? |
|---|---|---|---|
| Độ dài mật khẩu | 8 (LB), 9 (LB+1), 10 (nominal) | 7 (LB-1) | Không có UB; không bịa biên trên |
| Độ dài OTP | 6 (LB=UB=nominal) | 5, 7 | LB+1 và UB-1 đều nằm ngoài singleton; không gọi là valid interior |
| Mỗi số đếm ký tự | 1 (LB), 2 (LB+1 và nominal) | 0 | Một phía; các số đếm phụ thuộc cùng p |

Nhóm chính có **7 nghĩa vụ điểm**: 4 độ dài mật khẩu + 3 độ dài OTP. Nhóm phép chiếu có **12 nghĩa vụ điểm**: 4 lớp × 3 số đếm. Tổng 19 nghĩa vụ mỗi tầng; nghĩa vụ khác ca thực thi vì một fixture có thể phục vụ nhiều nghĩa vụ. Các trường hợp length=0,1,6 và OTP length=0,1,4,8 của suite cũ vẫn là regression bổ sung hữu ích, không cộng vào mẫu số BVA theo slide.

## 5. Bước 4 — Dựng fixture và kiểm tra cô lập

Trạng thái dùng chung: A=`fr03-a@example.com`, B=`fr03-b@example.com`; password cả hai `OldPass1!`; token A=`123456`, B=`654321`; login_attempts=0, locked_until=NULL. Reset độc lập trước mỗi ca trong CSDL cách ly. Token gán fixture phải được ghi là synthetic, không phải kết quả sinh OTP.

- Length=7/8/9/10: `Abcde1!`, `Abcdef1!`, `Abcdefg1!`, `Abcdefgh1!`. Mỗi chuỗi đều đủ hoa/thường/số/đặc biệt; thay đổi độ dài không làm sai điều kiện lớp ký tự. 7 từ chối; 8/9/10 chấp nhận.
- Upper count=0/1/2: `abcdef1!`, `Abcdef1!`, `ABcdef1!`.
- Lower count=0/1/2: `ABCDEF1!`, `aBCDEF1!`, `abCDEF1!`.
- Digit count=0/1/2: `Abcdefg!`, `Abcdef1!`, `Abcde12!`.
- Special count=0/1/2: `Abcdef12`, `Abcdef1!`, `Abcde1!&`.
- Các fixture số đếm đều dài 8, giữ các lớp khác hợp lệ; số đếm 0 từ chối, 1/2 chấp nhận. Khi đổi số đếm một lớp, số đếm lớp khác có thể đổi nhưng vẫn hợp lệ: đây là kiểm tra phép chiếu, không khẳng định OFAT trên các số đếm độc lập.
- OTP length=5/6/7: `12345`, `123456`, `1234567`, với p=`Abcdef1!`. Chỉ 6 khớp token A. Ca 5/7 cùng sai hình thức và binding; từ chối không chứng minh riêng validator hình thức.
- Giá trị length=0/1 của mật khẩu cũ vi phạm nhiều lớp cùng lúc. Không dùng chúng để kết luận đã cô lập lỗi độ dài. Xác nhận mật khẩu và email membership vẫn theo Domain Testing.

## 6. Bước 5 — Ánh xạ nghĩa vụ sang ca và bằng chứng

Bảng dưới ánh xạ API; phiên bản WEB có cùng nghĩa vụ nhưng case ID `FR03-CBVA-Wxx`, fixture thêm confirmPassword bằng p và quy trình UI riêng. [course-suite.json](course-suite.json) là danh sách đầy đủ: preconditions, fixture, steps, expected, actual/status, evidence và lịch sử tái sử dụng. Các ID nguồn `FR03-BVA-*` cũ giữ nguyên trong suite lịch sử; ID mới dùng `CBVA-*` để tránh đổi nghĩa ID cũ.

| Nghĩa vụ | Nhóm phương pháp | Input đang xét | Case theo slide (API) | Case lịch sử tái sử dụng |
|---|---|---|---|---|
| `CBVA-LEN-8` | Standard | `Abcdef1!` | `FR03-CBVA-A01` | `FR03-TC-003` |
| `CBVA-LEN-9` | Standard | `Abcdefg1!` | `FR03-CBVA-A02` | `FR03-TC-005` |
| `CBVA-LEN-10` | Standard nominal | `Abcdefgh1!` | `FR03-CBVA-A03` | `FR03-TC-006` |
| `CBVA-LEN-7` | Robustness addition | `Abcde1!` | `FR03-CBVA-A04` | `FR03-TC-004` |
| `CBVA-OTP-6` | Standard singleton | `123456` | `FR03-CBVA-A01` | `FR03-TC-003` |
| `CBVA-OTP-5` | Robustness addition | `12345` | `FR03-CBVA-A05` | `FR03-TC-029` |
| `CBVA-OTP-7` | Robustness addition | `1234567` | `FR03-CBVA-A06` | `FR03-TC-030` |
| `CBVA-UPPER-0` | Derived Robustness | `abcdef1!` | `FR03-CBVA-A07` | `FR03-TC-010` |
| `CBVA-UPPER-1` | Derived Standard | `Abcdef1!` | `FR03-CBVA-A01` | `FR03-TC-003` |
| `CBVA-UPPER-2` | Derived Standard | `ABcdef1!` | `FR03-CBVA-A08` | `FR03-TC-011` |
| `CBVA-LOWER-0` | Derived Robustness | `ABCDEF1!` | `FR03-CBVA-A09` | `FR03-TC-012` |
| `CBVA-LOWER-1` | Derived Standard | `aBCDEF1!` | `FR03-CBVA-A10` | `FR03-TC-013` |
| `CBVA-LOWER-2` | Derived Standard | `abCDEF1!` | `FR03-CBVA-A11` | `FR03-TC-014` |
| `CBVA-DIGIT-0` | Derived Robustness | `Abcdefg!` | `FR03-CBVA-A12` | `FR03-TC-015` |
| `CBVA-DIGIT-1` | Derived Standard | `Abcdef1!` | `FR03-CBVA-A01` | `FR03-TC-003` |
| `CBVA-DIGIT-2` | Derived Standard | `Abcde12!` | `FR03-CBVA-A13` | `FR03-TC-016` |
| `CBVA-SPEC-0` | Derived Robustness | `Abcdef12` | `FR03-CBVA-A14` | `FR03-TC-017` |
| `CBVA-SPEC-1` | Derived Standard | `Abcdef1!` | `FR03-CBVA-A01` | `FR03-TC-003` |
| `CBVA-SPEC-2` | Derived Standard | `Abcde1!&` | `FR03-CBVA-A15` | `FR03-TC-018` |

### Kiểm tra đầu ra OTP

`FR03-TC-001` có response resetToken=`7257`, length=4; `FR03-TC-037` có log OTP demo `6429`. Đây là bằng chứng lịch sử vi phạm R02, không phải input token gán sẵn `123456`. Nghĩa vụ đầu ra được truy vết riêng đến R02; không cộng thêm vào 19 nghĩa vụ điểm đầu vào. Không suy ra tính ngẫu nhiên hay email delivery thật từ các log này.

## 7. Bước 6 — Coverage, kết quả và giới hạn

| Thước đo | API | WEB |
|---|---|---|
| Thiết kế nhóm chính | 7/7 nghĩa vụ | 7/7 nghĩa vụ |
| Thiết kế phép chiếu bổ sung | 12/12 nghĩa vụ | 12/12 nghĩa vụ |
| Số ca duy nhất theo slide | 15 | 15 |
| Quan sát lịch sử khớp fixture có thể tái sử dụng | 19/19 điểm, qua 15 ca API | 0/19 |
| Thực thi mới sau refactor | 0 ca | 0 ca |
| Trạng thái chạy phiên bản course-suite | Not Run | Not Run |

15 ca API có bằng chứng cũ (10 Passed, 5 Failed); các trạng thái này được ghi ở historicalReuse, không chuyển thành một lượt chạy mới. WEB mới chưa chạy nên Not Run; không tự đổi thành Blocked chỉ từ tình trạng UI cách đây vài ngày. Log WEB cũ dùng OTP thực tế có thể 4 số và không lưu snapshot password/network đầy đủ; không dùng làm bằng chứng matching-fixture cho thiết kế seed token 6 số.

19/19 là độ phủ **điểm đã quan sát lại được từ lịch sử trên API**, không phải 100% tính năng hay mọi nhánh validator. Thiếu UB, phụ thuộc giữa số đếm, masking OTP, Unicode và hạn chế evidence vẫn được giữ rõ. Xem [test-results.md](test-results.md) và [suite-review.md](suite-review.md).
