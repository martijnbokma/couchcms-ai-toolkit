#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Standards Creator
 *
 * Interactive wizard to create standards.md from simple user input
 * Guides users step-by-step through project setup
 *
 * Usage:
 *   bun ai-toolkit/scripts/create-standards.js
 */

import { existsSync, readFileSync } from 'fs'
import { resolve, dirname, basename, join } from 'path'
<<<<<<< HEAD
=======
import { fileURLToPath } from 'url'
>>>>>>> eb63280 (updates 2025-12-01)
import { findConfigFile, getConfigFileName, handleError, resolveToolkitPath } from './utils/utils.js'
import { prompt, confirm } from './lib/prompts.js'
import {
    determineConfigPath,
    generateStandardsFile,
    setupContextDirectory,
    cleanGeneratedFiles
} from './lib/config-generator.js'
import { runInitialSync, displaySuccessMessage } from './lib/sync-runner.js'
import { checkAndInstallDependencies } from './lib/dependency-checker.js'
import { detectToolkitPath } from './lib/toolkit-detector.js'
import {
    isFirstTimeUser,
    showWelcomeMessage,
    showConceptExplanation,
    showProgress,
    getConceptExplanation,
    showSummary
} from './lib/onboarding.js'
<<<<<<< HEAD
import { getToolkitRootCached, loadPresets } from './lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()
=======
import yaml from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')

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
>>>>>>> eb63280 (updates 2025-12-01)

/**
 * Ask user about their project in simple terms
 * @param {boolean} isFirstTime - Whether this is a first-time user
 * @returns {Promise<Object>} Project information
 */
async function gatherProjectInfo(isFirstTime) {
    showProgress(1, 5, 'Project Information')
    console.log('\n📝 Tell me about your project\n')

    if (isFirstTime) {
        console.log('Just answer a few simple questions...\n')
    }

    // Question 1: Project name
    const projectName = await prompt('What is your project called?', 'my-project')

    // Question 2: Project description
    console.log('\nGreat! Now describe what your project does.')
    console.log('(Keep it short - one sentence is fine)\n')
    const projectDescription = await prompt('Project description', 'A CouchCMS web application')

    // Question 3: Project type
    console.log('\n🎯 What type of project are you building?')
    if (isFirstTime) {
        const explain = await prompt('(Type "?" for explanation, or choose 1-7)', '')
        if (explain === '?') {
            showConceptExplanation('project type', getConceptExplanation('project type') || '')
            return gatherProjectInfo(isFirstTime) // Restart this question
        }
    }
    console.log('\n  1. Landing Page - Simple website with a few pages')
    console.log('  2. Blog - Blog with articles and comments')
    console.log('  3. Portfolio - Showcase your work')
    console.log('  4. Web Application - Full app with user accounts')
    console.log('  5. E-commerce - Online store')
    console.log('  6. Documentation - Documentation site')
    console.log('  7. Other - I\'ll configure it myself')

    const typeChoice = await prompt('\nChoice [1-7]', '1')
    const projectTypes = {
        '1': 'landing-page',
        '2': 'blog',
        '3': 'portfolio',
        '4': 'webapp',
        '5': 'ecommerce',
        '6': 'documentation',
        '7': 'custom'
    }
    const projectType = projectTypes[typeChoice] || 'custom'

    return { projectName, projectDescription, projectType }
}

/**
 * Ask about technologies in simple terms
 * @param {string} projectType - Selected project type
 * @param {boolean} isFirstTime - Whether this is a first-time user
 * @returns {Promise<Object>} Technology selections
 */
async function gatherTechnologyInfo(projectType, isFirstTime) {
    console.log('\n🛠️  Which technologies do you want to use?')
    if (isFirstTime) {
        const explain = await prompt('(Type "?" for explanation, or continue)', '')
        if (explain === '?') {
            showConceptExplanation('styling framework', getConceptExplanation('styling framework') || '')
            showConceptExplanation('interactivity', getConceptExplanation('interactivity') || '')
        }
    }
    console.log()

    // Load preset for this project type
    const presets = loadPresets()
    const preset = presets[projectType]

    if (preset && projectType !== 'custom') {
        console.log(`Based on your project type (${preset.name}), I recommend:\n`)
        console.log(`  Modules: ${preset.modules.join(', ')}`)
        console.log(`  Agents: ${preset.agents.join(', ')}\n`)

        const useRecommended = await confirm('Use these recommended settings?', true)

        if (useRecommended) {
            return {
                modules: preset.modules,
                agents: preset.agents,
                framework: preset.framework
            }
        }
    }

    // Custom selection
    console.log('Let\'s configure your technologies step by step...\n')

    // Styling framework
    console.log('💅 Styling Framework:\n')
    console.log('  1. TailwindCSS only')
    console.log('  2. TailwindCSS + daisyUI (recommended)')
    console.log('  3. None - I\'ll use custom CSS')

    const stylingChoice = await prompt('\nChoice [1-3]', '2')
    const useTailwind = stylingChoice !== '3'
    const useDaisyUI = stylingChoice === '2'

    // Interactivity
    console.log('\n⚡ Interactivity:\n')
    console.log('  1. Alpine.js (recommended for most projects)')
    console.log('  2. Alpine.js + TypeScript (for complex apps)')
    console.log('  3. HTMX (for server-side interactions)')
    console.log('  4. None - Static site')

    const interactivityChoice = await prompt('\nChoice [1-4]', '1')
    const useAlpine = ['1', '2'].includes(interactivityChoice)
    const useTypeScript = interactivityChoice === '2'
    const useHTMX = interactivityChoice === '3'

    // Note: All CouchCMS features are included by default
    // No need to ask about forms, users, search, comments - they're all included!

    // Build modules list - Start with ALL CouchCMS modules
    const modules = [
        'couchcms-core',
        'databound-forms',
        'custom-routes',
        'folders',
        'archives',
        'relationships',
        'repeatable-regions',
        'search',
        'pagination',
        'comments',
        'users'
    ]

    // Add frontend frameworks based on user choice
    if (useTailwind) modules.push('tailwindcss')
    if (useDaisyUI) modules.push('daisyui')
    if (useAlpine) modules.push('alpinejs')
    if (useTypeScript) modules.push('typescript')
    if (useHTMX) modules.push('htmx')

    // Build agents list - Start with ALL CouchCMS agents
    const agents = [
        'couchcms',
        'databound-forms',
        'custom-routes',
        'folders',
        'archives',
        'relationships',
        'repeatable-regions',
        'search',
        'pagination',
        'comments',
        'users',
        'views',
        'nested-pages',
        'photo-gallery',
        'rss-feeds',
        'on-page-editing',
        'admin-panel-theming'
    ]

    // Add frontend framework agents based on user choice
    if (useTailwind) agents.push('tailwindcss')
    if (useAlpine) agents.push('alpinejs')
    if (useTypeScript) agents.push('typescript')

    // Framework
    console.log('\n🤖 AI Framework:\n')
    console.log('The AAPF framework helps AI agents work more systematically.')
    const useFramework = await confirm('Enable AI framework?', projectType === 'webapp')

    const frameworkConfig = useFramework ? {
        enabled: true,
        categories: ['doctrine', 'directives']
    } : {
        enabled: false
    }

    return { modules, agents, framework: frameworkConfig }
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
        console.log(`\n⚠️  ${configName} already exists in this directory\n`)
        const overwrite = await confirm(`Overwrite existing ${configName}?`, false)

        if (!overwrite) {
            console.log('\n❌ Setup cancelled\n')
            return false
        }
    }

    return true
}

