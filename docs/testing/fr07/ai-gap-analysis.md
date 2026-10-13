# Phân tích Khoảng trống AI & Đánh giá Năng lực (AI Gap Analysis & Critique) - FR-07

## 1. So sánh Đối chiếu Giữa Bản AI Ban đầu & Kết quả Thực tế (Observed Gaps)

Quá trình kiểm thử thực tế chức năng **FR-07 Giỏ hàng** đã ghi nhận và đối chiếu các khoảng trống kỹ thuật (AI Gaps) của mô hình AI khi chuyển giao từ khâu sinh ca kiểm thử sang thực thi và phát hiện lỗi:

| Mã Gap | Tên Khoảng trống Kỹ thuật | Phát hiện tại Bước | Tác động tới Kiểm thử | Biện pháp Khắc phục Thực tế | Trạng thái |
|---|---|---|---|---|---|
| **GAP-01** | Bỏ qua cơ chế mất trạng thái React Context khi Reload trang | Task 5: Web Execution | Khi dùng `page.goto` tải trang mới, giỏ hàng trong RAM bị reset về rỗng, khiến các ca kiểm tra bảng giỏ hàng bị Fail giả định | Hiệu chỉnh runner `run-cart-web.py` sang cơ chế điều hướng client-side SPA thông qua các thẻ liên kết `<Link>` | **Resolved** |
| **GAP-02** | Rủi ro che khuất do lỗi phụ thuộc nút thêm sản phẩm FR-06 | Task 5: Web Execution | Mã nguồn `ProductDetail.jsx` có lỗi cố tình chặn lần click đầu tiên; nếu không tách biệt sẽ làm tê liệt toàn bộ các ca kiểm tra giao diện giỏ hàng | Phân tách: ca kiểm tra thao tác 1 click vẫn ghi nhận Failed do lỗi phụ thuộc; các ca kiểm tra giỏ hàng sử dụng giải pháp bấm bù lần 2 có tài liệu hóa | **Resolved** |
| **GAP-03** | Nguy cơ gộp chung trạng thái lưu trữ giữa tầng API và WEB | Task 4: Deduplication | Backend lưu giỏ theo session `userCarts`, trong khi Web lưu trong React Context. Nếu dùng kết quả API GET để suy diễn trạng thái Web sẽ sai lệch | Duy trì độc lập 8 ca API và 24 ca WEB, không gộp các ca thực thi chéo tầng | **Resolved** |
| **GAP-04** | Nguy cơ nhầm lẫn biến nhị phân Dialog xóa thành BVA | Task 3: BVA Derivation | Thao tác xác nhận xóa (Cancel vs Confirm) chỉ có 2 trạng thái logic categorical, không có quan hệ thứ tự số học | Phân loại chính xác sang Domain Testing (Partition), không ép vào công thức BVA | **Resolved** |
| **GAP-05** | Nguy cơ tự suy diễn cận trên của số lượng (Quantity Max) | Task 1: Requirements | Đặc tả không nêu số lượng tối đa hay giới hạn tồn kho. Nếu AI tự đặt cận trên 99 hay 999 sẽ tạo oracle giả mạo | Đưa vào Sổ đăng ký điểm mơ hồ (AMB-03), không đưa cận trên vào bộ ca chuẩn | **Resolved** |

---

## 2. Phân tích Nguyên nhân Cốt lõi & Mức độ Chắc chắn (Root Cause Analysis)

### 2.1. Nhóm Sự thật Đã được Chứng minh (Evidenced Facts)
- **Fact 1:** SUT có lỗi nghiêm trọng ở cả Backend (`server.js:293`) và Frontend (`CartContext.jsx:9`) khi không thực hiện cộng dồn số lượng mà luôn tạo dòng mới trong mảng, vi phạm trực tiếp quy tắc `FR07-R02`.
- **Fact 2:** Frontend thiếu hoàn toàn nút `+` và `-` tại cột Số lượng (`Cart.jsx:47`), khiến người dùng không thể chỉnh số lượng trên giao diện.
- **Fact 3:** Nút Xóa không có dialog xác nhận (`Cart.jsx:51`), xóa ngay lập tức khi click.
- **Fact 4:** Giao diện sử dụng sai tiêu đề cột ("Giá" thay vì "Đơn giá") và sai nhãn tổng tiền ("Tổng tạm tính:" thay vì "Tổng cộng").

