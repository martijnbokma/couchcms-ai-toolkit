---
id: relationships
name: "Relationships"
category: "content"
version: "2.x"
description: "Page relationships and related content patterns"
required: false
requires: [couchcms-core]
conflicts: []
---


# Relationships

## Overview

Complete guide to establishing and managing relationships between pages in CouchCMS including one-to-one, one-to-many, and many-to-many patterns.

### artists.php

```php title="artists.php"
<cms:editable type='relation' name='artist_albums' masterpage='albums.php' />
```

### artists.php

```php title="artists.php"
<cms:if k_is_page >
   <!-- All variables of 'artists.php' are available here -->
   <h2>Artist: <cms:show k_page_title /></h2>

   <h3>Related albums:</h3>
   <cms:related_pages 'artist_albums' >
      <!-- All variables of 'albums.php' are available here -->
      <cms:show k_page_title />
   </cms:related_pages>
</cms:if>
```
