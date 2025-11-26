# Cursor Custom Commands

Reusable slash commands for CouchCMS projects.

## Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `code-review.md` | Comprehensive code review checklist | `/code-review` |
| `create-component.md` | Create a new CouchCMS component | `/create-component` |
| `retro.md` | Generate session retrospective with auto-analysis | `/retro` |
| `refactor.md` | Intelligent refactoring with auto-detection | `/refactor` |
| `refactor-file.md` | Refactor a file using toolkit patterns | `/refactor-file` |
| `refactor-modules.md` | Validate and refactor modules | `/refactor-modules` |
| `refactor-agents.md` | Validate and refactor agents | `/refactor-agents` |
| `refactor-toolkit.md` | Refactor or optimize toolkit components | `/refactor-toolkit` |
| `validate-code.md` | Validate code against project standards | `/validate-code` |
| `create-form.md` | Create a DataBound Form | `/create-form` |
| `create-view.md` | Create a CouchCMS view | `/create-view` |
| `fix-issues.md` | Fix common issues in selected files | `/fix-issues` |
| `add-authentication.md` | Add authentication to a template | `/add-authentication` |

## How It Works

Commands are automatically synced from `commands/` to your project's `.cursor/commands/` when you run:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

## Using Commands

1. Type `/` in Cursor chat
2. Select a command from the dropdown
3. Follow the instructions

## Creating Custom Commands

### Project-Specific Commands

Create commands in `.cursor/commands/`:

```bash
.cursor/commands/
  └── my-custom-command.md
```

### Shared Commands (Toolkit Contribution)

To add commands to the toolkit:

1. Create `.md` file in `ai-toolkit-shared/commands/`
2. Use `{{paths.xxx}}` variables for paths
3. Keep commands framework-agnostic where possible
4. Add to this README

## Command Format

Commands are plain Markdown files:

```markdown
# Command Title

Brief description of what this command does.

## Steps

1. First step
2. Second step
3. Third step

## Examples

Example usage or output.
```

## Path Variables

Commands support path variables that are replaced during sync:

- `{{paths.snippets}}` - Snippets directory
- `{{paths.components}}` - Component files
- `{{paths.views}}` - View files
- `{{paths.forms}}` - Form files
- `{{paths.filters}}` - Filter files
- `{{paths.layouts}}` - Layout files

## Best Practices

1. **Keep commands focused** - One command per workflow
2. **Use clear titles** - Descriptive command names
3. **Include examples** - Show expected usage
4. **Use path variables** - Make commands portable
5. **Document dependencies** - Mention required modules/agents
