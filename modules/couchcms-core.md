---
id: couchcms-core
name: "CouchCMS Core"
category: "core"
version: "2.3"
description: "Core CouchCMS patterns, templates, and security standards"
required: true
requires: []
conflicts: []
---

# CouchCMS Core Standards

## Template Structure

### Basic Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Page Name' clonable='1' routable='1'>
        <cms:editable name='content' label='Content' type='richtext' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <!-- Page content here -->
</cms:block>
<?php COUCH::invoke(); ?>
```

### Template Inheritance

- Use `<cms:extends>` for layout inheritance
- Define blocks with `<cms:block>`
- Use `<cms:embed>` for reusable snippets

## Security Standards

### 🚨 CRITICAL: HTML Comment Security

- **NEVER** use `<cms:` tags inside HTML comments - CouchCMS executes them!
- Use `[cms:` instead of `<cms:` in comments
- Wrap multiline comments with CouchCMS tags in `<cms:ignore>` blocks

```html
<!-- ❌ BAD: This will execute and crash the site -->
<!-- <cms:show my_variable /> -->

<!-- ✅ GOOD: Use square brackets in comments -->
<!-- [cms:show my_variable /] -->

<!-- ✅ GOOD: Use cms:ignore for multiline -->
<cms:ignore>
  <cms:show my_variable />
  <cms:if condition>...</cms:if>
</cms:ignore>
```

### Authentication Patterns

- Use `snippets/filters/authenticated.html` for authentication checks
- Use `snippets/filters/owns_{content}.html` for ownership validation
- Always validate user input and sanitize outputs
- Implement CSRF protection for all forms

## Self-Closing Tags

### 🚨 CRITICAL: else/else_if Syntax

`<cms:else />` and `<cms:else_if />` are **self-closing** tags:

```html
<!-- ✅ GOOD: Self-closing syntax -->
<cms:if condition>
  <div>Condition is true</div>
  <cms:else_if other_condition />
  <div>Other condition is true</div>
  <cms:else />
  <div>Default content</div>
</cms:if>

<!-- ❌ BAD: Paired tags cause parsing errors -->
<cms:if condition>
  <cms:else></cms:else>
  <!-- WRONG! -->
</cms:if>
```

## Data Patterns

### Pages Query

```html
<cms:pages
  masterpage="template.php"
  limit="10"
  orderby="publish_date"
  order="desc"
>
  <h2><cms:show k_page_title /></h2>
  <cms:show content />
</cms:pages>
```

### Relationships

```html
<cms:editable name='related_items' label='Related Items'
    type='relation' masterpage='items.php' />

<!-- Display related items -->
<cms:related_pages 'related_items'>
    <cms:show k_page_title />
</cms:related_pages>
```

### Repeatable Regions

```html
<cms:editable name='gallery' label='Gallery' type='repeatable'>
    <cms:editable name='image' label='Image' type='image' />
    <cms:editable name='caption' label='Caption' type='text' />
</cms:editable>

<!-- Display -->
<cms:show_repeatable 'gallery'>
    <img src="<cms:show image />" alt="<cms:show caption />" />
</cms:show_repeatable>
```

## Template Execution Order

### 🚨 CRITICAL: Execution Order

In CouchCMS template inheritance:

- `<cms:embed>` components execute at their position in the parent template
- Child `<cms:block>` content executes AFTER all parent template code
- Variables set in child blocks are NOT available to components embedded earlier in the parent

**Always verify execution order before using variables.**

## Best Practices

### DO

- Use idiomatic CouchCMS tags, avoid `<cms:php>` when possible
- Create reusable snippets for common patterns
- Use template inheritance for consistent layouts
- Validate all user input
- Use Extended Users for authentication

### DON'T

- Put `<cms:` tags in HTML comments
- Use paired tags for `<cms:else />` or `<cms:else_if />`
- Assume variables are available without checking execution order
- Skip CSRF protection on forms
- Use `<cms:php>` for things CouchCMS tags can do

## Naming Conventions

- **Template files**: `kebab-case.php` (e.g., `user-profile.php`)
- **Snippet files**: `kebab-case.html` (e.g., `user-card.html`)
- **Editable names**: `snake_case` (e.g., `content_owner`)
- **Variables**: `snake_case` (e.g., `my_variable`)
