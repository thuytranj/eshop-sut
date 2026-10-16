# AI Audit Report

Draft declaration for learner confirmation: I use AI tools for the tasks recorded below.

Scope: recorded interactions only; session history may be partial. Unknown timestamps/models and partial or summary captures remain explicit. Review decisions do not certify execution results.

Interactions: 3; learner review events: 0.

## Interaction 0c200efd-98ca-495d-896e-1ccfa3b9f561

```text
{
  "tool": "Codex",
  "model": "Unknown",
  "task": "FR-05-planning",
  "occurred_at": "Unknown",
  "recorded_at": "2026-10-16T10:00:53+07:00",
  "source": "Visible task prompt and saved plan only; excludes supplied skill payload, prior instructions, commentary and tool transcript. Interaction time and exact model unavailable. Planning only; no test execution or learner review.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-05: Product listing and search trên mobile đảm bảo tuân theo workflow sau:

1. **Phân tích requirement**
2. **Sinh test case Domain Testing**
3. **Sinh test case BVA**
4. **Review + deduplicate + liên kết test case với technique**
5. **Execute toàn bộ test suite**
6. **Ghi actual result / pass-fail / bug**
7. **AI gap analysis**

Đối với cả Domain Testing và BVA, phải giải thích chi tiết từng bước áp dụng kỹ thuật, không chỉ nộp bảng test case cuối cùng.
```

### Original AI output

```text
# FR-05 Mobile Product Listing and Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kiểm thử FR-05 trên mobile native theo đúng 7 bước: requirement → Domain Testing → BVA → review/deduplicate/technique mapping → execute toàn suite → actual/pass-fail/bug → AI gap analysis; giải thích cách dẫn xuất từng kỹ thuật, không chỉ cung cấp bảng case.

**Architecture:** Xây oracle từ requirement trước khi dùng code để tìm đường thực thi. Lưu riêng case nguồn Domain Testing/BVA và hợp nhất thành suite canonical có traceability; mỗi lần chạy lưu bằng chứng theo interface, thiết bị và build. Backend chạy trong fixture cách ly; bảo toàn SUT và dữ liệu làm việc.

**Tech Stack:** Markdown/JSON/JSONL; React Native 0.81.5, React 19.1.0, Expo ~54.0.33 theo `frontend-mobile/package.json`; Node.js/Express/SQLite; Python standard library cho validator và thống kê; công cụ native được kiểm tra ở Task 5.

**Spec:** `README.md:73-82` (FR-05); `api_specification.md:80-82` (GET products/search); `docs/2026.HW02.Domain Testing_En.pdf` trang 3-6, mục 6, 9, 10, 12, 14; `AGENTS.md`. Phương pháp: `.agents/skills/domain-testing/SKILL.md`, `.agents/skills/boundary-value-analysis/SKILL.md` và các references đi kèm. Chưa tìm thấy lecture trong repo: on/off/in và ISTQB 3-value BVA là **working convention**, chưa xác nhận là phương pháp trên lớp.

## Global Constraints

- "For testing requests, preserve the SUT's behavior and report discrepancies."
- "Change application code to fix a bug only when the user requests a fix."
- "Do not expand a selected feature into testing the whole application."
- "Use stable FR IDs for traceability."
- "Expo web tests do not establish Android/iOS behavior."
- "Each case records ID, rule, preconditions, input/fixture, steps, expected result, actual result, status, and evidence."
- "Use `Not Run` for designed but unexecuted cases and `Blocked` for cases prevented by the environment."
- "Never infer pass/fail from generated cases."
- "Do not stage incidental test changes to it." (`backend/database.sqlite`)
- "Do not fabricate student review, audit entries, execution results, or demo links."
- "Use Asia/Ho_Chi_Minh for user-facing local times unless the user specifies another timezone."
- "Push, amend, rebase, squash, and other history rewrites require the user's request."

Phạm vi hiện tại là **lập kế hoạch**, chưa chạy suite và chưa tạo kết quả kiểm thử. Khi kế hoạch được chọn để thực thi, kiểm thử màn Home/tìm kiếm FR-05 trên một nền tảng native được chốt trong manifest; ưu tiên Android nếu có thiết bị/emulator khả dụng, iOS là lựa chọn thay thế nếu Android không khả dụng. Không suy rộng kết quả sang OS còn lại. API là bằng chứng hỗ trợ; không thay thế verdict native. Không mở rộng sang FR-06, giỏ hàng hay admin CRUD; việc nạp sản phẩm chỉ là setup fixture.

## Review Focus

1. Kết quả 0/1/2: empty state sau response rỗng, hiển thị đầy đủ sản phẩm khi có dữ liệu; không nhầm loading với rỗng (Task 2 EMPTY/STATE; Task 3 RESULT-N).
2. Từ khóa có dấu, dấu nháy, `&`, `+`, `#`, `%`, `_`, chuỗi HTML: truyền nguyên nghĩa và hiển thị như văn bản an toàn; tách chính sách matching chưa rõ khỏi lỗi quan sát được (Task 1 A02; Task 2 TEXT/TRANSPORT/SAFE).
3. Hai search có response đảo thứ tự và trạng thái loading: không gán kết quả của query cũ cho query mới; kỳ vọng này là derived usability oracle cần gắn nhãn (Task 2 STATE; Task 5).
4. Ảnh không vuông và tên dài: ảnh giữ tỷ lệ, tên nhận diện được, accessibility mô tả ảnh; không dùng DOM alt/h1 làm bằng chứng native (Task 1 A01/A03; Task 2 PRESENTATION).
5. LAN/backend lỗi hoặc native không khả dụng: phân biệt lỗi hạ tầng, HTTP error và empty result; lưu nguyên nhân Blocked cùng bằng chứng (Task 5 PREFLIGHT/ERROR; Task 6).

---

## Cấu trúc file và hợp đồng bàn giao

Gốc artifact là `docs/testing/fr05/`, gốc harness là `tests/fr05/`. Các đường dẫn trong bảng là tương đối với repo `/Users/thuytran/Workspace/eshop-sut`. Chỉ tạo/sửa các file FR-05; giữ nguyên `.gitignore` và `docs/testing/fr03/*` đang có thay đổi của công việc khác.

| File | Trách nhiệm |
|---|---|
| `docs/testing/fr05/requirements.md` | Rule/oracle, nguồn, scope native/API, ambiguity và method |
| `docs/testing/fr05/domain-model.md` | Các bước mô hình miền, predicate, boundary, on/off/in, interaction |
| `docs/testing/fr05/domain-cases.md` | Case nguồn DT và mapping obligation |
| `docs/testing/fr05/bva-report.md` | Ordered partitions → endpoints → neighbors → union → case/coverage |
| `docs/testing/fr05/suite-review.md` | Correction ledger, dedup, technique mapping, phiên bản/hash suite |
| `tests/fr05/suite.json` | Canonical case và obligation registry, không chứa kết quả run |
| `tests/fr05/validate_suite.py` | Validate schema/traceability và reconcile observations |
| `tests/fr05/fixtures/catalog.json` | Catalog có ID, tên, giá, ảnh kích thước biết trước và expected sets |
| `tests/fr05/prepare-environment.cjs` | Sao chép backend vào thư mục tạm, init/seed DB cách ly, reset fixture |
| `tests/fr05/run-products-api.cjs` | GET products có encoding đúng; response và HTTP evidence hỗ trợ |
| `tests/fr05/native-runbook.md` | Các bước thao tác native theo case, screenshot/log, reset và thu evidence |
| `docs/testing/fr05/execution-decisions.md` | Device/tool/connectivity, ambiguity resolution, adjustment và giới hạn |
| `docs/testing/fr05/evidence/<runId>/manifest.json` | Build SHA/dirty diff hash, suite/fixture hashes, clock, device/OS/locale, endpoint |
| `docs/testing/fr05/evidence/<runId>/observations.json` | Observation theo case/interface, assertions, status, evidence/bug references |
| `docs/testing/fr05/evidence/<runId>/{native,api}/` | Ảnh/video/log native và request/response API, phân biệt rõ nguồn |
| `docs/testing/fr05/test-results.md`, `bugs.md` | Actual/pass-fail, giới hạn thực thi và bug tái hiện được |
| `docs/testing/fr05/ai-interactions.jsonl`, `ai-interactions.md` | Audit append-only và bản đọc được, không nhận vơ learner review |
| `docs/testing/fr05/ai-gap-analysis.md`, `ai-critique.md` | AI omissions có evidence và critique 200-300 từ |
| `docs/testing/fr05/README.md`, `commit-log.txt` | Test statistics, self-assessment còn chờ người học, lịch sử commit thực |

Đây là map file **sẽ tạo khi thực thi**, ngoại trừ audit của chính bước lập kế hoạch. Không tạo case rỗng hay report kết quả để giả lập tiến độ.

**Schema dùng xuyên suốt:**

- `Rule`: `{id: FR05-Rxx, source, text, oracleKind: explicit|derived|unresolved, applicableInterfaces}`.
- `Obligation`: `{id, technique: DT|BVA|Supplementary, ruleIds, interface, description, derivation, sourceCaseIds}`.
- `SourceCase`: `{id: FR05-DT-xxx|FR05-BVA-xxx|FR05-SUP-xxx, ruleIds, obligationIds, interface, preconditions, fixtureId, input, steps, expected, actual: null, status: "Not Run", evidence: []}`.
- `CanonicalCase`: `{id: FR05-TC-xxx, sourceCaseIds, techniques, obligationIds, ruleIds, interface, preconditions, fixtureId, input, steps, expected}`.
- `Observation`: `{runId, caseId, interface, platform, actual, assertions, status: Passed|Failed|Blocked|Not Run, evidence, bugIds, reason}`. Chuỗi `actual` mô tả điều đã quan sát, không chép expected.
- Với unresolved oracle: ghi observation thăm dò riêng, giữ case cần verdict ở Blocked với reason `ORACLE_UNRESOLVED`; không tự thêm trạng thái Passed dựa vào code. Không đưa phần unresolved vào denominator đã chốt, nhưng phải liệt kê giới hạn và số ca bị chặn.

