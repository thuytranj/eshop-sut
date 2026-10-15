# FR-15 Product CRUD — Domain Testing + BVA

Đã thực hiện workflow 7 bước theo Native. Đây là hồ sơ một feature Pool C, chưa phải bản nộp hoàn chỉnh bốn feature HW02. Main report gồm các Markdown ở dưới; chưa xuất PDF, chưa publish GitHub Issues hoặc quay demo.

| Thống kê unique | Số lượng |
|---|---|
| Features | 1 (FR15; FR12 product-write là dependency) |
| Source cases | 198 (DT143 + BVA44 + supplementary11) |
| Designed canonical | 158 (API97, WEB61) |
| Attempted | 158 |
| Executed có verdict | 147 |
| Passed | 53 |
| Failed | 94 |
| Blocked | 11 (oracle-unresolved, đã ghi quan sát) |
| Not Run | 0 |
| Not yet adjudicated | 11 = Blocked + Not Run |
| Bug report groups | 5 (4 FR15 + 1 dependency FR12) |
| Demo / GitHub links | Chưa có; không bịa URL |

Final run: fr15-run02; run01 preliminary được giữ để audit và không cộng vào số case. DT143/143 và BVA44/44 nghĩa vụ hữu hạn đã exercise, không đồng nghĩa pass hoặc exhaustive correctness. Price chỉ Z-slice, Unicode/precision chưa rõ; xem test-results.md.

## Artifacts

- [Requirement và ambiguities](requirements.md)
- [Domain model theo từng bước](domain-model.md)
- [Domain source cases](domain-cases.md)
- [BVA từng bước và endpoint mapping](bva-report.md)
- [Review, dedup và freeze v1/v2](suite-review.md)
- [Actual result, coverage và blockers](test-results.md)
- [Bug reports và evidence](bugs.md)
- [AI gap analysis và critique](ai-gap-analysis.md)
- [AI Audit export](ai-interactions.md), [append-only JSONL](ai-interactions.jsonl)
- [Git commit log](commit-log.txt)
- [Final run manifest](evidence/fr15-run02/manifest.json)
- [Frozen executable suite](../../../tests/fr15/suite.json)

## Reproduce

Từ root repo, Node22.17.1 đã dùng trong run02, Python/Playwright và Chromium version theo browser.json. Cài dependency nếu cần bằng npm ci đúng backend/frontend-admin; không dùng root npm test. Ports3000/5174 phải trống; runner từ chối process lạ.

```bash
node --test tests/fr15/harness.test.cjs tests/fr15/png-fixture.test.cjs
node tests/fr15/run-all.cjs --ui-self-check
node tests/fr15/validate-suite.cjs
node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun
node tests/fr15/validate-suite.cjs --results docs/testing/fr15/evidence/fr15-newrun
```

Root/output/run ID phải mới. run-all exit2 nếu còn Blocked, exit1 nếu có Failed và không Blocked, exit0 chỉ khi toàn bộ có oracle đều Passed và không còn unexecuted. Validator exit0 chỉ chứng nhận schema/reconciliation, không phải SUT pass. Không khởi động backend gốc: database.js destructive startup. Runner copy nguyên code và tạo SQLite riêng, reset transaction sau seed, dừng đúng process do mình tạo. Hash DB gốc và các thay đổi FR03 có sẵn được giữ nguyên.

## Self-assessment / submission limits

| Mục | Trạng thái |
|---|---|
| Điểm tự đánh giá của sinh viên | Pending learner input; chưa gán điểm |
| Learner technical review | Pending |
| Phân bổ feature trong nhóm | Chưa xác nhận |
| Slide phương pháp | Chưa được cung cấp; fallback công khai trong reports |
| Main/AI reports PDF | Chưa tạo; nằm ngoài execution plan Markdown FR15 hiện tại |
| GitHub Issues / screenshot trên Issues | Chưa publish; cần authorization |
| Demo video / deadline Moodle / StudentID ZIP | Chưa có dữ liệu; chưa nộp bài |

AI audit capture partial chỉ gồm output khả dụng được ghi; không tự nhận complete transcript hay student-authored critique. Không sửa application code hoặc push/merge. Commit-log có cutoff rõ để tránh vòng lặp tự chứa hash chính nó.
