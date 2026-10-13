# Báo cáo Phân tích Giá trị Biên (Boundary Value Analysis - BVA Report) - FR-07

## 1. Phương pháp & Nguyên tắc Áp dụng (Methodology & Guidelines)

- **Kỹ thuật áp dụng:** ISTQB 3-value Boundary Value Analysis (3-value BVA).
- **Nguyên lý 3 giá trị:** Đối với mỗi điểm biên hữu hạn (finite boundary endpoint), tập hợp kiểm thử bao gồm:
  1. Chính giá trị biên (**On point**).
  2. Giá trị lân cận liền kề phía dưới (**Neighbor below**: $\text{endpoint} - \text{resolution}$).
  3. Giá trị lân cận liền kề phía trên (**Neighbor above**: $\text{endpoint} + \text{resolution}$).
- **Hợp nhất (Union):** Khi hai phân vùng liền kề có các điểm biên đối diện (ví dụ biên trên của vùng không hợp lệ và biên dưới của vùng hợp lệ), tập hợp các giá trị kiểm thử của từng biên được hợp nhất (union set) để loại bỏ giá trị trùng lặp mà vẫn đảm bảo 100% nghĩa vụ kiểm thử biên.
- **Giới hạn phạm vi (Scope limitations):** Chỉ áp dụng BVA cho các biến số có thứ tự (ordered domains: số lượng $d$, số dòng $n$, số lần lặp $r$). Các biến định danh, chuỗi ký tự, hoặc trạng thái logic hai giá trị (Boolean confirmation) không có quan hệ thứ tự số học nên không áp dụng BVA.

---

## 2. Phân vùng Có thứ tự & Điểm Biên Hữu hạn (Ordered Partitions & Endpoints)

### 2.1. Chiều 1: Số lượng nhập thêm trên giao diện WEB (ADD-Q)
- **Nguồn:** `README.md:86` (FR06-Q: số nguyên dương $\ge 1$).
- **Kiểu dữ liệu & Độ phân giải:** Số nguyên $d \in \mathbb{Z}$, độ phân giải $\Delta = 1$.
- **Các phân vùng có thứ tự (Ordered Partitions):**
  - Phân vùng không hợp lệ: $(-\infty, 0] \cap \mathbb{Z}$ (các số nguyên $\le 0$).
  - Phân vùng hợp lệ: $[1, +\infty) \cap \mathbb{Z}$ (các số nguyên dương $\ge 1$).
- **Các điểm biên hữu hạn (Finite Endpoints):**
  - Biên trên của vùng không hợp lệ: $\text{endpoint}_1 = 0$.
  - Biên dưới của vùng hợp lệ: $\text{endpoint}_2 = 1$.
  *(Không có biên trên hữu hạn vì đặc tả không quy định Quantity Max).*

### 2.2. Chiều 2: Số dòng sản phẩm trong giỏ hàng WEB (CART-N)
- **Nguồn:** `README.md:100` (giỏ trống) & `README.md:95` (danh sách sản phẩm).
- **Không gian biến khả thi:** $n \in \mathbb{N}_0 = \{0, 1, 2, \dots\}$, độ phân giải $\Delta = 1$.
- **Các phân vùng trạng thái có thứ tự:**
  - Trạng thái giỏ trống: $\{0\}$ ($n = 0$).
  - Trạng thái giỏ có hàng: $[1, +\infty) \cap \mathbb{N}_0$ ($n \ge 1$).
- **Các điểm biên hữu hạn:**
  - Biên trạng thái giỏ trống: $\text{endpoint}_1 = 0$.
  - Biên trạng thái giỏ có hàng: $\text{endpoint}_2 = 1$.

### 2.3. Chiều 3: Số lần thêm thành công cùng Product ID trước thao tác (REPEAT - API)
- **Nguồn:** `README.md:96` & `api_specification.md:118-127` (thêm cùng ID tăng số lượng).
- **Không gian biến:** $r \in \mathbb{N}_0$, độ phân giải $\Delta = 1$.
- **Các phân vùng trạng thái:**
  - Chưa từng thêm sản phẩm A: $\{0\}$ ($r = 0$, chưa có trong giỏ).
  - Đã có sản phẩm A trong giỏ: $[1, +\infty) \cap \mathbb{N}_0$ ($r \ge 1$).
- **Các điểm biên hữu hạn:** $\text{endpoint}_1 = 0$, $\text{endpoint}_2 = 1$.

