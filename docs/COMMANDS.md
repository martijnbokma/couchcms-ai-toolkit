# Command Reference

Complete reference for all toolkit commands.

## Overview

**New:** Use the unified `toolkit` command for all operations. This is the recommended way to interact with the toolkit.

| Command | Purpose | Example |
|---------|---------|---------|
| `toolkit install` | First-time installation and setup | `bun ai-toolkit-shared/scripts/toolkit.js install` |
| `toolkit setup` | Configure or reconfigure project | `bun ai-toolkit-shared/scripts/toolkit.js setup` |
| `toolkit sync` | Generate/update AI configuration files | `bun ai-toolkit-shared/scripts/toolkit.js sync` |
| `toolkit validate` | Validate project configuration & compliance | `bun ai-toolkit-shared/scripts/toolkit.js validate` |
| `toolkit health` | Check installation status | `bun ai-toolkit-shared/scripts/toolkit.js health` |
| `toolkit browse` | Browse available modules/agents | `bun ai-toolkit-shared/scripts/toolkit.js browse` |
| `toolkit reconfigure` | Change setup complexity preference | `bun ai-toolkit-shared/scripts/toolkit.js reconfigure` |
| `toolkit help` | Show help message | `bun ai-toolkit-shared/scripts/toolkit.js help` |

**Note:** All commands should be run from your **project root** directory, not from inside `ai-toolkit-shared`.

**💡 Easier to Remember:** After installation, you can add a script to `package.json`:
```bash
# Run once to add script
bun ai-toolkit-shared/scripts/add-toolkit-script.js

# Then use the simpler format:
bun run toolkit install
bun run toolkit sync
bun run toolkit health
```

**Legacy commands** (still work, but use `toolkit` instead):
- `init` → Use `toolkit setup` or `toolkit install`
- `create-standards` → Use `toolkit setup` or `toolkit install`

---

## bun ai-toolkit-shared/scripts/toolkit.js install

**Purpose:** First-time installation and setup

**When to use:**
- Setting up toolkit for the first time
- New project
- After adding toolkit as git submodule

**Usage:**
```bash
# From project root directory
bun ai-toolkit-shared/scripts/toolkit.js install
```

**What it does:**
1. ✅ Checks and installs dependencies automatically
2. ✅ Shows setup complexity menu (Easy/Medium/Comprehensive)
3. ✅ Guides you through project setup
4. ✅ Creates `.project/standards.md` configuration file
5. ✅ Generates all AI editor configs

**Options:**
```bash
# Specify complexity directly
bun ai-toolkit-shared/scripts/toolkit.js install --complexity=easy
bun ai-toolkit-shared/scripts/toolkit.js install --complexity=medium
bun ai-toolkit-shared/scripts/toolkit.js install --complexity=comprehensive

# Show all options regardless of complexity
bun ai-toolkit-shared/scripts/toolkit.js install --show-all
```

**Example Session:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js install

🚀 CouchCMS AI Toolkit - Installation

🔄 Checking dependencies...
✅ Dependencies installed

======================================================================
  What kind of setup do you want?
======================================================================

  1. Easy
     → Quick setup: 1 minute, 2 questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Includes: TailwindCSS + Alpine.js (recommended defaults)
     → Perfect for: Getting started quickly

  2. Medium
     → Balanced setup: 3 minutes, 5 questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Choose: CSS framework (TailwindCSS, daisyUI, custom)
     → Choose: JS framework (Alpine.js, TypeScript, none)
     → Perfect for: Most projects

  3. Comprehensive
     → Full setup: 5 minutes, 8+ questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Choose: All frontend frameworks and tools
     → Choose: Advanced configuration (framework, context directory)
     → Perfect for: Complete control

Choice [1-3]: 1

✅ Selected: Easy
ℹ️  Starting Easy setup...

======================================================================
  CouchCMS Modules & Agents (Automatic)
======================================================================
ℹ️  Including all CouchCMS modules and agents automatically...
  Modules: 11 (always included)
  Agents: 16 (always included)
✅ CouchCMS components will be included automatically

======================================================================
  Project Information
======================================================================

Project name [my-project]: my-blog
Project description [A CouchCMS web application]: A blog about web development

🔄 Selecting frontend frameworks...
ℹ️  Using recommended CSS framework: tailwindcss
ℹ️  Using recommended JS framework: alpinejs
✅ Selected: tailwindcss
✅ Selected: alpinejs

🔄 Detecting toolkit path...
✅ Toolkit path: ./ai-toolkit-shared

🔄 Generating configuration file...
✅ Created: .project/
✅ Created: .project/standards.md

