# Troubleshooting Guide

Common issues and solutions for the CouchCMS AI Toolkit.

:::tip[Most Common Issue]
**"Cannot find module" or "ENOENT" errors?** You likely forgot to install the toolkit's dependencies. After adding the submodule, always run:

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

See [Sync Issues](#sync-issues) below for details.
:::

## Quick Diagnostics

Start here:

```bash
# Run validation to identify issues
bun ai-toolkit-shared/scripts/validate.js
```

The validation output will point you to specific problems.

📖 **Upgrading from old format?** See [Migration Guide](MIGRATION.md) for migration-specific troubleshooting.

---

## Validation Issues

### ❌ "No configuration file found"

**Problem**: No configuration file (`standards.md`) exists.

**Solution**:

```bash
# Run setup wizard to create configuration
bun ai-toolkit-shared/scripts/init.js
```

Or create manually following [GETTING-STARTED.md](GETTING-STARTED.md).

---

### ❌ "Invalid YAML syntax"

**Problem**: Syntax error in `standards.md` YAML frontmatter.

**Common causes**:

- Missing quotes around values with special characters
- Incorrect indentation (must use spaces, not tabs)
- Missing colons after keys
- Trailing commas
- Mixed tabs and spaces

**Solution**:

```bash
# Check your standards.md syntax
cat standards.md

# Look for these issues:
# - name: my-project     ✓ Good
# - name my-project       ✗ Missing colon
# - name: "my-project"   ✓ Good (quotes optional for simple strings)
# - name: "it's mine"    ✓ Good (quotes required for apostrophes)
```

**Valid YAML example (standards.md frontmatter)**:

```yaml
---
name: 'my-project'
description: 'My CouchCMS project'
toolkit: './ai-toolkit-shared'

modules:
    - couchcms-core
    - tailwindcss
---
```

---

### ⚠️ "Module 'X' not found"

**Problem**: Referenced module doesn't exist in toolkit.

**Solution**:

```bash
# 1. Check available modules
ls ai-toolkit-shared/modules/

# Available modules:
# - couchcms-core.md
# - tailwindcss.md
# - daisyui.md
# - alpinejs.md
# - typescript.md
# - databound-forms.md

# 2. Fix typo in standards.md (or .project/standards.md)
# Wrong: - tailwind
# Right: - tailwindcss

# 3. Update toolkit if module is new
cd ai-toolkit-shared
git pull origin master
cd ..
```

---

### ⚠️ "Agent 'X' not found"

**Problem**: Referenced agent doesn't exist in toolkit.

**Solution**:

```bash
# 1. Check available agents
ls ai-toolkit-shared/agents/

# 2. Fix typo in standards.md (or .project/standards.md)
# 3. Update toolkit if agent is new
cd ai-toolkit-shared && git pull origin master && cd ..
```

---

### ⚠️ "Toolkit path not found"

**Problem**: Toolkit directory doesn't exist at specified path.

**Solution**:

```bash
# Check your standards.md toolkit path
grep "toolkit:" .project/standards.md

# For submodule:
toolkit: "./ai-toolkit-shared"  # ✓ Correct

# For home directory:
toolkit: "~/couchcms-ai-toolkit"  # ✓ Correct

# Common mistakes:
toolkit: "./ai-toolkit"  # ✗ Wrong directory name
toolkit: "ai-toolkit-shared"  # ✗ Missing ./

# If submodule exists but toolkit not found:
git submodule update --init --recursive
```

---

### ⚠️ "Generated files not found"

**Problem**: `.cursorrules`, `CLAUDE.md`, or `AGENT.md` missing.

**Solution**:

```bash
# Simply run sync to generate them
bun ai-toolkit-shared/scripts/sync.js
```

---

## Migration Issues

### ⚠️ "Upgrading from old version"

**Problem**: You have old configuration files from pre-v2.0 versions.

**Solution**:

See [Migration Guide](MIGRATION.md) for step-by-step instructions on upgrading from very old versions.

---

## Sync Issues

### ❌ "npm ERR! code ENOENT"

**Problem**: Toolkit dependencies not installed.

**Solution**:

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

---

### ❌ "Cannot find module 'gray-matter'"

**Problem**: Missing Node.js dependencies.

**Solution**:

```bash
# Install toolkit dependencies
cd ai-toolkit-shared
bun install
cd ..

# Try sync again
bun ai-toolkit-shared/scripts/sync.js
```

---

### ⚠️ "No modules loaded"

**Problem**: Empty or missing `modules:` array in `standards.md`.

**Solution**:

```yaml
# standards.md must have at least couchcms-core
modules:
    - couchcms-core # Always required
```

---

### ❌ "Sync completed with errors"

**Problem**: Errors during file generation.

**Solution**:

```bash
# 1. Validate first to find specific issues
bun ai-toolkit-shared/scripts/validate.js

# 2. Check error messages - they include hints
# 3. Fix issues in standards.md
# 4. Run sync again
```

---

## Submodule Issues

### ❌ "Submodule is detached HEAD"

**Problem**: Git submodule not on a branch.

**Not actually a problem** - this is normal for submodules!

But if you want to contribute changes:

```bash
cd ai-toolkit-shared

# Switch to master branch
git checkout master
git pull origin master

# Make changes, then:
git checkout -b feature/my-changes
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full workflow.

---

### ❌ "Submodule has uncommitted changes"

**Problem**: Modified files in submodule.

**Solution**:

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

---

### ❌ "Submodule update failed"

**Problem**: Can't update submodule.

**Solution**:

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

## Configuration Issues

### ⚠️ "Context file not found"

**Problem**: Referenced context file doesn't exist.

**Solution**:

```bash
# If you specified context in standards.md:
context: '.project/ai'

# Create the directory and file:
mkdir -p .project/ai
touch .project/ai/context.md

# Add some content to context.md
```

Or remove the `context:` line from `standards.md` if not needed.

**Note:** For most projects, you don't need `context.md`. Just add all rules to the `standards.md` body.

---

### ⚠️ "Custom path not found"

**Problem**: Custom path configured but directory doesn't exist.

**Solution**:

```bash
# Check your standards.md for custom paths
# Create missing directories:
mkdir -p path/to/directory
```

---

## Performance Issues

### 🐌 "Sync is slow"

**Problem**: Sync takes longer than expected.

**Expected Performance:**
- Small projects (<5 modules): < 1 second
- Medium projects (5-10 modules): 1-2 seconds
- Large projects (>10 modules): 2-3 seconds

**Solutions**:

1. **Remove unused modules**

    ```yaml
    # standards.md - only include modules you actually use
    modules:
      - couchcms-core
      - tailwindcss  # Remove if not using
    ```

2. **Clear module cache**

    ```bash
    # If cache is corrupted
    rm -rf .cache/
    bun ai-toolkit-shared/scripts/sync.js
    ```

3. **Update toolkit**

    ```bash
    cd ai-toolkit-shared
    git pull origin master
    bun install
    cd ..
    ```

4. **Upgrade Bun**
    ```bash
    bun upgrade
    ```

---

### 🐌 "Validation is slow"

**Problem**: Validation takes too long.

**Solution**:

```bash
# Skip optional checks
bun ai-toolkit-shared/scripts/validate.js --quick
```

---

## IDE/Editor Issues

### ❌ "Cursor not using new rules"

**Problem**: IDE hasn't reloaded configuration.

**Solution**:

1. **Hard reload Cursor**
    - macOS: `Cmd+Shift+P` → "Developer: Reload Window"
    - Windows/Linux: `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Check file was generated**

    ```bash
    ls -la .cursorrules
    cat .cursorrules | head -20
    ```

3. **Regenerate**
    ```bash
    rm .cursorrules
    bun ai-toolkit-shared/scripts/sync.js
    ```

---

### ❌ "Claude not seeing CLAUDE.md"

**Problem**: Claude Desktop doesn't auto-load project files.

**Solution**:

You need to explicitly add CLAUDE.md to your Claude conversation:

1. Open Claude Desktop
2. Start a new conversation
3. Click the paperclip icon (attach file)
4. Select CLAUDE.md from your project

Or copy key sections into your prompts.

---

### ❌ "Copilot not respecting instructions"

**Problem**: GitHub Copilot may not fully use `.github/copilot-instructions.md`.

**Note**: Copilot support is experimental. For best results, use Cursor or Claude.

---

## CI/CD Issues

### ❌ "GitHub Actions failing"

**Problem**: Validation or sync fails in CI.

**Common causes**:

1. **Submodules not initialized**

    ```yaml
    # Add to your workflow:
    - uses: actions/checkout@v3
      with:
          submodules: recursive # Important!
    ```

2. **Dependencies not installed**

    ```yaml
    # Add before validation:
    - name: Install toolkit dependencies
      run: cd ai-toolkit-shared && bun install
    ```

3. **Generated files out of sync**
    ```yaml
    # Add check:
    - name: Check sync is current
      run: |
          bun ai-toolkit-shared/scripts/sync.js
          git diff --exit-code .cursorrules CLAUDE.md
    ```

---

## Update Issues

### ⚠️ "After toolkit update, sync fails"

**Problem**: Breaking changes in new toolkit version.

**Solution**:

```bash
# 1. Check CHANGELOG
cat ai-toolkit-shared/CHANGELOG.md

# 2. Update standards.md if needed
# (CHANGELOG will list required changes)

# 3. Rerun sync
bun ai-toolkit-shared/scripts/sync.js
```

---

### ⚠️ "Compliance score dropped after update"

**Problem**: New validation rules in updated toolkit.

**Solution**:

```bash
# See what failed
bun ai-toolkit-shared/scripts/validate.js

# Fix warnings/errors
# Update standards.md as needed
# Validate again
```

---

## Common Mistake Patterns

### ❌ Editing Generated Files

**Don't do this**:

```bash
# ✗ Wrong - edits will be overwritten
code .cursorrules
# ... make changes ...
# Next sync: changes lost!
```

**Do this instead**:

```bash
# ✓ Right - edit source configuration
code .project/standards.md
# ... or if using context.md ...
code .project/ai/context.md
# Then regenerate:
bun ai-toolkit-shared/scripts/sync.js
```

---

### ❌ Forgetting to Sync

**Problem**: Changed `standards.md` but AI still uses old rules.

**Remember**:

```bash
# After ANY change to standards.md:
bun ai-toolkit-shared/scripts/sync.js

# Optional but recommended:
bun ai-toolkit-shared/scripts/validate.js  # Before sync
```

---

### ❌ Wrong Toolkit Path

**Problem**: Path confusion between projects.

**Check your standards.md**:

```yaml
# For THIS project's submodule:
toolkit: "./ai-toolkit-shared"  # ✓ Correct

# Common mistakes:
toolkit: "../ai-toolkit-shared"  # ✗ Wrong (unless sibling project)
toolkit: "./ai-toolkit"  # ✗ Wrong name
toolkit: "ai-toolkit-shared"  # ✗ Missing ./
```

---

## Getting More Help

### Diagnostic Commands

```bash
# Full diagnostic
echo "=== Configuration File ==="
cat .project/standards.md  # or standards.md
echo ""
echo "=== Validation ==="
bun ai-toolkit-shared/scripts/validate.js
echo ""
echo "=== Toolkit Version ==="
cd ai-toolkit-shared && git log -1 --oneline && cd ..
echo ""
echo "=== File Status ==="
ls -la .cursorrules CLAUDE.md AGENT.md
```

### Where to Ask

1. **GitHub Issues**: https://github.com/martijnbokma/couchcms-ai-toolkit/issues
2. **Include**:
    - Output of validation command
    - Your `standards.md` (remove sensitive info)
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
- [Command Reference](COMMANDS.md)
- [Contributing](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
