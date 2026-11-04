# Bugs Report — FR-03, FR-05, FR-07 và FR-15

**Quy ước:** Status `Observed` nghĩa là lỗi đã được ghi nhận trong lượt chạy nguồn, chưa có bằng chứng sửa/retest trong hồ sơ tổng hợp. `Derived` và `Suspected` được tách khỏi lỗi theo đặc tả. Severity dùng High/Medium/Low (Major→High, Moderate/Minor→Medium/Low theo ảnh hưởng); Priority P1/P2/P3 là đề xuất cho triage, chưa có xác nhận của nhóm.

## Thống kê và danh sách lỗi

| FR | Lỗi theo đặc tả | Sai lệch theo oracle suy luận | Nghi vấn | Tổng hồ sơ |
|---|---:|---:|---:|---:|
| FR-03 | 5 | 0 | 1 | 6 |
| FR-05 | 4 | 1 | 0 | 5 |
| FR-07 | 8 | 0 | 0 | 8 |
| FR-15 | 5 | 0 | 0 | 5 |
| **Tổng** | **22** | **1** | **1** | **24** |

22 lỗi theo đặc tả gồm 2 dependency: FR07-BUG-007 thuộc FR-06 và FR15-BUG-005 thuộc FR-12. Hai mục FR-05 thiếu bằng chứng/oracle được giữ trong phụ lục, không tính vào 24 hồ sơ.

