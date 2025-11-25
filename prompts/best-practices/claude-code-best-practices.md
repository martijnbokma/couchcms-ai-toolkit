# Claude Code Best Practices

**Source**: [Anthropic Engineering - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

**Critical: Always follow project standards (standards.md) before generating any code.**

This document provides best practices for using Claude Code effectively in any project.

---

## 1. Customize Your Setup

### a. Use `CLAUDE.md` Files

`CLAUDE.md` is automatically pulled into context when starting a Claude Code conversation. Use it to reference your project's `standards.md`.

**Best Practice**: Reference your standards in `CLAUDE.md`:

```markdown
# Project Standards

- All standards are defined in `standards.md` (single source of truth)
- Run `[your-sync-command]` after updating standards to sync configurations
- Follow language requirements from standards.md

# Commands

- `[dev-command]`: Start development server
- `[build-command]`: Production build
- `[sync-command]`: Sync configurations
- `[validate-command]`: Validate code compliance

# Code Style (from standards.md)

- Follow indentation from standards.md
- Follow naming conventions from standards.md
- Follow file naming from standards.md

# Workflow

- Always reference `standards.md` before generating code
- Use specialized agents for specific problems
- Follow technology hierarchy from standards.md
```

**File Locations**:

- **Root**: `CLAUDE.md` (checked into git, shared with team)
- **Local**: `CLAUDE.local.md` (`.gitignore` for personal preferences)
- **Home**: `~/.claude/CLAUDE.md` (applies to all sessions)

### b. Tune Your `CLAUDE.md` Files

- Use `#` key to automatically incorporate instructions into `CLAUDE.md`
- Iterate and refine like any prompt
- Add emphasis with "IMPORTANT" or "YOU MUST" for critical rules
- Document frequently used commands and patterns

### c. Curate Claude's Tool Allowlist

**Four ways to manage permissions**:

1. **Select "Always allow"** when prompted
2. **Use `/permissions` command** to manage allowlist
3. **Manually edit** `.claude/settings.json` (check into git for team sharing)
4. **Use `--allowedTools` CLI flag** for session-specific permissions

### d. Install GitHub CLI (`gh`)

Claude can use `gh` CLI for GitHub interactions:

- Creating issues and pull requests
- Reading comments
- Managing PRs

---

## 2. Give Claude More Tools

### a. Use Claude with Bash Tools

Claude inherits your bash environment. Document custom tools in `CLAUDE.md`:

```markdown
# Custom Tools

- `[your-dev-command]`: Start development server
- `[your-build-command]`: Production build
```

### b. Use Claude with MCP

Configure MCP servers:

- **Project config**: Available when running Claude Code in that directory
- **Global config**: Available in all projects
- **`.mcp.json` file**: Checked into git, available to all team members

### c. Use Custom Slash Commands

Store prompt templates in `.claude/commands/` folder. These become available via `/` menu.

**Example**: `.claude/commands/fix-standards-violation.md`

```markdown
Please fix standards violations in: $ARGUMENTS

Follow these steps:

1. Read `standards.md` to understand project standards
2. Identify violations in the specified file(s)
3. Fix naming conventions per standards.md
4. Ensure correct indentation per standards.md
5. Verify language requirements per standards.md
6. Run validation command to check compliance
7. Commit with descriptive message
```

---

## 3. Common Workflows

### a. Explore, Plan, Code, Commit

1. **Ask Claude to read relevant files** - Explicitly tell it NOT to write code yet
2. **Ask Claude to make a plan** - Use thinking triggers ("think", "think hard", "ultrathink")
3. **Ask Claude to implement** - Verify reasonableness as it implements
4. **Ask Claude to commit and create PR** - Update docs if relevant

### b. Write Tests, Commit; Code, Iterate, Commit

**Test-Driven Development workflow**:

1. Ask Claude to write tests based on expected input/output
2. Tell Claude to run tests and confirm they fail
3. Ask Claude to commit the tests
4. Ask Claude to write code that passes tests
5. Ask Claude to commit the code

### c. Write Code, Screenshot Result, Iterate

**Visual iteration workflow**:

1. Give Claude screenshot capability
2. Provide visual mock
3. Ask Claude to implement - iterate until match
4. Ask Claude to commit

### d. Codebase Q&A

Ask Claude questions like:

- "How does logging work?"
- "How do I make a new API endpoint?"
- "What edge cases does this component handle?"

### e. Use Claude to Interact with Git

- Search git history
- Write commit messages
- Revert files, resolve conflicts

### f. Use Claude to Interact with GitHub

- Create pull requests
- Fix comments on PRs
- Fix failing builds
- Triage issues

---

## 4. Optimize Your Workflow

### a. Be Specific in Instructions

**Poor**: "add tests"
**Good**: "Write a new test case covering the edge case where the user is logged out. Avoid mocks."
**Better**: "Look at how existing components are implemented. Follow the pattern to implement a new calendar widget. Build from scratch without additional libraries."

### b. Give Claude Images

- Paste screenshots
- Drag and drop images
- Provide file paths for images

### c. Mention Files Explicitly

Use tab-completion to reference files or folders.

### d. Give Claude URLs

Paste specific URLs for Claude to fetch and read.

### e. Course Correct Early and Often

- Ask Claude to make a plan before coding
- Press Escape to interrupt
- Double-tap Escape to go back in history
- Ask Claude to undo changes

### f. Use `/clear` to Keep Context Focused

Clear context between tasks.

### g. Use Checklists and Scratchpads

For large tasks with multiple steps, use Markdown checklists.

---

## 5. Use Headless Mode for Automation

```bash
claude -p "your prompt" --output-format stream-json
```

**Use cases**:

- CI/CD pipelines
- Pre-commit hooks
- Build scripts
- Automation workflows

---

## 6. Multi-Claude Workflows

### a. One Claude Writes; Another Verifies

1. Use Claude to write code
2. Run `/clear` or start second Claude
3. Have second Claude review first Claude's work

### b. Multiple Checkouts

Create multiple git checkouts, start Claude in each with different tasks.

### c. Use Git Worktrees

```bash
git worktree add ../project-feature-a feature-a
cd ../project-feature-a && claude
```

---

## Integration with Project Standards

### How This Complements `standards.md`

- **`standards.md`**: Defines WHAT to code (standards, patterns, conventions)
- **This document**: Defines HOW to use Claude Code effectively (workflows, techniques)

### Recommended Workflow

1. **Start with `standards.md`** - Understand project requirements
2. **Use specialized agents** - For specific technology problems
3. **Apply Claude Code best practices** - For effective AI interaction
4. **Iterate and refine** - Use course correction tools as needed

---

## Quick Reference

```bash
# Manage permissions
/permissions

# Clear context
/clear

# Headless mode
claude -p "your prompt" --output-format stream-json

# Git worktrees for parallel work
git worktree add ../project-feature-a feature-a
cd ../project-feature-a && claude
```

---

**Remember**: These are starting points. Experiment and find what works best for your workflow. The key is combining your project standards (`standards.md`) with effective Claude Code usage patterns.
