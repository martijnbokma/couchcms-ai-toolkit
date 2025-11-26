# Refactor Modules

Validate and refactor modules in the `modules/` directory to ensure consistency, completeness, and quality.

## When to Use

Use this command when you want to:
- Validate module structure and frontmatter
- Check module dependencies and conflicts
- Ensure content quality and completeness
- Fix inconsistencies across modules
- Validate skill-rules.json files
- Standardize module format

## Validation Checks

### Frontmatter Validation

**Required Fields:**
- [ ] `id` - Module identifier (kebab-case, matches filename)
- [ ] `name` - Display name (Title Case)
- [ ] `description` - Brief description (50-160 chars)
- [ ] `version` - Version string (e.g., "2.x", "5.x")

**Optional Fields:**
- [ ] `category` - Module category (frontend, backend, cms, etc.)
- [ ] `required` - Boolean (default: false)
- [ ] `requires` - Array of module dependencies
- [ ] `conflicts` - Array of incompatible modules

### Content Quality

**Structure:**
- [ ] Has clear sections (Configuration, Patterns, Examples, Rules)
- [ ] Includes working code examples with titles
- [ ] Documents critical rules (🚨 emoji for critical)
- [ ] Shows correct/incorrect examples
- [ ] Includes best practices

**Code Examples:**
- [ ] All code blocks have descriptive titles
- [ ] Examples are complete and working
- [ ] Proper syntax highlighting
- [ ] Includes context and explanation

**Critical Rules:**
- [ ] Uses 🚨 emoji for critical rules
- [ ] Explains why the rule exists
- [ ] Shows both ❌ BAD and ✅ GOOD examples

### Dependency Validation

- [ ] All `requires` modules exist
- [ ] No circular dependencies
- [ ] `conflicts` modules are valid
- [ ] Dependencies are properly declared

### File Structure

- [ ] Module file exists: `modules/{id}.md`
- [ ] Skill rules file exists (optional): `modules/{id}.skill-rules.json`
- [ ] Filename matches `id` field
- [ ] No orphaned skill-rules files

### Skill Rules Validation

If `{id}.skill-rules.json` exists:
- [ ] Valid JSON format
- [ ] Contains `skill-name` object
- [ ] Has `description` field
- [ ] Has `rules` array
- [ ] Rules are non-empty strings

## Step-by-Step Process

### Phase 1: Discovery & Baseline (Read-Only)

**Objective:** Establish current state without modifications.

1. **Inventory Modules**
   - List all modules in `modules/` directory
   - Count total modules (excluding README.md)
   - Identify module categories (frontend, backend, cms, etc.)
   - Check for skill-rules.json files

2. **Read Module Files**
   - Parse frontmatter for each module
   - Extract content structure (sections, headings)
   - Count code blocks and verify titles
   - Check for critical rules (🚨)
   - Note dependency relationships

3. **Read Reference Materials**
   - Load `standards.md` for coding standards
   - Load corresponding agents (if exist) for pattern comparison
   - Load `modules/README.md` for structure guidelines
   - Load `docs/EXTENDING-MODULES.md` for extension patterns
   - Load `prompts/best-practices/` for best practices

4. **Read Documentation Sources**
   - Check CouchCMS documentation (if available)
   - Review framework documentation (TailwindCSS, Alpine.js, etc.)
   - Identify latest patterns and practices

5. **Establish Baseline**
   - Document current frontmatter completeness
   - Document current section structure
   - Document code block title coverage
   - Document critical rules presence
   - Document dependency graph
   - Create baseline statistics

**Output:** Baseline report with current state metrics

### Phase 2: Validation & Analysis

**Objective:** Identify all issues and categorize by priority.

1. **Frontmatter Validation**
   - Check required fields (id, name, description, version)
   - Validate YAML syntax and formatting
   - Verify id matches filename (kebab-case)
   - Check optional fields (category, required, requires, conflicts)
   - Verify description length (20-200 chars)

2. **Structure Validation**
   - Verify required sections (Configuration, Patterns, Examples, Rules)
   - Check section naming consistency
   - Validate heading hierarchy (no skipped levels)
   - Check for critical rules section

