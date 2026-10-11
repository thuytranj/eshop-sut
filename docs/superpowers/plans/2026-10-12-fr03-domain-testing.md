# FR-03 Domain Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Design and execute specification-based Domain Testing for FR-03's two-step password reset, producing reproducible cases, evidence, coverage, and defect reports while preserving the SUT.

**Architecture:** Derive predicates from the business specification before using implementation details. Test OTP issuance and reset acceptance independently through API fixtures, then test the customer web workflow through its rendered UI. Keep domain design, observations, and unresolved requirements distinct.

**Tech Stack:** Markdown, Node.js HTTP requests and SQLite fixtures, React/Vite customer web, Python Playwright with the webapp-testing skill.

**Spec:** `README.md:46-60` (FR-03), `README.md:34-35` (inherited FR-01 password rules), `api_specification.md:34-54` (interfaces), `docs/2026.HW02.Domain Testing_En.pdf` sections 6, 9, and 12 (method, AI evidence, commits).

## Global Constraints

- "For testing requests, preserve the SUT's behavior and report discrepancies."
- "Change application code to fix a bug only when the user requests a fix."
- "Do not expand a selected feature into testing the whole application."
- "Each case records ID, rule, preconditions, input/fixture, steps, expected result, actual result, status, and evidence."
- "Use `Not Run` for designed but unexecuted cases and `Blocked` for cases prevented by the environment."
- "Never infer pass/fail from generated cases."
- "Do not stage incidental test changes" to `backend/database.sqlite`.
- "Do not fabricate student review, audit entries, execution results, or demo links."
- "Use Asia/Ho_Chi_Minh for user-facing local times unless the user specifies another timezone."
- "Push, amend, rebase, squash, and other history rewrites require the user's request."

Scope: FR-03, customer web and API only. No application fixes, separate BVA report, native mobile testing, GitHub publication, PDF submission package, or other feature testing is included. Login may be used solely to verify a reset's effect. No requirement to make SUT tests pass: observed conformance failures are testing deliverables.

## Review Focus

These risks must receive explicit cases in the tasks below:

1. A token issued for account A is submitted for B: reject and preserve both passwords.
2. A valid password is rejected, or whitespace alone satisfies the special-character rule: exercise all seven specified characters and a space-only substitute.
3. Confirmation is missing or mismatched: inspect field presence and isolate equality failures in the UI; the documented API has no confirmation parameter.
4. Issued OTP length is wrong: inspect the actual issued string independently of reset success; synthetic fixtures must not be reported as generated OTPs.
5. A rejected reset mutates a password: compare isolated database state before/after every negative case, including multi-rule failures.

---

## File structure and interfaces

Create only these testing artifacts:

| File | Responsibility |
|---|---|
| `docs/testing/fr03/domain-model.md` | Sources, stable rule IDs, predicates, domains, ambiguity decisions |
| `docs/testing/fr03/domain-cases.md` | Fixtures, on/off/in reasoning, full case records, obligation matrix |
| `tests/fr03/run-domain-api.cjs` | Isolated API execution, fixture preparation, structured observations |
| `tests/fr03/run-domain-web.py` | Rendered UI execution, screenshots, browser/network observations |
| `docs/testing/fr03/evidence/` | Case-specific logs, screenshots, execution manifest |
| `docs/testing/fr03/domain-results.md` | Actual results and designed/executed coverage |
| `docs/testing/fr03/bugs.md` | Reproductions and evidence for observed failures |
| `docs/testing/fr03/ai-interactions.md` | Available prompts/outputs, timestamps, provenance and human-review limits |
| `docs/testing/fr03/commit-log.txt` | Actual chronological FR-03 commit history |

Read-only implementation references: `backend/server.js:68-101`, `backend/database.js`, `frontend-web/src/pages/ForgotPassword.jsx`, and `frontend-web/src/App.jsx`. Do not modify them.

