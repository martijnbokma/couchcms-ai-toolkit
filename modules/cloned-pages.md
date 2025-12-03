---
id: cloned-pages
name: "Cloned Pages"
category: "content"
version: "1.0"
description: "Creating multiple dynamic pages from a single template - the foundation of blogs, portfolios, and content systems"
required: false
requires: [couchcms-core, views, editable-regions]
conflicts: []
---

# Cloned Pages

## Overview

Cloned pages are CouchCMS's way of creating **multiple dynamic pages from a single template**. This is the foundation for building blogs, portfolios, news sites, product catalogs, and any content system requiring repeatable page structures.

### What are Cloned Pages?

Instead of creating separate PHP files for each blog post or product, you create ONE template that can be "cloned" into many pages, each with independent content.

**Key Concept:**
- **Non-clonable template** = ONE page (e.g., about-us.php)
- **Clonable template** = MANY pages (e.g., blog.php → 100 blog posts)

### Why Use Cloned Pages?

- ✅ Create unlimited pages from one template
- ✅ Each cloned page has independent content
- ✅ Consistent structure across all pages
- ✅ Easy content management for clients
- ✅ Perfect for blogs, portfolios, products, news
- ✅ Automatic listing and navigation

## The Split Personality Concept

This is **THE most important concept** to understand about clonable templates:

### Before: Non-Clonable Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='About Us'>
    <cms:editable name='content' type='richtext' />
</cms:template>

<h1>About Us</h1>
<cms:show content />

<?php COUCH::invoke(); ?>
```

**URL:** `http://site.com/about-us.php`
**Behavior:** ONE page with ONE set of content

### After: Clonable Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Blog' clonable='1'>
    <cms:editable name='content' type='richtext' />
</cms:template>

<cms:if k_is_page>
    <!-- PAGE VIEW: Show single blog post -->
    <h1><cms:show k_page_title /></h1>
    <cms:show content />
<cms:else />
    <!-- LIST VIEW: Show list of blog posts -->
    <h1>Blog</h1>
    <cms:pages>
        <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
    </cms:pages>
</cms:if>

<?php COUCH::invoke(); ?>
```

**URLs:**
- `blog.php` → List view (no content, shows listing)
- `blog.php?p=12` → Page view (first blog post)
- `blog.php?p=13` → Page view (second blog post)

**With Pretty URLs:**
- `blog/` → List view
- `blog/my-first-post.html` → First post
- `blog/my-second-post.html` → Second post

## Making a Template Clonable

### Step 1: Add clonable='1'

```php
<cms:template clonable='1'>
    <cms:editable name='content' type='richtext' />
</cms:template>
```

### Step 2: Visit Template as Admin

Visit `http://site.com/blog.php` while logged in as super-admin.

**What Happens:**
1. ✅ Template becomes clonable
2. ✅ First "default page" created automatically
3. ✅ All existing data moved to default page
4. ✅ Template itself now has NO data
5. ✅ Admin panel changes - can now create/manage cloned pages

### Step 3: Add View Detection

```php
<cms:if k_is_page>
    <!-- Single page content -->
<cms:else />
    <!-- List of pages -->
</cms:if>
```

## Creating & Managing Cloned Pages

### Creating New Pages

**In Admin Panel:**
1. Go to template (e.g., Blog)
2. Click "Add New"
3. Fill in content fields
4. Set page title and name
5. Publish or save as draft

**Result:** New page accessible at `blog.php?p=14` or `blog/my-new-post.html`

### Page Properties

Every cloned page has:

```php
k_page_title        // Display title
k_page_name         // URL slug
k_page_id           // Unique ID
k_page_date         // Publish date
k_page_modification_date
k_page_link         // Full URL
k_publish_date      // When published
k_is_published      // Published status
```

### Draft vs Published

```php
<cms:template clonable='1'>
    <cms:editable name='content' type='richtext' />
</cms:template>

<!-- Only show published pages: -->
<cms:pages show_future_entries='0'>
    <h2><cms:show k_page_title /></h2>
</cms:pages>
```

## Complete Blog Example

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Blog' clonable='1' commentable='1'>
    <!-- Editable regions -->
    <cms:editable name='featured_image' label='Featured Image'
        type='image' width='1200' height='630' />

    <cms:editable name='excerpt' label='Excerpt'
        type='textarea' maxlength='160' />

    <cms:editable name='content' label='Content'
        type='richtext' height='400' />

    <!-- SEO fields -->
    <cms:editable name='meta_title' label='Meta Title' type='text' />
    <cms:editable name='meta_description' label='Meta Description' type='textarea' />
