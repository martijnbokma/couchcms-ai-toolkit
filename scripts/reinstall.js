#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Reinstall Script
 *
 * Reinstalls/updates the toolkit configuration
 * Useful for:
 * - Updating to latest toolkit version
 * - Fixing broken configurations
 * - Applying new defaults
 *
 * Usage:
 *   bun ai-toolkit-shared/scripts/reinstall.js
 *   bun ai-toolkit-shared/scripts/reinstall.js --force
 */

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { execSync } from 'child_process'
import { findConfigFile } from './utils/utils.js'
import { getToolkitRootCached, print, printSuccess, printError, printWarning, printInfo, printProgress, printBanner, printStep, printBox, printSummary, printList, colors } from './lib/index.js'
import ansis, { red, yellow, green, blue } from 'ansis'

const TOOLKIT_ROOT = getToolkitRootCached()

function exec(command, options = {}) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: options.silent ? 'pipe' : 'inherit',
            cwd: options.cwd || process.cwd(),
            ...options
        })
    } catch (error) {
        if (!options.ignoreError) {
            throw error
        }
        return null
    }
}

async function askConfirmation(message) {
    printBox(message, { color: yellow, icon: '⚠️' })
    process.stdout.write(yellow.bold('Continue? [y/N] '))

    return new Promise((resolve) => {
        const handler = (data) => {
            process.stdin.removeListener('data', handler)
            const answer = data.toString().trim().toLowerCase()
            resolve(answer === 'y' || answer === 'yes')
        }
        process.stdin.once('data', handler)
    })
}

/**
 * Check if there are unstaged changes in git repository
 * @param {string} cwd - Working directory
 * @returns {boolean} - True if there are unstaged changes
 */
function hasUnstagedChanges(cwd) {
    try {
        const status = execSync('git status --porcelain', {
            encoding: 'utf8',
            cwd,
            stdio: 'pipe'
        })
        // git status --porcelain format:
        // First char: staged changes (space if unstaged)
        // Second char: unstaged changes (M, A, D, etc.)
        // Lines starting with '??' are untracked files (ignore)
        return status.split('\n').some(line => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('??')) return false
            // If first char is space, there are unstaged changes
            // If second char is not space, there are unstaged changes
            return line[0] === ' ' || (line[1] && line[1] !== ' ')
        })
    } catch {
        return false
    }
}

/**
 * Check if git repository is clean (no changes at all)
 * @param {string} cwd - Working directory
 * @returns {boolean} - True if repository is clean
 */
function isGitClean(cwd) {
    try {
        const status = execSync('git status --porcelain', {
            encoding: 'utf8',
            cwd,
            stdio: 'pipe'
        })
        return status.trim().length === 0
    } catch {
        return true
    }
}

