# Getting Started with CouchCMS AI Toolkit

Complete guide for setting up the toolkit in your project.

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

### 4. Install Toolkit Dependencies

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

### 5. Run Interactive Setup Wizard

```bash
bun ai-toolkit-shared/scripts/init.js
```

The wizard will guide you through:

1. ✅ **Project name and description**
2. ✅ **Module selection** (TailwindCSS, Alpine.js, TypeScript, etc.)
3. ✅ **AI agent selection** (CouchCMS, Forms, Styling agents)
4. ✅ **Toolkit location** (submodule or home directory)
5. ✅ **Context directory** (optional detailed documentation)
6. ✅ **Automatic sync** (generates AI configurations)

### 6. What You Get

After the wizard completes, your project will have:

- ✅ `project.md` - Project configuration
- ✅ `.cursorrules` - Cursor AI configuration
- ✅ `CLAUDE.md` - Claude AI configuration
- ✅ `AGENT.md` - Universal AI agent documentation
- ✅ `.project/ai/context.md` - Project context (if you chose this)

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

### 3. Install Dependencies

```bash
cd ai-toolkit-shared
bun install
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

You have two options:

#### Option A: Simple (< 200 lines)

Keep everything in `project.md`:

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

#### Option B: Split (> 200 lines)

Keep `project.md` short, create `.project/ai/context.md`:

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

### Q: Can I use both a submodule and home directory installation?

No, choose one method per project. The submodule method is recommended for better version control.

### Q: What if I want to change modules later?

Edit `project.md`, then run `bun ai-toolkit-shared/scripts/sync.js` to regenerate configurations.

### Q: Can I have multiple projects using the same toolkit?

Yes! Each project can have its own `project.md` configuration while sharing the same toolkit installation.

### Q: Do I need to commit the generated files?

Yes, commit `.cursorrules`, `CLAUDE.md`, and `AGENT.md` to your repository so all team members use the same AI configurations.

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed troubleshooting guide.

## See Also

- [Command Reference](COMMANDS.md)
- [Configuration Options](CONFIGURATION.md)
- [Available Modules](MODULES.md)
- [Available Agents](AGENTS.md)
