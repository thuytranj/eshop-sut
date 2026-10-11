---
name: boundary-value-analysis
description: Design Boundary Value Analysis (BVA) cases and coverage from ordered equivalence partitions. Use for numeric, length, count, and time limits, 2-value or 3-value BVA, and HW02 boundary reports; not unordered categorical or state-transition testing.
---

# Boundary Value Analysis

Derive boundary obligations from specified ordered partitions, including invalid partitions. Identify the method before counting coverage; different BVA conventions produce different sets.

## Test basis and method

Read the feature requirements and supplied lectures. Record rule IDs, source locations, types, units, precision, admissible input universe, and unknowns. Requirements determine expected results even when code accepts different inputs.

Follow an explicitly requested or lecture-defined BVA variant. If none is supplied, use ISTQB 3-value BVA as a disclosed working default and read [the method reference](references/bva-methods.md). Do not claim this is the course method without lecture evidence. Keep valid-boundary three-point sampling and normal/robust/worst-case conventions separately labeled.

## Derive cases

1. List ordered equivalence partitions with exact inclusive/exclusive bounds, including invalid regions within the admissible universe. Disconnected regions are separate partitions.
2. Enumerate finite minimum/maximum elements of every partition. A numeric acceptance threshold is not necessarily a partition endpoint: for integers x < k, the accepting upper endpoint is k-1 and the rejecting lower endpoint is k.
3. Apply the selected variant to every boundary value. For ISTQB 2-value, include each endpoint and the closest neighbor in each adjacent partition it borders; a singleton may border two partitions. For ISTQB 3-value, include each endpoint and its predecessor/successor within the universe. Take the union of values per dimension for the coverage denominator; preserve endpoint-to-value mappings when deduplicating.
4. Derive neighbors from representation: integer/count step 1; decimal/currency step from the contract; time step from supported resolution and timezone. If precision is unspecified, report incomplete adjacency analysis rather than silently using 0.01 or a machine epsilon. String length needs an agreed counting unit and actual inputs of verified length.
5. Build cases with other conditions valid at nominal values; record fixture and steps. Add cross-boundary combinations only for coupled predicates or a requested combination strategy. Keep null, malformed, wrong-type and unordered values as supplementary tests, outside BVA coverage.
6. Map obligations to cases; calculate unique designed obligations / identified obligations and exercised obligations / identified obligations separately. When unresolved limits prevent enumeration, state partial coverage and known scope rather than 100% feature coverage.

## Deliverables

Produce test basis/assumptions; selected variant; partition and boundary tables; deduplicated obligations; test cases; traceability/coverage; review gaps. Each case has ID, rule and boundary IDs, full input fixture, preconditions, steps, expected result, actual result, status and evidence. Unexecuted cases are `Not Run`, blocked cases are `Blocked`; static code discrepancies are suspected defects, not observed failures.

Execute only within authorized testing scope. Record interface, build, stored state, clock and fixture reset for reproducibility. Designing cases does not authorize modifying business logic or publishing issues.

For EShop HW02, read [assignment guidance](references/eshop-hw02.md). For domain surfaces involving several variables, use Domain Testing alongside BVA when available; this skill remains usable independently.
