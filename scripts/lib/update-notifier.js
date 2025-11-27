/**
 * Update Notifier
 * 
 * Check for toolkit updates and notify user
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours
const CACHE_FILE = '.toolkit-update-check'

/**
 * Get cached update check data
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object|null} Cached data or null
 */
function getCachedCheck(toolkitPath) {
    const cachePath = join(toolkitPath, CACHE_FILE)
    
    if (!existsSync(cachePath)) {
        return null
    }

    try {
        const data = JSON.parse(readFileSync(cachePath, 'utf8'))
        const age = Date.now() - data.timestamp
        
        if (age < UPDATE_CHECK_INTERVAL) {
            return data
        }
    } catch {}

    return null
}

/**
 * Save update check to cache
 * @param {string} toolkitPath - Toolkit root directory
 * @param {object} data - Data to cache
 */
function saveCachedCheck(toolkitPath, data) {
    const cachePath = join(toolkitPath, CACHE_FILE)
    
    try {
        writeFileSync(cachePath, JSON.stringify({
            ...data,
            timestamp: Date.now()
        }))
    } catch {}
}

/**
 * Get current toolkit version
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {string|null} Version string or null
 */
function getCurrentVersion(toolkitPath) {
    const packagePath = join(toolkitPath, 'package.json')
    
    if (!existsSync(packagePath)) {
        return null
    }

    try {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
        return pkg.version
    } catch {
        return null
    }
}

/**
 * Check for updates via git
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object|null} Update info or null
 */
function checkGitUpdates(toolkitPath) {
    try {
        // Check if we're in a git repository
        execSync('git rev-parse --git-dir', { 
            cwd: toolkitPath,
            stdio: 'ignore'
        })

        // Fetch latest (with timeout)
        execSync('git fetch origin --quiet', { 
            cwd: toolkitPath,
            stdio: 'ignore',
            timeout: 5000
        })

        // Get current branch
        const branch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: toolkitPath,
            encoding: 'utf8'
        }).trim()

        // Check if behind
        const behind = execSync(`git rev-list HEAD..origin/${branch} --count`, {
            cwd: toolkitPath,
            encoding: 'utf8'
        }).trim()

        if (behind !== '0') {
            // Get latest commit message
            const latestCommit = execSync(`git log origin/${branch} -1 --pretty=format:"%s"`, {
                cwd: toolkitPath,
                encoding: 'utf8'
            }).trim()

            return {
                available: true,
                behind: parseInt(behind),
                branch,
                latestCommit
            }
        }

        return { available: false }
    } catch {
        return null
    }
}

/**
 * Check for toolkit updates
 * @param {string} toolkitPath - Toolkit root directory
 * @param {boolean} force - Force check even if cached
 * @returns {object|null} Update info or null
 */
export function checkForUpdates(toolkitPath, force = false) {
    // Check cache first
    if (!force) {
        const cached = getCachedCheck(toolkitPath)
        if (cached) {
            return cached.updateInfo
        }
    }

    // Check for updates
    const updateInfo = checkGitUpdates(toolkitPath)
    
    // Cache result
    if (updateInfo) {
        saveCachedCheck(toolkitPath, { updateInfo })
    }

    return updateInfo
}

/**
 * Display update notification
 * @param {object} updateInfo - Update information
 * @param {string} currentVersion - Current version
 */
export function displayUpdateNotification(updateInfo, currentVersion) {
    if (!updateInfo || !updateInfo.available) {
        return
    }

    console.log('\n┌─────────────────────────────────────────────────────────┐')
    console.log('│ 💡 Update Available                                     │')
    console.log('├─────────────────────────────────────────────────────────┤')
    console.log(`│ Your toolkit is ${updateInfo.behind} commit(s) behind ${updateInfo.branch}`)
    
    if (updateInfo.latestCommit) {
        const commit = updateInfo.latestCommit.substring(0, 50)
        console.log(`│ Latest: ${commit}${' '.repeat(Math.max(0, 50 - commit.length))} │`)
    }
    
    console.log('│                                                         │')
    console.log('│ Update with:                                            │')
    console.log('│   cd ai-toolkit-shared && git pull                      │')
    console.log('└─────────────────────────────────────────────────────────┘\n')
}

/**
 * Check and notify about updates (non-blocking)
 * @param {string} toolkitPath - Toolkit root directory
 */
export function checkAndNotify(toolkitPath) {
    // Run in background, don't block
    setTimeout(() => {
        try {
            const currentVersion = getCurrentVersion(toolkitPath)
            const updateInfo = checkForUpdates(toolkitPath)
            
            if (updateInfo && updateInfo.available) {
                displayUpdateNotification(updateInfo, currentVersion)
            }
        } catch {
            // Silently fail - don't interrupt user workflow
        }
    }, 100)
}
