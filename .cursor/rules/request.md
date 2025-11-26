---

## 0 · Familiarisation & Mapping

- **Reconnaissance first.** Perform a non-destructive scan of the repository, dependencies, configuration, and runtime substrate to build an evidence-based mental model.
- Produce a brief, ≤ 200-line digest anchoring subsequent decisions.
- **No mutations during this phase.**

---

## 1 · Planning & Clarification

- Restate objectives, success criteria, and constraints.
- Identify potential side-effects, external dependencies, and test coverage gaps.
- Invoke the clarification threshold only if epistemic conflict, missing resources, irreversible jeopardy, or research saturation arises.

---

## 2 · Context Gathering

- Enumerate all artefacts—source, configs, infra manifests, tests, logs—impacted by the request.
- Use the token-aware filtering protocol (head, wc -l, head -c) to responsibly sample large outputs.
- Document scope: modules, services, data flows, and security surfaces.

---

## 3 · Strategy & Core-First Design

- Brainstorm alternatives; justify the chosen path on reliability, maintainability, and alignment with existing patterns.
- Leverage reusable abstractions and adhere to DRY principles.
- Sequence work so that foundational behaviour lands before peripheral optimisation or polish.

---

## 4 · Execution & Implementation

- **Read before write; reread after write.**
- **Command-wrapper mandate:**

    ```bash
    timeout 30s <command> 2>&1 | cat
    ```

    Non-executed illustrative snippets may omit the wrapper if prefixed with `# illustrative only`.

- Use non-interactive flags (`-y`, `--yes`, `--force`) when safe; export `DEBIAN_FRONTEND=noninteractive`.
- Respect chronometric coherence (`TZ='Asia/Jakarta'`) and fail-fast semantics (`set -o errexit -o pipefail`).
- When housekeeping documentation, you may delete or rename obsolete files as long as the action is reversible via version control and the rationale is reported in-chat.
- **Never create unsolicited `.md` files**—summaries and scratch notes stay in chat unless the user explicitly requests the artefact.

---

## 5 · Validation & Autonomous Correction

- Run unit, integration, linter, and static-analysis suites; auto-rectify failures until green or blocked by the clarification threshold.
- Capture fused stdout + stderr and exit codes for every CLI/API invocation.
- After fixes, reread modified artefacts to confirm semantic and syntactic integrity.

---

## 6 · Reporting & Live TODO

- Summarise:
    - **Changes Applied** — code, configs, docs touched
    - **Testing Performed** — suites run and outcomes
    - **Key Decisions** — trade-offs and rationale
    - **Risks & Recommendations** — residual concerns

- Maintain an inline TODO ledger using ✅ / ⚠️ / 🚧 markers for multi-phase work.
- All transient narratives remain in chat; no unsolicited Markdown reports.

---

## 7 · Continuous Improvement & Prospection

- Suggest high-value, non-critical enhancements (performance, security, observability).
- Provide impact estimates and outline next steps.
