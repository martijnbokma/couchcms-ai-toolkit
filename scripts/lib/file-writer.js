#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - File Writer
 * 
 * Handles writing generated configuration files to disk with optimization
 */

import { writeFileSafe, hasChanged } from './file-utils.js'
import { FileSystemError } from './errors.js'
import { debug, info, warn } from './logger.js'

/**
 * Write generated configs to disk
 * Skips files that haven't changed to improve performance
 * 
 * @param {Map<string, string>} configs - Map of file path → content
 * @param {string} projectDir - Project root directory
 * @returns {Object} - Statistics about written files
 * @throws {FileSystemError} - If file writing fails
 */
export function writeConfigs(configs, projectDir) {
    if (!configs || configs.size === 0) {
        warn('No configs to write')
        return { written: 0, skipped: 0, failed: 0, errors: [] }
    }

    const stats = {
        written: 0,
        skipped: 0,
        failed: 0,
        errors: []
    }

    debug(`Writing ${configs.size} config files to ${projectDir}`)

    for (const [relativePath, content] of configs) {
        try {
            const fullPath = `${projectDir}/${relativePath}`
            
            // Check if content has changed
            if (!hasChanged(fullPath, content)) {
                debug(`Skipped (unchanged): ${relativePath}`)
                stats.skipped++
                continue
            }

            // Write file
            writeFileSafe(fullPath, content)
            info(`Written: ${relativePath}`)
            stats.written++

        } catch (error) {
            stats.failed++
            const errorMsg = `Failed to write ${relativePath}: ${error.message}`
            stats.errors.push(errorMsg)
            warn(errorMsg)
            
            // Continue writing other files even if one fails
            continue
        }
    }

    return stats
}

/**
 * Write a single config file
 * Convenience function for writing individual files
 * 
 * @param {string} filePath - Relative path to file
 * @param {string} content - File content
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if file was written, false if skipped
 * @throws {FileSystemError} - If file writing fails
 */
export function writeConfig(filePath, content, projectDir) {
    const fullPath = `${projectDir}/${filePath}`
    
    // Check if content has changed
    if (!hasChanged(fullPath, content)) {
        debug(`Skipped (unchanged): ${filePath}`)
        return false
    }

    // Write file
    writeFileSafe(fullPath, content)
    info(`Written: ${filePath}`)
    return true
}

/**
 * Format write statistics for display
 * 
 * @param {Object} stats - Statistics from writeConfigs
 * @returns {string} - Formatted statistics message
 */
export function formatWriteStats(stats) {
    const parts = []
    
    if (stats.written > 0) {
        parts.push(`${stats.written} written`)
    }
    
    if (stats.skipped > 0) {
        parts.push(`${stats.skipped} skipped`)
    }
    
    if (stats.failed > 0) {
        parts.push(`${stats.failed} failed`)
    }
    
    return parts.join(', ')
}
