# GitHub Copilot Instructions - {{project.name}}

**Critical: Always validate against `{{config_file_path}}` before suggesting code.**

## Project Configuration

- **Project**: {{project.name}} ({{project.type}})
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## 🎯 COPILOT BEHAVIOR

### Suggestion Philosophy

You are an intelligent code completion agent optimized for this project. Your suggestions must:
- **Follow Project Standards** - All code must align with `{{config_file_path}}`
- **Be Contextually Aware** - Understand the file type and framework being used
- **Prioritize Safety** - Never suggest patterns that could cause security issues
- **Maintain Consistency** - Match existing code style and patterns

### Completion Priorities

1. Follow established project patterns
2. Use proper naming conventions for the language
3. Include error handling
4. Suggest accessible markup (WCAG 2.1 AA)
5. Ensure type safety in TypeScript

---

## 🛡️ PRE-SUGGESTION VALIDATION

Before suggesting code, validate against these patterns:

### CRITICAL (Never Suggest)
{{#if has_cms}}
```yaml
# CouchCMS tags in HTML comments - WILL EXECUTE!
pattern: "<!--[^>]*<cms:[^>]*-->"
reason: "CouchCMS parses and executes tags inside HTML comments"

# Paired else tags - WILL FAIL
pattern: "<cms:else></cms:else>"
reason: "<cms:else> must be self-closing"

# Alpine shorthand in CouchCMS - WILL BREAK
pattern: "@click|:class|:disabled"
reason: "CouchCMS parser conflicts with @ and : prefixes"
{{/if}}

# XSS vulnerability
pattern: "innerHTML\\s*=.*user|innerHTML\\s*=.*input"
reason: "Potential cross-site scripting"

# eval() usage
pattern: "\\beval\\s*\\("
reason: "Security risk - use alternative approach"
```

### WARNING (Flag to User)
```yaml
# TypeScript 'any' type
pattern: ":\\s*any\\b"
suggestion: "Define specific type or interface"

# console.log in code
pattern: "console\\.log\\("
suggestion: "Remove for production or use logger"
```

---

## 📋 CODE STANDARDS

### Language Requirements

- **English Only**: All code, comments, and documentation must be in English
- **No Exceptions**: Never suggest non-English text

### Formatting Standards

- **Indentation**: {{standards.indentation}} spaces (never tabs)
- **Line Length**: {{standards.line_length}} characters maximum
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: {{standards.naming.php_files}} (PHP), {{standards.naming.typescript_files}} (TypeScript)

### Technology Hierarchy

When multiple approaches are possible, prefer this order:
{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

---

{{#if has_cms}}
## 🔧 CMS TEMPLATE PATTERNS

### Template Completion

When completing CouchCMS templates, always suggest:

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1'>
        <cms:editable name='content_owner' type='text' />
        <cms:editable name='is_published' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<?php COUCH::invoke(); ?>
```

### Authentication Completion

Always suggest proper authentication patterns:

```php
<!-- ✅ Suggest this pattern for protected content -->
<cms:embed 'filters/authenticated.html' />

<cms:if authenticated='1'>
    <!-- Protected content -->
</cms:if>
```

### CouchCMS-Safe Syntax

| Context | ❌ Never Suggest | ✅ Always Suggest |
|---------|------------------|-------------------|
| Comments | `<!-- <cms:show /> -->` | `<!-- [cms:show /] -->` |
| Conditionals | `<cms:else></cms:else>` | `<cms:else />` |
| Alpine events | `@click="..."` | `x-on:click="..."` |
| Alpine bindings | `:class="..."` | `x-bind:class="..."` |

{{/if}}

{{#if has_frontend}}
## 🎨 FRONTEND COMPLETIONS

### Theme-Aware Classes

When suggesting CSS classes, use daisyUI semantic colors:

```html
<!-- ✅ Suggest theme-compatible colors -->
<div class="card bg-base-100">
    <h2 class="card-title text-base-content">Title</h2>
    <p class="text-base-content/70">Description</p>
</div>

<!-- ❌ Never suggest hardcoded colors -->
<div class="bg-white text-gray-800">...</div>
```

### TypeScript Completions

Suggest clean, typed interfaces:

```typescript
// ✅ Suggest proper typing
export interface UserProfile {
    id: string
    displayName: string
    emailAddress: string
}

export function validateUser(profile: UserProfile): boolean {
    return Boolean(profile.id && profile.displayName && profile.emailAddress)
}

// ❌ Never suggest 'any' type
function processData(data: any): any { ... }
```

### Import Completions

Always suggest direct imports:

```typescript
// ✅ Suggest direct imports
import { UserService } from './services/user-service'
import { validateEmail } from './utils/validation'

// ❌ Never suggest barrel imports
import { UserService, validateEmail } from './index'
import { something } from './components'
```

{{/if}}

---

## ✅ SUGGESTION VALIDATION

### Before Suggesting Code

- [ ] Language is English
- [ ] Naming convention matches language
- [ ] Proper indentation ({{standards.indentation}} spaces)
- [ ] No security vulnerabilities
{{#if has_cms}}
- [ ] No `<cms:` in HTML comments
- [ ] Self-closing `<cms:else />` tags
- [ ] Full Alpine.js syntax (`x-on:`, `x-bind:`)
{{/if}}
{{#if has_frontend}}
- [ ] Theme-aware colors (not hardcoded)
- [ ] Direct imports (not barrel)
- [ ] Proper TypeScript types (not `any`)
{{/if}}

### Auto-completion Behavior

- Suggest variable names in correct case for the language
- Auto-complete with English words only
- Include proper error handling patterns
- Suggest accessibility attributes for HTML elements
- Recommend proper TypeScript types

---

## 📚 MODULE INTEGRATION

Reference these knowledge modules when suggesting code:
{{#each modules}}
- **{{name}}**: {{description}}
{{/each}}

## 👥 PROJECT ROLES

Consider the appropriate role perspective when suggesting code:

{{#each roles}}
- **{{name}}**: {{description}}
{{/each}}

---

## 🚫 ANTI-PATTERNS

### Never Suggest These

| Category | ❌ Anti-Pattern | Reason |
|----------|-----------------|--------|
| Language | Non-English names | Project requires English only |
{{#if has_cms}}
| CouchCMS | Comments with `<cms:` | Tags execute in comments |
| CouchCMS | `<cms:else></cms:else>` | Must be self-closing |
| Alpine | `@click`, `:class` | Conflicts with CouchCMS parser |
{{/if}}
{{#if has_frontend}}
| Styling | `bg-gray-*`, `text-black` | Use theme-aware colors |
| TypeScript | `any` type | Define specific types |
| Imports | Barrel files | Use direct imports |
{{/if}}
| Security | `innerHTML = userInput` | XSS vulnerability |
| Security | `eval()` | Security risk |

---

## 🔗 INTEGRATION

This configuration is synchronized with `{{config_file_path}}`. Suggestions automatically align with project standards.

### Quality Filters

High-priority suggestions:
1. **English Language** - Correct any non-English text
2. **Indentation** - Fix incorrect spacing
3. **Security** - Add authentication for sensitive operations
4. **Accessibility** - Suggest ARIA attributes and semantic HTML

