#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Unified CLI Entry Point
 *
 * Single command interface for all toolkit operations
 * Usage: toolkit [subcommand] [options]
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'
import { checkAndInstallDependencies } from './lib/dependency-checker.js'
import { getToolkitRootCached } from './lib/paths.js'
import { readPreference, writePreference, COMPLEXITY_LEVELS, getComplexityDescription } from './lib/setup-preference-manager.js'
import { info, success, error as logError } from './lib/logger.js'
import { printBanner, printSuccess, printInfo, printError } from './lib/terminal.js'
import { prompt } from './lib/prompts.js'

// Import subcommand handlers (will be created)
// import { handleInstall } from './lib/commands/install.js'
// import { handleSetup } from './lib/commands/setup.js'
// import { handleSync } from './lib/commands/sync.js'
// import { handleValidate } from './lib/commands/validate.js'
// import { handleHealth } from './lib/commands/health.js'
// import { handleReconfigure } from './lib/commands/reconfigure.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * Show setup complexity choice menu
 * @returns {Promise<string>} Selected complexity level
 */
async function showComplexityMenu() {
    console.log('\n' + '='.repeat(70))
    console.log('  What kind of setup do you want?')
    console.log('='.repeat(70) + '\n')

    const descriptions = [
        {
            level: COMPLEXITY_LEVELS.EASY,
            number: 1,
            name: 'Makkelijk (Easy)',
            time: '1 minute',
            questions: 2,
            includes: 'All CouchCMS modules/agents (automatic) + TailwindCSS + Alpine.js (recommended defaults)',
            perfectFor: 'Getting started quickly'
        },
        {
            level: COMPLEXITY_LEVELS.MEDIUM,
            number: 2,
            name: 'Gemiddeld (Medium)',
            time: '3 minutes',
            questions: 5,
            includes: 'All CouchCMS modules/agents (automatic) + Choose CSS framework + Choose JS framework',
            perfectFor: 'Most projects, want to choose frameworks'
        },
        {
            level: COMPLEXITY_LEVELS.COMPREHENSIVE,
            number: 3,
            name: 'Uitgebreid (Comprehensive)',
            time: '5 minutes',
            questions: 8,
            includes: 'All CouchCMS modules/agents (automatic) + All frontend options + Advanced configuration',
            perfectFor: 'Complete control over frontend setup'
        }
    ]

    descriptions.forEach(desc => {
        console.log(`  ${desc.number}. ${desc.name}`)
        console.log(`     → Quick setup: ${desc.time}, ${desc.questions} ${desc.questions === 1 ? 'question' : 'questions'}`)
        console.log(`     → Includes: ${desc.includes}`)
        console.log(`     → Perfect for: ${desc.perfectFor}`)
        console.log()
    })

    const answer = await prompt(`Choice [1-3]`, '1')
    const choice = parseInt(answer)

    if (choice >= 1 && choice <= 3) {
        const selected = descriptions[choice - 1]
        printSuccess(`Selected: ${selected.name}`)
        return selected.level
    }

    // Default to easy
    printInfo('Invalid choice, defaulting to Easy')
    return COMPLEXITY_LEVELS.EASY
}

/**
 * Handle install subcommand
 * @param {string} projectDir - Project directory
 * @param {Object} options - Command options
 */
