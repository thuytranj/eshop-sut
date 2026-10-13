# Danh sách Ca Kiểm thử Domain Testing (Domain Test Cases) - FR-07

Tài liệu này lưu trữ toàn bộ các ca kiểm thử nguồn được dẫn xuất từ phương pháp **Domain Testing (On/Off/In Analysis)** cho chức năng **FR-07 Giỏ hàng**.
Toàn bộ các ca kiểm thử ở giai đoạn thiết kế có trạng thái ban đầu là `Not Run`, `actual = null`, `evidence = []`.

---

## 1. Danh sách Ca Kiểm thử Nguồn theo Họ (Source Case Families)

### 1.1. Họ `FR07-DT-EMPTY-*`: Trạng thái Giỏ hàng Rỗng & Chuyển đổi Trạng thái ($n=0$)

#### FR07-DT-EMPTY-001: Giỏ hàng ban đầu rỗng ($n=0$, On point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R07`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-EMPTY-ON`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Phiên làm việc mới của trình duyệt, giỏ hàng React Context rỗng ($n=0$).
- **Fixture:** Không có sản phẩm nào trong giỏ.
- **Các bước thực hiện (Steps):**
  1. Mở trang chủ `/`.
  2. Điều hướng tới trang giỏ hàng `/cart`.
  3. Quan sát giao diện giỏ hàng.
