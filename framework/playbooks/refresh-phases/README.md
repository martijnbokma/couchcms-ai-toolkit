# Refresh Playbook Phases

Modular workflow phases for bug fixing and root cause analysis.

---

## Phase Overview

| Phase | File | Purpose | Duration |
|-------|------|---------|----------|
| **0** | `baseline.md` | Establish system state baseline | 5-10 min |
| **1** | `isolate.md` | Create reproducible test case | 5-10 min |
| **2** | `analyze.md` | Root cause analysis | 10-20 min |
| **3** | `remediate.md` | Design and implement fix | 10-20 min |
| **4** | `verify.md` | Comprehensive verification | 10-15 min |
| **5** | `audit.md` | Fresh evidence-based audit | 5-10 min |
| **6** | `report.md` | After-action report | 5 min |

**Total:** ~50-90 minutes for typical bug fix

---

## Quick Start

1. **Start:** Read `../refresh.md` for overview
2. **Phase 0-6:** Follow each phase sequentially
3. **Done:** Review final report

---

## Phase Details

### Phase 0: Baseline
**Input:** Bug description
**Output:** System state baseline
**Key Actions:**
- Issue context analysis
- Repository state check
- Log analysis
- Code inspection

### Phase 1: Isolate
**Input:** System baseline
**Output:** Reproducible test case
**Key Actions:**
- Define correct behavior
- Create failing test
- Pinpoint trigger
- Verify reproducibility

### Phase 2: Analyze
**Input:** Reproducible test
**Output:** Confirmed root cause
**Key Actions:**
- Hypothesis testing loop
- Evidence gathering
- RCA techniques
- Document findings

### Phase 3: Remediate
**Input:** Root cause
**Output:** Implemented fix
**Key Actions:**
- Design minimal fix
- Apply pre-flight checks
- Update all consumers
- Add regression tests

### Phase 4: Verify
**Input:** Implemented fix
**Output:** Verified fix
**Key Actions:**
- Confirm fix works
- Run quality gates
- Regression testing
- Edge case verification

### Phase 5: Audit
**Input:** Verified fix
**Output:** Fresh audit results
**Key Actions:**
- Re-verify with fresh evidence
- Hunt for regressions
- Verify system consistency
- Check standards compliance

### Phase 6: Report
**Input:** Audit results
**Output:** After-action report
**Key Actions:**
- Document root cause
- Summarize changes
- Provide evidence
- Extract lessons

---

## Design Principles

**Evidence-Based:** All decisions backed by data
**Root Cause Focus:** Fix causes, not symptoms
**Minimal Changes:** Smallest fix that works
**Comprehensive Testing:** Verify thoroughly
**System-Wide:** Update all affected code

---

## Critical Rules

**FORBIDDEN:**
- ❌ Fixing without confirmed root cause
- ❌ Patching symptoms (e.g., null checks)
- ❌ Re-trying failed fixes without new data
- ❌ Fixing multiple things at once

**REQUIRED:**
- ✅ Evidence-based decisions
- ✅ Reproducible test case
- ✅ Root cause identification
- ✅ Comprehensive verification
- ✅ System-wide consistency

---

## File Structure

```
refresh-phases/
├── README.md          # This file
├── baseline.md        # Phase 0
├── isolate.md         # Phase 1
├── analyze.md         # Phase 2
├── remediate.md       # Phase 3
├── verify.md          # Phase 4
├── audit.md           # Phase 5
└── report.md          # Phase 6
```

---

## Usage Tips

**For Simple Bugs:**
- Quick baseline (Phase 0)
- May skip formal test creation if obvious
- Focus on Phases 2-3 (analyze & fix)

**For Complex Bugs:**
- Thorough baseline (Phase 0)
- Always create reproducible test (Phase 1)
- Multiple hypothesis iterations (Phase 2)
- Extensive verification (Phase 4-5)

**For Critical Bugs:**
- Never skip any phase
- Extra thorough in Phase 2 (RCA)
- Extensive regression testing (Phase 4)
- Always do fresh audit (Phase 5)

---

## Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 In progress / Active
- ❌ Blocked / Needs attention

---

**Ready to start? Go to Phase 0: Baseline**
