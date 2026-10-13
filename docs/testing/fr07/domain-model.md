# Mô hình Miền (Domain Model) - FR-07 Shopping Cart

## 1. Không gian Miền & Các Vị từ Toán học (Mathematical Predicates)

Mô hình hóa các quy tắc kiểm thử của FR-07 dựa trên lý thuyết Domain Testing, phân tích các biến đầu vào, biến trạng thái và hậu điều kiện đầu ra.

### 1.1. Các vị từ đầu vào và trạng thái (Input & State Predicates)
1. **Vị từ hợp lệ số lượng thêm mới (Add Quantity Validity):**
   $$\text{ValidAddQuantity}(d) \iff (d \in \mathbb{Z} \land d \ge 1)$$
   - *Miền hợp lệ:* Các số nguyên dương $d \in \{1, 2, 3, \dots\}$.
   - *Miền phần bù không hợp lệ:*
     - Lát cắt số nguyên không dương: $d \in \mathbb{Z} \land d \le 0$ ($d = 0, -1, -2, \dots$).
     - Lát cắt số thực không nguyên: $d \in \mathbb{R} \setminus \mathbb{Z}$ (ví dụ $1.5, 2.7$).
     - Lát cắt sai kiểu dữ liệu / chuỗi rỗng: $d = \text{""}, \text{NaN}, \text{"abc"}$.

2. **Vị từ số lượng dòng giỏ hàng (Cart Item Count - State):**
   - Trạng thái giỏ trống:
     $$\text{Empty}(n) \iff (n = 0) \quad \text{với } n \in \mathbb{N}_0$$
   - Trạng thái giỏ có hàng:
     $$\text{Nonempty}(n) \iff (n \ge 1) \quad \text{với } n \in \mathbb{N}_0$$
   - *Ràng buộc khả thi:* Số dòng $n < 0$ là bất khả thi trong không gian trạng thái thực tế của hệ thống.

3. **Vị từ sự tồn tại của sản phẩm trong giỏ (Cart Membership):**
   $$\text{Member}(id, C) \iff \exists \text{ item} \in C : \text{item.id} = id$$
   - $\text{Member}(id, C) = \text{True}$: Sản phẩm đã tồn tại trong giỏ (kích hoạt quy tắc tăng số lượng R02).
   - $\text{Member}(id, C) = \text{False}$: Sản phẩm chưa có trong giỏ (kích hoạt quy tắc tạo dòng mới).

### 1.2. Các vị từ hậu điều kiện & mặt phẳng đẳng thức đầu ra (Postcondition Equalities)
1. **Hậu điều kiện gộp dòng (Merge Postcondition):**
   $$\text{MergePost}(q, d, q') \iff (q' = q + d) \land (\text{rows}(id) = 1)$$
   - Mặt phẳng đẳng thức: $q' - q - d = 0$.
   - Số dòng của sản phẩm đó trong giỏ phải duy nhất bằng 1.

2. **Hậu điều kiện tính tiền (Line Total & Grand Total):**
   $$\text{Line}(L, p, q) \iff L = p \times q$$
   $$\text{Total}(T, C) \iff T = \sum_{i=1}^n (p_i \times q_i)$$
   - Đây là các đẳng thức đầu ra quan sát được; bộ kiểm thử thay đổi $(p, q)$ để xác minh sự bảo toàn đẳng thức toán học.

3. **Hậu điều kiện xóa sản phẩm (Delete Postcondition):**
   $$\text{DeletePost}(action, C, C', target) \iff \begin{cases} (\text{target} \notin C' \land |C'| = |C| - 1) & \text{nếu } action = \text{Confirm} \\ (C' = C) & \text{nếu } action = \text{Cancel} \end{cases}$$

---

## 2. Phân tích Điểm On, Off, In và Tọa độ Miền (On/Off/In Analysis)

Theo quy ước Domain Testing chuẩn:
- **On point:** Nằm chính xác trên ranh giới (boundary line/surface).
- **Off point:** Nằm ngay sát ranh giới, ở phía đối diện của On point (với biên bao gồm: Off nằm ngoài miền hợp lệ; với biên loại trừ: Off nằm trong miền hợp lệ). Khoảng cách xác định bởi độ phân giải (resolution) của biến.
- **In point:** Nằm sâu bên trong miền hợp lệ.

