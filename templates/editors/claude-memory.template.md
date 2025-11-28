# Claude Memory - {{project.name}}

**Critical: Always refer to `{{config_file_path}}` before generating, editing, or reviewing any code.**

---

## Project Overview

- **Name**: {{project.name}}
- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## Core Standards

### Language Requirements
- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **Zero Tolerance**: Never use non-English language in any context

### Code Quality
- **Indentation**: {{standards.indentation}} spaces
- **Line Length**: {{standards.line_length}} characters maximum
- **Naming Conventions**: Follow language-specific conventions from `{{config_file_path}}`

---

## Architectural Decisions and Guidelines

### Project Architecture
- **Configuration Source**: All project standards are defined in `{{config_file_path}}`
- **Module System**: Knowledge modules provide framework-specific patterns and best practices
- **Agent System**: Specialized agents handle specific development tasks
- **Template-Based**: CouchCMS templates use inheritance and blocks for reusability

### Development Guidelines
- **Standards First**: Always consult `{{config_file_path}}` before making changes
- **Module Awareness**: Leverage active modules for framework-specific knowledge
- **Agent Utilization**: Use specialized agents (e.g., @{{#if agents}}{{agents.[0].slug}}{{else}}agent{{/if}}) for domain-specific tasks
- **Consistency**: Follow established patterns in existing codebase

### Code Organization
{{#if paths.templates}}
- **Templates**: {{paths.templates}}
{{/if}}
{{#if paths.snippets}}
- **Snippets**: {{paths.snippets}}
{{/if}}
{{#if paths.assets}}
- **Assets**: {{paths.assets}}
{{/if}}
- **Configuration**: Project root (`{{config_file_path}}`)

---

## Technology Stack

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

---

## Active Modules

{{#each modules}}
### {{name}}
{{description}}

{{/each}}

---

## Available Agents

{{#each agents}}
### @{{slug}}
**Type**: {{type}}  
**Description**: {{description}}

{{/each}}

---

{{#if has_cms}}
## CouchCMS Critical Rules

### Security Rules (MANDATORY)
- ❌ **NEVER** use `<cms:` in HTML comments (will execute and crash)
- ✅ Use `[cms:` syntax in comments instead
- ❌ **NEVER** use `<cms:else></cms:else>` (will fail)
- ✅ Use `<cms:else />` (self-closing)

### Template Structure
```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1' routable='1'>
        <cms:editable name='field_name' label='Field Label' type='text' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <!-- Content here -->
</cms:block>
<?php COUCH::invoke(); ?>
```

{{/if}}
{{#if has_frontend}}
## Frontend Standards

### Styling Approach
- Use daisyUI semantic colors (not Tailwind color names)
- Theme-aware: `bg-base-100`, `text-base-content`
- Never hardcode colors: avoid `bg-white`, `text-black`

### Alpine.js in CouchCMS
- Use full syntax: `x-on:click` not `@click`
- Use full syntax: `x-bind:class` not `:class`
- Shorthand breaks CouchCMS parsing

{{/if}}
---

## Operational Workflow

**Reconnaissance → Plan → Execute → Verify → Report**

1. **Read Before Write**: Always examine existing code before modifications
2. **Reread After Write**: Verify changes were applied correctly
3. **Autonomous Correction**: Fix issues without asking when solution is clear

---

## Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement

---

*Generated from `{{config_file_path}}` on {{timestamp}}*
