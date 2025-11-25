# Automatic standards.md Detection

The AI toolkit automatically detects and uses `standards.md` as the single source of truth for project standards.

## Detection Logic

The toolkit searches for configuration files in this priority order:

1. **`.project/standards.md`** (recommended)
    - Project configuration directory
    - Consistent with `.project/ai/context.md` structure
    - Logical location for project-specific config
    - Keeps root directory clean

2. **`docs/standards.md`** (documentation location)
    - Clear organization
    - Follows documentation conventions
    - Easy to find and maintain

3. **`standards.md`** (root directory)
    - Simple path
    - More visible
    - Still works perfectly

4. **`project.md`** (fallback)
    - Legacy support
    - Backward compatibility
    - Will be phased out

## How It Works

### In Scripts

All toolkit scripts (`init.js`, `sync.js`, `validate.js`) use the `findConfigFile()` utility:

```javascript
import { findConfigFile, loadConfig } from './utils.js'

// Automatically finds standards.md or project.md
const configPath = findConfigFile(process.cwd())

// Loads and parses the file
const config = loadConfig(process.cwd())
```

### In Prompts

All prompts automatically include:

```markdown
**Critical: Always follow project standards before generating any code.**

## Standards Reference

This prompt automatically uses standards from:

- `docs/standards.md` (if exists)
- `standards.md` (if exists)
- `project.md` (fallback)
```

### In Validators

The standards validator (`prompts/validators/standards.md`) automatically:

1. Detects `standards.md` location
2. Parses YAML frontmatter
3. Extracts coding standards
4. Validates prompts against standards
5. Reports compliance score

## File Format

### Required Structure

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
standards:
    indentation: 4
    line_length: 120
    language: 'english'
---
# Universal AI Coding Standards

[Your standards documentation here...]
```

### YAML Frontmatter

The YAML frontmatter contains:

- **project**: Name, type, description
- **languages**: Supported languages
- **frameworks**: Technology stack
- **standards**: Coding rules (indentation, line length, etc.)
- **naming**: Naming conventions per language

### Markdown Content

The markdown content contains:

- Coding standards
- Best practices
- Quality checklists
- Project-specific rules
- Code examples

## Usage Examples

### Check if Standards Exist

```javascript
import { hasStandards } from './utils.js'

if (hasStandards(process.cwd())) {
    console.log('✓ standards.md found')
} else {
    console.log('⚠️  No standards.md found, using project.md')
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
// Output: "docs/standards.md" or "standards.md" or "project.md"
```

## Migration Path

### From project.md to standards.md

1. **Create standards.md**:

    ```bash
    # Copy project.md content
    cp project.md docs/standards.md
    ```

2. **Add YAML frontmatter**:

    ```yaml
    ---
    project:
        name: 'my-project'
        # ... rest of config
    ---
    ```

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
    # After confirming standards.md works
    rm project.md
    ```

## Benefits

### Universal Compatibility

- Works with **any project type**
- No hardcoded assumptions
- Automatically adapts to project

### Single Source of Truth

- All AI agents use same standards
- Consistent across prompts
- Easy to maintain

### Zero Configuration

- Automatic detection
- No manual setup needed
- Works out of the box

## Troubleshooting

### Standards Not Found

```bash
# Check if file exists
ls -la docs/standards.md
ls -la standards.md

# Verify detection
bun ai-toolkit-shared/scripts/validate.js
```

### Wrong File Detected

```bash
# Check priority order
# 1. docs/standards.md
# 2. standards.md
# 3. project.md

# Remove lower priority files if needed
rm standards.md  # If you want docs/standards.md
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

## See Also

- [Standards Integration Guide](STANDARDS-INTEGRATION.md)
- [Getting Started](GETTING-STARTED.md)
- [Standards Validator](../prompts/validators/standards.md)
