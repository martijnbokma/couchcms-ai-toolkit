---
title: Arrays (Midware)
description: Multi-level variables and arrays in CouchCMS - native support for JSON-based data structures
category: midware
tags: [arrays, json, data-structures, midware, variables]
difficulty: intermediate
---

# Arrays in CouchCMS

CouchCMS natively supports multi-level variables (arrays) that can contain multiple values, acting like arrays in JavaScript or PHP. This powerful feature enables complex data structures using JSON and dotted notation.

## Overview

**What You'll Learn:**
- Creating arrays with JSON syntax
- Accessing array values with dot notation
- Iterating through arrays with `<cms:each>`
- Working with nested arrays and objects
- Dynamic array manipulation
- Using `<cms:get>` and `<cms:put>` for dynamic keys

**Key Features:**
- Native JSON support (no addons required)
- Dot notation for nested access: `climate.Russia.Moscow`
- Mix objects and arrays in same structure
- Auto-indexing for unnamed keys
- Full integration with existing CouchCMS tags

---

## Basic Syntax

### Creating Arrays with JSON

Use `is_json='1'` parameter with setter tags (`<cms:set>`, `<cms:capture>`, `<cms:put>`):

```php
<cms:capture into='climate' is_json='1'>
{
    "Russia" : {
       "Moscow" : "cold",
       "Sochi"   : "warm"
    }
}
</cms:capture>

Climate in Moscow: <cms:show climate.Russia.Moscow /><br>
Climate in Sochi: <cms:show climate.Russia.Sochi />
```

**Output:**
```
Climate in Moscow: cold
Climate in Sochi: warm
```

### Using cms:set

```php
<cms:set i18='
{
  "en" : {
      "app" : {
          "greet" : "Hello!"
      }
  },
  "es" : {
      "app" : {
          "greet" : "Hola!"
      }
  }
}
' is_json='1' />

<cms:set lang='es' />
<cms:get "i18.<cms:show lang />.app.greet" />
<!-- Output: Hola! -->
```

---

## Dot Notation Access

Once a variable is set as an array, interact with it using dot notation:

```php
<cms:set my_climate=climate.Russia />
<cms:show my_climate.Sochi />
<!-- Output: warm -->
```

**No need for `is_json` when copying array references!**

---

## Building Arrays Dynamically

### Initialize and Populate

```php
<cms:set climate='[]' is_json='1' />
<cms:set climate.India='[]' is_json='1' />
<cms:set climate.India.Mumbai='pleasant' />
<cms:set climate.India.Delhi='moderate' />
<cms:set climate.Miami='great' />

<cms:show climate.India.Mumbai />
<!-- Output: pleasant -->
```

### View Array as JSON

```php
<cms:show climate as_json='1' />
```

**Output:**
```json
{"Russia":{"Moscow":"cold","Sochi":"warm"},"India":{"Mumbai":"pleasant","Delhi":"moderate"},"Miami":"great"}
```

---

## Auto-Indexing (Unnamed Keys)

Set values without explicit keys - Couch creates numeric indexes automatically:

```php
<cms:set climate='[]' is_json='1' />
<cms:set climate.Utopia='[]' is_json='1' />

<cms:set climate.Utopia.='unknown' />
<cms:set climate.Utopia.='uncertain' />
<cms:set climate.Utopia.='finicky' />

<!-- Access with numeric indexes -->
<cms:show climate.Utopia.0 />
<!-- Output: unknown -->
```

**Trailing dot** creates auto-indexed elements: `array.` = `array.0`, `array.1`, etc.

---

## Objects vs Arrays in JSON

### Arrays (Square Brackets)

```php
<cms:set fruits='["Apple", "Banana", "Strawberry", "Mango"]' is_json='1' />
<cms:show fruits.0 />
<!-- Output: Apple -->
```

### Objects (Curly Braces)

```php
<cms:capture into='org' is_json='1'>
{
   "name" : "Vivekananda School",
   "location" : "Delhi",
   "established" : "1971"
}
</cms:capture>

<cms:show org.name />
<!-- Output: Vivekananda School -->
```

### Array of Objects

```php
<cms:capture into='inventory' is_json='1'>
[
  { "name": "asparagus", "type": "vegetables" },
  { "name": "bananas",  "type": "fruit" },
  { "name": "cherries", "type": "fruit" }
]
</cms:capture>

<cms:show inventory.2.name />
<!-- Output: cherries -->
```

