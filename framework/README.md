# CADS Framework (CouchCMS AI Development Standards)

A disciplined, evidence-first framework designed to elevate AI agents from simple command executors to **Autonomous Principal Engineers** working on CouchCMS projects.

**Philosophy:** Autonomy through discipline. Trust through verification.

CADS (CouchCMS AI Development Standards) is not just a collection of prompts; it is a complete operational system for managing AI agents in CouchCMS development. It enforces a rigorous workflow of reconnaissance, planning, safe execution, and self-improvement, ensuring every action the agent takes is deliberate, verifiable, and aligned with CouchCMS best practices and senior engineering standards.

**Integration:** CADS is fully integrated with the CouchCMS AI Toolkit, providing enhanced productivity through Smart Operations, automatic context loading, CouchCMS-specific pre-flight checks, and comprehensive quality assurance.

---

## Framework Structure

The framework is organized into four main categories:

### 1. Doctrine (Always Active)

The core operational principles that govern all agent behavior.

| File | Purpose | Reference |
|------|---------|-----------|
| `doctrine/operational-doctrine.md` | Core prompting principles - the "constitution" that defines agent identity, research protocols, safety guardrails, and professional standards | Primary system instruction set |

**Key Features:**
- **Reconnaissance Protocol:** 8-point checklist for system understanding
- **Operational Workflow:** Reconnaissance → Plan → Execute → Verify → Report
- **Smart Operations Integration:** Slash commands, intent detection, pre-flight checks
- **Project Standards Integration:** Automatic compliance checking
- **Playbook Integration:** Structured workflows for different scenarios

**Installation:** This is automatically included when the framework is enabled in `standards.md` or `project.md`.

### 2. Playbooks (Optional - Use When Needed)

Structured "mission briefing" templates for specific workflows. Paste into chat to initiate a task.

| File | Purpose | When to Use | Phases |
|------|---------|-------------|--------|
| `playbooks/request.md` | Feature Request / Refactoring Playbook | Building new features, refactoring code, or making any planned change | 5 phases: Reconnaissance → Plan → Execute → Verify → Report |
| `playbooks/refresh.md` | Bug Fix / Root Cause Analysis Playbook | When a bug is persistent and previous, simpler attempts have failed | 6 phases: Isolate → Analyze → Remediate → Verify → Audit → Report |
| `playbooks/retro.md` | Session Retrospective / Doctrine Evolution | At the end of a session to capture learnings and improve the doctrine | 7 phases: Context → Success → Failure → Impact → Integration → Meta-Learning → Final |

**Status Markers:** The agent uses these markers in reports:
- `✅`: Success / Completed
- `⚠️`: Warning / Self-corrected
- `🚧`: Blocked / Needs attention
- `💡`: Suggestion / Improvement

**Usage:** Copy the playbook content, replace the placeholder with your specific request, and paste into chat.

### 3. Directives (Always Active)

Communication guidelines that modify agent behavior for professional, concise interaction.

| File | Purpose | Impact |
|------|---------|--------|
| `directives/concise.md` | Mandates radically concise, information-dense communication, removing all conversational filler | Reduces verbosity, increases information density |
| `directives/communication.md` | Avoids sycophantic language and maintains professional, technical communication | Ensures professional, technical tone |

**Integration:** These directives are automatically applied to all AI agent configurations when the framework is enabled.

### 4. Enhancements (Optional - Advanced Features)

Advanced productivity features for experienced users.

| File | Purpose | Features |
|------|---------|----------|
| `enhancements/smart-operations.md` | Enhanced AI Efficiency Layer | Slash commands, intent detection, pre-flight checks, communication modes, smart context loading, after-action suggestions |

**Smart Operations Features:**

**Quick Actions (Slash Commands):**
- **Code Modification**: `/fix @file`, `/refactor @file`, `/review @file`, `/optimize @file`
- **Creation**: `/component <name>`, `/view <name>`, `/form <name>`, `/api <name>`
- **Workflow**: `/sync`, `/validate`, `/status`
- **Communication Modes**: `/quick` or `/q`, `/verbose` or `/v`, `/standard`

