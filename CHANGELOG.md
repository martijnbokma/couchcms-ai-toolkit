# Changelog

All notable changes to the CouchCMS AI Toolkit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-12-01

### Added
- restore icons in Summary section only
- improve installation scripts with better UX and visual output
- improve terminal output formatting with picocolors
- Add defaults.yaml file to toolkit root
- Auto-migrate standards.md to .project/standards.md for consistency
- improve editor templates with best practices and config_file_path support

### Fixed
- remove .quiet() calls and improve merge conflict handling in quick-release
- add newline to defaults.yaml for improved formatting
- improve title padding in printBox for better visual balance
- improve printBox border alignment and stdin handling in reinstall
- ensure reinstall script exits automatically after completion
- prevent RangeError in printBox when handling long messages
- update health check to use correct project root detection
- Show migration warning only once per process
- Use detected toolkit path when config is in toolkit directory
- Detect toolkit directory and use parent as project root
- Make template validator context-aware for each blocks
- Improve template validation and add missing template variables

### Other
- style: clean up whitespace in quick-release.js
- refactor: remove icons from reinstall script output
- Migrate from picocolors to ansis
- Make editor template installation optional
- style: remove trailing whitespace in sync.js
- style: remove trailing whitespace in template-validator.js
- style: remove trailing whitespace in template-validator.js
- refactor: centralize utilities and standardize logging
- test branch
- updates 2025-12-01


## [1.2.0] - 2025-12-01

### Added
- restore icons in Summary section only
- improve installation scripts with better UX and visual output
- improve terminal output formatting with picocolors
- Add defaults.yaml file to toolkit root
- Auto-migrate standards.md to .project/standards.md for consistency
- improve editor templates with best practices and config_file_path support

### Fixed
- remove .quiet() calls and improve merge conflict handling in quick-release
- add newline to defaults.yaml for improved formatting
- improve title padding in printBox for better visual balance
- improve printBox border alignment and stdin handling in reinstall
- ensure reinstall script exits automatically after completion
- prevent RangeError in printBox when handling long messages
- update health check to use correct project root detection
- Show migration warning only once per process
- Use detected toolkit path when config is in toolkit directory
- Always generate standards.md in .project/standards.md in project root
- Detect toolkit directory and use parent as project root
- Make template validator context-aware for each blocks
- Improve template validation and add missing template variables

### Other
- style: clean up whitespace in quick-release.js
- refactor: remove icons from reinstall script output
- Migrate from picocolors to ansis
- Make editor template installation optional
- style: remove trailing whitespace in sync.js
- style: remove trailing whitespace in template-validator.js
- style: remove trailing whitespace in template-validator.js
- refactor: centralize utilities and standardize logging
- test branch
- updates 2025-12-01
- Merge release v1.0.17 back to develop


## [1.1.0] - 2025-12-01

### Added
- restore icons in Summary section only
- improve installation scripts with better UX and visual output
- improve terminal output formatting with picocolors
- Add defaults.yaml file to toolkit root
- Auto-migrate standards.md to .project/standards.md for consistency
- improve editor templates with best practices and config_file_path support

### Fixed
- add newline to defaults.yaml for improved formatting
- improve title padding in printBox for better visual balance
- improve printBox border alignment and stdin handling in reinstall
- ensure reinstall script exits automatically after completion
- prevent RangeError in printBox when handling long messages
- update health check to use correct project root detection
- Show migration warning only once per process
- Use detected toolkit path when config is in toolkit directory
- Always generate standards.md in .project/standards.md in project root
- Detect toolkit directory and use parent as project root
- Make template validator context-aware for each blocks
- Improve template validation and add missing template variables

### Other
- refactor: remove icons from reinstall script output
- Migrate from picocolors to ansis
- Make editor template installation optional
- style: remove trailing whitespace in sync.js
- style: remove trailing whitespace in template-validator.js
- style: remove trailing whitespace in template-validator.js
- refactor: centralize utilities and standardize logging
- test branch
- updates 2025-12-01
- Merge release v1.0.17 back to develop


