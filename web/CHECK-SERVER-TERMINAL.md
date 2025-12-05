# 🔍 Check Server Terminal for Exact Error

**Date**: 2025-01-27

## ⚠️ Critical: Server Terminal Logs Required

The browser shows a 500 error, but we need the **server terminal logs** to see the exact error message.

## 📋 Steps

### 1. Find Server Terminal
Look for the terminal window where you ran:
```bash
bun run web:dev
```

### 2. Look for Error Messages
After submitting the form, look for these error messages in the server terminal:

```
[Presets POST] Error: ...
[renderExtendedFrontendStep] Error: ...
[wrapStepWithProgress] Error rendering step template: ...
[renderTemplate] Error rendering template: ...
```

### 3. Copy the Full Error
Copy the **complete error message** including:
- Error name (TypeError, ReferenceError, etc.)
- Error message
- Full stack trace

### 4. Share the Error
Paste the complete error from the server terminal here.

---

## 🔧 Quick Test

1. **Submit the form** (Presets → Frontend)
2. **Immediately check** the server terminal
3. **Copy the error** that appears
4. **Share it here**

---

## 💡 What We're Looking For

Common errors might be:
- `Template not found: steps/frontend.html`
- `Cannot read property 'css' of undefined`
- `Filter 'inArray' is not defined`
- `Syntax error in template`

The server terminal will show the exact error!
