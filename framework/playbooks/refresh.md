# Bug Fix / Root Cause Analysis Playbook

{Replace this line with a concise but complete description of the persistent bug or issue. Include:
- Observed behavior: What is actually happening?
- Expected behavior: What should happen instead?
- Error messages: Any error logs, stack traces, or console output
- Context: When does this occur? (specific conditions, user actions, data states)
- Impact: How severe is this issue? (data loss, security, usability, performance)}

---

## **Mission Briefing: Root Cause Analysis & Remediation Protocol**

Previous, simpler attempts to resolve this issue have failed. Standard procedures are now suspended. You will initiate a **deep diagnostic protocol.**

Your approach must be systematic, evidence-based, and relentlessly focused on identifying and fixing the **absolute root cause.** Patching symptoms is a critical failure.

**Objective:** Identify the definitive root cause through rigorous analysis and implement a durable fix that prevents recurrence.

**Reference Documents:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Smart Operations: `framework/enhancements/smart-operations.md`
- Project Standards: `docs/standards.md` (or project-specific standards file)
- Testing Guide: `framework/docs/testing.md`

---

## **Phase 0: Reconnaissance & State Baseline (Read-Only)**

### Directive

Adhering to the **Operational Doctrine**, perform a non-destructive scan of the repository, runtime environment, configurations, and recent logs. Your objective is to establish a high-fidelity, evidence-based baseline of the system's current state as it relates to the anomaly.

### Reconnaissance Checklist

1. **Issue Context Analysis:**
   - Review issue description and reported symptoms
   - Identify affected components, modules, or features
   - Map the issue to system architecture layers
   - Document any related issues or similar bugs

2. **Repository State:**
   - Check Git history for recent changes that might relate to the issue
   - Identify files that were modified around the time the issue appeared
   - Review commit messages for context
   - Check for uncommitted changes that might affect the issue

3. **Runtime Environment:**
   - Document current environment configuration
   - Check for environment-specific issues (dev vs. production)
   - Identify external dependencies and their versions
   - Review service health and resource utilization

4. **Configuration Analysis:**
   - Review configuration files for anomalies
   - Check for misconfigurations or missing settings
   - Verify environment variables and secrets
   - Document configuration changes in recent history

5. **Log Analysis:**
   - Review application logs for error patterns
   - Check system logs for related issues
   - Identify timing patterns (when does it occur?)
   - Look for correlation with other events

6. **Code Inspection:**
   - Read relevant source files without modification
   - Identify potential problem areas
   - Review error handling and validation logic
   - Check for known anti-patterns or code smells

7. **Smart Operations Context:**
   - Check for applicable slash commands (`/fix`, `/review`)
   - Identify relevant AI agents for debugging
   - Determine pre-flight check requirements
   - Check for similar issues in project history

### Output Requirements

- **State Baseline Digest:** Produce a concise synthesis (≤ 200 lines) that documents:
  - Current system state as it relates to the anomaly
  - Key observations and patterns identified
  - Hypotheses that warrant investigation
  - Areas requiring deeper analysis

### Constraints

- **No mutations are permitted during this phase.**
- All analysis must be evidence-based (logs, code, configuration)
- Document all assumptions that require verification
- Preserve all evidence (logs, error messages, screenshots)

---

## **Phase 1: Isolate the Anomaly**

### Directive

Your first and most critical goal is to create a **minimal, reproducible test case** that reliably and predictably triggers the bug. You will not attempt any fixes until you can reliably reproduce the failure on command.

### Isolation Protocol

#### 1. Define Correctness

Clearly state the expected, non-buggy behavior:

- **Expected Behavior:** {What should happen}
- **Success Criteria:** {How to recognize correct behavior}
- **Acceptable Variations:** {Any acceptable variations in behavior}

#### 2. Create a Failing Test

If possible, write a new, specific automated test that fails precisely because of this bug:

**Test Requirements:**
- **Minimal:** Test only the specific failing behavior
- **Reproducible:** Must fail consistently on command
- **Isolated:** Should not depend on external state
- **Descriptive:** Test name clearly describes what's being tested

**Test Structure:**
```typescript
// Example test structure
describe('{Component/Feature Name}', () => {
    it('should {expected behavior}', () => {
        // Arrange: Set up minimal conditions
        {setup code}

        // Act: Trigger the bug
        {action that triggers bug}

        // Assert: Verify expected behavior
        {assertion that currently fails}
    });
});
```

