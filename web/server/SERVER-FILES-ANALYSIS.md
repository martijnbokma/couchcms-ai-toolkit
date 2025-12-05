# Server Bestanden Analyse

**Datum**: 2025-01-27
**Vraag**: Wat doen we met `server.js` en `live-reload.js`?

---

## 📁 Huidige Situatie

### Bestanden in `web/server/`

| Bestand | Regels | Type | Status | Gebruikt? |
|---------|--------|------|--------|-----------|
| `server.ts` | 253 | TypeScript | ✅ Actief | ✅ Ja |
| `server.js` | 263 | JavaScript | ⚠️ Duplicaat? | ❓ Onbekend |
| `live-reload.js` | 134 | JavaScript | ✅ Actief | ✅ Ja |

---

## 🔍 Analyse

### server.js vs server.ts

**Belangrijkste verschillen:**

1. **TypeScript Types**
   - ✅ `server.ts` heeft TypeScript interfaces en types
   - ❌ `server.js` heeft alleen JSDoc comments

2. **Import statements**
   - `server.ts`: `import { setupRoutes } from './routes/setup'`
   - `server.js`: `import { setupRoutes } from './routes/setup.ts'` (expliciete `.ts`)

3. **Type annotations**
   - `server.ts`: `export async function renderTemplate(template: string, context: Record<string, unknown> = {}): Promise<string>`
   - `server.js`: `export async function renderTemplate(template, context = {})`

4. **Interfaces**
   - `server.ts` heeft `ServerOptions` interface
   - `server.js` heeft alleen JSDoc

**Gelijkenissen:**
- ✅ Beide hebben dezelfde functionaliteit
- ✅ Beide exporteren `startServer()` en `createApp()`
- ✅ Beide gebruiken `live-reload.js`

### Waar wordt server.ts gebruikt?

- ✅ `scripts/cli/toolkit.js`: `import('../../web/server/server.ts')`
- ✅ `web/scripts/dev.ts`: `join(WEB_DIR, '..', 'server', 'server.ts')`

### Waar wordt server.js gebruikt?

- ❌ Geen actieve code referenties gevonden
- ⚠️ Alleen in oude documentatie (README.md, etc.)

### live-reload.js

**Status:**
- ✅ Actief gebruikt door beide server bestanden
- ✅ JavaScript zonder types
- ✅ Werkt goed

**Features:**
- WebSocket server voor live reload
- `LiveReloadManager` class (ES6 class)
- Export functies voor server gebruik

---

## 🎯 Aanbevelingen

### 1. server.js → **VERWIJDEREN** ⚠️

**Redenen:**
1. ✅ `server.ts` is de actieve TypeScript versie
2. ✅ Alle code referenties gebruiken `server.ts`
3. ❌ `server.js` wordt nergens gebruikt
4. ⚠️ Duplicatie veroorzaakt verwarring
5. ✅ TypeScript versie is beter (type safety)

**Actie:**
```bash
rm web/server/server.js
```

**Risico:** ⚠️ **Laag** - Geen actieve referenties gevonden

---

### 2. live-reload.js → **OPTIONEEL CONVERTEREN** 📋

**Status:** Werkt goed als JavaScript, conversie niet urgent

#### Optie A: **Blijven zoals het is** (Aanbevolen)

**Redenen:**
- ✅ Werkt perfect
- ✅ Geen problemen
- ✅ Simpel bestand (134 regels)
- ⚠️ Conversie voegt weinig toe

#### Optie B: **Converteren naar TypeScript** (Optioneel)

**Voordelen:**
- ✅ Consistentie met `server.ts`
- ✅ Type safety voor WebSocket handlers
- ✅ Betere IntelliSense
- ✅ Type-safe event callbacks

**Nadelen:**
- ⚠️ Extra werk (~30 minuten)
- ⚠️ Werkt al perfect
- ⚠️ Laag risico op bugs tijdens conversie

**Prioriteit:** Laag (alleen als tijd beschikbaar is)

---

## ✅ Aanbevolen Actie Plan

### Fase 1: Cleanup (Direct)

1. ✅ **Verwijder `server.js`**
   - ❌ Niet gebruikt
   - ❌ Duplicatie
   - ✅ `server.ts` is actief

2. ✅ **Valideer functionaliteit**
   - Test server start
   - Test live reload
   - Test routes

### Fase 2: Optioneel - live-reload.js Conversie

**Alleen doen als:**
- ✅ Type safety belangrijk is
- ✅ Code wordt uitgebreid
- ✅ Tijd beschikbaar is
- ✅ Consistentie gewenst is

**Niet doen als:**
- ❌ Alles werkt al perfect
- ❌ Geen uitbreidingen gepland
- ❌ Tijd is beperkt
- ❌ Laag risico gewenst

---

## 📊 Impact Analyse

### Verwijderen server.js

**Impact:** ⚠️ **Laag**
- Geen code verwijst ernaar
- Alleen documentatie updates nodig

**Voordelen:**
- ✅ Geen verwarring meer
- ✅ Duidelijke structuur
- ✅ Alleen TypeScript versie

### Converteren live-reload.js

**Impact:** ⚠️ **Medium**
- TypeScript types toevoegen
- Event handlers type-safe maken
- WebSocket handlers type-safe maken

**Voordelen:**
- ✅ Type safety
- ✅ Betere IDE support
- ✅ Consistentie

**Nadelen:**
- ⚠️ Testen vereist
- ⚠️ Tijd investering

---

## 🚀 Conclusie & Aanbeveling

### Direct Actie

1. ✅ **VERWIJDER `server.js`**
   - Risico: Laag
   - Waarde: Hoog (cleanup)
   - Tijd: 5 minuten

### Optionele Actie

2. ⚠️ **CONVERTEER `live-reload.js` → `live-reload.ts`**
   - Risico: Laag-Medium
   - Waarde: Medium (consistency)
   - Tijd: ~30 minuten
   - **Status:** Optioneel, niet urgent

---

## 📝 Checklist

### Cleanup (server.js)
- [ ] Controleer laatste keer dat server.js gebruikt werd
- [ ] Verwijder server.js
- [ ] Update documentatie referenties
- [ ] Test server functionaliteit
- [ ] Valideer live reload werkt

### Conversie (live-reload.js) - Optioneel
- [ ] Maak live-reload.ts
- [ ] Voeg TypeScript types toe
- [ ] Type-safe WebSocket handlers
- [ ] Update imports in server.ts
- [ ] Test live reload functionaliteit
- [ ] Verwijder live-reload.js

---

**Laatst bijgewerkt**: 2025-01-27
