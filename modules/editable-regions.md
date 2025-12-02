---
id: editable-regions
name: "Editable Regions"
category: "content"
version: "1.0"
description: "Complete guide to all CouchCMS editable field types, validation, and content management patterns"
required: false
requires: [couchcms-core]
conflicts: []
---

# Editable Regions

## Overview

Editable regions are the **core feature** of CouchCMS that transforms static HTML templates into dynamic, content-manageable systems. They define areas in templates that clients can edit through the admin panel.

### What are Editable Regions?

Editable regions create input fields in the CouchCMS admin panel, allowing non-technical users to manage content without touching code.

**Key Benefits:**
- ✅ 14 field types for different content needs
- ✅ Built-in validation and constraints
- ✅ Rich text editors, file uploads, relationships
- ✅ Custom labels, descriptions, and help text
- ✅ Default values and required fields
- ✅ Conditional fields and grouping

## Basic Usage

### Simple Text Field

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='About Us'>
    <cms:editable name='page_title' label='Page Title' type='text' />
    <cms:editable name='content' label='Content' type='richtext' />
</cms:template>

<h1><cms:show page_title /></h1>
<div class="content">
    <cms:show content />
</div>

<?php COUCH::invoke(); ?>
```

### Accessing Editable Region Content

**4 Ways to Access Content:**

1. **Direct output (in same template):**
```php
<cms:editable name='intro' type='textarea'>
    Default text here
</cms:editable>
<!-- Outputs content directly -->
```

2. **As variable (in same template):**
```php
<cms:editable name='intro' type='textarea' />
<!-- Later in template: -->
<cms:show intro />
```

3. **Within cms:pages loop:**
```php
<cms:pages>
    <h2><cms:show k_page_title /></h2>
    <cms:show intro />  <!-- Editable region from each page -->
</cms:pages>
```

4. **Using get_custom_field:**
```php
<cms:get_custom_field 'intro' masterpage='blog.php' page='my-post' />
```

## All Field Types

### 1. Text (Single-line Input)

**Use for:** Titles, names, short text

```php
<cms:editable
    name='page_title'
    label='Page Title'
    desc='Enter the page title'
    type='text'
    maxlength='100'
    width='400'
    required='1'
/>
```

**Parameters:**
- `width` - Input width in pixels
- `maxlength` - Maximum characters
- `search_type` - Enable search indexing (`text|integer|decimal`)

**Output:**
```php
<h1><cms:show page_title /></h1>
```

### 2. Password (Secured Input)

**Use for:** Passwords, API keys (stores encrypted)

```php
<cms:editable
    name='api_key'
    label='API Key'
    type='password'
    required='1'
/>
```

### 3. Textarea (Multi-line Plain Text)

**Use for:** Descriptions, plain text content

```php
<cms:editable
    name='description'
    label='Description'
    desc='Brief description'
    type='textarea'
    height='100'
    width='500'
    maxlength='500'
/>
```

**Parameters:**
- `height` - Textarea height in pixels
- `width` - Textarea width
- `maxlength` - Character limit

**Output:**
```php
<p><cms:show description /></p>
<!-- Preserve line breaks: -->
<cms:nl2br><cms:show description /></cms:nl2br>
```

### 4. Richtext (WYSIWYG Editor)

**Use for:** Formatted content with HTML

```php
<cms:editable
    name='content'
    label='Main Content'
    type='richtext'
    height='400'
    toolbar='full'
    custom_toolbar='bold,italic,link,unlink,image,formatselect'
/>
```

**Toolbar Options:**
- `basic` - Bold, italic, lists
- `medium` - + alignment, links
- `full` - All features (default)
- `custom_toolbar` - Specify exact buttons

**Output:**
```php
<div class="prose">
    <cms:show content />
</div>
```

### 5. Image (Image Upload)

**Use for:** Featured images, banners, photos

```php
<cms:editable
    name='featured_image'
    label='Featured Image'
    desc='Upload main image'
    type='image'
    width='1200'
    height='630'
    enforce_max='1'
    quality='80'
    show_preview='1'
    preview_width='200'
    crop='1'
/>
```

**Parameters:**
- `width/height` - Max dimensions (resizes if exceeded)
- `enforce_max='1'` - Reject images larger than width/height
- `crop='1'` - Enable crop interface
- `quality` - JPEG quality (0-100)
- `show_preview='1'` - Show thumbnail preview
- `preview_width/height` - Preview dimensions

**Output:**
```php
<img src="<cms:show featured_image />" alt="<cms:show k_page_title />" />

<!-- With thumbnail: -->
<img src="<cms:thumbnail featured_image width='400' height='300' />" />

<!-- Responsive: -->
<img src="<cms:thumbnail featured_image width='800' />"
     srcset="<cms:thumbnail featured_image width='400' /> 400w,
             <cms:thumbnail featured_image width='800' /> 800w,
             <cms:thumbnail featured_image width='1200' /> 1200w"
     sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 800px" />
```

### 6. Thumbnail (Dynamic Image Generation)

**Use for:** Automatic thumbnail generation

```php
<cms:editable
    name='image_thumb'
    label='Thumbnail'
    assoc_field='featured_image'
    type='thumbnail'
    width='300'
    height='200'
    enforce_max='1'
/>
```

**Auto-generates thumbnail from associated image field**

### 7. File (File Upload)

**Use for:** PDFs, documents, downloads

```php
<cms:editable
    name='brochure'
    label='Download Brochure'
    desc='Upload PDF (max 10MB)'
    type='file'
    allowed_ext='pdf,doc,docx'
    max_size='10240'
/>
```

**Parameters:**
- `allowed_ext` - File extensions (comma-separated)
- `max_size` - Max size in KB

**Output:**
```php
<a href="<cms:show brochure />" download class="btn btn-primary">
    Download Brochure
</a>
```

### 8. Radio (Single Choice Buttons)

**Use for:** Boolean choices, small option sets

```php
<cms:editable
    name='property_status'
    label='Status'
    desc='Select property status'
    type='radio'
    opt_values='Available | Sold | Pending'
    opt_selected='Available'
/>
```

**Parameters:**
- `opt_values` - Options separated by `|`
- `opt_selected` - Default selected option
- `separator` - Custom separator (default `|`)

**Output:**
```php
<cms:if property_status='Available'>
    <span class="badge badge-success">Available</span>
</cms:if>
```

### 9. Checkbox (Multiple Selections)

**Use for:** Multiple choice selections

```php
<cms:editable
    name='amenities'
    label='Amenities'
    desc='Select all that apply'
    type='checkbox'
    opt_values='Pool | Gym | Parking | Garden | Security'
/>
```

**Output:**
```php
<cms:if "<cms:is_substr amenities='Pool' />">
    <li>Swimming Pool</li>
</cms:if>
<cms:if "<cms:is_substr amenities='Gym' />">
    <li>Gym</li>
</cms:if>
```

### 10. Dropdown (Select Menu)

**Use for:** Single selection from many options

```php
<cms:editable
    name='country'
    label='Country'
    type='dropdown'
    opt_values='USA=United States | UK=United Kingdom | CA=Canada'
    opt_selected='USA'
    search_type='text'
/>
```

**With Separate Values and Labels:**
```php
opt_values='us=United States | uk=United Kingdom | ca=Canada'
```
- Stores: `us`
- Displays: `United States`

**Output:**
```php
<cms:show country />  <!-- Outputs: 'USA' -->
```

### 11. Group (Visual Grouping)

**Use for:** Organizing fields visually

```php
<cms:editable name='seo_group' label='SEO Settings' type='group' />
    <cms:editable name='meta_title' label='Meta Title' type='text' />
    <cms:editable name='meta_description' label='Meta Description' type='textarea' />
<cms:editable name='seo_group_end' type='endgroup' />
```

**Creates collapsible section in admin panel**

### 12. Message (Display Only)

**Use for:** Help text, instructions

```php
<cms:editable
    name='help_message'
    label='Instructions'
    desc='<strong>Note:</strong> All fields marked with * are required.'
    type='message'
/>
```

**No output - admin panel only**

### 13. NicEdit (Alternative WYSIWYG)

**Use for:** Lightweight rich text editor

```php
<cms:editable
    name='excerpt'
    label='Excerpt'
    type='nicedit'
    height='150'
/>
```

### 14. Relation (Page Relationships)

**Use for:** Linking related pages

```php
<cms:editable
    name='related_posts'
    label='Related Posts'
    desc='Select related blog posts'
    type='relation'
    masterpage='blog.php'
    has='one'
/>
```

**Parameters:**
- `masterpage` - Template to link to
- `has` - Relationship type (`one` or `many`)
- `folder` - Limit to specific folder
- `order_by` - Sort order

**Output:**
```php
<cms:related_pages 'related_posts'>
    <h3><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h3>
</cms:related_pages>
```

## Common Parameters

### Available for All Types

```php
<cms:editable
    name='field_name'        // Required: Unique identifier
    label='Field Label'      // Admin panel label
    desc='Help text'         // Description/tooltip
    type='text'              // Field type
    required='1'             // Make required (1 or 0)
    hidden='1'               // Hide from admin (1 or 0)
    search_type='text'       // Enable search indexing
    order='10'               // Display order (lower = first)
    group='section_name'     // Group fields together
    not_active='1'           // Disable field
/>
```

## Advanced Patterns

### Blog Post Template

```php
<cms:template title='Blog' clonable='1' commentable='1'>
    <!-- Basic Info -->
    <cms:editable name='featured_image' label='Featured Image'
        type='image' width='1200' height='630' quality='85' show_preview='1' />

    <cms:editable name='excerpt' label='Excerpt'
        desc='Short description (max 160 chars)'
        type='textarea' maxlength='160' height='80' />

    <cms:editable name='content' label='Content'
        type='richtext' height='400' />

    <!-- SEO Group -->
    <cms:editable name='seo_settings' label='SEO Settings' type='group' />
        <cms:editable name='meta_title' label='Meta Title'
            type='text' maxlength='60' />
        <cms:editable name='meta_description' label='Meta Description'
            type='textarea' maxlength='160' />
    <cms:editable name='seo_settings_end' type='endgroup' />

    <!-- Related Content -->
    <cms:editable name='related_posts' label='Related Posts'
        type='relation' masterpage='blog.php' has='many' />
</cms:template>
```

### Product Page Template

```php
<cms:template title='Products' clonable='1'>
    <!-- Product Info -->
    <cms:editable name='product_name' label='Product Name'
        type='text' required='1' search_type='text' />

    <cms:editable name='price' label='Price'
        type='text' search_type='decimal' />

    <cms:editable name='product_images' label='Product Images'
        type='image' width='1000' height='1000' crop='1' />

    <!-- Category -->
    <cms:editable name='category' label='Category'
        type='dropdown'
        opt_values='Electronics | Clothing | Books | Home & Garden' />

    <!-- Features -->
    <cms:editable name='features' label='Features'
        desc='Select all applicable features'
        type='checkbox'
        opt_values='Bestseller | New Arrival | On Sale | Featured' />

    <!-- Description -->
    <cms:editable name='description' label='Description'
        type='richtext' height='300' />

    <!-- Downloads -->
    <cms:editable name='manual' label='User Manual'
        type='file' allowed_ext='pdf' />
</cms:template>
```

## Validation Patterns

### Required Fields

```php
<cms:editable name='email' label='Email'
    type='text' required='1' />
```

### Email Validation

```php
<cms:editable name='contact_email' label='Email'
    type='text' validator='email' />
```

### Custom Regex Validation

```php
<cms:editable name='phone' label='Phone'
    type='text'
    validator='regex=/^\d{3}-\d{3}-\d{4}$/'
    validator_msg='Format: 123-456-7890' />
```

### Min/Max Length

```php
<cms:editable name='username' label='Username'
    type='text'
    validator='min_len=3 | max_len=20' />
```

### Number Range

```php
<cms:editable name='quantity' label='Quantity'
    type='text'
    search_type='integer'
    validator='min_val=1 | max_val=100' />
```

## Integration Patterns

### With TailwindCSS + daisyUI

```php
<article class="card bg-base-100 shadow-xl">
    <figure>
        <img src="<cms:thumbnail featured_image width='800' />"
             alt="<cms:show k_page_title />" />
    </figure>
    <div class="card-body">
        <h2 class="card-title"><cms:show k_page_title /></h2>
        <p><cms:show excerpt /></p>
        <div class="prose max-w-none">
            <cms:show content />
        </div>

        <!-- Tags/Categories -->
        <cms:if category>
            <div class="badge badge-primary"><cms:show category /></div>
        </cms:if>

        <!-- Related Posts -->
        <cms:if related_posts>
            <div class="mt-4">
                <h3 class="text-lg font-bold">Related Articles</h3>
                <cms:related_pages 'related_posts'>
                    <a href="<cms:show k_page_link />" class="link link-hover">
                        <cms:show k_page_title />
                    </a>
                </cms:related_pages>
            </div>
        </cms:if>
    </div>
</article>
```

### With Alpine.js

```html
<div x-data="{ showFull: false }">
    <!-- Excerpt -->
    <p x-show="!showFull">
        <cms:show excerpt />
        <button x-on:click="showFull = true" class="btn btn-link">Read more</button>
    </p>

    <!-- Full content -->
    <div x-show="showFull" x-transition class="prose">
        <cms:show content />
    </div>
</div>
```

## Best Practices

### DO

✅ **Define fields in `<cms:template>` block**
```php
<cms:template title='Blog' clonable='1'>
    <cms:editable name='content' type='richtext' />
