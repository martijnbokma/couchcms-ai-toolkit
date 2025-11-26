---
id: alpinejs
name: "Alpine.js"
category: "frontend"
version: "3.x"
description: "Alpine.js patterns and CouchCMS integration"
required: false
requires: []
conflicts: []
---

# Alpine.js Standards

## Installation

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
></script>
```

Or via npm:

```bash
bun add alpinejs
```

## CouchCMS Integration

### 🚨 CRITICAL: Colon Syntax Compatibility

CouchCMS conflicts with Alpine's shorthand colon syntax:

```html
<!-- ❌ BAD: Causes CouchCMS error -->
<div :class="{ 'active': isActive }">
  <!-- ✅ GOOD: Use x-bind: prefix -->
  <div x-bind:class="{ 'active': isActive }"></div>
</div>
```

### What Works Fine

- `@click`, `@input`, `@submit` (event handlers)
- `x-show`, `x-if`, `x-for`
- `x-model`, `x-data`, `x-init`
- `x-transition`

### What Needs x-bind:

- `:class` → `x-bind:class`
- `:style` → `x-bind:style`
- `:disabled` → `x-bind:disabled`
- `:href` → `x-bind:href`
- `:src` → `x-bind:src`
- Any `:attribute` → `x-bind:attribute`

## Common Patterns

### Toggle Component

```html
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>Content</div>
</div>
```

### Form Handling

```html
<form x-data="{ loading: false }" @submit.prevent="loading = true">
  <input type="text" x-bind:disabled="loading" />
  <button type="submit" x-bind:disabled="loading">
    <span x-show="!loading">Submit</span>
    <span x-show="loading">Loading...</span>
  </button>
</form>
```

### Dropdown

```html
<div x-data="{ open: false }" @click.away="open = false">
  <button @click="open = !open">Menu</button>
  <div x-show="open" x-transition class="dropdown-content">
    <a href="#">Item 1</a>
    <a href="#">Item 2</a>
  </div>
</div>
```

### Tabs

```html
<div x-data="{ activeTab: 'tab1' }">
  <div class="tabs">
    <button
      @click="activeTab = 'tab1'"
      x-bind:class="{ 'tab-active': activeTab === 'tab1' }"
    >
      Tab 1
    </button>
    <button
      @click="activeTab = 'tab2'"
      x-bind:class="{ 'tab-active': activeTab === 'tab2' }"
    >
      Tab 2
    </button>
  </div>
  <div x-show="activeTab === 'tab1'">Content 1</div>
  <div x-show="activeTab === 'tab2'">Content 2</div>
</div>
```

## With CouchCMS Data

### Passing Data to Alpine

```html
<div
  x-data="{
    items: <cms:show items_json />,
    selected: null
}"
>
  <template x-for="item in items">
    <div @click="selected = item" x-text="item.name"></div>
  </template>
</div>
```

### Conditional Rendering

```html
<cms:if user_logged_in>
  <div x-data="{ showProfile: false }">
    <button @click="showProfile = !showProfile">Profile</button>
    <div x-show="showProfile">Welcome, <cms:show k_user_name /></div>
  </div>
</cms:if>
```

## Best Practices

### DO

- Use `x-bind:` prefix for all attribute bindings
- Keep complex logic in external functions
- Use `x-data` at the component root
- Leverage `x-transition` for smooth animations

### DON'T

- Use shorthand `:` syntax (breaks CouchCMS)
- Put complex expressions in attributes
- Nest `x-data` unnecessarily
- Forget `@click.away` for dropdowns

## External Functions

For complex logic, move to external functions:

```javascript
// components/dropdown.js
export function dropdown() {
  return {
    open: false,
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
  };
}
```

```html
<div x-data="dropdown()">
  <button @click="toggle()">Menu</button>
  <div x-show="open" @click.away="close()">Content</div>
</div>
```
