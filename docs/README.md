# CouchCMS AI Toolkit Documentation

**Navigation:** [← Back to Main README](../README.md) | [Getting Started](GETTING-STARTED.md) | [Quick Start](QUICK-START.md) | [Troubleshooting](TROUBLESHOOTING.md)

Welcome to the comprehensive documentation for the CouchCMS AI Toolkit. This guide will help you find the right documentation for your needs, organized by task and skill level.

## 🚀 Quick Start (Choose Your Path)

### For Beginners (⭐ Easy)
**New to the toolkit? Start here!**

| Task | Guide | Time | Description |
|------|-------|------|-------------|
| **First Setup** | [Getting Started](GETTING-STARTED.md) | 15 min | Complete setup guide with explanations |
| **Quick Setup** | [Quick Start](QUICK-START.md) | 5 min | Fast installation for experienced users |
| **Simple Wizard** | [Simple Setup](SIMPLE-SETUP.md) | 2 min | Beginner-friendly setup wizard |

### For Experienced Users (⭐⭐ Intermediate)
**Know what you're doing? Jump right in:**

| Task | Guide | Time |
|------|-------|------|
| **Compare Setup Methods** | [Setup Comparison](SETUP-COMPARISON.md) | 3 min |
| **Command Reference** | [Commands](COMMANDS.md) | 5 min |
| **Quick Reference** | [Quick Reference](QUICK-REFERENCE.md) | 2 min |

### For Advanced Users (⭐⭐⭐ Advanced)
**Need full control or customization:**

| Task | Guide | Time |
|------|-------|------|
| **Extending Modules** | [Extending Modules](EXTENDING-MODULES.md) | 20 min |
| **Contributing** | [Contributing](../CONTRIBUTING.md) | 30 min |
| **Git Workflow** | [Git Workflow](GIT-WORKFLOW.md) | 15 min |

## 📋 Documentation by Task

### Installation & Setup

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Getting Started](GETTING-STARTED.md)** | First time using the toolkit | ⭐ Beginner |
| **[Quick Start](QUICK-START.md)** | You know what you're doing | ⭐⭐ Intermediate |
| **[Simple Setup](SIMPLE-SETUP.md)** | Want guided, simple experience | ⭐ Beginner |
| **[Setup Comparison](SETUP-COMPARISON.md)** | Compare different setup methods | ⭐⭐ Intermediate |
| **[Installation Methods](INSTALLATION-METHODS.md)** | Alternative installation approaches | ⭐⭐ Intermediate |
| **[Private Repo Install](PRIVATE-REPO-INSTALL.md)** | Installing in private repositories | ⭐⭐⭐ Advanced |

### Configuration & Usage

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Config Files Guide](CONFIG-FILES.md)** | Understanding `standards.md` | ⭐⭐ Intermediate |
| **[Commands Reference](COMMANDS.md)** | Using toolkit commands | ⭐ Beginner |
| **[Quick Reference](QUICK-REFERENCE.md)** | Quick command lookup | ⭐ Beginner |
| **[Quick Reference Card](QUICK-REFERENCE-CARD.md)** | One-page printable reference | ⭐ Beginner |
| **[Standards Guide](STANDARDS-GUIDE.md)** | Detailed configuration options | ⭐⭐⭐ Advanced |

### Editor Integration

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Editor Support](EDITOR-SUPPORT.md)** | Setting up editor integrations | ⭐⭐ Intermediate |
| **[Editor Quick Reference](EDITOR-QUICK-REFERENCE.md)** | Quick editor feature lookup | ⭐ Beginner |
| **[Project Rules](PROJECT-RULES.md)** | Cursor project rules | ⭐⭐ Intermediate |
| **[User Rules](USER-RULES.md)** | Cursor user rules | ⭐⭐ Intermediate |
| **[Custom Commands](CUSTOM-COMMANDS.md)** | Cursor custom commands | ⭐⭐⭐ Advanced |

### Features & Modules

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Modules](MODULES.md)** | Understanding available modules | ⭐ Beginner |
| **[Agents](AGENTS.md)** | Using AI agents | ⭐ Beginner |
| **[Module Guide](MODULE-GUIDE.md)** | Detailed module information | ⭐⭐ Intermediate |
| **[New Features](NEW-FEATURES.md)** | Latest toolkit features | ⭐ Beginner |

### Maintenance & Updates

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Updates](UPDATES.md)** | Keeping toolkit current | ⭐ Beginner |
| **[Migration](MIGRATION.md)** | Upgrading from old versions | ⭐⭐ Intermediate |
| **[Troubleshooting](TROUBLESHOOTING.md)** | Fixing problems | ⭐ Beginner |

