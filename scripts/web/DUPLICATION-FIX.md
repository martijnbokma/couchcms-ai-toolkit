# Input Duplication Fix

## Problem

When navigating back to the Project Information step, input fields showed duplicated values separated by commas:
- Project Name: `my-project,my-project,my-project,my-project-test`
- Project Description: `A CouchCMS web application,A CouchCMS web application,A CouchCMS web application,A CouchCMS web application`

## Root Cause

When multiple hidden form fields have the same name (e.g., multiple `projectName` hidden fields), Hono's `parseBody({ all: true })` converts them into arrays. When these arrays are rendered in Nunjucks templates, they are automatically converted to comma-separated strings.

**Example Flow:**
1. User enters "my-project" in Project Name
2. Form submits, creates hidden field: `<input name="projectName" value="my-project" />`
3. User navigates forward, then back
4. Server receives query params with `projectName=my-project`
5. Server creates hidden fields again: `<input name="projectName" value="my-project" />`
6. Now there are TWO hidden fields with same name
7. On next submission, `parseBody({ all: true })` creates array: `['my-project', 'my-project']`
8. Template renders array as string: `'my-project,my-project'`
9. Process repeats, creating more duplicates

## Solution

Normalize `projectName`, `projectDescription`, and `setupType` to always be strings, even when they come in as arrays from multiple hidden fields.

### Server-Side Fix

**File**: `scripts/web/routes/api.js`

Added `normalizeStringValue()` function that:
- Takes first value from arrays
- Handles comma-separated duplicates (takes first part)
- Ensures consistent string output

```javascript
function normalizeStringValue(value, defaultValue) {
    if (!value) return defaultValue
    if (Array.isArray(value)) {
        const firstValue = value.find(v => v && v !== '' && v !== 'undefined' && v !== 'null')
        return firstValue || defaultValue
    }
    if (typeof value === 'string') {
        // Handle comma-separated duplicates
        if (value.includes(',') && value.split(',').every(part => part.trim() === value.split(',')[0].trim())) {
            return value.split(',')[0].trim()
        }
        return value
    }
    return defaultValue
}
```

### Client-Side Fixes

**File**: `scripts/web/templates/partials/wizard-scripts.html`

1. **`syncFromHiddenFields()`**: Now handles multiple hidden fields and normalizes to single string
2. **`collectFormData()`**: Normalizes project values before saving to state
3. **`restoreFormSelections()`**: Normalizes values before restoring to form inputs

All three functions now:
- Check for multiple hidden fields with same name
- Take first non-empty value
- Normalize comma-separated duplicates
- Ensure string output (never arrays)

## Testing

After fix, verify:
- [ ] Enter project name, navigate forward/backward - no duplication
- [ ] Enter project description, navigate forward/backward - no duplication
- [ ] Navigate multiple times back and forth - values remain single, not duplicated
- [ ] Check browser console - no arrays in state, only strings
- [ ] Check Session Storage - values are strings, not arrays

## Prevention

To prevent future duplication issues:
1. Always normalize string values that might come from multiple form fields
2. Use `normalizeStringValue()` or similar function for single-value fields
3. Only use arrays for fields that are intentionally multi-select (like `css[]`, `js[]`, `editors[]`)
4. Never render arrays directly in templates for single-value fields

---

**Fix Date**: 2025-01-01
**Status**: ✅ **COMPLETED**
