# Phase 3: Multi-Agent Verification

**Goal:** Each agent verifies their domain, then test integration.

---

## 1. Agent Domain Verification

**Each agent runs their quality gates:**

### @couchcms
```bash
php -l templates/profile.php
# Verify template syntax
# Check self-closing tags
# Check no tags in comments
```

### @databound-forms
```bash
# Test CRUD operations
# Verify ownership filters
# Test validation rules
```

### @typescript
```bash
tsc --noEmit assets/ts/profile-validation.ts
eslint assets/ts/profile-validation.ts
bun build assets/ts/profile-validation.ts
```

### Autonomous Correction

If any gate fails:
```markdown
## Failure: {description}

**Root Cause:** {why it failed}
**Fix:** {how to fix}
**Verification:** {how to verify}

[Apply fix]

✅ Fix applied
✅ Gate now passes
```

---

## 2. Integration Point Testing

**Test each integration:**
```markdown
## Integration Testing

**@couchcms ↔ @databound-forms:**
✅ Template includes form
✅ Form submission routes
✅ Response handling works

**@databound-forms ↔ @photo-gallery:**
✅ Image field integrated
✅ Upload endpoint connected
✅ Image data saved

**@databound-forms ↔ @users:**
✅ Ownership filter applied
✅ Authentication checked
✅ Permissions enforced
```

---

## 3. End-to-End Workflow Testing

**Primary Workflow:**
```markdown
## E2E: Create Profile

1. Navigate to /profile/new
   ✅ Route works (@couchcms)
   ✅ Auth checked (@users)

2. Fill out form
   ✅ Form renders (@databound-forms)
   ✅ Styling correct (@tailwindcss)
   ✅ Validation works (@typescript)

3. Upload photo
   ✅ Upload works (@photo-gallery)
   ✅ Thumbnail generated (@photo-gallery)

4. Submit form
   ✅ Submission processed (@databound-forms)
   ✅ Ownership assigned (@users)
   ✅ Redirect works (@couchcms)

**Result:** ✅ Complete workflow functional
```

**Security Workflow:**
```markdown
## E2E: Unauthorized Access

1. User A tries to edit User B's profile
   ✅ Ownership check fails (@users)
   ✅ Access denied (@couchcms)

**Result:** ✅ Security working
```

---

## 4. Regression Testing

**Test related features NOT modified:**
```markdown
## Regression Tests

✅ User authentication still works
✅ Other forms still functional
✅ Image upload elsewhere works
✅ Navigation menu functional
✅ Existing routes work

**Result:** ✅ No regressions
```

---

## 5. Cross-Agent Consistency

```markdown
## Consistency Check

**Naming:**
✅ File names consistent
✅ Variable names consistent
✅ Function names consistent

**Patterns:**
✅ Error handling consistent
✅ Validation consistent
✅ Security consistent

**Standards:**
✅ English-only
✅ 4-space indentation
✅ Accessibility (WCAG 2.1 AA)
```

---

## Output: Verification Summary

```markdown
## Verification Complete

**Agent Verification:**
✅ @couchcms: All gates passed
✅ @databound-forms: All gates passed
✅ @photo-gallery: All gates passed
✅ @users: All gates passed
✅ @tailwindcss: All gates passed
✅ @typescript: All gates passed

**Integration:**
✅ All integration points verified
✅ E2E workflows functional
✅ No regressions
✅ Consistency confirmed

**Issues Fixed:**
- Issue 1: {description} → ✅ Fixed by @{agent}

**Status:** ✅ Production-Ready
```

---

**Next:** Phase 4 - Zero-Trust Audit
