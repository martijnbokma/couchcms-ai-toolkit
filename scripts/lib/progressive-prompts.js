#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Progressive Prompts
 *
 * Implements progressive disclosure for frontend options
 * Always allows access to more options, regardless of complexity level
 */

import { confirm, prompt } from './prompts.js'
import { printInfo } from './logger.js'

/**
 * Ask if user wants to see more options
 * @param {string} optionType - Type of options (e.g., "recommended", "advanced")
 * @param {string} description - What these options include
 * @param {boolean} defaultShow - Default value (true = show, false = hide)
 * @returns {Promise<boolean>} True if user wants to see more options
 */
export async function askShowMoreOptions(optionType, description, defaultShow = false) {
    const defaultText = defaultShow ? 'Y/n' : 'y/N'
    const answer = await confirm(
        `Show ${optionType} options? ${description}`,
        defaultShow
    )
    return answer
}

/**
 * Ask if user wants to see advanced frontend options
 * @param {string} complexity - Current complexity level
 * @returns {Promise<boolean>} True if user wants to see advanced options
 */
export async function askShowAdvancedFrontend(complexity) {
    if (complexity === 'comprehensive') {
        // Comprehensive mode shows all by default
        return true
    }

    return await askShowMoreOptions(
        'advanced frontend',
        '(Additional CSS/JS frameworks, TypeScript, etc.)',
        complexity === 'medium'
    )
}

/**
 * Ask if user wants to see development tool agents
 * @param {string} complexity - Current complexity level
 * @returns {Promise<boolean>} True if user wants to see dev tools
 */
export async function askShowDevTools(complexity) {
    if (complexity === 'comprehensive') {
        return true
    }

    return await askShowMoreOptions(
        'development tools',
        '(Bun, Git, MySQL, Admin Panel Theming)',
        false
    )
}

/**
 * Ask if user wants to see advanced configuration options
 * @param {string} complexity - Current complexity level
 * @returns {Promise<boolean>} True if user wants to see advanced config
 */
export async function askShowAdvancedConfig(complexity) {
    if (complexity === 'comprehensive') {
        return true
    }

    return await askShowMoreOptions(
        'advanced configuration',
        '(Framework config, context directory, custom paths)',
        false
    )
}

/**
 * Show progressive disclosure prompt with concrete information
 * @param {string} optionType - Type of options
 * @param {Object} options - Options object with count, description, examples
 * @returns {Promise<boolean>} True if user wants to see options
 */
export async function showProgressivePrompt(optionType, options) {
    const { count, description, examples } = options

    let message = `Show ${optionType}?`
    if (count) {
        message += ` (adds ${count} ${count === 1 ? 'option' : 'options'})`
    }
    if (description) {
        message += `\n   ${description}`
    }
    if (examples && examples.length > 0) {
        message += `\n   Examples: ${examples.join(', ')}`
    }

    printInfo(message)
    return await confirm('Continue?', false)
}
