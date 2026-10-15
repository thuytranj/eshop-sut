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

Mỗi row obligations.json có ID, sourceCaseId, layer/action, rule, point/rationale/oracle. Domain-cases.md và source JSON là thiết kế ban đầu Not Run. Số nghĩa vụ là số ID distinct của từng technique; denominator gồm cả validation partition, point/surface/corner, operation/state đã liệt kê, tách supplementary. Designed coverage = mapped obligations / identified obligations; executed coverage chưa có, không suy pass/fail từ predicate kỳ vọng. Category/auth là domain partitions, không được cộng BVA. Unresolved probes (trim/Unicode/missing target error contract) có ghi observation nhưng không có oracle đủ để verdict toàn case.

Phương pháp là fallback từ skills khi chưa có slide lớp. Learner review Pending; không claim đã được sinh viên xác nhận.

Freeze v3 correction: exact positive 0.5 has a confirmed acceptance oracle under R06; unknown full-price precision limits BVA adjacency only. These four cases retain Supplementary technique labels and do not change DT/BVA denominators.
