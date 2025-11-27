# Migration Guide

This guide is for projects using very old versions of the toolkit (pre-v2.0).

## Current Configuration Format

The CouchCMS AI Toolkit uses a single configuration file: **`standards.md`**

This file uses YAML frontmatter for configuration and Markdown for project-specific rules.

## If You're Using an Old Version

If you have any of these files in your project:
- `defaults.yaml`
- `smart-defaults.yaml`
- `preflight-checks.yaml`
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
bun ai-toolkit-shared/scripts/init.js
```

This will create a new `standards.md` in your project root with the current format.

### 3. Manually Transfer Your Settings

If you had custom settings in old files, manually copy them to the new `standards.md`:

**Old format** (`.project/standards.md`):
```yaml
---
name: my-project
modules:
  - couchcms-core
  - tailwindcss
---
```

**New format** (`standards.md` in root):
```yaml
---
name: my-project
toolkit: ./ai-toolkit-shared
modules:
  - couchcms-core
  - tailwindcss
---
```

### 4. Remove Old Files

```bash
rm -rf .project/
rm -f defaults.yaml smart-defaults.yaml preflight-checks.yaml
```

### 5. Sync Configuration

```bash
bun ai-toolkit-shared/scripts/sync.js
```

## What Changed

### Simplified Structure

**Before (multiple files):**
```
.project/
  standards.md
defaults.yaml
smart-defaults.yaml
preflight-checks.yaml
```

**Now (single file):**
```
standards.md
```

### Simplified Configuration

**Before:**
```yaml
---
name: my-project
modules:
  - couchcms-core
paths:
  css: assets/css
  components: snippets/components
standards:
  indentation: 4
  language: english
---
```

**Now:**
```yaml
---
name: my-project
toolkit: ./ai-toolkit-shared
modules:
  - couchcms-core
---
```

Most settings are now handled automatically by the toolkit. You only specify what you need.

## Need Help?

1. Check [Configuration Guide](CONFIG-FILES.md)
2. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
3. Open an issue on GitHub

## Summary

- Old versions used multiple config files
- Current version uses single `standards.md` file
- Run `init.js` to create new config
- Manually transfer custom settings
- Remove old files
