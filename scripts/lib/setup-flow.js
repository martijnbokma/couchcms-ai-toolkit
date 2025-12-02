#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Setup Flow
 *
 * Routes user through appropriate setup flow based on complexity preference
 * Implements automatic CouchCMS inclusion + optional frontend selection
 */

import { join } from 'path'
import { existsSync } from 'fs'
import { prompt, confirm } from './prompts.js'
import { info, success, progress } from './logger.js'
import { printInfo, printSuccess, printProgress, printSection, printWarning } from './terminal.js'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents } from './option-organizer.js'
import { selectFrontendFrameworks } from './frontend-selector.js'
import { checkAndInstallDependencies } from './dependency-checker.js'
import { detectToolkitPath } from './toolkit-detector.js'
import { determineConfigPath, generateStandardsFile } from './config-generator.js'
import { getToolkitRootCached } from './paths.js'
import { addToolkitScript, hasToolkitScript } from './package-json-utils.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * Run setup flow based on complexity
 * @param {string} projectDir - Project root directory
 * @param {string} complexity - Setup complexity (easy/medium/comprehensive)
 * @param {Object} options - Additional options
 */
export async function runSetupFlow(projectDir, complexity, options = {}) {
    printSection(`Setup Flow: ${complexity}`)

    // Step 1: Ensure dependencies are installed
    printProgress('Checking dependencies...')
    try {
        await checkAndInstallDependencies(TOOLKIT_ROOT)
        printSuccess('Dependencies ready')
    } catch (error) {
        throw new Error(`Dependency check failed: ${error.message}`)
    }

    // Step 2: Show CouchCMS automatic inclusion message
    console.log('\n' + '='.repeat(70))
    console.log('  CouchCMS Modules & Agents (Automatic)')
    console.log('='.repeat(70))
    printInfo(`Including all CouchCMS modules and agents automatically...`)
    console.log(`  Modules: ${getCouchCMSModules().length} (always included)`)
    console.log(`  Agents: ${getCouchCMSAgents().length} (always included)`)
    printSuccess('CouchCMS components will be included automatically\n')

    // Step 3: Gather project information
    const projectInfo = await gatherProjectInfo(complexity)

    // Step 4: Select frontend frameworks (optional)
    printProgress('Selecting frontend frameworks...')
    const frontendSelection = await selectFrontendFrameworks(complexity)

    // Step 5: Detect toolkit path
    printProgress('Detecting toolkit path...')
    const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'
    printSuccess(`Toolkit path: ${toolkitPath}`)

    // Step 6: Determine config path
    const { configPath, configDir } = await determineConfigPath(projectDir, complexity === 'easy')

    // Step 7: Build complete module and agent lists
    // CouchCMS modules/agents are always included
    const couchcmsModules = getCouchCMSModules()
    const couchcmsAgents = getCouchCMSAgents()

    // Combine with selected frontend modules/agents
    const allModules = getCompleteModules(frontendSelection.modules)
    const allAgents = getCompleteAgents(frontendSelection.agents, [])

    // Step 8: Show summary before generating
    console.log('\n' + '='.repeat(70))
    console.log('  Configuration Summary')
    console.log('='.repeat(70))
    console.log(`\n📦 Modules (${allModules.length} total):`)
    console.log(`   • CouchCMS: ${couchcmsModules.length} (automatic)`)
    console.log(`   • Frontend: ${frontendSelection.modules.length} (selected)`)
    console.log(`\n🤖 Agents (${allAgents.length} total):`)
    console.log(`   • CouchCMS: ${couchcmsAgents.length} (automatic)`)
    console.log(`   • Frontend: ${frontendSelection.agents.length} (selected)`)
    console.log()

    // Step 9: Generate standards.md
    printProgress('Generating configuration file...')
    await generateStandardsFile({
        projectDir,
        configPath,
        configDir,
        projectName: projectInfo.name,
        projectDescription: projectInfo.description,
        toolkitPath,
        toolkitRoot: TOOLKIT_ROOT,
        selectedModules: allModules,
        selectedAgents: allAgents,
        selectedEditors: [], // Editors selection can be added later
        frameworkConfig: false
    })

    printSuccess(`Configuration file created: ${configPath}`)

    // Step 10: Run initial sync
    printProgress('Running initial sync...')
    const { runInitialSync } = await import('./sync-runner.js')
    await runInitialSync(projectDir, TOOLKIT_ROOT)

    // Step 11: Offer to add toolkit script to package.json
    await offerAddToolkitScript(projectDir, toolkitPath)

    // Step 12: Show success message
    showSuccessMessage(projectDir, complexity, allModules, allAgents)
}

