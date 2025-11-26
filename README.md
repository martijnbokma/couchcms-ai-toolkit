# CouchCMS AI Toolkit

Universal AI Development Toolkit for CouchCMS Projects.

Provides consistent AI assistance across all your projects with modules, agents, and automated configuration generation.

## ✨ Features

- 🎯 **Interactive Setup Wizard** - Get started in 2 minutes
- ✅ **Project Validation** - Compliance checking (0-100% score)
- 🔄 **Auto-Generated Configs** - Cursor, Claude, Copilot ready
- 📦 **6 Knowledge Modules** - CouchCMS, TailwindCSS, Alpine.js, TypeScript, daisyUI, DataBound Forms
- 🤖 **9 AI Agents** - Specialized guidance for daily development
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

**Result:** You'll have `.project/standards.md` (or `project.md` in legacy mode), `.cursorrules`, `CLAUDE.md`, and `AGENT.md` generated automatically.

## 📚 Documentation

### Start Here

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Getting Started](docs/GETTING-STARTED.md)** | Complete setup guide - start here!              |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Common issues and solutions                      |

### Learn More

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Command Reference](docs/COMMANDS.md)**      | Detailed `init`, `validate`, `sync` commands     |
| **[Available Modules](docs/MODULES.md)**       | 6 knowledge modules with descriptions            |
| **[Available Agents](docs/AGENTS.md)**         | 9 specialized AI agents                          |

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
```

## 📝 Example Configuration

After running the setup wizard, you'll have `.project/standards.md`:

```yaml
---
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
# Project-Specific Rules

Add your custom rules here...
```

**Note:** In Simple mode, this file is automatically created at `.project/standards.md`. You can edit it anytime and run `bun ai-toolkit-shared/scripts/sync.js` to update AI configurations.

## 🆕 What's New in v1.1.0

- ✅ Interactive setup wizard
- ✅ Project validation with compliance score
- ✅ Enhanced error messages
- ✅ Complete documentation overhaul
- ✅ Contributing guide

See [CHANGELOG.md](CHANGELOG.md) for details.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Step-by-step workflow for contributing via submodule
- How to add new modules or agents
- Common mistakes to avoid
- PR guidelines

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

## 🆘 Need Help?

1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Validate your setup: `bun ai-toolkit-shared/scripts/validate.js`
3. Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

## 📄 License

MIT

---

**Ready to start?** → [Getting Started Guide](docs/GETTING-STARTED.md)
