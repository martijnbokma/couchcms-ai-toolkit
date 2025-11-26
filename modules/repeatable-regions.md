---
id: repeatable-regions
name: "Repeatable Regions"
category: "content"
version: "2.x"
description: "Repeatable content blocks and dynamic regions"
required: false
requires: [couchcms-core]
conflicts: []
---

# repeatable-regions




## Repeatable Regions

Complete guide to creating and managing dynamic repeatable regions in CouchCMS templates for portfolios, image galleries, and sortable content arrays.

### Basic Image Region

```php
<cms:editable type='image' name='my_image' label='Photo' />
```

### Repeatable Image Region

```php
<cms:repeatable name='my_multiple_images' >
        <cms:editable type='image' name='my_image' label='Photo' />
    </cms:repeatable>
```

### Image with Description

```php
<cms:repeatable name='my_multiple_images' >
    <cms:editable type='image' name='my_image' label='Photo' show_preview='1' preview_width='150' input_width='200' col_width='300' />
    <cms:editable type='nicedit' label='Description' name='my_desc' />
</cms:repeatable>
```


## repeat Tag

### Example

```php
<table>
<cms:repeat count='4' >
    <tr>
        <cms:repeat count='6' startcount='1' >
            <td>
                <cms:show k_count />
            </td>
        </cms:repeat>
    </tr>
</cms:repeat>
</table>
```


## show_repeatable Tag

### Example

```php
<cms:show_repeatable 'my_multiple_images' >
   <b>Image: <img src="<cms:show my_image />" />
   <b>Desc:</b> <cms:show my_desc />
   <hr>
</cms:show_repeatable>
```
