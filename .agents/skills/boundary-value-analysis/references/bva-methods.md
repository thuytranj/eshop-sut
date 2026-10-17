# BVA: choose a method before choosing points

## Course authority: KCPM Bài 4

Source: supplied `KCPM - Bai 4 - Phan hoach tuong duong va Gia tri bien.pdf`, PDF pages/slides 6–18 (equivalence partitioning) and 19–26 (BVA). A portable copy used for FR-03 is under `docs/testing/fr03/references/` in the EShop repository; locate the user's supplied source in other projects.

| Pages | What the lecture establishes |
|---|---|
| 6–10 | Identify input/output variables, then valid/invalid equivalence classes |
| 15–18 | Choose representatives; isolate one invalid class while other inputs stay valid; merge identical scenarios |
| 20–21 | Target boundary operator/value errors; ordered classes; LB/UB neighbors and inputs producing output boundaries |
| 22 | Standard BVA diagram: one variable varies, others nominal; `4n+1` |
| 23 | Robustness diagram: add outside neighbors; `6n+1` |
| 24 | Worst-case diagram: Cartesian product; `5^n` |
| 25 | Robust Worst-case diagram: Cartesian product with outside neighbors; `7^n` |
| 26 | Worked boundary fixtures, including values outside the valid interval |

The exponents on pages 24/25 must be read from rendered slides, not flattened PDF text (`5n`/`7n`). Examples illustrate method, not business requirements. The arithmetic in an example table must still be checked against its actual specification; never copy an erroneous expected result into a different SUT.

## Deriving the four variants

For an inclusive valid range `[a,b]`, resolution `h`, and valid nominal `m`:

| Variant | Values for a dimension | Combining dimensions |
|---|---|---|
| Standard BVA | `{a,a+h,m,b-h,b}` | One at a time; one shared nominal scenario |
| Robustness | `{a-h,a,a+h,m,b-h,b,b+h}` | One at a time; other inputs nominal/valid |
| Worst-case | Standard values | Feasible Cartesian product |
| Robust Worst-case | Robustness values | Feasible Cartesian product |

Example: two independent integer inputs each in `[1,5]`, nominal 3. Standard dimension set `{1,2,3,4,5}` gives 9 one-at-a-time cases; robustness adds 0/6 and gives 13. Products give 25/49. State explicitly whether robustness counts include the standard subset. Never add those overlapping totals together.

The familiar formulas assume two finite bounds, distinct selected points, independence and feasible scenarios. Calculate actual sets if those assumptions fail. Do not substitute the number of rules, database columns, or password character classes for `n`.

### One-sided range

For ASCII length at least 8, use LB=8, neighbor=9, a nominal such as 10; robustness adds 7. UB is unspecified, not 10, 32, 64 or infinity. Report a one-sided adaptation, not full two-sided formula coverage. Empty/very short values remain useful supplementary partitions, not mandatory course-boundary points simply because zero is the smallest realizable length.

### Singleton

For exact OTP length 6: LB=UB=nominal=6. Standard collapses to `{6}`. Values 5/7 are invalid outside neighbors and belong to robustness, not valid interior points. Verify binding separately: a wrong-length token cannot simultaneously match a correctly issued six-digit token. Rejection samples the combined acceptance predicate, not independent format validation. Actual issued OTP length is an output obligation too.

### Derived dimensions and precision

Password class counts may be projected onto `{0}` invalid and `[1,∞)` valid. Standard lower-side values `{1,2}` can use 2 as nominal; robustness adds 0. These are optional derived projections, with explicit coupling: counts sum to string length, and changing one count changes other counts. Do not claim six independent inputs or apply `4n+1` to them.

Use integer/count/ASCII-length step 1. For money/time use specified precision and timezone; if missing, expose the adjacency gap. For `x<k` over integers the last valid value is `k-1`; do not treat excluded equality as an included valid endpoint. Do not invent Unicode counting or numeric upper limits.

## ISTQB is a separately named convention

Retain existing ISTQB designs under their historical label when migrating. Under the previously used 3-value convention, each finite endpoint of valid and invalid partitions contributes its feasible predecessor/endpoint/successor. This can yield more points than course Standard/Robustness. For length ≥8 it gave `{0,1,6,7,8,9}`; course one-sided Standard + Robustness with nominal 10 gives `{7,8,9,10}`. Neither set may be renamed as the other. `{7,8,9}` alone is not accurately described as “ISTQB 2-value”.

## Migration and review checklist

- Preserve original source IDs, fixtures, raw observations, original suite hash and execution dates.
- Record source/version and why the method changed; retain old-only points as supplementary regression.
- Map every new method obligation to exact canonical fixtures and evidence. Same length alone is insufficient for replay equivalence.
- Keep API/WEB obligations separate. A missing field blocks dependent interactions; it does not make them pass.
- New/changed scenarios start Not Run; reuse old evidence with its original timestamp only when the scenario and checked assertions match.
- Distinguish scenario coverage, exercised point coverage and unmasked predicate coverage; give explicit denominators and limits.
