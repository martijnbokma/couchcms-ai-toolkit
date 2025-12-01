# Setup Method Comparison

Choose the setup method that best fits your needs.

:::warning[Critical Step]
You **must** install the toolkit's dependencies before running any scripts. The toolkit requires several npm packages (gray-matter, yaml, handlebars) that need to be installed first.
:::

```bash
cd ai-toolkit-shared
bun install  # or: npm install
cd ..
```

This installs the required packages:
- `gray-matter` - YAML frontmatter parsing
- `yaml` - YAML processing
- `handlebars` - Template generation

## Which Method Should I Choose?

### Choose Simple Creator if:
- ✅ You're using the toolkit for the first time
- ✅ You want to start quickly without technical details
- ✅ You're not sure exactly which modules you need
- ✅ You want a guided experience with clear explanations
- ✅ You want questions in understandable language (no jargon)

### Choose Advanced Init if:
- ✅ You have experience with development tools
- ✅ You want full control over all options
- ✅ You know exactly which modules and agents you need
- ✅ You want to choose between different configuration locations
- ✅ You want to configure the AAPF framework in detail

## Detailed Comparison

| Aspect | Simple Creator | Advanced Init |
|--------|---------------|---------------|
| **Command** | `bun run create` | `bun run init` |
| **Time** | 2 minutes | 5 minutes |
| **Difficulty** | ⭐ Easy | ⭐⭐⭐ Advanced |
| **Questions** | 5-8 simple questions | 10-15 technical questions |
| **Language** | Understandable English | Technical English |
| **Project detection** | Via project type choice | Automatic detection |
| **Module selection** | Via simple questions | Full list with checkboxes |
| **Agent selection** | Automatic based on modules | Manual selection |
| **Config location** | Always `.project/standards.md` | Choice between different locations |
| **Framework config** | Simple yes/no question | Detailed configuration |
| **Recommendations** | Based on project type | Based on detection |
| **Presets** | Integrated in questions | Separate preset menu |

## Example Questions

### Simple Creator Questions

```text
📝 Tell me about your project

What is your project called?
> my-blog

Project description:
> A personal blog about web development

🎯 What type of project are you building?
  1. Landing Page
  2. Blog
  3. Portfolio
  4. Web Application
  5. E-commerce
  6. Documentation
  7. Other

Choice [1-7]: 2

💅 Styling Framework:
  1. TailwindCSS only
  2. TailwindCSS + daisyUI (recommended)
  3. None - I'll use custom CSS

Choice [1-3]: 2

⚡ Interactivity:
  1. Alpine.js (recommended)
  2. Alpine.js + TypeScript
  3. HTMX
  4. None - Static site

Choice [1-4]: 1
```

### Advanced Init Questions

```text
🔍 Detecting project...
   Type: couchcms-webapp
   Frameworks: tailwindcss, alpinejs
   Languages: php, typescript, css, html

🎯 Setup mode:
  1. Auto (recommended) - Use detected settings
  2. Preset - Choose from common project types
  3. Simple - Quick setup with defaults
  4. Custom - Full control over all options

Choice [1-4]: 4

📝 Project name: my-blog
Project description: A personal blog

📦 Toolkit location: ./ai-toolkit-shared
Use different location? (y/N): n

📚 Select modules (space to toggle, enter to confirm):
  [x] couchcms-core (always included)
  [x] tailwindcss
  [x] alpinejs
  [ ] typescript
  [x] daisyui
  [ ] htmx
  [ ] databound-forms
  [ ] users
  [x] comments
  [x] search
  [x] pagination
  [ ] relations
  [ ] repeatable-regions

🤖 Select agents:
  [x] couchcms
  [x] tailwindcss
  [x] alpinejs
  [ ] databound-forms
  [ ] users
  [x] comments
  [x] search

🔧 Framework configuration:
Enable AAPF framework? (y/N): n

📁 Context directory:
Create context directory? (Y/n): y
Context path: .project/context
```

## Setup Modes (Advanced Init)

Advanced Init has 4 different modes:

### 1. Auto Mode
- Automatically detects project type and frameworks
- Suggests modules and agents
- Minimal questions (0-2)
- Fastest option within Advanced Init

### 2. Preset Mode
- Choose from 8 predefined project types
- Automatic module and agent selection
- Option to accept recommendations or choose yourself

### 3. Simple Mode
- Standard configuration (`.project/standards.md`)
- Basic modules (core + tailwindcss + alpinejs)
- Framework disabled
- Quick setup with defaults

### 4. Custom Mode
- Full control over all options
- Manual module and agent selection
- Choice of configuration location
- Detailed framework configuration

## Recommendations

### For Beginners
```bash
bun run create
```
Start with Simple Creator. You can always switch to Advanced Init later if you want more control.

### For Teams
```bash
bun run init
# Choose: Auto mode
```
Use Advanced Init in Auto mode for consistent setup within teams.

### For Experts
```bash
bun run init
# Choose: Custom mode
```
Use Advanced Init in Custom mode for full control.

### For Quick Prototypes
```bash
bun run create
# Choose: Landing Page or Blog
```
Simple Creator with a basic project type is the fastest.

## Switching Between Methods

You can always switch between methods:

### From Simple to Advanced
```bash
# Simple Creator creates .project/standards.md
bun run create

# Later: need more control?
bun run init
# Choose: Overwrite existing config
```

### From Advanced to Simple
```bash
# Advanced Init creates config
bun run init

# Later: start over with simple setup?
bun run create
# Choose: Overwrite existing config
```

## Result

Both methods generate:
- ✅ `standards.md` configuration file
- ✅ `.cursorrules` for Cursor IDE
- ✅ `.claude/` for Claude Code
- ✅ `.github/copilot-instructions.md` for GitHub Copilot
- ✅ `.windsurf/` for Windsurf
- ✅ `.kiro/` for Kiro
- ✅ Context directory for project documentation

The only difference is **how** you get there - via simple questions or detailed configuration.

## Need Help?

- **Simple Creator**: [SIMPLE-SETUP.md](SIMPLE-SETUP.md)
- **Advanced Init**: [GETTING-STARTED.md](GETTING-STARTED.md)
- **Problems**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Configuration**: [CONFIG-FILES.md](CONFIG-FILES.md)