---

## Iterating Arrays with cms:each

### Basic Iteration

```php
<cms:each climate>
   <cms:show key /> - <cms:show item /><br>
</cms:each>
```

**Output:**
```
Russia - Array
India - Array
Miami - great
```

### Nested Iteration

```php
<cms:each climate.Russia>
   <cms:show key /> - <cms:show item /><br>
</cms:each>
```

**Output:**
```
Moscow - cold
Sochi - warm
```

### Deep Nested Loops

```php
<cms:each climate>
   <cms:if "<cms:is_array item />">
      <cms:show key /> (<cms:array_count item />)<br>

      <cms:each item>
         -- <cms:show key /> - <cms:show item /><br>
      </cms:each>
   <cms:else />
      <cms:show key /> - <cms:show item /><br>
   </cms:if>
</cms:each>
```

**Output:**
```
Russia (2)
-- Moscow - cold
-- Sochi - warm
India (2)
-- Mumbai - pleasant
-- Delhi - moderate
Miami - great
```

---

## Conditionals with Arrays

```php
<cms:if climate.Russia.Moscow == 'cold'>
   Cold!
<cms:else />
   Warm
</cms:if>
```

Check if array:
```php
<cms:if "<cms:is_array climate.Russia />">
   This is an array with <cms:array_count climate.Russia /> items
</cms:if>
```

---

## Adding to Arrays

### Append with Auto-Indexing

```php
<cms:set persons='[]' is_json='1' />
<cms:set persons.='{ "firstname":"Marilyn", "lastname":"Monroe" }' is_json='1' />
<cms:set persons.='{ "firstname":"Abraham", "lastname":"Lincoln" }' is_json='1' />
```

### Nested Arrays

```php
<cms:set party='[]' is_json='1' />
<cms:set party.hosts='[]' is_json='1' />
<cms:set party.guests='[]' is_json='1' />

<cms:set party.hosts.="John" />
<cms:set party.hosts.="Tanya" />
<cms:set party.guests.="Michael" />
<cms:set party.guests.="Kim" />
```

**Output:**
```json
{"hosts":["John","Tanya"],"guests":["Michael","Kim"]}
```

### Compact Syntax

```php
<cms:set party='{ "hosts" : "", "guests" : "" }' is_json='1' />
<cms:set party.hosts='[ "John", "Tanya" ]' is_json='1'/>
<cms:set party.guests='[ "Michael", "Kim" ]' is_json='1' />
```

---

## Dynamic Values and Escaping

### Using cms:capture (Recommended)

```php
<cms:set country='Japan' />
<cms:capture into='location' is_json='1'>
{
   "country" : "<cms:show country />"
}
</cms:capture>
```

### Auto-Escaping with cms:escape_json

```php
<cms:set mycountry='The "not so" Great Utopia' />
<cms:capture into='location' is_json='1'>
{
   "country" : <cms:escape_json><cms:show mycountry /></cms:escape_json>
}
</cms:capture>
```

**Output:**
```json
{"country":"The \"not so\" Great Utopia"}
```

### Direct Notation (Safest)

```php
<cms:set mycountry='Sweet Russia' />
<cms:set location='[]' is_json='1' />
<cms:set location.country=mycountry />
```

---

## cms:get and cms:put for Dynamic Keys

### Multi-Word Keys

```php
<cms:set person='[]' is_json='1' />
<cms:put var="person.First Name" value='Jane' scope='global' />
<cms:put var="person.Last Name" value='Doe' scope='global' />

<cms:get "person.First Name" /> <cms:get "person.Last Name" />
<!-- Output: Jane Doe -->
```

### Dynamic Index Access

```php
<cms:set requested_page="<cms:gpc 'page' default='1' />" />
<cms:get "book_pages.<cms:show requested_page />" />
```

### Rule of Thumb

**When crafting variable names on the fly:**
- For retrieving: Use `<cms:get>` instead of `<cms:show>`
- For setting: Use `<cms:put>` instead of `<cms:set>`

---

## Manipulating Arrays in Loops

