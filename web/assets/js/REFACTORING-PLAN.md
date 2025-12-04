# JavaScript Refactoring Plan

## Huidige Structuur

```
src/js/
├── wizard-scripts.js    (1456 regels) - Te groot, doet te veel
├── wizard-init.js       (77 regels)   - Alleen setup type
├── review-form.js       (185 regels)  - Review form submission
├── advanced-init.js     (104 regels)  - Framework visibility
└── back-button.js       (106 regels)  - Back button handler
```

## Problemen

1. **wizard-scripts.js is veel te groot** (1456 regels) en bevat:
   - State management
   - Navigation logic
   - Form restoration
   - Form syncing
   - HTMX event handling
   - DOM utilities
   - Constants
   - Initialization

2. **Herhaalde patronen:**
   - DOM ready checks (5x)
   - HTMX afterSwap listeners (4x)
   - Form element queries (veelvuldig)
   - Error handling patterns

3. **Inconsistente naming:**
   - `wizard-init.js` vs `wizard-scripts.js`
   - `advanced-init.js` - waarom "init"?
   - `review-form.js` - waarom niet "review-init.js"?

4. **Geen duidelijke scheiding:**
   - Core utilities gemengd met wizard logic
   - Step-specifieke code in algemene wizard file

## Voorgestelde Structuur

```
src/js/
├── core/                    # Gedeelde utilities (DRY)
│   ├── constants.js         # Alle constants op één plek
│   ├── state.js             # WizardState object
│   ├── htmx.js              # HTMX utilities (event handling)
│   └── dom.js               # DOM helpers (query selectors, etc.)
├── wizard/                  # Wizard-specifieke functionaliteit
│   ├── navigation.js        # navigateToStep, goBack, determineBackRoute
│   ├── form-restore.js      # restoreFormSelections + restore helpers
│   ├── form-sync.js         # syncFromHiddenFields + sync helpers
│   └── init.js              # Wizard initialization (combineert wizard-init.js)
├── steps/                   # Step-specifieke handlers
│   ├── advanced.js          # Framework visibility (was advanced-init.js)
│   └── review.js            # Review form submission (was review-form.js)
└── base/                    # Base functionaliteit (alle pagina's)
    └── back-button.js       # Back button handler (blijft zoals is)
```

## Voordelen

1. **Modulair**: Elke module heeft één verantwoordelijkheid
2. **DRY**: Gedeelde utilities in `core/`
3. **Overzichtelijk**: Logische groepering per functionaliteit
4. **Schaalbaar**: Nieuwe steps/steps zijn makkelijk toe te voegen
5. **Testbaar**: Kleinere modules zijn makkelijker te testen
6. **Consistente naming**: Duidelijke naamgeving conventie

## Migratie Plan

1. ✅ Analyse voltooien
2. 🔄 Nieuwe directory structuur aanmaken
3. 🔄 wizard-scripts.js opsplitsen in modules
4. 🔄 wizard-init.js integreren in wizard/init.js
5. 🔄 advanced-init.js → steps/advanced.js
6. 🔄 review-form.js → steps/review.js
7. 🔄 build.js updaten voor nieuwe structuur
8. 🔄 Testen en verifiëren
9. 🔄 Oude bestanden verwijderen

## Build Configuratie

De nieuwe build.js zal deze volgorde gebruiken voor `wizard.js`:

1. Core modules (constants, state, htmx, dom)
2. Wizard modules (navigation, form-sync, form-restore, init)
3. Step modules (advanced, review)

Dit zorgt voor correcte dependency volgorde.
