# Maintenance Scripts

Scripts for maintaining and fixing modules, agents, and documentation.

## Scripts

### Module Analysis & Extension

- **`analyze-modules.js`** - Analyze module documentation for potential extensions
- **`extend-modules.js`** - Extend modules from CouchCMS documentation
- **`validate-modules.js`** - Validate module structure and formatting

### Formatting Fixes

- **`fix-modules.js`** - Fix module formatting issues
- **`fix-module-code-titles.js`** - Fix code block titles in modules
- **`fix-agent-sections.js`** - Fix agent section formatting
- **`fix-agent-code-titles.js`** - Fix code block titles in agents

## Usage

### Analyze Modules

```bash
bun scripts/maintenance/analyze-modules.js
```

### Extend Modules

```bash
# Analyze documentation for extensions
bun scripts/maintenance/extend-modules.js --analyze

# Extend specific module
bun scripts/maintenance/extend-modules.js --module couchcms-core
```

### Validate Modules

```bash
bun scripts/maintenance/validate-modules.js
```

### Fix Formatting

```bash
# Fix all modules
bun scripts/maintenance/fix-modules.js

# Fix specific issues
bun scripts/maintenance/fix-module-code-titles.js
bun scripts/maintenance/fix-agent-sections.js
bun scripts/maintenance/fix-agent-code-titles.js
```

## When to Use

These scripts are typically used:

- After bulk updates to modules or agents
- When adding new modules from documentation
- When fixing formatting inconsistencies
- During quality assurance checks
- Before releases

## Notes

- These scripts modify files in `modules/` and `agents/` directories
- Always commit changes before running these scripts
- Review changes carefully before committing
- Some scripts may take time to complete for large documentation sets
