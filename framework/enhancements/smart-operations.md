# SMART OPERATIONS - Enhanced AI Efficiency Layer

## Purpose

This module enhances AI productivity and code quality through intelligent automation:
1. **Quick Actions** - Slash commands for common tasks
2. **Intent Detection** - Automatic understanding of user goals
3. **Pre-flight Checks** - Proactive error prevention
4. **Communication Modes** - Progressive disclosure
5. **Smart Context Loading** - Automatic agent/module activation
6. **After-Action Suggestions** - Proactive improvement recommendations

**Reference Documents:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Pre-Flight Checks: `preflight-checks.yaml`
- Smart Defaults: `smart-defaults.yaml`
- Project Standards: `docs/standards.md`

---

## 1. QUICK ACTIONS (Slash Commands)

Slash commands provide instant access to common tasks, reducing verbosity and increasing efficiency.

### Code Modification Commands

| Command | Action | Example | Pre-Flight Checks |
|---------|--------|---------|------------------|
| `/fix @file` | Identify and fix issues | `/fix @films.php` | All applicable checks |
| `/refactor @file` | Refactor using router | `/refactor @modal.html` | Code quality checks |
| `/review @file` | Code review with suggestions | `/review @auth.ts` | Read-only, no checks |
| `/optimize @file` | Performance optimization | `/optimize @main.ts` | Performance patterns |

**Usage Notes:**
- Commands automatically load relevant agents/modules based on file type
- Pre-flight checks run before applying any modifications
- Results are reported according to active communication mode

### Creation Commands

| Command | Action | Output | Template Source |
|---------|--------|--------|-----------------|
| `/component <name>` | Create component bundle | HTML + CSS + TS | `smart-defaults.yaml` |
| `/view <name>` | Create view with routing | View templates | `smart-defaults.yaml` |
| `/form <name>` | Create DataBound Form | Form + validation | `smart-defaults.yaml` |
| `/api <name>` | Create JSON API endpoint | API template | `smart-defaults.yaml` |

**Command Variations:**
- `/component card --alpine` - Create Alpine.js-enabled component
- `/view products --crud` - Create full CRUD view bundle
- `/form contact --validated` - Create form with validation

**Configuration:** See `smart-defaults.yaml` → `action_contexts` for complete options.

### Workflow Commands

| Command | Action | When to Use |
|---------|--------|-------------|
| `/sync` | Run sync.js to update configs | After changing standards or modules |
| `/validate` | Run validate.js for compliance | Before committing changes |
| `/status` | Show project status summary | Quick project overview |
| `/quick` or `/q` | Enable quick mode (minimal output) | Experienced users, batch operations |
| `/verbose` or `/v` | Enable verbose mode (detailed) | Learning, debugging, complex issues |
| `/standard` | Reset to standard mode | Return to default interaction |

### Command Processing Flow

When a slash command is detected:

1. **Parse command and arguments**
   - Extract command name and parameters
   - Validate syntax and required arguments
   - Identify file references (`@file`)

2. **Validate command exists**
   - Check command is recognized
   - Verify required arguments are present
   - Check file exists (if `@file` is used)

3. **Load context** (if applicable)
   - Auto-load agents/modules per `smart-defaults.yaml`
   - Activate relevant pre-flight checks
   - Load file-specific context

4. **Execute corresponding action**
   - Run pre-flight checks (for modification commands)
   - Perform the requested action
   - Apply fixes or create files

5. **Report result concisely**
   - Format output per active communication mode
   - Show summary of changes
   - Offer after-action suggestions

**Example:**
```
User: /fix @snippets/components/modal.html

AI Response (Standard Mode):
📋 Found 2 issues in modal.html:
  - Line 12: <cms:else></cms:else> → <cms:else />
  - Line 45: HTML comment with <cms: → [cms:

✅ Fixed 2 issues in modal.html

💡 Related actions:
   [1] Check 3 other files for similar issues
   [2] Add regression test
   [n] Skip
```

**Example (Quick Mode):**
```
User: /q /fix @snippets/components/modal.html

AI Response:
✅ Fixed 2 issues (L12: else tag, L45: comment)
```

---

## 2. INTENT DETECTION