</cms:template>

<!DOCTYPE html>
<html>
<head>
    <title>
        <cms:if k_is_page><cms:show k_page_title /> - </cms:if>My Blog
    </title>
</head>
<body>

<cms:if k_is_page>
    <!-- PAGE VIEW: Single blog post -->
    <article class="prose">
        <h1><cms:show k_page_title /></h1>

        <time datetime="<cms:date k_page_date format='Y-m-d' />">
            <cms:date k_page_date format='F j, Y' />
        </time>

        <cms:if featured_image>
            <img src="<cms:show featured_image />" alt="<cms:show k_page_title />" />
        </cms:if>

        <div class="content">
            <cms:show content />
        </div>

        <!-- Comments -->
        <cms:comments>
            <div class="comment">
                <strong><cms:show k_comment_author /></strong>
                <p><cms:show k_comment /></p>
            </div>
        </cms:comments>
    </article>

<cms:else />
    <!-- LIST VIEW: List of blog posts -->
    <div class="blog-listing">
        <h1>Latest Blog Posts</h1>

        <cms:pages limit='10' paginate='1'>
            <article class="card">
                <cms:if featured_image>
                    <img src="<cms:thumbnail featured_image width='400' />" />
                </cms:if>

                <h2>
                    <a href="<cms:show k_page_link />">
                        <cms:show k_page_title />
                    </a>
                </h2>

                <time><cms:date k_page_date format='F j, Y' /></time>

                <p><cms:show excerpt /></p>

                <a href="<cms:show k_page_link />" class="btn">Read More</a>
            </article>
        </cms:pages>

        <!-- Pagination -->
        <cms:paginator />
    </div>
</cms:if>

</body>
</html>
<?php COUCH::invoke(); ?>
```

## Portfolio Example

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Portfolio' clonable='1'>
    <cms:folder name='web-design' title='Web Design' />
    <cms:folder name='branding' title='Branding' />
    <cms:folder name='photography' title='Photography' />

    <cms:editable name='thumbnail' label='Thumbnail'
        type='image' width='600' height='400' crop='1' />

    <cms:editable name='description' label='Description'
        type='richtext' height='300' />

    <cms:editable name='client' label='Client Name' type='text' />
    <cms:editable name='project_date' label='Project Date' type='text' />
</cms:template>

<cms:if k_is_page>
    <!-- Single portfolio item -->
    <article>
        <h1><cms:show k_page_title /></h1>

        <dl>
            <dt>Client:</dt>
            <dd><cms:show client /></dd>

            <dt>Date:</dt>
            <dd><cms:show project_date /></dd>

            <dt>Category:</dt>
            <dd><cms:show k_page_foldertitle /></dd>
        </dl>

        <cms:show description />
    </article>

<cms:else />
    <!-- Portfolio grid -->
    <div class="portfolio-grid">
        <cms:pages>
            <div class="portfolio-item">
                <a href="<cms:show k_page_link />">
                    <img src="<cms:show thumbnail />" alt="<cms:show k_page_title />" />
                    <h3><cms:show k_page_title /></h3>
                </a>
            </div>
        </cms:pages>
    </div>
</cms:if>

<?php COUCH::invoke(); ?>
```

## Products/E-commerce Example

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Products' clonable='1'>
    <cms:editable name='product_image' label='Product Image'
        type='image' width='800' height='800' crop='1' />

    <cms:editable name='price' label='Price'
        type='text' search_type='decimal' />

    <cms:editable name='sku' label='SKU' type='text' />

    <cms:editable name='stock_status' label='Stock Status'
        type='radio' opt_values='In Stock | Out of Stock | Pre-order' />

    <cms:editable name='description' label='Description'
        type='richtext' height='300' />

    <cms:editable name='features' label='Features'
        type='checkbox'
        opt_values='Featured | New Arrival | Best Seller | On Sale' />
</cms:template>

