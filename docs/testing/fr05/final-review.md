# FR-05: Final review và execution closeout

Fresh reviewer: `/root/fr05_final_review`, model `gpt-6-astra`, read-only. Reviewer độc lập với executor; đây vẫn là AI review, không thay learner technical review. Review range: `96d6cb6..6b73251`. Review hoàn tất ngày 16/10/2026 (+07:00); exact interaction timestamp không được suy từ giờ ghi artifact.

## Kết quả và mức độ hoàn tất

Không có Critical/Important finding. Executor đánh giá lại theo tác động: ba findings dưới đây giữ Minor vì ảnh hưởng khả năng tái lập/độ rõ của report, không thay actual results, bug evidence hoặc thống kê. Theo executing-plans, Minor được defer, không vào fix pass.

45 unique cases: **35 executed = 23 Passed + 12 Failed**, **10 Blocked**, 0 Not Run. Native iOS: 12P/11F/10B; API supporting: 11P/1F. Task5 vẫn partial. BVA native n=0/1/2 exercised 3/3 chỉ là result-count slice; không đại diện 100% feature. Có 4 explicit confirmed defects và 1 derived timing discrepancy. Không sửa SUT.

Reviewer chạy validator: 0 errors, 45 canonical / 48 sources / 48 obligations; 12 validator tests và 2 Node tests pass. Reviewer kiểm source/fixture/suite/working DB hashes và evidence; không chạy live/environment mutation. Các harness/live checks executor đã chạy được ghi trong README. Những giới hạn không được reviewer kết luận đều có ruling dưới đây.

## Deferred minors — đầy đủ

1. Runbook chưa đủ command sequence để tái lập độc lập: cần prepare-environment, image server document root, proxy entrypoint/run ID và Metro working directory. Harness hiện có nhưng người đọc còn phải suy từ source.
2. Review Focus TEXT/TRANSPORT/SAFE chưa thể hiện rõ keyword % và literal underscore chưa exercised. TC022 Blocked vì matching policy; ZZZ_NO_MATCH không phân biệt literal/wildcard. Không nâng coverage hoặc sửa frozen v1.
3. Manifest ghi reset before each case, trong khi execution-decisions và request log công khai readonly group dùng chung immutable snapshot full. Cần addendum khi cập nhật hướng dẫn; giữ historical manifest nguyên vẹn.

## Rulings I made — đầy đủ, theo thứ tự ledger

Các quyết định dưới đây giữ nguyên nội dung ledger, gồm lý do và chi phí nếu sai. Workspace ignored được giữ để resume Task5; report này là bản tracked để người dùng kiểm tra quyết định mà không phụ thuộc scratch directory.