### 2.4. Chiều 4: Số lần thêm thành công cùng Product ID trước thao tác (REPEAT - WEB)
- **Nguồn:** `README.md:96` (cùng ID tăng số lượng, không thêm dòng trên giao diện web).
- **Không gian biến:** $r \in \mathbb{N}_0$, độ phân giải $\Delta = 1$.
- **Các phân vùng trạng thái:** $\{0\}$ ($r = 0$) và $[1, +\infty)$ ($r \ge 1$).
- **Các điểm biên hữu hạn:** $\text{endpoint}_1 = 0$, $\text{endpoint}_2 = 1$.

---

## 3. Tính toán Vùng lân cận 3 Giá trị & Tập Hợp nhất (3-Value Neighborhoods & Union)

| Chiều kiểm thử / Thao tác | Điểm biên hữu hạn | Tập lân cận 3 giá trị $\{\text{ep}-1, \text{ep}, \text{ep}+1\}$ | Đánh giá tính khả thi trong SUT | Tập giá trị sau hợp nhất (Union Set) | Số nghĩa vụ giá trị (Value Obligations) |
|---|---|---|---|---|---|
| **ADD-Q (WEB)** | $\text{ep}_1 = 0$ | $\{-1, 0, 1\}$ | $-1$ khả thi nhập trên input | $\{-1, 0, 1, 2\}$ | **4** |
| | $\text{ep}_2 = 1$ | $\{0, 1, 2\}$ | Toàn bộ khả thi | | |
| **CART-N (WEB)** | $\text{ep}_1 = 0$ | $\{-1, 0, 1\}$ | $-1$ bất khả thi ($n \ge 0$) $\to \{0, 1\}$ | $\{0, 1, 2\}$ | **3** |
| | $\text{ep}_2 = 1$ | $\{0, 1, 2\}$ | Toàn bộ khả thi | | |
| **REPEAT (API)** | $\text{ep}_1 = 0$ | $\{-1, 0, 1\}$ | $-1$ bất khả thi ($r \ge 0$) $\to \{0, 1\}$ | $\{0, 1, 2\}$ | **3** |
| | $\text{ep}_2 = 1$ | $\{0, 1, 2\}$ | Toàn bộ khả thi | | |
| **REPEAT (WEB)** | $\text{ep}_1 = 0$ | $\{-1, 0, 1\}$ | $-1$ bất khả thi ($r \ge 0$) $\to \{0, 1\}$ | $\{0, 1, 2\}$ | **3** |
| | $\text{ep}_2 = 1$ | $\{0, 1, 2\}$ | Toàn bộ khả thi | | |

> **Tổng số nghĩa vụ kiểm thử biên đã xác định:** $4 + 3 + 3 + 3 = 13$ **nghĩa vụ giá trị biên (Value Obligations)**.
> *Lưu ý quan trọng:* 13 nghĩa vụ này bao phủ toàn bộ các chiều có thứ tự đã biết trong đặc tả, tách bạch theo từng tầng (API vs WEB) và từng thao tác.

---

## 4. Thiết kế Chi tiết & Kỳ vọng Từng Giá trị Biên (Fixtures & Expected Results)

### 4.1. Họ ca kiểm thử `FR07-BVA-ADDQ-*` (Thao tác nhập số lượng thêm $d$)
- **Fixture ban đầu:** Giỏ hàng rỗng ($n=0$), chọn Sản phẩm A (`id=1`, `price=100000₫`).

