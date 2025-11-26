# AI Toolkit Improvement Proposal

## Executive Summary

After thorough analysis of the complete AI-toolkit, I identify **10 core improvements** that can lead to:
- **50-70% less input** needed per task
- **Faster iterations** through smart defaults and shortcuts
- **Higher consistency** through automated patterns
- **Better error prevention** through proactive validation

---

## Current Strengths (Keep)

| Component | Strength |
|-----------|---------|
| `01-core.md` | Solid operational doctrine with phases |
| `05-concise.md` | Anti-filler communication |
| `06-no-absolute-right.md` | Professional tone |
| Agents system | Specialized knowledge per domain |
| Modules system | Reusable knowledge modules |
| Auto-loading rules | Context-aware refactoring |

---

## Improvement Proposals

### 1. 🎯 Smart Intent Detection

**Problem:** User must always provide full context, even for common tasks.

**Solution:** Automatic intent recognition based on minimal input.

```markdown
## Framework: Intent Detection Layer

### Pattern Recognition Rules:

| Trigger Pattern | Inferred Intent | Auto-Actions |
|-----------------|-----------------|--------------|
| `@file.php` (file only) | Code review | Read file, identify issues |
| `@file.php` + "fix" | Bug fix | Read, identify bugs, propose fixes |
| `@file.php` + "refactor" | Refactoring | Activate refactor-router |
| "new component X" | Component creation | Create HTML + CSS + TS files |
| "add Y to @file" | Feature addition | Read context, implement feature |
| Error/stack trace | Debugging | Activate debug specialist |

### Implementation:
1. Parse first message for keywords and file references
2. Match against intent patterns
3. Propose inferred intent to user: "I understand you want [X]. Correct? [Yes/No/Other]"
4. On "Yes" → execute directly without further questions
```

---

### 2. 🚀 Quick Actions (Slash Commands)

**Problem:** Long prompts for simple tasks.

**Solution:** Slash commands for common actions.

```markdown
## Quick Actions Reference

### Code Modification
| Command | Description | Equivalent |
|---------|------------|------------|
| `/fix @file` | Fix problems in file | Debug + Fix |
| `/refactor @file` | Refactor file | Activate refactor-router |
| `/optimize @file` | Performance optimization | Analyze + optimize |
| `/review @file` | Code review | Analyze + report |
| `/test @file` | Generate tests | Analyze + create tests |

### Creation
| Command | Description | Output |
|---------|------------|--------|
| `/component <name>` | Create component | HTML + CSS + TS in correct paths |
| `/view <name>` | Create view | View template + routing |
| `/form <name>` | Create form | DataBound Form + validation |
| `/api <name>` | Create API endpoint | JSON template + routing |

### Workflow
| Command | Description | Action |
|---------|------------|--------|
| `/sync` | Sync AI configs | Run sync.js |
| `/validate` | Validate project | Run validate.js |
| `/status` | Project status | Show current state |

### Usage:
- Commands are case-insensitive
- Combinable: `/fix @file1 @file2`
- With options: `/component modal --alpine --daisyui`
```

---

### 3. 📦 Smart Defaults per Context

**Problem:** No context-dependent suggestions or automatic configuration.

**Solution:** Dynamic defaults based on file type and project context.

```yaml
# smart-defaults.yaml

file_contexts:
  "*.php":
    agent: couchcms
    modules: [couchcms-core]
    checks: [html-comment-security, template-inheritance]
    suggestions: [extract-to-snippet, add-caching]

  "*.ts":
    agent: typescript
    modules: [typescript]
    checks: [type-safety, no-any]
    suggestions: [add-types, extract-interface]

  "snippets/forms/*.html":
    agent: databound-forms
    modules: [databound-forms, couchcms-core]
    checks: [csrf, validation, ownership]
    suggestions: [add-error-handling]

  "snippets/components/*.html":
    agent: [couchcms, alpinejs]
    modules: [couchcms-core, alpinejs]
    checks: [alpine-integration, component-structure]
    suggestions: [add-alpine-state]

action_contexts:
  create_component:
    files:
      - "{{paths.components}}/{{name}}.html"
      - "{{paths.css}}/components/{{name}}.css"
      - "{{paths.typescript}}/components/{{name}}.ts"
    templates: component-bundle
    post_actions: [register-in-index, update-imports]

  create_view:
    files:
      - "{{paths.views}}/{{name}}/list.html"
      - "{{paths.views}}/{{name}}/detail.html"
      - "{{paths.views}}/{{name}}/edit.html"
    templates: view-bundle-crud
    post_actions: [register-routes]
```

