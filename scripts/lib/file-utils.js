#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - File Utilities
 * 
 * Common file system operations
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join, resolve } from 'path'
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
 * Write file safely with error handling
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 * @param {string} [encoding='utf8'] - File encoding
 */
export function writeFileSafe(filePath, content, encoding = 'utf8') {
    try {
        ensureDir(dirname(filePath))
        writeFileSync(filePath, content, encoding)
    } catch (error) {
        if (error instanceof FileSystemError) {
            throw error
        }
        throw new FileSystemError(`Failed to write file: ${filePath}`, error)
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