</cms:template>
```

✅ **Use descriptive names and labels**
```php
<cms:editable name='featured_image' label='Featured Image' desc='Main article image' />
```

✅ **Set appropriate maxlength for text fields**
```php
<cms:editable name='title' type='text' maxlength='100' />
```

✅ **Use groups to organize fields**
```php
<cms:editable name='advanced' label='Advanced Settings' type='group' />
    <!-- fields -->
<cms:editable name='advanced_end' type='endgroup' />
```

✅ **Provide default values**
```php
<cms:editable name='status' type='radio' opt_values='Draft | Published' opt_selected='Draft' />
```

✅ **Add help text for complex fields**
```php
<cms:editable name='custom_css' label='Custom CSS'
    desc='Add custom styles (advanced users only)'
    type='textarea' />
```

### DON'T

❌ **Don't nest editable tags**
```php
<!-- WRONG: -->
<cms:editable name='outer' type='richtext'>
    <cms:editable name='inner' type='text' />  <!-- ERROR! -->
</cms:editable>
```

❌ **Don't use special characters in names**
```php
<!-- WRONG: -->
<cms:editable name='my-field-name' />  <!-- Use underscore -->
<cms:editable name='my field' />       <!-- No spaces -->
```

❌ **Don't forget to visit template as admin**
```php
<!-- After adding editable regions, MUST visit: -->
<!-- http://site.com/template.php (while logged in as admin) -->
```

❌ **Don't access editable regions in list view without cms:pages**
```php
<cms:if k_is_list>
    <cms:show content />  <!-- WRONG: Not available in list view -->

    <!-- CORRECT: -->
    <cms:pages>
        <cms:show content />  <!-- Available inside pages loop -->
    </cms:pages>
</cms:if>
```

❌ **Don't use generic names**
```php
<!-- BAD: -->
<cms:editable name='text' type='text' />

<!-- GOOD: -->
<cms:editable name='page_title' type='text' />
```

## Troubleshooting

### Issue: Fields not showing in admin

**Cause**: Haven't visited template while logged in as admin

**Solution**:
1. Log in as super-admin
2. Visit template in browser: `http://site.com/template.php`
3. Check admin panel again

### Issue: Content not displaying

**Cause**: Wrong view or incorrect variable name

**Solution**:
```php
<!-- Debug: -->
<cms:dump_all />

<!-- Check if in correct view: -->
<cms:if k_is_page>
    <cms:show content />  <!-- Only works in page view -->
</cms:if>
```

### Issue: Image upload fails

**Cause**: Upload folder permissions or size limit

**Solution**:
- Check folder permissions (755 or 777)
- Check `max_size` parameter
- Check PHP upload limits in php.ini

### Issue: Default value not showing

**Cause**: Page already created, default only applies to new pages

**Solution**: Default values only apply when creating new pages, not existing ones

### Issue: Validation not working

**Cause**: Incorrect validator syntax

**Solution**:
```php
<!-- CORRECT: -->
<cms:editable name='email' type='text' validator='email' />

<!-- CHECK SYNTAX: -->
validator='min_len=5 | max_len=50'  <!-- Pipe separator -->
validator='regex=/^[A-Z]/'           <!-- Regex pattern -->
```

## Performance Tips

### Optimize Image Sizes

```php
<cms:editable name='banner' type='image'
    width='1920'      <!-- Max width -->
    height='1080'     <!-- Max height -->
    quality='80'      <!-- Compress -->
    enforce_max='1'   <!-- Reject oversized -->
/>
```

### Use Thumbnails for Listings

```php
<cms:pages>
    <!-- Don't use full-size in listing: -->
    <img src="<cms:thumbnail featured_image width='400' height='300' />" />
    <!-- Not: <cms:show featured_image /> -->
</cms:pages>
```

### Limit Richtext Toolbar

```php
<cms:editable name='content' type='richtext'
    toolbar='medium'  <!-- Lighter than 'full' -->
/>
```

## Related Concepts

- [Views](./views.md) - Understanding when editable regions are available
- [Cloned Pages](./cloned-pages.md) - Creating multiple pages with editable regions
- [Repeatable Regions](./repeatable-regions.md) - Repeating sets of editable fields
- [DataBound Forms](./databound-forms.md) - Front-end editing of editable regions

## See Also

- [`<cms:editable>`](../../tags-reference/editable.md) - Complete tag reference
- [`<cms:show>`](../../tags-reference/show.md) - Display editable content
- [`<cms:thumbnail>`](../../tags-reference/thumbnail.md) - Dynamic image resizing
- [`<cms:get_custom_field>`](../../tags-reference/get_custom_field.md) - Access fields from other pages
