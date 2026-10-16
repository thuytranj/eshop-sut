# FR-05 Mobile: Domain Testing source cases

Đây là bản thiết kế đóng băng trước execution. `Not Run` ở đây là baseline, không phải verdict cuối; xem [test-results](test-results.md) sau khi thực thi. API/native được tách bằng Interface.

Tổng source cases: 45; native: 33; API supporting: 12. Không cộng BVA source cases vào unique count trước dedup.

## FR05-DT-001: LIST

- Rule: FR05-R01, FR05-R03; obligation: FR05-LIST; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": null, "mode": "home"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
- Expected (explicit): Home hiển thị tất cả 12 sản phẩm, không thiếu/trùng; layout là grid, không phải một cột danh sách.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-002: EXACT

- Rule: FR05-R05; obligation: FR05-EXACT; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Có đúng card Alpha ID101; không có sản phẩm không match.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-003: NO-MATCH

- Rule: FR05-R08; obligation: FR05-NO-MATCH; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "ZZZ_NO_MATCH", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Không có card; có thông báo empty state khi response thành công rỗng.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-004: NAME-ONLY

- Rule: FR05-R05, FR05-R08; obligation: FR05-NAME-ONLY; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "DescriptionToken", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'DescriptionToken' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Token chỉ trong description không làm sản phẩm match; native có empty state.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-005: UNICODE

- Rule: FR05-R05; obligation: FR05-UNICODE; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Cà phê", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Cà phê' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Full-name search 'Cà phê' trả đúng sản phẩm ID104; không lỗi/truncate/đổi ký tự.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-006: QUOTE

- Rule: FR05-R05; obligation: FR05-QUOTE; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "O'Brien", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác "O'Brien" vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Full-name search "O'Brien" trả đúng sản phẩm ID105; không lỗi/truncate/đổi ký tự.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-007: AMP

- Rule: FR05-R05; obligation: FR05-AMP; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A&B", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'A&B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Full-name search 'A&B' trả đúng sản phẩm ID106; không lỗi/truncate/đổi ký tự.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-008: PLUS

- Rule: FR05-R05; obligation: FR05-PLUS; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A+B", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'A+B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Full-name search 'A+B' trả đúng sản phẩm ID107; không lỗi/truncate/đổi ký tự.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-009: HASH

- Rule: FR05-R05; obligation: FR05-HASH; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A#B", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'A#B' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Full-name search 'A#B' trả đúng sản phẩm ID108; không lỗi/truncate/đổi ký tự.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-010: SAFE

- Rule: FR05-R06; obligation: FR05-SAFE; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "<b>Alpha</b>", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác '<b>Alpha</b>' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Nhãn keyword hiển thị nguyên văn <b>Alpha</b>, không biến thành bold Alpha hay HTML; không đánh giá wildcard/matching trong case này.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-011: MONEY

- Rule: FR05-R04; obligation: FR05-MONEY; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": null, "mode": "home"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
- Expected (explicit): Giá 999/1000/1001/999999/1000000/1000001 đều có ₫; các giá ≥1000 có nhóm hàng nghìn đúng, dấu nhóm theo locale.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-012: RATIO

- Rule: FR05-R02; obligation: FR05-RATIO; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `images`; raw input: `{"search": null, "mode": "home"}`.
- Steps:
  1. Reset backend về snapshot images; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
  4. Cuộn từng card Square/Wide/Tall và chụp ảnh cùng asset dimensions.
- Expected (explicit): Ba ảnh có hình tròn giữ hình tròn và tỷ lệ nguồn 1:1/2:1/1:2; không bị kéo giãn thành ellipse.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-013: ALT

- Rule: FR05-R02; obligation: FR05-ALT; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Thu accessibility hierarchy hoặc đọc bằng VoiceOver; screenshot đơn lẻ không chứng minh alt.
- Expected (explicit): Accessibility reader/hierarchy có mô tả ảnh có nghĩa theo tên sản phẩm, không chỉ ảnh unlabeled.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-014: LONG-NAME

