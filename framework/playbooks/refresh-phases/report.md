# Phase 6: Final Report

**Goal:** After-action report with root cause and evidence.

---

## 1. Root Cause

**Definitive statement:**

```markdown
## Root Cause Identified

**THE Root Cause:**
{Clear, definitive statement of the underlying issue}

**Key Evidence:**
{The critical evidence that identified the root cause}

**Causal Mechanism:**
{How the root cause led to the bug}

**Why Previous Fixes Failed:**
{Why symptom patches didn't work}

**Why This Fix Works:**
{How this fix addresses the root cause}
```

---

## 2. Remediation

**Comprehensive change list:**

```markdown
## Changes Applied

**Files Modified:**
- `path/to/file1.php`
  Change: {what changed}
  Reason: {why changed}
  Lines: {line numbers}

- `path/to/file2.ts`
  Change: {what changed}
  Reason: {why changed}
  Lines: {line numbers}

**Files Created:**
- `test/file1.test.ts`
  Purpose: {regression test}
  Coverage: {what it tests}

**Tests Added/Updated:**
- Test 1: {description}
- Test 2: {description}

**Configuration Changes:**
{Any config changes}

**Documentation Updates:**
{Any docs updated}
```

---

## 3. Verification Evidence

**Proof of fix:**

```markdown
## Verification Evidence

**Original Bug Fix:**
```bash
# Original failing test now passes
npm test -- {test-name}
# Output: ✅ PASS
```

**Quality Gates:**
```bash
# Full test suite
npm test
# Output: {passed}/{total} tests passed

# Linter
npm run lint
# Output: No errors

# Type checker
tsc --noEmit
# Output: No errors
```

**Regression Tests:**
```bash
# Related functionality
npm test -- {related-tests}
# Output: All pass
```

**Manual Verification:**
- Workflow 1: ✅ Tested and working
- Workflow 2: ✅ Tested and working
- Edge cases: ✅ All handled correctly
```

---

## 4. System-Wide Impact

```markdown
## System Impact

**Dependencies Verified:**
✅ Component 1: Compatible
✅ Component 2: Compatible
✅ External service: Compatible

**Consumers Updated:**
✅ Consumer 1: Updated and verified
✅ Consumer 2: Updated and verified
✅ Consumer 3: No changes needed

**Integration Points:**
✅ Integration 1: Tested and working
✅ Integration 2: Tested and working

**Breaking Changes:**
{None / List with migration notes}

**Performance Impact:**
{None / Improved / Details}
```

---

## 5. Lessons Learned

```markdown
## Insights

**Technical Insights:**
- Insight 1: {key learning about codebase}
- Insight 2: {architectural understanding}
- Insight 3: {pattern discovered}

**Process Insights:**
- What worked: {debugging technique}
- What didn't: {approach that failed}
- Improvement: {process improvement}

**Prevention Measures:**
- Measure 1: {how to prevent similar issues}
- Measure 2: {monitoring to add}
- Measure 3: {test to add}

**Future Considerations:**
- Watch for: {potential related issues}
- Monitor: {metrics to track}
- Document: {patterns to document}
```

---

## 6. Diagnostic Artifacts

```markdown
## Evidence Collected

**Logs:**
- Location: {log file paths}
- Key findings: {summary}

**Error Messages:**
```
{Full error messages captured}
```

**Stack Traces:**
```
{Stack traces if applicable}
```

**Test Outputs:**
- Before fix: {failing test output}
- After fix: {passing test output}

**Commands Executed:**
```bash
# Key diagnostic commands
{command 1}
{command 2}
```
```

---

## Final Verdict

**Success:**
```markdown
## Mission Complete

**Root Cause:** Eliminated
**System State:** Verified and consistent
**Regressions:** None identified
**Quality Gates:** All passed
**Documentation:** Complete

✅ Self-Audit Complete
✅ Root cause addressed
✅ System restored
✅ Mission accomplished 🎖️
```

**Critical Issue (if found):**
```markdown
## CRITICAL ISSUE FOUND

**Issue:** {description}
**Discovered During:** {audit phase}
**Impact:** {severity}
**Root Cause:** {analysis}

**Immediate Actions Required:**
1. {Diagnostic step}
2. {Remediation approach}
3. {Verification method}

❌ Halting work pending resolution
```

---

## Summary

```markdown
## Quick Summary

**Bug:** {one-line description}
**Root Cause:** {one-line cause}
**Fix:** {one-line fix}
**Status:** ✅ Complete

**Files Changed:** {count}
**Tests Added:** {count}
**Duration:** {time spent}
```

---

**Mission Complete. Root Cause Eliminated. System Restored.** 🎖️
