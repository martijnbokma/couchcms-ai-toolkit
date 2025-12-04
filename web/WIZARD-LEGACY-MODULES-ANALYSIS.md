# Wizard Legacy Modules Analyse - TypeScript Migratie

**Datum**: 2025-01-27
**Vraag**: Heeft het zin om `wizard/` directory naar TypeScript om te zetten?

---

## 📋 Executive Summary

**Conclusie**: **Ja, maar met nuances**

### Opties:
1. ✅ **Migreren naar TypeScript** - Voor consistentie en type safety
2. ⚠️ **Verwijderen uit build** - Als nieuwe modules volledig werken
3. ⏸️ **Behouden zoals het is** - Conservatief (maar inconsistent)

**Aanbeveling**: **Migreer naar TypeScript voor consistentie**, maar overweeg later te verwijderen als nieuwe modules volledig bewezen zijn.

---

## 🔍 Huidige Situatie

### Legacy Modules (`wizard/` directory)
- `wizard/navigation.js` (145 regels)
- `wizard/form-restore.js` (262 regels)
- `wizard/form-sync.js` (269 regels)
- `wizard/init.js` (298 regels)

**Totaal**: ~974 regels JavaScript

### Nieuwe TypeScript Modules (`core/` directory)
- `wizard-navigation.ts` - ✅ Vervangt `wizard/navigation.js`
- `form-state-sync.ts` - ✅ Vervangt `wizard/form-restore.js` + `wizard/form-sync.js`
- `wizard-init.ts` - ✅ Vervangt `wizard/init.js`

**Status**: Nieuwe modules hebben backward compatibility functies

---

## 📊 Functionaliteit Vergelijking

### 1. Navigation

#### Legacy: `wizard/navigation.js`
- ✅ `navigateToStep(stepNum, route, setupType)` - Function
- ✅ `goBack(backRoute)` - Function
- ✅ `determineBackRoute(setupType)` - Function (uniek!)
- Gebruikt: `WizardState` (legacy)

#### Nieuw: `wizard-navigation.ts`
- ✅ `navigateToStep()` - Method (met backward compat wrapper)
- ✅ `navigateBack()` - Method (met backward compat wrapper)
- ❌ `determineBackRoute()` - **NIET aanwezig** (maar wel fallback check)
- Gebruikt: `wizardStateManager` (nieuw)

**Unieke Functionaliteit Legacy**:
- `determineBackRoute()` functie met route mapping logic

**Impact**: ⚠️ **Medium** - Nieuwe module heeft fallback naar legacy functie

---

### 2. Form Restore

#### Legacy: `wizard/form-restore.js`
- ✅ `restoreFormSelections(form)` - Function
- ✅ `restoreProjectField()` - Helper
- ✅ `restoreCheckboxField()` - Helper
- ✅ `restoreRadioField()` - Helper
- ✅ `restoreFrameworkOptions()` - Helper

#### Nieuw: `form-state-sync.ts`
- ✅ `restoreStateToForm(form)` - Method
- ✅ `applyStateToForm(form, state)` - Method
- ✅ Bidirectional sync (form ↔ state)
- ✅ Betere error handling

**Overlap**: ~95% - Nieuw is beter en completer

---

### 3. Form Sync

#### Legacy: `wizard/form-sync.js`
- ✅ `syncAndRestoreState()` - Async function
- ✅ `waitForCheckboxes()` - Promise-based waiting
- ✅ HTMX swap handling

#### Nieuw: `form-state-sync.ts`
- ✅ Geïntegreerd in class
- ✅ Betere timing
- ✅ Form listeners per form

**Overlap**: ~90% - Nieuw is geïntegreerd

---

### 4. Initialization

#### Legacy: `wizard/init.js`
- ✅ Setup type initialization
- ✅ Form submission handlers
- ✅ HTMX event listeners

#### Nieuw: `wizard-init.ts`
- ✅ Improved initialization
- ✅ Better cleanup
- ✅ More robust event handling

**Overlap**: ~85% - Nieuw is verbeterd

---

## 🎯 Belangrijkste Verschil: `determineBackRoute()`

### Legacy Implementatie
```javascript
function determineBackRoute(setupType) {
    // Route mapping logic
    // Form action detection
    // Step-specific routing
    return route
}
```

### Nieuw Module
- ❌ Heeft deze functie **niet**
- ✅ Heeft wel fallback check: `if (typeof window.determineBackRoute === 'function')`
- ✅ Nieuwe module gebruikt `getPreviousStep()` in plaats daarvan

**Impact**: Nieuwe module kan fallback gebruiken naar legacy functie als beschikbaar

---

## ✅ Aanbeveling

### **Optie A: Migreren naar TypeScript** ✅ (Aanbevolen)

**Redenen**:
1. ✅ **Consistentie** - Volledige codebase in TypeScript
2. ✅ **Type Safety** - Ook voor legacy code
3. ✅ **Lage Risico** - Geen breaking changes
4. ✅ **Makkelijk Onderhoud** - Eén taal, één patroon
5. ✅ **Future-Proof** - Makkelijker te verwijderen later

**Tijd**: ~2-3 uur
**Risico**: **Low**

---

### **Optie B: Verwijderen uit Build** ⚠️ (Later Overwegen)

**Voordelen**:
- ✅ Kleinere bundle (~10-15 KB)
- ✅ Minder duplicatie
- ✅ Cleaner codebase

**Risico's**:
- ⚠️ `determineBackRoute()` wordt mogelijk nog gebruikt
- ⚠️ Mogelijk backward compatibility issues
- ⚠️ Vereist uitgebreide testing

**Wanneer**: Na volledige testing dat nieuwe modules alle use cases dekken

**Tijd**: ~1-2 dagen (incl. testing)
**Risico**: **Medium**

---

## 🎯 Finale Aanbeveling

### **Migreer naar TypeScript** ✅

**Plan**:
1. **Nu**: Migreer alle `wizard/*.js` naar `wizard/*.ts`
   - Consistentie met rest van codebase
   - Type safety ook voor legacy code
   - Makkelijker te onderhouden

2. **Later**: Test of legacy modules nog nodig zijn
   - Als nieuwe modules volledig werken
   - Verwijder dan uit build (niet uit repo voor backup)
   - Of migreer unieke features naar nieuwe modules

**Voordelen**:
- ✅ Volledige TypeScript codebase
- ✅ Type safety voor alles
- ✅ Geen breaking changes
- ✅ Flexibel: kan later verwijderd worden

---

## 📈 Impact

### Bundle Grootte
- **Huidig**: 142.16 KB
- **Na migratie**: ~142 KB (geen significante verandering)
- **Na verwijderen**: ~130 KB (later, als ze niet meer nodig zijn)

### Tijd
- **Migratie**: 2-3 uur
- **Testing**: 30 minuten
- **Totaal**: ~3-4 uur

### Risico
- **Technisch**: **Low** - Geen breaking changes
- **Functionaliteit**: **None** - Code blijft identiek

---

## ✅ Conclusie

**Ja, het heeft zin om `wizard/` naar TypeScript om te zetten!**

### Waarom:
1. ✅ **Consistentie** - Alle code in TypeScript
2. ✅ **Type Safety** - Ook voor legacy code
3. ✅ **Lage Risico** - Geen breaking changes
4. ✅ **Future-Proof** - Makkelijker te onderhouden/verwijderen

### Aanpak:
1. **Migreer nu** voor consistentie en type safety
2. **Test later** of legacy modules nog nodig zijn
3. **Verwijder later** (optioneel) als nieuwe modules volledig werken

---

**Status**: ⏳ Wachten op goedkeuring om te beginnen
