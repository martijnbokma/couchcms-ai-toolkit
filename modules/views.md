---
id: views
name: "Views"
category: "content"
version: "1.0"
description: "Understanding CouchCMS template views (page, list, folder, archive, home) and view detection patterns"
required: false
requires: [couchcms-core]
conflicts: []
---

# Views in CouchCMS

## Overview

Views are CouchCMS's way of handling different execution contexts for clonable templates. Understanding views is **fundamental** to working with dynamic content in CouchCMS.

### What are Views?

When a clonable template is accessed, it can execute in different "views" depending on the URL:
- **Page View** - Displays a single page's content
- **List View** - Lists multiple pages (home, folder, or archive)
- **Folder View** - Lists pages in a specific folder
- **Archive View** - Lists pages from a time period
- **Home View** - Lists all pages (root list view)

### Why Views Matter

- ✅ Control what content displays based on URL
- ✅ Single template handles multiple scenarios
- ✅ Enable blog-style layouts with list + detail pages
- ✅ Support folder and date-based organization
- ✅ Create dynamic navigation and archives

## The Split Personality

### Non-Clonable Template (Simple)

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='About Us'>
    <cms:editable name='content' type='richtext' />
</cms:template>
<!-- Always shows same content -->
<h1>About Us</h1>
<cms:show content />
<?php COUCH::invoke(); ?>
```

**URL**: `http://site.com/about.php`
**Behavior**: Single page, no views

### Clonable Template (Multiple Views)

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
    <h1>Blog Posts</h1>
    <cms:pages>
        <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
    </cms:pages>
</cms:if>
<?php COUCH::invoke(); ?>
```

**URLs**:
- `http://site.com/blog/` → List View
- `http://site.com/blog/my-post.html` → Page View

## View Types & Detection

### Page View

**When**: Single page is accessed
**URL**: `blog/my-post.html`

```php
<cms:if k_is_page>
    <!-- Display single page content -->
    <article>
        <h1><cms:show k_page_title /></h1>
        <time><cms:show k_page_date /></time>
        <div><cms:show content /></div>
    </article>
</cms:if>
```

**Variables Available**:
- `k_is_page = '1'`
- `k_page_title`, `k_page_name`, `k_page_id`
- `k_page_date`, `k_page_modification_date`
- All editable region contents

### List View (Home)

**When**: Template accessed without specific page/folder/archive
**URL**: `blog/`

```php
<cms:if k_is_home>
    <!-- Display all pages -->
    <h1>All Blog Posts</h1>
    <cms:pages masterpage='blog.php' limit='10'>
        <article>
            <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
            <cms:show k_excerpt />
        </article>
    </cms:pages>
</cms:if>
```

**Variables Available**:
- `k_is_list = '1'`
- `k_is_home = '1'`
- `k_folder_pagecount` (total pages)
- `k_folder_totalpagecount` (including subfolders)

### Folder View

**When**: Accessing a specific folder
**URL**: `blog/tutorials/`

```php
<cms:if k_is_folder>
    <!-- Display pages in this folder -->
    <h1><cms:show k_folder_title /></h1>
    <cms:pages folder=k_folder_name>
        <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
    </cms:pages>
</cms:if>
```

**Variables Available**:
- `k_is_list = '1'`
- `k_is_folder = '1'`
- `k_folder_id`, `k_folder_name`, `k_folder_title`
- `k_folder_link`
- `k_folder_pagecount`, `k_folder_totalpagecount`

### Archive View

**When**: Accessing date-based archive
**URL**: `blog/2024/12/`

```php
<cms:if k_is_archive>
    <!-- Display pages from this time period -->
    <h1>Posts from <cms:date k_archive_date format='F Y' /></h1>
    <cms:pages start_on=k_archive_date stop_before=k_next_archive_date>
        <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
    </cms:pages>
</cms:if>
```

**Variables Available**:
- `k_is_list = '1'`
- `k_is_archive = '1'`
- `k_archive_date`, `k_next_archive_date`
- `k_archive_link`
- `k_day`, `k_month`, `k_year`
- `k_is_day = '1'` (daily archive)
- `k_is_month = '1'` (monthly archive)
- `k_is_year = '1'` (yearly archive)

## Complete View Detection Pattern

