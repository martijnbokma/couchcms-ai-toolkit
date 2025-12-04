# Web Interface Structuur Voorstel

## Huidige Situatie

```
scripts/web/
├── server.js              # Server setup
├── build.js               # Build script
├── clean.js               # Clean script
├── routes/                # API routes
│   ├── setup.js
│   ├── api.js
│   └── helpers.js
├── templates/             # ❌ HTML templates in scripts map
│   ├── base.html
│   ├── partials/
│   ├── setup/
│   └── steps/
├── src/                   # ✅ CSS en JS gescheiden
│   ├── css/
│   └── js/
└── public/                # Build output
    └── dist/
```

**Problemen:**
- ❌ Templates (HTML) zitten in `scripts/web/` - niet logisch
- ❌ Alles suggereert dat het alleen scripts zijn
- ✅ CSS en JS zijn wel goed gescheiden

---

## Optie 1: Verplaats naar Root `/web/` (Aanbevolen)

### Structuur

```
web/                       # Nieuwe root-level map
├── server/                # Server code en routes
│   ├── server.js
│   ├── routes/
│   │   ├── setup.js
│   │   ├── api.js
│   │   ├── helpers.js
│   │   └── utils.js
│   └── middleware.js      # Toekomstige middleware
├── templates/             # HTML templates (logische plaats)
│   ├── base.html
│   ├── partials/
│   │   ├── form-navigation.html
│   │   ├── hidden-fields.html
│   │   ├── progress-indicator.html
│   │   ├── section-header.html
│   │   └── wizard-navigation.html
│   ├── setup/
│   │   ├── terminal.html
│   │   ├── welcome.html
│   │   └── wizard.html
│   └── steps/
│       ├── advanced.html
│       ├── agents.html
│       ├── complexity.html
│       ├── editors.html
│       ├── error.html
│       ├── frontend.html
│       ├── presets.html
│       ├── project.html
│       ├── review.html
│       └── success.html
├── assets/                # Source files (CSS en JS gescheiden)
│   ├── css/               # ✅ Styling
│   │   ├── common.css
│   │   ├── input.css
│   │   └── progress-indicator.css
│   └── js/                # ✅ Functionaliteit
│       ├── base/
│       │   └── back-button.js
│       ├── core/
│       │   ├── constants.js
│       │   ├── dom.js
│       │   ├── htmx.js
│       │   └── state.js
│       ├── steps/
│       │   ├── advanced.js
│       │   └── review.js
│       └── wizard/
│           ├── form-restore.js
│           ├── form-sync.js
│           ├── init.js
│           └── navigation.js
├── public/                # Build output (gitignored)
│   └── dist/
│       ├── css/
│       │   └── app.css
│       └── js/
│           ├── base.js
│           └── wizard.js
└── scripts/               # Build scripts (optioneel hier of in scripts/web/)
    ├── build.js
    └── clean.js
```

### Voordelen

- ✅ **Duidelijke scheiding**: Templates, assets, en server code zijn duidelijk gescheiden
- ✅ **Logische plaats**: Templates zitten niet meer in scripts map
- ✅ **CSS/JS gescheiden**: Assets map houdt CSS en JS apart
- ✅ **Toekomstbestendig**: Makkelijk uit te breiden met nieuwe features
- ✅ **Onderhoudbaar**: Duidelijke structuur voor teamleden
- ✅ **Consistent**: Volgt web development conventies

### Aanpassingen nodig

1. **server.js** - Update paths:
   ```javascript
   const templatesPath = join(__dirname, '..', 'templates')
   const publicPath = join(__dirname, '..', 'public')
   ```

2. **build.js** - Update paths:
   ```javascript
   const WEB_DIR = import.meta.dir
   const ASSETS_DIR = join(WEB_DIR, 'assets')
   const JS_SRC_DIR = join(ASSETS_DIR, 'js')
   const CSS_SRC_DIR = join(ASSETS_DIR, 'css')
   ```

3. **package.json** - Update scripts:
   ```json
   "build:web": "bun web/scripts/build.js",
   "clean:web": "bun web/scripts/clean.js"
   ```

