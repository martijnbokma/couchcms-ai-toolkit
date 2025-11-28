# Available AI Agents - {{project.name}}

This document lists all AI agents configured for this project. Agents provide specialized knowledge and capabilities for specific development tasks.

---

## Quick Reference

| Agent | Type | Description |
|-------|------|-------------|
{{#each agents}}
| `@{{slug}}` | {{type}} | {{description}} |
{{/each}}

---

{{#each agents}}
## @{{slug}}

**Type**: {{type}}  
**Description**: {{description}}

### Usage
```
@{{slug}} [your request here]
```

### Examples
- `@{{slug}} help with implementation`
- `@{{slug}} review this code`
- `@{{slug}} explain best practices`

{{#if meta.tags}}
**Tags**: {{join meta.tags ", "}}
{{/if}}

---

{{/each}}

## How to Use Agents

### In Chat
Simply mention the agent with `@` prefix:
```
@couchcms help me create a new template
```

### Multiple Agents
You can invoke multiple agents in one request:
```
@couchcms @tailwindcss create a styled card component
```

### Agent Types

- **daily**: General-purpose agents for everyday development tasks
- **specialized**: Domain-specific agents for particular features or frameworks
- **framework**: Framework-specific agents (CouchCMS, TailwindCSS, Alpine.js, etc.)

---

## Active Modules

The following knowledge modules are available to all agents:

{{#each modules}}
- **{{name}}**: {{description}}
{{/each}}

---

*Generated from `{{config_file_path}}` on {{timestamp}}*