- **Kỳ vọng (Expected Result):**
  - Hiển thị hình minh họa giỏ hàng trống (thẻ `<img>` hoặc vector SVG hợp lệ).
  - Hiển thị thông báo rõ ràng cho biết giỏ hàng đang rỗng (ví dụ: "Giỏ hàng của bạn đang trống" hoặc tương đương).
  - Không hiển thị bảng danh sách sản phẩm và tổng tiền.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-EMPTY-002: Thêm 1 sản phẩm vào giỏ rỗng ($n=1$, Off point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R01`, `FR07-R07`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-EMPTY-OFF1`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng ban đầu rỗng.
- **Fixture:** Sản phẩm A (`id=1`, `price=100000₫`).
- **Các bước thực hiện (Steps):**
  1. Vào trang chi tiết sản phẩm A (`/product/1`).
  2. Nhập số lượng $d = 1$.
  3. Bấm nút "Thêm vào giỏ hàng".
  4. Điều hướng tới trang giỏ hàng `/cart`.
- **Kỳ vọng (Expected Result):**
  - Giao diện chuyển từ trạng thái giỏ trống sang trạng thái bảng giỏ hàng ($n=1$).
  - Bảng hiển thị 1 dòng của Sản phẩm A, không còn hiển thị thông báo giỏ trống.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.2. Họ `FR07-DT-MERGE-*`: Gộp Dòng khi Thêm Cùng Sản phẩm ($q' = q + d$, $\text{rows}(id) = 1$)

#### FR07-DT-MERGE-API-001: Thêm cùng sản phẩm A lần thứ 2 qua API ($(1, 1) \to 2$, On 1)
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `FR07-R02`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-MERGE-API-1`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** User có tài khoản hợp lệ, giỏ hàng trên server đang chứa Sản phẩm A với $q = 1$.
- **Fixture:** Sản phẩm A (`id=1`, `name="Sản phẩm A"`, `price=100000`).
- **Các bước thực hiện (Steps):**
  1. Gửi `POST /api/cart` với body `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 1}` kèm Bearer token.
  2. Gửi `GET /api/cart` để kiểm tra trạng thái giỏ hàng.
- **Kỳ vọng (Expected Result):**
  - Response `GET /api/cart` trả về danh sách giỏ hàng chỉ có đúng 1 phần tử (đúng 1 dòng cho Sản phẩm A).
  - Phần tử Sản phẩm A có trường `quantity = 2` ($q' = 1 + 1$).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-MERGE-API-002: Thêm cùng sản phẩm A lần thứ 2 với số lượng lớn hơn qua API ($(2, 3) \to 5$, On 2)
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `FR07-R02`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-MERGE-API-2`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** User có tài khoản hợp lệ, giỏ hàng trên server đang chứa Sản phẩm A với $q = 2$.
- **Fixture:** Sản phẩm A (`id=1`, `price=100000`).
- **Các bước thực hiện (Steps):**
  1. Gửi `POST /api/cart` với body `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 3}`.
  2. Gửi `GET /api/cart` để kiểm tra.
- **Kỳ vọng (Expected Result):**
  - Giỏ hàng duy trì đúng 1 dòng cho Sản phẩm A.
  - Số lượng gộp $q' = 2 + 3 = 5$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-MERGE-WEB-001: Thêm cùng sản phẩm A lần thứ 2 trên WEB ($(1, 1) \to 2$, On 1)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R02`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-MERGE-WEB-1`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Trình duyệt đã thêm Sản phẩm A ($q=1$) vào giỏ hàng.
- **Fixture:** Sản phẩm A (`id=1`, `price=100000₫`).
- **Các bước thực hiện (Steps):**
  1. Vào trang chi tiết Sản phẩm A (`/product/1`).
  2. Nhập số lượng $d = 1$ và bấm "Thêm vào giỏ hàng".
  3. Mở trang `/cart`.
- **Kỳ vọng (Expected Result):**
  - Bảng giỏ hàng chỉ có đúng 1 dòng cho Sản phẩm A (không tạo dòng thứ 2).
  - Cột Số lượng hiển thị 2.
  - Cột Thành tiền cập nhật thành $200000₫$ ($100000₫ \times 2$).
  - Tổng cộng là $200000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-MERGE-WEB-002: Thêm cùng sản phẩm A lần thứ 2 với số lượng $d=3$ trên WEB ($(2, 3) \to 5$, On 2)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R02`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-MERGE-WEB-2`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng đang có Sản phẩm A với $q = 2$.
- **Fixture:** Sản phẩm A (`id=1`, `price=100000₫`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $d = 3$ và bấm "Thêm vào giỏ hàng".
  3. Mở `/cart`.
- **Kỳ vọng (Expected Result):**
  - Giỏ hàng duy nhất 1 dòng Sản phẩm A.
  - Số lượng là 5.
  - Thành tiền cập nhật $500000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-MERGE-WEB-003: Thêm sản phẩm A vào giỏ có sẵn A và B ($(3, 2)$, In point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R02`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-MERGE-WEB-IN`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có sẵn Sản phẩm A ($q=3$) và Sản phẩm B ($q=1$).
- **Fixture:** A (`p=100000₫`), B (`p=250000₫`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập $d = 2$ và bấm "Thêm vào giỏ hàng".
  3. Mở `/cart`.
- **Kỳ vọng (Expected Result):**
  - Giỏ hàng giữ nguyên 2 dòng phân biệt (không thêm dòng mới cho A).
  - Dòng Sản phẩm A có số lượng cập nhật thành $5$, Thành tiền $500000₫$.
  - Dòng Sản phẩm B giữ nguyên số lượng $1$, Thành tiền $250000₫$.
  - Tổng cộng cập nhật thành $750000₫$ ($500000₫ + 250000₫$).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.3. Họ `FR07-DT-NEW-*`: Thêm Sản phẩm Khác ID ($n \to n+1$)

#### FR07-DT-NEW-API-001: Thêm 2 sản phẩm phân biệt qua API
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `FR07-R01`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-NEW-API`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng ban đầu rỗng.
- **Fixture:** Sản phẩm A (`id=1`), Sản phẩm B (`id=2`).
- **Các bước thực hiện (Steps):**
  1. Gửi `POST /api/cart` cho Sản phẩm A (`id=1`, `quantity=1`).
  2. Gửi `POST /api/cart` cho Sản phẩm B (`id=2`, `quantity=1`).
  3. Gửi `GET /api/cart`.
- **Kỳ vọng (Expected Result):**
  - Giỏ hàng chứa đúng 2 phần tử với 2 ID khác nhau (`1` và `2`).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-NEW-WEB-001: Thêm Sản phẩm B vào giỏ đã có Sản phẩm A trên WEB
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R01`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-NEW-WEB`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng đang có Sản phẩm A ($q=2$).
- **Fixture:** Sản phẩm B (`id=2`, `price=250000₫`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/2`.
  2. Nhập số lượng $d = 1$ và bấm "Thêm vào giỏ hàng".
  3. Mở `/cart`.
- **Kỳ vọng (Expected Result):**
  - Bảng giỏ hàng hiển thị đúng 2 dòng riêng biệt: dòng 1 là A ($q=2$, $200000₫$), dòng 2 là B ($q=1$, $250000₫$).
  - Tổng cộng hiển thị $450000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.4. Họ `FR07-DT-QTY-*`: Miền Giá trị Số lượng Nhập thêm (Add Quantity Domains)

#### FR07-DT-QTY-001: Thêm số lượng $d = 1$ (On point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`, `FR07-R01`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-ON`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $1$ vào ô input.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Thêm thành công sản phẩm A với số lượng chính xác là 1.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-002: Thêm số lượng $d = 0$ (Off invalid point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-OFF-0`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $0$ vào ô input.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Hệ thống từ chối thêm (báo lỗi hoặc không gửi request); giỏ hàng vẫn ở trạng thái rỗng ($n=0$).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-003: Thêm số lượng $d = 2$ (Off valid point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-OFF-2`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $2$.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Thêm thành công Sản phẩm A với số lượng $q=2$, Thành tiền $200000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-004: Thêm số lượng $d = 3$ (In point)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-IN`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $3$.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Thêm thành công Sản phẩm A với số lượng $q=3$, Thành tiền $300000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-005: Thêm số lượng âm $d = -1$ (Negative partition)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-NEG`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $-1$.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Hệ thống chặn không cho thêm; giỏ hàng giữ nguyên trạng thái rỗng ($n=0$).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-006: Thêm số lượng thập phân $d = 1.5$ (Fraction partition)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-FRAC`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Nhập số lượng $1.5$.
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Hệ thống không chấp nhận số lượng không nguyên; giỏ hàng không thêm sản phẩm với số lượng lẻ.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-QTY-007: Thêm số lượng rỗng $d = \text{""}$ (Empty string partition)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR06-Q`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-QTY-EMPTY`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng rỗng.
- **Fixture:** Sản phẩm A (`id=1`).
- **Các bước thực hiện (Steps):**
  1. Vào `/product/1`.
  2. Xóa trắng ô số lượng (chuỗi rỗng).
  3. Bấm "Thêm vào giỏ hàng".
  4. Mở `/cart`.
- **Kỳ vọng (Expected Result):** Hệ thống chặn thao tác hoặc báo lỗi nhập liệu; giỏ hàng vẫn rỗng.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.5. Họ `FR07-DT-CONTROL-*`: Điều khiển Tăng/Giảm Số lượng trên Giỏ Hàng (Buttons +/-)

#### FR07-DT-CONTROL-001: Kiểm tra sự hiện diện của nút + và nút - (Presence Check)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R03`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-CTRL-PRESENCE`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có Sản phẩm A ($q=2$).
- **Fixture:** Sản phẩm A (`id=1`, `q=2`).
- **Các bước thực hiện (Steps):**
  1. Mở trang `/cart`.
  2. Kiểm tra phần tử tại cột Số lượng của dòng Sản phẩm A.
- **Kỳ vọng (Expected Result):** Tồn tại cả nút "+" (tăng) và nút "-" (giảm) cho phép người dùng tương tác.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-CONTROL-002: Bấm nút + để tăng số lượng từ 2 lên 3
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R03`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-CTRL-PLUS`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có Sản phẩm A ($q=2$), nút "+" hiện diện.
- **Fixture:** Sản phẩm A (`id=1`, `p=100000₫`).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Bấm nút "+" tại dòng Sản phẩm A.
- **Kỳ vọng (Expected Result):**
  - Số lượng tăng từ 2 lên 3.
  - Thành tiền tăng từ $200000₫$ lên $300000₫$.
  - Tổng cộng cập nhật tương ứng.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-CONTROL-003: Bấm nút - để giảm số lượng từ 3 xuống 2
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R03`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-CTRL-MINUS`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có Sản phẩm A ($q=3$), nút "-" hiện diện.
- **Fixture:** Sản phẩm A (`id=1`, `p=100000₫`).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Bấm nút "-" tại dòng Sản phẩm A.
- **Kỳ vọng (Expected Result):**
  - Số lượng giảm từ 3 xuống 2.
  - Thành tiền giảm từ $300000₫$ xuống $200000₫$.
  - Tổng cộng cập nhật tương ứng.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.6. Họ `FR07-DT-DELETE-*`: Xóa Sản phẩm & Dialog Xác nhận (Delete & Confirm Dialog)

#### FR07-DT-DELETE-001: Kiểm tra sự hiện diện của dialog xác nhận xóa khi bấm Xóa
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R04`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DEL-DIALOG-PRESENCE`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có Sản phẩm A và Sản phẩm B.
- **Fixture:** Nominal cart A(2), B(1).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Bấm nút "Xóa" tại dòng Sản phẩm A.
- **Kỳ vọng (Expected Result):** Hiển thị dialog / modal xác nhận trước khi xóa, có các lựa chọn tiếp tục (Confirm) và hủy bỏ (Cancel).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-DELETE-002: Bấm Cancel tại dialog xác nhận xóa
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R04`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DEL-CANCEL`
- **Trạng thái Oracle:** Confirmed / Derived
- **Tiền điều kiện (Preconditions):** Dialog xác nhận xóa đang mở sau khi bấm Xóa dòng Sản phẩm A.
- **Fixture:** Nominal cart A(2), B(1).
- **Các bước thực hiện (Steps):**
  1. Bấm nút Cancel (hoặc đóng dialog).
- **Kỳ vọng (Expected Result):** Dialog đóng lại; giỏ hàng giữ nguyên vẹn 2 dòng A và B; Tổng cộng không đổi ($450000₫$).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-DELETE-003: Bấm Confirm tại dialog xác nhận xóa dòng Sản phẩm A
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R04`, `FR07-R08`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DEL-CONFIRM`
- **Trạng thái Oracle:** Confirmed / Derived
- **Tiền điều kiện (Preconditions):** Dialog xác nhận xóa đang mở cho dòng Sản phẩm A.
- **Fixture:** Nominal cart A(2), B(1).
- **Các bước thực hiện (Steps):**
  1. Bấm nút Confirm (Xác nhận) trong dialog.
- **Kỳ vọng (Expected Result):**
  - Dòng Sản phẩm A bị xóa hoàn toàn khỏi giỏ hàng.
  - Dòng Sản phẩm B vẫn được giữ nguyên ($q=1$, $250000₫$).
  - Tổng cộng tính lại chính xác thành $250000₫$.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-DELETE-004: Xóa dòng sản phẩm duy nhất còn lại trong giỏ ($n=1 \to n=0$)
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R04`, `FR07-R07`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DEL-LAST`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng chỉ còn duy nhất 1 sản phẩm (ví dụ Sản phẩm B).
- **Fixture:** Giỏ có Sản phẩm B ($q=1$).
- **Các bước thực hiện (Steps):**
  1. Bấm nút "Xóa" tại dòng Sản phẩm B.
  2. Bấm Confirm trên dialog.
- **Kỳ vọng (Expected Result):** Giỏ hàng lập tức chuyển sang trạng thái trống (Empty state), hiển thị hình minh họa và thông báo giỏ trống; bảng sản phẩm biến mất.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.7. Họ `FR07-DT-DISPLAY-*`: Giao diện Bảng, Nhãn Tổng cộng & Điều hướng (UI Display & Navigation)

#### FR07-DT-DISPLAY-001: Hiển thị đầy đủ 5 cột bắt buộc trên bảng giỏ hàng
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R01`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DISP-COLUMNS`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có sản phẩm ($n \ge 1$).
- **Fixture:** Nominal cart A(2), B(1).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Kiểm tra tiêu đề các cột của bảng.
- **Kỳ vọng (Expected Result):** Bảng có đủ 5 cột với tên tiêu đề: **Sản phẩm**, **Đơn giá**, **Số lượng**, **Thành tiền**, **Thao tác**.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-DISPLAY-002: Kiểm tra nhãn hiển thị tổng tiền chính xác là "Tổng cộng"
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R06`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DISP-LABEL`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Giỏ hàng có sản phẩm ($n \ge 1$).
- **Fixture:** Nominal cart A(2), B(1).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Tìm phần tử hiển thị nhãn của tổng số tiền thanh toán.
- **Kỳ vọng (Expected Result):** Nhãn hiển thị chính xác là chuỗi **"Tổng cộng"** (không phải "Tổng tạm tính" hay nhãn khác).
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-DISPLAY-003: Nút Tiếp tục mua sắm dẫn về trang chủ `/`
- **Tầng kiểm thử (Layer):** WEB
- **Quy tắc liên quan (Rules):** `FR07-R05`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-DISP-CONTINUE`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Người dùng đang ở trang `/cart`.
- **Fixture:** Bất kỳ trạng thái giỏ nào (rỗng hoặc có hàng).
- **Các bước thực hiện (Steps):**
  1. Mở `/cart`.
  2. Tìm nút "Tiếp tục mua sắm" và bấm vào nút.
- **Kỳ vọng (Expected Result):** Trình duyệt điều hướng thành công về trang chủ URL `/`.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

### 1.8. Họ `FR07-DT-AUTH-*`: Xác thực API Giỏ Hàng (API Authentication)

#### FR07-DT-AUTH-001: Gọi GET /api/cart với Bearer token hợp lệ
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `API-AUTH`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-AUTH-GET-VAL`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Đăng nhập lấy Bearer token hợp lệ.
- **Fixture:** User test hợp lệ.
- **Các bước thực hiện (Steps):**
  1. Gửi request `GET /api/cart` kèm header `Authorization: Bearer <valid_token>`.
- **Kỳ vọng (Expected Result):** HTTP Status 200 OK; body trả về mảng danh sách các mặt hàng trong giỏ của user đó.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-AUTH-002: Gọi GET /api/cart khi thiếu header Authorization
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `API-AUTH`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-AUTH-GET-NO`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Không gửi token.
- **Fixture:** None.
- **Các bước thực hiện (Steps):**
  1. Gửi request `GET /api/cart` không có header `Authorization`.
- **Kỳ vọng (Expected Result):** Bị từ chối truy cập (HTTP 401 hoặc 403); không rò rỉ dữ liệu giỏ hàng.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

#### FR07-DT-AUTH-003: Gọi POST /api/cart với Bearer token không hợp lệ
- **Tầng kiểm thử (Layer):** API
- **Quy tắc liên quan (Rules):** `API-AUTH`
- **Nghĩa vụ (Obligation):** `FR07-OBL-DT-AUTH-POST-INV`
- **Trạng thái Oracle:** Confirmed
- **Tiền điều kiện (Preconditions):** Token giả mạo hoặc hết hạn.
- **Fixture:** Token `"Bearer invalid_secret_token_123"`.
- **Các bước thực hiện (Steps):**
  1. Gửi request `POST /api/cart` với body thêm sản phẩm A kèm token giả mạo.
- **Kỳ vọng (Expected Result):** Bị từ chối truy cập (HTTP 401/403); giỏ hàng của bất kỳ user nào trong hệ thống đều không bị thay đổi.
- **Kết quả thực tế (Actual Result):** null
- **Trạng thái (Status):** Not Run
- **Bằng chứng (Evidence):** []

---

## 2. Ma trận Độ bao phủ Domain Testing (Domain Coverage Matrix)

| Mã nghĩa vụ (Obligation) | Tầng | Phân vùng / Điểm vị từ | Mã ca kiểm thử nguồn (Source Case IDs) |
|---|---|---|---|
| `FR07-OBL-DT-EMPTY-ON` | WEB | $n=0$ (On point) | `FR07-DT-EMPTY-001` |
| `FR07-OBL-DT-EMPTY-OFF1` | WEB | $n=1$ (Off point hợp lệ) | `FR07-DT-EMPTY-002` |
| `FR07-OBL-DT-MERGE-API-1` | API | Cùng ID $(1, 1) \to 2$ (On 1) | `FR07-DT-MERGE-API-001` |
| `FR07-OBL-DT-MERGE-API-2` | API | Cùng ID $(2, 3) \to 5$ (On 2) | `FR07-DT-MERGE-API-002` |
| `FR07-OBL-DT-MERGE-WEB-1` | WEB | Cùng ID $(1, 1) \to 2$ (On 1) | `FR07-DT-MERGE-WEB-001` |
| `FR07-OBL-DT-MERGE-WEB-2` | WEB | Cùng ID $(2, 3) \to 5$ (On 2) | `FR07-DT-MERGE-WEB-002` |
| `FR07-OBL-DT-MERGE-WEB-IN` | WEB | Cùng ID giỏ nhiều dòng $(3, 2)$ (In) | `FR07-DT-MERGE-WEB-003` |
| `FR07-OBL-DT-NEW-API` | API | Thêm khác ID ($n \to n+1$) | `FR07-DT-NEW-API-001` |
| `FR07-OBL-DT-NEW-WEB` | WEB | Thêm khác ID ($n \to n+1$) | `FR07-DT-NEW-WEB-001` |
| `FR07-OBL-DT-QTY-ON` | WEB | Số lượng thêm $d = 1$ (On point) | `FR07-DT-QTY-001` |
| `FR07-OBL-DT-QTY-OFF-0` | WEB | Số lượng thêm $d = 0$ (Off invalid) | `FR07-DT-QTY-002` |
| `FR07-OBL-DT-QTY-OFF-2` | WEB | Số lượng thêm $d = 2$ (Off valid) | `FR07-DT-QTY-003` |
| `FR07-OBL-DT-QTY-IN` | WEB | Số lượng thêm $d = 3$ (In point) | `FR07-DT-QTY-004` |
| `FR07-OBL-DT-QTY-NEG` | WEB | Số lượng thêm âm $d = -1$ | `FR07-DT-QTY-005` |
| `FR07-OBL-DT-QTY-FRAC` | WEB | Số lượng thêm lẻ $d = 1.5$ | `FR07-DT-QTY-006` |
| `FR07-OBL-DT-QTY-EMPTY` | WEB | Số lượng thêm rỗng $d = \text{""}$ | `FR07-DT-QTY-007` |
| `FR07-OBL-DT-CTRL-PRESENCE` | WEB | Hiện diện nút +/- | `FR07-DT-CONTROL-001` |
| `FR07-OBL-DT-CTRL-PLUS` | WEB | Bấm nút + ($q: 2 \to 3$) | `FR07-DT-CONTROL-002` |
| `FR07-OBL-DT-CTRL-MINUS` | WEB | Bấm nút - ($q: 3 \to 2$) | `FR07-DT-CONTROL-003` |
| `FR07-OBL-DT-DEL-DIALOG-PRESENCE` | WEB | Hiện diện dialog xác nhận xóa | `FR07-DT-DELETE-001` |
| `FR07-OBL-DT-DEL-CANCEL` | WEB | Bấm Cancel giữ nguyên giỏ | `FR07-DT-DELETE-002` |
| `FR07-OBL-DT-DEL-CONFIRM` | WEB | Bấm Confirm xóa dòng đích | `FR07-DT-DELETE-003` |
| `FR07-OBL-DT-DEL-LAST` | WEB | Xóa dòng cuối chuyển về empty | `FR07-DT-DELETE-004` |
| `FR07-OBL-DT-DISP-COLUMNS` | WEB | Bảng hiển thị đủ 5 cột | `FR07-DT-DISPLAY-001` |
| `FR07-OBL-DT-DISP-LABEL` | WEB | Nhãn hiển thị là "Tổng cộng" | `FR07-DT-DISPLAY-002` |
| `FR07-OBL-DT-DISP-CONTINUE` | WEB | Nút Tiếp tục mua sắm về `/` | `FR07-DT-DISPLAY-003` |
| `FR07-OBL-DT-AUTH-GET-VAL` | API | GET cart kèm token hợp lệ | `FR07-DT-AUTH-001` |
| `FR07-OBL-DT-AUTH-GET-NO` | API | GET cart thiếu token | `FR07-DT-AUTH-002` |
| `FR07-OBL-DT-AUTH-POST-INV` | API | POST cart với token sai | `FR07-DT-AUTH-003` |

**Tổng kết:** Có 29 ca kiểm thử nguồn Domain Testing thuộc 8 họ ca kiểm thử, bao phủ đầy đủ 29 nghĩa vụ kiểm thử của phương pháp Domain Testing.
