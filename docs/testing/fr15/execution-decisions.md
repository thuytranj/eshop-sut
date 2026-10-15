# FR15 — Rulings and verification ledger

All rulings in chronological order, with costs if wrong. No minors deferred by independent review.

- Ruling: Worktree write denied by sandbox; use existing non-main branch hw02-domain-testing, adding only FR15 paths; native unused worktree archived — skill fallback and preservation of unrelated FR03 edits — cost if wrong: FR15 commits share branch history.

- Ruling: No business fixes. TDD red/green applies to harness behavior; human prose/schema datasets are reviewed, SUT failures remain evidence — AGENTS testing oracle overrides generic make-suite-green guidance — cost if wrong: reported failures remain in SUT intentionally.

- Ruling: Repository has no functioning root/backend suite; backend npm test is documented failing placeholder. Verify new harness and SUT suite separately — testing-only task — cost if wrong: unrelated application defects remain outside FR15.

- Task 5: Ruling: Correct invalid IDAT CRC in PNG fixture and refreeze v2 before execution; retain v1 in Git and documented old hashes — prevents unrelated image fallback — cost if wrong: fixture image change affects image-only observation, case semantics unchanged.

- Task 5: Ruling: Shared assert-products.cjs evaluator added beyond file map to keep API/Python verdict semantics consistent — same business oracle — cost if wrong: common-mode assertion bug; hand-derived assessor tests and final review mitigate.

- Task 5: Ruling: run01 Web snapshots raced React async updates (TC069 DOM had 3 rows while subsequent screenshot had 4). Preserve run01 as preliminary; add API-quiet settling and browser regression, use full run02 as final — avoids false SUT bugs — cost if wrong: 500ms quiet policy may still miss longer client-only timers; actual API requests tracked until complete.

- Task 5: Ruling: Add explicit API readback consistency assertion beyond DB snapshot to fulfill read-after-write requirement — hand-derived test RED→GREEN — cost if wrong: stricter API representation comparison; known numeric-string issue is checked only on detail with numeric normalization.

- Task 5: Ruling: git diff --cached --check warned on trailing spaces in raw runner logs; preserve logs verbatim and scope whitespace checks to authored .md/.json/.cjs/.py — evidence integrity — cost if wrong: raw-log patch whitespace warnings remain. Generic check was not green; authored-file check is green.

- Final: Ruling: Reviewer set aside SUT fixes, publishing/PDF/demo, unrelated FR03, and non-Chromium/native behavior; keep these outside selected FR15 testing scope — AGENTS and approved plan — cost if wrong: no external submission or other-platform assurance.

- Final: Ruling: Reviewer set aside fractional/Unicode/missing-target outcomes. Keep Unicode/trim and missing-target unresolved, but re-grade exact representable 0.5 acceptance as Important: price>0 admits it while unknown precision only limits BVA adjacency — cost if wrong: a later stricter course/price contract would require revising these four oracles.

## Task completion and final fix verification

- Task 1: complete (commits 6e29712..e625109, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 2: complete (commits e625109..e54872f, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 3: complete (commits e54872f..5fe4088, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 4: complete (commits 5fe4088..ef38fe2, tests: node tests/fr15/validate-suite.cjs --suite tests/fr15/suite.json --sources tests/fr15/source-cases.json --obligations tests/fr15/obligations.json → })

- Task 5: complete (commits ef38fe2..c85b6c2, tests: node tests/fr15/validate-suite.cjs --results docs/testing/fr15/evidence/fr15-run02 → })

- Task 6: complete (commits c85b6c2..dc0619a, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Task 7: complete (commits dc0619a..c0623d2, tests: python3 .superpowers/sdd/2026-10-15-fr15-domain-testing-bva/check-docs.py → FR15 artifact syntax and whitespace OK)

- Final: fixed image-source coverage — wrong-image assessor test RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

- Final: fixed missing-response rejection — no-response regression RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

- Final: fixed 0.5 oracle — canonical half-price consumer regression RED→GREEN, harness 18/18; full run03 reconciled: 56 Passed, 95 Failed, 7 oracle Blocked, 0 Not Run.

Authored document whitespace is checked separately from raw logs; a transient export/link check was rerun after generating the final export. No application source was modified.
