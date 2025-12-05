# Module & Agent Systeem Verbeteringen - Uitgebreid Voorstel

## Executive Summary

Dit document beschrijft concrete verbeteringen voor het weergeven en documenteren van modules en agents in de CouchCMS AI Toolkit wizard. Het voorstel richt zich op het transformeren van een simpele naam-lijst naar een rijk, informatief systeem dat gebruikers helpt te begrijpen wat elk onderdeel doet en hoe het werkt.

---

## 1. Huidige Situatie Analyse

### 1.1 Wat werkt goed
- ✅ Modules en agents worden automatisch gedetecteerd
- ✅ Markdown bestanden bevatten frontmatter metadata
- ✅ Structuur is modulair en uitbreidbaar
- ✅ gray-matter is beschikbaar voor parsing

### 1.2 Huidige Beperkingen
- ❌ Alleen namen worden getoond, geen details
- ❌ Geen beschrijvingen of functionaliteit uitleg
- ❌ Geen visuele hiërarchie of categorisering
- ❌ Geen links naar documentatie
- ❌ Geen dependency informatie
- ❌ Geen voorbeelden of use cases
- ❌ Modal toont minimale informatie

---

## 2. Verbeteringsvoorstellen

### 2.1 Data Laag: Metadata Extraction

#### Probleem
De huidige `scanMarkdownFiles()` functie haalt alleen bestandsnamen op, niet de frontmatter metadata.

#### Oplossing
Creëer een nieuwe functie die frontmatter uit markdown bestanden parseert:

```javascript
// web/server/routes/api.js

const matter = require('gray-matter')
const { readFileSync } = require('fs')

/**
 * Load module metadata from markdown file
 * @param {string} moduleName - Name of module
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {Object|null} Module metadata or null
 */
function loadModuleMetadata(moduleName, toolkitPath) {
    const possiblePaths = [
        join(toolkitPath, 'modules', 'core', `${moduleName}.md`),
        join(toolkitPath, 'modules', 'frontend', `${moduleName}.md`),
        join(toolkitPath, 'modules', `${moduleName}.md`), // Legacy
    ]

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            try {
                const fileContent = readFileSync(path, 'utf8')
                const { data: meta, content } = matter(fileContent)

                // Extract first paragraph as summary if no description
                const summary = meta.description ||
                    content.split('\n\n')[0].replace(/^#+\s*/, '').substring(0, 200)

                return {
                    id: meta.id || moduleName,
                    name: meta.name || moduleName,
                    category: meta.category || 'other',
                    version: meta.version || '1.0',
                    description: meta.description || summary,
                    summary: summary,
                    required: meta.required || false,
                    requires: meta.requires || [],
                    conflicts: meta.conflicts || [],
                    content: content.substring(0, 500), // First 500 chars for preview
                    path: path
                }
            } catch (error) {
                console.warn(`Failed to load module ${moduleName}:`, error)
            }
        }
    }
    return null
}

/**
 * Load agent metadata from markdown file
 * @param {string} agentName - Name of agent
 * @param {string} toolkitPath - Path to toolkit root
 * @returns {Object|null} Agent metadata or null
 */
function loadAgentMetadata(agentName, toolkitPath) {
    const possiblePaths = [
        join(toolkitPath, 'agents', 'core', `${agentName}.md`),
        join(toolkitPath, 'agents', 'frontend', `${agentName}.md`),
        join(toolkitPath, 'agents', 'dev-tools', `${agentName}.md`),
        join(toolkitPath, 'agents', `${agentName}.md`), // Legacy
    ]

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            try {
                const fileContent = readFileSync(path, 'utf8')
                const { data: meta, content } = matter(fileContent)

                const summary = meta.description ||
                    content.split('\n\n')[0].replace(/^#+\s*/, '').substring(0, 200)

                return {
                    name: meta.name || agentName,
                    type: meta.type || 'combined',
                    version: meta.version || '1.0',
                    description: meta.description || summary,
                    summary: summary,
                    tags: meta.tags || [],
                    category: determineCategory(agentName, meta.tags),
                    content: content.substring(0, 500),
                    path: path
                }
            } catch (error) {
                console.warn(`Failed to load agent ${agentName}:`, error)
            }
        }
    }
    return null
}

/**
 * Get enriched modules and agents with metadata
 */
function getEnrichedCouchCMSItems() {
    const { couchcmsModules, couchcmsAgents } = getCouchCMSItemsFromToolkit()
    const toolkitPath = getToolkitRootCached()

    return {
        modules: couchcmsModules.map(name => ({
            name,
            ...loadModuleMetadata(name, toolkitPath)
        })).filter(m => m.name), // Remove nulls

        agents: couchcmsAgents.map(name => ({
            name,
            ...loadAgentMetadata(name, toolkitPath)
        })).filter(a => a.name) // Remove nulls
    }
}
```