#### 3. Pinpoint the Trigger

Identify the exact conditions, inputs, or sequence of events that causes the failure:

- **Trigger Conditions:** {Specific conditions required}
- **Input Data:** {Specific inputs that cause failure}
- **Sequence:** {Order of operations if relevant}
- **State Requirements:** {System state needed to reproduce}

#### 4. Reproducibility Verification

Verify you can reliably reproduce the failure:

- **Reproduction Steps:** {Step-by-step instructions}
- **Success Rate:** {How often it reproduces - must be 100%}
- **Variations Tested:** {Different scenarios tested}
- **Edge Cases:** {Boundary conditions tested}

### Constraints

- **FORBIDDEN:** Attempting fixes before reliable reproduction
- **FORBIDDEN:** Assuming the cause without evidence
- **REQUIRED:** Document exact reproduction steps
- **REQUIRED:** Create automated test if possible

---

## **Phase 2: Root Cause Analysis (RCA)**

### Directive

With a reproducible failure, you will now methodically investigate the failing pathway to find the definitive root cause. This phase requires rigorous hypothesis testing and evidence gathering.

### Evidence-Gathering Protocol

#### Hypothesis Testing Loop

For each hypothesis, follow this structured approach:

**1. Formulate a Testable Hypothesis**

State a clear, simple theory about the cause:

- **Hypothesis:** {Clear statement of the theory}
- **Rationale:** {Why this hypothesis is plausible}
- **Testability:** {How it can be tested}

**Example:**
```
Hypothesis: The user authentication token is expiring prematurely due to
incorrect timezone handling in the expiration calculation.

Rationale: The issue occurs at specific times of day, suggesting a time-based
calculation problem.

Testability: Compare token expiration timestamps with system time and timezone
settings.
```

**2. Devise an Experiment**

Design a safe, non-destructive test or observation to gather evidence:

- **Experiment Design:** {What will be tested}
- **Expected Evidence:** {What would prove/disprove the hypothesis}
- **Safety Measures:** {How to ensure no data loss or system damage}
- **Success Criteria:** {How to interpret results}

**3. Execute and Conclude**

Run the experiment, present the evidence, and state your conclusion:

- **Execution:** {What was done}
- **Evidence Collected:** {Data, logs, observations}
- **Analysis:** {What the evidence means}
- **Conclusion:** {Hypothesis proven, disproven, or needs refinement}

**4. Iterate if Needed**

If the hypothesis is wrong:
- Formulate a new hypothesis based on new evidence
- Repeat the testing loop
- Document why previous hypotheses were incorrect

### RCA Techniques

Apply appropriate debugging techniques:

- **Code Tracing:** Follow execution path through code
- **Log Analysis:** Add strategic logging to trace execution
- **State Inspection:** Examine system state at failure point
- **Dependency Analysis:** Check external dependencies and services
- **Timing Analysis:** Identify race conditions or timing issues
- **Data Flow Analysis:** Trace data transformations

### Anti-Patterns (Forbidden Actions)

**FORBIDDEN:**
- **Applying a fix without a confirmed root cause supported by evidence**
- **Re-trying a previously failed fix without new data**
- **Patching a symptom** (e.g., adding a `null` check) without understanding *why* the value is becoming `null`
- **Assuming correlation implies causation**
- **Fixing multiple things at once** without isolating the cause

**REQUIRED:**
- **Evidence-based conclusions** - every conclusion must be supported by data
- **Single root cause focus** - identify THE cause, not multiple possible causes
- **Documentation** - document all hypotheses, experiments, and conclusions

---

## **Phase 3: Remediation**

### Directive

Design and implement a minimal, precise fix that durably hardens the system against the confirmed root cause. The fix must address the root cause, not just symptoms.

### Fix Design Principles

#### 1. Root Cause Alignment

Ensure the fix directly addresses the identified root cause:

- **Root Cause:** {Confirmed root cause from Phase 2}
- **Fix Strategy:** {How the fix addresses the root cause}
- **Prevention:** {How the fix prevents recurrence}

#### 2. Minimal Change Principle

Implement the smallest change that fixes the issue:

- **Scope:** {What exactly will be changed}
- **Justification:** {Why this is the minimal necessary change}
- **Alternatives Considered:** {Why other approaches were rejected}