🔄 Running initial sync...
✅ Sync completed successfully

======================================================================
  ✅ Setup Complete!
======================================================================

✅ Your CouchCMS AI Toolkit is now configured!

📦 Included Components:
   • CouchCMS Modules: 11 (automatic)
   • Frontend Modules: 2 (selected)
   • Agents: 18 total

📝 Configuration:
   • File: .project/standards.md
   • Complexity: easy

🚀 Next Steps:
   1. Review your configuration: .project/standards.md
   2. Run sync to generate configs: bun ai-toolkit-shared/scripts/toolkit.js sync
   3. Start developing with AI assistance!

💡 Useful Commands:
   • bun ai-toolkit-shared/scripts/toolkit.js sync       - Generate configs from standards.md
   • bun ai-toolkit-shared/scripts/toolkit.js validate   - Check configuration
   • bun ai-toolkit-shared/scripts/toolkit.js health    - Check installation status
   • bun ai-toolkit-shared/scripts/toolkit.js reconfigure - Change setup complexity
```

**Key Features:**
- ✅ Automatic dependency installation
- ✅ All CouchCMS modules/agents included automatically
- ✅ Clear, concrete setup options
- ✅ Progressive disclosure (can access more options anytime)

---

## bun ai-toolkit-shared/scripts/toolkit.js setup

**Purpose:** Configure or reconfigure your project

**When to use:**
- Reconfiguring existing project
- Changing frontend frameworks
- Adding/removing modules or agents
- Updating project information

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js setup
```

**Options:**
```bash
# Use specific complexity
bun ai-toolkit-shared/scripts/toolkit.js setup --complexity=easy
bun ai-toolkit-shared/scripts/toolkit.js setup --complexity=medium
bun ai-toolkit-shared/scripts/toolkit.js setup --complexity=comprehensive

# Show all options (temporary override)
bun ai-toolkit-shared/scripts/toolkit.js setup --show-all
```

**What it does:**
1. Checks for existing configuration
2. Uses stored complexity preference (or asks if none)
3. Guides through setup based on complexity
4. Updates `.project/standards.md`
5. Optionally runs sync to update configs

**Example:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js setup

⚙️  CouchCMS AI Toolkit - Project Setup

🔄 Checking dependencies...
✅ Dependencies ready

Current setup complexity: Easy

[Shows complexity menu if no preference stored]

[Continues with setup flow...]
```

---

## bun ai-toolkit-shared/scripts/toolkit.js reconfigure

**Purpose:** Change your setup complexity preference

**When to use:**
- Want to switch from Easy to Medium or Comprehensive
- Want to access more frontend options
- Want to simplify your setup

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js reconfigure
```

**What it does:**
1. Shows current complexity preference
2. Lets you choose new complexity
3. Saves preference to `.toolkit-preference`
4. Optionally runs setup with new complexity

**Example:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js reconfigure

🔄 CouchCMS AI Toolkit - Reconfigure

ℹ️  Current setup complexity: Easy

Choose new setup complexity:
[Shows complexity menu]

✅ Updated preference to: Medium
Run setup with new complexity? [Y/n]: y

[Continues with setup...]
```

---

## bun ai-toolkit-shared/scripts/toolkit.js sync

**Purpose:** Generate AI editor configs from `.project/standards.md`

**When to use:**
- After editing `.project/standards.md`
- After adding/removing modules or agents
- To update all editor configurations
- Regularly to keep configs in sync

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js sync
```

**Watch mode** (auto-sync on file changes):
```bash
bun ai-toolkit-shared/scripts/toolkit.js sync --watch
# or
bun run sync:watch
```

**What it generates:**
- `.cursorrules` - Cursor AI configuration
- `.cursor/rules/*.mdc` - Context-aware MDC rules
- `CLAUDE.md` - Claude Code memory file
- `.claude/skills/*.md` - Claude Code skills
- `.claude/settings.json` - Claude Code settings
- `.github/copilot-instructions.md` - GitHub Copilot
- `.windsurf/rules.md` - Windsurf AI
- `.kiro/steering/*.md` - Kiro steering files
- And more...

**Example:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js sync

🔄 Generating AI configurations...

📝 Reading configuration: .project/standards.md
✅ Configuration loaded

📦 Loading modules...
✅ Loaded 13 modules

🤖 Loading agents...
✅ Loaded 19 agents

📝 Generating editor configs...
✅ Generated: .cursorrules
✅ Generated: .cursor/rules/couchcms.mdc
✅ Generated: .cursor/rules/tailwindcss.mdc
✅ Generated: CLAUDE.md
✅ Generated: .claude/skills/couchcms-core.md
✅ Generated: .claude/settings.json
✅ Generated: .github/copilot-instructions.md
✅ Generated: .windsurf/rules.md

