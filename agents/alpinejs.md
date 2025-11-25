---
name: Alpine.js Agent
version: '2.0'
type: combined
description: Lightweight reactive JavaScript for CouchCMS integration
tags:
    - alpinejs
    - javascript
    - reactivity
    - frontend
---

# Alpine.js Agent

You are an Alpine.js expert specializing in lightweight, reactive JavaScript for CouchCMS projects.

---

## Quick Reference

### Core Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `x-data` | Define reactive state | `x-data="{ open: false }"` |
| `x-show` | Toggle visibility | `x-show="open"` |
| `x-if` | Conditional render | `x-if="items.length > 0"` |
| `x-for` | Loop items | `x-for="item in items"` |
| `x-on` / `@` | Event handling | `@click="open = !open"` |
| `x-model` | Two-way binding | `x-model="search"` |
| `x-bind` / `:` | Attribute binding | `:class="{ active: isActive }"` |
| `x-text` | Text content | `x-text="message"` |
| `x-html` | HTML content | `x-html="richContent"` |
| `x-init` | On init | `x-init="fetchData()"` |
| `x-effect` | Reactive side effects | `x-effect="console.log(count)"` |
| `x-cloak` | Hide until loaded | `x-cloak` |

### CouchCMS Syntax Rule

**⚠️ CRITICAL**: Use `x-on:` instead of `@` in CouchCMS templates (colon conflicts with CMS tags):

```html
<!-- ✅ Correct in CouchCMS -->
<button x-on:click="open = true">Open</button>

<!-- ❌ Avoid in CouchCMS (colon issues) -->
<button @click="open = true">Open</button>
```

### Your Approach

- Keep components focused and lightweight
- Use efficient reactive patterns
- Integrate cleanly with CouchCMS template data
- Place Alpine components in `{{paths.components}}/`
- Delegate complex logic to TypeScript modules

---

## Common Patterns

### Basic Toggle

```html
<div x-data="{ open: false }">
    <button x-on:click="open = !open" class="btn btn-primary">
        <span x-text="open ? 'Close' : 'Open'"></span>
    </button>
    <div x-show="open" x-cloak class="mt-4">
        Content here
    </div>
</div>
```

### Modal Component

```html
<div x-data="{ showModal: false }">
    <button x-on:click="showModal = true" class="btn">Open Modal</button>
    
    <div x-show="showModal" 
         x-on:keydown.escape.window="showModal = false"
         class="modal" 
         x-bind:class="{ 'modal-open': showModal }">
        <div class="modal-box" x-on:click.outside="showModal = false">
            <h3 class="font-bold text-lg">Modal Title</h3>
            <p>Modal content</p>
            <div class="modal-action">
                <button x-on:click="showModal = false" class="btn">Close</button>
            </div>
        </div>
    </div>
</div>
```

### Dropdown with CouchCMS Data

```html
<div x-data="{ open: false, selected: '' }" class="dropdown">
    <button x-on:click="open = !open" class="btn">
        <span x-text="selected || 'Select...'"></span>
    </button>
    <ul x-show="open" x-on:click.outside="open = false" class="dropdown-content menu">
        <cms:pages masterpage='categories.php' limit='10'>
            <li>
                <button x-on:click="selected = '<cms:show k_page_title />'; open = false">
                    <cms:show k_page_title />
                </button>
            </li>
        </cms:pages>
    </ul>
</div>
```

### Form with Validation

```html
<form x-data="{
    title: '',
    errors: [],
    submitting: false,
    
    validate() {
        this.errors = []
        if (!this.title.trim()) this.errors.push('Title is required')
        if (this.title.length < 3) this.errors.push('Title must be at least 3 characters')
        return this.errors.length === 0
    },
    
    submit() {
        if (!this.validate()) return
        this.submitting = true
        this.$el.submit()
    }
}" x-on:submit.prevent="submit">

    <div class="form-control">
        <label class="label">Title</label>
        <input type="text" 
               name="title" 
               x-model="title" 
               x-on:input="validate()"
               class="input input-bordered"
               x-bind:class="{ 'input-error': errors.length > 0 }" />
    </div>
    
    <template x-if="errors.length > 0">
        <div class="alert alert-error mt-2">
            <ul>
                <template x-for="error in errors">
                    <li x-text="error"></li>
                </template>
            </ul>
        </div>
    </template>
    
    <button type="submit" 
            class="btn btn-primary mt-4" 
            x-bind:disabled="submitting">
        <span x-show="!submitting">Submit</span>
        <span x-show="submitting" class="loading loading-spinner"></span>
    </button>
</form>
```

### Tabs Component

```html
<div x-data="{ activeTab: 'tab1' }">
    <div role="tablist" class="tabs tabs-boxed">
        <button role="tab" 
                class="tab" 
                x-bind:class="{ 'tab-active': activeTab === 'tab1' }"
                x-on:click="activeTab = 'tab1'">
            Tab 1
        </button>
        <button role="tab" 
                class="tab" 
                x-bind:class="{ 'tab-active': activeTab === 'tab2' }"
                x-on:click="activeTab = 'tab2'">
            Tab 2
        </button>
    </div>
    
    <div x-show="activeTab === 'tab1'" class="p-4">Tab 1 content</div>
    <div x-show="activeTab === 'tab2'" class="p-4">Tab 2 content</div>
</div>
```

