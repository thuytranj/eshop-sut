# FR-03 Domain Testing and BVA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Domain Testing and BVA step by step to FR-03, review and deduplicate their cases into one suite, execute every case, record results/bugs, and analyze evidenced AI gaps while preserving the SUT.

**Architecture:** Follow seven sequential stages: requirement analysis → Domain Testing design → BVA design → review/deduplication/technique mapping → full-suite execution → actual results/verdicts/bugs → AI gap analysis. Preserve the derivation for each technique, then execute canonical cases once per interface with isolated fixtures. Separate design obligations, raw observations, conformance verdicts, and learner review.

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

Scope: FR-03, customer web and API only. Deliverables include separate stepwise Domain Testing and BVA reports plus a reviewed combined suite. Application fixes, native mobile testing, GitHub publication, PDF submission packaging, and other feature testing are outside scope. Login may be used solely to verify a reset's effect. No requirement to make SUT tests pass: observed conformance failures are testing deliverables.

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
| `docs/testing/fr03/requirements.md` | Sources, stable rule IDs, interfaces, ambiguities, fixture conventions |
| `docs/testing/fr03/domain-model.md` | Stepwise Domain Testing reasoning, predicates, regions, points |
| `docs/testing/fr03/domain-cases.md` | Fixtures, on/off/in reasoning, full case records, obligation matrix |
| `docs/testing/fr03/bva-report.md` | Stepwise BVA derivation, partitions, endpoints, neighbors, cases |
| `docs/testing/fr03/suite-review.md` | Review corrections, duplicate decisions, technique/obligation mapping |
| `tests/fr03/suite.json` | Canonical executable cases from both techniques |
| `tests/fr03/run-domain-api.cjs` | Isolated API execution, fixture preparation, structured observations |
| `tests/fr03/run-domain-web.py` | Rendered UI execution, screenshots, browser/network observations |
| `docs/testing/fr03/evidence/` | Case-specific logs, screenshots, execution manifest |
| `docs/testing/fr03/test-results.md` | Actual results, verdicts, statistics, coverage for both techniques |
| `docs/testing/fr03/ai-gap-analysis.md` | Evidenced AI omissions, causes, corrections and limits |
| `docs/testing/fr03/bugs.md` | Reproductions and evidence for observed failures |
| `docs/testing/fr03/ai-interactions.md` | Available prompts/outputs, timestamps, provenance and human-review limits |
| `docs/testing/fr03/commit-log.txt` | Actual chronological FR-03 commit history |

Read-only implementation references: `backend/server.js:68-101`, `backend/database.js`, `frontend-web/src/pages/ForgotPassword.jsx`, and `frontend-web/src/App.jsx`. Do not modify them.

Shared canonical case record: `{id, sourceCaseIds, techniques, layer, rules, obligations, preconditions, fixture, steps, expected, actual, status, evidence}`. `techniques` contains `Domain Testing`, `BVA`, or both; obligations retain technique, dimension, point/boundary ID, and layer. Source IDs use `FR03-DT-*` / `FR03-BVA-*`; canonical IDs use `FR03-TC-001` onward. `layer` is `API` or `WEB`; `status` is `Not Run`, `Blocked`, `Passed`, or `Failed`. Actual/evidence start as `Not observed`/`None`. API script interface: `node tests/fr03/run-domain-api.cjs --backend-dir <absolute isolated backend> --base-url http://localhost:3000 --out docs/testing/fr03/evidence/api`. Web script interface: `python tests/fr03/run-domain-web.py --base-url http://localhost:5173 --backend-dir <same isolated backend> --out docs/testing/fr03/evidence/web`. Each script emits JSON observations keyed by case ID; exit 0 means execution completed, not all cases passed. Exit 1 means harness failure; exit 2 means observed conformance failures with a complete result file.

## Task 1: Phân tích requirement

**Files:** Create `docs/testing/fr03/requirements.md` and `docs/testing/fr03/ai-interactions.md`.

**Interfaces:** Consumes the cited specifications; produces rules R01-R09, predicates, ambiguity register, and fixture conventions consumed by Tasks 2-7.

