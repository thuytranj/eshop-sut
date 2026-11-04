# AI Audit Report — FR-03, FR-05, FR-07 và FR-15

## 1. FR-03

### Tương tác 1: Kích hoạt thực thi kế hoạch kiểm thử FR-03 với yêu cầu ngôn ngữ tiếng Việt
- **Thời điểm:** 2026-10-12 09:39:28 (Asia/Ho_Chi_Minh)
- **Loại tương tác:** User Prompt & Assistant Plan Execution
- **Prompt của người học (Nguyên văn):**
  > `/executing-plans docs/superpowers/plans/2026-10-12-fr03-domain-testing.md, all reports .md use vietnamese`
- **Nội dung chỉ đạo quan trọng của người học:**
  - Thực thi tuần tự kế hoạch kiểm thử theo quy trình SDD inline trong `docs/superpowers/plans/2026-10-12-fr03-domain-testing.md`.
  - Toàn bộ các file báo cáo định dạng `.md` phải được viết bằng tiếng Việt.
- **Hành động của AI:**
  - Nạp skill `executing-plans` và kiểm tra tài liệu yêu cầu.
  - Khởi tạo không gian làm việc SDD ledger tại `.superpowers/sdd/2026-10-12-fr03-domain-testing/progress.md`.
  - Bắt đầu thực thi Task 1: Thiết lập hệ thống quy tắc R01-R09, mô hình vị từ toán học, sổ đăng ký điểm mơ hồ (ambiguities), và tài liệu nhật ký AI này.

### Tương tác 2: Thực thi tuần tự kế hoạch, rà soát hợp nhất và phát hiện lỗi
- **Thời điểm:** 2026-10-12 10:22:13 đến 12:43:00 (Asia/Ho_Chi_Minh)
- **Loại tương tác:** Autonomous SDD Execution & Verification
- **Prompt của người học:** `continue to execute plan`
- **Hành động của AI:**
  - Hoàn thành Task 4: Hợp nhất kịch bản, ánh xạ kỹ thuật đa-đa vào `tests/fr03/suite.json` (52 ca duy nhất), đóng băng suite với SHA-256.
  - Hoàn thành Task 5: Triển khai harness kiểm thử API Node.js và WEB Python Playwright độc lập trong môi trường cách ly `/tmp`, bảo vệ tuyệt đối CSDL gốc `backend/database.sqlite`, thực thi toàn bộ 52 ca kiểm thử, thu thập đầy đủ logs và 16 ảnh chụp màn hình UI.
  - Hoàn thành Task 6: Đối chiếu kết quả thực tế, ghi nhận phán quyết (27 Passed, 20 Failed, 5 Blocked) và lập hồ sơ 6 lỗi phần mềm chi tiết kèm phân tích mã nguồn.

- **Trạng thái đánh giá của người học (Learner Review Status):**
  - Đã hoàn tất toàn bộ chu trình kỹ thuật FR-03 theo kế hoạch; sẵn sàng cho người học nghiệm thu toàn diện (Pending Learner Final Review).


## 2. FR-05

#### Phạm vi và tính đầy đủ

##### Snapshot 1: FR-05-planning

- Interaction ID: `0c200efd-98ca-495d-896e-1ccfa3b9f561`.
- Tool: Codex;
- Recording time: `2026-10-16T10:00:53+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Visible task prompt and saved plan only; excludes supplied skill payload, prior instructions, commentary and tool transcript. Interaction time and exact model unavailable. Planning only; no test execution or learner review.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-05: Product listing and search trên mobile đảm bảo tuân theo workflow sau:

1. **Phân tích requirement**
2. **Sinh test case Domain Testing**
3. **Sinh test case BVA**
4. **Review + deduplicate + liên kết test case với technique**
5. **Execute toàn bộ test suite**
6. **Ghi actual result / pass-fail / bug**
7. **AI gap analysis**

Đối với cả Domain Testing và BVA, phải giải thích chi tiết từng bước áp dụng kỹ thuật, không chỉ nộp bảng test case cuối cùng.
````

**Output được ghi nguyên văn**

````markdown
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
````

#### Snapshot 2: FR-05-plan-self-review

- Interaction ID: `2447f747-2d08-4a84-852a-b4ebbc4eae6a`.
- Tool: Codex
- Recording time: `2026-10-16T10:02:11+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Second saved plan revision after assistant self-review of the same user prompt: added explicit initial unfiltered LIST/virtualization check, clarified derived n versus controllable inputs, and specified fixture images and HTTP serving. This is AI self-review, not learner feedback. Other chat/tool messages excluded; interaction time and exact model unavailable.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-05: Product listing and search trên mobile đảm bảo tuân theo workflow sau:

1. **Phân tích requirement**
2. **Sinh test case Domain Testing**
3. **Sinh test case BVA**
4. **Review + deduplicate + liên kết test case với technique**
5. **Execute toàn bộ test suite**
6. **Ghi actual result / pass-fail / bug**
7. **AI gap analysis**

Đối với cả Domain Testing và BVA, phải giải thích chi tiết từng bước áp dụng kỹ thuật, không chỉ nộp bảng test case cuối cùng.
````

**Output được ghi nguyên văn**

````markdown
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
````

#### Snapshot 3: FR05-Task1

- Interaction ID: `9b565ed9-8f56-4bc0-b1c7-feab8b450995`.
- Tool: Codex; 
- Recording time: `2026-10-16T10:27:39+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: User execution instruction and Task 1 artifact only; excludes skill payload/tool transcript; model and interaction time unavailable; learner technical review pending.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
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
````

#### Snapshot 4: FR05-Task2

- Interaction ID: `f026228c-b69c-4b72-88de-716589c5f4f2`.
- Tool: Codex
- Recording time: `2026-10-16T10:30:34+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Task 2 derivation; source cases in tests/fr05/domain-source.json and domain-cases.md. Baseline preserved. Not executed; no learner review.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
# FR-05 Mobile: Domain Testing từng bước

## Bước 1: Chuyển requirement thành mô hình

Đọc [requirements](requirements.md) trước khi đọc component. Input điều khiển được là q, catalog C và network state s. Với policy search đã có oracle, S(q,C) là expected set; n=|S| và M=|C|. n là derived count, không phải input nhập vào search. Không lấy SQL LIKE làm định nghĩa đúng cho requirement.

Với success, predicate `P_complete = IDs(UI)=S`; `P_empty = n=0`; `P_nonempty = n≥1`; `P_loading = s=pending`; `P_safe = keyword được render như literal text`; `P_card = tên, giá, ảnh đúng R02-R04`. Miền behavior đúng là hợp của pending có loading, success-empty có empty state, success-nonempty hiển thị đúng S, và xử lý error theo derived oracle riêng. Complement gồm missing/extra/duplicate cards, thiếu empty/loading hoặc render keyword thành markup; không coi zero result là invalid input.

## Bước 2: Phân hoạch và reference fixture

Reference là q=Alpha, C=full, s=success, S={101}, n=1,M=12. Các điều kiện khác giữ nominal; không click cart/detail.

| Partition | Đại diện | Expected có nguồn | Giới hạn |
|---|---|---|---|
| Không search | Home mới mở | Toàn bộ catalog, grid | Không dựa vào empty-string policy |
| Known full name | Alpha | ID101 | Không đòi substring |
| Name không match | ZZZ_NO_MATCH | Empty state | Catalog vẫn có dữ liệu |
| Chỉ description match | DescriptionToken | Không có product match theo tên | Không mở rộng search sang description |
| Unicode exact | Cà phê | ID104 | Không suy ra bỏ dấu |
| Transport-sensitive exact | O'Brien, A&B, A+B, A#B | ID105-108 nguyên nghĩa | Không làm SQL-error thành expected |
| HTML-like | <b>Alpha</b> | Keyword text nguyên văn | Không dùng script/exfiltration |
| Policy chưa rõ | trim/case/dấu/wildcard/empty/substring | Observation, Blocked oracle | Không tính pass/fail tự đặt |

Đây là categorical partitions; chúng có thể giao nhau (Unicode đồng thời có ký tự đặc biệt). Case matrix cô lập từng thuộc tính; không gọi đây là các khoảng số rời nhau hay dùng chúng làm BVA.

## Bước 3: Boundary và on/off/in

Chọn boundary giữa empty và nonempty tại n=0. Vì count thuộc N0, không tồn tại off-point n=-1. On-point ở đây thuộc miền empty, không được gọi là accepted/rejected của validation.

| Point | (M,n,s) | P_empty | P_nonempty | n≤M | Ý nghĩa và expected |
|---|---|---|---|---|---|
| On A | (12,0,success) | T | F | T | q vô nghiệm; empty state |
| On B | (0,0,success) | T | F | T | Catalog rỗng, vẫn search Alpha; empty search state |
| Off phía nonempty | (1,1,success) | F | T | T | Một matching card |
| Interior nonempty | (2,2,success) | F | T | T | Hai matching cards khác ID |
| Infeasible | (1,-1,success) | F | F | T | n không thể âm; không sinh case seed giả |

Để kiểm consistency gần `n=M`, chọn on (1,1),(2,2), off khả thi (2,1) và interior (3,1). Các q dùng full-name Alpha, còn fixture kiểm soát số match. (M,M+1) không thể seed đúng: nếu UI xuất n>M thì đó là failure của output assertion, không là valid input test point. Hai điểm trên boundary giúp kiểm đủ danh sách khi catalog nhỏ; không chứng minh khả năng phát hiện mọi shifted/tilted boundary của một numeric function. FR05 không có rule đa biến dạng x+y≤k; report không bịa rule đó để minh họa kỹ thuật.

## Bước 4: State và interaction

Pending/success/error là state partitions, không có numeric boundary. Initial-load và search-load cần request bị giữ để screenshot thực sự nằm trong pending; không suy từ code `setLoading` hay chỉ quan sát state sau response. Có case pending→empty để phân biệt loading với empty state. Error/race là Supplementary Derived: kết quả có thể bị giới hạn oracle, không coi sự im lặng của spec là bằng chứng đúng tuyệt đối.

LIST phải cuộn qua FlatList để kiểm đủ ID; virtualization có thể chưa render card ngoài viewport nên một screenshot đầu không chứng minh thiếu sản phẩm. RATIO dùng hình tròn trên ảnh 120×120,240×120,120×240; nếu circle thành ellipse thì quan sát được stretch. ALT cần native accessibility evidence, screenshot hình ảnh không đủ. Giá quanh 1000/1000000 kiểm grouping, không là acceptance boundary của price.

## Bước 5: Cô lập lỗi, masking và traceability

Mỗi full-name search giữ network success và catalog chuẩn, chỉ thay q; không ghép HTML, quote và error trong một case rồi không biết rule nào fail. Mixed/three thay M trong khi n=1. PRICE/IMAGE có assertions độc lập để failure display không mask search. Case coupled có fixture và expected set cụ thể; không dùng Cartesian product không có lý do.

Source cases và obligation registry nằm ở [domain-source.json](../../../tests/fr05/domain-source.json); report case ở [domain-cases](domain-cases.md). Mỗi source case có obligation duy nhất; BVA có registry riêng, Task 4 mới dedup canonical. Designed coverage dựa số obligation có source case, execution coverage chỉ từ observations; lúc thiết kế tất cả Not Run.

## Bước 6: Giới hạn phương pháp và review

Bộ mẫu không là exhaustive proof cho Unicode, tất cả catalog hoặc network timings. R09 native chưa có oracle; các policy sensitivity không lấy implemented behavior làm expected. Không có max length/pagination/giá lớn nhất trong source. Assistant tự rà on/off/in, infeasible n<0, exact ID sets và rule mapping; learner technical review vẫn Pending.
````

#### Snapshot 5: FR05-Task3

- Interaction ID: `355c7c10-e304-4e81-86fc-0256748cca38`.
- Tool: Codex
- Recording time: `2026-10-16T10:32:24+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: BVA derivation and assistant self-review; no execution verdict or learner review.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
# FR-05 Mobile: Boundary Value Analysis từng bước

## Bước 1: Xác định nơi BVA áp dụng

FR05 yêu cầu empty state khi search không có kết quả và danh sách khi có sản phẩm. Vì vậy có thể dùng **result-count boundary** để kiểm chuyển behavior giữa zero và nonzero. Đại lượng n được điều khiển gián tiếp bằng catalog/query; đây không phải validation của một numeric search field.

Dùng **ISTQB 3-value BVA** theo [local method reference](../../../.agents/skills/boundary-value-analysis/references/bva-methods.md). Lecture chưa được cung cấp nên đây là working convention, không là xác nhận phương pháp môn học. [Requirements](requirements.md) là oracle, không phải implemented output.

## Bước 2: Universe, type và ordered partitions

n là count integer, đơn vị product, resolution=1. U=N0={0,1,2,...}. Có hai ordered equivalence partitions theo expected behavior:

| Partition | Miền | Expected | Finite endpoint |
|---|---|---|---|
| E0 | {0} | Search success rỗng: không có card, có empty state | 0 |
| E1 | [1,+∞)∩N0 | Hiển thị đúng matching products | 1 |

Không có invalid-negative partition trong U: không thể có -1 product trong expected result. Không tạo một fixture n=-1. Count quá M chỉ có thể là output discrepancy; đó không phải valid expected cardinality. +∞ không phải một endpoint có thể chọn data.

## Bước 3: Lấy neighborhoods của tất cả endpoints

| Endpoint | predecessor | endpoint | successor | Neighborhood khả thi |
|---|---|---|---|---|
| 0 | -1 không thuộc U | 0 | 1 | {0,1} |
| 1 | 0 | 1 | 2 | {0,1,2} |

Lấy union: **{0,1} ∪ {0,1,2} = {0,1,2}**. Do 0/1 xuất hiện lặp nên không cộng thành 5 nghĩa vụ. Có 3 **value obligations** cho interface native trên target được manifest chỉ định. Đây không phải công thức 4n+1 hay robust worst-case Cartesian product.

## Bước 4: Chuyển thành test data có thể thực thi

Giữ q=Alpha và s=success. Ba snapshot catalog chỉ thay số matching rows, do đó không cần giả định substring/case/trim:

| Source case | Snapshot | M=n | Expected IDs | Expected native behavior | Obligation |
|---|---|---|---|---|---|
| FR05-BVA-001 | empty | 0 | {} | Empty state có thông báo sau search | FR05-BVA-N0 |
| FR05-BVA-002 | one | 1 | {201} | Một card Alpha giá 1000₫ | FR05-BVA-N1 |
| FR05-BVA-003 | two | 2 | {201,202} | Hai card Alpha có giá 1000₫/1001₫ phân biệt, không gộp do trùng tên | FR05-BVA-N2 |

Giá là dữ liệu nhận diện card; số lượng card là mục tiêu boundary. Không đổi M và tưởng n là independent input trong cùng fixture. Snapshot two cố ý có tên trùng nhưng ID khác; FR05 không cấm tên trùng. Native không lộ ID thì dùng signature (name,price,image) kết hợp fixture; không dùng riêng tên để đếm ID.

Các steps/preconditions đầy đủ của ba case được giữ ở [bva-source.json](../../../tests/fr05/bva-source.json), cùng schema với DT: reset snapshot, mở Home, nhập Alpha, bấm Tìm, chờ success rồi đối chiếu. Actual=null, status=Not Run, evidence=[] tại thời điểm thiết kế. Final verdict xem [test-results](test-results.md); không ghi đè baseline.

## Bước 5: Deduplicate nhưng giữ endpoint-to-case mapping

Case n=0/1/2 cùng scenario với DT RESULT-ZERO/ONE/TWO, sẽ merge ở Task 4 nếu toàn bộ preconditions/input/steps/expected giống nhau. Canonical case phải mang cả DT+BVA và cả hai obligation IDs. API COUNT-empty/one/two là supporting HTTP cases khác interface nên không merge với native.

Endpoint 0 liên kết N0,N1; endpoint 1 liên kết N0,N1,N2. Merge case không được làm mất mapping này. No-match trên catalog full có M=12,n=0 khác snapshot empty M=0,n=0; cùng count không đủ để gọi là duplicate.

## Bước 6: Những điều không được tính vào BVA coverage

- Không có min/max length có nguồn cho q. Chuỗi rỗng, một ký tự hay whitespace là exploratory policy probes, không biến thành BVA length 0/1/2.
- Không có pagination/page-size contract nên không dùng 9/10/11 hay 19/20/21 làm feature boundary.
- Giá quanh 1000 và 1000000 giúp kiểm thousands grouping; report không gọi đó là accepted/rejected price boundary, không tự đặt precision hoặc maximum price.
- Loading, safe keyword, Unicode và h1/accessibility là state/categorical/display obligations; không đặt cạnh nhau thành numeric ordered partition.

## Bước 7: Coverage và kiểm tra tính đúng

Designed coverage = số value obligations có valid source case / 3. Hiện là 3/3 của **result-count slice đã xác định**, chưa có executed coverage ở bước thiết kế (0/3). Sau execution tính lại từ native observations: Passed và Failed đều có thể chứng minh một boundary đã được exercised; Blocked không được tính. Không dùng API results để nâng native coverage.

Giới hạn: chưa chứng minh correctness mọi catalog size, search policy hay network schedule, và chưa có lecture xác nhận. Assistant đã tính lại union, kiểm n≥0, fixture IDs/card signatures và giữ source-case mapping. Pending learner review.
````

#### Snapshot 6: FR05-Task4

- Interaction ID: `f5e3798c-430c-4c58-bbb3-4491c002a411`.
- Tool: Codex
- Recording time: `2026-10-16T10:34:36+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Assistant review/freeze; baseline source cases retained; validator RED then GREEN observed; no learner review or SUT result.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
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
````

#### Snapshot 7: FR05-Task5

- Interaction ID: `40c30b2c-e45f-4601-b541-741daa8b3087`.
- Tool: Codex
- Recording time: `2026-10-16T12:36:57+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Observed native/API execution decisions; raw evidence and dispositions under evidence/fr05-run01. User opened Expo Go and unlocked Mac; not learner case review. Full suite blocked by oracle/accessibility.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
# FR-05: Execution decisions và environment

## Quyết định về scope

- Người dùng chọn Native execution, report tiếng Việt, thuật ngữ chuyên ngành tiếng Anh; đồng ý dùng branch hiện tại `hw02-domain-testing`. Không tạo worktree mới, không stage các thay đổi FR03/.gitignore có sẵn.
- Android ADB đã kiểm ngoài sandbox: không có device. Chọn iPhone 18 Pro iOS 27.0 đang boot, UDID trong manifest. Chỉ report iOS native; không suy ra Android.
- CUA thấy Device Hub `com.apple.dt.Devices`, window iPhone 18 Pro, có screenshot home screen. AX của macOS chỉ thấy toolbar, không phải mobile accessibility hierarchy.

## Bảo toàn SUT và fixture

`prepare-environment.cjs` không import database.js, không tạo database gốc. Script copy backend/mobile vào `/private/tmp/eshop-fr05-fr05-run01/`; backend source không thay đổi. DB copy mới được init bằng startup gốc; proxy reset catalog ở DB copy. Hai safety checks chạy RED→GREEN để kiểm file copy và working-data hashes.

Chỉ API_URL trong App.js **copy** đổi từ `http://192.168.10.13:3000/api` sang `http://127.0.0.1:3002/api`. iOS Simulator truy cập loopback host; backend thật giữ port3000, image server3001, proxy3002. Ảnh local có hình tròn và known dimensions để quan sát ratio; không phụ thuộc image hosting ngoài. Adjustment JSON và hashes trong manifest, source App.js working tree giữ nguyên.

Proxy không thay response body; normal là passthrough. Delay/error/race là network simulation có log riêng. Full-name query của native đi qua code app nguyên gốc; API runner encode query đúng để cô lập transport của app với backend behavior.

## Các chặn đã quan sát và cách xử lý

- Sandbox chặn ADB/local listeners/HTTP loopback/CoreSimulator; đã dùng escalation theo tool permission, không gọi blocked sandbox là SUT failure.
- `npm run ios` nhận lỗi không xác định Simulator application vì ứng dụng hiện là Device Hub. Metro khởi động riêng `npm start -- --localhost --port 8081` hoạt động.
- Expo Go chưa được cài trong Simulator; downloader Node chính thức treo khi truy cập network. `curl` lấy được official Expo API, xác định đúng artifact SDK54 từ `expo/expo-go-releases` để tải trực tiếp; không lấy package không rõ nguồn.
- Expo installed54.0.34 thỏa package range ~54.0.33, CLI khuyến cáo ~54.0.37. Không tự update lockfile/dependency để làm test chạy; warning được giữ trong environment record.

## Oracle rulings

HTML h1, trim/case/diacritics/wildcard/empty/substring chưa đủ policy native: giữ Blocked ORACLE_UNRESOLVED, có thể ghi probe. Error/race là Derived robustness expectations. ALT cần VoiceOver/mobile hierarchy; không fail chỉ vì code không thấy accessibilityLabel. Việc user chọn plan không xác nhận các technical expected chưa rõ.

## Task 5 status

API supporting execution đã có 12 records (11 Passed, 1 Failed); chưa coi là native verdict. Native launch đang được chuẩn bị; kết quả cuối và remaining blockers sẽ nằm trong test-results.md. Full execution chỉ đạt khi không còn Blocked/Not Run.

## Cập nhật native execution

Người dùng đã bấm Open trong Safari confirmation do CUA không expose button. App Expo Go SDK54 mở được, native request đi tới proxy; bundle được kiểm chỉ có loopback3002, không còn IP LAN gốc. Người dùng cũng unlock Mac một lần khi CUA báo lock. Đó là hỗ trợ môi trường, không phải learner review test cases.

CUA `setValue` có lúc báo AXError.cannotComplete nhưng field thật đã đổi; luôn đọc lại AX Value trước khi bấm Tìm. Không dùng lỗi này làm bug SUT. `getAXState` chứa mobile subtree từ Device Hub; AX xuất được tên/giá và UI controls nhưng accessibility image semantics còn hạn chế. Coordinate click/scroll báo noWindowsAvailable; không tự suy ra scroll completeness từ một viewport.

Nhóm full-catalog search là readonly: giữ snapshot full bất biến, thay q hoàn toàn và giữ Home/keyboard, không reseed/relaunch mỗi query. Các case count/coupled dùng reset snapshot riêng. Native initial loading dùng Metro devserver reload broadcast, protocol version2 theo mã CLI, không sửa App.js/business logic. Proxy delay30s chỉ phục vụ observation; không biến 30s thành requirement timeout.

Screenshot capture đôi lúc lỗi ScreenCaptureKit -3811. AX được lưu trước; chỉ PNG tồn tại mới đưa vào evidence. Case text có thể được chứng minh bằng native AX; case visual cần screenshot.

## Kết thúc vòng thực thi đầu tiên

Đã có disposition đủ 45 canonical IDs: 33 native (12 Passed,12 Failed,9 Blocked) và 12 API (11 Passed,1 Failed) trong raw observations. Đây chưa phải final adjudication: Task6 còn review oracle, nhất là native grid. Task5 chưa đạt tiêu chí full execution vì vẫn có Blocked về oracle/accessibility. Các task report/gap tiếp tục trên evidence thực đã có, không đánh dấu blocker là Passed.

Case RATIO reset snapshot images rồi search rỗng để render catalog; không cold-start riêng. Giá/rate hiển thị là logic card giống Home, nhưng lifecycle path này được ghi rõ. Chỉ cần Square sai tỷ lệ đã đủ Failed; Wide/Tall không bị kết luận sai khi chưa cuộn quan sát hết.
````

#### Snapshot 8: FR05-Task6

