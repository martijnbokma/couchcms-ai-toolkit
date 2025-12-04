---
# === PROJECT CONFIGURATION ===
project:
    name: 'my-project'
    type: 'couchcms-webapp'
    description: 'A Test CouchCMS web application test'

# === TOOLKIT LOCATION ===
toolkit: './ai-toolkit-shared'

# === LANGUAGES ===
languages:
    - php
    - typescript
    - css
    - html

# === FRAMEWORKS ===
frameworks:
    - couchcms
    - tailwindcss_v4
    - alpinejs

# === EDITORS / TOOLS ===
# Configure which editors/tools to generate config files for
editors:
    cursor: true
    windsurf: false
    zed: false
    copilot: false
    claude: false
    codewhisperer: false
    kiro: false
    antigravity: false
    jules: false
    roocode: false
    vscode-ai: false
    tabnine: false
    agent: false
# === AI AGENTS ===
# Configure which AI agents are available
agents:
    cursor: true
    copilot: true
    claude: true
    vscode: true
    windsurf: true
    tabnine: true
    amazon_codewhisperer: true

# === ACTIVE AGENTS ===
active_agents:
    - couchcms
    - databound-forms
    - custom-routes
    - views
    - folders
    - archives
    - relationships
    - repeatable-regions
    - search
    - pagination
    - comments
    - nested-pages
    - photo-gallery
    - rss-feeds
    - on-page-editing
    - users
    - couchcms
    - tailwindcss
    - search

# === MODULES ===
# Select which modules to activate for this project.
# couchcms-core is always included automatically.
modules:
    - couchcms-core
    - databound-forms
    - custom-routes
    - folders
    - archives
    - relationships
    - repeatable-regions
    - search
    - pagination
    - comments
    - users
    - couchcms-core
    - search
    - pagination
    - tailwindcss
    - alpinejs
# === FRAMEWORK (OPTIONAL) ===
# Enable AAPF framework for disciplined AI agent behavior
# Options:
#   - framework: true                    # Full framework (doctrine + directives + playbooks + enhancements)
#   - framework: { doctrine: true, directives: true, playbooks: true }  # Custom selection
#   - framework: false                   # Disabled (default)
framework:


# === CODING STANDARDS ===
standards:
    indentation: 4
    line_length: 120
    language: 'english'

# === NAMING CONVENTIONS ===
naming:
    php_variables: 'snake_case'
    php_files: 'kebab-case'
    typescript_variables: 'camelCase'
    typescript_files: 'kebab-case'
    html_files: 'kebab-case'
    css_files: 'kebab-case'
    css_classes: 'kebab-case'
    classes: 'PascalCase'
    directories: 'kebab-case'
    couchcms_parameters: 'snake_case'
    database_fields: 'snake_case'

# === PROJECT PATHS ===
paths:
    css: 'assets/css'
    typescript: 'assets/ts'
    javascript: 'assets/js'
    components: 'snippets/components'
    views: 'snippets/views'
    layouts: 'snippets/layouts'
    filters: 'snippets/filters'
    forms: 'snippets/forms'
    public: 'public'

# === PROJECT RULES ===
project_rules:
    language: 'english'
    authentication: 'extended_users'
    styling: 'tailwindcss_daisyui'
    interactions: 'alpinejs_typescript'
    dry_principle: true
    accessibility: 'wcag_2_1_aa'
---

# Universal AI Coding Standards

This document serves as the **single source of truth** for all coding standards, patterns, and AI agent instructions across this project.

## Core Principles

### 1. Code Quality Standards

- **Clean Code**: Write maintainable, bug-free, well-documented code
- **Indentation**: Always use {{standards.indentation}} spaces for indentation in all code (HTML, CSS, JS, TS, PHP, CouchCMS)
- **DRY Principle**: Abstract repeated logic into reusable snippets/utilities
- **Modularity**: Separate concerns - CouchCMS for content, TypeScript for complex logic
- **Accessibility**: {{project_rules.accessibility}} compliance, semantic HTML5, proper ARIA attributes
- **Ship over perfection**: Prioritize working solutions over perfect abstractions

### 2. Language Requirements

- **Communication Language**: The user prefers to communicate in their native language
- **Code Language**: All code, comments, variable names, and documentation MUST be in {{standards.language}}
- **Website Content Language**: All user-facing content on the website MUST be in {{standards.language}}
- **No Exceptions**: {{standards.language}} is mandatory for all technical content AND all website content

### 3. Design System Standards

- **Single Source of Truth**: The design system is the single source of truth for all visual styling and UI components
- **Consistency**: Ensures design and implementation consistency across all products and platforms
- **Reference First**: Always reference the design system before creating new visual elements or UI components
- **Component Reuse**: Check existing design system components before creating new ones
- **Visual Standards**: All visual styling must follow the established design system patterns

### 4. CouchCMS Security Standards

- **🚨 CRITICAL: HTML Comment Security**:
    - Use `[cms:` instead of `<cms:` in HTML comments to prevent site crashes
    - Wrap multiline comments with CouchCMS tags in `<cms:ignore>` blocks
    - NEVER put `<cms:` in HTML comments - CouchCMS executes ALL template tags, even in comments
- **Template Safety**: Always validate user input and sanitize outputs
- **Authentication**: Use `snippets/filters/authenticated.html` for authentication checks
- **Ownership Validation**: Use `snippets/filters/owns_{content}.html` for ownership validation
- **CSRF Protection**: Implement CSRF protection for all forms

### 5. Core vs Optional Technologies

**Critical Distinction**: This project distinguishes between **core required technologies** and **optional enhancement technologies**.

- **Core System (CouchCMS)**: Always required, automatically included, cannot be removed
  - All CouchCMS functionality is part of the core system
  - CouchCMS modules and agents are always available
  - This is the foundation that everything builds upon

