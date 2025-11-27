# Module Guide

Complete guide to understanding, organizing, and improving modules in the CouchCMS AI Toolkit.

## Module Categories

### Core (1 module)
- `couchcms-core` - Foundation module, always required

### Frontend (4 modules)
- `tailwindcss` - CSS framework
- `daisyui` - UI component library
- `alpinejs` - JavaScript framework
- `typescript` - TypeScript patterns

### Content Management (4 modules)
- `folders` - Content organization
- `archives` - Archive views
- `relationships` - Page relationships
- `repeatable-regions` - Repeatable content blocks

### Navigation & Discovery (3 modules)
- `search` - Search functionality
- `pagination` - Pagination controls
- `custom-routes` - Custom URL routing

### User Features (2 modules)
- `users` - User management
- `comments` - Comment system

### Forms (1 module)
- `databound-forms` - CRUD forms

## Module Organization

### Current Structure

Modules are stored in a **flat structure** for compatibility with the sync script:

```
modules/
├── couchcms-core.md
├── tailwindcss.md
├── daisyui.md
├── alpinejs.md
├── typescript.md
├── folders.md
├── archives.md
├── relationships.md
├── repeatable-regions.md
├── search.md
├── pagination.md
├── custom-routes.md
├── users.md
├── comments.md
└── databound-forms.md
```

### Category Metadata

Each module includes `category` metadata in its frontmatter:

```yaml
---
id: comments
name: "Comments"
category: "user-features"
version: "2.x"
description: "User comments with moderation and spam prevention"
required: false
requires: [couchcms-core]
conflicts: []
---
```

This allows modules to be:
- **Organized by category** in documentation
- **Filtered by purpose** in tools
- **Grouped logically** without changing file structure

## Module Improvements

### ✅ Completed Improvements

1. **Fixed All Module Metadata**
   - ✅ **Descriptions added** - All modules now have descriptions
   - ✅ **Category metadata** - All modules have category field in frontmatter
   - ✅ **Standardized naming** - All modules use proper display names

2. **Updated Documentation**
   - ✅ **MODULES.md** - Completely rewritten with category sections
   - ✅ **Module categories** - Clear organization by purpose
   - ✅ **Selection guides** - Examples for different project types
   - ✅ **Category summary table** - Quick overview of all modules

3. **Created Analysis Tools**
   - ✅ **analyze-modules.js** - Analyzes module organization and quality
   - ✅ **fix-modules.js** - Automatically fixes module issues

### Before vs After

**Before:**
- ❌ 9 modules missing descriptions
- ❌ No category metadata
- ❌ Inconsistent naming
- ❌ Flat documentation structure

**After:**
- ✅ All modules have descriptions
- ✅ All modules have category metadata
- ✅ Consistent naming (respecting official framework names)
- ✅ Organized by category in documentation

## Usage

### Analyze Modules

```bash
bun scripts/analyze-modules.js
```

This analyzes:
- Module metadata completeness
- Category organization
- Naming consistency
- Documentation quality

### Fix Module Issues

```bash
# Preview fixes
bun scripts/fix-modules.js --dry-run

# Apply fixes
bun scripts/fix-modules.js
```

This automatically fixes:
- Missing descriptions
- Inconsistent naming
- Missing category metadata
- Frontmatter structure issues

### View Module Documentation

```bash
# See all modules organized by category
cat docs/MODULES.md
```

## Module Selection

### By Project Type

**Simple Blog:**
- `couchcms-core`
- `folders`
- `archives`
- `pagination`

**Content-Rich Site:**
- `couchcms-core`
- `folders`
- `archives`
- `relationships`
- `search`
- `pagination`

**Interactive Application:**
- `couchcms-core`
- `tailwindcss`
- `daisyui`
- `alpinejs`
- `typescript`
- `users`
- `comments`
- `databound-forms`

**E-commerce:**
- `couchcms-core`
- `tailwindcss`
- `daisyui`
- `alpinejs`
- `folders`
- `relationships`
- `search`
- `pagination`
- `databound-forms`

## Best Practices

### 1. Module Naming

**Display Names:**
- Use official framework names: `TypeScript`, `TailwindCSS`, `daisyUI`
- Use Title Case for feature modules: `Custom Routes`, `Repeatable Regions`
- Preserve brand names: `CouchCMS Core`, `DataBound Forms`

**File Names:**
- Use kebab-case: `custom-routes.md`, `repeatable-regions.md`
- Match module ID in frontmatter

### 2. Module Descriptions

**Requirements:**
- 50-160 characters
- Clear and descriptive
- Explain what the module provides
- Include key features

**Examples:**
- ✅ "Search functionality with MySQL fulltext and relevance ranking"
- ✅ "User comments with moderation and spam prevention"
- ❌ "Search module" (too short)
- ❌ "This module provides search functionality with MySQL fulltext indexing and relevance-based result ranking for content discovery" (too long)

### 3. Category Assignment

**Guidelines:**
- Assign one primary category
- Use existing categories when possible
- Create new category only if needed
- Keep categories focused and distinct

## Next Steps (Optional)

1. **Add module icons** - Visual identification in documentation
2. **Category-based selection wizard** - Interactive module selection
3. **Module dependency visualization** - Graph of module relationships
4. **Module usage statistics** - Track which modules are most used

## Notes

The "inconsistent naming" warnings in the analysis are false positives for:
- `daisyUI` - Official name (lowercase 'd', uppercase 'UI')
- `TypeScript` - Official name (camelCase)
- `TailwindCSS` - Official name (camelCase)
- `CouchCMS Core` - Brand name preservation
- `DataBound Forms` - Technical term (camelCase)
- `Custom Routes` - Title Case is correct
- `Repeatable Regions` - Title Case is correct

These names are intentionally preserved to match official framework/brand names.

## See Also

- [Modules Documentation](MODULES.md) - Complete module reference
- [Getting Started](GETTING-STARTED.md) - Setup guide
- [Command Reference](COMMANDS.md) - Available commands


