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
import { fileURLToPath } from 'url'
import { findConfigFile, getConfigFileName, handleError } from './utils/utils.js'
import { prompt, confirm, selectModules, selectAgents, selectFramework } from './lib/prompts.js'
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
import yaml from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

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
 * Load available presets
 * @returns {Object} Presets configuration
 */
function loadPresets() {
    const presetsPath = join(TOOLKIT_ROOT, 'presets.yaml')
    
    if (!existsSync(presetsPath)) {
        return {}
    }

    try {
        const content = readFileSync(presetsPath, 'utf8')
        const data = yaml.parse(content)
        return data.presets || {}
    } catch {
        return {}
    }
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

    // Determine config path
    const { configPath, configDir } = await determineConfigPath(projectDir, simpleMode || autoMode || presetMode)

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
        console.log('\n✨ Simple mode: Using recommended defaults')
        console.log('   - Configuration: .project/standards.md')
        console.log('   - Modules: Standard preset (core + tailwindcss + alpinejs)')
        console.log('   - Agents: Standard preset (couchcms + tailwindcss + alpinejs)')
        console.log('   - Framework: Disabled (can be enabled later in standards.md)')
    }

    // Gather project information (Questions 1-2 in simple/auto mode)
    // Check if provided via environment (from installer)
    const projectName = process.env.TOOLKIT_PROJECT_NAME || 
        (autoMode ? detected.name : await prompt('\n📝 Project name', detected.name))
    const projectDescription = process.env.TOOLKIT_PROJECT_DESC ||
        (autoMode ? detected.description : await prompt('Project description', detected.description))

    // Determine toolkit path (Question 3 in custom mode only)
    let toolkitPath = './ai-toolkit-shared'
    if (!simpleMode) {
        console.log('\n📦 How do you want to use the toolkit?')
        console.log('  1. As a git submodule (recommended)')
        console.log('  2. Cloned in home directory')
        const toolkitChoice = await prompt('Choice [1-2]', '1')
        toolkitPath = toolkitChoice === '2' ? '~/couchcms-ai-toolkit' : './ai-toolkit-shared'
    }

    // Select modules and agents
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

    // Select framework configuration
    let frameworkConfig
    
    if (presetMode && selectedPreset) {
        frameworkConfig = selectedPreset.framework
    } else {
        frameworkConfig = await selectFramework(simpleMode || autoMode)
    }

    // Select context directory (custom mode only)
    const contextPath = await selectContextDirectory(simpleMode || autoMode)

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
