# Refactor Agents

Validate and refactor agents in the `agents/` directory to ensure consistency, completeness, and alignment with documentation and best practices.

## When to Use

Use this command when you want to:
- Validate agent structure and frontmatter
- Check agents against documentation standards
- Ensure agents follow best practices
- Fix inconsistencies across agents
- Update agents with latest patterns
- Verify agent content quality

## Validation Checks

### Frontmatter Validation

**Required Fields:**
- [ ] `name` - Agent display name (Title Case)
- [ ] `version` - Version string (e.g., "2.0", "1.0")
- [ ] `type` - Agent type (usually "combined")
- [ ] `description` - Brief description (50-160 chars)

**Optional Fields:**
- [ ] `tags` - Array of relevant tags
- [ ] `requires` - Array of module dependencies

**Format Validation:**
- [ ] Frontmatter uses YAML format with `---` delimiters
- [ ] Single blank line after frontmatter
- [ ] No trailing whitespace
- [ ] Proper YAML syntax (quotes for special chars)

### Content Structure

**Required Sections:**
- [ ] Agent title (H1 matching `name`)
- [ ] Quick Reference section (for daily use patterns)
- [ ] Common Patterns section (frequently used examples)
- [ ] Deep Dive section (advanced patterns, optional but recommended)

**Optional Sections:**
- [ ] Troubleshooting
- [ ] Best Practices
- [ ] Integration Notes
- [ ] Reference links

**Structure Quality:**
- [ ] Clear section hierarchy (H1 → H2 → H3)
- [ ] Consistent formatting across sections
- [ ] Logical content flow
- [ ] No skipped heading levels

### Code Examples

**Quality Standards:**
- [ ] All code blocks have descriptive titles
- [ ] Examples are complete and working
- [ ] Proper syntax highlighting
- [ ] Includes context and explanation
- [ ] Shows both correct (✅) and incorrect (❌) examples where relevant

**Code Block Titles:**
- [ ] Use descriptive titles (e.g., `php title="template.php"`)
- [ ] Include file paths when relevant
- [ ] Use consistent naming patterns

### Best Practices Compliance

**Documentation Standards:**
- [ ] Follows `standards.md` guidelines
- [ ] Uses English only (no non-English content)
- [ ] Proper indentation (4 spaces)
- [ ] Consistent formatting

**Critical Rules:**
- [ ] Uses 🚨 emoji for critical rules
- [ ] Explains why rules exist
- [ ] Shows both ❌ BAD and ✅ GOOD examples
- [ ] Documents security considerations

**Pattern Consistency:**
- [ ] Matches patterns from corresponding modules
- [ ] Uses same terminology as documentation
- [ ] Follows CouchCMS conventions
- [ ] Aligns with framework standards

### Documentation Alignment

**Module Correspondence:**
- [ ] Agent content aligns with corresponding module (if exists)
- [ ] Patterns match module examples
- [ ] Terminology consistent with modules
- [ ] Version compatibility noted

**Standards Alignment:**
- [ ] Follows `standards.md` requirements
- [ ] Uses correct path variables (`{{paths.xxx}}`)
- [ ] Matches technology hierarchy
- [ ] Complies with coding standards

**Best Practices:**
- [ ] References Claude Code best practices
- [ ] Follows agent structure guidelines
- [ ] Uses Quick Reference + Deep Dive pattern
- [ ] Includes troubleshooting when relevant

### Content Quality

**Completeness:**
- [ ] Covers core use cases
- [ ] Includes common patterns
- [ ] Documents edge cases
- [ ] Provides working examples

**Accuracy:**
- [ ] Code examples are correct
- [ ] Patterns follow current best practices
- [ ] No deprecated patterns
- [ ] Version information accurate

**Clarity:**
- [ ] Clear explanations
- [ ] Logical organization
- [ ] Helpful examples
- [ ] Easy to scan and find information

## Step-by-Step Process

### Phase 1: Discovery & Baseline (Read-Only)

**Objective:** Establish current state without modifications.

1. **Inventory Agents**
   - List all agents in `agents/` directory
   - Count total agents (excluding README.md)
   - Identify agent categories (core, frontend, backend, etc.)

2. **Read Agent Files**
   - Parse frontmatter for each agent
   - Extract content structure (sections, headings)
   - Count code blocks and identify missing titles
   - Note section naming inconsistencies

