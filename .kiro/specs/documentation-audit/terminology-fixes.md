# Terminology Standardization Guide

## Standardized Terms

Based on audit findings, these are the preferred terms to use consistently across all documentation:

### 1. "toolkit"
- **Preferred**: "toolkit"
- **Avoid**: "ai toolkit", "couchcms ai toolkit" (except in formal names)
- **Exception**: "the toolkit" is acceptable when grammatically necessary
- **Example**: "The toolkit provides..." ✅ | "The ai toolkit provides..." ❌

### 2. "setup" vs "configuration"
- **"setup"**: Use for the process/action
  - Example: "Run the setup wizard" ✅
- **"configuration"**: Use for the result/state
  - Example: "Your configuration is stored in standards.md" ✅
- **Avoid**: "init", "initialization" (except when referring to init.js script)

### 3. "agent" / "agents"
- **Preferred**: "agent" (singular), "agents" (plural)
- **Avoid**: "ai agent" (redundant - all agents are AI agents in this context)
- **Example**: "The agent provides..." ✅ | "The ai agent provides..." ❌

### 4. "sync"
- **Preferred**: "sync" (as verb or noun)
- **Avoid**: "generation", "generate" when referring to the sync process
- **Example**: "Run sync to update files" ✅ | "Run generation to update files" ❌
- **Exception**: "generated files" is acceptable when referring to the output

### 5. "standards.md"
- **Preferred**: "`standards.md`" (in code format)
- **Secondary**: "configuration file" (when explaining what it is)
- **Avoid**: "config file" (too informal)
- **Example**: "Edit `standards.md`" ✅ | "Edit the config file" ❌

### 6. "setup wizard"
- **Preferred**: "setup wizard"
- **Avoid**: "wizard", "interactive setup" (unless adding context)
- **Example**: "The setup wizard guides you..." ✅ | "The wizard guides you..." ❌

## Glossary Terms (from requirements.md)

These terms are defined in the glossary and should be used consistently:

- **Toolkit**: The CouchCMS AI Toolkit software package
- **Configuration File**: The `standards.md` file containing project configuration
- **Generated Files**: Files automatically created by the sync script
- **Module**: A knowledge module providing AI assistants with framework-specific patterns
- **Agent**: A specialized AI agent for specific development tasks
- **Sync**: The process of generating AI configuration files from `standards.md`
- **Setup Wizard**: The interactive `init.js` script that guides initial configuration
- **Legacy Format**: Old configuration format using multiple YAML files (pre-v2.0)
- **Current Format**: Single `standards.md` file with YAML frontmatter (v2.0+)

## Implementation Strategy

1. Update glossary in README.md to match requirements.md
2. Systematically review and update each documentation file
3. Focus on high-traffic files first (README, GETTING-STARTED, QUICK-START)
4. Use find-and-replace carefully (context matters!)
5. Verify changes don't break meaning or grammar

## Files Requiring Most Updates

Based on audit findings:

1. README.md - Multiple terminology variations
2. GETTING-STARTED.md - Inconsistent agent/module references
3. EDITOR-SUPPORT.md - Mixed sync/generation terminology
4. NEW-FEATURES.md - Various inconsistencies
5. TROUBLESHOOTING.md - Mixed terminology in solutions

