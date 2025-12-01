# Getting Started with Git Workflow

> **New to the project?** This guide will get you up and running in 10 minutes.

## Prerequisites

Before you start, make sure you have:

- [ ] Git installed (`git --version`)
- [ ] Bun installed (`bun --version`)
- [ ] GitHub account with access to the repository
- [ ] Repository cloned locally

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/martijnbokma/couchcms-ai-toolkit.git

# Navigate to the directory
cd couchcms-ai-toolkit

# Install dependencies
bun install
```bash

### 2. Verify Your Setup

```bash
# Check current branch (should be main or develop)
git branch

# Check remote connection
git remote -v

# Pull latest changes
git pull origin develop
```

### 3. Configure Git (First Time Only)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```text

## Your First Feature

Let's create your first feature to get familiar with the workflow.

### Step 1: Start a Feature

```bash
# Make sure you're on develop
git checkout develop

# Pull latest changes
git pull origin develop

# Start your feature
bun scripts/git-flow.js feature start my-first-feature
```

**What happened?**
- ✅ Created branch `feature/my-first-feature` from `develop`
- ✅ Switched to your new branch
- ✅ Ready to work!

### Step 2: Make Changes

```bash
# Create or edit a file
echo "# My First Feature" > test-feature.md

# Check what changed
git status

# Stage your changes
git add test-feature.md

# Commit your changes
git commit -m "Add test feature file"
```yaml

**Commit Message Tips:**
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Be specific: "Add search module" not "Changes"
- Keep it short: < 50 characters for title

### Step 3: Push Your Changes

```bash
# Push to GitHub
git push origin feature/my-first-feature
```

### Step 4: Create Pull Request

```bash
# Finish the feature (creates PR automatically)
bun scripts/git-flow.js feature finish my-first-feature
```text

**What happened?**
- ✅ Pushed your branch to GitHub
- ✅ Created a Pull Request to `develop`
- ✅ Applied PR template
- ✅ Triggered automated checks

### Step 5: Wait for Review

1. Go to GitHub and find your Pull Request
2. Wait for team member to review
3. Address any feedback if needed
4. Once approved, the PR will be merged
5. Your branch will be automatically deleted

## Common First-Time Issues

### "I'm on the wrong branch!"

```bash
# Check where you are
git branch

# Switch to develop
git checkout develop

# Start over
bun scripts/git-flow.js feature start correct-feature-name
```

### "I made changes on develop by mistake!"

```bash
# Stash your changes
git stash

# Create feature branch
bun scripts/git-flow.js feature start my-feature

# Apply your changes
git stash pop
```bash

### "I forgot to pull latest changes!"

```bash
# Stash your work
git stash

# Pull latest
git pull origin develop

# Apply your work back
git stash pop

# Resolve any conflicts if needed
```

### "My commit message was wrong!"

```bash
# Change last commit message
git commit --amend -m "Correct message"

# Force push (only if not reviewed yet!)
git push --force origin feature/my-feature
```text

## Understanding the Workflow

### Branch Hierarchy

```
main (production)
  ↑
  └── release/1.2.0 (preparing release)
        ↑
        └── develop (integration)
              ↑
              ├── feature/search (your work)
              ├── feature/dashboard (teammate's work)
              └── feature/api (another teammate's work)
```bash

### Typical Day

**Morning:**
```bash
git checkout develop
git pull origin develop
bun scripts/git-flow.js feature start todays-task
```

**During the day:**
```bash
# Work, work, work...
git add .
git commit -m "Progress on feature"
# More work...
git add .
git commit -m "Complete feature"
```bash

**End of day:**
```bash
git push origin feature/todays-task
# If done:
bun scripts/git-flow.js feature finish todays-task
```

## Best Practices for Beginners

### 1. Commit Often
- Small commits are better than large ones
- Commit every logical change
- Don't wait until end of day

### 2. Pull Before You Start
- Always pull latest `develop` before creating feature
- Reduces conflicts later

### 3. Keep Features Small
- 1-3 days of work maximum
- Easier to review
- Faster to merge

### 4. Write Clear Commit Messages
```bash
# Good
git commit -m "Add user authentication module"
git commit -m "Fix search filter bug"
git commit -m "Update documentation for API"

# Bad
git commit -m "changes"
git commit -m "fix"
git commit -m "wip"
```yaml

### 5. Ask for Help
- Don't struggle alone
- Ask in team chat
- Create an issue if stuck

## Next Steps

Now that you're set up:

1. Read [Feature Workflow Details](feature-workflow.md)
2. Understand [Pull Request Process](../GIT-WORKFLOW.md#pull-request-checklist)
3. Learn about [Code Reviews](../GIT-WORKFLOW.md#code-review-tips)
4. Check [Troubleshooting Guide](troubleshooting.md) when stuck

## Quick Reference Card

```bash
# Daily workflow
git checkout develop              # Start on develop
git pull origin develop           # Get latest
bun scripts/git-flow.js feature start name  # Start feature
# ... work ...
git add .                         # Stage changes
git commit -m "message"           # Commit
git push origin feature/name      # Push
bun scripts/git-flow.js feature finish name # Create PR

# Useful commands
git status                        # What changed?
git log --oneline                 # History
git branch                        # Where am I?
git stash                         # Save work temporarily
git stash pop                     # Restore saved work
```

## Getting Help

- 📖 [Main Workflow Guide](../GIT-WORKFLOW.md)
- 🐛 [Troubleshooting](troubleshooting.md)
- 💬 Team chat channel
- 📧 Contact maintainer

---

**Welcome to the team!** You're ready to contribute. 🎉
