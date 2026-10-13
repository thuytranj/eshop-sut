# Báo cáo Lỗi Phần mềm (Software Defect Reports) - FR-07 Shopping Cart

Tài liệu này tổng hợp toàn bộ các lỗi phần mềm (Defects/Bugs) được phát hiện thông qua quá trình thực thi kiểm thử thực tế trên SUT. Toàn bộ các lỗi đều có kịch bản tái hiện tối thiểu (minimal reproduction steps), phân tích nguyên nhân gốc trong mã nguồn (root-cause analysis), và bằng chứng thực nghiệm liên kết trực tiếp.

---

## Danh sách Lỗi Phát hiện

| Mã Lỗi | Tiêu đề Lỗi | Quy tắc Vi phạm | Tầng | Mức độ Nghiêm trọng | Trạng thái |
|---|---|---|---|---|---|
| **FR07-BUG-001** | Thêm cùng sản phẩm vào giỏ không gộp số lượng mà tạo dòng mới | `FR07-R02` | API & WEB | **Major** | Observed |
| **FR07-BUG-002** | Bảng giỏ hàng thiếu các nút điều khiển '+' và '-' để chỉnh số lượng | `FR07-R03` | WEB | **High** | Observed |
| **FR07-BUG-003** | Nút Xóa sản phẩm xóa lập tức mà không có Dialog xác nhận | `FR07-R04` | WEB | **Medium** | Observed |
| **FR07-BUG-004** | Sai tiêu đề cột 'Đơn giá' thành 'Giá' trên bảng giỏ hàng | `FR07-R01` | WEB | **Low** | Observed |
| **FR07-BUG-005** | Nhãn hiển thị tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng' | `FR07-R06` | WEB | **Low** | Observed |
| **FR07-BUG-006** | Giỏ hàng trống không có hình minh họa theo yêu cầu đặc tả | `FR07-R07` | WEB | **Low** | Observed |
| **FR07-BUG-007** | [Dependency] Nút 'Thêm vào giỏ hàng' không hoạt động ở lần bấm đầu tiên | `FR06-Q` | WEB | **Major** | Observed |
| **FR07-BUG-008** | Nhãn nút quay lại trang chủ trên giỏ hàng có sản phẩm bị sai thành '← Mua tiếp' thay vì 'Tiếp tục mua sắm' | `FR07-R05` | WEB | **Low** | Observed |

---

### FR07-BUG-001: Thêm cùng sản phẩm vào giỏ không gộp số lượng mà tạo dòng mới
- **Mã lỗi:** `FR07-BUG-001`
- **Quy tắc bị ảnh hưởng:** `FR07-R02` (*"Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."*)
- **Các ca kiểm thử liên quan:**
  - API: `FR07-TC-009`, `FR07-TC-010`, `FR07-TC-012`
  - WEB: `FR07-TC-014`, `FR07-TC-015`, `FR07-TC-016`, `FR07-TC-017`
- **Tầng bị ảnh hưởng:** Cả API và WEB
- **Mức độ nghiêm trọng (Severity):** **Major** (Lỗi nghiệp vụ cốt lõi, khiến giỏ hàng bị phân mảnh thành nhiều dòng trùng lặp, gây sai lệch trải nghiệm và luồng đặt hàng).
- **Môi trường & Fixture:** Backend SQLite cô lập, Sản phẩm A (`id=1`, `price=100000₫`).
- **Các bước tái hiện (Steps to Reproduce):**
  - **Trên API:**
    1. Đăng nhập người dùng và lấy Bearer token.
    2. Gửi request `POST /api/cart` với body `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}`.
    3. Tiếp tục gửi request `POST /api/cart` lần thứ hai với cùng body trên.
    4. Gửi request `GET /api/cart`.
  - **Trên WEB:**
    1. Vào trang chi tiết Sản phẩm A (`/product/1`), thêm vào giỏ 1 sản phẩm.
    2. Quay lại `/product/1`, tiếp tục thêm vào giỏ 1 sản phẩm.
    3. Mở trang giỏ hàng `/cart`.
