---
name: Git Agent
version: "1.0"
description: Daily Git workflow and version control helper
type: daily
---

# Git Agent

**Quick Daily Tool**: Version Control & Collaboration
**Use For**: Code management, team collaboration, deployment, history tracking
**Time**: 1-3 minutes

## Quick Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

## Common Git Tasks

### 1. Daily Workflow

**Problem**: Manage daily development workflow
**Solution**:

```bash
# Morning routine
git pull origin main
git status

# During development
git add .
git commit -m "feat: implement user authentication"

# End of day
git push origin main
```

### 2. Feature Development

**Problem**: Work on new features without conflicts
**Solution**:

```bash
# Create feature branch
git checkout -b feature/user-authentication
git push -u origin feature/user-authentication

# Work on feature
git add .
git commit -m "feat: add login form validation"

# Merge back to main
git checkout main
git pull origin main
git merge --no-ff feature/user-authentication
git push origin main

# Clean up
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### 3. Conflict Resolution

**Problem**: Merge conflicts during collaboration
**Solution**:

```bash
# Pull latest changes
git pull origin main

# If conflicts occur, resolve them
git status
# Edit conflicted files
# Remove conflict markers (<<<<<<< ======= >>>>>>>)

# After resolving
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main
```

### 4. History Management

**Problem**: Clean up commit history
**Solution**:

```bash
# Interactive rebase
git rebase -i HEAD~3

# Squash commits
# Change 'pick' to 'squash' for commits to combine

# Force push (use carefully)
git push --force-with-lease origin main
```

## Daily Git Checklist

### Morning Startup (30 seconds)

- [ ] `git pull origin main`
- [ ] Check for any conflicts
- [ ] Review recent commits
- [ ] Check branch status

### During Development (1-2 minutes)

- [ ] `git add .` (stage changes)
- [ ] `git commit -m "type: description"` (commit changes)
- [ ] `git push origin branch-name` (push changes)
- [ ] Check for any issues

### End of Day (1 minute)

- [ ] `git status` (check for uncommitted changes)
- [ ] `git push origin main` (push final changes)
- [ ] Clean up local branches
- [ ] Review tomorrow's tasks

## Quick Fixes for Common Issues

### "Your branch is ahead of origin"

```bash
# Push your changes
git push origin main

# Or if you want to pull first
git pull origin main
git push origin main
```

### "Merge conflict"

```bash
# Check conflicted files
git status

# Resolve conflicts manually
# Edit files to remove conflict markers

# After resolving
git add .
git commit -m "fix: resolve merge conflicts"
```

### "Nothing to commit, working tree clean"

```bash
# Check if you have changes
git status

# If you have changes, add them
git add .
git commit -m "feat: your changes"

# If no changes, you're good to go
```

### "Branch is behind"

```bash
# Pull latest changes
git pull origin main

# If you have local changes, stash them first
git stash
git pull origin main
git stash pop
```

## Commit Message Convention

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(ui): resolve mobile navigation issue"
git commit -m "docs(api): update API documentation"
git commit -m "refactor(db): optimize database queries"
git commit -m "chore(deps): update dependencies"
```

## Branch Management

### Feature Branches

```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "feat: add new feature"

# Push feature branch
git push -u origin feature/new-feature

# Create pull request
# After merge, clean up
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Hotfix Branches

```bash
# Create hotfix branch
git checkout -b hotfix/security-patch

# Fix the issue
git add .
git commit -m "fix: patch security vulnerability"

# Push and merge
git push -u origin hotfix/security-patch
# Create pull request and merge
```

## Team Collaboration

### Code Review Process

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Push and create pull request
git push -u origin feature/new-feature

# After review and approval, merge
git checkout main
git pull origin main
git merge --no-ff feature/new-feature
git push origin main
```

### Stashing Work

```bash
# Stash current work
git stash push -m "WIP: working on feature"

# Switch branches
git checkout main
git pull origin main

# Return to feature branch
git checkout feature/my-feature
git stash pop
```

## Success Indicators

### Healthy Git Workflow

- ✅ Clean commit history
- ✅ Proper branch management
- ✅ No merge conflicts
- ✅ Regular pushes
- ✅ Clear commit messages

### Warning Signs

- ⚠️ Uncommitted changes
- ⚠️ Merge conflicts
- ⚠️ Messy commit history
- ⚠️ Unpushed commits
- ⚠️ Orphaned branches

## Emergency Procedures

### Lost Commits

```bash
# Check reflog
git reflog

# Find lost commit
git checkout HEAD@{2}

# Recover commit
git cherry-pick abc123
```

### Accidentally Deleted Branch

```bash
# Check reflog
git reflog

# Recreate branch
git checkout -b feature-name HEAD@{2}
```

### Force Push Issues

```bash
# Check what you're about to overwrite
git log --oneline origin/main..HEAD

# Use force-with-lease for safety
git push --force-with-lease origin main
```

---

**This agent helps you maintain a clean, organized Git workflow for efficient team collaboration.**
