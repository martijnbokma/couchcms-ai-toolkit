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
import { printBanner, printSuccess, printInfo, printError } from './lib/terminal.js'
import { prompt, confirm } from './lib/prompts.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * @typedef {Object} CommandOptions
 * @property {string} [complexity] - Setup complexity level
 * @property {boolean} [showAll] - Show all options flag
 */

/**
 * Subcommand names
 */
const SUBCOMMANDS = {
    INSTALL: 'install',
    SETUP: 'setup',
    RECONFIGURE: 'reconfigure',
    SYNC: 'sync',
    VALIDATE: 'validate',
    HEALTH: 'health',
    BROWSE: 'browse',
    UPDATE: 'update',
    SERVE: 'serve',
    HELP: 'help'
}

/**
 * Script names for subcommands that spawn child processes
 */
const SCRIPT_MAP = {
    [SUBCOMMANDS.SYNC]: 'sync.js',
    [SUBCOMMANDS.VALIDATE]: 'validate.js',
    [SUBCOMMANDS.HEALTH]: 'health.js',
    [SUBCOMMANDS.BROWSE]: 'browse.js',
    [SUBCOMMANDS.UPDATE]: 'update.js'
}

/**
 * Handle dependency check errors with solution suggestions
 * @param {Error} error - The error that occurred
 * @param {string} context - Context message for the error
 */
async function handleDependencyError(error, context) {
    try {
        const { getSolutionForError, formatSolution } = await import('./lib/error-solutions.js')
        const solution = getSolutionForError(error)
        printError(`${context}: ${error.message}`)
        if (solution) {
            console.log(formatSolution(solution))
        }
    } catch {
        printError(`${context}: ${error.message}`)
    }
    process.exit(1)
}

/**
 * Check and install dependencies with error handling
 * @param {string} toolkitRoot - Toolkit root directory
 * @throws {Error} If dependency check fails
 */
async function ensureDependencies(toolkitRoot) {
    try {
        await checkAndInstallDependencies(toolkitRoot)
    } catch (error) {
        await handleDependencyError(error, 'Failed to install dependencies')
    }
}

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
            name: 'Easy',
            time: '1 minute',
            questions: 2,
            includes: 'All CouchCMS modules/agents (automatic) + TailwindCSS + Alpine.js (recommended defaults)',
            perfectFor: 'Getting started quickly'
        },
        {
            level: COMPLEXITY_LEVELS.MEDIUM,
            number: 2,
            name: 'Medium',
            time: '3 minutes',
            questions: 5,
            includes: 'All CouchCMS modules/agents (automatic) + Choose CSS framework + Choose JS framework',
            perfectFor: 'Most projects, want to choose frameworks'
        },
        {
            level: COMPLEXITY_LEVELS.COMPREHENSIVE,
            number: 3,
            name: 'Comprehensive',
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
    const choice = parseInt(answer, 10)

    if (choice >= 1 && choice <= 3) {
        const selected = descriptions[choice - 1]
        printSuccess(`Selected: ${selected.name}`)
        return selected.level
    }

    printInfo('Invalid choice, defaulting to Easy')
    return COMPLEXITY_LEVELS.EASY
}

/**
 * Get complexity level from options or preference, or prompt user
 * @param {CommandOptions} options - Command options
 * @param {string} projectDir - Project directory
 * @returns {Promise<string>} Complexity level
 */
async function getComplexityLevel(options, projectDir) {
    let complexity = options.complexity || readPreference(projectDir)

    if (options.showAll) {
        return COMPLEXITY_LEVELS.COMPREHENSIVE
    }

    if (!complexity) {
        complexity = await showComplexityMenu()
        writePreference(projectDir, complexity)
        return complexity
    }

    if (!Object.values(COMPLEXITY_LEVELS).includes(complexity)) {
        printError(`Invalid complexity: ${complexity}. Must be: easy, medium, or comprehensive`)
        process.exit(1)
    }

    return complexity
}

/**
 * Execute a script as a child process
 * @param {string} scriptName - Name of the script file
 * @param {string} projectDir - Project directory
 * @param {string[]} extraArgs - Additional arguments to pass
 */
function executeScript(scriptName, projectDir, extraArgs = []) {
    const scriptPath = join(TOOLKIT_ROOT, 'scripts', scriptName)
    const result = spawnSync('bun', [scriptPath, ...extraArgs], {
        cwd: projectDir,
        stdio: 'inherit'
    })
    process.exit(result.status || 0)
}

/**
 * Handle install subcommand
 * @param {string} projectDir - Project directory
 * @param {CommandOptions} options - Command options
 */
async function handleInstall(projectDir, options) {
    printBanner('CouchCMS AI Toolkit', 'Installation', '🚀')

    printInfo('Checking dependencies...')
    await ensureDependencies(TOOLKIT_ROOT)

    const complexity = await getComplexityLevel(options, projectDir)
    printInfo(`Starting ${getComplexityDescription(complexity).name} setup...`)

    const { runSetupFlow } = await import('./lib/setup-flow.js')
    await runSetupFlow(projectDir, complexity, options)
}

/**
 * Handle setup subcommand
 * @param {string} projectDir - Project directory
 * @param {CommandOptions} options - Command options
 */
