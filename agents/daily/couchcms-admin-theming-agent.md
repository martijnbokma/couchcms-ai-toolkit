---
name: CouchCMS Admin Theming Agent
version: '1.0'
type: daily
description: CouchCMS admin panel customization and theming
tags:
    - couchcms
    - admin
    - theming
    - customization
---

# CouchCMS Admin Panel Theming Agent

**Quick Reference**: Common admin panel theming tasks
**Level**: Intermediate
**Use For**: Quick customizations, list/form configurations, sidebar setup

## Quick Start

### Activate Custom Theme

```php
// In config.php
define( 'K_ADMIN_THEME', 'sample' );
```

### Override Admin Snippet

1. Copy snippet from `couch/theme/_system/` to `couch/theme/sample/`
2. Modify the copied file
3. Visit any template as super-admin

## Common Tasks

### 1. Customize List Screen

**Add Custom Column**:

```php
<cms:config_list_view>
    <cms:field 'k_selector_checkbox' />
    <cms:field 'k_page_title' />
    <cms:field 'my_custom_field' header='Custom Data' />
    <cms:field 'k_actions' />
</cms:config_list_view>
```

**Show Thumbnail**:

```php
<cms:field 'my_image' header='Thumbnail'>
    <img src="<cms:show my_image />" style="max-width:60px;" />
</cms:field>
```

**Status Badge**:

```php
<cms:field 'approval_status' header='Status'>
    <cms:if approval_status='approved'>
        <span style="color:green;">✓ Approved</span>
    <cms:else/>
        <span style="color:orange;">⧗ Pending</span>
    </cms:if>
</cms:field>
```

**Enable Search**:

```php
<cms:config_list_view searchable='1'>
    <!-- fields -->
</cms:config_list_view>
```

**Manual Sorting**:

```php
<cms:config_list_view orderby='weight' order='asc'>
    <cms:field 'k_selector_checkbox' />
    <cms:field 'k_page_title' sortable='0' />
    <cms:field 'k_up_down' />
    <cms:field 'k_actions' />
</cms:config_list_view>
```

### 2. Customize Form Screen

**Move Field to Advanced Settings**:

```php
<cms:config_form_view>
    <cms:field 'k_page_name' group='_advanced_settings_' />
</cms:config_form_view>
```

**Hide System Field**:

```php
<cms:field 'k_page_name' skip='1' />
```

**Change Field Order**:

```php
<cms:field 'my_important_field' order='1' />
```

**Add Instructions**:

```php
<cms:config_form_view>
    <cms:html>
        <cms:show_info heading='Guidelines'>
            Please complete all required fields before saving.
        </cms:show_info>
    </cms:html>
</cms:config_form_view>
```

### 3. Sidebar Organization

**Create New Group** (`couch/addons/kfunctions.php`):

```php
if( defined('K_ADMIN') ){
    $FUNCS->add_event_listener( 'register_admin_menuitems', 'my_groups' );

    function my_groups(){
        global $FUNCS;

        $FUNCS->register_admin_menuitem( array(
            'name' => '_my_projects_',
            'title' => 'Projects',
            'is_header' => 1,
            'weight' => 1
        ));
    }
}
```

**Assign Template to Group**:

```html
<cms:template clonable="1" title="My Project" parent="_my_projects_" icon="briefcase"></cms:template>
```

### 4. Add Custom CSS

**In styles.css**:

```css
.col-my_field {
    width: 200px;
    text-align: center;
}

.custom-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}
```

**Inline in Template**:

```php
<cms:config_list_view>
    <cms:style>
        .col-status { width: 120px; text-align: center; }
        .badge-success { background: #10b981; color: white; }
    </cms:style>
</cms:config_list_view>
```

## Quick Reference: System Fields

**List View Fields**:

- `k_selector_checkbox` - Bulk actions checkbox
- `k_page_title` - Page title/link
- `k_page_name` - Page slug
- `k_page_foldertitle` - Folder name
- `k_page_date` - Publish date
- `k_comments_count` - Comment count
- `k_up_down` - Manual sorting
- `k_actions` - Edit/delete buttons

**Form View Fields**:

- `k_page_title` - Page title
- `k_page_name` - Page slug
- `k_publish_date` - Publication date
- `k_page_folder_id` - Folder assignment

**Field Groups**:

- `_system_fields_` - Top system fields
- `_custom_fields_` - Custom editables
- `_advanced_settings_` - Advanced dropdown

## Tips

1. **Always visit template as super-admin** after config changes
2. **Use meaningful field names** for custom columns
3. **Test with real data** to verify display
4. **Document custom overrides** in theme folder
5. **Keep styles.css organized** with comments

## Troubleshooting

**Fields not showing?**

- Visit template as super-admin
- Check field names (case-sensitive)
- Verify syntax in config tags

**Sorting not working?**

- Set `orderby` on `config_list_view`
- Disable `sortable` on incompatible fields
- Use `weight` field for manual sorting

**CSS not applying?**

- Clear browser cache
- Check `styles.css` path
- Use `!important` if needed

**Parse error in admin?**

- Remove config code temporarily
- Visit template to reset
- Debug line by line
