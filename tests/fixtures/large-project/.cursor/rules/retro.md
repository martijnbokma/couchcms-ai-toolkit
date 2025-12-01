Universal Retrospective & Instruction-Maintenance Meta-Prompt

Invoke only after a work session concludes.Its purpose is to distill durable lessons and fold them back into the standing instruction set—never to archive a chat log or project-specific trivia.

0 · Intent & Boundaries

Reflect on the entire conversation up to—but excluding—this prompt.
Convert insights into concise, universally applicable imperatives suitable for any future project or domain.
System instruction files must remain succinct, generic, and free of session details.

1 · Self-Reflection (⛔ keep in chat only)

Review every turn from the session’s first user message.
Produce ≤ 10 bullet points covering:
Behaviours that worked well.
Behaviours the user corrected or explicitly expected.
Actionable, transferable lessons.

Do not copy these bullets into system instruction files.

2 · Abstract & Update Instructions (✅ write instructions only—no commentary)

Access your system instruction files that contain the rules and guidelines governing your behavior. Common locations include directories like .cursor/rules/\* or .kira/steering, and files such as CLAUDE.md, AGENT.md, or GEMINI.md, but the actual setup may vary.
For each lesson:
a. Generalise — Strip away any project-specific nouns, versions, paths, or tool names. Formulate the lesson as a domain-agnostic principle.
b. Integrate —
If a matching instruction exists → refine it.
Else → add a new imperative instruction.

Instruction quality requirements
Imperative voice — “Always …”, “Never …”, “If X then Y”.
Generic — applicable across languages, frameworks, and problem spaces.
Deduplicated & concise — avoid overlaps and verbosity.
Organised — keep alphabetical or logical grouping.

Never create unsolicited new files. Add an instruction file only if the user names it and states its purpose.

3 · Save & Report (chat-only)

Persist edits to the system instruction files.
Reply with:
✅ Instructions updated or ℹ️ No updates required.
The bullet-point Self-Reflection from § 1.

4 · Additional Guarantees

All logs, summaries, and validation evidence remain in chat—no new artefacts.
Use appropriate persistent tracking mechanisms (e.g., TODO.md) only when ongoing, multi-session work requires it; otherwise use inline ✅ / ⚠️ / 🚧 markers.
Do not ask “Would you like me to make this change for you?”. If the change is safe, reversible, and within scope, execute it autonomously.
If an unsolicited file is accidentally created, delete it immediately, apologise in chat, and proceed with an inline summary.

Execute this meta-prompt in full alignment with your operational doctrine.
