# FR-05 Mobile: Kết quả thực thi và coverage

## 1. Kết luận trong phạm vi đã chạy

Đã thiết kế 45 canonical cases: 33 native và 12 API supporting. Sau review verdict, **35 cases có execution verdict**, 23 Passed,12 Failed;10 Blocked,0 Not Run. Riêng native có 23/33 executed (12 Passed,11 Failed,10 Blocked). Full native suite chưa hoàn tất vì còn oracle/accessibility/scroll blockers. Không gọi 45 dispositions là 45 executed cases.

Quan sát được 4 nhóm lỗi có explicit requirement và 1 discrepancy có derived timing oracle. Số bug không bằng số failed cases: nhiều case cùng chứng minh thiếu empty state hoặc mất query encoding. Xem [bugs](bugs.md). Không sửa application code hoặc publish GitHub Issues.

## 2. Environment và provenance

Target: iPhone 18 Pro / iOS27.0 / Expo Go54.0.7; app Expo SDK54 (installed54.0.34), React19.1.0, React Native0.81.5. Backend copy Express/SQLite giữ source nguyên vẹn, API_URL chỉ đổi trong mobile copy sang loopback proxy3002. [Manifest](evidence/fr05-run01/manifest.json), [adjustment](evidence/fr05-run01/environment-adjustment.diff), [execution decisions](execution-decisions.md), [request/response log](evidence/fr05-run01/requests.jsonl).

Ngày chạy: 16/10/2026, giờ user-facing Asia/Ho_Chi_Minh (+07:00). Raw log dùng UTC có Z; không thay timestamp historical bằng thời điểm viết report. Fixture reset/catalog IDs và timing có trong raw log. Counter/expiry/authentication N/A; native/Home/search state được ghi theo runbook. Locale identifier/font scale chưa đo; giá thực tế dùng dấu chấm grouping và ₫. Scale của cửa sổ Device Hub thay đổi nên không lấy outer screenshot làm physical viewport.

Native UI được thao tác bằng CUA; API runner dùng URLSearchParams riêng. Người dùng hỗ trợ Open Expo Go và unlock Mac, không cung cấp technical learner review. AX tree có nội dung native thực, còn image accessibility semantics chưa được chứng nhận. Một số case có AX-only evidence vì screenshot service lỗi; visual bug reports có PNG thật.

## 3. Review verdict, bảo toàn raw evidence

Raw [observations](evidence/fr05-run01/observations.json) có 12 native Failed; review đổi TC001 từ Failed sang Blocked vì column count/native grid mapping chưa được đặc tả và scroll tool chưa làm được. Không coi một cột tự động là bug; raw screenshot/AX vẫn giữ nguyên. [Verdict revision](evidence/fr05-run01/verdict-revisions.json) lưu before/after/reason. Primary verdict cuối dùng [adjudicated observations](evidence/fr05-run01/adjudicated-observations.json). Không sửa expected cho khớp code; đây là sửa một inference chưa có nguồn.

## 4. Test statistics (unique cases)

| Interface | Designed D | Executed E | Passed | Failed | Blocked | Not Run | Not yet executed |
|---|---:|---:|---:|---:|---:|---:|---:|
| Native iOS | 33 | 23 | 12 | 11 | 10 | 0 | 10 |
| API supporting | 12 | 12 | 11 | 1 | 0 | 0 | 0 |
| Tổng unique | 45 | 35 | 23 | 12 | 10 | 0 | 10 |

`D=P+F+B+NR`; `E=P+F`; not-yet-executed=`B+NR`. Không cộng source case count48, reruns, screenshot count hoặc API observations vào native count. Case019 Failed theo derived latest-query consistency được ghi riêng; 10 native failures còn lại có explicit oracle.

## 5. Actual result từng canonical case

Preconditions/input/steps/expected đầy đủ: [suite.json](../../../tests/fr05/suite.json), [DT source cases](domain-cases.md), [BVA dẫn xuất](bva-report.md). Bảng dưới nối cùng ID với actual/status/evidence. `Not Run` ở source reports là baseline đóng băng trước chạy, không là final verdict.