3. **Read Reference Materials**
   - Load `standards.md` for coding standards
   - Load corresponding modules (if exist) for pattern comparison
   - Load `agents/README.md` for structure guidelines
   - Load `prompts/best-practices/claude-code-best-practices.md`

4. **Establish Baseline**
   - Document current frontmatter completeness
   - Document current section structure
   - Document code block title coverage
   - Document critical rules presence
   - Create baseline statistics

**Output:** Baseline report with current state metrics

### Phase 2: Validation & Analysis

**Objective:** Identify all issues and categorize by priority.

1. **Frontmatter Validation**
   - Check required fields (name, version, type, description)
   - Validate YAML syntax and formatting
   - Check optional fields (tags, requires)
   - Verify description length (50-160 chars)

2. **Structure Validation**
   - Verify required sections (Quick Reference, Common Patterns, Deep Dive)
   - Check section naming consistency
   - Validate heading hierarchy (no skipped levels)
   - Check for optional sections (Troubleshooting, Best Practices)

3. **Code Quality Validation**
   - Count code blocks with/without titles
   - Verify syntax highlighting
   - Check for complete examples
   - Identify missing ✅/❌ examples

4. **Best Practices Validation**
   - Check for critical rules with 🚨 emoji
   - Verify English-only content
   - Check indentation (4 spaces)
   - Validate path variables (`{{paths.xxx}}`)

5. **Documentation Alignment**
   - Compare with corresponding modules
   - Check pattern consistency
   - Verify terminology matches
   - Check version compatibility

**Output:** Detailed validation report with categorized issues

### Phase 3: Prioritization & Planning

**Objective:** Create actionable fix plan.

1. **Categorize Issues**
   - **CRITICAL** (must fix): Missing required fields, broken structure
   - **HIGH** (should fix): Missing code titles, inconsistent sections
   - **MEDIUM** (nice to have): Missing critical rules, YAML formatting
   - **LOW** (optional): Missing troubleshooting, minor formatting

2. **Identify Auto-Fixable**
   - Code block titles (use `scripts/fix-agent-code-titles.js`)
   - Section renaming (use `scripts/fix-agent-sections.js`)
   - YAML formatting
   - Indentation fixes

3. **Identify Manual Review**
   - Missing required sections
   - Outdated patterns
   - Documentation misalignment
   - Missing critical rules

4. **Create Fix Plan**
   - List auto-fixable issues with scripts
   - List manual review items with recommendations
   - Estimate effort per category
   - Define success criteria

**Output:** Prioritized fix plan with action items

### Phase 4: Automated Fixes

**Objective:** Apply safe, automated fixes.

1. **Run Code Title Script**
   ```bash
   bun scripts/fix-agent-code-titles.js
   ```
   - Adds titles to all code blocks
   - Preserves frontmatter format
   - Reports fixed files

2. **Run Section Standardization**
   ```bash
   bun scripts/fix-agent-sections.js
   ```
   - Renames "Advanced Patterns" → "Deep Dive"
   - Ensures consistent section names

3. **Verify Automated Fixes**
   - Re-scan fixed files
   - Confirm changes applied correctly
   - Check for regressions

**Output:** Report of automated fixes applied

### Phase 5: Manual Review & Updates

**Objective:** Address issues requiring human judgment.

1. **Review Each Agent**
   - Check against corresponding module
   - Verify patterns are current
   - Ensure terminology consistency
   - Add missing critical rules where relevant

2. **Update Content**
   - Add missing sections (Troubleshooting, Best Practices)
   - Add critical rules with 🚨 emoji
   - Update outdated patterns
   - Add missing examples from modules

3. **Documentation Sync**
   - Ensure agent matches module patterns
   - Update version information
   - Add cross-references
   - Verify path variables

**Output:** Manual updates report

### Phase 6: Verification & Final Check

**Objective:** Confirm all fixes and validate final state.

1. **Re-validate All Agents**
   - Run full validation again
   - Check all issues are resolved
   - Verify no regressions introduced

2. **Compare Against Baseline**
   - Code block titles: 0% → 100%
   - Section consistency: Mixed → Standardized
   - Critical rules: 4% → Target coverage
   - Documentation alignment: Partial → Full

3. **Generate Final Report**
   - Summary of fixes applied
   - Remaining issues (if any)
   - Recommendations for future maintenance
   - Statistics comparison (before/after)

**Output:** Final validation report with before/after metrics

### Phase 7: Maintenance Plan

**Objective:** Establish ongoing maintenance process.

