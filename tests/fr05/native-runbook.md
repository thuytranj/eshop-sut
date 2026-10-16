# FR-05: Native execution runbook

Target được chốt là iPhone 18 Pro / iOS 27.0 trong Device Hub; không suy ra Android coverage. Dùng CUA để thao tác UI và lấy screenshot; simctl chỉ dùng inventory/install/runtime diagnostics. Bản mobile copy chỉ đổi API_URL sang loopback proxy, App.js working tree giữ nguyên.

1. Khởi động backend copy bằng `npm run dev` tại đường dẫn `backend` do prepare-environment in ra. Không chạy trong backend working tree.
2. Khởi động image server loopback3001, fixture-server loopback3002, Metro từ mobile copy. Nếu port bận không kill process khác.
3. Trước mỗi case POST `/__control` với fixtureId/mode; kiểm IDs trả về so snapshot. Ghi control và request/response trong requests.jsonl. API runner phải chạy trước hoặc sau native, không đồng thời đổi fixture.
4. Native mở Home, focus search, Select All và thay bằng raw q; bấm Tìm. Không dùng API call thay thao tác native. Với Home case khởi tạo lại view và search rỗng; giữ trace reset.
5. Chụp screenshot riêng theo `FR05-TC-xxx`, không gán screenshot của query trước cho query sau. Cuộn danh sách khi assertion cần các card ngoài viewport. CUA AX state chỉ thấy chrome Device Hub thì không coi đó là mobile accessibility hierarchy.
6. Loading cases dùng mode delay; cần pending screenshot trước response, sau đó success screenshot. Error dùng socket close, race dùng Alpha delay20s/Beta immediate; đánh dấu network simulation. Không sửa payload nghiệp vụ qua proxy.
7. Với oracle unresolved vẫn ghi probe nếu thao tác được; giữ verdict Blocked ORACLE_UNRESOLVED. ALT thiếu mobile hierarchy/VoiceOver evidence thì Blocked EVIDENCE_CAPABILITY, không dùng code thiếu prop để kết luận observed bug.
8. Ghi actual/assertions/status/evidence ngay sau từng case. Rerun cùng case trong run mới nếu cần, không ghi đè raw failure. Validator reconcile đủ 45 canonical rows. Blocked/Not Run giữ task execution mở; không gọi toàn suite đã executed.

## Oracle giá và ảnh

Giá có ₫ và nhóm ba chữ số theo locale, không bắt buộc `.` thay `,`. Ảnh có hình tròn nằm giữa background sáng: ảnh wide/tall phải không biến tròn thành ellipse. Native screenshot chỉ chứng minh hình render, không chứng minh accessibility label.

## Reproduce API supporting

`node tests/fr05/run-products-api.cjs --suite tests/fr05/suite.json --base-url http://127.0.0.1:3002/api --run-id RUN_ID`. Runner từ chối ghi đè raw evidence cùng case. Full-name quote/URL chars được URLSearchParams encode; raw app request được proxy ghi nguyên dạng để so khác biệt.
