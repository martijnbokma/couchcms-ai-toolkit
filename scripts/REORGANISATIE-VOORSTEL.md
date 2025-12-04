# Scripts Directory Reorganisatie Voorstel

**Datum:** 2025-12-01
**Doel:** Logischere en overzichtelijkere indeling van de `scripts/` directory

---

## 📊 Huidige Situatie Analyse

### Huidige Structuur

```
scripts/
├── [13 root-level scripts]          # Teveel door elkaar
├── lib/                              # ✅ Goed georganiseerd
├── maintenance/                      # ✅ Goed georganiseerd
├── utils/                            # ✅ Goed georganiseerd
├── dev/                              # ✅ Goed georganiseerd
├── git-flow/                         # ✅ Goed georganiseerd
├── SCRIPTS-ANALYSIS-REPORT.md        # Analyse document
└── SCRIPTS-CLEANUP-REPORT.md         # Analyse document
```

### Problemen

1. **Teveel scripts op root niveau** (13 scripts)
   - Onduidelijk welke voor eindgebruikers zijn vs developers
   - Moeilijk te vinden wat je zoekt
   - Geen logische groepering

2. **Onduidelijke scheiding**
   - User-facing scripts staan tussen developer tools
   - Geen duidelijke categorieën

3. **Analyse documenten in scripts/**
   - `SCRIPTS-ANALYSIS-REPORT.md` en `SCRIPTS-CLEANUP-REPORT.md` zijn historische analyses
   - Horen beter thuis in `docs/` of kunnen verwijderd worden

4. **`add-toolkit-script.js`**
   - Standalone utility die beter in `utils/` past
   - Nu tussen user-facing scripts

---

## 🎯 Voorgestelde Nieuwe Structuur

### Principe: Categorisatie op Doelgroep en Functie

```
scripts/
├── cli/                              # 🆕 User-facing CLI commands
│   ├── toolkit.js                    # Unified CLI entry point
│   ├── init.js                       # Advanced setup wizard
│   ├── create-standards.js           # Simple setup wizard
│   ├── sync.js                       # Generate AI configs
│   ├── validate.js                   # Validate configuration
│   ├── migrate.js                    # Migrate old configs
│   ├── update.js                     # Check for updates
│   ├── health.js                     # Health check
│   ├── browse.js                     # Interactive browser
│   ├── install.js                    # Installation script
│   └── reinstall.js                  # Reinstall toolkit
│
├── create/                           # 🆕 Content creation scripts
│   ├── create-module.js
│   ├── create-agent.js
│   └── audit-docs.js                 # Documentation audit
│
├── lib/                              # ✅ Blijft zoals het is
│   └── [alle library modules]
│
├── maintenance/                      # ✅ Blijft zoals het is
│   └── [module/agent maintenance]
│
├── utils/                            # ✅ Uitgebreid
│   ├── add-toolkit-script.js         # 🔄 Verplaatst van root
│   ├── prepare-contribution.js
│   ├── update-submodule.js
│   └── quick-release.js
│
├── dev/                              # ✅ Blijft zoals het is
│   └── [developer utilities]
│
├── git-flow/                         # ✅ Blijft zoals het is
│   └── [git workflow scripts]
│
└── README.md                         # ✅ Bijgewerkt met nieuwe structuur
```

---

## 📋 Gedetailleerde Wijzigingen

### 1. Nieuwe Directory: `cli/` (User-Facing Commands)

**Doel:** Alle scripts die eindgebruikers direct aanroepen

**Scripts die hiernaartoe verplaatsen:**
- `toolkit.js` → `cli/toolkit.js`
- `init.js` → `cli/init.js`
- `create-standards.js` → `cli/create-standards.js`
- `sync.js` → `cli/sync.js`
- `validate.js` → `cli/validate.js`
- `migrate.js` → `cli/migrate.js`
- `update.js` → `cli/update.js`
- `health.js` → `cli/health.js`
- `browse.js` → `cli/browse.js`
- `install.js` → `cli/install.js`
- `reinstall.js` → `cli/reinstall.js`

**Voordelen:**
- ✅ Duidelijke scheiding tussen CLI en developer tools
- ✅ Makkelijk te vinden voor eindgebruikers
- ✅ Consistent met moderne CLI tooling patterns

### 2. Nieuwe Directory: `create/` (Content Creation)

**Doel:** Scripts voor het creëren van nieuwe content (modules, agents, docs)

**Scripts die hiernaartoe verplaatsen:**
- `create-module.js` → `create/create-module.js`
- `create-agent.js` → `create/create-agent.js`
- `audit-docs.js` → `create/audit-docs.js`

**Voordelen:**
- ✅ Logische groepering van "create" functionaliteit
- ✅ Duidelijke naamgeving
- ✅ Makkelijk uitbreidbaar voor nieuwe create scripts

### 3. Uitbreiden: `utils/` (Utilities)

**Scripts die hiernaartoe verplaatsen:**
- `add-toolkit-script.js` → `utils/add-toolkit-script.js`

**Voordelen:**
- ✅ Past beter bij andere utilities
- ✅ Duidelijke categorie

### 4. Verwijderen/Verplaatsen: Analyse Documenten

**Opties:**
- **Optie A:** Verplaatsen naar `docs/scripts/`
- **Optie B:** Verwijderen (zijn historische analyses)

**Aanbeveling:** Optie A - behouden voor referentie maar verplaatsen naar docs

**Bestanden:**
- `SCRIPTS-ANALYSIS-REPORT.md` → `docs/scripts/SCRIPTS-ANALYSIS-REPORT.md`
- `SCRIPTS-CLEANUP-REPORT.md` → `docs/scripts/SCRIPTS-CLEANUP-REPORT.md`

---

## 🔄 Impact Analyse

### Bestanden die Verwijzingen Moeten Aanpassen

1. **`package.json`** - Alle script paths moeten worden bijgewerkt
   ```json
   "scripts": {
     "toolkit": "bun scripts/cli/toolkit.js",
     "init": "bun scripts/cli/init.js",
     "create": "bun scripts/cli/create-standards.js",
     "sync": "bun scripts/cli/sync.js",
     // etc.
   }
   ```

2. **`bin/toolkit`** - Moet verwijzen naar nieuwe locatie
   ```bash
   # Van: scripts/toolkit.js
   # Naar: scripts/cli/toolkit.js
   ```

3. **Documentatie** - Alle docs die naar scripts verwijzen
   - `docs/INSTALLATION-GUIDE.md`
   - `docs/QUICK-START-BEGINNER.md`
   - `README.md`
   - `scripts/README.md`

4. **Interne Script Imports** - Scripts die andere scripts aanroepen
   - `toolkit.js` roept andere scripts aan
   - `setup-flow.js` roept scripts aan

### Risico's

- 🟡 **Middel risico** - Veel bestanden moeten worden aangepast
- 🟢 **Geen breaking changes** - Alleen interne reorganisatie
- 🟢 **Backward compatible** - Via package.json scripts blijft alles werken

---

## ✅ Voordelen van Nieuwe Structuur

### Voor Eindgebruikers

1. **Duidelijke CLI Commands**
   - Alle user-facing scripts in één directory (`cli/`)
   - Makkelijk te vinden en te begrijpen

2. **Logische Groepering**
   - `create/` voor content creation
   - `cli/` voor dagelijks gebruik
   - `utils/` voor utilities

3. **Betere Documentatie**
   - Duidelijke README per directory
   - Makkelijker om te navigeren

### Voor Developers

1. **Betere Organisatie**
   - Duidelijke scheiding tussen user-facing en developer tools
   - Makkelijker om nieuwe scripts toe te voegen

2. **Consistente Structuur**
   - Elke directory heeft een duidelijk doel
   - Makkelijker voor nieuwe teamleden

3. **Schaalbaarheid**
   - Nieuwe categorieën kunnen eenvoudig worden toegevoegd
   - Geen chaos op root niveau

---

## 📝 Implementatie Plan

### Fase 1: Voorbereiding
1. ✅ Analyse document opstellen (dit document)
2. ⏳ Goedkeuring verkrijgen
3. ⏳ Backup maken van huidige structuur

### Fase 2: Directory Structuur
1. ⏳ Nieuwe directories aanmaken (`cli/`, `create/`)
2. ⏳ Scripts verplaatsen naar nieuwe locaties
3. ⏳ `add-toolkit-script.js` verplaatsen naar `utils/`

### Fase 3: Updates
1. ⏳ `package.json` scripts bijwerken
2. ⏳ `bin/toolkit` bijwerken
3. ⏳ Interne imports bijwerken
4. ⏳ Documentatie bijwerken

### Fase 4: Verificatie
1. ⏳ Alle scripts testen
2. ⏳ Documentatie controleren
3. ⏳ README bijwerken

### Fase 5: Cleanup
1. ⏳ Analyse documenten verplaatsen naar `docs/scripts/`
2. ⏳ Oude verwijzingen opruimen

---

## 🎯 Alternatieve Structuur (Optie B)

Als `cli/` te specifiek is, kunnen we ook kiezen voor:

```
scripts/
├── commands/                         # In plaats van cli/
│   └── [user-facing commands]
├── create/                          # Blijft hetzelfde
└── ...
```

**Voordeel:** Meer generieke naam
**Nadeel:** Minder duidelijk dat het CLI commands zijn

**Aanbeveling:** `cli/` is duidelijker en moderner

---

## ❓ Vragen voor Goedkeuring

1. **Akkoord met nieuwe structuur?**
   - `cli/` voor user-facing commands
   - `create/` voor content creation
   - `utils/` uitgebreid met `add-toolkit-script.js`

2. **Analyse documenten:**
   - Verplaatsen naar `docs/scripts/` of verwijderen?

3. **Implementatie:**
   - Direct implementeren of eerst testen?

---

## 📊 Samenvatting

**Huidige situatie:**
- 13 scripts op root niveau
- Onduidelijke structuur
- Moeilijk te navigeren

**Voorgestelde structuur:**
- `cli/` - 11 user-facing commands
- `create/` - 3 content creation scripts
- `utils/` - 4 utility scripts
- Duidelijke categorieën en scheiding

**Impact:**
- Veel bestanden moeten worden bijgewerkt
- Geen breaking changes voor eindgebruikers
- Betere organisatie en schaalbaarheid

**Aanbeveling:** ✅ **Implementeren** - De voordelen wegen op tegen de migratie-inspanning
