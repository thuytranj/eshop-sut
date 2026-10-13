# Phân tích Yêu cầu & Đặc tả Kiểm thử FR-07: Giỏ hàng (Shopping Cart)

## 1. Test Basis & Phương pháp Kiểm thử

### 1.1. Nguồn Test Basis
Tài liệu căn cứ xác định yêu cầu và oracle (theo thứ tự ưu tiên):
1. **README.md (dòng 93–100):** Đặc tả nghiệp vụ chính thức cho chức năng FR-07 Giỏ hàng (Shopping Cart).
2. **README.md (dòng 83–87):** Đặc tả chức năng FR-06 Xem chi tiết sản phẩm (nguồn phụ thuộc cho thao tác nhập số lượng và thêm vào giỏ).
3. **api_specification.md (dòng 110–127):** Giao diện kỹ thuật API cho giỏ hàng (`GET /api/cart` và `POST /api/cart`).
4. **docs/2026.HW02.Domain Testing_En.pdf (mục 6, 9, 10, 12, 14):** Yêu cầu bài tập lớn HW02 về Domain Testing, Boundary Value Analysis, tính toàn vẹn dữ liệu và phân tích khoảng trống AI.
5. **AGENTS.md:** Hướng dẫn bảo toàn SUT, không tự ý sửa mã nguồn ứng dụng khi chưa có yêu cầu, bảo vệ dữ liệu SQLite.

### 1.2. Lựa chọn Phương pháp Kiểm thử
- **Domain Testing:** Áp dụng phương pháp phân tích miền giá trị trên không gian biến đầu vào/trạng thái, xác định biên vị từ (predicates), tính toán các điểm On, Off, In và đánh giá khả thi/che khuất (masking).
- **Boundary Value Analysis (BVA):** Áp dụng kỹ thuật ISTQB 3-value BVA (gồm 3 điểm lân cận quanh mỗi biên hữu hạn: On point và hai điểm Neighbors liền kề).
- **Giới hạn đối chiếu học thuật:** Tại thời điểm thực hiện, tài liệu slide bài giảng chính thức của môn học chưa được cung cấp. Do đó, quy ước ISTQB 3-value BVA và On/Off/In được áp dụng làm căn cứ kỹ thuật chuẩn mực, không tự ý áp đặt các công thức $4n+1$ hay $6n+1$ khi chưa có chỉ định.

---

## 2. Bảng Quy tắc Nghiệp vụ (Business Rules)

| Mã Rule | Phân loại | Nguồn đặc tả | Nội dung quy tắc | Oracle Status |
|---|---|---|---|---|
| **FR07-R01** | UI | `README.md:95` | Hiển thị danh sách sản phẩm dưới dạng bảng với 5 cột bắt buộc: **Sản phẩm**, **Đơn giá**, **Số lượng**, **Thành tiền**, **Thao tác**. | Confirmed |
| **FR07-R02** | Business | `README.md:96` | Thêm cùng một sản phẩm (cùng Product ID) vào giỏ sẽ tăng số lượng tương ứng, không tạo dòng mới. | Confirmed |
| **FR07-R03** | UI / Control | `README.md:95` | Tại cột **Số lượng**, phải có các nút **+** và **-** để điều chỉnh số lượng sản phẩm. | Confirmed |
| **FR07-R04** | UI / Dialog | `README.md:97` | Nút **Xóa sản phẩm** phải hiển thị dialog xác nhận trước khi thực hiện: bấm Cancel giữ nguyên giỏ hàng, bấm Confirm chỉ xóa đúng dòng được chọn. | Confirmed (dialog) / Derived (hậu điều kiện Cancel/Confirm) |
| **FR07-R05** | Navigation | `README.md:98` | Có nút **Tiếp tục mua sắm** dẫn về trang chủ (`/`). | Confirmed |
| **FR07-R06** | UI / Label | `README.md:99` | Nhãn hiển thị tổng tiền phải chính xác là **"Tổng cộng"** (không phải "Tổng tạm tính"). | Confirmed |
| **FR07-R07** | UI / State | `README.md:100` | Khi giỏ hàng trống, phải hiển thị hình minh họa và thông báo rõ ràng. | Confirmed |
| **FR07-R08** | Business | Suy diễn logic | Thành tiền từng dòng: $L = p \times q$. Tổng tiền thanh toán của giỏ hàng: $T = \sum (p_i \times q_i)$. | Derived |
| **FR06-Q** | Dependency | `README.md:86` | Thao tác thêm vào giỏ từ chi tiết sản phẩm: ô nhập số lượng chỉ nhận số nguyên dương, tối thiểu là 1 ($d \in \mathbb{Z}^+, d \ge 1$). | Confirmed (Dependency) |
| **API-AUTH** | Dependency | `api_specification.md:112` | Mọi request tới API giỏ hàng (`GET /api/cart`, `POST /api/cart`) bắt buộc kèm header `Authorization: Bearer <token>`. | Confirmed (API) |

