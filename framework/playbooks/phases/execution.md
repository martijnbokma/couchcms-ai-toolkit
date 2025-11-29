# Phase 2: Coordinated Execution

**Goal:** Agents implement their domain work with clean hand-offs.

---

## Agent Work Cycle

**For each agent in sequence:**

### 1. Pre-Work Review
```markdown
## Agent: @{name}
## Step: {number} - {description}

**Receiving from:** @{previous-agent}

**Hand-off Verification:**
✅ Previous work completed
✅ Deliverables received
✅ Integration points clear
✅ Ready to proceed
```

### 2. Domain Implementation

**Read-Write-Reread Pattern:**
1. Read file before changes
2. Write modifications
3. Reread to verify

**Pre-Flight Checks:**
1. Generate code
2. Scan against `preflight-checks.yaml`
3. STOP on CRITICAL
4. WARN on WARNING
5. INFO on INFO
6. Apply auto-fixes

**Standards:**
- Follow agent patterns
- English-only code
- 4-space indentation
- Proper error handling

### 3. Domain Verification
```markdown
**Verification:**
✅ Files created/modified
✅ Pre-flight checks passed
✅ Quality gates passed
✅ Integration points work
✅ No regressions
```

### 4. Hand-off Preparation
```markdown
## Hand-off: @{agent} → @{next-agent}

**Completed:**
- ✅ Created: {files}
- ✅ Modified: {files}
- ✅ Verified: {results}

**Deliverables:**
- {Item 1}: {location}
- {Item 2}: {location}

**Notes:**
- {Important info for next agent}

**Status:** ✅ Ready for @{next-agent}
```

---

## Core Protocols

### Command Execution
- Wrap all commands with timeout
- Capture stdout & stderr
- Non-interactive where safe
- Fail-fast semantics

### Workspace Purity
- All analysis stays in chat
- NO unsolicited files
- Chat log is source of truth

### System-Wide Ownership
- Update ALL consumers
- Verify consistency
- Document changes

---

## Progress Tracking

```markdown
## Implementation Progress

**Step 1: @couchcms**
✅ Template created
✅ Route configured
→ Hand-off complete

**Step 2: @databound-forms**
🚧 In progress
- ✅ Form created
- [ ] Ownership filter

**Step 3: @photo-gallery**
⏳ Waiting

**Legend:**
✅ Completed
🚧 In progress
⏳ Waiting
⚠️ Warning
❌ Blocked
```

---

## Example: Agent Implementation

```markdown
## Agent: @databound-forms
## Step: 2 - CRUD Operations

**Receiving from @couchcms:**
✅ Template skeleton ready
✅ Route configured
✅ Auth filter confirmed

**Implementation:**
[Generate form with pre-flight checks]

**Verification:**
✅ Form structure valid
✅ Ownership filter works
✅ CRUD operations functional

**Hand-off to @photo-gallery:**
- Form ready for image field
- Ownership filter: owns_profile.html
- Form structure documented
```

---

**Next:** Phase 3 - Multi-Agent Verification
