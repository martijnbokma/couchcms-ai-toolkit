# SMART OPERATIONS - Enhanced AI Efficiency Layer

## Purpose

This module enhances AI productivity through:
1. **Quick Actions** - Slash commands for common tasks
2. **Intent Detection** - Automatic understanding of user goals
3. **Pre-flight Checks** - Proactive error prevention
4. **Communication Modes** - Progressive disclosure

---

## 1. QUICK ACTIONS (Slash Commands)

### Code Modification Commands

| Command | Action | Example |
|---------|--------|---------|
| `/fix @file` | Identify and fix issues | `/fix @films.php` |
| `/refactor @file` | Refactor using router | `/refactor @modal.html` |
| `/review @file` | Code review with suggestions | `/review @auth.ts` |
| `/optimize @file` | Performance optimization | `/optimize @main.ts` |

### Creation Commands

| Command | Action | Output |
|---------|--------|--------|
| `/component <name>` | Create component bundle | HTML + CSS + TS |
| `/view <name>` | Create view with routing | View templates |
| `/form <name>` | Create DataBound Form | Form + validation |
| `/api <name>` | Create JSON API endpoint | API template |

### Workflow Commands

| Command | Action |
|---------|--------|
| `/sync` | Run sync.js to update configs |
| `/validate` | Run validate.js for compliance |
| `/status` | Show project status summary |
| `/quick` | Enable quick mode (minimal output) |
| `/verbose` | Enable verbose mode (detailed) |
| `/standard` | Reset to standard mode |

### Command Processing

When a slash command is detected:

1. **Parse command and arguments**
2. **Validate command exists**
3. **Execute corresponding action**
4. **Report result concisely**

```
User: /fix @snippets/components/modal.html

AI Response:
✅ Fixed 2 issues in modal.html:
  - Line 12: <cms:else></cms:else> → <cms:else />
  - Line 45: HTML comment with <cms: → [cms:
```

---

## 2. INTENT DETECTION

### Automatic Intent Recognition

When user input is received, analyze for intent patterns:

| Input Pattern | Detected Intent | Auto-Action |
|---------------|-----------------|-------------|
| `@file` only (no text) | Code review | Read file, identify issues |
| `@file` + "fix/repair/broken" | Bug fix | Diagnose and fix |
| `@file` + "refactor" | Refactoring | Activate refactor router |
| "new/create/make component X" | Component creation | Create bundle |
| "add X to @file" | Feature addition | Implement feature |
| Error message / stack trace | Debugging | Activate debug specialist |
| "why/how does X work" | Explanation | Explain with code refs |

### Intent Confirmation (Quick Mode OFF)

```
Detected: You want to fix issues in @films.php
Proceed? [Y/n/different goal]
```

### Intent Execution (Quick Mode ON)

```
→ Fixing @films.php...
✅ Fixed 1 issue (line 42: self-closing tag)
```

---

## 3. PRE-FLIGHT CHECKS

### Mandatory Checks Before Code Generation

Every code modification MUST pass these checks:

#### CouchCMS Critical Checks

```yaml
couchcms_checks:
  html_comment_security:
    pattern: "<!--[^>]*<cms:[^>]*-->"
    severity: CRITICAL
    message: "CouchCMS tags in HTML comments are EXECUTED!"
    fix: "Replace <cms: with [cms: in comments"
    auto_fix: true

  nested_embed_in_capture:
    pattern: "<cms:capture[^>]*>[\\s\\S]*<cms:embed[^>]*>"
    severity: CRITICAL
    message: "Nested <cms:embed> in <cms:capture> causes parse errors"
    fix: "Use inline markup instead of embed"

  paired_else_tags:
    pattern: "<cms:else\\s*>[^/]|<cms:else_if[^/]*>[^/]"
    severity: ERROR
    message: "<cms:else> and <cms:else_if> must be self-closing"
    fix: "Use <cms:else /> instead of <cms:else></cms:else>"
    auto_fix: true

  missing_extends:
    pattern: "^<\\?php require_once.*cms\\.php.*\\?>[^<]*<cms:(?!extends)"
    severity: WARNING
    message: "Template may be missing <cms:extends> for layout inheritance"
```

#### TypeScript Checks

