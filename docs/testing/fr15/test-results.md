# FR-15 — Actual results / coverage

Final run **fr15-run02**, 2026-10-15T22:23:02+07:00 → 2026-10-15T22:27:00+07:00, Asia/Ho_Chi_Minh. Source commit at start `65d30b154176da7cec7e133b9c9ee792d1831925` plus exact dirty harness hashes in [manifest](evidence/fr15-run02/manifest.json). Chromium version/locale/viewport: [browser metadata](evidence/fr15-run02/web/browser.json). Backend copy: `/private/tmp/eshop-fr15-run02/backend`; byte-identical backend source, independent SQLite reset per case. Working SQLite hash and frozen suite unchanged.

**run01 is preliminary and excluded from final verdicts**: asynchronous DOM sampling could precede fetchData completion (e.g. TC069). Raw evidence retained; run02 uses API-request quiet tracking, two animation frames and readback checks. Never combine two runs into double the designed/executed counts.

| Metric | Unique cases |
|---|---|
| designed | 158 |
| attempted | 158 |
| executed | 147 |
| passed | 53 |
| failed | 94 |
| blocked | 11 |
| notRun | 0 |

Executed means Passed+Failed=147; Blocked=11 are attempted supplementary observations without sufficient oracle, not environment failures. NotYetExecuted in verdict accounting = Blocked+NotRun=11. Main cases with determined oracle: 147/147 have verdicts. Runner exit 2 is expected because unresolved probes remain; it is not a green SUT claim. Harness tests: 15 passed plus independent Chromium synchronization regression.

| Layer | Designed | Passed | Failed | Blocked | Not Run |
|---|---|---|---|---|---|
| API | 97 | 34 | 54 | 9 | 0 |
| WEB | 61 | 19 | 40 | 2 | 0 |

## Coverage denominator và giới hạn

DT obligations are named point/surface/corner/operation/state partitions; BVA obligations are unique value/action/layer/universe. Supplementary observations do not enter DT/BVA denominators. A failed assertion can exercise a test obligation; coverage is not a pass rate. Per-source `rules` denotes design focus; `stateContract` also carries CRUD postconditions and R08 for Update. Failure code ui-immediate-correct on valid Update traces to R08 even if the source focus was R05/R06.

| Technique/layer | Identified | Designed mapped | Executed exercised |
|---|---|---|---|
| Domain Testing/API | 88 | 88/88 | 88/88 |
| Domain Testing/WEB | 55 | 55/55 | 55/55 |
| BVA/API | 22 | 22/22 | 22/22 |
| BVA/WEB | 22 | 22/22 | 22/22 |
| Supplementary/API | 9 | 9/9 | 0/9 |
| Supplementary/WEB | 2 | 2/2 | 0/2 |

Known finite DT scope: 143/143 designed and exercised; ASCII name + integer-price BVA: 44/44 designed and exercised (name 28, price Z-slice 16). These are sampled obligations only. Full price precision, Unicode counting, unspecified ID/error contract and referenced-product delete remain unresolved/outside this finite claim. No 100% FR15 correctness or exhaustive continuous-domain coverage claim.

UI delivered values are recorded as inputEffective; HTML prevention does not imply server validation. Empty name is blocked by HTML required with no mutation request (UI prevention exercised); API empty name has its own observed failure. No numeric-string mismatch alone is counted as defect. No observed truncation is used to claim delivery of a forbidden name length. API mutation auth tests cover only product C/U/D, not all FR12.

## Per-case results

Full fixture/preconditions/input/steps are keyed by ID in [frozen suite](../../../tests/fr15/suite.json); actual request/response, stateBefore/stateAfter, API readback and UI before/after reload are in each raw record. Raw JSON is the actual-result record, the summary below lists failed assertions or accepted evidence.

