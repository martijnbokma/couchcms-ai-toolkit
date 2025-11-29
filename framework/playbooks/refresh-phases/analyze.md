# Phase 2: Root Cause Analysis

**Goal:** Methodically investigate to find definitive root cause.

**Approach:** Hypothesis testing with evidence gathering.

---

## Hypothesis Testing Loop

**For each hypothesis:**

### 1. Formulate Hypothesis

```markdown
## Hypothesis {number}

**Theory:**
{Clear statement of what you think is causing the bug}

**Rationale:**
{Why this hypothesis is plausible based on evidence}

**Testability:**
{How this can be tested or verified}
```

**Example:**
```markdown
## Hypothesis 1

**Theory:**
User authentication token expires prematurely due to incorrect
timezone handling in expiration calculation.

**Rationale:**
Issue occurs at specific times of day, suggesting time-based
calculation problem.

**Testability:**
Compare token expiration timestamps with system time and
timezone settings.
```

---

### 2. Devise Experiment

```markdown
## Experiment Design

**What to Test:**
{Specific test or observation}

**Expected Evidence:**
- If hypothesis is TRUE: {what you'd see}
- If hypothesis is FALSE: {what you'd see}

**Safety Measures:**
{How to ensure no data loss or damage}

**Success Criteria:**
{How to interpret results}
```

---

### 3. Execute & Conclude

```bash
# Run experiment
{commands or code to test hypothesis}
```

```markdown
## Results

**Evidence Collected:**
{Data, logs, observations}

**Analysis:**
{What the evidence means}

**Conclusion:**
- ✅ Hypothesis PROVEN
- ❌ Hypothesis DISPROVEN
- ⚠️ Hypothesis needs refinement
```

---

### 4. Iterate if Needed

If hypothesis is wrong:
- Formulate new hypothesis based on evidence
- Repeat testing loop
- Document why previous hypothesis was incorrect

---

## RCA Techniques

**Apply appropriate methods:**

### Code Tracing
```bash
# Follow execution path
# Add strategic logging
# Trace function calls
```

### Log Analysis
```bash
# Add debug logging
tail -f logs/debug.log

# Analyze patterns
grep "function_name" logs/debug.log
```

### State Inspection
```bash
# Examine system state at failure
# Check variable values
# Inspect data structures
```

### Dependency Analysis
```bash
# Check external dependencies
npm list {package}

# Verify service status
{service check commands}
```

### Timing Analysis
```bash
# Identify race conditions
# Check async operations
# Verify timing issues
```

### Data Flow Analysis
```bash
# Trace data transformations
# Check input/output
# Verify data integrity
```

---

## Output: Root Cause Identified

```markdown
## Root Cause Confirmed

**THE Root Cause:**
{Clear, definitive statement of the root cause}

**Key Evidence:**
{The critical evidence that proves this is the cause}

**Why This Causes the Bug:**
{Explanation of the causal mechanism}

**Hypotheses Tested:**
1. Hypothesis 1: ❌ Disproven because {reason}
2. Hypothesis 2: ❌ Disproven because {reason}
3. Hypothesis 3: ✅ PROVEN - This is the root cause

**Supporting Evidence:**
- Evidence 1: {description}
- Evidence 2: {description}
- Evidence 3: {description}

**Ready for Remediation:** ✅
```

---

## Anti-Patterns (FORBIDDEN)

**DO NOT:**
- ❌ Apply fix without confirmed root cause
- ❌ Re-try previously failed fix without new data
- ❌ Patch symptoms (e.g., add null check without knowing why null)
- ❌ Assume correlation implies causation
- ❌ Fix multiple things at once

**DO:**
- ✅ Evidence-based conclusions
- ✅ Single root cause focus
- ✅ Document all hypotheses and experiments
- ✅ Test each hypothesis rigorously

---

**Next:** Phase 3 - Remediation
