# Analysis: Claude Code Best Practices for CouchCMS AI Toolkit

## Executive Summary

After thorough analysis of:
1. **Reddit Post**: "Claude Code is a Beast – Tips from 6 Months of Hardcore Use" (7.2k stars)
2. **GitHub Repository**: `claude-code-infrastructure-showcase` (7.2k stars, 933 forks)
3. **Current CouchCMS AI Toolkit structure**

I identify **12 critical improvements** that can transform the toolkit into a production-ready, universal system for AI-assisted CouchCMS development.

---

## Key Findings from Sources

### Reddit Post - Key Takeaways

| Concept | Description | Impact |
|---------|-------------|--------|
| **Skills Auto-Activation** | Hooks that automatically activate skills based on context | Game changer |
| **500-Line Rule** | Skills <500 lines + resource files for progressive disclosure | Token efficiency +40-60% |
| **Dev Docs System** | 3-file structure: plan.md, context.md, tasks.md | Prevents context loss |
| **Hooks Pipeline** | UserPromptSubmit + PostToolUse + Stop hooks | Zero errors left behind |
| **skill-rules.json** | Central configuration for skill triggers | Automatic activation |
| **Planning First** | Plan mode → approved plan → dev docs → implement | Consistent output |
| **PM2 Process Management** | Backend service management with logs | Debugging efficiency |
| **Specialized Agents** | Subagents for specific tasks (review, debug, plan) | Task focus |

### GitHub Repository - Structure Analysis

```
.claude/
├── skills/                    # 5 production skills
│   ├── backend-dev-guidelines/
│   │   ├── SKILL.md           # <500 lines
│   │   └── resources/         # 12 detail files
│   ├── frontend-dev-guidelines/
│   │   ├── SKILL.md           # <500 lines
│   │   └── resources/         # 11 detail files
│   ├── skill-developer/
│   ├── route-tester/
│   ├── error-tracking/
│   └── skill-rules.json       # ⭐ CRITICAL: Auto-activation config
├── hooks/                     # 6 hooks for automation
│   ├── skill-activation-prompt.*    # UserPromptSubmit
│   ├── post-tool-use-tracker.sh     # PostToolUse
│   ├── tsc-check.sh                 # Stop
│   └── trigger-build-resolver.sh    # Stop
├── agents/                    # 10 specialized agents
│   ├── code-architecture-reviewer.md
│   ├── refactor-planner.md
│   └── ...
└── commands/                  # 3 slash commands
    ├── dev-docs.md
    └── ...

dev/
└── active/                    # Dev docs pattern
    └── [task-name]/
        ├── [task]-plan.md
        ├── [task]-context.md
        └── [task]-tasks.md
```

---

## Gap Analysis: Current Toolkit vs. Best Practices

### Current CouchCMS AI Toolkit Structure

```
ai-toolkit-shared/
├── modules/              # 6 knowledge modules
├── agents/               # 9 AI agents
├── rules/                # Auto-loading Cursor rules
├── scripts/              # init, validate, sync
├── templates/            # Project templates
├── framework/            # Core framework files
└── prompts/              # Prompt templates
```

### Comparison

| Feature | Best Practice | Current Toolkit | Gap |
|---------|---------------|-----------------|-----|
| **Skill Auto-Activation** | ✅ Via hooks + skill-rules.json | ❌ Manual | CRITICAL |
| **500-Line Rule** | ✅ All skills <500 lines | ⚠️ Modules unstructured | MEDIUM |
| **Hooks System** | ✅ 6 hooks | ❌ No hooks | CRITICAL |
| **Dev Docs Workflow** | ✅ 3-file pattern | ❌ No workflow | HIGH |
| **Slash Commands** | ✅ Custom commands | ⚠️ Scripts only | MEDIUM |
| **skill-rules.json** | ✅ Central config | ❌ Not present | CRITICAL |
| **Progressive Disclosure** | ✅ Main + resources | ⚠️ No resource files | MEDIUM |
| **Specialized Agents** | ✅ 10 agents | ✅ 9 agents | OK |
| **Project Context** | ✅ Cached/persistent | ⚠️ project.md only | MEDIUM |

---

## Recommendations for Universal System

### 1. 🔧 Implement `.claude/` Directory Structure

**Why**: Claude Code expects specific directory structure. This makes the toolkit compatible with Claude Code CLI.

```
ai-toolkit-shared/
├── .claude/                          # ⭐ NEW
│   ├── settings.json                 # Claude Code configuration
│   ├── skills/
│   │   ├── couchcms-core/
│   │   │   ├── SKILL.md              # <500 lines
│   │   │   └── resources/
│   │   │       ├── template-syntax.md
│   │   │       ├── security-patterns.md
│   │   │       ├── routing.md
│   │   │       └── ...
│   │   ├── tailwindcss/
│   │   ├── alpinejs/
│   │   ├── databound-forms/
│   │   └── skill-rules.json          # Auto-activation config
│   ├── hooks/
│   │   ├── skill-activation.js       # UserPromptSubmit hook
│   │   ├── post-edit-tracker.sh      # PostToolUse hook
│   │   └── build-check.sh            # Stop hook
│   ├── agents/
│   │   └── ... (existing agents)
│   └── commands/
│       ├── dev-docs.md
│       └── sync-config.md
├── modules/                          # Keep for Cursor compatibility
├── agents/                           # Keep
└── ...
```

### 2. ⭐ Create `skill-rules.json` for Auto-Activation

This is the **core** of the auto-activation system.

```json
{
  "couchcms-core": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["couchcms", "couch", "cms:", "template", "snippet", "embed"],
      "intentPatterns": [
        "(create|add|modify).*?(template|page|snippet)",
        "(how to|best practice).*?(couchcms|couch)",
        "(fix|debug).*?cms:"
      ]
    },
    "fileTriggers": {
      "pathPatterns": [
        "*.php",
        "snippets/**/*.html",
        "views/**/*.html",
        "templates/**/*.html"
      ],
      "contentPatterns": [
        "<cms:",
        "cms:template",
        "cms:editable",
        "k_page_"
      ]
    }
  },
  "tailwindcss": {
    "type": "styling",
    "enforcement": "suggest",
    "priority": "medium",
    "promptTriggers": {
      "keywords": ["tailwind", "css", "style", "class", "daisyui", "daisy"],
      "intentPatterns": [
        "(style|design).*?(component|element)",
        "(add|change).*?(class|styling)"
      ]
    },
    "fileTriggers": {
      "pathPatterns": ["*.css", "tailwind.config.*"],
      "contentPatterns": ["@tailwind", "theme(", "class=\""]
    }
  },
  "alpinejs": {
    "type": "interactivity",
    "enforcement": "suggest",
    "priority": "medium",
    "promptTriggers": {
      "keywords": ["alpine", "x-data", "x-bind", "x-on", "interactiv"],
      "intentPatterns": [
        "(add|create).*?(interactiv|dynamic|state)",
        "(toggle|show|hide)"
      ]
    },
    "fileTriggers": {
      "pathPatterns": ["components/**/*.html", "snippets/**/*.html"],
      "contentPatterns": ["x-data", "x-bind", "x-on", "@click"]
    }
  },
  "databound-forms": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["form", "validation", "crud", "databound", "bound_"],
      "intentPatterns": [
        "(create|add).*?(form|input|validation)",
        "(edit|delete|update).*?record"
      ]
    },
    "fileTriggers": {
      "pathPatterns": ["snippets/forms/**/*.html", "snippets/crud/**/*.html"],
      "contentPatterns": ["<cms:db_persist", "<cms:input", "bound_"]
    }
  },
  "typescript": {
    "type": "language",
    "enforcement": "suggest",
    "priority": "medium",
    "promptTriggers": {
      "keywords": ["typescript", "ts", "type", "interface", "async"],
      "intentPatterns": [
        "(create|add).*?(function|component|module)",
        "type.*?(error|issue)"
      ]
    },
    "fileTriggers": {
      "pathPatterns": ["*.ts", "*.tsx", "tsconfig.json"],
      "contentPatterns": ["interface ", "type ", ": string", ": number"]
    }
  }
}
```

### 3. 🪝 Implement Hooks System

**UserPromptSubmit Hook** - Analyzes prompt and suggests skills:

