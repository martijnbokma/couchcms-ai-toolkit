# Claude Memory - small-test-project

**Critical: Always refer to `standards.md` before generating, editing, or reviewing any code.**

---

## Project Overview

- **Name**: small-test-project
- **Type**: CouchCMS Web Application
- **Description**: Small test project for validation
- **Languages**: PHP, HTML
- **Frameworks**: CouchCMS

---

## Core Standards

### Language Requirements
- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **Zero Tolerance**: Never use non-English language in any context

### Code Quality
- **Indentation**: 4 spaces
- **Line Length**: 120 characters maximum
- **Naming Conventions**: Follow language-specific conventions from `standards.md`

---

## Architectural Decisions and Guidelines

### Project Architecture
- **Configuration Source**: All project standards are defined in `standards.md`
- **Module System**: Knowledge modules provide framework-specific patterns and best practices
- **Agent System**: Specialized agents handle specific development tasks
- **Template-Based**: CouchCMS templates use inheritance and blocks for reusability

### Development Guidelines
- **Standards First**: Always consult `standards.md` before making changes
- **Module Awareness**: Leverage active modules for framework-specific knowledge
- **Agent Utilization**: Use specialized agents (e.g., @couchcms) for domain-specific tasks
- **Consistency**: Follow established patterns in existing codebase

### Code Organization
- **Configuration**: Project root (`standards.md`)

---

## Technology Stack

1. **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards

---

## Active Modules

### CouchCMS Core
Core CouchCMS patterns, templates, and security standards


---

## Available Agents

### @couchcms
**Type**: combined  
**Description**: Core CouchCMS templates, tags, and patterns


---

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

*Generated from `standards.md` on 2025-11-28T12:53:58.191Z*