- Rule: FR05-R03; obligation: FR05-LONG-NAME; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Sản phẩm tên dài để kiểm tra hiển thị trên màn hình mobile' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Có tên sản phẩm hiển thị trên card; không áp chính sách wrap/full text chưa được quy định.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-015: LOAD-INITIAL

- Rule: FR05-R07; obligation: FR05-LOAD-INITIAL; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": null, "mode": "home"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
  4. Proxy giữ initial response; chụp pending; release rồi chụp success.
- Expected (explicit): Trong thời gian initial request còn pending có loading rõ; sau success có danh sách.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-016: LOAD-SEARCH

- Rule: FR05-R07; obligation: FR05-LOAD-SEARCH; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Proxy giữ search response; chụp pending; release rồi chụp success.
- Expected (explicit): Trong search pending có loading; sau success có đúng Alpha.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-017: LOAD-EMPTY

- Rule: FR05-R07, FR05-R08; obligation: FR05-LOAD-EMPTY; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "ZZZ_NO_MATCH", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Giữ response; chụp pending; release response rỗng rồi chụp.
- Expected (explicit): Pending có loading; sau success rỗng loading kết thúc và có empty state.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-018: ERROR

- Rule: FR05-R07; obligation: FR05-ERROR; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Proxy chủ động ngắt request trong fixture copy; khôi phục network sau case.
- Expected (derived): Network error được phân biệt với search không có kết quả; không còn loading vô hạn.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-019: RACE

- Rule: FR05-R05; obligation: FR05-RACE; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Proxy hold Alpha, gửi Beta, release Beta rồi Alpha; lưu thứ tự request/response.
- Expected (derived): Search Alpha rồi Beta; response Beta về trước Alpha; danh sách cuối tương ứng Beta và nhãn Beta.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-020: H1

- Rule: FR05-R09; obligation: FR05-H1; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": null, "mode": "home"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Không nhập search; quan sát danh sách, cuộn đến phần tử cuối để đối chiếu toàn bộ catalog.
- Expected (unresolved): Cần xác nhận cách ánh xạ exactly-one HTML h1 sang native heading trước verdict; vẫn ghi native heading probe.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-021: TRIM

- Rule: FR05-R05; obligation: FR05-TRIM; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": " Alpha ", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác ' Alpha ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy trim chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-022: WILDCARD

- Rule: FR05-R05; obligation: FR05-WILDCARD; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "%", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác '%' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy literal wildcard chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-023: CASE

- Rule: FR05-R05; obligation: FR05-CASE; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "ALPHA", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'ALPHA' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy case sensitivity chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-024: ACCENT

- Rule: FR05-R05; obligation: FR05-ACCENT; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Ca phe", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Ca phe' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy diacritic sensitivity chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-025: EMPTY-QUERY

- Rule: FR05-R05; obligation: FR05-EMPTY-QUERY; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác '' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy empty vs omitted chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-026: ONE-CHAR

- Rule: FR05-R05; obligation: FR05-ONE-CHAR; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'A' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy substring chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-SUP-027: SPACE

- Rule: FR05-R05; obligation: FR05-SPACE; Technique: Supplementary; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "   ", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác '   ' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (unresolved): Ghi observation; chưa verdict do policy whitespace chưa có trong requirement. Không tính vào BVA length coverage.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-028: RESULT-ZERO

- Rule: FR05-R08; obligation: FR05-RESULT-ZERO; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `empty`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot empty; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Search Alpha trên catalog rỗng: không có card và có empty state.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-029: RESULT-ONE

- Rule: FR05-R03, FR05-R05; obligation: FR05-RESULT-ONE; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `one`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot one; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Một card Alpha giá 1000₫, không thiếu/trùng.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-030: RESULT-TWO

- Rule: FR05-R03, FR05-R05; obligation: FR05-RESULT-TWO; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `two`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot two; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): Hai card Alpha, ID201 giá 1000₫ và ID202 giá 1001₫, không gộp vì trùng tên.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-031: COUPLED-M2

