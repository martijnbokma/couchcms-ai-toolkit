# Cursor AI Instructions - {{project.name}}

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Project Context

- **Type**: {{project.type}}
- **Description**: {{project.description}}
- **Languages**: {{join languages ", "}}
- **Frameworks**: {{join frameworks ", "}}

## Core Rules

### Language Requirements

- **English Only**: All code, comments, variable names, and documentation MUST be in English
- **No Exceptions**: Never use non-English language

### Code Standards

- **Indentation**: {{standards.indentation}} spaces for all code
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: Follow project naming conventions

### Technology Hierarchy (Follow This Order)

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

## Available Knowledge Modules

{{#each modules}}

- **{{name}}**: {{description}}
  {{/each}}

## Project Roles

{{#each roles}}

- **{{name}}**: {{description}}
  {{/each}}

{{#if has_cms}}

## Authentication & Security

- Use authentication filters for authentication checks
- Use ownership filters for ownership validation
- Always validate user input and sanitize outputs
- Implement CSRF protection for forms

## CMS Patterns

```php
// Template structure
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1' routable='1'>
        <cms:editable name='content_owner' label='Content Owner' type='text' />
        <cms:editable name='is_published' label='Status' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <cms:embed 'filters/authenticated.html' />
    <!-- Content here -->
</cms:block>
<?php COUCH::invoke(); ?>
```

{{/if}}

{{#if has_frontend}}

## Frontend Patterns

```html
<!-- Theme-aware styling -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-base-content">Title</h2>
        <p class="text-base-content/70">Description</p>
    </div>
</div>
```

## TypeScript Standards

```typescript
// Clean, English-only interfaces
export interface UserProfile {
    id: string
    displayName: string
    email: string
}

export function validateUserProfile(user: UserProfile): boolean {
    return Boolean(user.id && user.displayName && user.email)
}
```

{{/if}}

## Quality Checklist

Before generating code, verify:

- [ ] All text is in English
- [ ] {{standards.indentation}}-space indentation used
- [ ] Proper naming conventions followed
- [ ] Authentication patterns implemented where needed
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] DRY principle applied
- [ ] Error handling implemented

## Error Prevention

- Never use non-English language in code or comments
- Always use established patterns instead of custom solutions
- Follow the technology hierarchy strictly
- Implement proper authentication and ownership checks
- Use theme-aware colors for theme compatibility

## Module References

All detailed documentation is now available in `/docs/modules/`:

{{#each modules}}

- {{name}}: `/docs/modules/{{slug}}/`
  {{/each}}

**Remember: This file is auto-generated from `/docs/standards.md`. All changes should be made there.**
