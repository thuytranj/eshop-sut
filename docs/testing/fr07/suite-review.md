# Rà soát, Hợp nhất & Đóng băng Bộ Ca Kiểm thử (Suite Review & Deduplication) - FR-07

## 1. Sổ Nhật ký Hiệu chỉnh & Tự Rà soát (Correction Ledger & Self-Review)

Quá trình rà soát được thực hiện độc lập bởi AI Coding Assistant (Assistant Self-Review); Đánh giá của người học (Learner Review) đang ở trạng thái **Đang chờ (Pending)**.

### 1.1. Bảng ghi nhận hiệu chỉnh (Correction Ledger)
| Mã mục | Đối tượng rà soát | Trước khi rà soát | Sau khi rà soát | Rationale / Căn cứ kỹ thuật | Người rà soát |
|---|---|---|---|---|---|
| **REV-01** | Trạng thái nút +/- khi $q=1$ | Định nghĩa BVA cho phép bấm nút "-" tại $q=1$ | Đưa thao tác minus tại $q=1$ vào Ambiguity (AMB-02) và probe, chỉ test $q: 3 \to 2$ có oracle rõ ràng | Đặc tả không quy định rõ nút "-" tại $q=1$ là disable, giữ nguyên, hay xóa sản phẩm | Assistant Self-Review |
| **REV-02** | Phân tách tầng API và WEB | Dự kiến gộp các ca merge lặp lại giữa API và WEB | Tách biệt hoàn toàn: API test trên HTTP endpoint, WEB test trên React DOM | API và WEB có state store và payload khác nhau; tránh dùng API để suy diễn UI | Assistant Self-Review |
| **REV-03** | Ràng buộc phụ thuộc thêm vào giỏ | Các ca test giỏ hàng mặc định thêm sản phẩm thành công | Tách riêng dependency FR06-Q và ghi nhận lỗi phụ thuộc nếu click Add không chạy | Tuân thủ nguyên tắc không tự ý sửa DOM hoặc click lén 2 lần để ép pass | Assistant Self-Review |
| **REV-04** | Kiểm tra sự hiện diện trước tương tác | Chạy trực tiếp thao tác bấm nút và xóa | Tạo các ca kiểm tra sự hiện diện (Presence check) độc lập cho nút +/- và Dialog xóa | Nếu UI thiếu nút hoặc dialog, ca presence Failed và ca tương tác dependent bị Blocked | Assistant Self-Review |

---

## 2. Chiến lược Hợp nhất Kịch bản Kiểm thử (Execution Scenario Deduplication)

### 2.1. Quy tắc Hợp nhất (Deduplication Rules)
Chỉ thực hiện hợp nhất hai hoặc nhiều ca kiểm thử nguồn thành một ca kiểm thử chuẩn (Canonical Case) khi thỏa mãn toàn bộ các điều kiện sau:
1. **Cùng tầng thực thi (Same Layer):** Cùng là API hoặc cùng là WEB.
2. **Cùng trạng thái ban đầu (Same Initial State):** Cùng xuất phát từ giỏ hàng rỗng hoặc giỏ có cùng fixture sản phẩm.
3. **Cùng chuỗi thao tác tuần tự (Same Ordered Actions):** Thực hiện đúng cùng các bước nhập liệu/click.
4. **Hợp nhất đầy đủ các khẳng định (Assertion Union):** Ca hợp nhất phải kiểm tra đồng thời toàn bộ các tiêu chí kỳ vọng của các ca nguồn, không chỉ đơn thuần gộp nhãn.
5. **Gộp tập hợp kỹ thuật và nghĩa vụ (Technique & Obligation Union):** Trường `techniques`, `sourceCaseIds`, `obligations`, `rules` nhận giá trị hợp (union set).

### 2.2. Bảng Hợp nhất Kịch bản (Deduplication Mapping Table)
Từ **42 ca kiểm thử nguồn** (29 Domain Testing + 13 BVA), hệ thống đã tối ưu và hợp nhất thành **32 ca kiểm thử chuẩn (Canonical Cases)**:

