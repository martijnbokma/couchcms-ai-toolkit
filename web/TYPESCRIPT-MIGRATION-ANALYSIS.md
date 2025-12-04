# TypeScript Migratie Analyse - web/assets/js

**Datum**: 2025-01-27
**Status**: Analyse - Wachten op goedkeuring

---

## 📋 Executive Summary

**Conclusie**: TypeScript migratie is **haalbaar** maar vereist **significante aanpassingen** aan de build pipeline en code structuur. De migratie levert voordelen op voor type safety en onderhoudbaarheid, maar er zijn enkele uitdagingen rondom globale variabelen en de huidige bundling strategie.

**Aanbeveling**: Gefaseerde migratie startend met core modules, gevolgd door wizard modules.

---

## 🔍 Huidige Situatie

### Bestandsstructuur

```
web/assets/js/
├── core/              # 9 bestanden - Core functionaliteit
├── wizard/            # 4 bestanden - Wizard-specifieke modules
├── steps/             # 2 bestanden - Step handlers
├── base/              # 1 bestand - Basis functionaliteit
└── [root]             # 5 bestanden - Legacy/init scripts
```

**Totaal**: ~31 JavaScript bestanden

### Code Patronen

1. **IIFE Pattern** (Immediately Invoked Function Expression)
   ```javascript
   (function() {
       'use strict'
       // Code hier
       window.ModuleName = ModuleName
   })()
   ```

2. **Globale Variabelen** (196+ `window.` referenties)
   - Modules exporteren via `window.ModuleName`
   - Dependencies worden gecheckt via `window.dependencyName`
   - State wordt gedeeld via `window.wizardStateManager`

3. **Build Strategie**
   - Simpele concatenatie van bestanden in volgorde
   - Geen module bundler (geen ES modules)
   - Geen tree-shaking mogelijk

4. **Server-side Code**
   - `web/server/` gebruikt al ES modules (`import/export`)
   - `web/scripts/` gebruikt Bun met ES modules
   - Alleen client-side code gebruikt IIFE pattern

---

## ✅ Voordelen van TypeScript Migratie

### 1. Type Safety
- **Probleem nu**: Geen type checking voor `window.*` globals
- **Oplossing**: Type definitions voor globale interfaces
- **Impact**: Minder runtime errors, betere IDE support

### 2. Betere Developer Experience
- Autocomplete voor `window.wizardStateManager` properties
- Refactoring veiliger (rename werkt across files)
- IntelliSense voor complexe objecten

### 3. Documentatie via Types
- Types dienen als inline documentatie
- Interfaces maken contracts expliciet
- Minder JSDoc nodig

### 4. Build-time Error Detection
- Type errors worden gevonden tijdens build, niet runtime
- Betere foutmeldingen dan JavaScript

---

## ⚠️ Uitdagingen en Risico's

### 1. **Globale Variabelen Pattern** (Hoog Risico)

**Probleem**:
- 196+ `window.*` referenties
- Modules zijn niet geïsoleerd
- Dependencies worden runtime gecheckt

**Impact**:
- TypeScript heeft geen native support voor `window.*` globals
- Vereist type declarations voor alle globale interfaces
- Dependency checking moet anders (compile-time vs runtime)

**Oplossing**:
```typescript
// globals.d.ts
declare global {
    interface Window {
        wizardStateManager: WizardStateManager
        formStateSync: FormStateSync
        wizardNavigation: WizardNavigation
        WIZARD_CONFIG: WizardConfig
        // ... etc
    }
}
```

**Complexiteit**: Medium - Veel type definitions nodig

---

### 2. **Build Pipeline Aanpassing** (Medium Risico)

**Huidige Build** (`web/scripts/build.js`):
- Simpele file concatenatie
- Geen transpilatie
- Geen bundling tool

**Vereiste Wijzigingen**:
1. TypeScript compiler toevoegen (`tsc` of `bun build`)
2. Type checking tijdens build
3. Source maps genereren
4. Output naar `.js` voor browser compatibiliteit

**Oplossing**:
```javascript
// Nieuwe build.js
import { build } from 'bun'

await build({
    entrypoints: ['src/core/constants.ts'],
    outdir: 'dist/js',
    target: 'browser',
    format: 'iife', // Of 'esm' als we naar modules migreren
})
```

**Complexiteit**: Medium - Build script moet volledig herschreven worden

---

### 3. **Module System Migratie** (Optioneel maar Aanbevolen)

**Huidige**: IIFE pattern, geen modules
**Optie A**: Blijven bij IIFE (eenvoudiger)
**Optie B**: Migreren naar ES modules (beter voor toekomst)

**Optie A - IIFE met TypeScript**:
```typescript
(function() {
    'use strict'
    const module: ModuleType = {
        // ...
    }
    window.ModuleName = module
})()
```

**Optie B - ES Modules**:
```typescript
// constants.ts
export const WIZARD_CONFIG = { ... }

// wizard-init.ts
import { WIZARD_CONFIG } from './constants.js'
```

