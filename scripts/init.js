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
import { findConfigFile, hasStandards, getConfigFileName, ToolkitError, handleError } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

/**
 * Read input from stdin
 * @param {string} question - Question to ask user
 * @param {string} [defaultValue=''] - Default value if user enters nothing
 * @returns {Promise<string>} - User input or default value
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
 * @param {string} question - Question to ask user
 * @param {boolean} [defaultYes=true] - Default to yes if user enters nothing
 * @returns {Promise<boolean>} - True if yes, false if no
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
 * Determine project directory, detecting if running from toolkit directory
 * @param {string} currentDir - Current working directory
 * @returns {{projectDir: string, toolkitDir: string|null}} - Project and toolkit directories
 */
function determineProjectDirectory(currentDir) {
    const currentDirName = basename(currentDir)
    const hasToolkitStructure = existsSync(join(currentDir, 'modules')) &&
                                 existsSync(join(currentDir, 'scripts')) &&
                                 existsSync(join(currentDir, 'templates'))

    if (currentDirName === 'ai-toolkit-shared' || hasToolkitStructure) {
        const toolkitDir = currentDir
        const projectDir = dirname(currentDir)
        console.log(`📁 Detected toolkit directory, using parent as project root`)
        console.log(`   Toolkit: ${toolkitDir}`)
        console.log(`   Project: ${projectDir}\n`)
        return { projectDir, toolkitDir }
    }

    return { projectDir: currentDir, toolkitDir: null }
}

/**
 * Check if config file exists and ask for overwrite confirmation
 * @param {string} projectDir - Project root directory
 * @returns {Promise<boolean>} - True if should continue, false if cancelled
 */
async function checkExistingConfig(projectDir) {
    const existingConfig = findConfigFile(projectDir)

    if (existingConfig) {
        const configName = getConfigFileName(projectDir) || 'standards.md'
        console.log(`⚠️  ${configName} already exists in this directory\n`)
        const overwrite = await confirm(`Overwrite existing ${configName}?`, false)

        if (!overwrite) {
            console.log('\n❌ Setup cancelled\n')
            return false
        }
    }

    return true
}

/**
 * Determine config file path based on mode and user choice
 * @param {string} projectDir - Project root directory
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<{configPath: string, configDir: string}>} - Config path and directory
 */
async function determineConfigPath(projectDir, simpleMode) {
    if (simpleMode) {
        // Simple mode: use recommended defaults
        return {
            configPath: join(projectDir, '.project', 'standards.md'),
            configDir: join(projectDir, '.project'),
        }
    }

    // Custom mode: ask for configuration file location
    console.log('\n📁 Where should standards.md be created?')
    console.log('  1. .project/standards.md (recommended - project config directory)')
    console.log('  2. docs/standards.md (documentation location)')
    console.log('  3. standards.md (root directory)')
    const locationChoice = await prompt('Choice [1-3]', '1')

    if (locationChoice === '1') {
        return {
            configPath: join(projectDir, '.project', 'standards.md'),
            configDir: join(projectDir, '.project'),
        }
    } else if (locationChoice === '2') {
        return {
            configPath: join(projectDir, 'docs', 'standards.md'),
            configDir: join(projectDir, 'docs'),
        }
    }

    return {
        configPath: join(projectDir, 'standards.md'),
        configDir: projectDir,
    }
}

/**
 * Get available modules list
 * @returns {Array<{name: string, description: string, required?: boolean}>} - Available modules
 */
