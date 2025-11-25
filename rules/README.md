# Cursor Rules

Auto-loading refactoring and workflow rules for Cursor IDE.

## Available Rules

| Rule                      | Glob Pattern                                                         | Description                   |
| ------------------------- | -------------------------------------------------------------------- | ----------------------------- |
| `refactor-html.mdc`       | `{{paths.snippets}}/**/*.html`, `*.php`                              | CouchCMS templates, Alpine.js |
| `refactor-typescript.mdc` | `{{paths.typescript}}/**/*.ts`                                       | TypeScript files              |
| `refactor-css.mdc`        | `{{paths.css}}/**/*.css`                                             | CSS/TailwindCSS files         |
| `refactor-forms.mdc`      | `{{paths.forms}}/**/*.html`                                          | DataBound Forms               |
| `design.mdc`              | `**/*.html`, `**/*.php`, `**/*.css`, `**/*.js`                       | UI/UX design principles       |
| `daisyui.mdc`             | `alwaysApply: true`                                                  | daisyUI 5 component library   |
| `index.mdc`               | `**/*.php`, `**/*.html`, `**/*.ts`, `**/*.css`, `**/*.js`, `**/*.md` | Documentation bridge          |
| `refresh.md`              | Manual trigger                                                       | Debugging workflow            |
| `request.md`              | Manual trigger                                                       | Feature request workflow      |
| `retro.md`                | Manual trigger                                                       | Retrospective workflow        |

## How It Works

When you select files in Cursor that match a glob pattern, the corresponding rules are automatically loaded into the chat context.

Rules with `alwaysApply: true` are always active regardless of file selection.

## Path Variables

Rules use `{{paths.xxx}}` variables that are replaced during sync:

- `{{paths.snippets}}` → `snippets` (or configured path)
- `{{paths.typescript}}` → `assets/ts` (or configured path)
- `{{paths.css}}` → `assets/css` (or configured path)
- `{{paths.forms}}` → `snippets/forms` (or configured path)
- `{{paths.views}}` → `snippets/views` (or configured path)
- `{{paths.filters}}` → `snippets/filters` (or configured path)
- `{{paths.components}}` → `snippets/components` (or configured path)
- `{{paths.layouts}}` → `snippets/layouts` (or configured path)
- `{{paths.public}}` → `public` (or configured path)

## Installation

Rules are automatically copied to `.cursor/rules/` when running:

```bash
# During init
bun ai-toolkit-shared/scripts/init.js

# Or manually sync
bun ai-toolkit-shared/scripts/sync.js
```

## Rule Categories

### Refactoring Rules

Auto-loaded based on file type:

- `refactor-html.mdc` - HTML/PHP template refactoring
- `refactor-typescript.mdc` - TypeScript refactoring
- `refactor-css.mdc` - CSS/TailwindCSS refactoring
- `refactor-forms.mdc` - Form refactoring

### Framework Rules

Always active:

- `daisyui.mdc` - daisyUI 5 component library reference
- `design.mdc` - UI/UX design principles

### Workflow Rules

Manual triggers (`.md` files):

- `refresh.md` - Debugging workflow
- `request.md` - Feature request workflow
- `retro.md` - Retrospective workflow

### Bridge Rules

Documentation and navigation:

- `index.mdc` - Connects Cursor with toolkit documentation

## Adding Custom Rules

### Project-Specific Rules

1. Create `.mdc` file in `.cursor/rules/` directory
2. Add frontmatter with `globs` array or `alwaysApply: true`
3. Rules are automatically loaded by Cursor

### Shared Rules

To add rules to the toolkit for all projects:

1. Create `.mdc` file in `ai-toolkit-shared/rules/`
2. Use `{{paths.xxx}}` variables for paths
3. Keep rules framework-agnostic where possible
4. Add to this README

## Rule Format

### Frontmatter

```yaml
---
description: Rule description
globs: ['**/*.html', '**/*.php']
alwaysApply: false
---
```

### Content

- Use clear, actionable instructions
- Reference project standards when applicable
- Include examples where helpful
- Keep language generic (use variables for project-specific paths)

## Best Practices

1. **Keep rules focused** - One rule per concern
2. **Use path variables** - Make rules portable across projects
3. **Document globs** - Clear file matching patterns
4. **Test rules** - Verify they load correctly in Cursor
5. **Update README** - Document new rules here

## Troubleshooting

### Rules not loading

1. Check file extension (`.mdc` for auto-load, `.md` for manual)
2. Verify frontmatter format (YAML)
3. Check glob patterns match your files
4. Restart Cursor IDE

### Path variables not replaced

1. Run sync script: `bun ai-toolkit-shared/scripts/sync.js`
2. Check `project.md` has correct path configuration
3. Verify `defaults.yaml` in toolkit has path definitions
