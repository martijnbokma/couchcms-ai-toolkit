# Source Files

Deze directory bevat de **bronbestanden** voor JavaScript en CSS.

## Structuur

- **`js/`** - JavaScript bronbestanden
- **`css/`** - CSS bronbestanden

## Belangrijk

⚠️ **Deze bestanden worden niet direct geserveerd door de server.**

Alle bestanden moeten eerst gebundeld worden met het build script:
```bash
bun run build:web
```

De gebundelde bestanden worden gegenereerd in `../public/dist/` en worden daar vandaan geserveerd.

## Bestandsorganisatie

### JavaScript

- `wizard-scripts.js` - Core wizard functionaliteit en state management
- `wizard-init.js` - Wizard initialisatie op page load
- `review-form.js` - Review form submission handler
- `advanced-init.js` - Advanced step initialisatie
- `back-button.js` - Back button handler (fallback)

### CSS

- `common.css` - Algemene styles voor alle pagina's
- `progress-indicator.css` - Styles voor de progress indicator component
