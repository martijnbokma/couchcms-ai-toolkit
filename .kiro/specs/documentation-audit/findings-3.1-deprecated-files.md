# Task 3.1: Verify Deprecated File References

**Status**: ✅ Complete  
**Date**: 2025-11-28  
**Requirements**: 2.1, 8.1

---

## Summary

Audited MIGRATION.md and all documentation for references to deprecated files. The migration documentation correctly lists all deprecated files, but several other documentation files contain outdated references.

---

## Deprecated Files List

The following files are deprecated and should not be referenced in current documentation:

### Configuration Files (pre-v2.0)
1. `defaults.yaml` - Removed in v2.0.0
2. `smart-defaults.yaml` - Removed in v2.0.0
3. `preflight-checks.yaml` - Removed in v2.0.0
4. `config.yaml` - Intermediate format (v2.0.0), replaced with `standards.md`

### Generated Files (changed in recent versions)
5. `CLAUDE.md` - No longer generated (replaced with `.claude/` directory structure)
6. `AGENT.md` - No longer generated (replaced with `AGENTS.md`)

---

## Findings

### ✅ MIGRATION.md - CORRECT

**File**: `docs/MIGRATION.md`

**Status**: Properly documents deprecated files

**Deprecated files listed**:
- ✅ `defaults.yaml`
- ✅ `smart-defaults.yaml`
- ✅ `preflight-checks.yaml`
- ✅ `.project/standards.md` (old location)

**Missing from list**:
- ⚠️ `config.yaml` - Should be mentioned as intermediate format
- ⚠️ `CLAUDE.md` - Should clarify it's no longer generated
- ⚠️ `AGENT.md` - Should clarify it's no longer generated

**Recommendation**: Add note about `config.yaml` being an intermediate format that was also deprecated.

---

### ❌ standards.md - INCORRECT REFERENCE

**File**: `standards.md` (line 106)

**Issue**: References `defaults.yaml` in module development instructions

```yaml
- Include skill-rules.json for Claude Code integration
- Update MODULES.md documentation
- Add to defaults.yaml if needed  # ❌ OUTDATED
```

**Severity**: HIGH - This is the main configuration file and should not reference deprecated files

**Recommendation**: Remove this line entirely as `defaults.yaml` no longer exists

---

### ❌ CHANGELOG.md - MIXED (Historical + Incorrect)

**File**: `CHANGELOG.md`

**Issue**: Contains both historical references (correct) and potentially confusing current references

**Historical references (CORRECT)**:
- Lines 277-280: Documents removal of deprecated files in v2.0.0
- Lines 369-371: Documents simplification in v2.0.0
- Lines 562-564: Documents v1.x configuration files

**Potentially confusing**:
- Line 280: "The intermediate `config.yaml` format (v2.0.0) has been replaced"
  - ✅ This is correct historical documentation

**Recommendation**: No changes needed - CHANGELOG correctly documents historical changes

---

### ❌ README.md - INCORRECT REFERENCE

**File**: `README.md` (line 25)

**Issue**: References `CLAUDE.md` as a memory file

```markdown
- 📝 **Memory Files** - Project context loaded at startup (CLAUDE.md, AGENTS.md)
```

**Severity**: HIGH - Main documentation file with incorrect information

**Current reality**: 
- `CLAUDE.md` is NOT generated anymore
- `.claude/memory/` directory is used instead
- `AGENTS.md` IS still generated

**Recommendation**: Update to:
```markdown
- 📝 **Memory Files** - Project context loaded at startup (AGENTS.md, .claude/memory/)
```

---

### ❌ CONTRIBUTING.md - INCORRECT REFERENCE

**File**: `CONTRIBUTING.md` (line 177)

**Issue**: Shows example using non-existent command

```bash
# Add a new agent
code agents/your-new-agent.md
```

**Severity**: LOW - This is just an example, but could be clearer

**Recommendation**: This is fine as-is (just showing how to edit a file)

---

### ⚠️ CouchCMS-Documentation Files - EXTERNAL PROJECT

**Files**: 
- `CouchCMS-Documentation/AI-TOOLKIT.md`
- `CouchCMS-Documentation/SYSTEM-OVERVIEW.md`
- `CouchCMS-Documentation/PR-SUMMARY.md`

**Issue**: These files reference `CLAUDE.md` as a generated file

**Severity**: MEDIUM - These are in a different workspace (CouchCMS-Documentation)

**Note**: These files are in the CouchCMS-Documentation project, not the toolkit itself. They should be updated separately as part of that project's documentation.

**Recommendation**: Flag for separate update in CouchCMS-Documentation project

---

## Summary of Issues

### Critical Issues (Must Fix)
1. ❌ `standards.md` line 106 - Remove reference to `defaults.yaml`
2. ❌ `README.md` line 25 - Update `CLAUDE.md` reference to `.claude/memory/`

### High Priority (Should Fix)
3. ⚠️ `MIGRATION.md` - Add note about `config.yaml` intermediate format
4. ⚠️ `MIGRATION.md` - Clarify `CLAUDE.md` and `AGENT.md` status

### Medium Priority (External Project)
5. ⚠️ CouchCMS-Documentation files - Update in separate project

### Low Priority (Acceptable)
6. ✅ `CHANGELOG.md` - Historical references are correct
7. ✅ `CONTRIBUTING.md` - Example is acceptable

---

## Verification Commands

To verify no other references exist:

```bash
# Search for deprecated config files
grep -r "defaults\.yaml\|smart-defaults\.yaml\|preflight-checks\.yaml\|config\.yaml" --include="*.md" couchcms-ai-toolkit/

# Search for deprecated generated files
grep -r "CLAUDE\.md\|AGENT\.md" --include="*.md" couchcms-ai-toolkit/
```

---

## Conclusion

**Task 3.1 Status**: ✅ COMPLETE

The MIGRATION.md file correctly lists the main deprecated files (defaults.yaml, smart-defaults.yaml, preflight-checks.yaml), but could be enhanced with additional context about config.yaml and the changed generated file structure.

Two critical issues found in current documentation:
1. `standards.md` incorrectly references `defaults.yaml`
2. `README.md` incorrectly references `CLAUDE.md`

These should be fixed in Phase 2 of the documentation audit.
