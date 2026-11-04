# Kịch bản giới thiệu các Agent Skills trong project

## 1. Trọng tâm và thời lượng

Video chủ yếu **giải thích các skills đang có trong `.agents/skills/`**: mục đích, đầu vào, quy trình bên trong, đầu ra, giới hạn và khả năng tái sử dụng. FR-15 chỉ là ví dụ nối các skills thành một chu trình trên cùng chức năng; không dành phần lớn thời gian đọc bảng test hoặc chạy terminal.

Thời lượng lời thoại chính khoảng **12–14 phút**: khoảng 80% giới thiệu/cách áp dụng skills, 20% minh họa FR-15. Thời gian chỉ là gợi ý, chưa phải thời lượng video đã quay. Lệnh chạy suite đầy đủ chuyển xuống phụ lục để dùng nếu cần chứng minh execution live.

Ba skill trọng tâm là `domain-testing`, `boundary-value-analysis`, `ai-audit`. Bốn skill hỗ trợ được giới thiệu ngắn để thấy cấu trúc project; không tuyên bố tất cả đều đã được dùng trong mọi feature. Kịch bản này không sửa nội dung SKILL.md.

## 2. Kịch bản lời thoại chính

### Cảnh 1 — Skill là gì và project có những skill nào? (0:00–1:30)

**Màn hình:** mở thư mục `.agents/skills/`, sau đó mở [domain-testing/SKILL.md](../../.agents/skills/domain-testing/SKILL.md). Chỉ vào YAML `name`, `description`, phần hướng dẫn và thư mục `references/`.

**Lời thoại:**

> Trong project này, skill là một bộ hướng dẫn để AI thực hiện một loại công việc theo quy trình có thể tái sử dụng. Mỗi skill có file SKILL.md, mô tả khi nào nên dùng, các bước cần làm và đầu ra cần kiểm tra. Một số skill còn có tài liệu tham chiếu hoặc script hỗ trợ.
>
> Điểm quan trọng là skill không chứa sẵn đáp án đúng cho mọi feature. Khi áp dụng, AI vẫn phải đọc requirement của chức năng đang kiểm thử, xác định dữ liệu và kiểm chứng kết quả. Chúng ta cũng không coi việc AI nói đã dùng skill là bằng chứng test đã chạy.
>
> Project hiện có bảy skill. Tôi tập trung vào ba skill phục vụ bài này: Domain Testing để mô hình miền, Boundary Value Analysis để chọn điểm biên, và AI Audit để lưu bằng chứng sử dụng AI. Các skill còn lại hỗ trợ lập hồ sơ QA, thao tác trình duyệt và quản lý commit. Tôi sẽ dùng FR-15 quản lý sản phẩm làm ví dụ ngắn xuyên suốt.

**Thao tác:** mở bảng dưới khi nói tên và vai trò; không cần đọc toàn bộ từng file.

| Skill trong project | Vai trò | Cách sử dụng trong video |
|---|---|---|
| [domain-testing](../../.agents/skills/domain-testing/SKILL.md) | Chuyển requirement thành predicate, miền và điểm On/Off/In, tương tác nhiều biến | Giải thích chi tiết, minh họa tên/giá/danh mục FR-15 |
| [boundary-value-analysis](../../.agents/skills/boundary-value-analysis/SKILL.md) | Chọn phương pháp BVA, dẫn xuất điểm, fixture và mapping | Giải thích skill hiện tại và phân biệt với suite lịch sử |
| [ai-audit](../../.agents/skills/ai-audit/SKILL.md) | Lưu prompt/output, provenance, metadata và learner review có bằng chứng | Giải thích cách ghi log và xuất báo cáo |
| [qa-test-planner](../../.agents/skills/qa-test-planner/SKILL.md) | Hỗ trợ test plan, test case và bug report có cấu trúc | Giới thiệu vai trò; skill này yêu cầu gọi tên rõ ràng |
| [webapp-testing](../../.agents/skills/webapp-testing/SKILL.md) | Hướng dẫn kiểm web bằng Python Playwright, DOM và screenshot | Giới thiệu vai trò hỗ trợ execution |
| [playwright-cli](../../.agents/skills/playwright-cli/SKILL.md) | Điều khiển browser qua CLI, snapshot, refs và thao tác | Giới thiệu như lựa chọn công cụ, không mặc định chạy cùng Python runner |
| [commit-work](../../.agents/skills/commit-work/SKILL.md) | Review phạm vi thay đổi, staging và Conventional Commits | Giới thiệu ngắn; chưa dùng để commit vì chưa được yêu cầu |

