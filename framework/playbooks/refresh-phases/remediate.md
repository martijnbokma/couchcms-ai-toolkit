# Phase 3: Remediation

**Goal:** Design and implement minimal, precise fix for root cause.

---

## 1. Fix Design

### Root Cause Alignment

```markdown
## Fix Strategy

**Root Cause:**
{Confirmed root cause from Phase 2}

**Fix Approach:**
{How the fix addresses the root cause}

**Prevention:**
{How the fix prevents recurrence}
```

### Minimal Change Principle

```markdown
## Minimal Fix

**Scope:**
{What exactly will be changed}

**Justification:**
{Why this is the minimal necessary change}

**Alternatives Considered:**
- Alternative 1: {why rejected}
- Alternative 2: {why rejected}
```

### Durability

```markdown
## Hardening

**Safeguards Added:**
- Safeguard 1: {description}
- Safeguard 2: {description}

**Validation:**
{How recurrence will be prevented}

**Monitoring:**
{How to detect if issue returns}
```

---

## 2. Implementation

### Read-Write-Reread Pattern

For every file:
1. **Read** file before changes
2. **Write** modifications
3. **Reread** to verify

### Pre-Flight Checks

Before applying changes:
```bash
# Scan generated code
# Check against preflight-checks.yaml
```

**Actions:**
- STOP on CRITICAL
- WARN on WARNING
- INFO on INFO
- Apply auto-fixes

### Standards Compliance

- ✅ English-only code
- ✅ 4-space indentation
- ✅ Proper error handling
- ✅ Follow project patterns

---

## 3. System-Wide Updates

**If root cause is in shared component:**

### Identify All Consumers

```bash
# Find all usages
grep -r "component_name" src/

# List all consumers
{list of files using the component}
```

### Update All Consumers

```markdown
## Consumer Updates

**Consumers Found:** {count}

**Updates:**
- Consumer 1: {file} → {change}
- Consumer 2: {file} → {change}
- Consumer 3: {file} → {change}

**Verification:**
✅ All consumers updated
✅ Consistency verified
```

---

## 4. Test Updates

**Add/update tests:**

```typescript
// Regression test
describe('{Component}', () => {
    it('should not {bug behavior}', () => {
        // Test that bug is fixed
        const result = fixedFunction(input);
        expect(result).toBe(expectedValue);
        // ✅ This should now pass
    });
    
    it('should prevent {root cause}', () => {
        // Test that root cause is prevented
        const result = fixedFunction(edgeCaseInput);
        expect(result).not.toThrow();
        // ✅ Safeguard test
    });
});
```

---

## 5. Documentation

**Document the fix:**

```markdown
## Fix Documentation

**Files Modified:**
- {file 1}: {what changed and why}
- {file 2}: {what changed and why}

**Tests Added:**
- {test 1}: {what it tests}
- {test 2}: {what it tests}

**Root Cause:**
{Brief explanation}

**Fix:**
{Brief explanation of fix}

**Prevention:**
{How recurrence is prevented}
```

---

## Implementation Checklist

**Before applying fix:**
- [ ] Fix addresses confirmed root cause
- [ ] Minimal change principle applied
- [ ] Pre-flight checks executed
- [ ] Standards compliance verified
- [ ] All consumers identified
- [ ] Tests added/updated
- [ ] Documentation updated

**During implementation:**
- [ ] Read-write-reread pattern followed
- [ ] English-only code
- [ ] Proper error handling
- [ ] No new warnings introduced

**After implementation:**
- [ ] All consumers updated
- [ ] Consistency verified
- [ ] Ready for verification

---

## Progress Tracking

```markdown
## Remediation Progress

**Fix Design:** ✅ Complete
**Implementation:** 🚧 In progress
- ✅ Core fix applied
- ✅ Consumer 1 updated
- [ ] Consumer 2 updating
**Testing:** ⏳ Waiting
**Documentation:** ⏳ Waiting
```

---

**Next:** Phase 4 - Verification
