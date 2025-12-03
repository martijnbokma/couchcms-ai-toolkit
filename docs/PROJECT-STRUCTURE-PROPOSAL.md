# Project Structure Proposal

## Visie: Duidelijk Onderscheid tussen Core en Optionele Technologieën

Dit document beschrijft een voorgestelde mappenstructuur die het onderscheid tussen **CouchCMS (core)** en **optionele technologieën** (TailwindCSS, Alpine.js, TypeScript, etc.) duidelijk maakt en het werken met het project vereenvoudigt.

---

## Huidige Structuur

### Modules
```
modules/
├── core/              # CouchCMS modules (altijd beschikbaar)
│   ├── couchcms-core.md
│   ├── databound-forms.md
│   ├── custom-routes.md
│   ├── folders.md
│   ├── archives.md
│   ├── relationships.md
│   ├── repeatable-regions.md
│   ├── search.md
│   ├── pagination.md
│   ├── comments.md
│   └── users.md
└── frontend/          # Optionele frontend modules
    ├── tailwindcss.md
    ├── daisyui.md
    ├── alpinejs.md
    └── typescript.md
```

### Agents
```
agents/
├── core/              # CouchCMS agents (altijd beschikbaar)
│   ├── couchcms.md
│   ├── databound-forms.md
│   ├── custom-routes.md
│   ├── views.md
│   ├── folders.md
│   ├── archives.md
│   ├── relationships.md
│   ├── repeatable-regions.md
│   ├── search.md
│   ├── pagination.md
│   ├── comments.md
│   ├── nested-pages.md
│   ├── photo-gallery.md
│   ├── rss-feeds.md
│   ├── on-page-editing.md
│   └── users.md
├── frontend/          # Optionele frontend agents
│   ├── tailwindcss.md
│   ├── alpinejs.md
│   ├── typescript.md
│   └── admin-panel-theming.md
└── dev-tools/         # Optionele development tools
    ├── bun.md
    ├── git.md
    └── mysql.md
```

---

## Aanbevolen Oplossing: Huidige Structuur + Verbeterde Documentatie

### Principe: Behoud Platte Structuur, Verbeter Documentatie

**Geen extra nesting nodig!** De huidige structuur is al perfect:
- ✅ Slechts 1 niveau diepte (`core/`, `frontend/`, `dev-tools/`)
- ✅ Duidelijk onderscheid tussen core en optioneel
- ✅ Eenvoudig te navigeren
- ✅ Geen breaking changes nodig

### Huidige Structuur (Behouden)

```
modules/
├── core/              # ⚡ CORE - Altijd beschikbaar
│   ├── README.md      # Uitleg: Dit zijn core modules
│   ├── couchcms-core.md
│   ├── databound-forms.md
│   └── ...
└── frontend/          # 🎨 OPTIONEEL - Kies wat je nodig hebt
    ├── README.md      # Uitleg: Dit zijn optionele modules
    ├── tailwindcss.md
    └── ...

agents/
├── core/              # ⚡ CORE - Altijd beschikbaar
│   ├── README.md      # Uitleg: Dit zijn core agents
│   └── ...
├── frontend/          # 🎨 OPTIONEEL - Kies wat je nodig hebt
│   ├── README.md      # Uitleg: Dit zijn optionele agents
│   └── ...
└── dev-tools/         # 🛠️ OPTIONEEL - Development tools
    ├── README.md      # Uitleg: Dit zijn optionele tools
    └── ...
```

**Dit is al perfect!** We voegen alleen betere documentatie toe zonder de structuur te veranderen.

---

## Implementatie: Verbeterde Documentatie Zonder Extra Nesting

### Wat We Doen

✅ **Behouden**: Huidige platte structuur (geen extra nesting)
✅ **Toevoegen**: Duidelijke README's in elke categorie
✅ **Verbeteren**: Hoofd-README's met visuele indicatoren
✅ **Documenteren**: Uitleg over core vs optioneel

### Implementatie Stappen

1. ✅ **README's toegevoegd** aan elke categorie (`core/`, `frontend/`, `dev-tools/`)
2. ✅ **Hoofd-README's verbeterd** met visuele indicatoren (⚡🎨🛠️)
3. ✅ **Documentatie bijgewerkt** om het onderscheid duidelijk te maken
4. ✅ **Geen structuurwijzigingen** - alles blijft zoals het is

---

## Gedetailleerde README Inhoud

### `modules/core/README.md`

