# GitHub Issue drafts — FR-03, FR-05, FR-07, FR-15

24 nội dung issue được tách từ [bugs-report.md](../bugs-report.md). Mỗi file là body Markdown để copy vào GitHub Issues; tiêu đề chính xác và nhãn đề xuất ở bảng dưới và trong [issues.json](issues.json). File JSON là dữ liệu chuẩn bị, chưa gửi API GitHub.

**Phân loại:** 22 lỗi quan sát theo đặc tả (gồm 2 dependency), 1 sai lệch dùng oracle suy luận, 1 nghi vấn. Hai mục follow-up về grid/scroll và accessibility native chưa đủ căn cứ thành bug nên vẫn nằm trong phụ lục báo cáo, không tạo draft bug riêng.

**Cách dùng:** tạo issue trong `thuytranj/eshop-sut`, copy Title từ bảng và dán toàn bộ nội dung file body tương ứng. Nhãn chỉ là đề xuất, chưa tạo hoặc áp dụng trên repository. Với hai draft Needs clarification, làm rõ oracle/bằng chứng trước khi gắn nhãn bug confirmed. Không coi số draft là số case Failed.

**Evidence:** link trong body trỏ tới commit `46f7bbd7d356bc25a94f32d74fcbc4d3383d2663` trên repository origin. Mọi đường dẫn đã được xác nhận có trong Git tree của commit này ở máy local; chưa xác minh commit đã tồn tại trên GitHub. Local remote-tracking refs chưa cho thấy HEAD nằm trên nhánh origin. Trước khi đăng issue, cần bảo đảm commit/evidence truy cập được trên GitHub hoặc upload ảnh/log trực tiếp vào issue. Không tự push hay publish trong tác vụ này.

**Template dùng lại:** [bug_report.md](../../../.github/ISSUE_TEMPLATE/bug_report.md). File này chỉ hiện trong giao diện GitHub sau khi được đưa lên nhánh mặc định theo quy trình của repository.

Cấu trúc body theo mẫu: Mô tả lỗi → Môi trường → Steps to reproduce → Actual result → Expected result → Evidence. YAML front matter chỉ nằm trong template `.github/ISSUE_TEMPLATE/bug_report.md`; khi tạo issue, dùng Title từ bảng và body Markdown, không dán YAML vào nội dung issue. Template mặc định dùng `type: bug`, `status: new`; hai draft cần làm rõ giữ `needs-clarification` và chưa đề xuất `type: bug`.

