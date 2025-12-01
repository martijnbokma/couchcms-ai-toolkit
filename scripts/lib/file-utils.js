#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - File Utilities
 *
 * Common file system operations
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, copyFileSync, unlinkSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { EOL } from 'os'
import { FileSystemError } from './errors.js'

/**
 * Ensure directory exists, create if needed
 * @param {string} dirPath - Directory path
 */
export function ensureDir(dirPath) {
    try {
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true })
        }
    } catch (error) {
        throw new FileSystemError(`Failed to create directory: ${dirPath}`, error)
    }
}

/**
 * Read file safely with error handling
 * @param {string} filePath - File path
 * @param {string} [encoding='utf8'] - File encoding
 * @returns {string} - File content
 */
export function readFileSafe(filePath, encoding = 'utf8') {
    try {
        if (!existsSync(filePath)) {
            throw new FileSystemError(`File not found: ${filePath}`)
        }
        return readFileSync(filePath, encoding)
    } catch (error) {
        if (error instanceof FileSystemError) {
            throw error
        }
        throw new FileSystemError(`Failed to read file: ${filePath}`, error)
    }
}

/**
 * Create backup of existing file
 * @param {string} filePath - File path to backup
 * @returns {string|null} - Backup file path or null if no backup needed
 */
function createBackup(filePath) {
    if (!existsSync(filePath)) {
        return null
    }

    const backupPath = `${filePath}.backup`
    try {
        copyFileSync(filePath, backupPath)
        return backupPath
    } catch (error) {
        // If backup fails, continue anyway (not critical)
        return null
    }
}

/**
 * Remove backup file
 * @param {string} backupPath - Backup file path
 */
function removeBackup(backupPath) {
    if (backupPath && existsSync(backupPath)) {
        try {
            unlinkSync(backupPath)
        } catch (error) {
            // Ignore errors when removing backup
        }
    }
}

/**
 * Rollback: restore from backup
 * @param {string} filePath - Original file path
 * @param {string} backupPath - Backup file path
 */
function rollbackFromBackup(filePath, backupPath) {
    if (backupPath && existsSync(backupPath)) {
        try {
            copyFileSync(backupPath, filePath)
            removeBackup(backupPath)
        } catch (error) {
            throw new FileSystemError(`Failed to rollback from backup: ${filePath}`, error)
        }
    }
}

/**
 * Normalize line endings to LF (Unix-style) for cross-platform compatibility
 * @param {string} content - Content to normalize
 * @returns {string} - Content with normalized line endings
 */
function normalizeLineEndingsContent(content) {
    // Replace all line ending variations with LF
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

/**
 * Write file safely with atomic writes, backup, and cross-platform line endings
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @param {string} [encoding='utf8'] - File encoding
 * @param {boolean} [shouldCreateBackup=true] - Whether to create backup before writing
 * @param {boolean} [normalizeLineEndings=true] - Whether to normalize line endings to LF
 */
export function writeFileSafe(filePath, content, encoding = 'utf8', shouldCreateBackup = true, normalizeLineEndings = true) {
    let backupPath = null

    try {
        ensureDir(dirname(filePath))

        // Normalize line endings to LF for cross-platform compatibility
        if (normalizeLineEndings) {
            content = normalizeLineEndingsContent(content)
        }

        // Create backup if file exists
        if (shouldCreateBackup && existsSync(filePath)) {
            backupPath = createBackup(filePath)
        }

        // Write to temporary file first (atomic write)
        const tempPath = `${filePath}.tmp`
        writeFileSync(tempPath, content, encoding)

        // Rename temp file to final location (atomic on most filesystems)
        renameSync(tempPath, filePath)

        // Remove backup after successful write
        if (backupPath) {
            removeBackup(backupPath)
        }
    } catch (error) {
        // Rollback from backup if write failed
        if (backupPath) {
            try {
                rollbackFromBackup(filePath, backupPath)
            } catch (rollbackError) {
                // If rollback fails, at least we tried
            }
        }

        // Clean up temp file if it exists
        const tempPath = `${filePath}.tmp`
        if (existsSync(tempPath)) {
            try {
                unlinkSync(tempPath)
            } catch {
                // Ignore cleanup errors
            }
        }

        if (error instanceof FileSystemError) {
            throw error
        }
        // Include underlying error message for better debugging
        const errorMessage = error?.message ? `${error.message}` : 'Unknown error'
        throw new FileSystemError(`Failed to write file: ${filePath} - ${errorMessage}`, error)
    }
}

/**
 * Check if file content has changed
 * @param {string} filePath - Path to file
 * @param {string} newContent - New content to compare
 * @returns {boolean} - True if content is different or file doesn't exist
 */
export function hasChanged(filePath, newContent) {
    if (!existsSync(filePath)) {
        return true
    }

    try {
        const oldContent = readFileSync(filePath, 'utf8')
        return oldContent !== newContent
    } catch (error) {
        // If we can't read the file, assume it needs to be written
        return true
    }
}

/**
 * Find file in current directory or parent directories
 * @param {string} fileName - File name to search for
 * @param {string} [startDir=process.cwd()] - Directory to start searching from
 * @returns {string|null} - Path to file or null if not found
 */
export function findFileUp(fileName, startDir = process.cwd()) {
    let currentDir = startDir

    while (currentDir !== '/') {
        const filePath = join(currentDir, fileName)
        if (existsSync(filePath)) {
            return filePath
        }
        currentDir = dirname(currentDir)
    }

    return null
}

/**
 * Resolve path relative to project directory
 * Handles relative paths, absolute paths, and ~ expansion
 * @param {string} path - Path to resolve
 * @param {string} projectDir - Project root directory
 * @returns {string} - Resolved absolute path
 */
export function resolvePath(path, projectDir) {
    if (!path) {
        return projectDir
    }

    // Expand ~ to home directory
    if (path.startsWith('~')) {
        path = path.replace('~', process.env.HOME || '')
    }

    // Resolve relative paths from project directory
    if (!path.startsWith('/')) {
        path = resolve(projectDir, path)
    }

    return path
}
