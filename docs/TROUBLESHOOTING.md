# Troubleshooting Guide

**Navigation:** [← Documentation Index](README.md) | [← Main README](../README.md) | [Getting Started](GETTING-STARTED.md) | [Quick Start](QUICK-START.md)

Common issues and solutions for the CouchCMS AI Toolkit.

> [!TIP]
> **Most Common Issue**
> 
> **"Cannot find module" or "ENOENT" errors?** You likely forgot to install the toolkit's dependencies. After adding the submodule, always run:
> 
> ```bash
> cd ai-toolkit-shared
> bun install  # or: npm install
> cd ..
> ```
> 
> See [Sync Issues](#sync-issues) below for details.

## Quick Diagnostics

Start here:

```bash
# Run validation to identify issues
bun ai-toolkit-shared/scripts/validate.js

# Check if toolkit dependencies are installed
cd ai-toolkit-shared && bun install --dry-run && cd ..

# Verify configuration file exists and is readable
test -f standards.md && echo "✓ standards.md found" || echo "✗ standards.md missing"

# Check if generated files exist
ls -la .cursorrules CLAUDE.md AGENTS.md 2>/dev/null || echo "Generated files missing - run sync"

# Quick syntax check for YAML frontmatter
head -20 standards.md | grep -A 20 "^---$" | head -19 | tail -18 | bun -e "console.log(require('yaml').parse(require('fs').readFileSync(0, 'utf8')))" 2>/dev/null && echo "✓ YAML syntax valid" || echo "✗ YAML syntax error"
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


> [!WARNING]
> **Critical Step**
> 
> You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (gray-matter, yaml, handlebars) that need to be installed first.
> 
> ```bash
> cd ai-toolkit-shared
> bun install  # or: npm install
> cd ..
> ```
> 
> This installs the required packages:
> - `gray-matter` - YAML frontmatter parsing
> - `yaml` - YAML processing
> - `handlebars` - Template generation

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
```yaml

**❌ Wrong YAML examples**:

```yaml
---
name my-project              # ✗ Missing colon
description: it's mine       # ✗ Unquoted apostrophe
toolkit: ai-toolkit-shared   # ✗ Missing ./
modules:
- couchcms-core,             # ✗ Trailing comma
	- tailwindcss            # ✗ Mixed tabs and spaces
---
```

**✅ Correct YAML example (standards.md frontmatter)**:

```yaml
---
name: 'my-project'           # ✓ Quoted string
description: "it's mine"     # ✓ Quoted apostrophe
toolkit: './ai-toolkit-shared'  # ✓ Proper path
modules:                     # ✓ Consistent indentation
    - couchcms-core         # ✓ No trailing comma
    - tailwindcss           # ✓ Spaces only
---
```

**✅ Correct YAML example (standards.md frontmatter)**:

```yaml
---
name: 'my-project'           # ✓ Quoted string
description: "it's mine"     # ✓ Quoted apostrophe
toolkit: './ai-toolkit-shared'  # ✓ Proper path
modules:                     # ✓ Consistent indentation
    - couchcms-core         # ✓ No trailing comma
    - tailwindcss           # ✓ Spaces only
---
```yaml

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

# 2. Compare your modules list with available modules
echo "=== Your configured modules ==="
grep -A 20 "^modules:" standards.md | grep "^  - " | sed 's/^  - //'
echo "=== Available modules ==="
ls ai-toolkit-shared/modules/*.md | sed 's/.*\///' | sed 's/\.md$//'

# 3. Fix typo in standards.md
# Wrong: - tailwind
# Right: - tailwindcss

# 4. Update toolkit if module is new
cd ai-toolkit-shared
git pull origin master
cd ..

# 5. Verify fix worked
bun ai-toolkit-shared/scripts/validate.js | grep -i module
```

---

### ⚠️ "Agent 'X' not found"

**Problem**: Referenced agent doesn't exist in toolkit.

**Solution**:

```bash
# 1. Check available agents
ls ai-toolkit-shared/agents/

# 2. Compare your agents list with available agents
echo "=== Your configured agents ==="
grep -A 20 "^agents:" standards.md | grep "^  - " | sed 's/^  - //' || echo "No agents configured"
echo "=== Available agents ==="
ls ai-toolkit-shared/agents/*.md | sed 's/.*\///' | sed 's/\.md$//'

# 3. Fix typo in standards.md
# Example: Change 'couchcms-core' to 'couchcms'

# 4. Update toolkit if agent is new
cd ai-toolkit-shared && git pull origin master && cd ..

# 5. Verify fix worked
bun ai-toolkit-shared/scripts/validate.js | grep -i agent
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

**Problem**: `.cursorrules`, `CLAUDE.md`, or `AGENTS.md` missing.

**Solution**:

```bash
# Simply run sync to generate them
bun ai-toolkit-shared/scripts/sync.js
```yaml

---

## Migration Issues

### ⚠️ "Upgrading from old version"

**Problem**: You have old configuration files from pre-v2.0 versions.

**Solution**:

```bash
# 1. Check for old configuration files
ls -la config.yaml defaults.yaml smart-defaults.yaml preflight-checks.yaml 2>/dev/null && echo "Old config files found" || echo "No old config files"

# 2. Backup old files before migration
mkdir -p .backup/$(date +%Y%m%d)
cp config.yaml defaults.yaml smart-defaults.yaml preflight-checks.yaml .backup/$(date +%Y%m%d)/ 2>/dev/null || echo "No old files to backup"

# 3. Run migration helper (if available)
test -f ai-toolkit-shared/scripts/migrate.js && bun ai-toolkit-shared/scripts/migrate.js || echo "Manual migration required"

# 4. Verify migration worked
bun ai-toolkit-shared/scripts/validate.js

# 5. Clean up old files after successful migration
# rm config.yaml defaults.yaml smart-defaults.yaml preflight-checks.yaml
```

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
```yaml

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
```yaml

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
```yaml

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
```yaml

---

## Configuration Issues

### ⚠️ "Context file not found"

**Problem**: Referenced context file doesn't exist.

**Solution**:

```bash
# 1. Check what context path is configured
grep "^context:" standards.md || echo "No context configured"

# 2. If you specified context in standards.md:
# context: '.project/ai'

# Create the directory and file:
mkdir -p .project/ai
touch .project/ai/context.md

# 3. Add some content to context.md
echo "# Project Context" > .project/ai/context.md
echo "" >> .project/ai/context.md
echo "Add project-specific rules and context here." >> .project/ai/context.md

# 4. Verify the file is accessible
test -f .project/ai/context.md && echo "✓ Context file created" || echo "✗ Failed to create context file"

# 5. Test sync works with context file
bun ai-toolkit-shared/scripts/sync.js
```

Or remove the `context:` line from `standards.md` if not needed:

```bash
# Remove context line from standards.md
sed -i '/^context:/d' standards.md
```

**Note:** For most projects, you don't need `context.md`. Just add all rules to the `standards.md` body.

---

### ⚠️ "Custom path not found"

**Problem**: Custom path configured but directory doesn't exist.

**Solution**:

```bash
# 1. Check your standards.md for custom paths
grep -E "^(output|context|toolkit):" standards.md

# 2. Check which paths are missing
echo "=== Checking configured paths ==="
for path in $(grep -E "^(output|context|toolkit):" standards.md | cut -d: -f2 | tr -d ' "'"'"''); do
    if [ -e "$path" ]; then
        echo "✓ $path exists"
    else
        echo "✗ $path missing"
    fi
done

# 3. Create missing directories:
mkdir -p path/to/directory

# 4. For common custom paths:
# Output directory
mkdir -p .ai-output

# Context directory  
mkdir -p .project/ai

# Custom toolkit location
# (Don't create this - fix the path instead)

# 5. Verify paths now exist
bun ai-toolkit-shared/scripts/validate.js | grep -i path
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
```yaml

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

### ❌ "Cursor MDC rules not activating"

**Problem**: Context-aware rules in `.cursor/rules/*.mdc` not working.

**Solution**:

1. **Check files exist**
    ```bash
    ls -la .cursor/rules/
    ```

2. **Verify Cursor version**
    - MDC rules require Cursor v0.40 or later
    - Update Cursor if needed

3. **Check glob patterns**
    ```bash
    # View a rule's patterns
    head -10 .cursor/rules/refactor-alpinejs.mdc
    ```
    
    Make sure glob patterns match your file types:
    ```yaml
    globs:
      - "**/*.html"  # Matches all HTML files
      - "**/*.php"   # Matches all PHP files
    ```

4. **Regenerate rules**
    ```bash
    rm -rf .cursor/rules/
    bun ai-toolkit-shared/scripts/sync.js
    ```

5. **Restart Cursor**
    - Close and reopen Cursor completely

---

### ❌ "Claude Code not loading skills"

**Problem**: Skills in `.claude/skills/*.md` not being used.

**Solution**:

1. **Check files exist**
    ```bash
    ls -la .claude/skills/
    ```

2. **Verify YAML frontmatter**
    ```bash
    # Check a skill file
    head -10 .claude/skills/couchcms-core.md
    ```
    
    Should have valid frontmatter:
    ```yaml
    ---
    name: couchcms-core
    description: Core CouchCMS patterns
    allowed-tools: Read, Write, Bash, Grep
    ---
    ```

3. **Check Claude Code version**
    - Skills require Claude Code v0.5 or later
    - Update Claude Code if needed

4. **Regenerate skills**
    ```bash
    rm -rf .claude/skills/
    bun ai-toolkit-shared/scripts/sync.js
    ```

5. **Restart Claude Code**

---

### ❌ "Claude Code settings not applied"

**Problem**: Permissions or environment variables in `.claude/settings.json` not working.

**Solution**:

1. **Check file exists and is valid JSON**
    ```bash
    cat .claude/settings.json | jq .
    ```

2. **Verify permissions syntax**
    
    **❌ Wrong permissions syntax**:
    ```json
    {
      "permissions": {
        "allow": "Bash(npm run *)",     // ✗ String instead of array
        "deny": [
          "Read .env",                  // ✗ Missing parentheses
          "Bash rm -rf *"               // ✗ Missing parentheses
        ]
      }
    }
    ```
    
    **✅ Correct permissions syntax**:
    ```json
    {
      "permissions": {
        "allow": [                      // ✓ Array format
          "Bash(npm run *)",           // ✓ Proper syntax
          "Read(~/.config/**)"         // ✓ Glob patterns
        ],
        "deny": [
          "Read(./.env)",              // ✓ Parentheses required
          "Bash(rm -rf *)"             // ✓ Dangerous commands blocked
        ]
      }
    }
    ```

3. **Regenerate settings**
    ```bash
    rm .claude/settings.json
    bun ai-toolkit-shared/scripts/sync.js
    ```

4. **Restart Claude Code**

---

### ❌ "Claude not seeing CLAUDE.md"

**Problem**: Claude Desktop doesn't auto-load project files.

**Solution**:

You need to explicitly add CLAUDE.md to your Claude conversation:

1. Open Claude Desktop
2. 🚀 Start a new conversation
3. 📝 Click the paperclip icon (attach file)
4. 📝 Select CLAUDE.md from your project

Or copy key sections into your prompts.

**For Claude Code CLI:**
- CLAUDE.md is automatically loaded at startup
- Check file exists: `ls -la CLAUDE.md`
- Regenerate if needed: `bun ai-toolkit-shared/scripts/sync.js`

---

### ❌ "AGENTS.md not showing agents"

**Problem**: AGENTS.md is empty or missing agents.

**Solution**:

1. **Check agents are configured**
    ```yaml
    # In standards.md
    agents:
      - couchcms
      - tailwindcss
    ```

2. **Regenerate**
    ```bash
    rm AGENTS.md
    bun ai-toolkit-shared/scripts/sync.js
    ```

3. **Verify content**
    ```bash
    cat AGENTS.md | head -50
    ```

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

    **❌ Wrong GitHub Actions setup**:
    ```yaml
    # ✗ Missing submodules
    - uses: actions/checkout@v3
    
    # ✗ Wrong submodule flag
    - uses: actions/checkout@v3
      with:
          submodules: true
    ```

    **✅ Correct GitHub Actions setup**:
    ```yaml
    ```yaml
    # ✗ Missing submodules
    - uses: actions/checkout@v3
    
    # ✗ Wrong submodule flag
    - uses: actions/checkout@v3
      with:
          submodules: true
    ```

    **✅ Correct GitHub Actions setup**:
    ```yaml
    # ✓ Recursive submodules
    - uses: actions/checkout@v3
      with:
          submodules: recursive # Important!
    ```

2. **Dependencies not installed**

    **❌ Wrong dependency installation**:
    ```yaml
    # ✗ Missing cd command
    - name: Install dependencies
      run: bun install
    
    # ✗ Wrong directory
    - name: Install dependencies  
      run: cd toolkit && bun install
    ```

    **✅ Correct dependency installation**:
    ```yaml
    ```yaml
    # ✗ Missing cd command
    - name: Install dependencies
      run: bun install
    
    # ✗ Wrong directory
    - name: Install dependencies  
      run: cd toolkit && bun install
    ```

    **✅ Correct dependency installation**:
    ```yaml
    # ✓ Correct path and cd back
    - name: Install toolkit dependencies
      run: cd ai-toolkit-shared && bun install
    ```

3. **Generated files out of sync**

    **❌ Wrong sync check**:
    ```yaml
    # ✗ Missing sync step
    - name: Check files
      run: git diff --exit-code .cursorrules
    
    # ✗ Wrong file list
    - name: Check sync
      run: |
          bun ai-toolkit-shared/scripts/sync.js
          git diff --exit-code
    ```

    **✅ Correct sync check**:
    ```yaml
    ```yaml
    # ✗ Missing sync step
    - name: Check files
      run: git diff --exit-code .cursorrules
    
    # ✗ Wrong file list
    - name: Check sync
      run: |
          bun ai-toolkit-shared/scripts/sync.js
          git diff --exit-code
    ```

    **✅ Correct sync check**:
    ```yaml
    # ✓ Sync first, then check specific files
    - name: Check sync is current
      run: |
          bun ai-toolkit-shared/scripts/sync.js
          git diff --exit-code .cursorrules CLAUDE.md AGENTS.md
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
```yaml

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
```yaml

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

**❌ Wrong toolkit paths**:

```yaml
toolkit: "ai-toolkit-shared"     # ✗ Missing ./
toolkit: "./ai-toolkit"          # ✗ Wrong directory name  
toolkit: "../ai-toolkit-shared"  # ✗ Wrong relative path
toolkit: "/ai-toolkit-shared"    # ✗ Absolute path
toolkit: "~/ai-toolkit"          # ✗ Wrong name in home
```

**✅ Correct toolkit paths**:

```yaml
# For submodule in current project:
toolkit: "./ai-toolkit-shared"   # ✓ Correct relative path

# For global installation in home directory:
toolkit: "~/couchcms-ai-toolkit" # ✓ Correct home path

# For sibling project (rare):
toolkit: "../shared-toolkit"     # ✓ Valid if actually sibling
```

---

### ❌ Wrong Module Names

**Problem**: Typos or incorrect module names in configuration.

**❌ Wrong module names**:

```yaml
modules:
  - couchcms           # ✗ Should be couchcms-core
  - tailwind           # ✗ Should be tailwindcss  
  - alpine             # ✗ Should be alpinejs
  - typescript-core    # ✗ Should be typescript
  - databound          # ✗ Should be databound-forms
```

**✅ Correct module names**:

```yaml
modules:
  - couchcms-core      # ✓ Core CouchCMS patterns
  - tailwindcss        # ✓ TailwindCSS styling
  - alpinejs           # ✓ Alpine.js JavaScript
  - typescript         # ✓ TypeScript support
  - databound-forms    # ✓ DataBound Forms
```

---

### ❌ Wrong Agent Names

**Problem**: Incorrect agent names that don't match available agents.

**❌ Wrong agent names**:

```yaml
agents:
  - couchcms-core      # ✗ Should be couchcms
  - tailwind           # ✗ Should be tailwindcss
  - alpine-js          # ✗ Should be alpinejs
  - db-forms           # ✗ Should be databound-forms
```

**✅ Correct agent names**:

```yaml
agents:
  - couchcms           # ✓ Core CouchCMS agent
  - tailwindcss        # ✓ TailwindCSS agent
  - alpinejs           # ✓ Alpine.js agent
  - databound-forms    # ✓ DataBound Forms agent
```

---

### ❌ Wrong Command Usage

**Problem**: Using incorrect commands or missing dependencies.

**❌ Wrong commands**:

```bash
# ✗ Running scripts without installing dependencies
bun ai-toolkit-shared/scripts/sync.js

# ✗ Using npm when bun is preferred
npm run ai-toolkit-shared/scripts/sync.js

# ✗ Wrong script paths
bun scripts/sync.js

# ✗ Missing cd back to project root
cd ai-toolkit-shared && bun scripts/sync.js
```

**✅ Correct commands**:

```bash
# ✓ Install dependencies first
cd ai-toolkit-shared && bun install && cd ..

# ✓ Use bun with correct path
bun ai-toolkit-shared/scripts/sync.js

# ✓ Alternative with npm if bun not available
node ai-toolkit-shared/scripts/sync.js

# ✓ Always return to project root
cd ai-toolkit-shared && git pull && cd ..
```

---

### ❌ Wrong File Locations

**Problem**: Placing configuration files in wrong locations.

**❌ Wrong file locations**:

```bash
# ✗ Configuration in wrong directory
ai-toolkit-shared/standards.md

# ✗ Context file in root
context.md

# ✗ Generated files in toolkit directory
ai-toolkit-shared/.cursorrules
```

**✅ Correct file locations**:

```bash
# ✓ Configuration in project root
./standards.md

# ✓ Context in project subdirectory (if used)
./.project/ai/context.md

# ✓ Generated files in project root
./.cursorrules
./CLAUDE.md
./AGENTS.md
```

---

### ❌ Wrong YAML Indentation

**Problem**: Inconsistent or incorrect YAML indentation.

**❌ Wrong YAML indentation**:

```yaml
---
name: my-project
modules:
- couchcms-core              # ✗ No indentation
	- tailwindcss            # ✗ Tab instead of spaces
    - alpinejs               # ✗ Mixed indentation
agents:
      - couchcms             # ✗ Too much indentation
---
```

**✅ Correct YAML indentation**:

```yaml
---
name: my-project
modules:                     # ✓ Consistent spacing
    - couchcms-core         # ✓ 4 spaces
    - tailwindcss           # ✓ Same level
    - alpinejs              # ✓ Consistent
agents:                      # ✓ Same level as modules
    - couchcms              # ✓ 4 spaces
---
```

---

### ❌ Wrong Git Submodule Commands

**Problem**: Incorrect git commands for managing the toolkit submodule.

**❌ Wrong git commands**:

```bash
# ✗ Cloning instead of adding submodule
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git

# ✗ Wrong submodule path
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git toolkit

# ✗ Forgetting to initialize
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# ✗ Wrong update command
git submodule update
```

**✅ Correct git commands**:

```bash
# ✓ Add submodule with correct path
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared

# ✓ Initialize and update
git submodule update --init --recursive

# ✓ Update to latest
cd ai-toolkit-shared && git pull origin master && cd ..

# ✓ Update submodule reference
git add ai-toolkit-shared && git commit -m "Update toolkit"
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
ls -la .cursorrules CLAUDE.md AGENTS.md
```

### Where to Ask

1. **GitHub Issues**: https://github.com/martijnbokma/couchcms-ai-toolkit/issues
2. 📝 **Include**:
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
