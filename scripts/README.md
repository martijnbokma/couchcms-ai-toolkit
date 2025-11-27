# Scripts Directory

This directory contains all automation scripts for the CouchCMS AI Toolkit.

## Core Scripts

These are the main scripts that users interact with:

- **`init.js`** - Interactive setup wizard for new projects
- **`sync.js`** - Generate AI editor configs from standards.md
- **`validate.js`** - Validate configuration and compliance
- **`migrate.js`** - Migrate from old config format to new format

### Usage

```bash
# Setup new project
bun scripts/init.js

# Generate/update AI configs
bun scripts/sync.js

# Validate configuration
bun scripts/validate.js

# Migrate old config
bun scripts/migrate.js
```

Or via package.json shortcuts:

```bash
bun run init
bun run sync
bun run validate
bun run migrate
```

## Directory Structure

```
scripts/
├── init.js, sync.js, validate.js, migrate.js    # Core scripts
├── lib/                                          # Shared libraries
├── maintenance/                                  # Module maintenance scripts
├── utils/                                        # Utility scripts
└── git-flow/                                     # Git workflow scripts
```

## Subdirectories

### `lib/`
Shared library modules used by core scripts. Contains modular components for:
- Configuration loading and validation
- Module and agent loading
- Template rendering
- File writing
- Caching

See [lib/README.md](lib/README.md) for details.

### `maintenance/`
Scripts for maintaining and fixing modules and agents:
- Analyzing module documentation
- Extending modules from documentation
- Fixing formatting issues
- Validating module structure

See [maintenance/README.md](maintenance/README.md) for details.

### `utils/`
Utility scripts for development and workflow:
- Contribution preparation
- Submodule updates
- Quick release workflow
- Shared utility functions

See [utils/README.md](utils/README.md) for details.

### `git-flow/`
Git workflow automation scripts for feature, hotfix, and release branches.

See [git-flow/README.md](git-flow/README.md) for details.

## For Developers

If you're developing the toolkit itself:

1. **Core scripts** are the main entry points
2. **lib/** contains reusable modules - add new functionality here
3. **maintenance/** is for one-off fixes and analysis
4. **utils/** is for development helpers

## Adding New Scripts

When adding a new script:

1. Determine the category (core, maintenance, utility)
2. Place in appropriate directory
3. Add to package.json if it should be easily accessible
4. Update relevant README.md
5. Follow existing code style and patterns
