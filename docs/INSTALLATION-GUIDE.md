# Installation Guide - CouchCMS AI Toolkit

**Navigation:** [← Documentation Index](README.md) | [← Main README](../README.md) | [Quick Start](QUICK-START.md) | [Troubleshooting](TROUBLESHOOTING.md)

A comprehensive, step-by-step installation guide with visual elements, tips, and troubleshooting.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Installation Methods](#-installation-methods)
3. [Step-by-Step Installation](#-step-by-step-installation)
4. [Post-Installation Setup](#-post-installation-setup)
5. [Verification](#-verification)
6. [Common Issues & Solutions](#-common-issues--solutions)
7. [Tips & Best Practices](#-tips--best-practices)

---

## ✅ Prerequisites

Before installing, ensure you have the following:

### Required Software

| Software | Version | How to Check | Installation |
|----------|---------|--------------|--------------|
| **Git** | Any recent version | `git --version` | [Download Git](https://git-scm.com/downloads) |
| **Bun** (recommended) | Latest | `bun --version` | `curl -fsSL https://bun.sh/install \| bash` |
| **Node.js** (alternative) | v18+ | `node --version` | [Download Node.js](https://nodejs.org/) |

### System Requirements

- ✅ **Operating System:** macOS, Linux, or Windows (with Git Bash/WSL)
- ✅ **Terminal:** Command-line access
- ✅ **Project:** A CouchCMS project (or new project directory)
- ✅ **Git Repository:** Your project should be a Git repository

### Quick Prerequisites Check

Run this command to verify everything is ready:

```bash
# Check all prerequisites at once
echo "Checking prerequisites..."
git --version && echo "✅ Git installed" || echo "❌ Git missing"
bun --version && echo "✅ Bun installed" || node --version && echo "✅ Node.js installed" || echo "❌ No JavaScript runtime"
git rev-parse --git-dir > /dev/null 2>&1 && echo "✅ Git repository" || echo "❌ Not a git repository"
```

**If any checks fail:** Install the missing software before proceeding.

---

## 🚀 Installation Methods

Choose the installation method that best fits your situation:

### Method Comparison

| Method | Commands | Time | Best For | Public Repo | Private Repo |
|--------|----------|------|----------|-------------|--------------|
| **1. Bash Installer** | 1 | 30s | Quick setup | ✅ | ❌ |
| **2. Bun Installer** | 3 | 30s | Bun users | ✅ | ❌ |
| **3. Manual** | 3 | 1m | Learning, troubleshooting | ✅ | ✅ |
| **4. Git Clone** | 3 | 1m | Development, contributing | ✅ | ✅ |

**💡 Recommendation:** 
- **New users:** Use Method 1 (Bash Installer)
- **Learning:** Use Method 3 (Manual)
- **Private repos:** Use Method 3 (Manual)

---

## 📦 Step-by-Step Installation

### Method 1: Bash Installer (Recommended for Public Repos)

**⏱️ Time:** ~30 seconds | **🎯 Difficulty:** ⭐ Easy

#### Step 1: Run Installer

```bash
# One command does everything!
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
```

#### What Happens Automatically

The installer performs these steps:

1. ✅ **Checks prerequisites** (Git, Bun/Node.js)
2. ✅ **Adds toolkit as git submodule**
3. ✅ **Installs dependencies** (`bun install`)
4. ✅ **Makes scripts executable**

#### Step 2: Run Setup Wizard

After installation completes:

```bash
# Run the setup wizard
cd ai-toolkit-shared && bun run init
```

**That's it!** You're ready to use the toolkit.

---

### Method 2: Bun Installer

**⏱️ Time:** ~30 seconds | **🎯 Difficulty:** ⭐ Easy

#### Step 1: Download Installer

```bash
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/scripts/install.js -o install.js
```

#### Step 2: Run Installer

```bash
bun install.js
```

#### Step 3: Cleanup

```bash
rm install.js
```

#### Step 4: Run Setup Wizard

```bash
cd ai-toolkit-shared && bun run init
```

---

### Method 3: Manual Installation (Recommended for Learning)

**⏱️ Time:** ~1 minute | **🎯 Difficulty:** ⭐⭐ Intermediate

This method shows you exactly what happens at each step.

#### Step 1: Add Toolkit as Submodule

```bash
# From your project root directory
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

**Expected Output:**
```
Cloning into 'ai-toolkit-shared'...
remote: Enumerating objects: X, done.
remote: Counting objects: 100% (X/X), done.
remote: Compressing objects: 100% (X/X), done.
Receiving objects: 100% (X/X), done.
```

**✅ Success Indicator:** You should see `ai-toolkit-shared/` directory created.

#### Step 2: Install Dependencies

```bash
# Navigate to toolkit directory
cd ai-toolkit-shared

# Install dependencies
bun install
# OR if you don't have Bun:
# npm install

# Return to project root
cd ..
```

**Expected Output:**
```
bun install vX.X.X
...
✓ Installed X packages
```

**✅ Success Indicator:** You should see `node_modules/` directory in `ai-toolkit-shared/`.

**⚠️ Important:** This step is **critical**. The toolkit requires these packages:
- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing  
- `handlebars` - Template generation

#### Step 3: Run Setup Wizard

```bash
# From your project root
bun ai-toolkit-shared/scripts/init.js
```

**Expected Output:**
```
🚀 CouchCMS AI Toolkit - Interactive Setup

Let's set up your project configuration...

🔍 Detecting project...
   Type: blog
   Frameworks: tailwindcss, alpinejs
   Languages: php, javascript
```

**✅ Success Indicator:** The wizard starts and asks you questions.

---

### Method 4: Git Clone (For Development)

**⏱️ Time:** ~1 minute | **🎯 Difficulty:** ⭐⭐⭐ Advanced

Use this if you want to modify the toolkit or contribute.

#### Step 1: Clone Repository

```bash
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

#### Step 2: Install Dependencies

```bash
cd ai-toolkit-shared
bun install
cd ..
```

#### Step 3: Run Setup Wizard

```bash
bun ai-toolkit-shared/scripts/init.js
```

**Note:** This method doesn't create a git submodule, so updates are manual.

---

## 🎯 Post-Installation Setup

After installation, you need to configure the toolkit for your project.

### Setup Wizard Options

The setup wizard offers 4 modes:

#### 1. Auto Mode (Recommended) ⚡

**Best for:** 95% of users

```text
🎯 Setup mode:
  1. Auto (recommended) - Use detected settings  ← Choose this!
  2. Preset - Choose from common project types
  3. Simple - Quick setup with defaults
  4. Custom - Full control over all options
Choice [1-4]: 1
```

**What it does:**
- 🔍 Automatically detects your project type
- 🔍 Recognizes frameworks (TailwindCSS, Alpine.js, etc.)
- 🔍 Recommends appropriate modules and agents
- ✅ Generates configuration in seconds

**Questions:** 0-2 (just confirmation)
**Time:** ~30 seconds

#### 2. Preset Mode 📋

**Best for:** Common project types

Choose from 8 predefined configurations:

| Preset | Description | Modules Included |
|--------|-------------|------------------|
| **Landing Page** | Simple landing page | Core, TailwindCSS, Alpine.js |
| **Blog** | Blog with comments & search | Core, TailwindCSS, Alpine.js, Comments, Search, Pagination |
| **E-commerce** | Online store | Core, TailwindCSS, Alpine.js, DataBound Forms, Users, Search |
| **Web Application** | Full-featured webapp | Core, TailwindCSS, Alpine.js, TypeScript, DataBound Forms, Users |
| **Portfolio** | Portfolio showcase | Core, TailwindCSS, Alpine.js |
| **Documentation** | Documentation site | Core, TailwindCSS, Alpine.js, Search, Pagination |
| **Minimal** | Bare minimum | Core only |
| **Full Stack** | Everything included | All modules and agents |

**Questions:** 1-2
**Time:** ~45 seconds

#### 3. Simple Mode 🎯

**Best for:** Quick setup with defaults

- ✅ Includes ALL CouchCMS modules/agents
- ✅ Includes TailwindCSS and Alpine.js
- ✅ Framework disabled (can enable later)
- ✅ Fast setup

**Questions:** 2-3
**Time:** ~1 minute

#### 4. Custom Mode ⚙️

**Best for:** Advanced users who want full control

- ✅ Choose exact modules and agents
- ✅ Configure framework options
- ✅ Custom configuration location
- ✅ Full customization

**Questions:** 5-10
**Time:** 2-3 minutes

### Alternative: Simple Standards Creator

For beginners, there's an even simpler option:

```bash
bun ai-toolkit-shared/scripts/create-standards.js
```

**Perfect if you:**
- Are using the toolkit for the first time
- Want to start quickly without technical details
- Don't know exactly which modules you need

**See:** [Simple Setup Guide](SIMPLE-SETUP.md) for details

---

## ✅ Verification

After installation and setup, verify everything works:

### Step 1: Run Health Check

```bash
bun ai-toolkit-shared/scripts/health.js
```

**Expected Output:**
```
✅ Toolkit installed
✅ Dependencies installed
✅ Configuration file found
✅ Generated files present
✅ Everything looks good!
```

### Step 2: Check Generated Files

```bash
# List generated configuration files
ls -la .cursorrules CLAUDE.md AGENTS.md .project/standards.md
```

**Expected Files:**
- ✅ `.cursorrules` - Cursor IDE configuration
- ✅ `CLAUDE.md` - Claude memory file
- ✅ `AGENTS.md` - Agent documentation
- ✅ `.project/standards.md` - Your configuration

### Step 3: Test AI Assistant

Open your AI assistant (Cursor, Claude Code, etc.) and ask:

```text
"Create a CouchCMS template for a blog post"
```

**✅ Success:** Your AI should understand CouchCMS patterns and generate appropriate code.

---

## 🆘 Common Issues & Solutions

### Issue 1: "Git is not installed"

**Symptoms:**
```bash
git: command not found
```

**Solution:**

**macOS:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install git
```

**Windows:**
Download from: https://git-scm.com/download/win

**Verify:**
```bash
git --version
```

---

### Issue 2: "Bun/Node.js not found"

**Symptoms:**
```bash
bun: command not found
# or
node: command not found
```

**Solution - Install Bun (Recommended):**

```bash
curl -fsSL https://bun.sh/install | bash

# After installation, restart terminal or run:
source ~/.bashrc  # or ~/.zshrc depending on your shell

# Verify:
bun --version
```

**Solution - Install Node.js (Alternative):**

Download from: https://nodejs.org/

**Verify:**
```bash
node --version
npm --version
```

---

### Issue 3: "Not in a git repository"

**Symptoms:**
```bash
fatal: not a git repository
```

**Solution:**

```bash
# Initialize git repository
git init

# Add initial commit (optional)
git add .
git commit -m "Initial commit"

# Now try installation again
```

---

### Issue 4: "Dependencies not installed"

**Symptoms:**
```bash
Cannot find module 'gray-matter'
Error: Cannot resolve module
```

**Solution:**

```bash
# Navigate to toolkit directory
cd ai-toolkit-shared

# Install dependencies
bun install
# OR
npm install

# Return to project root
cd ..
```

**Prevention:** Dependencies are now automatically installed when you run scripts, but you can install manually if needed.

---

### Issue 5: "Submodule not initialized"

**Symptoms:**
```bash
fatal: no submodule mapping found
ai-toolkit-shared/ directory is empty
```

**Solution:**

```bash
# Initialize and update submodule
git submodule update --init --recursive

# If that doesn't work, re-add:
git submodule deinit -f ai-toolkit-shared
rm -rf .git/modules/ai-toolkit-shared
git rm -f ai-toolkit-shared
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

---

### Issue 6: "Configuration file missing"

**Symptoms:**
```bash
No configuration file found
standards.md not found
```

**Solution:**

```bash
# Run setup wizard
bun ai-toolkit-shared/scripts/create-standards.js

# OR use advanced setup
bun ai-toolkit-shared/scripts/init.js
```

**Note:** Configuration file location is standardized to `.project/standards.md`.

---

### Issue 7: "Permission denied"

**Symptoms:**
```bash
Permission denied: ./scripts/init.js
```

**Solution:**

```bash
# Use bun or node to run scripts (don't run directly)
bun ai-toolkit-shared/scripts/init.js

# OR
node ai-toolkit-shared/scripts/init.js

# If you need to make scripts executable:
chmod +x ai-toolkit-shared/scripts/*.js
```

---

### Issue 8: "curl: command not found"

**Symptoms:**
```bash
curl: command not found
```

**Solution:**

**macOS:**
```bash
# Usually pre-installed, but if missing:
brew install curl
```

**Linux:**
```bash
sudo apt install curl  # Ubuntu/Debian
sudo yum install curl  # CentOS/RHEL
```

**Windows:**
Use Git Bash (comes with Git for Windows) or WSL.

---

## 💡 Tips & Best Practices

### Tip 1: Use Auto Mode

For 95% of projects, **Auto mode** is perfect. It detects everything automatically and requires minimal input.

### Tip 2: Start with Simple Setup

If you're new to the toolkit, use the **Simple Standards Creator**:

```bash
bun ai-toolkit-shared/scripts/create-standards.js
```

It asks simple questions and handles the technical details.

### Tip 3: Verify Installation

Always run the health check after installation:

```bash
bun ai-toolkit-shared/scripts/health.js
```

This catches issues early.

### Tip 4: Keep Toolkit Updated

Update the toolkit regularly:

```bash
cd ai-toolkit-shared
git pull origin master
bun install
cd ..
bun ai-toolkit-shared/scripts/sync.js
```

### Tip 5: Use Watch Mode During Development

During setup/development, use watch mode:

```bash
bun ai-toolkit-shared/scripts/sync.js --watch
```

Configs automatically update when you modify `.project/standards.md`.

### Tip 6: Browse Modules Interactively

Instead of manually editing configuration:

```bash
bun ai-toolkit-shared/scripts/browse.js
```

Use ↑↓ to navigate, Space to select modules/agents.

### Tip 7: Read Error Messages Carefully

The toolkit now provides specific error messages with:
- ✅ Line numbers
- ✅ Fix suggestions
- ✅ Similar name suggestions (for typos)

Always read the full error message before troubleshooting.

### Tip 8: Check Troubleshooting Guide

If you encounter issues:

1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Run validation: `bun ai-toolkit-shared/scripts/validate.js`
3. Check error messages for specific solutions

---

## 📊 Installation Checklist

Use this checklist to ensure complete installation:

- [ ] **Prerequisites installed**
  - [ ] Git installed and verified
  - [ ] Bun or Node.js installed and verified
  - [ ] Project is a Git repository

- [ ] **Toolkit installed**
  - [ ] Toolkit added as submodule (or cloned)
  - [ ] Dependencies installed (`bun install`)
  - [ ] `ai-toolkit-shared/` directory exists

- [ ] **Configuration created**
  - [ ] Setup wizard completed
  - [ ] `.project/standards.md` file exists
  - [ ] Configuration file has valid YAML

- [ ] **Files generated**
  - [ ] `.cursorrules` exists
  - [ ] `CLAUDE.md` exists
  - [ ] `AGENTS.md` exists
  - [ ] Other editor configs exist (if selected)

- [ ] **Verification passed**
  - [ ] Health check passes
  - [ ] Validation passes
  - [ ] AI assistant recognizes CouchCMS patterns

---

## 📚 Next Steps

After successful installation:

1. **Read the documentation:**
   - [Getting Started](GETTING-STARTED.md) - Complete guide
   - [Quick Start](QUICK-START.md) - Fast reference
   - [Commands Reference](COMMANDS.md) - All available commands

2. **Customize your configuration:**
   - Edit `.project/standards.md`
   - Add project-specific rules
   - Run `bun ai-toolkit-shared/scripts/sync.js` after changes

3. **Start developing:**
   - Your AI assistant now knows CouchCMS patterns
   - Ask it to create templates, components, etc.
   - Use the toolkit's knowledge modules

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Run full diagnostics:**
   ```bash
   bun ai-toolkit-shared/scripts/validate.js
   bun ai-toolkit-shared/scripts/health.js
   ```

2. **Check the troubleshooting guide:**
   - [Troubleshooting Guide](TROUBLESHOOTING.md)

3. **Search existing issues:**
   - GitHub Issues: https://github.com/martijnbokma/couchcms-ai-toolkit/issues

4. **Open a new issue:**
   - Include validation output
   - Include error messages
   - Describe what you've tried

---

## 📖 Related Documentation

- **[Quick Start](QUICK-START.md)** - Get started in 5 minutes
- **[Getting Started](GETTING-STARTED.md)** - Complete setup guide
- **[Simple Setup](SIMPLE-SETUP.md)** - Beginner-friendly wizard
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common problems and solutions
- **[Installation Methods](INSTALLATION-METHODS.md)** - Detailed method comparison
- **[Commands Reference](COMMANDS.md)** - All available commands

---

**🎉 Installation complete!** You're now ready to use the CouchCMS AI Toolkit.
