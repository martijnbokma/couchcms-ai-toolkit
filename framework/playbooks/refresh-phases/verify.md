# Phase 4: Verification

**Goal:** Prove fix resolves issue without creating new ones.

---

## 1. Confirm the Fix

**Re-run the failing test from Phase 1:**

```bash
# Run the specific test that was failing
npm test -- {test-name}

# Expected: ✅ PASS
```

```markdown
## Fix Confirmation

**Original Test:** {test name from Phase 1}
**Result:** ✅ PASS
**Verification:** Issue is resolved

**Before:** ❌ Test failed with {error}
**After:** ✅ Test passes
```

---

## 2. Run Full Quality Gates

### Test Suites

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests (if applicable)
npm run test:e2e
```

### Quality Checks

```bash
# Linters
npm run lint

# Type checking
tsc --noEmit

# Security scan (if applicable)
npm audit
```

```markdown
## Quality Gates

**Test Suites:**
✅ Unit tests: {passed/total}
✅ Integration tests: {passed/total}
✅ E2E tests: {passed/total}

**Quality Checks:**
✅ Linter: No errors
✅ Type checker: No errors
✅ Security: No vulnerabilities

**Code Coverage:** {if applicable}
```

---

## 3. Regression Testing

**Test related functionality:**

```markdown
## Regression Tests

**Related Features Tested:**
- Feature 1: ✅ Still works
- Feature 2: ✅ Still works
- Feature 3: ✅ Still works

**Test Procedures:**
- Test 1: {description} → ✅ Pass
- Test 2: {description} → ✅ Pass

**Observations:**
{Any unexpected behavior or notes}
```

---

## 4. Autonomous Correction

**If fix introduces new failures:**

```markdown
## New Failure Detected

**Failure:** {description}
**Root Cause:** {why it failed}
**Fix:** {how to fix}

[Apply correction]

**Verification:**
✅ Correction applied
✅ All gates now pass
```

---

## 5. Edge Case Verification

**Test boundary conditions:**

```bash
# Test edge cases
npm test -- {edge-case-tests}
```

```markdown
## Edge Cases

**Cases Tested:**
- Empty input: ✅ Handled correctly
- Null values: ✅ Handled correctly
- Maximum values: ✅ Handled correctly
- Minimum values: ✅ Handled correctly
- Invalid input: ✅ Error handled properly

**Additional Safeguards:**
{Any safeguards added during testing}
```

---

## 6. Performance Verification

**If performance-related:**

```bash
# Run performance tests
npm run test:perf

# Check metrics
{performance metrics}
```

```markdown
## Performance

**Before Fix:**
- Metric 1: {value}
- Metric 2: {value}

**After Fix:**
- Metric 1: {value}
- Metric 2: {value}

**Impact:** {improved/same/degraded}
```

---

## Output: Verification Summary

```markdown
## Verification Complete

**Original Bug:**
✅ Fixed and verified

**Quality Gates:**
✅ All tests pass ({passed}/{total})
✅ All linters pass
✅ All type checks pass
✅ No security issues

**Regression Testing:**
✅ No regressions detected
✅ All related features work

**Edge Cases:**
✅ All edge cases handled

**New Issues:**
{None / List with resolutions}

**Status:** ✅ Ready for Audit
```

---

**Next:** Phase 5 - Zero-Trust Audit
