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
    console.log('🚀 CouchCMS AI Toolkit - Interactive Setup\n')

    // Determine project directory
    const { projectDir } = determineProjectDirectory(process.cwd())

    // Check for existing config files
    const shouldContinue = await checkExistingConfig(projectDir)
    if (!shouldContinue) {
        process.exit(0)
    }

    console.log("Let's set up your project configuration...\n")

    // Auto-detect project information
    console.log('🔍 Detecting project...')
    const detected = detectProject(projectDir)
    console.log(`   Type: ${detected.type}`)
    console.log(`   Frameworks: ${detected.frameworks.join(', ') || 'none detected'}`)
    console.log(`   Languages: ${detected.languages.join(', ')}`)
    console.log()

    // Ask for setup mode (unless auto mode from installer)
    let autoMode, presetMode, simpleMode

    if (process.env.TOOLKIT_AUTO_MODE === 'true') {
        console.log('🎯 Setup mode: Auto (from installer)')
        autoMode = true
        presetMode = false
        simpleMode = false
    } else {
        console.log('🎯 Setup mode:')
        console.log('  1. Auto (recommended) - Use detected settings')
        console.log('  2. Preset - Choose from common project types')
        console.log('  3. Simple - Quick setup with defaults')
        console.log('  4. Custom - Full control over all options')
        const modeChoice = await prompt('Choice [1-4]', '1')
        autoMode = modeChoice === '1'
        presetMode = modeChoice === '2'
        simpleMode = modeChoice === '3'
    }

    // Select preset if in preset mode
    let selectedPreset = null
    if (presetMode) {
        selectedPreset = await selectPreset()
        if (!selectedPreset) {
            console.log('\n⚠️  No preset selected, falling back to simple mode')
        }
    }

    // Determine config path (always .project/standards.md now)
    const { configPath, configDir } = await determineConfigPath(projectDir, true)

    const isCustomMode = !simpleMode && !autoMode && !presetMode

    if (autoMode) {
        console.log('\n✨ Auto mode: Using detected settings')
        console.log(`   - Project: ${detected.name}`)
        console.log(`   - Type: ${detected.type}`)
        console.log(`   - Modules: ${getRecommendedModules(detected).join(', ')}`)
        console.log(`   - Agents: ${getRecommendedAgents(detected).join(', ')}`)
    } else if (presetMode && selectedPreset) {
        console.log(`\n✨ Preset: ${selectedPreset.name}`)
        console.log(`   - ${selectedPreset.description}`)
        console.log(`   - Modules: ${selectedPreset.modules.join(', ')}`)
        console.log(`   - Agents: ${selectedPreset.agents.join(', ')}`)
    } else if (simpleMode) {
        console.log('\n✨ Simple mode: Using CouchCMS Complete preset')
        console.log('   - Configuration: .project/standards.md')
        console.log('   - Modules: ALL CouchCMS modules + TailwindCSS + Alpine.js')
        console.log('   - Agents: ALL CouchCMS agents + TailwindCSS + Alpine.js')
        console.log('   - Framework: Disabled (can be enabled later in standards.md)')
        console.log('\n   💡 This gives you full CouchCMS support out of the box!')
    } else if (isCustomMode) {
        console.log('\n✨ Custom mode: Full control')
        console.log('   We\'ll ask you a few grouped questions...\n')
    }

    // Group 1: Project Information
    if (isCustomMode) {
        console.log('📋 Group 1: Project Information\n')
    }

    // Gather project information
    const projectName = process.env.TOOLKIT_PROJECT_NAME ||
        (autoMode ? detected.name : await prompt(isCustomMode ? 'Project name' : '\n📝 Project name', detected.name))
    const projectDescription = process.env.TOOLKIT_PROJECT_DESC ||
        (autoMode ? detected.description : await prompt('Project description', detected.description))

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
    if (typeof checkAndInstallDependencies === 'function') {
        try {
            await checkAndInstallDependencies(resolvedToolkitPath)
        } catch (error) {
            console.warn(`\n⚠️  Dependency check failed: ${error.message}`)
            console.warn('⚠️  Continuing with setup, but some features may not work correctly')
            console.warn('⚠️  Run "bun install" in the toolkit directory to fix this\n')
        }
    } else {
        console.warn('⚠️  Dependency checker not available, skipping dependency check\n')
    }

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

    // Group 4: Editor/Tool Selection
    let selectedEditors
    if (autoMode) {
        // Auto mode: Default to Cursor, Windsurf, and Claude
        selectedEditors = ['cursor', 'windsurf', 'claude']
        console.log('\n🛠️  Editor selection (auto):')
        console.log('   ✓ Cursor - Cursor IDE')
        console.log('   ✓ Windsurf - Windsurf IDE')
        console.log('   ✓ Claude Code - Claude Code')
    } else {
        selectedEditors = await selectEditors(simpleMode)
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
    console.log('\n🧹 Clean existing generated files before sync?')
    const confirmed = await confirm('This will remove all existing AI config files', true)

    if (confirmed) {
        cleanGeneratedFiles(projectDir, true)
    }

    // Run initial sync
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
