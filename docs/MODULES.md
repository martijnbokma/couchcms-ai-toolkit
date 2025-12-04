# Available Modules

Knowledge modules provide AI assistants with framework-specific patterns and best practices.

Modules are organized by category to help you find the right patterns for your project.

---

## Core Modules

### couchcms-core

**Always included automatically.**

Provides core CouchCMS patterns, template structures, security practices, and common workflows.

**Category:** `core`

**Includes:**

- Template inheritance patterns
- Editable regions and data types
- Authentication and ownership validation
- Security best practices
- Common tag patterns

**Requires:** None
**Conflicts:** None

---

## Frontend Modules

Frontend frameworks and tools for building modern user interfaces.

### tailwindcss

TailwindCSS 4 patterns, utility-first CSS, and responsive design.

**Category:** `frontend`

**Includes:**

- TailwindCSS 4 setup (CSS-based config)
- Utility class patterns
- Responsive design (mobile-first)
- Custom CSS guidelines
- Performance optimization

**Requires:** None
**Conflicts:** None

---

### daisyui

daisyUI 5 component library with theme management.

**Category:** `frontend`

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

**Category:** `frontend`

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

**Category:** `frontend`

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

## Content Management Modules

Modules for organizing and structuring content.

### folders

Content organization with virtual folders and nested pages.

**Category:** `content`

**Includes:**

- Virtual folder structure
- Nested page hierarchies
- Folder-based navigation
- SEO-friendly URL patterns

**Requires:** `couchcms-core`
**Conflicts:** None

---

### archives

Archive views for time-based content organization.

**Category:** `content`

**Includes:**

- Archive view patterns
- Date-based filtering
- Time-based navigation
- Archive URL structures

**Requires:** `couchcms-core`
**Conflicts:** None

---

### relationships

Page relationships and related content patterns.

**Category:** `content`

**Includes:**

- Related pages functionality
- Bidirectional relationships
- Relationship queries
- Related content display

**Requires:** `couchcms-core`
**Conflicts:** None

---

### repeatable-regions

Repeatable content blocks and dynamic regions.

**Category:** `content`

**Includes:**

- Repeatable region patterns
- Dynamic content blocks
- Nested repeatable regions
- Form handling for repeatables

**Requires:** `couchcms-core`
**Conflicts:** None

---

## Navigation & Discovery Modules

Modules for navigation, search, and routing.

### search

Search functionality with MySQL fulltext and relevance ranking.

**Category:** `navigation`

**Includes:**

- Fulltext search implementation
- Search form patterns
- Relevance ranking
- Search result pagination

**Requires:** `couchcms-core`
**Conflicts:** None

---

### pagination

Pagination controls for pages, search results, and comments.

**Category:** `navigation`

**Includes:**

- Page pagination
- Search result pagination
- Comment pagination
- Navigation controls

**Requires:** `couchcms-core`
**Conflicts:** None

---

### custom-routes

Custom URL routing and clean URL patterns.

**Category:** `navigation`

**Includes:**

- Custom route definitions
- URL pattern matching
- Route validation
- Clean URL generation

**Requires:** `couchcms-core`
**Conflicts:** None

---

## User Features Modules

Modules for user management and interaction.

### users

User management, access control, and authentication.

**Category:** `user-features`

**Includes:**

- User authentication patterns
- Access level control
- User registration
- Permission management

**Requires:** `couchcms-core`
**Conflicts:** None

---

### comments

User comments with moderation and spam prevention.

**Category:** `user-features`

**Includes:**

- Comment form patterns
- Comment moderation
- Spam prevention (CAPTCHA)
- Comment listing and pagination

**Requires:** `couchcms-core`
**Conflicts:** None

---

## Forms Modules

Modules for form handling and CRUD operations.

### databound-forms

CouchCMS DataBound Forms implementation patterns.

**Category:** `forms`

**Includes:**

- Form structure and patterns
- Create/Edit/Delete workflows
- File upload handling
- Validation patterns
- Security (auth, ownership, CSRF)

**Requires:** `couchcms-core`
**Conflicts:** None

---

## Module Selection Guide

### For Basic CouchCMS Project

