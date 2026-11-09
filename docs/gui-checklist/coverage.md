# Báo cáo Ma trận Bao phủ Đặc tả GUI (Coverage Matrix)

Tài liệu này trình bày ma trận ánh xạ truy vết hai chiều giữa các yêu cầu nguyên tử (Requirements Inventory), các khía cạnh giao diện (IA-01 đến IA-04), 4 màn hình chức năng và 70 mục kiểm tra GUI chi tiết (gồm 64 mục AI ban đầu và 6 mục do sinh viên/Human Review bổ sung sau phản biện QA).

---

## 1. Thống kê Tổng quan Độ bao phủ

- **Tổng số mục kiểm tra GUI hiện tại**: **70 mục** (vượt xa ngưỡng tối thiểu 41/45 mục của bài tập).
  - Mục AI tạo (`origin=AI`): **64 mục**
  - Mục Human Review bổ sung (`origin=Human`): **6 mục** (GUI-065 đến GUI-070)
- **Phân bổ theo 4 khía cạnh giao diện (IA)**:
  - `IA-01`: 18 mục (25.7%)
  - `IA-02`: 18 mục (25.7%)
  - `IA-03`: 16 mục (22.9%)
  - `IA-04`: 18 mục (25.7%)
- **Phân bổ theo 4 màn hình chức năng**:
  - `FR-03` (FR-03 Quên/đặt lại mật khẩu (đủ 2 bước)): 15 mục
  - `FR-05` (FR-05 Danh sách & Tìm kiếm sản phẩm): 19 mục
  - `FR-07` (FR-07 Chi tiết giỏ hàng): 18 mục
  - `FR-15` (FR-15 Quản trị viên quản lý sản phẩm CRUD): 18 mục

- **Tổng số yêu cầu nguyên tử trong kho lưu trữ**: 83 yêu cầu.
  - Yêu cầu áp dụng trong phạm vi: 67 yêu cầu.
  - Yêu cầu ngoài phạm vi 4 màn hình (Non-applicable có lý do): 16 yêu cầu.
  - Yêu cầu áp dụng được bao phủ bởi Checklist: 67 / 67 (100% độ bao phủ).
  - Yêu cầu áp dụng chưa được bao phủ: 0 yêu cầu.

---

## 2. Bảng Phân bổ Ma trận Màn hình × Khía cạnh (Screens × IA Matrix)

| Màn hình chức năng | IA-01 | IA-02 | IA-03 | IA-04 | AI Items | Human Items | Tổng số mục |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **FR-03** (FR-03 Quên/đặt lại mật khẩu) | 3 | 5 | 4 | 3 | 15 | 0 | **15** |
| **FR-05** (FR-05 Danh sách & Tìm kiếm sản phẩm) | 6 | 3 | 4 | 6 | 16 | 3 | **19** |
| **FR-07** (FR-07 Chi tiết giỏ hàng) | 6 | 4 | 4 | 4 | 15 | 3 | **18** |
| **FR-15** (FR-15 Quản trị viên quản lý sản phẩm CRUD) | 3 | 6 | 4 | 5 | 18 | 0 | **18** |
| **Tổng cộng** | **18** | **18** | **16** | **18** | **64** | **6** | **70** |

---

## 3. Ma trận Truy vết Chi tiết (Traceability Matrix: Requirement $\rightarrow$ Checklist Items)

