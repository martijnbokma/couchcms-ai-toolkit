#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Package.json Utilities
 *
 * Safely add scripts to package.json without overwriting existing ones
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Safely add toolkit script to package.json
 * Only adds if it doesn't exist, preserves all existing scripts
 * @param {string} projectDir - Project root directory
 * @param {string} toolkitPath - Path to toolkit (relative or absolute)
 * @returns {Promise<{added: boolean, message: string}>}
 */
export async function addToolkitScript(projectDir, toolkitPath = './ai-toolkit-shared') {
    const packageJsonPath = join(projectDir, 'package.json')

    // Check if package.json exists
    if (!existsSync(packageJsonPath)) {
        return {
            added: false,
            message: 'No package.json found. Create one first or use: bun ai-toolkit-shared/scripts/toolkit.js [command]'
        }
    }

    try {
        // Read existing package.json
        const content = readFileSync(packageJsonPath, 'utf8')
        let packageJson

        // Try to parse as JSON5 (more forgiving) or regular JSON
        try {
            packageJson = parseJSON(content)
        } catch {
            // Fallback to regular JSON
            packageJson = JSON.parse(content)
        }

        // Ensure scripts object exists
        if (!packageJson.scripts) {
            packageJson.scripts = {}
        }

        // Check if toolkit script already exists
        if (packageJson.scripts.toolkit) {
            return {
                added: false,
                message: 'Toolkit script already exists in package.json',
                existingScript: packageJson.scripts.toolkit
            }
        }

        // Add toolkit script
        const toolkitScript = `bun ${toolkitPath}/scripts/toolkit.js`
        packageJson.scripts.toolkit = toolkitScript

        // Write back with proper formatting (preserve existing formatting style)
        // Use JSON.stringify with 2-space indent to match common formatting
        const updatedContent = JSON.stringify(packageJson, null, 2) + '\n'

        writeFileSync(packageJsonPath, updatedContent, 'utf8')

        return {
            added: true,
            message: `Added 'toolkit' script to package.json`,
            script: toolkitScript
        }
    } catch (error) {
        return {
            added: false,
            message: `Failed to update package.json: ${error.message}`,
            error: error
        }
    }
}

/**
 * Check if toolkit script exists in package.json
 * @param {string} projectDir - Project root directory
 * @returns {boolean}
 */
export function hasToolkitScript(projectDir) {
    const packageJsonPath = join(projectDir, 'package.json')

    if (!existsSync(packageJsonPath)) {
        return false
    }

    try {
        const content = readFileSync(packageJsonPath, 'utf8')
        let packageJson

        try {
            packageJson = parseJSON(content)
        } catch {
            packageJson = JSON.parse(content)
        }

        return Boolean(packageJson.scripts && packageJson.scripts.toolkit)
    } catch {
        return false
    }
}

/**
 * Get toolkit script from package.json if it exists
 * @param {string} projectDir - Project root directory
 * @returns {string|null}
 */
export function getToolkitScript(projectDir) {
    const packageJsonPath = join(projectDir, 'package.json')

    if (!existsSync(packageJsonPath)) {
        return null
    }

    try {
        const content = readFileSync(packageJsonPath, 'utf8')
        const packageJson = JSON.parse(content)
        return packageJson.scripts?.toolkit || null
    } catch {
        return null
    }
}
