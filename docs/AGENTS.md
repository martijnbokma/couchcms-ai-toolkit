# Available AI Agents

AI agents provide specialized guidance for specific development tasks.

## Quick Reference

| Agent | Category | Primary Use |
|-------|----------|-------------|
| `@couchcms` | Development | Core CouchCMS templates and patterns |
| `@databound-forms` | Development | Forms, CRUD operations, validation |
| `@search` | Development | Fulltext search implementation |
| `@pagination` | Development | Pagination controls |
| `@comments` | Development | Comment system with moderation |
| `@users` | Development | User management and access control |
| `@views` | Development | List, Page, Folder, and Archive views |
| `@folders` | Development | Virtual folders and content organization |
| `@archives` | Development | Time-based content organization |
| `@relationships` | Development | Page relationships (one-to-many, many-to-many) |
| `@repeatable-regions` | Development | Dynamic content blocks |
| `@nested-pages` | Development | Hierarchical page structures |
| `@photo-gallery` | Development | Image galleries with batch upload |
| `@rss-feeds` | Development | RSS feed generation |
| `@on-page-editing` | Development | Inline and popup editing |
| `@admin-panel-theming` | Development | Admin panel customization |
| `@custom-routes` | Utility | Clean URLs and routing |
| `@alpinejs` | Utility | Reactive JavaScript integration |
| `@tailwindcss` | Utility | Styling with TailwindCSS |
| `@typescript` | Utility | Type-safe development |
| `@bun` | Utility | Runtime and package management |
| `@git` | Utility | Version control workflows |
| `@mysql` | Utility | Database operations |

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

### search

Fulltext search implementation with MySQL relevance ranking.

**Use for:**

- Search form creation
- Search result display
- Relevance ranking
- Search pagination
- Multi-template search
- Search term highlighting

---

### pagination

Pagination for pages, search results, and comments.

**Use for:**

- Page navigation
- Record counting
- Next/previous links
- Page number display
- Pagination variables

---

### relationships

Page relationships between templates.

**Use for:**

- Many-to-many relationships
- One-to-many relationships
- One-to-one relationships
- Related content display
- Bidirectional relationships

---

### views

Template views - List, Page, Folder, and Archive views.

**Use for:**

- View detection
- Page view implementation
- List view implementation
- Folder view implementation
- Archive view implementation
- URL pattern handling

---

### comments

Comment system with moderation and spam prevention.

**Use for:**

- Comment forms
- Comment display
- Comment moderation
- CAPTCHA integration
- Comment pagination
- Spam prevention

---

### users

User management and access control.

**Use for:**

- User authentication
- Access level management
- Permission checks
- User groups
- Protected content
- Login/logout handling

---

### folders

Virtual folders for content organization.

**Use for:**

- Folder creation
- Hierarchical organization
- Folder navigation
- Breadcrumbs
- SEO-friendly URLs
- Folder-based filtering

---

### repeatable-regions

Dynamic repeatable content blocks.

**Use for:**

- Portfolio galleries
- Image galleries
- Dynamic content arrays
- Sortable content
- Multiple field groups
- Tabular data input

---

### photo-gallery

Photo gallery with batch upload and EXIF data.

**Use for:**

- Batch image upload
- Gallery management
- EXIF data extraction
- Automatic thumbnails
- Album organization
- Image metadata

---

### rss-feeds

RSS feed generation for content syndication.

**Use for:**

- RSS feed creation
- XML feed generation
- Content syndication
- News distribution
- Feed validation

---

### archives

Archive views by time periods.

**Use for:**

- Yearly archives
- Monthly archives
- Daily archives
- Archive navigation
- Date-based organization

---

### nested-pages

Hierarchical page structures and menus.

**Use for:**

- Site navigation
- Dynamic menus
- Breadcrumbs
- Hierarchical organization
- Pointer pages
- Menu management

---

### on-page-editing

Frontend inline and popup editing.

**Use for:**

- Inline text editing
- Popup editing for images
- Visual content management
- Frontend editing interface
- Edit toggle functionality

---

### admin-panel-theming

Admin panel customization and theming.

**Use for:**

- Custom admin interface
- Custom list screens
- Custom form screens
- Sidebar customization
- Admin branding
- Theme development

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
    - search
    - pagination
    - relationships
    - views
    - comments
    - users
    - folders
    - repeatable-regions
    - photo-gallery
    - rss-feeds
    - archives
    - nested-pages
    - on-page-editing
    - admin-panel-theming
```yaml

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
    - search
    - pagination
    - tailwindcss
    - alpinejs
    - typescript
    - git
```yaml

### For Content-Heavy Sites

```yaml
agents:
    - couchcms
    - search
    - pagination
    - relationships
    - views
    - comments
    - users
    - folders
    - repeatable-regions
    - photo-gallery
    - rss-feeds
    - archives
    - nested-pages
    - databound-forms
    - tailwindcss
```

### For Complete CouchCMS Toolkit

```yaml
agents:
    - couchcms
    - databound-forms
    - search
    - pagination
    - relationships
    - views
    - comments
    - users
    - folders
    - repeatable-regions
    - photo-gallery
    - rss-feeds
    - archives
    - nested-pages
    - on-page-editing
    - admin-panel-theming
    - tailwindcss
    - alpinejs
    - typescript
    - custom-routes
    - mysql
    - bun
    - git
```yaml

---

## How Agents Work

Agents provide:

1. **Quick Reference** - Common patterns and checklists
2. 📝 **Deep Dive** - Detailed examples and explanations
3. 📝 **Refactoring Patterns** - How to improve existing code
4. 📝 **Troubleshooting** - Common issues and solutions

AI assistants use these to provide context-aware suggestions.

---

## Adding Agents to Your Project

Edit `standards.md` (or `.project/standards.md`):

```yaml
agents:
    - couchcms
    - tailwindcss
    - alpinejs
```

Then sync:

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

---

## See Also

- [Available Modules](MODULES.md)
- [Getting Started](GETTING-STARTED.md)