### 2.1. Miền số lượng thêm $d$ (ValidAddQuantity: $d \ge 1$, resolution $\Delta = 1$)
- **Ranh giới:** $d = 1$ (Biên kín / Included boundary: thỏa mãn điều kiện $d \ge 1$).
- **On point:** $d = 1$ ($\text{ValidAddQuantity}(1) = \text{True}$).
- **Off point (phía không hợp lệ):** $d = 1 - 1 = 0$ ($\text{ValidAddQuantity}(0) = \text{False}$).
- **Off point (phía hợp lệ liền kề):** $d = 1 + 1 = 2$ ($\text{ValidAddQuantity}(2) = \text{True}$).
- **In point:** $d = 3$ ($\text{ValidAddQuantity}(3) = \text{True}$, nằm trong miền hợp lệ).
- **Các phân vùng bổ sung ngoài lát cắt số nguyên:**
  - Số nguyên âm: $d = -1$ (Negative integer).
  - Số thập phân: $d = 1.5$ (Fractional number).
  - Chuỗi rỗng: $d = \text{""}$ (Empty input).

### 2.2. Miền trạng thái số dòng giỏ hàng $n$ ($\text{Empty}: n = 0$; $\text{Nonempty}: n \ge 1$)
- **Ranh giới:** $n = 0$ (Giỏ trống vs Giỏ có sản phẩm).
- **On point (Empty):** $n = 0$ (Hiển thị hình minh họa và thông báo giỏ trống).
- **Off point (Nonempty khả thi):** $n = 1$ (Hiển thị bảng 5 cột với đúng 1 dòng sản phẩm).
- **In point (Nonempty):** $n = 2$ (Hiển thị bảng với 2 dòng sản phẩm A và B).
- *Lưu ý:* $n = -1$ là điểm Off về mặt toán học nhưng bất khả thi (infeasible) trong hệ thống thực tế.

