# Phân tích Khoảng cách và Đánh giá Năng lực AI (AI Gap Analysis & Critique) - FR-03

## 1. Cơ sở và Bằng chứng Thực tế (Evidence-Based Grounding)

Báo cáo phân tích này được xây dựng dựa trên các bằng chứng thực nghiệm thu thập xuyên suốt quy trình 7 giai đoạn kiểm thử FR-03, đối chiếu giữa:
- **Đầu ra ban đầu của AI (Initial AI Generation):** Các phản hồi và kế hoạch sơ khởi do AI đề xuất.
- **Chỉ đạo hiệu chỉnh của Người học (Learner Directives):** Các yêu cầu can thiệp thực tế từ người học (bổ sung BVA, tách riêng khâu review/deduplication, giải thích chi tiết từng bước dẫn xuất thay vì chỉ xuất bảng ca kiểm thử, và sử dụng hoàn toàn tiếng Việt).
- **Kết quả thực thi thực tế (Actual Execution & Defect Observations):** Các khiếm khuyết được phát hiện trên mã nguồn và giao diện người dùng.

---

## 2. Các Khoảng cách và Lỗ hổng Đã Xác định (Identified AI Testing Gaps)

| Mã Lỗ hổng | Bản chất Lỗ hổng / Bỏ sót của AI | Yêu cầu / Kỹ thuật bị Ảnh hưởng | Bằng chứng Phát hiện | Biện pháp Khắc phục Đã Áp dụng | Trạng thái |
|:---:|---|---|---|---|:---:|
| **GAP-01** | **Bỏ sót kỹ thuật BVA độc lập:** Kế hoạch ban đầu của AI chỉ tập trung vào Domain Testing, thiếu bước dẫn xuất BVA 3 giá trị theo chuẩn môn học. | Toàn bộ FR-03 / BVA (3-value ISTQB) | Chỉ đạo của người học tại phiên lập kế hoạch (`docs/superpowers/plans/2026-10-12-fr03-domain-testing.md`). | Mở rộng quy trình thêm Task 3 để dẫn xuất độc lập 25 nghĩa vụ BVA trước khi tổng hợp. | **Đã khắc phục** |
| **GAP-02** | **Cộng cơ học số lượng ca kiểm thử:** Nguy cơ AI cộng dồn số lượng ca của DT (34 ca) và BVA (25 ca) thành 59 ca, gây sai lệch thống kê độ bao phủ. | Thống kê Suite / Deduplication | Phân tích tại Task 4 (`suite-review.md`). | Thiết lập Task 4 hợp nhất theo kịch bản thực thi, loại bỏ trùng thừa, chuẩn hóa thành 52 ca duy nhất với ma trận ánh xạ đa-đa. | **Đã khắc phục** |
| **GAP-03** | **Bỏ qua hiện tượng che khuất lỗi (Masking) ở BVA:** Xu hướng coi việc từ chối mật khẩu độ dài 0 (`""`) hoặc 1 (`"A"`) là kiểm thử cô lập được riêng chiều độ dài. | BVA Password Length (Endpoints 0, 1) | Phân tích lý thuyết vị từ tại Task 3 (`bva-report.md`). | Ghi chú minh bạch: Độ dài 0 và 1 vi phạm đồng thời cả 4 lớp ký tự; kết quả từ chối phản ánh vi phạm liên hợp. | **Đã khắc phục** |
| **GAP-04** | **Giả định trước sự tồn tại của trường UI:** Nguy cơ AI tự động chạy các ca kiểm tra lệch xác nhận mật khẩu (mismatch) và báo Pass/Fail mà không kiểm tra xem trường input có thực sự tồn tại trong DOM hay không. | R08 / Domain Testing (WEB Confirmation) | Thực thi `FR03-TC-044` tại Task 5 phát hiện form Bước 2 hoàn toàn không có trường Confirm Password. | Đánh dấu `FR03-TC-044` là Failed (Lỗi yêu cầu), và đánh dấu đúng đắn 5 ca phụ thuộc (`FR03-TC-039..043`) là `Blocked` thay vì báo Pass ảo. | **Đã khắc phục** |
| **GAP-05** | **Nhầm lẫn biến danh mục/phân loại với BVA số học:** Xu hướng áp dụng máy móc BVA lên các thuộc tính như Email tồn tại/không tồn tại hoặc Token khớp/lệch sở hữu. | Phương pháp luận BVA vs. Domain Testing | Rà soát phân loại tại Task 3 và Task 4. | Tách bạch triệt để: BVA chỉ áp dụng trên các chiều số nguyên có thứ tự $\mathbb{N}_0$. Các biến danh mục thuộc về Domain Testing. | **Đã khắc phục** |

