# Contributing to CouchCMS AI Toolkit

Thank you for your interest in contributing! This guide explains **how to contribute from your project** using the submodule workflow.

## 🎯 Quick Overview

You can contribute to this toolkit **directly from your project** without cloning the toolkit separately. The submodule setup makes this easy!

**Key Points:**
- ✅ Work directly in your project's submodule directory
- ✅ No need to clone the toolkit separately
- ✅ Changes are isolated in feature branches
- ✅ Simple workflow: branch → edit → test → commit → push → PR

## 📋 Prerequisites

- ✅ Git installed
- ✅ Bun (or npm/node) installed
- ✅ Your project uses this toolkit as a submodule
- ✅ You have write access to fork the repository (or you're a collaborator)

**Note:** If you don't have write access, you'll need to:
1. Fork the repository on GitHub
2. Update your submodule to point to your fork (or add your fork as a remote)
3. Push to your fork and create a PR from there

## 🌿 Git Workflow

This project uses **Gitflow** for organized collaboration. If you're new to this workflow, see our [complete Git Workflow guide](docs/GIT-WORKFLOW.md).

### Quick Reference

```bash
# Start a feature
bun scripts/git-flow.js feature start your-feature-name

# Work on it (commit often)
git add .
git commit -m "feat: add functionality"

# Finish and create PR
bun scripts/git-flow.js feature finish your-feature-name
```

**New to Gitflow?** Read:
- 📖 [Getting Started Guide](docs/git-workflow/getting-started.md) - 10 minute setup
- 🎓 [Feature Workflow](docs/git-workflow/feature-workflow.md) - Daily development
- ❓ [Troubleshooting](docs/git-workflow/troubleshooting.md) - Common issues

## 🔄 Contribution Workflow

### Quick Start (Using Git Flow)

```bash
# From your project root
cd ai-toolkit-shared

# Start a feature using git-flow
bun scripts/git-flow.js feature start your-feature-name

# Or use the legacy preparation script
bun run prepare-contribution --branch feature/your-feature-name
```

The git-flow script will:
- ✅ Check your git state
- ✅ Create feature branch from develop
- ✅ Switch to your feature branch
- ✅ Ready to work!

### Legacy Helper Script

```bash
# Run the preparation script (old method)
bun run prepare-contribution

# Or create a branch directly
bun run prepare-contribution --branch feature/your-feature-name
```

The script will:
- ✅ Check your git state
- ✅ Switch to master branch
- ✅ Pull latest updates
- ✅ Show you next steps
- ✅ Optionally create your feature branch

### Manual Workflow

If you prefer to do it manually, follow these steps:

### Step 1: Navigate to the Submodule

```bash
# From your project root
cd ai-toolkit-shared  # or whatever you named your submodule
```

### Step 2: Check Current State

```bash
# See which branch you're on
git branch

# Check if there are uncommitted changes
git status

# Check remote configuration
git remote -v
# Should show: https://github.com/martijnbokma/couchcms-ai-toolkit.git
```

**Important**: Submodules are often in "detached HEAD" state. We need to fix this first.

**If you're contributing from a fork:**
```bash
# Add your fork as a remote (if not already added)
git remote add fork https://github.com/YOUR-USERNAME/couchcms-ai-toolkit.git

# Or update existing remote
git remote set-url origin https://github.com/YOUR-USERNAME/couchcms-ai-toolkit.git
```

### Step 3: Switch to Master Branch

```bash
# Get latest changes
git fetch origin

# Switch to master branch
git checkout master

# Pull latest updates
git pull origin master

# If you're using a fork, also fetch from upstream
git remote add upstream https://github.com/martijnbokma/couchcms-ai-toolkit.git  # First time only
git fetch upstream
git merge upstream/master  # Sync with upstream
```

### Step 4: Create a Feature Branch

**Using git-flow (recommended):**

```bash
# Create feature branch from develop
bun scripts/git-flow.js feature start add-vue-module

# Examples:
bun scripts/git-flow.js feature start add-vue-module
bun scripts/git-flow.js feature start fix-alpine-docs-typo
bun scripts/git-flow.js feature start improve-readme
```

**Or manually:**

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/add-vue-module
git checkout -b fix/alpine-docs-typo
git checkout -b docs/improve-readme
```

### Step 5: Make Your Changes

Now you can edit files in the submodule:

```bash
# Edit a module
code modules/alpinejs.md

# Add a new agent
code agents/your-new-agent.md

# Update documentation
code README.md
```

### Step 6: Test Your Changes

```bash
# Install dependencies (if you haven't already)
bun install

# Test that sync still works
cd ..  # Back to your project root
bun ai-toolkit-shared/scripts/sync.js

# Validate
bun ai-toolkit-shared/scripts/validate.js
```

If sync and validation work, your changes are good!

### Step 7: Commit Your Changes

```bash
# Back to submodule directory
cd ai-toolkit-shared

# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add Vue.js module

- Add Vue.js patterns and best practices
- Include Composition API examples
- Add reactivity guidelines"
```

**Commit Message Format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### Step 8: Finish Your Feature

**Using git-flow (recommended):**

```bash
# This will push and create PR automatically
bun scripts/git-flow.js feature finish your-feature-name
```

This automatically:
- ✅ Pushes your branch to GitHub
- ✅ Creates a Pull Request to develop
- ✅ Applies PR template
- ✅ Requests reviews

**Or manually:**

```bash
# Push to the remote repository
git push origin feature/your-feature-name

# If this is your first push, set upstream:
git push -u origin feature/your-feature-name
```

**If you're using a fork:**
```bash
# Push to your fork
git push fork feature/your-feature-name
# or if fork is your origin:
git push origin feature/your-feature-name
```

### Step 9: Create a Pull Request (if not using git-flow)

**If you have direct access:**
1. Go to https://github.com/martijnbokma/couchcms-ai-toolkit
2. You'll see a banner: "Compare & pull request"
3. Click it and fill in:
    - **Base**: `develop` (not main!)
    - **Compare**: `feature/your-feature-name`
    - **Title**: Clear, descriptive title (e.g., "feat: add Vue.js module")
    - **Description**: Use the template below
4. Click "Create pull request"

**If you're using a fork:**
1. Go to https://github.com/YOUR-USERNAME/couchcms-ai-toolkit
2. Click "Compare & pull request" or go to the main repo and click "New Pull Request"
3. Select:
    - **Base repository**: martijnbokma/couchcms-ai-toolkit
    - **Base**: `develop`
    - **Head repository**: YOUR-USERNAME/couchcms-ai-toolkit
    - **Compare**: `feature/your-feature-name`
4. Fill in the PR details

**PR Description Template:**
```markdown
## What does this change?
Brief description of what you added/changed/fixed.

## Why is it needed?
Explain the problem it solves or the improvement it makes.

## How to test it?
1. Step 1
2. Step 2
3. Expected result

## Checklist
- [ ] Code follows project style
- [ ] Changes are tested (`bun ai-toolkit-shared/scripts/sync.js` works)
- [ ] Documentation is updated
- [ ] Commit messages are clear
```

### Step 10: After PR is Merged

Once your PR is merged into develop:

```bash
# Switch back to develop
git checkout develop

# Pull the merged changes
git pull origin develop

# Your feature branch is automatically deleted on GitHub
# Delete it locally too
git branch -d feature/your-feature-name

# Go back to your project root
cd ..

# Update the submodule reference in your project
git add ai-toolkit-shared
git commit -m "chore: update ai-toolkit-shared with new features"
git push
```

**Note:** Features are merged to `develop` first. They will be included in the next release to `main`.

## 🎨 What Can You Contribute?

### 1. New Modules

Add support for new frameworks/libraries:

```bash
# Create new module
cd ai-toolkit-shared
git checkout -b feature/add-nextjs-module

# Create the file
touch modules/nextjs.md

# Follow the module template (see below)
```

**Module Template:**

```markdown
---
id: nextjs
name: 'Next.js'
version: '1.0'
description: 'Next.js App Router patterns and best practices'
required: false
requires: ['typescript']
conflicts: []
---

# Next.js Standards

## Overview

Brief explanation...

## Patterns

Code examples...

## Best Practices

### DO

- List good practices

### DON'T

- List anti-patterns
```

### 2. Improve Existing Modules

Fix typos, add examples, clarify instructions:

```bash
cd ai-toolkit-shared
git checkout -b fix/alpine-docs-typo

# Edit the module
code modules/alpinejs.md

# Make your improvements
```

### 3. Add New Agents

Create specialized AI agents:

```bash
cd ai-toolkit-shared
git checkout -b feature/add-docker-agent

# Create the agent
touch agents/docker.md

# Follow existing agent structure
```

### 4. Improve Documentation

Better README, troubleshooting, examples:

```bash
cd ai-toolkit-shared
git checkout -b docs/improve-troubleshooting

# Update docs
code README.md
```

### 5. Add Prompts

Reusable AI prompts for common tasks:

```bash
cd ai-toolkit-shared
git checkout -b feature/add-performance-prompts

# Add to prompts library
touch prompts/best-practices/performance-optimization.md
```

## 🚫 Common Mistakes to Avoid

### ❌ Don't Edit in Detached HEAD

```bash
# BAD - editing in detached HEAD state
cd ai-toolkit-shared
# (detached HEAD)
code modules/alpinejs.md
# Your changes might get lost!
```

```bash
# GOOD - switch to master first
cd ai-toolkit-shared
git checkout master
git checkout -b feature/my-feature
code modules/alpinejs.md
```

### ❌ Don't Commit node_modules

```bash
# BAD - committing dependencies
git add node_modules/
git commit -m "add dependencies"  # Don't do this!
```

```bash
# GOOD - dependencies are gitignored
# Users run: bun install
```

### ❌ Don't Push Directly to Master

```bash
# BAD - pushing directly to master
git checkout master
git commit -m "changes"
git push origin master  # Don't do this!
```

```bash
# GOOD - use feature branches
git checkout -b feature/my-feature
git commit -m "changes"
git push origin feature/my-feature
# Then create a Pull Request
```

## 📝 Contribution Checklist

Before submitting your PR:

- [ ] Code follows project style
- [ ] Changes are tested (`bun ai-toolkit-shared/scripts/sync.js` works)
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with master
- [ ] No `node_modules/` committed
- [ ] Changes are focused (one feature/fix per PR)

## 🆘 Troubleshooting

### "I'm in detached HEAD state"

```bash
# Solution:
git checkout master
git pull origin master
git checkout -b feature/my-feature
# Now make your changes
```

### "My changes disappeared"

```bash
# If you committed in detached HEAD:
git reflog  # Find your commit hash
git checkout -b rescue-my-work <commit-hash>
git checkout master
git merge rescue-my-work
```

### "Merge conflicts in my PR"

```bash
# Update your branch with latest master:
git checkout feature/my-feature
git fetch origin
git merge origin/master
# Resolve conflicts
git add .
git commit -m "chore: resolve merge conflicts"
git push origin feature/my-feature
```

### "Can't push my branch"

```bash
# Make sure you're pushing to the submodule remote:
git remote -v
# Should show: https://github.com/martijnbokma/couchcms-ai-toolkit.git

# If wrong, fix it:
git remote set-url origin https://github.com/martijnbokma/couchcms-ai-toolkit.git
```

## 🎓 Learning Resources

### Understanding Submodules

- [Git Submodules Tutorial](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- Submodules point to specific commits in another repo
- Changes in submodule don't automatically update parent project
- Parent project tracks which commit of submodule to use

### Git Best Practices

- Write clear commit messages
- Keep commits focused (one thing per commit)
- Test before committing
- Pull before pushing
- Use feature branches

## 💡 Tips for Success

### 1. Small, Focused Changes

```bash
# GOOD - one clear improvement
git commit -m "docs: fix typo in Alpine.js colon syntax rule"

# BAD - too many unrelated changes
git commit -m "update docs, fix bugs, add features"
```

### 2. Test Thoroughly

```bash
# Always test your changes
cd .. # Your project root
bun ai-toolkit-shared/scripts/sync.js
bun ai-toolkit-shared/scripts/validate.js

# Check generated .cursorrules file
cat .cursorrules | grep -i "your-change"
```

### 3. Document Your Changes

```markdown
# Good PR description:

## What?

Added Vue.js module with Composition API patterns

## Why?

Many projects now use Vue.js instead of Alpine.js

## How to Test?

1. Add `vue` to modules in `.project/standards.md`
2. Run `bun ai-toolkit-shared/scripts/sync.js`
3. Check `.cursorrules` includes Vue.js rules
```

### 4. Stay Updated

```bash
# Before starting new work:
cd ai-toolkit-shared
git checkout master
git pull origin master

# This ensures you have latest changes
```

## 🤝 Code of Conduct

- Be respectful and constructive
- Help others learn
- Focus on improving the toolkit
- Accept feedback gracefully

## 📞 Getting Help

- **Questions?** Open an issue with label `question`
- **Bug found?** Open an issue with label `bug`
- **Feature idea?** Open an issue with label `enhancement`

## 🎉 Thank You!

Every contribution helps make this toolkit better for everyone. Whether you fix a typo or add a whole new module, your work is appreciated!

---

**Ready to contribute?** Start with Step 1 above! 🚀
