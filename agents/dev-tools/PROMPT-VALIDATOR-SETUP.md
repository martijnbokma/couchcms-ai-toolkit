# Prompt Validator - Setup Guide

## Overview

De **Prompt Validator** agent is een kwaliteitscontrole specialist die continu prompts valideert om te verzekeren dat ze correct, foutloos en volledig voldoen aan de Single Source of Truth (SSOT) standaarden en richtlijnen.

## Wat is er toegevoegd?

### 1. Agent Bestand
- **Locatie**: `agents/dev-tools/prompt-validator.md`
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
    - prompt-validator       # Optional - for continuous prompt validation and SSOT compliance
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

Roep de agent aan met `@prompt-validator`:

```
@prompt-validator validate this prompt:
[your prompt here]
```

```
@prompt-validator check SSOT compliance for this prompt
```

```
@prompt-validator continuous monitoring setup
```

## Wat kan de agent doen?

### 1. Pre-Execution Validation
- Valideert prompts voordat ze gebruikt worden
- Controleert structuur en volledigheid
- Verifieert SSOT compliance
- Detecteert fouten proactief

### 2. SSOT Compliance Checking
- Valideert tegen standards.md requirements
- Controleert taalvereisten (English-only)
- Verifieert technologie stack compliance
- Valideert coding standards
- Controleert project-specifieke regels

### 3. Error Detection
- Syntax errors (typos, formatting)
- Logic errors (contradicties, circular dependencies)
- Ambiguity detection (vague instructions)
- Completeness errors (missing sections)

### 4. Quality Assurance
- Content quality assessment
- Best practices validation
- Industry standards compliance
- Prompt engineering standards

### 5. Continuous Monitoring
- On-going validation
- Compliance tracking
- Quality metrics
- Trend analysis

## Belangrijke Features

### Validation Framework

De agent gebruikt een uitgebreid validatie framework:

1. **Initial Scan**: Basis structuur en bestandsvalidatie
2. **Structure Validation**: Vereiste secties en organisatie
3. **Content Validation**: Kwaliteit en duidelijkheid
4. **SSOT Compliance**: standards.md alignment
5. **Error Detection**: Syntax, logic, en ambiguity checks
6. **Best Practices**: Prompt engineering standards

### SSOT Compliance

**Automatische standards.md Analyse:**

- Parse YAML frontmatter
- Extract technologie stack
- Identificeer coding standards
- Parse project-specifieke regels
- Genereer validatie criteria

**Compliance Checks:**

- Language requirements (English-only)
- Technology stack compliance
- Coding standards (indentation, naming)
- Project rules (authentication, styling)
- Quality standards (pre-flight checks, security)

### Error Detection

**Detecteert:**

1. **Syntax Errors**
   - Typos en spelling
   - Markdown formatting
   - Code block syntax
   - YAML syntax

2. **Logic Errors**
   - Contradictoire statements
   - Circular dependencies
   - Impossible requirements
   - Invalid flow

3. **Ambiguity**
   - Unclear pronouns
   - Vague references
   - Ambiguous instructions
   - Undefined terms

4. **Completeness**
   - Missing sections
   - Incomplete requirements
   - Missing examples
   - Incomplete checklists

## Validatie Process

### Phase 1: Initial Scan
- File structure check
- Basic structure validation
- SSOT reference check

### Phase 2: Structure Validation
- Required sections check
- Section order validation
- Organization assessment

### Phase 3: Content Validation
- Clarity check
- Specificity check
- Completeness check
- Accuracy check

### Phase 4: SSOT Compliance
- Language requirements
- Technology stack
- Coding standards
- Project rules
- Quality standards

### Phase 5: Error Detection
- Syntax errors
- Logic errors
- Ambiguity detection
- Completeness errors

### Phase 6: Best Practices
- Prompt structure
- Prompt engineering
- Industry standards

## Voorbeelden

### Pre-Execution Validation

```
@prompt-validator validate this prompt before I use it:
[your prompt]
```

**Output**: Comprehensive validation report with:
- Overall status (PASS/WARNINGS/FAIL)
- SSOT compliance score
- Issues found (critical/warnings/recommendations)
- Corrected version (if needed)
- Next steps

### SSOT Compliance Check

```
@prompt-validator check SSOT compliance for this prompt
```

**Output**: Detailed compliance report:
- Language requirements compliance
- Technology stack compliance
- Coding standards compliance
- Project rules compliance
- Quality standards compliance
- Non-compliance issues (if any)

### Continuous Monitoring

```
@prompt-validator setup continuous monitoring for my prompts
```

**Output**: Monitoring setup with:
- Validation frequency
- Compliance tracking
- Quality metrics
- Trend analysis
- Action items

## Integratie met Toolkit Workflow

De Prompt Validator integreert naadloos met:

- **Prompt Engineering Specialist**: Valideert gegenereerde prompts
- **SSOT (standards.md)**: Gebruikt als single source of truth
- **Other Agents**: Valideert prompts voor alle agents
- **Validation Scripts**: Werkt samen met `scripts/validate.js`

## Best Practices voor Gebruik

1. **Validate Before Use**: Valideer prompts voordat je ze gebruikt
2. **Check SSOT Compliance**: Verifieer altijd SSOT compliance
3. **Fix Critical Issues**: Los kritieke issues eerst op
4. **Monitor Continuously**: Zet continuous monitoring op
5. **Iterate**: Fix issues en re-valideer

## Validatie Checklist

Voor elke prompt, controleer:

- [ ] **Structure Complete**: Alle vereiste secties aanwezig
- [ ] **SSOT Compliant**: Volgt alle standards.md requirements
- [ ] **Content Quality**: Duidelijk, specifiek, actiegericht
- [ ] **Error Free**: Geen syntax, logic, of ambiguity errors
- [ ] **Best Practices**: Volgt prompt engineering standards
- [ ] **Complete**: Niets ontbreekt of incompleet
- [ ] **Actionable**: Biedt specifieke fixes en aanbevelingen

## Resources

- **Agent Documentatie**: `agents/dev-tools/prompt-validator.md`
- **SSOT Reference**: `config/standards.md`
- **Comprehensive Validator**: `prompts/validators/standards.md`
- **Toolkit Documentatie**: `/docs/`

## Volgende Stappen

1. ✅ Agent bestand aangemaakt
2. ✅ Documentatie bijgewerkt
3. ✅ Code integratie voltooid
4. ⏭️ Voeg toe aan je project's `standards.md`
5. ⏭️ Run `bun scripts/sync.js`
6. ⏭️ Test met `@prompt-validator`

---

*Deze agent zorgt ervoor dat alle prompts correct, compleet en volledig compliant zijn met SSOT standaarden voordat ze gebruikt worden.*