- **Kỳ vọng (Expected):**
  - Giỏ hàng chỉ có đúng 1 dòng cho Sản phẩm A, với trường số lượng là $2$ ($1 + 1$).
- **Thực tế quan sát (Actual):**
  - Trên API: Giỏ hàng trả về mảng có 2 phần tử riêng biệt: `[{"id":1, ..., "quantity":1}, {"id":1, ..., "quantity":1}]`.
  - Trên WEB: Bảng giỏ hàng hiển thị 2 dòng riêng biệt cho Sản phẩm A, mỗi dòng số lượng 1.
- **Bằng chứng (Evidence):**
  - Ảnh chụp màn hình WEB: [FR07-TC-014_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png)
  - Log API: `docs/testing/fr07/evidence/fr07-run01/api/observations.json` (mục `FR07-TC-009`)
- **Phân tích mã nguồn (Root Cause Analysis):**
  - *Backend:* Tệp `backend/server.js`, dòng 293:
    ```javascript
    userCarts[userId].push(req.body);
    ```
    Hệ thống luôn thực hiện thao tác `push` trực tiếp object vào mảng mà không kiểm tra xem `item.id` đã tồn tại trong giỏ của `userId` hay chưa để thực hiện cộng dồn `quantity += req.body.quantity`.
  - *Frontend:* Tệp `frontend-web/src/context/CartContext.jsx`, dòng 9:
    ```javascript
    setCart([...cart, { ...product, quantity }]);
    ```
    Frontend cũng nối trực tiếp phần tử mới vào mảng `cart` thay vì tìm kiếm `item.id === product.id` để cập nhật số lượng.

---

### FR07-BUG-002: Bảng giỏ hàng thiếu các nút điều khiển '+' và '-' để chỉnh số lượng
- **Mã lỗi:** `FR07-BUG-002`
- **Quy tắc bị ảnh hưởng:** `FR07-R03` (*"Số lượng (có nút +/- để chỉnh)"*)
- **Các ca kiểm thử liên quan:** `FR07-TC-020` (Fail), kéo theo `FR07-TC-021` và `FR07-TC-022` bị Blocked.
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **High** (Thiếu tính năng tương tác người dùng quan trọng trên giỏ hàng).
- **Các bước tái hiện:**
  1. Thêm sản phẩm vào giỏ hàng.
  2. Mở trang giỏ hàng `/cart`.
  3. Kiểm tra các phần tử hiển thị tại cột **Số lượng**.
