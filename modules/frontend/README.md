# Frontend Modules - Optional

These modules are **optional** and can be added per project based on your needs.

## What are Frontend Modules?

Frontend modules are **optional technologies** that enhance the frontend experience but are **not required** for CouchCMS to work.

## Available Frontend Modules

### Styling Frameworks

- **`tailwindcss`** - TailwindCSS 4 patterns, utility-first CSS, and responsive design
  - Utility class patterns
  - Responsive design (mobile-first)
  - Custom CSS guidelines
  - Performance optimization

- **`daisyui`** - daisyUI 5 component library with theme management
  - Component patterns
  - Semantic color system (theme-aware)
  - Custom theme creation
  - **Requires**: `tailwindcss`

### Interactivity Frameworks

- **`alpinejs`** - Alpine.js patterns with CouchCMS integration
  - Reactive patterns
  - CouchCMS compatibility (no `:` shorthand)
  - Common component patterns
  - Event handling

- **`typescript`** - TypeScript standards, patterns, and best practices
  - Strict TypeScript configuration
  - Type definitions
  - Error handling patterns
  - DOM interaction patterns

## Usage

Add modules to `standards.md`:

```yaml
modules:
    - tailwindcss    # Optional - only if you use TailwindCSS
    - daisyui        # Optional - only if you use daisyUI
    - alpinejs       # Optional - only if you use Alpine.js
    - typescript     # Optional - only if you use TypeScript
```

## Important Notes

1. **CouchCMS works without these modules** - They are enhancements, not requirements
2. **Mix and match** - Choose only the modules you need
3. **Dependencies** - `daisyui` requires `tailwindcss`
4. **No breaking changes** - Removing these modules won't break your CouchCMS site

## When to Use

- **TailwindCSS**: When you want utility-first CSS styling
- **daisyUI**: When you want pre-built components with TailwindCSS
- **Alpine.js**: When you need lightweight JavaScript interactions
- **TypeScript**: When you need type safety for complex frontend logic

## Key Principle

**These are optional enhancements** - CouchCMS is fully functional without them. Only add what you need for your specific project requirements.
