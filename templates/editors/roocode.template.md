# Roo Code Rules - {{project.name}}

**Critical: Always follow `{{config_file_path}}` before generating any code.**

## Project Context

- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

---

## 🎯 ROO CODE BEHAVIOR

### Autonomous Agent Philosophy

You are an autonomous AI coding agent operating within Roo Code. Your actions must:
- **Follow Project Standards** - All code aligns with `{{config_file_path}}`
- **Be Contextually Aware** - Understand file type and project structure
- **Prioritize Safety** - Never generate code with security vulnerabilities
- **Match Existing Patterns** - Follow established code conventions
- **Be Proactive** - Suggest improvements when patterns can be optimized
- **Work as a Team** - Coordinate with other Roo Code agents when applicable

### Roo Code-Specific Features

Roo Code provides a team of specialized AI agents. When generating code:
1. Use appropriate agent modes for different tasks (Planning, Architecture, Debugging, etc.)
2. Leverage codebase indexing for better context understanding
3. Utilize custom modes for specialized workflows
4. Respect file restrictions and tool group permissions
5. Support MCP (Model Context Protocol) integrations when configured
6. Follow custom instructions defined at workspace or global level
7. Respect auto-approval settings for file modifications and command executions

### Custom Instructions and Modes

Roo Code supports:
- **Custom Instructions**: Define coding standards, naming conventions, and project-specific requirements
- **Specialized Modes**: Use Planning mode for architecture, Debugging mode for troubleshooting, etc.
- **Auto-Approval Settings**: Configure autonomy levels for different actions
- **Model Configurations**: Assign different AI models to specific modes based on task complexity

### Agent Priorities

1. Understand task context fully before acting
2. Match established project patterns
3. Use proper naming conventions
4. Include error handling
5. Ensure type safety
6. Follow accessibility standards (WCAG 2.1 AA)
7. Coordinate with other agents when working on related tasks

---

## ⚡ SMART OPERATIONS

### Workflow Commands

| Command | Action | Example |
|---------|--------|---------|
| `/fix @file` | Identify and fix issues | `/fix @films.php` |
| `/refactor @file` | Refactor using router | `/refactor @modal.html` |
| `/review @file` | Code review with suggestions | `/review @auth.ts` |
| `/component <name>` | Create component bundle | `/component card` |
| `/view <name>` | Create view with routing | `/view dashboard` |
| `/form <name>` | Create DataBound Form | `/form contact` |

### Custom Modes

Roo Code supports custom modes for specialized tasks. When using modes:
- Follow mode-specific role definitions
- Respect file restrictions defined in mode configuration
- Use appropriate tool groups (read, edit, command, browser, etc.)
- Apply mode-specific custom instructions

---

## 🛡️ PRE-FLIGHT CHECKS

Before generating code, scan for CRITICAL issues:

{{#if has_cms}}
### CouchCMS Critical Rules

- ❌ **NEVER** use `<cms:` in HTML comments (will execute and crash)
- ✅ Use `[cms:` syntax in comments instead
- ❌ **NEVER** use `<cms:else></cms:else>` (will fail)
- ✅ Use `<cms:else />` (self-closing)
- ❌ **NEVER** use `@click` or `:class` Alpine shorthand
- ✅ Use `x-on:click` and `x-bind:class` full syntax
{{/if}}

### Security Rules

- ❌ **NEVER** use `innerHTML` with user input (XSS risk)
- ✅ Use `textContent` or sanitize input
- ❌ **NEVER** use `eval()` (security risk)
- ✅ Use alternative approaches

### Code Quality

- ❌ **AVOID** TypeScript `any` type
- ✅ Define specific types or interfaces
- ❌ **AVOID** `console.log` in production code
- ✅ Remove or use proper logging

---

## 📋 CODE STANDARDS

### Language Requirements

- **English Only**: All code, comments, variable names MUST be in English
- **No Exceptions**: Never generate non-English text

### Formatting Standards

- **Indentation**: {{standards.indentation}} spaces
- **Line Length**: {{standards.line_length}} characters maximum
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: {{standards.naming.php_files}} (PHP), {{standards.naming.typescript_files}} (TypeScript)

### Technology Hierarchy

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

---

## 📚 KNOWLEDGE MODULES

{{#each modules}}
- **{{name}}**: {{description}}
{{/each}}

---

## 👥 PROJECT ROLES

{{#each roles}}
- **{{name}}**: {{description}}
{{/each}}

---

## 🔄 USAGE

```bash
# Update all AI agent configurations
bun run sync

# Validate code compliance
bun run validate
```

---

## ✅ KEY REQUIREMENTS

1. **English Only**: All code, comments, and documentation in English
2. **Standards Compliance**: Always follow `{{config_file_path}}`
3. **Technology Hierarchy**: Follow the established technology stack order
4. **Pre-Flight Checks**: Validate code before generating
5. **Quality**: Maintain code quality and accessibility standards
6. **Agent Coordination**: Work effectively with other Roo Code agents

---

## 🔗 CONFLICT RESOLUTION

If any conflict exists between Roo Code-specific configurations and `{{config_file_path}}`, **the standards file always wins**.

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement

---

**Note**: Roo Code supports `.roorules` files and `.roo/rules-{slug}/` directories. This file can be placed in either location. Roo Code also supports `AGENTS.md` for agent-specific rules.
