# Cursor Rules

Auto-loading refactoring rules for Cursor IDE.

## Available Rules

| Rule                      | Glob Pattern                            | Description                   |
| ------------------------- | --------------------------------------- | ----------------------------- |
| `refactor-html.mdc`       | `{{paths.snippets}}/**/*.html`, `*.php` | CouchCMS templates, Alpine.js |
| `refactor-typescript.mdc` | `{{paths.typescript}}/**/*.ts`          | TypeScript files              |
| `refactor-css.mdc`        | `{{paths.css}}/**/*.css`                | CSS/TailwindCSS files         |
| `refactor-forms.mdc`      | `{{paths.forms}}/**/*.html`             | DataBound Forms               |

## How It Works

When you select files in Cursor that match a glob pattern, the corresponding rules are automatically loaded into the chat context.

## Path Variables

Rules use `{{paths.xxx}}` variables that are replaced during sync:

- `{{paths.snippets}}` → `snippets`
- `{{paths.typescript}}` → `assets/ts`
- `{{paths.css}}` → `assets/css`
- `{{paths.forms}}` → `snippets/forms`
- `{{paths.views}}` → `snippets/views`
- `{{paths.filters}}` → `snippets/filters`

## Installation

Rules are automatically copied to `.cursor/rules/` when running:

```bash
bun run ai:sync
```

## Adding Custom Rules

1. Create `.mdc` file in this directory
2. Add frontmatter with `globs` array
3. Run `bun run ai:sync` to deploy
