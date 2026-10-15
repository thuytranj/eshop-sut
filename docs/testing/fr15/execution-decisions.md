# FR-15 — Quyết định thực hiện và nhật ký kiểm chứng

Tài liệu ghi đầy đủ 10 Ruling theo thứ tự phát sinh, cùng lý do và ảnh hưởng nếu quyết định không phù hợp. Các quyết định ở Task 5 phản ánh thời điểm run02; run03 là kết quả cuối sau review. Reviewer độc lập không để lại Minor cần hoãn.

## 1. Các quyết định và đánh đổi

| STT / giai đoạn | Quyết định và lý do | Ảnh hưởng nếu không phù hợp |
|---|---|---|
| 1. Setup | Sandbox không cho ghi vào worktree mới. Dùng nhánh không phải main hiện có hw02-domain-testing, chỉ thêm đường dẫn FR-15; worktree chưa dùng đã được archive. Cách này giữ nguyên thay đổi FR-03 có sẵn | Commit FR-15 chia sẻ lịch sử nhánh hiện tại |
| 2. Setup | Không sửa nghiệp vụ SUT. TDD RED→GREEN áp dụng cho harness; tài liệu/dataset được review, còn Failed của SUT giữ làm evidence. AGENTS.md được ưu tiên hơn yêu cầu chung làm mọi test xanh | Các lỗi ứng dụng được báo cáo vẫn tồn tại |
| 3. Setup | Repository không có root/backend test suite hoạt động; npm test của backend là placeholder. Kiểm harness và suite FR-15 riêng | Chưa có bảo đảm cho các lỗi ngoài FR-15 |
| 4. Task 5 | Sửa IDAT CRC của PNG fixture và freeze v2 trước execution; giữ v1 và hash lịch sử. Mục đích là loại nhiễu do ảnh mẫu | Dữ liệu ảnh mẫu thay đổi, dù ý nghĩa các case không đổi |
| 5. Task 5 | Bổ sung assessor dùng chung trong assert-products.cjs để API và Python dùng cùng oracle | Một lỗi chung trong assessor có thể ảnh hưởng cả API/WEB; giảm rủi ro bằng kiểm tra độc lập và review |
| 6. Task 5 | run01 lấy DOM trước khi UI cập nhật xong: TC069 có 3 dòng nhưng screenshot sau đã có 4. Giữ run01 làm lịch sử, thêm API quiet wait/regression rồi dùng run02 tại giai đoạn đó | Khoảng yên lặng 500ms có thể chưa bắt được timer dài chỉ chạy ở client; request API thực được theo dõi đến khi hoàn tất |
| 7. Task 5 | Thêm assertion API readback nhất quán với snapshot DB để kiểm read-after-write; regression RED→GREEN | So sánh representation có thể quá chặt; GET detail đã xử lý khác biệt numeric string bằng đối chiếu giá trị số |
| 8. Task 5 | git diff --cached --check cảnh báo khoảng trắng trong raw runner logs. Giữ log nguyên văn, tách kiểm whitespace cho .md/.json/.cjs/.py do agent viết | Cảnh báo whitespace của raw-log patch vẫn còn. Không ghi nhận nhầm kiểm tra chung là đã đạt |
| 9. Final | Giữ các mục reviewer đặt ngoài phạm vi: sửa SUT, publish/PDF/demo, FR-03 có sẵn và native/trình duyệt khác. Quyết định dựa trên AGENTS.md và plan | Chưa có hồ sơ nộp bên ngoài hoặc bảo đảm cho nền tảng khác |
| 10. Final | Giữ Unicode/trim/ID vắng unresolved, nhưng đánh giá lại giá 0.5 thành oracle chấp nhận: p>0 đã đủ cho số biểu diễn được này; precision chưa rõ chỉ hạn chế BVA adjacency | Nếu có contract hoặc hướng dẫn môn học chặt hơn, phải sửa lại bốn oracle này |

## 2. Nhật ký hoàn thành theo task

| Task | Dải commit | Kiểm chứng tại thời điểm hoàn thành |
|---|---|---|
| 1. Phân tích requirement | 6e29712..e625109 | Cấu trúc artifact, JSON và whitespace hợp lệ |
| 2. Domain Testing | e625109..e54872f | Artifact thiết kế và JSON hợp lệ; chưa suy ra execution |
| 3. BVA | e54872f..5fe4088 | Artifact BVA và JSON hợp lệ |
| 4. Review/freeze | 5fe4088..ef38fe2 | Validator đối chiếu suite/source/obligation, không có lỗi |
| 5. Execution | ef38fe2..c85b6c2 | Đối soát đầy đủ run02; đây là bản trước hiệu chỉnh cuối |
| 6. Actual results/bug | c85b6c2..dc0619a | Nội dung báo cáo, cấu trúc và whitespace hợp lệ |
| 7. AI gap analysis | dc0619a..c0623d2 | Artifact và audit hợp lệ tại giai đoạn tổng hợp |

Các lệnh kiểm chứng lịch sử được ghi trong Git/audit; script kiểm tài liệu tạm đã được dọn theo workflow. Bảng này không thay thế [commit-log.txt](commit-log.txt).

## 3. Kiểm chứng một lượt sửa cuối

Ba vấn đề được xử lý trong cùng lượt sửa: coverage nguồn ảnh; thiếu response bị hiểu là từ chối; và oracle của giá 0.5. Mỗi vấn đề có regression test RED→GREEN. Harness đạt 18/18; toàn suite run03 được đối soát với 56 Passed, 95 Failed, 7 Blocked do oracle và 0 Not Run.

Whitespace của tài liệu được kiểm riêng với raw logs. Kiểm tra link được chạy lại sau khi tạo đủ audit export. Hash xác nhận database gốc và các file có thay đổi sẵn được giữ nguyên; application source không được sửa.
