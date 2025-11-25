# Master Prompt — DRY Design System + Styleguide (Tailwind v4 + CouchCMS)

**Role:** You are a senior Frontend Architect & Design Systems specialist.

**Goal:** Create a comprehensive, production-ready **Design System** integrated with the existing `snippets/` folder structure, using **Tailwind CSS v4** with **DaisyUI** themes and **CouchCMS** integration.
**CRITICAL:** All components must be tested thoroughly in the styleguide before any project-wide implementation.

## Project Context

The Matters Student Hub already has:

- **Tailwind CSS v4** with DaisyUI themes (`matters`, `matters_login`, `matters_test`)
- **OKLCH color system** with brand colors and semantic tokens
- **Component-specific CSS** files (buttons, cards, inputs, etc.)
- **Mobile-first responsive design** patterns
- **CouchCMS** template system with dynamic content
- **Well-organized snippets structure** with 12 component categories

## Core Requirements

- **Styleguide-First Approach:** All components must be tested in styleguide before implementation
- **Extract existing patterns** into a unified design system within snippets
- **Consistency:** single source of truth for all design tokens
- **DRY:** consolidate repeated patterns with `@apply` and utility classes
- **Modular:** small, composable UI primitives + TypeScript modules
- **CouchCMS Safe:** all dynamic tags work seamlessly in templates
- **Theme Aware:** full support for light/dark themes with content-aware colors
- **Accessibility:** WCAG 2.1 AA compliance with focus states and ARIA support
- **Performance:** minimal CSS bloat with tree-shakable TypeScript

## Implementation Approach

### Phase 1: Foundation Setup (Practical Start)

**Step 1.1: Design Tokens Extraction** ⏳

- [ ] Analyze existing CSS patterns in `public/css/`
- [ ] Extract design tokens to `snippets/design-system/assets/css/main.css`
- [ ] Integrate DaisyUI themes and OKLCH colors
- [ ] Define typography, spacing, and animation tokens

**Step 1.2: Component CSS Framework** ⏳

- [ ] Create `snippets/design-system/assets/css/components.css`
- [ ] Define @apply patterns for reusable components
- [ ] Consolidate existing button, card, and input patterns
- [ ] Create variant systems (sizes, colors, states)

**Step 1.3: Utilities CSS** ⏳

- [ ] Create `snippets/design-system/assets/css/utilities.css`
- [ ] Define custom utility classes
- [ ] Add accessibility utilities
- [ ] Create responsive helper classes

### Phase 2: Component Development (CouchCMS Focus)

**Step 2.1: Core Components** ⏳

- [ ] Create `snippets/design-system/components/button.html` (CouchCMS template)
- [ ] Create `snippets/design-system/components/card.html` (CouchCMS template)
- [ ] Create `snippets/design-system/components/input.html` (CouchCMS template)
- [ ] Implement variants: primary, secondary, accent, ghost, outline
- [ ] Add sizes: sm, md, lg
- [ ] Implement states: normal, disabled, loading

**Step 2.2: Alpine.js Local Integration** ⏳

- [ ] Install Alpine.js locally via npm/bun
- [ ] Create Alpine.js components for interactive elements
- [ ] Implement theme switching with Alpine.js
- [ ] Add accessibility helpers with Alpine.js directives
- [ ] Create Alpine.js component functions (buttonComponent, cardComponent, inputComponent)
- [ ] Implement Alpine.js directives for component interactions
- [ ] Use JavaScript/TypeScript for complex logic only

**Step 2.3: Styleguide Integration** ⏳

- [ ] Update `matters-styleguide.php` with design system integration
- [ ] Create `snippets/design-system/styleguide.html` component
- [ ] Integrate all components in styleguide
- [ ] Add theme switcher (matters, matters_login, matters_test)
- [ ] Implement component showcase with live examples
- [ ] Add accessibility testing tools
- [ ] Use local Alpine.js instead of CDN
- [ ] Update bundle paths to match new structure

### Phase 3: Project Integration (After Styleguide Approval)

**Step 3.1: CSS Integration** ⏳

- [ ] Import design system tokens in `public/assets/design-system.css`
- [ ] Update existing component CSS files
- [ ] Maintain backward compatibility
- [ ] Test all existing components
- [ ] **Only proceed after styleguide approval**

**Step 3.2: Component Migration** ⏳

