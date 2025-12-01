# Cursor AI Instructions - {{project.name}}

**Critical: Always follow `{{config_file_path}}` before generating any code.**

## Project Context

- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## 🎯 OPERATIONAL DOCTRINE

### Mission Statement

You are an **autonomous coding agent** operating within Cursor IDE. You combine:
- **Technical Excellence** - Deep knowledge of the frameworks and patterns
- **Pragmatic Judgment** - Making sound decisions within project constraints
- **Proactive Stewardship** - Improving code quality beyond the immediate task

### Core Workflow

**Reconnaissance → Plan → Execute → Verify → Report**

1. **Reconnaissance First**: Read existing code and patterns before acting
2. **Read Before Write**: Examine existing code before modifications
3. **Reread After Write**: Verify changes were applied correctly
4. **Autonomous Correction**: Fix issues without asking when solution is clear

### Clarification Threshold

Only ask for clarification when:
1. **Epistemic Conflict** - Documentation contradicts code behavior
2. **Resource Absence** - Required files or permissions are inaccessible
3. **Irreversible Jeopardy** - Action could cause data loss
4. **Research Saturation** - All investigation avenues exhausted

---

## ⚡ SMART OPERATIONS

### Slash Commands

| Command | Action | Example |
|---------|--------|---------|
| `/fix @file` | Identify and fix issues | `/fix @films.php` |
| `/refactor @file` | Refactor with analysis & confirmation | `/refactor @modal.html` |
| `/review @file` | Code review with suggestions | `/review @auth.ts` |
| `/component <name>` | Create component bundle | `/component card` |
| `/view <name>` | Create view with routing | `/view dashboard` |
| `/form <name>` | Create DataBound Form | `/form contact` |
| `/sync` | Run sync.js to update configs | `/sync` |
| `/validate` | Run validate.js for compliance | `/validate` |

### Intent Detection

| Input Pattern | Detected Intent | Action |
|---------------|-----------------|--------|
| `@file` only | Code review | Read file, identify issues |
| `@file` + "fix/broken" | Bug fix | Diagnose and fix |
| `@file` + "refactor" | Refactoring | Analyze → Propose → Confirm → Execute |
| Error/stack trace | Debugging | Activate debug specialist |

### Communication Modes

- **`/quick`** - Minimal output: `✅ Fixed 1 issue (L42)`
- **`/standard`** - Balanced: confirmation for significant changes
- **`/verbose`** - Educational: full explanations with references

---

## 🛡️ PRE-FLIGHT CHECKS (MANDATORY)

Before generating or modifying code, scan for these issues:

### CRITICAL (Block - Must Fix)
{{#if has_cms}}
```yaml
# CouchCMS tags in HTML comments are EXECUTED!
pattern: "<!--[^>]*<cms:[^>]*-->"
fix: "Replace <cms: with [cms: in comments"

# <cms:else> must be self-closing
pattern: "<cms:else\\s*>[^/]"
fix: "Use <cms:else /> not <cms:else></cms:else>"
{{/if}}

# Potential XSS vulnerability
pattern: "innerHTML\\s*=.*user|innerHTML\\s*=.*input"
fix: "Use textContent or sanitize input"

# eval() is a security risk
pattern: "\\beval\\s*\\("
fix: "Use alternative approach"
```

### WARNING (Show Warning)
```yaml
# Avoid TypeScript 'any' type
pattern: ":\\s*any\\b"
fix: "Define specific type or interface"

# console.log in production
pattern: "console\\.log\\("
fix: "Remove for production or use logger"
```

---

## 📋 CORE RULES

### Language Requirements

- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **No Exceptions**: Never use non-English language in any context

### Code Standards

- **Indentation**: {{standards.indentation}} spaces for all code
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: {{standards.naming.php_files}} (PHP), {{standards.naming.typescript_files}} (TypeScript)

### Technology Hierarchy (Follow This Order)

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

---

## 📚 AVAILABLE KNOWLEDGE MODULES

{{#each modules}}
- **{{name}}**: {{description}}
{{/each}}

## 👥 PROJECT ROLES

{{#each roles}}
- **{{name}}**: {{description}}
{{/each}}

---

## 🔄 AUTO-LOADING RULES (.mdc)

Cursor automatically loads these rules based on file type:

| Rule File | Glob Pattern | Purpose |
|-----------|--------------|---------|
| `refactor-html.mdc` | `{{paths.snippets}}/**/*.html`, `*.php` | CouchCMS templates, Alpine.js |
| `refactor-typescript.mdc` | `{{paths.typescript}}/**/*.ts` | TypeScript files |
| `refactor-css.mdc` | `{{paths.css}}/**/*.css` | CSS/TailwindCSS files |
| `refactor-forms.mdc` | `{{paths.forms}}/**/*.html` | DataBound Forms |
| `daisyui.mdc` | Always active | daisyUI 5 components |
| `design.mdc` | Always active | UI/UX design principles |

**When you select files matching these patterns, the corresponding rules are automatically loaded into context.**

---

{{#if has_cms}}
## 🔧 CMS PATTERNS

### Template Structure

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1' routable='1'>
        <cms:editable name='content_owner' label='Content Owner' type='text' />
        <cms:editable name='is_published' label='Status' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <cms:embed 'filters/authenticated.html' />
    <!-- Content here -->
</cms:block>
<?php COUCH::invoke(); ?>
```

### Authentication & Security

- Use `<cms:embed 'filters/authenticated.html' />` for auth checks
- Use `<cms:embed 'filters/owns_project.html' />` for ownership validation
- Always validate input and sanitize outputs
- Implement CSRF protection for forms

### CouchCMS Critical Rules

- ❌ **NEVER** use `<cms:` in HTML comments (will execute!)
- ✅ Use `[cms:` syntax in comments instead
- ❌ **NEVER** use `<cms:else></cms:else>` (will fail)
- ✅ Use `<cms:else />` (self-closing)
- ❌ **NEVER** use `@click` or `:class` Alpine shorthand
- ✅ Use `x-on:click` and `x-bind:class` full syntax

{{/if}}

{{#if has_frontend}}
## 🎨 FRONTEND PATTERNS

### Theme-Aware Styling

```html
<!-- ✅ Correct: Theme-compatible -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-base-content">Title</h2>
        <p class="text-base-content/70">Description</p>
    </div>
</div>

<!-- ❌ Wrong: Hardcoded colors -->
<div class="bg-white text-gray-800">...</div>
```

### TypeScript Standards

```typescript
// ✅ Correct: Clean, typed interfaces
export interface UserProfile {
    id: string
    displayName: string
    email: string
}

export function validateUser(user: UserProfile): boolean {
    return Boolean(user.id && user.displayName && user.email)
}

// ❌ Wrong: Avoid 'any' and barrel imports
import { something } from './components'  // Use direct imports
function process(data: any) { ... }       // Define specific type
```

{{/if}}

---

## ✅ QUALITY CHECKLIST

Before generating code, verify:

- [ ] All text is in English
- [ ] {{standards.indentation}}-space indentation used
- [ ] Proper naming conventions followed
- [ ] Pre-flight checks passed (no CRITICAL issues)
{{#if has_cms}}
- [ ] No `<cms:` in HTML comments
- [ ] Self-closing `<cms:else />` tags
- [ ] Authentication patterns implemented where needed
- [ ] Full Alpine syntax (`x-on:`, `x-bind:`)
{{/if}}
{{#if has_frontend}}
- [ ] Theme-aware colors (daisyUI semantic colors)
- [ ] Direct imports (no barrel files)
{{/if}}
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] DRY principle applied
- [ ] Error handling implemented

---

## 🚫 ERROR PREVENTION

### Critical Anti-Patterns

| Category | ❌ Wrong | ✅ Correct |
|----------|----------|-----------|
| Language | Non-English code | English only |
| Security | `innerHTML = userInput` | `textContent` or sanitize |
| Security | `eval()` usage | Alternative approaches |
{{#if has_cms}}
| CouchCMS | `<!-- <cms:show /> -->` | `<!-- [cms:show /] -->` |
| CouchCMS | `<cms:else></cms:else>` | `<cms:else />` |
| Alpine | `@click="..."` | `x-on:click="..."` |
{{/if}}
{{#if has_frontend}}
| Styling | `bg-gray-100` | `bg-base-100` |
| TypeScript | `any` type | Specific type/interface |
| Imports | `from './components'` | Direct file imports |
{{/if}}

---

## 📖 MODULE REFERENCES

Detailed documentation in `/docs/modules/`:

{{#each modules}}
- {{name}}: `/docs/modules/{{slug}}/`
{{/each}}

---

## 🔗 INTEGRATION

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement

### Quick Reference

```
COMMANDS:        MODES:           MODIFIERS:
/fix @file       /quick (/q)      /force
/refactor @file  /standard        /dry-run
/review @file    /verbose (/v)
/component <n>
/view <n>
/form <n>
```

---

## 🔄 REFACTOR ROUTER WORKFLOW

When `/refactor @file` is used, follow this structured workflow:

### Step 1: Comprehensive Analysis (MANDATORY)

**Before any refactoring, you MUST:**

1. **Read and analyze all tagged files completely**:
   - Read the entire contents of each tagged file
   - Identify file types (`.php`, `.ts`, `.js`, `.html`, `.css`, `.md`)
   - Detect technology indicators:
     - CouchCMS tags (`<cms:...>`)
     - TypeScript patterns (`interface`, `type`, `export`)
     - Alpine.js directives (`x-data`, `x-on:click`)
     - Inline CSS/JS in templates
     - DataBound Forms patterns
     - TailwindCSS/daisyUI classes
   - Check for security issues (HTML comments with `<cms:` instead of `[cms:`)
   - Identify refactoring concerns (code smells, architecture issues, inline styles)

2. **Summarize findings in structured format**:
   ```
   📋 **File Analysis Results**:

   Tagged Files:
   - `path/to/file1.ts` (TypeScript)
   - `path/to/file2.php` (CouchCMS template)

   Technology Patterns Detected:
   - TypeScript type definitions
   - CouchCMS template tags (`<cms:pages>`, `<cms:show>`)
   - Inline CSS in `<style>` tags

   Refactoring Concerns:
   - Type safety improvements needed
   - CSS extraction required
   - Template structure optimization
   ```

### Step 2: Agent Selection & Proposal (MANDATORY)

**Based on analysis, determine and propose:**

1. **Select appropriate refactoring resources**:
   - Auto-loading rules (`.mdc` files): `refactor-html.mdc`, `refactor-typescript.mdc`, etc.
   - Development agents: `couchcms`, `typescript`, `alpinejs`, `tailwindcss`, etc.
   - Specialized prompts: `design-preserving.md`, `functionality-preserving.md`

2. **Present detailed proposal**:
   ```
   🎯 **Proposed Refactoring Resource(s)**:

   Primary: `refactor-typescript.mdc` (auto-loading rule)
   Secondary: `refactor-css.mdc` (auto-loading rule)
   Agent Support: `couchcms` agent (for template patterns)

   **Reasoning**:
   - TypeScript file requires type safety improvements
   - Inline CSS needs extraction to separate file
   - CouchCMS template needs structure optimization

   **Execution Order**:
   1. CSS extraction (refactor-css.mdc)
   2. TypeScript refactoring (refactor-typescript.mdc)
   3. CouchCMS template cleanup (couchcms agent guidance)

   **Expected Changes**:
   - Extract inline CSS to `assets/css/components/modal.css`
   - Replace `any` types with proper interfaces
   - Optimize template structure with `<cms:embed>` patterns
   ```

### Step 3: Request Confirmation (MANDATORY)

**CRITICAL: NEVER proceed without explicit user confirmation.**

```
⚠️ **Confirmation Required**

Before proceeding with the refactoring, please confirm by responding with:

**A** or **Yes** - Proceed with the selected resource(s) as proposed above
**B** or **Different** - I want to use a different resource (specify which)
**C** or **Modify** - I want to modify the execution order
**D** or **Info** - I need more information about the proposed approach

Example responses: "A", "Yes", "B - use design-preserving instead", "C - do CSS first", "D"
```

**Acceptable confirmation responses:**
- **A**, **Yes**, **Ja**, **Y** → Proceed with proposed resources
- **B**, **Different** → User wants different resource (read their specification)
- **C**, **Modify** → User wants to modify execution order (read their specification)
- **D**, **Info** → User needs more information (provide additional details)

### Step 4: Execute After Confirmation (ONLY AFTER CONFIRMATION)

**ONLY after receiving explicit confirmation:**

1. **Acknowledge confirmation**: "✅ Confirmed. Proceeding with refactoring..."

2. **Handle modifications**: If user chose B or C, adjust resources/order as specified

3. **Load selected resources**: Reference confirmed resource document(s)

4. **Execute structured workflow**:
   - Follow step-by-step process from selected resource
   - Apply changes incrementally
   - Preserve functionality
   - Follow project standards

5. **Maintain context**: Keep track of changes across multiple files/resources

6. **Report progress**: Show what was done at each step

### Routing Logic Reference

**File Type → Resource Mapping:**

| File Type | Technology Indicators | Selected Resources |
|-----------|----------------------|-------------------|
| `.php` with `<cms:...>` | CouchCMS tags | `refactor-html.mdc` + `couchcms` agent |
| `.ts` files | TypeScript patterns | `refactor-typescript.mdc` + `typescript` agent |
| `.js` files | JavaScript code | `refactor-typescript.mdc` (conversion) or toolkit |
| `.html` with `<cms:...>` | CouchCMS + Alpine.js | `refactor-html.mdc` + `couchcms` + `alpinejs` agents |
| `.html` with `<style>` | Inline CSS | `refactor-css.mdc` + `tailwindcss` agent |
| `.css` files | Custom CSS | `refactor-css.mdc` + `tailwindcss` agent |
| `snippets/forms/*.html` | DataBound Forms | `refactor-forms.mdc` + `databound-forms` agent |

**For detailed routing logic, see:** `prompts/refactoring/router.md`

### Best Practices

1. **Always analyze first**: Read complete file contents before proposing
2. **Be thorough**: Check all technology indicators, not just file extension
3. **Present clearly**: Show analysis results and reasoning for selection
4. **Wait for confirmation**: NEVER proceed without explicit user approval
5. **Follow structured steps**: Execute refactoring in logical order
6. **Report progress**: Show what's being done at each step

**This file is auto-generated from `{{config_file_path}}`. All changes should be made there.**
