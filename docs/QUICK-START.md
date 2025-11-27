# Quick Start Guide - CouchCMS AI Toolkit

**Goal:** Get a fully working AI toolkit for your CouchCMS project in 5 minutes.

## 📋 What You Need

- ✅ Git installed
- ✅ Bun or Node.js (v18+)
- ✅ A CouchCMS project (or new project)

## 🚀 Installation (1 Command!)

### Option 1: Automatic Installation (Recommended)

Open your terminal in your project directory and run:

```bash
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
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
```

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

After installation, the setup wizard starts automatically. You get 4 options:

### 1. Auto Mode (Recommended) ⚡

```
🎯 Setup mode:
  1. Auto (recommended) - Use detected settings  ← Choose this!
  2. Preset - Choose from common project types
  3. Simple - Quick setup with defaults
  4. Custom - Full control over all options
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

```
📋 Available presets:
  1. Landing Page - Simple landing page
  2. Blog - Blog with comments & search
  3. E-commerce - Online store
  4. Web Application - Full-featured webapp
  5. Portfolio - Portfolio showcase
  6. Documentation - Documentation site
  7. Minimal - Bare minimum
  8. Full Stack - Everything included
```

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

```
your-project/
├── .cursorrules              ← Cursor IDE config
├── .claude/                  ← Claude Code config
│   ├── settings.json
│   └── skills/
├── .github/
│   └── copilot-instructions.md  ← GitHub Copilot config
├── .windsurf/
│   └── rules.md              ← Windsurf config
├── .kiro/
│   └── steering/             ← Kiro config
├── .project/
│   └── standards.md          ← Your configuration
└── ai-toolkit-shared/        ← The toolkit (submodule)
```

## 🎉 Done! What's Next?

### Test if it works

Open your AI assistant (Cursor, Claude, etc.) and ask:

```
"Create a CouchCMS template for a blog post"
```

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
```

After changes:
```bash
bun ai-toolkit-shared/scripts/sync.js
```

### Add Modules

**Option 1: Interactive (Easy)**
```bash
bun ai-toolkit-shared/scripts/browse.js
```

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
bun ai-toolkit-shared/scripts/sync.js
```

### Use Watch Mode

During development:
```bash
bun ai-toolkit-shared/scripts/sync.js --watch
```

Now you can modify `.project/standards.md` and configs are automatically updated!

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
```

### "Bun/Node not found"

Install Bun (recommended):
```bash
curl -fsSL https://bun.sh/install | bash
```

Or Node.js: https://nodejs.org/

### Configs not generated

Run health check:
```bash
bun ai-toolkit-shared/scripts/health.js
```

This shows what's wrong and how to fix it.

### Update toolkit

```bash
cd ai-toolkit-shared
git pull
cd ..
bun ai-toolkit-shared/scripts/sync.js
```

## 💡 Tips & Tricks

### Tip 1: Use Auto Mode

For 95% of projects, Auto mode is perfect. It detects everything automatically.

### Tip 2: Start with Watch Mode

During setup/development:
```bash
bun ai-toolkit-shared/scripts/sync.js --watch
```

### Tip 3: Run Health Check Regularly

```bash
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

- **[How It Works](HOW-IT-WORKS.md)** - Complete explanation
- **[Cheat Sheet](CHEAT-SHEET.md)** - Quick reference
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
