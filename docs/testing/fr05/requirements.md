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
