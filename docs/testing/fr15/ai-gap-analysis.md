# FR-15 — AI gap analysis và AI Critique

## 1. Phạm vi bằng chứng

AI Audit lưu các snapshot output theo từng bước trong phiên làm việc. Capture extent là partial: không có transcript đầy đủ của phiên. Model cụ thể của agent chính và thời gian lịch sử của prompt chưa biết; `recorded_at` ghi thời điểm lưu với timezone UTC+07:00. Review độc lập sử dụng model được nêu riêng trong final-review.md.

Việc người dùng chọn Native là cho phép thực hiện plan, không chứng nhận kết quả kiểm thử. Review kỹ thuật của người học vẫn đang chờ. Các hiệu chỉnh dưới đây do AI self-review hoặc review độc lập phát hiện; không gán chúng cho sinh viên khi chưa có bằng chứng.

## 2. Khoảng trống phát hiện trước review cuối

| Gap | Output ban đầu và bằng chứng | Cách hiệu chỉnh, kiểm chứng | Kết luận |
|---|---|---|---|
| GAP-01 | Fixture ở commit e625109 và suite v1 có IDAT CRC sai; evidence/harness/png-red.log tái hiện được lỗi | Sửa CRC trong commit 65d30b1; freeze v2 giữ hash cũ để đối chiếu; png-fixture.test.cjs chuyển RED→GREEN | Sai sót chuẩn bị fixture của AI, không phải bug SUT |
| GAP-02 | Ở run01, WEB TC069 có uiBeforeReload chỉ 3 dòng nhưng screenshot sau đó đã có 4 dòng | Theo dõi API-request quiet 500ms và hai animation frames; kiểm tra hồi quy ui-sync.test.py chuyển RED→GREEN; chạy lại 158 ca trong run02 | Race của harness có thể tạo false failure; không dùng verdict run01 để đếm bug cuối |
| GAP-03 | readback-red.log cho thấy assessor chưa phát hiện trường hợp DB đúng nhưng API readback thiếu dữ liệu | Thêm assertion api-readback-consistent; 15 kiểm tra harness tại giai đoạn đó đạt; run02 ghi và so sánh cả DB lẫn API readback | Thiếu assertion trong oracle của harness; chưa chứng minh bỏ sót bug SUT |

AI có thể đã tập trung vào logic nghiệp vụ mà chưa kiểm đủ dữ liệu nhị phân và timing của React. Đây là giả thuyết dựa trên hiện tượng quan sát, không phải kết luận về cơ chế bên trong mô hình.

## 3. Khoảng trống phát hiện tại review cuối và freeze v3

**GAP-04 — Thiếu nguồn ảnh trong UI snapshot.** Reviewer độc lập phát hiện snapshot và assessor chỉ so tên, giá, alt mà chưa so `src`. Một quan sát tổng hợp có nguồn ảnh sai vẫn có thể được assessor cho Passed. Bổ sung việc ghi/so `src` cho cả UI trước và sau reload, cùng regression test RED→GREEN. Gap này làm yếu assertion coverage; không tự chứng minh SUT đã làm hỏng ảnh của sản phẩm khác.

**GAP-05 — Nhầm không có response với từ chối thao tác.** Điều kiện `!success` trước đây có thể đúng cả khi không nhận được response. Regression test cho tình huống này chuyển RED→GREEN sau khi yêu cầu HTML prevention thực sự hoặc response từ chối. Nếu không có evidence phù hợp, kết quả phải là Blocked. Bốn ca từ chối được Passed trong run02 đều có HTML prevention nên chưa có bằng chứng chúng là false Pass.

