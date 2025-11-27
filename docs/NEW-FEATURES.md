# New Features Guide (v2.1.0)

This guide covers the new features added in version 2.1.0 that make the toolkit easier to use.

## 🔍 Auto-Detection

The toolkit now automatically detects your project type, frameworks, and languages.

### What Gets Detected

- **Project Name** - From git remote, package.json, or composer.json
- **Project Description** - From package.json, composer.json, or README.md
- **Project Type** - landing-page, blog, ecommerce, webapp, or custom
- **Frameworks** - TailwindCSS, Alpine.js, TypeScript, daisyUI, HTMX
- **Languages** - PHP, JavaScript, TypeScript, CSS

### How It Works

```bash
bun scripts/init.js

# Output:
🔍 Detecting project...
   Type: blog
   Frameworks: tailwindcss, alpinejs
   Languages: php, javascript, css
```

The toolkit scans:
- `package.json` and `composer.json` for dependencies
- Config files (`tailwind.config.js`, `tsconfig.json`)
- HTML/PHP files for CDN includes
- Directory structure for common patterns

### Recommended Modules

Based on detection, the toolkit recommends appropriate modules:

| Project Type | Recommended Modules |
|--------------|-------------------|
| Landing Page | core, tailwindcss, alpinejs |
| Blog | core, tailwindcss, alpinejs, comments, search, pagination |
| E-commerce | core, tailwindcss, alpinejs, databound-forms, users, search |
| Web App | core, tailwindcss, alpinejs, typescript, databound-forms, users |

## 📋 Project Presets

Choose from 8 predefined configurations during setup.

### Available Presets

1. **Landing Page** - Simple landing page with CouchCMS
2. **Blog** - Blog with comments, search, and pagination
3. **E-commerce** - Online store with products, cart, and checkout
4. **Web Application** - Full-featured web application with authentication
5. **Portfolio** - Portfolio website with projects showcase
6. **Documentation** - Documentation with search and navigation
7. **Minimal** - Bare minimum - CouchCMS core only
8. **Full Stack** - Everything included - all modules and agents

### Using Presets

```bash
bun scripts/init.js

# Choose mode:
🎯 Setup mode:
  1. Auto (recommended) - Use detected settings
  2. Preset - Choose from common project types  ← Choose this
  3. Simple - Quick setup with defaults
  4. Custom - Full control over all options
Choice [1-4]: 2

# Select preset:
📋 Available presets:
  0. None - Configure manually
  1. Landing Page - Simple landing page with CouchCMS
  2. Blog - Blog with comments, search, and pagination
  3. E-commerce - Online store with products, cart, and checkout
  ...
Choice [0-8]: 2
```

### Customizing Presets

Edit `presets.yaml` to add your own presets:

```yaml
presets:
  my-preset:
    name: "My Custom Preset"
    description: "Description here"
    modules:
      - couchcms-core
      - tailwindcss
    agents:
      - couchcms
    framework:
      enabled: false
```

## 👀 Watch Mode

Auto-sync configs when your configuration file changes.

### Usage

```bash
# Start watch mode
bun scripts/sync.js --watch

# Or use npm script
cd ai-toolkit-shared && bun run sync:watch
```

### How It Works

1. Runs initial sync
2. Watches `standards.md` for changes
3. Auto-syncs 500ms after last change (debounced)
4. Shows sync results
5. Continues watching

### Example Output

```
🔄 CouchCMS AI Toolkit - Sync
...
✨ Sync complete in 234ms

👀 Watching standards.md for changes...
   Press Ctrl+C to stop

# After you edit standards.md:
🔄 Config changed, syncing...
...
✨ Sync complete in 189ms

👀 Watching for changes...
```

### When To Use

- During active development
- When experimenting with different modules
- When fine-tuning your configuration

## 🏥 Health Check

Validate your toolkit installation and check for issues.

### Usage

```bash
bun scripts/health.js

# Or use npm script
cd ai-toolkit-shared && bun run health
```

### What It Checks

1. **Toolkit Installation**
   - Directory structure is valid
   - Dependencies are installed
   - Package version

2. **Project Configuration**
   - Configuration file exists
   - Configuration age (warns if > 30 days old)

3. **Generated Files**
   - All expected files exist
   - Files are up to date with config

4. **Updates**
   - Checks if toolkit has updates available
   - Shows commit count behind

### Example Output

```
🏥 CouchCMS AI Toolkit - Health Check

📦 Toolkit Installation
  ✅ Toolkit structure is valid
  ✅ Dependencies installed
  ✅ Toolkit version: 2.1.0

⚙️  Project Configuration
  ✅ Configuration found: standards.md

📄 Generated Files
  ⚠️  Outdated files: Cursor rules, Claude settings
      → Run: bun ai-toolkit-shared/scripts/sync.js

🔄 Updates
  ⚠️  Toolkit is 3 commit(s) behind
      → Run: cd ai-toolkit-shared && git pull

⚠️  Found some warnings, but toolkit should work
```

### Exit Codes

- `0` - Everything OK
- `1` - Errors found (toolkit may not work)

## 💡 Update Notifier

Get notified when toolkit updates are available.

### How It Works

- Checks for updates automatically (every 24 hours)
- Non-blocking - doesn't slow down commands
- Caches results to avoid network overhead
- Shows notification after sync completes

### Example Notification

```
┌─────────────────────────────────────────────────────────┐
│ 💡 Update Available                                     │
├─────────────────────────────────────────────────────────┤
│ Your toolkit is 5 commit(s) behind master              │
│ Latest: feat: add interactive module browser            │
│                                                         │
│ Update with:                                            │
│   cd ai-toolkit-shared && git pull                      │
└─────────────────────────────────────────────────────────┘
```

### Manual Check

Force an update check:

```bash
bun scripts/health.js
```

### Disable Notifications

The notifier is non-intrusive and only checks once per day. If you want to disable it, you can modify the check interval in `scripts/lib/update-notifier.js`.

## 🎨 Interactive Module Browser

Browse and select modules/agents with a terminal UI.

### Usage

```bash
# Browse modules
bun scripts/browse.js
bun scripts/browse.js --modules

# Browse agents
bun scripts/browse.js --agents

# Or use npm scripts
cd ai-toolkit-shared && bun run browse
cd ai-toolkit-shared && bun run browse:modules
cd ai-toolkit-shared && bun run browse:agents
```

### Controls

- **↑↓ Arrows** - Navigate
- **Space** - Toggle selection
- **Enter** - Save and exit
- **Q** - Quit without saving

### Features

- **Grouped by Category** - Modules organized by type
- **Descriptions** - See what each module does
- **Dependencies** - Auto-selects required dependencies
- **Current Selection** - Shows currently selected modules
- **Visual Feedback** - Highlighted cursor and checkboxes

### Example

```
📦 CouchCMS AI Toolkit - Modules Browser

Use ↑↓ to navigate, Space to toggle, Enter to save, Q to quit

CORE
  [✓] CouchCMS Core
→ [ ] DataBound Forms
    Advanced form handling with data binding
    Requires: couchcms-core

FRONTEND
  [✓] TailwindCSS
  [✓] Alpine.js
  [ ] TypeScript

Selected: 3/15
```

## 🚀 Quick Comparison

### Before v2.1.0

```bash
# Manual setup
bun scripts/init.js
# Answer 5-10 questions
# Manually select modules from list
# Manually select agents from list
# Hope you chose the right ones

# Check for updates
cd ai-toolkit-shared
git fetch
git status
cd ..

# Sync after config changes
bun scripts/sync.js
# Edit config
bun scripts/sync.js
# Edit config
bun scripts/sync.js
```

### After v2.1.0

```bash
# Auto setup
bun scripts/init.js
# Choose "Auto" mode
# Done! Everything detected and configured

# Or use preset
bun scripts/init.js
# Choose "Preset" mode
# Select "Blog"
# Done!

# Watch mode
bun scripts/sync.js --watch
# Edit config as much as you want
# Auto-syncs on save

# Health check
bun scripts/health.js
# See everything at a glance
```

## 📊 Setup Mode Comparison

| Mode | Questions | Time | Best For |
|------|-----------|------|----------|
| **Auto** | 0-2 | 30 sec | New projects, quick setup |
| **Preset** | 1-2 | 45 sec | Common project types |
| **Simple** | 2-3 | 1 min | Standard projects |
| **Custom** | 5-10 | 2-3 min | Specific requirements |

## 🎯 Recommended Workflow

### New Project

```bash
# 1. Add toolkit
git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared
cd ai-toolkit-shared && bun install && cd ..

# 2. Auto setup
bun ai-toolkit-shared/scripts/init.js
# Choose "Auto" mode

# 3. Start coding!
# Your AI assistant now knows everything about your project
```

### Existing Project

```bash
# 1. Health check
bun ai-toolkit-shared/scripts/health.js

# 2. Update if needed
cd ai-toolkit-shared && git pull && cd ..

# 3. Adjust config if needed
bun ai-toolkit-shared/scripts/browse.js

# 4. Sync
bun ai-toolkit-shared/scripts/sync.js
```

### Active Development

```bash
# Start watch mode
bun ai-toolkit-shared/scripts/sync.js --watch

# Edit config as needed
# Configs auto-update on save

# When done, Ctrl+C to stop
```

## 🆘 Troubleshooting

### Auto-Detection Not Working

If auto-detection doesn't find your frameworks:

1. Check that config files exist (`tailwind.config.js`, `tsconfig.json`)
2. Check that dependencies are in `package.json`
3. Use "Custom" mode to manually select

### Watch Mode Not Triggering

If watch mode doesn't detect changes:

1. Make sure you're editing the correct config file
2. Save the file (some editors don't trigger file system events)
3. Check file permissions

### Health Check Shows Errors

Follow the suggested fixes in the output:

```
❌ Missing files: Cursor rules
    → Run: bun ai-toolkit-shared/scripts/sync.js
```

### Update Notifier Not Showing

- Checks only run once per 24 hours
- Run `bun scripts/health.js` to force a check
- Make sure you're in a git repository

## 📚 Next Steps

- Read [Getting Started Guide](GETTING-STARTED.md) for detailed setup
- Check [Commands Reference](COMMANDS.md) for all available commands
- See [Troubleshooting](TROUBLESHOOTING.md) for common issues
- Explore [Modules](MODULES.md) and [Agents](AGENTS.md) documentation
