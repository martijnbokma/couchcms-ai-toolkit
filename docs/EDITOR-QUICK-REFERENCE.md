# Editor Support Quick Reference

Quick reference for editor-specific configurations in the CouchCMS AI Toolkit.

## Generated Files Overview

| Editor | Files | Auto-Activate | Key Feature |
|--------|-------|---------------|-------------|
| **Cursor** | `.cursorrules`, `.cursor/rules/*.mdc` | ✅ Yes (MDC) | Context-aware rules |
| **Claude Code** | `.claude/settings.json`, `.claude/skills/*.md`, `CLAUDE.md` | ✅ Yes (Skills) | Modular knowledge |
| **Copilot** | `.github/copilot-instructions.md` | ❌ No | Instructions |
| **Windsurf** | `.windsurf/rules.md` | ❌ No | Rules |
| **Kiro** | `.kiro/steering/*.md` | ❌ No | Steering files |

---

## Cursor IDE

### Files
```text
.cursorrules                    # Global rules
.cursor/rules/*.mdc             # Context-aware rules
```yaml

### MDC Rules (Auto-Activate)
- Activate based on file patterns (globs)
- No manual loading required
- Context-specific guidance

### Example MDC Rule
```markdown
---
description: Alpine.js patterns
globs:
  - "**/*.html"
  - "**/*.php"
---

# Rules
[Content...]
```

### Troubleshooting
- **Not activating?** Check Cursor v0.40+
- **Wrong patterns?** Verify glob patterns match your files
- **Restart Cursor** after regenerating

---

## Claude Code

### Files
```text
.claude/settings.json           # Permissions & env
.claude/skills/*.md             # Modular knowledge
CLAUDE.md                       # Memory (startup)
AGENTS.md                       # Agent docs
```yaml

### Skills (Auto-Activate)
- One skill per module/agent
- Activate based on context
- YAML frontmatter + Markdown content

### Example Skill
```markdown
---
name: couchcms-core
description: Core CouchCMS patterns
allowed-tools: Read, Write, Bash, Grep
---

# Content
[Module content...]
```

### Settings (Permissions)
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)"],
    "deny": ["Read(./.env)"]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```yaml

### Memory File (CLAUDE.md)
- Loaded at startup
- Project context and overview
- Active modules and agents
- Coding standards

### Troubleshooting
- **Skills not loading?** Check Claude Code v0.5+
- **Invalid YAML?** Verify frontmatter syntax
- **Restart Claude Code** after regenerating

---

## Quick Commands

### Generate All Configs
```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/cli/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/cli/sync.js --watch
```

### Watch Mode (Auto-Sync)
```bash
# Generate AI configuration files
bun ai-toolkit-shared/scripts/cli/sync.js --watch
```bash

### Validate Configuration
```bash
# Validate your project configuration and check compliance
# This checks for errors in standards.md and missing files
bun ai-toolkit-shared/scripts/cli/validate.js

# The validation will show:
# - Configuration file status
# - Module and agent validation
# - Compliance score (0-100%)
# - Specific issues and recommendations
```

### Regenerate Specific Editor
```bash
# Remove and regenerate
rm -rf .cursor/rules/
rm -rf .claude/
bun ai-toolkit-shared/scripts/cli/sync.js
```yaml

---

## Configuration Source

All editor configs are generated from `standards.md`:

```yaml
---
name: "my-project"
toolkit: "./ai-toolkit-shared"
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
agents:
  - couchcms
  - tailwindcss
---

# Project Rules
[Your custom rules...]
```

**Workflow:**
1. Edit `standards.md`
2. 🚀 Run `bun ai-toolkit-shared/scripts/cli/sync.js`
3. 📝 All editor configs updated automatically

---

## File Patterns

### Cursor MDC Rules
- **Location:** `.cursor/rules/*.mdc`
- **Format:** YAML frontmatter + Markdown
- **Activation:** Automatic (based on globs)
- **Source:** Copied from `ai-toolkit-shared/rules/*.mdc`

### Claude Code Skills
- **Location:** `.claude/skills/*.md`
- **Format:** YAML frontmatter + Markdown
- **Activation:** Automatic (context-based)
- **Source:** Generated from modules/agents

### Claude Code Settings
- **Location:** `.claude/settings.json`
- **Format:** JSON
- **Content:** Permissions, environment variables
- **Source:** Generated from config + defaults

### Memory Files
- **Location:** `CLAUDE.md`, `AGENTS.md`
- **Format:** Markdown
- **Content:** Project context, agent docs
- **Source:** Generated from config + templates

---

## Common Issues

| Issue | Solution |
|-------|----------|
| MDC rules not activating | Check Cursor v0.40+, verify globs, restart |
| Skills not loading | Check Claude Code v0.5+, verify YAML, restart |
| Settings not applied | Validate JSON syntax, restart editor |
| Configs not generated | Run sync, check validation |
| Old configs still active | Delete and regenerate, restart editor |

---

## Best Practices

1. ✅ **Use watch mode** during development
2. ✅ **Validate before sync** to catch errors early
3. ✅ **Restart editor** after regenerating configs
4. ✅ **Keep standards.md updated** as single source of truth
5. ❌ **Don't edit generated files** - they're overwritten on sync

---

## Version Requirements

| Editor | Minimum Version | Feature |
|--------|----------------|---------|
| Cursor | v0.40+ | MDC rules |
| Claude Code | v0.5+ | Skills system |
| Copilot | Latest | Instructions |
| Windsurf | Latest | Rules |
| Kiro | Latest | Steering |

---

## See Also

- [Full Editor Support Guide](EDITOR-SUPPORT.md)
- [Config Files Guide](CONFIG-FILES.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Quick Start](QUICK-START.md)
