# Command Reference

Complete reference for all toolkit commands.

## Overview

The toolkit provides three main commands:

| Command    | Purpose                                     |
| ---------- | ------------------------------------------- |
| `init`     | Interactive setup wizard for new projects   |
| `validate` | Validate project configuration & compliance |
| `sync`     | Generate/update AI configuration files      |

## bun run init

Interactive setup wizard that guides you through initial project configuration.

### Usage

```bash
# From your project root
bun ai-toolkit-shared/scripts/init.js
```

### What It Does

The wizard will:

1. **Check for existing configuration**
    - Detects if `standards.md` already exists
    - Asks if you want to overwrite (defaults to No)

2. **Gather project information**
    - Project name
    - Project description

3. **Configure toolkit location**
    - Option 1: Git submodule (recommended)
    - Option 2: Home directory clone

4. **Select modules**
    - Shows all available modules with descriptions
    - `couchcms-core` is always included
    - Interactive yes/no for each optional module

5. **Select AI agents**
    - Shows all available agents with descriptions
    - Interactive yes/no for each agent

6. **Create context directory** (optional)
    - Asks if you want `.project/ai/` for detailed context
    - Creates directory and template `context.md` if yes

7. **Generate project.md**
    - Creates fully configured `project.md`
    - Includes all your selections

8. **Run initial sync**
    - Automatically generates AI configurations
    - Creates `.cursorrules`, `CLAUDE.md`, `AGENT.md`, etc.

### Example Session

```bash
$ bun ai-toolkit-shared/scripts/init.js

🚀 CouchCMS AI Toolkit - Interactive Setup

Let's set up your project configuration...

Project name [my-project]: matters-student-hub
Project description [My CouchCMS project]: Student portfolio platform

📦 How do you want to use the toolkit?
  1. As a git submodule (recommended)
  2. Cloned in home directory
Choice [1-2] [1]: 1

📚 Select modules to include:
   ✓ couchcms-core - Core CouchCMS patterns (always included)
   Include tailwindcss? (TailwindCSS 4 patterns) [Y/n]: y
   Include daisyui? (daisyUI 5 components) [Y/n]: y
   Include alpinejs? (Alpine.js integration) [Y/n]: y
   Include typescript? (TypeScript standards) [Y/n]: y
   Include databound-forms? (DataBound Forms) [Y/n]: y

🤖 Select AI agents to include:
   Include couchcms? (Core CouchCMS development) [Y/n]: y
   Include databound-forms? (Forms and CRUD) [Y/n]: y
   Include alpinejs? (Alpine.js development) [Y/n]: y
   Include tailwindcss? (TailwindCSS styling) [Y/n]: y
   Include typescript? (TypeScript development) [Y/n]: y

📋 Create project context directory? [Y/n]: y

📝 Generating project.md...
✅ Created: project.md
✅ Created: .project/ai/
✅ Created: .project/ai/context.md

🔄 Running initial sync...

✨ Setup complete!

Next steps:

  1. Review and customize project.md
  2. Add project-specific details to .project/ai/context.md
  3. Run "bun run sync" to generate AI configurations
  4. Run "bun run validate" to check setup

Happy coding! 🎉
```

### Options

The wizard is fully interactive - no command-line flags needed.

### When to Use

- Setting up a brand new project
- Adding toolkit to an existing project
- Recreating configuration after corruption

### Notes

- Safe to run multiple times (asks before overwriting)
- Creates all necessary directories automatically
- Runs sync automatically at the end

---

## bun run validate

Validates your project configuration and checks compliance with toolkit standards.

### Usage

```bash
# From your project root
bun ai-toolkit-shared/scripts/validate.js
```

### What It Checks

1. **Configuration File Existence**
    - Checks if `standards.md` exists
    - Validates file is readable

2. **YAML Frontmatter**
    - Validates YAML syntax
    - Checks required fields (`name`, `toolkit`, `modules`)

3. **Toolkit Path**
    - Verifies toolkit directory exists
    - Checks if path is accessible

4. **Module References**
    - Validates all modules exist in toolkit
    - Warns about non-existent modules
    - Confirms `couchcms-core` is included

5. **Agent References**
    - Validates all agents exist in toolkit
    - Warns about non-existent agents

6. **Generated Files**
    - Checks if `.cursorrules` exists
    - Checks if `CLAUDE.md` exists
    - Checks if `AGENT.md` exists
    - Warns if files are missing

