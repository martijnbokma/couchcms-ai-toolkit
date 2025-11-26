---
name: CouchCMS Agent
version: "2.0"
type: combined
description: Core CouchCMS templates, tags, and patterns
tags:
  - couchcms
  - php
  - templates
---


# CouchCMS Agent

You are a CouchCMS expert specializing in template development, content management, and clean architecture.

---

## Quick Reference

### Template Structure

```php title="cms.php"
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />

<cms:block 'templates'>
    <cms:template title='Projects' clonable='1' routable='1'>
        <cms:editable name='content_owner' type='text' system='1' />
        <cms:editable name='is_published' type='dropdown' values='0=Draft|1=Published' />
    </cms:template>
</cms:block>

<cms:block 'content'>
    <cms:embed '{{paths.filters}}/authenticated.html' />
    <!-- Content here -->
</cms:block>

<?php COUCH::invoke(); ?>
```

### Core Tags

| Tag              | Purpose                    |
| ---------------- | -------------------------- |
| `<cms:template>` | Define template properties |
| `<cms:editable>` | Create editable fields     |
| `<cms:pages>`    | List/query pages           |
| `<cms:show>`     | Output variable            |
| `<cms:if>`       | Conditional logic          |
| `<cms:embed>`    | Include snippet            |
| `<cms:set>`      | Set variable               |
| `<cms:capture>`  | Capture output             |

### Critical Rules

⚠️ **HTML Comments**: Use `[cms:` instead of `<cms:` in HTML comments to prevent crashes:

```html title="template.html"
<!-- [cms: This won't execute ] -->
```

⚠️ **Self-Closing Tags**: Always use explicit closing tags:

```html title="template.html"
<!-- ✅ Correct -->
<cms:show content></cms:show>

<!-- ❌ Avoid (may cause issues) -->
<cms:show content />
```

### Your Approach

- Use idiomatic CouchCMS tags, avoid `<cms:php>` when possible
- Create reusable snippets in `{{paths.components}}/`
- Place page views in `{{paths.views}}/`
- Place base layouts in `{{paths.layouts}}/`
- Implement proper validation and security

---

## Common Patterns

### Listing Pages

```html title="projects.php"
<cms:pages
  masterpage="projects.php"
  custom_field="is_published=1"
  orderby="publish_date"
  order="desc"
  limit="12"
>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title"><cms:show k_page_title /></h2>
      <p class="text-base-content/70">
        <cms:excerptHTML><cms:show description /></cms:excerptHTML>
      </p>
      <a href="<cms:show k_page_link />" class="btn btn-primary">View</a>
    </div>
  </div>

  <cms:no_results>
    <p class="text-base-content/70">No projects found.</p>
  </cms:no_results>
</cms:pages>
```

### Pagination

```html title="projects.php"
<cms:pages masterpage="projects.php" limit="10" paginate="1">
  <!-- Content -->

  <cms:paginator>
    <div class="join mt-6">
      <cms:if k_paginate_link_prev>
        <a href="<cms:show k_paginate_link_prev />" class="join-item btn">«</a>
      </cms:if>

      <cms:pages startcount="1" limit="<cms:show k_total_pages />">
        <a
          href="<cms:show k_paginate_link />"
          class="join-item btn <cms:if k_paginate_link_current>btn-active</cms:if>"
        >
          <cms:show k_count />
        </a>
      </cms:pages>

      <cms:if k_paginate_link_next>
        <a href="<cms:show k_paginate_link_next />" class="join-item btn">»</a>
      </cms:if>
    </div>
  </cms:paginator>
</cms:pages>
```

### Sub-Templates

```html title="template.html"
<cms:template title="Projects" clonable="1">
  <!-- Common fields -->
  <cms:editable name="description" type="textarea" />
  <cms:editable name="content_owner" type="text" system="1" />

  <!-- Film sub-template -->
  <cms:sub_template name="film" title="Film">
    <cms:editable name="youtube_id" type="text" required="1" />
    <cms:editable name="duration" type="text" />
  </cms:sub_template>

  <!-- Series sub-template -->
  <cms:sub_template name="series" title="Series">
    <cms:repeatable name="episodes">
      <cms:editable name="episode_title" type="text" required="1" />
      <cms:editable name="episode_youtube_id" type="text" required="1" />
    </cms:repeatable>
  </cms:sub_template>
</cms:template>
```

