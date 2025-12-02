# Quick Start Guide for Beginners

**Perfect for:** Absolute beginners who want step-by-step instructions with exact commands and expected outputs.

---

## What You'll Do

1. Add the toolkit to your project
2. Run the unified install command
3. Answer 2 simple questions
4. Start using AI assistance

**Time:** ~2 minutes
**Difficulty:** ⭐ Very Easy

---

## Step-by-Step Instructions

### Step 1: Open Your Terminal

Open your terminal/command prompt in your project directory.

**Expected:** You should see your project path, like:
```
~/my-project $
```

---

### Step 2: Add Toolkit as Git Submodule

**Exact command to copy-paste:**
```bash
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

**What's happening:** This downloads the toolkit into your project.

**Expected output:**
```
Cloning into 'ai-toolkit-shared'...
remote: Enumerating objects: XXXX, done.
remote: Counting objects: 100% (XXXX/XXXX), done.
remote: Compressing objects: 100% (XXXX/XXXX), done.
Receiving objects: 100% (XXXX/XXXX), done.
Submodule path 'ai-toolkit-shared': checked out 'XXXX'
```

**If you see an error:**
- "fatal: not a git repository" → Run `git init` first
- "already exists" → The toolkit is already added, continue to Step 3

---

### Step 3: Run Unified Install Command

**Exact command to copy-paste:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js install
```

**Important:**
- Run this from your **project root** directory (not from inside `ai-toolkit-shared`)
- Make sure you're in the directory where you added the submodule

**💡 After installation:** You'll be asked if you want to add a script to `package.json`.
- If you say **"yes"**, you can then use the simpler command: `bun run toolkit install`
- If you say **"no"**, you can always add it later or use the full path

**What's happening:**
- The toolkit checks if dependencies are installed
- If not, it installs them automatically
- Then it starts the setup wizard

**Expected output:**
```
🔄 Checking dependencies...
✅ Dependencies installed

======================================================================
  What kind of setup do you want?
======================================================================

  1. Easy
     → Quick setup: 1 minute, 2 questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Includes: TailwindCSS + Alpine.js (recommended defaults)
     → Perfect for: Getting started quickly

  2. Medium
     → Balanced setup: 3 minutes, 5 questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Choose: CSS framework (TailwindCSS, daisyUI, custom)
     → Choose: JS framework (Alpine.js, TypeScript, none)
     → Perfect for: Most projects

  3. Comprehensive
     → Full setup: 5 minutes, 8+ questions
     → Includes: All CouchCMS modules/agents (automatic)
     → Choose: All frontend frameworks and tools
     → Choose: Advanced configuration (framework, context directory)
     → Perfect for: Complete control

Choice [1-3]: _
```

**If you see an error:**
- "command not found: bun" → Install Bun: `curl -fsSL https://bun.sh/install | bash`
- "Cannot find module" → Dependencies will be installed automatically, wait a moment

---

### Step 4: Choose Setup Complexity

**For beginners:** Type `1` and press Enter

**What this means:**
- Quick setup (1 minute)
- Only 2 questions
- All CouchCMS components included automatically
- Recommended frontend frameworks included

**Expected output:**
```
Choice [1-3]: 1
✅ Selected: Easy

======================================================================
  CouchCMS Modules & Agents (Automatic)
======================================================================
ℹ️  Including all CouchCMS modules and agents automatically...
  Modules: 11 (always included)
  Agents: 16 (always included)
✅ CouchCMS components will be included automatically

======================================================================
  Project Information
======================================================================

Project name [my-project]: _
```

---

### Step 5: Enter Project Name

**Type your project name** (or press Enter to use default)

**Example:**
```
Project name [my-project]: my-blog
```

**What to enter:**
- Use lowercase letters, numbers, and hyphens
- Examples: `my-blog`, `company-website`, `portfolio-2024`
- Avoid spaces and special characters

**Expected output:**
```
Project name [my-project]: my-blog

Project description [A CouchCMS web application]: _
```

---

### Step 6: Enter Project Description

**Type a short description** (or press Enter to use default)

**Example:**
```
Project description [A CouchCMS web application]: A blog about web development
```

**What to enter:**
- One sentence describing your project
- Examples: "A blog about web development", "Company website", "Portfolio site"

**Expected output:**
```
Project description [A CouchCMS web application]: A blog about web development

🔄 Selecting frontend frameworks...
ℹ️  Using recommended CSS framework: tailwindcss
ℹ️  Using recommended JS framework: alpinejs
✅ Selected: tailwindcss
✅ Selected: alpinejs

🔄 Detecting toolkit path...
✅ Toolkit path: ./ai-toolkit-shared

🔄 Generating configuration file...
✅ Created: .project/
✅ Created: .project/standards.md

🔄 Running initial sync...
✅ Sync completed successfully
```

