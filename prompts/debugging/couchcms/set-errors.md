# Debug CouchCMS "set" Tag Error - Comprehensive Prompt

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Role

Expert CouchCMS developer specializing in template syntax debugging, error resolution, and compliance with project coding standards.

## Objective

Identify and fix all CouchCMS `<cms:set>` tag syntax errors in the matters-student-hub project, ensuring compliance with CouchCMS parsing rules and standards.md requirements.

## Context

This guide addresses the CouchCMS error: `ERROR: Tag "set" is a self closing tag.`

The matters-student-hub project uses:

- **CMS**: CouchCMS (extended users)
- **Languages**: PHP, TypeScript, CSS, HTML (English only per standards.md)
- **Indentation**: 4 spaces (standards.md requirement)
- **Error Context**: CouchCMS has strict parsing rules for `<cms:set>` tag syntax

## Error Message

```
ERROR: Tag "set" is a self closing tag.
```

## Understanding the Issue

**CRITICAL**: `<cms:set>` is a **SELF-CLOSING TAG ONLY**. Paired tag syntax will ALWAYS cause an error.

### ❌ INCORRECT: Paired Tag Syntax (NEVER WORKS)

```html
<!-- These will ALL cause the error -->
<cms:set name="my_variable"></cms:set>
<cms:set my_variable></cms:set>
<cms:set my_var>
    <cms:if condition>value1<cms:else />value2</cms:if>
</cms:set>

<!-- Even with name attribute - WRONG -->
<cms:set name="my_variable"></cms:set>
```

### ✅ CORRECT: Self-Closing Syntax (ONLY Valid Options)

#### 1. Variable Declaration (for flash/capture)

```html
<!-- Declare variable first -->
<cms:set my_variable />

<!-- Then set its value -->
<cms:get_flash 'my_variable' />

<!-- Or use with captured content -->
<cms:set my_content />
<cms:capture into='my_content'>
    <div>Some complex HTML</div>
</cms:capture>
```

#### 2. Direct Value Assignment

```html
<!-- Simple value -->
<cms:set my_variable="value" />

<!-- With scope -->
<cms:set my_variable="value" scope="global" />

<!-- Complex expression in attribute -->
<cms:set total="<cms:add '10' '20' />" />
```

#### 3. Conditional Logic (nested tags in attribute)

```html
<!-- CORRECT: Nested tags inside the attribute -->
<cms:set my_var="<cms:if condition>value1<cms:else />value2</cms:if>" />

<!-- Alternative: Separate set statements -->
<cms:if condition>
    <cms:set my_var="value1" />
    <cms:else />
    <cms:set my_var="value2" />
</cms:if>
```

#### 4. Complex Queries

```html
<!-- Count query result -->
<cms:set my_count="<cms:pages masterpage='blog.php' count_only='1' />" />

<!-- Show tag output -->
<cms:set page_name="<cms:show k_page_name />" />
```

## Debugging Steps

### Step 1: Identify the Error Location

The error message should indicate which file and line number. Look for:

- Template files (`.php`)
- Snippet files in `/snippets/`
- Layout files in `/snippets/layouts/`

### Step 2: Search for Incorrect Usage

Search your codebase for patterns like:

```bash
# Find paired set tags (potential issues)
grep -r "<cms:set name=" snippets/
grep -r "</cms:set>" snippets/

# Find self-closing declarations (should be fine)
grep -r "<cms:set [a-z_]* />" snippets/
```

### Step 3: Common Error Patterns

#### Pattern 1: Flash Message Variables

**❌ Wrong:**

```html
<cms:set name='success_message'></cms:set>
<cms:get_flash 'success_message' />
```

**✅ Correct:**

```html
<cms:set success_message />
<cms:get_flash 'success_message' />
```

#### Pattern 2: Capture Blocks

**❌ Wrong:**

```html
<cms:set name="content"></cms:set> <cms:capture into="content"> Content here </cms:capture>
```

**✅ Correct:**

```html
<cms:set content /> <cms:capture into="content"> Content here </cms:capture>
```

#### Pattern 3: Direct Value Assignment

**✅ Correct:**

```html
<cms:set my_var="value" /> <cms:set count="<cms:show k_count />" />
```

### Step 4: Check Common Locations

Priority files to check:

1. `/snippets/layouts/base.html`
2. `/snippets/layouts/base-admin.html`
3. `/snippets/layouts/partials/headers/admin.html`
4. `/snippets/components/`
5. `/snippets/notifications/`
6. `/snippets/dashboard/`

### Step 5: Validation Pattern

For each `<cms:set>` tag, ask:

1. **Am I declaring a variable for later use?**
    - YES → Use self-closing: `<cms:set variable_name />`

2. **Am I assigning a value immediately?**
    - YES → Use with attribute: `<cms:set variable_name='value' />`

3. **Am I using capture or get_flash to populate it?**
    - YES → Use self-closing declaration first: `<cms:set variable_name />`

## Fix Examples

### Example 1: Notification Flash Messages

**Before (Error):**

```html
<cms:set name='approval_success'></cms:set>
<cms:get_flash 'approval_success' />
```

**After (Fixed):**

```html
<cms:set approval_success />
<cms:get_flash 'approval_success' />
```

### Example 2: Content Capture

**Before (Error):**

```html
<cms:set name="page_title"></cms:set>
<cms:capture into="page_title"> Dashboard - <cms:show k_user_title /> </cms:capture>
```

**After (Fixed):**

```html
<cms:set page_title /> <cms:capture into="page_title"> Dashboard - <cms:show k_user_title /> </cms:capture>
```

### Example 3: Conditional Content

**Before (Error):**

```html
<cms:set name="status_class"></cms:set>
<cms:if k_is_published="1">
    <cms:set status_class="published" />
    <cms:else />
    <cms:set status_class="draft" />
</cms:if>
```

**After (Fixed - Option 1: Declare once, set conditionally):**

```html
<cms:set status_class />
<cms:if k_is_published="1">
    <cms:set status_class="published" />
    <cms:else />
    <cms:set status_class="draft" />
</cms:if>
```

**After (Fixed - Option 2: Direct assignment):**

```html
<cms:if k_is_published="1">
    <cms:set status_class="published" />
    <cms:else />
    <cms:set status_class="draft" />
</cms:if>
```

## Automated Fix Script

```bash
#!/bin/bash
# Save as: fix-cms-set-tags.sh

# Backup files first
cp -r snippets snippets_backup_$(date +%Y%m%d_%H%M%S)

# Find and report potential issues
echo "Searching for incorrect <cms:set> usage..."
grep -rn "<cms:set name=" snippets/ || echo "No name= attributes found"
grep -rn "</cms:set>" snippets/ || echo "No closing tags found"

echo ""
echo "Review the above files and fix manually, following the patterns in this guide."
```

## Quality Checklist (standards.md Compliance)

Before committing CouchCMS code:

- [ ] All `<cms:set>` declarations use self-closing syntax
- [ ] No `name=` attribute in variable declarations
- [ ] No closing `</cms:set>` tags
- [ ] Flash messages use proper declaration pattern
- [ ] Capture blocks use proper declaration pattern
- [ ] Direct assignments use attribute syntax
- [ ] Code uses 4-space indentation (standards.md)
- [ ] All code and comments in English (standards.md)
- [ ] CouchCMS syntax validated
- [ ] Tested in development environment

## Testing Verification

After applying fixes:

1. **Clear CouchCMS Cache**: Visit `/couch/?clear_cache=1`
2. **Test Each Modified File**:
    - `/user-dashboard.php`
    - `/users/account_settings.php`
    - Any modified snippets
3. **Verify No Errors**: Check CouchCMS admin panel
4. **Browser Console**: Confirm no JavaScript errors
5. **standards.md Compliance**:
    - [ ] 4-space indentation maintained
    - [ ] English-only code
    - [ ] Proper syntax used

## Related Documentation

- **standards.md**: `/docs/standards.md` - Project coding standards
- **Memory ID**: 9720902 - CouchCMS set tag syntax rules
- **CouchCMS Patterns**: `/docs/modules/couchcms/README.md`
- **Flash Message Examples**: `/snippets/notifications/`
- **Alpine.js Compatibility**: `/docs/components/alpine-couchcms-compatibility.md`

## Quick Reference

**REMEMBER: `<cms:set>` is ALWAYS self-closing. NEVER use `</cms:set>`**

```html
<!-- ✅ Variable declaration (for flash, capture, etc) -->
<cms:set variable_name />

<!-- ✅ Direct value assignment -->
<cms:set variable_name='value' />

<!-- ✅ With nested tag in attribute -->
<cms:set variable_name="<cms:show some_value />" />

<!-- ✅ Conditional nested in attribute -->
<cms:set status="<cms:if k_is_published='1'>published<cms:else />draft</cms:if>" />

<!-- ✅ With capture -->
<cms:set variable_name />
<cms:capture into='variable_name'>Content</cms:capture>

<!-- ✅ With flash -->
<cms:set variable_name />
<cms:get_flash 'variable_name' />

<!-- ❌ NEVER do this -->
<cms:set variable_name></cms:set>
<cms:set variable_name>content</cms:set>
<cms:set name='variable_name'></cms:set>
```

## Final Notes

**CRITICAL RULES:**

1. **`<cms:set>` is ALWAYS self-closing** - NEVER use `</cms:set>`
2. **There is NO paired tag syntax** - Any `<cms:set>...</cms:set>` will error
3. **For complex logic**, use nested tags in the attribute or separate set statements
4. **Check layout files first** - errors often hide in base templates (base.html, base-admin.html)
5. **Follow standards.md** - 4-space indentation, English-only code

**Common Mistake:**

```html
<!-- ❌ This does NOT work -->
<cms:set my_var>
    <cms:if condition>value1<cms:else />value2</cms:if>
</cms:set>

<!-- ✅ Use this instead -->
<cms:set my_var="<cms:if condition>value1<cms:else />value2</cms:if>" />
```
