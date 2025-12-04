# Wizard State Sync Fix - Deselecties worden nu onthouden

**Date:** 2025-01-01
**Issue:** Deselecties in vorige stappen werden niet onthouden
**Status:** ✅ Fixed

---

## Probleem

Wanneer je terug navigeerde naar een vorige stap en een selectie deselecteerde, werd die wijziging niet opgeslagen in de state. Dit kwam door een race condition tussen:

1. **Event listeners** die werden ingesteld VOOR de state werd teruggezet
2. **Programmatische wijzigingen** in `restoreStateToForm` die de listeners triggerden
3. **Timing issues** waarbij de oude state werd teruggezet terwijl listeners al actief waren

### Root Cause

De volgorde was:
1. `setupFormListeners()` - listeners worden actief
2. `restoreStateToForm()` (50ms delay) - state wordt teruggezet naar formulier
3. Programmatische checkbox wijzigingen triggeren de listeners
4. Listeners proberen state op te slaan met oude/onjuiste waarden

---

## Oplossing

### 1. Restore Flag Toegevoegd

Een `isRestoring` flag voorkomt dat listeners triggeren tijdens programmatische restore:

```javascript
class FormStateSync {
    constructor() {
        // ...
        this.isRestoring = false // Flag to prevent listeners from triggering during restore
    }
}
```

### 2. Listeners Blokkeren Tijdens Restore

Event handlers controleren nu de flag:

```javascript
const inputHandler = (e) => {
    // CRITICAL: Don't trigger during programmatic restore
    if (this.isRestoring) {
        return
    }
    // ... rest of handler
}
```

### 3. Volgorde Omgedraaid

De volgorde is nu:
1. `restoreStateToForm()` - state wordt teruggezet (met flag actief)
2. Flag wordt opgeheven na 100ms
3. `setupFormListeners()` (150ms delay) - listeners worden pas actief NA restore

Dit voorkomt dat programmatische wijzigingen de listeners triggeren.

### 4. Immediate Sync voor Navigatie

Wanneer je terug navigeert, wordt de state onmiddellijk gesynced (zonder setTimeout) om race conditions te voorkomen:

```javascript
async navigateToStep(stepNum, route) {
    // Wait for pending async syncs to complete
    await new Promise(resolve => setTimeout(resolve, 20))

    // Immediate sync (no setTimeout)
    window.formStateSync.syncFormToState(form, true)

    // Navigate with updated state
    // ...
}
```

### 5. Verbeterde Checkbox Sync Timing

Checkbox syncs gebruiken nu 10ms delay in plaats van 0ms voor betrouwbaardere DOM updates:

```javascript
setTimeout(() => {
    this.syncFormToState(form)
}, 10) // Increased from 0 to 10ms
```

### 6. Betere State Collection

`collectFormData` verzamelt nu altijd de huidige DOM state, zelfs als arrays leeg zijn, om deselecties te behouden:

```javascript
// CRITICAL: Always set the array, even if empty, to preserve deselections
data[key] = checkedValues // Can be empty array []
```

---

## Wijzigingen

### `form-state-sync.js`

1. **`isRestoring` flag toegevoegd** aan constructor
2. **Flag wordt gezet** aan het begin van `applyStateToForm()`
3. **Flag wordt opgeheven** na 100ms (na DOM updates)
4. **Event handlers controleren flag** en returnen vroegtijdig als flag actief is

### `wizard-init.js`

1. **Volgorde omgedraaid** in `afterSettleHandler`:
   - Eerst `restoreStateToForm()` (zonder delay)
   - Dan `setupFormListeners()` (met 150ms delay)

2. **Zelfde fix** toegepast in initial load handler

3. **Immediate sync** toegevoegd in `beforeRequestHandler` voor form submissions

### `wizard-navigation.js`

1. **Delay toegevoegd** in `navigateToStep` om te wachten op pending async syncs
2. **Immediate sync** gebruikt voor navigatie (geen setTimeout)
3. **Betere logging** toegevoegd voor debugging

---

## Test Scenario

**Voor de fix:**
1. Navigeer naar Frontend step
2. Selecteer TailwindCSS en daisyUI
3. Navigeer naar Agents step
4. Navigeer terug naar Frontend step
5. Deselecteer daisyUI
6. Navigeer naar Agents step
7. Navigeer terug naar Frontend step
8. ❌ daisyUI is weer geselecteerd (deselectie niet onthouden)

**Na de fix:**
1. Navigeer naar Frontend step
2. Selecteer TailwindCSS en daisyUI
3. Navigeer naar Agents step
4. Navigeer terug naar Frontend step
5. Deselecteer daisyUI
6. Navigeer naar Agents step
7. Navigeer terug naar Frontend step
8. ✅ daisyUI blijft gedeselecteerd (deselectie wordt onthouden)

---

## Technische Details

### Timing Flow

**Oude flow:**
```
HTMX swap → setupFormListeners() → [50ms] → restoreStateToForm()
                                         ↓
                                    Listeners actief tijdens restore
                                         ↓
                                    Race condition!
```

**Nieuwe flow:**
```
HTMX swap → restoreStateToForm() (flag=true) → [100ms] → flag=false → [50ms] → setupFormListeners()
                                                                    ↓
                                                           Listeners pas actief NA restore
                                                                    ↓
                                                           Geen race condition!
```

### Flag Lifecycle

1. `isRestoring = false` (initial)
2. `restoreStateToForm()` called → `isRestoring = true`
3. DOM updates (checkboxes checked/unchecked)
4. `setTimeout(() => { isRestoring = false }, 100)`
5. `setupFormListeners()` called (150ms delay)
6. Listeners actief, maar restore is al klaar

---

## Bestanden Gewijzigd

- `web/assets/js/core/form-state-sync.js`
  - `isRestoring` flag toegevoegd
  - Event handlers controleren flag
  - Flag lifecycle in `applyStateToForm()`

- `web/assets/js/core/wizard-init.js`
  - Volgorde omgedraaid: restore eerst, dan listeners
  - Timing aangepast voor beide handlers

---

## Verificatie

Test de volgende scenario's:

- [ ] Selecteer items in stap A, navigeer naar stap B, terug naar A, deselecteer items → deselecties blijven behouden
- [ ] Selecteer items in stap A, navigeer naar stap B, terug naar A, selecteer andere items → nieuwe selecties blijven behouden
- [ ] Navigeer tussen meerdere stappen heen en weer → alle wijzigingen blijven behouden
- [ ] Refresh pagina midden in wizard → state wordt correct hersteld

---

**Document Version:** 1.0
**Last Updated:** 2025-01-01

