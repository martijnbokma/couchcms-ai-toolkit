# Quick Start: Creating Custom Modules and Agents

This guide helps you quickly create your own knowledge modules and AI agents for the CouchCMS AI Toolkit.

---

## TL;DR - Quick Commands

```bash
# Create a new knowledge module
bun run create:module

# Create a new AI agent  
bun run create:agent

# Sync configurations after creation
bun run sync

# Validate your new module/agent
bun run validate
```

---

## What You Can Create

### Knowledge Modules
- **Purpose**: Specialized knowledge about frameworks, libraries, or patterns
- **Files**: `{name}.md` + `{name}.skill-rules.json` (optional)
- **Examples**: CSS frameworks, JavaScript libraries, CouchCMS extensions

### AI Agents
- **Purpose**: Specialized assistants for specific development tasks
- **Files**: `{name}.md`
- **Examples**: API integration agent, testing agent, deployment agent

---

## Interactive Creation

### Create a Module

```bash
bun run create:module
```

The script will guide you through:
1. **Basic info**: ID, name, description, category
2. **Dependencies**: Required/conflicting modules
3. **Skill rules**: Auto-activation triggers (optional)
4. **Integration**: Automatic standards.md update

### Create an Agent

```bash
bun run create:agent
```

The script will guide you through:
1. **Basic info**: ID, name, description, type
2. **Expertise**: Technology focus and specialization
3. **Approach**: Key principles and methodologies
4. **Integration**: Automatic standards.md update

---

## Manual Creation (Advanced)

### 1. Copy Templates

```bash
# Copy module template
cp templates/module-template.md modules/your-module.md
cp templates/skill-rules-template.json modules/your-module.skill-rules.json

# Copy agent template
cp templates/agent-template.md agents/your-agent.md
```

### 2. Edit Content

Replace all placeholder content with your specific information:
- Module: Framework/library knowledge and patterns
- Agent: Specialized assistance and expertise

### 3. Update Configuration

Add to `standards.md`:

```yaml
modules:
  - your-module

agents:
  - your-agent
```

### 4. Generate Configs

```bash
bun run sync
```

---

## File Structure

### Module Files

```
modules/
├── your-module.md              # Knowledge content
├── your-module.skill-rules.json # Claude Code triggers (optional)
└── README.md                   # Module documentation
```

### Agent Files

```
agents/
├── your-agent.md               # Agent definition
└── README.md                   # Agent documentation
```

---

## Quick Examples

### Simple CSS Framework Module

```yaml
---
id: my-css-framework
name: "My CSS Framework"
category: "frontend"
version: "1.0"
description: "Custom CSS framework for our projects"
---

# My CSS Framework

## Installation
```html
<link rel="stylesheet" href="/css/my-framework.css">
```

## Components
```html
<div class="card">
  <h3 class="card-title">Title</h3>
  <p class="card-text">Content</p>
</div>
```
```

### Simple API Agent

```yaml
---
name: API Integration Agent
type: specialized
description: REST API integration patterns
tags: [api, rest, integration]
---

# API Integration Agent

You are an API integration expert for CouchCMS projects.

## Common Patterns

### Fetch Data
```javascript
async function fetchData(endpoint) {
    const response = await fetch(`/api/${endpoint}.php`);
    return response.json();
}
```
```

---

## Testing Your Creation

### 1. Validate Syntax

```bash
bun run validate --module your-module
bun run validate --agent your-agent
```

### 2. Test Auto-Activation

Create a test file with keywords from your skill rules:

```html
<!-- test-your-module.html -->
<!-- Keywords: your-framework, setup, integration -->
<div class="your-framework-component">
  Test content
</div>
```

### 3. Test Agent Response

In your AI chat, try:
```
@your-agent help me implement this feature
```

---

## Best Practices

### Module Content
- ✅ Include practical, working examples
- ✅ Show CouchCMS integration patterns
- ✅ Add troubleshooting section
- ✅ Use consistent formatting

### Agent Personality
- ✅ Be specific about expertise area
- ✅ Provide actionable advice
- ✅ Include refactoring guidance
- ✅ Show both basic and advanced patterns

### Skill Rules
- ✅ Use relevant keywords
- ✅ Include intent patterns
- ✅ Target appropriate file types
- ✅ Add helpful preflight checks

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Module not loading | Check YAML frontmatter syntax |
| Agent not responding | Verify agent is in standards.md |
| Skill rules not triggering | Check JSON syntax and keywords |
| Sync errors | Run `bun run validate` first |

---

## Next Steps

1. **Read the full guide**: [CUSTOM-MODULES-AGENTS.md](CUSTOM-MODULES-AGENTS.md)
2. **Study existing examples**: Check `modules/` and `agents/` directories
3. **Join the community**: Share your modules and agents
4. **Contribute back**: Submit useful modules via PR

---

*For detailed information, see the complete [Custom Modules and Agents Guide](CUSTOM-MODULES-AGENTS.md).*