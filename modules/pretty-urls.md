---
title: Pretty URLs
description: SEO-friendly URLs in CouchCMS - transform querystring URLs into clean, meaningful paths
category: core
tags: [pretty-urls, seo, url-rewriting, htaccess, mod-rewrite]
difficulty: intermediate
---

# Pretty URLs in CouchCMS

CouchCMS supports Pretty URLs (also known as SEF - Search Engine Friendly URLs) that transform default querystring URLs into clean, meaningful paths that benefit both visitors and search engines.

## Overview

**What You'll Learn:**
- Understanding Pretty URLs and their SEO benefits
- Enabling Pretty URLs in CouchCMS
- Generating and configuring .htaccess file
- Converting relative to absolute paths
- Troubleshooting common issues
- Best practices for URL structure

**Before Pretty URLs:**
```
http://www.mysite.com/blog.php?p=12
http://www.mysite.com/blog.php?f=3
```

**After Pretty URLs:**
```
http://www.mysite.com/blog/electronics/mobile-phones.html
http://www.mysite.com/blog/electronics/
```

---

## Why Pretty URLs Matter

### SEO Benefits
- **Descriptive URLs** - Search engines understand page content from URL
- **Keyword visibility** - Folder/page names appear in search results
- **Better rankings** - Google prefers semantic URLs
- **Click-through rate** - Users more likely to click meaningful URLs

### User Experience
- **Memorable** - Easier to remember and share
- **Trustworthy** - Look more professional and legitimate
- **Navigation hints** - URL structure reveals site hierarchy

---

## Requirements

### Server Requirements

**Apache mod_rewrite Module Required**

Check if mod_rewrite is enabled:
1. Visit: `http://www.yoursite.com/couch/gen_htaccess.php`
2. If rules appear, mod_rewrite is enabled
3. If error occurs, contact your hosting provider

