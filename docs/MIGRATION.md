# Migration Guide

This guide is for projects using very old configuration formats (before the v2.0 configuration system introduced in toolkit v1.0.0).

**Note**: The "v2.0" refers to the configuration format version, not the toolkit package version. The current toolkit version is **1.0.14**.

## Version Terminology

This guide uses "v2.0 configuration format" to refer to the major configuration system overhaul, not the toolkit package version.

- **Configuration v1.0**: Multiple YAML files (defaults.yaml, smart-defaults.yaml, etc.) - Used before toolkit v1.0.0
- **Configuration v2.0**: Single standards.md file - Used from toolkit v1.0.0 onwards

**Current toolkit version**: 1.0.14 (uses configuration v2.0)

## Do You Need This Guide?

Check if you need to migrate:

```bash
# Check for old configuration files
ls -la .project/ defaults.yaml smart-defaults.yaml preflight-checks.yaml config.yaml 2>/dev/null
```text

If these files exist, you need to migrate.

If you only have `standards.md` in your project root, you're already using the current format.

## Version History

- **Before v1.0.0** (2023): Used multiple YAML files (configuration v1.0)
- **v1.0.0** (January 2024): Introduced single standards.md format (configuration v2.0)
- **v1.0.14** (Current): Current stable version

This guide helps migrate from pre-v1.0.0 (configuration v1.0) to current format (configuration v2.0).

## Current Configuration Format

The CouchCMS AI Toolkit uses a single configuration file: **`standards.md`**

This file uses YAML frontmatter for configuration and Markdown for project-specific rules.

## If You're Using an Old Version

If you have any of these files in your project:
- `defaults.yaml`
- `smart-defaults.yaml`
- `preflight-checks.yaml`
- `config.yaml`
- `.project/standards.md` (old location)

You're using a very old version of the toolkit.

## Migration Steps

### 1. Update the Toolkit

```bash
cd ai-toolkit-shared
git pull origin master
bun install
cd ..
```

### 2. Run Init to Create New Config

```bash
# Run the advanced setup wizard
# This provides full control over modules, agents, and configuration
bun ai-toolkit-shared/scripts/cli/init.js

# The wizard will guide you through:
# - Project name and description
# - Module selection (CouchCMS features)
# - Agent selection (AI assistants)
# - Configuration file location
```text

This will create a new `standards.md` in your project root with the current format.

### 3. Manually Transfer Your Settings

If you had custom settings in old files, manually copy them to the new `standards.md`:

**Old format** (`.project/standards.md`):
```yaml
---
name: my-project
description: 'Brief description of your project'
# Knowledge Modules - Choose based on your project needs
modules:
  - couchcms-core      # Always required for CouchCMS projects
  - tailwindcss        # TailwindCSS 4 patterns and utilities
---
```

**New format** (`standards.md` in root):
```yaml
---
name: my-project
description: 'Brief description of your project'
toolkit: ./ai-toolkit-shared
# Knowledge Modules - Choose based on your project needs
modules:
  - couchcms-core      # Always required for CouchCMS projects
  - tailwindcss        # TailwindCSS 4 patterns and utilities
---
```bash

### 4. Remove Old Files

```bash
rm -rf .project/
rm -f defaults.yaml smart-defaults.yaml preflight-checks.yaml config.yaml
```

### 5. Sync Configuration

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/cli/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/cli/sync.js --watch
```text

### 6. Verify Migration Success

After completing the migration, verify everything is working correctly:

```bash
# 1. Verify standards.md exists and is valid
test -f standards.md && echo "✅ standards.md found" || echo "❌ standards.md missing"

# 2. Verify old files are removed
! test -f defaults.yaml && ! test -f smart-defaults.yaml && ! test -f preflight-checks.yaml && ! test -f config.yaml && ! test -d .project && echo "✅ Old files removed" || echo "❌ Old files still present"

# 3. Verify configuration is valid
bun ai-toolkit-shared/scripts/cli/validate.js && echo "✅ Configuration valid" || echo "❌ Configuration has errors"

# 4. Verify generated files are created
test -f .cursorrules && echo "✅ .cursorrules generated" || echo "❌ .cursorrules missing"

# 5. Test sync process
bun ai-toolkit-shared/scripts/cli/sync.js && echo "✅ Sync successful" || echo "❌ Sync failed"
```

**Expected output after successful migration:**
```text
✅ standards.md found
✅ Old files removed
✅ Configuration valid
✅ .cursorrules generated
✅ Sync successful
```

If any verification step fails, review the migration steps above or check the [Troubleshooting Guide](TROUBLESHOOTING.md).

## What Changed

### Simplified Structure

**Before (multiple files):**
```text
.project/
  standards.md
