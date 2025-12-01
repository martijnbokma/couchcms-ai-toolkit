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
import pc from 'picocolors'

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
    printBox(message, { color: pc.yellow, icon: '⚠️' })
    process.stdout.write(pc.bold(pc.yellow('Continue? [y/N] ')))

    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            const answer = data.toString().trim().toLowerCase()
            resolve(answer === 'y' || answer === 'yes')
        })
    })
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
            { color: pc.red, icon: '❌', title: 'Error' }
        )
        process.exit(1)
    }

    const totalSteps = 4
    const steps = []

    // Step 1: Update toolkit
    printStep(1, totalSteps, 'Updating toolkit...')
    try {
        exec('git pull', { cwd: 'ai-toolkit-shared' })
        printSuccess('Toolkit updated', 2)
        steps.push({ name: 'Toolkit update', status: 'success' })
    } catch (error) {
        printWarning('Git pull failed (may already be up to date)', 2)
        steps.push({ name: 'Toolkit update', status: 'warning' })
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
            printBox('Reinstall cancelled', { color: pc.yellow, icon: '⚠️' })
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
        { color: pc.green, icon: '✅', title: 'Success' }
    )

    printSummary('Summary', {
        'Toolkit': steps.find(s => s.name === 'Toolkit update')?.status === 'success' ? '✅ Updated' : '⚠️ Skipped',
        'Dependencies': steps.find(s => s.name === 'Dependencies')?.status === 'success' ? '✅ Updated' : '❌ Failed',
        'Configuration': steps.find(s => s.name === 'Config regeneration' || s.name === 'Initial setup')?.status === 'success' ? '✅ Regenerated' : '❌ Failed',
        'Verification': steps.find(s => s.name === 'Verification')?.status === 'success' ? '✅ Passed' : '❌ Failed',
    })

    printBox(
        'Next Steps:\n\n' +
        '1. Check your AI assistant (Cursor, Claude, etc.)\n' +
        '2. Verify configs are working\n' +
        '3. Edit .project/standards.md if needed',
        { color: pc.blue, icon: 'ℹ️', title: 'Next Steps' }
    )
}

// Setup stdin
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run
reinstall().catch(error => {
    printBox(
        `Reinstall failed: ${error.message}`,
        { color: pc.red, icon: '❌', title: 'Error' }
    )
    process.exit(1)
})
