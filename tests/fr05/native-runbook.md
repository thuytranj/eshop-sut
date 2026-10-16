# FR-05: Native execution runbook

Target được chốt là iPhone 18 Pro / iOS 27.0 trong Device Hub; không suy ra Android coverage. Dùng CUA để thao tác UI và lấy screenshot; simctl chỉ dùng inventory/install/runtime diagnostics. Bản mobile copy chỉ đổi API_URL sang loopback proxy, App.js working tree giữ nguyên.

1. Khởi động backend copy bằng `npm run dev` tại đường dẫn `backend` do prepare-environment in ra. Không chạy trong backend working tree.
2. Khởi động image server loopback3001, fixture-server loopback3002, Metro từ mobile copy. Nếu port bận không kill process khác.
3. Khi đổi snapshot hoặc bắt đầu nhóm readonly POST `/__control` với fixtureId/mode; kiểm IDs trả về so snapshot. Ghi control và request/response trong requests.jsonl. API runner phải chạy trước hoặc sau native, không đồng thời đổi fixture.
4. Native mở Home, focus search, Select All và thay bằng raw q; bấm Tìm. Không dùng API call thay thao tác native. Với Home case khởi tạo lại view và search rỗng; giữ trace reset.
5. Chụp screenshot riêng theo `FR05-TC-xxx`, không gán screenshot của query trước cho query sau. Cuộn danh sách khi assertion cần các card ngoài viewport. CUA AX state chỉ thấy chrome Device Hub thì không coi đó là mobile accessibility hierarchy.
6. Loading cases dùng mode delay; cần pending screenshot trước response, sau đó success screenshot. Error dùng socket close, race dùng Alpha delay20s/Beta immediate; đánh dấu network simulation. Không sửa payload nghiệp vụ qua proxy.
7. Với oracle unresolved vẫn ghi probe nếu thao tác được; giữ verdict Blocked ORACLE_UNRESOLVED. ALT thiếu mobile hierarchy/VoiceOver evidence thì Blocked EVIDENCE_CAPABILITY, không dùng code thiếu prop để kết luận observed bug.
8. Ghi actual/assertions/status/evidence ngay sau từng case. Rerun cùng case trong run mới nếu cần, không ghi đè raw failure. Validator reconcile đủ 45 canonical rows. Blocked/Not Run giữ task execution mở; không gọi toàn suite đã executed.

## Oracle giá và ảnh

Giá có ₫ và nhóm ba chữ số theo locale, không bắt buộc `.` thay `,`. Ảnh có hình tròn nằm giữa background sáng: ảnh wide/tall phải không biến tròn thành ellipse. Native screenshot chỉ chứng minh hình render, không chứng minh accessibility label.

## Reproduce API supporting

`node tests/fr05/run-products-api.cjs --suite tests/fr05/suite.json --base-url http://127.0.0.1:3002/api --run-id RUN_ID`. Runner từ chối ghi đè raw evidence cùng case. Full-name quote/URL chars được URLSearchParams encode; raw app request được proxy ghi nguyên dạng để so khác biệt.


## Command sequence cho fresh run

Ví dụ dưới đây dùng `fr05-run03`, phải đổi ID nếu đã tồn tại. Mở các terminal riêng, giữ chúng chạy; kiểm ports3000/3001/3002/8081 trước, không dừng process ngoài phiên testing. Existing node_modules của backend/mobile phải sẵn có. Đây là sequence được source-review sau final review; **chưa được chạy end-to-end dưới run03**. Run02 reuse runtime như manifest.

Từ repository root, đọc `backend/database.js` trước startup; chuẩn bị copy mới (script từ chối thư mục đã tồn tại):

```bash
cd /Users/thuytran/Workspace/eshop-sut
node tests/fr05/prepare-environment.cjs --suite tests/fr05/suite.json --run-id fr05-run03
```

Terminal backend — chỉ chạy trong copy, startup gốc có destructive initialization của DB copy:

```bash
cd /private/tmp/eshop-fr05-fr05-run03/backend
npm run dev
```

Terminal images — document root phải đúng fixtures images; localhost chỉ áp dụng iOS Simulator trên cùng host:

```bash
cd /Users/thuytran/Workspace/eshop-sut
python3 -m http.server 3001 --bind 127.0.0.1 --directory tests/fr05/fixtures/images
```

Terminal proxy — phải cùng run ID với prepare-environment để mở đúng DB copy và evidence directory:

```bash
cd /Users/thuytran/Workspace/eshop-sut
node tests/fr05/fixture-server.cjs fr05-run03
```

Terminal Metro — dùng mobile copy có API_URL loopback3002, không sửa App.js working tree:

```bash
cd /private/tmp/eshop-fr05-fr05-run03/mobile
npm start -- --localhost --port 8081
```

Sau khi backend seed đã hoàn tất, terminal control:

```bash
cd /Users/thuytran/Workspace/eshop-sut
node tests/fr05/control-session.cjs
```

Gửi một dòng JSON trong control session, không nhập vào shell:

```json
{"fixtureId":"full","mode":"normal","label":"start-full-readonly-group","reload":true}
```

Control phải trả IDs101–112. Với count/state scenarios đổi fixture/mode tương ứng; delay/race phải có request timing thật. Nhóm readonly có thể giữ cùng full snapshot bất biến, thay toàn bộ q qua native UI; ghi deviation không cold-start mỗi query. Lifecycle/loading cases có reset/reload riêng. Manifest fresh run phải ghi trước execution, gồm source/suite/fixture hash, target/build/network/reset policy và giờ +07:00.

Mở `exp://127.0.0.1:8081` trong Expo Go của iOS Simulator qua native UI. Nếu cần Open confirmation hãy thực hiện trong UI; không dùng host curl để khẳng định device connectivity. Chỉ tiếp tục khi native request xuất hiện trong đúng `docs/testing/fr05/evidence/fr05-run03/requests.jsonl`. Android hoặc physical device cần routing riêng, không suy từ loopback này.

Runbook không tự tạo observation/manifest thay executor. Thu screenshot/AX thật, ghi actual/status ngay; không chạy API runner đồng thời native nếu nó reset fixture. Tất cả rerun dùng run ID mới để tránh overwrite evidence.