```yaml
typescript_checks:
  any_type:
    pattern: ":\\s*any\\b"
    severity: WARNING
    message: "Avoid 'any' type - define specific type or interface"

  console_log:
    pattern: "console\\.log\\("
    severity: INFO
    message: "console.log detected - remove for production"

  missing_return_type:
    pattern: "function\\s+\\w+\\([^)]*\\)\\s*{"
    severity: WARNING
    message: "Function missing return type annotation"
```

#### Security Checks

```yaml
security_checks:
  xss_innerhtml:
    pattern: "innerHTML\\s*=.*\\$|innerHTML\\s*=.*user|innerHTML\\s*=.*input"
    severity: CRITICAL
    message: "Potential XSS vulnerability - use textContent or sanitize"

  eval_usage:
    pattern: "\\beval\\s*\\("
    severity: CRITICAL
    message: "eval() is a security risk - use alternative approach"

  sql_injection:
    pattern: "\\$_(GET|POST|REQUEST).*query|\\$_(GET|POST|REQUEST).*sql"
    severity: CRITICAL
    message: "Potential SQL injection - use parameterized queries"
```

### Pre-Flight Execution

Before applying any code changes:

1. **Scan generated code against all applicable checks**
2. **STOP on CRITICAL issues** - do not apply, show error
3. **WARN on WARNING issues** - show warning, ask to proceed
4. **INFO on INFO issues** - show info, proceed automatically
5. **Apply auto-fix where available and approved**

### Pre-Flight Report Format

```
📋 Pre-Flight Check Results

✅ PASSED: 12 checks
⚠️ WARNINGS: 1
  - Line 45: console.log detected (INFO)

❌ BLOCKED: 1 CRITICAL issue
  - Line 23: CouchCMS tag in HTML comment
    Current:  <!-- <cms:show title /> -->
    Required: <!-- [cms:show title /] -->

Apply auto-fix? [Y/n]
```

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

### File Type Context

When a file is referenced, automatically load relevant context:

| File Pattern | Auto-Load |
|--------------|-----------|
| `*.php` | couchcms agent, couchcms-core module |
| `*.ts` | typescript agent, typescript module |
| `snippets/forms/*.html` | databound-forms agent + module |
| `snippets/components/*.html` | couchcms + alpinejs agents |
| `assets/css/*.css` | tailwindcss agent + module |

### Project Context

At session start, if `.project/context-cache.json` exists:
- Load cached project structure
- Skip reconnaissance for known files
- Update cache after significant changes

---

## 6. AFTER-ACTION SUGGESTIONS

After completing an action, proactively suggest related improvements:

### Trigger Conditions

| Action Completed | Suggest |
|------------------|---------|
| Fixed bug | "Add regression test?" |
| Created component | "Register in component index?" |
| Modified shared code | "Update {n} other files using this?" |
| Refactored file | "Similar patterns in {n} files - refactor?" |

### Suggestion Format (Standard Mode)

```
✅ Action complete.

💡 Related actions:
   [1] Update 3 other files using this component
   [2] Add unit test for this function
   [n] Skip

Choice [n]:
```

### Suggestion Format (Quick Mode)

```
✅ Done. 💡 3 related files may need update. Run /update-related? [y/N]
```

---

## INTEGRATION

This module integrates with:
- `01-core.md` - Operational doctrine (reconnaissance, execution)
- `05-concise.md` - Communication style (applies to all modes)
- `06-no-absolute-right.md` - Professional tone

### Execution Priority

1. Parse input for slash commands → execute if found
2. Detect intent from natural language
3. Run pre-flight checks before any modification
4. Apply communication mode to all output
5. Offer after-action suggestions

### Override Rules

- User can always override suggestions with explicit instructions
- Critical pre-flight issues cannot be bypassed without explicit `/force`
- Mode settings persist but can be overridden per-command

---

## QUICK REFERENCE

```
COMMANDS:
/fix @file          Fix issues in file
/refactor @file     Refactor file
/review @file       Code review
/component <name>   Create component
/view <name>        Create view
/form <name>        Create form
/sync               Sync AI configs
/validate           Validate project

MODES:
/quick or /q        Minimal output
/verbose or /v      Detailed output
/standard           Default mode

MODIFIERS:
/force              Bypass warnings (not criticals)
/dry-run            Show changes without applying
