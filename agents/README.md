# CouchCMS AI Agents

Combined AI agents with Quick Reference + Deep Dive structure.

## Available Agents

| Agent             | Description                                    |
| ----------------- | ---------------------------------------------- |
| `alpinejs`        | Lightweight reactive JavaScript for CouchCMS   |
| `bun`             | Bun runtime, package management, build tooling |
| `couchcms`        | Core CouchCMS templates, tags, patterns        |
| `custom-routes`   | Clean URLs and application routing             |
| `databound-forms` | CRUD operations and form handling              |
| `git`             | Version control and workflow management        |
| `mysql`           | Database operations and optimization           |
| `tailwindcss`     | TailwindCSS 4 + daisyUI 5 styling              |
| `typescript`      | Type-safe frontend code                        |

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
  - tailwindcss
  - alpinejs
  - typescript
```

## Adding New Agents

1. Create `agents/[name].md`
2. Follow the structure above
3. Use `{{paths.xxx}}` for path variables
4. Run `bun run ai:sync` to test