**Intent Detection:**
- Automatic understanding of user goals from natural language
- Pattern matching for common tasks
- Context-aware action execution

**Pre-Flight Checks:**
- Automatic code quality scanning before modifications
- Security vulnerability detection
- Framework-specific checks (CouchCMS, TypeScript, etc.)
- Auto-fix support for common issues

**Smart Context Loading:**
- Auto-load relevant agents/modules based on file type
- Project context caching for performance
- File-type-specific suggestions

**After-Action Suggestions:**
- Proactive improvement recommendations
- System-wide consistency checks
- Related file updates

**Configuration:** See `preflight-checks.yaml` and `smart-defaults.yaml` for complete configuration options.

---

## Core Philosophy

This framework is built on five foundational principles:

1. **Research-First, Always:** The agent must never act on assumption. Every action is preceded by a thorough investigation of the current system state. The code is the ultimate source of truth.

2. **Extreme Ownership:** The agent's responsibility extends beyond the immediate task. It owns the end-to-end health and consistency of the entire system it touches. All consumers of modified components must be updated.

3. **Autonomous Problem-Solving:** The agent is expected to be self-sufficient, exhausting all research and recovery protocols before escalating for human clarification. Only escalate when facing epistemic conflict, resource absence, irreversible jeopardy, or research saturation.

4. **Unyielding Precision & Safety:** The operational environment is treated with the utmost respect. Every command is executed safely with timeout enforcement, and the workspace is kept pristine. Read-write-reread pattern is non-negotiable.

5. **Metacognitive Self-Improvement:** The agent is designed to learn. It reflects on its performance and systematically improves its own core directives. Lessons learned are integrated into doctrine and standards.

---

## How to Use CADS in Your CouchCMS Project

### Quick Start for CouchCMS Developers

**Step 1: Enable CADS in Your Project**

During setup (via wizard or CLI), enable CADS:
```yaml
# In your standards.md
framework: true
```

Or enable specific components:
```yaml
framework:
  doctrine: true      # Core principles (always recommended)
  directives: true    # Communication guidelines (always recommended)
  playbooks: true      # Structured workflows (recommended)
  enhancements: true   # Smart Operations (optional, advanced)
```

**Step 2: Sync Your Configuration**

After enabling, sync to apply CADS to all AI tools:
```bash
bun scripts/sync.js
```

This updates:
- `.cursorrules` (Cursor AI)
- `CLAUDE.md` (Claude AI)
- `.github/copilot-instructions.md` (GitHub Copilot)
- And other AI tool configurations

**Step 3: Start Using CADS**

### Typical Session Workflow

1. **For New Features (CouchCMS Example):**
   ```
   "Create a blog listing page with pagination"
   ```
   The agent will:
   - Investigate your existing CouchCMS templates
   - Check for existing pagination patterns
   - Create templates following CouchCMS conventions
   - Use proper `<cms:pages>` tags with pagination
   - Ensure security (no `<cms:` tags in HTML comments)

2. **For Bug Fixes:**
   ```
   "Fix the form submission error in contact.php"
   ```
   The agent will:
   - Investigate the DataBound Form implementation
   - Check CSRF tokens and validation
   - Test ownership filters if needed
   - Verify CouchCMS security patterns

3. **For Refactoring:**
   ```
   "Refactor the product listing to use repeatable regions"
   ```
   The agent will:
   - Analyze current template structure
   - Plan migration to repeatable regions
   - Update all related templates
   - Maintain backward compatibility

### CouchCMS-Specific Features

**Pre-Flight Checks:**
- ✅ Detects `<cms:` tags in HTML comments (critical security issue)
- ✅ Validates `<cms:else />` self-closing syntax
- ✅ Checks Alpine.js syntax (full `x-on:click` not `@click`)
- ✅ Verifies daisyUI semantic colors (not hardcoded colors)
- ✅ Ensures proper template structure

