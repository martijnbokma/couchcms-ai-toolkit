#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Template Variable Validator
 *
 * Validates that all template variables exist before rendering
 */

import { TemplateError } from './errors.js'

/**
 * Extract each block contexts from Handlebars template
 * @param {string} templateContent - Template content
 * @returns {Array<{arrayName: string, variables: Array<string>}>} - Array of each contexts
 */
function extractEachContexts(templateContent) {
    const contexts = []
    
    // Match {{#each arrayName}} ... {{/each}} blocks
    const eachPattern = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g
    let match
    
    while ((match = eachPattern.exec(templateContent)) !== null) {
        const arrayName = match[1].trim()
        const blockContent = match[2]
        const variables = []
        
        // Extract variables used within this each block
        const variablePattern = /\{\{([^}]+)\}\}/g
        let varMatch
        
        while ((varMatch = variablePattern.exec(blockContent)) !== null) {
            const variable = varMatch[1].trim()
            
            // Remove helpers and get clean variable name
            const cleanVariable = variable
                .replace(/^(if|unless|each|with|join|add|subtract|multiply|divide|mod|eq|ne|lt|gt|lte|gte|and|or|not|contains|in|block|partial|raw|comment|hash|else)\s+/, '')
                .replace(/^(#|\/|>)\s*/, '')
                .split('.')[0]
                .split(' ')[0]
                .trim()
            
            // Skip special variables and built-in helpers
            if (cleanVariable && !cleanVariable.startsWith('@') && 
                !['if', 'unless', 'each', 'with', 'join', 'add', 'else'].includes(cleanVariable)) {
                if (!variables.includes(cleanVariable)) {
                    variables.push(cleanVariable)
                }
            }
        }
        
        if (variables.length > 0) {
            contexts.push({ arrayName, variables })
        }
    }
    
    return contexts
}

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

    // List of Handlebars built-in helpers that should be ignored
    const builtInHelpers = ['if', 'unless', 'each', 'with', 'lookup', 'log', 'join', 'add', 'subtract', 'multiply', 'divide', 'mod', 'eq', 'ne', 'lt', 'gt', 'lte', 'gte', 'and', 'or', 'not', 'contains', 'in', 'block', 'partial', 'raw', 'comment', 'hash', 'else']

    // List of Handlebars special variables that are automatically available
    const specialVariables = ['@index', '@key', '@first', '@last', '@root', '@level', '@../', '@../..']

    while ((match = variablePattern.exec(templateContent)) !== null) {
        const variable = match[1].trim()

        // Skip special Handlebars variables
        if (variable.startsWith('@') || specialVariables.some(sv => variable.includes(sv))) {
            continue
        }

        // Remove Handlebars helpers and modifiers
        // e.g., "if variable", "each items", "variable.property", "join array"
        const cleanVariable = variable
            .replace(/^(if|unless|each|with|join|add|subtract|multiply|divide|mod|eq|ne|lt|gt|lte|gte|and|or|not|contains|in|block|partial|raw|comment|hash|else)\s+/, '') // Remove helpers
            .replace(/^(#|\/|>)\s*/, '') // Remove block helpers
            .split('.')[0] // Get root variable name
            .split(' ')[0] // Get first word (in case of "join languages, ")
            .trim()

        // Skip if it's a built-in helper, special variable, or empty
        if (cleanVariable && !builtInHelpers.includes(cleanVariable) && !specialVariables.includes(cleanVariable) && !variables.includes(cleanVariable)) {
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

    // Extract context from template (which variables are used in each blocks)
    const eachContexts = extractEachContexts(templateContent)

    for (const variable of variables) {
        // Check if variable exists in templateData (direct or nested)
        if (!(variable in flattened) && !(variable in templateData)) {
            // Check if this variable is used within an each block
            const eachContext = eachContexts.find(ctx => ctx.variables.includes(variable))
            
            if (eachContext) {
                // Variable is used within an each block, check if it exists in the array items
                const arrayName = eachContext.arrayName
                if (arrayName in templateData) {
                    const array = templateData[arrayName]
                    if (Array.isArray(array) && array.length > 0 && typeof array[0] === 'object') {
                        // Check if the variable exists as a property in the first array item
                        if (variable in array[0]) {
                            continue // Found in array items, skip to next variable
                        }
                    }
                }
            }

            // Check for nested access (e.g., project.name, modules.slug)
            const parts = variable.split('.')
            let current = templateData
            let found = true

            for (const part of parts) {
                if (current && typeof current === 'object') {
                    if (Array.isArray(current)) {
                        // For arrays, check if the property exists in array items
                        // e.g., "modules.slug" means check if items in modules array have slug property
                        if (current.length > 0 && typeof current[0] === 'object' && part in current[0]) {
                            found = true
                            break // Found in array items, that's valid
                        } else {
                            found = false
                            break
                        }
                    } else if (part in current) {
                        current = current[part]
                    } else {
                        found = false
                        break
                    }
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
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            // For arrays of objects, flatten the first item's properties
            // This allows validation of properties like "modules.slug"
            Object.assign(flattened, flattenObject(value[0], newKey))
            flattened[newKey] = value // Also keep the array itself
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

