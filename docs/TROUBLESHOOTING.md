# Troubleshooting Guide

Common issues and solutions.

## Command Not Found

### Problem: "command not found: toolkit"

**Cause:** The `toolkit` command is not globally available.

**Solution:** Use `bun run toolkit` instead:

```bash
# Instead of: toolkit install
bun run toolkit install

# Instead of: toolkit setup
bun run toolkit setup

# Instead of: toolkit sync
bun run toolkit sync
```

**Alternative:** Link globally (optional):

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
bun run toolkit install
```

## Wrong Directory

### Problem: Commands don't work or show errors

**Cause:** Running commands from wrong directory.

**Solution:** Make sure you're in your project root (not in `ai-toolkit-shared`):

```bash
# Correct: From project root
cd ~/my-project
bun run toolkit install

# Wrong: From toolkit directory
cd ~/my-project/ai-toolkit-shared
bun run toolkit install  # This won't work correctly
```

## Configuration File Not Found

### Problem: "Configuration file not found"

**Cause:** `.project/standards.md` doesn't exist.

**Solution:** Run setup:

```bash
bun run toolkit install
# or
bun run toolkit setup
```

## Still Having Issues?

1. Check installation status:
   ```bash
   bun run toolkit health
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
