---
name: domain-testing
description: Design specification-based Domain Testing cases for input regions, predicate boundaries, and multi-variable interactions. Use for domain testing, on/off/in points, or HW02 domain reports; not DNS testing or domain-driven design.
---

# Domain Testing

Model the specified acceptance regions before selecting test data. Keep Domain Testing distinct from one-dimensional BVA; a list of min/max values alone does not establish multi-variable domain coverage.

## Establish the test basis

Read the selected feature's requirements and supplied lecture materials. Preserve their terminology and method. Record source locations, rule IDs, unknowns, and assumptions. Use requirements as the expected-result oracle; implementation describes observed behavior, not what is correct. If lectures are unavailable, label the method below as a working convention, not a verified course method.

Identify controllable inputs, configuration, time, stored counters, authentication, and preconditions. For each dimension record type, unit, resolution, admissible universe, and constraints. Distinguish input-validation rules from business-acceptance rules. Do not invent missing upper limits, precisions, or validity rules.

## Derive cases step by step

1. Translate rules into predicates with exact strict/inclusive operators; express the valid region and its complement. Explain each partition and expected behavior. Mark disconnected regions and infeasible combinations.
2. Choose a valid interior/reference fixture. Define boundaries as equality surfaces even when the surface is excluded by a strict predicate.
3. For each boundary choose on points, nearest feasible off points on each side, and an interior control. State coordinates, resolution, all predicate truth values, and expected outcome. At a discrete strict threshold the equality point may be rejected; an off point may be valid. Labels never substitute for evaluating predicates.
4. Hold other rules valid to isolate each fault. For a boundary involving multiple inputs, sample separated on points along it and perturb across it to target shifted, tilted, omitted, or incorrectly included boundaries. Use more points for curved/piecewise boundaries; explain sampling limits.
5. Add feasible intersections/corners and selected interactions justified by risk. Separate single-rule failures from multiple-rule failures so rejection does not mask an untested predicate. Treat unordered boolean/category cases as partitions, not numeric BVA.
6. Map every domain and boundary obligation to case IDs. Report designed and executed coverage separately with explicit denominators. Finite samples support the stated model, not exhaustive correctness over a continuous domain.

## Report and execution

Output: test basis and ambiguities; domain/predicate tables; point-selection reasoning; cases; coverage matrix; review/gaps. Each case records ID, rule/domain/boundary ID, full input fixture, preconditions, steps, expected result, actual result, status, and evidence. Start unexecuted cases as `Not Run`; distinguish `Blocked` from failure.

Execute only when requested or included in the authorized testing scope. Preserve fixture isolation and record UI/API layer, build, state, and clock. A suspected implementation discrepancy is not a confirmed bug without observation. Skill invocation does not authorize changing the SUT or publishing GitHub issues.

Read [the worked example](references/domain-example.md) for coupled-boundary sampling. For EShop HW02, read [assignment guidance](references/eshop-hw02.md).
