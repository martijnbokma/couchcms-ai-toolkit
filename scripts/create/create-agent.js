#!/usr/bin/env bun

/**
 * Interactive Agent Creator
 * Creates a new AI agent with guided prompts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { getCouchCMSAgents } from '../lib/option-organizer.js';
import { DEV_TOOL_AGENTS } from '../lib/option-organizer.js';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function findAgentPath(agentName) {
    const couchcmsAgents = getCouchCMSAgents();
    const devToolNames = DEV_TOOL_AGENTS.map(a => a.name);

    let subdir = 'frontend'; // Default to frontend
    if (couchcmsAgents.includes(agentName)) {
        subdir = 'core';
    } else if (devToolNames.includes(agentName)) {
        subdir = 'dev-tools';
    }

    // Try subdirectory first
    const subdirPath = join('agents', subdir, `${agentName}.md`);
    if (existsSync(subdirPath)) {
        return subdirPath;
    }

    // Fallback to root (legacy support)
    const rootPath = join('agents', `${agentName}.md`);
    if (existsSync(rootPath)) {
        return rootPath;
    }

    return null;
}

function getAgentDirectory(agentName) {
    const couchcmsAgents = getCouchCMSAgents();
    const devToolNames = DEV_TOOL_AGENTS.map(a => a.name);

    if (couchcmsAgents.includes(agentName)) {
        return join('agents', 'core');
    } else if (devToolNames.includes(agentName)) {
        return join('agents', 'dev-tools');
    } else {
        return join('agents', 'frontend');
    }
}

function validateAgentId(id) {
    if (!id) return 'Agent ID is required';
    if (!/^[a-z0-9-]+$/.test(id)) return 'Agent ID must contain only lowercase letters, numbers, and hyphens';
    if (findAgentPath(id)) return 'Agent already exists';
    return null;
}

function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
}

async function promptForInput(prompt, validator = null, defaultValue = '') {
    while (true) {
        const answer = await question(`${prompt}${defaultValue ? ` (${defaultValue})` : ''}: `);
        const value = answer.trim() || defaultValue;

        if (validator) {
            const error = validator(value);
            if (error) {
                console.log(`❌ ${error}`);
                continue;
            }
        }

        return value;
    }
}

async function selectFromOptions(prompt, options) {
    console.log(`\n${prompt}`);
    options.forEach((option, index) => {
        console.log(`  ${index + 1}. ${option}`);
    });

    while (true) {
        const answer = await question('Select option (number): ');
        const index = parseInt(answer) - 1;

        if (index >= 0 && index < options.length) {
            return options[index];
        }

        console.log('❌ Invalid selection. Please enter a valid number.');
    }
}

async function promptForList(prompt, examples = []) {
    console.log(`\n${prompt}`);
    if (examples.length > 0) {
        console.log(`Examples: ${examples.join(', ')}`);
    }
    console.log('Enter items separated by commas, or press Enter for none:');

    const answer = await question('> ');
    return answer.trim() ? answer.split(',').map(item => item.trim()) : [];
}

async function createAgent() {
    console.log('🤖 CouchCMS AI Toolkit - Agent Creator\n');

    // Basic Information
    const id = await promptForInput('Agent ID (kebab-case)', validateAgentId);
    const name = await promptForInput('Agent Name', (v) => validateRequired(v, 'Agent Name'));
    const description = await promptForInput('Description', (v) => validateRequired(v, 'Description'));

    // Type
    const types = ['combined', 'daily', 'specialized', 'framework'];
    const type = await selectFromOptions('Select agent type:', types);

    // Version
    const version = await promptForInput('Version', null, '1.0');

    // Tags
    const tags = await promptForList(
        'Tags (for categorization and search):',
        [id, 'framework', 'frontend', 'backend', 'integration']
    );

    // Expertise area
    const expertiseArea = await promptForInput(
        'Expertise area (what this agent specializes in)',
        (v) => validateRequired(v, 'Expertise area')
    );

    // Technology/Framework
    const technology = await promptForInput(
        'Primary technology/framework',
        (v) => validateRequired(v, 'Technology/framework')
    );

    // Key principles
    console.log('\n📋 Agent Approach & Principles');
    console.log('Enter key principles this agent should follow (one per line, empty line to finish):');

    const principles = [];
    while (true) {
        const principle = await question('Principle: ');
        if (!principle.trim()) break;
        principles.push(principle.trim());
    }

    if (principles.length === 0) {
        principles.push('Follow best practices and conventions');
        principles.push('Integrate cleanly with CouchCMS');
        principles.push('Prioritize performance and security');
    }

    // Generate agent content
    const agentContent = generateAgentContent({
        id, name, type, version, description, tags, expertiseArea, technology, principles
    });

    // Determine agent directory based on type
    const agentDir = getAgentDirectory(id);
    const agentPath = join(agentDir, `${id}.md`);
    writeFileSync(agentPath, agentContent);
    console.log(`✅ Created agent: ${agentPath}`);

    // Update standards.md
    const updateStandards = (await question('Add to standards.md automatically? (Y/n): ')).toLowerCase() !== 'n';

    if (updateStandards) {
        try {
            updateStandardsFile(id);
            console.log('✅ Updated standards.md');
        } catch (error) {
            console.log(`⚠️ Could not update standards.md automatically: ${error.message}`);
            console.log(`Please add "${id}" to the agents list in standards.md manually.`);
        }
    }

    console.log('\n🎉 Agent created successfully!');
    console.log('\nNext steps:');
    console.log('1. Edit the agent file to add specific patterns and examples');
    console.log('2. Add common patterns, deep dive sections, and troubleshooting');
    console.log('3. Run `bun scripts/sync.js` to generate AI configs');
    console.log('4. Test the agent with `@' + id + '` syntax');

    rl.close();
}

function generateAgentContent({ id, name, type, version, description, tags, expertiseArea, technology, principles }) {
    const principlesList = principles.map(p => `- ${p}`).join('\n');

    return `---
name: ${name}
version: "${version}"
type: ${type}
description: ${description}
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---

# ${name}

You are a ${technology} expert specializing in ${expertiseArea} for CouchCMS projects.

---

## Quick Reference

### Key Concepts

| Concept | Description | Example |
|---------|-------------|---------|
| Concept 1 | What it does and when to use it | \`<example>code</example>\` |
| Concept 2 | What it does and when to use it | \`<example>code</example>\` |
| Concept 3 | What it does and when to use it | \`<example>code</example>\` |

### Common Commands/Patterns

| Pattern | Purpose | Usage |
|---------|---------|-------|
| Pattern 1 | What it accomplishes | \`command or code example\` |
| Pattern 2 | What it accomplishes | \`command or code example\` |
| Pattern 3 | What it accomplishes | \`command or code example\` |

### Your Approach

${principlesList}

---

## Common Patterns

### Pattern 1: Basic Implementation

\`\`\`html
<!-- Basic example with explanation -->
<div class="${id}-component">
    <h2>Basic Example</h2>
    <p>Implementation details here</p>
</div>
\`\`\`

**When to use**: Explain when this pattern is appropriate.

**CouchCMS Integration**:
\`\`\`php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />
<cms:block 'content'>
    <div class="${id}-component">
        <h1><cms:show k_page_title /></h1>
        <cms:show content />
    </div>
</cms:block>
<?php COUCH::invoke(); ?>
\`\`\`

### Pattern 2: Advanced Implementation

\`\`\`javascript
// More complex example
class ${name.replace(/\s+/g, '')}Component {
    constructor(options) {
        this.options = options;
        this.init();
    }

    init() {
        // Initialization logic
    }

    method() {
        // Method implementation
    }
}
\`\`\`

**When to use**: Explain when this advanced pattern is needed.

**With CouchCMS Data**:
\`\`\`html
<div class="${id}-advanced" data-config='<cms:show_json configuration />'>
    <cms:pages masterpage='${id}-template.php'>
        <div class="item" data-id="<cms:show k_page_id />">
            <h3><cms:show k_page_title /></h3>
            <p><cms:show content /></p>
        </div>
    </cms:pages>
</div>
\`\`\`

### Pattern 3: Form Handling

\`\`\`html
<cms:form method='post' class="${id}-form">
    <div class="form-group">
        <label for="field1">Field 1</label>
        <cms:input type='text' name='field1' required='1' />
    </div>

    <div class="form-group">
        <label for="field2">Field 2</label>
        <cms:input type='textarea' name='field2' />
    </div>

    <button type="submit">Submit</button>

    <cms:if k_success>
        <div class="success-message">
            Form submitted successfully!
        </div>
    </cms:if>
</cms:form>
\`\`\`

---

## Deep Dive

### Advanced Concepts

#### Concept 1: Advanced Feature

Detailed explanation of advanced concepts, including:

- When to use this feature
- How it integrates with CouchCMS
- Performance considerations
- Security implications

\`\`\`javascript
// Complex example with detailed comments
function advancedFeature(parameters) {
    // Step 1: Validation
    if (!validateParameters(parameters)) {
        throw new Error('Invalid parameters');
    }

    // Step 2: Processing
    const processed = processData(parameters);

    // Step 3: Integration with CouchCMS
    return integrateCouchCMS(processed);
}
\`\`\`

#### Concept 2: Integration Patterns

\`\`\`php
<?php
// PHP integration example
class CouchCMSIntegration {
    public function processData($data) {
        // Process data for CouchCMS
        return $processed_data;
    }

    public function saveToCouch($data) {
        // Save to CouchCMS database
        global $FUNCS;
        return $FUNCS->db_insert('${id}_table', $data);
    }
}
?>
\`\`\`

---

## Refactoring

### When to Refactor

Look for these warning signs:
- ⚠️ Code duplication across templates
- ⚠️ Inline styles instead of CSS classes
- ⚠️ Missing error handling
- ⚠️ Poor performance (slow loading, high memory usage)
- ⚠️ Accessibility issues
- ⚠️ Security vulnerabilities
- ⚠️ Outdated patterns or deprecated features

### Anti-Patterns to Fix

#### Anti-Pattern 1: Poor Structure

\`\`\`javascript
// ❌ Bad: Monolithic, hard to maintain
function doEverything() {
    // 100+ lines of mixed concerns
    validateInput();
    processData();
    updateUI();
    saveToDatabase();
}
\`\`\`

\`\`\`javascript
// ✅ Good: Separated concerns
class DataProcessor {
    validate(input) { /* validation logic */ }
    process(data) { /* processing logic */ }
    save(data) { /* persistence logic */ }
}

class UIManager {
    update(data) { /* UI update logic */ }
}
\`\`\`

#### Anti-Pattern 2: Security Issues

\`\`\`php
<!-- ❌ Bad: XSS vulnerability -->
<div><?php echo $_POST['user_input']; ?></div>

<!-- ✅ Good: Properly escaped -->
<div><?php echo htmlspecialchars($_POST['user_input'], ENT_QUOTES, 'UTF-8'); ?></div>
\`\`\`

### Refactoring Patterns

#### Extract Components

\`\`\`html
<!-- Before: Repeated code -->
<div class="${id}-card">
    <h3>Title 1</h3>
    <p>Content 1</p>
    <button>Action</button>
</div>
<div class="${id}-card">
    <h3>Title 2</h3>
    <p>Content 2</p>
    <button>Action</button>
</div>

<!-- After: Reusable component -->
<cms:embed 'components/${id}-card.html' title='Title 1' content='Content 1' />
<cms:embed 'components/${id}-card.html' title='Title 2' content='Content 2' />
\`\`\`

---

## Troubleshooting

### Common Problems

| Problem | Symptoms | Likely Cause | Solution |
|---------|----------|--------------|----------|
| Feature not working | No response, errors | Missing dependencies | Check all required files are loaded |
| Styling issues | Broken layout | CSS conflicts | Use more specific selectors |
| JavaScript errors | Console errors | Syntax or logic errors | Check browser console, fix errors |
| CouchCMS integration fails | Tags not rendering | Incorrect syntax | Verify CouchCMS tag syntax |
| Performance issues | Slow loading | Large files, many requests | Optimize assets, use caching |

### Debugging Workflow

1. **Identify the problem**
   - What exactly is not working?
   - When did it start happening?
   - What changed recently?

2. **Gather information**
   - Check browser console for errors
   - Inspect network tab for failed requests
   - Review recent code changes

3. **Isolate the issue**
   - Test with minimal example
   - Disable other features temporarily
   - Check if it works outside CouchCMS

4. **Fix and test**
   - Apply the fix
   - Test thoroughly
   - Verify no new issues introduced

### Debug Tools

\`\`\`javascript
// Debug helper functions
const debug = {
    log: (message, data) => {
        if (window.DEBUG_MODE) {
            console.log(\`[${id.toUpperCase()}] \${message}\`, data);
        }
    },

    error: (message, error) => {
        console.error(\`[${id.toUpperCase()}] \${message}\`, error);
    }
};
\`\`\`

### Getting Help

1. **Check documentation** - Review official docs and examples
2. **Search existing issues** - Look for similar problems online
3. **Create minimal test case** - Isolate the problem
4. **Ask specific questions** - Provide context and examples
5. **Share code samples** - Include relevant code snippets

---

## Resources

### Documentation
- [${technology} Documentation](https://example.com/docs)
- [CouchCMS Documentation](https://docs.couchcms.com)
- [API Reference](https://example.com/api)

### Examples
- [Code Examples](https://github.com/example/examples)
- [Live Demos](https://demo.example.com)
- [Starter Templates](https://templates.example.com)

### Community
- [GitHub Issues](https://github.com/example/issues)
- [Community Forum](https://forum.example.com)
- [Discord/Slack](https://discord.gg/example)

---

*This agent was generated by the CouchCMS AI Toolkit Agent Creator.*
*Please customize the content above with specific patterns, examples, and expertise for your domain.*
`;
}

function updateStandardsFile(agentId) {
    const standardsPath = 'standards.md';

    if (!existsSync(standardsPath)) {
        throw new Error('standards.md not found');
    }

    let content = readFileSync(standardsPath, 'utf8');

    // Find the agents section and add the new agent
    const agentsRegex = /(agents:\s*\n(?:  - [^\n]+\n)*)/;
    const match = content.match(agentsRegex);

    if (match) {
        const agentsSection = match[1];
        const newAgentsSection = agentsSection + `  - ${agentId}\n`;
        content = content.replace(agentsRegex, newAgentsSection);
    } else {
        // If agents section doesn't exist, add it
        const yamlEndRegex = /^---\s*$/m;
        const yamlEndMatch = content.match(yamlEndRegex);

        if (yamlEndMatch) {
            const insertPos = yamlEndMatch.index;
            const beforeYamlEnd = content.substring(0, insertPos);
            const afterYamlEnd = content.substring(insertPos);

            content = beforeYamlEnd + `\nagents:\n  - ${agentId}\n\n` + afterYamlEnd;
        } else {
            throw new Error('Could not find YAML frontmatter in standards.md');
        }
    }

    writeFileSync(standardsPath, content);
}

// Run the script
createAgent().catch(console.error);