- [ ] **Step 1: Record the test basis and limitations.** Read the cited sources and seek supplied course lectures. None were found during planning. Until lectures are supplied, call the on/off/in method a working convention from `.agents/skills/domain-testing/SKILL.md`, not a verified classroom method. Use `.agents/skills/boundary-value-analysis/SKILL.md` and its method reference for BVA. Unless lectures specify otherwise, disclose ISTQB 3-value BVA as a working default. Both technique reports must explain the transformation from requirements to cases, not just present final tables.
- [ ] **Step 2: Define traceable rules.** R01: requesting email is registered; R02: issuance produces a random six-digit OTP and demo displays it; R03: UI identifies the current step of two; R04: back-to-login navigation exists; R05: reset token matches the requesting email's issued token; R06: new password length is at least 8; R07: password contains at least one uppercase, lowercase, digit, and character from `@$!%*?&`; R08: UI provides confirmation matching the new password; R09: an accepted reset changes the targeted password, and a rejected reset preserves passwords.
- [ ] **Step 3: Define inputs and predicates.** Email/token/password/confirmation are strings; fixture account membership and issuance association are stored state. Use ASCII fixtures and one-character resolution; do not impose an invented password maximum. Define `E(email)` for registered membership, `F(token)` for six ASCII digits, `B(email,token)` for matching issued ownership, `L(p)=len(p)>=8`, and `U(p),D(p),N(p),S(p)` for the four required character classes. API reset acceptance is `E ∧ F ∧ B ∧ L ∧ U ∧ D ∧ N ∧ S`; UI adds `C(p,c)=(p=c)` and field presence. State explicitly that `F` follows the required OTP format; applying it to synthetic malformed stored tokens is an additional validation probe, not an issuance test. Write complements and separate numeric length boundaries, categorical partitions, and coupled string equality boundaries.
- [ ] **Step 4: Record ambiguities without resolving them from code.** The API omits confirmation; confirmation verdicts belong to the UI. OTP expiry, retry limits, reuse, replacement policy, leading-zero issuance, email normalization, Unicode length, and maximum password length are unspecified. Do not assert pass/fail for these policies. The listed special set is required for the selected fixtures, but acceptance of extra punctuation alongside a required character is unspecified. Repeated issuance supports shape observations, not proof of randomness. No rejection HTTP status or reset success response is specified; judge effects and acceptance rather than inventing status codes.
- [ ] **Step 5: Start an ongoing AI evidence log.** Log actual tool/model information when known, local timestamps, the user prompts, this saved plan as an available output, later outputs, and actual corrections. Distinguish assistant review from learner review; record actual user corrections as feedback, but do not infer approval of future reports. Do not reconstruct hidden conversation history. AI logging starts here and continues through every stage; AI gap analysis is performed at Task 7.
- [ ] **Step 6: Verify and commit.** Check R01-R09 against their sources and the ambiguity register, then run `git diff --check`. Review unstaged/staged changes and commit only these files with `docs(fr03): analyze password reset requirements`.

## Task 2: Sinh test case Domain Testing

**Files:** Create `docs/testing/fr03/domain-model.md` and `docs/testing/fr03/domain-cases.md`.

**Interfaces:** Consumes R01-R09; produces stepwise Domain Testing reasoning, stable `FR03-DT-*` records and explicit obligations for Task 4.

