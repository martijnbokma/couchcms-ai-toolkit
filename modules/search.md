---
id: search
name: "Search"
category: "navigation"
version: "2.x"
description: "Search functionality with MySQL fulltext and relevance ranking"
required: false
requires: [couchcms-core]
conflicts: []
---

# search




## Search

Complete guide to implementing search functionality in CouchCMS using MySQL fulltext search with relevance ranking and pagination support.

### Search URL Example

```txt
https://www.yoursite.com/search.php?s=hello+world
```

### Basic Search Form

```php
<cms:search_form />
```

### Search Form with Custom Processor

```php
<cms:search_form msg='Enter keywords' processor="<cms:show k_site_link />search.php" />
```


## search Tag

### Example

```php
<cms:search masterpage='news.php' >..</cms:search>
```

### Example

```php
<cms:search masterpage='news.php, blog.php' >..</cms:search>
```


## search_form Tag

### Example

```php
<cms:search_form />
```

### Example

```php
<cms:search_form msg='Search' processor="<cms:show k_site_link/>search.php" />
```