Shared case record: `{id, layer, rules, obligations, preconditions, fixture, steps, expected, actual, status, evidence}`. `layer` is `API` or `WEB`; `status` is `Not Run`, `Blocked`, `Passed`, or `Failed`. Actual/evidence start as `Not observed`/`None`. API script interface: `node tests/fr03/run-domain-api.cjs --backend-dir <absolute isolated backend> --base-url http://localhost:3000 --out docs/testing/fr03/evidence/api`. Web script interface: `python tests/fr03/run-domain-web.py --base-url http://localhost:5173 --backend-dir <same isolated backend> --out docs/testing/fr03/evidence/web`. Each script emits JSON observations keyed by case ID; exit 0 means execution completed, not all cases passed. Exit 1 means harness failure; exit 2 means observed conformance failures with a complete result file.

## Task 1: Establish the FR-03 acceptance domains

**Files:** Create `docs/testing/fr03/domain-model.md` and `docs/testing/fr03/ai-interactions.md`.

**Interfaces:** Consumes the cited specifications; produces rules R01-R09, predicates, ambiguity register, and fixture conventions consumed by Tasks 2-4.

- [ ] **Step 1: Record the test basis and limitations.** Read the cited sources and seek supplied course lectures. None were found during planning. Until lectures are supplied, call the on/off/in method a working convention from `.agents/skills/domain-testing/SKILL.md`, not a verified classroom method. Keep the assignment's separate BVA requirement visible as outside this plan.
- [ ] **Step 2: Define traceable rules.** R01: requesting email is registered; R02: issuance produces a random six-digit OTP and demo displays it; R03: UI identifies the current step of two; R04: back-to-login navigation exists; R05: reset token matches the requesting email's issued token; R06: new password length is at least 8; R07: password contains at least one uppercase, lowercase, digit, and character from `@$!%*?&`; R08: UI provides confirmation matching the new password; R09: an accepted reset changes the targeted password, and a rejected reset preserves passwords.
- [ ] **Step 3: Define inputs and predicates.** Email/token/password/confirmation are strings; fixture account membership and issuance association are stored state. Use ASCII fixtures and one-character resolution; do not impose an invented password maximum. Define `E(email)` for registered membership, `F(token)` for six ASCII digits, `B(email,token)` for matching issued ownership, `L(p)=len(p)>=8`, and `U(p),D(p),N(p),S(p)` for the four required character classes. API reset acceptance is `E ∧ F ∧ B ∧ L ∧ U ∧ D ∧ N ∧ S`; UI adds `C(p,c)=(p=c)` and field presence. State explicitly that `F` follows the required OTP format; applying it to synthetic malformed stored tokens is an additional validation probe, not an issuance test. Write complements and separate numeric length boundaries, categorical partitions, and coupled string equality boundaries.
- [ ] **Step 4: Record ambiguities without resolving them from code.** The API omits confirmation; confirmation verdicts belong to the UI. OTP expiry, retry limits, reuse, replacement policy, leading-zero issuance, email normalization, Unicode length, and maximum password length are unspecified. Do not assert pass/fail for these policies. The listed special set is required for the selected fixtures, but acceptance of extra punctuation alongside a required character is unspecified. Repeated issuance supports shape observations, not proof of randomness. No rejection HTTP status or reset success response is specified; judge effects and acceptance rather than inventing status codes.
- [ ] **Step 5: Record available AI evidence.** Log actual tool/model information when known, local timestamps, the user prompts, this saved plan as an available output, later outputs, and actual corrections. Mark human review pending; do not reconstruct hidden conversation history.
- [ ] **Step 6: Verify and commit.** Check R01-R09 against their sources and the ambiguity register, then run `git diff --check`. Review unstaged/staged changes and commit only these files with `docs(fr03): define password reset acceptance domains`.

## Task 2: Derive points, cases, and explicit coverage obligations

**Files:** Create `docs/testing/fr03/domain-cases.md`; update model only if a documented correction is needed.

**Interfaces:** Consumes R01-R09; produces stable `FR03-DT-*` records and boundary/partition obligations for Tasks 3-4.

