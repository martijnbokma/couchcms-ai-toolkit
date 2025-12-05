# Web Scripts

Build, watch, en development scripts voor de web applicatie.

---

## 📁 Bestandsstructuur

```
web/scripts/
├── tsconfig.json          # TypeScript configuratie
├── types.ts               # Gedeelde type definitions
├── build.ts               # Build script (TypeScript)
├── watch.ts               # Watch script (TypeScript)
├── dev.ts                 # Dev script (TypeScript)
├── clean.js               # Clean script (JavaScript - simpel)
└── README.md              # Deze file
```

---

## 🚀 Scripts

### Build Script (`build.ts`)

Bundelt JavaScript/TypeScript bestanden en compileert Tailwind CSS.

**Gebruik:**
```bash
bun web/scripts/build.ts
# Of via package.json:
bun run build:web
```

**Functies:**
- ✅ Bundelt TypeScript en JavaScript bestanden
- ✅ Compileert Tailwind CSS v4
- ✅ Genereert production-ready assets
- ✅ Ondersteunt meerdere bundles (wizard, base)

### Watch Script (`watch.ts`)

Wacht op bestandswijzigingen en rebuildt automatisch.

**Gebruik:**
```bash
bun web/scripts/watch.ts
bun web/scripts/watch.ts --server    # Watch ook server files

# Of via package.json:
bun run watch:web
bun run watch:web:server
```

**Functies:**
- ✅ Automatische rebuilds bij wijzigingen
- ✅ Live reload browser integratie
- ✅ Debounced builds (300ms)
- ✅ Optionele server file watching

### Dev Script (`dev.ts`)

Start development server met watch mode en live reload.

**Gebruik:**
```bash
bun web/scripts/dev.ts
bun web/scripts/dev.ts --port=3001   # Custom poort

# Of via package.json:
bun run dev:web
```

**Functies:**
- ✅ Start watch mode
- ✅ Start development server
- ✅ Live reload support
- ✅ Graceful shutdown

### Clean Script (`clean.js`)

Verwijdert alle build artifacts.

**Gebruik:**
```bash
bun web/scripts/clean.js

# Of via package.json:
bun run clean:web
```

**Functies:**
- ✅ Verwijdert `public/dist/` directory
- ✅ Clean slate voor nieuwe builds

---

## 🔧 TypeScript

Alle scripts zijn geschreven in TypeScript (behalve `clean.js` dat te simpel is).

### Type Definitions

Gedeelde types zijn gedefinieerd in `types.ts`:

```typescript
export interface BundleConfig {
    name: string
    entry: string[]
    output: string
    description: string
}

export interface WatchOptions {
    watchServer?: boolean
}

export type ChangeType = 'css' | 'js' | 'html' | 'full'
```

### TypeScript Configuratie

De TypeScript configuratie staat in `tsconfig.json` en extends de server configuratie.

---

## 📦 Dependencies

Deze scripts gebruiken:
- **Bun** - Runtime en build tool
- **Node.js APIs** - File system, process management
- **Tailwind CSS CLI** - CSS compilation

---

## 🔗 Gerelateerde Documenten

- `TYPESCRIPT-CONVERSION-ANALYSIS.md` - Analyse voor conversie
- `TYPESCRIPT-CONVERSION-COMPLETE.md` - Conversie rapport

---

**Laatst bijgewerkt**: 2025-01-27
