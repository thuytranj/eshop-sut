# FR-15 — Kết quả execution và coverage

## 1. Môi trường và lần chạy dùng để kết luận

Kết quả cuối lấy từ **fr15-run03**, bắt đầu 2026-10-15T22:38:05+07:00 và kết thúc 2026-10-15T22:41:51+07:00 theo Asia/Ho_Chi_Minh. Backend chạy tại `/private/tmp/eshop-fr15-run03/backend`, được sao chép nguyên byte từ SUT và dùng SQLite riêng. Fixture được reset trước từng case. Hash của SQLite gốc và suite đã freeze được xác nhận giữ nguyên.

Commit tại lúc bắt đầu là `5f9c73bf093c47e58188b46d20514b71149fb461`. Các thay đổi harness chưa commit lúc đó có hash riêng trong [manifest](evidence/fr15-run03/manifest.json), giúp xác định đúng bản đã chạy. Phiên bản Chromium, locale và viewport nằm trong [browser metadata](evidence/fr15-run03/web/browser.json).

Run01 và run02 chỉ là lịch sử. Run01 có race khi lấy DOM trước khi fetchData hoàn tất, chẳng hạn TC069. Run02 còn thiếu assertion về nguồn ảnh và chưa kết luận đúng bốn ca 0.5. Run03 đã sửa các điểm này, bổ sung evidence từ chối rõ ràng và chạy lại toàn suite. Raw evidence cũ được giữ nguyên; không cộng kết quả nhiều run để tăng số test case.

## 2. Thống kê test case duy nhất

| Chỉ số | Số lượng |
|---|---|
| Đã thiết kế (canonical) | 158 |
| Đã attempt | 158 |
| Đã có verdict: Passed + Failed | 151 |
| Passed | 56 |
| Failed | 95 |
| Blocked | 7 |
| Not Run | 0 |

151 ca có oracle đã nhận verdict. Bảy ca Blocked là Supplementary đã có quan sát nhưng thiếu oracle; không có blocker môi trường. Vì vậy, toàn bộ 158 ca đã được attempt, nhưng chỉ 151 ca được tính vào số đã có kết luận. Số chưa thể kết luận là Blocked + Not Run = 7.

`run-all` trả exit code 2 do còn các probe unresolved; điều này không có nghĩa SUT đã pass. Tách biệt với kết quả SUT, 18 kiểm tra harness và kiểm tra hồi quy đồng bộ UI bằng Chromium đều đạt.

| Tầng | Đã thiết kế | Passed | Failed | Blocked | Not Run |
|---|---|---|---|---|---|
| API | 97 | 36 | 54 | 7 | 0 |
| WEB | 61 | 20 | 41 | 0 | 0 |

## 3. Cách tính coverage và giới hạn

Obligation Domain Testing gắn với điểm, mặt biên, giao điểm hoặc partition thao tác/trạng thái đã liệt kê. Obligation BVA gắn với giá trị, thao tác, tầng và universe cụ thể. Supplementary được thống kê riêng, không cộng vào mẫu số DT/BVA.

Coverage thiết kế là số obligation đã có case chia cho số obligation xác định. Coverage thực thi là số obligation đã được exercise chia cho cùng mẫu số. Test Failed vẫn có thể exercise một obligation; vì vậy coverage không phải pass rate.

| Technique / tầng | Obligation xác định | Đã có case | Đã exercise |
|---|---|---|---|
| Domain Testing/API | 88 | 88/88 | 88/88 |
| Domain Testing/WEB | 55 | 55/55 | 55/55 |
| BVA/API | 22 | 22/22 | 22/22 |
| BVA/WEB | 22 | 22/22 | 22/22 |
| Supplementary/API | 9 | 9/9 | 2/9 |
| Supplementary/WEB | 2 | 2/2 | 2/2 |

Trong phạm vi hữu hạn đã xác định, DT đạt 143/143 obligation thiết kế và thực thi; BVA đạt 44/44, gồm 28 cho tên ASCII và 16 cho giá trên lát cắt Z. Đây không phải bằng chứng kiểm hết toàn miền input hoặc chứng nhận FR-15 đúng hoàn toàn. Precision toàn miền giá, đơn vị đếm Unicode, response contract của ID vắng và việc xóa sản phẩm đã được tham chiếu còn có giới hạn chưa giải quyết.

Input dự định và input thực tế của WEB được ghi riêng trong `inputIntended`/`inputEffective`. Tên rỗng được HTML required chặn trên UI và không có mutation request; điều đó không chứng minh backend đã validate, nên API có ca riêng. Không tính khác biệt numeric string là bug chỉ vì kiểu JSON khác nhau. Không dùng input bị truncate để khẳng định giá trị ban đầu đã đến API.

