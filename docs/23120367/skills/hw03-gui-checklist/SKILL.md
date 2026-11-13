---
name: hw03-gui-checklist
description: Use when designing, reviewing, or executing the EShop HW03 GUI checklist, especially when coverage of IA-01, IA-02, IA-03, and IA-04 must be demonstrated.
---

# HW03 GUI checklist

Create an evidence-backed checklist covering all four interface aspects. IA groups are not functional Pools A-D. Load `hw03-ai-audit` for every interaction in this workflow.

## Sources and scope

Read `docs/2026.HW03.GUI Usability_En.pdf`, the relevant course materials when available, and the current SUT specification in root `README.md`. Record missing course materials rather than claiming to have reviewed them. Confirm selected screens/flow; preserve the user's scope. If it cannot cover all four IA groups meaningfully, report the gap and propose additional screens. Do not silently claim full coverage or duplicate items to reach the count.

Build an atomic requirements inventory before generating items. Preserve the source text/reference and screen applicability. Map current FR-21/22/23/24 to IA-01/02/03/04 respectively, and include relevant screen-specific FR requirements. Do not use implementation behavior as the expected result.

| Aspect | Required coverage to consider from the current SUT specification |
|---|---|
| IA-01 General UI standards | Vietnamese consistency; positive/danger action colors; currency formatting; one descriptive h1 per web page; logical Tab order |
| IA-02 Forms | Required markers; email/password input types; errors above submit; multi-step indicators; applicable labels and validation |
| IA-03 Navigation | Active navigation; cart count badge; logout label; breadcrumbs on applicable child screens |
| IA-04 Feedback / state | Add-to-cart feedback; delete confirmation; illustrated friendly empty state; descriptive image alt; loading and search-empty states where required |

These are a starting inventory, not a substitute for reading the current specification. Additional accessibility, responsive, RTL, or dark-mode checks need a stated basis and applicability; examples in the assignment are not automatically product requirements. Distinguish web DOM checks from native-mobile checks.

## Generate, review, validate

1. Preserve the first AI draft unchanged in audit. Produce at least 41 meaningful, individually observable checks across all four IA groups, with explicit expected results.
2. Produce UTF-8 CSV staging files with the headers below; export the reviewed checklist to Excel using the available spreadsheet skill. Keep CSV files for validation and traceability.
3. Review requirement coverage and semantic duplicates manually. Ask the student to review and supply genuinely human-added items. Do not label AI-authored additions as Human. Each Human addition needs an explanation of why AI missed it. Keep revisions traceable.
4. Run `python3 .agents/skills/hw03-gui-checklist/scripts/validate_checklist.py checklist.csv requirements.csv`. Fix errors; report aspect counts and uncovered requirements. A passing structural check does not prove completeness of the inventory or correctness of expected results; review both against sources.

Requirements CSV headers:
`requirement_id,ia,requirement,source,applicable,reason`

Checklist CSV headers:
`id,ia,requirement_ids,screen,check,expected,origin,addition_reason`

Use `yes/no` for applicability, `AI/Human` for origin, and semicolon-separated requirement IDs. A non-applicable requirement needs a reason. Example item: `GUI-001,IA-02,FR22-EMAIL,Login,Inspect email input type,Input uses type=email,AI,`.

## Execution and delivery

Only mark Passed/Failed after a real run. Until then, use Not Run. Extend execution records with platform/browser/OS/version, build/commit, actual result, Notes, screenshot path, and issue URL. Failed results require a reason and real screenshot. Deduplicate bugs without losing item links. Prepare bug reports; publish issues only when authorized.

Task 3 reuses the checklist on at least three permitted real platforms. Preserve environment/identity evidence required by the PDF; browser-engine emulation alone does not establish Safari or physical-device evidence. Report unexecuted checks honestly.

Deliver the requirements matrix, AI draft, reviewed checklist/Excel, coverage counts, execution summary and evidence links. Never fabricate human review, participants, execution, screenshots, audit timestamps, or Git history.
