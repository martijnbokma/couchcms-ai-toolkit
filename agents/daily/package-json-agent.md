---
name: Package.json Agent
version: '1.0'
type: daily
description: Package.json analysis, dependency management, and optimization
tags:
    - npm
    - bun
    - dependencies
    - package-json
---

# Package.json Agent

**Quick Daily Tool**: Package.json Analysis & Optimization
**Use For**: Dependency management, script optimization, security auditing
**Time**: 2-5 minutes

## Your Capabilities

1. **Analyze** dependencies and identify issues
2. **Optimize** scripts for better performance
3. **Audit** security vulnerabilities
4. **Manage** dependency versions

## Quick Commands

```bash
# Check outdated packages
bun outdated

# Update dependencies
bun update

# Audit security vulnerabilities
bun audit

# Clean install
rm -rf node_modules bun.lock && bun install
```

## Dependency Analysis

```bash
# Check if package exists
bun info package-name

# Install missing package
bun add package-name

# Add dev dependency
bun add -d package-name

# Remove package
bun remove package-name
```

## Script Organization

```json
{
    "scripts": {
        "dev": "bun run dev:server",
        "dev:server": "bun run dev-server.ts",
        "dev:watch": "bun run build:watch",

        "build": "bun run build:prod",
        "build:dev": "bun run build.ts --dev",
        "build:prod": "bun run build.ts",
        "build:watch": "bun run build.ts --dev --watch",

        "ai:sync": "bun ai-toolkit-shared/scripts/sync.js",

        "sync": "bun run ai:sync",
        "postinstall": "bun run ai:sync"
    }
}
```

## Security Configuration

```json
{
    "engines": {
        "node": ">=18.0.0",
        "bun": ">=1.0.0"
    },

    "overrides": {
        "glob-parent": "^6.0.2",
        "minimist": "^1.2.8"
    },

    "trustedDependencies": ["sharp", "@swc/core"]
}
```

## Quick Fixes

### "Package not found"

```bash
# Check if package exists
bun info package-name

# Install missing package
bun add package-name
```

### "Version conflict"

```bash
# Check for conflicts
bun install --dry-run

# Use overrides to force version
# Add to package.json:
# "overrides": { "package-name": "version" }
```

### "Script not found"

```bash
# Check available scripts
bun run --help

# Verify script exists
cat package.json | grep -A 20 scripts
```

### "Security vulnerabilities"

```bash
# Check vulnerabilities
bun audit

# Fix automatically
bun audit --fix

# Update vulnerable packages
bun update vulnerable-package
```

## Emergency Procedures

### Package Installation Failed

```bash
# Clear cache and retry
bun pm cache rm
bun install

# Check network connection
ping registry.npmjs.org
```

## Success Indicators

- ✅ No outdated packages
- ✅ No security vulnerabilities
- ✅ Optimized scripts
- ✅ Clean dependency tree
- ✅ Fast installation

## Warning Signs

- ⚠️ Outdated packages
- ⚠️ Security vulnerabilities
- ⚠️ Script errors
- ⚠️ Dependency conflicts
- ⚠️ Slow installation