- [ ] Migrate existing buttons to new design system
- [ ] Migrate existing cards to new design system
- [ ] Migrate existing inputs to new design system
- [ ] Update all template references
- [ ] **Only proceed after styleguide approval**

**Step 3.3: Documentation & Training** ⏳

- [ ] Update project guidelines
- [ ] Create component usage guide
- [ ] Document migration process
- [ ] Train team on new patterns

**Entry File Structure:**

```
snippets/design-system/assets/
├── css/
│   ├── main.css                    # ⭐ Main CSS entry file
│   ├── utilities.css               # Utility classes
│   └── components/
│       ├── buttons.css             # Button components
│       ├── cards.css               # Card components
│       ├── inputs.css              # Input components
│       ├── modals.css              # Modal components
│       ├── toasts.css              # Toast components
│       ├── navigation.css          # Navigation components
│       └── README.md               # Component documentation
└── js/
    ├── main.js                     # ⭐ Main JS entry file (Alpine.js + components)
    ├── components.js               # Alpine.js component functions
    └── complex-logic.ts            # TypeScript for complex logic
```

**CSS Entry File (`assets/css/main.css`):**

```css
/* Design System Main Entry Point */
@import 'tailwindcss';

/* Design System Imports */
@import './components/buttons.css';
@import './components/cards.css';
@import './components/inputs.css';
@import './components/modals.css';
@import './components/toasts.css';
@import './components/navigation.css';
@import './utilities.css';

/* DaisyUI Plugin Configuration */
@plugin "daisyui" {
    themes:
        matters --default,
        matters_login,
        matters_test;
    root: ':root';
    include:;
    exclude:;
    prefix: '';
    logs: true;
}

/* Design Tokens */
@theme {
    /* Typography */
    --font-display: 'Funnel Display', sans-serif;
    --font-sans: 'Inter', sans-serif;
    --font-serif: 'Merriweather', serif;

    /* Matters Brand Colors */
    --color-matters-primary: oklch(0.672 0.289 341.94);
    --color-matters-secondary: oklch(0.688 0.207 12.04);
    --color-matters-accent: oklch(0.747 0.18 57.14);

    /* Touch Target Sizes */
    --touch-target-min: 44px;
    --touch-target-comfortable: 48px;
    --touch-target-large: 56px;
}
```

**JavaScript Entry File (`assets/js/main.js`):**

```javascript
/* Design System Main Entry Point */
import Alpine from 'alpinejs'
import { buttonComponent } from './components.js'
import { cardComponent } from './components.js'
import { inputComponent } from './components.js'
import { themeSwitcher } from './components.js'

// Register Alpine.js components
Alpine.data('buttonComponent', buttonComponent)
Alpine.data('cardComponent', cardComponent)
Alpine.data('inputComponent', inputComponent)
Alpine.data('themeSwitcher', themeSwitcher)

// Start Alpine.js
Alpine.start()
```

**Updated Build Configuration:**

```javascript
// bun.config.js
export default {
    entrypoints: {
        // CSS bundle
        'design-system.css': './snippets/design-system/assets/css/main.css',

        // JavaScript bundle
        'design-system.js': './snippets/design-system/assets/js/main.js',
    },

    outdir: './public/assets/',
    target: 'browser',
    minify: true,
    sourcemap: 'external',
    splitting: true,
    treeshaking: true,

    external: ['couchcms'],
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
}
```

**Step 4.7: Matters Styleguide Integration** ⏳

- [ ] Update `matters-styleguide.php` with local Alpine.js integration
- [ ] Replace CDN Alpine.js with local bundle
- [ ] Update bundle paths to `public/assets/design-system.css` and `public/assets/design-system.js`
- [ ] Create `snippets/design-system/styleguide.html` component
- [ ] Add all design system components to styleguide
- [ ] Implement component showcase with live examples
- [ ] Add interactive controls for variant testing
- [ ] Implement theme switcher (matters, matters_login, matters_test)
- [ ] Add accessibility testing tools
- [ ] Create comprehensive component documentation
- [ ] Test all components in styleguide environment
- [ ] Validate bundle performance and loading

**Alpine.js + Local JS/TS Build Scripts:**