## [1.0.17] - 2025-12-01

### Fixed
- correct module reference paths in templates
- correct toolkit path calculation and file output locations

### Other
- Merge develop into master - resolve conflicts
- Merge pull request #1 from martijnbokma/feature/fix-installation-bugs
- Merge branch 'master' into feature/fix-installation-bugs
- docs(toolkit): complete documentation audit and implement comprehensive updates
- docs(toolkit): complete documentation audit and implement CouchCMS preset
- docs(toolkit): add language consistency requirements and update documentation
- docs(toolkit): add comprehensive playbook phases and documentation audit
- feat(toolkit): restructure skills and enhance Claude integration
- feat(toolkit): add editor support enhancements and documentation updates
- docs(toolkit): complete documentation audit and implement comprehensive updates
- Add missing standards and naming configuration
- docs(toolkit): complete documentation audit and implement CouchCMS preset
- docs(toolkit): add language consistency requirements and update documentation
- docs(toolkit): add comprehensive playbook phases and documentation audit
- feat(toolkit): restructure skills and enhance Claude integration
- feat(toolkit): add editor support enhancements and documentation updates
- Merge release v1.0.14 back to develop


## [1.0.16] - 2025-12-01

### Other
- docs(toolkit): complete documentation audit and implement comprehensive updates
- docs(toolkit): complete documentation audit and implement CouchCMS preset
- docs(toolkit): add language consistency requirements and update documentation
- docs(toolkit): add comprehensive playbook phases and documentation audit
- feat(toolkit): restructure skills and enhance Claude integration
- feat(toolkit): add editor support enhancements and documentation updates
- Merge release v1.0.14 back to develop


## [1.0.15] - 2025-12-01

### Other
- docs(toolkit): complete documentation audit and implement comprehensive updates
- docs(toolkit): complete documentation audit and implement CouchCMS preset
- docs(toolkit): add language consistency requirements and update documentation
- docs(toolkit): add comprehensive playbook phases and documentation audit
- feat(toolkit): restructure skills and enhance Claude integration
- feat(toolkit): add editor support enhancements and documentation updates
- Merge release v1.0.14 back to develop


## [Unreleased]

### Changed
- **Refactored `scripts/sync.js`**: Improved modularity and error handling
  - Extracted `loadProjectConfiguration()` - Handles config discovery and parsing (~75 lines)
  - Extracted `loadToolkitResources()` - Loads modules, agents, and context (~45 lines)
  - Extracted `generateAllConfigurations()` - Orchestrates template rendering and file writing (~45 lines)
  - Main `sync()` function reduced from ~180 lines to ~30 lines (83% reduction)
  - Replaced local `resolveToolkitPath()` with `resolvePath()` utility from `file-utils.js`
  - Standardized error handling using `ToolkitError`, `ConfigError`, and `handleError()` from `errors.js`
  - Improved code organization and maintainability

### Fixed
- Standardized error handling across `scripts/sync.js` - All critical errors now use ToolkitError classes
- Improved error messages with automatic solution suggestions via `handleError()`
- Made dependency check non-blocking to prevent sync failures when dependencies are missing

### Added
- feat(setup): add Simple Standards Creator wizard for beginners
- New `create-standards.js` script with guided setup in simple language
- Documentation for simple setup in `docs/SIMPLE-SETUP.md`
- Comparison between simple and advanced setup methods in README
- feat(docs): comprehensive editor support documentation
- New `docs/EDITOR-SUPPORT.md` with detailed guide for all supported editors
- Enhanced documentation for Cursor MDC rules and Claude Code Skills
- Troubleshooting section for editor-specific issues
- Examples of generated configurations for each editor
- feat(presets): new "CouchCMS Complete" preset with all CouchCMS features
- All CouchCMS modules and agents now included by default in Simple mode

