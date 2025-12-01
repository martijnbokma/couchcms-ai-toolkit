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
import { getToolkitRootCached, print, printSuccess, printError, printWarning, printInfo, printProgress, colors } from './lib/index.js'

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
    print(`\n${message}`, 'yellow')
    process.stdout.write('Continue? [y/N] ')

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

    printProgress('\nCouchCMS AI Toolkit - Reinstall\n', 0)

    // Check if toolkit is installed
    if (!existsSync('ai-toolkit-shared')) {
        printError('Toolkit not found in ai-toolkit-shared/', 0)
        printWarning('   Run the installer first:', 0)
        console.log('   curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash\n')
        process.exit(1)
    }

    // Step 1: Update toolkit
    printProgress('Step 1: Updating toolkit...', 0)
    exec('git pull', { cwd: 'ai-toolkit-shared' })
    printSuccess('Toolkit updated\n', 2)

    // Step 2: Update dependencies
    printProgress('Step 2: Updating dependencies...', 0)
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    if (hasBun) {
        exec('bun install', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('npm install', { cwd: 'ai-toolkit-shared' })
    }
    printSuccess('Dependencies updated\n', 2)

    // Step 3: Check existing config
    const hasConfig = existsSync('.project/standards.md') || existsSync('config.yaml')

    if (hasConfig && !force) {
        const confirmed = await askConfirmation(
            '⚠️  Existing configuration found.\n' +
            '   This will regenerate all AI configs from your standards.md.\n' +
            '   Your standards.md will NOT be modified.'
        )

        if (!confirmed) {
            printError('\nReinstall cancelled\n', 0)
            process.exit(0)
        }
    }

    // Step 4: Regenerate configs
    printProgress('Step 3: Regenerating AI configs...', 0)

    if (hasConfig) {
        // Just sync existing config
        if (hasBun) {
            exec('bun scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        }
    } else {
        // No config, run init
        printWarning('   No configuration found, running setup wizard...\n', 2)
        if (hasBun) {
            exec('bun scripts/init.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/init.js', { cwd: 'ai-toolkit-shared' })
        }
    }

    printSuccess('Configs regenerated\n', 2)

    // Step 5: Verify
    printProgress('Step 4: Verifying installation...', 0)
    if (hasBun) {
        exec('bun scripts/health.js', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('node scripts/health.js', { cwd: 'ai-toolkit-shared' })
    }

    // Success
    printSuccess('\nReinstall complete!\n', 0)
    printInfo('Summary:', 0)
    printSuccess('Toolkit updated to latest version', 2)
    printSuccess('Dependencies updated', 2)
    printSuccess('AI configs regenerated', 2)
    printSuccess('Installation verified\n', 2)

    printInfo('Next steps:', 0)
    console.log('  1. Check your AI assistant (Cursor, Claude, etc.)')
    console.log('  2. Verify configs are working')
    console.log('  3. Edit .project/standards.md if needed\n')
}

// Setup stdin
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run
reinstall().catch(error => {
    printError(`\nReinstall failed: ${error.message}`, 0)
    process.exit(1)
})
