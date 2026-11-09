# AI Audit Report

Declaration: I use AI tools for the following tasks, as recorded below.

This report preserves available user prompts and visible AI generations (including
commentary and finals). Tool traces stay in the original session files. Private
reasoning and system/developer instructions are excluded. Attachments are referenced,
not reconstructed. Scope is limited to imported sessions; future messages require
another sync. All report times use Asia/Ho_Chi_Minh (UTC+07:00).


<!-- audit-event:8e089de3199e7afb7492a56cd5d7d812bea64e533386e751410d43ca8aeaf2d1 -->
## Generation (prepared/exported) | eshop-hw03-turn-1-gui-checklist-design

- Date: 2026-11-08
- Time: 21:59:30+07:00
- Event timestamp UTC: 2026-11-08T14:59:30+00:00
- Model identity: Gemini 3.8 Flash (Medium)
- Source: Explicit raw files supplied by agent; preparation/export time, not delivery confirmation
- Imported at UTC: 2026-11-08T14:59:35.959502+00:00

### Input prompt (raw text)

```text
Bạn là người thiết kế kiểm thử GUI cho EShop SUT. Thực hiện kế hoạch
docs/superpowers/plans/2026-11-08-gemini-eshop-gui-checklist.md bằng tiếng Việt.
Đọc plan, README.md và PDF HW03 trước. Bắt đầu Task 1: inventory yêu cầu
nguyên tử và design-context. Báo nguồn thiếu/mâu thuẫn, không đoán.

Sau Task 1, thực hiện Task 2 → Task 3 → Task 4 theo các gate của plan.
Thực hiện theo thứ tự: FR-03 (đủ hai bước) → FR-05 → FR-07 → FR-15.
Checklist, procedures, coverage và Excel phải cùng thứ tự màn hình đó.
Tối thiểu 45 mục;
mục tiêu 64 mục, 16 mục/IA, có nguồn và cách kiểm chứng từng mục.
Không tăng số lượng bằng mục trùng hoặc buộc yêu cầu không áp dụng.
Phân biệt requirement README với tiêu chí USR bổ sung, nhất là toast,
skeleton, modal xóa Admin và số lượng giỏ. Không dùng code làm oracle.

Giữ bản nháp AI đầu tiên; ghi prompt/output và model/thời gian thật vào
audit. Origin=AI cho mọi mục bạn viết; Human review pending nếu chưa
được sinh viên review. Mọi status ban đầu Not Run. Không chạy SUT,
thay đổi dữ liệu ứng dụng, commit hoặc đăng issue trong nhiệm vụ thiết kế.

Xuất đúng CSV schemas, procedures có dữ liệu/steps/measurement/evidence,
review log, coverage matrix và Excel. Chạy validator có sẵn và kiểm tra
bổ sung ngưỡng/cân bằng/join. Báo output xác minh thực tế; nếu không
chạy được công cụ hoặc xuất Excel, ghi rõ phần chưa làm thay vì giả kết quả.
Kết thúc với số mục theo IA/màn hình, yêu cầu chưa phủ và giới hạn nguồn.

```

### Raw generation output

````text
# Báo cáo Thiết kế & Bàn giao Bộ Kiểm thử GUI cho EShop SUT (HW03)

Kế hoạch `docs/superpowers/plans/2026-11-08-gemini-eshop-gui-checklist.md` đã được thực thi hoàn tất bằng tiếng Việt qua 4 Task theo đúng thứ tự màn hình bắt buộc: **FR-03 (Quên & đặt lại mật khẩu, đủ 2 bước) $\rightarrow$ FR-05 (Danh sách & Tìm kiếm sản phẩm) $\rightarrow$ FR-07 (Chi tiết giỏ hàng) $\rightarrow$ FR-15 (Quản trị viên quản lý sản phẩm CRUD)**.

---

## 1. Danh mục Tập tin Đầu ra đã Hoàn thành

Tất cả các tập tin đã được tạo lập đầy đủ và đồng bộ tại thư mục `docs/gui-checklist/`:

| Tập tin | Vai trò & Nội dung | Trạng thái kỹ thuật |
|---|---|---|
| [`requirements.csv`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/requirements.csv) | Kho lưu trữ 78 yêu cầu nguyên tử (62 áp dụng, 16 ngoài phạm vi) | Chuẩn schema, đủ nguồn và lý do |
| [`design-context.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/design-context.md) | Ngữ cảnh thiết kế, mã băm SHA-256 tài liệu nguồn, phân tích khác biệt oracle và ma trận dữ liệu biên | Đầy đủ dữ liệu test fixture và boundary matrix |
| [`checklist.ai-draft.csv`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/checklist.ai-draft.csv) | Bản nháp đầu tiên của AI gồm 64 mục, giữ nguyên vẹn | Lưu trữ độc lập cho audit |
| [`procedures.csv`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/procedures.csv) | Quy trình thực thi chi tiết nối 1:1 theo ID (preconditions, test_data, steps, measurement, evidence_needed) | 64/64 mục có quy trình hoàn chỉnh |
| [`checklist.csv`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/checklist.csv) | Bộ checklist đã rà soát cấu trúc và ngữ nghĩa, giữ ID ổn định | Khớp 100% validator |
| [`review.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/review.md) | Nhật ký rà soát 5 trọng tâm (Focus 1–5), xử lý khác biệt nguồn và trạng thái `Human review pending` | Minh bạch nguồn gốc AI |
| [`coverage.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/coverage.md) | Ma trận truy vết Requirement $\rightarrow$ Item, bảng phân bổ Screens $\times$ IA và output xác minh thực tế | Đầy đủ bằng chứng kiểm tra |
| [`EShop-GUI-Checklist.xlsx`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/EShop-GUI-Checklist.xlsx) | Sổ làm việc Excel chuẩn 5 sheets (`Checklist`, `Requirements`, `Coverage`, `Test Data`, `Review`) | Freeze pane, auto-filter, wrap text, độ rộng cột tối ưu |

---

## 2. Thống kê Số mục theo Khía cạnh (IA) và Màn hình Chức năng

- **Tổng số mục kiểm tra**: **64 mục** (vượt xa ngưỡng tối thiểu 45 mục của bài tập; đạt chính xác 100% mục tiêu 64 mục của kế hoạch).
- **Cân bằng giữa các nhóm IA**: Đúng **16 mục** cho mỗi khía cạnh ($\Delta = 0$).

### Bảng phân bổ Ma trận Screens $\times$ IA:

| Thứ tự thực hiện & Màn hình | IA-01 (Tiêu chuẩn chung) | IA-02 (Biểu mẫu) | IA-03 (Điều hướng) | IA-04 (Phản hồi & Trạng thái) | Tổng số mục | Dải Item ID |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. FR-03** (Quên & đặt lại mật khẩu) | 3 | 5 | 4 | 3 | **15** | `GUI-001` – `GUI-015` |
| **2. FR-05** (Danh sách & Tìm kiếm) | 6 | 2 | 4 | 4 | **16** | `GUI-016` – `GUI-031` |
| **3. FR-07** (Chi tiết giỏ hàng) | 4 | 3 | 4 | 4 | **15** | `GUI-032` – `GUI-046` |
| **4. FR-15** (Admin Quản lý sản phẩm) | 3 | 6 | 4 | 5 | **18** | `GUI-047` – `GUI-064` |
| **Tổng cộng** | **16** | **16** | **16** | **16** | **64** | `GUI-001` – `GUI-064` |

---

## 3. Tình trạng Bao phủ Yêu cầu (Requirements Coverage)

- **Tổng số yêu cầu nguyên tử trong inventory**: **78 yêu cầu**
  - **Yêu cầu áp dụng trong phạm vi 4 màn hình**: **62 yêu cầu**
  - **Yêu cầu áp dụng đã được bao phủ**: **62 / 62 yêu cầu** (**100%** độ bao phủ).
  - **Số yêu cầu áp dụng chưa được bao phủ**: **0 yêu cầu**.
  - **Yêu cầu ngoài phạm vi 4 màn hình (Non-applicable)**: **16 yêu cầu** (được ghi rõ `applicable=no` và nguyên nhân loại trừ cụ thể trong `requirements.csv` và `coverage.md`, bao gồm: FR-01 Đăng ký, FR-02 Đăng nhập, FR-04 Hồ sơ, FR-06 Chi tiết đầy đủ, FR-08 Thanh toán, FR-09 Coupon, FR-10 State machine đơn hàng, FR-11 Lịch sử đơn hàng, FR-12 Access control API, FR-13 Dashboard, FR-14 Danh mục CRUD, FR-16 Import CSV, FR-17 Coupon CRUD, FR-18 Đơn hàng Admin, FR-19 Người dùng Admin, FR-20 Mobile app).

---

## 4. Kết quả Xác minh Thực tế từ Công cụ (Verification Evidence)

Các công cụ kiểm tra tự động đã được thực thi thực tế trong môi trường sandbox và ghi nhận đầu ra:

### 4.1. Kết quả thực thi `validate_checklist.py`:
```bash
python3 .agents/skills/hw03-gui-checklist/scripts/validate_checklist.py docs/gui-checklist/checklist.csv docs/gui-checklist/requirements.csv
```
**Đầu ra thực tế (Exit Code 0):**
```json
{
  "items": 64,
  "aspect_counts": {
    "IA-01": 16,
    "IA-02": 16,
    "IA-03": 16,
    "IA-04": 16
  },
  "errors": [],
  "semantic_review_required": true
}
```

### 4.2. Kết quả kiểm tra bổ sung cấu trúc, cân bằng và nối 1:1:
```text
Check 1: Item count >= 64: PASS (count = 64)
Check 2: IA set complete: PASS {'IA-01', 'IA-02', 'IA-03', 'IA-04'}
Check 3: Balance check: PASS (counts = {'IA-01': 16, 'IA-02': 16, 'IA-03': 16, 'IA-04': 16}, diff = 0)
Check 4: Screen sequence: PASS ['FR-03', 'FR-05', 'FR-07', 'FR-15']
Screen counts: {'FR-03': 15, 'FR-05': 16, 'FR-07': 15, 'FR-15': 18}
Check 5: 1:1 Procedures join and completeness: PASS (100% items có procedure đầy đủ)
```

### 4.3. Kiểm tra tính toàn vẹn của Sổ làm việc Excel (`EShop-GUI-Checklist.xlsx`):
- Định dạng zip `.xlsx` hợp lệ 100% (`testzip() == None`).
- Gồm 5 sheets đúng yêu cầu: `Checklist` (65 dòng), `Requirements` (79 dòng), `Coverage` (6 dòng), `Test Data` (15 dòng), `Review` (9 dòng).
- Bật đóng băng dòng tiêu đề (freeze pane tại dòng 2), tự động lọc (auto-filter trên toàn bộ các cột dữ liệu), bật tự động xuống dòng (wrap text) và căn chỉnh độ rộng cột tối ưu cho việc đọc trực quan.

---

## 5. Giới hạn Nguồn & Xử lý Khác biệt Ngữ nghĩa

Tuân thủ nguyên tắc không đoán mò và không dùng code làm oracle:
1. **Phân tách Toast & Badge**: README FR-24 chấp nhận phản hồi dạng toast hoặc badge; tiêu chí bổ sung của người dùng (`USR-STATE-TOAST`) đòi hỏi toast. Bộ checklist tách thành 2 mục kiểm tra độc lập (`GUI-025` kiểm tra badge và `GUI-031` kiểm tra toast) để không đánh đồng hai nguồn.
2. **Skeleton Loading**: README FR-05 quy định trạng thái loading chung; tiêu chí bổ sung của người dùng (`USR-STATE-SKELETON`) kiểm tra hiệu ứng skeleton qua network throttling (`GUI-028`).
3. **Modal xác nhận xóa Admin**: README FR-15 không quy định modal xóa; tiêu chí bổ sung của người dùng (`USR-DELETE-ADMIN`) quy định modal có bẫy focus và phím Escape (`GUI-061`, `GUI-062`).
4. **Dữ liệu biên Số lượng giỏ và Giá Admin**: Đã tách riêng oracle cho từng bộ dữ liệu biên (rỗng, 0, âm, thập phân, chữ); không tự ý áp đặt giới hạn giá tối đa cho Admin khi đặc tả không nêu (`GUI-038`, `GUI-052`).
5. **Hiển thị an toàn HTML (XSS)**: Từ khóa `<b>Áo</b>` được kiểm tra hiển thị dạng text an toàn tại `GUI-021`, không render thẻ DOM in đậm.
6. **Độc lập khi Sửa Admin**: `GUI-060` đối chiếu trước và sau khi lưu để bảo đảm sửa sản phẩm A không làm đổi thông tin sản phẩm B.
7. **Tài liệu bài giảng môn học**: Slide bài giảng không có trong repository; nhóm thiết kế đã ghi nhận rõ giới hạn nguồn này trong `design-context.md` và `review.md`.

---

## 6. Trạng thái Kiểm toán & Bàn giao

- **Nguồn gốc (`origin`)**: Toàn bộ 64 mục đều có `origin=AI`.
- **Trạng thái thực thi (`status`)**: Toàn bộ 64 mục đều khởi tạo là `Not Run`. Các cột kết quả thực tế, bằng chứng và issue để trống để phục vụ cho giai đoạn chạy kiểm thử sau này.
- **Trạng thái duyệt của con người**: Được ghi nhận chính xác là `Human review pending` trong `review.md` và trong sổ làm việc Excel cho đến khi sinh viên trực tiếp rà soát và bổ sung các mục phát hiện thực tế.
- **Tuân thủ quy chế thực thi**: Không chạy SUT, không chỉnh sửa dữ liệu ứng dụng, không tạo commit Git và không đăng issue GitHub trong nhiệm vụ thiết kế này.
````

<!-- audit-event:5d6698628516845ec64517832ce8b57bee4c06cda53879ff5856864284b73773 -->


<!-- audit-event:bd76eace65658c66aea37b0b78d1dfa4398442e422fa31a683bc7dcb8bb86513 -->

<!-- audit-event:76aa8e540c7aff13c2eec7c4c43f19e7535acc88132082e6a7dbf8b542be25bd -->
## Input | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/01a1bf4b-a990-7410-a55a-e6a933b74dea

- Date: 2026-11-09
- Time: 14:52:49.307000+07:00
- Event timestamp UTC: 2026-11-09T07:52:49.307000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T07:53:19.968178+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

Pending at this input event; see subsequent generation entries.

<!-- audit-event:7ccd41aa0640636185c56d9ac3bdd3c83c9c0726d90c4261b8050756201ef841 -->
## Generation (commentary) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17bd68a1887d0b4f8079dfa35f513

- Date: 2026-11-09
- Time: 14:52:56.630000+07:00
- Event timestamp UTC: 2026-11-09T07:52:56.630000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T07:53:19.968878+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
I'm using the writing-plans skill to create the implementation plan. Tôi sẽ đọc workbook, đặc tả và cấu trúc dự án để lập kế hoạch bám sát 70 checklist items; đồng thời áp dụng các skill về AI audit, GUI checklist và kiểm thử web.

```

<!-- audit-event:9ffd9d9b921dbaaeb771a6e09e9b4389a62821b90b5d98bd5b5df92e606289da -->
## Generation (commentary) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17bf362a887d0b74a025ffbe386b3

- Date: 2026-11-09
- Time: 14:53:25.440000+07:00
- Event timestamp UTC: 2026-11-09T07:53:25.440000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T08:08:07.193757+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Tôi đang đối chiếu workbook với đặc tả và mã nguồn. Kế hoạch sẽ dùng Excel làm nguồn checklist, lưu kết quả từng lượt chạy riêng rồi mới cập nhật bốn cột kết quả, để tránh ghi đè chéo giữa các worker hoặc trình duyệt.

```

<!-- audit-event:b05e92b4351f4754268ecb9f0d7012484999641efc61b57f470cfdd5d1996690 -->
## Generation (commentary) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17c50efe487d09fea6bf59d7e2921

- Date: 2026-11-09
- Time: 14:54:58.833000+07:00
- Event timestamp UTC: 2026-11-09T07:54:58.833000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T08:08:07.194178+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Workbook có đúng 70 items, tất cả đang `Not Run`: FR-05 có 19, FR-07 có 18, FR-03 có 15 và FR-15 có 18. Tôi cũng thấy ba điểm cần xử lý rõ trong kế hoạch: giỏ hàng hiện dùng React state chứ không gọi API khi thêm hàng; form Admin đang nằm trực tiếp trên trang; và các kiểm tra IME, screen reader, bàn phím ảo cần bằng chứng thủ công để kết luận đầy đủ.

```

<!-- audit-event:2121291adce0ff3ae9579bb303794b33d36af2714e65163acb324140ee9aa791 -->
## Generation (commentary) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17da21f7c87d0a574b3d79bf2b781

- Date: 2026-11-09
- Time: 15:00:36.273000+07:00
- Event timestamp UTC: 2026-11-09T08:00:36.273000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T08:08:07.194336+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Tôi đã viết xong ma trận đủ 70 ID, kèm selector và trạng thái cần dựng cho từng item. Phần tiếp theo sẽ quy định cách chụp lỗi, tổng hợp retry và kết quả nhiều nền tảng, rồi ghi Excel an toàn; các phần chưa kiểm tra thủ công sẽ không bị đánh dấu `Passed`.

```

<!-- audit-event:dd6d8bf40cd4ef60b4e3e3c5fe471f7508972972d3a09d7d314d21f6fa4143e0 -->
## Generation (commentary) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17ef8110887d0a8b75e26d8bdfd29

- Date: 2026-11-09
- Time: 15:06:18.317000+07:00
- Event timestamp UTC: 2026-11-09T08:06:18.317000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T08:08:07.194468+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Bản kế hoạch đã có đủ bốn giai đoạn, rủi ro và các mốc commit dự kiến. Tôi đang rà soát lần cuối ma trận 70 ID, tính nhất quán của các interface và lệnh chạy, cùng cơ chế bảo toàn workbook; file Excel hiện vẫn giữ nguyên.

```

<!-- audit-event:67f1d5f05eb59ab5996ef2fd09a775be448b0a3db315277ba2575183e36a5c1e -->
## Generation (prepared/exported) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/prepared-plan-final/2026-11-09T08:08:40.107327+00:00

- Date: 2026-11-09
- Time: 15:08:40.107327+07:00
- Event timestamp UTC: 2026-11-09T08:08:40.107327+00:00
- Model identity: gpt-6.1-sol
- Source: Explicit raw files supplied by agent; preparation/export time, not delivery confirmation
- Imported at UTC: 2026-11-09T08:08:40.109909+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Đã lưu [kế hoạch chi tiết](/Users/thuytran/Workspace/eshop-sut/docs/superpowers/plans/2026-11-09-playwright-test-automation-execution.md) gồm **4 giai đoạn, 9 tasks**:

1. **Kiến trúc:** config, Page Objects, helper Excel có backup, khóa ghi và phát hiện xung đột.
2. **70 items:** FR-05 **19**, FR-07 **18**, FR-03 **15**, FR-15 **18**; từng ID có chiến lược selector, state và assertion, gồm GUI-065/067/070.
3. **Thực thi:** screenshot khi assertion lỗi, trace, tổng hợp nhiều nền tảng và cập nhật đúng bốn cột Excel.
4. **Bug reporting:** phân loại, gộp bug trùng, xuất báo cáo và template GitHub Issues.

Tài liệu có bảng rủi ro, mốc commit, lệnh kiểm chứng và điều kiện hoàn thành. Đã kiểm tra mapping đủ **70 ID**, đúng bốn nhóm IA. **Chưa chạy GUI hoặc sửa workbook.** Các phần IME, screen reader và bàn phím ảo có yêu cầu bằng chứng thủ công.

Theo [writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md), cần “review the plan and choose an execution method before implementation”. Bạn xem kế hoạch đã đúng ý chưa; nếu triển khai tiếp, bạn chọn **Native** hay **Subagent-driven**? Tôi đề xuất **Native** vì các task dùng chung nhiều interface.
```

<!-- audit-event:df8096897f75743e480e12dc0a2bfbbf47040a1f04f320d8d24b1654e06826e3 -->
## Generation (final_answer) | 01a1bf49-fd1a-7723-9445-d85f5f84bf8e/msg_06d9c41a450b7bd9016af17f9155d087d0a82d95e4f83424d6

- Date: 2026-11-09
- Time: 15:08:56.551000+07:00
- Event timestamp UTC: 2026-11-09T08:08:56.551000+00:00
- Model identity: gpt-6.1-sol
- Source: rollout-2026-11-09T14-50-59-01a1bf49-fd1a-7723-9445-d85f5f84bf8e.jsonl; session 01a1bf49-fd1a-7723-9445-d85f5f84bf8e; metadata model; event timestamp
- Imported at UTC: 2026-11-09T09:38:17.074371+00:00

### Input prompt (raw text)

```text
[$superpowers:writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md) Dựa trên file docs/gui-checklist/EShop-GUI-Checklist.xlsx\
Hãy đóng vai trò Test Lead & QA Architect:\
1\. Lập một "Playwright Test Automation & Execution Plan" chi tiết gồm 4 giai đoạn rõ ràng:\
&#x20;  \- Giai đoạn 1: Chuẩn bị kiến trúc (Config, Page Object Models, Helper đọc/ghi trực tiếp vào file Excel checklist).\
&#x20;  \- Giai đoạn 2: Phân nhóm 70 items theo từng màn hình (FR-05, FR-07, FR-03, FR-15) kèm chiến lược selector và mock state (ví dụ: mock lỗi mạng cho GUI-067, bắt composition events cho GUI-065).\
&#x20;  \- Giai đoạn 3: Quy trình chạy thử nghiệm, cơ chế chụp screenshot khi assertion thất bại, và tự động ghi đè kết quả vào các cột: status, actual_result, notes, evidence_path trong file Excel.\
&#x20;  \- Giai đoạn 4: Quy trình tổng hợp Bug Report và xuất template GitHub Issues.\
\
2\. Xác định rõ:\
&#x20;  \- Các rủi ro tiềm ẩn.\
&#x20;  \- Danh sách các mốc Git commit tương ứng với từng giai đoạn.

```

### Raw generation output

```text
Đã lưu [kế hoạch chi tiết](/Users/thuytran/Workspace/eshop-sut/docs/superpowers/plans/2026-11-09-playwright-test-automation-execution.md) gồm **4 giai đoạn, 9 tasks**:

1. **Kiến trúc:** config, Page Objects, helper Excel có backup, khóa ghi và phát hiện xung đột.
2. **70 items:** FR-05 **19**, FR-07 **18**, FR-03 **15**, FR-15 **18**; từng ID có chiến lược selector, state và assertion, gồm GUI-065/067/070.
3. **Thực thi:** screenshot khi assertion lỗi, trace, tổng hợp nhiều nền tảng và cập nhật đúng bốn cột Excel.
4. **Bug reporting:** phân loại, gộp bug trùng, xuất báo cáo và template GitHub Issues.

Tài liệu có bảng rủi ro, mốc commit, lệnh kiểm chứng và điều kiện hoàn thành. Đã kiểm tra mapping đủ **70 ID**, đúng bốn nhóm IA. **Chưa chạy GUI hoặc sửa workbook.** Các phần IME, screen reader và bàn phím ảo có yêu cầu bằng chứng thủ công.

Theo [writing-plans](/Users/thuytran/.codex/plugins/cache/openai-curated-remote/superpowers/7.0.1/skills/writing-plans/SKILL.md), cần “review the plan and choose an execution method before implementation”. Bạn xem kế hoạch đã đúng ý chưa; nếu triển khai tiếp, bạn chọn **Native** hay **Subagent-driven**? Tôi đề xuất **Native** vì các task dùng chung nhiều interface.
```
<!-- audit-event:f09131b69b075313e4849bca431d77ffad9d845b819276e2efd4df8c73cf9c5e -->
## Generation (prepared/exported) | eshop-hw03-playwright-automation-execution

- Date: 2026-11-09
- Time: 21:48:09+07:00
- Event timestamp UTC: 2026-11-09T14:48:09+00:00
- Model identity: Gemini 3.8 Flash (Medium)
- Source: Explicit raw files supplied by agent; preparation/export time, not delivery confirmation
- Imported at UTC: 2026-11-09T14:48:14.690110+00:00

### Input prompt (raw text)

```text
thực hiện các task trong plan docs/superpowers/plans/2026-11-09-playwright-test-automation-execution.md

```

### Raw generation output

```text
# Báo Cáo Hoàn Thành Toàn Bộ Kế Hoạch Playwright Test Automation & Execution (HW03)

Toàn bộ các task trong kế hoạch [`docs/superpowers/plans/2026-11-09-playwright-test-automation-execution.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/superpowers/plans/2026-11-09-playwright-test-automation-execution.md) đã được thực hiện và bàn giao hoàn tất trên branch `hw03-gui-usability`.

---

## 1. Tổng Quan Kiến Trúc & Các Task Đã Hoàn Thành

1. **Giai đoạn 1 (Chuẩn bị kiến trúc & Quản lý Excel an toàn):**
   - **Task 1:** Thiết lập độc lập gói Playwright TypeScript tại [`tests/gui/`](file:///Users/thuytran/Workspace/eshop-sut/tests/gui/), cấu hình project duy nhất `chrome-local` sử dụng Google Chrome thật (`channel: 'chrome'`), viewport mặc định 1440×900 kèm responsive 768×1024 và 360×800. Xây dựng các Page Object Models: `CatalogPage`, `CartPage`, `ResetPasswordPage`, `AdminProductsPage`. (Commit `23ac07c`)
   - **Task 2:** Xây dựng [`excel-store.ts`](file:///Users/thuytran/Workspace/eshop-sut/tests/gui/checklist/excel-store.ts) với cơ chế bảo vệ nghiêm ngặt: tạo backup timestamp, khóa ghi file (file lock), kiểm tra hash SHA-256 chống ghi đè xung đột, cập nhật an toàn đúng 4 cột (`status`, `actual_result`, `notes`, `evidence_path`) theo ID mà không làm thay đổi định dạng, công thức hay cấu trúc của 5 worksheets. (Commit `c6b3ef9`)

2. **Giai đoạn 2 (Xây dựng kịch bản kiểm thử cho 70 Checklist Items):**
   - **Task 3 (FR-05 - 19 items):** Catalog, tìm kiếm, lọc danh mục, phân trang, hiển thị giá `₫`, responsive grid, bảo vệ XSS và xử lý lỗi mạng (`fr05.spec.ts`). Ánh xạ đúng 5 sản phẩm điện tử thực tế từ seed (`execution-data.ts`). (Commit `5a469f0`)
   - **Task 4 (FR-07 - 18 items):** Giỏ hàng, tính toán tổng tiền, bảng dữ liệu, kiểm tra phím Tab, aria-live, tương thích touch target và phát hiện thiếu control số lượng (+/−) (`fr07.spec.ts`). Cổng kiểm tra thủ công tại [`manual-checks.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/manual-checks.md). (Commit `666ec96`)
   - **Task 5 (FR-03 - 15 items):** Quên & đặt lại mật khẩu, luồng 2 bước, kiểm tra kiểu input email, độ dài mã OTP, xác nhận mật khẩu và liên kết quay lại (`fr03.spec.ts`). (Commit `20d95a0`)
   - **Task 6 (FR-15 - 18 items):** Quản trị viên quản lý sản phẩm CRUD, form validation, modal cảnh báo xóa và kiểm tra tính độc lập dữ liệu khi cập nhật sản phẩm (`fr15.spec.ts`). (Commit `516b7b5`)

3. **Giai đoạn 3 (Bằng chứng, Bộ điều phối thực thi & Cập nhật kết quả):**
   - **Task 7:** Bộ thu thập bằng chứng tự động (`evidence.ts`), chụp ảnh màn hình khi assertion fail, quay trace, gom nhóm kết quả nhiều lần chạy vào `matrix.json`. (Commit `c282bf2`)
   - **Task 8:** Bộ điều phối thực thi độc lập (`runner/run.ts`), tích hợp backend SQLite sandbox tự phục hồi, cập nhật kết quả vào file Excel và tạo bản sao lưu. (Commit `720d8a4`)
   - **Thực thi trên Google Chrome thật & Ghi nhận kết quả:** Hoàn tất chạy toàn bộ suite, writeback vào workbook và xuất báo cáo tổng kết. (Commit `a72f378`)

4. **Giai đoạn 4 (Báo cáo lỗi & Xuất bản nháp GitHub Issues):**
   - **Task 9:** Bộ triage lỗi (`reporting/bugs.ts`), xuất [`bug-report.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/bug-report.md), tạo 48 bản nháp Markdown issue tại [`docs/gui-checklist/automation/issue-drafts/`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/issue-drafts/) kèm [`issues.json`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/issue-drafts/issues.json) và GitHub issue template. (Commit `1549f71`)

---

## 2. Kết Quả Thực Thi Thực Tế Trên Google Chrome

Kết quả tổng hợp từ file [`execution-summary.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/execution-summary.md) sau khi chạy toàn bộ test suite trên Google Chrome:

| Chỉ số | Số lượng | Tỷ lệ | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Tổng số mục checklist** | **70** | 100% | Đầy đủ 70 Checklist Items |
| **Đã thực thi (Executed)** | **68** | 97.1% | Đã chạy và có phán quyết tự động |
| **Đạt (Passed)** | **20** | **29.4%** | Đáp ứng đúng tiêu chí đặc tả |
| **Lỗi (Failed)** | **48** | **70.6%** | Phát hiện lỗi giao diện hoặc hành vi thực tế |
| **Chưa thực thi (Not Run)** | **2** | 2.9% | GUI-065 (chờ IME gõ tiếng Việt) & GUI-066 (chờ Screen Reader) |

### Phân Bổ Theo Màn Hình & Khía Cạnh Đánh Giá (IA)

- **Theo Màn hình:**
  - **FR-03 (Quên mật khẩu):** 15 items $\rightarrow$ 4 Passed, 11 Failed, 0 Not Run.
  - **FR-05 (Danh sách & Tìm kiếm):** 19 items $\rightarrow$ 5 Passed, 13 Failed, 1 Not Run.
  - **FR-07 (Chi tiết giỏ hàng):** 18 items $\rightarrow$ 4 Passed, 14 Failed, 0 Not Run.
  - **FR-15 (Admin Quản lý sản phẩm):** 18 items $\rightarrow$ 7 Passed, 10 Failed, 1 Not Run.
- **Theo Khía cạnh (IA):**
  - **IA-01 (Tiêu chuẩn chung & Responsive):** 18 items $\rightarrow$ 7 Passed, 11 Failed, 0 Not Run.
  - **IA-02 (Biểu mẫu & Dữ liệu):** 18 items $\rightarrow$ 4 Passed, 13 Failed, 1 Not Run.
  - **IA-03 (Điều hướng & Tương tác):** 16 items $\rightarrow$ 6 Passed, 10 Failed, 0 Not Run.
  - **IA-04 (Phản hồi & Trạng thái lỗi):** 18 items $\rightarrow$ 3 Passed, 14 Failed, 1 Not Run.

---

## 3. Các Lỗi Giao Diện & Hành Vi Nổi Bật Phát Hiện Trên SUT

Bộ kiểm thử đã phản ánh trung thực trạng thái hiện tại của ứng dụng SUT (không sửa mã nguồn SUT để làm test xanh giả tạo):
1. **Màn hình Danh sách sản phẩm (FR-05):**
   - Giá hiển thị ký hiệu `VND` thay vì `₫` chuẩn đặc tả (GUI-018).
   - Trang chủ vi phạm cấu trúc thẻ tiêu đề: có 2 thẻ `<h1>` ("Danh sách sản phẩm" và "Hiển thị 5 sản phẩm") (GUI-019).
   - Ô tìm kiếm render HTML thô qua `dangerouslySetInnerHTML`, tiềm ẩn rủi ro XSS (GUI-021).
2. **Màn hình Quên mật khẩu (FR-03):**
   - Tiêu đề form là `<h2>Quên Mật Khẩu</h2>`, trang hoàn toàn thiếu thẻ `<h1>` (GUI-003).
   - Ô nhập email có thuộc tính `type="text"` thay vì `type="email"` (GUI-004).
   - Thiếu chỉ báo bước (step indicator) (GUI-005) và thiếu trường xác nhận mật khẩu mới (GUI-006).
   - Backend sinh mã OTP 4 chữ số thay vì 6 chữ số theo đặc tả (GUI-008, GUI-013).
   - Nút quay lại không có đường link về trang đăng nhập `/login` (GUI-009).
3. **Màn hình Giỏ hàng (FR-07):**
   - Header bảng ghi "Giá" thay vì "Đơn giá" (GUI-032); nhãn hiển thị "Tổng tạm tính" thay vì "Tổng cộng" (GUI-033).
   - Hoàn toàn thiếu nút tăng giảm số lượng (+/−) và ô nhập trực tiếp trong bảng giỏ hàng (GUI-036, GUI-037).
   - Nút quay lại ghi "← Mua tiếp" thay vì "Tiếp tục mua sắm" (GUI-041).
   - Giỏ hàng lưu trên React memory, không đồng bộ xuống storage hoặc API giỏ hàng.
4. **Màn hình Quản trị viên (FR-15):**
   - Bảng quản lý sản phẩm thiếu cột hiển thị "Danh mục" (GUI-047).
   - Nút xóa sản phẩm gọi xóa trực tiếp và alert trình duyệt, thiếu modal cảnh báo xác nhận xóa (GUI-061).
   - **Lỗi nghiêm trọng (State Mutation):** Chỉnh sửa sản phẩm A làm thay đổi toàn bộ tên các sản phẩm khác trong local React state (`App.jsx:110`) (GUI-060).

---

## 4. Danh Mục Tập Tin Đầu Ra & Bàn Giao

| Đường dẫn tập tin | Nội dung & Vai trò |
| :--- | :--- |
| [`docs/gui-checklist/EShop-GUI-Checklist.xlsx`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/EShop-GUI-Checklist.xlsx) | Sổ làm việc Excel đã được cập nhật an toàn 4 cột (`status`, `actual_result`, `notes`, `evidence_path`) từ kết quả chạy Chrome thật |
| [`docs/gui-checklist/backups/`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/backups/) | Thư mục chứa bản sao lưu nguyên bản byte của file Excel trước khi ghi |
| [`docs/gui-checklist/automation/execution-summary.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/execution-summary.md) | Báo cáo tổng kết thực thi kiểm thử chi tiết |
| [`docs/gui-checklist/automation/bug-report.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/bug-report.md) | Báo cáo chi tiết 48 lỗi phát hiện trên SUT kèm truy vết checklist |
| [`docs/gui-checklist/automation/issue-drafts/`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/issue-drafts/) | 48 bản nháp GitHub Issues (`BUG-GUI-*.md`) và danh mục JSON (`issues.json`) |
| [`docs/gui-checklist/automation/manual-checks.md`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/manual-checks.md) | Tài liệu hướng dẫn thực hiện và nhập kết quả kiểm tra thủ công cho GUI-065 & GUI-066 |
| [`docs/gui-checklist/automation/git-commit-log.txt`](file:///Users/thuytran/Workspace/eshop-sut/docs/gui-checklist/automation/git-commit-log.txt) | Lịch sử commit Git có ngày giờ ISO-8601 và author provenance |
| [`tests/gui/`](file:///Users/thuytran/Workspace/eshop-sut/tests/gui/) | Toàn bộ mã nguồn kiểm thử tự động Playwright TypeScript, Page Objects, runner và test suites |

```