### Cảnh 2 — Skill Domain Testing: từ requirement đến miền kiểm thử (1:30–4:15)

**Màn hình:** các phần “Establish the test basis”, “Derive cases step by step”, “Report and execution” trong [skill](../../.agents/skills/domain-testing/SKILL.md); mở cạnh [domain model FR-15](fr15/domain-model.md).

**Lời thoại:**

> Skill đầu tiên là Domain Testing. Skill này phù hợp khi chức năng có nhiều điều kiện quyết định chấp nhận hay từ chối. Nó yêu cầu AI mô hình miền trước khi chọn test data, nên đầu ra không chỉ là một bảng case được liệt kê theo cảm tính.
>
> Đầu vào của skill gồm requirement, API contract, fixture và các điều kiện về trạng thái, quyền truy cập hoặc thời gian nếu có. Bước đầu tiên là xác định rule và những gì chưa rõ. Expected Result phải dựa vào đặc tả; implementation chỉ giúp quan sát phần mềm đang làm gì.
>
> Tiếp theo, skill yêu cầu chuyển rule thành predicate và xác định miền hợp lệ, miền không hợp lệ. Sau đó chọn một fixture In hợp lệ làm đối chứng. Từ các mặt biên, AI chọn điểm On và các điểm Off ở hai phía, đồng thời đánh giá lại predicate để biết kết quả phải là gì. Không thể chỉ nhìn nhãn On rồi kết luận điểm đó hợp lệ.
>
> Ví dụ với FR-15, tên có độ dài từ 1 đến 255, giá phải lớn hơn không và danh mục phải tồn tại. Tôi chọn điểm In là tên dài 128, giá 100000, danh mục 10, token admin. Khi kiểm tên dài 256, tôi giữ các điều kiện khác hợp lệ để cô lập rule về tên. Trên mặt giá bằng không, điểm On lại không hợp lệ vì điều kiện là giá lớn hơn không.
>
> Skill còn hướng dẫn lấy mẫu ở nhiều vị trí dọc biên, xét giao điểm và tương tác. Chẳng hạn tên dài 256 đi cùng giá bằng không vi phạm hai rule. Nếu hệ thống từ chối, case đó chưa chứng minh cả hai validator hoạt động độc lập. Đây là vấn đề masking mà skill yêu cầu công khai.
>
> Đầu ra cần có mô hình predicate, miền, lý do chọn điểm, dữ liệu cụ thể, case và mapping nghĩa vụ kiểm thử. Một tập mẫu hữu hạn không được trình bày thành bằng chứng đã kiểm hết toàn bộ miền input.

**Thao tác minh họa, khoảng 30 giây:** chỉ vào hai dòng `(L=255,p=1)` và `(L=256,p=1)` trong domain model; sau đó chỉ `(L=256,p=0)` để giải thích masking. Danh mục 10/20 hợp lệ vì tồn tại, không phải vì nằm trong một khoảng ID liên tục.

**Prompt minh họa áp dụng skill — nhập thật nếu quay tương tác AI:**

```text
Dùng skill domain-testing hiện tại trong .agents/skills cho FR-15.
Đọc README.md và api_specification.md; giải thích trong chat theo thứ tự:
input/output → predicate và miền → fixture In → On/Off → tương tác/masking
→ case và mapping. Minh họa rule tên, giá và membership danh mục.
Chỉ đọc artifact hiện có, không sửa file hoặc chạy SUT. Không tự đặt giá
trần, precision tiền hoặc dùng code làm expected result.
```

### Cảnh 3 — Skill BVA hiện tại: chọn phương pháp trước khi chọn giá trị (4:15–7:15)