### Changed
- **BREAKING**: Simple mode now includes ALL CouchCMS modules and agents by default
- **BREAKING**: Auto-detect mode now includes ALL CouchCMS modules and agents by default
- Update README with setup method comparison and recommendations
- Add `bun run create` command to package.json
- Update tech.md steering with new setup command
- Enhanced README with editor support features section
- Updated QUICK-START.md with detailed file structure including editor configs
- Updated CONFIG-FILES.md with comprehensive editor configuration information
- Updated TROUBLESHOOTING.md with editor-specific troubleshooting sections
- Updated `docs/GETTING-STARTED.md` to reflect CouchCMS Complete approach
- Updated `scripts/lib/prompts.js` to use CouchCMS Complete as default
- Updated `scripts/create-standards.js` to include all CouchCMS features by default
- Updated `scripts/init.js` to show CouchCMS Complete in Simple mode
- Updated `scripts/lib/project-detector.js` to recommend all CouchCMS features
- Renamed Custom mode option 2 from "Standard" to "CouchCMS Complete" (recommended)
- Frontend frameworks (Alpine.js, TailwindCSS, daisyUI, TypeScript) remain optional

### Rationale
Since this is a **CouchCMS AI Toolkit**, all CouchCMS-specific features (databound-forms, custom-routes, folders, archives, relationships, repeatable-regions, search, pagination, comments, users, views, nested-pages, photo-gallery, rss-feeds, on-page-editing, admin-panel-theming) should be available by default. Users get full CouchCMS support out of the box, while frontend frameworks remain optional based on project needs.

## [1.0.14] - 2025-11-28

### Other
- docs(standards): remove file extension suffixes from naming conventions
- Merge release v1.0.13 back to develop


## [1.0.13] - 2025-11-28

### Other
- refactor(config-loader): improve legacy config conversion and agent validation
- Merge release v1.0.12 back to develop


## [1.0.12] - 2025-11-28

### Other
- refactor(config-loader): simplify validation logic and improve flexibility
- Merge release v1.0.11 back to develop


## [1.0.11] - 2025-11-28

### Other
- chore(install): improve submodule cleanup with better sequencing
- Merge release v1.0.10 back to develop


## [1.0.10] - 2025-11-28

### Other
- chore(install): improve submodule cleanup and add retry logic
- Merge release v1.0.9 back to develop


## [1.0.9] - 2025-11-28

### Other
- chore(install): improve submodule cleanup and gitmodules handling
- Merge release v1.0.8 back to develop


## [1.0.8] - 2025-11-28

### Other
- refactor(init): simplify toolkit path detection and configuration loading
- Merge release v1.0.7 back to develop


## [1.0.7] - 2025-11-28

### Other
- Merge release v1.0.6 back to develop


## [1.0.6] - 2025-11-28

### Other
- Merge release v1.0.5 back to develop


## [1.0.5] - 2025-11-28

### Other
- chore(install): improve submodule cleanup and error handling
- Merge release v1.0.4 back to develop


## [1.0.4] - 2025-11-27

### Other
- Merge release v1.0.3 back to develop


## [1.0.3] - 2025-11-27

### Other
- Merge release v1.0.2 back to develop


## [1.0.2] - 2025-11-27

### Other
- Merge release v1.0.1 back to develop


## [1.0.1] - 2025-11-27

### Other
- refactor: simplify toolkit structure and consolidate configuration
- Merge release v1.0.0 back to develop


## [1.0.1] - 2025-11-27

### Other
- refactor: simplify toolkit structure and consolidate configuration
- Merge release v1.0.0 back to develop


## [1.0.0] - 2025-11-27

### Added
- implement cleanup functionality for generated files
- expand documentation for new content organization features
- update README and add quick reference documentation
- enhance documentation and add new command templates
- enhance documentation and add new refactoring rules
- add comprehensive configuration files for AI toolkit