Mỗi task append audit: prompt và output khả dụng, model khi biết, thời điểm có timezone, capture extent, nguồn; original output không bị ghi đè. Review AI và review người học là hai sự kiện khác nhau; khi chưa có feedback thật ghi `Pending learner review`.

## Task 1: Phân tích requirement

**Files:** Create `requirements.md`; append `ai-interactions.jsonl`; export `ai-interactions.md` bằng skill `ai-audit`.

**Interfaces:** Consumes các spec ở đầu plan; produces rule registry, ambiguity ledger, platform scope và input dictionary để Task 2/3 dùng chung.

- [ ] **Step 1: Trích requirement và khóa oracle trước khi đọc sâu implementation.** Tạo `FR05-R01` tất cả sản phẩm dạng grid; `R02` ảnh đúng tỷ lệ và mô tả; `R03` tên; `R04` giá ₫ có phân cách hàng nghìn; `R05` search theo tên; `R06` keyword hiển thị an toàn; `R07` loading; `R08` empty search result; `R09` đúng một h1. Gộp hai câu h1 trùng trong README vào R09, giữ cả source lines.
- [ ] **Step 2: Ghi ambiguity có phương án xử lý.** `A01`: h1 là HTML, chưa có hợp đồng heading native; kiểm tra native accessibility như probe, không tự fail vì không có HTML. `A02`: chưa rõ contains/exact, case/diacritic sensitivity, trim, query empty vs omitted, literal wildcard; case có phụ thuộc chính sách phải ghi unresolved. `A03`: chưa chốt locale dấu phân cách, tỷ lệ ảnh chuẩn và tên dài có bắt buộc đủ toàn bộ; oracle chắc chắn là ₫ + nhóm nghìn, không méo ảnh, tên hiển thị. `A04`: chưa có max query length, pagination, precision giá hay timeout/loading duration; không tạo limit từ code. `A05`: empty catalog, network error và latest-query-wins là derived robustness expectations, không lẫn với câu chữ explicit. Nếu có lecture sau này, so lại convention và version hóa dẫn xuất trước khi chạy.
- [ ] **Step 3: Lập input dictionary.** `q` là chuỗi Unicode nguyên dạng; API còn phân biệt omitted với empty. `C` là catalog, `M=|C|∈N0`; `S(q,C)` là tập match theo policy đã chốt, `n=|S|∈N0`, `0≤n≤M`; `s∈{pending,success,error}` là state, không phải số dùng BVA. Ghi price/image/name là dữ liệu hiển thị, số nguyên VND chỉ là lát cắt fixture; không suy ra rule tạo sản phẩm FR-15.
- [ ] **Step 4: Đối chiếu interface và điểm thực thi.** Đọc `frontend-mobile/App.js:16,84-111,455-533`, `backend/server.js:141-157`, `backend/database.js`, package files. Ghi API URL LAN hardcoded, fetch query interpolation, FlatList/Image/Text và DB init drop tables là điểm cần kiểm chứng. Những dấu hiệu từ code chỉ là suspected discrepancy, không kết luận bug hay đổi expected theo code.
- [ ] **Step 5: Verify và commit.** Mọi R có nguồn/interface, A có ảnh hưởng và cách tránh false verdict; không thêm requirement min/max. Kiểm tra `git diff --check`; review đúng file rồi commit `docs(fr05): analyze mobile listing and search requirements`.

## Task 2: Sinh test case Domain Testing, giải thích từng bước

**Files:** Create `domain-model.md`, `domain-cases.md`, `tests/fr05/fixtures/catalog.json`; append audit.

**Interfaces:** Consumes rules/input dictionary Task 1; produces miền, predicate/boundary registry và source cases `FR05-DT-xxx`.

- [ ] **Step 1: Dựng fixture chuẩn và expected sets độc lập.** Catalog gồm tên duy nhất `Alpha`, `Alpine`, `Beta`, `Cà phê`, `O'Brien`, `A&B`, `A+B`, `A#B`, `Promo%Off`, `Promo_Off`, một tên có token chỉ nằm trong description và một tên dài. Có ảnh vuông/2:1/1:2 kích thước biết trước, giá 999/1000/1001/999999/1000000/1000001 ₫. Dùng asset ảnh local có thể truy cập từ native để tránh phụ thuộc host ảnh ngoài; fixture lưu URL, kích thước và checksum. Expected full-name searches lấy từ tập ID đã biết; `Al` chỉ có expected chính thức sau khi policy substring được chốt, không lấy output API làm oracle.
- [ ] **Step 2: Viết predicate và miền đầu ra.** Với response thành công: `P_complete: IDs(UI)=S`, không thiếu/trùng; `P_empty: n=0`; `P_nonempty: n≥1`; `P_loading: s=pending`; `P_safe: keyword là text literal`; `P_card: name + price + image thỏa R02-R04`. Tách `pending`, `success∧n=0`, `success∧n>0`, `error`; khi pending, n chưa biết, không giả sử n=0. Complement ghi rõ trường hợp nào là sai output, trường hợp nào là state hợp lệ có expected khác; zero result là kết quả hợp lệ, không phải input bị từ chối.
- [ ] **Step 3: Chọn interior/reference và giải thích partition search.** Reference: native Home, network ổn, catalog chuẩn, q là tên có đúng một match, s=success. Phân hoạch q theo omitted/empty, known full-name, token trong nhiều tên (conditional), token chỉ trong description, no-match, Unicode, ký tự URL/SQL, HTML-like. Đây là categorical partitions; không gọi boolean/HTML/Unicode là biên số hay tự gán thứ tự.
- [ ] **Step 4: Lập bảng on/off/in cho miền có thứ tự.** Boundary empty/nonempty tại n=0: on=(q_no_match,C,M>0,n=0,s=success), off phía trong nonempty n=1, interior n=2; n=-1 infeasible. Lấy hai điểm on tách biệt: catalog khác rỗng/no-match và catalog rỗng (latter gắn derived oracle). Cho coupled completeness `n≤M`, lấy on (M,n)=(1,1),(2,2), off khả thi (2,1) và interior (3,1); (M,M+1) không thể seed hợp lệ, dùng assertion phát hiện sai output chứ không dựng input giả. Bảng phải có tọa độ, truth values từng predicate, source và expected; n=1 không tự động là interior của miền empty.
- [ ] **Step 5: Sinh interaction/state/presentation cases.** EMPTY: query vô nghiệm rồi có nghiệm rồi xóa/tìm lại theo policy. STATE: delay response có kiểm soát để bắt loading lúc initial load và search; pending→success rỗng/nonempty, pending→error; hai query A/B response đảo thứ tự là supplement derived. TEXT/TRANSPORT: Vietnamese, quote, URL reserved chars và keyword chỉ trong description. SAFE: `<b>Alpha</b>` và chuỗi HTML-like vô hại hiển thị nguyên văn, không render markup; payload không chứa exfiltration. PRESENTATION: ≥2 sản phẩm để kiểm grid trên viewport chốt, ảnh ratio khác nhau, name/₫/nhóm nghìn và accessibility description. R09 unresolved native vẫn có traceability, không lặng lẽ bỏ.
- [ ] **Step 6: Cô lập lỗi và ghi coverage.** Mỗi case thay một điều kiện chính, giữ nominal các điều kiện khác; multi-fault có nhãn riêng để tránh masking. Liên kết R→domain/boundary→obligation→source case; các bổ sung không có boundary giữ technique Supplementary hoặc DT partition phù hợp. Viết lập luận lựa chọn điểm và giới hạn lấy mẫu, không chỉ bảng cuối.
- [ ] **Step 7: Verify và commit.** Tự tính expected ID sets, n≤M, truth table và feasibility; case đủ schema và tất cả Not Run; `git diff --check`; commit `docs(fr05): derive mobile product search domains and cases`.

## Task 3: Sinh test case BVA, giải thích từng bước

**Files:** Create `bva-report.md`; append audit. Không ghi đè nguồn DT.

**Interfaces:** Consumes dictionary/fixtures Task 1/2; produces BVA obligation registry và source cases `FR05-BVA-xxx`.

- [ ] **Step 1: Chốt technique và applicability.** Dùng ISTQB 3-value theo local reference khi lecture chưa có. BVA cốt lõi ở **cardinality của kết quả hiển thị**, không phải validation số lượng do user nhập. Search semantics, safe text, loading và accessibility không tự có biên số. Max keyword/pagination/giá lớn nhất không được quy định nên không bịa upper endpoints.
- [ ] **Step 2: Dẫn xuất ordered partitions.** U=N0; E0={0} cho success-empty, E1=[1,+∞) cho success-nonempty. Finite endpoints là 0,1; +∞ không phải endpoint có thể test, -1 ngoài universe. Với fixture cụ thể có M sản phẩm, n≤M; chuẩn bị M≥2 để 0/1/2 khả thi, không nhầm M là pagination limit.
- [ ] **Step 3: Tính neighborhoods và union có truy vết.** Endpoint 0→{0,1}; endpoint 1→{0,1,2}; union={0,1,2}. Ba value obligations cho một interface/platform đã chốt. Không dùng công thức 4n+1/6n+1; không đếm endpoint trùng hai lần. Bảng giữ endpoint→neighbor value→source case dù case sau này được dedup với DT.
- [ ] **Step 4: Chuyển giá trị thành fixture thực.** Để không phụ thuộc substring policy, seed ba snapshot catalog với M=0,1,2 sản phẩm và dùng cùng search full-name `Alpha` (các ID khác nhau nhưng cùng tên khi n=2); GET/query native thực tế trả đúng 0/1/2 matching products. n=0 kỳ vọng empty search state, n=1/2 đúng số card/ID, mọi card thỏa R02-R04. Có catalog chuẩn M>0 + query vô nghiệm ở DT để phân biệt empty dataset với no-match; hai setup này không dedup. Nếu UI không cung cấp ID, đối chiếu card signature phân biệt được bằng giá/ảnh và API/fixture; không khẳng định ID dựa chỉ vào tên trùng.
- [ ] **Step 5: Ghi phần chưa đủ cơ sở BVA.** Query length 0/1/2 là exploratory probes cho đến khi có partition khác expected có nguồn, không tính là 3-value BVA của giới hạn độ dài. Bộ giá quanh 1000/1000000 là kiểm tra ranh giới biểu diễn nhóm nghìn, không phải business acceptance boundary; ghi supplementary nếu chưa dẫn xuất được partition/precision đầy đủ. Không ép toàn bộ FR-05 vào BVA để tăng số case.
- [ ] **Step 6: Viết báo cáo theo chuỗi dẫn xuất.** Source→type/unit/resolution (count, step 1)→partitions→endpoints→neighborhoods→union→fixture/expected→cases→coverage. Đánh giá riêng designed covered obligations/3 và exercised obligations/3 trên native target; không nói 100% toàn feature khi chỉ phủ cardinality. Nếu bổ sung partition có nguồn, version hóa obligation registry và tính lại denominator trước execution.
- [ ] **Step 7: Verify và commit.** Tính lại union bằng tay, kiểm fixture n=0/1/2 khả thi, neighbors không âm; mọi case Not Run; `git diff --check`; commit `docs(fr05): derive mobile result-count boundary cases`.

