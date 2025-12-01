#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Configuration Loader
 *
 * Loads and merges configuration from multiple sources:
 * 1. Toolkit config.yaml (defaults)
 * 2. Project standards.md (overrides)
 *
 * Uses standards.md format with YAML frontmatter for configuration.
 */

import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { parse as parseYaml } from 'yaml'
import matter from 'gray-matter'
import { validateYAMLFile, formatYAMLErrors } from './yaml-validator.js'

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
 * Load project configuration from standards.md
 *
 * Only supports .project/standards.md format (standardized location)
 * Shows deprecation warning if config.yaml is found
 *
 * @param {string} projectDir - Project root directory
 * @returns {object} - { config, format, path }
 */
function loadProjectConfig(projectDir) {
    // Check for deprecated config.yaml and show migration message
    const configYamlPath = join(projectDir, 'config.yaml')
    if (existsSync(configYamlPath)) {
        console.warn(`\n⚠️  Found deprecated config.yaml file`)
        console.warn(`   The toolkit now uses .project/standards.md as the standard configuration file.`)
        console.warn(`   Please migrate your configuration:`)
        console.warn(`   \n   bun ai-toolkit-shared/scripts/migrate.js\n`)
        console.warn(`   Or manually move your configuration to .project/standards.md\n`)
    }

    // Load from standards.md format (only supported format)
    const standardsMdPath = findStandardsMd(projectDir)
    if (standardsMdPath) {
        try {
            // Validate YAML syntax before parsing
            const yamlValidation = validateYAMLFile(standardsMdPath)
            if (!yamlValidation.isValid) {
                console.error(formatYAMLErrors(yamlValidation.errors.map((msg, idx) => ({
                    message: msg,
                    line: null,
                    suggestion: yamlValidation.suggestions[idx] || null
                }))))
                throw new Error('YAML syntax errors found. See errors above.')
            }

            const content = readFileSync(standardsMdPath, 'utf8')
            const { data: frontmatter } = matter(content)

            // Frontmatter is already in the correct format, use directly
            return {
                config: frontmatter || {},
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
 * Only checks .project/standards.md (standardized location)
 * If found in old locations, shows migration message
 *
 * @param {string} projectDir - Project root directory
 * @returns {string|null} - Path to standards.md or null
 */
function findStandardsMd(projectDir) {
    // Standard location: .project/standards.md
    const standardPath = join(projectDir, '.project', 'standards.md')
    if (existsSync(standardPath)) {
        return standardPath
    }

    // Check old locations and show migration message if found
    const oldLocations = [
        { path: join(projectDir, 'docs', 'standards.md'), name: 'docs/standards.md' },
        { path: join(projectDir, 'standards.md'), name: 'standards.md' }
    ]

    for (const oldLoc of oldLocations) {
        if (existsSync(oldLoc.path)) {
            console.warn(`\n⚠️  Found configuration in old location: ${oldLoc.name}`)
            console.warn(`   The toolkit now uses .project/standards.md as the standard location.`)
            console.warn(`   Please move your configuration file:`)
            console.warn(`   \n   mv ${oldLoc.name} .project/standards.md\n`)
            // Still return the old path for now to maintain compatibility
            // But warn user to migrate
            return oldLoc.path
        }
    }

    return null
}

/**
 * Convert legacy frontmatter format to current format
 * DEPRECATED: Only used by migrate.js for migration purposes
 *
 * @param {object} frontmatter - YAML frontmatter from standards.md
 * @returns {object} - Converted configuration
 */
export function convertLegacyConfig(frontmatter) {
    // This function is only used by migrate.js
    // For normal operation, frontmatter is used directly
    const config = { ...frontmatter }

    // Normalize project structure if needed
    if (!config.project && (config.name || config.description)) {
        config.project = {
            name: config.name || 'my-project',
            description: config.description || '',
            type: config.type || 'CouchCMS Web Application',
        }
        delete config.name
        delete config.description
        delete config.type
    }

    // Normalize toolkit path if needed
    if (config.toolkit && typeof config.toolkit === 'string') {
        // Keep as string (current format supports both)
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

    // Check minimal required fields
    if (!config.project || !config.project.name) {
        errors.push('Missing required field: project.name')
    }

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
    // Agents can be array, object (for editor-specific), or undefined
    if (config.agents && typeof config.agents === 'object' && !Array.isArray(config.agents)) {
        // Check if it's editor-specific config (has cursor, claude, etc keys)
        const editorKeys = ['cursor', 'claude', 'windsurf', 'kiro', 'copilot', 'vscode', 'tabnine', 'amazon_codewhisperer']
        const hasEditorKeys = Object.keys(config.agents).some(k => editorKeys.includes(k))
        if (!hasEditorKeys) {
            errors.push('agents must be an array or object with editor keys')
        }
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

    // Validate naming conventions (optional)
    if (config.naming) {
        const validStyles = ['snake_case', 'camelCase', 'PascalCase', 'kebab-case']
        for (const [key, value] of Object.entries(config.naming)) {
            if (value && !validStyles.includes(value)) {
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
 * @returns {boolean} - True if using standards.md format
 */
export function isLegacyFormat(config) {
    return config._meta?.isLegacyFormat === true
}
