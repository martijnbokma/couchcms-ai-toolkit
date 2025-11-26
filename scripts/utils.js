#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Utility Functions
 *
 * Shared utilities for toolkit scripts
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

/**
 * Find configuration file (standards.md)
 *
 * Detection priority:
 * 1. .project/standards.md (recommended - project configuration directory)
 * 2. docs/standards.md (documentation location)
 * 3. standards.md (root directory)
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Path to config file or null if not found
 */
export function findConfigFile(projectDir) {
    const candidates = [
        join(projectDir, '.project', 'standards.md'), // Recommended - project config directory
        join(projectDir, 'docs', 'standards.md'), // Documentation location
        join(projectDir, 'standards.md'), // Root directory
    ]

    for (const path of candidates) {
        if (existsSync(path)) {
            return path
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
        return '.project/standards.md'
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
