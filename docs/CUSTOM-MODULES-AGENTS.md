# Creating Custom Modules and Agents

This comprehensive guide explains how to create your own knowledge modules and AI agents for the CouchCMS AI Toolkit.

---

## Table of Contents

- [Overview](#overview)
- [Understanding the Structure](#understanding-the-structure)
- [Creating Knowledge Modules](#creating-knowledge-modules)
- [Creating AI Agents](#creating-ai-agents)
- [Integration and Configuration](#integration-and-configuration)
- [Best Practices](#best-practices)
- [Advanced Patterns](#advanced-patterns)
- [Testing and Validation](#testing-and-validation)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CouchCMS AI Toolkit uses a modular architecture where:

- **Knowledge Modules** provide specialized knowledge about frameworks, libraries, or patterns
- **AI Agents** are specialized assistants that leverage modules to help with specific tasks
- **Standards.md** acts as the central configuration file that ties everything together

### Key Benefits

- **Modularity**: Each module/agent is independent and reusable
- **Consistency**: Standardized format ensures compatibility
- **Auto-activation**: Claude Code can automatically activate relevant modules
- **Cross-platform**: Generated configs work across multiple AI platforms

---

## Understanding the Structure

### File Organization

```
couchcms-ai-toolkit/
├── modules/                    # Knowledge modules
│   ├── {name}.md              # Module content
│   ├── {name}.skill-rules.json # Claude Code auto-activation rules
│   └── README.md              # Module documentation
├── agents/                     # AI agents
│   ├── {name}.md              # Agent definition
│   └── README.md              # Agent documentation
└── standards.md               # Central configuration
```

### Naming Conventions

- **Modules**: `{feature-name}.md` + `{feature-name}.skill-rules.json`
- **Agents**: `{agent-name}.md`
- Use kebab-case for file names (e.g., `custom-routes.md`)
- Keep names descriptive but concise

---

## Creating Knowledge Modules

Knowledge modules contain specialized information about frameworks, libraries, or development patterns.

### Step 1: Create the Module File

Create `modules/{name}.md` with the following structure:

```markdown
---
id: your-module-id
name: "Your Module Name"
category: "frontend|backend|content|development|integration"
version: "1.0"
description: "Brief description of what this module covers"
required: false
requires: []
conflicts: []
---

# Your Module Name

## Overview

Brief introduction to what this module covers.

## Installation

How to install or set up the technology/framework.

## Core Concepts

Key concepts and terminology.

## Common Patterns

Frequently used patterns and examples.

## CouchCMS Integration

How this integrates specifically with CouchCMS.

## Best Practices

Do's and don'ts.

## Troubleshooting

Common issues and solutions.
```

### Step 2: Create Skill Rules (Optional)

Create `modules/{name}.skill-rules.json` for Claude Code auto-activation:

```json
{
  "your-module-id": {
    "type": "framework|library|pattern|integration",
    "enforcement": "suggest|require|warn",
    "priority": "high|medium|low",
    "description": "Brief description for Claude Code",
    "promptTriggers": {
      "keywords": [
        "keyword1",
        "keyword2",
        "framework-name"
      ],
      "intentPatterns": [
        "(create|build|implement).*?(component|feature)",
        "(setup|configure).*?(framework-name)"
      ]
    },
    "fileTriggers": {
      "pathPatterns": [
        "**/*.html",
        "components/**/*.php",
        "src/**/*.ts"
      ],
      "contentPatterns": [
        "framework-specific-syntax",
        "library-imports",
        "class-names"
      ]
    },
    "preflightChecks": [
      {
        "pattern": "problematic-pattern",
        "severity": "error|warning|info",
        "message": "Explanation of the issue and how to fix it"
      }
    ]
  }
}
```

### Example: Custom CSS Framework Module

```markdown
---
id: custom-css-framework
name: "Custom CSS Framework"
category: "frontend"
version: "1.0"
description: "Custom CSS framework patterns and utilities"
required: false
requires: []
conflicts: ["tailwindcss"]
---

# Custom CSS Framework

## Overview

This module provides patterns and utilities for our custom CSS framework built specifically for CouchCMS projects.

## Installation

```html
<link rel="stylesheet" href="/assets/css/framework.css">
```

## Core Components

### Grid System

```html
<div class="grid">
  <div class="col-12 col-md-6">Content</div>
  <div class="col-12 col-md-6">Content</div>
</div>
```

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
```

## CouchCMS Integration

### Template Structure

```php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'content'>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h1 class="card-title"><cms:show k_page_title /></h1>
      </div>
      <div class="card-body">
        <cms:show content />
      </div>
    </div>
  </div>
</cms:block>
<?php COUCH::invoke(); ?>
```

## Best Practices

### DO
- Use semantic class names
- Follow BEM methodology
- Ensure responsive design
- Test across browsers

### DON'T
- Mix with other CSS frameworks
- Use inline styles
- Ignore accessibility
- Hardcode colors

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Styles not loading | Missing CSS file | Check file path and server |
| Grid not responsive | Missing viewport meta | Add viewport meta tag |
```

---

## Creating AI Agents

AI agents are specialized assistants that help with specific development tasks.

### Step 1: Create the Agent File

Create `agents/{name}.md` with the following structure:

```markdown
---
name: Your Agent Name
version: "1.0"
type: combined|daily|specialized|framework
description: Brief description of what this agent does
tags:
  - tag1
  - tag2
  - framework-name
---

# Your Agent Name

You are a [technology/framework] expert specializing in [specific area] for CouchCMS projects.

---

## Quick Reference

### Key Concepts

| Concept | Description | Example |
|---------|-------------|---------|
| Concept 1 | What it does | `code example` |
| Concept 2 | What it does | `code example` |

### Your Approach

- Principle 1
- Principle 2
- Principle 3
- Use [specific patterns/conventions]
- Integrate cleanly with CouchCMS

---

## Common Patterns

### Pattern 1

```language
// Example code
```

### Pattern 2

```language
// Example code
```

---

## Deep Dive

### Advanced Concepts

Detailed explanations and complex examples.

---

## Refactoring

### When to Refactor

- Warning sign 1
- Warning sign 2

### Anti-Patterns to Fix

Examples of what not to do and how to fix it.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Issue 1 | Root cause | How to fix |
| Issue 2 | Root cause | How to fix |
```

### Example: Custom API Agent

```markdown
---
name: Custom API Agent
version: "1.0"
type: specialized
description: Custom API integration and development patterns
tags:
  - api
  - integration
  - rest
  - json
---

# Custom API Agent

You are a custom API expert specializing in building and integrating APIs with CouchCMS projects.

---

## Quick Reference

### HTTP Methods

| Method | Purpose | CouchCMS Usage |
|--------|---------|----------------|
| GET | Retrieve data | `<cms:call 'api.get' endpoint='users' />` |
| POST | Create data | Form submissions with `<cms:form>` |
| PUT | Update data | DataBound Forms updates |
| DELETE | Remove data | Admin actions |

### Your Approach

- Follow RESTful conventions
- Use proper HTTP status codes
- Implement authentication/authorization
- Handle errors gracefully
- Document all endpoints

---

## Common Patterns

### API Endpoint

```php
<?php
// api/users.php
require_once('../couch/cms.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $users = [];
    // Fetch users logic
    echo json_encode($users);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    // Create user logic
    echo json_encode(['success' => true]);
}
?>
```

### Frontend Integration

```javascript
// Fetch data from API
async function fetchUsers() {
    try {
        const response = await fetch('/api/users.php');
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}
```

---

## Deep Dive

### Authentication

```php
<?php
function authenticate() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (!$token || !validateToken($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
?>
```

### Error Handling

```php
<?php
function handleError($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'error' => $message,
        'timestamp' => date('c')
    ]);
    exit;
}
?>
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| CORS errors | Missing headers | Add CORS headers to API responses |
| 500 errors | PHP errors | Check error logs, add error handling |
| Authentication fails | Invalid tokens | Verify token generation/validation |
```

---

## Integration and Configuration

### Step 1: Add to standards.md

Edit your project's `standards.md` file to include your new modules and agents:

```yaml
modules:
  # Existing modules
  - couchcms-core
  - tailwindcss
  
  # Your custom modules
  - custom-css-framework
  - your-new-module

agents:
  # Existing agents
  - couchcms
  - tailwindcss
  
  # Your custom agents
  - custom-api
  - your-new-agent
```

### Step 2: Regenerate Configurations

Run the sync script to generate updated AI configurations:

```bash
bun scripts/sync.js
```

This will:
- Update `.cursorrules` with new modules
- Generate Claude Code skills
- Update agent documentation
- Create platform-specific configs

### Step 3: Validate Configuration

Check that everything is working:

```bash
bun scripts/validate.js
```

---

## Best Practices

### Module Development

#### Content Structure
- **Start with overview**: Brief introduction to the technology
- **Include installation**: How to set up or install
- **Show examples**: Practical, working code examples
- **CouchCMS integration**: Specific patterns for CouchCMS
- **Best practices**: Do's and don'ts
- **Troubleshooting**: Common issues and solutions

#### Writing Style
- Use clear, concise language
- Include code examples for every concept
- Use tables for quick reference
- Add warnings for common pitfalls
- Keep examples practical and realistic

#### Code Examples
```markdown
<!-- ✅ Good: Clear, complete example -->
### User Authentication

```php
<?php
if (!$FUNCS->is_user_logged_in()) {
    $FUNCS->redirect('login.php');
}
?>
<h1>Welcome, <cms:show k_user_name />!</h1>
```

<!-- ❌ Bad: Incomplete, unclear -->
### Auth
```php
if (!logged_in()) redirect();
```
```

### Agent Development

#### Personality and Tone
- Be specific about expertise area
- Use confident, helpful tone
- Provide actionable advice
- Include context about CouchCMS integration

#### Structure
- **Quick Reference**: Tables and key concepts
- **Common Patterns**: Frequently used code
- **Deep Dive**: Advanced concepts
- **Refactoring**: How to improve existing code
- **Troubleshooting**: Problem-solution pairs

#### Code Quality
- Always include complete, working examples
- Show both basic and advanced patterns
- Include error handling
- Follow CouchCMS conventions

### Skill Rules Best Practices

#### Trigger Keywords
```json
{
  "keywords": [
    "framework-name",        // Exact framework name
    "key-concept",          // Core concepts
    "common-task",          // What users do
    "integration-point"     // How it connects to CouchCMS
  ]
}
```

#### Intent Patterns
```json
{
  "intentPatterns": [
    "(create|build|make).*?(component|feature)",
    "(setup|configure|install).*?(framework)",
    "(integrate|connect).*?(with|to).*?(couchcms)"
  ]
}
```

#### File Triggers
```json
{
  "pathPatterns": [
    "**/*.html",           // Template files
    "components/**/*",     // Component directory
    "snippets/**/*"        // Snippet directory
  ],
  "contentPatterns": [
    "framework-syntax",    // Specific syntax
    "import.*framework",   // Import statements
    "class.*framework"     // CSS classes
  ]
}
```

---

## Advanced Patterns

### Module Dependencies

```yaml
# modules/advanced-forms.md
---
id: advanced-forms
name: "Advanced Forms"
requires: ["databound-forms", "alpinejs"]
conflicts: ["simple-forms"]
---
```

### Conditional Loading

```json
{
  "conditionalTriggers": {
    "fileExists": ["package.json"],
    "contentContains": ["import.*react"],
    "pathMatches": ["src/**/*.tsx"]
  }
}
```

### Agent Specialization

```markdown
---
name: E-commerce Agent
type: specialized
description: E-commerce patterns for CouchCMS
extends: ["couchcms", "databound-forms"]
tags:
  - ecommerce
  - shopping
  - payments
---
```

### Cross-Module Integration

```markdown
## Integration with Other Modules

This module works best when combined with:

- **TailwindCSS**: For styling components
- **Alpine.js**: For interactive behavior
- **DataBound Forms**: For form handling

### Combined Example

```html
<div x-data="{ loading: false }" class="card">
  <cms:form method="post" class="form">
    <input type="text" name="title" class="input input-bordered" />
    <button type="submit" class="btn btn-primary" x-bind:disabled="loading">
      Submit
    </button>
  </cms:form>
</div>
```
```

---

## Testing and Validation

### Manual Testing

1. **Create test files** that should trigger your module
2. **Use keywords** from your skill rules in comments
3. **Check auto-activation** in Claude Code
4. **Test agent responses** with `@your-agent` syntax

### Validation Script

```bash
# Check configuration
bun scripts/validate.js

# Test specific module
bun scripts/validate.js --module your-module

# Test specific agent
bun scripts/validate.js --agent your-agent
```

### Integration Testing

```markdown
<!-- Test file: test-your-module.html -->
<!-- Keywords: your-framework, integration, setup -->
<div class="your-framework-component">
  <!-- This should trigger your module -->
</div>
```

### Quality Checklist

#### Module Checklist
- [ ] YAML frontmatter complete and valid
- [ ] All sections present (overview, installation, patterns, etc.)
- [ ] Code examples are complete and working
- [ ] CouchCMS integration patterns included
- [ ] Best practices and troubleshooting sections
- [ ] Skill rules file created (if needed)
- [ ] Added to standards.md
- [ ] Sync script run successfully

#### Agent Checklist
- [ ] YAML frontmatter complete and valid
- [ ] Clear expertise area defined
- [ ] Quick reference table included
- [ ] Common patterns with examples
- [ ] Refactoring guidance provided
- [ ] Troubleshooting section complete
- [ ] Added to standards.md
- [ ] Agent responds correctly to `@agent` syntax

---

## Troubleshooting

### Common Issues

#### Module Not Loading
```bash
# Check file syntax
bun scripts/validate.js --module your-module

# Verify standards.md includes module
grep "your-module" standards.md

# Regenerate configs
bun scripts/sync.js
```

#### Agent Not Responding
```bash
# Check agent file syntax
bun scripts/validate.js --agent your-agent

# Verify agent is in standards.md
grep "your-agent" standards.md

# Check generated AGENTS.md
grep "your-agent" AGENTS.md
```

#### Skill Rules Not Triggering
```json
// Check JSON syntax
{
  "module-id": {
    "promptTriggers": {
      "keywords": ["test-keyword"]
    }
  }
}
```

#### Sync Errors
```bash
# Check for syntax errors
bun scripts/validate.js

# Check file permissions
ls -la modules/ agents/

# Regenerate with verbose output
bun scripts/sync.js --verbose
```

### Debug Tips

1. **Start simple**: Create minimal module/agent first
2. **Test incrementally**: Add features one at a time
3. **Use validation**: Run validation after each change
4. **Check generated files**: Verify configs are updated
5. **Test with keywords**: Use trigger words in test files

### Getting Help

1. **Check existing modules**: Look at similar modules for patterns
2. **Review documentation**: Read toolkit docs thoroughly
3. **Test with simple examples**: Start with basic functionality
4. **Use validation tools**: Let the scripts catch errors
5. **Ask for feedback**: Share your modules with the community

---

## Examples Repository

### Complete Module Example

See `modules/alpinejs.md` and `modules/alpinejs.skill-rules.json` for a complete, working example.

### Complete Agent Example

See `agents/alpinejs.md` for a comprehensive agent implementation.

### Integration Example

Check `standards.md` to see how modules and agents are configured and integrated.

---

*This guide is part of the CouchCMS AI Toolkit. For more information, see the [main documentation](README.md).*