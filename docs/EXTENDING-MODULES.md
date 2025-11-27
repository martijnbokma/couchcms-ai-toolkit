# Extending Modules from Documentation

This guide explains how to extend AI Toolkit modules with content from the CouchCMS documentation.

## Overview

The `extend-modules.js` script analyzes CouchCMS documentation and automatically extracts relevant patterns, code examples, and rules to enhance existing modules or create new ones.

## Quick Start

### Analyze Documentation Structure

```bash
bun scripts/extend-modules.js --analyze
```

This shows:
- Available concepts, tags, and custom routes
- Current module mappings
- Potential new modules

### Extend All Modules

```bash
bun scripts/extend-modules.js
```

### Extend Specific Module

```bash
bun scripts/extend-modules.js --module comments
```

### Dry Run (Preview Changes)

```bash
bun scripts/extend-modules.js --module comments --dry-run
```

### Custom Documentation Path

```bash
bun scripts/extend-modules.js --docs-path /path/to/CouchCMS-Documentation/src/content
```

## Module Mapping

The script uses a mapping configuration that defines which documentation topics belong to which modules:

### Existing Modules

#### couchcms-core
- **Concepts**: templates, editable-regions, variables, views, listing-pages, cloned-pages, tags
- **Tags**: template, editable, show, if, pages, embed, set, get

#### databound-forms
- **Concepts**: forms, databound-forms
- **Tags**: form, input, fieldset

### Potential New Modules

The following modules can be created from documentation:

#### comments
- **Concepts**: comments
- **Tags**: comments, process_comment
- **Status**: ⭐ New module

#### search
- **Concepts**: search
- **Tags**: search, search_form
- **Status**: ⭐ New module

#### pagination
- **Concepts**: pagination
- **Tags**: paginator
- **Status**: ⭐ New module

#### relationships
- **Concepts**: relationships
- **Tags**: related_pages, reverse_related_pages
- **Status**: ⭐ New module

#### repeatable-regions
- **Concepts**: repeatable-regions
- **Tags**: repeatable, repeat, show_repeatable
- **Status**: ⭐ New module

#### folders
- **Concepts**: folders, nested-pages
- **Tags**: folder, folders, nested_pages, dropdownfolders
- **Status**: ⭐ New module

#### archives
- **Concepts**: archives
- **Tags**: archives
- **Status**: ⭐ New module

#### users
- **Concepts**: users
- **Status**: ⭐ New module

#### custom-routes
- **Concepts**: custom-routes (from tags-reference)
- **Status**: ⭐ New module

## How It Works

### 1. Documentation Analysis

The script:
- Scans `docs/concepts/` for concept documentation
- Scans `docs/tags-reference/core/` for tag documentation
- Scans `docs/tags-reference/custom-routes/` for routing documentation

### 2. Content Extraction

For each relevant documentation file:
- **Code Examples**: Extracts all code blocks with language and title
- **Patterns**: Extracts admonitions (:::note, :::tip, :::caution, :::danger)
- **Steps**: Extracts Steps components
- **Critical Rules**: Identifies danger/caution admonitions as critical rules

### 3. Module Enhancement

The extracted content is:
- Formatted according to module structure
- Added to existing modules (appended)
- Used to create new modules (if they don't exist)
- Limited to prevent bloat (max 3 examples per concept, 2 per tag)

## Module Structure

### Frontmatter

```yaml
---
id: module-name
name: "Module Name"
version: "2.x"
description: "Module description"
required: false
requires: [couchcms-core]
conflicts: []
---
```

### Content Sections

1. **Critical Rules** - Extracted from danger/caution admonitions
2. **Code Examples** - Extracted code blocks with titles
3. **Patterns** - General patterns and best practices

## Adding New Module Mappings

Edit `scripts/extend-modules.js` and add to `MODULE_MAPPING`:

```javascript
'new-module-name': {
    concepts: ['concept1', 'concept2'],
    tags: ['tag1', 'tag2'],
    newModule: true, // Set to true if module doesn't exist yet
},
```

## Workflow

### 1. Initial Setup

```bash
# Analyze what's available
bun scripts/extend-modules.js --analyze
```

### 2. Preview Changes

```bash
# See what would be added
bun scripts/extend-modules.js --module comments --dry-run
```

### 3. Extend Module

```bash
# Actually extend the module
bun scripts/extend-modules.js --module comments
```

### 4. Review and Refine

- Review the generated content
- Remove redundant examples
- Add project-specific patterns
- Ensure consistency with existing module style

### 5. Sync to Project

```bash
# After extending modules, sync to your project
bun scripts/sync.js
```

## Best Practices

### 1. Limit Content

- Don't include every example from documentation
- Focus on common patterns and critical rules
- Keep modules focused and scannable

### 2. Maintain Quality

- Review extracted content for accuracy
- Ensure code examples are complete and working
- Add context where documentation assumes prior knowledge

### 3. Update Regularly

- Re-run extension when documentation updates
- Review and remove outdated patterns
- Keep modules in sync with latest CouchCMS features

### 4. Customize Per Project

- Modules are starting points, not final rules
- Add project-specific patterns in `standards.md` (or `.project/standards.md`)
- Override module defaults when needed

## Troubleshooting

### Module Not Found

```
⚠️  No mapping found for module: module-name
```

**Solution**: Add the module to `MODULE_MAPPING` in `extend-modules.js`

### Documentation Path Not Found

```
❌ Documentation path not found: /path/to/docs
```

**Solution**:
- Check the path is correct
- Use `--docs-path` to specify custom path
- Ensure `src/content` directory exists

### No Content Extracted

```
⚠️  No new content found for module-name
```

**Possible causes**:
- Documentation files don't exist
- File names don't match mapping
- No code examples or patterns in documentation

**Solution**:
- Check file names match mapping exactly
- Verify documentation has extractable content
- Use `--analyze` to see available files

## Examples

### Extending Comments Module

```bash
# 1. Analyze
bun scripts/extend-modules.js --analyze

# 2. Preview
bun scripts/extend-modules.js --module comments --dry-run

# 3. Extend
bun scripts/extend-modules.js --module comments

# 4. Review
cat modules/comments.md

# 5. Sync
bun scripts/sync.js
```

### Creating New Module

1. Add mapping to `extend-modules.js`:
```javascript
'photo-gallery': {
    concepts: ['photo-gallery'],
    tags: [],
    newModule: true,
},
```

2. Run extension:
```bash
bun scripts/extend-modules.js --module photo-gallery
```

3. Review and refine the generated module

4. Sync to projects:
```bash
bun scripts/sync.js
```

## Integration with Sync

After extending modules:

1. **Sync to projects**: `bun scripts/sync.js`
2. **Validate**: `bun scripts/validate.js`
3. **Test**: Use in a project to verify patterns work

## See Also

- [Available Modules](MODULES.md)
- [Getting Started](GETTING-STARTED.md)
- [Module Development Guide](../modules/README.md)
