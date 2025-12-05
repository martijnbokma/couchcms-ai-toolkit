# ⚠️ IMPORTANT: Restart Server After Fix

**Date**: 2025-01-27

## 🔄 Server Restart Required

The fix for the 500 error requires a **server restart** because:

1. **Nunjucks Environment Changes**: The custom `inArray` filter is added to the Nunjucks environment when the server starts
2. **Template Changes**: The template syntax has been updated to use the new filter

## 📋 Steps to Fix

### 1. Stop Current Server
```bash
# In the terminal where server is running, press:
Ctrl+C
```

### 2. Restart Server
```bash
cd web
bun run dev
```

### 3. Test Navigation
- Go to Presets step
- Click "Next: Frontend Frameworks"
- Should now work without 500 error

---

## ✅ What Was Fixed

1. **Added `inArray` filter** to Nunjucks environment in `server.js`
2. **Updated template** to use `option.id|inArray(selected)` instead of `option.id in selected`
3. **Simplified logic** to prioritize `option.selected` property (already set by `createFrontendOptions`)

---

**Status**: ✅ Fix Applied - **Restart Server Required**
