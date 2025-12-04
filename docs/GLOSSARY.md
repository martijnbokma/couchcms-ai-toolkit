# Glossary

Definitions of technical terms used in the CouchCMS AI Toolkit documentation.

## A

### Agent
A specialized AI assistant focused on a specific development domain. For example, the `couchcms` agent provides guidance for CouchCMS template development, while the `tailwindcss` agent helps with styling. Agents are automatically selected based on your chosen modules.

**See also:** [Modules](#module)

## C

### Configuration File
The `standards.md` file (located at `config/standards.md` by default) that contains your project configuration. This file uses YAML frontmatter for settings and Markdown for project-specific rules. It's the "single source of truth" - all AI configurations are generated from this file.

**See also:** [Standards.md](#standardsmd), [YAML Frontmatter](#yaml-frontmatter)

### Context Directory
An optional directory (`config/context/`) for extensive project documentation organized by topic.

**Purpose:** Helps AI agents understand your project by providing detailed documentation separated from configuration.

**When to use:**
- Your `standards.md` exceeds 1000 lines
- You have extensive architecture or domain documentation
- Multiple team members maintain different aspects of documentation
- You want to separate configuration from detailed documentation

**Best practices:**
- Start with everything in `standards.md` - most projects don't need context files
- Organize by topic: `architecture.md`, `patterns.md`, `workflows.md`, etc.
- Keep `standards.md` focused on configuration and core rules
- Don't create context files prematurely - only when `standards.md` becomes unwieldy

**Example structure:**
```
config/
├── standards.md          # Configuration and core rules
└── context/              # Detailed documentation (optional)
    ├── architecture.md   # System architecture
    ├── patterns.md      # Coding patterns
    └── workflows.md     # Development workflows
```

## F

### Framework (AAPF)
The Autonomous Agent Prompting Framework provides structured, evidence-first operational principles for AI agents. It's optional and mainly useful for complex projects with multiple developers. For most projects, you can leave this disabled.

**Options:**
- **Full**: Doctrine + directives + playbooks + enhancements
- **Standard**: Doctrine + directives + playbooks
- **Minimal**: Doctrine + directives only
- **Disabled**: No framework (default for Simple Creator)

## G

### Git Submodule
A way to include one Git repository as a subdirectory of another Git repository. The toolkit is typically added as a git submodule in the `ai-toolkit-shared/` directory. This allows you to track a specific version of the toolkit in your project.

**Common commands:**
- Add submodule: `git submodule add https://github.com/martijnbokma/couchcms-ai-toolkit.git ai-toolkit-shared`
- Initialize: `git submodule update --init --recursive`
- Update: `cd ai-toolkit-shared && git pull origin master && cd ..`

## M

### Module
A knowledge package that teaches AI assistants about specific technologies or frameworks. For example, the `tailwindcss` module contains patterns and best practices for TailwindCSS, while the `couchcms-core` module contains CouchCMS-specific patterns.

**Difference from Agents:**
- **Modules**: Provide knowledge and patterns to AI assistants
- **Agents**: Specialized AI assistants that use module knowledge

**See also:** [Agent](#agent)

## S

### Standards.md
The configuration file (`.project/standards.md`) that contains your project settings. It uses YAML frontmatter for configuration and Markdown for project-specific rules. This is the single source of truth for all AI agent configurations.

**Structure:**
```yaml
---
name: "my-project"
toolkit: "./ai-toolkit-shared"
modules:
  - couchcms-core
  - tailwindcss
agents:
  - couchcms
  - tailwindcss
---

# Project-Specific Rules

Your custom rules and documentation here...
```

**See also:** [Configuration File](#configuration-file), [YAML Frontmatter](#yaml-frontmatter)

### Sync
The process of generating AI configuration files (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, etc.) from your `standards.md` file. Run `bun ai-toolkit-shared/scripts/cli/sync.js` after making changes to `standards.md`.

**When to sync:**
- After creating or modifying `standards.md`
- After adding or removing modules/agents
- After changing project-specific rules

## Y

### YAML Frontmatter
The YAML section at the top of `standards.md` (between `---` markers) that contains configuration settings. This is where you specify modules, agents, toolkit path, and other settings.

**Example:**
```yaml
---
name: "my-project"
toolkit: "./ai-toolkit-shared"
modules:
  - couchcms-core
  - tailwindcss
---
```

**Common YAML errors:**
- Wrong indentation (must use spaces, not tabs)
- Missing quotes around strings with special characters
- Trailing commas in lists
- Mixed tabs and spaces

**See also:** [Standards.md](#standardsmd)

## Common Terms

### CouchCMS
A PHP-based content management system. The toolkit is specifically designed for CouchCMS projects.

### TailwindCSS
A utility-first CSS framework. The `tailwindcss` module provides TailwindCSS 4 patterns and best practices.

### daisyUI
A component library built on TailwindCSS. The `daisyUI` module provides daisyUI 5 component patterns.

### Alpine.js
A lightweight JavaScript framework. The `alpinejs` module provides Alpine.js integration patterns with CouchCMS.

### TypeScript
A typed superset of JavaScript. The `typescript` module provides TypeScript standards and patterns.

---

**Need more help?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.
