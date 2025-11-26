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

# custom-routes




## Custom Routes

### Introduction to Custom Routes

```php
http://www.yoursite.com/blog.php?p=12
http://www.yoursite.com/blog/some_page_name.html (with prettyURLs activated)
```

### Validation & Constraints

```php
<cms:route name='edit_view' path='{:id}/edit' />
```

### URL Generation

```php
<cms:route_link 'edit_view' rt_id='41' />
```