function getAvailableModules() {
    return [
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
}

/**
 * Get available agents list
 * @returns {Array<{name: string, description: string}>} - Available agents
 */
function getAvailableAgents() {
    return [
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
}

/**
 * Select modules based on preset or individual choice
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<Array<string>>} - Selected module names
 */
async function selectModules(simpleMode) {
    if (simpleMode) {
        // Simple mode: use standard preset
        console.log('\n📚 Using standard module preset:')
        console.log('   ✓ couchcms-core - Core CouchCMS patterns')
        console.log('   ✓ tailwindcss - TailwindCSS 4 patterns')
        console.log('   ✓ alpinejs - Alpine.js integration')
        return ['couchcms-core', 'tailwindcss', 'alpinejs']
    }

    // Custom mode: ask for preset or individual selection
    console.log('\n📚 Module selection:')
    console.log('  1. Minimal (only couchcms-core)')
    console.log('  2. Standard (core + tailwindcss + alpinejs)')
    console.log('  3. Full (all modules)')
    console.log('  4. Custom (choose individually)')
    const modulePreset = await prompt('Choice [1-4]', '2')

    const availableModules = getAvailableModules()
    let selectedModules = ['couchcms-core']

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

    return selectedModules
}

/**
 * Select agents based on preset or individual choice
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<Array<string>>} - Selected agent names
 */
async function selectAgents(simpleMode) {
    if (simpleMode) {
        // Simple mode: use standard preset
        console.log('\n🤖 Using standard agent preset:')
        console.log('   ✓ couchcms - Core CouchCMS development')
        console.log('   ✓ tailwindcss - TailwindCSS styling')
        console.log('   ✓ alpinejs - Alpine.js development')
        return ['couchcms', 'tailwindcss', 'alpinejs']
    }

    // Custom mode: ask for preset or individual selection
    console.log('\n🤖 Agent selection:')
    console.log('  1. Minimal (only couchcms)')
    console.log('  2. Standard (couchcms + tailwindcss + alpinejs)')
    console.log('  3. Full (all agents)')
    console.log('  4. Custom (choose individually)')
    const agentPreset = await prompt('Choice [1-4]', '2')

    const availableAgents = getAvailableAgents()
    let selectedAgents = []

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

    return selectedAgents
}

/**
 * Select framework configuration
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<object|boolean|null>} - Framework configuration
 */
async function selectFramework(simpleMode) {
    if (simpleMode) {
        // Simple mode: framework disabled
        return false
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

    if (frameworkChoice === '1') {
        return true // Full
    } else if (frameworkChoice === '2') {
        return { doctrine: true, directives: true, playbooks: true }
    } else if (frameworkChoice === '3') {
        return { doctrine: true, directives: true }
    }

    return false // Disabled
}

/**
 * Ask if context directory should be created
 * @param {boolean} simpleMode - Whether in simple mode
 * @returns {Promise<string|null>} - Context path or null
 */
async function selectContextDirectory(simpleMode) {
    if (simpleMode) {
        // Don't create context directory in simple mode
        return null
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
    return useContext ? '.project/ai' : null
}

/**
 * Replace template variables in standards.md content
 * @param {string} template - Template content
 * @param {object} variables - Variables to replace
 * @returns {string} - Template with variables replaced
 */
function replaceTemplateVariables(template, variables) {
    let result = template
        .replace(/"my-project"/g, `"${variables.projectName}"`)
        .replace(/Brief description of your project/g, variables.projectDescription)
        .replace(/toolkit: '\.\/ai-toolkit-shared'/g, `toolkit: '${variables.toolkitPath}'`)
        .replace(/toolkit: "\.\/ai-toolkit-shared"/g, `toolkit: "${variables.toolkitPath}"`)

    // Replace modules list - match any modules list in the template
    if (variables.selectedModules && variables.selectedModules.length > 0) {
        result = result.replace(
            /modules:\n(?:    - [^\n]+\n?)+/g,
            `modules:\n${variables.selectedModules.map(m => `    - ${m}`).join('\n')}`
        )
    }

    // Add agents to YAML if selected
    if (variables.selectedAgents && variables.selectedAgents.length > 0) {
        const agentsYaml = variables.selectedAgents.map(a => `    - ${a}`).join('\n')
        result = result.replace(
            /agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true/g,
            `agents:\n    cursor: true\n    copilot: true\n    claude: true\n    vscode: true\n    windsurf: true\n    tabnine: true\n    amazon_codewhisperer: true\n\n# === ACTIVE AGENTS ===\nactive_agents:\n${agentsYaml}`
        )
    }

    // Add framework configuration if enabled
    if (variables.frameworkConfig && variables.frameworkConfig !== false) {
        let frameworkYaml = ''
        if (variables.frameworkConfig === true) {
            frameworkYaml = 'framework: true'
        } else {
            const parts = []
            if (variables.frameworkConfig.doctrine) parts.push('    doctrine: true')
            if (variables.frameworkConfig.directives) parts.push('    directives: true')
            if (variables.frameworkConfig.playbooks) parts.push('    playbooks: true')
            if (variables.frameworkConfig.enhancements) parts.push('    enhancements: true')
            frameworkYaml = `framework:\n${parts.join('\n')}`
        }

        // Replace framework comment line with actual config
        result = result.replace(/# framework: true/g, frameworkYaml)
    } else {
        // Remove framework line if disabled
        result = result.replace(/# framework: true\n/g, '')
    }

    return result
}

/**
 * Generate standards.md file from template
 * @param {object} options - Generation options
 * @param {string} options.projectDir - Project root directory
 * @param {string} options.configPath - Path to config file
 * @param {string} options.configDir - Config directory
 * @param {string} options.projectName - Project name
 * @param {string} options.projectDescription - Project description
 * @param {string} options.toolkitPath - Toolkit path
 * @param {Array<string>} options.selectedModules - Selected modules
 * @param {Array<string>} options.selectedAgents - Selected agents
 * @param {object|boolean|null} options.frameworkConfig - Framework configuration
 * @returns {Promise<string>} - Path to created config file
 */
async function generateStandardsFile(options) {
    const { projectDir, configPath, configDir, projectName, projectDescription, toolkitPath, selectedModules, selectedAgents, frameworkConfig } = options

    // Create config directory if needed
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

    if (!existsSync(templatePath)) {
        throw new ToolkitError(
            `Template file not found: ${templatePath}`,
            'TEMPLATE_NOT_FOUND'
        )
    }

    let standardsMd = readFileSync(templatePath, 'utf8')

    // Replace template variables
    standardsMd = replaceTemplateVariables(standardsMd, {
        projectName,
        projectDescription,
        toolkitPath,
        selectedModules,
        selectedAgents,
        frameworkConfig,
    })

    // Ensure the directory exists before writing the file
    if (configDir !== projectDir) {
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true })
            console.log(`📁 Created directory: ${configDir.replace(projectDir + '/', '')}/`)
        }
    }

    writeFileSync(configPath, standardsMd)
    console.log(`✅ Created: ${configFileName}`)

    return configPath
}

/**
 * Setup context directory if requested
 * @param {string} projectDir - Project root directory
 * @param {string} projectName - Project name
 * @param {string|null} contextPath - Context path or null
 * @returns {Promise<void>}
 */
async function setupContextDirectory(projectDir, projectName, contextPath) {
    if (!contextPath) {
        return
    }

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

/**
 * Run initial sync script
 * @param {string} projectDir - Project root directory
 * @returns {Promise<void>}
 */
async function runInitialSync(projectDir) {
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
}

/**
 * Display success message and next steps
 * @param {string} configPath - Path to config file
 * @param {string|null} contextPath - Context path or null
 * @returns {void}
 */
function displaySuccessMessage(configPath, contextPath) {
    const configFileName = configPath.includes('.project/')
        ? '.project/standards.md'
        : configPath.includes('docs/')
          ? 'docs/standards.md'
          : 'standards.md'

    console.log('\n' + '='.repeat(60))
    console.log('\n✨ Setup complete!\n')
    console.log('Next steps:\n')

    console.log(`  1. Review and customize ${configFileName}`)

    if (contextPath) {
        console.log(`  2. Add project-specific details to ${contextPath}/context.md`)
    }

    console.log('  3. Run "bun run sync" to generate AI configurations')
    console.log('  4. Run "bun run validate" to check setup\n')

    console.log('💡 Tip: standards.md is your single source of truth for all AI agents!\n')

    console.log('Happy coding! 🎉\n')
}

/**
 * Main init function
 * @returns {Promise<void>}
 */
async function init() {
    console.log('🚀 CouchCMS AI Toolkit - Interactive Setup\n')

    // Determine project directory
    const { projectDir } = determineProjectDirectory(process.cwd())

    // Check for existing config files
    const shouldContinue = await checkExistingConfig(projectDir)
    if (!shouldContinue) {
        process.exit(0)
    }

    console.log("Let's set up your project configuration...\n")

    // Ask for setup mode
    console.log('🎯 Setup mode:')
    console.log('  1. Simple (recommended for beginners) - Uses defaults, minimal questions')
    console.log('  2. Custom - Full control over all options')
    const modeChoice = await prompt('Choice [1-2]', '1')
    const simpleMode = modeChoice === '1'

    // Determine config path
    const { configPath, configDir } = await determineConfigPath(projectDir, simpleMode)

    if (simpleMode) {
        console.log('\n✨ Simple mode: Using recommended defaults')
        console.log('   - Configuration: .project/standards.md')
        console.log('   - Modules: Standard preset (core + tailwindcss + alpinejs)')
        console.log('   - Agents: Standard preset (couchcms + tailwindcss + alpinejs)')
        console.log('   - Framework: Disabled (can be enabled later in standards.md)')
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

    // Select modules and agents
    const selectedModules = await selectModules(simpleMode)
    const selectedAgents = await selectAgents(simpleMode)

    // Select framework configuration
    const frameworkConfig = await selectFramework(simpleMode)

    // Select context directory
    const contextPath = await selectContextDirectory(simpleMode)

    // Generate standards.md file
    await generateStandardsFile({
        projectDir,
        configPath,
        configDir,
        projectName,
        projectDescription,
        toolkitPath,
        selectedModules,
        selectedAgents,
        frameworkConfig,
    })

    // Create context directory if requested
    await setupContextDirectory(projectDir, projectName, contextPath)

    // Run initial sync
    await runInitialSync(projectDir)

    // Display success message
    displaySuccessMessage(configPath, contextPath)

    process.exit(0)
}

// Setup stdin for interactive input
process.stdin.setEncoding('utf8')
process.stdin.setRawMode(false)

// Run
init().catch(error => {
    handleError(error, 'Setup failed')
})
