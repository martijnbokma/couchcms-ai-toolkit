# Feature Request / Refactoring Playbook

{Replace this line with a clear, specific description of your feature, refactoring, or change request. Be explicit about WHAT you want and WHY it is valuable. Include context about the problem it solves or the improvement it provides.}

---

## **Mission Briefing: Standard Operating Protocol**

You will now execute this request in full compliance with your **AUTONOMOUS PRINCIPAL ENGINEER - OPERATIONAL DOCTRINE.** Each phase is mandatory. Deviations are not permitted.

**Objective:** Deliver a production-ready implementation that aligns with project standards, maintains system consistency, and improves overall code quality.

**Reference Documents:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Smart Operations: `framework/enhancements/smart-operations.md`
- Project Standards: `docs/standards.md` (or project-specific standards file)

---

## **Phase 0: Reconnaissance & Mental Modeling (Read-Only)**

### Directive

Perform a non-destructive scan of the entire repository to build a complete, evidence-based mental model of the current system architecture, dependencies, and established patterns.

### Reconnaissance Checklist

1. **Repository Inventory:**
   - Identify predominant languages, frameworks, and build tools
   - Catalog architectural seams and module boundaries
   - Locate configuration files and environment setup

2. **Dependency Topology:**
   - Analyze manifest files (`package.json`, `composer.json`, etc.)
   - Map dependency relationships
   - Identify version constraints and compatibility requirements

3. **Configuration Corpus:**
   - Aggregate environment files, CI/CD pipelines, and infrastructure configs
   - Document build processes and deployment procedures
   - Identify runtime configuration requirements

4. **Idiomatic Patterns:**
   - Infer coding standards from existing code
   - Identify architectural layers and separation of concerns
   - Document test strategies and quality gates

5. **Operational Substrate:**
   - Detect containerization schemes and process managers
   - Identify cloud services and external dependencies
   - Map runtime environment requirements

6. **Quality Gates:**
   - Locate linters, type checkers, and security scanners
   - Identify test suites and coverage requirements
   - Document validation and compliance checks

7. **Smart Operations Context:**
   - Check for applicable slash commands (`/fix`, `/refactor`, `/review`)
   - Identify relevant AI agents and knowledge modules
   - Determine pre-flight check requirements

### Output Requirements

- **Reconnaissance Digest:** Produce a concise synthesis (≤ 200 lines) that codifies your understanding
- **Impact Surface:** Identify all files, components, and workflows that may be affected
- **Pattern Alignment:** Document how the request aligns with existing patterns

### Constraints

- **No mutations are permitted during this phase.**
- All analysis must be evidence-based (file contents, command outputs)
- Document assumptions that require verification

---

## **Phase 1: Planning & Strategy**

### Directive

Based on your reconnaissance, formulate a clear, incremental execution plan that accounts for full system impact.

### Plan Requirements

#### 1. Restate Objectives

Clearly define the success criteria for this request:

- **Primary Goal:** {What must be accomplished}
- **Success Metrics:** {How success will be measured}
- **Acceptance Criteria:** {Specific conditions that must be met}

#### 2. Identify Full Impact Surface

Enumerate **all** files, components, services, and user workflows that will be directly or indirectly affected:

**Direct Impact:**
- Files to be created: `{list}`
- Files to be modified: `{list}`
- Components to be refactored: `{list}`

**Indirect Impact:**
- Dependent components: `{list}`
- Related workflows: `{list}`
- Integration points: `{list}`

**System-Wide Considerations:**
- Configuration changes required
- Database migrations (if applicable)
- API contract changes (if applicable)
- Documentation updates needed

#### 3. Justify Strategy

Propose a technical approach and explain *why* it is the best choice:

**Technical Approach:**
- {Description of the chosen approach}

