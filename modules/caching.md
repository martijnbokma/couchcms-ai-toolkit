---
title: Caching (Midware)
description: High-performance page caching in CouchCMS - serve static files for lightning-fast load times
category: midware
tags: [caching, performance, cache, K_USE_CACHE, no_cache, midware, optimization]
difficulty: intermediate
---

# Caching in CouchCMS

CouchCMS provides powerful caching that serves pre-generated static files for lightning-fast page loads. Cache automatically invalidates when pages are modified and intelligently bypasses requests that shouldn't be cached.

## Overview

**What You'll Learn:**
- Enabling page caching with K_USE_CACHE
- How CouchCMS caching works internally
- Cache invalidation and purging
- Excluding pages from cache
- Handling forms and dynamic content
- Opcode and settings caching
- Troubleshooting cache issues

**Key Benefits:**
- **Lightning fast** - Serve static HTML files
- **No database queries** - Cached pages skip MySQL entirely
- **Smart invalidation** - Auto-refresh when content changes
- **Transparent** - Browser doesn't know if page is cached
- **Selective** - Control what gets cached

---

## Part I: Page Caching

### Enabling Cache

Edit `couch/config.php`:

```php
define( 'K_USE_CACHE', 1 );
```

**Verify caching is active:**

View page source (while logged out) and look for:
```html
<!-- Cached page -->
```

This comment appears at bottom of all cached HTML pages.

---

## How Page Caching Works

### Cache Flow (Pseudo-code)

```
if (caching is on) {
   if (user NOT logged-in AND NOT using nc=1) {
      if (URL exists in cache) {
         if (cache NOT invalidated) {
            return cached_file  // ← Fast exit!
         }
      }
   }
}

// If we reach here, generate page dynamically
output = parse_template()  // Run all Couch tags

if (caching is on) {
   if (<cms:no_cache /> NOT used) {
      save output to cache
   }
}

return output
```

### Cache File Storage

- **Location:** `couch/cache/` folder
- **Filename:** MD5 hash of the URL
- **Permissions:** Must be writable (777)

---

## Conditions for Cache

**ALL conditions must be met** for cache to be used:

1. ✅ Website NOT offline (`K_SITE_OFFLINE = 0`)
2. ✅ Frontend page (not admin panel)
3. ✅ Cache enabled (`K_USE_CACHE = 1`)
4. ✅ Request method NOT 'POST'
5. ✅ URL does NOT contain `nc=1`
6. ✅ User NOT authenticated (logged out)
7. ✅ `<cms:no_cache />` NOT used in template
8. ✅ `couch/cache/` directory is writable

**If ANY condition fails, page is generated dynamically.**

---

## Cache Invalidation

### Automatic Invalidation

**Anytime you hit 'save' while editing ANY page of ANY template, the cache gets invalidated for ALL templates.**

This ensures content is always fresh after updates.

### Manual Invalidation

Use `<cms:db_persist>` with `_invalidate_cache` parameter:

```php
<cms:db_persist
   _mode='edit'
   _masterpage=k_template_name
   _page_id=k_page_id
   _invalidate_cache='1'
/>
```

**Note:** Must be called within a page view.

### Programmatic Invalidation

