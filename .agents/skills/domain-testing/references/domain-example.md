# Coupled boundary example

Illustrative contract: integer x,y >= 0, and x+y <= 10. The business boundary is x+y=10, included in the valid region.

| Role | Point | Expected | Purpose |
|---|---|---|---|
| Interior | (3,3) | Accept | Valid control |
| On | (4,6) | Accept | Equality inclusion |
| On, separated | (6,4) | Accept | A changed slope may distinguish these points |
| Off, inside | (4,5) | Accept | Closest integer step across the surface |
| Off, outside | (4,7) | Reject | Closest integer step across the surface |
| Intersection | (0,10) | Accept | Business boundary meets x=0 |
| Intersection neighbor | (0,11) | Reject | Isolate sum rule with x valid |
| Input-validation violation | (-1,10) | Reject | Isolate x rule with sum rule valid |

Also isolate y=0 and the other corner (10,0). Map each obligation explicitly; this table alone is not a complete suite. Points differing in more than one coordinate can target interactions but are not an isolated single-boundary check. For nonlinear boundaries, compute points from the equation and report representability or rounding uncertainty.