✨ Sync completed successfully!
```

---

## bun ai-toolkit-shared/scripts/toolkit.js validate

**Purpose:** Validate project configuration and check compliance

**When to use:**
- After setup to verify everything is correct
- After editing `.project/standards.md`
- To check for configuration errors
- To see compliance score

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js validate
```

**What it checks:**
1. ✅ Configuration file exists (`.project/standards.md`)
2. ✅ YAML syntax is valid
3. ✅ Toolkit path is correct and accessible
4. ✅ All modules exist in toolkit
5. ✅ All agents exist in toolkit
6. ✅ Generated files exist (optional check)
7. ✅ Configuration compliance (0-100% score)

**Example Output:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js validate

🔍 CouchCMS AI Toolkit - Validation

📄 Found: .project/standards.md
🛠️  Toolkit: ./ai-toolkit-shared
📚 Modules: 13 (couchcms-core, tailwindcss, daisyui, alpinejs, ...)
🤖 Agents: 19 (couchcms, tailwindcss, alpinejs, ...)

📊 Compliance Score: 100/100 (100%)

✅ Validation passed - All checks OK!
```

**With Warnings:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js validate

🔍 CouchCMS AI Toolkit - Validation

📄 Found: .project/standards.md
🛠️  Toolkit: ./ai-toolkit-shared
📚 Modules: 12 (couchcms-core, tailwindcss, invalid-module)
🤖 Agents: 18 (couchcms, invalid-agent)

⚠️  Warnings:
  - Module 'invalid-module' not found in toolkit
  - Agent 'invalid-agent' not found in toolkit
  - Generated file '.cursorrules' not found (run sync)

📊 Compliance Score: 85/100 (85%)

⚠️  Validation completed with warnings
```

---

## bun ai-toolkit-shared/scripts/toolkit.js health

**Purpose:** Check toolkit installation and status

**When to use:**
- Verify installation is correct
- Check if dependencies are installed
- See what modules/agents are available
- Troubleshoot installation issues

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js health
```

**What it checks:**
1. ✅ Toolkit directory structure
2. ✅ Dependencies installed (`node_modules/`)
3. ✅ Configuration file exists
4. ✅ Modules available
5. ✅ Agents available
6. ✅ Toolkit path is correct

**Example Output:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js health

💚 CouchCMS AI Toolkit - Health Check

✅ Toolkit structure is valid
✅ Dependencies installed
✅ Configuration file found: .project/standards.md
✅ Modules available: 15
✅ Agents available: 23
✅ Toolkit path: ./ai-toolkit-shared

🎉 All checks passed! Your toolkit is ready to use.
```

**With Issues:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js health

💚 CouchCMS AI Toolkit - Health Check

✅ Toolkit structure is valid
❌ Dependencies not installed
   Fix: cd ai-toolkit-shared && bun install && cd ..
✅ Configuration file found: .project/standards.md
✅ Modules available: 15
✅ Agents available: 23

⚠️  Some issues found. See above for fixes.
```

---

## bun ai-toolkit-shared/scripts/toolkit.js browse

**Purpose:** Browse available modules and agents interactively

**When to use:**
- See what modules are available
- See what agents are available
- Learn about module/agent descriptions
- Find module/agent names for configuration

**Usage:**
```bash
# Browse all
bun ai-toolkit-shared/scripts/toolkit.js browse

# Browse modules only
bun ai-toolkit-shared/scripts/toolkit.js browse --modules

# Browse agents only
bun ai-toolkit-shared/scripts/toolkit.js browse --agents
```

**Example:**
```bash
$ bun ai-toolkit-shared/scripts/toolkit.js browse --modules

📚 Available Modules:

1. couchcms-core
   Core CouchCMS patterns, templates, and security standards
   [Always included]

2. tailwindcss
   TailwindCSS 4 patterns and best practices

3. daisyui
   daisyUI 5 components and theming

4. alpinejs
   Alpine.js patterns and CouchCMS integration

[... more modules ...]

Press Enter to continue...
```

---

## bun ai-toolkit-shared/scripts/toolkit.js help

**Purpose:** Show help message with all commands

**Usage:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js help
# or
bun ai-toolkit-shared/scripts/toolkit.js
```

