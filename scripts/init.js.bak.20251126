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
import { join, resolve, dirname, basename } from 'path'
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

    let projectDir = process.cwd()

    // Detect if running from toolkit directory (ai-toolkit-shared)
    // If so, use parent directory as project root
    const currentDirName = basename(projectDir)
    const hasToolkitStructure = existsSync(join(projectDir, 'modules')) &&
                                 existsSync(join(projectDir, 'scripts')) &&
                                 existsSync(join(projectDir, 'templates'))

    if (currentDirName === 'ai-toolkit-shared' || hasToolkitStructure) {
        const originalDir = projectDir
        projectDir = dirname(projectDir)
        console.log(`📁 Detected toolkit directory, using parent as project root`)
        console.log(`   Toolkit: ${originalDir}`)
        console.log(`   Project: ${projectDir}\n`)
    }

    // Check for existing config files
    const { findConfigFile, hasStandards, getConfigFileName } = await import('./utils.js')
    const existingConfig = findConfigFile(projectDir)
    const hasStandardsFile = hasStandards(projectDir)

    if (existingConfig) {
        const configName = getConfigFileName(projectDir) || 'standards.md'
        console.log(`⚠️  ${configName} already exists in this directory\n`)
        const overwrite = await confirm(`Overwrite existing ${configName}?`, false)

        if (!overwrite) {
            console.log('\n❌ Setup cancelled\n')
            process.exit(0)
        }
    }

    console.log("Let's set up your project configuration...\n")

    // Ask for setup mode
    console.log('🎯 Setup mode:')
    console.log('  1. Simple (recommended for beginners) - Uses defaults, minimal questions')
    console.log('  2. Custom - Full control over all options')
    const modeChoice = await prompt('Choice [1-2]', '1')
    const simpleMode = modeChoice === '1'

    // In simple mode, use standards.md in .project/ directory
    const useStandards = true
    let configPath, configDir

    let frameworkConfig = null

    if (simpleMode) {
        // Simple mode: use recommended defaults
        configPath = join(projectDir, '.project', 'standards.md')
        configDir = join(projectDir, '.project')
        console.log('\n✨ Simple mode: Using recommended defaults')
        console.log('   - Configuration: .project/standards.md')
        console.log('   - Modules: Standard preset (core + tailwindcss + alpinejs)')
        console.log('   - Agents: Standard preset (couchcms + tailwindcss + alpinejs)')
        console.log('   - Framework: Disabled (can be enabled later in standards.md)')
        frameworkConfig = false
    } else {
        // Custom mode: ask for configuration file location
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
    }

    // Gather project information
    const projectName = await prompt('Project name', 'my-project')
    const projectDescription = await prompt('Project description', 'My CouchCMS project')

    // Determine toolkit path (only ask in custom mode)
    let toolkitPath = './ai-toolkit-shared'
    if (!simpleMode) {
        console.log('\n📦 How do you want to use the toolkit?')
        console.log('  1. As a git submodule (recommended)')
        console.log('  2. Cloned in home directory')
        const toolkitChoice = await prompt('Choice [1-2]', '1')
        toolkitPath = toolkitChoice === '2' ? '~/couchcms-ai-toolkit' : './ai-toolkit-shared'
    }

    // Select modules
    let selectedModules, selectedAgents, contextPath

    if (simpleMode) {
        // Simple mode: use standard preset
        selectedModules = ['couchcms-core', 'tailwindcss', 'alpinejs']
        selectedAgents = ['couchcms', 'tailwindcss', 'alpinejs']
        contextPath = null // Don't create context directory in simple mode
        console.log('\n📚 Using standard module preset:')
        console.log('   ✓ couchcms-core - Core CouchCMS patterns')
        console.log('   ✓ tailwindcss - TailwindCSS 4 patterns')
        console.log('   ✓ alpinejs - Alpine.js integration')
        console.log('\n🤖 Using standard agent preset:')
        console.log('   ✓ couchcms - Core CouchCMS development')
        console.log('   ✓ tailwindcss - TailwindCSS styling')
        console.log('   ✓ alpinejs - Alpine.js development')
    } else {
        // Custom mode: ask for preset or individual selection
        console.log('\n📚 Module selection:')
        console.log('  1. Minimal (only couchcms-core)')
        console.log('  2. Standard (core + tailwindcss + alpinejs)')
        console.log('  3. Full (all modules)')
        console.log('  4. Custom (choose individually)')
        const modulePreset = await prompt('Choice [1-4]', '2')

        const availableModules = [
            { name: 'couchcms-core', description: 'Core CouchCMS patterns (always included)', required: true },
            { name: 'tailwindcss', description: 'TailwindCSS 4 patterns' },
            { name: 'daisyui', description: 'daisyUI 5 components' },
            { name: 'alpinejs', description: 'Alpine.js integration' },
            { name: 'typescript', description: 'TypeScript standards' },
            { name: 'databound-forms', description: 'DataBound Forms' },
            { name: 'folders', description: 'Virtual folders and nested pages' },
            { name: 'archives', description: 'Archive views by time periods' },
            { name: 'relationships', description: 'Page relationships and related content' },
            { name: 'repeatable-regions', description: 'Dynamic repeatable content blocks' },
            { name: 'search', description: 'Fulltext search with MySQL' },
            { name: 'pagination', description: 'Pagination for pages and results' },
            { name: 'custom-routes', description: 'Custom URL routing' },
            { name: 'users', description: 'User management and access control' },
            { name: 'comments', description: 'Comment system with moderation' },
        ]

        selectedModules = ['couchcms-core']

        if (modulePreset === '1') {
            // Minimal - already set
        } else if (modulePreset === '2') {
            selectedModules.push('tailwindcss', 'alpinejs')
        } else if (modulePreset === '3') {
            // Full: all modules
            selectedModules.push(
                'tailwindcss',
                'daisyui',
                'alpinejs',
                'typescript',
                'databound-forms',
                'folders',
                'archives',
                'relationships',
                'repeatable-regions',
                'search',
                'pagination',
                'custom-routes',
                'users',
                'comments'
            )
        } else {
            // Custom: ask individually
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
        }

        // Select agents
        console.log('\n🤖 Agent selection:')
        console.log('  1. Minimal (only couchcms)')
        console.log('  2. Standard (couchcms + tailwindcss + alpinejs)')
        console.log('  3. Full (all agents)')
        console.log('  4. Custom (choose individually)')
        const agentPreset = await prompt('Choice [1-4]', '2')

        const availableAgents = [
            { name: 'couchcms', description: 'Core CouchCMS development' },
            { name: 'databound-forms', description: 'Forms and CRUD operations' },
            { name: 'alpinejs', description: 'Alpine.js development' },
            { name: 'tailwindcss', description: 'TailwindCSS styling' },
            { name: 'typescript', description: 'TypeScript development' },
            { name: 'search', description: 'Fulltext search implementation' },
            { name: 'pagination', description: 'Pagination controls' },
            { name: 'relationships', description: 'Page relationships' },
            { name: 'views', description: 'Template views (List, Page, Folder, Archive)' },
            { name: 'comments', description: 'Comment system with moderation' },
            { name: 'users', description: 'User management and access control' },
            { name: 'folders', description: 'Virtual folders for content organization' },
            { name: 'repeatable-regions', description: 'Dynamic repeatable content blocks' },
            { name: 'photo-gallery', description: 'Photo gallery with batch upload' },
            { name: 'rss-feeds', description: 'RSS feed generation' },
            { name: 'archives', description: 'Archive views by time periods' },
            { name: 'nested-pages', description: 'Hierarchical page structures' },
            { name: 'on-page-editing', description: 'Frontend inline editing' },
            { name: 'admin-panel-theming', description: 'Admin panel customization' },
            { name: 'custom-routes', description: 'Clean URLs and routing' },
            { name: 'mysql', description: 'Database operations' },
            { name: 'bun', description: 'Bun runtime and build tooling' },
            { name: 'git', description: 'Version control workflows' },
        ]

        selectedAgents = []

        if (agentPreset === '1') {
            selectedAgents = ['couchcms']
        } else if (agentPreset === '2') {
            selectedAgents = ['couchcms', 'tailwindcss', 'alpinejs']
        } else if (agentPreset === '3') {
            // Full: all agents
            selectedAgents = [
                'couchcms',
                'databound-forms',
                'alpinejs',
                'tailwindcss',
                'typescript',
                'search',
                'pagination',
                'relationships',
                'views',
                'comments',
                'users',
                'folders',
                'repeatable-regions',
                'photo-gallery',
                'rss-feeds',
                'archives',
                'nested-pages',
                'on-page-editing',
                'admin-panel-theming',
                'custom-routes',
                'mysql',
                'bun',
                'git',
            ]
        } else {
            // Custom: ask individually
            for (const agent of availableAgents) {
                const include = await confirm(`   Include ${agent.name}? (${agent.description})`, true)
                if (include) {
                    selectedAgents.push(agent.name)
                }
            }
        }

        // Framework selection (only in custom mode)
        console.log('\n📐 AAPF Framework (optional):')
        console.log('   The Autonomous Agent Prompting Framework provides disciplined,')
        console.log('   evidence-first operational principles for AI agents.')
        console.log('   Options:')
        console.log('     1. Full (doctrine + directives + playbooks + enhancements)')
        console.log('     2. Standard (doctrine + directives + playbooks)')
        console.log('     3. Minimal (doctrine + directives only)')
        console.log('     4. Disabled')
        const frameworkChoice = await prompt('   Choice [1-4]', '2')

        let frameworkConfig = null
        if (frameworkChoice === '1') {
            frameworkConfig = true // Full
        } else if (frameworkChoice === '2') {
            frameworkConfig = { doctrine: true, directives: true, playbooks: true }
        } else if (frameworkChoice === '3') {
            frameworkConfig = { doctrine: true, directives: true }
        } else {
            frameworkConfig = false // Disabled
        }

        // Context directory (only in custom mode, and only for extensive documentation)
        console.log('\n📋 Context directory (optional):')
        console.log('   .project/ai/context.md is ONLY for extensive project documentation (>1000 lines)')
        console.log('   For most projects, add all rules directly to standards.md body')
        console.log('   Use context.md only if:')
        console.log('     - You have >1000 lines of documentation')
        console.log('     - You want to separate config from extensive docs')
        console.log('     - You\'re working in a team with extensive shared context')
        const useContext = await confirm('   Create project context directory? (Usually not needed)', false)
        contextPath = useContext ? '.project/ai' : null
    }

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
            .replace(/toolkit: '\.\/ai-toolkit-shared'/g, `toolkit: '${toolkitPath}'`)
            .replace(/toolkit: "\.\/ai-toolkit-shared"/g, `toolkit: "${toolkitPath}"`)
            // Replace modules list - match any modules list in the template
            .replace(
                /modules:\n(?:    - [^\n]+\n?)+/g,
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

        // Add framework configuration if enabled
        if (frameworkConfig && frameworkConfig !== false) {
            let frameworkYaml = ''
            if (frameworkConfig === true) {
                frameworkYaml = 'framework: true'
            } else {
                const parts = []
                if (frameworkConfig.doctrine) parts.push('    doctrine: true')
                if (frameworkConfig.directives) parts.push('    directives: true')
                if (frameworkConfig.playbooks) parts.push('    playbooks: true')
                if (frameworkConfig.enhancements) parts.push('    enhancements: true')
                frameworkYaml = `framework:\n${parts.join('\n')}`
            }

            // Replace framework comment line with actual config
            standardsMd = standardsMd.replace(
                /# framework: true/g,
                frameworkYaml
            )
        } else {
            // Remove framework line if disabled
            standardsMd = standardsMd.replace(/# framework: true\n/g, '')
        }

        // Ensure the directory exists before writing the file
        if (configDir !== projectDir) {
            if (!existsSync(configDir)) {
                mkdirSync(configDir, { recursive: true })
                console.log(`📁 Created directory: ${configDir.replace(projectDir + '/', '')}/`)
            }
        }

        writeFileSync(configPath, standardsMd)
        console.log(`✅ Created: ${configFileName}`)
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

    const configFileName = configPath.includes('.project/')
        ? '.project/standards.md'
        : configPath.includes('docs/')
          ? 'docs/standards.md'
          : 'standards.md'

    console.log(`  1. Review and customize ${configFileName}`)

    if (contextPath) {
        console.log(`  2. Add project-specific details to ${contextPath}/context.md`)
    }

    console.log('  3. Run "bun run sync" to generate AI configurations')
    console.log('  4. Run "bun run validate" to check setup\n')

    console.log('💡 Tip: standards.md is your single source of truth for all AI agents!\n')

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