**Alternative Test:**
Use the [official CouchCMS testing utility](https://www.couchcms.com/forum/viewtopic.php?p=11832#p11832)

### Template Requirements

Pretty URLs apply **only to clonable templates**:
```php
<cms:template title='Blog' clonable='1' routable='1'>
```

**Important:** Configure all clonable templates BEFORE enabling Pretty URLs!

---

## Enabling Pretty URLs

### Step 1: Configure config.php

Find this line in `couch/config.php`:

```php
// 8.
// Set the following to '1' if you wish to enable Pretty URLS.
// After enabling it, use gen_htaccess.php to generate an .htaccess file
// and place it in the root folder of your site.
define( 'K_PRETTY_URLS', 0 );
```

Change to:
```php
define( 'K_PRETTY_URLS', 1 );
```

### Step 2: Generate .htaccess File

1. **Visit:** `http://www.yoursite.com/couch/gen_htaccess.php`
2. **Select All:** Press `Ctrl + A` (or `Cmd + A` on Mac)
3. **Copy:** Press `Ctrl + C`
4. **Create file:** Name it `.htaccess`
5. **Paste:** The entire content from gen_htaccess.php
6. **Upload:** Place in your website's **root directory**

### Creating .htaccess on Windows

Windows doesn't allow files without names. Solutions:

**Option 1:** Temporary name
1. Create `dummy.htaccess`
2. Upload to server
3. Rename to `.htaccess` via FTP

**Option 2:** Notepad trick
1. Open Notepad
2. Save As...
3. Filename: `".htaccess"` (with quotes)
4. This creates `.htaccess` successfully

---

## URL Structure Examples

### Folder View
```
Before: http://www.mysite.com/blog.php?f=3
After:  http://www.mysite.com/blog/electronics/
```

### Page View
```
Before: http://www.mysite.com/blog.php?p=12
After:  http://www.mysite.com/blog/electronics/mobile-phones.html
```

### Archive View
```
Before: http://www.mysite.com/blog.php?d=2024-12
After:  http://www.mysite.com/blog/2024/12/
```

### Home/List View
```
Before: http://www.mysite.com/blog.php
After:  http://www.mysite.com/blog/
```

---

## Absolute vs Relative Paths

### The Problem

After enabling Pretty URLs, relative paths break:

```html
<!-- ❌ BROKEN - Relative path -->
<link href="css/style.css" rel="stylesheet" />
<img src="images/logo.png" alt="Logo" />
<script src="js/script.js"></script>
```

**Why?** Browser resolves relative to current URL path:
- Before: `/blog.php` → `/css/style.css` ✅
- After: `/blog/electronics/` → `/blog/electronics/css/style.css` ❌

### The Solution: Absolute Paths

**Option 1: Root-relative (leading slash)**
```html
<link href="/css/style.css" rel="stylesheet" />
<img src="/images/logo.png" alt="Logo" />
<script src="/js/script.js"></script>
```

**Option 2: CouchCMS k_site_link (RECOMMENDED)**
```html
<link href="<cms:show k_site_link />css/style.css" rel="stylesheet" />
<img src="<cms:show k_site_link />images/logo.png" alt="Logo" />
<script src="<cms:show k_site_link />js/script.js"></script>
```

**Why k_site_link is better:**
- Works in subdirectories
- Works on localhost
- Portable across environments
- No hardcoded paths

---

## Regenerating .htaccess

### When to Regenerate

You must regenerate .htaccess when:
- ✅ Adding new clonable templates
- ✅ Changing template names
- ✅ Modifying `routable='1'` settings
- ✅ Adding custom routes

### How to Regenerate

1. Visit `http://www.yoursite.com/couch/gen_htaccess.php`
2. Copy ALL content (Ctrl + A)
3. Replace ENTIRE .htaccess file
4. Upload to root directory

**Important:** Don't edit .htaccess manually - always regenerate!

---

## Troubleshooting

### 1. Internal Server Error (500)

**Symptoms:**
- Site throws HTTP 500 error
- Pages completely inaccessible

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| mod_rewrite not enabled | Contact hosting provider to enable mod_rewrite |
| Old Apache version | Upgrade Apache or use different hosting |
| Incorrect .htaccess syntax | Regenerate with gen_htaccess.php |
| .htaccess in wrong location | Must be in website ROOT, not /couch/ |

**Test mod_rewrite:**
```
Visit: yoursite.com/couch/gen_htaccess.php
If rules appear → mod_rewrite is enabled
If error → mod_rewrite is disabled
```

### 2. Pages Load But CSS/JS/Images Broken

**Symptoms:**
- Page loads with no styling
- Images don't display
- JavaScript doesn't work
- Browser console shows 404 errors

**Cause:** Relative paths in assets

**Solution:** Convert to absolute paths

```html
<!-- ❌ BEFORE (Relative) -->
<link href="css/style.css" rel="stylesheet" />

<!-- ✅ AFTER (Absolute) -->
<link href="<cms:show k_site_link />css/style.css" rel="stylesheet" />
```

### 3. Pretty URLs Not Working

**Checklist:**
- [ ] `K_PRETTY_URLS` set to `1` in config.php
- [ ] .htaccess file exists in root directory
- [ ] .htaccess contains ALL rules from gen_htaccess.php
- [ ] mod_rewrite enabled on server
- [ ] Template is clonable (`clonable='1'`)
- [ ] Template is routable (`routable='1'`)

### 4. 404 Not Found

**Symptoms:**
- Clicking links gives 404 error
- URLs show pretty format but don't work

**Solutions:**
1. Regenerate .htaccess (might be outdated)
2. Check template has `routable='1'`
3. Clear browser cache
4. Check RewriteBase in .htaccess if in subdirectory

### 5. Subdirectory Installation

If CouchCMS is in subdirectory (`/site/`), modify .htaccess:

```apache
# Add this line at top of .htaccess
RewriteBase /site/
```

Then regenerate rules with gen_htaccess.php

---

## Best Practices

### Planning
- Configure ALL clonable templates first
- Test in development environment
- Enable Pretty URLs LAST (after all templates ready)

### Asset Paths
- Always use `<cms:show k_site_link />` for assets
- Never use relative paths (`./`, `../`)
- Verify all CSS, JS, images use absolute paths

### .htaccess Management
- Keep backup of .htaccess file
- Regenerate after template changes
- Don't manually edit rewrite rules
- Version control .htaccess (optional)

### Testing
- Test all page types (page, list, folder, archive)
- Check all asset loading
- Verify forms still work
- Test on multiple browsers

### SEO Optimization
- Use descriptive page names (slugs)
- Use lowercase URLs
- Separate words with hyphens (not underscores)
- Keep URLs short and meaningful

---

## Integration with TailwindCSS & Modern Frameworks

### Asset Loading

```html
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title><cms:show k_page_title /></title>

   <!-- ✅ TailwindCSS - Absolute path -->
   <link href="<cms:show k_site_link />css/output.css" rel="stylesheet" />

   <!-- ✅ Alpine.js CDN - No path issues -->
   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

   <!-- ✅ Custom JS - Absolute path -->
   <script src="<cms:show k_site_link />js/app.js"></script>
</head>
<body>
   <!-- Content -->
</body>
</html>
```

### Dynamic URLs in JavaScript

```html
<script>
   // Make k_site_link available to JavaScript
   const SITE_URL = '<cms:show k_site_link />';

   // Use in AJAX calls
   fetch(SITE_URL + 'api/data.php')
      .then(response => response.json())
      .then(data => console.log(data));
</script>
```

### Alpine.js with Pretty URLs

```html
<div x-data="{
   apiUrl: '<cms:show k_site_link />',
   loadData() {
      fetch(this.apiUrl + 'api/products.php')
         .then(r => r.json())
         .then(data => this.products = data);
   }
}">
   <button x-on:click="loadData()">Load Products</button>
</div>
```

---

## Complete Example

### Template Setup

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Blog' clonable='1' routable='1'>
   <cms:editable name='blog_content' type='richtext' />
   <cms:editable name='blog_image' type='image' />

   <cms:folder name='electronics' title='Electronics' />
   <cms:folder name='news' title='News' />
</cms:template>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title><cms:show k_page_title /> - <cms:show k_site_title /></title>

   <!-- ✅ Absolute paths for assets -->
   <link href="<cms:show k_site_link />css/output.css" rel="stylesheet" />
   <link rel="icon" href="<cms:show k_site_link />favicon.ico" />
</head>
<body>
   <nav class="bg-base-100">
      <ul class="menu menu-horizontal">
         <li><a href="<cms:show k_site_link />">Home</a></li>
         <li><a href="<cms:link />">Blog</a></li>
      </ul>
   </nav>

   <main class="container mx-auto">
      <cms:if k_is_page>
         <!-- Page View -->
         <article>
            <h1><cms:show k_page_title /></h1>
            <img src="<cms:show blog_image />" alt="<cms:show k_page_title />" class="rounded-box" />
            <cms:show blog_content />
         </article>

         <!-- ✅ Pretty URL: /blog/electronics/mobile-phones.html -->

      <cms:else />
         <!-- List View -->
         <cms:pages>
            <div class="card bg-base-100">
               <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
               <cms:excerptHTML blog_content />
            </div>
         </cms:pages>

         <!-- ✅ Pretty URL: /blog/ or /blog/electronics/ -->
      </cms:if>
   </main>

   <script src="<cms:show k_site_link />js/app.js"></script>
</body>
</html>
<?php COUCH::invoke(); ?>
```

### Generated .htaccess Example

```apache
# Generated by CouchCMS gen_htaccess.php
RewriteEngine On

# Blog template
RewriteRule ^blog/([^/]+)/([^/]+)\.html$ blog.php?p=$2 [L,QSA]
RewriteRule ^blog/([^/]+)/$ blog.php?f=$1 [L,QSA]
RewriteRule ^blog/$ blog.php [L,QSA]

# Add more rules as needed for other templates
```

---

## URL Structure Patterns

### Blog Pattern
```
/blog/                          → List view (all posts)
/blog/category/                 → Folder view (posts in category)
/blog/category/post-slug.html  → Page view (single post)
/blog/2024/12/                  → Archive view (monthly)
```

### Portfolio Pattern
```
/portfolio/                     → List view (all projects)
/portfolio/web-design/          → Folder view (web design projects)
/portfolio/web-design/site1.html → Page view (single project)
```

### Documentation Pattern
```
/docs/                          → List view (all docs)
/docs/getting-started/          → Folder view (category)
/docs/getting-started/install.html → Page view (article)
```

---

## Advanced Configuration

### Custom Slugs

Control URL segments with page name:

```php
<!-- Page title: "Getting Started with CouchCMS" -->
<!-- Page name: "getting-started" -->
<!-- Pretty URL: /docs/getting-started.html -->
```

**Best practices:**
- Use lowercase
- Replace spaces with hyphens
- Remove special characters
- Keep short and descriptive

### File Extension

By default, pages end with `.html`:
```
/blog/my-post.html
```

This can be configured in template settings or custom routes.

### Nested Folders

Pretty URLs support deep nesting:

```
/products/electronics/computers/laptops/macbook-pro.html
```

Each segment represents a folder level in CouchCMS.

---

## Migration Checklist

When enabling Pretty URLs on existing site:

- [ ] **Backup everything** (files and database)
- [ ] Test on staging/development first
- [ ] Set `K_PRETTY_URLS = 1` in config.php
- [ ] Generate .htaccess with gen_htaccess.php
- [ ] Upload .htaccess to root directory
- [ ] Convert all asset paths to absolute
- [ ] Test all templates (page/list/folder/archive views)
- [ ] Check all images load correctly
- [ ] Verify CSS styling works
- [ ] Test JavaScript functionality
- [ ] Check forms submit correctly
- [ ] Test on multiple browsers
- [ ] Set up 301 redirects for old URLs (if needed)
- [ ] Update sitemap
- [ ] Update Google Search Console

---

## Common Mistakes

### Mistake 1: Enabling Too Early
```
❌ Enable Pretty URLs → Add templates → Broken URLs
✅ Add all templates → Configure → Enable Pretty URLs
```

### Mistake 2: Forgetting to Regenerate
```
❌ Add new template → URLs don't work
✅ Add new template → Regenerate .htaccess
```

### Mistake 3: Relative Paths
```
❌ <img src="images/logo.png" />
✅ <img src="<cms:show k_site_link />images/logo.png" />
```

### Mistake 4: Wrong .htaccess Location
```
❌ /couch/.htaccess
❌ /public_html/site/.htaccess (if site is in root)
✅ /public_html/.htaccess (website root)
```

---

## Related Concepts

- **Templates** - Pretty URLs only work with clonable templates
- **Folders** - Folder structure appears in URLs
- **Custom Routes** - Advanced URL customization
- **Nested Pages** - Hierarchical URLs for page trees
- **k_page_link** - Variable containing pretty URL
- **k_site_link** - Base URL for absolute paths

---

## Related Variables

- `<cms:show k_page_link />` - Full pretty URL to current page
- `<cms:show k_site_link />` - Base site URL (for absolute paths)
- `<cms:show k_pretty_urls />` - Returns 1 if enabled, 0 if disabled
- `<cms:link />` - Generates link to template (respects pretty URLs)

---

## Additional Resources

- [CouchCMS Forums - mod_rewrite Test](https://www.couchcms.com/forum/viewtopic.php?p=11832#p11832)
- [Apache mod_rewrite Documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [.htaccess Tutorial](https://httpd.apache.org/docs/current/howto/htaccess.html)