| Case / key | Interface / technique | Fixture / raw q | Expected | Actual | Status | Evidence |
|---|---|---|---|---|---|---|
| FR05-TC-001 LIST | NATIVE / DT | full / null | Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng; layout là grid, không phải một cột danh sách. | Quan sát danh sách một cột, AX có 12 tên/giá. Requirement nói grid nhưng không quy định column count/responsive mapping native; CUA scroll chưa thực hiện được. Chưa đủ cơ sở kết luận một cột là vi phạm grid hoặc chứng minh completeness cuối bằng scroll. | **Blocked** | [FR05-TC-001.ax.txt](evidence/fr05-run01/native/FR05-TC-001.ax.txt)<br>[FR05-TC-001.png](evidence/fr05-run01/native/FR05-TC-001.png) |
| FR05-TC-002 EXACT | NATIVE / DT | full / &quot;Alpha&quot; | Có đúng card Alpha ID101; không có sản phẩm không match. | Search Alpha trả một card Alpha giá 999 ₫; Hiển thị 1 sản phẩm. | **Passed** | [FR05-TC-002.ax.txt](evidence/fr05-run01/native/FR05-TC-002.ax.txt)<br>[FR05-TC-002.png](evidence/fr05-run01/native/FR05-TC-002.png) |
| FR05-TC-003 NO-MATCH | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Không có card; có thông báo empty state khi response thành công rỗng. | Response success rỗng, vùng kết quả trống hoàn toàn; không có thông báo empty state trong screenshot/AX. | **Failed** | [FR05-TC-003.ax.txt](evidence/fr05-run01/native/FR05-TC-003.ax.txt)<br>[FR05-TC-003.png](evidence/fr05-run01/native/FR05-TC-003.png) |
| FR05-TC-004 NAME-ONLY | NATIVE / DT | full / &quot;DescriptionToken&quot; | Token chỉ trong description không làm sản phẩm match; native có empty state. | DescriptionToken không trả card (name-only đúng), nhưng không có thông báo empty state. | **Failed** | [FR05-TC-004.ax.txt](evidence/fr05-run01/native/FR05-TC-004.ax.txt)<br>[FR05-TC-004.png](evidence/fr05-run01/native/FR05-TC-004.png) |
| FR05-TC-005 UNICODE | NATIVE / DT | full / &quot;Cà phê&quot; | Full-name search &#x27;Cà phê&#x27; trả đúng sản phẩm ID104; không lỗi/truncate/đổi ký tự. | Cà phê nguyên dấu trả một card Cà phê giá 999.999 ₫, không có tên sản phẩm khác trong AX. | **Passed** | [FR05-TC-005.ax.txt](evidence/fr05-run01/native/FR05-TC-005.ax.txt)<br>[FR05-TC-005.png](evidence/fr05-run01/native/FR05-TC-005.png) |
| FR05-TC-006 QUOTE | NATIVE / DT | full / &quot;O&#x27;Brien&quot; | Full-name search &quot;O&#x27;Brien&quot; trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự. | App hiển thị nguyên chuỗi &lt;h1&gt;Database Error&lt;/h1&gt;&lt;p&gt;SQLITE_ERROR: near &quot;Brien&quot;: syntax error&lt;/p&gt; thay vì card O&#x27;Brien. | **Failed** | [FR05-TC-006.ax.txt](evidence/fr05-run01/native/FR05-TC-006.ax.txt)<br>[FR05-TC-006.png](evidence/fr05-run01/native/FR05-TC-006.png) |
| FR05-TC-007 AMP | NATIVE / DT | full / &quot;A&amp;B&quot; | Full-name search &#x27;A&amp;B&#x27; trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự. | Keyword A&amp;B nhưng có Alpha/Beta/A+B/A#B và tên khác; không chỉ A&amp;B. API encode đúng case040 đã pass. | **Failed** | [FR05-TC-007.ax.txt](evidence/fr05-run01/native/FR05-TC-007.ax.txt)<br>[FR05-TC-007.png](evidence/fr05-run01/native/FR05-TC-007.png) |
| FR05-TC-008 PLUS | NATIVE / DT | full / &quot;A+B&quot; | Full-name search &#x27;A+B&#x27; trả đúng sản phẩm ID107; không lỗi/truncate/đổi ký tự. | Search A+B hiển thị keyword nguyên dạng nhưng không có card A+B; API encoded case041 trả đúng ID107. | **Failed** | [FR05-TC-008.ax.txt](evidence/fr05-run01/native/FR05-TC-008.ax.txt)<br>[FR05-TC-008.png](evidence/fr05-run01/native/FR05-TC-008.png) |
| FR05-TC-009 HASH | NATIVE / DT | full / &quot;A#B&quot; | Full-name search &#x27;A#B&#x27; trả đúng sản phẩm ID108; không lỗi/truncate/đổi ký tự. | Search A#B trả nhiều tên match A thay vì chỉ A#B; API encoded case042 trả đúng ID108. | **Failed** | [FR05-TC-009.ax.txt](evidence/fr05-run01/native/FR05-TC-009.ax.txt)<br>[FR05-TC-009.png](evidence/fr05-run01/native/FR05-TC-009.png) |
| FR05-TC-010 SAFE | NATIVE / DT | full / &quot;&lt;b&gt;Alpha&lt;/b&gt;&quot; | Nhãn keyword hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;, không biến thành bold Alpha hay HTML; không đánh giá wildcard/matching trong case này. | Nhãn kết quả hiển thị nguyên văn &lt;b&gt;Alpha&lt;/b&gt;; screenshot còn cả dấu &lt;b&gt;, không render bold/HTML. | **Passed** | [FR05-TC-010.ax.txt](evidence/fr05-run01/native/FR05-TC-010.ax.txt)<br>[FR05-TC-010.png](evidence/fr05-run01/native/FR05-TC-010.png) |
| FR05-TC-011 MONEY | NATIVE / DT | full / null | Giá 999/1000/1001/999999/1000000/1000001 đều có ₫; các giá ≥1000 có nhóm hàng nghìn đúng, dấu nhóm theo locale. | Native AX của full catalog hiển thị 999 ₫, 1.000 ₫, 1.001 ₫, 999.999 ₫, 1.000.000 ₫ và 1.000.001 ₫ đúng nhóm nghìn. | **Passed** | [FR05-TC-011.ax.txt](evidence/fr05-run01/native/FR05-TC-011.ax.txt)<br>[FR05-TC-011.png](evidence/fr05-run01/native/FR05-TC-011.png) |
| FR05-TC-012 RATIO | NATIVE / DT | images / null | Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse. | Snapshot images có Square/Wide/Tall. Screenshot Square từ PNG120×120 có hình tròn nhưng native kéo thành ellipse ngang. Wide thấy một phần; Tall chưa kiểm hình do scroll tool bị chặn. Một ảnh đã vi phạm đủ để case Failed. | **Failed** | [FR05-TC-012.ax.txt](evidence/fr05-run01/native/FR05-TC-012.ax.txt)<br>[FR05-TC-012.png](evidence/fr05-run01/native/FR05-TC-012.png) |
| FR05-TC-013 ALT | NATIVE / DT | full / &quot;Alpha&quot; | Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled. | Ảnh hiển thị ở card Alpha nhưng AX export không có node ảnh/description. Chưa có VoiceOver output hoặc xác minh export có đầy đủ image semantics; giữ suspected accessibility gap. | **Blocked** | [FR05-TC-013.ax.txt](evidence/fr05-run01/native/FR05-TC-013.ax.txt) |
| FR05-TC-014 LONG-NAME | NATIVE / DT | full / &quot;Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile&quot; | Có tên sản phẩm hiển thị trên card; không áp chính sách wrap/full text chưa được quy định. | Card có tên Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile và giá 1.000.001 ₫ trong native AX; không áp quy định wrap chưa có nguồn. | **Passed** | [FR05-TC-014.ax.txt](evidence/fr05-run01/native/FR05-TC-014.ax.txt) |
| FR05-TC-015 LOAD-INITIAL | NATIVE / DT | full / null | Trong thời gian initial request còn pending có loading rõ; sau success có danh sách. | Initial reload có Đang tải... khi proxy giữ response 30 giây; sau response có 12 sản phẩm và loading biến mất. | **Passed** | [FR05-TC-015-pending-v2.png](evidence/fr05-run01/native/FR05-TC-015-pending-v2.png)<br>[FR05-TC-015-pending-clear.ax.txt](evidence/fr05-run01/native/FR05-TC-015-pending-clear.ax.txt)<br>[FR05-TC-015-success.ax.txt](evidence/fr05-run01/native/FR05-TC-015-success.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-016 LOAD-SEARCH | NATIVE / DT | full / &quot;Alpha&quot; | Trong search pending có loading; sau success có đúng Alpha. | Search Alpha có Đang tải... trong pending; sau delay có đúng một Alpha và loading biến mất. | **Passed** | [FR05-TC-016-pending.ax.txt](evidence/fr05-run01/native/FR05-TC-016-pending.ax.txt)<br>[FR05-TC-016-success.ax.txt](evidence/fr05-run01/native/FR05-TC-016-success.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-017 LOAD-EMPTY | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Pending có loading; sau success rỗng loading kết thúc và có empty state. | Pending có Đang tải...; sau response [] loading biến mất nhưng vẫn chỉ vùng trống, không có empty state. | **Failed** | [FR05-TC-017-pending.ax.txt](evidence/fr05-run01/native/FR05-TC-017-pending.ax.txt)<br>[FR05-TC-017-after-delay.ax.txt](evidence/fr05-run01/native/FR05-TC-017-after-delay.ax.txt)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-018 ERROR | NATIVE / Supplementary | full / &quot;Alpha&quot; | Network error được phân biệt với search không có kết quả; không còn loading vô hạn. | Khi proxy đóng socket, native hiển thị Network request failed; không hiển thị như search empty và không còn loading. | **Passed** | [FR05-TC-018.ax.txt](evidence/fr05-run01/native/FR05-TC-018.ax.txt) |
| FR05-TC-019 RACE | NATIVE / Supplementary | full / &quot;Alpha&quot; | Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta. | Beta trả trước và từng hiển thị Beta; sau khi Alpha cũ trả về, ô/nhãn vẫn Beta nhưng card đổi thành Alpha giá 999 ₫. Đây là derived latest-query-wins oracle. | **Failed** | [FR05-TC-019-beta-first.ax.txt](evidence/fr05-run01/native/FR05-TC-019-beta-first.ax.txt)<br>[FR05-TC-019-final.ax.txt](evidence/fr05-run01/native/FR05-TC-019-final.ax.txt)<br>[FR05-TC-019-final.png](evidence/fr05-run01/native/FR05-TC-019-final.png)<br>[requests.jsonl](evidence/fr05-run01/requests.jsonl) |
| FR05-TC-020 H1 | NATIVE / Supplementary | full / null | Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict; vẫn ghi native heading probe. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-021 TRIM | NATIVE / Supplementary | full / &quot; Alpha &quot; | Ghi observation; chưa verdict do policy trim chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-022 WILDCARD | NATIVE / Supplementary | full / &quot;%&quot; | Ghi observation; chưa verdict do policy literal wildcard chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-023 CASE | NATIVE / Supplementary | full / &quot;ALPHA&quot; | Ghi observation; chưa verdict do policy case sensitivity chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-024 ACCENT | NATIVE / Supplementary | full / &quot;Ca phe&quot; | Ghi observation; chưa verdict do policy diacritic sensitivity chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-025 EMPTY-QUERY | NATIVE / Supplementary | full / &quot;&quot; | Ghi observation; chưa verdict do policy empty vs omitted chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-026 ONE-CHAR | NATIVE / Supplementary | full / &quot;A&quot; | Ghi observation; chưa verdict do policy substring chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-027 SPACE | NATIVE / Supplementary | full / &quot;   &quot; | Ghi observation; chưa verdict do policy whitespace chưa có trong requirement. Không tính vào BVA length coverage. | Chưa thực thi để kết luận vì thiếu oracle cho native h1 hoặc search policy; không có pass/fail giả định. | **Blocked** | [oracle-blockers.txt](evidence/fr05-run01/oracle-blockers.txt) |
| FR05-TC-028 RESULT-ZERO | NATIVE / BVA+DT | empty / &quot;Alpha&quot; | Search Alpha trên catalog rỗng: không có card và có empty state. | BVA n=0: search Alpha trên catalog empty trả 0 card; không có thông báo empty state. | **Failed** | [FR05-TC-028.ax.txt](evidence/fr05-run01/native/FR05-TC-028.ax.txt)<br>[FR05-TC-028.png](evidence/fr05-run01/native/FR05-TC-028.png) |
| FR05-TC-029 RESULT-ONE | NATIVE / BVA+DT | one / &quot;Alpha&quot; | Một card Alpha giá 1000₫, không thiếu/trùng. | BVA n=1: một card Alpha giá 1.000 ₫, nhãn Hiển thị 1 sản phẩm; signature khớp ID201 trong snapshot one. | **Passed** | [FR05-TC-029.ax.txt](evidence/fr05-run01/native/FR05-TC-029.ax.txt) |
| FR05-TC-030 RESULT-TWO | NATIVE / BVA+DT | two / &quot;Alpha&quot; | Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên. | BVA n=2: hai card cùng tên Alpha, giá 1.000 ₫ và 1.001 ₫; Hiển thị 2 sản phẩm, không gộp hai signature. | **Passed** | [FR05-TC-030.ax.txt](evidence/fr05-run01/native/FR05-TC-030.ax.txt) |
| FR05-TC-031 COUPLED-M2 | NATIVE / DT | mixed / &quot;Alpha&quot; | M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả. | Snapshot mixed có Alpha/Beta nhưng query Alpha chỉ hiển thị Alpha giá 1.000 ₫; count1. | **Passed** | [FR05-TC-031.ax.txt](evidence/fr05-run01/native/FR05-TC-031.ax.txt) |
| FR05-TC-032 COUPLED-M3 | NATIVE / DT | three / &quot;Alpha&quot; | M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả. | Snapshot three có Alpha/Beta/Gamma, query Alpha vẫn chỉ có Alpha giá 1.000 ₫ và count1; đối chiếu reset/request trong log. | **Passed** | [FR05-TC-032.ax.txt](evidence/fr05-run01/native/FR05-TC-032.ax.txt) |
| FR05-TC-033 EMPTY-RECOVERY | NATIVE / DT | full / &quot;ZZZ_NO_MATCH&quot; | Search vô nghiệm có empty state; sau đó search Alpha có đúng Alpha, không lưu kết quả cũ. | Search vô nghiệm có 0 card nhưng thiếu empty state; sau đó search Alpha phục hồi đúng một Alpha giá 999 ₫. | **Failed** | [FR05-TC-033-empty.ax.txt](evidence/fr05-run01/native/FR05-TC-033-empty.ax.txt)<br>[FR05-TC-033-recovered.ax.txt](evidence/fr05-run01/native/FR05-TC-033-recovered.ax.txt) |
| FR05-TC-034 LIST | API / DT | full / null | HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]. | HTTP 200; IDs=[101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112] | **Passed** | [FR05-TC-034.json](evidence/fr05-run01/api/FR05-TC-034.json) |
| FR05-TC-035 EXACT | API / DT | full / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [101]. | HTTP 200; IDs=[101] | **Passed** | [FR05-TC-035.json](evidence/fr05-run01/api/FR05-TC-035.json) |
| FR05-TC-036 NO-MATCH | API / DT | full / &quot;ZZZ_NO_MATCH&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-036.json](evidence/fr05-run01/api/FR05-TC-036.json) |
| FR05-TC-037 NAME-ONLY | API / DT | full / &quot;DescriptionToken&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-037.json](evidence/fr05-run01/api/FR05-TC-037.json) |
| FR05-TC-038 UNICODE | API / DT | full / &quot;Cà phê&quot; | HTTP 200, JSON array, exact ID set [104]. | HTTP 200; IDs=[104] | **Passed** | [FR05-TC-038.json](evidence/fr05-run01/api/FR05-TC-038.json) |
| FR05-TC-039 QUOTE | API / DT | full / &quot;O&#x27;Brien&quot; | HTTP 200, JSON array, exact ID set [105]. | HTTP 500; IDs=None; SQLITE_ERROR near Brien (raw body được lưu) | **Failed** | [FR05-TC-039.json](evidence/fr05-run01/api/FR05-TC-039.json) |
| FR05-TC-040 AMP | API / DT | full / &quot;A&amp;B&quot; | HTTP 200, JSON array, exact ID set [106]. | HTTP 200; IDs=[106] | **Passed** | [FR05-TC-040.json](evidence/fr05-run01/api/FR05-TC-040.json) |
| FR05-TC-041 PLUS | API / DT | full / &quot;A+B&quot; | HTTP 200, JSON array, exact ID set [107]. | HTTP 200; IDs=[107] | **Passed** | [FR05-TC-041.json](evidence/fr05-run01/api/FR05-TC-041.json) |
| FR05-TC-042 HASH | API / DT | full / &quot;A#B&quot; | HTTP 200, JSON array, exact ID set [108]. | HTTP 200; IDs=[108] | **Passed** | [FR05-TC-042.json](evidence/fr05-run01/api/FR05-TC-042.json) |
| FR05-TC-043 COUNT-EMPTY | API / DT | empty / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set []. | HTTP 200; IDs=[] | **Passed** | [FR05-TC-043.json](evidence/fr05-run01/api/FR05-TC-043.json) |
| FR05-TC-044 COUNT-ONE | API / DT | one / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [201]. | HTTP 200; IDs=[201] | **Passed** | [FR05-TC-044.json](evidence/fr05-run01/api/FR05-TC-044.json) |
| FR05-TC-045 COUNT-TWO | API / DT | two / &quot;Alpha&quot; | HTTP 200, JSON array, exact ID set [201, 202]. | HTTP 200; IDs=[201, 202] | **Passed** | [FR05-TC-045.json](evidence/fr05-run01/api/FR05-TC-045.json) |

