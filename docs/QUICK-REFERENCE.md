# Quick Reference

A one-page reference for the most common CouchCMS AI Toolkit operations.

---

## 🚀 Setup Commands

| I want to... | Command |
|--------------|---------|
| Set up toolkit (first time) | `bun ai-toolkit-shared/scripts/init.js` |
| Generate/update AI configs | `bun ai-toolkit-shared/scripts/sync.js` |
| Validate my setup | `bun ai-toolkit-shared/scripts/validate.js` |
| Update toolkit to latest | `cd ai-toolkit-shared && bun run update-submodule && cd ..` |

---

## 🔧 Cursor Slash Commands

| I want to... | Command | Description |
|--------------|---------|-------------|
| Create a component | `/component <name>` | Creates component bundle (HTML, CSS, TS) |
| Create a view | `/view <name>` | Creates view files (list, detail) |
| Create a form | `/form <name>` | Creates DataBound Form |
| Refactor a file | `/refactor @file` | Analyzes and suggests improvements |
| Fix issues | `/fix @file` | Identifies and fixes issues |
| Code review | `/review @file` | Reviews code with suggestions |
| Validate code | `/validate @file` | Runs standards compliance checks |
| Add authentication | `/add-auth @file` | Adds authentication filters |

---

## 📁 Project Structure

```
your-project/
├── .project/
│   └── standards.md      ← Your configuration file
├── ai-toolkit-shared/    ← Toolkit (submodule)
├── snippets/
│   ├── components/       ← UI components
│   ├── views/            ← Page views
│   ├── layouts/          ← Page layouts
│   ├── filters/          ← Auth/security filters
│   └── forms/            ← DataBound Forms
├── assets/
│   ├── css/              ← Stylesheets
│   ├── ts/               ← TypeScript source
│   └── js/               ← Compiled JavaScript
├── .cursorrules          ← Auto-generated (don't edit)
├── CLAUDE.md             ← Auto-generated (don't edit)
└── AGENTS.md             ← Auto-generated (don't edit)
```

---

## 📦 Module Selection

| Project Type | Recommended Modules |
|--------------|---------------------|
| Simple CMS | `couchcms-core` |
| Modern frontend | `couchcms-core`, `tailwindcss`, `daisyui`, `alpinejs` |
| Blog/News | `couchcms-core`, `search`, `pagination`, `comments`, `archives` |
| User portal | `couchcms-core`, `users`, `databound-forms` |
| Full stack | All modules |

---

## 🤖 Agent Selection

| Development Task | Recommended Agent |
|------------------|-------------------|
| Template creation | `couchcms` |
| Form development | `databound-forms` |
| UI components | `alpinejs`, `tailwindcss` |
| Database work | `mysql` |
| URL routing | `custom-routes` |
| User features | `users` |
| Search functionality | `search`, `pagination` |

---

## ⚡ Common Workflows

### Starting a New Feature

```bash
# 1. Create component
# Use /component <name> in Cursor

# 2. Add to view
# Use /view <name> in Cursor

# 3. Add authentication if needed
# Use /add-auth @snippets/views/my-feature/list.html

# 4. Test and validate
bun ai-toolkit-shared/scripts/validate.js
```

### Fixing Code Issues

```bash
# Option 1: Automatic fix
# @file.php "/fix this file"

# Option 2: Manual review + fix
# @file.php "/review"
# Then: "/fix the issues identified"
```

### Refactoring Existing Code

```bash
# 1. Get refactoring suggestions
# @file.html "/refactor"

# 2. Apply specific refactor
# @file.html "apply the DRY refactoring"

# 3. Validate changes
bun ai-toolkit-shared/scripts/validate.js
```

---

## 🚨 CouchCMS Critical Rules

| ❌ Never Do This | ✅ Do This Instead |
|------------------|-------------------|
| `<!-- <cms:show x /> -->` | `<!-- [cms:show x /] -->` |
| `<cms:else></cms:else>` | `<cms:else />` |
| `@click="..."` (in CouchCMS) | `x-on:click="..."` |
| `:class="..."` (in CouchCMS) | `x-bind:class="..."` |
| `type='any'` (TypeScript) | Define specific type |
| `bg-gray-100` (TailwindCSS) | `bg-base-100` (daisyUI) |

---

## 📄 Configuration Quick Edit

Edit `.project/standards.md`:

```yaml
---
name: 'project-name'
description: 'Project description'
toolkit: './ai-toolkit-shared'

modules:
  - couchcms-core
  - tailwindcss
  - alpinejs

agents:
  - couchcms
  - tailwindcss
  - alpinejs
---

# Project-Specific Rules

Your custom rules here...
```

After editing, run: `bun ai-toolkit-shared/scripts/sync.js`

---

## 🆘 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "No configuration file found" | Run `bun ai-toolkit-shared/scripts/init.js` |
| "Module not found" | Check spelling in `standards.md` |
| "Toolkit path not found" | Verify `toolkit: './ai-toolkit-shared'` |
| Changes not reflected | Run `bun ai-toolkit-shared/scripts/sync.js` |
| Submodule issues | `cd ai-toolkit-shared && git checkout master && git pull` |

---

## 📚 Documentation Links

- **[Getting Started](GETTING-STARTED.md)** - Full setup guide
- **[Available Modules](MODULES.md)** - All 15 modules explained
- **[Available Agents](AGENTS.md)** - All 23 agents explained
- **[Commands Reference](COMMANDS.md)** - Detailed command docs
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues
- **[Configuration Guide](CONFIG-FILES.md)** - standards.md explained

---

## 💡 Pro Tips

1. **Start simple**: Use Simple mode in the setup wizard, expand later
2. **Sync often**: Run sync after any standards.md changes
3. **Validate regularly**: Run validate to catch issues early
4. **Use slash commands**: Faster than typing full prompts
5. **Read the checklist**: Follow the checklist in each rule/prompt

---

*Last updated: November 2025*
