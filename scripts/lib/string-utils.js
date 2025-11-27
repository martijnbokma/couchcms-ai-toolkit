#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - String Utilities
 * 
 * Common string manipulation functions
 */

/**
 * Replace {{variable}} placeholders in content
 * Supports nested variables like {{paths.css}} or {{project.name}}
 * @param {string} content - Content with placeholders
 * @param {object} variables - Variables to replace
 * @param {string} [prefix=''] - Prefix for nested variables (e.g., 'paths')
 * @returns {string} - Content with variables replaced
 */
export function replaceVariables(content, variables, prefix = '') {
    let result = content
    
    for (const [key, value] of Object.entries(variables)) {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            result = replaceVariables(result, value, prefix ? `${prefix}.${key}` : key)
        } else {
            const pattern = new RegExp(`\\{\\{${prefix ? `${prefix}.` : ''}${key}\\}\\}`, 'g')
            result = result.replace(pattern, String(value))
        }
    }
    
    return result
}

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string} - kebab-case string
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
}

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string} - camelCase string
 */
export function toCamelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^[A-Z]/, c => c.toLowerCase())
}

/**
 * Convert string to PascalCase
 * @param {string} str - String to convert
 * @returns {string} - PascalCase string
 */
export function toPascalCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^[a-z]/, c => c.toUpperCase())
}

/**
 * Truncate string to max length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength) {
        return str
    }
    return str.substring(0, maxLength - 3) + '...'
}

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} [plural] - Plural form (defaults to singular + 's')
 * @returns {string} - Pluralized word
 */
export function pluralize(count, singular, plural) {
    if (count === 1) {
        return singular
    }
    return plural || `${singular}s`
}