### Method 1: Comprehensive (All Views Separated)

```php
<cms:if k_is_page>
    <!-- PAGE VIEW: Single post -->
    <h1><cms:show k_page_title /></h1>
    <cms:show content />

<cms:else />
    <!-- LIST VIEWS -->

    <cms:if k_is_folder>
        <!-- FOLDER VIEW -->
        <h1>Category: <cms:show k_folder_title /></h1>
        <cms:pages folder=k_folder_name>
            <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
        </cms:pages>
    </cms:if>

    <cms:if k_is_archive>
        <!-- ARCHIVE VIEW -->
        <h1>Archive: <cms:date k_archive_date format='F Y' /></h1>
        <cms:pages start_on=k_archive_date stop_before=k_next_archive_date>
            <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
        </cms:pages>
    </cms:if>

    <cms:if k_is_home>
        <!-- HOME VIEW -->
        <h1>All Posts</h1>
        <cms:pages limit='10'>
            <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
        </cms:pages>
    </cms:if>

</cms:if>
```

### Method 2: Simple (Page vs List)

```php
<cms:if k_is_list>
    <!-- ANY LIST VIEW: home, folder, or archive -->
    <h1>Blog Posts</h1>
    <cms:pages>
        <article>
            <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
            <cms:excerpt><cms:show content /></cms:excerpt>
        </article>
    </cms:pages>

<cms:else />
    <!-- PAGE VIEW: Single post -->
    <article>
        <h1><cms:show k_page_title /></h1>
        <cms:show content />
    </article>
</cms:if>
```

## Real-World Examples

### Blog with Categories and Archives

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Blog' clonable='1'>
    <cms:folder name='tutorials' title='Tutorials' />
    <cms:folder name='news' title='News' />
    <cms:editable name='content' type='richtext' />
    <cms:editable name='featured_image' type='image' />
</cms:template>

<cms:if k_is_page>
    <!-- Single blog post -->
    <article class="prose">
        <h1><cms:show k_page_title /></h1>
        <time><cms:date k_page_date format='F j, Y' /></time>
        <img src="<cms:show featured_image />" alt="<cms:show k_page_title />" />
        <cms:show content />
    </article>

<cms:else />
    <!-- List views -->
    <div class="grid gap-6">

        <!-- Page heading based on view -->
        <cms:if k_is_folder>
            <h1>Category: <cms:show k_folder_title /></h1>
        </cms:if>

        <cms:if k_is_archive>
            <h1>Archive: <cms:date k_archive_date format='F Y' /></h1>
        </cms:if>

        <cms:if k_is_home>
            <h1>Latest Posts</h1>
        </cms:if>

        <!-- List posts -->
        <cms:pages limit='10' paginate='1'>
            <article class="card">
                <img src="<cms:thumbnail featured_image width='400' />" />
                <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
                <cms:excerptHTML><cms:show content /></cms:excerptHTML>
                <a href="<cms:show k_page_link />" class="btn">Read More</a>
            </article>
        </cms:pages>

        <!-- Pagination -->
        <cms:paginator />
    </div>
</cms:if>
<?php COUCH::invoke(); ?>
```

### Portfolio with Folder Filtering

```php
<cms:if k_is_page>
    <!-- Single portfolio item -->
    <div class="portfolio-detail">
        <h1><cms:show k_page_title /></h1>
        <cms:show gallery />
        <cms:show description />
    </div>

<cms:else />
    <!-- Portfolio grid -->
    <div class="portfolio-filters">
        <a href="<cms:show k_template_link />"
           class="<cms:if k_is_home>active</cms:if>">All</a>

        <cms:folders>
            <a href="<cms:show k_folder_link />"
               class="<cms:if k_folder_name=k_folder_name>active</cms:if>">
                <cms:show k_folder_title />
            </a>
        </cms:folders>
    </div>

    <div class="grid grid-cols-3 gap-4">
        <cms:pages>
            <a href="<cms:show k_page_link />" class="portfolio-item">
                <img src="<cms:show thumbnail />" />
                <h3><cms:show k_page_title /></h3>
            </a>
        </cms:pages>
    </div>
