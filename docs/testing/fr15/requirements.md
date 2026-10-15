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
| FR15-AMB-02 | Precision/upper bound price | p=0 strict reject; số 0.5 biểu diễn chính xác thỏa >0 nên phải được chấp nhận; chưa biết precision chỉ hạn chế adjacency. Z-slice có BVA hữu hạn, adjacency full price chưa xác định; không đặt 0.01/max |
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
