# Available AI Agents

AI agents provide specialized guidance for specific development tasks.

## Development Agents

### couchcms

Core CouchCMS development - templates, patterns, and workflows.

**Use for:**

- Creating templates
- Template inheritance
- Editable regions
- Authentication
- Common CouchCMS patterns

---

### databound-forms

Forms, CRUD operations, validation, and security.

**Use for:**

- Create/Edit/Delete forms
- Form validation
- File uploads
- Ownership checks
- Security patterns

---

### alpinejs

Alpine.js development with CouchCMS integration.

**Use for:**

- Interactive components
- Alpine + CouchCMS integration
- Dropdown, modal, tab patterns
- Event handling
- Reactive state management

---

### tailwindcss

TailwindCSS 4 + daisyUI 5 styling.

**Use for:**

- Responsive layouts
- Component styling
- Theme management
- daisyUI components
- CSS architecture

---

### typescript

TypeScript development, patterns, and standards.

**Use for:**

- Type definitions
- Error handling
- Interface design
- Integration patterns
- Code organization

---

## Utility Agents

### custom-routes

Clean URLs and routing with CouchCMS.

**Use for:**

- Custom route configuration
- URL patterns
- Route parameters
- SEO-friendly URLs

---

### mysql

Database operations and optimization.

**Use for:**

- Database queries
- Performance optimization
- Data modeling
- Query debugging

---

### bun

Bun runtime and build tooling.

**Use for:**

- Build configuration
- Package management
- Script optimization
- Performance tuning

---

### git

Version control and collaboration workflows.

**Use for:**

- Git workflows
- Branch management
- Commit conventions
- Collaboration patterns

---

## Agent Selection Guide

### For CouchCMS Development

```yaml
agents:
    - couchcms
    - databound-forms
```

### For Frontend-Heavy Project

```yaml
agents:
    - couchcms
    - tailwindcss
    - alpinejs
    - typescript
```

### For Full Team Workflow

```yaml
agents:
    - couchcms
    - databound-forms
    - tailwindcss
    - alpinejs
    - typescript
    - git
```

---

## How Agents Work

Agents provide:

1. **Quick Reference** - Common patterns and checklists
2. **Deep Dive** - Detailed examples and explanations
3. **Refactoring Patterns** - How to improve existing code
4. **Troubleshooting** - Common issues and solutions

AI assistants use these to provide context-aware suggestions.

---

## Adding Agents to Your Project

Edit `project.md`:

```yaml
agents:
    - couchcms
    - tailwindcss
    - alpinejs
```

Then sync:

```bash
bun ai-toolkit-shared/scripts/sync.js
```

---

## See Also

- [Available Modules](MODULES.md)
- [Getting Started](GETTING-STARTED.md)