async function handleSetup(projectDir, options) {
    printBanner('CouchCMS AI Toolkit', 'Project Setup', '⚙️')

    await ensureDependencies(TOOLKIT_ROOT)

    const complexity = await getComplexityLevel(options, projectDir)

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

    const runSetup = await confirm('Run setup with new complexity?', true)

    if (runSetup) {
        await handleSetup(projectDir, { complexity: newComplexity })
    }
}

/**
 * Handle sync subcommand
 * @param {string} projectDir - Project directory
 */
function handleSync(projectDir) {
    executeScript(SCRIPT_MAP[SUBCOMMANDS.SYNC], projectDir)
}

/**
 * Handle validate subcommand
 * @param {string} projectDir - Project directory
 */
function handleValidate(projectDir) {
    executeScript(SCRIPT_MAP[SUBCOMMANDS.VALIDATE], projectDir)
}

/**
 * Handle health subcommand
 * @param {string} projectDir - Project directory
 */
function handleHealth(projectDir) {
    executeScript(SCRIPT_MAP[SUBCOMMANDS.HEALTH], projectDir)
}

/**
 * Handle browse subcommand
 * @param {string} projectDir - Project directory
 * @param {string[]} extraArgs - Additional arguments
 */
function handleBrowse(projectDir, extraArgs) {
    executeScript(SCRIPT_MAP[SUBCOMMANDS.BROWSE], projectDir, extraArgs)
}

/**
 * Handle update subcommand
 * @param {string} projectDir - Project directory
 * @param {string[]} extraArgs - Additional arguments
 */
function handleUpdate(projectDir, extraArgs) {
    executeScript(SCRIPT_MAP[SUBCOMMANDS.UPDATE], projectDir, extraArgs)
}

/**
 * Handle serve subcommand - Start web server for browser-based setup
 * @param {string} projectDir - Project directory
 * @param {CommandOptions} options - Command options
 */
async function handleServe(projectDir, options) {
    await ensureDependencies(TOOLKIT_ROOT)

    const port = parseInt(options.port || process.env.PORT || '3000', 10)

    try {
        const { startServer } = await import('./web/server.js')
        await startServer({ port, projectDir })
    } catch (error) {
        printError(`Failed to start server: ${error.message}`)
        if (error.message.includes('already in use')) {
            console.log(`\n💡 Try using a different port:`)
            console.log(`   bun toolkit serve --port=3001`)
        }
        process.exit(1)
    }
}

/**
 * Show help message
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
  serve            Start web server for browser-based setup
  help             Show this help message

Options:
  --complexity=<level>    Setup complexity: easy, medium, comprehensive
  --show-all              Show all options (temporary override)
  --port=<number>         Port for web server (default: 3000)

Examples:
  toolkit install                    # First-time installation
  toolkit setup                      # Configure project
  toolkit setup --complexity=easy    # Quick setup
  toolkit reconfigure                # Change complexity preference
  toolkit sync                       # Generate configs
  toolkit health                     # Check installation
  toolkit serve                      # Start browser setup interface
  toolkit serve --port=3000          # Start on specific port

For more information, see: docs/START-HERE.md
`)
}

/**
 * Parse command line options
 * @param {string[]} args - Command line arguments
 * @returns {CommandOptions} Parsed options
 */
function parseOptions(args) {
    const options = {}

    for (const arg of args) {
        if (arg.startsWith('--complexity=')) {
            options.complexity = arg.split('=')[1]
        } else if (arg.startsWith('--port=')) {
            options.port = arg.split('=')[1]
        } else if (arg === '--show-all') {
            options.showAll = true
        }
    }

    return options
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
            await handleInstall(projectDir, {})
        } else {
            showHelp()
        }
        return
    }

    const subcommand = args[0]
    const options = parseOptions(args.slice(1))
    const extraArgs = args.slice(1).filter(arg => !arg.startsWith('--'))

    // Route to appropriate handler
    switch (subcommand) {
        case SUBCOMMANDS.INSTALL:
            await handleInstall(projectDir, options)
            break
        case SUBCOMMANDS.SETUP:
            await handleSetup(projectDir, options)
            break
        case SUBCOMMANDS.RECONFIGURE:
            await handleReconfigure(projectDir)
            break
        case SUBCOMMANDS.SYNC:
            handleSync(projectDir)
            break
        case SUBCOMMANDS.VALIDATE:
            handleValidate(projectDir)
            break
        case SUBCOMMANDS.HEALTH:
            handleHealth(projectDir)
            break
        case SUBCOMMANDS.BROWSE:
            handleBrowse(projectDir, extraArgs)
            break
        case SUBCOMMANDS.UPDATE:
            handleUpdate(projectDir, extraArgs)
            break
        case SUBCOMMANDS.SERVE:
            await handleServe(projectDir, options)
            break
        case SUBCOMMANDS.HELP:
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

/**
 * Handle fatal errors with solution suggestions
 * @param {Error} err - The error that occurred
 */
async function handleFatalError(err) {
    try {
        const { getSolutionForError, formatSolution } = await import('./lib/error-solutions.js')
        const solution = getSolutionForError(err)
        printError(`Fatal error: ${err.message}`)
        if (solution) {
            console.log(formatSolution(solution))
        }
    } catch {
        printError(`Fatal error: ${err.message}`)
    }

    if (process.env.DEBUG) {
        console.error(err)
    }
    process.exit(1)
}

// Run if called directly
if (import.meta.main) {
    main().catch(handleFatalError)
}
