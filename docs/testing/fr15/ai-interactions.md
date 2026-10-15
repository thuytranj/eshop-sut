# AI Audit Report

Draft declaration for learner confirmation: I use AI tools for the tasks recorded below.

Scope: recorded interactions only; session history may be partial. Unknown timestamps/models and partial or summary captures remain explicit. Review decisions do not certify execution results.

Interactions: 10; learner review events: 0.

## Interaction fr15-native-task1

```text
{
  "tool": "Codex",
  "model": "Unknown",
  "task": "FR15 task1",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task2",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task3",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task4",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 fixture-correction",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task5",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task6",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 task7",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR-15 planning only",
  "occurred_at": "Unknown",
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
  "model": "Unknown",
  "task": "FR15 final-review-fix",
  "occurred_at": "Unknown",
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