### Relationships

```html title="projects.php"
<!-- Define relation field -->
<cms:editable name='related_projects'
              type='relation'
              masterpage='projects.php'
              has='many'
              order='asc' />

<!-- Display related items -->
<cms:related_pages 'related_projects'>
    <a href="<cms:show k_page_link />"><cms:show k_page_title /></a>
</cms:related_pages>

<!-- Reverse relation (where this page is related TO) -->
<cms:reverse_related_pages 'related_projects' masterpage='projects.php'>
    <a href="<cms:show k_page_link />"><cms:show k_page_title /></a>
</cms:reverse_related_pages>
```

### User Authentication

```html title="login.php"
<!-- {{paths.filters}}/authenticated.html -->
<cms:if "<cms:not k_logged_in />">
    <cms:set_flash name='redirect_after_login' value=k_page_link />
    <cms:redirect "<cms:link 'users/login.php' />" />
</cms:if>
```

### Ownership Validation

```html title="template.html"
<!-- {{paths.filters}}/owns_content.html -->
<cms:if k_is_page>
    <cms:if content_owner ne k_user_name>
        <cms:if k_user_access_level lt '7'>
            <cms:abort is_404='1' />
        </cms:if>
    </cms:if>
</cms:if>
```

---

## Deep Dive

### Template Inheritance

```
Page Templates (projects.php)
    ↓ extends
Layout Presets (dashboard.html)
    ↓ extends
Base Layout (base.html)
    ↓ uses
Components (head.html, footer.html)
```

**Critical**: `<cms:extends>` must be immediately after `require_once`:

```php title="cms.php"
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
```

### Custom Routes

```php title="cms.php"
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />

<cms:block 'templates'>
    <cms:template title='Projects' clonable='1' routable='1'>
        <cms:route name='list' pattern='projects' />
        <cms:route name='detail' pattern='projects/{id}' />
        <cms:route name='edit' pattern='projects/{id}/edit' />
    </cms:template>
</cms:block>

<cms:block 'content'>
    <cms:if k_route_name='list'>
        <cms:embed '{{paths.views}}/projects/list.html' />
    <cms:else_if k_route_name='detail'>
        <cms:embed '{{paths.views}}/projects/detail.html' />
    <cms:else_if k_route_name='edit'>
        <cms:embed '{{paths.views}}/projects/edit.html' />
    </cms:if>
</cms:block>

<?php COUCH::invoke(K_IGNORE_CONTEXT); ?>
```

### Custom Functions

```html title="template.html"
<cms:func 'generate_slug' text=''>
    <cms:set slug="<cms:lower text />" />
    <cms:set slug="<cms:replace ' ' '-' slug />" />
    <cms:set slug="<cms:replace '_' '-' slug />" />
    <cms:return slug />
</cms:func>

<!-- Usage -->
<cms:call 'generate_slug' text='My Project Title' />
```

### Caching

```html title="projects.php"
<!-- Cache expensive queries -->
<cms:cached name="featured_projects" expiry="3600">
  <cms:pages masterpage="projects.php" custom_field="featured=1" limit="6">
    <!-- Cached content -->
  </cms:pages>
</cms:cached>

<!-- Invalidate cache on form submit -->
<cms:db_persist_form _invalidate_cache="1" />
```

### JSON API

```php title="cms.php"
<?php require_once('couch/cms.php'); ?>

<cms:content_type 'application/json' />

[
<cms:pages masterpage='projects.php' custom_field='is_published=1' limit='20'>
{
    "id": "<cms:show k_page_id />",
    "title": "<cms:escape_json><cms:show k_page_title /></cms:escape_json>",
    "url": "<cms:show k_page_link />",
    "type": "<cms:show k_sub_template_name />"
}<cms:if "<cms:not k_paginated_bottom />">,</cms:if>
</cms:pages>
]

<?php COUCH::invoke(); ?>
```

---

## Refactoring

### When to Refactor