---

## 3. Định nghĩa Không gian Biến & Baseline Fixture

### 3.1. Các biến số & Miền giá trị
- $n \in \mathbb{N}_0$: Số dòng sản phẩm phân biệt có trong giỏ hàng ($n = 0$: giỏ trống; $n \ge 1$: giỏ có sản phẩm).
- $q \in \mathbb{Z}$: Số lượng của một sản phẩm trong giỏ (lát cắt số nguyên, độ phân giải 1 đơn vị).
- $d \in \mathbb{Z}$: Số lượng gửi vào trong thao tác thêm sản phẩm ($d \ge 1$ là hợp lệ theo FR06-Q).
- $r \in \mathbb{N}_0$: Số lần thêm thành công cùng Product ID trước thao tác hiện tại ($r = 0$: chưa có trong giỏ, $r \ge 1$: đã có trong giỏ).
- $id \in \{A, B\}$: Định danh sản phẩm (biến phân loại categorical).
- $action \in \{\text{add}, \text{plus}, \text{minus}, \text{delete}, \text{cancel}, \text{confirm}, \text{continue}\}$: Hành động của người dùng trên giao diện.

### 3.2. Baseline Fixtures
- **Sản phẩm A:** `id = 1`, `name = "Sản phẩm A"`, `price = 100000₫`.
- **Sản phẩm B:** `id = 2`, `name = "Sản phẩm B"`, `price = 250000₫`.
- **Giỏ hàng chuẩn (Nominal Cart):** Giỏ chứa 2 dòng:
  - Dòng 1: Sản phẩm A, $q = 2 \implies \text{Thành tiền} = 200000₫$.
  - Dòng 2: Sản phẩm B, $q = 1 \implies \text{Thành tiền} = 250000₫$.
  - $\text{Tổng cộng} = 200000₫ + 250000₫ = 450000₫$.
- *Ghi chú về đơn vị tiền tệ:* Giá nguyên VND là fixture thuận tiện để phục vụ kiểm thử, không suy diễn thành giới hạn precision hay giới hạn trần tiền tệ của FR-07.

---

## 4. Bảng Đăng ký Điểm Mơ hồ (Ambiguity Register)

| Mã | Vấn đề mơ hồ trong đặc tả | Quyết định xử lý trong kiểm thử | Ảnh hưởng tới Coverage & Verdict |
|---|---|---|---|
| **AMB-01** | Phạm vi áp dụng của FR06-Q ($d \ge 1$, số nguyên dương) lên API và các thao tác giỏ hàng: API `POST /api/cart` có bắt buộc tuân theo quy tắc số lượng $\ge 1$ hay không? | Phân tách: WEB tuân theo FR06-Q; API kiểm tra bằng các ca thăm dò (probe) với giá trị $d \le 0$, số thập phân. | Ca API kiểm tra input âm/0 được ghi nhận quan sát thực tế; nếu spec chưa có error contract thì không tự gán Pass/Fail cảm tính. |
| **AMB-02** | Hành vi nút **-** (minus) tại $q = 1$: Khi số lượng đang là 1 mà người dùng bấm nút "-", hệ thống nên disable nút, giữ nguyên số lượng 1, hay hiển thị dialog xác nhận xóa sản phẩm? | Ghi nhận hành vi thực tế của SUT; coi đây là ca thăm dò đặc tả (characterization probe), không gán verdict Fail nếu thiếu oracle chuẩn. | Case kiểm tra nút minus tại $q=1$ được tách thành probe có ghi chú rõ ràng. |
| **AMB-03** | Giới hạn tối đa của số lượng (Quantity Max), giới hạn số dòng giỏ hàng (Cart Max), và kiểm tra tồn kho (Stock limit). | Không tự bịa ra giá trị giới hạn trần (như 99 hay 999) khi đặc tả không nêu. Dùng probe giá trị lớn để quan sát. | Không đưa cận trên giả định vào bộ ca kiểm thử chuẩn (canonical test suite). |
| **AMB-04** | API Cart thiếu các endpoint cập nhật (`PUT /api/cart`) và xóa (`DELETE /api/cart`), không có schema response chuẩn (không trả về line total, grand total). | Giữ nguyên hiện trạng API theo `api_specification.md` (chỉ có GET và POST). Không giả định có endpoint cập nhật/xóa ở tầng API. | Thao tác sửa số lượng và xóa chỉ kiểm thử ở tầng WEB; tầng API chỉ kiểm thử GET và POST. |
| **AMB-05** | Nhận diện sản phẩm duy nhất: Dựa trên `id` hay `name`? | Theo thông lệ kỹ thuật, định danh dòng dựa trên `product.id`. Cùng tên khác ID là ca probe thăm dò. | Các ca canonical sử dụng ID làm tiêu chí phân biệt sản phẩm. |
| **AMB-06** | Giá sản phẩm: Client gửi giá trong body `POST /api/cart` hay Server lấy từ DB? | Kiểm tra đối chiếu xem API tin tưởng client price hay lấy từ catalog DB. Ghi nhận sai khác nếu có rủi ro bảo mật/toàn vẹn. | Đưa vào danh sách quan sát conformance API. |
| **AMB-07** | Tính bền vững của giỏ hàng (Cart Persistence): Giỏ hàng có lưu sau khi F5/refresh trang, đăng nhập lại, hoặc khởi động lại backend không? | Backend lưu giỏ hàng trong RAM theo từng session/user; Web lưu React Context. Ghi nhận tính bền vững khi refresh là probe. | Tránh reload trang giữa các bước kiểm thử Playwright để không làm mất trạng thái giỏ React. |

---

## 5. Tổng kết Ma trận Truy vết Yêu cầu (Traceability Baseline)

| Nguồn | Mã Rule | Tên chức năng / Tiêu chí | Trạng thái Oracle |
|---|---|---|---|
| `README.md:95` | FR07-R01 | 5 cột giỏ hàng (Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác) | Confirmed |
| `README.md:96` | FR07-R02 | Thêm cùng sản phẩm tăng số lượng, không thêm dòng | Confirmed |
| `README.md:95` | FR07-R03 | Nút +/- điều chỉnh số lượng | Confirmed |
| `README.md:97` | FR07-R04 | Dialog xác nhận xóa (Cancel giữ nguyên, Confirm xóa dòng) | Confirmed / Derived |
| `README.md:98` | FR07-R05 | Nút Tiếp tục mua sắm quay về `/` | Confirmed |
| `README.md:99` | FR07-R06 | Nhãn tổng tiền chính xác là "Tổng cộng" | Confirmed |
| `README.md:100` | FR07-R07 | Giỏ hàng trống có minh họa và thông báo | Confirmed |
| Logic | FR07-R08 | Tính toán Thành tiền ($p \times q$) và Tổng cộng ($\sum p_i q_i$) | Derived |
| `README.md:86` | FR06-Q | Ràng buộc số lượng nhập thêm $\ge 1$, số nguyên dương | Confirmed (Dependency) |
| `api_specification.md:112` | API-AUTH | Xác thực Bearer Token cho API cart | Confirmed (API) |
