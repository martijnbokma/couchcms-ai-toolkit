# Configuration Schema Documentation

This document provides comprehensive documentation for the `config.yaml` configuration file format introduced in CouchCMS AI Toolkit v2.0.

## Overview

The `config.yaml` file consolidates settings from three previous configuration files:
- `defaults.yaml` - Default project settings
- `smart-defaults.yaml` - Smart context loading and suggestions
- `preflight-checks.yaml` - Validation rules

This consolidation reduces complexity while maintaining all essential functionality.

## File Location

- **Toolkit defaults**: `{toolkit-root}/config.yaml`
- **Project overrides**: `{project-root}/standards.md` (YAML frontmatter) or `{project-root}/config.yaml`

## Configuration Hierarchy

1. Toolkit `config.yaml` provides defaults
2. Project `standards.md` or `config.yaml` overrides defaults
3. Deep merge strategy: nested objects are merged, arrays are replaced

## Schema Reference

### Project Settings

```yaml
project:
  name: string              # Project identifier (kebab-case recommended)
  description: string       # Human-readable description
  type: string             # Project type (e.g., "CouchCMS Web Application")
```

**Example:**
```yaml
project:
  name: "my-ecommerce-site"
  description: "E-commerce platform built with CouchCMS"
  type: "CouchCMS Web Application"
```

### Toolkit Location

```yaml
toolkit:
  path: string             # Relative path to toolkit directory
```

**Examples:**
```yaml
# Toolkit as git submodule
toolkit:
  path: "./ai-toolkit-shared"

# Toolkit in parent directory
toolkit:
  path: "../couchcms-ai-toolkit"

# Self-referential (toolkit development)
toolkit:
  path: "."
```

### Editor Support

```yaml
editors: array<string>     # List of AI editors to generate configs for
```

**Supported Editors:**
- `cursor` - Cursor IDE (`.cursorrules`)
- `claude` - Claude Code (`.claude/`)
- `windsurf` - Windsurf (`.windsurf/rules.md`)
- `kiro` - Kiro (`.kiro/steering/`)
- `copilot` - GitHub Copilot (`.github/copilot-instructions.md`)

**Example:**
```yaml
editors:
  - cursor
  - claude
  - kiro
```

### Modules

```yaml
modules: array<string>     # Knowledge modules to load
```

**Available Modules:**

| Category | Modules |
|----------|---------|
| Core | `couchcms-core` |
| Frontend | `tailwindcss`, `daisyui`, `alpinejs`, `typescript` |
| Backend | `databound-forms`, `custom-routes` |
| Content | `folders`, `archives`, `relationships`, `repeatable-regions`, `search`, `pagination`, `comments` |
| User | `users` |

**Example:**
```yaml
modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
  - databound-forms
```

### Agents

```yaml
agents: array<string>      # Specialized AI agents to activate
```

**Available Agents:**

| Category | Agents |
|----------|--------|
| Core | `couchcms`, `databound-forms`, `custom-routes` |
| Frontend | `alpinejs`, `tailwindcss`, `typescript` |
| Content | `views`, `folders`, `archives`, `relationships`, `repeatable-regions`, `search`, `pagination`, `comments` |
| User | `users` |
| Development | `bun`, `git`, `mysql` |

**Example:**
```yaml
agents:
  - couchcms
  - databound-forms
  - alpinejs
  - tailwindcss
```

### Framework (AAPF)

```yaml
framework: boolean | object  # Autonomous Agent Prompting Framework
```

**Options:**

1. **Disabled** (default):
```yaml
framework: false
```

2. **Full framework**:
```yaml
framework: true
```

3. **Custom selection**:
```yaml
framework:
  doctrine: true        # Core operational principles
  directives: true      # Specific instructions
  playbooks: true       # Step-by-step procedures
  enhancements: false   # Additional capabilities
```

### Project Paths

```yaml
paths: object<string, string>  # Directory paths for project organization
```

