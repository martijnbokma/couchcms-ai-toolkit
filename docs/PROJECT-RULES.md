# Project Rules Guide

Complete guide for using Cursor Project Rules with the CouchCMS AI Toolkit.

## What are Project Rules?

Project Rules are version-controlled instructions stored in `.cursor/rules/` that apply to your specific project. Unlike User Rules (which are global), Project Rules are:

- **Version-controlled** - Stored in your repository
- **Project-specific** - Tailored to your codebase
- **Auto-loading** - Automatically applied based on file patterns
- **Team-shared** - All team members use the same rules

## How Project Rules Work

Cursor automatically loads Project Rules based on:

1. **File patterns** (globs) - Rules activate when you select matching files
2. 📝 **Always Apply** - Some rules are always active
3. 📝 **Manual triggers** - Some rules are invoked with `@rule-name`

### Rule Types

| Type | Description | When Applied |
|------|-------------|--------------|
| **Always Apply** | `alwaysApply: true` | Every chat session |
| **Apply Intelligently** | Has `description` | When Agent decides it's relevant |
| **Apply to Specific Files** | Has `globs` array | When file matches pattern |
| **Apply Manually** | No globs, no alwaysApply | When `@rule-name` mentioned |

## Rule Format (MDC)

Project Rules use the **MDC** (Markdown with Context) format:

```yaml
---
description: Brief description of what this rule does
globs: ['**/*.html', '**/*.php']
alwaysApply: false
---

# Rule Content

Your rule instructions here...
```

### Frontmatter Properties

- **`description`** - Used for intelligent application
- **`globs`** - Array of file patterns (e.g., `['**/*.html', '*.php']`)
- **`alwaysApply`** - Boolean, if `true` rule is always active

### Content

- Use clear, actionable instructions
- Include examples where helpful
- Reference project standards
- Keep language generic (use `{{paths.xxx}}` variables)

## Toolkit Integration

The toolkit automatically syncs Project Rules from `rules/` to your project's `.cursor/rules/`:

### Available Rules

The toolkit provides these pre-configured rules:

| Rule | Pattern | Purpose |
|------|---------|---------|
| `refactor-html.mdc` | `snippets/**/*.html`, `*.php` | CouchCMS templates, Alpine.js |
| `refactor-typescript.mdc` | `assets/ts/**/*.ts` | TypeScript files |
| `refactor-css.mdc` | `assets/css/**/*.css` | CSS/TailwindCSS files |
| `refactor-forms.mdc` | `snippets/forms/**/*.html` | DataBound Forms |
| `refactor-alpinejs.mdc` | `snippets/**/*.html`, `*.php` | Alpine.js components |
| `refactor-views.mdc` | `snippets/views/**/*.html` | CouchCMS views |
| `refactor-search.mdc` | `snippets/**/*search*.html` | CouchCMS search |
| `refactor-comments.mdc` | `snippets/**/*comment*.html` | CouchCMS comments |
| `refactor-users.mdc` | `snippets/**/*user*.html` | User management |
| `design.mdc` | `**/*.html`, `**/*.php`, `**/*.css` | UI/UX design principles |
| `daisyui.mdc` | `alwaysApply: true` | daisyUI 5 component library |
| `index.mdc` | `alwaysApply: true` | Documentation bridge |

### Syncing Rules

Rules are automatically synced when you run:

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

This:
1. Copies rules from toolkit `rules/` to project `.cursor/rules/`
2. 📝 Replaces `{{paths.xxx}}` variables with your project paths
3. 📝 Ensures all rules are up to date

## Creating Custom Project Rules

### Project-Specific Rules

Create rules that apply only to your project:

1. **Create `.mdc` file** in `.cursor/rules/`:

```bash
.cursor/rules/
  └── my-custom-rule.mdc
```

2. **Add frontmatter**:

```yaml
---
description: Custom rule for my project
globs: ['**/*.php']
alwaysApply: false
---
```

3. **Add content**:

```markdown
# My Custom Rule

When working with PHP files:
- Always use strict types
- Follow PSR-12 coding standards
- Include error handling
```

4. **Rules are automatically loaded** by Cursor

### Shared Rules (Toolkit Contribution)

To add rules to the toolkit for all projects:

1. **Create `.mdc` file** in `ai-toolkit-shared/rules/`
2. 📝 **Use path variables** - Replace hardcoded paths with `{{paths.xxx}}`
3. 📝 **Keep framework-agnostic** where possible
4. 📝 **Add to README** - Document in `rules/README.md`

Example:

```yaml
---
description: Refactoring rules for forms
globs: ['{{paths.forms}}/**/*.html']
alwaysApply: false
---

# Form Refactoring Rules

When refactoring forms in {{paths.forms}}:
- Always include CSRF protection
- Use DataBound Forms patterns
- Validate on both client and server
```

## Path Variables

The toolkit supports path variables that are replaced during sync:

| Variable | Default | Description |
|----------|---------|-------------|
| `{{paths.snippets}}` | `snippets` | Snippets directory |
| `{{paths.typescript}}` | `assets/ts` | TypeScript files |
| `{{paths.javascript}}` | `assets/js` | JavaScript files |
| `{{paths.css}}` | `assets/css` | CSS files |
| `{{paths.forms}}` | `snippets/forms` | Form files |
| `{{paths.views}}` | `snippets/views` | View files |
| `{{paths.filters}}` | `snippets/filters` | Filter files |
| `{{paths.components}}` | `snippets/components` | Component files |
| `{{paths.layouts}}` | `snippets/layouts` | Layout files |
| `{{paths.public}}` | `public` | Public directory |

These are replaced with your actual project paths during sync.

## Best Practices

### 1. Keep Rules Focused

One rule per concern:

```yaml
# ✅ Good: Focused rule
---
description: TypeScript type safety
globs: ['**/*.ts']
---

Always use explicit types, avoid 'any'
```

```yaml
# ❌ Bad: Too broad
---
description: Everything about TypeScript
globs: ['**/*.ts', '**/*.js', '**/*.json']
---

TypeScript rules, JavaScript rules, JSON rules, build rules...
```

### 2. Use Clear Descriptions

Descriptions help Cursor apply rules intelligently:

```yaml
# ✅ Good: Clear description
description: Refactoring rules for CouchCMS templates with Alpine.js

# ❌ Bad: Vague description
description: HTML stuff
```

### 3. Test Glob Patterns

Verify your globs match the right files:

```yaml
# ✅ Good: Specific pattern
globs: ['snippets/components/**/*.html']

# ❌ Bad: Too broad
globs: ['**/*']
```

### 4. Use Path Variables

Make rules portable across projects:

```yaml
# ✅ Good: Uses variable
globs: ['{{paths.components}}/**/*.html']

# ❌ Bad: Hardcoded path
globs: ['snippets/components/**/*.html']
```

### 5. Keep Rules Under 500 Lines

Split large rules into multiple focused rules:

```yaml
# ✅ Good: Multiple focused rules
refactor-html.mdc      # HTML refactoring
refactor-alpinejs.mdc  # Alpine.js refactoring
refactor-forms.mdc     # Form refactoring

# ❌ Bad: One massive rule
everything.mdc  # 2000 lines of everything
```

## Nested Rules

Organize rules by placing them in subdirectories:

```bash
project/
  .cursor/rules/           # Project-wide rules
    refactor-html.mdc
    design.mdc
  backend/
    .cursor/rules/          # Backend-specific rules
      api-patterns.mdc
  frontend/
    .cursor/rules/          # Frontend-specific rules
      component-structure.mdc
```

Nested rules automatically attach when files in their directory are referenced.

## Manual Rules

Create `.md` files (not `.mdc`) for manual triggers:

```bash
.cursor/rules/
  └── refresh.md  # Manual: @refresh
```

These are invoked with `@rule-name` in chat.

## Troubleshooting

### Rules Not Loading

1. **Check file extension** - Use `.mdc` for auto-load, `.md` for manual
2. ✅ **Verify frontmatter** - Must be valid YAML
3. 🔍 **Check glob patterns** - Ensure they match your files
4. 📝 **Restart Cursor** - Sometimes needed after adding new rules

### Path Variables Not Replaced

1. **Run sync script**: `bun ai-toolkit-shared/scripts/sync.js`
2. ✅ **Check `standards.md`** (or `.project/standards.md`) - Verify path configuration
3. ✅ **Verify `defaults.yaml`** - Check toolkit has path definitions

### Rules Not Applying

1. **Check rule type** - Is it `alwaysApply: true` or has matching globs?
2. ✅ **Verify file selection** - Are you working with files that match the globs?
3. 🔍 **Check description** - For "Apply Intelligently", ensure description is clear
4. 📝 **Review Cursor Settings** - Go to `Cursor Settings → Rules` to see rule status

## Examples

### Example 1: File-Specific Rule

```yaml
---
description: TypeScript refactoring rules
globs: ['assets/ts/**/*.ts']
alwaysApply: false
---

# TypeScript Refactoring

When refactoring TypeScript files:
- Always use explicit return types
- Avoid `any` type
- Use interfaces for object shapes
- Prefer type unions over enums
```

### Example 2: Always-Apply Rule

```yaml
---
description: daisyUI component library reference
alwaysApply: true
---

# daisyUI 5 Components

Always use daisyUI semantic colors:
- `bg-base-100` instead of `bg-white`
- `text-base-content` instead of `text-black`
- `btn-primary` for primary buttons

See: https://daisyui.com/components/
```

### Example 3: Manual Rule

```markdown
# Refresh Workflow

When @refresh is mentioned:
1. Analyze current code state
2. 📝 Identify issues
3. 📝 Suggest improvements
4. 📝 Ask for confirmation before changes
```

## Integration with Toolkit

Project Rules work seamlessly with the toolkit:

1. **Auto-synced** - Rules from toolkit `rules/` are copied to your project
2. 📝 **Path-aware** - Variables are replaced with your project paths
3. 📝 **Version-controlled** - Rules are committed to your repository
4. 📝 **Team-shared** - All team members get the same rules

## See Also

- [User Rules Guide](USER-RULES.md) - Global preferences
- [Rules README](../rules/README.md) - Available toolkit rules
- [Cursor Rules Documentation](https://cursor.com/docs/context/rules#project-rules) - Official docs
- [Getting Started](GETTING-STARTED.md) - Toolkit setup