3. **Code Quality Validation**
   - Count code blocks with/without titles
   - Verify syntax highlighting
   - Check for complete examples
   - Identify missing ✅/❌ examples
   - Verify code examples are working

4. **Dependency Validation**
   - Check all `requires` modules exist
   - Detect circular dependencies
   - Verify `conflicts` modules are valid
   - Validate dependency declarations
   - Check for self-dependencies

5. **Skill Rules Validation**
   - Check if `{id}.skill-rules.json` exists
   - Validate JSON format
   - Verify structure (skill-name, description, rules)
   - Check for orphaned skill-rules files

6. **Best Practices Validation**
   - Check for critical rules with 🚨 emoji
   - Verify English-only content
   - Check indentation (4 spaces)
   - Validate pattern consistency

7. **Documentation Alignment**
   - Compare with corresponding agent (if exists)
   - Check pattern consistency with agents
   - Verify terminology matches
   - Check version compatibility
   - Compare with framework documentation

**Output:** Detailed validation report with categorized issues

### Phase 3: Prioritization & Planning

**Objective:** Create actionable fix plan.

1. **Categorize Issues**
   - **CRITICAL** (must fix): Missing required fields, invalid dependencies, circular deps
   - **HIGH** (should fix): Missing code titles, missing critical rules, broken examples
   - **MEDIUM** (nice to have): Missing category, YAML formatting, optional sections
   - **LOW** (optional): Missing skill-rules, minor formatting

2. **Identify Auto-Fixable**
   - Code block titles (use `scripts/fix-module-code-titles.js`)
   - YAML formatting
   - Indentation fixes
   - JSON formatting (skill-rules)

3. **Identify Manual Review**
   - Missing required sections
   - Invalid dependencies
   - Circular dependencies
   - Outdated patterns
   - Documentation misalignment
   - Missing critical rules

4. **Create Fix Plan**
   - List auto-fixable issues with scripts
   - List manual review items with recommendations
   - Resolve dependency conflicts
   - Estimate effort per category
   - Define success criteria

**Output:** Prioritized fix plan with action items

### Phase 4: Automated Fixes

**Objective:** Apply safe, automated fixes.

1. **Run Code Title Script**
   ```bash
   bun scripts/fix-module-code-titles.js
   ```
   - Adds titles to all code blocks
   - Uses context (headings, filenames) to generate titles
   - Preserves frontmatter format
   - Safe to run multiple times

2. **Run Module Fix Script**
   ```bash
   bun scripts/fix-modules.js
   ```
   - Fixes descriptions, naming, category metadata
   - Standardizes frontmatter format
   - Updates module metadata

3. **Verify Automated Fixes**
   - Re-scan fixed files
   - Confirm changes applied correctly
   - Check for regressions
   - Verify dependencies still valid

**Output:** Report of automated fixes applied

### Phase 5: Manual Review & Updates

**Objective:** Address issues requiring human judgment.

1. **Resolve Dependency Issues**
   - Fix invalid dependencies
   - Resolve circular dependencies
   - Update dependency declarations
   - Verify all dependencies exist

2. **Review Each Module**
   - Check against corresponding agent
   - Verify patterns are current
   - Ensure terminology consistency
   - Add missing critical rules where relevant

3. **Update Content**
   - Add missing sections (Critical Rules, Best Practices)
   - Add critical rules with 🚨 emoji
   - Update outdated patterns
   - Add missing examples
   - Sync with framework documentation

4. **Documentation Sync**
   - Ensure module matches agent patterns (if agent exists)
   - Update version information
   - Add cross-references
   - Verify alignment with standards

5. **Skill Rules Updates**
   - Create missing skill-rules.json files
   - Update existing skill-rules
   - Ensure rules match module content
   - Remove orphaned skill-rules files

**Output:** Manual updates report

### Phase 6: Verification & Final Check

**Objective:** Confirm all fixes and validate final state.

1. **Re-validate All Modules**
   - Run full validation again
   - Check all issues are resolved
   - Verify no regressions introduced
   - Check dependency graph is valid

2. **Compare Against Baseline**
   - Code block titles: X% → 100%
   - Critical rules: X% → Target coverage
   - Dependencies: Validated
   - Documentation alignment: Partial → Full

