---
name: {{module.name}}
description: {{module.description}}
allowed-tools: {{join module.allowedTools ", "}}
type: module
category: {{module.category}}
version: {{module.version}}
{{#if module.tags}}
tags: {{join module.tags ", "}}
{{/if}}
---

{{module.content}}
