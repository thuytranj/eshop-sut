# EShop GUI Checklist — Ngữ cảnh Thiết kế & Đặc tả Kiểm thử

Tài liệu này ghi lại toàn bộ căn cứ đặc tả, định danh tài liệu, giới hạn nguồn, môi trường mục tiêu, dữ liệu thử nghiệm và ma trận kiểm tra giá trị biên cho bộ kiểm thử giao diện đồ họa (GUI Checklist) của hệ thống EShop SUT.

---

## 1. Định danh Tài liệu, Môi trường & Nguồn tham chiếu

- **Model thiết kế**: Gemini 3.8 Flash (Medium)
- **Múi giờ làm việc**: `Asia/Ho_Chi_Minh` (UTC+07:00)
- **Thời gian lập hồ sơ**: 2026-11-08T21:50:00+07:00
- **Tài liệu nguồn và mã băm SHA-256**:
  - `README.md` (Phiên bản 2.0 — Cập nhật: 2026-05-14): `e44deb191261c190919ffb680db8f19c5f10b9cea5ed2c6c2d0f499806099720`
  - `docs/2026.HW03.GUI Usability_En.pdf` (HW03 Assignment Specification): `b7f86463510bf2d3060f7216ca776fd0762c7c902321527d903562ed97b23578`
  - `docs/superpowers/plans/2026-11-08-gemini-eshop-gui-checklist.md`: `d72993df02537148e0823418068365430ecdbb5f901efc10fe4e56e716110c1c`
  - Skill bài tập: `.agents/skills/hw03-ai-audit/SKILL.md` và `.agents/skills/hw03-gui-checklist/SKILL.md`

---

## 2. Phạm vi Màn hình & Thứ tự Thực hiện Bắt buộc

Quy trình thiết kế và tài liệu hóa được tổ chức nghiêm ngặt theo đúng 4 màn hình chức năng cốt lõi theo thứ tự tuần tự:

| STT | Màn hình | Route / URL Điểm vào | Thành phần SUT | Phạm vi kiểm tra chính |
|:---:|---|---|---|---|
| 1 | **FR-03** | `http://localhost:5173/forgot-password` | Frontend Web | Quên mật khẩu & Đặt lại mật khẩu (đầy đủ cả Bước 1 và Bước 2) |
| 2 | **FR-05** | `http://localhost:5173/` | Frontend Web | Trang chủ: Xem danh sách sản phẩm dạng lưới & Tìm kiếm theo tên |
| 3 | **FR-07** | `http://localhost:5173/cart` | Frontend Web | Chi tiết giỏ hàng, bảng 5 cột, +/- số lượng, xác nhận xóa, tổng cộng |
| 4 | **FR-15** | `http://localhost:5174/` (tab `activeTab="products"`) | Web Admin | Quản trị viên quản lý sản phẩm CRUD (Thêm, Sửa, Xóa, danh sách) |

*Ghi chú kỹ thuật về điểm vào:*
- Phân hệ Web Admin không sử dụng routing riêng như `/products`, mà sử dụng biến trạng thái tab nội bộ (`activeTab`).
- Các trang hỗ trợ như `/login` (Đăng nhập) và `/product/:id` (Chi tiết sản phẩm) chỉ là điểm đến để xác minh điều hướng từ FR-03 và FR-05, không mở rộng thành màn hình chính.

---

## 3. Khác biệt Nguồn, Giới hạn và Quyết định Thiết kế (Oracle Phân lập)

Nhằm đảm bảo tính chính xác và không đoán mò kết quả thực tế từ mã nguồn (không dùng code làm oracle):

1. **Ký hiệu tiền tệ và dấu nhóm nghìn**:
   - *README FR-21*: "Luôn dùng ký hiệu ₫ với định dạng phân cách hàng nghìn".
   - *Giới hạn*: README không ấn định cụ thể dấu chấm `.` hay dấu phẩy `,`. Phép kiểm định chấp nhận cả định dạng `125.000 ₫` hoặc `125,000 ₫` miễn là nhóm đúng 3 chữ số hàng nghìn và hiển thị ký hiệu `₫` nhất quán.
2. **Quy chuẩn màu sắc hành động**:
   - *README FR-21*: Nút tích cực (Submit, Mua hàng) màu xanh dương; nút nguy hiểm/hủy bỏ màu đỏ.
   - *Giới hạn*: README không ấn định mã HEX cụ thể. Phép kiểm định kiểm tra cảm quan thị giác và dải màu xanh/đỏ chuẩn (blue/indigo và red/rose).
