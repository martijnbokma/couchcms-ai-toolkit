# CouchCMS AI Toolkit

Universal AI Development Toolkit for CouchCMS Projects.

Provides consistent AI assistance across all your projects with modules, agents, and automated configuration generation.

## ✨ Features

- 🎯 **Interactive Setup Wizard** - Get started in 2 minutes
- ✅ **Project Validation** - Compliance checking (0-100% score)
- 🔄 **Auto-Generated Configs** - Cursor, Claude, Copilot ready
- 📦 **15 Knowledge Modules** - CouchCMS, TailwindCSS, Alpine.js, TypeScript, daisyUI, DataBound Forms, Search, Pagination, Users, Comments, and more
- 🤖 **23 AI Agents** - Specialized guidance for daily development
- 📋 **Auto-Loading Rules** - Context-aware refactoring patterns
- 🔧 **Zero Config** - Works out of the box

## ⚡ Prerequisites

- **Git** - For submodule management
- **Bun** (recommended) or **Node.js** (v18+) - JavaScript runtime
  - Install Bun: `curl -fsSL https://bun.sh/install | bash`

:::caution[Important]
After adding the submodule, **always** run `bun install` in `ai-toolkit-shared/` before using any scripts.
:::

## 🚀 Quick Start

Get started in 3 steps:

```bash
# 1. Add toolkit as submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install dependencies (REQUIRED!)
cd ai-toolkit-shared && bun install && cd ..

# 3. Run setup wizard
bun ai-toolkit-shared/scripts/init.js
```

**Choose "Simple" mode** (recommended) - answers 2 questions, uses smart defaults.

**Result:** `.project/standards.md`, `.cursorrules`, `CLAUDE.md`, and `AGENT.md` are generated automatically.

📖 **For detailed setup instructions**, see [Getting Started Guide](docs/GETTING-STARTED.md).

## 📚 Documentation

### Essential Guides

| Guide | When to Use |
|-------|-------------|
| **[Getting Started](docs/GETTING-STARTED.md)** | First-time setup - start here |
| **[Git Workflow](docs/GIT-WORKFLOW.md)** | Collaborating with team - branching strategy |
| **[Commands Reference](docs/COMMANDS.md)** | Using `init`, `validate`, `sync` |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Something not working |

### Configuration

| Guide | Purpose |
|-------|---------|
| **[Config Files Guide](docs/CONFIG-FILES.md)** | Understanding `standards.md` |
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
# Interactive setup (first time)
bun ai-toolkit-shared/scripts/init.js

# Validate configuration
bun ai-toolkit-shared/scripts/validate.js

# Generate/update AI configs
bun ai-toolkit-shared/scripts/sync.js

# Update submodule (keep toolkit up-to-date)
cd ai-toolkit-shared && bun run update-submodule

# Extend modules from documentation
bun ai-toolkit-shared/scripts/extend-modules.js --analyze
bun ai-toolkit-shared/scripts/extend-modules.js --module comments
```

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
```

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
```

This creates the `develop` branch and sets up the workflow structure.

📖 **Detailed setup:** [Setup Guide](docs/git-workflow/SETUP.md)

### Quick Overview

```
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

# Work on it
git add .
git commit -m "Add functionality"

# Finish and create PR
bun scripts/git-flow.js feature finish my-feature
```

### Branch Types

- **main** - Production code (always stable)
- **develop** - Integration branch (features merge here)
- **feature/** - Your daily work (isolated from others)
- **release/** - Preparing new versions
- **hotfix/** - Emergency production fixes

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
code .project/standards.md

# 3. Sync after changes
bun ai-toolkit-shared/scripts/sync.js

# 4. Validate setup
bun ai-toolkit-shared/scripts/validate.js
```

📖 See [Commands Reference](docs/COMMANDS.md) for all commands.

## 📝 Configuration

Your configuration lives in `.project/standards.md`:

- **YAML frontmatter**: Modules, agents, paths
- **Markdown body**: Project rules and documentation

**One file for everything** - that's all you need for 95% of projects.

📖 See [Config Files Guide](docs/CONFIG-FILES.md) for details.

## 🆕 What's New in v1.1.0

- ✅ Interactive setup wizard
- ✅ Project validation with compliance score
- ✅ Enhanced error messages
- ✅ Complete documentation overhaul
- ✅ Contributing guide

See [CHANGELOG.md](CHANGELOG.md) for details.

## 🤝 Contributing

Contribute directly from your project:

```bash
cd ai-toolkit-shared
bun run prepare-contribution --branch feature/your-feature
# Make changes, test, commit, push, create PR
```

📖 See [CONTRIBUTING.md](CONTRIBUTING.md) for complete guide.

## 📊 Project Structure

```
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
2. Validate setup: `bun ai-toolkit-shared/scripts/validate.js`
3. Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

## 📄 License

MIT

## 🙏 Acknowledgments

This toolkit is inspired by and builds upon excellent work from the community:

- **[diet103/claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase)** - Inspiration for skill auto-activation patterns, modular skill structure, and hooks-based automation. Their 6 months of production experience with Claude Code provided valuable insights into scalable AI development infrastructure.

- **[aashari/AAPF Framework](https://gist.github.com/aashari/07cc9c1b6c0debbeb4f4d94a3a81339e)** - The Autonomous Agent Prompting Framework that forms the foundation of our operational doctrine. See [framework/ATTRIBUTION.md](framework/ATTRIBUTION.md) for details.

---

**Ready to start?** → [Getting Started Guide](docs/GETTING-STARTED.md)
