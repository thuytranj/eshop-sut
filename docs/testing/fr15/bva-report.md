# FR-15 — Áp dụng Boundary Value Analysis từng bước

## Bước 1. Xác định test basis, variant và universe

BVA áp dụng R05 về tên và R06 về giá trong [requirements.md](requirements.md). Chưa có slide của lớp, nên sử dụng fallback ISTQB 3-value theo `.agents/skills/boundary-value-analysis/references/bva-methods.md`. Không khẳng định đây là convention đã được giảng trên lớp.

Tên dùng ASCII, với universe L∈N₀ và bước 1 ký tự. Giá chỉ có phân tích adjacency trên lát cắt số nguyên Z vì precision toàn miền chưa rõ. Không lấy thuộc tính step của UI hoặc kiểu INTEGER trong DB làm requirement. Danh mục và quyền truy cập là categorical partitions nên không áp dụng BVA.

## Bước 2. Xác định ordered partitions và endpoint

| Chiều | Partition không hợp lệ phía dưới | Partition hợp lệ | Partition không hợp lệ phía trên | Endpoint hữu hạn |
|---|---|---|---|---|
| Độ dài tên | {0} | [1,255] | [256,∞) | 0,1,255,256 |
| Giá trên lát cắt Z | (-∞,0] | [1,∞) | Đặc tả không nêu cận trên | 0,1 |

Không thể tạo chuỗi có độ dài -1; vô cực không phải endpoint hữu hạn. Với p>0, số 0 thuộc miền bị từ chối; 1 là giá nguyên hợp lệ thấp nhất trên lát cắt đã chọn.

## Bước 3. Sinh neighbor cho từng endpoint trước khi gộp

Theo 3-value BVA, lấy endpoint và predecessor/successor khả thi trong universe.

| Chiều | Endpoint | Tập giá trị lân cận |
|---|---|---|
| Độ dài tên | 0 | {0,1}; loại -1 vì ngoài universe |
| Độ dài tên | 1 | {0,1,2} |
| Độ dài tên | 255 | {254,255,256} |
| Độ dài tên | 256 | {255,256,257} |
| Giá trên lát cắt Z | 0 | {-1,0,1} |
| Giá trên lát cắt Z | 1 | {0,1,2} |

## Bước 4. Lấy hợp tập và xác định expected result

| Chiều | Hợp tập sau deduplicate | Chấp nhận | Từ chối |
|---|---|---|---|
| Độ dài tên | {0,1,2,254,255,256,257} | 1,2,254,255 | 0,256,257 |
| Giá trên lát cắt Z | {-1,0,1,2} | 1,2 | -1,0 |

Có 7 giá trị tên và 4 giá trị giá cho mỗi thao tác/tầng. Nếu chỉ lấy ba điểm quanh p=0 sẽ thiếu 2 theo variant này; nếu chỉ xét endpoint của miền tên hợp lệ sẽ thiếu 257.

Khi precision chưa rõ, không xác định được neighbor gần nhất của toàn miền số thực/thập phân. Vì vậy, ±1 không chứng minh coverage toàn miền giá. Số 0.5 là mẫu dương biểu diễn được, có oracle chấp nhận, nhưng không phải chứng cứ về adjacency. Không tự đặt bước 0.01 hoặc cận giá tối đa. Các probe Unicode chưa giải quyết cách đếm code point/UTF-16/grapheme.

## Bước 5. Tạo input cụ thể và giữ các điều kiện khác nominal

Tên thực tế là chuỗi 'A' lặp L lần, được lưu đầy đủ trong source-cases.json và kiểm độ dài ASCII trước execution. Khi kiểm tên, giữ p=100000. Khi kiểm giá, giữ L=128. Dùng danh mục 10, JWT admin hợp lệ; Update chọn A đang tồn tại và dùng B/C làm đối chứng.

Ca trùng với Domain Testing chỉ được gộp khi cùng tầng, thao tác, fixture, payload và assertion. Mọi source ID và obligation vẫn được giữ để truy vết endpoint tạo ra giá trị đó. Missing/null, sai kiểu, auth và category membership không được cộng vào mẫu số BVA.

## Bước 6. Xác định coverage và giới hạn

- Tên: 7 giá trị × 2 thao tác × 2 tầng = 28 obligation.
- Giá nguyên: 4 giá trị × 2 thao tác × 2 tầng = 16 obligation.
- Tổng cộng: 44 obligation BVA hữu hạn; mỗi tầng có 14 obligation tên và 8 obligation giá.

Tại thời điểm thiết kế, 44/44 obligation có case và 0/44 được thực thi. Đây là số obligation, không phải số canonical case sau deduplicate. Coverage thực thi cuối cùng được đối soát trong [test-results.md](test-results.md).

Với WEB, ghi riêng input dự định và input thực tế. HTML prevention không chứng minh backend đã validate; input bị truncate cũng không chứng minh giá trị ban đầu đã đến API. Không dùng 44 obligation để khẳng định coverage đầy đủ của FR-15, Unicode hoặc precision của toàn miền giá.

## Bước 7. Test case nguồn và traceability

Các dòng dưới là bản thiết kế Not Run. Payload, preconditions và steps đầy đủ xem [source-cases.json](../../../tests/fr15/source-cases.json); fixture xem [fixtures.json](../../../tests/fr15/fixtures.json).