| Bug ID | Tóm tắt | Severity / Priority đề xuất | Phân loại |
|---|---|---|---|
| [BUG-FR03-01](#bug-fr03-01) | Backend cấp phát mã OTP 4 chữ số thay vì 6 chữ số ngẫu nhiên | High / P1 | Observed |
| [BUG-FR03-02](#bug-fr03-02) | API chấp nhận mật khẩu mới vi phạm độ dài hoặc độ mạnh | High / P1 | Observed |
| [BUG-FR03-03](#bug-fr03-03) | Giao diện Web thiếu chỉ báo bước (Step Indicator) | Low / P3 | Observed |
| [BUG-FR03-04](#bug-fr03-04) | Nghi vấn thiếu liên kết quay lại đăng nhập trong form bước 1 | Medium / P2 | Suspected |
| [BUG-FR03-05](#bug-fr03-05) | Form Bước 2 hoàn toàn thiếu trường "Xác nhận mật khẩu mới" | High / P1 | Observed |
| [BUG-FR03-06](#bug-fr03-06) | Regex kiểm tra mật khẩu phía Frontend Web bị lỗi ngược (Yêu cầu khoảng trắng, từ chối ký tự đặc biệt) | High / P1 | Observed |
| [FR05-BUG-001](#fr05-bug-001) | Search tên chứa apostrophe trả Database Error | High / P1 | Observed |
| [FR05-BUG-002](#fr05-bug-002) | Mobile không bảo toàn reserved characters trong search query | High / P1 | Observed |
| [FR05-BUG-003](#fr05-bug-003) | Search success rỗng không có empty state | Medium / P2 | Observed |
| [FR05-BUG-004](#fr05-bug-004) | Ảnh nguồn vuông bị stretch thành hình chữ nhật | Medium / P2 | Observed |
| [FR05-BUG-005](#fr05-bug-005) | Response cũ ghi đè card trong khi keyword vẫn là query mới | High / P1 | Derived |
| [FR07-BUG-001](#fr07-bug-001) | Thêm cùng sản phẩm vào giỏ không gộp số lượng mà tạo dòng mới | High / P1 | Observed |
| [FR07-BUG-002](#fr07-bug-002) | Bảng giỏ hàng thiếu các nút điều khiển '+' và '-' để chỉnh số lượng | High / P1 | Observed |
| [FR07-BUG-003](#fr07-bug-003) | Nút Xóa sản phẩm xóa lập tức mà không có Dialog xác nhận | Medium / P2 | Observed |
| [FR07-BUG-004](#fr07-bug-004) | Sai tiêu đề cột 'Đơn giá' thành 'Giá' trên bảng giỏ hàng | Low / P3 | Observed |
| [FR07-BUG-005](#fr07-bug-005) | Nhãn hiển thị tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng' | Low / P3 | Observed |
| [FR07-BUG-006](#fr07-bug-006) | Giỏ hàng trống không có hình minh họa theo yêu cầu đặc tả | Low / P3 | Observed |
| [FR07-BUG-007](#fr07-bug-007) | [Dependency] Nút 'Thêm vào giỏ hàng' không hoạt động ở lần bấm đầu tiên | High / P1 | Observed |
| [FR07-BUG-008](#fr07-bug-008) | Nhãn nút quay lại trang chủ trên giỏ hàng có sản phẩm bị sai thành '← Mua tiếp' thay vì 'Tiếp tục mua sắm' | Low / P3 | Observed |
| [FR15-BUG-001](#fr15-bug-001) | Không kiểm tra đầy đủ tên bắt buộc và giới hạn 255 ký tự | High / P1 | Observed |
| [FR15-BUG-002](#fr15-bug-002) | Không kiểm tra đầy đủ giá bắt buộc, dạng số và điều kiện lớn hơn 0 | High / P1 | Observed |
| [FR15-BUG-003](#fr15-bug-003) | Cho phép lưu sản phẩm với danh mục bị thiếu hoặc không tồn tại | High / P1 | Observed |
| [FR15-BUG-004](#fr15-bug-004) | Sửa một sản phẩm làm sai tên sản phẩm khác và để dữ liệu UI của target bị cũ | High / P1 | Observed |
| [FR15-BUG-005](#fr15-bug-005) | [Dependency FR-12] API ghi sản phẩm không chặn token thiếu, lỗi hoặc không có quyền admin | High / P1 | Observed |

## Môi trường và nguyên tắc tái hiện

<a id="env-fr03"></a>

### ENV-FR03

API `http://localhost:3000`, customer WEB `http://localhost:5173/forgot-password`; Node v22.17.1 và Playwright Chromium headless theo hồ sơ gốc. SQLite/React/Vite. Chưa có manifest xác nhận build SHA, OS, browser version, viewport và locale của lượt chạy; không gán HEAD hiện tại làm build lịch sử. [API observations](fr03/evidence/api/observations.json), [WEB observations](fr03/evidence/web/observations.json).

<a id="env-fr05"></a>

### ENV-FR05

Native iOS: iPhone 18 Pro Simulator, iOS 27.0, Expo Go 54.0.7, app SDK 54, React Native 0.81.5. Build nguồn `f74658aa9232d117ddd400e954db18b6ce81abeb`; proxy API `http://127.0.0.1:3002/api`, upstream `http://127.0.0.1:3000/api`, image server port 3001. Backend/mobile copy cô lập, endpoint được điều chỉnh trên bản copy. [Manifest run01](fr05/evidence/fr05-run01/manifest.json), [endpoint adjustment](fr05/evidence/fr05-run01/environment-adjustment.diff), [runbook](../../tests/fr05/native-runbook.md). Không suy kết quả native thành Android hay Expo web.

<a id="env-fr07"></a>

### ENV-FR07

Run `fr07-run01`, build `478c859708494fe411405c51d5ca5b643e1d6659`; Node v20.x HTTP runner, Python 3.11/Playwright Chromium, viewport 1280×800, locale vi-VN. API `http://localhost:3000`; WEB `http://127.0.0.1:5173`. Backend/SQLite cô lập. OS và phiên bản Chromium cụ thể chưa ghi trong [manifest](fr07/evidence/fr07-run01/manifest.json).

<a id="env-fr15"></a>

### ENV-FR15

Run `fr15-run03`, commit nền `5f9c73bf093c47e58188b46d20514b71149fb461`, có dirty paths/hash harness được ghi riêng; không coi commit SHA là toàn bộ trạng thái build. Node v22.17.1, Python 3.13.12; Playwright Chromium 153.0.8010.12, viewport 1440×1000, locale vi-VN. API `http://localhost:3000`; Admin `http://127.0.0.1:5174`. [Manifest](fr15/evidence/fr15-run03/manifest.json), [browser metadata](fr15/evidence/fr15-run03/web/browser.json).

## FR-03

<a id="bug-fr03-01"></a>

### BUG-FR03-01 — Backend cấp phát mã OTP 4 chữ số thay vì 6 chữ số ngẫu nhiên

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-01` |
| Feature / loại lỗi | FR-03; Functional |
| Tầng / interface | API / WEB |
| Rule ID | R02 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-DT-001` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** OTP phát ra không đáp ứng độ dài yêu cầu.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Tài khoản fr03-a@example.com tồn tại, mật khẩu hiện tại OldPass1!

**Test data / inputs:**

{ "email": "fr03-a@example.com" } gửi tới POST /api/forgot-password

**Steps to reproduce:**

1. Gửi request HTTP POST tới `/api/forgot-password` với email của tài khoản A.
2. Ghi nhận response code và body.
3. Kiểm tra mã OTP trả về và truy vấn CSDL để xác minh token được gán cho tài khoản A.
4. Xác minh mật khẩu của tài khoản A không bị thay đổi.

**Expected Result:**

- HTTP Status: 200 OK.
- Body chứa `resetToken` là chuỗi gồm đúng 6 chữ số (`^[0-9]{6}$`).
- CSDL lưu `reset_token` khớp với mã trả về; mật khẩu của tài khoản A vẫn là `OldPass1!`.

**Actual Result:**

API trả OTP 7257; lượt WEB độc lập hiển thị 6429. Cả hai đều có 4 chữ số. Không dùng hai observation để kết luận chất lượng ngẫu nhiên.

HTTP 200; response=`{"message": "Mã đặt lại mật khẩu đã được tạo", "resetToken": "7257"}`
Password trước/sau: A `"OldPass1!"` → `"OldPass1!"`; B `"OldPass1!"` → `"OldPass1!"`

**Evidence bổ sung:**

- [observations.json](fr03/evidence/api/observations.json)
- [FR03-TC-037.png](fr03/evidence/web/screenshots/FR03-TC-037.png)

**Related test cases (ID trong report):** `FR03-DT-001`, `FR03-DT-025`.

<a id="bug-fr03-02"></a>

### BUG-FR03-02 — API chấp nhận mật khẩu mới vi phạm độ dài hoặc độ mạnh

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-02` |
| Feature / loại lỗi | FR-03; Functional / Security |
| Tầng / interface | API |
| Rule ID | R06, R07 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-BVA-004` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Cho phép đặt mật khẩu không đáp ứng chính sách độ mạnh.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Tài khoản A có token hợp lệ 123456

**Test data / inputs:**

Fixture/inputs nguồn: `{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": ""}`

**Steps to reproduce:**

1. POST /api/reset-password với mật khẩu rỗng độ dài 0
2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected.

**Expected Result:**

Yêu cầu bị từ chối, mật khẩu A giữ nguyên

**Actual Result:**

API trả HTTP 200 và cập nhật password thành giá trị không hợp lệ, gồm chuỗi rỗng ở case đại diện.

HTTP 200; response=`{"message": "Password reset successfully"}`
Password trước/sau: A `"OldPass1!"` → `""`; B `"OldPass1!"` → `"OldPass1!"`
[evidence FR03-BVA-004](fr03/evidence/api/observations.json)

**Evidence bổ sung:**

- [observations.json](fr03/evidence/api/observations.json)

**Related test cases (ID trong report):** `FR03-DT-004`, `FR03-BVA-002`, `FR03-BVA-004`, `FR03-BVA-005`, `FR03-BVA-006`, `FR03-DT-007`, `FR03-BVA-007`, `FR03-DT-008`, `FR03-BVA-009`, `FR03-DT-009`, `FR03-BVA-012`, `FR03-DT-010`, `FR03-BVA-014`, `FR03-DT-017`.

<a id="bug-fr03-03"></a>

### BUG-FR03-03 — Giao diện Web thiếu chỉ báo bước (Step Indicator)

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-03` |
| Feature / loại lỗi | FR-03; UI |
| Tầng / interface | WEB |
| Rule ID | R03 |
| Severity | Low |
| Priority đề xuất | P3 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-DT-025` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Người dùng thiếu thông tin vị trí trong luồng hai bước.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Tài khoản A tồn tại trong hệ thống

**Test data / inputs:**

`{"email": "fr03-a@example.com"}`

**Steps to reproduce:**

1. Truy cập /forgot-password, quan sát chỉ báo bước 1, nhập email A, click gửi, quan sát chỉ báo bước 2 và hiển thị OTP demo
2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối.

**Expected Result:**

Giao diện hiển thị rõ chỉ báo Bước 1 / 2 sau đó Bước 2 / 2; thông báo OTP demo hiển thị đúng định dạng 6 chữ số

**Actual Result:**

Giao diện không có chỉ báo bước theo observation/DOM lịch sử.

Giao diện thiếu chỉ báo bước (Step indicator 'Bước 1 / 2' hoặc 'Bước 2 / 2'); Mã OTP demo '6429' có độ dài 4, không đúng 6 chữ số theo R02
[evidence FR03-DT-025](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-037.png)

**Evidence bổ sung:**

- [FR03-TC-037.png](fr03/evidence/web/screenshots/FR03-TC-037.png)

**Related test cases (ID trong report):** `FR03-DT-025`.

<a id="bug-fr03-04"></a>

### BUG-FR03-04 — Nghi vấn thiếu liên kết quay lại đăng nhập trong form bước 1

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-04` |
| Feature / loại lỗi | FR-03; UI / Navigation |
| Tầng / interface | WEB |
| Rule ID | R04 |
| Severity | Medium |
| Priority đề xuất | P2 |
| Status / mức xác nhận | Suspected — chưa đủ bằng chứng xác nhận lỗi |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-DT-026` — Status gốc: Passed |

**Mô tả và ảnh hưởng:** Có thể thiếu lối quay lại đăng nhập trong form; ảnh hưởng thực tế chưa được xác nhận.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Đang ở trang /forgot-password

**Test data / inputs:**


**Steps to reproduce:**

1. Click nút/liên kết 'Quay lại đăng nhập' tại Bước 1
2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối.

**Expected Result:**

Trình duyệt điều hướng thành công về URL /login

**Actual Result:**

Form bước 1 không có nút riêng, nhưng test selector rộng đã điều hướng qua liên kết Đăng nhập chung và có verdict Passed. Chưa đủ căn cứ xác nhận lỗi.

Chuyển hướng về /login thành công.
Giới hạn: selector rộng có thể click link Đăng nhập trên nav; chưa xác nhận control riêng trong form.
[evidence FR03-DT-026](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-038.png)

**Evidence bổ sung:**

- [FR03-TC-038.png](fr03/evidence/web/screenshots/FR03-TC-038.png)

**Related test cases (ID trong report):** `FR03-DT-026`.

**Tái lập và giới hạn:** Case gốc Passed; chưa xác nhận lỗi. Cần probe riêng selector trong form và làm rõ liệu liên kết Đăng nhập chung đã đáp ứng requirement. Không dùng việc thiếu nút trong form để ghi một lỗi đã confirmed.

**Workaround / hướng xử lý:** Làm rõ oracle/bằng chứng trước khi quyết định sửa.

<a id="bug-fr03-05"></a>

### BUG-FR03-05 — Form Bước 2 hoàn toàn thiếu trường "Xác nhận mật khẩu mới"

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-05` |
| Feature / loại lỗi | FR-03; Functional / UI |
| Tầng / interface | WEB |
| Rule ID | R08 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-DT-032` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Không thể nhập và kiểm tra xác nhận mật khẩu; chặn năm case xác nhận.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Tại Bước 2 giao diện ForgotPassword

**Test data / inputs:**

Kiểm sự hiện diện control xác nhận; không đồng nhất với một lần submit confirmation rỗng.

**Steps to reproduce:**

1. Kiểm tra cấu trúc DOM: kiểm tra sự hiện diện của input 'Xác nhận mật khẩu mới' và thử submit để trống
2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối.

**Expected Result:**

Trường input xác nhận mật khẩu hiện diện trong DOM; không thể submit nếu để trống

**Actual Result:**

Form bước 2 thiếu trường Xác nhận mật khẩu mới; chỉ thấy trường OTP và Mật khẩu mới.

Trường 'Xác nhận mật khẩu mới' hoàn toàn không tồn tại trong form Bước 2 (Chỉ có trường OTP và 1 trường mật khẩu)
[evidence FR03-DT-032](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-044.png)

**Evidence bổ sung:**

- [FR03-TC-044.png](fr03/evidence/web/screenshots/FR03-TC-044.png)

**Related test cases (ID trong report):** `FR03-DT-027`, `FR03-DT-028`, `FR03-DT-029`, `FR03-DT-030`, `FR03-DT-031`, `FR03-DT-032`.


<a id="bug-fr03-06"></a>

### BUG-FR03-06 — Regex kiểm tra mật khẩu phía Frontend Web bị lỗi ngược (Yêu cầu khoảng trắng, từ chối ký tự đặc biệt)

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-06` |
| Feature / loại lỗi | FR-03; Functional / Validation |
| Tầng / interface | WEB |
| Rule ID | R07 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR03](#env-fr03) |
| Case đại diện | `FR03-DT-033` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Mật khẩu hợp lệ bị chặn; giá trị dùng khoảng trắng lại vượt qua kiểm tra WEB.

**Requirement / test oracle:** README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Tài khoản A có token 123456

**Test data / inputs:**

`{"newPassword": "Abcdef1@"}`

**Steps to reproduce:**

1. Tại Bước 2, nhập mật khẩu có ký tự @ Abcdef1@, click Đặt lại
2. Lưu dialog/screenshot và request nếu có; phân biệt control vắng mặt với submit bị từ chối.

**Biến thể đối chiếu trong cùng nhóm:** thử lần lượt `Abcdef1@`, `Abcdef1$`, `Abcdef1!`, `Abcdef1%`, `Abcdef1*`, `Abcdef1?`, `Abcdef1&` và `Abcdef1 ` (có khoảng trắng cuối). Reset fixture/token và mở lại bước 2 độc lập trước mỗi lần thử; ghi nhận alert và request thực tế. Các ca thiếu confirmPassword bị Blocked được liên kết với BUG-FR03-05, không gán kết quả của chúng cho bug này.

**Expected Result:**

Form chấp nhận mật khẩu hợp lệ

**Actual Result:**

WEB chặn các mật khẩu có ký tự đặc biệt hợp lệ; Abcdef1 với khoảng trắng cuối được thông báo đổi thành công. Không suy ra snapshot DB cho mọi case UI.

Mật khẩu hợp lệ 'Abcdef1@' bị form từ chối do regex lỗi phía client đòi hỏi khoảng trắng thay vì ký tự đặc biệt (Alert: 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.')
[evidence FR03-DT-033](fr03/evidence/web/observations.json) [ảnh/log chi tiết](fr03/evidence/web/screenshots/FR03-TC-045.png)

**Evidence bổ sung:**

- [FR03-TC-045.png](fr03/evidence/web/screenshots/FR03-TC-045.png)
- [FR03-TC-052.png](fr03/evidence/web/screenshots/FR03-TC-052.png)

**Related test cases (ID trong report):** `FR03-DT-033`, `FR03-DT-034`, `FR03-DT-035`, `FR03-DT-036`, `FR03-DT-037`, `FR03-DT-038`, `FR03-DT-039`, `FR03-DT-040`.

## FR-05

<a id="fr05-bug-001"></a>

### FR05-BUG-001 — Search tên chứa apostrophe trả Database Error

| Trường | Nội dung |
|---|---|
| Bug ID | `FR05-BUG-001` |
| Feature / loại lỗi | FR-05; Functional |
| Tầng / interface | Native iOS / API hỗ trợ |
| Rule ID | FR05-R05 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR05](#env-fr05) |
| Case đại diện | `FR05-DT-006` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Không tìm được tên sản phẩm hợp lệ chứa dấu nháy; lộ chi tiết lỗi database.

**Requirement / test oracle:** README FR-05; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Target native/build/locale/network như manifest.
Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
Catalog snapshot=full theo FR05-F; reset riêng trước case.
Native iOS theo manifest; API supporting không thay thế UI native.

**Test data / inputs:**

Snapshot `full`; inputs=`{"search": "O'Brien", "mode": "search"}`

**Steps to reproduce:**

1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
3. Nhập chính xác "O'Brien" vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.

**Expected Result:**

Full-name search "O'Brien" trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự.
Assertions nguồn: `{"oracleKind": "explicit", "ids": [105], "count": 1}`

**Actual Result:**

Tìm O'Brien hiển thị markup Database Error dạng text; API trả 500 với SQLITE_ERROR gần Brien. Không có bằng chứng HTML/XSS execution.

App hiển thị nguyên chuỗi &lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near "Brien": syntax error&lt;/p&gt; thay vì card O'Brien.
[evidence FR05-DT-006](fr05/evidence/fr05-run02/cumulative-observations.json)
[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-006.ax.txt)

**Evidence bổ sung:**

- [native AX](fr05/evidence/fr05-run01/native/FR05-TC-006.ax.txt)
- [API](fr05/evidence/fr05-run01/api/FR05-TC-039.json)
- [HTTP repro](fr05/evidence/fr05-run01/api/quote-reproduction.txt)
- [Native quote search error](fr05/evidence/fr05-run01/native/FR05-TC-006.png)

**Related test cases (ID trong report):** `FR05-DT-006`, `FR05-DT-029`.

<a id="fr05-bug-002"></a>

### FR05-BUG-002 — Mobile không bảo toàn reserved characters trong search query

| Trường | Nội dung |
|---|---|
| Bug ID | `FR05-BUG-002` |
| Feature / loại lỗi | FR-05; Functional / Integration |
| Tầng / interface | Native iOS; API encoded là đối chứng |
| Rule ID | FR05-R05 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR05](#env-fr05) |
| Case đại diện | `FR05-DT-007` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Tìm tên chứa ký tự URL trả sai hoặc thiếu sản phẩm.

**Requirement / test oracle:** README FR-05; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Target native/build/locale/network như manifest.
Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
Catalog snapshot=full theo FR05-F; reset riêng trước case.
Native iOS theo manifest; API supporting không thay thế UI native.

**Test data / inputs:**

Snapshot `full`; inputs=`{"search": "A&amp;B", "mode": "search"}`

**Steps to reproduce:**

1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
3. Nhập chính xác 'A&amp;B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.

**Expected Result:**

Full-name search 'A&amp;B' trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự.
Assertions nguồn: `{"oracleKind": "explicit", "ids": [106], "count": 1}`

**Actual Result:**

A&B và A#B trả danh sách theo A; A+B trả rỗng. API hỗ trợ có encode đúng trả các ID tương ứng 106/107/108.

Keyword A&amp;B nhưng có Alpha/Beta/A+B/A#B và tên khác; không chỉ A&amp;B. API encode đúng case040 đã pass.
[evidence FR05-DT-007](fr05/evidence/fr05-run02/cumulative-observations.json)
[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-007.ax.txt)

**Evidence bổ sung:**

- [A&B AX](fr05/evidence/fr05-run01/native/FR05-TC-007.ax.txt)
- [A+B AX](fr05/evidence/fr05-run01/native/FR05-TC-008.ax.txt)
- [A#B AX](fr05/evidence/fr05-run01/native/FR05-TC-009.ax.txt)
- [API encoded](fr05/evidence/fr05-run01/api/FR05-TC-040.json)
- [Native A#B returns unrelated products](fr05/evidence/fr05-run01/native/FR05-TC-009.png)

**Related test cases (ID trong report):** `FR05-DT-007`, `FR05-DT-008`, `FR05-DT-009`, `FR05-DT-030`, `FR05-DT-031`, `FR05-DT-032`.

**Tái lập và giới hạn:** Đã quan sát trong case đại diện và các biến thể liên quan ở run nguồn; không có phép đo tỷ lệ tái hiện hoặc retest mới. Các case Passed/Blocked liên quan là đối chứng hoặc bị chặn, không tự đổi thành Failed.

**Workaround / hướng xử lý:** Chưa xác minh workaround chung trong hồ sơ; ưu tiên sửa và regression test theo rule bị vi phạm.

**Nguồn và tình trạng retest:** [Hồ sơ gốc FR-05](fr05/bugs.md). Chưa có bản sửa/retest được xác nhận trong tài liệu này. Phân tích code trong hồ sơ gốc là bằng chứng hỗ trợ, không tự chứng minh nguyên nhân của mọi case cùng nhóm.

<a id="fr05-bug-003"></a>

### FR05-BUG-003 — Search success rỗng không có empty state

| Trường | Nội dung |
|---|---|
| Bug ID | `FR05-BUG-003` |
| Feature / loại lỗi | FR-05; UI / Functional |
| Tầng / interface | Native iOS |
| Rule ID | FR05-R08 |
| Severity | Medium |
| Priority đề xuất | P2 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR05](#env-fr05) |
| Case đại diện | `FR05-DT-003` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Người dùng không biết tìm kiếm đã hoàn tất nhưng không có kết quả.

**Requirement / test oracle:** README FR-05; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Target native/build/locale/network như manifest.
Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
Catalog snapshot=full theo FR05-F; reset riêng trước case.
Native iOS theo manifest; API supporting không thay thế UI native.

**Test data / inputs:**

Snapshot `full`; inputs=`{"search": "ZZZ_NO_MATCH", "mode": "search"}`

**Steps to reproduce:**

1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.

**Expected Result:**

Không có card; có thông báo empty state khi response thành công rỗng.
Assertions nguồn: `{"oracleKind": "explicit", "ids": [], "count": 0}`

**Actual Result:**

Sau response 200 [] và loading kết thúc, giao diện chỉ để vùng trống, không có empty message.

Response success rỗng, vùng kết quả trống hoàn toàn; không có thông báo empty state trong screenshot/AX.
[evidence FR05-DT-003](fr05/evidence/fr05-run02/cumulative-observations.json)
[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-003.ax.txt)

**Evidence bổ sung:**

- [no-match AX](fr05/evidence/fr05-run01/native/FR05-TC-003.ax.txt)
- [BVA0 AX](fr05/evidence/fr05-run01/native/FR05-TC-028.ax.txt)
- [pending](fr05/evidence/fr05-run01/native/FR05-TC-017-pending.ax.txt)
- [after delay](fr05/evidence/fr05-run01/native/FR05-TC-017-after-delay.ax.txt)
- [Native blank result without empty message](fr05/evidence/fr05-run01/native/FR05-TC-003.png)

**Related test cases (ID trong report):** `FR05-DT-003`, `FR05-DT-004`, `FR05-DT-017`, `FR05-DT-018`, `FR05-BVA-001`, `FR05-DT-023`.

<a id="fr05-bug-004"></a>

### FR05-BUG-004 — Ảnh nguồn vuông bị stretch thành hình chữ nhật

| Trường | Nội dung |
|---|---|
| Bug ID | `FR05-BUG-004` |
| Feature / loại lỗi | FR-05; UI |
| Tầng / interface | Native iOS |
| Rule ID | FR05-R02 |
| Severity | Medium |
| Priority đề xuất | P2 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR05](#env-fr05) |
| Case đại diện | `FR05-DT-012` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Hình ảnh sản phẩm bị biến dạng.

**Requirement / test oracle:** README FR-05; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Target native/build/locale/network như manifest.
Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
Catalog snapshot=images theo FR05-F; reset riêng trước case.
Native iOS theo manifest; API supporting không thay thế UI native.

**Test data / inputs:**

Snapshot `images`; inputs=`{"search": null, "mode": "home"}`

**Steps to reproduce:**

1. Reset backend về snapshot images; kiểm tra row count và hash fixture.
2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
4. Cuộn từng card Square/Wide/Tall và chụp ảnh cùng asset dimensions.

**Expected Result:**

Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse.
Assertions nguồn: `{"oracleKind": "explicit"}`

**Actual Result:**

Hình tròn của ảnh Square 120×120 thành ellipse ngang trên card. Chưa kết luận ảnh Tall hoặc mọi tỷ lệ đều bị lỗi.

Snapshot images có Square/Wide/Tall. Screenshot Square từ PNG120×120 có hình tròn nhưng native kéo thành ellipse ngang. Wide thấy một phần; Tall chưa kiểm hình do scroll tool bị chặn. Một ảnh đã vi phạm đủ để case Failed.
[evidence FR05-DT-012](fr05/evidence/fr05-run02/cumulative-observations.json)
[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-012.ax.txt)

**Evidence bổ sung:**

- [square.png](../../tests/fr05/fixtures/images/square.png)
- [native AX](fr05/evidence/fr05-run01/native/FR05-TC-012.ax.txt)
- [asset metadata](../../tests/fr05/fixtures/catalog.json)
- [Square source stretched in native card](fr05/evidence/fr05-run01/native/FR05-TC-012.png)

**Related test cases (ID trong report):** `FR05-DT-002`, `FR05-DT-012`.

<a id="fr05-bug-005"></a>

### FR05-BUG-005 — Response cũ ghi đè card trong khi keyword vẫn là query mới

| Trường | Nội dung |
|---|---|
| Bug ID | `FR05-BUG-005` |
| Feature / loại lỗi | FR-05; Functional / Concurrency |
| Tầng / interface | Native iOS |
| Rule ID | FR05-R05 (derived) |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed discrepancy — oracle suy luận, chờ xác nhận |
| Environment / build | [ENV-FR05](#env-fr05) |
| Case đại diện | `FR05-SUP-002` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Danh sách không tương ứng từ khóa người dùng đang xem.

**Requirement / test oracle:** README FR-05; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md). Oracle latest-query-wins là suy luận; đặc tả chưa nêu chính sách response race.

**Preconditions / fixture:**

Target native/build/locale/network như manifest.
Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
Catalog snapshot=full theo FR05-F; reset riêng trước case.
Native iOS theo manifest; API supporting không thay thế UI native.

**Test data / inputs:**

Snapshot `full`; inputs=`{"search": "Alpha", "mode": "search"}`

**Steps to reproduce:**

1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
4. Proxy hold Alpha, gửi Beta, release Beta rồi Alpha; lưu thứ tự request/response.

**Expected Result:**

Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta.
Assertions nguồn: `{"oracleKind": "derived"}`

**Actual Result:**

Beta hiển thị trước; khi response Alpha cũ tới, nhãn/keyword vẫn Beta nhưng card thành Alpha giá 999₫.

Beta trả trước và từng hiển thị Beta; sau khi Alpha cũ trả về, ô/nhãn vẫn Beta nhưng card đổi thành Alpha giá 999 ₫. Đây là derived latest-query-wins oracle.
[evidence FR05-SUP-002](fr05/evidence/fr05-run02/cumulative-observations.json)
[ảnh/log chi tiết](fr05/evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt)

**Evidence bổ sung:**

- [Beta first](fr05/evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt)
- [final AX](fr05/evidence/fr05-run01/native/FR05-TC-019-final.ax.txt)
- [raw order](fr05/evidence/fr05-run01/requests.jsonl)
- [Beta keyword with stale Alpha card](fr05/evidence/fr05-run01/native/FR05-TC-019-final.png)

**Related test cases (ID trong report):** `FR05-SUP-002`.

## FR-07

<a id="fr07-bug-001"></a>

### FR07-BUG-001 — Thêm cùng sản phẩm vào giỏ không gộp số lượng mà tạo dòng mới

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-001` |
| Feature / loại lỗi | FR-07; Functional |
| Tầng / interface | API / WEB |
| Rule ID | FR07-R02 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-009` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Giỏ có nhiều dòng trùng sản phẩm, không đúng quy tắc cộng dồn số lượng.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

User đăng nhập hợp lệ, giỏ hàng trên server đang có A với q=1 (r=1).

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Sản phẩm A (id=1, price=100000)."`
Request thực tế lịch sử: `{"method": "POST", "path": "/api/cart", "body": {"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}, "headers": {"Authorization": "Bearer [REDACTED]", "Content-Type": "application/json"}}`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. POST /api/cart body {id:1, name:"Sản phẩm A", price:100000, quantity:1}
2. GET /api/cart

**Expected Result:**

Giỏ hàng trên server chỉ có đúng 1 dòng cho A, số lượng gộp thành 2.

**Actual Result:**

API và WEB tạo các dòng riêng cho cùng sản phẩm thay vì một dòng có tổng quantity.

Cart contains 2 rows; items: [{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1},{"id":1,"name":"Sản phẩm A","price":100000,"quantity":1}]
[evidence FR07-DT-009](fr07/evidence/fr07-run01/api/observations.json)

**Evidence bổ sung:**

- [FR07-TC-014_cart_state.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png)
- [API observations — FR07-TC-009](fr07/evidence/fr07-run01/api/observations.json)

**Related test cases (ID trong report):** `FR07-DT-009`, `FR07-BVA-006`, `FR07-DT-010`, `FR07-BVA-008`, `FR07-DT-012`, `FR07-BVA-009`, `FR07-DT-013`, `FR07-BVA-010`, `FR07-DT-014`.

<a id="fr07-bug-002"></a>

### FR07-BUG-002 — Bảng giỏ hàng thiếu các nút điều khiển '+' và '-' để chỉnh số lượng

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-002` |
| Feature / loại lỗi | FR-07; Functional / UI |
| Tầng / interface | WEB |
| Rule ID | FR07-R03 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-016` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Người dùng không chỉnh được số lượng trực tiếp trong giỏ; chặn hai case tương tác.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng có Sản phẩm A (q=2).

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Sản phẩm A (id=1, q=2)."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở /cart
2. Kiểm tra phần tử tại cột Số lượng dòng Sản phẩm A

**Expected Result:**

Tồn tại cả nút + (tăng) và nút - (giảm) cho phép người dùng bấm chỉnh số lượng.

**Actual Result:**

Cột Số lượng chỉ có text, thiếu nút + và −.

Missing controls: '+' count=0, '-' count=0 (R03 violation: No +/- buttons implemented)
[evidence FR07-DT-016](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png)

**Evidence bổ sung:**

- [FR07-TC-020_check_controls.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png)

**Related test cases (ID trong report):** `FR07-DT-016`, `FR07-DT-017`, `FR07-DT-018`.

<a id="fr07-bug-003"></a>

### FR07-BUG-003 — Nút Xóa sản phẩm xóa lập tức mà không có Dialog xác nhận

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-003` |
| Feature / loại lỗi | FR-07; Functional / UI |
| Tầng / interface | WEB |
| Rule ID | FR07-R04 |
| Severity | Medium |
| Priority đề xuất | P2 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-019` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Có thể xóa nhầm vì không có bước xác nhận; chặn case confirm/cancel.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng có Sản phẩm A và Sản phẩm B.

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Nominal cart A(2), B(1)."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở /cart
2. Bấm nút Xóa tại dòng Sản phẩm A

**Expected Result:**

Xuất hiện dialog/modal xác nhận xóa trước khi thực hiện, có các nút Confirm và Cancel.

**Actual Result:**

Bấm Xóa làm dòng sản phẩm biến mất ngay, không hiện dialog xác nhận.

No confirmation dialog appeared! Item was deleted directly without confirmation (R04 violation)
[evidence FR07-DT-019](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-023_before_delete.png)

**Evidence bổ sung:**

- [FR07-TC-023_before_delete.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-023_before_delete.png)
- [FR07-TC-023_after_delete_click.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-023_after_delete_click.png)

**Related test cases (ID trong report):** `FR07-DT-019`, `FR07-DT-020`, `FR07-DT-021`.

<a id="fr07-bug-004"></a>

### FR07-BUG-004 — Sai tiêu đề cột 'Đơn giá' thành 'Giá' trên bảng giỏ hàng

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-004` |
| Feature / loại lỗi | FR-07; UI / Copy |
| Tầng / interface | WEB |
| Rule ID | FR07-R01 |
| Severity | Low |
| Priority đề xuất | P3 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-023` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Nhãn cột không đúng đặc tả.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng có sản phẩm.

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Nominal cart A(2), B(1)."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở /cart
2. Kiểm tra tên các tiêu đề cột của bảng

**Expected Result:**

Bảng hiển thị đầy đủ 5 cột chính xác: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác.

**Actual Result:**

Tiêu đề cột hiển thị Giá thay vì Đơn giá.

Observed headers: ['Sản phẩm', 'Giá', 'Số lượng', 'Thành tiền', 'Thao tác']. Discrepancy: 'Giá' was used instead of 'Đơn giá' (R01 violation)
[evidence FR07-DT-023](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png)

**Evidence bổ sung:**

- [FR07-TC-027_columns.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png)

**Related test cases (ID trong report):** `FR07-DT-023`.

<a id="fr07-bug-005"></a>

### FR07-BUG-005 — Nhãn hiển thị tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng'

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-005` |
| Feature / loại lỗi | FR-07; UI / Copy |
| Tầng / interface | WEB |
| Rule ID | FR07-R06 |
| Severity | Low |
| Priority đề xuất | P3 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-024` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Nhãn tổng tiền không đúng yêu cầu đã nêu rõ.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng có sản phẩm.

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Nominal cart A(2), B(1)."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở /cart
2. Kiểm tra nhãn hiển thị tổng số tiền

**Expected Result:**

Nhãn hiển thị chính xác là "Tổng cộng" (không phải "Tổng tạm tính").

**Actual Result:**

Hiển thị Tổng tạm tính: thay vì Tổng cộng.

Observed 'Tổng tạm tính' instead of 'Tổng cộng' (R06 violation)
[evidence FR07-DT-024](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png)

**Evidence bổ sung:**

- [FR07-TC-028_total_label.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png)

**Related test cases (ID trong report):** `FR07-DT-024`.

<a id="fr07-bug-006"></a>

### FR07-BUG-006 — Giỏ hàng trống không có hình minh họa theo yêu cầu đặc tả

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-006` |
| Feature / loại lỗi | FR-07; UI |
| Tầng / interface | WEB |
| Rule ID | FR07-R07 |
| Severity | Low |
| Priority đề xuất | P3 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-001` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Thiếu hình minh họa ở trạng thái giỏ trống.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Phiên duyệt mới, giỏ hàng React rỗng (n=0).

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Giỏ rỗng."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở trang chủ /
2. Điều hướng tới trang giỏ hàng /cart
3. Quan sát nội dung trang

**Expected Result:**

Hiển thị hình minh họa giỏ hàng trống và thông báo rõ ràng; không hiển thị bảng sản phẩm và tổng tiền.

**Actual Result:**

Giỏ trống chỉ có thông báo chữ và liên kết, không có hình minh họa.

Message: True, Illustration: False (Missing illustration!), No Table: True
[evidence FR07-DT-001](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png)

**Evidence bổ sung:**

- [FR07-TC-001_view_empty.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png)

**Related test cases (ID trong report):** `FR07-DT-001`, `FR07-BVA-001`.

<a id="fr07-bug-007"></a>

### FR07-BUG-007 — [Dependency] Nút 'Thêm vào giỏ hàng' không hoạt động ở lần bấm đầu tiên

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-007` |
| Feature / loại lỗi | FR-07; Functional / Dependency FR-06 |
| Tầng / interface | WEB |
| Rule ID | FR06-Q (dependency) |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-002` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Lần bấm đầu không thêm được sản phẩm.

**Requirement / test oracle:** README FR-07; dependency FR-06. Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng ban đầu rỗng (n=0, r=0).

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Sản phẩm A (id=1, p=100000₫)."`
Request thực tế lịch sử: `{"productId": 1, "quantityInput": 1, "clicks": 1}`; d=1

**Steps to reproduce:**

1. Vào /product/1
2. Nhập số lượng d=1
3. Bấm Thêm vào giỏ hàng
4. Mở /cart

**Expected Result:**

Chuyển sang bảng giỏ hàng có 1 dòng A, số lượng 1, Thành tiền 100000₫, Tổng cộng 100000₫, không còn thông báo giỏ trống.

**Actual Result:**

Sau một lần bấm Thêm vào giỏ hàng, giỏ vẫn trống; observation cần lần bấm thứ hai.

Clicking 'Thêm vào giỏ hàng' 1 time did not add product to cart (Cart remains empty). Root cause: ProductDetail.jsx clickCount dependency bug.
[evidence FR07-DT-002](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_detail_before_add.png)

**Evidence bổ sung:**

- [FR07-TC-002_cart_result.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-002_cart_result.png)

**Related test cases (ID trong report):** `FR07-DT-002`, `FR07-BVA-002`, `FR07-DT-004`, `FR07-BVA-004`, `FR07-DT-006`.

<a id="fr07-bug-008"></a>

### FR07-BUG-008 — Nhãn nút quay lại trang chủ trên giỏ hàng có sản phẩm bị sai thành '← Mua tiếp' thay vì 'Tiếp tục mua sắm'

| Trường | Nội dung |
|---|---|
| Bug ID | `FR07-BUG-008` |
| Feature / loại lỗi | FR-07; UI / Copy |
| Tầng / interface | WEB |
| Rule ID | FR07-R05 |
| Severity | Low |
| Priority đề xuất | P3 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR07](#env-fr07) |
| Case đại diện | `FR07-DT-025` — Status gốc: Passed |

**Mô tả và ảnh hưởng:** Nhãn điều hướng không nhất quán giữa giỏ trống và có hàng.

**Requirement / test oracle:** README FR-07; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Giỏ hàng WEB có ít nhất một sản phẩm; mở /cart. Giữ thêm trạng thái giỏ trống để đối chiếu nhãn.

**Test data / inputs:**

Dữ liệu/thao tác nguồn: `"Bất kỳ trạng thái giỏ nào."`; action/giá trị thao tác theo Test Steps

**Steps to reproduce:**

1. Mở /cart khi giỏ có hàng.
2. Quan sát nhãn liên kết quay về trang chủ bên dưới bảng.
3. Đối chiếu với yêu cầu nhãn và trạng thái giỏ trống; nếu bấm liên kết, kiểm tra điều hướng như một assertion riêng.

**Expected Result:**

Liên kết hiển thị nhãn "Tiếp tục mua sắm" và điều hướng về trang chủ /.

**Actual Result:**

Giỏ có hàng dùng ← Mua tiếp; trạng thái trống dùng Tiếp tục mua sắm. Điều hướng vẫn hoạt động.

Button 'Tiếp tục mua sắm' navigated to http://127.0.0.1:5173/
[evidence FR07-DT-025](fr07/evidence/fr07-run01/web/observations.json) [ảnh/log chi tiết](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-029_before_click.png)

**Evidence bổ sung:**

- [FR07-TC-014_cart_state.png](fr07/evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png)

**Related test cases (ID trong report):** `FR07-DT-025`, `FR07-DT-012`, `FR07-BVA-009`, `FR07-DT-013`, `FR07-BVA-010`, `FR07-DT-014`, `FR07-DT-015`, `FR07-BVA-011`, `FR07-DT-016`.

## FR-15

<a id="fr15-bug-001"></a>

### FR15-BUG-001 — Không kiểm tra đầy đủ tên bắt buộc và giới hạn 255 ký tự

| Trường | Nội dung |
|---|---|
| Bug ID | `FR15-BUG-001` |
| Feature / loại lỗi | FR-15; Functional / Validation |
| Tầng / interface | API / Admin WEB |
| Rule ID | FR15-R05 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR15](#env-fr15) |
| Case đại diện | `FR15-DT-069` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Lưu được tên thiếu hoặc vượt giới hạn.

**Requirement / test oracle:** README FR-15; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

token partition=admin.
Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau.

**Test data / inputs:**

Input dự định: `{"body": {"name": repeat("A",256), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}`

**Steps to reproduce:**

1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.
2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.
3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.
4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate.

**Expected Result:**

Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.
Oracle nguồn: `{"outcome": "reject", "stateContract": "Create", "description": "Name single-boundary L=256; hold price/category/auth valid"}`; oracleStatus=`confirmed`

**Actual Result:**

Case đại diện thêm sản phẩm tên 256 ký tự, ID 304; số sản phẩm tăng 3→4 và tồn tại sau reload.

Quan sát: `{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}`
Assertion: Dữ liệu thay đổi dù input phải bị từ chối
Assertion: Không có tín hiệu từ chối phù hợp
Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng
Assertion: UI sau reload không khớp kết quả kỳ vọng
Snapshot: thêm IDs=`[304]`; xóa IDs=`[]`; sửa IDs=`[]`
Input thực tế sau nhập UI: `{"name": repeat("A",256), "price": "100000", "category_id": "10"}`
[evidence FR15-DT-069](fr15/evidence/fr15-run03/web/observations.json)
[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png)

**Evidence bổ sung:**

- [FR15-TC-075_immediate.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png)
- [FR15-TC-075_reload.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_reload.png)
- [FR15-TC-075.json](fr15/evidence/fr15-run03/web/FR15-TC-075.json)

**Related test cases (ID trong report):** `FR15-DT-002`, `FR15-BVA-001`, `FR15-DT-007`, `FR15-BVA-006`, `FR15-DT-013`, `FR15-DT-019`, `FR15-DT-020`, `FR15-DT-025`, `FR15-DT-026`, `FR15-DT-033`, `FR15-BVA-010`, `FR15-DT-038`, `FR15-BVA-015`, `FR15-DT-044`, `FR15-DT-050`, `FR15-DT-051`, `FR15-DT-056`, `FR15-DT-057`, `FR15-DT-069`, `FR15-BVA-024`, `FR15-DT-075`, `FR15-DT-082`, `FR15-DT-091`, `FR15-BVA-033`, `FR15-DT-097`, `FR15-DT-104`, `FR15-BVA-037`, `FR15-BVA-039`, `FR15-BVA-041`, `FR15-BVA-043`.

<a id="fr15-bug-002"></a>

### FR15-BUG-002 — Không kiểm tra đầy đủ giá bắt buộc, dạng số và điều kiện lớn hơn 0

| Trường | Nội dung |
|---|---|
| Bug ID | `FR15-BUG-002` |
| Feature / loại lỗi | FR-15; Functional / Validation |
| Tầng / interface | API / Admin WEB |
| Rule ID | FR15-R06 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR15](#env-fr15) |
| Case đại diện | `FR15-DT-070` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Lưu được giá không đáp ứng điều kiện bắt buộc và số dương.

**Requirement / test oracle:** README FR-15; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

token partition=admin.
Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau.

**Test data / inputs:**

Input dự định: `{"body": {"name": repeat("A",128), "price": -1, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}`

**Steps to reproduce:**

1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.
2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.
3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.
4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate.

**Expected Result:**

Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.
Oracle nguồn: `{"outcome": "reject", "stateContract": "Create", "description": "Price boundary p=-1; strict zero excludes equality"}`; oracleStatus=`confirmed`

**Actual Result:**

Case đại diện thêm sản phẩm giá −1, ID 304; số sản phẩm tăng 3→4.

Quan sát: `{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 3, "afterCount": 4, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 304}}}`
Assertion: Dữ liệu thay đổi dù input phải bị từ chối
Assertion: Không có tín hiệu từ chối phù hợp
Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng
Assertion: UI sau reload không khớp kết quả kỳ vọng
Snapshot: thêm IDs=`[304]`; xóa IDs=`[]`; sửa IDs=`[]`
Input thực tế sau nhập UI: `{"name": repeat("A",128), "price": "-1", "category_id": "10"}`
[evidence FR15-DT-070](fr15/evidence/fr15-run03/web/observations.json)
[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png)

**Evidence bổ sung:**

- [FR15-TC-076_immediate.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png)
- [FR15-TC-076_reload.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-076_reload.png)
- [FR15-TC-076.json](fr15/evidence/fr15-run03/web/FR15-TC-076.json)

**Related test cases (ID trong report):** `FR15-DT-008`, `FR15-BVA-007`, `FR15-DT-009`, `FR15-BVA-008`, `FR15-DT-014`, `FR15-DT-015`, `FR15-DT-017`, `FR15-DT-018`, `FR15-DT-020`, `FR15-DT-022`, `FR15-DT-024`, `FR15-DT-027`, `FR15-DT-028`, `FR15-DT-039`, `FR15-BVA-016`, `FR15-DT-040`, `FR15-BVA-017`, `FR15-DT-045`, `FR15-DT-046`, `FR15-DT-048`, `FR15-DT-049`, `FR15-DT-051`, `FR15-DT-053`, `FR15-DT-055`, `FR15-DT-058`, `FR15-DT-059`, `FR15-DT-070`, `FR15-BVA-025`, `FR15-DT-071`, `FR15-BVA-026`, `FR15-DT-076`, `FR15-DT-077`, `FR15-DT-079`, `FR15-DT-080`, `FR15-DT-082`, `FR15-DT-084`, `FR15-DT-092`, `FR15-BVA-034`, `FR15-DT-093`, `FR15-BVA-035`, `FR15-DT-098`, `FR15-DT-099`, `FR15-DT-101`, `FR15-DT-102`, `FR15-DT-104`, `FR15-DT-106`.

<a id="fr15-bug-003"></a>

### FR15-BUG-003 — Cho phép lưu sản phẩm với danh mục bị thiếu hoặc không tồn tại

| Trường | Nội dung |
|---|---|
| Bug ID | `FR15-BUG-003` |
| Feature / loại lỗi | FR-15; Functional / Data integrity |
| Tầng / interface | API / Admin WEB |
| Rule ID | FR15-R07 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR15](#env-fr15) |
| Case đại diện | `FR15-DT-138` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Tạo được sản phẩm không có danh mục hợp lệ.

**Requirement / test oracle:** README FR-15; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

Reset snapshot empty-categories theo FR15-F trước case; token partition=admin.
Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau.

**Test data / inputs:**

Input dự định: `{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "create"}`

**Steps to reproduce:**

1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.
2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Thêm với input dự định.
3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.
4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate.

**Expected Result:**

Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.
Oracle nguồn: `{"outcome": "reject", "stateContract": "Create", "description": "No categories: reject creation despite valid name/price"}`; oracleStatus=`confirmed`

**Actual Result:**

Khi danh mục rỗng, UI gửi category_id=1 không tồn tại; API vẫn tạo ID 1, số sản phẩm tăng 0→1.

Quan sát: `{"failures": ["rejected-state-unchanged", "rejection-signaled", "ui-immediate-correct", "ui-reload-correct"], "beforeCount": 0, "afterCount": 1, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product created", "id": 1}}}`
Assertion: Dữ liệu thay đổi dù input phải bị từ chối
Assertion: Không có tín hiệu từ chối phù hợp
Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng
Assertion: UI sau reload không khớp kết quả kỳ vọng
Snapshot: thêm IDs=`[1]`; xóa IDs=`[]`; sửa IDs=`[]`
Input thực tế sau nhập UI: `{"name": repeat("A",128), "price": "100000", "category_id": ""}`
[evidence FR15-DT-138](fr15/evidence/fr15-run03/web/observations.json)
[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-146_immediate.png)

**Evidence bổ sung:**

- [FR15-TC-146_immediate.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-146_immediate.png)
- [FR15-TC-146_reload.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-146_reload.png)
- [FR15-TC-146.json](fr15/evidence/fr15-run03/web/FR15-TC-146.json)

**Related test cases (ID trong report):** `FR15-DT-023`, `FR15-DT-029`, `FR15-DT-030`, `FR15-DT-031`, `FR15-DT-054`, `FR15-DT-060`, `FR15-DT-061`, `FR15-DT-062`, `FR15-DT-138`, `FR15-DT-139`.

<a id="fr15-bug-004"></a>

### FR15-BUG-004 — Sửa một sản phẩm làm sai tên sản phẩm khác và để dữ liệu UI của target bị cũ

| Trường | Nội dung |
|---|---|
| Bug ID | `FR15-BUG-004` |
| Feature / loại lỗi | FR-15; UI / State consistency |
| Tầng / interface | Admin WEB; API/DB là đối chứng |
| Rule ID | FR15-R08 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR15](#env-fr15) |
| Case đại diện | `FR15-DT-085` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Bảng quản trị hiển thị sai dữ liệu sau sửa, có thể gây thao tác nhầm.

**Requirement / test oracle:** README FR-15; Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

token partition=admin.
Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau.

**Test data / inputs:**

Input dự định: `{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "admin", "mode": "update"}`

**Steps to reproduce:**

1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.
2. Dùng đúng partition xác thực; mở Admin Product, chọn đúng target và thực hiện Sửa với input dự định.
3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.
4. Ghi inputEffective và UI ngay sau thao tác; reload, ghi UI lần nữa. HTML chặn input không chứng minh API đã validate.

**Expected Result:**

Chỉ target khớp payload mới; các field không sửa và các sản phẩm khác giữ nguyên; UI đúng ngay sau lưu và sau reload.
Oracle nguồn: `{"outcome": "accept", "stateContract": "Update", "description": "Interior / valid nominal CRUD"}`; oracleStatus=`confirmed`

**Actual Result:**

Ngay sau sửa A, tên B/C trên UI bị đổi theo A; DB/API vẫn đúng. Reload khôi phục tên B/C. Một số ca sửa riêng field còn giữ dữ liệu UI cũ.

Quan sát: `{"failures": ["ui-immediate-correct"], "beforeCount": 3, "afterCount": 3, "mutationCount": 1, "htmlBlocked": false, "response": {"statusCode": 200, "body": {"message": "Product updated"}}}`
Assertion: UI ngay sau thao tác không khớp kết quả kỳ vọng
Snapshot: thêm IDs=`[]`; xóa IDs=`[]`; sửa IDs=`[101]`
Input thực tế sau nhập UI: `{"name": repeat("A",128), "price": "100000", "category_id": "10"}`
[evidence FR15-DT-085](fr15/evidence/fr15-run03/web/observations.json)
[ảnh/log chi tiết](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-092_immediate.png)

**Evidence bổ sung:**

- [FR15-TC-092_immediate.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-092_immediate.png)
- [FR15-TC-092_reload.png](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-092_reload.png)
- [FR15-TC-092.json](fr15/evidence/fr15-run03/web/FR15-TC-092.json)

**Related test cases (ID trong report):** `FR15-DT-085`, `FR15-DT-087`, `FR15-BVA-029`, `FR15-DT-088`, `FR15-BVA-030`, `FR15-DT-089`, `FR15-BVA-031`, `FR15-DT-090`, `FR15-BVA-032`, `FR15-DT-094`, `FR15-BVA-036`, `FR15-DT-095`, `FR15-DT-096`, `FR15-DT-100`, `FR15-DT-105`, `FR15-SUP-008`, `FR15-DT-123`, `FR15-DT-124`, `FR15-DT-125`, `FR15-DT-126`, `FR15-DT-127`, `FR15-DT-128`, `FR15-BVA-044`.

<a id="fr15-bug-005"></a>

### FR15-BUG-005 — [Dependency FR-12] API ghi sản phẩm không chặn token thiếu, lỗi hoặc không có quyền admin

| Trường | Nội dung |
|---|---|
| Bug ID | `FR15-BUG-005` |
| Feature / loại lỗi | FR-15; Security / Dependency FR-12 |
| Tầng / interface | API |
| Rule ID | FR12-DEP-WRITE (dependency) |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Environment / build | [ENV-FR15](#env-fr15) |
| Case đại diện | `FR15-DT-129` — Status gốc: Failed |

**Mô tả và ảnh hưởng:** Request thiếu quyền vẫn có thể ghi dữ liệu sản phẩm.

**Requirement / test oracle:** README FR-15; dependency quyền admin FR-12. Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](report.md); xem [đặc tả nghiệp vụ](../../README.md), [API contract](../../api_specification.md).

**Preconditions / fixture:**

token partition=none.
Target=101 phải tồn tại nếu thao tác yêu cầu, trừ probe ID vắng; snapshot toàn bộ sản phẩm trước/sau.

**Test data / inputs:**

Input dự định: `{"body": {"name": repeat("A",128), "price": 100000, "description": "Nominal description", "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", "category_id": 10}, "target": 101, "auth": "none", "mode": "create"}`

**Steps to reproduce:**

1. Reset fixture bằng setup độc lập và snapshot tất cả sản phẩm.
2. Dùng đúng partition xác thực; POST /api/products với input dự định.
3. Lưu request/response và state trước/sau; đối chiếu target cùng mọi sản phẩm khác.

**Expected Result:**

Từ chối thao tác; dữ liệu của target và các sản phẩm khác giữ nguyên.
Oracle nguồn: `{"outcome": "reject", "stateContract": "Create", "description": "Unauthorized none must not mutate products"}`; oracleStatus=`confirmed`

**Actual Result:**

POST không gửi Authorization vẫn nhận HTTP 200 và tạo ID 304, số sản phẩm tăng 3→4; các case liên quan kiểm PUT/DELETE và token lỗi/user.

Quan sát: `{"http": 200, "body": {"message": "Product created", "id": 304}, "failures": ["rejected-state-unchanged", "rejection-signaled"], "beforeCount": 3, "afterCount": 4}`
Assertion: Dữ liệu thay đổi dù input phải bị từ chối
Assertion: Không có tín hiệu từ chối phù hợp
Snapshot: thêm IDs=`[304]`; xóa IDs=`[]`; sửa IDs=`[]`
[evidence FR15-DT-129](fr15/evidence/fr15-run03/api/observations.json)
[ảnh/log chi tiết](fr15/evidence/fr15-run03/api/FR15-TC-137.json)

**Evidence bổ sung:**

- [FR15-TC-137.json](fr15/evidence/fr15-run03/api/FR15-TC-137.json)

**Related test cases (ID trong report):** `FR15-DT-129`, `FR15-DT-130`, `FR15-DT-131`, `FR15-DT-132`, `FR15-DT-133`, `FR15-DT-134`, `FR15-DT-135`, `FR15-DT-136`, `FR15-DT-137`.

## Phụ lục — FR-05: Các mục cần xác minh, chưa phải bug confirmed

### A. Grid/scroll trên native

- **Case:** `FR05-DT-001`; Status **Blocked** sau adjudication.
- **Quan sát:** screenshot một cột, AX có 12 tên sản phẩm; thao tác scroll qua CUA báo `noWindowsAvailable`.
- **Giới hạn:** chưa có contract native responsive/column cụ thể; không suy từ cấu hình FlatList thành bug.
- **Cần bổ sung:** oracle bố cục native được chấp thuận và thao tác scroll có evidence hoạt động.
- **Nguồn:** [Hồ sơ FR-05](fr05/bugs.md), [cumulative observations](fr05/evidence/fr05-run02/cumulative-observations.json).

### B. Image accessibility trên native

- **Case:** `FR05-DT-013`; Status **Blocked — EVIDENCE_CAPABILITY**.
- **Quan sát:** ảnh hiện nhưng AX export không có image description.
- **Giới hạn:** chưa chứng minh công cụ export đủ image semantics hoặc VoiceOver thực tế đọc gì; chưa báo confirmed missing-alt bug.
- **Cần bổ sung:** xác minh bằng công cụ accessibility/VoiceOver trên native và contract phù hợp nền tảng.
- **Nguồn:** [Hồ sơ FR-05](fr05/bugs.md), [cumulative observations](fr05/evidence/fr05-run02/cumulative-observations.json).
