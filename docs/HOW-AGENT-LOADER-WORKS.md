# Hoe Werkt de Agent Loader?

## Overzicht

De agent loader is **NIET** actief tijdens het uitvoeren van prompts. In plaats daarvan werkt het als volgt:

1. **Build-time**: Agents worden geladen wanneer je `bun run sync` uitvoert
2. **Runtime**: De gegenereerde configuratiebestanden worden gebruikt door de AI editor

---

## Twee Fasen

### Fase 1: Build-time (Sync Proces)

Wanneer je `bun run sync` uitvoert:

```bash
bun run sync
# of
bun ai:sync
```

**Wat gebeurt er:**

1. **Configuratie laden** (`scripts/cli/sync.js`)
   - Leest `standards.md` (of `config/standards.md`)
   - Haalt de lijst van agents op uit `agents:` sectie

2. **Agent loader activeren** (`scripts/lib/module-loader.js`)
   ```javascript
   // Voor elke agent naam in de configuratie:
   loadAgent(agentName, toolkitPath)

   // Zoekt in deze volgorde:
   // 1. agents/{agentName}.md (legacy)
   // 2. agents/core/{agentName}.md
   // 3. agents/frontend/{agentName}.md
   // 4. agents/dev-tools/{agentName}.md
   ```

3. **Agent inhoud laden**
   - Leest het `.md` bestand
   - Parseert frontmatter (YAML metadata)
   - Extraheert content
   - Cached het resultaat

4. **Template rendering** (`scripts/lib/template-engine.js`)
   - Agents worden toegevoegd aan template data
   - Editor configuratiebestanden worden gegenereerd:
     - `.cursorrules` (Cursor)
     - `CLAUDE.md` (Claude Code)
     - `.claude/skills/*.md` (Claude Skills)
     - `AGENTS.md` (Documentatie)
     - etc.

### Fase 2: Runtime (Tijdens Prompts)

**De agent loader zelf is NIET actief tijdens prompts.**

In plaats daarvan:

1. **Cursor IDE** leest `.cursorrules` en `.cursor/rules/*.mdc`
   - Deze bestanden bevatten de agent informatie
   - MDC rules worden automatisch geactiveerd op basis van file patterns

2. **Claude Code** leest `CLAUDE.md` en `.claude/skills/*.md`
   - `CLAUDE.md` wordt geladen bij startup (memory file)
   - Skills worden automatisch geactiveerd op basis van context

3. **Andere editors** lezen hun specifieke configuratiebestanden
   - GitHub Copilot: `.github/copilot-instructions.md`
   - Windsurf: `.windsurf/rules.md`
   - etc.

---

## Voorbeeld Flow

### Stap 1: Configuratie (`standards.md`)

```yaml
---
agents:
  - javascript
  - typescript
  - alpinejs
---
```

### Stap 2: Sync Uitvoeren

```bash
$ bun run sync

📋 Loading configuration...
✅ Configuration loaded

🤖 Loading agents (3 agents)...
✅ Loaded 3 agent(s)

📝 Generating configuration files...
✅ Generated .cursorrules
✅ Generated CLAUDE.md
✅ Generated AGENTS.md
✅ Generated .claude/skills/javascript.md
✅ Generated .claude/skills/typescript.md
✅ Generated .claude/skills/alpinejs.md
```

### Stap 3: Agent Loader Werkt

```javascript
// scripts/lib/module-loader.js

function loadAgent(agentName, toolkitPath) {
    // Zoekt in subdirectories:
    const possiblePaths = [
        join(toolkitPath, 'agents', `${agentName}.md`),
        join(toolkitPath, 'agents', 'core', `${agentName}.md`),
        join(toolkitPath, 'agents', 'frontend', `${agentName}.md`),
        join(toolkitPath, 'agents', 'dev-tools', `${agentName}.md`),
    ]

    // Vindt: agents/frontend/javascript.md
    // Leest bestand
    // Parseert frontmatter + content
    // Retourneert: { meta, content, name }
}
```

### Stap 4: Template Rendering

