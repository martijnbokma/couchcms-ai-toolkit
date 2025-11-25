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
    const projectMdPath = join(projectDir, 'project.md')

    // Check if project.md already exists
    if (existsSync(projectMdPath)) {
        console.log('⚠️  project.md already exists in this directory\n')
        const overwrite = await confirm('Overwrite existing project.md?', false)

        if (!overwrite) {
            console.log('\n❌ Setup cancelled\n')
            process.exit(0)
        }
    }

    console.log("Let's set up your project configuration...\n")

    // Gather project information
    const projectName = await prompt('Project name', 'my-project')
    const projectDescription = await prompt('Project description', 'My CouchCMS project')

    // Determine toolkit path
    console.log('\n📦 How do you want to use the toolkit?')
    console.log('  1. As a git submodule (recommended)')
    console.log('  2. Cloned in home directory')
    const toolkitChoice = await prompt('Choice [1-2]', '1')

    const toolkitPath = toolkitChoice === '2' ? '~/couchcms-ai-toolkit' : './ai-toolkit-shared'

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

    // Generate project.md
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

    writeFileSync(projectMdPath, projectMd)
    console.log('✅ Created: project.md')

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
    console.log('  1. Review and customize project.md')

    if (contextPath) {
        console.log(`  2. Add project-specific details to ${contextPath}/context.md`)
    }

    console.log('  3. Run "bun run sync" to generate AI configurations')
    console.log('  4. Run "bun run validate" to check setup\n')
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
