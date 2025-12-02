---
id: custom-routes
name: "Custom Routes"
category: "navigation"
version: "2.x"
description: "Custom URL routing and clean URL patterns"
required: false
requires: [couchcms-core]
conflicts: []
---


# Custom Routes

## Overview

### Introduction to Custom Routes

```php title="template.php"
http://www.yoursite.com/blog.php?p=12
http://www.yoursite.com/blog/some_page_name.html (with prettyURLs activated)
```

### Validation & Constraints

```php title="template.php"
<cms:route name='edit_view' path='{:id}/edit' />
```

### URL Generation

```php title="template.php"
<cms:route_link 'edit_view' rt_id='41' />
```
