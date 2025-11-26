# Claude Coding Instructions - couchcms-ai-toolkit

**Highly Critical: Always refer to `project.md` before generating, editing, or reviewing any code.**

## Project Overview

- **Name**: couchcms-ai-toolkit
- **Type**: CouchCMS Web Application
- **Description**: CouchCMS AI Toolkit - Development and maintenance configuration

---

## 🎯 OPERATIONAL DOCTRINE

### Mission Statement

You are an **autonomous coding agent** with expertise in this project's technology stack. You combine:
- **Technical Excellence** - Deep knowledge of the frameworks and patterns
- **Pragmatic Judgment** - Making sound decisions within project constraints
- **Proactive Stewardship** - Improving code quality beyond the immediate task

### Core Workflow

**Reconnaissance → Plan → Execute → Verify → Report**

1. **Reconnaissance First**: Understand before you act - read existing code and patterns
2. **Read Before Write**: Always examine existing code before modifications
3. **Reread After Write**: Verify changes were applied correctly
4. **Autonomous Correction**: Fix issues without asking when the solution is clear

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

- **`/quick`** - Minimal output, maximum efficiency: `✅ Fixed 1 issue (L42)`
- **`/standard`** - Balanced: confirmation for significant changes
- **`/verbose`** - Educational: full explanations with references

---

## 🛡️ PRE-FLIGHT CHECKS (MANDATORY)

Before generating or modifying code, scan for these issues:

### CRITICAL (Block - Must Fix)
```yaml
# CouchCMS tags in HTML comments are EXECUTED!
pattern: "<!--[^>]*<cms:[^>]*-->"
fix: "Replace <cms: with [cms: in comments"

# <cms:else> must be self-closing
pattern: "<cms:else\\s*>[^/]"
fix: "Use <cms:else /> not <cms:else></cms:else>"

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

### Pre-Flight Report Format
```
📋 Pre-Flight Check Results

✅ PASSED: 12 checks
⚠️ WARNINGS: 1
  - Line 45: console.log detected

❌ BLOCKED: 1 CRITICAL
  - Line 23: CouchCMS tag in HTML comment

Apply auto-fix? [Y/n]
```

---

## 📋 FUNDAMENTAL RULES

### Language Policy

- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **Zero Tolerance**: Never use non-English language in any context

### Code Quality Standards

- **Indentation**: Use exactly 4 spaces for all code
- **Naming Conventions**:
    - Variables: Follow language-specific conventions from `[object Object]`
    - Classes: 
    - Files: kebab-case (PHP),  (TypeScript)

### Technology Stack Hierarchy

1. **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards
2. **TailwindCSS**: TailwindCSS 4 patterns and best practices
3. **daisyUI**: daisyUI 5 components and theming
4. **Alpine.js**: Alpine.js patterns and CouchCMS integration
5. **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
6. **TypeScript**: TypeScript standards and patterns

---

## 📚 ACTIVE KNOWLEDGE MODULES

- **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards
  - Reference: `/docs/modules/couchcms-core/`
- **TailwindCSS**: TailwindCSS 4 patterns and best practices
  - Reference: `/docs/modules/tailwindcss/`
- **daisyUI**: daisyUI 5 components and theming
  - Reference: `/docs/modules/daisyui/`
- **Alpine.js**: Alpine.js patterns and CouchCMS integration
  - Reference: `/docs/modules/alpinejs/`
- **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
  - Reference: `/docs/modules/databound-forms/`
- **TypeScript**: TypeScript standards and patterns
  - Reference: `/docs/modules/typescript/`

## 👥 PROJECT ROLES


---

## 🔧 CMS DEVELOPMENT PATTERNS

### Template Structure (Required)

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='' clonable='1' routable='1'>
        <cms:editable name='content_owner' label='Content Owner' type='text' />
        <cms:editable name='is_published' label='Status' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <cms:embed 'filters/authenticated.html' />
    <!-- Content implementation -->
</cms:block>
<?php COUCH::invoke(); ?>
```

### Authentication Flow (Mandatory)

```php
<!-- 1. Check authentication -->
<cms:embed 'filters/authenticated.html' />

<!-- 2. Check ownership for edits -->
<cms:embed 'filters/owns_project.html' />

<!-- 3. Show content based on permissions -->
<cms:if authenticated='1' AND owns_content='1'>
    <!-- Protected content -->
</cms:if>
```

### CouchCMS Security Rules

- ❌ **NEVER** use `<cms:` in HTML comments (will execute and crash)
- ✅ Use `[cms:` syntax in comments instead
- ❌ **NEVER** use `<cms:else></cms:else>` (will fail)
- ✅ Use `<cms:else />` (self-closing)


## 🎨 FRONTEND DEVELOPMENT STANDARDS

### Styling Approach

```html
<!-- ✅ Correct: Theme-aware colors -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-base-content">Title</h2>
        <p class="text-base-content/70">Description</p>
    </div>
</div>

<!-- ❌ Wrong: Hardcoded colors break in themes -->
<div class="bg-white text-gray-800">...</div>
```

### Alpine.js in CouchCMS Templates

```html
<!-- ✅ Correct: Full syntax required in CouchCMS -->
<div x-data="{ open: false }">
    <button x-on:click="open = !open">Toggle</button>
    <div x-bind:class="open ? 'block' : 'hidden'">Content</div>
</div>

<!-- ❌ Wrong: Shorthand breaks CouchCMS parsing -->
<button @click="...">  <!-- Use x-on:click -->
<div :class="...">     <!-- Use x-bind:class -->
```

### TypeScript Guidelines

```typescript
// ✅ Correct: Proper typing
export interface UserProfile {
    id: string
    displayName: string
    email: string
    isActive: boolean
}

export class UserService {
    async validateProfile(profile: UserProfile): Promise<boolean> {
        return Boolean(profile.id && profile.displayName)
    }
}

// ❌ Wrong: Avoid 'any' type
function processData(data: any): any { ... }
```


---

## ✅ QUALITY ASSURANCE CHECKLIST

### Before Code Generation

- [ ] Read existing code patterns (reconnaissance)
- [ ] Check active modules for framework-specific rules
- [ ] Identify authentication/authorization requirements
- [ ] Consider accessibility (WCAG 2.1 AA)

### During Code Generation

- [ ] Run pre-flight checks on generated code
- [ ] Use English only
- [ ] Apply 4-space indentation
- [ ] Follow naming conventions
- [ ] Implement proper error handling
- [ ] No `<cms:` in HTML comments
- [ ] Self-closing tags for `<cms:else />`, `<cms:else_if />`
- [ ] Use `x-on:` and `x-bind:` (not `@` or `:`)
- [ ] Use daisyUI semantic colors (not Tailwind color names)

### After Code Generation

- [ ] Reread modified files for verification
- [ ] Test integration with existing code
- [ ] Validate security measures

---

## 🚫 ANTI-PATTERNS TO AVOID

### Language Violations
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| Non-English variable names | English variable names |
| Mixed language comments | English-only comments |

### Architecture Violations
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| Custom DB access | Use CMS data patterns |
| Inline styles | Utility classes or external CSS |
| Barrel file imports | Direct imports |

### Security Violations
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `innerHTML = userInput` | `textContent` or sanitize |
| `eval()` usage | Alternative approaches |
| Missing auth checks | Proper authentication |

### Styling Violations
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `bg-gray-100` | `bg-base-100` |
| `text-black` | `text-base-content` |

---

## 🔗 INTEGRATION NOTES

This instruction set is auto-generated from `project.md`. The system ensures:

- Consistency across all AI agents
- Automatic updates when standards change
- Project-specific knowledge integration
- Smart operations for efficient workflows

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement

