# GitHub Copilot Instructions - {{project.name}}

**Critical: Always validate against `/docs/standards.md` before suggesting code.**

## Project Configuration

- **Project**: {{project.name}} ({{project.type}})
- **Languages**: {{languages | join(", ")}}
- **Frameworks**: {{frameworks | join(", ")}}

## Code Standards

### Language Requirements

- **English Only**: All code, comments, and documentation must be in English
- **No Exceptions**: Never suggest non-English text

### Formatting Standards

- **Indentation**: {{standards.indentation}} spaces (never tabs)
- **Line Length**: {{standards.line_length}} characters maximum
- **Naming Conventions**:
    - Variables: Follow language-specific conventions
    - Classes: {{standards.naming.classes}}
    - Files: Follow project naming conventions

{{#if has_cms}}

## Technology Patterns

### CMS Templates

When suggesting CMS code, always include:

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Template Name' clonable='1'>
        <cms:editable name='content_owner' type='text' />
        <cms:editable name='is_published' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<?php COUCH::invoke(); ?>
```

### Authentication Patterns

Always suggest proper authentication:

```php
<!-- Check authentication first -->
<cms:embed 'filters/authenticated.html' />

<!-- Check ownership for sensitive operations -->
<cms:if authenticated='1'>
    <!-- Protected content -->
</cms:if>
```

{{/if}}

{{#if has_frontend}}

### Frontend Components

Suggest theme-aware styling:

```html
<!-- Good: Theme-compatible -->
<div class="card bg-base-100">
    <h2 class="card-title text-base-content">English Title</h2>
    <p class="text-base-content/70">English description</p>
</div>
```

### TypeScript Services

Suggest clean, English-named interfaces:

```typescript
export interface UserProfile {
    id: string
    displayName: string
    emailAddress: string
}

export function validateUserProfile(profile: UserProfile): boolean {
    return Boolean(profile.id && profile.displayName && profile.emailAddress)
}
```

{{/if}}

## Suggestion Guidelines

### High Priority Suggestions

1. **English Language**: Correct any non-English text immediately
2. **Indentation**: Fix incorrect spacing (must be {{standards.indentation}} spaces)
3. **Security**: Add authentication checks for sensitive operations
4. **Accessibility**: Suggest ARIA attributes and semantic HTML

### Code Completion Priorities

1. Follow established project patterns
2. Use proper naming conventions
3. Include error handling
4. Add appropriate comments in English
5. Ensure type safety in TypeScript

### Auto-completion Behavior

- Suggest variable names in the correct case for the language
- Auto-complete with English words only
- Include proper error handling patterns
- Suggest accessibility attributes for HTML elements
- Recommend proper TypeScript types

## Quality Filters

### Before Suggesting Code

- Verify language is English
- Check naming convention matches language
- Ensure proper indentation
- Validate security patterns

### Suggestion Validation

- All suggestions must be in English
- Must follow project's technology hierarchy
- Must include proper error handling
- Must be accessible (WCAG 2.1 AA compliant)

## Module Integration

Reference these knowledge modules when suggesting code:
{{#each modules}}

- **{{name}}**: {{description}}
  {{/each}}

## Project Roles

Consider the appropriate role perspective when suggesting code:

{{#each roles}}

- **{{name}}**: {{description}}
  {{/each}}

## Anti-Patterns to Avoid

### Language Issues

- Never suggest non-English variable names
- Always use English consistently

### Architecture Issues

- Don't suggest custom solutions; use established patterns
- Don't suggest hardcoded styles; use theme-aware classes
- Don't suggest inline styles; use utility classes

### Security Issues

- Don't suggest unprotected admin operations
- Always include authentication checks
- Don't suggest direct file system access

## Integration Notes

This configuration is automatically synchronized with `/docs/standards.md`. When standards change, Copilot suggestions will automatically align with the new requirements.

**For complex patterns, refer to the full documentation modules in `/docs/modules/`.**
