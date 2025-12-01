---
# === PROJECT CONFIGURATION ===
name: "couchcms-ai-toolkit"
description: "CouchCMS AI Toolkit - Development and maintenance configuration"

# === TOOLKIT LOCATION ===
# Self-referential: toolkit points to itself
toolkit: "."

# === CODING STANDARDS ===
standards:
  indentation: 4
  lineLength: 120
  language: "english"

# === NAMING CONVENTIONS ===
naming:
  files: "kebab-case"
  variables: "camelCase"
  classes: "PascalCase"
  constants: "snake_case"

# === MODULES ===
# All available modules for toolkit development
modules:
  # Core
  - couchcms-core

  # Frontend
  - tailwindcss
  - daisyui
  - alpinejs

  # Backend
  - databound-forms
  - custom-routes

  # Content
  - folders
  - archives
  - relationships
  - repeatable-regions
  - search
  - pagination
  - comments

  # User Features
  - users

  # Development
  - typescript

# === FRAMEWORK (OPTIONAL) ===
# Enable AAPF framework for disciplined AI agent behavior
# Options:
#   - framework: true                    # Full framework (doctrine + directives + playbooks + enhancements)
#   - framework: { doctrine: true, directives: true, playbooks: true }  # Custom selection
#   - framework: false                   # Disabled (default)
framework: true

# === AGENTS ===
# All available agents
agents:
  # Core
  - couchcms
  - databound-forms
  - custom-routes

  # Frontend
  - alpinejs
  - tailwindcss
  - typescript

  # Content Management
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

  # User Features
  - users

  # Development Tools
  - bun
  - git
  - mysql
  - admin-panel-theming

# === EDITORS ===
# Select which editors/tools to configure
editors:
  cursor: true
  claude: true
  copilot: true
  windsurf: false
  zed: false
  codewhisperer: false
  kiro: false
  antigravity: false
  jules: false
  roocode: false
  'vscode-ai': false
  tabnine: false
  agent: false

# === CONTEXT ===
# Project context directory (optional)
# context: ".project/ai"
---

# Toolkit Development Rules

This is the CouchCMS AI Toolkit project configuration. This file allows the toolkit to sync its own AI configurations for development and maintenance.

## Development Guidelines

- Follow the standards defined in the framework modules
- Maintain consistency with existing patterns
- Update documentation when adding new modules or agents
- Test sync functionality after making changes

## Module Development

When creating new modules:
- Follow the structure in existing modules
- Include skill-rules.json for Claude Code integration
- Update MODULES.md documentation

## Agent Development

When creating new agents:
- Follow the structure in existing agents
- Update AGENTS.md documentation
- Ensure agents work with the sync system
