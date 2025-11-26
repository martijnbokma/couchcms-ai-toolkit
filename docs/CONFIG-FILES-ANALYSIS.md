# Configuration Files Analysis

Analysis of `.project/standards.md` and `.project/ai/context.md` - their purposes, differences, and recommendations for simplification.

**Note:** `project.md` has been removed. The toolkit now only uses `standards.md`.

## Current Situation

### 1. `standards.md` (Primary Configuration File)

**Location Priority:**
1. `.project/standards.md` (recommended)
2. `docs/standards.md`
3. `standards.md` (root)

**Structure:**
```yaml
---
# YAML Frontmatter - Configuration
name: 'my-project'
toolkit: './ai-toolkit-shared'
modules: [...]
agents: [...]
---

# Markdown Body - Project Rules
## Project-Specific Rules
Add your custom rules here...
```

**What it does:**
- **YAML frontmatter**: Project configuration (modules, agents, toolkit path, paths, standards, naming)
- **Markdown body**: Project-specific rules (used as `projectRules` in sync.js)
- **Used for**: Configuration + Rules

**Problem:** Two names for the same thing causes confusion!

---

### 2. `.project/ai/context.md` (Optional)

**Location:** `.project/ai/context.md` (or any path specified in config)

**Structure:**
```markdown
---
name: My Project Context
---

# Detailed Project Context
## Content Architecture
[Extensive details...]

## Code Patterns
[Many examples...]
```

**What it does:**
- **Optional file** for extensive project documentation
- **Loaded separately** and added as "# Project Context" section in generated files
- **Used for**: Extensive project documentation (>200 lines)

**Problem:** Unclear when it's needed vs. just using `standards.md` body!

---

## How They're Used in sync.js

```javascript
// 1. Load standards.md
const { data: config, content: projectRules } = matter(standards.md)

// 2. Load context.md (if exists)
const projectContext = loadProjectContext(contextPath)

// 3. Generate output
generateContent(config, modules, agents, projectContext, projectRules)
// Result:
// - Modules content
// - Agents content
// - "# Project Context" (from context.md)
// - "# Project-Specific Rules" (from standards.md body)
```

**Both are added to generated files**, but it's unclear when to use which!

---

## Problems Identified

### 1. **Overlap Between standards.md Body and context.md**
- Both can contain project-specific rules/documentation
- Unclear when to use which
- Current guideline (>200 lines) is arbitrary

### 3. **Unclear Purpose**
- What's the difference between rules in `standards.md` body vs `context.md`?
- When do you need `context.md`?
- Why have two places for project content?

### 4. **Complexity for Beginners**
- Three file types to understand
- Multiple locations to check
- Unclear hierarchy

---

## Best Practices from Other Tools

### node-config
- **Single config file** with clear hierarchy
- **Environment-specific overrides** (local.json, production.json)
- **Clear separation**: config vs. runtime overrides

### Projen
- **Single source of truth** (projenrc.js)
- **Generated files** are clearly marked
- **Simple structure**: one config file

### General Pattern
- **One primary config file** for configuration
- **Optional overrides** for specific cases
- **Clear hierarchy** and purpose

---

## Recommendations

### Option 1: Simplify to One File (Recommended)

**Use only `standards.md`:**

```yaml
---
# Configuration
name: 'my-project'
modules: [...]
agents: [...]
---

# Project Rules & Documentation
## Rules
[Your rules here...]

## Architecture
[If needed...]

## Patterns
[If needed...]
```

**Benefits:**
- ✅ One file to understand
- ✅ No confusion about names
- ✅ Simple for beginners
- ✅ Everything in one place

**When to split:**
- Only if `standards.md` becomes >1000 lines (very rare)
- Then consider splitting into multiple files manually

**Action:**
- Deprecate `project.md` (keep as fallback for legacy)
- Remove `context.md` option (or make it truly optional for edge cases)
- Update all documentation to use only `standards.md`

---

### Option 2: Clear Separation (If Context.md is Needed)

**Keep both but clarify:**

**`standards.md`:**
- YAML: Configuration only
- Body: **Short rules** (<200 lines) - coding standards, quick patterns

**`context.md` (optional):**
- **Extensive documentation only** (>200 lines)
- Architecture decisions
- Detailed workflows
- Extensive code examples library

**Clear guidelines:**
- Start with only `standards.md`
- Add `context.md` ONLY if:
  - You have >200 lines of documentation
  - You want to separate config from docs
  - You're working in a team with extensive docs

**Action:**
- Deprecate `project.md`
- Make `context.md` truly optional (not recommended in Simple mode)
- Add clear documentation about when to use each

---

### Option 3: Config + Rules Split (Breaking Change)

**Separate config from rules:**

**`.project/config.yaml`:**
```yaml
name: 'my-project'
modules: [...]
agents: [...]
```

**`.project/rules.md`:**
```markdown
# Project Rules
[All rules here...]
```

**Benefits:**
- Clear separation of concerns
- Config is pure YAML (easier to parse)
- Rules are pure Markdown

**Drawbacks:**
- Breaking change
- More files to manage
- Probably overkill for this use case

---

## Recommended Solution: Option 1

**Simplify to one file: `standards.md`**

### Implementation Plan

1. **Remove `project.md` support**
   - No longer supported
   - Only `standards.md` is used

2. **Make `context.md` truly optional**
   - Remove from Simple mode
   - Only show in Custom mode with clear explanation
   - Document: "Only needed for >1000 lines of documentation"

3. **Update documentation**
   - All examples use `standards.md`
   - Clear: "One file for everything"
   - Remove confusion about multiple files

4. **Update init wizard**
   - Simple mode: Only creates `standards.md`
   - Custom mode: Option for `context.md` with clear explanation (rarely needed)

### Benefits

- ✅ **Simpler**: One file to understand
- ✅ **Clearer**: No confusion about names or purposes
- ✅ **Easier**: Beginners don't need to decide
- ✅ **Flexible**: Can still add `context.md` later if needed

---

## Migration Path

For existing projects:

1. **If using `project.md`:**
   - **Action required:** Rename to `standards.md` (or `.project/standards.md`)
   - No content changes needed - just rename the file
   - The toolkit no longer supports `project.md`

2. **If using `context.md`:**
   - Option A: Merge into `standards.md` body (recommended if <1000 lines)
   - Option B: Keep as-is (still works if you have >1000 lines)
   - Option C: Remove if not needed

3. **Update scripts:**
   - Removed `project.md` support completely
   - Only `standards.md` is supported

---

## Conclusion

**Current state:** Simplified to two file types with clear purposes.

**Implemented:** One primary file (`standards.md`) for 95% of use cases.

**Keep `context.md`:** Only as truly optional for edge cases (>1000 lines).

**Result:** Much simpler, clearer, and easier for new users. Only `standards.md` is required - `context.md` is optional and rarely needed.
