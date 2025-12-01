# Windsurf AI Rules - {{project.name}}

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Project Context

- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## 🎯 WINDSURF BEHAVIOR

### Cascade Philosophy

You are an intelligent AI coding agent with Cascade capabilities. Your actions must:
- **Follow Project Standards** - All code aligns with `/docs/standards.md`
- **Be Contextually Aware** - Understand file type and project structure
- **Prioritize Safety** - Never generate code with security vulnerabilities
- **Match Existing Patterns** - Follow established code conventions
- **Be Proactive** - Suggest improvements when patterns can be optimized

### Cascade Priorities

1. Understand task context fully before acting
2. Match established project patterns
3. Use proper naming conventions
4. Include error handling
5. Ensure type safety
6. Follow accessibility standards (WCAG 2.1 AA)

---

## ⚡ SMART OPERATIONS

### Workflow Commands

| Command | Action | Example |
|---------|--------|---------|
| `/fix @file` | Identify and fix issues | `/fix @films.php` |
| `/refactor @file` | Refactor using router | `/refactor @modal.html` |
| `/review @file` | Code review with suggestions | `/review @auth.ts` |
| `/component <name>` | Create component bundle | `/component card` |
| `/view <name>` | Create view with routing | `/view dashboard` |
| `/form <name>` | Create DataBound Form | `/form contact` |

### Intent Detection

| Input Pattern | Detected Intent | Action |
|---------------|-----------------|--------|
| `@file` only | Code review | Read file, identify issues |
| `@file` + "fix/broken" | Bug fix | Diagnose and fix |
| `@file` + "refactor" | Refactoring | Activate refactor router |
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
pattern: "<cms:else></cms:else>"
fix: "Use <cms:else /> instead"

# Alpine shorthand breaks CouchCMS
pattern: "@click|:class|:disabled"
fix: "Use x-on:click and x-bind:class"
{{/if}}

# XSS vulnerability
pattern: "innerHTML\\s*=.*user|innerHTML\\s*=.*input"
fix: "Use textContent or sanitize input"

# eval() security risk
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

## 📋 CODE STANDARDS

### Language Requirements

- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **No Exceptions**: Never use non-English language in any context

### Formatting Standards

- **Indentation**: {{standards.indentation}} spaces
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: {{standards.naming.php_files}} (PHP), {{standards.naming.typescript_files}} (TypeScript)

### Technology Hierarchy

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

---

## 📚 KNOWLEDGE MODULES

{{#each modules}}
- **{{name}}**: {{description}}
{{/each}}

## 👥 PROJECT ROLES

{{#each roles}}
- **{{name}}**: {{description}}
{{/each}}

---

{{#if has_cms}}
## 🔧 CMS PATTERNS

### Template Structure

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1' routable='1'>
        <cms:editable name='content_owner' type='text' />
        <cms:editable name='is_published' type='dropdown' values='0=Draft|1=Published' />
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

### Critical CouchCMS Rules

| Context | ❌ Never Generate | ✅ Always Generate |
|---------|-------------------|-------------------|
| Comments | `<!-- <cms:show /> -->` | `<!-- [cms:show /] -->` |
| Conditionals | `<cms:else></cms:else>` | `<cms:else />` |
| Alpine events | `@click="..."` | `x-on:click="..."` |
| Alpine bindings | `:class="..."` | `x-bind:class="..."` |

{{/if}}

{{#if has_frontend}}
## 🎨 FRONTEND PATTERNS

### Theme-Aware Styling

```html
<!-- ✅ Generate theme-compatible colors -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-base-content">Title</h2>
        <p class="text-base-content/70">Description</p>
    </div>
</div>

<!-- ❌ Never generate hardcoded colors -->
<div class="bg-white text-gray-800">...</div>
```

### TypeScript Standards

```typescript
// ✅ Generate with proper typing
export interface UserProfile {
    id: string
    displayName: string
    email: string
}

export function validateUser(user: UserProfile): boolean {
    return Boolean(user.id && user.displayName && user.email)
}

// ❌ Never generate 'any' type
function process(data: any): any { ... }
```

{{/if}}

---

## ✅ QUALITY CHECKLIST

Before generating code:

- [ ] All text is in English
- [ ] {{standards.indentation}}-space indentation
- [ ] Proper naming conventions
- [ ] Pre-flight checks passed (no CRITICAL issues)
{{#if has_cms}}
- [ ] No `<cms:` in HTML comments
- [ ] Self-closing `<cms:else />` tags
- [ ] Full Alpine syntax (`x-on:`, `x-bind:`)
{{/if}}
{{#if has_frontend}}
- [ ] Theme-aware colors (daisyUI semantic)
- [ ] Direct imports (no barrel files)
- [ ] Proper TypeScript types (not `any`)
{{/if}}
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Error handling implemented

---

## 🚫 ANTI-PATTERNS

| Category | ❌ Never Generate | ✅ Always Generate |
|----------|-------------------|-------------------|
| Language | Non-English code | English only |
| Security | `innerHTML = userInput` | `textContent` or sanitize |
| Security | `eval()` usage | Alternative approaches |
{{#if has_cms}}
| CouchCMS | `<!-- <cms: -->` | `<!-- [cms: /] -->` |
| CouchCMS | `<cms:else></cms:else>` | `<cms:else />` |
| Alpine | `@click` shorthand | `x-on:click` |
{{/if}}
{{#if has_frontend}}
| Styling | `bg-gray-100` | `bg-base-100` |
| TypeScript | `any` type | Specific interface |
| Imports | `from './components'` | Direct file imports |
{{/if}}

---

## 🔗 INTEGRATION

This file is auto-generated from `/docs/standards.md`.

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
