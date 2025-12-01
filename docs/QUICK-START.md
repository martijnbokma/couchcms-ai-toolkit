# Quick Start Guide - CouchCMS AI Toolkit

**Navigation:** [← Documentation Index](README.md) | [← Main README](../README.md) | [Getting Started](GETTING-STARTED.md) | [Troubleshooting](TROUBLESHOOTING.md)

**Goal:** Get a fully working AI toolkit for your CouchCMS project in 5 minutes.

## 📋 What You Need

- ✅ Git installed
- ✅ Bun or Node.js (v18+)
- ✅ A CouchCMS project (or new project)

## 🚀 Installation (1 Command!)


:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (gray-matter, yaml, handlebars) that need to be installed first.
:::

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```text

This installs the required packages:
- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing
- `handlebars` - Template generation


### Option 1: Automatic Installation (Recommended)

Open your terminal in your project directory and run:

```bash
# One-command installation (public repositories only)
# This automatically adds the submodule and installs dependencies
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash

# What this script does:
# 1. Adds toolkit as git submodule
# 2. Installs toolkit dependencies (bun install)
# 3. Starts the setup wizard
# 4. Generates initial AI configurations

# Note: Only works for public repositories
# For private repos, use the manual 3-step installation
```

**That's it!** The installer automatically:
1. ✅ Adds toolkit as git submodule
2. ✅ Installs all dependencies
3. ✅ Starts the setup wizard
4. ✅ Generates all AI configs

### Option 2: With Bun

```bash
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/scripts/install.js -o install.js
bun install.js
rm install.js
```text

### Option 3: Manual Installation

If you prefer step-by-step:

```bash
# Step 1: Add toolkit
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# Step 2: Install dependencies
cd ai-toolkit-shared
bun install  # or: npm install
cd ..

# Step 3: Run setup
bun ai-toolkit-shared/scripts/init.js
```

## 🎯 Setup Wizard

After installation, you have two setup options:

### Option A: Simple Setup (New! For Beginners) ✨

**Perfect if you:**
- Are using the toolkit for the first time
- Want to start quickly without technical details
- Are not sure exactly which modules you need

```bash
bun ai-toolkit-shared/scripts/create-standards.js
# or
bun run create
```

**What happens:**
- Answer simple questions in understandable language
- Choose your project type (blog, webapp, portfolio, etc.)
- Select technologies via simple questions
- Automatic recommendations based on your choices
- Ready in 2 minutes!

**See:** [Simple Setup Guide](SIMPLE-SETUP.md) for details

### Option B: Advanced Setup (For Advanced Users) 🔧

After installation, the advanced setup wizard starts automatically. You get 4 options:

### 1. Auto Mode (Recommended) ⚡

```text
🎯 Setup mode:
  1. Auto (recommended) - Use detected settings  ← Choose this!
  2. 📝 Preset - Choose from common project types
  3. ⚙️ Simple - Quick setup with defaults
  4. 📝 Custom - Full control over all options
Choice [1-4]: 1
```

**What happens:**
- 🔍 Automatically detects your project type
- 🔍 Recognizes frameworks (TailwindCSS, Alpine.js, etc.)
- 🔍 Reads project info from git/package.json
- ✅ Recommends appropriate modules
- ✅ Generates all configs

**Questions:** 0-2 (just confirmation)
**Time:** ~30 seconds

### 2. Preset Mode 📋

Choose from 8 predefined project types:

```text
📋 Available presets:
  1. Landing Page - Simple landing page
  2. 🔍 Blog - Blog with comments & search
  3. 📝 E-commerce - Online store
  4. 📝 Web Application - Full-featured webapp
  5. 📝 Portfolio - Portfolio showcase
  6. 📝 Documentation - Documentation site
  7. 📝 Minimal - Bare minimum
  8. 📝 Full Stack - Everything included
