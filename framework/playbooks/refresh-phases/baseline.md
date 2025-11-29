# Phase 0: State Baseline

**Goal:** Establish evidence-based baseline of system state (read-only).

**Constraint:** NO mutations permitted during this phase.

---

## 1. Issue Context Analysis

**Understand the issue:**
- Review issue description and symptoms
- Identify affected components
- Map to system architecture
- Document related issues

**Output:**
```markdown
## Issue Context

**Symptoms:**
- {What is happening}
- {When it occurs}
- {How often}

**Affected Components:**
- {Component 1}
- {Component 2}

**Related Issues:**
- {Similar bug 1}
- {Similar bug 2}
```

---

## 2. Repository State

**Check recent changes:**

```bash
# Recent commits
git log --oneline -20

# Changes around issue appearance
git log --since="2 weeks ago" --oneline

# Files changed recently
git diff HEAD~10 --name-only
```

**Document:**
- Recent changes that might relate
- Files modified around issue appearance
- Uncommitted changes

---

## 3. Runtime Environment

**Check environment:**

```bash
# Environment info
node --version  # or relevant runtime
npm list        # or bun list

# Service status
{check running services}

# Resource utilization
{check memory, CPU if relevant}
```

**Document:**
- Environment configuration
- External dependencies
- Service health
- Resource issues

---

## 4. Configuration Analysis

**Review configurations:**

```bash
# Check config files
cat config/app.php
cat .env.example

# Check for recent config changes
git log --oneline -- config/
```

**Document:**
- Configuration anomalies
- Missing settings
- Recent config changes

---

## 5. Log Analysis

**Review logs:**

```bash
# Application logs
tail -n 100 logs/error.log

# System logs (if applicable)
{system log commands}

# Search for error patterns
grep -i "error" logs/error.log | tail -20
```

**Document:**
- Error patterns
- Timing patterns
- Correlation with events

---

## 6. Code Inspection

**Read relevant code (no changes):**

```bash
# Read affected files
cat path/to/affected/file.php

# Search for related code
grep -r "function_name" src/
```

**Document:**
- Potential problem areas
- Error handling issues
- Known anti-patterns

---

## 7. Smart Operations Context

**Check toolkit features:**
- Applicable slash commands: `/fix`, `/review`
- Relevant agents for debugging
- Pre-flight checks to apply
- Similar issues in history

---

## Output: State Baseline Digest

```markdown
## State Baseline (≤ 200 lines)

**Current System State:**
- {Key observations}
- {Patterns identified}

**Key Findings:**
- Finding 1: {description}
- Finding 2: {description}

**Hypotheses to Investigate:**
- Hypothesis 1: {theory}
- Hypothesis 2: {theory}

**Areas for Deeper Analysis:**
- Area 1: {why}
- Area 2: {why}

**Evidence Preserved:**
- Logs: {location}
- Error messages: {captured}
- Screenshots: {if applicable}
```

---

**Next:** Phase 1 - Isolate Anomaly