4. **toolkit.js** - Update import paths:
   ```javascript
   import { startServer } from './web/server/server.js'
   ```

---

## Optie 2: Houd `scripts/web/` maar Verplaats Templates

### Structuur

```
scripts/web/
├── server.js
├── build.js
├── clean.js
├── routes/
├── src/                   # Huidige structuur blijft
│   ├── css/
│   └── js/
└── public/

templates/web/             # Nieuwe locatie voor web templates
├── base.html
├── partials/
├── setup/
└── steps/
```

### Voordelen

- ✅ **Minimale wijzigingen**: Alleen templates verplaatsen
- ✅ **CSS/JS gescheiden**: Blijft zoals het is
- ✅ **Templates logisch**: Niet meer in scripts map

### Nadelen

- ⚠️ **Minder duidelijk**: Web interface blijft onder scripts
- ⚠️ **Minder schaalbaar**: Moeilijker uit te breiden
- ⚠️ **Mogelijke verwarring**: `templates/web/` vs `templates/editors/`

---

## Optie 3: Hybride - Server in Scripts, Rest op Root

### Structuur

```
scripts/web/               # Alleen server code
├── server.js
├── routes/
│   ├── setup.js
│   ├── api.js
│   └── helpers.js
└── utils.js

web/                      # Templates en assets op root
├── templates/
├── assets/
│   ├── css/
│   └── js/
├── public/
└── scripts/
    ├── build.js
    └── clean.js
```

### Voordelen

- ✅ **Server code bij scripts**: Logisch voor backend code
- ✅ **Templates op root**: Duidelijk zichtbaar
- ✅ **CSS/JS gescheiden**: Assets map houdt ze apart

### Nadelen

- ⚠️ **Gesplitste codebase**: Server en templates op verschillende plekken
- ⚠️ **Complexere paths**: Meer imports tussen directories

---

## Aanbeveling: Optie 1

**Waarom Optie 1?**

1. **Duidelijkheid**: Alles wat met de web interface te maken heeft staat op één plek
2. **Schaalbaarheid**: Makkelijk nieuwe features toe te voegen (bijv. `/web/api/`, `/web/components/`)
3. **Onderhoud**: Teamleden weten direct waar alles staat
4. **Conventies**: Volgt standaard web development structuur
5. **CSS/JS scheiding**: Duidelijk gescheiden in `assets/css/` en `assets/js/`

### Migratie Stappen

1. **Maak nieuwe structuur**:
   ```bash
   mkdir -p web/{server/routes,assets/{css,js},templates/{partials,setup,steps},public/dist,scripts}
   ```

2. **Verplaats bestanden**:
   ```bash
   # Server code
   mv scripts/web/server.js web/server/
   mv scripts/web/routes/* web/server/routes/

   # Templates
   mv scripts/web/templates/* web/templates/

   # Assets
   mv scripts/web/src/css/* web/assets/css/
   mv scripts/web/src/js/* web/assets/js/

   # Scripts
   mv scripts/web/build.js web/scripts/
   mv scripts/web/clean.js web/scripts/
   ```

3. **Update imports** in alle bestanden
4. **Update package.json** scripts
5. **Test** build en server
6. **Verwijder** oude `scripts/web/` map

---

## Vergelijking Tabel

| Criterium | Optie 1 | Optie 2 | Optie 3 |
|-----------|---------|---------|---------|
| **Duidelijkheid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Onderhoudbaarheid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Schaalbaarheid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Migratie complexiteit** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **CSS/JS scheiding** | ✅ Perfect | ✅ Perfect | ✅ Perfect |
| **Templates logisch** | ✅ Ja | ✅ Ja | ✅ Ja |

---

## Volgende Stappen

1. **Kies een optie** die past bij jullie workflow
2. **Review** de voorgestelde structuur
3. **Plan** de migratie (kan gefaseerd)
4. **Test** grondig na migratie

**Vragen of aanpassingen nodig?** Laat het weten en ik pas het voorstel aan.