### Fixed
- update references from `project.md` to `standards.md` across multiple files

### Other
- feat(release): auto-generate changelog from git commits
- feat(release): add quick-release script for solo developer workflow
- feat(git-workflow): implement git flow management system with CI/CD integration
- ``` chore: update ai-toolkit-shared submodule to dirty state ```
- feat(init): add framework configuration options to init process
- feat(init, sync): enhance module and agent configuration
- fix(sync, validate): ensure module and agent lists are always arrays
- refactor: update README and agent documentation formatting
- fix(validate): update resolveToolkitPath function to accept project directory
- feat(config): update project configuration and add new dependencies
- feat(refactoring): add router system and update rules for universal usage
- refactor(prompts): make all prompts framework-agnostic and universal


## [1.0.0] - 2025-11-27

### Added
-

### Changed
-

### Fixed
-


## [Unreleased]

## [2.1.0] - 2025-11-27

### Added - Smart Setup & Detection
- **Auto-Detection System** - Automatically detects project type, frameworks, and languages
  - Detects from package.json, composer.json, config files, and HTML content
  - Recommends appropriate modules and agents based on detection
  - Supports project types: landing-page, blog, ecommerce, webapp, custom
- **Project Presets** - 8 predefined configurations for common project types
  - Landing Page, Blog, E-commerce, Web Application, Portfolio, Documentation, Minimal, Full Stack
  - Each preset includes recommended modules, agents, and framework settings
- **4 Setup Modes** in init wizard
  - Auto mode: Uses detected settings (recommended)
  - Preset mode: Choose from common project types
  - Simple mode: Quick setup with defaults
  - Custom mode: Full control over all options

### Added - Enhanced Developer Experience
- **Watch Mode** - Auto-sync configs when standards.md changes
  - Run with `bun scripts/sync.js --watch`
  - Debounced to prevent excessive syncs
  - Graceful error handling
- **Health Check Command** - Comprehensive system validation
  - Validates toolkit installation and structure
  - Checks project configuration
  - Verifies generated files are up to date
  - Checks for toolkit updates
  - Provides actionable fix suggestions
- **Update Notifier** - Non-blocking update notifications
  - Checks for updates every 24 hours
  - Displays commit count and latest changes
  - Caches results to avoid network overhead
  - Integrated into sync and other commands
- **Interactive Module Browser** - Terminal UI for browsing modules/agents
  - Keyboard navigation (↑↓ arrows, Space to toggle, Enter to save)
  - Grouped by category
  - Shows descriptions and dependencies
  - Auto-selects dependencies
  - Run with `bun scripts/browse.js`

### Added - One-Command Install
- **Install Scripts** - Install toolkit in one command without npm
  - `scripts/install.js` - Bun/Node installer script
  - `install.sh` - Bash installer for universal compatibility
  - Works directly from GitHub (no npm publish needed)
  - Usage: `curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash`
  - Or: Download and run with Bun
- **Automated Setup** - Installer handles everything:
  - Adds toolkit as git submodule
  - Installs dependencies (Bun or npm)
  - Runs setup wizard
  - Generates all configs

### Added - New Scripts
- `scripts/lib/project-detector.js` - Project detection utilities
- `scripts/lib/update-notifier.js` - Update notification system
- `scripts/health.js` - Health check command
- `scripts/browse.js` - Interactive module browser
- `scripts/install.js` - One-command installer
- `install.sh` - Bash installer script
- `presets.yaml` - Project preset definitions

### Changed
- **init.js** - Enhanced with auto-detection and preset support
- **sync.js** - Added watch mode and update notifications
- **README.md** - Added one-command install instructions
- **package.json** - Added new npm scripts:
  - `install-toolkit` - Run installer
  - `health` - Run health check
  - `sync:watch` - Run sync in watch mode
  - `browse` - Browse modules
  - `browse:modules` - Browse modules only
  - `browse:agents` - Browse agents only