</cms:if>
```

## View-Specific Variables Reference

### Available in ALL Views

```php
k_page_link              // Current URL
k_admin_link             // Admin panel URL
k_site_link              // Site root URL
k_template_name          // Template filename (e.g., 'blog.php')
k_template_title         // Template display name
k_template_id            // Template ID
k_template_link          // Template home URL
k_prettyurls             // '1' if Pretty URLs enabled
k_site_charset           // Site character encoding
```

### Page View Variables

```php
k_is_page = '1'          // View indicator
k_page_title             // Page title
k_page_name              // Page slug/name
k_page_id                // Page ID
k_page_date              // Publish date
k_page_modification_date // Last modified date
k_comments_count         // Number of comments

// Folder info (if page in folder)
k_page_folderid
k_page_foldername
k_page_foldertitle
k_page_folderlink

// All editable region contents available as variables
```

### List/Home View Variables

```php
k_is_list = '1'
k_is_home = '1'
k_folder_pagecount       // Total cloned pages
k_folder_totalpagecount  // Including subfolders
```

### Folder View Variables

```php
k_is_list = '1'
k_is_folder = '1'
k_folder_id              // Folder ID
k_folder_name            // Folder slug
k_folder_title           // Folder display name
k_folder_link            // Folder URL
k_folder_pagecount       // Pages in folder
k_folder_totalpagecount  // Including subfolders
```

### Archive View Variables

```php
k_is_list = '1'
k_is_archive = '1'
k_archive_date           // Archive period start date
k_next_archive_date      // Next period start (for filtering)
k_archive_link           // Archive URL
k_day                    // Day number (if daily)
k_month                  // Month number
k_year                   // Year number
k_is_day = '1'           // Daily archive indicator
k_is_month = '1'         // Monthly archive indicator
k_is_year = '1'          // Yearly archive indicator
```

## Integration Patterns

### With TailwindCSS + daisyUI

```php
<cms:if k_is_list>
    <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold mb-8">
            <cms:if k_is_folder><cms:show k_folder_title /></cms:if>
            <cms:if k_is_archive><cms:date k_archive_date format='F Y' /></cms:if>
            <cms:if k_is_home>Latest Posts</cms:if>
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <cms:pages limit='9' paginate='1'>
                <div class="card bg-base-100 shadow-xl">
                    <figure>
                        <img src="<cms:thumbnail featured_image width='400' />" />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title"><cms:show k_page_title /></h2>
                        <p><cms:excerptHTML count='100'><cms:show content /></cms:excerptHTML></p>
                        <div class="card-actions justify-end">
                            <a href="<cms:show k_page_link />" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </cms:pages>
        </div>

        <div class="mt-8">
            <cms:paginator />
        </div>
    </div>

<cms:else />
    <article class="prose lg:prose-xl mx-auto p-4">
        <h1><cms:show k_page_title /></h1>
        <cms:show content />
    </article>
</cms:if>
```

### With Alpine.js

```html
<div x-data="{ view: '<cms:if k_is_page>page<cms:else />list</cms:if>' }">
    <!-- View switcher -->
    <div class="btn-group" x-show="view === 'list'">
        <button x-on:click="$el.closest('.grid').classList.toggle('grid-cols-1')"
                class="btn">
            Grid
        </button>
        <button x-on:click="$el.closest('.grid').classList.toggle('list-view')"
                class="btn">
            List
        </button>
    </div>

    <cms:if k_is_list>
        <div class="grid grid-cols-3 gap-4" x-transition>
            <cms:pages>
                <article class="card">
                    <h2><cms:show k_page_title /></h2>
                </article>
            </cms:pages>
        </div>
    <cms:else />
        <article x-transition>
            <h1><cms:show k_page_title /></h1>
            <cms:show content />
        </article>
    </cms:if>
</div>
```

## Best Practices

### DO

✅ **Always detect view before rendering**
```php
<cms:if k_is_page>
    <!-- page content -->
<cms:else />
    <!-- list content -->
</cms:if>
```

✅ **Use specific view variables**
```php
<cms:if k_is_folder>
    <h1><cms:show k_folder_title /></h1>
    <cms:pages folder=k_folder_name>
```

✅ **Provide appropriate content for each view**
```php
<!-- List: show excerpt -->
<cms:excerptHTML count='200'><cms:show content /></cms:excerptHTML>

