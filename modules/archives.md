---
id: archives
name: "Archives"
category: "content"
version: "2.x"
description: "Archive views for time-based content organization"
required: false
requires: [couchcms-core]
conflicts: []
---


# Archives

## Overview

Complete guide to organizing and displaying archived pages by time periods in CouchCMS using the archives tag for blog and news archives.

### Basic Monthly Archive

```php title="blog.php"
<cms:archives masterpage='blog.php'>
    <cms:date k_archive_date format='F Y' /><br>
</cms:archives>
```

### Yearly Archive Example

```php title="blog.php"
<cms:archives masterpage='blog.php' type='yearly'>
    <cms:date k_archive_date format='F Y' /><br>
</cms:archives>
```

### Archive Menu Example

```php title="blog.php"
<ul>
<cms:archives limit='6'>
    <li>
        <a href="<cms:show k_archive_link/>"><cms:date k_archive_date format='F Y' /></a>
        (<cms:show k_archive_count />)
    </li>
</cms:archives>
</ul>
```
