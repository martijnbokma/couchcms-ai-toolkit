# Integration Plan: Claude Code Infrastructure

## Architecture Overview

The existing flow remains intact:
```
project.md (Single Source of Truth)
    ↓
sync.js
    ↓
├── .cursorrules        (Cursor)
├── CLAUDE.md           (Claude)
├── AGENT.md            (Agents)
└── .claude/            (Claude Code CLI) ← NEW
    ├── settings.json
    └── skills/
        └── skill-rules.json
```

## How It Works

### 1. Toolkit contains skill-rules per module

```
ai-toolkit-shared/
├── modules/
│   ├── couchcms-core.md
│   └── couchcms-core.skill-rules.json    ← NEW
├── modules/
│   ├── tailwindcss.md
│   └── tailwindcss.skill-rules.json      ← NEW
└── ...
```

### 2. sync.js combines skill-rules based on modules in project.md

```yaml
# project.md
modules:
  - couchcms-core    # → loads couchcms-core.skill-rules.json
  - tailwindcss      # → loads tailwindcss.skill-rules.json
  - alpinejs         # → loads alpinejs.skill-rules.json
```

### 3. Generated output in project

```
my-project/
├── project.md                    # Single Source of Truth
├── .cursorrules                  # Generated
├── CLAUDE.md                     # Generated
├── AGENT.md                      # Generated
└── .claude/                      # Generated ← NEW
    ├── settings.json             # Generated
    └── skills/
        └── skill-rules.json      # Generated (combined from modules)
```

## Implementation Steps

### Step 1: Create skill-rules files per module

Each module gets a `.skill-rules.json` file with triggers:

```json
// modules/couchcms-core.skill-rules.json
{
  "couchcms-core": {
    "type": "domain",
    "priority": "high",
    "promptTriggers": {
      "keywords": ["couchcms", "couch", "cms:", "template", "snippet"],
      "intentPatterns": ["(create|add).*?(template|snippet)"]
    },
    "fileTriggers": {
      "pathPatterns": ["*.php", "snippets/**/*.html"],
      "contentPatterns": ["<cms:", "cms:template"]
    }
  }
}
```

### Step 2: Extend sync.js

New function `generateClaudeCodeConfig()`:
- Loads skill-rules from all modules
- Combines into one skill-rules.json
- Generates .claude/settings.json

### Step 3: Add hooks to toolkit

```
ai-toolkit-shared/
└── .claude/
    └── hooks/
        ├── skill-activation.js
        ├── post-edit-tracker.sh
        └── preflight-check.sh
```

These are copied to the project by sync.js

### Step 4: Template for settings.json

```
ai-toolkit-shared/
└── templates/
    └── claude/
        └── settings.template.json
```

---

## Benefits of This Approach

1. **project.md remains single source of truth**
   - All configuration in one place
   - No duplicate configuration

2. **Modules determine skill-rules**
   - Choose modules → get relevant triggers
   - Automatically up-to-date

3. **Backward compatible**
   - Existing projects continue to work
   - Claude Code support is optional

4. **Universal**
   - Works for any CouchCMS project
   - Modules are reusable

---

## Example Flow

**User has:**
```yaml
# project.md
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
```

**sync.js does:**
1. Loads `couchcms-core.skill-rules.json`
2. Loads `tailwindcss.skill-rules.json`
3. Loads `alpinejs.skill-rules.json`
4. Combines into `.claude/skills/skill-rules.json`
5. Generates `.claude/settings.json`
6. Copies hooks to `.claude/hooks/`

**Result:**
```json
// .claude/skills/skill-rules.json
{
  "couchcms-core": { ... },
  "tailwindcss": { ... },
  "alpinejs": { ... }
}
```

---

## Next Steps

1. ✅ Approve plan
2. Create skill-rules files per module
3. Extend sync.js
4. Create hooks
5. Test with existing project