/**
 * Main function
 * @returns {Promise<void>}
 */
async function main() {
    const projectDir = process.cwd()
    const isFirstTime = isFirstTimeUser(projectDir)

    if (isFirstTime) {
        showWelcomeMessage()
    } else {
        console.log('✨ CouchCMS AI Toolkit - Simple Standards Creator\n')
        console.log('Updating your existing configuration...\n')
    }

    // Check for existing config
    const shouldContinue = await checkExistingConfig(projectDir)
    if (!shouldContinue) {
        process.exit(0)
    }

    // Gather project information
    const projectInfo = await gatherProjectInfo(isFirstTime)

    // Gather technology information
    showProgress(2, 5, 'Technology Selection')
    const techInfo = await gatherTechnologyInfo(projectInfo.projectType, isFirstTime)

    // Determine toolkit path - auto-detect first
    let toolkitPath = detectToolkitPath(projectDir)

    // Fallback to default if auto-detection failed
    if (!toolkitPath) {
        const toolkitDirName = basename(TOOLKIT_ROOT)
        toolkitPath = `./${toolkitDirName}`
    }

    if (toolkitPath && toolkitPath !== './ai-toolkit-shared') {
        console.log(`\n📦 Toolkit location (auto-detected): ${toolkitPath}`)
    }

    // Resolve absolute toolkit path and check dependencies
    const resolvedToolkitPath = resolveToolkitPath(toolkitPath, projectDir, TOOLKIT_ROOT)
    try {
        await checkAndInstallDependencies(resolvedToolkitPath)
    } catch (error) {
        console.error(`\n❌ ${error.message}\n`)
        process.exit(1)
    }

    // Use simple config path (.project/standards.md)
    const { configPath, configDir } = await determineConfigPath(projectDir, true)

    // Show summary
    showProgress(4, 5, 'Review Configuration')
    showSummary({
        projectName: projectInfo.projectName,
        projectDescription: projectInfo.projectDescription,
        projectType: projectInfo.projectType,
        configPath: configPath,
        modules: techInfo.modules,
        agents: techInfo.agents,
        framework: techInfo.framework.enabled
    })

    const confirmed = await confirm('\nCreate standards.md with these settings?', true)

    if (!confirmed) {
        console.log('\n❌ Cancelled\n')
        process.exit(0)
    }

    // Generate standards.md file
    showProgress(5, 5, 'Generating Configuration')
    await generateStandardsFile({
        projectDir,
        configPath,
        configDir,
        projectName: projectInfo.projectName,
        projectDescription: projectInfo.projectDescription,
        toolkitPath,
        toolkitRoot: TOOLKIT_ROOT,
        selectedModules: techInfo.modules,
        selectedAgents: techInfo.agents,
        frameworkConfig: techInfo.framework,
    })

    // Create context directory
    await setupContextDirectory(projectDir, projectInfo.projectName, '.project/context')

    // Ask about cleaning existing files
    console.log('\n🧹 Clean existing AI config files?\n')
    const cleanConfirmed = await confirm('Remove old generated files before sync?', true)

    if (cleanConfirmed) {
        cleanGeneratedFiles(projectDir, true)
    }

    // Run initial sync
    await runInitialSync(projectDir, TOOLKIT_ROOT)

    // Display success message
    displaySuccessMessage(configPath, '.project/context')

    console.log('\n💡 Next steps:\n')
    console.log('  1. Review .project/standards.md')
    console.log('  2. Add project-specific rules at the bottom')
    console.log('  3. Run "bun ai-toolkit-shared/scripts/sync.js" to update configs\n')

    process.exit(0)
}

// Setup stdin for interactive input
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run
main().catch(error => {
    handleError(error, 'Standards creation failed')
})