3. **Generate Final Report**
   - Summary of fixes applied
   - Remaining issues (if any)
   - Recommendations for future maintenance
   - Statistics comparison (before/after)
   - Dependency graph visualization

**Output:** Final validation report with before/after metrics

### Phase 7: Maintenance Plan

**Objective:** Establish ongoing maintenance process.

1. **Create Maintenance Checklist**
   - Regular validation schedule
   - Update triggers (agent changes, standards updates, framework updates)
   - Review frequency recommendations
   - Dependency update process

2. **Document Best Practices**
   - When to update modules
   - How to keep modules in sync with agents
   - How to add new modules following patterns
   - How to extend modules from documentation

3. **Automation Recommendations**
   - CI/CD checks for module validation
   - Pre-commit hooks for code block titles
   - Automated sync with agents
   - Dependency validation in CI

**Output:** Maintenance guidelines and recommendations

## Usage

```
/refactor-modules
/refactor-modules @modules/typescript.md
/refactor-modules --fix
/refactor-modules --strict
```

### Options

- `@modules/{module}.md` - Validate specific module
- `--fix` - Automatically fix non-breaking issues
- `--strict` - Fail on warnings (not just errors)

## Output Format

```
📚 Module Validation Report

✅ PASSED: 12 modules
⚠️  WARNINGS: 3 modules
   - typescript.md: Missing category field
   - alpinejs.md: Code example without title
   - comments.md: Skill rules missing description

❌ ERRORS: 1 module
   - invalid-module.md: Missing required field 'id'

📊 Module Statistics:
   - Total modules: 16
   - With skill rules: 15
   - Dependencies: 8
   - Conflicts: 0
```

## Common Issues

### Missing Frontmatter Fields

```yaml
# ❌ Missing required fields
---
id: typescript
---

# ✅ Complete frontmatter
---
id: typescript
name: "TypeScript"
category: "frontend"
version: "5.x"
description: "TypeScript standards and patterns"
required: false
requires: []
conflicts: []
---
```

### Incomplete Code Examples

```markdown
# ❌ Missing title
```typescript
export interface User {}
```

# ✅ With title
```typescript title="user-profile.ts"
export interface User {}
```
```

### Missing Critical Rules

```markdown
# ❌ No critical rules section
## Patterns
...

# ✅ With critical rules
## 🚨 CRITICAL: Type Safety
- **NEVER** use `any` type
- Always define explicit interfaces
```

### Invalid Dependencies

```yaml
# ❌ Invalid dependency
requires: [non-existent-module]

# ✅ Valid dependencies
requires: [couchcms-core, tailwindcss]
```

## Automated Fixes

### Available Scripts

**1. Fix Code Block Titles**
```bash
bun scripts/fix-module-code-titles.js
bun scripts/fix-module-code-titles.js --dry-run
bun scripts/fix-module-code-titles.js @modules/typescript.md
```
- Automatically adds titles to code blocks
- Uses context (headings, filenames) to generate titles
- Preserves frontmatter format
- Safe to run multiple times

**2. Fix Module Metadata**
```bash
bun scripts/fix-modules.js
bun scripts/fix-modules.js --dry-run
```
- Fixes descriptions, naming, category metadata
- Standardizes frontmatter format
- Updates module metadata from MODULE_METADATA

**3. Validate Modules**
```bash
bun scripts/validate-modules.js
bun scripts/validate-modules.js --fix
bun scripts/validate-modules.js --strict
```
- Validates all modules against standards
- Checks frontmatter, structure, dependencies
- Reports issues with severity levels
- Can auto-fix non-breaking issues

**4. Extend Modules from Documentation**
```bash
bun scripts/extend-modules.js --analyze
bun scripts/extend-modules.js --module typescript
bun scripts/extend-modules.js --module typescript --dry-run
```
- Extracts content from CouchCMS documentation
- Adds patterns and examples to modules
- Keeps modules up-to-date with documentation

### Auto-Fixable Issues

**High Priority (Run Scripts):**
- ✅ Code block titles missing → `fix-module-code-titles.js`
- ✅ Module metadata issues → `fix-modules.js`
- ✅ YAML formatting issues → Manual fix (simple)
- ✅ Indentation issues → Manual fix (simple)
- ✅ JSON formatting (skill-rules) → Manual fix (simple)

