# Git Workflow Setup - Quick Start

> **Get your repository ready for Gitflow in 5 minutes**

## Prerequisites

- ✅ Git repository initialized
- ✅ At least one commit made
- ✅ Bun or Node.js installed

## Step 1: Initialize Gitflow Structure

Run the initialization script:

```bash
bun scripts/git-flow-init.js
```text

This will:
- ✅ Check if you're in a git repository
- ✅ Ensure main/master branch exists
- ✅ Create develop branch from main
- ✅ Push develop to remote (if remote exists)

**Output:**
```
🌿 Initializing Gitflow structure...

📍 Current branch: main

✅ Production branch "main" exists

📝 Creating develop branch from main...
✅ Develop branch created

📤 Pushing develop to remote...
✅ Develop branch pushed to remote

🎉 Gitflow structure initialized!

Branch structure:
  main → Production (stable, deployed code)
  develop → Integration (features merge here)
```text

## Step 2: Verify Setup

Check your branches:

```bash
git branch -a
```

You should see:
```text
* develop
  main
  remotes/origin/develop
  remotes/origin/main
```

## Step 3: Set Up Branch Protection (Recommended)

Protect your main and develop branches on GitHub:

1. Go to repository Settings → Branches
2. Add protection rule for `main`
3. Add protection rule for `develop`

See [Branch Protection Setup Guide](branch-protection-setup.md) for detailed instructions.

## Step 4: Start Working!

You're ready to use Gitflow:

```bash
# Start a new feature
bun scripts/git-flow.js feature start my-first-feature

# Make changes
git add .
git commit -m "Add new feature"

# Finish feature (creates PR)
bun scripts/git-flow.js feature finish my-first-feature
```text

## Troubleshooting

### "Not a git repository"

Make sure you're in the root of your git repository:

```bash
# Check if you're in a git repo
git status

# If not, initialize one
git init
git add .
git commit -m "Initial commit"
```

### "No commits yet"

You need at least one commit before initializing Gitflow:

```bash
git add .
git commit -m "Initial commit"
bun scripts/git-flow-init.js
```text

### "develop branch already exists"

That's fine! The script will detect it and skip creation:

```
✅ Develop branch already exists
```text

### "No remote configured"

If you don't have a remote yet, that's okay. The script will skip pushing:

```
💡 No remote configured yet. Push manually when ready:
   git push -u origin develop
```bash

Add remote later:

```bash
git remote add origin https://github.com/username/repo.git
git push -u origin develop
```

## What If I Already Have Branches?

The script is safe to run on existing repositories:

- ✅ Won't overwrite existing branches
- ✅ Detects main or master
- ✅ Skips if develop exists
- ✅ Won't lose any work

## Manual Setup (Alternative)

If you prefer to set up manually:

```bash
# Ensure you're on main
git checkout main

# Create develop from main
git checkout -b develop

# Push to remote
git push -u origin develop

# Verify
git branch -a
```

## Next Steps

After setup:

1. **Read the documentation**
   - [Git Workflow Guide](../GIT-WORKFLOW.md)
   - [Feature Workflow](feature-workflow.md)
   - [Getting Started](getting-started.md)

2. **Set up branch protection**
   - [Branch Protection Guide](branch-protection-setup.md)

3. **Start your first feature**
   ```bash
   bun scripts/git-flow.js feature start my-feature
   ```

4. **Share with your team**
   - Send them the [Getting Started Guide](getting-started.md)
   - Set up [Branch Protection](branch-protection-setup.md)

## Team Onboarding

When adding team members:

1. They clone the repository
2. They see main and develop branches
3. They read [Getting Started](getting-started.md)
4. They start their first feature

No additional setup needed! 🎉

## Verification Checklist

After setup, verify:

- [ ] `main` branch exists
- [ ] `develop` branch exists
- [ ] Both branches pushed to remote
- [ ] You can switch between branches
- [ ] Branch protection configured (recommended)
- [ ] Team members have access

## Getting Help

- 📖 [Main Workflow Guide](../GIT-WORKFLOW.md)
- 🎓 [Getting Started](getting-started.md)
- ❓ [Troubleshooting](troubleshooting.md)
- 💬 Ask in team chat
- 🐛 [Create an issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

---

**Ready to go!** Start your first feature and enjoy organized collaboration. 🚀
