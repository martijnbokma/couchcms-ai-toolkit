# Universal AI Agent Instructions

This project uses the **Universal AI Coding Standards** system for consistent AI agent behavior across all editors.

## Central Configuration

All AI coding agents must follow the rules defined in `/docs/standards.md` - this is the single source of truth for:

- Code quality standards
- Language requirements (English only)
- Technology hierarchy and patterns
- Project-specific rules and conventions

## Generated Agent Configurations

The system automatically generates specific instructions for each AI agent:

- **Cursor**: `.cursorrules`
- **Claude**: `CLAUDE.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **CodeWhisperer**: `.codewhisperer/settings.json`
- **Tabnine**: `.tabnine/settings.json`
- **Windsurf**: `.windsurf/rules/`

## Usage

```bash
# Update all AI agent configurations
bun run sync

# Validate code compliance
bun run validate
```

## Project Context

- **Type**: {{project.type}}
- **Languages**: {{languages | join(", ")}}
- **Frameworks**: {{frameworks | join(", ")}}
- **Standards**: {{standards.indentation}}-space indentation, English-only, theme-aware styling

## Key Requirements

1. **English Only**: All code, comments, and documentation in English
2. **Standards Compliance**: Always follow `/docs/standards.md`
3. **Technology Hierarchy**: Follow the established technology stack order
4. **Quality**: Maintain code quality and accessibility standards

## Available Knowledge Modules

{{#each modules}}

- **{{name}}**: {{description}}
  {{/each}}

## Project Roles

{{#each roles}}

- **{{name}}**: {{description}}
  {{/each}}

If any conflict exists between this file and specific agent configurations, `/docs/standards.md` always wins.
