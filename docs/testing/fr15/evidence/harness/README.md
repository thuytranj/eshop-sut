# Evidence kiểm chứng harness FR-15

Các log trong thư mục này ghi kiểm tra **harness**, không phải verdict của test case Product CRUD. Failed có chủ đích trong log RED chứng minh kiểm tra bắt được hành vi còn thiếu hoặc fixture sai; các log GREEN ghi trạng thái sau sửa.

## 1. Trước execution và sau review cuối

- `task5-red.log`, `runner-red.log`: kiểm tra thất bại khi phần chuẩn bị môi trường, assertion hoặc điều phối chưa đủ hành vi.
- `png-red.log`: tái hiện CRC sai của ảnh fixture.
- `readback-red.log`: tái hiện việc thiếu assertion API readback.
- `task5-green.log`: 15 kiểm tra đạt ở giai đoạn trước review cuối.
- `prepare-self-check.log`, `fixture-self-check.log`: kết quả self-check của các helper tại giai đoạn đó.
- `final-review-red.log`: ba kiểm tra hồi quy mới thất bại trước khi sửa.
- `final-review-green.log`: 18 kiểm tra đạt sau khi xử lý review và oracle 0.5.

Kiểm tra đồng bộ UI từng thất bại do thiếu hành vi chờ, sau đó đạt trên Chromium với DOM cập nhật trễ qua lệnh `node tests/fr15/run-all.cjs --ui-self-check`. Output của lệnh nằm trong chat; không dựng lại một log lịch sử không được lưu.

## 2. Vai trò của các run

Run01 là bản ban đầu có race khi lấy DOM sau lưu; screenshot chụp sau có thể phản ánh trạng thái mới hơn snapshot. Run02 thêm chờ API yên lặng 500ms và hai animation frames. Sau review, run03 tiếp tục bổ sung kiểm nguồn ảnh và evidence từ chối, đồng thời sửa bốn oracle giá 0.5. Vì vậy, chỉ run03 được dùng cho verdict cuối; các run cũ giữ nguyên để audit.

Backend bản sao giữ nguyên byte nguồn và chỉ reset fixture sau startup. Không có sửa SUT trong các bước này. Test case Product CRUD Failed thể hiện discrepancy cần báo cáo; không được sửa logic ứng dụng để làm test xanh trong yêu cầu kiểm thử.

`preservation.json` lưu hash trước/sau của SQLite gốc và các file có thay đổi sẵn. Thời điểm lịch sử chưa được ghi vẫn để unknown; audit công khai capture partial.