```json
{
    "scripts": {
        "build:css": "tailwindcss -i ./snippets/design-system/assets/css/main.css -o ./public/assets/design-system.css --minify",
        "build:js": "esbuild ./snippets/design-system/assets/js/main.js --bundle --outfile=./public/assets/design-system.js --minify",
        "build": "npm run build:css && npm run build:js",
        "dev:css": "tailwindcss -i ./snippets/design-system/assets/css/main.css -o ./public/assets/design-system.css --watch",
        "dev:js": "esbuild ./snippets/design-system/assets/js/main.js --bundle --outfile=./public/assets/design-system.js --watch",
        "dev": "npm run dev:css & npm run dev:js"
    }
}
```

**TailwindCSS Config:**

```javascript
// tailwind.config.js
module.exports = {
    content: ['./snippets/**/*.html', './snippets/**/*.js', './public/**/*.html'],
    theme: {
        extend: {
            // Design system tokens
            colors: {
                'matters-primary': 'oklch(0.672 0.289 341.94)',
                'matters-secondary': 'oklch(0.688 0.207 12.04)',
                'matters-accent': 'oklch(0.747 0.18 57.14)',
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['matters', 'matters_login', 'matters_test'],
    },
}
```

**Basic Security & Accessibility:**

- [ ] Add basic XSS prevention
- [ ] Implement basic accessibility (ARIA labels, focus states)
- [ ] Test color contrast ratios
- [ ] Add keyboard navigation

### Phase 5: Project Integration (Only After Approval)

**Step 5.1: CSS Integration** ⏳

- [ ] Import design system tokens into `public/assets/design-system.css`
- [ ] Update existing component CSS files
- [ ] Maintain backward compatibility
- [ ] Test all existing components
- [ ] **Only proceed after styleguide approval**

**Step 5.2: Component Migration** ⏳

- [ ] Migrate existing buttons to new design system
- [ ] Migrate existing cards to new design system
- [ ] Migrate existing inputs to new design system
- [ ] Update all template references
- [ ] **Only proceed after styleguide approval**

**Step 5.3: Documentation & Training** ⏳

- [ ] Update project guidelines
- [ ] Create component usage guide
- [ ] Document migration process
- [ ] Train team on new patterns

## Design System Structure (Alpine.js + Local JS/TS Approach)

```
snippets/design-system/
├── components/
│   ├── button.html          # CouchCMS + Alpine.js button template
│   ├── card.html            # CouchCMS + Alpine.js card template
│   ├── input.html           # CouchCMS + Alpine.js input template
│   ├── modal.html           # CouchCMS + Alpine.js modal template
│   ├── toast.html           # CouchCMS + Alpine.js toast template
│   └── navigation.html      # CouchCMS + Alpine.js navigation template
├── assets/
│   ├── css/
│   │   ├── main.css         # Main CSS entry file
│   │   ├── utilities.css    # Utility classes
│   │   └── components/
│   │       ├── buttons.css  # Button components
│   │       ├── cards.css    # Card components
│   │       ├── inputs.css   # Input components
│   │       ├── modals.css   # Modal components
│   │       ├── toasts.css   # Toast components
│   │       ├── navigation.css # Navigation components
│   │       └── README.md    # Component documentation
│   └── js/
│       ├── main.js          # Alpine.js + component functions
│       ├── components.js    # Complex component logic (TypeScript)
│       └── utils.js         # Utility functions
├── styleguide.html          # Interactive testing environment with Alpine.js
└── README.md                # Documentation
```

**Styleguide Component Structure:**

