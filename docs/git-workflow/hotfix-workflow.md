# Hotfix Workflow - Detailed Guide

> **For emergency fixes** - How to quickly fix critical bugs in production.

## Overview

Hotfix branches are for urgent fixes to production code. They bypass the normal development cycle to get critical fixes deployed quickly.

**Lifecycle:** main → hotfix → main + develop (+ release if exists)

```text
main ────●─────────────●──→
          ↓             ↑
hotfix   ●──●──●──●──●──●
         start       finish
                      ↓
develop ──────────────●──→
```

## When to Use Hotfix

Use hotfix for:
- 🚨 Critical bugs in production
- 🔒 Security vulnerabilities
- 💥 System crashes
- 🐛 Data corruption issues
- ⚠️ Anything breaking production

Don't use hotfix for:
- ❌ Minor bugs (wait for next release)
- ❌ New features (use feature branch)
- ❌ Improvements (use feature branch)
- ❌ Non-urgent fixes (use feature branch)

## Severity Assessment

**Critical (Use Hotfix):**
- Users can't access the system
- Data is being lost or corrupted
- Security breach
- Payment processing broken
- Legal/compliance issue

**High (Consider Hotfix):**
- Major feature broken
- Significant performance issue
- Affecting many users
- Business impact

**Medium/Low (Use Feature Branch):**
- Minor UI issues
- Edge case bugs
- Cosmetic problems
- Affecting few users

## Complete Workflow

### Phase 1: Assessment

**Step 1: Verify the issue**

```bash
# Confirm the bug exists in production
# - Check production logs
# - Reproduce the issue
# - Verify it's not user error
# - Check when it started
```yaml

**Step 2: Assess severity**

Questions to ask:
- How many users affected?
- What's the business impact?
- Can it wait for next release?
- Is there a workaround?

**Step 3: Notify team**

```bash
# Alert team immediately
# - Post in emergency channel
# - Tag relevant people
# - Describe the issue
# - State you're creating hotfix
```

### Phase 2: Creating the Hotfix

**Step 1: Create hotfix branch**

```bash
# Switch to main (production)
git checkout main
git pull origin main

# Create hotfix branch
bun scripts/git-flow.js hotfix start fix-critical-bug

# Or manually
git checkout -b hotfix/fix-critical-bug main
```text

**Naming conventions:**

Good names:
- `fix-login-crash`
- `fix-payment-error`
- `fix-security-vulnerability`
- `fix-data-corruption`