**Aanbeveling**: Start met Optie A (IIFE), migreer later naar Optie B

**Complexiteit**:
- Optie A: Low-Medium
- Optie B: High (vereist volledige refactor)

---

### 4. **Dependency Checking** (Low Risico)

**Huidige**:
```javascript
if (!window.wizardStateManager) {
    console.error('[Module] Dependency not available')
    return
}
```

**TypeScript**:
- Compile-time checking via imports
- Runtime checks kunnen blijven voor graceful degradation

**Oplossing**: Combinatie van beide
```typescript
// Compile-time check
import { wizardStateManager } from './state-manager'

// Runtime check (voor backward compatibility)
if (!window.wizardStateManager) {
    console.error('[Module] Dependency not available')
    return
}
```

**Complexiteit**: Low

---

### 5. **Browser Compatibility** (Low Risico)

**TypeScript compileert naar ES5/ES2015+**
- Geen probleem voor moderne browsers
- Source maps voor debugging
- Output is gewoon JavaScript

**Complexiteit**: Low

---

### 6. **Server-side Code** (Geen Risico)

**Status**: Server code gebruikt al ES modules
**Impact**: Geen migratie nodig voor `web/server/`
**Aanbeveling**: Server code kan TypeScript blijven gebruiken zoals het is

---

## 📊 Migratie Strategie

### Fase 1: Setup & Core Modules (Week 1)

**Doel**: TypeScript tooling opzetten en eerste modules migreren

**Taken**:
1. ✅ TypeScript installeren (`typescript` als dev dependency)
2. ✅ `tsconfig.json` configureren
3. ✅ Globale type definitions maken (`globals.d.ts`)
4. ✅ Build script aanpassen voor TypeScript
5. ✅ Core modules migreren:
   - `constants.ts` (eenvoudigste)
   - `dom.ts`
   - `state.ts`
   - `wizard-state-manager.ts`

**Risico**: Low-Medium
**Tijd**: 2-3 dagen

---

### Fase 2: Wizard Modules (Week 2)

**Doel**: Wizard-specifieke modules migreren

**Taken**:
1. ✅ `form-state-sync.ts`
2. ✅ `wizard-navigation.ts`
3. ✅ `wizard-init.ts`
4. ✅ `htmx.ts`

**Risico**: Medium
**Tijd**: 3-4 dagen

---

### Fase 3: Step Modules & Legacy (Week 3)

**Doel**: Overige modules migreren en cleanup

**Taken**:
1. ✅ `steps/advanced.ts`
2. ✅ `steps/review.ts`
3. ✅ `wizard/` modules
4. ✅ Legacy scripts (`wizard-init.js`, etc.)
5. ✅ Cleanup: verwijder oude `.js` bestanden

**Risico**: Low
**Tijd**: 2-3 dagen

---

### Fase 4: Optimalisatie (Optioneel)

**Doel**: Verbeter build en developer experience

**Taken**:
1. ⚠️ Overweeg ES modules migratie
2. ⚠️ Tree-shaking implementeren
3. ⚠️ Code splitting voor betere performance
4. ⚠️ Strict mode type checking

**Risico**: Low
**Tijd**: 1-2 weken (optioneel)

---

## 🛠️ Technische Vereisten

### Nieuwe Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/bun": "latest"
  }
}
```

### TypeScript Configuratie

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist/js",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Build Script Aanpassing

**Huidige**: File concatenatie
**Nieuw**: TypeScript compiler + bundling

**Opties**:
1. **Bun build** (aanbevolen - al in gebruik)
2. **tsc** + custom bundler
3. **esbuild** (snel, modern)

---

## 📝 Type Definitions Voorbeeld

### globals.d.ts

```typescript
// Globale type definitions voor window object
declare global {
    interface Window {
        // Config
        WIZARD_CONFIG: {
            STORAGE_KEY: string
            DEFAULT_PROJECT_NAME: string
            DEFAULT_PROJECT_DESCRIPTION: string
            DEFAULT_SETUP_TYPE: 'simple' | 'extended'
            DEBOUNCE_DELAY: number
            SYNC_DELAY: number
            INITIAL_RESTORE_DELAY: number
        }

        WIZARD_CONSTANTS: {
            INVALID_VALUES: string[]
            FRAMEWORK_OPTIONS: string[]
            WIZARD_CONTENT_ID: string
            CHECKBOX_FIELDS: string[]
            FIELD_NAMES: {
                PROJECT_NAME: string
                PROJECT_DESCRIPTION: string
                SETUP_TYPE: string
                PRESET: string
                FRAMEWORK: string
                CONTEXT_DIR: string
            }
        }

        // Managers
        wizardStateManager: WizardStateManager
        formStateSync: FormStateSync
        wizardNavigation: WizardNavigation

        // Utils
        DOMUtils: DOMUtils
        HTMXUtils: HTMXUtils

        // State
        WizardState: typeof WizardState

        // Legacy functions
        selectAllEditors?: () => void
        deselectAllEditors?: () => void
        toggleInfo?: (infoId: string, button?: HTMLElement) => void
        updateFrameworkVisibility?: () => void
        handleAdvancedSubmit?: (event: Event) => boolean
        editStep?: (button: HTMLElement) => void
        navigateToStep?: (stepNum: number, route: string, setupType: string) => void

        // Flags
        __WIZARD_INIT_V2_INITIALIZED__?: boolean
        __WIZARD_INIT_INITIALIZED__?: boolean
    }
}

export {}
```

---

## ⚡ Quick Wins

### Directe Voordelen na Migratie

1. **Type Safety voor State**
   ```typescript
   // Nu: Geen type checking
   stateManager.update({ currentStep: "invalid" }) // Runtime error

   // Na: Compile-time error
   stateManager.update({ currentStep: "invalid" }) // ❌ Type error
   ```

2. **Autocomplete voor Complex Objects**
   ```typescript
   // Nu: Geen autocomplete
   window.wizardStateManager.load().currentStep // ❓

   // Na: Volledige autocomplete
   window.wizardStateManager.load().currentStep // ✅ IntelliSense
   ```

3. **Refactoring Veiligheid**
   - Rename werkt across files
   - Find references is accuraat
   - Type errors voorkomen breaking changes

---

## 🚨 Potentiële Problemen

### 1. **Runtime Dependency Checks**

**Probleem**: Modules checken runtime of dependencies bestaan
**Impact**: TypeScript kan dit niet garanderen
**Oplossing**: Runtime checks blijven, maar TypeScript geeft compile-time warnings

---

### 2. **Legacy Code Integratie**

**Probleem**: Sommige bestanden zijn legacy en worden mogelijk niet meer gebruikt
**Impact**: Migratie van ongebruikte code is tijdverspilling
**Oplossing**: Eerst audit welke bestanden echt gebruikt worden

---

### 3. **Build Performance**

**Probleem**: TypeScript compilation kan langzamer zijn dan concatenatie
**Impact**: Langere build tijden
**Oplossing**: Incremental builds, caching, parallel compilation

---

### 4. **Browser Compatibility**

**Probleem**: TypeScript compileert naar modern JavaScript
**Impact**: Mogelijk problemen met oude browsers
**Oplossing**: Target ES2020 is veilig voor alle moderne browsers

---

## 📈 Geschatte Impact

### Tijd Investering

- **Setup & Configuratie**: 1 dag
- **Fase 1 (Core)**: 2-3 dagen
- **Fase 2 (Wizard)**: 3-4 dagen
- **Fase 3 (Steps & Legacy)**: 2-3 dagen
- **Testing & Bugfixes**: 2-3 dagen

**Totaal**: ~2-3 weken

### Risico Niveau

- **Technisch Risico**: Medium
- **Breaking Changes Risico**: Low (output is nog steeds JavaScript)
- **Performance Risico**: Low (geen runtime overhead)

### ROI (Return on Investment)

- **Korte Termijn**: Betere developer experience, minder bugs
- **Lange Termijn**: Makkelijker onderhoud, betere code kwaliteit

---

## ✅ Aanbevelingen

### Doen ✅

1. **Start met gefaseerde migratie** - Begin met core modules
2. **Behoud IIFE pattern** - Migreer eerst, refactor later
3. **Maak uitgebreide type definitions** - Voor alle globale interfaces
4. **Test grondig** - Elke fase moet volledig werken voordat je verder gaat
5. **Documenteer type contracts** - Maak duidelijk welke types verwacht worden

### Niet Doen ❌

1. **Niet alles tegelijk migreren** - Te groot risico
2. **Geen ES modules migratie tijdens eerste fase** - Te complex
3. **Geen strict mode direct** - Begin met `strict: false`, verhoog geleidelijk
4. **Geen breaking changes** - Output moet backward compatible blijven

---

## 🎯 Conclusie

**TypeScript migratie is haalbaar en aanbevolen**, maar vereist:

1. ✅ **Planning**: Gefaseerde aanpak
2. ✅ **Tooling**: TypeScript + build pipeline aanpassing
3. ✅ **Type Definitions**: Uitgebreide globale type definitions
4. ✅ **Testing**: Grondige testing per fase

**Grootste Uitdaging**: Globale variabelen pattern (196+ referenties)
**Grootste Voordeel**: Type safety en betere developer experience

**Aanbeveling**: **Start met Fase 1** (Setup & Core) om te valideren of de aanpak werkt voordat je verder gaat.

---

## 📋 Volgende Stappen (Na Goedkeuring)

1. ✅ TypeScript installeren en configureren
2. ✅ `tsconfig.json` aanmaken
3. ✅ `globals.d.ts` met alle type definitions
4. ✅ Build script aanpassen voor TypeScript
5. ✅ Eerste module migreren (`constants.ts`) als proof of concept
6. ✅ Testen en valideren
7. ✅ Rest van Fase 1 uitvoeren

---

**Status**: ⏳ Wachten op goedkeuring om te beginnen met implementatie

