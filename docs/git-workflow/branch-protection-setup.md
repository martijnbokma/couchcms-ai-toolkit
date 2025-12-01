# Branch Protection Setup Guide

> **Protect your main and develop branches** to enforce code review and quality standards.

## Why Branch Protection?

Branch protection prevents:
- ❌ Direct commits to main/develop
- ❌ Force pushes that rewrite history
- ❌ Merging without code review
- ❌ Merging with failing tests
- ❌ Accidental branch deletion

## Quick Setup (GitHub UI)

### Step 1: Go to Settings

1. Navigate to your repository on GitHub
2. Click **Settings** tab
3. Click **Branches** in left sidebar

### Step 2: Add Branch Protection Rule

Click **Add rule** button

### Step 3: Configure Main Branch

**Branch name pattern:** `main`

**Protect matching branches:**
- ✅ Require a pull request before merging
  - ✅ Require approvals: **1**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Add status checks:
    - `Validate Configuration`
    - `Lint Check`
    - `PR Information`
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings (unless you're admin)
- ❌ Allow force pushes (keep unchecked)
- ❌ Allow deletions (keep unchecked)

Click **Create** or **Save changes**

### Step 4: Configure Develop Branch

Repeat Step 3 with:
**Branch name pattern:** `develop`

Use the same settings as main branch.

## Advanced Setup (GitHub CLI)

If you prefer automation, use the GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Other: https://cli.github.com/

# Authenticate
gh auth login

# Apply protection to main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --input .github/branch-protection.json

# Apply protection to develop
gh api repos/:owner/:repo/branches/develop/protection \
  --method PUT \
  --input .github/branch-protection.json
```text

## Configuration File

The repository includes `.github/branch-protection.json` with recommended settings.

You can customize this file and apply it using the GitHub API or CLI.

## Verification

After setup, verify protection is working:

```bash
# Try to push directly to main (should fail)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin main
# Expected: Error - protected branch

# Try to force push (should fail)
git push --force origin main
# Expected: Error - force push not allowed
```

## Admin Bypass

Admins can bypass branch protection in emergencies:

1. Go to repository Settings → Branches
2. Edit the branch protection rule
3. Uncheck "Do not allow bypassing the above settings"
4. Make your emergency change
5. Re-enable protection immediately after

**Important:** All bypasses are logged in the audit log.

## Troubleshooting

### "Status checks not found"

The status checks won't appear until you:
1. Create a PR
2. Let the GitHub Actions run once
3. Then they'll be available to select

### "Can't merge even with approval"

Check:
- All required status checks passed?
- Branch is up to date with base?
- All conversations resolved?

### "Need to bypass protection"

Only for emergencies:
1. You must be a repository admin
2. Temporarily disable protection
3. Make the change
4. Re-enable protection
5. Document why in commit message

## Best Practices

### Do's ✅

- Enable protection on main and develop
- Require at least 1 approval
- Require status checks to pass
- Require conversations to be resolved
- Keep protection enabled always

### Don'ts ❌

- Don't disable protection "temporarily"
- Don't bypass without documenting why
- Don't allow force pushes
- Don't skip code review
- Don't merge your own PRs (if possible)

## Team Roles

### Developers
- Cannot push directly to main/develop
- Must create PRs
- Can approve others' PRs
- Cannot bypass protection

### Maintainers
- Can approve PRs
- Can merge after approval
- Can manage branch protection
- Should not bypass protection

### Admins
- Can bypass protection (emergencies only)
- Can modify protection rules
- Should lead by example
- Must document bypasses

## Monitoring

Check branch protection compliance:

```bash
# View protection status
gh api repos/:owner/:repo/branches/main/protection

# View recent pushes
gh api repos/:owner/:repo/events | grep PushEvent

# View audit log (admin only)
# Settings → Security → Audit log
```

## Related Documentation

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Git Workflow Guide](../GIT-WORKFLOW.md)
- [Troubleshooting](troubleshooting.md)

---

**Remember:** Branch protection is your safety net. Keep it enabled! 🛡️
