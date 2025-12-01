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
import { getToolkitRootCached } from './lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
}

function print(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

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

    print('\n🔄 CouchCMS AI Toolkit - Reinstall\n', 'blue')

    // Check if toolkit is installed
    if (!existsSync('ai-toolkit-shared')) {
        print('❌ Toolkit not found in ai-toolkit-shared/', 'red')
        print('   Run the installer first:', 'yellow')
        print('   curl -fsSL https://raw.githubusercontent.com/.../install.sh | bash\n')
        process.exit(1)
    }

    // Step 1: Update toolkit
    print('📦 Step 1: Updating toolkit...', 'blue')
    exec('git pull', { cwd: 'ai-toolkit-shared' })
    print('  ✅ Toolkit updated\n', 'green')

    // Step 2: Update dependencies
    print('📚 Step 2: Updating dependencies...', 'blue')
    const hasBun = exec('bun --version', { silent: true, ignoreError: true })
    if (hasBun) {
        exec('bun install', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('npm install', { cwd: 'ai-toolkit-shared' })
    }
    print('  ✅ Dependencies updated\n', 'green')

    // Step 3: Check existing config
    const hasConfig = existsSync('.project/standards.md') || existsSync('config.yaml')

    if (hasConfig && !force) {
        const confirmed = await askConfirmation(
            '⚠️  Existing configuration found.\n' +
            '   This will regenerate all AI configs from your standards.md.\n' +
            '   Your standards.md will NOT be modified.'
        )

        if (!confirmed) {
            print('\n❌ Reinstall cancelled\n', 'red')
            process.exit(0)
        }
    }

    // Step 4: Regenerate configs
    print('🔄 Step 3: Regenerating AI configs...', 'blue')

    if (hasConfig) {
        // Just sync existing config
        if (hasBun) {
            exec('bun scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/sync.js', { cwd: 'ai-toolkit-shared' })
        }
    } else {
        // No config, run init
        print('   No configuration found, running setup wizard...\n', 'yellow')
        if (hasBun) {
            exec('bun scripts/init.js', { cwd: 'ai-toolkit-shared' })
        } else {
            exec('node scripts/init.js', { cwd: 'ai-toolkit-shared' })
        }
    }

    print('  ✅ Configs regenerated\n', 'green')

    // Step 5: Verify
    print('✅ Step 4: Verifying installation...', 'blue')
    if (hasBun) {
        exec('bun scripts/health.js', { cwd: 'ai-toolkit-shared' })
    } else {
        exec('node scripts/health.js', { cwd: 'ai-toolkit-shared' })
    }

    // Success
    print('\n🎉 Reinstall complete!\n', 'green')
    print('Summary:', 'blue')
    print('  ✅ Toolkit updated to latest version')
    print('  ✅ Dependencies updated')
    print('  ✅ AI configs regenerated')
    print('  ✅ Installation verified\n')

    print('Next steps:', 'blue')
    print('  1. Check your AI assistant (Cursor, Claude, etc.)')
    print('  2. Verify configs are working')
    print('  3. Edit .project/standards.md if needed\n')
}

// Setup stdin
process.stdin.setEncoding('utf8')
if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(false)
}

// Run
reinstall().catch(error => {
    print(`\n❌ Reinstall failed: ${error.message}`, 'red')
    process.exit(1)
})