3. **Phản hồi thêm giỏ hàng (Toast vs Badge)**:
   - *README FR-24*: Chấp nhận "toast notification hoặc badge cập nhật".
   - *Tiêu chí bổ sung của người dùng (`USR-STATE-TOAST`)*: Yêu cầu thông báo toast nổi bật. Thiết kế tách thành hai tiêu chí độc lập: cập nhật badge giỏ hàng và hiển thị toast.
4. **Trạng thái Loading và Skeleton**:
   - *README FR-05*: Bắt buộc hiển thị trạng thái loading khi tải dữ liệu.
   - *Tiêu chí bổ sung của người dùng (`USR-STATE-SKELETON`)*: Yêu cầu hiệu ứng skeleton loader mô phỏng lưới thẻ sản phẩm.
5. **Modal xác nhận xóa sản phẩm phía Admin**:
   - *README FR-07/FR-24*: Bắt buộc dialog xác nhận khi xóa item khỏi giỏ hàng.
   - *README FR-15*: Không nhắc đến dialog khi Admin xóa sản phẩm.
   - *Tiêu chí bổ sung của người dùng (`USR-DELETE-ADMIN`)*: Bắt buộc modal xác nhận trước khi xóa sản phẩm Admin kèm bẫy focus bàn phím (Escape để đóng, Hủy để giữ nguyên).
6. **Ràng buộc số lượng giỏ hàng**:
   - *README FR-07*: Cột Số lượng có nút `+/-` để chỉnh.
   - *Tiêu chí bổ sung của người dùng (`USR-QTY-VALID`)*: Áp dụng ràng buộc số nguyên dương ≥ 1 từ FR-06; từ chối hoặc chặn các giá trị rỗng, `0`, âm, thập phân, chữ cái.
7. **Phạm vi Breadcrumb**:
   - *README FR-23*: Breadcrumb bắt buộc tại các trang con: Giỏ hàng, Thanh toán, Chi tiết sản phẩm. Không tự ý ép buộc breadcrumb trên Trang chủ (FR-05) hay Quên mật khẩu (FR-03).
8. **Tài liệu bài giảng môn học**:
   - *PDF HW03 (trang 4)*: Yêu cầu tham khảo slide bài giảng về GUI checklist. Do slide môn học không lưu trữ trong repository, nhóm thiết kế ghi nhận thiếu tài liệu nội bộ này và căn cứ theo README 2.0, PDF HW03 cùng các tiêu chuẩn quốc tế công khai (W3C WCAG 2.2, W3C ARIA APG).

---

## 4. Dữ liệu Thử nghiệm Thiết kế (Test Fixture)

Dữ liệu đề xuất phục vụ kiểm thử (cần tạo hoặc xác nhận trong môi trường kiểm thử SUT):

- **Tài khoản kiểm thử**:
  - User test: `test@eshop.com` / `Test1234!` (đã kích hoạt tài khoản để thử nghiệm FR-03).
  - Admin test: `admin@eshop.com` / `Admin123!` (để truy cập phân hệ Web Admin `http://localhost:5174/`).
- **Sản phẩm mẫu thiết kế**:
  - Sản phẩm A: "Áo Thun Cotton Nam", Đơn giá: `125.000 ₫`, Danh mục: "Thời trang nam", Ảnh có mô tả hợp lệ.
  - Sản phẩm B: "Quần Jeans Slim Fit", Đơn giá: `250.000 ₫`, Danh mục: "Thời trang nam".
  - Dữ liệu giỏ hàng chuẩn: 2 sản phẩm A (`250.000 ₫`) + 1 sản phẩm B (`250.000 ₫`) $\rightarrow$ "Tổng cộng": `500.000 ₫`. Khi tăng thêm 1 sản phẩm A $\rightarrow$ "Tổng cộng": `625.000 ₫`.
  - Tên sản phẩm biên dài 255 ký tự: Chuỗi 255 ký tự chữ tiếng Việt và ASCII chuẩn.

---

## 5. Ma trận Kiểm tra Dữ liệu Biên & Oracle Phân lập

