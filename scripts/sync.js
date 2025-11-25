#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Sync Script
 * 
 * Generates editor configurations from project.md and toolkit modules.
 * 
 * Usage:
 *   bun ai-toolkit/scripts/sync.js
 *   bun ~/couchcms-ai-toolkit/scripts/sync.js
 */

import matter from 'gray-matter';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOOLKIT_ROOT = resolve(__dirname, '..');

// Default configuration
const DEFAULTS = {
    indentation: 4,
    language: 'english',
    lineLength: 120
};

/**
 * Find project.md in current directory or parent directories
 */
function findProjectFile(startDir = process.cwd()) {
    let currentDir = startDir;
    const possibleNames = ['project.md', 'PROJECT.md'];
    
    while (currentDir !== '/') {
        for (const name of possibleNames) {
            const projectPath = join(currentDir, name);
            if (existsSync(projectPath)) {
                return projectPath;
            }
        }
        currentDir = dirname(currentDir);
    }
    
    return null;
}

/**
 * Resolve toolkit path from project config
 */
function resolveToolkitPath(configPath) {
    if (!configPath) {
        return TOOLKIT_ROOT;
    }
    
    // Expand ~ to home directory
    if (configPath.startsWith('~')) {
        configPath = configPath.replace('~', process.env.HOME);
    }
    
    // Resolve relative paths from project directory
    if (!configPath.startsWith('/')) {
        configPath = resolve(process.cwd(), configPath);
    }
    
    return configPath;
}

/**
 * Load a module from the toolkit
 */
function loadModule(moduleName, toolkitPath) {
    const modulePath = join(toolkitPath, 'modules', `${moduleName}.md`);
    
    if (!existsSync(modulePath)) {
        console.warn(`⚠️  Module not found: ${moduleName}`);
        return null;
    }
    
    const fileContent = readFileSync(modulePath, 'utf8');
    const { data: meta, content } = matter(fileContent);
    
    return { meta, content, name: moduleName };
}

/**
 * Check for module conflicts
 */
function checkConflicts(modules) {
    const moduleNames = modules.map(m => m.name);
    const errors = [];
    
    for (const mod of modules) {
        if (mod.meta.conflicts) {
            for (const conflict of mod.meta.conflicts) {
                if (moduleNames.includes(conflict)) {
                    errors.push(`❌ Conflict: ${mod.name} cannot be used with ${conflict}`);
                }
            }
        }
        
        if (mod.meta.requires) {
            for (const required of mod.meta.requires) {
                if (!moduleNames.includes(required)) {
                    errors.push(`❌ Missing dependency: ${mod.name} requires ${required}`);
                }
            }
        }
    }
    
    return errors;
}

/**
 * Generate the combined configuration content
 */
function generateContent(config, modules, projectRules) {
    const timestamp = new Date().toISOString();
    const moduleNames = modules.map(m => m.name).join(', ');
    
    let content = `# AI Coding Standards
# Project: ${config.name || 'Unnamed Project'}
# Generated: ${timestamp}
# Modules: ${moduleNames}

## Project Context

- **Name**: ${config.name || 'Unnamed'}
- **Description**: ${config.description || 'No description'}
- **Type**: CouchCMS Web Application

## Core Standards

- **Indentation**: ${config.overrides?.indentation || DEFAULTS.indentation} spaces
- **Language**: ${config.overrides?.language || DEFAULTS.language} only for all code and content
- **Line Length**: ${config.overrides?.lineLength || DEFAULTS.lineLength} characters

---

`;

    // Add each module's content
    for (const mod of modules) {
        content += `\n${mod.content}\n\n---\n`;
    }
    
    // Add project-specific rules
    if (projectRules && projectRules.trim()) {
        content += `\n# Project-Specific Rules\n\n${projectRules}\n`;
    }
    
    return content;
}

/**
 * Main sync function
 */
async function sync() {
    console.log('🔄 CouchCMS AI Toolkit - Sync\n');
    
    // Find project.md
    const projectPath = findProjectFile();
    
    if (!projectPath) {
        console.error('❌ No project.md found in current directory or parent directories.');
        console.log('\nCreate a project.md file with:\n');
        console.log(`---
name: "my-project"
description: "Project description"
toolkit: "./ai-toolkit"
modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
---

# Project-Specific Rules

Add your project-specific instructions here...
`);
        process.exit(1);
    }
    
    console.log(`📄 Found: ${projectPath}`);
    
    // Parse project.md
    const projectContent = readFileSync(projectPath, 'utf8');
    const { data: config, content: projectRules } = matter(projectContent);
    
    console.log(`📦 Project: ${config.name || 'Unnamed'}`);
    
    // Resolve toolkit path
    const toolkitPath = resolveToolkitPath(config.toolkit);
    console.log(`🛠️  Toolkit: ${toolkitPath}`);
    
    // Ensure couchcms-core is always included
    const moduleList = config.modules || ['couchcms-core'];
    if (!moduleList.includes('couchcms-core')) {
        moduleList.unshift('couchcms-core');
    }
    
    console.log(`📚 Modules: ${moduleList.join(', ')}`);
    
    // Load modules
    const modules = moduleList
        .map(name => loadModule(name, toolkitPath))
        .filter(Boolean);
    
    // Check for conflicts
    const conflicts = checkConflicts(modules);
    if (conflicts.length > 0) {
        console.log('\n');
        conflicts.forEach(c => console.log(c));
        process.exit(1);
    }
    
    // Generate content
    const content = generateContent(config, modules, projectRules);
    
    // Write editor configurations
    const projectDir = dirname(projectPath);
    
    // .cursorrules
    writeFileSync(join(projectDir, '.cursorrules'), content);
    console.log('✅ Generated: .cursorrules');
    
    // CLAUDE.md
    writeFileSync(join(projectDir, 'CLAUDE.md'), content);
    console.log('✅ Generated: CLAUDE.md');
    
    // .github/copilot-instructions.md
    const githubDir = join(projectDir, '.github');
    if (!existsSync(githubDir)) {
        mkdirSync(githubDir, { recursive: true });
    }
    writeFileSync(join(githubDir, 'copilot-instructions.md'), content);
    console.log('✅ Generated: .github/copilot-instructions.md');
    
    // AGENT.md
    writeFileSync(join(projectDir, 'AGENT.md'), `# Universal AI Agent Instructions

This project uses the CouchCMS AI Toolkit for consistent AI agent behavior.

## Configuration

All AI coding agents follow the rules generated from:
- \`project.md\` - Project-specific configuration
- Toolkit modules from: ${toolkitPath}

## Modules Active

${modules.map(m => `- **${m.meta.name}** (v${m.meta.version}): ${m.meta.description}`).join('\n')}

## Regenerate

\`\`\`bash
bun ${toolkitPath}/scripts/sync.js
\`\`\`

## Key Standards

- **Indentation**: ${config.overrides?.indentation || DEFAULTS.indentation} spaces
- **Language**: ${config.overrides?.language || DEFAULTS.language} only
- **Modules**: ${moduleList.join(', ')}

If any conflict exists between configurations, \`project.md\` always wins.
`);
    console.log('✅ Generated: AGENT.md');
    
    console.log(`\n✨ Sync complete! ${modules.length} modules loaded.\n`);
}

// Run
sync().catch(console.error);
