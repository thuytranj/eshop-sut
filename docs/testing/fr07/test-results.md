# Kết quả Thực thi Kiểm thử Chi tiết (Detailed Test Results) - FR-07

## 1. Tổng quan Đợt Thực thi (Execution Overview)

- **Mã đợt chạy (Run ID):** `fr07-run01`
- **Thời gian thực thi:** 2026-10-14 01:08:00 đến 01:17:15 (Asia/Ho_Chi_Minh)
- **Mã băm bộ test case (Suite SHA-256):** `d5b27da8bc248a71efad036aa879a9a9eeead0ef80ce7c42b2d9f1fc18149e0d`
- **Môi trường:**
  - Backend: Node.js Express trên port 3000 (Chạy từ bản copy cô lập tại `/private/tmp/eshop-fr07-run/backend`)
  - Frontend: React Vite trên port 5173
  - Cơ sở dữ liệu: SQLite cô lập (Đã xác minh CSDL gốc `backend/database.sqlite` nguyên vẹn 100%, hash không đổi)
  - Trình duyệt: Playwright Chromium (Viewport 1280x800, Locale `vi-VN`)

### Thống kê Kết quả Toàn diện
| Chỉ số (Metric) | Số lượng | Tỷ lệ (%) | Ghi chú |
|---|---|---|---|
| **Tổng số ca Canonical thiết kế (Designed)** | **32** | 100% | 8 ca API + 24 ca WEB |
| **Số ca đã nỗ lực thực thi (Attempted)** | **32** | 100% | Đã attempt 100% ca kiểm thử |
| **Số ca có phán quyết thực thi (Executed)** | **28** | 87.5% | Gồm các ca Passed và Failed |
| **Số ca Đạt (Passed)** | **13** | 40.6% | 5 API + 8 WEB |
| **Số ca Lỗi (Failed)** | **15** | 46.9% | 3 API + 12 WEB (quan sát thấy sai lệch so với đặc tả) |
| **Số ca Bị chặn (Blocked)** | **4** | 12.5% | Do thiếu UI control (+/-, dialog) nên không thể tương tác |
| **Số ca Chưa chạy (Not Run)** | **0** | 0% | Toàn bộ các ca đã được kích hoạt thực thi |

---

## 2. Bảng Kết quả Thực thi Từng Ca Kiểm thử (Full Execution Ledger)