async function handleInstall(projectDir, options) {
    printBanner('CouchCMS AI Toolkit', 'Installation', '🚀')

    // Check dependencies first
    printInfo('Checking dependencies...')
    try {
        await checkAndInstallDependencies(TOOLKIT_ROOT)
    } catch (error) {
        // Try to get solution for error
        try {
            const { getSolutionForError, formatSolution } = await import('./lib/error-solutions.js')
            const solution = getSolutionForError(error)
            printError(`Failed to install dependencies: ${error.message}`)
            if (solution) {
                console.log(formatSolution(solution))
            }
        } catch {
            printError(`Failed to install dependencies: ${error.message}`)
        }
        process.exit(1)
    }

    // Show complexity menu if not specified
    let complexity = options.complexity || readPreference(projectDir)

    if (!complexity) {
        complexity = await showComplexityMenu()
        writePreference(projectDir, complexity)
    } else if (!Object.values(COMPLEXITY_LEVELS).includes(complexity)) {
        printError(`Invalid complexity: ${complexity}. Must be: easy, medium, or comprehensive`)
        process.exit(1)
    }

    // Route to setup flow based on complexity
    // This will be implemented in setup-flow.js
    printInfo(`Starting ${getComplexityDescription(complexity).name} setup...`)

    // Import and call setup handler
    const { runSetupFlow } = await import('./lib/setup-flow.js')
    await runSetupFlow(projectDir, complexity, options)
}

/**
 * Handle setup subcommand
 * @param {string} projectDir - Project directory
 * @param {Object} options - Command options
 */
async function handleSetup(projectDir, options) {
    printBanner('CouchCMS AI Toolkit', 'Project Setup', '⚙️')

    // Check dependencies
    try {
        await checkAndInstallDependencies(TOOLKIT_ROOT)
    } catch (err) {
        // Try to get solution for error
        try {
            const { getSolutionForError, formatSolution } = await import('./lib/error-solutions.js')
            const solution = getSolutionForError(err)
            printError(`Failed to check dependencies: ${err.message}`)
            if (solution) {
                console.log(formatSolution(solution))
            }
        } catch {
            printError(`Failed to check dependencies: ${err.message}`)
        }
        process.exit(1)
    }

    // Determine complexity
    let complexity = options.complexity || readPreference(projectDir)

    if (options.showAll) {
        complexity = COMPLEXITY_LEVELS.COMPREHENSIVE
    } else if (!complexity) {
        complexity = await showComplexityMenu()
        writePreference(projectDir, complexity)
    }

    // Route to setup flow
    const { runSetupFlow } = await import('./lib/setup-flow.js')
    await runSetupFlow(projectDir, complexity, options)
}

/**
 * Handle reconfigure subcommand
 * @param {string} projectDir - Project directory
 */
async function handleReconfigure(projectDir) {
    printBanner('CouchCMS AI Toolkit', 'Reconfigure', '🔄')

    const currentPreference = readPreference(projectDir)

    if (currentPreference) {
        const desc = getComplexityDescription(currentPreference)
        printInfo(`Current setup complexity: ${desc.name}`)
    } else {
        printInfo('No stored preference found')
    }

    console.log('\nChoose new setup complexity:')
    const newComplexity = await showComplexityMenu()
    writePreference(projectDir, newComplexity)

    printSuccess(`Updated preference to: ${getComplexityDescription(newComplexity).name}`)

    // Ask if user wants to run setup now
    const { confirm } = await import('./lib/prompts.js')
    const runSetup = await confirm('Run setup with new complexity?', true)

    if (runSetup) {
        await handleSetup(projectDir, { complexity: newComplexity })
    }
}

/**
 * Handle sync subcommand
 * @param {string} projectDir - Project directory
 */
async function handleSync(projectDir) {
    // Execute sync.js script
    const syncScript = join(TOOLKIT_ROOT, 'scripts', 'sync.js')
    const result = spawnSync('bun', [syncScript], {
        cwd: projectDir,
        stdio: 'inherit'
    })
    process.exit(result.status || 0)
}

/**
 * Handle validate subcommand
 * @param {string} projectDir - Project directory
 */
async function handleValidate(projectDir) {
    // Execute validate.js script
    const validateScript = join(TOOLKIT_ROOT, 'scripts', 'validate.js')
    const result = spawnSync('bun', [validateScript], {
        cwd: projectDir,
        stdio: 'inherit'
    })
    process.exit(result.status || 0)
}

/**
 * Handle health subcommand
 * @param {string} projectDir - Project directory
 */