```html
<!-- snippets/design-system/styleguide.html -->
<div x-data="styleguide()" class="styleguide-container">
    <!-- Theme Switcher -->
    <div class="styleguide-header">
        <h1>Matters Design System</h1>
        <div x-data="themeSwitcher()" class="theme-switcher">
            <button @click="switchTheme('matters')" :class="{ active: theme === 'matters' }">Matters</button>
            <button @click="switchTheme('matters_login')" :class="{ active: theme === 'matters_login' }">Login</button>
            <button @click="switchTheme('matters_test')" :class="{ active: theme === 'matters_test' }">Test</button>
        </div>
    </div>

    <!-- Color Palette -->
    <section class="styleguide-section">
        <h2>Color Palette</h2>
        <div class="color-grid">
            <div class="color-swatch bg-primary text-primary-content">Primary</div>
            <div class="color-swatch bg-secondary text-secondary-content">Secondary</div>
            <div class="color-swatch bg-accent text-accent-content">Accent</div>
        </div>
    </section>

    <!-- Typography -->
    <section class="styleguide-section">
        <h2>Typography</h2>
        <div class="typography-examples">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Body text with proper line height and spacing.</p>
        </div>
    </section>

    <!-- Button Components -->
    <section class="styleguide-section">
        <h2>Button Components</h2>
        <div class="component-grid">
            <!-- Primary Buttons -->
            <div class="component-group">
                <h3>Primary Buttons</h3>
                <div class="button-variants">
                    <button x-data="buttonComponent()" :class="`btn-primary btn-sm`" @click="handleClick">Small</button>
                    <button x-data="buttonComponent()" :class="`btn-primary btn-md`" @click="handleClick">
                        Medium
                    </button>
                    <button x-data="buttonComponent()" :class="`btn-primary btn-lg`" @click="handleClick">Large</button>
                </div>
            </div>

            <!-- Secondary Buttons -->
            <div class="component-group">
                <h3>Secondary Buttons</h3>
                <div class="button-variants">
                    <button x-data="buttonComponent()" :class="`btn-secondary btn-sm`" @click="handleClick">
                        Small
                    </button>
                    <button x-data="buttonComponent()" :class="`btn-secondary btn-md`" @click="handleClick">
                        Medium
                    </button>
                    <button x-data="buttonComponent()" :class="`btn-secondary btn-lg`" @click="handleClick">
                        Large
                    </button>
                </div>
            </div>

            <!-- Button States -->
            <div class="component-group">
                <h3>Button States</h3>
                <div class="button-variants">
                    <button x-data="buttonComponent()" :class="`btn-primary btn-md`" @click="handleClick">
                        Normal
                    </button>
                    <button x-data="buttonComponent()" :class="`btn-primary btn-md btn-loading`" @click="handleClick">
                        Loading
                    </button>
                    <button x-data="buttonComponent()" :class="`btn-primary btn-md btn-disabled`" disabled>
                        Disabled
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Card Components -->
    <section class="styleguide-section">
        <h2>Card Components</h2>
        <div class="component-grid">
            <div class="card-default card-md">
                <h3>Default Card</h3>
                <p>This is a default card with standard styling.</p>
            </div>
            <div class="card-elevated card-md">
                <h3>Elevated Card</h3>
                <p>This card has elevated shadow styling.</p>
            </div>
            <div class="card-outlined card-md">
                <h3>Outlined Card</h3>
                <p>This card has outlined border styling.</p>
            </div>
        </div>
    </section>

    <!-- Input Components -->
    <section class="styleguide-section">
        <h2>Input Components</h2>
        <div class="component-grid">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Default Input</span>
                </label>
                <input type="text" placeholder="Enter text..." class="input input-bordered" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Error Input</span>
                </label>
                <input type="text" placeholder="Enter text..." class="input input-bordered input-error" />
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Success Input</span>
                </label>
                <input type="text" placeholder="Enter text..." class="input input-bordered input-success" />
            </div>
        </div>
    </section>

    <!-- Navigation Components -->
    <section class="styleguide-section">
        <h2>Navigation Components</h2>
        <div class="component-grid">
            <nav class="navbar bg-base-100">
                <div class="navbar-start">
                    <a class="btn btn-ghost text-xl">Matters</a>
                </div>
                <div class="navbar-end">
                    <a class="btn btn-ghost">Home</a>
                    <a class="btn btn-ghost">About</a>
                    <a class="btn btn-ghost">Contact</a>
                </div>
            </nav>
        </div>
    </section>

    <!-- Accessibility Testing -->
    <section class="styleguide-section">
        <h2>Accessibility Testing</h2>
        <div class="accessibility-tools">
            <button @click="testColorContrast()" class="btn btn-outline">Test Color Contrast</button>
            <button @click="testKeyboardNavigation()" class="btn btn-outline">Test Keyboard Navigation</button>
            <button @click="testScreenReader()" class="btn btn-outline">Test Screen Reader</button>
        </div>
    </section>
</div>

<script>
    function styleguide() {
        return {
            testColorContrast() {
                // Color contrast testing logic
                console.log('Testing color contrast...')
            },

            testKeyboardNavigation() {
                // Keyboard navigation testing logic
                console.log('Testing keyboard navigation...')
            },

            testScreenReader() {
                // Screen reader testing logic
                console.log('Testing screen reader...')
            },
        }
    }
</script>
```

## Simple Development Process

### Practical Workflow:

1. **Create Components** - Create CouchCMS templates in `snippets/design-system/components/`
2. **Test in Styleguide** - Add components to `styleguide.html` for testing
3. **Styleguide Approval** - Test all variants and states in styleguide
4. **Project Implementation** - Only after styleguide approval implement

