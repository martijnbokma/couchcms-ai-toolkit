# Framework-Specific Debugging Prompts

This directory is for **framework-specific debugging prompts** that extend the base debugging specialist.

## Adding Framework-Specific Prompts

When you have debugging prompts specific to a framework or CMS, add them here:

1. Create a file named `{framework}-{topic}.md`
2. Reference the base `../specialist.md` for general debugging principles
3. Focus on framework-specific error patterns and solutions

## Example Structure

```
framework/
├── README.md (this file)
├── nextjs-ssr.md           # Next.js server-side rendering issues
├── react-hooks.md          # React hooks debugging
├── vue-reactivity.md       # Vue reactivity debugging
├── couchcms-templates.md   # CouchCMS template parsing
├── alpinejs-colon.md       # Alpine.js colon syntax (strict parsers)
└── ...
```

## Template for Framework-Specific Prompts

```markdown
# [Framework] [Topic] Debugging

**Critical: Always follow project standards before generating any code.**

Look for project standards in:

- `project.md` (CouchCMS AI Toolkit - contains standards and configuration)
- `.project/ai/context.md` (optional detailed project context)
- Legacy: `standards.md` or `docs/standards.md` (older projects)

**Base**: This extends `prompts/debugging/specialist.md`

## Framework Context

[Describe the framework-specific context]

## Common Error Patterns

### Error Pattern 1

**Error Message**: [Specific error message]
**Root Cause**: [What causes this]
**Solution**: [How to fix it]

## Framework-Specific Tools

[List framework-specific debugging tools]

## Quick Reference

[Quick lookup table or checklist]
```

## Notes

- Keep base debugging prompts framework-agnostic
- Framework-specific prompts should extend, not replace, the base
- Reference `standards.md` for project-specific configurations
- Document any framework-specific tools or extensions needed