### Improved
- Setup wizard now shows detected project information before asking questions
- Better default values based on project detection
- Reduced number of questions in auto/preset modes
- More informative console output with detection results

## [2.0.0] - 2025-11-27

### 🎉 Major Release: Toolkit Simplification

This release represents a major refactoring of the CouchCMS AI Toolkit, focusing on simplicity, performance, and maintainability.

### ⚠️ Breaking Changes

#### Removed Editor Support

The following editors are no longer supported:
- **Tabnine** - Removed due to low usage
- **CodeWhisperer** - Removed due to low usage

**Supported Editors (v2.0.0):**
- Cursor
- Claude Code
- Windsurf
- Kiro
- GitHub Copilot

**Migration:** If you were using Tabnine or CodeWhisperer, you'll need to switch to one of the supported editors or use an older version of the toolkit.

#### Configuration Format Changes

- **Simplified Format:** Single `standards.md` file in project root
- **Removed Files:** `defaults.yaml`, `smart-defaults.yaml`, `preflight-checks.yaml` no longer needed
- **Location Change:** Moved from `.project/standards.md` to root `standards.md`

**Note:** The intermediate `config.yaml` format (v2.0.0) has been replaced with the simpler `standards.md` approach.

#### Removed Features from smart-defaults.yaml

The following features have been removed as they were unused or over-engineered:
- `action_contexts` - Not used by any templates
- `intent_patterns` - AI editors handle this natively
- `communication_modes` - Not used
- `suggestion_triggers` - Too complex, removed
- `context_cache_schema` - Over-engineering, removed

### ✨ Added

#### Configuration

- **`standards.md`** - Simplified configuration format
  - Single file with YAML frontmatter + Markdown
  - Configuration and project rules in one place
  - Better validation and error messages
  - Self-documenting structure

#### Scripts & Tools

- **Modular Script Architecture** (`scripts/lib/`)
  - `config-loader.js` - Configuration loading and validation
  - `module-loader.js` - Module and agent loading with caching
  - `template-engine.js` - Template rendering engine
  - `file-writer.js` - Optimized file writing with change detection
  - `cache.js` - Module caching for performance
  - `prompts.js` - User input utilities for init.js
  - `config-generator.js` - Configuration file generation
  - `sync-runner.js` - Sync execution utilities

#### Documentation

- **`docs/MIGRATION.md`** - Comprehensive migration guide
  - Step-by-step upgrade instructions
  - Breaking changes explained
  - Migration script usage
  - Rollback instructions
  - Troubleshooting section

- **`docs/CONFIG-FILES.md`** - Configuration documentation
  - Complete configuration reference
  - Field descriptions and examples
  - Validation rules
  - Common scenarios

- **Updated Documentation**
  - `README.md` - Updated for new configuration format
  - `docs/GETTING-STARTED.md` - New format setup instructions
  - `docs/CONFIG-FILES.md` - Documents both old and new formats
  - `docs/TROUBLESHOOTING.md` - Migration and performance troubleshooting

### 🚀 Performance Improvements

- **50% Faster Sync** - Achieved through multiple optimizations:
  - Module caching reduces redundant file reads
  - Selective file writing skips unchanged files
  - Parallel template rendering for multiple editors
  - Optimized configuration loading

- **Module Caching** - `ModuleCache` class caches parsed modules
- **Selective File Writing** - Only writes files that have changed
- **Parallel Processing** - Templates rendered in parallel

### 🔧 Changed

#### Script Refactoring

- **`scripts/sync.js`** - Reduced from ~500 lines to ~200 lines
  - Now acts as orchestrator
  - Delegates to specialized library modules
  - Improved error handling
  - Better performance logging

- **`scripts/init.js`** - Reduced from ~526 lines to ~300 lines
  - Extracted helper modules
  - Simplified question flow (max 5 questions in simple mode)
  - Better error messages
  - Improved user experience

