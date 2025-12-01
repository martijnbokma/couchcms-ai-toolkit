# CouchCMS AI Toolkit

Universal AI Development Toolkit for CouchCMS Projects.

Provides consistent AI assistance across all your projects with modules, agents, and automated configuration generation.

## ✨ Features

### Smart Setup


> [!WARNING]
> **Critical Step**
> 
> You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (gray-matter, yaml, handlebars) that need to be installed first.

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

This installs the required packages:
- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing
- `handlebars` - Template generation

- 🔍 **Auto-Detection** - Automatically detects project type, frameworks, and languages
- �  **Project Presets** - Choose from 8 common project types (blog, ecommerce, webapp, etc.)
- 🎯 **Interactive Setup Wizard** - Get started in 2 minutes with 4 setup modes
- ✅ **Health Check** - Validate installation and check for updates

### Developer Experience
- 👀 **Watch Mode** - Auto-sync configs when standards.md changes
- 🔄 **Update Notifier** - Get notified when toolkit updates are available
- 🎨 **Interactive Browser** - Browse and select modules/agents with keyboard navigation
- 📊 **Project Validation** - Compliance checking (0-100% score)

### Editor Support
- 🎯 **Cursor MDC Rules** - Context-aware rules that auto-activate based on file patterns
- 🧠 **Claude Code Skills** - Modular knowledge units with auto-activation
- ⚙️ **Claude Settings** - Permissions, environment variables, and tool configuration
- 📝 **Memory Files** - Project context loaded at startup (CLAUDE.md, AGENTS.md)
- 🔄 **Auto-Sync** - All editor configs generated from single source of truth

**Generated Files:**
- `.cursorrules` - Cursor AI configuration
- `.cursor/rules/*.mdc` - Context-aware MDC rules (auto-activate)
- `CLAUDE.md` - Claude Code memory file
- `.claude/skills/*.md` - Claude Code skills (modular knowledge)
- `.claude/settings.json` - Claude Code settings
- `AGENTS.md` - Agent documentation
- `.github/copilot-instructions.md` - GitHub Copilot configuration
- `.windsurf/rules.md` - Windsurf AI configuration
- `.kiro/steering/*.md` - Kiro steering files

### Configuration
- 🔄 **Auto-Generated Configs** - Cursor, Claude, Copilot, Windsurf, Kiro ready
- 📦 **15 Knowledge Modules** - CouchCMS, TailwindCSS, Alpine.js, TypeScript, daisyUI, DataBound Forms, Search, Pagination, Users, Comments, and more
- 🤖 **23 AI Agents** - Specialized guidance for daily development
- 📋 **Auto-Loading Rules** - Context-aware refactoring patterns (Cursor MDC)
- 🎯 **Claude Code Skills** - Modular knowledge with auto-activation
- 🔧 **Zero Config** - Works out of the box

## ⚡ Prerequisites

- **Git** - For submodule management
- **Bun** (recommended) or **Node.js** (v18+) - JavaScript runtime
  - Install Bun: `curl -fsSL https://bun.sh/install | bash`

> [!CAUTION]
> **Important**
> 
> After adding the submodule, **always** run `bun install` in `ai-toolkit-shared/` before using any scripts.

## 🚀 Quick Start

### Quick Install (3 steps)

Get started in under a minute:

```bash
# 1. Add toolkit as submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install dependencies (REQUIRED!)
cd ai-toolkit-shared && bun install && cd ..

# 3. Run setup wizard
bun ai-toolkit-shared/scripts/create-standards.js
```

**New: Simple Standards Creator** - Answer a few simple questions and the wizard automatically creates your configuration. Perfect for beginners!

**Alternative: Advanced Setup**
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

**Choose "Auto" mode** (recommended) - automatically detects your project type, frameworks, and recommends modules.

**Other modes:**
- **Preset** - Choose from common project types (blog, ecommerce, webapp, etc.)
- **Simple** - Quick setup with standard defaults
- **Custom** - Full control over all options

**Result:** Configuration file (`.project/standards.md`) and all IDE configs (`.cursorrules`, `.claude/`, etc.) are generated automatically.

### One-Command Install

```bash
# 1. Install toolkit
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash

# 2. Run setup wizard
cd ai-toolkit-shared && bun run init
```

