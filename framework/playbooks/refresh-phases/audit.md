# Phase 5: Zero-Trust Audit

**Goal:** Fresh evidence-based audit. Memory is untrustworthy.

---

## 1. Re-verify Final State

**Fresh git status:**

```bash
# Check git status
git status

# Review changes
git diff

# Verify only intended changes
git diff --stat
```

**File integrity:**

```bash
# Re-read modified files
cat path/to/modified/file1.php
cat path/to/modified/file2.php

# Verify changes are correct
{verification commands}
```

**Service health:**

```bash
# Check service status
{service status commands}

# Verify functionality
{functional tests}

# Check logs for errors
tail -n 50 logs/error.log
```

```markdown
## Fresh Verification

**Git Status:**
✅ Only intended files modified
✅ No unexpected changes

**File Integrity:**
✅ All files in correct state
✅ Changes match plan

**Service Health:**
✅ All services running
✅ No errors in logs
```

---

## 2. Hunt for Regressions

**Test primary workflow:**

```markdown
## Primary Workflow Test

**Workflow:** {description}

**Test Steps:**
1. {Step 1} → ✅ Works
2. {Step 2} → ✅ Works
3. {Step 3} → ✅ Works

**Result:** ✅ Primary workflow intact
```

**Test related workflows:**

```markdown
## Related Workflows

**Workflow 1:** {name}
- Test: {description}
- Result: ✅ Still functional

**Workflow 2:** {name}
- Test: {description}
- Result: ✅ Still functional

**Findings:** ✅ No regressions
```

---

## 3. System-Wide Consistency

**Verify all consumers:**

```bash
# Re-check all consumers
grep -r "component_name" src/

# Verify each consumer
{verification for each}
```

```markdown
## Consumer Verification

**Component:** {name}
**Consumers:** {count}

**Verification:**
- Consumer 1: ✅ Working correctly
- Consumer 2: ✅ Working correctly
- Consumer 3: ✅ Working correctly

**Status:** ✅ All consumers verified
```

---

## 4. Root Cause Verification

**Verify fix addresses root cause:**

```markdown
## Root Cause Check

**Root Cause:**
{Confirmed root cause from Phase 2}

**Fix Verification:**
{How fix addresses root cause}

**Prevention Verification:**
{How recurrence is prevented}

**Test:**
{Test that proves root cause is fixed}

**Result:** ✅ Root cause eliminated
```

---

## 5. Standards Compliance

**Verify standards:**

```markdown
## Standards Compliance

**Coding Standards:**
✅ English-only code
✅ 4-space indentation
✅ Naming conventions followed
✅ Error handling proper

**Documentation:**
✅ Code comments added
✅ Fix documented
✅ Tests documented

**Test Coverage:**
✅ Regression tests added
✅ Edge cases covered
✅ Coverage maintained/improved

**Security:**
✅ No security issues
✅ Input validation proper
✅ Error handling secure
```

---

## 6. Fresh Test Run

**Re-run all tests with fresh evidence:**

```bash
# Clean and re-run
npm run clean
npm install
npm test

# Expected: All pass
```

```markdown
## Fresh Test Results

**Clean Environment:**
✅ Dependencies reinstalled
✅ Build clean

**Test Results:**
✅ All tests pass ({passed}/{total})
✅ No flaky tests
✅ Consistent results

**Quality Gates:**
✅ Linter: Pass
✅ Type checker: Pass
✅ Security: Pass
```

---

## Output: Audit Summary

```markdown
## Zero-Trust Audit Complete

**Fresh Verification:**
✅ Git status clean
✅ Files in correct state
✅ Services healthy

**Regression Hunt:**
✅ Primary workflow works
✅ Related workflows work
✅ No regressions found

**System Consistency:**
✅ All consumers verified
✅ All integration points work
✅ No unexpected side effects

**Root Cause:**
✅ Root cause eliminated
✅ Fix verified effective
✅ Recurrence prevented

**Standards:**
✅ All standards met
✅ Documentation complete
✅ Tests comprehensive

**Fresh Tests:**
✅ All tests pass
✅ Quality gates pass
✅ No issues found

**Critical Issues:** {None / List}

**Status:** ✅ Audit Complete
```

---

**Next:** Phase 6 - Final Report