```javascript
// .claude/hooks/skill-activation.js
const fs = require('fs');
const path = require('path');

function analyzePrompt(prompt, editedFiles) {
  const skillRules = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../skills/skill-rules.json'), 'utf8')
  );

  const suggestions = [];

  for (const [skillName, config] of Object.entries(skillRules)) {
    let score = 0;

    // Check keywords
    if (config.promptTriggers?.keywords) {
      for (const keyword of config.promptTriggers.keywords) {
        if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
          score += 10;
        }
      }
    }

    // Check intent patterns
    if (config.promptTriggers?.intentPatterns) {
      for (const pattern of config.promptTriggers.intentPatterns) {
        if (new RegExp(pattern, 'i').test(prompt)) {
          score += 20;
        }
      }
    }

    // Check edited files
    if (editedFiles && config.fileTriggers?.pathPatterns) {
      for (const file of editedFiles) {
        for (const pattern of config.fileTriggers.pathPatterns) {
          if (matchGlob(file, pattern)) {
            score += 15;
          }
        }
      }
    }

    if (score > 0) {
      suggestions.push({ skill: skillName, score, priority: config.priority });
    }
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 suggestions
}

function matchGlob(file, pattern) {
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\./g, '\\.');
  return new RegExp(`^${regexPattern}$`).test(file);
}

// Called by Claude Code
module.exports = {
  onUserPromptSubmit: (prompt, context) => {
    const suggestions = analyzePrompt(prompt, context.recentlyEditedFiles);

    if (suggestions.length > 0) {
      return {
        inject: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${suggestions.map(s => `• Use ${s.skill} skill (score: ${s.score})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim()
      };
    }
    return null;
  }
};
```

**PostToolUse Hook** - Tracks edits for build checks:

```bash
#!/bin/bash
# .claude/hooks/post-edit-tracker.sh

EDIT_LOG=".claude/edit-tracker.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Log edited file
if [ -n "$CLAUDE_EDITED_FILE" ]; then
  echo "$TIMESTAMP|$CLAUDE_EDITED_FILE" >> "$EDIT_LOG"
fi
```

### 4. 📁 Restructure Modules to 500-Line Skills

**Example: couchcms-core module → skill with resources**

```
modules/couchcms-core.md              # CURRENT: 1 large file

.claude/skills/couchcms-core/         # NEW
├── SKILL.md                          # <500 lines - Overview + Navigation
└── resources/
    ├── template-syntax.md            # <500 lines - <cms:> tags reference
    ├── security-patterns.md          # <500 lines - Security best practices
    ├── routing-patterns.md           # <500 lines - Pretty URLs, routes
    ├── forms-crud.md                 # <500 lines - Basic forms
    ├── caching.md                    # <500 lines - Performance
    ├── snippets-embeds.md            # <500 lines - Code organization
    ├── common-pitfalls.md            # <500 lines - Known issues
    └── examples/
        ├── blog-template.md
        ├── crud-example.md
        └── ajax-example.md
```

**SKILL.md Structure:**

```markdown
# CouchCMS Core Development Guidelines

<version>1.0.0</version>
<priority>high</priority>

## Quick Reference

[Template Syntax](resources/template-syntax.md) |
[Security](resources/security-patterns.md) |
[Routing](resources/routing-patterns.md) |
[Forms](resources/forms-crud.md)

## Core Principles

1. **Template-First**: CouchCMS is template-driven
2. **Security by Default**: Always sanitize, always validate
3. **Clean URLs**: Use prettyURLs and routes
4. **DRY**: Use snippets and embeds

## When to Load Resources

| Task | Load Resource |
|------|---------------|
| Creating templates | template-syntax.md |
| Handling forms | forms-crud.md |
| Security audit | security-patterns.md |
| URL setup | routing-patterns.md |

## Critical Rules

### Self-Closing Tags (CRITICAL)
```
<cms:else />        ✅ Correct
<cms:else></cms:else>  ❌ WRONG - causes parse errors
```

### Comment Safety (CRITICAL)
```
<!-- [cms: disabled tag] -->  ✅ Safe
<!-- <cms: active tag> -->    ❌ EXECUTES! Not safe
```

[Full reference →](resources/template-syntax.md)

... (max 500 lines total)
```

### 5. 📝 Implement Dev Docs Workflow

**Slash Command: `/dev-docs`**

```markdown
# /dev-docs Command

## Purpose
Create structured development documentation for any task to survive context resets.

## Generated Files

### 1. [task]-plan.md
```markdown
# [Task Name] - Implementation Plan

## Objective
[Clear description of what we're building]

## Phases

### Phase 1: [Name]
- [ ] Step 1
- [ ] Step 2

### Phase 2: [Name]
- [ ] Step 1
- [ ] Step 2

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| ... | ... |
```

