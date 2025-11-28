---
name: daisyUI
description: daisyUI 5 components and theming
allowed-tools: Read, Write, Bash, Grep
type: module
category: frontend
version: 5.0
---



# daisyUI Standards

## Installation

&#x60;&#x60;&#x60;bash title&#x3D;&quot;command.sh&quot;
bun add daisyui
&#x60;&#x60;&#x60;

## Configuration

### CSS Setup

&#x60;&#x60;&#x60;css title&#x3D;&quot;styles.css&quot;
@import &quot;tailwindcss&quot;;
@plugin &quot;daisyui&quot;;
&#x60;&#x60;&#x60;

### Theme Configuration

&#x60;&#x60;&#x60;css title&#x3D;&quot;styles.css&quot;
@plugin &quot;daisyui&quot; {
  themes: light --default, dark --prefersdark;
}
&#x60;&#x60;&#x60;

## Content-Aware Colors

### 🚨 CRITICAL: Use Semantic Colors

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;!-- ✅ GOOD: Adapts to theme --&gt;
&lt;div class&#x3D;&quot;bg-base-100 text-base-content&quot;&gt;
  &lt;button class&#x3D;&quot;btn btn-primary&quot;&gt;
    &lt;!-- ❌ BAD: Breaks in dark theme --&gt;
    &lt;div class&#x3D;&quot;bg-white text-gray-900&quot;&gt;&lt;/div&gt;
  &lt;/button&gt;
&lt;/div&gt;
&#x60;&#x60;&#x60;

### Color System

| Color                        | Usage                  |
| ---------------------------- | ---------------------- |
| &#x60;base-100/200/300&#x60;           | Background surfaces    |
| &#x60;base-content&#x60;               | Text on base colors    |
| &#x60;primary&#x60;                    | Primary brand color    |
| &#x60;primary-content&#x60;            | Text on primary        |
| &#x60;secondary&#x60;                  | Secondary brand color  |
| &#x60;accent&#x60;                     | Accent/highlight color |
| &#x60;neutral&#x60;                    | Neutral elements       |
| &#x60;info/success/warning/error&#x60; | Status colors          |

## Common Components

### Buttons

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;button class&#x3D;&quot;btn&quot;&gt;Default&lt;/button&gt;
&lt;button class&#x3D;&quot;btn btn-primary&quot;&gt;Primary&lt;/button&gt;
&lt;button class&#x3D;&quot;btn btn-outline btn-secondary&quot;&gt;Outline&lt;/button&gt;
&lt;button class&#x3D;&quot;btn btn-ghost&quot;&gt;Ghost&lt;/button&gt;
&#x60;&#x60;&#x60;

### Cards

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;div class&#x3D;&quot;card bg-base-100 shadow-xl&quot;&gt;
  &lt;figure&gt;&lt;img src&#x3D;&quot;...&quot; alt&#x3D;&quot;...&quot; /&gt;&lt;/figure&gt;
  &lt;div class&#x3D;&quot;card-body&quot;&gt;
    &lt;h2 class&#x3D;&quot;card-title&quot;&gt;Title&lt;/h2&gt;
    &lt;p&gt;Content&lt;/p&gt;
    &lt;div class&#x3D;&quot;card-actions justify-end&quot;&gt;
      &lt;button class&#x3D;&quot;btn btn-primary&quot;&gt;Action&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
&#x60;&#x60;&#x60;

### Forms

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;div class&#x3D;&quot;form-control&quot;&gt;
  &lt;label class&#x3D;&quot;label&quot;&gt;
    &lt;span class&#x3D;&quot;label-text&quot;&gt;Label&lt;/span&gt;
  &lt;/label&gt;
  &lt;input type&#x3D;&quot;text&quot; class&#x3D;&quot;input input-bordered&quot; /&gt;
&lt;/div&gt;
&#x60;&#x60;&#x60;

### Modal

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;button onclick&#x3D;&quot;my_modal.showModal()&quot; class&#x3D;&quot;btn&quot;&gt;Open&lt;/button&gt;
&lt;dialog id&#x3D;&quot;my_modal&quot; class&#x3D;&quot;modal&quot;&gt;
  &lt;div class&#x3D;&quot;modal-box&quot;&gt;
    &lt;h3 class&#x3D;&quot;text-lg font-bold&quot;&gt;Title&lt;/h3&gt;
    &lt;p&gt;Content&lt;/p&gt;
  &lt;/div&gt;
  &lt;form method&#x3D;&quot;dialog&quot; class&#x3D;&quot;modal-backdrop&quot;&gt;
    &lt;button&gt;close&lt;/button&gt;
  &lt;/form&gt;
&lt;/dialog&gt;
&#x60;&#x60;&#x60;

## Custom Theme

&#x60;&#x60;&#x60;css title&#x3D;&quot;styles.css&quot;
@plugin &quot;daisyui/theme&quot; {
  name: &quot;custom&quot;;
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
&#x60;&#x60;&#x60;

## Best Practices

### DO

- Use daisyUI components for common UI patterns
- Use semantic color classes (&#x60;base-content&#x60;, &#x60;primary&#x60;, etc.)
- Customize via themes, not utility overrides
- Check existing components before creating custom ones

### DON&#x27;T

- Use Tailwind color classes (&#x60;text-gray-800&#x60;) with daisyUI
- Override component styles with &#x60;!important&#x60;
- Mix Bootstrap and daisyUI
- Ignore theme consistency

