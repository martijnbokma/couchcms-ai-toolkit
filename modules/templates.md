---
id: templates
name: "Templates"
category: "core"
version: "1.0"
description: "Template basics, structure, inheritance with extends/blocks, and organization patterns in CouchCMS"
required: false
requires: [couchcms-core]
conflicts: []
---

# Templates in CouchCMS

## Overview

Templates are the **foundation** of CouchCMS. Every HTML file becomes a template that CouchCMS can manage. Understanding template structure, inheritance, and organization is essential for building maintainable CouchCMS sites.

### What is a Template?

In CouchCMS, **every PHP file is a template**:
- Regular pages (about-us.php, contact.php)
- Dynamic content (blog.php, portfolio.php)
- Layouts and partials
- All share the same basic structure

### Key Benefits

- ✅ Convert existing HTML sites with minimal changes
- ✅ Reuse code with template inheritance (extends/blocks)
- ✅ Organize with snippets (embed)
- ✅ Maintain consistent structure across pages
- ✅ Separate content from presentation

## Template Basics

### Converting HTML to CouchCMS Template

**3 Simple Steps:**

#### 1. Rename to .php

```bash
# Before
about-us.html

# After
about-us.php
```

#### 2. Add PHP Hooks

```php
<?php require_once('couch/cms.php'); ?>
<!-- AT THE VERY TOP -->

<!-- Your HTML here -->

<?php COUCH::invoke(); ?>
<!-- AT THE VERY BOTTOM -->
```

#### 3. Visit as Admin

Visit `http://site.com/about-us.php` while logged in as super-admin.

**Result:** Template appears in CouchCMS admin panel!

### Basic Template Structure

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='About Us'>
    <cms:editable name='content' type='richtext' />
</cms:template>

<!DOCTYPE html>
<html>
<head>
    <title>About Us</title>
</head>
<body>
    <h1>About Us</h1>
    <cms:show content />
</body>
</html>

<?php COUCH::invoke(); ?>
```

## Template Inheritance (extends/blocks)

**Modern pattern for reusable layouts - avoids duplicate code!**

### Base Layout Template

```php
<?php require_once('couch/cms.php'); ?>
<!-- layouts/base.html (in snippets folder) -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><cms:block 'page_title'>My Site</cms:block></title>
    <link rel="stylesheet" href="<cms:show k_site_link />assets/css/style.css">
    <cms:block 'head'></cms:block>
</head>
<body>
    <header>
        <cms:embed 'partials/nav.html' />
    </header>

    <main>
        <cms:block 'content'>
            <!-- Default content -->
        </cms:block>
    </main>

    <footer>
        <cms:embed 'partials/footer.html' />
    </footer>

    <cms:block 'scripts'></cms:block>
</body>
</html>
```

### Child Template Using Extends

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />

<cms:block 'templates'>
    <cms:template title='About Us'>
        <cms:editable name='content' label='Content' type='richtext' />
        <cms:editable name='featured_image' label='Image' type='image' />
    </cms:template>
</cms:block>

<cms:block 'page_title'>
    <cms:if k_is_page><cms:show k_page_title /> - </cms:if>About
</cms:block>

<cms:block 'head'>
    <!-- Page-specific head content -->
    <meta name='description' content='About our company'>
</cms:block>

<cms:block 'content'>
    <div class="container">
        <h1><cms:show k_page_title /></h1>

        <cms:if featured_image>
            <img src="<cms:show featured_image />" alt="<cms:show k_page_title />">
        </cms:if>

        <div class="prose">
            <cms:show content />
        </div>
    </div>
</cms:block>

<cms:block 'scripts'>
    <!-- Page-specific scripts -->
    <script src="<cms:show k_site_link />assets/js/about.js"></script>
</cms:block>

<?php COUCH::invoke(); ?>
```

### How extends/blocks Work

1. **`<cms:extends>`** - Specifies parent layout
2. **`<cms:block 'name'>`** - Defines replaceable sections
3. **Child overrides parent blocks** - Fill in the sections
4. **Blocks not defined in child** - Use parent's default

