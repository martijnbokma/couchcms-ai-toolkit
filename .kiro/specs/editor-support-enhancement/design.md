# Design Document - Editor Support Enhancement

## Overview

This feature enhances editor support by implementing official configuration structures for Cursor and Claude Code. The implementation adds:

1. **Cursor MDC Rules** - Context-aware rules in `.cursor/rules/*.mdc`
2. **Claude Code Skills** - Modular knowledge in `.claude/skills/*.md`
3. **Claude Code Settings** - Permissions and config in `.claude/settings.json`
4. **Memory Files** - `CLAUDE.md` for startup context
5. **Agent Documentation** - `AGENTS.md` listing available agents

## Architecture

### Current Architecture

```
sync.js
  ├─> config-loader.js (load standards.md)
  ├─> module-loader.js (load modules/agents)
  ├─> template-engine.js (render templates)
  └─> file-writer.js (write configs)
```

### Enhanced Architecture

```
sync.js
  ├─> config-loader.js (load standards.md)
  ├─> module-loader.js (load modules/agents)
  ├─> template-engine.js (render templates + skills)
  ├─> file-writer.js (write configs + copy rules)
  └─> skill-generator.js (NEW - generate Claude Skills)
```

## Components and Interfaces

### 1. Skill Generator Module

**Purpose:** Generate Claude Code Skills from modules and agents

**Interface:**
```javascript
/**
 * Generate Claude Code Skill from module/agent
 * @param {object} source - Module or agent object
 * @param {string} type - 'module' or 'agent'
 * @returns {object} - { filename, content }
 */
export function generateSkill(source, type)

/**
 * Generate all Skills for active modules and agents
 * @param {Array} modules - Active modules
 * @param {Array} agents - Active agents
 * @returns {Map} - Map of filename → content
 */
export function generateAllSkills(modules, agents)
```

### 2. Rules Copier Module

**Purpose:** Copy MDC rules from toolkit to project

**Interface:**
```javascript
/**
 * Copy MDC rules from toolkit to project
 * @param {string} toolkitPath - Toolkit root
 * @param {string} projectDir - Project root
 * @returns {Array} - List of copied files
 */
export function copyMdcRules(toolkitPath, projectDir)
```

### 3. Enhanced Template Engine

**Additions:**
- Support for `agents-doc` template type (generates AGENTS.md)
- Support for `claude-settings` template type (generates settings.json)

### 4. Enhanced File Writer

**Additions:**
- Create parent directories automatically
- Handle JSON file writing
- Track directory creation stats

## Data Models

### Skill File Structure

```yaml
---
name: module-name
description: Brief description of what this skill provides
allowed-tools: Read, Write, Bash, Grep
---

# Module Name

[Module content here]
```

### Claude Settings Structure

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(bun run *)",
      "Read(~/.config/**)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf *)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

### AGENTS.md Structure

```markdown
# Available AI Agents

## Daily Development Agents

### @couchcms
Description of CouchCMS agent
Usage: `@couchcms help with templates`

### @tailwindcss
Description of TailwindCSS agent
Usage: `@tailwindcss style this component`

## Specialized Agents

[...]
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: MDC Rules Preservation
*For any* MDC file in `toolkit/rules/*.mdc`, copying it to `.cursor/rules/*.mdc` should preserve its YAML frontmatter and content exactly
**Validates: Requirements 1.2**

### Property 2: Skill Generation Completeness
*For any* active module or agent, a corresponding Skill file should be generated in `.claude/skills/`
**Validates: Requirements 2.1, 2.2**

### Property 3: Directory Creation Idempotence
*For any* file path with directories, creating parent directories multiple times should result in the same directory structure
**Validates: Requirements 7.1, 7.4**

### Property 4: Settings JSON Validity
*For any* generated `.claude/settings.json`, parsing it as JSON should succeed without errors
**Validates: Requirements 3.2, 3.3, 3.4**

### Property 5: Cleanup Completeness
*For any* generated editor file, running cleanup should remove it from the project
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

## Error Handling

### File System Errors
- **Directory creation fails**: Log error, skip file, continue with others
- **File write fails**: Log error, add to error stats, continue
- **Permission denied**: Log clear error with suggested fix

### Template Errors
- **Template not found**: Log warning, skip that editor, continue
- **Template render fails**: Log error with template name, skip editor
- **Invalid template data**: Log error with missing fields, skip editor

### Validation Errors
- **Module not found**: Log error, list available modules, exit
- **Agent not found**: Log error, list available agents, exit
- **Invalid toolkit path**: Log error with path, suggest fixes, exit

## Testing Strategy

### Unit Tests
- Test Skill generation with sample module/agent data
- Test MDC file copying with various file structures
- Test settings.json generation with different permission configs
- Test AGENTS.md generation with various agent lists
- Test directory creation with nested paths

### Property-Based Tests
- **Library**: fast-check (already in devDependencies)
- **Minimum iterations**: 100 per property
- **Tag format**: `**Feature: editor-support-enhancement, Property {number}: {property_text}**`

Each property test should:
1. Generate random valid inputs
2. Execute the operation
3. Verify the property holds
4. Report any failures with counterexamples

## Implementation Notes

### Cursor MDC Rules
- Copy all `.mdc` files from `toolkit/rules/` to project `.cursor/rules/`
- Preserve file structure and content exactly
- MDC files have YAML frontmatter with `globs` and `description`
- These rules auto-activate based on file patterns

### Claude Code Skills
- Generate one Skill per module in `.claude/skills/`
- Generate one Skill per agent in `.claude/skills/`
- Skills use YAML frontmatter with `name`, `description`, `allowed-tools`
- Skills are auto-loaded by Claude Code at startup

### Claude Code Settings
- Generate `.claude/settings.json` with sensible defaults
- Include deny rules for sensitive files (.env, secrets)
- Include allow rules for common dev commands (npm, bun)
- Support custom permissions from config if specified

### CLAUDE.md Memory File
- Use existing `claude.template.md` template
- Include all modules and agents
- Include project-specific rules
- This is loaded at Claude Code startup

### AGENTS.md Documentation
- Create new `agents-doc.template.md` template
- List all active agents with descriptions
- Group by type (daily, specialized, framework)
- Include usage examples

## Performance Considerations

- Copy MDC rules in parallel
- Generate Skills in parallel
- Use existing caching in file-writer
- Minimize file system operations

## Backward Compatibility

- Existing projects continue to work
- Old `CLAUDE.md` format still supported
- Gradual migration path
- No breaking changes to config format
