#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Health Check
 *
 * Validates toolkit installation and configuration
 *
 * Usage:
 *   bun scripts/health.js
 */

import { existsSync, statSync, readFileSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { execSync } from 'child_process'
import { findConfigFile } from './utils/utils.js'
import { getToolkitRootCached } from './lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
}

const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: '💡',
}

/**
 * Print colored message
 */
function print(icon, message, color = 'reset', indent = 0) {
    const spaces = ' '.repeat(indent)
    console.log(`${spaces}${icon} ${colors[color]}${message}${colors.reset}`)
}

/**
 * Check if toolkit is properly installed
 */
function checkToolkitInstallation() {
    const checks = []

    // Check toolkit structure
    const requiredDirs = ['modules', 'agents', 'scripts', 'templates']
    const missingDirs = requiredDirs.filter(dir => !existsSync(join(TOOLKIT_ROOT, dir)))

    if (missingDirs.length === 0) {
        checks.push({ status: 'success', message: 'Toolkit structure is valid' })
    } else {
        checks.push({
            status: 'error',
            message: `Missing directories: ${missingDirs.join(', ')}`,
            fix: 'Reinstall toolkit or check git submodule'
        })
    }

    // Check node_modules
    if (existsSync(join(TOOLKIT_ROOT, 'node_modules'))) {
        checks.push({ status: 'success', message: 'Dependencies installed' })
    } else {
        checks.push({
            status: 'error',
            message: 'Dependencies not installed',
            fix: 'Run: cd ai-toolkit-shared && bun install'
        })
    }

    // Check package.json
    const packagePath = join(TOOLKIT_ROOT, 'package.json')
    if (existsSync(packagePath)) {
        try {
            const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
            checks.push({
                status: 'success',
                message: `Toolkit version: ${pkg.version}`
            })
        } catch {
            checks.push({
                status: 'warning',
                message: 'Could not read package.json version'
            })
        }
    }

    return checks
}

/**
 * Check project configuration
 */
function checkProjectConfiguration(projectDir) {
    const checks = []

    // Check for config file
    const configFile = findConfigFile(projectDir)
    if (configFile) {
        checks.push({
            status: 'success',
            message: `Configuration found: ${configFile.split('/').pop()}`
        })

        // Check if config is recent
        const stats = statSync(configFile)
        const age = Date.now() - stats.mtimeMs
        const days = Math.floor(age / (1000 * 60 * 60 * 24))

        if (days > 30) {
            checks.push({
                status: 'info',
                message: `Configuration is ${days} days old`,
                fix: 'Consider reviewing and updating your configuration'
            })
        }
    } else {
        checks.push({
            status: 'error',
            message: 'No configuration file found',
            fix: 'Run: bun ai-toolkit-shared/scripts/init.js'
        })
    }

    return checks
}

/**
 * Check generated files
 */
function checkGeneratedFiles(projectDir) {
    const checks = []
    const expectedFiles = [
        { path: '.cursorrules', name: 'Cursor rules' },
        { path: '.claude/settings.json', name: 'Claude settings' },
        { path: '.github/copilot-instructions.md', name: 'Copilot instructions' },
    ]

    let missingFiles = []
    let outdatedFiles = []

    const configFile = findConfigFile(projectDir)
    const configMtime = configFile ? statSync(configFile).mtimeMs : 0

    for (const { path, name } of expectedFiles) {
        const filePath = join(projectDir, path)

        if (!existsSync(filePath)) {
            missingFiles.push(name)
        } else {
            // Check if file is older than config
            const fileMtime = statSync(filePath).mtimeMs
            if (configMtime > fileMtime) {
                outdatedFiles.push(name)
            }
        }
    }

    if (missingFiles.length === 0 && outdatedFiles.length === 0) {
        checks.push({
            status: 'success',
            message: 'All generated files are up to date'
        })
    } else {
        if (missingFiles.length > 0) {
            checks.push({
                status: 'error',
                message: `Missing files: ${missingFiles.join(', ')}`,
                fix: 'Run: bun ai-toolkit-shared/scripts/sync.js'
            })
        }
        if (outdatedFiles.length > 0) {
            checks.push({
                status: 'warning',
                message: `Outdated files: ${outdatedFiles.join(', ')}`,
                fix: 'Run: bun ai-toolkit-shared/scripts/sync.js'
            })
        }
    }

    return checks
}

/**
 * Check for toolkit updates
 */
function checkForUpdates() {
    const checks = []

    try {
        // Check if we're in a git repository
        execSync('git rev-parse --git-dir', {
            cwd: TOOLKIT_ROOT,
            stdio: 'ignore'
        })

        // Fetch latest
        execSync('git fetch origin --quiet', {
            cwd: TOOLKIT_ROOT,
            stdio: 'ignore',
            timeout: 5000
        })

        // Check if behind
        const behind = execSync('git rev-list HEAD..origin/master --count', {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        }).trim()

        if (behind === '0') {
            checks.push({
                status: 'success',
                message: 'Toolkit is up to date'
            })
        } else {
            checks.push({
                status: 'warning',
                message: `Toolkit is ${behind} commit(s) behind`,
                fix: 'Run: cd ai-toolkit-shared && git pull'
            })
        }
    } catch (error) {
        checks.push({
            status: 'info',
            message: 'Could not check for updates (not a git repository or no network)'
        })
    }

    return checks
}

/**
 * Display health check results
 */
function displayResults(sections) {
    console.log('\n🏥 CouchCMS AI Toolkit - Health Check\n')

    let hasErrors = false
    let hasWarnings = false

    for (const { title, checks } of sections) {
        console.log(`${colors.blue}${title}${colors.reset}`)

        for (const check of checks) {
            const icon = icons[check.status] || icons.info
            const color = check.status === 'error' ? 'red' :
                         check.status === 'warning' ? 'yellow' :
                         check.status === 'info' ? 'gray' : 'green'

            print(icon, check.message, color, 2)

            if (check.fix) {
                print('', `→ ${check.fix}`, 'gray', 4)
            }

            if (check.status === 'error') hasErrors = true
            if (check.status === 'warning') hasWarnings = true
        }

        console.log()
    }

    // Summary
    if (!hasErrors && !hasWarnings) {
        print(icons.success, 'Everything looks good! 🎉', 'green')
    } else if (hasErrors) {
        print(icons.error, 'Found issues that need attention', 'red')
    } else {
        print(icons.warning, 'Found some warnings, but toolkit should work', 'yellow')
    }

    console.log()
    return hasErrors ? 1 : 0
}

/**
 * Main health check
 */
async function healthCheck() {
    const projectDir = process.cwd()

    const sections = [
        {
            title: '📦 Toolkit Installation',
            checks: checkToolkitInstallation()
        },
        {
            title: '⚙️  Project Configuration',
            checks: checkProjectConfiguration(projectDir)
        },
        {
            title: '📄 Generated Files',
            checks: checkGeneratedFiles(projectDir)
        },
        {
            title: '🔄 Updates',
            checks: checkForUpdates()
        }
    ]

    const exitCode = displayResults(sections)
    process.exit(exitCode)
}

// Run
healthCheck().catch(error => {
    console.error(`\n${icons.error} Health check failed:`, error.message)
    process.exit(1)
})
