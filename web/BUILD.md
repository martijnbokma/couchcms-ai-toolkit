# Build Systeem

Dit directory bevat een build systeem voor het bundelen van JavaScript en CSS bestanden met Bun.

## Directory Structuur

```
scripts/web/
├── src/                    # Bronbestanden (source)
│   ├── js/                 # JavaScript bronbestanden
│   │   ├── wizard-scripts.js
│   │   ├── wizard-init.js
│   │   ├── review-form.js
│   │   ├── advanced-init.js
│   │   └── back-button.js
│   └── css/                # CSS bronbestanden
│       ├── common.css
│       └── progress-indicator.css
├── public/                 # Public directory (geserveerd door server)
│   └── dist/              # Gebundelde bestanden (build output)
│       ├── js/
│       │   ├── wizard.js
│       │   └── base.js
│       └── css/
│           ├── common.css
│           └── progress-indicator.css
└── build.js               # Build script
```

## Build Script

Het build script combineert meerdere JavaScript bestanden tot geoptimaliseerde bundles:

### JavaScript Bundles

- **`wizard.js`** - Combineert alle wizard-gerelateerde scripts:
  - `wizard-scripts.js`
  - `wizard-init.js`
  - `review-form.js`
  - `advanced-init.js`

- **`base.js`** - Base scripts:
  - `back-button.js`

### CSS Files

CSS bestanden worden gekopieerd naar de dist directory (klaar voor toekomstige minificatie/bundeling):
- `common.css`
- `progress-indicator.css`

## Gebruik

### Build uitvoeren

```bash
# Vanuit project root
bun run build:web

# Of direct vanuit scripts/web
cd scripts/web
bun build.js
```

### Output

De gebundelde bestanden worden gegenereerd in:
```
scripts/web/public/dist/
├── js/
│   ├── wizard.js
│   └── base.js
└── css/
    ├── common.css
    └── progress-indicator.css
```

## Template Updates

De templates gebruiken automatisch de gebundelde versies:

- `base.html` → `/public/dist/js/base.js` en `/public/dist/css/common.css`
- `wizard.html` → `/public/dist/js/wizard.js` en `/public/dist/css/progress-indicator.css`

## Development Workflow

1. **Wijzig bronbestanden** in `src/js/` of `src/css/`
2. **Run build script**: `bun run build:web`
3. **Test**: De server serveert automatisch bestanden uit `public/dist/`

## Development vs Production

- **Development**: Wijzigingen in bronbestanden vereisen een rebuild
- **Production**: Gebruik altijd de gebundelde versies voor betere performance

## Voordelen

- ✅ **Duidelijke scheiding**: Bronbestanden (`src/`) gescheiden van output (`public/dist/`)
- ✅ **Minder HTTP requests**: 1 request i.p.v. 4-5 voor JavaScript
- ✅ **Betere caching**: Één bestand i.p.v. meerdere
- ✅ **Snellere laadtijden**: Minder roundtrips naar server
- ✅ **Toekomstbestendig**: Klaar voor minificatie en CSS bundeling
