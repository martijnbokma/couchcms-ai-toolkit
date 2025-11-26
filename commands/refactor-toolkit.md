# Refactor Toolkit

Refactor or optimize components of the CouchCMS AI Toolkit itself.

## When to Use

Use this command when you want to:
- Refactor toolkit scripts (`scripts/*.js`)
- Optimize configuration files (`*.yaml`, `defaults.yaml`)
- Improve prompt structure (`prompts/**/*.md`)
- Refactor modules (`modules/*.md`)
- Optimize agents (`agents/*.md`)
- Refactor rules (`rules/*.mdc`)
- Improve commands (`commands/*.md`)

## Process

1. **Identify Component** - Select the toolkit component to refactor
2. **Load Specialist** - Load `@prompts/refactoring/toolkit.md` specialist
3. **Analyze** - Understand current structure and dependencies
4. **Plan** - Create refactoring plan with impact analysis
5. **Execute** - Apply changes with verification
6. **Document** - Update CHANGELOG.md and documentation

## Usage

```
/refactor-toolkit @scripts/sync.js
/refactor-toolkit @prompts/refactoring/router.md
/refactor-toolkit @modules/typescript.md
```

## Optimization

For performance optimization, also reference:
- `@prompts/best-practices/toolkit-optimization.md`

## Safety

Before refactoring:
- [ ] Backup current code
- [ ] Identify all dependencies
- [ ] Check impact on projects using toolkit
- [ ] Verify `bun scripts/sync.js` still works
- [ ] Verify `bun scripts/validate.js` still works

## Output

Provide:
1. Analysis of current structure
2. Refactoring plan
3. Before/after examples
4. Dependencies updated
5. CHANGELOG.md entry
6. Migration notes (if breaking changes)

## Examples

### Refactor Script

```
/refactor-toolkit @scripts/sync.js

"Extract configuration loading into separate functions"
```

### Optimize Prompt

```
/refactor-toolkit @prompts/refactoring/router.md

"Optimize router logic and improve error handling"
```

### Refactor Module

```
/refactor-toolkit @modules/typescript.md

"Standardize module structure and add examples"
```
