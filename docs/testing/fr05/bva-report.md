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
