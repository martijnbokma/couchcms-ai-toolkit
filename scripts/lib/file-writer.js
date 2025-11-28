#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - File Writer
 * 
 * Handles writing generated configuration files to disk with optimization
 */

import { writeFileSafe, hasChanged, ensureDir, readFileSafe } from './file-utils.js'
import { FileSystemError } from './errors.js'
import { debug, info, warn } from './logger.js'
import { readdirSync, statSync, copyFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

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
    
    if (stats.copied > 0) {
        parts.push(`${stats.copied} copied`)
    }
    
    return parts.join(', ')
}

/**
 * Validate MDC file syntax
 * Checks for valid YAML frontmatter with required fields
 * 
 * @param {string} filePath - Path to MDC file
 * @returns {object} - { valid: boolean, errors: Array<string> }
 */
export function validateMdcFile(filePath) {
    const errors = []
    
    try {
        const content = readFileSafe(filePath)
        
        // Parse YAML frontmatter
        const { data: frontmatter, content: body } = matter(content)
        
        // Check for required fields
        if (!frontmatter.description) {
            errors.push('Missing required field: description')
        }
        
        if (!frontmatter.globs) {
            errors.push('Missing required field: globs')
        } else if (!Array.isArray(frontmatter.globs)) {
            errors.push('Field "globs" must be an array')
        }
        
        // Check if body exists
        if (!body || body.trim().length === 0) {
            errors.push('MDC file must have content after frontmatter')
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        }
        
    } catch (error) {
        return {
            valid: false,
            errors: [`Failed to parse MDC file: ${error.message}`]
        }
    }
}

/**
 * Copy directory contents from source to target with optional pattern matching
 * 
 * @param {string} sourcePath - Source directory path
 * @param {string} targetPath - Target directory path
 * @param {string} [pattern='*'] - File pattern to match (e.g., '*.mdc', '*.md')
 * @param {boolean} [validate=false] - Whether to validate MDC files
 * @returns {object} - { copiedFiles: Array<string>, validationErrors: Array<object> }
 * @throws {FileSystemError} - If directory operations fail
 */
export function copyDirectory(sourcePath, targetPath, pattern = '*', validate = false) {
    try {
        // Ensure target directory exists
        ensureDir(targetPath)
        
        // Read source directory
        const files = readdirSync(sourcePath)
        const copiedFiles = []
        const validationErrors = []
        
        // Convert glob pattern to regex
        const regex = pattern === '*' 
            ? /.*/ 
            : new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$')
        
        for (const file of files) {
            const sourceFile = join(sourcePath, file)
            const stat = statSync(sourceFile)
            
            // Skip directories
            if (stat.isDirectory()) {
                continue
            }
            
            // Check if file matches pattern
            if (!regex.test(file)) {
                continue
            }
            
            // Validate MDC files if requested
            if (validate && file.endsWith('.mdc')) {
                const validation = validateMdcFile(sourceFile)
                if (!validation.valid) {
                    validationErrors.push({
                        file: file,
                        errors: validation.errors
                    })
                    warn(`Validation failed for ${file}: ${validation.errors.join(', ')}`)
                    // Continue copying even if validation fails
                }
            }
            
            // Copy file
            const targetFile = join(targetPath, file)
            copyFileSync(sourceFile, targetFile)
            copiedFiles.push(file)
            debug(`Copied: ${file} → ${targetPath}`)
        }
        
        info(`Copied ${copiedFiles.length} files from ${sourcePath} to ${targetPath}`)
        
        return {
            copiedFiles: copiedFiles,
            validationErrors: validationErrors
        }
        
    } catch (error) {
        if (error instanceof FileSystemError) {
            throw error
        }
        throw new FileSystemError(`Failed to copy directory: ${sourcePath} → ${targetPath}`, error)
    }
}

/**
 * Ensure directory exists (re-exported from file-utils for convenience)
 * 
 * @param {string} dirPath - Directory path to ensure exists
 * @throws {FileSystemError} - If directory creation fails
 */
export function ensureDirectory(dirPath) {
    ensureDir(dirPath)
}

/**
 * Write editor configurations with support for files and directories
 * 
 * @param {Object} editorConfigs - Editor configuration object
 * @param {Object} templateData - Data for template rendering
 * @param {string} projectDir - Project root directory
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {Object} - Statistics about written/copied files
 */
export function writeEditorConfigs(editorConfigs, templateData, projectDir, toolkitPath) {
    const stats = {
        written: 0,
        skipped: 0,
        copied: 0,
        failed: 0,
        errors: [],
        validationErrors: []
    }
    
    try {
        // Process each editor configuration
        for (const [editorName, config] of Object.entries(editorConfigs)) {
            debug(`Processing ${editorName} configuration`)
            
            // Handle single files
            if (config.files) {
                for (const [filePath, fileConfig] of Object.entries(config.files)) {
                    try {
                        if (fileConfig.type === 'template') {
                            // Template rendering will be handled by template-engine
                            // This is a placeholder for future integration
                            debug(`Template file: ${filePath}`)
                        }
                    } catch (error) {
                        stats.failed++
                        stats.errors.push(`Failed to process ${filePath}: ${error.message}`)
                        warn(`Failed to process ${filePath}: ${error.message}`)
                    }
                }
            }
            
            // Handle directories
            if (config.directories) {
                for (const [dirPath, dirConfig] of Object.entries(config.directories)) {
                    try {
                        if (dirConfig.type === 'copy') {
                            // Copy files from toolkit to project
                            const sourcePath = join(toolkitPath, dirConfig.source)
                            const targetPath = join(projectDir, dirPath)
                            const result = copyDirectory(sourcePath, targetPath, dirConfig.pattern, true)
                            stats.copied += result.copiedFiles.length
                            if (result.validationErrors.length > 0) {
                                stats.validationErrors.push(...result.validationErrors)
                            }
                        } else if (dirConfig.type === 'generated') {
                            // Generated files will be handled by generators
                            debug(`Generated directory: ${dirPath}`)
                        }
                    } catch (error) {
                        stats.failed++
                        stats.errors.push(`Failed to process directory ${dirPath}: ${error.message}`)
                        warn(`Failed to process directory ${dirPath}: ${error.message}`)
                    }
                }
            }
        }
        
        return stats
        
    } catch (error) {
        throw new FileSystemError('Failed to write editor configs', error)
    }
}
