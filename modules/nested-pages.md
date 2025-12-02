---
id: nested-pages
name: "Nested Pages"
category: "content"
version: "1.0"
description: "Hierarchical page structures for navigation, menus, and site organization"
required: false
requires: [couchcms-core]
conflicts: []
---

# Nested Pages (Menu Maker)

## Overview

Nested Pages allow creating hierarchical page structures perfect for multi-level navigation systems, dropdown menus, breadcrumbs, and complex site organization. Pages can have parent-child relationships that reflect in URLs and navigation.

### Key Benefits
- **Hierarchical Structure**: Create unlimited depth parent-child relationships
- **Menu Generation**: Automatically generate multi-level navigation menus
- **SEO-Friendly URLs**: Hierarchy reflects in URL structure (with Pretty URLs)
- **Visual Admin**: Drag-and-drop page ordering in CouchCMS admin panel
- **Pointer Pages**: Link to external sections or pages within the hierarchy

## Template Setup

### Basic Configuration

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Pages' clonable='1' nested_pages='1'>
    <cms:editable name='content' label='Content' type='richtext' />
</cms:template>
<?php COUCH::invoke(); ?>
```

**Key Parameters:**
- `clonable='1'` - Enable cloning (required)
- `nested_pages='1'` - Enable nested pages hierarchy

### View Detection

```php
<cms:if k_is_page>
    <!-- Single page view - show page content -->
    <h1><cms:show k_page_title /></h1>
    <cms:show content />
<cms:else />
    <!-- List view - show page listing or home page -->
    <cms:pages masterpage='pages.php'>
        <h2><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h2>
    </cms:pages>
</cms:if>
```

## Menu Generation

### Simple Menu

```html
<cms:menu masterpage='index.php' />
```

This generates semantic HTML with classes for styling:
- `level-0`, `level-1`, `level-2` - Depth indicators
- `active` - Applied to current page and its parents
- `current` - Applied only to current page
- `has-submenu` - Indicates submenu presence
- `first`, `last` - Position indicators

### Custom Menu Markup

```html
<cms:menu
    masterpage='index.php'
    menu_class='nav-main'
    menu_id='primary-menu'
    depth='2'
    show_menu_text='1'
>
```

**Parameters:**
- `masterpage` - Template with nested pages (required)
- `menu_class` - CSS class for `<ul>` element
- `menu_id` - ID for outer `<ul>`
- `depth` - Maximum nesting levels to display
- `show_menu_text` - Use custom menu text from admin

### Responsive Dropdown Menu

```html
<nav x-data="{ open: false }">
    <cms:menu masterpage='index.php' menu_class='nav-menu'>
        <template x-if="hasSubmenu">
            <button x-on:click="open = !open" type="button">
                <span x-text="menuText"></span>
            </button>
        </template>
    </cms:menu>
</nav>
```

### Menu with Icons (daisyUI)

```html
<ul class="menu bg-base-200 rounded-box">
    <cms:nested_pages masterpage='index.php'>
        <cms:if k_level='0'><li></cms:if>
        <cms:if k_level='1'>
            <ul>
                <li>
        </cms:if>

        <a href="<cms:show k_page_link />"
           class="<cms:if k_is_active>active</cms:if>">
            <cms:show k_page_title />
        </a>

        <cms:if k_level='1'>
                </li>
            </ul>
        </cms:if>
        <cms:if k_level='0'></li></cms:if>
    </cms:nested_pages>
</ul>
```

## Breadcrumbs

### Basic Breadcrumbs

```html
<cms:nested_crumbs masterpage='index.php' />
```

### Custom Breadcrumbs

```html
<cms:nested_crumbs
    masterpage='index.php'
    prepend='<nav class="breadcrumbs"><ul>'
    append='</ul></nav>'
    ignore_show_in_menu='1'
>
    <li>
        <a href="<cms:show k_crumb_link />">
            <cms:show k_crumb_text />
        </a>
        <cms:if k_crumb_is_last='0'> &raquo; </cms:if>
    </li>
</cms:nested_crumbs>
```

### daisyUI Breadcrumbs

```html
<cms:nested_crumbs
    masterpage='index.php'
    prepend='<div class="breadcrumbs text-sm"><ul>'
    append='</ul></div>'
>
    <li>
        <a href="<cms:show k_crumb_link />" class="link link-hover">
            <cms:show k_crumb_text />
        </a>
    </li>