<!-- Page: show full content -->
<cms:show content />
```

✅ **Use pagination in list views**
```php
<cms:pages limit='10' paginate='1'>
    <!-- content -->
</cms:pages>
<cms:paginator />
```

✅ **Debug with dump_all**
```php
<cms:dump_all /> <!-- See all available variables -->
```

### DON'T

❌ **Don't assume view without checking**
```php
<!-- BAD: Will break in list view -->
<h1><cms:show k_page_title /></h1>
```

❌ **Don't access page variables in list view**
```php
<cms:if k_is_list>
    <!-- k_page_title NOT available here -->
    <h1><cms:show k_page_title /></h1> <!-- ERROR -->
</cms:if>
```

❌ **Don't forget clonable='1'**
```php
<!-- Views only work with clonable templates -->
<cms:template title='Blog' clonable='1'>
```

❌ **Don't use wrong variable names**
```php
<!-- WRONG -->
<cms:show k_folder_name />

<!-- CORRECT (in folder view) -->
<cms:if k_is_folder>
    <cms:show k_folder_title />
</cms:if>
```

## Debugging Views

### See All Variables

```php
<h2>Current View Debug Info</h2>
<cms:dump_all />
```

### View Detection Checker

```php
<div class="debug-panel">
    <h3>Current View:</h3>
    <ul>
        <li>k_is_page: <cms:show k_is_page /></li>
        <li>k_is_list: <cms:show k_is_list /></li>
        <li>k_is_home: <cms:show k_is_home /></li>
        <li>k_is_folder: <cms:show k_is_folder /></li>
        <li>k_is_archive: <cms:show k_is_archive /></li>
    </ul>

    <cms:if k_is_page>
        <p>✓ Page View: <cms:show k_page_title /></p>
    </cms:if>

    <cms:if k_is_folder>
        <p>✓ Folder View: <cms:show k_folder_title /></p>
    </cms:if>

    <cms:if k_is_archive>
        <p>✓ Archive View: <cms:date k_archive_date format='F Y' /></p>
    </cms:if>

    <cms:if k_is_home>
        <p>✓ Home View</p>
    </cms:if>
</div>
```

## Troubleshooting

### Issue: Variables not available

**Cause**: Wrong view or template not clonable

**Solution**:
```php
<!-- 1. Ensure template is clonable -->
<cms:template clonable='1'>

<!-- 2. Check which view you're in -->
<cms:dump_all />

<!-- 3. Use view-specific variables -->
<cms:if k_is_page>
    <cms:show k_page_title />  <!-- Only in page view -->
</cms:if>
```

### Issue: Editable regions empty in list view

**Cause**: Editable regions only available in page view

**Solution**:
```php
<cms:if k_is_list>
    <!-- Use cms:pages to access page data -->
    <cms:pages>
        <cms:show k_page_title />  <!-- Available here -->
        <cms:show content />        <!-- Available here -->
    </cms:pages>
</cms:if>
```

### Issue: Always showing same content

**Cause**: Template not set as clonable

**Solution**:
```php
<cms:template title='Blog' clonable='1'>  <!-- Add clonable='1' -->
```

### Issue: Can't distinguish between folder and archive view

**Cause**: Testing k_is_list instead of specific view

**Solution**:
```php
<!-- Use specific view variables -->
<cms:if k_is_folder>
    <!-- Folder view -->
<cms:else_if k_is_archive />
    <!-- Archive view -->
<cms:else_if k_is_home />
    <!-- Home view -->
</cms:if>
```

## Related Concepts

- [Cloned Pages](./cloned-pages.md) - Creating multiple pages from templates
- [Listing Pages](./listing-pages.md) - Using `<cms:pages>` to display content
- [Folders](./folders.md) - Organizing pages in folders
- [Archives](./archives.md) - Date-based organization
- [Pagination](./pagination.md) - Paginating list views

## See Also

- [`<cms:pages>`](../../tags-reference/pages.md) - List pages with filtering
- [`<cms:if>`](../../tags-reference/if.md) - Conditional logic
- [`<cms:dump_all>`](../../tags-reference/dump_all.md) - Debug variables
- [`<cms:template>`](../../tags-reference/template.md) - Template definition
