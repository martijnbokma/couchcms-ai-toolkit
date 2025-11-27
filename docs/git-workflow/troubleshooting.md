# Troubleshooting Guide

> **Stuck?** This guide covers common issues and how to solve them.

## Table of Contents

- [Merge Conflicts](#merge-conflicts)
- [Branch Issues](#branch-issues)
- [Commit Problems](#commit-problems)
- [Push/Pull Errors](#pushpull-errors)
- [GitHub Issues](#github-issues)
- [Script Errors](#script-errors)

## Merge Conflicts

### What is a Merge Conflict?

A conflict happens when two people change the same lines in a file. Git doesn't know which version to keep.

### Identifying Conflicts

```bash
# Git will tell you
git pull origin develop
# Auto-merging file.js
# CONFLICT (content): Merge conflict in file.js
# Automatic merge failed; fix conflicts and then commit the result.

# See which files have conflicts
git status
# both modified: file.js
```

### Resolving Conflicts

**Step 1: Open the conflicted file**

You'll see markers like this:

```javascript
function example() {
<<<<<<< HEAD (your changes)
    return "your version";
=======
    return "their version";
>>>>>>> develop (their changes)
}
```

**Step 2: Choose what to keep**

Option A - Keep your version:
```javascript
function example() {
    return "your version";
}
```

Option B - Keep their version:
```javascript
function example() {
    return "their version";
}
```

Option C - Combine both:
```javascript
function example() {
    return "combined version";
}
```

**Step 3: Remove conflict markers**

Delete these lines:
- `<<<<<<< HEAD`
- `=======`
- `>>>>>>> develop`

**Step 4: Mark as resolved**

```bash
# Stage the resolved file
git add file.js

# Commit the resolution
git commit -m "Resolve merge conflict in file.js"

# Push if needed
git push origin feature/your-feature
```

### Avoiding Conflicts

```bash
# Pull often (daily)
git checkout develop
git pull origin develop

# Rebase your feature on latest develop
git checkout feature/your-feature
git rebase develop

# If conflicts during rebase
# 1. Resolve conflicts
# 2. git add .
# 3. git rebase --continue
```

## Branch Issues

### "I'm on the wrong branch!"

```bash
# Check current branch
git branch
# * feature/wrong-branch

# Switch to correct branch
git checkout feature/correct-branch

# Or create new branch
bun scripts/git-flow.js feature start correct-branch
```

### "I made changes on develop!"

```bash
# Don't panic! Stash your changes
git stash

# Create proper feature branch
bun scripts/git-flow.js feature start my-feature

# Apply your changes
git stash pop

# Now commit properly
git add .
git commit -m "Your message"
```

### "I can't switch branches - uncommitted changes"

```bash
# Option 1: Commit your changes
git add .
git commit -m "WIP: work in progress"

# Option 2: Stash your changes
git stash
# ... switch branches ...
git stash pop  # when you come back

# Option 3: Force switch (loses changes!)
git checkout -f other-branch  # CAREFUL!
```

### "My branch is behind develop"

```bash
# Update your branch
git checkout feature/your-feature
git pull origin develop

# Or rebase (cleaner history)
git checkout feature/your-feature
git rebase develop
```

### "I have a stale branch"

```bash
# Check branch age
bun scripts/git-flow.js check-stale

# Update old branch
git checkout feature/old-branch
git rebase develop

# Or delete if not needed
git branch -D feature/old-branch
git push origin --delete feature/old-branch
```

## Commit Problems

### "I committed to the wrong branch"

```bash
# Copy commit hash
git log --oneline
# abc1234 Your commit message

# Switch to correct branch
git checkout feature/correct-branch

# Apply the commit
git cherry-pick abc1234

# Go back and remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### "My commit message is wrong"

```bash
# Change last commit message
git commit --amend -m "Correct message"

# If already pushed (careful!)
git push --force origin feature/your-branch
```

### "I want to undo my last commit"

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes AND commit
git reset --hard HEAD~1  # CAREFUL!

# Undo multiple commits
git reset --soft HEAD~3  # undo last 3
```

### "I committed sensitive data"

```bash
# Remove from last commit
git rm --cached sensitive-file
git commit --amend -m "Remove sensitive file"

# If already pushed - contact maintainer immediately!
# May need to rewrite history
```

## Push/Pull Errors

### "Push rejected - not fast-forward"

```bash
# Someone else pushed to your branch
# Pull their changes first
git pull origin feature/your-branch

# Resolve any conflicts
# Then push
git push origin feature/your-branch
```

### "Push rejected - protected branch"

```bash
# You're trying to push to main or develop directly
# This is not allowed!

# Create a feature branch instead
bun scripts/git-flow.js feature start my-feature

# Or if you have commits on develop
git checkout -b feature/my-feature
git push origin feature/my-feature
```

### "Authentication failed"

```bash
# Check your GitHub credentials
git config --list | grep user

# Update credentials
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# For HTTPS, you may need a personal access token
# See: https://github.com/settings/tokens
```

### "Connection timeout"

```bash
# Check internet connection
ping github.com

# Try again
git pull origin develop

# If persistent, check firewall/proxy settings
```

## GitHub Issues

### "Pull Request checks failing"

**Linting errors:**
```bash
# Run linting locally
bun run lint

# Fix issues
# Commit and push
git add .
git commit -m "Fix linting errors"
git push origin feature/your-branch
```

**Test failures:**
```bash
# Run tests locally
bun test

# Fix failing tests
# Commit and push
```

**Merge conflicts:**
```bash
# Update your branch
git pull origin develop

# Resolve conflicts (see above)
# Push resolved version
```

### "Can't merge Pull Request"

**Reasons:**
- ❌ Checks not passing → Fix and push
- ❌ No approval → Wait for review
- ❌ Conflicts → Resolve conflicts
- ❌ Branch protection → Follow rules

### "Pull Request was closed"

```bash
# Reopen if needed
# Or create new PR from same branch
bun scripts/git-flow.js feature finish your-feature
```

## Script Errors

### "git-flow.js not found"

```bash
# Make sure you're in project root
cd couchcms-ai-toolkit

# Check if file exists
ls scripts/git-flow.js

# If missing, pull latest
git pull origin develop
```

### "Bun command not found"

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or use npm
npm install -g bun

# Verify installation
bun --version
```

### "Script fails with error"

```bash
# Check your Git status
git status

# Make sure you're on correct branch
git branch

# Try with verbose output
DEBUG=1 bun scripts/git-flow.js feature start name

# If still failing, create an issue with:
# - Full error message
# - Command you ran
# - Git status output
```

## Emergency Procedures

### "I broke everything!"

```bash
# Don't panic! Git remembers everything

# See recent actions
git reflog

# Go back to before you broke it
git reset --hard HEAD@{5}  # adjust number

# Or restore from remote
git fetch origin
git reset --hard origin/develop
```

### "I need to start over"

```bash
# Save your work first!
git stash

# Reset to clean state
git checkout develop
git reset --hard origin/develop

# Create fresh feature branch
bun scripts/git-flow.js feature start fresh-start

# Restore your work if needed
git stash pop
```

### "I accidentally deleted my branch"

```bash
# Find the commit
git reflog | grep "your-branch"

# Recreate branch
git checkout -b feature/your-branch abc1234
```

## Getting Help

### Before Asking for Help

1. Read error message carefully
2. Check this troubleshooting guide
3. Search GitHub issues
4. Try Google with exact error message

### When Asking for Help

Provide:
- ✅ Exact command you ran
- ✅ Full error message
- ✅ Output of `git status`
- ✅ Output of `git branch`
- ✅ What you were trying to do
- ✅ What you expected to happen

### Where to Get Help

- 💬 Team chat channel (fastest)
- 🐛 GitHub issues (for bugs)
- 📧 Maintainer email (for sensitive issues)
- 📖 [Main Workflow Guide](../GIT-WORKFLOW.md)

## Prevention Tips

### Daily Habits

```bash
# Start of day
git checkout develop
git pull origin develop

# Before starting work
bun scripts/git-flow.js feature start todays-work

# During work
git status  # check often
git add .
git commit -m "clear message"

# End of day
git push origin feature/todays-work
```

### Best Practices

- ✅ Commit often (small commits)
- ✅ Pull daily
- ✅ Keep features small (1-3 days)
- ✅ Write clear commit messages
- ✅ Test before pushing
- ✅ Ask when unsure

### What NOT to Do

- ❌ Don't commit to main/develop directly
- ❌ Don't force push to shared branches
- ❌ Don't commit large files
- ❌ Don't commit sensitive data
- ❌ Don't work on develop branch
- ❌ Don't ignore conflicts

## Quick Reference

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# Save work temporarily
git stash
git stash pop

# Update branch from develop
git pull origin develop

# See what changed
git status
git diff

# See history
git log --oneline

# Find lost commits
git reflog
```

---

**Still stuck?** Don't hesitate to ask for help! Everyone gets stuck sometimes. 🤝
