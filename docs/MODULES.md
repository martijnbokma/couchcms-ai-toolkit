# Available Modules

Knowledge modules provide AI assistants with framework-specific patterns and best practices.

## Core Modules

### couchcms-core

**Always included automatically.**

Provides core CouchCMS patterns, template structures, security practices, and common workflows.

**Includes:**

- Template inheritance patterns
- Editable regions and data types
- Authentication and ownership validation
- DataBound Forms basics
- Security best practices
- Common tag patterns

---

## Frontend Modules

### tailwindcss

TailwindCSS 4 patterns, utility-first CSS, and responsive design.

**Includes:**

- TailwindCSS 4 setup (CSS-based config)
- Utility class patterns
- Responsive design (mobile-first)
- Custom CSS guidelines
- Performance optimization

**Requires:** None
**Conflicts:** None

---

### daisyUI

daisyUI 5 component library with theme management.

**Includes:**

- daisyUI 5 component patterns
- Semantic color system (theme-aware)
- Component examples
- Custom theme creation
- CSS variable usage

**Requires:** `tailwindcss`
**Conflicts:** None

---

### alpinejs

Alpine.js patterns with CouchCMS integration.

**Includes:**

- Alpine.js reactive patterns
- CouchCMS compatibility (no `:` shorthand)
- Common component patterns
- Event handling
- Integration with CouchCMS data

**Requires:** None
**Conflicts:** None

---

### typescript

TypeScript standards, patterns, and best practices.

**Includes:**

- Strict TypeScript configuration
- Naming conventions
- Type definitions
- Error handling patterns
- DOM interaction patterns
- Integration with Alpine.js

**Requires:** None
**Conflicts:** None

---

## Backend Modules

### databound-forms

DataBound Forms for CRUD operations, validation, and security.

**Includes:**

- Form structure and patterns
- Create/Edit/Delete workflows
- File upload handling
- Validation patterns
- Security (auth, ownership, CSRF)
- Repeatable regions

**Requires:** `couchcms-core`
**Conflicts:** None

---

## Module Selection Guide

### For Basic CouchCMS Project

```yaml
modules:
    - couchcms-core # Always included
```

### For Modern Frontend Project

```yaml
modules:
    - couchcms-core
    - tailwindcss
    - daisyui
    - alpinejs
```

### For Full-Stack TypeScript Project

```yaml
modules:
    - couchcms-core
    - tailwindcss
    - daisyui
    - alpinejs
    - typescript
    - databound-forms
```

---

## Module Dependencies

```
couchcms-core (required by all)
    ├── databound-forms
    └── [standalone modules]
        ├── tailwindcss
        │   └── daisyui
        ├── alpinejs
        └── typescript
```

---

## Adding Modules to Your Project

Edit `project.md`:

```yaml
modules:
    - couchcms-core
    - tailwindcss
    - alpinejs
```

Then sync:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

---

## See Also

- [Available Agents](AGENTS.md)
- [Getting Started](GETTING-STARTED.md)
- [Configuration Guide](GETTING-STARTED.md#manual-setup-advanced)