- **Optional Technologies**: Can be added or removed based on project needs
  - Frontend frameworks (TailwindCSS, Alpine.js, TypeScript, daisyUI)
  - Development tools (Bun, etc.)
  - These enhance functionality but are not required for CouchCMS to work

**When in doubt**: Use CouchCMS patterns first. Only add optional technologies when they provide clear value.

## Technology Stack

### Core System (Always Required)

**CouchCMS** is the core content management system and is always required for this project.

- **CouchCMS**: Content management, templates, data persistence, authentication, and all CMS functionality
  - All CouchCMS modules are automatically included (forms, users, search, comments, pagination, etc.)
  - All CouchCMS agents are automatically available
  - This is the foundation - everything else builds on top

### Optional Frontend Technologies

These technologies enhance the frontend experience but are **optional** and can be added or removed based on project needs:

- **TailwindCSS v4**: Utility-first CSS framework for styling
- **daisyUI**: Component library built on TailwindCSS (requires TailwindCSS)
- **Alpine.js**: Lightweight JavaScript framework for UI interactions
- **TypeScript**: Type-safe JavaScript for complex logic and validation

**Note**: Projects can use CouchCMS without any of these frontend technologies, or mix and match as needed.

### Optional Development Tools

- **Bun**: Package manager and build tool for asset processing (optional, can use npm/yarn instead)
- **Design System**: Single source of truth for visual styling and UI components (if applicable)

### Technology Priority Order

When implementing features, follow this priority:

1. **CouchCMS first**: Use CouchCMS patterns and features for content management
2. **Design System**: Reference design system for visual consistency (if available)
3. **Frontend frameworks**: Use TailwindCSS/daisyUI for styling, Alpine.js for interactions
4. **TypeScript**: Use for complex logic that goes beyond Alpine.js capabilities
5. **Build tools**: Use Bun or other tools for asset processing

## Naming Conventions

### File Naming

All files in the project MUST follow these naming conventions:

- **HTML Templates**: `{{naming.html_files}}` (e.g., `user-profile.html`)
- **CSS Files**: `{{naming.css_files}}` (e.g., `user-profile.css`)
- **TypeScript Files**: `{{naming.typescript_files}}` (e.g., `user-profile.ts`)
- **PHP Files**: `{{naming.php_files}}` (e.g., `user-profile.php`)
- **Directories**: `{{naming.directories}}` (e.g., `user-profiles`)

### Code Naming

- **CSS Classes**: `{{naming.css_classes}}` (e.g., `.user-profile-card`)
- **TypeScript Variables**: `{{naming.typescript_variables}}` (e.g., `userProfile`)
- **TypeScript Interfaces/Types**: `{{naming.classes}}` (e.g., `UserProfile`)
- **PHP Variables**: `{{naming.php_variables}}` (e.g., `$user_profile`)
- **CouchCMS Parameters**: `{{naming.couchcms_parameters}}` (e.g., `content_owner`)
- **Database Fields**: `{{naming.database_fields}}` (e.g., `created_at`)

## Project Paths

These are the configured paths for this project:

| Type       | Path                   |
| ---------- | ---------------------- |
| CSS        | `{{paths.css}}`        |
| TypeScript | `{{paths.typescript}}` |
| JavaScript | `{{paths.javascript}}` |
| Components | `{{paths.components}}` |
| Views      | `{{paths.views}}`      |
| Layouts    | `{{paths.layouts}}`    |
| Filters    | `{{paths.filters}}`    |
| Forms      | `{{paths.forms}}`      |
| Public     | `{{paths.public}}`     |

**Always use these paths when creating or referencing files.**

## AI Agent Instructions

### Universal Rules for All AI Agents

1. **Always Reference Standards**: Before generating any code, reference this standards.md file
2. **Core First**: Always use CouchCMS patterns first - it's the core system and always available
3. **Optional Technologies**: Only use optional technologies (TailwindCSS, Alpine.js, TypeScript) when explicitly enabled in project modules
4. **Follow Project Hierarchy**: Respect the technology stack priority order defined above
5. **Maintain Consistency**: Use established patterns and naming conventions
6. **Validate Against Modules**: Check relevant technology modules for specific patterns
7. **{{standards.language}} Only**: Never use other languages in code, comments, or website content
8. **Document Changes**: Explain significant architectural decisions
9. **Test Thoroughly**: Ensure code works in the project context

### Technology Selection Guidelines

- **CouchCMS**: Always available - use for all content management, templates, data operations
- **TailwindCSS/daisyUI**: Only use if `tailwindcss` or `daisyui` modules are enabled
- **Alpine.js**: Only use if `alpinejs` module is enabled
- **TypeScript**: Only use if `typescript` module is enabled
- **Check modules list**: Verify which optional technologies are enabled before using them

## Quality Checklist

Before generating code:

- [ ] All code, comments, and website content in {{standards.language}}
- [ ] {{standards.indentation}}-space indentation used consistently
- [ ] Proper naming conventions followed
- [ ] Authentication patterns implemented
- [ ] Accessibility requirements met
- [ ] DRY principle applied
- [ ] Error handling implemented
- [ ] **🚨 CRITICAL: No `<cms:` tags in HTML comments** - Use `[cms:` instead

## Project-Specific Rules

Add your project-specific instructions, conventions, or requirements here.

### Example Sections

#### Client Requirements

- Specific design requirements
- Brand guidelines
- Content restrictions

#### Technical Decisions

- Technology choices specific to this project
- Patterns or libraries unique to this project
- Known limitations or workarounds

#### Team Conventions

- Code review process
- Naming conventions beyond the defaults
- Documentation requirements

---

**Remember**: This file is the single source of truth. All AI agents, prompts, and validators reference this file automatically.