- [ ] **Step 1: Define the reference fixture.** Isolated accounts A=`fr03-a@example.com`, B=`fr03-b@example.com`, old password=`OldPass1!`, unlocked with `login_attempts=0`, `locked_until=NULL`. C=`fr03-missing@example.com` does not exist. For reset isolation, seed A's token `123456` and B's distinct token `654321` directly; label these contract fixtures. Default new password/confirmation=`Abcdef1!`. Reset state independently before each case. Issuance cases always use actual returned tokens.
- [ ] **Step 2: Explain the domain derivation before selecting points.** Translate each requirement into predicates with exact operators; express the acceptance region and its complement. Explain each partition, feasible/infeasible combination, equality surface, and reference interior. For every chosen point record coordinates, resolution, predicate truth vector, expected result, and rationale. Then select ordered and coupled boundary points: Length points: `Abcde1!` (7, reject), `Abcdef1!` (8, accept), `Abcdefg1!` (9, accept), `Abcdefgh1!` (10, interior). Equality points: `(p,c)=(Abcdef1!,Abcdef1!)` and `(Zyxwvu2&,Zyxwvu2&)`; perturb confirmation by one substitution, one deletion, and one insertion while holding `p` strong. String equality has no signed numeric inside/outside; use equal-region and unequal-region neighbors, not fabricated geometric distances. OTP shape partitions: lengths 5/6/7 and nondigit at length 6. Format alone is insufficient: distinguish issued-match from well-shaped-but-unissued values.
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
| `FR03-DT-INT-02` | API | Crossed email token plus missing-special password; reject and preserve both passwords; label this a multi-rule interaction |
| `FR03-DT-WEB-FLOW-01` | WEB | Step indicator identifies step 1 then 2; actual demo OTP displayed with six-digit shape |
| `FR03-DT-WEB-NAV-01` | WEB | Back-to-login control at initial step navigates to `/login` |
| `FR03-DT-WEB-CONF-01..05` | WEB | Two equal password pairs above accept; first pair with substituted `Abcdef2!`, deleted `Abcdef1`, inserted `Abcdef1!!` confirmation rejects |
| `FR03-DT-WEB-CONF-06` | WEB | Confirmation field exists and empty confirmation rejects; if field absent, record observed requirement failure |
| `FR03-DT-WEB-SPECIAL-01..08` | WEB | Repeat seven valid specials and space-only substitute; accept first seven, reject space-only |

The minimum-length/matching-confirmation intersection maps to WEB-CONF-01 as an obligation, not an additional case. Explain why two separated equality points and their perturbations are sampled, and which changes they can detect. Disclose finite sampling limits; do not multiply cases to inflate statistics.

- [ ] **Step 4: Specify state assertions and truth vectors.** For every case record all predicate values, including `N/A` for issuance-only predicates. Negative cases must leave A/B passwords unchanged. Positive resets must update only the target; verify login using the new password as supporting evidence, with lock counters reset before any credential checks. If issuance is nonconforming, keep end-to-end observations distinct from seeded-token isolation. Missing confirmation does not turn all mismatch cases into passes: fail the field-presence case and mark unperformable mismatch cases Blocked with that reason.
- [ ] **Step 5: Map obligations and review.** Map each R ID, four length points, four class omissions, eight special partitions, four token partitions, both ownership directions, two separated equality points and three equality perturbations, combined rejection, and UI navigation/step/display checks to concrete case IDs. Report designed coverage as mapped obligations/total listed obligations, and executed coverage as obligations with completed decisive observations/that same denominator. Account membership and character identities are unordered partitions; Task 3 separately uses the ordered count within each required character class for BVA. Explicitly exclude unspecified-policy probes from conformance denominators.
- [ ] **Step 6: Verify and commit.** Inspect every literal for its claimed length/classes and check that single-fault cases hold other rules valid. Confirm unique IDs and all records start Not Run, then `git diff --check`; commit with `test(fr03): design password reset domain cases`.

## Task 3: Sinh test case BVA

**Files:** Create `docs/testing/fr03/bva-report.md`.

**Interfaces:** Consumes Task 1 requirements, independently derives `FR03-BVA-*` cases and endpoint-to-value obligations; Task 4 compares these with the Domain Testing set.

