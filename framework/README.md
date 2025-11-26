# AI Prompting Framework (AAPF)

Core AI agent prompting rules and communication patterns.

## Files

| File                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `00-cursor-ai-prompting-rules.md` | Base rules for Cursor AI                  |
| `01-core.md`                      | Core prompting principles                 |
| `02-request.md`                   | How to make requests                      |
| `03-refresh.md`                   | Context refresh/debugging patterns        |
| `04-retro.md`                     | Retrospective patterns                    |
| `05-concise.md`                   | Concise communication                     |
| `06-no-absolute-right.md`         | Flexibility principles                    |
| `07-smart-operations.md`          | **NEW** Slash commands, intent detection  |

## Smart Operations (v2.0)

The framework now includes enhanced productivity features:

### Quick Actions (Slash Commands)

```
/fix @file          Fix issues in file
/refactor @file     Refactor file
/review @file       Code review
/component <name>   Create component bundle
/view <name>        Create view templates
/form <name>        Create DataBound form
/sync               Sync AI configs
/validate           Validate project
```

### Communication Modes

```
/quick    Minimal output, maximum efficiency
/verbose  Detailed explanations
/standard Default balanced mode
```

### Pre-Flight Checks

All code modifications are automatically scanned against `preflight-checks.yaml` before being applied:

- **CRITICAL**: Blocks execution (CouchCMS tags in comments, XSS, eval)
- **WARNING**: Shows warning, asks to proceed
- **INFO**: Informs only

### Smart Defaults

File types automatically load relevant agents/modules per `smart-defaults.yaml`:

| File Pattern | Auto-Loaded Context |
|--------------|---------------------|
| `*.php` | couchcms agent, couchcms-core module |
| `*.ts` | typescript agent, typescript module |
| `snippets/forms/*.html` | databound-forms agent + module |
| `snippets/components/*.html` | couchcms + alpinejs agents |

## Usage

These files define how AI agents should communicate and respond. They can be:

1. **Referenced directly** in conversations
2. **Included in rules** for consistent AI behavior
3. **Used as templates** for custom prompting patterns

## Integration

To use in your project's `.cursorrules` or agent definitions:

```markdown
# Communication Style

Follow the AAPF framework principles:

- Core: Direct, actionable responses
- Concise: Minimal but complete
- Flexible: No absolute right answers
- Smart: Use slash commands for efficiency
```

## Configuration Files

| File | Purpose |
|------|---------|
| `preflight-checks.yaml` | Code quality checks before modification |
| `smart-defaults.yaml` | File type → agent/module mappings |
| `defaults.yaml` | Project path and naming conventions |

## Related Documentation

- `docs/IMPROVEMENTS-PROPOSAL.md` - Full analysis and future enhancements
- `agents/` - Specialized AI agents
- `modules/` - Knowledge modules
- `prompts/` - Reusable prompts and workflows
