# Báo cáo Tổng kết Kiểm thử FR-07: Giỏ hàng (Shopping Cart)

## 1. Giới thiệu & Phạm vi Kiểm thử (Overview & Scope)

Tài liệu này tổng hợp toàn bộ hoạt động kiểm thử chức năng **FR-07: Giỏ hàng (Shopping Cart)** trong hệ thống EShop SUT, thuộc bài tập lớn HW02 môn Kiểm thử Phần mềm.
Quá trình kiểm thử áp dụng nghiêm ngặt hai kỹ thuật kiểm thử hộp đen chuẩn mực:
1. **Domain Testing (On/Off/In Analysis):** Phân tích miền giá trị, vị từ và điểm biên đa biến.
2. **Boundary Value Analysis (ISTQB 3-Value BVA):** Phân tích giá trị biên 3 điểm lân cận cho toàn bộ các chiều có thứ tự.

### Phạm vi kiểm thử:
- **Tầng giao diện (Customer Web):** Các tính năng hiển thị bảng giỏ hàng, cập nhật số lượng, xóa sản phẩm, nhãn tổng tiền, điều hướng và trạng thái giỏ trống.
- **Tầng giao diện lập trình (Cart API):** Các endpoint `GET /api/cart` và `POST /api/cart`, cơ chế gộp số lượng và xác thực token Bearer.
- **Giới hạn loại trừ:** Không kiểm thử chức năng Checkout (FR-08), Coupon (FR-09), Admin Web hay Mobile App. Thao tác thêm vào giỏ từ chi tiết sản phẩm (FR-06) chỉ đóng vai trò tiền điều kiện/phụ thuộc.

---

## 2. Thống kê Kiểm thử & Tóm tắt Kết quả (Test Statistics)

| Hạng mục thống kê | Số lượng | Tỷ lệ (%) | Chi tiết / Diễn giải |
|---|---|---|---|
| **Số ca kiểm thử thiết kế (Designed Canonical)** | **32** | 100% | 8 ca API + 24 ca WEB |
| **Số ca nguồn được bao phủ (Source Cases)** | **42** | 100% | 29 Domain Testing + 13 BVA |
| **Số ca đã nỗ lực chạy (Attempted)** | **32** | 100% | 100% ca đã được attempt qua runner tự động |
| **Số ca có phán quyết (Executed)** | **28** | 87.5% | $28 = \text{Passed} (13) + \text{Failed} (15)$ |
| **Số ca Đạt (Passed)** | **13** | 40.6% | 5 ca API + 8 ca WEB |
| **Số ca Thất bại (Failed)** | **15** | 46.9% | 3 ca API + 12 ca WEB (phát hiện sai lệch so với đặc tả) |
| **Số ca Bị chặn (Blocked)** | **4** | 12.5% | Do UI thiếu nút +/- và dialog xác nhận xóa |
| **Số ca Chưa thực thi (Not Run)** | **0** | 0% | Toàn bộ các ca thiết kế đều đã được chạy |
| **Tổng số Lỗi phần mềm phát hiện (Bugs)** | **7** | - | 6 lỗi trực tiếp thuộc FR-07 + 1 lỗi phụ thuộc FR-06 |

---

## 3. Danh mục Lỗi Phần mềm Phát hiện (Defect Summary)

| Mã Lỗi | Tóm tắt Khiếm khuyết | Tầng | Quy tắc Vi phạm | Mức độ |
|---|---|---|---|---|
| `FR07-BUG-001` | Thêm cùng sản phẩm không gộp số lượng mà tạo dòng mới | API & WEB | `FR07-R02` | **Major** |
| `FR07-BUG-002` | Bảng giỏ hàng thiếu nút '+' và '-' để chỉnh số lượng | WEB | `FR07-R03` | **High** |
| `FR07-BUG-003` | Xóa sản phẩm bị xóa ngay lập tức, không có dialog xác nhận | WEB | `FR07-R04` | **Medium** |
| `FR07-BUG-004` | Tiêu đề cột bị sai thành 'Giá' thay vì 'Đơn giá' | WEB | `FR07-R01` | **Low** |
| `FR07-BUG-005` | Nhãn tổng tiền bị sai thành 'Tổng tạm tính:' thay vì 'Tổng cộng' | WEB | `FR07-R06` | **Low** |
| `FR07-BUG-006` | Trạng thái giỏ trống thiếu hình ảnh minh họa | WEB | `FR07-R07` | **Low** |
| `FR07-BUG-007` | [Dependency] Bấm nút 'Thêm vào giỏ hàng' không chạy ở lần bấm đầu | WEB | `FR06-Q` | **Major** |

---

## 4. Cấu trúc Hồ sơ Tài liệu & Bằng chứng (Artifact Map)

- [requirements.md](requirements.md): Cơ sở kiểm thử, phân tích quy tắc nghiệp vụ `FR07-R01..R08`, không gian biến và sổ đăng ký điểm mơ hồ `AMB-01..07`.
- [domain-model.md](domain-model.md): Mô hình vị từ toán học, phân tích On/Off/In, tọa độ và bảng điểm khả thi.
- [domain-cases.md](domain-cases.md): 29 ca kiểm thử nguồn Domain Testing và ma trận độ bao phủ 29 nghĩa vụ.
- [bva-report.md](bva-report.md): Báo cáo phân tích giá trị biên ISTQB 3-value BVA, dẫn xuất 13 nghĩa vụ giá trị biên và 13 ca kiểm thử nguồn BVA.
- [suite-review.md](suite-review.md): Biên bản rà soát, hợp nhất 42 ca nguồn thành 32 ca chuẩn, mã băm SHA-256.
- [test-results.md](test-results.md): Bảng kết quả thực thi chi tiết, phân tích Pass/Fail/Blocked và ma trận độ bao phủ thực tế.
- [bugs.md](bugs.md): Báo cáo 7 lỗi phần mềm chi tiết kèm mã nguồn gây lỗi và ảnh chụp bằng chứng.
- [ai-interactions.md](ai-interactions.md): Nhật ký tương tác AI có provenance, đầy đủ prompt/output/timestamps.
- [ai-gap-analysis.md](ai-gap-analysis.md): Phân tích khoảng trống AI và đoạn nhận xét AI Critique 200-300 từ.
- [evidence/fr07-run01/](evidence/fr07-run01/): Thư mục bằng chứng thực nghiệm gồm `manifest.json`, log API `observations.json`, log Web `observations.json`, và 34 ảnh chụp màn hình UI PNG.
