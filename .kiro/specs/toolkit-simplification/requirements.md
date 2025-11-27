# Requirements Document

## Introduction

This specification defines a comprehensive simplification and refactoring of the CouchCMS AI Toolkit to reduce complexity, improve maintainability, and enhance user experience. The toolkit currently suffers from over-engineering with too many configuration files, overly complex scripts, and support for editors that are rarely used. This refactoring will streamline the codebase while preserving all essential functionality.

## Glossary

- **Toolkit**: The CouchCMS AI Toolkit system that generates AI editor configurations
- **Configuration File**: YAML or Markdown files containing project settings (standards.md, defaults.yaml, etc.)
- **Editor Config**: Generated configuration files for AI coding assistants (Cursor, Claude, etc.)
- **Module**: A knowledge module containing CouchCMS-specific patterns and best practices
- **Agent**: A specialized AI agent for specific development tasks
- **Script**: Automation scripts (init.js, sync.js, validate.js) that process configurations
- **Smart Defaults**: Automatic context loading and suggestions based on file type
- **Template**: Handlebars template files used to generate editor configurations
- **Sync Process**: The process of generating editor configs from project configuration

## Requirements

### Requirement 1

**User Story:** As a toolkit maintainer, I want to consolidate configuration files, so that the system is easier to understand and maintain.

#### Acceptance Criteria

1. WHEN the system loads configuration THEN the system SHALL read from a maximum of two configuration files
2. WHEN defaults.yaml, smart-defaults.yaml, and preflight-checks.yaml are merged THEN the system SHALL preserve all essential configuration options
3. WHEN a user edits configuration THEN the system SHALL provide clear documentation about which file contains which settings
4. WHEN the system validates configuration THEN the system SHALL check the consolidated configuration structure
5. WHERE backward compatibility is needed THEN the system SHALL support reading old configuration format and migrate automatically

### Requirement 2

**User Story:** As a developer, I want the toolkit to support only actively used editors, so that maintenance burden is reduced and sync is faster.

#### Acceptance Criteria

1. WHEN the system generates editor configs THEN the system SHALL support Cursor, Claude Code, Windsurf, Kiro, and GitHub Copilot
2. WHEN the system encounters Tabnine or CodeWhisperer references THEN the system SHALL skip generation for these editors
3. WHEN templates are processed THEN the system SHALL only process templates for supported editors
4. WHEN documentation is updated THEN the system SHALL remove references to unsupported editors
5. WHERE existing projects use removed editors THEN the system SHALL provide migration guidance in documentation

### Requirement 3

**User Story:** As a toolkit maintainer, I want to refactor large scripts into modular components, so that code is easier to understand, test, and maintain.

#### Acceptance Criteria

1. WHEN init.js executes THEN the system SHALL use helper modules from scripts/lib/ directory
2. WHEN sync.js executes THEN the system SHALL delegate to specialized modules for loading, generating, and writing
3. WHEN any script module is loaded THEN the system SHALL contain no more than 400 lines of code
4. WHEN helper modules are created THEN the system SHALL export clear, single-responsibility functions
5. WHERE code is duplicated across scripts THEN the system SHALL extract shared logic into reusable utilities

### Requirement 4

**User Story:** As a developer, I want simplified smart defaults that focus on essential features, so that the system is less complex and more predictable.

#### Acceptance Criteria

1. WHEN smart-defaults.yaml is loaded THEN the system SHALL contain only file_contexts, paths, and template_aliases sections
2. WHEN intent_patterns are removed THEN the system SHALL rely on AI editors' native intent detection
3. WHEN communication_modes are removed THEN the system SHALL use standard output formatting
4. WHEN suggestion_triggers are removed THEN the system SHALL eliminate automatic suggestion prompts
5. WHERE file context is needed THEN the system SHALL automatically load appropriate modules based on file extension

### Requirement 5

**User Story:** As a developer, I want faster sync performance, so that I can iterate quickly during development.

#### Acceptance Criteria

1. WHEN sync.js executes THEN the system SHALL complete in less than 50% of current execution time
2. WHEN modules are loaded THEN the system SHALL cache parsed module content
3. WHEN templates are rendered THEN the system SHALL only process templates for enabled editors
4. WHEN files are written THEN the system SHALL skip writing if content is unchanged
5. WHERE performance is measured THEN the system SHALL log execution time for major operations

