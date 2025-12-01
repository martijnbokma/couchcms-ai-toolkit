# Quick Reference Card

One-page reference for common commands and solutions.

## Common Commands

```bash
# Setup (first time)
bun ai-toolkit-shared/scripts/create-standards.js  # Simple setup
bun ai-toolkit-shared/scripts/init.js                # Advanced setup

# Generate configs
bun ai-toolkit-shared/scripts/sync.js

# Validate setup
bun ai-toolkit-shared/scripts/validate.js

# Update toolkit (submodule)
cd ai-toolkit-shared && git pull && bun install && cd ..

# Browse available modules/agents
bun ai-toolkit-shared/scripts/browse.js
```

## Common Errors & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| `Cannot find module 'gray-matter'` | Dependencies auto-install now. If persists: `cd ai-toolkit-shared && bun install` |
| `No configuration file found` | Run: `bun ai-toolkit-shared/scripts/create-standards.js` |
| `Invalid YAML syntax` | Check error message for line number and fix suggestion |
| `Module 'X' not found` | Check suggestions in error message. Common: `tailwind` → `tailwindcss` |
| `Agent 'X' not found` | Check suggestions in error message. Common: `couchcms-core` → `couchcms` |
| `Toolkit path not found` | Auto-detected now. If fails, check path in `.project/standards.md` |
| `Sync completed with errors` | Run `validate.js` first to see specific issues |

## File Locations

| File | Purpose | Edit? |
|------|---------|-------|
| `.project/standards.md` | Main configuration | ✅ Yes - edit this |
| `.cursorrules` | Cursor IDE config | ❌ No - auto-generated |
| `CLAUDE.md` | Claude memory | ❌ No - auto-generated |
| `AGENTS.md` | Agent documentation | ❌ No - auto-generated |

## Configuration Structure

```yaml
---
name: "my-project"
toolkit: "./ai-toolkit-shared"
modules:
    - couchcms-core
    - tailwindcss
agents:
    - couchcms
    - tailwindcss
---

# Project-Specific Rules

Add your custom rules here...
```

## Common Module/Agent Names

| What You Want | Module Name | Agent Name |
|---------------|-------------|------------|
| TailwindCSS | `tailwindcss` | `tailwindcss` |
| daisyUI | `daisyui` | `daisyui` |
| Alpine.js | `alpinejs` | `alpinejs` |
| TypeScript | `typescript` | `typescript` |
| CouchCMS Core | `couchcms-core` | `couchcms` |
| Forms | `databound-forms` | `databound-forms` |

## Workflow

1. **Edit** `.project/standards.md`
2. **Run** `bun ai-toolkit-shared/scripts/sync.js`
3. **Verify** `bun ai-toolkit-shared/scripts/validate.js`
4. **Reload** your editor

## Quick Diagnostics

```bash
# All-in-one check
bun ai-toolkit-shared/scripts/validate.js
```

## Need More Help?

- **Full Guide:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Getting Started:** [GETTING-STARTED.md](GETTING-STARTED.md)
- **Glossary:** [GLOSSARY.md](GLOSSARY.md)
- **GitHub Issues:** https://github.com/martijnbokma/couchcms-ai-toolkit/issues

---

**Print this page for quick reference!**