```php
<cms:set climate='[]' is_json='1' />
<cms:set climate.='unknown' />
<cms:set climate.='uncertain' />
<cms:set climate.='finicky' />

Before: <cms:show climate as_json='1' /><br>

<cms:set loop_values='0|1|2' />
<cms:each loop_values sep='|'>
   <cms:if item eq '0' || item eq '2'>
      <cms:put "climate.<cms:show item />" 'wibble' scope='parent' />
   </cms:if>
</cms:each>

After: <cms:show climate as_json='1' /><br>
```

**Output:**
```
Before: ["unknown","uncertain","finicky"]
After: ["wibble","uncertain","wibble"]
```

**Important:** Use `scope='parent'` when setting variables from within loops!

---

## Scope Management

### cms:capture vs cms:set

- `<cms:capture>` executes in **global** scope by default
- `<cms:set>` defaults to **local** scope
- Always match scopes when working with same variable

```php
<cms:capture into='guests' is_json='1'>
[
   { "firstname":"Marilyn", "lastname":"Monroe" }
]
</cms:capture>

<!-- Both work in global scope -->
<cms:set hosts='[{"firstname":"Abraham", "lastname":"Lincoln"}]' is_json='1' scope='global' />
```

**Watch Your Scope!** Mismatched scopes are common debugging nightmares.

---

## Array Helper Tags

### is_array

```php
<cms:if "<cms:is_array climate.Russia />">
   This is an array
</cms:if>
```

### array_count (alias: arr_count)

```php
<cms:array_count climate.Russia />
<!-- Output: 2 -->
```

### arr_key_exists

```php
<cms:if "<cms:arr_key_exists climate 'Russia' />">
   Russia key exists
</cms:if>
```

### arr_val_exists

```php
<cms:if "<cms:arr_val_exists climate.Russia 'cold' />">
   Found cold climate
</cms:if>
```

---

## Practical Examples

### Shopping Cart

```php
<cms:each cart_items as='item'>
   <div class="bg-base-100 rounded-box p-4">
      <h3><cms:show item.name /></h3>
      <p>Price: $<cms:show item.price /></p>
      <p>Qty: <cms:show item.qty /></p>
      <p>Discount: <cms:show item.discount />%</p>
   </div>
</cms:each>
```

### Multi-Language Content

```php
<cms:set translations='
{
  "en" : { "welcome" : "Welcome", "logout" : "Logout" },
  "es" : { "welcome" : "Bienvenido", "logout" : "Cerrar sesión" },
  "fr" : { "welcome" : "Bienvenue", "logout" : "Déconnexion" }
}
' is_json='1' />

<cms:set current_lang='<cms:get_cookie 'site_lang' default='en' />' />
<h1><cms:get "translations.<cms:show current_lang />.welcome" /></h1>
```

### Configuration Object

```php
<cms:set config='
{
  "site" : {
    "name" : "My Site",
    "tagline" : "Welcome to our site",
    "email" : "contact@example.com"
  },
  "social" : {
    "twitter" : "@mysite",
    "facebook" : "mysite"
  }
}
' is_json='1' />

<title><cms:show config.site.name /> - <cms:show config.site.tagline /></title>
<a href="https://twitter.com/<cms:show config.social.twitter />">Follow us</a>
```

### Menu Builder

```php
<cms:set menu='[]' is_json='1' />
<cms:set menu.='{"label":"Home", "url":"/", "icon":"home"}' is_json='1' />
<cms:set menu.='{"label":"About", "url":"/about", "icon":"info"}' is_json='1' />
<cms:set menu.='{"label":"Contact", "url":"/contact", "icon":"envelope"}' is_json='1' />

<ul class="menu bg-base-200 rounded-box">
   <cms:each menu as='item'>
      <li>
         <a href="<cms:show item.url />">
            <i class="icon-<cms:show item.icon />"></i>
            <cms:show item.label />
         </a>
      </li>
   </cms:each>
</ul>
```

---

## Integration with TailwindCSS & Alpine.js

### Dynamic Class Generation

```php
<cms:set theme_colors='
{
  "primary" : "bg-blue-500",
  "secondary" : "bg-purple-500",
  "accent" : "bg-pink-500"
}
' is_json='1' />

<cms:set current_theme='primary' />
<div class="<cms:get "theme_colors.<cms:show current_theme />" /> p-4">
   Themed content
</div>
```

### Alpine.js State Management

