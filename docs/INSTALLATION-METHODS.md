# Installation Methods - CouchCMS AI Toolkit


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


Multiple ways to install the toolkit, choose what works best for you.



### Dependencies

The toolkit requires the following Node.js packages:

- **gray-matter** (^4.0.3) - Parses YAML frontmatter from standards.md configuration files
- **yaml** (^2.3.4) - Handles YAML serialization and deserialization
- **handlebars** (^4.7.8) - Template engine for generating AI configuration files
- **fast-check** (^3.15.0) (development) - Testing framework for generating random test cases

These are automatically installed when you run `bun install` in the toolkit directory.

## 🚀 Method 1: Bash Installer (Public Repos Only)

**Works on:** macOS, Linux, Windows (Git Bash/WSL)

**⚠️ Important:** This only works if the repository is **public**. For private repos, see Method 3 or [Private Repo Guide](PRIVATE-REPO-INSTALL.md).

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

**Pros:**
- ✅ One command
- ✅ Works everywhere
- ✅ No download needed
- ✅ Automatic cleanup

**Cons:**
- ❌ Requires curl
- ❌ Only works for public repositories

---

## 🔧 Method 2: Bun Installer

**Works on:** Any system with Bun installed

```bash
# Download installer
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/scripts/cli/install.js -o install.js

# Run with Bun
bun install.js

# Cleanup
rm install.js
```text

**Pros:**
- ✅ Uses Bun (faster)
- ✅ JavaScript-based

**Cons:**
- ❌ Requires Bun
- ❌ Three commands

---

## 📦 Method 3: Manual Installation

**Works on:** Any system with Git and Bun/Node

```bash
# Step 1: Add toolkit as submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# Step 2: Install dependencies
cd ai-toolkit-shared
bun install  # or: npm install
cd ..

# Step 3: Run setup wizard
bun ai-toolkit-shared/scripts/cli/init.js
```

**Pros:**
- ✅ Full control
- ✅ See each step
- ✅ Easy to troubleshoot

**Cons:**
- ❌ Three separate steps
- ❌ More typing

---

## 🔄 Method 4: Git Clone (For Development)

**Works on:** Developers who want to modify the toolkit

```bash
# Clone toolkit
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# Run setup
bun ai-toolkit-shared/scripts/cli/init.js
```text

**Pros:**
- ✅ Can modify toolkit
- ✅ Can contribute back
- ✅ Latest development version

**Cons:**
- ❌ Not a submodule (harder to update)
- ❌ For advanced users

---

## 📊 Comparison

| Method | Commands | Time | Best For | Public Repo | Private Repo |
|--------|----------|------|----------|-------------|--------------|
| **Bash Installer** | 1 | 30s | Public repos | ✅ | ❌ |
| **Bun Installer** | 3 | 30s | Bun users (public) | ✅ | ❌ |
| **Manual** | 3 | 1m | Everyone | ✅ | ✅ |
| **Git Clone** | 3 | 1m | Development | ✅ | ✅ |

**For private repositories:** See [Private Repo Installation Guide](PRIVATE-REPO-INSTALL.md)

---

## 🆘 Troubleshooting

### "curl: command not found"

**macOS/Linux:**
```bash
# Install curl
sudo apt install curl  # Ubuntu/Debian
brew install curl      # macOS
```

**Windows:**
Use Git Bash (comes with Git for Windows) or WSL.

### "bun: command not found"

Install Bun:
```bash
# Install Bun (recommended JavaScript runtime)
# This is faster than Node.js and works great with the toolkit
curl -fsSL https://bun.sh/install | bash

# After installation, restart your terminal or run:
# source ~/.bashrc  # or ~/.zshrc depending on your shell

# Verify installation:
# bun --version
```bash

Or use Node.js instead:
```bash
npm install  # instead of: bun install
node scripts/cli/init.js  # instead of: bun scripts/cli/init.js
```

### "git: command not found"

Install Git:
- **macOS:** `brew install git`
- **Windows:** https://git-scm.com/download/win
- **Linux:** `sudo apt install git`

### "Not in a git repository"

Initialize git first:
```bash
git init
```yaml

### Installation Fails

Try manual installation (Method 3) to see where it fails.

---

## 💡 Recommendations

### For New Users
→ Use **Method 1** (Bash Installer)

### For Bun Enthusiasts
→ Use **Method 2** (Bun Installer)

### For Learning
→ Use **Method 3** (Manual)

### For Contributing
→ Use **Method 4** (Git Clone)

---

## 🔄 After Installation

All methods result in the same setup:

```text
your-project/
├── ai-toolkit-shared/     ← Toolkit installed here
├── .cursorrules           ← Generated configs
├── .claude/                     # Claude Code configuration
├── .github/
└── .project/
    └── standards.md       ← Your configuration
```

Next steps:
1. Check health: `bun ai-toolkit-shared/scripts/cli/health.js`
2. 🚀 Start coding with your AI assistant
3. 📝 Modify config: `vim .project/standards.md`
4. 📝 Re-sync: `bun ai-toolkit-shared/scripts/cli/sync.js`

---

## 📚 More Documentation

- **[Quick Start](QUICK-START.md)** - Get started in 5 minutes
- **[How It Works](GETTING-STARTED.md)** - Understanding the toolkit
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common problems
- **[Commands](../README.md#-commands)** - All available commands
