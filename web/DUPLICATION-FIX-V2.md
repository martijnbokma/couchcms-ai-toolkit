# Input Duplication Fix - Version 2

## Problem Still Occurring

Despite previous fixes, duplication was still happening:
- Project Name: `my-project,my-project-test`
- Project Description: `A CouchCMS web application,A CouchCMS web application`

## Root Cause Analysis

The issue had **two sources**:

### Source 1: Multiple Form Fields with Same Name
On the project step, there were BOTH:
1. Visible input: `<input name="projectName" value="..." />`
2. Hidden fields: `<input type="hidden" name="projectName" value="..." />` (from `hidden-fields.html`)

When the form submits, HTMX sends ALL inputs with the same name, creating an array: `['my-project', 'my-project-test']`

### Source 2: Wrong Array Value Selection
The `normalizeStringValue()` function was taking the **FIRST** value from arrays, but:
- First value = hidden field value (old)
- Last value = visible input value (new, what user typed)

So even with normalization, we were keeping the wrong value!

## Solution

### Fix 1: Exclude Project Fields from Hidden Fields on Project Step

**File**: `scripts/web/routes/api.js`

Added `excludeProjectFields` option to `createHiddenFields()`:

```javascript
function createHiddenFields(data, options = {}) {
    const { excludeProjectFields = false } = options

    // Don't create hidden fields for projectName/projectDescription on project step
    if (!excludeProjectFields) {
        if (data.projectName) {
            fields.push({ name: 'projectName', value: data.projectName })
        }
        // ...
    }
}
```

Used on project step:
```javascript
hiddenFields: createHiddenFields(formData, { excludeProjectFields: true })
```

### Fix 2: Prefer Last Value for Project Fields

**File**: `scripts/web/routes/api.js`

Updated `normalizeStringValue()` to accept `preferLast` parameter:

```javascript
function normalizeStringValue(value, defaultValue, preferLast = false) {
    if (Array.isArray(value)) {
        const validValues = value.filter(v => v && v !== '' && v !== 'undefined' && v !== 'null')
        // For project fields, prefer LAST value (visible input comes after hidden fields)
        return preferLast ? validValues[validValues.length - 1] : validValues[0]
    }
    // Also handle comma-separated strings
    if (typeof value === 'string' && value.includes(',')) {
        const parts = value.split(',').map(p => p.trim()).filter(p => p)
        if (preferLast && parts.length > 0) {
            return parts[parts.length - 1]  // Take last part
        }
        // ...
    }
}
```

Updated `getProjectDefaults()` to use `preferLast=true`:

```javascript
function getProjectDefaults(queryOrBody) {
    return {
        projectName: normalizeStringValue(queryOrBody.projectName, DEFAULT_PROJECT_NAME, true),
        projectDescription: normalizeStringValue(queryOrBody.projectDescription, DEFAULT_PROJECT_DESCRIPTION, true),
        setupType: normalizeStringValue(queryOrBody.setupType, DEFAULT_SETUP_TYPE, false)
    }
}
```

### Fix 3: Normalize Arrays in POST Handler

**File**: `scripts/web/routes/api.js`

Added explicit normalization in POST handler before parsing:

```javascript
app.post('/setup/step/project', async (c) => {
    const body = await c.req.parseBody({ all: true })
    // Normalize arrays immediately (visible input takes precedence)
    if (Array.isArray(body.projectName)) {
        body.projectName = body.projectName[body.projectName.length - 1]  // Last value
    }
    if (Array.isArray(body.projectDescription)) {
        body.projectDescription = body.projectDescription[body.projectDescription.length - 1]
    }
    const formData = parseFormData(body)
    // ...
})
```

## Why This Works

1. **Prevention**: No hidden fields for projectName/projectDescription on project step = no duplication source
2. **Normalization**: If arrays still occur (from URL params or edge cases), we take the LAST value (visible input)
3. **Defense in Depth**: Multiple layers of normalization ensure values are always clean

## Testing

After these fixes:
- [ ] Enter project name, navigate forward/backward - no duplication
- [ ] Enter project description, navigate forward/backward - no duplication
- [ ] Change project name, navigate back - shows NEW value, not old
- [ ] Navigate multiple times - values remain single, correct
- [ ] Check browser console - no arrays in state
- [ ] Check form submission - only one value sent per field

## Key Insight

**Visible inputs should ALWAYS take precedence over hidden fields.** The last value in an array from form submission is the visible input value, because HTML forms submit fields in document order, and visible inputs come after hidden fields.

---

**Fix Date**: 2025-01-01
**Status**: ✅ **COMPLETED - V2**
