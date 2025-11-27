# Git Flow Scripts

Automation scripts for git-flow workflow (feature, hotfix, release branches).

## Scripts

### Workflow Scripts

- **`feature.js`** - Feature branch workflow
  - Create feature branches
  - Manage feature development
  - Merge features back

- **`hotfix.js`** - Hotfix workflow
  - Create hotfix branches from master
  - Quick fixes for production issues
  - Merge to master and develop

- **`release.js`** - Release workflow
  - Create release branches
  - Version bumping
  - Release preparation

### Support Scripts

- **`git-wrapper.js`** - Git command wrapper
  - Abstraction layer for git commands
  - Error handling
  - Command validation

- **`validation.js`** - Git validation
  - Branch name validation
  - State validation
  - Conflict detection

## Usage

### Feature Workflow

```bash
# Start new feature
bun scripts/git-flow/feature.js start my-feature

# Finish feature
bun scripts/git-flow/feature.js finish my-feature
```

### Hotfix Workflow

```bash
# Start hotfix
bun scripts/git-flow/hotfix.js start 1.2.1

# Finish hotfix
bun scripts/git-flow/hotfix.js finish 1.2.1
```

### Release Workflow

```bash
# Start release
bun scripts/git-flow/release.js start 1.3.0

# Finish release
bun scripts/git-flow/release.js finish 1.3.0
```

## Git Flow Model

This follows the standard git-flow branching model:

- **master** - Production-ready code
- **develop** - Integration branch for features
- **feature/** - Feature branches (from develop)
- **hotfix/** - Hotfix branches (from master)
- **release/** - Release branches (from develop)

## When to Use

### Features
Use for new functionality:
- New modules or agents
- New scripts or tools
- Documentation improvements

### Hotfixes
Use for urgent production fixes:
- Critical bugs in master
- Security issues
- Data corruption fixes

### Releases
Use for version releases:
- Preparing new versions
- Final testing before release
- Version bumping and tagging

## Notes

- Requires git repository with develop and master branches
- Follows semantic versioning (MAJOR.MINOR.PATCH)
- Automatically handles merging and tagging
- Validates branch state before operations
