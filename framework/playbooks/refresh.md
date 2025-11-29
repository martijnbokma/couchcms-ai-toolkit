# Bug Fix / Root Cause Analysis Playbook

{Replace this line with a concise description of the bug:
- Observed behavior: What is happening?
- Expected behavior: What should happen?
- Error messages: Logs, stack traces, console output
- Context: When does this occur?
- Impact: How severe?}

---

## Mission Briefing

Previous attempts to fix this issue have failed. You will now initiate a **deep diagnostic protocol** focused on identifying and fixing the **absolute root cause**.

**Workflow:** Baseline → Isolate → Analyze → Remediate → Verify → Audit → Report

**Reference Documents:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Smart Operations: `framework/enhancements/smart-operations.md`
- Project Standards: Auto-detected from project

---

## Workflow Phases

### Phase 0: State Baseline
**File:** `framework/playbooks/refresh-phases/baseline.md`

Establish evidence-based baseline of current system state (read-only).

**Quick Actions:**
- Issue context analysis
- Repository state check
- Log analysis
- Code inspection

### Phase 1: Isolate Anomaly
**File:** `framework/playbooks/refresh-phases/isolate.md`

Create minimal, reproducible test case that triggers the bug.

**Quick Actions:**
- Define correct behavior
- Create failing test
- Pinpoint trigger
- Verify reproducibility

### Phase 2: Root Cause Analysis
**File:** `framework/playbooks/refresh-phases/analyze.md`

Methodically investigate to find definitive root cause.

**Quick Actions:**
- Hypothesis testing loop
- Evidence gathering
- RCA techniques
- Document findings

### Phase 3: Remediation
**File:** `framework/playbooks/refresh-phases/remediate.md`

Design and implement minimal, precise fix.

**Quick Actions:**
- Root cause alignment
- Minimal change principle
- Pre-flight checks
- System-wide updates

### Phase 4: Verification
**File:** `framework/playbooks/refresh-phases/verify.md`

Prove fix resolves issue without creating new ones.

**Quick Actions:**
- Confirm fix works
- Run quality gates
- Regression testing
- Edge case verification

### Phase 5: Zero-Trust Audit
**File:** `framework/playbooks/refresh-phases/audit.md`

Fresh evidence-based audit of the fix.

**Quick Actions:**
- Re-verify final state
- Hunt for regressions
- System consistency
- Root cause verification

### Phase 6: Final Report
**File:** `framework/playbooks/refresh-phases/report.md`

After-action report with root cause and evidence.

**Quick Actions:**
- Root cause statement
- Remediation summary
- Verification evidence
- Lessons learned

---

## Quick Reference

**Communication Legend:**
- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 In progress / Active
- ❌ Blocked / Needs attention

**Core Principles:**
- Evidence-based decisions
- Root cause focus (not symptoms)
- Minimal, precise fixes
- Comprehensive verification
- System-wide ownership

**Anti-Patterns (FORBIDDEN):**
- ❌ Fixing without confirmed root cause
- ❌ Patching symptoms (e.g., adding null checks)
- ❌ Re-trying failed fixes without new data
- ❌ Fixing multiple things at once

---

**Ready to begin? Start with Phase 0: State Baseline**
