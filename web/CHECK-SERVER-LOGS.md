# Check Server Logs for Error Details

**Date**: 2025-01-27
**Issue**: 500 error when navigating from Presets to Frontend step

---

## 🔍 How to Find the Exact Error

### Step 1: Check Server Terminal
1. Look at the terminal where `bun run web:dev` is running
2. Find the error message that starts with:
   - `[Presets POST] Error:`
   - `[renderExtendedFrontendStep] Error:`
   - `[wrapStepWithProgress] Error rendering step template:`

### Step 2: Look for Stack Trace
The error should show:
- Error name (e.g., `TypeError`, `ReferenceError`)
- Error message
- Full stack trace

### Step 3: Common Error Types

#### Template Rendering Error
```
[wrapStepWithProgress] Error rendering step template: ...
Template: steps/frontend.html
```

#### Missing Import/Function
```
ReferenceError: ... is not defined
```

#### Data Structure Error
```
TypeError: Cannot read property 'css' of undefined
```

---

## 📋 What to Share

Please share:
1. **Error Name** (e.g., `TypeError`, `ReferenceError`)
2. **Error Message** (the exact message)
3. **Stack Trace** (the full trace)
4. **Any logs** starting with `[Presets POST]` or `[renderExtendedFrontendStep]`

---

## 🔧 Quick Test

Try submitting the form again and immediately check the server terminal for the error.
