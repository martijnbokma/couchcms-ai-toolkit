# Available AI Agents - {{project.name}}

This document lists all AI agents configured for this project. Agents provide specialized knowledge and capabilities for specific development tasks.

---

## Table of Contents

- [Quick Reference](#quick-reference)
- [Agent Details](#agent-details)
{{#each agents}}
  - [@{{slug}}](#{{slug}})
{{/each}}
- [How to Use Agents](#how-to-use-agents)
- [Active Modules](#active-modules)

---

## Quick Reference

| Agent | Type | Description |
|-------|------|-------------|
{{#each agents}}
| `@{{slug}}` | {{type}} | {{description}} |
{{/each}}

---

## Agent Details

{{#each agents}}
## @{{slug}}

**Type**: {{type}}  
**Description**: {{description}}

### Capabilities
This agent provides specialized assistance for:
- Implementation guidance and best practices
- Code review and optimization suggestions
- Troubleshooting and debugging support
- Architecture and design recommendations

### Usage
```
@{{slug}} [your request here]
```

### Examples
- `@{{slug}} help with implementation`
- `@{{slug}} review this code`
- `@{{slug}} explain best practices`
- `@{{slug}} suggest improvements for this component`

{{#if meta.tags}}
**Tags**: {{join meta.tags ", "}}
{{/if}}

{{#if meta.category}}
**Category**: {{meta.category}}
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

## Agent-Specific Features

### Quick Tips

- **Context Matters**: Agents work best when you provide clear context about what you're trying to achieve
- **Combine Agents**: You can mention multiple agents in one request for cross-domain expertise
- **Be Specific**: The more specific your request, the better the agent can assist you
- **Iterate**: Don't hesitate to ask follow-up questions or request clarifications

### Best Practices

1. **Start with the right agent**: Choose the agent that best matches your task domain
2. **Provide context**: Share relevant code, error messages, or requirements
3. **Ask for explanations**: Request explanations of suggestions to learn as you go
4. **Review suggestions**: Always review and test agent suggestions before applying them

---

*Generated from `{{config_file_path}}` on {{timestamp}}*
