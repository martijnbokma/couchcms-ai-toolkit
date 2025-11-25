#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Init Script
 *
 * Interactive setup wizard for new projects
 *
 * Usage:
 *   bun ai-toolkit/scripts/init.js
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

/**
 * Read input from stdin
 */
async function prompt(question, defaultValue = '') {
    process.stdout.write(`${question}${defaultValue ? ` [${defaultValue}]` : ''}: `)

    return new Promise(resolve => {
        process.stdin.once('data', data => {
            const input = data.toString().trim()
            resolve(input || defaultValue)
        })
    })
}

/**
 * Confirm yes/no question
 */
async function confirm(question, defaultYes = true) {
    const suffix = defaultYes ? ' [Y/n]' : ' [y/N]'
    const answer = await prompt(question + suffix)

    if (!answer) {
        return defaultYes
    }

    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

/**
 * Main init function
 */
async function init() {
    console.log('🚀 CouchCMS AI Toolkit - Interactive Setup\n')

    const projectDir = process.cwd()

    // Check for existing config files
    const { findConfigFile, hasStandards } = await import('./utils.js')
    const existingConfig = findConfigFile(projectDir)
    const hasStandardsFile = hasStandards(projectDir)

    if (existingConfig) {
        const configName = existingConfig.includes('standards.md') ? 'standards.md' : 'project.md'
        console.log(`⚠️  ${configName} already exists in this directory\n`)
        const overwrite = await confirm(`Overwrite existing ${configName}?`, false)

        if (!overwrite) {
            console.log('\n❌ Setup cancelled\n')
            process.exit(0)
        }
    }

    console.log("Let's set up your project configuration...\n")

    // Ask if user wants standards.md (recommended) or project.md (legacy)
    console.log('📋 Configuration file format:')
    console.log('  1. standards.md (recommended - single source of truth)')
    console.log('  2. project.md (legacy format)')
    const configChoice = await prompt('Choice [1-2]', '1')
    const useStandards = configChoice === '1'

    // Gather project information
    const projectName = await prompt('Project name', 'my-project')
    const projectDescription = await prompt('Project description', 'My CouchCMS project')

    // Determine toolkit path
    console.log('\n📦 How do you want to use the toolkit?')
    console.log('  1. As a git submodule (recommended)')
    console.log('  2. Cloned in home directory')
    const toolkitChoice = await prompt('Choice [1-2]', '1')

    const toolkitPath = toolkitChoice === '2' ? '~/couchcms-ai-toolkit' : './ai-toolkit-shared'

    // Determine config file location
    let configPath
    let configDir

    if (useStandards) {
        console.log('\n📁 Where should standards.md be created?')
        console.log('  1. .project/standards.md (recommended - project config directory)')
        console.log('  2. docs/standards.md (documentation location)')
        console.log('  3. standards.md (root directory)')
        const locationChoice = await prompt('Choice [1-3]', '1')

        if (locationChoice === '1') {
            configPath = join(projectDir, '.project', 'standards.md')
            configDir = join(projectDir, '.project')
        } else if (locationChoice === '2') {
            configPath = join(projectDir, 'docs', 'standards.md')
            configDir = join(projectDir, 'docs')
        } else {
            configPath = join(projectDir, 'standards.md')
            configDir = projectDir
        }
    } else {
        configPath = join(projectDir, 'project.md')
        configDir = projectDir
    }

    // Select modules
    console.log('\n📚 Select modules to include:')

    const availableModules = [
        { name: 'couchcms-core', description: 'Core CouchCMS patterns (always included)', required: true },
        { name: 'tailwindcss', description: 'TailwindCSS 4 patterns' },
        { name: 'daisyui', description: 'daisyUI 5 components' },
        { name: 'alpinejs', description: 'Alpine.js integration' },
        { name: 'typescript', description: 'TypeScript standards' },
        { name: 'databound-forms', description: 'DataBound Forms' },
    ]

    const selectedModules = ['couchcms-core']

    for (const mod of availableModules) {
        if (mod.required) {
            console.log(`   ✓ ${mod.name} - ${mod.description}`)
            continue
        }

        const include = await confirm(`   Include ${mod.name}? (${mod.description})`, true)
        if (include) {
            selectedModules.push(mod.name)
        }
    }

    // Select agents
    console.log('\n🤖 Select AI agents to include:')

    const availableAgents = [
        { name: 'couchcms', description: 'Core CouchCMS development' },
        { name: 'databound-forms', description: 'Forms and CRUD' },
        { name: 'alpinejs', description: 'Alpine.js development' },
        { name: 'tailwindcss', description: 'TailwindCSS styling' },
        { name: 'typescript', description: 'TypeScript development' },
    ]

    const selectedAgents = []

    for (const agent of availableAgents) {
        const include = await confirm(`   Include ${agent.name}? (${agent.description})`, true)
        if (include) {
            selectedAgents.push(agent.name)
        }
    }

    // Context directory
    const useContext = await confirm('\n📋 Create project context directory?', true)
    const contextPath = useContext ? '.project/ai' : null

    // Generate config file
    if (useStandards) {
        // Create docs directory if needed
        if (configDir !== projectDir && !existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true })
            console.log(`✅ Created: ${configDir}/`)
        }

        const configFileName = configPath.includes('.project/')
            ? '.project/standards.md'
            : configPath.includes('docs/')
              ? 'docs/standards.md'
              : 'standards.md'

        console.log(`\n📝 Generating ${configFileName}...`)

        // Load standards.md template
        const templatePath = join(TOOLKIT_ROOT, 'templates', 'standards.md')
        let standardsMd = readFileSync(templatePath, 'utf8')

        // Replace template variables
        standardsMd = standardsMd
            .replace(/"my-project"/g, `"${projectName}"`)
            .replace(/Brief description of your project/g, projectDescription)
            .replace(/"\.\/ai-toolkit"/g, `"${toolkitPath}"`)
            .replace(
                /modules:\n    - couchcms-core\n    - tailwindcss\n    - daisyui\n    - alpinejs\n    - typescript\n    - databound-forms/g,
                `modules:\n${selectedModules.map(m => `    - ${m}`).join('\n')}`
            )

        // Add agents to YAML if selected
        if (selectedAgents.length > 0) {
            const agentsYaml = selectedAgents.map(a => `    - ${a}`).join('\n')
            standardsMd = standardsMd.replace(
                /agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true/g,
                `agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true\n\n# === ACTIVE AGENTS ===\nactive_agents:\n${agentsYaml}`
            )
        }

        writeFileSync(configPath, standardsMd)
        console.log(`✅ Created: ${configFileName}`)
    } else {
        // Generate project.md (legacy)
        console.log('\n📝 Generating project.md...')

        const projectMd = `---
name: "${projectName}"
description: "${projectDescription}"
toolkit: "${toolkitPath}"

modules:
${selectedModules.map(m => `  - ${m}`).join('\n')}

${selectedAgents.length > 0 ? `agents:\n${selectedAgents.map(a => `  - ${a}`).join('\n')}\n` : ''}${contextPath ? `context: "${contextPath}"\n` : ''}
---

# ${projectName}

## Project-Specific Rules

Add your project-specific coding rules and guidelines here.

## Technical Decisions

Document key technical decisions:

- Why did we choose certain technologies?
- What are the trade-offs?
- What should be avoided?

## Code Examples

Add project-specific code examples that demonstrate your preferred patterns.
`

        writeFileSync(configPath, projectMd)
        console.log('✅ Created: project.md')
    }

    // Create context directory if requested
    if (contextPath) {
        const fullContextPath = join(projectDir, contextPath)

        if (!existsSync(fullContextPath)) {
            mkdirSync(fullContextPath, { recursive: true })
            console.log(`✅ Created: ${contextPath}/`)

            // Create context.md template
            const contextMd = `---
name: ${projectName} Context
---

# ${projectName} - Project Context

## Content Types

Describe your project's content types here:

- **Type 1**: Description
- **Type 2**: Description

## Architecture

Describe your project's architecture:

- Frontend: Technologies used
- Backend: Technologies used
- Integrations: External services

## Common Patterns

Document common patterns used in this project:

### Pattern 1

\`\`\`php
// Example code
\`\`\`

### Pattern 2

\`\`\`javascript
// Example code
\`\`\`

## Workflows

Document common development workflows:

1. **Adding a new content type**
   - Steps...

2. **Deploying changes**
   - Steps...
`

            writeFileSync(join(fullContextPath, 'context.md'), contextMd)
            console.log(`✅ Created: ${contextPath}/context.md`)
        }
    }

    // Run sync
    console.log('\n🔄 Running initial sync...\n')

    try {
        const syncScript = join(TOOLKIT_ROOT, 'scripts', 'sync.js')

        if (existsSync(syncScript)) {
            // Execute sync script
            const { spawnSync } = await import('child_process')
            const result = spawnSync('bun', [syncScript], {
                cwd: projectDir,
                stdio: 'inherit',
            })

            if (result.status !== 0) {
                console.log('\n⚠️  Sync completed with warnings')
            }
        } else {
            console.log('⚠️  Sync script not found. Run manually with: bun run sync')
        }
    } catch (error) {
        console.log(`⚠️  Could not run sync automatically: ${error.message}`)
        console.log('Run manually with: bun run sync')
    }

    // Success message
    console.log('\n' + '='.repeat(60))
    console.log('\n✨ Setup complete!\n')
    console.log('Next steps:\n')

    const configFileName = useStandards
        ? configPath.includes('docs/')
            ? 'docs/standards.md'
            : 'standards.md'
        : 'project.md'

    console.log(`  1. Review and customize ${configFileName}`)

    if (contextPath) {
        console.log(`  2. Add project-specific details to ${contextPath}/context.md`)
    }

    console.log('  3. Run "bun run sync" to generate AI configurations')
    console.log('  4. Run "bun run validate" to check setup\n')

    if (useStandards) {
        console.log('💡 Tip: standards.md is now the single source of truth for all AI agents!\n')
    }

    console.log('Happy coding! 🎉\n')

    process.exit(0)
}

// Setup stdin for interactive input
process.stdin.setEncoding('utf8')
process.stdin.setRawMode(false)

// Run
init().catch(error => {
    console.error('❌ Setup error:', error.message)
    process.exit(1)
})