**Benefits:**
- ✅ No duplicate HTML structure
- ✅ Change layout once, affects all pages
- ✅ Clean, maintainable code
- ✅ Easy to add new pages

## Snippets with cms:embed

**For reusable code chunks that DON'T need full template structure:**

### Creating Snippets

```html
<!-- snippets/partials/nav.html -->
<nav class="navbar">
    <a href="<cms:show k_site_link />">Home</a>

    <cms:pages masterpage='index.php'>
        <a href="<cms:show k_page_link />">
            <cms:show k_page_title />
        </a>
    </cms:pages>
</nav>
```

### Using Snippets

```php
<!-- In any template -->
<header>
    <cms:embed 'partials/nav.html' />
</header>
```

### Snippet with Parameters

```html
<!-- snippets/components/card.html -->
<cms:set title="<cms:get 'card_title' />" />
<cms:set image="<cms:get 'card_image' />" />
<cms:set link="<cms:get 'card_link' />" />

<div class="card">
    <img src="<cms:show image />" alt="<cms:show title />">
    <h3><cms:show title /></h3>
    <a href="<cms:show link />" class="btn">Learn More</a>
</div>
```

```php
<!-- Using the card snippet -->
<cms:set card_title='Amazing Product' />
<cms:set card_image='products/product1.jpg' />
<cms:set card_link='products/product1.html' />
<cms:embed 'components/card.html' />
```

## Complete Blog Example

### Base Layout

```php
<!-- snippets/layouts/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title><cms:block 'title'>My Blog</cms:block></title>
    <link href="<cms:show k_site_link />assets/css/style.css" rel="stylesheet">
    <cms:block 'head'></cms:block>
</head>
<body>
    <cms:embed 'partials/header.html' />

    <main class="container">
        <cms:block 'content'></cms:block>
    </main>

    <cms:embed 'partials/footer.html' />

    <cms:block 'scripts'></cms:block>
</body>
</html>
```

### Blog Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />

<cms:block 'templates'>
    <cms:template title='Blog' clonable='1' commentable='1'>
        <cms:folder name='tutorials' title='Tutorials' />
        <cms:folder name='news' title='News' />

        <cms:editable name='featured_image' label='Featured Image'
            type='image' width='1200' height='630' quality='85' />

        <cms:editable name='excerpt' label='Excerpt'
            type='textarea' maxlength='160' />

        <cms:editable name='content' label='Content'
            type='richtext' height='400' />
    </cms:template>
</cms:block>

<cms:block 'title'>
    <cms:if k_is_page>
        <cms:show k_page_title /> - Blog
    <cms:else />
        Blog - Latest Posts
    </cms:if>
</cms:block>

<cms:block 'content'>
    <cms:if k_is_page>
        <!-- Single Post -->
        <article class="prose">
            <h1><cms:show k_page_title /></h1>

            <div class="meta">
                <time><cms:date k_page_date format='F j, Y' /></time>
                <span>in <cms:show k_page_foldertitle /></span>
            </div>

            <cms:if featured_image>
                <img src="<cms:show featured_image />" alt="<cms:show k_page_title />">
            </cms:if>

            <cms:show content />

            <!-- Comments -->
            <cms:embed 'partials/comments.html' />
        </article>

    <cms:else />
        <!-- Blog Listing -->
        <h1>Latest Posts</h1>

        <div class="grid">
            <cms:pages limit='10' paginate='1'>
                <cms:embed 'components/blog-card.html' />
            </cms:pages>
        </div>

        <cms:paginator />
    </cms:if>
</cms:block>

<?php COUCH::invoke(); ?>
```

## Template Organization Patterns

### Pattern 1: Simple Site

```text
/
├── index.php               (home)
├── about.php              (about)
├── services.php           (services)
├── contact.php            (contact)
├── blog.php               (clonable blog)
└── couch/
    └── snippets/
        ├── header.inc
        ├── footer.inc
        └── nav.inc