The install script automatically:
- ✅ Adds toolkit as git submodule
- ✅ Installs dependencies (bun/npm)
- ✅ Cleans up any previous installation artifacts

Then run `init.js` to configure your project and generate AI configs.

📖 **[See all installation methods](docs/INSTALLATION-METHODS.md)** - Bash, Bun, Manual, Git Clone

📖 **For detailed setup instructions**, see [Getting Started Guide](docs/GETTING-STARTED.md).

📖 **Upgrading from old format?** See [Migration Guide](docs/MIGRATION.md).

## 📋 Project Presets

Choose from 8 predefined configurations during setup:

| Preset | Description | Modules |
|--------|-------------|---------|
| **Landing Page** | Simple landing page | Core, TailwindCSS, Alpine.js |
| **Blog** | Blog with comments & search | Core, TailwindCSS, Alpine.js, Comments, Search, Pagination |
| **E-commerce** | Online store | Core, TailwindCSS, Alpine.js, DataBound Forms, Users, Search |
| **Web Application** | Full-featured webapp | Core, TailwindCSS, Alpine.js, TypeScript, DataBound Forms, Users |
| **Portfolio** | Portfolio showcase | Core, TailwindCSS, Alpine.js |
| **Documentation** | Documentation site | Core, TailwindCSS, Alpine.js, Search, Pagination |
| **Minimal** | Bare minimum | Core only |
| **Full Stack** | Everything included | All modules and agents |

Select during `init` or browse interactively with `bun scripts/browse.js`

## 🎨 Setup Methods

Choose the setup method that fits your experience level:

| Method | Best For | Time | Complexity |
|--------|----------|------|------------|
| **[Simple Creator](docs/SIMPLE-SETUP.md)** | Beginners, quick setup | 2 min | ⭐ Easy |
| **[Advanced Init](docs/GETTING-STARTED.md)** | Advanced users, full control | 5 min | ⭐⭐⭐ Advanced |

### Simple Standards Creator

```bash
bun ai-toolkit-shared/scripts/create-standards.js
# or
bun run create
cd ai-toolkit-shared && bun run create
```

**Perfect for:**
- Your first time with the toolkit
- You want to start quickly without technical details
- You don't know exactly which modules you need
- You want a guided experience

**What it does:**
- Asks simple questions in understandable language
- Automatically recommends based on project type
- Creates a working configuration immediately
- No technical knowledge required

### Advanced Init

```bash
bun ai-toolkit-shared/scripts/init.js
# or
bun run init
cd ai-toolkit-shared && bun run init
```

**Perfect for:**
- Advanced users who want full control
- You know exactly which modules and agents you need
- You want to choose between different configuration locations
- You want to configure the AAPF framework in detail

**What it does:**
- Auto-detection of project type and frameworks
- Full control over all options
- Choice between 4 setup modes (Auto, Preset, Simple, Custom)
- Detailed framework configuration

## 📖 Glossary

Key terms used throughout this documentation:

- **Toolkit**: The CouchCMS AI Toolkit software package
- **Configuration File**: The `standards.md` file containing project configuration
- **Generated Files**: Files automatically created by the sync script (`.cursorrules`, `.claude/`, etc.)
- **Module**: A knowledge module providing AI assistants with framework-specific patterns
- **Agent**: A specialized AI agent for specific development tasks
- **Sync**: The process of generating AI configuration files from `standards.md`
- **Setup Wizard**: The interactive `init.js` script that guides initial configuration
- **Legacy Format**: Old configuration format using multiple YAML files (pre-v2.0)
- **Current Format**: Single `standards.md` file with YAML frontmatter (v2.0+)

## 📚 Documentation

### 🚀 Start Here

| Guide | Description | Time |
|-------|-------------|------|
| **[Simple Setup](docs/SIMPLE-SETUP.md)** | Simple wizard for beginners | 2 min |
| **[Setup Comparison](docs/SETUP-COMPARISON.md)** | Compare Simple vs Advanced setup | 3 min |
| **[Quick Start](docs/QUICK-START.md)** | Installation in 5 minutes | 5 min |
| **[Getting Started](docs/GETTING-STARTED.md)** | Complete guide for everyone | 15 min |
| **[Quick Reference](docs/QUICK-REFERENCE.md)** | Quick reference | 2 min |

### Essential Guides

