# Getting Started with CouchCMS AI Toolkit

**Navigation:** [← Documentation Index](README.md) | [← Main README](../README.md) | [Quick Start](QUICK-START.md) | [Troubleshooting](TROUBLESHOOTING.md) | [Glossary](GLOSSARY.md)

Complete guide for setting up the toolkit in your project.

**New to technical terms?** See [Glossary](GLOSSARY.md) for definitions of modules, agents, YAML frontmatter, and other concepts.

---

## Prerequisites

- ✅ Git installed
- ✅ Bun (recommended) or Node.js v18+
- ✅ A CouchCMS project (or new project directory)

---

## Quick Setup (Recommended)

**Time:** 2-5 minutes | **Difficulty:** ⭐ Easy

### Step 1: Add Toolkit

**Option A: Git Submodule (Recommended)**

```bash
cd your-project
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

**Option B: Home Directory (Advanced)**

Use this if you want to share one toolkit instance across multiple projects:

```bash
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git ~/couchcms-ai-toolkit
```

**Then configure your project** to use the home directory path:

```yaml
# In .project/standards.md
toolkit: '~/couchcms-ai-toolkit'
```

**When to use:**
- ✅ You have multiple CouchCMS projects
- ✅ You want to save disk space (one toolkit instance)
- ✅ You prefer centralized updates

**When NOT to use:**
- ❌ Single project (use Option A instead)
- ❌ Need different toolkit versions per project
- ❌ Team collaboration (submodules are better for Git workflows)

### Step 2: Run Setup Wizard

**For Beginners:**

```bash
# Option A (submodule):
bun ai-toolkit-shared/scripts/cli/create-standards.js

# Option B (home directory):
bun ~/couchcms-ai-toolkit/scripts/cli/create-standards.js
```

**For Advanced Users:**

```bash
# Option A (submodule):
bun ai-toolkit-shared/scripts/cli/init.js

# Option B (home directory):
bun ~/couchcms-ai-toolkit/scripts/cli/init.js
```

**Note:** The setup wizard automatically detects the toolkit location, so you can also run it from your project root and it will find the toolkit.

**What happens:**
- Dependencies are automatically installed
- Configuration file (`.project/standards.md`) is created
- AI configurations are generated
- You're ready to go!

**See:** [Simple Setup](SIMPLE-SETUP.md) | [Setup Comparison](SETUP-COMPARISON.md)

---

## Manual Setup (Advanced)

**Time:** 10-15 minutes | **Difficulty:** ⭐⭐ Intermediate

### 1. Add Toolkit

Choose one method (see [Quick Setup](#step-1-add-toolkit) above).

### 2. Install Dependencies

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

**Note:** Dependencies are now automatically installed, but you can install manually if needed.

### 3. Create Configuration File

Create `.project/standards.md`:

```markdown
---
name: 'my-project'
description: 'Brief project description'
toolkit: './ai-toolkit-shared'

modules:
    - couchcms-core
    - tailwindcss
    - alpinejs

agents:
    - couchcms
    - tailwindcss
    - alpinejs

framework: false
---

# Project-Specific Rules

Add your custom coding standards here...
```

**See:** [Config Files Guide](CONFIG-FILES.md) for complete structure.

### 4. Generate Configurations

```bash
bun ai-toolkit-shared/scripts/cli/sync.js
```

This creates:
- `.cursorrules` - Cursor IDE configuration
- `CLAUDE.md` - Claude memory file
- `AGENTS.md` - Agent documentation
- Other editor configurations

---

## Understanding Configuration

### Configuration File Structure

The toolkit uses a single file: `.project/standards.md`

**Structure:**
- **YAML frontmatter** (between `---` markers) - Configuration settings
- **Markdown body** - Project-specific rules and documentation

**Example:**

```yaml
---
name: "my-project"
toolkit: "./ai-toolkit-shared"
modules:
    - couchcms-core
    - tailwindcss
agents:
    - couchcms
    - tailwindcss
---

# Project Rules