| Bug ID | Title | Phân loại | Labels đề xuất | Body |
|---|---|---|---|---|
| BUG-FR03-01 | [BUG]: [FR-03] [BUG-FR03-01] Backend cấp phát mã OTP 4 chữ số thay vì 6 chữ số ngẫu nhiên | Observed | `type: bug`, `status: new`, `fr-03`, `severity:high`, `priority:p1` | [Markdown](BUG-FR03-01.md) |
| BUG-FR03-02 | [BUG]: [FR-03] [BUG-FR03-02] API chấp nhận mật khẩu mới vi phạm độ dài hoặc độ mạnh | Observed | `type: bug`, `status: new`, `fr-03`, `severity:high`, `priority:p1` | [Markdown](BUG-FR03-02.md) |
| BUG-FR03-03 | [BUG]: [FR-03] [BUG-FR03-03] Giao diện Web thiếu chỉ báo bước (Step Indicator) | Observed | `type: bug`, `status: new`, `fr-03`, `severity:low`, `priority:p3` | [Markdown](BUG-FR03-03.md) |
| BUG-FR03-04 | [BUG]: [Needs clarification] [FR-03] [BUG-FR03-04] Nghi vấn thiếu liên kết quay lại đăng nhập trong form bước 1 | Suspected | `status: new`, `needs-clarification`, `fr-03`, `severity:medium`, `priority:p2` | [Markdown](BUG-FR03-04.md) |
| BUG-FR03-05 | [BUG]: [FR-03] [BUG-FR03-05] Form Bước 2 hoàn toàn thiếu trường "Xác nhận mật khẩu mới" | Observed | `type: bug`, `status: new`, `fr-03`, `severity:high`, `priority:p1` | [Markdown](BUG-FR03-05.md) |
| BUG-FR03-06 | [BUG]: [FR-03] [BUG-FR03-06] Regex kiểm tra mật khẩu phía Frontend Web bị lỗi ngược (Yêu cầu khoảng trắng, từ chối ký tự đặc biệt) | Observed | `type: bug`, `status: new`, `fr-03`, `severity:high`, `priority:p1` | [Markdown](BUG-FR03-06.md) |
| FR05-BUG-001 | [BUG]: [FR-05] [FR05-BUG-001] Search tên chứa apostrophe trả Database Error | Observed | `type: bug`, `status: new`, `fr-05`, `severity:high`, `priority:p1` | [Markdown](FR05-BUG-001.md) |
| FR05-BUG-002 | [BUG]: [FR-05] [FR05-BUG-002] Mobile không bảo toàn reserved characters trong search query | Observed | `type: bug`, `status: new`, `fr-05`, `severity:high`, `priority:p1` | [Markdown](FR05-BUG-002.md) |
| FR05-BUG-003 | [BUG]: [FR-05] [FR05-BUG-003] Search success rỗng không có empty state | Observed | `type: bug`, `status: new`, `fr-05`, `severity:medium`, `priority:p2` | [Markdown](FR05-BUG-003.md) |
| FR05-BUG-004 | [BUG]: [FR-05] [FR05-BUG-004] Ảnh nguồn vuông bị stretch thành hình chữ nhật | Observed | `type: bug`, `status: new`, `fr-05`, `severity:medium`, `priority:p2` | [Markdown](FR05-BUG-004.md) |
| FR05-BUG-005 | [BUG]: [Needs clarification] [FR-05] [FR05-BUG-005] Response cũ ghi đè card trong khi keyword vẫn là query mới | Derived | `status: new`, `needs-clarification`, `fr-05`, `severity:high`, `priority:p1` | [Markdown](FR05-BUG-005.md) |
| FR07-BUG-001 | [BUG]: [FR-07] [FR07-BUG-001] Thêm cùng sản phẩm vào giỏ không gộp số lượng mà tạo dòng mới | Observed | `type: bug`, `status: new`, `fr-07`, `severity:high`, `priority:p1` | [Markdown](FR07-BUG-001.md) |
| FR07-BUG-002 | [BUG]: [FR-07] [FR07-BUG-002] Bảng giỏ hàng thiếu các nút điều khiển '+' và '-' để chỉnh số lượng | Observed | `type: bug`, `status: new`, `fr-07`, `severity:high`, `priority:p1` | [Markdown](FR07-BUG-002.md) |
| FR07-BUG-003 | [BUG]: [FR-07] [FR07-BUG-003] Nút Xóa sản phẩm xóa lập tức mà không có Dialog xác nhận | Observed | `type: bug`, `status: new`, `fr-07`, `severity:medium`, `priority:p2` | [Markdown](FR07-BUG-003.md) |
| FR07-BUG-004 | [BUG]: [FR-07] [FR07-BUG-004] Sai tiêu đề cột 'Đơn giá' thành 'Giá' trên bảng giỏ hàng | Observed | `type: bug`, `status: new`, `fr-07`, `severity:low`, `priority:p3` | [Markdown](FR07-BUG-004.md) |
| FR07-BUG-005 | [BUG]: [FR-07] [FR07-BUG-005] Nhãn hiển thị tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng' | Observed | `type: bug`, `status: new`, `fr-07`, `severity:low`, `priority:p3` | [Markdown](FR07-BUG-005.md) |
| FR07-BUG-006 | [BUG]: [FR-07] [FR07-BUG-006] Giỏ hàng trống không có hình minh họa theo yêu cầu đặc tả | Observed | `type: bug`, `status: new`, `fr-07`, `severity:low`, `priority:p3` | [Markdown](FR07-BUG-006.md) |
| FR07-BUG-007 | [BUG]: [FR-07] [FR07-BUG-007] [Dependency] Nút 'Thêm vào giỏ hàng' không hoạt động ở lần bấm đầu tiên | Observed | `type: bug`, `status: new`, `fr-07`, `severity:high`, `priority:p1`, `dependency` | [Markdown](FR07-BUG-007.md) |
| FR07-BUG-008 | [BUG]: [FR-07] [FR07-BUG-008] Nhãn nút quay lại trang chủ trên giỏ hàng có sản phẩm bị sai thành '← Mua tiếp' thay vì 'Tiếp tục mua sắm' | Observed | `type: bug`, `status: new`, `fr-07`, `severity:low`, `priority:p3` | [Markdown](FR07-BUG-008.md) |
| FR15-BUG-001 | [BUG]: [FR-15] [FR15-BUG-001] Không kiểm tra đầy đủ tên bắt buộc và giới hạn 255 ký tự | Observed | `type: bug`, `status: new`, `fr-15`, `severity:high`, `priority:p1` | [Markdown](FR15-BUG-001.md) |
| FR15-BUG-002 | [BUG]: [FR-15] [FR15-BUG-002] Không kiểm tra đầy đủ giá bắt buộc, dạng số và điều kiện lớn hơn 0 | Observed | `type: bug`, `status: new`, `fr-15`, `severity:high`, `priority:p1` | [Markdown](FR15-BUG-002.md) |
| FR15-BUG-003 | [BUG]: [FR-15] [FR15-BUG-003] Cho phép lưu sản phẩm với danh mục bị thiếu hoặc không tồn tại | Observed | `type: bug`, `status: new`, `fr-15`, `severity:high`, `priority:p1` | [Markdown](FR15-BUG-003.md) |
| FR15-BUG-004 | [BUG]: [FR-15] [FR15-BUG-004] Sửa một sản phẩm làm sai tên sản phẩm khác và để dữ liệu UI của target bị cũ | Observed | `type: bug`, `status: new`, `fr-15`, `severity:high`, `priority:p1` | [Markdown](FR15-BUG-004.md) |
| FR15-BUG-005 | [BUG]: [FR-15] [FR15-BUG-005] [Dependency FR-12] API ghi sản phẩm không chặn token thiếu, lỗi hoặc không có quyền admin | Observed | `type: bug`, `status: new`, `fr-15`, `severity:high`, `priority:p1`, `dependency` | [Markdown](FR15-BUG-005.md) |
