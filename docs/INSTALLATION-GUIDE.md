# Installation Guide

Complete guide for installing and using the CouchCMS AI Toolkit.

## Quick Installation

### Option 1: Using `bun run toolkit` (Recommended)

This works from your project root directory:

```bash
# From your project root
bun run toolkit install
```

**When to use:** When the toolkit is added as a git submodule (`ai-toolkit-shared`)

### Option 2: Direct Command (Global)

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

**Note:** After linking, you can use `toolkit` from any directory.

### Option 3: Direct Path (Temporary)

If you're in the toolkit directory itself:

```bash
# From ai-toolkit-shared directory
bun bin/toolkit install
# or
./bin/toolkit install
```

## Troubleshooting

### "command not found: toolkit"

**Problem:** The `toolkit` command is not in your PATH.

**Solutions:**

1. **Use `bun run toolkit` instead:**
   ```bash
   bun run toolkit install
   ```

2. **Link globally:**
   ```bash
   cd ai-toolkit-shared
   bun link
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
# Option 1: Using bun run
bun run toolkit help

# Option 2: Direct command (if linked)
toolkit help

# Option 3: Direct path
bun bin/toolkit help
```

All should show the same help message.
