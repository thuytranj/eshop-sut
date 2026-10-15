# FR-15 — Áp dụng Domain Testing từng bước

## Bước 1. Chuyển requirement thành predicate

Test basis và các điểm chưa rõ được trình bày trong [requirements.md](requirements.md). Với payload có đủ field và đúng dạng, xác định:

- N := 1≤L≤255: tên không rỗng và không vượt 255 ký tự.
- P := p>0: giá dương.
- C := c∈Categories: danh mục tồn tại.
- A := JWT hợp lệ ∧ role=admin: có quyền ghi.
- E := sản phẩm được chọn tồn tại.

Miền chấp nhận Create là D_Create=A∧N∧P∧C. Update có thêm E: D_Update=A∧N∧P∧C∧E. Miền bù của Create là ¬A∨¬N∨¬P∨¬C; Update có thêm ¬E. Các trường hợp thiếu field, null hoặc sai kiểu nằm ngoài lát cắt chính và được xét riêng.

Read phân biệt danh sách rỗng/có dữ liệu và ID tồn tại/không tồn tại. Delete phân biệt xóa trong tập nhiều sản phẩm và xóa sản phẩm cuối. Không áp các predicate N/P của body Create/Update cho Read/Delete.

## Bước 2. Phân hoạch miền và xác định biên

| Chiều | Các partition | Biên hoặc cách chọn đại diện |
|---|---|---|
| Độ dài tên | {0}: không hợp lệ; [1,255]: hợp lệ; [256,∞): không hợp lệ | L=1 và L=255 là biên thuộc miền hợp lệ |
| Giá | p≤0: không hợp lệ; p>0: hợp lệ | Mặt p=0 bị loại do bất đẳng thức nghiêm |
| Danh mục | Tồn tại; không tồn tại; thiếu/null | Đại diện 10/20 hợp lệ, 15 không tồn tại; không có biên số theo ID |
| Quyền truy cập | admin; user; không token; token lỗi | Categorical partition, không dùng On/Off số học |

Các mặt biên tên và giá độc lập theo đặc tả. Không tự tạo điều kiện liên biến như L+p=k hoặc xem mọi ID từ 10 đến 20 đều hợp lệ.

## Bước 3. Chọn điểm In và dữ liệu đối chứng

Điểm In là (L=128,p=100000,c=10,admin), với target tồn tại khi Update. A=101 là sản phẩm được sửa; B/C làm đối chứng. Ca sửa B=202 dùng A/C làm đối chứng. Fixture được reset trước mỗi case để kết quả không phụ thuộc thứ tự chạy.

Tên, giá và mô tả của A/B/C khác nhau. `description` và `imageUrl` giữ nominal, trừ các ca sửa riêng từng field. Input và các bước đầy đủ được lưu theo ID trong source-cases.json. Độ dài tên chính chỉ dùng ASCII; cách đếm code point, UTF-16 hay grapheme của Unicode vẫn chưa được đặc tả.

## Bước 4. Chọn On/Off/In và đánh giá predicate

Tại L=1, điểm On được chấp nhận; hai điểm Off là 0 và 2. Tại L=255, On được chấp nhận; Off là 254 và 256. Tại p=0, On bị từ chối; -1 và +1 là hai mẫu biểu diễn được ở hai phía trên lát cắt số nguyên. Không gọi chúng là neighbor gần nhất của toàn miền giá khi precision chưa rõ.

Bảng dưới giữ C=A=true và E=true cho Update. Mỗi verdict được suy ra từ N∧P, không suy từ tên gọi On/Off.

