#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Sync Script (Refactored)
 *
 * Orchestrates the generation of editor configurations from project configuration,
 * toolkit modules, agents, and framework components.
 *
 * This is a lightweight orchestrator that delegates to specialized modules:
 * - config-loader: Load and merge configuration
 * - module-loader: Load modules, agents, and framework
 * - template-engine: Prepare data and render templates
 * - file-writer: Write generated configs to disk
 *
 * Usage:
 *   bun scripts/sync.js [--watch]
 *   
 * Options:
 *   --watch    Watch for changes and auto-sync
 */

import { loadConfig, validateConfig } from './lib/config-loader.js'
import { loadModules, loadAgents, loadFramework, checkConflicts } from './lib/module-loader.js'
import { prepareTemplateData, renderTemplates } from './lib/template-engine.js'
import { writeConfigs, formatWriteStats } from './lib/file-writer.js'
import { findProjectFile, resolveToolkitPath, handleError, ToolkitError } from './utils/utils.js'
import { dirname } from 'path'
import { existsSync, readFileSync, watch } from 'fs'
import matter from 'gray-matter'
import { checkAndNotify } from './lib/update-notifier.js'

/**
 * Find and validate project configuration file
 * @returns {object} - { configPath, projectDir }
 */
function findProjectConfiguration() {
    const configPath = findProjectFile()

    if (!configPath) {
        console.error('❌ No configuration file found')
        console.log('\nCreate a standards.md file with:')
        console.log('---')
        console.log('name: "my-project"')
        console.log('toolkit: "./ai-toolkit-shared"')
        console.log('modules:')
        console.log('  - couchcms-core')
        console.log('---\n')
        console.log('💡 Tip: Use .project/standards.md for the recommended location.')
        process.exit(1)
    }

    const projectDir = dirname(configPath)
    console.log(`📄 Config: ${configPath}`)
    console.log(`📁 Project: ${projectDir}`)

    return { configPath, projectDir }
}

/**
 * Load and validate all toolkit resources
 * @param {object} config - Configuration object
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - { modules, agents, framework }
 */
function loadAllResources(config, toolkitPath) {
    // Load modules
    const moduleList = config.modules || ['couchcms-core']
    console.log(`📚 Loading ${moduleList.length} modules...`)
    const modules = loadModules(moduleList, toolkitPath)

    // Check for conflicts
    const conflicts = checkConflicts(modules)
    if (conflicts.length > 0) {
        console.log('')
        conflicts.forEach(c => console.log(c))
        throw new ToolkitError('Module conflicts detected', 'MODULE_CONFLICT')
    }

    // Load agents
    const agentList = config.agents || []
    const agents = agentList.length > 0 ? loadAgents(agentList, toolkitPath) : []
    if (agents.length > 0) {
        console.log(`🤖 Loading ${agents.length} agents...`)
    }

    // Load framework
    const framework = loadFramework(config.framework, toolkitPath)
    if (framework) {
        const categories = framework.meta.categories || []
        console.log(`📐 Framework: ${categories.join(', ')}`)
    }

    return { modules, agents, framework }
}

/**
 * Generate all editor configurations
 * @param {object} config - Configuration object
 * @param {object} resources - Loaded resources
 * @param {string} toolkitPath - Toolkit root directory
 * @param {string} projectDir - Project root directory
 * @returns {Map} - Map of output path → content
 */
async function generateConfigurations(config, resources, toolkitPath, projectDir) {
    const { modules, agents, framework } = resources

    // Prepare template data
    console.log('📝 Preparing template data...')
    const templateData = prepareTemplateData(
        config,
        config, // mergedConfig is same as config after loadConfig
        modules,
        agents,
        framework,
        null, // projectContext - not used in new structure
        toolkitPath,
        projectDir
    )

    // Determine which editors to generate for
    const editors = config.editors || ['cursor', 'claude', 'windsurf', 'kiro', 'copilot']
    console.log(`🎨 Rendering templates for: ${editors.join(', ')}`)

    // Render templates
    const configs = await renderTemplates(templateData, editors, toolkitPath)

    return configs
}

/**
 * Write configurations to disk
 * @param {Map} configs - Map of output path → content
 * @param {string} projectDir - Project root directory
 */
function writeConfigurationFiles(configs, projectDir) {
    console.log('💾 Writing configuration files...')
    const stats = writeConfigs(configs, projectDir)

    // Display results
    console.log(`\n✅ ${formatWriteStats(stats)}`)

    if (stats.errors.length > 0) {
        console.log('\n⚠️  Errors:')
        stats.errors.forEach(err => console.log(`   ${err}`))
    }

    return stats
}

/**
 * Main sync function
 */
async function sync() {
    const startTime = Date.now()

    try {
        console.log('🔄 CouchCMS AI Toolkit - Sync\n')

        // 1. Find project configuration
        const { configPath, projectDir } = findProjectConfiguration()

        // 2. Resolve toolkit path first (needed for loadConfig)
        // We need to read the config file to get the toolkit path
        const configContent = readFileSync(configPath, 'utf8')
        const { data: frontmatter } = matter(configContent)
        const toolkitPathConfig = frontmatter.toolkit?.path || frontmatter.toolkit || './ai-toolkit-shared'
        const toolkitPath = resolveToolkitPath(toolkitPathConfig, projectDir)

        if (!existsSync(toolkitPath)) {
            throw new ToolkitError(
                `Toolkit path not found: ${toolkitPath}`,
                'TOOLKIT_NOT_FOUND'
            )
        }

        // 3. Load and validate configuration
        console.log('⚙️  Loading configuration...')
        const config = loadConfig(projectDir, toolkitPath)

        // Validate configuration
        const errors = validateConfig(config)
        if (errors.length > 0) {
            console.log('\n❌ Configuration errors:')
            errors.forEach(err => console.log(`   ${err}`))
            throw new ToolkitError('Invalid configuration', 'CONFIG_INVALID')
        }

        console.log(`🛠️  Toolkit: ${toolkitPath}`)

        // Check for updates (non-blocking)
        checkAndNotify(toolkitPath)

        // 4. Load all resources
        const resources = loadAllResources(config, toolkitPath)

        // 5. Generate configurations
        const configs = await generateConfigurations(config, resources, toolkitPath, projectDir)

        // 6. Write to disk
        const stats = writeConfigurationFiles(configs, projectDir)

        // 7. Display summary
        const elapsed = Date.now() - startTime
        console.log(`\n✨ Sync complete in ${elapsed}ms`)
        console.log(`   Modules: ${resources.modules.length}`)
        console.log(`   Agents: ${resources.agents.length}`)
        console.log(`   Files: ${stats.written} written, ${stats.skipped} skipped\n`)

    } catch (error) {
        handleError(error, 'Sync failed')
        process.exit(1)
    }
}

/**
 * Watch mode - monitor config file for changes
 */
function watchMode(configPath) {
    console.log(`\n👀 Watching ${configPath} for changes...`)
    console.log('   Press Ctrl+C to stop\n')

    let syncTimeout = null
    let isRunning = false

    const watcher = watch(configPath, (eventType) => {
        if (eventType === 'change' && !isRunning) {
            // Debounce: wait 500ms after last change
            clearTimeout(syncTimeout)
            syncTimeout = setTimeout(async () => {
                console.log('\n🔄 Config changed, syncing...\n')
                isRunning = true
                try {
                    await sync()
                } catch (error) {
                    console.error('❌ Sync failed:', error.message)
                }
                isRunning = false
                console.log('\n👀 Watching for changes...\n')
            }, 500)
        }
    })

    // Handle cleanup
    process.on('SIGINT', () => {
        console.log('\n\n👋 Stopping watch mode...')
        watcher.close()
        process.exit(0)
    })
}

// Parse arguments
const args = process.argv.slice(2)
const watchFlag = args.includes('--watch') || args.includes('-w')

// Run sync
if (watchFlag) {
    // Run initial sync, then watch
    sync().then(() => {
        const { configPath } = findProjectConfiguration()
        watchMode(configPath)
    }).catch(error => {
        handleError(error, 'Initial sync failed')
        process.exit(1)
    })
} else {
    sync()
}
