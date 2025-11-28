---
name: {{agent.name}}
description: {{agent.description}}
allowed-tools: {{join agent.allowedTools ", "}}
type: agent
agent-type: {{agent.type}}
{{#if agent.tags}}
tags: {{join agent.tags ", "}}
{{/if}}
---

{{agent.content}}
