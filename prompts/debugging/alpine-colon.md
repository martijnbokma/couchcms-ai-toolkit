# Debug Alpine.js Colon Syntax Error in CouchCMS

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Role

Expert CouchCMS and Alpine.js developer specializing in template compatibility and syntax debugging.

## Objective

Identify and fix all Alpine.js shorthand colon syntax (`:attribute`) that causes CouchCMS parsing errors, replacing with full `x-bind:` syntax.

## Error Message

```
ERROR! ATTRIB_NAME: Invalid char ":" (line: X char: Y)
```

**Root Cause**: CouchCMS parser cannot handle Alpine.js shorthand colon syntax like `:class`, `:type`, `:disabled`, etc.

---

## Critical Rule

**NEVER use Alpine.js shorthand colon syntax in CouchCMS templates.**

CouchCMS has VERY strict HTML parsing that treats `:` as invalid in attribute names.

### ❌ NEVER Use (Causes Error)

```html
<!-- ALL of these will cause the error -->
<input :type="inputType" />
<div :class="activeClass" />
<button :disabled="isDisabled" />
<div :style="customStyle" />
<a :href="dynamicUrl" />
<img :src="imagePath" />
```

### ✅ ALWAYS Use Instead

```html
<!-- Full x-bind: syntax works perfectly -->
<input x-bind:type="inputType" />
<div x-bind:class="activeClass" />
<button x-bind:disabled="isDisabled" />
<div x-bind:style="customStyle" />
<a x-bind:href="dynamicUrl" />
<img x-bind:src="imagePath" />
```

### ✅ These Work Fine

```html
<!-- @ shorthand and x- directives are fine -->
<button @click="handleClick()">Click</button>
<div x-show="isVisible" x-transition>Content</div>
<input x-model="searchQuery" @input="search()" />
<div x-data="{ count: 0 }">{{ count }}</div>
```

---

## Debugging Steps

### Step 1: Locate the Error

Error shows line and character position:

- **Line number**: Where the colon syntax appears
- **Char position**: Approximate location in file

**Common locations to check:**

1. `/snippets/layouts/base.html`
2. `/snippets/layouts/base-admin.html`
3. `/snippets/layouts/partials/headers/`
4. `/snippets/layouts/partials/sidebar-admin.html`
5. `/snippets/components/` (all components)
6. Template files using Alpine.js

### Step 2: Search for Colon Syntax

```bash
# Find all shorthand colon syntax
grep -rn ':\(class\|type\|disabled\|style\|href\|src\|value\)=' snippets/ --include="*.html"

# Or search for any attribute starting with colon
grep -rn ' :[a-z]' snippets/ --include="*.html"
```

### Step 3: Common Patterns to Fix

#### Pattern 1: Dynamic Classes

```html
<!-- ❌ WRONG -->
<div :class="isActive ? 'bg-primary' : 'bg-base-100'">
    <!-- ✅ CORRECT -->
    <div x-bind:class="isActive ? 'bg-primary' : 'bg-base-100'"></div>
</div>
```

#### Pattern 2: Conditional Attributes

```html
<!-- ❌ WRONG -->
<input :type="showPassword ? 'text' : 'password'" />
<button :disabled="!isValid">Submit</button>

<!-- ✅ CORRECT -->
<input x-bind:type="showPassword ? 'text' : 'password'" />
<button x-bind:disabled="!isValid">Submit</button>
```

#### Pattern 3: Dynamic Styles

```html
<!-- ❌ WRONG -->
<div :style="'width: ' + progress + '%'">
    <!-- ✅ CORRECT -->
    <div x-bind:style="'width: ' + progress + '%'"></div>
</div>
```

#### Pattern 4: Dynamic URLs

```html
<!-- ❌ WRONG -->
<a :href="'/page/' + slug">Link</a>
<img :src="thumbnailUrl" />

<!-- ✅ CORRECT -->
<a x-bind:href="'/page/' + slug">Link</a>
<img x-bind:src="thumbnailUrl" />
```

---

## Fix Examples

### Example 1: Form Input Type Toggle

**Before (Error):**

```html
<input :type="showPassword ? 'text' : 'password'" x-model="password" class="input" />
```

**After (Fixed):**

```html
<input x-bind:type="showPassword ? 'text' : 'password'" x-model="password" class="input" />
```

### Example 2: Conditional Button State

**Before (Error):**

```html
<button
    @click="submit()"
    :disabled="!formValid || isSubmitting"
    :class="isSubmitting ? 'loading' : ''"
    class="btn btn-primary"
>
    Submit
</button>
```

**After (Fixed):**

```html
<button
    @click="submit()"
    x-bind:disabled="!formValid || isSubmitting"
    x-bind:class="isSubmitting ? 'loading' : ''"
    class="btn btn-primary"
>
    Submit
</button>
```

### Example 3: Dynamic Theme Classes

**Before (Error):**

```html
<div x-data="{ theme: 'light' }" :class="theme === 'dark' ? 'bg-base-300' : 'bg-base-100'">Content</div>
```

**After (Fixed):**

```html
<div x-data="{ theme: 'light' }" x-bind:class="theme === 'dark' ? 'bg-base-300' : 'bg-base-100'">Content</div>
```

---

## Automated Fix Script

```bash
#!/bin/bash
# Save as: fix-alpine-colons.sh

echo "=== Fixing Alpine.js Colon Syntax ==="
echo ""

# Backup first
cp -r snippets snippets_backup_$(date +%Y%m%d_%H%M%S)

# Find all files with colon syntax
echo "Files with shorthand colon syntax:"
grep -rl ' :[a-z]' snippets/ --include="*.html" | grep -v ".archive"

echo ""
echo "⚠️  Review files above and replace manually:"
echo "   :class=     → x-bind:class="
echo "   :type=      → x-bind:type="
echo "   :disabled=  → x-bind:disabled="
echo "   :style=     → x-bind:style="
echo "   :href=      → x-bind:href="
echo "   :src=       → x-bind:src="
echo "   :value=     → x-bind:value="
```

---

## Quality Checklist (standards.md Compliance)

Before committing:

- [ ] No `:class`, `:type`, `:disabled`, `:style`, `:href`, `:src`, `:value` syntax
- [ ] All dynamic attributes use `x-bind:` prefix
- [ ] `@click`, `x-show`, `x-model`, `x-data` still work (no change needed)
- [ ] No backticks in HTML attributes (CouchCMS incompatible)
- [ ] No ternary operators directly in HTML (use computed properties if needed)
- [ ] Code uses 4-space indentation (standards.md)
- [ ] All code and comments in English (standards.md)
- [ ] Tested in CouchCMS environment

---

## Testing Verification

After applying fixes:

1. **Clear CouchCMS Cache**: Visit `/couch/?clear_cache=1`
2. **Test Fixed Files**: Load pages in browser
3. **Check Console**: No CouchCMS parsing errors
4. **Verify Alpine.js**: Dynamic bindings still work
5. **Browser DevTools**: No JavaScript errors

---

## Quick Reference Card

### Alpine.js Syntax Compatibility

| Syntax         | CouchCMS | Use Instead           |
| -------------- | -------- | --------------------- |
| `:class=`      | ❌ ERROR | ✅ `x-bind:class=`    |
| `:type=`       | ❌ ERROR | ✅ `x-bind:type=`     |
| `:disabled=`   | ❌ ERROR | ✅ `x-bind:disabled=` |
| `:style=`      | ❌ ERROR | ✅ `x-bind:style=`    |
| `:href=`       | ❌ ERROR | ✅ `x-bind:href=`     |
| `:src=`        | ❌ ERROR | ✅ `x-bind:src=`      |
| `:value=`      | ❌ ERROR | ✅ `x-bind:value=`    |
| `@click=`      | ✅ Works | ✅ Keep as-is         |
| `x-show=`      | ✅ Works | ✅ Keep as-is         |
| `x-model=`     | ✅ Works | ✅ Keep as-is         |
| `x-data=`      | ✅ Works | ✅ Keep as-is         |
| `x-transition` | ✅ Works | ✅ Keep as-is         |

---

## Additional CouchCMS + Alpine.js Rules

### Never Use These

```html
<!-- ❌ Backticks in attributes -->
<div :style="`width: ${val}%`">
    <!-- ❌ Ternary in HTML directly -->
    <span x-text="condition ? 'yes' : 'no'">
        <!-- ❌ Arrow functions in x-data -->
        <div x-data="{ items: arr.map(x => x.id) }"></div
    ></span>
</div>
```

### Always Use These Instead

```html
<!-- ✅ String concatenation -->
<div x-bind:style="'width: ' + val + '%'">
    <!-- ✅ Computed property in function -->
    <script>
        function myData() {
            return {
                get displayText() {
                    return this.condition ? 'yes' : 'no'
                },
            }
        }
    </script>
    <div x-data="myData()">
        <span x-text="displayText"></span>
    </div>

    <!-- ✅ Regular function syntax -->
    <div x-data="{ items: arr.map(function(x) { return x.id; }) }"></div>
</div>
```

---

## Related Documentation

- **standards.md**: `/docs/standards.md` - Alpine.js + CouchCMS compatibility rules
- **Memory ID**: 9721108 - Alpine.js CouchCMS compatibility documentation
- **Compatibility Guide**: `/docs/components/alpine-couchcms-compatibility.md`
- **CouchCMS Patterns**: `/docs/modules/couchcms/README.md`

---

## Final Notes

**Critical Rules Summary:**

1. **NEVER use `:attribute` syntax** - Always use `x-bind:attribute`
2. **@ shorthand works fine** - Keep `@click`, `@input`, etc.
3. **x- directives work fine** - Keep `x-show`, `x-model`, `x-data`, etc.
4. **No backticks in attributes** - Use string concatenation
5. **No ternary in HTML** - Use computed properties in functions
6. **Check layout files first** - Errors often in base templates

**Common Mistake:**

```html
<!-- ❌ This causes: ERROR! ATTRIB_NAME: Invalid char ":" -->
<button :disabled="loading">Save</button>

<!-- ✅ This works perfectly -->
<button x-bind:disabled="loading">Save</button>
```

**Remember**: CouchCMS parser is strict about HTML syntax. Alpine.js shorthand is convenient but incompatible. Always use the full `x-bind:` prefix.

---

**Generated**: January 9, 2025
**Project**: matters-student-hub (CouchCMS + Alpine.js webapp)
**Framework**: standards.md-compliant development
