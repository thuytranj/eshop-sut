# FR-05: Execution decisions và environment

## Quyết định về scope

- Người dùng chọn Native execution, report tiếng Việt, thuật ngữ chuyên ngành tiếng Anh; đồng ý dùng branch hiện tại `hw02-domain-testing`. Không tạo worktree mới, không stage các thay đổi FR03/.gitignore có sẵn.
- Android ADB đã kiểm ngoài sandbox: không có device. Chọn iPhone 18 Pro iOS 27.0 đang boot, UDID trong manifest. Chỉ report iOS native; không suy ra Android.
- CUA thấy Device Hub `com.apple.dt.Devices`, window iPhone 18 Pro, có screenshot home screen. AX của macOS chỉ thấy toolbar, không phải mobile accessibility hierarchy.

## Bảo toàn SUT và fixture

`prepare-environment.cjs` không import database.js, không tạo database gốc. Script copy backend/mobile vào `/private/tmp/eshop-fr05-fr05-run01/`; backend source không thay đổi. DB copy mới được init bằng startup gốc; proxy reset catalog ở DB copy. Hai safety checks chạy RED→GREEN để kiểm file copy và working-data hashes.

Chỉ API_URL trong App.js **copy** đổi từ `http://192.168.10.13:3000/api` sang `http://127.0.0.1:3002/api`. iOS Simulator truy cập loopback host; backend thật giữ port3000, image server3001, proxy3002. Ảnh local có hình tròn và known dimensions để quan sát ratio; không phụ thuộc image hosting ngoài. Adjustment JSON và hashes trong manifest, source App.js working tree giữ nguyên.

Proxy không thay response body; normal là passthrough. Delay/error/race là network simulation có log riêng. Full-name query của native đi qua code app nguyên gốc; API runner encode query đúng để cô lập transport của app với backend behavior.

## Các chặn đã quan sát và cách xử lý

- Sandbox chặn ADB/local listeners/HTTP loopback/CoreSimulator; đã dùng escalation theo tool permission, không gọi blocked sandbox là SUT failure.
- `npm run ios` nhận lỗi không xác định Simulator application vì ứng dụng hiện là Device Hub. Metro khởi động riêng `npm start -- --localhost --port 8081` hoạt động.
- Expo Go chưa được cài trong Simulator; downloader Node chính thức treo khi truy cập network. `curl` lấy được official Expo API, xác định đúng artifact SDK54 từ `expo/expo-go-releases` để tải trực tiếp; không lấy package không rõ nguồn.
- Expo installed54.0.34 thỏa package range ~54.0.33, CLI khuyến cáo ~54.0.37. Không tự update lockfile/dependency để làm test chạy; warning được giữ trong environment record.

## Oracle rulings

HTML h1, trim/case/diacritics/wildcard/empty/substring chưa đủ policy native: giữ Blocked ORACLE_UNRESOLVED, có thể ghi probe. Error/race là Derived robustness expectations. ALT cần VoiceOver/mobile hierarchy; không fail chỉ vì code không thấy accessibilityLabel. Việc user chọn plan không xác nhận các technical expected chưa rõ.

## Task 5 status

API supporting execution đã có 12 records (11 Passed, 1 Failed); chưa coi là native verdict. Native launch đang được chuẩn bị; kết quả cuối và remaining blockers sẽ nằm trong test-results.md. Full execution chỉ đạt khi không còn Blocked/Not Run.

## Cập nhật native execution

Người dùng đã bấm Open trong Safari confirmation do CUA không expose button. App Expo Go SDK54 mở được, native request đi tới proxy; bundle được kiểm chỉ có loopback3002, không còn IP LAN gốc. Người dùng cũng unlock Mac một lần khi CUA báo lock. Đó là hỗ trợ môi trường, không phải learner review test cases.

CUA `setValue` có lúc báo AXError.cannotComplete nhưng field thật đã đổi; luôn đọc lại AX Value trước khi bấm Tìm. Không dùng lỗi này làm bug SUT. `getAXState` chứa mobile subtree từ Device Hub; AX xuất được tên/giá và UI controls nhưng accessibility image semantics còn hạn chế. Coordinate click/scroll báo noWindowsAvailable; không tự suy ra scroll completeness từ một viewport.

Nhóm full-catalog search là readonly: giữ snapshot full bất biến, thay q hoàn toàn và giữ Home/keyboard, không reseed/relaunch mỗi query. Các case count/coupled dùng reset snapshot riêng. Native initial loading dùng Metro devserver reload broadcast, protocol version2 theo mã CLI, không sửa App.js/business logic. Proxy delay30s chỉ phục vụ observation; không biến 30s thành requirement timeout.

Screenshot capture đôi lúc lỗi ScreenCaptureKit -3811. AX được lưu trước; chỉ PNG tồn tại mới đưa vào evidence. Case text có thể được chứng minh bằng native AX; case visual cần screenshot.

## Kết thúc vòng thực thi đầu tiên

Đã có disposition đủ 45 canonical IDs: 33 native (12 Passed,12 Failed,9 Blocked) và 12 API (11 Passed,1 Failed) trong raw observations. Đây chưa phải final adjudication: Task6 còn review oracle, nhất là native grid. Task5 chưa đạt tiêu chí full execution vì vẫn có Blocked về oracle/accessibility. Các task report/gap tiếp tục trên evidence thực đã có, không đánh dấu blocker là Passed.

Case RATIO reset snapshot images rồi search rỗng để render catalog; không cold-start riêng. Giá/rate hiển thị là logic card giống Home, nhưng lifecycle path này được ghi rõ. Chỉ cần Square sai tỷ lệ đã đủ Failed; Wide/Tall không bị kết luận sai khi chưa cuộn quan sát hết.

## Whitespace của raw evidence

HTTP headers trong quote-reproduction.txt giữ CRLF nguyên bản; unified diff giữ context lines bắt đầu bằng space; Node test output có blank indented lines. `git diff --check` vì vậy cảnh báo ở đúng ba raw evidence files này. Không normalize hoặc sửa raw bytes. Documentation/harness được check whitespace riêng; mọi cảnh báo ngoài ba raw files đều là blocker trước commit. Đây là exception có ghi nhận cho bằng chứng, không bỏ qua hook hay đổi Git config.
