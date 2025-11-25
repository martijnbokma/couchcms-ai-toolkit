# CouchCMS AI Toolkit

Universal AI Development Toolkit for CouchCMS Projects.

## Overview

This toolkit provides consistent AI assistance across all your CouchCMS projects. It includes:

- **Modules**: Reusable knowledge modules (CouchCMS, TailwindCSS, Alpine.js, etc.)
- **Agents**: Specialized AI agents for daily development tasks
- **Templates**: Editor configuration templates
- **Scripts**: Sync and validation scripts

## Quick Start

### 1. Add to Your Project

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

### 2. Create Project Configuration

Create `project.md` in your project root:

```markdown
---
name: "my-project"
description: "Description of your project"

toolkit: "./ai-toolkit"  # or "~/couchcms-ai-toolkit" if cloned separately

modules:
  - couchcms-core      # Always include
  - tailwindcss        # If using TailwindCSS
  - daisyui            # If using daisyUI
  - alpinejs           # If using Alpine.js
  - typescript         # If using TypeScript
  - databound-forms    # If using DataBound Forms
---

# Project-Specific Rules

Add any project-specific instructions here...
```

### 3. Generate Editor Configurations

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

| Module | Description |
|--------|-------------|
| `couchcms-core` | Core CouchCMS patterns, templates, security |
| `tailwindcss` | TailwindCSS 4 patterns and best practices |
| `daisyui` | daisyUI 5 components and theming |
| `alpinejs` | Alpine.js patterns, CouchCMS integration |
| `typescript` | TypeScript standards and patterns |
| `databound-forms` | DataBound Forms implementation |

## Project Structure

```
couchcms-ai-toolkit/
├── modules/           # Knowledge modules
│   ├── couchcms-core.md
│   ├── tailwindcss.md
│   ├── daisyui.md
│   ├── alpinejs.md
│   ├── typescript.md
│   └── databound-forms.md
├── agents/            # Specialized agents
├── templates/         # Editor config templates
├── scripts/           # Build scripts
│   ├── sync.js        # Generate editor configs
│   ├── validate.js    # Validate project compliance
│   └── init.js        # Initialize new project
└── package.json
```

## Commands

```bash
# Generate editor configurations
bun run sync

# Validate project compliance (TODO)
bun run validate

# Initialize new project (TODO)
bun run init
```

## Updating

```bash
# If using submodule
cd ai-toolkit
git pull origin main
cd ..
bun ai-toolkit/scripts/sync.js

# If cloned separately
cd ~/couchcms-ai-toolkit
git pull origin main
```

## Customization

### Override Module Settings

In your `project.md`:

```yaml
overrides:
  indentation: 2        # Override default 4-space indentation
  language: "dutch"     # Allow Dutch comments (not recommended)
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
   name: "My Module"
   version: "1.0"
   description: "Brief description of what this module covers"
   required: false
   requires: []           # Other modules this depends on
   conflicts: []          # Modules that can't be used together
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

## License

MIT