```

### Pattern 2: Organized with Layouts

```text
/
├── index.php
├── about.php
├── blog.php
├── portfolio.php
└── couch/
    └── snippets/
        ├── layouts/
        │   ├── base.html
        │   ├── blog-layout.html
        │   └── page-layout.html
        ├── partials/
        │   ├── header.html
        │   ├── footer.html
        │   ├── nav.html
        │   └── sidebar.html
        └── components/
            ├── card.html
            ├── hero.html
            └── cta.html
```

### Pattern 3: Advanced Structure

```text
/
├── index.php
├── blog.php
├── portfolio.php
└── couch/
    └── snippets/
        ├── layouts/
        │   ├── base.html           (master layout)
        │   ├── page.html           (single page)
        │   ├── list.html           (listing pages)
        │   └── sidebar-layout.html (with sidebar)
        ├── partials/
        │   ├── header.html
        │   ├── footer.html
        │   ├── nav.html
        │   ├── sidebar.html
        │   ├── breadcrumbs.html
        │   └── social-share.html
        ├── components/
        │   ├── blog-card.html
        │   ├── portfolio-item.html
        │   ├── testimonial.html
        │   ├── cta-box.html
        │   └── newsletter-form.html
        ├── filters/
        │   ├── authenticated.html  (auth check)
        │   └── owns_page.html      (ownership)
        └── forms/
            ├── contact-form.html
            └── subscription-form.html
```

## Integration Patterns

### With TailwindCSS + daisyUI

```php
<!-- snippets/layouts/tailwind-base.html -->
<!DOCTYPE html>
<html data-theme="light">
<head>
    <title><cms:block 'title'>My Site</cms:block></title>
    <link href="<cms:show k_site_link />assets/css/output.css" rel="stylesheet">
    <cms:block 'head'></cms:block>
</head>
<body class="bg-base-100">
    <div class="navbar bg-base-300">
        <cms:embed 'partials/nav.html' />
    </div>

    <main class="container mx-auto p-4">
        <cms:block 'content'></cms:block>
    </main>

    <footer class="footer footer-center p-10 bg-base-200 text-base-content">
        <cms:embed 'partials/footer.html' />
    </footer>

    <cms:block 'scripts'></cms:block>
</body>
</html>
```

### With Alpine.js

```php
<!-- snippets/layouts/alpine-base.html -->
<!DOCTYPE html>
<html>
<head>
    <title><cms:block 'title'>My Site</cms:block></title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <cms:block 'head'></cms:block>
</head>
<body x-data="{ mobileMenuOpen: false }">
    <nav>
        <button x-on:click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
            Menu
        </button>

        <div x-show="mobileMenuOpen" x-on:click.away="mobileMenuOpen = false">
            <cms:embed 'partials/mobile-nav.html' />
        </div>
    </nav>

    <main>
        <cms:block 'content'></cms:block>
    </main>

    <cms:block 'scripts'></cms:block>
</body>
</html>
```

## Best Practices

### DO

✅ **Use template inheritance (extends/blocks)**
```php
<cms:extends 'layouts/base.html' />
<cms:block 'content'>
    <!-- Page content -->
</cms:block>
```

✅ **Organize snippets logically**
```text
snippets/
├── layouts/    (full page templates)
├── partials/   (header, footer, nav)
├── components/ (reusable UI pieces)
└── forms/      (form snippets)
```

✅ **Always wrap editable regions in templates block**
```php
<cms:block 'templates'>
    <cms:template title='Page' clonable='1'>
        <cms:editable name='content' type='richtext' />
    </cms:template>
</cms:block>
```

✅ **Use meaningful block names**
```php
<cms:block 'page_title'>
<cms:block 'meta_tags'>
<cms:block 'main_content'>
<cms:block 'sidebar'>
```

✅ **Keep snippets DRY (Don't Repeat Yourself)**
```php
<!-- Instead of duplicating header code: -->
<cms:embed 'partials/header.html' />
```

✅ **Visit template as admin after changes**
```text
After modifying template, visit:
http://site.com/template.php (while logged in)
```

### DON'T

❌ **Don't forget PHP hooks**
```php
<!-- WRONG: Missing hooks -->
<html>
<body>Hello</body>
</html>

