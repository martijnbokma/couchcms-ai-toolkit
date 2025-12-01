#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Path Utilities
 *
 * Centralized path resolution and toolkit root detection
 * Single source of truth for all path-related constants
 */

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

/**
 * Get toolkit root directory
 * Resolves to the parent directory of the scripts folder
 * @returns {string} - Absolute path to toolkit root
 */
export function getToolkitRoot() {
    // Get the directory of this file (lib/)
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    // Parent of lib/ is scripts/, parent of scripts/ is toolkit root
    return resolve(__dirname, '..', '..')
}

/**
 * Get scripts directory
 * @returns {string} - Absolute path to scripts directory
 */
export function getScriptsDir() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    return resolve(__dirname, '..')
}

/**
 * Get lib directory
 * @returns {string} - Absolute path to lib directory
 */
export function getLibDir() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    return __dirname
}

/**
 * Cache for toolkit root (computed once)
 */
let _toolkitRootCache = null

/**
 * Get toolkit root (cached version for performance)
 * @returns {string} - Absolute path to toolkit root
 */
export function getToolkitRootCached() {
    if (!_toolkitRootCache) {
        _toolkitRootCache = getToolkitRoot()
    }
    return _toolkitRootCache
}