<cms:if k_is_page>
    <!-- Single product -->
    <div class="product-detail">
        <img src="<cms:show product_image />" />

        <h1><cms:show k_page_title /></h1>
        <p class="price">$<cms:show price /></p>

        <cms:if stock_status='In Stock'>
            <button class="btn btn-primary">Add to Cart</button>
        <cms:else />
            <p class="out-of-stock">Out of Stock</p>
        </cms:if>

        <div class="description">
            <cms:show description />
        </div>
    </div>

<cms:else />
    <!-- Product listing -->
    <div class="product-grid">
        <cms:pages limit='12' paginate='1'>
            <div class="product-card">
                <img src="<cms:thumbnail product_image width='400' />" />

                <h3><cms:show k_page_title /></h3>
                <p class="price">$<cms:show price /></p>

                <cms:if "<cms:is_substr features='On Sale' />">
                    <span class="badge">Sale</span>
                </cms:if>

                <a href="<cms:show k_page_link />" class="btn">View Details</a>
            </div>
        </cms:pages>

        <cms:paginator />
    </div>
</cms:if>

<?php COUCH::invoke(); ?>
```

## Advanced Patterns

### With Folders (Categories)

```php
<cms:template title='Blog' clonable='1'>
    <cms:folder name='tutorials' title='Tutorials' />
    <cms:folder name='news' title='News' />
    <cms:folder name='updates' title='Updates' />
</cms:template>

<!-- Show posts from specific folder -->
<cms:pages folder='tutorials'>
    <h2><cms:show k_page_title /></h2>
</cms:pages>
```

### With Archives (Date-based)

```php
<!-- Show posts from specific month -->
<cms:pages start_on='2024-12-01' stop_before='2025-01-01'>
    <h2><cms:show k_page_title /></h2>
</cms:pages>

<!-- Generate archive links -->
<cms:archives masterpage='blog.php' type='monthly'>
    <a href="<cms:show k_archive_link />">
        <cms:date k_archive_date format='F Y' />
        (<cms:show k_archive_count /> posts)
    </a>
</cms:archives>
```

### With Pagination

```php
<cms:pages limit='10' paginate='1'>
    <article><cms:show k_page_title /></article>
</cms:pages>

<cms:paginator />
```

### Custom Ordering

```php
<!-- By publish date (newest first) -->
<cms:pages orderby='publish_date' order='desc'>

<!-- By title (alphabetical) -->
<cms:pages orderby='page_title' order='asc'>

<!-- By custom field -->
<cms:pages orderby='price' order='asc'>

<!-- By page weight (manual ordering) -->
<cms:pages orderby='weight' order='asc'>
```

## Integration Patterns

### With TailwindCSS + daisyUI

```php
<cms:if k_is_list>
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-8">Blog Posts</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <cms:pages limit='9' paginate='1'>
                <div class="card bg-base-100 shadow-xl">
                    <figure>
                        <img src="<cms:thumbnail featured_image width='600' />" />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title"><cms:show k_page_title /></h2>
                        <p><cms:show excerpt /></p>
                        <div class="card-actions justify-end">
                            <a href="<cms:show k_page_link />" class="btn btn-primary">
                                Read More
                            </a>
                        </div>
                    </div>
                </div>
            </cms:pages>
        </div>

        <div class="mt-8">
            <cms:paginator />
        </div>
    </div>
</cms:if>
```

### With Alpine.js

```html
<div x-data="{ filter: 'all' }">
    <!-- Filter buttons -->
    <div class="btn-group">
        <button x-on:click="filter = 'all'"
                x-bind:class="filter === 'all' ? 'btn-active' : ''"
                class="btn">All</button>
        <button x-on:click="filter = 'featured'"
                x-bind:class="filter === 'featured' ? 'btn-active' : ''"
                class="btn">Featured</button>
    </div>

    <!-- Posts -->
    <cms:pages>
        <article x-show="filter === 'all' || (filter === 'featured' && '<cms:is_substr features='Featured' />' === '1')"
                 x-transition>
            <h2><cms:show k_page_title /></h2>
        </article>
    </cms:pages>
</div>
```

## Best Practices

### DO

✅ **Always add view detection**
```php
<cms:if k_is_page>
    <!-- Single page -->
<cms:else />
    <!-- List of pages -->
</cms:if>
```

✅ **Use descriptive page names**
```text
Page title: "Introduction to CouchCMS"
Page name: "introduction-to-couchcms" (URL slug)
```

✅ **Set appropriate publish dates**
```php
<!-- Future posts hidden by default -->
<cms:pages show_future_entries='0'>
```

✅ **Use excerpts in listings**
```php
<cms:pages>
    <cms:show excerpt />  <!-- Short description -->
    <!-- Not: <cms:show content /> (too much) -->
