# Configuration Migration Guide

This guide explains how to migrate from the old configuration format to the new consolidated `config.yaml` format.

## Overview

The CouchCMS AI Toolkit has simplified its configuration structure by consolidating multiple configuration files into a single `config.yaml` file. This makes the toolkit easier to understand and maintain.

### Old Format (Multiple Files)

- `defaults.yaml` - Default paths, standards, naming conventions
- `smart-defaults.yaml` - File contexts and template aliases
- `preflight-checks.yaml` - Validation rules and checks
- `standards.md` - Project-specific configuration (YAML frontmatter + Markdown)

### New Format (Single File)

- `config.yaml` - All configuration in one place

## Migration Process

The toolkit provides an automated migration script that:

1. Detects old configuration files
2. Parses and merges them into a single configuration
3. Generates new `config.yaml`
4. Backs up old files to `.config-backup/`
5. Validates the new configuration

## Running the Migration

### Preview Migration (Dry Run)

To see what would be migrated without making changes:

```bash
bun scripts/migrate.js --dry-run
```

### Perform Migration

To perform the actual migration:

```bash
bun scripts/migrate.js
```

### Force Overwrite

If `config.yaml` already exists and you want to overwrite it:

```bash
bun scripts/migrate.js --force
```

### Skip Backup

To skip backing up old files (not recommended):

```bash
bun scripts/migrate.js --no-backup
```

## What Gets Migrated

### From `defaults.yaml`

- `paths` → `config.yaml: paths`
- `standards` → `config.yaml: standards`
- `naming` → `config.yaml: naming`
- `gitflow` → `config.yaml: gitflow`

### From `smart-defaults.yaml`

- `file_contexts` → `config.yaml: file_contexts` (agents and modules only)
- `template_aliases` → `config.yaml: template_aliases`

### From `preflight-checks.yaml`

- All check categories → `config.yaml: validation.checks`
- `execution` → `config.yaml: validation.execution`

### From `standards.md`

- `name` → `config.yaml: project.name`
- `description` → `config.yaml: project.description`
- `type` → `config.yaml: project.type`
- `toolkit` → `config.yaml: toolkit.path`
- `modules` → `config.yaml: modules`
- `agents` → `config.yaml: agents`
- `framework` → `config.yaml: framework`
- Any other frontmatter fields are merged appropriately

## After Migration

### 1. Review the New Configuration

Open `config.yaml` and review the migrated settings:

```bash
cat config.yaml
```

### 2. Run Sync

Generate editor configurations from the new config:

```bash
bun scripts/sync.js
```

### 3. Verify Generated Configs

Check that editor configurations were generated correctly:

```bash
ls -la .cursorrules .claude/ .windsurf/ .kiro/ .github/
```

### 4. Test Your Workflow

Verify that your development workflow still works as expected.

## Automatic Rollback

If the migration fails during execution, the script will automatically:

1. Remove the failed `config.yaml`
2. Restore all backup files from `.config-backup/`
3. Clean up the backup directory

Your old configuration will be restored automatically, so you can fix any issues and try again.

## Manual Rollback

If you need to manually rollback after a successful migration:

### 1. Remove New Config

```bash
rm config.yaml
```

### 2. Restore Backup Files

```bash
mv .config-backup/defaults.yaml.* defaults.yaml
mv .config-backup/smart-defaults.yaml.* smart-defaults.yaml
mv .config-backup/preflight-checks.yaml.* preflight-checks.yaml
mv .config-backup/standards.md.* standards.md
```

### 3. Run Sync with Old Format

```bash
bun scripts/sync.js
```

The toolkit will automatically detect and use the old format.

## Troubleshooting

### Migration Fails with Validation Errors

If the migration script reports validation errors:

1. Review the error messages
2. Check the old configuration files for issues
3. Fix the issues in the old files
4. Run migration again

### Generated Config is Missing Settings

If some settings are missing from the generated `config.yaml`:

1. Check if they were in the old files
2. Manually add them to `config.yaml`
3. Run `bun scripts/sync.js` to regenerate editor configs

### Sync Fails After Migration

If sync fails after migration:

1. Check `config.yaml` for syntax errors
2. Validate the configuration: `bun scripts/validate.js`
3. Review error messages and fix issues
4. If needed, restore backup and try again

## Breaking Changes

### Removed Features

The following features from `smart-defaults.yaml` are no longer supported:

- `action_contexts` - Not used by any templates
- `intent_patterns` - AI editors handle this natively
- `communication_modes` - Not used
- `suggestion_triggers` - Too complex, removed
- `context_cache_schema` - Over-engineering, removed

### File Context Changes

File contexts now only include `agents` and `modules` fields. The following fields are no longer supported:

- `checks` - Moved to validation rules
- `suggestions` - Removed (AI editors provide suggestions)

## Support

If you encounter issues during migration:

1. Check this guide for troubleshooting steps
2. Review the [Configuration Schema](CONFIG-SCHEMA.md)
3. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
4. Open an issue on GitHub with details about the problem

## Benefits of New Format

- **Simpler** - One file instead of four
- **Clearer** - All settings in one place
- **Documented** - Comprehensive schema documentation
- **Validated** - Built-in validation
- **Maintainable** - Easier to understand and modify