#### Voordelen
- ✅ Rijke metadata beschikbaar voor UI
- ✅ Beschrijvingen en samenvattingen
- ✅ Dependency informatie
- ✅ Categorisering mogelijk

---

### 2.2 API Laag: Nieuwe Endpoints

#### Endpoint 1: Get Module/Agent Details
```javascript
// GET /api/setup/module/:name
// GET /api/setup/agent/:name

router.get('/api/setup/module/:name', async (req, res) => {
    const { name } = req.params
    const toolkitPath = getToolkitRootCached()
    const metadata = loadModuleMetadata(name, toolkitPath)

    if (!metadata) {
        return res.status(404).json({ error: 'Module not found' })
    }

    res.json(metadata)
})
```

#### Endpoint 2: Get All Enriched Items
```javascript
// GET /api/setup/couchcms-items

router.get('/api/setup/couchcms-items', async (req, res) => {
    const items = getEnrichedCouchCMSItems()
    res.json(items)
})
```

---

### 2.3 UI Laag: Verbeterde Modal

#### Verbetering 1: Rijke Informatie Weergave

**Huidige Modal Problemen:**
- Alleen namen en aantallen
- Geen beschrijvingen
- Geen categorisering
- Geen visuele hiërarchie

**Nieuwe Modal Structuur:**

```html
<!-- Verbeterde Modal met Tabs -->
<dialog id="couchcms-modules-modal" class="modal modal-middle">
    <div class="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Header met tabs -->
        <div class="tabs tabs-boxed mb-6">
            <button class="tab tab-active" data-tab="modules">Modules</button>
            <button class="tab" data-tab="agents">Agents</button>
        </div>

        <!-- Modules Tab -->
        <div id="modules-tab" class="tab-content">
            <!-- Categorisering -->
            <div class="space-y-6">
                <!-- Core Modules -->
                <div>
                    <h4 class="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span class="badge badge-primary">Core</span>
                        Core Modules
                    </h4>
                    <div class="grid gap-3">
                        {% for module in modules.core %}
                        <div class="card bg-base-200 border border-base-300">
                            <div class="card-body p-4">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <h5 class="font-semibold text-base mb-1">
                                            {{ module.name }}
                                            {% if module.required %}
                                            <span class="badge badge-error badge-sm ml-2">Required</span>
                                            {% endif %}
                                        </h5>
                                        <p class="text-sm text-base-content/70 mb-2">
                                            {{ module.description }}
                                        </p>
                                        {% if module.requires|length > 0 %}
                                        <div class="flex items-center gap-2 text-xs text-base-content/60">
                                            <span>Requires:</span>
                                            {% for req in module.requires %}
                                            <span class="badge badge-outline badge-xs">{{ req }}</span>
                                            {% endfor %}
                                        </div>
                                        {% endif %}
                                    </div>
                                    <button class="btn btn-sm btn-ghost" onclick="showModuleDetails('{{ module.name }}')">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {% endfor %}
                    </div>
                </div>
            </div>
        </div>
    </div>
</dialog>
```

#### Verbetering 2: Detail View per Item

**Nested Modal voor Details:**

```html
<!-- Module/Agent Detail Modal -->
<dialog id="item-detail-modal" class="modal modal-middle">
    <div class="modal-box w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
        <form method="dialog" class="absolute right-4 top-4 z-10">
            <button class="btn btn-sm btn-circle btn-ghost">✕</button>
        </form>

        <!-- Header -->
        <div class="mb-6 pr-10">
            <div class="flex items-center gap-2 mb-2">
                <h3 id="detail-title" class="font-bold text-2xl"></h3>
                <span id="detail-badge" class="badge"></span>
            </div>
            <p id="detail-description" class="text-base text-base-content/70"></p>
        </div>

        <!-- Metadata Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="stat bg-base-200 rounded-lg p-4">
                <div class="stat-title">Version</div>
                <div id="detail-version" class="stat-value text-lg"></div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-4">
                <div class="stat-title">Category</div>
                <div id="detail-category" class="stat-value text-lg"></div>
            </div>
        </div>

        <!-- Dependencies -->
        <div id="detail-dependencies" class="mb-6"></div>

        <!-- Content Preview -->
        <div class="prose prose-sm max-w-none">
            <div id="detail-content" class="bg-base-200 rounded-lg p-4"></div>
        </div>
    </div>
</dialog>
```

---

### 2.4 Categorisering & Visual Hierarchy

#### Categorieën voor Modules:
- **Core** (rood badge) - Verplichte basis functionaliteit
- **Navigation** (blauw badge) - Routing, search, pagination
- **Content** (groen badge) - Comments, archives, relationships
- **Frontend** (paars badge) - CSS/JS frameworks

