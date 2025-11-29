# Phase 4: Doctrine Integration

**Goal:** Plan updates to standards and doctrine.

---

## Standards Updates

**For each update needed:**

```markdown
## Update: {Section/Area Name}

**Target File:** {standards.md, operational-doctrine.md, etc.}

**Current State:**
{What it currently says (if anything)}

**Proposed Update:**
```diff
+ {New content to add}
- {Content to remove (if any)}
```

**Rationale:**
{Why this update is necessary}

**Severity:** {CRITICAL | IMPORTANT | RECOMMENDED}
```

---

## Pre-Flight Checks

**New checks to add:**

```yaml
# Target: preflight-checks.yaml

{category_name}:
  {check_name}:
    pattern: "{regex_pattern}"
    severity: {CRITICAL | ERROR | WARNING | INFO}
    message: "{Description}"
    fix: "{How to fix}"
    auto_fix: {true | false}
    example:
      bad: "{bad code example}"
      good: "{good code example}"
```

**Integration Steps:**
1. Add to `preflight-checks.yaml`
2. Test with sample code
3. Run `/sync` to update configs
4. Document in smart-operations.md

---

## Smart Operations

**New slash commands:**

```markdown
**Command:** `/{command}` - {Description}
**Action:** {What it does}
**Example:** `/{command} @file`
**Pre-Flight Checks:** {Which checks}
```

**New intent patterns:**

```yaml
# Target: smart-defaults.yaml

intent_patterns:
  {intent_name}:
    triggers: ["{keyword1}", "{keyword2}"]
    action: {action_name}
    confirm: "{Confirmation message}" | false
```

---

## Agent Updates

**Agent-specific learnings:**

```markdown
**Agent:** @{agent-name}
**Learning:** {What was learned}
**Update Needed:** {What to add to agent documentation}
**Location:** agents/{agent-name}.md
```

---

## Module Updates

**Module-specific learnings:**

```markdown
**Module:** {module-name}
**Learning:** {What was learned}
**Update Needed:** {What to add to module}
**Location:** modules/{module-name}.md
```

---

**Next:** Phase 5 - Propagation
