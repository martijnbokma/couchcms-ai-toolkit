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
import { prepareTemplateData, renderTemplates, getEditorConfig } from './lib/template-engine.js'
import { writeConfigs, formatWriteStats, copyDirectory } from './lib/file-writer.js'
import { findProjectFile, resolveToolkitPath, handleError, ToolkitError } from './utils/utils.js'
import { validateConfiguration } from './lib/config-validator.js'
import { dirname, join } from 'path'
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

    // Determine project root directory
    // If config is in .project/ or docs/, use parent directory as project root
    let projectDir = dirname(configPath)
    // Normalize path separators for cross-platform compatibility
    const normalizedPath = configPath.replace(/\\/g, '/')
    if (normalizedPath.includes('/.project/') || normalizedPath.includes('/docs/')) {
        projectDir = dirname(projectDir)
    }
    
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
 * @returns {object} - { configs: Map, templateData: object }
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
    // Note: 'claude' generates CLAUDE.md memory file and .claude/ directory
    // Note: 'agents' generates AGENTS.md with all configured agents
    const editors = config.editors || ['cursor', 'claude', 'windsurf', 'kiro', 'copilot', 'agents']
    
    // Add cursor-rules if cursor is enabled
    if (editors.includes('cursor')) {
        editors.push('cursor-rules')
    }
    
    // Add claude-settings and claude-skills if claude is enabled
    if (editors.includes('claude')) {
        if (!editors.includes('claude-settings')) {
            editors.push('claude-settings')
        }
        if (!editors.includes('claude-skills')) {
            editors.push('claude-skills')
        }
    }
    
    console.log(`🎨 Rendering templates for: ${editors.join(', ')}`)

    // Render templates
    const configs = await renderTemplates(templateData, editors, toolkitPath)

    return { configs, templateData }
}

/**
 * Write configurations to disk
 * @param {Map} configs - Map of output path → content
 * @param {string} projectDir - Project root directory
 * @param {string} toolkitPath - Toolkit root directory
 * @param {Array<string>} editors - List of enabled editors
 * @param {object} templateData - Template data for generating additional files
 */
async function writeConfigurationFiles(configs, projectDir, toolkitPath, editors, templateData) {
    console.log('💾 Writing configuration files...')
    
    // Initialize comprehensive statistics
    const stats = {
        written: 0,
        skipped: 0,
        copied: 0,
        failed: 0,
        errors: [],
        validationErrors: [],
        operations: []
    }
    
    // Track operation progress
    const totalOperations = configs.size + 
        (editors.includes('cursor-rules') ? 1 : 0) + 
        (editors.includes('claude-skills') ? 1 : 0)
    let completedOperations = 0
    
    // Write base configuration files
    try {
        const writeStats = writeConfigs(configs, projectDir)
        stats.written += writeStats.written
        stats.skipped += writeStats.skipped
        stats.failed += writeStats.failed
        if (writeStats.errors) {
            stats.errors.push(...writeStats.errors)
        }
        completedOperations += configs.size
        console.log(`   Progress: ${completedOperations}/${totalOperations} operations`)
    } catch (error) {
        const errorMsg = `Failed to write configuration files: ${error.message}`
        stats.errors.push(errorMsg)
        console.log(`   ⚠️  ${errorMsg}`)
    }

    // Handle MDC rules copying for Cursor
    if (editors.includes('cursor-rules')) {
        console.log('📋 Copying MDC rules for Cursor...')
        try {
            const cursorRulesConfig = getEditorConfig('cursor-rules')
            if (cursorRulesConfig && cursorRulesConfig.copyMode) {
                const sourcePath = join(toolkitPath, cursorRulesConfig.source)
                const targetPath = join(projectDir, cursorRulesConfig.output)
                
                // Check if source directory exists
                if (!existsSync(sourcePath)) {
                    const errorMsg = `Source directory not found: ${sourcePath}`
                    stats.errors.push(errorMsg)
                    console.log(`   ⚠️  ${errorMsg}`)
                } else {
                    const result = copyDirectory(sourcePath, targetPath, cursorRulesConfig.pattern, true)
                    stats.copied += result.copiedFiles.length
                    stats.operations.push({
                        type: 'copy',
                        source: sourcePath,
                        target: targetPath,
                        count: result.copiedFiles.length
                    })
                    
                    console.log(`   ✓ Copied ${result.copiedFiles.length} MDC rule files`)
                    
                    // Report validation errors if any
                    if (result.validationErrors.length > 0) {
                        stats.validationErrors.push(...result.validationErrors)
                        console.log(`   ⚠️  ${result.validationErrors.length} validation warnings:`)
                        result.validationErrors.forEach(err => {
                            console.log(`      ${err.file}: ${err.errors.join(', ')}`)
                        })
                    }
                }
            }
            completedOperations++
            console.log(`   Progress: ${completedOperations}/${totalOperations} operations`)
        } catch (error) {
            const errorMsg = `Failed to copy MDC rules: ${error.message}`
            stats.errors.push(errorMsg)
            stats.failed++
            console.log(`   ⚠️  ${errorMsg}`)
            completedOperations++
        }
    }

    // Handle Claude Skills generation
    if (editors.includes('claude-skills')) {
        console.log('🎯 Generating Claude Skills...')
        try {
            const { generateClaudeSkills } = await import('./lib/template-engine.js')
            const skills = generateClaudeSkills(templateData, toolkitPath)
            
            if (skills.size === 0) {
                console.log('   ℹ️  No skills to generate (no modules or agents configured)')
            } else {
                // Write each skill file
                const skillStats = writeConfigs(skills, projectDir)
                stats.written += skillStats.written
                stats.skipped += skillStats.skipped
                stats.failed += skillStats.failed
                if (skillStats.errors) {
                    stats.errors.push(...skillStats.errors)
                }
                
                stats.operations.push({
                    type: 'generate',
                    category: 'claude-skills',
                    count: skills.size
                })
                
                console.log(`   ✓ Generated ${skills.size} skill files (${skillStats.written} written, ${skillStats.skipped} skipped)`)
            }
            completedOperations++
            console.log(`   Progress: ${completedOperations}/${totalOperations} operations`)
        } catch (error) {
            const errorMsg = `Failed to generate Claude Skills: ${error.message}`
            stats.errors.push(errorMsg)
            stats.failed++
            console.log(`   ⚠️  ${errorMsg}`)
            completedOperations++
        }
    }

    // Display comprehensive results
    console.log(`\n✅ Configuration generation complete`)
    console.log(`   ${formatWriteStats(stats)}`)

    // Display detailed error information if any
    if (stats.errors && stats.errors.length > 0) {
        console.log(`\n⚠️  ${stats.errors.length} error(s) occurred:`)
        stats.errors.forEach((err, index) => {
            console.log(`   ${index + 1}. ${err}`)
        })
    }
    
    // Display validation warnings summary
    if (stats.validationErrors && stats.validationErrors.length > 0) {
        console.log(`\n⚠️  ${stats.validationErrors.length} validation warning(s)`)
    }

    return stats
}

