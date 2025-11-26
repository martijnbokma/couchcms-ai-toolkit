# Claude Code Configuration

This directory contains Claude Code CLI configuration for the CouchCMS AI Toolkit.

## Structure

```
.claude/
├── settings.json          # Claude Code settings (auto-generated)
├── hooks/
│   ├── skill-activation.js    # UserPromptSubmit hook - skill suggestions
│   ├── post-edit-tracker.sh   # PostToolUse hook - tracks edits
│   └── preflight-check.sh     # Stop hook - validates changes
└── skills/
    └── skill-rules.json       # Combined skill triggers (auto-generated)
```

## How It Works

### Automatic Skill Activation

When you type a prompt in Claude Code, the `skill-activation.js` hook:

1. Analyzes your prompt for keywords and intent patterns
2. Checks recently edited files against path patterns
3. Suggests relevant skills based on score

**Example:**
```
You: "create a new template with cms:editable fields"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 Use **couchcms-core** skill
   CouchCMS template engine patterns and best practices
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Pre-flight Checks

When Claude Code finishes a response, `preflight-check.sh`:

1. Reads the edit log (tracked by `post-edit-tracker.sh`)
2. Checks each edited file for common issues:
   - CouchCMS: `<cms:` tags in HTML comments (CRITICAL)
   - CouchCMS: Paired `<cms:else>` tags (ERROR)
   - TypeScript: `any` type usage (WARNING)
   - TypeScript: `console.log` statements (INFO)
3. Reports findings before you accept changes

## Configuration

The `skill-rules.json` is **auto-generated** by `sync.js` based on modules in your `project.md`:

```yaml
# project.md
modules:
  - couchcms-core    # → loads couchcms-core skill-rules
  - tailwindcss      # → loads tailwindcss skill-rules
  - alpinejs         # → loads alpinejs skill-rules
```

Run `bun ai-toolkit-shared/scripts/sync.js` to regenerate.

## Testing Hooks

### Test skill activation:
```bash
node .claude/hooks/skill-activation.js "create a template"
```

### Test preflight checks:
```bash
# Track some test files
echo "$(date +%Y%m%d_%H%M%S)|test.php" >> .claude/edit-tracker.log

# Run checks
bash .claude/hooks/preflight-check.sh
```

## Customization

### Add custom preflight checks

Edit `.claude/hooks/preflight-check.sh` to add project-specific checks.

### Modify skill triggers

Edit the corresponding `modules/*.skill-rules.json` in the toolkit, then run `sync.js`.

## Integration with project.md

The `.claude/` directory is part of the toolkit's generated output:

```
project.md (Single Source of Truth)
    ↓
sync.js
    ↓
├── .cursorrules        (Cursor)
├── CLAUDE.md           (Claude)
├── AGENT.md            (Agents)
└── .claude/            (Claude Code CLI)
    ├── settings.json
    └── skills/
        └── skill-rules.json
```

All configuration stays in `project.md`. The `.claude/` directory is regenerated on each sync.

## Requirements

- Claude Code CLI (terminal-based Claude)
- Node.js (for JavaScript hooks)
- Bash (for shell hooks)

## Troubleshooting

### Hooks not running?

1. Check hooks are executable: `chmod +x .claude/hooks/*.sh`
2. Verify settings.json has correct hook paths
3. Check Claude Code is using this project directory

### Wrong skills suggested?

1. Run `sync.js` to regenerate skill-rules.json
2. Check your modules in project.md
3. Test hook directly: `node .claude/hooks/skill-activation.js "your prompt"`

### Preflight checks not catching issues?

1. Check edit-tracker.log exists and has entries
2. Verify the file patterns in preflight-check.sh match your files
