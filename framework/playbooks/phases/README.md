# Playbook Phases

Modular workflow phases for intelligent agent orchestration.

---

## Phase Overview

| Phase | File | Purpose | Duration |
|-------|------|---------|----------|
| **-1** | `orchestration.md` | Select agents & define collaboration | 2-5 min |
| **0** | `reconnaissance.md` | Agent domain analysis (read-only) | 5-10 min |
| **1** | `planning.md` | Strategy proposals & integration | 5-10 min |
| **2** | `execution.md` | Coordinated implementation | 15-30 min |
| **3** | `verification.md` | Domain & integration testing | 10-15 min |
| **4** | `audit.md` | Fresh evidence-based audit | 5-10 min |
| **5** | `report.md` | Final report & verdict | 5 min |

**Total:** ~45-85 minutes for typical feature

---

## Quick Start

1. **Start:** Read `../request.md` for overview
2. **Phase -1:** Select your agent team
3. **Phase 0-5:** Follow each phase sequentially
4. **Done:** Review final report

---

## Phase Details

### Phase -1: Orchestration
**Input:** User request
**Output:** Agent team + collaboration workflow
**Key Actions:**
- Analyze domains
- Select 2-6 agents
- Define hand-offs

### Phase 0: Reconnaissance
**Input:** Agent team
**Output:** Domain analysis + impact assessment
**Key Actions:**
- Each agent investigates their domain
- Identify patterns and files
- Synthesize findings

### Phase 1: Planning
**Input:** Reconnaissance findings
**Output:** Unified implementation plan
**Key Actions:**
- Agents propose strategies
- Resolve dependencies
- Integrate into sequence

### Phase 2: Execution
**Input:** Implementation plan
**Output:** Working implementation
**Key Actions:**
- Agents implement sequentially
- Clean hand-offs
- Pre-flight checks

### Phase 3: Verification
**Input:** Implementation
**Output:** Verified system
**Key Actions:**
- Domain quality gates
- Integration testing
- Regression testing

### Phase 4: Audit
**Input:** Verified system
**Output:** Fresh audit results
**Key Actions:**
- Re-verify with fresh evidence
- Hunt for regressions
- Verify consumers

### Phase 5: Report
**Input:** Audit results
**Output:** Final report + verdict
**Key Actions:**
- Document contributions
- Summarize changes
- Provide verdict

---

## Design Principles

**Simple:** Each phase is focused and concise
**Modular:** Phases are independent and reusable
**AI-Optimized:** Clear structure for AI agents
**Maintainable:** Easy to update individual phases
**Efficient:** Minimal overhead, maximum value

---

## File Structure

```
phases/
├── README.md              # This file
├── orchestration.md       # Phase -1
├── reconnaissance.md      # Phase 0
├── planning.md            # Phase 1
├── execution.md           # Phase 2
├── verification.md        # Phase 3
├── audit.md               # Phase 4
└── report.md              # Phase 5
```

---

## Usage Tips

**For Simple Tasks:**
- Skip Phase -1 if only 1-2 agents needed
- Combine Phases 3-4 for quick verification

**For Complex Tasks:**
- Spend extra time in Phase -1 (orchestration)
- Add integration checkpoints in Phase 2
- Extend Phase 3 with more E2E tests

**For Critical Tasks:**
- Never skip Phase 4 (audit)
- Add extra regression tests
- Document all decisions

---

## Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 In progress / Active
- ⏳ Waiting / Queued
- ❌ Blocked / Needs attention

---

**Ready to start? Go to Phase -1: Orchestration**