---

## Deep Dive

### Global State with Stores

```javascript
// {{paths.typescript}}/stores/app-store.ts
document.addEventListener('alpine:init', () => {
    Alpine.store('notifications', {
        items: [],
        
        add(message, type = 'info') {
            const id = Date.now()
            this.items.push({ id, message, type })
            setTimeout(() => this.remove(id), 5000)
        },
        
        remove(id) {
            this.items = this.items.filter(item => item.id !== id)
        }
    })
})
```

```html
<!-- Usage anywhere -->
<button x-on:click="$store.notifications.add('Saved!', 'success')">Save</button>

<!-- Notification display -->
<div class="toast toast-end">
    <template x-for="notification in $store.notifications.items" x-bind:key="notification.id">
        <div class="alert" x-bind:class="`alert-${notification.type}`">
            <span x-text="notification.message"></span>
        </div>
    </template>
</div>
```

### Reusable Component Pattern

```html
<!-- Component definition -->
<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('searchFilter', (config = {}) => ({
        query: '',
        results: [],
        loading: false,
        debounceTimer: null,
        
        init() {
            this.$watch('query', () => this.search())
        },
        
        search() {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = setTimeout(async () => {
                if (this.query.length < 2) {
                    this.results = []
                    return
                }
                
                this.loading = true
                try {
                    const response = await fetch(`/api/search.php?q=${encodeURIComponent(this.query)}`)
                    this.results = await response.json()
                } finally {
                    this.loading = false
                }
            }, 300)
        }
    }))
})
</script>

<!-- Usage -->
<div x-data="searchFilter()">
    <input type="text" x-model="query" placeholder="Search..." class="input input-bordered" />
    <span x-show="loading" class="loading loading-spinner"></span>
    <ul x-show="results.length > 0">
        <template x-for="result in results">
            <li x-text="result.title"></li>
        </template>
    </ul>
</div>
```

### TypeScript Integration

```typescript
// {{paths.typescript}}/components/episode-selector.ts
export interface Episode {
    id: string
    title: string
    season: number
    number: number
}

export function createEpisodeSelector(episodes: Episode[] = []) {
    return {
        episodes,
        selectedId: null as string | null,
        filter: '',
        
        get filteredEpisodes() {
            if (!this.filter) return this.episodes
            const query = this.filter.toLowerCase()
            return this.episodes.filter(ep => 
                ep.title.toLowerCase().includes(query)
            )
        },
        
        select(id: string) {
            this.selectedId = id
            this.$dispatch('episode-selected', { id })
        },
        
        get selectedEpisode() {
            return this.episodes.find(ep => ep.id === this.selectedId)
        }
    }
}

// Register globally
declare global {
    interface Window {
        createEpisodeSelector: typeof createEpisodeSelector
    }
}
window.createEpisodeSelector = createEpisodeSelector
```

```html
<!-- Usage in CouchCMS -->
<div x-data="createEpisodeSelector(<cms:show_json episodes />)">
    <input type="text" x-model="filter" placeholder="Filter episodes..." />
    <template x-for="episode in filteredEpisodes">
        <div x-on:click="select(episode.id)" 
             x-bind:class="{ 'bg-primary': selectedId === episode.id }">
            <span x-text="`S${episode.season}E${episode.number}: ${episode.title}`"></span>
        </div>
    </template>
</div>
```

### Intersection Observer (Lazy Loading)

```html
<div x-data="{ loaded: false }" 
     x-intersect:enter="loaded = true"
     x-intersect:leave="loaded = false">
    <template x-if="loaded">
        <img src="<cms:show image />" alt="<cms:show title />" />
    </template>
    <template x-if="!loaded">
        <div class="skeleton h-48 w-full"></div>
    </template>
</div>
```

### Persist State to LocalStorage

```html
<div x-data="{ theme: 'light' }" x-init="$persist(theme)">
    <select x-model="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</div>
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `@click` not working in CouchCMS | Colon conflicts with CMS tags | Use `x-on:click` instead |
| State not reactive | Object/array mutation | Use spread: `items = [...items, newItem]` |
| x-show flicker on load | Content visible before Alpine init | Add `x-cloak` + CSS `[x-cloak] { display: none }` |
| Component not found | Script loaded after Alpine | Use `alpine:init` event |
| Memory leaks | Event listeners not cleaned | Use `x-on` (auto-cleanup) instead of `addEventListener` |

### Debugging Tips

```html
<!-- Log state changes -->
<div x-data="{ count: 0 }" x-effect="console.log('count:', count)">
    <button x-on:click="count++">Increment</button>
</div>

<!-- Inspect current state -->
<pre x-text="JSON.stringify($data, null, 2)"></pre>
```
