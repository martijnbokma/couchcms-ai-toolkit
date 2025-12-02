#!/usr/bin/env bun

/**
 * Interactive Module Creator
 * Creates a new knowledge module with guided prompts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { getCouchCMSModules } from './lib/option-organizer.js';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function findModulePath(moduleName) {
    const couchcmsModules = getCouchCMSModules();
    const subdir = couchcmsModules.includes(moduleName) ? 'core' : 'frontend';

    // Try subdirectory first
    const subdirPath = join('modules', subdir, `${moduleName}.md`);
    if (existsSync(subdirPath)) {
        return subdirPath;
    }

    // Fallback to root (legacy support)
    const rootPath = join('modules', `${moduleName}.md`);
    if (existsSync(rootPath)) {
        return rootPath;
    }

    return null;
}

function getModuleDirectory(moduleName) {
    const couchcmsModules = getCouchCMSModules();
    const subdir = couchcmsModules.includes(moduleName) ? 'core' : 'frontend';
    return join('modules', subdir);
}

function validateModuleId(id) {
    if (!id) return 'Module ID is required';
    if (!/^[a-z0-9-]+$/.test(id)) return 'Module ID must contain only lowercase letters, numbers, and hyphens';
    if (findModulePath(id)) return 'Module already exists';
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

async function createModule() {
    console.log('🚀 CouchCMS AI Toolkit - Module Creator\n');

    // Basic Information
    const id = await promptForInput('Module ID (kebab-case)', validateModuleId);
    const name = await promptForInput('Module Name', (v) => validateRequired(v, 'Module Name'));
    const description = await promptForInput('Description', (v) => validateRequired(v, 'Description'));

    // Category
    const categories = ['frontend', 'backend', 'content', 'development', 'integration'];
    const category = await selectFromOptions('Select category:', categories);

    // Version
    const version = await promptForInput('Version', null, '1.0');

    // Dependencies
    const requires = await promptForList(
        'Required modules (dependencies):',
        ['couchcms-core', 'tailwindcss', 'alpinejs']
    );

    const conflicts = await promptForList(
        'Conflicting modules:',
        ['bootstrap', 'jquery-ui']
    );

    // Advanced options
    const createSkillRules = (await question('Create skill rules for Claude Code auto-activation? (y/N): ')).toLowerCase() === 'y';

    let keywords = [];
    let intentPatterns = [];
    let filePatterns = [];
    let contentPatterns = [];

    if (createSkillRules) {
        console.log('\n📋 Skill Rules Configuration');

        keywords = await promptForList(
            'Keywords that should trigger this module:',
            [id, name.toLowerCase(), 'setup', 'configure']
        );

        intentPatterns = await promptForList(
            'Intent patterns (regex patterns):',
            [`(create|build|make).*?(${id})`, `(setup|configure).*?(${name.toLowerCase()})`]
        );

        filePatterns = await promptForList(
            'File path patterns:',
            ['**/*.html', '**/*.php', 'components/**/*']
        );

        contentPatterns = await promptForList(
            'Content patterns (what to look for in files):',
            [`${id}-`, `class.*${id}`, `import.*${id}`]
        );
    }

    // Generate module content
    const moduleContent = generateModuleContent({
        id, name, category, version, description, requires, conflicts
    });

    // Determine module directory based on type
    const moduleDir = getModuleDirectory(id);
    const modulePath = join(moduleDir, `${id}.md`);
    writeFileSync(modulePath, moduleContent);
    console.log(`✅ Created module: ${modulePath}`);

    // Generate skill rules if requested
    if (createSkillRules) {
        const skillRules = generateSkillRules({
            id, name, description, keywords, intentPatterns, filePatterns, contentPatterns
        });

        const skillRulesPath = join(moduleDir, `${id}.skill-rules.json`);
        writeFileSync(skillRulesPath, JSON.stringify(skillRules, null, 2));
        console.log(`✅ Created skill rules: ${skillRulesPath}`);
    }

    // Update standards.md
    const updateStandards = (await question('Add to standards.md automatically? (Y/n): ')).toLowerCase() !== 'n';

    if (updateStandards) {
        try {
            updateStandardsFile(id);
            console.log('✅ Updated standards.md');
        } catch (error) {
            console.log(`⚠️ Could not update standards.md automatically: ${error.message}`);
            console.log(`Please add "${id}" to the modules list in standards.md manually.`);
        }
    }

    console.log('\n🎉 Module created successfully!');
    console.log('\nNext steps:');
    console.log('1. Edit the module file to add your content');
    console.log('2. Run `bun scripts/sync.js` to generate AI configs');
    console.log('3. Test the module with `bun scripts/validate.js`');

    rl.close();
}