- [ ] **Step 1: Define the reference fixture.** Isolated accounts A=`fr03-a@example.com`, B=`fr03-b@example.com`, old password=`OldPass1!`, unlocked with `login_attempts=0`, `locked_until=NULL`. C=`fr03-missing@example.com` does not exist. For reset isolation, seed A's token `123456` and B's distinct token `654321` directly; label these contract fixtures. Default new password/confirmation=`Abcdef1!`. Reset state independently before each case. Issuance cases always use actual returned tokens.
- [ ] **Step 2: Select ordered and coupled boundary points.** Length points: `Abcde1!` (7, reject), `Abcdef1!` (8, accept), `Abcdefg1!` (9, accept), `Abcdefgh1!` (10, interior). Equality points: `(p,c)=(Abcdef1!,Abcdef1!)` and `(Zyxwvu2&,Zyxwvu2&)`; perturb confirmation by one substitution, one deletion, and one insertion while holding `p` strong. String equality has no signed numeric inside/outside; use equal-region and unequal-region neighbors, not fabricated geometric distances. OTP shape partitions: lengths 5/6/7 and nondigit at length 6. Format alone is insufficient: distinguish issued-match from well-shaped-but-unissued values.
- [ ] **Step 3: Instantiate the following stable case families.** Expand each parameter value into its own unique ID, with full preconditions, steps, expected result, and evidence fields; do not count parameterized rows as executed cases.

| IDs | Layer | Isolated inputs and expected behavior |
|---|---|---|
| `FR03-DT-ISS-01` | API | Request A; response 200, token string matches `^[0-9]{6}$`; associated with A; password unchanged |
| `FR03-DT-ISS-02` | API | Request absent C; no usable issued token and no password mutation; exact error copy/status unspecified |
| `FR03-DT-LEN-01..04` | API | Four password length points above, matching seeded token; reject 7, accept 8/9/10 |
| `FR03-DT-CLASS-01..04` | API | Passwords `abcdef1!`, `ABCDEF1!`, `Abcdefg!`, `Abcdef12` respectively omit uppercase/lowercase/digit/special; reject each |
| `FR03-DT-SPECIAL-01..07` | API | `Abcdef1` plus each of `@,$,!,%,*,?,&`; accept each |
| `FR03-DT-SPECIAL-08` | API | `Abcdef1 ` has only space as punctuation; reject |
| `FR03-DT-TOKEN-01..04` | API | Submit `12345`, `1234567`, `12345x`, `234567` with A and strong password; reject, preserving passwords; issued A token remains `123456` |
| `FR03-DT-BIND-01..02` | API | A token submitted for B and B token submitted for A; reject; both passwords unchanged |
| `FR03-DT-INT-01..02` | API | Valid minimum-length password plus matching confirmation at UI; crossed email token plus missing-special password at API. First interaction belongs to WEB-CONF-01; second gets its own ID; no duplicate counting |
| `FR03-DT-WEB-FLOW-01` | WEB | Step indicator identifies step 1 then 2; actual demo OTP displayed with six-digit shape |
| `FR03-DT-WEB-NAV-01` | WEB | Back-to-login control at initial step navigates to `/login` |
| `FR03-DT-WEB-CONF-01..05` | WEB | Two equal password pairs above accept; first pair with substituted `Abcdef2!`, deleted `Abcdef1`, inserted `Abcdef1!!` confirmation rejects |
| `FR03-DT-WEB-CONF-06` | WEB | Confirmation field exists and empty confirmation rejects; if field absent, record observed requirement failure |
| `FR03-DT-WEB-SPECIAL-01..08` | WEB | Repeat seven valid specials and space-only substitute; accept first seven, reject space-only |

For `INT-01`, use a coverage alias to WEB-CONF-01 rather than create an extra record; instantiate `INT-02` only. Do not multiply cases merely to inflate statistics.