### 2.2. Nhóm Giả thuyết & Giới hạn Công cụ (Hypotheses & Limitations)
- **Hypothesis 1:** AI tạo test case từ văn bản đặc tả ban đầu thường giả định phần mềm tuân thủ các luồng cơ bản (happy path), dễ bỏ qua việc kiểm tra các lỗi ẩn như click đúp mới thêm được hàng.
- **Hypothesis 2:** Việc thiếu slide bài giảng môn học chính thức khiến việc áp dụng BVA phải dựa trên tiêu chuẩn quốc tế ISTQB 3-value làm chuẩn mực tham chiếu, cần sự xác nhận cuối cùng từ giảng viên bộ môn.

---

## 3. Khép kín Vòng Sửa lỗi Khoảng trống (Correction Closure)

- **Vòng lặp khắc phục:**
  1. Phát hiện sự cố mất trạng thái React do `page.goto` $\to$ Cập nhật hàm `navigate_to` và `add_product_to_cart` trong `tests/fr07/run-cart-web.py`.
  2. Tái thực thi toàn bộ suite $\to$ Kết quả chuyển biến từ trạng thái lỗi điều hướng sang phản ánh chính xác 100% các khiếm khuyết thực tế của ứng dụng.
  3. Xác thực bằng chứng: Mọi ca Failed và Blocked đều đi kèm ảnh chụp màn hình UI thực tế và log JSON đầy đủ.
- **Trạng thái phê duyệt:** Trợ lý ảo tự rà soát hoàn tất (Assistant Self-Review Passed); Đang chờ người học nghiệm thu chính thức (Pending Learner Final Review).

---

## 4. Đoạn Nhận xét Phê bình AI (AI Critique: 200–300 Words)

> **Đếm từ (Word count: 267 từ):**

Trong chu trình kiểm thử Giỏ hàng (FR-07), AI mang lại hiệu quả cao trong việc tự động hóa mô hình vị từ toán học, phân tích điểm biên On/Off/In và dẫn xuất các tập lân cận 3-value BVA chuẩn ISTQB. Khả năng thiết lập ma trận truy vết giúp kết nối chặt chẽ giữa đặc tả nghiệp vụ, ca nguồn và 32 ca chuẩn canonical, đồng thời sinh mã harness kiểm thử độc lập cho cả hai tầng API và Web.

Tuy nhiên, quá trình thực thi thực tế bộc lộ ba khoảng trống kỹ thuật lớn của AI. Thứ nhất, AI có xu hướng giả định môi trường lý tưởng, ban đầu không lường trước việc giỏ hàng React lưu trong RAM bị mất khi tải lại trang, buộc phải hiệu chỉnh sang điều hướng client-side SPA. Thứ hai, AI dễ bị che khuất bởi lỗi phụ thuộc ngoại vi; cụ thể là lỗi chặn click lần đầu tại trang chi tiết sản phẩm nếu không được cô lập bằng giải pháp có kiểm soát sẽ làm tê liệt toàn bộ dữ liệu mẫu giỏ hàng. Thứ ba, AI thường có khuynh hướng suy diễn thêm các ranh giới không có trong tài liệu như số lượng tối đa hay tồn kho, đòi hỏi con người phải rà soát nghiêm ngặt nhằm duy trì tính trung thực của oracle. Tóm lại, AI giúp tăng tốc đáng kể khâu sinh ca và chạy test, nhưng sự kiểm soát của con người là bắt buộc để đảm bảo tính khách quan và hợp lệ của bằng chứng.
