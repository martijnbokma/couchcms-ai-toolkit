# Session Retrospective: Metacognitive Self-Improvement Loop

{Replace this line with a brief description of the session: what was accomplished, what challenges were encountered, and what key learnings emerged. Be specific about the mission type (Feature Implementation, Bug Fix, Refactoring, etc.)}

---

## **Mission Briefing: Doctrine Evolution Protocol**

You will now conduct a structured retrospective of the completed session in full compliance with your **AUTONOMOUS PRINCIPAL ENGINEER - OPERATIONAL DOCTRINE.** This retrospective serves as the **metacognitive self-improvement loop** that ensures continuous evolution of the framework and project standards.

**Objective:** Identify durable, transferable lessons that should be integrated into the operational doctrine, project standards, or toolkit configuration.

**Reference Documents:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Smart Operations: `framework/enhancements/smart-operations.md`
- Project Standards: `docs/standards.md` (or project-specific standards file)
- Pre-Flight Checks: `preflight-checks.yaml`
- Smart Defaults: `smart-defaults.yaml`

---

## **Phase 0: Session Context & Objectives**

### Session Metadata

- **Date:** {YYYY-MM-DD}
- **Session Type:** {Feature Implementation | Bug Fix | Refactoring | Code Review | Other}
- **Primary Mission:** {Brief description of what was accomplished}
- **Status:** {✅ Complete | ⚠️ Partial | 🚧 Blocked}

### Initial Objectives

1. {Primary objective}
2. {Secondary objective}
3. {Additional objectives if any}

---

## **Phase 1: Success Pattern Analysis**

### ✅ What Worked Exceptionally Well

Identify patterns, techniques, or approaches that led to successful outcomes:

1. **{Pattern Name}**
    - **Description:** {What was done}
    - **Evidence:** {Specific examples from the session}
    - **Impact:** {Why this mattered}
    - **Transferability:** {Can this be applied to future sessions?}

2. **{Pattern Name}**
    - {Repeat structure}

### 🎯 Durable Lessons (Universal Principles)

Extract universal principles that apply beyond this specific session:

**Project-Specific Learnings:**
- {Learning 1}: {Description and why it matters}
- {Learning 2}: {Description and why it matters}

**Universal Learnings (Any Project):**
- {Learning 1}: {Description and why it matters}
- {Learning 2}: {Description and why it matters}

---

## **Phase 2: Failure Pattern Analysis**

### ❌ What Failed and Why

Identify failures, corrections, and root causes:

1. **{Failure Pattern Name}**
    - **Failure:** {What went wrong}
    - **User Correction/Feedback:** {How the issue was identified}
    - **Root Cause:** {Why it happened - be specific}
    - **Lesson:** {What should be done differently next time}
    - **Prevention:** {How to prevent this in future sessions}

2. **{Failure Pattern Name}**
    - {Repeat structure}

### 🔄 Correction Patterns

Document how failures were corrected and what that teaches us:

- **{Correction Pattern}:** {Description of the correction approach}

---

## **Phase 3: Quantitative Impact Assessment**

### Metrics

- **Files Modified:** {Number}
- **Files Created:** {Number}
- **Documentation Created/Updated:** {Number and types}
- **Tests Added/Updated:** {Number}
- **Architectural Constraints Discovered:** {Number and types}
- **System-Wide Impact:** {Scope of changes}

### Quality Indicators

- **What Worked:** {List key success factors}
- **What Failed:** {List key failure factors}
- **Final State:** {Overall assessment of code quality and system health}

---

## **Phase 4: Doctrine Integration Plan**

### Standards Updates Required

Identify specific updates needed in project standards or operational doctrine:

#### 1. {Section/Area Name}

**Current State:** {What the standards currently say (if anything)}

**Proposed Update:**
```diff
+ {New content to add}
- {Content to remove (if any)}
```

**Rationale:** {Why this update is necessary}

**Severity:** {CRITICAL | IMPORTANT | RECOMMENDED}

#### 2. {Section/Area Name}
    - {Repeat structure}

### Pre-Flight Checks Updates

If new patterns were identified that should be caught automatically:

**Target File:** `preflight-checks.yaml`

**Check Definition:**
```yaml
{category_name}:
  {check_name}:
    pattern: "{regex_pattern}"
    severity: {CRITICAL | ERROR | WARNING | INFO}
    message: "{Human-readable description}"
    fix: "{How to fix}"
    auto_fix: {true | false}
    example:
      bad: "{example of bad code}"
      good: "{example of good code}"
    reference: "{documentation reference}"
```

