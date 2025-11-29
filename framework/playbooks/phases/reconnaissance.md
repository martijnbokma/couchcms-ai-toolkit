# Phase 0: Multi-Agent Reconnaissance

**Goal:** Each agent investigates their domain (read-only, no changes).

**Constraint:** NO mutations permitted during this phase.

---

## Agent Domain Analysis

**For each primary agent:**

### 1. Identify Relevant Files
- Find files in agent's domain
- Document current state
- Note integration points

### 2. Recognize Patterns
- Catalog established patterns
- Identify deviations
- Note opportunities

### 3. Assess Impact
- Files that will be affected
- Dependencies in domain
- Cross-domain dependencies

**Example: @couchcms**
```markdown
## @couchcms Analysis

**Files:**
- layouts/base.html (extends pattern)
- 12 existing templates
- config/routes.php

**Patterns:**
✅ Extends/block used consistently
✅ Self-closing tags correct
✅ No tags in HTML comments

**Impact:**
- Need: templates/profile.php
- Need: route /profile/{user_id}
- Integration: @databound-forms, @users
```

---

## Cross-Agent Synthesis

### 1. Combine Insights

Merge agent findings into unified understanding:
- Current architecture
- Existing patterns
- Integration points
- Constraints and opportunities

### 2. Identify Conflicts

If agents have conflicting recommendations:
- Document the conflict
- Prioritize by domain expertise
- Document resolution

### 3. Reconnaissance Digest

**Output (≤ 200 lines):**
```markdown
## Executive Summary
- Request: {description}
- Agent team: {list}
- Key findings: {summary}

## Domain Findings
- @agent1: {findings}
- @agent2: {findings}

## Impact Surface
- Files to create: {list}
- Files to modify: {list}
- Integration points: {list}

## Readiness
✅ All info available
✅ No blockers
✅ Ready to proceed
```

---

**Next:** Phase 1 - Collaborative Planning
