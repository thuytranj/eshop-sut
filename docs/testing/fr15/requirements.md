# FR-15 — Phân tích requirement và cơ sở kiểm thử

## 1. Test basis và phạm vi

- `README.md`, FR-15, dòng 191–198: oracle nghiệp vụ của Product CRUD.
- `README.md`, FR-12, dòng 174–179: dependency về quyền ghi sản phẩm.
- `api_specification.md`, mục 3.1–3.4, dòng 78–106: interface sản phẩm và danh mục; mục 1.2: login.
- `docs/2026.HW02.Domain Testing_En.pdf`, mục 6: giải thích từng bước áp dụng DT/BVA; mục 9–10: AI Audit và Critique; mục 12: Git commit; mục 14: hồ sơ nộp bài.
- `AGENTS.md`: bảo toàn SUT, dữ liệu và evidence; không tự sửa application code trong yêu cầu kiểm thử.

Phạm vi gồm Product CRUD trên API và Admin Web. Login và danh mục có sẵn phục vụ fixture. Không mở rộng thành kiểm thử toàn bộ FR-12/FR-14, CSV import, tìm kiếm phía customer, checkout hoặc mobile. API GET sản phẩm công khai không bị gán thêm điều kiện admin.

## 2. Danh sách rule và oracle

`confirmed` là yêu cầu được nêu trực tiếp trong đặc tả. `derived` là hậu điều kiện được suy ra từ thao tác CRUD và được giải thích rõ. Rule ID được giữ ổn định trong mọi báo cáo.

| Rule | Yêu cầu và hậu điều kiện | Căn cứ | Interface |
|---|---|---|---|
| FR15-R01 | Admin có thể thêm sản phẩm; thêm đúng một ID và đọc lại được dữ liệu đã lưu | CRUD: confirmed; hậu điều kiện: derived | POST /api/products; WEB Create |
| FR15-R02 | Admin xem được danh sách và sản phẩm để quản lý; danh sách rỗng không có bản ghi | CRUD: confirmed; hậu điều kiện: derived | GET /api/products, GET /api/products/:id; WEB |
| FR15-R03 | Admin có thể sửa sản phẩm được chọn; đọc lại được giá trị mới | CRUD: confirmed; hậu điều kiện: derived | PUT /api/products/:id; WEB Update |
| FR15-R04 | Admin có thể xóa sản phẩm được chọn; các sản phẩm khác giữ nguyên | CRUD: confirmed; hậu điều kiện: derived | DELETE /api/products/:id; WEB Delete |
| FR15-R05 | Tên bắt buộc, tối đa 255 ký tự | confirmed, README:195 | Create/Update; API/WEB |
| FR15-R06 | Giá bắt buộc, phải là số lớn hơn 0 | confirmed, README:196 | Create/Update; API/WEB |
| FR15-R07 | Danh mục bắt buộc và phải thuộc danh sách có sẵn | confirmed, README:197 | Create/Update; API/WEB |
| FR15-R08 | Khi sửa một sản phẩm, các sản phẩm khác giữ nguyên | confirmed, README:198 | Update; API/DB và UI trước/sau reload |
| FR12-DEP-WRITE | POST/PUT/DELETE sản phẩm cần JWT hợp lệ và role admin | confirmed, README:177–179 | Chỉ các API ghi sản phẩm |

## 3. Input và trạng thái cần kiểm soát

| Input/trạng thái | Miền, đơn vị hoặc độ phân giải | Cách sử dụng |
|---|---|---|
| `name`, độ dài `L` | Chuỗi; L∈N₀; fixture ASCII có bước 1 ký tự | ASCII tránh nhập nhằng đơn vị đếm; không chứng minh quy tắc Unicode |
| `price`, ký hiệu `p` | Số, p>0; precision toàn miền chưa quy định | BVA xét lát cắt số nguyên Z; không đặt giá tối đa |
| `category_id`, ký hiệu `c` | Membership của tập danh mục | 10/20 tồn tại, 15 không tồn tại; khoảng [10,20] không phải miền hợp lệ |
| Token/role | admin, user, không có token, token không hợp lệ | Lấy token qua login; không giả mạo role |
| Thao tác và ID được chọn | Create/Read/Update/Delete; A=101, B=202, C=303 | Tách trường hợp ID tồn tại và không tồn tại |
| Sản phẩm/danh mục trong CSDL | Reset fixture trước từng test case | Snapshot đủ id, name, price, description, imageUrl, category_id |
| `description`, `imageUrl` | Giá trị nominal, trừ ca sửa riêng từng trường | Không tự đặt thêm điều kiện bắt buộc, giới hạn độ dài hoặc URL |
| Thời gian/build | Ghi thời gian thực theo UTC+07:00 | FR-15 không có time boundary; reset login_attempts/locked_until khi cần |

## 4. Fixture và hậu điều kiện

Fixture đầy đủ nằm trong `tests/fr15/fixtures.json`:

