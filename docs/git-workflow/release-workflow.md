# Release Workflow - Detailed Guide

> **For release managers** - How to prepare and deploy a new version to production.

## Overview

Release branches are used to prepare a new production version. They allow final testing and bug fixes while development continues on new features.

**Lifecycle:** develop → release → main + develop

```text
develop ──●──●──●──●────────────●──→
           ↓                    ↑
release   ●──●──●──●──●──●──●──●
          start              finish
                              ↓
main ─────────────────────────●──→
                           (tagged)
```

## When to Create a Release

Create a release when:
- ✅ All planned features for version are in develop
- ✅ Develop is stable and tested
- ✅ Ready to deploy to production
- ✅ Following release schedule (e.g., monthly)

Don't create a release when:
- ❌ Features are still in progress
- ❌ Tests are failing
- ❌ Major bugs exist
- ❌ Just for one small change (use hotfix)

## Versioning

We use **Semantic Versioning** (semver): `MAJOR.MINOR.PATCH`

```text
v1.2.3
│ │ │
│ │ └─ PATCH: Bug fixes (1.2.3 → 1.2.4)
│ └─── MINOR: New features (1.2.3 → 1.3.0)
└───── MAJOR: Breaking changes (1.2.3 → 2.0.0)
```

**Examples:**
- `1.0.0` → `1.1.0` - Added new module (minor)
- `1.1.0` → `1.1.1` - Fixed bug (patch)
- `1.1.1` → `2.0.0` - Changed API (major)

**Choosing version number:**

```bash
# Current version: 1.2.3

# Added features, no breaking changes
# → 1.3.0

# Only bug fixes
# → 1.2.4

# Breaking changes (API changes, removed features)
# → 2.0.0
```text

## Complete Workflow

### Phase 1: Pre-Release Preparation

**Step 1: Verify develop is ready**

```bash
# Switch to develop
git checkout develop
git pull origin develop

# Run all tests
bun test

# Run validation
bun scripts/cli/validate.js

# Check for open PRs
# - Review GitHub for pending PRs
# - Merge or postpone to next release
```

**Step 2: Review changes since last release**

```bash
# See what's new
git log v1.2.0..develop --oneline

# Or use script
bun scripts/git-flow.js changelog

# Review:
# - What features were added?
# - What bugs were fixed?
# - Any breaking changes?
```yaml

**Step 3: Decide version number**

Based on changes:
- Breaking changes? → Major version
- New features? → Minor version
- Only fixes? → Patch version

### Phase 2: Creating the Release

**Step 1: Create release branch**

```bash
# Using script (recommended)
bun scripts/git-flow.js release start 1.3.0

# Or manually
git checkout -b release/1.3.0 develop
```

**What happened:**
- ✅ Created `release/1.3.0` from `develop`
- ✅ Switched to release branch
- ✅ Ready for final preparations

**Step 2: Update version numbers**

```bash
# Update package.json
# Change: "version": "1.2.0"
# To: "version": "1.3.0"

# Update other version references
# - README.md
# - CHANGELOG.md
# - Documentation

# Commit version bump
git add .
git commit -m "chore: Bump version to 1.3.0"
```bash

**Step 3: Generate changelog**

```bash
# Generate changelog
bun scripts/git-flow.js changelog > CHANGELOG-1.3.0.md

# Review and edit
# - Group by type (features, fixes, etc.)
# - Add descriptions
# - Highlight breaking changes

# Update main CHANGELOG.md
# Add new version section at top

git add CHANGELOG.md
git commit -m "docs: Update changelog for v1.3.0"
```

**Step 4: Push release branch**

```bash
git push origin release/1.3.0
```text

### Phase 3: Release Testing

**Step 1: Deploy to staging**

```bash
# Deploy release branch to staging environment
# (Deployment process depends on your setup)

# Example:
git checkout release/1.3.0
# ... deploy to staging ...
```

**Step 2: Test thoroughly**

Test checklist:
- [ ] All features work as expected
- [ ] No regressions (old features still work)
- [ ] Performance is acceptable
- [ ] Documentation is accurate
- [ ] No console errors
- [ ] Mobile responsive (if applicable)
- [ ] Cross-browser compatible

**Step 3: Fix bugs found**

```bash
# On release branch
git checkout release/1.3.0

# Fix bug
# ... edit files ...

git add .
git commit -m "fix: Resolve issue with search filters"

# Push fix
git push origin release/1.3.0

# Re-test
# Repeat until stable
```text

**Important:** Only bug fixes on release branch!
- ✅ Bug fixes
- ✅ Documentation updates
- ✅ Version number corrections
- ❌ New features (save for next release)
- ❌ Refactoring (unless fixing bug)

### Phase 4: Finalizing the Release

**Step 1: Final checks**

```bash
# All tests pass
bun test

# All validations pass
bun scripts/cli/validate.js

# Version numbers correct
grep version package.json

# Changelog complete
cat CHANGELOG.md
```

**Step 2: Create Pull Requests**

```bash
# Using script (recommended)
bun scripts/git-flow.js release finish 1.3.0
```yaml

**This creates TWO pull requests:**

1. **release/1.3.0 → main**
   - Deploys to production
   - Creates version tag
   - Triggers release workflow

2. **release/1.3.0 → develop**
   - Merges bug fixes back
   - Keeps develop up to date

**Or manually:**

PR to main:
```
Title: Release v1.3.0
Base: main
Compare: release/1.3.0

Description:
## Release v1.3.0

### New Features
- Feature 1
- Feature 2

### Bug Fixes
- Fix 1
- Fix 2

### Breaking Changes
- None

Closes #123, #124
```text