| ID | Interface/action | Rule focus | Technique(s) | Fixture | Expected | Actual / status | Bugs | Evidence |
|---|---|---|---|---|---|---|---|
| FR15-TC-001 | API/Create | FR15-R01 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-001.json) |
| FR15-TC-002 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-002.json) |
| FR15-TC-003 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-003.json) |
| FR15-TC-004 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-004.json) |
| FR15-TC-005 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-005.json) |
| FR15-TC-006 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-006.json) |
| FR15-TC-007 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-007.json) |
| FR15-TC-008 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-008.json) |
| FR15-TC-009 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-009.json) |
| FR15-TC-010 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-010.json) |
| FR15-TC-011 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-011.json) |
| FR15-TC-012 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-012.json) |
| FR15-TC-013 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-013.json) |
| FR15-TC-014 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-014.json) |
| FR15-TC-015 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-015.json) |
| FR15-TC-016 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-016.json) |
| FR15-TC-017 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-017.json) |
| FR15-TC-018 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-018.json) |
| FR15-TC-019 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-019.json) |
| FR15-TC-020 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-020.json) |
| FR15-TC-021 | API/Create | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-021.json) |
| FR15-TC-022 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-022.json) |
| FR15-TC-023 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-023.json) |
| FR15-TC-024 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-024.json) |
| FR15-TC-025 | API/Create | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-025.json) |
| FR15-TC-026 | API/Create | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-026.json) |
| FR15-TC-027 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-027.json) |
| FR15-TC-028 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-028.json) |
| FR15-TC-029 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-029.json) |
| FR15-TC-030 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-030.json) |
| FR15-TC-031 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-031.json) |
| FR15-TC-032 | API/Create | FR15-R06 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-032.json) |
| FR15-TC-033 | API/Create | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-033.json) |
| FR15-TC-034 | API/Create | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-034.json) |
| FR15-TC-035 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-035.json) |
| FR15-TC-036 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-036.json) |
| FR15-TC-037 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-037.json) |
| FR15-TC-038 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-038.json) |
| FR15-TC-039 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-039.json) |
| FR15-TC-040 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-040.json) |
| FR15-TC-041 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-041.json) |
| FR15-TC-042 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-042.json) |
| FR15-TC-043 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-043.json) |
| FR15-TC-044 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-044.json) |
| FR15-TC-045 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-045.json) |
| FR15-TC-046 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-046.json) |
| FR15-TC-047 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-047.json) |
| FR15-TC-048 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-048.json) |
| FR15-TC-049 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-049.json) |
| FR15-TC-050 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-050.json) |
| FR15-TC-051 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-051.json) |
| FR15-TC-052 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-052.json) |
| FR15-TC-053 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-053.json) |
| FR15-TC-054 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-054.json) |
| FR15-TC-055 | API/Update | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-055.json) |
| FR15-TC-056 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-056.json) |
| FR15-TC-057 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-057.json) |
| FR15-TC-058 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-058.json) |
| FR15-TC-059 | API/Update | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-059.json) |
| FR15-TC-060 | API/Update | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-060.json) |
| FR15-TC-061 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-061.json) |
| FR15-TC-062 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/api/FR15-TC-062.json) |
| FR15-TC-063 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-063.json) |
| FR15-TC-064 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-064.json) |
| FR15-TC-065 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-065.json) |
| FR15-TC-066 | API/Update | FR15-R06 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-066.json) |
| FR15-TC-067 | API/Update | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-067.json) |
| FR15-TC-068 | API/Update | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-068.json) |
| FR15-TC-069 | WEB/Create | FR15-R01 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-069.json) |
| FR15-TC-070 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-070.json) |
| FR15-TC-071 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-071.json) |
| FR15-TC-072 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-072.json) |
| FR15-TC-073 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-073.json) |
| FR15-TC-074 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-074.json) |
| FR15-TC-075 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-075.json) |
| FR15-TC-076 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-076.json) |
| FR15-TC-077 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-077.json) |
| FR15-TC-078 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-078.json) |
| FR15-TC-079 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-079.json) |
| FR15-TC-080 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-080.json) |
| FR15-TC-081 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-081.json) |
| FR15-TC-082 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-082.json) |
| FR15-TC-083 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-083.json) |
| FR15-TC-084 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-084.json) |
| FR15-TC-085 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-085.json) |
| FR15-TC-086 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-086.json) |
| FR15-TC-087 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-087.json) |
| FR15-TC-088 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-088.json) |
| FR15-TC-089 | WEB/Create | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-089.json) |
| FR15-TC-090 | WEB/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-090.json) |
| FR15-TC-091 | WEB/Create | FR15-R06 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/web/FR15-TC-091.json) |
| FR15-TC-092 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-092.json) |
| FR15-TC-093 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-093.json) |
| FR15-TC-094 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-094.json) |
| FR15-TC-095 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-095.json) |
| FR15-TC-096 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-096.json) |
| FR15-TC-097 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-097.json) |
| FR15-TC-098 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-098.json) |
| FR15-TC-099 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-099.json) |
| FR15-TC-100 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-100.json) |
| FR15-TC-101 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-101.json) |
| FR15-TC-102 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-102.json) |
| FR15-TC-103 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-103.json) |
| FR15-TC-104 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-104.json) |
| FR15-TC-105 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-105.json) |
| FR15-TC-106 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-106.json) |
| FR15-TC-107 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-107.json) |
| FR15-TC-108 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-108.json) |
| FR15-TC-109 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-109.json) |
| FR15-TC-110 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-110.json) |
| FR15-TC-111 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-111.json) |
| FR15-TC-112 | WEB/Update | FR15-R07 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-112.json) |
| FR15-TC-113 | WEB/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run02/web/FR15-TC-113.json) |
| FR15-TC-114 | WEB/Update | FR15-R06 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/web/FR15-TC-114.json) |
| FR15-TC-115 | API/Read | FR15-R02 | Domain Testing | empty-products | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-115.json) |
| FR15-TC-116 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-116.json) |
| FR15-TC-117 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-117.json) |
| FR15-TC-118 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-118.json) |
| FR15-TC-119 | API/Delete | FR15-R04 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-119.json) |
| FR15-TC-120 | API/Delete | FR15-R04 | Domain Testing | single-product | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-120.json) |
| FR15-TC-121 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-121.json) |
| FR15-TC-122 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-122.json) |
| FR15-TC-123 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-123.json) |
| FR15-TC-124 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-124.json) |
| FR15-TC-125 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-125.json) |
| FR15-TC-126 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-126.json) |
| FR15-TC-127 | WEB/Read | FR15-R02 | Domain Testing | empty-products | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-127.json) |
| FR15-TC-128 | WEB/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-128.json) |
| FR15-TC-129 | WEB/Delete | FR15-R04 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-129.json) |
| FR15-TC-130 | WEB/Delete | FR15-R04 | Domain Testing | single-product | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-130.json) |
| FR15-TC-131 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-131.json) |
| FR15-TC-132 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-132.json) |
| FR15-TC-133 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-133.json) |
| FR15-TC-134 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-134.json) |
| FR15-TC-135 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-135.json) |
| FR15-TC-136 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-136.json) |
| FR15-TC-137 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-137.json) |
| FR15-TC-138 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-138.json) |
| FR15-TC-139 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-139.json) |
| FR15-TC-140 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-140.json) |
| FR15-TC-141 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-141.json) |
| FR15-TC-142 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-142.json) |
| FR15-TC-143 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-143.json) |
| FR15-TC-144 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-144.json) |
| FR15-TC-145 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run02/api/FR15-TC-145.json) |
| FR15-TC-146 | WEB/Create | FR15-R07 | Domain Testing | empty-categories | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/web/FR15-TC-146.json) |
| FR15-TC-147 | API/Create | FR15-R07 | Domain Testing | empty-categories | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run02/api/FR15-TC-147.json) |
| FR15-TC-148 | API/Read | FR15-R02 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-148.json) |
| FR15-TC-149 | API/Update | FR15-R03 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-149.json) |
| FR15-TC-150 | API/Delete | FR15-R04 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run02/api/FR15-TC-150.json) |
| FR15-TC-151 | API/Create | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-151.json) |
| FR15-TC-152 | API/Create | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-152.json) |
| FR15-TC-153 | API/Update | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/api/FR15-TC-153.json) |
| FR15-TC-154 | API/Update | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/api/FR15-TC-154.json) |
| FR15-TC-155 | WEB/Create | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-155.json) |
| FR15-TC-156 | WEB/Create | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run02/web/FR15-TC-156.json) |
| FR15-TC-157 | WEB/Update | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run02/web/FR15-TC-157.json) |
| FR15-TC-158 | WEB/Update | FR15-R06 | BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run02/web/FR15-TC-158.json) |

## Blockers and follow-up

All 11 Blocked source cases are supplementary: fractional-price precision (API/WEB C/U), whitespace/Unicode name conventions (API C/U), and exact missing-target Read/Update/Delete contract. Their raw behavior is recorded; no Pass/Fail manufactured. To resolve: obtain precision/Unicode/trim/missing-target contract or course guidance, version the model/suite, then rerun affected cases; preserve current evidence. No environment blocker or Not Run remains.

Learner technical review Pending. Only observed failures below are grouped into five issue reports (four FR15 validation/display groups and one FR12 dependency group). Grouping is by violated rule; it does not assert a single shared code root cause across UI/backend. No GitHub issue published.