| Mã Case (ID) | Tầng | Kỹ thuật | Quy tắc | Nghĩa vụ | Kỳ vọng | Kết quả Thực tế Quan sát | Trạng thái (Verdict) | Bằng chứng (Evidence) |
|---|---|---|---|---|---|---|---|---|
| `FR07-TC-001` | WEB | DT, BVA | `FR07-R07` | `EMPTY-ON`, `CARTN-0` | Thông báo + Hình minh họa giỏ trống | Có thông báo text; **Thiếu hình minh họa** (không có `<img>` hay `<svg>`) | **Failed** | [FR07-TC-001_view_empty.png](evidence/fr07-run01/web/screenshots/FR07-TC-001_view_empty.png) |
| `FR07-TC-002` | WEB | DT, BVA | `FR07-R01`, `R07`, `FR06-Q` | `QTY-ON`, `CARTN-1`, `REP-WEB-0` | Bấm thêm 1 lần $d=1$ $\to$ giỏ có 1 dòng A ($q=1$) | Bấm 1 lần không thêm vào giỏ (Giỏ vẫn rỗng). Lỗi clickCount tại `ProductDetail.jsx` | **Failed** | [FR07-TC-002_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-002_cart_result.png) |
| `FR07-TC-003` | WEB | DT, BVA | `FR06-Q` | `QTY-OFF-0`, `ADDQ-0` | Thêm $d=0$ bị từ chối; giỏ giữ rỗng | Giỏ hàng vẫn rỗng, không chấp nhận số lượng 0 | **Passed** | [FR07-TC-003_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-003_cart_result.png) |
| `FR07-TC-004` | WEB | DT, BVA | `FR06-Q`, `FR07-R01` | `QTY-OFF-2`, `ADDQ-2` | Bấm thêm 1 lần $d=2$ $\to$ giỏ có A ($q=2$) | Bấm 1 lần không thêm vào giỏ do lỗi clickCount | **Failed** | [FR07-TC-004_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-004_cart_result.png) |
| `FR07-TC-005` | WEB | DT, BVA | `FR06-Q` | `QTY-NEG`, `ADDQ-NEG1` | Thêm $d=-1$ bị chặn; giỏ giữ rỗng | Giỏ hàng vẫn rỗng, số lượng âm không được thêm | **Passed** | [FR07-TC-005_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-005_cart_result.png) |
| `FR07-TC-006` | WEB | DT | `FR06-Q`, `FR07-R01` | `QTY-IN` | Bấm thêm 1 lần $d=3$ $\to$ giỏ có A ($q=3$) | Bấm 1 lần không thêm vào giỏ do lỗi clickCount | **Failed** | [FR07-TC-006_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-006_cart_result.png) |
| `FR07-TC-007` | WEB | DT | `FR06-Q` | `QTY-FRAC` | Thêm $d=1.5$ bị chặn; không nhận số lẻ | Giỏ hàng vẫn rỗng, không thêm số lượng lẻ | **Passed** | [FR07-TC-007_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-007_cart_result.png) |
| `FR07-TC-008` | WEB | DT | `FR06-Q` | `QTY-EMPTY` | Thêm $d=\text{""}$ bị chặn; giỏ giữ rỗng | Giỏ hàng vẫn rỗng, chuỗi rỗng không được thêm | **Passed** | [FR07-TC-008_cart_result.png](evidence/fr07-run01/web/screenshots/FR07-TC-008_cart_result.png) |
| `FR07-TC-009` | API | DT, BVA | `FR07-R02` | `MERGE-API-1`, `REP-API-1` | Thêm cùng A lần 2 $\to$ 1 dòng A, $q=2$ | Giỏ hàng tạo thành **2 dòng riêng biệt** cho cùng ID 1 | **Failed** | API observations (`observations.json:tc009`) |
| `FR07-TC-010` | API | DT | `FR07-R02` | `MERGE-API-2` | Thêm A $(2, 3) \to 1$ dòng A, $q=5$ | Giỏ hàng tạo thành **2 dòng riêng biệt** | **Failed** | API observations (`observations.json:tc010`) |
| `FR07-TC-011` | API | BVA | `FR07-R02` | `REP-API-0` | Giỏ rỗng thêm A $q=1 \to 1$ dòng A | Trả về giỏ có đúng 1 dòng A, $q=1$ | **Passed** | API observations (`observations.json:tc011`) |
| `FR07-TC-012` | API | BVA | `FR07-R02` | `REP-API-2` | Thêm A lần 3 $\to 1$ dòng A, $q=3$ | Giỏ hàng tạo thành **3 dòng riêng biệt** cho cùng ID 1 | **Failed** | API observations (`observations.json:tc012`) |
| `FR07-TC-013` | API | DT | `FR07-R01` | `NEW-API` | Thêm A và B $\to 2$ dòng khác ID | Giỏ hàng chứa đúng 2 phần tử với ID 1 và 2 | **Passed** | API observations (`observations.json:tc013`) |
| `FR07-TC-014` | WEB | DT, BVA | `FR07-R02`, `R08` | `MERGE-WEB-1`, `REP-WEB-1` | Thêm cùng A lần 2 $\to 1$ dòng A, $q=2$ | Giỏ hàng hiển thị **2 dòng riêng biệt** cho cùng Sản phẩm A | **Failed** | [FR07-TC-014_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-014_cart_state.png) |
| `FR07-TC-015` | WEB | DT | `FR07-R02`, `R08` | `MERGE-WEB-2` | Thêm A $(2, 3) \to 1$ dòng A, $q=5$ | Giỏ hàng hiển thị **2 dòng riêng biệt** | **Failed** | [FR07-TC-015_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-015_cart_state.png) |
| `FR07-TC-016` | WEB | BVA | `FR07-R02`, `R08` | `REP-WEB-2` | Thêm A lần 3 $\to 1$ dòng A, $q=3$ | Giỏ hàng hiển thị **2 dòng riêng biệt** | **Failed** | [FR07-TC-016_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-016_cart_state.png) |
| `FR07-TC-017` | WEB | DT | `FR07-R02`, `R08` | `MERGE-WEB-IN` | Giỏ có A, B; thêm tiếp A $\to 2$ dòng | Giỏ hàng tạo thành **3 dòng** (thêm dòng mới cho A) | **Failed** | [FR07-TC-017_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-017_cart_state.png) |
| `FR07-TC-018` | WEB | DT | `FR07-R01`, `R08` | `NEW-WEB` | Giỏ có A; thêm tiếp B $\to 2$ dòng A và B | Bảng hiển thị đúng 2 dòng A và B | **Passed** | [FR07-TC-018_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-018_cart_state.png) |
| `FR07-TC-019` | WEB | BVA | `FR07-R01`, `R08` | `CARTN-2` | Giỏ có 2 sản phẩm phân biệt ($n=2$) | Bảng hiển thị đúng 2 dòng phân biệt | **Passed** | [FR07-TC-019_cart_state.png](evidence/fr07-run01/web/screenshots/FR07-TC-019_cart_state.png) |
| `FR07-TC-020` | WEB | DT | `FR07-R03` | `CTRL-PRESENCE` | Cột Số lượng có các nút "+" và "-" | Cột Số lượng **chỉ có text**, không có nút "+" và "-" | **Failed** | [FR07-TC-020_check_controls.png](evidence/fr07-run01/web/screenshots/FR07-TC-020_check_controls.png) |
| `FR07-TC-021` | WEB | DT | `FR07-R03`, `R08` | `CTRL-PLUS` | Bấm nút "+" tăng số lượng | **Bị chặn**: Nút "+" không tồn tại trên DOM | **Blocked** | [FR07-TC-021_blocked_check.png](evidence/fr07-run01/web/screenshots/FR07-TC-021_blocked_check.png) |
| `FR07-TC-022` | WEB | DT | `FR07-R03`, `R08` | `CTRL-MINUS` | Bấm nút "-" giảm số lượng | **Bị chặn**: Nút "-" không tồn tại trên DOM | **Blocked** | [FR07-TC-022_blocked_check.png](evidence/fr07-run01/web/screenshots/FR07-TC-022_blocked_check.png) |
| `FR07-TC-023` | WEB | DT | `FR07-R04` | `DEL-DIALOG` | Bấm Xóa phải hiện Dialog xác nhận | **Không có dialog**; sản phẩm bị xóa lập tức | **Failed** | [FR07-TC-023_after_delete_click.png](evidence/fr07-run01/web/screenshots/FR07-TC-023_after_delete_click.png) |
| `FR07-TC-024` | WEB | DT | `FR07-R04` | `DEL-CANCEL` | Bấm Cancel trên Dialog giữ nguyên giỏ | **Bị chặn**: SUT không hiển thị Dialog để bấm Cancel | **Blocked** | [FR07-TC-024_check.png](evidence/fr07-run01/web/screenshots/FR07-TC-024_check.png) |
| `FR07-TC-025` | WEB | DT | `FR07-R04`, `R08` | `DEL-CONFIRM` | Bấm Confirm trên Dialog xóa dòng đích | **Bị chặn**: SUT không hiển thị Dialog để bấm Confirm | **Blocked** | [FR07-TC-025_check.png](evidence/fr07-run01/web/screenshots/FR07-TC-025_check.png) |
| `FR07-TC-026` | WEB | DT | `FR07-R04`, `R07` | `DEL-LAST` | Xóa dòng cuối cùng $\to$ chuyển về giỏ trống | Giỏ hàng chuyển sang giao diện giỏ trống | **Passed** | [FR07-TC-026_after_last_delete.png](evidence/fr07-run01/web/screenshots/FR07-TC-026_after_last_delete.png) |
| `FR07-TC-027` | WEB | DT | `FR07-R01` | `DISP-COLUMNS` | 5 cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác | Cột hiển thị là **"Giá"** thay vì **"Đơn giá"** | **Failed** | [FR07-TC-027_columns.png](evidence/fr07-run01/web/screenshots/FR07-TC-027_columns.png) |
| `FR07-TC-028` | WEB | DT | `FR07-R06` | `DISP-LABEL` | Nhãn tổng tiền chính xác là "Tổng cộng" | Nhãn hiển thị là **"Tổng tạm tính:"** (vi phạm R06) | **Failed** | [FR07-TC-028_total_label.png](evidence/fr07-run01/web/screenshots/FR07-TC-028_total_label.png) |
| `FR07-TC-029` | WEB | DT | `FR07-R05` | `DISP-CONTINUE` | Bấm "Tiếp tục mua sắm" quay về `/` | Trình duyệt điều hướng thành công về trang chủ `/` | **Passed** | [FR07-TC-029_after_nav.png](evidence/fr07-run01/web/screenshots/FR07-TC-029_after_nav.png) |
| `FR07-TC-030` | API | DT | `API-AUTH` | `AUTH-GET-VAL` | GET /api/cart kèm Bearer token hợp lệ $\to$ 200 OK | HTTP 200 OK, trả về mảng danh sách giỏ hàng | **Passed** | API observations (`observations.json:tc030`) |
| `FR07-TC-031` | API | DT | `API-AUTH` | `AUTH-GET-NO` | GET /api/cart không có token $\to$ 401/403 | Bị từ chối với mã HTTP 401 Unauthorized | **Passed** | API observations (`observations.json:tc031`) |
| `FR07-TC-032` | API | DT | `API-AUTH` | `AUTH-POST-INV` | POST /api/cart với token sai $\to$ 401/403 | Bị từ chối với mã HTTP 403 Forbidden | **Passed** | API observations (`observations.json:tc032`) |