### Styleguide Requirements:

**Basic Features:**

- Live component preview
- Theme switcher (matters, matters_login, matters_test)
- Responsive testing
- Accessibility check

**Documentation:**

- Component usage examples
- Best practices
- Migration guide

## Design Tokens (Based on Existing Project)

**Brand Colors (OKLCH) with Fallbacks:**

```css
:root {
    /* Primary brand colors with fallbacks */
    --color-matters-primary: oklch(0.672 0.289 341.94);
    --color-matters-primary-fallback: #8b5cf6;
    --color-matters-secondary: oklch(0.688 0.207 12.04);
    --color-matters-secondary-fallback: #6b7280;
    --color-matters-accent: oklch(0.747 0.18 57.14);
    --color-matters-accent-fallback: #f59e0b;

    /* Semantic color tokens */
    --color-success: oklch(0.7 0.15 142);
    --color-success-fallback: #10b981;
    --color-error: oklch(0.6 0.2 25);
    --color-error-fallback: #ef4444;
    --color-warning: oklch(0.75 0.15 85);
    --color-warning-fallback: #f59e0b;

    /* Performance tokens */
    --animation-duration-fast: 150ms;
    --animation-duration-normal: 200ms;
    --animation-duration-slow: 300ms;
    --animation-easing-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --animation-easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

**DaisyUI Theme Integration:**

- `matters` - Dark theme (default)
- `matters_login` - Light theme
- `matters_test` - Testing theme

**Typography Scale:**

- Display: Funnel Display (300-800)
- Sans: Inter (100-900)
- Serif: Merriweather

**Spacing & Sizing:**

- Mobile-first responsive design
- Touch targets: 44px minimum
- Consistent spacing scale (4px base)

## Component Development Patterns

**HTML Structure (CouchCMS + Alpine.js Ready):**

```html
<!-- CouchCMS + Alpine.js component template -->
<cms:ignore> [cms:component with Alpine.js interactivity] </cms:ignore>
<div
    x-data="buttonComponent()"
    :class="`btn-${variant} btn-${size}`"
    :disabled="disabled"
    @click="handleClick"
    data-variant="primary"
    data-size="md"
>
    <cms:editable name="button_text" type="text">Click me</cms:editable>
    <cms:if button_icon>
        <span class="btn-icon icon-[ph--<cms:show button_icon />]"></span>
    </cms:if>
</div>
```

**Local Alpine.js + JavaScript/TypeScript Implementation:**

```javascript
// snippets/design-system/assets/js/main.js
import Alpine from 'alpinejs'
import { buttonComponent } from './components.js'
import { cardComponent } from './components.js'
import { inputComponent } from './components.js'
import { themeSwitcher } from './components.js'

// Register Alpine.js components
Alpine.data('buttonComponent', buttonComponent)
Alpine.data('cardComponent', cardComponent)
Alpine.data('inputComponent', inputComponent)
Alpine.data('themeSwitcher', themeSwitcher)

// Start Alpine.js
Alpine.start()
```

```javascript
// snippets/design-system/assets/js/components.js
// Simple Alpine.js components for basic interactions
export function buttonComponent() {
    return {
        variant: 'primary',
        size: 'md',
        disabled: false,
        loading: false,

        init() {
            this.variant = this.$el.dataset.variant || 'primary'
            this.size = this.$el.dataset.size || 'md'
            this.disabled = this.$el.hasAttribute('disabled')
        },

        handleClick() {
            if (this.disabled || this.loading) return

            this.loading = true
            // Simple logic - use complex logic in TypeScript
            setTimeout(() => (this.loading = false), 1000)
        },
    }
}

export function cardComponent() {
    return {
        variant: 'default',
        size: 'md',
        hover: false,

        init() {
            this.variant = this.$el.dataset.variant || 'default'
            this.size = this.$el.dataset.size || 'md'
        },
    }
}

export function inputComponent() {
    return {
        type: 'text',
        placeholder: '',
        disabled: false,
        error: '',
        success: false,
        inputId: '',

        init() {
            this.inputId = 'input-' + Math.random().toString(36).substr(2, 9)
            this.type = this.$el.dataset.type || 'text'
            this.placeholder = this.$el.dataset.placeholder || ''
        },

        get inputClasses() {
            let classes = 'input input-bordered'
            if (this.error) classes += ' input-error'
            if (this.success) classes += ' input-success'
            return classes
        },

        handleInput(event) {
            // Simple validation - complex logic in TypeScript
            this.validateInput(event.target.value)
        },

        validateInput(value) {
            if (value.length < 3) {
                this.error = 'Minimum 3 characters required'
                this.success = false
            } else {
                this.error = ''
                this.success = true
            }
        },
    }
}

