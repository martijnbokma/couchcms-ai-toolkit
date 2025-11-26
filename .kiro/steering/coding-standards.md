---
inclusion: always
---

# CouchCMS Coding Standards - couchcms-ai-toolkit

**Critical: Always follow `standards.md` before generating any code.**

## Project Context

- **Type**: CouchCMS Web Application
- **Description**: CouchCMS AI Toolkit - Development and maintenance configuration
- **Languages**: TypeScript, PHP, CSS, HTML
- **Frameworks**: CouchCMS, TailwindCSS, daisyUI, Alpine.js

---

## 🎯 KIRO BEHAVIOR

### Code Generation Philosophy

You are an intelligent code generation agent. Your suggestions must:
- **Follow Project Standards** - All code aligns with `standards.md`
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

- **Indentation**: 4 spaces
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: 
    - Files: kebab-case (PHP),  (TypeScript)

### Technology Hierarchy

1. **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards
2. **TailwindCSS**: TailwindCSS 4 patterns and best practices
3. **daisyUI**: daisyUI 5 components and theming
4. **Alpine.js**: Alpine.js patterns and CouchCMS integration
5. **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
6. **Custom Routes**: Custom URL routing and clean URL patterns
7. **Folders**: Content organization with virtual folders and nested pages
8. **Archives**: Archive views for time-based content organization
9. **Relationships**: Page relationships and related content patterns
10. **Repeatable Regions**: Repeatable content blocks and dynamic regions
11. **Search**: Search functionality with MySQL fulltext and relevance ranking
12. **Pagination**: Pagination controls for pages, search results, and comments
13. **Comments**: User comments with moderation and spam prevention
14. **Users**: User management, access control, and authentication
15. **TypeScript**: TypeScript standards and patterns

---

## 📚 KNOWLEDGE MODULES

- **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards
- **TailwindCSS**: TailwindCSS 4 patterns and best practices
- **daisyUI**: daisyUI 5 components and theming
- **Alpine.js**: Alpine.js patterns and CouchCMS integration
- **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
- **Custom Routes**: Custom URL routing and clean URL patterns
- **Folders**: Content organization with virtual folders and nested pages
- **Archives**: Archive views for time-based content organization
- **Relationships**: Page relationships and related content patterns
- **Repeatable Regions**: Repeatable content blocks and dynamic regions
- **Search**: Search functionality with MySQL fulltext and relevance ranking
- **Pagination**: Pagination controls for pages, search results, and comments
- **Comments**: User comments with moderation and spam prevention
- **Users**: User management, access control, and authentication
- **TypeScript**: TypeScript standards and patterns

## 👥 PROJECT ROLES


---

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


---

## ✅ QUALITY CHECKLIST

Before generating code:

- [ ] All text is in English
- [ ] 4-space indentation
- [ ] Proper naming conventions
- [ ] No security vulnerabilities
- [ ] No `<cms:` in HTML comments
- [ ] Self-closing `<cms:else />` tags
- [ ] Full Alpine syntax (`x-on:`, `x-bind:`)
- [ ] Theme-aware colors (daisyUI semantic)
- [ ] Direct imports (no barrel files)
- [ ] Proper TypeScript types (not `any`)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Error handling implemented

---

## 🚫 ANTI-PATTERNS

| Category | ❌ Never Generate | ✅ Always Generate |
|----------|-------------------|-------------------|
| Language | Non-English code | English only |
| Security | `innerHTML = userInput` | `textContent` or sanitize |
| Security | `eval()` usage | Alternative approaches |
| CouchCMS | `<!-- <cms: -->` | `<!-- [cms: /] -->` |
| CouchCMS | `<cms:else></cms:else>` | `<cms:else />` |
| Alpine | `@click` shorthand | `x-on:click` |
| Styling | `bg-gray-100` | `bg-base-100` |
| TypeScript | `any` type | Specific interface |
| Imports | `from './components'` | Direct file imports |

---

## 🔗 INTEGRATION

This file is auto-generated from `standards.md`.

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
