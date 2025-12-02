# Start Here - CouchCMS AI Toolkit

**Welcome!** This is your single entry point to get started with the CouchCMS AI Toolkit.

## 🎯 What Do You Want to Do?

Choose your path:

### 🚀 I'm New - First Time Setup

**Goal:** Install and configure the toolkit for the first time

**Steps:**
1. **Add toolkit to your project:**
   ```bash
   git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
   ```

2. **Run unified install command:**
   ```bash
   # From project root (recommended)
   bun ai-toolkit-shared/scripts/toolkit.js install
   ```
   
   **Note:** You must run this from your project root directory, not from inside `ai-toolkit-shared`.
   
   **💡 Tip:** After installation, you'll be asked if you want to add a script to `package.json`.
   If you say "yes", you can then use the simpler command:
   ```bash
   bun run toolkit install
   bun run toolkit sync
   bun run toolkit health
   ```

3. **Choose setup complexity:**
   - **Easy** (1 min, 2 questions) - Quick setup with recommended defaults
   - **Medium** (3 min, 5 questions) - Choose CSS and JS frameworks
   - **Comprehensive** (5 min, 8+ questions) - Full control

**What happens:**
- ✅ Dependencies installed automatically
- ✅ All CouchCMS modules/agents included automatically
- ✅ Configuration file created (`.project/standards.md`)
- ✅ AI configs generated for your editors

