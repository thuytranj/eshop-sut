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

Domain Testing quy định: “Use requirements as the expected-result oracle” và “Do not invent missing upper limits, precisions, or validity rules.” BVA yêu cầu công khai incomplete adjacency analysis khi precision chưa xác định. Đây là yêu cầu trực tiếp trong các SKILL.md đã link, không phải yêu cầu xin permission của skill. Việc giữ oracle-unresolved là cách executor áp dụng chúng khi README chưa xác định native h1/grid/search policy. Skill không bổ sung business requirements còn thiếu.

Hiện35/45 canonical có verdict:23 Passed,12 Failed;10 Blocked. TC021–027 đã có native probes run02 nhưng chưa có oracle để verdict; TC001 còn native grid/scroll; TC013 thiếu complete accessibility/VoiceOver evidence; TC020 thiếu native h1 mapping. Không có BVA obligation đã xác định nào chưa được exercise; thiếu toàn-suite verdict không đồng nghĩa thiếu BVA n0/n1/n2 execution.

Các phần phân tích/design/deduplicate/report/gap đã có deliverables; Task5 full execution vẫn partial. Không sửa exit criteria hoặc đổi Blocked thành Passed để tuyên bố hoàn tất. Cần nguồn requirement clarification và native evidence capability phù hợp để hoàn thành phần còn lại. Không tự mở browser/Expo web rồi tính thành native coverage.