## Task 4: Review + deduplicate + liên kết test case với technique

**Files:** Create `suite-review.md`, `tests/fr05/suite.json`, `tests/fr05/validate_suite.py`; append audit.

**Interfaces:** Consumes DT/BVA source cases; produces canonical v1, SHA-256 và CLI `python3 tests/fr05/validate_suite.py --suite tests/fr05/suite.json [--observations PATH]` (exit 0 hợp lệ, exit 1 có lỗi).

- [ ] **Step 1: Review oracle và kỹ thuật.** Rà 5 Review Focus, source của expected, ambiguous policies, on/off/in truth values, BVA union, khả năng seed, native applicability và masking. Ledger ghi before/after/reason/evidence/reviewer; assistant self-review không giả là student review. Case không có kết luận từ oracle không được sửa expected cho khớp code.
- [ ] **Step 2: Dedup theo scenario thực thi.** Chỉ merge khi cùng interface/platform, fixture/state, q nguyên dạng, ordered steps, expected và dependency. Union sourceCaseIds/techniques/obligationIds, thực thi toàn bộ assertions. Case n=0 do C rỗng và case q_no_match trên C khác rỗng không trùng. API/native, initial-loading/search-loading, query có dấu/không dấu cũng không trùng. Không xóa source case hay nghĩa vụ khi canonical hóa.
- [ ] **Step 3: Validate harness bằng dữ liệu nhỏ.** Validator kiểm unique ID, reference tồn tại, schema, mapping không orphan, technique đúng obligation, source case được map hoặc exclusion có lý do, evidence path nằm trong run. Self-check: duplicate canonical ID, mất BVA value=2 và orphan source phải exit 1; suite hợp lệ exit 0. CLI có observations phải phát hiện unknown/duplicate/missing result, thiếu evidence, Passed/Failed thiếu actual/assertions. Không test logic ứng dụng bằng validator.
- [ ] **Step 4: Freeze và xuất traceability.** R→domain/partition→obligation→source case→canonical→technique→interface. Lưu N canonical thực, hash fixture/suite và baseline AI output trước bổ sung review. Không ấn định N trước khi dedup; báo source counts riêng với unique canonical count. Coverage DT và BVA giữ denominator riêng; Supplemental không làm phình denominator BVA.
- [ ] **Step 5: Verify và commit.** Chạy CLI exit 0, spot-check mapping ngược mỗi obligation, xác nhận chưa có verdict chạy; `git diff --check`; commit `test(fr05): freeze reviewed mobile domain and boundary suite`.

## Task 5: Execute toàn bộ test suite

**Files:** Create setup/API runner/native runbook, `execution-decisions.md`, `evidence/<runId>/`; append audit. Ghi observation ngay khi chạy, báo cáo tổng hợp ở Task 6.

**Interfaces:** Consumes frozen suite/fixture; setup CLI `node tests/fr05/prepare-environment.cjs --suite tests/fr05/suite.json --run-id RUN_ID`; API CLI `node tests/fr05/run-products-api.cjs --suite tests/fr05/suite.json --base-url URL --run-id RUN_ID`; produces manifest, observations và raw evidence. CLI chỉ được chạy sau khi đã được tạo và kiểm tra side effects.

- [ ] **Step 1: Preflight native và chốt target.** Kiểm tra `adb devices -l`, `xcrun simctl list devices booted`, Expo/dependencies, UI control thực tế; ghi availability. Chọn Android sẵn dùng trước, nếu không có thì iOS sẵn dùng; không suy ra có device chỉ vì có adb/xcrun. Chốt OS/device/build/viewport/font scale/locale/accessibility reader. Nếu không có native surface điều khiển hoặc thu evidence được, các native case Blocked; có thể chạy API hỗ trợ nhưng không đổi nhãn native thành Passed. Expo web chỉ là optional diagnostics và có bucket riêng.
- [ ] **Step 2: Chuẩn bị backend cách ly.** Đọc lại startup destructive trong database.js. Script sao chép `server.js`, `database.js`, package metadata vào `/private/tmp/eshop-fr05-<runId>/backend`, dùng dependencies sẵn có hoặc npm với lockfile trong copy; không seed/start backend trong working repo. Đảm bảo port 3000 đang rảnh, nếu bận không kill process khác. Init chỉ DB copy, đợi seed hoàn tất, nạp snapshot fixture và kiểm row count/ID/checksum trước mỗi case. Sao chép để nguyên hành vi SQL/API; không sửa app để test đi qua.
- [ ] **Step 3: Xác minh đường mạng và asset.** Native phải truy cập được backend/ảnh ở địa chỉ thực; localhost của device khác máy chủ. App hardcode `http://192.168.10.13:3000/api`; ưu tiên host/network routing hợp lệ. Nếu cần endpoint adjustment, chỉ đổi trong bản mobile copy ở `/private/tmp/eshop-fr05-<runId>/mobile`, giữ exact diff/hash và nhãn environment adjustment, không sửa nghiệp vụ hay working App.js. Kiểm reachability từ device, không dùng curl trên host để chứng minh device kết nối được. Nếu không thể nối, native case Blocked với log.
- [ ] **Step 4: Kiểm readiness của harness.** API runner gửi query bằng `URL`/`URLSearchParams`, lưu raw URL/status/body; native runbook thao tác input thực của app để phát hiện app encoding sai. Dùng proxy chỉ cho delay/reorder/error khi test state, lưu cấu hình và actual timing; không biến đổi payload của ca chức năng. Đánh dấu proxy simulation khác backend integration. Self-check fixture reset không chạm database làm việc và app build không có patch nghiệp vụ.
- [ ] **Step 5: Ghi manifest trước run.** Lưu run ID, Git SHA + dirty state/hash phần liên quan, suite/fixture hash, build/package versions, target native OS/device, locale/timezone, thời gian `+07:00`, API/assets URLs, reset policy và tooling. Không có counter/time-dependent FR05 rule: ghi counters N/A, vẫn reset catalog/search/navigation/network giữa các ca để tái lập.
- [ ] **Step 6: Execute mỗi canonical case và thu evidence.** Khởi động native từ copy bằng npm trong component phù hợp, thao tác Home→nhập keyword→Tìm→quan sát; chụp trước/trong/sau phù hợp case và lưu screenshot filename chứa case ID. STATE giữ response để thấy loading rồi release; ảnh ratio cần screenshot + asset dimensions, accessibility cần hierarchy hoặc screen-reader evidence. Nếu thiếu control/functionality có oracle, case kiểm presence Failed; case tương tác bị phụ thuộc Blocked, không loại khỏi suite. Duyệt toàn bộ N IDs, mỗi ID một primary observation cho run; thiếu oracle/hạ tầng ghi Blocked với reason; không dừng ở failure đầu. Rerun dùng run ID mới, không ghi đè failure cũ.
- [ ] **Step 7: Reconcile rồi commit execution evidence.** Chạy validator với observations: tất cả canonical IDs đều có row, không unknown/duplicate, file evidence tồn tại. Báo riêng Passed/Failed/Blocked/Not Run và remaining blockers. Full execution chỉ đạt khi không còn Blocked/Not Run; nếu có blocker, task giữ trạng thái chưa hoàn tất phần đó, ghi bước cần làm để resume. Commit bằng chứng hiện có trung thực: `test(fr05): record native product search execution evidence`.

## Task 6: Ghi actual result / pass-fail / bug

**Files:** Create `test-results.md`, `bugs.md`; cập nhật `suite-review.md` liên kết execution; append audit.

**Interfaces:** Consumes raw observations Task 5; produces verdict/assertion matrix và bug records `FR05-BUG-xxx`.

- [ ] **Step 1: Đối chiếu từng assertion với oracle.** Passed khi tất cả expected assertions đã quan sát đạt; Failed khi có sai khác với oracle đã chốt; Blocked khi thiếu môi trường/dependency/oracle; Not Run khi chưa thử. Lưu text/ID/count/loading/price/ảnh thực tế, không dùng screenshot đơn lẻ suy ra timing hay HTML execution. Static code suspicion hoặc derived policy chưa xác nhận không tự trở thành confirmed defect.
- [ ] **Step 2: Viết bug tái hiện được.** Mỗi bug gồm rule/source, platform/build/run, fixture/reset, q chính xác, steps, expected/actual, reproducibility, severity có lý do, screenshot/log/native hierarchy hoặc API supporting evidence và affected case IDs. Gom nhiều failures cùng nguyên nhân sau khi có evidence, không đồng nhất số Failed cases với số bugs. Failure do network setup không báo thành bug SUT nếu chưa cô lập được.
- [ ] **Step 3: Tính thống kê unique và coverage đúng interface.** D=N canonical; P/F/B/NR là primary verdict cuối đã chỉ định, `D=P+F+B+NR`; executed `E=P+F`, not-yet-executed `B+NR`. Ghi blocked riêng. Attempts/reruns và API observations không tăng D native. DT/BVA designed coverage = obligations có valid designed case / obligations đã xác định; exercised coverage = obligations đã đánh giá bằng run có bằng chứng / cùng denominator, có thể gồm Failed. Blocked không là exercised. Requirement coverage, platform coverage và known limitations có bảng riêng.
- [ ] **Step 4: Kiểm chứng evidence và commit.** Chạy validator/reconcile, đối chiếu từng bug với failed assertion/raw evidence, kiểm link và `git diff --check`. Commit `docs(fr05): report mobile search results and observed defects`. GitHub Issues chỉ tạo khi người dùng cho phép publish; chuẩn bị nội dung local đầy đủ, đánh dấu chưa publish nếu chưa được phép.

