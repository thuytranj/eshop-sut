# Hồ sơ kiểm thử EShop — Domain Testing và BVA

## 1. Phạm vi và chức năng được chọn

| Nhóm theo đề | Chức năng trong hồ sơ | Giao diện và phạm vi |
|---|---|---|
| Feature A — Pool A | FR-03: Quên mật khẩu và đặt lại mật khẩu | Backend API và customer WEB |
| Feature B — Pool B | FR-07: Giỏ hàng | Backend API và customer WEB; FR-06 chỉ là dependency để thêm hàng |
| Feature C — Pool C | FR-15: Quản lý sản phẩm | Backend API và Admin WEB; quyền ghi FR-12 là dependency |
| Feature D — Mobile | FR-05: Danh sách và tìm kiếm sản phẩm | Native iOS, có API hỗ trợ; không suy kết quả thành Android hoặc Expo web |

## 2. Bảng tự đánh giá

| STT | Tiêu chí | Điểm tối đa | Điểm tự đánh giá | 
|---|---|---:|---|
| 1 | Feature A — Domain Testing + BVA (FR-03) | 25 | 25 | 
| 2 | Feature B — Domain Testing + BVA (FR-07) | 25 | 25 | 
| 3 | Feature C — Domain Testing + BVA (FR-15) | 25 | 25 |
| 4 | Feature D — Mobile, Domain Testing + BVA (FR-05) | 15 | 15 | 
| 5 | Agent Skills | 10 | 5 |
| | **Tổng** | **100** | **95** | 

## 3. Báo cáo tổng kết kiểm thử

### 3.1. Số lượng test case theo chức năng

| Chức năng | Designed | Executed (P+F) | Passed | Failed | Blocked | Not Run | Chưa hoàn tất (B+NR) |
|---|---:|---:|---:|---:|---:|---:|---:|
| FR-03 — Quên mật khẩu và đặt lại mật khẩu hai bước | 52 | 47 | 27 | 20 | 5 | 0 | 5 |
| FR-05 — Danh sách và tìm kiếm sản phẩm (native iOS) | 45 | 35 | 23 | 12 | 10 | 0 | 10 |
| FR-07 — Giỏ hàng | 32 | 28 | 13 | 15 | 4 | 0 | 4 |
| FR-15 — Quản lý sản phẩm | 158 | 151 | 56 | 95 | 7 | 0 | 7 |
| **Tổng: 4 chức năng** | **287** | **261** | **119** | **142** | **26** | **0** | **26** |

### 3.2. Số lượng bug

| Chức năng |  Tổng  |
|---|---:|
| FR-03 | 5 | 
| FR-05 | 5 | 
| FR-07 | 7 | 
| FR-15 | 5 | 
| **Tổng** | **22** |

Link video Agent Skills: 