PR to develop:
```
Title: Merge release v1.3.0 back to develop
Base: develop
Compare: release/1.3.0

Description:
Merging release branch back to develop to include any bug fixes made during release preparation.
```text

### Phase 5: Deployment

**Step 1: Merge to main**

```bash
# After PR approval
# Merge release/1.3.0 → main on GitHub

# This triggers:
# - Version tag creation (v1.3.0)
# - GitHub release creation
# - Deployment to production (if automated)
```

**Step 2: Verify deployment**

```bash
# Check production
# - Visit production URL
# - Test critical features
# - Check version number
# - Monitor error logs
```text

**Step 3: Merge back to develop**

```bash
# Merge release/1.3.0 → develop on GitHub

# This ensures:
# - Bug fixes are in develop
# - Version numbers match
# - Changelog is updated
```

**Step 4: Cleanup**

```bash
# Delete release branch (automatic after merge)
# Or manually:
git push origin --delete release/1.3.0
git branch -D release/1.3.0

# Switch back to develop
git checkout develop
git pull origin develop
```text

### Phase 6: Post-Release

**Step 1: Announce release**

- 📢 Post in team chat
- 📧 Email stakeholders
- 🐦 Social media (if public)
- 📝 Update documentation site

**Step 2: Monitor production**

```bash
# Watch for issues
# - Error monitoring
# - User feedback
# - Performance metrics

# First 24 hours are critical!
```

**Step 3: Create GitHub release**

If not automated:

1. Go to GitHub → Releases
2. Click "Draft a new release"
3. Tag: `v1.3.0`
4. Title: `Release v1.3.0`
5. Description: Copy from CHANGELOG
6. Publish release

**Step 4: Update documentation**

- Update version in docs
- Add migration guide (if breaking changes)
- Update examples
- Refresh screenshots

## Emergency Procedures

### "Found critical bug after release"

**Don't panic!** Use hotfix workflow:

```bash
# Create hotfix from main
bun scripts/git-flow.js hotfix start critical-fix

# Fix the bug
# ... edit files ...

git add .
git commit -m "fix: Resolve critical issue"

# Finish hotfix (creates v1.3.1)
bun scripts/git-flow.js hotfix finish critical-fix
```text

See [Hotfix Workflow](hotfix-workflow.md)

### "Need to abort release"

```bash
# If release not yet merged to main
# Just delete the release branch

git checkout develop
git branch -D release/1.3.0
git push origin --delete release/1.3.0

# Continue development
# Try again later
```

### "Merge conflicts during finish"

```bash
# Resolve conflicts in PR
# Or locally:

git checkout release/1.3.0
git merge main
# Resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
git push origin release/1.3.0
```text

## Best Practices

### Do's ✅

- **Test thoroughly** - Staging environment
- **Only bug fixes** - No new features
- **Update changelog** - Document all changes
- **Version correctly** - Follow semver
- **Communicate** - Keep team informed
- **Monitor production** - Watch for issues
- **Document breaking changes** - Migration guides

### Don'ts ❌

- **Don't rush** - Take time to test
- **Don't add features** - Save for next release
- **Don't skip testing** - Always test on staging
- **Don't forget changelog** - Document everything
- **Don't deploy Friday** - Give time to fix issues
- **Don't ignore warnings** - Address all concerns

## Release Checklist

### Pre-Release
- [ ] All planned features merged to develop
- [ ] All tests passing
- [ ] No open critical bugs
- [ ] Version number decided
- [ ] Changelog prepared

### During Release
- [ ] Release branch created
- [ ] Version numbers updated
- [ ] Changelog finalized
- [ ] Deployed to staging
- [ ] Thoroughly tested
- [ ] Bug fixes applied
- [ ] Final tests pass

### Deployment
- [ ] PRs created (to main and develop)
- [ ] PRs reviewed and approved
- [ ] Merged to main
- [ ] Tag created
- [ ] Deployed to production
- [ ] Production verified
- [ ] Merged back to develop
- [ ] Release branch deleted

### Post-Release
- [ ] Release announced
- [ ] Documentation updated
- [ ] GitHub release created
- [ ] Monitoring active
- [ ] Team notified

## Quick Reference

```bash
# Start release
git checkout develop
git pull origin develop
bun scripts/git-flow.js release start 1.3.0

# Update version
# Edit package.json, CHANGELOG.md
git add .
git commit -m "chore: Bump version to 1.3.0"

# Fix bugs (if needed)
git add .
git commit -m "fix: Bug description"

# Finish release
bun scripts/git-flow.js release finish 1.3.0

# After merge
git checkout develop
git pull origin develop
```

## Version History Example

```yaml
v2.0.0 (2024-03-01) - Major update
  - Breaking: Changed API structure
  - Added: New authentication system
  - Removed: Deprecated endpoints

v1.3.0 (2024-02-15) - Feature release
  - Added: Search functionality
  - Added: User profiles
  - Fixed: Login timeout issue

v1.2.1 (2024-02-10) - Patch release
  - Fixed: Critical security issue
  - Fixed: Memory leak

v1.2.0 (2024-02-01) - Feature release
  - Added: Dashboard
  - Improved: Performance
```

## Related Guides

- [Hotfix Workflow](hotfix-workflow.md)
- [Feature Workflow](feature-workflow.md)
- [Troubleshooting](troubleshooting.md)

---

**Release with confidence!** Thorough testing and clear communication are key. 🚀