**Integration Steps:**
1. Add check to `preflight-checks.yaml`
2. Test the check with sample code
3. Run `/sync` to update all agent configs
4. Document in `framework/enhancements/smart-operations.md`

### Smart Operations Integration

If new slash commands or intent patterns would be valuable:

**Target Files:**
- `smart-defaults.yaml` → `intent_patterns` (for intent detection)
- `framework/enhancements/smart-operations.md` (for documentation)

**Command Addition:**
- **Command:** `/{command}` - {Description}
- **Action:** {What it does}
- **Example:** `/{command} @file`
- **Pre-Flight Checks:** {Which checks apply}

**Intent Pattern Addition:**
```yaml
intent_patterns:
  {intent_name}:
    triggers: ["{keyword1}", "{keyword2}"]
    action: {action_name}
    confirm: "{Confirmation message}" | false
```

**Integration Steps:**
1. Add to `smart-defaults.yaml`
2. Document in `smart-operations.md`
3. Run `/sync` to update configurations

---

## **Phase 5: Meta-Learning & Process Evolution**

### Decision Frameworks Established

Document any decision frameworks or heuristics that emerged:

**{Framework Name}:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Process Maturation

**Before This Session:**
- {What might have been done differently}
- {What assumptions might have been made}
- {What might have been missed}

**After This Session:**
- {What will be done differently}
- {What new awareness exists}
- {What protocols are now in place}

### Balance Points Discovered

Document any tensions between principles that were resolved:

- **{Principle A}** vs **{Principle B}**: {How the balance was struck}
- **{Ideal}** vs **{Reality}**: {How pragmatic decisions were made}

---

## **Phase 6: Integration & Propagation**

### Standards Update Execution

**Target Files:**
- `docs/standards.md` (or project-specific standards file) - {What will be updated}
- `framework/doctrine/operational-doctrine.md` - {What will be updated}
- `preflight-checks.yaml` - {What will be added}
- `smart-defaults.yaml` - {What will be added/updated}

**Update Plan:**
1. {Step 1 - Edit standards file}
2. {Step 2 - Update doctrine if needed}
3. {Step 3 - Add pre-flight checks if applicable}
4. {Step 4 - Update smart defaults if applicable}
5. {Step 5 - Run sync to propagate changes}

### Agent Configuration Sync

**Status:** {✅ Complete | ⚠️ Partial | 🚧 Pending}

**Configurations to Update:**
- `.cursorrules` - Cursor AI configuration
- `CLAUDE.md` - Claude AI configuration
- `.github/copilot-instructions.md` - GitHub Copilot configuration
- `.codewhisperer/rules.md` - CodeWhisperer configuration
- `.tabnine/guidelines/` - Tabnine configuration
- `.windsurf/rules.md` - Windsurf configuration

**Sync Command:**
```bash
bun scripts/sync.js
```

**Verification:**
- Check that all configs include updated content
- Verify pre-flight checks are active
- Test Smart Operations features if updated

---

## **Phase 7: Final Verdict & Future Readiness**

### Doctrine Evolution Status

**Status:** {🟢 Complete | 🟡 Partial | 🔴 Blocked}

**Summary:**
- ✅ {What was successfully integrated}
- ⚠️ {What needs follow-up}
- 🚧 {What is blocked}

### Future Mission Readiness

**Future missions will benefit from:**
- ✅ {Benefit 1}
- ✅ {Benefit 2}
- ✅ {Benefit 3}

### Final Statement

Conclude with one of the following statements:

- `"Self-Audit Complete. Doctrine has been updated with durable lessons. System state is verified. Ready for next engagement."`
- `"Self-Audit Complete. CRITICAL LESSONS IDENTIFIED but integration blocked. [Describe blocker and recommend immediate action]."`

---

## **Appendix: Session Artifacts**

### Key Files Modified

- `{file1}` - {What changed and why}
- `{file2}` - {What changed and why}

### Documentation Created

- `{doc1}` - {Purpose and key content}
- `{doc2}` - {Purpose and key content}

### Commands Executed

```bash
# {Description of command and purpose}
{command}

# {Description of command and purpose}
{command}
```

---

**Mission Complete. Doctrine Hardened. Ready for Next Engagement.** 🎖️