- [ ] **Step 1: Explain method and dimensions.** State the selected variant and source, admissible universe, unit, precision and assumptions. Use nonnegative integer ASCII lengths/counts with step 1. Ordered dimensions are password length, counts of uppercase/lowercase/digit/required-special characters, and OTP string length. Email membership, token ownership and confirmation equality are categorical/coupled predicates addressed by Domain Testing, not numeric BVA. Do not invent expiry or maximum-password boundaries.
- [ ] **Step 2: Derive partitions and every finite endpoint.** Password length partitions `[0,7]` invalid and `[8,∞)` valid have endpoints `0,7,8`. Each required character count partitions `{0}` invalid and `[1,∞)` valid have endpoints `0,1`. OTP length partitions `[0,5]` invalid, `{6}` format-valid and `[7,∞)` invalid have endpoints `0,5,6,7`. These OTP partitions describe shape; length 6 does not establish correct ownership or issuance.
- [ ] **Step 3: Show predecessor/endpoint/successor derivations.** Password endpoint neighborhoods: `0→{0,1}`, `7→{6,7,8}`, `8→{7,8,9}`; union `{0,1,6,7,8,9}`. Each character-count dimension: `0→{0,1}`, `1→{0,1,2}`; union `{0,1,2}`. OTP neighborhoods: `0→{0,1}`, `5→{4,5,6}`, `6→{5,6,7}`, `7→{6,7,8}`; union `{0,1,4,5,6,7,8}`. Omit infeasible negative lengths/counts and retain all endpoint-to-value mappings after deduplication. Explain why 7/8/9 alone is not this full 3-value convention.
- [ ] **Step 4: Construct verified fixtures and expected outcomes.** Password length fixtures for `0,1,6,7,8,9` are `""`, `A`, `Abcd1!`, `Abcde1!`, `Abcdef1!`, `Abcdefg1!`. Zero/one cannot satisfy all character rules: explicitly label masking/multiple failures rather than claim isolated length validation. For class counts use length-8 fixtures, with other classes present: uppercase `abcdef1! / Abcdef1! / ABcdef1!`; lowercase `ABCDEF1! / aBCDEF1! / abCDEF1!`; digits `Abcdefg! / Abcdef1! / Abcde12!`; specials `Abcdef12 / Abcdef1! / Abcde1!&`. Count 0 rejects and 1/2 accept. OTP fixtures are `""`, `1`, `1234`, `12345`, `123456`, `1234567`, `12345678`, with stored A token `123456`. Only the six-digit matching fixture accepts with a strong password. Other OTP lengths also fail ownership matching; disclose that rejection alone cannot prove an independent format check. Do not seed malformed issued tokens to manufacture that isolation.
- [ ] **Step 5: Produce cases and traceability with derivation prose.** Use IDs `FR03-BVA-LEN-01..06`, `FR03-BVA-UPPER-01..03`, `FR03-BVA-LOWER-01..03`, `FR03-BVA-DIGIT-01..03`, `FR03-BVA-SPECIAL-01..03`, `FR03-BVA-OTP-01..07`, with an API/WEB suffix for distinct interfaces. Record full case fields and map each endpoint/value to cases. The identified value obligations are 6 length + 12 character-count + 7 OTP = 25 per planned interface; distinguish sampled values from decisive evidence about isolated predicates. Include WEB cases where controls permit them and retain Blocked verdicts later if they cannot run. Keep malformed/nondigit tokens supplementary to BVA rather than increasing its denominator.
- [ ] **Step 6: Verify and commit.** Check lengths/counts, neighborhoods, unions, source references, and Not Run statuses. Run `git diff --check`, review staged changes, and commit with `test(fr03): derive password reset BVA cases`.

## Task 4: Review + deduplicate + liên kết test case với technique

**Files:** Create `docs/testing/fr03/suite-review.md` and `tests/fr03/suite.json`; correct design reports only with documented reasons.

**Interfaces:** Consumes both source case sets and obligations; produces one reviewed canonical suite consumed by Tasks 5-7.

- [ ] **Step 1: Review both derivations against requirements.** Check rule coverage, partition complements, strict/inclusive operators, length/count literals, truth vectors, expected effects, missing controls, feasibility, masking and unspecified-policy exclusions. Retain a correction ledger with before/after, rationale and reviewer identity. Assistant self-review must not be presented as student review.
- [ ] **Step 2: Deduplicate by complete executable scenario.** Treat cases as duplicates only when interface, initial state, fixture, steps, and expected assertions agree. Assign one canonical ID, retain every `sourceCaseIds` alias, and union technique/obligation mappings. Same numeric value is insufficient if ownership, confirmation, expected assertions or layer differs. For example, matching `Abcdef1!` API fixtures from DT length/special and BVA length/counts may merge after comparing all fields; API and WEB must remain separate.
- [ ] **Step 3: Link techniques and reconcile coverage.** Every canonical case has one or both technique tags and explicit obligation IDs. Every source case/obligation maps to a canonical case or documented exclusion. Shared execution may cover obligations in both techniques, but overall statistics count that canonical case once. Report Domain Testing and BVA designed/executed coverage independently with denominators and masking limits; do not sum their case counts as the suite total.
- [ ] **Step 4: Freeze the reviewed suite before execution.** Validate unique canonical IDs, alias mappings, required case fields, no orphan obligations, and initial Not Run statuses. Record suite revision/hash. If later review adds or changes cases, version the suite and execute those cases before calling full-suite execution complete. Commit with `test(fr03): review and deduplicate technique test suite`.