Intent detection automatically understands user goals from natural language, reducing the need for explicit commands.

### Automatic Intent Recognition

When user input is received, analyze for intent patterns defined in `smart-defaults.yaml` → `intent_patterns`:

| Input Pattern | Detected Intent | Auto-Action | Confirmation |
|---------------|-----------------|-------------|--------------|
| `@file` only (no text) | Code review | Read file, identify issues | No (read-only) |
| `@file` + "fix/repair/broken" | Bug fix | Diagnose and fix | Yes (Standard) |
| `@file` + "refactor" | Refactoring | Activate refactor router | Yes (Standard) |
| "new/create/make component X" | Component creation | Create bundle | Yes (Standard) |
| "add X to @file" | Feature addition | Implement feature | Yes (Standard) |
| Error message / stack trace | Debugging | Activate debug specialist | Yes (Standard) |
| "why/how does X work" | Explanation | Explain with code refs | No (read-only) |
| "optimize/performance" | Optimization | Performance analysis | Yes (Standard) |

**Configuration:** See `smart-defaults.yaml` → `intent_patterns` for complete pattern definitions.

### Intent Detection Process

1. **Pattern Matching**
   - Scan input for trigger keywords/phrases
   - Match against defined intent patterns
   - Extract relevant parameters (file names, resource types)

2. **Context Analysis**
   - Identify file references (`@file`)
   - Detect error messages or stack traces
   - Recognize creation keywords

3. **Intent Confirmation** (if required)
   - Show detected intent
   - Request confirmation (Standard Mode)
   - Skip confirmation (Quick Mode or read-only actions)

4. **Action Execution**
   - Load appropriate context (agents/modules)
   - Execute detected action
   - Report results per communication mode

### Intent Confirmation Examples

**Standard Mode (Confirmation Required):**
```
Detected: You want to fix issues in @films.php

I'll identify and fix issues in the file(s). Proceed? [Y/n/different goal]
```

**Quick Mode (No Confirmation):**
```
→ Fixing @films.php...
✅ Fixed 1 issue (line 42: self-closing tag)
```

**Read-Only Actions (No Confirmation):**
```
Detected: Code review requested for @films.php

📋 Code Review: films.php
  - Found 3 potential issues
  - 2 style inconsistencies
  - 1 security consideration
```

### Customizing Intent Patterns

Intent patterns are defined in `smart-defaults.yaml`:

```yaml
intent_patterns:
  fix:
    triggers: ["fix", "repair", "broken", "not working", "error", "bug"]
    action: diagnose_and_fix
    confirm: "I'll identify and fix issues in the file(s). Proceed?"
```

To add new patterns:
1. Edit `smart-defaults.yaml` → `intent_patterns`
2. Define triggers, action, and confirmation message
3. Run `/sync` to update configurations

---

## 3. PRE-FLIGHT CHECKS

Pre-flight checks automatically scan generated code for common errors, security vulnerabilities, and code quality issues before applying changes.

### Purpose

Pre-flight checks prevent:
- **Security vulnerabilities** (XSS, SQL injection, etc.)
- **CouchCMS template errors** (parse errors, execution issues)
- **TypeScript type safety issues**
- **Code quality problems** (anti-patterns, maintainability issues)

### Configuration

All checks are defined in `preflight-checks.yaml`. The configuration includes:

- **Check definitions:** Pattern, severity, message, fix suggestion
- **Execution rules:** Which severities block, warn, or inform
- **Auto-fix support:** Which checks can be automatically fixed
- **File exclusions:** Patterns to skip (node_modules, vendor, etc.)

**Reference:** See `preflight-checks.yaml` for complete check definitions.

### Check Categories

#### CouchCMS Checks

Critical checks for CouchCMS template safety:

- **HTML Comment Security:** CouchCMS tags in comments are executed
- **Nested Embeds in Capture:** Causes template parse errors
- **Paired Else Tags:** Must be self-closing
- **Missing Extends:** Template structure issues
- **Missing Invoke:** Required template ending
- **Routable Context:** Proper context handling

**Severity Levels:**
- `CRITICAL` - Blocks code generation (e.g., HTML comment security)
- `ERROR` - Blocks code generation (e.g., paired else tags)
- `WARNING` - Shows warning (e.g., missing extends)

