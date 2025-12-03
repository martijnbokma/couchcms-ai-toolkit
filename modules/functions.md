---
title: Reusable Functions (Midware)
description: Create DRY, reusable code blocks with CouchCMS functions - organize logic, reduce duplication
category: midware
tags: [functions, func, call, reusable-code, midware, dry, code-organization]
difficulty: intermediate
---

# Reusable Functions in CouchCMS

CouchCMS supports reusable functions (Midware feature) that allow you to define callable code blocks with parameters, promoting DRY (Don't Repeat Yourself) principles and better code organization.

## Overview

**What You'll Learn:**
- Creating functions with `<cms:func>`
- Calling functions with `<cms:call>`
- Working with named and unnamed parameters
- Recursive functions
- Organizing functions in snippets
- Auto-loading functions with addons
- Functions vs Embeds vs Custom Tags

**Key Benefits:**
- **DRY Code** - Define once, use anywhere
- **Parameterization** - Flexible, reusable logic
- **Organization** - Group related code
- **Maintainability** - Update in one place
- **Recursion** - Support for recursive algorithms

---

## Basic Syntax

### Defining a Function

Use `<cms:func>` tag with function name and parameters:

```php
<cms:func 'makecoffee' type='cappuccino'>
   Making a cup of <cms:show type />.<br>
</cms:func>
```

**Important:** Every parameter MUST have a default value (can be empty string).

### Calling a Function

Use `<cms:call>` tag with function name and optional arguments:

```php
<cms:call 'makecoffee' />
<!-- Output: Making a cup of cappuccino. -->

<cms:call 'makecoffee' 'espresso' />
<!-- Output: Making a cup of espresso. -->
```

---

## Parameter Passing

### Named Parameters

```php
<cms:func 'makecoffee2' type='cappuccino' size='medium'>
   Making a <cms:show size /> cup of <cms:show type />.<br>
</cms:func>

<!-- Call with named parameters (any order) -->
<cms:call 'makecoffee2' size='small' type='espresso' />
<!-- Output: Making a small cup of espresso. -->
```

### Unnamed Parameters

```php
<!-- Call with unnamed parameters (strict order) -->
<cms:call 'makecoffee2' 'espresso' 'large' />
<!-- Output: Making a large cup of espresso. -->
```

**Order matters!** Unnamed parameters must match definition order.

### Mixed Named/Unnamed

```php
<cms:call 'makecoffee2' 'latte' size='small' />
<!-- First unnamed param → type, named param → size -->
```

### Default Values

```php
<cms:call 'makecoffee2' />
<!-- Uses defaults: Making a medium cup of cappuccino. -->
```

---

## Complete Examples

### Example 1: Simple Function

```php
<cms:func 'greet' name='Guest' greeting='Hello'>
   <cms:show greeting />, <cms:show name />!
</cms:func>

<cms:call 'greet' />
<!-- Output: Hello, Guest! -->

<cms:call 'greet' 'John' />
<!-- Output: Hello, John! -->

<cms:call 'greet' name='Sarah' greeting='Hi' />
<!-- Output: Hi, Sarah! -->
```

### Example 2: Alert Component

```php
<cms:func 'alert' type='warning' message='Alert!'>
   <div class="alert alert-<cms:show type /> shadow-lg">
      <cms:show message />
   </div>
</cms:func>

<cms:call 'alert' type='success' message='Profile updated!' />
<cms:call 'alert' type='error' message='Invalid input!' />
```

**Output:**
```html
<div class="alert alert-success shadow-lg">
   Profile updated!
</div>
<div class="alert alert-error shadow-lg">
   Invalid input!
</div>
```

### Example 3: Recursive Function

```php
<cms:func 'countdown' count='10'>
   <cms:if count gt '0'>
      <cms:show count />...<br>
      <cms:call 'countdown' "<cms:sub count '1' />" />
   <cms:else />
      Blast off! 🚀
   </cms:if>
</cms:func>

<cms:call 'countdown' '5' />
```

**Output:**
```
5...
4...
3...
2...
1...
Blast off! 🚀
```

---

## Organizing Functions

### Snippet-Based Organization

Create `snippets/functions.html`:

```php
<cms:hide>
   <!-- Coffee maker function -->
   <cms:func 'makecoffee' type='cappuccino'>
      Making a cup of <cms:show type />.<br>
   </cms:func>

   <!-- Alert component -->
   <cms:func 'alert' type='warning' message=''>
      <div class="alert alert-<cms:show type />">
         <cms:show message />
      </div>
   </cms:func>

   <!-- Greeting function -->
   <cms:func 'greet' name='Guest'>
      Hello, <cms:show name />!
   </cms:func>
</cms:hide>
```

**Use in templates:**

```php
<?php require_once('couch/cms.php'); ?>

<!-- Embed functions at beginning -->
<cms:embed 'functions.html' />

<!-- Now call anywhere -->
<cms:call 'alert' type='success' message='Welcome!' />
<cms:call 'greet' 'John' />
```

### Organizing by Category

```
snippets/
  ├── funcs-components.html    (UI components)
  ├── funcs-utilities.html     (Helper functions)
  ├── funcs-formatters.html    (Data formatting)
  └── funcs-validators.html    (Validation logic)
```

**Load all in base layout:**

```php
<cms:embed 'funcs-components.html' />
<cms:embed 'funcs-utilities.html' />
<cms:embed 'funcs-formatters.html' />
```

---

## Auto-loading Functions

### Using func-on-demand Addon

Instead of manually embedding, use the **func-on-demand** addon:

**Install:** Place addon in `couch/addons/`

**Configure:** Specify functions folder path

**Benefit:** Functions auto-load when called (no manual embed needed!)

```php
<!-- No embed needed! -->
<cms:call 'makecoffee' 'latte' />
<!-- Addon automatically finds and loads function -->
```

**Folder structure:**
```
snippets/funcs/
  ├── makecoffee.html
  ├── alert.html
  ├── greet.html
  └── countdown.html
```

Each file contains ONE function with matching name.

---

## Functions vs Embed vs Custom Tags

### Functions

**Use when:**
- Need reusable code blocks
- Want parameter flexibility
- Building component library
- Implementing recursive logic

**Pros:**
- Named parameters
- Default values
- Clean syntax: `<cms:call 'name' />`
- Can recurse
- Easy to organize

**Cons:**
- Must define before calling (or use auto-load)
- Extra wrapping tags

### Embeds (with parameters)

**Use when:**
- Need very granular components
- Want to accept dynamic parameters
- Building single-use includes

**Pros:**
- No pre-definition needed
- Can access undefined parameters
- Clean content (no wrapping)
- Immediate use

**Cons:**
- Verbose syntax: `<cms:embed 'snippet.html' param='value'></cms:embed>`
- No default values built-in
- Can't recurse

**Example:**
```php
<cms:embed 'alert.html' type='success' text='Saved!'></cms:embed>
```

### Custom Tags (PHP)

**Use when:**
- Need complex PHP logic
- Require performance optimization
- Building core functionality
- Working with external APIs/databases

**Pros:**
- Full PHP power
- Best performance
- Can access CouchCMS internals

**Cons:**
- Requires PHP knowledge
- Harder to share
- Must be in `couch/addons/kfunctions.php`

---

## Practical Examples

### Card Component

```php
<cms:func 'card' title='' description='' image='' link='#'>
   <div class="card bg-base-100 shadow-xl">
      <cms:if image ne ''>
         <figure>
            <img src="<cms:show image />" alt="<cms:show title />" />
         </figure>
      </cms:if>
      <div class="card-body">
         <h2 class="card-title"><cms:show title /></h2>
         <p><cms:show description /></p>
         <div class="card-actions justify-end">
            <a href="<cms:show link />" class="btn btn-primary">Learn More</a>
         </div>
      </div>
   </div>
</cms:func>

<!-- Usage -->
<cms:call 'card'
   title='Product Name'
   description='Amazing product description here'
   image='<cms:show k_site_link />images/product.jpg'
   link='/products/item-1'
/>
```

### Breadcrumbs

```php
<cms:func 'breadcrumb_item' label='' link='' active='0'>
   <li>
      <cms:if active eq '1'>
         <span class="text-base-content/70"><cms:show label /></span>
      <cms:else />
         <a href="<cms:show link />"><cms:show label /></a>
      </cms:if>
   </li>
</cms:func>

<!-- Usage -->
<ul class="breadcrumbs">
   <cms:call 'breadcrumb_item' label='Home' link='/' />
   <cms:call 'breadcrumb_item' label='Blog' link='/blog/' />
   <cms:call 'breadcrumb_item' label='<cms:show k_page_title />' active='1' />
</ul>
```

### Format Date

```php
<cms:func 'format_date' date='' format='F j, Y'>
   <cms:date date format='<cms:show format />' />
</cms:func>

<!-- Usage -->
<cms:call 'format_date' date='<cms:show k_page_date />' />
<!-- Output: December 3, 2025 -->

<cms:call 'format_date' date='<cms:show k_page_date />' format='Y-m-d' />
<!-- Output: 2025-12-03 -->
```

### Price Formatter

```php
<cms:func 'format_price' amount='0' currency='$'>
   <cms:show currency /><cms:number_format amount decimals='2' />
</cms:func>

<!-- Usage -->
<cms:call 'format_price' amount='1234.5' />
<!-- Output: $1,234.50 -->

<cms:call 'format_price' amount='99.99' currency='€' />
<!-- Output: €99.99 -->
```

### Social Share Buttons

```php
<cms:func 'social_share' url='' title=''>
   <div class="flex gap-2">
      <a href="https://twitter.com/intent/tweet?url=<cms:show url />&text=<cms:show title />"
         class="btn btn-circle btn-sm">
         Twitter
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=<cms:show url />"
         class="btn btn-circle btn-sm">
         Facebook
      </a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=<cms:show url />"
         class="btn btn-circle btn-sm">
         LinkedIn
      </a>
   </div>
</cms:func>

<!-- Usage -->
<cms:call 'social_share'
   url='<cms:show k_page_link />'
   title='<cms:show k_page_title />'
/>
```

---

## Advanced Patterns

### Recursive Menu Builder

```php
<cms:func 'menu_recursive' masterpage='' parent_id='-1' depth='0'>
   <cms:pages masterpage=masterpage custom_field='k_page_foldername=<cms:show parent_id />'>
      <cms:if depth eq '0'><ul class="menu"><cms:else /><ul></cms:if>
         <li>
            <a href="<cms:show k_page_link />"><cms:show k_page_title /></a>
            <cms:call 'menu_recursive'
               masterpage=masterpage
               parent_id=k_page_id
               depth="<cms:add depth '1' />"
            />
         </li>
      <cms:if depth eq '0'></ul></cms:if>
   </cms:pages>
</cms:func>
```

### Conditional Wrapper

```php
<cms:func 'wrap_if' condition='0' tag='div' class=''>
   <cms:if condition eq '1'>
      <<cms:show tag /> class="<cms:show class />">
         <cms:yield />
      </<cms:show tag />>
   <cms:else />
      <cms:yield />
   </cms:if>
</cms:func>
```

### Pagination Helper

```php
<cms:func 'pagination' current='1' total='1' link_base=''>
   <div class="join">
      <cms:if current gt '1'>
         <a href="<cms:show link_base />page-<cms:sub current '1' />/"
            class="join-item btn">«</a>
      </cms:if>

      <cms:repeat count=total startcount='1'>
         <cms:if k_count eq current>
            <button class="join-item btn btn-active"><cms:show k_count /></button>
         <cms:else />
            <a href="<cms:show link_base />page-<cms:show k_count />/"
               class="join-item btn"><cms:show k_count /></a>
         </cms:if>
      </cms:repeat>

      <cms:if current lt total>
         <a href="<cms:show link_base />page-<cms:add current '1' />/"
            class="join-item btn">»</a>
      </cms:if>
   </div>
</cms:func>
```

---

## Integration with TailwindCSS & daisyUI

### Button Function

```php
<cms:func 'button'
   text='Click'
   type='button'
   variant='primary'
   size='md'
   link=''>

   <cms:if link ne ''>
      <a href="<cms:show link />"
         class="btn btn-<cms:show variant /> btn-<cms:show size />">
         <cms:show text />
      </a>
   <cms:else />
      <button type="<cms:show type />"
              class="btn btn-<cms:show variant /> btn-<cms:show size />">
         <cms:show text />
      </button>
   </cms:if>
</cms:func>

<!-- Usage -->
<cms:call 'button' text='Submit' type='submit' variant='primary' />
<cms:call 'button' text='Cancel' variant='ghost' link='/cancel' />
```

### Badge Function

```php
<cms:func 'badge' text='' variant='neutral' size='md'>
   <span class="badge badge-<cms:show variant /> badge-<cms:show size />">
      <cms:show text />
   </span>
</cms:func>

<!-- Usage -->
<cms:call 'badge' text='New' variant='success' />
<cms:call 'badge' text='Sale' variant='error' size='lg' />
```

### Modal Function

```php
<cms:func 'modal' id='' title='' content=''>
   <dialog id="<cms:show id />" class="modal">
      <div class="modal-box">
         <h3 class="font-bold text-lg"><cms:show title /></h3>
         <p class="py-4"><cms:show content /></p>
         <div class="modal-action">
            <form method="dialog">
               <button class="btn">Close</button>
            </form>
         </div>
      </div>
   </dialog>
</cms:func>

<!-- Usage -->
<cms:call 'modal'
   id='my_modal'
   title='Welcome!'
   content='This is a modal dialog.'
/>
<button class="btn" onclick="my_modal.showModal()">Open Modal</button>
```

---

## Best Practices

### Function Naming

```php
<!-- ✅ Good: Descriptive, verb-based -->
<cms:func 'format_price' amount=''>
<cms:func 'render_card' title=''>
<cms:func 'validate_email' email=''>

<!-- ❌ Bad: Vague, unclear -->
<cms:func 'do_stuff' data=''>
<cms:func 'func1' x=''>
```

### Parameter Defaults

```php
<!-- ✅ Good: All parameters have defaults -->
<cms:func 'alert' type='info' message='' closable='1'>

<!-- ❌ Bad: Missing default value -->
<cms:func 'alert' type message=''>
```

### Documentation

```php
<cms:hide>
   <!--
   Function: render_card
   Description: Renders a card component with image, title, description
   Parameters:
      - title (string): Card title
      - description (string): Card description
      - image (string): Image URL
      - link (string): Card link URL
   Example:
      <cms:call 'render_card' title='Hello' image='/img/card.jpg' />
   -->
   <cms:func 'render_card' title='' description='' image='' link='#'>
      <!-- Function body -->
   </cms:func>
</cms:hide>
```

### Organization

```php
<!-- Group related functions -->
<cms:hide>
   <!-- === UI Components === -->
   <cms:func 'button'...>
   <cms:func 'card'...>
   <cms:func 'badge'...>

   <!-- === Formatters === -->
   <cms:func 'format_date'...>
   <cms:func 'format_price'...>

   <!-- === Utilities === -->
   <cms:func 'truncate_text'...>
   <cms:func 'sanitize_input'...>
</cms:hide>
```

### Avoiding Side Effects

```php
<!-- ✅ Good: Pure function (no side effects) -->
<cms:func 'calculate_total' price='0' qty='1'>
   <cms:mul price qty />
</cms:func>

<!-- ❌ Bad: Modifies global state -->
<cms:func 'bad_function' value=''>
   <cms:set global_var=value scope='global' />
</cms:func>
```

---

## Common Patterns

### Conditional Rendering

```php
<cms:func 'render_if' condition='0' content=''>
   <cms:if condition eq '1'>
      <cms:show content />
   </cms:if>
</cms:func>
```

### Default Value Handler

```php
<cms:func 'get_or_default' value='' default='N/A'>
   <cms:if value ne ''>
      <cms:show value />
   <cms:else />
      <cms:show default />
   </cms:if>
</cms:func>
```

### Truncate Text

```php
<cms:func 'truncate' text='' length='100' suffix='...'>
   <cms:if "<cms:length text /> gt length">
      <cms:substr text '0' length /><cms:show suffix />
   <cms:else />
      <cms:show text />
   </cms:if>
</cms:func>
```

---

## Troubleshooting

### Function Not Found

**Problem:** `<cms:call 'myfunction' />` gives error

**Solutions:**
- Ensure function is defined before call
- Check function name spelling
- Verify snippet is embedded
- Use func-on-demand addon for auto-loading

### Parameter Not Working

**Problem:** Parameter value not showing correctly

**Solutions:**
- Verify parameter has default value in definition
- Check parameter name spelling
- Ensure unnamed params are in correct order
- Use named params for clarity

### Recursion Limit

**Problem:** Recursive function hits limit

**Solutions:**
- Add base case to stop recursion
- Check condition logic
- Limit depth with counter parameter

### Scope Issues

**Problem:** Variables not accessible in function

**Solutions:**
- Pass values as parameters (recommended)
- Use `scope='global'` if needed
- Avoid relying on external variables

---

## Related Tags

- `<cms:func>` - Define reusable function
- `<cms:call>` - Call defined function
- `<cms:func_exists>` - Check if function exists
- `<cms:embed>` - Embed snippet with parameters
- `<cms:hide>` - Hide function definitions from output

---

## Additional Resources

- [func-on-demand Addon](https://github.com/trendoman/Tweakus-Dilectus/tree/main/anton.cms%40ya.ru__func-on-demand)
- [Cms-Fu Repository (Function Examples)](https://github.com/trendoman/Cms-Fu)
- [Midware Tags Reference - func](https://github.com/trendoman/Midware/tree/main/tags-reference/func.md)
- [Midware Tags Reference - call](https://github.com/trendoman/Midware/tree/main/tags-reference/call.md)
