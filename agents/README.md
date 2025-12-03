# CouchCMS AI Agents

Combined AI agents with Quick Reference + Deep Dive structure.

## Agent Organization

Agents are organized into subdirectories to clearly distinguish between **core required technologies** and **optional enhancement technologies**:

### ⚡ Core Agents (`core/`) - Always Available

**CouchCMS agents are always included automatically** and are part of the core system:

- **Foundation**: `couchcms` - Core CouchCMS development
- **Content Management**: `folders`, `archives`, `relationships`, `repeatable-regions`, `nested-pages`
- **Navigation**: `search`, `pagination`, `custom-routes`, `views`
- **User Features**: `users`, `comments`
- **Forms**: `databound-forms`
- **Advanced**: `photo-gallery`, `rss-feeds`, `on-page-editing`

**These agents are automatically available** - you don't need to configure them in `standards.md`.

### 🎨 Optional Frontend Agents (`frontend/`) - Choose What You Need

**Frontend agents are optional** and can be added per project:

- **Styling**: `tailwindcss`, `admin-panel-theming`
- **Interactivity**: `alpinejs`, `typescript`

**Note**: CouchCMS works perfectly without these agents. Only add them if you use the corresponding technologies.

### 🛠️ Optional Dev Tool Agents (`dev-tools/`) - Development Tools

**Development tool agents are optional** and can be added per project:

- `bun` - Bun runtime and build tools
- `git` - Git version control
- `mysql` - Database operations

The agent loader automatically searches these subdirectories, so agent names remain the same.

## Available Agents

| Agent             | Description                                    |
| ----------------- | ---------------------------------------------- |
| `admin-panel-theming` | Admin panel customization and theming      |
| `alpinejs`        | Lightweight reactive JavaScript for CouchCMS   |
| `archives`        | Archive views by time periods (yearly/monthly/daily) |
| `bun`             | Bun runtime, package management, build tooling |
| `comments`        | Comment system with moderation and CAPTCHA     |
| `couchcms`        | Core CouchCMS templates, tags, patterns        |
| `custom-routes`   | Clean URLs and application routing             |
| `databound-forms` | CRUD operations and form handling              |
| `folders`         | Virtual folders for content organization       |
| `git`             | Version control and workflow management        |
| `mysql`           | Database operations and optimization           |
| `nested-pages`    | Hierarchical page structures and dynamic menus |
| `on-page-editing` | Frontend inline and popup editing              |
| `pagination`      | Pagination for pages, search, and comments     |
| `photo-gallery`   | Photo gallery with batch upload and EXIF data  |
| `relationships`   | Page relationships (one-to-many, many-to-many) |
| `repeatable-regions` | Dynamic repeatable content blocks          |
| `rss-feeds`       | RSS feed generation for content syndication    |
| `search`          | Fulltext search with MySQL relevance ranking  |
| `tailwindcss`     | TailwindCSS 4 + daisyUI 5 styling              |
| `typescript`      | Type-safe frontend code                        |
| `users`           | User management and access control              |
| `views`           | Template views (List, Page, Folder, Archive)   |

## Agent Structure

Each agent follows a layered structure:

```markdown
---
name: Agent Name
version: "2.0"
type: combined
description: Brief description
tags: [tag1, tag2]
---

# Agent Name

## Quick Reference

<!-- Quick patterns for daily use (~100 lines) -->

## Common Patterns

<!-- Frequently used code examples -->

## Deep Dive

<!-- Advanced patterns, architecture (~200+ lines) -->

## Troubleshooting

<!-- Common problems and solutions -->
```

## Usage in project.md

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
```

## Adding New Agents

Choose the appropriate subdirectory based on agent type:

1. Create agent file in the correct subdirectory:
   ```bash
   # CouchCMS agent (core/)
   touch agents/core/new-agent.md

   # Frontend agent (frontend/)
   touch agents/frontend/new-agent.md

   # Dev tool agent (dev-tools/)
   touch agents/dev-tools/new-agent.md

   # Admin panel theming (frontend/)
   touch agents/frontend/admin-panel-theming.md
   ```

2. Follow the structure above
3. Use `{{paths.xxx}}` for path variables
4. Run `bun run ai:sync` to test