</cms:nested_crumbs>
```

## Pointer Pages

Pointer pages allow menu items to link to external sections or pages without duplicating content.

### Redirect Method

**Use Case**: Simple navigation to other sections

```text
Advanced Settings:
☑ Points to another page
Method: Redirects
Link: http://www.yoursite.com/blog/
```

**Behavior**: HTTP redirect to target URL

### Masquerade Method

**Use Case**: Virtual relocation of entire sections

```text
Advanced Settings:
☑ Points to another page
Method: Masquerades
Link: http://www.yoursite.com/portfolio/
```

**Behavior**:
- Shows target content at nested page URL
- Changes all target section URLs to match hierarchy
- Sends 301 redirect from original URL
- **Requires**: Pretty URLs enabled
- **Limitation**: Only available in `index.php` template

**Example:**
- Nested page: `http://site.com/services/portfolio/`
- Target: `http://site.com/portfolio/`
- Result: Portfolio appears at `/services/portfolio/`

### Comparison

| Feature | Redirect | Masquerade |
|---------|----------|------------|
| Use case | Menu navigation | Section relocation |
| Template | Any nested template | `index.php` only |
| Pretty URLs | Not required | Required |
| Target scope | Single URL | Entire section |
| Multiple pointers | Yes | No (one per template) |

## Advanced Patterns

### Conditional Menu Items

```html
<cms:nested_pages masterpage='index.php' exclude_below='0'>
    <cms:if k_menu_text='Members'>
        <cms:if k_logged_in>
            <li><a href="<cms:show k_page_link />"><cms:show k_menu_text /></a></li>
        </cms:if>
    <cms:else />
        <li><a href="<cms:show k_page_link />"><cms:show k_menu_text /></a></li>
    </cms:if>
</cms:nested_pages>
```

### Multi-Template Menu

```html
<cms:menu masterpage='index.php' />
<!-- Blog section pointer page automatically includes blog hierarchy -->
```

### Mobile Navigation

```html
<div x-data="{ mobileMenuOpen: false }">
    <!-- Mobile toggle -->
    <button x-on:click="mobileMenuOpen = !mobileMenuOpen" class="btn btn-ghost lg:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    </button>

    <!-- Mobile menu -->
    <div x-show="mobileMenuOpen" x-on:click.away="mobileMenuOpen = false" class="lg:hidden">
        <cms:menu masterpage='index.php' menu_class='menu bg-base-200' />
    </div>

    <!-- Desktop menu -->
    <div class="hidden lg:flex">
        <cms:menu masterpage='index.php' menu_class='menu menu-horizontal' />
    </div>
</div>
```

## Variables

### Navigation Variables

Available within `<cms:nested_pages>` or `<cms:menu>`:

- `k_page_title` - Page title
- `k_page_link` - Page URL
- `k_menu_text` - Custom menu text (if set in admin)
- `k_level` - Depth level (0 = root, 1 = first level, etc.)
- `k_is_active` - '1' if current page or ancestor of current page
- `k_is_pointer` - '1' if parent of current active page
- `k_open_external` - '1' if set to open in new window
- `k_menu_open_external` - '1' if menu item opens externally

### Breadcrumb Variables

Available within `<cms:nested_crumbs>`:

- `k_crumb_text` - Breadcrumb text
- `k_crumb_link` - Breadcrumb URL
- `k_crumb_is_last` - '1' for the last (current) crumb

## Admin Panel Settings

### Page Settings (Advanced Settings)

- **Show in menu** - Include/exclude from menu generation
- **Menu text** - Override page title in menus
- **Open in separate window** - Add `target="_blank"`
- **Points to another page** - Enable pointer functionality
  - Method: Redirects or Masquerades
  - Link: Target URL
- **Mark as selected for all pages below this link** - Control active state behavior

### Page Ordering

- **Drag-and-drop** reordering in admin list view
- **Parent selection** dropdown for hierarchy
- **Visual indentation** shows nesting level

## Best Practices

### DO

✅ **Use nested pages for site-wide navigation**
```php
<cms:template title='Pages' clonable='1' nested_pages='1'>
```

✅ **Use pointer pages for external sections**
```text
Create pointer page → Set "Points to another page" → Enter blog URL
```

✅ **Limit depth to 3-4 levels for usability**
```html
<cms:menu masterpage='index.php' depth='3' />
```

✅ **Use `k_is_active` and `k_is_pointer` for styling**
```html
<li class="<cms:if k_is_active>active</cms:if> <cms:if k_is_pointer>pointer</cms:if>">
```

✅ **Cache menu in production**
```php
<cms:cache '1 day'>
    <cms:menu masterpage='index.php' />
</cms:cache>
```

### DON'T

