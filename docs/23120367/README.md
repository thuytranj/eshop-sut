# Báo Cáo Tổng Hợp & Đánh Giá Đồ Án HW03 — EShop SUT
## Môn học: Kiểm thử Phần mềm (Software Testing) — HCMUS
**Học viên thực hiện**: Trần Ngọc Diễm Thúy  
**Mã số sinh viên (MSSV)**: `23120367`  
**Email sinh viên**: `23120367@student.hcmus.edu.vn`   
**Nhánh thực hiện**: `hw03-gui-usability`  

---

## 1. Bảng Tự Đánh Giá Kết Quả (Self-Assessment Table)

Căn cứ theo thang điểm đánh giá chính thức của bài tập HW03 (Assessment Rubric):

| STT | Hạng mục Đánh giá theo Đề tài | Điểm Tối đa | Tự Đánh giá | Giải trình Minh chứng Kỹ thuật & Học thuật |
|:---:|---|:---:|:---:|---|
| **1** | **Task 1 — GUI Checklist & Automation**<br>• Thiết kế checklist bao phủ 4 IA & 4 màn hình<br>• Phản biện độc lập chất lượng của AI<br>• Tự động hóa kiểm thử bằng Playwright<br>• Lập Báo cáo Lỗi (Bug Report) hoàn chỉnh | **30** | **30 / 30** | • Thiết kế **70 mục kiểm tra** (vượt chuẩn tối thiểu 40/45 mục), phân bổ đều khắp 4 màn hình và 4 IA (mỗi IA ~25%).<br>• Phản biện độc lập sâu sắc, chỉ rõ các điểm mù của AI và bổ sung **6 mục con người** (`GUI-065` đến `GUI-070`) có luận cứ vững chắc.<br>• Tự động hóa 100% bằng Playwright Test Framework, phát hiện **48 lỗi** (tỷ lệ lỗi 68.6%).<br>• Báo cáo khiếm khuyết [Bug-Report.md](Bug-Report.md) hoàn chỉnh ghi nhận đầy đủ 74 lỗi (67 lỗi GUI + 7 lỗi Usability) kèm các bước tái hiện, nguyên nhân kỹ thuật và giải pháp sửa chữa. |
| **2** | **Task 2 — Usability Evaluation**<br>(Kịch bản kiểm thử, khảo sát 8 người dùng thực, thang đo SUS, phân tích định tính & giải pháp UX) | **40** | **40 / 40** | • Thực hiện Usability Testing thực tế với **8 người tham gia ($N=8 \ge 7$)**, lưu trữ đầy đủ 8 video minh chứng Google Drive và che số điện thoại bảo mật PII (`036****234`).<br>• Phân tích định lượng thang đo SUS bài bản (Mean = 44.38, SD = 16.57, Median = 41.25), chỉ ra sự suy giảm sâu sắc so với chuẩn ngành (68.0) và bóc tách nghịch lý ngoại lệ P07 (80.0 điểm).<br>• Phân tích định tính 4 trục trải nghiệm sâu sắc (Clarity, State Feedback, Error Recovery, Speed & Trust), trích dẫn 100% nguyên văn phản hồi thực tế từ người dùng.<br>• Thiết lập danh mục 7 lỗi Usability nghiêm trọng (`BUG-U01` đến `BUG-U07`), phát hiện lỗ hổng sửa tiền thanh toán thành 0đ, lỗi NaN, F5 mất giỏ hàng.<br>• Đề xuất 4 nhóm giải pháp kỹ thuật & thiết kế chuẩn chỉnh, sẵn sàng chuyển giao cho đội ngũ phát triển. |
| **3** | **Task 3 — Cross-Browser & Cross-Platform**<br>• Kiểm thử trên $\ge 3$ nền tảng thực tế<br>• Bắt buộc có thiết bị di động thật (Real Device)<br>• Sử dụng BrowserStack Automate Cloud<br>• Giảm thiểu tỷ lệ "Not Run" triệt để<br>• Ma trận đối sánh & Bằng chứng đạt chuẩn | **20** | **20 / 20** | • Kiểm thử trên **3 nền tảng chuẩn mực**: Chrome Win11 Desktop, Firefox Win11 Desktop, và **thiết bị thật Samsung Galaxy S23 (Android 13)**.<br>• Triển khai chiến lược phục hồi kỹ thuật, giảm tỷ lệ Not Run từ 27.14% xuống **0.95% (2/210 ô)**; đạt tỷ lệ thực thi thành công **99.05% (208/210)**.<br>• Ma trận đối sánh toàn diện, bóc tách chính xác **48 Shared Defects** và **17 Platform Discrepancies**.<br>• Bộ **208 ảnh chụp cửa sổ trình duyệt thật** kèm thanh công cụ, URL và watermark email sinh viên `23120367@student.hcmus.edu.vn`. |
| **4** | **Agent Skills & AI Collaboration**<br>• Kỹ năng xây dựng kịch bản kiểm thử<br>• Quản lý quy trình AI-First chuyên nghiệp<br>• Bộ unit test và typecheck sạch lỗi | **10** | **10 / 10** | • Xây dựng và áp dụng thành công bộ **4 Agent Skills** chuẩn cấu trúc Anthropic/AGY (`hw03-ai-audit`, `hw03-gui-checklist`, `web-design-guidelines`, `webapp-testing`).<br>• Bộ kiểm thử tự động đạt 90/90 unit tests pass, TypeScript typecheck đạt 0 lỗi.<br>• Video demo YouTube minh họa chi tiết toàn bộ luồng sử dụng skills kiểm thử end-to-end trên màn hình thực tế. |
| | **Tổng kết Toàn diện Đồ án HW03 (Task 1 + Task 2 + Task 3 + AI Skills)** | **100** | **100 / 100** | **Hoàn thành xuất sắc toàn diện ở cả 3 nhiệm vụ kỹ thuật và kiểm thử người dùng thực tế.** |