Use custom functions for advanced control:
- [invalidate-cache](https://github.com/trendoman/Cms-Fu/tree/master/Cache/invalidate-cache)
- [uncache-by-pagelink](https://github.com/trendoman/Cms-Fu/tree/master/Cache/uncache-by-pagelink)

---

## Cache Purging

### Automatic Purging

**Purge Interval:**
```php
// In couch/config.php
K_CACHE_PURGE_INTERVAL = 24  // hours
```

Purge routine runs every 24 hours (default) to delete invalidated files.

**Maximum Cache Age:**
```php
K_MAX_CACHE_AGE = 7  // days
```

Files older than 7 days (default) are automatically deleted.

---

## Bypassing Cache

### For Testing (nc=1)

Add `nc=1` to querystring to bypass cache:

```
http://www.mysite.com/page.php?nc=1
```

Page will be generated dynamically.

### Logged-In Users

Cache is **automatically bypassed** for:
- Super-admin users
- Admin users
- Logged-in registered users (with Extended Users addon)

### Exclude Specific Pages

Use `<cms:no_cache />` tag anywhere in template:

```php
<?php require_once('couch/cms.php'); ?>

<cms:no_cache />

<!-- This page will NEVER be cached -->
<h1>Real-time Dashboard</h1>
<?php COUCH::invoke(); ?>
```

---

## Handling Forms

### Forms Never Cached

**POST requests are NEVER cached** - they're always processed dynamically.

```php
<form method="post" action="">
   <!-- Form will always be processed dynamically -->
   <input type="text" name="name" />
   <button type="submit">Submit</button>
</form>
```

This ensures form submissions are properly handled.

---

## Dynamic Content on Cached Pages

### The Problem

Cache is **not granular** - entire page is cached, not individual sections.

**Scenario:** Want current time display on otherwise static page.

### The Solution: AJAX

Load dynamic content via JavaScript after page loads:

```php
<?php require_once('couch/cms.php'); ?>

<!DOCTYPE html>
<html>
<head>
   <title>My Page</title>
</head>
<body>
   <!-- Static cached content -->
   <h1>Welcome!</h1>

   <!-- Dynamic content loaded via AJAX -->
   <div id="current-time">Loading...</div>

   <script>
      fetch('?nc=1&action=getTime', {
         method: 'POST'
      })
      .then(r => r.text())
      .then(time => {
         document.getElementById('current-time').innerHTML = time;
      });
   </script>

   <!-- Dynamic content handler (runs on POST) -->
   <cms:if "<cms:is_ajax />">
      <cms:abort msg="<cms:date format='H:i:s' />" />
   </cms:if>
</body>
</html>
<?php COUCH::invoke(); ?>
```

**How it works:**
1. Page loads from cache (fast)
2. JavaScript makes AJAX request with POST or `nc=1`
3. Dynamic handler runs (bypasses cache)
4. Updates specific element

---

## Randomized Content

### The Problem

```php
<cms:pages orderby='random' limit='10'>
```

With cache, you'll get same "random" pages every time!

### The Solution: Unique URLs

Add random parameter to querystring:

```php
<cms:set blog_link="<cms:link 'blog.php' />" />
<cms:add_querystring blog_link qs="orderby=random&rnd=<cms:date format='His' />" />

<!-- Result: blog.php?orderby=random&rnd=150436 -->
```

Or use random string:

```php
<cms:add_querystring blog_link qs="orderby=random&rnd=<cms:random_name />" />

<!-- Result: blog.php?orderby=random&rnd=9e048bcc9d9775b4cfdfba42527323eb -->
```

**Important:** Do NOT use `paginate='1'` with `orderby='random'`!

Pagination uses a seed that prevents true randomization.

---

## Query String Strategy

### URL-Based Caching

Cache respects querystrings - different queries create different cache files:

```
blog.php          → cached as file_1.html
blog.php?pg=2     → cached as file_2.html
blog.php?limit=20 → cached as file_3.html
```

### Best Practices

**❌ Bad URL design:**
```
blog.php?pg=5
```
Changing items-per-page won't create new cache (wrong number of items shown).

**✅ Good URL design:**
```
blog.php?pg=5&limit=10
blog.php?pg=3&limit=25
```
Each configuration gets separate cache file.

**Example:**
```php
<cms:set current_limit="<cms:gpc 'limit' default='10' />" />
<cms:set page="<cms:gpc 'pg' default='1' />" />

<cms:pages limit=current_limit>
   <!-- Content -->
</cms:pages>

<!-- Pagination links include limit -->
<a href="?pg=2&limit=<cms:show current_limit />">Next</a>
```

---

## Dynamic Assets (CSS/JS)

### Making Assets Cacheable

If CSS/JS needs Couch processing:

**1. Rename to .php:**
```
styles.css → styles.php
script.js → script.php
```

**2. Add CouchCMS hooks:**

**For CSS:**
```php
<?php require_once('couch/cms.php'); ?>
<cms:content_type 'text/css' />

body {
   background: <cms:show site_bg_color />;
}

<?php COUCH::invoke(); ?>
```

**For JavaScript:**
```php
<?php require_once('couch/cms.php'); ?>
<cms:content_type 'application/javascript' />

const API_URL = '<cms:show k_site_link />api/';
const USER_ID = '<cms:show k_user_id />';

<?php COUCH::invoke(); ?>
```

**3. Link with .php extension:**
```html
<link href="<cms:show k_site_link />styles.php" rel="stylesheet" />
<script src="<cms:show k_site_link />script.php"></script>
```

Cache will apply to these files normally.

---

## Part II: Code Caching

### Opcode Caching

CouchCMS caches **compiled output** of snippets, functions, and settings.

**Enable/Disable in `couch/header.php`:**

```php
define( 'K_CACHE_OPCODES', '1' );   // Snippet opcodes
define( 'K_CACHE_SETTINGS', '1' );  // Settings
```

### Storage

Cached entries stored in `couch_settings` database table.

**Identifying cache entries:**
- **Cache:** Keys are MD5 hashes (e.g., `08f45742fcfadb1df8e438d006d132fb`)
- **Settings:** Keys are readable (e.g., `k_couch_version`, `nonce_secret_key`)

### Clearing Code Cache

**Safe to delete:** Rows with MD5 hash keys

**DO NOT delete:** Rows with human-readable keys

**Nuclear option:** Disable caching temporarily:
```php
define( 'K_CACHE_OPCODES', '0' );
define( 'K_CACHE_SETTINGS', '0' );
```

---

## Troubleshooting

### Cache Not Working

**Check:**
1. ✅ `K_USE_CACHE = 1` in config.php
2. ✅ `couch/cache/` folder exists
3. ✅ `couch/cache/` has write permissions (777)
4. ✅ Logged out of admin panel
5. ✅ No `<cms:no_cache />` in template
6. ✅ View source shows `<!-- Cached page -->`

### Cache Files Not Appearing

**Solution:**
```bash
chmod 777 couch/cache/
```

Check if view-source shows "Generated" or "Cached" comment.

### Content Not Updating

**Cause:** Cache not invalidated

**Solution:**
1. Edit any page in admin
2. Click "Save"
3. Cache automatically invalidates

### Aggressive Browser Caching

**Problem:** Browser caches too aggressively

**Solution:** Add to `couch/config.php`:

```php
if( defined('K_ADMIN') ){
   // HTTP headers for no cache
   header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
   header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
   header("Cache-Control: no-store, no-cache, must-revalidate");
   header("Cache-Control: post-check=0, pre-check=0", false);
   header("Pragma: no-cache");
}
```

For frontend (if absolutely necessary):
```php
// Remove if( defined('K_ADMIN') ) wrapper
header("Cache-Control: no-store, no-cache, must-revalidate");
```

### Same Content, Different Requests

**Problem:** Visitor changes display (10/25/100 items) but cache serves same content

**Solution:** Include parameters in querystring:

```php
<a href="?limit=10&pg=1">Show 10</a>
<a href="?limit=25&pg=1">Show 25</a>
<a href="?limit=100&pg=1">Show 100</a>
```

Each URL creates separate cache file.

---

## Best Practices

### When to Cache

**✅ Cache these:**
- Blog posts
- News articles
- Product pages (updated infrequently)
- Static content pages
- About/Contact pages
- Archive pages

**❌ Don't cache these:**
- User dashboards
- Shopping carts
- Real-time data
- Personalized content
- Forms (auto-bypassed anyway)

### Performance Tips

1. **Enable caching** - Massive performance gain
2. **Monitor cache folder** - Ensure write permissions
3. **Use AJAX for dynamic parts** - Keep page cacheable
4. **Design URLs wisely** - Include relevant parameters
5. **Avoid random without unique URLs** - Won't work with cache

### Cache Busting

**During development:**
- Use `nc=1` in URL for testing
- Stay logged in (cache bypassed)
- Set `K_USE_CACHE = 0` temporarily

**For users:**
- Cache invalidates automatically on save
- No manual clearing needed

---

## Integration with Modern Frameworks

### TailwindCSS

Tailwind CSS files are static - **no special handling needed**:

```html
<link href="<cms:show k_site_link />css/output.css" rel="stylesheet" />
```

### Alpine.js

Alpine.js works perfectly with cached pages:

```html
<!-- Cached page -->
<div x-data="{ open: false }">
   <button x-on:click="open = !open">Toggle</button>
   <div x-show="open">Dynamic content</div>
</div>
```

JavaScript functionality runs client-side after page loads.

### Dynamic API Calls

```html
<!-- Cached page -->
<div id="products"></div>

<script>
   // Load dynamic data after page loads
   fetch('<cms:show k_site_link />api/products.php')
      .then(r => r.json())
      .then(data => {
         document.getElementById('products').innerHTML =
            data.map(p => `<div>${p.name}</div>`).join('');
      });
</script>
```

---

## Complete Example

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Blog' clonable='1'>
   <cms:editable name='content' type='richtext' />
</cms:template>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title><cms:if k_is_page><cms:show k_page_title /><cms:else />Blog</cms:if></title>
   <link href="<cms:show k_site_link />css/output.css" rel="stylesheet" />
</head>
<body>
   <cms:if k_is_page>
      <!-- Page View - CACHED -->
      <article class="container mx-auto p-6">
         <h1 class="text-4xl font-bold"><cms:show k_page_title /></h1>
         <div class="prose">
            <cms:show content />
         </div>

         <!-- Page view counter - loaded dynamically -->
         <div class="mt-6">
            Views: <span id="view-count">Loading...</span>
         </div>

         <script>
            // Load view count via AJAX (bypasses cache)
            fetch('?nc=1&action=viewCount&id=<cms:show k_page_id />', {
               method: 'POST'
            })
            .then(r => r.text())
            .then(count => {
               document.getElementById('view-count').innerHTML = count;
            });
         </script>

         <!-- AJAX handler for view count -->
         <cms:if "<cms:is_ajax />">
            <cms:if "<cms:gpc 'action' method='post' />" eq 'viewCount'>
               <cms:set page_id="<cms:gpc 'id' method='post' />" />
               <!-- Get/increment view count logic here -->
               <cms:abort msg='1,234' />
            </cms:if>
         </cms:if>
      </article>

   <cms:else />
      <!-- List View - CACHED -->
      <div class="container mx-auto p-6">
         <h1 class="text-4xl font-bold mb-6">Blog</h1>

         <div class="grid gap-6">
            <cms:pages limit='10'>
               <article class="card bg-base-100 shadow-xl">
                  <div class="card-body">
                     <h2 class="card-title">
                        <a href="<cms:show k_page_link />">
                           <cms:show k_page_title />
                        </a>
                     </h2>
                     <p><cms:excerptHTML content /></p>
                     <div class="card-actions">
                        <a href="<cms:show k_page_link />"
                           class="btn btn-primary">
                           Read More
                        </a>
                     </div>
                  </div>
               </article>
            </cms:pages>
         </div>
      </div>
   </cms:if>

   <!-- Cache indicator (only in HTML pages) -->
   <!-- Will show: <!-- Cached page --> or <!-- Generated page --> -->
</body>
</html>
<?php COUCH::invoke(); ?>
```

**Result:**
- Blog list: Cached (fast)
- Blog post: Cached (fast)
- View counter: Dynamic (AJAX)
- Best of both worlds!

---

## Configuration Reference

### couch/config.php

```php
// Enable page caching
define( 'K_USE_CACHE', 1 );

// Cache purge interval (hours)
define( 'K_CACHE_PURGE_INTERVAL', 24 );

// Maximum cache age (days)
define( 'K_MAX_CACHE_AGE', 7 );
```

### couch/header.php

```php
// Opcode caching
define( 'K_CACHE_OPCODES', '1' );

// Settings caching
define( 'K_CACHE_SETTINGS', '1' );
```

---

## Related Tags

- `<cms:no_cache />` - Exclude page from caching
- `<cms:db_persist>` - Invalidate cache with `_invalidate_cache='1'`
- `<cms:is_ajax />` - Detect AJAX requests
- `<cms:content_type>` - Set content type for cached assets
- `<cms:abort>` - Stop execution and return response

---

## Related Functions

- [invalidate-cache](https://github.com/trendoman/Cms-Fu/tree/master/Cache/invalidate-cache)
- [uncache-by-pagelink](https://github.com/trendoman/Cms-Fu/tree/master/Cache/uncache-by-pagelink)

---

## Additional Resources

- [Midware Tags Reference - no_cache](https://github.com/trendoman/Midware/tree/main/tags-reference/no_cache.md)
- [Extended Users (affects cache bypass)](https://github.com/trendoman/Midware/tree/main/concepts/Extended-Users)
