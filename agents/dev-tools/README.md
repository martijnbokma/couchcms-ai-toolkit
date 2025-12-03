# Development Tool Agents - Optional

These agents are **optional** and provide specialized assistance for development tools.

## What are Dev Tool Agents?

Dev tool agents are **optional** and provide specialized knowledge for development tools and utilities. They are only available if you use the corresponding tools in your project.

## Available Dev Tool Agents

- **`bun`** - Bun runtime, package management, and build tooling
- **`git`** - Git version control and workflow management
- **`mysql`** - Database operations, optimization, and CouchCMS-specific queries

## Usage

Add agents to `standards.md`:

```yaml
agents:
    - bun     # Optional - only if you use Bun
    - git     # Optional - only if you use Git workflows
    - mysql   # Optional - only if you need database optimization help
```

## Important Notes

1. **These are development tools** - They help with development workflow, not runtime functionality
2. **Optional** - Your project works fine without these agents
3. **Useful for complex projects** - Especially helpful for larger projects with complex workflows

## When to Use

- **`bun`**: When you use Bun as your package manager or runtime
- **`git`**: When you need help with Git workflows and version control
- **`mysql`**: When you need help with database optimization or complex queries

## Key Principle

**These are optional development aids** - They help with development workflow but are not required for your project to function. Add them if they help your development process.