---

### Step 7: Verify Setup

**Check that everything worked:**

```bash
bun ai-toolkit-shared/scripts/toolkit.js health
```

**Expected output:**
```
✅ Toolkit structure is valid
✅ Dependencies installed
✅ Configuration file found: .project/standards.md
✅ Modules available: 15
✅ Agents available: 23
```

**If you see errors:**
- See [Troubleshooting](#troubleshooting) section below

---

## What Just Happened?

### ✅ Created Files

1. **`.project/standards.md`** - Your project configuration (single source of truth)
2. **`.cursorrules`** - Cursor AI configuration
3. **`.cursor/rules/*.mdc`** - Context-aware rules
4. **`CLAUDE.md`** - Claude Code memory file
5. **`.claude/skills/*.md`** - Claude Code skills
6. **And more...** - Configs for other editors

### ✅ Included Components

**CouchCMS (Automatic - Always Included):**
- 11 modules (couchcms-core, databound-forms, search, pagination, etc.)
- 16 agents (@couchcms, @databound-forms, @search, etc.)

**Frontend (Selected):**
- TailwindCSS (CSS framework)
- Alpine.js (JavaScript framework)

---

## Next Steps

### 1. Open Your Editor

Open your project in Cursor (or your preferred editor).

**What you'll see:**
- AI assistance is now available
- Context-aware rules activate based on file types
- All CouchCMS patterns are loaded

### 2. Start Coding

The AI now understands:
- ✅ CouchCMS patterns and best practices
- ✅ TailwindCSS styling
- ✅ Alpine.js interactivity
- ✅ Your project structure

### 3. Use AI Agents

In Cursor, you can now use:
- `@couchcms` - For CouchCMS-specific help
- `@tailwindcss` - For styling questions
- `@alpinejs` - For JavaScript help
- And 20+ more specialized agents

---

## Troubleshooting

### Problem: "bun: command not found"

**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or use Node.js instead
npm run toolkit install
```

---

### Problem: "Cannot find module 'gray-matter'"

**What happened:** Dependencies aren't installed yet.

**Solution:** The unified command installs them automatically. If it fails:
```bash
cd ai-toolkit-shared
bun install
cd ..
bun ai-toolkit-shared/scripts/toolkit.js install
```

---

### Problem: "No configuration file found"

**What happened:** Setup didn't complete.

**Solution:**
```bash
bun ai-toolkit-shared/scripts/toolkit.js setup
```

---

### Problem: "Toolkit path incorrect"

**What happened:** Toolkit location not detected.

**Solution:**
1. Check that `ai-toolkit-shared/` folder exists
2. Verify it contains `modules/`, `scripts/`, `templates/` folders
3. Run: `bun ai-toolkit-shared/scripts/toolkit.js setup` again

---

## Common Questions

### Q: Can I change my setup later?

**A:** Yes! Run:
```bash
bun ai-toolkit-shared/scripts/toolkit.js reconfigure
```

This lets you:
- Change setup complexity
- Add/remove frontend frameworks
- Update configuration

### Q: What if I want different frontend frameworks?

**A:** Run:
```bash
bun ai-toolkit-shared/scripts/toolkit.js reconfigure
```

Choose "Medium" or "Comprehensive" to select different frameworks.

### Q: Do I need to run anything after setup?

**A:** No! Everything is set up. Just start coding.

**Optional:** If you edit `.project/standards.md`, run:
```bash
bun ai-toolkit-shared/scripts/toolkit.js sync
```

This updates all AI configs.

### Q: What's the difference between Easy, Medium, and Comprehensive?

**A:**
- **Easy:** Quick setup, recommended defaults (TailwindCSS + Alpine.js)
- **Medium:** Choose your CSS and JS frameworks
- **Comprehensive:** All options available, advanced configuration

**Important:** All CouchCMS components are included automatically in all modes.

---

## Success Checklist

After completing this guide, you should have:

- ✅ Toolkit added to your project (`ai-toolkit-shared/` folder)
- ✅ Dependencies installed
- ✅ Configuration file created (`.project/standards.md`)
- ✅ AI configs generated (`.cursorrules`, `CLAUDE.md`, etc.)
- ✅ Health check passes (`bun ai-toolkit-shared/scripts/toolkit.js health`)

**If all checkboxes are checked, you're ready to go!** 🎉

---

## Getting More Help

- **Concepts:** See [CONCEPTS.md](CONCEPTS.md) - Learn about modules, agents, etc.
- **Commands:** See [COMMANDS.md](COMMANDS.md) - All available commands
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix issues
- **Start Here:** See [START-HERE.md](START-HERE.md) - Decision tree for what to do next

---

**Ready?** Start with Step 1 above! 🚀
