# Claude Code Best Practices

**Source**: [Anthropic Engineering - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

This document integrates Claude Code best practices with our Universal AI Development Toolkit. These practices complement our existing `docs/standards.md` and specialized workflows.

## 1. Customize Your Setup

### a. Use `CLAUDE.md` Files

`CLAUDE.md` is automatically pulled into context when starting a Claude Code conversation. This integrates perfectly with our `docs/standards.md` system.

**Best Practice**: Reference our standards in `CLAUDE.md`:

```markdown
# Project Standards

- All standards are defined in `docs/standards.md` (single source of truth)
- Run `bun run sync` after updating standards to sync all AI agents
- Always follow English-only requirement for code and content

# Bash Commands

- `bun run dev`: Start development server
- `bun run build`: Production build
- `bun run sync`: Sync AI agent configurations
- `bun run validate`: Validate code compliance

# Code Style (from docs/standards.md)

- 4-space indentation everywhere
- kebab-case for files (HTML, CSS, TS)
- camelCase for TypeScript variables
- snake_case for PHP variables
- English-only for all code and content

# Technology Hierarchy

1. CouchCMS (content management)
2. TailwindCSS + daisyUI (styling)
3. Alpine.js (interactions)
4. TypeScript (complex logic)

# Workflow

- Always reference `docs/standards.md` before generating code
- Use specialized agents from `ai-toolkit/agents/daily/` for quick problems
- Use specialists from `ai-toolkit/agents/specialists/` for complex architecture
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

**Recommended for our project**:

- `Edit` - Always allow file edits
- `Bash(git commit:*)` - Allow git commits
- Domain allowlists for documentation sites

### d. Install GitHub CLI (`gh`)

Claude can use `gh` CLI for GitHub interactions:

- Creating issues and pull requests
- Reading comments
- Managing PRs

Without `gh`, Claude can still use GitHub API or MCP servers.

## 2. Give Claude More Tools

### a. Use Claude with Bash Tools

Claude inherits your bash environment. Document custom tools in `CLAUDE.md`:

```markdown
# Custom Tools

- `ddev exec bun run dev`: Start DDEV development server
- `ddev exec bun run build`: Production build in DDEV
```

### b. Use Claude with MCP

Claude Code functions as both MCP server and client. Configure MCP servers:

- **Project config**: Available when running Claude Code in that directory
- **Global config**: Available in all projects
- **`.mcp.json` file**: Checked into git, available to all team members

**Example**: Add Puppeteer and Sentry servers to `.mcp.json` for team-wide access.

### c. Use Custom Slash Commands

Store prompt templates in `.claude/commands/` folder. These become available via `/` menu.

**Example**: `.claude/commands/fix-standards-violation.md`

```markdown
Please fix standards violations in: $ARGUMENTS

Follow these steps:

1. Read `docs/standards.md` to understand project standards
2. Identify violations in the specified file(s)
3. Fix naming conventions (kebab-case files, camelCase variables)
4. Ensure 4-space indentation
5. Verify English-only code and content
6. Run `bun run validate` to check compliance
7. Commit with descriptive message
```

Use `$ARGUMENTS` to pass parameters from command invocation.

## 3. Common Workflows

### a. Explore, Plan, Code, Commit

**Versatile workflow for many problems**:

1. **Ask Claude to read relevant files** - Explicitly tell it NOT to write code yet
    - Use subagents for complex problems: "Use subagents to verify details"
    - Helps preserve context without losing efficiency

2. **Ask Claude to make a plan** - Use thinking triggers:
    - "think" - Extended thinking mode
    - "think hard" - More computation time
    - "think harder" - Even more budget
    - "ultrathink" - Maximum thinking budget

    **Best Practice**: Have Claude create a document or GitHub issue with the plan so you can reset if implementation isn't right.

3. **Ask Claude to implement** - Explicitly verify reasonableness as it implements

4. **Ask Claude to commit and create PR** - Update READMEs/changelogs if relevant

**Key**: Steps #1-#2 are crucial. Without them, Claude jumps straight to coding, which often misses deeper thinking requirements.

### b. Write Tests, Commit; Code, Iterate, Commit

**Test-Driven Development (TDD) workflow**:

1. **Ask Claude to write tests** based on expected input/output pairs
    - Be explicit: "We're doing TDD, don't create mock implementations"

2. **Tell Claude to run tests and confirm they fail**
    - Explicitly: "Don't write implementation code yet"

3. **Ask Claude to commit the tests** when satisfied

4. **Ask Claude to write code that passes tests**
    - Instruct: "Don't modify the tests"
    - Keep iterating until all tests pass
    - Use independent subagents to verify implementation isn't overfitting

5. **Ask Claude to commit the code** when satisfied

**Why this works**: Claude performs best with clear targets (tests, visual mocks, expected outputs).

### c. Write Code, Screenshot Result, Iterate

**Visual iteration workflow**:

1. **Give Claude screenshot capability** (Puppeteer MCP, iOS simulator, or manual paste)

2. **Provide visual mock** (copy/paste, drag-drop, or file path)

3. **Ask Claude to implement** - Take screenshots and iterate until match

4. **Ask Claude to commit** when satisfied

**Pro tip**: First version might be good, but 2-3 iterations typically look much better.

### d. Safe YOLO Mode

Use `claude --dangerously-skip-permissions` for:

- Fixing lint errors
- Generating boilerplate code
- Non-critical automated tasks

**⚠️ WARNING**: Use in container without internet access to minimize risks.

### e. Codebase Q&A

**Onboarding workflow** - Ask Claude questions like you would ask a colleague:

- "How does logging work?"
- "How do I make a new API endpoint?"
- "What does `async move { ... }` do on line 134 of `foo.rs`?"
- "What edge cases does `CustomerOnboardingFlowImpl` handle?"

No special prompting required! Just ask questions, Claude explores code to find answers.

### f. Use Claude to Interact with Git

Claude handles many git operations effectively:

- **Search git history**: "What changes made it into v1.2.3?"
- **Write commit messages**: Claude looks at changes and history automatically
- **Complex operations**: Reverting files, resolving rebase conflicts, comparing patches

**Best Practice**: Explicitly prompt Claude to look through git history for historical questions.

### g. Use Claude to Interact with GitHub

Claude Code manages GitHub interactions:

- **Creating pull requests**: Understands "pr" shorthand
- **One-shot resolutions**: "Fix comments on PR #123"
- **Fixing failing builds**: "Fix linter warnings in PR #456"
- **Issue triage**: "Categorize and triage open issues"

### h. Use Claude with Jupyter Notebooks

- Read and write `.ipynb` files
- Interpret outputs including images
- Clean up notebooks before sharing
- Make visualizations "aesthetically pleasing"

## 4. Optimize Your Workflow

### a. Be Specific in Instructions

**Poor**: "add tests for foo.py"

**Good**: "Write a new test case for foo.py, covering the edge case where the user is logged out. Avoid mocks."

**Better**: "Look at how existing widgets are implemented on the home page. HotDogWidget.php is a good example. Follow the pattern to implement a new calendar widget that lets the user select a month and paginate forwards/backwards to pick a year. Build from scratch without libraries other than the ones already used in the rest of the codebase."

### b. Give Claude Images

Claude excels with images and diagrams:

- **Paste screenshots**: `cmd+ctrl+shift+4` (macOS) to clipboard, `ctrl+v` to paste
- **Drag and drop** images directly
- **Provide file paths** for images

Particularly useful for:

- Design mocks as reference for UI development
- Visual charts for analysis and debugging

### c. Mention Files Explicitly

Use tab-completion to quickly reference files or folders. This helps Claude find the right resources.

### d. Give Claude URLs

Paste specific URLs for Claude to fetch and read. Use `/permissions` to add domains to allowlist (e.g., `docs.foo.com`).

### e. Course Correct Early and Often

**Four tools for course correction**:

1. **Ask Claude to make a plan** before coding - Don't code until plan is confirmed
2. **Press Escape to interrupt** - Preserves context, redirect or expand instructions
3. **Double-tap Escape** - Jump back in history, edit previous prompt, explore different direction
4. **Ask Claude to undo changes** - Often with option #2 to take different approach

**Best Practice**: While Claude sometimes solves perfectly on first attempt, using correction tools generally produces better solutions faster.

### f. Use `/clear` to Keep Context Focused

During long sessions, context can fill with irrelevant content. Use `/clear` frequently between tasks to reset context window.

### g. Use Checklists and Scratchpads

For large tasks with multiple steps:

1. **Tell Claude to create a Markdown checklist** (or GitHub issue)
2. **Instruct Claude to address each item one by one**
3. **Fix and verify before checking off**

**Example**: Fixing lint errors:

- Run lint command
- Write all errors to Markdown checklist
- Address each issue one by one
- Verify before moving to next

### h. Pass Data into Claude

**Multiple methods**:

- **Copy and paste** directly (most common)
- **Pipe into Claude Code**: `cat foo.txt | claude` (useful for logs, CSVs, large data)
- **Tell Claude to pull data** via bash commands, MCP tools, or custom slash commands
- **Ask Claude to read files** or fetch URLs (works for images too)

## 5. Use Headless Mode for Automation

Claude Code includes headless mode for non-interactive contexts:

```bash
claude -p "your prompt" --output-format stream-json
```

**Use cases**:

- CI/CD pipelines
- Pre-commit hooks
- Build scripts
- Automation workflows

### a. Issue Triage

Headless mode can power automations triggered by GitHub events. Example: Inspect new issues and assign appropriate labels.

### b. Claude as a Linter

Claude Code provides subjective code reviews beyond traditional linting:

- Typos
- Stale comments
- Misleading function/variable names
- Code quality issues

## 6. Multi-Claude Workflows

### a. One Claude Writes; Another Verifies

**Simple but effective approach**:

1. Use Claude to write code
2. Run `/clear` or start second Claude in another terminal
3. Have second Claude review first Claude's work
4. Start another Claude (or `/clear` again) to read code and review feedback
5. Have this Claude edit code based on feedback

**Similar with tests**: One Claude writes tests, another writes code to make tests pass.

**Why this works**: Separation often yields better results than single Claude handling everything.

### b. Multiple Checkouts

**Parallel workflow**:

1. Create 3-4 git checkouts in separate folders
2. Open each folder in separate terminal tabs
3. Start Claude in each folder with different tasks
4. Cycle through to check progress and approve/deny permissions

### c. Use Git Worktrees

**Lighter-weight alternative to multiple checkouts**:

```bash
# Create worktrees
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b

# Launch Claude in each worktree
cd ../project-feature-a && claude
cd ../project-feature-b && claude
```

**Benefits**:

- Multiple branches in separate directories
- Shared Git history and reflog
- Isolated working directories
- No merge conflicts for independent tasks

**Tips**:

- Use consistent naming conventions
- Maintain one terminal tab per worktree
- Use separate IDE windows for different worktrees
- Clean up when finished: `git worktree remove ../project-feature-a`

### d. Headless Mode with Custom Harness

**Two primary patterns**:

**1. Fanning out** (large migrations/analyses):

```bash
# Generate task list
claude -p "Generate list of files that need migration from A to B"

# Loop through tasks
for task in tasks; do
    claude -p "Migrate $task. Return OK if succeeded, FAIL if failed." \
        --allowedTools Edit Bash(git commit:*)
done
```

**2. Pipelining** (integrate into existing pipelines):

```bash
claude -p "<your prompt>" --json | your_command
```

Use `--verbose` flag for debugging, turn off in production.

## Integration with Our Toolkit

### How This Complements `docs/standards.md`

- **`docs/standards.md`**: Defines WHAT to code (standards, patterns, conventions)
- **This document**: Defines HOW to use Claude Code effectively (workflows, techniques)

### How This Complements Specialized Agents

- **Daily agents** (`ai-toolkit/agents/daily/`): Quick, linkable tools for specific problems
- **This document**: General Claude Code usage patterns that apply across all agents

### Recommended Workflow Integration

1. **Start with `docs/standards.md`** - Understand project requirements
2. **Use specialized agents** - For specific technology problems
3. **Apply Claude Code best practices** - For effective AI interaction
4. **Iterate and refine** - Use course correction tools as needed

## Quick Reference

```bash
# Customize setup
# Edit CLAUDE.md in project root or ~/.claude/CLAUDE.md

# Manage permissions
/permissions

# Clear context
/clear

# Headless mode
claude -p "your prompt" --output-format stream-json

# Safe YOLO mode (use in container!)
claude --dangerously-skip-permissions

# Git worktrees for parallel work
git worktree add ../project-feature-a feature-a
cd ../project-feature-a && claude
```

---

**Remember**: These are starting points. Experiment and find what works best for your workflow. The key is combining our project standards (`docs/standards.md`) with effective Claude Code usage patterns.