**GAP-06 — Áp oracle quá thận trọng với giá 0.5.** Bốn ca từng bị Blocked vì nhầm thiếu precision của BVA với việc chưa biết giá này có hợp lệ hay không. Theo R06, 0.5 biểu diễn được và thỏa p>0 nên có oracle chấp nhận. Bốn ca giữ nhãn Supplementary, được kiểm bằng regression test RED→GREEN rồi chạy lại toàn suite ở run03. API Create/Update và WEB Create chấp nhận giá này; WEB Update lưu đúng nhưng UI tức thời sai, thuộc BUG-004 đã biết. Kết quả này giải quyết một khoảng trống trong việc phán quyết, không chứng minh một bug giá mới hoặc correction của sinh viên.

Freeze v3 giữ ID, mapping và mẫu số DT/BVA; chỉ hiệu chỉnh bốn oracle cùng assertion coverage. Run03 là kết quả cuối. Các phiên bản cũ được giữ qua Git và raw evidence. Xem [review độc lập và cách xử lý](final-review.md).

## 4. Rủi ro đã phòng ngừa và giới hạn kết luận

Thiết kế đã xét Update validation, giá trị tên 257 của BVA, category membership thay vì khoảng ID, precision giá chưa rõ, API/WEB và UI trước/sau reload. Không có bằng chứng để biến các rủi ro đã phòng ngừa này thành lời khẳng định rằng AI từng bỏ sót chúng.

Năm nhóm bug trong [bugs.md](bugs.md) dựa trên observations Failed của run03. Chưa có bằng chứng một bug SUT ngoài các nhóm đã báo cáo được sinh viên phát hiện rồi bổ sung. Cũng không thể kết luận AI đã tìm hết bug.

Bảy Supplementary probe đã có quan sát nhưng vẫn thiếu oracle: quy tắc trim/đếm Unicode và response contract của ID vắng. 143 obligation DT và 44 obligation BVA là tập mẫu hữu hạn, không phải coverage toàn input. Cần slide và đặc tả bổ sung để version suite và chạy lại. PDF, YouTube, GitHub Issues và hồ sơ nộp bài đầy đủ chưa được thực hiện trong execution plan FR-15 này.

## 5. AI Critique — bản thảo chờ người học review

AI hỗ trợ chuyển requirement FR-15 thành predicates, điểm On/Off/In và nghĩa vụ BVA có truy vết. Tuy nhiên, nhiều sai sót thực tế cho thấy đầu ra hợp lý về hình thức chưa đủ đáng tin. Fixture PNG ban đầu có CRC sai; kiểm tra từng chunk phát hiện vấn đề trước execution và dẫn đến freeze mới. Runner đầu tiên lại đọc DOM trước khi cập nhật bất đồng bộ hoàn tất: TC069 của run01 có snapshot ba dòng nhưng screenshot sau đó có bốn dòng. Vì vậy, không thể coi mọi assertion thất bại là bug của SUT. Sau khi sửa đồng bộ, toàn suite được chạy lại. Review độc lập tiếp tục chỉ ra rằng snapshot thiếu nguồn ảnh và việc không nhận response bị nhầm thành bằng chứng từ chối. Các kiểm tra hồi quy đã chứng minh và sửa hai khoảng trống này. Một lỗi phân tích khác là giữ giá 0.5 ở trạng thái chưa có oracle vì precision chưa rõ. Thực tế, 0.5 biểu diễn chính xác và thỏa điều kiện lớn hơn không; precision còn thiếu chỉ giới hạn phân tích lân cận BVA. Oracle được sửa và suite chạy lại trong run03, phân biệt giá lưu đúng với lỗi UI cập nhật. Những sự kiện này cho thấy cần kiểm chứng cả dữ liệu mẫu, công cụ đo và cách diễn giải requirement. Không có bằng chứng để gán các correction cho sinh viên hoặc khẳng định nguyên nhân bên trong mô hình. Người học vẫn cần review, bổ sung slide, giữ bằng chứng gốc và phân biệt coverage với pass rate.

Số từ: **272**, tính bằng whitespace split trên riêng đoạn critique. Đây là bản thảo có AI hỗ trợ; chưa có xác nhận hoặc bản sửa từ người học.
