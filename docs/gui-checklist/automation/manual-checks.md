# Hướng dẫn Kiểm tra Thủ công và Cổng Phê duyệt (Manual Gates)

Tài liệu này ghi nhận hướng dẫn kiểm tra thủ công cho các hạng mục yêu cầu đối soát thực tế trên Google Chrome và thiết bị.

---

## 1. GUI-065: Kiểm tra bộ gõ tiếng Việt (IME Telex/VNI)
- **Màn hình**: FR-05 (Danh sách & Tìm kiếm sản phẩm)
- **Khía cạnh**: IA-02 (Biểu mẫu)
- **Mục đích**: Đảm bảo khi gõ tiếng Việt bằng bộ gõ OS thật (EVKey / UniKey / bộ gõ macOS), input không bị mất ký tự, nuốt phím hoặc nhảy con trỏ sai lệch qua các lần re-render.
- **Quy trình thực hiện**:
  1. Mở Chrome trên máy chạy, truy cập trang chủ `http://localhost:5173`.
  2. Bật bộ gõ tiếng Việt (Telex hoặc VNI).
  3. Nhập 3 cụm từ:
     - `dien thoai` -> `điện thoại`
     - `ban phim` -> `bàn phím`
     - `tai nghe` -> `tai nghe`
  4. Thử đặt con trỏ giữa từ và xóa/sửa ký tự.
  5. Ghi nhận: Công cụ gõ, OS, phiên bản Chrome, kết quả quan sát và đính kèm video/ảnh chụp màn hình.

---

## 2. GUI-066: Trợ năng đọc màn hình (Screen Reader & A11y)
- **Màn hình**: FR-07 (Chi tiết giỏ hàng)
- **Khía cạnh**: IA-01 (Tiêu chuẩn giao diện chung)
- **Mục đích**: Kiểm tra các nút icon (Xóa, Tăng/Giảm) có `aria-label` rõ nghĩa và thông báo động (toast) có `role="status"` hoặc `aria-live="polite"` để Screen Reader đọc được.
- **Quy trình thực hiện**:
  1. Bật VoiceOver (trên macOS: Command + F5) hoặc NVDA (trên Windows).
  2. Dùng phím Tab di chuyển vào giỏ hàng `http://localhost:5173/cart`.
  3. Lắng nghe VoiceOver đọc tên và vai trò của các nút trong từng dòng sản phẩm.
  4. Thực hiện xóa hoặc cập nhật và lắng nghe thông báo cập nhật trạng thái.
  5. Ghi nhận: Tên công cụ Screen Reader, phiên bản OS, kết quả đọc được.

---

## 3. GUI-069: Kích thước vùng bấm cảm ứng (Touch Target >= 44x44px) & Bàn phím ảo
- **Màn hình**: FR-07 (Chi tiết giỏ hàng)
- **Khía cạnh**: IA-01 (Tiêu chuẩn giao diện chung)
- **Mục đích**: Đảm bảo trên viewport thiết bị di động (360x800), các nút tương tác (+/−, Xóa, CTA) có diện tích tiếp xúc tối thiểu 44x44 CSS px.
- **Phần hoãn (Deferred)**: Kiểm tra tương tác bàn phím ảo đẩy layout trên thiết bị di động vật lý thật được hoãn ra ngoài phạm vi chạy Chrome máy trạm hiện tại theo Global Constraints.
- **Quy trình thực hiện trên Chrome**:
  1. Mở DevTools, chọn responsive mode 360x800.
  2. Đo kích thước bounding box của các nút thao tác.
  3. Xác nhận nút bấm có thể click được và không bị che khuất sau khi cuộn trang.
