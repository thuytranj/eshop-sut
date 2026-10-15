# AI Audit Report

Draft declaration for learner confirmation: I use AI tools for the tasks recorded below.

Scope: recorded interactions only; session history may be partial. Unknown timestamps/models and partial or summary captures remain explicit. Review decisions do not certify execution results.

Interactions: 8; learner review events: 0.

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
