#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Configuration Loader
 *
 * Loads and merges configuration from multiple sources:
 * 1. Toolkit config.yaml (defaults)
 * 2. Project config.yaml or standards.md (overrides)
 *
 * Supports both new config.yaml format and legacy standards.md format
 * for backward compatibility during transition period.
 */

import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { parse as parseYaml } from 'yaml'
import matter from 'gray-matter'

/**
 * Load configuration from all sources and merge
 *
 * Priority order:
 * 1. Toolkit config.yaml (defaults)
 * 2. Project config.yaml or standards.md (overrides)
 *
 * @param {string} projectDir - Project root directory
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - Merged configuration object
 * @throws {Error} - If configuration cannot be loaded
 */
export function loadConfig(projectDir, toolkitPath) {
    // Load project configuration from standards.md
    const projectConfig = loadProjectConfig(projectDir)

    // Add metadata about config source
    projectConfig.config._meta = {
        toolkitPath,
        projectDir,
        configFormat: projectConfig.format,
        configPath: projectConfig.path,
    }

    return projectConfig.config
}

/**
 * Load toolkit configuration from config.yaml (DEPRECATED - no longer used)
 * All configuration is now in project's standards.md
 *
 * @param {string} toolkitPath - Toolkit root directory
 * @returns {object} - Toolkit configuration
 * @throws {Error} - If config.yaml not found or invalid
 */
function loadToolkitConfig(toolkitPath) {
    // DEPRECATED: This function is no longer used
    // All configuration is now in the project's standards.md file
    return {}
}

/**
 * Load project configuration from config.yaml or standards.md
 *
 * Tries in order:
 * 1. config.yaml (new format)
 * 2. standards.md (legacy format with YAML frontmatter)
 *
 * @param {string} projectDir - Project root directory
 * @returns {object} - { config, format, path }
 */
function loadProjectConfig(projectDir) {
    // Try new config.yaml format first
    const configYamlPath = join(projectDir, 'config.yaml')
    if (existsSync(configYamlPath)) {
        try {
            const content = readFileSync(configYamlPath, 'utf8')
            const config = parseYaml(content)

            return {
                config: config || {},
                format: 'config.yaml',
                path: configYamlPath,
            }
        } catch (error) {
            console.warn(`⚠️  Failed to parse config.yaml: ${error.message}`)
            console.warn('   Falling back to standards.md')
        }
    }

    // Fall back to legacy standards.md format
    const standardsMdPath = findStandardsMd(projectDir)
    if (standardsMdPath) {
        console.warn('⚠️  Using legacy standards.md format')
        console.warn('   Consider migrating to config.yaml: bun scripts/migrate.js')

        try {
            const content = readFileSync(standardsMdPath, 'utf8')
            const { data: frontmatter } = matter(content)

            // Convert legacy format to new format
            const config = convertLegacyConfig(frontmatter)

            return {
                config,
                format: 'standards.md',
                path: standardsMdPath,
            }
        } catch (error) {
            console.warn(`⚠️  Failed to parse standards.md: ${error.message}`)
        }
    }

    // No project config found - use toolkit defaults only
    return {
        config: {},
        format: 'none',
        path: null,
    }
}

/**
 * Find standards.md in project directory
 *
 * Searches in order:
 * 1. .project/standards.md
 * 2. docs/standards.md
 * 3. standards.md
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Path to standards.md or null
 */
function findStandardsMd(projectDir) {
    const candidates = [
        join(projectDir, '.project', 'standards.md'),
        join(projectDir, 'docs', 'standards.md'),
        join(projectDir, 'standards.md'),
    ]

    for (const path of candidates) {
        if (existsSync(path)) {
            return path
        }
    }

    return null
}

/**
 * Convert legacy standards.md frontmatter to new config.yaml format
 *
 * @param {object} frontmatter - YAML frontmatter from standards.md
 * @returns {object} - Converted configuration
 */
