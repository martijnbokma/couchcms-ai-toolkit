# AI Toolkit Modules

Knowledge modules provide AI assistants with framework-specific patterns and best practices.

## Module Organization

Modules are organized into subdirectories for better clarity:

- **`core/`** - CouchCMS-specific modules (always included automatically)
  - `couchcms-core`, `databound-forms`, `custom-routes`, `folders`, `archives`
  - `relationships`, `repeatable-regions`, `search`, `pagination`, `comments`, `users`

- **`frontend/`** - Frontend framework modules (optional, user chooses)
  - `tailwindcss`, `daisyui`, `alpinejs`, `typescript`

The module loader automatically searches these subdirectories, so module names remain the same.

## Module Structure

Each module consists of:

1. **Markdown file** (`module-name.md`) - Contains patterns, examples, and rules
2. **Skill rules file** (`module-name.skill-rules.json`) - Optional, for Claude Code integration

### Module Frontmatter

```yaml
---
id: module-name
name: "Module Display Name"
version: "2.x"
description: "Brief description of what this module provides"
required: false
requires: [couchcms-core]  # Dependencies
conflicts: []              # Incompatible modules
---
```

## Extending Modules

### From Documentation

Use the `extend-modules.js` script to automatically extract content from CouchCMS documentation:

```bash
# Analyze available documentation
bun scripts/extend-modules.js --analyze

# Extend a specific module
bun scripts/extend-modules.js --module comments

# Preview changes (dry run)
bun scripts/extend-modules.js --module comments --dry-run
```

See [EXTENDING-MODULES.md](../docs/EXTENDING-MODULES.md) for complete guide.

### Manual Extension

1. **Add patterns**: Document common patterns and anti-patterns
2. **Add examples**: Include complete, working code examples
3. **Add rules**: Define critical rules and best practices
4. **Test**: Verify patterns work in actual projects

### Module Content Guidelines

#### Code Examples

- ✅ Complete, working examples
- ✅ Descriptive titles
- ✅ Proper syntax highlighting
- ✅ Context and explanation

```php
// ✅ Good example
// Template structure with authentication
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Page' clonable='1'>
        <cms:editable name='content' type='richtext' />
    </cms:template>
</cms:block>
```

#### Critical Rules

- Use 🚨 emoji for critical rules
- Explain why the rule exists
- Show correct and incorrect examples

```markdown
### 🚨 CRITICAL: HTML Comment Security

- **NEVER** use `<cms:` tags inside HTML comments - CouchCMS executes them!
- Use `[cms:` instead of `<cms:` in comments

<!-- ❌ BAD -->
<!-- <cms:show my_variable /> -->

<!-- ✅ GOOD -->
<!-- [cms:show my_variable /] -->
```

#### Patterns

- Document common patterns
- Show variations
- Explain when to use each

## Module Dependencies

Modules can depend on other modules:

```yaml
requires: [couchcms-core, tailwindcss]
```

The sync script automatically:
- Ensures dependencies are loaded
- Checks for conflicts
- Validates module compatibility

## Skill Rules (Claude Code)

Optional JSON file for Claude Code integration:

```json
{
  "skill-name": {
    "description": "What this skill does",
    "rules": [
      "Rule 1",
      "Rule 2"
    ]
  }
}
```

## Available Modules

See [MODULES.md](../docs/MODULES.md) for complete list.

## Creating New Modules

### 1. Create Module File

Choose the appropriate subdirectory based on module type:

```bash
# CouchCMS module (core/)
touch modules/core/new-module.md

# Frontend module (frontend/)
touch modules/frontend/new-module.md
```

### 2. Add Frontmatter

```yaml
---
id: new-module
name: "New Module"
version: "2.x"
description: "Description"
required: false
requires: [couchcms-core]
conflicts: []
---
```

### 3. Add Content

- Patterns and examples
- Critical rules
- Best practices
- Common anti-patterns

### 4. Add to Mapping (for auto-extension)

Edit `scripts/extend-modules.js`:

```javascript
'new-module': {
    concepts: ['related-concept'],
    tags: ['related-tag'],
    newModule: true,
},
```

### 5. Test

```bash
# Sync to test project
bun scripts/sync.js

# Validate
bun scripts/validate.js
```

## Module Best Practices

1. **Keep focused**: One module = one concern
2. **Be practical**: Include real-world examples
3. **Stay current**: Update with framework changes
4. **Document clearly**: Explain why, not just how
5. **Test examples**: Ensure all code examples work

## See Also

- [Extending Modules Guide](../docs/EXTENDING-MODULES.md)
- [Available Modules](../docs/MODULES.md)
- [Getting Started](../docs/GETTING-STARTED.md)