| Guide | When to Use |
|-------|-------------|
| **[New Features](docs/NEW-FEATURES.md)** | Learn about latest features |
| **[Getting Started](docs/GETTING-STARTED.md)** | First-time setup - start here |
| **[Updates](docs/UPDATES.md)** | Keep toolkit up to date |
| **[Git Workflow](docs/GIT-WORKFLOW.md)** | Collaborating with team - branching strategy |
| **[Commands Reference](docs/COMMANDS.md)** | Using `init`, `validate`, `sync` |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Something not working |

### Configuration

| Guide | Purpose |
|-------|---------|
| **[Config Files Guide](docs/CONFIG-FILES.md)** | Understanding `standards.md` configuration |
| **[Editor Support](docs/EDITOR-SUPPORT.md)** | Cursor, Claude Code, and other editor configs |
| **[Editor Quick Reference](docs/EDITOR-QUICK-REFERENCE.md)** | Quick reference for editor features |
| **[Project Rules](docs/PROJECT-RULES.md)** | Cursor Project Rules |
| **[User Rules](docs/USER-RULES.md)** | Cursor User Rules |
| **[Custom Commands](docs/CUSTOM-COMMANDS.md)** | Cursor Custom Commands |

### Reference

| Guide | Content |
|-------|---------|
| **[Modules](docs/MODULES.md)** | 15 knowledge modules |
| **[Agents](docs/AGENTS.md)** | 23 AI agents |

### Advanced

| Guide | For |
|-------|-----|
| **[Extending Modules](docs/EXTENDING-MODULES.md)** | Creating custom modules |
| **[Contributing](CONTRIBUTING.md)** | Contributing to toolkit |
| **[Changelog](CHANGELOG.md)** | Version history |

## 🎯 Commands

### Setup & Configuration

```bash


### Dependencies

The toolkit requires the following Node.js packages:

- **gray-matter** (^4.0.3) - Parses YAML frontmatter from standards.md configuration files
- **yaml** (^2.3.4) - Handles YAML serialization and deserialization
- **handlebars** (^4.7.8) - Template engine for generating AI configuration files
- **fast-check** (^3.15.0) (development) - Testing framework for generating random test cases

These are automatically installed when you run `bun install` in the toolkit directory.

# Simple setup wizard (recommended for beginners)
bun ai-toolkit-shared/scripts/create-standards.js
# or: cd ai-toolkit-shared && bun run create

# Advanced setup (first time) - with auto-detection!
bun ai-toolkit-shared/scripts/init.js
# or: cd ai-toolkit-shared && bun run init

# Health check - validate installation and check for updates
bun ai-toolkit-shared/scripts/health.js
# or: cd ai-toolkit-shared && bun run health

# Generate/update AI configs
bun ai-toolkit-shared/scripts/sync.js
# or: cd ai-toolkit-shared && bun run sync

# Watch mode - auto-sync on config changes
bun ai-toolkit-shared/scripts/sync.js --watch
# or: cd ai-toolkit-shared && bun run sync:watch

# Interactive module browser
bun ai-toolkit-shared/scripts/browse.js          # Browse modules
bun ai-toolkit-shared/scripts/browse.js --agents # Browse agents
# or: cd ai-toolkit-shared && bun run browse
# or: cd ai-toolkit-shared && bun run browse:agents

# Validate configuration
bun ai-toolkit-shared/scripts/validate.js
# or: cd ai-toolkit-shared && bun run validate

# Audit documentation for accuracy and consistency
bun ai-toolkit-shared/scripts/audit-docs.js
# or: cd ai-toolkit-shared && bun run audit:docs

# Migrate from old configuration format
bun ai-toolkit-shared/scripts/migrate.js
# or: cd ai-toolkit-shared && bun run migrate

# Extend modules from documentation
cd ai-toolkit-shared && bun run extend-modules --analyze
cd ai-toolkit-shared && bun run extend-modules --module comments
```

### Updates

```bash
# Check for updates (interactive - asks to update)
cd ai-toolkit-shared && bun run update

# Check only (no prompt)
cd ai-toolkit-shared && bun run update:check

# Apply updates automatically (no prompt)
cd ai-toolkit-shared && bun run update:apply

# Update submodule (alternative method)
cd ai-toolkit-shared && bun run update-submodule
```

