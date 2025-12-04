# AI Coding Tools - Best Practices Guide

**Complete guide for maximizing productivity with Cursor, Claude, Code, Kiro, Windsurf, and other AI-powered development tools.**

---

## Table of Contents

- [Universal Best Practices](#universal-best-practices)
- [Tool-Specific Guides](#tool-specific-guides)
  - [Cursor](#cursor)
  - [Claude (Code)](#claude-code)
  - [Kiro](#kiro)
  - [Windsurf](#windsurf)
  - [GitHub Copilot](#github-copilot)
  - [Codeium](#codeium)
- [Staying Up-to-Date](#staying-up-to-date)
- [Workflow Optimization](#workflow-optimization)
- [Future-Proofing](#future-proofing)
- [Integration with CouchCMS AI Toolkit](#integration-with-couchcms-ai-toolkit)

---

## Universal Best Practices

### 1. **Single Source of Truth**

✅ **DO:**
- Use `.project/standards.md` as your single configuration file
- Let the toolkit generate all editor-specific configs automatically
- Edit only `standards.md`, never generated files directly

❌ **DON'T:**
- Manually edit `.cursorrules`, `CLAUDE.md`, or other generated files
- Duplicate configuration across multiple files
- Create tool-specific configs that conflict with toolkit standards

### 2. **Context is King**

✅ **DO:**
- Provide clear, specific prompts with context
- Reference relevant files using `@filename` syntax
- Include error messages, stack traces, and relevant code snippets
- Mention your project type and framework (CouchCMS, TailwindCSS, etc.)

❌ **DON'T:**
- Use vague requests like "fix this" or "improve code"
- Skip context about your project structure
- Assume the AI knows your coding standards

### 3. **Iterative Refinement**

✅ **DO:**
- Start with high-level requests, then refine
- Review AI suggestions before accepting
- Ask follow-up questions to clarify understanding
- Test changes before moving to the next task

❌ **DON'T:**
- Accept all suggestions blindly
- Skip testing after changes
- Move to new features without verifying current work

### 4. **Version Control Integration**

✅ **DO:**
- Commit generated configs (`.cursorrules`, `CLAUDE.md`, etc.)
- Use feature branches for AI-assisted development
- Review AI-generated code in PRs
- Keep commit messages descriptive

❌ **DON'T:**
- Ignore generated files in `.gitignore`
- Commit without reviewing AI changes
- Use AI to generate commit messages without review

### 5. **Security & Privacy**

✅ **DO:**
- Review AI suggestions for security vulnerabilities
- Never share sensitive credentials or API keys
- Use environment variables for secrets
- Validate AI-generated authentication code

❌ **DON'T:**
- Trust AI-generated security code without review
- Include secrets in prompts or code
- Skip security reviews for AI-generated code

---

## Tool-Specific Guides

### Cursor

**Best for:** Full IDE experience with AI chat, code completion, and refactoring

#### Setup

```bash
# 1. Ensure toolkit is configured
bun ai-toolkit-shared/scripts/cli/sync.js

# 2. Verify .cursorrules exists
ls -la .cursorrules

# 3. Check MDC rules are active
ls -la .cursor/rules/*.mdc
```

#### Key Features

1. **Chat Interface** (`Cmd+L` / `Ctrl+L`)
   - Use `@filename` to reference files
   - Use `@folder` to reference directories
   - Use `@codebase` for project-wide searches

2. **Composer** (`Cmd+I` / `Ctrl+I`)
   - Multi-file editing
   - Codebase-wide changes
   - Refactoring across files

3. **Inline Suggestions**
   - Tab to accept, Esc to dismiss
   - Review before accepting
   - Customize in Settings → Features → Inline Suggestions

4. **MDC Rules** (Auto-loading)
   - Context-aware rules based on file patterns
   - Automatically loaded when editing matching files
   - Defined in `.cursor/rules/*.mdc`

#### Best Practices

✅ **DO:**
- Use Composer for multi-file refactoring
- Leverage MDC rules for context-aware assistance
- Use chat for explanations and debugging
- Enable inline suggestions for faster coding

❌ **DON'T:**
- Accept all inline suggestions without review
- Ignore MDC rule conflicts
- Use chat for simple find/replace (use search instead)

#### Staying Updated

- Check Cursor Settings → About for version
- Enable auto-updates in Settings → General
- Follow [Cursor Blog](https://cursor.sh/blog) for new features
- Join [Cursor Discord](https://discord.gg/cursor) community

---

### Claude (Code)

**Best for:** Deep code analysis, documentation, and complex problem-solving

#### Setup

```bash
# 1. Sync toolkit configs
bun ai-toolkit-shared/scripts/cli/sync.js

# 2. Verify Claude files exist
ls -la CLAUDE.md
ls -la .claude/skills/
ls -la .claude/settings.json
```

#### Key Features

1. **Code Skills** (`.claude/skills/*.md`)
   - Modular knowledge units
   - Auto-activated based on context
   - Project-specific patterns

2. **Memory File** (`CLAUDE.md`)
   - Project context loaded at startup
   - Standards and conventions
   - Active modules and agents

3. **Settings** (`.claude/settings.json`)
   - Permissions and environment variables
   - Tool configuration
   - Model preferences

#### Best Practices

✅ **DO:**
- Use Code Skills for domain-specific knowledge
- Reference `CLAUDE.md` for project context
- Ask for explanations of complex code
- Request documentation generation

❌ **DON'T:**
- Edit `CLAUDE.md` manually (regenerate with sync)
- Skip Code Skills for specialized domains
- Use for simple syntax questions (use docs instead)

#### Staying Updated

- Check Claude Desktop app for updates
- Follow [Anthropic Blog](https://www.anthropic.com/news) for model updates
- Review [Claude Code Documentation](https://claude.ai/code)
- Monitor toolkit updates: `bun ai-toolkit-shared/scripts/cli/update.js`

---

### Kiro

**Best for:** Structured development workflows and project management

#### Setup

```bash
# 1. Ensure toolkit sync has run
bun ai-toolkit-shared/scripts/cli/sync.js

# 2. Check Kiro configs
ls -la .kiro/
```

#### Key Features

1. **Steering Files** (`.kiro/steering/`)
   - Project goals and constraints
   - Development guidelines
   - Quality standards

2. **Specs** (`.kiro/specs/`)
   - Feature specifications
   - Technical requirements
   - Architecture decisions

#### Best Practices

✅ **DO:**
- Maintain clear steering files
- Use specs for feature planning
- Keep project goals updated
- Document architectural decisions

❌ **DON'T:**
- Create conflicting steering files
- Skip specs for complex features
- Ignore project constraints

#### Staying Updated

- Check Kiro app for updates
- Review [Kiro Documentation](https://kiro.ai/docs)
- Monitor toolkit integration updates

---

### Windsurf

**Best for:** AI-powered code editing with multi-model support

#### Setup

```bash
# 1. Sync toolkit configs
bun ai-toolkit-shared/scripts/cli/sync.js

# 2. Verify Windsurf recognizes project
# Check Windsurf settings for project detection
```

#### Key Features

1. **Multi-Model Support**
   - Switch between AI models
   - Compare suggestions
   - Use best model for task

2. **Codebase Understanding**
   - Project-wide context
   - Pattern recognition
   - Refactoring suggestions

#### Best Practices

✅ **DO:**
- Use appropriate model for task type
- Leverage codebase understanding
- Compare model suggestions
- Use for large-scale refactoring

❌ **DON'T:**
- Use same model for all tasks
- Ignore codebase context
- Skip model comparison for critical changes

#### Staying Updated

- Check Windsurf Settings → About
- Follow [Windsurf Updates](https://windsurf.ai/updates)
- Monitor model availability changes

---

### GitHub Copilot

**Best for:** Inline code suggestions and pair programming

#### Setup

```bash
# 1. Install Copilot extension in your editor
# 2. Authenticate with GitHub account
# 3. Ensure project standards are clear
```

#### Key Features

1. **Inline Suggestions**
   - Tab to accept
   - Multiple suggestions
   - Context-aware completions

2. **Chat Interface**
   - Code explanations
   - Refactoring suggestions
   - Documentation generation

#### Best Practices

✅ **DO:**
- Review suggestions before accepting
- Use for boilerplate code
- Leverage for test generation
- Customize suggestions in settings

❌ **DON'T:**
- Accept all suggestions blindly
- Use for security-critical code without review
- Ignore project coding standards

#### Staying Updated

- Check extension updates in your editor
- Follow [GitHub Copilot Blog](https://github.blog/copilot)
- Review [Copilot Documentation](https://docs.github.com/copilot)
- Monitor [Copilot Changelog](https://github.com/features/copilot)

---

### Codeium

**Best for:** Free AI code completion with privacy focus

#### Setup

```bash
# 1. Install Codeium extension
# 2. Sign up for free account
# 3. Configure project settings
```

#### Best Practices

✅ **DO:**
- Use for code completion
- Leverage free tier features
- Review privacy settings
- Customize suggestion behavior

❌ **DON'T:**
- Skip privacy configuration
- Ignore suggestion quality
- Use without reviewing code

#### Staying Updated

- Check extension updates
- Follow [Codeium Blog](https://codeium.com/blog)
- Review [Codeium Documentation](https://codeium.com/docs)

---

## Staying Up-to-Date

### 1. **Toolkit Updates**

```bash
# Check for updates (interactive)
bun ai-toolkit-shared/scripts/cli/update.js

# Auto-apply updates
bun ai-toolkit-shared/scripts/cli/update.js --apply

# Check only (no prompt)
bun ai-toolkit-shared/scripts/cli/update.js --check
```

**Frequency:**
- **Weekly** for active development
- **Monthly** for stable projects
- **Before major features** when starting new work

### 2. **Tool Updates**

#### Automated Checks

Most tools auto-check for updates. Enable:
- **Cursor**: Settings → General → Auto-update
- **Claude**: Desktop app auto-updates
- **Windsurf**: Settings → Updates → Auto-update
- **GitHub Copilot**: Extension auto-updates

#### Manual Checks

- **Cursor**: Help → Check for Updates
- **Claude**: Desktop app → About → Check Updates
- **Windsurf**: Settings → About → Check Updates
- **Extensions**: Check in editor extension marketplace

### 3. **News & Announcements**

**Follow Official Channels:**

| Tool | Blog | Twitter/X | Discord | Newsletter |
|------|------|-----------|---------|------------|
| Cursor | [cursor.sh/blog](https://cursor.sh/blog) | [@cursor_ai](https://twitter.com/cursor_ai) | [Discord](https://discord.gg/cursor) | ✅ |
| Claude | [anthropic.com/news](https://www.anthropic.com/news) | [@AnthropicAI](https://twitter.com/AnthropicAI) | - | ✅ |
| Windsurf | [windsurf.ai/updates](https://windsurf.ai/updates) | [@windsurf_ai](https://twitter.com/windsurf_ai) | - | ✅ |
| Copilot | [github.blog/copilot](https://github.blog/copilot) | [@github](https://twitter.com/github) | - | ✅ |

### 4. **Community Resources**

- **Reddit**: r/cursor, r/claude, r/githubcopilot
- **Discord**: Tool-specific communities
- **YouTube**: Tutorial channels for each tool
- **GitHub**: Tool repositories and discussions

### 5. **Changelog Monitoring**

```bash
# Toolkit changelog
cat ai-toolkit-shared/CHANGELOG.md

# Check latest version
cat ai-toolkit-shared/package.json | grep version
```

---

## Workflow Optimization

### 1. **Tool Selection Matrix**

| Task | Best Tool | Why |
|------|-----------|-----|
| Quick code completion | Copilot/Codeium | Fast inline suggestions |
| Multi-file refactoring | Cursor Composer | Handles dependencies |
| Deep code analysis | Claude Code | Best reasoning |
| Project planning | Kiro | Structured workflows |
| Documentation | Claude Code | Excellent explanations |
| Debugging | Cursor Chat | Fast iteration |
| Architecture decisions | Claude Code | Deep understanding |

### 2. **Prompt Engineering**

#### Effective Prompts

✅ **Good:**
```
@films.php I need to add authentication to this template.
The project uses CouchCMS with the authenticated.html filter pattern.
Please add the filter embed and ensure it follows project standards.
```

❌ **Bad:**
```
fix this
```

#### Prompt Templates

**For New Features:**
```
@file1.php @file2.html I want to add [feature].
Requirements:
- Must use [pattern/framework]
- Should follow [standard]
- Needs to integrate with [existing code]
```

**For Bug Fixes:**
```
@file.php This code has a bug: [description].
Error message: [error]
Expected behavior: [what should happen]
Current behavior: [what actually happens]
```

**For Refactoring:**
```
@file.php Refactor this code to:
- Use [pattern/approach]
- Improve [specific aspect]
- Maintain [constraint]
```

### 3. **Context Management**

#### File References

- `@filename` - Reference specific file
- `@folder/` - Reference directory
- `@codebase` - Project-wide search (Cursor)

#### Context Windows

- **Cursor**: ~100k tokens
- **Claude**: ~200k tokens (depends on model)
- **Windsurf**: Model-dependent
- **Copilot**: Limited context

**Best Practice:** Reference specific files rather than relying on full codebase context.

### 4. **Iteration Strategy**

1. **Start Broad**: High-level request
2. **Refine**: Add specific requirements
3. **Review**: Check AI suggestions
4. **Test**: Verify changes work
5. **Iterate**: Refine based on results

### 5. **Quality Gates**

Before accepting AI suggestions:

- [ ] Code follows project standards
- [ ] No security vulnerabilities
- [ ] Tests pass (if applicable)
- [ ] No breaking changes
- [ ] Documentation updated (if needed)
- [ ] Code reviewed by human

---

## Future-Proofing

### 1. **Configuration Management**

✅ **DO:**
- Use toolkit's single source of truth (`.project/standards.md`)
- Version control all configs
- Document custom configurations
- Keep standards.md updated

❌ **DON'T:**
- Create tool-specific configs outside toolkit
- Hardcode tool settings
- Skip version control for configs

### 2. **Standards Evolution**

```bash
# Regular sync ensures latest standards
bun ai-toolkit-shared/scripts/cli/sync.js

# Validate compliance
bun ai-toolkit-shared/scripts/cli/validate.js
```

**Update Schedule:**
- After toolkit updates
- When adding new modules/agents
- When project standards change
- Before major releases

### 3. **Backward Compatibility**

- Keep old configs until migration complete
- Test new features in separate branch
- Document breaking changes
- Provide migration guides

### 4. **Tool Agnostic Approach**

✅ **DO:**
- Write prompts that work across tools
- Use standard file references
- Follow universal coding standards
- Keep tool-specific configs minimal

❌ **DON'T:**
- Rely on tool-specific features only
- Create tool-locked workflows
- Skip cross-tool compatibility

### 5. **Learning & Adaptation**

**Continuous Improvement:**

1. **Weekly Review**
   - What worked well?
   - What could be improved?
   - New features to try?

2. **Monthly Assessment**
   - Tool effectiveness
   - Workflow optimization
   - Standards updates needed

3. **Quarterly Evaluation**
   - Tool comparison
   - Feature adoption
   - Workflow refinement

---

## Integration with CouchCMS AI Toolkit

### 1. **Unified Configuration**

The toolkit provides a single source of truth for all AI tools:

```yaml
# .project/standards.md
---
name: my-project
toolkit: ./ai-toolkit-shared
modules:
  - couchcms-core
  - tailwindcss
  - alpinejs
agents:
  - couchcms
  - tailwindcss
  - alpinejs
---
```

### 2. **Auto-Generated Configs**

The toolkit generates:
- `.cursorrules` - Cursor configuration
- `CLAUDE.md` - Claude memory
- `.claude/skills/` - Claude Code skills
- `.claude/settings.json` - Claude settings
- `.cursor/rules/*.mdc` - Cursor MDC rules
- Other tool-specific configs

### 3. **Sync Workflow**

```bash
# 1. Edit standards.md
code .project/standards.md

# 2. Sync to all tools
bun ai-toolkit-shared/scripts/cli/sync.js

# 3. Reload editor/restart tool
# Configs are now updated
```

### 4. **Validation**

```bash
# Check compliance
bun ai-toolkit-shared/scripts/cli/validate.js

# Health check
bun ai-toolkit-shared/scripts/cli/health.js
```

### 5. **Module & Agent System**

The toolkit provides:
- **Modules**: Knowledge packages (CouchCMS, TailwindCSS, etc.)
- **Agents**: Specialized AI assistants
- **Auto-loading**: Context-aware rule activation

**Usage:**
```bash
# In chat/prompts, reference agents:
@couchcms help with template structure
@tailwindcss create a card component
@alpinejs add reactive state
```

---

## Quick Reference Checklist

### Daily Workflow

- [ ] Start with clear, contextual prompts
- [ ] Review AI suggestions before accepting
- [ ] Test changes before moving on
- [ ] Commit with descriptive messages

### Weekly Maintenance

- [ ] Check for toolkit updates: `bun ai-toolkit-shared/scripts/cli/update.js`
- [ ] Review tool updates (Cursor, Claude, etc.)
- [ ] Sync configs if standards changed: `bun ai-toolkit-shared/scripts/cli/sync.js`
- [ ] Validate compliance: `bun ai-toolkit-shared/scripts/cli/validate.js`

### Monthly Review

- [ ] Assess tool effectiveness
- [ ] Review and update standards.md
- [ ] Check for new tool features
- [ ] Optimize workflow based on learnings

### Quarterly Evaluation

- [ ] Compare tool performance
- [ ] Update toolkit to latest version
- [ ] Review and refine standards
- [ ] Document workflow improvements

---

## Troubleshooting

### Common Issues

**Problem:** AI suggestions don't follow project standards
**Solution:** Run `bun ai-toolkit-shared/scripts/cli/sync.js` to update configs

**Problem:** Tool doesn't recognize project structure
**Solution:** Check that `standards.md` is properly configured and synced

**Problem:** Configs are out of sync
**Solution:** Always edit `standards.md`, then run sync - never edit generated files

**Problem:** Tool updates break workflow
**Solution:** Review changelog, test in separate branch, update gradually

---

## Resources

### Documentation

- [Getting Started](GETTING-STARTED.md) - Toolkit setup
- [Commands Reference](COMMANDS.md) - All available commands
- [Updates Guide](UPDATES.md) - Staying current
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

### External Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Claude Code Documentation](https://claude.ai/code)
- [Windsurf Documentation](https://windsurf.ai/docs)
- [GitHub Copilot Docs](https://docs.github.com/copilot)

---

**Last Updated:** 2025-01-28
**Toolkit Version:** 1.0.14

---

**Remember:** The best practice is to use the CouchCMS AI Toolkit as your single source of truth. It ensures consistency across all AI tools and keeps your workflow future-proof.