- [ ] **Step 4: Specify state assertions and truth vectors.** For every case record all predicate values, including `N/A` for issuance-only predicates. Negative cases must leave A/B passwords unchanged. Positive resets must update only the target; verify login using the new password as supporting evidence, with lock counters reset before any credential checks. If issuance is nonconforming, keep end-to-end observations distinct from seeded-token isolation. Missing confirmation does not turn all mismatch cases into passes: fail the field-presence case and mark unperformable mismatch cases Blocked with that reason.
- [ ] **Step 5: Map obligations and review.** Map each R ID, four length points, four class omissions, eight special partitions, four token partitions, both ownership directions, two separated equality points and three equality perturbations, combined rejection, and UI navigation/step/display checks to concrete case IDs. Report designed coverage as mapped obligations/total listed obligations, and executed coverage as obligations with completed decisive observations/that same denominator. Account membership and character classes are unordered partitions, not numeric BVA. Explicitly exclude unspecified-policy probes from conformance denominators.
- [ ] **Step 6: Verify and commit.** Inspect every literal for its claimed length/classes and check that single-fault cases hold other rules valid. Confirm unique IDs and all records start Not Run, then `git diff --check`; commit with `test(fr03): design password reset domain cases`.

## Task 3: Execute API cases on an isolated backend

**Files:** Create `tests/fr03/run-domain-api.cjs`, API evidence and `docs/testing/fr03/domain-results.md`.

**Interfaces:** Consumes Task 2 case records; emits JSON observations and a manifest containing Git revision, dirty diff/build fingerprint, runtime versions, ports, fixture SQL, local timezone/time, interface, and case IDs.

- [ ] **Step 1: Prepare isolation.** Capture working database SHA-256 and Git status. Check port 3000 before starting anything; do not stop a pre-existing service. Create a temporary directory with `mktemp -d /tmp/eshop-fr03.XXXXXX` and copy `backend/` there with `cp -R`. Install dependencies in that copy with `npm ci` only if needed. Start `npm run dev` there, never in working `backend/`: database initialization drops/recreates tables on import. Wait for initialization to finish before fixture writes. If the required ports cannot be used safely, mark affected execution Blocked. Keep the temporary path in the manifest.
- [ ] **Step 2: Implement the API harness.** Use Node `fetch`, `node:assert/strict`, and the isolated backend's `sqlite3` dependency. Open only its `database.sqlite`. Refuse a backend-dir resolving to the working backend. Insert/reset A/B and remove C per case with parameterized SQL, await completed writes, execute actual endpoint bodies documented in the API spec, and capture request/response and before/after state. Never import `database.js` in the harness. Use assertions from the case oracle, not the implemented validation. Continue after conformance failures and preserve every observation.
- [ ] **Step 3: Verify the harness.** Against the isolated server, run one issued-token case, one seeded valid reset, and one incorrect-token reset. Inspect raw state and ensure the harness distinguishes nonconformance from harness errors. Generated tokens must satisfy issuance assertions even if reset still accepts them. Do not use backend `npm test`, which is a failing placeholder.
- [ ] **Step 4: Execute all API cases.** Run the API command from the shared interface. Preserve logs and map each result to its case ID; do not treat process exit alone as a verdict. Record actual behavior, failed predicate/state assertions, counts, and evidence paths. Do not call a static code suspicion an executed failure.
- [ ] **Step 5: Verify and commit.** Confirm result IDs reconcile with API case records, evidence files exist, and working database SHA-256 is unchanged. Inspect the report and `git diff --check`; commit with `test(fr03): record API domain execution evidence`.

## Task 4: Execute the two-step customer web cases

**Files:** Create `tests/fr03/run-domain-web.py`, web evidence; update `domain-results.md`.

**Interfaces:** Consumes Task 2 WEB cases and the same isolated backend; emits per-case screenshots, browser/network logs and observations. API results cannot stand in for WEB results.