#### 3. Durability

Ensure the fix prevents recurrence:

- **Hardening Measures:** {Additional safeguards added}
- **Validation:** {How recurrence will be prevented}
- **Monitoring:** {How to detect if issue returns}

### Core Protocols in Effect

#### Read-Write-Reread Pattern

For every file you modify:
1. **Read** the file immediately before making changes
2. **Write** the modifications
3. **Reread** the file immediately after to verify correctness

#### Command Execution Canon

All shell commands **actually executed** **MUST** be wrapped to ensure:
- Termination and full output capture (stdout & stderr)
- Timeout enforcement for long-running commands
- Non-interactive execution where safe
- Fail-fast semantics

#### System-Wide Ownership

If the root cause is in a shared component, you are **MANDATED** to:
- Identify **ALL** consumers of the component
- Analyze **ALL** consumers for the same flaw
- Fix **ALL** affected consumers in this same session
- Verify consistency across all usage points

#### Pre-Flight Checks

Before applying any code changes:
1. Scan generated code against `preflight-checks.yaml` patterns
2. **STOP** on CRITICAL issues - do not apply, show error
3. **WARN** on WARNING issues - show warning, ask to proceed
4. **INFO** on INFO issues - show info, proceed automatically
5. Apply auto-fix where available and approved

### Implementation Checklist

- [ ] Fix directly addresses confirmed root cause
- [ ] Minimal change principle applied
- [ ] Execute pre-flight checks before each modification
- [ ] Follow project coding standards (4-space indentation, naming conventions)
- [ ] Maintain English-only code, comments, and documentation
- [ ] Add appropriate error handling and validation
- [ ] Update or add tests to prevent regression
- [ ] Document the fix and rationale
- [ ] Verify all consumers of shared components are updated

### Progress Tracking

Maintain an inline TODO ledger using:
- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention

---

## **Phase 4: Verification & Regression Guard**

### Directive

Prove that your fix has resolved the issue without creating new ones. This phase requires comprehensive testing and validation.

### Verification Steps

#### 1. Confirm the Fix

Re-run the specific failing test case from Phase 1. It **MUST** now pass:

- **Original Test:** {Reference to test from Phase 1}
- **Test Result:** {Pass/Fail with output}
- **Verification:** {Confirmation that issue is resolved}

**Command:**
```bash
# Run the specific failing test
{test command for the isolated test case}
```

#### 2. Run Full Quality Gates

Execute the entire suite of relevant tests and linters to ensure no regressions:

**Test Suites:**
- **Unit Tests:** {Command and results}
- **Integration Tests:** {Command and results}
- **End-to-End Tests:** {Command and results}

**Quality Checks:**
- **Linters:** {Command and results}
- **Type Checkers:** {Command and results}
- **Security Scanners:** {Command and results}
- **Code Coverage:** {If applicable}

**Commands:**
```bash
# Run all tests
{test suite command}

# Run linters
{lint command}

# Run type checking
{type check command}
```

#### 3. Regression Testing

Explicitly test related functionality to ensure no regressions:

- **Related Features:** {List of features tested}
- **Test Results:** {Pass/Fail for each}
- **Observations:** {Any unexpected behavior}

#### 4. Autonomous Correction Protocol

If your fix introduces any new failures:
- **Autonomously diagnose** the failure
- **Identify root cause** of the new failure
- **Apply fix** and verify resolution
- **Report** the cause and the fix
- **Re-run** all quality gates

#### 5. Edge Case Verification

Test edge cases and boundary conditions:

- **Edge Cases Tested:** {List}
- **Results:** {Pass/Fail for each}
- **Additional Safeguards:** {If any were added}

---

## **Phase 5: Mandatory Zero-Trust Self-Audit**

### Directive

Your remediation is complete, but your work is **NOT DONE.** You will now reset your thinking and conduct a skeptical, zero-trust audit of your own fix. Your memory is untrustworthy; only fresh evidence is valid.

### Audit Protocol

#### 1. Re-verify Final State

With fresh commands, confirm that all modified files are correct and that all relevant services are in a healthy state:

**Git Status:**
```bash
# Check git status
git status

# Review changes
git diff
```

**File Integrity:**
```bash
# Verify file contents
{verification commands for modified files}
```