async function handleHealth(projectDir) {
    // Execute health.js script
    const healthScript = join(TOOLKIT_ROOT, 'scripts', 'health.js')
    const result = spawnSync('bun', [healthScript], {
        cwd: projectDir,
        stdio: 'inherit'
    })
    process.exit(result.status || 0)
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
CouchCMS AI Toolkit - Unified CLI

Usage:
  toolkit [subcommand] [options]

Subcommands:
  install          Install toolkit (first-time setup)
  setup            Configure project (progressive disclosure based on complexity)
  reconfigure      Change complexity preference and reconfigure
  sync             Generate configs from standards.md
  validate         Check configuration
  health           Check installation status
  browse           Browse modules/agents interactively
  update           Update toolkit
  help             Show this help message

Options:
  --complexity=<level>    Setup complexity: easy, medium, comprehensive
  --show-all              Show all options (temporary override)

Examples:
  toolkit install                    # First-time installation
  toolkit setup                      # Configure project
  toolkit setup --complexity=easy    # Quick setup
  toolkit reconfigure                # Change complexity preference
  toolkit sync                       # Generate configs
  toolkit health                     # Check installation

For more information, see: docs/START-HERE.md
`)
}

/**
 * Main entry point
 */
async function main() {
    const args = process.argv.slice(2)
    const projectDir = process.cwd()

    // No arguments: show help or run install if first time
    if (args.length === 0) {
        const configPath = join(projectDir, '.project', 'standards.md')
        if (!existsSync(configPath)) {
            // First time: run install
            await handleInstall(projectDir, {})
        } else {
            // Show help
            showHelp()
        }
        return
    }

    const subcommand = args[0]
    const options = {}

    // Parse options
    for (let i = 1; i < args.length; i++) {
        const arg = args[i]
        if (arg.startsWith('--complexity=')) {
            options.complexity = arg.split('=')[1]
        } else if (arg === '--show-all') {
            options.showAll = true
        }
    }

    // Route to appropriate handler
    switch (subcommand) {
        case 'install':
            await handleInstall(projectDir, options)
            break
        case 'setup':
            await handleSetup(projectDir, options)
            break
        case 'reconfigure':
            await handleReconfigure(projectDir)
            break
        case 'sync':
            await handleSync(projectDir)
            break
        case 'validate':
            await handleValidate(projectDir)
            break
        case 'health':
            await handleHealth(projectDir)
            break
        case 'browse':
            // Execute browse.js script
            const browseScript = join(TOOLKIT_ROOT, 'scripts', 'browse.js')
            const browseResult = spawnSync('bun', [browseScript, ...args.slice(1)], {
                cwd: projectDir,
                stdio: 'inherit'
            })
            process.exit(browseResult.status || 0)
            break
        case 'update':
            // Execute update.js script
            const updateScript = join(TOOLKIT_ROOT, 'scripts', 'update.js')
            const updateResult = spawnSync('bun', [updateScript, ...args.slice(1)], {
                cwd: projectDir,
                stdio: 'inherit'
            })
            process.exit(updateResult.status || 0)
            break
        case 'help':
        case '--help':
        case '-h':
            showHelp()
            break
        default:
            printError(`Unknown subcommand: ${subcommand}`)
            console.log(`Run 'toolkit help' for usage information`)
            process.exit(1)
    }
}

// Run if called directly
if (import.meta.main) {
    main().catch(async (err) => {
        // Try to get solution for error
        try {
            const { getSolutionForError, formatSolution } = await import('./lib/error-solutions.js')
            const solution = getSolutionForError(err)
            if (solution) {
                printError(`Fatal error: ${err.message}`)
                console.log(formatSolution(solution))
            } else {
                printError(`Fatal error: ${err.message}`)
            }
        } catch {
            // Fallback if error-solutions not available
            printError(`Fatal error: ${err.message}`)
        }

        if (process.env.DEBUG) {
            console.error(err)
        }
        process.exit(1)
    })
}