function convertLegacyConfig(frontmatter) {
    const config = {}

    // Project settings
    if (frontmatter.name || frontmatter.description) {
        config.project = {
            name: frontmatter.name || 'my-project',
            description: frontmatter.description || '',
            type: frontmatter.type || 'CouchCMS Web Application',
        }
    }

    // Toolkit path
    if (frontmatter.toolkit) {
        config.toolkit = {
            path: frontmatter.toolkit,
        }
    }

    // Modules and agents
    if (frontmatter.modules) {
        config.modules = frontmatter.modules
    }
    if (frontmatter.agents) {
        config.agents = frontmatter.agents
    }

    // Framework
    if (frontmatter.framework !== undefined) {
        config.framework = frontmatter.framework
    }

    // Paths (if defined in frontmatter)
    if (frontmatter.paths) {
        config.paths = frontmatter.paths
    }

    // Standards (if defined in frontmatter)
    if (frontmatter.standards) {
        config.standards = frontmatter.standards
    }

    // Naming conventions (if defined in frontmatter)
    if (frontmatter.naming) {
        config.naming = frontmatter.naming
    }

    // Gitflow (if defined in frontmatter)
    if (frontmatter.gitflow) {
        config.gitflow = frontmatter.gitflow
    }

    return config
}

/**
 * Deep merge two objects
 *
 * - Nested objects are merged recursively
 * - Arrays are replaced (not merged)
 * - Undefined values in source are ignored
 * - Null values in source override target
 *
 * @param {object} target - Target object to merge into
 * @param {object} source - Source object to merge from
 * @returns {object} - Merged object (new object, doesn't mutate inputs)
 */
function deepMerge(target, source) {
    const result = { ...target }

    for (const key in source) {
        const sourceValue = source[key]
        const targetValue = target[key]

        // Skip undefined values
        if (sourceValue === undefined) {
            continue
        }

        // Handle null explicitly (null overrides)
        if (sourceValue === null) {
            result[key] = null
            continue
        }

        // Recursively merge objects (but not arrays)
        if (
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue) &&
            targetValue !== null
        ) {
            result[key] = deepMerge(targetValue, sourceValue)
        } else {
            // Replace value (including arrays)
            result[key] = sourceValue
        }
    }

    return result
}

/**
 * Validate configuration structure and values
 *
 * Checks:
 * - Required fields are present
 * - Module names are valid
 * - Agent names are valid
 * - Editor names are supported
 * - Paths are properly formatted
 * - Naming conventions are valid
 *
 * @param {object} config - Configuration object to validate
 * @returns {Array<string>} - Array of validation errors (empty if valid)
 */
