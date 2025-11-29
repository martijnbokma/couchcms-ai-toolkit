# Configuration Files Guide

Complete guide to configuration in the CouchCMS AI Toolkit.

## Quick Summary

The toolkit uses a single configuration file: **`standards.md`** in your project root.

| File | Purpose | Format | Location |
|------|---------|--------|----------|
| **`standards.md`** | Project configuration | YAML frontmatter + Markdown | Project root |

---

## `standards.md` - Single Source of Truth

The toolkit uses a single configuration file with YAML frontmatter for settings and Markdown for project-specific rules.

### Why This Format?

- ✅ **Simple** - One file for everything
- ✅ **Flexible** - Configuration + documentation in one place
- ✅ **Clear** - YAML for structure, Markdown for rules
- ✅ **Version Control Friendly** - Easy to track changes
- ✅ **Self-Documenting** - Configuration and docs together

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

framework: false
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

#### 1. YAML Frontmatter (Configuration)

**Required Fields:**
```yaml
name: "my-project"              # Project name
toolkit: "./ai-toolkit-shared"  # Path to toolkit
modules:                        # At least one module
  - couchcms-core
```

**Optional Fields:**
```yaml
description: "My CouchCMS project"  # Project description

agents:                         # AI agents to load
  - couchcms
  - tailwindcss

framework: false                # AAPF framework
# OR enable specific components:
# framework:
#   doctrine: true
#   directives: true
#   playbooks: true

context: ".project/ai"          # Context directory (optional)
```

#### 2. Markdown Body (Rules & Documentation)

The Markdown section contains your project-specific rules:

- Coding standards
- Architecture decisions
- Common patterns
- Workflows
- Team conventions

This content is included in generated AI configurations, giving AI assistants context about your project.

### Location

The toolkit looks for `standards.md` in this order:

1. `standards.md` (root directory) ⭐ **Recommended**
2. `.project/standards.md` (legacy location)
3. `docs/standards.md` (alternative location)

**Best Practice:** Keep it in the root directory for easy access.

---

## Configuration Schema

### Required Fields

```yaml
---
name: "my-project"              # Project identifier
toolkit: "./ai-toolkit-shared"  # Path to toolkit (relative)
modules:                        # Knowledge modules (at least one)
  - couchcms-core
---
```

### Optional Fields

```yaml
---
description: "Project description"  # Human-readable description

agents:                         # AI agents (optional)
  - couchcms
  - tailwindcss

framework: false                # AAPF framework (default: false)
# OR:
# framework: true               # Enable all components
# OR:
# framework:                    # Enable specific components
#   doctrine: true
#   directives: true
#   playbooks: true
#   enhancements: false

context: ".project/ai"          # Context directory (optional)
---
```

### Available Modules

Core:
- `couchcms-core` (required for CouchCMS projects)

Frontend:
- `tailwindcss`, `daisyui`, `alpinejs`, `typescript`

Backend:
- `databound-forms`, `custom-routes`

Content:
- `folders`, `archives`, `relationships`, `repeatable-regions`
- `search`, `pagination`, `comments`

User Features:
- `users`

📖 See [Modules Guide](MODULES.md) for complete list.

### Available Agents

Core:
- `couchcms`, `databound-forms`, `custom-routes`

Frontend:
- `alpinejs`, `tailwindcss`, `typescript`

Content:
- `views`, `folders`, `archives`, `relationships`, `repeatable-regions`
- `search`, `pagination`, `comments`, `nested-pages`, `photo-gallery`
- `rss-feeds`, `on-page-editing`

User Features:
- `users`

Development:
- `bun`, `git`, `mysql`, `admin-panel-theming`

📖 See [Agents Guide](AGENTS.md) for complete list.

---

## Generated Files (Auto-Created)

These files are **automatically generated** from your `standards.md`:

### Cursor IDE
- `.cursorrules` - Global Cursor AI configuration
- `.cursor/rules/*.mdc` - Context-aware MDC rules (auto-activate based on file patterns)

### Claude Code
- `.claude/settings.json` - Permissions, environment variables, and tool configuration
- `.claude/skills/*.md` - Modular knowledge units (one per module/agent)
- `CLAUDE.md` - Memory file loaded at startup with project context
- `AGENTS.md` - Documentation of all available agents

### Other Editors
- `.github/copilot-instructions.md` - GitHub Copilot configuration
- `.windsurf/rules.md` - Windsurf configuration
- `.kiro/steering/*.md` - Kiro steering files

**Do not edit these manually** - they're regenerated by `sync.js`.

📖 See [Editor Support Guide](EDITOR-SUPPORT.md) for detailed information about each editor's configuration.