- Interaction ID: `10413a42-ccec-4094-95ad-ce074eed009b`.
- Tool: Codex
- Recording time: `2026-10-16T12:43:22+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Results derived from raw native/API evidence and explicit adjudication; TC001 false-positive inference corrected without rewriting raw run; bugs.md has 4 explicit defects plus 1 derived discrepancy. Learner review pending.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
# FR-05 Mobile: Kết quả thực thi và coverage

## 1. Kết luận trong phạm vi đã chạy

Đã thiết kế 45 canonical cases: 33 native và 12 API supporting. Sau review verdict, **35 cases có execution verdict**, 23 Passed,12 Failed;10 Blocked,0 Not Run. Riêng native có 23/33 executed (12 Passed,11 Failed,10 Blocked). Full native suite chưa hoàn tất vì còn oracle/accessibility/scroll blockers. Không gọi 45 dispositions là 45 executed cases.

Quan sát được 4 nhóm lỗi có explicit requirement và 1 discrepancy có derived timing oracle. Số bug không bằng số failed cases: nhiều case cùng chứng minh thiếu empty state hoặc mất query encoding. Xem [bugs](bugs.md). Không sửa application code hoặc publish GitHub Issues.

## 2. Environment và provenance

Target: iPhone 18 Pro / iOS27.0 / Expo Go54.0.7; app Expo SDK54 (installed54.0.34), React19.1.0, React Native0.81.5. Backend copy Express/SQLite giữ source nguyên vẹn, API_URL chỉ đổi trong mobile copy sang loopback proxy3002. [Manifest](evidence/fr05-run01/manifest.json), [adjustment](evidence/fr05-run01/environment-adjustment.diff), [execution decisions](execution-decisions.md), [request/response log](evidence/fr05-run01/requests.jsonl).

Ngày chạy: 16/10/2026, giờ user-facing Asia/Ho_Chi_Minh (+07:00). Raw log dùng UTC có Z; không thay timestamp historical bằng thời điểm viết report. Fixture reset/catalog IDs và timing có trong raw log. Counter/expiry/authentication N/A; native/Home/search state được ghi theo runbook. Locale identifier/font scale chưa đo; giá thực tế dùng dấu chấm grouping và ₫. Scale của cửa sổ Device Hub thay đổi nên không lấy outer screenshot làm physical viewport.

Native UI được thao tác bằng CUA; API runner dùng URLSearchParams riêng. Người dùng hỗ trợ Open Expo Go và unlock Mac, không cung cấp technical learner review. AX tree có nội dung native thực, còn image accessibility semantics chưa được chứng nhận. Một số case có AX-only evidence vì screenshot service lỗi; visual bug reports có PNG thật.

## 3. Review verdict, bảo toàn raw evidence

Raw [observations](evidence/fr05-run01/observations.json) có 12 native Failed; review đổi TC001 từ Failed sang Blocked vì column count/native grid mapping chưa được đặc tả và scroll tool chưa làm được. Không coi một cột tự động là bug; raw screenshot/AX vẫn giữ nguyên. [Verdict revision](evidence/fr05-run01/verdict-revisions.json) lưu before/after/reason. Primary verdict cuối dùng [adjudicated observations](evidence/fr05-run01/adjudicated-observations.json). Không sửa expected cho khớp code; đây là sửa một inference chưa có nguồn.

## 4. Test statistics (unique cases)

| Interface | Designed D | Executed E | Passed | Failed | Blocked | Not Run | Not yet executed |
|---|---:|---:|---:|---:|---:|---:|---:|
| Native iOS | 33 | 23 | 12 | 11 | 10 | 0 | 10 |
| API supporting | 12 | 12 | 11 | 1 | 0 | 0 | 0 |
| Tổng unique | 45 | 35 | 23 | 12 | 10 | 0 | 10 |

`D=P+F+B+NR`; `E=P+F`; not-yet-executed=`B+NR`. Không cộng source case count48, reruns, screenshot count hoặc API observations vào native count. Case019 Failed theo derived latest-query consistency được ghi riêng; 10 native failures còn lại có explicit oracle.

## 5. Actual result từng canonical case

Preconditions/input/steps/expected đầy đủ: [suite.json](../../../tests/fr05/suite.json), [DT source cases](domain-cases.md), [BVA dẫn xuất](bva-report.md). Bảng dưới nối cùng ID với actual/status/evidence. `Not Run` ở source reports là baseline đóng băng trước chạy, không là final verdict.

| Case / key | Interface / technique | Fixture / raw q | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|
| FR05-TC-001 LIST | NATIVE / DT | full / null | Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng; layout là grid, không phải một cột danh sách. | Quan sát danh sách một cột, AX có 12 tên/giá. Requirement nói grid nhưng không quy định column count/responsive mapping native; CUA scroll chưa thực hiện được. Chưa đủ cơ sở kết luận một cột là vi phạm grid hoặc chứng minh completeness cuối bằng scroll. | **Blocked** | [FR05-TC-001.ax.txt](evidence/fr05-run01/native/FR05-TC-001.ax.txt)<br>[FR05-TC-001.png](evidence/fr05-run01/native/FR05-TC-001.png) |
| FR05-TC-002 EXACT | NATIVE / DT | full / &quot;Alpha&quot; | Có đúng card Alpha ID101; không có sản phẩm không match. | Search Alpha trả một card Alpha giá 999 ₫; Hiển thị 1 sản phẩm. | **Passed** | [FR05-TC-002.ax.txt](evidence/fr05-run01/native/FR05-TC-002.ax.txt)<br>[FR05-TC-002.png](evidence/fr05-run01/native/FR05-TC-002.png) |
| FR05-TC-003 NO-MATCH | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Không có card; có thông báo empty state khi response thành công rỗng. | Response success rỗng, vùng kết quả trống hoàn toàn; không có thông báo empty state trong screenshot/AX. | **Failed** | [FR05-TC-003.ax.txt](evidence/fr05-run01/native/FR05-TC-003.ax.txt)<br>[FR05-TC-003.png](evidence/fr05-run01/native/FR05-TC-003.png) |
| FR05-TC-004 NAME-ONLY | NATIVE / DT | full / &quot;DescriptionToken&quot; | Token chỉ trong description không làm sản phẩm match; native có empty state. | DescriptionToken không trả card (name-only đúng), nhưng không có thông báo empty state. | **Failed** | [FR05-TC-004.ax.txt](evidence/fr05-run01/native/FR05-TC-004.ax.txt)<br>[FR05-TC-004.png](evidence/fr05-run01/native/FR05-TC-004.png) |
| FR05-TC-005 UNICODE | NATIVE / DT | full / &quot;Cà phê&quot; | Full-name search &#x27;Cà phê&#x27; trả đúng sản phẩm ID104; không lỗi/truncate/đổi ký tự. | Cà phê nguyên dấu trả một card Cà phê giá 999.999 ₫, không có tên sản phẩm khác trong AX. | **Passed** | [FR05-TC-005.ax.txt](evidence/fr05-run01/native/FR05-TC-005.ax.txt)<br>[FR05-TC-005.png](evidence/fr05-run01/native/FR05-TC-005.png) |
| FR05-TC-006 QUOTE | NATIVE / DT | full / &quot;O&#x27;Brien&quot; | Full-name search &quot;O&#x27;Brien&quot; trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự. | App hiển thị nguyên chuỗi &lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near &quot;Brien&quot;: syntax error&lt;/p&gt; thay vì card O&#x27;Brien. | **Failed** | [FR05-TC-006.ax.txt](evidence/fr05-run01/native/FR05-TC-006.ax.txt)<br>[FR05-TC-006.png](evidence/fr05-run01/native/FR05-TC-006.png) |
| FR05-TC-007 AMP | NATIVE / DT | full / &quot;A&amp;B&quot; | Full-name search &#x27;A&amp;B&#x27; trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự. | Keyword A&amp;B nhưng có Alpha/Beta/A+B/A#B và tên khác; không chỉ A&amp;B. API encode đúng case040 đã pass. | **Failed** | [FR05-TC-007.ax.txt](evidence/fr05-run01/native/FR05-TC-007.ax.txt)<br>[FR05-TC-007.png](evidence/fr05-run01/native/FR05-TC-007.png) |
| FR05-TC-008 PLUS | NATIVE / DT | full / &quot;A+B&quot; | Full-name search &#x27;A+B&#x27; trả đúng sản phẩm ID107; không lỗi/truncate/đổi ký tự. | Search A+B hiển thị keyword nguyên dạng nhưng không có card A+B; API encoded case041 trả đúng ID107. | **Failed** | [FR05-TC-008.ax.txt](evidence/fr05-run01/native/FR05-TC-008.ax.txt)<br>[FR05-TC-008.png](evidence/fr05-run01/native/FR05-TC-008.png) |
| FR05-TC-009 HASH | NATIVE / DT | full / &quot;A#B&quot; | Full-name search &#x27;A#B&#x27; trả đúng sản phẩm ID108; không lỗi/truncate/đổi ký tự. | Search A#B trả nhiều tên match A thay vì chỉ A#B; API encoded case042 trả đúng ID108. | **Failed** | [FR05-TC-009.ax.txt](evidence/fr05-run01/native/FR05-TC-009.ax.txt)<br>[FR05-TC-009.png](evidence/fr05-run01/native/FR05-TC-009.png) |
| FR05-TC-010 SAFE | NATIVE / DT | full / &quot;&lt;b&gt;Alpha&lt;/b&gt;&quot; | Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML; không đánh giá wildcard/matching trong case này. | Nhãn kết quả hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;; screenshot còn cả dấu &lt;b&gt;, không render bold/HTML. | **Passed** | [FR05-TC-010.ax.txt](evidence/fr05-run01/native/FR05-TC-010.ax.txt)<br>[FR05-TC-010.png](evidence/fr05-run01/native/FR05-TC-010.png) |
| FR05-TC-011 MONEY | NATIVE / DT | full / null | Giá 999/1000/1001/999999/1000000/1000001 đều có ₫; các giá ≥1000 có nhóm hàng nghìn đúng, dấu nhóm theo locale. | Native AX của full catalog hiển thị 999 ₫, 1.000 ₫, 1.001 ₫, 999.999 ₫, 1.000.000 ₫ và 1.000.001 ₫ đúng nhóm nghìn. | **Passed** | [FR05-TC-011.ax.txt](evidence/fr05-run01/native/FR05-TC-011.ax.txt)<br>[FR05-TC-011.png](evidence/fr05-run01/native/FR05-TC-011.png) |
| FR05-TC-012 RATIO | NATIVE / DT | images / null | Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse. | Snapshot images có Square/Wide/Tall. Screenshot Square từ PNG120×120 có hình tròn nhưng native kéo thành ellipse ngang. Wide thấy một phần; Tall chưa kiểm hình do scroll tool bị chặn. Một ảnh đã vi phạm đủ để case Failed. | **Failed** | [FR05-TC-012.ax.txt](evidence/fr05-run01/native/FR05-TC-012.ax.txt)<br>[FR05-TC-012.png](evidence/fr05-run01/native/FR05-TC-012.png) |
| FR05-TC-013 ALT | NATIVE / DT | full / &quot;Alpha&quot; | Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled. | Ảnh hiển thị ở card Alpha nhưng AX export không có node ảnh/description. Chưa có VoiceOver output hoặc xác minh export có đầy đủ image semantics; giữ suspected accessibility gap. | **Blocked** | [FR05-TC-013.ax.txt](evidence/fr05-run01/native/FR05-TC-013.ax.txt) |
| FR05-TC-014 LONG-NAME | NATIVE / DT | full / &quot;Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile&quot; | Có tên sản phẩm hiển thị trên card; không áp chính sách wrap/full text chưa được quy định. | Card có tên Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile và giá 1.000.001 ₫ trong native AX; không áp quy định wrap chưa có nguồn. | **Passed** | [FR05-TC-014.ax.txt](evidence/fr05-run01/native/FR05-TC-014.ax.txt) |
| FR05-TC-015 LOAD-INITIAL | NATIVE / DT | full / null | Trong thời gian initial request còn pending có loading rõ; sau success có danh sách. | Initial reload có Đang tải... khi proxy giữ response 30 giây; sau response có 12 sản phẩm và loading biến mất. | **Passed** | [FR05-TC-015-pending-v2.png](evidence/fr05-run01/native/FR05-TC-015-pending-v2.png)<br>[FR05-TC-015-pending-clear.ax.txt](evidence/fr05-run01/native/FR05-TC-015-pending-clear.ax.txt)<br>[FR05-TC-015-success.ax.txt](evidence/fr05-run01/native/FR05-TC-015-success.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-016 LOAD-SEARCH | NATIVE / DT | full / &quot;Alpha&quot; | Trong search pending có loading; sau success có đúng Alpha. | Search Alpha có Đang tải... trong pending; sau delay có đúng một Alpha và loading biến mất. | **Passed** | [FR05-TC-016-pending.ax.txt](evidence/fr05-run01/native/FR05-TC-016-pending.ax.txt)<br>[FR05-TC-016-success.ax.txt](evidence/fr05-run01/native/FR05-TC-016-success.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-017 LOAD-EMPTY | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Pending có loading; sau success rỗng loading kết thúc và có empty state. | Pending có Đang tải...; sau response [] loading biến mất nhưng vẫn chỉ vùng trống, không có empty state. | **Failed** | [FR05-TC-017-pending.ax.txt](evidence/fr05-run01/native/FR05-TC-017-pending.ax.txt)<br>[FR05-TC-017-after-delay.ax.txt](evidence/fr05-run01/native/FR05-TC-017-after-delay.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-018 ERROR | NATIVE / Supplementary | full / &quot;Alpha&quot; | Network error được phân biệt với search không có kết quả; không còn loading vô hạn. | Khi proxy đóng socket, native hiển thị Network request failed; không hiển thị như search empty và không còn loading. | **Passed** | [FR05-TC-018.ax.txt](evidence/fr05-run01/native/FR05-TC-018.ax.txt) |
| FR05-TC-019 RACE | NATIVE / Supplementary | full / &quot;Alpha&quot; | Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta. | Beta trả trước và từng hiển thị Beta; sau khi Alpha cũ trả về, ô/nhãn vẫn Beta nhưng card đổi thành Alpha giá 999 ₫. Đây là derived latest-query-wins oracle. | **Failed** | [FR05-TC-019-beta-first.ax.txt](evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt)<br>[FR05-TC-019-final.ax.txt](evidence/fr05-run01/native/FR05-TC-019-final.ax.txt)<br>[FR05-TC-019-final.png](evidence/fr05-run01/native/FR05-TC-019-final.png)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-020 H1 | NATIVE / Supplementary | full / null | Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict; vẫn ghi native heading probe. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-021 TRIM | NATIVE / Supplementary | full / &quot; Alpha &quot; | Ghi observation; chưa verdict do policy trim chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-022 WILDCARD | NATIVE / Supplementary | full / &quot;%&quot; | Ghi observation; chưa verdict do policy literal wildcard chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-023 CASE | NATIVE / Supplementary | full / &quot;ALPHA&quot; | Ghi observation; chưa verdict do policy case sensitivity chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-024 ACCENT | NATIVE / Supplementary | full / &quot;Ca phe&quot; | Ghi observation; chưa verdict do policy diacritic sensitivity chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-025 EMPTY-QUERY | NATIVE / Supplementary | full / &quot;&quot; | Ghi observation; chưa verdict do policy empty vs omitted chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-026 ONE-CHAR | NATIVE / Supplementary | full / &quot;A&quot; | Ghi observation; chưa verdict do policy substring chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-027 SPACE | NATIVE / Supplementary | full / &quot;   &quot; | Ghi observation; chưa verdict do policy whitespace chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-028 RESULT-ZERO | NATIVE / BVA+DT | empty / &quot;Alpha&quot; | Search Alpha trên catalog rỗng: không có card và có empty state. | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state. | **Failed** | [FR05-TC-028.ax.txt](evidence/fr05-run01/native/FR05-TC-028.ax.txt)<br>[FR05-TC-028.png](evidence/fr05-run01/native/FR05-TC-028.png) |
| FR05-TC-029 RESULT-ONE | NATIVE / BVA+DT | one / &quot;Alpha&quot; | Một card Alpha giá 1000₫, không thiếu/trùng. | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one. | **Passed** | [FR05-TC-029.ax.txt](evidence/fr05-run01/native/FR05-TC-029.ax.txt) |
| FR05-TC-030 RESULT-TWO | NATIVE / BVA+DT | two / &quot;Alpha&quot; | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature. | **Passed** | [FR05-TC-030.ax.txt](evidence/fr05-run01/native/FR05-TC-030.ax.txt) |
| FR05-TC-031 COUPLED-M2 | NATIVE / DT | mixed / &quot;Alpha&quot; | M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả. | Snapshot mixed có Alpha/Beta nhưng query Alpha chỉ hiển thị Alpha giá 1.000 ₫; count1. | **Passed** | [FR05-TC-031.ax.txt](evidence/fr05-run01/native/FR05-TC-031.ax.txt) |
| FR05-TC-032 COUPLED-M3 | NATIVE / DT | three / &quot;Alpha&quot; | M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả. | Snapshot three có Alpha/Beta/Gamma, query Alpha vẫn chỉ có Alpha giá 1.000 ₫ và count1; đối chiếu reset/request trong log. | **Passed** | [FR05-TC-032.ax.txt](evidence/fr05-run01/native/FR05-TC-032.ax.txt) |
| FR05-TC-033 EMPTY-RECOVERY | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Search vô nghiệm có empty state; sau đó search Alpha có đúng Alpha, không lưu kết quả cũ. | Search vô nghiệm có 0 card nhưng thiếu empty state; sau đó search Alpha phục hồi đúng một Alpha giá 999 ₫. | **Failed** | [FR05-TC-033-empty.ax.txt](evidence/fr05-run01/native/FR05-TC-033-empty.ax.txt)<br>[FR05-TC-033-recovered.ax.txt](evidence/fr05-run01/native/FR05-TC-033-recovered.ax.txt) |
| FR05-TC-034 LIST | API / DT | full / null | HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]. | HTTP 200; IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112] | **Passed** | [FR05-TC-034.json](evidence/fr05-run01/api/FR05-TC-034.json) |
| FR05-TC-035 EXACT | API / DT | full / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [101]. | HTTP 200; IDs=[101] | **Passed** | [FR05-TC-035.json](evidence/fr05-run01/api/FR05-TC-035.json) |
| FR05-TC-036 NO-MATCH | API / DT | full / &quot;ZZZ_NO_MATCH&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-036.json](evidence/fr05-run01/api/FR05-TC-036.json) |
| FR05-TC-037 NAME-ONLY | API / DT | full / &quot;DescriptionToken&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-037.json](evidence/fr05-run01/api/FR05-TC-037.json) |
| FR05-TC-038 UNICODE | API / DT | full / &quot;Cà phê&quot; | HTTP 200, JSON array, exact ID set [104]. | HTTP 200; IDs=[104] | **Passed** | [FR05-TC-038.json](evidence/fr05-run01/api/FR05-TC-038.json) |
| FR05-TC-039 QUOTE | API / DT | full / &quot;O&#x27;Brien&quot; | HTTP 200, JSON array, exact ID set [105]. | HTTP 500; IDs=None; SQLITE_ERROR near Brien (raw body được lưu) | **Failed** | [FR05-TC-039.json](evidence/fr05-run01/api/FR05-TC-039.json) |
| FR05-TC-040 AMP | API / DT | full / &quot;A&amp;B&quot; | HTTP 200, JSON array, exact ID set [106]. | HTTP 200; IDs=[106] | **Passed** | [FR05-TC-040.json](evidence/fr05-run01/api/FR05-TC-040.json) |
| FR05-TC-041 PLUS | API / DT | full / &quot;A+B&quot; | HTTP 200, JSON array, exact ID set [107]. | HTTP 200; IDs=[107] | **Passed** | [FR05-TC-041.json](evidence/fr05-run01/api/FR05-TC-041.json) |
| FR05-TC-042 HASH | API / DT | full / &quot;A#B&quot; | HTTP 200, JSON array, exact ID set [108]. | HTTP 200; IDs=[108] | **Passed** | [FR05-TC-042.json](evidence/fr05-run01/api/FR05-TC-042.json) |
| FR05-TC-043 COUNT-EMPTY | API / DT | empty / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-043.json](evidence/fr05-run01/api/FR05-TC-043.json) |
| FR05-TC-044 COUNT-ONE | API / DT | one / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [201]. | HTTP 200; IDs=[201] | **Passed** | [FR05-TC-044.json](evidence/fr05-run01/api/FR05-TC-044.json) |
| FR05-TC-045 COUNT-TWO | API / DT | two / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [201, 202]. | HTTP 200; IDs=[201, 202] | **Passed** | [FR05-TC-045.json](evidence/fr05-run01/api/FR05-TC-045.json) |

## 6. Coverage từ obligations, không suy từ số case

Registry freeze có 48 obligations: DT native23, DT API12, BVA native3, Supplementary native10. Mọi obligation còn nguyên khi dedup. Không giảm denominator sau khi phát hiện ambiguity.

| Technique / interface | Mapped designed | Oracle-qualified designed | Exercised | Cách hiểu |
|---|---:|---:|---:|---|
| DT native | 23/23 | 22/23 | 21/23 | LIST chưa đủ oracle; ALT có expectation nhưng evidence capability bị chặn |
| DT API supporting | 12/12 | 12/12 | 12/12 | Một failure quote vẫn là exercised obligation |
| BVA native result-count slice | 3/3 | 3/3 | 3/3 | n0 Failed,n1 Passed,n2 Passed; không phải 100% feature |
| Supplementary native | 10/10 | 2/10 | 2/10 | ERROR/RACE có derived oracle; 8 policy/h1 probes Blocked trước verdict |

Exercised = có valid native/API observation và verdict P/F, không phụ thuộc SUT có pass hay không. BVA mapping: endpoint0→N0,N1; endpoint1→N0,N1,N2; union{0,1,2}. Three source BVA cases merge vào TC028/029/030; không được tính API043-045 để nâng BVA native coverage.

Giới hạn: 21/23 DT native không chứng minh correctness mọi string/catalog/network schedule; một case FAIL có nhiều assertions thì rule nào fail phải đọc assertion details. Ví dụ TC017/033 fail empty state dù loading/recovery đã pass.

## 7. Requirement observations

| Rule | Quan sát và giới hạn |
|---|---|
| R01 listing/grid | AX có toàn bộ12 names/count; one-column screenshot; native column policy/scroll completeness chưa kết luận |
| R02 image/accessibility | Square image méo ellipse (TC012 Failed); ALT TC013 Blocked, không nhận vơ VoiceOver verification |
| R03 name | Exact, long name và BVA cards có tên |
| R04 price | Cả6 giá group-boundary fixtures đúng grouping/₫ trong native AX (TC011) |
| R05 search by name | Exact/Unicode/coupled pass; quote/URL reserved chars fail; race có observed mismatch với derived schedule oracle |
| R06 safe keyword | <b>Alpha</b> hiển thị literal trong native screenshot/AX; không phải exhaustive XSS testing |
| R07 loading | Initial và search pending có loading; kết thúc sau response; 30s là fixture delay, không requirement timeout |
| R08 empty | Các [] success không có empty message; recovery sau đó có kết quả đúng |
| R09 h1 | HTML-specific requirement chưa có native mapping; Blocked |

## 8. Remaining blockers và cách resume

TC001: cần xác nhận native grid/column policy và công cụ scroll hoạt động. TC013: cần VoiceOver hoặc certified complete native image hierarchy. TC020: native equivalent của exactly-one h1. TC021-027: cần search policy từ test oracle, không lấy SQL LIKE hoặc user preference đơn thuần thay specification. Sau khi có authority/lecture, version source/suite nếu expected đổi, chạy run mới và giữ raw run01. Android chưa được chạy.

Task5 có đủ disposition nhưng chưa đủ full execution; Task6 báo cáo evidence thực, Task7 phân tích gaps. Việc kết thúc documentation không đóng các blocker này.
````

#### Snapshot 9: FR05-Task7

- Interaction ID: `146a2032-ce70-48bf-8221-89019ac79c57`.
- Tool: Codex; 
- Recording time: `2026-10-16T12:46:24+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Task 7 assistant gap analysis artifact snapshot under the same execution instruction; not a new user prompt or learner critique. Observed corrections and limitations distinguished from missed SUT bugs.
- Learner review: Pending learner review.

**Prompt được ghi**

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

**Output được ghi nguyên văn**

````markdown
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
````

#### Snapshot 10: FR05-final-review

- Interaction ID: `c69d434d-0fad-4ba2-8310-30ab8ee66c7f`.
- Tool: Codex collaboration; model: gpt-6-astra.
- Recording time: `2026-10-16T15:32:40+07:00`.
- Capture extent: partial; reviewer instructions là summary, không phải verbatim prompt. Output dưới đây là closeout summary, không phải raw reviewer transcript.
- Learner review: Pending learner review.

**Prompt được ghi (summary)**

```text
Summary of reviewer task: read-only whole-branch review of FR05 range 96d6cb6..6b73251 against plan, requirements, Review Focus and ledger; grade findings and disclose declined-to-judge items; preserve files/index/HEAD.
```

**Output được ghi (summary)**

```text
# FR-05: Final review và execution closeout

Fresh reviewer: `/root/fr05_final_review`, model `gpt-6-astra`, read-only. Reviewer độc lập với executor; đây vẫn là AI review, không thay learner technical review. Review range: `96d6cb6..6b73251`. Review hoàn tất ngày 16/10/2026 (+07:00); exact interaction timestamp không được suy từ giờ ghi artifact.

## Kết quả và mức độ hoàn tất

Không có Critical/Important finding. Executor đánh giá lại theo tác động: ba findings dưới đây giữ Minor vì ảnh hưởng khả năng tái lập/độ rõ của report, không thay actual results, bug evidence hoặc thống kê. Theo executing-plans, Minor được defer, không vào fix pass.

45 unique cases: **35 executed = 23 Passed + 12 Failed**, **10 Blocked**, 0 Not Run. Native iOS: 12P/11F/10B; API supporting: 11P/1F. Task5 vẫn partial. BVA native n=0/1/2 exercised 3/3 chỉ là result-count slice; không đại diện 100% feature. Có 4 explicit confirmed defects và 1 derived timing discrepancy. Không sửa SUT.

Reviewer chạy validator: 0 errors, 45 canonical / 48 sources / 48 obligations; 12 validator tests và 2 Node tests pass. Reviewer kiểm source/fixture/suite/working DB hashes và evidence; không chạy live/environment mutation. Các harness/live checks executor đã chạy được ghi trong README. Những giới hạn không được reviewer kết luận đều có ruling dưới đây.

## Deferred minors — đầy đủ

1. Runbook chưa đủ command sequence để tái lập độc lập: cần prepare-environment, image server document root, proxy entrypoint/run ID và Metro working directory. Harness hiện có nhưng người đọc còn phải suy từ source.
2. Review Focus TEXT/TRANSPORT/SAFE chưa thể hiện rõ keyword % và literal underscore chưa exercised. TC022 Blocked vì matching policy; ZZZ_NO_MATCH không phân biệt literal/wildcard. Không nâng coverage hoặc sửa frozen v1.
3. Manifest ghi reset before each case, trong khi execution-decisions và request log công khai readonly group dùng chung immutable snapshot full. Cần addendum khi cập nhật hướng dẫn; giữ historical manifest nguyên vẹn.

## Rulings I made — đầy đủ, theo thứ tự ledger

Các quyết định dưới đây giữ nguyên nội dung ledger, gồm lý do và chi phí nếu sai. Workspace ignored được giữ để resume Task5; report này là bản tracked để người dùng kiểm tra quyết định mà không phụ thuộc scratch directory.

- Ruling: Làm trên branch hw02-domain-testing theo lựa chọn trực tiếp của người dùng — không tạo worktree — chi phí nếu sai: thay đổi FR05 nằm chung working tree, cô lập bằng paths/index và fixture tạm.
- Ruling: Không chạy backend npm test placeholder hay test toàn app — AGENTS quy định scope FR05 và script placeholder — chi phí nếu sai: không có regression signal ngoài FR05; không đổi app code.
- Ruling: Plan sinh h1 unresolved case có thể khiến full-suite không đạt; giữ Blocked ORACLE_UNRESOLVED và tiếp tục phần có oracle — không lấy implementation làm oracle — chi phí nếu sai: coverage native R09 chưa có verdict.
- Ruling: Thêm domain-source.json làm serialization của source case/obligation — tránh parse Markdown mất mapping — chi phí nếu sai: thêm một file machine-readable phải đồng bộ report.
- Task 1: Ruling: task-done cần nonempty output; wrap git diff --check và in PASS — helper grep trả exit 1 với log rỗng dù check đạt — chi phí nếu sai: chỉ ảnh hưởng bookkeeping, không verdict SUT.
- Task 3: Ruling: Sửa EOF blank line ở domain-cases.md bị phát hiện trong staged check Task 2 — orchestration trước đó không dừng khi check báo whitespace; không amend lịch sử — chi phí nếu sai: một dòng formatting, không ảnh hưởng test data.
- Ruling: Thêm bva-source.json làm serialization cùng schema DT — traceability của union không phụ thuộc parse Markdown — chi phí nếu sai: cần đồng bộ source/report.
- Task 5: Ruling: Android không có device; chọn iPhone18 Pro iOS27 đang boot theo fallback plan — chỉ kết luận iOS — chi phí nếu sai: không có Android coverage.
- Task 5: Ruling: Điều chỉnh API URL chỉ trong copy mobile sang loopback3002 và ảnh3001 — iOS Simulator dùng được host loopback; proxy timing giữ body — chi phí nếu sai: transport topology khác LAN thật, phải ghi environment adjustment.
- Task 5: Ruling: Thêm fixture-server.cjs và test_protocol.py để kiểm reset/delay — không sửa backend; controls chỉ loopback — chi phí nếu sai: simulation error/race không đại diện mọi network thật.
- Task 5: Ruling: API supporting chạy trước khi manifest được tổng hợp; giữ raw at timestamps, tách apiStartedAt/manifestRecordedAt thay vì giả manifest có trước — chi phí nếu sai: trace environment tại đúng thời điểm API hạn chế hơn, native manifest đã có trước launch.
- Task 5: Ruling: Với nhóm readonly search dùng cùng snapshot full bất biến, thay q hoàn toàn và giữ Home/keyboard thay vì reseed/relaunch mỗi query — GET không đổi catalog, strict expected sets vẫn bắt stale results — chi phí nếu sai: lifecycle/relaunch-specific behavior không được kiểm bởi nhóm này; initial loading có case riêng.
- Task 5: Ruling: Metro reload driver dùng version2 sau khi versionless message không tạo request mới — kiểm local protocol socketMessages.js và proxy initial request — chi phí nếu sai: reload evidence không là input UI nhưng là lifecycle devserver, không inject app state.
- Task 5: Ruling: Screenshot capture có thể lỗi ScreenCaptureKit -3811; ưu tiên lưu native AX trước, chỉ gắn PNG thật tồn tại — không dùng screenshot cũ giả như case mới — chi phí nếu sai: vài case text chỉ có AX evidence, visual assertions vẫn cần screenshot.
- Task 5: Ruling: Tiếp tục Task6/7 trên evidence đã thu dù Task5 full execution còn oracle/accessibility blockers — report trung thực thay vì stall hoặc giả Pass — chi phí nếu sai: vẫn cần follow-up để đóng native coverage.
- Task 5: Ruling: RATIO render snapshot images qua empty search thay cold start; card component không đổi, Square ellipse đã quan sát — chi phí nếu sai: không phủ lifecycle-specific ratio behavior.
- Task 5: Ruling: Giữ nguyên CRLF HTTP/unified diff context/Node RED log whitespace ở 3 raw files; kiểm strict docs/harness và whitelist chính xác raw warnings — bảo toàn evidence — chi phí nếu sai: git diff --check global vẫn cảnh báo raw content, người đọc cần biết scope.
- Task 6: Ruling: TC001 Failed→Blocked vì grid không quy định ≥2 native columns và scroll tool không hoạt động; raw trước review giữ nguyên, primary adjudication tách file — tránh false positive — chi phí nếu sai: native layout defect có thể chưa được confirmed, cần authority.
- Task 6: Ruling: BUG005 là observed discrepancy với derived timing oracle, tách khỏi4 explicit confirmed defects — spec không nêu race policy — chi phí nếu sai: không tính một lỗi usability vào confirmed coursework score cho tới review.
- Final: Ruling: Grid nhiều cột và scroll completeness — TC001 giữ Blocked vì native column contract chưa rõ và scroll evidence thiếu — chi phí nếu sai: có thể còn layout defect chưa confirmed.
- Final: Ruling: Image accessibility/alt — TC013 giữ Blocked vì AX export chưa chứng minh VoiceOver/full image semantics — chi phí nếu sai: accessibility defect có thể chưa được xác định.
- Final: Ruling: Exactly-one h1 native — TC020 giữ Blocked vì thiếu mapping từ HTML requirement — chi phí nếu sai: native heading coverage chưa có verdict.
- Final: Ruling: Trim, case folding, bỏ dấu, empty/omitted query, substring, whitespace và wildcard matching — giữ policy cases Blocked, không lấy SQL LIKE làm oracle — chi phí nếu sai: còn search behavior chưa kết luận.
- Final: Ruling: %/_ matching correctness — không kết luận SUT correctness; chỉ ghi coverage/traceability gap — chi phí nếu sai: chưa kiểm literal/wildcard đầy đủ.
- Final: Ruling: Latest-query consistency — giữ BUG005 observed derived discrepancy riêng khỏi 4 explicit defects — chi phí nếu sai: một usability failure có thể chưa tính vào confirmed score.
- Final: Ruling: Android, physical-device/LAN, production-network behavior — chỉ kết luận iOS Simulator loopback/proxy đã quan sát — chi phí nếu sai: không có coverage cho các môi trường còn lại.
- Final: Ruling: Wide/Tall, offscreen layout, long-name visual completeness — không suy đầy đủ visual correctness từ AX; Square failure có PNG riêng — chi phí nếu sai: có thể còn visual defects chưa quan sát.
- Final: Ruling: Exhaustive XSS/security, mọi Unicode/catalog size/timing — sample run không hỗ trợ kết luận exhaustive — chi phí nếu sai: còn input/schedule ngoài mẫu.
- Final: Ruling: Locale/font scale/physical viewport — không áp dấu phân cách hoặc viewport chưa đo làm oracle — chi phí nếu sai: chưa phủ mọi display configuration.
- Final: Ruling: Quy ước giảng viên — giữ BVA/on-off-in là working convention vì thiếu lecture — chi phí nếu sai: cần đối chiếu phương pháp môn học khi có lecture.
- Final: Ruling: PDF/full four-feature submission, learner review/grade, demo, GitHub publication — chưa coi hoàn tất; scope hiện tại một feature Markdown và chưa có authorization publish — chi phí nếu sai: chưa đủ package nộp HW02.
- Final: Ruling: Raw whitespace 3 files và pre-final commit-log — giữ raw bytes; refresh log tại closeout, ghi snapshot HEAD thật — chi phí nếu sai: raw diff check vẫn có ngoại lệ công khai; export commit không tự chứa chính nó.
- Final: Ruling: SUT fixes và unrelated FR03/.gitignore changes — giữ nguyên vì request là testing, không sửa app để đạt Pass — chi phí nếu sai: defects SUT còn tồn tại; unrelated work do người dùng quản lý.
- Final: Ruling: Giữ workspace plan để resume Task5 — full execution vẫn partial; không đạt precondition cleanup/integration — chi phí nếu sai: còn scratch directory ignored cần quản lý.

## Điều kiện resume

Cần authoritative native grid/h1 mapping, search matching policy, công cụ scroll và accessibility evidence phù hợp để xử lý 10 Blocked cases. Cần lecture để đối chiếu course convention. Khi có dữ liệu này, version suite nếu expected thay đổi, tạo run ID mới, giữ run01 và báo cáo lại denominator/executed coverage. Android cần run riêng. Không dùng preference hoặc behavior hiện tại thay requirement oracle.

Không push, merge, publish Issues/video hoặc submit coursework trong phiên này. Các thay đổi FR03/.gitignore ngoài scope được giữ nguyên. Commit log xuất từ Git thật, ghi rõ snapshot và không tự nhận export commit đã nằm trong chính file đó.
```

#### Snapshot 11: FR05-Task5-followup

- Tool: Codex; 
- Recording time: `2026-10-16T15:44:55+07:00`; capture: partial.
- Learner review: Pending learner review.
- Provenance: Visible continuation instruction plus follow-up artifact; excludes full CUA/tool transcript. Actual raw requests/AX/PNG linked. Not learner technical review.

**Prompt được ghi**

```text
tiếp tục các task chưa hoàn thành
```

**Output được ghi**

```text
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
```

#### Snapshot 12: FR05-followup-verification

- Tool: Codex
- Recording time: `2026-10-16T15:45:46+07:00`; capture partial.
- Provenance: Correction/addendum after existing single-run validator rejected mixed-run reporting view; original snapshot retained. Not a new user prompt.
- Learner review: Pending learner review.

**Prompt được ghi**

```text
tiếp tục các task chưa hoàn thành
```

**Output được ghi**

```text
## Verification của follow-up và composite

Validator hiện có yêu cầu một runId duy nhất/file, nên từ chối cumulative-observations.json chứa run01 và run02 với thông báo “one runId required per observation file”. Đây là contract của harness, không phải SUT failure hoặc evidence lỗi. Giữ nguyên từng runId thật; không sửa validator hoặc đổi runId để vượt check. Run01 tiếp tục kiểm bằng validator; run02/composite kiểm riêng về unique IDs, subset10 đúng frozen suite, evidence tồn tại,35 verdict gốc không đổi và thống kê23P/12F/10B. Composite chỉ là reporting view, không phải full fresh run.
```

#### Snapshot 13: FR05-skill-application

- Tool: Codex;
- Recording time: `2026-10-16T15:55:56+07:00`; capture partial.
- Learner review: Pending learner review.
- Provenance: Visible user instruction and skill-application artifact; excludes full tool/skill transcript. Not learner technical review; exact interaction time/model unknown.

**Prompt được ghi**

```text
sử dụng các skill đã định nghĩa ở .agents/skills
```

**Output được ghi**

```text
# FR-05: Áp dụng các skill trong .agents/skills

Đối chiếu ngày16/10/2026, timezone Asia/Ho_Chi_Minh. Áp dụng `domain-testing`, `boundary-value-analysis`, `ai-audit` và `commit-work` cho feature FR05 mobile đã chọn. Không mở rộng sang toàn ứng dụng. Đây là assistant review, learner technical review vẫn Pending.

## Domain Testing — đối chiếu từng bước

Nguồn: [SKILL.md](../../../.agents/skills/domain-testing/SKILL.md), [coursework guidance](../../../.agents/skills/domain-testing/references/eshop-hw02.md).

| Bước của skill | Cách áp dụng FR05 | Artifact / giới hạn |
|---|---|---|
| Establish test basis | README FR05 làm business oracle; API spec làm interface contract; HW02 làm coursework requirement | [Requirements](requirements.md), rules R01–R09, ambiguities A01–A05; thiếu lecture nên on/off/in là working convention |
| 1. Predicates và complement | P_empty:n=0; P_nonempty:n≥1; P_complete:IDs(UI)=S; pending tách success-empty; S⊆C | [Domain model, bước1](domain-model.md#bước-1-chuyển-requirement-thành-mô-hình); n là derived count, không phải search input |
| 2. Reference và boundary | q=Alpha,C=full,s=success làm reference; boundary empty/nonempty tại n=0 | [Bước2–3](domain-model.md#bước-2-phân-hoạch-và-reference-fixture); không suy SQL LIKE thành oracle |
| 3. On/off/in và feasibility | On:(12,0),(0,0); off:(1,1); interior:(2,2). Count step1; n=-1 infeasible | Bảng predicate truth values tại bước3; không tạo negative-product fixture |
| 4. Fault isolation và coupled sampling | Giữ network/catalog nominal khi thay q; n=M có separated on points(1,1),(2,2), feasible off(2,1), interior(3,1) | Không bịa rule x+y≤k; không tuyên bố phát hiện mọi shifted/tilted boundary |
| 5. Interactions và masking | Pending→empty, count/catalog coupling, error/race riêng; price/image assertions không thay search oracle | [Bước4–5](domain-model.md#bước-4-state-và-interaction); error/race ghi Derived |
| 6. Traceability/coverage | Source obligations→canonical IDs; DT/BVA mapping giữ qua dedup; native/API tách biệt | [Suite review](suite-review.md), frozen suite45 canonical/48 source/48 obligations; designed khác exercised |

## BVA — đối chiếu từng bước

Nguồn: [SKILL.md](../../../.agents/skills/boundary-value-analysis/SKILL.md), [method reference](../../../.agents/skills/boundary-value-analysis/references/bva-methods.md).

| Bước của skill | Cách áp dụng FR05 | Artifact / giới hạn |
|---|---|---|
| Test basis/method | ISTQB 3-value BVA, công khai working default vì thiếu lecture | [BVA bước1](bva-report.md#bước-1-xác-định-nơi-bva-áp-dụng); không nhận vơ course-method compliance |
| 1. Ordered partitions | U=N0; E0={0}; E1=[1,+∞)∩N0; expected empty/list khác nhau | [Bước2](bva-report.md#bước-2-universe-type-và-ordered-partitions); không có negative partition khả thi |
| 2. Finite endpoints | Endpoint0 của singleton E0; endpoint1 của E1 | Không dùng +∞ làm test data; không tự thêm pagination/max length |
| 3. Neighborhoods và union | 0→{0,1};1→{0,1,2}; union{0,1,2}, denominator3 | [Bước3](bva-report.md#bước-3-lấy-neighborhoods-của-tất-cả-endpoints); không cộng trùng thành5 |
| 4. Representation | Count là integer, unit product, resolution1; predecessor-1 nằm ngoài U nên loại | Không invent string-length unit/limit hoặc price precision |
| 5. Executable fixtures | q=Alpha,s=success; snapshots empty/one/two điều khiển n=0/1/2; ID201/202 phân biệt hai card cùng tên | [Bước4](bva-report.md#bước-4-chuyển-thành-test-data-có-thể-thực-thi) và bva-source.json |
| 6. Mapping/coverage | Three BVA sources merge vào native TC028–030 với DT+BVA tags; giữ endpoint-to-value mapping | [Bước5–7](bva-report.md#bước-5-deduplicate-nhưng-giữ-endpoint-to-case-mapping); native n0 Failed,n1/n2 Passed:exercised3/3 của slice, không phải toàn feature |

## Execution và reporting theo skill

Mỗi case có ID/rule/input/fixture/preconditions/steps/expected; actual/status/evidence được ghi riêng khỏi designed baseline. [Run01 results](test-results.md) và [run02 follow-up](followup-run02.md) có native AX/PNG và API logs phân biệt. Fixture chỉ tác động disposable backend; SUT/working DB giữ nguyên. [Bug reports](bugs.md) có reproduction/environment/expected/actual/evidence, phân biệt4 explicit defects với1 derived timing discrepancy.

`ai-audit` giữ original interactions và learner reviews riêng, metadata Unknown khi chưa biết; không gọi hỗ trợ unlock/Open Expo Go là learner technical review. [Audit](ai-interactions.md) và [AI gap analysis](ai-gap-analysis.md) liên kết provenance thực. `commit-work` áp dụng local commits theo từng task, stage riêng FR05, review diff và check trước commit; không push/publish.

## Vì sao áp dụng skill vẫn còn Blocked

Domain Testing quy định: “Use requirements as the expected-result oracle”; BVA quy định: “Do not invent missing upper limits, precisions, or validity rules.” Đây là yêu cầu trực tiếp trong các SKILL.md đã link, không phải yêu cầu xin permission của skill. Việc giữ oracle-unresolved là cách executor áp dụng chúng khi README chưa xác định native h1/grid/search policy. Skill không bổ sung business requirements còn thiếu.

Hiện35/45 canonical có verdict:23 Passed,12 Failed;10 Blocked. TC021–027 đã có native probes run02 nhưng chưa có oracle để verdict; TC001 còn native grid/scroll; TC013 thiếu complete accessibility/VoiceOver evidence; TC020 thiếu native h1 mapping. Không có BVA obligation đã xác định nào chưa được exercise; thiếu toàn-suite verdict không đồng nghĩa thiếu BVA n0/n1/n2 execution.

Các phần phân tích/design/deduplicate/report/gap đã có deliverables; Task5 full execution vẫn partial. Không sửa exit criteria hoặc đổi Blocked thành Passed để tuyên bố hoàn tất. Cần nguồn requirement clarification và native evidence capability phù hợp để hoàn thành phần còn lại. Không tự mở browser/Expo web rồi tính thành native coverage.
```

#### Snapshot 14: FR05-skill-attribution-correction

- Tool: Codex; 
- Recording time: `2026-10-16T15:56:18+07:00`; capture partial.
- Learner review: Pending learner review.
- Provenance: Assistant correction to quote attribution in preceding artifact; same user instruction, not a new user turn or learner review.

**Prompt được ghi**

```text
sử dụng các skill đã định nghĩa ở .agents/skills
```

**Output được ghi**

```text
Correction cho snapshot FR05-skill-application: câu “Do not invent missing upper limits, precisions, or validity rules.” thuộc domain-testing/SKILL.md, không phải nguyên văn boundary-value-analysis/SKILL.md. Đã sửa attribution trong skill-application.md; không đổi test data/verdict. Original output được giữ trong audit.
```

## 3. FR-07

`````markdown

## Interaction 54c4f556-0eac-41ec-a39d-5ba0d253bcaf

```text
{
  "tool": "Codex",
  "task": "FR-07-planning",
  "recorded_at": "2026-10-14T00:30:41+07:00",
  "source": "Current visible user request and complete saved plan artifact; excludes other conversation messages, supplied skill body and tool outputs. Original interaction timestamp and exact model identifier unavailable. Plan source is ignored by Git; this event preserves its full output. No testing execution or learner review implied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-07: Shopping cart đảm bảo tuân theo workflow sau:

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

````text
# FR-07 Shopping Cart Domain Testing + BVA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kiểm thử FR-07 theo đúng 7 bước người dùng yêu cầu, giải thích chi tiết cách áp dụng Domain Testing on/off/in và ISTQB 3-value BVA, thực thi suite hợp nhất và báo cáo bằng chứng, lỗi, khoảng trống AI.

**Architecture:** Requirement → Domain Testing → BVA → review/deduplicate/technique mapping → execute → actual/pass-fail/bug → AI gap analysis. Thiết kế oracle từ đặc tả trước; dùng implementation để xác định cách tiếp cận và quan sát sai khác. Tách API và WEB, giữ các ca nguồn của hai kỹ thuật, thực thi từng canonical case trong fixture cách ly và bảo toàn SUT.

**Tech Stack:** Markdown/JSON; Node.js HTTP runner; Express/SQLite backend; React/Vite customer web; Python Playwright qua skill webapp-testing; ai-audit cho log có provenance.

**Spec:** `README.md:93-100` (FR-07), `README.md:83-87` (FR-06, chỉ làm dependency thêm sản phẩm/số lượng), `api_specification.md:110-127` (GET/POST cart), `docs/2026.HW02.Domain Testing_En.pdf` mục 6, 9, 10, 12, 14; `AGENTS.md`. Phương pháp: `.agents/skills/domain-testing/SKILL.md`, `.agents/skills/boundary-value-analysis/SKILL.md` và `references/bva-methods.md`. Người dùng đã chọn on/off/in và ISTQB 3-value BVA; chưa có lecture để khẳng định tương đương phương pháp trên lớp.

## Global Constraints

- "For testing requests, preserve the SUT's behavior and report discrepancies."
- "Change application code to fix a bug only when the user requests a fix."
- "Do not expand a selected feature into testing the whole application."
- "Each case records ID, rule, preconditions, input/fixture, steps, expected result, actual result, status, and evidence."
- "Use `Not Run` for designed but unexecuted cases and `Blocked` for cases prevented by the environment."
- "Never infer pass/fail from generated cases."
- "Do not stage incidental test changes to it." (`backend/database.sqlite`)
- "Do not fabricate student review, audit entries, execution results, or demo links."
- "Use Asia/Ho_Chi_Minh for user-facing local times unless the user specifies another timezone."
- "Push, amend, rebase, squash, and other history rewrites require the user's request."

Phạm vi: FR-07 trên customer WEB và API cart. FR-06/add và login chỉ là dependency/fixture, không mở rộng thành suite của FR-06/FR-02. Không chạy checkout để reset cart; không kiểm thử coupon, admin, native mobile. Báo cáo bằng tiếng Việt; commit message bằng tiếng Anh. Yêu cầu hiện tại chỉ là lập kế hoạch; các checkbox dưới đây chưa được thực thi.

## Review Focus

1. Thêm cùng ID lần thứ hai: vẫn một dòng, quantity cộng dồn, thành tiền/tổng cập nhật (Task 2: MERGE; Task 3: REPEAT).
2. Quantity 1, 0, âm, phân số: chỉ áp dụng oracle có nguồn; không cho phép phép parse/truncate che mất input ban đầu; chính sách giảm từ 1 phải được ghi ambiguity (Task 1; Task 2: QTY; Task 3: ADD-Q).
3. Thiếu +/- hoặc thiếu dialog: case kiểm tra sự hiện diện phải có verdict riêng; case tương tác phụ thuộc được Blocked, không tự sửa DOM hoặc bỏ qua xác nhận (Task 2: CONTROL/DELETE; Task 5).
4. Xóa/hủy xóa trên giỏ nhiều dòng hoặc dòng cuối: đúng sản phẩm bị tác động, hủy giữ nguyên state; sau xóa cuối có empty state (Task 2: DELETE/EMPTY).
5. WEB và API dùng đường đi/state riêng: không dùng GET cart làm bằng chứng state React; không tạo API PUT/DELETE không có trong spec (Task 1; Task 4; Task 5).

---

## Cấu trúc file và hợp đồng bàn giao

Root chuẩn: `docs/testing/fr07/`, `tests/fr07/`. Không sửa các artifact FR-03 đang có thay đổi chưa commit.

| File tạo mới | Trách nhiệm |
|---|---|
| `docs/testing/fr07/requirements.md` | Rules có nguồn, scope, oracle/ambiguity, định nghĩa dữ liệu và phương pháp |
| `docs/testing/fr07/domain-model.md` | Các bước DT: predicate, miền, biên, on/off/in, tính khả thi và masking |
| `docs/testing/fr07/domain-cases.md` | Full case DT và ma trận nghĩa vụ DT |
| `docs/testing/fr07/bva-report.md` | Các bước BVA: partition, endpoint, neighbor, union, case, coverage |
| `docs/testing/fr07/suite-review.md` | Correction ledger, dedup mapping, traceability, suite hash/version |
| `tests/fr07/suite.json` | Suite canonical bất biến theo từng version, chưa gán kết quả thực thi |
| `tests/fr07/validate-suite.cjs` | Kiểm tra schema, ID, mapping, dedup và execution reconciliation |
| `tests/fr07/run-cart-api.cjs` | GET/POST cart runner, state before/after, observations API |
| `tests/fr07/run-cart-web.py` | UI runner Playwright, guard dependency, dialogs, screenshots |
| `tests/fr07/prepare-environment.cjs` | Tạo backend copy và fixture cách ly, xác minh đường dẫn/ports/hash |
| `docs/testing/fr07/evidence/<runId>/manifest.json` | Build/commit, suite hash, runtime, timezone, URL, fixture/reset, giờ chạy |
| `docs/testing/fr07/evidence/<runId>/api/observations.json` | Request/response và cart snapshot theo ID, token được redact |
| `docs/testing/fr07/evidence/<runId>/web/observations.json` | UI actual, network/console/dialog và screenshot links |
| `docs/testing/fr07/evidence/<runId>/web/screenshots/` | PNG theo canonical case ID và checkpoint |
| `docs/testing/fr07/test-results.md`, `bugs.md` | Verdict/coverage/thống kê và bug reproduction có bằng chứng |
| `docs/testing/fr07/ai-interactions.jsonl`, `ai-interactions.md` | Log append-only và export prompt/output/review có provenance |
| `docs/testing/fr07/ai-gap-analysis.md` | AI gap có evidence; AI Critique 200-300 từ |
| `docs/testing/fr07/README.md`, `commit-log.txt` | Summary FR-07, giới hạn, artifact links, lịch sử commit thật |

Read-only: `backend/server.js:14,284-295` (cart trong RAM), `backend/database.js` (startup DROP/reseed), `frontend-web/src/context/CartContext.jsx`, `frontend-web/src/pages/Cart.jsx`, `ProductDetail.jsx`, `App.jsx`. Đây là thông tin tiếp cận SUT, không phải oracle. WEB hiện dùng React state và request product tới `http://localhost:3000`; backend cố định port 3000.

**Case schema:** `{id, sourceCaseIds, techniques, layer, rules, obligations, oracleStatus, preconditions, fixture, steps, expected, dependencies, actual, status, evidence}`. `layer=API|WEB`; `techniques` là tập con khác rỗng của `["Domain Testing","BVA","Supplementary"]`; source IDs `FR07-DT-*`, `FR07-BVA-*`, `FR07-SUP-*`; canonical IDs `FR07-TC-001` trở đi. Rule IDs `FR07-Rxx`; nghĩa vụ `FR07-OBL-DT-*`/`FR07-OBL-BVA-*` luôn mang layer và operation.

`oracleStatus=confirmed|derived|unresolved`; unresolved giữ trong ambiguity/probe register, không tự đưa vào suite có verdict. Thiết kế canonical: `actual=null`, `status="Not Run"`, `evidence=[]`. Kết quả run ở observations riêng: `{caseId, runId, attempted, startedAt, endedAt, inputSent, stateBefore, stateAfter, assertions, actual, status, blocker, evidence}`; status `Passed|Failed|Blocked|Not Run`. Freeze suite chứa đầy đủ confirmed/derived cases; không loại ca có nguy cơ Blocked để đẹp coverage.

**CLI sẽ tạo ở Task 4/5:**

Ví dụ cho run đầu tiên với ID `fr07-run01` (run tiếp theo dùng ID/path mới; không overwrite evidence cũ):

```bash
node tests/fr07/validate-suite.cjs --suite tests/fr07/suite.json
node tests/fr07/prepare-environment.cjs --root /private/tmp/eshop-fr07-run
node tests/fr07/run-cart-api.cjs --backend-dir /private/tmp/eshop-fr07-run/backend --base-url http://localhost:3000 --out docs/testing/fr07/evidence/fr07-run01/api
python3 tests/fr07/run-cart-web.py --backend-dir /private/tmp/eshop-fr07-run/backend --base-url http://localhost:5173 --out docs/testing/fr07/evidence/fr07-run01/web
node tests/fr07/validate-suite.cjs --suite tests/fr07/suite.json --observations docs/testing/fr07/evidence/fr07-run01/api/observations.json docs/testing/fr07/evidence/fr07-run01/web/observations.json
```

CLI chưa tồn tại ở thời điểm lập plan. Dùng Python bundled có Playwright nếu `python3` hiện tại thiếu; ghi executable thật vào manifest. Runner exit 0: mọi case thuộc layer Passed; 2: run đầy đủ nhưng có Failed/Blocked; 1: harness/setup lỗi và vẫn ghi partial observations. Validator exit 0: dữ liệu/schema/mapping hợp lệ, không chứng minh SUT Passed. Không dừng ở conformance failure đầu tiên.

## Task 1: Phân tích requirement

**Files:** Create `requirements.md`; append/export `ai-interactions.jsonl`, `ai-interactions.md` trong root FR-07.

**Interfaces:** Consumes Spec; produces FR07-R01..R08, dependency FR06-Q, API-AUTH, ambiguity IDs, fixture và oracle sử dụng ở mọi task sau.

- [ ] **Step 1: Chốt test basis và method.** Ghi section/dòng của từng nguồn. Ghi lựa chọn thực tế của người dùng: Domain Testing on/off/in + ISTQB 3-value BVA. Chưa có lecture: ghi giới hạn đối chiếu môn học, không đổi thành normal/robust BVA hoặc dùng công thức 4n+1/6n+1.
- [ ] **Step 2: Lập bảng rule có nguồn.** R01: cột Sản phẩm/Đơn giá/Số lượng/Thành tiền/Thao tác; R02: cùng product ID tăng quantity, không thêm dòng; R03: quantity có nút +/-; R04: xóa có dialog xác nhận, Cancel không xóa, Confirm chỉ xóa dòng đích (hai hậu điều kiện sau là diễn giải của xác nhận); R05: Tiếp tục mua sắm quay về `/`; R06: nhãn chính xác `Tổng cộng`; R07: giỏ trống có minh họa và thông báo rõ; R08: line total `p*q`, grand total `Σ(p*q)` là oracle suy ra từ ý nghĩa Thành tiền/Tổng cộng, ghi `derived`. FR06-Q: input thêm sản phẩm chỉ số nguyên dương >=1; API-AUTH: GET/POST cart yêu cầu Bearer token. Không gán FR06-Q như rule API đã được ghi rõ trong spec.
- [ ] **Step 3: Định nghĩa biến và baseline.** `n∈N0` = số ID sản phẩm phân biệt; `q∈Z` cho lát cắt số nguyên của quantity input, resolution 1; `d∈Z` quantity lần add; `r∈N0` số lần add thành công cùng ID trước thao tác hiện tại; `id∈{A,B}`, membership là categorical; action `add|plus|minus|delete|cancel|confirm|continue` là categorical. Fixture sản phẩm A: id=1, p=100000₫; B: id=2, p=250000₫, tên/ảnh local test fixture. Nominal cart A(q=2), B(q=1), total=450000₫. Giá nguyên VND là fixture thuận tiện, không tự kết luận precision tiền hoặc giới hạn giá của FR-07.
- [ ] **Step 4: Lập ambiguity register.** AMB-01: FR06-Q áp dụng đến đâu trên cart/API; AMB-02: minus tại q=1 disable, giữ nguyên hay xóa; AMB-03: quantity max/cart max/stock không có; AMB-04: API không có update/delete/total response contract/status code chi tiết; AMB-05: identity dùng ID là diễn giải, cùng tên khác ID là probe nếu chưa xác nhận; AMB-06: giá/precision/rounding và giá client vs catalog chưa quy định trong FR-07; AMB-07: cart persistence/sync qua refresh/login/backend restart chưa quy định. Ghi quyết định và ảnh hưởng coverage. Probes chưa đủ oracle không được tự gán Passed/Failed; vẫn ghi actual nếu chạy bổ sung và nêu verdict chưa đánh giá.
- [ ] **Step 5: Khởi tạo audit liên tục.** Giữ prompt/output gốc, timestamp có offset khi biết, recording time riêng, tool/model khi biết, capture extent. Append lựa chọn method của người dùng; assistant self-review không phải learner review. Planning log chỉ là phần tương tác có thể truy cập, không tuyên bố complete-session audit.
- [ ] **Step 6: Verify và commit.** Đối chiếu 6 bullet FR-07 với R01..R07 (R03 tách khỏi R01), đánh dấu R08 derived và các dependency. `git diff --check`, review diff/staged, commit đúng files: `docs(fr07): analyze shopping cart requirements`.

## Task 2: Sinh test case Domain Testing

**Files:** Create `domain-model.md`, `domain-cases.md`; append audit.

**Interfaces:** Consumes Task 1; produces source DT cases, predicate/point tables và explicit DT obligations cho Task 4.

- [ ] **Step 1: Mô hình miền trước khi sinh case.** Viết `ValidAddQuantity(d)=(d∈Z ∧ d>=1)` cho WEB add dependency; complement gồm số nguyên <=0 và noninteger/wrong-type riêng. Viết `Empty(n)=(n=0)`, `Nonempty(n)=(n>=1)`, `Member(id,C)`, `MergePost(q,d,q')=(q'=q+d ∧ rows(id)=1)`, `Line(L,p,q)=(L=p*q)`, `Total(T,C)=(T=Σp_i*q_i)`, `DeletePost=(confirmed ∧ target removed) ∨ (cancelled ∧ C'=C)`. Nêu rule validity, state partition và postcondition riêng; không biến mọi UI yêu cầu thành numeric acceptance.
- [ ] **Step 2: Giải thích on/off/in với tọa độ.** WEB add: boundary d=1 included; on=1, off invalid=0, off valid=2, in=3; âm và phân số là partitions bổ sung. Empty: threshold n=0, on=0, off khả thi n=1; n=-1 không thể tạo, in nonempty n=2. Equality merge: mặt `q'=q+d`; on tại `(q,d,q')=(1,1,2)` và `(2,3,5)`, off kỳ vọng sai q'=sum±1. `q'` là output không điều khiển: fixture điều khiển `(q,d)` rồi assert equality, không dựng off output giả như input SUT và không tính nó thành execution riêng. Integer equality không có miền valid interior theo hướng pháp tuyến; ghi N/A và chọn interior ở miền input `(q,d)=(3,2)`. Total cũng là output equality, thay đổi `(p,q)` để kiểm tra, không bịa precision/epsilon.
- [ ] **Step 3: Lập point/predicate table và khả thi.** Mỗi điểm ghi operation/layer, tuple đầy đủ, resolution, truth values, on/off/in rationale, kỳ vọng, source, obligation. Giữ các điều kiện khác hợp lệ khi cô lập quantity hoặc merge. Corner n=0 với existing member là bất khả thi; cancel/confirm cùng một hành động cũng bất khả thi. Categorical membership/confirm/auth không có khoảng cách số học: dùng partition, không gọi BVA hay ép on/off hình học.
- [ ] **Step 4: Sinh các case family dưới đây thành full records.** Mỗi fixture/action riêng có source ID riêng; tất cả ban đầu Not Run. Không chốt case count trước khi expand và review.

| Family | Layer và fixture/thao tác | Expected/obligation |
|---|---|---|
| `FR07-DT-EMPTY-*` | WEB n=0; add A để n=1; A+B để n=2; xóa cuối có xác nhận | Empty có ảnh/thông báo; nonempty có bảng; chuyển sang empty sau xóa cuối |
| `FR07-DT-MERGE-*` | API và WEB riêng; A(q=1)+A(d=1); A(q=2)+A(d=3); A(q=3)+A(d=2) | Một dòng A q=2/5/5; WEB line total=200000/500000/500000₫, B không đổi nếu có |
| `FR07-DT-NEW-*` | API/WEB add A rồi B; WEB giỏ A+B nominal | Hai dòng ID khác; quantity đúng; WEB total=450000₫ |
| `FR07-DT-QTY-*` | WEB add d=0,1,2,3,-1,1.5 và input rỗng | d nguyên dương được thêm nguyên giá trị; còn lại không thêm sản phẩm quantity không hợp lệ; lưu input gốc/giá trị sent và state trước/sau |
| `FR07-DT-CONTROL-*` | WEB cart nonempty; kiểm tra +/- rồi tăng q=2→3, giảm 3→2 | Control tồn tại; line/total đổi theo q; q=1 minus chỉ characterization nếu policy chưa rõ |
| `FR07-DT-DELETE-*` | WEB A+B; mở xóa A rồi Cancel; run mới Confirm A; run mới xóa B; run riêng xóa cuối | Dialog xuất hiện; Cancel giữ cart; Confirm xóa đúng target, total tính lại; last deletion cho empty state |
| `FR07-DT-DISPLAY-*` | WEB nominal A+B; continue tại n=0 và n=2 | 5 cột, label Tổng cộng; line totals 200000/250000₫, total 450000₫; continue về `/` (so sánh copy và navigation là assertions riêng) |
| `FR07-DT-AUTH-*` | API GET và POST: token hợp lệ, thiếu, invalid | Valid dùng đúng user cart; missing/invalid bị từ chối, negative POST không mutate cart; không bịa exact error code ngoài contract |

Các điểm total/merge tách theo miền new/existing và nhiều giá trị q,d nhằm bắt omitted/shifted logic; đây là samples có giới hạn, không chứng minh hết miền vô hạn. Same-name/different-ID và very-large quantity là probes có oracle chưa chốt, không tự dùng như nghĩa vụ bắt buộc.

- [ ] **Step 5: Lập ma trận coverage DT.** Các obligation: partitions, feasible boundary points, hai separated merge controls, delete branches, empty transition, display/nav, auth và state preservation của negative add. Map nghĩa vụ→source IDs theo layer. Ghi invalid quantity isolates một rule; n/merge/r có phụ thuộc nên không claim Cartesian coverage.
- [ ] **Step 6: Verify và commit.** Kiểm toán mọi expected từ R IDs, tính `100000*2+250000*1`, feasibility và masking; `git diff --check`; commit `docs(fr07): derive shopping cart domain test cases`.

## Task 3: Sinh test case BVA

**Files:** Create `bva-report.md`; append audit. Không thay Domain report thành bảng BVA.

**Interfaces:** Consumes Task 1 data universe/method; produces endpoint→neighbors→unique values→source cases→obligations cho Task 4.

- [ ] **Step 1: Giải thích partition cho từng dimension/operation/layer.** ADD-Q WEB: integer slice `(-∞,0]` invalid và `[1,+∞)` valid; finite endpoints 0,1. CART-N WEB: realizable universe N0, `{0}` empty và `[1,+∞)` nonempty, finite endpoints 0,1. REPEAT API/WEB: `r=0` chưa thêm A; `r>=1` đã thêm A, r là số lần add thành công trước thao tác hiện tại, universe N0, endpoints 0,1. Không thêm upper bound; n/r là state partitions có thứ tự, không phải rule từ chối numeric input.
- [ ] **Step 2: Tính 3-value cho MỌI finite endpoint rồi union.** ADD-Q: 0→{-1,0,1}; 1→{0,1,2}; union {-1,0,1,2}, 4 obligations/layer-operation này. CART-N: 0→{0,1} (bỏ -1 vì không khả thi); 1→{0,1,2}; union {0,1,2}, 3 obligations. REPEAT tương tự {0,1,2}, 3 obligations cho mỗi API/WEB. Lát cắt đang biết: 4+3+3+3=13 value obligations, chưa phải 13 canonical cases và chưa phải 100% feature. Giữ endpoint-to-value mapping khi giá trị lặp; -1 là khả thi cho quantity input nên không bỏ vì input UI thiếu min.
- [ ] **Step 3: Giải thích fixture/expected từng giá trị.** ADD-Q từ cart rỗng, A, giá fixed: -1/0 không thêm invalid quantity, 1/2 thêm đúng q và line/total nếu nonempty. CART-N tạo đúng 0/1/2 unique IDs, xác minh empty vs bảng, số dòng và totals. REPEAT seed r=0/1/2 lần add A(d=1), rồi thực hiện thêm một lần: expected một dòng q=1/2/3, total WEB=100000/200000/300000₫. Seed theo hành vi có oracle; nếu setup tạo duplicate lines, ghi setup mismatch như quan sát R02, không hợp thức hóa fixture sai để claim boundary covered.
- [ ] **Step 4: Tách supplement và coupling.** Fractional/null/wrong-type không là neighbors trong Z; đưa về DT/Supplementary. Boolean confirmation/auth, column labels, string product identity không là BVA. Minus q=1 là policy chưa rõ, không tính như nghĩa vụ BVA có oracle. Không coi money=0 hay JS max-safe-integer là boundary FR-07. Giữ nominal các chiều khác; n/r/membership có coupling nên không chạy worst-case Cartesian hoặc dùng 6n+1.
- [ ] **Step 5: Viết báo cáo dẫn xuất và case table.** Bắt buộc trình bày tuần tự: source→type/unit/resolution→ordered partitions→finite endpoints→3-value neighborhoods→union→fixtures và expected→source case IDs→coverage. Source family `FR07-BVA-ADDQ-*`, `FR07-BVA-CARTN-*`, `FR07-BVA-REPEAT-API-*`, `FR07-BVA-REPEAT-WEB-*`. Các values dùng operation/layer khác là obligations khác. Coverage thiết kế/executed tính riêng, unknown limits còn ghi partial scope.
- [ ] **Step 6: Verify và commit.** Tự tính lại 4/3/3/3, xác nhận union không mất endpoints invalid, n=-1 infeasible nhưng q=-1 feasible; `git diff --check`; commit `docs(fr07): derive three-value cart boundary cases`.

## Task 4: Review + deduplicate + liên kết test case với technique

**Files:** Create `suite-review.md`, `tests/fr07/suite.json`, `tests/fr07/validate-suite.cjs`; append audit.

**Interfaces:** Consumes nguồn DT/BVA/obligation tables; produces canonical version v1 + hash + validator cho Task 5/6.

- [ ] **Step 1: Review nội dung và correction ledger.** Kiểm toán oracle nguồn/derived, exact values, feasibility, predicate truth, masking, setup dependencies, layer, nguồn method và từng Review Focus. Ghi before/after/reason và người review thật; assistant review mang nhãn self-review, learner review Pending nếu chưa có. Không yêu cầu approval lại cho thao tác thường lệ đã nằm trong testing scope khi thực thi được cho phép.
- [ ] **Step 2: Dedup theo execution scenario.** Chỉ merge khi cùng layer, initial state, fixture nguyên dạng, ordered actions, expected assertions và dependencies. `sourceCaseIds`, `techniques`, `obligations`, `rules` lấy union. WEB add d=1 có thể đồng thời DT+BVA; API merge và WEB merge không gộp. r=1 và d=1 không tự trùng vì prestate khác. Nếu gộp assertions bổ sung vào cùng scenario, phải ghi rõ case thực thi assert tất cả, không chỉ union nhãn.
- [ ] **Step 3: Tạo validator.** Hàm `validateSuite(cases)` trả `{errors:string[], stats:object}`; CLI đọc suite, validate unique canonical/source IDs, references tồn tại, fields đủ, technique/obligation consistent, trạng thái chưa chạy, feasible setup. Hàm `reconcile(cases, observations)` phát hiện missing/duplicate/unknown case results và evidence không tồn tại; distinct result row theo runId+caseId. Self-check validator bằng fixture nhỏ: duplicate ID phải exit 1, orphan source/obligation exit 1, suite hợp lệ exit 0. Đây là kiểm tra harness, không sửa SUT.
- [ ] **Step 4: Đóng băng và chứng minh traceability.** Matrix R→domain/partition→source IDs→canonical IDs→technique/obligations→layer. Lưu hash SHA-256 và N canonical thật; tất cả Not Run. Validator phải chứng minh mọi source case đã được map hoặc có exclusion lý do và không lén loại ca thiếu UI. Thiết kế coverage DT và BVA có denominator riêng; không cộng source counts để ra số unique tests.
- [ ] **Step 5: Verify và commit.** Chạy validate CLI, đọc stats và manual spot-check full mapping, `git diff --check`; commit `test(fr07): freeze reviewed cart domain and boundary suite`.

## Task 5: Execute toàn bộ test suite

**Files:** Create 3 runner/setup scripts, `evidence/<runId>/`; append audit. Chưa viết report verdict tổng hợp ở task này, nhưng lưu actual/assertion/status ngay khi chạy.

**Interfaces:** Consumes frozen suite/fixtures; produces 1 observation/canonical ID hoặc explicit blocker + manifest cho Task 6. Không có quyền sửa app.

- [ ] **Step 1: Chuẩn bị môi trường an toàn.** Đọc lại database.js trước startup. `prepare-environment.cjs` tạo bản copy `server.js`/`database.js` vào root /private/tmp mới, giữ nguyên nội dung/hash, dùng deps có sẵn qua symlink node_modules; tuyệt đối không symlink DB. Path guard dùng realpath để từ chối working backend/DB và symlink quay về nó. Seed A/B trong DB copy sau initialization hoàn tất; thực hiện read-back fixture đúng giá/name/ID. Hash working DB trước/sau; không đọc/chỉnh working data để seed. Không chạy docker-compose, backend seed/dev ở working backend. Không overwrite tmp root có sẵn.
- [ ] **Step 2: Chốt server ownership và reset.** Backend hardcoded 3000, frontend gọi 3000: kiểm tra port, không kill server của người dùng. Nếu bận bởi server khác thì ghi Blocked setup và tiếp tục phần có thể chạy an toàn. Start isolated backend tại 3000, web `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` trong frontend-web bằng helper `with_server.py` sau `--help`. Snapshot source/runtime/dependency versions, browser/viewport/locale vi-VN, timezone Asia/Ho_Chi_Minh, manifest suite hash. API cart nằm trong RAM: tạo user fixture riêng mỗi canonical API case và đăng nhập hợp lệ để có cart rỗng; không reset bằng SQL hoặc checkout. WEB: browser context mới/case và bắt đầu `/` để React cart rỗng; SPA navigation giữa steps, không reload làm mất cart.
- [ ] **Step 3: Kiểm chứng runner trước khi chạy suite.** Smoke GET cart của user mới trả rỗng; web tải product fixture từ đúng backend. API runner không gọi undocumented PUT/DELETE; sau mỗi POST luôn GET kiểm tra state, không suy Pass từ status/message. WEB dùng DOM đã render và dialogs, không mock app response, inject React state hay sửa DOM. Mỗi case setup phải ghi thao tác add/clickCount thật; nếu một click add không hiệu lực, lưu dependency discrepancy của FR-06, không tự click lần hai để làm case Pass. Có thể setup bổ sung documented workaround riêng, gắn nhãn, chỉ để quan sát FR-07; case kiểm tra one-click add vẫn giữ failure nếu thuộc dependency check, không đổi expected theo code.
- [ ] **Step 4: Chạy API và ghi observations.** Runner đọc mọi API canonical cases, reset fresh user fixture, lưu request/input gốc, status/body, cart trước/sau và từng assertion. Capture token redacted. Kiểm tra negative POST không đổi cart. API duplicate case vẫn so một dòng và sum quantity theo R02; không coi current push implementation là correct. Harness exceptions được phân biệt conformance assertion failures, ghi traceback/log và case ảnh hưởng; không stop-on-first-failure.
- [ ] **Step 5: Chạy WEB và giữ dependencies minh bạch.** Kiểm tra columns/+/-/dialog/image bằng case presence riêng. Có +/- mới chạy thao tác quantity; thiếu control thì presence Failed, dependent action Blocked với ID failure. Xóa thiếu dialog: lưu screenshot/state before/after cho presence failure; Cancel/Confirm branches Blocked, không tự chấp nhận deletion không xác nhận. Empty illustration: kiểm tra DOM và rendered asset (SVG/CSS minh họa cũng có thể hợp lệ), không chỉ đếm img. Continue kiểm tra copy theo R05 và URL `/` riêng. Chụp trước/sau thao tác và mỗi failure/blocker, lưu console/network đủ liên kết ID.
- [ ] **Step 6: Reconcile toàn suite và commit.** Chạy validator với cả 2 observations; mỗi canonical ID phải có result hoặc explicit Blocked/Not Run lý do. Điều kiện “execute toàn bộ” là đã attempt mọi case có precondition khả thi; các ca Blocked vẫn chưa executed, không tuyên bố đã chạy hết nếu còn blocker. Ghi phần chưa thực thi và cách unblock; tiếp tục chạy các case độc lập. Xác minh working DB hash, `git diff --check`, commit `test(fr07): execute reviewed shopping cart suite`. Harness failure chưa khắc phục thì ghi partial run, không claim task hoàn tất.

## Task 6: Ghi actual result / pass-fail / bug

**Files:** Create `test-results.md`, `bugs.md`, FR-07 `README.md`; append audit. Không ghi kết quả giả vào frozen suite.

**Interfaces:** Consumes raw observations và oracle; produces verdict có evidence, bug dedup, statistics và executed coverage cho Task 7.

- [ ] **Step 1: Reconcile actual và assertions từng case.** Full row: ID, rule/technique/obligation, preconditions, input sent, steps, expected, actual, status, evidence. Passed chỉ khi tất cả expected assertions đã quan sát đúng; Failed khi quan sát sai yêu cầu; Blocked khi chưa thể đánh giá vì precondition/environment; Not Run khi chưa attempt. Missing UI presence là observed failure; phụ thuộc không chạy là Blocked. Assertion chưa có oracle chỉ đưa probe register, không gán bug business rule.
- [ ] **Step 2: Lập bug record và reproduce.** ID `FR07-BUG-001` trở đi; title, affected rule/case/layer, severity có rationale, build/time/fixture/reset, minimal steps, expected/actual, screenshots/logs, reproduction outcome. Tách suspected từ static read với observed failure. Root-cause group không cộng mỗi failing case thành bug mới; một nhóm ảnh hưởng nhiều rules có liên kết rõ. Không sửa SUT và không publish GitHub Issues khi chưa được phép.
- [ ] **Step 3: Tính counts và coverage thật.** `designed=N canonical`; `executed=Passed+Failed`; `N=Passed+Failed+Blocked+Not Run`; `notYetExecuted=Blocked+Not Run`. Báo thêm attempted count và interface counts để không nhầm attempt với evaluated. DT/BVA: designed mapped obligations/identified obligations, executed obligations/identified obligations và conformance assertions riêng; case shared tính một lần ở tổng, nhiều mapping techniques. Setup mismatch không tính nghĩa vụ đạt precondition là exercised. Nêu rõ 13 là BVA known value obligations theo method/operation/layer, không tổng case hoặc toàn feature coverage. READMEs chỉ FR-07, không sửa root README oracle, không tự đánh giá điểm thay người học.
- [ ] **Step 4: Verify và commit.** Reproduce các observed failures bằng isolated fresh state; mọi Failed/Blocked có evidence và reason; kiểm tra screenshot links, formulas/counts và không rò token. Chạy reconcile validator, `git diff --check`; commit `docs(fr07): record cart results and observed defects`.

## Task 7: AI gap analysis

**Files:** Create `ai-gap-analysis.md`, `commit-log.txt`; append/export audit. Nếu bổ sung test, sửa technique reports/suite theo version mới.

**Interfaces:** Consumes original AI output/source cases, correction ledger, learner feedback thật, observations/bugs; produces evidence-grounded analysis và correction closure.

- [ ] **Step 1: So sánh bản AI ban đầu với review/execution.** Mỗi gap có original artifact/hash/commit, omission hoặc sai expectation, affected rule/technique/case, discovery evidence, correction, status. Kiểm tra nguy cơ: bịa qMax/stock, bỏ invalid endpoint, gộp API+WEB, nhầm dialog boolean là BVA, biến source read thành observed bug, duplicate counts, mất cart do reload, reset RAM bằng SQL, thiếu learner review. Đây là checklist rủi ro, không mặc định AI đã mắc lỗi đó.
- [ ] **Step 2: Phân tích nguyên nhân có mức chắc chắn.** Phân biệt facts với hypothesis prompt quality, unavailable lecture, tool/interface limits, state/coupling complexity. User đã yêu cầu BVA và review ngay từ đầu: không bịa chuyện người học phải sửa AI mới có 7 bước. Không lấy lỗi/gap FR-03 làm bằng chứng FR-07. Nếu chưa có gap quan sát được, ghi chưa có bằng chứng; không khẳng định AI không bỏ sót gì.
- [ ] **Step 3: Đóng vòng sửa gap.** Cases mới quay lại Tasks 2/3→4 review/dedup, giữ baseline v1 và tạo version/hash mới→5 execute delta và các ca bị ảnh hưởng→6 reconcile. Mọi source obligation mới có kết quả hoặc blocker. Giữ run histories và không sửa đè output AI ban đầu/observations. Pending learner review không trở thành accepted chỉ vì assistant self-review xong.
- [ ] **Step 4: Viết AI Critique và limitations.** Một đoạn 200-300 từ, count theo whitespace và ghi cách count; dựa trên observed gaps/corrections hoặc giới hạn có evidence. Log tool/date/time/prompt/output được capture, trường unknown để unknown, learner review Pending nếu chưa có. Markdown này là phần FR-07; main report/Audit/Critique PDF, group Issues có screenshots, demo video/ZIP/Moodle thuộc full-assignment handoff sau, không tuyên bố hoàn tất bài 4 feature.
- [ ] **Step 5: Verify và commit gap analysis.** Kiểm tra evidence links và fact/hypothesis, nguồn các correction, word count, stats/version cuối; `git diff --check`; commit `docs(fr07): analyze evidenced cart testing AI gaps`.
- [ ] **Step 6: Export commit log thật và summary.** `git log --reverse --date=iso-strict --format='%h %ad %s' -- docs/testing/fr07 tests/fr07` xuất vào commit-log.txt; ghi snapshot không gồm commit xuất log của chính nó. Verify subjects/scopes/files và summary FR-07; commit `docs(fr07): export shopping cart testing commit history`. Không tạo historical commits cho bước chưa thực thi, không push.

## Quy tắc commit cho từng task

Trước commit: `git status --short`, `git diff -- <task files>`, `git diff --check`; stage exact files hoặc hunks thuộc task; `git diff --cached` và kiểm tra không có unrelated staged files. Nếu unrelated staged work tồn tại, commit pathspec task files để không đưa chúng vào commit. Sau commit: `git show --stat --oneline HEAD`, `git status --short`. Mỗi task completed có commit riêng; log audit phát sinh cùng task được commit cùng deliverable đó. Không `git add .`/`-A`, không force-track docs/superpowers, không amend/rewrite/hooks/config changes.

## Planning self-review và execution handoff

Đã self-review plan với source: đủ 7 tasks đúng thứ tự; 6 bullet FR-07 đều có rule/case family; R08 derived được nêu riêng; API chỉ GET/POST và authentication dependency. DT có predicate→complement→on/off/in→coupling/feasibility→case→obligation; BVA có ordered partitions→tất cả finite endpoints→neighbors→union→fixture→mapping, known value obligations=13. Các mặt equality output không bị giả làm controllable inputs. Có Task 4 dedup nhiều-nhiều, freeze/hash và Task 5/6 tách capture khỏi report, blockers khỏi verdict; 5 Review Focus có task/case cụ thể. Không phát hiện bug bằng thực thi trong lượt lập plan này.

Plan tạo ngày 2026-10-14, Asia/Ho_Chi_Minh. `docs/superpowers/` được Git ignore theo repo; giữ file ở đường dẫn skill yêu cầu và lưu nguyên nội dung đầu ra trong audit tracked ở FR-07, không đổi .gitignore. Chỉ planning artifacts/audit được tạo ở lượt này; chưa execute Tasks 1-7.

Khuyến nghị **Native**: 7 bước phụ thuộc tuần tự vào cùng rule, fixture, case IDs và evidence, nên thực hiện trong một session dễ giữ nhất quán. Người dùng cũng có thể chọn **Subagent-driven**, có implementer/reviewer riêng theo task. Theo phần Execution Handoff của skill writing-plans đã được gọi, review plan và chọn cách thực thi trước khi bắt đầu testing; việc lập plan hiện tại không tự cho phép chạy suite hay publish issues.
````

Pending learner review.

## Interaction 2438746c-ffa3-4a03-844a-6030889d096a

```text
{
  "tool": "Codex",
  "task": "FR-07-method-choice",
  "recorded_at": "2026-10-14T00:30:42+07:00",
  "source": "Visible answer text from user to method clarification and verbatim assistant acknowledgment; excludes surrounding structured question payload. Original interaction timestamp and exact model identifier unavailable. User selected methods only; plan approval remains pending.",
  "capture": "partial"
}
```

### Original prompt

```text
sử dụng Domain Testing on/off/in và ISTQB 3-value BVA
```

### Original AI output

```text
Mình đã chốt **Domain Testing on/off/in** và **ISTQB 3-value BVA** theo lựa chọn của bạn. Kế hoạch sẽ giữ phần suy luận riêng cho từng kỹ thuật, rồi hợp nhất test case và bảo toàn mapping coverage. Mình cũng thấy API không đặc tả thao tác sửa/xóa giỏ hàng, còn web dùng state riêng; vì vậy không thể dùng kết quả API thay cho bằng chứng UI.
```

Pending learner review.


## Interaction fr07-exec-task01-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task1-requirements",
  "occurred_at": "2026-10-14T00:39:45+07:00",
  "recorded_at": "2026-10-14T00:43:00+07:00",
  "source": "Inline execution request via executing-plans skill",
  "capture": "full"
}
```

### Original prompt

```text
/executing-plans docs/superpowers/plans/2026-10-14-fr07-shopping-cart-domain-bva.md sử dụng native
```

### Original AI output

```text
Thực thi Task 1: Phân tích requirements.md, thiết lập quy tắc FR07-R01..R08, phụ thuộc FR06-Q, API-AUTH, định nghĩa biến n, q, d, r, id, action, baseline fixtures A/B, và sổ đăng ký điểm mơ hồ AMB-01..AMB-07.
```

Pending learner review.

## Interaction fr07-exec-task02-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task2-domain-testing",
  "occurred_at": "2026-10-14T00:45:10+07:00",
  "recorded_at": "2026-10-14T00:47:00+07:00",
  "source": "Task 2 execution: Domain Testing derivation",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 2: Sinh test case Domain Testing
```

### Original AI output

```text
Hoàn thành Task 2: Mô hình hóa vị từ toán học, phân tích On/Off/In cho số lượng d, trạng thái giỏ n, mặt phẳng gộp dòng q'=q+d, bảng điểm khả thi, và 29 ca kiểm thử nguồn Domain Testing thuộc 8 families (FR07-DT-*).
```

Pending learner review.

## Interaction fr07-exec-task03-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task3-bva",
  "occurred_at": "2026-10-14T00:49:12+07:00",
  "recorded_at": "2026-10-14T00:50:30+07:00",
  "source": "Task 3 execution: BVA 3-value derivation",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 3: Sinh test case BVA
```

### Original AI output

```text
Hoàn thành Task 3: Xác định phân vùng có thứ tự và 2 điểm biên hữu hạn (0 và 1) cho 4 chiều/thao tác (ADD-Q, CART-N, REPEAT-API, REPEAT-WEB), tính tập lân cận 3-value và hợp nhất ra đúng 13 nghĩa vụ giá trị biên, thiết lập 13 ca kiểm thử nguồn BVA (FR07-BVA-*).
```

Pending learner review.

## Interaction fr07-exec-task04-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task4-review-dedup",
  "occurred_at": "2026-10-14T00:52:20+07:00",
  "recorded_at": "2026-10-14T00:55:00+07:00",
  "source": "Task 4 execution: Suite review, deduplication and freezing",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 4: Review + deduplicate + liên kết test case với technique
```

### Original AI output

```text
Hoàn thành Task 4: Xây dựng suite-review.md, bộ kiểm tra tự động validate-suite.cjs, hợp nhất 42 ca nguồn (29 DT + 13 BVA) thành 32 ca chuẩn trong tests/fr07/suite.json, đóng băng suite với SHA-256 hash d5b27da8bc248a71efad036aa879a9a9eeead0ef80ce7c42b2d9f1fc18149e0d.
```

Pending learner review.

## Interaction fr07-exec-task05-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task5-execution",
  "occurred_at": "2026-10-14T01:03:50+07:00",
  "recorded_at": "2026-10-14T01:17:35+07:00",
  "source": "Task 5 execution: Suite execution and evidence collection",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 5: Execute toàn bộ test suite
```

### Original AI output

```text
Hoàn thành Task 5: Xây dựng prepare-environment.cjs, run-cart-api.cjs, run-cart-web.py; chuẩn bị môi trường cô lập tại /private/tmp/eshop-fr07-run; thực thi toàn bộ 32 ca kiểm thử (8 API + 24 WEB); bảo toàn CSDL gốc; thu thập đầy đủ observations.json, manifest.json và 34 ảnh chụp màn hình; kết quả: 13 Passed, 15 Failed, 4 Blocked.
```

Pending learner review.

## Interaction fr07-exec-task06-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task6-results-and-bugs",
  "occurred_at": "2026-10-14T01:18:30+07:00",
  "recorded_at": "2026-10-14T01:20:30+07:00",
  "source": "Task 6 execution: Results recording and defect documentation",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 6: Ghi actual result / pass-fail / bug
```

### Original AI output

```text
Hoàn thành Task 6: Lập bảng kết quả test-results.md chi tiết 32 ca kiểm thử (13 Passed, 15 Failed, 4 Blocked), lập hồ sơ bugs.md ghi nhận 7 lỗi phần mềm chi tiết với minimal reproduction và phân tích mã nguồn gốc, lập tài liệu tổng kết README.md cho FR-07.
```

Pending learner review.

## Interaction fr07-exec-task07-001

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task7-ai-gaps",
  "occurred_at": "2026-10-14T01:21:15+07:00",
  "recorded_at": "2026-10-14T01:22:20+07:00",
  "source": "Task 7 execution: AI gap analysis and critique",
  "capture": "full"
}
```

### Original prompt

```text
Execute Task 7: AI gap analysis
```

### Original AI output

```text
Hoàn thành Task 7 (Phần 1): Lập bảng đối chiếu 5 khoảng trống AI (GAP-01..05) với bằng chứng thực tế, phân tích nguyên nhân cốt lõi (Facts vs Hypotheses), chứng minh vòng lặp khép kín sửa gap, và viết đoạn AI Critique 267 từ (đáp ứng đúng yêu cầu 200-300 từ).
```

Pending learner review.

## Interaction fr07-exec-task07-002

```text
{
  "tool": "Google Antigravity Agentic IDE",
  "model": "Gemini 3.8 Flash (High)",
  "task": "FR-07-task7-commit-log",
  "occurred_at": "2026-10-14T01:24:10+07:00",
  "recorded_at": "2026-10-14T01:24:25+07:00",
  "source": "Task 7 execution: Export real commit log",
  "capture": "full"
}
```

### Original prompt

```text
Export real commit log to commit-log.txt
```

### Original AI output

```text
Hoàn thành Task 7 (Phần 2): Xuất lịch sử commit thực tế của FR-07 vào commit-log.txt với 8 commit tuần tự có timestamp và hash chuẩn xác.
```

Pending learner review.
`````

## 4. FR-15

`````markdown
# AI Audit Report

Draft declaration for learner confirmation: I use AI tools for the tasks recorded below.

Scope: recorded interactions only; session history may be partial. Unknown timestamps/models and partial or summary captures remain explicit. Review decisions do not certify execution results.

Interactions: 10; learner review events: 0.

## Interaction fr15-native-task1

```text
{
  "tool": "Codex",
  "task": "FR15 task1",
  "recorded_at": "2026-10-15T21:39:32+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/requirements.md
# FR-15 — Phân tích requirement

## 1. Test basis và phạm vi

Oracle: README.md FR-15 dòng 191–198; quyền ghi là dependency FR-12 dòng 174–179. Interface: api_specification.md §3.1–3.4 (78–106), login §1.2. Assignment: docs/2026.HW02.Domain Testing_En.pdf §6 (giải thích DT/BVA theo bước), §9–10 (audit/critique), §12 (commit), §14 (submission). AGENTS.md yêu cầu bảo toàn SUT và dữ liệu.

Chỉ Product CRUD trên API và Admin Web; login/category có sẵn là fixture, không kiểm FR12/FR14 toàn bộ. Không import CSV, customer search/format, checkout/mobile. API public GET không bị gán thêm yêu cầu admin.

## 2. Rule register

| Rule | Requirement / oracle | Loại | Interface |
|---|---|---|---|
| FR15-R01 | Admin thêm product, thêm đúng một ID và đọc lại giá trị đã lưu | confirmed CRUD; postcondition derived | POST /api/products; WEB Create |
| FR15-R02 | Admin xem danh sách và product để quản lý; empty list không có bản ghi | confirmed CRUD; postcondition derived | GET /api/products, GET /api/products/:id; WEB list/edit |
| FR15-R03 | Admin sửa product target, giá trị mới đọc lại được | confirmed CRUD; postcondition derived | PUT /api/products/:id; WEB Update |
| FR15-R04 | Admin xóa target; phần còn lại nguyên vẹn | confirmed CRUD; postcondition derived | DELETE /api/products/:id; WEB Delete |
| FR15-R05 | Name bắt buộc, tối đa 255 ký tự | confirmed README:195 | Create + Update; API + WEB |
| FR15-R06 | Price bắt buộc, là số >0 | confirmed README:196 | Create + Update; API + WEB |
| FR15-R07 | Category bắt buộc, chọn từ danh sách có sẵn | confirmed README:197 | Create + Update; API + WEB |
| FR15-R08 | Sửa một product không đổi product khác | confirmed README:198 | Update; API/DB, WEB immediate và reload |
| FR12-DEP-WRITE | JWT hợp lệ và role admin khi POST/PUT/DELETE product | confirmed README:177–179 | Chỉ product mutation API |

## 3. Input / state model

| Input/state | Universe, unit, resolution | Ghi chú |
|---|---|---|
| name, L | Chuỗi; L∈N₀; ASCII fixture bước 1 ký tự | ASCII không giải quyết cách đếm Unicode |
| price p | JSON number, p>0; precision chưa quy định | Integer slice Z chỉ là tập mẫu con; không tự tạo max |
| category_id c | Membership trong Categories; ID mang tính phân loại | {10,20} valid, 15 absent; khoảng [10,20] không valid |
| token/role | admin/user/no-token/invalid-token | Đọc thông qua login chuẩn, không forge role |
| action, target | Create/Read/Update/Delete; A=101,B=202,C=303 | Target vắng không có error contract |
| stored products/categories | Fixture reset trước mỗi case | Đọc snapshot đủ id,name,price,description,imageUrl,category_id |
| description/imageUrl | Nominal được giữ cố định trừ ca sửa từng field | Không tự thêm requiredness, length limit, URL rule |
| time/build | Clock thực ghi UTC+07:00, không có time boundary FR15 | Reset login_attempts/locked_until giữa case nếu phát sinh |

## 4. Fixtures / hậu điều kiện

Nguồn máy đọc: tests/fr15/fixtures.json. Baseline có categories 10/20 và A/B/C khác tên, giá, mô tả; category 15 vắng. Body nominal: name='A'×128, price=100000, category_id=10, description='Nominal description', imageUrl PNG data URL trong fixture. Form mặc định category 1 nên runner luôn chủ động chọn 10/20. Variants: empty-products, single-product (chỉ A), empty-categories (không product/category).

Backend copy dùng seed tài khoản demo của SUT; đăng nhập lấy admin/user token. Không ghi token/password vào evidence. Không reset/reseed DB gốc. Sau startup bản sao đã tạo đủ bảng mới reset product/category bằng transaction; login counters cũng về 0/unlocked. Không kiểm hợp lệ bằng mutation API dùng làm setup vì các API này chính là SUT đang được kiểm thử.

Valid Create: đúng một row mới, field tương ứng payload; row trước không đổi. Valid Update: target đúng payload, mọi field non-target giữ nguyên; UI chỉ so field render, DB/API kiểm đủ field. Valid Delete: target biến mất, non-target nguyên. Invalid validation/auth: từ chối phù hợp, không tạo/sửa/xóa dữ liệu. Chưa có error-code contract nên không hardcode 400/401/403 hay copy lỗi.

## 5. Ambiguity register

| ID | Chưa quy định | Quyết định / tác động |
|---|---|---|
| FR15-AMB-01 | Unicode unit, trim whitespace | Main length dùng ASCII; whitespace/Unicode là probe, không claim complete Unicode coverage |
| FR15-AMB-02 | Precision/upper bound price | p=0 strict reject; Z-slice có BVA hữu hạn, adjacency full price chưa xác định; không đặt 0.01/max |
| FR15-AMB-03 | JSON numeric string từ form, kiểu category ID | Lưu payload thực, so nghĩa nghiệp vụ; không fail chỉ vì '100000' thay 100000 |
| FR15-AMB-04 | PUT có phải partial update | Main suite full body; probe missing field đánh giá requiredness chắc chắn, không đoán PATCH semantics |
| FR15-AMB-05 | Error codes, message copy, schema GET detail | Test hậu điều kiện/rule; unknown code/schema không thành defect riêng |
| FR15-AMB-06 | Target không tồn tại/repeated delete | Characterization; yêu cầu no unrelated mutation là derived, status 404 không tự áp |
| FR15-AMB-07 | Xóa product đã có quan hệ orders/cart | Không tạo quan hệ ngoài scope; hạn chế coverage ghi rõ |
| FR15-AMB-08 | Slide method chưa có trong repo | Fallback On/Off/In + ISTQB 3-value, không xác nhận convention của lớp; phải đối chiếu khi slide được cung cấp |

## 6. Phương pháp, trace và trạng thái ban đầu

DT: predicates → miền/bù → interior → equality surface → On/Off/In → separated samples → corners/interactions → nghĩa vụ → cases. BVA: universe/resolution → ordered partitions cả invalid → endpoints → predecessor/successor → union dedup → payload nominal → coverage.

Name partitions {0},[1,255],[256,∞); price Z-slice (-∞,0],[1,∞). Category/auth là partitions categorical, không thuộc BVA. DT giữ điều kiện khác valid để cô lập rule; các multi-fault chỉ là interaction bổ sung.

Oracle status confirmed/derived/unresolved; cases chưa chạy Not Run, actual=null, evidence=[]. Source IDs DT/BVA/SUP và canonical TC không đồng nhất. Coverage thiết kế khác coverage thực thi; testcase không tự tạo pass/fail.

Learner technical review: Pending. Người dùng đã chọn Native để thực hiện plan; điều đó không chứng nhận kết quả kiểm thử. Không xác nhận group allocation, tự đánh giá, demo URL, GitHub issue hoặc deadline Moodle.


tests/fr15/fixtures.json
Artifact SHA256=62b2323befc25fb61f4707358174db6bef97b20b58fbd31b55746ac9c0a0c9cf
```

Pending learner review.

## Interaction fr15-native-task2

```text
{
  "tool": "Codex",
  "task": "FR15 task2",
  "recorded_at": "2026-10-15T22:01:30+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/domain-model.md
# FR-15 — Domain Testing theo từng bước

## Bước 1: từ requirement thành predicate

Test basis và ambiguities: requirements.md. Trên payload có đủ trường và đúng dạng: N=(1≤L≤255), P=(p>0), C=(c∈Categories), A=(JWT valid ∧ role=admin), E=(target tồn tại). D_Create=A∧N∧P∧C; D_Update=A∧N∧P∧C∧E. Complement: ¬A∨¬N∨¬P∨¬C (thêm ¬E cho Update). Không dùng Update target vắng để đánh giá name/price validation. Missing/null/type mismatch nằm ngoài lát cắt chính, được xét requiredness riêng.

Read domain là list empty/nonempty hoặc target tồn tại/vắng; Delete domain là target trong tập một/nhiều product. Quyền ghi là domain categorical admin/user/none/invalid. Không dùng N/P của body để xét Read/Delete.

## Bước 2: phân miền và biên

Name: {0} invalid, [1,255] valid, [256,∞) invalid. Giá: p≤0 invalid, p>0 valid, equality surface p=0 bị loại. Categories membership: 10/20 valid, 15 absent invalid, omitted/null invalid; không có khoảng ID hay BVA category. Auth categorical: chỉ admin JWT hợp lệ được mutate. Miền chấp nhận có các mặt độc lập, không tự giả một biên nghiêng L+p=k.

## Bước 3: interior và fixture

Interior (128,100000,10,admin) là valid. Update dùng target A=101 và B/C làm controls; case B=202 có A/C controls. Sản phẩm phân biệt tên/giá/category/description. Every case resets baseline; description/imageUrl nominal trừ field-specific Update. Steps cụ thể nằm cùng ID trong source JSON: reset → snapshot → thao tác API hoặc UI → capture → compare. Tọa độ L chỉ dùng ASCII; code point/UTF16/grapheme của Unicode chưa được đồng nhất.

## Bước 4: On/Off/In, đánh giá chân lý

L=1 là On mặt lower included; Off 0 reject/2 accept. L=255 On included; Off 254 accept/256 reject. p=0 On excluded, ±1 là probe biểu diễn được trên integer slice, không phải nearest trên toàn miền giá chưa rõ resolution. Interior p=100000. Category/auth không có nhãn On/Off số học.

| L | p | N | P | C | A | Create | Update E=true | Vai trò |
|---|---|---|---|---|---|---|---|---|
| 128 | 100000 | True | True | true | true | accept | accept | In |
| 0 | 100000 | False | True | true | true | reject | reject | lower off outside |
| 1 | 100000 | True | True | true | true | accept | accept | lower on |
| 2 | 100000 | True | True | true | true | accept | accept | lower off inside |
| 254 | 100000 | True | True | true | true | accept | accept | upper off inside |
| 255 | 100000 | True | True | true | true | accept | accept | upper on |
| 256 | 100000 | False | True | true | true | reject | reject | upper off outside |
| 128 | -1 | True | False | true | true | reject | reject | price off outside |
| 128 | 0 | True | False | true | true | reject | reject | price on excluded |
| 128 | 1 | True | True | true | true | accept | accept | price off inside |
| 254 | 1 | True | True | true | true | accept | accept | separated/corner |
| 255 | 1 | True | True | true | true | accept | accept | separated/corner |
| 256 | 1 | False | True | true | true | reject | reject | separated/corner |
| 1 | -1 | True | False | true | true | reject | reject | separated/corner |
| 1 | 0 | True | False | true | true | reject | reject | separated/corner |
| 1 | 1 | True | True | true | true | accept | accept | separated/corner |
| 255 | -1 | True | False | true | true | reject | reject | separated/corner |
| 255 | 0 | True | False | true | true | reject | reject | separated/corner |
| 0 | 1 | False | True | true | true | reject | reject | separated/corner |
| 256 | 0 | False | False | true | true | reject | reject | separated/corner |

## Bước 5: separated samples, corners và fault isolation

Mặt L=255 lấy p=1 và 100000, mỗi điểm đi qua L=254/255/256. Mặt p=0 lấy L=1/128/255, perturb p=-1/0/1. Điều kiện C/A/E giữ true; case ghi toàn bộ predicate trong obligation point. Góc (1,0),(255,0) reject do P; (1,1),(255,1) accept; (0,1),(256,1) reject do N. (256,0) multi-fault, không thay thế single-fault coverage. Đây là sampling có chủ đích, không chứng minh exhaustive hay phát hiện mọi tilted/omitted boundary.

## Bước 6: CRUD postcondition và interactions trạng thái

Create tăng count đúng 1, read-back đúng input; Update thay đúng target, DB full-field và UI rendered-field non-target nguyên ngay sau save rồi sau reload. Field-specific updates kiểm cả retained target fields. Delete đúng target ở tập nhiều product và product cuối; Read so list/detail với snapshot. Main validation lặp Create/Update và API/WEB; invalid category/nonnumeric/omitted/null không tạo được qua UI bình thường nằm API. Empty category list được thử trên WEB/API. Category chọn 20 chống test chỉ default. Auth thử 3 nhóm invalid × C/U/D trên API.

## Bước 7: traceability và coverage

Mỗi row obligations.json có ID, sourceCaseId, layer/action, rule, point/rationale/oracle. Domain-cases.md và source JSON là thiết kế ban đầu Not Run. Số nghĩa vụ là số ID distinct của từng technique; denominator gồm cả validation partition, point/surface/corner, operation/state đã liệt kê, tách supplementary. Designed coverage = mapped obligations / identified obligations; executed coverage chưa có, không suy pass/fail từ predicate kỳ vọng. Category/auth là domain partitions, không được cộng BVA. Unresolved probes (precision/trim/Unicode/missing target error contract) có ghi observation nhưng không có oracle đủ để verdict toàn case.

Phương pháp là fallback từ skills khi chưa có slide lớp. Learner review Pending; không claim đã được sinh viên xác nhận.


docs/testing/fr15/domain-cases.md
# FR-15 — Domain source cases và supplementary partitions

Full materialized payload, preconditions and steps per ID: `tests/fr15/source-cases.json`; fixture values: `tests/fr15/fixtures.json`. Each row below is a design record; actual remains null and evidence empty until execution overlay.

| ID | Layer/action | Fixture/input | Rule / obligation | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|
| FR15-DT-001 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R01 / FR15-OBL-DT-001 | accept: Interior / valid nominal CRUD | null | Not Run | [] |
| FR15-DT-002 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-002 | reject: Name single-boundary L=0; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-003 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-003 | accept: Name single-boundary L=1; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-004 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-004 | accept: Name single-boundary L=2; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-005 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-005 | accept: Name single-boundary L=254; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-006 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-006 | accept: Name single-boundary L=255; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-007 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-007 | reject: Name single-boundary L=256; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-008 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-DT-008 | reject: Price boundary p=-1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-009 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-DT-009 | reject: Price boundary p=0; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-010 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-DT-010 | accept: Price boundary p=1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-011 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-011 | accept: Separated surface/corner L=254,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-012 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-012 | accept: Separated surface/corner L=255,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-013 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-013 | reject: Separated surface/corner L=256,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-014 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-014 | reject: Separated surface/corner L=1,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-015 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-015 | reject: Separated surface/corner L=1,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-016 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-016 | accept: Separated surface/corner L=1,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-017 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-017 | reject: Separated surface/corner L=255,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-018 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-018 | reject: Separated surface/corner L=255,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-019 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-019 | reject: Separated surface/corner L=0,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-020 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-020 | reject: Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage | null | Not Run | [] |
| FR15-DT-021 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=20 | FR15-R07 / FR15-OBL-DT-021 | accept: Category second existing member 20 | null | Not Run | [] |
| FR15-DT-022 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-022 | reject: Required price empty | null | Not Run | [] |
| FR15-DT-023 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=15 | FR15-R07 / FR15-OBL-DT-023 | reject: Category absent member 15, not an ordered ID boundary | null | Not Run | [] |
| FR15-DT-024 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p='abc'; c=10 | FR15-R06 / FR15-OBL-DT-024 | reject: Price non-numeric string | null | Not Run | [] |
| FR15-DT-025 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-025 | reject: Required name omitted | null | Not Run | [] |
| FR15-DT-026 | API/Create | fixture=baseline; target=101; auth=admin; name=None; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-026 | reject: Required name null | null | Not Run | [] |
| FR15-DT-027 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-027 | reject: Required name empty | null | Not Run | [] |
| FR15-DT-028 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p='<omitted>'; c=10 | FR15-R06 / FR15-OBL-DT-028 | reject: Required price omitted | null | Not Run | [] |
| FR15-DT-029 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=None; c=10 | FR15-R06 / FR15-OBL-DT-029 | reject: Required price null | null | Not Run | [] |
| FR15-DT-030 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-030 | reject: Required price empty | null | Not Run | [] |
| FR15-DT-031 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c='<omitted>' | FR15-R07 / FR15-OBL-DT-031 | reject: Required category_id omitted | null | Not Run | [] |
| FR15-DT-032 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=None | FR15-R07 / FR15-OBL-DT-032 | reject: Required category_id null | null | Not Run | [] |
| FR15-DT-033 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c='' | FR15-R07 / FR15-OBL-DT-033 | reject: Required category_id empty | null | Not Run | [] |
| FR15-SUP-001 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0.5; c=10 | FR15-R06 / FR15-OBL-SUP-001 | observe: Fractional positive price characterization; precision unresolved | null | Not Run | [] |
| FR15-SUP-002 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 3; p=100000; c=10 | FR15-R05 / FR15-OBL-SUP-002 | observe: Whitespace name characterization; trim undefined | null | Not Run | [] |
| FR15-SUP-003 | API/Create | fixture=baseline; target=101; auth=admin; name='😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀; p=100000; c=10 | FR15-R05 / FR15-OBL-SUP-003 | observe: Unicode emoji name characterization; length unit undefined | null | Not Run | [] |
| FR15-DT-034 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-034 | accept: Interior / valid nominal CRUD | null | Not Run | [] |
| FR15-DT-035 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-035 | reject: Name single-boundary L=0; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-036 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-036 | accept: Name single-boundary L=1; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-037 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-037 | accept: Name single-boundary L=2; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-038 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-038 | accept: Name single-boundary L=254; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-039 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-039 | accept: Name single-boundary L=255; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-040 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-040 | reject: Name single-boundary L=256; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-041 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-DT-041 | reject: Price boundary p=-1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-042 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-DT-042 | reject: Price boundary p=0; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-043 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-DT-043 | accept: Price boundary p=1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-044 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-044 | accept: Separated surface/corner L=254,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-045 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-045 | accept: Separated surface/corner L=255,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-046 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-046 | reject: Separated surface/corner L=256,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-047 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-047 | reject: Separated surface/corner L=1,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-048 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-048 | reject: Separated surface/corner L=1,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-049 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-049 | accept: Separated surface/corner L=1,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-050 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-050 | reject: Separated surface/corner L=255,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-051 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-051 | reject: Separated surface/corner L=255,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-052 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-052 | reject: Separated surface/corner L=0,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-053 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-053 | reject: Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage | null | Not Run | [] |
| FR15-DT-054 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=20 | FR15-R07 / FR15-OBL-DT-054 | accept: Category second existing member 20 | null | Not Run | [] |
| FR15-DT-055 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-055 | reject: Required price empty | null | Not Run | [] |
| FR15-DT-056 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=15 | FR15-R07 / FR15-OBL-DT-056 | reject: Category absent member 15, not an ordered ID boundary | null | Not Run | [] |
| FR15-DT-057 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p='abc'; c=10 | FR15-R06 / FR15-OBL-DT-057 | reject: Price non-numeric string | null | Not Run | [] |
| FR15-DT-058 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-058 | reject: Required name omitted | null | Not Run | [] |
| FR15-DT-059 | API/Update | fixture=baseline; target=101; auth=admin; name=None; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-059 | reject: Required name null | null | Not Run | [] |
| FR15-DT-060 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-060 | reject: Required name empty | null | Not Run | [] |
| FR15-DT-061 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p='<omitted>'; c=10 | FR15-R06 / FR15-OBL-DT-061 | reject: Required price omitted | null | Not Run | [] |
| FR15-DT-062 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=None; c=10 | FR15-R06 / FR15-OBL-DT-062 | reject: Required price null | null | Not Run | [] |
| FR15-DT-063 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-063 | reject: Required price empty | null | Not Run | [] |
| FR15-DT-064 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c='<omitted>' | FR15-R07 / FR15-OBL-DT-064 | reject: Required category_id omitted | null | Not Run | [] |
| FR15-DT-065 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=None | FR15-R07 / FR15-OBL-DT-065 | reject: Required category_id null | null | Not Run | [] |
| FR15-DT-066 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c='' | FR15-R07 / FR15-OBL-DT-066 | reject: Required category_id empty | null | Not Run | [] |
| FR15-SUP-004 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0.5; c=10 | FR15-R06 / FR15-OBL-SUP-004 | observe: Fractional positive price characterization; precision unresolved | null | Not Run | [] |
| FR15-SUP-005 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 3; p=100000; c=10 | FR15-R05 / FR15-OBL-SUP-005 | observe: Whitespace name characterization; trim undefined | null | Not Run | [] |
| FR15-SUP-006 | API/Update | fixture=baseline; target=101; auth=admin; name='😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀; p=100000; c=10 | FR15-R05 / FR15-OBL-SUP-006 | observe: Unicode emoji name characterization; length unit undefined | null | Not Run | [] |
| FR15-DT-067 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R01 / FR15-OBL-DT-067 | accept: Interior / valid nominal CRUD | null | Not Run | [] |
| FR15-DT-068 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-068 | reject: Name single-boundary L=0; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-069 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-069 | accept: Name single-boundary L=1; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-070 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-070 | accept: Name single-boundary L=2; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-071 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-071 | accept: Name single-boundary L=254; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-072 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-072 | accept: Name single-boundary L=255; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-073 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-073 | reject: Name single-boundary L=256; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-074 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-DT-074 | reject: Price boundary p=-1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-075 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-DT-075 | reject: Price boundary p=0; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-076 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-DT-076 | accept: Price boundary p=1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-077 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-077 | accept: Separated surface/corner L=254,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-078 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-078 | accept: Separated surface/corner L=255,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-079 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-079 | reject: Separated surface/corner L=256,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-080 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-080 | reject: Separated surface/corner L=1,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-081 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-081 | reject: Separated surface/corner L=1,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-082 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-082 | accept: Separated surface/corner L=1,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-083 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-083 | reject: Separated surface/corner L=255,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-084 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-084 | reject: Separated surface/corner L=255,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-085 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-085 | reject: Separated surface/corner L=0,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-086 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-086 | reject: Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage | null | Not Run | [] |
| FR15-DT-087 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=20 | FR15-R07 / FR15-OBL-DT-087 | accept: Category second existing member 20 | null | Not Run | [] |
| FR15-DT-088 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-088 | reject: Required price empty | null | Not Run | [] |
| FR15-SUP-007 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0.5; c=10 | FR15-R06 / FR15-OBL-SUP-007 | observe: Fractional positive price characterization; precision unresolved | null | Not Run | [] |
| FR15-DT-089 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-089 | accept: Interior / valid nominal CRUD | null | Not Run | [] |
| FR15-DT-090 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-090 | reject: Name single-boundary L=0; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-091 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-091 | accept: Name single-boundary L=1; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-092 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-092 | accept: Name single-boundary L=2; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-093 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-093 | accept: Name single-boundary L=254; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-094 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-094 | accept: Name single-boundary L=255; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-095 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-DT-095 | reject: Name single-boundary L=256; hold price/category/auth valid | null | Not Run | [] |
| FR15-DT-096 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-DT-096 | reject: Price boundary p=-1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-097 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-DT-097 | reject: Price boundary p=0; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-098 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-DT-098 | accept: Price boundary p=1; strict zero excludes equality | null | Not Run | [] |
| FR15-DT-099 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-099 | accept: Separated surface/corner L=254,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-100 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-100 | accept: Separated surface/corner L=255,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-101 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-101 | reject: Separated surface/corner L=256,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-102 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-102 | reject: Separated surface/corner L=1,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-103 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-103 | reject: Separated surface/corner L=1,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-104 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-104 | accept: Separated surface/corner L=1,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-105 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=-1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-105 | reject: Separated surface/corner L=255,p=-1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-106 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-106 | reject: Separated surface/corner L=255,p=0; evaluate both predicates | null | Not Run | [] |
| FR15-DT-107 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=1; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-107 | reject: Separated surface/corner L=0,p=1; evaluate both predicates | null | Not Run | [] |
| FR15-DT-108 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=0; c=10 | FR15-R05,FR15-R06 / FR15-OBL-DT-108 | reject: Separated surface/corner L=256,p=0; multi-fault, not single-rule coverage | null | Not Run | [] |
| FR15-DT-109 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=20 | FR15-R07 / FR15-OBL-DT-109 | accept: Category second existing member 20 | null | Not Run | [] |
| FR15-DT-110 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=''; c=10 | FR15-R06 / FR15-OBL-DT-110 | reject: Required price empty | null | Not Run | [] |
| FR15-SUP-008 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0.5; c=10 | FR15-R06 / FR15-OBL-SUP-008 | observe: Fractional positive price characterization; precision unresolved | null | Not Run | [] |
| FR15-DT-111 | API/Read | fixture=empty-products; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-111 | accept: Read list in empty-products | null | Not Run | [] |
| FR15-DT-112 | API/Read | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-112 | accept: Read list in baseline | null | Not Run | [] |
| FR15-DT-113 | API/Read | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-113 | accept: Read detail target 101 | null | Not Run | [] |
| FR15-DT-114 | API/Read | fixture=baseline; target=202; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-114 | accept: Read detail target 202 | null | Not Run | [] |
| FR15-DT-115 | API/Delete | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R04 / FR15-OBL-DT-115 | accept: Delete target 101 in baseline; retain all other IDs | null | Not Run | [] |
| FR15-DT-116 | API/Delete | fixture=single-product; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R04 / FR15-OBL-DT-116 | accept: Delete target 101 in single-product; retain all other IDs | null | Not Run | [] |
| FR15-DT-117 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-117 | accept: Update only field name; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-118 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=123456; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-118 | accept: Update only field price; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-119 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-119 | accept: Update only field description; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-120 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-120 | accept: Update only field imageUrl; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-121 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=20 | FR15-R03,FR15-R08 / FR15-OBL-DT-121 | accept: Update only field category_id; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-122 | API/Update | fixture=baseline; target=202; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-122 | accept: Update target B (202), contrast A/C | null | Not Run | [] |
| FR15-DT-123 | WEB/Read | fixture=empty-products; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-123 | accept: Read list in empty-products | null | Not Run | [] |
| FR15-DT-124 | WEB/Read | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-DT-124 | accept: Read list in baseline | null | Not Run | [] |
| FR15-DT-125 | WEB/Delete | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R04 / FR15-OBL-DT-125 | accept: Delete target 101 in baseline; retain all other IDs | null | Not Run | [] |
| FR15-DT-126 | WEB/Delete | fixture=single-product; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R04 / FR15-OBL-DT-126 | accept: Delete target 101 in single-product; retain all other IDs | null | Not Run | [] |
| FR15-DT-127 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-127 | accept: Update only field name; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-128 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=123456; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-128 | accept: Update only field price; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-129 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-129 | accept: Update only field description; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-130 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-130 | accept: Update only field imageUrl; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-131 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 9; p=100000; c=20 | FR15-R03,FR15-R08 / FR15-OBL-DT-131 | accept: Update only field category_id; preserve others and all non-targets | null | Not Run | [] |
| FR15-DT-132 | WEB/Update | fixture=baseline; target=202; auth=admin; name=ASCII length 9; p=100000; c=10 | FR15-R03,FR15-R08 / FR15-OBL-DT-132 | accept: Update target B (202), contrast A/C | null | Not Run | [] |
| FR15-DT-133 | API/Create | fixture=baseline; target=101; auth=none; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-133 | reject: Unauthorized none must not mutate products | null | Not Run | [] |
| FR15-DT-134 | API/Create | fixture=baseline; target=101; auth=invalid; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-134 | reject: Unauthorized invalid must not mutate products | null | Not Run | [] |
| FR15-DT-135 | API/Create | fixture=baseline; target=101; auth=user; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-135 | reject: Unauthorized user must not mutate products | null | Not Run | [] |
| FR15-DT-136 | API/Update | fixture=baseline; target=101; auth=none; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-136 | reject: Unauthorized none must not mutate products | null | Not Run | [] |
| FR15-DT-137 | API/Update | fixture=baseline; target=101; auth=invalid; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-137 | reject: Unauthorized invalid must not mutate products | null | Not Run | [] |
| FR15-DT-138 | API/Update | fixture=baseline; target=101; auth=user; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-138 | reject: Unauthorized user must not mutate products | null | Not Run | [] |
| FR15-DT-139 | API/Delete | fixture=baseline; target=101; auth=none; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-139 | reject: Unauthorized none must not mutate products | null | Not Run | [] |
| FR15-DT-140 | API/Delete | fixture=baseline; target=101; auth=invalid; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-140 | reject: Unauthorized invalid must not mutate products | null | Not Run | [] |
| FR15-DT-141 | API/Delete | fixture=baseline; target=101; auth=user; name=ASCII length 128; p=100000; c=10 | FR12-DEP-WRITE / FR15-OBL-DT-141 | reject: Unauthorized user must not mutate products | null | Not Run | [] |
| FR15-DT-142 | WEB/Create | fixture=empty-categories; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R07 / FR15-OBL-DT-142 | reject: No categories: reject creation despite valid name/price | null | Not Run | [] |
| FR15-DT-143 | API/Create | fixture=empty-categories; target=101; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R07 / FR15-OBL-DT-143 | reject: No categories: category 10 is not an existing member | null | Not Run | [] |
| FR15-SUP-009 | API/Read | fixture=baseline; target=999999; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R02 / FR15-OBL-SUP-009 | observe: Missing target characterization; exact response not specified | null | Not Run | [] |
| FR15-SUP-010 | API/Update | fixture=baseline; target=999999; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R03 / FR15-OBL-SUP-010 | observe: Missing target characterization; exact response not specified | null | Not Run | [] |
| FR15-SUP-011 | API/Delete | fixture=baseline; target=999999; auth=admin; name=ASCII length 128; p=100000; c=10 | FR15-R04 / FR15-OBL-SUP-011 | observe: Missing target characterization; exact response not specified | null | Not Run | [] |


tests/fr15/source-cases.json
Artifact SHA256=06354d9cf725317c628236ba7ca4ef0a6bb9f5702a9cd28e9a02876aa3c01ac7

tests/fr15/obligations.json
Artifact SHA256=3503a276894d92a3705e5c64d6b88e07831ba61b180e7ae3e004af9a39b27cf0
```

Pending learner review.

## Interaction fr15-native-task3

```text
{
  "tool": "Codex",
  "task": "FR15 task3",
  "recorded_at": "2026-10-15T22:05:35+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/bva-report.md
# FR-15 — BVA từng bước

## Bước 1: test basis, variant và universe

R05/R06 từ requirements.md. Chưa có slide; dùng fallback ISTQB 3-value theo .agents/skills/boundary-value-analysis/references/bva-methods.md; không tự nhận convention lớp. Các partition categorical category/auth không có BVA. Name dùng ASCII, universe L∈N₀, bước 1; price chỉ phân tích adjacency trên Z-slice, toàn miền chưa biết precision. Không dùng UI step/DB INTEGER làm requirement.

## Bước 2: ordered partitions và endpoints

| Dimension | Partition invalid thấp | Valid | Invalid cao | Endpoints hữu hạn |
|---|---|---|---|---|
| Name length | {0} | [1,255] | [256,∞) | 0,1,255,256 |
| Price Z-slice | (-∞,0] | [1,∞) | không có cận trên spec | 0,1 |

Không thể tạo chuỗi dài -1; infinity không phải boundary value hữu hạn. Strict p>0 nghĩa là 0 invalid, giá nguyên hợp lệ thấp nhất trên lát cắt là 1.

## Bước 3: tạo neighbor từng endpoint, chưa gộp

| Dimension | Endpoint | Predecessor / endpoint / successor khả thi |
|---|---|---|
| Name | 0 | 0,1 (−1 ngoài universe) |
| Name | 1 | 0,1,2 |
| Name | 255 | 254,255,256 |
| Name | 256 | 255,256,257 |
| Price Z-slice | 0 | -1,0,1 |
| Price Z-slice | 1 | 0,1,2 |

## Bước 4: union và oracle

Name union {0,1,2,254,255,256,257}: 7 values/action/layer. 0/256/257 reject; 1/2/254/255 accept. Price Z union {-1,0,1,2}: 4 values/action/layer; -1/0 reject, 1/2 accept. Chỉ lấy ba điểm quanh p=0 sẽ thiếu 2 theo variant này; chỉ dùng valid endpoints name sẽ thiếu 257.

Không có nearest real/decimal neighbor khi precision chưa được contract xác định. ±1 không chứng minh coverage toàn miền giá; 0.5 chỉ probe precision, không thêm 0.01 hoặc max giả. Unicode được giữ trong supplementary, chưa giải quyết codepoint/UTF16/grapheme.

## Bước 5: materialize và giữ nominal

Name='A'×L đã lưu nguyên chuỗi trong source-cases.json, kiểm len ASCII trước execution; khi test name, p=100000. Khi test price, L=128. Category10, JWT admin, target A tồn tại và B/C controls cho Update. Duplicates với DT chỉ gộp ở Task4 theo cùng layer/action/fixture/payload/assertions. Mỗi source ID giữ obligation riêng, mapping endpoints không bị mất.

## Bước 6: coverage và giới hạn

Name 7×2 actions×2 layers=28 obligations; price 4×2×2=16 obligations. Tổng 44 BVA obligations hữu hạn, không phải 44 canonical độc lập sau merge. API và WEB mỗi layer 14 name+8 price. Mapped/identified=44/44 thiết kế tại bước này; executed=0/44 vì chưa chạy. WEB có thể HTML-block/truncate: ghi intended vs effective, prevention khác delivery-to-API coverage. Full-price adjacency, Unicode và upper-price limit không thuộc 44 obligations; không claim 100% FR15.

Missing/null/non-numeric/auth/category không được cộng denominator BVA. Phần dưới giữ case Not Run, actual null, evidence []; full preconditions/steps và payload từng ID ở source JSON.

## Bước 7: case nguồn và traceability

Full materialized payload, preconditions and steps per ID: `tests/fr15/source-cases.json`; fixture values: `tests/fr15/fixtures.json`. Each row below is a design record; actual remains null and evidence empty until execution overlay.

| ID | Layer/action | Fixture/input | Rule / obligation | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|---|
| FR15-BVA-001 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-001 | reject: ISTQB 3-value name=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-002 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-002 | accept: ISTQB 3-value name=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-003 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-003 | accept: ISTQB 3-value name=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-004 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-004 | accept: ISTQB 3-value name=254; other inputs nominal | null | Not Run | [] |
| FR15-BVA-005 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-005 | accept: ISTQB 3-value name=255; other inputs nominal | null | Not Run | [] |
| FR15-BVA-006 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-006 | reject: ISTQB 3-value name=256; other inputs nominal | null | Not Run | [] |
| FR15-BVA-007 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 257; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-007 | reject: ISTQB 3-value name=257; other inputs nominal | null | Not Run | [] |
| FR15-BVA-008 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-BVA-008 | reject: ISTQB 3-value price=-1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-009 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-BVA-009 | reject: ISTQB 3-value price=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-010 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-BVA-010 | accept: ISTQB 3-value price=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-011 | API/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=2; c=10 | FR15-R06 / FR15-OBL-BVA-011 | accept: ISTQB 3-value price=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-012 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-012 | reject: ISTQB 3-value name=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-013 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-013 | accept: ISTQB 3-value name=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-014 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-014 | accept: ISTQB 3-value name=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-015 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-015 | accept: ISTQB 3-value name=254; other inputs nominal | null | Not Run | [] |
| FR15-BVA-016 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-016 | accept: ISTQB 3-value name=255; other inputs nominal | null | Not Run | [] |
| FR15-BVA-017 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-017 | reject: ISTQB 3-value name=256; other inputs nominal | null | Not Run | [] |
| FR15-BVA-018 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 257; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-018 | reject: ISTQB 3-value name=257; other inputs nominal | null | Not Run | [] |
| FR15-BVA-019 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-BVA-019 | reject: ISTQB 3-value price=-1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-020 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-BVA-020 | reject: ISTQB 3-value price=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-021 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-BVA-021 | accept: ISTQB 3-value price=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-022 | API/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=2; c=10 | FR15-R06 / FR15-OBL-BVA-022 | accept: ISTQB 3-value price=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-023 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-023 | reject: ISTQB 3-value name=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-024 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-024 | accept: ISTQB 3-value name=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-025 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-025 | accept: ISTQB 3-value name=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-026 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-026 | accept: ISTQB 3-value name=254; other inputs nominal | null | Not Run | [] |
| FR15-BVA-027 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-027 | accept: ISTQB 3-value name=255; other inputs nominal | null | Not Run | [] |
| FR15-BVA-028 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-028 | reject: ISTQB 3-value name=256; other inputs nominal | null | Not Run | [] |
| FR15-BVA-029 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 257; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-029 | reject: ISTQB 3-value name=257; other inputs nominal | null | Not Run | [] |
| FR15-BVA-030 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-BVA-030 | reject: ISTQB 3-value price=-1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-031 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-BVA-031 | reject: ISTQB 3-value price=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-032 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-BVA-032 | accept: ISTQB 3-value price=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-033 | WEB/Create | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=2; c=10 | FR15-R06 / FR15-OBL-BVA-033 | accept: ISTQB 3-value price=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-034 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 0; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-034 | reject: ISTQB 3-value name=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-035 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 1; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-035 | accept: ISTQB 3-value name=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-036 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 2; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-036 | accept: ISTQB 3-value name=2; other inputs nominal | null | Not Run | [] |
| FR15-BVA-037 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 254; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-037 | accept: ISTQB 3-value name=254; other inputs nominal | null | Not Run | [] |
| FR15-BVA-038 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 255; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-038 | accept: ISTQB 3-value name=255; other inputs nominal | null | Not Run | [] |
| FR15-BVA-039 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 256; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-039 | reject: ISTQB 3-value name=256; other inputs nominal | null | Not Run | [] |
| FR15-BVA-040 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 257; p=100000; c=10 | FR15-R05 / FR15-OBL-BVA-040 | reject: ISTQB 3-value name=257; other inputs nominal | null | Not Run | [] |
| FR15-BVA-041 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=-1; c=10 | FR15-R06 / FR15-OBL-BVA-041 | reject: ISTQB 3-value price=-1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-042 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=0; c=10 | FR15-R06 / FR15-OBL-BVA-042 | reject: ISTQB 3-value price=0; other inputs nominal | null | Not Run | [] |
| FR15-BVA-043 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=1; c=10 | FR15-R06 / FR15-OBL-BVA-043 | accept: ISTQB 3-value price=1; other inputs nominal | null | Not Run | [] |
| FR15-BVA-044 | WEB/Update | fixture=baseline; target=101; auth=admin; name=ASCII length 128; p=2; c=10 | FR15-R06 / FR15-OBL-BVA-044 | accept: ISTQB 3-value price=2; other inputs nominal | null | Not Run | [] |


tests/fr15/source-cases.json
Artifact SHA256=1b5a5938fdfec378419deb3ff4afa2a3227bfbb69504028ab1204c009dbbeb27

tests/fr15/obligations.json
Artifact SHA256=f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305
```

Pending learner review.

## Interaction fr15-native-task4

```text
{
  "tool": "Codex",
  "task": "FR15 task4",
  "recorded_at": "2026-10-15T22:07:22+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/suite-review.md
# FR15 — Suite review / freeze

Review: AI self-review. Learner technical review: Pending. Original source IDs and obligation mappings preserved.

Dedup key: layer/action/preconditions/fixture/input/steps/expected outcome+stateContract. Description wording is explanatory, not an assertion; merged cases retain all source rationales in source JSON. Different layers/actions never merge.

Corrections / preventive review: added empty-category membership in design; name boundary includes 257; price only Z slice; non-target UI before reload distinct from DB; no delete dialog invented. These are design decisions, not claims of learner corrections or discovered SUT bugs.

Sources=198; canonical=158; obligations=198. Layer counts: {'API': 97, 'WEB': 61}.

Harness TDD: initial valid-suite assertion failed with validator not implemented; implementation then verified with six acceptance/rejection checks. Frozen actual=null, status=Not Run, evidence=[].

| File | SHA256 |
|---|---|
| tests/fr15/suite.json | bb96a06dcfc27932a310f60a24b40108446a9fe95fb262de6906bab3232b0901 |
| tests/fr15/source-cases.json | 1b5a5938fdfec378419deb3ff4afa2a3227bfbb69504028ab1204c009dbbeb27 |
| tests/fr15/obligations.json | f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305 |

| Canonical | Layer/action | Sources | Techniques | Obligations |
|---|---|---|---|---|
| FR15-TC-001 | API/Create | FR15-DT-001 | Domain Testing | FR15-OBL-DT-001 |
| FR15-TC-002 | API/Create | FR15-DT-002,FR15-DT-027,FR15-BVA-001 | Domain Testing,BVA | FR15-OBL-DT-002,FR15-OBL-DT-027,FR15-OBL-BVA-001 |
| FR15-TC-003 | API/Create | FR15-DT-003,FR15-BVA-002 | Domain Testing,BVA | FR15-OBL-DT-003,FR15-OBL-BVA-002 |
| FR15-TC-004 | API/Create | FR15-DT-004,FR15-BVA-003 | Domain Testing,BVA | FR15-OBL-DT-004,FR15-OBL-BVA-003 |
| FR15-TC-005 | API/Create | FR15-DT-005,FR15-BVA-004 | Domain Testing,BVA | FR15-OBL-DT-005,FR15-OBL-BVA-004 |
| FR15-TC-006 | API/Create | FR15-DT-006,FR15-BVA-005 | Domain Testing,BVA | FR15-OBL-DT-006,FR15-OBL-BVA-005 |
| FR15-TC-007 | API/Create | FR15-DT-007,FR15-BVA-006 | Domain Testing,BVA | FR15-OBL-DT-007,FR15-OBL-BVA-006 |
| FR15-TC-008 | API/Create | FR15-DT-008,FR15-BVA-008 | Domain Testing,BVA | FR15-OBL-DT-008,FR15-OBL-BVA-008 |
| FR15-TC-009 | API/Create | FR15-DT-009,FR15-BVA-009 | Domain Testing,BVA | FR15-OBL-DT-009,FR15-OBL-BVA-009 |
| FR15-TC-010 | API/Create | FR15-DT-010,FR15-BVA-010 | Domain Testing,BVA | FR15-OBL-DT-010,FR15-OBL-BVA-010 |
| FR15-TC-011 | API/Create | FR15-DT-011 | Domain Testing | FR15-OBL-DT-011 |
| FR15-TC-012 | API/Create | FR15-DT-012 | Domain Testing | FR15-OBL-DT-012 |
| FR15-TC-013 | API/Create | FR15-DT-013 | Domain Testing | FR15-OBL-DT-013 |
| FR15-TC-014 | API/Create | FR15-DT-014 | Domain Testing | FR15-OBL-DT-014 |
| FR15-TC-015 | API/Create | FR15-DT-015 | Domain Testing | FR15-OBL-DT-015 |
| FR15-TC-016 | API/Create | FR15-DT-016 | Domain Testing | FR15-OBL-DT-016 |
| FR15-TC-017 | API/Create | FR15-DT-017 | Domain Testing | FR15-OBL-DT-017 |
| FR15-TC-018 | API/Create | FR15-DT-018 | Domain Testing | FR15-OBL-DT-018 |
| FR15-TC-019 | API/Create | FR15-DT-019 | Domain Testing | FR15-OBL-DT-019 |
| FR15-TC-020 | API/Create | FR15-DT-020 | Domain Testing | FR15-OBL-DT-020 |
| FR15-TC-021 | API/Create | FR15-DT-021 | Domain Testing | FR15-OBL-DT-021 |
| FR15-TC-022 | API/Create | FR15-DT-022,FR15-DT-030 | Domain Testing | FR15-OBL-DT-022,FR15-OBL-DT-030 |
| FR15-TC-023 | API/Create | FR15-DT-023 | Domain Testing | FR15-OBL-DT-023 |
| FR15-TC-024 | API/Create | FR15-DT-024 | Domain Testing | FR15-OBL-DT-024 |
| FR15-TC-025 | API/Create | FR15-DT-025 | Domain Testing | FR15-OBL-DT-025 |
| FR15-TC-026 | API/Create | FR15-DT-026 | Domain Testing | FR15-OBL-DT-026 |
| FR15-TC-027 | API/Create | FR15-DT-028 | Domain Testing | FR15-OBL-DT-028 |
| FR15-TC-028 | API/Create | FR15-DT-029 | Domain Testing | FR15-OBL-DT-029 |
| FR15-TC-029 | API/Create | FR15-DT-031 | Domain Testing | FR15-OBL-DT-031 |
| FR15-TC-030 | API/Create | FR15-DT-032 | Domain Testing | FR15-OBL-DT-032 |
| FR15-TC-031 | API/Create | FR15-DT-033 | Domain Testing | FR15-OBL-DT-033 |
| FR15-TC-032 | API/Create | FR15-SUP-001 | Supplementary | FR15-OBL-SUP-001 |
| FR15-TC-033 | API/Create | FR15-SUP-002 | Supplementary | FR15-OBL-SUP-002 |
| FR15-TC-034 | API/Create | FR15-SUP-003 | Supplementary | FR15-OBL-SUP-003 |
| FR15-TC-035 | API/Update | FR15-DT-034 | Domain Testing | FR15-OBL-DT-034 |
| FR15-TC-036 | API/Update | FR15-DT-035,FR15-DT-060,FR15-BVA-012 | Domain Testing,BVA | FR15-OBL-DT-035,FR15-OBL-DT-060,FR15-OBL-BVA-012 |
| FR15-TC-037 | API/Update | FR15-DT-036,FR15-BVA-013 | Domain Testing,BVA | FR15-OBL-DT-036,FR15-OBL-BVA-013 |
| FR15-TC-038 | API/Update | FR15-DT-037,FR15-BVA-014 | Domain Testing,BVA | FR15-OBL-DT-037,FR15-OBL-BVA-014 |
| FR15-TC-039 | API/Update | FR15-DT-038,FR15-BVA-015 | Domain Testing,BVA | FR15-OBL-DT-038,FR15-OBL-BVA-015 |
| FR15-TC-040 | API/Update | FR15-DT-039,FR15-BVA-016 | Domain Testing,BVA | FR15-OBL-DT-039,FR15-OBL-BVA-016 |
| FR15-TC-041 | API/Update | FR15-DT-040,FR15-BVA-017 | Domain Testing,BVA | FR15-OBL-DT-040,FR15-OBL-BVA-017 |
| FR15-TC-042 | API/Update | FR15-DT-041,FR15-BVA-019 | Domain Testing,BVA | FR15-OBL-DT-041,FR15-OBL-BVA-019 |
| FR15-TC-043 | API/Update | FR15-DT-042,FR15-BVA-020 | Domain Testing,BVA | FR15-OBL-DT-042,FR15-OBL-BVA-020 |
| FR15-TC-044 | API/Update | FR15-DT-043,FR15-BVA-021 | Domain Testing,BVA | FR15-OBL-DT-043,FR15-OBL-BVA-021 |
| FR15-TC-045 | API/Update | FR15-DT-044 | Domain Testing | FR15-OBL-DT-044 |
| FR15-TC-046 | API/Update | FR15-DT-045 | Domain Testing | FR15-OBL-DT-045 |
| FR15-TC-047 | API/Update | FR15-DT-046 | Domain Testing | FR15-OBL-DT-046 |
| FR15-TC-048 | API/Update | FR15-DT-047 | Domain Testing | FR15-OBL-DT-047 |
| FR15-TC-049 | API/Update | FR15-DT-048 | Domain Testing | FR15-OBL-DT-048 |
| FR15-TC-050 | API/Update | FR15-DT-049 | Domain Testing | FR15-OBL-DT-049 |
| FR15-TC-051 | API/Update | FR15-DT-050 | Domain Testing | FR15-OBL-DT-050 |
| FR15-TC-052 | API/Update | FR15-DT-051 | Domain Testing | FR15-OBL-DT-051 |
| FR15-TC-053 | API/Update | FR15-DT-052 | Domain Testing | FR15-OBL-DT-052 |
| FR15-TC-054 | API/Update | FR15-DT-053 | Domain Testing | FR15-OBL-DT-053 |
| FR15-TC-055 | API/Update | FR15-DT-054 | Domain Testing | FR15-OBL-DT-054 |
| FR15-TC-056 | API/Update | FR15-DT-055,FR15-DT-063 | Domain Testing | FR15-OBL-DT-055,FR15-OBL-DT-063 |
| FR15-TC-057 | API/Update | FR15-DT-056 | Domain Testing | FR15-OBL-DT-056 |
| FR15-TC-058 | API/Update | FR15-DT-057 | Domain Testing | FR15-OBL-DT-057 |
| FR15-TC-059 | API/Update | FR15-DT-058 | Domain Testing | FR15-OBL-DT-058 |
| FR15-TC-060 | API/Update | FR15-DT-059 | Domain Testing | FR15-OBL-DT-059 |
| FR15-TC-061 | API/Update | FR15-DT-061 | Domain Testing | FR15-OBL-DT-061 |
| FR15-TC-062 | API/Update | FR15-DT-062 | Domain Testing | FR15-OBL-DT-062 |
| FR15-TC-063 | API/Update | FR15-DT-064 | Domain Testing | FR15-OBL-DT-064 |
| FR15-TC-064 | API/Update | FR15-DT-065 | Domain Testing | FR15-OBL-DT-065 |
| FR15-TC-065 | API/Update | FR15-DT-066 | Domain Testing | FR15-OBL-DT-066 |
| FR15-TC-066 | API/Update | FR15-SUP-004 | Supplementary | FR15-OBL-SUP-004 |
| FR15-TC-067 | API/Update | FR15-SUP-005 | Supplementary | FR15-OBL-SUP-005 |
| FR15-TC-068 | API/Update | FR15-SUP-006 | Supplementary | FR15-OBL-SUP-006 |
| FR15-TC-069 | WEB/Create | FR15-DT-067 | Domain Testing | FR15-OBL-DT-067 |
| FR15-TC-070 | WEB/Create | FR15-DT-068,FR15-BVA-023 | Domain Testing,BVA | FR15-OBL-DT-068,FR15-OBL-BVA-023 |
| FR15-TC-071 | WEB/Create | FR15-DT-069,FR15-BVA-024 | Domain Testing,BVA | FR15-OBL-DT-069,FR15-OBL-BVA-024 |
| FR15-TC-072 | WEB/Create | FR15-DT-070,FR15-BVA-025 | Domain Testing,BVA | FR15-OBL-DT-070,FR15-OBL-BVA-025 |
| FR15-TC-073 | WEB/Create | FR15-DT-071,FR15-BVA-026 | Domain Testing,BVA | FR15-OBL-DT-071,FR15-OBL-BVA-026 |
| FR15-TC-074 | WEB/Create | FR15-DT-072,FR15-BVA-027 | Domain Testing,BVA | FR15-OBL-DT-072,FR15-OBL-BVA-027 |
| FR15-TC-075 | WEB/Create | FR15-DT-073,FR15-BVA-028 | Domain Testing,BVA | FR15-OBL-DT-073,FR15-OBL-BVA-028 |
| FR15-TC-076 | WEB/Create | FR15-DT-074,FR15-BVA-030 | Domain Testing,BVA | FR15-OBL-DT-074,FR15-OBL-BVA-030 |
| FR15-TC-077 | WEB/Create | FR15-DT-075,FR15-BVA-031 | Domain Testing,BVA | FR15-OBL-DT-075,FR15-OBL-BVA-031 |
| FR15-TC-078 | WEB/Create | FR15-DT-076,FR15-BVA-032 | Domain Testing,BVA | FR15-OBL-DT-076,FR15-OBL-BVA-032 |
| FR15-TC-079 | WEB/Create | FR15-DT-077 | Domain Testing | FR15-OBL-DT-077 |
| FR15-TC-080 | WEB/Create | FR15-DT-078 | Domain Testing | FR15-OBL-DT-078 |
| FR15-TC-081 | WEB/Create | FR15-DT-079 | Domain Testing | FR15-OBL-DT-079 |
| FR15-TC-082 | WEB/Create | FR15-DT-080 | Domain Testing | FR15-OBL-DT-080 |
| FR15-TC-083 | WEB/Create | FR15-DT-081 | Domain Testing | FR15-OBL-DT-081 |
| FR15-TC-084 | WEB/Create | FR15-DT-082 | Domain Testing | FR15-OBL-DT-082 |
| FR15-TC-085 | WEB/Create | FR15-DT-083 | Domain Testing | FR15-OBL-DT-083 |
| FR15-TC-086 | WEB/Create | FR15-DT-084 | Domain Testing | FR15-OBL-DT-084 |
| FR15-TC-087 | WEB/Create | FR15-DT-085 | Domain Testing | FR15-OBL-DT-085 |
| FR15-TC-088 | WEB/Create | FR15-DT-086 | Domain Testing | FR15-OBL-DT-086 |
| FR15-TC-089 | WEB/Create | FR15-DT-087 | Domain Testing | FR15-OBL-DT-087 |
| FR15-TC-090 | WEB/Create | FR15-DT-088 | Domain Testing | FR15-OBL-DT-088 |
| FR15-TC-091 | WEB/Create | FR15-SUP-007 | Supplementary | FR15-OBL-SUP-007 |
| FR15-TC-092 | WEB/Update | FR15-DT-089 | Domain Testing | FR15-OBL-DT-089 |
| FR15-TC-093 | WEB/Update | FR15-DT-090,FR15-BVA-034 | Domain Testing,BVA | FR15-OBL-DT-090,FR15-OBL-BVA-034 |
| FR15-TC-094 | WEB/Update | FR15-DT-091,FR15-BVA-035 | Domain Testing,BVA | FR15-OBL-DT-091,FR15-OBL-BVA-035 |
| FR15-TC-095 | WEB/Update | FR15-DT-092,FR15-BVA-036 | Domain Testing,BVA | FR15-OBL-DT-092,FR15-OBL-BVA-036 |
| FR15-TC-096 | WEB/Update | FR15-DT-093,FR15-BVA-037 | Domain Testing,BVA | FR15-OBL-DT-093,FR15-OBL-BVA-037 |
| FR15-TC-097 | WEB/Update | FR15-DT-094,FR15-BVA-038 | Domain Testing,BVA | FR15-OBL-DT-094,FR15-OBL-BVA-038 |
| FR15-TC-098 | WEB/Update | FR15-DT-095,FR15-BVA-039 | Domain Testing,BVA | FR15-OBL-DT-095,FR15-OBL-BVA-039 |
| FR15-TC-099 | WEB/Update | FR15-DT-096,FR15-BVA-041 | Domain Testing,BVA | FR15-OBL-DT-096,FR15-OBL-BVA-041 |
| FR15-TC-100 | WEB/Update | FR15-DT-097,FR15-BVA-042 | Domain Testing,BVA | FR15-OBL-DT-097,FR15-OBL-BVA-042 |
| FR15-TC-101 | WEB/Update | FR15-DT-098,FR15-BVA-043 | Domain Testing,BVA | FR15-OBL-DT-098,FR15-OBL-BVA-043 |
| FR15-TC-102 | WEB/Update | FR15-DT-099 | Domain Testing | FR15-OBL-DT-099 |
| FR15-TC-103 | WEB/Update | FR15-DT-100 | Domain Testing | FR15-OBL-DT-100 |
| FR15-TC-104 | WEB/Update | FR15-DT-101 | Domain Testing | FR15-OBL-DT-101 |
| FR15-TC-105 | WEB/Update | FR15-DT-102 | Domain Testing | FR15-OBL-DT-102 |
| FR15-TC-106 | WEB/Update | FR15-DT-103 | Domain Testing | FR15-OBL-DT-103 |
| FR15-TC-107 | WEB/Update | FR15-DT-104 | Domain Testing | FR15-OBL-DT-104 |
| FR15-TC-108 | WEB/Update | FR15-DT-105 | Domain Testing | FR15-OBL-DT-105 |
| FR15-TC-109 | WEB/Update | FR15-DT-106 | Domain Testing | FR15-OBL-DT-106 |
| FR15-TC-110 | WEB/Update | FR15-DT-107 | Domain Testing | FR15-OBL-DT-107 |
| FR15-TC-111 | WEB/Update | FR15-DT-108 | Domain Testing | FR15-OBL-DT-108 |
| FR15-TC-112 | WEB/Update | FR15-DT-109 | Domain Testing | FR15-OBL-DT-109 |
| FR15-TC-113 | WEB/Update | FR15-DT-110 | Domain Testing | FR15-OBL-DT-110 |
| FR15-TC-114 | WEB/Update | FR15-SUP-008 | Supplementary | FR15-OBL-SUP-008 |
| FR15-TC-115 | API/Read | FR15-DT-111 | Domain Testing | FR15-OBL-DT-111 |
| FR15-TC-116 | API/Read | FR15-DT-112 | Domain Testing | FR15-OBL-DT-112 |
| FR15-TC-117 | API/Read | FR15-DT-113 | Domain Testing | FR15-OBL-DT-113 |
| FR15-TC-118 | API/Read | FR15-DT-114 | Domain Testing | FR15-OBL-DT-114 |
| FR15-TC-119 | API/Delete | FR15-DT-115 | Domain Testing | FR15-OBL-DT-115 |
| FR15-TC-120 | API/Delete | FR15-DT-116 | Domain Testing | FR15-OBL-DT-116 |
| FR15-TC-121 | API/Update | FR15-DT-117 | Domain Testing | FR15-OBL-DT-117 |
| FR15-TC-122 | API/Update | FR15-DT-118 | Domain Testing | FR15-OBL-DT-118 |
| FR15-TC-123 | API/Update | FR15-DT-119 | Domain Testing | FR15-OBL-DT-119 |
| FR15-TC-124 | API/Update | FR15-DT-120 | Domain Testing | FR15-OBL-DT-120 |
| FR15-TC-125 | API/Update | FR15-DT-121 | Domain Testing | FR15-OBL-DT-121 |
| FR15-TC-126 | API/Update | FR15-DT-122 | Domain Testing | FR15-OBL-DT-122 |
| FR15-TC-127 | WEB/Read | FR15-DT-123 | Domain Testing | FR15-OBL-DT-123 |
| FR15-TC-128 | WEB/Read | FR15-DT-124 | Domain Testing | FR15-OBL-DT-124 |
| FR15-TC-129 | WEB/Delete | FR15-DT-125 | Domain Testing | FR15-OBL-DT-125 |
| FR15-TC-130 | WEB/Delete | FR15-DT-126 | Domain Testing | FR15-OBL-DT-126 |
| FR15-TC-131 | WEB/Update | FR15-DT-127 | Domain Testing | FR15-OBL-DT-127 |
| FR15-TC-132 | WEB/Update | FR15-DT-128 | Domain Testing | FR15-OBL-DT-128 |
| FR15-TC-133 | WEB/Update | FR15-DT-129 | Domain Testing | FR15-OBL-DT-129 |
| FR15-TC-134 | WEB/Update | FR15-DT-130 | Domain Testing | FR15-OBL-DT-130 |
| FR15-TC-135 | WEB/Update | FR15-DT-131 | Domain Testing | FR15-OBL-DT-131 |
| FR15-TC-136 | WEB/Update | FR15-DT-132 | Domain Testing | FR15-OBL-DT-132 |
| FR15-TC-137 | API/Create | FR15-DT-133 | Domain Testing | FR15-OBL-DT-133 |
| FR15-TC-138 | API/Create | FR15-DT-134 | Domain Testing | FR15-OBL-DT-134 |
| FR15-TC-139 | API/Create | FR15-DT-135 | Domain Testing | FR15-OBL-DT-135 |
| FR15-TC-140 | API/Update | FR15-DT-136 | Domain Testing | FR15-OBL-DT-136 |
| FR15-TC-141 | API/Update | FR15-DT-137 | Domain Testing | FR15-OBL-DT-137 |
| FR15-TC-142 | API/Update | FR15-DT-138 | Domain Testing | FR15-OBL-DT-138 |
| FR15-TC-143 | API/Delete | FR15-DT-139 | Domain Testing | FR15-OBL-DT-139 |
| FR15-TC-144 | API/Delete | FR15-DT-140 | Domain Testing | FR15-OBL-DT-140 |
| FR15-TC-145 | API/Delete | FR15-DT-141 | Domain Testing | FR15-OBL-DT-141 |
| FR15-TC-146 | WEB/Create | FR15-DT-142 | Domain Testing | FR15-OBL-DT-142 |
| FR15-TC-147 | API/Create | FR15-DT-143 | Domain Testing | FR15-OBL-DT-143 |
| FR15-TC-148 | API/Read | FR15-SUP-009 | Supplementary | FR15-OBL-SUP-009 |
| FR15-TC-149 | API/Update | FR15-SUP-010 | Supplementary | FR15-OBL-SUP-010 |
| FR15-TC-150 | API/Delete | FR15-SUP-011 | Supplementary | FR15-OBL-SUP-011 |
| FR15-TC-151 | API/Create | FR15-BVA-007 | BVA | FR15-OBL-BVA-007 |
| FR15-TC-152 | API/Create | FR15-BVA-011 | BVA | FR15-OBL-BVA-011 |
| FR15-TC-153 | API/Update | FR15-BVA-018 | BVA | FR15-OBL-BVA-018 |
| FR15-TC-154 | API/Update | FR15-BVA-022 | BVA | FR15-OBL-BVA-022 |
| FR15-TC-155 | WEB/Create | FR15-BVA-029 | BVA | FR15-OBL-BVA-029 |
| FR15-TC-156 | WEB/Create | FR15-BVA-033 | BVA | FR15-OBL-BVA-033 |
| FR15-TC-157 | WEB/Update | FR15-BVA-040 | BVA | FR15-OBL-BVA-040 |
| FR15-TC-158 | WEB/Update | FR15-BVA-044 | BVA | FR15-OBL-BVA-044 |


tests/fr15/suite.json
Artifact SHA256=bb96a06dcfc27932a310f60a24b40108446a9fe95fb262de6906bab3232b0901
```

Pending learner review.

## Interaction fr15-native-fixture-correction

```text
{
  "tool": "Codex",
  "task": "FR15 fixture-correction",
  "recorded_at": "2026-10-15T22:12:26+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/suite-review.md
# FR15 — Suite review / freeze

Review: AI self-review. Learner technical review: Pending. Original source IDs and obligation mappings preserved.

Dedup key: layer/action/preconditions/fixture/input/steps/expected outcome+stateContract. Description wording is explanatory, not an assertion; merged cases retain all source rationales in source JSON. Different layers/actions never merge.

Corrections / preventive review: added empty-category membership in design; name boundary includes 257; price only Z slice; non-target UI before reload distinct from DB; no delete dialog invented. These are design decisions, not claims of learner corrections or discovered SUT bugs.

Sources=198; canonical=158; obligations=198. Layer counts: {'API': 97, 'WEB': 61}.

Harness TDD: initial valid-suite assertion failed with validator not implemented; implementation then verified with six acceptance/rejection checks. Frozen actual=null, status=Not Run, evidence=[].

| File | SHA256 |
|---|---|
| tests/fr15/suite.json | bb96a06dcfc27932a310f60a24b40108446a9fe95fb262de6906bab3232b0901 |
| tests/fr15/source-cases.json | 1b5a5938fdfec378419deb3ff4afa2a3227bfbb69504028ab1204c009dbbeb27 |
| tests/fr15/obligations.json | f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305 |

| Canonical | Layer/action | Sources | Techniques | Obligations |
|---|---|---|---|---|
| FR15-TC-001 | API/Create | FR15-DT-001 | Domain Testing | FR15-OBL-DT-001 |
| FR15-TC-002 | API/Create | FR15-DT-002,FR15-DT-027,FR15-BVA-001 | Domain Testing,BVA | FR15-OBL-DT-002,FR15-OBL-DT-027,FR15-OBL-BVA-001 |
| FR15-TC-003 | API/Create | FR15-DT-003,FR15-BVA-002 | Domain Testing,BVA | FR15-OBL-DT-003,FR15-OBL-BVA-002 |
| FR15-TC-004 | API/Create | FR15-DT-004,FR15-BVA-003 | Domain Testing,BVA | FR15-OBL-DT-004,FR15-OBL-BVA-003 |
| FR15-TC-005 | API/Create | FR15-DT-005,FR15-BVA-004 | Domain Testing,BVA | FR15-OBL-DT-005,FR15-OBL-BVA-004 |
| FR15-TC-006 | API/Create | FR15-DT-006,FR15-BVA-005 | Domain Testing,BVA | FR15-OBL-DT-006,FR15-OBL-BVA-005 |
| FR15-TC-007 | API/Create | FR15-DT-007,FR15-BVA-006 | Domain Testing,BVA | FR15-OBL-DT-007,FR15-OBL-BVA-006 |
| FR15-TC-008 | API/Create | FR15-DT-008,FR15-BVA-008 | Domain Testing,BVA | FR15-OBL-DT-008,FR15-OBL-BVA-008 |
| FR15-TC-009 | API/Create | FR15-DT-009,FR15-BVA-009 | Domain Testing,BVA | FR15-OBL-DT-009,FR15-OBL-BVA-009 |
| FR15-TC-010 | API/Create | FR15-DT-010,FR15-BVA-010 | Domain Testing,BVA | FR15-OBL-DT-010,FR15-OBL-BVA-010 |
| FR15-TC-011 | API/Create | FR15-DT-011 | Domain Testing | FR15-OBL-DT-011 |
| FR15-TC-012 | API/Create | FR15-DT-012 | Domain Testing | FR15-OBL-DT-012 |
| FR15-TC-013 | API/Create | FR15-DT-013 | Domain Testing | FR15-OBL-DT-013 |
| FR15-TC-014 | API/Create | FR15-DT-014 | Domain Testing | FR15-OBL-DT-014 |
| FR15-TC-015 | API/Create | FR15-DT-015 | Domain Testing | FR15-OBL-DT-015 |
| FR15-TC-016 | API/Create | FR15-DT-016 | Domain Testing | FR15-OBL-DT-016 |
| FR15-TC-017 | API/Create | FR15-DT-017 | Domain Testing | FR15-OBL-DT-017 |
| FR15-TC-018 | API/Create | FR15-DT-018 | Domain Testing | FR15-OBL-DT-018 |
| FR15-TC-019 | API/Create | FR15-DT-019 | Domain Testing | FR15-OBL-DT-019 |
| FR15-TC-020 | API/Create | FR15-DT-020 | Domain Testing | FR15-OBL-DT-020 |
| FR15-TC-021 | API/Create | FR15-DT-021 | Domain Testing | FR15-OBL-DT-021 |
| FR15-TC-022 | API/Create | FR15-DT-022,FR15-DT-030 | Domain Testing | FR15-OBL-DT-022,FR15-OBL-DT-030 |
| FR15-TC-023 | API/Create | FR15-DT-023 | Domain Testing | FR15-OBL-DT-023 |
| FR15-TC-024 | API/Create | FR15-DT-024 | Domain Testing | FR15-OBL-DT-024 |
| FR15-TC-025 | API/Create | FR15-DT-025 | Domain Testing | FR15-OBL-DT-025 |
| FR15-TC-026 | API/Create | FR15-DT-026 | Domain Testing | FR15-OBL-DT-026 |
| FR15-TC-027 | API/Create | FR15-DT-028 | Domain Testing | FR15-OBL-DT-028 |
| FR15-TC-028 | API/Create | FR15-DT-029 | Domain Testing | FR15-OBL-DT-029 |
| FR15-TC-029 | API/Create | FR15-DT-031 | Domain Testing | FR15-OBL-DT-031 |
| FR15-TC-030 | API/Create | FR15-DT-032 | Domain Testing | FR15-OBL-DT-032 |
| FR15-TC-031 | API/Create | FR15-DT-033 | Domain Testing | FR15-OBL-DT-033 |
| FR15-TC-032 | API/Create | FR15-SUP-001 | Supplementary | FR15-OBL-SUP-001 |
| FR15-TC-033 | API/Create | FR15-SUP-002 | Supplementary | FR15-OBL-SUP-002 |
| FR15-TC-034 | API/Create | FR15-SUP-003 | Supplementary | FR15-OBL-SUP-003 |
| FR15-TC-035 | API/Update | FR15-DT-034 | Domain Testing | FR15-OBL-DT-034 |
| FR15-TC-036 | API/Update | FR15-DT-035,FR15-DT-060,FR15-BVA-012 | Domain Testing,BVA | FR15-OBL-DT-035,FR15-OBL-DT-060,FR15-OBL-BVA-012 |
| FR15-TC-037 | API/Update | FR15-DT-036,FR15-BVA-013 | Domain Testing,BVA | FR15-OBL-DT-036,FR15-OBL-BVA-013 |
| FR15-TC-038 | API/Update | FR15-DT-037,FR15-BVA-014 | Domain Testing,BVA | FR15-OBL-DT-037,FR15-OBL-BVA-014 |
| FR15-TC-039 | API/Update | FR15-DT-038,FR15-BVA-015 | Domain Testing,BVA | FR15-OBL-DT-038,FR15-OBL-BVA-015 |
| FR15-TC-040 | API/Update | FR15-DT-039,FR15-BVA-016 | Domain Testing,BVA | FR15-OBL-DT-039,FR15-OBL-BVA-016 |
| FR15-TC-041 | API/Update | FR15-DT-040,FR15-BVA-017 | Domain Testing,BVA | FR15-OBL-DT-040,FR15-OBL-BVA-017 |
| FR15-TC-042 | API/Update | FR15-DT-041,FR15-BVA-019 | Domain Testing,BVA | FR15-OBL-DT-041,FR15-OBL-BVA-019 |
| FR15-TC-043 | API/Update | FR15-DT-042,FR15-BVA-020 | Domain Testing,BVA | FR15-OBL-DT-042,FR15-OBL-BVA-020 |
| FR15-TC-044 | API/Update | FR15-DT-043,FR15-BVA-021 | Domain Testing,BVA | FR15-OBL-DT-043,FR15-OBL-BVA-021 |
| FR15-TC-045 | API/Update | FR15-DT-044 | Domain Testing | FR15-OBL-DT-044 |
| FR15-TC-046 | API/Update | FR15-DT-045 | Domain Testing | FR15-OBL-DT-045 |
| FR15-TC-047 | API/Update | FR15-DT-046 | Domain Testing | FR15-OBL-DT-046 |
| FR15-TC-048 | API/Update | FR15-DT-047 | Domain Testing | FR15-OBL-DT-047 |
| FR15-TC-049 | API/Update | FR15-DT-048 | Domain Testing | FR15-OBL-DT-048 |
| FR15-TC-050 | API/Update | FR15-DT-049 | Domain Testing | FR15-OBL-DT-049 |
| FR15-TC-051 | API/Update | FR15-DT-050 | Domain Testing | FR15-OBL-DT-050 |
| FR15-TC-052 | API/Update | FR15-DT-051 | Domain Testing | FR15-OBL-DT-051 |
| FR15-TC-053 | API/Update | FR15-DT-052 | Domain Testing | FR15-OBL-DT-052 |
| FR15-TC-054 | API/Update | FR15-DT-053 | Domain Testing | FR15-OBL-DT-053 |
| FR15-TC-055 | API/Update | FR15-DT-054 | Domain Testing | FR15-OBL-DT-054 |
| FR15-TC-056 | API/Update | FR15-DT-055,FR15-DT-063 | Domain Testing | FR15-OBL-DT-055,FR15-OBL-DT-063 |
| FR15-TC-057 | API/Update | FR15-DT-056 | Domain Testing | FR15-OBL-DT-056 |
| FR15-TC-058 | API/Update | FR15-DT-057 | Domain Testing | FR15-OBL-DT-057 |
| FR15-TC-059 | API/Update | FR15-DT-058 | Domain Testing | FR15-OBL-DT-058 |
| FR15-TC-060 | API/Update | FR15-DT-059 | Domain Testing | FR15-OBL-DT-059 |
| FR15-TC-061 | API/Update | FR15-DT-061 | Domain Testing | FR15-OBL-DT-061 |
| FR15-TC-062 | API/Update | FR15-DT-062 | Domain Testing | FR15-OBL-DT-062 |
| FR15-TC-063 | API/Update | FR15-DT-064 | Domain Testing | FR15-OBL-DT-064 |
| FR15-TC-064 | API/Update | FR15-DT-065 | Domain Testing | FR15-OBL-DT-065 |
| FR15-TC-065 | API/Update | FR15-DT-066 | Domain Testing | FR15-OBL-DT-066 |
| FR15-TC-066 | API/Update | FR15-SUP-004 | Supplementary | FR15-OBL-SUP-004 |
| FR15-TC-067 | API/Update | FR15-SUP-005 | Supplementary | FR15-OBL-SUP-005 |
| FR15-TC-068 | API/Update | FR15-SUP-006 | Supplementary | FR15-OBL-SUP-006 |
| FR15-TC-069 | WEB/Create | FR15-DT-067 | Domain Testing | FR15-OBL-DT-067 |
| FR15-TC-070 | WEB/Create | FR15-DT-068,FR15-BVA-023 | Domain Testing,BVA | FR15-OBL-DT-068,FR15-OBL-BVA-023 |
| FR15-TC-071 | WEB/Create | FR15-DT-069,FR15-BVA-024 | Domain Testing,BVA | FR15-OBL-DT-069,FR15-OBL-BVA-024 |
| FR15-TC-072 | WEB/Create | FR15-DT-070,FR15-BVA-025 | Domain Testing,BVA | FR15-OBL-DT-070,FR15-OBL-BVA-025 |
| FR15-TC-073 | WEB/Create | FR15-DT-071,FR15-BVA-026 | Domain Testing,BVA | FR15-OBL-DT-071,FR15-OBL-BVA-026 |
| FR15-TC-074 | WEB/Create | FR15-DT-072,FR15-BVA-027 | Domain Testing,BVA | FR15-OBL-DT-072,FR15-OBL-BVA-027 |
| FR15-TC-075 | WEB/Create | FR15-DT-073,FR15-BVA-028 | Domain Testing,BVA | FR15-OBL-DT-073,FR15-OBL-BVA-028 |
| FR15-TC-076 | WEB/Create | FR15-DT-074,FR15-BVA-030 | Domain Testing,BVA | FR15-OBL-DT-074,FR15-OBL-BVA-030 |
| FR15-TC-077 | WEB/Create | FR15-DT-075,FR15-BVA-031 | Domain Testing,BVA | FR15-OBL-DT-075,FR15-OBL-BVA-031 |
| FR15-TC-078 | WEB/Create | FR15-DT-076,FR15-BVA-032 | Domain Testing,BVA | FR15-OBL-DT-076,FR15-OBL-BVA-032 |
| FR15-TC-079 | WEB/Create | FR15-DT-077 | Domain Testing | FR15-OBL-DT-077 |
| FR15-TC-080 | WEB/Create | FR15-DT-078 | Domain Testing | FR15-OBL-DT-078 |
| FR15-TC-081 | WEB/Create | FR15-DT-079 | Domain Testing | FR15-OBL-DT-079 |
| FR15-TC-082 | WEB/Create | FR15-DT-080 | Domain Testing | FR15-OBL-DT-080 |
| FR15-TC-083 | WEB/Create | FR15-DT-081 | Domain Testing | FR15-OBL-DT-081 |
| FR15-TC-084 | WEB/Create | FR15-DT-082 | Domain Testing | FR15-OBL-DT-082 |
| FR15-TC-085 | WEB/Create | FR15-DT-083 | Domain Testing | FR15-OBL-DT-083 |
| FR15-TC-086 | WEB/Create | FR15-DT-084 | Domain Testing | FR15-OBL-DT-084 |
| FR15-TC-087 | WEB/Create | FR15-DT-085 | Domain Testing | FR15-OBL-DT-085 |
| FR15-TC-088 | WEB/Create | FR15-DT-086 | Domain Testing | FR15-OBL-DT-086 |
| FR15-TC-089 | WEB/Create | FR15-DT-087 | Domain Testing | FR15-OBL-DT-087 |
| FR15-TC-090 | WEB/Create | FR15-DT-088 | Domain Testing | FR15-OBL-DT-088 |
| FR15-TC-091 | WEB/Create | FR15-SUP-007 | Supplementary | FR15-OBL-SUP-007 |
| FR15-TC-092 | WEB/Update | FR15-DT-089 | Domain Testing | FR15-OBL-DT-089 |
| FR15-TC-093 | WEB/Update | FR15-DT-090,FR15-BVA-034 | Domain Testing,BVA | FR15-OBL-DT-090,FR15-OBL-BVA-034 |
| FR15-TC-094 | WEB/Update | FR15-DT-091,FR15-BVA-035 | Domain Testing,BVA | FR15-OBL-DT-091,FR15-OBL-BVA-035 |
| FR15-TC-095 | WEB/Update | FR15-DT-092,FR15-BVA-036 | Domain Testing,BVA | FR15-OBL-DT-092,FR15-OBL-BVA-036 |
| FR15-TC-096 | WEB/Update | FR15-DT-093,FR15-BVA-037 | Domain Testing,BVA | FR15-OBL-DT-093,FR15-OBL-BVA-037 |
| FR15-TC-097 | WEB/Update | FR15-DT-094,FR15-BVA-038 | Domain Testing,BVA | FR15-OBL-DT-094,FR15-OBL-BVA-038 |
| FR15-TC-098 | WEB/Update | FR15-DT-095,FR15-BVA-039 | Domain Testing,BVA | FR15-OBL-DT-095,FR15-OBL-BVA-039 |
| FR15-TC-099 | WEB/Update | FR15-DT-096,FR15-BVA-041 | Domain Testing,BVA | FR15-OBL-DT-096,FR15-OBL-BVA-041 |
| FR15-TC-100 | WEB/Update | FR15-DT-097,FR15-BVA-042 | Domain Testing,BVA | FR15-OBL-DT-097,FR15-OBL-BVA-042 |
| FR15-TC-101 | WEB/Update | FR15-DT-098,FR15-BVA-043 | Domain Testing,BVA | FR15-OBL-DT-098,FR15-OBL-BVA-043 |
| FR15-TC-102 | WEB/Update | FR15-DT-099 | Domain Testing | FR15-OBL-DT-099 |
| FR15-TC-103 | WEB/Update | FR15-DT-100 | Domain Testing | FR15-OBL-DT-100 |
| FR15-TC-104 | WEB/Update | FR15-DT-101 | Domain Testing | FR15-OBL-DT-101 |
| FR15-TC-105 | WEB/Update | FR15-DT-102 | Domain Testing | FR15-OBL-DT-102 |
| FR15-TC-106 | WEB/Update | FR15-DT-103 | Domain Testing | FR15-OBL-DT-103 |
| FR15-TC-107 | WEB/Update | FR15-DT-104 | Domain Testing | FR15-OBL-DT-104 |
| FR15-TC-108 | WEB/Update | FR15-DT-105 | Domain Testing | FR15-OBL-DT-105 |
| FR15-TC-109 | WEB/Update | FR15-DT-106 | Domain Testing | FR15-OBL-DT-106 |
| FR15-TC-110 | WEB/Update | FR15-DT-107 | Domain Testing | FR15-OBL-DT-107 |
| FR15-TC-111 | WEB/Update | FR15-DT-108 | Domain Testing | FR15-OBL-DT-108 |
| FR15-TC-112 | WEB/Update | FR15-DT-109 | Domain Testing | FR15-OBL-DT-109 |
| FR15-TC-113 | WEB/Update | FR15-DT-110 | Domain Testing | FR15-OBL-DT-110 |
| FR15-TC-114 | WEB/Update | FR15-SUP-008 | Supplementary | FR15-OBL-SUP-008 |
| FR15-TC-115 | API/Read | FR15-DT-111 | Domain Testing | FR15-OBL-DT-111 |
| FR15-TC-116 | API/Read | FR15-DT-112 | Domain Testing | FR15-OBL-DT-112 |
| FR15-TC-117 | API/Read | FR15-DT-113 | Domain Testing | FR15-OBL-DT-113 |
| FR15-TC-118 | API/Read | FR15-DT-114 | Domain Testing | FR15-OBL-DT-114 |
| FR15-TC-119 | API/Delete | FR15-DT-115 | Domain Testing | FR15-OBL-DT-115 |
| FR15-TC-120 | API/Delete | FR15-DT-116 | Domain Testing | FR15-OBL-DT-116 |
| FR15-TC-121 | API/Update | FR15-DT-117 | Domain Testing | FR15-OBL-DT-117 |
| FR15-TC-122 | API/Update | FR15-DT-118 | Domain Testing | FR15-OBL-DT-118 |
| FR15-TC-123 | API/Update | FR15-DT-119 | Domain Testing | FR15-OBL-DT-119 |
| FR15-TC-124 | API/Update | FR15-DT-120 | Domain Testing | FR15-OBL-DT-120 |
| FR15-TC-125 | API/Update | FR15-DT-121 | Domain Testing | FR15-OBL-DT-121 |
| FR15-TC-126 | API/Update | FR15-DT-122 | Domain Testing | FR15-OBL-DT-122 |
| FR15-TC-127 | WEB/Read | FR15-DT-123 | Domain Testing | FR15-OBL-DT-123 |
| FR15-TC-128 | WEB/Read | FR15-DT-124 | Domain Testing | FR15-OBL-DT-124 |
| FR15-TC-129 | WEB/Delete | FR15-DT-125 | Domain Testing | FR15-OBL-DT-125 |
| FR15-TC-130 | WEB/Delete | FR15-DT-126 | Domain Testing | FR15-OBL-DT-126 |
| FR15-TC-131 | WEB/Update | FR15-DT-127 | Domain Testing | FR15-OBL-DT-127 |
| FR15-TC-132 | WEB/Update | FR15-DT-128 | Domain Testing | FR15-OBL-DT-128 |
| FR15-TC-133 | WEB/Update | FR15-DT-129 | Domain Testing | FR15-OBL-DT-129 |
| FR15-TC-134 | WEB/Update | FR15-DT-130 | Domain Testing | FR15-OBL-DT-130 |
| FR15-TC-135 | WEB/Update | FR15-DT-131 | Domain Testing | FR15-OBL-DT-131 |
| FR15-TC-136 | WEB/Update | FR15-DT-132 | Domain Testing | FR15-OBL-DT-132 |
| FR15-TC-137 | API/Create | FR15-DT-133 | Domain Testing | FR15-OBL-DT-133 |
| FR15-TC-138 | API/Create | FR15-DT-134 | Domain Testing | FR15-OBL-DT-134 |
| FR15-TC-139 | API/Create | FR15-DT-135 | Domain Testing | FR15-OBL-DT-135 |
| FR15-TC-140 | API/Update | FR15-DT-136 | Domain Testing | FR15-OBL-DT-136 |
| FR15-TC-141 | API/Update | FR15-DT-137 | Domain Testing | FR15-OBL-DT-137 |
| FR15-TC-142 | API/Update | FR15-DT-138 | Domain Testing | FR15-OBL-DT-138 |
| FR15-TC-143 | API/Delete | FR15-DT-139 | Domain Testing | FR15-OBL-DT-139 |
| FR15-TC-144 | API/Delete | FR15-DT-140 | Domain Testing | FR15-OBL-DT-140 |
| FR15-TC-145 | API/Delete | FR15-DT-141 | Domain Testing | FR15-OBL-DT-141 |
| FR15-TC-146 | WEB/Create | FR15-DT-142 | Domain Testing | FR15-OBL-DT-142 |
| FR15-TC-147 | API/Create | FR15-DT-143 | Domain Testing | FR15-OBL-DT-143 |
| FR15-TC-148 | API/Read | FR15-SUP-009 | Supplementary | FR15-OBL-SUP-009 |
| FR15-TC-149 | API/Update | FR15-SUP-010 | Supplementary | FR15-OBL-SUP-010 |
| FR15-TC-150 | API/Delete | FR15-SUP-011 | Supplementary | FR15-OBL-SUP-011 |
| FR15-TC-151 | API/Create | FR15-BVA-007 | BVA | FR15-OBL-BVA-007 |
| FR15-TC-152 | API/Create | FR15-BVA-011 | BVA | FR15-OBL-BVA-011 |
| FR15-TC-153 | API/Update | FR15-BVA-018 | BVA | FR15-OBL-BVA-018 |
| FR15-TC-154 | API/Update | FR15-BVA-022 | BVA | FR15-OBL-BVA-022 |
| FR15-TC-155 | WEB/Create | FR15-BVA-029 | BVA | FR15-OBL-BVA-029 |
| FR15-TC-156 | WEB/Create | FR15-BVA-033 | BVA | FR15-OBL-BVA-033 |
| FR15-TC-157 | WEB/Update | FR15-BVA-040 | BVA | FR15-OBL-BVA-040 |
| FR15-TC-158 | WEB/Update | FR15-BVA-044 | BVA | FR15-OBL-BVA-044 |

## Freeze v2 — PNG fixture correction before execution

V1 hashes above are historical. IDAT CRC of AI-authored 1×1 PNG was invalid; reproduced by chunk CRC test (RED). Corrected CRC only, no SUT change; all IDs/rules/obligations and dedup identities preserved. New fixture test GREEN; validator rerun. This is an evidenced AI fixture omission, not a product bug. Active hashes:

| File | SHA256 |
|---|---|
| tests/fr15/suite.json | bd21cd16700d8c20d15c361ed0ac56a741978844ea4524ee8ede4020441da21e |
| tests/fr15/source-cases.json | 9c9693ff0a247e7231752a67955a2dd86647370d6bf8132983ca854b0c4e6346 |
| tests/fr15/obligations.json | f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305 |
| tests/fr15/fixtures.json | 9968ebef532a7f4baf37d5c91f6334dee2b07bbf81b935d089356716f43b712d |


tests/fr15/fixtures.json
Artifact SHA256=9968ebef532a7f4baf37d5c91f6334dee2b07bbf81b935d089356716f43b712d
```

Pending learner review.

## Interaction fr15-native-task5

```text
{
  "tool": "Codex",
  "task": "FR15 task5",
  "recorded_at": "2026-10-15T22:27:26+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/evidence/harness/README.md
# Harness verification evidence

These are harness tests, not SUT product-case results. Initial RED logs show missing preparation/assertion/orchestration behavior and a corrupt fixture, followed by 15 GREEN tests in task5-green.log. UI settling separately failed because settling behavior was missing, then passed a real Chromium delayed-DOM regression via `node tests/fr15/run-all.cjs --ui-self-check`; its command output is available in the current chat, not reconstructed as a historical log here.

run01 is preliminary: DOM sampling raced asynchronous fetchData after save; subsequent screenshots could show a newer state. Keep its raw records, do not count them as final bugs. run02 reruns the entire frozen suite with 500ms API quiet time and two animation frames, preserving immediate UI state before reload. Backend initialization is byte-identical to source, and fixtures are reset only after startup completes.

No SUT fix is included. Tests reporting product Fail are evidence of discrepancies; harness tests must pass. Exact model/historical prompt timestamps are unknown; audit capture is explicitly partial.


docs/testing/fr15/evidence/fr15-run02/manifest.json
Artifact SHA256=cb3d994fdacdc24e5da0eeb67ee3a5fe00171562df2cbe12a40d8f2e102ae536
```

Pending learner review.

## Interaction fr15-native-task6

```text
{
  "tool": "Codex",
  "task": "FR15 task6",
  "recorded_at": "2026-10-15T22:29:35+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/test-results.md
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


docs/testing/fr15/bugs.md
# FR-15 — Observed bug reports

Final evidence: fr15-run02 only. Five rule-based reports, including one FR12 product-write dependency. No SUT patches, GitHub Issues or fabricated screenshots. Multiple failing cases may map to one report. This grouping does not prove one code root cause across UI and API.

## FR15-BUG-001 — Name required/255-character limit is not enforced across product writes

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R05; README.md:195.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-075` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Use API missing/null/empty name or 256/257 ASCII chars with valid price/category/admin. UI accepts >255 chars.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject invalid name, show suitable feedback and leave products unchanged.
**Actual (representative FR15-TC-075):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-002, FR15-TC-007, FR15-TC-013, FR15-TC-019, FR15-TC-020, FR15-TC-025, FR15-TC-026, FR15-TC-036, FR15-TC-041, FR15-TC-047, FR15-TC-053, FR15-TC-054, FR15-TC-059, FR15-TC-060, FR15-TC-075, FR15-TC-081, FR15-TC-088, FR15-TC-098, FR15-TC-104, FR15-TC-111, FR15-TC-151, FR15-TC-153, FR15-TC-155, FR15-TC-157.

**Evidence:**
- [FR15-TC-075_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-075_immediate.png)
- [FR15-TC-075_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-075_reload.png)
- [FR15-TC-075.json](evidence/fr15-run02/web/FR15-TC-075.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-002 — Required positive numeric price is not enforced

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R06; README.md:196.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-076` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Use API omitted/null/empty/non-numeric/negative/zero price, or UI blank/negative/zero, with valid name/category/admin.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject invalid price; no persisted product mutation.
**Actual (representative FR15-TC-076):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-008, FR15-TC-009, FR15-TC-014, FR15-TC-015, FR15-TC-017, FR15-TC-018, FR15-TC-020, FR15-TC-022, FR15-TC-024, FR15-TC-027, FR15-TC-028, FR15-TC-042, FR15-TC-043, FR15-TC-048, FR15-TC-049, FR15-TC-051, FR15-TC-052, FR15-TC-054, FR15-TC-056, FR15-TC-058, FR15-TC-061, FR15-TC-062, FR15-TC-076, FR15-TC-077, FR15-TC-082, FR15-TC-083, FR15-TC-085, FR15-TC-086, FR15-TC-088, FR15-TC-090, FR15-TC-099, FR15-TC-100, FR15-TC-105, FR15-TC-106, FR15-TC-108, FR15-TC-109, FR15-TC-111, FR15-TC-113.

**Evidence:**
- [FR15-TC-076_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-076_immediate.png)
- [FR15-TC-076_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-076_reload.png)
- [FR15-TC-076.json](evidence/fr15-run02/web/FR15-TC-076.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-003 — Product may reference a missing category or omit category

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R07; README.md:197.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `empty-categories`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-146` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. API category_id=15 or missing/null/empty. UI use empty-categories fixture and submit valid name/price without any category option.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Only an existing category can be saved; empty-category list prevents creation.
**Actual (representative FR15-TC-146):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 1}}; products 0 → 1.

