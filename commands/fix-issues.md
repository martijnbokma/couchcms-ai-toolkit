# Fix Issues

Automatically fix common issues in selected files.

## Fixable Issues

### Critical (Auto-fix)
- CouchCMS tags in HTML comments → Replace with `[cms:`
- `<cms:else></cms:else>` → `<cms:else />`
- Missing self-closing tags

### Security (Auto-fix with confirmation)
- `innerHTML` with user input → Use `textContent` or sanitize
- Missing CSRF protection → Add `<cms:form>` wrapper
- Missing authentication → Add authentication filter

### Code Quality (Auto-fix)
- Hardcoded colors → Replace with daisyUI semantic colors
- Alpine.js shorthand → Full syntax (`@click` → `x-on:click`)
- TypeScript `any` → Suggest proper type
- Missing indentation → Fix to 4 spaces

### Styling (Auto-fix)
- `bg-white` → `bg-base-100`
- `text-black` → `text-base-content`
- Missing responsive modifiers → Add `sm:`, `md:`, `lg:`

## Process

1. **Scan** - Identify all fixable issues
2. **Categorize** - Group by priority
3. **Confirm** - Ask for approval on critical changes
4. **Fix** - Apply fixes automatically
5. **Report** - Show summary of changes

## Output

```
Fixed 5 issues:
✅ Line 23: Replaced <cms: tag in comment
✅ Line 45: Fixed self-closing tag
✅ Line 67: Replaced bg-white with bg-base-100
⚠️  Line 89: Added authentication (needs review)
✅ Line 112: Fixed Alpine.js syntax
```
