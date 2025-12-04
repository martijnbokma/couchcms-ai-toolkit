#!/usr/bin/env node

/**
 * Update Script
 *
 * Check for and apply toolkit updates
 *
 * Usage:
 *   bun scripts/update.js           # Interactive: check and prompt to update
 *   bun scripts/update.js --check   # Check only, no prompt
 *   bun scripts/update.js --apply   # Auto-apply without prompt
 *   bun scripts/update.js --force   # Force check (bypass cache)
 */

import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { execSync } from 'child_process'
import { checkForUpdates, getCurrentVersion } from '../lib/update-notifier.js'
import { getToolkitRootCached } from '../lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()

// Parse arguments
const args = process.argv.slice(2)
const showHelp = args.includes('--help') || args.includes('-h')
const checkOnly = args.includes('--check')
const forceCheck = args.includes('--force')
const autoApply = args.includes('--apply')

// Show help if requested
if (showHelp) {
    console.log(`
CouchCMS AI Toolkit - Update Script

Usage:
  bun run update              Interactive mode (check and prompt)
  bun run update:check        Check only (no prompt)
  bun run update:apply        Auto-apply (no prompt)

Options:
  --check                     Check for updates without prompting
  --apply                     Apply updates automatically
  --force                     Force check (bypass 24h cache)
  --help, -h                  Show this help message

Examples:
  bun run update              # Check and ask to update
  bun run update:check        # Just show what's available
  bun run update:apply        # Update immediately
  bun scripts/update.js --force --apply  # Force update now
`)
    process.exit(0)
}

/**
 * Get current version from package.json
 */
function getCurrentVersionLocal() {
    try {
        const pkg = JSON.parse(
            execSync('cat package.json', {
                cwd: TOOLKIT_ROOT,
                encoding: 'utf8'
            })
        )
        return pkg.version
    } catch {
        return 'unknown'
    }
}

/**
 * Get remote version info
 */
function getRemoteVersion() {
    try {
        // Fetch latest
        execSync('git fetch origin --quiet', {
            cwd: TOOLKIT_ROOT,
            stdio: 'ignore',
            timeout: 10000
        })

        // Get remote package.json version
        const remotePackage = execSync('git show origin/master:package.json', {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        })

        const pkg = JSON.parse(remotePackage)
        return pkg.version
    } catch {
        return null
    }
}

/**
 * Get latest release tag
 */
function getLatestRelease() {
    try {
        execSync('git fetch --tags --quiet', {
            cwd: TOOLKIT_ROOT,
            stdio: 'ignore',
            timeout: 10000
        })

        const tag = execSync('git describe --tags --abbrev=0 origin/master', {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        }).trim()

        return tag
    } catch {
        return null
    }
}

/**
 * Get commits behind
 */
function getCommitsBehind() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        }).trim()

        const behind = execSync(`git rev-list HEAD..origin/${branch} --count`, {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        }).trim()

        return parseInt(behind)
    } catch {
        return 0
    }
}

/**
 * Get recent commits
 */
function getRecentCommits(count = 5) {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: TOOLKIT_ROOT,
            encoding: 'utf8'
        }).trim()

        const commits = execSync(
            `git log origin/${branch} -${count} --pretty=format:"%h|%s|%ar"`,
            {
                cwd: TOOLKIT_ROOT,
                encoding: 'utf8'
            }
        ).trim()

        return commits.split('\n').map(line => {
            const [hash, message, time] = line.split('|')
            return { hash, message, time }
        })
    } catch {
        return []
    }
}

/**
 * Apply update
 */
function applyUpdate() {
    try {
        console.log('\n🔄 Pulling latest changes...\n')

        execSync('git pull origin master', {
            cwd: TOOLKIT_ROOT,
            stdio: 'inherit'
        })

        console.log('\n📦 Installing dependencies...\n')

        execSync('bun install', {
            cwd: TOOLKIT_ROOT,
            stdio: 'inherit'
        })

        console.log('\n✅ Update completed successfully!\n')
        return true
    } catch (error) {
        console.error('\n❌ Update failed:', error.message)
        return false
    }
}

/**
 * Display update information
 */
function displayUpdateInfo(currentVersion, remoteVersion, commitsBehind, recentCommits, latestRelease) {
    console.log('\n┌─────────────────────────────────────────────────────────┐')
    console.log('│ 🔍 CouchCMS AI Toolkit - Update Check                   │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log(`│ Current Version: ${currentVersion.padEnd(38)} │`)

    if (remoteVersion) {
        console.log(`│ Latest Version:  ${remoteVersion.padEnd(38)} │`)
    }

    if (latestRelease) {
        console.log(`│ Latest Release:  ${latestRelease.padEnd(38)} │`)
    }

    console.log('├─────────────────────────────────────────────────────────┤')

    if (commitsBehind > 0) {
        console.log(`│ ⚠️  You are ${commitsBehind} commit(s) behind                          │`)
        console.log('│                                                         │')

        if (recentCommits.length > 0) {
            console.log('│ Recent Changes:                                         │')
            recentCommits.slice(0, 3).forEach(commit => {
                const msg = commit.message.substring(0, 45)
                console.log(`│   • ${msg.padEnd(50)} │`)
            })
            console.log('│                                                         │')
        }

        console.log('│ Update with:                                            │')
        console.log('│   bun run update --apply                                │')
        console.log('│                                                         │')
        console.log('│ Or manually:                                            │')
        console.log('│   cd ai-toolkit-shared && git pull && bun install       │')
    } else {
        console.log('│ ✅ You are up to date!                                  │')
    }

    console.log('└─────────────────────────────────────────────────────────┘\n')
}

/**
 * Prompt user for update confirmation
 */
async function promptForUpdate() {
    return new Promise((resolve) => {
        process.stdout.write('Would you like to update now? (y/N): ')

        process.stdin.once('data', (data) => {
            const answer = data.toString().trim().toLowerCase()
            resolve(answer === 'y' || answer === 'yes')
        })
    })
}

/**
 * Main execution
 */
async function main() {
    console.log('🔍 Checking for updates...')

    // Check if we're in a git repository
    try {
        execSync('git rev-parse --git-dir', {
            cwd: TOOLKIT_ROOT,
            stdio: 'ignore'
        })
    } catch {
        console.error('\n❌ Not a git repository. Cannot check for updates.')
        console.log('💡 If you installed via npm/bun, reinstall to get latest version.\n')
        process.exit(1)
    }

    // Get version info
    const currentVersion = getCurrentVersionLocal()
    const remoteVersion = getRemoteVersion()
    const latestRelease = getLatestRelease()
    const commitsBehind = getCommitsBehind()
    const recentCommits = commitsBehind > 0 ? getRecentCommits() : []

    // Display info
    displayUpdateInfo(currentVersion, remoteVersion, commitsBehind, recentCommits, latestRelease)

    // Handle update logic
    if (commitsBehind > 0) {
        if (autoApply) {
            // Auto-apply without prompt
            const success = applyUpdate()
            process.exit(success ? 0 : 1)
        } else if (!checkOnly) {
            // Interactive mode - ask user
            process.stdin.setRawMode(false)
            process.stdin.resume()

            const shouldUpdate = await promptForUpdate()

            process.stdin.pause()

            if (shouldUpdate) {
                const success = applyUpdate()
                process.exit(success ? 0 : 1)
            } else {
                console.log('\n💡 Run "bun run update:apply" to update later.\n')
                process.exit(0)
            }
        }
    }

    // Exit with appropriate code
    process.exit(commitsBehind > 0 ? 1 : 0)
}

main().catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
})