```php
<cms:set initial_state='
{
  "cart" : [],
  "user" : { "name" : "Guest", "loggedIn" : false },
  "notifications" : 0
}
' is_json='1' />

<div x-data='<cms:show initial_state as_json='1' />'>
   <span x-text="user.name"></span>
   <span x-show="notifications > 0" x-text="notifications"></span>
</div>
```

---

## Best Practices

### JSON Validation

**Always validate JSON before use!** Invalid JSON results in variable not being set.

Use online validator: https://jsonlint.com/

### Initialization

```php
<!-- Always initialize as empty array -->
<cms:set myarray='[]' is_json='1' />
```

### Scope Awareness

```php
<!-- Match scopes when using capture and set together -->
<cms:capture into='data' is_json='1'>{"key":"value"}</cms:capture>
<cms:set data.newkey='newvalue' scope='global' />
```

### Error Prevention

```php
<!-- Check before accessing -->
<cms:if "<cms:arr_key_exists myarray 'somekey' />">
   <cms:show myarray.somekey />
</cms:if>
```

### Escaping Dynamic Content

```php
<!-- Use escape_json for user-generated content -->
<cms:set user_input="<cms:gpc 'comment' />" />
<cms:capture into='comment' is_json='1'>
{
   "text" : <cms:escape_json><cms:show user_input /></cms:escape_json>
}
</cms:capture>
```

---

## Common Patterns

### Building Result Sets

```php
<cms:set results='[]' is_json='1' />
<cms:pages masterpage='products.php' limit='10'>
   <cms:set results.='
   {
      "id" : "<cms:show k_page_id />",
      "title" : "<cms:show k_page_title />",
      "price" : "<cms:show product_price />"
   }
   ' is_json='1' />
</cms:pages>

<!-- Now iterate results -->
<cms:each results as='product'>
   <h3><cms:show product.title /></h3>
   <p>$<cms:show product.price /></p>
</cms:each>
```

### Pagination Data

```php
<cms:set pagination='
{
   "current" : <cms:show k_paginated_top />,
   "total" : <cms:show k_total_records />,
   "per_page" : <cms:show k_limit />,
   "total_pages" : <cms:show k_total_pages />
}
' is_json='1' />

<cms:if "<cms:get 'pagination.current' /> < <cms:get 'pagination.total_pages' />">
   <a href="<cms:link />page-<cms:add pagination.current '1' />/">Next</a>
</cms:if>
```

---

## Troubleshooting

### Variable Not Setting

**Problem:** Array variable is empty after setting
```php
<cms:set myarray='{ invalid json }' is_json='1' />
```

**Solution:** Validate JSON syntax
```php
<cms:set myarray='{"valid":"json"}' is_json='1' />
```

### Can't Access Nested Values

**Problem:** Getting empty output
```php
<cms:show myarray.level1.level2 />
```

**Solution:** Check if keys exist
```php
<cms:if "<cms:arr_key_exists myarray.level1 'level2' />">
   <cms:show myarray.level1.level2 />
<cms:else />
   Key not found
</cms:if>
```

### Scope Issues

**Problem:** Variable changes not persisting
```php
<cms:each items>
   <cms:set items.something='value' />
</cms:each>
```

**Solution:** Use `scope='parent'`
```php
<cms:each items>
   <cms:put "items.<cms:show key />.something" 'value' scope='parent' />
</cms:each>
```

### Multi-Word Keys

**Problem:** Can't access keys with spaces
```php
<cms:show person.First Name />
```

**Solution:** Use cms:get with quotes
```php
<cms:get "person.First Name" />
```

---

## Related Tags

- `<cms:set>` - Set variables with `is_json='1'`
- `<cms:capture>` - Capture content as JSON
- `<cms:show>` - Display array values with dot notation
- `<cms:get>` - Retrieve values with dynamic/quoted keys
- `<cms:put>` - Set values with dynamic/quoted keys
- `<cms:each>` - Iterate through arrays
- `<cms:is_array>` - Check if variable is array
- `<cms:array_count>` - Count array elements
- `<cms:arr_key_exists>` - Check if key exists
- `<cms:arr_val_exists>` - Check if value exists
- `<cms:escape_json>` - Escape strings for JSON

---

## Additional Resources

- [JSON Validator](https://jsonlint.com/)
- [CouchCMS Forums - Arrays Discussion](https://www.couchcms.com/forum/)
- [Midware Arrays Documentation](https://github.com/CouchCMS/Midware)
