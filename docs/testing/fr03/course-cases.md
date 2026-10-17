# FR-03 — Case BVA theo slide (thiết kế hiện hành)

Nguồn máy đọc được: [course-suite.json](course-suite.json). Tất cả 30 case dưới đây **Not Run đối với thiết kế mới**; historicalReuse là quan sát tham chiếu, không thay đổi trạng thái này. Case API mới là alias phân tích của 15 kịch bản cũ, không cộng thành lần chạy mới.

## Tiền điều kiện chung

Dùng backend/SQLite cách ly. A=`fr03-a@example.com`, B=`fr03-b@example.com`, password cả hai=`OldPass1!`; token A=`123456`, B=`654321`; login_attempts=0, locked_until=NULL. Reset trước mỗi case. Email đầu vào luôn A. Phải ghi build, port, clock/timezone và suite hash khi thực thi. Các chuỗi dưới đây là ASCII; ký tự `!&` là hai ký tự special hợp lệ.

## Các bước và oracle chung

API: POST `/api/reset-password` với email, token và p trong bảng; lưu response cùng snapshot password A/B trước/sau. WEB: mở `/forgot-password`, yêu cầu mã qua UI để sang bước 2; seed lại token A=123456 trong CSDL cách ly; không sửa DOM; nhập token, p và confirmation=p, rồi submit; lưu dialogs/network, screenshot và state. Nếu thiếu control xác nhận, ghi Blocked khi thực thi cùng evidence, không tạo field thay thế.

Chấp nhận: password A đổi thành p, B giữ nguyên. Từ chối: password A/B không đổi. Không assert token reuse/expiry hoặc HTTP error code chưa được đặc tả. Output OTP sinh mã được kiểm tra riêng tại TC001/TC037, không dùng token seed để thay bằng chứng.

## API

| ID | Token | Password p (confirmation=p ở WEB) | Nghĩa vụ | Expected | Actual / Status / Evidence mới | Tham chiếu lịch sử |
|---|---|---|---|---|---|---|
| `FR03-CBVA-A01` | `123456` | `Abcdef1!` | CBVA-LEN-8, CBVA-OTP-6, CBVA-UPPER-1, CBVA-DIGIT-1, CBVA-SPEC-1 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-003 Passed |
| `FR03-CBVA-A02` | `123456` | `Abcdefg1!` | CBVA-LEN-9 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-005 Passed |
| `FR03-CBVA-A03` | `123456` | `Abcdefgh1!` | CBVA-LEN-10 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-006 Passed |
| `FR03-CBVA-A04` | `123456` | `Abcde1!` | CBVA-LEN-7 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-004 Failed |
| `FR03-CBVA-A05` | `12345` | `Abcdef1!` | CBVA-OTP-5 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-029 Passed |
| `FR03-CBVA-A06` | `1234567` | `Abcdef1!` | CBVA-OTP-7 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-030 Passed |
| `FR03-CBVA-A07` | `123456` | `abcdef1!` | CBVA-UPPER-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-010 Failed |
| `FR03-CBVA-A08` | `123456` | `ABcdef1!` | CBVA-UPPER-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-011 Passed |
| `FR03-CBVA-A09` | `123456` | `ABCDEF1!` | CBVA-LOWER-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-012 Failed |
| `FR03-CBVA-A10` | `123456` | `aBCDEF1!` | CBVA-LOWER-1 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-013 Passed |
| `FR03-CBVA-A11` | `123456` | `abCDEF1!` | CBVA-LOWER-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-014 Passed |
| `FR03-CBVA-A12` | `123456` | `Abcdefg!` | CBVA-DIGIT-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-015 Failed |
| `FR03-CBVA-A13` | `123456` | `Abcde12!` | CBVA-DIGIT-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-016 Passed |
| `FR03-CBVA-A14` | `123456` | `Abcdef12` | CBVA-SPEC-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-017 Failed |
| `FR03-CBVA-A15` | `123456` | `Abcde1!&` | CBVA-SPEC-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | FR03-TC-018 Passed |

## WEB

| ID | Token | Password p (confirmation=p ở WEB) | Nghĩa vụ | Expected | Actual / Status / Evidence mới | Tham chiếu lịch sử |
|---|---|---|---|---|---|---|
| `FR03-CBVA-W01` | `123456` | `Abcdef1!` | CBVA-LEN-8, CBVA-OTP-6, CBVA-UPPER-1, CBVA-DIGIT-1, CBVA-SPEC-1 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W02` | `123456` | `Abcdefg1!` | CBVA-LEN-9 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W03` | `123456` | `Abcdefgh1!` | CBVA-LEN-10 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W04` | `123456` | `Abcde1!` | CBVA-LEN-7 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W05` | `12345` | `Abcdef1!` | CBVA-OTP-5 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W06` | `1234567` | `Abcdef1!` | CBVA-OTP-7 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W07` | `123456` | `abcdef1!` | CBVA-UPPER-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W08` | `123456` | `ABcdef1!` | CBVA-UPPER-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W09` | `123456` | `ABCDEF1!` | CBVA-LOWER-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W10` | `123456` | `aBCDEF1!` | CBVA-LOWER-1 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W11` | `123456` | `abCDEF1!` | CBVA-LOWER-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W12` | `123456` | `Abcdefg!` | CBVA-DIGIT-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W13` | `123456` | `Abcde12!` | CBVA-DIGIT-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W14` | `123456` | `Abcdef12` | CBVA-SPEC-0 | Từ chối; mật khẩu A và B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
| `FR03-CBVA-W15` | `123456` | `Abcde1!&` | CBVA-SPEC-2 | Chấp nhận; mật khẩu A đổi thành newPassword; mật khẩu B giữ nguyên OldPass1!. | Chưa quan sát / Not Run / None | Không tái sử dụng |