## Task 7: AI gap analysis

**Files:** Create `ai-gap-analysis.md`, `ai-critique.md`, `README.md`, `commit-log.txt`; export audit MD; append audit. Không viết lại original generation evidence.

**Interfaces:** Consumes frozen baseline, correction ledger, final suite/observations/bugs và interactions; produces evidence-based gap table, critique và feature summary.

- [ ] **Step 1: So sánh baseline và bổ sung thật.** Gap table: original interaction/output + missing/wrong case/rule + ai/người học phát hiện + correction + final case/bug/evidence. Tách omission về case thiết kế với bug thực sự bị bỏ sót; case bổ sung không chứng minh có bug. Nếu không có omission quan sát được thì ghi như vậy; không tạo ví dụ giả để đủ báo cáo.
- [ ] **Step 2: Phân tích nguyên nhân có mức chắc chắn.** Đánh giá prompt thiếu platform/locale/policy, giới hạn tool/native accessibility, kỹ thuật áp sai categorical BVA, hoặc interaction complexity. Gắn `observed`/`hypothesis`, không kết luận nguyên nhân nội tại của model khi không có bằng chứng. Nêu gap đã đóng và gap còn mở như h1 native/lecture/OS chưa chạy.
- [ ] **Step 3: Xuất AI Audit và viết critique 200-300 từ.** Dùng `ai-audit`, log model khi biết, timestamps có offset, exact visible prompts/available outputs/capture extent. Đếm từ critique bằng split whitespace và ghi quy ước cho tiếng Việt; nội dung từ quan sát thật. Review người học chưa có giữ Pending; không gọi log scoped hiện tại là toàn bộ lịch sử chat.
- [ ] **Step 4: Tổng hợp feature package.** README chứa scope FR05 mobile (1 feature), unique stats/bugs, platform limitations, self-assessment chờ người học, demo link chỉ khi có thật. Xuất commit log thực theo paths FR05 bằng `git log --date=iso-strict --format=fuller -- docs/testing/fr05 tests/fr05 docs/superpowers/plans/2026-10-16-fr05-mobile-domain-testing-bva.md`; không tạo commit quá khứ. Commit task hiện tại được ghi khi xuất bản log cuối ở bước đóng gói sau commit.
- [ ] **Step 5: Verify và commit.** Kiểm traceability gap→revision/evidence, word count 200-300, thống kê khớp Task 6, audit parse/export thành công, links và `git diff --check`; commit `docs(fr05): analyze evidenced AI gaps in mobile testing`.

## Tiêu chí hoàn thành và ranh giới bàn giao

- [ ] Đã giữ đúng thứ tự 7 task; log actual được thu lúc execution, không dựng lại ở Task 6.
- [ ] Domain report có source, inputs, predicate/miền/complement, reference, on/off/in, feasible interactions, truth evaluation và obligation mapping.
- [ ] BVA report có convention, universe/resolution, ordered partitions, finite endpoints, neighbor derivation, union/dedup, fixture và coverage denominator; các giới hạn chưa rõ được công khai.
- [ ] Suite canonical không bỏ mất nghĩa vụ; mỗi ca có technique mapping, full steps/expected, actual/status/evidence theo run; tất cả native case được thực thi hoặc giữ blocker rõ ràng. Không tuyên bố execute toàn bộ thành công nếu còn Blocked/Not Run.
- [ ] Bugs được quan sát/tái hiện; không sửa SUT, không thay native evidence bằng API/Expo web, không chạm DB làm việc.
- [ ] AI gap/critique/audit dùng bằng chứng thật; human review Pending nếu chưa được cung cấp; mỗi bước hoàn thành có commit riêng.

Kế hoạch này tạo feature report Markdown và evidence FR05, không tự hoàn thành toàn bộ HW02 bốn feature. Khi đóng gói bài nộp đầy đủ: main report và AI Audit/Critique cần cả Markdown/PDF (render và kiểm tra bằng skill PDF), bug screenshots/GitHub Issues theo quyền publish, commit-log cuối, README self-assessment/test statistics/demo thực, ZIP `<StudentID>_HW02_AI_DomainTesting_<SelfAssessedGrade>.zip`; deadline phải lấy từ Moodle. Không tự xác nhận group allocation, điểm tự đánh giá, link demo hoặc submit.

## Tự review kế hoạch

Đã rà R01-R09 với Task 1/2; R08 có BVA Task 3; ambiguity h1/matching/locale/lecture đi xuyên review và execution. Năm Review Focus đều có case family/task sở hữu. Schema/source ID/canonical ID/observation nhất quán; N chỉ chốt sau dedup, coverage không lấy từ số case sinh. Không chạy placeholder backend npm test hoặc invent mobile lint/test script. Các bước implementation của kế hoạch là tạo harness/report và quan sát SUT; TDD cho harness validation không được biến thành sửa ứng dụng để test xanh.

## Execution handoff