- Ruling: Làm trên branch hw02-domain-testing theo lựa chọn trực tiếp của người dùng — không tạo worktree — chi phí nếu sai: thay đổi FR05 nằm chung working tree, cô lập bằng paths/index và fixture tạm.
- Ruling: Không chạy backend npm test placeholder hay test toàn app — AGENTS quy định scope FR05 và script placeholder — chi phí nếu sai: không có regression signal ngoài FR05; không đổi app code.
- Ruling: Plan sinh h1 unresolved case có thể khiến full-suite không đạt; giữ Blocked ORACLE_UNRESOLVED và tiếp tục phần có oracle — không lấy implementation làm oracle — chi phí nếu sai: coverage native R09 chưa có verdict.
- Ruling: Thêm domain-source.json làm serialization của source case/obligation — tránh parse Markdown mất mapping — chi phí nếu sai: thêm một file machine-readable phải đồng bộ report.
- Task 1: Ruling: task-done cần nonempty output; wrap git diff --check và in PASS — helper grep trả exit 1 với log rỗng dù check đạt — chi phí nếu sai: chỉ ảnh hưởng bookkeeping, không verdict SUT.
- Task 3: Ruling: Sửa EOF blank line ở domain-cases.md bị phát hiện trong staged check Task 2 — orchestration trước đó không dừng khi check báo whitespace; không amend lịch sử — chi phí nếu sai: một dòng formatting, không ảnh hưởng test data.
- Ruling: Thêm bva-source.json làm serialization cùng schema DT — traceability của union không phụ thuộc parse Markdown — chi phí nếu sai: cần đồng bộ source/report.
- Task 5: Ruling: Android không có device; chọn iPhone18 Pro iOS27 đang boot theo fallback plan — chỉ kết luận iOS — chi phí nếu sai: không có Android coverage.
- Task 5: Ruling: Điều chỉnh API URL chỉ trong copy mobile sang loopback3002 và ảnh3001 — iOS Simulator dùng được host loopback; proxy timing giữ body — chi phí nếu sai: transport topology khác LAN thật, phải ghi environment adjustment.
- Task 5: Ruling: Thêm fixture-server.cjs và test_protocol.py để kiểm reset/delay — không sửa backend; controls chỉ loopback — chi phí nếu sai: simulation error/race không đại diện mọi network thật.
- Task 5: Ruling: API supporting chạy trước khi manifest được tổng hợp; giữ raw at timestamps, tách apiStartedAt/manifestRecordedAt thay vì giả manifest có trước — chi phí nếu sai: trace environment tại đúng thời điểm API hạn chế hơn, native manifest đã có trước launch.
- Task 5: Ruling: Với nhóm readonly search dùng cùng snapshot full bất biến, thay q hoàn toàn và giữ Home/keyboard thay vì reseed/relaunch mỗi query — GET không đổi catalog, strict expected sets vẫn bắt stale results — chi phí nếu sai: lifecycle/relaunch-specific behavior không được kiểm bởi nhóm này; initial loading có case riêng.
- Task 5: Ruling: Metro reload driver dùng version2 sau khi versionless message không tạo request mới — kiểm local protocol socketMessages.js và proxy initial request — chi phí nếu sai: reload evidence không là input UI nhưng là lifecycle devserver, không inject app state.
- Task 5: Ruling: Screenshot capture có thể lỗi ScreenCaptureKit -3811; ưu tiên lưu native AX trước, chỉ gắn PNG thật tồn tại — không dùng screenshot cũ giả như case mới — chi phí nếu sai: vài case text chỉ có AX evidence, visual assertions vẫn cần screenshot.
- Task 5: Ruling: Tiếp tục Task6/7 trên evidence đã thu dù Task5 full execution còn oracle/accessibility blockers — report trung thực thay vì stall hoặc giả Pass — chi phí nếu sai: vẫn cần follow-up để đóng native coverage.
- Task 5: Ruling: RATIO render snapshot images qua empty search thay cold start; card component không đổi, Square ellipse đã quan sát — chi phí nếu sai: không phủ lifecycle-specific ratio behavior.
- Task 5: Ruling: Giữ nguyên CRLF HTTP/unified diff context/Node RED log whitespace ở 3 raw files; kiểm strict docs/harness và whitelist chính xác raw warnings — bảo toàn evidence — chi phí nếu sai: git diff --check global vẫn cảnh báo raw content, người đọc cần biết scope.
- Task 6: Ruling: TC001 Failed→Blocked vì grid không quy định ≥2 native columns và scroll tool không hoạt động; raw trước review giữ nguyên, primary adjudication tách file — tránh false positive — chi phí nếu sai: native layout defect có thể chưa được confirmed, cần authority.
- Task 6: Ruling: BUG005 là observed discrepancy với derived timing oracle, tách khỏi4 explicit confirmed defects — spec không nêu race policy — chi phí nếu sai: không tính một lỗi usability vào confirmed coursework score cho tới review.
- Final: Ruling: Grid nhiều cột và scroll completeness — TC001 giữ Blocked vì native column contract chưa rõ và scroll evidence thiếu — chi phí nếu sai: có thể còn layout defect chưa confirmed.
- Final: Ruling: Image accessibility/alt — TC013 giữ Blocked vì AX export chưa chứng minh VoiceOver/full image semantics — chi phí nếu sai: accessibility defect có thể chưa được xác định.
- Final: Ruling: Exactly-one h1 native — TC020 giữ Blocked vì thiếu mapping từ HTML requirement — chi phí nếu sai: native heading coverage chưa có verdict.
- Final: Ruling: Trim, case folding, bỏ dấu, empty/omitted query, substring, whitespace và wildcard matching — giữ policy cases Blocked, không lấy SQL LIKE làm oracle — chi phí nếu sai: còn search behavior chưa kết luận.
- Final: Ruling: %/_ matching correctness — không kết luận SUT correctness; chỉ ghi coverage/traceability gap — chi phí nếu sai: chưa kiểm literal/wildcard đầy đủ.
- Final: Ruling: Latest-query consistency — giữ BUG005 observed derived discrepancy riêng khỏi 4 explicit defects — chi phí nếu sai: một usability failure có thể chưa tính vào confirmed score.
- Final: Ruling: Android, physical-device/LAN, production-network behavior — chỉ kết luận iOS Simulator loopback/proxy đã quan sát — chi phí nếu sai: không có coverage cho các môi trường còn lại.
- Final: Ruling: Wide/Tall, offscreen layout, long-name visual completeness — không suy đầy đủ visual correctness từ AX; Square failure có PNG riêng — chi phí nếu sai: có thể còn visual defects chưa quan sát.
- Final: Ruling: Exhaustive XSS/security, mọi Unicode/catalog size/timing — sample run không hỗ trợ kết luận exhaustive — chi phí nếu sai: còn input/schedule ngoài mẫu.
- Final: Ruling: Locale/font scale/physical viewport — không áp dấu phân cách hoặc viewport chưa đo làm oracle — chi phí nếu sai: chưa phủ mọi display configuration.
- Final: Ruling: Quy ước giảng viên — giữ BVA/on-off-in là working convention vì thiếu lecture — chi phí nếu sai: cần đối chiếu phương pháp môn học khi có lecture.
- Final: Ruling: PDF/full four-feature submission, learner review/grade, demo, GitHub publication — chưa coi hoàn tất; scope hiện tại một feature Markdown và chưa có authorization publish — chi phí nếu sai: chưa đủ package nộp HW02.
- Final: Ruling: Raw whitespace 3 files và pre-final commit-log — giữ raw bytes; refresh log tại closeout, ghi snapshot HEAD thật — chi phí nếu sai: raw diff check vẫn có ngoại lệ công khai; export commit không tự chứa chính nó.
- Final: Ruling: SUT fixes và unrelated FR03/.gitignore changes — giữ nguyên vì request là testing, không sửa app để đạt Pass — chi phí nếu sai: defects SUT còn tồn tại; unrelated work do người dùng quản lý.
- Final: Ruling: Giữ workspace plan để resume Task5 — full execution vẫn partial; không đạt precondition cleanup/integration — chi phí nếu sai: còn scratch directory ignored cần quản lý.

## Điều kiện resume

Cần authoritative native grid/h1 mapping, search matching policy, công cụ scroll và accessibility evidence phù hợp để xử lý 10 Blocked cases. Cần lecture để đối chiếu course convention. Khi có dữ liệu này, version suite nếu expected thay đổi, tạo run ID mới, giữ run01 và báo cáo lại denominator/executed coverage. Android cần run riêng. Không dùng preference hoặc behavior hiện tại thay requirement oracle.

Không push, merge, publish Issues/video hoặc submit coursework trong phiên này. Các thay đổi FR03/.gitignore ngoài scope được giữ nguyên. Commit log xuất từ Git thật, ghi rõ snapshot và không tự nhận export commit đã nằm trong chính file đó.
