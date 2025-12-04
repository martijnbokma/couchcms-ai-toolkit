# Concepts Guide

Understanding the key concepts of the CouchCMS AI Toolkit with concrete examples.

---

## What is the Toolkit?

The CouchCMS AI Toolkit is a collection of knowledge modules and AI agents that help AI assistants (like Cursor, Claude Code, GitHub Copilot) understand your CouchCMS project better.

**Concrete example:**
- **Without toolkit:** AI doesn't know CouchCMS patterns, suggests generic PHP code
- **With toolkit:** AI knows CouchCMS tags, suggests proper `<cms:editable>` usage

---

## Modules vs Agents

### Modules = Knowledge

**What they are:** Knowledge modules that teach AI assistants about frameworks and patterns.

**Concrete example:**
- **Module:** `tailwindcss.md` - Contains TailwindCSS patterns and best practices
- **What it does:** Teaches AI how to use TailwindCSS classes correctly
- **Result:** AI suggests `bg-primary text-base-content` instead of `bg-blue-500 text-black`

**All CouchCMS Modules (Always Included):**
1. `couchcms-core` - Core CouchCMS patterns
2. `databound-forms` - Form handling patterns
3. `custom-routes` - URL routing patterns
4. `folders` - Content organization
5. `archives` - Time-based organization
6. `relationships` - Page relationships
7. `repeatable-regions` - Dynamic content blocks
8. `search` - Search functionality
9. `pagination` - Pagination controls
10. `comments` - Comment system
11. `users` - User management

**Optional Frontend Modules:**
- `tailwindcss` - TailwindCSS patterns
- `daisyui` - daisyUI components
- `alpinejs` - Alpine.js patterns
- `typescript` - TypeScript standards

### Agents = Specialized Assistants

**What they are:** Specialized AI agents that provide focused help for specific tasks.

**Concrete example:**
- **Agent:** `@couchcms` - Specialized in CouchCMS development
- **What it does:** Provides CouchCMS-specific guidance when you use `@couchcms` in chat
- **Result:** When you ask `@couchcms how do I create a template?`, it gives CouchCMS-specific answers

**All CouchCMS Agents (Always Included):**
1. `@couchcms` - Core CouchCMS development
2. `@databound-forms` - Forms and CRUD operations
3. `@custom-routes` - URL routing
4. `@views` - List/Page/Folder/Archive views
5. `@folders` - Content organization
6. `@archives` - Time-based organization
7. `@relationships` - Page relationships
8. `@repeatable-regions` - Dynamic content
9. `@search` - Search functionality
10. `@pagination` - Pagination
11. `@comments` - Comment system
12. `@nested-pages` - Hierarchical pages
13. `@photo-gallery` - Image galleries
14. `@rss-feeds` - RSS feeds
15. `@on-page-editing` - Visual editing
16. `@users` - User management

**Optional Frontend Agents:**
- `@tailwindcss` - TailwindCSS styling
- `@alpinejs` - Alpine.js development
- `@typescript` - TypeScript development

**Optional Dev Tool Agents:**
- `@bun` - Bun runtime and build tools
- `@git` - Git version control
- `@mysql` - Database operations
- `@admin-panel-theming` - Admin panel customization

---

## Configuration File: `.project/standards.md`

**What it is:** Single source of truth for your project configuration.

**Concrete example:**
```yaml
---
project:
    name: 'my-blog'
    description: 'A blog about web development'

toolkit: './ai-toolkit-shared'

modules:
    - couchcms-core
    - tailwindcss
    - alpinejs

active_agents:
    - couchcms
    - tailwindcss
    - alpinejs
---

# Your project-specific rules here
```

**What it does:**
- Tells toolkit which modules to load
- Tells toolkit which agents to enable
- Contains your project-specific coding standards
- Single file controls all AI configurations

**Location:** Always `.project/standards.md` (standardized)

---

## Setup Complexity

### Easy

**What you get:**
- All CouchCMS modules/agents (automatic)
- TailwindCSS + Alpine.js (recommended defaults)
- 2 questions: project name, description
- Time: ~1 minute

**Concrete example:**
```
Question 1: Project name? → my-blog
Question 2: Description? → A blog about web development
Done! ✅
```

**Perfect for:** Getting started quickly, beginners

### Medium

**What you get:**
- All CouchCMS modules/agents (automatic)
- Choose CSS framework (TailwindCSS, daisyUI, none)
- Choose JS framework (Alpine.js, TypeScript, none)
- 5 questions total
- Time: ~3 minutes

**Concrete example:**
```
Question 1: Project name? → my-blog
Question 2: Description? → A blog about web development
Question 3: CSS framework? → 1 (TailwindCSS)
Question 4: JS framework? → 1 (Alpine.js)
Question 5: Toolkit path? → ./ai-toolkit-shared (auto-detected)
Done! ✅
```

**Perfect for:** Most projects, want to choose frameworks

### Comprehensive

**What you get:**
- All CouchCMS modules/agents (automatic)
- All frontend options available
- Advanced configuration options
- 8+ questions
- Time: ~5 minutes

**Concrete example:**
```
[All questions from Medium, plus:]
Question 6: Additional CSS frameworks? → daisyui
Question 7: Additional JS frameworks? → typescript
Question 8: Framework configuration? → [advanced options]
Done! ✅
```

**Perfect for:** Complete control, advanced users

**Important:** All CouchCMS components are included automatically in all modes.

---

## How It Works

### Step 1: Configuration

You create `.project/standards.md` with your preferences:
```yaml
modules:
    - couchcms-core
    - tailwindcss
```

### Step 2: Sync