## 6. Coverage từ obligations, không suy từ số case

Registry freeze có 48 obligations: DT native23, DT API12, BVA native3, Supplementary native10. Mọi obligation còn nguyên khi dedup. Không giảm denominator sau khi phát hiện ambiguity.

| Technique / interface | Mapped designed | Oracle-qualified designed | Exercised | Cách hiểu |
|---|---:|---:|---:|---|
| DT native | 23/23 | 22/23 | 21/23 | LIST chưa đủ oracle; ALT có expectation nhưng evidence capability bị chặn |
| DT API supporting | 12/12 | 12/12 | 12/12 | Một failure quote vẫn là exercised obligation |
| BVA native result-count slice | 3/3 | 3/3 | 3/3 | n0 Failed,n1 Passed,n2 Passed; không phải 100% feature |
| Supplementary native | 10/10 | 2/10 | 2/10 | ERROR/RACE có derived oracle; 8 policy/h1 probes Blocked trước verdict |

Exercised = có valid native/API observation và verdict P/F, không phụ thuộc SUT có pass hay không. BVA mapping: endpoint0→N0,N1; endpoint1→N0,N1,N2; union{0,1,2}. Three source BVA cases merge vào TC028/029/030; không được tính API043-045 để nâng BVA native coverage.

Giới hạn: 21/23 DT native không chứng minh correctness mọi string/catalog/network schedule; một case FAIL có nhiều assertions thì rule nào fail phải đọc assertion details. Ví dụ TC017/033 fail empty state dù loading/recovery đã pass.

