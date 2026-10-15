# FR15 — AI gap analysis

## Bằng chứng và phạm vi

Audit ghi các snapshot output theo task trong phiên hiện tại; capture partial, không phải complete session transcript. Model cụ thể và thời gian lịch sử prompt không biết, recorded_at có UTC+07:00. Người dùng chọn Native là authorization execution, không phải learner technical review. Learner review: Pending.

| Gap | Output ban đầu / bằng chứng | Correction và verification | Phân loại |
|---|---|---|---|
| GAP-01 | Fixtures ở commit e625109 và source/frozen v1 có IDAT CRC sai; evidence/harness/png-red.log xác nhận failure | Commit 65d30b1 sửa CRC, freeze v2 giữ old hashes trong suite-review.md; png-fixture.test.cjs GREEN | AI fixture omission được quan sát; không phải bug SUT |
| GAP-02 | run01 WEB TC069 uiBeforeReload=3 rows, screenshot chụp sau đã có 4; runner suy lỗi UI khi chưa đồng bộ | Thêm API-request quiet 500ms + hai animation frames; ui-sync.test.py từ missing behavior RED sang GREEN; run02 chạy lại toàn 158 ca | AI harness timing gap; bỏ verdict run01 khỏi bug count |
| GAP-03 | readback-red.log: assessor chưa phát hiện tình huống DB đúng nhưng API readback thiếu | Thêm api-readback-consistent trong assessor; harness 15 tests GREEN; run02 ghi DB + API readback và so sánh | Oracle assertion omission trong harness; chưa phải missed SUT bug |

Nguyên nhân có thể liên quan việc AI tập trung vào nội dung nghiệp vụ mà chưa kiểm dữ liệu nhị phân và timing của React; đây là giả thuyết từ dấu hiệu, không phải khẳng định cơ chế bên trong AI. Không có learner correction nào được cung cấp, nên không gán ba correction này cho sinh viên.

## Những rủi ro đã phòng ngừa, không bịa thành lỗi AI đã xảy ra

Update validation, BVA length257, category membership thay vì ID interval, price precision chưa biết, khác biệt API/WEB và immediate/reload đã được đưa vào thiết kế. Không có evidence chứng minh AI ban đầu bỏ các case đó. Năm nhóm bug SUT đều có failed observations run02 và mapping trong bugs.md; chưa có bằng chứng một bug SUT nằm ngoài output ban đầu rồi mới được người học bổ sung. Không tuyên bố AI không còn bỏ sót bug.

## Giới hạn / follow-up

11 supplementary probes có actual observation nhưng oracle đầy đủ chưa xác định: price precision, Unicode/trim, missing-target contract. DT143 và BVA44 là nghĩa vụ lấy mẫu trong phạm vi hữu hạn, không phải full-input coverage. Cần slide và clarification để version suite/rerun; không suy diễn Pass/Fail. PDF/YouTube/GitHub Issues là công việc submission chưa được thực hiện trong plan FR15 này.

## AI Critique — draft cần người học review

Trong quá trình kiểm thử FR-15, AI giúp chuyển requirement thành predicates, chọn các điểm On/Off/In và tính hợp tập BVA có truy vết. Tuy nhiên, hai sai sót thực tế cho thấy đầu ra hợp lý về hình thức chưa đủ đáng tin. Thứ nhất, ảnh PNG dùng làm fixture có CRC sai. Nếu không kiểm tra dữ liệu mẫu, lỗi ảnh có thể tạo nhiễu khi chụp giao diện. Sai sót được phát hiện bằng kiểm tra từng chunk, sửa trước execution và lưu phiên bản freeze mới. Thứ hai, runner ban đầu đọc DOM trước khi chuỗi cập nhật bất đồng bộ hoàn tất. Ở TC069 của run01, snapshot chỉ có ba dòng nhưng screenshot sau đó đã có bốn dòng. Vì vậy, một phần lỗi UI trong lượt đầu là lỗi đo của harness, không phải bằng chứng đáng tin về SUT. Runner được bổ sung điều kiện API yên lặng và kiểm tra hồi quy bằng Chromium, rồi toàn suite được chạy lại trong run02. Đây là những thiếu sót của AI khi chuẩn bị fixture và đồng bộ quan sát; nguyên nhân bên trong mô hình không thể xác định chỉ từ kết quả này. Không có bằng chứng để khẳng định sinh viên đã phát hiện hoặc sửa chúng. Bài học là phải kiểm chứng cả test oracle, dữ liệu mẫu và công cụ đo; giữ bằng chứng gốc, phân biệt coverage với pass rate và công khai những probe chưa có oracle. Người học vẫn cần review kết quả và cung cấp slide để đối chiếu phương pháp.

Word count: 266, tính bằng whitespace split trên riêng đoạn critique. Draft do AI hỗ trợ; chưa có learner acceptance/revision.