**Service Health:**
```bash
# Check service status
{service status commands}

# Verify functionality
{functional verification commands}
```

#### 2. Hunt for Regressions

Explicitly test the primary workflow of the component you fixed to ensure its overall functionality remains intact:

- **Primary Workflow:** {Description}
- **Test Procedure:** {How it was tested}
- **Result:** {Pass/Fail and observations}
- **Related Workflows:** {Other workflows tested}

#### 3. Confirm System-Wide Consistency

Double-check that all consumers of any changed component are working as expected:

- **Component:** {Component name}
- **Consumers:** {List all consumers}
- **Verification:** {How each was verified}
- **Status:** {All working / Issues found}

#### 4. Root Cause Verification

Verify that the fix actually addresses the root cause:

- **Root Cause:** {Confirmed root cause}
- **Fix Verification:** {How fix addresses root cause}
- **Prevention Verification:** {How recurrence is prevented}

#### 5. Standards Compliance Check

Verify adherence to project standards:

- **Coding Standards:** {Verification method}
- **Documentation:** {Completeness check}
- **Test Coverage:** {Coverage verification}
- **Security:** {Security review}

---

## **Phase 6: Final Report & Verdict**

### Directive

Conclude your mission with a structured "After-Action Report" that provides complete transparency and evidence of the fix.

### Report Structure

#### Root Cause

A definitive statement of the underlying issue, supported by the key piece of evidence from your RCA:

- **Root Cause:** {Clear statement of the root cause}
- **Key Evidence:** {The critical evidence that identified the root cause}
- **Why Previous Fixes Failed:** {Why symptom patches didn't work}
- **Why This Fix Works:** {How this fix addresses the root cause}

#### Remediation

A comprehensive list of all changes applied to fix the issue:

**Files Modified:**
- `{path/to/file1}` - {What changed and why}
- `{path/to/file2}` - {What changed and why}

**Files Created:**
- `{path/to/file1}` - {Purpose and key content}
- `{path/to/file2}` - {Purpose and key content}

**Tests Added/Updated:**
- `{test/file1}` - {What test was added/updated}
- `{test/file2}` - {What test was added/updated}

**Configuration Changes:**
- {Configuration item} - {Change description}

**Documentation Updates:**
- {Document} - {What was updated}

#### Verification Evidence

Proof that the original bug is fixed and no new regressions were introduced:

**Original Bug Fix:**
```bash
# Original failing test now passes
{test output showing pass}
```

**Quality Gates:**
```bash
# Full test suite
{test suite output}

# Linter output
{lint output}

# Type checker output
{type check output}
```

**Regression Tests:**
```bash
# Related functionality tests
{test results}
```

**Manual Verification:**
- {Verification step} - {Result}
- {Verification step} - {Result}

#### System-Wide Impact Statement

A confirmation that all identified dependencies have been checked and are consistent:

- **Dependencies Verified:** {List}
- **Consumers Updated:** {List}
- **Integration Points Tested:** {List}
- **Breaking Changes:** {None / List with migration notes}

#### Lessons Learned

Document insights that could prevent similar issues:

- **Technical Insights:** {Key learnings about the codebase}
- **Process Insights:** {What debugging techniques worked}
- **Prevention Measures:** {How to prevent similar issues}
- **Future Considerations:** {Things to watch}

### Final Verdict

Conclude with one of the two following statements, exactly as written:

**Success:**
```
Self-Audit Complete. Root cause has been addressed, and system state is verified. No regressions identified. Mission accomplished.
```

**Critical Issue:**
```
Self-Audit Complete. CRITICAL ISSUE FOUND during audit. Halting work. [Describe issue and recommend immediate diagnostic steps].
```

---

## **Appendix: Diagnostic Artifacts**

### Key Commands Executed

```bash
# {Description of command and purpose}
{command}

# {Description of command and purpose}
{command}
```

### Evidence Collected

- **Logs:** {Location and key findings}
- **Error Messages:** {Full error messages}
- **Stack Traces:** {If applicable}
- **Test Outputs:** {Key test results}

### Reference Documentation

- {Documentation reference 1}
- {Documentation reference 2}

### Related Playbooks

- **Feature Request:** Use `request.md` for new features or refactoring
- **Retrospective:** Use `retro.md` for session reflection and doctrine evolution

---

**Mission Complete. Root Cause Eliminated. System Restored.** 🎖️
