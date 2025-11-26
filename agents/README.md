# CouchCMS AI Agents

Combined AI agents with Quick Reference + Deep Dive structure.

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

1. Create `agents/[name].md`
2. Follow the structure above
3. Use `{{paths.xxx}}` for path variables
4. Run `bun run ai:sync` to test