1. **Create Maintenance Checklist**
   - Regular validation schedule
   - Update triggers (module changes, standards updates)
   - Review frequency recommendations

2. **Document Best Practices**
   - When to update agents
   - How to keep agents in sync with modules
   - How to add new agents following patterns

3. **Automation Recommendations**
   - CI/CD checks for agent validation
   - Pre-commit hooks for code block titles
   - Automated sync with modules

**Output:** Maintenance guidelines and recommendations

## Usage

```
/refactor-agents
/refactor-agents @agents/typescript.md
/refactor-agents --fix
/refactor-agents --strict
/refactor-agents --check-docs
```

### Options

- `@agents/{agent}.md` - Validate specific agent
- `--fix` - Automatically fix non-breaking issues
- `--strict` - Fail on warnings (not just errors)
- `--check-docs` - Compare against documentation and modules

## Output Format

```
📚 Agent Validation Report

✅ PASSED: 15 agents
⚠️  WARNINGS: 3 agents
   - typescript.md: Missing Deep Dive section
   - alpinejs.md: Code example without title
   - comments.md: Frontmatter missing tags

❌ ERRORS: 1 agent
   - invalid-agent.md: Missing required field 'description'

📊 Agent Statistics:
   - Total agents: 19
   - With Quick Reference: 18
   - With Deep Dive: 15
   - With Troubleshooting: 12
   - Average examples per agent: 8.5

📖 Documentation Alignment:
   - ✅ Aligned with modules: 16
   - ⚠️  Partially aligned: 2
   - ❌ Not aligned: 1
```

## Common Issues

### Missing Frontmatter Fields

```yaml
# ❌ Missing required fields
---
name: TypeScript Agent
---

# ✅ Complete frontmatter
---
name: TypeScript Agent
version: "2.0"
type: combined
description: "Type-safe frontend code with TypeScript patterns"
tags:
  - typescript
  - frontend
  - type-safety
requires:
  - typescript
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
export interface User {
    id: string
    name: string
}
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
- Use strict TypeScript configuration

<!-- ❌ BAD -->
function process(data: any) { ... }

<!-- ✅ GOOD -->
interface ProcessData {
    id: string
    value: number
}
function process(data: ProcessData) { ... }
```

### Inconsistent Structure

```markdown
# ❌ Missing sections
# TypeScript Agent
## Patterns
...

# ✅ Complete structure
# TypeScript Agent
You are a TypeScript expert...

---

## Quick Reference
<!-- Quick patterns for daily use -->

## Common Patterns
<!-- Frequently used examples -->

## Deep Dive
<!-- Advanced patterns and architecture -->

## Troubleshooting
<!-- Common problems and solutions -->
```

### Documentation Misalignment

```markdown
# ❌ Outdated pattern
```typescript
// Old pattern
export default class User {}
```

# ✅ Current best practice
```typescript title="user.ts"
// Named exports only (no barrel files)
export interface User {
    id: string
    name: string
}
```
```

## Automated Fixes

### Available Scripts

**1. Fix Code Block Titles**
```bash
bun scripts/fix-agent-code-titles.js
bun scripts/fix-agent-code-titles.js --dry-run
bun scripts/fix-agent-code-titles.js @agents/typescript.md
```
- Automatically adds titles to code blocks
- Uses context (headings, filenames) to generate titles
- Preserves frontmatter format
- Safe to run multiple times

**2. Fix Section Names**
```bash
bun scripts/fix-agent-sections.js
bun scripts/fix-agent-sections.js --dry-run
```
- Standardizes section names ("Advanced Patterns" → "Deep Dive")
- Ensures consistent structure
- Safe to run multiple times

**3. Validate Agents**
```bash
bun scripts/validate.js
```
- Validates all agents against standards
- Checks frontmatter, structure, content
- Reports issues with severity levels

### Auto-Fixable Issues

**High Priority (Run Scripts):**
- ✅ Code block titles missing → `fix-agent-code-titles.js`
- ✅ Section name inconsistencies → `fix-agent-sections.js`
- ✅ YAML formatting issues → Manual fix (simple)
- ✅ Indentation issues → Manual fix (simple)

**Medium Priority (Manual but Easy):**
- ⚠️ Missing optional frontmatter fields (tags, requires)
- ⚠️ Extra blank lines after frontmatter
- ⚠️ Trailing whitespace

### Manual Review Required