```

### Updates

```bash
# Check for updates (interactive - asks to update)
cd ai-toolkit-shared && bun run update

# Check only (no prompt)
cd ai-toolkit-shared && bun run update:check

# Apply updates automatically (no prompt)
cd ai-toolkit-shared && bun run update:apply

# Update submodule (alternative method)
cd ai-toolkit-shared && bun run update-submodule
```

📖 **[See Update Guide](docs/UPDATES.md)** for detailed update instructions.

### Git Workflow (Team Collaboration)

```bash
# Feature workflow (daily work)
bun scripts/git-flow.js feature start my-feature    # Start new feature
bun scripts/git-flow.js feature finish my-feature   # Create PR
bun scripts/git-flow.js feature list                # List all features

# Release workflow (release managers)
bun scripts/git-flow.js release start 1.2.0         # Start release
bun scripts/git-flow.js release finish 1.2.0        # Deploy release

# Hotfix workflow (emergency fixes)
bun scripts/git-flow.js hotfix start critical-fix   # Start hotfix
bun scripts/git-flow.js hotfix finish critical-fix  # Deploy hotfix

# Utilities
bun scripts/git-flow.js check-stale                 # Find old branches
bun scripts/git-flow.js changelog                   # Generate changelog
```bash

### Contributing

```bash
# Prepare for contributing (switch to master, create branch)
cd ai-toolkit-shared && bun run prepare-contribution
cd ai-toolkit-shared && bun run prepare-contribution --branch feature/my-feature
```

## 🌿 Git Workflow

This toolkit uses **Gitflow** for team collaboration - a simple branching strategy that keeps production stable while enabling parallel development.

### Quick Setup

Initialize Gitflow in your repository:

```bash
# One-time setup
bun scripts/git-flow-init.js
# or: cd ai-toolkit-shared && bun run git-flow-init
```

This creates the `develop` branch and sets up the workflow structure.

📖 **Detailed setup:** [Setup Guide](docs/git-workflow/SETUP.md)

### Quick Overview

```text
main (production)    ──●────────●────────●──→  Stable, live code
                        ↑        ↑        ↑
develop (integration)──●──●──●──●──●──●──●──→  Features come together
                        ↑  ↑  ↑     ↑  ↑  ↑
feature branches     ──●  ●  ●     ●  ●  ●     Your work (isolated)
```

### Daily Workflow

```bash
# Start new feature
bun scripts/git-flow.js feature start my-feature
# or: cd ai-toolkit-shared && bun run git-flow feature start my-feature

# Work on it
git add .
git commit -m "Add functionality"

# Finish and create PR
bun scripts/git-flow.js feature finish my-feature
# or: cd ai-toolkit-shared && bun run git-flow feature finish my-feature
```

### Quick Release (Solo Developer)

```bash
# One command to release!
cd ai-toolkit-shared && bun run release 1.0.0

# Or with npm
cd ai-toolkit-shared && npm run release 1.0.0
```

This automatically:
- Updates version in package.json
- Updates CHANGELOG.md
- Commits changes
- Merges to main
- Creates and pushes tag
- Merges back to develop

**Done in seconds!** 🚀

### Branch Types

| Branch | Purpose | Merges From | Merges To | Who Uses |
|--------|---------|-------------|-----------|----------|
| **main** | Production code (always stable) | release/, hotfix/ | - | Release managers |
| **develop** | Integration branch | feature/, release/, hotfix/ | release/ | All developers |
| **feature/** | Daily development work (isolated) | develop | develop | Individual developers |
| **release/** | Preparing new versions | develop | main, develop | Release managers |
| **hotfix/** | Emergency production fixes | main | main, develop | Release managers |

### For Team Members

**New to the project?**
- 📖 [Getting Started Guide](docs/git-workflow/getting-started.md) - Setup in 10 minutes
- 🎓 [Feature Workflow](docs/git-workflow/feature-workflow.md) - Daily development
- ❓ [Troubleshooting](docs/git-workflow/troubleshooting.md) - Common issues

**For release managers:**
- 📦 [Release Workflow](docs/git-workflow/release-workflow.md) - Creating releases
- 🚨 [Hotfix Workflow](docs/git-workflow/hotfix-workflow.md) - Emergency fixes

**Complete guide:**
- 📚 [Git Workflow Documentation](docs/GIT-WORKFLOW.md) - Everything you need

### Why This Works

- ✅ **Simple** - Only 3 commands for daily work
- ✅ **Safe** - Protected branches prevent accidents
- ✅ **Parallel** - Everyone works without conflicts
- ✅ **Reviewed** - All code goes through PR review
- ✅ **Tested** - Automated checks before merge

## 📦 What's Included

- **15 Knowledge Modules** - CouchCMS, TailwindCSS, Alpine.js, TypeScript, daisyUI, and more
- **23 AI Agents** - Specialized guidance for development tasks
- **Auto-Loading Rules** - Context-aware refactoring patterns

📖 See [Modules](docs/MODULES.md) and [Agents](docs/AGENTS.md) for complete list.

## 🔄 Typical Workflow

```bash
# 1. Setup (once)
bun ai-toolkit-shared/scripts/init.js

