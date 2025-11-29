# Phase 1: Collaborative Planning

**Goal:** Agents propose strategies and integrate into unified plan.

---

## 1. Agent Strategy Proposals

**Each primary agent proposes:**

### Domain Strategy
- Approach for their domain
- Files to create/modify
- Patterns to apply

### Dependencies
- What they need from other agents
- What they provide to other agents
- Integration points

### Risks & Mitigations
- Domain-specific risks
- Mitigation strategies
- Verification methods

**Example: @databound-forms**
```markdown
## Strategy

**Approach:**
- Create profile CRUD form
- Add ownership filters
- Integrate image upload

**Files:**
- Create: snippets/forms/profile-form.html
- Create: snippets/filters/owns_profile.html
- Modify: config/databound-forms.php

**Dependencies:**
- FROM @couchcms: Template structure
- FROM @photo-gallery: Image field
- TO @tailwindcss: Form markup
- TO @typescript: Form structure

**Risks:**
- Image upload may conflict with form
  → Use separate AJAX endpoint
```

---

## 2. Strategy Integration

### Sequence Determination
- Order agent work to minimize dependencies
- Identify parallel work opportunities
- Define hand-off points

### Dependency Resolution
- Map all inter-agent dependencies
- Ensure all can be satisfied
- Plan dependency management

### Conflict Resolution
- Identify conflicting recommendations
- Prioritize by domain expertise
- Document resolution rationale

**Example: Integrated Plan**
```markdown
## Implementation Sequence

**Step 1: @couchcms**
- Create template structure
- Set up routing
→ Hand off to @databound-forms

**Step 2: @databound-forms**
- Implement CRUD forms
- Add ownership filter
→ Hand off to @photo-gallery

**Step 3: @photo-gallery**
- Integrate image upload
→ Hand off to @users

**Step 4: @users**
- Verify access control
→ Hand off to @tailwindcss

**Step 5: @tailwindcss**
- Style components
→ Hand off to @typescript

**Step 6: @typescript**
- Add client validation
→ Ready for verification
```

---

## 3. Full Impact Surface

**Direct Impact:**
```
Files to Create:
- templates/profile.php (@couchcms)
- snippets/forms/profile-form.html (@databound-forms)
- assets/ts/profile-validation.ts (@typescript)

Files to Modify:
- config/routes.php (@couchcms)
- config/databound-forms.php (@databound-forms)
```

**Indirect Impact:**
```
Dependent Components:
- User authentication (verify integration)
- Navigation menu (add link)

Related Workflows:
- User registration → profile creation
- User login → profile access
```

---

## 4. Output: Unified Plan

```markdown
## Implementation Plan

**Objectives:**
- Primary goal: {what}
- Success metrics: {how measured}
- Acceptance criteria: {conditions}

**Agent Sequence:**
1. @agent1 → {deliverable}
2. @agent2 → {deliverable}
3. @agent3 → {deliverable}

**Integration Points:**
- Point 1: {agents involved}
- Point 2: {agents involved}

**Risks:**
- Risk 1: {mitigation}
- Risk 2: {mitigation}

**Approval:**
✅ All agents approve plan
✅ All dependencies resolvable
✅ Aligned with standards
```

---

**Next:** Phase 2 - Coordinated Execution
