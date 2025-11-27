# Technology Stack

## Runtime & Package Manager

- **Bun** (recommended) or Node.js v18+
- ES Modules (`"type": "module"` in package.json)

## Core Dependencies

- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing
- `handlebars` - Template generation

## Build System

No build step required. Scripts run directly with Bun/Node.

## Common Commands

```bash
# Setup & Initialization
bun install                              # Install dependencies (REQUIRED after clone)
bun scripts/init.js                      # Interactive setup wizard

# Configuration Management
bun scripts/sync.js                      # Generate/update AI configs from standards.md
bun scripts/validate.js                  # Validate configuration and compliance

# Development
bun scripts/extend-modules.js --analyze  # Analyze documentation for module extensions
bun scripts/extend-modules.js --module <name>  # Extend specific module

# Git Workflow
bun scripts/update-submodule.js          # Update toolkit to latest version
bun scripts/prepare-contribution.js     # Prepare for contributing (switch to master, create branch)
```

## Project Structure

```
couchcms-ai-toolkit/
├── modules/              # Knowledge modules (.md + .skill-rules.json)
├── agents/               # AI agents (.md)
├── framework/            # AAPF framework (doctrine, directives, playbooks)
├── scripts/              # Automation scripts
├── templates/            # Project templates
├── rules/                # Auto-loading Cursor rules (.mdc)
├── commands/             # Custom commands
├── docs/                 # Documentation
└── standards.md          # Main configuration file
```

## Configuration Format

YAML frontmatter + Markdown body in `standards.md`:
- Frontmatter: modules, agents, framework settings
- Body: Project-specific rules and documentation

## Target Platforms

Generates configs for:
- Cursor IDE (.cursorrules, .cursor/rules/)
- Claude Code (.claude/skills/, .claude/settings.json)
- GitHub Copilot (.github/copilot-instructions.md)
- Windsurf (.windsurf/rules.md)
- Kiro (.kiro/steering/)
