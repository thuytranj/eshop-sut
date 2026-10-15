# FR-15 — Review độc lập cuối cùng và cách xử lý

## 1. Phạm vi review

Reviewer sử dụng fresh context với model `gpt-6-astra`, reasoning high, được gọi qua collaboration theo phương thức Native của executing-plans. Review chỉ đọc dải commit `6e29712..c0623d2`; commit `5f9c73b` sau đó chỉ cập nhật commit-log. Không có reviewer riêng cho từng task.

Phần dưới là bản tóm tắt đã ghi lại của kết quả review; lời phản hồi đầy đủ nằm trong chat. Đánh giá ban đầu áp dụng cho run02 trước sửa, không phải một lượt review thứ hai đối với bản đã sửa.

## 2. Kết quả review ban đầu

Reviewer ghi nhận các điểm tốt: traceability theo tầng/thao tác rõ ràng; không coi category ID là khoảng số; công khai giới hạn precision; tách UI trước/sau reload khỏi DB; giữ nguyên SUT. Kết quả run02 được đối soát và 15 kiểm tra harness tại thời điểm review đều đạt.

| Mức độ | Phát hiện | Ảnh hưởng |
|---|---|---|
| Critical | Không có | — |
| Important 1 | run-products-web.py chưa ghi img src; assessor chỉ so tên, giá và alt | Chưa chứng minh được việc bảo toàn ảnh đang hiển thị; nguồn ảnh sai vẫn có thể được cho Passed |
| Important 2 | Không có response làm !success=true | Handler im lặng hoặc request không hoàn tất có thể bị hiểu nhầm thành từ chối. Bốn ca reject Passed của run02 có HTML prevention nên chưa bị chứng minh là false Pass |
| Minor | Không có | — |

Đánh giá ban đầu: **chưa sẵn sàng nếu chưa sửa hai Important findings**.

Reviewer không kết luận về việc sửa năm nhóm bug SUT; outcome cụ thể của giá phân số/Unicode/trim/ID vắng; PDF/GitHub/demo/hồ sơ nộp bài đầy đủ; thay đổi FR-03/.gitignore có sẵn; hoặc trình duyệt/native platform ngoài Chromium Admin Web.

## 3. Đánh giá lại và một lượt sửa

Cả hai Important findings được chấp nhận. Regression test nguồn ảnh sai và thiếu response đã được chạy ở trạng thái RED trước khi sửa. Sau đó, runner ghi/so `src`, đồng thời chỉ công nhận từ chối khi có HTML prevention hoặc response thực phù hợp. Thiếu evidence từ chối chuyển thành Blocked. Regression test cũ về sai tên được bổ sung src đúng để tiếp tục tập trung vào mục tiêu ban đầu.

Đối với mục reviewer đặt ngoài oracle, agent thực hiện đánh giá lại giá cụ thể 0.5: số này biểu diễn được và lớn hơn 0. Thiếu precision chỉ hạn chế nearest-neighbor BVA, không làm mất oracle chấp nhận của 0.5. Bốn ca Supplementary API/WEB Create/Update chuyển sang oracle confirmed trong freeze v3; regression test sử dụng canonical case chuyển RED→GREEN. Unicode/trim và response contract của ID vắng vẫn unresolved.

## 4. Kiểm chứng sau sửa

18 kiểm tra harness đều đạt. Kiểm tra hồi quy đồng bộ DOM bằng Chromium cũng đạt. Toàn bộ suite được chạy lại trong run03 với hash suite/harness mới; raw evidence run01/run02 giữ nguyên.

Run03: **158 ca đã attempt; 151 có verdict, gồm 56 Passed và 95 Failed; 7 Blocked do oracle; 0 Not Run**. Số liệu chi tiết nằm trong [test-results.md](test-results.md), không lấy từ đánh giá ban đầu của run02.

Không gọi reviewer thứ hai theo quy tắc một lượt sửa của executing-plans. Không có Minor bị hoãn. Các sửa đổi thuộc harness/oracle và hồ sơ; không sửa SUT hoặc thực hiện publish/merge.