### Requirement 6

**User Story:** As a new user, I want a simpler init.js wizard, so that I can set up the toolkit quickly without confusion.

#### Acceptance Criteria

1. WHEN init.js runs THEN the system SHALL ask no more than 5 questions in simple mode
2. WHEN init.js runs THEN the system SHALL complete in less than 300 lines of code
3. WHEN user selects simple mode THEN the system SHALL use sensible defaults without additional prompts
4. WHEN user selects custom mode THEN the system SHALL provide clear explanations for each option
5. WHERE init.js needs complex logic THEN the system SHALL delegate to helper modules

### Requirement 7

**User Story:** As a toolkit user, I want clear migration guidance, so that I can upgrade from the old structure to the new simplified structure.

#### Acceptance Criteria

1. WHEN migration documentation is provided THEN the system SHALL include step-by-step upgrade instructions
2. WHEN old configuration files exist THEN the system SHALL detect and offer automatic migration
3. WHEN migration runs THEN the system SHALL backup old configuration files
4. WHEN migration completes THEN the system SHALL validate the new configuration
5. WHERE migration fails THEN the system SHALL restore backup and provide clear error messages

### Requirement 8

**User Story:** As a toolkit maintainer, I want to remove unused features from smart-defaults.yaml, so that the codebase is leaner and easier to maintain.

#### Acceptance Criteria

1. WHEN action_contexts are evaluated THEN the system SHALL determine if they are used in any templates or scripts
2. WHEN unused sections are identified THEN the system SHALL remove them from smart-defaults.yaml
3. WHEN context_cache_schema is removed THEN the system SHALL remove related caching logic from sync.js
4. WHEN suggestion_triggers are removed THEN the system SHALL remove related prompt logic from scripts
5. WHERE features are removed THEN the system SHALL document the removal in CHANGELOG.md

### Requirement 9

**User Story:** As a developer, I want consolidated template generation logic, so that adding new editor support is straightforward.

#### Acceptance Criteria

1. WHEN a new editor template is added THEN the system SHALL require only adding a template file and updating editor list
2. WHEN templates are rendered THEN the system SHALL use a unified rendering function for all editors
3. WHEN template data is prepared THEN the system SHALL use a single data preparation function
4. WHEN output paths are determined THEN the system SHALL use a configuration-driven mapping
5. WHERE template rendering fails THEN the system SHALL provide clear error messages with template name and line number

### Requirement 10

**User Story:** As a toolkit user, I want updated documentation that reflects the simplified structure, so that I can understand and use the toolkit effectively.

#### Acceptance Criteria

1. WHEN documentation is updated THEN the system SHALL reflect the new two-file configuration structure
2. WHEN README.md is updated THEN the system SHALL remove references to removed editors
3. WHEN GETTING-STARTED.md is updated THEN the system SHALL include simplified setup instructions
4. WHEN TROUBLESHOOTING.md is updated THEN the system SHALL include solutions for common migration issues
5. WHERE code examples exist THEN the system SHALL update them to use the new structure

### Requirement 11

**User Story:** As a toolkit maintainer, I want to preserve all existing functionality, so that users don't lose features they depend on.

#### Acceptance Criteria

1. WHEN refactoring is complete THEN the system SHALL generate identical output for supported editors
2. WHEN modules are loaded THEN the system SHALL load all modules that were previously supported
3. WHEN agents are loaded THEN the system SHALL load all agents that were previously supported
4. WHEN paths are resolved THEN the system SHALL resolve paths identically to the old system
5. WHERE functionality changes THEN the system SHALL document the change and provide migration path

### Requirement 12

**User Story:** As a developer, I want improved error handling in scripts, so that I can quickly identify and fix configuration issues.

#### Acceptance Criteria

1. WHEN an error occurs THEN the system SHALL provide a clear error message with context
2. WHEN configuration is invalid THEN the system SHALL indicate which field is problematic and why
3. WHEN a module is missing THEN the system SHALL suggest available modules
4. WHEN a template fails to render THEN the system SHALL show the template name and error location
5. WHERE errors are recoverable THEN the system SHALL suggest corrective actions