**Smart Context Loading:**
- `*.php` files → Automatically loads `@couchcms` agent
- `snippets/forms/*.html` → Loads `@databound-forms` + `@couchcms`
- `snippets/components/*.html` → Loads `@couchcms` + `@alpinejs`
- `assets/css/*.css` → Loads `@tailwindcss` + `@daisyui`

**Example: Creating a CouchCMS Template**

Just ask:
```
"Create a blog post template with featured image, author, and publish date"
```

CADS will:
1. **Reconnaissance:** Check existing blog templates, layout structure
2. **Plan:** Design template with proper CouchCMS editable regions
3. **Execute:** Create template with:
   - Proper `<cms:template>` structure
   - `<cms:editable>` fields for content
   - Security checks (no tags in comments)
   - Alpine.js integration (full syntax)
   - daisyUI components (semantic colors)
4. **Verify:** Run pre-flight checks, test template
5. **Report:** Show what was created and why

### Using Playbooks (Advanced)

For complex tasks, use structured playbooks:

1. **Copy a playbook** (e.g., `framework/playbooks/request.md`)
2. **Replace the placeholder** with your CouchCMS task:
   ```
   Create a user profile page with editable fields for name, bio, and avatar image.
   Include ownership checks so users can only edit their own profiles.
   ```
3. **Paste into chat** - The agent follows the structured workflow

### Common CouchCMS Tasks with CADS

**Creating a DataBound Form:**
```
"Create a contact form with name, email, message fields and spam protection"
```
→ Agent uses `@databound-forms` knowledge, creates proper CSRF handling

**Adding Search:**
```
"Add search functionality to the blog"
```
→ Agent uses `@search` knowledge, implements MySQL fulltext search

**Setting up Custom Routes:**
```
"Create clean URLs for blog posts: /blog/post-name"
```
→ Agent uses `@custom-routes` knowledge, sets up routing

**Building a Photo Gallery:**
```
"Create a photo gallery with batch upload and EXIF data"
```
→ Agent uses `@photo-gallery` knowledge, implements proper image handling

### What CADS Does for CouchCMS Development

**Automatic CouchCMS Pattern Recognition:**
- Recognizes CouchCMS template structure
- Understands `<cms:pages>`, `<cms:show>`, `<cms:editable>` patterns
- Knows DataBound Forms, custom routes, folders, archives
- Applies CouchCMS security rules automatically

**Quality Assurance:**
- Pre-flight checks catch CouchCMS-specific errors before code is written
- Validates template syntax and structure
- Ensures proper Alpine.js integration (full syntax required)
- Checks daisyUI semantic color usage

**Smart Agent Selection:**
- Automatically selects the right CouchCMS agents for each task
- Loads relevant knowledge modules based on file types
- Coordinates multiple agents for complex features

**Example Workflow:**

You: "Add a comment system to blog posts"

CADS Process:
1. **Reconnaissance:**
   - Checks existing blog templates
   - Looks for comment patterns
   - Reviews `@comments` module knowledge

2. **Planning:**
   - Plans comment form integration
   - Designs moderation workflow
   - Considers spam protection

3. **Execution:**
   - Creates comment form snippet
   - Adds comment listing to blog template
   - Implements moderation interface
   - Adds CAPTCHA if needed

4. **Verification:**
   - Tests comment submission
   - Verifies CSRF protection
   - Checks ownership filters
   - Validates CouchCMS patterns

5. **Report:**
   - Shows what was created
   - Explains CouchCMS patterns used
   - Lists security measures implemented

---

## Guiding Principles

- **Be Specific:** In your initial request, clearly state *what* you want and *why* it's important. Include context about the problem it solves.

- **Trust the Process:** The framework is designed for autonomy. Intervene only when the agent explicitly escalates (epistemic conflict, resource absence, irreversible jeopardy, or research saturation).

- **End with a Retro:** Regularly using `playbooks/retro.md` or `/retro` command is key to creating a learning agent and keeping the Doctrine evergreen.

- **Use Smart Operations:** Leverage slash commands (`/fix`, `/refactor`, `/review`) and intent detection for common tasks.

