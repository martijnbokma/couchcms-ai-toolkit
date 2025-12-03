#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Utility Functions
 *
 * Shared utilities for toolkit scripts
 */

import { existsSync, readFileSync, mkdirSync, copyFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import matter from 'gray-matter'

// Track if migration warning has been shown to avoid duplicate messages
let migrationWarningShown = false

/**
 * Toolkit-specific error class for better error handling
 * @extends Error
 */
export class ToolkitError extends Error {
    /**
     * @param {string} message - Error message
     * @param {string} code - Error code for categorization
     * @param {Error} [cause] - Original error that caused this error
     */
    constructor(message, code, cause) {
        super(message)
        this.name = 'ToolkitError'
        this.code = code
        this.cause = cause
    }
}

/**
 * Handle and display errors consistently
 * @param {Error} error - Error to handle
 * @param {string} context - Context where error occurred
 */
export function handleError(error, context) {
    if (error instanceof ToolkitError) {
        console.error(`❌ ${context}: ${error.message} (${error.code})`)
        if (error.cause) {
            console.error(`   Cause: ${error.cause.message}`)
        }
    } else {
        console.error(`❌ ${context}: ${error.message}`)
        if (error.stack && process.env.DEBUG) {
            console.error(error.stack)
        }
    }
    process.exit(1)
}

/**
 * Find configuration file (standards.md)
 *
 * Checks locations in priority order:
 * 1. config/standards.md (recommended - visible in Finder)
 * 2. .project/standards.md (backward compatibility)
 * 3. docs/standards.md (legacy)
 * 4. standards.md (root, legacy)
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Path to config file or null if not found
 */
export function findConfigFile(projectDir) {
    // Primary location: config/standards.md (visible, organized)
    const primaryPath = join(projectDir, 'config', 'standards.md')
    if (existsSync(primaryPath)) {
        return primaryPath
    }

    // Backward compatibility: .project/standards.md
    const legacyPath = join(projectDir, '.project', 'standards.md')
    if (existsSync(legacyPath)) {
        if (!migrationWarningShown) {
            console.warn(`\n⚠️  Found configuration in legacy location: .project/standards.md`)
            console.warn(`   The toolkit now uses config/standards.md as the recommended location.`)
            console.warn(`   Consider migrating for better visibility:`)
            console.warn(`   \n   mkdir -p config && mv .project/standards.md config/standards.md\n`)
            migrationWarningShown = true
        }
        return legacyPath
    }

    // Check other legacy locations
    const oldLocations = [
        { path: join(projectDir, 'docs', 'standards.md'), name: 'docs/standards.md' },
        { path: join(projectDir, 'standards.md'), name: 'standards.md' }
    ]

    for (const oldLoc of oldLocations) {
        if (existsSync(oldLoc.path)) {
            // Only show warning once per process to avoid duplicate messages
            if (!migrationWarningShown) {
                console.warn(`\n⚠️  Found configuration in old location: ${oldLoc.name}`)
                console.warn(`   The toolkit now uses config/standards.md as the recommended location.`)
                console.warn(`   Please migrate your configuration file:`)
                console.warn(`   \n   mkdir -p config && mv ${oldLoc.name} config/standards.md\n`)
                migrationWarningShown = true
            }
            // Auto-migrate: copy to config/standards.md if it doesn't exist
            const targetPath = join(projectDir, 'config', 'standards.md')
            if (!existsSync(targetPath)) {
                const targetDir = join(projectDir, 'config')
                if (!existsSync(targetDir)) {
                    mkdirSync(targetDir, { recursive: true })
                }
                copyFileSync(oldLoc.path, targetPath)
                console.log(`✅ Auto-migrated: ${oldLoc.name} → config/standards.md`)
                return targetPath
            }
            // Still return the old path for now to maintain compatibility
            // But warn user to migrate
            return oldLoc.path
        }
    }

    return null
}

/**
 * Load configuration file (standards.md)
 *
 * @param {string} projectDir - Project root directory
 * @returns {object|null} - Parsed config with { path, frontmatter, content } or null
 */
export function loadConfig(projectDir) {
    const configPath = findConfigFile(projectDir)

    if (!configPath) {
        return null
    }

    const content = readFileSync(configPath, 'utf8')
    const { data: frontmatter, content: body } = matter(content)

    return {
        path: configPath,
        frontmatter,
        content: body,
    }
}

/**
 * Get config file name for display
 *
 * @param {string} projectDir - Project root directory
 * @returns {string} - Config file name (standards.md)
 */
export function getConfigFileName(projectDir) {
    const config = loadConfig(projectDir)

    if (!config) {
        return null
    }

    if (config.path.includes('.project/')) {
        return 'config/standards.md'
    }
    if (config.path.includes('docs/')) {
        return 'docs/standards.md'
    }
    return 'standards.md'
}

/**
 * Check if standards.md exists
 *
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if standards.md found
 */
export function hasStandards(projectDir) {
    const config = loadConfig(projectDir)
    return config !== null
}

/**
 * Find configuration file (standards.md) in current directory or parent directories
 * Searches up the directory tree until a config file is found or root is reached
 *
 * @param {string} [startDir=process.cwd()] - Directory to start searching from
 * @returns {string|null} - Path to config file or null if not found
 */
export function findProjectFile(startDir = process.cwd()) {
    let currentDir = startDir

    while (currentDir !== '/') {
        const configPath = findConfigFile(currentDir)
        if (configPath) {
            return configPath
        }
        currentDir = dirname(currentDir)
    }

    return null
}

/**
 * Resolve toolkit path from project config
 * Handles relative paths, absolute paths, and ~ expansion
 *
 * @param {string} configPath - Toolkit path from config (may be relative, absolute, or ~)
 * @param {string} projectDir - Project root directory
 * @param {string} [defaultToolkitPath] - Default toolkit path if configPath is empty
 * @returns {string} - Resolved absolute toolkit path
 */
export function resolveToolkitPath(configPath, projectDir, defaultToolkitPath) {
    if (!configPath) {
        return defaultToolkitPath || resolve(projectDir, './ai-toolkit-shared')
    }

    // Expand ~ to home directory
    if (configPath.startsWith('~')) {
        configPath = configPath.replace('~', process.env.HOME || '')
    }

    // Resolve relative paths from project directory (not current working directory)
    if (!configPath.startsWith('/')) {
        configPath = resolve(projectDir, configPath)
    }

    return configPath
}

/**
 * Replace {{variable}} placeholders in content
 * Supports nested variables like {{paths.css}} or {{project.name}}
 *
 * @param {string} content - Content with placeholders
 * @param {object} variables - Variables to replace
 * @param {string} [prefix=''] - Prefix for nested variables (e.g., 'paths')
 * @returns {string} - Content with variables replaced
 */
export function replaceVariables(content, variables, prefix = '') {
    let result = content

    for (const [key, value] of Object.entries(variables)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            result = replaceVariables(result, value, prefix ? `${prefix}.${key}` : key)
        } else {
            const pattern = new RegExp(`\\{\\{${prefix ? `${prefix}.` : ''}${key}\\}\\}`, 'g')
            result = result.replace(pattern, String(value))
        }
    }

    return result
}