**Medium Priority (Manual but Easy):**
- ⚠️ Missing optional frontmatter fields (category, required)
- ⚠️ Extra blank lines after frontmatter
- ⚠️ Trailing whitespace
- ⚠️ Skill-rules formatting

### Manual Review Required

**Critical (Must Fix):**
- ❌ Missing required frontmatter fields (id, name, description, version)
- ❌ Invalid dependencies (module doesn't exist)
- ❌ Circular dependencies
- ❌ Self-dependencies
- ❌ Broken code examples

**High Priority (Should Fix):**
- ⚠️ Missing critical rules section (🚨)
- ⚠️ Outdated patterns or examples
- ⚠️ Documentation misalignment with agents
- ⚠️ Missing skill-rules.json (if needed)
- ⚠️ ID/filename mismatch

**Medium Priority (Nice to Have):**
- 💡 Missing category field
- 💡 Missing optional sections
- 💡 Inconsistent terminology
- 💡 Missing cross-references

### Documentation Sync Process

**Step 1: Identify Corresponding Agent**
```bash
# Check if agent exists
ls agents/{module-name}.md
```

**Step 2: Compare Patterns**
- Read corresponding agent
- Compare code examples
- Check for pattern differences
- Note missing examples in module

**Step 3: Check Documentation Sources**
- Review CouchCMS documentation
- Check framework documentation (TailwindCSS, Alpine.js, etc.)
- Identify latest patterns
- Note version-specific features

**Step 4: Update Module**
- Add missing patterns from agent/documentation
- Update outdated patterns
- Ensure terminology matches
- Add cross-references
- Update version information

**Step 5: Verify**
- Run `/refactor-modules --check-docs`
- Ensure alignment is complete
- Test examples work correctly
- Verify dependencies are valid

### Keeping Modules Up-to-Date

**Automated Checks:**
1. **Pre-commit Hook** (Recommended)
   ```bash
   # .git/hooks/pre-commit
   bun scripts/fix-module-code-titles.js
   bun scripts/validate-modules.js
   ```

2. **CI/CD Validation** (Recommended)
   ```yaml
   # .github/workflows/validate-modules.yml
   - name: Validate Modules
     run: bun scripts/validate-modules.js
   ```

3. **Regular Extension** (Recommended)
   ```bash
   # Extend modules from documentation
   bun scripts/extend-modules.js --module {name}
   ```

**Manual Review Schedule:**
- **Weekly:** Quick check for new issues
- **Monthly:** Run full validation
- **Quarterly:** Complete refactor with agent sync
- **On-demand:** When agents, standards, or documentation change

## Safety

Before refactoring:
- [ ] Backup modules directory
- [ ] Check impact on projects using toolkit
- [ ] Verify `bun scripts/sync.js` still works
- [ ] Test with `bun scripts/validate.js`

## Best Practices Compliance

### Module Structure Best Practices

**Required Pattern:**
```markdown
# Module Name Standards

## Configuration
<!-- Setup and configuration examples -->

## Naming Conventions
<!-- Naming standards -->

## Type Definitions
<!-- Type/interface patterns -->

## Function Patterns
<!-- Function implementation patterns -->

## 🚨 CRITICAL: Rule Name
<!-- Critical rules with emoji -->

## Best Practices
<!-- Recommended approaches -->
```

**Checklist:**
- [ ] Has clear sections (Configuration, Patterns, Examples, Rules)
- [ ] Includes working code examples with titles
- [ ] Documents critical rules (🚨 emoji for critical)
- [ ] Shows correct/incorrect examples (✅/❌)
- [ ] Includes best practices section
- [ ] Uses proper heading hierarchy

### Code Examples Best Practices

**Required Standards:**
- [ ] All code blocks have descriptive titles: ````json title="tsconfig.json"`
- [ ] Examples are complete and working (no placeholders)
- [ ] Shows both correct (✅) and incorrect (❌) examples where relevant
- [ ] Includes context and explanation
- [ ] Uses proper syntax highlighting
- [ ] File paths match actual project structure

**Example Format:**
```markdown
### TypeScript Configuration

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Why:** Strict mode enables all type checking options for maximum safety.
```

### Critical Rules Best Practices

**Required Format:**
```markdown
## 🚨 CRITICAL: Rule Name

**Why This Matters:** Brief explanation of why the rule exists.

- **NEVER** do X (explain why)
- **ALWAYS** do Y (explain why)

```typescript title="bad.ts"
// ❌ BAD: Example of what NOT to do
```

```typescript title="good.ts"
// ✅ GOOD: Example of correct approach
```
```

**Checklist:**
- [ ] Uses 🚨 emoji for critical rules
- [ ] Explains why rules exist (not just what)
- [ ] Shows visual examples (✅/❌)
- [ ] Documents security considerations
- [ ] References relevant documentation
- [ ] Updates when patterns change

### Dependency Management Best Practices

**Dependency Declaration:**
```yaml
---
id: alpinejs
name: "Alpine.js"
requires: [couchcms-core]  # Dependencies
conflicts: []              # Incompatible modules
---
```

**Checklist:**
- [ ] All `requires` modules exist
- [ ] No circular dependencies
- [ ] `conflicts` modules are valid
- [ ] Dependencies are properly declared
- [ ] No self-dependencies

### Skill Rules Best Practices

**Required Structure:**
```json
{
  "skill-name": {
    "description": "What this skill does",
    "rules": [
      "Rule 1 - specific and actionable",
      "Rule 2 - follows standards.md",
      "Rule 3 - includes examples"
    ]
  }
}
```

**Checklist:**
- [ ] Valid JSON format
- [ ] Contains `skill-name` object
- [ ] Has `description` field
- [ ] Has `rules` array
- [ ] Rules are non-empty strings
- [ ] Rules match module content

### Documentation Alignment Best Practices

**Agent Sync Process:**
1. **Check Corresponding Agent**
   - If `agents/{module-name}.md` exists, compare patterns
   - Ensure module examples match agent examples
   - Verify terminology consistency

2. **Pattern Consistency**
   - Use same code patterns as agent
   - Follow same naming conventions
   - Match same structure where applicable

3. **Version Compatibility**
   - Note minimum version requirements
   - Document breaking changes
   - Reference version-specific features

4. **Cross-References**
   - Link to agent documentation
   - Reference related modules
   - Link to framework documentation

**Checklist:**
- [ ] Matches corresponding agent patterns (if agent exists)
- [ ] Uses consistent terminology with agents
- [ ] Follows current best practices from `standards.md`
- [ ] References correct versions
- [ ] Includes links to related documentation
- [ ] Updates when agents change

### Content Quality Best Practices

**Completeness Standards:**
- [ ] Covers all core patterns for the module's domain
- [ ] Includes common use cases (80% scenarios)
- [ ] Documents edge cases and gotchas
- [ ] Provides working examples for each pattern
- [ ] Includes configuration examples

**Accuracy Standards:**
- [ ] Code examples are correct and tested
- [ ] Patterns follow current best practices
- [ ] No deprecated patterns or warnings
- [ ] Version information is accurate
- [ ] Framework versions are current

**Clarity Standards:**
- [ ] Clear, concise explanations
- [ ] Logical organization (simple → complex)
- [ ] Helpful examples with context
- [ ] Easy to scan and find information
- [ ] Uses tables for quick reference

### Maintenance Best Practices

**Update Triggers:**
- [ ] When corresponding agent is updated
- [ ] When `standards.md` changes
- [ ] When framework documentation updates (TailwindCSS, Alpine.js, etc.)
- [ ] When CouchCMS documentation updates
- [ ] When new best practices emerge
- [ ] When breaking changes occur

**Sync Process:**
1. Run `/refactor-modules --check-docs` to identify misalignments
2. Compare module with corresponding agent
3. Check framework documentation for updates
4. Update patterns to match current best practices
5. Add missing examples from agent/documentation
6. Update version information
7. Re-validate after updates

**Extension Process:**
1. Run `bun scripts/extend-modules.js --analyze` to see available content
2. Run `bun scripts/extend-modules.js --module {name}` to extend
3. Review added content for accuracy
4. Ensure new content follows module structure
5. Re-validate after extension

**Review Schedule:**
- **Monthly:** Quick validation check
- **Quarterly:** Full refactor with agent sync
- **On-demand:** When agents, standards, or documentation change

## Usage Examples

### Complete Refactor Workflow

```
/refactor-modules

"Run complete refactor workflow: validate all modules, identify issues,
apply automated fixes, sync with agents, and generate maintenance plan"
```

**This will:**
1. Scan all modules (Phase 1)
2. Validate and analyze (Phase 2)
3. Create fix plan (Phase 3)
4. Apply automated fixes (Phase 4)
5. Report manual review items (Phase 5)
6. Verify fixes (Phase 6)
7. Generate maintenance plan (Phase 7)

### Quick Validation

```
/refactor-modules --quick

"Quick validation check without full analysis"
```

**This will:**
- Run basic validation checks
- Report critical issues only
- Skip detailed analysis

### Fix Specific Module

```
/refactor-modules @modules/typescript.md --fix

"Fix frontmatter, add code titles, and standardize structure for typescript module"
```

**This will:**
- Focus on single module
- Apply all automated fixes
- Report manual review items

### Check Documentation Alignment

```
/refactor-modules --check-docs

"Compare all modules against agents and documentation, report misalignments"
```

**This will:**
- Compare each module with corresponding agent
- Check pattern consistency
- Verify terminology matches
- Check against framework documentation
- Report alignment status

### Strict Validation

```
/refactor-modules --strict

"Fail on any warnings, not just errors. Use for CI/CD validation."
```

**This will:**
- Treat warnings as errors
- Exit with error code if issues found
- Suitable for automated checks

### Update Single Module

```
/refactor-modules @modules/alpinejs.md --update

"Update alpinejs module: sync with agent, add missing patterns, update examples"
```

**This will:**
- Compare with `agents/alpinejs.md`
- Check Alpine.js documentation
- Add missing patterns from agent
- Update outdated examples
- Ensure terminology consistency

### Extend from Documentation

```
/refactor-modules @modules/comments.md --extend

"Extend comments module from CouchCMS documentation"
```

**This will:**
- Use `scripts/extend-modules.js`
- Extract content from documentation
- Add patterns and examples
- Keep module up-to-date

### Maintenance Mode

```
/refactor-modules --maintenance

"Run maintenance checks: validate all modules, check for updates needed,
generate maintenance report"
```

**This will:**
- Run full validation
- Check for agent updates
- Check for documentation updates
- Identify stale content
- Generate maintenance recommendations

## Integration & Automation

### Scripts Integration

**Available Scripts:**
- `scripts/fix-module-code-titles.js` - Auto-fix code block titles
- `scripts/fix-modules.js` - Fix module metadata and descriptions
- `scripts/validate-modules.js` - Full validation suite
- `scripts/extend-modules.js` - Extend modules from documentation
- `scripts/analyze-modules.js` - Analyze module structure
- `scripts/sync.js` - Sync AI configs (validates modules)

### Command Integration

**Related Commands:**
- `/refactor-agents` - Validate and fix agents (sync with modules)
- `/refactor-toolkit` - Refactor toolkit components
- `/validate-code` - Validate code against standards

### Workflow Integration

**Recommended Workflow:**
1. Update documentation → Run `bun scripts/extend-modules.js --module {name}`
2. Update module → Run `/refactor-modules @modules/{name}.md --update`
3. Sync agents → Run `/refactor-agents --check-docs`
4. Validate → Run `bun scripts/validate-modules.js`
5. Sync configs → Run `bun scripts/sync.js`

### CI/CD Integration

**GitHub Actions Example:**
```yaml
name: Validate Modules

on:
  pull_request:
    paths:
      - 'modules/**'
      - 'agents/**'
      - 'standards.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun scripts/fix-module-code-titles.js --dry-run
      - run: bun scripts/validate-modules.js --strict
```

### Pre-commit Hook

**Example Hook:**
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Validating modules..."
bun scripts/fix-module-code-titles.js
bun scripts/validate-modules.js

if [ $? -ne 0 ]; then
    echo "Module validation failed. Please fix issues before committing."
    exit 1
fi
```

## Reference Standards & Documentation

### Primary References

**Project Standards:**
- `standards.md` - Project coding standards (single source of truth)
- `USER-RULES.md` - User-specific coding rules
- `.cursorrules` - Cursor IDE rules (auto-generated from standards)

**Module Guidelines:**
- `modules/README.md` - Module structure guidelines
- `docs/MODULES.md` - Available modules documentation
- `docs/EXTENDING-MODULES.md` - How to extend modules from documentation
- `commands/refactor-modules.md` - This document

**Agent References:**
- `agents/README.md` - Agent patterns for alignment
- `docs/AGENTS.md` - Available agents documentation
- `commands/refactor-agents.md` - Agent refactoring guide

**Best Practices:**
- `prompts/best-practices/claude-code-best-practices.md` - AI best practices
- `prompts/best-practices/javascript-best-practices.md` - JS best practices
- `prompts/best-practices/typescript-best-practices.md` - TS best practices
- `prompts/best-practices/toolkit-optimization.md` - Toolkit optimization

### Validation Checklist

**Before Running Refactor:**
- [ ] Read `standards.md` to understand current standards
- [ ] Check `modules/README.md` for structure guidelines
- [ ] Review corresponding agent (if exists) for patterns
- [ ] Understand current best practices
- [ ] Check framework documentation for updates

**During Refactor:**
- [ ] Follow step-by-step process (Phases 1-7)
- [ ] Apply automated fixes first
- [ ] Resolve dependency issues carefully
- [ ] Review manual items carefully
- [ ] Verify against standards after each phase

**After Refactor:**
- [ ] Run full validation: `bun scripts/validate-modules.js`
- [ ] Test sync: `bun scripts/sync.js`
- [ ] Verify no regressions
- [ ] Check dependency graph is valid
- [ ] Update CHANGELOG.md if significant changes

## Quick Reference

### Workflow Summary

```
Phase 1: Discovery → Phase 2: Validation → Phase 3: Planning
    ↓                        ↓                      ↓
Phase 4: Auto-Fix → Phase 5: Manual Review → Phase 6: Verify
    ↓                        ↓                      ↓
                    Phase 7: Maintenance Plan
```

### Common Commands

```bash
# Complete refactor (all phases)
/refactor-modules

# Quick validation
/refactor-modules --quick

# Fix specific module
/refactor-modules @modules/{name}.md --fix

# Check documentation alignment
/refactor-modules --check-docs

# Update single module with agent
/refactor-modules @modules/{name}.md --update

# Extend from documentation
/refactor-modules @modules/{name}.md --extend

# Maintenance mode
/refactor-modules --maintenance

# Strict validation (CI/CD)
/refactor-modules --strict
```

### Automated Scripts

```bash
# Fix code block titles
bun scripts/fix-module-code-titles.js

# Fix module metadata
bun scripts/fix-modules.js

# Full validation
bun scripts/validate-modules.js

# Extend from documentation
bun scripts/extend-modules.js --module {name}

# Analyze module structure
bun scripts/analyze-modules.js
```

### Priority Matrix

| Priority | Issue Type | Action | Script |
|----------|------------|--------|--------|
| **CRITICAL** | Missing required fields | Manual fix | - |
| **CRITICAL** | Invalid dependencies | Manual fix | - |
| **CRITICAL** | Circular dependencies | Manual fix | - |
| **HIGH** | Missing code titles | Auto-fix | `fix-module-code-titles.js` |
| **HIGH** | Missing critical rules | Manual review | - |
| **MEDIUM** | Missing category | Auto-fix | `fix-modules.js` |
| **MEDIUM** | YAML formatting | Manual fix | - |
| **LOW** | Missing skill-rules | Optional | - |

### Maintenance Schedule

- **Weekly:** Quick validation check
- **Monthly:** Full validation run
- **Quarterly:** Complete refactor with agent sync
- **On-demand:** When agents/standards/documentation change

## See Also

- [Module README](../modules/README.md) - Module structure guidelines
- [Refactor Agents](./refactor-agents.md) - Agent refactoring guide
- [Refactor Toolkit](./refactor-toolkit.md) - Toolkit component refactoring
- [Extending Modules](../docs/EXTENDING-MODULES.md) - How to extend modules
- [Available Modules](../docs/MODULES.md) - Complete module list
- [Available Agents](../docs/AGENTS.md) - Agent reference for alignment