- **Verify Standards:** Ensure all work complies with project standards (`docs/standards.md`). Pre-flight checks enforce compliance automatically.

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/testing.md` | Test scenarios and evaluation criteria for the framework |
| `ATTRIBUTION.md` | Credits, sync status, and license information |
| `doctrine/operational-doctrine.md` | Complete operational doctrine with all protocols |
| `enhancements/smart-operations.md` | Smart Operations complete reference |

---

## Quick Start Guide

### For New CouchCMS Developers

**1. Enable CADS During Setup**

Via Web Wizard:
- Choose "Extended" setup
- In Step 4 (Advanced Options), enable "CADS Framework"
- Select components: Doctrine, Directives, Playbooks (recommended)

Via CLI:
```bash
# When prompted about framework:
Enable CADS framework? (y/N): y
```

**2. Your First CADS Task**

Try a simple request:
```
"Create a contact page with a form"
```

Watch CADS:
- Investigate your project structure
- Check existing form patterns
- Create DataBound Form following CouchCMS conventions
- Add proper security (CSRF, validation)
- Use daisyUI components with semantic colors

**3. Common CouchCMS Tasks**

**Template Creation:**
```
"Create a product detail page template"
```

**Form Handling:**
```
"Add a newsletter signup form"
```

**Content Organization:**
```
"Create an archive page for blog posts by year"
```

**Search:**
```
"Add search to the site header"
```

### For Experienced CouchCMS Developers

**Quick Mode:**
```
/quick
"Fix the pagination bug in blog.php"
```
→ Minimal output, maximum efficiency

**Slash Commands:**
```
/fix snippets/forms/contact.html
/refactor templates/blog.php
/review snippets/components/card.html
```

**Intent Detection:**
Just describe what you need:
```
"Add user authentication to the admin section"
```
→ CADS automatically:
- Selects `@users` and `@couchcms` agents
- Loads authentication module knowledge
- Plans proper access control implementation

### Real-World CouchCMS Example

**Task:** "Create a blog with categories, tags, and author pages"

**CADS Execution:**

1. **Reconnaissance Phase:**
   - Analyzes existing templates
   - Checks for category/tag patterns
   - Reviews user module for author info

2. **Planning Phase:**
   - Plans blog listing template
   - Designs category archive pages
   - Structures tag pages
   - Plans author profile pages

3. **Execution Phase:**
   - Creates `blog.php` template with `<cms:pages>`
   - Implements category filtering
   - Adds tag relationships
   - Creates author archive using relationships
   - Uses proper CouchCMS patterns throughout

4. **Verification Phase:**
   - Tests all templates
   - Verifies relationships work correctly
   - Checks pagination
   - Validates security

5. **Report:**
   - Lists all created files
   - Explains CouchCMS patterns used
   - Shows relationships configured
   - Provides next steps

---

## Related Documentation

**Toolkit Documentation:**
- `docs/GETTING-STARTED.md` - Toolkit setup guide
- `docs/MODULES.md` - Available knowledge modules
- `docs/AGENTS.md` - Specialized AI agents
- `docs/COMMANDS.md` - Available commands

**Toolkit Resources:**
- `agents/` - Specialized AI agents for different tasks
- `modules/` - Knowledge modules for frameworks and patterns
- `prompts/` - Reusable prompts and workflows
- `preflight-checks.yaml` - Pre-flight check definitions
- `smart-defaults.yaml` - Context loading and intent patterns

**Framework Files:**
- `doctrine/operational-doctrine.md` - Core operational principles
- `playbooks/` - Structured workflows for different scenarios
- `directives/` - Communication guidelines
- `enhancements/` - Advanced productivity features

---

## Status

**Framework Status:** ✅ Fully Integrated

- ✅ Operational Doctrine updated and aligned with toolkit
- ✅ Playbooks refactored and comprehensive
- ✅ Smart Operations fully documented
- ✅ Directives integrated into all agent configs
- ✅ Testing guide available

**Last Updated:** 2025-01-26

---

**Welcome to a more disciplined, reliable, and truly autonomous way of working with AI.**
