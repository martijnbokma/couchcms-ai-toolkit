# User Rules Guide

Complete guide for using Cursor User Rules with the CouchCMS AI Toolkit.

## What are User Rules?

User Rules are **global preferences** defined in **Cursor Settings → Rules** that apply across **all your projects**. Unlike Project Rules (which are project-specific), User Rules are:

- **Global** - Apply to every project you work on
- **Personal** - Stored in Cursor settings, not in repositories
- **Persistent** - Available in every Cursor session
- **Simple** - Plain text, no MDC format needed

## When to Use User Rules

Use User Rules for:

- ✅ **Communication preferences** - How you want the AI to respond
- ✅ **Personal coding style** - Your preferred conventions across projects
- ✅ **Workflow preferences** - How you like to work
- ✅ **Language preferences** - English-only, concise style, etc.

**Don't use User Rules for:**

- ❌ Project-specific patterns (use Project Rules instead)
- ❌ Framework-specific rules (use Project Rules)
- ❌ Team standards (use Team Rules or Project Rules)

## How User Rules Work

User Rules are included in the model context for **Agent (Chat)** only. They:

- ✅ Apply to **Agent (Chat)** conversations
- ❌ Do **NOT** apply to **Inline Edit** (Cmd/Ctrl+K)
- ✅ Work alongside Project Rules and Team Rules
- ✅ Take lowest precedence: **Team Rules → Project Rules → User Rules**

## Setting Up User Rules

### Step 1: Open Cursor Settings

1. Open Cursor IDE
2. 📝 Go to **Cursor Settings** (Cmd/Ctrl + ,)
3. 📝 Navigate to **Rules** section
4. 🔍 Find **User Rules** section

### Step 2: Add Your Rules

Paste your rules in the User Rules text area. Plain text is fine - no special format needed.

### Step 3: Save

Click **Save** or close settings. Rules are applied immediately.

## Toolkit Template

The toolkit provides a template you should use. Generate it with:

```bash
# Generate/update AI configuration files from standards.md
# This creates .cursorrules, CLAUDE.md, AGENTS.md, and other editor configs
bun ai-toolkit-shared/scripts/sync.js

# Optional: Watch mode - auto-sync when standards.md changes
# bun ai-toolkit-shared/scripts/sync.js --watch
```

This creates `USER-RULES.md` in your project with a template you should copy to Cursor Settings.

## Example User Rules

### Communication Style

```markdown
Please reply in a concise style. Avoid unnecessary repetition or filler language.

When explaining code:
- Be direct and to the point
- Use examples when helpful
- Skip obvious explanations
```

### Code Preferences

```markdown
## Code Style Preferences

- Prefer functional programming patterns
- Use early returns and guard clauses
- Favor immutability over mutation
- Always use explicit types (no 'any')
- Prefer named exports over default exports
```

### Workflow Preferences

```markdown
## Workflow

- Always ask for confirmation before making breaking changes
- Suggest improvements but don't implement without approval
- Explain the "why" behind recommendations
- Provide alternatives when possible
```

### Language Preferences

```markdown
## Language Requirements

- All code, comments, and documentation must be in English
- Use clear, descriptive variable names
- Avoid abbreviations unless widely understood
```

## Best Practices

### 1. Keep It Personal

User Rules should reflect **your** preferences, not project requirements:

```markdown
# ✅ Good: Personal preference
I prefer concise explanations over detailed ones.

# ❌ Bad: Project-specific
Always use CouchCMS patterns for this project.
```

### 2. Be Specific

Clear instructions work better than vague ones:

```markdown
# ✅ Good: Specific
Always use explicit return types in TypeScript functions.

# ❌ Bad: Vague
Write good code.
```

### 3. Keep It Short

User Rules are included in every chat, so keep them concise:

```markdown
# ✅ Good: Concise
Prefer functional patterns, use early returns, avoid mutation.

# ❌ Bad: Too long
Here's a 500-line explanation of my entire philosophy on software development...
```

### 4. Focus on Communication

User Rules excel at communication style:

```markdown
# ✅ Good: Communication style
Reply in a friendly, helpful tone. Use examples when explaining concepts.

# ❌ Bad: Too technical
When working with TypeScript, always use generics with constraints...
```

## Integration with Toolkit

User Rules work alongside the toolkit's Project Rules:

### Rule Precedence

When rules conflict, this order applies:

1. **Team Rules** (highest priority)
2. 📝 **Project Rules** (from `.cursor/rules/`)
3. 📝 **User Rules** (lowest priority)

### Example Flow

```text
Team Rule: "Always use TypeScript"
Project Rule: "Use JavaScript for this project"
User Rule: "Prefer Python"

Result: TypeScript is used (Team Rule wins)
```

### Complementary Use

User Rules and Project Rules complement each other:

**User Rules** (Global):
```markdown
Reply concisely. Use English only.
```

**Project Rules** (Specific):
```yaml
---
description: CouchCMS template patterns
globs: ['**/*.php']
---

Always use <cms:embed> for shared components.
```

Together, they ensure:
- Concise, English responses (User Rule)
- CouchCMS patterns applied (Project Rule)

## Common Patterns

### Pattern 1: Communication + Language

```markdown
## Communication

- Reply in concise style
- Use English for all code and comments
- Provide examples when helpful
- Explain the "why" behind recommendations
```

### Pattern 2: Code Style Preferences

```markdown
## Code Preferences

- Prefer functional programming patterns
- Use early returns and guard clauses
- Favor immutability over mutation
- Always use explicit types (avoid 'any')
```

### Pattern 3: Workflow Preferences

```markdown
## Workflow

- Ask for confirmation before breaking changes
- Suggest improvements but don't implement without approval
- Explain alternatives when possible
- Focus on maintainability
```

### Pattern 4: Learning Style

```markdown
## Learning Preferences

- Explain concepts clearly
- Use analogies when helpful
- Provide context for decisions
- Link to documentation when relevant
```

## Troubleshooting

### Rules Not Applying

1. **Check settings** - Verify rules are saved in Cursor Settings → Rules
2. 📝 **Restart Cursor** - Sometimes needed after changes
3. 🔍 **Check precedence** - Team/Project Rules may override User Rules
4. ✅ **Verify scope** - User Rules only apply to Agent (Chat), not Inline Edit

### Conflicts with Project Rules

If User Rules conflict with Project Rules:

1. **Project Rules win** - They have higher precedence
2. 📝 **Adjust User Rules** - Make them more general
3. 📝 **Use Project Rules** - For project-specific needs

### Too Many Rules

If you have too many User Rules:

1. **Prioritize** - Keep only the most important
2. 📝 **Move to Project** - Project-specific rules belong in Project Rules
3. 📝 **Simplify** - Combine related rules

## Template

Use this template as a starting point:

```markdown
## Communication Style

Please reply in a concise style. Avoid unnecessary repetition or filler language.

## Code Preferences

- Prefer functional programming patterns
- Use early returns and guard clauses
- Favor immutability over mutation
- Always use explicit types (no 'any')

## Language Requirements

- All code, comments, and documentation must be in English
- Use clear, descriptive variable names

## Workflow

- Always ask for confirmation before making breaking changes
- Suggest improvements but don't implement without approval
- Explain the "why" behind recommendations
```

## See Also

- [Project Rules Guide](PROJECT-RULES.md) - Project-specific rules
- [Cursor Rules Documentation](https://cursor.com/docs/context/rules#user-rules) - Official docs
- [Getting Started](GETTING-STARTED.md) - Toolkit setup
