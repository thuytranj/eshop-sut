# FR-15 — Báo cáo kiểm thử Product CRUD bằng Domain Testing và BVA

Hồ sơ trình bày quá trình kiểm thử FR-15 theo 7 bước: phân tích requirement, thiết kế Domain Testing, thiết kế BVA, review và deduplicate, execution, ghi nhận kết quả và bug, cuối cùng là AI gap analysis. Công việc được thực hiện theo Native. Các thuật ngữ như oracle, fixture, predicate, coverage và traceability được giữ nguyên để thống nhất với tài liệu môn học.

Đây là hồ sơ của **một feature thuộc Pool C**, chưa phải bộ hồ sơ nộp đầy đủ cho cả bốn feature HW02.

## 1. Kết quả tổng hợp

Kết quả cuối cùng lấy từ **fr15-run03**. Mỗi canonical test case chỉ được tính một lần, dù được chạy lại hoặc mang nhiều nhãn technique.

| Chỉ số | Số lượng |
|---|---|
| Feature được kiểm thử | 1: FR-15; quyền ghi sản phẩm của FR-12 là dependency |
| Test case nguồn | 198: 143 Domain Testing, 44 BVA và 11 Supplementary |
| Canonical test case sau deduplicate | 158: 97 API và 61 WEB |
| Đã attempt | 158 |
| Đã có verdict: Passed + Failed | 151 |
| Passed | 56 |
| Failed | 95 |
| Blocked | 7: đã có quan sát nhưng chưa đủ oracle |
| Not Run | 0 |
| Chưa thể kết luận: Blocked + Not Run | 7 |
| Nhóm bug được báo cáo | 5: 4 nhóm của FR-15 và 1 nhóm dependency FR-12 |

Cả 143 obligation Domain Testing và 44 obligation BVA trong phạm vi đã xác định đều được thiết kế và exercise. Con số này phản ánh coverage của tập obligation đã liệt kê, không có nghĩa tất cả test đều pass hay toàn bộ miền input đã được kiểm thử. BVA của giá chỉ xét lát cắt số nguyên; precision của toàn miền giá và cách đếm Unicode vẫn chưa được đặc tả đầy đủ.

Run01 và run02 được giữ để phục vụ audit. Chúng không được cộng thêm vào số test case và không thay thế verdict cuối của run03.

## 2. Cách đọc hồ sơ

| Bước | Tài liệu | Nội dung |
|---|---|---|
| 1 | [Phân tích requirement](requirements.md) | Test basis, rule, fixture và điểm chưa rõ trong đặc tả |
| 2 | [Domain model](domain-model.md), [test case nguồn](domain-cases.md) | Dẫn xuất predicate, miền, biên, điểm On/Off/In và traceability |
| 3 | [Báo cáo BVA](bva-report.md) | Partition, endpoint, neighbor, hợp tập giá trị và test case |
| 4 | [Review và deduplicate](suite-review.md) | Mapping giữa ca nguồn, canonical case, technique và obligation; lịch sử freeze v1–v3 |
| 5–6 | [Kết quả execution](test-results.md), [bug reports](bugs.md) | Actual result, verdict, coverage và evidence |
| 7 | [AI gap analysis và AI Critique](ai-gap-analysis.md) | Sai sót có bằng chứng, cách hiệu chỉnh và giới hạn sử dụng AI |

Tài liệu hỗ trợ: [AI Audit tiếng Việt](ai-interactions-vi.md), [nhật ký JSONL gốc](ai-interactions.jsonl), [Git commit log](commit-log.txt), [review độc lập](final-review.md), [quyết định thực hiện](execution-decisions.md), [manifest run03](evidence/fr15-run03/manifest.json) và [test suite đã freeze](../../../tests/fr15/suite.json).

Các bản AI Audit cũ và nội dung được trích nguyên văn trong audit được giữ để đối chiếu lịch sử. Phần giải thích của bản audit tiếng Việt không thay thế hoặc sửa lời prompt/output ban đầu.

## 3. Chạy lại kiểm thử

Run03 sử dụng Node 22.17.1. Phiên bản Python được ghi trong manifest; phiên bản Chromium, locale và viewport nằm trong browser.json. Nếu thiếu dependency, chạy `npm ci` tại đúng thư mục backend hoặc frontend-admin. Ports 3000 và 5174 phải trống để runner khởi động đúng các process do nó quản lý.

```bash
node --test tests/fr15/harness.test.cjs tests/fr15/png-fixture.test.cjs
node tests/fr15/run-all.cjs --ui-self-check
node tests/fr15/validate-suite.cjs
node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun
node tests/fr15/validate-suite.cjs --results docs/testing/fr15/evidence/fr15-newrun
```

Dùng root, output và run ID mới cho mỗi lần chạy để giữ nguyên evidence cũ. `run-all` trả exit code 2 khi còn Blocked; trả 1 khi có Failed nhưng không có Blocked; chỉ trả 0 khi tất cả ca đều Passed. Validator trả 0 khi schema và việc đối soát kết quả hợp lệ; exit code này không chứng nhận SUT đã pass.

Runner sao chép nguyên backend, tạo SQLite riêng và reset fixture bằng transaction sau khi seed hoàn tất. Không khởi động backend gốc vì database.js có thao tác tạo lại bảng. Process của lần chạy được dừng sau khi hoàn tất. Hash của database gốc và các thay đổi FR-03 có sẵn đã được kiểm tra là giữ nguyên.

## 4. Tình trạng review và hồ sơ nộp bài

| Mục | Tình trạng |
|---|---|
| Review kỹ thuật của người học | Đang chờ; AI self-review không thay thế learner review |
| Điểm tự đánh giá | Chờ sinh viên cung cấp |
| Phân bổ feature trong nhóm | Chưa xác nhận |
| Slide phương pháp của môn học | Chưa được cung cấp; báo cáo công khai quy ước fallback |
| Main report và AI reports dạng PDF | Chưa tạo trong phạm vi execution plan này |
| GitHub Issues và screenshot đính kèm | Chưa publish |
| Demo video, deadline Moodle và thông tin đặt tên ZIP | Chưa có đủ thông tin; chưa nộp bài |

AI Audit chỉ bao gồm các tương tác khả dụng đã ghi lại và công khai capture extent. Không có cơ sở để xem đây là transcript đầy đủ hoặc khẳng định sinh viên đã review mọi kết quả. Các thay đổi hiện tại là hồ sơ kiểm thử; application code không được sửa.