**Critical (Must Fix):**
- ❌ Missing required frontmatter fields (name, version, type, description)
- ❌ Missing required sections (Quick Reference, Common Patterns)
- ❌ Broken code examples
- ❌ Invalid YAML syntax

**High Priority (Should Fix):**
- ⚠️ Missing Deep Dive section
- ⚠️ Outdated patterns or examples
- ⚠️ Documentation misalignment with modules
- ⚠️ Missing critical rules (🚨)

**Medium Priority (Nice to Have):**
- 💡 Missing Troubleshooting section
- 💡 Missing Best Practices section
- 💡 Missing Integration Notes
- 💡 Inconsistent terminology

### Documentation Sync Process

**Step 1: Identify Corresponding Module**
```bash
# Check if module exists
ls modules/{agent-name}.md
```

**Step 2: Compare Patterns**
- Read corresponding module
- Compare code examples
- Check for pattern differences
- Note missing examples in agent

**Step 3: Update Agent**
- Add missing patterns from module
- Update outdated patterns
- Ensure terminology matches
- Add cross-references

**Step 4: Verify**
- Run `/refactor-agents --check-docs`
- Ensure alignment is complete
- Test examples work correctly

### Keeping Agents Up-to-Date

**Automated Checks:**
1. **Pre-commit Hook** (Recommended)
   ```bash
   # .git/hooks/pre-commit
   bun scripts/fix-agent-code-titles.js
   bun scripts/validate.js
   ```

2. **CI/CD Validation** (Recommended)
   ```yaml
   # .github/workflows/validate-agents.yml
   - name: Validate Agents
     run: bun scripts/validate.js
   ```

3. **Regular Sync Script** (Future)
   ```bash
   # Compare agents with modules
   bun scripts/sync-agents-with-modules.js
   ```

**Manual Review Schedule:**
- **Weekly:** Quick check for new issues
- **Monthly:** Run full validation
- **Quarterly:** Complete refactor with module sync
- **On-demand:** When modules or standards change

## Best Practices Compliance

### Agent Structure Best Practices

**Required Pattern:**
```markdown
# Agent Name
Brief introduction...

---

## Quick Reference
<!-- Quick patterns for daily use (~100 lines) -->

## Common Patterns
<!-- Frequently used examples -->

## Deep Dive
<!-- Advanced patterns and architecture (~200+ lines) -->

## Troubleshooting (Optional)
<!-- Common problems and solutions -->

## Best Practices (Optional)
<!-- Recommended approaches -->

## Integration Notes (Optional)
<!-- How this agent works with others -->
```

**Checklist:**
- [ ] Follows Quick Reference + Common Patterns + Deep Dive pattern
- [ ] Has clear section hierarchy (H1 → H2 → H3)
- [ ] Includes troubleshooting when relevant
- [ ] Provides integration notes with other agents
- [ ] Uses horizontal rules (`---`) to separate major sections
- [ ] No skipped heading levels

### Code Examples Best Practices

**Required Standards:**
- [ ] All code blocks have descriptive titles: ````php title="template.php"`
- [ ] Examples are complete and working (no placeholders)
- [ ] Shows both correct (✅) and incorrect (❌) examples where relevant
- [ ] Includes context and explanation before/after code
- [ ] Uses proper syntax highlighting
- [ ] File paths match actual project structure

**Example Format:**
```markdown
### Basic Template Structure

```php title="template.php"
<?php require_once('couch/cms.php'); ?>
<!-- Complete working example -->
```

**Why:** This pattern ensures proper CouchCMS initialization.
```

### Critical Rules Best Practices

**Required Format:**
```markdown
## 🚨 CRITICAL: Rule Name

**Why This Matters:** Brief explanation of why the rule exists.

- **NEVER** do X (explain why)
- **ALWAYS** do Y (explain why)

<!-- ❌ BAD -->
```php
// Example of what NOT to do
```

