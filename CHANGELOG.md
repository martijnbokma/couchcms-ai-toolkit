# Changelog

All notable changes to the CouchCMS AI Toolkit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Project Rules Guide** (`docs/PROJECT-RULES.md`) - Complete guide to Cursor Project Rules
    - Explanation of rule types (Always Apply, Apply Intelligently, etc.)
    - How to create custom Project Rules
    - Integration with toolkit's auto-syncing rules
    - Best practices and examples
    - Troubleshooting guide

- **User Rules Guide** (`docs/USER-RULES.md`) - Complete guide to Cursor User Rules
    - When to use User Rules vs Project Rules
    - How to set up User Rules in Cursor Settings
    - Best practices for global preferences
    - Integration with toolkit's Project Rules
    - Template and examples

- **User Rules Template** (`templates/editors/user-rules.template.md`)
    - Ready-to-use template for Cursor User Rules
    - Includes communication style, code preferences, workflow
    - Automatically generated as `USER-RULES.md` during sync

- **Project Rules Template** (`templates/editors/project-rules.template.md`)
    - Template for creating custom Project Rules
    - Examples for different rule types
    - Best practices included
    - Automatically generated as `PROJECT-RULES-TEMPLATE.md` during sync

- **Sync script enhancement** - Now generates `USER-RULES.md` and `PROJECT-RULES-TEMPLATE.md`
    - Adds timestamp to template data
    - Includes both templates in sync process

- **Custom Commands Guide** (`docs/CUSTOM-COMMANDS.md`) - Complete guide to Cursor Custom Commands
    - What are Custom Commands and when to use them
    - Project Commands vs User Commands
    - How to create custom commands
    - Integration with toolkit's auto-syncing commands
    - Best practices and examples
    - Troubleshooting guide

- **Toolkit Commands** (`commands/`) - Pre-built commands for CouchCMS projects
    - `code-review.md` - Comprehensive code review checklist
    - `create-component.md` - Create CouchCMS components
    - `refactor-file.md` - Refactor using toolkit patterns
    - `validate-code.md` - Validate against project standards
    - `create-form.md` - Create DataBound Forms
    - `create-view.md` - Create CouchCMS views
    - `fix-issues.md` - Fix common issues automatically
    - `add-authentication.md` - Add authentication to templates
    - `README.md` - Commands documentation

- **Sync script enhancement** - Now syncs Custom Commands
    - New `syncCursorCommands()` function
    - Automatically copies commands from toolkit to `.cursor/commands/`
    - Replaces path variables in commands
    - Integrates with existing sync workflow

### Changed

- **README.md** - Added Rules & Configuration section with links to new guides
- **GETTING-STARTED.md** - Added links to Project Rules, User Rules, and Custom Commands guides
- **sync.js** - Added command syncing functionality

## [1.1.0] - 2025-11-25

### Added

- **validate.js** - Comprehensive validation script for project configuration and compliance checking
    - Validates project.md syntax and required fields
    - Checks module and agent availability
    - Verifies toolkit paths and generated files
    - Provides compliance scoring (0-100%)
    - Helpful error messages with suggestions

- **init.js** - Interactive setup wizard for new projects
    - Step-by-step project configuration
    - Module selection with descriptions
    - Agent selection with descriptions
    - Automatic context directory creation
    - Runs initial sync automatically
    - Creates sample context.md template

- **CHANGELOG.md** - Version history and update tracking

### Changed

- **sync.js** - Enhanced error handling and robustness
    - Added try-catch blocks for all file operations
    - Better error messages with troubleshooting hints
    - Validation of generated content before writing
    - Graceful handling of missing modules/agents

- **README.md** - Updated documentation
    - Added validation and init commands
    - Improved quick start guide
    - Better troubleshooting section

### Fixed

- Path resolution for Windows compatibility
- Missing templates directory structure
- Auto-formatting compatibility in generated files

## [1.0.0] - 2025-11-01

### Added

- Initial release of CouchCMS AI Toolkit
- Core module system (couchcms-core, tailwindcss, daisyui, alpinejs, typescript, databound-forms)
- Agent system for specialized AI assistance
- Automatic generation of .cursorrules, CLAUDE.md, AGENT.md
- Variable replacement system ({{paths.xxx}})
- Cursor rules auto-loading based on file type
- Project-specific context support
- Git submodule support

### Module System

- **couchcms-core** - Core CouchCMS patterns, templates, security
- **tailwindcss** - TailwindCSS 4 patterns and best practices
- **daisyui** - daisyUI 5 components and theming
- **alpinejs** - Alpine.js patterns with CouchCMS integration
- **typescript** - TypeScript standards and patterns
- **databound-forms** - DataBound Forms implementation

### Agent System

- **couchcms** - Core CouchCMS development
- **databound-forms** - Forms, CRUD, validation
- **alpinejs** - Alpine.js + CouchCMS integration
- **tailwindcss** - TailwindCSS 4 + daisyUI 5 styling
- **typescript** - TypeScript development
- **custom-routes** - Clean URLs and routing
- **mysql** - Database operations
- **bun** - Bun runtime and build tooling
- **git** - Version control

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

**No breaking changes** - this is a backward-compatible update.

#### New Features Available

1. **Validate your project**:

    ```bash
    bun run validate
    ```

2. **Use init wizard for new projects**:

    ```bash
    bun run init
    ```

3. **Better error handling** - sync.js now provides clearer error messages

#### Recommended Actions

1. Run validation to ensure your project is properly configured:

    ```bash
    bun run validate
    ```

2. If score < 100%, review warnings and fix any issues

3. Re-run sync to benefit from improved error handling:
    ```bash
    bun run sync
    ```

---

## Future Roadmap

### Planned for 1.2.0

- TypeScript migration for all scripts
- Testing framework (Vitest)
- Module discovery commands (`bun run modules:list`, `modules:info`)
- Dry run mode (`bun run sync --dry-run`)
- Watch mode (`bun run sync:watch`)
- Debug mode (`bun run sync --debug`)

### Planned for 1.3.0

- Interactive sync mode with file overwrite confirmations
- Smart updates (skip sync if nothing changed)
- Multi-project workspace support
- Module dependency auto-resolution
- Module composition (module groups)

### Planned for 2.0.0

- Major restructure into `core/` directory
- Comprehensive test suite
- Examples directory with sample projects
- Split documentation into multiple files
- Better CLI output with colors (chalk)
- Configuration preview (`bun run config:show`)
- Rollback system for failed syncs

---

## Contributing

We welcome contributions! See [README.md](README.md#contributing) for guidelines on:

- Adding new modules
- Improving existing modules
- Reporting issues
- Development setup

## License

MIT License - see LICENSE file for details
