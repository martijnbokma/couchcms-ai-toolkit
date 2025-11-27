# Installation Methods - CouchCMS AI Toolkit

Multiple ways to install the toolkit, choose what works best for you.

## 🚀 Method 1: Bash Installer (Recommended)

**Works on:** macOS, Linux, Windows (Git Bash/WSL)

```bash
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/install.sh | bash
```

**Pros:**
- ✅ One command
- ✅ Works everywhere
- ✅ No download needed
- ✅ Automatic cleanup

**Cons:**
- ❌ Requires curl

---

## 🔧 Method 2: Bun Installer

**Works on:** Any system with Bun installed

```bash
# Download installer
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/master/scripts/install.js -o install.js

# Run with Bun
bun install.js

# Cleanup
rm install.js
```

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
bun ai-toolkit-shared/scripts/init.js
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
bun ai-toolkit-shared/scripts/init.js
```

**Pros:**
- ✅ Can modify toolkit
- ✅ Can contribute back
- ✅ Latest development version

**Cons:**
- ❌ Not a submodule (harder to update)
- ❌ For advanced users

---

## 📊 Comparison

| Method | Commands | Time | Best For |
|--------|----------|------|----------|
| **Bash Installer** | 1 | 30s | Everyone (recommended) |
| **Bun Installer** | 3 | 30s | Bun users |
| **Manual** | 3 | 1m | Learning/troubleshooting |
| **Git Clone** | 3 | 1m | Development/contribution |

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
curl -fsSL https://bun.sh/install | bash
```

Or use Node.js instead:
```bash
npm install  # instead of: bun install
node scripts/init.js  # instead of: bun scripts/init.js
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
```

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

```
your-project/
├── ai-toolkit-shared/     ← Toolkit installed here
├── .cursorrules           ← Generated configs
├── .claude/
├── .github/
└── .project/
    └── standards.md       ← Your configuration
```

Next steps:
1. Check health: `bun ai-toolkit-shared/scripts/health.js`
2. Start coding with your AI assistant
3. Modify config: `vim .project/standards.md`
4. Re-sync: `bun ai-toolkit-shared/scripts/sync.js`

---

## 📚 More Documentation

- **[Quick Start](QUICK-START.md)** - Get started in 5 minutes
- **[How It Works](HOW-IT-WORKS.md)** - Understanding the toolkit
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common problems
- **[Commands](../README.md#-commands)** - All available commands
