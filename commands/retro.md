# Retro

Intelligent retrospective command that automatically analyzes session activity, identifies learnings, and generates structured retrospective documentation.

## When to Use

Use this command at the end of a work session to:
- Capture session learnings and patterns
- Identify what worked and what didn't
- Extract durable lessons for doctrine updates
- Generate retrospective documentation
- Integrate learnings into standards/doctrine

## Automatic Detection

This command automatically:
1. **Analyzes session activity** - Reviews all files modified, commands executed, and user interactions
2. **Identifies patterns** - Detects success patterns, failure patterns, and corrections
3. **Extracts learnings** - Distills durable lessons from session-specific details
4. **Generates retrospective** - Creates structured retrospective document
5. **Updates doctrine** - Integrates learnings into standards/doctrine files

## Usage

```
/retro
/retro --session-type "Feature Implementation"
/retro --mission "Add authentication to templates"
/retro --focus "CouchCMS patterns"
/retro --quick
```

### Options

- `--session-type` - Specify session type (e.g., "Feature Implementation", "Bug Fix", "Refactoring")
- `--mission` - Specify mission/objective for the session
- `--focus` - Focus on specific area (e.g., "CouchCMS patterns", "TypeScript", "Toolkit")
- `--quick` - Minimal output, focus on doctrine updates only
- `--no-doctrine` - Generate retrospective only, don't update doctrine

## Step-by-Step Process

### Phase 1: Session Analysis (Automatic)

**Objective:** Analyze entire session to understand what happened.

1. **Review Session Activity**
   - List all files modified during session
   - Identify commands executed (`/refactor`, `/fix`, etc.)
   - Review user messages and corrections
   - Track error patterns and fixes

2. **Identify Session Type**
   - Feature Implementation
   - Bug Fix / Debugging
   - Refactoring
   - Documentation
   - Toolkit Development
   - Mixed / Multiple

3. **Extract Key Events**
   - Initial request/objective
   - Major decisions made
   - User corrections/feedback
   - Breakthroughs/successes
   - Failures and recoveries
   - Final state

**Output:** Session activity summary

### Phase 2: Pattern Identification (Automatic)

**Objective:** Identify behavioral patterns from session.

1. **Success Patterns** (✅)
   - What worked well
   - Effective approaches
   - Good decisions
   - Helpful tools/techniques

2. **Failure Patterns** (❌)
   - What didn't work
   - User corrections
   - Mistakes made
   - Assumptions that were wrong

3. **Correction Patterns** (⚠️)
   - How failures were corrected
   - Lessons learned from mistakes
   - Process improvements

4. **Meta-Learning**
   - Higher-level insights
   - Decision frameworks established
   - Process maturation
   - Balance between ideals and reality

**Output:** Pattern analysis with success/failure/correction categories

### Phase 3: Learning Extraction (Automatic)

**Objective:** Distill durable lessons from session-specific details.

1. **Generalize Lessons**
   - Strip project-specific details
   - Formulate as universal principles
   - Make applicable across domains
   - Use imperative voice ("Always...", "Never...")

2. **Categorize Learnings**
   - **Project-Specific**: CouchCMS architecture, toolkit patterns
   - **Universal**: File verification, scope analysis, pragmatic decisions
   - **Process**: Workflow improvements, decision frameworks

3. **Prioritize Learnings**
   - Critical (🚨) - Must integrate into doctrine
   - Important - Should integrate
   - Nice-to-have - Optional integration

**Output:** Categorized, generalized lessons

### Phase 4: Retrospective Generation

**Objective:** Create structured retrospective document.

1. **Generate Header**
   - Session title (auto-generated from mission/type)
   - Date (current date)
   - Session Type
   - Mission/Objective
   - Status

2. **Generate Sections**
   - **Doctrine Update Summary** - Changes to standards/doctrine
   - **Session Learnings** - Success patterns, failure patterns, corrections
   - **Durable Lessons** - Generalizable principles
   - **Quantitative Impact** - Files modified, docs created, etc.
   - **Meta-Learning** - Higher-level insights
   - **Doctrine Evolution** - Integration status

3. **Format Output**
   - Use markdown formatting
   - Include code examples where relevant
   - Use diff format for doctrine changes
   - Add emoji markers (✅, ❌, ⚠️, 🚨)

**Output:** Complete retrospective document

### Phase 5: Doctrine Integration (Optional)

**Objective:** Integrate learnings into standards/doctrine files.

1. **Identify Target Files**
   - `standards.md` - Project standards
   - `AGENT.md` - Agent instructions
   - `.cursorrules` - Cursor rules
   - Module/agent files - Specific patterns

2. **Apply Updates**
   - Add new critical rules (🚨)
   - Refine existing instructions
   - Add best practices
   - Update anti-patterns
   - Document limitations

3. **Verify Integration**
   - Check formatting consistency
   - Ensure no duplicates
   - Verify imperative voice
   - Check generic applicability

**Output:** Updated doctrine files with integrated learnings

## Detection Examples

### Example 1: Feature Implementation Session

**Session Activity:**
- Modified: `films.php`, `swiper-section.html`
- Commands: `/refactor @films.php`
- User corrections: "Ik zie nog steeds 4 slides"
- Final: Fixed across 5 pages

**Auto-Detected:**
- Session Type: Feature Implementation
- Mission: Increase visible slides from 4 to 5
- Patterns: File verification, scope analysis, FOUC prevention
- Learnings: Verify file usage, complete scope analysis

