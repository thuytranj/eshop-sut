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

Không có nearest real/decimal neighbor khi precision chưa được contract xác định. ±1 không chứng minh coverage toàn miền giá; 0.5 là supplementary positive-acceptance check, không chứng minh adjacency precision, không thêm 0.01 hoặc max giả. Unicode được giữ trong supplementary, chưa giải quyết codepoint/UTF16/grapheme.

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