---

### 4. 🧠 Project Context Caching

**Problem:** Each session starts from scratch, requiring reconnaissance again.

**Solution:** Persistent project context file that is automatically updated.

```markdown
## Project Context Cache

### Automatically Generated: `.project/context-cache.json`

```json
{
  "lastUpdated": "2025-11-26T12:00:00Z",
  "projectStructure": {
    "templates": ["films.php", "series.php", "users/login.php"],
    "components": ["modal.html", "card.html", "swiper-section.html"],
    "views": ["films/list.html", "films/detail.html"],
    "typescript": ["main.ts", "components/modal.ts"]
  },
  "dependencies": {
    "cms": "CouchCMS 2.3",
    "css": "TailwindCSS 4.0 + daisyUI 5.0",
    "js": "Alpine.js 3.x"
  },
  "patterns": {
    "authentication": "snippets/filters/authenticated.html",
    "ownership": "snippets/filters/owns_content.html",
    "pagination": "components/pagination.html"
  },
  "recentChanges": [
    {"file": "films.php", "type": "modified", "date": "2025-11-25"},
    {"file": "components/modal.html", "type": "created", "date": "2025-11-24"}
  ],
  "knownIssues": [],
  "conventions": {
    "namingStyle": "kebab-case",
    "indentation": 4,
    "language": "english"
  }
}
```

### Usage in Prompts:
- AI reads cache at start of session
- Skips reconnaissance phase for known components
- Updates cache after significant changes
- User can force: `/refresh-context`
```

---

### 5. ⚡ Workflow Automation (Chains)

**Problem:** No chained actions for complex tasks.

**Solution:** Defined workflow chains for common scenarios.

```markdown
## Workflow Chains

### Chain: `new-feature`
```yaml
name: New Feature Workflow
trigger: "new feature" | "/feature <name>"
steps:
  1. gather_requirements:
     - Ask: "What should the feature do? (1-2 sentences)"
     - Ask: "Which existing components are used?"
  2. plan:
     - Generate: Feature plan with required files
     - Confirm: "Does this plan look correct? [Yes/Modify]"
  3. create_files:
     - Create: All required files
     - Apply: Smart defaults per file type
  4. integrate:
     - Update: Routes/imports if needed
     - Update: Context cache
  5. verify:
     - Run: Linting checks
     - Show: Summary of changes made
```

### Chain: `fix-bug`
```yaml
name: Bug Fix Workflow
trigger: Error message | Stack trace | "/fix"
steps:
  1. analyze:
     - Parse: Error/symptom
     - Identify: Probable cause
     - Show: "I think the problem is X. Investigate? [Yes]"
  2. diagnose:
     - Read: Relevant files
     - Trace: Root cause
     - Show: Diagnosis + fix proposal
  3. fix:
     - Apply: Fix
     - Verify: No new errors
  4. prevent:
     - Suggest: Preventive measures (optional)
```

### Chain: `refactor-component`
```yaml
name: Component Refactor
trigger: "/refactor @component" | "refactor component"
steps:
  1. analyze:
     - Read: Component + related files
     - Identify: Code smells, improvement points
  2. plan:
     - Show: Refactoring plan
     - Confirm: "Agree with this plan?"
  3. refactor:
     - Apply: Changes step by step
     - Show: Diff per change
  4. update_consumers:
     - Find: All users of component
     - Update: If needed
  5. verify:
     - Run: Tests/linting
     - Show: Before/after comparison
```

---

### 6. 🛡️ Proactive Error Prevention

**Problem:** No warnings for known anti-patterns before execution.

**Solution:** Pre-flight checks with known problem patterns.

```markdown
## Pre-Flight Checks

### Automatic Validation Before Code Generation