Bad names:
- `hotfix` (not descriptive)
- `urgent` (what's urgent?)
- `fix` (what fix?)

**Step 2: Verify base**

```bash
# Confirm you're based on main
git log --oneline -1

# Should show latest production commit
```

### Phase 3: Fixing the Bug

**Step 1: Reproduce locally**

```bash
# Switch to hotfix branch
git checkout hotfix/fix-critical-bug

# Reproduce the bug
# - Follow steps from production
# - Verify you can see the issue
# - Understand the root cause
```text

**Step 2: Implement fix**

```bash
# Make minimal changes
# - Fix only the critical issue
# - Don't refactor
# - Don't add features
# - Keep it simple

# Example: Fix login crash
# Edit: src/auth/login.js
# Change only the problematic code

git add src/auth/login.js
git commit -m "fix: Prevent crash when username is empty"
```

**Keep it minimal:**
- ✅ Fix the specific bug
- ✅ Add test for the bug
- ✅ Update version number
- ❌ Don't refactor code
- ❌ Don't fix other bugs
- ❌ Don't add features
- ❌ Don't change formatting

**Step 3: Test thoroughly**

```bash
# Run all tests
bun test

# Test the specific fix
# - Verify bug is fixed
# - Test edge cases
# - Ensure no regressions

# Test manually
# - Follow reproduction steps
# - Verify fix works
# - Test related functionality
```json

**Step 4: Update version**

```bash
# Current version: 1.3.0
# Hotfix version: 1.3.1 (increment patch)

# Update package.json
# "version": "1.3.1"

# Update CHANGELOG.md
# Add hotfix section:
# ## [1.3.1] - 2024-02-15
# ### Fixed
# - Critical login crash when username is empty

git add package.json CHANGELOG.md
git commit -m "chore: Bump version to 1.3.1"
```

### Phase 4: Testing

**Step 1: Local testing**

```bash
# Run full test suite
bun test

# Run validation
bun scripts/validate.js

# Manual testing
# - Test the fix
# - Test related features
# - Look for side effects
```bash

**Step 2: Deploy to staging**

```bash
# Deploy hotfix branch to staging
git push origin hotfix/fix-critical-bug

# Test on staging
# - Reproduce original bug
# - Verify fix works
# - Test thoroughly
```

**Step 3: Get approval**

```bash
# Have another developer review
# - Code review
# - Test on staging
# - Approve the fix

# Document testing done
# - What was tested
# - Results
# - Any concerns
```text

### Phase 5: Deployment

**Step 1: Finish hotfix**

```bash
# Using script (recommended)
bun scripts/git-flow.js hotfix finish fix-critical-bug
```

**This creates THREE pull requests:**

1. **hotfix → main** (production)
2. **hotfix → develop** (development)
3. **hotfix → release** (if release branch exists)

**Or manually:**

```bash
# Create PR to main
# Title: Hotfix v1.3.1: Fix critical login crash
# Base: main
# Compare: hotfix/fix-critical-bug

# Create PR to develop
# Title: Merge hotfix v1.3.1 to develop
# Base: develop
# Compare: hotfix/fix-critical-bug

# If release branch exists
# Create PR to release
# Title: Merge hotfix v1.3.1 to release
# Base: release/1.4.0
# Compare: hotfix/fix-critical-bug
```text

**Step 2: Fast-track approval**

```bash
# Get immediate review
# - Tag reviewers
# - Mark as urgent
# - Explain severity

# Approve and merge quickly
# - Review code
# - Verify tests pass
# - Merge to main
```

**Step 3: Deploy to production**

```bash
# After merge to main
# Deploy immediately

# Monitor deployment
# - Watch logs
# - Check metrics
# - Verify fix is live
```bash

**Step 4: Verify fix**

```bash
# Test in production
# - Reproduce original issue
# - Verify it's fixed
# - Monitor for 30 minutes
# - Check error rates
```

**Step 5: Merge to other branches**

```bash
# Merge to develop
# - Approve PR
# - Merge

# Merge to release (if exists)
# - Approve PR
# - Merge

# This ensures fix is everywhere
```text

**Step 6: Cleanup**

```bash
# Delete hotfix branch (automatic)
# Or manually:
git push origin --delete hotfix/fix-critical-bug
git branch -D hotfix/fix-critical-bug

# Switch back to develop
git checkout develop
git pull origin develop
```

### Phase 6: Post-Hotfix

**Step 1: Notify stakeholders**

```bash
# Announce fix deployed
# - Team chat
# - Email stakeholders
# - Update status page
# - Close incident ticket
```sql

**Step 2: Document incident**

Create post-mortem:
- What happened?
- What was the impact?
- How was it fixed?
- How to prevent in future?

**Step 3: Monitor closely**

```bash
# Watch production for 24 hours
# - Error rates
# - User reports
# - Performance metrics
# - Related issues
```

**Step 4: Follow-up actions**

```bash
# Create issues for:
# - Better tests to catch this
# - Monitoring improvements
# - Documentation updates
# - Process improvements
```text

## Multiple Hotfixes

**If another hotfix is needed:**

```bash
# Base on latest main (includes previous hotfix)
git checkout main
git pull origin main

# Create new hotfix
bun scripts/git-flow.js hotfix start fix-another-bug

# Version: 1.3.1 → 1.3.2
```

**If hotfixes overlap:**

```bash
# Coordinate with team
# - Who's working on what?
# - Can they be combined?
# - Which is more urgent?

# Option 1: Combine fixes
# Work together on one hotfix branch

# Option 2: Sequential
# Finish first hotfix
# Then start second hotfix
```text

## Emergency Procedures

### "Hotfix made it worse!"

```bash
# Revert immediately
git checkout main
git revert HEAD
git push origin main

# Or rollback deployment
# (Depends on deployment process)

# Fix the fix
# Create new hotfix
bun scripts/git-flow.js hotfix start fix-the-fix
```

### "Can't reproduce the bug"

```bash
# Don't guess!
# - Get more information
# - Check production logs
# - Talk to users
# - Review recent changes

# If can't reproduce:
# - May not be a bug
# - May be environment-specific
# - May be user error
```text

### "Fix requires major changes"

```bash
# If fix is too complex:
# - Consider workaround
# - Disable feature temporarily
# - Schedule proper fix for next release

# Temporary workaround:
git checkout hotfix/workaround
# Disable problematic feature
git commit -m "fix: Temporarily disable feature"
# Deploy quickly

# Proper fix:
git checkout develop
bun scripts/git-flow.js feature start proper-fix
# Implement proper solution
# Include in next release
```

## Best Practices

### Do's ✅

- **Act quickly** - Time is critical
- **Keep it minimal** - Only fix the bug
- **Test thoroughly** - Don't make it worse
- **Communicate** - Keep team informed
- **Document** - Write post-mortem
- **Monitor** - Watch production closely
- **Learn** - Prevent future occurrences

### Don'ts ❌

- **Don't panic** - Stay calm and focused
- **Don't rush testing** - Test thoroughly
- **Don't add features** - Only fix the bug
- **Don't refactor** - Keep changes minimal
- **Don't work alone** - Get review
- **Don't skip documentation** - Update changelog
- **Don't forget develop** - Merge back

## Hotfix Checklist

### Before Starting
- [ ] Bug confirmed in production
- [ ] Severity assessed (critical)
- [ ] Team notified
- [ ] Can reproduce locally

### During Hotfix
- [ ] Hotfix branch created from main
- [ ] Bug fixed (minimal changes)
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Version number incremented
- [ ] Changelog updated
- [ ] Code reviewed
- [ ] Tested on staging

### Deployment
- [ ] PRs created (main, develop, release)
- [ ] Fast-track approval
- [ ] Merged to main
- [ ] Deployed to production
- [ ] Fix verified in production
- [ ] Merged to develop
- [ ] Merged to release (if exists)
- [ ] Hotfix branch deleted

### Post-Hotfix
- [ ] Stakeholders notified
- [ ] Incident documented
- [ ] Post-mortem written
- [ ] Follow-up issues created
- [ ] Monitoring active

## Quick Reference

```bash
# Start hotfix
git checkout main
git pull origin main
bun scripts/git-flow.js hotfix start fix-description

# Fix the bug
# ... edit files ...
git add .
git commit -m "fix: Description of fix"

# Update version (1.3.0 → 1.3.1)
# Edit package.json, CHANGELOG.md
git add .
git commit -m "chore: Bump version to 1.3.1"

# Test
bun test

# Finish hotfix
bun scripts/git-flow.js hotfix finish fix-description

# After merge
# Monitor production
# Notify team
```text

## Version Numbering

```bash
# Current: 1.3.0

# First hotfix: 1.3.1
# Second hotfix: 1.3.2
# Third hotfix: 1.3.3

# Next release: 1.4.0
# (Minor version bump resets patch)
```

## Communication Template

**Starting hotfix:**
```yaml
🚨 HOTFIX ALERT

Issue: Critical login crash
Severity: High - users can't log in
Started: 2024-02-15 14:30
Branch: hotfix/fix-login-crash
ETA: 30 minutes

Status: Working on fix
```

**Hotfix deployed:**
```yaml
✅ HOTFIX DEPLOYED

Issue: Critical login crash
Version: v1.3.1
Deployed: 2024-02-15 15:00
Status: Monitoring

Fix verified in production.
Monitoring for 30 minutes.
```

## Related Guides

- [Release Workflow](release-workflow.md)
- [Feature Workflow](feature-workflow.md)
- [Troubleshooting](troubleshooting.md)

---

**Stay calm, fix fast, test thoroughly!** 🚨