## Task 5: Execute toàn bộ test suite

**Files:** Create `tests/fr03/run-domain-api.cjs`, `tests/fr03/run-domain-web.py`, and raw API/WEB evidence under `docs/testing/fr03/evidence/`. The historical runner names remain, but both consume the combined `suite.json`.

**Interfaces:** Consumes Task 4's frozen canonical suite; emits raw per-case observations for Task 6, including case/suite IDs, timestamps, request/response, UI actions, dialogs, screenshots and state snapshots. Capture observations during execution; Task 6 reconciles and publishes verdicts.

- [ ] **Step 1: Prepare safe isolation and manifest.** Capture working database SHA-256 and Git status. Check ports 3000/5173; do not stop unrelated services. Create an isolated directory with `mktemp -d /tmp/eshop-fr03.XXXXXX`, copy `backend/` there with `cp -R`, install dependencies there with `npm ci` if needed, and start `npm run dev` only in the copy. Initialization drops/recreates tables; wait for completion before writing fixtures. Record revision, dirty diff/build fingerprint, suite hash, runtime/browser versions, paths, ports, SQL, interface, clock and Asia/Ho_Chi_Minh timezone. Mark environmental blockers explicitly.
- [ ] **Step 2: Implement and verify the API harness.** Use Node `fetch`, `node:assert/strict`, and the copied backend's `sqlite3`. Refuse the working backend path; open only the copied database, never import `database.js`. Reset A/B/C and counters per canonical case with awaited parameterized SQL. Compare responses and both passwords before/after. Verify one actual issuance, one seeded valid reset and one incorrect-token rejection against raw state. Preserve nonconformance observations and continue; backend `npm test` is a failing placeholder, not the suite command.
- [ ] **Step 3: Implement and verify the WEB harness.** Use webapp-testing and inspect its server helper with `--help` if used. Start `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` in `frontend-web/` when safe. Use headless Chromium, `/forgot-password`, network-idle wait, rendered-DOM reconnaissance, then stable selectors. Capture dialogs, network and screenshots; never inject missing fields or edit validation. Verify one navigation and one reset observation, including database state.
- [ ] **Step 4: Execute every canonical API and WEB case.** Run the commands in the shared interface against the isolated environment. Run actual issuance for flow/display; for reset isolation, transition through the real UI and then seed only isolated stored state with the documented six-digit token. Label synthetic setup. Execute positive, negative, boundary and interaction cases from both techniques. Do not stop after the first failed case, silently skip BVA-only cases, or treat API evidence as WEB execution. Missing controls prevent dependent actions: capture why rather than fabricate submissions.
- [ ] **Step 5: Check execution completeness and commit evidence.** Reconcile all suite IDs to raw observations or explicit Blocked/Not Run reasons; rerun only missing/invalid observations as needed. Verify evidence paths and the unchanged working-database hash, then `git diff --check`. Commit with `test(fr03): execute combined domain and BVA suite`. Preserve all attempts and identify the final selected run per case; repeated executions do not increase unique-case counts.

## Task 6: Ghi actual result / pass-fail / bug

**Files:** Create `docs/testing/fr03/test-results.md` and `docs/testing/fr03/bugs.md`; update technique reports with coverage links.

**Interfaces:** Consumes Task 5 observations and Task 4 mappings; produces evidence-backed actual results, verdicts, bug records and statistics for Task 7.

