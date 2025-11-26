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

Before using this toolkit, ensure you have:

- **Git** - For version control and submodule management
- **Bun** (recommended) or **Node.js** (v18+) - JavaScript runtime
  - Install Bun: `curl -fsSL https://bun.sh/install | bash`
  - Or use Node.js: `npm install` works too

**Important:** After adding the toolkit as a submodule, you **must** install its dependencies before running any scripts.

## 🚀 Quick Start (30 seconds)

The setup wizard has two modes:

### Simple Mode (Recommended for Beginners)

Just answer 2 questions - everything else uses smart defaults:

```bash
# 1. Create project
mkdir my-project && cd my-project

# 2. Add toolkit
git init
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 3. Install toolkit dependencies (REQUIRED!)
cd ai-toolkit-shared
bun install  # or: npm install
cd ..

# 4. Run setup wizard (choose "Simple" mode)
bun ai-toolkit-shared/scripts/init.js

# The wizard will ask:
# - Project name
# - Project description
# - Setup mode: Choose "1" for Simple (recommended)

# Done! ✨
```

**Simple mode gives you:**
- ✅ `.project/standards.md` - Your configuration file
- ✅ Standard modules (core + tailwindcss + alpinejs)
- ✅ Standard agents (couchcms + tailwindcss + alpinejs)
- ✅ `.cursorrules`, `CLAUDE.md`, `AGENT.md` - Auto-generated

### Custom Mode (Full Control)

For advanced users who want to customize everything:

```bash
# Same steps as above, but choose "Custom" mode in the wizard
bun ai-toolkit-shared/scripts/init.js

# Choose "2" for Custom mode, then:
# - Select config file location
# - Choose modules (presets: Minimal/Standard/Full/Custom)
# - Choose agents (presets: Minimal/Standard/Full/Custom)
# - Optional context directory
```

### Existing Project

```bash
# 1. Add toolkit
cd your-project
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install toolkit dependencies (REQUIRED!)
cd ai-toolkit-shared
bun install  # or: npm install
cd ..

# 3. Run setup wizard
bun ai-toolkit-shared/scripts/init.js
```

**Result:** You'll have `.project/standards.md`, `.cursorrules`, `CLAUDE.md`, and `AGENT.md` generated automatically.

## 📚 Documentation

### Core Guides

- **[Getting Started](docs/GETTING-STARTED.md)** - Complete setup guide
- **[Commands Reference](docs/COMMANDS.md)** - All toolkit commands
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Rules & Configuration

- **[Project Rules](docs/PROJECT-RULES.md)** - Guide to Cursor Project Rules
- **[User Rules](docs/USER-RULES.md)** - Guide to Cursor User Rules
- **[Custom Commands](docs/CUSTOM-COMMANDS.md)** - Guide to Cursor Custom Commands
- **[Configuration Guide](docs/CONFIG-FILES-GUIDE.md)** - Project configuration explained

### Modules & Agents

- **[Modules](docs/MODULES.md)** - Available knowledge modules
- **[Agents](docs/AGENTS.md)** - Available AI agents

### Start Here

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Getting Started](docs/GETTING-STARTED.md)** | Complete setup guide - start here!              |
| **[Config Files Guide](docs/CONFIG-FILES-GUIDE.md)** | Understanding standards.md, project.md, and context.md |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Common issues and solutions                      |

### Learn More

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Command Reference](docs/COMMANDS.md)**      | Detailed `init`, `validate`, `sync` commands     |
| **[Available Modules](docs/MODULES.md)**       | 15 knowledge modules with descriptions           |
| **[Available Agents](docs/AGENTS.md)**         | 23 specialized AI agents                         |
| **[Project Rules](docs/PROJECT-RULES.md)**     | Guide to Cursor Project Rules                    |
| **[User Rules](docs/USER-RULES.md)**           | Guide to Cursor User Rules                       |
| **[Custom Commands](docs/CUSTOM-COMMANDS.md)** | Guide to Cursor Custom Commands                  |

### Advanced

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Extending Modules](docs/EXTENDING-MODULES.md)** | How to extend modules from documentation      |
| **[Contributing](CONTRIBUTING.md)**            | How to contribute from your project              |
| **[Changelog](CHANGELOG.md)**                  | Version history and upgrade notes                |

## 🎯 Commands

```bash
# Interactive setup (first time)
bun ai-toolkit-shared/scripts/init.js

# Validate configuration
bun ai-toolkit-shared/scripts/validate.js

# Generate/update AI configs
bun ai-toolkit-shared/scripts/sync.js

# Update submodule (keep toolkit up-to-date)
cd ai-toolkit-shared && bun run update-submodule

# Prepare for contributing (switch to master, create branch)
cd ai-toolkit-shared && bun run prepare-contribution
cd ai-toolkit-shared && bun run prepare-contribution --branch feature/my-feature

# Extend modules from documentation (NEW!)
bun ai-toolkit-shared/scripts/extend-modules.js --analyze
bun ai-toolkit-shared/scripts/extend-modules.js --module comments
```

## 📦 What's Included

### Modules

- `couchcms-core` - Core patterns (always included)
- `tailwindcss` - TailwindCSS 4 patterns
- `daisyui` - daisyUI 5 components
- `alpinejs` - Alpine.js + CouchCMS integration
- `typescript` - TypeScript standards
- `databound-forms` - Forms & CRUD

### Agents

- `couchcms` - Core CouchCMS development
- `databound-forms` - Forms and validation
- `alpinejs` - Alpine.js development
- `tailwindcss` - Styling with TailwindCSS + daisyUI
- `typescript` - TypeScript development
- `custom-routes` - Clean URLs
- `mysql` - Database operations
- `bun` - Build tooling
- `git` - Version control

## 🔄 Workflow

```bash
# 1. Setup (once)
bun ai-toolkit-shared/scripts/init.js

# 2. Customize
code project.md  # Edit your configuration

# 3. Sync
bun ai-toolkit-shared/scripts/sync.js

# 4. Validate
bun ai-toolkit-shared/scripts/validate.js

# 5. Keep toolkit up-to-date (when needed)
cd ai-toolkit-shared && bun run update-submodule && cd ..
git add ai-toolkit-shared
git commit -m "Update couchcms-ai-toolkit submodule"
```

## 📝 Configuration File

After running the setup wizard, you'll have `.project/standards.md`:

```yaml
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

# Markdown Body - Project Rules

## Project-Specific Rules

Add your custom rules here...

## Architecture

Describe your project architecture...

## Code Patterns

Document common patterns...
```

**Key Points:**
- **One file for everything**: Configuration (YAML) + Rules (Markdown) in `standards.md`
- **Location**: `.project/standards.md` (recommended) or `standards.md` (root)
- **Optional context.md**: Only needed for >1000 lines of documentation (rare)

## 🆕 What's New in v1.1.0

- ✅ Interactive setup wizard
- ✅ Project validation with compliance score
- ✅ Enhanced error messages
- ✅ Complete documentation overhaul
- ✅ Contributing guide

See [CHANGELOG.md](CHANGELOG.md) for details.

## 🤝 Contributing

**You can contribute directly from your project!** No need to clone the toolkit separately.

### Quick Start for Contributors

**Option 1: Using the helper script (recommended)**

```bash
# 1. Navigate to the submodule
cd ai-toolkit-shared

# 2. Prepare your contribution environment
bun run prepare-contribution

# 3. Create a feature branch (or use --branch flag)
bun run prepare-contribution --branch feature/your-feature-name

# 4. Make your changes
code modules/your-module.md  # or agents/, docs/, etc.

# 5. Test your changes
cd ..  # Back to project root
bun ai-toolkit-shared/scripts/sync.js
bun ai-toolkit-shared/scripts/validate.js

# 6. Commit and push
cd ai-toolkit-shared
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name

# 7. Create Pull Request on GitHub
```

**Option 2: Manual workflow**

```bash
# 1. Navigate to the submodule
cd ai-toolkit-shared

# 2. Switch to master branch (submodules are often in detached HEAD)
git checkout master
git pull origin master

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes
code modules/your-module.md  # or agents/, docs/, etc.

# 5. Test your changes
cd ..  # Back to project root
bun ai-toolkit-shared/scripts/sync.js
bun ai-toolkit-shared/scripts/validate.js

# 6. Commit and push
cd ai-toolkit-shared
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name

# 7. Create Pull Request on GitHub
```

### What Can You Contribute?

- ✅ **New Modules** - Add support for frameworks (Vue.js, React, etc.)
- ✅ **Improve Modules** - Fix typos, add examples, clarify instructions
- ✅ **New Agents** - Create specialized AI agents
- ✅ **Documentation** - Improve README, troubleshooting, examples
- ✅ **Prompts** - Add reusable AI prompts for common tasks
- ✅ **Bug Fixes** - Fix issues you encounter

### Full Guide

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for:
- 📋 Complete step-by-step workflow
- 🎨 Module and agent templates
- 🚫 Common mistakes to avoid
- 🆘 Troubleshooting guide
- 💡 Tips for successful contributions

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

## ⚡ Requirements

- **Git** - Version control (for submodule management)
- **Bun** (recommended) or **Node.js** (v18+) - JavaScript runtime
  - Bun: `curl -fsSL https://bun.sh/install | bash`
  - Node.js: Download from [nodejs.org](https://nodejs.org/)
- **CouchCMS Project** - Target project

**Note:** After cloning the submodule, always run `bun install` (or `npm install`) in the `ai-toolkit-shared` directory before using any scripts.

## 🔄 Keeping the Toolkit Up-to-Date

When using the toolkit as a git submodule, keep it updated to get the latest features and fixes:

```bash
# Option 1: Using the update script (recommended)
cd ai-toolkit-shared
bun run update-submodule
cd ..

# Option 2: Using git submodule command (from parent repo)
git submodule update --remote ai-toolkit-shared

# After updating, commit the change in your parent repository
git add ai-toolkit-shared
git commit -m "Update couchcms-ai-toolkit submodule"
```

The `update-submodule` script will:
- ✅ Fetch the latest changes from the remote repository
- ✅ Pull updates for your current branch
- ✅ Show you the latest commit information
- ✅ Provide helpful tips for committing the update

## 🆘 Need Help?

1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Validate your setup: `bun ai-toolkit-shared/scripts/validate.js`
3. Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

## 📄 License

MIT

---

**Ready to start?** → [Getting Started Guide](docs/GETTING-STARTED.md)
