# AAPF Framework - Test Guide

**Before Integration**: Evaluate if the AAPF framework adds value to your workflow.

## What is AAPF?

The **Autonomous Agent Prompting Framework** transforms AI agents from simple command executors into disciplined, evidence-first engineers that:

- **Research before acting** - Never assume, always verify
- **Own the entire system** - Fix all related issues, not just the immediate task
- **Work autonomously** - Self-sufficient with minimal escalation
- **Verify rigorously** - Test, audit, prove correctness
- **Learn continuously** - Reflect and improve over time

## Test Scenarios

### Scenario 1: Feature Development (REQUEST Playbook)

**Task**: Add a new "favorite projects" feature to the student portfolio.

**Without AAPF** (typical approach):

```
"Add a favorite projects feature where students can mark projects as favorites"
```

→ AI makes assumptions, might miss edge cases, limited verification

**With AAPF REQUEST Playbook**:

```
Add a new "favorite projects" feature where students can mark up to 5 projects
as favorites, displayed prominently on their profile page.

---

Follow the REQUEST playbook from the AAPF framework:

Phase 0: Reconnaissance & Mental Modeling (Read-Only)
- Scan the project structure
- Identify existing favorite/bookmark patterns
- Understand database schema and relationships
- Document findings in a digest

Phase 1: Planning & Strategy
- Enumerate all affected files and components
- Plan database changes, API endpoints, UI components
- Justify technical decisions

Phase 2: Execution & Implementation
- Execute incrementally with read-write-reread protocol
- Update all consumers of modified components
- Keep workspace clean (no temp files)

Phase 3: Verification & Autonomous Correction
- Run all tests (unit, integration, feature)
- Fix any failures autonomously
- Test end-to-end user workflow

Phase 4: Mandatory Zero-Trust Self-Audit
- Fresh verification of final state
- Hunt for regressions in related features
- Confirm system-wide consistency

Phase 5: Final Report & Verdict
- List all changes with verification evidence
- Final verdict: success or critical issue found

Use status markers: ✅ (success) ⚠️ (fixed issue) 🚧 (blocked)
```

**Expected Behavior**:

- Agent performs thorough reconnaissance first
- Provides detailed plan BEFORE coding
- Explicitly lists ALL affected files
- Tests automatically after changes
- Conducts self-audit at the end
- Presents evidence for all claims

**Evaluation Questions**:

- ✅ Did the agent discover existing patterns before creating new ones?
- ✅ Did it identify ALL files that need updates (views, forms, database)?
- ✅ Did it run tests autonomously without being asked?
- ✅ Did the self-audit catch any issues you might have missed?

---

### Scenario 2: Bug Fixing (REFRESH Playbook)

**Task**: Fix a persistent bug where series episode thumbnails don't load correctly.

**Without AAPF** (typical approach):

```
"The series episode thumbnails aren't loading, can you fix it?"
```

→ AI might apply quick patches without finding root cause

**With AAPF REFRESH Playbook**:

```
Series episode thumbnails are not loading correctly. Users see broken image
icons instead of episode posters. This happens intermittently - sometimes
the first episode loads but others don't.

---

Follow the REFRESH playbook from the AAPF framework:

Phase 0: Reconnaissance & State Baseline (Read-Only)
- Scan logs, database, file system
- Document current state as it relates to the bug
- No changes during this phase

Phase 1: Isolate the Anomaly
- Create minimal reproducible test case
- Write a failing test that triggers the bug
- Identify exact conditions that cause failure

Phase 2: Root Cause Analysis (RCA)
- Formulate testable hypothesis
- Design experiments to prove/disprove
- Execute experiments, present evidence
- Repeat until root cause is proven

Phase 3: Remediation
- Design minimal, precise fix for root cause
- Apply read-write-reread protocol
- Fix all consumers with same flaw

Phase 4: Verification & Regression Guard
- Confirm the failing test now passes
- Run full test suite
- Autonomously fix any new failures

Phase 5: Mandatory Zero-Trust Self-Audit
- Re-verify with fresh commands
- Test primary workflow of fixed component

Phase 6: Final Report & Verdict
- State definitive root cause with evidence
- List remediation applied
- Provide proof of fix and no regressions

FORBIDDEN: Patching symptoms, re-trying failed fixes, applying fixes without
proven root cause.
```

**Expected Behavior**:

- Agent investigates systematically, not randomly
- Creates reproducible test case
- Uses hypothesis-experiment-conclusion loop
- Identifies THE root cause, not just symptoms
- Fixes comprehensively, not just the visible issue

**Evaluation Questions**:

- ✅ Did the agent find the actual root cause?
- ✅ Did it avoid patching symptoms (like adding null checks without understanding why)?
- ✅ Did the fix prevent the issue from happening again?
- ✅ Did it check if other components have the same flaw?

---

### Scenario 3: Session Learning (RETRO Playbook)

**Task**: After completing a complex refactoring session.

**Without AAPF** (typical approach):

```
"Thanks, that looks good!"
```

→ No learning captured, same mistakes might repeat

**With AAPF RETRO Playbook**:

```
Follow the RETRO playbook to analyze this refactoring session:

Objectives:
1. Identify durable lessons learned
2. Extract universal, tool-agnostic principles
3. Propose updates to operational doctrine if warranted

Focus on:
- What patterns worked well?
- What assumptions were wrong?
- What should be different next time?
- What principle would prevent this class of issue?

Abstract specifics into universal rules.
```

**Expected Behavior**:

- Agent reflects on the session
- Identifies patterns beyond this specific task
- Proposes concrete improvements to its own rules
- Distinguishes project-specific from universal lessons

**Evaluation Questions**:

- ✅ Did the agent identify useful patterns?
- ✅ Are the proposed principles actionable?
- ✅ Would these rules help in future sessions?

---

## Quick Test: Compare Approaches

Pick any simple task and try both approaches:

### Task: "Add a field to track project completion percentage"

**Standard Approach** (no playbook):

```
Add a completion percentage field (0-100) to projects
```

**AAPF Approach** (with REQUEST playbook):

```
Add a completion percentage field (0-100) to projects, visible in the
project card and detailed view.

Follow the REQUEST playbook (abbreviated):
- Phase 0: Investigate existing project schema
- Phase 1: Plan database, backend, frontend changes
- Phase 2: Execute with verification at each step
- Phase 3: Test automatically
- Phase 4: Self-audit
- Phase 5: Report with evidence
```

**Compare Results**:
| Aspect | Standard | AAPF |
|--------|----------|------|
| Planning | Minimal | Detailed upfront |
| Verification | Manual | Automatic |
| Scope | Might miss consumers | Identifies all affected files |
| Testing | If you ask | Always runs tests |
| Confidence | "Looks good" | Evidence-based proof |

---

## Evaluation Criteria

After testing 2-3 scenarios, evaluate:

### ✅ Framework is Valuable If:

- Agent's upfront planning saves debugging time later
- Self-audits catch issues you would have missed
- Systematic approach reduces back-and-forth
- Evidence-based reporting increases confidence
- You appreciate structured, predictable behavior

### ❌ Framework Might Be Overkill If:

- Most tasks are simple one-liners
- You prefer exploratory, interactive sessions
- Structured approach feels too rigid
- Output verbosity is distracting
- You rarely need comprehensive verification

---

## What to Look For

### Good Signs (Framework Working)

✅ **Phase 0 saves time**: Agent discovers existing patterns before creating duplicates
✅ **Phase 1 prevents mistakes**: Comprehensive plan catches scope issues early
✅ **Phase 3 increases quality**: Automatic testing finds bugs you'd miss
✅ **Phase 4 builds confidence**: Self-audit proves correctness with fresh evidence
✅ **Status markers are helpful**: ✅ ⚠️ 🚧 make progress scannable

### Red Flags (Framework Not Working)

❌ **Too verbose**: Agent writes essays instead of working
❌ **False structure**: Going through motions without real investigation
❌ **Over-engineering**: Simple tasks become complicated
❌ **Rigid adherence**: Framework prevents flexible problem-solving
❌ **Fake evidence**: Claims without actual verification

---

## After Testing

### If Framework is Valuable

**Next Steps**:

1. Run `bun run sync` to integrate AAPF into toolkit
2. Add `framework: true` to `project.md`
3. AAPF doctrine automatically included in `.cursorrules`
4. Playbooks remain available for manual use
5. Document your preferred workflow patterns

### If Framework Needs Adjustment

**Options**:

1. Use only specific playbooks (e.g., REFRESH for bugs only)
2. Apply CONCISE directive to reduce verbosity
3. Modify playbooks for your specific needs
4. Keep framework available but not default

### If Framework Isn't Helpful

**Alternative**:

- Keep framework in toolkit for reference
- Use playbooks occasionally for complex tasks
- Don't integrate into default workflow
- Credits and attribution remain in place

---

## Example Test Session

### Real Test You Can Run Now

```
TASK: Add a "Last Updated" timestamp to project cards

WITHOUT AAPF:
Just ask: "Add a last updated timestamp to project cards"

WITH AAPF:
Paste this:
---
Add a "Last Updated" timestamp to project cards showing when the
project was last modified. Format as "2 days ago" style.

Follow REQUEST playbook:
Phase 0: Check existing date handling patterns
Phase 1: Plan database query, formatting, UI placement
Phase 2: Implement with verification
Phase 3: Test automatically
Phase 4: Self-audit
Phase 5: Report with evidence
---
```

**Compare**:

- Time to completion
- Quality of result
- Issues caught
- Your confidence level
- Helpful vs distracting

---

## Ready to Decide?

After testing:

✅ **Integrate Fully**: `framework: true` in project.md → automatic loading
📚 **Reference Only**: Add docs to README → manual usage when needed
⏸️ **Maybe Later**: Keep files, no integration, revisit in future

**Questions? Issues?**

See:

- `ATTRIBUTION.md` - Credits and sync process
- `00-cursor-ai-prompting-rules.md` - Framework overview
- `01-core.md` - Complete operational doctrine
- Original source: https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e