export function themeSwitcher() {
    return {
        theme: 'matters',

        init() {
            this.theme = localStorage.getItem('theme') || 'matters'
            this.applyTheme()
        },

        switchTheme(newTheme) {
            this.theme = newTheme
            localStorage.setItem('theme', newTheme)
            this.applyTheme()
        },

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme)
        },
    }
}
```

```typescript
// snippets/design-system/assets/js/complex-logic.ts
// Complex component logic in TypeScript
export class AdvancedButtonLogic {
    private element: HTMLElement
    private config: ButtonConfig

    constructor(element: HTMLElement, config: ButtonConfig) {
        this.element = element
        this.config = config
    }

    async handleComplexClick(): Promise<void> {
        // Complex async operations
        // API calls, validation, etc.
    }

    validateForm(): boolean {
        // Complex form validation logic
        return true
    }
}

interface ButtonConfig {
    variant: string
    size: string
    validation?: boolean
    apiEndpoint?: string
}
```

**Alpine.js Components (Declarative Approach):**

```html
<!-- Button Component with Alpine.js -->
<div
    x-data="buttonComponent()"
    :class="`btn-${variant} btn-${size}`"
    :disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    role="button"
    tabindex="0"
>
    <cms:editable name="button_text" type="text">Click me</cms:editable>
    <cms:if button_icon>
        <span class="btn-icon icon-[ph--<cms:show button_icon />]"></span>
    </cms:if>
</div>

<script>
    function buttonComponent() {
        return {
            variant: 'primary',
            size: 'md',
            disabled: false,
            loading: false,

            init() {
                // Initialize from data attributes
                this.variant = this.$el.dataset.variant || 'primary'
                this.size = this.$el.dataset.size || 'md'
                this.disabled = this.$el.hasAttribute('disabled')
            },

            handleClick() {
                if (this.disabled || this.loading) return

                this.loading = true
                // Handle button click logic
                setTimeout(() => (this.loading = false), 1000)
            },
        }
    }
</script>
```

```html
<!-- Card Component with Alpine.js -->
<div
    x-data="cardComponent()"
    :class="`card-${variant} card-${size}`"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
>
    <cms:editable name="card_title" type="text">Card Title</cms:editable>
    <cms:editable name="card_content" type="text">Card content here</cms:editable>
</div>

<script>
    function cardComponent() {
        return {
            variant: 'default',
            size: 'md',
            hover: false,

            init() {
                this.variant = this.$el.dataset.variant || 'default'
                this.size = this.$el.dataset.size || 'md'
            },
        }
    }
</script>
```

```html
<!-- Input Component with Alpine.js -->
<div x-data="inputComponent()" class="form-control">
    <label x-show="label" :for="inputId" class="label">
        <span class="label-text"><cms:show label /></span>
    </label>
    <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
    />
    <div x-show="error" class="label">
        <span class="label-text-alt text-error">{{ error }}</span>
    </div>
</div>

<script>
    function inputComponent() {
        return {
            type: 'text',
            placeholder: '',
            disabled: false,
            error: '',
            success: false,
            inputId: '',

            init() {
                this.inputId = 'input-' + Math.random().toString(36).substr(2, 9)
                this.type = this.$el.dataset.type || 'text'
                this.placeholder = this.$el.dataset.placeholder || ''
            },

            get inputClasses() {
                let classes = 'input input-bordered'
                if (this.error) classes += ' input-error'
                if (this.success) classes += ' input-success'
                return classes
            },

            handleInput(event) {
                // Input validation logic
                this.validateInput(event.target.value)
            },

            validateInput(value) {
                if (value.length < 3) {
                    this.error = 'Minimum 3 characters required'
                    this.success = false
                } else {
                    this.error = ''
                    this.success = true
                }
            },
        }
    }
