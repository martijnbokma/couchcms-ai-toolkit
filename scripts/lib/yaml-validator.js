#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - YAML Syntax Validator
 *
 * Validates YAML syntax and provides helpful error messages
 */

import { readFileSync } from 'fs'
import { ConfigError } from './errors.js'

/**
 * YAML syntax error with line number and suggestion
 */
export class YAMLSyntaxError extends ConfigError {
    constructor(message, line, suggestion) {
        super(message, 'YAML_SYNTAX_ERROR')
        this.line = line
        this.suggestion = suggestion
    }
}

/**
 * Validate YAML syntax before parsing
 * @param {string} content - YAML content to validate
 * @param {string} filePath - File path for error messages
 * @returns {Array<YAMLSyntaxError>} - Array of syntax errors found
 */
export function validateYAMLSyntax(content, filePath) {
    const errors = []
    const lines = content.split('\n')

    // Check for common YAML errors
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineNum = i + 1

        // Check for tabs (YAML requires spaces)
        if (line.includes('\t')) {
            errors.push(new YAMLSyntaxError(
                `Line ${lineNum}: Tabs found (YAML requires spaces)`,
                lineNum,
                `Replace tabs with spaces on line ${lineNum}`
            ))
        }

        // Check for trailing commas in lists
        if (line.match(/^\s*-\s+[^:]+,\s*$/)) {
            errors.push(new YAMLSyntaxError(
                `Line ${lineNum}: Trailing comma in list`,
                lineNum,
                `Remove the comma at the end of line ${lineNum}`
            ))
        }

        // Check for missing colon after key
        if (line.match(/^\s*[a-zA-Z_][a-zA-Z0-9_]*\s+[^:]/) && !line.trim().startsWith('-')) {
            errors.push(new YAMLSyntaxError(
                `Line ${lineNum}: Missing colon after key`,
                lineNum,
                `Add a colon after the key on line ${lineNum}: key: value`
            ))
        }

        // Check for unquoted strings with special characters
        if (line.match(/:\s*[^'"\s][^:]*['"]/)) {
            // This is okay, but check for unquoted apostrophes
            if (line.includes("'") && !line.match(/^[^:]*:\s*['"]/)) {
                const keyMatch = line.match(/^([^:]+):\s*(.+)$/)
                if (keyMatch && keyMatch[2].includes("'") && !keyMatch[2].startsWith("'") && !keyMatch[2].startsWith('"')) {
                    errors.push(new YAMLSyntaxError(
                        `Line ${lineNum}: Unquoted string with apostrophe`,
                        lineNum,
                        `Quote the value: ${keyMatch[1]}: "${keyMatch[2]}"`
                    ))
                }
            }
        }
    }

    // Check for balanced quotes
    let singleQuotes = 0
    let doubleQuotes = 0
    for (const line of lines) {
        for (const char of line) {
            if (char === "'") singleQuotes++
            if (char === '"') doubleQuotes++
        }
    }
    if (singleQuotes % 2 !== 0) {
        errors.push(new YAMLSyntaxError(
            'Unbalanced single quotes',
            null,
            'Check that all single quotes are properly closed'
        ))
    }
    if (doubleQuotes % 2 !== 0) {
        errors.push(new YAMLSyntaxError(
            'Unbalanced double quotes',
            null,
            'Check that all double quotes are properly closed'
        ))
    }

    return errors
}

/**
 * Validate YAML file and return formatted error messages
 * @param {string} filePath - Path to YAML file
 * @returns {object} - { isValid: boolean, errors: Array<string>, suggestions: Array<string> }
 */
export function validateYAMLFile(filePath) {
    try {
        const content = readFileSync(filePath, 'utf8')
        const errors = validateYAMLSyntax(content, filePath)

        if (errors.length === 0) {
            return { isValid: true, errors: [], suggestions: [] }
        }

        const errorMessages = errors.map(err => {
            if (err.line) {
                return `Line ${err.line}: ${err.message}`
            }
            return err.message
        })

        const suggestions = errors.map(err => err.suggestion).filter(Boolean)

        return {
            isValid: false,
            errors: errorMessages,
            suggestions
        }
    } catch (error) {
        return {
            isValid: false,
            errors: [`Failed to read file: ${error.message}`],
            suggestions: ['Check file permissions and path']
        }
    }
}

/**
 * Format YAML syntax errors for display
 * @param {Array<YAMLSyntaxError>} errors - Array of YAML errors
 * @returns {string} - Formatted error message
 */
export function formatYAMLErrors(errors) {
    if (errors.length === 0) {
        return ''
    }

    let output = '\n❌ YAML Syntax Errors:\n\n'

    for (const error of errors) {
        if (error.line) {
            output += `   Line ${error.line}: ${error.message}\n`
            if (error.suggestion) {
                output += `   💡 Fix: ${error.suggestion}\n`
            }
        } else {
            output += `   ${error.message}\n`
            if (error.suggestion) {
                output += `   💡 Fix: ${error.suggestion}\n`
            }
        }
        output += '\n'
    }

    output += '📖 See [Glossary](docs/GLOSSARY.md#yaml-frontmatter) for YAML syntax help\n'

    return output
}
<<<<<<< HEAD

=======
>>>>>>> 5881bba (updates 2025-12-01)
