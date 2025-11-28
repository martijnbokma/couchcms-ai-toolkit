---
name: CouchCMS Core
description: Core CouchCMS patterns, templates, and security standards
allowed-tools: Read, Write, Bash, Grep
type: module
category: core
version: 2.3
---



# CouchCMS Core Standards

## Template Structure

### Basic Template

&#x60;&#x60;&#x60;php title&#x3D;&quot;cms.php&quot;
&lt;?php require_once(&#x27;couch/cms.php&#x27;); ?&gt;
&lt;cms:extends &#x27;layouts/base.html&#x27; /&gt;
&lt;cms:block &#x27;templates&#x27;&gt;
    &lt;cms:template title&#x3D;&#x27;Page Name&#x27; clonable&#x3D;&#x27;1&#x27; routable&#x3D;&#x27;1&#x27;&gt;
        &lt;cms:editable name&#x3D;&#x27;content&#x27; label&#x3D;&#x27;Content&#x27; type&#x3D;&#x27;richtext&#x27; /&gt;
    &lt;/cms:template&gt;
&lt;/cms:block&gt;
&lt;cms:block &#x27;content&#x27;&gt;
    &lt;!-- Page content here --&gt;
&lt;/cms:block&gt;
&lt;?php COUCH::invoke(); ?&gt;
&#x60;&#x60;&#x60;

### Template Inheritance

- Use &#x60;&lt;cms:extends&gt;&#x60; for layout inheritance
- Define blocks with &#x60;&lt;cms:block&gt;&#x60;
- Use &#x60;&lt;cms:embed&gt;&#x60; for reusable snippets

## Security Standards

### 🚨 CRITICAL: HTML Comment Security

- **NEVER** use &#x60;&lt;cms:&#x60; tags inside HTML comments - CouchCMS executes them!
- Use &#x60;[cms:&#x60; instead of &#x60;&lt;cms:&#x60; in comments
- Wrap multiline comments with CouchCMS tags in &#x60;&lt;cms:ignore&gt;&#x60; blocks

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;!-- ❌ BAD: This will execute and crash the site --&gt;
&lt;!-- &lt;cms:show my_variable /&gt; --&gt;

&lt;!-- ✅ GOOD: Use square brackets in comments --&gt;
&lt;!-- [cms:show my_variable /] --&gt;

&lt;!-- ✅ GOOD: Use cms:ignore for multiline --&gt;
&lt;cms:ignore&gt;
  &lt;cms:show my_variable /&gt;
  &lt;cms:if condition&gt;...&lt;/cms:if&gt;
&lt;/cms:ignore&gt;
&#x60;&#x60;&#x60;

### Authentication Patterns

- Use &#x60;snippets/filters/authenticated.html&#x60; for authentication checks
- Use &#x60;snippets/filters/owns_{content}.html&#x60; for ownership validation
- Always validate user input and sanitize outputs
- Implement CSRF protection for all forms

## Self-Closing Tags

### 🚨 CRITICAL: else/else_if Syntax

&#x60;&lt;cms:else /&gt;&#x60; and &#x60;&lt;cms:else_if /&gt;&#x60; are **self-closing** tags:

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;!-- ✅ GOOD: Self-closing syntax --&gt;
&lt;cms:if condition&gt;
  &lt;div&gt;Condition is true&lt;/div&gt;
  &lt;cms:else_if other_condition /&gt;
  &lt;div&gt;Other condition is true&lt;/div&gt;
  &lt;cms:else /&gt;
  &lt;div&gt;Default content&lt;/div&gt;
&lt;/cms:if&gt;

&lt;!-- ❌ BAD: Paired tags cause parsing errors --&gt;
&lt;cms:if condition&gt;
  &lt;cms:else&gt;&lt;/cms:else&gt;
  &lt;!-- WRONG! --&gt;
&lt;/cms:if&gt;
&#x60;&#x60;&#x60;

## Data Patterns

### Pages Query

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.php&quot;
&lt;cms:pages
  masterpage&#x3D;&quot;template.php&quot;
  limit&#x3D;&quot;10&quot;
  orderby&#x3D;&quot;publish_date&quot;
  order&#x3D;&quot;desc&quot;
&gt;
  &lt;h2&gt;&lt;cms:show k_page_title /&gt;&lt;/h2&gt;
  &lt;cms:show content /&gt;
&lt;/cms:pages&gt;
&#x60;&#x60;&#x60;

### Relationships

&#x60;&#x60;&#x60;html title&#x3D;&quot;items.php&quot;
&lt;cms:editable name&#x3D;&#x27;related_items&#x27; label&#x3D;&#x27;Related Items&#x27;
    type&#x3D;&#x27;relation&#x27; masterpage&#x3D;&#x27;items.php&#x27; /&gt;

&lt;!-- Display related items --&gt;
&lt;cms:related_pages &#x27;related_items&#x27;&gt;
    &lt;cms:show k_page_title /&gt;
&lt;/cms:related_pages&gt;
&#x60;&#x60;&#x60;

### Repeatable Regions

&#x60;&#x60;&#x60;html title&#x3D;&quot;template.html&quot;
&lt;cms:editable name&#x3D;&#x27;gallery&#x27; label&#x3D;&#x27;Gallery&#x27; type&#x3D;&#x27;repeatable&#x27;&gt;
    &lt;cms:editable name&#x3D;&#x27;image&#x27; label&#x3D;&#x27;Image&#x27; type&#x3D;&#x27;image&#x27; /&gt;
    &lt;cms:editable name&#x3D;&#x27;caption&#x27; label&#x3D;&#x27;Caption&#x27; type&#x3D;&#x27;text&#x27; /&gt;
&lt;/cms:editable&gt;

&lt;!-- Display --&gt;
&lt;cms:show_repeatable &#x27;gallery&#x27;&gt;
    &lt;img src&#x3D;&quot;&lt;cms:show image /&gt;&quot; alt&#x3D;&quot;&lt;cms:show caption /&gt;&quot; /&gt;
&lt;/cms:show_repeatable&gt;
&#x60;&#x60;&#x60;

## Template Execution Order

### 🚨 CRITICAL: Execution Order

In CouchCMS template inheritance:

- &#x60;&lt;cms:embed&gt;&#x60; components execute at their position in the parent template
- Child &#x60;&lt;cms:block&gt;&#x60; content executes AFTER all parent template code
- Variables set in child blocks are NOT available to components embedded earlier in the parent

**Always verify execution order before using variables.**

## Best Practices

### DO

- Use idiomatic CouchCMS tags, avoid &#x60;&lt;cms:php&gt;&#x60; when possible
- Create reusable snippets for common patterns
- Use template inheritance for consistent layouts
- Validate all user input
- Use Extended Users for authentication

### DON&#x27;T

- Put &#x60;&lt;cms:&#x60; tags in HTML comments
- Use paired tags for &#x60;&lt;cms:else /&gt;&#x60; or &#x60;&lt;cms:else_if /&gt;&#x60;
- Assume variables are available without checking execution order
- Skip CSRF protection on forms
- Use &#x60;&lt;cms:php&gt;&#x60; for things CouchCMS tags can do

## Naming Conventions

- **Template files**: &#x60;kebab-case.php&#x60; (e.g., &#x60;user-profile.php&#x60;)
- **Snippet files**: &#x60;kebab-case.html&#x60; (e.g., &#x60;user-card.html&#x60;)
- **Editable names**: &#x60;snake_case&#x60; (e.g., &#x60;content_owner&#x60;)
- **Variables**: &#x60;snake_case&#x60; (e.g., &#x60;my_variable&#x60;)

