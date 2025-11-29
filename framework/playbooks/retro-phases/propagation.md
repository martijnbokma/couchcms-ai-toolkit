# Phase 5: Propagation

**Goal:** Execute updates and sync configurations.

---

## Update Execution

**Files to update:**

```markdown
## 1. Standards File
**File:** {standards.md or project-specific}
**Changes:** {Summary of changes}
**Status:** {✅ Complete | 🚧 Pending}

## 2. Operational Doctrine
**File:** framework/doctrine/operational-doctrine.md
**Changes:** {Summary of changes}
**Status:** {✅ Complete | 🚧 Pending}

## 3. Pre-Flight Checks
**File:** preflight-checks.yaml
**Changes:** {New checks added}
**Status:** {✅ Complete | 🚧 Pending}

## 4. Smart Defaults
**File:** smart-defaults.yaml
**Changes:** {New patterns/commands}
**Status:** {✅ Complete | 🚧 Pending}

## 5. Agent Documentation
**Files:** agents/{agent-name}.md
**Changes:** {Updates made}
**Status:** {✅ Complete | 🚧 Pending}

## 6. Module Documentation
**Files:** modules/{module-name}.md
**Changes:** {Updates made}
**Status:** {✅ Complete | 🚧 Pending}
```

---

## Configuration Sync

**Run sync to propagate changes:**

```bash
# Sync all AI agent configurations
bun scripts/sync.js
```

**Configurations updated:**
```markdown
✅ .cursorrules (Cursor)
✅ .claude/ (Claude Code)
✅ .github/copilot-instructions.md (Copilot)
✅ .windsurf/rules.md (Windsurf)
✅ .kiro/steering/ (Kiro)
```

---

## Verification

**Verify propagation:**

```bash
# Check that configs include updates
grep -r "{new_pattern}" .cursorrules
grep -r "{new_pattern}" .claude/

# Verify pre-flight checks active
# Test with sample code that should trigger check
```

**Verification Checklist:**
```markdown
✅ All configs include updated content
✅ Pre-flight checks are active
✅ Smart operations features work
✅ Agent documentation updated
✅ Module documentation updated
```

---

## Rollback Plan

**If issues found:**

```markdown
**Issue:** {Description}

**Rollback Steps:**
1. Revert changes to {file}
2. Re-run sync
3. Verify system state
4. Document issue for future

**Prevention:**
{How to prevent this issue}
```

---

**Next:** Phase 6 - Final Verdict
