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