**Màn hình:** “Establish the method”, “Derive and explain”, “Reports and migration” của [skill BVA](../../.agents/skills/boundary-value-analysis/SKILL.md), cùng [bva-methods.md](../../.agents/skills/boundary-value-analysis/references/bva-methods.md).

**Lời thoại:**

> Skill thứ hai là Boundary Value Analysis. Skill này dành cho những đại lượng có thứ tự như số, độ dài, số lượng hoặc thời gian. Danh mục sản phẩm và role là các lớp phân loại, nên không tự áp BVA theo số ID hay tên role.
>
> Quy tắc đầu tiên của skill hiện tại là chọn rõ phương pháp trước khi chọn điểm. Requirement quyết định hành vi đúng, còn lecture quyết định cách áp dụng kỹ thuật của môn học. Nếu người dùng chỉ định biến thể, skill làm theo biến thể đó. Nếu có lecture KCPM mà chưa chỉ định riêng, mặc định là Standard BVA, cùng phần bổ sung Robustness được ghi riêng.
>
> Với khoảng hợp lệ hai phía, skill xác định cận dưới, cận trên, bước phân giải và một giá trị nominal hợp lệ. Standard lấy cận dưới, điểm kế tiếp, nominal, điểm sát cận trên và cận trên. Robustness thêm hai điểm ở ngoài miền. Khi kết hợp nhiều input, Standard và Robustness thay đổi từng biến một, còn Worst-case lấy tích các tập điểm khả thi.
>
> Công thức 4n+1, 6n+1, 5 mũ n và 7 mũ n chỉ dùng khi các biến độc lập, có hai cận hữu hạn và các điểm không trùng. Ví dụ hai biến nguyên từ 1 đến 5, nominal là 3, sẽ có 9 case Standard, 13 case Robustness, 25 Worst-case và 49 Robust Worst-case. Skill yêu cầu kiểm tập điểm thực tế thay vì áp công thức máy móc.
>
> Có những miền không thỏa điều kiện này. Giá FR-15 chỉ có cận dưới nghiêm và chưa có precision toàn miền, nên không tự chọn một giá tối đa hay bước 0.01. Với singleton như OTP đúng sáu ký tự, nhiều điểm Standard có thể trùng nhau và phải khử trùng. Các số đếm ký tự cùng suy ra từ một password cũng không phải các input độc lập.
>
> Sau khi chọn điểm, skill yêu cầu tạo fixture thật, giữ các điều kiện khác hợp lệ và ánh xạ vào case. Cần tách nghĩa vụ thiết kế khỏi nghĩa vụ đã thực thi; một case mới bắt đầu Not Run, không có Passed chỉ vì AI vừa sinh nó.
>
> Phần migration cũng rất quan trọng. Suite FR-15 có sẵn dùng quy ước ISTQB 3-value lịch sử. Skill hiện tại hướng dẫn giữ tên phương pháp và evidence cũ, không đổi nhãn chúng thành Standard BVA. Nếu muốn áp dụng lecture hiện tại để tạo suite mới, chúng ta phải version thiết kế và kiểm chứng execution riêng.

**Bảng minh họa ngắn, không đọc toàn bộ báo cáo:**

| Điểm cần giải thích | Ví dụ |
|---|---|
| Skill hiện tại, Standard cho độ dài tên `[1,255]`, ASCII bước 1, nominal 128 | `{1,2,128,254,255}` |
| Robustness thêm ngoài miền | `{0,256}` bổ sung vào tập Standard |
| Suite FR-15 lịch sử, giữ riêng phương pháp | Tập BVA tên `{0,1,2,254,255,256,257}` theo hợp lân cận endpoint của phân vùng hợp lệ và không hợp lệ |
| Giới hạn của minh họa | Các tập trên không được tự đổi nhãn hoặc dùng số điểm để suy ra số case đã chạy |

**Prompt minh họa skill hiện tại:**

```text
Dùng skill boundary-value-analysis hiện tại để giải thích Standard BVA và
Robustness cho độ dài tên FR-15: 1..255, ASCII h=1, nominal=128.
Nêu partitions, bounds, selected values, fixture và expected result.
Sau đó so với tập ISTQB 3-value trong bva-report.md lịch sử và giải thích
vì sao không được đổi nhãn evidence cũ. Chỉ trình bày trong chat;
không sửa suite, không gán actual hoặc status mới.
```