/**
 * Gather project information based on complexity
 * @param {string} complexity - Setup complexity
 * @returns {Promise<Object>} Project information
 */
async function gatherProjectInfo(complexity) {
    console.log('\n' + '='.repeat(70))
    console.log('  Project Information')
    console.log('='.repeat(70) + '\n')

    // Project name
    const name = await prompt('Project name', 'my-project')

    // Project description
    const description = await prompt('Project description', 'A CouchCMS web application')

    return { name, description }
}

/**
 * Offer to add toolkit script to package.json
 * @param {string} projectDir - Project directory
 * @param {string} toolkitPath - Toolkit path (relative)
 */
async function offerAddToolkitScript(projectDir, toolkitPath) {
    // Check if script already exists
    if (hasToolkitScript(projectDir)) {
        printInfo('Toolkit script already exists in package.json')
        return
    }

    // Check if package.json exists
    const packageJsonPath = join(projectDir, 'package.json')
    if (!existsSync(packageJsonPath)) {
        // No package.json, skip
        return
    }

    // Ask user if they want to add the script
    console.log('\n' + '='.repeat(70))
    console.log('  Add Toolkit Script to package.json?')
    console.log('='.repeat(70))
    console.log('\n💡 Tip: Adding a script to package.json makes it easier to use:')
    console.log('   Instead of: bun ai-toolkit-shared/scripts/toolkit.js install')
    console.log('   You can use: bun run toolkit install\n')

    const shouldAdd = await confirm('Add toolkit script to package.json?', true)

    if (shouldAdd) {
        const result = await addToolkitScript(projectDir, toolkitPath)
        if (result.added) {
            printSuccess(result.message)
            console.log(`   Script: ${result.script}`)
            console.log('\n✅ Now you can use: bun run toolkit [command]')
        } else {
            printWarning(result.message)
        }
    } else {
        printInfo('Skipped. You can add it later or use the full path.')
    }
}

/**
 * Show success message after setup
 * @param {string} projectDir - Project directory
 * @param {string} complexity - Setup complexity used
 * @param {Array<string>} modules - Selected modules
 * @param {Array<string>} agents - Selected agents
 */
function showSuccessMessage(projectDir, complexity, modules, allAgents) {
    console.log('\n' + '='.repeat(70))
    console.log('  ✅ Setup Complete!')
    console.log('='.repeat(70) + '\n')

    printSuccess('Your CouchCMS AI Toolkit is now configured!\n')

    console.log('📦 Included Components:')
    console.log(`   • CouchCMS Modules: ${modules.filter(m => !['tailwindcss', 'daisyui', 'alpinejs', 'typescript'].includes(m)).length} (automatic)`)
    console.log(`   • Frontend Modules: ${modules.filter(m => ['tailwindcss', 'daisyui', 'alpinejs', 'typescript'].includes(m)).length} (selected)`)
    console.log(`   • Agents: ${allAgents.length} total\n`)

    console.log('📝 Configuration:')
    console.log(`   • File: .project/standards.md`)
    console.log(`   • Complexity: ${complexity}\n`)

    console.log('🚀 Next Steps:')
    console.log('   1. Review your configuration: .project/standards.md')
    
    // Show appropriate command based on whether script exists
    if (hasToolkitScript(projectDir)) {
        console.log('   2. Run sync to generate configs: bun run toolkit sync')
    } else {
        console.log('   2. Run sync to generate configs: bun ai-toolkit-shared/scripts/toolkit.js sync')
    }
    
    console.log('   3. Start developing with AI assistance!\n')

    console.log('💡 Useful Commands:')
    
    // Check if toolkit script exists in package.json
    if (hasToolkitScript(projectDir)) {
        console.log('   • bun run toolkit sync       - Generate configs from standards.md')
        console.log('   • bun run toolkit validate  - Check configuration')
        console.log('   • bun run toolkit health    - Check installation status')
        console.log('   • bun run toolkit reconfigure - Change setup complexity\n')
    } else {
        console.log('   • bun ai-toolkit-shared/scripts/toolkit.js sync       - Generate configs')
        console.log('   • bun ai-toolkit-shared/scripts/toolkit.js validate  - Check configuration')
        console.log('   • bun ai-toolkit-shared/scripts/toolkit.js health    - Check status')
        console.log('   • bun ai-toolkit-shared/scripts/toolkit.js reconfigure - Change complexity')
        console.log('\n💡 Tip: Add a script to package.json for easier use:')
        console.log('   Run setup again and choose "yes" when asked to add script\n')
    }
}
