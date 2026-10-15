# FR15 — Suite review / freeze

Review: AI self-review. Learner technical review: Pending. Original source IDs and obligation mappings preserved.

Dedup key: layer/action/preconditions/fixture/input/steps/expected outcome+stateContract. Description wording is explanatory, not an assertion; merged cases retain all source rationales in source JSON. Different layers/actions never merge.

Corrections / preventive review: added empty-category membership in design; name boundary includes 257; price only Z slice; non-target UI before reload distinct from DB; no delete dialog invented. These are design decisions, not claims of learner corrections or discovered SUT bugs.

Sources=198; canonical=158; obligations=198. Layer counts: {'API': 97, 'WEB': 61}.

Harness TDD: initial valid-suite assertion failed with validator not implemented; implementation then verified with six acceptance/rejection checks. Frozen actual=null, status=Not Run, evidence=[].

| File | SHA256 |
|---|---|
| tests/fr15/suite.json | bb96a06dcfc27932a310f60a24b40108446a9fe95fb262de6906bab3232b0901 |
| tests/fr15/source-cases.json | 1b5a5938fdfec378419deb3ff4afa2a3227bfbb69504028ab1204c009dbbeb27 |
| tests/fr15/obligations.json | f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305 |

| Canonical | Layer/action | Sources | Techniques | Obligations |
|---|---|---|---|---|
| FR15-TC-001 | API/Create | FR15-DT-001 | Domain Testing | FR15-OBL-DT-001 |
| FR15-TC-002 | API/Create | FR15-DT-002,FR15-DT-027,FR15-BVA-001 | Domain Testing,BVA | FR15-OBL-DT-002,FR15-OBL-DT-027,FR15-OBL-BVA-001 |
| FR15-TC-003 | API/Create | FR15-DT-003,FR15-BVA-002 | Domain Testing,BVA | FR15-OBL-DT-003,FR15-OBL-BVA-002 |
| FR15-TC-004 | API/Create | FR15-DT-004,FR15-BVA-003 | Domain Testing,BVA | FR15-OBL-DT-004,FR15-OBL-BVA-003 |
| FR15-TC-005 | API/Create | FR15-DT-005,FR15-BVA-004 | Domain Testing,BVA | FR15-OBL-DT-005,FR15-OBL-BVA-004 |
| FR15-TC-006 | API/Create | FR15-DT-006,FR15-BVA-005 | Domain Testing,BVA | FR15-OBL-DT-006,FR15-OBL-BVA-005 |
| FR15-TC-007 | API/Create | FR15-DT-007,FR15-BVA-006 | Domain Testing,BVA | FR15-OBL-DT-007,FR15-OBL-BVA-006 |
| FR15-TC-008 | API/Create | FR15-DT-008,FR15-BVA-008 | Domain Testing,BVA | FR15-OBL-DT-008,FR15-OBL-BVA-008 |
| FR15-TC-009 | API/Create | FR15-DT-009,FR15-BVA-009 | Domain Testing,BVA | FR15-OBL-DT-009,FR15-OBL-BVA-009 |
| FR15-TC-010 | API/Create | FR15-DT-010,FR15-BVA-010 | Domain Testing,BVA | FR15-OBL-DT-010,FR15-OBL-BVA-010 |
| FR15-TC-011 | API/Create | FR15-DT-011 | Domain Testing | FR15-OBL-DT-011 |
| FR15-TC-012 | API/Create | FR15-DT-012 | Domain Testing | FR15-OBL-DT-012 |
| FR15-TC-013 | API/Create | FR15-DT-013 | Domain Testing | FR15-OBL-DT-013 |
| FR15-TC-014 | API/Create | FR15-DT-014 | Domain Testing | FR15-OBL-DT-014 |
| FR15-TC-015 | API/Create | FR15-DT-015 | Domain Testing | FR15-OBL-DT-015 |
| FR15-TC-016 | API/Create | FR15-DT-016 | Domain Testing | FR15-OBL-DT-016 |
| FR15-TC-017 | API/Create | FR15-DT-017 | Domain Testing | FR15-OBL-DT-017 |
| FR15-TC-018 | API/Create | FR15-DT-018 | Domain Testing | FR15-OBL-DT-018 |
| FR15-TC-019 | API/Create | FR15-DT-019 | Domain Testing | FR15-OBL-DT-019 |
| FR15-TC-020 | API/Create | FR15-DT-020 | Domain Testing | FR15-OBL-DT-020 |
| FR15-TC-021 | API/Create | FR15-DT-021 | Domain Testing | FR15-OBL-DT-021 |
| FR15-TC-022 | API/Create | FR15-DT-022,FR15-DT-030 | Domain Testing | FR15-OBL-DT-022,FR15-OBL-DT-030 |
| FR15-TC-023 | API/Create | FR15-DT-023 | Domain Testing | FR15-OBL-DT-023 |
| FR15-TC-024 | API/Create | FR15-DT-024 | Domain Testing | FR15-OBL-DT-024 |
| FR15-TC-025 | API/Create | FR15-DT-025 | Domain Testing | FR15-OBL-DT-025 |
| FR15-TC-026 | API/Create | FR15-DT-026 | Domain Testing | FR15-OBL-DT-026 |
| FR15-TC-027 | API/Create | FR15-DT-028 | Domain Testing | FR15-OBL-DT-028 |
| FR15-TC-028 | API/Create | FR15-DT-029 | Domain Testing | FR15-OBL-DT-029 |
| FR15-TC-029 | API/Create | FR15-DT-031 | Domain Testing | FR15-OBL-DT-031 |
| FR15-TC-030 | API/Create | FR15-DT-032 | Domain Testing | FR15-OBL-DT-032 |
| FR15-TC-031 | API/Create | FR15-DT-033 | Domain Testing | FR15-OBL-DT-033 |
| FR15-TC-032 | API/Create | FR15-SUP-001 | Supplementary | FR15-OBL-SUP-001 |
| FR15-TC-033 | API/Create | FR15-SUP-002 | Supplementary | FR15-OBL-SUP-002 |
| FR15-TC-034 | API/Create | FR15-SUP-003 | Supplementary | FR15-OBL-SUP-003 |
| FR15-TC-035 | API/Update | FR15-DT-034 | Domain Testing | FR15-OBL-DT-034 |
| FR15-TC-036 | API/Update | FR15-DT-035,FR15-DT-060,FR15-BVA-012 | Domain Testing,BVA | FR15-OBL-DT-035,FR15-OBL-DT-060,FR15-OBL-BVA-012 |
| FR15-TC-037 | API/Update | FR15-DT-036,FR15-BVA-013 | Domain Testing,BVA | FR15-OBL-DT-036,FR15-OBL-BVA-013 |
| FR15-TC-038 | API/Update | FR15-DT-037,FR15-BVA-014 | Domain Testing,BVA | FR15-OBL-DT-037,FR15-OBL-BVA-014 |
| FR15-TC-039 | API/Update | FR15-DT-038,FR15-BVA-015 | Domain Testing,BVA | FR15-OBL-DT-038,FR15-OBL-BVA-015 |
| FR15-TC-040 | API/Update | FR15-DT-039,FR15-BVA-016 | Domain Testing,BVA | FR15-OBL-DT-039,FR15-OBL-BVA-016 |
| FR15-TC-041 | API/Update | FR15-DT-040,FR15-BVA-017 | Domain Testing,BVA | FR15-OBL-DT-040,FR15-OBL-BVA-017 |
| FR15-TC-042 | API/Update | FR15-DT-041,FR15-BVA-019 | Domain Testing,BVA | FR15-OBL-DT-041,FR15-OBL-BVA-019 |
| FR15-TC-043 | API/Update | FR15-DT-042,FR15-BVA-020 | Domain Testing,BVA | FR15-OBL-DT-042,FR15-OBL-BVA-020 |
| FR15-TC-044 | API/Update | FR15-DT-043,FR15-BVA-021 | Domain Testing,BVA | FR15-OBL-DT-043,FR15-OBL-BVA-021 |
| FR15-TC-045 | API/Update | FR15-DT-044 | Domain Testing | FR15-OBL-DT-044 |
| FR15-TC-046 | API/Update | FR15-DT-045 | Domain Testing | FR15-OBL-DT-045 |
| FR15-TC-047 | API/Update | FR15-DT-046 | Domain Testing | FR15-OBL-DT-046 |
| FR15-TC-048 | API/Update | FR15-DT-047 | Domain Testing | FR15-OBL-DT-047 |
| FR15-TC-049 | API/Update | FR15-DT-048 | Domain Testing | FR15-OBL-DT-048 |
| FR15-TC-050 | API/Update | FR15-DT-049 | Domain Testing | FR15-OBL-DT-049 |
| FR15-TC-051 | API/Update | FR15-DT-050 | Domain Testing | FR15-OBL-DT-050 |
| FR15-TC-052 | API/Update | FR15-DT-051 | Domain Testing | FR15-OBL-DT-051 |
| FR15-TC-053 | API/Update | FR15-DT-052 | Domain Testing | FR15-OBL-DT-052 |
| FR15-TC-054 | API/Update | FR15-DT-053 | Domain Testing | FR15-OBL-DT-053 |
| FR15-TC-055 | API/Update | FR15-DT-054 | Domain Testing | FR15-OBL-DT-054 |
| FR15-TC-056 | API/Update | FR15-DT-055,FR15-DT-063 | Domain Testing | FR15-OBL-DT-055,FR15-OBL-DT-063 |
| FR15-TC-057 | API/Update | FR15-DT-056 | Domain Testing | FR15-OBL-DT-056 |
| FR15-TC-058 | API/Update | FR15-DT-057 | Domain Testing | FR15-OBL-DT-057 |
| FR15-TC-059 | API/Update | FR15-DT-058 | Domain Testing | FR15-OBL-DT-058 |
| FR15-TC-060 | API/Update | FR15-DT-059 | Domain Testing | FR15-OBL-DT-059 |
| FR15-TC-061 | API/Update | FR15-DT-061 | Domain Testing | FR15-OBL-DT-061 |
| FR15-TC-062 | API/Update | FR15-DT-062 | Domain Testing | FR15-OBL-DT-062 |
| FR15-TC-063 | API/Update | FR15-DT-064 | Domain Testing | FR15-OBL-DT-064 |
| FR15-TC-064 | API/Update | FR15-DT-065 | Domain Testing | FR15-OBL-DT-065 |
| FR15-TC-065 | API/Update | FR15-DT-066 | Domain Testing | FR15-OBL-DT-066 |
| FR15-TC-066 | API/Update | FR15-SUP-004 | Supplementary | FR15-OBL-SUP-004 |
| FR15-TC-067 | API/Update | FR15-SUP-005 | Supplementary | FR15-OBL-SUP-005 |
| FR15-TC-068 | API/Update | FR15-SUP-006 | Supplementary | FR15-OBL-SUP-006 |
| FR15-TC-069 | WEB/Create | FR15-DT-067 | Domain Testing | FR15-OBL-DT-067 |
| FR15-TC-070 | WEB/Create | FR15-DT-068,FR15-BVA-023 | Domain Testing,BVA | FR15-OBL-DT-068,FR15-OBL-BVA-023 |
| FR15-TC-071 | WEB/Create | FR15-DT-069,FR15-BVA-024 | Domain Testing,BVA | FR15-OBL-DT-069,FR15-OBL-BVA-024 |
| FR15-TC-072 | WEB/Create | FR15-DT-070,FR15-BVA-025 | Domain Testing,BVA | FR15-OBL-DT-070,FR15-OBL-BVA-025 |
| FR15-TC-073 | WEB/Create | FR15-DT-071,FR15-BVA-026 | Domain Testing,BVA | FR15-OBL-DT-071,FR15-OBL-BVA-026 |
| FR15-TC-074 | WEB/Create | FR15-DT-072,FR15-BVA-027 | Domain Testing,BVA | FR15-OBL-DT-072,FR15-OBL-BVA-027 |
| FR15-TC-075 | WEB/Create | FR15-DT-073,FR15-BVA-028 | Domain Testing,BVA | FR15-OBL-DT-073,FR15-OBL-BVA-028 |
| FR15-TC-076 | WEB/Create | FR15-DT-074,FR15-BVA-030 | Domain Testing,BVA | FR15-OBL-DT-074,FR15-OBL-BVA-030 |
| FR15-TC-077 | WEB/Create | FR15-DT-075,FR15-BVA-031 | Domain Testing,BVA | FR15-OBL-DT-075,FR15-OBL-BVA-031 |
| FR15-TC-078 | WEB/Create | FR15-DT-076,FR15-BVA-032 | Domain Testing,BVA | FR15-OBL-DT-076,FR15-OBL-BVA-032 |
| FR15-TC-079 | WEB/Create | FR15-DT-077 | Domain Testing | FR15-OBL-DT-077 |
| FR15-TC-080 | WEB/Create | FR15-DT-078 | Domain Testing | FR15-OBL-DT-078 |
| FR15-TC-081 | WEB/Create | FR15-DT-079 | Domain Testing | FR15-OBL-DT-079 |
| FR15-TC-082 | WEB/Create | FR15-DT-080 | Domain Testing | FR15-OBL-DT-080 |
| FR15-TC-083 | WEB/Create | FR15-DT-081 | Domain Testing | FR15-OBL-DT-081 |
| FR15-TC-084 | WEB/Create | FR15-DT-082 | Domain Testing | FR15-OBL-DT-082 |
| FR15-TC-085 | WEB/Create | FR15-DT-083 | Domain Testing | FR15-OBL-DT-083 |
| FR15-TC-086 | WEB/Create | FR15-DT-084 | Domain Testing | FR15-OBL-DT-084 |
| FR15-TC-087 | WEB/Create | FR15-DT-085 | Domain Testing | FR15-OBL-DT-085 |
| FR15-TC-088 | WEB/Create | FR15-DT-086 | Domain Testing | FR15-OBL-DT-086 |
| FR15-TC-089 | WEB/Create | FR15-DT-087 | Domain Testing | FR15-OBL-DT-087 |
| FR15-TC-090 | WEB/Create | FR15-DT-088 | Domain Testing | FR15-OBL-DT-088 |
| FR15-TC-091 | WEB/Create | FR15-SUP-007 | Supplementary | FR15-OBL-SUP-007 |
| FR15-TC-092 | WEB/Update | FR15-DT-089 | Domain Testing | FR15-OBL-DT-089 |
| FR15-TC-093 | WEB/Update | FR15-DT-090,FR15-BVA-034 | Domain Testing,BVA | FR15-OBL-DT-090,FR15-OBL-BVA-034 |
| FR15-TC-094 | WEB/Update | FR15-DT-091,FR15-BVA-035 | Domain Testing,BVA | FR15-OBL-DT-091,FR15-OBL-BVA-035 |
| FR15-TC-095 | WEB/Update | FR15-DT-092,FR15-BVA-036 | Domain Testing,BVA | FR15-OBL-DT-092,FR15-OBL-BVA-036 |
| FR15-TC-096 | WEB/Update | FR15-DT-093,FR15-BVA-037 | Domain Testing,BVA | FR15-OBL-DT-093,FR15-OBL-BVA-037 |
| FR15-TC-097 | WEB/Update | FR15-DT-094,FR15-BVA-038 | Domain Testing,BVA | FR15-OBL-DT-094,FR15-OBL-BVA-038 |
| FR15-TC-098 | WEB/Update | FR15-DT-095,FR15-BVA-039 | Domain Testing,BVA | FR15-OBL-DT-095,FR15-OBL-BVA-039 |
| FR15-TC-099 | WEB/Update | FR15-DT-096,FR15-BVA-041 | Domain Testing,BVA | FR15-OBL-DT-096,FR15-OBL-BVA-041 |
| FR15-TC-100 | WEB/Update | FR15-DT-097,FR15-BVA-042 | Domain Testing,BVA | FR15-OBL-DT-097,FR15-OBL-BVA-042 |
| FR15-TC-101 | WEB/Update | FR15-DT-098,FR15-BVA-043 | Domain Testing,BVA | FR15-OBL-DT-098,FR15-OBL-BVA-043 |
| FR15-TC-102 | WEB/Update | FR15-DT-099 | Domain Testing | FR15-OBL-DT-099 |
| FR15-TC-103 | WEB/Update | FR15-DT-100 | Domain Testing | FR15-OBL-DT-100 |
| FR15-TC-104 | WEB/Update | FR15-DT-101 | Domain Testing | FR15-OBL-DT-101 |
| FR15-TC-105 | WEB/Update | FR15-DT-102 | Domain Testing | FR15-OBL-DT-102 |
| FR15-TC-106 | WEB/Update | FR15-DT-103 | Domain Testing | FR15-OBL-DT-103 |
| FR15-TC-107 | WEB/Update | FR15-DT-104 | Domain Testing | FR15-OBL-DT-104 |
| FR15-TC-108 | WEB/Update | FR15-DT-105 | Domain Testing | FR15-OBL-DT-105 |
| FR15-TC-109 | WEB/Update | FR15-DT-106 | Domain Testing | FR15-OBL-DT-106 |
| FR15-TC-110 | WEB/Update | FR15-DT-107 | Domain Testing | FR15-OBL-DT-107 |
| FR15-TC-111 | WEB/Update | FR15-DT-108 | Domain Testing | FR15-OBL-DT-108 |
| FR15-TC-112 | WEB/Update | FR15-DT-109 | Domain Testing | FR15-OBL-DT-109 |
| FR15-TC-113 | WEB/Update | FR15-DT-110 | Domain Testing | FR15-OBL-DT-110 |
| FR15-TC-114 | WEB/Update | FR15-SUP-008 | Supplementary | FR15-OBL-SUP-008 |
| FR15-TC-115 | API/Read | FR15-DT-111 | Domain Testing | FR15-OBL-DT-111 |
| FR15-TC-116 | API/Read | FR15-DT-112 | Domain Testing | FR15-OBL-DT-112 |
| FR15-TC-117 | API/Read | FR15-DT-113 | Domain Testing | FR15-OBL-DT-113 |
| FR15-TC-118 | API/Read | FR15-DT-114 | Domain Testing | FR15-OBL-DT-114 |
| FR15-TC-119 | API/Delete | FR15-DT-115 | Domain Testing | FR15-OBL-DT-115 |
| FR15-TC-120 | API/Delete | FR15-DT-116 | Domain Testing | FR15-OBL-DT-116 |
| FR15-TC-121 | API/Update | FR15-DT-117 | Domain Testing | FR15-OBL-DT-117 |
| FR15-TC-122 | API/Update | FR15-DT-118 | Domain Testing | FR15-OBL-DT-118 |
| FR15-TC-123 | API/Update | FR15-DT-119 | Domain Testing | FR15-OBL-DT-119 |
| FR15-TC-124 | API/Update | FR15-DT-120 | Domain Testing | FR15-OBL-DT-120 |
| FR15-TC-125 | API/Update | FR15-DT-121 | Domain Testing | FR15-OBL-DT-121 |
| FR15-TC-126 | API/Update | FR15-DT-122 | Domain Testing | FR15-OBL-DT-122 |
| FR15-TC-127 | WEB/Read | FR15-DT-123 | Domain Testing | FR15-OBL-DT-123 |
| FR15-TC-128 | WEB/Read | FR15-DT-124 | Domain Testing | FR15-OBL-DT-124 |
| FR15-TC-129 | WEB/Delete | FR15-DT-125 | Domain Testing | FR15-OBL-DT-125 |
| FR15-TC-130 | WEB/Delete | FR15-DT-126 | Domain Testing | FR15-OBL-DT-126 |
| FR15-TC-131 | WEB/Update | FR15-DT-127 | Domain Testing | FR15-OBL-DT-127 |
| FR15-TC-132 | WEB/Update | FR15-DT-128 | Domain Testing | FR15-OBL-DT-128 |
| FR15-TC-133 | WEB/Update | FR15-DT-129 | Domain Testing | FR15-OBL-DT-129 |
| FR15-TC-134 | WEB/Update | FR15-DT-130 | Domain Testing | FR15-OBL-DT-130 |
| FR15-TC-135 | WEB/Update | FR15-DT-131 | Domain Testing | FR15-OBL-DT-131 |
| FR15-TC-136 | WEB/Update | FR15-DT-132 | Domain Testing | FR15-OBL-DT-132 |
| FR15-TC-137 | API/Create | FR15-DT-133 | Domain Testing | FR15-OBL-DT-133 |
| FR15-TC-138 | API/Create | FR15-DT-134 | Domain Testing | FR15-OBL-DT-134 |
| FR15-TC-139 | API/Create | FR15-DT-135 | Domain Testing | FR15-OBL-DT-135 |
| FR15-TC-140 | API/Update | FR15-DT-136 | Domain Testing | FR15-OBL-DT-136 |
| FR15-TC-141 | API/Update | FR15-DT-137 | Domain Testing | FR15-OBL-DT-137 |
| FR15-TC-142 | API/Update | FR15-DT-138 | Domain Testing | FR15-OBL-DT-138 |
| FR15-TC-143 | API/Delete | FR15-DT-139 | Domain Testing | FR15-OBL-DT-139 |
| FR15-TC-144 | API/Delete | FR15-DT-140 | Domain Testing | FR15-OBL-DT-140 |
| FR15-TC-145 | API/Delete | FR15-DT-141 | Domain Testing | FR15-OBL-DT-141 |
| FR15-TC-146 | WEB/Create | FR15-DT-142 | Domain Testing | FR15-OBL-DT-142 |
| FR15-TC-147 | API/Create | FR15-DT-143 | Domain Testing | FR15-OBL-DT-143 |
| FR15-TC-148 | API/Read | FR15-SUP-009 | Supplementary | FR15-OBL-SUP-009 |
| FR15-TC-149 | API/Update | FR15-SUP-010 | Supplementary | FR15-OBL-SUP-010 |
| FR15-TC-150 | API/Delete | FR15-SUP-011 | Supplementary | FR15-OBL-SUP-011 |
| FR15-TC-151 | API/Create | FR15-BVA-007 | BVA | FR15-OBL-BVA-007 |
| FR15-TC-152 | API/Create | FR15-BVA-011 | BVA | FR15-OBL-BVA-011 |
| FR15-TC-153 | API/Update | FR15-BVA-018 | BVA | FR15-OBL-BVA-018 |
| FR15-TC-154 | API/Update | FR15-BVA-022 | BVA | FR15-OBL-BVA-022 |
| FR15-TC-155 | WEB/Create | FR15-BVA-029 | BVA | FR15-OBL-BVA-029 |
| FR15-TC-156 | WEB/Create | FR15-BVA-033 | BVA | FR15-OBL-BVA-033 |
| FR15-TC-157 | WEB/Update | FR15-BVA-040 | BVA | FR15-OBL-BVA-040 |
| FR15-TC-158 | WEB/Update | FR15-BVA-044 | BVA | FR15-OBL-BVA-044 |

## Freeze v2 — PNG fixture correction before execution

V1 hashes above are historical. IDAT CRC of AI-authored 1×1 PNG was invalid; reproduced by chunk CRC test (RED). Corrected CRC only, no SUT change; all IDs/rules/obligations and dedup identities preserved. New fixture test GREEN; validator rerun. This is an evidenced AI fixture omission, not a product bug. Active hashes:

| File | SHA256 |
|---|---|
| tests/fr15/suite.json | bd21cd16700d8c20d15c361ed0ac56a741978844ea4524ee8ede4020441da21e |
| tests/fr15/source-cases.json | 9c9693ff0a247e7231752a67955a2dd86647370d6bf8132983ca854b0c4e6346 |
| tests/fr15/obligations.json | f58dcd35b4458788872811f6d6120724c4e7ea16df820a7a4b89a25111632305 |
| tests/fr15/fixtures.json | 9968ebef532a7f4baf37d5c91f6334dee2b07bbf81b935d089356716f43b712d |