7. **Custom Paths** (if configured)
    - Validates custom path configurations
    - Checks if directories exist

### Output Examples

#### Successful Validation

```bash
$ bun ai-toolkit-shared/scripts/validate.js

🔍 CouchCMS AI Toolkit - Validation

📄 Found: .project/standards.md
🛠️  Toolkit: ./ai-toolkit-shared
📚 Modules: couchcms-core, tailwindcss, daisyui, alpinejs, typescript
🤖 Agents: couchcms, databound-forms, alpinejs, tailwindcss


📊 Compliance Score: 100/100 (100%)

✅ Validation passed - All checks OK!
```

#### Validation with Warnings

```bash
$ bun ai-toolkit-shared/scripts/validate.js

🔍 CouchCMS AI Toolkit - Validation

📄 Found: project.md
🛠️  Toolkit: ./ai-toolkit-shared
📚 Modules: couchcms-core, tailwindcss, vue
🤖 Agents: couchcms, nonexistent-agent

⚠️  Warnings:
  - Module 'vue' not found in toolkit
  - Agent 'nonexistent-agent' not found in toolkit
  - Generated file '.cursorrules' not found (run sync)

📊 Compliance Score: 70/100 (70%)

⚠️  Validation passed with warnings
```

#### Validation Failure

```bash
$ bun ai-toolkit-shared/scripts/validate.js

🔍 CouchCMS AI Toolkit - Validation

❌ Error: No configuration file found

Create a standards.md file to use the toolkit.
💡 Tip: Use .project/standards.md for the recommended location.
```

### Compliance Score

The validation provides a compliance score (0-100%):

- **100%**: Perfect configuration, no issues
- **80-99%**: Minor warnings (missing generated files, etc.)
- **60-79%**: Some invalid references
- **< 60%**: Major configuration issues

### When to Use

- After creating or modifying `standards.md`
- Before committing configuration changes
- When troubleshooting AI configuration issues
- As part of CI/CD pipeline
- When setting up on a new machine

### Exit Codes

- `0`: Validation passed (with or without warnings)
- `1`: Validation failed (critical errors)

### Troubleshooting Tips

If validation fails:

1. **Check YAML syntax**

    ```bash
    # Look for missing quotes, colons, indentation
    cat project.md
    ```

2. **Verify module names**

    ```bash
    # List available modules
    ls ai-toolkit-shared/modules/
    ```

3. **Check toolkit path**

    ```bash
    # Should exist and be accessible
    ls ai-toolkit-shared/
    ```

4. **Run sync to generate files**
    ```bash
    bun ai-toolkit-shared/scripts/sync.js
    ```

---

## bun run sync

Generates AI configuration files from your `project.md` and toolkit modules.

### Usage

```bash
# From your project root
bun ai-toolkit-shared/scripts/sync.js
```

### What It Generates

1. **`.cursorrules`**
    - Cursor AI assistant configuration
    - Combines modules, agents, and project rules
    - Auto-generated (do not edit manually)

2. **`CLAUDE.md`**
    - Claude AI assistant configuration
    - Same content as `.cursorrules` in markdown format
    - For Claude Desktop or API usage

3. **`AGENT.md`**
    - Universal AI agent documentation
    - Platform-agnostic reference
    - Can be used with any AI assistant

4. **`.github/copilot-instructions.md`**
    - GitHub Copilot configuration
    - Workspace-specific instructions

5. **`.cursor/rules/*.mdc`**
    - Auto-loading Cursor rules
    - Triggered by file type/glob patterns
    - Provides context-specific guidance

### Process Flow

```
standards.md
    ↓
1. Read configuration (YAML frontmatter)
2. Read project rules (Markdown body)
    ↓
3. Load selected modules
    ↓
4. Load selected agents
    ↓
5. Load project context (if context.md exists)
    ↓
6. Combine all content
    ↓
7. Generate output files
    ↓
✅ Done!
```

### Example Output