/**
 * Main sync function
 */
async function sync() {
    const startTime = Date.now()
    let stats = null

    try {
        console.log('🔄 CouchCMS AI Toolkit - Sync\n')
        console.log('━'.repeat(60))

        // 1. Find project configuration
        console.log('\n[1/6] 📄 Finding project configuration...')
        const { configPath, projectDir } = findProjectConfiguration()
        console.log(`      ✓ Config: ${configPath}`)
        console.log(`      ✓ Project: ${projectDir}`)

        // 2. Resolve toolkit path first (needed for loadConfig)
        console.log('\n[2/6] 🛠️  Resolving toolkit path...')
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
        console.log(`      ✓ Toolkit: ${toolkitPath}`)

        // 3. Load and validate configuration
        console.log('\n[3/6] ⚙️  Loading and validating configuration...')
        const config = loadConfig(projectDir, toolkitPath)

        // Basic configuration validation
        const basicErrors = validateConfig(config)
        if (basicErrors.length > 0) {
            console.log('\n      ❌ Configuration errors:')
            basicErrors.forEach(err => console.log(`         • ${err}`))
            throw new ToolkitError('Invalid configuration', 'CONFIG_INVALID')
        }

        // Enhanced editor configuration validation
        const validation = validateConfiguration(config, toolkitPath, projectDir)
        
        if (validation.errors.length > 0) {
            console.log('\n      ❌ Editor configuration errors:')
            validation.errors.forEach(err => console.log(`         • ${err}`))
            throw new ToolkitError('Invalid editor configuration', 'EDITOR_CONFIG_INVALID')
        }
        
        if (validation.warnings.length > 0) {
            console.log('\n      ⚠️  Configuration warnings:')
            validation.warnings.forEach(warn => console.log(`         • ${warn}`))
        }
        
        console.log(`      ✓ Configuration valid`)

        // Check for updates (non-blocking)
        checkAndNotify(toolkitPath)

        // 4. Load all resources
        console.log('\n[4/6] 📚 Loading toolkit resources...')
        const resources = loadAllResources(config, toolkitPath)
        console.log(`      ✓ Loaded ${resources.modules.length} modules`)
        console.log(`      ✓ Loaded ${resources.agents.length} agents`)
        if (resources.framework) {
            console.log(`      ✓ Loaded framework components`)
        }

        // 5. Generate configurations
        console.log('\n[5/6] 🎨 Generating editor configurations...')
        const { configs, templateData } = await generateConfigurations(config, resources, toolkitPath, projectDir)

        // Determine which editors are enabled
        const editors = config.editors || ['cursor', 'claude', 'windsurf', 'kiro', 'copilot', 'agents']
        if (editors.includes('cursor')) {
            editors.push('cursor-rules')
        }
        
        // Add claude-settings and claude-skills if claude is enabled
        if (editors.includes('claude')) {
            if (!editors.includes('claude-settings')) {
                editors.push('claude-settings')
            }
            if (!editors.includes('claude-skills')) {
                editors.push('claude-skills')
            }
        }
        console.log(`      ✓ Generated ${configs.size} configuration files`)
        console.log(`      ✓ Target editors: ${editors.filter(e => !e.includes('-')).join(', ')}`)

        // 6. Write to disk
        console.log('\n[6/6] 💾 Writing files to disk...')
        stats = await writeConfigurationFiles(configs, projectDir, toolkitPath, editors, templateData)

        // 7. Display comprehensive summary
        const elapsed = Date.now() - startTime
        console.log('\n' + '━'.repeat(60))
        console.log('\n✨ Sync completed successfully!\n')
        
        console.log('📊 Summary:')
        console.log(`   ⏱️  Time: ${elapsed}ms`)
        console.log(`   📚 Resources: ${resources.modules.length} modules, ${resources.agents.length} agents`)
        console.log(`   📝 Files: ${stats.written} written, ${stats.skipped} skipped`)
        if (stats.copied > 0) {
            console.log(`   📋 Copied: ${stats.copied} MDC rules`)
        }
        if (stats.failed > 0) {
            console.log(`   ⚠️  Failed: ${stats.failed} operations`)
        }
        
        // Show operation breakdown if available
        if (stats.operations && stats.operations.length > 0) {
            console.log('\n📋 Operations:')
            stats.operations.forEach(op => {
                if (op.type === 'copy') {
                    console.log(`   • Copied ${op.count} files: ${op.source} → ${op.target}`)
                } else if (op.type === 'generate') {
                    console.log(`   • Generated ${op.count} ${op.category} files`)
                }
            })
        }
        
        console.log('\n' + '━'.repeat(60))
        console.log()

    } catch (error) {
        const elapsed = Date.now() - startTime
        console.log('\n' + '━'.repeat(60))
        console.log(`\n❌ Sync failed after ${elapsed}ms\n`)
        
        // Provide detailed error information
        if (error instanceof ToolkitError) {
            console.log(`Error: ${error.message}`)
            console.log(`Code: ${error.code}`)
            if (error.details) {
                console.log(`Details: ${JSON.stringify(error.details, null, 2)}`)
            }
        } else {
            console.log(`Error: ${error.message}`)
            if (error.stack) {
                console.log(`\nStack trace:`)
                console.log(error.stack)
            }
        }
        
        // Show partial statistics if available
        if (stats) {
            console.log(`\n📊 Partial results before failure:`)
            console.log(`   Files written: ${stats.written}`)
            console.log(`   Files skipped: ${stats.skipped}`)
            if (stats.copied > 0) {
                console.log(`   Files copied: ${stats.copied}`)
            }
        }
        
        console.log('\n💡 Troubleshooting tips:')
        console.log('   • Check that your standards.md file is valid YAML')
        console.log('   • Verify toolkit path exists and is accessible')
        console.log('   • Ensure all referenced modules and agents exist')
        console.log('   • Run "bun run validate" for detailed diagnostics')
        console.log('\n' + '━'.repeat(60))
        console.log()
        
        handleError(error, 'Sync failed')
        process.exit(1)
    }
}

/**
 * Watch mode - monitor config file for changes
 */
function watchMode(configPath) {
    console.log('━'.repeat(60))
    console.log('\n👀 Watch mode enabled')
    console.log(`   Monitoring: ${configPath}`)
    console.log('   Press Ctrl+C to stop\n')
    console.log('━'.repeat(60))
    console.log()

    let syncTimeout = null
    let isRunning = false
    let syncCount = 0

    const watcher = watch(configPath, (eventType) => {
        if (eventType === 'change' && !isRunning) {
            // Debounce: wait 500ms after last change
            clearTimeout(syncTimeout)
            syncTimeout = setTimeout(async () => {
                syncCount++
                const timestamp = new Date().toLocaleTimeString()
                console.log(`\n[${timestamp}] 🔄 Configuration changed, syncing... (sync #${syncCount})\n`)
                isRunning = true
                try {
                    await sync()
                    console.log(`[${timestamp}] ✅ Sync #${syncCount} completed`)
                } catch (error) {
                    console.error(`[${timestamp}] ❌ Sync #${syncCount} failed: ${error.message}`)
                }
                isRunning = false
                console.log(`\n👀 Watching for changes...\n`)
            }, 500)
        }
    })

    // Handle cleanup
    process.on('SIGINT', () => {
        console.log('\n\n━'.repeat(60))
        console.log('\n👋 Stopping watch mode...')
        console.log(`   Total syncs performed: ${syncCount}`)
        console.log('\n━'.repeat(60))
        console.log()
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