```yaml
preflight_checks:
  couchcms:
    - pattern: "<!--.*<cms:.*-->"
      severity: critical
      message: "⚠️ CRITICAL: <cms: tags in HTML comments are EXECUTED! Use [cms: in comments."
      auto_fix: true

    - pattern: "<cms:embed.*in.*<cms:capture"
      severity: critical
      message: "⚠️ CRITICAL: Nested embeds in captures cause parse errors. Use inline markup."

    - pattern: "<cms:else></cms:else>"
      severity: error
      message: "❌ <cms:else> is self-closing. Use <cms:else /> instead of paired tags."
      auto_fix: true

  typescript:
    - pattern: ": any"
      severity: warning
      message: "⚠️ Avoid 'any' type. Define a specific type or interface."

    - pattern: "console.log"
      severity: info
      message: "ℹ️ console.log found. Remove for production?"

  security:
    - pattern: "innerHTML.*=.*user"
      severity: critical
      message: "⚠️ CRITICAL: Potential XSS risk. Use textContent or sanitize input."

    - pattern: "eval\\("
      severity: critical
      message: "⚠️ CRITICAL: eval() is a security risk. Use alternative approach."

### Execution:
1. Scan generated code against all checks
2. Stop at critical issues, ask confirmation for warnings
3. Show all findings in structured report
4. Offer auto-fix where available
```

---

### 7. 📊 Progressive Disclosure

**Problem:** Everything at one level, no quick vs. detailed mode.

**Solution:** Modes for different experience levels and speed.

```markdown
## Communication Modes

### Quick Mode (Default for experienced users)
- Minimal explanation, maximum action
- No confirmations for standard actions
- Compact output

```
User: /fix @films.php line 42
AI: ✅ Fixed: Replaced <cms:else></cms:else> with <cms:else />
    Files modified: 1
```

### Standard Mode
- Short explanation per action
- Confirmation for significant changes
- Structured output

```
User: fix @films.php line 42
AI: 📋 Issue: Paired tags for self-closing element
    Fix: Replace <cms:else></cms:else> → <cms:else />
    Apply fix? [Y/n]
```

### Verbose Mode (For learning/debugging)
- Full explanation and rationale
- Step-by-step process
- Educational context

```
User: /verbose fix @films.php line 42
AI: 📋 **Issue Analysis**

    **Problem Found:** Line 42 uses paired tags for <cms:else>

    **Why This Is Wrong:**
    In CouchCMS, <cms:else> and <cms:else_if> are self-closing tags.
    Using paired tags (</cms:else>) causes template parsing errors.

    **Solution:**
    Change: <cms:else></cms:else>
    To:     <cms:else />

    **Reference:** modules/couchcms-core.md, section "Self-Closing Tags"

    Apply fix? [Y/n]
```

### Mode Selection:
- `/quick` - Activate quick mode for session
- `/verbose` - Activate verbose mode for session
- `/standard` - Reset to standard mode
- Per-command: `/verbose fix @file`
```

---

### 8. 🔄 Smart Suggestions

**Problem:** No proactive suggestions for related improvements.

**Solution:** Context-aware suggestions after each action.

```markdown
## Smart Suggestions System

### After-Action Suggestions

```yaml
suggestion_triggers:
  file_modified:
    - check: "related_files_outdated"
      message: "💡 {count} related files use the same pattern. Update them too?"

    - check: "test_missing"
      message: "💡 No tests found for {file}. Generate?"

    - check: "documentation_outdated"
      message: "💡 Documentation for {feature} may be outdated. Update?"

  component_created:
    - suggest: "Register component in index?"
    - suggest: "Add to storybook/component library?"
    - suggest: "Create usage example?"

  bug_fixed:
    - suggest: "Add regression test?"
    - suggest: "Update error handling in similar locations?"
    - suggest: "Document fix in changelog?"

  refactor_completed:
    - check: "similar_patterns_exist"
      message: "💡 {count} other locations use similar pattern. Refactor them too?"
```

### Presentation:
- Suggestions displayed compactly after main action
- User can ignore or accept with single key (y/n/1/2/3)
- Suggestions are context-dependent and intelligently filtered
```

---

### 9. 📝 Template Expansion

**Problem:** Limited templates, lots of manual work for standard structures.

**Solution:** Extended template library with variations.

```markdown
## Extended Template Library

### Component Templates

#### `component-basic`
```html
<!-- {{paths.components}}/{{name}}.html -->
<div class="{{name}}">
    <cms:show content />
</div>
```

#### `component-alpine`
```html
<!-- {{paths.components}}/{{name}}.html -->
<div x-data="{{name}}Component()" class="{{name}}">
    <template x-if="loading">
        <div class="loading">Loading...</div>
    </template>
    <template x-if="!loading">
        <cms:show content />
    </template>