- `baseline`: danh mục 10/20 và ba sản phẩm A/B/C có tên, giá, mô tả khác nhau; danh mục 15 không tồn tại.
- `empty-products`: không có sản phẩm, vẫn có danh mục hợp lệ.
- `single-product`: chỉ còn A, dùng để kiểm tra xóa sản phẩm cuối.
- `empty-categories`: không có sản phẩm hoặc danh mục, tránh tạo quan hệ orphan ngay trong setup.

Payload nominal dùng `name='A'×128`, `price=100000`, `category_id=10`, `description='Nominal description'` và PNG data URL từ fixture. Runner chủ động chọn danh mục 10/20 vì form mặc định dùng ID 1. Backend riêng sử dụng tài khoản demo để login; token và mật khẩu không được ghi vào evidence.

Sau khi backend bản sao tạo đủ bảng và seed xong, runner mới reset sản phẩm/danh mục bằng transaction, đồng thời đưa login counters về 0 và bỏ khóa tạm. Không dùng mutation API đang được kiểm thử để xác nhận setup hợp lệ. Database gốc không được reset hoặc seed lại.

| Trường hợp | Hậu điều kiện |
|---|---|
| Create hợp lệ | Thêm đúng một bản ghi; dữ liệu khớp payload; các bản ghi cũ giữ nguyên |
| Update hợp lệ | Sản phẩm được chọn khớp payload; các sản phẩm khác giữ nguyên. So đủ field qua API/DB, so field đang hiển thị trên UI |
| Delete hợp lệ | Đúng sản phẩm được chọn biến mất; các sản phẩm khác giữ nguyên |
| Input hoặc quyền ghi không hợp lệ | Từ chối phù hợp; không thêm, sửa hoặc xóa dữ liệu |

Đặc tả chưa quy định mã lỗi và nội dung thông báo cụ thể. Do đó, không tự đặt expected HTTP 400/401/403 hoặc câu thông báo chính xác.

## 5. Các điểm chưa rõ trong đặc tả

| ID | Điểm chưa rõ | Cách xử lý và ảnh hưởng |
|---|---|---|
| FR15-AMB-01 | Đơn vị đếm Unicode và cách trim khoảng trắng | Bộ length chính dùng ASCII; các ca whitespace/Unicode là probe, chưa đủ oracle để kết luận |
| FR15-AMB-02 | Precision và cận trên của giá | p=0 phải bị từ chối; 0.5 biểu diễn chính xác và thỏa p>0 nên được chấp nhận. Thiếu precision chỉ giới hạn adjacency của BVA; không tự đặt 0.01 hoặc giá tối đa |
| FR15-AMB-03 | Numeric string trong JSON và kiểu dữ liệu category ID | Ghi payload thực tế, đối chiếu ý nghĩa nghiệp vụ; không kết luận lỗi chỉ vì chuỗi '100000' thay cho số 100000 |
| FR15-AMB-04 | PUT có cho phép partial update hay không | Bộ chính gửi đủ body. Ca thiếu field kiểm tra requiredness; không giả định semantics của PATCH |
| FR15-AMB-05 | Error code, nội dung lỗi, schema GET detail | Kiểm rule và hậu điều kiện đã biết; không báo bug riêng chỉ dựa trên chi tiết chưa có contract |
| FR15-AMB-06 | ID không tồn tại hoặc xóa lặp lại | Ghi nhận hành vi; không tự yêu cầu 404. Hậu điều kiện không đổi bản ghi khác là derived |
| FR15-AMB-07 | Xóa sản phẩm đã được orders/cart tham chiếu | Không tạo thêm quan hệ ngoài phạm vi; nêu rõ giới hạn coverage |
| FR15-AMB-08 | Chưa có slide phương pháp trong repo | Dùng fallback On/Off/In và ISTQB 3-value BVA; cần đối chiếu khi có slide của lớp |

## 6. Phương pháp và cách ghi trạng thái

Domain Testing đi từ rule đến predicate, miền hợp lệ/miền bù, biên, điểm In/On/Off, mẫu tách biệt trên biên, giao điểm và tổ hợp input. BVA đi từ universe/độ phân giải đến ordered partitions, endpoint, neighbor, hợp tập đã deduplicate và test case với các điều kiện khác nominal.

Tên có các partition {0}, [1,255], [256,∞). Giá trên lát cắt Z có các partition (-∞,0] và [1,∞). Danh mục và quyền truy cập là categorical partitions, không thuộc BVA. Ca nhiều lỗi chỉ bổ sung interaction coverage, không thay thế ca cô lập từng rule.

Các file thiết kế giữ `status=Not Run`, `actual=null`, `evidence=[]` để bảo toàn baseline đã freeze. Kết quả thực thi được ghi riêng trong test-results.md và evidence của run03. Không suy Pass/Fail từ thiết kế hoặc công thức predicate. Review kỹ thuật của người học đang chờ; việc chọn Native chỉ cho phép thực hiện plan, không chứng nhận kết quả kiểm thử.
