---
id: tailwindcss
name: "TailwindCSS"
category: "frontend"
version: "4.0"
description: "TailwindCSS 4 patterns and best practices"
required: false
requires: []
conflicts: [bootstrap]
---

# TailwindCSS Standards

## Installation (TailwindCSS 4)

```bash
bun add tailwindcss @tailwindcss/vite
```

## Configuration

### CSS Entry Point

```css
/* No tailwind.config.js needed in v4! */
@import "tailwindcss";

/* Content sources */
@source "./**/*.{html,php,js,ts}";
@source "../snippets/**/*.{html,php}";

/* Plugins */
@plugin '@tailwindcss/typography';
@plugin '@tailwindcss/forms';
```

### Vite Configuration

```javascript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

## Key Differences in v4

- **NO tailwind.config.js** - CSS-based configuration
- **@source directives** in CSS instead of content array
- **@plugin directives** in CSS instead of plugins array
- **Built-in Vite plugin** with `@tailwindcss/vite`

## Class Organization

Group classes logically:

```html
<!-- Layout → Spacing → Colors → Typography → Effects -->
<div
  class="flex items-center gap-4 p-6 bg-base-100 text-base-content rounded-lg shadow-md"
></div>
```

## Responsive Design

### Mobile-First Approach

```html
<!-- Base (mobile) → sm → md → lg → xl → 2xl -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
></div>
```

### Common Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Best Practices

### DO

- Use utility-first classes
- Prefer Tailwind utilities over custom CSS
- Use responsive prefixes (`sm:`, `md:`, `lg:`)
- Group classes logically
- Use semantic color classes

### DON'T

- Write custom CSS when utilities suffice
- Use global element selectors with `!important`
- Mix inline styles with utility classes
- Ignore responsive design

## CSS Architecture

### 🚨 CRITICAL: No Global Element Selectors

```css
/* ❌ FORBIDDEN */
img {
    max-height: 200px !important;
}

/* ✅ GOOD: Use utility classes in HTML */
<img class="max-h-48 object-cover" />
```

### Custom CSS (When Needed)

Only write custom CSS for properties Tailwind doesn't provide:

```css
.custom-clip {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
```

## Performance

### FOUC Prevention

CSS defaults must match JavaScript configuration:

```css
/* CSS must match JS carousel config */
@media (min-width: 1280px) {
  .carousel .slide {
    width: calc(20% - 19.2px); /* 5 slides, 24px spacing */
  }
}
```

### Build Verification

```bash
# After modifying CSS
bun run build:css

# Verify changes
grep "your-rule" public/css/bundle.css

# Hard refresh browser (Cmd+Shift+R)
```
