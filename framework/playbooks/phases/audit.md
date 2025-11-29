# Phase 4: Zero-Trust Audit

**Goal:** Fresh evidence-based audit. Memory is untrustworthy.

---

## 1. Fresh Domain Re-Verification

**Each agent re-verifies with fresh commands:**

```markdown
## Agent: @{name}
## Fresh Audit

**Re-read Files:**
```bash
cat templates/profile.php
cat snippets/forms/profile-form.html
```

**Re-run Quality Gates:**
```bash
{fresh verification commands}
```

**Results:**
✅ Files in intended state
✅ Quality gates pass
✅ Configuration correct
✅ Domain integrity confirmed
```

**Example: @couchcms Fresh Audit**
```bash
# Re-verify no tags in comments
grep -n "<!--.*<cms:" templates/profile.php
# Expected: No matches

# Re-verify self-closing tags
grep -n "<cms:else></cms:else>" templates/profile.php
# Expected: No matches

# Re-verify route
grep -n "profile" config/routes.php
# Expected: Route found
```

---

## 2. Regression Hunt

**Each agent tests features they did NOT modify:**

```markdown
## @couchcms Regression Hunt

**Testing NOT Modified:**
- User authentication
- Other template routes
- Existing forms

**Test: User Auth**
- Navigate to protected page
- Verify auth check works
- Result: ✅ Still functional

**Findings:** ✅ No regressions
```

```markdown
## @databound-forms Regression Hunt

**Testing NOT Modified:**
- Existing project forms
- Other CRUD operations

**Test: Project Form**
- Load project form
- Submit test data
- Result: ✅ Still functional

**Findings:** ✅ No regressions
```

---

## 3. Component Consumer Audit

**Verify all consumers of changed components:**

```markdown
## Shared Component Audit

**Component: snippets/filters/authenticated.html**
Modified: No (reused)
Consumers:
- templates/profile.php (new) → ✅ Works
- templates/projects.php → ✅ Still works
- templates/films.php → ✅ Still works

**Component: snippets/layouts/base.html**
Modified: Yes (added nav link)
Consumers:
- All templates → ✅ All verified
- Navigation → ✅ Link appears
- Mobile menu → ✅ Works

**Status:** ✅ All consumers working
```

---

## 4. Standards Compliance Audit

**Each agent verifies standards:**

```markdown
**@couchcms:**
✅ No tags in HTML comments
✅ Self-closing tags correct
✅ Extends/block pattern
✅ Auth filters applied

**@databound-forms:**
✅ Ownership filters
✅ CSRF protection
✅ Validation complete
✅ Error handling

**@users:**
✅ Authentication required
✅ Ownership verified
✅ Permissions enforced

**@tailwindcss:**
✅ Theme-aware colors
✅ No hardcoded colors
✅ Responsive design
✅ WCAG 2.1 AA

**@typescript:**
✅ No 'any' types
✅ Proper annotations
✅ Error handling
✅ No console.log

**Cross-Agent:**
✅ English-only
✅ 4-space indentation
✅ Consistent naming
✅ No security issues
```

---

## 5. Git & File Integrity

```bash
# Fresh git status
git status

# Verify file contents
cat templates/profile.php | head -20
cat config/routes.php | grep profile

# Confirm all changes intentional
# Confirm no accidental modifications
```

---

## Output: Audit Summary

```markdown
## Zero-Trust Audit Complete

**Fresh Verification:**
✅ All agents re-verified with fresh evidence
✅ All quality gates pass
✅ All files in intended state

**Regression Hunt:**
✅ No regressions in any domain
✅ All related features work
✅ No unexpected side effects

**Component Consumers:**
✅ All shared components verified
✅ All consumers working
✅ No breaking changes

**Standards Compliance:**
✅ All agents compliant
✅ Cross-agent consistency
✅ Security verified
✅ Accessibility verified

**File Integrity:**
✅ Git status clean
✅ No accidental changes
✅ Configuration correct

**Critical Issues:** {count}
- Issue 1: {description} → ✅ Fixed

**Status:** ✅ Audit Complete
```

---

**Next:** Phase 5 - Final Report
