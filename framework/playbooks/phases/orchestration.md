# Phase -1: Agent Orchestration

**Goal:** Select the right agents and define how they'll collaborate.

---

## 1. Analyze Request Domains

Identify which technologies and expertise are needed:

**Questions:**
- Which technologies? (CouchCMS, TypeScript, TailwindCSS, etc.)
- What type of work? (CRUD, routing, forms, UI, database, etc.)
- What expertise? (Security, performance, accessibility, etc.)

**Example:**
```
Request: "Create user profile with photo upload"

Domains:
- CouchCMS templates ✓
- DataBound Forms ✓
- Photo Gallery ✓
- Users/Auth ✓
- TailwindCSS ✓
- TypeScript ✓
```

---

## 2. Select Agent Team

**Available Agents:**
- @couchcms, @databound-forms, @custom-routes, @alpinejs
- @tailwindcss, @typescript, @views, @folders, @archives
- @relationships, @repeatable-regions, @search, @pagination
- @comments, @nested-pages, @photo-gallery, @rss-feeds
- @on-page-editing, @users, @bun, @git, @mysql, @admin-panel-theming

**Team Structure:**
- **Primary (2-4):** Core expertise required
- **Supporting (1-3):** Additional guidance
- **Advisory (0-2):** Consulted as needed

**Example Team:**
```
Primary:
- @couchcms (templates, routing)
- @databound-forms (CRUD)
- @photo-gallery (images)
- @users (auth, ownership)

Supporting:
- @tailwindcss (styling)
- @typescript (validation)
```

---

## 3. Define Collaboration Workflow

**For each phase, define:**
- Which agents are active
- What each agent does
- Hand-off points
- Integration checkpoints

**Example:**
```
Phase 0 - Reconnaissance:
1. @couchcms → Template patterns
2. @users → Auth patterns
3. @photo-gallery → Image patterns
4. @databound-forms → Form patterns
→ Synthesis: Combine insights

Phase 2 - Execution:
1. @couchcms → Template structure
   ↓ Hand off
2. @databound-forms → CRUD forms
   ↓ Hand off
3. @photo-gallery → Image upload
   ↓ Hand off
4. @users → Ownership filters
   ↓ Hand off
5. @tailwindcss → Styling
   ↓ Hand off
6. @typescript → Validation
→ Integration: Test complete workflow
```

---

## 4. Output: Orchestration Plan

```markdown
## Agent Team

**Primary:**
- @agent1 - Responsibility
- @agent2 - Responsibility

**Supporting:**
- @agent3 - Responsibility

## Workflow

**Phase 0:** Agent1, Agent2 → Reconnaissance
**Phase 1:** All agents → Strategy proposals
**Phase 2:** Sequential execution with hand-offs
**Phase 3:** All agents → Domain verification
**Phase 4:** All agents → Fresh audit
**Phase 5:** Orchestrator → Final report

## Hand-offs

Agent1 → Agent2: Deliverable X
Agent2 → Agent3: Deliverable Y
```

---

**Next:** Phase 0 - Multi-Agent Reconnaissance
