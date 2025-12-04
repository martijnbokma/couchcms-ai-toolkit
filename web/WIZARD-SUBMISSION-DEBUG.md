# Wizard Submission Debugging Guide

## Probleem

Form submission faalt met error: "An error occurred while submitting the form. Please check your internet connection."

Dit is een `htmx:sendError` event, wat betekent dat HTMX de request niet kan versturen.

## Oplossingen Geïmplementeerd

### 1. Verbeterde Error Handling

- ✅ Try-catch rond alle submit handlers
- ✅ Errors blokkeren submission niet meer
- ✅ Passive event listeners (geen preventDefault)
- ✅ Betere error logging

### 2. Uitgebreide Logging

Alle HTMX events worden nu gelogd:
- `htmx:beforeRequest` - Wordt request gestart?
- `htmx:send` - Wordt request verstuurd?
- `htmx:afterRequest` - Wat is de response?
- `htmx:sendError` - Wat is de exacte error?

### 3. Fallback Handlers

- ✅ HTMX beforeRequest handler als backup
- ✅ State wordt opgeslagen via meerdere routes
- ✅ Errors worden gelogd maar blokkeren niet

## Debugging Stappen

### Stap 1: Open Browser Console

Open de browser console (F12) en kijk naar de logs wanneer je op "Next: Review" klikt.

### Stap 2: Check HTMX Events

Je zou moeten zien:
1. `[HTMX] Before request:` - Logt form details
2. `[WizardInit] HTMX request starting` - Logt form state save
3. `[HTMX] Sending request:` - Logt wanneer request wordt verstuurd
4. `[HTMX] After request:` - Logt response

Als je `[HTMX] Send error` ziet, check de error details.

### Stap 3: Check Form Element

```javascript
// In browser console
const form = document.querySelector('form')
console.log({
    action: form.getAttribute('hx-post'),
    target: form.getAttribute('hx-target'),
    method: form.method,
    valid: form.checkValidity(),
    htmxLoaded: typeof htmx !== 'undefined'
})
```

### Stap 4: Test HTMX Direct

```javascript
// In browser console - test HTMX request
const form = document.querySelector('form')
const formData = new FormData(form)

htmx.ajax('POST', form.getAttribute('hx-post'), {
    target: form.getAttribute('hx-target'),
    swap: 'innerHTML',
    values: formData
}).then(() => {
    console.log('HTMX request succeeded')
}).catch(error => {
    console.error('HTMX request failed:', error)
})
```

### Stap 5: Check Network Tab

1. Open Network tab in browser DevTools
2. Klik op "Next: Review"
3. Kijk of er een request naar `/api/setup/step/editors` wordt verstuurd
4. Check de request details:
   - Status code
   - Request headers
   - Request payload
   - Response

## Veelvoorkomende Problemen

### Probleem 1: HTMX Not Loaded

**Symptoom**: `htmx is not defined` error

**Oplossing**: Check of HTMX script is geladen in `base.html`

### Probleem 2: Form Validation Fails

**Symptoom**: Request wordt niet verstuurd, geen error

**Oplossing**:
```javascript
const form = document.querySelector('form')
form.reportValidity() // Shows validation errors
```

### Probleem 3: JavaScript Error Blocks Submission

**Symptoom**: Error in console, request wordt niet verstuurd

**Oplossing**: Check console voor errors, alle errors zijn nu gelogd

### Probleem 4: CORS Error

**Symptoom**: CORS error in console

**Oplossing**: Check server CORS configuratie

### Probleem 5: Network Error

**Symptoom**: Echte network error

**Oplossing**: Check server is running, check network connection

## Test Commands

### Test Form Submission Manueel

```javascript
// In browser console
const form = document.querySelector('form')
const formData = new FormData(form)

// Test native form submission
form.submit()
```

### Test HTMX Request

```javascript
// In browser console
htmx.ajax('POST', '/api/setup/step/editors', {
    target: '#wizard-content',
    swap: 'innerHTML',
    values: {
        setupType: 'simple',
        editors: ['claude']
    }
})
```

### Check State

```javascript
// In browser console
const state = window.wizardStateManager?.load()
console.log('Current state:', state)
console.log('Current step:', state?.currentStep)
console.log('Setup type:', state?.setupType)
```

## Wat Te Controleren

1. ✅ **Console Logs**: Zie je `[HTMX] Before request`?
2. ✅ **HTMX Loaded**: Is `typeof htmx !== 'undefined'` true?
3. ✅ **Form Valid**: Is `form.checkValidity()` true?
4. ✅ **Network Tab**: Wordt request verstuurd?
5. ✅ **Server Logs**: Bereikt request de server?
6. ✅ **Response**: Wat geeft de server terug?

## Als Het Nog Steeds Niet Werkt

1. **Check Server**: Is de server running op localhost:3000?
2. **Check Route**: Bestaat `/api/setup/step/editors` POST route?
3. **Check Logs**: Wat zegt de server console?
4. **Test Direct**: Test de endpoint met curl of Postman

```bash
# Test endpoint direct
curl -X POST http://localhost:3000/api/setup/step/editors \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "HX-Request: true" \
  -d "setupType=simple&editors=claude"
```

## Verbeteringen

1. ✅ **Betere Error Messages**: Meer details over errors
2. ✅ **Uitgebreide Logging**: Alle events worden gelogd
3. ✅ **Error Recovery**: Errors blokkeren submission niet
4. ✅ **Multiple Handlers**: Backup handlers voor state saving
5. ✅ **Debug Helpers**: Console helpers voor debugging

---

*Debug Guide Version: 1.0*
*Last Updated: 2025-12-01*

