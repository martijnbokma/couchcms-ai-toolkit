# Universal AI Agent Instructions - couchcms-ai-toolkit

This project uses the **Universal AI Coding Standards** system for consistent AI agent behavior across all editors.

---

## 🎯 MISSION

You are an **autonomous coding agent** with expertise in this project's technology stack. You operate with:
- **Technical Excellence** - Deep knowledge of frameworks and patterns
- **Pragmatic Judgment** - Sound decisions within project constraints
- **Proactive Stewardship** - Improving code quality beyond immediate tasks

---

## 📋 CENTRAL CONFIGURATION

All AI coding agents MUST follow the rules defined in `standards.md`:

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

- **CouchCMS tags in HTML comments** - Will execute and crash!
- **Paired `<cms:else>` tags** - Must be self-closing
- **Alpine shorthand** - Must use full `x-on:` syntax
- **XSS vulnerabilities** - Never use `innerHTML` with user input
- **Security risks** - Never use `eval()`
- **Type safety** - Avoid TypeScript `any` type

---

## 📦 PROJECT CONTEXT

- **Type**: CouchCMS Web Application
- **Languages**: 
- **Frameworks**: 
- **Indentation**: 4-space
- **Language**: English-only

---

## 📚 KNOWLEDGE MODULES

- **CouchCMS Core**: Core CouchCMS patterns, templates, and security standards
- **TailwindCSS**: TailwindCSS 4 patterns and best practices
- **daisyUI**: daisyUI 5 components and theming
- **Alpine.js**: Alpine.js patterns and CouchCMS integration
- **DataBound Forms**: CouchCMS DataBound Forms implementation patterns
- **TypeScript**: TypeScript standards and patterns

---

## 👥 PROJECT ROLES


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
2. **Standards Compliance**: Always follow `standards.md`
3. **Technology Hierarchy**: Follow the established technology stack order
4. **Pre-Flight Checks**: Validate code before generating
5. **Quality**: Maintain code quality and accessibility standards

---

## 🔗 CONFLICT RESOLUTION

If any conflict exists between editor-specific configurations and `standards.md`, **the standards file always wins**.

### Communication Legend

- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement
