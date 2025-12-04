# Scripts Directory - Gedetailleerde Analyse

**Datum:** 2025-01-28
**Doel:** Identificeren van ongebruikte, verouderde of overbodige bestanden in de `scripts/` directory

---

## Executive Summary

Na een grondige analyse van alle scripts en subdirectories zijn er **3 potentiële kandidaten** geïdentificeerd die mogelijk overbodig zijn geworden. De meeste scripts zijn actief in gebruik en goed gedocumenteerd.

**Totaal scripts geanalyseerd:** 50+
**Scripts die mogelijk verwijderd kunnen worden:** 3
**Scripts die behouden moeten worden:** 47+

---

## 🔴 Potentieel Overbodige Bestanden

### 1. `toolkit-wrapper.js` ⚠️ **WAARSCHUWING - MOGELIJK OVERBODIG**

**Status:** Waarschijnlijk overbodig geworden
**Locatie:** `scripts/toolkit-wrapper.js`
**Grootte:** 45 regels

#### Analyse

**Doel:** Wrapper script om toolkit.js aan te roepen vanuit project root wanneer toolkit als submodule is geïnstalleerd.

**Huidig gebruik:**
- ❌ **Niet in package.json** - Geen npm script die dit gebruikt
- ❌ **Niet geïmporteerd** - Geen andere scripts die dit importeren
- ⚠️ **Alleen eigen error message** - Alleen gerefereerd in zijn eigen error handling
- ⚠️ **Documentatie verwijzingen** - Alleen in docs, maar geen actieve calls

**Waarom mogelijk overbodig:**
1. `toolkit.js` handelt al alle functionaliteit af via `bin/toolkit` entry point
2. `bin/toolkit` doet hetzelfde als `toolkit-wrapper.js` - delegateert naar `toolkit.js`
3. Gebruikers kunnen direct `bun ai-toolkit-shared/scripts/cli/toolkit.js` aanroepen
4. `toolkit.js` detecteert automatisch de toolkit locatie via `getToolkitRootCached()`

**Alternatieven die al bestaan:**
- `bin/toolkit` - Global CLI entry point
- `toolkit.js` - Directe aanroep mogelijk
- `package.json` script - Via `bun run toolkit`

**Impact bij verwijderen:**
- ✅ **Laag risico** - Geen actieve dependencies
- ⚠️ **Documentatie updates nodig** - Verwijzingen in docs moeten worden aangepast
- ✅ **Geen breaking changes** - Geen scripts die hierop vertrouwen

**Aanbeveling:**
- **VERWIJDEREN** - Functionaliteit is volledig overgenomen door `toolkit.js` en `bin/toolkit`
- Update documentatie om verwijzingen naar `toolkit-wrapper.js` te verwijderen

---

### 2. `add-toolkit-script.js` ⚠️ **WAARSCHUWING - MOGELIJK OVERBODIG**

**Status:** Mogelijk overbodig (functionaliteit geïntegreerd)
**Locatie:** `scripts/utils/add-toolkit-script.js`
**Grootte:** 108 regels

#### Analyse

**Doel:** Standalone script om toolkit script toe te voegen aan package.json.

**Huidig gebruik:**
- ✅ **In package.json** - Niet als npm script, maar wel gerefereerd
- ✅ **Documentatie verwijzingen** - In INSTALLATION-GUIDE.md en TROUBLESHOOTING.md
- ⚠️ **Functionaliteit geïntegreerd** - `setup-flow.js` doet dit al automatisch

**Waarom mogelijk overbodig:**
1. `setup-flow.js` vraagt automatisch tijdens setup of gebruiker script wil toevoegen
2. `addToolkitScript()` functie is al beschikbaar in `lib/package-json-utils.js`
3. Gebruikers kunnen dit ook handmatig doen
4. `toolkit.js install` en `toolkit.js setup` bieden deze functionaliteit al

**Waarom mogelijk behouden:**
- ✅ **Standaalone utility** - Handig voor gebruikers die alleen script willen toevoegen zonder setup
- ✅ **Troubleshooting tool** - Kan handig zijn voor debugging
- ✅ **Expliciete controle** - Gebruikers die precies willen weten wat er gebeurt

**Impact bij verwijderen:**
- ⚠️ **Middel risico** - Documentatie verwijst ernaar
- ✅ **Geen breaking changes** - Functionaliteit blijft beschikbaar via setup-flow
- ⚠️ **Minder flexibiliteit** - Geen standalone optie meer

**Aanbeveling:**
- **BEHOUDEN** - Maar markeren als "optional utility"
- Of **VERWIJDEREN** als je vindt dat setup-flow voldoende is
- Update documentatie om duidelijk te maken dat dit optioneel is

---

### 3. `test-branch.sh` ⚠️ **WAARSCHUWING - ZELDEN GEBRUIKT**

**Status:** Development utility, zelden gebruikt
**Locatie:** `scripts/test-branch.sh`
**Grootte:** 61 regels

#### Analyse

**Doel:** Development utility om submodule naar specifieke branch te switchen voor testing.

**Huidig gebruik:**
- ✅ **Gedocumenteerd** - In `docs/TESTING-BRANCHES.md`
- ✅ **In SCRIPTS-CLEANUP-REPORT.md** - Gemarkeerd als "KEEP"
- ⚠️ **Zelden gebruikt** - Alleen voor toolkit developers die verschillende branches testen

**Waarom mogelijk overbodig:**
1. Zeer specifieke use case - alleen voor toolkit developers
2. Kan eenvoudig handmatig worden gedaan met git commands
3. Alleen nuttig wanneer toolkit als submodule wordt gebruikt
4. Mogelijk niet relevant voor meeste gebruikers

**Waarom mogelijk behouden:**
- ✅ **Developer convenience** - Bespaart tijd voor contributors
- ✅ **Goed gedocumenteerd** - Duidelijke use case
- ✅ **Geen schade** - Neemt weinig ruimte in

**Impact bij verwijderen:**
- ✅ **Laag risico** - Alleen developers worden beïnvloed
- ⚠️ **Documentatie updates** - TESTING-BRANCHES.md moet worden aangepast
- ✅ **Geen breaking changes** - Geen scripts die hierop vertrouwen

**Aanbeveling:**
- **BEHOUDEN** - Maar verplaatsen naar `.dev/` of `scripts/dev/` directory
- Of **VERWIJDEREN** als je vindt dat developers dit zelf kunnen doen
- Markeren als "developer-only" utility

---

## ✅ Actief Gebruikte Scripts (Behouden)

### Core Scripts (Root Level)

Alle core scripts zijn essentieel en actief in gebruik:

- ✅ **`init.js`** - Advanced setup wizard (in package.json, veel gebruikt)
- ✅ **`create-standards.js`** - Simple setup wizard (in package.json, veel gebruikt)
- ✅ **`sync.js`** - Generate AI configs (main entry point, kritiek)
- ✅ **`validate.js`** - Validate configuration (in package.json, veel gebruikt)
- ✅ **`migrate.js`** - Migrate old configs (in package.json, nodig voor migraties)
- ✅ **`update.js`** - Check for updates (in package.json, actief gebruikt)
- ✅ **`health.js`** - Health check (in package.json, veel gebruikt)
- ✅ **`browse.js`** - Interactive browser (in package.json, actief gebruikt)
- ✅ **`audit-docs.js`** - Documentation audit (in package.json, gebruikt)
- ✅ **`install.js`** - Installation script (gebruikt in docs, curl downloads)
- ✅ **`reinstall.js`** - Reinstall toolkit (in package.json, gebruikt in README)
- ✅ **`create-module.js`** - Create modules (in package.json, gebruikt)
- ✅ **`create-agent.js`** - Create agents (in package.json, gebruikt)
- ✅ **`toolkit.js`** - Unified CLI entry point (kritiek, veel gebruikt)

### Web Server (`web/`)

**Status:** ✅ **ACTIEF GEBRUIKT**

De web server is volledig functioneel en actief in gebruik:

- ✅ **`web/server.js`** - Main server (gebruikt via `toolkit serve`)
- ✅ **`web/routes/setup.js`** - Setup wizard routes (actief gebruikt)
- ✅ **`web/routes/api.js`** - API endpoints (actief gebruikt)
- ✅ **`web/routes/helpers.js`** - Helper functions (gebruikt door routes)
- ✅ **`web/templates/`** - Alle templates zijn nodig voor wizard interface

**Gebruik:**
- `toolkit serve` command start de web server
- Browser-based setup wizard voor niet-technische gebruikers
- Volledig geïntegreerd in toolkit.js

**Aanbeveling:** ✅ **BEHOUDEN** - Volledig functioneel en actief gebruikt

### Library Modules (`lib/`)

Alle library modules zijn actief gebruikt door core scripts:

- ✅ **Alle 25+ modules** - Actief geïmporteerd en gebruikt
- ✅ **Goed georganiseerd** - Duidelijke scheiding van concerns
- ✅ **Geen redundante code** - Elke module heeft specifieke functie

**Aanbeveling:** ✅ **BEHOUDEN** - Alle modules zijn essentieel

### Maintenance Scripts (`maintenance/`)

**Status:** ✅ **BEHOUDEN** (Developer tools)

- ✅ **`analyze-modules.js`** - Analyze module documentation
- ✅ **`extend-modules.js`** - Extend modules from docs (in package.json)
- ✅ **`validate-modules.js`** - Validate module structure
- ✅ **`fix-modules.js`** - Fix module formatting
- ✅ **`fix-module-code-titles.js`** - Fix code block titles
- ✅ **`fix-agent-sections.js`** - Fix agent sections
- ✅ **`fix-agent-code-titles.js`** - Fix code block titles

**Gebruik:** Developer tools voor onderhoud van modules en agents
**Aanbeveling:** ✅ **BEHOUDEN** - Essentieel voor toolkit onderhoud

### Utility Scripts (`utils/`)

**Status:** ✅ **BEHOUDEN**

- ✅ **`prepare-contribution.js`** - Prepare for contributing (in package.json)
- ✅ **`update-submodule.js`** - Update submodule (in package.json)
- ✅ **`quick-release.js`** - Quick release workflow (in package.json)
- ✅ **`utils.js`** - Shared utilities (gebruikt door andere scripts)

**Aanbeveling:** ✅ **BEHOUDEN** - Alle zijn actief gebruikt

### Git Flow Scripts (`git-flow/`)

**Status:** ✅ **BEHOUDEN**

- ✅ **`main.js`** - Main entry point (in package.json)
- ✅ **`init.js`** - Initialize git-flow (in package.json)
- ✅ **`feature.js`** - Feature workflow (actief gebruikt)
- ✅ **`hotfix.js`** - Hotfix workflow (actief gebruikt)
- ✅ **`release.js`** - Release workflow (actief gebruikt)
- ✅ **`git-wrapper.js`** - Git command wrapper (gebruikt door andere scripts)
- ✅ **`validation.js`** - Git validation (gebruikt door andere scripts)

**Aanbeveling:** ✅ **BEHOUDEN** - Volledig functioneel git-flow workflow

---

## 📊 Impact Analyse

### Verwijderen van `toolkit-wrapper.js`

**Risico:** 🟢 **LAAG**

- Geen actieve dependencies
- Functionaliteit volledig overgenomen door `toolkit.js`
- Alleen documentatie updates nodig

**Acties vereist:**
1. Verwijder bestand
2. Update documentatie (verwijder verwijzingen)
3. Geen andere wijzigingen nodig

---

### Verwijderen van `add-toolkit-script.js`

**Risico:** 🟡 **MIDDEL**

- Documentatie verwijst ernaar
- Functionaliteit blijft beschikbaar via setup-flow
- Mogelijk handig als standalone utility

**Acties vereist:**
1. Verwijder bestand
2. Update documentatie (verwijder of markeer als optioneel)
3. Update INSTALLATION-GUIDE.md en TROUBLESHOOTING.md

---

### Verwijderen van `test-branch.sh`

**Risico:** 🟢 **LAAG**

- Alleen developers worden beïnvloed
- Kan handmatig worden gedaan
- Geen scripts die hierop vertrouwen

**Acties vereist:**
1. Verwijder bestand
2. Update TESTING-BRANCHES.md
3. Geen andere wijzigingen nodig

---

## 🎯 Aanbevelingen per Bestand

