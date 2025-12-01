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
 * Checks in order:
 * 1. ./ai-toolkit-shared (submodule in current project)
 * 2. ~/couchcms-ai-toolkit (home directory installation)
 * 3. Current directory if toolkit structure detected
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Detected toolkit path (relative) or null if not found
 */
export function detectToolkitPath(projectDir) {
    // Check 1: Submodule in project directory
    const submodulePath = join(projectDir, 'ai-toolkit-shared')
    if (existsSync(submodulePath)) {
        const hasToolkitStructure =
            existsSync(join(submodulePath, 'modules')) &&
            existsSync(join(submodulePath, 'scripts')) &&
            existsSync(join(submodulePath, 'templates'))

        if (hasToolkitStructure) {
            return './ai-toolkit-shared'
        }
    }

    // Check 2: Home directory installation
    const homePath = join(homedir(), 'couchcms-ai-toolkit')
    if (existsSync(homePath)) {
        const hasToolkitStructure =
            existsSync(join(homePath, 'modules')) &&
            existsSync(join(homePath, 'scripts')) &&
            existsSync(join(homePath, 'templates'))

        if (hasToolkitStructure) {
            return '~/couchcms-ai-toolkit'
        }
    }

    // Check 3: Current directory (if running from toolkit directory)
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
<<<<<<< HEAD

=======
>>>>>>> eb63280 (updates 2025-12-01)
