# Simple Flow Navigation Fix

## Probleem

De navigatie in de simple setup (quick setup) functioneerde niet naar behoren. Stappen werden overgeslagen of navigatie ging naar verkeerde stappen.

## Root Cause

Het probleem was dat de route mapping in `getCurrentStep()` alleen voor extended flow werkte:

**Oude routeMap (alleen extended)**:
```javascript
const routeMap = {
    '/api/setup/step/project': 1,
    '/api/setup/step/presets': 2,
    '/api/setup/step/frontend': 3,
    '/api/setup/step/agents': 4,
    '/api/setup/step/editors': 5,  // ❌ Fout voor simple (moet 2 zijn)
    '/api/setup/step/advanced': 6,
    '/api/setup/generate': 7  // ❌ Fout voor simple (moet 3 zijn)
}
```

Voor simple flow:
- Step 1: Project ✓
- Step 2: Editors ❌ (werd gedetecteerd als step 5)
- Step 3: Review ❌ (werd gedetecteerd als step 7)

## Oplossing

Route mapping is nu **setup-type aware**:

### Simple Flow Route Mapping
```javascript
if (setupType === 'simple') {
    routeMap = {
        '/api/setup/step/project': 1,
        '/api/setup/step/editors': 2,  // ✅ Correct
        '/api/setup/generate': 3       // ✅ Correct
    }
}
```

### Extended Flow Route Mapping
```javascript
else {
    routeMap = {
        '/api/setup/step/project': 1,
        '/api/setup/step/presets': 2,
        '/api/setup/step/frontend': 3,
        '/api/setup/step/agents': 4,
        '/api/setup/step/editors': 5,
        '/api/setup/step/advanced': 6,
        '/api/setup/generate': 7
    }
}
```

## Gewijzigde Bestanden

### 1. `wizard-navigation.js`
- ✅ `getCurrentStep()` - Setup-type aware route mapping
- ✅ Betere logging voor debugging

### 2. `wizard-init.js`
- ✅ `determineNextStepFromForm()` - Setup-type aware route mapping
- ✅ `afterSettleHandler` - Setup-type aware stap detectie
- ✅ `initializeWizard()` - Detecteert initial step correct

### 3. `form-state-sync.js`
- ✅ `submitHandler` - Setup-type aware stap detectie

## Test Scenario's

### Simple Flow (3 stappen)

#### Test 1: Project → Editors
1. Start wizard met `?type=simple`
2. Vul project info in
3. Klik "Next: Editors"
4. **Verwacht**: Editors stap (step 2) wordt getoond
5. **State**: `currentStep: 2`

#### Test 2: Editors → Review
1. Op Editors stap
2. Selecteer editors (optioneel)
3. Klik "Next: Review"
4. **Verwacht**: Review stap (step 3) wordt getoond
5. **State**: `currentStep: 3`

#### Test 3: Review → Editors (Back)
1. Op Review stap
2. Klik "Back"
3. **Verwacht**: Editors stap (step 2) wordt getoond
4. **State**: `currentStep: 2`

#### Test 4: Editors → Project (Back)
1. Op Editors stap
2. Klik "Back"
3. **Verwacht**: Project stap (step 1) wordt getoond
4. **State**: `currentStep: 1`

## Debugging

Als navigatie nog steeds niet werkt, check de console logs:

```javascript
// Check current step
window.wizardNavigation.getCurrentStep()

// Check state
window.wizardStateManager.load()

// Check next step
window.wizardNavigation.getNextStep()

// Check previous step
window.wizardNavigation.getPreviousStep()
```

## Verificatie Checklist

- [ ] Simple flow: Project (1) → Editors (2) werkt
- [ ] Simple flow: Editors (2) → Review (3) werkt
- [ ] Simple flow: Review (3) → Editors (2) (Back) werkt
- [ ] Simple flow: Editors (2) → Project (1) (Back) werkt
- [ ] Extended flow: Alle stappen werken nog steeds
- [ ] State wordt correct bijgewerkt bij elke navigatie
- [ ] Geen stappen worden overgeslagen

## Conclusie

Het probleem was dat de route mapping niet setup-type aware was. Nu wordt voor elke setup type de correcte route mapping gebruikt, waardoor navigatie altijd naar de juiste stap gaat.

**Status**: ✅ Gefixt - Ready for Testing

---

*Fix Version: 1.0*
*Last Updated: 2025-12-01*