**Rationale:**
- Alignment with existing patterns: {How it fits}
- Maintainability: {Why it's maintainable}
- Simplicity: {Why it's the simplest solution}
- Performance implications: {If applicable}
- Security considerations: {If applicable}

**Alternative Approaches Considered:**
- {Alternative 1}: {Why it was rejected}
- {Alternative 2}: {Why it was rejected}

#### 4. Smart Operations Integration

Identify applicable toolkit features:

- **Slash Commands:** {e.g., `/refactor @file`, `/review @file`}
- **Pre-Flight Checks:** {Which checks apply}
- **AI Agents:** {Which agents should be consulted}
- **Knowledge Modules:** {Which modules are relevant}

### Constraints

- Invoke the **Clarification Threshold** from your Doctrine only if you encounter a critical ambiguity that cannot be resolved through further research
- Ensure the plan accounts for all identified dependencies
- Verify alignment with project standards before proceeding

---

## **Phase 2: Execution & Implementation**

### Directive

Execute your plan incrementally. Adhere strictly to all protocols defined in your **Operational Doctrine.**

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

#### Workspace Purity

- All transient analysis and logs remain in-chat
- **FORBIDDEN:** Creating unsolicited files (`.md`, notes, etc.)
- The chat log is the single source of truth for the session

#### System-Wide Ownership

If you modify a shared component, you are **MANDATED** to:
- Identify **ALL** consumers of the component
- Update **ALL** consumers in this same session
- Verify consistency across all usage points

#### Pre-Flight Checks

Before applying any code changes:
1. Scan generated code against `preflight-checks.yaml` patterns
2. **STOP** on CRITICAL issues - do not apply, show error
3. **WARN** on WARNING issues - show warning, ask to proceed
4. **INFO** on INFO issues - show info, proceed automatically
5. Apply auto-fix where available and approved

### Implementation Checklist

- [ ] Execute pre-flight checks before each modification
- [ ] Follow project coding standards (4-space indentation, naming conventions)
- [ ] Use appropriate AI agents and knowledge modules
- [ ] Maintain English-only code, comments, and documentation
- [ ] Apply proper error handling and validation
- [ ] Ensure accessibility compliance (WCAG 2.1 AA)
- [ ] Document complex logic and architectural decisions

### Progress Tracking

Maintain an inline TODO ledger using:
- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention

---

## **Phase 3: Verification & Autonomous Correction**

### Directive

Rigorously validate your changes with fresh, empirical evidence.

### Verification Steps

#### 1. Quality Gates Execution

Execute all relevant quality gates:

- **Linters:** {List applicable linters}
- **Type Checkers:** {List type checkers}
- **Security Scanners:** {List security tools}
- **Test Suites:** {List test suites}

**Command Examples:**
```bash
# Run linters
{lint command}

# Run type checking
{type check command}

# Run tests
{test command}
```

#### 2. Autonomous Correction Protocol

If any gate fails:
- **Autonomously diagnose** the failure
- **Identify root cause** (not just symptoms)
- **Apply fix** and verify resolution
- **Report** the cause and the fix

#### 3. End-to-End Testing

Perform end-to-end testing of the primary user workflow(s) affected:

- **Primary Workflow:** {Description}
- **Test Steps:** {List steps}
- **Expected Results:** {Expected outcomes}
- **Actual Results:** {Document actual outcomes}

#### 4. Integration Verification

Verify integration with existing systems:

- **API Compatibility:** {If applicable}
- **Database Schema:** {If applicable}
- **Configuration Changes:** {If applicable}
- **Dependency Updates:** {If applicable}

---

## **Phase 4: Mandatory Zero-Trust Self-Audit**

### Directive

Your primary implementation is complete, but your work is **NOT DONE.** You will now reset your thinking and conduct a skeptical, zero-trust audit of your own work. Your memory is untrustworthy; only fresh evidence is valid.

### Audit Protocol

#### 1. Re-verify Final State

With fresh commands, confirm:

- **Git Status:** Verify clean working directory
- **File Integrity:** Confirm all modified files are in intended final state
- **Service Health:** Verify all relevant services are running correctly
- **Configuration:** Confirm all configuration changes are correct

**Commands:**
```bash
# Check git status
git status

# Verify file contents
{verification commands}

# Check service status
{service status commands}
```

#### 2. Hunt for Regressions

Explicitly test at least one critical, related feature that you did *not* directly modify:

- **Feature Tested:** {Feature name}
- **Test Procedure:** {How it was tested}
- **Result:** {Pass/Fail and observations}

#### 3. Confirm System-Wide Consistency

Double-check that all consumers of any changed component are working as expected:

- **Component:** {Component name}
- **Consumers:** {List all consumers}
- **Verification:** {How each was verified}
- **Status:** {All working / Issues found}

#### 4. Standards Compliance Check

Verify adherence to project standards:

- **Coding Standards:** {Verification method}
- **Documentation:** {Completeness check}
- **Accessibility:** {WCAG compliance}
- **Security:** {Security review}

---

## **Phase 5: Final Report & Verdict**

### Directive

Conclude your mission with a single, structured report that provides complete transparency and evidence of system health.

### Report Structure

#### Changes Applied

A comprehensive list of all created or modified artifacts:

**Files Created:**
- `{path/to/file1}` - {Purpose and key changes}
- `{path/to/file2}` - {Purpose and key changes}

**Files Modified:**
- `{path/to/file1}` - {What changed and why}
- `{path/to/file2}` - {What changed and why}

**Configuration Changes:**
- {Configuration item} - {Change description}

**Documentation Updates:**
- {Document} - {What was updated}

#### Verification Evidence

The commands and outputs from your autonomous testing and self-audit, proving the system is healthy:

**Quality Gates:**
```bash
# Linter output
{output}

# Type checker output
{output}

# Test suite output
{output}
```

**Integration Tests:**
```bash
# Test results
{output}
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

Document any insights or patterns discovered during implementation:

- **Technical Insights:** {Key learnings}
- **Process Improvements:** {What worked well}
- **Future Considerations:** {Things to watch}

### Final Verdict

Conclude with one of the two following statements, exactly as written:

**Success:**
```
Self-Audit Complete. System state is verified and consistent. No regressions identified. Mission accomplished.
```

**Critical Issue:**
```
Self-Audit Complete. CRITICAL ISSUE FOUND. Halting work. [Describe issue and recommend immediate diagnostic steps].
```

---

## **Appendix: Implementation Artifacts**

### Key Commands Executed

```bash
# {Description of command and purpose}
{command}

# {Description of command and purpose}
{command}
```

### Reference Documentation

- {Documentation reference 1}
- {Documentation reference 2}

### Related Playbooks

- **Bug Fix:** Use `refresh.md` for debugging persistent issues
- **Retrospective:** Use `retro.md` for session reflection and doctrine evolution

---

**Mission Complete. System Enhanced. Ready for Next Engagement.** 🎖️
