# FR15 — AI gap analysis

## Bằng chứng và phạm vi

Audit ghi các snapshot output theo task trong phiên hiện tại; capture partial, không phải complete session transcript. Model cụ thể và thời gian lịch sử prompt không biết, recorded_at có UTC+07:00. Người dùng chọn Native là authorization execution, không phải learner technical review. Learner review: Pending.

| Gap | Output ban đầu / bằng chứng | Correction và verification | Phân loại |
|---|---|---|---|
| GAP-01 | Fixtures ở commit e625109 và source/frozen v1 có IDAT CRC sai; evidence/harness/png-red.log xác nhận failure | Commit 65d30b1 sửa CRC, freeze v2 giữ old hashes trong suite-review.md; png-fixture.test.cjs GREEN | AI fixture omission được quan sát; không phải bug SUT |
| GAP-02 | run01 WEB TC069 uiBeforeReload=3 rows, screenshot chụp sau đã có 4; runner suy lỗi UI khi chưa đồng bộ | Thêm API-request quiet 500ms + hai animation frames; ui-sync.test.py từ missing behavior RED sang GREEN; run02 chạy lại toàn 158 ca | AI harness timing gap; bỏ verdict run01 khỏi bug count |
| GAP-03 | readback-red.log: assessor chưa phát hiện tình huống DB đúng nhưng API readback thiếu | Thêm api-readback-consistent trong assessor; harness 15 tests GREEN; run02 ghi DB + API readback và so sánh | Oracle assertion omission trong harness; chưa phải missed SUT bug |

Nguyên nhân có thể liên quan việc AI tập trung vào nội dung nghiệp vụ mà chưa kiểm dữ liệu nhị phân và timing của React; đây là giả thuyết từ dấu hiệu, không phải khẳng định cơ chế bên trong AI. Không có learner correction nào được cung cấp, nên không gán ba correction này cho sinh viên.

## Final review gaps và correction v3

- GAP-04 (review độc lập): UI snapshot/assessor ban đầu thiếu image src, nên không đủ bằng chứng cho image preservation. Thêm src vào cả immediate/reload, kiểm tra wrong-image từng Passed trước sửa rồi Failed đúng sau sửa. Đây là omission của assertion coverage, không tự suy đã có corruption ảnh của non-target trong SUT.
- GAP-05 (review độc lập): absence of response bị coi là rejection do !success; test no-response RED→GREEN, giờ cần HTML prevention thật hoặc rejection response. Bốn ca reject Passed của run02 có HTML prevention nên không bị chứng minh false Pass bởi gap này.
- GAP-06 (executor re-grade một mục reviewer đặt ngoài oracle): bốn ca số dương 0.5 từng bị Blocked vì lẫn precision BVA với acceptance. README chỉ yêu cầu số >0; 0.5 biểu diễn chính xác và thỏa predicate. Oracle đổi accept, technique Supplementary giữ nguyên; consumer test RED→GREEN và whole suite run03. API C/U và WEB Create chấp nhận 0.5; WEB Update lưu đúng nhưng UI tức thời sai (BUG-004 đã biết). Đây là adjudication gap, không chứng minh một bug giá mới hay correction của sinh viên.

Freeze v3 giữ ID và DT/BVA denominator, đổi bốn oracle và assertion coverage; run03 là final. Các bản freeze, reports và run cũ được bảo toàn qua Git/evidence. Bản review gốc và disposition xem final-review.md.

## Những rủi ro đã phòng ngừa, không bịa thành lỗi AI đã xảy ra

Update validation, BVA length257, category membership thay vì ID interval, price precision chưa biết, khác biệt API/WEB và immediate/reload đã được đưa vào thiết kế. Không có evidence chứng minh AI ban đầu bỏ các case đó. Năm nhóm bug SUT được cập nhật từ failed observations run03 và mapping trong bugs.md; AI self-review phát hiện rule p>0 đã bị áp quá thận trọng với 0.5; các ca số dương này trước đó chưa được phán quyết; kết quả mới không chứng minh một bug SUT ngoài các nhóm đã báo cáo. Không có evidence rằng người học là người bổ sung correction này. Không tuyên bố AI không còn bỏ sót bug.

## Giới hạn / follow-up

7 supplementary probes có actual observation nhưng oracle đầy đủ chưa xác định: Unicode/trim, missing-target contract; full-price adjacency vẫn chưa rõ. DT143 và BVA44 là nghĩa vụ lấy mẫu trong phạm vi hữu hạn, không phải full-input coverage. Cần slide và clarification để version suite/rerun; không suy diễn Pass/Fail. PDF/YouTube/GitHub Issues là công việc submission chưa được thực hiện trong plan FR15 này.

## AI Critique — draft cần người học review

AI hỗ trợ chuyển requirement FR-15 thành predicates, điểm On/Off/In và nghĩa vụ BVA có truy vết. Tuy nhiên, nhiều sai sót thực tế cho thấy đầu ra hợp lý về hình thức chưa đủ đáng tin. Fixture PNG ban đầu có CRC sai; kiểm tra từng chunk phát hiện vấn đề trước execution và dẫn đến freeze mới. Runner đầu tiên lại đọc DOM trước khi cập nhật bất đồng bộ hoàn tất: TC069 của run01 có snapshot ba dòng nhưng screenshot sau đó có bốn dòng. Vì vậy, không thể coi mọi assertion thất bại là bug của SUT. Sau khi sửa đồng bộ, toàn suite được chạy lại. Review độc lập tiếp tục chỉ ra rằng snapshot thiếu nguồn ảnh và việc không nhận response bị nhầm thành bằng chứng từ chối. Các kiểm tra hồi quy đã chứng minh và sửa hai khoảng trống này. Một lỗi phân tích khác là giữ giá 0.5 ở trạng thái chưa có oracle vì precision chưa rõ. Thực tế, 0.5 biểu diễn chính xác và thỏa điều kiện lớn hơn không; precision còn thiếu chỉ giới hạn phân tích lân cận BVA. Oracle được sửa và suite chạy lại trong run03, phân biệt giá lưu đúng với lỗi UI cập nhật. Những sự kiện này cho thấy cần kiểm chứng cả dữ liệu mẫu, công cụ đo và cách diễn giải requirement. Không có bằng chứng để gán các correction cho sinh viên hoặc khẳng định nguyên nhân bên trong mô hình. Người học vẫn cần review, bổ sung slide, giữ bằng chứng gốc và phân biệt coverage với pass rate.

Word count: 272, whitespace split trên riêng đoạn critique. AI-assisted draft; learner review Pending.
