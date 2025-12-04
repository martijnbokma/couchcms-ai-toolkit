# CLI Commands

User-facing command-line interface scripts for the CouchCMS AI Toolkit.

## Overview

All scripts in this directory are designed to be run by end users, either directly or via package.json shortcuts.

## Commands

### Setup & Installation

#### `toolkit.js`
Unified CLI entry point for all toolkit operations.

**Usage:**
```bash
bun run toolkit [subcommand] [options]
# or
toolkit [subcommand] [options]
```

**Subcommands:**
- `install` - Install toolkit in project
- `setup` - Run setup wizard
- `reconfigure` - Reconfigure existing setup
- `sync` - Generate AI configs
- `validate` - Validate configuration
- `health` - Health check
- `browse` - Interactive browser
- `update` - Check for updates
- `serve` - Start web server

#### `init.js`
Advanced setup wizard with full control over all options.

**Usage:**
```bash
bun run init
# or
bun scripts/cli/init.js
```

#### `create-standards.js`
Simple setup wizard for beginners (recommended).

**Usage:**
```bash
bun run create
# or
bun scripts/cli/create-standards.js
```

#### `install.js`
Installation script for setting up the toolkit.

**Usage:**
```bash
bun run install-toolkit
# or
bun scripts/cli/install.js
```

#### `reinstall.js`
Reinstall toolkit dependencies.

**Usage:**
```bash
bun run reinstall
# or
bun scripts/cli/reinstall.js
```

### Configuration & Validation

#### `sync.js`
Generate AI editor configs from standards.md.

**Usage:**
```bash
bun run sync
bun run sync:watch    # Watch mode
# or
bun scripts/cli/sync.js
```

#### `validate.js`
Validate configuration and compliance.

**Usage:**
```bash
bun run validate
# or
bun scripts/cli/validate.js
```

#### `migrate.js`
Migrate from old config format to new format.

**Usage:**
```bash
bun run migrate
# or
bun scripts/cli/migrate.js
```

### Maintenance & Updates

#### `update.js`
Check for and apply toolkit updates.

**Usage:**
```bash
bun run update              # Check for updates
bun run update:check        # Check only
bun run update:apply        # Apply updates
# or
bun scripts/cli/update.js [--check|--apply]
```

#### `health.js`
Health check and diagnostics.

**Usage:**
```bash
bun run health
# or
bun scripts/cli/health.js
```

#### `browse.js`
Interactive module/agent browser.

**Usage:**
```bash
bun run browse
bun run browse:modules      # Browse modules only
bun run browse:agents       # Browse agents only
# or
bun scripts/cli/browse.js [--modules|--agents]
```

## Quick Reference

| Task | Command |
|------|---------|
| First-time setup | `bun run create` |
| Advanced setup | `bun run init` |
| Generate configs | `bun run sync` |
| Validate setup | `bun run validate` |
| Check health | `bun run health` |
| Browse content | `bun run browse` |
| Update toolkit | `bun run update` |
| Reinstall | `bun run reinstall` |

## Notes

- All commands can be run via `bun run <command>` (recommended)
- Direct execution via `bun scripts/cli/<script>.js` also works
- Use `toolkit` command for unified interface
- Most commands provide interactive prompts when needed