**Schema:**
- Keys: Path identifiers (used in templates as `{{paths.key}}`)
- Values: Relative paths from project root (no leading `/`)

**Default Paths:**
```yaml
paths:
  # Frontend assets
  css: "assets/css"
  typescript: "assets/ts"
  javascript: "assets/js"
  images: "assets/images"
  fonts: "assets/fonts"

  # CouchCMS templates
  snippets: "snippets"
  components: "snippets/components"
  views: "snippets/views"
  layouts: "snippets/layouts"
  filters: "snippets/filters"
  forms: "snippets/forms"
  helpers: "snippets/helpers"

  # Build output
  public: "public"
  dist: "dist"

  # Configuration
  config: "config"
  scripts: "scripts"
```

**Custom Example:**
```yaml
paths:
  css: "public/styles"
  components: "templates/components"
  views: "templates/views"
```

### Coding Standards

```yaml
standards:
  indentation: integer    # Spaces per indentation level (1-8)
  language: string        # Must be "english"
  lineLength: integer     # Maximum line length (80-200)
```

**Example:**
```yaml
standards:
  indentation: 4
  language: "english"
  lineLength: 120
```

### Naming Conventions

```yaml
naming: object<string, string>  # Naming styles for code elements
```

**Valid Values:** `snake_case`, `camelCase`, `PascalCase`, `kebab-case`

**Default Conventions:**
```yaml
naming:
  # PHP/CouchCMS
  php_variables: "snake_case"      # $my_variable
  php_functions: "snake_case"      # my_function()
  cms_fields: "snake_case"         # my_field

  # TypeScript/JavaScript
  ts_variables: "camelCase"        # myVariable
  ts_functions: "camelCase"        # myFunction()
  ts_classes: "PascalCase"         # MyClass
  ts_interfaces: "PascalCase"      # MyInterface
  ts_types: "PascalCase"           # MyType

  # CSS
  css_classes: "kebab-case"        # .my-class
  css_variables: "kebab-case"      # --my-variable

  # Files
  php_files: "kebab-case"          # my-file.php
  ts_files: "kebab-case"           # my-file.ts
  css_files: "kebab-case"          # my-file.css
  component_files: "kebab-case"    # my-component.html
```

### Git Workflow (Gitflow)

```yaml
gitflow:
  branches: object        # Branch name configuration
  patterns: object        # Branch naming patterns
  stale_days: integer     # Days before branch is stale
  auto_delete: boolean    # Auto-delete merged branches
  require_pr: boolean     # Require pull requests
```

**Example:**
```yaml
gitflow:
  branches:
    main: "main"
    develop: "develop"
  patterns:
    feature: "feature/"
    release: "release/"
    hotfix: "hotfix/"
  stale_days: 30
  auto_delete: true
  require_pr: true
```

### File Contexts

```yaml
file_contexts: object<string, object>  # Auto-load context by file pattern
```

**Schema per entry:**
```yaml
"glob-pattern":
  agents: array<string>    # Agents to activate
  modules: array<string>   # Modules to load
```

**Example:**
```yaml
file_contexts:
  "*.php":
    agents: [couchcms]
    modules: [couchcms-core]

  "snippets/components/*.html":
    agents: [couchcms, alpinejs]
    modules: [couchcms-core, alpinejs]

  "*.ts":
    agents: [typescript]
    modules: [typescript]
```

### Template Aliases

```yaml
template_aliases: object<string, string>  # Short names for template paths
```

**Schema:**
- Keys: Alias names
- Values: Template paths (relative to toolkit root)

**Example:**
```yaml
template_aliases:
  component-basic: "templates/components/basic.html"
  component-alpine: "templates/components/alpine.html"
  view-list: "templates/views/list.html"
  form-basic: "templates/forms/basic.html"
```

### Validation Rules

```yaml
validation:
  required_modules: array<string>  # Modules that must be loaded
  max_line_length: integer         # Maximum line length
  enforce_english: boolean         # Enforce English-only code
  checks: object                   # Validation check configurations
  execution: object                # Execution configuration
```