**Next:** See [Quick Start Guide](#quick-start-guide) below

---

### ⚙️ I Want to Configure My Project

**Goal:** Set up or reconfigure an existing project

**Command:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js setup
```

**Options:**
- Choose setup complexity (Easy/Medium/Comprehensive)
- Select frontend frameworks (CSS/JS)
- All CouchCMS components included automatically

**Change complexity later:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js reconfigure
```

---

### 🔄 I Want to Generate Configs

**Goal:** Generate AI editor configs from your standards.md

**Command:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js sync
```

**What it does:**
- Reads `.project/standards.md`
- Generates configs for Cursor, Claude, Copilot, etc.
- Updates all editor configurations

**Watch mode** (auto-sync on changes):
```bash
bun ai-toolkit-shared/scripts/toolkit.js sync --watch
```

---

### ✅ I Want to Check My Setup

**Goal:** Validate installation and configuration

**Commands:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js health    # Check installation status
bun ai-toolkit-shared/scripts/toolkit.js validate # Validate configuration compliance
```

**What they check:**
- Toolkit installation
- Dependencies installed
- Configuration file valid
- Modules/agents available

---

### 🔍 I Want to Browse Modules/Agents

**Goal:** See what modules and agents are available

**Command:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js browse              # Browse all
bun ai-toolkit-shared/scripts/toolkit.js browse --modules   # Browse modules only
bun ai-toolkit-shared/scripts/toolkit.js browse --agents    # Browse agents only
```

---

### 📚 I Want to Learn More

**Goal:** Understand concepts and how things work

**Guides:**
- **[Quick Start Guide](#quick-start-guide)** - Step-by-step beginner guide
- **[Concepts Guide](CONCEPTS.md)** - Understanding modules, agents, and configuration
- **[Commands Reference](COMMANDS.md)** - All commands explained
- **[Troubleshooting](TROUBLESHOOTING.md)** - Fix common issues

---

## Quick Start Guide

### Step 1: Install Toolkit

```bash
# Add as git submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# Install and setup (unified command)
bun ai-toolkit-shared/scripts/toolkit.js install
```

**Expected output:**
```
✅ Dependencies installed
What kind of setup do you want?
  1. Makkelijk (Easy) - 1 minute, 2 questions
  2. Gemiddeld (Medium) - 3 minutes, 5 questions
  3. Uitgebreid (Comprehensive) - 5 minutes, 8+ questions
Choice [1-3]: _
```

### Step 2: Choose Setup Complexity

**For beginners:** Choose option 1 (Easy)
- Quick setup with recommended defaults
- All CouchCMS components included automatically
- TailwindCSS + Alpine.js included

**For most projects:** Choose option 2 (Medium)
- Choose your CSS framework
- Choose your JS framework
- All CouchCMS components included automatically

**For full control:** Choose option 3 (Comprehensive)
- All frontend options available
- Advanced configuration options
- All CouchCMS components included automatically

### Step 3: Answer Questions

**Easy mode (2 questions):**
1. Project name: `my-project`
2. Project description: `A CouchCMS web application`

**Medium mode (5 questions):**
1. Project name
2. Project description
3. CSS framework choice (TailwindCSS, daisyUI, none)
4. JS framework choice (Alpine.js, TypeScript, none)
5. Toolkit path (auto-detected)

**Comprehensive mode (8+ questions):**
- All of the above plus:
- Advanced frontend options
- Framework configuration
- Context directory setup

### Step 4: Generate Configs

After setup, generate your AI editor configs:

```bash
bun ai-toolkit-shared/scripts/toolkit.js sync
```

**What gets generated:**
- `.cursorrules` - Cursor AI configuration
- `.cursor/rules/*.mdc` - Context-aware rules
- `CLAUDE.md` - Claude Code memory
- `.claude/skills/*.md` - Claude Code skills
- `.claude/settings.json` - Claude Code settings
- `.github/copilot-instructions.md` - GitHub Copilot
- `.windsurf/rules.md` - Windsurf AI
- And more...

### Step 5: Verify Setup

```bash
bun ai-toolkit-shared/scripts/toolkit.js health
```

**Expected output:**
```
✅ Toolkit structure is valid
✅ Dependencies installed
✅ Configuration file found
✅ Modules available: 15
✅ Agents available: 23
```

---

## Common Commands

| Command | What It Does |
|---------|--------------|
| `toolkit install` | First-time installation and setup |
| `toolkit setup` | Configure or reconfigure project |
| `toolkit sync` | Generate AI configs from standards.md |
| `toolkit validate` | Check configuration compliance |
| `toolkit health` | Check installation status |
| `toolkit browse` | Browse available modules/agents |
| `toolkit reconfigure` | Change setup complexity preference |
| `toolkit help` | Show help message |

---

## Key Concepts

### Modules vs Agents

**Modules** = Knowledge/patterns for AI agents
- Examples: `couchcms-core`, `tailwindcss`, `alpinejs`
- Always included: All 15 CouchCMS modules
- Optional: Frontend modules (TailwindCSS, daisyUI, Alpine.js, TypeScript)

**Agents** = Specialized AI assistants
- Examples: `@couchcms`, `@tailwindcss`, `@alpinejs`
- Always included: All 23 CouchCMS agents
- Optional: Frontend agents matching your selected modules

### Setup Complexity

**Easy:** Quick setup with recommended defaults
- Time: 1 minute
- Questions: 2 (project name, description)
- Frontend: TailwindCSS + Alpine.js (automatic)

**Medium:** Choose your frameworks
- Time: 3 minutes
- Questions: 5 (project info + CSS + JS choices)
- Frontend: Your choice

**Comprehensive:** Full control
- Time: 5 minutes
- Questions: 8+ (all options)
- Frontend: All options available

**Important:** All CouchCMS modules and agents are **always included** regardless of complexity choice.

---

## Troubleshooting

### Dependencies Not Installed

**Error:** `Cannot find module 'gray-matter'`

**Quick Fix:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js install
```

The unified command installs dependencies automatically.

### Configuration File Not Found

**Error:** `No configuration file found`

**Quick Fix:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js setup
```

### Toolkit Path Not Found

**Error:** `Toolkit path incorrect`

**Solution:**
The toolkit auto-detects its location. If detection fails:
1. Check that `ai-toolkit-shared/` exists in your project
2. Verify it contains `modules/`, `scripts/`, `templates/` directories
3. Update `.project/standards.md` with correct path

**More help:** See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## Next Steps

1. ✅ **Setup complete?** → Start using AI assistance in your editor
2. 📖 **Want to learn more?** → Read [Concepts Guide](CONCEPTS.md)
3. 🔧 **Need to customize?** → Run `toolkit reconfigure`
4. 📚 **All commands:** → See [Commands Reference](COMMANDS.md)

---

## Getting Help

- **Documentation:** See `docs/` directory
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Concepts:** See [CONCEPTS.md](CONCEPTS.md)
- **Commands:** See [COMMANDS.md](COMMANDS.md)

---

**Ready to start?** Run `bun ai-toolkit-shared/scripts/toolkit.js install` now! 🚀