Bốn ca 0.5 có oracle rõ ràng và đã exercise: API Create/Update cùng WEB Create đều Passed; WEB Update lưu đúng 0.5 nhưng UI tức thời sai, thuộc BUG-004. Các ca này giữ nhãn Supplementary. Kiểm tra auth chỉ bao phủ product C/U/D, không phải toàn bộ FR-12.

## 4. Cách đọc kết quả từng case

Preconditions, fixture, input và steps đầy đủ được lưu theo ID trong [suite đã freeze](../../../tests/fr15/suite.json). Mỗi link evidence dưới đây dẫn tới record chứa actual request/response, stateBefore/stateAfter, API readback và UI trước/sau reload.

`rules` trong ca nguồn cho biết trọng tâm thiết kế; `stateContract` còn bao gồm hậu điều kiện CRUD và R08 cho Update. Do đó, ca tập trung vào R05/R06 vẫn có thể thất bại ở assertion R08 khi UI làm đổi sản phẩm khác.

Các mã assertion trong raw record được diễn giải như sau:

| Mã assertion | Ý nghĩa khi assertion thất bại |
|---|---|
| `rejected-state-unchanged` | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối |
| `rejection-signaled` | Không có phản hồi từ chối phù hợp |
| `ui-immediate-correct` | UI ngay sau thao tác không khớp trạng thái kỳ vọng |
| `ui-reload-correct` | UI sau reload không khớp trạng thái kỳ vọng |

### Kết quả tầng API