### Cảnh 4 — Skill AI Audit: lưu được gì và không được suy ra điều gì? (7:15–9:30)

**Màn hình:** [ai-audit/SKILL.md](../../.agents/skills/ai-audit/SKILL.md), [CLI guide](../../.agents/skills/ai-audit/references/usage.md), [AI Audit Report](AI-Audit-Report.md).

**Lời thoại:**

> Skill thứ ba là AI Audit. Skill này xử lý bằng chứng sử dụng AI, không thay thế test execution. Nó phân biệt ba phần: AI đã tạo gì, người học thực sự đã review hoặc sửa gì, và thông tin nào chưa có.
>
> Mỗi interaction cần tool, model nếu biết, prompt, output, task, source và mức độ capture. Skill phân biệt thời điểm tương tác với thời điểm ghi log. Nếu chỉ biết lúc lưu artifact thì không được dùng thời gian đó để dựng lại thời gian prompt cũ. Model không biết thì để Unknown.
>
> Capture có thể là complete, partial hoặc summary. Complete chỉ phù hợp khi toàn bộ interaction đó có nguyên văn; ngay cả vậy cũng chưa chứng minh log chứa toàn bộ phiên. Skill không tự truy cập hidden reasoning và không tự khôi phục những đoạn chat không được cung cấp.
>
> Với learner review, AI tự nhận xét không được xem là sinh viên đã chấp nhận. Skill giữ Pending learner review cho tới khi có feedback thực tế. Nếu người học sửa, review mới được append vào interaction tương ứng và giữ nguyên output gốc. Việc chấp nhận nội dung cũng không chứng nhận test đã Passed.
>
> Trong project còn có helper record, review và export. Helper đọc prompt/output được cung cấp qua file UTF-8, lưu JSONL và xuất Markdown. Nó không có chat connector và không phải background logger. Vì vậy, mở skill hay tạo một file audit không có nghĩa mọi tương tác sau đó tự được ghi lại. PDF cần một bước xuất và kiểm tra riêng.

**Thao tác minh họa:** chỉ một interaction trong audit: prompt, output, `occurred_at`, `recorded_at`, capture và review status. Nêu rõ đây là log lịch sử, không phải log tự động của đoạn video vừa quay.

**Prompt minh họa:**

```text
Dùng skill ai-audit để giải thích schema record/review/export hiện có.
Chỉ ra occurred_at khác recorded_at, capture extent, Unknown model và
Pending learner review. Minh họa bằng log FR-15 được cung cấp, không
khôi phục chat không truy cập được, không gán AI self-review cho sinh viên.
Chỉ trình bày trong chat, chưa ghi log hoặc thay đổi artifact.
```

### Cảnh 5 — Các skill hỗ trợ và ranh giới trách nhiệm (9:30–10:45)

**Màn hình:** quay lại danh sách bảy skill; mở nhanh phần mô tả của bốn skill hỗ trợ.

**Lời thoại:**

> Ngoài ba skill trọng tâm, qa-test-planner hỗ trợ cấu trúc test plan, test case và bug report. Skill này trong project có trigger explicit, nghĩa là phải được gọi tên rõ ràng; không mặc định mọi bảng test đã được tạo bằng skill này.
>
> webapp-testing hướng dẫn viết Python Playwright, quan sát DOM đã render, chọn selector và thu screenshot/log. playwright-cli là một cách điều khiển browser bằng command line và snapshot refs. Đây là hai cách hỗ trợ thao tác trình duyệt, không phải cứ chạy Playwright là tự động đã dùng cả hai skill.
>
> Các skill thực thi giúp quan sát hành vi; oracle vẫn đến từ requirement. Riêng EShop, server helper chung không tự bảo vệ working database: chúng ta vẫn cần runner và fixture cô lập theo quy tắc project.
>
> Cuối cùng, commit-work hỗ trợ kiểm tra thay đổi, staging đúng phạm vi và viết Conventional Commits. Skill không tự cấp quyền commit hoặc push. Hiện người dùng chưa yêu cầu commit, nên phần demo này chỉ giới thiệu vai trò của nó.

