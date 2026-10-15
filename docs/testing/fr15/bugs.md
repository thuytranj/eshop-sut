# FR-15 — Báo cáo các nhóm bug đã quan sát

Báo cáo sử dụng evidence cuối cùng của **fr15-run03**. Có năm nhóm bug theo rule bị vi phạm, gồm một dependency FR-12. Nhiều Failed có thể cùng liên kết một nhóm; cách nhóm không chứng minh UI và API có cùng nguyên nhân trong code. SUT chưa được sửa và chưa publish GitHub Issues.

## Cách tái hiện tự động

Chạy lệnh dưới đây từ root repository với các đường dẫn và run ID mới. Runner tự chuẩn bị backend/SQLite riêng, reset fixture trước mỗi case và thực hiện các bước tương ứng. Sau khi chạy, mở record theo ID đại diện trong thư mục output; runner sẽ tự dừng process của nó.

```bash
node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun
```

Các bước mô tả ở từng bug là thao tác của test case đại diện trong môi trường cô lập. Payload đầy đủ nằm trong [suite.json](../../../tests/fr15/suite.json); các link evidence là bản ghi của run03 đã thực hiện.

## Môi trường chung

API: `http://localhost:3000`; Admin: `http://127.0.0.1:5174`; Node v22.17.1; timezone Asia/Ho_Chi_Minh. Phiên bản trình duyệt và viewport xem [browser metadata](evidence/fr15-run03/web/browser.json). Commit lúc bắt đầu: `5f9c73bf093c47e58188b46d20514b71149fb461`; hash harness tại thời điểm chạy nằm trong [manifest](evidence/fr15-run03/manifest.json).

## FR15-BUG-001 — Không kiểm tra đầy đủ tên bắt buộc và giới hạn 255 ký tự

**Severity:** Major. Dữ liệu hoặc thông tin quản lý sản phẩm không đáp ứng yêu cầu đã đặc tả.
**Rule/oracle:** FR15-R05; README.md:195.
**Case đại diện:** FR15-TC-075; tầng WEB; fixture `baseline`. Sử dụng tài khoản admin hợp lệ.

**Các bước trong case đại diện:**

1. Đăng nhập Admin, mở mục Sản phẩm trên fixture baseline có A/B/C.
2. Nhập tên gồm 256 ký tự ASCII A, giá 100000 và chọn danh mục 10. Giữ description/imageUrl theo payload của case.
3. Bấm Lưu sản phẩm, kiểm tra response và danh sách trước/sau reload.

**Expected result:** Tên vượt 255 ký tự phải bị từ chối, có phản hồi phù hợp và không làm thay đổi danh sách.
**Actual result:** Hệ thống thêm ID 304, làm số sản phẩm tăng từ 3 lên 4. Sản phẩm có tên quá dài vẫn xuất hiện trên UI sau reload.

Response trích từ evidence, giữ nguyên nội dung:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Product created",
    "id": 304
  }
}
```

Các ca API cùng nhóm còn kiểm tra tên bị omitted/null/rỗng và độ dài 256/257 trên Create/Update.

**Canonical case liên quan:** FR15-TC-002, FR15-TC-007, FR15-TC-013, FR15-TC-019, FR15-TC-020, FR15-TC-025, FR15-TC-026, FR15-TC-036, FR15-TC-041, FR15-TC-047, FR15-TC-053, FR15-TC-054, FR15-TC-059, FR15-TC-060, FR15-TC-075, FR15-TC-081, FR15-TC-088, FR15-TC-098, FR15-TC-104, FR15-TC-111, FR15-TC-151, FR15-TC-153, FR15-TC-155, FR15-TC-157.

**Evidence:**

- [FR15-TC-075_immediate.png](evidence/fr15-run03/web/screenshots/FR15-TC-075_immediate.png)
- [FR15-TC-075_reload.png](evidence/fr15-run03/web/screenshots/FR15-TC-075_reload.png)
- [FR15-TC-075.json](evidence/fr15-run03/web/FR15-TC-075.json)

**Tình trạng:** đã quan sát, chưa sửa. Việc publish lên GitHub Issues của nhóm cần yêu cầu riêng.

## FR15-BUG-002 — Không kiểm tra đầy đủ giá bắt buộc, dạng số và điều kiện lớn hơn 0

**Severity:** Major. Dữ liệu hoặc thông tin quản lý sản phẩm không đáp ứng yêu cầu đã đặc tả.
**Rule/oracle:** FR15-R06; README.md:196.
**Case đại diện:** FR15-TC-076; tầng WEB; fixture `baseline`. Sử dụng tài khoản admin hợp lệ.

**Các bước trong case đại diện:**

1. Đăng nhập Admin và mở mục Sản phẩm trên fixture baseline.
2. Nhập tên A lặp 128 lần, giá -1 và danh mục 10; giữ các field còn lại theo payload của case.
3. Bấm Lưu sản phẩm rồi đối chiếu dữ liệu trước/sau và UI sau reload.

**Expected result:** Giá âm phải bị từ chối; không được thêm sản phẩm.
**Actual result:** Hệ thống thêm ID 304 dù giá là -1, làm số sản phẩm tăng từ 3 lên 4.

Response trích từ evidence, giữ nguyên nội dung:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Product created",
    "id": 304
  }
}
```