#### TypeScript Checks

Type safety and code quality:

- **Any Type:** Avoid `any` type usage
- **Console Log:** Production code cleanup
- **Missing Return Type:** Type annotation completeness
- **Non-Null Assertion:** Overuse detection

**Severity Levels:**
- `WARNING` - Type safety issues
- `INFO` - Code quality suggestions

#### Security Checks

Security vulnerability detection:

- **XSS (innerHTML):** Unsanitized HTML injection
- **eval() Usage:** Code injection risk
- **SQL Injection:** Direct query construction
- **Hardcoded Credentials:** Secrets in code
- **Missing CSRF:** Form security

**Severity Levels:**
- `CRITICAL` - Security vulnerabilities (blocks generation)

#### CSS/Tailwind Checks

Styling best practices:

- **Important Overuse:** CSS maintainability
- **Inline Styles:** Code organization

#### Alpine.js Checks

Alpine.js integration:

- **Missing x-cloak:** FOUC prevention
- **Complex Inline Expressions:** Code organization

#### General Code Quality

Maintainability checks:

- **Long Lines:** Readability
- **TODO Comments:** Documentation quality
- **Debug Markers:** Code cleanup

### Pre-Flight Execution Flow

Before applying any code changes:

1. **Determine Applicable Checks**
   - Identify file type and location
   - Load relevant check categories from `preflight-checks.yaml`
   - Filter by file patterns and exclusions

2. **Scan Generated Code**
   - Run all applicable regex patterns
   - Match against generated code
   - Collect all matches with line numbers

3. **Categorize by Severity**
   - Group matches by severity level
   - Apply execution rules from configuration
   - Prepare report

4. **Execute Based on Severity**
   - **CRITICAL/ERROR:** STOP - do not apply, show error
   - **WARNING:** WARN - show warning, ask to proceed
   - **INFO:** INFORM - show info, proceed automatically

5. **Auto-Fix (if available)**
   - Apply auto-fixes for supported checks
   - Show what was auto-fixed
   - Re-scan to verify fixes

### Pre-Flight Report Format

**Standard Mode:**
```
📋 Pre-Flight Check Results

✅ PASSED: 12 checks
⚠️ WARNINGS: 1
  - Line 45: console.log detected (INFO)
    Suggestion: Remove for production or use logger

❌ BLOCKED: 1 CRITICAL issue
  - Line 23: CouchCMS tag in HTML comment
    Current:  <!-- <cms:show title /> -->
    Required: <!-- [cms:show title /] -->
    Fix: Replace <cms: with [cms: in comments
    Auto-fix available: Yes

Apply auto-fix? [Y/n]
```

**Quick Mode:**
```
❌ BLOCKED: 1 CRITICAL (L23: HTML comment)
Auto-fix? [Y/n]
```

**Verbose Mode:**
```
📚 Pre-Flight Check Analysis

**File:** snippets/components/modal.html
**Checks Run:** 15 (CouchCMS: 6, Security: 4, General: 5)

**Results:**
✅ PASSED: 12 checks
  - Template structure: Valid
  - Security: No vulnerabilities
  - Type safety: N/A (not TypeScript)

⚠️ WARNINGS: 1
  - Line 45: console.log detected
    Severity: INFO
    Impact: Low - code quality suggestion
    Reference: preflight-checks.yaml → typescript.console_log

❌ BLOCKED: 1 CRITICAL issue
  - Line 23: CouchCMS tag in HTML comment
    Severity: CRITICAL
    Impact: High - CouchCMS will execute tags in comments, causing crashes
    Pattern: <!--[\\s\\S]*?<cms:[\\s\\S]*?-->
    Current: <!-- <cms:show title /> -->
    Required: <!-- [cms:show title /] -->
    Fix: Replace <cms: with [cms: inside HTML comments
    Auto-fix: Available
    Reference: preflight-checks.yaml → couchcms.html_comment_security

**Why This Matters:**
CouchCMS processes tags inside HTML comments, which can cause
unexpected behavior or template crashes. Always use [cms: syntax
in comments to prevent execution.

Apply auto-fix? [Y/n]
```

### Adding New Checks