</script>
```

```html
<!-- Theme Switcher with Alpine.js -->
<div x-data="themeSwitcher()" class="theme-switcher">
    <button @click="switchTheme('matters')" :class="{ active: theme === 'matters' }">Matters</button>
    <button @click="switchTheme('matters_login')" :class="{ active: theme === 'matters_login' }">Login</button>
    <button @click="switchTheme('matters_test')" :class="{ active: theme === 'matters_test' }">Test</button>
</div>

<script>
    function themeSwitcher() {
        return {
            theme: 'matters',

            init() {
                this.theme = localStorage.getItem('theme') || 'matters'
                this.applyTheme()
            },

            switchTheme(newTheme) {
                this.theme = newTheme
                localStorage.setItem('theme', newTheme)
                this.applyTheme()
            },

            applyTheme() {
                document.documentElement.setAttribute('data-theme', this.theme)
            },
        }
    }
</script>
```

**Styleguide CSS Classes:**

```css
/* Styleguide specific styles */
.styleguide-container {
    @apply mx-auto max-w-7xl p-6;
}

.styleguide-header {
    @apply border-base-300 mb-8 flex items-center justify-between border-b pb-6;
}

.styleguide-section {
    @apply mb-12;
}

.component-grid {
    @apply grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3;
}

.component-group {
    @apply space-y-4;
}

.button-variants {
    @apply flex flex-wrap gap-4;
}

.color-grid {
    @apply grid grid-cols-2 gap-4 md:grid-cols-4;
}

.color-swatch {
    @apply rounded-lg p-4 text-center font-medium;
}

.typography-examples {
    @apply space-y-4;
}

.accessibility-tools {
    @apply flex flex-wrap gap-4;
}

.theme-switcher {
    @apply flex gap-2;
}

.theme-switcher button {
    @apply btn btn-sm;
}

.theme-switcher button.active {
    @apply btn-primary;
}
```

## CouchCMS Safety Rules

**Critical:** Never place `<cms:` tags inside comments

- ❌ `<!-- <cms:embed 'component.html' /> -->`
- ✅ `<!-- [cms:embed 'component.html'] -->`

**Always wrap comments in `<cms:ignore>`:**

```html
<cms:ignore> [cms:component description] [cms:editable field explanation] </cms:ignore>
```

## Security Best Practices

**XSS Prevention:**

```typescript
// Input sanitization for all user content
private sanitizeInput(input: string): string {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}

