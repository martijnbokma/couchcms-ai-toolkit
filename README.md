# CouchCMS AI Toolkit

Universal AI Development Toolkit for CouchCMS Projects.

## Overview

This toolkit provides consistent AI assistance across all your CouchCMS projects. It includes:

- **Modules**: Reusable knowledge modules (CouchCMS, TailwindCSS, Alpine.js, etc.)
- **Agents**: Specialized AI agents for daily development tasks
- **Templates**: Editor configuration templates
- **Scripts**: Sync and validation scripts

## Quick Start

### Starting from Scratch (Brand New Project)

If you're starting a completely new project:

```bash
# 1. Create your project directory
mkdir my-couchcms-project
cd my-couchcms-project

# 2. Initialize git (if not done yet)
git init

# 3. Add the toolkit as a submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 4. Install toolkit dependencies
cd ai-toolkit-shared
bun install  # or: npm install
cd ..

# 5. Run the interactive setup wizard
bun ai-toolkit-shared/scripts/init.js
```

**What the wizard does:**

1. ✅ Asks for project name and description
2. ✅ Lets you choose which modules to use (TailwindCSS, Alpine.js, etc.)
3. ✅ Lets you select relevant AI agents
4. ✅ **Automatically creates `project.md`** with your choices
5. ✅ Optionally creates `.project/ai/context.md` for detailed documentation
6. ✅ Runs initial sync to generate AI configs

**Result:** You'll have a fully configured project with:

- ✅ `project.md` - Your project configuration
- ✅ `.cursorrules` - Cursor AI configuration
- ✅ `CLAUDE.md` - Claude AI configuration
- ✅ `AGENT.md` - Universal AI agent docs
- ✅ `.project/ai/context.md` - Project context (if you chose this option)

### Adding Toolkit to Existing Project

If you already have a project:

```bash
# 1. Navigate to your project
cd your-existing-project

# 2. Add toolkit as submodule
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# 3. Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# 4. Run setup wizard
bun ai-toolkit-shared/scripts/init.js
```

The wizard will detect if you already have a `project.md` and ask if you want to overwrite it.

### Manual Setup (Advanced)

#### 1. Add to Your Project

**Option A: Git Submodule (Recommended)**

```bash
cd your-project
git submodule add https://github.com/your-user/couchcms-ai-toolkit.git ai-toolkit
```

**Option B: Clone Separately**

```bash
# Clone toolkit
git clone https://github.com/your-user/couchcms-ai-toolkit.git ~/couchcms-ai-toolkit

# In your project, reference it in project.md
```

#### 2. Create Project Configuration

Create `project.md` in your project root:

```markdown
---
name: 'my-project'
description: 'Description of your project'

toolkit: './ai-toolkit' # or "~/couchcms-ai-toolkit" if cloned separately

modules:
    - couchcms-core # Always included automatically
    - tailwindcss # If using TailwindCSS
    - daisyui # If using daisyUI
    - alpinejs # If using Alpine.js
    - typescript # If using TypeScript
    - databound-forms # If using DataBound Forms

agents:
    - couchcms-agent # Daily CouchCMS development
    - safety-checker # HTML comment security

context: '.project/ai' # Project-specific context directory
---

# Project-Specific Rules

Add any project-specific instructions here...
```

### 3. Add Project Context (Optional but Recommended)

You have two options for project-specific information:

#### Option A: Keep It Simple (Recommended for most projects)

Just use `project.md` for everything:

```markdown
---
name: 'my-project'
description: 'Description'
toolkit: './ai-toolkit'
modules: [couchcms-core, tailwindcss]
agents: [couchcms]
---

# Project-Specific Rules

## Content Types

- Films: Single video projects
- Series: Multi-episode content

## Architecture

- TailwindCSS + daisyUI for styling
- Alpine.js for interactivity

## Code Examples

[Add examples here as needed]
```

**Use this when**: You have < 200 lines of project-specific info.

#### Option B: Separate Detailed Context (For larger projects)

Keep `project.md` short (~50 lines), move detailed context to `.project/ai/context.md`:

**project.md** (configuration only):