To add a new pre-flight check:

1. **Edit `preflight-checks.yaml`**
   ```yaml
   category_name:
     check_name:
       pattern: "regex_pattern"
       severity: CRITICAL|ERROR|WARNING|INFO
       message: "Human-readable message"
       fix: "How to fix"
       auto_fix: true|false
       example:
         bad: "example of bad code"
         good: "example of good code"
       reference: "documentation reference"
   ```

2. **Test the check**
   - Create test case with bad code
   - Verify check detects it
   - Test auto-fix if applicable

3. **Update documentation**
   - Document the check in this file
   - Add to relevant module documentation
   - Update examples if needed

4. **Sync configurations**
   - Run `/sync` to update all AI agent configs
   - Verify check appears in all agents

---

## 4. COMMUNICATION MODES

### Quick Mode 🚀

**When:** Experienced user, simple tasks, batch operations

**Characteristics:**
- Minimal explanations
- No confirmations for standard actions
- Compact output format
- Maximum efficiency

**Enable:** `/quick` or prefix command with `/q`

**Example:**
```
User: /q /fix @films.php
AI: ✅ Fixed 1 issue (L42: else tag)
```

### Standard Mode 📋

**When:** Default mode, balanced interaction

**Characteristics:**
- Brief explanation per action
- Confirmation for significant changes
- Structured output
- Clear next steps

**Example:**
```
User: /fix @films.php
AI: 📋 Found 1 issue in films.php:
    - Line 42: Paired tags for self-closing element

    Fix: <cms:else></cms:else> → <cms:else />

    Apply? [Y/n]
```

### Verbose Mode 📚

**When:** Learning, debugging, complex issues

**Characteristics:**
- Full explanation with rationale
- Step-by-step process
- Educational context
- References to documentation

**Enable:** `/verbose` or prefix with `/v`

**Example:**
```
User: /v /fix @films.php
AI: 📚 Issue Analysis

    **File:** films.php, Line 42

    **Problem:** Using paired tags for <cms:else>

    **Why This Matters:**
    CouchCMS requires <cms:else> and <cms:else_if> to be
    self-closing tags. Using paired tags like <cms:else></cms:else>
    causes template parsing errors because the parser expects
    these tags to be void elements.

    **Reference:** modules/couchcms-core.md → "Self-Closing Tags"

    **Solution:**
    ```diff
    - <cms:else></cms:else>
    + <cms:else />
    ```

    Apply fix? [Y/n]
```

### Mode Persistence

- Mode persists for the entire session
- Reset with `/standard` or session restart
- Per-command override with prefix: `/v /fix @file`

---

## 5. SMART CONTEXT LOADING

Smart context loading automatically activates relevant AI agents and knowledge modules based on file type and location, ensuring appropriate guidance is always available.

### File Type Context

When a file is referenced, automatically load relevant context per `smart-defaults.yaml` → `file_contexts`:

| File Pattern | Auto-Load Agents | Auto-Load Modules | Pre-Flight Checks |
|--------------|------------------|-------------------|-------------------|
| `*.php` | couchcms | couchcms-core | html-comment-security, template-structure |
| `*.ts` | typescript | typescript | type-safety, no-any |
| `*.js` | typescript | typescript | deprecated-patterns |
| `snippets/components/*.html` | couchcms, alpinejs | couchcms-core, alpinejs | alpine-integration, component-structure |
| `snippets/views/**/*.html` | couchcms | couchcms-core | view-structure, seo-tags |
| `snippets/forms/*.html` | databound-forms, couchcms | databound-forms, couchcms-core | csrf, validation, ownership |
| `snippets/filters/*.html` | couchcms | couchcms-core | security-filter |
| `snippets/layouts/*.html` | couchcms, tailwindcss | couchcms-core, tailwindcss, daisyui | layout-structure, accessibility |
| `assets/css/**/*.css` | tailwindcss | tailwindcss, daisyui | css-quality |
| `config/*.php` | couchcms | couchcms-core | config-security |

**Configuration:** See `smart-defaults.yaml` → `file_contexts` for complete mappings.

### Context Loading Process

1. **File Pattern Matching**
   - Match file path against patterns in `file_contexts`
   - Find most specific match (more specific patterns take precedence)
   - Extract context configuration

