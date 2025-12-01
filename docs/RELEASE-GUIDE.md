# Release Guide - Automated Versioning

How to release new versions with automatic version detection.

## 🚀 Quick Release (Recommended)

### Auto-Detect Version

Let the script determine the version based on your commits:

```bash
# Simplest way - auto-detects everything
bun run release

# Or explicitly
bun run release:auto
```text

**What it does:**
1. Analyzes your commits since last tag
2. 📝 Determines version bump type:
   - `BREAKING CHANGE` → Major (2.0.0 → 3.0.0)
   - `feat:` commits → Minor (2.0.0 → 2.1.0)
   - `fix:` commits → Patch (2.0.0 → 2.0.1)
3. 📝 Updates version, changelog, commits, tags, pushes

### Force Specific Bump

Override auto-detection:

```bash
# Force major version bump (X.0.0)
bun run release:major

# Force minor version bump (0.X.0)
bun run release:minor

# Force patch version bump (0.0.X)
bun run release:patch
```

### Manual Version

Specify exact version:

```bash
bun run release 2.1.0
```text

## 📊 How Auto-Detection Works

### Commit Analysis

The script analyzes your commits using **Conventional Commits**:

| Commit Type | Example | Bump Type |
|-------------|---------|-----------|
| Breaking | `feat!: new API` | **Major** (X.0.0) |
| Breaking | `BREAKING CHANGE: ...` | **Major** (X.0.0) |
| Feature | `feat: add feature` | **Minor** (0.X.0) |
| Fix | `fix: bug fix` | **Patch** (0.0.X) |
| Other | `chore: update deps` | **Patch** (0.0.X) |

### Examples

**Scenario 1: Feature Release**
```bash
# Your commits:
# - feat: add auto-detection
# - feat: add presets
# - fix: minor bug

# Current version: 2.0.0
bun run release
# → Detects: Minor bump (features found)
# → New version: 2.1.0
```

**Scenario 2: Bug Fix Release**
```bash
# Your commits:
# - fix: health check bug
# - fix: watch mode issue

# Current version: 2.1.0
bun run release
# → Detects: Patch bump (only fixes)
# → New version: 2.1.1
```text

**Scenario 3: Breaking Change**
```bash
# Your commits:
# - feat!: new config format
# - BREAKING CHANGE: removed old API

# Current version: 2.1.0
bun run release
# → Detects: Major bump (breaking changes)
# → New version: 3.0.0
```

## 🎯 Complete Workflow

### 1. Make Changes

```bash
# Work on features
git add .
git commit -m "feat: add new feature"

# Fix bugs
git add .
git commit -m "fix: resolve issue"
```bash

### 2. Release

```bash
# Auto-detect and release
bun run release

# Output:
# 📊 Version Analysis:
#    Current: 2.0.0
#    Commits: 5
#    Bump type: minor
#    New version: 2.1.0
#
# 🚀 Quick Release v2.1.0
# ...
# 🎉 Release v2.1.0 complete!
```

### 3. Done!

Everything is automatically:
- ✅ Version bumped
- ✅ Changelog generated
- ✅ Committed
- ✅ Merged to master
- ✅ Tagged
- ✅ Pushed
- ✅ Merged back to develop

## 💡 Best Practices

### Use Conventional Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Features
git commit -m "feat: add new feature"
git commit -m "feat(auth): add login"

# Fixes
git commit -m "fix: resolve bug"
git commit -m "fix(ui): button alignment"

# Breaking changes
git commit -m "feat!: new API"
git commit -m "feat: new API

BREAKING CHANGE: Old API removed"

# Other
git commit -m "chore: update dependencies"
git commit -m "docs: update README"
git commit -m "refactor: improve code"
```text

### Commit Often

Make small, focused commits:

```bash
# ❌ Bad
git commit -m "lots of changes"

# ✅ Good
git commit -m "feat: add auto-detection"
git commit -m "feat: add presets"
git commit -m "fix: health check bug"
```

### Review Before Release

```bash
# Dry run to see what will happen
bun run release --dry-run

# Check commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```text

## 🔧 Advanced Options

### Dry Run

See what will happen without making changes:

```bash
bun run release --dry-run
```

### Skip Changelog

If you've manually updated the changelog:

```bash
bun run release --skip-changelog
```bash

### Combine Options

```bash
# Auto-detect with dry run
bun run release --auto --dry-run

# Force minor with skip changelog
bun run release --minor --skip-changelog
```

## 📋 Quick Reference

```bash
# Auto-detect (recommended)
bun run release

# Force specific bump
bun run release:major   # X.0.0
bun run release:minor   # 0.X.0
bun run release:patch   # 0.0.X

# Manual version
bun run release 2.1.0

# With options
bun run release --dry-run
bun run release --skip-changelog
```text

## 🆘 Troubleshooting

### "No commits since last tag"

**Problem:** No new commits to analyze.

**Solution:** Make some commits first:
```bash
git add .
git commit -m "feat: your changes"
bun run release
```

### "Uncommitted changes"

**Problem:** You have uncommitted changes.

**Solution:** Commit or stash them:
```bash
git add .
git commit -m "feat: your changes"
# or
git stash
```text

### Wrong version detected

**Problem:** Auto-detection chose wrong bump type.

**Solution:** Force the correct type:
```bash
bun run release:major  # Force major
bun run release:minor  # Force minor
bun run release:patch  # Force patch
```

### Want to undo

**Problem:** Released wrong version.

**Solution:** Delete tag and revert:
```bash
# Delete local tag
git tag -d v2.1.0

# Delete remote tag
git push origin :refs/tags/v2.1.0

# Revert commits
git reset --hard HEAD~1
```text

## 🎓 Examples

### Example 1: Feature Release

```bash
# You've added new features
git log --oneline
# abc123 feat: add auto-detection
# def456 feat: add presets
# ghi789 docs: update README

# Release
bun run release

# Output:
# 📊 Version Analysis:
#    Current: 2.0.0
#    Commits: 3
#    Bump type: minor (features found)
#    New version: 2.1.0
```

### Example 2: Hotfix Release

```bash
# You've fixed critical bugs
git log --oneline
# abc123 fix: critical security issue
# def456 fix: data loss bug

# Release
bun run release

# Output:
# 📊 Version Analysis:
#    Current: 2.1.0
#    Commits: 2
#    Bump type: patch (only fixes)
#    New version: 2.1.1
```bash

### Example 3: Major Release

```bash
# You've made breaking changes
git log --oneline
# abc123 feat!: new config format
# def456 feat: remove old API

# Release
bun run release

# Output:
# 📊 Version Analysis:
#    Current: 2.1.0
#    Commits: 2
#    Bump type: major (breaking changes)
#    New version: 3.0.0
```

## 📚 More Information

- **[Conventional Commits](https://www.conventionalcommits.org/)** - Commit format
- **[Semantic Versioning](https://semver.org/)** - Version numbering

---

**Happy releasing!** 🚀
