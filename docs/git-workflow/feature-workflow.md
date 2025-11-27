# Feature Workflow - Detailed Guide

> **Complete guide** for working with feature branches from start to finish.

## Overview

Feature branches are where you do your daily work. They're isolated from other developers, so you can experiment freely without breaking anything.

**Lifecycle:** develop → feature → develop

```
develop ──●────────────────────●──→
           ↓                    ↑
feature   ●──●──●──●──●──●──●──●
          start              finish
```

## When to Use Feature Branches

Use a feature branch for:
- ✅ New functionality
- ✅ Bug fixes
- ✅ Refactoring
- ✅ Documentation updates
- ✅ Any change that takes more than 5 minutes

Don't use for:
- ❌ Hotfixes (use hotfix branch)
- ❌ Release preparation (use release branch)
- ❌ Tiny typo fixes (can go directly via PR)

## Complete Workflow

### Phase 1: Planning

**Before you start coding:**

1. Check if someone else is working on this
2. Break large features into smaller pieces
3. Estimate: Can this be done in 1-3 days?
4. If >3 days, split it up

### Phase 2: Starting the Feature

**Step 1: Update develop**

```bash
# Switch to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Verify you're up to date
git status
# Should say: "Your branch is up to date with 'origin/develop'"
```

**Step 2: Create feature branch**

```bash
# Using the script (recommended)
bun scripts/git-flow.js feature start my-feature-name

# Or manually
git checkout -b feature/my-feature-name
```

**Naming conventions:**

Good names:
- `add-search-module`
- `fix-login-bug`
- `refactor-api-client`
- `update-tailwind-config`

Bad names:
- `feature` (too vague)
- `my-changes` (not descriptive)
- `test` (unclear purpose)
- `fix` (what fix?)

**Step 3: Verify setup**

```bash
# Check you're on the right branch
git branch
# * feature/my-feature-name

# Check it's based on develop
git log --oneline -1
```

### Phase 3: Development

**Working on your feature:**

```bash
# Make changes to files
# ... edit code ...

# Check what changed
git status
git diff

# Stage changes
git add .
# Or specific files
git add src/module.js src/module.test.js

# Commit with clear message
git commit -m "Add basic search functionality"

# Continue working
# ... more edits ...
git add .
git commit -m "Add search filters"

# Push to GitHub (backup + visibility)
git push origin feature/my-feature-name
```

**Commit frequency:**

```bash
# Good: Small, logical commits
git commit -m "Add search input component"
git commit -m "Add search results display"
git commit -m "Add search filters"
git commit -m "Add search tests"

# Bad: One huge commit
git commit -m "Add entire search feature"
```

**Commit message format:**

```bash
# Format: <type>: <description>

# Types:
feat: Add new feature
fix: Fix a bug
refactor: Refactor code
docs: Update documentation
test: Add tests
style: Format code
chore: Maintenance tasks

# Examples:
git commit -m "feat: Add user search functionality"
git commit -m "fix: Resolve login timeout issue"
git commit -m "refactor: Simplify API client code"
git commit -m "docs: Update installation guide"
git commit -m "test: Add unit tests for search"
```

### Phase 4: Keeping Up to Date

**Why update?**
- Avoid conflicts later
- Get latest bug fixes
- Stay compatible with team's work

**How often?**
- Daily if team is active
- Before finishing feature
- When you see relevant changes

**Method 1: Merge (simpler)**

```bash
# Save your work
git add .
git commit -m "WIP: work in progress"

# Get latest develop
git checkout develop
git pull origin develop

# Merge into your feature
git checkout feature/my-feature-name
git merge develop

# Resolve conflicts if any
# Continue working
```

**Method 2: Rebase (cleaner history)**

```bash
# Save your work
git add .
git commit -m "WIP: work in progress"

# Rebase on latest develop
git fetch origin
git rebase origin/develop

# If conflicts:
# 1. Resolve conflicts in files
# 2. git add .
# 3. git rebase --continue

# Force push (your branch only!)
git push --force origin feature/my-feature-name
```

### Phase 5: Testing

**Before finishing:**

```bash
# Run tests locally
bun test

# Run linting
bun run lint

# Test the feature manually
# - Does it work as expected?
# - Are there edge cases?
# - Does it break anything else?

# Check code quality
# - Remove console.log()
# - Remove commented code
# - Add comments where needed
# - Follow project standards
```

### Phase 6: Finishing the Feature

**Step 1: Final update**

```bash
# Get absolute latest
git checkout develop
git pull origin develop
git checkout feature/my-feature-name
git merge develop

# Resolve any conflicts
# Run tests again
bun test
```

**Step 2: Push final version**

```bash
# Push all commits
git push origin feature/my-feature-name
```

**Step 3: Create Pull Request**

```bash
# Using script (recommended)
bun scripts/git-flow.js feature finish my-feature-name

# This will:
# - Push your branch
# - Create PR on GitHub
# - Apply PR template
# - Request reviews
```

