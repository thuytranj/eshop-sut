# FR-03 — Hồ sơ Domain Testing và BVA

Bộ tài liệu phân tích yêu cầu, thiết kế Domain Testing/BVA, review và khử trùng, đối soát evidence, bugs và AI gaps. Bản refactor theo lecture ngày **2026-10-17** không sửa SUT, không chạy lại backend/browser và không thay đổi log/screenshot/suite lịch sử.

## Đọc theo workflow 7 bước

| Bước | Tài liệu chính | Kết quả cần hiểu |
|---|---|---|
| 1. Phân tích requirement | [requirements](requirements.md) | R01–R09, input/output, oracle và ambiguity |
| 2. Domain Testing | [domain-model](domain-model.md), [domain-cases](domain-cases.md) | Vị từ → miền → on/off/in → truth vector → case |
| 3. BVA | [bva-report](bva-report.md), [course-cases](course-cases.md) | Biến thể → phân hoạch → LB/UB/nominal → điểm → fixture → mapping |
| 4. Review/deduplicate/map | [suite-review](suite-review.md), [course-suite.json](course-suite.json) | Giữ các technique aliases, đếm canonical case một lần |
| 5. Execute suite | [API logs](evidence/api/observations.json), [WEB logs](evidence/web/observations.json) | Evidence lịch sử, không phải lượt chạy mới |
| 6. Actual/pass-fail/bug | [test-results](test-results.md), [bugs](bugs.md) | Đối chiếu oracle, giới hạn evidence và bug đã ghi nhận |
| 7. AI gap analysis | [ai-gap-analysis](ai-gap-analysis.md), [ai-interactions](ai-interactions.md) | Phân biệt lỗi thật, rủi ro và learner feedback |

Nguồn phương pháp: [slide KCPM Bài 4](references/KCPM-Bai4-EP-BVA.pdf) trang 6–18 (EP) và 19–26 (BVA). On/off/in là quy ước Domain Testing của skill, không gán nhầm cho slide. BVA hiện hành dùng Standard + Robustness có giải thích thích nghi cho miền một phía và singleton. Phần ISTQB cũ được [lưu riêng](references/bva-istqb-historical.md).

## Thống kê và trạng thái

| Phạm vi | Thiết kế | Có kết luận lịch sử | Passed | Failed | Blocked | Not Run |
|---|---|---|---|---|---|---|
| Suite lịch sử API | 36 | 36 | 26 | 10 | 0 | 0 |
| Suite lịch sử WEB | 16 | 11 | 1 | 10 | 5 | 0 |
| Suite lịch sử tổng | 52 | 47 | 27 | 20 | 5 | 0 |
| Thiết kế course-suite hiện hành | 30 | 15 API có evidence tham chiếu | Không có run mới | Không có run mới | Chưa đánh giá mới | 30 cho run mới |

Có 1 feature và 6 hồ sơ bug lịch sử. 30 case course-suite không được cộng với 52 để tăng số ca đã chạy: 15 API tái sử dụng kịch bản cũ; 15 WEB là thiết kế chưa thực thi. Mỗi tầng có 7 nghĩa vụ BVA chính + 12 phép chiếu bổ sung. API có observation khớp 19/19 điểm; WEB 0/19 cho quy trình mới. Chi tiết denominator và masking ở bva-report.

## Evidence và những việc còn thiếu

- Suite cũ [tests/fr03/suite.json](../../../tests/fr03/suite.json), IDs và hash giữ nguyên; report hiện hành thêm mapping ngoài suite, không viết lại lịch sử.
- Log API có response/state A/B; log WEB chỉ có dialogs/screenshots, timestamp không offset. Không khẳng định mọi UI case đã kiểm tra CSDL hoặc timezone/build lịch sử được xác minh.
- R04 có verdict Passed với selector rộng: cần probe control riêng trước khi kết luận đầy đủ. OTP randomness, Unicode, UB password và chính sách OTP không được chứng minh.
- Cần thực thi course-suite và đóng các gap có evidence mới khi được yêu cầu. Hai runner cũ chỉ đọc suite lịch sử, **chưa hỗ trợ course-suite.json**; không chạy chúng rồi tuyên bố course-suite hoàn thành.
- Chưa có learner self-assessment, demo link hoặc package PDF trong phạm vi refactor này. Deadline theo Moodle, không tự tạo. Đây là hồ sơ một feature, chưa phải toàn bộ bài HW02.

Kiểm tra nhất quán tài liệu: `python3 docs/testing/fr03/verify_artifacts.py`. Kiểm tra này không chạy SUT và không tạo verdict mới. [commit-log.txt](commit-log.txt) giữ log lịch sử; commit refactor sẽ được ghi rõ thêm sau khi thực sự tạo.
