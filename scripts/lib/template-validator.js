#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Template Variable Validator
 *
 * Validates that all template variables exist before rendering
 */

import { TemplateError } from './errors.js'

/**
 * Extract all variable references from Handlebars template
 * @param {string} templateContent - Template content
 * @returns {Array<string>} - Array of variable names (without {{}})
 */
export function extractTemplateVariables(templateContent) {
    const variables = []

    // Match {{variable}} and {{variable.property}} patterns
    const variablePattern = /\{\{([^}]+)\}\}/g
    let match

    while ((match = variablePattern.exec(templateContent)) !== null) {
        const variable = match[1].trim()

        // Remove Handlebars helpers and modifiers
        // e.g., "if variable", "each items", "variable.property"
        const cleanVariable = variable
            .replace(/^(if|unless|each|with)\s+/, '') // Remove helpers
            .replace(/^(#|\/|>)\s*/, '') // Remove block helpers
            .split('.')[0] // Get root variable name
            .trim()

        if (cleanVariable && !variables.includes(cleanVariable)) {
            variables.push(cleanVariable)
        }
    }

    return variables
}

/**
 * Validate template variables against provided data
 * @param {string} templateContent - Template content
 * @param {object} templateData - Data object for template
 * @param {string} templatePath - Path to template file (for error messages)
 * @returns {object} - { isValid: boolean, missing: Array<string>, warnings: Array<string> }
 */
export function validateTemplateVariables(templateContent, templateData, templatePath) {
    const variables = extractTemplateVariables(templateContent)
    const missing = []
    const warnings = []

    // Flatten templateData for easier checking
    const flattened = flattenObject(templateData)

    for (const variable of variables) {
        // Check if variable exists in templateData
        if (!(variable in flattened) && !(variable in templateData)) {
            // Check for nested access (e.g., project.name)
            const parts = variable.split('.')
            let current = templateData
            let found = true

            for (const part of parts) {
                if (current && typeof current === 'object' && part in current) {
                    current = current[part]
                } else {
                    found = false
                    break
                }
            }

            if (!found) {
                missing.push(variable)
            }
        }
    }

    // Check for optional variables (common patterns that might be missing)
    const optionalPatterns = ['context_path', 'project_context', 'roles']
    for (const pattern of optionalPatterns) {
        if (variables.includes(pattern) && !(pattern in flattened) && !(pattern in templateData)) {
            warnings.push(`Optional variable "${pattern}" is missing (will be empty)`)
        }
    }

    return {
        isValid: missing.length === 0,
        missing,
        warnings
    }
}

/**
 * Flatten nested object for variable checking
 * @param {object} obj - Object to flatten
 * @param {string} [prefix=''] - Prefix for nested keys
 * @returns {object} - Flattened object
 */
function flattenObject(obj, prefix = '') {
    const flattened = {}

    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            Object.assign(flattened, flattenObject(value, newKey))
        } else {
            flattened[newKey] = value
        }
    }

    return flattened
}

/**
 * Format template validation errors
 * @param {Array<string>} missing - Missing variables
 * @param {string} templatePath - Template file path
 * @returns {string} - Formatted error message
 */
export function formatTemplateErrors(missing, templatePath) {
    if (missing.length === 0) {
        return ''
    }

    let message = `\n❌ Template validation failed: ${templatePath}\n\n`
    message += `Missing required variables:\n`

    for (const variable of missing) {
        message += `   • ${variable}\n`
    }

    message += `\n💡 Add these variables to your template data or remove them from the template.\n`

    return message
}

/**
 * Validate template before rendering
 * @param {string} templateContent - Template content
 * @param {object} templateData - Data for template
 * @param {string} templatePath - Path to template file
 * @throws {TemplateError} - If validation fails
 */
export function validateTemplate(templateContent, templateData, templatePath) {
    const validation = validateTemplateVariables(templateContent, templateData, templatePath)

    if (!validation.isValid) {
        const errorMessage = formatTemplateErrors(validation.missing, templatePath)
        throw new TemplateError(errorMessage, 'MISSING_TEMPLATE_VARIABLES')
    }

    if (validation.warnings.length > 0) {
        for (const warning of validation.warnings) {
            console.warn(`⚠️  ${warning}`)
        }
    }
}
