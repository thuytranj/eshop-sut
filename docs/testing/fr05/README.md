# FR-05 Mobile: Product listing and search

Bộ report tiếng Việt này giải thích từng bước **Domain Testing + BVA**, rồi nối thiết kế với native execution, actual results, bug reports và AI gap analysis. Thuật ngữ chuyên ngành giữ tiếng Anh. Đây là **một feature trên iOS**, không phải bài nộp hoàn chỉnh bốn features.

## Đọc report theo workflow

| Bước | Report / artifact | Nội dung chính |
|---|---|---|
| 1. Phân tích requirement | [requirements](requirements.md) | Test oracle, rule IDs, input dictionary, ambiguity |
| 2. Domain Testing | [domain model](domain-model.md), [source cases](domain-cases.md) | Predicate/miền, on/off/in, reference fixture, interaction, masking và obligations |
| 3. BVA | [BVA report](bva-report.md) | Ordered partitions, endpoints, neighbors, union và data selection n=0/1/2 |
| 4. Review/deduplicate | [suite review](suite-review.md), [canonical suite](../../../tests/fr05/suite.json) | 48 source→45 canonical, giữ DT/BVA mapping và suite hash |
| 5. Execute suite | [execution decisions](execution-decisions.md), [native runbook](../../../tests/fr05/native-runbook.md), [manifest](evidence/fr05-run01/manifest.json) | Fixture cách ly, native/API evidence; full execution còn Blocked |
| 6. Actual/pass-fail/bug | [test results](test-results.md), [bugs](bugs.md) | Verdict có evidence, adjudication, coverage và reproducible bugs |
| 7. AI gap analysis | [AI gaps](ai-gap-analysis.md), [AI Critique](ai-critique.md), [AI Audit](ai-interactions.md) | Omissions/corrections có provenance; learner review Pending |

## Test summary

| Scope | Features | Designed unique | Executed | Passed | Failed | Blocked | Not Run | Not yet executed |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Native iOS | 1 | 33 | 23 | 12 | 11 | 10 | 0 | 10 |
| API supporting cùng FR05 | 0 feature bổ sung | 12 | 12 | 11 | 1 | 0 | 0 | 0 |
| Tổng canonical | 1 | 45 | 35 | 23 | 12 | 10 | 0 | 10 |

`Executed=Passed+Failed`; Blocked không là executed. 48 source cases có3 BVA scenarios trùng DT, không phải48 unique tests. Có **4 confirmed specification defects**, **1 observed derived timing discrepancy**,2 suspected/ambiguous items chưa tính confirmed bugs. Native DT exercised21/23; BVA native result-count slice3/3 (n0 Failed,n1/n2 Passed), không phải100% feature coverage. API không thay native evidence; Android chưa chạy.

## Môi trường và bằng chứng

Run `fr05-run01`, ngày16/10/2026, Asia/Ho_Chi_Minh (+07:00): iPhone18 Pro, iOS27.0, ExpoGo54.0.7, app SDK54. Backend/source/database working tree được bảo toàn; chỉ endpoint trong bản copy thay đổi. Raw [observations](evidence/fr05-run01/observations.json) giữ nguyên, final verdict ở [adjudicated observations](evidence/fr05-run01/adjudicated-observations.json); [revision](evidence/fr05-run01/verdict-revisions.json) giải thích TC001 Failed→Blocked để tránh false positive.

Case text có native AX evidence; các confirmed visual/functional bug reports có PNG/log thật. User chỉ hỗ trợ Open Expo Go và unlock Mac. Không có learner technical review, không có demo video/link được tạo, chưa publish GitHub Issues. Không có Expo web result được dùng làm Android/iOS proof.

## Chạy lại verification của harness

Từ repository root:

```bash
python3 -m unittest discover -s tests/fr05 -p 'test_*.py' -v
node --test tests/fr05/test_api_runner.cjs
python3 tests/fr05/validate_suite.py --suite tests/fr05/suite.json --observations docs/testing/fr05/evidence/fr05-run01/adjudicated-observations.json
```

Default Python run có14 passed và2 live checks skipped có lý do. Khi backend copy/proxy đang chạy, `FR05_LIVE=1 python3 -m unittest discover -s tests/fr05 -p test_protocol.py -v` kiểm riêng2 fixture resets; đã chạy2/2 pass trong phiên này. Node có2 checks pass. Đây là harness checks, không phải bằng chứng SUT tất cả pass. Backend npm test là placeholder; mobile không có npm lint/test/build scripts, không giả lập các checks đó.

Native execution tiếp tục theo runbook sau khi chốt oracle; tạo run ID mới, không ghi đè run01. Trước startup luôn đọc database.js và dùng prepare-environment copy; không chạy seed/dev vào DB working tree.

## Self-assessment và phần còn thiếu cho HW02 submission

| Mục | Tự đánh giá |
|---|---|
| FR05 mobile Domain Testing/BVA | Pending learner self-assessment; không tự cho điểm |
| Learner technical review/corrections | Pending learner review |
| Full native execution | Chưa đạt:10 Blocked, cần oracle/scroll/accessibility follow-up |
| GitHub Issues / demo links | Chưa publish / chưa có link thật |
| Full-assignment package | Chưa thực hiện trong scope một feature Markdown này |

Main report và AI Audit/Critique cần thêm PDF khi đóng gói full assignment; phải render/verify trước nộp. Cần actual group allocation cho selection uniqueness, StudentID/self-assessed grade, deadline từ Moodle và quyền publish/submission. ZIP theo `<StudentID>_HW02_AI_DomainTesting_<SelfAssessedGrade>.zip`. Không fabricate grade/demo/deadline hoặc tự submit.

Lịch sử commit thực: [commit-log.txt](commit-log.txt). Các task completed được commit riêng; execution còn blockers được ghi trung thực, không tạo lịch sử hoàn tất giả.
