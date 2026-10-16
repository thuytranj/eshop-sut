# FR-05: AI gap analysis dựa trên evidence

## 1. Cách phân tích

So sánh output lập plan đã ghi trong [AI interaction log](ai-interactions.jsonl), source cases đóng băng ở Task2/3, suite v1 Task4, raw observations Task5 và adjudication Task6. Một case được bổ sung không tự chứng minh AI đã bỏ sót bug. Một thao tác người dùng hỗ trợ môi trường không được gọi là learner correction.

Review trong report này là **assistant self-review**, không phải đánh giá kỹ thuật của người học. Learner review vẫn Pending. Không có evidence để khẳng định user đã sửa expected result hay phát hiện thêm SUT bug.

## 2. Gap ledger có provenance

| Gap | Output ban đầu / evidence | AI hoặc người học đã làm gì | Kết quả và giới hạn | Nguyên nhân có thể chứng minh |
|---|---|---|---|---|
| G01: Initial Home bị mô tả chưa rõ trong plan đầu | Interaction `0c200efd-98ca-495d-896e-1ccfa3b9f561` Task2 Step5 chưa có LIST unfiltered/scroll; revision `2447f747-2d08-4a84-852a-b4ebbc4eae6a` thêm LIST | Assistant self-review bổ sung trước design | TC001 kiểm Home; AX có12 names nhưng scroll chưa xác minh, native grid oracle còn mở | Observed: thiếu bước explicit trong plan đầu. Hypothesis: AI tập trung search nhiều hơn listing; không suy nội tại model |
| G02: Native một cột bị gán Failed quá sớm | Raw TC001 Failed vs [verdict revision](evidence/fr05-run01/verdict-revisions.json) | Assistant Task6 nhận ra README không chốt native column count | Failed→Blocked, không tính confirmed bug; raw screenshot và kết quả trước sửa giữ nguyên | Observed: inference grid→≥2 columns không có source. Đây là false positive của AI, không phải user correction |
| G03: Gate whitespace không dừng commit Task2 | Staged check có EOF blank-line warning; commit6b20f7f đã tạo; Task3/4f22209 sửa | Assistant sửa formatting trong commit sau, không amend | Source content không đổi; orchestration sau đó kiểm exit code trước commit; raw CRLF/log có exception được công khai | Observed: executor tiếp tục sau check nonzero; không đổ cho requirement thiếu |
| G04: Manifest được tổng hợp sau API run | [manifest](evidence/fr05-run01/manifest.json) có apiStartedAt từ raw requests, manifestRecordedAt riêng | Assistant giữ timing thật thay vì đặt recording time thành lịch sử | Reproducibility limitation còn được ghi; native manifest đã có trước launch | Observed: thứ tự thu metadata chưa theo plan. Đây là workflow gap, không phải SUT failure |
| G05: Reload driver ban đầu thiếu protocol version | Native pending attempt đầu vẫn giữ keyword cũ; local Expo socketMessages.js yêu cầu version2; request log chỉ có reload thật sau sửa | Assistant kiểm local source rồi sửa lifecycle message thành version2 | Pending-v2 + request elapsed30s + success AX chứng minh initial loading; attempt chưa reload không tính pass | Observed: tooling assumption sai; không tính vào missed SUT bugs |

## 3. Những gì không được gọi là AI bỏ sót bug

Quote search, URL reserved characters, empty state, image ratio và response race đều đã có source case trước execution, nên không được viết rằng AI bỏ sót rồi người học mới phát hiện những bugs này. Raw failures cho thấy tests phát hiện discrepancies, không chứng minh suite đầy đủ. Không có learner-supplied bug/case correction trong evidence hiện có.

ALT/h1/trim/case/diacritics/wildcard/empty-query/substring policies đã được ghi từ requirement/design; unresolved status không tự là omission. Đặc biệt h1 thuộc HTML cần native mapping, và string length không có giới hạn số để tự tạo BVA. Dùng n=0/1/2 cho derived result cardinality là scope có công khai, không thay thế kiểm toàn bộ search space.

## 4. Gap còn mở và việc cần làm

- Cần lecture để xác nhận convention on/off/in và 3-value BVA tương ứng phương pháp trên lớp.
- Cần authoritative native grid/h1 mapping và search matching policy để chốt các case Blocked, không dùng implementation hoặc preference ngẫu nhiên làm oracle.
- Cần công cụ scroll và image accessibility evidence tốt hơn; screenshot đơn lẻ không chứng minh đầy đủ catalog/accessibility.
- Cần Android run nếu muốn kết luận Android; run này chỉ iOS27/ExpoGo54.
- Cần learner technical review thật; cần quyền publish trước GitHub Issues/video/submission. Demo/PDF/four-feature package chưa nằm trong deliverable Markdown feature lần này.

## 5. Bài học áp dụng

Giữ requirement, expected, actual và provenance riêng nhau. Freeze source cases trước khi chạy, tính coverage từ obligation registry và preserve raw failure khi review đổi verdict. Tăng số case không khắc phục oracle thiếu. AI hỗ trợ dẫn xuất và thu evidence, còn kết luận đúng/sai phải bám nguồn và quan sát, cùng review thực của người học.