**Generated Retrospective:**
- Success patterns: Systematic file tracing, complete scope analysis
- Failure patterns: Modified wrong file, incomplete scope
- Durable lessons: Verify file usage, complete scope analysis
- Doctrine updates: Added critical rules to standards.md

### Example 2: Refactoring Session

**Session Activity:**
- Modified: `modules/typescript.md`, `agents/alpinejs.md`
- Commands: `/refactor-modules`, `/refactor-agents`
- Created: `fix-agent-code-titles.js`, `fix-agent-sections.js`
- Final: All modules/agents validated and fixed

**Auto-Detected:**
- Session Type: Refactoring + Toolkit Development
- Mission: Validate and refactor modules/agents
- Patterns: Automated fixes, validation workflows
- Learnings: Script-based automation, validation patterns

**Generated Retrospective:**
- Success patterns: Automated script creation, systematic validation
- Failure patterns: None (successful session)
- Durable lessons: Script-based automation for repetitive tasks
- Doctrine updates: Validation workflow patterns

### Example 3: Bug Fix Session

**Session Activity:**
- Modified: `auth.php`, `filters/authenticated.html`
- Commands: `/fix @auth.php`
- User feedback: "Authentication not working"
- Final: Fixed authentication flow

**Auto-Detected:**
- Session Type: Bug Fix / Debugging
- Mission: Fix authentication issue
- Patterns: Security analysis, authentication patterns
- Learnings: Authentication best practices

**Generated Retrospective:**
- Success patterns: Systematic debugging, security-first approach
- Failure patterns: Missing authentication check
- Durable lessons: Always verify authentication in templates
- Doctrine updates: Authentication patterns in standards

## Output Format

```
# Session Retrospective: [Auto-Generated Title]

**Date:** YYYY-MM-DD
**Session Type:** [Detected Type]
**Mission:** [Detected Mission]
**Status:** ✅ Complete with [Critical/Important] Lessons Learned

---

## 📝 Doctrine Update Summary

**Project Doctrine Updated:** `{{config_file_path}}` (auto-detected standards file)

**Changes Applied:**

#### 1. [Section Name]

**Added Critical Rule:**

```diff
+ - **🚨 CRITICAL: [Rule Title]**: [Description]
```

---

## 🎓 Session Learnings

### Critical Behavioral Patterns Identified

#### ✅ Success Patterns

1. **Pattern Name**
    - Description
    - Impact

#### ❌ Failure Patterns & Corrections

1. **Pattern Name**
    - **Failure**: Description
    - **User Correction**: Quote
    - **Root Cause**: Analysis
    - **Lesson**: Generalizable principle

### 🎯 Durable Lessons Integrated into Doctrine

**Project-Specific:**
1. [Learning 1]
2. [Learning 2]

**Universal:**
3. [Learning 3]
4. [Learning 4]

### 📊 Quantitative Impact

**Files Modified:** X files
**Documentation Created:** X guides
**Doctrine Updates:** X sections

---

## 🧠 Meta-Learning

### [Key Insight Title]

**Key Insight:** [Higher-level insight]

**Decision Framework Established:**
1. [Principle 1]
2. [Principle 2]

---

## 🎯 Doctrine Evolution Complete

**Status:** 🟢 **Operational Doctrine Updated**

All learnings have been integrated into `{{config_file_path}}` and propagated to all AI agent configurations.

**Future missions will benefit from:**
- ✅ [Benefit 1]
- ✅ [Benefit 2]

**Mission Complete. Doctrine Hardened. Ready for Next Engagement.** 🎖️
```

## Options

### --session-type
Specify session type for better categorization:

```
/retro --session-type "Feature Implementation + Refactoring"
```

### --mission
Specify mission/objective:

```
/retro --mission "Add authentication to all templates"
```

### --focus
Focus on specific area:

```
/retro --focus "CouchCMS patterns"
```

### --quick
Minimal output, focus on doctrine updates:

```
/retro --quick
```

### --no-doctrine
Generate retrospective only, don't update doctrine:

```
/retro --no-doctrine
```

## Integration

### With Operational Doctrine

Follows Operational Doctrine principles:
- Autonomous operation
- Evidence-based analysis
- System-wide thinking
- Doctrine evolution

### With Standards

Integrates learnings into:
- `standards.md` - Project standards
- `AGENT.md` - Agent instructions
- `.cursorrules` - Cursor rules
- Module/agent files - Specific patterns

### With Playbooks

Uses playbook structure:
- `framework/playbooks/retro.md` - Reference structure
- `rules/retro.md` - Universal retrospective prompt

## Best Practices

1. **Run at session end** - Use `/retro` after completing work
2. **Be specific** - Use `--mission` and `--session-type` for clarity
3. **Review output** - Always review generated retrospective
4. **Verify doctrine** - Check doctrine updates are correct
5. **Save retrospective** - Store in `docs/retrospectives/` if needed

## Examples

### Basic Retrospective

```
/retro

"Automatically analyze session and generate retrospective"
```

### Focused Retrospective

```
/retro --session-type "Feature Implementation" --mission "Add user authentication"

"Generate retrospective focused on authentication feature"
```

### Quick Doctrine Update

```
/retro --quick

"Focus on doctrine updates only, minimal output"
```

### Retrospective Only

```
/retro --no-doctrine

"Generate retrospective document without updating doctrine"
```

## See Also

- [Retro Playbook](../framework/playbooks/retro.md) - Detailed retrospective structure
- [Universal Retro](../rules/retro.md) - Universal retrospective prompt
- [Operational Doctrine](../framework/doctrine/operational-doctrine.md) - Doctrine principles
