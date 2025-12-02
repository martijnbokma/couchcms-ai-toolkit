#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Error Handling
 *
 * Centralized error handling utilities
 */

import { getSolutionForError, formatSolution } from './error-solutions.js'

/**
 * Toolkit-specific error class for better error handling
 * @extends Error
 */
export class ToolkitError extends Error {
    /**
     * @param {string} message - Error message
     * @param {string} code - Error code for categorization
     * @param {Error} [cause] - Original error that caused this error
     */
    constructor(message, code, cause) {
        super(message)
        this.name = 'ToolkitError'
        this.code = code
        this.cause = cause
    }
}

/**
 * Configuration error
 */
export class ConfigError extends ToolkitError {
    constructor(message, cause) {
        super(message, 'CONFIG_ERROR', cause)
        this.name = 'ConfigError'
    }
}

/**
 * Module loading error
 */
export class ModuleError extends ToolkitError {
    constructor(message, cause) {
        super(message, 'MODULE_ERROR', cause)
        this.name = 'ModuleError'
    }
}

/**
 * Template rendering error
 */
export class TemplateError extends ToolkitError {
    constructor(message, cause) {
        super(message, 'TEMPLATE_ERROR', cause)
        this.name = 'TemplateError'
    }
}

/**
 * File system error
 */
export class FileSystemError extends ToolkitError {
    constructor(message, cause) {
        super(message, 'FILESYSTEM_ERROR', cause)
        this.name = 'FileSystemError'
    }
}

/**
 * Handle and display errors consistently with actionable solutions
 * @param {Error} error - Error to handle
 * @param {string} [context] - Context where error occurred
 */
export function handleError(error, context) {
    const prefix = context ? `${context}: ` : ''

    // Get solution for error
    let solution = null
    try {
        solution = getSolutionForError(error, context)
    } catch {
        // If error-solutions not available, continue without solution
    }

    // Display error message
    if (error instanceof ToolkitError) {
        console.error(`❌ ${prefix}${error.message}`)
        if (error.cause) {
            console.error(`   Cause: ${error.cause.message}`)
        }
    } else {
        console.error(`❌ ${prefix}${error.message}`)
    }

    // Display solution if available
    if (solution) {
        try {
            const formatted = formatSolution(solution)
            console.log(formatted)

            // Show quick fix command prominently if available
            if (solution.quickFix) {
                console.log(`\n⚡ Quick Fix Command:`)
                console.log(`   ${solution.quickFix}\n`)
            }
        } catch {
            // Fallback if formatSolution fails
            if (solution.solution) {
                console.log(`\n💡 Solution: ${solution.solution}`)
            }
            if (solution.quickFix) {
                console.log(`\n⚡ Quick Fix: ${solution.quickFix}`)
            }
        }
    }

    // Display stack trace in debug mode
    if (error.stack && process.env.DEBUG) {
        console.error('\nStack trace:')
        console.error(error.stack)
    }
}

/**
 * Format validation errors into readable message
 * @param {Array<string>} errors - Array of validation error messages
 * @returns {string} - Formatted error message
 */
export function formatValidationErrors(errors) {
    if (errors.length === 0) {
        return ''
    }

    return `Configuration validation failed:\n${errors.map(e => `  • ${e}`).join('\n')}`
}
