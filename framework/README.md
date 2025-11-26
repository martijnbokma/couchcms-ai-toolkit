# The Autonomous Agent Prompting Framework (AAPF)

A disciplined, evidence-first prompting framework designed to elevate AI agents from simple command executors to **Autonomous Principal Engineers**.

**Philosophy:** Autonomy through discipline. Trust through verification.

This framework is not just a collection of prompts; it is a complete operational system for managing AI agents. It enforces a rigorous workflow of reconnaissance, planning, safe execution, and self-improvement, ensuring every action the agent takes is deliberate, verifiable, and aligned with senior engineering best practices.

---

## Framework Structure

The framework is organized into four main categories:

### 1. Doctrine (Always Active)

The core operational principles that govern all agent behavior.

| File | Purpose |
|------|---------|
| `doctrine/operational-doctrine.md` | Core prompting principles - the "constitution" that defines agent identity, research protocols, safety guardrails, and professional standards |

**Installation:** This is the first and most critical step. The doctrine should be installed as the agent's primary system instruction set.

### 2. Playbooks (Optional - Use When Needed)

Structured "mission briefing" templates for specific workflows. Paste into chat to initiate a task.

| File | Purpose | When to Use |
|------|---------|-------------|
| `playbooks/request.md` | Standard Operating Procedure for Constructive Work | Building new features, refactoring code, or making any planned change |
| `playbooks/refresh.md` | Root Cause Analysis & Remediation Protocol | When a bug is persistent and previous, simpler attempts have failed |
| `playbooks/retro.md` | Metacognitive Self-Improvement Loop | At the end of a session to capture learnings and improve the doctrine |

**Status Markers:** The agent uses these markers in reports:
- `✅`: Objective completed successfully
- `⚠️`: A recoverable issue was encountered and fixed autonomously
- `🚧`: Blocked; awaiting input or a resource

### 3. Directives (Always Active)

Communication guidelines that modify agent behavior for professional, concise interaction.

| File | Purpose |
|------|---------|
| `directives/concise.md` | Mandates radically concise, information-dense communication, removing all conversational filler |
| `directives/communication.md` | Avoids sycophantic language and maintains professional, technical communication |

### 4. Enhancements (Optional - Advanced Features)

Advanced productivity features for experienced users.

| File | Purpose |
|------|---------|
| `enhancements/smart-operations.md` | Slash commands, intent detection, pre-flight checks, and communication modes |

**Smart Operations Features:**
- **Quick Actions**: `/fix @file`, `/refactor @file`, `/review @file`, `/component <name>`, `/view <name>`, `/form <name>`
- **Workflow Commands**: `/sync`, `/validate`, `/status`
- **Communication Modes**: `/quick`, `/verbose`, `/standard`
- **Pre-Flight Checks**: Automatic code quality scanning before modifications
- **Smart Context**: Auto-load relevant agents/modules based on file type

---

## Core Philosophy

This framework is built on five foundational principles:

1. **Research-First, Always:** The agent must never act on assumption. Every action is preceded by a thorough investigation of the current system state.
2. **Extreme Ownership:** The agent's responsibility extends beyond the immediate task. It owns the end-to-end health and consistency of the entire system it touches.
3. **Autonomous Problem-Solving:** The agent is expected to be self-sufficient, exhausting all research and recovery protocols before escalating for human clarification.
4. **Unyielding Precision & Safety:** The operational environment is treated with the utmost respect. Every command is executed safely, and the workspace is kept pristine.
5. **Metacognitive Self-Improvement:** The agent is designed to learn. It reflects on its performance and systematically improves its own core directives.

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
   - It will perform non-destructive research first, presenting a digest of findings
   - It will execute its plan, providing verifiable evidence and running tests autonomously
   - It will conclude with a mandatory self-audit to prove correctness

3. **Review the Final Report:**
   - The agent provides a final summary with status markers
   - All evidence is transparently available in the chat log
   - Workspace is left clean

4. **Close the Loop with a Retro:**
   - Once satisfied, paste the contents of `playbooks/retro.md` into the chat
   - The agent will analyze the session and propose updates to its Doctrine if durable lessons were learned

### Integration with CouchCMS AI Toolkit

The framework can be enabled in your `standards.md` (or `.project/standards.md`):

```yaml
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

When enabled, the framework is automatically integrated into all AI configurations (`.cursorrules`, `CLAUDE.md`, etc.) via the sync script.

---

## Guiding Principles

- **Be Specific:** In your initial request, clearly state *what* you want and *why* it's important
- **Trust the Process:** The framework is designed for autonomy. Intervene only when the agent explicitly escalates
- **End with a Retro:** Regularly using `playbooks/retro.md` is key to creating a learning agent and keeping the Doctrine evergreen

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/testing.md` | Test scenarios and evaluation criteria for the framework |
| `ATTRIBUTION.md` | Credits, sync status, and license information |

---

## Related Documentation

- `docs/GETTING-STARTED.md` - Toolkit setup guide
- `docs/MODULES.md` - Available knowledge modules
- `agents/` - Specialized AI agents
- `modules/` - Knowledge modules
- `prompts/` - Reusable prompts and workflows

---

**Welcome to a more disciplined, reliable, and truly autonomous way of working with AI.**
