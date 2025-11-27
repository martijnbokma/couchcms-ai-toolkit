# Getting Started with CouchCMS AI Toolkit

Complete guide for setting up the toolkit in your project.

## ⚡ Prerequisites

Before you begin, ensure you have:

1. **Git** installed and configured
2. **Bun** (recommended) or **Node.js** (v18+) installed
   - Install Bun: `curl -fsSL https://bun.sh/install | bash`
   - Or use Node.js: Download from [nodejs.org](https://nodejs.org/)

:::caution[Important]
After adding the toolkit as a submodule, you **must** install its dependencies before running any scripts. The toolkit requires several npm packages (`gray-matter`, `yaml`, `handlebars`) that need to be installed first.
:::

## For Brand New Projects

Starting from scratch? Follow these steps:

### 1. Create Project Directory

```bash
mkdir my-couchcms-project
cd my-couchcms-project
```

### 2. Initialize Git

```bash
git init
```

### 3. Add Toolkit as Submodule

```bash
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

### 4. Install Toolkit Dependencies (REQUIRED!)

:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts. Without this step, the scripts will fail with module not found errors.
:::

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

This installs the required packages:
- `gray-matter` - Frontmatter parsing
- `yaml` - YAML configuration handling
- `handlebars` - Template rendering

### 5. Run Interactive Setup Wizard

```bash
bun ai-toolkit-shared/scripts/init.js
```

The wizard has two modes:

#### Simple Mode (Recommended for Beginners)

Choose option **1** when asked for setup mode. The wizard will:

1. ✅ Ask for **project name** and **description**
2. ✅ Use **recommended defaults** for everything else:
   - Configuration file: `.project/standards.md`
   - Modules: Standard preset (core + tailwindcss + alpinejs)
   - Agents: Standard preset (couchcms + tailwindcss + alpinejs)
   - No context directory (you can add one later if needed)

**Result:** You're done in 30 seconds! ✨

#### Custom Mode (Full Control)

Choose option **2** for full customization. The wizard will guide you through:

1. ✅ **Project name and description**
2. ✅ **Configuration file format** (standards.md recommended)
3. ✅ **Configuration file location** (.project/, docs/, or root)
4. ✅ **Toolkit location** (submodule or home directory)
5. ✅ **Module selection** with presets:
   - Minimal (only couchcms-core)
   - Standard (core + tailwindcss + alpinejs)
   - Full (all modules)
   - Custom (choose individually)
6. ✅ **AI agent selection** with presets:
   - Minimal (only couchcms)
   - Standard (couchcms + tailwindcss + alpinejs)
   - Full (all agents)
   - Custom (choose individually)
7. ✅ **Context directory** (optional - see explanation below)
8. ✅ **Automatic sync** (generates AI configurations)

### 6. What You Get

After the wizard completes, your project will have:

- ✅ `.project/standards.md` - Project configuration
- ✅ `.cursorrules` - Cursor AI configuration
- ✅ `CLAUDE.md` - Claude AI configuration
- ✅ `AGENT.md` - Universal AI agent documentation
- ✅ `.project/ai/context.md` - Project context (only if you chose this in Custom mode)

## For Existing Projects

Already have a project? Add the toolkit:

### 1. Navigate to Your Project

```bash
cd your-existing-project
```

### 2. Add Toolkit Submodule

```bash
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

### 3. Install Dependencies (REQUIRED!)

:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts.
:::

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

### 4. Run Setup Wizard

```bash
bun ai-toolkit-shared/scripts/init.js
```

**Note**: The wizard will detect if you already have a `standards.md` and ask if you want to overwrite it.

## Manual Setup (Advanced Users)

If you prefer manual configuration:

### 1. Add Toolkit

Choose one method:

**Option A: Git Submodule (Recommended)**

```bash
cd your-project
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
cd ai-toolkit-shared && bun install && cd ..
```

**Option B: Clone to Home Directory**

```bash
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git ~/couchcms-ai-toolkit
cd ~/couchcms-ai-toolkit && bun install
```

### 2. Create standards.md

Create `standards.md` in your project root (or `.project/standards.md` for recommended location):

```markdown
---
name: 'my-project'
description: 'Brief project description'
toolkit: './ai-toolkit-shared' # or "~/couchcms-ai-toolkit"

modules:
    - couchcms-core # Always included
    - tailwindcss # If using TailwindCSS
    - daisyui # If using daisyUI
    - alpinejs # If using Alpine.js
    - typescript # If using TypeScript
    - databound-forms # If using DataBound Forms

agents:
    - couchcms # Core CouchCMS development
    - databound-forms # Forms and CRUD operations
    - alpinejs # Alpine.js development
    - tailwindcss # TailwindCSS styling
    - typescript # TypeScript development

# Optional: Enable AAPF framework for disciplined AI agent behavior
framework: true  # or configure specific categories:
# framework:
#   doctrine: true      # Core principles (always active)
#   directives: true    # Communication guidelines (always active)
#   playbooks: true     # Workflow templates (optional)
#   enhancements: true  # Advanced features (optional)

context: '.project/ai' # Optional: separate context file
---

# Project-Specific Rules

Add your project-specific coding standards here...
```

### 3. Understanding Configuration Files

:::tip[Quick Reference]
For a complete guide to configuration files, see [CONFIG-FILES.md](CONFIG-FILES.md).
:::

The toolkit uses **one primary file** for configuration and rules:

#### `.project/standards.md` (Primary Configuration File)

This is your **single source of truth** for everything:

```markdown
---
# YAML Frontmatter - Configuration
name: 'my-project'
toolkit: './ai-toolkit-shared'
modules: [...]
agents: [...]
---

# Markdown Body - Project Rules & Documentation

## Project Rules
[Your coding standards...]

## Architecture
[Project structure...]

## Patterns
[Common patterns...]
```

**Structure:**
- **YAML frontmatter**: Configuration (modules, agents, paths, etc.)
- **Markdown body**: All your project rules and documentation

**This is all you need for 95% of projects!**

#### `.project/ai/context.md` (Optional - Rarely Needed)

:::caution[When to Use Context Directory]
Only use `.project/ai/context.md` if:
- Your `standards.md` body exceeds **>1000 lines**
- You want to separate configuration from extensive documentation
- You're working in a large team with extensive shared context

**For most projects, just use `standards.md` - no context directory needed!**
:::

If you do need it (very rare), create `.project/ai/context.md`:

```bash
mkdir -p .project/ai
```

```markdown
---
name: My Project Context
---

# Extensive Project Documentation

[Only for >1000 lines of documentation...]
```

**Note:** The context directory is only available in Custom mode and defaults to "no" (not needed for most projects).

### 4. Run Sync

Generate AI configurations:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

This creates:

- `.cursorrules`
- `CLAUDE.md`
- `AGENT.md`
- `.github/copilot-instructions.md`
- `.cursor/rules/*.mdc`

## Next Steps

After setup:

1. **Validate your configuration**

    ```bash
    bun ai-toolkit-shared/scripts/validate.js
    ```

2. **Customize standards.md** with your specific rules

3. **Add detailed context** (if using `.project/ai/context.md`)

4. **Re-sync after changes**
    ```bash
    bun ai-toolkit-shared/scripts/sync.js
    ```

## Updating the Toolkit

Keep the toolkit up to date:

```bash
# If using submodule
cd ai-toolkit-shared
git pull origin master
bun install  # Update dependencies if needed
cd ..

# Regenerate configurations
bun ai-toolkit-shared/scripts/sync.js
```

## Common Questions

### Q: Do I need to install Bun or Node.js?

Yes! The toolkit scripts require a JavaScript runtime. You can use either:
- **Bun** (recommended): Faster, modern runtime
- **Node.js** (v18+): Traditional option, works with `npm install`

### Q: Why do I need to run `bun install` in the submodule?

The toolkit has its own dependencies (`gray-matter`, `yaml`, `handlebars`) that must be installed before the scripts can run. Without these packages, you'll get "module not found" errors.

### Q: What's the difference between Simple and Custom mode?

**Simple mode:**
- Fast setup (30 seconds)
- Uses recommended defaults
- Perfect for beginners
- You can always customize later by editing `.project/standards.md`

**Custom mode:**
- Full control over all options
- Choose exact modules and agents
- Select configuration file location
- Optional context directory

**Recommendation:** Start with Simple mode, then customize as needed.

### Q: What is a "context directory" and when do I need it?

The context directory (`.project/ai/context.md`) is **rarely needed**. It's only for extensive project documentation (>1000 lines).

**You need it when:**
- Your `standards.md` body exceeds 1000 lines
- You want to separate configuration from extensive documentation
- You're working in a large team with extensive shared context

**You don't need it when:**
- Your project is typical size (<1000 lines of rules)
- You're just getting started
- You have a simple to medium-sized project

**Recommendation:** Start with only `standards.md`. Add `context.md` only if your `standards.md` becomes very large (>1000 lines).

### Q: What is the "framework" option in standards.md?

The `framework` option enables the **Autonomous Agent Prompting Framework (AAPF)**, which provides disciplined, evidence-first operational principles for AI agents.

**When to enable:**
- ✅ You want structured, systematic AI agent workflows
- ✅ You need autonomous problem-solving with verification
- ✅ You prefer evidence-based decision making
- ✅ You want playbooks for complex tasks (feature development, bug fixing, retrospectives)

**Configuration options:**

```yaml
# Minimal: Only core principles + communication guidelines
framework:
  doctrine: true
  directives: true

# Standard: Include workflow playbooks
framework:
  doctrine: true
  directives: true
  playbooks: true

# Full: Everything including advanced features
framework: true
```

**See Also:**
- [Framework README](../framework/README.md) - Complete framework documentation
- [Available Modules](MODULES.md#ai-agent-framework-optional) - Framework details

### Q: Can I use both a submodule and home directory installation?

No, choose one method per project. The submodule method is recommended for better version control.

### Q: What if I want to change modules later?

Edit `.project/standards.md`, then run `bun ai-toolkit-shared/scripts/sync.js` to regenerate configurations.

### Q: Can I have multiple projects using the same toolkit?

Yes! Each project can have its own configuration file while sharing the same toolkit installation.

### Q: Do I need to commit the generated files?

Yes, commit `.cursorrules`, `CLAUDE.md`, and `AGENT.md` to your repository so all team members use the same AI configurations.

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed troubleshooting guide.

## See Also

- [Command Reference](COMMANDS.md)
- [Configuration Guide](CONFIG-FILES.md)
- [Available Modules](MODULES.md)
- [Available Agents](AGENTS.md)
- [Project Rules Guide](PROJECT-RULES.md) - Cursor Project Rules
- [User Rules Guide](USER-RULES.md) - Cursor User Rules
- [Custom Commands Guide](CUSTOM-COMMANDS.md) - Cursor Custom Commands