Run `toolkit sync` to generate AI configs:
```bash
bun ai-toolkit-shared/scripts/cli/toolkit.js sync
```

### Step 3: AI Configs Generated

The toolkit reads your `standards.md`, loads the modules you selected, and generates:
- `.cursorrules` - For Cursor AI
- `CLAUDE.md` - For Claude Code
- `.claude/skills/*.md` - Claude Code skills
- And more...

### Step 4: AI Uses Configs

When you use AI in your editor:
- AI reads `.cursorrules` (or `CLAUDE.md`)
- AI learns about CouchCMS patterns from modules
- AI provides better, framework-specific suggestions

**Concrete example:**
- **Before:** AI suggests generic PHP: `echo $content;`
- **After:** AI suggests CouchCMS: `<cms:show k_page_content />`

---

## CouchCMS Automatic Inclusion

**Key Principle:** All CouchCMS modules and agents are **always included automatically**.

**What this means:**
- You don't choose CouchCMS modules/agents
- They're included regardless of setup complexity
- They're included in Easy, Medium, and Comprehensive modes
- No configuration needed

**Concrete example:**
```
Easy mode setup:
✅ CouchCMS modules: 11 included automatically
✅ CouchCMS agents: 16 included automatically
✅ Frontend: TailwindCSS + Alpine.js (defaults)

Medium mode setup:
✅ CouchCMS modules: 11 included automatically
✅ CouchCMS agents: 16 included automatically
✅ Frontend: Your choice (CSS + JS frameworks)

Comprehensive mode setup:
✅ CouchCMS modules: 11 included automatically
✅ CouchCMS agents: 16 included automatically
✅ Frontend: All options available
```

**Why:** CouchCMS is the core framework. These components are essential for any CouchCMS project.

---

## Frontend Optional Selection

**Key Principle:** Only frontend frameworks are optional.

**What you choose:**
- CSS frameworks: TailwindCSS, daisyUI, or none
- JS frameworks: Alpine.js, TypeScript, or none

**Concrete example:**

**Easy mode:**
- CSS: TailwindCSS (automatic default)
- JS: Alpine.js (automatic default)
- No questions asked

**Medium mode:**
- CSS: Choose one (TailwindCSS, daisyUI, or none)
- JS: Choose one (Alpine.js, TypeScript, or none)
- 2 questions

**Comprehensive mode:**
- CSS: Choose any combination
- JS: Choose any combination
- All options available

**Why:** Different projects need different frontend stacks. CouchCMS works with any frontend.

---

## Progressive Disclosure

**What it is:** Showing options gradually, not all at once.

**Concrete example:**

**Easy mode:**
```
Shows: Project name, description
Hides: Advanced frontend options, framework config
Access: Can say "show more" to access hidden options
```

**Medium mode:**
```
Shows: Project info + CSS choice + JS choice
Hides: Advanced configuration, dev tools
Access: Can say "show more" to access hidden options
```

**Comprehensive mode:**
```
Shows: Everything immediately
Hides: Nothing
Access: All options visible from start
```

**Key principle:** All options are always accessible, just organized by complexity.

---

## Before/After Comparison

### Before Toolkit

**Problem:** AI doesn't understand CouchCMS
```php
// AI suggests generic PHP
<?php
$content = getContent();
echo $content;
?>
```

**Problem:** AI doesn't know TailwindCSS patterns
```html
<!-- AI suggests hardcoded colors -->
<div style="background-color: #3b82f6; color: #000000;">
```

### After Toolkit

**Solution:** AI understands CouchCMS
```php
<!-- AI suggests CouchCMS tags -->
<cms:show k_page_content />
```

**Solution:** AI knows TailwindCSS semantic colors
```html
<!-- AI suggests theme-aware colors -->
<div class="bg-primary text-base-content">
```

---

## Real-World Scenarios

### Scenario 1: New Blog Project

**Setup:** Easy mode
**Result:**
- ✅ All CouchCMS features included
- ✅ TailwindCSS + Alpine.js ready
- ✅ 2 questions, 1 minute
- ✅ Ready to start coding

**What you can do:**
- Create blog templates with `<cms:editable>`
- Style with TailwindCSS classes
- Add interactivity with Alpine.js
- Use `@couchcms` agent for help

### Scenario 2: E-commerce Site

**Setup:** Medium mode
**Result:**
- ✅ All CouchCMS features included
- ✅ Choose daisyUI for components
- ✅ Choose TypeScript for type safety
- ✅ 5 questions, 3 minutes

**What you can do:**
- Use daisyUI components (`btn`, `card`, `modal`)
- TypeScript for form validation
- DataBound Forms for product management
- Use `@databound-forms` agent for CRUD help

### Scenario 3: Complex Web App

**Setup:** Comprehensive mode
**Result:**
- ✅ All CouchCMS features included
- ✅ All frontend options available
- ✅ Advanced configuration
- ✅ 8+ questions, 5 minutes

**What you can do:**
- Full control over all options
- Custom framework configuration
- Advanced editor settings
- Complete customization

---

## Key Takeaways

1. **CouchCMS automatic:** All CouchCMS modules/agents always included
2. **Frontend optional:** You choose CSS/JS frameworks
3. **Single config:** `.project/standards.md` controls everything
4. **Progressive disclosure:** Options organized by complexity, all accessible
5. **Easy change:** `toolkit reconfigure` to change anytime

---

## Next Steps

- **Ready to setup?** → See [Quick Start Beginner Guide](QUICK-START-BEGINNER.md)
- **Want commands?** → See [Commands Reference](COMMANDS.md)
- **Need help?** → See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Questions?** Check [START-HERE.md](START-HERE.md) for decision tree.