- Rule: FR05-R05; obligation: FR05-COUPLED-M2; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `mixed`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot mixed; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): M=2,n=1: chỉ Alpha, không đưa Beta vào kết quả.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-032: COUPLED-M3

- Rule: FR05-R05; obligation: FR05-COUPLED-M3; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `three`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot three; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'Alpha' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
- Expected (explicit): M=3,n=1: chỉ Alpha, không đưa Beta/Gamma vào kết quả.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-033: EMPTY-RECOVERY

- Rule: FR05-R05, FR05-R08; obligation: FR05-EMPTY-RECOVERY; Technique: DT; Interface: NATIVE.
- Preconditions: Target native/build/locale/network như manifest. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "ZZZ_NO_MATCH", "mode": "search"}`.
- Steps:
  1. Reset backend về snapshot full; kiểm tra row count và hash fixture.
  2. Mở Home từ state sạch; chờ response trước khi nhập, trừ case loading.
  3. Nhập chính xác 'ZZZ_NO_MATCH' vào search; bấm Tìm; đợi request hoàn tất, trừ case pending.
  4. Sau lần search đầu, thay q thành Alpha và bấm Tìm; đối chiếu ID101.
- Expected (explicit): Search vô nghiệm có empty state; sau đó search Alpha có đúng Alpha, không lưu kết quả cũ.
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-034: LIST

- Rule: FR05-R05; obligation: FR05-LIST-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": null, "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products không có search.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-035: EXACT

- Rule: FR05-R05; obligation: FR05-EXACT-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'Alpha'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [101].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-036: NO-MATCH

- Rule: FR05-R05; obligation: FR05-NO-MATCH-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "ZZZ_NO_MATCH", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'ZZZ_NO_MATCH'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-037: NAME-ONLY

- Rule: FR05-R05; obligation: FR05-NAME-ONLY-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "DescriptionToken", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'DescriptionToken'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-038: UNICODE

- Rule: FR05-R05; obligation: FR05-UNICODE-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "Cà phê", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'Cà phê'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [104].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-039: QUOTE

- Rule: FR05-R05; obligation: FR05-QUOTE-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "O'Brien", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ "O'Brien".
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [105].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-040: AMP

- Rule: FR05-R05; obligation: FR05-AMP-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A&B", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'A&B'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [106].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-041: PLUS

- Rule: FR05-R05; obligation: FR05-PLUS-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A+B", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'A+B'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [107].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-042: HASH

- Rule: FR05-R05; obligation: FR05-HASH-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `full`; raw input: `{"search": "A#B", "mode": "search"}`.
- Steps:
  1. Reset snapshot full trong DB copy.
  2. GET /api/products với search được URL-encode từ 'A#B'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [108].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-043: COUNT-EMPTY

- Rule: FR05-R05; obligation: FR05-COUNT-EMPTY-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `empty`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset snapshot empty trong DB copy.
  2. GET /api/products với search được URL-encode từ 'Alpha'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-044: COUNT-ONE

- Rule: FR05-R05; obligation: FR05-COUNT-ONE-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `one`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset snapshot one trong DB copy.
  2. GET /api/products với search được URL-encode từ 'Alpha'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [201].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

## FR05-DT-045: COUNT-TWO

- Rule: FR05-R05; obligation: FR05-COUNT-TWO-API; Technique: DT; Interface: API.
- Preconditions: Backend copy đang chạy; không dùng DB working tree. Không đăng nhập, không mở detail/cart; reset q/navigation/network trước case.
- Fixture: `two`; raw input: `{"search": "Alpha", "mode": "search"}`.
- Steps:
  1. Reset snapshot two trong DB copy.
  2. GET /api/products với search được URL-encode từ 'Alpha'.
  3. Lưu status/raw body; đối chiếu expected ID set độc lập.
- Expected (explicit): HTTP 200, JSON array, exact ID set [201, 202].
- Actual: chưa thực thi. Status: **Not Run**. Evidence: chưa có.