| ID | Thao tác | Rule | Technique | Fixture | Expected result | Actual result | Trạng thái | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR15-TC-001 | Create | FR15-R01 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-001.json) |
| FR15-TC-002 | Create | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-002.json) |
| FR15-TC-003 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-003.json) |
| FR15-TC-004 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-004.json) |
| FR15-TC-005 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-005.json) |
| FR15-TC-006 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-006.json) |
| FR15-TC-007 | Create | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-007.json) |
| FR15-TC-008 | Create | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-008.json) |
| FR15-TC-009 | Create | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-009.json) |
| FR15-TC-010 | Create | FR15-R06 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-010.json) |
| FR15-TC-011 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-011.json) |
| FR15-TC-012 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-012.json) |
| FR15-TC-013 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-013.json) |
| FR15-TC-014 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-014.json) |
| FR15-TC-015 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-015.json) |
| FR15-TC-016 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-016.json) |
| FR15-TC-017 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-017.json) |
| FR15-TC-018 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-018.json) |
| FR15-TC-019 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-019.json) |
| FR15-TC-020 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001, FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-020.json) |
| FR15-TC-021 | Create | FR15-R07 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-021.json) |
| FR15-TC-022 | Create | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-022.json) |
| FR15-TC-023 | Create | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-023.json) |
| FR15-TC-024 | Create | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-024.json) |
| FR15-TC-025 | Create | FR15-R05 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-025.json) |
| FR15-TC-026 | Create | FR15-R05 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-026.json) |
| FR15-TC-027 | Create | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-027.json) |
| FR15-TC-028 | Create | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-028.json) |
| FR15-TC-029 | Create | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-029.json) |
| FR15-TC-030 | Create | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-030.json) |
| FR15-TC-031 | Create | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-031.json) |
| FR15-TC-032 | Create | FR15-R06 | Supplementary | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-032.json) |
| FR15-TC-033 | Create | FR15-R05 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi; thiếu quy tắc trim khoảng trắng. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-033.json) |
| FR15-TC-034 | Create | FR15-R05 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi; thiếu đơn vị đếm Unicode. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-034.json) |
| FR15-TC-035 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-035.json) |
| FR15-TC-036 | Update | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-036.json) |
| FR15-TC-037 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-037.json) |
| FR15-TC-038 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-038.json) |
| FR15-TC-039 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-039.json) |
| FR15-TC-040 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-040.json) |
| FR15-TC-041 | Update | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-041.json) |
| FR15-TC-042 | Update | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-042.json) |
| FR15-TC-043 | Update | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-043.json) |
| FR15-TC-044 | Update | FR15-R06 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-044.json) |
| FR15-TC-045 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-045.json) |
| FR15-TC-046 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-046.json) |
| FR15-TC-047 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-047.json) |
| FR15-TC-048 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-048.json) |
| FR15-TC-049 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-049.json) |
| FR15-TC-050 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-050.json) |
| FR15-TC-051 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-051.json) |
| FR15-TC-052 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-052.json) |
| FR15-TC-053 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-053.json) |
| FR15-TC-054 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001, FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-054.json) |
| FR15-TC-055 | Update | FR15-R07 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-055.json) |
| FR15-TC-056 | Update | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-056.json) |
| FR15-TC-057 | Update | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-057.json) |
| FR15-TC-058 | Update | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-058.json) |
| FR15-TC-059 | Update | FR15-R05 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-059.json) |
| FR15-TC-060 | Update | FR15-R05 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-060.json) |
| FR15-TC-061 | Update | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-061.json) |
| FR15-TC-062 | Update | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/api/FR15-TC-062.json) |
| FR15-TC-063 | Update | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-063.json) |
| FR15-TC-064 | Update | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-064.json) |
| FR15-TC-065 | Update | FR15-R07 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-065.json) |
| FR15-TC-066 | Update | FR15-R06 | Supplementary | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-066.json) |
| FR15-TC-067 | Update | FR15-R05 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi; thiếu quy tắc trim khoảng trắng. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-067.json) |
| FR15-TC-068 | Update | FR15-R05 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi; thiếu đơn vị đếm Unicode. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-068.json) |
| FR15-TC-115 | Read | FR15-R02 | Domain Testing | empty-products | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-115.json) |
| FR15-TC-116 | Read | FR15-R02 | Domain Testing | baseline | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-116.json) |
| FR15-TC-117 | Read | FR15-R02 | Domain Testing | baseline | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-117.json) |
| FR15-TC-118 | Read | FR15-R02 | Domain Testing | baseline | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-118.json) |
| FR15-TC-119 | Delete | FR15-R04 | Domain Testing | baseline | Xóa đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-119.json) |
| FR15-TC-120 | Delete | FR15-R04 | Domain Testing | single-product | Xóa đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-120.json) |
| FR15-TC-121 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-121.json) |
| FR15-TC-122 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-122.json) |
| FR15-TC-123 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-123.json) |
| FR15-TC-124 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-124.json) |
| FR15-TC-125 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-125.json) |
| FR15-TC-126 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-126.json) |
| FR15-TC-137 | Create | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-137.json) |
| FR15-TC-138 | Create | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-138.json) |
| FR15-TC-139 | Create | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-139.json) |
| FR15-TC-140 | Update | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-140.json) |
| FR15-TC-141 | Update | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-141.json) |
| FR15-TC-142 | Update | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-142.json) |
| FR15-TC-143 | Delete | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-143.json) |
| FR15-TC-144 | Delete | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-144.json) |
| FR15-TC-145 | Delete | FR12-DEP-WRITE | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-005 | [Record](evidence/fr15-run03/api/FR15-TC-145.json) |
| FR15-TC-147 | Create | FR15-R07 | Domain Testing | empty-categories | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/api/FR15-TC-147.json) |
| FR15-TC-148 | Read | FR15-R02 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi với ID vắng; thiếu response contract để kết luận. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-148.json) |
| FR15-TC-149 | Update | FR15-R03 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi với ID vắng; thiếu response contract để kết luận. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-149.json) |
| FR15-TC-150 | Delete | FR15-R04 | Supplementary | baseline | Ghi nhận hành vi; chưa đủ oracle để kết luận. | Đã ghi hành vi với ID vắng; thiếu response contract để kết luận. | Blocked | — | [Record](evidence/fr15-run03/api/FR15-TC-150.json) |
| FR15-TC-151 | Create | FR15-R05 | BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-151.json) |
| FR15-TC-152 | Create | FR15-R06 | BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-152.json) |
| FR15-TC-153 | Update | FR15-R05 | BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/api/FR15-TC-153.json) |
| FR15-TC-154 | Update | FR15-R06 | BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/api/FR15-TC-154.json) |

### Kết quả tầng WEB