---

## Workflow

### 1. Initial Setup

Run the interactive setup wizard:

```bash
bun ai-toolkit-shared/scripts/init.js
```

This creates `standards.md` with your selected modules and agents.

### 2. Customize Configuration

Edit `standards.md` to add project-specific rules:

```bash
code standards.md
```

### 3. Sync Configuration

Generate/update AI configs:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

### 4. Validate

Check configuration is valid:

```bash
bun ai-toolkit-shared/scripts/validate.js
```

### 5. Watch Mode (Optional)

Auto-sync when `standards.md` changes:

```bash
bun ai-toolkit-shared/scripts/sync.js --watch
```

---

## Examples

### Minimal Configuration

```yaml
---
name: "my-blog"
toolkit: "./ai-toolkit-shared"
modules:
  - couchcms-core
---

# My Blog

Simple blog with CouchCMS.
```

### Full-Featured Project

```yaml
---
name: "my-webapp"
description: "Full-featured web application"
toolkit: "./ai-toolkit-shared"

modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
  - typescript
  - databound-forms
  - users
  - search
  - pagination

agents:
  - couchcms
  - tailwindcss
  - alpinejs
  - typescript
  - databound-forms
  - users

framework:
  doctrine: true
  directives: true
  playbooks: true
---

# My Web Application

## Coding Standards

- Use TypeScript for all frontend code
- Follow TailwindCSS utility-first approach
- Alpine.js for interactive components
- DataBound Forms for all forms

## Architecture

- Components in `snippets/components/`
- Views in `snippets/views/`
- Forms in `snippets/forms/`
- TypeScript in `assets/ts/`

## Patterns

### Component Structure
[Your patterns...]
```

---

## Validation

The toolkit validates your configuration automatically:

```bash
bun ai-toolkit-shared/scripts/validate.js
```

This checks:
- ✅ Required fields are present
- ✅ Module names are valid
- ✅ Agent names are valid
- ✅ Toolkit path exists
- ✅ YAML syntax is correct

---

## Best Practices

1. ✅ **Keep it simple** - Start with minimal config, add as needed
2. ✅ **Document your rules** - Use Markdown section for project conventions
3. ✅ **Validate regularly** - Run `validate.js` after changes
4. ✅ **Use watch mode** - Auto-sync during development
5. ✅ **Version control** - Commit `standards.md`, ignore generated files
6. ❌ **Don't edit generated files** - They're regenerated on sync

---

## Common Questions

### Q: Where should I put standards.md?

**Answer:** In your project root directory. This is the simplest and most discoverable location.

### Q: Can I use a different location?

**Answer:** Yes, the toolkit also checks `.project/standards.md` and `docs/standards.md`, but root is recommended.

### Q: What if I have multiple projects?

**Answer:** Each project has its own `standards.md`. The toolkit is added as a submodule to each project.

### Q: How do I add custom rules?

**Answer:** Add them in the Markdown section (after the `---`). They'll be included in generated configs.

### Q: Do I need to run sync after every change?

**Answer:** Yes, or use watch mode: `bun scripts/sync.js --watch`

### Q: What happened to config.yaml?

**Answer:** It was removed in favor of the simpler `standards.md` format. One file is easier to maintain.

---

## Troubleshooting

### Configuration not found

**Error:** `Configuration file not found`

**Solution:** Create `standards.md` in project root:
```bash
bun ai-toolkit-shared/scripts/init.js
```

### Invalid YAML syntax

**Error:** `Failed to parse YAML frontmatter`

**Solution:** Check YAML syntax in frontmatter:
- Proper indentation (2 or 4 spaces)
- No tabs
- Quotes around strings with special characters

### Module not found

**Error:** `Module 'xyz' not found`

**Solution:** Check module name spelling. See [Modules Guide](MODULES.md) for valid names.

### Sync fails

**Error:** Various sync errors

**Solution:**
1. Validate config: `bun scripts/validate.js`
2. Check toolkit path is correct
3. Ensure toolkit dependencies are installed: `cd ai-toolkit-shared && bun install`

---

## Summary

- **One file**: `standards.md` in project root
- **Two parts**: YAML frontmatter (config) + Markdown (rules)
- **Simple workflow**: Edit → Sync → Validate
- **Auto-generated**: All IDE configs created from this file

**Keep it simple** - one configuration file, clearly structured!

---

## See Also

- [Getting Started](GETTING-STARTED.md)
- [Command Reference](COMMANDS.md)
- [Modules Guide](MODULES.md)
- [Agents Guide](AGENTS.md)
- [Troubleshooting](TROUBLESHOOTING.md)
