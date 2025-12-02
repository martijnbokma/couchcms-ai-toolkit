#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Toolkit Path Detector
 *
 * Automatically detects toolkit location
 */

import { existsSync } from 'fs'
import { join, relative, resolve } from 'path'
import { homedir } from 'os'

/**
 * Detect toolkit path automatically
 * Checks multiple common locations in order:
 * 1. ./ai-toolkit-shared (submodule in current project)
 * 2. ../ai-toolkit-shared (parent directory)
 * 3. ~/couchcms-ai-toolkit (home directory installation)
 * 4. ~/.couchcms-ai-toolkit (alternative home location)
 * 5. Current directory if toolkit structure detected
 * 6. ../couchcms-ai-toolkit (parent directory alternative)
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Detected toolkit path (relative) or null if not found
 */
export function detectToolkitPath(projectDir) {
    const searchPaths = [
        // Check 1: Submodule in project directory
        { path: join(projectDir, 'ai-toolkit-shared'), relative: './ai-toolkit-shared' },
        // Check 2: Parent directory
        { path: join(projectDir, '..', 'ai-toolkit-shared'), relative: '../ai-toolkit-shared' },
        // Check 3: Home directory installation
        { path: join(homedir(), 'couchcms-ai-toolkit'), relative: '~/couchcms-ai-toolkit' },
        // Check 4: Alternative home location
        { path: join(homedir(), '.couchcms-ai-toolkit'), relative: '~/.couchcms-ai-toolkit' },
        // Check 5: Parent directory alternative
        { path: join(projectDir, '..', 'couchcms-ai-toolkit'), relative: '../couchcms-ai-toolkit' }
    ]

    // Check each path
    for (const { path: searchPath, relative: relPath } of searchPaths) {
        if (existsSync(searchPath)) {
            const hasToolkitStructure =
                existsSync(join(searchPath, 'modules')) &&
                existsSync(join(searchPath, 'scripts')) &&
                existsSync(join(searchPath, 'templates'))

            if (hasToolkitStructure) {
                return relPath
            }
        }
    }

    // Check 6: Current directory (if running from toolkit directory)
    const currentDir = process.cwd()
    const hasToolkitStructure =
        existsSync(join(currentDir, 'modules')) &&
        existsSync(join(currentDir, 'scripts')) &&
        existsSync(join(currentDir, 'templates'))

    if (hasToolkitStructure) {
        // If we're in the toolkit directory, return relative path from project
        try {
            const relPath = relative(projectDir, currentDir)
            return relPath || '.'
        } catch {
            return '.'
        }
    }

    return null
}

/**
 * Detect and resolve absolute toolkit path
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Absolute toolkit path or null if not found
 */
export function detectToolkitPathAbsolute(projectDir) {
    const detected = detectToolkitPath(projectDir)

    if (!detected) {
        return null
    }

    // Resolve to absolute path
    if (detected.startsWith('~')) {
        return detected.replace('~', homedir())
    }

    if (detected.startsWith('./') || detected.startsWith('../') || !detected.startsWith('/')) {
        return resolve(projectDir, detected)
    }

    return detected
}

