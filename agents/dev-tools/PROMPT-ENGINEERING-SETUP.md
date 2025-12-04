# Prompt Engineering Specialist - Setup Guide

## Overview

De **Prompt Engineering Specialist** agent is toegevoegd aan de CouchCMS AI Toolkit. Deze agent helpt bij het creëren, optimaliseren en onderhouden van hoogwaardige prompts voor AI agents, met focus op duidelijkheid, consistentie, effectiviteit en herbruikbaarheid.

## Wat is er toegevoegd?

### 1. Agent Bestand
- **Locatie**: `agents/dev-tools/prompt-engineering.md`
- **Type**: `combined` (Quick Reference + Deep Dive structuur)
- **Categorie**: Development Tools (optioneel)

### 2. Documentatie Updates
- **README.md**: Bijgewerkt met nieuwe agent informatie
- **option-organizer.js**: Beschrijving toegevoegd voor automatische detectie

## Hoe te gebruiken?

### Stap 1: Voeg toe aan `standards.md`

Voeg de agent toe aan je project's `standards.md` bestand:

```yaml
# === AGENTS ===
# Development Tools (optional)
agents:
    - bun                    # Optional - only if you use Bun
    - git                    # Optional - only if you use Git workflows
    - mysql                  # Optional - only if you need database optimization help
    - prompt-engineering     # Optional - for optimizing AI prompts and workflows
```

### Stap 2: Sync de configuratie

Run de sync script om de configuratie bij te werken:

```bash
bun scripts/sync.js
```

Dit genereert automatisch:
- Updated `.cursorrules`
- Updated `AGENTS.md`
- Updated Claude Code skills
- Platform-specifieke configuraties

### Stap 3: Gebruik de agent

Roep de agent aan met `@prompt-engineering`:

```
@prompt-engineering help me create a prompt template for component creation
```

```
@prompt-engineering optimize this prompt for better clarity
```

```
@prompt-engineering review my prompt and suggest improvements
```

## Wat kan de agent doen?

### 1. Prompt Creatie
- Creëren van gestructureerde prompts volgens best practices
- Component creation prompts
- Refactoring prompts
- Design system prompts
- Specialized prompts (accessibility, performance, security)

### 2. Prompt Optimalisatie
- Verbeteren van duidelijkheid en specificiteit
- Toevoegen van ontbrekende requirements
- Structureren van prompts voor betere parsing
- Optimaliseren van taal en toon

### 3. Template Management
- Creëren van herbruikbare prompt templates
- Organiseren van prompt libraries
- Versiebeheer voor prompts
- Documentatie standaarden

### 4. Quality Assurance
- Quality checklists voor prompts
- Validatie criteria
- Effectiviteit metingen
- Iteratie processen

## Belangrijke Features

### Prompt Structure Framework

De agent gebruikt een gestandaardiseerd framework:

```
# [Title] – [Brief Description]

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Role
[Clear role definition]

## Objective
[Specific, measurable goal]

## Context
[Project background and constraints]

## Steps
[Step-by-step process]

## Requirements
[Technical and quality requirements]

## Output
[Expected deliverables]

## Quality Checklist
[Verification criteria]
```

### Best Practices

- **Clarity**: Duidelijke, ondubbelzinnige instructies
- **Specificity**: Gedetailleerde, actiegerichte requirements
- **Structure**: Consistente prompt organisatie
- **Context**: Relevante achtergrond informatie
- **Iteration**: Continu verbeteringsproces

### Prompt Categorieën

1. **Component Creation**: Voor het creëren van UI componenten
2. **Refactoring**: Voor het optimaliseren van bestaande code
3. **Design System**: Voor design system implementaties
4. **Specialized**: Accessibility, performance, security, etc.

## Voorbeelden

### Component Creation Prompt

```
@prompt-engineering create a prompt template for a button component system with variants, sizes, and states
```

### Prompt Optimization

```
@prompt-engineering review and optimize this prompt:
[your prompt here]
```

### Prompt Library Organization

```
@prompt-engineering help me organize my prompt library into categories
```

## Integratie met Toolkit Workflow

De Prompt Engineering Specialist integreert naadloos met:

- **CouchCMS Agents**: Helpt bij het optimaliseren van prompts voor CouchCMS-specifieke taken
- **Frontend Agents**: Ondersteunt TailwindCSS, Alpine.js, en TypeScript prompts
- **Dev Tools**: Werkt samen met andere development tool agents
- **Standards.md**: Volgt altijd project standaarden

## Best Practices voor Gebruik

1. **Start met Templates**: Gebruik bestaande templates als basis
2. **Itereer**: Test prompts en verbeter op basis van output
3. **Documenteer**: Houd versiegeschiedenis bij van prompts
4. **Valideer**: Gebruik quality checklists voor elke prompt
5. **Deel**: Deel effectieve prompts met het team

## Resources

- **Agent Documentatie**: `agents/dev-tools/prompt-engineering.md`
- **Toolkit Documentatie**: `/docs/`
- **Best Practices**: Zie agent bestand voor uitgebreide best practices

## Volgende Stappen

1. ✅ Agent bestand aangemaakt
2. ✅ Documentatie bijgewerkt
3. ✅ Code integratie voltooid
4. ⏭️ Voeg toe aan je project's `standards.md`
5. ⏭️ Run `bun scripts/sync.js`
6. ⏭️ Test met `@prompt-engineering`

---

*Deze agent is ontworpen om de kwaliteit en effectiviteit van AI agent prompts te verbeteren, wat leidt tot betere code output en meer consistente resultaten.*