```javascript
// scripts/lib/template-engine.js

prepareTemplateData(config, mergedConfig, modules, agents, ...) {
    // Agents worden toegevoegd aan template data:
    return {
        agents: agentsData,  // Array van agent objecten
        modules: modulesData,
        // ... andere data
    }
}
```

### Stap 5: Bestanden Genereren

De templates gebruiken de agent data:

```handlebars
{{#each agents}}
## @{{slug}}

**Type**: {{type}}
**Description**: {{description}}

{{content}}
{{/each}}
```

### Stap 6: Tijdens Prompts

**Agent loader is NIET actief** - de editor leest de gegenereerde bestanden:

```
User: "Maak een TypeScript component"
     ↓
Cursor leest .cursorrules
     ↓
Vindt TypeScript agent informatie
     ↓
Gebruikt die informatie voor de prompt
```

---

## Belangrijke Punten

### ✅ Wat de Agent Loader WEL doet:

- **Build-time**: Laadt agents tijdens `bun run sync`
- **Caching**: Cached geladen agents voor performance
- **Zoeken**: Zoekt automatisch in subdirectories (core/, frontend/, dev-tools/)
- **Validatie**: Waarschuwt als agents niet gevonden worden

### ❌ Wat de Agent Loader NIET doet:

- **Runtime loading**: Laadt agents NIET tijdens prompts
- **Dynamic loading**: Laadt agents NIET dynamisch tijdens gebruik
- **Auto-discovery**: Detecteert NIET automatisch welke agents nodig zijn

### 🔄 Wanneer Agents Worden Geladen:

1. **Expliciet**: Wanneer je `bun run sync` uitvoert
2. **Automatisch**: Wanneer je `standards.md` wijzigt en sync opnieuw uitvoert
3. **Niet automatisch**: Tijdens prompts of code generatie

---

## Editor-specifiek Gedrag

### Cursor IDE

```text
.cursorrules              ← Bevat agent informatie (generated)
.cursor/rules/*.mdc       ← Context-aware rules (copied from toolkit)

Tijdens prompt:
1. Cursor leest .cursorrules
2. MDC rules worden geactiveerd op basis van file patterns
3. Agent informatie is beschikbaar in context
```

### Claude Code

```text
CLAUDE.md                 ← Memory file met agent overzicht (generated)
.claude/skills/*.md       ← Eén skill per agent (generated)

Tijdens prompt:
1. Claude leest CLAUDE.md bij startup
2. Skills worden automatisch geactiveerd op basis van context
3. Agent content is beschikbaar via skills
```

---

## Samenvatting

| Fase | Wanneer | Wat Gebeurt | Agent Loader Actief? |
|------|---------|------------|---------------------|
| **Build** | `bun run sync` | Agents worden geladen en gebruikt om configuratiebestanden te genereren | ✅ **JA** |
| **Runtime** | Tijdens prompts | Editor leest gegenereerde configuratiebestanden | ❌ **NEE** |

**Conclusie**: De agent loader werkt alleen tijdens het sync proces. Tijdens prompts gebruikt de editor de **gegenereerde configuratiebestanden** die de agent informatie bevatten.

---

## Troubleshooting

### Agents worden niet geladen?

1. **Check configuratie**:
   ```yaml
   # standards.md
   agents:
     - javascript  # Moet exact overeenkomen met bestandsnaam
   ```

2. **Check bestandslocatie**:
   ```
   agents/
     frontend/
       javascript.md  ← Moet hier staan
   ```

3. **Run sync opnieuw**:
   ```bash
   bun run sync
   ```

### Agents werken niet tijdens prompts?

1. **Check gegenereerde bestanden**:
   ```bash
   cat .cursorrules | grep -A 10 "javascript"
   cat CLAUDE.md | grep -A 10 "javascript"
   ```

2. **Restart editor**: Soms moet je de editor herstarten na sync

3. **Check editor versie**: Sommige features vereisen nieuwere editor versies

---

## Code Referenties

- **Agent Loader**: `scripts/lib/module-loader.js` (regel 99-166)
- **Sync Proces**: `scripts/cli/sync.js` (regel 1005-1056)
- **Template Engine**: `scripts/lib/template-engine.js` (regel 127-256)
