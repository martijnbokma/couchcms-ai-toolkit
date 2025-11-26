---
id: pagination
name: "Pagination"
category: "navigation"
version: "2.x"
description: "Pagination controls for pages, search results, and comments"
required: false
requires: [couchcms-core]
conflicts: []
---

# pagination




## Pagination

Comprehensive guide to implementing pagination in CouchCMS for pages, search results, and comments with navigation controls and page numbering.

### Basic Pagination Example

```php
<cms:pages masterpage="blog.php" limit="10" paginate="1">
    <!-- Pagination variables available here -->
</cms:pages>
```

### Manual Pagination Example

```php
<cms:pages masterpage="blog.php" limit="10" paginate="1">
    <cms:if k_paginated_top>
        <cms:if k_paginator_required >
            Page <cms:show k_current_page /> of <cms:show k_total_pages /><br>
        </cms:if>
        <cms:show k_total_records /> Pages Found.
        Displaying: <cms:show k_record_from />-<cms:show k_record_to />
    </cms:if>

    <!-- All the page variables can be accessed here -->

    <cms:if k_paginated_bottom >
        <cms:if k_paginate_link_prev >
            <a href="<cms:show k_paginate_link_prev />">prev</a>
        </cms:if>
        <cms:if k_paginate_link_next >
            <a href="<cms:show k_paginate_link_next />">next</a>
        </cms:if>
    </cms:if>
</cms:pages>
```

### Using Paginator Tag

```php
<cms:pages masterpage="blog.php" limit="10" paginate="1">
    <cms:if k_paginated_top>
        <cms:if k_paginator_required >
            Page <cms:show k_current_page /> of <cms:show k_total_pages /><br>
        </cms:if>
        <cms:show k_total_records /> Pages Found.
        Displaying: <cms:show k_record_from />-<cms:show k_record_to />
    </cms:if>

    <!-- All the page variables can be accessed here -->

    <cms:paginator />
</cms:pages>
```


## paginator Tag

### Example

```php
<cms:paginator />
```