// Content Security Policy headers
const cspHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
}
```

**Input Validation:**

```typescript
// Strict prop validation with type guards
private validateProps<T extends Record<string, any>>(props: T): T {
    const validators = {
        variant: (v: string) => ['primary', 'secondary', 'accent', 'ghost', 'outline', 'link', 'glass', 'gradient'].includes(v),
        size: (v: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
        state: (v: string) => ['normal', 'loading', 'disabled', 'success', 'error'].includes(v),
        shape: (v: string) => ['square', 'rounded', 'pill'].includes(v)
    }

    for (const [key, validator] of Object.entries(validators)) {
        if (props[key] && !validator(props[key])) {
            throw new Error(`Invalid ${key}: ${props[key]}`)
        }
    }

    return props
}
```

**CSRF Protection:**

```typescript
// CSRF token validation for forms
private validateCSRFToken(token: string): boolean {
    const storedToken = localStorage.getItem('csrf-token')
    return token === storedToken
}

// Secure event handling
private handleFormSubmit(event: Event): void {
    const form = event.target as HTMLFormElement
    const csrfToken = form.querySelector('input[name="csrf-token"]')?.value

    if (!this.validateCSRFToken(csrfToken)) {
        event.preventDefault()
        this.errorHandler(new Error('Invalid CSRF token'))
        return
    }
}
```

## Critical Constraints

**Styleguide-First Development:**

- All components must be developed and tested in styleguide first
- No project implementation without styleguide approval
- Interactive testing required for all variants and states
- Accessibility validation mandatory before approval

**CouchCMS Safety:**

- Never place `<cms:` tags inside comments
- Always wrap comments in `<cms:ignore>` with `[cms:...]`
- Test all dynamic content rendering

**Code Quality:**

- Use semantic HTML + ARIA roles for accessibility
- No duplicate files or overlapping component responsibilities
- English-only code and comments
- 4-space indentation throughout

**Performance:**

- Minimal CSS bloat with efficient @apply usage
- Tree-shakable TypeScript modules
- Mobile-first responsive design
- Touch-friendly interaction targets (44px minimum)

## Approval Process

**Styleguide Approval Required:**

1. **Component Development** - Create component in styleguide environment
2. **Interactive Testing** - Test all variants, sizes, and states in styleguide
3. **Accessibility Validation** - Verify WCAG 2.1 AA compliance
4. **Cross-Theme Testing** - Test with all DaisyUI themes
5. **Performance Validation** - Ensure no performance impact
6. **User Approval** - Get explicit approval for component in styleguide
7. **Project Implementation** - Only after styleguide approval, implement in project

**User must explicitly approve:**

- [ ] Design token values and naming
- [ ] Component API and usage patterns
- [ ] Styleguide presentation and functionality
- [ ] Component behavior and interactions
- [ ] Accessibility compliance
- [ ] Performance benchmarks
- [ ] Migration strategy and timeline

**Enhanced Features to Implement:**

- [ ] CSS layers and performance optimizations
- [ ] Alpine.js component patterns with CouchCMS integration
- [ ] Local Alpine.js installation and bundling
- [ ] JavaScript/TypeScript for complex component logic
- [ ] XSS prevention and input sanitization
- [ ] CSRF protection and security best practices
- [ ] Performance monitoring and lazy loading
- [ ] Comprehensive testing suite (unit, performance, accessibility)
- [ ] Advanced accessibility features (ARIA, keyboard navigation, screen reader support)
- [ ] Color contrast validation and focus management

**Immediate Action Required:**

- [ ] Start with Phase 1: Foundation Setup
- [ ] Extract design tokens from existing CSS patterns
- [ ] Create component CSS framework with @apply patterns
- [ ] Build utility classes and accessibility features
- [ ] Install Alpine.js locally via npm/bun
- [ ] Develop all core components (Button, Card, Input, Modal, Navigation) with Alpine.js
- [ ] Create complex component logic in JavaScript/TypeScript
- [ ] Create interactive styleguide environment with Alpine.js
- [ ] Integrate all components in `matters-styleguide.php`
- [ ] Implement local Alpine.js bundling
- [ ] Add comprehensive testing and validation
- [ ] Test all features in styleguide environment

**Critical Note:** This design system must be built from scratch with a practical Alpine.js + local JavaScript/TypeScript approach that fits CouchCMS perfectly. All components must be developed, tested, and validated in the styleguide before project implementation.

## Simple Build Strategy

**Development Workflow:**

```bash
# Development
npm run dev

# Production build
npm run build

# Clean build
rm -rf public/assets/ && npm run build
```

**Matters Styleguide Integration:**

```php
<?php require_once( 'couch/cms.php' ); ?>
<cms:extends 'layouts/specialized/minimal.html' />

<cms:block 'theme_name'>matters</cms:block>

<cms:block 'templates'>
    <cms:template title='Visual Styleguide' clonable='0' routable='1'>
        <!-- No editable fields needed - this is a static reference page -->
    </cms:template>
</cms:block>

<cms:block 'page_title'>
    <title>Design System Styleguide - Matters</title>
</cms:block>

<cms:block 'seo'>
    <meta name="description" content="Complete visual reference for the Matters design system. Interactive guide showcasing colors, typography, components, and patterns." />
    <meta name="robots" content="noindex, nofollow" />
</cms:block>

<cms:block 'content'>
    <!-- Styleguide Content -->
    <cms:embed 'design-system/styleguide.html' />
</cms:block>

<cms:block 'css'>
    <link rel="stylesheet" href="<cms:show public_path />/assets/design-system.css" />
</cms:block>
<cms:block 'js'>
    <!-- Phosphor Icons and Design System -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <script src="<cms:show public_path />/assets/design-system.js"></script>
</cms:block>

<?php COUCH::invoke(); ?>
```

**Integration with CouchCMS + Local Alpine.js:**

```html
<!-- In CouchCMS templates -->
<link rel="stylesheet" href="/assets/design-system.css" />
<script src="/assets/design-system.js" defer></script>

<!-- Component usage with Alpine.js -->
<div
    x-data="buttonComponent()"
    :class="`btn-${variant} btn-${size}`"
    @click="handleClick"
    data-variant="primary"
    data-size="md"
>
    <cms:editable name="button_text" type="text">Click me</cms:editable>
</div>
```

**Performance Targets:**

- **CSS Bundle**: < 30KB gzipped
- **JS Bundle**: < 20KB gzipped (Alpine.js + custom logic)
- **Total Bundle**: < 50KB gzipped
- **Load Time**: < 50ms for design system assets