- **`scripts/validate.js`** - Enhanced validation
  - Validates `standards.md` format
  - Better error messages with suggestions

#### Configuration

- **Simplified Configuration** - Single file approach
  - `defaults.yaml` → removed (built into toolkit)
  - `smart-defaults.yaml` → removed (built into toolkit)
  - `preflight-checks.yaml` → removed (built into toolkit)
  - All configuration in `standards.md`

- **Simplified smart-defaults.yaml** - Removed unused sections (70% smaller)
  - Kept: `file_contexts`, `template_aliases`
  - Removed: `action_contexts`, `intent_patterns`, `communication_modes`, `suggestion_triggers`, `context_cache_schema`

#### Editor Support

- **Streamlined Editor Support** - Focus on actively used editors
  - Removed Tabnine template and logic
  - Removed CodeWhisperer template and logic
  - Optimized templates for remaining editors

### 🐛 Fixed

- **Error Handling** - Improved error messages throughout
  - Configuration validation errors now include suggestions
  - Template rendering errors show context
  - File writing errors provide actionable guidance

- **Backward Compatibility** - Maintained full compatibility
  - Legacy `standards.md` format still works
  - Automatic format detection
  - No breaking changes for supported editors

### 📚 Documentation

- All documentation updated to reflect new structure
- Migration guide with step-by-step instructions
- Configuration schema fully documented
- Troubleshooting guide expanded with migration section
- Performance optimization tips added

### 🔄 Migration Path

To upgrade from v1.x to v2.0.0:

1. **Update toolkit:**
   ```bash
   cd ai-toolkit-shared
   git pull origin master
   bun install
   cd ..
   ```

2. **Run migration:**
   ```bash
   bun ai-toolkit-shared/scripts/migrate.js
   ```

3. **Verify:**
   ```bash
   bun ai-toolkit-shared/scripts/validate.js
   bun ai-toolkit-shared/scripts/sync.js
   ```

See [MIGRATION.md](docs/MIGRATION.md) for complete instructions.

---

## [1.1.0] - 2025-11-25

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

- **.gitignore** - Added `*.bak.*` pattern to exclude backup files
    - Prevents backup files from being tracked in git
    - Improves repository cleanliness

- **README.md** - Added Rules & Configuration section with links to new guides
- **GETTING-STARTED.md** - Added links to Project Rules, User Rules, and Custom Commands guides
- **sync.js** - Added command syncing functionality

- **sync.js** - Major refactoring for improved maintainability and modularity
    - Extracted `loadProjectConfiguration()` - Handles config file discovery and parsing
    - Extracted `loadToolkitResources()` - Loads modules, agents, framework, and project context
    - Extracted `generateAllConfigurations()` - Orchestrates all configuration generation
    - Extracted `getTemplateMap()`, `renderTemplate()`, `writeConfigFile()` - Template processing utilities
    - Extracted `generateTabnineSettings()`, `generateCodeWhispererReadme()` - Tool-specific generators
    - Removed duplicate utility functions - Now imports from `utils.js`
    - Reduced main `sync()` function from ~166 lines to ~34 lines (orchestrator pattern)
    - Improved code organization and single responsibility principle compliance

- **validate.js** - Refactored to eliminate code duplication
    - Removed duplicate `findProjectFile()` - Now imports from `utils.js`
    - Removed duplicate `resolveToolkitPath()` - Now imports from `utils.js`
    - Fixed missing `join` import from `path` module
    - Improved consistency with `sync.js` by sharing utilities

- **utils.js** - Enhanced with shared utility functions
    - Added `findProjectFile()` - Traverses directories to find config files
    - Added `resolveToolkitPath()` - Resolves toolkit paths with tilde expansion support
    - Added `replaceVariables()` - Recursive path variable replacement
    - Added `ToolkitError` class - Standardized error handling for toolkit scripts
    - Added `handleError()` function - Consistent error display and logging
    - All functions properly exported for reuse across scripts