Đề xuất **Native**: thực thi các task tuần tự trong chat này bằng `superpowers:executing-plans`, vì oracle/fixture/dedup/evidence phụ thuộc chặt vào nhau và target native cần giữ state nhất quán. Lựa chọn **Subagent-driven** dùng `superpowers:subagent-driven-development` với implementer/reviewer riêng từng task. Theo `writing-plans`, chờ người dùng review kế hoạch và chọn cách thực thi trước khi bắt đầu Task 1; hiện tại chưa thực thi testing workflow.
```

Pending learner review.

## Interaction 2447f747-2d08-4a84-852a-b4ebbc4eae6a

```text
{
  "tool": "Codex",
  "model": "Unknown",
  "task": "FR-05-plan-self-review",
  "occurred_at": "Unknown",
  "recorded_at": "2026-10-16T10:02:11+07:00",
  "source": "Second saved plan revision after assistant self-review of the same user prompt: added explicit initial unfiltered LIST/virtualization check, clarified derived n versus controllable inputs, and specified fixture images and HTTP serving. This is AI self-review, not learner feedback. Other chat/tool messages excluded; interaction time and exact model unavailable.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-05: Product listing and search trên mobile đảm bảo tuân theo workflow sau:

1. **Phân tích requirement**
2. **Sinh test case Domain Testing**
3. **Sinh test case BVA**
4. **Review + deduplicate + liên kết test case với technique**
5. **Execute toàn bộ test suite**
6. **Ghi actual result / pass-fail / bug**
7. **AI gap analysis**

Đối với cả Domain Testing và BVA, phải giải thích chi tiết từng bước áp dụng kỹ thuật, không chỉ nộp bảng test case cuối cùng.
```

### Original AI output

```text
# FR-05 Mobile Product Listing and Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kiểm thử FR-05 trên mobile native theo đúng 7 bước: requirement → Domain Testing → BVA → review/deduplicate/technique mapping → execute toàn suite → actual/pass-fail/bug → AI gap analysis; giải thích cách dẫn xuất từng kỹ thuật, không chỉ cung cấp bảng case.

**Architecture:** Xây oracle từ requirement trước khi dùng code để tìm đường thực thi. Lưu riêng case nguồn Domain Testing/BVA và hợp nhất thành suite canonical có traceability; mỗi lần chạy lưu bằng chứng theo interface, thiết bị và build. Backend chạy trong fixture cách ly; bảo toàn SUT và dữ liệu làm việc.

**Tech Stack:** Markdown/JSON/JSONL; React Native 0.81.5, React 19.1.0, Expo ~54.0.33 theo `frontend-mobile/package.json`; Node.js/Express/SQLite; Python standard library cho validator và thống kê; công cụ native được kiểm tra ở Task 5.

**Spec:** `README.md:73-82` (FR-05); `api_specification.md:80-82` (GET products/search); `docs/2026.HW02.Domain Testing_En.pdf` trang 3-6, mục 6, 9, 10, 12, 14; `AGENTS.md`. Phương pháp: `.agents/skills/domain-testing/SKILL.md`, `.agents/skills/boundary-value-analysis/SKILL.md` và các references đi kèm. Chưa tìm thấy lecture trong repo: on/off/in và ISTQB 3-value BVA là **working convention**, chưa xác nhận là phương pháp trên lớp.

## Global Constraints

- "For testing requests, preserve the SUT's behavior and report discrepancies."
- "Change application code to fix a bug only when the user requests a fix."
- "Do not expand a selected feature into testing the whole application."
- "Use stable FR IDs for traceability."
- "Expo web tests do not establish Android/iOS behavior."
- "Each case records ID, rule, preconditions, input/fixture, steps, expected result, actual result, status, and evidence."
- "Use `Not Run` for designed but unexecuted cases and `Blocked` for cases prevented by the environment."
- "Never infer pass/fail from generated cases."
- "Do not stage incidental test changes to it." (`backend/database.sqlite`)
- "Do not fabricate student review, audit entries, execution results, or demo links."
- "Use Asia/Ho_Chi_Minh for user-facing local times unless the user specifies another timezone."
- "Push, amend, rebase, squash, and other history rewrites require the user's request."

Phạm vi hiện tại là **lập kế hoạch**, chưa chạy suite và chưa tạo kết quả kiểm thử. Khi kế hoạch được chọn để thực thi, kiểm thử màn Home/tìm kiếm FR-05 trên một nền tảng native được chốt trong manifest; ưu tiên Android nếu có thiết bị/emulator khả dụng, iOS là lựa chọn thay thế nếu Android không khả dụng. Không suy rộng kết quả sang OS còn lại. API là bằng chứng hỗ trợ; không thay thế verdict native. Không mở rộng sang FR-06, giỏ hàng hay admin CRUD; việc nạp sản phẩm chỉ là setup fixture.

## Review Focus

1. Kết quả 0/1/2: empty state sau response rỗng, hiển thị đầy đủ sản phẩm khi có dữ liệu; không nhầm loading với rỗng (Task 2 EMPTY/STATE; Task 3 RESULT-N).
2. Từ khóa có dấu, dấu nháy, `&`, `+`, `#`, `%`, `_`, chuỗi HTML: truyền nguyên nghĩa và hiển thị như văn bản an toàn; tách chính sách matching chưa rõ khỏi lỗi quan sát được (Task 1 A02; Task 2 TEXT/TRANSPORT/SAFE).
3. Hai search có response đảo thứ tự và trạng thái loading: không gán kết quả của query cũ cho query mới; kỳ vọng này là derived usability oracle cần gắn nhãn (Task 2 STATE; Task 5).
4. Ảnh không vuông và tên dài: ảnh giữ tỷ lệ, tên nhận diện được, accessibility mô tả ảnh; không dùng DOM alt/h1 làm bằng chứng native (Task 1 A01/A03; Task 2 PRESENTATION).
5. LAN/backend lỗi hoặc native không khả dụng: phân biệt lỗi hạ tầng, HTTP error và empty result; lưu nguyên nhân Blocked cùng bằng chứng (Task 5 PREFLIGHT/ERROR; Task 6).

---

## Cấu trúc file và hợp đồng bàn giao

Gốc artifact là `docs/testing/fr05/`, gốc harness là `tests/fr05/`. Các đường dẫn trong bảng là tương đối với repo `/Users/thuytran/Workspace/eshop-sut`. Chỉ tạo/sửa các file FR-05; giữ nguyên `.gitignore` và `docs/testing/fr03/*` đang có thay đổi của công việc khác.

| File | Trách nhiệm |
|---|---|
| `docs/testing/fr05/requirements.md` | Rule/oracle, nguồn, scope native/API, ambiguity và method |
| `docs/testing/fr05/domain-model.md` | Các bước mô hình miền, predicate, boundary, on/off/in, interaction |
| `docs/testing/fr05/domain-cases.md` | Case nguồn DT và mapping obligation |
| `docs/testing/fr05/bva-report.md` | Ordered partitions → endpoints → neighbors → union → case/coverage |
| `docs/testing/fr05/suite-review.md` | Correction ledger, dedup, technique mapping, phiên bản/hash suite |
| `tests/fr05/suite.json` | Canonical case và obligation registry, không chứa kết quả run |
| `tests/fr05/validate_suite.py` | Validate schema/traceability và reconcile observations |
| `tests/fr05/fixtures/catalog.json` | Catalog có ID, tên, giá, ảnh kích thước biết trước và expected sets |
| `tests/fr05/fixtures/images/{square,wide,tall}.png` | Ảnh fixture tỷ lệ 1:1, 2:1, 1:2, có kích thước/checksum xác minh |
| `tests/fr05/prepare-environment.cjs` | Sao chép backend vào thư mục tạm, init/seed DB cách ly, reset fixture |
| `tests/fr05/run-products-api.cjs` | GET products có encoding đúng; response và HTTP evidence hỗ trợ |
| `tests/fr05/native-runbook.md` | Các bước thao tác native theo case, screenshot/log, reset và thu evidence |
| `docs/testing/fr05/execution-decisions.md` | Device/tool/connectivity, ambiguity resolution, adjustment và giới hạn |
| `docs/testing/fr05/evidence/<runId>/manifest.json` | Build SHA/dirty diff hash, suite/fixture hashes, clock, device/OS/locale, endpoint |
| `docs/testing/fr05/evidence/<runId>/observations.json` | Observation theo case/interface, assertions, status, evidence/bug references |
| `docs/testing/fr05/evidence/<runId>/{native,api}/` | Ảnh/video/log native và request/response API, phân biệt rõ nguồn |
| `docs/testing/fr05/test-results.md`, `bugs.md` | Actual/pass-fail, giới hạn thực thi và bug tái hiện được |
| `docs/testing/fr05/ai-interactions.jsonl`, `ai-interactions.md` | Audit append-only và bản đọc được, không nhận vơ learner review |
| `docs/testing/fr05/ai-gap-analysis.md`, `ai-critique.md` | AI omissions có evidence và critique 200-300 từ |
| `docs/testing/fr05/README.md`, `commit-log.txt` | Test statistics, self-assessment còn chờ người học, lịch sử commit thực |

Đây là map file **sẽ tạo khi thực thi**, ngoại trừ audit của chính bước lập kế hoạch. Không tạo case rỗng hay report kết quả để giả lập tiến độ.

**Schema dùng xuyên suốt:**

- `Rule`: `{id: FR05-Rxx, source, text, oracleKind: explicit|derived|unresolved, applicableInterfaces}`.
- `Obligation`: `{id, technique: DT|BVA|Supplementary, ruleIds, interface, description, derivation, sourceCaseIds}`.
- `SourceCase`: `{id: FR05-DT-xxx|FR05-BVA-xxx|FR05-SUP-xxx, ruleIds, obligationIds, interface, preconditions, fixtureId, input, steps, expected, actual: null, status: "Not Run", evidence: []}`.
- `CanonicalCase`: `{id: FR05-TC-xxx, sourceCaseIds, techniques, obligationIds, ruleIds, interface, preconditions, fixtureId, input, steps, expected}`.
- `Observation`: `{runId, caseId, interface, platform, actual, assertions, status: Passed|Failed|Blocked|Not Run, evidence, bugIds, reason}`. Chuỗi `actual` mô tả điều đã quan sát, không chép expected.
- Với unresolved oracle: ghi observation thăm dò riêng, giữ case cần verdict ở Blocked với reason `ORACLE_UNRESOLVED`; không tự thêm trạng thái Passed dựa vào code. Không đưa phần unresolved vào denominator đã chốt, nhưng phải liệt kê giới hạn và số ca bị chặn.

Mỗi task append audit: prompt và output khả dụng, model khi biết, thời điểm có timezone, capture extent, nguồn; original output không bị ghi đè. Review AI và review người học là hai sự kiện khác nhau; khi chưa có feedback thật ghi `Pending learner review`.

## Task 1: Phân tích requirement

**Files:** Create `requirements.md`; append `ai-interactions.jsonl`; export `ai-interactions.md` bằng skill `ai-audit`.

**Interfaces:** Consumes các spec ở đầu plan; produces rule registry, ambiguity ledger, platform scope và input dictionary để Task 2/3 dùng chung.

- [ ] **Step 1: Trích requirement và khóa oracle trước khi đọc sâu implementation.** Tạo `FR05-R01` tất cả sản phẩm dạng grid; `R02` ảnh đúng tỷ lệ và mô tả; `R03` tên; `R04` giá ₫ có phân cách hàng nghìn; `R05` search theo tên; `R06` keyword hiển thị an toàn; `R07` loading; `R08` empty search result; `R09` đúng một h1. Gộp hai câu h1 trùng trong README vào R09, giữ cả source lines.
- [ ] **Step 2: Ghi ambiguity có phương án xử lý.** `A01`: h1 là HTML, chưa có hợp đồng heading native; kiểm tra native accessibility như probe, không tự fail vì không có HTML. `A02`: chưa rõ contains/exact, case/diacritic sensitivity, trim, query empty vs omitted, literal wildcard; case có phụ thuộc chính sách phải ghi unresolved. `A03`: chưa chốt locale dấu phân cách, tỷ lệ ảnh chuẩn và tên dài có bắt buộc đủ toàn bộ; oracle chắc chắn là ₫ + nhóm nghìn, không méo ảnh, tên hiển thị. `A04`: chưa có max query length, pagination, precision giá hay timeout/loading duration; không tạo limit từ code. `A05`: empty catalog, network error và latest-query-wins là derived robustness expectations, không lẫn với câu chữ explicit. Nếu có lecture sau này, so lại convention và version hóa dẫn xuất trước khi chạy.
- [ ] **Step 3: Lập input dictionary.** `q` là chuỗi Unicode nguyên dạng; API còn phân biệt omitted với empty. `C` là catalog, `M=|C|∈N0`; `S(q,C)` là tập match theo policy đã chốt, `n=|S|∈N0`, `0≤n≤M`; `s∈{pending,success,error}` là state, không phải số dùng BVA. Ghi price/image/name là dữ liệu hiển thị, số nguyên VND chỉ là lát cắt fixture; không suy ra rule tạo sản phẩm FR-15.
- [ ] **Step 4: Đối chiếu interface và điểm thực thi.** Đọc `frontend-mobile/App.js:16,84-111,455-533`, `backend/server.js:141-157`, `backend/database.js`, package files. Ghi API URL LAN hardcoded, fetch query interpolation, FlatList/Image/Text và DB init drop tables là điểm cần kiểm chứng. Những dấu hiệu từ code chỉ là suspected discrepancy, không kết luận bug hay đổi expected theo code.
- [ ] **Step 5: Verify và commit.** Mọi R có nguồn/interface, A có ảnh hưởng và cách tránh false verdict; không thêm requirement min/max. Kiểm tra `git diff --check`; review đúng file rồi commit `docs(fr05): analyze mobile listing and search requirements`.

## Task 2: Sinh test case Domain Testing, giải thích từng bước

**Files:** Create `domain-model.md`, `domain-cases.md`, `tests/fr05/fixtures/catalog.json`; append audit.

**Interfaces:** Consumes rules/input dictionary Task 1; produces miền, predicate/boundary registry và source cases `FR05-DT-xxx`.

- [ ] **Step 1: Dựng fixture chuẩn và expected sets độc lập.** Catalog gồm tên duy nhất `Alpha`, `Alpine`, `Beta`, `Cà phê`, `O'Brien`, `A&B`, `A+B`, `A#B`, `Promo%Off`, `Promo_Off`, một tên có token chỉ nằm trong description và một tên dài. Có ảnh vuông/2:1/1:2 kích thước biết trước, giá 999/1000/1001/999999/1000000/1000001 ₫. Dùng asset ảnh local có thể truy cập từ native để tránh phụ thuộc host ảnh ngoài; fixture lưu URL, kích thước và checksum. Expected full-name searches lấy từ tập ID đã biết; `Al` chỉ có expected chính thức sau khi policy substring được chốt, không lấy output API làm oracle.
- [ ] **Step 2: Viết predicate và miền đầu ra.** Với response thành công: `P_complete: IDs(UI)=S`, không thiếu/trùng; `P_empty: n=0`; `P_nonempty: n≥1`; `P_loading: s=pending`; `P_safe: keyword là text literal`; `P_card: name + price + image thỏa R02-R04`. Tách `pending`, `success∧n=0`, `success∧n>0`, `error`; khi pending, n chưa biết, không giả sử n=0. Complement ghi rõ trường hợp nào là sai output, trường hợp nào là state hợp lệ có expected khác; zero result là kết quả hợp lệ, không phải input bị từ chối. q/C/state là input hoặc precondition điều khiển được; n là đại lượng dẫn xuất, không phải input độc lập. `n≤M` là consistency constraint, không phải rule chấp nhận mới; không tuyên bố phủ biên số đa chiều kiểu x+y≤k khi requirement không có predicate đó.
- [ ] **Step 3: Chọn interior/reference và giải thích partition search.** Reference: native Home, network ổn, catalog chuẩn, q là tên có đúng một match, s=success. Phân hoạch q theo omitted/empty, known full-name, token trong nhiều tên (conditional), token chỉ trong description, no-match, Unicode, ký tự URL/SQL, HTML-like. Đây là categorical partitions; không gọi boolean/HTML/Unicode là biên số hay tự gán thứ tự.
- [ ] **Step 4: Lập bảng on/off/in cho miền có thứ tự.** Boundary empty/nonempty tại n=0: on=(q_no_match,C,M>0,n=0,s=success), off phía trong nonempty n=1, interior n=2; n=-1 infeasible. Lấy hai điểm on tách biệt: catalog khác rỗng/no-match và catalog rỗng (latter gắn derived oracle). Cho coupled completeness `n≤M`, lấy on (M,n)=(1,1),(2,2), off khả thi (2,1) và interior (3,1); (M,M+1) không thể seed hợp lệ, dùng assertion phát hiện sai output chứ không dựng input giả. Bảng phải có tọa độ, truth values từng predicate, source và expected; n=1 không tự động là interior của miền empty.
- [ ] **Step 5: Sinh interaction/state/presentation cases.** LIST: mở Home từ state sạch, chưa tìm kiếm, expected toàn bộ catalog dạng grid; cuộn đến phần tử cuối để kiểm FlatList virtualization không bị hiểu nhầm là thiếu dữ liệu. EMPTY: query vô nghiệm rồi có nghiệm rồi xóa/tìm lại theo policy. STATE: delay response có kiểm soát để bắt loading lúc initial load và search; pending→success rỗng/nonempty, pending→error; hai query A/B response đảo thứ tự là supplement derived. TEXT/TRANSPORT: Vietnamese, quote, URL reserved chars và keyword chỉ trong description. SAFE: `<b>Alpha</b>` và chuỗi HTML-like vô hại hiển thị nguyên văn, không render markup; payload không chứa exfiltration. PRESENTATION: ≥2 sản phẩm để kiểm grid trên viewport chốt, ảnh ratio khác nhau, name/₫/nhóm nghìn và accessibility description. R09 unresolved native vẫn có traceability, không lặng lẽ bỏ.
- [ ] **Step 6: Cô lập lỗi và ghi coverage.** Mỗi case thay một điều kiện chính, giữ nominal các điều kiện khác; multi-fault có nhãn riêng để tránh masking. Liên kết R→domain/boundary→obligation→source case; các bổ sung không có boundary giữ technique Supplementary hoặc DT partition phù hợp. Viết lập luận lựa chọn điểm và giới hạn lấy mẫu, không chỉ bảng cuối.
- [ ] **Step 7: Verify và commit.** Tự tính expected ID sets, n≤M, truth table và feasibility; case đủ schema và tất cả Not Run; `git diff --check`; commit `docs(fr05): derive mobile product search domains and cases`.

## Task 3: Sinh test case BVA, giải thích từng bước

**Files:** Create `bva-report.md`; append audit. Không ghi đè nguồn DT.

**Interfaces:** Consumes dictionary/fixtures Task 1/2; produces BVA obligation registry và source cases `FR05-BVA-xxx`.

- [ ] **Step 1: Chốt technique và applicability.** Dùng ISTQB 3-value theo local reference khi lecture chưa có. BVA cốt lõi ở **cardinality của kết quả hiển thị**, không phải validation số lượng do user nhập. Search semantics, safe text, loading và accessibility không tự có biên số. Max keyword/pagination/giá lớn nhất không được quy định nên không bịa upper endpoints.
- [ ] **Step 2: Dẫn xuất ordered partitions.** U=N0; E0={0} cho success-empty, E1=[1,+∞) cho success-nonempty. Finite endpoints là 0,1; +∞ không phải endpoint có thể test, -1 ngoài universe. Với fixture cụ thể có M sản phẩm, n≤M; chuẩn bị M≥2 để 0/1/2 khả thi, không nhầm M là pagination limit.
- [ ] **Step 3: Tính neighborhoods và union có truy vết.** Endpoint 0→{0,1}; endpoint 1→{0,1,2}; union={0,1,2}. Ba value obligations cho một interface/platform đã chốt. Không dùng công thức 4n+1/6n+1; không đếm endpoint trùng hai lần. Bảng giữ endpoint→neighbor value→source case dù case sau này được dedup với DT.
- [ ] **Step 4: Chuyển giá trị thành fixture thực.** Để không phụ thuộc substring policy, seed ba snapshot catalog với M=0,1,2 sản phẩm và dùng cùng search full-name `Alpha` (các ID khác nhau nhưng cùng tên khi n=2); GET/query native thực tế trả đúng 0/1/2 matching products. n=0 kỳ vọng empty search state, n=1/2 đúng số card/ID, mọi card thỏa R02-R04. Có catalog chuẩn M>0 + query vô nghiệm ở DT để phân biệt empty dataset với no-match; hai setup này không dedup. Nếu UI không cung cấp ID, đối chiếu card signature phân biệt được bằng giá/ảnh và API/fixture; không khẳng định ID dựa chỉ vào tên trùng.
- [ ] **Step 5: Ghi phần chưa đủ cơ sở BVA.** Query length 0/1/2 là exploratory probes cho đến khi có partition khác expected có nguồn, không tính là 3-value BVA của giới hạn độ dài. Bộ giá quanh 1000/1000000 là kiểm tra ranh giới biểu diễn nhóm nghìn, không phải business acceptance boundary; ghi supplementary nếu chưa dẫn xuất được partition/precision đầy đủ. Không ép toàn bộ FR-05 vào BVA để tăng số case.
- [ ] **Step 6: Viết báo cáo theo chuỗi dẫn xuất.** Source→type/unit/resolution (count, step 1)→partitions→endpoints→neighborhoods→union→fixture/expected→cases→coverage. Đánh giá riêng designed covered obligations/3 và exercised obligations/3 trên native target; không nói 100% toàn feature khi chỉ phủ cardinality. Nếu bổ sung partition có nguồn, version hóa obligation registry và tính lại denominator trước execution.
- [ ] **Step 7: Verify và commit.** Tính lại union bằng tay, kiểm fixture n=0/1/2 khả thi, neighbors không âm; mọi case Not Run; `git diff --check`; commit `docs(fr05): derive mobile result-count boundary cases`.

## Task 4: Review + deduplicate + liên kết test case với technique

**Files:** Create `suite-review.md`, `tests/fr05/suite.json`, `tests/fr05/validate_suite.py`; append audit.

**Interfaces:** Consumes DT/BVA source cases; produces canonical v1, SHA-256 và CLI `python3 tests/fr05/validate_suite.py --suite tests/fr05/suite.json [--observations PATH]` (exit 0 hợp lệ, exit 1 có lỗi).

- [ ] **Step 1: Review oracle và kỹ thuật.** Rà 5 Review Focus, source của expected, ambiguous policies, on/off/in truth values, BVA union, khả năng seed, native applicability và masking. Ledger ghi before/after/reason/evidence/reviewer; assistant self-review không giả là student review. Case không có kết luận từ oracle không được sửa expected cho khớp code.
- [ ] **Step 2: Dedup theo scenario thực thi.** Chỉ merge khi cùng interface/platform, fixture/state, q nguyên dạng, ordered steps, expected và dependency. Union sourceCaseIds/techniques/obligationIds, thực thi toàn bộ assertions. Case n=0 do C rỗng và case q_no_match trên C khác rỗng không trùng. API/native, initial-loading/search-loading, query có dấu/không dấu cũng không trùng. Không xóa source case hay nghĩa vụ khi canonical hóa.
- [ ] **Step 3: Validate harness bằng dữ liệu nhỏ.** Validator kiểm unique ID, reference tồn tại, schema, mapping không orphan, technique đúng obligation, source case được map hoặc exclusion có lý do, evidence path nằm trong run. Self-check: duplicate canonical ID, mất BVA value=2 và orphan source phải exit 1; suite hợp lệ exit 0. CLI có observations phải phát hiện unknown/duplicate/missing result, thiếu evidence, Passed/Failed thiếu actual/assertions. Không test logic ứng dụng bằng validator.
- [ ] **Step 4: Freeze và xuất traceability.** R→domain/partition→obligation→source case→canonical→technique→interface. Lưu N canonical thực, hash fixture/suite và baseline AI output trước bổ sung review. Không ấn định N trước khi dedup; báo source counts riêng với unique canonical count. Coverage DT và BVA giữ denominator riêng; Supplemental không làm phình denominator BVA.
- [ ] **Step 5: Verify và commit.** Chạy CLI exit 0, spot-check mapping ngược mỗi obligation, xác nhận chưa có verdict chạy; `git diff --check`; commit `test(fr05): freeze reviewed mobile domain and boundary suite`.

## Task 5: Execute toàn bộ test suite

**Files:** Create setup/API runner/native runbook, `execution-decisions.md`, `evidence/<runId>/`; append audit. Ghi observation ngay khi chạy, báo cáo tổng hợp ở Task 6.

**Interfaces:** Consumes frozen suite/fixture; setup CLI `node tests/fr05/prepare-environment.cjs --suite tests/fr05/suite.json --run-id RUN_ID`; API CLI `node tests/fr05/run-products-api.cjs --suite tests/fr05/suite.json --base-url URL --run-id RUN_ID`; produces manifest, observations và raw evidence. CLI chỉ được chạy sau khi đã được tạo và kiểm tra side effects.

- [ ] **Step 1: Preflight native và chốt target.** Kiểm tra `adb devices -l`, `xcrun simctl list devices booted`, Expo/dependencies, UI control thực tế; ghi availability. Chọn Android sẵn dùng trước, nếu không có thì iOS sẵn dùng; không suy ra có device chỉ vì có adb/xcrun. Chốt OS/device/build/viewport/font scale/locale/accessibility reader. Nếu không có native surface điều khiển hoặc thu evidence được, các native case Blocked; có thể chạy API hỗ trợ nhưng không đổi nhãn native thành Passed. Expo web chỉ là optional diagnostics và có bucket riêng.
- [ ] **Step 2: Chuẩn bị backend cách ly.** Đọc lại startup destructive trong database.js. Script sao chép `server.js`, `database.js`, package metadata vào `/private/tmp/eshop-fr05-<runId>/backend`, dùng dependencies sẵn có hoặc npm với lockfile trong copy; không seed/start backend trong working repo. Đảm bảo port 3000 đang rảnh, nếu bận không kill process khác. Init chỉ DB copy, đợi seed hoàn tất, nạp snapshot fixture và kiểm row count/ID/checksum trước mỗi case. Sao chép để nguyên hành vi SQL/API; không sửa app để test đi qua.
- [ ] **Step 3: Xác minh đường mạng và asset.** Native phải truy cập được backend/ảnh ở địa chỉ thực; localhost của device khác máy chủ. Serve thư mục ảnh fixture bằng `python3 -m http.server 3001 --bind 0.0.0.0 --directory tests/fr05/fixtures/images` sau khi kiểm port rảnh; catalog dùng URL LAN port 3001 và kích thước đã xác minh. App hardcode `http://192.168.10.13:3000/api`; ưu tiên host/network routing hợp lệ. Nếu cần endpoint adjustment, chỉ đổi trong bản mobile copy ở `/private/tmp/eshop-fr05-<runId>/mobile`, giữ exact diff/hash và nhãn environment adjustment, không sửa nghiệp vụ hay working App.js. Kiểm reachability từ device, không dùng curl trên host để chứng minh device kết nối được. Nếu không thể nối, native case Blocked với log.
- [ ] **Step 4: Kiểm readiness của harness.** API runner gửi query bằng `URL`/`URLSearchParams`, lưu raw URL/status/body; native runbook thao tác input thực của app để phát hiện app encoding sai. Dùng proxy chỉ cho delay/reorder/error khi test state, lưu cấu hình và actual timing; không biến đổi payload của ca chức năng. Đánh dấu proxy simulation khác backend integration. Self-check fixture reset không chạm database làm việc và app build không có patch nghiệp vụ.
- [ ] **Step 5: Ghi manifest trước run.** Lưu run ID, Git SHA + dirty state/hash phần liên quan, suite/fixture hash, build/package versions, target native OS/device, locale/timezone, thời gian `+07:00`, API/assets URLs, reset policy và tooling. Không có counter/time-dependent FR05 rule: ghi counters N/A, vẫn reset catalog/search/navigation/network giữa các ca để tái lập.
- [ ] **Step 6: Execute mỗi canonical case và thu evidence.** Khởi động native từ copy bằng npm trong component phù hợp, thao tác Home→nhập keyword→Tìm→quan sát; chụp trước/trong/sau phù hợp case và lưu screenshot filename chứa case ID. STATE giữ response để thấy loading rồi release; ảnh ratio cần screenshot + asset dimensions, accessibility cần hierarchy hoặc screen-reader evidence. Nếu thiếu control/functionality có oracle, case kiểm presence Failed; case tương tác bị phụ thuộc Blocked, không loại khỏi suite. Duyệt toàn bộ N IDs, mỗi ID một primary observation cho run; thiếu oracle/hạ tầng ghi Blocked với reason; không dừng ở failure đầu. Rerun dùng run ID mới, không ghi đè failure cũ.
- [ ] **Step 7: Reconcile rồi commit execution evidence.** Chạy validator với observations: tất cả canonical IDs đều có row, không unknown/duplicate, file evidence tồn tại. Báo riêng Passed/Failed/Blocked/Not Run và remaining blockers. Full execution chỉ đạt khi không còn Blocked/Not Run; nếu có blocker, task giữ trạng thái chưa hoàn tất phần đó, ghi bước cần làm để resume. Commit bằng chứng hiện có trung thực: `test(fr05): record native product search execution evidence`.

## Task 6: Ghi actual result / pass-fail / bug

**Files:** Create `test-results.md`, `bugs.md`; cập nhật `suite-review.md` liên kết execution; append audit.

**Interfaces:** Consumes raw observations Task 5; produces verdict/assertion matrix và bug records `FR05-BUG-xxx`.

- [ ] **Step 1: Đối chiếu từng assertion với oracle.** Passed khi tất cả expected assertions đã quan sát đạt; Failed khi có sai khác với oracle đã chốt; Blocked khi thiếu môi trường/dependency/oracle; Not Run khi chưa thử. Lưu text/ID/count/loading/price/ảnh thực tế, không dùng screenshot đơn lẻ suy ra timing hay HTML execution. Static code suspicion hoặc derived policy chưa xác nhận không tự trở thành confirmed defect.
- [ ] **Step 2: Viết bug tái hiện được.** Mỗi bug gồm rule/source, platform/build/run, fixture/reset, q chính xác, steps, expected/actual, reproducibility, severity có lý do, screenshot/log/native hierarchy hoặc API supporting evidence và affected case IDs. Gom nhiều failures cùng nguyên nhân sau khi có evidence, không đồng nhất số Failed cases với số bugs. Failure do network setup không báo thành bug SUT nếu chưa cô lập được.
- [ ] **Step 3: Tính thống kê unique và coverage đúng interface.** D=N canonical; P/F/B/NR là primary verdict cuối đã chỉ định, `D=P+F+B+NR`; executed `E=P+F`, not-yet-executed `B+NR`. Ghi blocked riêng. Attempts/reruns và API observations không tăng D native. DT/BVA designed coverage = obligations có valid designed case / obligations đã xác định; exercised coverage = obligations đã đánh giá bằng run có bằng chứng / cùng denominator, có thể gồm Failed. Blocked không là exercised. Requirement coverage, platform coverage và known limitations có bảng riêng.
- [ ] **Step 4: Kiểm chứng evidence và commit.** Chạy validator/reconcile, đối chiếu từng bug với failed assertion/raw evidence, kiểm link và `git diff --check`. Commit `docs(fr05): report mobile search results and observed defects`. GitHub Issues chỉ tạo khi người dùng cho phép publish; chuẩn bị nội dung local đầy đủ, đánh dấu chưa publish nếu chưa được phép.

## Task 7: AI gap analysis

**Files:** Create `ai-gap-analysis.md`, `ai-critique.md`, `README.md`, `commit-log.txt`; export audit MD; append audit. Không viết lại original generation evidence.

**Interfaces:** Consumes frozen baseline, correction ledger, final suite/observations/bugs và interactions; produces evidence-based gap table, critique và feature summary.

- [ ] **Step 1: So sánh baseline và bổ sung thật.** Gap table: original interaction/output + missing/wrong case/rule + ai/người học phát hiện + correction + final case/bug/evidence. Tách omission về case thiết kế với bug thực sự bị bỏ sót; case bổ sung không chứng minh có bug. Nếu không có omission quan sát được thì ghi như vậy; không tạo ví dụ giả để đủ báo cáo.
- [ ] **Step 2: Phân tích nguyên nhân có mức chắc chắn.** Đánh giá prompt thiếu platform/locale/policy, giới hạn tool/native accessibility, kỹ thuật áp sai categorical BVA, hoặc interaction complexity. Gắn `observed`/`hypothesis`, không kết luận nguyên nhân nội tại của model khi không có bằng chứng. Nêu gap đã đóng và gap còn mở như h1 native/lecture/OS chưa chạy.
- [ ] **Step 3: Xuất AI Audit và viết critique 200-300 từ.** Dùng `ai-audit`, log model khi biết, timestamps có offset, exact visible prompts/available outputs/capture extent. Đếm từ critique bằng split whitespace và ghi quy ước cho tiếng Việt; nội dung từ quan sát thật. Review người học chưa có giữ Pending; không gọi log scoped hiện tại là toàn bộ lịch sử chat.
- [ ] **Step 4: Tổng hợp feature package.** README chứa scope FR05 mobile (1 feature), unique stats/bugs, platform limitations, self-assessment chờ người học, demo link chỉ khi có thật. Xuất commit log thực theo paths FR05 bằng `git log --date=iso-strict --format=fuller -- docs/testing/fr05 tests/fr05 docs/superpowers/plans/2026-10-16-fr05-mobile-domain-testing-bva.md`; không tạo commit quá khứ. Commit task hiện tại được ghi khi xuất bản log cuối ở bước đóng gói sau commit.
- [ ] **Step 5: Verify và commit.** Kiểm traceability gap→revision/evidence, word count 200-300, thống kê khớp Task 6, audit parse/export thành công, links và `git diff --check`; commit `docs(fr05): analyze evidenced AI gaps in mobile testing`.

## Tiêu chí hoàn thành và ranh giới bàn giao

- [ ] Đã giữ đúng thứ tự 7 task; log actual được thu lúc execution, không dựng lại ở Task 6.
- [ ] Domain report có source, inputs, predicate/miền/complement, reference, on/off/in, feasible interactions, truth evaluation và obligation mapping.
- [ ] BVA report có convention, universe/resolution, ordered partitions, finite endpoints, neighbor derivation, union/dedup, fixture và coverage denominator; các giới hạn chưa rõ được công khai.
- [ ] Suite canonical không bỏ mất nghĩa vụ; mỗi ca có technique mapping, full steps/expected, actual/status/evidence theo run; tất cả native case được thực thi hoặc giữ blocker rõ ràng. Không tuyên bố execute toàn bộ thành công nếu còn Blocked/Not Run.
- [ ] Bugs được quan sát/tái hiện; không sửa SUT, không thay native evidence bằng API/Expo web, không chạm DB làm việc.
- [ ] AI gap/critique/audit dùng bằng chứng thật; human review Pending nếu chưa được cung cấp; mỗi bước hoàn thành có commit riêng.

Kế hoạch này tạo feature report Markdown và evidence FR05, không tự hoàn thành toàn bộ HW02 bốn feature. Khi đóng gói bài nộp đầy đủ: main report và AI Audit/Critique cần cả Markdown/PDF (render và kiểm tra bằng skill PDF), bug screenshots/GitHub Issues theo quyền publish, commit-log cuối, README self-assessment/test statistics/demo thực, ZIP `<StudentID>_HW02_AI_DomainTesting_<SelfAssessedGrade>.zip`; deadline phải lấy từ Moodle. Không tự xác nhận group allocation, điểm tự đánh giá, link demo hoặc submit.

## Tự review kế hoạch

Đã rà R01-R09 với Task 1/2; R08 có BVA Task 3; ambiguity h1/matching/locale/lecture đi xuyên review và execution. Năm Review Focus đều có case family/task sở hữu. Schema/source ID/canonical ID/observation nhất quán; N chỉ chốt sau dedup, coverage không lấy từ số case sinh. Không chạy placeholder backend npm test hoặc invent mobile lint/test script. Các bước implementation của kế hoạch là tạo harness/report và quan sát SUT; TDD cho harness validation không được biến thành sửa ứng dụng để test xanh.

## Execution handoff

Đề xuất **Native**: thực thi các task tuần tự trong chat này bằng `superpowers:executing-plans`, vì oracle/fixture/dedup/evidence phụ thuộc chặt vào nhau và target native cần giữ state nhất quán. Lựa chọn **Subagent-driven** dùng `superpowers:subagent-driven-development` với implementer/reviewer riêng từng task. Theo `writing-plans`, chờ người dùng review kế hoạch và chọn cách thực thi trước khi bắt đầu Task 1; hiện tại chưa thực thi testing workflow.
```

Pending learner review.

## Interaction 9b565ed9-8f56-4bc0-b1c7-feab8b450995

```text
{
  "tool": "Codex",
  "model": "Unknown",
  "task": "FR05-Task1",
  "occurred_at": "Unknown",
  "recorded_at": "2026-10-16T10:27:39+07:00",
  "source": "User execution instruction and Task 1 artifact only; excludes skill payload/tool transcript; model and interaction time unavailable; learner technical review pending.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
```

### Original AI output

```text
# FR-05 Mobile: Phân tích requirement

## 1. Mục tiêu và test basis

Report chỉ kiểm thử **Product listing and search** trên mobile native. API được kiểm tra để giải thích request/response; API pass không chứng minh UI native pass. Không sửa SUT để làm test pass.

Test oracle là [README FR-05](../../../README.md#fr-05-xem-danh-sách--tìm-kiếm-sản-phẩm), dòng 73-81; [API specification](../../../api_specification.md#31-lấy-danh-sách-sản-phẩm), dòng 80-82, định nghĩa `GET /api/products` với `search` tùy chọn. [HW02](../../2026.HW02.Domain%20Testing_En.pdf), mục 6, yêu cầu giải thích từng bước Domain Testing/BVA; mục 9-10 yêu cầu AI Audit/Critique; mục 12 yêu cầu commit theo bước.

Lecture chưa có trong repository. Report dùng **on/off/in** và **ISTQB 3-value BVA** theo local skill references như một **working convention**, không khẳng định đây là đúng quy ước giảng viên. Nếu có lecture, cần đối chiếu và version lại obligations trước khi tính coverage.

## 2. Rule registry

| Rule ID | Requirement và expected behavior | Nguồn README | Interface |
|---|---|---|---|
| FR05-R01 | Home hiển thị toàn bộ catalog dạng grid, không mất sản phẩm khi cuộn | 75 | Native |
| FR05-R02 | Mỗi card có ảnh không biến dạng tỷ lệ và mô tả ảnh | 76 | Native; alt HTML cần diễn giải thành accessibility mô tả native |
| FR05-R03 | Card hiển thị tên sản phẩm | 76 | Native |
| FR05-R04 | Giá có ₫ và phân cách nhóm hàng nghìn | 76 | Native |
| FR05-R05 | Search theo tên sản phẩm | 77 | Native + API supporting |
| FR05-R06 | Từ khóa được hiển thị an toàn dưới dạng text, không render HTML | 77 | Native |
| FR05-R07 | Có loading trong lúc đợi dữ liệu | 78 | Native |
| FR05-R08 | Search không có kết quả có thông báo empty state phù hợp | 79 | Native |
| FR05-R09 | Mỗi trang đúng một `<h1>`; hai câu trong README là cùng một nghĩa vụ | 80-81 | HTML explicit; native applicability chưa rõ |

`Explicit` là câu chữ có trong specification. `Derived` là kỳ vọng suy luận cho usability/robustness; phải được nhận diện riêng. `Unresolved` là chưa có oracle đủ để verdict. Expected không lấy từ SQL, component hay output của lần chạy.

## 3. Ambiguity ledger và quyết định áp dụng

| ID | Điểm chưa rõ | Cách xử lý có thể tái lập |
|---|---|---|
| A01 | `<h1>` là HTML element, React Native không có DOM h1 | Giữ obligation và case Blocked ORACLE_UNRESOLVED; kiểm tra native heading chỉ là probe, không tự áp quy tắc HTML |
| A02 | Exact/substring, case folding, dấu tiếng Việt, trim, `%`/`_` có là wildcard hay literal | Các full-name fixture đơn nghĩa dùng làm core oracle; biến thể sensitivity/trim/wildcard là exploratory, không fail vì policy tự đặt |
| A03 | Không chốt dấu `.` hay `,`, tỷ lệ ảnh cụ thể, yêu cầu tên dài phải hiện đủ | Chấp nhận dấu nhóm nghìn theo locale nhưng phải có grouping và ₫; dùng ảnh chứa hình tròn/ô vuông để phát hiện stretch, không áp một tỷ lệ card mới; tên dài kiểm sự hiện diện, không tự yêu cầu wrap |
| A04 | Không quy định max query length, pagination, currency precision, timeout | Không tạo giới hạn 255/100/1000ms hay upper endpoint giả; giá nguyên VND chỉ là fixture slice |
| A05 | Empty catalog, network error và response race chưa nói cụ thể | Empty search vẫn explicit ngay cả catalog rỗng; network/race là Derived, ghi riêng mức oracle và limitations |

Search theo full name `Alpha`, `Cà phê`, `O'Brien`, `A&B`, `A+B`, `A#B` phải có ít nhất đúng fixture tương ứng. Nếu cùng tên được gán nhiều ID, tất cả cùng match: FR05 không quy định tên duy nhất. Full expected set không được suy ra từ chính API đang kiểm thử. Missing `search` nghĩa là lấy danh sách như API spec; không dùng giả định này để phán chính sách whitespace.

## 4. Input dictionary và miền khả thi

| Dimension | Type / unit / resolution | Universe và constraint | Vai trò |
|---|---|---|---|
| q | Unicode string; giữ raw text/codepoints | Không có length limit có nguồn; omitted là trạng thái riêng ở API | Input search |
| C | Tập row catalog, ID phân biệt | M=|C| thuộc N0; fixture chủ động chọn catalog | Stored state/precondition |
| S(q,C) | Tập match theo policy đã có oracle | S là subset của C | Oracle-derived expected set |
| n | Count, integer, step=1 | n=|S|, 0≤n≤M; không có n=-1 | Derived cardinality, không phải trường user nhập |
| s | pending / success / error | Các state categorical, không có numeric ordering | Network/response condition |
| product | name, integer-VND fixture price, image URL/dimensions | Không kiểm CRUD validation FR15 | Display data |
| device | OS, viewport, locale, font scale, accessibility | Một target native được ghi trong manifest | Environment |

Khi pending, chưa biết final n; không coi n=0 là empty success. `n≤M` là consistency constraint, không phải business rule validation mới. Không có authentication/counter/expiry trong FR05; các trường đó N/A, không mở rộng sang FR02 hay FR09.

## 5. Điểm quan sát implementation sau khi khóa oracle

`frontend-mobile/App.js:16` hardcode LAN API; `84-111` xây query và xử lý response; `455-533` render card/Home. `backend/server.js:141-157` nhận search. `backend/database.js` gọi init và DROP tables khi import. Đây là **testability notes**, không phải observed bug. Chỉ tạo bug confirmed sau request hoặc thao tác native có evidence.

Mobile dùng Expo ~54.0.33, React 19.1.0, React Native 0.81.5 theo package.json. Không có npm test/lint/build mobile. Backend npm test là placeholder, không chạy để giả làm validation. Trước execution phải kiểm device reachability, build, locale/timezone và reset fixture; backend gốc/database làm việc không được start/seed.

## 6. Review và exit criteria

Đã rà đủ chín rules, gộp h1 trùng mà giữ source. Tất cả giới hạn chưa có nguồn được ghi A01-A05. Đây là assistant self-review; **Pending learner review** cho kết quả kỹ thuật. Lựa chọn Native/tiếng Việt của người dùng không đồng nghĩa learner đã duyệt từng expected result.
```

Pending learner review.
