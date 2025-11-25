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
 * Find configuration file (standards.md or project.md)
 *
 * Detection priority:
 * 1. docs/standards.md (recommended)
 * 2. standards.md (root)
 * 3. project.md (fallback)
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Path to config file or null if not found
 */
export function findConfigFile(projectDir) {
    const candidates = [
        join(projectDir, 'docs', 'standards.md'),
        join(projectDir, 'standards.md'),
        join(projectDir, 'project.md'), // fallback for legacy support
    ]

    for (const path of candidates) {
        if (existsSync(path)) {
            return path
        }
    }

    return null
}

/**
 * Load configuration file (standards.md or project.md)
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
        isStandards: configPath.includes('standards.md'),
    }
}

/**
 * Get config file name for display
 *
 * @param {string} projectDir - Project root directory
 * @returns {string} - Config file name (standards.md or project.md)
 */
export function getConfigFileName(projectDir) {
    const config = loadConfig(projectDir)

    if (!config) {
        return null
    }

    if (config.isStandards) {
        return config.path.includes('docs/') ? 'docs/standards.md' : 'standards.md'
    }

    return 'project.md'
}

/**
 * Check if standards.md exists
 *
 * @param {string} projectDir - Project root directory
 * @returns {boolean} - True if standards.md found
 */
export function hasStandards(projectDir) {
    const config = loadConfig(projectDir)
    return config && config.isStandards
}