<!-- CORRECT: -->
<?php require_once('couch/cms.php'); ?>
<html>
<body>Hello</body>
</html>
<?php COUCH::invoke(); ?>
```

❌ **Don't duplicate layout code**
```php
<!-- BAD: Repeating header/footer in every template -->
about.php: <html><head>...</head><body>...
contact.php: <html><head>...</head><body>...

<!-- GOOD: Use extends -->
<cms:extends 'layouts/base.html' />
```

❌ **Don't put editable regions outside templates block**
```php
<!-- WRONG: -->
<cms:editable name='content' type='richtext' />
<cms:template title='Page'></cms:template>

<!-- CORRECT: -->
<cms:template title='Page'>
    <cms:editable name='content' type='richtext' />
</cms:template>
```

❌ **Don't use .html extension for templates**
```text
WRONG: about-us.html
CORRECT: about-us.php
```

❌ **Don't embed snippets with partial CouchCMS tags**
```html
<!-- WRONG: Truncated tag -->
<!-- snippet.html: -->
<cms:if condition>
    Content

<!-- BAD: Closing tag in different file -->

<!-- CORRECT: Complete tags in snippet -->
<cms:if condition>
    Content
</cms:if>
```

## Troubleshooting

### Issue: Template not appearing in admin

**Cause**: Didn't visit template as admin

**Solution**:
1. Log in as super-admin
2. Visit template: `http://site.com/template.php`
3. Check admin panel

### Issue: "Cannot find extends template"

**Cause**: Wrong path or file doesn't exist

**Solution**:
```php
<!-- Check path is relative to snippets folder -->
<cms:extends 'layouts/base.html' />

<!-- File must exist at: -->
<!-- couch/snippets/layouts/base.html -->
```

### Issue: Blocks not working

**Cause**: Using embed instead of extends

**Solution**:
```php
<!-- WRONG: -->
<cms:embed 'layouts/base.html' />

<!-- CORRECT: -->
<cms:extends 'layouts/base.html' />
```

### Issue: Changes not showing

**Cause**: Haven't visited template as admin

**Solution**: After ANY template changes, visit template while logged in as super-admin.

### Issue: Snippet path not found

**Cause**: Wrong relative path

**Solution**:
```php
<!-- Default snippets folder: couch/snippets/ -->
<cms:embed 'header.html' />        <!-- couch/snippets/header.html -->
<cms:embed 'layouts/base.html' />  <!-- couch/snippets/layouts/base.html -->

<!-- Can configure K_SNIPPETS_DIR in config.php -->
```

## Performance Tips

### Cache Snippets

```php
<cms:cache '1 hour'>
    <cms:embed 'partials/nav.html' />
</cms:cache>
```

### Minimize Nesting

```php
<!-- AVOID: Too much nesting -->
<cms:embed 'a.html' />  <!-- embeds b.html which embeds c.html -->

<!-- BETTER: Flatten when possible -->
```

### Use Blocks Over Embeds for Layouts

```php
<!-- BETTER: extends/blocks (more efficient) -->
<cms:extends 'layouts/base.html' />

<!-- OKAY: embed (for small snippets) -->
<cms:embed 'partials/header.html' />
```

## Related Concepts

- [Cloned Pages](./cloned-pages.md) - Creating multiple pages from templates
- [Views](./views.md) - Understanding template execution contexts
- [Editable Regions](./editable-regions.md) - Making templates content-manageable
- [Nested Pages](./nested-pages.md) - Hierarchical page structures

## See Also

- [`<cms:template>`](../../tags-reference/template.md) - Template definition tag
- [`<cms:extends>`](../../tags-reference/extends.md) - Template inheritance
- [`<cms:block>`](../../tags-reference/block.md) - Define replaceable sections
- [`<cms:embed>`](../../tags-reference/embed.md) - Include snippets
