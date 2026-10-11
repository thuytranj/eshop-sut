# EShop project instructions

## Purpose and test oracle

This repository is a System Under Test (SUT) for software-testing coursework.
Use `README.md` for intended business behavior, `api_specification.md` for API
interfaces, and `docs/2026.HW02.Domain Testing_En.pdf` for HW02 requirements.
If these sources conflict, record the ambiguity rather than silently choosing
the implemented behavior as correct.

For testing requests, preserve the SUT's behavior and report discrepancies.
Change application code to fix a bug only when the user requests a fix.
Do not expand a selected feature into testing the whole application.

## Repository map and commands

There is no root package.json. Run npm commands in the relevant component.
Use npm and the existing package-lock.json files.

| Component | Stack | Directory | Development command |
| --- | --- | --- | --- |
| Backend | Node.js, Express, SQLite | `backend/` | `npm run dev` (port 3000) |
| Customer web | React, Vite, Tailwind | `frontend-web/` | `npm run dev` (default port 5173) |
| Admin web | React, Vite, Tailwind | `frontend-admin/` | `npm run dev` (configured port 5174) |
| Mobile | React Native, Expo | `frontend-mobile/` | `npm start`; `npm run android` or `npm run ios` |

The web and admin packages provide `npm run lint` and `npm run build`.
Backend `npm test` is a failing placeholder, not a functioning test suite.
Mobile currently has no test/lint/build npm scripts. Inspect individual test
scripts before running them to understand their side effects.

`docker-compose.yml` starts backend, customer web, and admin, and mounts the
working `backend/database.sqlite`. Mobile's API URL is currently a hardcoded
LAN address in `frontend-mobile/App.js`; verify device connectivity before
native tests and record any environment adjustment.

## Testing workflow

- Read the selected feature's rules before inspecting implementation details
  to derive expected results. Use stable FR IDs for traceability.
- Apply the available `domain-testing` and `boundary-value-analysis` skills
  from `.agents/skills/` when those techniques are requested. Use supplied
  lectures as the course-method authority; disclose a fallback convention
  when lectures are unavailable.
- Use `qa-test-planner` when explicitly invoked. Use `webapp-testing` or
  `playwright-cli` for browser execution and evidence as appropriate.
- Keep UI, API, and native mobile evidence distinguishable. Expo web tests
  do not establish Android/iOS behavior.
- Each case records ID, rule, preconditions, input/fixture, steps, expected
  result, actual result, status, and evidence. Use `Not Run` for designed but
  unexecuted cases and `Blocked` for cases prevented by the environment.
- Record test state, counter resets, clock/timezone, build, and interface so
  results can be reproduced. Never infer pass/fail from generated cases.
- Derive coverage from explicit obligations. Separate designed from executed
  coverage and state unresolved limits instead of claiming complete coverage.
- Report bugs with reproducible steps, expected/actual behavior, environment,
  and screenshots/logs. Distinguish suspected defects from observed failures.

Protect existing data and evidence. `backend/database.sqlite` is working data;
do not stage incidental test changes to it. Inspect `backend/database.js`
before seed/startup operations: initialization includes destructive table
recreation. Use an isolated fixture or a safe backup when a run would alter
data the user needs. Preserve existing uncommitted changes.

## Atomic commits and clear messages

Use `.agents/skills/commit-work/SKILL.md` for authorized commits, with the
following project rules taking precedence over its generic splitting advice.

- One commit completes one small logical task. A task can span several files.
  Keep implementation and its directly related tests together when needed
  for a coherent change; do not split mechanically by directory or file type.
- When carrying out HW02, commit each completed testing step for each selected
  feature: for example domain modeling, boundary-case design, execution
  results, and bug documentation. Do not wait until all features are finished
  and make one aggregate commit. Do not invent a historical sequence for work
  already completed.
- This rule authorizes local commits of completed work requested by the user.
  Stage only the files/hunks belonging to that task. Review `git status`,
  unstaged and staged diffs before committing; preserve unrelated staged work.
  Do not use `git add .` or `git add -A` to collect mixed changes.
- Verify the task before committing. For documentation, inspect content,
  references, and whitespace. For application changes, run the relevant
  available checks and report failures or unavailable checks accurately.
- Use Conventional Commits: `type(scope): specific imperative summary`.
  Write commit messages in English, keep the subject at most 72 characters,
  and use a concrete scope such as `fr09`, `backend`, or `skills`.
  Use a body when motivation or a meaningful limitation needs explanation.
- Avoid subjects such as `update files`, `fix stuff`, or `done`. If one concise
  subject cannot describe the task, reconsider the commit boundaries.
- After committing, verify the resulting commit's files and report its hash,
  message, and relevant checks. Commit only authorized work; a clean working
  tree is not a goal when unrelated changes remain.
- Push, amend, rebase, squash, and other history rewrites require the user's
  request. Do not bypass hooks or alter Git configuration to make a commit.

Examples of separate tasks:

```text
docs(fr09): define coupon acceptance domains
test(fr09): add minimum-order boundary cases
docs(fr09): record boundary test results
docs(fr09): document expired coupon defect
```

## HW02 reports and AI evidence

For full-assignment work, preserve the user's selection of four features,
one per pool; group uniqueness requires the actual group allocation.
Document Domain Testing and BVA step by step and record human corrections
and AI omissions supported by actual evidence.

Maintain an AI interaction log containing tool/model when known, timestamp
with timezone, prompts, and available outputs. Do not fabricate student
review, audit entries, execution results, or demo links. Use Asia/Ho_Chi_Minh
for user-facing local times unless the user specifies another timezone.

The submission requires main reports and AI Audit/Critique in Markdown and
PDF, a 200-300-word AI Critique, bug reports and screenshots, a text Git commit
log, and a README containing self-assessment and test statistics. Count unique
cases: designed, executed, passed, failed, and not yet executed; identify
blocked cases explicitly. Include feature/bug counts and demo links.
Follow the assignment ZIP naming format and obtain the deadline from Moodle.

Publishing issues, uploading videos, or submitting coursework requires the
user's authorization. When authorized for the full assignment, record bugs
both in Markdown and on the group's GitHub Issues with screenshots.