- **Kỳ vọng:** Cột Số lượng phải có nút "+" (tăng) và nút "-" (giảm) bên cạnh số lượng hiện tại.
- **Thực tế quan sát:** Cột Số lượng chỉ hiển thị một chuỗi text số thuần túy (ví dụ `<td>{item.quantity}</td>`), hoàn toàn không có bất kỳ nút bấm tương tác nào.
- **Bằng chứng:** [FR07-TC-020_check_controls.png](evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 47:
  ```jsx
  <td>{item.quantity}</td>
  ```
  Lập trình viên chỉ render giá trị số lượng mà chưa cài đặt các component nút bấm `+` và `-` cũng như hàm xử lý cập nhật số lượng `updateQuantity(index, delta)`.

---

### FR07-BUG-003: Nút Xóa sản phẩm xóa lập tức mà không có Dialog xác nhận
- **Mã lỗi:** `FR07-BUG-003`
- **Quy tắc bị ảnh hưởng:** `FR07-R04` (*"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."*)
- **Các ca kiểm thử liên quan:** `FR07-TC-023` (Fail), kéo theo `FR07-TC-024` và `FR07-TC-025` bị Blocked.
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Medium** (Rủi ro mất dữ liệu thao tác của người dùng do thiếu bước xác nhận an toàn).
- **Các bước tái hiện:**
  1. Thêm sản phẩm vào giỏ hàng và mở `/cart`.
  2. Bấm vào nút "Xóa" tại cột Thao tác của một dòng sản phẩm.
- **Kỳ vọng:** Xuất hiện một dialog/modal hoặc `window.confirm` hỏi "Bạn có chắc chắn muốn xóa sản phẩm này?", chỉ khi bấm Confirm mới xóa sản phẩm.
- **Thực tế quan sát:** Không có bất kỳ hộp thoại hay dialog nào xuất hiện; sản phẩm bị xóa khỏi giỏ hàng ngay lập tức khi vừa click.
- **Bằng chứng:**
  - Trước khi click: [FR07-TC-023_before_delete.png](evidence/fr07-run01/web/screenshots/FR07-TC-023_before_delete.png)
  - Ngay sau khi click: [FR07-TC-023_after_delete_click.png](evidence/fr07-run01/web/screenshots/FR07-TC-023_after_delete_click.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 50-55:
  ```jsx
  <button
    onClick={() => removeFromCart(index)}
    className="text-red-500 hover:text-red-700"
  >
    Xóa
  </button>
  ```
  Sự kiện `onClick` gọi trực tiếp `removeFromCart(index)` mà không mở modal xác nhận trước.

---

### FR07-BUG-004: Sai tiêu đề cột 'Đơn giá' thành 'Giá' trên bảng giỏ hàng
- **Mã lỗi:** `FR07-BUG-004`
- **Quy tắc bị ảnh hưởng:** `FR07-R01` (*"Hiển thị danh sách sản phẩm với các cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác"*)
- **Các ca kiểm thử liên quan:** `FR07-TC-027`
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Low** (Lỗi hiển thị nhãn/UI copy).
- **Các bước tái hiện:**
  1. Mở trang giỏ hàng có sản phẩm `/cart`.
  2. Quan sát tiêu đề cột thứ hai của bảng.
- **Kỳ vọng:** Tiêu đề cột là **"Đơn giá"**.
- **Thực tế quan sát:** Tiêu đề cột hiển thị là **"Giá"**.
- **Bằng chứng:** [FR07-TC-027_columns.png](evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 36:
  ```jsx
  <th className="py-2">Giá</th>
  ```

---

### FR07-BUG-005: Nhãn hiển thị tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng'
- **Mã lỗi:** `FR07-BUG-005`
- **Quy tắc bị ảnh hưởng:** `FR07-R06` (*"Tổng tiền hiển thị nhãn chính xác: "Tổng cộng" (không phải "Tổng tạm tính")."*)
- **Các ca kiểm thử liên quan:** `FR07-TC-028`
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Low** (Sai quy định nhãn văn bản đã được đặc tả nhấn mạnh).
- **Các bước tái hiện:**
  1. Mở trang giỏ hàng có sản phẩm `/cart`.
  2. Quan sát dòng hiển thị tổng tiền bên dưới bảng.
- **Kỳ vọng:** Nhãn là **"Tổng cộng"**.
- **Thực tế quan sát:** Nhãn hiển thị là **"Tổng tạm tính:"**.
- **Bằng chứng:** [FR07-TC-028_total_label.png](evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 63:
  ```jsx
  Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
  ```

---

### FR07-BUG-006: Giỏ hàng trống không có hình minh họa theo yêu cầu đặc tả
- **Mã lỗi:** `FR07-BUG-006`
- **Quy tắc bị ảnh hưởng:** `FR07-R07` (*"Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng."*)
- **Các ca kiểm thử liên quan:** `FR07-TC-001`
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Low** (Thiếu thành phần giao diện đồ họa).
- **Các bước tái hiện:**
  1. Mở trang `/cart` khi chưa có sản phẩm trong giỏ.
- **Kỳ vọng:** Hiển thị thông báo văn bản kèm theo hình minh họa (thẻ `<img>` hoặc vector SVG mô tả giỏ trống).
- **Thực tế quan sát:** Chỉ có dòng tiêu đề chữ `<h2 ...>Giỏ hàng của bạn đang trống</h2>` và đường dẫn "Tiếp tục mua sắm", hoàn toàn không có hình ảnh hay vector minh họa nào.
- **Bằng chứng:** [FR07-TC-001_view_empty.png](evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 20-27:
  ```jsx
  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
      </div>
    );
  }
  ```

---

### FR07-BUG-007: [Dependency] Nút 'Thêm vào giỏ hàng' không hoạt động ở lần bấm đầu tiên
- **Mã lỗi:** `FR07-BUG-007`
- **Quy tắc bị ảnh hưởng:** `FR06-Q` (Ràng buộc phụ thuộc từ FR-06)
- **Các ca kiểm thử liên quan:** `FR07-TC-002`, `FR07-TC-004`, `FR07-TC-006`
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Major** (Người dùng bấm nút "Thêm vào giỏ hàng" nhưng sản phẩm không được thêm, gây tưởng nhầm hệ thống bị đơ hoặc lỗi).
- **Các bước tái hiện:**
  1. Vào trang chi tiết sản phẩm bất kỳ (ví dụ `/product/1`).
  2. Bấm nút "Thêm vào giỏ hàng" 1 lần.
  3. Mở trang giỏ hàng `/cart`.
- **Kỳ vọng:** Sản phẩm được thêm vào giỏ hàng và hiển thị trong danh sách.
- **Thực tế quan sát:** Giỏ hàng vẫn ở trạng thái trống; phải bấm nút lần thứ 2 thì sản phẩm mới được thêm vào giỏ.
- **Bằng chứng:** [FR07-TC-002_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-002_cart_result.png)
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/ProductDetail.jsx`, dòng 21-25:
  ```jsx
  const handleAddToCart = () => {
    if (clickCount === 0) {
      setClickCount(1);
      return; // Không làm gì cả ở lần đầu tiên
    }
    addToCart(product, parseInt(quantity));
    ...
  ```
  Hàm xử lý sự kiện cố tình chặn không thực hiện thêm sản phẩm ở lần click đầu tiên (`if (clickCount === 0) return;`).

---

### FR07-BUG-008: Nhãn nút quay lại trang chủ trên giỏ hàng có sản phẩm bị sai thành '← Mua tiếp' thay vì 'Tiếp tục mua sắm'
- **Mã lỗi:** `FR07-BUG-008`
- **Quy tắc bị ảnh hưởng:** `FR07-R05` (*"Nút 'Tiếp tục mua sắm' quay về danh sách sản phẩm / trang chủ"*)
- **Các ca kiểm thử liên quan:** `FR07-TC-029` (phát hiện đối chứng trạng thái giỏ trống và giỏ có hàng), quan sát UI trên các ca kiểm thử giỏ có hàng (`FR07-TC-014` .. `FR07-TC-020`)
- **Tầng bị ảnh hưởng:** WEB
- **Mức độ nghiêm trọng (Severity):** **Low** (Không chặn chức năng điều hướng quay về trang chủ, nhưng vi phạm tính nhất quán nhãn UI quy định trong đặc tả nghiệp vụ).
- **Các bước tái hiện (Steps to Reproduce):**
  1. Thêm ít nhất một sản phẩm vào giỏ hàng.
  2. Mở trang giỏ hàng `/cart`.
  3. Quan sát nút bấm quay lại danh sách sản phẩm / trang chủ phía dưới bảng giỏ hàng.
- **Kỳ vọng:** Nhãn nút hiển thị đúng văn bản "Tiếp tục mua sắm" theo `README.md:98` (*"Nút 'Tiếp tục mua sắm' quay về danh sách sản phẩm / trang chủ"*).
- **Thực tế quan sát:** Nút hiển thị văn bản `← Mua tiếp` (chỉ khi giỏ trống mới hiển thị đúng nhãn "Tiếp tục mua sắm").
- **Bằng chứng:** Ảnh chụp màn hình giỏ có hàng [FR07-TC-014_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png).
- **Phân tích mã nguồn:** Tệp `frontend-web/src/pages/Cart.jsx`, dòng 66-68:
  ```jsx
  <Link to="/" className="text-blue-600 hover:underline">
    ← Mua tiếp
  </Link>
  ```
  Nhãn này không nhất quán với trạng thái giỏ trống tại dòng 165 (`Tiếp tục mua sắm`) và sai lệch so với yêu cầu đặc tả `README.md:98`.
