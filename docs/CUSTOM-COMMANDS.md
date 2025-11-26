# Custom Commands Guide

Complete guide for using Cursor Custom Commands with the CouchCMS AI Toolkit.

## What are Custom Commands?

Custom Commands are reusable workflows stored as Markdown files that can be triggered with `/` in Cursor chat. They help:

- **Standardize workflows** - Consistent processes across your team
- **Save time** - Reusable commands for common tasks
- **Version control** - Commands are stored in your repository
- **Team sharing** - All team members use the same commands

## Types of Commands

### Project Commands

Stored in `.cursor/commands/` in your project:

- **Version-controlled** - Committed to your repository
- **Project-specific** - Tailored to your codebase
- **Team-shared** - All team members have access

### User Commands

Stored in `~/.cursor/commands/` or `~/.claude/commands/`:

- **Global** - Available in all projects
- **Personal** - Your personal workflows
- **Not version-controlled** - Stored locally

## How Commands Work

1. **Type `/`** in Cursor chat
2. **Select command** from dropdown
3. **AI executes** the command instructions
4. **Follow workflow** defined in the command

## Toolkit Integration

The toolkit automatically syncs commands from `commands/` to your project's `.cursor/commands/`:

### Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `code-review.md` | Comprehensive code review checklist | `/code-review` |
| `create-component.md` | Create a new CouchCMS component | `/create-component` |
| `refactor-file.md` | Refactor using toolkit patterns | `/refactor-file` |
| `validate-code.md` | Validate against project standards | `/validate-code` |
| `create-form.md` | Create a DataBound Form | `/create-form` |
| `create-view.md` | Create a CouchCMS view | `/create-view` |
| `fix-issues.md` | Fix common issues automatically | `/fix-issues` |
| `add-authentication.md` | Add authentication to template | `/add-authentication` |

### Syncing Commands

Commands are automatically synced when you run:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

This:
1. Copies commands from toolkit `commands/` to project `.cursor/commands/`
2. Replaces `{{paths.xxx}}` variables with your project paths
3. Ensures all commands are up to date

## Creating Custom Commands

### Project-Specific Commands

Create commands in `.cursor/commands/`:

```bash
.cursor/commands/
  └── my-custom-command.md
```

**Example:**

```markdown
# My Custom Command

Description of what this command does.

## Steps

1. First step
2. Second step
3. Third step
```

### Shared Commands (Toolkit Contribution)

To add commands to the toolkit for all projects:

1. **Create `.md` file** in `ai-toolkit-shared/commands/`
2. **Use path variables** - Replace hardcoded paths with `{{paths.xxx}}`
3. **Keep framework-agnostic** where possible
4. **Add to README** - Document in `commands/README.md`

**Example:**

```markdown
# Create Component

Create a component in {{paths.components}}/{name}.html

## Steps

1. Create component file
2. Add structure
3. Style with daisyUI
```

## Command Format

Commands are plain Markdown files with:

### Structure

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

### Best Practices

1. **Clear title** - Descriptive command name
2. **Brief description** - What the command does
3. **Numbered steps** - Clear workflow
4. **Examples** - Show expected usage
5. **Path variables** - Use `{{paths.xxx}}` for portability

## Path Variables

Commands support path variables that are replaced during sync:

| Variable | Default | Description |
|----------|---------|-------------|
| `{{paths.snippets}}` | `snippets` | Snippets directory |
| `{{paths.components}}` | `snippets/components` | Component files |
| `{{paths.views}}` | `snippets/views` | View files |
| `{{paths.forms}}` | `snippets/forms` | Form files |
| `{{paths.filters}}` | `snippets/filters` | Filter files |
| `{{paths.layouts}}` | `snippets/layouts` | Layout files |
| `{{paths.css}}` | `assets/css` | CSS files |
| `{{paths.typescript}}` | `assets/ts` | TypeScript files |

## Examples

### Example 1: Code Review Command

```markdown
# Code Review

Perform a comprehensive code review.

## Checklist

- [ ] Security issues
- [ ] Code quality
- [ ] Performance
- [ ] Accessibility

## Output

Provide:
1. List of issues
2. Priority levels
3. Suggested fixes
```

### Example 2: Create Component Command

```markdown
# Create Component

Create a new component in {{paths.components}}/{name}.html

## Requirements

- Component name
- Description
- Props/parameters

## Steps

1. Create component file
2. Add structure
3. Style with daisyUI
```

### Example 3: Fix Issues Command

```markdown
# Fix Issues

Automatically fix common issues.

## Fixable Issues

- CouchCMS tags in comments
- Missing self-closing tags
- Hardcoded colors
- Alpine.js shorthand

## Process

1. Scan for issues
2. Categorize by priority
3. Fix automatically
4. Report changes
```

## Using Commands

### In Cursor Chat

1. Type `/` in chat input
2. Select command from dropdown
3. AI executes the command
4. Follow the workflow

### Command Execution

The AI will:
1. Read the command file
2. Understand the workflow
3. Execute steps
4. Provide results

## Best Practices

### 1. Keep Commands Focused

One command per workflow:

```markdown
# ✅ Good: Focused command
# Create Component
Creates a single component

# ❌ Bad: Too broad
# Do Everything
Creates components, forms, views, fixes issues...
```

### 2. Use Clear Titles

Descriptive command names:

```markdown
# ✅ Good: Clear title
# Code Review Checklist

# ❌ Bad: Vague title
# Review
```

### 3. Include Examples

Show expected usage:

```markdown
## Example

**Input**: `/create-component card`

**Output**: Creates `components/card.html`
```

### 4. Use Path Variables

Make commands portable:

```markdown
# ✅ Good: Uses variable
Create component in {{paths.components}}/{name}.html

# ❌ Bad: Hardcoded path
Create component in snippets/components/{name}.html
```

### 5. Document Dependencies

Mention required modules/agents:

```markdown
## Requirements

- Requires `couchcms-core` module
- Requires `tailwindcss` module
```

## Troubleshooting

### Commands Not Appearing

1. **Check directory** - Ensure `.cursor/commands/` exists
2. **Verify file extension** - Must be `.md`
3. **Restart Cursor** - Sometimes needed after adding commands
4. **Check sync** - Run `bun ai-toolkit-shared/scripts/sync.js`

### Path Variables Not Replaced

1. **Run sync script**: `bun ai-toolkit-shared/scripts/sync.js`
2. **Check `project.md`** - Verify path configuration
3. **Verify `defaults.yaml`** - Check toolkit has path definitions

### Command Not Working

1. **Check syntax** - Ensure valid Markdown
2. **Review steps** - Verify workflow is clear
3. **Test manually** - Try executing steps yourself
4. **Check dependencies** - Ensure required modules/agents are active

## Integration with Toolkit

Custom Commands work seamlessly with the toolkit:

1. **Auto-synced** - Commands from toolkit `commands/` are copied to your project
2. **Path-aware** - Variables are replaced with your project paths
3. **Version-controlled** - Commands are committed to your repository
4. **Team-shared** - All team members get the same commands

## See Also

- [Project Rules Guide](PROJECT-RULES.md) - Project-specific rules
- [User Rules Guide](USER-RULES.md) - Global preferences
- [Commands README](../commands/README.md) - Available toolkit commands
- [Cursor Commands Documentation](https://docs.cursor.com/en/agent/chat/commands) - Official docs
