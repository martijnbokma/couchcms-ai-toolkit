# Prompts

Reusable AI prompts for common development tasks. These prompts are **framework-agnostic** and work with any project that has a `project.md` configuration file (or legacy `standards.md`).

## Directory Structure

```
prompts/
├── best-practices/     # Coding best practices
│   ├── claude-code-best-practices.md  # Claude AI interaction best practices
│   ├── javascript-best-practices.md   # JavaScript patterns and guidelines
│   ├── typescript-best-practices.md   # TypeScript patterns and guidelines
│   ├── performance-best-practices.md  # Performance optimization strategies
│   └── security-best-practices.md     # Security guidelines and practices
│
├── debugging/          # Debug and troubleshoot
│   ├── specialist.md   # General debugging specialist
│   └── framework/      # Framework-specific debugging (optional)
│       └── README.md   # How to add framework-specific prompts
│
├── validators/         # Code validation
│   ├── design.md       # Design system validation
│   ├── links.md        # Link validation
│   ├── prompts.md      # Prompt validation
│   ├── responsive.md   # Responsive design check
│   └── standards.md    # Standards compliance (universal)
│
└── refactoring/        # Refactoring guides
    ├── design-preserving.md      # Refactor without changing design
    └── functionality-preserving.md # Refactor without changing behavior
```

## Usage

### Reference in Conversations

```
@prompts/debugging/specialist.md Help debug this issue
@prompts/best-practices/typescript-best-practices.md Review this TypeScript code
```

### Use in Custom Rules/Agents

Copy content from prompts into your custom rules or agent configurations.

### With project.md

All prompts automatically reference `project.md` as the single source of truth. Ensure your project has a properly configured `project.md` file (or legacy `standards.md`).

## Key Principles

1. **Universal Compatibility**: Prompts work with any technology stack
2. **Standards-First**: All prompts reference `project.md` for project-specific rules
3. **Framework-Agnostic**: Base prompts contain no framework-specific code
4. **Extensible**: Add framework-specific prompts in dedicated subdirectories

## Adding New Prompts

### Universal Prompts

1. Create `.md` file in appropriate directory
2. Start with: `**Critical: Always follow project standards before generating any code.**` (with location guidance)
3. Use clear, actionable instructions
4. Reference `project.md` for project-specific configuration
5. Include examples using placeholder syntax: `[FRAMEWORK_FROM_STANDARDS]`
6. Keep prompts focused on one task

### Framework-Specific Prompts

1. Create subdirectory named after framework (e.g., `debugging/nextjs/`)
2. Add `README.md` explaining the framework-specific prompts
3. Prefix files with framework name (e.g., `nextjs-ssr-debugging.md`)
4. Reference base prompts where applicable

## Placeholder Syntax

Use these placeholders in prompts for standards-aware content:

- `[FRAMEWORK_FROM_STANDARDS]` - Primary framework
- `[STYLING_FROM_STANDARDS]` - CSS framework/approach
- `[LANGUAGES_FROM_STANDARDS]` - Project languages
- `[BUILD_TOOLS_FROM_STANDARDS]` - Build tooling
- `[BACKEND_FROM_STANDARDS]` - Backend/CMS system
- `[ACCESSIBILITY_FROM_STANDARDS]` - Accessibility requirements

## Integration with AI Toolkit

These prompts integrate with the Universal AI Development Toolkit:

- **Agents**: Use prompts as foundations for specialized agents
- **Modules**: Reference module documentation from prompts
- **Rules**: Generate IDE rules based on prompt patterns
- **Validation**: Use `validators/standards.md` to check prompt quality
