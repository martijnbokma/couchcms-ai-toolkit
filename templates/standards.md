---
# === PROJECT CONFIGURATION ===
project:
    name: 'my-project'
    type: 'couchcms-webapp'
    description: 'Brief description of your project'

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

# === MODULES ===
# Select which modules to activate for this project.
# couchcms-core is always included automatically.
modules:
    - couchcms-core
    - tailwindcss
    - daisyui
    - alpinejs
    - typescript
    - databound-forms

# === FRAMEWORK (OPTIONAL) ===
# Enable AAPF framework for disciplined AI agent behavior
# Options:
#   - framework: true                    # Full framework (doctrine + directives + playbooks + enhancements)
#   - framework: { doctrine: true, directives: true, playbooks: true }  # Custom selection
#   - framework: false                   # Disabled (default)
# framework: true

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
    typescript_files: 'kebab-case.ts'
    html_files: 'kebab-case.html'
    css_files: 'kebab-case.css'
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

## Technology Hierarchy

1. **CouchCMS**: Content management, templates, data persistence
2. **Design System**: Single source of truth for visual styling and UI components
3. **TailwindCSS v4 + daisyUI**: Styling foundation with content-aware colors
4. **Alpine.js**: Lightweight UI interactions (toggles, modals, forms)
5. **TypeScript**: Complex logic, validation, API integration
6. **Bun**: Package manager and build tool for asset processing

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
2. **Follow Project Hierarchy**: Respect the technology stack order defined above
3. **Maintain Consistency**: Use established patterns and naming conventions
4. **Validate Against Modules**: Check relevant technology modules for specific patterns
5. **{{standards.language}} Only**: Never use other languages in code, comments, or website content
6. **Document Changes**: Explain significant architectural decisions
7. **Test Thoroughly**: Ensure code works in the project context

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