### 2. [task]-context.md
```markdown
# [Task Name] - Context

## Key Files
- `path/to/file.php` - Description
- `path/to/other.html` - Description

## Decisions Made
1. Decision 1 - Rationale
2. Decision 2 - Rationale

## Dependencies
- Requires: X, Y, Z
- Affects: A, B, C

## Notes
- Important observation 1
- Important observation 2
```

### 3. [task]-tasks.md
```markdown
# [Task Name] - Task Checklist

## Status: In Progress
Last Updated: [timestamp]

## Tasks

### Phase 1
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Phase 2
- [ ] Future task
- [ ] Future task

## Blockers
- None currently

## Next Steps
1. Immediate next step
2. Following step
```

## Usage
```
/dev-docs new-feature-name
/dev-docs update
/dev-docs status
```
```

### 6. 🎯 Create settings.json for Claude Code

```json
{
  "$schema": "https://claude.ai/schemas/claude-code-settings.json",
  "version": "1.0.0",
  "name": "CouchCMS AI Toolkit",

  "hooks": {
    "UserPromptSubmit": [
      {
        "path": ".claude/hooks/skill-activation.js",
        "description": "Auto-suggest relevant skills based on prompt"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "path": ".claude/hooks/post-edit-tracker.sh",
        "description": "Track edited files for build checks"
      }
    ],
    "Stop": [
      {
        "path": ".claude/hooks/preflight-check.sh",
        "description": "Run preflight checks before completing"
      }
    ]
  },

  "skills": {
    "autoLoad": ["couchcms-core"],
    "suggest": true,
    "rulesPath": ".claude/skills/skill-rules.json"
  },

  "devDocs": {
    "enabled": true,
    "directory": "dev/active",
    "template": ".claude/commands/dev-docs.md"
  },

  "defaults": {
    "mode": "standard",
    "autoApprove": false,
    "maxContextTokens": 100000
  }
}
```

### 7. 🛡️ Integrate Pre-flight Checks in Hooks

```bash
#!/bin/bash
# .claude/hooks/preflight-check.sh

EDIT_LOG=".claude/edit-tracker.log"
ISSUES_FOUND=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛡️ PRE-FLIGHT CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get recently edited files
if [ -f "$EDIT_LOG" ]; then
  RECENT_FILES=$(tail -20 "$EDIT_LOG" | cut -d'|' -f2 | sort -u)

  for FILE in $RECENT_FILES; do
    if [ -f "$FILE" ]; then
      # Check for CouchCMS critical issues
      if [[ "$FILE" == *.php ]] || [[ "$FILE" == *.html ]]; then

        # Check for <cms: in HTML comments (CRITICAL)
        if grep -q '<!--.*<cms:' "$FILE"; then
          echo "⚠️ CRITICAL: $FILE contains <cms: in HTML comments!"
          echo "   These tags will EXECUTE. Use [cms: for disabled tags."
          ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi

        # Check for paired <cms:else> tags
        if grep -q '<cms:else></cms:else>' "$FILE"; then
          echo "❌ ERROR: $FILE has paired <cms:else> tags"
          echo "   Use <cms:else /> (self-closing)"
          ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi

      fi

      # Check TypeScript files
      if [[ "$FILE" == *.ts ]]; then
        if grep -q ': any' "$FILE"; then
          echo "⚠️ WARNING: $FILE contains 'any' type"
          echo "   Consider using specific types"
        fi
      fi
    fi
  done
fi

echo ""
if [ $ISSUES_FOUND -gt 0 ]; then
  echo "❌ Found $ISSUES_FOUND critical issue(s). Please review."
else
  echo "✅ All checks passed!"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Clear edit log
> "$EDIT_LOG"

exit $ISSUES_FOUND
```

### 8. 🤖 Add Specialized Agents

**New agents based on best practices:**

```markdown
# .claude/agents/couchcms-security-reviewer.md

## Agent: CouchCMS Security Reviewer

### Purpose
Review CouchCMS templates for security vulnerabilities and best practices.

### Trigger
- Security audit requested
- Form/CRUD code created
- User input handling

### Checklist
- [ ] All user input is sanitized
- [ ] CSRF tokens present on forms
- [ ] Ownership checks for user content
- [ ] No <cms: tags in HTML comments
- [ ] Sensitive data properly protected
- [ ] Rate limiting considered

### Actions
1. Scan all template files
2. Check for common vulnerabilities
3. Generate security report
4. Suggest fixes
```

```markdown
# .claude/agents/couchcms-architecture-reviewer.md