- [ ] **Step 1: Record actual results and verdicts per canonical case.** Compare observations with the pre-execution oracle, record actual effects and link raw evidence. Use Passed/Failed only for executed cases; Blocked for prevented actions and Not Run for unexecuted ones. Missing confirmation field is an observed requirement failure; unperformable confirmation mismatch cases are Blocked. Do not change the expected behavior to match code. Document requirement ambiguities separately from failures.
- [ ] **Step 2: Document distinct observed bugs.** Include rule/case IDs, environment, exact fixture/steps, expected/actual results and screenshots/logs. Separate suspected defects from reproduced failures, group common causes only when evidence supports them, and retain every affected case. API-only bugs can use response/state logs; never fabricate screenshots or publish issues without authorization.
- [ ] **Step 3: Reconcile statistics and technique coverage.** Unique designed = Passed + Failed + Blocked + Not Run; executed = Passed + Failed; not-yet-executed = Blocked + Not Run. Report interface counts and distinct bugs. For each technique show designed obligations/identified obligations, exercised values/obligations, and unresolved or masked predicates. Shared cases count once in total statistics while supporting both mappings. Finite observations do not establish exhaustive correctness or OTP randomness.
- [ ] **Step 4: Verify and commit.** Check every verdict/evidence link, result count, bug reproduction and coverage mapping; run `git diff --check`. Commit with `docs(fr03): record combined test results and defects`.

## Task 7: AI gap analysis

**Files:** Create `docs/testing/fr03/ai-gap-analysis.md` and `commit-log.txt`; update `ai-interactions.md` and technique reports for evidenced corrections.

**Interfaces:** Consumes original generated cases, review ledger, user feedback and actual execution/bugs; produces a traceable gap analysis, not speculative claims about unseen AI output.

- [ ] **Step 1: Compare original AI output with review and execution.** Identify omitted cases, incomplete technique derivations, wrong expectations, missed observed bugs and duplicate-count risks. Each finding links the original output, discovery evidence, affected requirement/technique, correction and current status. If no gap is evidenced, say so; do not fabricate an omission or student correction.
- [ ] **Step 2: Analyze evidenced causes and limits.** Distinguish observed facts from hypotheses about prompt scope, missing lectures, tool limits or multi-variable complexity. Include the actual user correction in this conversation: the original plan excluded BVA and lacked a separate cross-technique review stage; the revised plan adds both and requires stepwise explanation. This is a planning omission, not proof that any executed bug was missed.
- [ ] **Step 3: Close gaps without inventing execution.** Add new cases through the Task 4 mapping/version process, execute them using Task 5, and reconcile Task 6 results. Record unresolved blockers. Keep available AI interactions and real learner feedback distinct; future student review remains pending until provided. A feature-level analysis does not complete the four-feature assignment or establish group uniqueness. Any requested 200–300-word AI Critique must use this evidence; final Markdown/PDF assignment packaging remains separate.
- [ ] **Step 4: Verify and commit analysis.** Check original-output and evidence links, cause labels, correction status and audit limitations, then `git diff --check`; commit with `docs(fr03): analyze evidenced AI testing gaps`.
- [ ] **Step 5: Export actual history.** Write `git log --date=iso-strict --format='%h %ad %s' -- docs/testing/fr03 tests/fr03 docs/superpowers/plans/2026-10-12-fr03-domain-testing.md` to `commit-log.txt`. Explain that it contains commits preceding its own snapshot commit. Verify and commit with `docs(fr03): export testing workflow commit history`; do not synthesize historical testing steps.

## Planning self-review and handoff

Checked: the seven tasks match the user-specified order; both techniques preserve requirements → model/partitions → boundaries/neighbors → fixtures → expected results → obligation mapping, with explanations before final case tables. Task 4 provides many-to-many source/technique mapping and unique-case counting. Tasks 5/6 separate raw execution from reconciled verdicts without delaying observation capture. All five Review Focus risks receive cases and state assertions. BVA-only cases enter the combined suite; categorical predicates are not mislabeled BVA; masking and unknown limits remain explicit. SUT fixes require a separate request.

Planning provenance: initial plan recorded 2026-10-12 00:26:11 Asia/Ho_Chi_Minh. This revision recorded 2026-10-12 09:03:58 Asia/Ho_Chi_Minh, using Codex; model identifier unavailable. User requested the seven-stage workflow and detailed technique explanations, not only final case tables. No backend/browser suite execution occurred while revising. The earlier plan remains in Git history; this is available planning evidence, not a complete AI audit or future learner approval.

Recommended execution: Native, because all seven stages depend on shared requirement, fixture, canonical-case and evidence interfaces. Review this revision and choose an execution method before running it, as required by the invoked writing-plans skill. This revision request authorizes editing the plan, not executing the testing workflow.