#### Categorieën voor Agents:
- **Core** - CouchCMS specifiek
- **Frontend** - UI frameworks
- **Dev Tools** - Development utilities

#### Visuele Verbeteringen:
- Color-coded badges per categorie
- Icons per type
- Required vs Optional indicators
- Dependency chains visualisatie

---

### 2.5 Progressive Disclosure Pattern

**Niveau 1: Compact Overview (Huidige Card)**
- Aantal modules/agents
- "Details" knop

**Niveau 2: Modal Overview (Tabbed View)**
- Alle items gegroepeerd per categorie
- Korte beschrijvingen
- "Meer info" knoppen

**Niveau 3: Detail View (Nested Modal)**
- Volledige beschrijving
- Dependencies
- Use cases
- Code voorbeelden

---

## 3. Implementatie Roadmap

### Fase 1: Data Extraction (Week 1)
- [ ] Implementeer `loadModuleMetadata()` functie
- [ ] Implementeer `loadAgentMetadata()` functie
- [ ] Test met bestaande modules/agents
- [ ] Fallback voor ontbrekende metadata

### Fase 2: API Endpoints (Week 1)
- [ ] `/api/setup/couchcms-items` endpoint
- [ ] `/api/setup/module/:name` endpoint
- [ ] `/api/setup/agent/:name` endpoint
- [ ] Error handling en caching

### Fase 3: UI Verbeteringen (Week 2)
- [ ] Verbeterde modal met tabs
- [ ] Categorisering en badges
- [ ] Detail view modal
- [ ] Responsive design

### Fase 4: Enhanced Features (Week 3)
- [ ] Search/filter functionaliteit
- [ ] Dependency visualisatie
- [ ] Code voorbeelden weergave
- [ ] Links naar documentatie

---

## 4. Best Practices

### 4.1 Performance
- **Caching**: Metadata cachen na eerste load
- **Lazy Loading**: Details alleen laden wanneer nodig
- **Debouncing**: Search/filter debouncing

### 4.2 Accessibility
- **ARIA Labels**: Alle interactieve elementen
- **Keyboard Navigation**: Tab support
- **Screen Reader**: Semantische HTML

### 4.3 User Experience
- **Progressive Disclosure**: Informatie in lagen
- **Visual Feedback**: Loading states
- **Error Handling**: Graceful degradation

### 4.4 Maintainability
- **Type Safety**: TypeScript types voor metadata
- **Validation**: Schema validation voor metadata
- **Documentation**: Code comments en docs

---

## 5. Voorbeeld Implementatie

### 5.1 Server-Side (api.js)

```javascript
// Add to web/server/routes/api.js

const matter = require('gray-matter')

function loadModuleMetadata(moduleName, toolkitPath) {
    // Implementation as described above
}

// Update review route
router.get('/api/setup/step/review', async (req, res) => {
    // ... existing code ...

    const enrichedItems = getEnrichedCouchCMSItems()

    res.render('steps/review', {
        // ... existing data ...
        couchcmsModules: enrichedItems.modules,
        couchcmsAgents: enrichedItems.agents,
        // Group by category
        modulesByCategory: groupByCategory(enrichedItems.modules),
        agentsByCategory: groupByCategory(enrichedItems.agents)
    })
})
```

### 5.2 Client-Side (TypeScript)

```typescript
// web/assets/js/types/modules.ts

export interface ModuleMetadata {
    id: string
    name: string
    category: 'core' | 'navigation' | 'content' | 'frontend' | 'other'
    version: string
    description: string
    summary: string
    required: boolean
    requires: string[]
    conflicts: string[]
    content?: string
}

export interface AgentMetadata {
    name: string
    type: 'combined' | 'specialized' | 'framework'
    version: string
    description: string
    summary: string
    tags: string[]
    category: 'core' | 'frontend' | 'dev-tools'
    content?: string
}
```

---

## 6. Success Metrics

### Kwantitatief
- ⏱️ Modal load time < 200ms
- 📊 Metadata coverage > 95%
- 🎯 User engagement: 60%+ opent details

### Kwalitatief
- ✅ Gebruikers begrijpen wat modules/agents doen
- ✅ Minder vragen over functionaliteit
- ✅ Betere beslissingen tijdens setup

---

## 7. Conclusie

Dit voorstel transformeert het huidige systeem van een simpele lijst naar een rijk, informatief platform dat gebruikers helpt te begrijpen wat elk onderdeel doet. De implementatie is modulair, schaalbaar en past naadloos in de bestaande architectuur.

**Volgende Stap**: Start met Fase 1 (Data Extraction) om de basis te leggen voor alle verdere verbeteringen.