| Mã chuẩn (Canonical ID) | Tầng | Các ca nguồn được gộp (Source Case IDs) | Kỹ thuật (Techniques) | Mã nghĩa vụ bao phủ (Obligations Covered) |
|---|---|---|---|---|
| `FR07-TC-001` | WEB | `FR07-DT-EMPTY-001`, `FR07-BVA-CARTN-001` | Domain Testing, BVA | `FR07-OBL-DT-EMPTY-ON`, `FR07-OBL-BVA-CARTN-0` |
| `FR07-TC-002` | WEB | `FR07-DT-EMPTY-002`, `FR07-DT-QTY-001`, `FR07-BVA-ADDQ-003`, `FR07-BVA-CARTN-002`, `FR07-BVA-REPEAT-WEB-001` | Domain Testing, BVA | `FR07-OBL-DT-EMPTY-OFF1`, `FR07-OBL-DT-QTY-ON`, `FR07-OBL-BVA-ADDQ-1`, `FR07-OBL-BVA-CARTN-1`, `FR07-OBL-BVA-REP-WEB-0` |
| `FR07-TC-003` | WEB | `FR07-DT-QTY-002`, `FR07-BVA-ADDQ-002` | Domain Testing, BVA | `FR07-OBL-DT-QTY-OFF-0`, `FR07-OBL-BVA-ADDQ-0` |
| `FR07-TC-004` | WEB | `FR07-DT-QTY-003`, `FR07-BVA-ADDQ-004` | Domain Testing, BVA | `FR07-OBL-DT-QTY-OFF-2`, `FR07-OBL-BVA-ADDQ-2` |
| `FR07-TC-005` | WEB | `FR07-DT-QTY-005`, `FR07-BVA-ADDQ-001` | Domain Testing, BVA | `FR07-OBL-DT-QTY-NEG`, `FR07-OBL-BVA-ADDQ-NEG1` |
| `FR07-TC-006` | WEB | `FR07-DT-QTY-004` | Domain Testing | `FR07-OBL-DT-QTY-IN` |
| `FR07-TC-007` | WEB | `FR07-DT-QTY-006` | Domain Testing | `FR07-OBL-DT-QTY-FRAC` |
| `FR07-TC-008` | WEB | `FR07-DT-QTY-007` | Domain Testing | `FR07-OBL-DT-QTY-EMPTY` |
| `FR07-TC-009` | API | `FR07-DT-MERGE-API-001`, `FR07-BVA-REPEAT-API-002` | Domain Testing, BVA | `FR07-OBL-DT-MERGE-API-1`, `FR07-OBL-BVA-REP-API-1` |
| `FR07-TC-010` | API | `FR07-DT-MERGE-API-002` | Domain Testing | `FR07-OBL-DT-MERGE-API-2` |
| `FR07-TC-011` | API | `FR07-BVA-REPEAT-API-001` | BVA | `FR07-OBL-BVA-REP-API-0` |
| `FR07-TC-012` | API | `FR07-BVA-REPEAT-API-003` | BVA | `FR07-OBL-BVA-REP-API-2` |
| `FR07-TC-013` | API | `FR07-DT-NEW-API-001` | Domain Testing | `FR07-OBL-DT-NEW-API` |
| `FR07-TC-014` | WEB | `FR07-DT-MERGE-WEB-001`, `FR07-BVA-REPEAT-WEB-002` | Domain Testing, BVA | `FR07-OBL-DT-MERGE-WEB-1`, `FR07-OBL-BVA-REP-WEB-1` |
| `FR07-TC-015` | WEB | `FR07-DT-MERGE-WEB-002` | Domain Testing | `FR07-OBL-DT-MERGE-WEB-2` |
| `FR07-TC-016` | WEB | `FR07-BVA-REPEAT-WEB-003` | BVA | `FR07-OBL-BVA-REP-WEB-2` |
| `FR07-TC-017` | WEB | `FR07-DT-MERGE-WEB-003` | Domain Testing | `FR07-OBL-DT-MERGE-WEB-IN` |
| `FR07-TC-018` | WEB | `FR07-DT-NEW-WEB-001` | Domain Testing | `FR07-OBL-DT-NEW-WEB` |
| `FR07-TC-019` | WEB | `FR07-BVA-CARTN-003` | BVA | `FR07-OBL-BVA-CARTN-2` |
| `FR07-TC-020` | WEB | `FR07-DT-CONTROL-001` | Domain Testing | `FR07-OBL-DT-CTRL-PRESENCE` |
| `FR07-TC-021` | WEB | `FR07-DT-CONTROL-002` | Domain Testing | `FR07-OBL-DT-CTRL-PLUS` |
| `FR07-TC-022` | WEB | `FR07-DT-CONTROL-003` | Domain Testing | `FR07-OBL-DT-CTRL-MINUS` |
| `FR07-TC-023` | WEB | `FR07-DT-DELETE-001` | Domain Testing | `FR07-OBL-DT-DEL-DIALOG-PRESENCE` |
| `FR07-TC-024` | WEB | `FR07-DT-DELETE-002` | Domain Testing | `FR07-OBL-DT-DEL-CANCEL` |
| `FR07-TC-025` | WEB | `FR07-DT-DELETE-003` | Domain Testing | `FR07-OBL-DT-DEL-CONFIRM` |
| `FR07-TC-026` | WEB | `FR07-DT-DELETE-004` | Domain Testing | `FR07-OBL-DT-DEL-LAST` |
| `FR07-TC-027` | WEB | `FR07-DT-DISPLAY-001` | Domain Testing | `FR07-OBL-DT-DISP-COLUMNS` |
| `FR07-TC-028` | WEB | `FR07-DT-DISPLAY-002` | Domain Testing | `FR07-OBL-DT-DISP-LABEL` |
| `FR07-TC-029` | WEB | `FR07-DT-DISPLAY-003` | Domain Testing | `FR07-OBL-DT-DISP-CONTINUE` |
| `FR07-TC-030` | API | `FR07-DT-AUTH-001` | Domain Testing | `FR07-OBL-DT-AUTH-GET-VAL` |
| `FR07-TC-031` | API | `FR07-DT-AUTH-002` | Domain Testing | `FR07-OBL-DT-AUTH-GET-NO` |
| `FR07-TC-032` | API | `FR07-DT-AUTH-003` | Domain Testing | `FR07-OBL-DT-AUTH-POST-INV` |

---

## 3. Công cụ Kiểm tra Tính toàn vẹn (Harness Validator Verification)

Tệp thực thi `tests/fr07/validate-suite.cjs` đã được xây dựng và kiểm chứng thành công bằng tự kiểm tra (`--self-check`):
1. **Kiểm tra Schema & Format:** Xác minh 100% ca có đủ 14 trường dữ liệu bắt buộc.
2. **Kiểm tra Định danh Độc nhất:** Loại trừ các ID chuẩn trùng lặp hoặc ID nguồn bị gán 2 lần.
3. **Kiểm tra Trạng thái Đóng băng:** Bắt buộc toàn bộ các ca khởi tạo có `status: "Not Run"`, `actual: null`, `evidence: []`.
4. **Kiểm tra Đối chiếu Thực thi (Reconciliation):** Đảm bảo mỗi ca canonical đều có tương ứng bản ghi quan sát (observation) khi thực thi xong.

---

## 4. Chứng nhận Đóng băng Suite & Hash Truy vết (Suite Freeze & Traceability)

- **Đường dẫn tệp Suite:** `tests/fr07/suite.json`
- **Phiên bản:** `v1.0-frozen`
- **Tổng số ca Canonical:** **32**
  - Tầng API: 8 ca
  - Tầng WEB: 24 ca
- **Tổng số ca nguồn được bao phủ:** **42 / 42** (100% không bỏ sót)
- **Tổng số nghĩa vụ kiểm thử được bảo toàn:** **42 / 42** (29 Domain Testing + 13 BVA)
- **Mã băm toàn vẹn (Suite SHA-256 Hash):**
  ```text
  d5b27da8bc248a71efad036aa879a9a9eeead0ef80ce7c42b2d9f1fc18149e0d
  ```