2. **Agent Activation**
   - Load specified agents (e.g., `agents/couchcms.md`)
   - Activate agent-specific guidance and patterns
   - Enable agent-specific checks and suggestions

3. **Module Loading**
   - Load specified knowledge modules (e.g., `modules/couchcms-core.md`)
   - Provide framework-specific patterns and best practices
   - Enable module-specific validation

4. **Check Activation**
   - Activate relevant pre-flight checks
   - Filter checks by file type and location
   - Prepare check execution

5. **Suggestion Preparation**
   - Load file-type-specific suggestions
   - Prepare after-action recommendations
   - Enable proactive improvements

### Project Context Caching

At session start, if `.project/context-cache.json` exists:

**Cache Benefits:**
- **Performance:** Skip reconnaissance for known files
- **Consistency:** Use cached project structure
- **Speed:** Faster context loading

**Cache Structure:**
```json
{
  "lastUpdated": "2025-01-15T10:30:00Z",
  "projectStructure": {
    "templates": ["list of template files"],
    "components": ["list of component files"],
    "views": ["list of view files"]
  },
  "dependencies": {
    "cms": "CouchCMS 2.4",
    "css": "TailwindCSS 4.0",
    "js": "Alpine.js 3.13"
  },
  "patterns": {
    "authentication": "snippets/filters/authenticated.html",
    "ownership": "snippets/filters/owns_project.html"
  },
  "recentChanges": [
    {
      "file": "snippets/components/modal.html",
      "type": "modified",
      "date": "2025-01-15T09:00:00Z"
    }
  ]
}
```

**Cache Updates:**
- Cache is updated after significant changes
- Manual refresh: Delete cache file to force regeneration
- Automatic refresh: After major refactoring or structure changes

**Configuration:** See `smart-defaults.yaml` → `context_cache_schema` for complete schema.

---

## 6. AFTER-ACTION SUGGESTIONS

After completing an action, proactively suggest related improvements to maintain system consistency and quality.

### Purpose

After-action suggestions help:
- **Maintain consistency:** Update all related files
- **Improve quality:** Add tests, documentation, or improvements
- **Prevent regressions:** Identify similar issues or patterns
- **Enhance maintainability:** Suggest refactoring opportunities

### Trigger Conditions

Suggestions are triggered based on action type and context, defined in `smart-defaults.yaml` → `suggestion_triggers`:

| Action Completed | Condition Check | Suggestion |
|------------------|-----------------|------------|
| Fixed bug | Has similar issues | "Fix similar issues in {count} other files?" |
| Fixed bug | Missing test | "Add regression test?" |
| Fixed bug | Missing documentation | "Update documentation?" |
| Created component | Always | "Register in component index?" |
| Created component | Has CSS | "Extract styles to CSS file?" |
| Modified shared code | Has consumers | "Verify {count} consumers still work?" |
| Modified shared code | Has tests | "Run related tests?" |
| Refactored file | Similar patterns | "Apply same refactoring to {count} similar files?" |

**Configuration:** See `smart-defaults.yaml` → `suggestion_triggers` for complete definitions.

### Suggestion Format

**Standard Mode:**
```
✅ Action complete.

💡 Related actions:
   [1] Update 3 other files using this component
   [2] Add unit test for this function
   [3] Check for similar patterns in 5 files
   [n] Skip

Choice [n]:
```

**Quick Mode:**
```
✅ Done. 💡 3 related files may need update. Run /update-related? [y/N]
```

**Verbose Mode:**
```
✅ Action complete.

**Summary:**
- Fixed 2 issues in modal.html
- Applied pre-flight auto-fixes
- All quality gates passed

💡 Related actions:

[1] Update 3 other files using this component
    Files: card.html, button.html, badge.html
    Reason: Component signature changed
    Impact: Medium - may need parameter updates

[2] Add unit test for this function
    Function: validateModal()
    Reason: New validation logic added
    Impact: High - prevents regression

[3] Check for similar patterns in 5 files
    Pattern: Self-closing tag usage
    Files: Found in 5 component files
    Impact: Low - consistency improvement

[n] Skip all suggestions

Choice [n]:
```