### Cảnh 6 — Ghép các skill thành workflow trên một feature (10:45–12:45)

**Màn hình:** lần lượt mở [requirements](fr15/requirements.md), [domain model](fr15/domain-model.md), [BVA report](fr15/bva-report.md), [suite review](fr15/suite-review.md), evidence và [Main Report](Main-Report.md#fr15). Không đọc lại toàn bộ chi tiết FR-15.

**Lời thoại:**

> Để thấy các skill phối hợp thế nào, tôi nối chúng lại trên cùng FR-15. Bước một là đọc requirement và ghi ambiguity. Bước hai, Domain Testing tạo predicate, miền và điểm kiểm. Bước ba, BVA dẫn xuất tập giá trị theo convention đã chọn. Bước bốn là review, khử trùng và giữ mapping technique. Bước năm mới thực thi trong fixture độc lập. Bước sáu ghi actual, status và bug theo evidence. Bước bảy phân tích gap và giữ audit cho quá trình đó.
>
> Suite lịch sử có 198 ca nguồn hợp nhất thành 158 case duy nhất. Case FR15-TC-075 xuất hiện trong báo cáo dưới FR15-DT-069 và FR15-BVA-024 nhưng chỉ được tính một lần. Tôi dùng mapping để đi từ thiết kế tới response, snapshot và screenshot, thay vì chỉ tin bảng tổng kết.
>
> Run03 lịch sử có 56 Passed, 95 Failed và 7 Blocked. Năm nhóm bug không có nghĩa 95 bug. Các con số này minh họa đầu ra của cả quy trình, không phải tiêu chuẩn để đánh giá skill đã đúng hay sai. Muốn chứng minh execution mới phải chạy lại và dùng run ID cùng bằng chứng mới; không lấy log cũ để giả một lần chạy vừa thực hiện.

**Thao tác minh họa khoảng một phút:**

1. Tìm `FR15-TC-075` trong [mapping](test-case-id-map.csv).
2. Mở [record run03](fr15/evidence/fr15-run03/web/FR15-TC-075.json) và [ảnh sau reload](fr15/evidence/fr15-run03/web/screenshots/FR15-TC-075_reload.png).
3. Giải thích ngắn: tên 256 ký tự phải bị từ chối, nhưng observation lịch sử tạo sản phẩm mới; liên kết tới `FR15-BUG-001` trong [Bugs Report](Bugs-Report.md).
4. Mở [gap analysis](fr15/ai-gap-analysis.md), chỉ một ví dụ lỗi của harness như snapshot UI quá sớm. Chốt rằng cần kiểm công cụ đo trước khi quy mọi Failed cho SUT.

Nếu cần thêm phần execution live theo yêu cầu bài, dùng phụ lục B trong cùng video, ngay sau cảnh này; thời gian chạy được tính riêng. Nếu chỉ mở evidence cũ, giới thiệu đúng là walkthrough, không gọi là đã chạy suite mới.

### Cảnh 7 — Khả năng tái sử dụng và kết thúc (12:45–13:30)

**Màn hình:** ba file SKILL.md trọng tâm và [README tổng hợp](README.md).

**Lời thoại:**

> Giá trị tái sử dụng của các skill nằm ở quy trình và những điều phải kiểm chứng. Khi chuyển sang feature khác, tôi giữ các bước nhưng thay requirement, predicate, fixture và oracle. Không chỉ đổi tên FR rồi dùng lại case hoặc Expected Result.
>
> Domain Testing giúp đặt đúng câu hỏi về miền và tương tác. BVA giúp dẫn xuất đúng tập điểm theo phương pháp. AI Audit giữ bằng chứng về cách AI được sử dụng và những correction thực sự có. Các skill hỗ trợ giúp thực thi, trình bày và quản lý thay đổi trong phạm vi được cho phép.
>
> Kết luận của video là skill giúp tổ chức và kiểm soát công việc với AI, nhưng mỗi đầu ra vẫn cần đối chiếu nguồn, chạy kiểm chứng khi phù hợp và được người học review. Không có skill nào tự bảo đảm mọi test Passed hoặc đã tìm hết bug.

## 3. Checklist nội dung video

- [ ] Người xem hiểu khi nào dùng, đầu vào, các bước, đầu ra và giới hạn của ba skill chính.
- [ ] Có chỉ trực tiếp vào hướng dẫn hiện tại của SKILL.md, không chỉ đọc tên file.
- [ ] Phân biệt phương pháp BVA hiện tại với convention của suite FR-15 lịch sử.
- [ ] Ví dụ FR-15 ngắn và xuyên suốt; phần chính không biến thành buổi đọc test report.
- [ ] Chỉ nhận đã dùng một skill khi có prompt/output hoặc provenance thực tế tương ứng.
- [ ] Có ví dụ workflow requirement → DT → BVA → review/deduplicate → execute → results/bug → gap/audit.
- [ ] Phân biệt walkthrough lịch sử và execution mới; giữ nguyên Failed/Blocked.
- [ ] Audit không bị mô tả như background logger hay công cụ khôi phục hidden chat.
- [ ] Không gán self-review cho sinh viên; không tự commit, push hoặc publish.

## Phụ lục A — Chuẩn bị môi trường khi cần quay execution live

Mở project tại `/Users/thuytran/Workspace/eshop-sut`. Terminal dùng trong kịch bản đứng tại repository root, không chạy npm ở root.

| Thành phần | Chuẩn bị |
|---|---|
| Codex | Một khung chat để nhập prompt và quan sát AI áp dụng skill. Không dùng phản hồi cũ để giả làm phản hồi vừa sinh. |
| Trình soạn thảo | Mở sẵn các file ở mục 3; tăng cỡ chữ để người xem đọc được predicate, case ID và output terminal. |
| Node/backend | Có Node, npm và dependency từ package-lock của backend, frontend-admin. Phiên bản của demo mới cần được ghi lại, không mặc định giống run03. |
| Python/browser | Python có Playwright và Chromium tương thích; kiểm tra trước khi quay. Runner nhận `--python` nếu cần chỉ định đúng interpreter. |
| Ports | 3000 và 5174 trống. Runner từ chối nếu có process khác chiếm port; không tự kill process không thuộc demo. |
| Fixture | Dùng runner FR-15 tạo backend/SQLite riêng trong thư mục tạm. Không start/seed backend working tree. |
| Evidence | Chọn run ID mới; không dùng lại run01/run02/run03 hoặc ghi đè thư mục đã tồn tại. |

Nếu thiếu npm dependencies, chuẩn bị ngoài thời gian quay bằng `npm ci` trong đúng `backend/` và `frontend-admin/`. Không chạy `npm run seed` trên backend gốc. Xem [prepare-environment.cjs](../../tests/fr15/prepare-environment.cjs) và [run-all.cjs](../../tests/fr15/run-all.cjs) trước khi chạy: runner copy source backend, dùng SQLite riêng, kiểm port và giữ hash database làm việc.

Nếu không thể chạy thật do môi trường, giữ nguyên phần giải thích phương pháp nhưng ghi rõ đây chỉ là walkthrough evidence lịch sử. Không gọi walkthrough đó là demo thực thi mới đầy đủ.

## Phụ lục B — Lệnh và thao tác execution, không đọc hết trong phần giới thiệu skill

**Màn hình:** terminal tại root, runner và thư mục output mới.

**Lời dẫn nếu chọn quay execution thật:**

> Tôi kiểm harness và mapping trước, sau đó chạy toàn bộ 158 case. Runner tạo backend/SQLite riêng, tự chạy Admin và thu evidence API/WEB. Playwright chạy headless nên tôi trình bày log và ảnh do runner chụp; không mô tả cửa sổ browser thủ công như thể nó là runner.

**Các lệnh kiểm harness trước execution:**

```bash
node --test tests/fr15/harness.test.cjs tests/fr15/png-fixture.test.cjs
node tests/fr15/run-all.cjs --ui-self-check
```

Nếu thiếu Python/Playwright hoặc kiểm harness không đạt, xử lý trước khi chạy suite; không đổi lỗi công cụ thành bug SUT. Hai lệnh trên kiểm harness, không phải execution của 158 business cases.

**Lệnh chạy mới — cùng một terminal:**

```bash
fr15_demo_id="fr15-demo-01"
node tests/fr15/run-all.cjs \
  --suite tests/fr15/suite.json \
  --root "/private/tmp/$fr15_demo_id" \
  --out "docs/testing/fr15/evidence/$fr15_demo_id" \
  --run-id "$fr15_demo_id"
fr15_demo_exit=$?
printf 'Runner exit code: %s\n' "$fr15_demo_exit"
```

`fr15-demo-01` là tên dự kiến, không phải lượt chạy đã có. Nếu root/output đã tồn tại, đổi cả run ID thành tên chưa dùng; không xóa hoặc ghi đè evidence. Nếu cần Python khác, thêm `--python /duong/dan/python3` thực tế vào lệnh runner và lệnh ui-self-check; không copy đường dẫn minh họa đó như một interpreter có sẵn.

**Điểm quay bắt buộc:** run ID/command lúc bắt đầu, output summary lúc kết thúc, `manifest.json` và hai file `api/observations.json`, `web/observations.json` của run mới. Có thể tăng tốc đoạn chờ, không tráo summary run03 vào output run mới.

**Đọc exit code:**

| Code | Cách đọc trong runner hiện có |
|---|---|
| 0 | Không có Failed/Blocked/Not Run hoặc lỗi đối soát; kiểm lại manifest. |
| 1 | Có Failed, không có Blocked/Not Run hoặc lỗi đối soát. |
| 2 | Có Blocked/Not Run, lỗi môi trường/đối soát hoặc lỗi khởi tạo; đọc manifest/log để xác định. |

Không dùng exit code đơn lẻ để kết luận tất cả failure là bug. Trong manifest, kiểm `stats`, `environmentError`, `reconciliationErrors`, `workingDbUnchanged`, `suiteUnchanged`, build/runtime/timezone và hash. Các cờ/hash cần được đọc, không chỉ suy ra từ code 0.

**Đối soát observations của run vừa chạy:**

```bash
node tests/fr15/validate-suite.cjs \
  --results "docs/testing/fr15/evidence/$fr15_demo_id"
```

Nếu không có đủ observations, giữ ghi nhận lỗi thật và follow-up; không gán verdict theo kết quả mong đợi. Output path mới có log là để phục vụ demo, chưa tự cập nhật bảng tổng hợp của các run cũ.

## Phụ lục C — Chuỗi evidence cần mở

| Mục đích | File |
|---|---|
| Xem quy trình skill, các biến thể và migration | [Domain Testing](../../.agents/skills/domain-testing/SKILL.md), [BVA](../../.agents/skills/boundary-value-analysis/SKILL.md), [BVA methods](../../.agents/skills/boundary-value-analysis/references/bva-methods.md) |
| Hiểu cách ghi audit thật | [AI Audit skill](../../.agents/skills/ai-audit/SKILL.md), [CLI guide](../../.agents/skills/ai-audit/references/usage.md) |
| Ví dụ domain / BVA lịch sử FR-15 | [domain-model.md](fr15/domain-model.md), [bva-report.md](fr15/bva-report.md) |
| Số lượng suite và mapping | [suite-review](fr15/suite-review.md), [suite](../../tests/fr15/suite.json), [ID map](test-case-id-map.csv) |
| Đối chứng execution lịch sử | [manifest run03](fr15/evidence/fr15-run03/manifest.json), [API observations](fr15/evidence/fr15-run03/api/observations.json), [WEB observations](fr15/evidence/fr15-run03/web/observations.json) |
| Kết quả và bug tổng hợp | [Main Report](Main-Report.md#fr15), [Bugs Report](Bugs-Report.md) |
| Phân tích AI và provenance | [AI Audit](AI-Audit-Report.md), [AI Critique](AI-Critique.md), [FR-15 gap analysis](fr15/ai-gap-analysis.md) |

Kịch bản này chỉ sửa cách trình bày video; không đổi skill, phương pháp/evidence của suite lịch sử, test verdict hoặc điểm tự đánh giá. Việc quay, chạy demo mới và bổ sung URL video cần thực hiện thật sau đó.