| Trường kiểm tra | Màn hình | Dữ liệu thử nghiệm biên | Oracle & Kết quả mong đợi | Phân loại nguồn |
|---|:---:|---|---|---|
| **Email bước 1** | FR-03 | Rỗng `""` | Báo lỗi trường bắt buộc, không gửi yêu cầu | README FR-22 |
| **Email bước 1** | FR-03 | Không đúng định dạng `abc` | HTML5 validation hoặc thông báo lỗi email không hợp lệ | README FR-02/FR-22 |
| **Email bước 1** | FR-03 | `test@eshop.com` | Cấp mã OTP demo hiển thị trực quan, cho phép sang bước 2 | README FR-03 |
| **Mã OTP** | FR-03 | 5 chữ số (`12345`) | Bị chặn hoặc báo lỗi mã OTP phải đủ 6 chữ số | README FR-03 |
| **Mã OTP** | FR-03 | 7 chữ số (`1234567`) | Bị chặn nhập vượt quá 6 ký tự hoặc báo lỗi | README FR-03 |
| **Mã OTP** | FR-03 | Ký tự chữ (`abcdef`) | Bị chặn không cho nhập chữ hoặc báo lỗi định dạng số | README FR-03 |
| **Mã OTP** | FR-03 | OTP của User A nhập cho User B | Hệ thống từ chối xác thực, báo lỗi OTP không khớp với email | README FR-03 |
| **Mật khẩu mới** | FR-03 | `Abcde1!` (7 ký tự) | Báo lỗi: Mật khẩu tối thiểu 8 ký tự | README FR-01/FR-03 |
| **Mật khẩu mới** | FR-03 | `abcdef1!` (thiếu hoa) | Báo lỗi: Mật khẩu thiếu chữ hoa | README FR-01/FR-03 |
| **Mật khẩu mới** | FR-03 | `ABCDEF1!` (thiếu thường) | Báo lỗi: Mật khẩu thiếu chữ thường | README FR-01/FR-03 |
| **Mật khẩu mới** | FR-03 | `Abcdefg!` (thiếu số) | Báo lỗi: Mật khẩu thiếu chữ số | README FR-01/FR-03 |
| **Mật khẩu mới** | FR-03 | `Abcdef12` (thiếu ký tự đặc biệt) | Báo lỗi: Mật khẩu thiếu ký tự đặc biệt (`@$!%*?&`) | README FR-01/FR-03 |
| **Mật khẩu mới** | FR-03 | `Abcdef1!` (8 ký tự đủ 4 nhóm) | Hợp lệ, sẵn sàng submit nếu xác nhận khớp | README FR-01/FR-03 |
| **Xác nhận mật khẩu** | FR-03 | Rỗng hoặc không khớp (`KhacPass123!`) | Báo lỗi: Mật khẩu xác nhận không khớp | README FR-01/FR-03 |
| **Từ khóa tìm kiếm** | FR-05 | Tên có thật: `"Áo"` | Lọc danh sách trả về đúng các sản phẩm có tên chứa "Áo" | README FR-05 |
| **Từ khóa tìm kiếm** | FR-05 | Không tồn tại: `ZZZ_NO_MATCH_20261108` | Hiển thị empty state có minh họa và thông báo không tìm thấy | README FR-05/FR-24 |
| **Từ khóa tìm kiếm** | FR-05 | Chứa mã HTML: `<b>Áo</b>` | Hiển thị chuỗi literal `<b>Áo</b>`, không in đậm DOM (chống XSS) | README FR-05/SEC-04 |
| **Từ khóa tìm kiếm** | FR-05 | Xóa rỗng hoặc khoảng trắng `"   "` | Khôi phục hiển thị toàn bộ danh sách sản phẩm | Tiêu chí bổ sung |
| **Số lượng giỏ hàng** | FR-07 | Rỗng `""`, `0`, âm `-1`, chữ `abc` | Chặn nhập hoặc phục hồi giá trị trước, không tạo NaN/tổng âm | Tiêu chí bổ sung (`USR-QTY`) |
| **Số lượng giỏ hàng** | FR-07 | Số thập phân `1.5` | Chặn nhập dấu chấm/phẩy hoặc làm tròn số nguyên | Tiêu chí bổ sung (`USR-QTY`) |
| **Tên sản phẩm Admin** | FR-15 | Để rỗng `""` | Báo lỗi trường bắt buộc, không cho tạo/lưu | README FR-15 |
| **Tên sản phẩm Admin** | FR-15 | Độ dài 255 ký tự | Hợp lệ, lưu thành công | README FR-15 |
| **Tên sản phẩm Admin** | FR-15 | Vượt quá 255 ký tự (256 ký tự) | Bị chặn giới hạn độ dài `maxlength` hoặc báo lỗi | README FR-15 |
| **Giá sản phẩm Admin** | FR-15 | Để rỗng `""`, `0`, âm `-1`, chữ `abc` | Báo lỗi: Giá bắt buộc và phải là số dương (> 0) | README FR-15 |
| **Giá sản phẩm Admin** | FR-15 | Giá `1` hoặc `125000` | Hợp lệ, chấp nhận lưu | README FR-15 |
| **Danh mục Admin** | FR-15 | Chưa chọn (placeholder/rỗng) | Báo lỗi: Bắt buộc chọn danh mục từ danh sách có sẵn | README FR-15 |
