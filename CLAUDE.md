# Claude Memory - couchcms-ai-toolkit

**Critical: Always refer to `standards.md` before generating, editing, or reviewing any code.**

---

## Project Overview

- **Name**: couchcms-ai-toolkit
- **Type**: CouchCMS Web Application
- **Description**: CouchCMS AI Toolkit - Development and maintenance configuration
- **Languages**: TypeScript, PHP, CSS, HTML
- **Frameworks**: CouchCMS, TailwindCSS, daisyUI, Alpine.js

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
2. **TailwindCSS**: TailwindCSS 4 patterns and best practices
3. **daisyUI**: daisyUI 5 components and theming
4. **Alpine.js**: Alpine.js patterns and CouchCMS integration
5. **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
6. **Custom Routes**: Custom URL routing and clean URL patterns
7. **Folders**: Content organization with virtual folders and nested pages
8. **Archives**: Archive views for time-based content organization
9. **Relationships**: Page relationships and related content patterns
10. **Repeatable Regions**: Repeatable content blocks and dynamic regions
11. **Search**: Search functionality with MySQL fulltext and relevance ranking
12. **Pagination**: Pagination controls for pages, search results, and comments
13. **Comments**: User comments with moderation and spam prevention
14. **Users**: User management, access control, and authentication
15. **TypeScript**: TypeScript standards and patterns

---

## Active Modules

### CouchCMS Core
Core CouchCMS patterns, templates, and security standards

### TailwindCSS
TailwindCSS 4 patterns and best practices

### daisyUI
daisyUI 5 components and theming

### Alpine.js
Alpine.js patterns and CouchCMS integration

### DataBound Forms
CouchCMS DataBound Forms implementation patterns

### Custom Routes
Custom URL routing and clean URL patterns

### Folders
Content organization with virtual folders and nested pages

### Archives
Archive views for time-based content organization

### Relationships
Page relationships and related content patterns

### Repeatable Regions
Repeatable content blocks and dynamic regions

### Search
Search functionality with MySQL fulltext and relevance ranking

### Pagination
Pagination controls for pages, search results, and comments

### Comments
User comments with moderation and spam prevention

### Users
User management, access control, and authentication

### TypeScript
TypeScript standards and patterns


---

## Available Agents

### @couchcms
**Type**: combined  
**Description**: Core CouchCMS templates, tags, and patterns

### @databound-forms
**Type**: combined  
**Description**: CouchCMS DataBound Forms for CRUD operations and complex form handling

### @custom-routes
**Type**: combined  
**Description**: CouchCMS custom routes for clean URLs and application routing

### @alpinejs
**Type**: combined  
**Description**: Lightweight reactive JavaScript for CouchCMS integration

### @tailwindcss
**Type**: combined  
**Description**: TailwindCSS 4 styling with daisyUI 5 components

### @typescript
**Type**: combined  
**Description**: Type-safe TypeScript for CouchCMS projects

### @views
**Type**: combined  
**Description**: CouchCMS views - List View, Page View, Folder View, and Archive View implementation

### @folders
**Type**: combined  
**Description**: CouchCMS virtual folders for content organization and SEO-friendly URL hierarchies

### @archives
**Type**: combined  
**Description**: CouchCMS archive views for organizing pages by time periods (yearly, monthly, daily)

### @relationships
**Type**: combined  
**Description**: CouchCMS page relationships - one-to-one, one-to-many, and many-to-many patterns

### @repeatable-regions
**Type**: combined  
**Description**: CouchCMS repeatable regions for dynamic content blocks, portfolios, and image galleries

### @search
**Type**: combined  
**Description**: CouchCMS fulltext search implementation with MySQL relevance ranking

### @pagination
**Type**: combined  
**Description**: CouchCMS pagination implementation for pages, search results, and comments

### @comments
**Type**: combined  
**Description**: CouchCMS comment system with forms, moderation, CAPTCHA, and comment listing

### @nested-pages
**Type**: combined  
**Description**: CouchCMS nested pages for hierarchical structures, dynamic menus, and site organization

### @photo-gallery
**Type**: combined  
**Description**: CouchCMS photo gallery with batch image upload, EXIF data, and automatic thumbnails

### @rss-feeds
**Type**: combined  
**Description**: CouchCMS RSS feed generation for content syndication and news distribution

### @on-page-editing
**Type**: combined  
**Description**: CouchCMS on-page editing with inline and popup editing for visual content management

### @users
**Type**: combined  
**Description**: CouchCMS user management, access control, and permission handling

### @bun
**Type**: combined  
**Description**: Bun runtime, package management, and build tooling

### @git
**Type**: combined  
**Description**: Git version control and workflow management

### @mysql
**Type**: combined  
**Description**: Database operations, optimization, and CouchCMS-specific queries

### @admin-panel-theming
**Type**: combined  
**Description**: CouchCMS admin panel customization and theming for personalized backend interface


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

## Frontend Standards

### Styling Approach
- Use daisyUI semantic colors (not Tailwind color names)
- Theme-aware: `bg-base-100`, `text-base-content`
- Never hardcode colors: avoid `bg-white`, `text-black`

### Alpine.js in CouchCMS
- Use full syntax: `x-on:click` not `@click`
- Use full syntax: `x-bind:class` not `:class`
- Shorthand breaks CouchCMS parsing

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

*Generated from `standards.md` on 2025-11-28T14:29:36.421Z*
