# State Module Creatie Plan

## WizardState Methods (uit wizard-scripts.js)

### Basis Methods
- `save(state)` - Save to sessionStorage
- `load()` - Load from sessionStorage
- `update(updates)` - Merge updates
- `clear()` - Clear state

### Sync Methods (van form naar state)
- `syncFromHiddenFields()` - Main sync method
- `_syncProjectField()` - Sync project fields
- `_syncCheckboxField()` - Sync checkbox fields
- `_syncFrameworkOptions()` - Sync framework options

### Collect Methods (van form naar state)
- `collectFormData()` - Main collect method
- `_collectProjectField()` - Collect project fields
- `_collectCheckboxField()` - Collect checkbox fields
- `_collectRadioField()` - Collect radio fields
- `_collectFrameworkOptions()` - Collect framework options

### Utility Methods
- `toURLParams(state)` - Convert to URL params

## Dependencies

State module heeft nodig:
- `DOMUtils` (getVisibleInput, getHiddenInputs, getCheckboxValues, normalizeProjectValue, isValidValue)
- `WIZARD_CONFIG` (constants)
- `WIZARD_CONSTANTS` (constants)

## Aanpak

1. Maak `core/state.js` met alle WizardState methods
2. Gebruik DOMUtils voor alle DOM queries
3. Gebruik WIZARD_CONFIG en WIZARD_CONSTANTS voor configuratie
4. Behoud alle logica en comments
