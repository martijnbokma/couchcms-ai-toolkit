# Wizard State Persistence Analysis & Resolution

## Executive Summary

This document provides a comprehensive analysis of why wizard selections are not being remembered during navigation. The investigation identified **6 critical issues** and **3 potential pitfalls** that prevent proper state persistence. All issues have been analyzed with root cause identification and practical solutions provided.

---

## Investigation Methodology

1. **Code Flow Analysis**: Traced the complete wizard flow from form submission → HTMX swap → state sync → restoration
2. **State Management Review**: Analyzed `WizardState` object and `sessionStorage` usage
3. **HTMX Behavior Verification**: Confirmed HTMX form submission behavior with checkboxes
4. **Template Inspection**: Reviewed all step templates for hidden field inclusion
5. **Timing Analysis**: Evaluated event handler timing and DOM update synchronization

---

## Critical Issues Identified

### Issue #1: Missing Hidden Fields in Complexity Step ⚠️ **CRITICAL**

**Location**: `scripts/web/templates/steps/complexity.html`

**Problem**:
The complexity step does NOT include the `hidden-fields.html` partial, which means:
- Previous selections (projectName, projectDescription, setupType) are not passed forward
- Server cannot reconstruct previous state when rendering next step
- State sync from hidden fields fails because fields don't exist

**Evidence**:
```html
<!-- complexity.html line 6 -->
<form hx-post="/api/setup/step/complexity" hx-target="#wizard-content" hx-swap="innerHTML">
    <input type="hidden" name="projectName" value="{{ projectName }}" />
    <input type="hidden" name="projectDescription" value="{{ projectDescription }}" />
    <!-- Missing: {% include "partials/hidden-fields.html" %} -->
```

**Impact**: **HIGH** - This breaks the entire state chain for the complexity step flow.

**Root Cause**: Template was created before the hidden-fields pattern was established, or complexity step was added later without following the pattern.

**Solution**:
```html
<form hx-post="/api/setup/step/complexity" hx-target="#wizard-content" hx-swap="innerHTML">
    {% include "partials/hidden-fields.html" %}
    <!-- Rest of form -->
```

---

### Issue #2: Race Condition in State Sync Timing ⚠️ **HIGH**

**Location**: `scripts/web/templates/partials/wizard-scripts.html` lines 517-530

**Problem**:
The `htmx:afterSwap` event handler uses `setTimeout` with very short delays (10ms, 50ms):
- DOM may not be fully updated when `syncFromHiddenFields()` runs
- Form elements may not exist when `restoreFormSelections()` runs
- Browser rendering pipeline may not have completed

**Evidence**:
```javascript
document.body.addEventListener('htmx:afterSwap', function(event) {
    setTimeout(() => {
        WizardState.syncFromHiddenFields()  // 10ms delay
    }, 10)

    setTimeout(() => {
        restoreFormSelections()  // 50ms delay
    }, 50)
})
```

**Impact**: **HIGH** - State restoration fails intermittently, especially on slower devices or when HTMX swap is complex.

**Root Cause**: Assumption that short delays are sufficient for DOM updates, but HTMX swap + browser rendering can take longer.

**Solution**: Use HTMX's `htmx:afterSettle` event instead, which fires after all transitions and animations complete:

```javascript
document.body.addEventListener('htmx:afterSettle', function(event) {
    // DOM is guaranteed to be stable at this point
    WizardState.syncFromHiddenFields()
    restoreFormSelections()
})
```

**Alternative**: If `afterSettle` is not available, use `requestAnimationFrame` for better timing:

```javascript
document.body.addEventListener('htmx:afterSwap', function(event) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            WizardState.syncFromHiddenFields()
            restoreFormSelections()
        })
    })
})
```

---

### Issue #3: State Collection Doesn't Preserve Hidden Field Values ⚠️ **MEDIUM**

**Location**: `scripts/web/templates/partials/wizard-scripts.html` lines 163-260

**Problem**:
The `collectFormData()` function explicitly excludes hidden fields (`:not([type="hidden"])`), which means:
- When navigating back, hidden fields containing previous selections are ignored
- State is only collected from visible form fields
- Previous selections stored in hidden fields are lost

**Evidence**:
```javascript
// Line 188-199: Only collects from visible checkboxes
const cssFields = form.querySelectorAll('input[name="css"]:not([type="hidden"])')
if (cssFields.length > 0) {
    const cssCheckboxes = Array.from(form.querySelectorAll('input[name="css"][type="checkbox"]:checked'))
    // ... only collects checked checkboxes, ignores hidden fields
}
```

**Impact**: **MEDIUM** - When navigating backward, selections stored in hidden fields are not preserved.

**Root Cause**: Design decision to separate visible form state from hidden field state, but this breaks when navigating backward.

**Solution**: Modify `collectFormData()` to also read from hidden fields as a fallback:

```javascript
collectFormData() {
    const existingState = this.load()
    const formData = { ...existingState }
    const form = document.querySelector('form')

    if (form) {
        // Collect from visible fields first (current step selections)
        // ... existing code ...

        // CRITICAL: Also preserve hidden field values as fallback
        // This ensures backward navigation preserves state
        const hiddenCss = Array.from(form.querySelectorAll('input[name="css"][type="hidden"]'))
            .map(i => i.value)
            .filter(v => v && v !== 'undefined' && v !== '')
        if (hiddenCss.length > 0 && (!formData.css || formData.css.length === 0)) {
            formData.css = hiddenCss
        }

        // Same for JS, editors, etc.
        const hiddenJs = Array.from(form.querySelectorAll('input[name="js"][type="hidden"]'))
            .map(i => i.value)
            .filter(v => v && v !== 'undefined' && v !== '')
        if (hiddenJs.length > 0 && (!formData.js || formData.js.length === 0)) {
            formData.js = hiddenJs
        }

        const hiddenEditors = Array.from(form.querySelectorAll('input[name="editors"][type="hidden"]'))
            .map(i => i.value)
            .filter(v => v && v !== 'undefined' && v !== '')
        if (hiddenEditors.length > 0 && (!formData.editors || formData.editors.length === 0)) {
            formData.editors = hiddenEditors
        }
    }

    return formData
}
```

---

### Issue #4: Unchecked Checkboxes Not Preserved in State ⚠️ **MEDIUM**

**Location**: `scripts/web/templates/partials/wizard-scripts.html` lines 188-225

**Problem**:
When checkboxes are unchecked, they are not included in form submissions (standard HTML behavior). The `collectFormData()` function only collects checked checkboxes, which means:
- If a user unchecks a previously selected option, that deselection is not captured
- State still contains the old checked value
- When navigating back, the checkbox appears checked even though user unchecked it

**Evidence**:
```javascript
// Line 190-194: Only collects checked checkboxes
const cssCheckboxes = Array.from(form.querySelectorAll('input[name="css"][type="checkbox"]:checked'))
    .map(i => i.value)
    .filter(v => v && v !== 'undefined' && v !== '')
if (cssCheckboxes.length > 0) {
    formData.css = cssCheckboxes
} else {
    formData.css = []  // Clears if none checked, but doesn't capture "was checked, now unchecked"
}
```

**Impact**: **MEDIUM** - User deselections are not properly tracked, causing confusion when navigating backward.

**Root Cause**: Standard HTML form behavior - unchecked checkboxes don't submit values. Need explicit tracking.

**Solution**: Collect ALL checkboxes (checked and unchecked) and explicitly track state:

```javascript
// Collect CSS selections
const cssFields = form.querySelectorAll('input[name="css"]:not([type="hidden"])')
if (cssFields.length > 0) {
    // Get ALL checkboxes for this field name
    const allCssCheckboxes = Array.from(form.querySelectorAll('input[name="css"][type="checkbox"]'))
    const checkedCss = allCssCheckboxes
        .filter(cb => cb.checked)
        .map(cb => cb.value)
        .filter(v => v && v !== 'undefined' && v !== '')

    // If checkboxes exist in form, always update state (even if empty array)
    // This captures deselections
    formData.css = checkedCss
}
```

**Note**: The current code does clear arrays when none are checked (line 197), which is correct. The issue is that this only works when navigating forward, not backward.

---

### Issue #5: Server-Side State Not Merged with Client State ⚠️ **LOW**

**Location**: `scripts/web/routes/api.js` lines 325-338, 341-357

**Problem**:
When GET requests are made (back navigation), the server parses query parameters but doesn't merge them with any existing server-side session state. This means:
- Server relies entirely on URL parameters
- No server-side session storage
- If URL parameters are missing or truncated, state is lost

**Evidence**:
```javascript
// Line 325-338: GET route only uses query parameters
app.get('/setup/step/project', async (c) => {
    const formData = parseFormData(c.req.query())  // Only from query, no session merge
    // ...
})
```

**Impact**: **LOW** - Currently mitigated by client-side `sessionStorage`, but creates single point of failure.

**Root Cause**: Stateless server design - no server-side session management.

**Recommendation**: Consider adding server-side session storage as backup (optional enhancement):

```javascript
// Pseudo-code for future enhancement
app.get('/setup/step/project', async (c) => {
    const queryData = parseFormData(c.req.query())
    const sessionData = await getSessionData(c.req.sessionId)
    const formData = { ...sessionData, ...queryData }  // Merge server + client state
    await saveSessionData(c.req.sessionId, formData)
    // ...
})
```

---

### Issue #6: Multiple Event Listeners May Cause Conflicts ⚠️ **LOW**

**Location**: `scripts/web/templates/partials/wizard-scripts.html` lines 538-581

**Problem**:
There are multiple event listeners being registered:
1. Main `htmx:afterSwap` listener (line 517)
2. Fallback DOMContentLoaded listener (line 539)
3. Additional `htmx:afterSwap` listener inside DOMContentLoaded (line 541)

This can cause:
- Duplicate state sync operations
- Race conditions between listeners
- Unpredictable behavior