- [ ] **Step 1: Prepare the browser environment.** Use webapp-testing; inspect its server helper with `--help` before invocation if needed. Run `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` in `frontend-web/` only when port 5173 is free, paired with the isolated backend on 3000. Record browser/runtime versions and any installation/environment blockers. Customer web hardcodes localhost:3000; do not edit it to bypass an occupied port.
- [ ] **Step 2: Implement rendered-UI execution.** Launch headless Chromium via Python Playwright, navigate to `/forgot-password`, wait for network idle, then inspect DOM and choose stable selectors. Reset the isolated fixture and page state per case. Capture dialogs, submissions and relevant requests/responses; take full-page screenshots on failures. Do not inject a missing confirmation field or alter UI validation.
- [ ] **Step 3: Execute WEB cases.** Test actual issuance for flow/display. For reset isolation, enter step 2 through the real UI, then replace only isolated stored token state with the documented six-digit fixture and enter that token. Label this setup as synthetic. Run both equality points, mismatch/empty confirmation, specials, and navigation checks independently where possible. A screenshot of source code is not runtime UI evidence.
- [ ] **Step 4: Reconcile verdicts and coverage.** Distinguish absent controls (observed requirement failures) from dependent actions impossible to execute (Blocked). Record submitted password effects in SQLite; verify successful updates with targeted login if useful. Report unique designed/executed/passed/failed/Not Run/Blocked counts, with executed=Passed+Failed and not-yet-executed=Not Run+Blocked. Reconcile each layer separately and together.
- [ ] **Step 5: Verify and commit.** Inspect screenshots/logs and coverage links; verify working database unchanged and `git diff --check`; commit with `test(fr03): record web password reset domain results`.

## Task 5: Document observed defects and close the feature report

**Files:** Create `docs/testing/fr03/bugs.md` and `commit-log.txt`; update results and AI interactions.

**Interfaces:** Consumes actual evidence from Tasks 3-4; produces the reviewed feature report and actual history, without external publication.

- [ ] **Step 1: Write reproducible defects.** Group failures by distinct observed behavior, link affected R/case IDs, environment/fixture, exact reproduction, expected/actual effects, logs and screenshots. Code inspection suggests OTP shape, password validation, and missing UI controls merit attention; confirm through execution before classifying them as observed failures. API-only defects may use response/state logs; do not fabricate screenshots.
- [ ] **Step 2: Finish limitations and AI evidence.** Document coverage gaps, infeasible combinations, sampling limits, unspecified policies and actual human corrections if supplied. Keep student review pending until it happens. This one feature plan does not claim the four-feature assignment is complete or group allocation is unique.
- [ ] **Step 3: Verify and commit.** Check case/result counts, source references, evidence paths, and `git diff --check`; commit with `docs(fr03): document observed password reset defects`. If no defects are observed, use `docs(fr03): summarize password reset domain coverage`.
- [ ] **Step 4: Export actual history.** Write `git log --date=iso-strict --format='%h %ad %s' -- docs/testing/fr03 tests/fr03 docs/superpowers/plans/2026-10-12-fr03-domain-testing.md` to `commit-log.txt`. Explain that an export can only contain commits preceding its own snapshot commit. Verify its contents and commit with `docs(fr03): export domain testing commit history`. Do not invent earlier testing steps.

## Planning self-review and handoff

Reviewed: R01-R09 map to Tasks 1-4; all five Review Focus risks have cases and state assertions; case interfaces match execution outputs; ambiguity probes are excluded from conformance claims. This is a testing plan, so the generic implementation red/green cycle becomes oracle design, harness verification, observation and discrepancy reporting. Fixing SUT failures requires a separate user request.

Planning provenance: Codex, model identifier unavailable; 2026-10-12 00:26:11 Asia/Ho_Chi_Minh. User requested the writing-plans skill for “domain testing for FR-03: Forgot password and password reset (two steps)”. Sources were read; no backend/browser execution occurred during planning. Lecture materials were not found; the assignment PDF was text-extracted for its requirements. This note is available planning evidence, not a complete AI audit or student review.

Recommended execution: Native, because this single-feature sequence shares fixtures, case IDs and evidence across dependent tasks. Review the plan and choose Native or Subagent-driven before execution, as required by the invoked writing-plans skill.