function generateModuleContent({ id, name, category, version, description, requires, conflicts }) {
    return `---
id: ${id}
name: "${name}"
category: "${category}"
version: "${version}"
description: "${description}"
required: false
requires: [${requires.map(r => `"${r}"`).join(', ')}]
conflicts: [${conflicts.map(c => `"${c}"`).join(', ')}]
---

# ${name}

## Overview

${description}

## Installation

### Via CDN

\`\`\`html
<!-- Add CDN links here -->
<script src="https://cdn.example.com/${id}.js"></script>
<link rel="stylesheet" href="https://cdn.example.com/${id}.css">
\`\`\`

### Via Package Manager

\`\`\`bash
bun add ${id}
# or
npm install ${id}
\`\`\`

## Core Concepts

### Key Concept 1

Explanation of the first key concept.

\`\`\`html
<!-- Example code -->
<div class="${id}-component">
  <h2>Example</h2>
  <p>Content here</p>
</div>
\`\`\`

### Key Concept 2

Explanation of the second key concept.

\`\`\`javascript
// JavaScript example
const ${id.replace(/-/g, '')} = new ${name.replace(/\s+/g, '')}();
\`\`\`

## Common Patterns

### Basic Usage

\`\`\`html
<div class="${id}-basic">
  <h3>Basic Example</h3>
  <p>Basic usage pattern</p>
</div>
\`\`\`

### Advanced Usage

\`\`\`html
<div class="${id}-advanced" data-config='{"option": "value"}'>
  <div class="${id}-header">
    <h3>Advanced Example</h3>
  </div>
  <div class="${id}-body">
    <p>Advanced usage pattern</p>
  </div>
</div>
\`\`\`

## CouchCMS Integration

### Template Structure

\`\`\`php
<?php require_once('couch/cms.php'); ?>
<cms:extends 'layouts/base.html' />

<cms:block 'templates'>
    <cms:template title='${name} Template' clonable='1'>
        <cms:editable name='title' type='text' />
        <cms:editable name='content' type='richtext' />
    </cms:template>
</cms:block>

<cms:block 'content'>
    <div class="${id}-component">
        <h1><cms:show title /></h1>
        <div class="content">
            <cms:show content />
        </div>
    </div>
</cms:block>

<?php COUCH::invoke(); ?>
\`\`\`

### List View Integration

\`\`\`html
<!-- snippets/${id}-list.html -->
<cms:pages masterpage='${id}-template.php' limit='10'>
    <div class="${id}-card">
        <h3><a href="<cms:show k_page_link />"><cms:show title /></a></h3>
        <p><cms:show content /></p>
        <div class="meta">
            <span>Published: <cms:date k_page_date format='F j, Y' /></span>
        </div>
    </div>
</cms:pages>
\`\`\`

## Best Practices

### DO

- ✅ Use semantic HTML structure
- ✅ Follow accessibility guidelines (WCAG 2.1 AA)
- ✅ Test across different browsers
- ✅ Optimize for performance
- ✅ Use consistent naming conventions

### DON'T

- ❌ Mix conflicting frameworks
- ❌ Use inline styles extensively
- ❌ Ignore mobile responsiveness
- ❌ Skip error handling
- ❌ Hardcode values that should be configurable

## Troubleshooting

### Common Issues

| Problem | Symptoms | Cause | Solution |
|---------|----------|-------|----------|
| Component not loading | No visual changes | Missing CSS/JS files | Check file paths and network tab |
| Styling conflicts | Broken layout | CSS conflicts | Use more specific selectors |
| JavaScript errors | Console errors | Syntax or logic errors | Check browser console and fix errors |

### Debug Tips

1. Check browser console for JavaScript errors
2. Inspect network tab for failed resource loads
3. Validate HTML to ensure proper structure
4. Test without CouchCMS to isolate issues
5. Use browser dev tools to debug CSS issues

## Resources

### Documentation
- [Official Documentation](https://example.com/docs)
- [API Reference](https://example.com/api)
- [Examples](https://example.com/examples)

### Community
- [GitHub Repository](https://github.com/example/${id})
- [Community Forum](https://forum.example.com)

---

*This module was generated by the CouchCMS AI Toolkit Module Creator.*
*Please customize the content above with your specific framework/library information.*
`;
}

function generateSkillRules({ id, name, description, keywords, intentPatterns, filePatterns, contentPatterns }) {
    return {
        [id]: {
            type: "framework",
            enforcement: "suggest",
            priority: "medium",
            description: description,
            promptTriggers: {
                keywords: keywords,
                intentPatterns: intentPatterns
            },
            fileTriggers: {
                pathPatterns: filePatterns,
                contentPatterns: contentPatterns
            },
            preflightChecks: [
                {
                    pattern: `${id}-deprecated-syntax`,
                    severity: "warning",
                    message: `⚠️ This ${name} syntax is deprecated. Use the new syntax instead.`
                }
            ]
        }
    };
}

function updateStandardsFile(moduleId) {
    const standardsPath = 'standards.md';

    if (!existsSync(standardsPath)) {
        throw new Error('standards.md not found');
    }

    let content = readFileSync(standardsPath, 'utf8');

    // Find the modules section and add the new module
    const modulesRegex = /(modules:\s*\n(?:  - [^\n]+\n)*)/;
    const match = content.match(modulesRegex);

    if (match) {
        const modulesSection = match[1];
        const newModulesSection = modulesSection + `  - ${moduleId}\n`;
        content = content.replace(modulesRegex, newModulesSection);
    } else {
        // If modules section doesn't exist, add it
        const yamlEndRegex = /^---\s*$/m;
        const yamlEndMatch = content.match(yamlEndRegex);

        if (yamlEndMatch) {
            const insertPos = yamlEndMatch.index;
            const beforeYamlEnd = content.substring(0, insertPos);
            const afterYamlEnd = content.substring(insertPos);

            content = beforeYamlEnd + `\nmodules:\n  - ${moduleId}\n\n` + afterYamlEnd;
        } else {
            throw new Error('Could not find YAML frontmatter in standards.md');
        }
    }

    writeFileSync(standardsPath, content);
}

// Run the script
createModule().catch(console.error);
