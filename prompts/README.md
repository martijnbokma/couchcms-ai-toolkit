# Prompts

Reusable AI prompts for common tasks in CouchCMS projects.

## Directory Structure

```
prompts/
├── best-practices/     # Coding best practices
│   ├── claude-code.md  # Claude AI best practices
│   ├── javascript.md   # JavaScript patterns
│   ├── typescript.md   # TypeScript patterns
│   ├── performance.md  # Performance optimization
│   └── security.md     # Security guidelines
│
├── debugging/          # Debug and troubleshoot
│   ├── alpine-colon.md # Alpine.js colon syntax fix
│   ├── specialist.md   # General debugging
│   └── couchcms/       # CouchCMS-specific
│       ├── conditional-checker.md
│       ├── logic-errors.md
│       ├── safety-checker.md
│       └── set-errors.md
│
├── validators/         # Code validation
│   ├── design.md       # Design system validation
│   ├── links.md        # Link validation
│   ├── prompts.md      # Prompt validation
│   ├── responsive.md   # Responsive design check
│   └── standards.md    # Standards compliance
│
└── refactoring/        # Refactoring guides
    ├── design-preserving.md
    ├── functionality-preserving.md
    └── design-system/
        ├── basic.md
        └── complex.md
```

## Usage

Reference prompts in your conversations:

```
@prompts/debugging/alpine-colon.md Fix this Alpine.js issue
```

Or use content in custom rules/agents.

## Adding New Prompts

1. Create `.md` file in appropriate directory
2. Use clear, actionable instructions
3. Include examples where helpful
4. Keep prompts focused on one task