### 2.3. Mặt phẳng đẳng thức gộp dòng: $q' = q + d$
- Trong Domain Testing, mặt phẳng đẳng thức số nguyên không có miền trong (interior) theo hướng pháp tuyến (vì bất kỳ độ lệch nào cũng khiến đẳng thức sai: $q' \ne q + d$). Do đó, giá trị Interior theo pháp tuyến là **N/A**.
- Chúng ta chọn các điểm kiểm thử trên bề mặt On với các cặp $(q, d)$ khác nhau để tránh rủi ro logic bị hardcode hoặc bỏ sót:
  - **Điểm On 1:** $(q, d) = (1, 1) \implies \text{Expected } q' = 2$.
  - **Điểm On 2:** $(q, d) = (2, 3) \implies \text{Expected } q' = 5$.
  - **Điểm In (trong không gian input):** $(q, d) = (3, 2) \implies \text{Expected } q' = 5$.
  - *Điểm Off:* Tương ứng với lỗi sai lệch tính toán của SUT ($q' = (q+d) \pm 1$). Do $q'$ là biến đầu ra không thể điều khiển trực tiếp, kiểm thử assert đẳng thức $q' = q + d$ để phát hiện vi phạm Off point.

---

## 3. Bảng Điểm Vị từ & Đánh giá Tính Khả thi (Point/Predicate Feasibility Table)

| Vị từ kiểm thử | Biến / Tuple | Resolution | Loại điểm | Giá trị thực | Rationale & Kỳ vọng kiểm thử | Mã nghĩa vụ (Obligation) |
|---|---|---|---|---|---|---|
| `ValidAddQuantity` | $d$ | 1 | **On** | $d = 1$ | Biên nhỏ nhất hợp lệ; thêm thành công 1 sản phẩm vào giỏ | `FR07-OBL-DT-QTY-ON` |
| `ValidAddQuantity` | $d$ | 1 | **Off (Inv)** | $d = 0$ | Giá trị ngay sát biên dưới; từ chối thêm, giữ nguyên giỏ hàng | `FR07-OBL-DT-QTY-OFF-0` |
| `ValidAddQuantity` | $d$ | 1 | **Off (Val)** | $d = 2$ | Giá trị hợp lệ liền kề; thêm thành công 2 sản phẩm | `FR07-OBL-DT-QTY-OFF-2` |
| `ValidAddQuantity` | $d$ | 1 | **In** | $d = 3$ | Nằm sâu trong miền hợp lệ; thêm thành công 3 sản phẩm | `FR07-OBL-DT-QTY-IN` |
| `ValidAddQuantity` | $d$ | N/A | **Negative** | $d = -1$ | Phân vùng số âm; từ chối thêm, không làm sai lệch số lượng | `FR07-OBL-DT-QTY-NEG` |
| `ValidAddQuantity` | $d$ | N/A | **Fraction** | $d = 1.5$ | Phân vùng số thực; từ chối hoặc chặn không cho nhập | `FR07-OBL-DT-QTY-FRAC` |
| `ValidAddQuantity` | $d$ | N/A | **Empty** | $d = \text{""}$ | Phân vùng chuỗi rỗng; giữ nguyên giỏ | `FR07-OBL-DT-QTY-EMPTY` |
| `Empty(n)` | $n$ | 1 | **On** | $n = 0$ | Giỏ trống: có ảnh minh họa và thông báo rõ ràng | `FR07-OBL-DT-EMPTY-ON` |
| `Nonempty(n)` | $n$ | 1 | **Off (Val)** | $n = 1$ | Giỏ có 1 sản phẩm: hiển thị bảng, không có thông báo trống | `FR07-OBL-DT-EMPTY-OFF1` |
| `Nonempty(n)` | $n$ | 1 | **In** | $n = 2$ | Giỏ có 2 sản phẩm A và B: hiển thị 2 dòng bảng | `FR07-OBL-DT-EMPTY-IN2` |
| `MergePost` (API) | $(q, d)$ | 1 | **On 1** | $(1, 1)$ | A có sẵn $q=1$, thêm $d=1 \implies q'=2$, duy nhất 1 dòng | `FR07-OBL-DT-MERGE-API-1` |
| `MergePost` (API) | $(q, d)$ | 1 | **On 2** | $(2, 3)$ | A có sẵn $q=2$, thêm $d=3 \implies q'=5$, duy nhất 1 dòng | `FR07-OBL-DT-MERGE-API-2` |
| `MergePost` (WEB) | $(q, d)$ | 1 | **On 1** | $(1, 1)$ | A có sẵn $q=1$, thêm $d=1 \implies q'=2$, Thành tiền $200000₫$ | `FR07-OBL-DT-MERGE-WEB-1` |
| `MergePost` (WEB) | $(q, d)$ | 1 | **On 2** | $(2, 3)$ | A có sẵn $q=2$, thêm $d=3 \implies q'=5$, Thành tiền $500000₫$ | `FR07-OBL-DT-MERGE-WEB-2` |
| `MergePost` (WEB) | $(q, d)$ | 1 | **In** | $(3, 2)$ | A có sẵn $q=3$, thêm $d=2 \implies q'=5$, B giữ nguyên | `FR07-OBL-DT-MERGE-WEB-IN` |
| `DeletePost` (Cancel) | `action` | N/A | **Partition** | Cancel | Bấm nút Xóa $\to$ Dialog hiện $\to$ Cancel: Giỏ nguyên vẹn | `FR07-OBL-DT-DEL-CANCEL` |
| `DeletePost` (Confirm) | `action` | N/A | **Partition** | Confirm | Bấm nút Xóa $\to$ Dialog hiện $\to$ Confirm: Dòng bị xóa | `FR07-OBL-DT-DEL-CONFIRM` |
| `DeletePost` (Last) | $n \to 0$ | 1 | **Transition** | Confirm | Xóa dòng cuối cùng của giỏ $n=1 \to n=0$: Chuyển sang giỏ trống | `FR07-OBL-DT-DEL-LAST` |
| `Line` & `Total` | $(p_i, q_i)$ | N/A | **Output** | A(2), B(1) | Line A=$200k$, Line B=$250k$, Tổng cộng=$450000₫$ | `FR07-OBL-DT-CALC-NOMINAL` |
| `API-AUTH` (GET) | `token` | N/A | **Valid** | Bearer OK | Trả về 200 OK và giỏ hàng của user | `FR07-OBL-DT-AUTH-GET-VAL` |
| `API-AUTH` (GET) | `token` | N/A | **Missing** | None | Trả về 401 Unauthorized | `FR07-OBL-DT-AUTH-GET-NO` |
| `API-AUTH` (POST) | `token` | N/A | **Invalid** | Fake token | Trả về 401/403, không sửa đổi dữ liệu giỏ | `FR07-OBL-DT-AUTH-POST-INV` |

---

## 4. Đánh giá Che khuất & Tính Độc lập (Masking & Independence)
- **Che khuất do lỗi thiếu UI Control:** Nếu nút +/- hoặc dialog xác nhận xóa không tồn tại trong mã nguồn giao diện, các bước tương tác tiếp theo (bấm +/-, bấm Confirm/Cancel) sẽ bị che khuất (masking). Quy trình kiểm thử sẽ:
  1. Kiểm tra sự hiện diện của control trước (Presence check).
  2. Nếu không hiện diện: Đánh giá ca kiểm tra Presence là **Failed**, và đánh dấu các ca phụ thuộc thao tác là **Blocked**, không tự ý click vượt rào hoặc bypass dialog.
- **Tách biệt giữa các tầng API và WEB:**
  - API cart và WEB React Context sử dụng cơ chế lưu trữ và đường đi dữ liệu khác nhau. Không được dùng kết quả của API GET để suy diễn trạng thái của React DOM, và ngược lại.
