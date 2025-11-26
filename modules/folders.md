---
id: folders
name: "Folders"
category: "content"
version: "2.x"
description: "Content organization with virtual folders and nested pages"
required: false
requires: [couchcms-core]
conflicts: []
---

# folders




## Folders

Master content organization with CouchCMS virtual folders, create SEO-friendly URL hierarchies, and build dynamic navigation menus with folder-based structure.

### news.php

```php
<cms:folder name="world" title="World News">
    <cms:folder name="north-america" title="North American News">
        <cms:folder name="united-states" title="United States News">
            <cms:folder name="ohio" title="Ohio News" />
            <cms:folder name="nevada" title="Nevada News" />
        </cms:folder>
    </cms:folder>
    <cms:folder name="asia" title="Asian News">
        <cms:folder name="china" title="China News" />
        <cms:folder name="japan" title="Japan News" />
    </cms:folder>
</cms:folder>
<cms:folder name="sports" title="Sports News" />
<cms:folder name="music" title="Music News" />
<cms:folder name="entertainment" title="Entertainment News" />
```

### Root URL

```txt
https://www.yoursite.com/news/a-hot-news.html
```

### Music News URL

```txt
https://www.yoursite.com/news/music/a-hot-news.html
```


## Nested Pages (AKA Menu Maker)

Complete guide to creating hierarchical page structures and dynamic navigation menus using nested pages in CouchCMS with drag-and-drop ordering.

### Critical Rules

**Important**

If not, please first take a look at the [**Cloned Pages**](../cloned-pages/) documentation. Much of the current discussion will not make much sense unless you are familiar with the regular cloned pages in Couch.

**Important**

Always get the URL of any section being pointed to by visiting it and copying its URL from the address bar of the browser.

### Nested Page URL Example

```txt
https://www.yoursite.com/one/two/three/
```

### URL Structure Example

```txt
https://www.yoursite.com/one/two/three/
```

### Basic Template Declaration

```php
<cms:template clonable="1">

    // ... existing code ...

</cms:template>
```


## nested_pages Tag

### Example

```php
<cms:nested_pages masterpage='index.php'>
    <a href="<cms:show k_nestedpage_link />"><cms:show k_nestedpage_title /></a><br />
</cms:nested_pages>
```

### Example

```txt
World News
North American News
United States News
Ohio News
Nevada News
Asian News
China News
Japan News
Sports News
Music News
Entertainment News
```


## dropdownfolders Tag

### Basic Dropdown Example

```php
<cms:dropdownfolders masterpage="news.php" />
```