defaults.yaml
smart-defaults.yaml
preflight-checks.yaml
```text

**Now (single file):**
```text
standards.md
```

### Configuration Format Changes

The migration involves changing from multiple configuration files to a single `standards.md` file.

#### File Structure Comparison

| **Before (Configuration v1.0)** | **After (Configuration v2.0)** |
|----------------------------------|--------------------------------|
| `.project/standards.md` | `standards.md` (in root) |
| `defaults.yaml` | *(removed - built into toolkit)* |
| `smart-defaults.yaml` | *(removed - built into toolkit)* |
| `preflight-checks.yaml` | *(removed - built into toolkit)* |
| `config.yaml` | *(removed - replaced by standards.md)* |


| **Before (Configuration v1.0)** | **After (Configuration v2.0)** |
|----------------------------------|--------------------------------|
| `.project/standards.md` | `standards.md` (in root) |
| `defaults.yaml` | *(removed - built into toolkit)* |
| `smart-defaults.yaml` | *(removed - built into toolkit)* |
| `preflight-checks.yaml` | *(removed - built into toolkit)* |
| `config.yaml` | *(removed - replaced by standards.md)* |

#### Configuration Content Comparison

**Before (Multiple files):**

`.project/standards.md`:
```yaml
---
name: my-project
description: 'Brief description of your project'
modules:
  - couchcms-core
  - tailwindcss
---
```yaml

`defaults.yaml`:
```yaml
paths:
  css: assets/css
  components: snippets/components
standards:
  indentation: 4
  language: english
```

`smart-defaults.yaml`:
```yaml
file_contexts:
  php: "CouchCMS template file"
  css: "TailwindCSS stylesheet"
template_aliases:
  component: "snippets/components"
```yaml

**After (Single file):**

`standards.md` (in root):
```yaml
---
name: my-project
description: 'Brief description of your project'
toolkit: ./ai-toolkit-shared
modules:
  - couchcms-core
  - tailwindcss
---

# Project-Specific Rules

Any custom rules or documentation for your project go here in Markdown format.
```

**Key Changes:**
- ✅ **Simplified**: One file instead of multiple
- ✅ **Automatic**: Most settings handled by toolkit
- ✅ **Flexible**: Custom rules in Markdown body
- ✅ **Self-contained**: No separate YAML files needed

## Rollback Instructions

If you need to revert the migration for any reason, follow these steps:

### 1. Backup Current State (Before Rollback)

```bash
# Create backup of current configuration
cp standards.md standards.md.backup
cp -r .cursorrules .cursorrules.backup 2>/dev/null || true
cp CLAUDE.md CLAUDE.md.backup 2>/dev/null || true
cp AGENTS.md AGENTS.md.backup 2>/dev/null || true
```text

### 2. Restore Old Configuration Files

If you have backups of your old configuration files:

```bash
# Restore old files from backup
cp backup/defaults.yaml .
cp backup/smart-defaults.yaml .
cp backup/preflight-checks.yaml .
cp backup/config.yaml . 2>/dev/null || true
mkdir -p .project
cp backup/.project/standards.md .project/
```

### 3. Downgrade Toolkit Version

```bash
# Switch to older toolkit version
cd ai-toolkit-shared
git checkout v0.9.x  # Replace with your previous version
bun install
cd ..
```bash

### 4. Remove New Configuration

```bash
# Remove new format files
rm -f standards.md
rm -f .cursorrules
rm -f CLAUDE.md
rm -f AGENTS.md
```

### 5. Verify Rollback

```bash
# Check old files are present
ls -la defaults.yaml smart-defaults.yaml preflight-checks.yaml .project/standards.md

# Test old toolkit functionality
bun ai-toolkit-shared/scripts/cli/sync.js  # Use old sync command
```text

### Important Notes

- ⚠️ **Backup First**: Always backup your current state before rolling back
- ⚠️ **Version Compatibility**: Ensure toolkit version matches your old configuration format
- ⚠️ **Generated Files**: You'll lose any improvements from the new configuration system
- ⚠️ **Support**: Old versions may not receive updates or support

### Alternative: Hybrid Approach

If you need to keep some old functionality while using the new system:

```bash
# Keep both formats temporarily
mv standards.md standards-new.md
# Restore old files as above
# Use old toolkit for specific tasks, new for others
```

## Need Help?

1. Check [Configuration Guide](CONFIG-FILES.md)
2. 🔍 Check [Troubleshooting Guide](TROUBLESHOOTING.md)
3. 📝 Open an issue on GitHub

## Summary

- Old versions used multiple config files
- Current version uses single `standards.md` file
- Run `init.js` to create new config
- Manually transfer custom settings
- Remove old files
