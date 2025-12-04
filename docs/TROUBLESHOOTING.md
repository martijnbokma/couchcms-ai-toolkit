# Troubleshooting Guide

Common issues and solutions.

## Command Not Found

### Problem: "command not found: toolkit"

**Cause:** The `toolkit` command is not globally available.

**Solution:** Use the direct path to the toolkit script:

```bash
# Instead of: toolkit install
bun ai-toolkit-shared/scripts/cli/toolkit.js install

# Instead of: toolkit setup
bun ai-toolkit-shared/scripts/cli/toolkit.js setup

# Instead of: toolkit sync
bun ai-toolkit-shared/scripts/cli/toolkit.js sync
```

**Important:** Run these commands from your **project root** directory, not from inside `ai-toolkit-shared`.

**Alternative 1:** Add script to package.json (recommended):

```bash
# Run this once from your project root
bun ai-toolkit-shared/scripts/utils/add-toolkit-script.js

# Then you can use:
bun run toolkit install
bun run toolkit sync
```

**Alternative 2:** Link globally (optional):

```bash
cd ai-toolkit-shared
bun link
# Now you can use: toolkit install
```

## Dependencies Not Installed

### Problem: "Cannot find module 'gray-matter'" or similar

**Cause:** Toolkit dependencies are not installed.

**Solution:**

```bash
cd ai-toolkit-shared
bun install
```

Then try again:

```bash
bun ai-toolkit-shared/scripts/cli/toolkit.js install
```

## Wrong Directory

### Problem: Commands don't work or show errors

**Cause:** Running commands from wrong directory.

**Solution:** Make sure you're in your project root (not in `ai-toolkit-shared`):

```bash
# Correct: From project root
cd ~/my-project
bun ai-toolkit-shared/scripts/cli/toolkit.js install

# Wrong: From toolkit directory
cd ~/my-project/ai-toolkit-shared
bun scripts/cli/toolkit.js install  # This won't work correctly (wrong working directory)
```

## Configuration File Not Found

### Problem: "Configuration file not found"

**Cause:** `.project/standards.md` doesn't exist.

**Solution:** Run setup:

```bash
bun ai-toolkit-shared/scripts/cli/toolkit.js install
# or
bun ai-toolkit-shared/scripts/cli/toolkit.js setup
```

## Still Having Issues?

1. Check installation status:
   ```bash
   bun ai-toolkit-shared/scripts/cli/toolkit.js health
   ```

2. Verify dependencies:
   ```bash
   cd ai-toolkit-shared
   bun install
   ```

3. Check documentation:
   - [START-HERE.md](START-HERE.md) - Quick start guide
   - [INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md) - Detailed installation
   - [COMMANDS.md](COMMANDS.md) - Command reference
