# Claude Coding Instructions - {{project.name}}

**Highly Critical: Always refer to `/docs/standards.md` before generating, editing, or reviewing any code.**

## Project Overview

- **Name**: {{project.name}}
- **Type**: {{project.type}}
- **Description**: {{project.description}}

## Fundamental Rules

### Language Policy

- **English Only**: All code, comments, variable names, and documentation MUST be written in English
- **Zero Tolerance**: Never use non-English language in any context
- **Documentation**: All explanations and comments must be in English

### Code Quality Standards

- **Indentation**: Use exactly {{standards.indentation}} spaces for all code types
- **Naming Conventions**:
    - Variables: Follow language-specific conventions from `{{standards.naming}}`
    - Classes: {{standards.naming.classes}} for all class names
    - Files: Follow project naming conventions ({{standards.naming.php_files}} for PHP, {{standards.naming.typescript_files}} for TypeScript)

### Technology Stack Hierarchy

{{#each tech_hierarchy}}
{{add @index 1}}. **{{name}}**: {{description}}
{{/each}}

## Active Knowledge Modules

{{#each modules}}

- **{{name}}**: {{description}}
    - Reference: `/docs/modules/{{slug}}/`
      {{/each}}

## Project Roles

When working on tasks, consider the appropriate role perspective:

{{#each roles}}

- **{{name}}**: {{description}}
  {{/each}}

{{#if has_cms}}

## CMS Development Patterns

### Template Structure (Required)

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='{{template_name}}' clonable='1' routable='1'>
        <!-- Always include ownership and publishing fields -->
        <cms:editable name='content_owner' label='Content Owner' type='text' />
        <cms:editable name='is_published' label='Status' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <!-- Always check authentication first -->
    <cms:embed 'filters/authenticated.html' />
    <!-- Content implementation -->
</cms:block>
<?php COUCH::invoke(); ?>
```

### Authentication Flow (Mandatory)

```php
<!-- 1. Check authentication -->
<cms:embed 'filters/authenticated.html' />

<!-- 2. Check ownership for edits -->
<cms:embed 'filters/owns_project.html' />

<!-- 3. Show content based on permissions -->
<cms:if authenticated='1' AND owns_content='1'>
    <!-- Protected content -->
</cms:if>
```

{{/if}}

{{#if has_frontend}}

## Frontend Development Standards

### Styling Approach

- **Primary**: {{styling_framework}} utilities with content-aware colors
- **Components**: {{component_library}} semantic components
- **Theme Compatibility**: Always use theme-aware classes for readable text
- **Responsive**: Mobile-first design approach

```html
<!-- Correct styling pattern -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title text-base-content">English Title</h2>
        <p class="text-base-content/70">English description text</p>
    </div>
</div>
```

### JavaScript/TypeScript Guidelines

- **Simple Interactions**: Use {{js_framework}} for toggles, modals, forms
- **Complex Logic**: Use TypeScript for validation, API calls, state management
- **Architecture**: Service-oriented with clean separation of concerns

```typescript
// Example TypeScript service
export interface UserProfile {
    id: string
    displayName: string
    email: string
    isActive: boolean
}

export class UserService {
    async validateProfile(profile: UserProfile): Promise<boolean> {
        return Boolean(profile.id && profile.displayName && profile.email && this.isValidEmail(profile.email))
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
}
```

{{/if}}

{{#if has_cms}}

## Security & Authentication Requirements

### Data Access Patterns

- **Read**: Use CMS query patterns with proper filtering
- **Write**: Use CMS form patterns with proper validation
- **Validation**: Server-side validation in editable regions
- **Authorization**: Always check ownership before allowing edits

### File Uploads

```php
<!-- Secure file upload pattern -->
<cms:form method='post' enctype='multipart/form-data'>
    <cms:if k_success>
        <cms:db_persist_form
            _auto_title='1'
            _invalidate_cache='1'
        />
    </cms:if>

    <cms:input name="secure_file" type="bound" />
</cms:form>
```

{{/if}}

## Quality Assurance Checklist

### Before Code Generation

- [ ] Understand the task within project context
- [ ] Identify which technology should be primary
- [ ] Plan authentication and authorization needs
- [ ] Consider accessibility requirements

### During Code Generation

- [ ] Use only English language
- [ ] Apply {{standards.indentation}}-space indentation
- [ ] Follow naming conventions for the language
- [ ] Implement proper error handling
- [ ] Add authentication checks where needed

### After Code Generation

- [ ] Verify all text is in English
- [ ] Check code follows project patterns
- [ ] Ensure accessibility compliance
- [ ] Validate security measures
- [ ] Test integration with existing code

## Common Anti-Patterns to Avoid

### Language Violations

- ❌ Using non-English variable names
- ✅ Using English variable names consistently

### Architecture Violations

- ❌ Creating custom solutions instead of using established patterns
- ✅ Using established project patterns for data persistence

### Security Violations

- ❌ Direct database access without authentication
- ✅ Proper authentication and ownership validation

### Styling Violations

- ❌ Hardcoded colors that break in different themes
- ✅ Theme-aware colors that work in all themes

## Integration Notes

This instruction set is automatically generated from `/docs/standards.md`. The system ensures:

- Consistency across all AI agents
- Automatic updates when standards change
- Project-specific knowledge integration
- Cross-reference with documentation modules

**For any questions about patterns or standards, always refer back to the source documentation in `/docs/standards.md` and the relevant module documentation.**