- **init.js** - Major refactoring for improved maintainability and modularity
    - Extracted `determineProjectDirectory()` - Project directory detection logic
    - Extracted `checkExistingConfig()` - Config overwrite confirmation
    - Extracted `determineConfigPath()` - Config file location selection
    - Extracted `getAvailableModules()` / `getAvailableAgents()` - Module and agent definitions
    - Extracted `selectModules()` / `selectAgents()` - Selection logic with preset support
    - Extracted `selectFramework()` - Framework configuration selection
    - Extracted `selectContextDirectory()` - Context directory selection
    - Extracted `replaceTemplateVariables()` - Template variable replacement
    - Extracted `generateStandardsFile()` - Standards file generation with error handling
    - Extracted `setupContextDirectory()` - Context directory setup
    - Extracted `runInitialSync()` - Sync script execution
    - Extracted `displaySuccessMessage()` - Success message display
    - Reduced main `init()` function from 526 → ~90 lines (orchestrator pattern)
    - Added comprehensive JSDoc documentation for all functions
    - Standardized error handling using `ToolkitError` from `utils.js`
    - Improved code organization and single responsibility principle compliance

- **sync.js** - Refactored to use shared error handling
    - Removed duplicate `ToolkitError` class - Now imports from `utils.js`
    - Removed duplicate `handleError()` function - Now imports from `utils.js`
    - Improved consistency with other scripts by sharing utilities

- **update-submodule.js** - Refactored for improved maintainability and error handling
    - Extracted `detectGitRepo()` - Git repository and submodule detection
    - Extracted `validateGitRepo()` - Git repository validation with ToolkitError
    - Extracted `getCurrentBranch()` - Branch name retrieval with error handling
    - Extracted `fetchLatestChanges()` - Fetch operation with error handling
    - Extracted `pullLatestChanges()` - Pull operation with structured return value
    - Extracted `getLatestCommit()` - Commit information retrieval
    - Extracted `showUpdateSummary()` - Update summary display logic
    - Refactored main logic into `updateSubmodule()` orchestrator function
    - Standardized error handling using `ToolkitError` and `handleError()` from `utils.js`
    - Added comprehensive JSDoc documentation for all functions
    - Improved error messages with error codes (NOT_GIT_REPO, GET_BRANCH_FAILED, FETCH_FAILED, PULL_FAILED, GET_COMMIT_FAILED)
    - Improved code organization and testability

- **Configuration files** - Enhanced documentation and schema
    - **defaults.yaml** - Added schema documentation for `paths`, `standards`, and `naming` sections
    - **smart-defaults.yaml** - Added comprehensive schema documentation for all sections
    - **preflight-checks.yaml** - Added severity level documentation and check structure schema
    - Improved inline comments and usage notes throughout all config files

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

- **Bun compatibility** - Fixed `setRawMode` issue in `sync.js` and `init.js`
    - Added runtime check for `process.stdin.setRawMode` before calling
    - Prevents errors when running scripts with Bun runtime
    - Maintains backwards compatibility with Node.js
    - Scripts now work seamlessly in both Bun and Node.js environments

- Path resolution for Windows compatibility
- Missing templates directory structure
- Auto-formatting compatibility in generated files

### Removed

- **Backup files** - Removed obsolete backup files from `scripts/` directory
    - Removed `sync.js.bak.20251126`
    - Removed `init.js.bak.20251126`
    - Removed `validate.js.bak.20251126`
    - Removed `utils.js.bak.20251126`
    - Removed `update-submodule.js.bak.20251126`
    - These files are now excluded via `.gitignore` pattern

## [1.0.0] - 2025-11-01

### Added

- Initial release of CouchCMS AI Toolkit
- Core module system (couchcms-core, tailwindcss, daisyui, alpinejs, typescript, databound-forms)
- Agent system for specialized AI assistance
- Automatic generation of .cursorrules, CLAUDE.md, AGENTS.md
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
