# The Autonomous Agent Prompting Framework

This repository contains a disciplined, evidence-first prompting framework designed to elevate an Agentic AI from a simple command executor to an **Autonomous Principal Engineer.**

The philosophy is simple: **Autonomy through discipline. Trust through verification.**

This framework is not just a collection of prompts; it is a complete operational system for managing AI agents. It enforces a rigorous workflow of reconnaissance, planning, safe execution, and self-improvement, ensuring every action the agent takes is deliberate, verifiable, and aligned with senior engineering best practices.

_**I also have Claude Code prompting for your reference:**_
https://gist.github.com/aashari/1c38e8c7766b5ba81c3a0d4d124a2f58

---

## Core Philosophy

This framework is built on five foundational principles that the AI agent is expected to embody:

1.  **Research-First, Always:** The agent must never act on assumption. Every action is preceded by a thorough investigation of the current system state.
2.  **Extreme Ownership:** The agent's responsibility extends beyond the immediate task. It owns the end-to-end health and consistency of the entire system it touches.
3.  **Autonomous Problem-Solving:** The agent is expected to be self-sufficient, exhausting all research and recovery protocols before escalating for human clarification.
4.  **Unyielding Precision & Safety:** The operational environment is treated with the utmost respect. Every command is executed safely, and the workspace is kept pristine.
5.  **Metacognitive Self-Improvement:** The agent is designed to learn. It reflects on its performance and systematically improves its own core directives.

## Framework Components

The framework consists of three main parts: the **Doctrine**, the **Playbooks**, and optional **Directives**.

### 1. The Operational Doctrine (`core.md`)

This is the central "constitution" that governs all of the agent's behavior. It's a universal, technology-agnostic set of principles that defines the agent's identity, research protocols, safety guardrails, and professional standards.

**Installation is the first and most critical step.** You must install the `core.md` content as the agent's primary system instruction set.

-   **For Global Use (Recommended):** Install `core.md` as a global or user-level rule in your AI environment. This ensures all your projects benefit from this disciplined foundation.
-   **For Project-Specific Use:** If a project requires a unique doctrine, you can place the content in a project-specific rule file (e.g., a `.cursor/rules/` directory or a root-level `AGENT.md`). This will override the global setting.

> **Note:** Treat the Doctrine like infrastructure-as-code. When updating, replace the entire file to prevent configuration drift.

### 2. The Operational Playbooks

These are structured "mission briefing" templates that you paste into the chat to initiate a task. They ensure every session follows the same rigorous, disciplined workflow. The agent uses the following status markers in its reports:
-   `✅`: Objective completed successfully.
-   `⚠️`: A recoverable issue was encountered and fixed autonomously.
-   `🚧`: Blocked; awaiting input or a resource.

| Playbook         | Purpose                                          | When to Use                                                                 |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| **`request.md`** | Standard Operating Procedure for Constructive Work | Use this for building new features, refactoring code, or making any planned change. |
| **`refresh.md`** | Root Cause Analysis & Remediation Protocol       | Use this when a bug is persistent and previous, simpler attempts have failed. |
| **`retro.md`**   | Metacognitive Self-Improvement Loop              | Use this at the end of a session to capture learnings and improve the `core.md`. |

### 3. Optional Directives (Stackable)

These are smaller, single-purpose rule files that can be appended to a playbook prompt to modify the agent's behavior for a specific task.

| Directive          | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| **`05-concise.md`** | **(Optional)** Mandates radically concise, information-dense communication, removing all conversational filler. |

To use an optional directive, simply append its full content to the bottom of a playbook prompt before pasting it into the chat.

## How to Use This Framework: A Typical Session

Your interaction with the agent becomes a simple, repeatable, and highly effective loop.

1.  **Initiate with a Playbook:**
    -   Copy the full text of the appropriate playbook (e.g., `request.md`).
    -   Replace the single placeholder line at the top with your specific, high-level goal.
    -   **(Optional)** If you need a specific behavior, like conciseness, append the content of `05-concise.md` to the end of the prompt.
    -   Paste the entire combined text into the chat.

2.  **Observe Disciplined Execution:**
    -   The agent will announce its operational phase (Reconnaissance, Planning, etc.).
    -   It will perform non-destructive research first, presenting a digest of its findings.
    -   It will execute its plan, providing verifiable evidence for its actions and running tests autonomously.
    -   It will conclude with a mandatory self-audit to prove its work is correct.

3.  **Review the Final Report:**
    -   The agent will provide a final summary with status markers. All evidence will be transparently available in the chat log, and the workspace will be left clean.

4.  **Close the Loop with a Retro:**
    -   Once satisfied, paste the contents of `retro.md` into the chat.
    -   The agent will analyze the session and, if a durable lesson was learned, it will propose an update to its own Doctrine.

By following this workflow, you are not just giving the agent tasks; you are actively participating in its training and evolution, ensuring it becomes progressively more aligned and effective over time.

---

## Guiding Principles
- **Be Specific:** In your initial request, clearly state *what* you want and *why* it's important.
- **Trust the Process:** The framework is designed for autonomy. Intervene only when the agent explicitly escalates under its Clarification Threshold.
- **End with a Retro:** Regularly using `retro.md` is the key to creating a learning agent and keeping the Doctrine evergreen.

**Welcome to a more disciplined, reliable, and truly autonomous way of working with AI.**