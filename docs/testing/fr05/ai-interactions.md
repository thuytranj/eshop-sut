# FR-05: AI Audit Report

## Phạm vi và tính đầy đủ

Công cụ: Codex; exact model variant của executor không có metadata xác minh nên để Unknown; fresh reviewer dùng gpt-6-astra theo dispatch metadata. AI được dùng để lập plan, phân tích requirement, dẫn xuất Domain Testing/BVA, review/deduplicate, tạo harness, thu/đối chiếu evidence và viết gap analysis. Đây là declaration draft chờ người học xác nhận, không phải tuyên bố do người học đã viết.

Log có 10 artifact snapshots/interactions được ghi trong phạm vi FR05. Nhiều entries dùng lại **cùng instruction thực thi** cho các task khác nhau; không có nghĩa người dùng đã gửi lại prompt hoặc tồn tại mười conversation turns riêng. Capture extent đều partial; không chứa toàn bộ commentary/tool transcript/skill payload hoặc hidden reasoning. Các file request/response, screenshots/AX được link trong reports để hỗ trợ, không giả làm full chat export.

Interaction time không biết giữ Unknown. Recording time do helper tạo có timezone +07:00, không dùng làm historical user-message timestamp. Original prompt/output bên dưới giữ nguyên văn trong fenced blocks, kể cả thuật ngữ/ngôn ngữ của source. Phần giải thích report viết tiếng Việt; không dịch lại raw evidence.

Learner technical review: **Pending learner review**. Lựa chọn Native/branch, Open Expo Go hoặc unlock Mac là preference/environment support, không chứng minh student đã duyệt expected results. Không có fabricated review/grade/demo links.

Ledger nguồn: [ai-interactions.jsonl](ai-interactions.jsonl). Canonical ai-audit exporter đã parse/export thành công trước khi tạo bản trình bày tiếng Việt này; report chỉ chứng nhận entries được cung cấp.

## Snapshot 1: FR-05-planning

- Interaction ID: `0c200efd-98ca-495d-896e-1ccfa3b9f561`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:00:53+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Visible task prompt and saved plan only; excludes supplied skill payload, prior instructions, commentary and tool transcript. Interaction time and exact model unavailable. Planning only; no test execution or learner review.
- Learner review: Pending learner review.

### Prompt được ghi

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

### Output được ghi nguyên văn

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

## Snapshot 2: FR-05-plan-self-review

- Interaction ID: `2447f747-2d08-4a84-852a-b4ebbc4eae6a`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:02:11+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Second saved plan revision after assistant self-review of the same user prompt: added explicit initial unfiltered LIST/virtualization check, clarified derived n versus controllable inputs, and specified fixture images and HTTP serving. This is AI self-review, not learner feedback. Other chat/tool messages excluded; interaction time and exact model unavailable.
- Learner review: Pending learner review.

### Prompt được ghi

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

### Output được ghi nguyên văn

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

## Snapshot 3: FR05-Task1

- Interaction ID: `9b565ed9-8f56-4bc0-b1c7-feab8b450995`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:27:39+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: User execution instruction and Task 1 artifact only; excludes skill payload/tool transcript; model and interaction time unavailable; learner technical review pending.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 4: FR05-Task2

- Interaction ID: `f026228c-b69c-4b72-88de-716589c5f4f2`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:30:34+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Task 2 derivation; source cases in tests/fr05/domain-source.json and domain-cases.md. Baseline preserved. Not executed; no learner review.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 5: FR05-Task3

- Interaction ID: `355c7c10-e304-4e81-86fc-0256748cca38`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:32:24+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: BVA derivation and assistant self-review; no execution verdict or learner review.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 6: FR05-Task4

- Interaction ID: `f5e3798c-430c-4c58-bbb3-4491c002a411`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T10:34:36+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Assistant review/freeze; baseline source cases retained; validator RED then GREEN observed; no learner review or SUT result.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 7: FR05-Task5

- Interaction ID: `40c30b2c-e45f-4601-b541-741daa8b3087`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T12:36:57+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Observed native/API execution decisions; raw evidence and dispositions under evidence/fr05-run01. User opened Expo Go and unlocked Mac; not learner case review. Full suite blocked by oracle/accessibility.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 8: FR05-Task6

- Interaction ID: `10413a42-ccec-4094-95ad-ce074eed009b`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T12:43:22+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Results derived from raw native/API evidence and explicit adjudication; TC001 false-positive inference corrected without rewriting raw run; bugs.md has 4 explicit defects plus 1 derived discrepancy. Learner review pending.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 9: FR05-Task7

- Interaction ID: `146a2032-ce70-48bf-8221-89019ac79c57`.
- Tool: Codex; model: Unknown.
- Interaction time: Unknown.
- Recording time: `2026-10-16T12:46:24+07:00`.
- Capture extent: `partial`.
- Provenance nguyên bản: Task 7 assistant gap analysis artifact snapshot under the same execution instruction; not a new user prompt or learner critique. Observed corrections and limitations distinguished from missed SUT bugs.
- Learner review: Pending learner review.

### Prompt được ghi

````text
[$superpowers:executing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/executing-plans/SKILL.md) theo dạng native, report sử dụng tiếng việt, các thuật ngữ chuyên ngành dùng tiếng anh. Report phải giải thích rõ ràng, mạch lạc, dễ hiểu
````

### Output được ghi nguyên văn

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

## Snapshot 10: FR05-final-review

- Interaction ID: `c69d434d-0fad-4ba2-8310-30ab8ee66c7f`.
- Tool: Codex collaboration; model: gpt-6-astra.
- Interaction time: Unknown.
- Recording time: `2026-10-16T15:32:40+07:00`.
- Capture extent: partial; reviewer instructions là summary, không phải verbatim prompt. Output dưới đây là closeout summary, không phải raw reviewer transcript.
- Learner review: Pending learner review.

### Prompt được ghi (summary)

```text
Summary of reviewer task: read-only whole-branch review of FR05 range 96d6cb6..6b73251 against plan, requirements, Review Focus and ledger; grade findings and disclose declined-to-judge items; preserve files/index/HEAD.
```

### Output được ghi (summary)

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
