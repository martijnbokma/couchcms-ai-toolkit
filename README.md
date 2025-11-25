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

## 🚀 Quick Start

### New Project

```bash
# 1. Create project
mkdir my-project && cd my-project

# 2. Add toolkit
git init
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 3. Install & setup
cd ai-toolkit-shared && bun install && cd ..
bun ai-toolkit-shared/scripts/init.js

# Done! ✨
```

### Existing Project

```bash
# 1. Add toolkit
cd your-project
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 2. Install & setup
cd ai-toolkit-shared && bun install && cd ..
bun ai-toolkit-shared/scripts/init.js
```

**Result:** You'll have `project.md`, `.cursorrules`, `CLAUDE.md`, and `AGENT.md` generated automatically.

## 📚 Documentation

| Guide                                          | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **[Getting Started](docs/GETTING-STARTED.md)** | Complete setup guide for new & existing projects |
| **[Command Reference](docs/COMMANDS.md)**      | Detailed `init`, `validate`, `sync` commands     |
| **[Available Modules](docs/MODULES.md)**       | 6 knowledge modules with descriptions            |
| **[Available Agents](docs/AGENTS.md)**         | 9 specialized AI agents                          |
| **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Common issues and solutions                      |
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

## 📝 Example project.md

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
---
# Project-Specific Rules

Add your custom rules here...
```

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

- **Git** - Version control
- **Bun or Node.js** - JavaScript runtime
- **CouchCMS Project** - Target project

## 🆘 Need Help?

1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Validate your setup: `bun ai-toolkit-shared/scripts/validate.js`
3. Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

## 📄 License

MIT

---

**Ready to start?** → [Getting Started Guide](docs/GETTING-STARTED.md)
