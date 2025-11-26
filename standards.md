---
# === PROJECT CONFIGURATION ===
name: "couchcms-ai-toolkit"
description: "CouchCMS AI Toolkit - Development and maintenance configuration"

# === TOOLKIT LOCATION ===
# Self-referential: toolkit points to itself
toolkit: "."

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

  # Development
  - typescript

# === AGENTS ===
# All available agents
agents:
  - couchcms

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
- Add to defaults.yaml if needed

## Agent Development

When creating new agents:
- Follow the structure in existing agents
- Update AGENTS.md documentation
- Ensure agents work with the sync system