| Mã yêu cầu | IA | Nội dung yêu cầu | Nguồn đặc tả | Màn hình áp dụng | Danh sách Item ID bao phủ |
|---|:---:|---|---|:---:|---|
| `FR21-LANG` | IA-01 | Toàn bộ giao diện sử dụng tiếng Việt nhất quán (trừ thuật ngữ kỹ thuật chuẩn) | README.md:244 (FR-21) | FR-03, FR-15 | `GUI-001`, `GUI-047` |
| `FR21-COLOR-POS` | IA-01 | Nút hành động tích cực (Gửi, Tìm kiếm, Thêm giỏ, Lưu) sử dụng màu xanh dương | README.md:245 (FR-21) | FR-03, FR-15 | `GUI-002`, `GUI-049` |
| `FR21-COLOR-DANGER` | IA-01 | Nút hành động nguy hiểm/hủy bỏ (Xóa, Hủy) sử dụng màu đỏ | README.md:246 (FR-21) | FR-03, FR-15 | `GUI-002`, `GUI-049` |
| `FR21-CURRENCY` | IA-01 | Định dạng tiền tệ nhất quán: luôn dùng ký hiệu ₫ với định dạng phân cách hàng nghìn | README.md:247 (FR-21) | FR-05, FR-07 | `GUI-018`, `GUI-034` |
| `FR21-H1` | IA-01 | Mỗi trang web có đúng một thẻ <h1> mô tả chính xác nội dung trang | README.md:248, 80-81 (FR-21, FR-05) | FR-03, FR-05, FR-15 | `GUI-003`, `GUI-019`, `GUI-048` |
| `FR05-GRID` | IA-01 | Trang danh sách sản phẩm hiển thị theo bố cục dạng lưới (grid) cân đối | README.md:75 (FR-05) | FR-05 | `GUI-016` |
| `FR05-ITEM-INFO` | IA-01 | Mỗi sản phẩm hiển thị đủ: Ảnh tỷ lệ chuẩn, Tên sản phẩm, Giá (đơn vị ₫, phân cách nghìn) | README.md:76 (FR-05) | FR-05 | `GUI-017` |
| `FR05-SEARCH-SEC` | IA-01 | Từ khóa tìm kiếm được hiển thị an toàn dưới dạng văn bản (không render HTML, chống XSS) | README.md:77, 281 (FR-05, SEC-04) | FR-05 | `GUI-021` |
| `FR07-COLS` | IA-01 | Bảng giỏ hàng hiển thị danh sách sản phẩm với đủ 5 cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác | README.md:95 (FR-07) | FR-07 | `GUI-032` |
| `FR07-TOTAL-LABEL` | IA-01 | Tổng tiền hiển thị nhãn chính xác: "Tổng cộng" (không phải "Tổng tạm tính") | README.md:99 (FR-07) | FR-07 | `GUI-033` |
| `FR15-CRUD-VIEW` | IA-01 | Admin xem danh sách sản phẩm dạng bảng với các cột thông tin bằng tiếng Việt rõ ràng | README.md:193 (FR-15) | FR-15 | `GUI-047` |
| `USR-UI-TYPO` | IA-01 | Typography tiếng Việt chuẩn Unicode, không lỗi font, không mất dấu, không cụt chữ trên các nhãn điều khiển | Tiêu chí người dùng / Plan | FR-03, FR-05 | `GUI-001`, `GUI-017` |
| `USR-UI-ALIGN` | IA-01 | Căn lề số tiền và số lượng về bên phải trong bảng/thẻ để dễ so sánh, căn trái cho văn bản | Tiêu chí người dùng / Plan | FR-05, FR-07 | `GUI-018`, `GUI-034` |
| `USR-RESP-VIEWPORT` | IA-01 | Giao diện đáp ứng (responsive) tại các viewport (360×800, 768×1024, 1440×900), không tràn lề vỡ layout | Tiêu chí người dùng / Plan | FR-05, FR-07 | `GUI-016`, `GUI-035` |
| `USR-CONTRAST` | IA-01 | Độ tương phản màu sắc đạt ngưỡng tối thiểu WCAG AA (≥4.5:1 chữ thường, ≥3:1 chữ lớn) | Tiêu chí người dùng / W3C Contrast | FR-05 | `GUI-020` |
| `FR22-REQ` | IA-02 | Tất cả các trường bắt buộc phải có ký hiệu * bên cạnh nhãn | README.md:252 (FR-22) | FR-03, FR-15 | `GUI-004`, `GUI-050` |
| `FR22-EMAIL` | IA-02 | Trường Email phải sử dụng thuộc tính HTML5 type="email" (có validate format) | README.md:44, 253 (FR-02, FR-22) | FR-03 | `GUI-004` |
| `FR22-PWD` | IA-02 | Trường Mật khẩu phải sử dụng type="password" (không hiển thị rõ) | README.md:254 (FR-22) | FR-03 | `GUI-006` |
| `FR22-ERR-POS` | IA-02 | Thông báo lỗi validation phải xuất hiện phía trên nút submit, không phải bên dưới | README.md:255 (FR-22) | FR-03, FR-15 | `GUI-007`, `GUI-055` |
| `FR22-STEP` | IA-02 | Các form có từ 2 bước trở lên phải có chỉ báo bước (Step Indicator) rõ ràng | README.md:52, 256 (FR-03, FR-22) | FR-03 | `GUI-005` |
| `FR03-EMAIL-INPUT` | IA-02 | Bước 1 Quên mật khẩu: Người dùng nhập địa chỉ Email đã đăng ký để xin cấp OTP | README.md:50 (FR-03) | FR-03 | `GUI-004` |
| `FR03-RESET-INPUTS` | IA-02 | Bước 2 Đặt lại mật khẩu: Người dùng nhập OTP, Mật khẩu mới, và Xác nhận mật khẩu mới | README.md:57 (FR-03) | FR-03 | `GUI-006`, `GUI-008` |
| `FR03-PWD-RULES` | IA-02 | Mật khẩu mới phải tuân thủ chuẩn mạnh (tối thiểu 8 ký tự, có ít nhất 1 hoa, 1 thường, 1 số, 1 ký tự @$!%*?&) | README.md:34, 58 (FR-01, FR-03) | FR-03 | `GUI-007` |
| `FR03-PWD-CONFIRM` | IA-02 | Hai trường mật khẩu mới và xác nhận mật khẩu mới phải khớp nhau | README.md:35, 59 (FR-01, FR-03) | FR-03 | `GUI-007` |
| `FR05-SEARCH-NAME` | IA-02 | Thanh tìm kiếm tiếp nhận từ khóa và thực hiện lọc theo tên sản phẩm | README.md:77 (FR-05) | FR-05 | `GUI-022` |
| `FR07-QTY-CTRL` | IA-02 | Cột số lượng trong bảng giỏ hàng có nút +/- để điều chỉnh số lượng | README.md:95 (FR-07) | FR-07 | `GUI-036` |
| `FR15-CRUD-OPS` | IA-02 | Admin có thể thực hiện Thêm và Sửa sản phẩm thông qua biểu mẫu nhập liệu | README.md:193 (FR-15) | FR-15 | `GUI-054` |
| `FR15-NAME-REQ` | IA-02 | Tên sản phẩm: bắt buộc nhập, tối đa 255 ký tự | README.md:195 (FR-15) | FR-15 | `GUI-051` |
| `FR15-PRICE-REQ` | IA-02 | Giá sản phẩm: bắt buộc nhập, phải là số dương (> 0) | README.md:196 (FR-15) | FR-15 | `GUI-052` |
| `FR15-CAT-REQ` | IA-02 | Danh mục sản phẩm: bắt buộc nhập, phải chọn từ danh sách dropdown có sẵn | README.md:197 (FR-15) | FR-15 | `GUI-053` |
| `USR-QTY-VALID` | IA-02 | Số lượng giỏ hàng chỉ nhận số nguyên dương ≥1; từ chối hoặc chặn rỗng, 0, âm, thập phân, chữ | Tiêu chí người dùng / Plan / FR-06 | FR-07 | `GUI-037`, `GUI-038`, `GUI-068` |
| `USR-SEARCH-RESET` | IA-02 | Khả năng xóa/reset từ khóa tìm kiếm để quay về danh sách sản phẩm đầy đủ ban đầu | Tiêu chí người dùng / Plan | FR-05 | `GUI-023` |
| `USR-ADMIN-FORM-LOAD` | IA-02 | Form Sửa sản phẩm tự động nạp chính xác các trường dữ liệu hiện tại của sản phẩm được chọn | Tiêu chí người dùng / Plan | FR-15 | `GUI-054` |
| `FR21-TABORDER` | IA-03 | Thứ tự focus bàn phím (Tab order) đi tuần tự hợp lý từ trên xuống dưới, trái sang phải | README.md:249 (FR-21; map IA-03) | FR-03, FR-05, FR-07, FR-15 | `GUI-010`, `GUI-011`, `GUI-027`, `GUI-042`, `GUI-059` |
| `FR23-NAV-ACT` | IA-03 | Thanh điều hướng (Navbar) phải highlight trang/mục đang được chọn | README.md:260 (FR-23) | FR-05, FR-07 | `GUI-024`, `GUI-039` |
| `FR23-CART-BADGE` | IA-03 | Liên kết "Giỏ hàng" trên Navbar phải hiển thị badge số lượng sản phẩm trong giỏ | README.md:261 (FR-23) | FR-05 | `GUI-025` |
| `FR23-LOGOUT` | IA-03 | Nút Đăng xuất phải có nhãn chính xác là "Đăng xuất" (không phải "Thoát") | README.md:262 (FR-23) | FR-15 | `GUI-057` |
| `FR23-BREADCRUMB` | IA-03 | Breadcrumb bắt buộc có ở các trang con (Giỏ hàng, Thanh toán, Chi tiết sản phẩm) | README.md:263 (FR-23) | FR-07 | `GUI-040` |
| `FR03-BACK-LOGIN` | IA-03 | Giao diện Quên mật khẩu có nút "Quay lại đăng nhập" để điều hướng về trang /login | README.md:53 (FR-03) | FR-03 | `GUI-009` |
| `FR07-CONTINUE` | IA-03 | Trang giỏ hàng có nút "Tiếp tục mua sắm" để quay về trang chủ sản phẩm (/) | README.md:98 (FR-07) | FR-07 | `GUI-041` |
| `USR-KBD-NAV` | IA-03 | Hỗ trợ điều hướng bàn phím đầy đủ (Enter/Space kích hoạt nút/link, Escape đóng modal) | Tiêu chí người dùng / W3C APG | FR-03, FR-05, FR-07, FR-15 | `GUI-012`, `GUI-027`, `GUI-042`, `GUI-059` |
| `USR-NAV-PROD-DETAIL` | IA-03 | Nhấp chuột vào ảnh hoặc tên sản phẩm trên danh sách điều hướng sang trang Chi tiết sản phẩm | Tiêu chí người dùng / FR-06 | FR-05 | `GUI-026` |
| `USR-ADMIN-ACTIVE-TAB` | IA-03 | Giao diện Admin làm nổi bật tab Quản lý sản phẩm đang được chọn trong menu điều hướng | Tiêu chí người dùng / Plan | FR-15 | `GUI-056` |
| `USR-ADMIN-CANCEL` | IA-03 | Nút Hủy/Đóng trong form Thêm/Sửa sản phẩm hủy bỏ thao tác và quay về danh sách an toàn | Tiêu chí người dùng / Plan | FR-15 | `GUI-058` |
| `FR24-ADD-FEEDBACK` | IA-04 | Sau khi bấm "Thêm vào giỏ", phải có phản hồi trực quan (toast notification hoặc cập nhật badge) | README.md:87, 267 (FR-06, FR-24) | FR-05 | `GUI-031` |
| `FR24-DEL-CONFIRM` | IA-04 | Khi xóa item khỏi giỏ hàng phải có dialog xác nhận trước khi thực hiện | README.md:97, 268 (FR-07, FR-24) | FR-07 | `GUI-044`, `GUI-045` |
| `FR24-EMPTY` | IA-04 | Trang trống (Empty State) phải có icon/hình minh họa và message thân thiện | README.md:269 (FR-24) | FR-05, FR-07 | `GUI-029`, `GUI-046` |
| `FR24-ALT` | IA-04 | Tất cả ảnh sản phẩm phải có thuộc tính alt mô tả nội dung ảnh (không để rỗng) | README.md:76, 270 (FR-05, FR-24) | FR-05, FR-15 | `GUI-030`, `GUI-064` |
| `FR03-OTP-GEN` | IA-04 | Bước 1: Hệ thống sinh mã OTP 6 chữ số ngẫu nhiên (chế độ demo: hiển thị trực tiếp trên màn hình) | README.md:51 (FR-03) | FR-03 | `GUI-013` |
| `FR03-OTP-BIND` | IA-04 | Bước 2: OTP chỉ hợp lệ cho email đã yêu cầu, không thể dùng cho email khác | README.md:60 (FR-03) | FR-03 | `GUI-014` |
| `FR05-LOADING` | IA-04 | Khi đang tải dữ liệu danh sách sản phẩm phải hiển thị trạng thái loading rõ ràng | README.md:78 (FR-05) | FR-05 | `GUI-028` |
| `FR05-EMPTY` | IA-04 | Khi không có kết quả tìm kiếm phải hiển thị thông báo empty state phù hợp | README.md:79 (FR-05) | FR-05 | `GUI-029` |
| `FR07-ACCUMULATE` | IA-04 | Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới trong bảng | README.md:96 (FR-07) | FR-07 | `GUI-043` |
| `FR07-EMPTY` | IA-04 | Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng | README.md:100 (FR-07) | FR-07 | `GUI-046` |
| `FR15-ISOLATE` | IA-04 | Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên | README.md:198 (FR-15) | FR-15 | `GUI-060` |
| `USR-STATE-TOAST` | IA-04 | Phản hồi thêm giỏ hàng hiển thị dạng thông báo toast nổi bật theo tiêu chí bổ sung | Tiêu chí người dùng / Plan | FR-05 | `GUI-031` |
| `USR-STATE-SKELETON` | IA-04 | Trạng thái loading sử dụng hiệu ứng skeleton loader mô phỏng khung lưới sản phẩm khi tải | Tiêu chí người dùng / Plan | FR-05 | `GUI-028` |
| `USR-DELETE-ADMIN` | IA-04 | Thao tác Xóa sản phẩm phía Admin hiển thị modal xác nhận xóa trước khi thực hiện | Tiêu chí người dùng / Plan | FR-15 | `GUI-061`, `GUI-062` |
| `USR-FEEDBACK-CRUD` | IA-04 | Hiển thị thông báo phản hồi trực quan khi Thêm/Sửa/Xóa sản phẩm Admin thành công hoặc thất bại | Tiêu chí người dùng / Plan | FR-15 | `GUI-063` |
| `USR-FEEDBACK-RESET` | IA-04 | Hiển thị thông báo phản hồi rõ ràng khi đặt lại mật khẩu thành công hoặc thất bại | Tiêu chí người dùng / Plan | FR-03 | `GUI-015` |
| `FR03-STEP-IND` | IA-02 | Giao diện Quên mật khẩu phải hiển thị chỉ báo bước (Step Indicator) — ví dụ 'Bước 1 / 2' | README.md:52 (FR-03) | FR-03 | `GUI-005` |
| `FR07-DEL-CONFIRM` | IA-04 | Nút Xóa sản phẩm khỏi giỏ hàng phải có dialog xác nhận trước khi thực hiện | README.md:97 (FR-07) | FR-07 | `GUI-044`, `GUI-045` |
| `USR-IME-VIET` | IA-02 | Hỗ trợ tương thích đầy đủ bộ gõ tiếng Việt (Telex/VNI), không lỗi dấu khi React re-render | Human Review / Phản biện QA | FR-05 | `GUI-065` |
| `USR-A11Y-SR` | IA-01 | Các nút icon không có nhãn chữ phải có thuộc tính aria-label đầy đủ cho Screen Reader | Human Review / WCAG 2.2 | FR-07 | `GUI-066` |
| `USR-STATE-NET-ERR` | IA-04 | Giao diện hiển thị thông báo lỗi mạng thân thiện và nút Thử lại khi kết nối máy chủ thất bại | Human Review / Phản biện QA | FR-05 | `GUI-067` |
| `USR-TOUCH-TARGET` | IA-01 | Các phần tử tương tác cảm ứng trên thiết bị di động có kích thước vùng chạm tối thiểu 44x44px | Human Review / WCAG 2.2 | FR-07 | `GUI-069` |
| `USR-STATE-DEBOUNCE` | IA-04 | Nút hành động có cơ chế debounce/disable chống click spamming khi có độ trễ mạng | Human Review / Phản biện QA | FR-05 | `GUI-070` |

---

## 4. Danh mục Yêu cầu Ngoài Phạm vi (Non-applicable Requirements)

| Mã yêu cầu | Nhóm IA tạm | Nội dung điều khoản | Nguồn đặc tả | Lý do không áp dụng trong checklist này |
|---|:---:|---|---|---|
| `FR-01` | IA-02 | Đăng ký tài khoản (họ tên, email, mật khẩu mạnh, xác nhận mật khẩu) | README.md:30-37 | Màn hình Đăng ký ngoài phạm vi 4 màn hình được chọn (FR-03, FR-05, FR-07, FR-15) |
| `FR-02` | IA-02 | Đăng nhập & Khóa tài khoản sau 3 lần sai | README.md:38-45 | Màn hình Đăng nhập ngoài phạm vi 4 màn hình được chọn; chỉ là điểm đến điều hướng từ FR-03 |
| `FR-04` | IA-02 | Quản lý hồ sơ cá nhân (Họ tên, SĐT, Địa chỉ) | README.md:62-68 | Màn hình Hồ sơ cá nhân ngoài phạm vi 4 màn hình được chọn |
| `FR-06` | IA-01 | Xem chi tiết sản phẩm đầy đủ | README.md:83-88 | Chi tiết sản phẩm chỉ là điểm đến hỗ trợ kiểm tra điều hướng từ FR-05, không phải màn hình chính trong scope |
| `FR-08` | IA-02 | Thanh toán (Checkout) và đặt hàng | README.md:102-109 | Màn hình Checkout ngoài phạm vi 4 màn hình được chọn |
| `FR-09` | IA-02 | Mã giảm giá (Coupon) tại bước Checkout | README.md:110-136 | Tính năng mã giảm giá thuộc luồng Checkout, ngoài phạm vi 4 màn hình được chọn |
| `FR-10` | IA-04 | State machine trạng thái đơn hàng | README.md:141-163 | Quy trình xử lý đơn hàng backend/admin ngoài phạm vi 4 màn hình được chọn |
| `FR-11` | IA-01 | Xem lịch sử đơn hàng của người dùng | README.md:164-169 | Màn hình Lịch sử đơn hàng ngoài phạm vi 4 màn hình được chọn |
| `FR-12` | IA-03 | Kiểm soát truy cập phân hệ Web Admin bằng role admin | README.md:174-180 | Cơ chế xác thực phân quyền API/Route ngoài phạm vi kiểm thử GUI 4 màn hình |
| `FR-13` | IA-01 | Dashboard quản trị (tổng doanh thu, tổng đơn hàng) | README.md:181-185 | Màn hình Dashboard ngoài phạm vi 4 màn hình được chọn |
| `FR-14` | IA-02 | Quản lý Danh mục (Category CRUD) | README.md:186-190 | Màn hình Quản lý danh mục ngoài phạm vi 4 màn hình được chọn |
| `FR-16` | IA-02 | Import sản phẩm từ CSV cho Admin | README.md:200-212 | Tính năng Import CSV được loại trừ khỏi phạm vi FR-15 theo quy định cụ thể của plan |
| `FR-17` | IA-02 | Quản lý Mã Giảm Giá Admin (Coupon CRUD) | README.md:213-217 | Màn hình Quản lý coupon ngoài phạm vi 4 màn hình được chọn |
| `FR-18` | IA-01 | Quản lý Đơn hàng phía Admin | README.md:218-223 | Màn hình Quản lý đơn hàng ngoài phạm vi 4 màn hình được chọn |
| `FR-19` | IA-01 | Quản lý Người dùng phía Admin | README.md:224-228 | Màn hình Quản lý người dùng ngoài phạm vi 4 màn hình được chọn |
| `FR-20` | IA-01 | Tính năng Mobile App React Native | README.md:233-238 | Phân hệ Mobile App ngoài phạm vi kiểm thử Web Frontend và Web Admin của nhiệm vụ này |

---

## 5. Bằng chứng Thực thi Công cụ Kiểm định Cấu trúc

### Kết quả thực thi `validate_checklist.py`

Lệnh thực thi:
```bash
python3 .agents/skills/hw03-gui-checklist/scripts/validate_checklist.py docs/gui-checklist/checklist.csv docs/gui-checklist/requirements.csv
```

Kết quả đầu ra thực tế:
```json
{
  "items": 70,
  "aspect_counts": {
    "IA-01": 18,
    "IA-02": 18,
    "IA-03": 16,
    "IA-04": 18
  },
  "errors": [],
  "semantic_review_required": true
}
```

- **Mã thoát (Exit code)**: `0` (Thành công, không có lỗi cấu trúc, bao phủ đầy đủ tất cả các yêu cầu).