```markdown
# Core Modules - CouchCMS (Altijd Vereist)

Deze modules zijn **altijd beschikbaar** en maken deel uit van het CouchCMS kernsysteem.

## Wat zijn Core Modules?

Core modules zijn **verplicht** en worden automatisch ingeladen voor elk project. Ze bevatten de essentiële CouchCMS functionaliteit:

- **Foundation**: Basis CouchCMS patterns en security
- **Content Management**: Content organisatie en structuur
- **Navigation**: Zoeken, paginatie, routing
- **User Features**: Gebruikersbeheer en comments
- **Forms**: DataBound Forms voor CRUD operaties

## Beschikbare Core Modules

- `couchcms-core` - Basis CouchCMS functionaliteit
- `databound-forms` - Formulieren en CRUD
- `custom-routes` - Custom URL routing
- `folders` - Content organisatie
- `archives` - Archive views
- `relationships` - Page relationships
- `repeatable-regions` - Herhaalbare content blokken
- `search` - Zoekfunctionaliteit
- `pagination` - Paginatie
- `comments` - Comment systeem
- `users` - Gebruikersbeheer

## Gebruik

Deze modules worden automatisch ingeladen. Je hoeft ze niet expliciet te configureren in `standards.md`.
```

### `modules/frontend/README.md`

```markdown
# Frontend Modules - Optioneel

Deze modules zijn **optioneel** en kunnen per project worden toegevoegd.

## Wat zijn Frontend Modules?

Frontend modules zijn **optionele technologieën** die de frontend ervaring verbeteren maar niet vereist zijn voor CouchCMS om te werken.

## Beschikbare Frontend Modules

### Styling
- `tailwindcss` - Utility-first CSS framework
- `daisyui` - Component library (vereist TailwindCSS)

### Interactiviteit
- `alpinejs` - Lightweight JavaScript framework
- `typescript` - Type-safe JavaScript

## Gebruik

Voeg modules toe aan `standards.md`:

```yaml
modules:
    - tailwindcss    # Optioneel
    - alpinejs       # Optioneel
```

**Let op**: CouchCMS werkt perfect zonder deze modules. Voeg ze alleen toe als je ze nodig hebt.
```

---

## Voordelen van de Voorgestelde Structuur

### 1. **Duidelijkheid**
- Direct zichtbaar wat core is en wat optioneel is
- Nieuwe ontwikkelaars begrijpen de structuur sneller

### 2. **Onderhoudbaarheid**
- Logische groepering maakt het vinden van modules eenvoudiger
- Categorieën maken het uitbreiden eenvoudiger

### 3. **Schaalbaarheid**
- Nieuwe optionele technologieën kunnen eenvoudig worden toegevoegd
- Core blijft gescheiden van optionele uitbreidingen

### 4. **Documentatie**
- README's in elke categorie verduidelijken het doel
- Visuele indicatoren maken het onderscheid duidelijk

---

## Migratie Plan (Als Optie A Gekozen Wordt)

Als we kiezen voor de volledige herstructurering:

1. **Fase 1**: Nieuwe structuur aanmaken naast oude
2. **Fase 2**: Module loader updaten om beide te ondersteunen
3. **Fase 3**: Migratie script schrijven
4. **Fase 4**: Oude structuur verwijderen na verificatie

---

## Conclusie

**✅ Geïmplementeerd**: Huidige Structuur + Verbeterde Documentatie

### Wat is gedaan:

1. ✅ **README's toegevoegd** aan elke categorie:
   - `modules/core/README.md` - Uitleg over core modules
   - `modules/frontend/README.md` - Uitleg over optionele frontend modules
   - `agents/core/README.md` - Uitleg over core agents
   - `agents/frontend/README.md` - Uitleg over optionele frontend agents
   - `agents/dev-tools/README.md` - Uitleg over dev-tool agents

2. ✅ **Hoofd-README's verbeterd** met:
   - Visuele indicatoren (⚡ voor core, 🎨 voor frontend, 🛠️ voor dev-tools)
   - Duidelijke uitleg over wat core is en wat optioneel is
   - Gebruiksinstructies per categorie

3. ✅ **Geen structuurwijzigingen**:
   - Huidige platte structuur behouden (slechts 1 niveau diepte)
   - Geen extra nesting toegevoegd
   - Geen breaking changes

### Resultaat:

- ✅ **Duidelijk onderscheid** tussen core en optioneel
- ✅ **Eenvoudige structuur** zonder onnodige nesting
- ✅ **Goede documentatie** die het werken vereenvoudigt
- ✅ **Onderhoudbaar** en uitbreidbaar voor de toekomst

De structuur is nu duidelijk georganiseerd met goede documentatie, zonder extra geneste mappen!
