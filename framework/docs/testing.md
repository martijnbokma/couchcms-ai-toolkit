# AAPF Framework - Test Guide

**Purpose:** Evaluate if the AAPF framework adds value to your workflow before full integration.

**Status:** This guide has been updated to reflect the current framework structure and toolkit integration.

---

## What is AAPF?

The **Autonomous Agent Prompting Framework** transforms AI agents from simple command executors into disciplined, evidence-first engineers that:

- **Research before acting** - Never assume, always verify (8-point reconnaissance checklist)
- **Own the entire system** - Fix all related issues, update all consumers, maintain consistency
- **Work autonomously** - Self-sufficient with minimal escalation (4 clarification thresholds)
- **Verify rigorously** - Test, audit, prove correctness (mandatory zero-trust self-audit)
- **Learn continuously** - Reflect and improve over time (doctrine evolution)

**Enhanced Features:**
- **Smart Operations:** Slash commands, intent detection, pre-flight checks
- **Project Standards Integration:** Automatic compliance checking
- **Context Loading:** Auto-activate relevant agents/modules
- **After-Action Suggestions:** Proactive improvements

**Reference:** See `framework/README.md` for complete framework overview.

## Test Scenarios

### Scenario 1: Feature Development (REQUEST Playbook)

**Task**: Add a new "favorite projects" feature to the student portfolio.

**Without AAPF** (typical approach):

```
"Add a favorite projects feature where students can mark projects as favorites"
```

→ AI makes assumptions, might miss edge cases, limited verification, incomplete scope

**With AAPF REQUEST Playbook**:

```
Add a new "favorite projects" feature where students can mark up to 5 projects
as favorites, displayed prominently on their profile page. The favorites should
persist across sessions and be visible in the project list view.

---

Follow the REQUEST playbook from framework/playbooks/request.md:

Phase 0: Reconnaissance & Mental Modeling (Read-Only)
- Repository inventory (languages, frameworks, structure)
- Dependency topology (database, libraries)
- Configuration corpus (environment, build processes)
- Idiomatic patterns (existing favorite/bookmark patterns)
- Operational substrate (runtime requirements)
- Quality gates (test suites, linters)
- Project standards & toolkit (active agents, modules)
- Reconnaissance digest (≤ 200 lines)

Phase 1: Planning & Strategy
- Restate objectives (primary goal, success metrics, acceptance criteria)
- Identify full impact surface (direct, indirect, system-wide)
- Justify strategy (technical approach, rationale, alternatives)
- Smart Operations integration (slash commands, pre-flight checks, agents)

Phase 2: Execution & Implementation
- Read-write-reread pattern (non-negotiable)
- Command execution canon (timeout, safety, fail-fast)
- Workspace purity (no unsolicited files)
- System-wide ownership (update ALL consumers)
- Pre-flight checks (before each modification)
- Implementation checklist

Phase 3: Verification & Autonomous Correction
- Quality gates execution (linters, type checkers, tests)
- Autonomous correction protocol
- End-to-end testing
- Integration verification

Phase 4: Mandatory Zero-Trust Self-Audit
- Re-verify final state (git status, file integrity, service health)
- Hunt for regressions (test related features)
- Confirm system-wide consistency (all consumers verified)
- Standards compliance check

Phase 5: Final Report & Verdict
- Changes applied (files created/modified)
- Verification evidence (test outputs, quality gates)
- System-wide impact statement
- Lessons learned
- Final verdict (success or critical issue)

Use status markers: ✅ (success) ⚠️ (self-corrected) 🚧 (blocked) 💡 (suggestion)
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

→ AI might apply quick patches without finding root cause, might miss similar issues

**With AAPF REFRESH Playbook**:

```
Series episode thumbnails are not loading correctly. Users see broken image
icons instead of episode posters. This happens intermittently - sometimes
the first episode loads but others don't. Error logs show 404s for some
thumbnail URLs.

Observed: Broken image icons, 404 errors in logs
Expected: All episode thumbnails load correctly
Context: Only affects series episodes, not films or podcasts
Impact: High - affects user experience on series detail pages

---

Follow the REFRESH playbook from framework/playbooks/refresh.md:

Phase 0: Reconnaissance & State Baseline (Read-Only)
- Issue context analysis (symptoms, affected components)
- Repository state (Git history, recent changes)
- Runtime environment (configuration, dependencies)
- Configuration analysis (settings, environment variables)
- Log analysis (error patterns, timing)
- Code inspection (relevant files, error handling)
- Smart Operations context (applicable commands, agents)
- State baseline digest (≤ 200 lines)

Phase 1: Isolate the Anomaly
- Define correctness (expected behavior, success criteria)
- Create failing test (minimal, reproducible, isolated)
- Pinpoint trigger (conditions, inputs, sequence)
- Reproducibility verification (100% success rate required)

Phase 2: Root Cause Analysis (RCA)
- Hypothesis testing loop (formulate → experiment → conclude → iterate)
- RCA techniques (code tracing, log analysis, state inspection)
- Evidence-based conclusions (data, logs, reproducible tests)
- Anti-patterns (no symptom patching, no assumptions)

Phase 3: Remediation
- Root cause alignment (fix addresses THE cause)
- Minimal change principle (smallest change that fixes)
- Durability (prevents recurrence)
- Read-write-reread protocol
- System-wide ownership (fix ALL consumers)
- Pre-flight checks

Phase 4: Verification & Regression Guard
- Confirm fix (original test passes)
- Full quality gates (all tests, linters)
- Regression testing (related functionality)
- Autonomous correction (fix new failures)
- Edge case verification

Phase 5: Mandatory Zero-Trust Self-Audit
- Re-verify final state (git, files, services)
- Hunt for regressions (primary workflow)
- Confirm system-wide consistency (all consumers)
- Root cause verification (fix actually addresses cause)
- Standards compliance check

Phase 6: Final Report & Verdict
- Root cause (definitive statement with evidence)
- Remediation (all changes applied)
- Verification evidence (test outputs, quality gates)
- System-wide impact statement
- Lessons learned
- Final verdict (success or critical issue)

FORBIDDEN: Patching symptoms, re-trying failed fixes, applying fixes without
proven root cause, fixing multiple things at once.
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

→ No learning captured, same mistakes might repeat, no doctrine evolution

**With AAPF RETRO Playbook**:

```
Session: Refactoring authentication system to use new patterns
Date: 2025-01-26
Type: Refactoring
Status: ✅ Complete

---

Follow the RETRO playbook from framework/playbooks/retro.md:

Phase 0: Session Context & Objectives
- Session metadata (date, type, mission, status)
- Initial objectives (primary, secondary)

Phase 1: Success Pattern Analysis
- What worked exceptionally well (patterns, techniques, approaches)
- Durable lessons (project-specific and universal)

Phase 2: Failure Pattern Analysis
- What failed and why (failures, corrections, root causes)
- Correction patterns (how failures were corrected)

Phase 3: Quantitative Impact Assessment
- Metrics (files modified, created, documentation, tests)
- Quality indicators (what worked, what failed, final state)

Phase 4: Doctrine Integration Plan
- Standards updates required (current state, proposed update, rationale, severity)
- Pre-flight checks updates (new patterns to catch)
- Smart Operations integration (new commands, intent patterns)

Phase 5: Meta-Learning & Process Evolution
- Decision frameworks established
- Process maturation (before/after comparison)
- Balance points discovered (principle tensions resolved)

Phase 6: Integration & Propagation
- Standards update execution (target files, update plan)
- Agent configuration sync (status, configurations, sync command)

Phase 7: Final Verdict & Future Readiness
- Doctrine evolution status
- Future mission readiness (benefits for future sessions)
- Final statement (complete or blocked)
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

1. **Enable Framework:**
   ```yaml
   # In standards.md or project.md
   framework: true
   ```

2. **Sync Configurations:**
   ```bash
   bun scripts/sync.js
   ```

3. **Verify Integration:**
   - Check `.cursorrules` includes framework
   - Verify `CLAUDE.md` has framework content
   - Confirm all agent configs are updated

4. **Start Using:**
   - Use playbooks for structured workflows
   - Leverage slash commands for quick tasks
   - Use `/retro` command for session reflection

5. **Document Preferences:**
   - Note which playbooks work best for your workflow
   - Document any customizations made
   - Share learnings with team

### If Framework Needs Adjustment

**Options**:

1. **Selective Integration:**
   ```yaml
   framework:
     doctrine: true
     directives: true
     playbooks: false  # Manual use only
     enhancements: false  # Skip Smart Operations
   ```

2. **Customize Playbooks:**
   - Modify playbooks for your specific needs
   - Add project-specific phases
   - Adjust verbosity levels

3. **Communication Modes:**
   - Use `/quick` mode to reduce verbosity
   - Use `/verbose` mode for learning sessions
   - Default to `/standard` for balanced interaction

4. **Pre-Flight Checks:**
   - Customize `preflight-checks.yaml` for your needs
   - Add project-specific checks
   - Adjust severity levels

### If Framework Isn't Helpful

**Alternative**:

- Keep framework in toolkit for reference
- Use playbooks occasionally for complex tasks
- Don't integrate into default workflow
- Credits and attribution remain in place

---

## Example Test Session

### Real Test You Can Run Now

**Task:** Add a "Last Updated" timestamp to project cards

**Without AAPF:**
```
Add a last updated timestamp to project cards
```

**With AAPF (REQUEST Playbook):**
```
Add a "Last Updated" timestamp to project cards showing when the
project was last modified. Format as "2 days ago" style. Should be
visible on both list and detail views.

---

Follow framework/playbooks/request.md:

[Copy full playbook content, replace placeholder with above description]
```

**Compare Results:**

| Aspect | Without AAPF | With AAPF |
|--------|--------------|-----------|
| **Planning** | Minimal | Detailed upfront (all files identified) |
| **Verification** | Manual | Automatic (quality gates run) |
| **Scope** | Might miss consumers | Identifies ALL affected files |
| **Testing** | If you ask | Always runs tests autonomously |
| **Confidence** | "Looks good" | Evidence-based proof |
| **Regressions** | Might miss | Self-audit catches issues |
| **Documentation** | Often skipped | Updated automatically |

---

## Ready to Decide?

After testing 2-3 scenarios, evaluate:

✅ **Integrate Fully:**
```yaml
# In standards.md or project.md
framework: true
```
Then run: `bun scripts/sync.js`

📚 **Reference Only:**
- Keep framework available
- Use playbooks manually when needed
- Don't auto-load in agent configs

⏸️ **Maybe Later:**
- Keep files in toolkit
- Revisit after more experience
- No integration yet

---

## Questions? Issues?

**Framework Documentation:**
- `framework/README.md` - Complete framework overview
- `framework/doctrine/operational-doctrine.md` - Core principles
- `framework/enhancements/smart-operations.md` - Smart Operations reference
- `framework/ATTRIBUTION.md` - Credits and sync status

**Toolkit Documentation:**
- `docs/GETTING-STARTED.md` - Toolkit setup
- `docs/MODULES.md` - Knowledge modules
- `docs/AGENTS.md` - Specialized agents
- `docs/COMMANDS.md` - Available commands

**Original AAPF Source:**
- Original Gist: https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e
- Author: aashari (https://github.com/aashari)

---

**Test the framework, evaluate the results, and decide what works best for your workflow.**