export function validateConfig(config) {
    const errors = []

    // Check project settings
    if (!config.project) {
        errors.push('Missing required field: project')
    } else {
        if (!config.project.name) {
            errors.push('Missing required field: project.name')
        }
        if (!config.project.type) {
            errors.push('Missing required field: project.type')
        }
    }

    // Check toolkit path
    if (!config.toolkit || !config.toolkit.path) {
        errors.push('Missing required field: toolkit.path')
    }

    // Validate editors
    if (config.editors) {
        const validEditors = ['cursor', 'claude', 'windsurf', 'kiro', 'copilot']
        const invalidEditors = config.editors.filter((e) => !validEditors.includes(e))
        if (invalidEditors.length > 0) {
            errors.push(`Invalid editors: ${invalidEditors.join(', ')}. Valid: ${validEditors.join(', ')}`)
        }
    }

    // Validate modules (basic check - module files exist check happens during loading)
    if (config.modules && !Array.isArray(config.modules)) {
        errors.push('modules must be an array')
    }

    // Validate agents (basic check - agent files exist check happens during loading)
    if (config.agents && !Array.isArray(config.agents)) {
        errors.push('agents must be an array')
    }

    // Validate framework
    if (config.framework !== undefined) {
        if (typeof config.framework !== 'boolean' && typeof config.framework !== 'object') {
            errors.push('framework must be boolean or object')
        }
        if (typeof config.framework === 'object' && config.framework !== null) {
            const validKeys = ['doctrine', 'directives', 'playbooks', 'enhancements']
            const invalidKeys = Object.keys(config.framework).filter((k) => !validKeys.includes(k))
            if (invalidKeys.length > 0) {
                errors.push(`Invalid framework keys: ${invalidKeys.join(', ')}. Valid: ${validKeys.join(', ')}`)
            }
        }
    }

    // Validate paths
    if (config.paths) {
        if (typeof config.paths !== 'object' || Array.isArray(config.paths)) {
            errors.push('paths must be an object')
        } else {
            for (const [key, value] of Object.entries(config.paths)) {
                if (typeof value !== 'string') {
                    errors.push(`paths.${key} must be a string`)
                }
                if (value.startsWith('/')) {
                    errors.push(`paths.${key} should not start with / (use relative paths)`)
                }
            }
        }
    }

    // Validate standards
    if (config.standards) {
        if (config.standards.indentation !== undefined) {
            const indent = config.standards.indentation
            if (typeof indent !== 'number' || indent < 1 || indent > 8) {
                errors.push('standards.indentation must be a number between 1 and 8')
            }
        }
        if (config.standards.language !== undefined && config.standards.language !== 'english') {
            errors.push('standards.language must be "english"')
        }
        if (config.standards.lineLength !== undefined) {
            const lineLength = config.standards.lineLength
            if (typeof lineLength !== 'number' || lineLength < 80 || lineLength > 200) {
                errors.push('standards.lineLength must be a number between 80 and 200')
            }
        }
    }

    // Validate naming conventions
    if (config.naming) {
        const validStyles = ['snake_case', 'camelCase', 'PascalCase', 'kebab-case']
        for (const [key, value] of Object.entries(config.naming)) {
            if (!validStyles.includes(value)) {
                errors.push(`naming.${key} must be one of: ${validStyles.join(', ')}`)
            }
        }
    }

    // Validate file_contexts
    if (config.file_contexts) {
        if (typeof config.file_contexts !== 'object' || Array.isArray(config.file_contexts)) {
            errors.push('file_contexts must be an object')
        } else {
            for (const [pattern, context] of Object.entries(config.file_contexts)) {
                if (!context.agents && !context.modules) {
                    errors.push(`file_contexts["${pattern}"] must have agents or modules`)
                }
                if (context.agents && !Array.isArray(context.agents)) {
                    errors.push(`file_contexts["${pattern}"].agents must be an array`)
                }
                if (context.modules && !Array.isArray(context.modules)) {
                    errors.push(`file_contexts["${pattern}"].modules must be an array`)
                }
            }
        }
    }

    // Validate validation rules
    if (config.validation) {
        if (config.validation.required_modules && !Array.isArray(config.validation.required_modules)) {
            errors.push('validation.required_modules must be an array')
        }
        if (config.validation.max_line_length !== undefined) {
            const maxLength = config.validation.max_line_length
            if (typeof maxLength !== 'number' || maxLength < 80) {
                errors.push('validation.max_line_length must be a number >= 80')
            }
        }
        if (config.validation.enforce_english !== undefined && typeof config.validation.enforce_english !== 'boolean') {
            errors.push('validation.enforce_english must be a boolean')
        }
    }

    return errors
}

/**
 * Get configuration format information
 *
 * @param {object} config - Configuration object (with _meta)
 * @returns {object} - Format information
 */
export function getConfigFormat(config) {
    if (!config._meta) {
        return {
            format: 'unknown',
            path: null,
            isLegacy: false,
        }
    }

    return {
        format: config._meta.configFormat,
        path: config._meta.configPath,
        isLegacy: config._meta.isLegacyFormat,
    }
}

/**
 * Check if configuration uses legacy format
 *
 * @param {object} config - Configuration object (with _meta)
 * @returns {boolean} - True if using legacy standards.md format
 */
export function isLegacyFormat(config) {
    return config._meta?.isLegacyFormat === true
}