**Output:**
```
CouchCMS AI Toolkit - Unified CLI

Usage:
  toolkit [subcommand] [options]

Subcommands:
  install          Install toolkit (first-time setup)
  setup            Configure project (progressive disclosure based on complexity)
  reconfigure      Change complexity preference and reconfigure
  sync             Generate configs from standards.md
  validate         Check configuration
  health           Check installation status
  browse           Browse modules/agents interactively
  update           Update toolkit
  help             Show this help message

Options:
  --complexity=<level>    Setup complexity: easy, medium, comprehensive
  --show-all              Show all options (temporary override)

Examples:
  toolkit install                    # First-time installation
  toolkit setup                      # Configure project
  toolkit setup --complexity=easy    # Quick setup
  toolkit reconfigure                # Change complexity preference
  toolkit sync                       # Generate configs
  toolkit health                     # Check installation

For more information, see: docs/START-HERE.md
```

---

## Setup Complexity Options

All setup commands support three complexity levels:

### Easy
- **Time:** 1 minute
- **Questions:** 2 (project name, description)
- **CouchCMS:** All modules/agents included automatically
- **Frontend:** TailwindCSS + Alpine.js (recommended defaults)
- **Perfect for:** Getting started quickly

### Medium
- **Time:** 3 minutes
- **Questions:** 5 (project info + CSS choice + JS choice)
- **CouchCMS:** All modules/agents included automatically
- **Frontend:** Choose CSS framework, choose JS framework
- **Perfect for:** Most projects, want to choose frameworks

### Comprehensive
- **Time:** 5 minutes
- **Questions:** 8+ (all frontend options + advanced config)
- **CouchCMS:** All modules/agents included automatically
- **Frontend:** All options (CSS, JS, advanced configuration)
- **Perfect for:** Complete control over frontend setup

**Important:** All CouchCMS modules and agents are **always included** regardless of complexity choice.

---

## Legacy Commands

These commands still work but are deprecated. Use `toolkit` commands instead:

| Legacy | New Equivalent |
|--------|----------------|
| `bun ai-toolkit-shared/scripts/init.js` | `bun ai-toolkit-shared/scripts/toolkit.js setup` |
| `bun ai-toolkit-shared/scripts/create-standards.js` | `bun ai-toolkit-shared/scripts/toolkit.js install` |
| `bun ai-toolkit-shared/scripts/sync.js` | `bun ai-toolkit-shared/scripts/toolkit.js sync` |
| `bun ai-toolkit-shared/scripts/validate.js` | `bun ai-toolkit-shared/scripts/toolkit.js validate` |
| `bun ai-toolkit-shared/scripts/health.js` | `bun ai-toolkit-shared/scripts/toolkit.js health` |
| `bun ai-toolkit-shared/scripts/browse.js` | `bun ai-toolkit-shared/scripts/toolkit.js browse` |

---

## Common Workflows

### First-Time Setup
```bash
# 1. Add toolkit
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install and setup
bun ai-toolkit-shared/scripts/toolkit.js install

# 3. Verify
bun ai-toolkit-shared/scripts/toolkit.js health
```

### Update Configuration
```bash
# 1. Edit .project/standards.md manually
# or run setup again
bun ai-toolkit-shared/scripts/toolkit.js setup

# 2. Generate new configs
bun ai-toolkit-shared/scripts/toolkit.js sync

# 3. Validate
bun ai-toolkit-shared/scripts/toolkit.js validate
```

### Change Complexity
```bash
# Change from Easy to Medium
bun ai-toolkit-shared/scripts/toolkit.js reconfigure

# Or use setup with complexity flag
bun ai-toolkit-shared/scripts/toolkit.js setup --complexity=medium
```

### Daily Usage
```bash
# After editing standards.md
bun ai-toolkit-shared/scripts/toolkit.js sync

# Check everything is OK
bun ai-toolkit-shared/scripts/toolkit.js validate
```

---

## Command Options

### Complexity Options
- `--complexity=easy` - Quick setup with defaults
- `--complexity=medium` - Choose frameworks
- `--complexity=comprehensive` - All options

### Other Options
- `--show-all` - Show all options (temporary override)
- `--watch` - Watch mode for sync (auto-sync on changes)
- `--modules` - Filter browse to modules only
- `--agents` - Filter browse to agents only

---

## Getting Help

- **Start Here:** [docs/START-HERE.md](START-HERE.md) - Decision tree
- **Quick Start:** [docs/QUICK-START-BEGINNER.md](QUICK-START-BEGINNER.md) - Step-by-step guide
- **Concepts:** [docs/CONCEPTS.md](CONCEPTS.md) - Understanding modules, agents, etc.
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix issues

---

**Ready to start?** Run `bun ai-toolkit-shared/scripts/toolkit.js install` now! 🚀