</div>
```

#### `component-card`
```html
<!-- {{paths.components}}/cards/{{name}}-card.html -->
<div class="card bg-base-100 shadow-lg">
    <figure class="aspect-video">
        <img src="<cms:show image />" alt="<cms:show title />" />
    </figure>
    <div class="card-body">
        <h2 class="card-title"><cms:show title /></h2>
        <p class="text-base-content/70"><cms:show description /></p>
        <div class="card-actions justify-end">
            <a href="<cms:show link />" class="btn btn-primary">View</a>
        </div>
    </div>
</div>
```

### View Templates

#### `view-list`
#### `view-detail`
#### `view-edit`
#### `view-crud` (bundle of all three)

### Form Templates

#### `form-simple`
#### `form-wizard`
#### `form-with-validation`

### Usage:
```
/component modal --template=component-alpine
/view products --template=view-crud
/form contact --template=form-with-validation
```
```

---

### 10. 🎓 Learning System

**Problem:** No systematic way to learn project-specific patterns.

**Solution:** Pattern learning and project-specific rules.

```markdown
## Learning System

### Pattern Recording

```yaml
# .project/learned-patterns.yaml

patterns:
  - id: "project-modal-pattern"
    trigger: "modal component"
    learned_from: "snippets/components/modal.html"
    template: |
      <div x-data="{ open: false }" @keydown.escape.window="open = false">
        <button @click="open = true"><cms:show trigger_text /></button>
        <div x-show="open" class="modal modal-open">
          <!-- content -->
        </div>
      </div>
    usage_count: 12
    last_used: "2025-11-26"

  - id: "project-auth-guard"
    trigger: "authenticated route"
    learned_from: "snippets/filters/authenticated.html"
    template: |
      <cms:if "<cms:not k_logged_in />">
        <cms:set_flash name='redirect_after_login' value=k_page_link />
        <cms:redirect "<cms:link 'users/login.php' />" />
      </cms:if>
    usage_count: 8

feedback_loop:
  - when: "user modifies generated code"
    action: "analyze difference"
    learn: "update pattern with preferred style"
    confirm: "I see you changed X to Y. Should I remember this for next time? [y/n]"
```

### Commands:
- `/learn @file` - Analyze file and extract patterns
- `/patterns` - Show learned patterns
- `/forget pattern-id` - Forget specific pattern
- `/apply pattern-id` - Apply pattern
```

---

## Implementation Priority

| Priority | Improvement | Impact | Effort | ROI |
|----------|-------------|--------|--------|-----|
| 1 | Quick Actions (Slash Commands) | High | Low | ⭐⭐⭐⭐⭐ |
| 2 | Smart Intent Detection | High | Medium | ⭐⭐⭐⭐ |
| 3 | Pre-flight Error Prevention | High | Low | ⭐⭐⭐⭐⭐ |
| 4 | Progressive Disclosure | Medium | Low | ⭐⭐⭐⭐ |
| 5 | Smart Defaults per Context | Medium | Medium | ⭐⭐⭐ |
| 6 | Workflow Automation | High | High | ⭐⭐⭐ |
| 7 | Project Context Caching | Medium | Medium | ⭐⭐⭐ |
| 8 | Smart Suggestions | Medium | Medium | ⭐⭐⭐ |
| 9 | Template Expansion | Medium | Low | ⭐⭐⭐⭐ |
| 10 | Learning System | Low | High | ⭐⭐ |

---

## Recommended First Phase

### Week 1-2: Quick Wins
1. **Slash Commands** implementation in framework
2. **Pre-flight checks** added to core.md
3. **Progressive Disclosure** modes documented

### Week 3-4: Foundation
4. **Smart Defaults** YAML structure created
5. **Intent Detection** patterns defined
6. **Template Expansion** library extended

### Week 5-6: Advanced
7. **Workflow Chains** for top-3 use cases
8. **Context Caching** structure implemented
9. **Smart Suggestions** framework

---

## Next Steps

1. Review this proposal
2. Prioritize which improvements you want first
3. Start with Quick Wins (Week 1-2)
4. Iterate based on usage

---

*Generated: 2025-11-26*
*Based on: Thorough analysis of all toolkit components*