# 2. Customize configuration
code standards.md

# 3. Sync after changes
bun ai-toolkit-shared/scripts/sync.js

# 4. Validate setup
bun ai-toolkit-shared/scripts/validate.js
```

📖 See [Commands Reference](docs/COMMANDS.md) for all commands.

## 📝 Configuration

Your configuration lives in **`standards.md`** (root directory):

```yaml
---
name: my-project
toolkit: ./ai-toolkit-shared
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
agents:
  - couchcms
  - tailwindcss
---

# Project-Specific Rules
Your custom rules here...
```

**After editing, run:**
```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

📖 See [Config Files Guide](docs/CONFIG-FILES.md) for details.

## 🆕 What's New (Current Version: 1.0.14)

### Smart Setup & Detection
- ✅ **Auto-Detection** - Automatically detects project type, frameworks, and languages from your codebase
- ✅ **Project Presets** - 8 predefined configurations for common project types
- ✅ **4 Setup Modes** - Auto, Preset, Simple, and Custom modes for every use case

### Enhanced Developer Experience
- ✅ **Watch Mode** - Auto-sync configs when standards.md changes (`--watch` flag)
- ✅ **Health Check** - Validate installation, check for updates, and diagnose issues
- ✅ **Update Notifier** - Get notified when toolkit updates are available
- ✅ **Interactive Browser** - Browse and select modules/agents with keyboard navigation

### Configuration & Performance
- ✅ **Simplified Configuration** - Single `standards.md` file with YAML frontmatter
- ✅ **Modular Architecture** - Refactored scripts into reusable library modules
- ✅ **50% Faster Sync** - Performance optimizations with caching and selective file writing
- ✅ **Streamlined Editor Support** - Focus on actively used editors (Cursor, Claude, Windsurf, Kiro, Copilot)

See [CHANGELOG.md](CHANGELOG.md) for complete version history and [Migration Guide](docs/MIGRATION.md) for upgrade instructions from legacy formats.

## 🤝 Contributing

Contribute directly from your project:

```bash
cd ai-toolkit-shared
bun run prepare-contribution --branch feature/your-feature
# Make changes, test, commit, push, create PR
```

📖 See [CONTRIBUTING.md](CONTRIBUTING.md) for complete guide.

## 📊 Project Structure

```text
ai-toolkit-shared/
├── modules/              # Knowledge modules
├── agents/               # AI agents
├── docs/                 # Documentation (NEW!)
├── rules/                # Auto-loading Cursor rules
├── scripts/              # Automation (init, validate, sync)
├── templates/            # Project templates
└── README.md             # This file
```

## 🆘 Need Help?

1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. ⚙️ Validate setup: `bun ai-toolkit-shared/scripts/validate.js`
3. 📝 Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

## 📄 License

MIT

## 🙏 Acknowledgments

This toolkit is inspired by and builds upon excellent work from the community:

- **[diet103/claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase)** - Inspiration for skill auto-activation patterns, modular skill structure, and hooks-based automation. Their 6 months of production experience with Claude Code provided valuable insights into scalable AI development infrastructure.

- **[aashari/AAPF Framework](https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e)** - The Autonomous Agent Prompting Framework that forms the foundation of our operational doctrine. See [framework/ATTRIBUTION.md](framework/ATTRIBUTION.md) for details.

---

**Ready to start?** → [Getting Started Guide](docs/GETTING-STARTED.md)