#### FR07-BVA-ADDQ-001: Giá trị biên $d = -1$ (Lân cận dưới của biên $0$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-ADDQ-NEG1`
- **Tầng:** WEB | **Quy tắc:** `FR06-Q`
- **Các bước:** Vào chi tiết SP A, nhập số lượng $-1$, bấm Thêm vào giỏ hàng, mở `/cart`.
- **Kỳ vọng:** Bị chặn/từ chối; giỏ hàng giữ nguyên trạng thái rỗng ($n=0$).
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-ADDQ-002: Giá trị biên $d = 0$ (Chính điểm biên $0$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-ADDQ-0`
- **Tầng:** WEB | **Quy tắc:** `FR06-Q`
- **Các bước:** Vào chi tiết SP A, nhập số lượng $0$, bấm Thêm vào giỏ hàng, mở `/cart`.
- **Kỳ vọng:** Bị từ chối thêm; giỏ hàng vẫn ở trạng thái rỗng ($n=0$).
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-ADDQ-003: Giá trị biên $d = 1$ (Chính điểm biên $1$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-ADDQ-1`
- **Tầng:** WEB | **Quy tắc:** `FR06-Q`, `FR07-R01`
- **Các bước:** Vào chi tiết SP A, nhập số lượng $1$, bấm Thêm vào giỏ hàng, mở `/cart`.
- **Kỳ vọng:** Thêm thành công Sản phẩm A với số lượng $q=1$, Thành tiền $100000₫$, Tổng cộng $100000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-ADDQ-004: Giá trị biên $d = 2$ (Lân cận trên của biên $1$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-ADDQ-2`
- **Tầng:** WEB | **Quy tắc:** `FR06-Q`, `FR07-R01`
- **Các bước:** Vào chi tiết SP A, nhập số lượng $2$, bấm Thêm vào giỏ hàng, mở `/cart`.
- **Kỳ vọng:** Thêm thành công Sản phẩm A với số lượng $q=2$, Thành tiền $200000₫$, Tổng cộng $200000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

---

### 4.2. Họ ca kiểm thử `FR07-BVA-CARTN-*` (Trạng thái số dòng sản phẩm trong giỏ $n$)
- **Fixture ban đầu:** Tạo giỏ hàng có chính xác $n$ sản phẩm phân biệt.

#### FR07-BVA-CARTN-001: Trạng thái biên $n = 0$ (Giỏ hàng trống)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-CARTN-0`
- **Tầng:** WEB | **Quy tắc:** `FR07-R07`
- **Các bước:** Mở `/cart` khi giỏ hàng chưa thêm bất kỳ sản phẩm nào.
- **Kỳ vọng:** Hiển thị hình minh họa giỏ trống và thông báo rõ ràng; không có bảng sản phẩm.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-CARTN-002: Trạng thái biên $n = 1$ (Giỏ hàng có đúng 1 sản phẩm)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-CARTN-1`
- **Tầng:** WEB | **Quy tắc:** `FR07-R01`, `FR07-R08`
- **Các bước:** Thêm Sản phẩm A ($q=1$), mở `/cart`.
- **Kỳ vọng:** Bảng hiển thị đúng 1 dòng của Sản phẩm A; Thành tiền $100000₫$, Tổng cộng $100000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-CARTN-003: Trạng thái biên $n = 2$ (Giỏ hàng có 2 sản phẩm phân biệt)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-CARTN-2`
- **Tầng:** WEB | **Quy tắc:** `FR07-R01`, `FR07-R08`
- **Các bước:** Thêm Sản phẩm A ($q=1$) và Sản phẩm B ($q=1$), mở `/cart`.
- **Kỳ vọng:** Bảng hiển thị đúng 2 dòng phân biệt; Tổng cộng $100000₫ + 250000₫ = 350000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

---

### 4.3. Họ ca kiểm thử `FR07-BVA-REPEAT-API-*` (Số lần thêm lặp lại cùng sản phẩm trên API)
- **Fixture ban đầu:** User có tài khoản hợp lệ, giỏ hàng được khởi tạo rỗng trên server. Thao tác tiếp theo là gửi thêm 1 request `POST /api/cart` cho Sản phẩm A với `quantity: 1`.

#### FR07-BVA-REPEAT-API-001: Điểm biên $r = 0$ (Chưa từng thêm SP A trước đó)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-API-0`
- **Tầng:** API | **Quy tắc:** `FR07-R02`
- **Các bước:** Giỏ rỗng ($r=0$), gửi `POST /api/cart` thêm A ($q=1$), sau đó `GET /api/cart`.
- **Kỳ vọng:** Giỏ hàng có 1 dòng cho Sản phẩm A với số lượng $q = 1$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-REPEAT-API-002: Điểm biên $r = 1$ (Đã thêm SP A 1 lần trước đó)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-API-1`
- **Tầng:** API | **Quy tắc:** `FR07-R02`
- **Các bước:** Giỏ đã có A ($q=1, r=1$), gửi thêm 1 lần `POST /api/cart` cho A ($q=1$), sau đó `GET /api/cart`.
- **Kỳ vọng:** Giỏ hàng chỉ có đúng 1 dòng cho Sản phẩm A, số lượng gộp thành $q = 2$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-REPEAT-API-003: Điểm biên $r = 2$ (Đã thêm SP A 2 lần trước đó)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-API-2`
- **Tầng:** API | **Quy tắc:** `FR07-R02`
- **Các bước:** Giỏ đã có A ($q=2, r=2$), gửi thêm 1 lần `POST /api/cart` cho A ($q=1$), sau đó `GET /api/cart`.
- **Kỳ vọng:** Giỏ hàng chỉ có đúng 1 dòng cho Sản phẩm A, số lượng gộp thành $q = 3$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

---

### 4.4. Họ ca kiểm thử `FR07-BVA-REPEAT-WEB-*` (Số lần thêm lặp lại cùng sản phẩm trên WEB)
- **Fixture ban đầu:** Giỏ hàng React context trên web. Thao tác tiếp theo là thêm 1 sản phẩm A với số lượng $d = 1$ từ trang chi tiết sản phẩm.

#### FR07-BVA-REPEAT-WEB-001: Điểm biên $r = 0$ (Chưa có SP A trong giỏ)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-WEB-0`
- **Tầng:** WEB | **Quy tắc:** `FR07-R02`, `FR07-R08`
- **Các bước:** Giỏ rỗng ($r=0$), vào `/product/1`, thêm $d=1$, mở `/cart`.
- **Kỳ vọng:** Bảng có 1 dòng A, số lượng 1, Thành tiền $100000₫$, Tổng cộng $100000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-REPEAT-WEB-002: Điểm biên $r = 1$ (Đã có SP A với $q=1$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-WEB-1`
- **Tầng:** WEB | **Quy tắc:** `FR07-R02`, `FR07-R08`
- **Các bước:** Giỏ đang có A ($q=1$), vào `/product/1`, thêm $d=1$, mở `/cart`.
- **Kỳ vọng:** Bảng duy trì 1 dòng duy nhất cho A, số lượng tăng lên 2, Thành tiền $200000₫$, Tổng cộng $200000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

#### FR07-BVA-REPEAT-WEB-003: Điểm biên $r = 2$ (Đã có SP A với $q=2$)
- **Mã nghĩa vụ:** `FR07-OBL-BVA-REP-WEB-2`
- **Tầng:** WEB | **Quy tắc:** `FR07-R02`, `FR07-R08`
- **Các bước:** Giỏ đang có A ($q=2$), vào `/product/1`, thêm $d=1$, mở `/cart`.
- **Kỳ vọng:** Bảng duy trì 1 dòng duy nhất cho A, số lượng tăng lên 3, Thành tiền $300000₫$, Tổng cộng $300000₫$.
- **Trạng thái:** Not Run | **Actual:** null | **Evidence:** []

---

## 5. Ma trận Ánh xạ Nghĩa vụ BVA (BVA Obligation Traceability Matrix)

| Mã nghĩa vụ BVA | Chiều & Thao tác | Giá trị kiểm thử | Mã ca kiểm thử nguồn BVA | Tầng |
|---|---|---|---|---|
| `FR07-OBL-BVA-ADDQ-NEG1` | ADD-Q | $d = -1$ | `FR07-BVA-ADDQ-001` | WEB |
| `FR07-OBL-BVA-ADDQ-0` | ADD-Q | $d = 0$ | `FR07-BVA-ADDQ-002` | WEB |
| `FR07-OBL-BVA-ADDQ-1` | ADD-Q | $d = 1$ | `FR07-BVA-ADDQ-003` | WEB |
| `FR07-OBL-BVA-ADDQ-2` | ADD-Q | $d = 2$ | `FR07-BVA-ADDQ-004` | WEB |
| `FR07-OBL-BVA-CARTN-0` | CART-N | $n = 0$ | `FR07-BVA-CARTN-001` | WEB |
| `FR07-OBL-BVA-CARTN-1` | CART-N | $n = 1$ | `FR07-BVA-CARTN-002` | WEB |
| `FR07-OBL-BVA-CARTN-2` | CART-N | $n = 2$ | `FR07-BVA-CARTN-003` | WEB |
| `FR07-OBL-BVA-REP-API-0` | REPEAT (API) | $r = 0$ | `FR07-BVA-REPEAT-API-001` | API |
| `FR07-OBL-BVA-REP-API-1` | REPEAT (API) | $r = 1$ | `FR07-BVA-REPEAT-API-002` | API |
| `FR07-OBL-BVA-REP-API-2` | REPEAT (API) | $r = 2$ | `FR07-BVA-REPEAT-API-003` | API |
| `FR07-OBL-BVA-REP-WEB-0` | REPEAT (WEB) | $r = 0$ | `FR07-BVA-REPEAT-WEB-001` | WEB |
| `FR07-OBL-BVA-REP-WEB-1` | REPEAT (WEB) | $r = 1$ | `FR07-BVA-REPEAT-WEB-002` | WEB |
| `FR07-OBL-BVA-REP-WEB-2` | REPEAT (WEB) | $r = 2$ | `FR07-BVA-REPEAT-WEB-003` | WEB |

**Tổng kết:** Có 13 ca kiểm thử nguồn BVA thuộc 4 họ, bao phủ trọn vẹn 13 nghĩa vụ giá trị biên theo phương pháp ISTQB 3-value BVA.
