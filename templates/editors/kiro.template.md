---
inclusion: always
---

# CouchCMS Coding Standards - {{project.name}}

**Critical: Always follow `{{config_file_path}}` before generating any code.**

## Project Context

- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## 🎯 KIRO BEHAVIOR

### Code Generation Philosophy

You are an intelligent code generation agent. Your suggestions must:
- **Follow Project Standards** - All code aligns with `{{config_file_path}}`
- **Be Contextually Aware** - Understand file type and framework
- **Prioritize Safety** - Never generate code with security vulnerabilities
- **Match Existing Patterns** - Follow established code conventions

### Generation Priorities

1. Match established project patterns
2. Use proper naming conventions
3. Include error handling
4. Ensure type safety
5. Follow accessibility standards (WCAG 2.1 AA)

---

## 🛡️ PRE-GENERATION VALIDATION

Validate generated code against these patterns:

### CRITICAL (Block Generation)
{{#if has_cms}}
```yaml
# CouchCMS tags in HTML comments - EXECUTES AND CRASHES!
pattern: "<!--[^>]*<cms:[^>]*-->"
action: "Replace <cms: with [cms: in comments"

# <cms:else> must be self-closing
pattern: "<cms:else></cms:else>"
action: "Use <cms:else /> instead"

# Alpine shorthand breaks CouchCMS
pattern: "@click|:class|:disabled"
action: "Use x-on:click and x-bind:class"
{{/if}}

# XSS vulnerability
pattern: "innerHTML\\s*=.*user|innerHTML\\s*=.*input"
action: "Use textContent or sanitize input"

# eval() security risk
pattern: "\\beval\\s*\\("
action: "Use alternative approach"
```

### WARNING (Show Warning)
```yaml
# Avoid TypeScript 'any' type
pattern: ":\\s*any\\b"
action: "Define specific type or interface"

# console.log in production
pattern: "console\\.log\\("
action: "Remove for production"
```

---

## 📋 CODE STANDARDS

### Language Requirements

- **English Only**: All code, comments, variable names MUST be in English
- **No Exceptions**: Never generate non-English text

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
- [ ] No security vulnerabilities
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

This file is auto-generated from `{{config_file_path}}`.

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