Your custom coding standards go here...
```

**See:** [Config Files Guide](CONFIG-FILES.md) | [Glossary - Standards.md](GLOSSARY.md#standardsmd)

### Modules vs Agents

- **Modules:** Knowledge packages that teach AI about technologies
- **Agents:** Specialized AI assistants that use module knowledge

**Example:**
- Module: `tailwindcss` (provides TailwindCSS patterns)
- Agent: `tailwindcss` (AI assistant for TailwindCSS tasks)

**See:** [Glossary](GLOSSARY.md#module) | [Modules](MODULES.md) | [Agents](AGENTS.md)

### Context Directory (Rarely Needed)

**When you need it:**
- Your `standards.md` body exceeds 1000 lines
- You want to separate extensive documentation

**When you don't need it:**
- Typical project size (<1000 lines)
- Just getting started
- Simple to medium projects

**Recommendation:** Start with `standards.md` only. Add context directory only if needed later.

**See:** [Glossary - Context Directory](GLOSSARY.md#context-directory)

---

## Next Steps

After setup:

1. **Validate configuration:**
   ```bash
   bun ai-toolkit-shared/scripts/cli/validate.js
   ```

2. **Customize `.project/standards.md`** with your specific rules

3. **Re-sync after changes:**
   ```bash
   bun ai-toolkit-shared/scripts/cli/sync.js
   ```

4. **Reload your editor** to apply new configurations

---

## Updating the Toolkit

Keep the toolkit current:

```bash
# Update submodule
cd ai-toolkit-shared
git pull origin master
bun install  # Update dependencies if needed
cd ..

# Regenerate configurations
bun ai-toolkit-shared/scripts/cli/sync.js
```

**Upgrading from old format?** See [Migration Guide](MIGRATION.md)

---

## Common Questions

### Do I need Bun or Node.js?

Yes. The toolkit requires a JavaScript runtime:
- **Bun** (recommended): Faster, modern runtime
- **Node.js** v18+: Traditional option

### Why install dependencies in the submodule?

The toolkit has dependencies (`gray-matter`, `yaml`, `handlebars`) that must be installed. **Note:** Dependencies are now automatically installed when you run scripts.

### What's the difference between Simple and Advanced setup?

**Simple Creator:**
- Fast (2 minutes)
- Includes ALL CouchCMS modules/agents
- Perfect for beginners
- Customize later by editing `.project/standards.md`

**Advanced Init:**
- Full control over all options
- Choose exact modules/agents
- For experienced users

**Recommendation:** Start with Simple Creator.

**See:** [Setup Comparison](SETUP-COMPARISON.md)

### Why are all CouchCMS modules included?

This is a **CouchCMS AI Toolkit**, so all CouchCMS features are included by default for complete support. Frontend frameworks (TailwindCSS, Alpine.js, etc.) are optional and can be customized.

### What is the "framework" option?

The framework enables the **Autonomous Agent Prompting Framework (AAPF)** for structured AI agent workflows. It's optional and mainly useful for complex projects.

**Options:**
- `framework: false` - Disabled (default for Simple Creator)
- `framework: true` - Full framework
- Custom configuration - Select specific parts

**See:** [Glossary - Framework](GLOSSARY.md#framework-aapf)

### Can I change modules later?

Yes. Edit `.project/standards.md`, then run `bun ai-toolkit-shared/scripts/cli/sync.js`.

### Do I need to commit generated files?

Yes. Commit `.cursorrules`, `CLAUDE.md`, and `AGENTS.md` so all team members use the same configurations.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| **Skipping `bun install`** | Dependencies auto-install now, but if needed: `cd ai-toolkit-shared && bun install` |
| **Editing generated files** | Only edit `.project/standards.md`, then re-run sync |
| **Wrong directory** | Run commands from project root, not toolkit directory |
| **Invalid YAML** | Check error message for line number and fix suggestion |

**See:** [Troubleshooting](TROUBLESHOOTING.md) for more

---

## Troubleshooting

**Quick fixes:**
- Run `bun ai-toolkit-shared/scripts/cli/validate.js` to identify issues
- Check error messages - they now include specific solutions
- See [Troubleshooting Guide](TROUBLESHOOTING.md) for detailed help

---

## See Also

- [Quick Start](QUICK-START.md) - Fast setup for experienced users
- [Simple Setup](SIMPLE-SETUP.md) - Beginner-friendly wizard
- [Setup Comparison](SETUP-COMPARISON.md) - Compare setup methods
- [Config Files Guide](CONFIG-FILES.md) - Configuration details
- [Command Reference](COMMANDS.md) - All available commands
- [Glossary](GLOSSARY.md) - Technical terms explained
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

---

**Ready to start?** Choose [Quick Start](QUICK-START.md) for fast setup or continue here for detailed instructions.