</cms:pages>
```

✅ **Optimize images for listings**
```php
<cms:pages>
    <img src="<cms:thumbnail featured_image width='400' />" />
    <!-- Not: <cms:show featured_image /> (full size) -->
</cms:pages>
```

✅ **Add pagination to listings**
```php
<cms:pages limit='10' paginate='1'>
    <!-- content -->
</cms:pages>
<cms:paginator />
```

### DON'T

❌ **Don't forget clonable='1'**
```php
<!-- WRONG: Not clonable -->
<cms:template title='Blog'>

<!-- CORRECT: -->
<cms:template title='Blog' clonable='1'>
```

❌ **Don't forget to visit template as admin**
```text
After adding clonable='1', MUST visit:
http://site.com/blog.php (while logged in)
```

❌ **Don't show full content in listings**
```php
<!-- BAD: Shows entire post -->
<cms:pages>
    <cms:show content />
</cms:pages>

<!-- GOOD: Shows excerpt -->
<cms:pages>
    <cms:excerptHTML count='50'><cms:show content /></cms:excerptHTML>
</cms:pages>
```

❌ **Don't forget Pretty URLs .htaccess**
```text
After making template clonable:
1. Update .htaccess via admin panel
2. Or temporarily disable pretty URLs for testing
```

❌ **Don't use generic page names**
```text
BAD: "page1", "post-1", "test"
GOOD: "getting-started-with-couchcms"
```

## Troubleshooting

### Issue: Can't edit template directly anymore

**Cause**: Template is now clonable

**Solution**: This is correct behavior! Edit individual cloned pages, not the template itself.

### Issue: All content disappeared

**Cause**: Content moved to default page when template became clonable

**Solution**: Check admin panel - first page contains your old content.

### Issue: Cloned pages not accessible

**Cause**: Pretty URLs .htaccess not updated

**Solution**:
1. Go to admin panel → Settings
2. Click "Recreate .htaccess file"
3. Or temporarily disable pretty URLs in config.php

### Issue: List view shows nothing

**Cause**: Haven't added view detection or cms:pages loop

**Solution**:
```php
<cms:if k_is_list>
    <cms:pages>
        <h2><cms:show k_page_title /></h2>
    </cms:pages>
</cms:if>
```

### Issue: Default page title says "PLEASE CHANGE THIS TITLE"

**Cause**: Automatic default page created

**Solution**: Edit the page and change title/name - this is normal.

### Issue: Can only create one page

**Cause**: Template not set as clonable

**Solution**:
```php
<cms:template clonable='1'>  <!-- Add this -->
```

## Performance Tips

### Limit Results

```php
<!-- Don't load all pages at once -->
<cms:pages limit='10' paginate='1'>
```

### Use Thumbnails

```php
<!-- Generate smaller images for listings -->
<cms:thumbnail featured_image width='400' height='300' />
```

### Cache Listings

```php
<cms:cache '1 hour'>
    <cms:pages limit='10'>
        <!-- content -->
    </cms:pages>
</cms:cache>
```

### Optimize Queries

```php
<!-- Only load needed fields -->
<cms:pages>
    <cms:show k_page_title />
    <cms:show k_page_link />
    <!-- Don't access heavy richtext fields unnecessarily -->
</cms:pages>
```

## Related Concepts

- [Views](./views.md) - Understanding page vs list view
- [Editable Regions](./editable-regions.md) - Creating content fields
- [Folders](./folders.md) - Organizing cloned pages by category
- [Archives](./archives.md) - Date-based organization
- [Pagination](./pagination.md) - Paginating cloned page listings
- [Nested Pages](./nested-pages.md) - Alternative hierarchical structure

## See Also

- [`<cms:template>`](../../tags-reference/template.md) - Template definition with clonable parameter
- [`<cms:pages>`](../../tags-reference/pages.md) - List cloned pages
- [`<cms:paginator>`](../../tags-reference/paginator.md) - Pagination controls
- [`<cms:archives>`](../../tags-reference/archives.md) - Date-based archives
- [`<cms:folders>`](../../tags-reference/folders.md) - Category folders