| L | p | N | P | C | A | Create | Update E=true | Vai trò |
|---|---|---|---|---|---|---|---|---|
| 128 | 100000 | true | true | true | true | Chấp nhận | Chấp nhận | In |
| 0 | 100000 | false | true | true | true | Từ chối | Từ chối | Off ngoài biên dưới |
| 1 | 100000 | true | true | true | true | Chấp nhận | Chấp nhận | On biên dưới |
| 2 | 100000 | true | true | true | true | Chấp nhận | Chấp nhận | Off trong biên dưới |
| 254 | 100000 | true | true | true | true | Chấp nhận | Chấp nhận | Off trong biên trên |
| 255 | 100000 | true | true | true | true | Chấp nhận | Chấp nhận | On biên trên |
| 256 | 100000 | false | true | true | true | Từ chối | Từ chối | Off ngoài biên trên |
| 128 | -1 | true | false | true | true | Từ chối | Từ chối | Off phía giá không hợp lệ |
| 128 | 0 | true | false | true | true | Từ chối | Từ chối | On biên giá bị loại |
| 128 | 1 | true | true | true | true | Chấp nhận | Chấp nhận | Off phía giá hợp lệ |
| 254 | 1 | true | true | true | true | Chấp nhận | Chấp nhận | Mẫu tách biệt / giao điểm |
| 255 | 1 | true | true | true | true | Chấp nhận | Chấp nhận | Mẫu tách biệt / giao điểm |
| 256 | 1 | false | true | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 1 | -1 | true | false | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 1 | 0 | true | false | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 1 | 1 | true | true | true | true | Chấp nhận | Chấp nhận | Mẫu tách biệt / giao điểm |
| 255 | -1 | true | false | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 255 | 0 | true | false | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 0 | 1 | false | true | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |
| 256 | 0 | false | false | true | true | Từ chối | Từ chối | Mẫu tách biệt / giao điểm |



## Bước 5. Lấy mẫu trên biên, giao điểm và cô lập lỗi

Mặt L=255 được lấy mẫu ở p=1 và p=100000; tại mỗi mức giá xét L=254/255/256. Mặt p=0 được lấy mẫu ở L=1/128/255 rồi đổi p sang -1/0/1. Việc giữ C/A/E hợp lệ giúp tránh trường hợp một rule khác che khuất rule đang kiểm.

Các điểm (1,0) và (255,0) bị từ chối do P; (1,1) và (255,1) được chấp nhận; (0,1) và (256,1) bị từ chối do N. Điểm (256,0) vi phạm cả hai rule, chỉ bổ sung interaction coverage. Các mẫu hữu hạn này không chứng minh đã kiểm hết miền liên tục hoặc mọi dạng biên sai lệch.

## Bước 6. Bổ sung miền thao tác và trạng thái CRUD

- Create: thêm đúng một bản ghi và đọc lại được dữ liệu.
- Read: đối chiếu danh sách/chi tiết với snapshot.
- Update: kiểm dữ liệu của target, mọi field của sản phẩm khác qua API/DB và các field đang hiển thị trên UI ngay sau lưu, rồi sau reload. Ca sửa riêng từng field còn kiểm các field còn lại của target.
- Delete: xóa đúng target trong danh sách nhiều sản phẩm và khi chỉ còn sản phẩm cuối.

Validation được thiết kế riêng cho Create/Update và API/WEB. Những input không thể tạo qua UI bình thường, như omitted/null, được gửi ở tầng API. Danh sách danh mục rỗng được kiểm trên cả API và WEB. Các ca chọn danh mục 20 tránh chỉ kiểm giá trị nominal 10. Quyền ghi được kiểm bằng ba partition không có quyền cho từng thao tác C/U/D của API.

## Bước 7. Liên kết nghĩa vụ kiểm thử và coverage

Mỗi obligation trong obligations.json có ID, sourceCaseId, technique, tầng, thao tác, rule và lý do chọn điểm. [domain-cases.md](domain-cases.md) trình bày ca nguồn; [suite-review.md](suite-review.md) liên kết sang canonical case sau deduplicate.

Tại thời điểm thiết kế, các ca đều Not Run. Coverage thiết kế là số obligation đã có case chia cho số obligation xác định; coverage thực thi phải lấy từ observations, không suy từ predicate kỳ vọng. Các probe thiếu oracle về trim/Unicode và ID vắng được ghi riêng. Bốn ca giá 0.5 đã có oracle chấp nhận theo R06 sau hiệu chỉnh v3; chúng giữ nhãn Supplementary và không làm thay đổi mẫu số DT/BVA.

Phương pháp On/Off/In là fallback khi chưa có slide của lớp. Review kỹ thuật của người học đang chờ. Kết quả và coverage cuối cùng xem [test-results.md](test-results.md).
