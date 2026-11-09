# Báo cáo Rà soát Ngữ nghĩa & Phân định Trách nhiệm Kiểm thử GUI (Review Log)

Tài liệu này ghi lại quá trình rà soát độc lập, đối chiếu ngữ nghĩa với đặc tả, xử lý các khác biệt nguồn và phân định rõ ràng ranh giới giữa bản sinh tự động bởi AI và các đóng góp của con người (Human Review).

---

## 1. Trạng thái Đánh giá Con người (Human Review Status)

> [!NOTE]
> **Trạng thái hiện tại: `Human Review Completed (6 items added)`**
> - **64 mục ban đầu (`GUI-001` đến `GUI-064`)**: Được tạo lập bởi AI với `origin=AI`.
> - **6 mục bổ sung sau phản biện QA (`GUI-065` đến `GUI-070`)**: Được gán nhãn chính xác là `origin=Human` kèm theo giải trình bắt buộc tại `addition_reason` (giải thích rõ lý do cốt lõi AI bỏ sót: thiếu tầng OS-level IME, không nghe được Screen Reader, thiên kiến môi trường localhost không trễ mạng, bỏ qua trạng thái trung gian transient empty string, thiếu cảm nhận xúc giác touch target di động, và bỏ qua tâm lý click spamming).

---

## 2. Rà soát 5 Trọng tâm Đánh giá (Review Focus Analysis)

Quá trình rà soát đã đối chiếu chi tiết 5 trọng tâm ngữ nghĩa cốt lõi được nêu trong Kế hoạch thực hiện:

### Focus 1: Hiển thị an toàn từ khóa tìm kiếm (FR-05 & SEC-04)
- **Mục kiểm tra**: `GUI-021` (IA-01).
- **Phân tích đối chiếu**: Đảm bảo từ khóa chứa mã HTML như `<b>Áo</b>` hoặc `<script>alert(1)</script>` được hiển thị dưới dạng chuỗi literal text an toàn trên giao diện, không được render thành thẻ `<b>` trong DOM hay gây lỗi XSS.
- **Oracle độc lập**: DOM textContent phải là chuỗi thô, không tồn tại nút phần tử HTML tương ứng được chèn vào cây DOM.

### Focus 2: Phân tách Oracle cho dữ liệu biên số lượng giỏ hàng và giá sản phẩm
- **Số lượng giỏ hàng (FR-07, USR-QTY-VALID)**: Các mục `GUI-036`, `GUI-037`, `GUI-038`.
  - Phân tách rõ ràng: giá trị hợp lệ (số nguyên dương ≥ 1) phải được cập nhật và tính lại tổng tiền; các giá trị biên sai (rỗng `""`, `0`, âm `-1`, thập phân `1.5`, chữ `abc`) phải có oracle xử lý tách biệt (bị chặn nhập, không gửi request làm hỏng state, hoặc tự phục hồi về giá trị trước). Không được đánh đồng việc form không cho gõ chữ với việc API trả về lỗi 400.
- **Giá sản phẩm Admin (FR-15, FR15-PRICE-REQ)**: Mục `GUI-052`.
  - Oracle tách biệt: Giá bắt buộc > 0 (chấp nhận `1`, `125000`; từ chối `""`, `0`, âm, chữ). Không tự suy diễn giới hạn giá trần tối đa khi README không quy định.

### Focus 3: Tính độc lập khi chỉnh sửa sản phẩm Admin (FR-15, FR15-ISOLATE)
- **Mục kiểm tra**: `GUI-060` (IA-04).
- **Phân tích đối chiếu**: Thực hiện sửa Tên và Giá của sản phẩm A rồi bấm Lưu; kiểm tra lại danh sách trước và sau khi lưu để đảm bảo chỉ sản phẩm A thay đổi, sản phẩm B và các sản phẩm khác trong danh sách giữ nguyên vẹn dữ liệu.
- **Oracle độc lập**: Xác nhận giao diện hiển thị đúng dữ liệu mới của sản phẩm A và dữ liệu cũ của sản phẩm B.

### Focus 4: Luồng Quên mật khẩu đầy đủ 2 bước (FR-03, FR-01, FR-22)
- **Các mục kiểm tra**: `GUI-001` đến `GUI-015`.
- **Phân tích đối chiếu**: Bao phủ trọn vẹn cả Bước 1 (nhập email, validate format, cấp OTP demo 6 chữ số) và Bước 2 (nhập OTP, mật khẩu mới, xác nhận mật khẩu, type="password", kiểm tra độ mạnh theo FR-01).
- **Tính năng Step Indicator**: `GUI-005` kiểm tra chỉ báo bước xuất hiện rõ ràng ở cả 2 bước ("Bước 1 / 2" và "Bước 2 / 2").
- **Ràng buộc OTP với Email**: `GUI-014` kiểm tra OTP cấp cho email A không thể dùng để reset mật khẩu cho email B.

### Focus 5: Phân lập các trạng thái phản hồi và điều hướng bàn phím (IA-03, IA-04)
- **Phân lập trạng thái**:
  - Trạng thái đang tải (Loading / Skeleton): `GUI-028` (dùng network throttling).
  - Trạng thái rỗng không có kết quả tìm kiếm: `GUI-029` (từ khóa không khớp).
  - Trạng thái giỏ hàng trống: `GUI-046` (hình minh họa và thông báo thân thiện).
  - Trạng thái thông báo thành công / thất bại: `GUI-015`, `GUI-031`, `GUI-063`.
- **Điều hướng bàn phím và Modal dialog**:
  - Modal xóa item giỏ hàng: `GUI-044`, `GUI-045` (thoát bằng phím Escape, nút Hủy).
  - Modal xóa sản phẩm Admin: `GUI-061`, `GUI-062` (bẫy focus, phím Escape).
  - Tab-order tuần tự hợp lý trên tất cả 4 màn hình: `GUI-010`, `GUI-011`, `GUI-027`, `GUI-042`, `GUI-059`.

---

## 3. Lịch sử Hiệu chỉnh Cấu trúc (Traceability & Refinements)

Trong quá trình đồng bộ giữa bản nháp đầu tiên và bộ kiểm định cấu trúc tự động (`validate_checklist.py`), các điều chỉnh sau đã được thực hiện để đảm bảo tính nhất quán tuyệt đối giữa mã yêu cầu và khía cạnh giao diện (IA):

1. **Chuẩn hóa ID yêu cầu nguyên tử**:
   - Bổ sung `FR03-STEP-IND` (IA-02) trong `requirements.csv` để ánh xạ trực tiếp từ điều khoản Step Indicator tại dòng 52 của README, thay vì chỉ dùng mã chung `FR22-STEP`.
   - Bổ sung `FR07-DEL-CONFIRM` (IA-04) trong `requirements.csv` để phản ánh đúng điều khoản dialog xác nhận xóa giỏ hàng tại dòng 97 của README song song với quy tắc GUI chung `FR24-DEL-CONFIRM`.
2. **Khắc phục Mismatch IA chéo**:
   - Tại `GUI-045` (IA-04) và `GUI-062` (IA-04): Thao tác thoát modal bằng bàn phím (phím Escape / nút Hủy) ban đầu được gắn nhãn kép với `USR-KBD-NAV` (thuộc IA-03). Do `validate_checklist.py` yêu cầu khắt khe mọi requirement ID được tham chiếu phải có cùng mã IA với dòng checklist, tham chiếu đã được chuẩn hóa về đúng các requirement IA-04 tương ứng (`FR07-DEL-CONFIRM;FR24-DEL-CONFIRM` cho `GUI-045` và `USR-DELETE-ADMIN` cho `GUI-062`). Khía cạnh điều hướng bàn phím vẫn được mô tả đầy đủ, chi tiết trong cột `check`, `expected`, `steps` và `measurement`.
3. **Bảo toàn ID và Bản nháp**:
   - Tất cả các mã định danh `GUI-001` đến `GUI-064` được giữ nguyên vẹn và ổn định 100%.
   - Bản nháp AI nguyên gốc được lưu trữ riêng tại `docs/gui-checklist/checklist.ai-draft.csv` để đối chiếu kiểm toán.

---

## 4. Xác nhận Giới hạn Nguồn (Source Discrepancies)

| Vấn đề nguồn | Đặc tả README | Tiêu chí bổ sung của người dùng / Plan | Xử lý trong Checklist |
|---|---|---|---|
| **Dấu phân cách tiền** | Nhóm nghìn, ký hiệu `₫` | Không cấm dấu phẩy hay chấm | Chấp nhận cả `.` hoặc `,` miễn là nhất quán (`GUI-018`, `GUI-034`) |
| **Màu nút hành động** | Xanh dương (tích cực), Đỏ (nguy hiểm) | Cần kiểm tra độ tương phản | Kiểm tra dải màu trực quan và CSS computed color (`GUI-002`, `GUI-049`) |
| **Phản hồi thêm giỏ** | Toast hoặc Badge | Bắt buộc kiểm tra Toast | Tách kiểm tra cập nhật Badge (`GUI-025`) và hiển thị Toast (`GUI-031`) |
| **Loading trang chủ** | Trạng thái loading rõ ràng | Skeleton loader | Kiểm tra skeleton hoặc visual indicator qua throttling (`GUI-028`) |
| **Modal xóa Admin** | Không đề cập trong README FR-15 | Yêu cầu modal xác nhận xóa | Đưa vào tiêu chí bổ sung `USR-DELETE-ADMIN` (`GUI-061`, `GUI-062`) |
| **Breadcrumbs** | Bắt buộc ở Giỏ, Checkout, Chi tiết | Không áp dụng cho Trang chủ/Admin | Chỉ kiểm tra breadcrumb tại trang Giỏ hàng (`GUI-040`) |
