# Scripts Directory

This directory contains all automation scripts for the CouchCMS AI Toolkit, organized by purpose and audience.

## Directory Structure

```
scripts/
├── cli/                    # User-facing CLI commands
│   ├── toolkit.js          # Unified CLI entry point
│   ├── init.js             # Advanced setup wizard
│   ├── create-standards.js # Simple setup wizard
│   ├── sync.js             # Generate AI configs
│   ├── validate.js          # Validate configuration
│   ├── migrate.js           # Migrate old configs
│   ├── update.js            # Check for updates
│   ├── health.js            # Health check
│   ├── browse.js            # Interactive browser
│   ├── install.js           # Installation script
│   └── reinstall.js         # Reinstall toolkit
│
├── create/                  # Content creation scripts
│   ├── create-module.js     # Create new modules
│   ├── create-agent.js      # Create new agents
│   └── audit-docs.js        # Documentation audit
│
├── lib/                     # Shared library modules
├── maintenance/             # Module/agent maintenance scripts
├── utils/                   # Utility scripts
├── dev/                     # Developer utilities
└── git-flow/                # Git workflow scripts
```

## User-Facing Commands (`cli/`)

These are the main scripts that end users interact with:

### Setup & Installation
- **`toolkit.js`** - Unified CLI entry point (use `bun run toolkit` or `toolkit` command)
- **`init.js`** - Advanced setup wizard with full control
- **`create-standards.js`** - Simple setup wizard for beginners (recommended)
- **`install.js`** - Installation script
- **`reinstall.js`** - Reinstall toolkit dependencies

### Configuration & Validation
- **`sync.js`** - Generate AI editor configs from standards.md
- **`validate.js`** - Validate configuration and compliance
- **`migrate.js`** - Migrate from old config format to new format

### Maintenance & Updates
- **`update.js`** - Check for and apply toolkit updates
- **`health.js`** - Health check and diagnostics
- **`browse.js`** - Interactive module/agent browser

### Usage

```bash
# Via package.json shortcuts (recommended)
bun run toolkit      # Unified CLI
bun run create       # Simple setup wizard
bun run init         # Advanced setup wizard
bun run sync         # Generate AI configs
bun run validate     # Validate configuration
bun run migrate      # Migrate old config
bun run update       # Check for updates
bun run health       # Health check
bun run browse       # Interactive browser

# Direct execution
bun scripts/cli/toolkit.js
bun scripts/cli/sync.js
```

## Content Creation (`create/`)

Scripts for creating new content:

- **`create-module.js`** - Create new knowledge modules
- **`create-agent.js`** - Create new AI agents
- **`audit-docs.js`** - Audit and validate documentation

### Usage

```bash
bun run create:module    # Create new module
bun run create:agent    # Create new agent
bun run audit:docs       # Audit documentation
```

## Shared Libraries (`lib/`)

Modular, reusable components used by all scripts:

- Configuration loading and validation
- Module and agent loading
- Template rendering
- File operations
- Caching
- Error handling
- Logging

See [lib/README.md](lib/README.md) for details.

## Maintenance Scripts (`maintenance/`)

Developer tools for maintaining modules and agents:

- Analyzing module documentation
- Extending modules from documentation
- Fixing formatting issues
- Validating module structure

See [maintenance/README.md](maintenance/README.md) for details.

## Utility Scripts (`utils/`)

Helper scripts for development and workflow:

- **`add-toolkit-script.js`** - Add toolkit script to package.json (optional utility)
- **`prepare-contribution.js`** - Prepare for contributing to the toolkit
- **`update-submodule.js`** - Update toolkit submodule
- **`quick-release.js`** - Quick release workflow

See [utils/README.md](utils/README.md) for details.

## Developer Utilities (`dev/`)

Developer utility scripts for toolkit contributors:

- Testing different toolkit branches
- Development workflow helpers

See [dev/README.md](dev/README.md) for details.

## Git Flow Scripts (`git-flow/`)

Git workflow automation scripts for feature, hotfix, and release branches.

See [git-flow/README.md](git-flow/README.md) for details.

## For Developers

If you're developing the toolkit itself:

1. **`cli/`** - User-facing commands (main entry points)
2. **`create/`** - Content creation scripts
3. **`lib/`** - Reusable modules (add new functionality here)
4. **`maintenance/`** - One-off fixes and analysis
5. **`utils/`** - Development helpers
6. **`dev/`** - Developer utilities for testing and debugging

## Adding New Scripts

When adding a new script:

1. **Determine the category:**
   - User-facing command → `cli/`
   - Content creation → `create/`
   - Developer utility → `utils/` or `dev/`
   - Module maintenance → `maintenance/`
   - Shared functionality → `lib/`

2. **Place in appropriate directory**

3. **Add to package.json** if it should be easily accessible

4. **Update relevant README.md**

5. **Follow existing code style and patterns**

## Quick Reference

| Task | Command |
|------|---------|
| Setup project | `bun run create` or `bun run init` |
| Generate configs | `bun run sync` |
| Validate setup | `bun run validate` |
| Check health | `bun run health` |
| Browse modules | `bun run browse` |
| Update toolkit | `bun run update` |
| Create module | `bun run create:module` |
| Create agent | `bun run create:agent` |