```markdown
---
name: 'my-project'
description: 'Description'
toolkit: './ai-toolkit'
modules: [couchcms-core, tailwindcss]
agents: [couchcms]
context: '.project/ai' # Reference to detailed context
---

# Core Project Rules

- English only
- Use semantic colors
- Validate ownership
```

**<br>.project/ai/context.md** (detailed examples):

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

**Use this when**:

- You have > 200 lines of project-specific information
- You want to keep configuration (project.md) separate from documentation
- Multiple team members need extensive context

**Which Should You Use?**

- **Small/Medium projects**: Use Option A (just project.md)
- **Large/Complex projects**: Use Option B (separate context file)
- **Not sure?** Start with Option A, split later if needed

### 4. Generate Editor Configurations

```bash
# If toolkit is submodule
bun ai-toolkit/scripts/sync.js

# If toolkit is in home directory
bun ~/couchcms-ai-toolkit/scripts/sync.js
```

This generates:

- `.cursorrules` - Cursor AI configuration
- `CLAUDE.md` - Claude configuration
- `.github/copilot-instructions.md` - GitHub Copilot configuration

## Available Modules

| Module            | Description                                 |
| ----------------- | ------------------------------------------- |
| `couchcms-core`   | Core CouchCMS patterns, templates, security |
| `tailwindcss`     | TailwindCSS 4 patterns and best practices   |
| `daisyui`         | daisyUI 5 components and theming            |
| `alpinejs`        | Alpine.js patterns, CouchCMS integration    |
| `typescript`      | TypeScript standards and patterns           |
| `databound-forms` | DataBound Forms implementation              |

## Available Agents

Combined agents with Quick Reference + Deep Dive sections:

| Agent             | Description                          |
| ----------------- | ------------------------------------ |
| `couchcms`        | Core CouchCMS templates, patterns    |
| `databound-forms` | Forms, CRUD, validation, security    |
| `alpinejs`        | Alpine.js + CouchCMS integration     |
| `tailwindcss`     | TailwindCSS 4 + daisyUI 5 styling    |
| `typescript`      | TypeScript standards and patterns    |
| `custom-routes`   | Clean URLs and routing               |
| `mysql`           | Database operations and optimization |
| `bun`             | Bun runtime and build tooling        |
| `git`             | Version control and workflow         |

## Auto-Loading Rules

Cursor rules that auto-load based on file type:

| Rule                      | Triggers On                   |
| ------------------------- | ----------------------------- |
| `refactor-html.mdc`       | `snippets/**/*.html`, `*.php` |
| `refactor-typescript.mdc` | `assets/ts/**/*.ts`           |
| `refactor-css.mdc`        | `assets/css/**/*.css`         |
| `refactor-forms.mdc`      | `snippets/forms/**/*.html`    |

## Prompts Library

Reusable prompts for common tasks:

| Directory         | Contents                                 |
| ----------------- | ---------------------------------------- |
| `best-practices/` | Claude, JavaScript, TypeScript, security |
| `debugging/`      | Alpine.js, CouchCMS troubleshooting      |
| `validators/`     | Design, links, responsive, standards     |
| `refactoring/`    | Design/functionality preserving          |

## Project Structure

```
couchcms-ai-toolkit/
├── modules/              # Knowledge modules
│   ├── couchcms-core.md
│   ├── tailwindcss.md
│   ├── daisyui.md
│   ├── alpinejs.md
│   ├── typescript.md
│   └── databound-forms.md
├── agents/               # Combined agents (Quick + Deep)
│   ├── alpinejs.md
│   ├── couchcms.md
│   ├── databound-forms.md
│   ├── tailwindcss.md
│   ├── typescript.md
│   └── ...
├── rules/                # Auto-loading Cursor rules
│   ├── refactor-html.mdc
│   ├── refactor-typescript.mdc
│   ├── refactor-css.mdc
│   └── refactor-forms.mdc
├── prompts/              # Reusable AI prompts
│   ├── best-practices/   # Claude, JS, TS, security
│   ├── debugging/        # Troubleshooting guides
│   ├── validators/       # Code validation
│   └── refactoring/      # Refactoring patterns
├── framework/            # AI prompting framework (AAPF)
├── scripts/              # Automation scripts
│   ├── sync.js           # Generate editor configs
│   ├── validate.js       # Validate project setup
│   └── init.js           # Interactive setup wizard
├── templates/            # Project templates
│   ├── project.md        # Project config template
│   └── agent-template.md # Agent template
├── defaults.yaml         # Default path configuration
├── CHANGELOG.md          # Version history
└── package.json          # Dependencies & scripts
```

