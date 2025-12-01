#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Terminal Utilities
 *
 * Terminal formatting, colors, and interactive utilities
 */

/**
 * ANSI color codes
 */
export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
}

/**
 * Terminal control codes
 */
export const terminal = {
    clearScreen: '\x1b[2J\x1b[H',
    hideCursor: '\x1b[?25l',
    showCursor: '\x1b[?25h',
    clearLine: '\x1b[2K',
    moveUp: (n = 1) => `\x1b[${n}A`,
    moveDown: (n = 1) => `\x1b[${n}B`,
    moveRight: (n = 1) => `\x1b[${n}C`,
    moveLeft: (n = 1) => `\x1b[${n}D`,
}

/**
 * Print colored message
 * @param {string} message - Message to print
 * @param {string} [color='reset'] - Color name from colors object
 * @param {number} [indent=0] - Number of spaces to indent
 */
export function print(message, color = 'reset', indent = 0) {
    const spaces = ' '.repeat(indent)
    const colorCode = colors[color] || colors.reset
    console.log(`${spaces}${colorCode}${message}${colors.reset}`)
}

/**
 * Print with icon and color
 * @param {string} icon - Icon/emoji to display
 * @param {string} message - Message to print
 * @param {string} [color='reset'] - Color name
 * @param {number} [indent=0] - Number of spaces to indent
 */
export function printWithIcon(icon, message, color = 'reset', indent = 0) {
    const spaces = ' '.repeat(indent)
    const colorCode = colors[color] || colors.reset
    console.log(`${spaces}${icon} ${colorCode}${message}${colors.reset}`)
}

/**
 * Print success message
 * @param {string} message - Success message
 * @param {number} [indent=0] - Indentation
 */
export function printSuccess(message, indent = 0) {
    printWithIcon('✅', message, 'green', indent)
}

/**
 * Print error message
 * @param {string} message - Error message
 * @param {number} [indent=0] - Indentation
 */
export function printError(message, indent = 0) {
    printWithIcon('❌', message, 'red', indent)
}

/**
 * Print warning message
 * @param {string} message - Warning message
 * @param {number} [indent=0] - Indentation
 */
export function printWarning(message, indent = 0) {
    printWithIcon('⚠️', message, 'yellow', indent)
}

/**
 * Print info message
 * @param {string} message - Info message
 * @param {number} [indent=0] - Indentation
 */
export function printInfo(message, indent = 0) {
    printWithIcon('ℹ️', message, 'blue', indent)
}

/**
 * Print progress message
 * @param {string} message - Progress message
 * @param {number} [indent=0] - Indentation
 */
export function printProgress(message, indent = 0) {
    printWithIcon('🔄', message, 'blue', indent)
}
