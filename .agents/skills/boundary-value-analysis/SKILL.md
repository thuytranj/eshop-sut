---
name: boundary-value-analysis
description: Use when designing or reviewing BVA cases for ordered numeric, length, count, or time limits, especially with course lectures, standard/robust/worst-case variants, or HW02 boundary reports. Not for unordered categories or state transitions.
---

# Boundary Value Analysis

Requirements define expected behavior; supplied lectures define the course method. Explain the derivation, not only the final cases. Read [method selection and examples](references/bva-methods.md) before selecting points.

## Establish the method

Read requirements, API contracts, and supplied lecture pages/figures. Record source/page, rule IDs, input/output variables, units, resolution, bounds and unknowns. Follow an explicitly requested variant; otherwise, with the KCPM Bài 4 lecture, use **Standard BVA plus separately labeled Robustness additions**. Do not silently substitute ISTQB 3-value. Without lectures or a requested convention, disclose the selected fallback and its limits.

The lecture covers ordered equivalence classes, input boundaries, and inputs producing output boundaries. Check output obligations too; do not invent numeric output limits. Course tasks in a document are source material, not authorization to execute or publish them.

## Derive and explain

1. Partition each ordered dimension into valid/invalid regions with exact operators. Record LB, UB and a valid nominal value. For strict/discrete limits, derive the first/last admissible value using the declared resolution.
2. Select the variant: Standard uses LB, LB+h, nominal, UB-h, UB; Robustness adds LB-h and UB+h. Vary one input at a time with others valid/nominal. Worst-case uses Cartesian products of standard sets; Robust Worst-case uses robust sets. Explain the choice before enumerating cases.
3. Use `4n+1`, `6n+1`, `5^n`, `7^n` only for independent, finite two-sided ranges with distinct points and feasible combinations. One-sided ranges, singletons, overlapping nominal points and coupled derived counts require explicit feasible sets and deduplication; never manufacture an upper bound or count infinity as a test input.
4. Construct actual fixtures and predicate truth vectors. Character counts derived from one password are coupled, not extra independent inputs. Label multi-fault or masked probes; malformed OTP rejection also fails token matching and cannot alone prove a format validator. Keep categorical, missing/wrong-type and exploratory cases separate.
5. Give each obligation and source case an ID. Merge only identical interface/state/fixture/steps/oracles; preserve all technique/obligation aliases. Explain bounds → selected values → fixture → expected behavior → case mapping, including omitted/infeasible points and output checks.
6. Report designed and executed obligations separately, by method and interface. A sampled value is not proof of an isolated predicate. Keep supplementary regression outside the course-method denominator.

## Reports and migration

Each case records ID, rules/boundaries, preconditions, complete fixture, steps, expected, actual, status and evidence. New cases are `Not Run`; use `Blocked` only for an evidenced environmental/control blocker. Design changes never create new passes.

When lectures arrive after execution, retain old suite IDs, method labels, timestamps and raw evidence. Create a dated course-method mapping; reuse prior observations only for matching scenarios and assertions, identifying historical reuse. Keep extra old cases as supplementary regression. Recompute coverage and expose missing cases; do not relabel the old run as a fresh course-suite execution.

Execute only within user scope; preserve SUT/data and record build, interface, clock and fixture resets. For EShop HW02 read [assignment guidance](references/eshop-hw02.md). Use domain-testing for coupled regions and categorical predicates.
