# standards.md Integration Guide

Complete guide to integrating `standards.md` as the single source of truth in the AI toolkit.

## Overview

The AI toolkit uses `standards.md` as the single source of truth for project configuration. This makes the toolkit simple, clear, and easy to use.

## Detection Priority

The toolkit searches for configuration files in this order:

1. **`.project/standards.md`** (primary - recommended location)
    - Project configuration directory
    - Consistent with `.project/ai/context.md` structure
    - Logical location for project-specific config

2. **`docs/standards.md`** (documentation location)
    - Clear organization
    - Follows documentation conventions

3. **`standards.md`** (root directory)
    - Simple path
    - More visible

## File Structure

### standards.md Format

Your `standards.md` should follow this structure:

```yaml
---
project:
    name: 'my-project'
    type: 'couchcms-webapp'
    description: 'Project description'
languages:
    - php,typescript,css,html
frameworks:
    - couchcms,tailwindcss_v4,alpinejs
agents:
    cursor: true
    copilot: true
    claude: true
modules:
    - couchcms-core
    - tailwindcss
    - alpinejs
standards:
    indentation: 4
    line_length: 120
    language: 'english'
naming:
    php_variables: 'snake_case'
    typescript_variables: 'camelCase'
    css_classes: 'kebab-case'
---

# Universal AI Coding Standards

[Your project-specific standards here...]
```

## Automatic Integration

### 1. Detection in Scripts

The toolkit scripts (`init.js`, `sync.js`, `validate.js`) automatically detect `standards.md`:

```javascript
// Pseudo-code for detection
function findConfigFile(projectDir) {
    const candidates = [
        join(projectDir, '.project', 'standards.md'), // Recommended
        join(projectDir, 'docs', 'standards.md'),
        join(projectDir, 'standards.md'),
    ]

    for (const path of candidates) {
        if (existsSync(path)) {
            return path
        }
    }

    return null
}
```

### 2. Prompt Integration

All prompts automatically reference `standards.md` when present:

```markdown
**Critical: Always follow project standards (standards.md) before generating any code.**

## Standards Reference

This prompt automatically uses standards from:

- `.project/standards.md` (if exists - recommended)
- `docs/standards.md` (if exists)
- `standards.md` (if exists)
```

### 3. Validator Integration

The `prompts/validators/standards.md` validator automatically:

1. **Detects** `standards.md` location
2. **Parses** YAML frontmatter
3. **Extracts** coding standards
4. **Validates** prompts against standards
5. **Reports** compliance score

## Usage Examples

### Check if Standards Exist

```javascript
import { hasStandards } from './utils.js'

if (hasStandards(process.cwd())) {
    console.log('✓ standards.md found')
} else {
    console.log('❌ No standards.md found')
    console.log('Run: bun ai-toolkit-shared/scripts/init.js')
}
```

### Load Configuration

```javascript
import { loadConfig } from './utils.js'

const config = loadConfig(process.cwd())

if (config) {
    console.log(`Found: ${config.path}`)
    console.log(`Is standards: ${config.isStandards}`)
    console.log('Frontmatter:', config.frontmatter)
}
```

### Get Config File Name

```javascript
import { getConfigFileName } from './utils.js'

const fileName = getConfigFileName(process.cwd())
console.log(`Using: ${fileName}`)
// Output: ".project/standards.md" or "docs/standards.md" or "standards.md"
```

## Migration from project.md

**Note:** If you have an old `project.md` file, you must migrate to `standards.md`.

### Simple Migration

1. **Rename project.md to standards.md**:

    ```bash
    # Rename to recommended location
    mv project.md .project/standards.md

    # Or to root
    mv project.md standards.md
    ```

2. **No content changes needed** - the file format is the same!

3. **Update content**:
    - Add full standards documentation
    - Include quality checklists
    - Add code examples

4. **Test detection**:

    ```bash
    bun ai-toolkit-shared/scripts/validate.js
    ```

5. **Remove project.md** (optional):
    ```bash
    # After migration, project.md is no longer needed
    # (The toolkit no longer supports project.md)
    ```

## Script Updates

### init.js

The init script now:

1. Checks for existing `standards.md`
2. Offers to create `docs/standards.md` if none exists
3. Generates template with YAML frontmatter
4. Includes all standard sections

### sync.js

The sync script now:

1. Detects `standards.md` first
2. Parses YAML frontmatter for project config
3. Extracts standards for prompt generation
4. Creates `standards.md` if not found

### validate.js

The validate script now:

1. Validates `standards.md` structure
2. Checks YAML frontmatter completeness
3. Verifies standards documentation quality
4. Reports compliance score

## Benefits

### Universal Reusability

- Works with **any project type** (not just CouchCMS)
- Automatically adapts to project standards
- No hardcoded assumptions

### Single Source of Truth

- All AI agents use same standards
- Consistent across all prompts
- Easy to maintain and update

### Automatic Discovery

- No manual configuration needed
- Detects standards automatically
- Works out of the box

## Example Workflow

### 1. Setup New Project

```bash
# Add toolkit
git submodule add ... ai-toolkit-shared

# Run init (creates docs/standards.md)
bun ai-toolkit-shared/scripts/init.js
```

### 2. Customize Standards

```bash
# Edit standards
code docs/standards.md

# Add your project-specific rules
# Update YAML frontmatter
```

### 3. Sync Configurations

```bash
# Generate AI configs from standards.md
bun ai-toolkit-shared/scripts/sync.js

# Creates:
# - .cursorrules (references standards.md)
# - CLAUDE.md (references standards.md)
# - AGENTS.md (references standards.md)
```

### 4. Validate

```bash
# Check standards compliance
bun ai-toolkit-shared/scripts/validate.js

# Reports:
# - Standards structure ✓
# - YAML completeness ✓
# - Documentation quality ✓
```

## Best Practices

### 1. Location

**Recommended**: `.project/standards.md`

- Project configuration directory
- Consistent with `.project/ai/context.md` structure
- Logical location for project-specific config
- Keeps root directory clean

**Alternative**: `docs/standards.md` (documentation)

- Clear organization
- Follows documentation conventions
- Easy to find

**Alternative**: `standards.md` (root)

- Simpler path
- More visible
- Still works perfectly

### 2. Structure

- **YAML frontmatter**: Project configuration
- **Standards section**: Coding rules
- **Quality checklists**: Verification criteria
- **Examples**: Code patterns

### 3. Maintenance

- Update standards when stack changes
- Keep YAML frontmatter current
- Review quality checklists regularly
- Sync after major changes

## Troubleshooting

### Standards Not Detected

```bash
# Check file location
ls -la .project/standards.md
ls -la docs/standards.md
ls -la standards.md

# Verify file exists
test -f .project/standards.md && echo "Found" || echo "Not found"
```

### YAML Parse Errors

```bash
# Validate YAML syntax
bun ai-toolkit-shared/scripts/validate.js

# Check for:
# - Proper indentation (spaces, not tabs)
# - Quoted strings with special chars
# - Valid YAML structure
```

### Prompts Not Using Standards

```bash
# Regenerate prompts
bun ai-toolkit-shared/scripts/sync.js

# Check generated files
grep "standards.md" .cursorrules
grep "standards.md" CLAUDE.md
```

## See Also

- [Configuration Files Guide](CONFIG-FILES.md)
- [Getting Started](GETTING-STARTED.md)
- [Command Reference](COMMANDS.md)
- [Standards Validator](../prompts/validators/standards.md)