```bash
$ bun ai-toolkit-shared/scripts/sync.js

🔄 CouchCMS AI Toolkit - Sync

📄 Reading: project.md
🛠️  Toolkit: ./ai-toolkit-shared

📦 Loading modules:
  ✓ couchcms-core (v1.0)
  ✓ tailwindcss (v1.0)
  ✓ daisyui (v1.0)
  ✓ alpinejs (v1.0)
  ✓ typescript (v1.0)

🤖 Loading agents:
  ✓ couchcms
  ✓ databound-forms
  ✓ tailwindcss

📝 Loading project context:
  ✓ .project/ai/context.md

✍️  Generating configurations:
  ✓ .cursorrules (1,245 lines)
  ✓ CLAUDE.md (1,245 lines)
  ✓ AGENT.md (1,320 lines)
  ✓ .github/copilot-instructions.md (856 lines)
  ✓ .cursor/rules/refactor-html.mdc
  ✓ .cursor/rules/refactor-typescript.mdc
  ✓ .cursor/rules/refactor-css.mdc
  ✓ .cursor/rules/refactor-forms.mdc

✅ Sync complete!
```

### When to Run

Run sync after:

- Initial project setup
- Changing modules in `standards.md`
- Adding/removing agents in `standards.md`
- Updating toolkit (`git pull`)
- Modifying project context files (if using `context.md`)
- Changing any configuration in `standards.md`

### Errors & Warnings

#### Missing Toolkit

```bash
❌ Error: Toolkit not found at './ai-toolkit-shared'

Troubleshooting:
  1. Check toolkit path in project.md
  2. For submodule: cd ai-toolkit-shared && git pull
  3. For home dir: verify ~/couchcms-ai-toolkit exists
```

#### Invalid Module

```bash
⚠️  Warning: Module 'nonexistent' not found
  - Check module name spelling
  - Available: couchcms-core, tailwindcss, daisyui, alpinejs, typescript, databound-forms
```

#### Missing Configuration File

```bash
❌ Error: No configuration file found

Run setup wizard:
  bun ai-toolkit-shared/scripts/init.js

💡 Tip: Use .project/standards.md for the recommended location.
```

### Advanced Usage

#### Dry Run (Check without Writing)

```bash
# Preview what would be generated
bun ai-toolkit-shared/scripts/sync.js --dry-run
```

#### Force Regeneration

```bash
# Regenerate even if files exist
bun ai-toolkit-shared/scripts/sync.js --force
```

#### Specific Output Only

```bash
# Generate only .cursorrules
bun ai-toolkit-shared/scripts/sync.js --only=cursorrules
```

_(Note: Advanced flags may not be implemented yet - check script for current options)_

---

## Common Workflows

### Initial Setup

```bash
# 1. Run wizard
bun ai-toolkit-shared/scripts/init.js

# 2. Validate configuration
bun ai-toolkit-shared/scripts/validate.js

# 3. Customize standards.md (optional)
code .project/standards.md

# 4. Re-sync after changes
bun ai-toolkit-shared/scripts/sync.js
```

### Updating Configuration

```bash
# 1. Edit standards.md
code .project/standards.md

# 2. Validate changes
bun ai-toolkit-shared/scripts/validate.js

# 3. Regenerate configurations
bun ai-toolkit-shared/scripts/sync.js
```

### Updating Toolkit

```bash
# 1. Pull latest toolkit
cd ai-toolkit-shared
git pull origin master
bun install
cd ..

# 2. Validate compatibility
bun ai-toolkit-shared/scripts/validate.js

# 3. Regenerate with new toolkit
bun ai-toolkit-shared/scripts/sync.js
```

### Troubleshooting

```bash
# 1. Validate to find issues
bun ai-toolkit-shared/scripts/validate.js

# 2. Fix issues in standards.md
code .project/standards.md

# 3. Validate again
bun ai-toolkit-shared/scripts/validate.js

# 4. Sync when valid
bun ai-toolkit-shared/scripts/sync.js
```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Validate AI Config

on: [push, pull_request]

jobs:
    validate:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
              with:
                  submodules: recursive

            - uses: oven-sh/setup-bun@v1

            - name: Install toolkit dependencies
              run: cd ai-toolkit-shared && bun install

            - name: Validate configuration
              run: bun ai-toolkit-shared/scripts/validate.js

            - name: Check sync is up to date
              run: |
                  bun ai-toolkit-shared/scripts/sync.js
                  git diff --exit-code .cursorrules CLAUDE.md AGENT.md
```

---

## See Also

- [Getting Started Guide](GETTING-STARTED.md)
- [Configuration Options](CONFIGURATION.md)
- [Troubleshooting](TROUBLESHOOTING.md)
