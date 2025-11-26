# Editor-Specific AI Agent Templates

This directory contains optimized template files for configuring AI coding assistants in different code editors. These templates incorporate best practices from the framework documentation, including:

- **Operational Doctrine** - Reconnaissance → Plan → Execute → Verify → Report workflow
- **Smart Operations** - Slash commands, intent detection, communication modes
- **Pre-flight Checks** - Mandatory security and quality validation
- **Communication Legend** - Consistent status indicators (✅ ⚠️ 🚧 💡)

## Available Templates

| Template | Editor | Key Features |
|----------|--------|--------------|
| `claude.template.md` | Claude AI (Anthropic) | Full operational doctrine, detailed examples |
| `cursor.template.md` | Cursor IDE | Auto-loading rules integration, smart operations |
| `copilot.template.md` | GitHub Copilot | Suggestion validation, completion priorities |
| `codewhisperer.template.md` | Amazon CodeWhisperer | Generation validation, pattern blocking |
| `tabnine.template.md` | Tabnine AI | Completion validation, context awareness |
| `kiro.template.md` | Amazon Kiro IDE | Steering documents, always-included standards |
| `windsurf.template.md` | Windsurf IDE | Cascade capabilities, smart operations |
| `agent.template.md` | Universal base | Minimal core template for all agents |
| `roles.template.md` | Project roles | Role definitions and responsibilities |

## Template Structure

All optimized templates follow this consistent structure:

### 1. Header & Critical Reference
```markdown
# [Editor] AI Instructions - {{project.name}}

**Critical: Always follow `{{config_file_path}}` before generating any code.**
```

### 2. Operational Doctrine
- Mission statement
- Core workflow (Reconnaissance → Plan → Execute → Verify → Report)
- Clarification threshold (when to ask vs. act autonomously)

### 3. Smart Operations
- Slash commands (`/fix`, `/refactor`, `/review`, `/component`, `/view`, `/form`)
- Intent detection (automatic understanding of user goals)
- Communication modes (`/quick`, `/standard`, `/verbose`)

### 4. Pre-Flight Checks (MANDATORY)
- CRITICAL patterns (block generation)
- WARNING patterns (show warning)
- Security validations
- Report format

### 5. Code Standards
- Language requirements (English only)
- Formatting standards
- Technology hierarchy

### 6. Framework-Specific Sections (Conditional)
```handlebars
{{#if has_cms}}
## CMS Patterns
...
{{/if}}

{{#if has_frontend}}
## Frontend Patterns
...
{{/if}}
```

### 7. Quality Checklist & Anti-Patterns
- Pre-generation validation
- Common mistakes to avoid

### 8. Integration Notes
- Communication legend
- Quick reference

## Template Variables

All templates use Handlebars variables populated from the project configuration file:

### Project Information
- `{{project.name}}` - Project name
- `{{project.type}}` - Project type
- `{{project.description}}` - Project description

### Configuration File
- `{{config_file_path}}` - Path to project configuration file (e.g., `docs/standards.md`, `.project/standards.md`, `standards.md`, or `project.md`)

### Standards
- `{{standards.indentation}}` - Indentation spaces
- `{{standards.line_length}}` - Maximum line length
- `{{standards.naming.classes}}` - Class naming convention
- `{{standards.naming.php_files}}` - PHP file naming
- `{{standards.naming.typescript_files}}` - TypeScript file naming

### Conditional Sections
- `{{#if has_cms}}` - CouchCMS project
- `{{#if has_frontend}}` - Frontend with TailwindCSS/daisyUI

### Lists
- `{{#each tech_hierarchy}}` - Technology stack
- `{{#each modules}}` - Knowledge modules
- `{{#each roles}}` - Project roles

## Key Optimizations Applied

### 1. Operational Doctrine Integration
From `framework/01-core.md`:
- Reconnaissance before modification
- Read before write; reread after write
- Autonomous correction when solution is clear
- Clarification threshold guidelines

### 2. Smart Operations
From `framework/07-smart-operations.md`:
- Slash commands for common tasks
- Intent detection patterns
- Communication modes (quick/standard/verbose)
- Pre-flight check requirements

### 3. Pre-Flight Security Checks
Mandatory validation before code generation:

| Severity | Pattern | Action |
|----------|---------|--------|
| CRITICAL | CouchCMS tags in HTML comments | Block |
| CRITICAL | XSS vulnerabilities (innerHTML) | Block |
| CRITICAL | eval() usage | Block |
| CRITICAL | Alpine shorthand in CouchCMS | Block |
| WARNING | TypeScript 'any' type | Warn |
| WARNING | console.log in production | Warn |

### 4. Communication Legend
All templates use consistent status indicators:
- ✅ Success / Completed
- ⚠️ Warning / Self-corrected
- 🚧 Blocked / Needs attention
- 💡 Suggestion / Improvement

## Usage

### Automatic Generation

```bash
# Generate all editor configurations
bun run sync

# This creates:
# - .cursorrules (from cursor.template.md)
# - CLAUDE.md (from claude.template.md)
# - .github/copilot-instructions.md (from copilot.template.md)
# - etc.
```

### Manual Customization

To customize a template for your project:

1. Copy the template to your project's `ai-toolkit/templates/editors/` directory
2. Modify the template with project-specific patterns
3. The sync system will use your custom template instead of the shared one

## Related Documentation

- [Framework Core](../../framework/01-core.md) - Operational doctrine
- [Smart Operations](../../framework/07-smart-operations.md) - Slash commands and modes
- [Pre-flight Checks](../../preflight-checks.yaml) - Security patterns
- [AI Toolkit Documentation](../../docs/GETTING-STARTED.md)
- [Project Configuration](../project.md)
