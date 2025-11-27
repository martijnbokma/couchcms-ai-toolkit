# Project Structure

## Root Configuration

- `standards.md` - Main configuration file (YAML frontmatter + Markdown)
- `defaults.yaml` - Default module/agent configurations
- `smart-defaults.yaml` - Smart defaults for common project types
- `preflight-checks.yaml` - Validation rules
- `package.json` - Dependencies and scripts

## Core Directories

### `/modules`
Knowledge modules for CouchCMS features and frameworks.
- Format: `{name}.md` + `{name}.skill-rules.json`
- Examples: `couchcms-core.md`, `tailwindcss.md`, `alpinejs.md`
- Skill rules enable Claude Code auto-activation

### `/agents`
Specialized AI agents for development tasks.
- Format: `{name}.md`
- Examples: `couchcms.md`, `databound-forms.md`, `users.md`
- Invoked via `@{name}` in AI chat

### `/framework`
AAPF (Autonomous Agent Prompting Framework) components.
- `doctrine/` - Core operational principles
- `directives/` - Specific instructions
- `playbooks/` - Step-by-step procedures
- `enhancements/` - Additional capabilities

### `/scripts`
Automation scripts (Bun/Node).
- `init.js` - Interactive setup wizard
- `sync.js` - Generate AI configs from standards.md
- `validate.js` - Validate configuration
- `extend-modules.js` - Extend modules from documentation
- `utils.js` - Shared utilities

### `/templates`
Project templates and editor configs.
- `standards.md` - Template for project configuration
- `editors/` - IDE-specific templates

### `/rules`
Auto-loading Cursor rules (MDC format).
- Activated based on file context
- Examples: `refactor-alpinejs.mdc`, `refactor-forms.mdc`

### `/commands`
Custom Cursor commands.
- Examples: `create-component.md`, `code-review.md`

### `/docs`
Documentation and guides.
- Getting started, configuration, modules, agents
- Troubleshooting and contributing guides

## Generated Directories

These are created by `sync.js`:

- `.cursor/` - Cursor IDE configs
- `.claude/` - Claude Code configs
- `.github/` - GitHub Copilot configs
- `.codewhisperer/` - Codewhisperer configs
- `.windsurf/` - Windsurf configs
- `.tabnine/` - Tabnine configs

## File Naming Conventions

- Modules: `{feature-name}.md` + `{feature-name}.skill-rules.json`
- Agents: `{agent-name}.md`
- Rules: `{purpose}.mdc` (Cursor MDC format)
- Scripts: `{action}.js` (kebab-case)
- Docs: `{TITLE}.md` (UPPERCASE for main docs)

## Key Patterns

1. **Self-referential**: Toolkit uses itself for development (toolkit points to ".")
2. **Modular**: Each module/agent is independent
3. **Auto-generated**: IDE configs generated from single source of truth
4. **Convention-based**: File naming determines behavior