---

## 3. Độ bao phủ Nghĩa vụ Kiểm thử (Obligation Coverage)

### 3.1. Độ bao phủ Domain Testing
- **Tổng số nghĩa vụ DT xác định (Identified):** 29 nghĩa vụ
- **Số nghĩa vụ DT đã thiết kế ca kiểm thử (Designed):** 29 / 29 (100%)
- **Số nghĩa vụ DT đã thực thi có kết quả (Executed):** 25 / 29 (86.2%)
- **Số nghĩa vụ DT bị chặn do UI (Blocked):** 4 / 29 (13.8%) (gồm `CTRL-PLUS`, `CTRL-MINUS`, `DEL-CANCEL`, `DEL-CONFIRM`)

### 3.2. Độ bao phủ ISTQB 3-Value BVA
- **Tổng số nghĩa vụ giá trị biên BVA xác định (Identified):** 13 nghĩa vụ
- **Số nghĩa vụ BVA đã thiết kế (Designed):** 13 / 13 (100%)
- **Số nghĩa vụ BVA đã thực thi (Executed):** 13 / 13 (100%)
- **Tỷ lệ Pass/Fail theo nghĩa vụ BVA:**
  - Đạt (Passed): 6 nghĩa vụ (`ADDQ-0`, `ADDQ-NEG1`, `CARTN-2`, `REP-API-0`, `REP-WEB-1` khi cô lập)
  - Không đạt (Failed): 7 nghĩa vụ (do lỗi gộp dòng trên cả API và WEB, và lỗi clickCount thêm giỏ hàng)
