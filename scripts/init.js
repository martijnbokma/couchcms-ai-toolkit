#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Init Script
 *
 * Interactive setup wizard for new projects
 *
 * Usage:
 *   bun ai-toolkit/scripts/init.js
 */

import { existsSync, readFileSync } from 'fs'
import { resolve, dirname, basename, join } from 'path'
import { findConfigFile, getConfigFileName, handleError } from './utils/utils.js'
import { prompt, confirm, selectModules, selectAgents, selectFramework, selectEditors } from './lib/prompts.js'
import { printConfigSummary } from './lib/index.js'
import {
    determineConfigPath,
    generateStandardsFile,
    setupContextDirectory,
    selectContextDirectory,
    cleanGeneratedFiles
} from './lib/config-generator.js'
import { runInitialSync, displaySuccessMessage } from './lib/sync-runner.js'
import {
    detectProject,
    getRecommendedModules,
    getRecommendedAgents
} from './lib/project-detector.js'
import { checkAndInstallDependencies } from './lib/dependency-checker.js'
import { detectToolkitPath } from './lib/toolkit-detector.js'
import { resolveToolkitPath } from './utils/utils.js'
import { getToolkitRootCached, loadPresets } from './lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()

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
 * Display and select preset
 * @returns {Promise<Object|null>} Selected preset or null
 */
