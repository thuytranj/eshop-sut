# Báo Cáo Lỗi GUI (Bug Report) — EShop SUT (HW03)

## 1. Tổng quan Thực thi

- **Run ID**: `run-1794234716427`
- **Build commit**: `HEAD`
- **Thời gian bắt đầu**: 2026-11-09T14:31:56.478Z
- **Tổng số mục checklist**: 70
- **Passed**: 20
- **Failed**: 48
- **Not Run**: 2
- **Tổng số Bug Candidates**: 48

## 2. Danh sách Lỗi Phát hiện Được

| Bug Key | Checklist ID | Mức độ (Severity) | Ưu tiên (Priority) | Căn cứ | Tóm tắt lỗi |
| --- | --- | :---: | :---: | :---: | --- |
| **BUG-GUI-003** | `GUI-003` | S3 | P2 | README | [GUI-003] Error: Password reset page must have exactly 1 h1 heading

[2mexpect([22m[31m |
| **BUG-GUI-004** | `GUI-004` | S3 | P2 | README | [GUI-004] Error: Email input must have type="email"

[2mexpect([22m[31mreceived[39m[2 |
| **BUG-GUI-005** | `GUI-005` | S3 | P2 | README | [GUI-005] Error: Step indicator (Bước 1/2) must be visible on step 1

[2mexpect([22m[31 |
| **BUG-GUI-006** | `GUI-006` | S3 | P2 | README | [GUI-006] Error: Confirm password input must exist

[2mexpect([22m[31mlocator[39m[2m) |
| **BUG-GUI-007** | `GUI-007` | S3 | P2 | README | [GUI-007] Error: Error container must exist in DOM above submit button

[2mexpect([22m[ |
| **BUG-GUI-008** | `GUI-008` | S3 | P2 | README | [GUI-008] Error: Error must indicate OTP format requires 6 digits

[2mexpect([22m[31mlo |
| **BUG-GUI-009** | `GUI-009` | S3 | P2 | README | [GUI-009] Error: Link "Quay lại đăng nhập" must exist on step 1

[2mexpect([22m[31mloca |
| **BUG-GUI-012** | `GUI-012` | S3 | P2 | checklist-extension | [GUI-012] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-013** | `GUI-013` | S3 | P2 | README | [GUI-013] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC |
| **BUG-GUI-014** | `GUI-014` | S2 | P1 | README | [GUI-014] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC |
| **BUG-GUI-015** | `GUI-015` | S2 | P1 | checklist-extension | [GUI-015] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC |
| **BUG-GUI-018** | `GUI-018` | S3 | P2 | README | [GUI-018] Error: Currency must use '₫', found 'VND' in "30.000.000 VND" |
| **BUG-GUI-019** | `GUI-019` | S3 | P2 | README | [GUI-019] Error: Expected exactly 1 h1 tag, found 2

[2mexpect([22m[31mreceived[39m[2 |
| **BUG-GUI-020** | `GUI-020` | S3 | P2 | checklist-extension | [GUI-020] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m( |
| **BUG-GUI-021** | `GUI-021` | S3 | P2 | README | [GUI-021] Error: Search term must be escaped text literal, not raw HTML <b> tag

[2mexpec |
| **BUG-GUI-024** | `GUI-024` | S3 | P2 | README | [GUI-024] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-025** | `GUI-025` | S3 | P2 | README | [GUI-025] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveText[2m([22m[32mexpe |
| **BUG-GUI-026** | `GUI-026` | S3 | P2 | checklist-extension | [GUI-026] Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected |
| **BUG-GUI-028** | `GUI-028` | S3 | P2 | README | [GUI-028] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-029** | `GUI-029` | S3 | P2 | README | [GUI-029] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-030** | `GUI-030` | S4 | P3 | README | [GUI-030] Error: Image #0 has empty alt text

[2mexpect([22m[31mreceived[39m[2m).[22 |
| **BUG-GUI-031** | `GUI-031` | S3 | P2 | README | [GUI-031] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-032** | `GUI-032` | S3 | P2 | README | [GUI-032] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpect |
| **BUG-GUI-033** | `GUI-033` | S3 | P2 | README | [GUI-033] Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

[2mexpe |
| **BUG-GUI-034** | `GUI-034` | S3 | P2 | README | [GUI-034] Error: Money column must be right-aligned

[2mexpect([22m[31mreceived[39m[2 |
| **BUG-GUI-036** | `GUI-036` | S3 | P2 | README | [GUI-036] Error: Quantity controls missing in cart row: minus=false, plus=false, input=fal |
| **BUG-GUI-037** | `GUI-037` | S3 | P2 | checklist-extension | [GUI-037] Error: Cart row must contain a quantity input field

[2mexpect([22m[31mlocato |
| **BUG-GUI-038** | `GUI-038` | S3 | P2 | checklist-extension | [GUI-038] Error: Quantity input required to test boundaries

[2mexpect([22m[31mreceived |
| **BUG-GUI-039** | `GUI-039` | S3 | P2 | README | [GUI-039] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpect |
| **BUG-GUI-040** | `GUI-040` | S3 | P2 | README | [GUI-040] Error: Breadcrumb navigation must exist on Cart page

[2mexpect([22m[31mlocat |
| **BUG-GUI-041** | `GUI-041` | S3 | P2 | README | [GUI-041] Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

[2mexpect( |
| **BUG-GUI-043** | `GUI-043` | S3 | P2 | README | [GUI-043] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp |
| **BUG-GUI-044** | `GUI-044` | S3 | P2 | README | [GUI-044] Error: Confirmation dialog must appear before removing item

[2mexpect([22m[3 |
| **BUG-GUI-045** | `GUI-045` | S3 | P2 | README | [GUI-045] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp |
| **BUG-GUI-047** | `GUI-047` | S3 | P2 | README | [GUI-047] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpect |
| **BUG-GUI-048** | `GUI-048` | S3 | P2 | README | [GUI-048] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpect |
| **BUG-GUI-050** | `GUI-050` | S3 | P2 | README | [GUI-050] Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

[2mexp |
| **BUG-GUI-051** | `GUI-051` | S3 | P2 | README | [GUI-051] Error: Product name must be truncated or blocked at max 255 chars

[2mexpect([ |
| **BUG-GUI-052** | `GUI-052` | S3 | P2 | README | [GUI-052] Error: Error message required for price <= 0

[2mexpect([22m[31mlocator[39m |
| **BUG-GUI-055** | `GUI-055` | S3 | P2 | README | [GUI-055] Error: Validation error element must appear in DOM

[2mexpect([22m[31mreceive |
| **BUG-GUI-057** | `GUI-057` | S3 | P2 | README | [GUI-057] Error: Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"
 |
| **BUG-GUI-059** | `GUI-059` | S3 | P2 | README | [GUI-059] Error: Editing must open in an accessible modal dialog with focus trap

[2mexpe |
| **BUG-GUI-060** | `GUI-060` | S2 | P1 | README | [GUI-060] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32me |
| **BUG-GUI-061** | `GUI-061` | S3 | P2 | checklist-extension | [GUI-061] Error: Confirmation modal must appear before deleting product

[2mexpect([22m |
| **BUG-GUI-066** | `GUI-066` | S3 | P2 | checklist-extension | [GUI-066] Error: Delete button must have descriptive aria-label

[2mexpect([22m[31mrece |
| **BUG-GUI-067** | `GUI-067` | S3 | P2 | checklist-extension | [GUI-067] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2 |
| **BUG-GUI-068** | `GUI-068` | S3 | P2 | checklist-extension | [GUI-068] Error: Quantity input required to test transient empty state

[2mexpect([22m[ |
| **BUG-GUI-070** | `GUI-070` | S3 | P2 | checklist-extension | [GUI-070] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp |

## 3. Chi tiết Từng Lỗi và Bước Tái hiện

### BUG-GUI-003: [GUI-003] Error: Password reset page must have exactly 1 h1 heading

[2mexpect([22m[31m

- **Checklist IDs**: `GUI-003`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-003
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Password reset page must have exactly 1 h1 heading

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m1[39m
Received: [31m0[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-1ed77--describing-forgot-password-chrome-local/test-failed-1.png`

---

### BUG-GUI-004: [GUI-004] Error: Email input must have type="email"

[2mexpect([22m[31mreceived[39m[2

- **Checklist IDs**: `GUI-004`
- **Yêu cầu liên quan**: `FR22-REQ`, `FR22-EMAIL`, `FR03-EMAIL-INPUT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-004
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Email input must have type="email"

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m"email"[39m
Received: [31m"text"[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-cab66-e-email-and-required-marker-chrome-local/test-failed-1.png`

---

### BUG-GUI-005: [GUI-005] Error: Step indicator (Bước 1/2) must be visible on step 1

[2mexpect([22m[31

- **Checklist IDs**: `GUI-005`
- **Yêu cầu liên quan**: `FR22-STEP`, `FR03-STEP-IND`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-005
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Step indicator (Bước 1/2) must be visible on step 1

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: .step-indicator, text=/Bước 1/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".step-indicator, text=/Bước 1/i". Did you
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-7d6f2-t-step-out-of-total-2-steps-chrome-local/test-failed-1.png`

---

### BUG-GUI-006: [GUI-006] Error: Confirm password input must exist

[2mexpect([22m[31mlocator[39m[2m)

- **Checklist IDs**: `GUI-006`
- **Yêu cầu liên quan**: `FR22-PWD`, `FR03-RESET-INPUTS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-006
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirm password input must exist

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('input[type="password"]').nth(1)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Confirm password input must exist locator('
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-723d2-ds-exist-with-type-password-chrome-local/test-failed-1.png`

---

### BUG-GUI-007: [GUI-007] Error: Error container must exist in DOM above submit button

[2mexpect([22m[

- **Checklist IDs**: `GUI-007`
- **Yêu cầu liên quan**: `FR03-PWD-RULES`, `FR03-PWD-CONFIRM`, `FR22-ERR-POS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-007
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error container must exist in DOM above submit button

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('.error, [role="alert"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Error container must e
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-9b4a8-age-positioned-above-submit-chrome-local/test-failed-1.png`

---

### BUG-GUI-008: [GUI-008] Error: Error must indicate OTP format requires 6 digits

[2mexpect([22m[31mlo

- **Checklist IDs**: `GUI-008`
- **Yêu cầu liên quan**: `FR03-RESET-INPUTS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-008
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error must indicate OTP format requires 6 digits

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=/Mã OTP phải có 6 chữ số|không đúng định dạng/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Error
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-7deef-tes-6-digit-format-strictly-chrome-local/test-failed-1.png`

---

### BUG-GUI-009: [GUI-009] Error: Link "Quay lại đăng nhập" must exist on step 1

[2mexpect([22m[31mloca

- **Checklist IDs**: `GUI-009`
- **Yêu cầu liên quan**: `FR03-BACK-LOGIN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-009
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Link "Quay lại đăng nhập" must exist on step 1

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('link', { name: 'Quay lại đăng nhập' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Link "Quay lại đăng n
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-45871-back-to-login-on-both-steps-chrome-local/test-failed-1.png`

---

### BUG-GUI-012: [GUI-012] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-012`
- **Yêu cầu liên quan**: `USR-KBD-NAV`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-012
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=/Bước 2|Mã OTP/i')
Expected: visible
Error: strict mode violation: locator('text=/Bước 2|Mã OTP/i') resolved to 2 elements:
    1) <div class="bg-green-100 text-green-800 p-3 rounded tex
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-5c9c8-m-on-both-step-1-and-step-2-chrome-local/test-failed-1.png`

---

### BUG-GUI-013: [GUI-013] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC

- **Checklist IDs**: `GUI-013`
- **Yêu cầu liên quan**: `FR03-OTP-GEN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-013
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
[2m  - → POST http://localhost:3000/api/forgot-password[22m
[2m    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17[22m
[2m    - accept: */*[22m
[2m    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-0456a-rs-exactly-6-numeric-digits-chrome-local/test-failed-1.png`

---

### BUG-GUI-014: [GUI-014] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC

- **Checklist IDs**: `GUI-014`
- **Yêu cầu liên quan**: `FR03-OTP-BIND`
- **Căn cứ**: README
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-014
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
[2m  - → POST http://localhost:3000/api/forgot-password[22m
[2m    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17[22m
[2m    - accept: */*[22m
[2m    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-82088-en-for-another-user-account-chrome-local/test-failed-1.png`

---

### BUG-GUI-015: [GUI-015] AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect EC

- **Checklist IDs**: `GUI-015`
- **Yêu cầu liên quan**: `USR-FEEDBACK-RESET`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-03)
2. Thực thi kiểm tra GUI-015
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
AggregateError: apiRequestContext.post: connect ECONNREFUSED ::1:3000
connect ECONNREFUSED 127.0.0.1:3000
Call log:
[2m  - → POST http://localhost:3000/api/forgot-password[22m
[2m    - user-agent: Playwright/1.65.0 (arm64; macOS 27.0) node/22.17[22m
[2m    - accept: */*[22m
[2m    - accept-en
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr03-FR-03-Forgot-and-Rese-f5213--login-with-new-credentials-chrome-local/test-failed-1.png`

---

### BUG-GUI-018: [GUI-018] Error: Currency must use '₫', found 'VND' in "30.000.000 VND"

- **Checklist IDs**: `GUI-018`
- **Yêu cầu liên quan**: `FR21-CURRENCY`, `USR-UI-ALIGN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-018
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Currency must use '₫', found 'VND' in "30.000.000 VND"
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-eb74b-s-₫-and-thousand-separators-chrome-local/test-failed-1.png`

---

### BUG-GUI-019: [GUI-019] Error: Expected exactly 1 h1 tag, found 2

[2mexpect([22m[31mreceived[39m[2

- **Checklist IDs**: `GUI-019`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-019
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Expected exactly 1 h1 tag, found 2

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m1[39m
Received: [31m2[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-eb30b--on-page-describing-content-chrome-local/test-failed-1.png`

---

### BUG-GUI-020: [GUI-020] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m(

- **Checklist IDs**: `GUI-020`
- **Yêu cầu liên quan**: `USR-CONTRAST`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-020
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

Expected: >= [32m4.5[39m
Received:    [31m1[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-ff674--Color-contrast-ratio-4-5-1-chrome-local/test-failed-1.png`

---

### BUG-GUI-021: [GUI-021] Error: Search term must be escaped text literal, not raw HTML <b> tag

[2mexpec

- **Checklist IDs**: `GUI-021`
- **Yêu cầu liên quan**: `FR05-SEARCH-SEC`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-021
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Search term must be escaped text literal, not raw HTML <b> tag

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m0[39m
Received: [31m1[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-89571--execution-or-tag-injection-chrome-local/test-failed-1.png`

---

### BUG-GUI-024: [GUI-024] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-024`
- **Yêu cầu liên quan**: `FR23-NAV-ACT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-024
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('link', { name: /Trang chủ|Cửa hàng/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" getByRole('link', { name: /Trang chủ|Cửa hàng/i
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-befb3-ion-highlight-for-Trang-chu-chrome-local/test-failed-1.png`

---

### BUG-GUI-025: [GUI-025] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveText[2m([22m[32mexpe

- **Checklist IDs**: `GUI-025`
- **Yêu cầu liên quan**: `FR23-CART-BADGE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-025
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveText[2m([22m[32mexpected[39m[2m)[22m failed

Locator: getByRole('link', { name: /Giỏ hàng/i }).locator('span, .badge').first()
Expected pattern: [32m/1/[39m
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toHaveT
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-558f4-ates-after-adding-product-A-chrome-local/test-failed-1.png`

---

### BUG-GUI-026: [GUI-026] Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected

- **Checklist IDs**: `GUI-026`
- **Yêu cầu liên quan**: `USR-NAV-PROD-DETAIL`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-026
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected pattern: [32m/\/product\/1/[39m
Received string:  [31m"http://localhost:5173/"[39m
Timeout: 5000ms

Call log:
[2m  - Expect "toHaveURL" with timeout 5000ms[22m
[2m    13 × locator 
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-70860-le-navigates-to-detail-page-chrome-local/test-failed-1.png`

---

### BUG-GUI-028: [GUI-028] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-028`
- **Yêu cầu liên quan**: `FR05-LOADING`, `USR-STATE-SKELETON`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-028
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: .loading, .skeleton, text=/Đang tải|Loading/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".loading, .skeleton, text=/Đang tải|Loading/i". Did you mean to CSS.escape it?


```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-51b25-r-while-waiting-for-network-chrome-local/test-failed-1.png`

---

### BUG-GUI-029: [GUI-029] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-029`
- **Yêu cầu liên quan**: `FR05-EMPTY`, `FR24-EMPTY`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-029
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=/Không tìm thấy|không có sản phẩm/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" locator('text=/Không tìm thấy|không có sản phẩ
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-d0ce8-ly-illustration-and-message-chrome-local/test-failed-1.png`

---

### BUG-GUI-030: [GUI-030] Error: Image #0 has empty alt text

[2mexpect([22m[31mreceived[39m[2m).[22

- **Checklist IDs**: `GUI-030`
- **Yêu cầu liên quan**: `FR24-ALT`
- **Căn cứ**: README
- **Severity / Priority**: S4 / P3

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-030
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Image #0 has empty alt text

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeTruthy[2m()[22m

Received: [31m""[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-c1c4f-criptive-non-empty-alt-text-chrome-local/test-failed-1.png`

---

### BUG-GUI-031: [GUI-031] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-031`
- **Yêu cầu liên quan**: `FR24-ADD-FEEDBACK`, `USR-STATE-TOAST`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-031
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: .toast, [role="status"], [role="alert"], text=/Đã thêm vào giỏ|thành công/i
Expected: visible
Error: Unexpected token "=" while parsing css selector ".toast, [role="status"], [role="alert"], text=/Đã 
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-48431-when-adding-product-to-cart-chrome-local/test-failed-1.png`

---

### BUG-GUI-032: [GUI-032] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpect

- **Checklist IDs**: `GUI-032`
- **Yêu cầu liên quan**: `FR07-COLS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-032
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

[32m- Expected  - 1[39m
[31m+ Received  + 1[39m

[2m  Array [[22m
[2m    "Sản phẩm",[22m
[32m-   "Đơn giá",[39m
[31m+   "Giá",[39m
[2m    "Số lượng",[22m
[2m    "Thành t
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-cd1fa--5-columns-in-correct-order-chrome-local/test-failed-1.png`

---

### BUG-GUI-033: [GUI-033] Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

[2mexpe

- **Checklist IDs**: `GUI-033`
- **Yêu cầu liên quan**: `FR07-TOTAL-LABEL`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-033
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Cart total label must be exact "Tổng cộng", not "Tổng tạm tính"

[2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected substring: [32m"Tổng cộng"[39m
Received string:    [31m"Tổng tạm tính: 30.000.000 ₫"[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-0bb04-strictly-matches-Tổng-cộng--chrome-local/test-failed-1.png`

---

### BUG-GUI-034: [GUI-034] Error: Money column must be right-aligned

[2mexpect([22m[31mreceived[39m[2

- **Checklist IDs**: `GUI-034`
- **Yêu cầu liên quan**: `FR21-CURRENCY`, `USR-UI-ALIGN`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-034
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Money column must be right-aligned

[2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: [32m"[7mrigh[27mt"[39m
Received: [31m"[7mlef[27mt"[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-decca-nd-right-aligned-in-columns-chrome-local/test-failed-1.png`

---

### BUG-GUI-036: [GUI-036] Error: Quantity controls missing in cart row: minus=false, plus=false, input=fal

- **Checklist IDs**: `GUI-036`
- **Yêu cầu liên quan**: `FR07-QTY-CTRL`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-036
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity controls missing in cart row: minus=false, plus=false, input=false
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-f2b27-for-adjusting-item-quantity-chrome-local/test-failed-1.png`

---

### BUG-GUI-037: [GUI-037] Error: Cart row must contain a quantity input field

[2mexpect([22m[31mlocato

- **Checklist IDs**: `GUI-037`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-037
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Cart row must contain a quantity input field

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).locator('input[type="number"], input')
Expected: visible
Timeout: 5000ms
Error: element(s) no
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-1a78a-llows-typing-quantity-value-chrome-local/test-failed-1.png`

---

### BUG-GUI-038: [GUI-038] Error: Quantity input required to test boundaries

[2mexpect([22m[31mreceived

- **Checklist IDs**: `GUI-038`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-038
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity input required to test boundaries

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThan[2m([22m[32mexpected[39m[2m)[22m

Expected: > [32m0[39m
Received:   [31m0[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-bd610--handled-safely-without-NaN-chrome-local/test-failed-1.png`

---

### BUG-GUI-039: [GUI-039] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpect

- **Checklist IDs**: `GUI-039`
- **Yêu cầu liên quan**: `FR23-NAV-ACT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-039
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

Expected pattern: [32m/active|font-bold|text-blue/[39m
Received string:  [31m"hover:underline"[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-955e4-avigation-highlight-on-cart-chrome-local/test-failed-1.png`

---

### BUG-GUI-040: [GUI-040] Error: Breadcrumb navigation must exist on Cart page

[2mexpect([22m[31mlocat

- **Checklist IDs**: `GUI-040`
- **Yêu cầu liên quan**: `FR23-BREADCRUMB`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-040
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Breadcrumb navigation must exist on Cart page

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('nav[aria-label="breadcrumb"], .breadcrumb')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Breadcrumb navigati
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-966ef-tion-from-Cart-back-to-Home-chrome-local/test-failed-1.png`

---

### BUG-GUI-041: [GUI-041] Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

[2mexpect(

- **Checklist IDs**: `GUI-041`
- **Yêu cầu liên quan**: `FR07-CONTINUE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-041
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Link text must be exact "Tiếp tục mua sắm", not "← Mua tiếp"

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('link', { name: 'Tiếp tục mua sắm' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Link text
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-1e735-k-navigates-back-to-catalog-chrome-local/test-failed-1.png`

---

### BUG-GUI-043: [GUI-043] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp

- **Checklist IDs**: `GUI-043`
- **Yêu cầu liên quan**: `FR07-ACCUMULATE`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-043
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexpected[39m[2m)[22m failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: [32m1[39m
Received: [31m2[39m
Timeout:  5000ms

Call log:
[2m  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-e44e8-ng-product-A-multiple-times-chrome-local/test-failed-1.png`

---

### BUG-GUI-044: [GUI-044] Error: Confirmation dialog must appear before removing item

[2mexpect([22m[3

- **Checklist IDs**: `GUI-044`
- **Yêu cầu liên quan**: `FR07-DEL-CONFIRM`, `FR24-DEL-CONFIRM`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-044
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirmation dialog must appear before removing item

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeTruthy[2m()[22m

Received: [31mfalse[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-c397b-s-before-deleting-cart-item-chrome-local/test-failed-1.png`

---

### BUG-GUI-045: [GUI-045] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp

- **Checklist IDs**: `GUI-045`
- **Yêu cầu liên quan**: `FR07-DEL-CONFIRM`, `FR24-DEL-CONFIRM`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-045
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexpected[39m[2m)[22m failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: [32m1[39m
Received: [31m0[39m
Timeout:  5000ms

Call log:
[2m  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-4d096-t-item-Confirm-deletes-item-chrome-local/test-failed-1.png`

---

### BUG-GUI-047: [GUI-047] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpect

- **Checklist IDs**: `GUI-047`
- **Yêu cầu liên quan**: `FR15-CRUD-VIEW`, `FR21-LANG`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-047
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoEqual[2m([22m[32mexpected[39m[2m) // deep equality[22m

[32m- Expected  - 3[39m
[31m+ Received  + 2[39m

[2m  Array [[22m
[2m    "Ảnh",[22m
[32m-   "Tên sản phẩm",[39m
[31m+   "Tên SP",[39m
[2m    "Giá",[22m
[32m-   "Danh mục
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-73049-s-Vietnamese-column-headers-chrome-local/test-failed-1.png`

---

### BUG-GUI-048: [GUI-048] Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpect

- **Checklist IDs**: `GUI-048`
- **Yêu cầu liên quan**: `FR21-H1`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-048
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoMatch[2m([22m[32mexpected[39m[2m)[22m

Expected pattern: [32m/Quản lý Sản phẩm|Sản phẩm/i[39m
Received string:  [31m"EShop Admin"[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-6c27d-scribing-product-management-chrome-local/test-failed-1.png`

---

### BUG-GUI-050: [GUI-050] Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

[2mexp

- **Checklist IDs**: `GUI-050`
- **Yêu cầu liên quan**: `FR22-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-050
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Required fields (Tên, Giá, Danh mục) must have explicit * labels

[2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected substring: [32m"*"[39m
Received string:    [31m"Thêm sản phẩm mới[39m
[31mĐiện thoại[39m
[31mLaptop[39m

```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-75675-ields-show-asterisk-marker--chrome-local/test-failed-1.png`

---

### BUG-GUI-051: [GUI-051] Error: Product name must be truncated or blocked at max 255 chars

[2mexpect([

- **Checklist IDs**: `GUI-051`
- **Yêu cầu liên quan**: `FR15-NAME-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-051
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Product name must be truncated or blocked at max 255 chars

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

Expected: <= [32m255[39m
Received:    [31m256[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-1b73d-ax-length-of-255-characters-chrome-local/test-failed-1.png`

---

### BUG-GUI-052: [GUI-052] Error: Error message required for price <= 0

[2mexpect([22m[31mlocator[39m

- **Checklist IDs**: `GUI-052`
- **Yêu cầu liên quan**: `FR15-PRICE-REQ`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-052
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Error message required for price <= 0

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=/Giá phải lớn hơn 0|không hợp lệ/i')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Error message required for pr
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-ba58a-pts-only-positive-amounts-0-chrome-local/test-failed-1.png`

---

### BUG-GUI-055: [GUI-055] Error: Validation error element must appear in DOM

[2mexpect([22m[31mreceive

- **Checklist IDs**: `GUI-055`
- **Yêu cầu liên quan**: `FR22-ERR-POS`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-055
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Validation error element must appear in DOM

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThan[2m([22m[32mexpected[39m[2m)[22m

Expected: > [32m0[39m
Received:   [31m0[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-eeb70-irectly-above-submit-button-chrome-local/test-failed-1.png`

---

### BUG-GUI-057: [GUI-057] Error: Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"


- **Checklist IDs**: `GUI-057`
- **Yêu cầu liên quan**: `FR23-LOGOUT`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-057
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Logout button must have exact text "Đăng xuất", not "Thoát" or "Log out"

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('button', { name: 'Đăng xuất' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Lo
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-91514--label-in-header-or-sidebar-chrome-local/test-failed-1.png`

---

### BUG-GUI-059: [GUI-059] Error: Editing must open in an accessible modal dialog with focus trap

[2mexpe

- **Checklist IDs**: `GUI-059`
- **Yêu cầu liên quan**: `FR21-TABORDER`, `USR-KBD-NAV`
- **Căn cứ**: README
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-059
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Editing must open in an accessible modal dialog with focus trap

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('dialog, [role="dialog"], .modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Editing mus
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-34786-lements-keyboard-focus-trap-chrome-local/test-failed-1.png`

---

### BUG-GUI-060: [GUI-060] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32me

- **Checklist IDs**: `GUI-060`
- **Yêu cầu liên quan**: `FR15-ISOLATE`
- **Căn cứ**: README
- **Severity / Priority**: S2 / P1

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-060
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

Locator: locator('tbody tr').filter({ hasText: 'Samsung Galaxy S24 Ultra' })
Expected substring: [32m"28000000"[39m
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-f39a4-d-does-not-modify-product-B-chrome-local/test-failed-1.png`

---

### BUG-GUI-061: [GUI-061] Error: Confirmation modal must appear before deleting product

[2mexpect([22m

- **Checklist IDs**: `GUI-061`
- **Yêu cầu liên quan**: `USR-DELETE-ADMIN`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-15)
2. Thực thi kiểm tra GUI-061
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Confirmation modal must appear before deleting product

[2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('dialog, [role="dialog"], .modal').filter({ hasText: /Xác nhận xóa|Cảnh báo/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr15-FR-15-Admin-Product-M-18c6b-ars-before-deleting-product-chrome-local/test-failed-1.png`

---

### BUG-GUI-066: [GUI-066] Error: Delete button must have descriptive aria-label

[2mexpect([22m[31mrece

- **Checklist IDs**: `GUI-066`
- **Yêu cầu liên quan**: `USR-A11Y-SR`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-066
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Delete button must have descriptive aria-label

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeTruthy[2m()[22m

Received: [31mnull[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-d6cf4-d-live-status-announcements-chrome-local/test-failed-1.png`

---

### BUG-GUI-067: [GUI-067] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[2

- **Checklist IDs**: `GUI-067`
- **Yêu cầu liên quan**: `USR-STATE-NET-ERR`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-067
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('button', { name: /Thử lại/i })
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" getByRole('button', { name: /Thử lại/i }) with timeout 3
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-c3e25-or-state-and-retry-recovery-chrome-local/test-failed-1.png`

---

### BUG-GUI-068: [GUI-068] Error: Quantity input required to test transient empty state

[2mexpect([22m[

- **Checklist IDs**: `GUI-068`
- **Yêu cầu liên quan**: `USR-QTY-VALID`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-07)
2. Thực thi kiểm tra GUI-068
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: Quantity input required to test transient empty state

[2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThan[2m([22m[32mexpected[39m[2m)[22m

Expected: > [32m0[39m
Received:   [31m0[39m
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr07-FR-07-Shopping-Cart-D-cb537-r-immediate-NaN-before-blur-chrome-local/test-failed-1.png`

---

### BUG-GUI-070: [GUI-070] Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexp

- **Checklist IDs**: `GUI-070`
- **Yêu cầu liên quan**: `USR-STATE-DEBOUNCE`
- **Căn cứ**: checklist-extension
- **Severity / Priority**: S3 / P2

**Các bước tái hiện**:
1. Mở trang liên quan (FR-05)
2. Thực thi kiểm tra GUI-070
3. Quan sát kết quả hiển thị trên Google Chrome

**Kết quả thực tế**:
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveCount[2m([22m[32mexpected[39m[2m)[22m failed

Locator:  locator('tbody tr').filter({ hasText: 'iPhone 15 Pro Max' })
Expected: [32m1[39m
Received: [31m3[39m
Timeout:  5000ms

Call log:
[2m  - Expect "toHaveCount" locator('tbody tr')
```

**Bằng chứng (Evidence)**:
- `/Users/thuytran/Workspace/eshop-sut/tests/gui/test-results/fr05-FR-05-Product-Catalog-64afc-prevent-duplicate-mutations-chrome-local/test-failed-1.png`

---

