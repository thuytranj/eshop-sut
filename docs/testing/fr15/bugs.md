# FR-15 — Observed bug reports

Final evidence: fr15-run02 only. Five rule-based reports, including one FR12 product-write dependency. No SUT patches, GitHub Issues or fabricated screenshots. Multiple failing cases may map to one report. This grouping does not prove one code root cause across UI and API.

## FR15-BUG-001 — Name required/255-character limit is not enforced across product writes

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R05; README.md:195.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-075` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Use API missing/null/empty name or 256/257 ASCII chars with valid price/category/admin. UI accepts >255 chars.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject invalid name, show suitable feedback and leave products unchanged.
**Actual (representative FR15-TC-075):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-002, FR15-TC-007, FR15-TC-013, FR15-TC-019, FR15-TC-020, FR15-TC-025, FR15-TC-026, FR15-TC-036, FR15-TC-041, FR15-TC-047, FR15-TC-053, FR15-TC-054, FR15-TC-059, FR15-TC-060, FR15-TC-075, FR15-TC-081, FR15-TC-088, FR15-TC-098, FR15-TC-104, FR15-TC-111, FR15-TC-151, FR15-TC-153, FR15-TC-155, FR15-TC-157.

**Evidence:**
- [FR15-TC-075_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-075_immediate.png)
- [FR15-TC-075_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-075_reload.png)
- [FR15-TC-075.json](evidence/fr15-run02/web/FR15-TC-075.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-002 — Required positive numeric price is not enforced

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R06; README.md:196.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-076` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Use API omitted/null/empty/non-numeric/negative/zero price, or UI blank/negative/zero, with valid name/category/admin.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject invalid price; no persisted product mutation.
**Actual (representative FR15-TC-076):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-008, FR15-TC-009, FR15-TC-014, FR15-TC-015, FR15-TC-017, FR15-TC-018, FR15-TC-020, FR15-TC-022, FR15-TC-024, FR15-TC-027, FR15-TC-028, FR15-TC-042, FR15-TC-043, FR15-TC-048, FR15-TC-049, FR15-TC-051, FR15-TC-052, FR15-TC-054, FR15-TC-056, FR15-TC-058, FR15-TC-061, FR15-TC-062, FR15-TC-076, FR15-TC-077, FR15-TC-082, FR15-TC-083, FR15-TC-085, FR15-TC-086, FR15-TC-088, FR15-TC-090, FR15-TC-099, FR15-TC-100, FR15-TC-105, FR15-TC-106, FR15-TC-108, FR15-TC-109, FR15-TC-111, FR15-TC-113.

**Evidence:**
- [FR15-TC-076_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-076_immediate.png)
- [FR15-TC-076_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-076_reload.png)
- [FR15-TC-076.json](evidence/fr15-run02/web/FR15-TC-076.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-003 — Product may reference a missing category or omit category

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R07; README.md:197.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `empty-categories`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-146` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. API category_id=15 or missing/null/empty. UI use empty-categories fixture and submit valid name/price without any category option.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Only an existing category can be saved; empty-category list prevents creation.
**Actual (representative FR15-TC-146):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled', 'ui-immediate-correct', 'ui-reload-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 1}}; products 0 → 1.

**Affected canonical cases:** FR15-TC-023, FR15-TC-029, FR15-TC-030, FR15-TC-031, FR15-TC-057, FR15-TC-063, FR15-TC-064, FR15-TC-065, FR15-TC-146, FR15-TC-147.

**Evidence:**
- [FR15-TC-146_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-146_immediate.png)
- [FR15-TC-146_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-146_reload.png)
- [FR15-TC-146.json](evidence/fr15-run02/web/FR15-TC-146.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-004 — Saving one product changes non-target names in immediate Admin UI

**Severity:** Major. Specified product data or management feedback is incorrect.
**Rule/oracle:** FR15-R08; README.md:198.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `admin`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-092` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. Baseline A/B/C. Open Sửa on A or B; submit valid body. Inspect table before reload, compare API/DB, then reload.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Only target changes. Non-target rendered names stay original both immediately and after reload.
**Actual (representative FR15-TC-092):** status Failed; assertions ['ui-immediate-correct']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product updated'}}; products 3 → 3.

Persisted DB and API readback match the requested target update; immediate table renames non-targets. Reload restores their original names. This is observed UI drift, not a claim that all DB rows were updated.

**Affected canonical cases:** FR15-TC-092, FR15-TC-094, FR15-TC-095, FR15-TC-096, FR15-TC-097, FR15-TC-101, FR15-TC-102, FR15-TC-103, FR15-TC-107, FR15-TC-112, FR15-TC-131, FR15-TC-132, FR15-TC-133, FR15-TC-134, FR15-TC-135, FR15-TC-136, FR15-TC-158.

**Evidence:**
- [FR15-TC-092_immediate.png](evidence/fr15-run02/web/screenshots/FR15-TC-092_immediate.png)
- [FR15-TC-092_reload.png](evidence/fr15-run02/web/screenshots/FR15-TC-092_reload.png)
- [FR15-TC-092.json](evidence/fr15-run02/web/FR15-TC-092.json)

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.

## FR15-BUG-005 — [Dependency FR12] Product writes accept absent/invalid/non-admin token

**Severity:** High. Unauthorized product data writes are possible.
**Rule/oracle:** FR12-DEP-WRITE; README.md:177–179.
**Environment:** API http://localhost:3000; Admin http://127.0.0.1:5174; Node v22.17.1; browser metadata in evidence/fr15-run02/web/browser.json; Asia/Ho_Chi_Minh; source commit `65d30b154176da7cec7e133b9c9ee792d1831925` plus manifest harness hashes.
**Preconditions:** isolated backend prepared by run-all; reset `baseline`; target `101`; auth `none`.

**Reproduction:**
1. Start a new isolated run with `node tests/fr15/run-all.cjs --suite tests/fr15/suite.json --root /private/tmp/eshop-fr15-newrun --out docs/testing/fr15/evidence/fr15-newrun --run-id fr15-newrun` (both paths must be new).
2. Reproduce representative `FR15-TC-137` using its complete payload/preconditions/steps in tests/fr15/suite.json and the raw request linked below. POST/PUT/DELETE product with no token, invalid token or valid user JWT; retain otherwise valid body and existing target.
3. Compare all product fields before/after; for WEB compare immediate table before reload and table after reload.

**Expected:** Reject unauthorized mutation and preserve all products. No exact HTTP error status mandated by supplied spec.
**Actual (representative FR15-TC-137):** status Failed; assertions ['rejected-state-unchanged', 'rejection-signaled']; HTTP/body {'statusCode': 200, 'body': {'message': 'Product created', 'id': 304}}; products 3 → 4.

**Affected canonical cases:** FR15-TC-137, FR15-TC-138, FR15-TC-139, FR15-TC-140, FR15-TC-141, FR15-TC-142, FR15-TC-143, FR15-TC-144, FR15-TC-145.

**Evidence:**
- [FR15-TC-137.json](evidence/fr15-run02/api/FR15-TC-137.json)

API request/response/state are the available evidence. No UI screenshot of an API-only authorization test is fabricated; capture a real API-client screen before an authorized GitHub publication if required.

**Disposition:** observed; not fixed. Publishing to group GitHub Issues awaits explicit authorization.
