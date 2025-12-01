# Simple Standards Creator

A simple, user-friendly wizard to create `standards.md` without technical knowledge.

## What does it do?

The Simple Standards Creator guides you step-by-step through creating a `standards.md` configuration file. You just need to answer simple questions about your project, and the wizard does the rest.

## When to use?

Use this wizard when:
- You're using the toolkit for the first time
- You want to set up a project quickly without knowing all the details
- You're not sure exactly which modules and agents you need
- You want a simple, guided experience

## Usage

```bash
# From your project directory
bun ai-toolkit-shared/scripts/create-standards.js

# Or via npm script (if toolkit is installed)
bun run create
```

## What will be asked?

The wizard asks simple questions in understandable language:

### 1. Project Information
- **Project name**: What is your project called?
- **Description**: What does your project do? (one sentence is enough)
- **Project type**: Choose from predefined types:
  - Landing Page
  - Blog
  - Portfolio
  - Web Application
  - E-commerce
  - Documentation
  - Custom (configure yourself)

### 2. Technologies

Depending on your project type, you'll get recommendations, or you can choose yourself:

- **Styling**: TailwindCSS, daisyUI, or custom CSS
- **Interactivity**: Alpine.js, TypeScript, HTMX, or none
- **Forms**: Do you need advanced forms?
- **Users**: Do you need user accounts?
- **Search**: Do you need search functionality?
- **Comments**: Do you need comments?
- **AI Framework**: Do you want to use the AAPF framework?

### 3. Confirmation

You'll get an overview of your choices and can confirm before the file is created.

## Example Session

```text
✨ CouchCMS AI Toolkit - Simple Standards Creator

This wizard will help you create a standards.md file
by asking simple questions about your project.

📝 Tell me about your project

Just answer a few simple questions...

What is your project called? my-blog

Great! Now describe what your project does.
(Keep it short - one sentence is fine)

Project description: A personal blog about web development

🎯 What type of project are you building?

  1. Landing Page - Simple website with a few pages
  2. Blog - Blog with articles and comments
  3. Portfolio - Showcase your work
  4. Web Application - Full app with user accounts
  5. E-commerce - Online store
  6. Documentation - Documentation site
  7. Other - I'll configure it myself

Choice [1-7]: 2

🛠️  Which technologies do you want to use?

Based on your project type (Blog), I recommend:

  Modules: couchcms-core, tailwindcss, alpinejs, comments, search, pagination
  Agents: couchcms, tailwindcss, alpinejs, comments, search

Use these recommended settings? (Y/n): Y

📋 Summary:

  Project: my-blog
  Description: A personal blog about web development
  Type: blog
  Modules: couchcms-core, tailwindcss, alpinejs, comments, search, pagination
  Agents: couchcms, tailwindcss, alpinejs, comments, search
  Framework: Disabled
  Config: .project/standards.md

Create standards.md with these settings? (Y/n): Y

✅ Generated .project/standards.md
✅ Created context directory: .project/context
✅ Sync completed successfully

💡 Next steps:

  1. Review .project/standards.md
  2. Add project-specific rules at the bottom
  3. Run "bun ai-toolkit-shared/scripts/sync.js" to update configs
```

## Difference from `init.js`

| Feature | `create-standards.js` | `init.js` |
|---------|----------------------|-----------|
| **Target Audience** | Beginners, quick setup | Advanced users |
| **Questions** | Simple, in understandable language | Technical, more options |
| **Recommendations** | Automatic based on project type | Detection + manual choice |
| **Configuration** | Always `.project/standards.md` | Choice between different locations |
| **Module selection** | Based on simple questions | Full list with checkboxes |
| **Agent selection** | Automatic based on modules | Manual selection |
| **Framework** | Simple yes/no question | Detailed configuration |

## Benefits

✅ **Simple**: No technical knowledge required
✅ **Fast**: Ready in 2 minutes
✅ **Smart**: Recommendations based on project type
✅ **Safe**: Asks for confirmation before overwriting
✅ **Complete**: Generates working configuration immediately

## After Creation

After creating `standards.md`:

1. **Review the file**: Open `.project/standards.md` and check the settings
2. **Add project-specific rules**: At the bottom of the file, you can add your own rules
3. **Re-sync**: Run `bun ai-toolkit-shared/scripts/sync.js` if you make changes
4. **Start developing**: Your AI assistants are now configured!

## Tips

- **Not sure?** Choose a project type that most closely matches what you want to build
- **Too many modules?** You can remove modules later in `standards.md`
- **Too few modules?** You can add modules later in `standards.md`
- **Want more control?** Use `bun ai-toolkit-shared/scripts/init.js`

## Troubleshooting

### "Config already exists"

If a `standards.md` already exists, the wizard will ask if you want to overwrite it. Choose 'No' if you want to keep the existing configuration.

### "Module not found"

If a module is not found, check if the toolkit is correctly installed:

```bash
cd ai-toolkit-shared
bun install
cd ..
```

### "Sync failed"

If sync fails, try:

```bash
# Check toolkit status and updates
bun ai-toolkit-shared/scripts/health.js
```

This checks if everything is correctly configured.

## See Also

- [QUICK-START.md](QUICK-START.md) - Quick start guide
- [CONFIG-FILES.md](CONFIG-FILES.md) - Configuration explanation
- [MODULES.md](MODULES.md) - Available modules
- [AGENTS.md](AGENTS.md) - Available agents
