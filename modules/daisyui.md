---
id: daisyui
name: "daisyUI"
version: "5.0"
description: "daisyUI 5 components and theming"
required: false
requires: [tailwindcss]
conflicts: []
---

# daisyUI Standards

## Installation

```bash
bun add daisyui
```

## Configuration

### CSS Setup
```css
@import 'tailwindcss';
@plugin "daisyui";
```

### Theme Configuration
```css
@plugin "daisyui" {
    themes: light --default, dark --prefersdark;
}
```

## Content-Aware Colors

### 🚨 CRITICAL: Use Semantic Colors
```html
<!-- ✅ GOOD: Adapts to theme -->
<div class="bg-base-100 text-base-content">
<button class="btn btn-primary">

<!-- ❌ BAD: Breaks in dark theme -->
<div class="bg-white text-gray-900">
```

### Color System
| Color | Usage |
|-------|-------|
| `base-100/200/300` | Background surfaces |
| `base-content` | Text on base colors |
| `primary` | Primary brand color |
| `primary-content` | Text on primary |
| `secondary` | Secondary brand color |
| `accent` | Accent/highlight color |
| `neutral` | Neutral elements |
| `info/success/warning/error` | Status colors |

## Common Components

### Buttons
```html
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline btn-secondary">Outline</button>
<button class="btn btn-ghost">Ghost</button>
```

### Cards
```html
<div class="card bg-base-100 shadow-xl">
    <figure><img src="..." alt="..." /></figure>
    <div class="card-body">
        <h2 class="card-title">Title</h2>
        <p>Content</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary">Action</button>
        </div>
    </div>
</div>
```

### Forms
```html
<div class="form-control">
    <label class="label">
        <span class="label-text">Label</span>
    </label>
    <input type="text" class="input input-bordered" />
</div>
```

### Modal
```html
<button onclick="my_modal.showModal()" class="btn">Open</button>
<dialog id="my_modal" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Title</h3>
        <p>Content</p>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
```

## Custom Theme

```css
@plugin "daisyui/theme" {
    name: 'custom';
    default: true;
    color-scheme: dark;
    
    --color-base-100: oklch(22% 0.019 237.69);
    --color-base-200: oklch(18% 0.015 237.69);
    --color-base-300: oklch(14% 0.012 237.69);
    --color-base-content: oklch(95% 0.01 240);
    
    --color-primary: oklch(67.2% 0.289 341.94);
    --color-primary-content: oklch(98% 0.01 341.94);
    
    --color-secondary: oklch(68.8% 0.207 12.04);
    --color-accent: oklch(74.7% 0.18 57.14);
    
    --radius-box: 0.5rem;
    --radius-field: 0.25rem;
}
```

## Best Practices

### DO
- Use daisyUI components for common UI patterns
- Use semantic color classes (`base-content`, `primary`, etc.)
- Customize via themes, not utility overrides
- Check existing components before creating custom ones

### DON'T
- Use Tailwind color classes (`text-gray-800`) with daisyUI
- Override component styles with `!important`
- Mix Bootstrap and daisyUI
- Ignore theme consistency
