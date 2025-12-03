# Configuration Files Guide

Complete guide to configuration in the CouchCMS AI Toolkit.

## Quick Summary

The toolkit uses a single configuration file: **`standards.md`** in your project root.

| File | Purpose | Format | Location |
|------|---------|--------|----------|
| **`standards.md`** | Project configuration | YAML frontmatter + Markdown | Project root |

---

## `standards.md` - Single Source of Truth

The toolkit uses a single configuration file with [YAML frontmatter](GLOSSARY.md#yaml-frontmatter) for settings and Markdown for project-specific rules.

**New to these terms?** See [Glossary](GLOSSARY.md) for definitions.

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
```text

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

context: "config/context"       # Context directory (optional - see below)
```yaml

#### Context Directory (Optional)

The \`context\` field specifies a directory for additional project documentation organized by topic. **Most projects don't need this** - keep everything in \`standards.md\` for simplicity.

**When to use:**
- Your \`standards.md\` exceeds 1000 lines
- You have extensive architecture or domain documentation
- Multiple team members maintain different aspects of documentation
- You want to separate configuration from detailed documentation

**Best practices:**
- ✅ Start with everything in \`standards.md\`
- ✅ Organize context files by topic (architecture.md, patterns.md, workflows.md)
- ✅ Keep \`standards.md\` focused on configuration and core rules
- ❌ Don't create context files prematurely
- ❌ Don't duplicate information between files

**Example structure:**
\`\`\`
config/
├── standards.md          # Configuration and core rules
└── context/              # Detailed documentation (optional)
    ├── architecture.md   # System architecture
    ├── patterns.md      # Coding patterns
    └── workflows.md     # Development workflows
\`\`\`

#### 2. Markdown Body (Rules & Documentation)

The Markdown section contains your project-specific rules:

- Coding standards
- Architecture decisions
- Common patterns
- Workflows
- Team conventions

This content is included in generated AI configurations, giving AI assistants context about your project.

**Tip:** If this section grows beyond 1000 lines, consider moving detailed documentation to \`config/context/\` files and keeping only essential rules in \`standards.md\`.

### Location

The toolkit looks for `standards.md` in this order:

1. `config/standards.md` ⭐ **Recommended** (visible in Finder, organized)
2. 📝 `.project/standards.md` (backward compatibility)
3. 📝 `docs/standards.md` (legacy location)
4. 📝 `standards.md` (root, legacy location)

**Best Practice:** Use `config/standards.md` for better visibility and organization. The `config/` directory keeps your root clean while remaining easily accessible.

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

context: "config/context"       # Context directory (optional)

editors:                        # Target editors (optional)
  - cursor                      # Default: all editors
  - claude
  - windsurf
  - kiro
  - copilot
---
```text

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
# Run the advanced setup wizard
# This provides full control over modules, agents, and configuration
bun ai-toolkit-shared/scripts/init.js

# The wizard will guide you through:
# - Project name and description
# - Module selection (CouchCMS features)
# - Agent selection (AI assistants)
# - Configuration file location
```

This creates `standards.md` with your selected modules and agents.

### 2. Customize Configuration

Edit `standards.md` to add project-specific rules:

```bash
code standards.md
```text

### 3. Sync Configuration

Generate/update AI configs:

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

### 4. Validate

Check configuration is valid:

```bash
# Validate your project configuration and check compliance
# This checks for errors in standards.md and missing files
bun ai-toolkit-shared/scripts/validate.js

# The validation will show:
# - Configuration file status
# - Module and agent validation
# - Compliance score (0-100%)
# - Specific issues and recommendations
```text

### 5. Watch Mode (Optional)

Auto-sync when `standards.md` changes:

```bash
# Generate AI configuration files
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
```yaml

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
# Validate your project configuration and check compliance
# This checks for errors in standards.md and missing files
bun ai-toolkit-shared/scripts/validate.js

# The validation will show:
# - Configuration file status
# - Module and agent validation
# - Compliance score (0-100%)
# - Specific issues and recommendations
```text

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

## Context Directory - When and How to Use

### What is it?

The context directory (`config/context/`) allows you to organize extensive project documentation into separate files by topic. AI agents automatically read these files to understand your project's architecture, patterns, workflows, and domain knowledge.

### When to use it?

**Most projects don't need this.** Start with everything in `config/standards.md`.

Use `config/context/` when:

1. **Large projects** - Your `standards.md` exceeds 1000 lines and becomes hard to navigate
2. **Team collaboration** - Multiple team members need to maintain different aspects of documentation
3. **Complex projects** - You have extensive architecture, domain knowledge, or integration documentation
4. **Better organization** - You want to separate configuration (`standards.md`) from detailed documentation

### Best Practices

#### ✅ DO:

- **Start simple** - Begin with everything in `config/standards.md`
- **Organize by topic** - Create separate files for different concerns (architecture, patterns, workflows)
- **Keep it focused** - Each file should cover one main topic
- **Use clear names** - Name files descriptively (`architecture.md`, `api-patterns.md`)
- **Keep standards.md lean** - Move detailed documentation to context files, keep configuration in `standards.md`

#### ❌ DON'T:

- **Don't create prematurely** - Only create context files when `standards.md` becomes unwieldy
- **Don't duplicate** - Don't repeat information between `standards.md` and context files
- **Don't over-organize** - Too many small files are harder to navigate than one larger file
- **Don't mix concerns** - Keep configuration separate from documentation

### Example Structure

```
config/
├── standards.md          # Configuration and core rules (keep this lean)
└── context/              # Detailed documentation (only if needed)
    ├── README.md         # Explains the structure
    ├── architecture.md   # System architecture and design decisions
    ├── patterns.md       # Common coding patterns and conventions
    ├── workflows.md      # Development workflows and processes
    ├── domain.md         # Domain-specific knowledge and business rules
    └── integrations.md   # External integrations and APIs
```

### How it works

1. AI agents automatically read all files in `config/context/`
2. Files are included in generated editor configurations (CLAUDE.md, .cursorrules, etc.)
3. You can reference specific context files in prompts: "See config/context/architecture.md"
4. Changes are picked up automatically when you run `sync`

### Migration Guide

**When to migrate:**

Consider creating context files when:
- `config/standards.md` exceeds 1000 lines
- You find yourself scrolling a lot to find specific information
- Team members ask "where is X documented?"
- You want to separate "what to do" (standards.md) from "how it works" (context/)

**How to migrate:**

1. Create `config/context/` directory
2. Move detailed documentation sections from `standards.md` to appropriate context files
3. Keep only essential configuration and core rules in `standards.md`
4. Update `context` field in `standards.md` frontmatter: `context: "config/context"`
5. Run `sync` to regenerate configurations

---

## Common Questions

### Q: Where should I put standards.md?

**Answer:** Use `config/standards.md` (recommended - visible in Finder). The toolkit also checks `.project/standards.md` and `docs/standards.md` for backward compatibility.

### Q: Do I need a context directory?

**Answer:** Most projects don't need it. Start with everything in `config/standards.md`. Only create context files when your `standards.md` exceeds 1000 lines or you need better organization for team collaboration.

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
# Run the advanced setup wizard
# This provides full control over modules, agents, and configuration
bun ai-toolkit-shared/scripts/init.js

# The wizard will guide you through:
# - Project name and description
# - Module selection (CouchCMS features)
# - Agent selection (AI assistants)
# - Configuration file location
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
2. 🔍 Check toolkit path is correct
3. ⚙️ Ensure toolkit dependencies are installed: `cd ai-toolkit-shared && bun install`

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