## 7. Requirement observations

| Rule | Quan sát và giới hạn |
|---|---|
| R01 listing/grid | AX có toàn bộ12 names/count; one-column screenshot; native column policy/scroll completeness chưa kết luận |
| R02 image/accessibility | Square image méo ellipse (TC012 Failed); ALT TC013 Blocked, không nhận vơ VoiceOver verification |
| R03 name | Exact, long name và BVA cards có tên |
| R04 price | Cả6 giá group-boundary fixtures đúng grouping/₫ trong native AX (TC011) |
| R05 search by name | Exact/Unicode/coupled pass; quote/URL reserved chars fail; race có observed mismatch với derived schedule oracle |
| R06 safe keyword | <b>Alpha</b> hiển thị literal trong native screenshot/AX; không phải exhaustive XSS testing |
| R07 loading | Initial và search pending có loading; kết thúc sau response; 30s là fixture delay, không requirement timeout |
| R08 empty | Các [] success không có empty message; recovery sau đó có kết quả đúng |
| R09 h1 | HTML-specific requirement chưa có native mapping; Blocked |

## 8. Remaining blockers và cách resume

TC001: cần xác nhận native grid/column policy và công cụ scroll hoạt động. TC013: cần VoiceOver hoặc certified complete native image hierarchy. TC020: native equivalent của exactly-one h1. TC021-027: cần search policy từ test oracle, không lấy SQL LIKE hoặc user preference đơn thuần thay specification. Sau khi có authority/lecture, version source/suite nếu expected đổi, chạy run mới và giữ raw run01. Android chưa được chạy.

Task5 có đủ disposition nhưng chưa đủ full execution; Task6 báo cáo evidence thực, Task7 phân tích gaps. Việc kết thúc documentation không đóng các blocker này.
