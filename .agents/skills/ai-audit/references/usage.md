# Audit CLI

Run from the project root. The examples assume installation in `.agents/skills/ai-audit`.
Use `python3 .agents/skills/ai-audit/scripts/audit.py --help` for options.
The helper has no chat connector: the operator supplies visible content as UTF-8 files.
Logs are local JSONL; file locks protect cooperating CLI writers on macOS/Linux.

## Record an interaction

Save the exact visible prompt and output into files before calling the helper.
The paths below are examples of files supplied by the operator, not bundled evidence.

```bash
python3 .agents/skills/ai-audit/scripts/audit.py --log reports/ai-audit/interactions.jsonl record --tool Codex --task FR-09 --prompt-file /tmp/prompt.txt --output-file /tmp/output.txt --capture complete
```

The printed UUID identifies this interaction. `--model` is optional. Supply
`--occurred-at 2026-10-11T15:00:00+07:00` only when this is the actual known
interaction time. Omission stores null, displayed as Unknown. `recorded_at`
is generated separately in the configured project timezone. Use `--source`
to identify a transcript/export, screenshot, redaction or user-supplied notes.
Use partial/summary capture when original content is incomplete or paraphrased.

## Append learner review

```bash
python3 .agents/skills/ai-audit/scripts/audit.py --log reports/ai-audit/interactions.jsonl review --interaction-id INTERACTION_UUID --reviewer Student --decision modified --changes-file /tmp/learner-changes.txt --reason-file /tmp/learner-reason.txt --revised-output-file /tmp/learner-revised-output.txt --source "learner feedback supplied in current task"
```

Replace the UUID with the actual printed ID. Accepted/rejected decisions need
change/assessment notes but do not require revised output; modified decisions
do. Multiple reviews append chronological events; none replace originals.
Unknown historical review time remains null, just like interaction time.
For corrections to metadata, document them in review notes; do not silently edit
old ledger lines. Agent-generated proposed edits stay in an AI interaction until
the learner confirms or supplies them.

## Export the appendix

```bash
python3 .agents/skills/ai-audit/scripts/audit.py --log reports/ai-audit/interactions.jsonl export --output reports/ai-audit/AI_Audit_Report.md
```

Export validates the ledger, includes original text and every learner review,
and marks missing information. Existing output files are preserved: choose a
new filename for a later export. An empty ledger cannot produce an AI-use
declaration. For a no-AI declaration use actual user evidence separately.

The helper preserves content, but does not certify transcript completeness,
student authorship, test execution, or tamper resistance. Keep source exports
and use Git history when available. Do not commit real secrets. A Markdown
appendix needs a separately verified PDF conversion for the complete HW02
submission. Test the CLI without touching project evidence:

```bash
python3 .agents/skills/ai-audit/scripts/test_audit.py
```