| ID | Tầng / thao tác | Fixture và input chính | Rule / obligation | Mục đích và expected result | Actual result | Trạng thái | Evidence |
|---|---|---|---|---|---|---|---|
| FR15-BVA-001 | API/Create | baseline; name=""; p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-001 | BVA 3-value cho độ dài tên L=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-002 | API/Create | baseline; L=1 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-002 | BVA 3-value cho độ dài tên L=1; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-003 | API/Create | baseline; L=2 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-003 | BVA 3-value cho độ dài tên L=2; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-004 | API/Create | baseline; L=254 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-004 | BVA 3-value cho độ dài tên L=254; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-005 | API/Create | baseline; L=255 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-005 | BVA 3-value cho độ dài tên L=255; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-006 | API/Create | baseline; L=256 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-006 | BVA 3-value cho độ dài tên L=256; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-007 | API/Create | baseline; L=257 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-007 | BVA 3-value cho độ dài tên L=257; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-008 | API/Create | baseline; L=128 (ASCII); p=-1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-008 | BVA 3-value cho giá nguyên p=-1; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-009 | API/Create | baseline; L=128 (ASCII); p=0; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-009 | BVA 3-value cho giá nguyên p=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-010 | API/Create | baseline; L=128 (ASCII); p=1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-010 | BVA 3-value cho giá nguyên p=1; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-011 | API/Create | baseline; L=128 (ASCII); p=2; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-011 | BVA 3-value cho giá nguyên p=2; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-012 | API/Update | baseline; ID=101; name=""; p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-012 | BVA 3-value cho độ dài tên L=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-013 | API/Update | baseline; ID=101; L=1 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-013 | BVA 3-value cho độ dài tên L=1; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-014 | API/Update | baseline; ID=101; L=2 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-014 | BVA 3-value cho độ dài tên L=2; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-015 | API/Update | baseline; ID=101; L=254 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-015 | BVA 3-value cho độ dài tên L=254; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-016 | API/Update | baseline; ID=101; L=255 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-016 | BVA 3-value cho độ dài tên L=255; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-017 | API/Update | baseline; ID=101; L=256 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-017 | BVA 3-value cho độ dài tên L=256; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-018 | API/Update | baseline; ID=101; L=257 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-018 | BVA 3-value cho độ dài tên L=257; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-019 | API/Update | baseline; ID=101; L=128 (ASCII); p=-1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-019 | BVA 3-value cho giá nguyên p=-1; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-020 | API/Update | baseline; ID=101; L=128 (ASCII); p=0; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-020 | BVA 3-value cho giá nguyên p=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-021 | API/Update | baseline; ID=101; L=128 (ASCII); p=1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-021 | BVA 3-value cho giá nguyên p=1; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-022 | API/Update | baseline; ID=101; L=128 (ASCII); p=2; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-022 | BVA 3-value cho giá nguyên p=2; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-023 | WEB/Create | baseline; name=""; p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-023 | BVA 3-value cho độ dài tên L=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-024 | WEB/Create | baseline; L=1 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-024 | BVA 3-value cho độ dài tên L=1; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-025 | WEB/Create | baseline; L=2 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-025 | BVA 3-value cho độ dài tên L=2; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-026 | WEB/Create | baseline; L=254 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-026 | BVA 3-value cho độ dài tên L=254; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-027 | WEB/Create | baseline; L=255 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-027 | BVA 3-value cho độ dài tên L=255; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-028 | WEB/Create | baseline; L=256 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-028 | BVA 3-value cho độ dài tên L=256; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-029 | WEB/Create | baseline; L=257 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-029 | BVA 3-value cho độ dài tên L=257; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-030 | WEB/Create | baseline; L=128 (ASCII); p=-1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-030 | BVA 3-value cho giá nguyên p=-1; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-031 | WEB/Create | baseline; L=128 (ASCII); p=0; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-031 | BVA 3-value cho giá nguyên p=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-032 | WEB/Create | baseline; L=128 (ASCII); p=1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-032 | BVA 3-value cho giá nguyên p=1; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-033 | WEB/Create | baseline; L=128 (ASCII); p=2; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-033 | BVA 3-value cho giá nguyên p=2; các điều kiện khác ở mức nominal. Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | null | Not Run | [] |
| FR15-BVA-034 | WEB/Update | baseline; ID=101; name=""; p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-034 | BVA 3-value cho độ dài tên L=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-035 | WEB/Update | baseline; ID=101; L=1 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-035 | BVA 3-value cho độ dài tên L=1; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-036 | WEB/Update | baseline; ID=101; L=2 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-036 | BVA 3-value cho độ dài tên L=2; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-037 | WEB/Update | baseline; ID=101; L=254 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-037 | BVA 3-value cho độ dài tên L=254; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-038 | WEB/Update | baseline; ID=101; L=255 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-038 | BVA 3-value cho độ dài tên L=255; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-039 | WEB/Update | baseline; ID=101; L=256 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-039 | BVA 3-value cho độ dài tên L=256; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-040 | WEB/Update | baseline; ID=101; L=257 (ASCII); p=100000; category_id=10; auth=admin | FR15-R05 / FR15-OBL-BVA-040 | BVA 3-value cho độ dài tên L=257; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-041 | WEB/Update | baseline; ID=101; L=128 (ASCII); p=-1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-041 | BVA 3-value cho giá nguyên p=-1; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-042 | WEB/Update | baseline; ID=101; L=128 (ASCII); p=0; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-042 | BVA 3-value cho giá nguyên p=0; các điều kiện khác ở mức nominal. Từ chối thao tác; dữ liệu giữ nguyên. | null | Not Run | [] |
| FR15-BVA-043 | WEB/Update | baseline; ID=101; L=128 (ASCII); p=1; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-043 | BVA 3-value cho giá nguyên p=1; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
| FR15-BVA-044 | WEB/Update | baseline; ID=101; L=128 (ASCII); p=2; category_id=10; auth=admin | FR15-R06 / FR15-OBL-BVA-044 | BVA 3-value cho giá nguyên p=2; các điều kiện khác ở mức nominal. Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | null | Not Run | [] |
