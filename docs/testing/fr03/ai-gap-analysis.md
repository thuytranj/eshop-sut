# FR-03 — AI gap analysis theo bằng chứng

## 1. Cơ sở so sánh

Đối chiếu slide mới, [bản BVA cũ](references/bva-istqb-historical.md), [bản gap analysis cũ](references/ai-gap-before-lecture.md), mappings trong suite và raw observations. Không coi “AI có thể bỏ sót” là một lỗi AI đã xảy ra; không suy đoán suy nghĩ nội bộ của model.

## 2. Khoảng cách thực sự quan sát được

| Gap | Bằng chứng | Ảnh hưởng và hiệu chỉnh | Giới hạn |
|---|---|---|---|
| Phương pháp không khớp lecture | BVA cũ gọi ISTQB 3-value; lecture 22–25 dùng bốn biến thể khác | Chọn Standard + Robustness, giải thích từng bước và lưu bản cũ | Chưa có slide khi thiết kế đầu; không quy lỗi do AI cố ý bỏ qua nguồn |
| Diễn giải sai một bộ điểm | Bản cũ gọi {7,8,9} là 2-value | Bỏ nhãn sai; phân biệt hai convention rõ ràng | Không làm mất các fixture có giá trị regression |
| Giả định đầu vào độc lập | BVA cũ ghi 6 chiều độc lập | Hai độ dài và bốn phép chiếu; không dùng n=6 trong công thức | Không có evidence đã thực thi Worst-case |
| Đếm DT sai | Domain cases ghi 34; suite có 41 source ID DT/40 canonical DT | Sửa thống kê và giữ phân biệt source/canonical/obligation | Đây là sai metadata, không phải 41 lần chạy mới |
| Đếm coverage sai | Results ghi 21/25, “4 nghĩa vụ” nhưng chỉ nêu DT22/DT23 | Mapping cho 23 nhóm có kết luận, 2 nhóm chặn/5 case | Group coverage không thay thế point coverage |
| WEB BVA bị thiếu evidence | Suite có 16 WEB case DT; không có bộ WEB BVA như thiết kế cũ mô tả | Thiết kế 15 case WEB theo slide, Not Run | Không đánh dấu Passed/Blocked mới từ ảnh cũ |
| Gap analysis cũ suy diễn | Nêu “xu hướng AI” như lỗi quan sát, tự ghi 292 từ mà không kiểm tra | Tách rủi ro khỏi lỗi có chứng cứ, viết critique đếm được | Không tuyên bố learner review chưa xảy ra |

Yêu cầu bổ sung BVA/review workflow trước đây và yêu cầu chỉnh theo lecture hiện tại đều là feedback thực tế của người dùng. Những nguy cơ như đếm trùng hay giả định control UI phải được kiểm soát, nhưng chỉ coi là omission quan sát được khi có output/log đối chứng. Bản cũ nói mật khẩu length=1 vi phạm cả bốn lớp là không chính xác: `A` vẫn có uppercase, chỉ thiếu các lớp khác.

## 3. AI Critique (bản nháp để người học review)

Trong đợt rà soát FR-03, AI giúp chuyển yêu cầu thành vị từ, đối chiếu fixture và truy vết các case đã thực thi. Tuy nhiên, bản báo cáo trước dùng ISTQB 3-value như thể đó là phương pháp môn học. Khi người học cung cấp slide, sự khác biệt trở nên rõ: bài giảng trình bày Standard, Robustness và hai biến thể Worst-case. Việc sửa cần bắt đầu từ lựa chọn phương pháp, không chỉ đổi tên tiêu đề.

Một hạn chế khác là thống kê thiếu nhất quán. Báo cáo ghi 21 trên 25 nhóm nghĩa vụ Domain Testing có kết luận, trong khi mapping và observation cho thấy 23 nhóm; năm case bị chặn thuộc hai nhóm. AI cũng gọi các số đếm ký tự là đầu vào độc lập, dù chúng cùng được suy ra từ một mật khẩu. Nếu áp công thức số ca theo giả định đó, kết quả sẽ sai.

Điểm cần giữ là bằng chứng lịch sử. Đổi phương pháp không tạo ra lượt chạy mới, cũng không làm lỗi mật khẩu rỗng biến mất. Báo cáo sửa giữ raw logs, phân loại các điểm cũ thành regression, và chỉ tái sử dụng quan sát khi fixture phù hợp. WEB theo thiết kế mới vẫn chưa chạy. Bài học là người học cần kiểm tra nguồn phương pháp, đơn vị đếm coverage và mức bằng chứng trước khi chấp nhận kết luận; AI phải nêu rõ điều chưa biết thay vì trình bày thiết kế như kết quả đã xác minh.

Số từ theo tách whitespace: **259**. Đây là bản assistant draft; learner review chưa được suy ra từ yêu cầu chỉnh tài liệu.

## 4. Trạng thái và giới hạn

Đã sửa phương pháp/mapping/tài liệu; chưa chạy lại SUT. 15 WEB case mới cần thực thi và ghi evidence riêng trước khi tuyên bố suite theo slide hoàn thành. Mọi metadata lịch sử không có manifest/transcript đầy đủ vẫn là thông tin kế thừa, chưa xác minh độc lập. Không có lỗi mới của ứng dụng được phát hiện bằng thực thi trong đợt refactor này.