### Suggestion Behavior

**User Control:**
- User can always skip suggestions
- User can override with explicit instructions
- User can request different approach

**Smart Filtering:**
- Suggestions are filtered by relevance
- Only show actionable suggestions
- Prioritize high-impact improvements

**Context Awareness:**
- Suggestions consider file type and location
- Account for project structure
- Respect project standards

---

## INTEGRATION

### Framework Integration

This module integrates with:

- **Operational Doctrine:** `framework/doctrine/operational-doctrine.md`
  - Smart Operations is referenced in Section B.6
  - All commands follow doctrine principles
  - Verification and reporting align with doctrine

- **Playbooks:** `framework/playbooks/`
  - `request.md` - Feature requests use smart operations
  - `refresh.md` - Bug fixes leverage intent detection
  - `retro.md` - Retrospectives document smart operations usage

- **Project Standards:** `docs/standards.md`
  - Pre-flight checks enforce standards
  - Context loading provides standards-aware guidance
  - Suggestions promote standards compliance

- **Directives:** `framework/directives/`
  - Communication modes align with concise directive
  - Professional tone maintained in all modes
  - Output format follows communication guidelines

### Execution Priority

When processing user input, follow this priority:

1. **Parse slash commands** → Execute immediately if found
2. **Detect intent** → Match against intent patterns
3. **Load context** → Activate agents/modules based on file type
4. **Run pre-flight checks** → Before any code modification
5. **Apply communication mode** → Format all output appropriately
6. **Offer after-action suggestions** → Proactive improvements

### Override Rules

**User Overrides:**
- User can always override suggestions with explicit instructions
- User can skip confirmations with explicit approval
- User can request different approach at any time

**Safety Overrides:**
- **CRITICAL pre-flight issues** cannot be bypassed without explicit `/force`
- **ERROR pre-flight issues** cannot be bypassed without explicit `/force`
- **WARNING issues** can be bypassed with user confirmation
- **INFO issues** are informational only, no blocking

**Mode Overrides:**
- Mode settings persist for entire session
- Per-command override: `/v /fix @file` (verbose for this command only)
- Reset to default: `/standard`

### Configuration Management

**Configuration Files:**
- `preflight-checks.yaml` - All pre-flight check definitions
- `smart-defaults.yaml` - Context loading and intent patterns
- `docs/standards.md` - Project standards (referenced by checks)

**Updating Configurations:**
1. Edit configuration files
2. Run `/sync` to update all AI agent configs
3. Verify changes in test scenarios
4. Document changes if needed

**Version Control:**
- Configuration files are version-controlled
- Changes should be reviewed and tested
- Breaking changes require migration notes

---

## QUICK REFERENCE

### Commands

**Code Modification:**
```
/fix @file          Fix issues in file
/refactor @file     Refactor file
/review @file       Code review (read-only)
/optimize @file     Performance optimization
```

**Creation:**
```
/component <name>   Create component bundle
/view <name>        Create view with routing
/form <name>        Create DataBound Form
/api <name>         Create JSON API endpoint
```

**Workflow:**
```
/sync               Sync AI configs
/validate           Validate project compliance
/status             Show project status summary
```

### Communication Modes

```
/quick or /q        Minimal output, maximum efficiency
/verbose or /v      Detailed explanations, educational
/standard           Default balanced mode
```

### Modifiers

```
/force              Bypass warnings (not criticals/errors)
/dry-run            Show changes without applying
```

### Intent Patterns

Common natural language patterns that trigger automatic actions:

- `@file` only → Code review
- `@file` + "fix/repair/broken" → Bug fix
- `@file` + "refactor" → Refactoring
- "new/create/make component X" → Component creation
- Error message / stack trace → Debugging
- "why/how does X work" → Explanation

### Configuration Files

- `preflight-checks.yaml` - Pre-flight check definitions
- `smart-defaults.yaml` - Context loading and intent patterns
- `docs/standards.md` - Project standards

### Essential References

- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Playbooks: `framework/playbooks/`
- Project Standards: `docs/standards.md`
- Testing Guide: `framework/docs/testing.md`

---

**Smart Operations: Enhancing AI productivity through intelligent automation.**
