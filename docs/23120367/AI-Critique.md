# Báo cáo Phản biện Trí tuệ Nhân tạo (AI Critique Report)
## Môn học: Kiểm thử Phần mềm (Software Testing) — Bài tập HW03: GUI & Usability Testing
**Hệ thống thực nghiệm (SUT)**: EShop E-Commerce System  
**Học viên thực hiện**: Trần Ngọc Diễm Thúy — **MSSV**: `23120367`  
**Email sinh viên**: `23120367@student.hcmus.edu.vn`  
**Mã bài tập**: `HW03-AI` | **Cấp độ Bloom-AI**: `G9.3 (Analyse)` & `G9.4 (Collaborate)`

---

## 1. Mandatory AI Critique

Trong quá trình xây dựng bộ GUI checklist và thực thi kiểm thử cho hệ thống EShop, mô hình AI đã bộc lộ những thiên kiến nhận thức rõ rệt cùng nhiều điểm mù nghiêm trọng. Cụ thể, AI hoàn toàn phụ thuộc vào văn bản đặc tả chức năng tĩnh (README) và giả định một môi trường thực thi hoàn hảo (localhost không trễ mạng), dẫn đến việc bỏ sót toàn bộ các tình huống tương tác người dùng trong thế giới thực. AI đã không lường trước được hiện tượng mất ký tự do xung đột sự kiện `composition` của bộ gõ tiếng Việt Telex/VNI (`GUI-065`), lỗi vỡ phép tính sinh giá trị `NaN` khi người dùng xóa trắng ô số lượng (`GUI-068`), nguy cơ gửi request trùng lặp dồn dập khi thiếu cơ chế debounce (`GUI-070`), cũng như vi phạm tiêu chuẩn tiếp cận W3C/WCAG do thiếu nhãn `aria-label` cho Screen Reader (`GUI-066`) và diện tích chạm cảm ứng dưới 44×44px trên thiết bị di động (`GUI-069`). Sở dĩ AI thất bại là vì các mô hình ngôn ngữ lớn thiếu nhận thức cảm quan đa phương thức trong môi trường vật lý (xúc giác ngón tay, âm thanh đọc màn hình) và tư duy theo chuỗi sự kiện đơn lẻ tuần tự thay vì trạng thái tương tác phức tạp của con người. Bài học nguyên tắc cốt lõi rút ra trong việc cộng tác với AI (theo cấp độ Bloom-AI G9.3 và G9.4) là: **AI chỉ đóng vai trò như một động cơ tăng tốc gợi ý khung sườn ban đầu, tuyệt đối không thể thay thế tư duy phản biện của chuyên gia QA (Human-in-the-Loop)**. Mọi kết quả do AI sinh ra phải được con người thẩm định khắt khe bằng trực giác thực nghiệm, phân tích biên động và xác minh thực tế trên đa nền tảng.

---
