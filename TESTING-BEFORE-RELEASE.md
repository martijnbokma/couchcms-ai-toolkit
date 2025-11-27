# Testing Before Release

How to test the new features before merging to master.

## 🎯 Why Test First?

The one-command installer (`install.sh`) only works after pushing to master. Before that, you need to test locally or from your feature branch.

## 🧪 Testing Methods

### Method 1: Local Testing (Recommended)

Test everything locally without pushing to GitHub:

```bash
# 1. Go to a test directory
cd /tmp
mkdir test-toolkit
cd test-toolkit
git init

# 2. Copy install.sh from your toolkit
cp /path/to/couchcms-ai-toolkit/install.sh .

# 3. Edit install.sh to use local path
# Change this line:
#   REPO_URL="https://github.com/martijnbokma/couchcms-ai-toolkit.git"
# To:
#   REPO_URL="/path/to/your/local/couchcms-ai-toolkit"

# 4. Run installer
bash install.sh

# 5. Test features
bun ai-toolkit-shared/scripts/health.js
bun ai-toolkit-shared/scripts/browse.js
```

### Method 2: Test from Feature Branch

If you've pushed your changes to a feature branch on GitHub:

```bash
# Replace 'your-branch-name' with your actual branch
curl -fsSL https://raw.githubusercontent.com/martijnbokma/couchcms-ai-toolkit/your-branch-name/install.sh | bash
```

**Note:** This only works if you've already pushed your branch to GitHub.

### Method 3: Manual Installation Testing

Test the manual installation flow:

```bash
# 1. Create test directory
mkdir test-manual
cd test-manual
git init

# 2. Add toolkit as submodule (use local path for testing)
git submodule add /path/to/your/local/couchcms-ai-toolkit ai-toolkit-shared

# 3. Install dependencies
cd ai-toolkit-shared
bun install
cd ..

# 4. Run setup
bun ai-toolkit-shared/scripts/init.js
```

## ✅ What to Test

### 1. Auto-Detection

```bash
# Create a test project with package.json
echo '{"dependencies": {"tailwindcss": "^3.0.0", "alpinejs": "^3.0.0"}}' > package.json

# Run init
bun ai-toolkit-shared/scripts/init.js

# Choose mode 1 (Auto)
# Verify it detects TailwindCSS and Alpine.js
```

### 2. Project Presets

```bash
# Run init
bun ai-toolkit-shared/scripts/init.js

# Choose mode 2 (Preset)
# Select "Blog" preset
# Verify correct modules are selected
```

### 3. Watch Mode

```bash
# Terminal 1: Start watch mode
bun ai-toolkit-shared/scripts/sync.js --watch

# Terminal 2: Edit config
vim .project/standards.md
# Add a module
# Save

# Terminal 1: Verify auto-sync happens
```

### 4. Health Check

```bash
bun ai-toolkit-shared/scripts/health.js

# Should show:
# ✅ Toolkit structure is valid
# ✅ Dependencies installed
# ✅ Configuration found
# etc.
```

### 5. Interactive Browser

```bash
bun ai-toolkit-shared/scripts/browse.js

# Test keyboard navigation:
# - ↑↓ to move
# - Space to toggle
# - Enter to save
# - Q to quit
```

### 6. Update Notifier

```bash
# Run sync (notifier is integrated)
bun ai-toolkit-shared/scripts/sync.js

# If toolkit has updates, should show notification
# (May not show if testing locally)
```

## 🐛 Common Issues During Testing

### Issue: "Git submodule not found"

**Solution:** Make sure you're using the correct path:
```bash
# For local testing, use absolute path
git submodule add /absolute/path/to/couchcms-ai-toolkit ai-toolkit-shared
```

### Issue: "Dependencies not installed"

**Solution:** Install dependencies manually:
```bash
cd ai-toolkit-shared
bun install
cd ..
```

### Issue: "Scripts not executable"

**Solution:** Make scripts executable:
```bash
chmod +x ai-toolkit-shared/scripts/*.js
```

### Issue: "Module not found"

**Solution:** Check if you're in the right directory:
```bash
pwd  # Should be in your test project root
ls ai-toolkit-shared  # Should show toolkit files
```

## 📋 Test Checklist

Before releasing, verify:

- [ ] Auto-detection works
  - [ ] Detects project type
  - [ ] Detects frameworks
  - [ ] Detects languages
  - [ ] Recommends correct modules

- [ ] Project presets work
  - [ ] All 8 presets available
  - [ ] Correct modules selected
  - [ ] Configs generated

- [ ] Watch mode works
  - [ ] Detects file changes
  - [ ] Auto-syncs configs
  - [ ] Debouncing works
  - [ ] Ctrl+C stops gracefully

- [ ] Health check works
  - [ ] Shows toolkit status
  - [ ] Shows config status
  - [ ] Shows file status
  - [ ] Shows update status

- [ ] Interactive browser works
  - [ ] Shows all modules
  - [ ] Keyboard navigation works
  - [ ] Selection works
  - [ ] Dependencies auto-select

- [ ] Update notifier works
  - [ ] Checks for updates
  - [ ] Shows notification
  - [ ] Caches results

- [ ] Installer works (after push)
  - [ ] Bash installer
  - [ ] Bun installer
  - [ ] Manual installation

## 🚀 After Testing

Once all tests pass:

1. Commit all changes
2. Push to your feature branch (if applicable)
3. Create Pull Request to master (if using PR workflow)
4. Or merge directly to master
5. Create git tag v2.1.0
6. Push tag to GitHub
7. Create GitHub release
8. Test one-command install from master

## 📝 Test Results Template

Use this template to document your test results:

```markdown
# Test Results - v2.1.0

**Date:** YYYY-MM-DD
**Tester:** Your Name
**Environment:** macOS/Linux/Windows

## Auto-Detection
- [ ] ✅ Detects project type
- [ ] ✅ Detects frameworks
- [ ] ✅ Recommends modules

## Presets
- [ ] ✅ All presets available
- [ ] ✅ Modules selected correctly

## Watch Mode
- [ ] ✅ Detects changes
- [ ] ✅ Auto-syncs

## Health Check
- [ ] ✅ Shows status correctly

## Interactive Browser
- [ ] ✅ Navigation works
- [ ] ✅ Selection works

## Issues Found
- None / List issues here

## Overall Status
✅ Ready for release / ❌ Needs fixes
```

## 💡 Tips

1. **Test in a clean directory** - Don't test in the toolkit directory itself
2. **Use absolute paths** - When testing locally, use absolute paths
3. **Test all modes** - Auto, Preset, Simple, Custom
4. **Test edge cases** - Empty project, existing config, etc.
5. **Document issues** - Note any problems you find

## 🆘 Need Help?

If you encounter issues during testing:

1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Run health check: `bun scripts/health.js`
3. Check script output for errors
4. Verify file permissions
5. Try manual installation to isolate the issue

---

**Happy testing!** 🧪