### Quality Assurance

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Documentation Maintenance](DOCUMENTATION-MAINTENANCE.md)** | Maintain documentation quality | ⭐⭐ Intermediate |

### Development & Contributing

| Guide | When to Use | Skill Level |
|-------|-------------|-------------|
| **[Extending Modules](EXTENDING-MODULES.md)** | Creating custom modules | ⭐⭐⭐ Advanced |
| **[Contributing](../CONTRIBUTING.md)** | Contributing to the project | ⭐⭐⭐ Advanced |
| **[Git Workflow](GIT-WORKFLOW.md)** | Team collaboration | ⭐⭐ Intermediate |
| **[Release Guide](RELEASE-GUIDE.md)** | Creating releases | ⭐⭐⭐ Advanced |

## 🎯 Quick Reference

### Most Common Commands

```bash
# Setup (first time)
bun ai-toolkit-shared/scripts/init.js

# Generate configs
bun ai-toolkit-shared/scripts/sync.js

# Validate setup
bun ai-toolkit-shared/scripts/validate.js

# Audit documentation
cd ai-toolkit-shared && bun run audit:docs

# Check for updates
cd ai-toolkit-shared && bun run update
```

### Most Common Issues

| Problem | Solution | Guide |
|---------|----------|-------|
| **Commands not working** | Install dependencies first | [Troubleshooting](TROUBLESHOOTING.md) |
| **Config not syncing** | Check `standards.md` format | [Config Files Guide](CONFIG-FILES.md) |
| **Editor not working** | Re-run sync command | [Editor Support](EDITOR-SUPPORT.md) |
| **Old version issues** | Run migration script | [Migration](MIGRATION.md) |

### File Locations

| File | Purpose | When to Edit |
|------|---------|--------------|
| **`standards.md`** | Main configuration | Customize project settings |
| **`.cursorrules`** | Cursor AI config | Auto-generated (don't edit) |
| **`CLAUDE.md`** | Claude memory file | Auto-generated (don't edit) |
| **`AGENTS.md`** | Agent documentation | Auto-generated (don't edit) |

## 📖 Reference

| Guide | Purpose |
|-------|---------|
| **[Glossary](GLOSSARY.md)** | Definitions of technical terms |

## 🆘 Need Help?

### Step-by-Step Troubleshooting

1. **Check the basics:**
   - Did you run `bun install` in `ai-toolkit-shared/`?
   - Is your `standards.md` file valid YAML?

2. **Run diagnostics:**
   ```bash
   cd ai-toolkit-shared && bun run validate
   ```

3. **Check for updates:**
   ```bash
   cd ai-toolkit-shared && bun run update:check
   ```

4. **Still stuck?**
   - Check [Troubleshooting Guide](TROUBLESHOOTING.md)
   - Open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues)

### Common Beginner Mistakes

| Mistake | Fix | Prevention |
|---------|-----|------------|
| **Skipping `bun install`** | Run it in `ai-toolkit-shared/` | Always install dependencies first |
| **Editing generated files** | Re-run sync to restore | Only edit `standards.md` |
| **Wrong directory** | Commands need correct path | Use full paths or `cd` first |
| **Invalid YAML** | Check syntax in `standards.md` | Use YAML validator |

## 📚 Learning Path

### New to CouchCMS AI Toolkit

1. **Start Here:** [Getting Started](GETTING-STARTED.md) (15 min)
2. **Learn Commands:** [Commands Reference](COMMANDS.md) (5 min)
3. **Explore Features:** [Modules](MODULES.md) and [Agents](AGENTS.md) (10 min)
4. **Customize:** [Config Files Guide](CONFIG-FILES.md) (10 min)

### Ready to Contribute

1. **Understand the System:** [Extending Modules](EXTENDING-MODULES.md) (20 min)
2. **Learn the Workflow:** [Git Workflow](GIT-WORKFLOW.md) (15 min)
3. **Read Guidelines:** [Contributing](../CONTRIBUTING.md) (30 min)

## 🔄 Keep Updated

- **Latest Features:** [New Features](NEW-FEATURES.md)
- **Version History:** [Changelog](../CHANGELOG.md)
- **Update Guide:** [Updates](UPDATES.md)

---

**Questions?** Check [Troubleshooting](TROUBLESHOOTING.md) or open an [issue](https://github.com/martijnbokma/couchcms-ai-toolkit/issues).

**Want to contribute?** See [Contributing Guide](../CONTRIBUTING.md).