## Your Project Structure

```
your-project/
├── ai-toolkit-shared/    # Submodule (universal)
├── .project/ai/          # Project-specific context
│   └── context.md        # Detailed project info
├── project.md            # Project configuration
├── .cursorrules          # Generated (don't edit)
├── CLAUDE.md             # Generated (don't edit)
└── AGENT.md              # Generated (don't edit)
```

## Commands

```bash
# Interactive setup wizard for new projects
bun run init

# Validate project configuration and compliance
bun run validate

# Generate/update editor configurations
bun run sync
```

### Command Details

#### `bun run init`

Interactive setup wizard that guides you through:

- Project name and description
- Module selection (with descriptions)
- Agent selection (with descriptions)
- Toolkit installation method (submodule vs home directory)
- Context directory creation
- Automatic first sync

Perfect for new projects or when adding the toolkit to an existing project.

#### `bun run validate`

Validates your project setup:

- Checks `project.md` syntax and YAML frontmatter
- Verifies all referenced modules exist
- Confirms all referenced agents exist
- Validates toolkit path configuration
- Checks generated files (.cursorrules, CLAUDE.md, AGENT.md)
- Verifies custom path configurations
- **Provides compliance score (0-100%)**

Run this after making changes to `project.md` or when troubleshooting issues.

Example output:

```bash
🔍 CouchCMS AI Toolkit - Validation

📄 Found: project.md
🛠️  Toolkit: ./ai-toolkit-shared
📚 Modules: couchcms-core, tailwindcss, daisyui
🤖 Agents: couchcms, databound-forms


📊 Compliance Score: 100/100 (100%)

✅ Validation passed - All checks OK!
```

#### `bun run sync`

Generates AI configuration files:

- `.cursorrules` - Cursor AI rules
- `CLAUDE.md` - Claude AI rules
- `AGENT.md` - Universal AI agent documentation
- `.github/copilot-instructions.md` - GitHub Copilot rules
- `.cursor/rules/*.mdc` - Auto-loading Cursor rules

Run this after:

- Updating `project.md`
- Changing modules or agents
- Updating toolkit (git pull)
- Modifying project context

**New in v1.1.0**: Enhanced error handling with helpful troubleshooting messages.

## Dependencies

The toolkit requires a few Node.js dependencies for the automation scripts. These are **not** committed to the repository.

### First-Time Setup

After cloning or adding the submodule:

```bash
cd ai-toolkit-shared  # or ~/couchcms-ai-toolkit
bun install  # or: npm install
```

This installs:

- `gray-matter` - YAML frontmatter parsing
- `js-yaml` - YAML processing

### Important Notes

- `node_modules/` is **gitignored** and should never be committed
- Dependencies are lightweight (~2MB)
- Only needed for running `sync`, `validate`, and `init` scripts
- Your project doesn't need these dependencies

## Updating

```bash
# If using submodule
cd ai-toolkit
git pull origin main
bun install  # Update dependencies if needed
cd ..
bun run sync

# If cloned separately
cd ~/couchcms-ai-toolkit
git pull origin main
bun install  # Update dependencies if needed
```

After updating, always run:

```bash
bun run validate  # Check for any issues
bun run sync      # Regenerate configurations
```

See [CHANGELOG.md](CHANGELOG.md) for version history and upgrade notes.

## Customization

### Override Module Settings

In your `project.md`:

```yaml
overrides:
    indentation: 2 # Override default 4-space indentation
    language: 'dutch' # Allow Dutch comments (not recommended)
```

### Disable Modules

Simply don't include them in your `modules:` list.

### Add Project-Specific Rules

Add Markdown content after the frontmatter in `project.md`:

```markdown
---
# ... config ...
---

# Project-Specific Rules

## Client Requirements

- Logo must always be in top-left corner
- Use corporate colors: #003366, #FF6600

## Technical Decisions

- No TypeScript for this project
- All forms via DataBound Forms
```

