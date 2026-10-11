# BVA conventions and coverage

## ISTQB ordered partitions

Primary sources:
- [CTFL syllabus v4.0.1, section 4.2.2](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf)
- [ISTQB clarification: Boundary Value Analysis, sections 3-4](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf)

A boundary value is an extremal element of a partition, not an abstract dividing line. Consider boundaries of valid and invalid partitions and finite endpoints of the whole input universe. At an outer universe endpoint, omit an infeasible neighbor. An unbounded partition has no finite endpoint at infinity.

### Worked example: quantity

Illustrative contract: integer quantity in [1,5] is accepted; the input universe is all integers. It is possible to send negative numbers even though they are rejected.

| Partition | Bounds | Finite endpoints |
|---|---|---|
| Invalid low | (-infinity,0] | 0 |
| Valid | [1,5] | 1,5 |
| Invalid high | [6,infinity) | 6 |

2-value obligations: {0,1,5,6}, denominator 4.

3-value obligations per endpoint:
- 0 -> {-1,0,1}
- 1 -> {0,1,2}
- 5 -> {4,5,6}
- 6 -> {5,6,7}

Union: {-1,0,1,2,4,5,6,7}, denominator 8. Values 1,2,4,5 accept; -1,0,6,7 reject. Three-point sampling only at valid endpoints yields {0,1,2,4,5,6}; that is NOT the full ISTQB 3-value set over these partitions.

If the input universe is nonnegative integers, remove -1: denominator 7. A UI restriction does not automatically narrow the API input universe; report the tested layer.

For a singleton valid interval [1,1], overlapping endpoint neighborhoods deduplicate: over all integers, 2-value={0,1,2}, 3-value={-1,0,1,2,3}. For adjacent partitions with different outcomes, derive all endpoints before deduplication.

### Length and precision

For a required ASCII name with lengths 1..255, the admissible length universe is nonnegative integers. Partitions: {0}, [1,255], [256,infinity). 2-value={0,1,255,256}; 3-value={0,1,2,254,255,256,257}. No length -1 is realizable. If only max length is specified, do not infer requiredness. If Unicode counting is unspecified, ASCII examples give unambiguous lengths but do not resolve Unicode behavior.

For price > 0, zero is a threshold; adjacency requires precision and representation. With unspecified precision, zero and representative positive/negative values are useful partition probes, not a complete neighbor-based BVA proof. Do not invent a price maximum. For time now < expiry, equality rejects; a time step is usable only when the contract/test environment supports that resolution and fixes the timezone.

## Other conventions

Course materials may use normal BVA (valid endpoints, neighboring valid values, nominal), robust BVA (adds outside values), or worst-case combinations. Describe the selected convention and derive its actual obligations. Formulas such as 4n+1 or 6n+1 apply only under their independent, two-sided assumptions; deduplication, one-sided domains, or coupled constraints change counts. Do not mix these counts with ISTQB denominators.
