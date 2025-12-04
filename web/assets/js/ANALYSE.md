# JavaScript Map Analyse & Verbeterplan

## Huidige Situatie

### Bestandsstructuur
```
src/js/
├── wizard-scripts.js    (1456 regels) ⚠️ VEEL TE GROOT
├── wizard-init.js       (77 regels)
├── review-form.js       (185 regels)
├── advanced-init.js     (104 regels)
└── back-button.js       (106 regels)  ✅ Goed
```

### Problemen Geïdentificeerd

1. **wizard-scripts.js is een monolith** (1456 regels)
   - Bevat 8+ verschillende verantwoordelijkheden
   - Moeilijk te onderhouden
   - Moeilijk te testen

2. **Herhaalde code (DRY violation)**
   - DOM ready checks: 5x hetzelfde patroon
   - HTMX listeners: 4x dezelfde setup
   - Form queries: veel duplicatie

3. **Inconsistente naming**
   - `wizard-init.js` vs `wizard-scripts.js`
   - `advanced-init.js` - waarom "init"?
   - `review-form.js` - inconsistent met andere namen

4. **Slechte scheiding van concerns**
   - Core utilities gemengd met wizard logic
   - Step-specifieke code in algemene wizard file

## Voorgestelde Verbeteringen

### Nieuwe Modulaire Structuur

```
src/js/
├── core/                    # Gedeelde utilities (DRY)
│   ├── constants.js         ✅ KLAAR - Alle constants
│   ├── state.js             🔄 TODO - WizardState object
│   ├── htmx.js              ✅ KLAAR - HTMX utilities
│   └── dom.js               ✅ KLAAR - DOM helpers
├── wizard/                  # Wizard-specifieke functionaliteit
│   ├── navigation.js        🔄 TODO - Navigatie functies
│   ├── form-restore.js      🔄 TODO - Form restoration
│   ├── form-sync.js         🔄 TODO - Form syncing
│   └── init.js              🔄 TODO - Initialisatie
├── steps/                   # Step-specifieke handlers
│   ├── advanced.js          🔄 TODO - Framework visibility
│   └── review.js            🔄 TODO - Review form submission
└── base/                    # Base functionaliteit
    └── back-button.js       ✅ Blijft zoals is
```

### Bestandsnamen Verbetering

| Huidig | Nieuw | Reden |
|--------|-------|-------|
| `wizard-scripts.js` | Opgesplitst in modules | Te groot, meerdere verantwoordelijkheden |
| `wizard-init.js` | `wizard/init.js` | Consistent met structuur |
| `advanced-init.js` | `steps/advanced.js` | Duidelijker: step-specifieke code |
| `review-form.js` | `steps/review.js` | Consistent met andere steps |
| `back-button.js` | `base/back-button.js` | Base functionaliteit |

## Voordelen

1. ✅ **Modulair**: Elke module één verantwoordelijkheid
2. ✅ **DRY**: Gedeelde utilities voorkomen duplicatie
3. ✅ **Overzichtelijk**: Logische groepering
4. ✅ **Schaalbaar**: Nieuwe steps makkelijk toe te voegen
5. ✅ **Testbaar**: Kleine modules zijn testbaar
6. ✅ **Consistent**: Duidelijke naamgeving

## Status

- ✅ Analyse compleet
- ✅ Core modules gestart (constants, htmx, dom)
- 🔄 State module (grootste file, moet nog gemaakt worden)
- 🔄 Wizard modules (navigation, form-restore, form-sync, init)
- 🔄 Step modules (advanced, review)
- 🔄 Build.js updaten
- ⏳ Oude bestanden verwijderen (na testen)

## Volgende Stappen

1. State module compleet maken (WizardState uit wizard-scripts.js)
2. Wizard modules maken (navigation, form-restore, form-sync)
3. Step modules migreren
4. Build.js updaten
5. Testen
6. Oude bestanden verwijderen