async function selectPreset() {
    const presets = loadPresets()
    const presetKeys = Object.keys(presets)

    if (presetKeys.length === 0) {
        return null
    }

    console.log('\n📋 Available presets:')
    console.log('  0. None - Configure manually')

    presetKeys.forEach((key, index) => {
        const preset = presets[key]
        console.log(`  ${index + 1}. ${preset.name} - ${preset.description}`)
    })

    const choice = await prompt(`\nChoice [0-${presetKeys.length}]`, '0')
    const index = parseInt(choice)

    if (index === 0 || isNaN(index) || index > presetKeys.length) {
        return null
    }

    const presetKey = presetKeys[index - 1]
    return presets[presetKey]
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

        // If running in auto mode (from installer), skip if config exists
        if (process.env.TOOLKIT_AUTO_MODE === 'true') {
            console.log(`✅ ${configName} already exists - skipping setup`)
            console.log(`   To reconfigure, run: bun ai-toolkit-shared/scripts/init.js\n`)
            return false
        }

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
 * Main init function
 * @returns {Promise<void>}
 */
async function init() {
    // Import terminal utilities for better output
    const { printBanner, printSection, printStep, printSuccess, printInfo, printProgress, printBox, printList, printWarning } = await import('./lib/terminal.js')

    // Display welcome banner
    printBanner('CouchCMS AI Toolkit', 'Interactive Setup Wizard', '🚀')

    // Determine project directory
    const { projectDir } = determineProjectDirectory(process.cwd())

    // Check for existing config files
    const shouldContinue = await checkExistingConfig(projectDir)
    if (!shouldContinue) {
        process.exit(0)
    }

    printSection('Getting Started', '📋')
    printInfo('This wizard will guide you through setting up your project configuration.', 2)
    printInfo('Each step is clearly marked and you can always go back or cancel.', 2)
    console.log()

    // Auto-detect project information
    printStep(1, 5, 'Detecting project information...')
    printProgress('Analyzing your project structure...', 2)

    const detected = detectProject(projectDir)

    printBox(
        `Project Type: ${detected.type}\n` +
        `Frameworks: ${detected.frameworks.join(', ') || 'none detected'}\n` +
        `Languages: ${detected.languages.join(', ')}`,
        { title: 'Project Detection Results', icon: '🔍', color: 'cyan' },
        2
    )

    // Ask for setup mode (unless auto mode from installer)
    let autoMode, presetMode, simpleMode

    printStep(2, 5, 'Selecting setup mode...')

    if (process.env.TOOLKIT_AUTO_MODE === 'true') {
        printInfo('Setup mode: Auto (from installer)', 2)
        autoMode = true
        presetMode = false
        simpleMode = false
    } else {
        printBox(
            '1. Auto (recommended) - Use detected settings\n' +
            '   ✓ Fastest option\n' +
            '   ✓ Automatically configures everything\n' +
            '   ✓ Perfect for 95% of projects\n\n' +
            '2. Preset - Choose from common project types\n' +
            '   ✓ Blog, E-commerce, Web App, etc.\n' +
            '   ✓ Pre-configured modules and agents\n\n' +
            '3. Simple - Quick setup with defaults\n' +
            '   ✓ All CouchCMS modules included\n' +
            '   ✓ Minimal questions\n\n' +
            '4. Custom - Full control over all options\n' +
            '   ✓ Choose every module and agent\n' +
            '   ✓ Advanced configuration',
            { title: 'Setup Mode Options', icon: '🎯', color: 'cyan' },
            2
        )

        const modeChoice = await prompt('\nChoice [1-4]', '1')
        autoMode = modeChoice === '1'
        presetMode = modeChoice === '2'
        simpleMode = modeChoice === '3'

        if (autoMode) {
            printSuccess('Selected: Auto mode (recommended)', 2)
        } else if (presetMode) {
            printSuccess('Selected: Preset mode', 2)
        } else if (simpleMode) {
            printSuccess('Selected: Simple mode', 2)
        } else {
            printSuccess('Selected: Custom mode', 2)
        }
    }
    console.log()

    // Select preset if in preset mode
    let selectedPreset = null
    if (presetMode) {
        printStep(2, 5, 'Selecting project preset...')
        selectedPreset = await selectPreset()
        if (!selectedPreset) {
            printInfo('No preset selected, falling back to simple mode', 2)
            simpleMode = true
            autoMode = false
            presetMode = false
        } else {
            printSuccess(`Selected preset: ${selectedPreset.name}`, 2)
        }
        console.log()
    }

    // Determine config path (always .project/standards.md now)
    const { configPath, configDir } = await determineConfigPath(projectDir, true)

    const isCustomMode = !simpleMode && !autoMode && !presetMode

    printStep(3, 5, 'Reviewing configuration summary...')

    if (autoMode) {
        const { printConfigSummary } = await import('./lib/index.js')
        printConfigSummary({
            title: 'Auto mode: Using detected settings',
            project: detected.name,
            type: detected.type,
            modules: getRecommendedModules(detected),
            agents: getRecommendedAgents(detected)
        })
    } else if (presetMode && selectedPreset) {
        printBox(
            `Description: ${selectedPreset.description}\n\n` +
            `Modules: ${selectedPreset.modules.join(', ')}\n\n` +
            `Agents: ${selectedPreset.agents.join(', ')}`,
            { title: `Preset: ${selectedPreset.name}`, icon: '✨', color: 'cyan' },
            2
        )
    } else if (simpleMode) {
        printBox(
            'Configuration: .project/standards.md\n\n' +
            'Modules: ALL CouchCMS modules + TailwindCSS + Alpine.js\n\n' +
            'Agents: ALL CouchCMS agents + TailwindCSS + Alpine.js\n\n' +
            'Framework: Disabled (can be enabled later in standards.md)',
            { title: 'Simple Mode: CouchCMS Complete', icon: '✨', color: 'cyan' },
            2
        )
        printInfo('💡 This gives you full CouchCMS support out of the box!', 2)
        console.log()
    } else if (isCustomMode) {
        printInfo('Custom mode: Full control', 2)
        printInfo('We\'ll ask you a few grouped questions...', 2)
        console.log()
    }

    // Group 1: Project Information
    if (isCustomMode) {
        printSection('Project Information', '📋')
    }

    printStep(4, 5, 'Gathering project information...')

    // Gather project information
    const projectName = process.env.TOOLKIT_PROJECT_NAME ||
        (autoMode ? detected.name : await prompt(isCustomMode ? 'Project name' : '\n📝 Project name', detected.name))
    const projectDescription = process.env.TOOLKIT_PROJECT_DESC ||
        (autoMode ? detected.description : await prompt('Project description', detected.description))

    if (projectName && projectDescription) {
        printSuccess(`Project: ${projectName}`, 2)
        printInfo(`Description: ${projectDescription}`, 2)
        console.log()
    }

    // Group 2: Toolkit and Configuration (only in custom mode)
    if (isCustomMode) {
        console.log('\n📋 Group 2: Toolkit and Configuration\n')
    }

    // Determine toolkit path - auto-detect first, then allow override
    let toolkitPath = detectToolkitPath(projectDir)

    // Fallback to default if auto-detection failed
    if (!toolkitPath) {
        const toolkitDirName = basename(TOOLKIT_ROOT)
        toolkitPath = `./${toolkitDirName}`
    }

    if (toolkitPath && toolkitPath !== './ai-toolkit-shared') {
        console.log(`📦 Toolkit location (auto-detected): ${toolkitPath}`)
    } else {
        console.log(`📦 Toolkit location: ${toolkitPath}`)
    }

    if (isCustomMode) {
        const changeLocation = await confirm('Use different location?', false)
        if (changeLocation) {
            toolkitPath = await prompt('Toolkit path', toolkitPath)
        }
    }

    // Resolve absolute toolkit path and check dependencies
    const resolvedToolkitPath = resolveToolkitPath(toolkitPath, projectDir, TOOLKIT_ROOT)

    printProgress('Checking dependencies...', 2)
    if (typeof checkAndInstallDependencies === 'function') {
        try {
            await checkAndInstallDependencies(resolvedToolkitPath)
            printSuccess('Dependencies are installed', 2)
        } catch (error) {
            printWarning(`Dependency check failed: ${error.message}`, 2)
            printWarning('Continuing with setup, but some features may not work correctly', 2)
            printInfo('💡 Tip: Run "bun install" in the toolkit directory to fix this', 2)
        }
    } else {
        printWarning('Dependency checker not available, skipping dependency check', 2)
    }
    console.log()

    // Group 3: Modules and Agents (combined in custom mode)
    if (isCustomMode) {
        console.log('\n📋 Group 3: Modules and Agents\n')
        console.log('Select which modules and agents to use.\n')
    }

    let selectedModules, selectedAgents

    if (autoMode) {
        selectedModules = getRecommendedModules(detected)
        selectedAgents = getRecommendedAgents(detected)
    } else if (presetMode && selectedPreset) {
        selectedModules = selectedPreset.modules
        selectedAgents = selectedPreset.agents
    } else {
        selectedModules = await selectModules(simpleMode)
        selectedAgents = await selectAgents(simpleMode)
    }

    // Group 4: Editor/Tool Selection (always optional)
    let selectedEditors
    if (autoMode) {
        // Auto mode: Ask user which editors they want (default to none)
        console.log('\n🛠️  Editor/Tool Selection (optional)')
        console.log('   Templates will only be generated for the editors you select.')
        console.log('   You can skip this and add templates later by editing .project/standards.md')
        selectedEditors = await selectEditors(false) // Use full selection in auto mode
    } else {
        selectedEditors = await selectEditors(simpleMode)
    }

    if (selectedEditors.length === 0) {
        console.log('\nℹ️  No editors selected - templates will not be generated')
        console.log('   You can add templates later by editing .project/standards.md and running sync')
    } else {
        console.log(`\n✓ Selected ${selectedEditors.length} editor(s): ${selectedEditors.join(', ')}`)
    }

    // Group 5: Advanced Options (only shown in custom mode, with progressive disclosure)
    let frameworkConfig
    let contextPath = null

    if (presetMode && selectedPreset) {
        frameworkConfig = selectedPreset.framework
    } else if (isCustomMode) {
        console.log('\n📋 Group 5: Advanced Options (Optional)\n')
        const showAdvanced = await confirm('Configure advanced options (framework, context directory)?', false)

        if (showAdvanced) {
            frameworkConfig = await selectFramework(false)
            contextPath = await selectContextDirectory(false)
        } else {
            frameworkConfig = { enabled: false }
        }
    } else {
        frameworkConfig = await selectFramework(simpleMode || autoMode)
        contextPath = await selectContextDirectory(simpleMode || autoMode)
    }

    // Generate standards.md file
    await generateStandardsFile({
        projectDir,
        configPath,
        configDir,
        projectName,
        projectDescription,
        toolkitPath,
        toolkitRoot: TOOLKIT_ROOT,
        selectedModules,
        selectedAgents,
        selectedEditors,
        frameworkConfig,
    })

    // Create context directory if requested
    await setupContextDirectory(projectDir, projectName, contextPath)

    // Ask for confirmation before cleaning (Question 5 in simple mode)
    printStep(5, 5, 'Finalizing setup...')
    printInfo('Clean existing generated files before sync?', 2)
    const confirmed = await confirm('This will remove all existing AI config files', true)

    if (confirmed) {
        printProgress('Cleaning existing files...', 2)
        // Convert selectedEditors array to object format for cleanup function
        const editorsConfig = selectedEditors.reduce((acc, editor) => {
            acc[editor] = true
            return acc
        }, {})
        cleanGeneratedFiles(projectDir, true, editorsConfig)
        printSuccess('Cleaned existing files', 2)
    }
    console.log()

    // Run initial sync
    printProgress('Generating AI configurations...', 0)
    await runInitialSync(projectDir, TOOLKIT_ROOT)

    // Display success message
    displaySuccessMessage(configPath, contextPath)

    process.exit(0)
}

// Setup stdin for interactive input
process.stdin.setEncoding('utf8')
// setRawMode is not available in Bun, so check if it exists before calling
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run
init().catch(error => {
    handleError(error, 'Setup failed')
})