| ID | Thao tác | Rule | Technique | Fixture | Expected result | Actual result | Trạng thái | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR15-TC-069 | Create | FR15-R01 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-069.json) |
| FR15-TC-070 | Create | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-070.json) |
| FR15-TC-071 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-071.json) |
| FR15-TC-072 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-072.json) |
| FR15-TC-073 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-073.json) |
| FR15-TC-074 | Create | FR15-R05 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-074.json) |
| FR15-TC-075 | Create | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-075.json) |
| FR15-TC-076 | Create | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-076.json) |
| FR15-TC-077 | Create | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-077.json) |
| FR15-TC-078 | Create | FR15-R06 | Domain Testing, BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-078.json) |
| FR15-TC-079 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-079.json) |
| FR15-TC-080 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-080.json) |
| FR15-TC-081 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-081.json) |
| FR15-TC-082 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-082.json) |
| FR15-TC-083 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-083.json) |
| FR15-TC-084 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-084.json) |
| FR15-TC-085 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-085.json) |
| FR15-TC-086 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-086.json) |
| FR15-TC-087 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-087.json) |
| FR15-TC-088 | Create | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001, FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-088.json) |
| FR15-TC-089 | Create | FR15-R07 | Domain Testing | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-089.json) |
| FR15-TC-090 | Create | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-090.json) |
| FR15-TC-091 | Create | FR15-R06 | Supplementary | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-091.json) |
| FR15-TC-092 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-092.json) |
| FR15-TC-093 | Update | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-093.json) |
| FR15-TC-094 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-094.json) |
| FR15-TC-095 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-095.json) |
| FR15-TC-096 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-096.json) |
| FR15-TC-097 | Update | FR15-R05 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-097.json) |
| FR15-TC-098 | Update | FR15-R05 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-098.json) |
| FR15-TC-099 | Update | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-099.json) |
| FR15-TC-100 | Update | FR15-R06 | Domain Testing, BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-100.json) |
| FR15-TC-101 | Update | FR15-R06 | Domain Testing, BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-101.json) |
| FR15-TC-102 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-102.json) |
| FR15-TC-103 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-103.json) |
| FR15-TC-104 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-104.json) |
| FR15-TC-105 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-105.json) |
| FR15-TC-106 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-106.json) |
| FR15-TC-107 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-107.json) |
| FR15-TC-108 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-108.json) |
| FR15-TC-109 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-109.json) |
| FR15-TC-110 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-110.json) |
| FR15-TC-111 | Update | FR15-R05, FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001, FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-111.json) |
| FR15-TC-112 | Update | FR15-R07 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-112.json) |
| FR15-TC-113 | Update | FR15-R06 | Domain Testing | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-002 | [Record](evidence/fr15-run03/web/FR15-TC-113.json) |
| FR15-TC-114 | Update | FR15-R06 | Supplementary | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-114.json) |
| FR15-TC-127 | Read | FR15-R02 | Domain Testing | empty-products | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-127.json) |
| FR15-TC-128 | Read | FR15-R02 | Domain Testing | baseline | Đọc đúng dữ liệu; không thay đổi CSDL. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-128.json) |
| FR15-TC-129 | Delete | FR15-R04 | Domain Testing | baseline | Xóa đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-129.json) |
| FR15-TC-130 | Delete | FR15-R04 | Domain Testing | single-product | Xóa đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-130.json) |
| FR15-TC-131 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-131.json) |
| FR15-TC-132 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-132.json) |
| FR15-TC-133 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-133.json) |
| FR15-TC-134 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-134.json) |
| FR15-TC-135 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-135.json) |
| FR15-TC-136 | Update | FR15-R03, FR15-R08 | Domain Testing | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-136.json) |
| FR15-TC-146 | Create | FR15-R07 | Domain Testing | empty-categories | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-003 | [Record](evidence/fr15-run03/web/FR15-TC-146.json) |
| FR15-TC-155 | Create | FR15-R05 | BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-155.json) |
| FR15-TC-156 | Create | FR15-R06 | BVA | baseline | Thêm đúng một sản phẩm; giữ nguyên các bản ghi khác. | Các assertion đều đạt. | Passed | — | [Record](evidence/fr15-run03/web/FR15-TC-156.json) |
| FR15-TC-157 | Update | FR15-R05 | BVA | baseline | Từ chối thao tác; dữ liệu giữ nguyên. | Dữ liệu vẫn bị thay đổi dù thao tác phải bị từ chối; Không có phản hồi từ chối phù hợp; UI ngay sau thao tác không khớp trạng thái kỳ vọng; UI sau reload không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-001 | [Record](evidence/fr15-run03/web/FR15-TC-157.json) |
| FR15-TC-158 | Update | FR15-R06 | BVA | baseline | Cập nhật đúng sản phẩm được chọn; giữ nguyên các sản phẩm khác. | UI ngay sau thao tác không khớp trạng thái kỳ vọng. | Failed | FR15-BUG-004 | [Record](evidence/fr15-run03/web/FR15-TC-158.json) |

## 5. Các ca Blocked và việc cần làm tiếp

Bảy ca Blocked gồm bốn probe tên whitespace/Unicode ở API Create/Update và ba probe ID vắng ở API Read/Update/Delete. Hành vi thực tế đã được ghi; chưa đủ oracle nên không gán Pass/Fail. Để kết luận, cần bổ sung quy tắc trim, đơn vị đếm Unicode và response contract cho ID vắng, sau đó version model/suite và chạy lại các ca liên quan. Precision toàn miền giá vẫn là giới hạn của BVA, nhưng không làm mất oracle chấp nhận 0.5.

Review kỹ thuật của người học đang chờ. Các Failed được liên kết với năm nhóm trong [bugs.md](bugs.md): bốn nhóm validation/hiển thị của FR-15 và một dependency FR-12. Cách nhóm dựa trên rule bị vi phạm, không khẳng định UI và backend có cùng một nguyên nhân trong code. Chưa publish GitHub Issues.
