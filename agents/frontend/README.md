# Frontend Agents - Optional

These agents are **optional** and can be added per project based on your technology choices.

## What are Frontend Agents?

Frontend agents are **optional** and provide specialized assistance for frontend technologies. They are only available if you use the corresponding technologies in your project.

## Available Frontend Agents

### Styling
- **`tailwindcss`** - TailwindCSS 4 styling with daisyUI 5 components
- **`admin-panel-theming`** - CouchCMS admin panel customization and theming

### Interactivity
- **`alpinejs`** - Lightweight reactive JavaScript for CouchCMS integration
- **`typescript`** - Type-safe TypeScript for CouchCMS projects

## Usage

Add agents to `standards.md`:

```yaml
agents:
    - tailwindcss    # Optional - only if you use TailwindCSS
    - alpinejs       # Optional - only if you use Alpine.js
    - typescript     # Optional - only if you use TypeScript
```

## Important Notes

1. **Only add agents for technologies you use** - Don't add `tailwindcss` agent if you don't use TailwindCSS
2. **Agents match modules** - If you add a module, consider adding the corresponding agent
3. **No breaking changes** - Removing these agents won't break your project

## When to Use

- **`tailwindcss`**: When you use TailwindCSS for styling
- **`admin-panel-theming`**: When you customize the CouchCMS admin panel
- **`alpinejs`**: When you use Alpine.js for interactions
- **`typescript`**: When you use TypeScript for frontend logic

## Key Principle

**These are optional enhancements** - Only add agents for technologies you actually use in your project. CouchCMS core agents are always available regardless of your frontend choices.