**Validation Checks Schema:**
```yaml
validation:
  checks:
    category_name:
      check_name:
        pattern: string      # Regex pattern to match
        severity: string     # CRITICAL, ERROR, WARNING, INFO
        message: string      # Human-readable error message
        fix: string          # Suggested fix
```

**Severity Levels:**
- `CRITICAL` - Blocks code generation, must be fixed
- `ERROR` - Blocks code generation, must be fixed
- `WARNING` - Shows warning but allows continuation
- `INFO` - Informs only, no blocking

**Example:**
```yaml
validation:
  required_modules: [couchcms-core]
  max_line_length: 200
  enforce_english: true

  checks:
    couchcms:
      html_comment_security:
        pattern: "<!--[\\s\\S]*?<cms:[\\s\\S]*?-->"
        severity: CRITICAL
        message: "CouchCMS tags inside HTML comments are EXECUTED!"
        fix: "Replace <cms: with [cms: inside HTML comments"

    security:
      xss_innerhtml:
        pattern: "\\.innerHTML\\s*=(?!.*sanitize|.*escape)"
        severity: CRITICAL
        message: "Potential XSS vulnerability"
        fix: "Use textContent or sanitize HTML content"

  execution:
    block_on: [CRITICAL, ERROR]
    warn_on: [WARNING]
    inform_on: [INFO]
    global_ignore:
      - "node_modules/**"
      - "dist/**"
```

## Migration from Old Format

### Old Format (standards.md)

```markdown
---
name: "my-project"
modules:
  - couchcms-core
  - tailwindcss
agents:
  - couchcms
---

# Project Rules
...
```

### New Format (config.yaml)

```yaml
project:
  name: "my-project"
  description: "My project"
  type: "CouchCMS Web Application"

modules:
  - couchcms-core
  - tailwindcss

agents:
  - couchcms

# ... additional settings
```

### Backward Compatibility

The toolkit supports both formats during the transition period:
1. If `config.yaml` exists, it takes precedence
2. If only `standards.md` exists, it's loaded with a deprecation warning
3. Use the migration script: `bun scripts/migrate.js`

## Common Scenarios

### Minimal Configuration

```yaml
project:
  name: "my-project"
  description: "Simple CouchCMS site"
  type: "CouchCMS Web Application"

toolkit:
  path: "./ai-toolkit-shared"

editors:
  - cursor

modules:
  - couchcms-core

agents:
  - couchcms
```

### Full-Featured Configuration

```yaml
project:
  name: "enterprise-cms"
  description: "Enterprise CMS with full features"
  type: "CouchCMS Web Application"

toolkit:
  path: "./ai-toolkit-shared"

editors:
  - cursor
  - claude
  - kiro

modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
  - databound-forms
  - custom-routes
  - users
  - search
  - pagination

agents:
  - couchcms
  - databound-forms
  - alpinejs
  - tailwindcss
  - users

framework:
  doctrine: true
  directives: true
  playbooks: true

paths:
  css: "assets/css"
  typescript: "assets/ts"
  components: "snippets/components"
  views: "snippets/views"
  forms: "snippets/forms"

standards:
  indentation: 4
  language: "english"
  lineLength: 120

file_contexts:
  "*.php":
    agents: [couchcms]
    modules: [couchcms-core]
  "snippets/forms/*.html":
    agents: [databound-forms, couchcms]
    modules: [databound-forms, couchcms-core]
```

## Validation

To validate your configuration:

```bash
bun scripts/validate.js
```

This will check:
- Required fields are present
- Module names are valid
- Agent names are valid
- Editor names are supported
- Paths are properly formatted
- Naming conventions are valid
- Validation rules are properly structured

## See Also

- [Migration Guide](MIGRATION.md) - Upgrading from old format
- [Getting Started](GETTING-STARTED.md) - Initial setup
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues
