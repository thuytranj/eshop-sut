# Harness verification evidence

These are harness tests, not SUT product-case results. Initial RED logs show missing preparation/assertion/orchestration behavior and a corrupt fixture, followed by 15 GREEN tests in task5-green.log. UI settling separately failed because settling behavior was missing, then passed a real Chromium delayed-DOM regression via `node tests/fr15/run-all.cjs --ui-self-check`; its command output is available in the current chat, not reconstructed as a historical log here.

run01 is preliminary: DOM sampling raced asynchronous fetchData after save; subsequent screenshots could show a newer state. Keep its raw records, do not count them as final bugs. run02 reruns the entire frozen suite with 500ms API quiet time and two animation frames, preserving immediate UI state before reload. Backend initialization is byte-identical to source, and fixtures are reset only after startup completes.

No SUT fix is included. Tests reporting product Fail are evidence of discrepancies; harness tests must pass. Exact model/historical prompt timestamps are unknown; audit capture is explicitly partial.
