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

- ✅ `.project/standards.md` (or `project.md` in legacy mode) - Project configuration
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

**Note**: The wizard will detect if you already have a `project.md` and ask if you want to overwrite it.

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

### 2. Create project.md

Create `project.md` in your project root:

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

context: '.project/ai' # Optional: separate context file
---

# Project-Specific Rules

Add your project-specific coding standards here...
```

### 3. Add Project Context (Optional)

:::tip[When to Use Context Directory]
Use `.project/ai/context.md` when:
- Your project has **>200 lines** of custom rules
- You want to **separate** configuration from detailed documentation
- You're working in a **team** and need shared context
- You have **extensive** code examples and patterns

For simple projects, just add rules directly to `standards.md` - no context directory needed!
:::

You have two options:

#### Option A: Simple (< 200 lines) - Recommended

Keep everything in `standards.md`:

```markdown
---
# ... config above ...
---

# Project Rules

## Content Types

- Films: Single video projects
- Series: Multi-episode content

## Architecture

- TailwindCSS + daisyUI
- Alpine.js for interactivity

## Code Examples

[Your examples here]
```

**This is the recommended approach for most projects.**

#### Option B: Split (> 200 lines)

Keep `standards.md` short, create `.project/ai/context.md`:

```bash
mkdir -p .project/ai
```

Create `.project/ai/context.md`:

```markdown
---
name: My Project Context
---

# Detailed Project Context

## Content Architecture

[Extensive details...]

## Code Patterns

[Many examples...]

## Component Library

[Detailed documentation...]
```

**Note:** The context directory is automatically created if you choose it in Custom mode, or you can create it manually later.

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

2. **Customize project.md** with your specific rules

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

The context directory (`.project/ai/context.md`) is for **detailed project documentation** that's too long for `standards.md`.

**You need it when:**
- You have >200 lines of custom rules
- You want to separate config from detailed docs
- You're working in a team

**You don't need it when:**
- Your project is simple
- You have <200 lines of rules
- You're just getting started

**Tip:** Start without it, add it later if needed.

### Q: Can I use both a submodule and home directory installation?

No, choose one method per project. The submodule method is recommended for better version control.

### Q: What if I want to change modules later?

Edit `.project/standards.md` (or `project.md`), then run `bun ai-toolkit-shared/scripts/sync.js` to regenerate configurations.

### Q: Can I have multiple projects using the same toolkit?

Yes! Each project can have its own configuration file while sharing the same toolkit installation.

### Q: Do I need to commit the generated files?

Yes, commit `.cursorrules`, `CLAUDE.md`, and `AGENT.md` to your repository so all team members use the same AI configurations.

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed troubleshooting guide.

## See Also

- [Command Reference](COMMANDS.md)
- [Configuration Options](CONFIGURATION.md)
- [Available Modules](MODULES.md)
- [Available Agents](AGENTS.md)
