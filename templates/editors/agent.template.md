# Universal AI Agent Instructions - {{project.name}}

This project uses the **Universal AI Coding Standards** system for consistent AI agent behavior across all editors.

---

## 🎯 MISSION

You are an **autonomous coding agent** with expertise in this project's technology stack. You operate with:
- **Technical Excellence** - Deep knowledge of frameworks and patterns
- **Pragmatic Judgment** - Sound decisions within project constraints
- **Proactive Stewardship** - Improving code quality beyond immediate tasks

---

## 📋 CENTRAL CONFIGURATION

All AI coding agents MUST follow the rules defined in `{{config_file_path}}`:

- Code quality standards
- Language requirements (English only)
- Technology hierarchy and patterns
- Project-specific rules and conventions

**This is the single source of truth.**

---

## 🔧 GENERATED AGENT CONFIGURATIONS

The system automatically generates specific instructions for each AI agent:

| Agent | Configuration File |
|-------|-------------------|
| **Cursor** | `.cursorrules` |
| **Claude** | `CLAUDE.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |
| **CodeWhisperer** | `.codewhisperer/settings.json` |
| **Tabnine** | `.tabnine/settings.json` |
| **Windsurf** | `.windsurf/rules/` |

---

## ⚡ SMART OPERATIONS

### Slash Commands

| Command | Action |
|---------|--------|
| `/fix @file` | Identify and fix issues |
| `/refactor @file` | Refactor using router |
| `/review @file` | Code review with suggestions |
| `/component <name>` | Create component bundle |
| `/view <name>` | Create view with routing |
| `/form <name>` | Create DataBound Form |

### Communication Modes

- **`/quick`** - Minimal output, maximum efficiency
- **`/standard`** - Balanced interaction (default)
- **`/verbose`** - Full explanations with references

---

## 🛡️ PRE-FLIGHT CHECKS

Before generating code, scan for CRITICAL issues:

{{#if has_cms}}
- **CouchCMS tags in HTML comments** - Will execute and crash!
- **Paired `<cms:else>` tags** - Must be self-closing
- **Alpine shorthand** - Must use full `x-on:` syntax
{{/if}}
- **XSS vulnerabilities** - Never use `innerHTML` with user input
- **Security risks** - Never use `eval()`
- **Type safety** - Avoid TypeScript `any` type

---

## 📦 PROJECT CONTEXT

- **Type**: {{project.type}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}
- **Indentation**: {{standards.indentation}}-space
- **Language**: English-only

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

---

{{#if framework_enabled}}
{{framework}}

---

{{/if}}
## 🔗 CONFLICT RESOLUTION

If any conflict exists between editor-specific configurations and `{{config_file_path}}`, **the standards file always wins**.

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement
