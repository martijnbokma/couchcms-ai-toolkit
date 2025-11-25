# Editor-Specific AI Agent Templates

This directory contains template files for configuring AI coding assistants in different code editors. These templates use Handlebars syntax (`{{variable}}`) and are designed to be processed by the AI toolkit's sync system.

## Available Templates

- **claude.template.md** - Instructions for Claude AI (Anthropic)
- **cursor.template.md** - Configuration for Cursor IDE
- **copilot.template.md** - Instructions for GitHub Copilot
- **codewhisperer.template.md** - Rules for Amazon CodeWhisperer
- **tabnine.template.md** - Configuration for Tabnine AI
- **windsurf.template.md** - Rules for Windsurf IDE
- **agent.template.md** - Universal agent instructions (base template)
- **roles.template.md** - Project roles definition template

## Template Variables

All templates use the following Handlebars variables that are populated from `project.md`:

### Project Information

- `{{project.name}}` - Project name
- `{{project.type}}` - Project type (e.g., "couchcms-webapp")
- `{{project.description}}` - Project description

### Standards

- `{{standards.indentation}}` - Indentation spaces (typically 4)
- `{{standards.line_length}}` - Maximum line length
- `{{standards.naming.php_variables}}` - PHP variable naming convention
- `{{standards.naming.typescript_variables}}` - TypeScript variable naming convention
- `{{standards.naming.classes}}` - Class naming convention
- `{{standards.naming.php_files}}` - PHP file naming convention
- `{{standards.naming.typescript_files}}` - TypeScript file naming convention

### Technology Stack

- `{{languages | join(", ")}}` - Comma-separated list of languages
- `{{frameworks | join(", ")}}` - Comma-separated list of frameworks
- `{{#each tech_hierarchy}}` - Loop through technology hierarchy
- `{{#each modules}}` - Loop through knowledge modules
- `{{#each roles}}` - Loop through project roles

## Framework-Specific Sections

Templates may include framework-specific sections (e.g., CouchCMS, TailwindCSS, Alpine.js). These sections are marked as optional and can be:

1. **Removed** if the project doesn't use that framework
2. **Customized** to match the project's specific framework
3. **Extended** with additional framework-specific patterns

## Usage

### Automatic Generation

The AI toolkit sync system automatically generates editor-specific configuration files from these templates:

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

If you need to customize a template for your project:

1. Copy the template to your project's `ai-toolkit/templates/editors/` directory
2. Modify the template with project-specific patterns
3. The sync system will use your custom template instead of the shared one

## Template Structure

Each editor template follows this structure:

1. **Header** - Editor name and critical reminder about standards.md
2. **Project Context** - Project information from variables
3. **Core Rules** - Language requirements, code standards, naming conventions
4. **Technology Patterns** - Framework-specific patterns (optional)
5. **Quality Checklist** - Verification steps before code generation
6. **Anti-Patterns** - Common mistakes to avoid
7. **Integration Notes** - How the template integrates with the system

## Framework-Agnostic Approach

These templates are designed to be **framework-agnostic** where possible:

- Framework-specific sections are clearly marked
- Technology hierarchy is populated from project configuration
- Patterns use placeholders that adapt to the project's stack
- Examples are generic and can be customized per project

## Contributing

When adding new editor templates:

1. Follow the existing template structure
2. Use Handlebars variables for all dynamic content
3. Mark framework-specific sections clearly
4. Include quality checklists and anti-patterns
5. Add the editor to this README
6. Test with the sync system

## Related Documentation

- [AI Toolkit Documentation](../../docs/GETTING-STARTED.md)
- [Agent Templates](../../templates/agent-template.md)
- [Project Configuration](../../templates/project.md)
