# Refactoring Prompts

Refactoring prompts provide specialized workflows for improving code quality while preserving functionality and design.

## Available Prompts

### Router

**`router.md`** - Intelligent refactoring router that analyzes files and selects appropriate specialists.

**Use when**: You want comprehensive refactoring with analysis and specialist selection.

**How it works**:

1. Analyzes tagged files completely
2. Identifies technology patterns and refactoring concerns
3. Selects appropriate refactoring resources (`.mdc` rules, agents, specialized prompts)
4. Presents findings and requests confirmation
5. Routes to selected specialist(s) after confirmation

**Example usage**:

```
Refactor @assets/css/components/cards-coming-soon.css using @ai-toolkit-shared/prompts/refactoring/router.md
```

### Design-Preserving

**`design-preserving.md`** - Preserves visual design while updating functionality.

**Use when**: You need to modernize JavaScript/TypeScript without changing the visual appearance.

**Preserves**:

- All CSS classes and styling
- Visual hierarchy and layout
- Color schemes and theming
- Responsive behavior
- Typography and spacing

**Updates**:

- JavaScript/TypeScript code
- Framework-specific implementation
- Error handling
- Accessibility features
- Performance optimizations

### Functionality-Preserving

**`functionality-preserving.md`** - Preserves functionality while updating design/structure.

**Use when**: You need to modernize HTML/CSS without changing behavior.

**Preserves**:

- All event handlers and callbacks
- State management and data flow
- API interactions
- User interaction patterns

**Updates**:

- HTML structure
- CSS classes and styling
- Design system components
- Accessibility markup
- Responsive behavior

### Toolkit Refactoring

**`toolkit.md`** - Refactor or optimize toolkit components (scripts, configs, prompts, modules, agents, rules).

**Use when**: You want to refactor or optimize the toolkit itself.

**Handles**:

- **Scripts** (`scripts/*.js`) - Refactor sync.js, validate.js, etc.
- **Configuration** (`*.yaml`, `defaults.yaml`) - Optimize config structure
- **Prompts** (`prompts/**/*.md`) - Improve prompt structure
- **Modules** (`modules/*.md`) - Refactor module documentation
- **Agents** (`agents/*.md`) - Optimize agent guidelines
- **Rules** (`rules/*.mdc`) - Refactor auto-loading rules
- **Commands** (`commands/*.md`) - Improve command definitions

**Special Considerations**:

- Maintains toolkit architecture principles
- Ensures backward compatibility
- Updates CHANGELOG.md automatically
- Verifies sync.js and validate.js still work
- Documents breaking changes
- Updates all cross-references

**Example usage**:

```
Refactor @scripts/sync.js using @prompts/refactoring/toolkit.md
Optimize @prompts/refactoring/router.md using @prompts/refactoring/toolkit.md
```

**Related**: See also `@prompts/best-practices/toolkit-optimization.md` for performance optimization strategies.

## Auto-Loading Rules

The following `.mdc` rules automatically load when matching files are selected:

- **`refactor-html.mdc`** - CouchCMS templates, Alpine.js
- **`refactor-typescript.mdc`** - TypeScript files
- **`refactor-css.mdc`** - CSS/TailwindCSS files
- **`refactor-forms.mdc`** - DataBound Forms

These rules provide quick reference guidelines but don't include analysis or specialist selection.

## Workflow

### Quick Refactoring (Auto-Loading Rules)

When you select a file that matches a glob pattern, the corresponding `.mdc` rule automatically loads:

```
Select: assets/css/components/card.css
→ refactor-css.mdc automatically loads
→ Apply rules directly
```

### Comprehensive Refactoring (Router)

For thorough refactoring with analysis:

```
1. Tag file(s): @assets/css/components/card.css
2. Request router: Use @ai-toolkit-shared/prompts/refactoring/router.md
3. Router analyzes files
4. Router selects appropriate specialist(s)
5. Router presents findings and requests confirmation
6. After confirmation, router executes selected specialist workflow
```

## Best Practices

1. **Use router for complex refactoring**: When multiple files or technologies are involved
2. **Use auto-loading rules for quick fixes**: When you know exactly what needs to be changed
3. **Always confirm before refactoring**: The router will request confirmation, but you should review changes
4. **Preserve what matters**: Use design-preserving or functionality-preserving prompts when appropriate
5. **Check dependencies**: When refactoring, consider how changes affect related files

## Integration with Agents

Refactoring prompts work alongside development agents:

- **`couchcms`** agent - Provides CouchCMS patterns and best practices
- **`tailwindcss`** agent - Provides TailwindCSS optimization guidance
- **`alpinejs`** agent - Provides Alpine.js integration patterns
- **`typescript`** agent - Provides TypeScript patterns and standards
- **`databound-forms`** agent - Provides DataBound Forms patterns

The router automatically selects relevant agents based on file analysis.

## See Also

- [Available Agents](../../docs/AGENTS.md)
- [Cursor Rules](../../rules/README.md)
- [Getting Started](../../docs/GETTING-STARTED.md)
