# Modules Uitbreiden op Basis van Documentatie

## Overzicht

Je kunt nu modules automatisch uitbreiden met content uit de CouchCMS documentatie in `src/content`. Het `extend-modules.js` script analyseert de documentatie en extraheert relevante patronen, code voorbeelden en regels.

## Snel Starten

### 1. Analyseer Documentatie Structuur

```bash
bun scripts/extend-modules.js --analyze
```

Dit toont:
- Beschikbare concepts, tags en custom routes
- Huidige module mappings
- Potentiële nieuwe modules

### 2. Uitbreiden van Modules

```bash
# Alle modules uitbreiden
bun scripts/extend-modules.js

# Specifieke module uitbreiden
bun scripts/extend-modules.js --module comments

# Preview (zonder wijzigingen)
bun scripts/extend-modules.js --module comments --dry-run
```

## Hoe Het Werkt

### Stap 1: Documentatie Analyse

Het script scant:
- `docs/concepts/` - Concept documentatie
- `docs/tags-reference/core/` - Tag documentatie
- `docs/tags-reference/custom-routes/` - Routing documentatie

### Stap 2: Content Extractie

Voor elk relevant documentatie bestand:
- **Code Voorbeelden**: Extraheert alle code blocks met taal en titel
- **Patronen**: Extraheert admonitions (:::note, :::tip, :::caution, :::danger)
- **Stappen**: Extraheert Steps componenten
- **Kritieke Regels**: Identificeert danger/caution admonitions

### Stap 3: Module Verbetering

De geëxtraheerde content wordt:
- Geformatteerd volgens module structuur
- Toegevoegd aan bestaande modules (geappend)
- Gebruikt om nieuwe modules te maken (als ze niet bestaan)
- Beperkt om bloat te voorkomen (max 3 voorbeelden per concept)

## Module Mapping

Het script gebruikt een mapping configuratie die definieert welke documentatie topics bij welke modules horen:

### Bestaande Modules

- **couchcms-core**: templates, editable-regions, variables, views, etc.
- **databound-forms**: forms, databound-forms

### Potentiële Nieuwe Modules

- **comments**: Comments functionaliteit
- **search**: Zoek functionaliteit
- **pagination**: Paginatie
- **relationships**: Relaties tussen pagina's
- **repeatable-regions**: Herhaalbare regio's
- **folders**: Folders en nested pages
- **archives**: Archief views
- **users**: Gebruikers management
- **custom-routes**: Custom routing

## Workflow

```bash
# 1. Analyseer wat beschikbaar is
bun scripts/extend-modules.js --analyze

# 2. Preview wijzigingen
bun scripts/extend-modules.js --module comments --dry-run

# 3. Uitbreiden
bun scripts/extend-modules.js --module comments

# 4. Review
cat modules/comments.md

# 5. Sync naar project
bun scripts/sync.js
```

## Nieuwe Module Mapping Toevoegen

Bewerk `scripts/extend-modules.js` en voeg toe aan `MODULE_MAPPING`:

```javascript
'nieuwe-module-naam': {
    concepts: ['concept1', 'concept2'],
    tags: ['tag1', 'tag2'],
    newModule: true, // true als module nog niet bestaat
},
```

## Best Practices

1. **Beperk Content**: Niet elk voorbeeld uit documentatie opnemen
2. **Focus op Patronen**: Veelvoorkomende patronen en kritieke regels
3. **Houd Modules Scannable**: Niet te veel content, blijf gefocust
4. **Review Regelmatig**: Re-run extension bij documentatie updates

## Zie Ook

- [Extending Modules Guide (English)](EXTENDING-MODULES.md)
- [Available Modules](MODULES.md)
- [Getting Started](GETTING-STARTED.md)
