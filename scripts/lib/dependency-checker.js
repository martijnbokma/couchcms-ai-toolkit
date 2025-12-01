#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Dependency Checker
 *
 * Automatically checks and installs toolkit dependencies
 */

import { existsSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { progress, success, warn, error } from './logger.js'
import { FileSystemError } from './errors.js'

const execAsync = promisify(exec)

/**
 * Check if dependencies are installed
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {boolean} - True if dependencies are installed
 */
export function areDependenciesInstalled(toolkitPath) {
    const nodeModules = join(toolkitPath, 'node_modules')
    const packageJson = join(toolkitPath, 'package.json')

    // Check if package.json exists and node_modules directory exists
    if (!existsSync(packageJson)) {
        return false
    }

    if (!existsSync(nodeModules)) {
        return false
    }

    // Check if required packages are installed
    const requiredPackages = ['gray-matter', 'yaml', 'handlebars']
    for (const pkg of requiredPackages) {
        const pkgPath = join(nodeModules, pkg)
        if (!existsSync(pkgPath)) {
            return false
        }
    }

    return true
}

/**
 * Detect which package manager is available
 * @returns {Promise<'bun'|'npm'|null>} - Available package manager or null
 */
async function detectPackageManager() {
    try {
        await execAsync('bun --version')
        return 'bun'
    } catch {
        try {
            await execAsync('npm --version')
            return 'npm'
        } catch {
            return null
        }
    }
}

/**
 * Install dependencies automatically
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {Promise<void>}
 * @throws {FileSystemError} - If installation fails
 */
export async function ensureDependencies(toolkitPath) {
    // Check if already installed
    if (areDependenciesInstalled(toolkitPath)) {
        return
    }

    const packageJson = join(toolkitPath, 'package.json')
    if (!existsSync(packageJson)) {
        throw new FileSystemError(
            `package.json not found in toolkit directory: ${toolkitPath}\n` +
            'This may indicate the toolkit path is incorrect.'
        )
    }

    // Detect package manager
    const pm = await detectPackageManager()
    if (!pm) {
        throw new FileSystemError(
            'No package manager found. Please install Bun (recommended) or Node.js:\n' +
            '  Bun: curl -fsSL https://bun.sh/install | bash\n' +
            '  Node.js: https://nodejs.org/'
        )
    }

    progress(`Installing toolkit dependencies using ${pm}...`)

    try {
        const command = pm === 'bun' ? 'bun install' : 'npm install'
        const { stdout, stderr } = await execAsync(command, {
            cwd: toolkitPath,
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        })

        if (stderr && !stderr.includes('npm WARN')) {
            // npm warnings are usually safe to ignore
            warn(stderr)
        }

        success('Dependencies installed successfully')
    } catch (err) {
        const errorMessage = err.stderr || err.message || 'Unknown error'
        throw new FileSystemError(
            `Failed to install dependencies:\n${errorMessage}\n\n` +
            `Please run manually:\n` +
            `  cd ${toolkitPath}\n` +
            `  ${pm} install\n` +
            `  cd -`,
            err
        )
    }
}

/**
 * Check and install dependencies if needed
 * This is the main function to call from scripts
 * @param {string} toolkitPath - Path to toolkit directory
 * @returns {Promise<void>}
 */
export async function checkAndInstallDependencies(toolkitPath) {
    try {
        if (!areDependenciesInstalled(toolkitPath)) {
            await ensureDependencies(toolkitPath)
        }
    } catch (err) {
        // Re-throw with context
        if (err instanceof FileSystemError) {
            throw err
        }
        throw new FileSystemError(
            `Error checking dependencies: ${err.message}`,
            err
        )
    }
}
