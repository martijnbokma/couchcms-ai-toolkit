# Path Notation Standard

## Decision

Based on audit analysis showing 60% of paths use relative-implicit notation, we standardize on **relative-implicit** notation (without `./` prefix).

## Rules

### 1. File Paths in Documentation

**Standard**: Use relative paths WITHOUT `./` prefix

```markdown
✅ Correct:
- `standards.md`
- `scripts/sync.js`
- `docs/GETTING-STARTED.md`
- `ai-toolkit-shared/scripts/init.js`

❌ Incorrect:
- `./standards.md`
- `./scripts/sync.js`
- `./docs/GETTING-STARTED.md`
- `./ai-toolkit-shared/scripts/init.js`
```

### 2. Command Examples

**Standard**: Use relative paths WITHOUT `./` prefix in commands

```bash
✅ Correct:
bun ai-toolkit-shared/scripts/sync.js
code standards.md
cat docs/README.md

❌ Incorrect:
bun ./ai-toolkit-shared/scripts/sync.js
code ./standards.md
cat ./docs/README.md
```

### 3. Exceptions

**When to use `./` prefix:**

1. **When emphasizing current directory**:
   ```bash
   # When showing directory context is important
   cd ai-toolkit-shared
   ./scripts/sync.js  # Emphasizes "in this directory"
   ```

2. **When required by shell**:
   ```bash
   # Executable scripts sometimes need ./
   ./install.sh
   ```

3. **In configuration files** (YAML, JSON):
   ```yaml
   # Configuration often uses ./
   toolkit: "./ai-toolkit-shared"
   ```

### 4. Absolute Paths

**Avoid** absolute paths in documentation unless necessary:

```markdown
❌ Avoid:
/Users/username/project/standards.md
/absolute/path/to/file

✅ Use relative instead:
standards.md
ai-toolkit-shared/scripts/sync.js
```

## Most Common Paths

These paths appear frequently and should be standardized:

| Path | Standard Form | Occurrences |
|------|--------------|-------------|
| Configuration | `standards.md` | 169 |
| Sync script | `scripts/sync.js` | 81 |
| Init script | `scripts/init.js` | 28 |
| Settings | `settings.json` | 13 |
| Agents doc | `AGENTS.md` | 8 |
| Validate script | `validate.js` | 8 |
| Extend script | `extend-modules.js` | 10 |

## Implementation

### Automated Fixes

Paths to standardize (remove `./` prefix):
- `./standards.md` → `standards.md`
- `./scripts/sync.js` → `scripts/sync.js`
- `./scripts/init.js` → `scripts/init.js`
- `./.cursorrules` → `.cursorrules`
- `./.claude/` → `.claude/`

### Manual Review Needed

Some contexts require `./` prefix:
- Configuration file values
- Shell script execution
- Directory emphasis

## Rationale

1. **Consistency**: 60% of existing paths use this notation
2. **Readability**: Cleaner, less visual noise
3. **Standard Practice**: Most documentation uses relative-implicit
4. **Markdown Links**: Work the same with or without `./`

## Examples

### Before (Inconsistent)

```markdown
Edit `./standards.md` and run `scripts/sync.js`.
Then check `.cursorrules` and `./docs/README.md`.
```

### After (Consistent)

```markdown
Edit `standards.md` and run `scripts/sync.js`.
Then check `.cursorrules` and `docs/README.md`.
```

## Validation

After standardization:
- All paths in documentation should use relative-implicit notation
- Exceptions should be documented and justified
- Configuration files can keep `./` if needed for functionality

