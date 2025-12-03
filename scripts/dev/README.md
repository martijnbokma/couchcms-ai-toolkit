# Developer Utilities

This directory contains utility scripts for toolkit developers and contributors.

## Scripts

### `test-branch.sh`

Quick script to switch submodule to a specific branch for testing.

**Usage:**
```bash
chmod +x scripts/dev/test-branch.sh
./scripts/dev/test-branch.sh develop
./scripts/dev/test-branch.sh feature/new-feature
```

**What it does:**
- Switches the `ai-toolkit-shared` submodule to the specified branch
- Fetches latest changes
- Creates local branch if it doesn't exist
- Pulls latest changes

**When to use:**
- Testing toolkit changes in different branches
- Verifying compatibility with different toolkit versions
- Development and debugging

**Note:** This script is only useful when the toolkit is installed as a git submodule.

See [docs/TESTING-BRANCHES.md](../../docs/TESTING-BRANCHES.md) for more information.
