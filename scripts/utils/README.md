# Utility Scripts

Helper scripts for development workflow and toolkit management.

## Scripts

### Development Workflow

- **`prepare-contribution.js`** - Prepare for contributing to the toolkit
  - Switches to master branch
  - Creates feature branch
  - Sets up development environment

- **`update-submodule.js`** - Update toolkit to latest version
  - Updates git submodule
  - Pulls latest changes
  - Runs sync to update configs

- **`quick-release.js`** - Quick release workflow
  - Version bump
  - Changelog update
  - Git tag creation

### Shared Utilities

- **`utils.js`** - Shared utility functions
  - File operations
  - String manipulation
  - Common helpers

## Usage

### Prepare Contribution

```bash
bun scripts/utils/prepare-contribution.js
```

Or via package.json:

```bash
bun run prepare-contribution
```

### Update Submodule

```bash
bun scripts/utils/update-submodule.js
```

Or via package.json:

```bash
bun run update-submodule
```

### Quick Release

```bash
bun scripts/utils/quick-release.js
```

Or via package.json:

```bash
bun run release
```

## When to Use

### prepare-contribution.js
Use when you want to contribute to the toolkit:
- Before starting new feature development
- When switching from using toolkit to developing it

### update-submodule.js
Use when you want to update the toolkit in your project:
- After toolkit updates are released
- When you want latest features

### quick-release.js
Use when releasing a new version:
- After completing features
- For hotfixes
- For version bumps

## Notes

- These scripts are primarily for toolkit developers
- `prepare-contribution.js` requires git repository access
- `update-submodule.js` only works when toolkit is added as submodule
- `quick-release.js` requires proper git permissions
