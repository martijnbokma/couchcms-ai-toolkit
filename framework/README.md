# The Autonomous Agent Prompting Framework (AAPF)

A disciplined, evidence-first prompting framework designed to elevate AI agents from simple command executors to **Autonomous Principal Engineers**.

**Philosophy:** Autonomy through discipline. Trust through verification.

This framework is not just a collection of prompts; it is a complete operational system for managing AI agents. It enforces a rigorous workflow of reconnaissance, planning, safe execution, and self-improvement, ensuring every action the agent takes is deliberate, verifiable, and aligned with senior engineering best practices.

**Integration:** This framework is fully integrated with the CouchCMS AI Toolkit, providing enhanced productivity through Smart Operations, automatic context loading, and comprehensive quality assurance.

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

## How to Use This Framework

### Typical Session Workflow

1. **Initiate with a Playbook:**
   - Copy the full text of the appropriate playbook (e.g., `playbooks/request.md`)
   - Replace the placeholder line at the top with your specific, high-level goal
   - **(Optional)** If you need specific behavior, append directive content to the end
   - Paste the entire combined text into the chat

2. **Observe Disciplined Execution:**
   - The agent will announce its operational phase (Reconnaissance, Planning, etc.)
   - It will perform non-destructive research first, presenting a digest of findings (≤ 200 lines)
   - It will execute its plan incrementally, providing verifiable evidence
   - It will run quality gates autonomously and fix any failures
   - It will conclude with a mandatory zero-trust self-audit

3. **Review the Final Report:**
   - The agent provides a structured final report with status markers
   - All evidence is transparently available in the chat log
   - Workspace is left clean (no unsolicited files)

4. **Close the Loop with a Retro:**
   - Once satisfied, use `playbooks/retro.md` or run `/retro` command
   - The agent will analyze the session and propose updates to doctrine/standards
   - Durable lessons are integrated into the framework

### Integration with CouchCMS AI Toolkit

The framework is automatically integrated when enabled in your project configuration:

**Configuration Options:**

```yaml
# In standards.md or project.md

# Minimal: Only doctrine + directives (always active)
framework:
  doctrine: true
  directives: true

# Standard: Include playbooks
framework:
  doctrine: true
  directives: true
  playbooks: true

# Full: Everything including enhancements
framework: true  # or
framework:
  doctrine: true
  directives: true
  playbooks: true
  enhancements: true
```

**Automatic Integration:**

When enabled, the framework is automatically integrated into all AI configurations via the sync script:

- `.cursorrules` - Cursor AI configuration
- `CLAUDE.md` - Claude AI configuration
- `.github/copilot-instructions.md` - GitHub Copilot configuration
- `.codewhisperer/rules.md` - CodeWhisperer configuration
- `.tabnine/guidelines/` - Tabnine configuration
- `.windsurf/rules.md` - Windsurf configuration

**Sync Command:**
```bash
bun scripts/sync.js
```

This ensures all AI agents have consistent access to the framework.

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

## Quick Start

### For New Users

1. **Enable Framework:**
   ```yaml
   # In your standards.md or project.md
   framework: true
   ```

2. **Sync Configurations:**
   ```bash
   bun scripts/sync.js
   ```

3. **Start with a Playbook:**
   - Feature request? Use `playbooks/request.md`
   - Bug fix? Use `playbooks/refresh.md`
   - Session reflection? Use `playbooks/retro.md`

4. **Use Smart Operations:**
   - Try `/fix @file` for quick fixes
   - Use `/quick` mode for experienced users
   - Use `/verbose` mode for learning

### For Experienced Users

- **Quick Mode:** Enable with `/quick` for minimal output
- **Slash Commands:** Use `/fix`, `/refactor`, `/review` for instant actions
- **Intent Detection:** Natural language automatically triggers appropriate actions
- **Pre-Flight Checks:** Automatic quality scanning before code changes

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