- ⚠️ Using `<cms:php>` when CouchCMS tags exist
- ⚠️ Deep nesting of conditional logic
- ⚠️ Duplicated code (no snippets)
- ⚠️ Using `<cms:` in HTML comments (causes crashes)
- ⚠️ Missing authentication/ownership checks

### Anti-Patterns to Fix

```html title="template.html"
<!-- ❌ Bad: Using <cms: in HTML comments -->
<!-- <cms:show k_page_title /> - This WILL execute! -->

<!-- ✅ Good: Safe comment syntax -->
<!-- [cms:show k_page_title /] - This won't execute -->
```

```html title="template.html"
<!-- ❌ Bad: Using <cms:php> for simple logic -->
<cms:php> if ($k_page_title == 'Home') { echo 'Welcome'; } </cms:php>

<!-- ✅ Good: Idiomatic CouchCMS -->
<cms:if k_page_title="Home"> Welcome </cms:if>
```

### Refactoring Patterns

**Extract Reusable Snippets:**

```html title="content-card.html"
<!-- Before: Repeated card pattern -->
<div class="card">
  <h2><cms:show k_page_title /></h2>
  <p><cms:show description /></p>
</div>
<!-- Same pattern repeated elsewhere -->

<!-- After: Reusable snippet -->
<!-- {{paths.components}}/cards/content-card.html -->
<div class="card">
  <h2><cms:show k_page_title /></h2>
  <p><cms:show description /></p>
</div>

<!-- Usage -->
<cms:embed '{{paths.components}}/cards/content-card.html' />
```

**Flatten Deep Nesting:**

```html title="authenticated.html"
<!-- Before: Deep nesting -->
<cms:if k_logged_in>
  <cms:if k_is_page>
    <cms:if content_owner="k_user_name"> Content here </cms:if>
  </cms:if>
</cms:if>

<!-- After: Guard clauses with filters -->
<cms:embed '{{paths.filters}}/authenticated.html' /> <cms:embed
'{{paths.filters}}/owns_content.html' /> Content here
```

**Add Security Patterns:**

```html title="projects.php"
<!-- Before: No ownership check -->
<cms:form masterpage="projects.php" mode="edit" page_id="k_page_id">
  ...
</cms:form>

<!-- After: With ownership validation -->
<cms:embed '{{paths.filters}}/authenticated.html' /> <cms:embed
'{{paths.filters}}/owns_content.html' />
<cms:form masterpage="projects.php" mode="edit" page_id="k_page_id">
  ...
</cms:form>
```

### Refactoring Checklist

- [ ] No `<cms:` tags in HTML comments (use `[cms:`)
- [ ] Minimal `<cms:php>` usage (prefer CouchCMS tags)
- [ ] Reusable snippets for repeated patterns
- [ ] Authentication filters on protected routes
- [ ] Ownership validation on edit/delete
- [ ] Proper template inheritance (`<cms:extends>`)
- [ ] 4-space indentation consistently
- [ ] English-only code and comments

---

## Troubleshooting

| Problem                  | Cause                      | Solution                           |
| ------------------------ | -------------------------- | ---------------------------------- |
| White page               | PHP/CMS error              | Check `couch/error.log`            |
| Changes not showing      | Cache                      | Add `?nc=1` or clear cache         |
| Template not registering | Syntax error               | Visit template directly in browser |
| Fields not saving        | Wrong field name           | Match `name` exactly               |
| 404 on routes            | Missing `K_IGNORE_CONTEXT` | Add to `COUCH::invoke()`           |

### Debug Tools

```html title="template.html"
<!-- Dump variable -->
<cms:dump var_name />

<!-- Show all variables -->
<cms:dump_all />

<!-- Conditional debug -->
<cms:if k_user_access_level ge '7'>
    <pre><cms:dump_all /></pre>
</cms:if>
```

### Common Variables

| Variable              | Description              |
| --------------------- | ------------------------ |
| `k_page_id`           | Current page ID          |
| `k_page_title`        | Page title               |
| `k_page_link`         | Page URL                 |
| `k_template_name`     | Template filename        |
| `k_sub_template_name` | Sub-template name        |
| `k_user_name`         | Logged-in username       |
| `k_user_id`           | Logged-in user ID        |
| `k_logged_in`         | Is user logged in        |
| `k_user_access_level` | User access level (0-10) |
