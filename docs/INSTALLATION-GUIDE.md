# Installation Guide

Complete guide for installing and using the CouchCMS AI Toolkit.

## Quick Installation

### Option 1: Direct Path (Recommended for First Time)

This works from your project root directory:

```bash
# From your project root (where ai-toolkit-shared submodule is located)
bun ai-toolkit-shared/scripts/toolkit.js install
```

**When to use:** When the toolkit is added as a git submodule (`ai-toolkit-shared`)

**Important:** Always run from your **project root**, not from inside `ai-toolkit-shared`.

**💡 After installation:** The setup will ask if you want to add a script to `package.json`.
If you say "yes", you can then use the simpler `bun run toolkit [command]` format.

### Option 2: Add Script to package.json (Easiest to Remember)

After installation, you can add a script to your `package.json` for easier use:

```bash
# Run this once from your project root
bun ai-toolkit-shared/scripts/add-toolkit-script.js
```

**What it does:**
- ✅ Adds `"toolkit": "bun ai-toolkit-shared/scripts/toolkit.js"` to your `package.json`
- ✅ Only adds if it doesn't already exist
- ✅ Preserves all existing scripts and settings
- ✅ Safe to run multiple times

**After adding, you can use:**
```bash
bun run toolkit install
bun run toolkit setup
bun run toolkit sync
bun run toolkit health
```

**Benefits:**
- ✅ Easier to remember: `bun run toolkit` instead of long path
- ✅ Works from any directory in your project
- ✅ No risk of overwriting existing scripts
- ✅ Can be version controlled with your project

---

### Option 3: Direct Command (Global)

If you want to use `toolkit` as a direct command:

#### Step 1: Link the toolkit globally

From the toolkit directory (`ai-toolkit-shared`):

```bash
cd ai-toolkit-shared
bun link
```

Or using npm:

```bash
cd ai-toolkit-shared
npm link
```

#### Step 2: Use `toolkit` command directly

Now you can use `toolkit` from anywhere:

```bash
# From your project root
toolkit install
toolkit setup
toolkit sync
```

**Note:** After linking, you can use `toolkit` from any directory. However, you still need to run it from your project root for it to work correctly.

### Option 4: Direct Path (Temporary)

If you're in the toolkit directory itself:

```bash
# From ai-toolkit-shared directory
bun bin/toolkit install
# or
./bin/toolkit install
```

## Troubleshooting

### "command not found: toolkit" or "Script not found: toolkit"

**Problem:** The `toolkit` command is not available or not in package.json.

**Solutions:**

1. **Use direct path (recommended):**
   ```bash
   # From project root
   bun ai-toolkit-shared/scripts/toolkit.js install
   ```

2. **Link globally (optional):**
   ```bash
   cd ai-toolkit-shared
   bun link
   # Then use: toolkit install (from project root)
   ```

3. **Add to PATH manually:**
   ```bash
   # Add this to your ~/.zshrc or ~/.bashrc
   export PATH="$PATH:/path/to/ai-toolkit-shared/bin"
   ```

### "Cannot find module"

**Problem:** Dependencies are not installed.

**Solution:**
```bash
cd ai-toolkit-shared
bun install
```

## Verification

Test if toolkit is working:

```bash
# Option 1: Direct path (recommended)
bun ai-toolkit-shared/scripts/toolkit.js help

# Option 2: Direct command (if linked globally)
toolkit help

# Option 3: From toolkit directory (for testing)
cd ai-toolkit-shared
bun scripts/toolkit.js help
```

All should show the same help message.

**Important:** For actual usage, always run from your **project root**, not from inside `ai-toolkit-shared`.