---

## 2. Báo Cáo Tóm Tắt Kiểm Thử (Test Summary Report)

| Chỉ số Kiểm thử (Metric) | Số lượng Thực tế | Ghi chú & Chi tiết Kỹ thuật |
|---|:---:|---|
| **Số Màn hình & Luồng Kiểm thử**<br>*(Screens & Flows Tested)* | **4 Màn hình Cốt lõi**<br>+ **1 Luồng E2E Toàn diện** | • `FR-03`: Màn hình Quên mật khẩu & Đặt lại OTP (2 bước)<br>• `FR-05`: Màn hình Danh sách sản phẩm, Tìm kiếm & Lọc<br>• `FR-07`: Màn hình Giỏ hàng, Cập nhật & Thanh toán đơn hàng<br>• `FR-15`: Màn hình Quản trị (Admin) Danh mục & Thêm mới sản phẩm<br>• **E2E Flow**: Luồng mua sắm khép kín 4 chặng (Tìm kiếm → Chi tiết → Giỏ hàng → Thanh toán & Hậu kiểm). |
| **Số Mục Checklist Đã Thiết kế**<br>*(Checklist Items Designed)* | **70 mục** | • **64 mục do AI sinh ban đầu** (`GUI-001` đến `GUI-064`) bao phủ đều 4 IA (16 mục/IA).<br>• **6 mục con người phản biện bổ sung** (`GUI-065` đến `GUI-070`) bù đắp các điểm mù nghiêm trọng (gõ tiếng Việt Telex, Screen Reader ARIA, phím Tab, tính NaN, diện tích chạm ngón tay 44px, Debounce). |
| **Số Lượt Kiểm thử Đã Thực thi**<br>*(Total Test Executions)* | **280 lượt chạy** | • **70 lượt chạy cục bộ** (Task 1 Playwright Automation Local).<br>• **210 lượt chạy Cloud Grid** (Task 3 BrowserStack: 70 mục × 3 nền tảng thực tế). |
| **Số Mục Kiểm tra Đạt (Passed)**<br>*(Checklist Items Passed)* | • Cục bộ: **20 / 70** (28.6%)<br>• P1 Chrome Win11: **18**<br>• P2 Firefox Win11: **22**<br>• P3 Galaxy S23: **11**<br>• **Always Passed: 3 mục** | • **3 mục đạt chuẩn tuyệt đối trên mọi nền tảng**: `GUI-010` (Tab order Bước 1 Quên mật khẩu), `GUI-011` (Tab order Bước 2 Quên mật khẩu), `GUI-027` (Tab order Danh sách sản phẩm). |
| **Số Mục Kiểm tra Thất bại (Failed)**<br>*(Checklist Items Failed)* | • Cục bộ: **48 / 70** (68.6%)<br>• **Shared Defects: 48 mục**<br>• **Discrepancies: 17 mục** | • **48 Shared Defects**: Lỗi tồn tại đồng thời trên cả 3 nền tảng (thiếu thẻ `<h1>`, lỗi định dạng tiền tệ Việt Nam `100000 VND`, rò rỉ XSS, sai logic tính tiền giỏ hàng).<br>• **17 Sai lệch nền tảng**: 10 lỗi di động (vỡ layout, icon < 44px), 4 lỗi engine (Gecko vs Blink), 3 lỗi timeout/render. |
| **Số Lượng Khiếm khuyết (Bugs)**<br>*(Total Bugs Reported & Published)* | **74 khiếm khuyết**<br>(67 GUI Bugs + 7 Usability Bugs) | • **67 GUI Bugs**: Đã tạo thành 67 GitHub Issues (`#84` đến `#150`) trên repo `nguyenanhtuan2702/eshop-sut`.<br>• **7 Usability Bugs**: Đã tạo thành 7 GitHub Issues (`#151` đến `#157`) phát hiện qua khảo sát người dùng thực tế.<br>• 100% bug có mô tả chi tiết, mã nền tảng, nguyên nhân kỹ thuật, giải pháp khắc phục và link ảnh chứng thực trong [issue-screenshots/](issue-screenshots/). |
| **Số Lượng Người Tham Gia Khảo Sát**<br>*(Usability Participants)* | **8 người dùng thực tế**<br>($N = 8 \ge 7$) | • 8 người tham gia độc lập (P01 đến P08), đa dạng ngành nghề (Sinh viên, Kỹ sư HTTT), bảo mật thông tin PII (`036****234`).<br>• **Điểm SUS Trung bình**: **44.38** (Grade F, Xếp loại "Poor", Not Acceptable).<br>• Phân tích định tính 4 trục: Clarity & Feedback, State Feedback, Error Recovery, Speed & Trust. |
| **Video Minh Chứng & Demo**<br>*(Demonstration Videos)* | **8 Video Khảo sát**<br>+ **1 Video Demo Skills** | • 8 Video Usability Testing thực tế lưu trữ công khai trên Google Drive.<br>• 1 Video Demo Agent Skills trên YouTube minh họa trọn vẹn quy trình kiểm thử tự động. |

---

## 3. Liên Kết Video Minh Chứng & Khảo Sát Thực Tế (Demonstration Videos)

### 3.1. Video Giới Thiệu & Thực Thi Agent Skills (YouTube Demo)
- **Link Video YouTube**: [https://youtu.be/Bq2_1q1i4xQ](https://youtu.be/Bq2_1q1i4xQ) *(Demo toàn diện 4 Agent Skills trên luồng kiểm thử thực tế của EShop SUT)*.

### 3.2. Bảng 8 Video Khảo Sát Người Dùng Thực Tế (Usability Sessions on Google Drive)

| Mã NTG | Họ và tên Người tham gia | Nghề nghiệp | Thiết bị & Trình duyệt | Điểm SUS | Xếp loại | Link Video Minh Chứng (Google Drive) |
|:---:|---|:---:|---|:---:|:---:|:---:|
| **P01** | Ngô Thị Ngọc Lan | Sinh viên | Windows 11 — Chrome | 40.0 | Grade F | [Xem Video P01](https://drive.google.com/open?id=1gMQcudQoSuvUuPcXTISXju_biqacMbrA) |
| **P02** | Huỳnh Lê Minh Triết | Sinh viên | Windows 11 — Chrome | 27.5 | Grade F | [Xem Video P02](https://drive.google.com/open?id=13tgJ9UN6rFzniSGhWpRIosvCgZhFZh58) |
| **P03** | Nguyễn Ngọc Nhân Trọng | Sinh viên | Windows 11 — Chrome | 40.0 | Grade F | [Xem Video P03](https://drive.google.com/open?id=14yzwdgDrjPa7TuTvJFCltnsDE6ApTvox) |
| **P04** | Lê Tấn Lộc | Sinh viên | Windows 11 — Chrome | 47.5 | Grade F | [Xem Video P04](https://drive.google.com/open?id=1G37HEs-McgTB3HvFp6Ug7yU1YoWXF1Z7) |
| **P05** | Lê Nguyễn Bảo Thi | Sinh viên | Windows 11 — Chrome | 42.5 | Grade F | [Xem Video P05](https://drive.google.com/open?id=14QWjas1y9Hy-FbFkoWLOgEpW5S2szJUi) |
| **P06** | Hồ Lê Uyên Như | Sinh viên | Windows 11 — Chrome | 27.5 | Grade F | [Xem Video P06](https://drive.google.com/open?id=1P2yP0EUMl39dK4fYtURg9BvRhO-Vu5iM) |
| **P07** | Nguyễn Trà My | Hệ thống thông tin | Windows 11 — Chrome | 80.0 | Grade A- | [Xem Video P07](https://drive.google.com/open?id=1Y89xqSX0VOR1UOLXmAPaxbzEWsdkrGI5) |
| **P08** | Cao Thị Tú Vi | Sinh viên | Windows 11 — Chrome | 50.0 | Grade F | [Xem Video P08](https://drive.google.com/open?id=1KlY-Nr0S4wTff3lNvNkDJg4qxq-cqAk6) |

- **Biểu mẫu khảo sát người dùng thực tế**: [Google Form — Đánh giá Usability Testing EShop](https://docs.google.com/forms/d/e/1FAIpQLSeHrBkrcxdLWjAc6JHq-24me8-5NaljkZyCNHYJYdq_MRxN6A/viewform)
- **Bảng tính kết quả khảo sát gốc (N=8)**: [Google Sheets — Kết Quả Khảo Sát Usability Testing EShop](https://docs.google.com/spreadsheets/d/1nSYYvo6tOrltxSdoChTR1D403YjWw_7VKamyNYWDrOE/edit?resourcekey=&gid=1393865147#gid=1393865147)

---

## 4. Giới Thiệu Bộ 4 Agent Skills Được Xây Dựng & Ứng Dụng (Agent Skills Overview)

Toàn bộ 4 kỹ năng bổ trợ AI đã được đóng gói thành các Agent Skills tiêu chuẩn (theo chuẩn Anthropic Agent Skills / Google Antigravity) và được lưu trữ ngay trong thư mục [skills/](skills/) để tái sử dụng lâu dài cho các dự án kiểm thử giao diện trong tương lai:

```
docs/23120367/skills/
├── hw03-ai-audit/           # Skill ghi vết kiểm toán AI bất biến & chuẩn hóa log
├── hw03-gui-checklist/      # Skill thiết kế, thẩm định & thực thi GUI checklist
├── web-design-guidelines/   # Skill thẩm định quy chuẩn Web Interface Guidelines
└── webapp-testing/          # Skill tự động hóa trình duyệt & trích xuất bằng chứng
```

### 4.1. Skill 1: `hw03-ai-audit` (AI Audit Trail & Academic Integrity)
- **Vị trí**: [skills/hw03-ai-audit/SKILL.md](skills/hw03-ai-audit/SKILL.md)
- **Mục đích**: Tự động hóa việc ghi nhận nhật ký kiểm toán (Audit Trail) cho toàn bộ các lượt tương tác AI trong dự án, đảm bảo tính liêm chính học thuật và tuân thủ chặt chẽ nguyên tắc bảo vệ quyền riêng tư.
- **Tính năng cốt lõi**:
  - Ghi nhận chính xác mốc thời gian ISO-8601 theo múi giờ địa phương (`UTC+07:00`), định danh mô hình AI thật (`Gemini 3.8 Flash`, `Claude 3.7 Sonnet`), và prompt nguyên bản của người dùng.
  - Tuyệt đối loại trừ private chain-of-thought, system prompt, và developer instructions khỏi bản xuất bản.
  - Đảm bảo tính bất biến (append-only) của tài liệu kiểm toán, tự động đồng bộ hóa phiên làm việc khi bắt đầu và kết thúc mỗi lượt tương tác.

### 4.2. Skill 2: `hw03-gui-checklist` (Checklist Governance & Traceability)
- **Vị trí**: [skills/hw03-gui-checklist/SKILL.md](skills/hw03-gui-checklist/SKILL.md)
- **Mục đích**: Thiết lập quy chuẩn thiết kế, phân loại và truy vết cho bộ kiểm thử giao diện người dùng EShop SUT.
- **Tính năng cốt lõi**:
  - Ép buộc bao phủ cân bằng 4 khía cạnh giao diện cốt lõi: **IA-01** (Tiêu chuẩn UI chung), **IA-02** (Biểu mẫu & Nhập liệu), **IA-03** (Điều hướng & Bàn phím), và **IA-04** (Phản hồi & Trạng thái).
  - Phân định rõ ràng giữa các mục do AI tự động trích xuất (`AI-Drafted`) và các mục do chuyên gia con người phản biện bổ sung (`Human-Critiqued`).
  - Kiểm soát quy tắc đánh giá: nghiêm cấm gán nhãn `Passed` hoặc `Failed` cho các ca kiểm thử chưa chạy (`Not Run`), đảm bảo tính trung thực kỹ thuật.

### 4.3. Skill 3: `web-design-guidelines` (Interface Compliance & Heuristic Evaluation)
- **Vị trí**: [skills/web-design-guidelines/SKILL.md](skills/web-design-guidelines/SKILL.md)
- **Mục đích**: Cung cấp cơ sở tri thức chuyên sâu về 10 nguyên lý Heuristic của Jakob Nielsen, hướng dẫn thiết kế Web Interface Guidelines và chuẩn tiếp cận W3C/WCAG 2.1 AA.
- **Tính năng cốt lõi**:
  - Tự động rà soát vi phạm cấu trúc ngữ nghĩa HTML (thẻ `<h1>` duy nhất, thuộc tính `alt` của ảnh, nhãn `aria-label` cho Screen Reader).
  - Thẩm định quy chuẩn biểu mẫu: độ tương phản màu sắc nút bấm (Color Contrast), vùng chạm ngón tay tối thiểu $\ge 44 \times 44\text{px}$ trên màn hình cảm ứng di động.
  - Đánh giá khả năng điều hướng bàn phím (Tab order, focus outline không bị ẩn bởi `outline: none`).

### 4.4. Skill 4: `webapp-testing` (End-to-End Browser Automation with Playwright)
- **Vị trí**: [skills/webapp-testing/SKILL.md](skills/webapp-testing/SKILL.md)
- **Mục đích**: Bộ công cụ điều phối và thực thi kiểm thử giao diện người dùng tự động hóa thông qua Playwright API trên cả môi trường cục bộ và đám mây (BrowserStack Cloud Grid).
- **Tính năng cốt lõi**:
  - Cung cấp kiến trúc Page Object Model (POM) cô lập trạng thái cho từng màn hình (`ForgotPasswordPage`, `ProductCatalogPage`, `CartPage`, `AdminProductPage`).
  - Tự động bắt ảnh chụp màn hình (Screenshots) có gắn watermark định danh sinh viên `23120367@student.hcmus.edu.vn` và mã băm toàn vẹn SHA-256.
  - Xử lý các tác vụ phức tạp: giả lập độ trễ mạng, bàn phím ảo di động, kiểm tra lỗ hổng XSS Injection, và ghi nhận kết quả atomic vào workbook Excel.

---

## 5. Danh Mục Toàn Bộ Tài Liệu Hỗ Trợ Đính Kèm (Supporting Materials)

Tất cả các tài liệu, báo cáo, mã nguồn và dữ liệu chứng thực của sinh viên `23120367` được tổ chức ngăn nắp ngay trong thư mục [docs/23120367/](./):

| Tên Tập Tin / Thư Mục | Định Dạng | Mô Tả Vai Trò & Nội Dung |
|---|:---:|---|
| [Main-Report.md](Main-Report.md) | Markdown | **Báo cáo Tổng hợp Chính**: Trình bày chi tiết toàn cảnh 7 chương về phương pháp luận, ma trận bao phủ, kết quả thực thi 3 nền tảng, phân tích đối sánh và khuyến nghị UX. |
| [Main-Report.pdf](Main-Report.pdf) | PDF (1.9 MB) | **Bản in ấn PDF Báo cáo Chính**: Xuất bản chuẩn khổ A4, đầy đủ biểu đồ Mermaid, công thức toán học KaTeX, mục lục tự động và bảng biểu không tràn lề. |
| [Bug-Report.md](Bug-Report.md) | Markdown | **Báo cáo Khiếm khuyết Toàn diện**: Hồ sơ chi tiết của **74 lỗi** (67 GUI bugs + 7 Usability bugs), có liên kết GitHub Issue và ảnh chụp màn hình xác thực. |
| [AI-Critique.md](AI-Critique.md) | Markdown | **Báo cáo Phản biện Trí tuệ Nhân tạo**: Đoạn văn học thuật chuẩn Bloom-AI G9.3 & G9.4, bóc tách các điểm mù của AI và bài học phối hợp con người - AI. |
| [AI-Critique.pdf](AI-Critique.pdf) | PDF (219 KB) | **Bản in ấn PDF Báo cáo Phản biện AI**: Định dạng văn bản in ấn đẹp mắt, phục vụ lưu trữ và chấm điểm độc lập. |
| [AI-Audit-Report.pdf](AI-Audit-Report.pdf) | PDF (408 KB) | **Bản in ấn PDF Báo cáo Kiểm toán AI**: Xuất nguyên bản từ [AI-Audit-Report.md](../AI-Audit-Report.md), ghi lại toàn bộ prompt và generation minh bạch. |
| [Usability-Evidence.md](Usability-Evidence.md) | Markdown | **Hồ sơ Bằng chứng Nghiên cứu Người dùng**: Kịch bản E2E, liên kết Google Form, Google Sheet kết quả, thông tin 8 người tham gia và 8 video Google Drive. |
| [EShop-GUI-Checklist.xlsx](EShop-GUI-Checklist.xlsx) | Excel (.xlsx) | **Bảng Kiểm thử Giao diện Chính thức**: Bảng tính 70 mục kiểm tra có công thức tính tỷ lệ pass/fail, phân loại IA, trạng thái thực thi và đường dẫn bằng chứng. |
| [git-commit-log.txt](git-commit-log.txt) | Plain Text | **Lịch sử Commit Git Dạng Thô**: Trích xuất lịch sử commit thật bằng lệnh `git log --date=iso-strict --pretty=format:'%h %ad %an %s'`. |
| [Git-Commit-Log.md](Git-Commit-Log.md) | Markdown | **Báo cáo Lịch sử Commit Chi Tiết**: Bảng tổng hợp tiến độ 48 commit chia theo 4 giai đoạn phát triển đồ án. |
| [calculate_sus.py](calculate_sus.py) | Python Script | **Mã nguồn Tính toán SUS Độc lập**: Script tải dữ liệu CSV/Sheets, tính điểm SUS từng cá nhân, độ lệch chuẩn, trung vị và phân loại Bangor (2009). |
| [images/](images/) | Thư mục Ảnh | **Thư viện 208 Ảnh Trình duyệt Thật**: Ảnh chụp cửa sổ trình duyệt thật trên Chrome Win11, Firefox Win11, Galaxy S23 kèm watermark chính chủ. |
| [issue-screenshots/](issue-screenshots/) | Thư mục Ảnh | **Thư viện 74 Ảnh GitHub Issues**: Ảnh chụp màn hình chứng thực của 74 GitHub Issues đã tạo trên kho mã nguồn `nguyenanhtuan2702/eshop-sut`. |
| [skills/](skills/) | Thư mục Skills | **Bộ 4 Agent Skills Tiêu chuẩn**: Mã nguồn và tài liệu đặc tả của 4 kỹ năng AI phục vụ kiểm thử và kiểm toán. |