<!-- ✅ GOOD -->
```php title="correct.php"
// Example of correct approach
```
```

**Checklist:**
- [ ] Uses 🚨 emoji for critical rules
- [ ] Explains why rules exist (not just what)
- [ ] Shows visual examples (✅/❌)
- [ ] Documents security considerations
- [ ] References relevant documentation
- [ ] Updates when patterns change

### Documentation Alignment Best Practices

**Module Sync Process:**
1. **Check Corresponding Module**
   - If `modules/{agent-name}.md` exists, compare patterns
   - Ensure agent examples match module examples
   - Verify terminology consistency

2. **Pattern Consistency**
   - Use same code patterns as module
   - Follow same naming conventions
   - Match same structure where applicable

3. **Version Compatibility**
   - Note minimum version requirements
   - Document breaking changes
   - Reference version-specific features

4. **Cross-References**
   - Link to module documentation
   - Reference related agents
   - Link to CouchCMS documentation

**Checklist:**
- [ ] Matches corresponding module patterns (if module exists)
- [ ] Uses consistent terminology with modules
- [ ] Follows current best practices from `standards.md`
- [ ] References correct versions
- [ ] Includes links to related documentation
- [ ] Updates when modules change

### Content Quality Best Practices

**Completeness Standards:**
- [ ] Covers all core use cases for the agent's domain
- [ ] Includes common patterns (80% use cases)
- [ ] Documents edge cases and gotchas
- [ ] Provides working examples for each pattern
- [ ] Includes troubleshooting for common issues

**Accuracy Standards:**
- [ ] Code examples are correct and tested
- [ ] Patterns follow current best practices
- [ ] No deprecated patterns or warnings
- [ ] Version information is accurate
- [ ] Path variables are correct (`{{paths.xxx}}`)

**Clarity Standards:**
- [ ] Clear, concise explanations
- [ ] Logical organization (simple → complex)
- [ ] Helpful examples with context
- [ ] Easy to scan and find information
- [ ] Uses tables for quick reference

### Maintenance Best Practices

**Update Triggers:**
- [ ] When corresponding module is updated
- [ ] When `standards.md` changes
- [ ] When CouchCMS documentation updates
- [ ] When new best practices emerge
- [ ] When breaking changes occur

**Sync Process:**
1. Run `/refactor-agents --check-docs` to identify misalignments
2. Compare agent with corresponding module
3. Update patterns to match module
4. Add missing examples from module
5. Update version information
6. Re-validate after updates

**Review Schedule:**
- **Monthly:** Quick validation check
- **Quarterly:** Full refactor with documentation sync
- **On-demand:** When modules or standards change

## Safety

Before refactoring:
- [ ] Backup agents directory
- [ ] Check impact on projects using toolkit
- [ ] Verify `bun scripts/sync.js` still works
- [ ] Test with `bun scripts/validate.js`
- [ ] Review changes in related modules

## Usage Examples

### Complete Refactor Workflow

```
/refactor-agents

"Run complete refactor workflow: validate all agents, identify issues,
apply automated fixes, and generate maintenance plan"
```

**This will:**
1. Scan all agents (Phase 1)
2. Validate and analyze (Phase 2)
3. Create fix plan (Phase 3)
4. Apply automated fixes (Phase 4)
5. Report manual review items (Phase 5)
6. Verify fixes (Phase 6)
7. Generate maintenance plan (Phase 7)

### Quick Validation

```
/refactor-agents --quick

"Quick validation check without full analysis"
```

**This will:**
- Run basic validation checks
- Report critical issues only
- Skip detailed analysis

### Fix Specific Agent

```
/refactor-agents @agents/typescript.md --fix

"Fix frontmatter, add code titles, and standardize sections for typescript agent"
```

**This will:**
- Focus on single agent
- Apply all automated fixes
- Report manual review items

### Check Documentation Alignment

```
/refactor-agents --check-docs

"Compare all agents against modules and documentation, report misalignments"
```

**This will:**
- Compare each agent with corresponding module
- Check pattern consistency
- Verify terminology matches
- Report alignment status

### Strict Validation

```
/refactor-agents --strict

"Fail on any warnings, not just errors. Use for CI/CD validation."
```

**This will:**
- Treat warnings as errors
- Exit with error code if issues found
- Suitable for automated checks

### Update Single Agent

```
/refactor-agents @agents/alpinejs.md --update

"Update alpinejs agent: sync with module, add missing patterns, update examples"
```

**This will:**
- Compare with `modules/alpinejs.md`
- Add missing patterns from module
- Update outdated examples
- Ensure terminology consistency

### Maintenance Mode

```
/refactor-agents --maintenance