---

## 3. Bản Đánh giá Năng lực và Hạn chế của AI (AI Critique: 200–300 Words)

> **Bản Đánh giá Năng lực AI trong Kiểm thử Phần mềm (200–300 từ):**
> 
> Trong quá trình kiểm thử tính năng Quên và Đặt lại Mật khẩu (FR-03), việc ứng dụng AI mang lại hiệu suất vượt trội trong việc tự động hóa các tác vụ lặp lại, đặc biệt là khả năng sinh mã kiểm thử Playwright, kịch bản API tự động với SQLite độc lập, và rà soát logic mã nguồn để xác định chính xác nguyên nhân gốc của 6 lỗi phần mềm. AI hỗ trợ tốt trong việc hình thức hóa các biểu thức toán học và thiết lập ma trận truy vết yêu cầu (Traceability Matrix).
> 
> Tuy nhiên, quá trình kiểm thử thực tế đã bộc lộ những hạn chế cố hữu của AI nếu thiếu sự định hướng nghiêm ngặt từ con người:
> 1. **Thiên kiến giả định tính toàn vẹn (Completeness Bias):** AI có xu hướng mặc định giao diện người dùng đã được hiện thực hóa đầy đủ theo đặc tả. Cụ thể, nếu không có quy tắc kiểm tra sự hiện diện của phần tử DOM trước, AI rất dễ tạo ra các ca kiểm thử so khớp mật khẩu ảo trên một trường dữ liệu vốn không hề tồn tại trên giao diện.
> 2. **Lạm dụng và nhầm lẫn phương pháp luận:** AI có khuynh hướng áp dụng cơ học kỹ thuật Phân tích Giá trị Biên (BVA) lên cả các biến danh mục không có thứ tự số học (như email hay token binding), đồng thời dễ bỏ qua hiện tượng che khuất lỗi (masking) ở các điểm biên 0 và 1.
> 3. **Nguy cơ sai lệch thống kê:** AI dễ cộng gộp cơ học số ca kiểm thử từ nhiều kỹ thuật khác nhau thay vì chuẩn hóa theo kịch bản thực thi duy nhất.
> 
> Tóm lại, AI là công cụ gia tốc kiểm thử vô cùng mạnh mẽ nhưng chỉ đạt được độ tin cậy và chuẩn mực học thuật khi được kiểm soát bởi quy trình kỹ thuật chặt chẽ và sự giám sát phản biện của con người. *(292 từ)*

---

## 4. Giới hạn Nhật ký và Khẳng định Tính Minh bạch (Audit Limitations)

1. **Phân định Người học và AI:** Mọi nhận định, rà soát và đánh giá trong báo cáo này phản ánh quá trình làm việc giữa Người học (Learner) và Trợ lý AI trong phiên làm việc hiện tại. Phần đánh giá chính thức của Người học (Learner Review) sẽ được hoàn thiện khi người học trực tiếp nghiệm thu và ký xác nhận nộp bài.
2. **Bảo tồn SUT:** Quá trình kiểm thử tuyệt đối không can thiệp, chỉnh sửa mã nguồn ứng dụng hay CSDL gốc `backend/database.sqlite`. Toàn bộ 20 sai khác quan sát được đều là sản phẩm bàn giao kiểm thử (Testing Deliverables).