### Prioriteit 1: Verwijderen (Laag Risico)

1. **`toolkit-wrapper.js`** ✅ **VERWIJDEREN**
   - Reden: Volledig overbodig, functionaliteit in toolkit.js
   - Impact: Laag
   - Acties: Verwijder + documentatie update

### Prioriteit 2: Overwegen (Middel Risico)

2. **`add-toolkit-script.js`** ⚠️ **OVERWEGEN**
   - Reden: Functionaliteit geïntegreerd, maar mogelijk handig als standalone
   - Impact: Middel
   - Opties:
     - **A)** Verwijderen - setup-flow is voldoende
     - **B)** Behouden - maar markeren als "optional utility"

### Prioriteit 3: Behouden of Verplaatsen (Laag Risico)

3. **`test-branch.sh`** ⚠️ **BEHOUDEN OF VERPLAATSEN**
   - Reden: Developer utility, zelden gebruikt
   - Impact: Laag
   - Opties:
     - **A)** Behouden - maar verplaatsen naar `.dev/` of `scripts/dev/`
     - **B)** Verwijderen - developers kunnen dit zelf doen

---

## 📋 Actieplan

### Optie A: Conservatief (Aanbevolen)

1. ✅ **Verwijder `toolkit-wrapper.js`** - Duidelijk overbodig
2. ⚠️ **Behoud `add-toolkit-script.js`** - Maar markeer als "optional utility"
3. ⚠️ **Behoud `test-branch.sh`** - Maar verplaats naar `scripts/dev/`

**Resultaat:** 1 bestand verwijderd, 2 behouden maar beter georganiseerd

---

### Optie B: Agressief

1. ✅ **Verwijder `toolkit-wrapper.js`**
2. ✅ **Verwijder `add-toolkit-script.js`** - Functionaliteit in setup-flow
3. ✅ **Verwijder `test-branch.sh`** - Developers kunnen dit zelf doen

**Resultaat:** 3 bestanden verwijderd, documentatie updates nodig

---

### Optie C: Behoud Alles

1. ⚠️ **Behoud alles** - Maar organiseer beter
2. ⚠️ **Verplaats `test-branch.sh`** naar `scripts/dev/`
3. ⚠️ **Markeer `add-toolkit-script.js`** als "optional utility"

**Resultaat:** Geen verwijderingen, alleen reorganisatie

---

## ✅ Conclusie

De `scripts/` directory is over het algemeen **goed georganiseerd** met weinig overbodige bestanden. Er zijn **3 kandidaten** geïdentificeerd die mogelijk overbodig zijn:

1. **`toolkit-wrapper.js`** - **Zeker verwijderen** (volledig overbodig)
2. **`add-toolkit-script.js`** - **Overwegen** (functionaliteit geïntegreerd)
3. **`test-branch.sh`** - **Behouden of verplaatsen** (developer utility)

**Aanbevolen actie:** Optie A (Conservatief) - Verwijder alleen `toolkit-wrapper.js`, behoud de andere maar organiseer beter.

---

**Laatste update:** 2025-01-28
**Status:** ✅ **GEÏMPLEMENTEERD** - Optie A (Conservatief) uitgevoerd

## ✅ Implementatie Voltooid

**Uitgevoerde acties:**

1. ✅ **`toolkit-wrapper.js` verwijderd** - Bestand is verwijderd (volledig overbodig)
2. ✅ **`add-toolkit-script.js` gemarkeerd als optional** - Header bijgewerkt met note dat het een optional utility is
3. ✅ **`test-branch.sh` verplaatst** - Verplaatst naar `scripts/dev/test-branch.sh`
4. ✅ **`scripts/dev/` directory aangemaakt** - Nieuwe directory voor developer utilities
5. ✅ **Documentatie bijgewerkt:**
   - `scripts/README.md` - Toegevoegd dev/ en web/ directories, optional utilities sectie
   - `scripts/dev/README.md` - Nieuwe README voor developer utilities
   - `docs/TESTING-BRANCHES.md` - Pad bijgewerkt naar `scripts/dev/test-branch.sh`

**Resultaat:** 1 bestand verwijderd, 2 bestanden behouden maar beter georganiseerd