async function reinstall() {
    const args = process.argv.slice(2)
    const force = args.includes('--force')

    // Print banner
    printBanner('CouchCMS AI Toolkit', 'Reinstall & Update Configuration', '🔄')

    // Check if toolkit is installed
    if (!existsSync('ai-toolkit-shared')) {
        printBox(
            'Toolkit not found in ai-toolkit-shared/\n\nRun the installer first:\ncurl -fsSL https://raw.githubusercontent.com/.../install.sh | bash',
            { color: red, icon: '❌', title: 'Error' }
        )
        process.exit(1)
    }

    const totalSteps = 4
    const steps = []

    // Step 1: Update toolkit
    printStep(1, totalSteps, 'Updating toolkit...')
    try {
        const toolkitPath = 'ai-toolkit-shared'

        // Check if there are unstaged changes
        if (hasUnstagedChanges(toolkitPath)) {
            printWarning('Found unstaged changes in toolkit directory', 2)
            printInfo('Git pull requires a clean working directory', 2)

            const confirmed = await askConfirmation(
                'You have local changes in ai-toolkit-shared/.\n\n' +
                'Options:\n' +
                '1. Stash changes, pull updates, then restore changes\n' +
                '2. Skip update (keep your local changes)\n\n' +
                'Stash and pull?'
            )

            if (confirmed) {
                printProgress('Stashing local changes...', 2)
                exec('git stash push -m "Auto-stash before reinstall"', { cwd: toolkitPath })
                printSuccess('Changes stashed', 2)

                printProgress('Pulling latest updates...', 2)
                exec('git pull', { cwd: toolkitPath })
                printSuccess('Updates pulled', 2)

                printProgress('Restoring stashed changes...', 2)
                exec('git stash pop', { cwd: toolkitPath, ignoreError: true })
                printSuccess('Changes restored', 2)

                steps.push({ name: 'Toolkit update', status: 'success' })
            } else {
                printWarning('Skipping toolkit update (keeping local changes)', 2)
                steps.push({ name: 'Toolkit update', status: 'skipped' })
            }
        } else {
            // No changes, safe to pull
            exec('git pull', { cwd: toolkitPath })
            printSuccess('Toolkit updated', 2)
            steps.push({ name: 'Toolkit update', status: 'success' })
        }
    } catch (error) {
        const errorMsg = error.message || String(error)
        if (errorMsg.includes('unstaged changes') || errorMsg.includes('cannot pull')) {
            printWarning('Git pull failed: Unstaged changes detected', 2)
            printInfo('Tip: Commit or stash your changes first, then run reinstall again', 2)
        } else if (errorMsg.includes('already up to date')) {
            printSuccess('Toolkit already up to date', 2)
            steps.push({ name: 'Toolkit update', status: 'success' })
        } else {
            printWarning(`Git pull failed: ${errorMsg}`, 2)
        }
        if (!steps.find(s => s.name === 'Toolkit update')) {
            steps.push({ name: 'Toolkit update', status: 'warning' })
        }
    }
    console.log()

    // Step 2: Update dependencies
    printStep(2, totalSteps, 'Updating dependencies...')
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    if (hasBun) {
        exec('bun install', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('npm install', { cwd: 'ai-toolkit-shared' })
    }
    printSuccess('Dependencies updated', 2)
    steps.push({ name: 'Dependencies', status: 'success' })
    console.log()

    // Step 3: Check existing config
    const hasConfig = existsSync('.project/standards.md') || existsSync('standards.md') || existsSync('config.yaml')

    if (hasConfig && !force) {
        const confirmed = await askConfirmation(
            'Existing configuration found.\n\n' +
            'This will regenerate all AI configs from your standards.md.\n' +
            'Your standards.md will NOT be modified.'
        )

        if (!confirmed) {
            printBox('Reinstall cancelled', { color: yellow, icon: '⚠️' })
            process.exit(0)
        }
    }

    // Step 4: Regenerate configs
    printStep(3, totalSteps, 'Regenerating AI configs...')

    if (hasConfig) {
        // Just sync existing config
        if (hasBun) {
            exec('bun scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        }
        steps.push({ name: 'Config regeneration', status: 'success' })
    } else {
        // No config, run init
        printWarning('No configuration found, running setup wizard...', 2)
        if (hasBun) {
            exec('bun scripts/init.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/init.js', { cwd: 'ai-toolkit-shared' })
        }
        steps.push({ name: 'Initial setup', status: 'success' })
    }
    printSuccess('Configs regenerated', 2)
    console.log()

    // Step 5: Verify
    printStep(4, totalSteps, 'Verifying installation...')
    if (hasBun) {
        exec('bun scripts/health.js', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('node scripts/health.js', { cwd: 'ai-toolkit-shared' })
    }
    steps.push({ name: 'Verification', status: 'success' })
    console.log()

    // Success summary
    printBox(
        'Reinstall complete!',
        { color: green, icon: '✅', title: 'Success' }
    )

    const toolkitStep = steps.find(s => s.name === 'Toolkit update')
    const toolkitStatus = toolkitStep?.status === 'success' ? '✅ Updated' :
                          toolkitStep?.status === 'skipped' ? '⚠️ Skipped' :
                          '⚠️ Warning'

    printSummary('Summary', {
        'Toolkit': toolkitStatus,
        'Dependencies': steps.find(s => s.name === 'Dependencies')?.status === 'success' ? '✅ Updated' : '❌ Failed',
        'Configuration': steps.find(s => s.name === 'Config regeneration' || s.name === 'Initial setup')?.status === 'success' ? '✅ Regenerated' : '❌ Failed',
        'Verification': steps.find(s => s.name === 'Verification')?.status === 'success' ? '✅ Passed' : '❌ Failed',
    })

    printBox(
        'Next Steps:\n\n' +
        '1. Check your AI assistant (Cursor, Claude, etc.)\n' +
        '2. Verify configs are working\n' +
        '3. Edit .project/standards.md if needed',
        { color: blue, icon: 'ℹ️', title: 'Next Steps' }
    )

    // Explicitly exit to ensure script terminates
    process.exit(0)
}

// Setup stdin
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Ensure stdin is readable
process.stdin.resume()

// Run
reinstall().catch(error => {
    printBox(
        `Reinstall failed: ${error.message}`,
        { color: red, icon: '❌', title: 'Error' }
    )
    process.exit(1)
})