## Contributing

We welcome contributions! Here's how you can help improve the toolkit:

### Adding a New Module

1. **Create the module file** in `modules/`:

    ```bash
    touch modules/my-module.md
    ```

2. **Use the standard frontmatter**:

    ```markdown
    ---
    id: my-module
    name: 'My Module'
    version: '1.0'
    description: 'Brief description of what this module covers'
    required: false
    requires: [] # Other modules this depends on
    conflicts: [] # Modules that can't be used together
    ---

    # My Module Standards

    ## Overview

    Explain what this module is for...

    ## Patterns

    Show code examples...

    ## Best Practices

    List dos and don'ts...
    ```

3. **Test your module**:

    ```bash
    # Add to a project.md and run sync
    bun scripts/sync.js
    ```

4. **Submit a pull request**

### Improving Existing Modules

1. Fork the repository
2. Make your changes
3. Test with `bun scripts/sync.js`
4. Submit a pull request with:
    - What you changed
    - Why it's an improvement
    - Any breaking changes

### Module Guidelines

- **Be concise**: AI context windows are limited
- **Include examples**: Show working code, not just theory
- **Mark critical rules**: Use 🚨 for important warnings
- **Stay current**: Update version numbers when frameworks change
- **Test thoroughly**: Ensure sync works after changes

### Reporting Issues

Open an issue with:

- Description of the problem
- Which module is affected
- Steps to reproduce
- Expected vs actual behavior

### Development Setup

```bash
# Clone the repo
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git
cd couchcms-ai-toolkit

# Install dependencies
bun install

# Test sync script
bun scripts/sync.js
```

## Troubleshooting

### Validation Fails

If `bun run validate` shows errors:

1. **Check `project.md` syntax**

    ```bash
    # Ensure valid YAML frontmatter
    # Check for missing quotes, commas, etc.
    ```

2. **Verify toolkit path**

    ```yaml
    # In project.md, ensure toolkit path is correct:
    toolkit: "./ai-toolkit-shared"  # Submodule
    # or
    toolkit: "~/couchcms-ai-toolkit"  # Home directory
    ```

3. **Check module names**

    ```yaml
    # Module names must match exactly:
    modules:
        - couchcms-core # ✅ Correct
        - couchcms # ❌ Wrong
        - tailwindcss # ✅ Correct
        - tailwind # ❌ Wrong
    ```

4. **Run with debug output**
    ```bash
    bun ai-toolkit-shared/scripts/validate.js
    # Shows detailed error messages
    ```

### Sync Fails

If `bun run sync` encounters errors:

1. **Run validation first**

    ```bash
    bun run validate
    # Fix any errors before syncing
    ```

2. **Check file permissions**

    ```bash
    # Ensure you can write to project directory
    ls -la .cursorrules CLAUDE.md AGENT.md
    ```

3. **Verify toolkit structure**
    ```bash
    ls ai-toolkit-shared/modules/
    ls ai-toolkit-shared/agents/
    # Ensure all expected files exist
    ```

### Common Issues

**"Module not found" warnings**

- Double-check module names in `project.md`
- Ensure toolkit is up to date: `git pull`

**"Toolkit path not found" error**

- Verify the `toolkit` path in `project.md`
- For submodules: `./ai-toolkit-shared`
- For home directory: `~/couchcms-ai-toolkit`

**Generated files not updating**

- Delete generated files and re-run sync
- Check if you're editing generated files (don't edit them directly!)

**Compliance score < 100%**

- Review warnings in validation output
- Fix any missing modules or paths
- Re-run validation after fixes

### Getting Help

1. Run validation for detailed diagnostics
2. Check [CHANGELOG.md](CHANGELOG.md) for breaking changes
3. Review error messages carefully - they include troubleshooting hints
4. Open an issue with validation output and error messages

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and upgrade guides.

**Current Version**: 1.1.0

### What's New in 1.1.0

- ✅ **Interactive setup wizard** (`bun run init`)
- ✅ **Project validation** (`bun run validate`)
- ✅ **Enhanced error handling** in sync script
- ✅ **CHANGELOG.md** for version tracking
- ✅ **Better troubleshooting** messages

[See full changelog](CHANGELOG.md)

## License

MIT