"Run maintenance checks: validate all agents, check for updates needed,
generate maintenance report"
```

**This will:**
- Run full validation
- Check for module updates
- Identify stale content
- Generate maintenance recommendations

## Integration & Automation

### Scripts Integration

**Available Scripts:**
- `scripts/fix-agent-code-titles.js` - Auto-fix code block titles
- `scripts/fix-agent-sections.js` - Standardize section names
- `scripts/validate.js` - Full validation suite
- `scripts/sync.js` - Sync AI configs (validates agents)

### Command Integration

**Related Commands:**
- `/refactor-modules` - Validate and fix modules (sync with agents)
- `/refactor-toolkit` - Refactor toolkit components
- `/validate-code` - Validate code against standards

### Workflow Integration

**Recommended Workflow:**
1. Update module → Run `/refactor-modules`
2. Sync agents → Run `/refactor-agents --check-docs`
3. Update agents → Run `/refactor-agents @agents/{name}.md --update`
4. Validate → Run `bun scripts/validate.js`
5. Sync configs → Run `bun scripts/sync.js`

### CI/CD Integration

**GitHub Actions Example:**
```yaml
name: Validate Agents

on:
  pull_request:
    paths:
      - 'agents/**'
      - 'modules/**'
      - 'standards.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun scripts/fix-agent-code-titles.js --dry-run
      - run: bun scripts/validate.js
```

### Pre-commit Hook

**Example Hook:**
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Validating agents..."
bun scripts/fix-agent-code-titles.js
bun scripts/validate.js

if [ $? -ne 0 ]; then
    echo "Agent validation failed. Please fix issues before committing."
    exit 1
fi
```

## Reference Standards & Documentation

### Primary References

**Project Standards:**
- `standards.md` - Project coding standards (single source of truth)
- `USER-RULES.md` - User-specific coding rules
- `.cursorrules` - Cursor IDE rules (auto-generated from standards)

**Agent Guidelines:**
- `agents/README.md` - Agent structure guidelines
- `docs/AGENTS.md` - Available agents documentation
- `commands/refactor-agents.md` - This document

**Module References:**
- `modules/README.md` - Module patterns for alignment
- `docs/MODULES.md` - Available modules documentation
- `commands/refactor-modules.md` - Module refactoring guide

**Best Practices:**
- `prompts/best-practices/claude-code-best-practices.md` - AI best practices
- `prompts/best-practices/javascript-best-practices.md` - JS best practices
- `prompts/best-practices/typescript-best-practices.md` - TS best practices

### Validation Checklist

**Before Running Refactor:**
- [ ] Read `standards.md` to understand current standards
- [ ] Check `agents/README.md` for structure guidelines
- [ ] Review corresponding module (if exists) for patterns
- [ ] Understand current best practices

**During Refactor:**
- [ ] Follow step-by-step process (Phases 1-7)
- [ ] Apply automated fixes first
- [ ] Review manual items carefully
- [ ] Verify against standards after each phase

**After Refactor:**
- [ ] Run full validation: `bun scripts/validate.js`
- [ ] Test sync: `bun scripts/sync.js`
- [ ] Verify no regressions
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
/refactor-agents

# Quick validation
/refactor-agents --quick

# Fix specific agent
/refactor-agents @agents/{name}.md --fix

# Check documentation alignment
/refactor-agents --check-docs

# Update single agent with module
/refactor-agents @agents/{name}.md --update

# Maintenance mode
/refactor-agents --maintenance

# Strict validation (CI/CD)
/refactor-agents --strict
```

### Automated Scripts

```bash
# Fix code block titles
bun scripts/fix-agent-code-titles.js

# Standardize sections
bun scripts/fix-agent-sections.js

# Full validation
bun scripts/validate.js
```

### Priority Matrix

| Priority | Issue Type | Action | Script |
|----------|------------|--------|--------|
| **CRITICAL** | Missing required fields | Manual fix | - |
| **HIGH** | Missing code titles | Auto-fix | `fix-agent-code-titles.js` |
| **HIGH** | Section inconsistencies | Auto-fix | `fix-agent-sections.js` |
| **MEDIUM** | Missing critical rules | Manual review | - |
| **MEDIUM** | YAML formatting | Manual fix | - |
| **LOW** | Missing troubleshooting | Optional | - |

### Maintenance Schedule

- **Weekly:** Quick validation check
- **Monthly:** Full validation run
- **Quarterly:** Complete refactor with module sync
- **On-demand:** When modules/standards change

## See Also

- [Agent README](../agents/README.md) - Agent structure guidelines
- [Refactor Modules](./refactor-modules.md) - Module refactoring guide
- [Refactor Toolkit](./refactor-toolkit.md) - Toolkit component refactoring
- [Available Agents](../docs/AGENTS.md) - Complete agent list
- [Available Modules](../docs/MODULES.md) - Module reference for alignment