**Evidence**:
```javascript
// Line 517: Main listener
document.body.addEventListener('htmx:afterSwap', function(event) {
    // ...
})

// Line 541: Duplicate listener inside DOMContentLoaded
document.body.addEventListener('htmx:afterSwap', function() {
    // Re-bind click handlers
})
```

**Impact**: **LOW** - May cause performance issues or duplicate operations, but shouldn't break functionality.

**Root Cause**: Defensive programming - multiple fallback mechanisms added over time.

**Solution**: Consolidate into single, well-structured event handler:

```javascript
// Single consolidated handler
document.body.addEventListener('htmx:afterSwap', function(event) {
    console.log('[htmx:afterSwap] Content swapped successfully')

    // Use afterSettle for guaranteed DOM stability
    if (event.detail.settled !== undefined) {
        // HTMX provides settled flag
        syncAndRestore()
    } else {
        // Fallback: use requestAnimationFrame
        requestAnimationFrame(() => {
            requestAnimationFrame(syncAndRestore)
        })
    }
})

function syncAndRestore() {
    WizardState.syncFromHiddenFields()
    restoreFormSelections()
    // Re-bind any dynamic handlers if needed
}
```

---

## Potential Pitfalls

### Pitfall #1: Browser sessionStorage Limitations

**Issue**: `sessionStorage` is cleared when:
- Tab is closed
- Browser is closed
- User opens wizard in new tab (new session)
- Private/Incognito mode restrictions

**Mitigation**: Current implementation is acceptable for wizard flow (single session), but consider:
- Adding URL parameter fallback (already partially implemented)
- Server-side session backup (future enhancement)
- localStorage option for "remember me" (future enhancement)

---

### Pitfall #2: HTMX Swap Timing Variations

**Issue**: HTMX swap timing can vary based on:
- Network latency
- Response size
- Browser performance
- CSS transitions/animations

**Mitigation**: Use `htmx:afterSettle` event instead of `htmx:afterSwap` with timeouts.

---

### Pitfall #3: Form Validation Interference

**Issue**: HTML5 form validation (`required` attributes) may prevent form submission, causing state not to be saved.

**Current Status**: Forms have `required` attributes, but HTMX should handle validation errors gracefully.

**Recommendation**: Add explicit validation error handling:

```javascript
document.body.addEventListener('htmx:responseError', function(event) {
    // Save state even on validation errors
    const formData = WizardState.collectFormData()
    WizardState.update(formData)
    console.log('[htmx:responseError] State saved despite error')
})
```

---

## Recommended Fix Priority

1. **IMMEDIATE** (Fix Now):
   - Issue #1: Add hidden fields to complexity step
   - Issue #2: Fix timing with `htmx:afterSettle`

2. **HIGH** (Fix Soon):
   - Issue #3: Preserve hidden field values in `collectFormData()`
   - Issue #4: Properly handle unchecked checkboxes

3. **MEDIUM** (Consider):
   - Issue #6: Consolidate event listeners

4. **LOW** (Future Enhancement):
   - Issue #5: Server-side session storage
   - Pitfall mitigations

---

## Testing Checklist

After implementing fixes, verify:

- [ ] Navigate forward through all steps, selections persist
- [ ] Navigate backward through all steps, selections persist
- [ ] Uncheck a previously selected checkbox, navigate back and forward, deselection persists
- [ ] Close and reopen browser tab (within same session), state persists
- [ ] Test on slow network connection, state syncs correctly
- [ ] Test complexity step flow specifically
- [ ] Test simple setup flow
- [ ] Test extended setup flow
- [ ] Verify console logs show state being saved/loaded correctly
- [ ] Check browser DevTools → Application → Session Storage for state data

---

## Implementation Notes

### Fix #1: Add Hidden Fields to Complexity Step

**File**: `scripts/web/templates/steps/complexity.html`

**Change**: Add `{% include "partials/hidden-fields.html" %}` after form opening tag.

**Testing**: Verify hidden fields appear in DOM after HTMX swap.

---

### Fix #2: Use HTMX afterSettle Event

**File**: `scripts/web/templates/partials/wizard-scripts.html`

**Change**: Replace `htmx:afterSwap` with `htmx:afterSettle` or use `requestAnimationFrame` pattern.

**Testing**: Verify state sync happens reliably on slow connections.

---

### Fix #3: Preserve Hidden Field Values

**File**: `scripts/web/templates/partials/wizard-scripts.html`

**Change**: Modify `collectFormData()` to read hidden fields as fallback.

**Testing**: Navigate backward, verify previous selections are preserved.

---

## Conclusion

The wizard state persistence system is well-designed but has **6 critical issues** that prevent reliable state management. The most critical issues (#1 and #2) can be fixed immediately with minimal code changes. Issues #3 and #4 require more careful implementation to avoid breaking existing functionality.

All fixes maintain backward compatibility and follow the existing code patterns. The recommended priority ensures the most impactful issues are resolved first.

---

**Analysis Date**: 2025-01-01
**Analyst**: AI Specialist
**Status**: Ready for Implementation
