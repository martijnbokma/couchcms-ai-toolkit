# Refactoring Status

## ✅ Voltooid

### Core Modules
- ✅ `core/constants.js` - Alle constants gecentraliseerd
- ✅ `core/htmx.js` - HTMX utilities (event handling)
- ✅ `core/dom.js` - DOM helpers (query selectors, normalization)

### Documentatie
- ✅ `ANALYSE.md` - Analyse van huidige situatie
- ✅ `REFACTORING-PLAN.md` - Volledige refactoring plan
- ✅ `REFACTORING-STRATEGIE.md` - Incrementele aanpak
- ✅ `CREATE-STATE-MODULE.md` - State module plan

## 🔄 In Progress

### Core Modules
- 🔄 `core/state.js` - WizardState object (moet nog gemaakt worden)

## ⏳ Todo

### Wizard Modules
- ⏳ `wizard/navigation.js` - navigateToStep, goBack
- ⏳ `wizard/form-restore.js` - restoreFormSelections
- ⏳ `wizard/form-sync.js` - syncFromHiddenFields (of in state.js)
- ⏳ `wizard/init.js` - Wizard initialization

### Step Modules
- ⏳ `steps/advanced.js` - Framework visibility
- ⏳ `steps/review.js` - Review form submission

### Build & Cleanup
- ⏳ Update `build.js` voor nieuwe structuur
- ⏳ Test bundeling
- ⏳ Verwijder oude bestanden

## 📋 Volgende Stappen

1. Maak `core/state.js` met volledige WizardState
2. Maak wizard modules (navigation, form-restore, init)
3. Migreer step modules (advanced, review)
4. Update build.js
5. Test alles
6. Cleanup oude bestanden
