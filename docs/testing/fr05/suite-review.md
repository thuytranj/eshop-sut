# FR-05: Review, deduplicate và technique mapping

## 1. Cách review và sửa sai

Assistant self-review kiểm oracle có nguồn, n là derived count, interface native/API, feasible fixture, masking và 5 Review Focus. Chưa có learner technical review.

| Finding | Trước review | Quyết định và lý do | Evidence |
|---|---|---|---|
| Initial listing | Search-focused plan dễ thiếu Home unfiltered/virtualization | Thêm LIST và cuộn cuối; không suy từ viewport đầu | Plan revision 2; FR05-TC-001 |
| Data mapping | Source cases chỉ trong Markdown khó validate | Thêm domain-source.json/bva-source.json làm serialization, giữ report giải thích | Source registries |
| EOF whitespace | Staged check Task 2 phát hiện một blank line ở EOF nhưng commit đã tiếp tục | Sửa trong Task 3, không amend; thay gate theo exit code | Commits 6b20f7f → 4f22209 |
| h1 và sensitivity | Requirement không có native mapping/trim policy | Giữ unresolved case, không tự tạo pass/fail | requirements A01/A02 |

## 2. Quy tắc deduplicate

Chỉ merge khi interface/platform, preconditions, fixture, raw input, ordered steps và toàn bộ expected giống nhau. Không merge chỉ vì cùng n=0. Không merge API với native. Giữ source case ID, rule/obligation và technique union.

48 source cases = 45 DT/Supplementary + 3 BVA; sau merge có **45 unique canonical cases**, gồm 33 native và 12 API supporting. Chỉ ba BVA cases merge với DT RESULT-ZERO/ONE/TWO; không có source exclusions.

## 3. Suite freeze và kiểm harness

- Version: `fr05-v1`.
- SHA-256 suite: `e7f7d3135c6c89fe12982c6a110075f5db7fa2726fac4d0070d50f8405dc8ac6`.
- SHA-256 fixture: `a607f67d7eb25461999eeb2eb583b18c72b7961975fd084532e785d39c1fc19f`.
- Source cases giữ actual=null/status=Not Run. Execution observations được lưu riêng theo run.
- 12 mutation/self-check tests đã fail khi validator chưa được tạo (RED), sau implementation 12/12 pass (GREEN). Các mutations kiểm duplicate/orphan/lost BVA/unknown case/missing result/evidence và scenario mismatch.
- Validator pass không có nghĩa SUT pass. Không có npm test thật ở mobile và backend placeholder không là verification.

## 4. Traceability đầy đủ

| Canonical | Interface | Rule | Source case IDs | Technique | Obligation IDs |
|---|---|---|---|---|---|
| FR05-TC-001 | NATIVE | FR05-R01, FR05-R03 | FR05-DT-001 | DT | FR05-LIST |
| FR05-TC-002 | NATIVE | FR05-R05 | FR05-DT-002 | DT | FR05-EXACT |
| FR05-TC-003 | NATIVE | FR05-R08 | FR05-DT-003 | DT | FR05-NO-MATCH |
| FR05-TC-004 | NATIVE | FR05-R05, FR05-R08 | FR05-DT-004 | DT | FR05-NAME-ONLY |
| FR05-TC-005 | NATIVE | FR05-R05 | FR05-DT-005 | DT | FR05-UNICODE |
| FR05-TC-006 | NATIVE | FR05-R05 | FR05-DT-006 | DT | FR05-QUOTE |
| FR05-TC-007 | NATIVE | FR05-R05 | FR05-DT-007 | DT | FR05-AMP |
| FR05-TC-008 | NATIVE | FR05-R05 | FR05-DT-008 | DT | FR05-PLUS |
| FR05-TC-009 | NATIVE | FR05-R05 | FR05-DT-009 | DT | FR05-HASH |
| FR05-TC-010 | NATIVE | FR05-R06 | FR05-DT-010 | DT | FR05-SAFE |
| FR05-TC-011 | NATIVE | FR05-R04 | FR05-DT-011 | DT | FR05-MONEY |
| FR05-TC-012 | NATIVE | FR05-R02 | FR05-DT-012 | DT | FR05-RATIO |
| FR05-TC-013 | NATIVE | FR05-R02 | FR05-DT-013 | DT | FR05-ALT |
| FR05-TC-014 | NATIVE | FR05-R03 | FR05-DT-014 | DT | FR05-LONG-NAME |
| FR05-TC-015 | NATIVE | FR05-R07 | FR05-DT-015 | DT | FR05-LOAD-INITIAL |
| FR05-TC-016 | NATIVE | FR05-R07 | FR05-DT-016 | DT | FR05-LOAD-SEARCH |
| FR05-TC-017 | NATIVE | FR05-R07, FR05-R08 | FR05-DT-017 | DT | FR05-LOAD-EMPTY |
| FR05-TC-018 | NATIVE | FR05-R07 | FR05-SUP-018 | Supplementary | FR05-ERROR |
| FR05-TC-019 | NATIVE | FR05-R05 | FR05-SUP-019 | Supplementary | FR05-RACE |
| FR05-TC-020 | NATIVE | FR05-R09 | FR05-SUP-020 | Supplementary | FR05-H1 |
| FR05-TC-021 | NATIVE | FR05-R05 | FR05-SUP-021 | Supplementary | FR05-TRIM |
| FR05-TC-022 | NATIVE | FR05-R05 | FR05-SUP-022 | Supplementary | FR05-WILDCARD |
| FR05-TC-023 | NATIVE | FR05-R05 | FR05-SUP-023 | Supplementary | FR05-CASE |
| FR05-TC-024 | NATIVE | FR05-R05 | FR05-SUP-024 | Supplementary | FR05-ACCENT |
| FR05-TC-025 | NATIVE | FR05-R05 | FR05-SUP-025 | Supplementary | FR05-EMPTY-QUERY |
| FR05-TC-026 | NATIVE | FR05-R05 | FR05-SUP-026 | Supplementary | FR05-ONE-CHAR |
| FR05-TC-027 | NATIVE | FR05-R05 | FR05-SUP-027 | Supplementary | FR05-SPACE |
| FR05-TC-028 | NATIVE | FR05-R08 | FR05-BVA-001, FR05-DT-028 | BVA+DT | FR05-BVA-N0, FR05-RESULT-ZERO |
| FR05-TC-029 | NATIVE | FR05-R03, FR05-R05 | FR05-BVA-002, FR05-DT-029 | BVA+DT | FR05-BVA-N1, FR05-RESULT-ONE |
| FR05-TC-030 | NATIVE | FR05-R03, FR05-R05 | FR05-BVA-003, FR05-DT-030 | BVA+DT | FR05-BVA-N2, FR05-RESULT-TWO |
| FR05-TC-031 | NATIVE | FR05-R05 | FR05-DT-031 | DT | FR05-COUPLED-M2 |
| FR05-TC-032 | NATIVE | FR05-R05 | FR05-DT-032 | DT | FR05-COUPLED-M3 |
| FR05-TC-033 | NATIVE | FR05-R05, FR05-R08 | FR05-DT-033 | DT | FR05-EMPTY-RECOVERY |
| FR05-TC-034 | API | FR05-R05 | FR05-DT-034 | DT | FR05-LIST-API |
| FR05-TC-035 | API | FR05-R05 | FR05-DT-035 | DT | FR05-EXACT-API |
| FR05-TC-036 | API | FR05-R05 | FR05-DT-036 | DT | FR05-NO-MATCH-API |
| FR05-TC-037 | API | FR05-R05 | FR05-DT-037 | DT | FR05-NAME-ONLY-API |
| FR05-TC-038 | API | FR05-R05 | FR05-DT-038 | DT | FR05-UNICODE-API |
| FR05-TC-039 | API | FR05-R05 | FR05-DT-039 | DT | FR05-QUOTE-API |
| FR05-TC-040 | API | FR05-R05 | FR05-DT-040 | DT | FR05-AMP-API |
| FR05-TC-041 | API | FR05-R05 | FR05-DT-041 | DT | FR05-PLUS-API |
| FR05-TC-042 | API | FR05-R05 | FR05-DT-042 | DT | FR05-HASH-API |
| FR05-TC-043 | API | FR05-R05 | FR05-DT-043 | DT | FR05-COUNT-EMPTY-API |
| FR05-TC-044 | API | FR05-R05 | FR05-DT-044 | DT | FR05-COUNT-ONE-API |
| FR05-TC-045 | API | FR05-R05 | FR05-DT-045 | DT | FR05-COUNT-TWO-API |

## 5. Coverage thiết kế và giới hạn

Mỗi source/obligation đã có canonical mapping, nhưng unresolved policies không được đưa vào denominator có oracle. DT và BVA có denominator riêng, native và API cũng riêng. BVA native có 3 value obligations; designed 3/3, executed 0/3 tại freeze. Các Supplementary policy probes không được biến thành BVA.

Review Focus: EMPTY/STATE→TC003/015-017/028; TEXT/TRANSPORT/SAFE→TC005-010; RACE→TC019; PRESENTATION→TC011-014; network/native preflight→Task5. R09→TC020 có source nhưng chưa có verdict oracle. Tất cả execution vẫn chưa chạy tại thời điểm report freeze này.

## 6. Execution/adjudication handoff

Run01 có raw observations và bản adjudicated riêng, không đổi frozen suite/hash. TC001 được hạ từ Failed sang Blocked vì không có native column-count oracle; [revision ledger](evidence/fr05-run01/verdict-revisions.json) giữ before/after. Native final12P/11F/10B; API11P/1F; tổng35 executed/45 designed. Native DT exercised21/23, BVA result-count3/3; denominator freeze không bị thu nhỏ để đẹp số. Chi tiết xem [test-results](test-results.md).
