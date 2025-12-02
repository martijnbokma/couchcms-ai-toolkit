# Setup Wizard Verbeteringen

## Huidige Problemen

1. **Back button gedrag**: Gaat naar welkomstscherm i.p.v. één stap terug
2. **Medium vs Comprehensive**: Geen duidelijk verschil
3. **Editors scherm ontbreekt**: Geen optie om editors te selecteren
4. **Stappen logica**: Niet altijd logisch opgebouwd
5. **Complexity levels**: Medium en Comprehensive zijn te vergelijkbaar

## Voorgestelde Structuur

### Twee Hoofdwegen: Simpel vs Uitgebreid

#### 🎯 **Simpel** (CouchCMS-Only Setup)
**Doel**: Snelle setup voor pure CouchCMS projecten zonder frontend/backend configuratie

**Stappen**:
1. Project Info (naam, beschrijving)
2. Editors Selectie (optioneel - welke AI tools gebruik je?)
3. Review & Generate

**Inclusies**:
- ✅ Alle CouchCMS modules (automatisch)
- ✅ Alle CouchCMS agents (automatisch)
- ❌ Geen frontend frameworks (TailwindCSS, daisyUI, Alpine.js, TypeScript)
- ❌ Geen development tool agents (bun, git, mysql, admin-panel-theming)
- ✅ Editors configuratie (optioneel)

**Gebruik**: Beginners, snelle setup, pure CouchCMS focus

---

#### 🚀 **Uitgebreid** (Full Toolkit Setup)
**Doel**: Complete setup met alle toolkit opties

**Stappen**:
1. Project Info (naam, beschrijving)
2. Frontend Frameworks (CSS: TailwindCSS, daisyUI | JS: Alpine.js, TypeScript)
3. Development Tools (bun, git, mysql, admin-panel-theming agents)
4. Editors Selectie (welke AI tools gebruik je?)
5. Advanced Options (AAPF framework, context directory)
6. Review & Generate

**Inclusies**:
- ✅ Alle CouchCMS modules (automatisch)
- ✅ Alle CouchCMS agents (automatisch)
- ✅ Frontend frameworks (user selecteert)
- ✅ Development tool agents (user selecteert)
- ✅ Editors configuratie (user selecteert)
- ✅ Advanced options (optioneel)

**Gebruik**: Ervaren gebruikers, volledige controle, alle features

---

## Nieuwe Stap Structuur

### Welkomstscherm
- **Simpel** button → Simpel pad (3 stappen)
- **Uitgebreid** button → Uitgebreid pad (6 stappen)
- **Terminal Setup** link → Terminal instructies

### Simpel Pad Flow
```
Welkomstscherm
    ↓ [Simpel]
Project Info
    ↓ [Next]
Editors (optioneel - kan overslaan)
    ↓ [Next]
Review & Generate
    ↓ [Generate]
Success
```

### Uitgebreid Pad Flow
```
Welkomstscherm
    ↓ [Uitgebreid]
Project Info
    ↓ [Next]
Frontend Frameworks (CSS + JS)
    ↓ [Next]
Development Tools (agents)
    ↓ [Next]
Editors Selectie
    ↓ [Next]
Advanced Options (AAPF framework, context)
    ↓ [Next]
Review & Generate
    ↓ [Generate]
Success
```

---

## Back Button Gedrag

**Regel**: Back button gaat altijd één stap terug in de huidige flow

**Implementatie**:
- Gebruik JavaScript history state management
- Of: Stuur `previousStep` parameter mee in form data
- Of: Gebruik HTMX met history API

**Voorbeelden**:
- Van "Editors" → terug naar "Project Info" (niet naar welkomstscherm)
- Van "Frontend" → terug naar "Project Info"
- Van "Review" → terug naar vorige stap in flow

---

## Editors Scherm Details

### Beschikbare Editors
1. **Cursor** - Cursor IDE (.cursorrules)
2. **Claude Code** - Claude Code (CLAUDE.md + .claude/)
3. **GitHub Copilot** - GitHub Copilot (.github/copilot-instructions.md)
4. **Windsurf** - Windsurf IDE (.windsurf/rules.md)
5. **Zed** - Zed Editor (.rules)
6. **Amazon CodeWhisperer** - (.codewhisperer/settings.json)
7. **Amazon Kiro** - (.kiro/rules.md)
8. **Google Antigravity** - Gemini 3 (.antigravity/rules.md)
9. **Jules (Google)** - (.jules/rules.md)
10. **Roo Code** - (.roocode/rules.md)
11. **VS Code AI Toolkit** - (.vscode/ai-toolkit.md)
12. **Tabnine** - (.tabnine/settings.json)
13. **Generic Agent** - (AGENT.md)

### UI Design
- Checkbox lijst met editor naam + beschrijving
- "Select All" optie
- "Skip" optie (geen editors configureren)
- Visuele groepering: Populair (Cursor, Claude, Copilot) vs Overig

---

## Development Tools Scherm (Alleen Uitgebreid)

### Beschikbare Development Tool Agents
1. **Bun** - Bun runtime, package management, and build tooling
2. **Git** - Git version control and workflow management
3. **MySQL** - Database operations, optimization, and CouchCMS-specific queries
4. **Admin Panel Theming** - CouchCMS admin panel customization and theming

### UI Design
- Checkbox lijst met tool naam + beschrijving
- "Select All" optie
- "Skip" optie (geen dev tools)

---

## Advanced Options Scherm (Alleen Uitgebreid)

### AAPF Framework
- Toggle: Enable AAPF framework?
- Sub-options (indien enabled):
  - Doctrine
  - Directives
  - Playbooks
  - Enhancements

### Context Directory
- Input field: Custom context directory path (default: `.project/ai`)

---

## Verbeterde Review Scherm

### Simpel Pad Review
- Project Info
- Selected Editors (of "None")
- CouchCMS Modules (automatisch - read-only)
- CouchCMS Agents (automatisch - read-only)

### Uitgebreid Pad Review
- Project Info
- Frontend Frameworks (CSS + JS)
- Development Tools
- Selected Editors
- Advanced Options (AAPF, context)
- CouchCMS Modules (automatisch - read-only)
- CouchCMS Agents (automatisch - read-only)

---

## Technische Implementatie

### State Management
- Gebruik session storage of hidden form fields om flow state bij te houden
- Track: `setupType` (simple/extended), `currentStep`, `previousStep`

### Back Button Logic
```javascript
function goBack() {
    const previousStep = getPreviousStep()
    if (previousStep) {
        navigateToStep(previousStep)
    } else {
        navigateToWelcome()
    }
}
```

### Flow Detection
- Simpel pad: 3 stappen (project → editors → review)
- Uitgebreid pad: 6 stappen (project → frontend → devtools → editors → advanced → review)

---

## Voordelen van Nieuwe Structuur

1. **Duidelijke scheiding**: Simpel vs Uitgebreid is duidelijk
2. **Logische flow**: Elke stap bouwt voort op vorige
3. **Editors niet vergeten**: Expliciet scherm voor editors
4. **Back button werkt**: Altijd één stap terug
5. **Flexibiliteit**: Uitgebreid pad geeft volledige controle
6. **Beginner-vriendelijk**: Simpel pad is snel en duidelijk

---

## Migratie Plan

1. ✅ Nunjucks templates implementeren (al gedaan)
2. ⏳ Welkomstscherm aanpassen (Simpel vs Uitgebreid)
3. ⏳ Nieuwe stap templates maken:
   - `steps/editors.html`
   - `steps/devtools.html` (alleen uitgebreid)
   - `steps/advanced.html` (alleen uitgebreid)
4. ⏳ Back button logica implementeren
5. ⏳ State management toevoegen
6. ⏳ API routes aanpassen voor nieuwe flow
7. ⏳ Review scherm aanpassen voor beide paden