## Agent: CouchCMS Architecture Reviewer

### Purpose
Review project architecture for CouchCMS best practices.

### Checklist
- [ ] Proper template inheritance
- [ ] Snippets organized by function
- [ ] Reusable components identified
- [ ] DRY principles followed
- [ ] Caching implemented where beneficial

### Output
Structured architecture report with recommendations.
```

### 9. 📊 Implementation Roadmap

#### Phase 1: Foundation (Week 1-2)
| Task | Priority | Effort |
|------|----------|--------|
| Create `.claude/` directory structure | CRITICAL | Low |
| Create `skill-rules.json` | CRITICAL | Medium |
| Restructure 1 module to skill + resources | HIGH | Medium |
| Basic hooks implementation | CRITICAL | Medium |

#### Phase 2: Core Features (Week 3-4)
| Task | Priority | Effort |
|------|----------|--------|
| All modules → skills migration | HIGH | High |
| Dev docs workflow implementation | HIGH | Medium |
| Pre-flight checks | HIGH | Low |
| `settings.json` configuration | MEDIUM | Low |

#### Phase 3: Polish (Week 5-6)
| Task | Priority | Effort |
|------|----------|--------|
| Additional specialized agents | MEDIUM | Medium |
| Extend slash commands | MEDIUM | Low |
| Update documentation | MEDIUM | Medium |
| Testing & iteration | HIGH | Medium |

---

## Universal System Architecture

### Objective
A system that works for **any CouchCMS project**, regardless of:
- Project size
- Modules used (TailwindCSS, Alpine.js, etc.)
- Editor (Cursor, Claude Code, VS Code)
- Developer experience

### Architecture

```
[PROJECT ROOT]
├── ai-toolkit-shared/                # Git submodule
│   ├── .claude/                      # Claude Code compatible
│   │   ├── settings.json
│   │   ├── skills/
│   │   │   ├── couchcms-core/
│   │   │   ├── tailwindcss/
│   │   │   ├── alpinejs/
│   │   │   ├── databound-forms/
│   │   │   ├── typescript/
│   │   │   └── skill-rules.json
│   │   ├── hooks/
│   │   ├── agents/
│   │   └── commands/
│   ├── modules/                      # Cursor compatible (alias to skills)
│   ├── agents/
│   ├── rules/
│   ├── scripts/
│   └── templates/
├── project.md                        # Project configuration
├── .cursorrules                      # Generated
├── CLAUDE.md                         # Generated
└── dev/
    └── active/                       # Dev docs
        └── [task-name]/
```

### Configuration Flow

```
1. User runs: bun ai-toolkit-shared/scripts/init.js
   ↓
2. Wizard asks: Which modules? Which agents?
   ↓
3. Script generates:
   - project.md (config)
   - .cursorrules (Cursor)
   - CLAUDE.md (Claude/Claude Code)
   ↓
4. skill-rules.json activates relevant skills automatically
   ↓
5. Hooks enforce patterns & suggestions
```

---

## Conclusion

The analysis of the Reddit post and GitHub repository reveals a **proven system** that:

1. **Automatically activates skills** - No manual loading needed
2. **Preserves context** - Via dev docs workflow
3. **Prevents errors** - Via pre-flight checks
4. **Delivers consistent output** - Via hooks and skill rules
5. **Is scalable** - 500-line rule with progressive disclosure

### Top 5 Priorities for CouchCMS AI Toolkit

1. **🔧 `.claude/` directory structure** - Claude Code compatibility
2. **⭐ `skill-rules.json`** - Auto-activation is the game changer
3. **🪝 Hooks system** - UserPromptSubmit + preflight checks
4. **📁 500-line skills** - Progressive disclosure
5. **📝 Dev docs workflow** - Context preservation

### Expected Impact

| Metric | Current | After Implementation |
|--------|---------|---------------------|
| Setup time new project | 5-10 min | 2 min |
| Context loss per session | High | Minimal |
| Skill activation | Manual | Automatic |
| Error prevention | Reactive | Proactive |
| Cross-editor support | Cursor only | Cursor + Claude Code |

---

*Analysis based on:*
- *Reddit: "Claude Code is a Beast – Tips from 6 Months of Hardcore Use"*
- *GitHub: diet103/claude-code-infrastructure-showcase*
- *Current CouchCMS AI Toolkit v1.1.0*

*Date: 2025-11-26*