```text

**Questions:** 1-2
**Time:** ~45 seconds

### 3. Simple Mode 🎯

Quick setup with standard defaults.

**Questions:** 2-3
**Time:** ~1 minute

### 4. Custom Mode ⚙️

Full control over all options.

**Questions:** 5-10
**Time:** 2-3 minutes

## ✅ What Happens After Setup?

The toolkit automatically generates:

```text
your-project/
├── .cursorrules              ← Cursor IDE config
├── .cursor/
│   └── rules/                ← Context-aware MDC rules (auto-activate)
│       ├── refactor-alpinejs.mdc
│       ├── refactor-forms.mdc
│       └── ...
├── .claude/                  ← Claude Code config
│   ├── settings.json         ← Permissions & environment
│   └── skills/               ← Modular knowledge (auto-activate)
│       ├── couchcms-core.md
│       ├── tailwindcss.md
│       └── ...
├── .github/
│   └── copilot-instructions.md  ← GitHub Copilot config
├── .windsurf/
│   └── rules.md              ← Windsurf config
├── .kiro/
│   └── steering/             ← Kiro config
├── CLAUDE.md                 ← Memory file (loaded at startup)
├── AGENTS.md                 ← Agent documentation
├── standards.md              ← Your configuration (single source of truth)
└── ai-toolkit-shared/        ← The toolkit (submodule)
```

## 🎉 Done! What's Next?

### Test if it works

Open your AI assistant (Cursor, Claude, etc.) and ask:

```text
"Create a CouchCMS template for a blog post"
```text

Your AI now knows:
- ✅ All CouchCMS tags and patterns
- ✅ Your frameworks (TailwindCSS, Alpine.js, etc.)
- ✅ Best practices and anti-patterns
- ✅ Project-specific rules

### Common Commands

**Note:** Always use `bun` or `node` to run scripts:

```bash
# Check if everything is OK
bun ai-toolkit-shared/scripts/health.js

# Modify config
vim .project/standards.md

# Regenerate configs
bun ai-toolkit-shared/scripts/sync.js

# Auto-sync on changes (useful during development)
bun ai-toolkit-shared/scripts/sync.js --watch

# Browse available modules
bun ai-toolkit-shared/scripts/browse.js
```

**Tip:** If you get "permission denied", use `bun` or `node` instead of running the script directly.

## 📚 Next Steps

### Customize Configuration

Your configuration is in **`.project/standards.md`**:

```yaml
---
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
  - databound-forms  # ← Add modules here
agents:
  - couchcms
  - tailwindcss
  - databound-forms  # ← Add agents here
---

# Your project rules here
```bash

After changes:
```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

### Add Modules

**Option 1: Interactive (Easy)**
```bash
bun ai-toolkit-shared/scripts/browse.js
```text

**Option 2: Manual**

Edit `.project/standards.md`:
```yaml
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
  - databound-forms  # ← Add
  - users            # ← Add
```

Then sync:
```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```text

### Use Watch Mode

During development:
```bash
# Generate AI configuration files
bun ai-toolkit-shared/scripts/sync.js --watch
```

Now you should modify `.project/standards.md` and configs are automatically updated!

## 🆘 Problems?

### "Git is not installed"

Install Git:
- **macOS:** `brew install git`
- **Windows:** https://git-scm.com/download/win
- **Linux:** `sudo apt install git`

### "Not in a git repository"

Initialize git in your project:
```bash
git init
```bash

### "Bun/Node not found"

Install Bun (recommended):
```bash
# Install Bun (recommended JavaScript runtime)
# This is faster than Node.js and works great with the toolkit
curl -fsSL https://bun.sh/install | bash

# After installation, restart your terminal or run:
# source ~/.bashrc  # or ~/.zshrc depending on your shell

# Verify installation:
# bun --version
```

Or Node.js: https://nodejs.org/

### Configs not generated

Run health check:
```bash
# Check toolkit status and updates
bun ai-toolkit-shared/scripts/health.js
```text

This shows what's wrong and how to fix it.

### Update toolkit

```bash
cd ai-toolkit-shared
git pull
cd ..
# Generate AI configuration files
bun ai-toolkit-shared/scripts/sync.js
```

## 💡 Tips & Tricks

### Tip 1: Use Auto Mode

For 95% of projects, Auto mode is perfect. It detects everything automatically.

### Tip 2: Start with Watch Mode

During setup/development:
```bash
# Generate AI configuration files
bun ai-toolkit-shared/scripts/sync.js --watch
```bash

### Tip 3: Run Health Check Regularly

```bash
# Check toolkit status and updates
bun ai-toolkit-shared/scripts/health.js
```

Shows:
- ✅ If everything is OK
- ⚠️ What needs attention
- 💡 Available updates

### Tip 4: Browse Modules Interactively

Instead of manual editing:
```bash
bun ai-toolkit-shared/scripts/browse.js
```

Use ↑↓ to navigate, Space to select.

### Tip 5: Use Presets as Starting Point

Choose a preset similar to your project, then customize.

## 📖 More Documentation

- **[How It Works](GETTING-STARTED.md)** - Complete explanation
- **[Cheat Sheet](QUICK-REFERENCE.md)** - Quick reference
- **[New Features](NEW-FEATURES.md)** - v2.1.0 features
- **[Commands Reference](../README.md#-commands)** - All commands
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common problems
- **[Modules](MODULES.md)** - Available modules
- **[Agents](AGENTS.md)** - Available agents

## 🎊 Success!

You now have a fully working AI toolkit! Your AI assistant knows:
- ✅ CouchCMS inside-out
- ✅ Your frameworks and tools
- ✅ Best practices
- ✅ Project-specific rules

**Happy coding!** 🚀
