# Troubleshooting Guide

**Navigation:** [← Documentation Index](README.md) | [← Main README](../README.md) | [Getting Started](GETTING-STARTED.md) | [Quick Start](QUICK-START.md) | [Glossary](GLOSSARY.md)

Common issues and solutions for the CouchCMS AI Toolkit.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Most Common Issues](#most-common-issues)
  - [Dependencies Not Installed](#dependencies-not-installed)
  - [Configuration File Missing](#configuration-file-missing)
  - [YAML Syntax Errors](#yaml-syntax-errors)
- [Setup & Installation](#setup--installation)
  - [Toolkit Path Issues](#toolkit-path-issues)
  - [Git Submodule Issues](#git-submodule-issues)
- [Configuration Problems](#configuration-problems)
  - [Module/Agent Not Found](#moduleagent-not-found)
  - [Invalid Module/Agent Names](#invalid-moduleagent-names)
- [Sync & Generation](#sync--generation)
  - [Sync Fails](#sync-fails)
  - [Generated Files Missing](#generated-files-missing)
- [Editor Integration](#editor-integration)
  - [Cursor Issues](#cursor-issues)
  - [Claude Code Issues](#claude-code-issues)
- [Performance](#performance)
- [Getting More Help](#getting-more-help)

---

## Quick Diagnostics

Run these commands to quickly identify issues:

```bash
# 1. Validate configuration
bun ai-toolkit-shared/scripts/validate.js

# 2. Check dependencies
cd ai-toolkit-shared && test -d node_modules && echo "✓ Dependencies installed" || echo "✗ Run: bun install" && cd ..

# 3. Check configuration file
test -f .project/standards.md && echo "✓ Config found" || echo "✗ Config missing - run: bun ai-toolkit-shared/scripts/create-standards.js"

# 4. Check generated files
ls -la .cursorrules CLAUDE.md AGENTS.md 2>/dev/null && echo "✓ Files exist" || echo "✗ Run: bun ai-toolkit-shared/scripts/sync.js"
```

The validation output will point you to specific problems.

---

## Most Common Issues

### Dependencies Not Installed

**Symptoms:**
- `Cannot find module 'gray-matter'`
- `npm ERR! code ENOENT`
- `Error: Cannot resolve module`

**Solution:**

The toolkit now automatically checks and installs dependencies. If you still see this error:

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

**Prevention:** Dependencies are now automatically installed when you run any script.

**See also:** [Sync Issues](#sync-fails)

---

### Configuration File Missing

**Symptoms:**
- `No configuration file found`
- `standards.md not found`

**Solution:**

```bash
# Run setup wizard
bun ai-toolkit-shared/scripts/create-standards.js

# Or use advanced setup
bun ai-toolkit-shared/scripts/init.js
```

**Note:** Configuration file location is now standardized to `.project/standards.md`.

**See also:** [Getting Started](GETTING-STARTED.md)

---

### YAML Syntax Errors

**Symptoms:**
- `Failed to parse standards.md`
- `YAML syntax error`
- Validation fails with YAML errors

**Common Causes:**
- Missing quotes around values with special characters
- Incorrect indentation (must use spaces, not tabs)
- Missing colons after keys
- Trailing commas in lists
- Mixed tabs and spaces

**Solution:**

The toolkit now provides specific YAML error messages with line numbers and fix suggestions. Check the error output for:
- Line number where error occurred
- Specific issue (missing colon, wrong indentation, etc.)
- Suggested fix

**Quick Fix Examples:**

```yaml
# ❌ Wrong
name my-project              # Missing colon
description: it's mine      # Unquoted apostrophe
modules:
- couchcms-core,            # Trailing comma
	- tailwindcss          # Mixed tabs/spaces

# ✅ Correct
name: 'my-project'          # Quoted string
description: "it's mine"   # Quoted apostrophe
modules:                   # Consistent indentation
    - couchcms-core       # No trailing comma
    - tailwindcss         # Spaces only
```

**See also:** [Glossary - YAML Frontmatter](GLOSSARY.md#yaml-frontmatter)

---

## Setup & Installation

### Toolkit Path Issues

**Symptoms:**
- `Toolkit path not found`
- `Toolkit directory does not exist`

**Solution:**

The toolkit now automatically detects the toolkit path. If auto-detection fails:

1. **Check your configuration:**
   ```bash
   grep "toolkit:" .project/standards.md
   ```

2. **Common paths:**
   ```yaml
   # For submodule:
   toolkit: "./ai-toolkit-shared"  # ✓ Correct

   # For home directory:
   toolkit: "~/couchcms-ai-toolkit"  # ✓ Correct
   ```

3. **Common mistakes:**
   ```yaml
   toolkit: "./ai-toolkit"  # ✗ Wrong directory name
   toolkit: "ai-toolkit-shared"  # ✗ Missing ./
   ```

4. **If submodule exists but not found:**
   ```bash
   git submodule update --init --recursive
   ```

---

### Git Submodule Issues

#### Submodule Not Initialized

**Symptoms:**
- Empty `ai-toolkit-shared/` directory
- `Toolkit path not found` error

**Solution:**

```bash
git submodule update --init --recursive
```

#### Submodule Has Uncommitted Changes

**Symptoms:**
- `Submodule has uncommitted changes` warning
- Can't update submodule

**Solution:**

```bash
cd ai-toolkit-shared
git status

# Option 1: Commit changes (if you want to keep them)
git add .
git commit -m "Your changes"

# Option 2: Discard changes
git reset --hard HEAD

# Option 3: Stash changes
git stash

cd ..
```

#### Submodule Update Failed

**Solution:**

```bash
# Force update
git submodule update --init --recursive --force

# If that fails, remove and re-add:
git submodule deinit -f ai-toolkit-shared
rm -rf .git/modules/ai-toolkit-shared
git rm -f ai-toolkit-shared
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
```

---

## Configuration Problems

### Module/Agent Not Found

**Symptoms:**
- `Module 'X' not found`
- `Agent 'X' not found`
- Validation errors for modules/agents

**Solution:**

The toolkit now provides fuzzy matching suggestions. When you see this error:

1. **Check the suggestions** - The error message will show similar names
2. **Common typos:**
   - `tailwind` → `tailwindcss`
   - `alpine` → `alpinejs`
   - `couchcms-core` (for agent) → `couchcms`
3. **List available modules/agents:**
   ```bash
   bun ai-toolkit-shared/scripts/browse.js
   ```
4. **Update standards.md** with the correct name
5. **Re-run validation:**
   ```bash
   bun ai-toolkit-shared/scripts/validate.js
   ```

---

### Invalid Module/Agent Names

**Problem:** Typos or incorrect names in configuration.

**Common Mistakes:**

```yaml
# ❌ Wrong module names
modules:
  - couchcms           # Should be: couchcms-core
  - tailwind           # Should be: tailwindcss
  - alpine             # Should be: alpinejs

# ❌ Wrong agent names
agents:
  - couchcms-core      # Should be: couchcms
  - tailwind           # Should be: tailwindcss
```

**Correct Names:**

```yaml
# ✅ Correct
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs

agents:
  - couchcms
  - tailwindcss
  - alpinejs
```

**See also:** [Modules](MODULES.md) | [Agents](AGENTS.md)

---

## Sync & Generation

### Sync Fails

**Symptoms:**
- `Sync completed with errors`
- `Failed to generate editor configs`
- Template validation errors

**Solution:**

1. **Run validation first:**
   ```bash
   bun ai-toolkit-shared/scripts/validate.js
   ```

2. **Check error messages** - They now include specific solutions

3. **Common causes:**
   - Missing dependencies (now auto-installed)
   - Invalid YAML syntax (now shows line numbers)
   - Missing template variables (now validated before rendering)
   - Invalid module/agent names (now suggests corrections)

4. **Fix issues and re-run:**
   ```bash
   bun ai-toolkit-shared/scripts/sync.js
   ```

---

### Generated Files Missing

**Symptoms:**
- `.cursorrules`, `CLAUDE.md`, or `AGENTS.md` missing
- Editor not using toolkit rules

**Solution:**

```bash
# Simply run sync to generate them
bun ai-toolkit-shared/scripts/sync.js
```

**Note:** Files are only written if content has changed (performance optimization).

---

## Editor Integration

### Cursor Issues

#### Cursor Not Using New Rules

**Solution:**

1. **Hard reload Cursor:**
   - macOS: `Cmd+Shift+P` → "Developer: Reload Window"
   - Windows/Linux: `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Verify file was generated:**
   ```bash
   ls -la .cursorrules
   cat .cursorrules | head -20
   ```

3. **Regenerate if needed:**
   ```bash
   rm .cursorrules
   bun ai-toolkit-shared/scripts/sync.js
   ```

#### Cursor MDC Rules Not Activating

**Solution:**

1. **Check files exist:**
   ```bash
   ls -la .cursor/rules/
   ```

2. **Verify Cursor version:**
   - MDC rules require Cursor v0.40 or later
   - Update Cursor if needed

3. **Check glob patterns:**
   ```bash
   head -10 .cursor/rules/refactor-alpinejs.mdc
   ```

4. **Regenerate rules:**
   ```bash
   rm -rf .cursor/rules/
   bun ai-toolkit-shared/scripts/sync.js
   ```

5. **Restart Cursor completely**

---

### Claude Code Issues

#### Claude Code Not Loading Skills

**Solution:**

1. **Check files exist:**
   ```bash
   ls -la .claude/skills/
   ```

2. **Verify YAML frontmatter:**
   ```bash
   head -10 .claude/skills/couchcms-core.md
   ```

3. **Check Claude Code version:**
   - Skills require Claude Code v0.5 or later

4. **Regenerate skills:**
   ```bash
   rm -rf .claude/skills/
   bun ai-toolkit-shared/scripts/sync.js
   ```

5. **Restart Claude Code**

#### Claude Code Settings Not Applied

**Solution:**

1. **Check file exists and is valid JSON:**
   ```bash
   cat .claude/settings.json | jq .
   ```

2. **Verify permissions syntax:**
   ```json
   {
     "permissions": {
       "allow": ["Bash(npm run *)"],
       "deny": ["Read(./.env)", "Bash(rm -rf *)"]
     }
   }
   ```

3. **Regenerate settings:**
   ```bash
   rm .claude/settings.json
   bun ai-toolkit-shared/scripts/sync.js
   ```

4. **Restart Claude Code**

---

## Performance

### Sync is Slow

**Expected Performance:**
- Small projects (<5 modules): < 1 second
- Medium projects (5-10 modules): 1-2 seconds
- Large projects (>10 modules): 2-3 seconds

**Solutions:**

1. **Remove unused modules** from `standards.md`
2. **Update toolkit** - performance improvements in newer versions
3. **Upgrade Bun** - `bun upgrade`

**Note:** Templates and modules are now cached for better performance.

---

## Getting More Help

### Diagnostic Commands

```bash
# Full diagnostic
echo "=== Configuration File ==="
cat .project/standards.md
echo ""
echo "=== Validation ==="
bun ai-toolkit-shared/scripts/validate.js
echo ""
echo "=== Toolkit Version ==="
cd ai-toolkit-shared && git log -1 --oneline && cd ..
echo ""
echo "=== File Status ==="
ls -la .cursorrules CLAUDE.md AGENTS.md
```

### Where to Ask

1. **GitHub Issues**: https://github.com/martijnbokma/couchcms-ai-toolkit/issues
2. **Include:**
   - Output of validation command
   - Your `.project/standards.md` (remove sensitive info)
   - Error messages
   - What you've tried

### Before Opening Issue

- [ ] Run validation and include output
- [ ] Check this troubleshooting guide
- [ ] Check [CHANGELOG.md](../CHANGELOG.md) for relevant changes
- [ ] Try with fresh clone/install
- [ ] Search existing issues

---

## See Also

- [Getting Started](GETTING-STARTED.md)
- [Quick Start](QUICK-START.md)
- [Command Reference](COMMANDS.md)
- [Glossary](GLOSSARY.md)
- [Migration Guide](MIGRATION.md)
- [Contributing](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
