# Toolkit Updates

Keep your CouchCMS AI Toolkit up to date with the latest features, modules, and improvements.

## Quick Update

```bash
# Check for updates (interactive)
bun run update

# Apply updates automatically (no prompt)
bun run update:apply
```

## Update Commands

### Interactive Update (Recommended)

```bash
bun run update
```

This will:
1. Check for available updates
2. 📝 Show version info and recent changes
3. 📝 **Ask if you want to update now** (y/N)
4. ✅ Apply update if you confirm

Example output when updates are available:

```text
🔍 Checking for updates...

┌─────────────────────────────────────────────────────────┐
│ 🔍 CouchCMS AI Toolkit - Update Check                  │
├─────────────────────────────────────────────────────────┤
│ Current Version: 1.0.14                                 │
│ Latest Version:  1.0.15                                 │
│ Latest Release:  v1.0.15                                │
├─────────────────────────────────────────────────────────┤
│ ⚠️  You are 3 commit(s) behind                          │
│                                                         │
│ Recent Changes:                                         │
│   • Add interactive update prompt                       │
│   • Fix module loading bug                              │
│   • Update documentation                                │
│                                                         │
│ Update with:                                            │
│   bun run update --apply                                │
│                                                         │
│ Or manually:                                            │
│   cd ai-toolkit-shared && git pull && bun install       │
└─────────────────────────────────────────────────────────┘

Would you like to update now? (y/N): 
```

Perfect for when you want to review changes before updating.

### Check Only

```bash
bun run update:check
```

Shows update information without prompting:
- Current version
- Latest available version
- Number of commits behind
- Recent changes
- Update instructions

Use this when you just want to see what's available.

### Auto-Apply Updates

```bash
bun run update:apply
```

Automatically updates without prompting:
1. Checks for updates
2. 📝 Pulls latest changes from git
3. 📝 Installs new dependencies
4. ✅ Shows success confirmation

Use this in CI/CD or when you're confident about updating.

### Force Check

```bash
bun scripts/update.js --force
```

Bypasses the 24-hour cache and checks immediately.

## Manual Update

If you prefer manual control:

```bash
cd ai-toolkit-shared
git pull origin master
bun install
```

## Update Notifications

The toolkit automatically checks for updates every 24 hours when you run commands like `sync`, `init`, or `validate`. You'll see a notification if updates are available.

## What Gets Updated

- Core scripts and utilities
- Knowledge modules (CouchCMS, frameworks, etc.)
- AI agents
- AAPF framework components
- Templates and configurations
- Documentation

## After Updating

After updating, you can want to:

1. **Regenerate configs**: `bun run sync`
2. 🔍 **Check health**: `bun run health`
3. 🔍 **Review changelog**: Check `CHANGELOG.md` for breaking changes

## Troubleshooting

### Update Check Fails

If update check fails:
- Check internet connection
- Verify git repository is intact: `git status`
- Try force check: `bun scripts/update.js --force`

### Update Apply Fails

If update fails to apply:
- Check for uncommitted changes: `git status`
- Stash changes: `git stash`
- Try manual update (see above)
- Restore changes: `git stash pop`

### Not a Git Repository

If you see "Not a git repository":
- You likely installed via npm/bun package
- Reinstall to get latest: `bun install couchcms-ai-toolkit@latest`
- Or clone from GitHub for git-based updates

## Version Information

Check current version:

```bash
cat ai-toolkit-shared/package.json | grep version
```

View changelog:

```bash
cat ai-toolkit-shared/CHANGELOG.md
```

## Staying Informed

- Watch the [GitHub repository](https://github.com/martijnbokma/couchcms-ai-toolkit) for releases
- Check `CHANGELOG.md` for detailed changes
- Run `bun run update` regularly to stay current

## Update Frequency

Recommended update schedule:
- **Weekly**: For active development projects
- **Monthly**: For stable/maintenance projects
- **Before major features**: When starting new functionality

The toolkit uses semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes (review carefully)
- **MINOR**: New features (safe to update)
- **PATCH**: Bug fixes (always safe)
