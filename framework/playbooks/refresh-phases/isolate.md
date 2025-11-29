# Phase 1: Isolate Anomaly

**Goal:** Create minimal, reproducible test case that reliably triggers the bug.

**Constraint:** NO fixes until you can reproduce reliably.

---

## 1. Define Correctness

**State expected behavior:**

```markdown
## Expected Behavior

**What Should Happen:**
- {Correct behavior description}

**Success Criteria:**
- {How to recognize correct behavior}

**Acceptable Variations:**
- {Any acceptable variations}
```

---

## 2. Create Failing Test

**Write automated test that fails:**

```typescript
// Example test structure
describe('{Component Name}', () => {
    it('should {expected behavior}', () => {
        // Arrange: Set up minimal conditions
        const input = {test data};
        
        // Act: Trigger the bug
        const result = functionThatFails(input);
        
        // Assert: Verify expected behavior
        expect(result).toBe({expected value});
        // ❌ This currently fails
    });
});
```

**Test Requirements:**
- ✅ Minimal (tests only failing behavior)
- ✅ Reproducible (fails consistently)
- ✅ Isolated (no external dependencies)
- ✅ Descriptive (clear test name)

---

## 3. Pinpoint the Trigger

**Identify exact conditions:**

```markdown
## Trigger Conditions

**Required Conditions:**
- Condition 1: {description}
- Condition 2: {description}

**Input Data:**
- Input 1: {specific value}
- Input 2: {specific value}

**Sequence:**
1. {First action}
2. {Second action}
3. {Bug occurs}

**State Requirements:**
- System state: {description}
- User state: {description}
```

---

## 4. Reproducibility Verification

**Verify reliable reproduction:**

```bash
# Run test multiple times
npm test -- {test-name} --repeat 10

# Expected: Fails 10/10 times
```

**Verification Checklist:**
```markdown
## Reproducibility

**Reproduction Steps:**
1. {Step 1}
2. {Step 2}
3. {Bug appears}

**Success Rate:** {must be 100%}

**Variations Tested:**
- Variation 1: {result}
- Variation 2: {result}

**Edge Cases:**
- Edge case 1: {result}
- Edge case 2: {result}

**Status:** ✅ Reliably reproducible
```

---

## Output: Isolated Test Case

```markdown
## Isolated Bug

**Test Case:**
- File: {test file path}
- Test name: {test name}
- Status: ❌ Fails consistently

**Trigger:**
- Conditions: {list}
- Input: {specific data}
- Sequence: {steps}

**Reproducibility:** 100%

**Ready for RCA:** ✅
```

---

**FORBIDDEN:**
- ❌ Attempting fixes before reliable reproduction
- ❌ Assuming cause without evidence

**REQUIRED:**
- ✅ Document exact reproduction steps
- ✅ Create automated test if possible

---

**Next:** Phase 2 - Root Cause Analysis