```yaml
modules:
    - couchcms-core # Always included
```text

### For Modern Frontend Project

```yaml
# Knowledge Modules - Choose based on your project needs
modules:
    - couchcms-core
    - tailwindcss
    - daisyui
    - alpinejs
```

### For Content-Rich Site

```yaml
# Knowledge Modules - Choose based on your project needs
modules:
    - couchcms-core
    - folders
    - archives
    - relationships
    - search
    - pagination
```text

### For User-Interactive Site

```yaml
# Knowledge Modules - Choose based on your project needs
modules:
    - couchcms-core
    - users
    - comments
    - databound-forms
```

### For Full-Stack TypeScript Project

```yaml
# Knowledge Modules - Choose based on your project needs
modules:
    - couchcms-core
    - tailwindcss
    - daisyui
    - alpinejs
    - typescript
    - databound-forms
    - search
    - pagination
```yaml

---

## Module Dependencies

```text
couchcms-core (required by all)
    ├── databound-forms
    ├── folders
    ├── archives
    ├── relationships
    ├── repeatable-regions
    ├── search
    ├── pagination
    ├── custom-routes
    ├── users
    ├── comments
    └── [standalone modules]
        ├── tailwindcss
        │   └── daisyui
        ├── alpinejs
        └── typescript
```

---

## Module Categories Summary

| Category | Modules | Count |
|----------|---------|-------|
| **Core** | couchcms-core | 1 |
| **Frontend** | tailwindcss, daisyui, alpinejs, typescript | 4 |
| **Content Management** | folders, archives, relationships, repeatable-regions | 4 |
| **Navigation & Discovery** | search, pagination, custom-routes | 3 |
| **User Features** | users, comments | 2 |
| **Forms** | databound-forms | 1 |
| **Total** | | **15** |

---

## Adding Modules to Your Project

Edit `standards.md` (or `.project/standards.md`):

```yaml
# Knowledge Modules - Choose based on your project needs
modules:
    - couchcms-core
    - tailwindcss
    - alpinejs
    - folders
    - search
```text

Then sync:

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/cli/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/cli/sync.js --watch
```

---

## Module Organization

All modules include:

- **Category metadata** - Logical grouping
- **Descriptions** - Clear purpose statements
- **Dependencies** - Required modules
- **Patterns** - Code examples and best practices
- **Rules** - Critical guidelines and anti-patterns

Use `bun scripts/analyze-modules.js` to check module organization and quality.

---

---

## AI Agent Framework (Optional)

### framework (AAPF)

The **Autonomous Agent Prompting Framework (AAPF)** provides disciplined, evidence-first operational principles for AI agents.

**Category:** `framework` (special - not a module)

**Includes:**

- **Doctrine** - Core operational principles (always active when enabled)
- **Directives** - Communication guidelines (always active when enabled)
- **Playbooks** - Structured workflows for specific tasks (optional)
- **Enhancements** - Advanced features like slash commands (optional)

**Structure:**

```text
framework/
├── doctrine/          # Core principles (always loaded)
├── directives/        # Communication guidelines (always loaded)
├── playbooks/         # Workflow templates (optional)
├── enhancements/      # Advanced features (optional)
└── docs/              # Documentation
```text

**Configuration:**

```yaml
# Minimal: Only doctrine + directives
framework:
  doctrine: true
  directives: true

# Standard: Include playbooks
framework:
  doctrine: true
  directives: true
  playbooks: true

# Full: Everything
framework: true
```

**When to Use:**

- ✅ You want structured, disciplined AI agent behavior
- ✅ You need systematic workflows for complex tasks
- ✅ You want autonomous problem-solving with verification
- ✅ You prefer evidence-based decision making

**See Also:**

- [Framework README](../framework/README.md) - Complete framework documentation
- [Framework Testing](../framework/docs/testing.md) - Test scenarios and evaluation

---

## See Also

- [Extending Modules](EXTENDING-MODULES.md) - How to extend modules from documentation
- [Available Agents](AGENTS.md) - Specialized AI agents
- [Getting Started](GETTING-STARTED.md) - Setup guide
- [Module Guide](MODULE-GUIDE.md) - Complete module organization and improvement guide