**Affected canonical cases:** FR15-TC-023, FR15-TC-029, FR15-TC-030, FR15-TC-031, FR15-TC-057, FR15-TC-063, FR15-TC-064, FR15-TC-065, FR15-TC-146, FR15-TC-147.

**Evidence:**
- [FR15-TC-146_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-146_immediate.png)
- [FR15-TC-146_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-146_reload.png)
- [FR15-TC-146.json](evidence/fr15-run02/web/FR15-TC-146.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-004 — Saving one product changes non-target names in immediate Admin UI

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R08; README.md:198.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-092` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Baseline A/B/C. Open Sửa on A or B; submit valid body. Inspect table before reload, compare API/DB, then reload.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Only target changes. Non-target rendered names stay original both immediately and after reload.
**Actual (representative FR15-TC-092):** status Failed; assertions ['ui-immediate-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product updated'}}; products 3 → 3.

Persisted DB and API readback match the requested target update; immediate table renames non-targets. Reload restores their original names. This is observed UI drift, not a claim that all DB rows were updated.

**Affected canonical cases:** FR15-TC-092, FR15-TC-094, FR15-TC-095, FR15-TC-096, FR15-TC-097, FR15-TC-101, FR15-TC-102, FR15-TC-103, FR15-TC-107, FR15-TC-112, FR15-TC-131, FR15-TC-132, FR15-TC-133, FR15-TC-134, FR15-TC-135, FR15-TC-136, FR15-TC-158.

**Evidence:**
- [FR15-TC-092_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-092_immediate.png)
- [FR15-TC-092_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-092_reload.png)
- [FR15-TC-092.json](evidence/fr15-run02/web/FR15-TC-092.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-005 — [Dependency FR12] Product writes accept absent/invalid/non-admin token

**Severity:** High. Unauthorized product data writes are possible.
**Rule/oracle:** FR12-DEP-WRITE; README.md:177–179.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `none`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-137` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. POST/PUT/DELETE product with no token, invalid token or valid user JWT; retain otherwise valid body and existing target.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject unauthorized mutation and preserve all products. No exact HTTP error status mandated by supplied spec.
**Actual (representative FR15-TC-137):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-137, FR15-TC-138, FR15-TC-139, FR15-TC-140, FR15-TC-141, FR15-TC-142, FR15-TC-143, FR15-TC-144, FR15-TC-145.

**Evidence:**
- [FR15-TC-137.json](evidence/fr15-run02/api/FR15-TC-137.json)

API request/response/state are the available evidence. No UI screenshot of an API-only authorization test is fabricated; capture a real API-client screen before an authorized GitHub publication if required.

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

```

Pending learner review.

## Interaction fr15-native-task7

```text
{
  "tool": "Codex",
  "task": "FR15 task7",
  "recorded_at": "2026-10-15T22:32:03+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

````text
docs/testing/fr15/ai-gap-analysis.md
# FR15 — AI gap analysis

## Bằng chứng và phạm vi

Audit ghi các snapshot output theo task trong phiên hiện tại; capture partial, không phải complete session transcript. Model cụ thể và thời gian lịch sử prompt không biết, recorded_at có UTC+07:00. Người dùng chọn Native là authorization execution, không phải learner technical review. Learner review: Pending.

| Gap | Output ban đầu / bằng chứng | Correction và verification | Phân loại |
|---|---|---|---|
| GAP-01 | Fixtures ở commit e625109 và source/frozen v1 có IDAT CRC sai; evidence/harness/png-red.log xác nhận failure | Commit 65d30b1 sửa CRC, freeze v2 giữ old hashes trong suite-review.md; png-fixture.test.cjs GREEN | AI fixture omission được quan sát; không phải bug SUT |
| GAP-02 | run01 WEB TC069 uiBeforeReload=3 rows, screenshot chụp sau đã có 4; runner suy lỗi UI khi chưa đồng bộ | Thêm API-request quiet 500ms + hai animation frames; ui-sync.test.py từ missing behavior RED sang GREEN; run02 chạy lại toàn 158 ca | AI harness timing gap; bỏ verdict run01 khỏi bug count |
| GAP-03 | readback-red.log: assessor chưa phát hiện tình huống DB đúng nhưng API readback thiếu | Thêm api-readback-consistent trong assessor; harness 15 tests GREEN; run02 ghi DB + API readback và so sánh | Oracle assertion omission trong harness; chưa phải missed SUT bug |

Nguyên nhân có thể liên quan việc AI tập trung vào nội dung nghiệp vụ mà chưa kiểm dữ liệu nhị phân và timing của React; đây là giả thuyết từ dấu hiệu, không phải khẳng định cơ chế bên trong AI. Không có learner correction nào được cung cấp, nên không gán ba correction này cho sinh viên.

## Những rủi ro đã phòng ngừa, không bịa thành lỗi AI đã xảy ra

Update validation, BVA length257, category membership thay vì ID interval, price precision chưa biết, khác biệt API/WEB và immediate/reload đã được đưa vào thiết kế. Không có evidence chứng minh AI ban đầu bỏ các case đó. Năm nhóm bug SUT đều có failed observations run02 và mapping trong bugs.md; chưa có bằng chứng một bug SUT nằm ngoài output ban đầu rồi mới được người học bổ sung. Không tuyên bố AI không còn bỏ sót bug.

## Giới hạn / follow-up

11 supplementary probes có actual observation nhưng oracle đầy đủ chưa xác định: price precision, Unicode/trim, missing-target contract. DT143 và BVA44 là nghĩa vụ lấy mẫu trong phạm vi hữu hạn, không phải full-input coverage. Cần slide và clarification để version suite/rerun; không suy diễn Pass/Fail. PDF/YouTube/GitHub Issues là công việc submission chưa được thực hiện trong plan FR15 này.

## AI Critique — draft cần người học review

Trong quá trình kiểm thử FR-15, AI giúp chuyển requirement thành predicates, chọn các điểm On/Off/In và tính hợp tập BVA có truy vết. Tuy nhiên, hai sai sót thực tế cho thấy đầu ra hợp lý về hình thức chưa đủ đáng tin. Thứ nhất, ảnh PNG dùng làm fixture có CRC sai. Nếu không kiểm tra dữ liệu mẫu, lỗi ảnh có thể tạo nhiễu khi chụp giao diện. Sai sót được phát hiện bằng kiểm tra từng chunk, sửa trước execution và lưu phiên bản freeze mới. Thứ hai, runner ban đầu đọc DOM trước khi chuỗi cập nhật bất đồng bộ hoàn tất. Ở TC069 của run01, snapshot chỉ có ba dòng nhưng screenshot sau đó đã có bốn dòng. Vì vậy, một phần lỗi UI trong lượt đầu là lỗi đo của harness, không phải bằng chứng đáng tin về SUT. Runner được bổ sung điều kiện API yên lặng và kiểm tra hồi quy bằng Chromium, rồi toàn suite được chạy lại trong run02. Đây là những thiếu sót của AI khi chuẩn bị fixture và đồng bộ quan sát; nguyên nhân bên trong mô hình không thể xác định chỉ từ kết quả này. Không có bằng chứng để khẳng định sinh viên đã phát hiện hoặc sửa chúng. Bài học là phải kiểm chứng cả test oracle, dữ liệu mẫu và công cụ đo; giữ bằng chứng gốc, phân biệt coverage với pass rate và công khai những probe chưa có oracle. Người học vẫn cần review kết quả và cung cấp slide để đối chiếu phương pháp.

Word count: 266, tính bằng whitespace split trên riêng đoạn critique. Draft do AI hỗ trợ; chưa có learner acceptance/revision.


docs/testing/fr15/README.md
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
````

Pending learner review.

## Interaction 93f75992-d68b-471b-8ef1-7ba354009fad

```text
{
  "tool": "Codex",
  "task": "FR-15 planning only",
  "recorded_at": "2026-10-15T21:23:46+07:00",
  "source": "Current chat: exact visible FR-15 planning request and complete saved plan text. Excludes the separate skill-content message, project instructions, intermediate commentary and tool transcript. Original interaction timestamp and exact runtime model unavailable. No SUT execution; learner review pending.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md) lập plan cho Domain testing + BVA cho FR-15: Product management (CRUD) đảm bảo tuân theo workflow sau:

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
# FR-15 Product Management — Domain Testing + BVA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết kế, giải thích từng bước, review và thực thi toàn bộ bộ kiểm thử Domain Testing + BVA cho FR-15, có traceability, bằng chứng và AI gap analysis.

**Architecture:** Dẫn xuất oracle từ requirement trước khi xem implementation; tạo hai bộ ca nguồn DT/BVA rồi hợp nhất thành suite canonical có nhiều nhãn technique. Thực thi API và Admin Web trên backend nguyên trạng được sao chép vào thư mục tạm với SQLite riêng; lưu observations tách khỏi suite đã đóng băng. Báo cáo đối chiếu UI tức thời, API/DB và UI sau reload; không sửa SUT để làm test pass.

**Tech Stack:** Markdown/JSON; Node.js CommonJS và HTTP client tích hợp; SQLite qua dependency hiện có của backend; Python Playwright/Chromium theo skill `webapp-testing`; npm với package-lock hiện có; Git.

**Spec:** `README.md:174–179,191–198`; `api_specification.md:78–106`; `docs/2026.HW02.Domain Testing_En.pdf` mục 5–6,9–10,12,14; `AGENTS.md`; workflow 7 bước trong yêu cầu người dùng ở chat này.

## Global Constraints

- “Admin có thể Thêm / Xem / Sửa / Xóa sản phẩm.”
- “Tên sản phẩm: bắt buộc, tối đa 255 ký tự.”
- “Giá: bắt buộc, phải là số **dương** (> 0).”
- “Danh mục: bắt buộc, phải chọn từ danh sách có sẵn.”
- “Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên.”
- FR-12 chỉ là dependency tại các thao tác ghi sản phẩm: cần JWT hợp lệ và `role = 'admin'`. Không mở rộng thành kiểm thử toàn FR-12.
- Giữ nguyên application code, database làm việc, dữ liệu và bằng chứng FR khác. Không chạy startup/seed trong `backend/` gốc; không chạy Docker Compose đang mount database gốc.
- Đây là plan cho **một feature Pool C**. Chưa xác nhận phân bổ nhóm; không tự chọn ba feature còn lại hoặc tuyên bố hoàn thành toàn HW02.
- Chỉ lập kế hoạch trong lượt này; chưa thiết kế toàn bộ case, chạy SUT hay xác nhận bug. Các lệnh dưới đây là giao kèo cho lần execution sau.
- Mỗi bước hoàn tất và kiểm chứng có một local commit; không push, publish Issues, upload video hoặc nộp bài khi chưa có yêu cầu tương ứng.
- Timestamps/clock của báo cáo dùng `Asia/Ho_Chi_Minh` (`UTC+07:00`); ghi phiên bản thực tế thay vì ước lượng phiên bản runtime/model.

## Review Focus

1. Validation phải áp dụng cho **cả Create và Update**; test rỗng/thiếu, length 256, giá 0 và danh mục không tồn tại ở từng thao tác (Task 2–4).
2. Các trường hợp nhiều chiều phải cô lập được predicate; thêm góc name/price và giữ category/auth hợp lệ trước khi thử nhiều lỗi cùng lúc (Task 2).
3. Cùng giá trị nhưng khác API/Web hoặc Create/Update là nghĩa vụ khác nhau; deduplicate không được làm mất chúng (Task 4).
4. Update A phải giữ B và C nguyên trạng trong UI ngay sau lưu, dữ liệu lưu trữ và UI sau reload; không reload trước khi chụp trạng thái tức thời (Task 2,5–6).
5. Danh mục là membership có/không tồn tại, không phải khoảng số ID; precision giá và Unicode chưa rõ phải giữ giới hạn oracle/coverage (Task 1–3,7).

---

## Căn cứ đã kiểm tra và quyết định phạm vi

| Nguồn | Cách sử dụng |
|---|---|
| README FR-15 | Oracle nghiệp vụ chính; tách rule ID ổn định `FR15-R01..R08` bên dưới. |
| README FR-12 | Phụ thuộc quyền tại POST/PUT/DELETE sản phẩm và truy cập UI Admin. GET sản phẩm không tự bị gán yêu cầu Admin vì còn là API xem công khai. |
| API specification §3.1–3.4 | `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`; `GET /api/categories` để xác định membership. Body Create/Update gồm `name, price, description, imageUrl, category_id`. |
| HW02 PDF §6 | Yêu cầu giải thích chi tiết từng bước DT và BVA; phân tích AI bỏ sót và báo cáo bug. PDF bài tập không thay thế slide giảng phương pháp. |
| `.agents/skills/domain-testing/` và `boundary-value-analysis/` | Quy ước On/Off/In và ISTQB 3-value BVA khi chưa có slide. Đây là fallback được công khai, chưa xác nhận là convention của lớp. |
| Implementation sau khi đọc requirement | Chỉ dùng để chuẩn bị cách chạy và xác định điểm quan sát; không dùng làm expected result. |

Đã thấy `backend/database.js` gọi `initDatabase()` ngay khi được import, có `DROP TABLE`. `backend/server.js` cố định port 3000; Admin dùng `http://localhost:3000/api`, Vite cố định 5174. `frontend-admin/src/App.jsx` chứa cả form và danh sách sản phẩm. Vì vậy phải dùng backend copy riêng, xác minh process sở hữu port, và quan sát UI trước reload. Các điểm đáng ngờ từ đọc code chỉ là **static suspicion**, chưa phải observed failure.

Không kiểm thử CSV import FR-16, Category CRUD FR-14, tìm kiếm/format trang customer FR-05, checkout hoặc mobile. Login và category có sẵn chỉ là fixture/dependency. Không áp thêm yêu cầu xác nhận xóa từ FR-07 cho FR-15.

## Cấu trúc file và trách nhiệm

Các đường dẫn dưới đây tính từ root repository; file mới chỉ tạo khi thực hiện task tương ứng.

| File/thư mục mới | Trách nhiệm |
|---|---|
| `docs/testing/fr15/requirements.md` | Test basis, rule register, types/units, oracle status, ambiguity register. |
| `docs/testing/fr15/domain-model.md` | Predicate/miền, biên, dẫn xuất điểm On/Off/In và nghĩa vụ đa biến. |
| `docs/testing/fr15/domain-cases.md` | Ca nguồn DT đầy đủ, lý do chọn và traceability. |
| `docs/testing/fr15/bva-report.md` | Dẫn xuất partition → endpoint → neighbor → union → ca BVA. |
| `tests/fr15/source-cases.json` | Ca nguồn có namespace DT/BVA/SUP; thêm ca BVA tại Task 3. |
| `tests/fr15/obligations.json` | Nghĩa vụ có ID, rule, layer, action, technique, tọa độ/giá trị, oracle status; chưa giải được phải có reason riêng. |
| `tests/fr15/fixtures.json` | Payload/reference state, categories, sản phẩm A/B/C và các biến thể cần reset. |
| `tests/fr15/suite.json` | Case canonical đã review, đa nhãn technique; không ghi đè actual vào file frozen. |
| `tests/fr15/validate-suite.cjs` | Kiểm tra schema, truy vết, mapping, hash và reconcile kết quả; có self-check với dữ liệu tốt/xấu. |
| `docs/testing/fr15/suite-review.md` | Dedup ledger, mapping source → canonical → technique/obligation, hash và review gates. |
| `tests/fr15/prepare-environment.cjs` | Sao chép backend nguyên trạng, kiểm tra đường dẫn/process/DB, manifest chuẩn bị; không khởi động backend gốc. |
| `tests/fr15/fixture-store.cjs` | Reset/snapshot SQLite riêng sau startup; dùng chung giữa API runner và CLI gọi từ Python. |
| `tests/fr15/run-products-api.cjs` | Execute mọi case API trong suite, không fail-fast; request/response và state trước/sau. |
| `tests/fr15/run-products-web.py` | Execute mọi case WEB bằng UI thật; DOM, screenshot, dialog/network và trạng thái trước/sau reload. |
| `tests/fr15/run-all.cjs` | Sở hữu lifecycle của process test, readiness, reset, chạy API rồi WEB và cleanup process do chính nó tạo. |
| `docs/testing/fr15/evidence/<runId>/` | `manifest.json`, `api/observations.json`, `web/observations.json`, screenshots và logs. |
| `docs/testing/fr15/test-results.md`, `bugs.md` | Verdict cuối theo case, coverage executed, bug quan sát được và evidence. |
| `docs/testing/fr15/ai-interactions.jsonl`, `ai-interactions.md` | Append-only prompt/output/review có provenance; export Markdown. |
| `docs/testing/fr15/ai-gap-analysis.md`, `README.md`, `commit-log.txt` | Gap evidence, critique, thống kê duy nhất, giới hạn và commit history. |

**Input đọc, không sửa:** `README.md`, `api_specification.md`, assignment PDF, `AGENTS.md`, `backend/server.js`, `backend/database.js`, `backend/package*.json`, `frontend-admin/src/App.jsx`, `frontend-admin/package*.json`, `frontend-admin/vite.config.js`. Tham khảo cấu trúc `tests/fr07/` nhưng không dùng runner FR-07 hoặc schema fixture thiếu bảng làm môi trường FR-15.

**Planning audit:** lưu cạnh plan tại `2026-10-15-fr15-domain-testing-bva-audit.jsonl` và bản export `.md`; khi execution, dẫn chiếu provenance này từ audit FR-15, không dựng lại lịch sử hoặc review của người học.

## Task 1 — Phân tích requirement

**Files:** Create `docs/testing/fr15/requirements.md`, `tests/fr15/fixtures.json`; bắt đầu audit execution tại `docs/testing/fr15/ai-interactions.jsonl`.

**Interfaces:** Consumes các nguồn Spec ở header. Produces rule register `FR15-R01..R08`, dependency `FR12-DEP-WRITE`, ambiguity IDs `FR15-AMB-*`, fixture keys `baseline`, `empty-products`, `single-product`, `empty-categories`.

- [ ] **1.1 Đọc lại nguồn và khóa rule trước implementation.** Ghi nguồn theo heading/dòng: R01 Create, R02 Read list/detail phục vụ CRUD, R03 Update, R04 Delete, R05 tên bắt buộc/≤255, R06 giá bắt buộc/số/>0, R07 category bắt buộc/thuộc danh sách, R08 chỉ target thay đổi khi Update. Ghi CRUD postcondition dẫn xuất và dependency quyền riêng; không gộp chúng thành rule tự phát.
- [ ] **1.2 Lập bảng input/state.** Ghi `name` là chuỗi, `L` là độ dài không âm, `price` là số hữu hạn với resolution chưa quy định, `category_id` là membership, action C/R/U/D, token/role, target ID, tập product/category trước thao tác. `description,imageUrl` giữ nominal; không tự thêm requiredness hay URL/max-length validation.
- [ ] **1.3 Ghi ambiguity và cách xử lý cụ thể.** Gồm cách đếm Unicode/trim whitespace; precision và maximum giá; JSON numeric string từ form; quy tắc kiểu ID; PUT thiếu field; response/status/error copy; update/delete/read ID không tồn tại; xóa product đang được tham chiếu. Quy tắc chắc chắn vẫn được test với oracle nghiệp vụ dù chưa có HTTP error code cụ thể. Chi tiết chưa được đặc tả thành probe riêng, không tự kỳ vọng 400/401/403/404 hay copy thông báo chính xác.
- [ ] **1.4 Chọn fixture tái lập.** Categories IDs `{10,20}`, ID `15` vắng mặt; products A=`101`, B=`202`, C=`303`, tên ASCII khác nhau, giá lần lượt `100000,200000,300000`, category `10,20,10`, description khác nhau, `imageUrl` dùng data URL PNG cố định. Baseline name mới là `"A".repeat(128)`, price `100000`, category `10`; hai tài khoản admin/user lấy từ seed của bản sao. Token sinh bằng login và được che khỏi evidence. `empty-categories` dùng trạng thái products rỗng để tránh fixture orphan ngoài ý muốn.
- [ ] **1.5 Khóa method và trạng thái oracle.** Kiểm tra có slide bổ sung không; nếu chưa có, công khai fallback như phần căn cứ. `confirmed` cho yêu cầu nguyên văn, `derived` cho hậu điều kiện CRUD có giải thích, `unresolved` cho probes. Dùng ASCII cho length chính thức, giá nguyên chỉ là lát cắt kiểm thử, không kết luận contract chỉ nhận số nguyên.
- [ ] **1.6 Review và commit.** Kiểm tra mọi rule có nguồn, fixture nhất quán và ambiguity có tác động rõ lên verdict/coverage. Dùng `git diff --check`, kiểm JSON fixture; stage đúng file của task cùng audit mới rồi commit `docs(fr15): define product CRUD requirements and test fixtures`.

**Gate:** Có oracle cho mọi rule; mọi unknown được ghi rõ, không dùng implementation để lấp chỗ trống. Chưa có actual/pass/fail.

## Task 2 — Sinh test case Domain Testing, giải thích từng bước

**Files:** Create `docs/testing/fr15/domain-model.md`, `domain-cases.md`, `tests/fr15/source-cases.json`, `obligations.json`.

**Interfaces:** Consumes rule/fixture keys từ Task 1. Produces source IDs `FR15-DT-001...`, supplementary `FR15-SUP-001...`, nghĩa vụ `FR15-OBL-DT-*`. Ca nào được claim là DT phải có domain/partition/point rationale, không chỉ có nhãn.

- [ ] **2.1 Chuyển rule thành predicate và miền bù.** Trong lát cắt string/numeric với payload đầy đủ: `N := 1 ≤ L ≤ 255`; `P := price > 0`; `C := category_id ∈ Categories`; `A := validJWT ∧ role=admin`. Create hợp lệ khi `A ∧ N ∧ P ∧ C`; Update thêm `E := target tồn tại`. Viết complement bằng OR các điều kiện sai, tách các vùng invalid và các input sai kiểu/thiếu ngoài lát cắt. Read/Delete cần mô hình operation riêng, không chịu validation name/price của body C/U.
- [ ] **2.2 Phân hoạch và xác định biên.** Name rỗng/valid/quá dài; price âm/0/dương; category tồn tại/không tồn tại/thiếu; auth admin/user/no-token/invalid-token; target tồn tại/vắng. Name và price có thứ tự; auth/category/target là partition trạng thái hoặc categorical. Không xem category `10..20` là một khoảng hợp lệ.
- [ ] **2.3 Chọn điểm In và đánh giá toàn bộ predicate.** Reference `(L=128,p=100000,c=10,A=true,E=true)` cho Update A, bỏ E cho Create. Với mỗi điểm ghi tuple đầy đủ, giá trị chân lý N/P/C/A/E, accept/reject kỳ vọng và hậu điều kiện. Không để predicate khác sai che lỗi đang xét.
- [ ] **2.4 Dẫn xuất On/Off/In trên từng mặt.** Name lower: On `L=1` accept, Off `0` reject và `2` accept; upper: On `255` accept, Off `254` accept và `256` reject. Price: On `p=0` **reject** do bất đẳng thức nghiêm; hai phía `-1,+1` là probe biểu diễn được, In `100000` accept. Không gọi ±1 là lân cận gần nhất trên toàn miền giá chưa biết precision. Category/auth chỉ chọn đại diện partition, không giả nhãn On/Off số học.
- [ ] **2.5 Lấy nhiều điểm trên mặt để tìm tương tác.** Với mặt `L=255`, dùng các mức price `1` và `100000`, perturb L sang `254,256`; với mặt `p=0`, dùng L `1,128,255`, perturb p sang `-1,+1`. Các mặt độc lập từ requirement, chưa có biên nghiêng/coupled `L+p=k`; giải thích vì sao lấy các lát cắt và giới hạn sampling thay vì tự tạo predicate liên biến.
- [ ] **2.6 Thêm giao điểm và tổ hợp có lý do.** Góc `(1,0)` và `(255,0)` reject vì price; các điểm phía trong `(1,1)`, `(255,1)` accept; phía ngoài `(0,1)`, `(256,1)` reject vì name. Thêm multi-fault `(256,0)` sau các single-fault, ghi rõ không dùng nó thay coverage hai rule cô lập. Lặp các nghĩa vụ validation cho **Create và Update**, với auth/category còn lại hợp lệ.
- [ ] **2.7 Mô hình đầy đủ CRUD và tính cô lập.** Read: empty/list nhiều product, đọc A/B có giá trị phân biệt. Create: thêm đúng một bản ghi đọc lại được. Update: lần lượt sửa A rồi B trong fixture reset riêng; đổi từng field rồi toàn bộ payload, so sánh các field đang render của product không phải target ngay trên UI và sau reload, đồng thời so sánh toàn bộ field qua API/DB. Không suy field ẩn từ screenshot. Delete: xóa A trong tập nhiều product rồi case xóa product cuối, xác nhận membership và phần còn lại. Những hậu điều kiện dẫn xuất từ CRUD phải được đánh dấu `derived`.
- [ ] **2.8 Thêm partition có rủi ro và phân tầng.** API C/U: từng field name/price/category bị omitted/null/empty, price âm/0/non-numeric, category ID 15, category 20 để tránh chỉ test default 10. Auth: no-token, invalid-token, valid-user, valid-admin cho C/U/D với payload hợp lệ. WEB: CRUD qua form thực, tên/giá rỗng hoặc sai, chủ động chọn cả hai category; thêm case danh sách category rỗng, name/price hợp lệ vẫn không được tạo product thiếu category. Input không tạo được bằng thao tác UI bình thường chỉ có ca API; không sửa DOM để giả thành UI coverage. Whitespace/Unicode/numeric-string/ID vắng nằm trong supplementary probes nếu oracle chưa rõ.
- [ ] **2.9 Ghi case và coverage thiết kế.** Mỗi case có đầy đủ schema Task 4, `actual=null`, `status="Not Run"`, `evidence=[]`; action/layer là chiều traceability. Bảng obligation → nguồn case phải phân biệt điểm cô lập, điểm nhiều lỗi và operation/state partition; chưa suy ra pass/fail.
- [ ] **2.10 Review và commit.** Tự tính lại predicate ở mọi điểm, kiểm feasible fixtures, JSON hợp lệ và `git diff --check`; commit `test(fr15): derive product CRUD domain cases and obligations`.

**Gate:** Báo cáo có chuỗi rule → predicate → miền/biên → chọn điểm → đánh giá → ca → coverage; không nộp riêng bảng case cuối.

## Task 3 — Sinh test case BVA, giải thích từng bước

**Files:** Create `docs/testing/fr15/bva-report.md`; Modify `tests/fr15/source-cases.json`, `obligations.json`.

**Interfaces:** Consumes R05/R06, type/resolution và nominal fixture; produces `FR15-BVA-001...`, nghĩa vụ `FR15-OBL-BVA-*`, endpoint-to-neighbor mapping. Không tái diễn giải category IDs hoặc role thành biên số.

- [ ] **3.1 Công bố variant/universe.** Nếu slide chưa xác định convention, dùng ISTQB 3-value BVA theo reference của skill. Name: universe length `N₀`, bước 1, ASCII. Price: toàn miền chưa rõ precision; tách lát cắt integer `Z` để phân tích có điều kiện và giữ phần adjacency toàn miền là unresolved.
- [ ] **3.2 Lập ordered partitions gồm invalid.** Name `{0}`, `[1,255]`, `[256,+∞)`; endpoints hữu hạn `{0,1,255,256}`. Không sinh độ dài -1; infinity không phải endpoint hữu hạn. Giá nguyên: invalid `(-∞,0]`, valid `[1,+∞)`, endpoints `0,1`. Không tự sinh upper price boundary.
- [ ] **3.3 Dẫn xuất neighbor cho từng endpoint, trước dedup.** Name: `0→{0,1}`, `1→{0,1,2}`, `255→{254,255,256}`, `256→{255,256,257}`. Hợp tập **`{0,1,2,254,255,256,257}`**, 7 giá trị mỗi action/layer được khai báo khả thi. Empty length bị reject; 1..255 accept; 256/257 reject.
- [ ] **3.4 Làm rõ BVA của price.** Trên lát cắt Z: `0→{-1,0,1}`, `1→{0,1,2}`, union **`{-1,0,1,2}`**, -1/0 reject và 1/2 accept. Đây là 4 nghĩa vụ **integer-slice**, không phải chứng minh adjacency giá nói chung. `0.01`, epsilon hoặc `step=1` thấy trong UI/DB không được tự nâng thành precision requirement. Thêm các số dương phân số làm probe nếu cần; chỉ lập full-domain neighbor BVA sau khi có contract/slide xác nhận bước biểu diễn.
- [ ] **3.5 Tạo fixture từng ca, giữ điều kiện khác nominal.** Với mỗi giá trị, nêu rule, partition/endpoint đã dẫn xuất nó, action Create hoặc Update và layer API hoặc WEB; tên thực là `"A".repeat(L)` và kiểm đúng độ dài trước chạy. Price nominal `100000`, category 10, admin hợp lệ; khi test price thì L=128. Update có A/B/C để kiểm không thay đổi bản ghi khác.
- [ ] **3.6 Tách supplementary khỏi BVA.** Missing/null/wrong-type, whitespace/Unicode chưa rõ và category membership không được cộng vào BVA denominator. Ca UI gửi numeric string phải lưu cả field value và payload thực; thiếu schema kiểu JSON không đủ để kết luận mọi numeric string là lỗi nghiệp vụ.
- [ ] **3.7 Lập coverage và đối chiếu DT.** Mẫu số keyed theo `(rule,dimension,value,action,layer,universe)`; giữ mapping mọi endpoint khi giá trị trùng. Với phần hữu hạn name trên API C/U: 7×2 = 14 nghĩa vụ; WEB C/U cũng có 14 nghĩa vụ thiết kế, còn khả năng đưa input quá dài phụ thuộc UI thực. Price integer-slice có 4×2=8 nghĩa vụ mỗi layer nếu khả thi. Đây là số nghĩa vụ theo lát cắt, **không phải tổng case canonical** hay 100% FR-15. Ghi riêng phần full-price precision và Unicode chưa giải được.
- [ ] **3.8 Review và commit.** Tính lại union, kiểm 257 không bị bỏ sót, không có length âm/cận giá giả; JSON parse và whitespace check; commit `test(fr15): derive product name and price boundary cases`.

**Gate:** Báo cáo có universe/resolution → ordered partitions → endpoints → từng neighborhood → union → fixture → traceability/coverage; giải thích khác biệt giữa `{-1,0,1}` probe quanh threshold và full endpoint union trên integer slice.

## Task 4 — Review, deduplicate và liên kết technique

**Files:** Create `tests/fr15/suite.json`, `validate-suite.cjs`, `docs/testing/fr15/suite-review.md`; Modify source cases/obligations nếu self-review tìm gap.

**Interfaces:** `validate-suite.cjs` có CLI `--self-check`, `--suite <json> --sources <json> --obligations <json>`, và thêm `--results <run-directory>` để reconcile. Exit 0 = dữ liệu hợp lệ; exit 1 = lỗi schema/mapping/reconciliation. Không coi SUT test Fail là lỗi cấu trúc kết quả.

- [ ] **4.1 Chốt schema canonical.** Dùng fields `id,sourceCaseIds,techniques,layer,action,rules,obligations,oracleStatus,preconditions,fixtureKey,input,steps,expected,dependencies,actual,status,evidence`. `id=FR15-TC-NNN`; techniques thuộc `Domain Testing/BVA/Supplementary`; layer `API/WEB`; oracle `confirmed/derived/unresolved`; input chứa payload/target hoặc generator đã materialize khi chạy. `expected` gồm assertions nghiệp vụ và hậu điều kiện state. Giữ frozen suite `actual=null,status="Not Run",evidence=[]` suốt execution.
- [ ] **4.2 Xác định dedup key và ghi quyết định.** Chỉ gộp nếu layer + action + preconditions + fixture/input + steps + expected assertions tương đương. Ví dụ DT upper-name On và BVA L=255 cho Create API có thể dùng chung case, giữ cả hai source IDs, techniques và obligations. Update khác Create, WEB khác API, valid/invalid category, hay kiểm immediate/reload có assertion khác đều không tự bị gộp. Không xóa ID nguồn; một source case map đúng một canonical case.
- [ ] **4.3 Thực hiện review 5 focus và correction ledger.** Kiểm CRUD đủ C/R/U/D; mọi validation trên C/U; các góc đa biến không che single-rule; dependency quyền chỉ product mutations; update A/B có đối chứng B/C/A; không mượn delete-confirm spec từ FR-07; endpoint union của BVA đầy đủ. Mọi sửa ghi before/after, lý do, nguồn và reviewer thực. AI self-review và learner review là hai mục khác nhau; learner chưa phản hồi thì `Pending learner review`.
- [ ] **4.4 Kiểm validator bằng self-check có case lỗi.** Reject duplicate ID, mất source/obligation, technique mismatch, missing precondition/expected/evidence field, fixture không tồn tại, unknown rule, frozen status giả Passed. Sau đó xác minh suite thật có mapping toàn bộ nghĩa vụ đã giải quyết và danh sách nghĩa vụ/probe chưa giải quyết có reason; không đòi các gaps unresolved phải được đánh dấu covered.
- [ ] **4.5 Đóng băng suite.** Chạy `node tests/fr15/validate-suite.cjs --self-check`, rồi `node tests/fr15/validate-suite.cjs --suite tests/fr15/suite.json --sources tests/fr15/source-cases.json --obligations tests/fr15/obligations.json`. Exit 0, zero validation errors; ghi SHA-256 của suite/source/obligations, số ca nguồn và canonical theo layer/action/technique. Không cộng số ca DT+BVA để ra unique cases khi có overlap.
- [ ] **4.6 Commit.** Kiểm diff và commit `test(fr15): freeze reviewed product CRUD suite with traceability`.

**Gate:** Mọi case nguồn được map; mỗi coverage claim có obligation/case cụ thể; baseline vẫn Not Run. Nếu được người học review thì lưu phản hồi thật; không tự tạo một bước “human approved”.

## Task 5 — Execute toàn bộ test suite trên môi trường cô lập

**Files:** Create các runner/environment/fixture files trong file map; Create `docs/testing/fr15/evidence/fr15-run01/`.

**Interfaces:**

- `prepare-environment.cjs --root <runRoot>` tạo `<runRoot>/backend/` cùng preparation manifest, sao chép `server.js,database.js,package.json,package-lock.json` nguyên byte; dependency chỉ liên kết `node_modules` hoặc `npm ci` trong bản sao khi cần. DB không được symlink/hardlink về DB gốc.
- `fixture-store.cjs --backend-dir <dir> --reset <fixtureKey> --fixtures <json>` reset sau startup; `--snapshot <path>` xuất products sorted by ID, đủ 6 fields `id,name,price,description,imageUrl,category_id`. Import Node qua `resetFixture(backendDir, fixturesPath, fixtureKey): Promise<void>` và `snapshotProducts(backendDir): Promise<Product[]>`. Từ chối mọi đường dẫn nằm trong backend gốc và các symlink alias tới đó.
- `run-products-api.cjs` và `run-products-web.py` nhận `--suite`, `--backend-dir`, `--base-url`, `--out`, `--run-id`; Python thêm `--api-url`. Chọn đúng subset `layer` trong suite, không hardcode chỉ một vài ID. Kết quả là array observation có `caseId,runId,attempted,startedAt,endedAt,inputIntended,inputEffective,request,response,stateBefore,stateAfter,uiBeforeReload,uiAfterReload,actual,status,blockReason,evidence,exercisedObligations`.
- `run-all.cjs --suite <json> --root <runRoot> --out <evidenceDir> --run-id <id>` chuẩn bị, start/wait, chạy API rồi WEB, reconcile và dừng process do mình tạo trong `finally`. Exit 0 khi mọi test có oracle đều Passed và không còn Blocked/Not Run; exit 1 khi có observed Failed; exit 2 khi có lỗi môi trường/oracle/harness hay case chưa chạy. Không che exit code; runner tiếp tục các case độc lập khi có Fail.

- [ ] **5.1 Viết và kiểm tra guard môi trường trước startup.** Dùng path ngẫu nhiên mới dưới `/private/tmp/eshop-fr15-*`; từ chối thư mục có sẵn thuộc run khác, path gốc hoặc symlink/hardlink tới dữ liệu gốc. Ghi hash `backend/database.sqlite` và các sidecar SQLite nếu có, git commit/dirty paths, source hashes, runtime versions và lockfile hashes. Hash trước/sau chỉ hỗ trợ kiểm tra; bảo vệ chính là path/process identity. Không sửa `.gitignore` có thay đổi của người dùng.
- [ ] **5.2 Kiểm guard/harness bằng self-check nhỏ.** `prepare-environment.cjs --self-check` phải từ chối target backend gốc và symlink alias; `fixture-store.cjs --self-check` kiểm reset chỉ DB riêng; `run-all.cjs --self-check` kiểm không bỏ case sau Fail và ghi Blocked khi startup/runner lỗi. Các self-check dùng thư mục tạm của test; chỉ harness được sửa để đạt check, không sửa business logic SUT.
- [ ] **5.3 Xác minh port và dependency.** Kiểm process sở hữu 3000/5174; không kill/reuse server lạ hoặc gọi request ghi vào nó. Nếu không thể dành port cho bản sao nguyên trạng, ghi environment blocker. Dùng bundled Python/Playwright được xác minh; dependency npm thiếu thì `npm ci` theo lockfile đúng component, ghi mọi cài đặt/permission cần thiết. Không lấy backend `npm test` placeholder làm bằng chứng suite.
- [ ] **5.4 Khởi động đúng bản sao và đợi seed hoàn tất.** Run-all start Node với cwd `<runRoot>/backend`; Admin `npm run dev -- --host 127.0.0.1` trong `frontend-admin/`. Xác minh PID/cwd và port match manifest; poll readiness có timeout, query xác nhận initialization SQLite đã xong rồi mới reset fixture. Không seed fixture trước import `database.js` vì startup sẽ xóa nó. Không restart backend giữa bước đang đo nếu chưa reset lại fixture.
- [ ] **5.5 Execute mọi API case.** Trước từng case reset fixture, chụp state, login nếu cần rồi gửi đúng endpoint/payload/token partition. So sánh cả HTTP/body và thay đổi products: invalid không ghi; Create thêm đúng một ID; Update đúng target; Delete mất đúng target. Token lỗi/user/no-token phải giữ dữ liệu. Mỗi case độc lập lưu request/response đã redact, actual và verdict có căn cứ; lỗi assertion không làm bỏ các case sau.
- [ ] **5.6 Execute mọi WEB case bằng UI thật.** Áp dụng skill `webapp-testing` khi thực thi, inspect DOM sau khi React tải. Dùng tab Sản phẩm, placeholders `Tên sản phẩm`, `Giá tiền`, nút `Lưu sản phẩm`, `Sửa`, `Xóa`; scope vào form/product row dựa trên dữ liệu nhận diện, không dùng `.first` tùy tiện khi trùng. Mỗi case context mới/fixture reset; login Admin qua UI; chọn category 10/20 chủ động vì default form là ID 1 không thuộc fixture; lưu console, network, browser validity và dialog. Các API Admin khác bị gọi khi UI tải chỉ là dependency, không mở scope test chúng.
- [ ] **5.7 Kiểm Update ở ba thời điểm.** Chụp A/B/C trước; sửa A; sau khi save/response ổn định, chụp DOM ngay **trước mọi reload/refetch**, đối chiếu DB + API trong lúc giữ UI; sau đó reload và chụp lại. Lặp với B để tránh pass tình cờ theo vị trí đầu danh sách. Ghi từng assertion riêng: lỗi UI không đồng nghĩa DB đã hỏng, DB đúng không đủ kết luận UI đúng.
- [ ] **5.8 Ghi input thực và khả năng bị chặn.** Nếu native HTML validation chặn submit đúng requirement, case validation có thể Passed với evidence không gửi request và DB nguyên vẹn. Nếu nhập 256 bị truncate thành 255, ghi intended/effective riêng; không claim BVA value 256 đã tới validator/API. Nếu thao tác không thể tạo input bằng UI, ghi rõ obligation thực tế chưa exercised và giữ API case tương ứng. Unresolved probe được quan sát riêng; không tự cho Passed/Failed khi chưa có oracle, dùng Blocked với reason `oracle-unresolved` cho phần assertion còn thiếu.
- [ ] **5.9 Chạy và reconcile toàn suite.** Sau self-check và validate Task 4, chạy `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-run01 --out docs/testing/fr15/evidence/fr15-run01 --run-id fr15-run01`; root phải mới và chưa tồn tại. Mỗi canonical ID có observation hoặc record Blocked cụ thể; crash được tổng hợp, không âm thầm bỏ case. Runner không overwrite run đã có; rerun dùng run02 và giữ run01. Manifest ghi timestamps thực, timezone, browser viewport/locale, URLs, PID/cwd, source/suite hashes, reset strategy và số case từng trạng thái.
- [ ] **5.10 Kiểm toàn vẹn và commit execution.** Xác minh DB gốc/sidecars không bị thay bởi tiến trình test, frozen suite hash không đổi, bằng chứng có thật và token đã che. Chạy validator `--results docs/testing/fr15/evidence/fr15-run01`; exit 0 nghĩa là đối soát đầy đủ dù suite phát hiện SUT Fail. Dừng đúng process do runner tạo; commit `test(fr15): execute isolated product CRUD suite and capture evidence`.

**Gate:** “Execute toàn bộ” nghĩa là mọi case canonical đều được attempt/giải trình; muốn tuyên bố thực thi đầy đủ phải không còn Blocked/Not Run. Case bị chặn phải có reason và hành động tháo chặn, không ép pass hoặc xóa khỏi denominator. Execution hoàn tất không có nghĩa SUT pass.

## Task 6 — Ghi actual result / pass-fail / bug

**Files:** Create `docs/testing/fr15/test-results.md`, `bugs.md`; update validator nếu cần logic reconcile đã được self-check.

**Interfaces:** Consumes frozen suite + observations + manifest; produces một dòng verdict mỗi canonical case, assertion-level failures, bug IDs `FR15-BUG-001...`, mapping case → bug → evidence.

- [ ] **6.1 Đối soát actual với oracle.** Từ từng observation tạo bảng ID, rule, technique(s), layer/action, preconditions/fixture, expected, actual, status, evidence. Dẫn liên kết payload/log/screenshot thực. Giữ nguyên raw evidence; bất kỳ đánh giá lại phải có correction entry, lý do và không sửa lịch sử chạy.
- [ ] **6.2 Áp dụng verdict nhất quán.** Passed khi tất cả assertion có oracle đạt; Failed khi có mismatch quan sát được; Blocked khi chưa thể đánh giá vì environment/dependency/oracle; Not Run khi chưa attempt. Thiếu response error code contract chỉ giới hạn assertion code, không cản kết luận vi phạm dữ liệu nghiệp vụ rõ ràng. Static suspicion nằm riêng, không tính bug đã xác nhận.
- [ ] **6.3 Viết từng bug quan sát được.** Summary, severity có lý do, rule/source, interface/build/environment, fixture, steps tối thiểu, expected/actual, affected case IDs, evidence trước/sau và reproduction. Một root cause gây nhiều case fail có thể chung bug; UI mass-change và DB mass-change chỉ gộp nếu có bằng chứng liên hệ. API bug phải có request/response và state; chụp bằng chứng UI nếu tái hiện UI được, không dựng screenshot không có thật.
- [ ] **6.4 Tính thống kê và coverage.** `Designed=|canonical IDs|`; `Executed=Passed+Failed`; `Designed=Passed+Failed+Blocked+NotRun`; `NotYetExecuted=Blocked+NotRun` theo định nghĩa phán quyết, kèm `Attempted` và số probe đã quan sát nhưng còn thiếu oracle. Với mỗi tập nghĩa vụ đã xác định `O`, coverage thiết kế là `|mapped(O)|/|O|`, thực thi là `|exercised(O)|/|O|`; tách layer/action/universe và liệt kê riêng unresolved obligations ngoài tập hữu hạn này. Failed có thể exercised obligation nếu đã tới assertion, Blocked không tự được cộng. Ghi riêng UI prevention coverage so với effective-value delivery coverage; không tuyên bố full precision/Unicode coverage.
- [ ] **6.5 Review và commit.** Kiểm mọi evidence path tồn tại, mỗi Failed có bug hoặc phân loại rõ harness/oracle issue, số đếm khớp validator, `git diff --check`; commit `docs(fr15): report product CRUD results and observed defects`. GitHub Issues chỉ là backlog chờ authorization; không tự publish.

**Gate:** Không có phán quyết dựa trên bảng thiết kế hoặc đọc code; báo cáo giữ được khác biệt API/UI/DB và Pass/Fail/Blocked/Not Run.

## Task 7 — AI gap analysis và tổng hợp FR-15

**Files:** Create `docs/testing/fr15/ai-gap-analysis.md`, `README.md`, `commit-log.txt`; append/export `ai-interactions.jsonl`, `ai-interactions.md`.

**Interfaces:** Consumes các snapshot ca nguồn, review ledger, execution/bug evidence, planning audit và phản hồi learner thực; produces gap → bổ sung → case/obligation → rerun trace, critique dựa bằng chứng và thống kê cuối.

- [ ] **7.1 Ghi interaction theo từng bước ngay khi thực hiện.** Dùng skill `ai-audit`, log prompt/output khả dụng, tool/model nếu biết, `occurred_at` nếu có bằng chứng, `recorded_at` có timezone, capture extent và artifact references. Không dùng thời gian hiện tại làm timestamp lịch sử; không tự suy model. Bản gốc, AI self-review và learner review tách nhau; chưa có learner feedback giữ Pending. Audit bước 7 nối tiếp log đã tạo từ Task 1, không dựng log toàn bộ vào cuối.
- [ ] **7.2 Đối chiếu output AI ban đầu với requirement và quan sát.** Với từng gap ghi original interaction/source case version, phần bị thiếu/sai, nguồn phát hiện, before/after, rule/obligation/case bổ sung và evidence. Các risk cần kiểm: bỏ Update validation, gộp mất layer/action, bỏ endpoint 257, coi category là BVA, precision tự đặt, bỏ UI trước reload. Chỉ gọi chúng là omission đã xảy ra nếu có snapshot chứng minh; còn lại là preventive checklist.
- [ ] **7.3 Phân tích nguyên nhân có giới hạn.** Tách sự kiện quan sát được khỏi giả thuyết nguyên nhân (prompt thiếu, model limitation, state complexity); không tự khẳng định nội tâm mô hình hoặc học viên đã sửa gì. Không tuyên bố AI “bỏ sót bug” nếu không chứng minh bug nằm ngoài output ban đầu và đã tái hiện được. Không tìm được missed case/bug thì báo chưa có bằng chứng, nêu giới hạn review.
- [ ] **7.4 Bổ sung và rerun khi gap có tác động.** Quay về artifact Task 1–4 bị ảnh hưởng, thêm commit correction có tên cụ thể; giữ suite/run cũ, tăng version/hash và run ID. Chạy toàn bộ suite mới nếu thay đổi mô hình/fixture/harness ảnh hưởng chéo, rồi reconcile và cập nhật results/bugs. Không đóng task với ca bổ sung còn Not Run mà vẫn tuyên bố full execution.
- [ ] **7.5 Viết critique và summary.** Đoạn AI Critique 200–300 từ dựa trên sự kiện được log, ghi cách đếm từ; là bản AI hỗ trợ soạn chờ learner review. README ghi một feature FR-15, unique designed/executed/pass/fail/blocked/not-run, bugs, coverage và giới hạn, đường dẫn artifacts và demo “chưa có” nếu chưa quay. Không bịa tự đánh giá của sinh viên, demo URL, issue URL, deadline Moodle hay phân bổ nhóm.
- [ ] **7.6 Verification và commit.** Validate suite/results lại khi có thay đổi, kiểm links/JSON/whitespace và critique word count, export audit với filename phiên bản mới nếu helper từ chối overwrite. Commit `docs(fr15): analyze evidenced AI gaps and summarize CRUD testing`; sau đó xuất `git log --date=iso-strict --format=fuller -- docs/testing/fr15 tests/fr15 docs/superpowers/plans/2026-10-15-fr15-domain-testing-bva.md` vào commit-log.txt. Commit riêng `docs(fr15): export product CRUD testing commit history` nếu log mới thay đổi; ghi cutoff rõ vì file không thể tự chứa hash commit đang mang chính nó.

**Gate:** Có gap analysis có căn cứ, audit ghi giới hạn capture và learner review thật hoặc Pending; summary tự đối soát. Markdown/PDF reports, AI Audit/Critique PDF và screenshot GitHub Issues là checklist khi ghép vào submission HW02 đầy đủ, không đồng nghĩa plan FR-15 đã tạo hoặc nộp chúng. Khi được yêu cầu xuất PDF, dùng skill `pdf`, render và kiểm tra trực quan trước giao.

## Verification checklist của plan (self-review, chưa phải kết quả execution)

- Đã map bảy bước yêu cầu thành Task 1–7 theo đúng thứ tự; Task 2–3 yêu cầu giải thích kỹ thuật ngoài bảng case.
- R01 Create → Task 2.7/5.5–5.6; R02 Read → Task 2.7/5; R03 Update và R08 isolation → Task 2.7/5.7; R04 Delete → Task 2.7/5.
- R05 name → Task 2.4/3.2–3.3; R06 price → Task 2.4/3.4; R07 category → Task 1.4/2.2/2.8; FR12 dependency → Task 2.8/5.5.
- Năm Review Focus đều có bước/case obligation phải sinh; method, type, fixture key, CLI, path, status và coverage denominator được định nghĩa nhất quán.
- Chưa có slide, precision giá, Unicode unit, missing-ID/error contract, learner review hoặc bằng chứng execution: được giữ là limitation/gate cụ thể, không bị coi đã hoàn tất.
- Chỉ tài liệu plan/audit được tạo trong lượt lập kế hoạch; code ứng dụng, test suite và test results chưa được triển khai.

## Execution handoff

Đọc plan và các nguồn Spec trước execution. Đề xuất **Native** trong chat hiện tại vì bảy task phụ thuộc cùng rule register, fixture, source mapping và frozen suite; thay đổi mô hình phải được truyền xuyên suốt. Native triển khai tuần tự, có một reviewer độc lập ở cuối theo skill execution được chọn. **Subagent-driven** là lựa chọn nếu người dùng muốn từng task có implementer/reviewer riêng; phải dùng skill tương ứng và giữ task phụ thuộc theo thứ tự.

Theo mục **Execution Handoff** của skill `superpowers:writing-plans`, chờ người dùng review plan và chọn cách execution trước khi bắt đầu Task 1. Bước chờ này thuộc workflow lập kế hoạch được người dùng gọi; chưa phải phê duyệt bug, publish hay thay đổi SUT.
```

Pending learner review.

## Interaction fr15-native-final-review-fix

```text
{
  "tool": "Codex",
  "task": "FR15 final-review-fix",
  "recorded_at": "2026-10-15T22:43:34+07:00",
  "source": "Current chat Native authorization; per-task artifact output captured now, not a verbatim session transcript. Historical timestamp/model unknown; no learner technical review supplied.",
  "capture": "partial"
}
```

### Original prompt

```text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md)  theo dạng Native
```

### Original AI output

```text
docs/testing/fr15/final-review.md
# FR15 — Independent final review and disposition

Reviewer: fresh-context `gpt-6-astra`, high reasoning, dispatched through collaboration under Native executing-plans. Read-only range 6e29712..c0623d2; later 5f9c73b changes only commit-log. No implementer/reviewer per task. Original reviewer assessment below applies to pre-fix run02, not a second review of fixes.

## Reviewer findings (captured summary; full returned wording in chat)

Strengths: layer/action traceability and category/precision limits clear; immediate/reload separated from DB; SUT unchanged; run02 reconciled and 15 harness checks passed.

- Critical: none.
- Important 1: run-products-web.py snapshots omit img src and assessor compares name/price/alt only, so rendered-image preservation is not established. Reviewer demonstrated an incorrect image source could pass.
- Important 2: absent response makes !success true, allowing missing network/handler action to masquerade as rejection. Existing four Passed rejection cases had actual HTML prevention; no existing verdict shown false by this defect.
- Minor: none.
- Original assessment: Not ready without fixes.

Declined to judge: fixing five SUT bug groups; exact fractional/Unicode/trim/missing-target outcome; PDF/GitHub/demo/full submission; existing FR03/.gitignore changes; browsers/native beyond Chromium Admin Web.

## Executor re-grade and single fix pass

Both Important findings accepted. Added wrong-image and missing-response regressions, watched both fail, then captured/compared src and required HTML prevention or an actual response; missing rejection evidence becomes Blocked. Existing image-independent regression now supplies correct src values to keep its original name-drift purpose.

Additional ruling on a declined item: exact representable 0.5 is numeric >0. Unknown precision limits nearest-neighbor BVA, not acceptance of this fixed value. Four Supplementary C/U API/WEB cases now use confirmed accept oracle (freeze v3), with a consumer regression that failed under old unresolved oracle then passed. Unicode/trim and missing-target response contracts remain unresolved.

All 18 harness checks passed after fixes; real-browser delayed-DOM synchronization regression previously passed and its settling behavior is unchanged. Full suite rerun in run03 with new suite/harness hashes, retaining run01/run02 raw evidence. Final current totals are in test-results.md and run03 manifest; do not reuse pre-fix totals from reviewer assessment.

No second reviewer dispatched, per executing-plans one-pass rule. No minors deferred. No SUT source changed, no publishing or integration performed.


docs/testing/fr15/execution-decisions.md
# FR15 — Rulings and verification ledger

All rulings in chronological order, with costs if wrong. No minors deferred by independent review.

- Ruling: Worktree write denied by sandbox; use existing non-main branch hw02-domain-testing, adding only FR15 paths; native unused worktree archived — skill fallback and preservation of unrelated FR03 edits — cost if wrong: FR15 commits share branch history.

- Ruling: No business fixes. TDD red/green applies to harness behavior; human prose/schema datasets are reviewed, SUT failures remain evidence — AGENTS testing oracle overrides generic make-suite-green guidance — cost if wrong: reported failures remain in SUT intentionally.

- Ruling: Repository has no functioning root/backend suite; backend npm test is documented failing placeholder. Verify new harness and SUT suite separately — testing-only task — cost if wrong: unrelated application defects remain outside FR15.

- Task 5: Ruling: Correct invalid IDAT CRC in PNG fixture and refreeze v2 before execution; retain v1 in Git and documented old hashes — prevents unrelated image fallback — cost if wrong: fixture image change affects image-only observation, case semantics unchanged.

- Task 5: Ruling: Shared assert-products.cjs evaluator added beyond file map to keep API/Python verdict semantics consistent — same business oracle — cost if wrong: common-mode assertion bug; hand-derived assessor tests and final review mitigate.

- Task 5: Ruling: run01 Web snapshots raced React async updates (TC069 DOM had 3 rows while subsequent screenshot had 4). Preserve run01 as preliminary; add API-quiet settling and browser regression, use full run02 as final — avoids false SUT bugs — cost if wrong: 500ms quiet policy may still miss longer client-only timers; actual API requests tracked until complete.

- Task 5: Ruling: Add explicit API readback consistency assertion beyond DB snapshot to fulfill read-after-write requirement — hand-derived test RED→GREEN — cost if wrong: stricter API representation comparison; known numeric-string issue is checked only on detail with numeric normalization.

- Task 5: Ruling: git diff --cached --check warned on trailing spaces in raw runner logs; preserve logs verbatim and scope whitespace checks to authored .md/.json/.cjs/.py — evidence integrity — cost if wrong: raw-log patch whitespace warnings remain. Generic check was not green; authored-file check is green.

- Final: Ruling: Reviewer set aside SUT fixes, publishing/PDF/demo, unrelated FR03, and non-Chromium/native behavior; keep these outside selected FR15 testing scope — AGENTS and approved plan — cost if wrong: no external submission or other-platform assurance.

- Final: Ruling: Reviewer set aside fractional/Unicode/missing-target outcomes. Keep Unicode/trim and missing-target unresolved, but re-grade exact representable 0.5 acceptance as Important: price>0 admits it while unknown precision only limits BVA adjacency — cost if wrong: a later stricter course/price contract would require revising these four oracles.

## Task completion and final fix verification

- Task 1: complete (commits 6e29712..e625109, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 2: complete (commits e625109..e54872f, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 3: complete (commits e54872f..5fe4088, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 4: complete (commits 5fe4088..ef38fe2, tests: node tests/fr15/validate-suite.cjs --suite tests/fr15/suite.json --sources tests/fr15/source-cases.json --obligations tests/fr15/obligations.json → })

- Task 5: complete (commits ef38fe2..c85b6c2, tests: node tests/fr15/validate-suite.cjs --results docs/testing/fr15/evidence/fr15-run02 → })

- Task 6: complete (commits c85b6c2..dc0619a, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 7: complete (commits dc0619a..c0623d2, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Final: fixed image-source coverage — wrong-image assessor test RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

- Final: fixed missing-response rejection — no-response regression RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

- Final: fixed 0.5 oracle — canonical half-price consumer regression RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

Authored document whitespace is checked separately from raw logs; a transient export/link check was rerun after generating the final export. No application source was modified.


docs/testing/fr15/ai-gap-analysis.md
# FR15 — AI gap analysis

## Bằng chứng và phạm vi

Audit ghi các snapshot output theo task trong phiên hiện tại; capture partial, không phải complete session transcript. Model cụ thể và thời gian lịch sử prompt không biết, recorded_at có UTC+07:00. Người dùng chọn Native là authorization execution, không phải learner technical review. Learner review: Pending.

| Gap | Output ban đầu / bằng chứng | Correction và verification | Phân loại |
|---|---|---|---|
| GAP-01 | Fixtures ở commit e625109 và source/frozen v1 có IDAT CRC sai; evidence/harness/png-red.log xác nhận failure | Commit 65d30b1 sửa CRC, freeze v2 giữ old hashes trong suite-review.md; png-fixture.test.cjs GREEN | AI fixture omission được quan sát; không phải bug SUT |
| GAP-02 | run01 WEB TC069 uiBeforeReload=3 rows, screenshot chụp sau đã có 4; runner suy lỗi UI khi chưa đồng bộ | Thêm API-request quiet 500ms + hai animation frames; ui-sync.test.py từ missing behavior RED sang GREEN; run02 chạy lại toàn 158 ca | AI harness timing gap; bỏ verdict run01 khỏi bug count |
| GAP-03 | readback-red.log: assessor chưa phát hiện tình huống DB đúng nhưng API readback thiếu | Thêm api-readback-consistent trong assessor; harness 15 tests GREEN; run02 ghi DB + API readback và so sánh | Oracle assertion omission trong harness; chưa phải missed SUT bug |

Nguyên nhân có thể liên quan việc AI tập trung vào nội dung nghiệp vụ mà chưa kiểm dữ liệu nhị phân và timing của React; đây là giả thuyết từ dấu hiệu, không phải khẳng định cơ chế bên trong AI. Không có learner correction nào được cung cấp, nên không gán ba correction này cho sinh viên.

## Final review gaps và correction v3

- GAP-04 (review độc lập): UI snapshot/assessor ban đầu thiếu image src, nên không đủ bằng chứng cho image preservation. Thêm src vào cả immediate/reload, kiểm tra wrong-image từng Passed trước sửa rồi Failed đúng sau sửa. Đây là omission của assertion coverage, không tự suy đã có corruption ảnh của non-target trong SUT.
- GAP-05 (review độc lập): absence of response bị coi là rejection do !success; test no-response RED→GREEN, giờ cần HTML prevention thật hoặc rejection response. Bốn ca reject Passed của run02 có HTML prevention nên không bị chứng minh false Pass bởi gap này.
- GAP-06 (executor re-grade một mục reviewer đặt ngoài oracle): bốn ca số dương 0.5 từng bị Blocked vì lẫn precision BVA với acceptance. README chỉ yêu cầu số >0; 0.5 biểu diễn chính xác và thỏa predicate. Oracle đổi accept, technique Supplementary giữ nguyên; consumer test RED→GREEN và whole suite run03. API C/U và WEB Create chấp nhận 0.5; WEB Update lưu đúng nhưng UI tức thời sai (BUG-004 đã biết). Đây là adjudication gap, không chứng minh một bug giá mới hay correction của sinh viên.

Freeze v3 giữ ID và DT/BVA denominator, đổi bốn oracle và assertion coverage; run03 là final. Các bản freeze, reports và run cũ được bảo toàn qua Git/evidence. Bản review gốc và disposition xem final-review.md.

## Những rủi ro đã phòng ngừa, không bịa thành lỗi AI đã xảy ra

Update validation, BVA length257, category membership thay vì ID interval, price precision chưa biết, khác biệt API/WEB và immediate/reload đã được đưa vào thiết kế. Không có evidence chứng minh AI ban đầu bỏ các case đó. Năm nhóm bug SUT được cập nhật từ failed observations run03 và mapping trong bugs.md; AI self-review phát hiện rule p>0 đã bị áp quá thận trọng với 0.5; các ca số dương này trước đó chưa được phán quyết; kết quả mới không chứng minh một bug SUT ngoài các nhóm đã báo cáo. Không có evidence rằng người học là người bổ sung correction này. Không tuyên bố AI không còn bỏ sót bug.

## Giới hạn / follow-up

7 supplementary probes có actual observation nhưng oracle đầy đủ chưa xác định: Unicode/trim, missing-target contract; full-price adjacency vẫn chưa rõ. DT143 và BVA44 là nghĩa vụ lấy mẫu trong phạm vi hữu hạn, không phải full-input coverage. Cần slide và clarification để version suite/rerun; không suy diễn Pass/Fail. PDF/YouTube/GitHub Issues là công việc submission chưa được thực hiện trong plan FR15 này.

## AI Critique — draft cần người học review

AI hỗ trợ chuyển requirement FR-15 thành predicates, điểm On/Off/In và nghĩa vụ BVA có truy vết. Tuy nhiên, nhiều sai sót thực tế cho thấy đầu ra hợp lý về hình thức chưa đủ đáng tin. Fixture PNG ban đầu có CRC sai; kiểm tra từng chunk phát hiện vấn đề trước execution và dẫn đến freeze mới. Runner đầu tiên lại đọc DOM trước khi cập nhật bất đồng bộ hoàn tất: TC069 của run01 có snapshot ba dòng nhưng screenshot sau đó có bốn dòng. Vì vậy, không thể coi mọi assertion thất bại là bug của SUT. Sau khi sửa đồng bộ, toàn suite được chạy lại. Review độc lập tiếp tục chỉ ra rằng snapshot thiếu nguồn ảnh và việc không nhận response bị nhầm thành bằng chứng từ chối. Các kiểm tra hồi quy đã chứng minh và sửa hai khoảng trống này. Một lỗi phân tích khác là giữ giá 0.5 ở trạng thái chưa có oracle vì precision chưa rõ. Thực tế, 0.5 biểu diễn chính xác và thỏa điều kiện lớn hơn không; precision còn thiếu chỉ giới hạn phân tích lân cận BVA. Oracle được sửa và suite chạy lại trong run03, phân biệt giá lưu đúng với lỗi UI cập nhật. Những sự kiện này cho thấy cần kiểm chứng cả dữ liệu mẫu, công cụ đo và cách diễn giải requirement. Không có bằng chứng để gán các correction cho sinh viên hoặc khẳng định nguyên nhân bên trong mô hình. Người học vẫn cần review, bổ sung slide, giữ bằng chứng gốc và phân biệt coverage với pass rate.

Word count: 272, whitespace split trên riêng đoạn critique. AI-assisted draft; learner review Pending.


docs/testing/fr15/test-results.md
# FR-15 — Actual results / coverage

Final run **fr15-run03**, 2026-10-15T22:38:05+07:00 → 2026-10-15T22:41:51+07:00, Asia/Ho_Chi_Minh. Source commit at start `5f9c73bf093c47e58188b46d20514b71149fb461` plus exact dirty harness hashes in [manifest](evidence/fr15-run03/manifest.json). Chromium version/locale/viewport: [browser metadata](evidence/fr15-run03/web/browser.json). Backend copy: `/private/tmp/eshop-fr15-run03/backend`; byte-identical backend source, independent SQLite reset per case. Working SQLite hash and frozen suite unchanged.

**run01/run02 are historical and excluded from final verdicts**: run02 omitted rendered image src and over-classified four 0.5 probes as unresolved; run03 corrects both and requires positive rejection evidence. In run01, asynchronous DOM sampling could precede fetchData completion (e.g. TC069). Raw evidence retained; run03 uses API-request quiet tracking, two animation frames and readback checks. Never combine two runs into double the designed/executed counts.

| Metric | Unique cases |
|---|---|
| designed | 158 |
| attempted | 158 |
| executed | 151 |
| passed | 56 |
| failed | 95 |
| blocked | 7 |
| notRun | 0 |

Executed means Passed+Failed=151; Blocked=7 are attempted supplementary observations without sufficient oracle, not environment failures. NotYetExecuted in verdict accounting = Blocked+NotRun=7. Main cases with determined oracle: 151/151 have verdicts. Runner exit 2 is expected because unresolved probes remain; it is not a green SUT claim. Harness tests: 18 passed plus independent Chromium synchronization regression.

| Layer | Designed | Passed | Failed | Blocked | Not Run |
|---|---|---|---|---|---|
| API | 97 | 36 | 54 | 7 | 0 |
| WEB | 61 | 20 | 41 | 0 | 0 |

## Coverage denominator và giới hạn

DT obligations are named point/surface/corner/operation/state partitions; BVA obligations are unique value/action/layer/universe. Supplementary observations do not enter DT/BVA denominators. A failed assertion can exercise a test obligation; coverage is not a pass rate. Per-source `rules` denotes design focus; `stateContract` also carries CRUD postconditions and R08 for Update. Failure code ui-immediate-correct on valid Update traces to R08 even if the source focus was R05/R06.

| Technique/layer | Identified | Designed mapped | Executed exercised |
|---|---|---|---|
| Domain Testing/API | 88 | 88/88 | 88/88 |
| Domain Testing/WEB | 55 | 55/55 | 55/55 |
| BVA/API | 22 | 22/22 | 22/22 |
| BVA/WEB | 22 | 22/22 | 22/22 |
| Supplementary/API | 9 | 9/9 | 2/9 |
| Supplementary/WEB | 2 | 2/2 | 2/2 |

Known finite DT scope: 143/143 designed and exercised; ASCII name + integer-price BVA: 44/44 designed and exercised (name 28, price Z-slice 16). These are sampled obligations only. Full price precision, Unicode counting, unspecified ID/error contract and referenced-product delete remain unresolved/outside this finite claim. No 100% FR15 correctness or exhaustive continuous-domain coverage claim.

UI delivered values are recorded as inputEffective; HTML prevention does not imply server validation. Empty name is blocked by HTML required with no mutation request (UI prevention exercised); API empty name has its own observed failure. Four positive half-price supplementary obligations are now exercised with definite oracles (API C/U and WEB Create pass; WEB Update persists 0.5 correctly but fails immediate UI consistency under BUG-004); they are outside BVA. No numeric-string mismatch alone is counted as defect. No observed truncation is used to claim delivery of a forbidden name length. API mutation auth tests cover only product C/U/D, not all FR12.

## Per-case results

Full fixture/preconditions/input/steps are keyed by ID in [frozen suite](../../../tests/fr15/suite.json); actual request/response, stateBefore/stateAfter, API readback and UI before/after reload are in each raw record. Raw JSON is the actual-result record, the summary below lists failed assertions or accepted evidence.

| ID | Interface/action | Rule focus | Technique(s) | Fixture | Expected | Actual / status | Bugs | Evidence |
|---|---|---|---|---|---|---|---|
| FR15-TC-001 | API/Create | FR15-R01 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-001.json) |
| FR15-TC-002 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-002.json) |
| FR15-TC-003 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-003.json) |
| FR15-TC-004 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-004.json) |
| FR15-TC-005 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-005.json) |
| FR15-TC-006 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-006.json) |
| FR15-TC-007 | API/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-007.json) |
| FR15-TC-008 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-008.json) |
| FR15-TC-009 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-009.json) |
| FR15-TC-010 | API/Create | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-010.json) |
| FR15-TC-011 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-011.json) |
| FR15-TC-012 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-012.json) |
| FR15-TC-013 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-013.json) |
| FR15-TC-014 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-014.json) |
| FR15-TC-015 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-015.json) |
| FR15-TC-016 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-016.json) |
| FR15-TC-017 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-017.json) |
| FR15-TC-018 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-018.json) |
| FR15-TC-019 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-019.json) |
| FR15-TC-020 | API/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-020.json) |
| FR15-TC-021 | API/Create | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-021.json) |
| FR15-TC-022 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-022.json) |
| FR15-TC-023 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-023.json) |
| FR15-TC-024 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-024.json) |
| FR15-TC-025 | API/Create | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-025.json) |
| FR15-TC-026 | API/Create | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-026.json) |
| FR15-TC-027 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-027.json) |
| FR15-TC-028 | API/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-028.json) |
| FR15-TC-029 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-029.json) |
| FR15-TC-030 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-030.json) |
| FR15-TC-031 | API/Create | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-031.json) |
| FR15-TC-032 | API/Create | FR15-R06 | Supplementary | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-032.json) |
| FR15-TC-033 | API/Create | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-033.json) |
| FR15-TC-034 | API/Create | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-034.json) |
| FR15-TC-035 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-035.json) |
| FR15-TC-036 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-036.json) |
| FR15-TC-037 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-037.json) |
| FR15-TC-038 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-038.json) |
| FR15-TC-039 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-039.json) |
| FR15-TC-040 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-040.json) |
| FR15-TC-041 | API/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-041.json) |
| FR15-TC-042 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-042.json) |
| FR15-TC-043 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-043.json) |
| FR15-TC-044 | API/Update | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-044.json) |
| FR15-TC-045 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-045.json) |
| FR15-TC-046 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-046.json) |
| FR15-TC-047 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-047.json) |
| FR15-TC-048 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-048.json) |
| FR15-TC-049 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-049.json) |
| FR15-TC-050 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-050.json) |
| FR15-TC-051 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-051.json) |
| FR15-TC-052 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-052.json) |
| FR15-TC-053 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-053.json) |
| FR15-TC-054 | API/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-054.json) |
| FR15-TC-055 | API/Update | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-055.json) |
| FR15-TC-056 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-056.json) |
| FR15-TC-057 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-057.json) |
| FR15-TC-058 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-058.json) |
| FR15-TC-059 | API/Update | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-059.json) |
| FR15-TC-060 | API/Update | FR15-R05 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-060.json) |
| FR15-TC-061 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-061.json) |
| FR15-TC-062 | API/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/api/FR15-TC-062.json) |
| FR15-TC-063 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-063.json) |
| FR15-TC-064 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-064.json) |
| FR15-TC-065 | API/Update | FR15-R07 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-065.json) |
| FR15-TC-066 | API/Update | FR15-R06 | Supplementary | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-066.json) |
| FR15-TC-067 | API/Update | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-067.json) |
| FR15-TC-068 | API/Update | FR15-R05 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-068.json) |
| FR15-TC-069 | WEB/Create | FR15-R01 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-069.json) |
| FR15-TC-070 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-070.json) |
| FR15-TC-071 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-071.json) |
| FR15-TC-072 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-072.json) |
| FR15-TC-073 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-073.json) |
| FR15-TC-074 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-074.json) |
| FR15-TC-075 | WEB/Create | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-075.json) |
| FR15-TC-076 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-076.json) |
| FR15-TC-077 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-077.json) |
| FR15-TC-078 | WEB/Create | FR15-R06 | Domain Testing,BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-078.json) |
| FR15-TC-079 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-079.json) |
| FR15-TC-080 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-080.json) |
| FR15-TC-081 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-081.json) |
| FR15-TC-082 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-082.json) |
| FR15-TC-083 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-083.json) |
| FR15-TC-084 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-084.json) |
| FR15-TC-085 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-085.json) |
| FR15-TC-086 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-086.json) |
| FR15-TC-087 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-087.json) |
| FR15-TC-088 | WEB/Create | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-088.json) |
| FR15-TC-089 | WEB/Create | FR15-R07 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-089.json) |
| FR15-TC-090 | WEB/Create | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-090.json) |
| FR15-TC-091 | WEB/Create | FR15-R06 | Supplementary | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-091.json) |
| FR15-TC-092 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-092.json) |
| FR15-TC-093 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-093.json) |
| FR15-TC-094 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-094.json) |
| FR15-TC-095 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-095.json) |
| FR15-TC-096 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-096.json) |
| FR15-TC-097 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-097.json) |
| FR15-TC-098 | WEB/Update | FR15-R05 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-098.json) |
| FR15-TC-099 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-099.json) |
| FR15-TC-100 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-100.json) |
| FR15-TC-101 | WEB/Update | FR15-R06 | Domain Testing,BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-101.json) |
| FR15-TC-102 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-102.json) |
| FR15-TC-103 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-103.json) |
| FR15-TC-104 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-104.json) |
| FR15-TC-105 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-105.json) |
| FR15-TC-106 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-106.json) |
| FR15-TC-107 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-107.json) |
| FR15-TC-108 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-108.json) |
| FR15-TC-109 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-109.json) |
| FR15-TC-110 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-110.json) |
| FR15-TC-111 | WEB/Update | FR15-R05,FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001,FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-111.json) |
| FR15-TC-112 | WEB/Update | FR15-R07 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-112.json) |
| FR15-TC-113 | WEB/Update | FR15-R06 | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-002 | [actual](evidence/fr15-run03/web/FR15-TC-113.json) |
| FR15-TC-114 | WEB/Update | FR15-R06 | Supplementary | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-114.json) |
| FR15-TC-115 | API/Read | FR15-R02 | Domain Testing | empty-products | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-115.json) |
| FR15-TC-116 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-116.json) |
| FR15-TC-117 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-117.json) |
| FR15-TC-118 | API/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-118.json) |
| FR15-TC-119 | API/Delete | FR15-R04 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-119.json) |
| FR15-TC-120 | API/Delete | FR15-R04 | Domain Testing | single-product | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-120.json) |
| FR15-TC-121 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-121.json) |
| FR15-TC-122 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-122.json) |
| FR15-TC-123 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-123.json) |
| FR15-TC-124 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-124.json) |
| FR15-TC-125 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-125.json) |
| FR15-TC-126 | API/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-126.json) |
| FR15-TC-127 | WEB/Read | FR15-R02 | Domain Testing | empty-products | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-127.json) |
| FR15-TC-128 | WEB/Read | FR15-R02 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-128.json) |
| FR15-TC-129 | WEB/Delete | FR15-R04 | Domain Testing | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-129.json) |
| FR15-TC-130 | WEB/Delete | FR15-R04 | Domain Testing | single-product | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-130.json) |
| FR15-TC-131 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-131.json) |
| FR15-TC-132 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-132.json) |
| FR15-TC-133 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-133.json) |
| FR15-TC-134 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-134.json) |
| FR15-TC-135 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-135.json) |
| FR15-TC-136 | WEB/Update | FR15-R03,FR15-R08 | Domain Testing | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-136.json) |
| FR15-TC-137 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-137.json) |
| FR15-TC-138 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-138.json) |
| FR15-TC-139 | API/Create | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-139.json) |
| FR15-TC-140 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-140.json) |
| FR15-TC-141 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-141.json) |
| FR15-TC-142 | API/Update | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-142.json) |
| FR15-TC-143 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-143.json) |
| FR15-TC-144 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-144.json) |
| FR15-TC-145 | API/Delete | FR12-DEP-WRITE | Domain Testing | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-005 | [actual](evidence/fr15-run03/api/FR15-TC-145.json) |
| FR15-TC-146 | WEB/Create | FR15-R07 | Domain Testing | empty-categories | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/web/FR15-TC-146.json) |
| FR15-TC-147 | API/Create | FR15-R07 | Domain Testing | empty-categories | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-003 | [actual](evidence/fr15-run03/api/FR15-TC-147.json) |
| FR15-TC-148 | API/Read | FR15-R02 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-148.json) |
| FR15-TC-149 | API/Update | FR15-R03 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-149.json) |
| FR15-TC-150 | API/Delete | FR15-R04 | Supplementary | baseline | observe | oracle-unresolved / **Blocked** | — | [actual](evidence/fr15-run03/api/FR15-TC-150.json) |
| FR15-TC-151 | API/Create | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-151.json) |
| FR15-TC-152 | API/Create | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-152.json) |
| FR15-TC-153 | API/Update | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/api/FR15-TC-153.json) |
| FR15-TC-154 | API/Update | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/api/FR15-TC-154.json) |
| FR15-TC-155 | WEB/Create | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-155.json) |
| FR15-TC-156 | WEB/Create | FR15-R06 | BVA | baseline | accept | all asserted postconditions satisfied / **Passed** | — | [actual](evidence/fr15-run03/web/FR15-TC-156.json) |
| FR15-TC-157 | WEB/Update | FR15-R05 | BVA | baseline | reject | rejected-state-unchanged,rejection-signaled,ui-immediate-correct,ui-reload-correct / **Failed** | FR15-BUG-001 | [actual](evidence/fr15-run03/web/FR15-TC-157.json) |
| FR15-TC-158 | WEB/Update | FR15-R06 | BVA | baseline | accept | ui-immediate-correct / **Failed** | FR15-BUG-004 | [actual](evidence/fr15-run03/web/FR15-TC-158.json) |

## Blockers and follow-up

All 7 Blocked source cases are supplementary: whitespace/Unicode name conventions (API C/U) and exact missing-target Read/Update/Delete contract. Exact price=0.5 now has a confirmed acceptance oracle because it is a representable number >0; unknown precision still limits neighbor-based BVA. Their raw behavior is recorded; no Pass/Fail manufactured. To resolve: obtain precision/Unicode/trim/missing-target contract or course guidance, version the model/suite, then rerun affected cases; preserve current evidence. No environment blocker or Not Run remains.

Learner technical review Pending. Only observed failures below are grouped into five issue reports (four FR15 validation/display groups and one FR12 dependency group). Grouping is by violated rule; it does not assert a single shared code root cause across UI/backend. No GitHub issue published.


tests/fr15/suite.json
Artifact SHA256=7ffcde1671a5d36aefcc3d7b63d03c7e891d46cd623db32f321b20b04c994f86

docs/testing/fr15/evidence/fr15-run03/manifest.json
Artifact SHA256=4e513196f21a82d0c47dac803fbd956e91aa5e604ffe0f121bc0b1188a02e90c
```

Pending learner review.
`````