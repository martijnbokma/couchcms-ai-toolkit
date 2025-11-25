---
# === PROJECT CONFIGURATION ===
name: "my-project"
description: "Brief description of your project"

# === TOOLKIT LOCATION ===
# Use one of:
#   "./ai-toolkit"           - If added as git submodule
#   "~/couchcms-ai-toolkit"  - If cloned to home directory
#   "/absolute/path/to/toolkit"
toolkit: "./ai-toolkit"

# === MODULES ===
# Select which modules to activate for this project.
# couchcms-core is always included automatically.
modules:
  # Frontend
  - tailwindcss        # TailwindCSS 4 patterns
  - daisyui            # daisyUI 5 components
  - alpinejs           # Alpine.js patterns + CouchCMS integration
  
  # Backend
  - databound-forms    # CouchCMS DataBound Forms
  
  # Optional
  - typescript         # TypeScript standards (comment out if not using)

# === OVERRIDES (Optional) ===
# Override default settings for this project
# overrides:
#   indentation: 2      # Default is 4
#   language: "dutch"   # Default is "english" (not recommended)
#   lineLength: 80      # Default is 120
---

# Project-Specific Rules

Add any project-specific instructions, conventions, or requirements here.
This content will be included in all generated AI configurations.

## Example Sections

### Client Requirements
- Specific design requirements
- Brand guidelines
- Content restrictions

### Technical Decisions
- Technology choices specific to this project
- Patterns or libraries unique to this project
- Known limitations or workarounds

### Team Conventions
- Code review process
- Naming conventions beyond the defaults
- Documentation requirements