**Or manually on GitHub:**
1. Go to repository
2. Click "Pull requests"
3. Click "New pull request"
4. Select: base: `develop` ← compare: `feature/my-feature-name`
5. Fill in PR template
6. Click "Create pull request"

### Phase 7: Code Review

**After creating PR:**

1. **Wait for review** (usually 1-2 days)
2. **Respond to feedback**
   - Answer questions
   - Make requested changes
   - Push updates

```bash
# Making changes after review
git checkout feature/my-feature-name

# Make changes
# ... edit files ...

git add .
git commit -m "Address review feedback"
git push origin feature/my-feature-name

# PR updates automatically!
```

3. **Get approval**
   - At least 1 approval needed
   - All checks must pass
   - No unresolved conversations

### Phase 8: Merging

**After approval:**

1. **Squash and merge** (recommended)
   - Combines all commits into one
   - Cleaner history
   - Click "Squash and merge" on GitHub

2. **Regular merge**
   - Keeps all commits
   - More detailed history
   - Click "Merge pull request"

**After merge:**
- ✅ Feature branch deleted automatically
- ✅ Code is now in develop
- ✅ Available for next release

**Cleanup locally:**

```bash
# Switch back to develop
git checkout develop

# Pull merged changes
git pull origin develop

# Delete local feature branch
git branch -d feature/my-feature-name

# Verify it's gone
git branch
```

## Advanced Scenarios

### Working with Multiple Commits

**Squashing commits before PR:**

```bash
# Combine last 3 commits into 1
git rebase -i HEAD~3

# In editor, change 'pick' to 'squash' for commits to combine
# Save and exit
# Edit combined commit message
# Force push
git push --force origin feature/my-feature-name
```

### Splitting a Large Feature

**If feature is too big:**

```bash
# Create sub-features
bun scripts/git-flow.js feature start search-part1-ui
# Work on UI
bun scripts/git-flow.js feature finish search-part1-ui

bun scripts/git-flow.js feature start search-part2-backend
# Work on backend
bun scripts/git-flow.js feature finish search-part2-backend

bun scripts/git-flow.js feature start search-part3-integration
# Integrate parts
bun scripts/git-flow.js feature finish search-part3-integration
```

### Collaborating on a Feature

**Two developers, one feature:**

Developer A:
```bash
bun scripts/git-flow.js feature start shared-feature
git push origin feature/shared-feature
```

Developer B:
```bash
git fetch origin
git checkout feature/shared-feature
# Work together
git pull origin feature/shared-feature  # Get A's changes
git push origin feature/shared-feature  # Share your changes
```

### Abandoning a Feature

**If feature is no longer needed:**

```bash
# Delete local branch
git checkout develop
git branch -D feature/abandoned-feature

# Delete remote branch
git push origin --delete feature/abandoned-feature

# Or close PR without merging
```

## Best Practices

### Do's ✅

- **Commit often** - Small, logical commits
- **Push daily** - Backup and visibility
- **Update regularly** - Merge develop often
- **Test before PR** - Run all tests
- **Write clear messages** - Explain what and why
- **Keep it small** - 1-3 days maximum
- **Ask for help** - When stuck

### Don'ts ❌

- **Don't commit to develop** - Always use feature branch
- **Don't force push shared branches** - Only your own
- **Don't commit large files** - Use .gitignore
- **Don't commit secrets** - API keys, passwords
- **Don't work on multiple features** - One branch per feature
- **Don't ignore conflicts** - Resolve immediately
- **Don't skip tests** - Always test before PR

## Troubleshooting

### "My feature branch is behind develop"

```bash
git checkout feature/my-feature
git merge develop
# Or
git rebase develop
```

### "I have merge conflicts"

See [Troubleshooting Guide](troubleshooting.md#merge-conflicts)

### "My PR checks are failing"

```bash
# Run checks locally
bun test
bun run lint

# Fix issues
git add .
git commit -m "Fix test failures"
git push origin feature/my-feature
```

### "I need to change my PR"

```bash
# Just commit and push
git add .
git commit -m "Update based on feedback"
git push origin feature/my-feature
# PR updates automatically
```

## Checklist

Before creating PR:

- [ ] All tests pass locally
- [ ] Code follows project standards
- [ ] No console.log() or debug code
- [ ] No commented-out code
- [ ] Clear commit messages
- [ ] Updated from latest develop
- [ ] Feature works as expected
- [ ] Documentation updated (if needed)

## Quick Reference

```bash
# Start feature
git checkout develop
git pull origin develop
bun scripts/git-flow.js feature start name

# Work on feature
git add .
git commit -m "message"
git push origin feature/name

# Update from develop
git merge develop

# Finish feature
bun scripts/git-flow.js feature finish name

# List all features
bun scripts/git-flow.js feature list

# Delete feature
git branch -D feature/name
git push origin --delete feature/name
```

## Related Guides

- [Getting Started](getting-started.md)
- [Troubleshooting](troubleshooting.md)
- [Release Workflow](release-workflow.md)
- [Hotfix Workflow](hotfix-workflow.md)

---

**Happy coding!** Remember: small features, frequent commits, regular updates. 🚀
