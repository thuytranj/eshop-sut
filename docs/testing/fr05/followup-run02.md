# FR-05: Follow-up execution run02

Ngày16/10/2026, Asia/Ho_Chi_Minh (+07:00). Theo yêu cầu “tiếp tục các task chưa hoàn thành”, executor tiếp tục Task5 và xử lý ba Minor documentation findings. Đây là assistant execution/review; learner technical review vẫn Pending.

## Đã làm thêm

- Thực hiện native probes cho đủ7 search-policy cases TC021–027 bằng input chính xác của frozen suite; thêm Promo%Off, Promo_Off và lowercase alpha để làm rõ transport/matching. Có10 search probes được index; Alpha riêng phục vụ ALT.
- Retry scroll qua AX container, rồi Raise window và coordinate scroll: cả hai báo noWindowsAvailable. TC001 vẫn Blocked. AX listing có12 names không chứng minh đã cuộn đến cuối.
- Search Alpha và thu lại native image/accessibility surface: exported AX chưa đủ image semantics, không có VoiceOver evidence. TC013 vẫn Blocked.
- Kiểm heading text native; thiếu authoritative HTML h1→native mapping, TC020 vẫn Blocked. Không lấy text node làm heading verdict.

## Cách áp dụng và đánh giá

Giữ nguyên Domain Testing/BVA design và suite v1. Chỉ bổ sung actual observations, không sửa expected theo implementation. Mỗi search probe: giữ full catalog bất biến → thay hoàn toàn input qua CUA → đọc lại field → bấm Tìm → đối chiếu request/response → lưu AX và PNG. Nhóm readonly dùng chung fixture, không restart Home mỗi query; đây là follow-up search probe, không phải cold-start regression.

| Case/probe | Input (JSON) | HTTP / response IDs | Kết luận |
|---|---|---|---|
| TC21 | `" Alpha "` | 200 / [] | Matching Blocked: thiếu policy |
| TC22 | `"%"` | 200 / [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112] | Matching Blocked: thiếu policy |
| TC23 | `"ALPHA"` | 200 / [101] | Matching Blocked: thiếu policy |
| TC24 | `"Ca phe"` | 200 / [] | Matching Blocked: thiếu policy |
| TC25 | `""` | 200 / [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112] | Matching Blocked: thiếu policy |
| TC26 | `"A"` | 200 / [101, 102, 103, 106, 107, 108, 112] | Matching Blocked: thiếu policy |
| TC27 | `"   "` | 200 / [] | Matching Blocked: thiếu policy |
| percent-full | `"Promo%Off"` | 200 / [109, 110] | Matching Blocked: thiếu policy |
| underscore | `"Promo_Off"` | 200 / [109, 110] | Matching Blocked: thiếu policy |
| case-fold | `"alpha"` | 200 / [101] | Matching Blocked: thiếu policy |

Native label giữ literal Promo%Off/Promo_Off trong AX/PNG; request lần lượt `search=Promo%25Off` và `search=Promo_Off`, decoded keyword vẫn đúng input. Đây là observation về transport/display tại hai mẫu, **không** là kết luận matching correctness hoặc exhaustive text safety. Cả hai response cóIDs109,110; cần policy literal/wildcard để xác định đó là bug hay intended behavior.

## Thống kê và giới hạn

Không tạo canonical case mới, không nâng obligation coverage. **45 designed unique; 35 executed có verdict = 23 Passed + 12 Failed; 10 Blocked**. Bảy policy cases đã có thao tác/probe thực nhưng vẫn chưa có oracle để adjudicate, vì vậy không cộng vào executed metric vốn định nghĩa bằng P/F. Đây là tiến triển evidence, chưa hoàn tất full execution. Không phát hiện confirmed defect mới; giữ4 explicit defects +1 derived timing discrepancy.

[Follow-up observations](evidence/fr05-run02/followup-observations.json) chỉ chứa10 blocked IDs được xem lại. [Cumulative observations](evidence/fr05-run02/cumulative-observations.json) là composite:35 verdict từ run01 +10 blocked observations run02; từng row giữ runId thật. Không gọi đây là một full fresh execution run02. [Probe index](evidence/fr05-run02/probe-index.json) liên kết request/IDs/AX/PNG; [manifest](evidence/fr05-run02/manifest.json) ghi runtime reuse.

## Ba Minor findings đã được xử lý

1. Runbook bổ sung command sequence, working directories và asset document root cho fresh run. Các entrypoint được đối chiếu source/scripts; chuỗi startup mới không được chạy end-to-end trong run02 vì đang reuse runtime, đã nói rõ trong runbook.
2. Coverage %/_ được làm rõ bằng native probes và request/display evidence ở trên; không sửa frozen suite hoặc tăng coverage run01.
3. Thêm [reset-policy addendum](evidence/fr05-run01/reset-policy-addendum.md), không sửa manifest/raw run01. Shared immutable snapshot được công khai.

[Final review](final-review.md) là historical review trước follow-up; danh sách deferred khi đó được giữ lại, resolution nằm ở đây.

## Điều kiện còn thiếu

Cần authoritative native grid/h1/search policy và scroll/accessibility capability để đóng10 Blocked cases. Đã hỏi user cung cấp nguồn requirement/lecture nếu có; chưa nhận clarification trong lúc ghi report. Không tự đặt policy để làm suite hoàn tất. Android/PDF/full-assignment submission/publish vẫn ngoài scope plan feature Markdown hiện tại.

## Bảo toàn evidence

Lệnh preflight đầu gửi một full-fixture reset tới proxy cũ. Sau khi xác định đúng PID proxy của phiên này, executor dừng proxy, chuyển nguyên appended control line sang `resume-preflight.jsonl`, khôi phục requests.jsonl run01 đúng byte baseline Git rồi restart proxy ghi run02. Không có native follow-up request nào được giữ trong raw run01. Disposable DB backend/mobile của run01 được reuse, backend path run02 là symlink tới copy này; working DB/SUT không đổi. Suite/fixture hashes giữ nguyên.

## Verification của follow-up và composite

Validator hiện có yêu cầu một runId duy nhất/file, nên từ chối cumulative-observations.json chứa run01 và run02 với thông báo “one runId required per observation file”. Đây là contract của harness, không phải SUT failure hoặc evidence lỗi. Giữ nguyên từng runId thật; không sửa validator hoặc đổi runId để vượt check. Run01 tiếp tục kiểm bằng validator; run02/composite kiểm riêng về unique IDs, subset10 đúng frozen suite, evidence tồn tại,35 verdict gốc không đổi và thống kê23P/12F/10B. Composite chỉ là reporting view, không phải full fresh run.
