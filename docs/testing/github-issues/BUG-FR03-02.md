## Mô tả lỗi

| Trường | Nội dung |
|---|---|
| Bug ID | `BUG-FR03-02` |
| Feature / loại lỗi | FR-03; Functional / Security |
| Tầng / interface | API |
| Rule ID | R06, R07 |
| Severity | High |
| Priority đề xuất | P1 |
| Status / mức xác nhận | Observed — lỗi đã quan sát theo đặc tả |
| Case đại diện | `FR03-BVA-004` — Status gốc: Failed |

Cho phép đặt mật khẩu không đáp ứng chính sách độ mạnh.

### Tình trạng xác minh

- Nội dung dựa trên evidence lịch sử, chưa retest trên HEAD hiện tại.
- Chưa có bản sửa hoặc tỷ lệ tái hiện mới được xác nhận. Severity/priority là đề xuất triage.

## Môi trường

### Environment / build

API `http://localhost:3000`, customer WEB `http://localhost:5173/forgot-password`; Node v22.17.1 và Playwright Chromium headless theo hồ sơ gốc. SQLite/React/Vite. Chưa có manifest xác nhận build SHA, OS, browser version, viewport và locale của lượt chạy; không gán HEAD hiện tại làm build lịch sử. [API observations](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/docs/testing/fr03/evidence/api/observations.json), [WEB observations](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/docs/testing/fr03/evidence/web/observations.json).

### Preconditions / fixture

Tài khoản A có token hợp lệ 123456

### Test data / inputs

Fixture/inputs nguồn: `{"email": "fr03-a@example.com", "resetToken": "123456", "newPassword": ""}`

## Steps to reproduce

1. POST /api/reset-password với mật khẩu rỗng độ dài 0
2. Đọc response và snapshot password A/B trước/sau; đối chiếu expected.

## Actual result

API trả HTTP 200 và cập nhật password thành giá trị không hợp lệ, gồm chuỗi rỗng ở case đại diện.

HTTP 200; response=`{"message": "Password reset successfully"}`
Password trước/sau: A `"OldPass1!"` → `""`; B `"OldPass1!"` → `"OldPass1!"`
[evidence FR03-BVA-004](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/docs/testing/fr03/evidence/api/observations.json)

## Expected result

Yêu cầu bị từ chối, mật khẩu A giữ nguyên

### Requirement / test oracle

README FR-03 (và FR-01 cho chính sách mật khẩu); Quy tắc và Expected Result chi tiết trong case đại diện tại [report.md](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/docs/testing/report.md); xem [đặc tả nghiệp vụ](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/README.md), [API contract](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/api_specification.md).

## Evidence

- [observations.json](https://github.com/thuytranj/eshop-sut/blob/46f7bbd7d356bc25a94f32d74fcbc4d3383d2663/docs/testing/fr03/evidence/api/observations.json)

### Screenshot

Hồ sơ API chỉ có request/response và snapshot trạng thái; chưa có screenshot API client. Evidence log được liên kết ở trên.

### Related test cases (ID trong report)

`FR03-DT-004`, `FR03-BVA-002`, `FR03-BVA-004`, `FR03-BVA-005`, `FR03-BVA-006`, `FR03-DT-007`, `FR03-BVA-007`, `FR03-DT-008`, `FR03-BVA-009`, `FR03-DT-009`, `FR03-BVA-012`, `FR03-DT-010`, `FR03-BVA-014`, `FR03-DT-017`.

### Traceability — ID báo cáo và ID trong evidence

| Report case ID | Execution case ID | Technique |
|---|---|---|
| `FR03-BVA-004` | `FR03-TC-007` | BVA |
| `FR03-DT-004` | `FR03-TC-004` | DT |
| `FR03-BVA-002` | `FR03-TC-004` | BVA |
| `FR03-BVA-005` | `FR03-TC-008` | BVA |
| `FR03-BVA-006` | `FR03-TC-009` | BVA |
| `FR03-DT-007` | `FR03-TC-010` | DT |
| `FR03-BVA-007` | `FR03-TC-010` | BVA |
| `FR03-DT-008` | `FR03-TC-012` | DT |
| `FR03-BVA-009` | `FR03-TC-012` | BVA |
| `FR03-DT-009` | `FR03-TC-015` | DT |
| `FR03-BVA-012` | `FR03-TC-015` | BVA |
| `FR03-DT-010` | `FR03-TC-017` | DT |
| `FR03-BVA-014` | `FR03-TC-017` | BVA |
| `FR03-DT-017` | `FR03-TC-025` | DT |
