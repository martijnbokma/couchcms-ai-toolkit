# Critical Bug Report: Invalid CouchCMS Syntax in ai-toolkit-shared

## Summary
The ai-toolkit-shared CouchCMS modules are teaching **completely invalid syntax** that does not exist in CouchCMS, causing AI assistants to generate broken code.

## Affected Files
1. `modules/templates.md` - **ENTIRE MODULE IS WRONG**
2. `modules/couchcms-core.md` - Contains false template inheritance syntax

## Invalid Syntax Being Taught

### What the modules teach (❌ WRONG):
```php
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
    <cms:template title='Page'>
        <cms:editable name='content' type='richtext' />
    </cms:template>
</cms:block>
<cms:block 'content'>
    <!-- Page content -->
</cms:block>
```

**These tags DO NOT EXIST in CouchCMS:**
- `<cms:extends>` - **INVALID**
- `<cms:block>` - **INVALID**

## Correct CouchCMS Syntax

### What should be taught (✅ CORRECT):
```php
<?php require_once('couch/cms.php'); ?>

<cms:template title='Homepage' clonable='0'>
    <cms:editable name='content' label='Content' type='richtext' />
</cms:template>

<!DOCTYPE html>
<html lang="en">
<head>
    <cms:embed 'head.html' />
</head>
<body>
    <cms:embed 'header.html' />

    <main>
        <cms:show content />
    </main>

    <cms:embed 'footer.html' />
</body>
</html>

<?php COUCH::invoke(); ?>
```

## Real CouchCMS Tags

### Valid Tags:
- ✅ `<cms:embed 'file.html' />` - Include snippets
- ✅ `<cms:template>` - Define template
- ✅ `<cms:editable>` - Define fields
- ✅ `<cms:show>` - Display variables
- ✅ `<cms:pages>` - Loop pages
- ✅ `<cms:if>` - Conditionals

### Invalid Tags (do not exist):
- ❌ `<cms:extends>`
- ❌ `<cms:block>`

## Source of Error

Likely confusion with:
1. **Laravel Blade** templates (uses `@extends` and `@section`)
2. **Twig** templates (uses `{% extends %}` and `{% block %}`)
3. **Jinja2** templates (uses `{% extends %}` and `{% block %}`)

CouchCMS does **NOT** have template inheritance via extends/blocks!

## Impact

This bug causes:
1. ❌ AI assistants generate completely broken CouchCMS code
2. ❌ Developers waste time debugging non-existent syntax
3. ❌ Loss of trust in ai-toolkit-shared accuracy
4. ❌ Broken websites that won't render

## Evidence

From `templates.md` line 90:
```
## Template Inheritance (extends/blocks)

**Modern pattern for reusable layouts - avoids duplicate code!**
```

This entire section (lines 90-180+) teaches invalid syntax.

From `couchcms-core.md` line 21:
```php
<cms:extends 'layouts/base.html' />
<cms:block 'templates'>
```

## Recommended Fix

### 1. Delete Invalid Content
- Remove entire "Template Inheritance (extends/blocks)" section from `templates.md`
- Remove all `<cms:extends>` and `<cms:block>` references

### 2. Replace with Correct Pattern

**For reusable layouts, teach:**
```php
<!-- Create snippet: snippets/layouts/page-wrapper.html -->
<!DOCTYPE html>
<html>
<head>
    <cms:embed 'partials/head.html' />
</head>
<body>
    <cms:embed 'partials/header.html' />
    <main><cms:show content /></main>
    <cms:embed 'partials/footer.html' />
</body>
</html>
```

**Then in template:**
```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='About'>
    <cms:editable name='content' type='richtext' />
</cms:template>

<cms:embed 'layouts/page-wrapper.html' />
<?php COUCH::invoke(); ?>
```

### 3. Add Warning

Add to beginning of both modules:
```markdown
⚠️ **CRITICAL**: CouchCMS does NOT support template inheritance via `extends`/`blocks`.
These tags do not exist. Use `<cms:embed>` for code reuse.
```

## Testing
- [ ] Verify all examples use only valid CouchCMS tags
- [ ] Test generated code actually works in CouchCMS
- [ ] Cross-reference with official CouchCMS documentation

## Official Documentation
- CouchCMS Docs: https://docs.couchcms.com/
- Valid tags: https://docs.couchcms.com/tags-reference/

## Priority
**CRITICAL** - This breaks all generated CouchCMS code

---

**Reported by**: Claude (analyzing Pixel Pad Thai project)
**Date**: 2024-12-04
**Version**: ai-toolkit-shared latest (after 217 commits update)
