# Wizard Form Submission Fix

## Probleem

Bij het klikken op "Next: Review" in de simple setup krijgt de gebruiker een error melding:
"An error occurred while submitting the form. Please check your internet connection."

Dit is een `htmx:sendError` event, wat betekent dat HTMX de request niet kan versturen.

## Mogelijke Oorzaken

1. **JavaScript Error**: Een error in de submit handler blokkeert de submission
2. **Form Validation**: HTML5 validation blokkeert de submission
3. **HTMX Configuratie**: HTMX is niet correct geconfigureerd
4. **Network Error**: Echte network error (onwaarschijnlijk als andere requests werken)

## Oplossingen Geïmplementeerd

### 1. Verbeterde Error Handling

**`form-state-sync.js`**:
- ✅ Try-catch rond submit handler
- ✅ Errors blokkeren submission niet meer
- ✅ Passive event listener (geen preventDefault)

**`wizard-init.js`**:
- ✅ Try-catch rond beforeRequest handler
- ✅ Errors blokkeren request niet meer
- ✅ Betere logging

**`htmx.js`**:
- ✅ Uitgebreide error logging
- ✅ Logging van alle HTMX events
- ✅ Betere error messages met details

### 2. Debugging Verbeteringen

Alle HTMX events worden nu gelogd:
- `htmx:beforeRequest` - Logt form details
- `htmx:send` - Logt wanneer request wordt verstuurd
- `htmx:afterRequest` - Logt response details
- `htmx:sendError` - Logt error details
- `htmx:responseError` - Logt response errors

### 3. Form Validation

- ✅ HTML5 validation wordt gecontroleerd
- ✅ Validation errors worden gelogd
- ✅ Form.reportValidity() wordt aangeroepen bij errors

## Debugging Stappen

### Stap 1: Check Console Logs

Open browser console en kijk naar:
1. `[HTMX] Before request:` - Wordt dit getoond?
2. `[HTMX] Sending request:` - Wordt dit getoond?
3. `[HTMX] Send error` - Wat is de error?

### Stap 2: Check Form Element

```javascript
// In browser console
const form = document.querySelector('form')
console.log('Form action:', form.getAttribute('hx-post'))
console.log('Form target:', form.getAttribute('hx-target'))
console.log('Form valid:', form.checkValidity())
console.log('Form method:', form.method)
```

### Stap 3: Check HTMX Configuratie

```javascript
// In browser console
console.log('HTMX available:', typeof htmx !== 'undefined')
console.log('HTMX version:', htmx?.version)
```

### Stap 4: Check State Manager

```javascript
// In browser console
const state = window.wizardStateManager?.load()
console.log('Current state:', state)
console.log('Current step:', state?.currentStep)
console.log('Setup type:', state?.setupType)
```

### Stap 5: Test Form Submission Manueel

```javascript
// In browser console
const form = document.querySelector('form')
const formData = new FormData(form)
console.log('Form data:', Object.fromEntries(formData.entries()))

// Test HTMX request
htmx.ajax('POST', form.getAttribute('hx-post'), {
    target: form.getAttribute('hx-target'),
    swap: 'innerHTML',
    values: formData
})
```

## Veelvoorkomende Problemen

### Probleem 1: Form Validation Fails

**Symptoom**: Request wordt niet verstuurd, geen error in console

**Oplossing**: Check required fields
```javascript
const form = document.querySelector('form')
const invalidFields = Array.from(form.elements).filter(el => !el.validity.valid)
console.log('Invalid fields:', invalidFields)
```

### Probleem 2: JavaScript Error in Submit Handler

**Symptoom**: Error in console, request wordt niet verstuurd

**Oplossing**: Check console voor errors, fix de error

### Probleem 3: HTMX Not Loaded

**Symptoom**: `htmx is not defined` error

**Oplossing**: Check of HTMX script is geladen
```html
<script src="https://unpkg.com/htmx.org@2.0.0"></script>
```

### Probleem 4: Form Action Mismatch

**Symptoom**: Request gaat naar verkeerde URL

**Oplossing**: Check form action attribute
```javascript
const form = document.querySelector('form')
console.log('Form action:', form.getAttribute('hx-post'))
// Should be: /api/setup/step/editors
```

## Test Checklist

- [ ] Console logs tonen `[HTMX] Before request`
- [ ] Console logs tonen `[HTMX] Sending request`
- [ ] Geen errors in console voor submission
- [ ] Form validation passes
- [ ] HTMX is geladen
- [ ] Form action is correct
- [ ] Form target is correct
- [ ] State manager werkt
- [ ] Request wordt daadwerkelijk verstuurd

## Als Het Nog Steeds Niet Werkt

1. **Check Network Tab**: Kijk of de request wordt verstuurd
2. **Check Server Logs**: Kijk of de request de server bereikt
3. **Check Response**: Kijk wat de server teruggeeft
4. **Test Met curl**: Test de endpoint direct

```bash
curl -X POST http://localhost:3000/api/setup/step/editors \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "setupType=simple&editors=claude"
```

## Verbeteringen Toegevoegd

1. ✅ **Betere Error Messages**: Meer details over wat er mis gaat
2. ✅ **Uitgebreide Logging**: Alle HTMX events worden gelogd
3. ✅ **Error Recovery**: Errors blokkeren submission niet meer
4. ✅ **Form Validation**: HTML5 validation wordt gecontroleerd
5. ✅ **Debug Helpers**: Console helpers voor debugging

---

*Fix Version: 1.0*
*Last Updated: 2025-12-01*
*Status: ✅ Implemented - Ready for Testing*

