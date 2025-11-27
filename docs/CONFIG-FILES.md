# Configuration Files Guide

Complete guide to configuration files in the CouchCMS AI Toolkit.

## Quick Summary

| File | Purpose | Required? | When to Use |
|------|---------|-----------|-------------|
| **`.project/standards.md`** | Primary configuration file | ✅ Yes | Always - your single source of truth |
| **`.project/ai/context.md`** | Extensive documentation | ❌ Optional | Only for >1000 lines of docs (rare) |

---

## `.project/standards.md` (Primary Configuration File)

**This is your main configuration file - use this for everything!**

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
   - Paths, standards, naming conventions

2. **Markdown Body** (Rules & Documentation):
   - Project-specific coding rules
   - Architecture decisions
   - Code patterns
   - Workflows
   - Everything else about your project

### Location Priority

The toolkit looks for `standards.md` in this order:

1. `.project/standards.md` ⭐ **Recommended**
2. `docs/standards.md`
3. `standards.md` (root directory)

### When to Use

✅ **Always** - This is your primary configuration file.

For 95% of projects, this is **all you need**. Everything goes in this one file.

---

## `.project/ai/context.md` (Optional - Rarely Needed)

**Only use this if you have >1000 lines of documentation.**

### What It Is

An optional file for **extensive project documentation** that's too large for `standards.md`.

### When to Use

**You need it when:**
- Your `standards.md` body exceeds **>1000 lines**
- You want to separate configuration from extensive documentation
- You're working in a large team with extensive shared context

**You don't need it when:**
- Your project is typical size (<1000 lines)
- You're just getting started
- You have a simple to medium-sized project

### Structure

```markdown
---
name: My Project Context
---

# Extensive Project Documentation

## Content Architecture
[Extensive details...]

## Code Patterns
[Many examples...]

## Component Library
[Detailed documentation...]
```

### How It's Used

- Loaded separately from `standards.md`
- Added as "# Project Context" section in generated AI config files
- Combined with `standards.md` content during sync

### Recommendation

**Start without it.** Only add `context.md` if your `standards.md` becomes very large (>1000 lines).

---

## How They Work Together

### Simple Project (95% of cases)

```
.project/standards.md
├── YAML: Configuration
└── Markdown: All rules & docs
```

**That's it!** One file for everything.

### Complex Project (5% of cases)

```
.project/standards.md
├── YAML: Configuration
└── Markdown: Core rules (<1000 lines)

.project/ai/context.md
└── Markdown: Extensive documentation (>1000 lines)
```

**Only if needed** - most projects never need this.

---

## Automatic Detection

The toolkit automatically detects and uses `standards.md` as the single source of truth.

### Detection Logic

The toolkit searches for configuration files in this priority order:

1. **`.project/standards.md`** (recommended)
    - Project configuration directory
    - Consistent with `.project/ai/context.md` structure
    - Logical location for project-specific config
    - Keeps root directory clean

2. **`docs/standards.md`** (documentation location)
    - Clear organization
    - Follows documentation conventions
    - Easy to find and maintain

3. **`standards.md`** (root directory)
    - Simple path
    - More visible
    - Still works perfectly

### How It Works

#### In Scripts

All toolkit scripts (`init.js`, `sync.js`, `validate.js`) use the `findConfigFile()` utility:

```javascript
import { findConfigFile, loadConfig } from './utils.js'

// Automatically finds standards.md
const configPath = findConfigFile(process.cwd())

// Loads and parses the file
const config = loadConfig(process.cwd())
```

#### In Prompts

All prompts automatically include:

```markdown
**Critical: Always follow project standards before generating any code.**

## Standards Reference

This prompt automatically uses standards from:

- `.project/standards.md` (if exists - recommended)
- `docs/standards.md` (if exists)
- `standards.md` (if exists)
```

#### In Validators

The standards validator (`prompts/validators/standards.md`) automatically:

1. Detects `standards.md` location
2. Parses YAML frontmatter
3. Extracts coding standards
4. Validates prompts against standards
5. Reports compliance score

---

## File Format

### Required Structure

```yaml
---
project:
    name: 'my-project'
    type: 'couchcms-webapp'
    description: 'Project description'
languages:
    - php,typescript,css,html
frameworks:
    - couchcms,tailwindcss_v4,alpinejs
standards:
    indentation: 4
    line_length: 120
    language: 'english'
---

# Universal AI Coding Standards

[Your standards documentation here...]
```

### YAML Frontmatter

The YAML frontmatter contains:

- **project**: Name, type, description
- **languages**: Supported languages
- **frameworks**: Technology stack
- **standards**: Coding rules (indentation, line length, etc.)
- **naming**: Naming conventions per language

### Markdown Content

The markdown content contains:

- Coding standards
- Best practices
- Quality checklists
- Project-specific rules
- Code examples

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
Do you have a configuration file?
├── No → Run: bun ai-toolkit-shared/scripts/init.js
└── Yes
    └── Is it standards.md?
        ├── Body < 1000 lines?
        │   └── Yes → Perfect! You're done.
        └── Body > 1000 lines?
            └── Consider adding .project/ai/context.md
```

---

## Common Questions

### Q: Which file should I use?

**Answer:** Use `.project/standards.md` - that's all you need for most projects.

### Q: Do I need context.md?

**Answer:** Probably not. Only if your `standards.md` body exceeds 1000 lines.

### Q: Can I put everything in standards.md?

**Answer:** Yes! That's the recommended approach. Only split if it becomes >1000 lines.

### Q: What's the difference between standards.md body and context.md?

**Answer:**
- `standards.md` body: Your project rules and documentation
- `context.md`: Only for extensive documentation (>1000 lines) that you want to separate

For most projects, just use `standards.md` body - no `context.md` needed.

---

## Best Practices

1. ✅ **Use `.project/standards.md`** as your primary file
2. ✅ **Put everything in one file** (standards.md) for simplicity
3. ✅ **Only add `context.md`** if standards.md exceeds 1000 lines
4. ❌ **Don't edit generated files** (.cursorrules, CLAUDE.md, etc.)

---

## Summary

- **One file for everything**: `.project/standards.md`
- **Optional extension**: `context.md` (only for >1000 lines, rare)

**Keep it simple** - most projects only need `standards.md`!

---

## See Also

- [Getting Started](GETTING-STARTED.md)
- [Command Reference](COMMANDS.md)
- [Standards Validator](../prompts/validators/standards.md)
