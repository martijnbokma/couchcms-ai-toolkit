# Configuration Files Guide

Complete guide to configuration files in the CouchCMS AI Toolkit.

## Quick Summary

| File | Purpose | Format | Status |
|------|---------|--------|--------|
| **`config.yaml`** | Primary configuration file | YAML | ✅ Recommended (New) |
| **`.project/standards.md`** | Legacy configuration file | YAML + Markdown | ⚠️ Supported (Legacy) |

📖 **Upgrading from old format?** See [Migration Guide](MIGRATION.md) for step-by-step instructions.

---

## `config.yaml` (New Format - Recommended)

**This is the new, simplified configuration format introduced in v2.0.0.**

### Why Use config.yaml?

- ✅ **Simpler** - Single YAML file instead of multiple config files
- ✅ **Clearer** - All settings in one place, easy to find
- ✅ **Better Validation** - Built-in schema validation
- ✅ **Easier Maintenance** - No need to manage multiple files
- ✅ **Performance** - Faster loading and processing

### Structure

```yaml
# Project settings
project:
  name: "my-project"
  description: "My CouchCMS project"
  type: "CouchCMS Web Application"

# Toolkit location
toolkit:
  path: "./ai-toolkit-shared"

# Editors to generate configs for
editors:
  - cursor
  - claude
  - windsurf
  - kiro
  - copilot

# Modules to load
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs

# Agents to load
agents:
  - couchcms
  - tailwindcss
  - alpinejs

# Framework configuration
framework:
  enabled: false
  # OR enable specific components:
  # doctrine: true
  # directives: true
  # playbooks: true

# Project paths
paths:
  css: "assets/css"
  typescript: "assets/ts"
  javascript: "assets/js"
  components: "snippets/components"

# Coding standards
standards:
  indentation: 4
  language: "english"
  lineLength: 120

# Naming conventions
naming:
  php_variables: "snake_case"
  php_functions: "snake_case"
  ts_variables: "camelCase"
  ts_functions: "camelCase"
  css_classes: "kebab-case"

# File contexts (auto-load modules based on file type)
file_contexts:
  "*.php":
    agents: [couchcms]
    modules: [couchcms-core]
  "*.ts":
    agents: [typescript]
    modules: [typescript]

# Template aliases
template_aliases:
  component-basic: "templates/components/basic.html"
  view-list: "templates/views/list.html"

# Validation rules
validation:
  required_modules: [couchcms-core]
  max_line_length: 200
  enforce_english: true
```

### What It Contains

All configuration in a single, well-structured YAML file:

- **Project Settings** - Name, description, type
- **Toolkit Configuration** - Path to toolkit
- **Editor Selection** - Which editors to generate configs for
- **Modules & Agents** - Knowledge modules and AI agents to load
- **Framework** - AAPF framework configuration
- **Paths** - Project directory structure
- **Standards** - Coding standards (indentation, language, line length)
- **Naming Conventions** - Per-language naming rules
- **File Contexts** - Auto-load modules based on file type
- **Template Aliases** - Shortcuts for common templates
- **Validation Rules** - Configuration validation settings

### Location

The toolkit looks for `config.yaml` in the project root directory.

### When to Use

✅ **Always** - This is the recommended format for all new projects.

If you're starting a new project or can migrate, use this format. It's simpler and easier to maintain than the legacy format.

---

## `.project/standards.md` (Legacy Format - Still Supported)

**This is the legacy configuration format. It still works, but we recommend migrating to `config.yaml`.**

### Structure

```markdown
---
# YAML Frontmatter - Configuration
name: 'my-project'
description: 'My CouchCMS project'
toolkit: './ai-toolkit-shared'

modules:
    - couchcms-core
    - tailwindcss
    - alpinejs

agents:
    - couchcms
    - tailwindcss
    - alpinejs
---

# Markdown Body - Project Rules & Documentation

## Project Rules
[Your coding standards...]

## Architecture
[Project structure...]

## Patterns
[Common patterns...]
```

### What It Contains

1. **YAML Frontmatter** (Configuration):
   - Project name and description
   - Toolkit path
   - Selected modules
   - Selected agents
   - Basic configuration

2. **Markdown Body** (Rules & Documentation):
   - Project-specific coding rules
   - Architecture decisions
   - Code patterns
   - Workflows

### Location Priority

The toolkit looks for `standards.md` in this order:

1. `.project/standards.md` ⭐ **Recommended**
2. `docs/standards.md`
3. `standards.md` (root directory)

### When to Use

⚠️ **Legacy projects only** - If you have an existing project using this format, it will continue to work. However, we recommend migrating to `config.yaml` for better maintainability.

### Migration

To migrate from `standards.md` to `config.yaml`:

```bash
bun ai-toolkit-shared/scripts/migrate.js
```

See [Migration Guide](MIGRATION.md) for detailed instructions.

---

## Configuration Format Comparison

### New Format (config.yaml)

```
config.yaml
└── All configuration in YAML
```

**Benefits:**
- ✅ Single file for all configuration
- ✅ Pure YAML (no mixed formats)
- ✅ Better validation
- ✅ Easier to maintain
- ✅ Faster processing

### Legacy Format (standards.md)

```
.project/standards.md
├── YAML: Configuration
└── Markdown: Rules & docs
```

**Limitations:**
- ⚠️ Mixed format (YAML + Markdown)
- ⚠️ Less structured
- ⚠️ Harder to validate
- ⚠️ Slower processing

**Recommendation:** Migrate to `config.yaml` for better experience.

---

## Automatic Detection

