# Content Creation Scripts

Scripts for creating new content (modules, agents) and auditing documentation.

## Scripts

### `create-module.js`

Create a new knowledge module for the toolkit.

**Usage:**
```bash
bun scripts/create/create-module.js
# or
bun run create:module
```

**What it does:**
- Guides you through creating a new module
- Creates module file with proper structure
- Sets up module metadata
- Adds module to appropriate category

### `create-agent.js`

Create a new AI agent for the toolkit.

**Usage:**
```bash
bun scripts/create/create-agent.js
# or
bun run create:agent
```

**What it does:**
- Guides you through creating a new agent
- Creates agent file with proper structure
- Sets up agent metadata
- Configures agent capabilities

### `audit-docs.js`

Audit and validate documentation across the project.

**Usage:**
```bash
bun scripts/create/audit-docs.js
# or
bun run audit:docs
```

**What it does:**
- Scans all documentation files
- Validates structure and formatting
- Checks for broken links
- Reports inconsistencies
- Generates audit report

## When to Use

### create-module.js
Use when you want to add new knowledge modules:
- New framework support
- New feature documentation
- New best practices

### create-agent.js
Use when you want to add new AI agents:
- Specialized domain agents
- New tool integrations
- Custom workflows

### audit-docs.js
Use for:
- Quality assurance before releases
- Finding documentation issues
- Validating documentation structure
- Regular maintenance checks

## Notes

- All scripts guide you through the process interactively
- Scripts validate input and provide helpful error messages
- Created files follow project conventions automatically
- Always review generated files before committing
