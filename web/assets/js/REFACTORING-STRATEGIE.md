# Refactoring Strategie - Incrementele Aanpak

## Huidige Situatie
- `wizard-scripts.js`: 1455 regels (monolith)
- 4 andere kleine bestanden die kunnen worden gemigreerd
- Build systeem combineert bestanden

## Strategie: Incrementele Migratie

### Fase 1: Core Infrastructure ✅ (KLAAR)
- ✅ `core/constants.js` - Alle constants
- ✅ `core/htmx.js` - HTMX utilities
- ✅ `core/dom.js` - DOM helpers

### Fase 2: State Module (NU)
- Maak `core/state.js` met volledige WizardState
- Gebruik DOM utilities waar mogelijk
- Behoud alle functionaliteit

### Fase 3: Wizard Modules
- `wizard/navigation.js` - navigateToStep, goBack
- `wizard/form-restore.js` - restore functies
- `wizard/form-sync.js` - sync functies (of in state.js)
- `wizard/init.js` - Initialisatie

### Fase 4: Step Modules
- `steps/advanced.js` - Framework visibility
- `steps/review.js` - Review form

### Fase 5: Build Update
- Update build.js voor nieuwe structuur
- Test bundeling

### Fase 6: Cleanup
- Verwijder oude bestanden
- Test volledige functionaliteit

## Belangrijkste Principes

1. **Backward Compatible**: Oude code blijft werken tijdens migratie
2. **Incrementeel**: Eén module per keer
3. **Testbaar**: Elke stap is testbaar
4. **DRY**: Gebruik gedeelde utilities

## Volgende Stap

Maak nu `core/state.js` met volledige WizardState functionaliteit, gebruik makend van DOM utilities.