The toolkit automatically detects and uses the appropriate configuration format.

### Detection Logic

The toolkit searches for configuration files in this priority order:

1. **`config.yaml`** (root directory)
    - New format (recommended)
    - Single YAML file
    - Fastest to load and process

2. **`.project/standards.md`** (project config directory)
    - Legacy format
    - YAML frontmatter + Markdown body
    - Still fully supported

3. **`docs/standards.md`** (documentation location)
    - Legacy format
    - Alternative location

4. **`standards.md`** (root directory)
    - Legacy format
    - Simplest path

### How It Works

#### In Scripts

All toolkit scripts (`init.js`, `sync.js`, `validate.js`, `migrate.js`) automatically detect the configuration format:

```javascript
import { loadConfig } from './lib/config-loader.js'

// Automatically detects and loads config.yaml or standards.md
const config = loadConfig(projectDir, toolkitPath)
```

#### Backward Compatibility

The toolkit maintains full backward compatibility:

- If `config.yaml` exists, it takes priority
- If only `standards.md` exists, it's used automatically
- Both formats generate identical output
- No breaking changes for existing projects

#### Migration Path

When you're ready to migrate:

```bash
bun ai-toolkit-shared/scripts/migrate.js
```

This automatically:
1. Detects old configuration files
2. Merges them into `config.yaml`
3. Backs up old files
4. Validates new configuration

---

## Configuration Schema

### config.yaml Schema

For complete schema documentation, see [CONFIG-SCHEMA.md](CONFIG-SCHEMA.md).

**Required Fields:**

```yaml
project:
  name: "my-project"        # Required
  
toolkit:
  path: "./ai-toolkit-shared"  # Required

modules:
  - couchcms-core           # At least one required
```

**Optional Fields:**

```yaml
project:
  description: "..."        # Optional
  type: "..."              # Optional

editors:                   # Optional (defaults to all)
  - cursor
  - claude
  - windsurf
  - kiro
  - copilot

agents: []                 # Optional
framework:                 # Optional
  enabled: false
paths: {}                  # Optional
standards: {}              # Optional
naming: {}                 # Optional
file_contexts: {}          # Optional
template_aliases: {}       # Optional
validation: {}             # Optional
```

### Validation

The toolkit validates your configuration automatically:

```bash
bun ai-toolkit-shared/scripts/validate.js
```

This checks:
- Required fields are present
- Module names are valid
- Agent names are valid
- Paths exist
- YAML syntax is correct

---

## Generated Files (Auto-Created)

These files are **automatically generated** from your configuration:

- `.cursorrules` - Cursor AI configuration
- `CLAUDE.md` - Claude AI configuration
- `AGENT.md` - Universal AI agent documentation
- `.github/copilot-instructions.md` - GitHub Copilot config
- `.cursor/rules/*.mdc` - Auto-loading Cursor rules

**Do not edit these manually** - they're regenerated by `sync.js`.

---

## Decision Tree

```
Starting a new project?
├── Yes → Use config.yaml (new format)
│   └── Run: bun ai-toolkit-shared/scripts/init.js
└── No → Have existing configuration?
    ├── Using standards.md?
    │   └── Consider migrating to config.yaml
    │       └── Run: bun ai-toolkit-shared/scripts/migrate.js
    └── Using config.yaml?
        └── Perfect! You're all set.
```

---

## Common Questions

### Q: Which format should I use?

**Answer:** Use `config.yaml` (new format) for all new projects. It's simpler and easier to maintain.

### Q: Can I still use standards.md?

**Answer:** Yes! The legacy format is still fully supported. However, we recommend migrating to `config.yaml` when convenient.

### Q: How do I migrate from standards.md to config.yaml?

**Answer:** Run the migration script:

```bash
bun ai-toolkit-shared/scripts/migrate.js
```

See [Migration Guide](MIGRATION.md) for detailed instructions.

### Q: What if I have both config.yaml and standards.md?

**Answer:** The toolkit will use `config.yaml` and ignore `standards.md`. Remove or rename `standards.md` to avoid confusion.

### Q: Will migration break my existing setup?

**Answer:** No! The migration script:
- Backs up all old files
- Validates the new configuration
- Automatically rolls back if anything fails
- Generates identical output for supported editors

### Q: What happened to Tabnine and CodeWhisperer support?

**Answer:** These editors are no longer actively supported. The toolkit now focuses on:
- Cursor
- Claude Code
- Windsurf
- Kiro
- GitHub Copilot

If you need Tabnine or CodeWhisperer, use an older version of the toolkit or create custom templates.

---

## Best Practices

1. ✅ **Use `config.yaml`** for new projects (simpler and clearer)
2. ✅ **Migrate existing projects** to `config.yaml` when convenient
3. ✅ **Keep configuration organized** - use the provided schema structure
4. ✅ **Validate regularly** - run `bun ai-toolkit-shared/scripts/validate.js`
5. ❌ **Don't edit generated files** (.cursorrules, CLAUDE.md, etc.) - they're regenerated on sync

---

## Summary

- **New projects**: Use `config.yaml` (recommended)
- **Existing projects**: Migrate from `standards.md` to `config.yaml`
- **Migration**: Run `bun ai-toolkit-shared/scripts/migrate.js`
- **Validation**: Run `bun ai-toolkit-shared/scripts/validate.js`

**Keep it simple** - one configuration file, clearly structured!

---

## See Also

- [Getting Started](GETTING-STARTED.md)
- [Command Reference](COMMANDS.md)
- [Standards Validator](../prompts/validators/standards.md)