Các ca liên quan kiểm tra giá omitted/null/rỗng/không phải số/âm/0 ở API và giá rỗng/âm/0 trên UI. Không kết luận lỗi chỉ vì UI gửi numeric string.

**Canonical case liên quan:** FR15-TC-008, FR15-TC-009, FR15-TC-014, FR15-TC-015, FR15-TC-017, FR15-TC-018, FR15-TC-020, FR15-TC-022, FR15-TC-024, FR15-TC-027, FR15-TC-028, FR15-TC-042, FR15-TC-043, FR15-TC-048, FR15-TC-049, FR15-TC-051, FR15-TC-052, FR15-TC-054, FR15-TC-056, FR15-TC-058, FR15-TC-061, FR15-TC-062, FR15-TC-076, FR15-TC-077, FR15-TC-082, FR15-TC-083, FR15-TC-085, FR15-TC-086, FR15-TC-088, FR15-TC-090, FR15-TC-099, FR15-TC-100, FR15-TC-105, FR15-TC-106, FR15-TC-108, FR15-TC-109, FR15-TC-111, FR15-TC-113.

**Evidence:**

- [FR15-TC-076_immediate.png](evidence/fr15-run03/web/screenshots/FR15-TC-076_immediate.png)
- [FR15-TC-076_reload.png](evidence/fr15-run03/web/screenshots/FR15-TC-076_reload.png)
- [FR15-TC-076.json](evidence/fr15-run03/web/FR15-TC-076.json)

**Tình trạng:** đã quan sát, chưa sửa. Việc publish lên GitHub Issues của nhóm cần yêu cầu riêng.

## FR15-BUG-003 — Cho phép lưu sản phẩm với danh mục bị thiếu hoặc không tồn tại

**Severity:** Major. Dữ liệu hoặc thông tin quản lý sản phẩm không đáp ứng yêu cầu đã đặc tả.
**Rule/oracle:** FR15-R07; README.md:197.
**Case đại diện:** FR15-TC-146; tầng WEB; fixture `empty-categories`. Sử dụng tài khoản admin hợp lệ.

**Các bước trong case đại diện:**

1. Chuẩn bị fixture empty-categories, đăng nhập Admin và mở mục Sản phẩm.
2. Nhập tên A lặp 128 lần và giá 100000. Trường danh mục không có option để chọn.
3. Bấm Lưu sản phẩm và kiểm tra payload thực, response cùng snapshot CSDL.

**Expected result:** Không được thêm sản phẩm khi không có danh mục hợp lệ.
**Actual result:** Dù inputEffective của danh mục là chuỗi rỗng, request thực gửi category_id=1. Danh mục 1 không tồn tại; hệ thống vẫn tạo sản phẩm ID 1, làm số sản phẩm tăng từ 0 lên 1.

Response trích từ evidence, giữ nguyên nội dung:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Product created",
    "id": 1
  }
}
```

Các ca API cùng nhóm gửi category_id=15 không tồn tại hoặc omitted/null/rỗng trên Create/Update.

**Canonical case liên quan:** FR15-TC-023, FR15-TC-029, FR15-TC-030, FR15-TC-031, FR15-TC-057, FR15-TC-063, FR15-TC-064, FR15-TC-065, FR15-TC-146, FR15-TC-147.

**Evidence:**

- [FR15-TC-146_immediate.png](evidence/fr15-run03/web/screenshots/FR15-TC-146_immediate.png)
- [FR15-TC-146_reload.png](evidence/fr15-run03/web/screenshots/FR15-TC-146_reload.png)
- [FR15-TC-146.json](evidence/fr15-run03/web/FR15-TC-146.json)

**Tình trạng:** đã quan sát, chưa sửa. Việc publish lên GitHub Issues của nhóm cần yêu cầu riêng.

## FR15-BUG-004 — Sửa một sản phẩm làm sai tên sản phẩm khác và để dữ liệu UI của target bị cũ

**Severity:** Major. Dữ liệu hoặc thông tin quản lý sản phẩm không đáp ứng yêu cầu đã đặc tả.
**Rule/oracle:** FR15-R08; README.md:198.
**Case đại diện:** FR15-TC-092; tầng WEB; fixture `baseline`. Sử dụng tài khoản admin hợp lệ.

**Các bước trong case đại diện:**

1. Đăng nhập Admin trên fixture baseline có A=101, B=202, C=303 với dữ liệu phân biệt.
2. Bấm Sửa ở A và lưu payload hợp lệ: tên A lặp 128 lần, giá 100000, danh mục 10 và các field còn lại theo case.
3. Quan sát bảng ngay sau lưu trước mọi reload; đối chiếu API/DB, rồi reload và quan sát lại.

**Expected result:** Chỉ A thay đổi đúng payload. Tên của B/C giữ nguyên ngay sau lưu và sau reload; các field đang hiển thị của target phải cập nhật đúng.
**Actual result:** API và DB lưu đúng dữ liệu của A, nhưng bảng ngay sau lưu đổi cả tên của B/C sang tên mới của A. Sau reload, tên B/C trở lại giá trị đã lưu. Số sản phẩm vẫn là 3.

Response trích từ evidence, giữ nguyên nội dung:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Product updated"
  }
}
```

Các ca sửa riêng field còn cho thấy dữ liệu hiển thị của target bị cũ. Case FR15-TC-134 ghi src ảnh trước/sau reload: UI tức thời còn URL cũ trong khi DB đã lưu URL mới. Đây là sai lệch UI, không phải bằng chứng toàn bộ bản ghi DB bị sửa.

**Canonical case liên quan:** FR15-TC-092, FR15-TC-094, FR15-TC-095, FR15-TC-096, FR15-TC-097, FR15-TC-101, FR15-TC-102, FR15-TC-103, FR15-TC-107, FR15-TC-112, FR15-TC-114, FR15-TC-131, FR15-TC-132, FR15-TC-133, FR15-TC-134, FR15-TC-135, FR15-TC-136, FR15-TC-158.

**Evidence:**

- [FR15-TC-092_immediate.png](evidence/fr15-run03/web/screenshots/FR15-TC-092_immediate.png)
- [FR15-TC-092_reload.png](evidence/fr15-run03/web/screenshots/FR15-TC-092_reload.png)
- [FR15-TC-092.json](evidence/fr15-run03/web/FR15-TC-092.json)

**Tình trạng:** đã quan sát, chưa sửa. Việc publish lên GitHub Issues của nhóm cần yêu cầu riêng.

## FR15-BUG-005 — [Dependency FR-12] API ghi sản phẩm không chặn token thiếu, lỗi hoặc không có quyền admin

**Severity:** High. Có thể ghi dữ liệu sản phẩm khi không có quyền.
**Rule/oracle:** FR12-DEP-WRITE; README.md:177–179.
**Case đại diện:** FR15-TC-137; tầng API; fixture `baseline`. Không gửi token.

**Các bước trong case đại diện:**

1. Chuẩn bị fixture baseline có danh mục 10 và các sản phẩm A/B/C.
2. Gửi POST /api/products với body hợp lệ của FR15-TC-137 nhưng không gửi Authorization header.
3. Đối chiếu response và snapshot sản phẩm trước/sau. Các ca cùng nhóm lặp lại với token lỗi, token user hợp lệ và thao tác PUT/DELETE.

**Expected result:** Từ chối thao tác không có quyền và giữ nguyên dữ liệu. Đặc tả chưa quy định mã HTTP lỗi cụ thể.
**Actual result:** API trả HTTP 200 và tạo sản phẩm ID 304 dù request không có token; số sản phẩm tăng từ 3 lên 4.

Response trích từ evidence, giữ nguyên nội dung:

```json
{
  "statusCode": 200,
  "body": {
    "message": "Product created",
    "id": 304
  }
}
```

Phạm vi chỉ là dependency quyền ghi của Product CRUD, không phải kiểm thử toàn bộ FR-12.

**Canonical case liên quan:** FR15-TC-137, FR15-TC-138, FR15-TC-139, FR15-TC-140, FR15-TC-141, FR15-TC-142, FR15-TC-143, FR15-TC-144, FR15-TC-145.

**Evidence:**

- [FR15-TC-137.json](evidence/fr15-run03/api/FR15-TC-137.json)

Evidence hiện có là request/response và state của API. Chưa có screenshot từ một API client; nếu cần đính kèm screenshot khi publish issue, phải chụp thao tác thật, không tạo ảnh thay thế giả lập.

**Tình trạng:** đã quan sát, chưa sửa. Việc publish lên GitHub Issues của nhóm cần yêu cầu riêng.
