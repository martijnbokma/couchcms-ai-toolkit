# Requirements Document - Editor Support Enhancement

## Introduction

This feature enhances the toolkit's editor support to fully leverage the capabilities of Cursor and Claude Code by implementing their official configuration structures. Currently, the toolkit generates basic config files but misses key features like context-aware rules for Cursor and Skills for Claude Code.

## Glossary

- **Cursor**: AI-powered code editor that supports `.cursorrules` (global) and `.cursor/rules/*.mdc` (context-aware)
- **Claude Code**: Anthropic's CLI coding tool that uses `.claude/settings.json` and `.claude/skills/*.md`
- **MDC Files**: Model-driven Component files with YAML frontmatter for context-aware rules
- **Skills**: Claude Code's modular knowledge units stored as markdown files with YAML frontmatter
- **CLAUDE.md**: Memory file that Claude Code loads at startup with instructions and context
- **Settings JSON**: Configuration file for permissions, environment variables, and tool behavior
- **AGENTS.md**: Documentation file listing all available agents and their purposes
- **Template Engine**: System that renders editor-specific configurations from toolkit data
- **File Writer**: System that writes generated configurations to disk

## Requirements

### Requirement 1: Cursor Context-Aware Rules

**User Story:** As a developer using Cursor, I want context-aware rules that automatically apply based on file patterns, so that I get relevant AI assistance for different file types.

#### Acceptance Criteria

1. WHEN the sync script runs THEN the System SHALL copy all MDC files from `rules/*.mdc` to `.cursor/rules/*.mdc`
2. WHEN an MDC file is copied THEN the System SHALL preserve its YAML frontmatter including globs and description
3. WHEN the `.cursor/rules/` directory does not exist THEN the System SHALL create it before copying files
4. WHEN MDC files are updated in the toolkit THEN the System SHALL overwrite existing files in the project
5. WHEN the cleanup function runs THEN the System SHALL remove all `.cursor/rules/*.mdc` files

### Requirement 2: Claude Code Skills Structure

**User Story:** As a developer using Claude Code, I want Skills generated for each module and agent, so that Claude can access specialized knowledge contextually.

#### Acceptance Criteria

1. WHEN the sync script runs THEN the System SHALL generate `.claude/skills/{module-name}.md` for each active module
2. WHEN the sync script runs THEN the System SHALL generate `.claude/skills/{agent-name}.md` for each active agent
3. WHEN a Skill file is generated THEN the System SHALL include YAML frontmatter with name, description, and allowed-tools
4. WHEN a Skill file is generated THEN the System SHALL include the module/agent content as the body
5. WHEN the `.claude/skills/` directory does not exist THEN the System SHALL create it before generating files

### Requirement 3: Claude Code Settings Configuration

**User Story:** As a developer using Claude Code, I want a settings.json file that configures permissions and environment, so that Claude operates within project constraints.

#### Acceptance Criteria

1. WHEN the sync script runs THEN the System SHALL generate `.claude/settings.json` with permissions configuration
2. WHEN generating settings THEN the System SHALL include deny rules for sensitive files (.env, secrets)
3. WHEN generating settings THEN the System SHALL include allow rules for common development commands
4. WHEN generating settings THEN the System SHALL include environment variables if specified in config
5. WHEN the `.claude/` directory does not exist THEN the System SHALL create it before generating settings

### Requirement 4: Claude Code Memory File

**User Story:** As a developer using Claude Code, I want a CLAUDE.md memory file with project instructions, so that Claude loads context at startup.

#### Acceptance Criteria

1. WHEN the sync script runs THEN the System SHALL generate `CLAUDE.md` in the project root
2. WHEN generating CLAUDE.md THEN the System SHALL use the claude.template.md template
3. WHEN generating CLAUDE.md THEN the System SHALL include all active modules and agents
4. WHEN generating CLAUDE.md THEN the System SHALL include project-specific rules from standards.md
5. WHEN CLAUDE.md exists THEN the System SHALL overwrite it with updated content

### Requirement 5: Agents Documentation File

**User Story:** As a developer, I want an AGENTS.md file documenting all available agents, so that I know which agents to invoke for different tasks.

#### Acceptance Criteria

1. WHEN the sync script runs THEN the System SHALL generate `AGENTS.md` in the project root
2. WHEN generating AGENTS.md THEN the System SHALL list all active agents with their descriptions
3. WHEN generating AGENTS.md THEN the System SHALL group agents by type (daily, specialized, framework)
4. WHEN generating AGENTS.md THEN the System SHALL include usage examples for each agent
5. WHEN no agents are active THEN the System SHALL generate AGENTS.md with a "no agents configured" message

### Requirement 6: Template Engine Enhancement

**User Story:** As a developer, I want the template engine to support Skills generation, so that Claude Code receives properly formatted knowledge modules.

#### Acceptance Criteria

1. WHEN rendering templates THEN the System SHALL support a new 'claude-skill' template type
2. WHEN rendering a Skill THEN the System SHALL generate YAML frontmatter with required fields
3. WHEN rendering a Skill THEN the System SHALL include module/agent content in the body
4. WHEN rendering multiple Skills THEN the System SHALL process them in parallel for performance
5. WHEN a Skill template is missing THEN the System SHALL log a warning and continue

### Requirement 7: File Writer Enhancement

**User Story:** As a developer, I want the file writer to handle directory structures, so that nested config files are created correctly.

#### Acceptance Criteria

1. WHEN writing a file with a directory path THEN the System SHALL create all parent directories
2. WHEN writing to `.cursor/rules/` THEN the System SHALL create the directory if it doesn't exist
3. WHEN writing to `.claude/skills/` THEN the System SHALL create the directory if it doesn't exist
4. WHEN writing multiple files to the same directory THEN the System SHALL create the directory once
5. WHEN a directory creation fails THEN the System SHALL log an error and skip that file

### Requirement 8: Configuration Validation

**User Story:** As a developer, I want validation for editor configurations, so that I catch errors before generating files.

#### Acceptance Criteria

1. WHEN validating config THEN the System SHALL check that toolkit path exists
2. WHEN validating config THEN the System SHALL check that all specified modules exist
3. WHEN validating config THEN the System SHALL check that all specified agents exist
4. WHEN validation fails THEN the System SHALL display clear error messages
5. WHEN validation passes THEN the System SHALL proceed with file generation

### Requirement 9: Cleanup Enhancement

**User Story:** As a developer, I want cleanup to remove all generated editor files, so that I can start fresh when needed.

#### Acceptance Criteria

1. WHEN cleanup runs THEN the System SHALL remove `.cursor/rules/*.mdc` files
2. WHEN cleanup runs THEN the System SHALL remove `.claude/skills/*.md` files
3. WHEN cleanup runs THEN the System SHALL remove `.claude/settings.json`
4. WHEN cleanup runs THEN the System SHALL remove `CLAUDE.md`
5. WHEN cleanup runs THEN the System SHALL remove `AGENTS.md`

### Requirement 10: Documentation Update

**User Story:** As a developer, I want updated documentation explaining the new editor features, so that I understand what files are generated and why.

#### Acceptance Criteria

1. WHEN documentation is updated THEN the System SHALL explain Cursor's context-aware rules
2. WHEN documentation is updated THEN the System SHALL explain Claude Code's Skills system
3. WHEN documentation is updated THEN the System SHALL provide examples of generated files
4. WHEN documentation is updated THEN the System SHALL explain the file structure
5. WHEN documentation is updated THEN the System SHALL include troubleshooting tips