❌ **Don't mix nested and regular cloned pages in same template**
```php
<!-- WRONG: Can't have both -->
<cms:template clonable='1' nested_pages='1'>
<cms:folders> <!-- folders don't work with nested pages -->
```

❌ **Don't use folders with nested pages**
```php
<!-- Folders are ignored when nested_pages='1' -->
```

❌ **Don't go deeper than 4-5 levels**
```html
<!-- Too deep - poor UX -->
Home → About → Team → Staff → Managers → Regional → Local (7 levels!)
```

❌ **Don't forget to uncheck "Mark as selected" for home pointer**
```text
Home pointer page: Uncheck "Mark as selected for all pages below this link"
```

## Security Considerations

### Access Control

```php
<cms:nested_pages masterpage='index.php'>
    <cms:if k_menu_text='Admin'>
        <cms:if k_user_access_level ge '7'>
            <li><a href="<cms:show k_page_link />"><cms:show k_menu_text /></a></li>
        </cms:if>
    <cms:else />
        <li><a href="<cms:show k_page_link />"><cms:show k_menu_text /></a></li>
    </cms:if>
</cms:nested_pages>
```

### XSS Protection

```html
<!-- Always show user-editable content safely -->
<a href="<cms:show k_page_link />">
    <cms:show k_menu_text />  <!-- Auto-escaped by CouchCMS -->
</a>
```

## Troubleshooting

### Issue: Menu not showing hierarchy

**Cause**: Forgot `nested_pages='1'` in template

**Solution**:
```php
<cms:template clonable='1' nested_pages='1'>  <!-- Add this parameter -->
```

### Issue: Wrong active menu states

**Cause**: Home pointer marked as selected for all children

**Solution**: Edit home pointer page → Advanced Settings → Uncheck "Mark as selected for all pages below this link"

### Issue: Pointer page not redirecting

**Cause**: Invalid URL format

**Solution**:
- Visit target page in browser
- Copy exact URL from address bar
- Paste into "Link" field
- Must include `http://` or `https://`

### Issue: Masquerade not working

**Cause**: Pretty URLs not enabled

**Solution**:
1. Enable Pretty URLs in CouchCMS config
2. Configure `.htaccess`
3. Test with simple page first

### Issue: Menu not appearing on frontend

**Cause**: Missing `masterpage` parameter

**Solution**:
```html
<cms:menu masterpage='index.php' />  <!-- Always specify masterpage -->
```

### Issue: Breadcrumbs showing wrong pages

**Cause**: Using `<cms:breadcrumbs>` instead of `<cms:nested_crumbs>`

**Solution**:
```html
<!-- WRONG: For folders only -->
<cms:breadcrumbs />

<!-- CORRECT: For nested pages -->
<cms:nested_crumbs masterpage='index.php' />
```

## Integration Examples

### With TailwindCSS

```html
<nav class="bg-base-100">
    <cms:menu
        masterpage='index.php'
        menu_class='flex space-x-4'
    >
        <a href="<cms:show k_page_link />"
           class="px-3 py-2 rounded-md text-sm font-medium
                  <cms:if k_is_active>bg-primary text-primary-content<cms:else />text-base-content hover:bg-base-200</cms:if>">
            <cms:show k_menu_text />
        </a>
    </cms:menu>
</nav>
```

### With Alpine.js

```html
<div x-data="{
    openMenus: [],
    toggle(id) {
        const index = this.openMenus.indexOf(id);
        index === -1 ? this.openMenus.push(id) : this.openMenus.splice(index, 1);
    }
}">
    <cms:nested_pages masterpage='index.php'>
        <cms:if k_level='0'>
            <div x-bind:id="'menu-<cms:show k_page_id />'" class="menu-item">
        </cms:if>

        <button x-on:click="toggle(<cms:show k_page_id />)"
                x-bind:class="openMenus.includes(<cms:show k_page_id />) ? 'open' : ''">
            <cms:show k_menu_text />
        </button>

        <cms:if k_level='0'>
            </div>
        </cms:if>
    </cms:nested_pages>
</div>
```

## Related Tags

- [`<cms:nested_pages>`](../../tags-reference/nested_pages.md) - Low-level iteration through nested pages
- [`<cms:menu>`](../../tags-reference/menu.md) - Generate menu markup automatically
- [`<cms:nested_crumbs>`](../../tags-reference/nested_crumbs.md) - Generate breadcrumb navigation
- [`<cms:template>`](../../tags-reference/template.md) - Define template with `nested_pages='1'`

## See Also

- [Folders](./folders.md) - For non-nested hierarchical organization
- [Custom Routes](./custom-routes.md) - Advanced URL patterns
- [Views](./views.md) - Understanding page/list view concepts
