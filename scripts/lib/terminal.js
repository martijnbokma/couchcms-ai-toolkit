#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Terminal Utilities
 *
 * Terminal formatting, colors, and interactive utilities
 * Uses ansis for fast, feature-rich terminal colors with chainable syntax
 */

import ansis, { red, green, yellow, blue, magenta, cyan, white, gray, bold, dim } from 'ansis'

/**
 * Color functions using ansis (chainable syntax)
 */
export const colors = {
    reset: (text) => text,
    bright: bold,
    dim: dim,
    red: red,
    green: green,
    yellow: yellow,
    blue: blue,
    magenta: magenta,
    cyan: cyan,
    white: white,
    gray: gray,
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
 * Get terminal width (default 80)
 */
function getTerminalWidth() {
    return process.stdout.columns || 80
}

/**
 * Print colored message
 * @param {string} message - Message to print
 * @param {string|Function} [color='reset'] - Color function or name
 * @param {number} [indent=0] - Number of spaces to indent
 */
export function print(message, color = 'reset', indent = 0) {
    const spaces = ' '.repeat(indent)
    const colorFn = typeof color === 'function' ? color : colors[color] || colors.reset
    console.log(`${spaces}${colorFn(message)}`)
}

/**
 * Print with icon and color
 * @param {string} icon - Icon/emoji to display
 * @param {string} message - Message to print
 * @param {string|Function} [color='reset'] - Color function or name
 * @param {number} [indent=0] - Number of spaces to indent
 */
export function printWithIcon(icon, message, color = 'reset', indent = 0) {
    const spaces = ' '.repeat(indent)
    const colorFn = typeof color === 'function' ? color : colors[color] || colors.reset
    console.log(`${spaces}${icon} ${colorFn(message)}`)
}

/**
 * Print success message
 * @param {string} message - Success message
 * @param {number} [indent=0] - Indentation
 */
export function printSuccess(message, indent = 0) {
    printWithIcon('✅', message, green, indent)
}

/**
 * Print error message
 * @param {string} message - Error message
 * @param {number} [indent=0] - Indentation
 */
export function printError(message, indent = 0) {
    printWithIcon('❌', message, red, indent)
}

/**
 * Print warning message
 * @param {string} message - Warning message
 * @param {number} [indent=0] - Indentation
 */
export function printWarning(message, indent = 0) {
    printWithIcon('⚠️ ', message, yellow, indent)
}

/**
 * Print info message
 * @param {string} message - Info message
 * @param {number} [indent=0] - Indentation
 */
export function printInfo(message, indent = 0) {
    printWithIcon('ℹ️ ', message, blue, indent)
}

/**
 * Print progress message
 * @param {string} message - Progress message
 * @param {number} [indent=0] - Indentation
 */
export function printProgress(message, indent = 0) {
    printWithIcon('🔄', message, cyan, indent)
}

/**
 * Print a section header with visual separator
 * @param {string} title - Section title
 * @param {string} [icon=''] - Optional icon/emoji
 * @param {number} [indent=0] - Indentation
 */
export function printSection(title, icon = '', indent = 0) {
    const spaces = ' '.repeat(indent)
    const width = getTerminalWidth() - indent - 2
    const separator = '─'.repeat(Math.max(0, width - title.length - (icon ? 3 : 0)))
    const iconText = icon ? `${icon} ` : ''
    console.log()
    console.log(`${spaces}${cyan.bold(`${iconText}${title}`)} ${dim(separator)}`)
}

/**
 * Print a boxed message
 * @param {string} message - Message to box
 * @param {Object} [options] - Box options
 * @param {string} [options.title] - Optional title
 * @param {string} [options.color='cyan'] - Border color
 * @param {string} [options.icon] - Optional icon
 * @param {number} [indent=0] - Indentation
 */
export function printBox(message, options = {}, indent = 0) {
    const spaces = ' '.repeat(indent)
    const { title, color = 'cyan', icon = '' } = options
    // Support both function (ansis) and string (color name)
    const colorFn = typeof color === 'function' ? color : colors[color] || cyan

    const lines = message.split('\n')
    const maxContentWidth = Math.max(...lines.map(l => l.length), 0)
    const titleWidth = title ? (title.length + (icon ? 3 : 0)) : 0
    // Use the maximum of content and title to ensure both fit nicely
    // But if title is much shorter, add some padding for visual balance
    const maxWidth = Math.max(maxContentWidth, titleWidth)
    // Calculate width: content + 2 spaces + 2 border chars = content + 4
    const contentWidth = Math.max(10, Math.min(maxWidth, getTerminalWidth() - indent - 6))
    const boxWidth = contentWidth + 4 // 2 spaces + 2 border chars

    const topBorder = '┌' + '─'.repeat(Math.max(0, boxWidth - 2)) + '┐'
    const bottomBorder = '└' + '─'.repeat(Math.max(0, boxWidth - 2)) + '┘'

    console.log()
    console.log(`${spaces}${colorFn(topBorder)}`)

    if (title) {
        const iconText = icon ? `${icon} ` : ''
        const titleContent = `${iconText}${title}`
        // Pad title to exact contentWidth to match content lines exactly
        // This ensures the vertical border aligns perfectly with content lines
        // Limit padding after title text to maximum of 10 spaces for better visual balance
        // But still pad to full contentWidth for perfect border alignment
        const maxTitlePadding = 10
        const titlePadding = Math.min(maxTitlePadding, Math.max(0, contentWidth - titleContent.length))
        const paddedTitle = `${titleContent}${' '.repeat(titlePadding)}`
        // Always pad to full contentWidth for perfect border alignment with content lines
        const finalPaddedTitle = paddedTitle.length < contentWidth
            ? paddedTitle + ' '.repeat(contentWidth - paddedTitle.length)
            : paddedTitle
        // Title line structure: │ + space + finalPaddedTitle + space + │ = boxWidth
        // This matches the content line structure exactly for perfect alignment
        const titleLine = `│ ${finalPaddedTitle} │`
        console.log(`${spaces}${colorFn(titleLine)}`)
        // Separator line uses same width as borders
        console.log(`${spaces}${colorFn('├' + '─'.repeat(Math.max(0, boxWidth - 2)) + '┤')}`)
    }

    lines.forEach(line => {
        // Truncate line if it's too long, then pad to exact contentWidth
        const truncatedLine = line.length > contentWidth ? line.substring(0, contentWidth) : line
        const padding = Math.max(0, contentWidth - truncatedLine.length)
        const contentLine = `${truncatedLine}${' '.repeat(padding)}`
        // Ensure exact width: │ + space + content + space + │ = boxWidth
        console.log(`${spaces}${colorFn('│')} ${contentLine} ${colorFn('│')}`)
    })

    console.log(`${spaces}${colorFn(bottomBorder)}`)
    console.log()
}

/**
 * Print a header banner
 * @param {string} title - Banner title
 * @param {string} [subtitle] - Optional subtitle
 * @param {string} [icon='✨'] - Icon/emoji
 */
export function printBanner(title, subtitle = '', icon = '✨') {
    const width = getTerminalWidth()
    const padding = Math.max(2, Math.floor((width - title.length - (icon ? 3 : 0)) / 2))

    console.log()
    console.log(cyan.bold('═'.repeat(width)))
    console.log(cyan.bold(' '.repeat(padding) + `${icon} ${title}` + ' '.repeat(padding)))
    if (subtitle) {
        const subPadding = Math.max(2, Math.floor((width - subtitle.length) / 2))
        console.log(dim(' '.repeat(subPadding) + subtitle))
    }
    console.log(cyan.bold('═'.repeat(width)))
    console.log()
}

/**
 * Print a step indicator
 * @param {number} step - Step number
 * @param {number} total - Total steps
 * @param {string} message - Step message
 * @param {number} [indent=0] - Indentation
 */
export function printStep(step, total, message, indent = 0) {
    const spaces = ' '.repeat(indent)
    const stepText = `[${step}/${total}]`
    const formatted = `${spaces}${dim(stepText)} ${cyan.bold(message)}`
    console.log(formatted)
}

/**
 * Print a list of items with consistent formatting
 * @param {string[]} items - List of items
 * @param {Object} [options] - List options
 * @param {string} [options.bullet='•'] - Bullet character
 * @param {string} [options.color='reset'] - Color for items
 * @param {number} [indent=0] - Indentation
 */
export function printList(items, options = {}, indent = 0) {
    const spaces = ' '.repeat(indent)
    const { bullet = '•', color = 'reset' } = options
    const colorFn = typeof color === 'function' ? color : colors[color] || colors.reset

    items.forEach(item => {
        console.log(`${spaces}${bullet} ${colorFn(item)}`)
    })
}

/**
 * Print formatted configuration summary
 * @param {Object} config - Configuration object
 * @param {string} config.title - Title/header
 * @param {string} [config.project] - Project name
 * @param {string} [config.type] - Project type
 * @param {string[]} [config.modules] - List of modules
 * @param {string[]} [config.agents] - List of agents
 * @param {number} [indent=0] - Indentation
 */
export function printConfigSummary(config, indent = 0) {
    const spaces = ' '.repeat(indent)
    const { title, project, type, modules = [], agents = [] } = config

    // Calculate max width for alignment
    const maxLabelWidth = Math.max(
        project ? 'Project:'.length : 0,
        type ? 'Type:'.length : 0,
        modules.length > 0 ? 'Modules:'.length : 0,
        agents.length > 0 ? 'Agents:'.length : 0
    )

    // Format title with sparkle
    console.log(`${spaces}${cyan('✨')} ${cyan.bold(title)}`)
    console.log()

    // Format each field with proper alignment
    if (project) {
        const label = 'Project:'.padEnd(maxLabelWidth)
        console.log(`${spaces}   ${dim(label)} ${bold(project)}`)
    }

    if (type) {
        const label = 'Type:'.padEnd(maxLabelWidth)
        console.log(`${spaces}   ${dim(label)} ${cyan(type)}`)
    }

    // Format modules with smart wrapping
    if (modules.length > 0) {
        const label = 'Modules:'.padEnd(maxLabelWidth)
        const modulesText = modules.join(', ')
        const maxLineLength = 80
        const labelWidth = maxLabelWidth + 3
        const availableWidth = maxLineLength - labelWidth

        if (modulesText.length <= availableWidth) {
            console.log(`${spaces}   ${dim(label)} ${modulesText}`)
        } else {
            console.log(`${spaces}   ${dim(label)}`)
            let currentLine = ''
            modules.forEach((module, index) => {
                const separator = index > 0 ? ', ' : ''
                const testLine = currentLine + separator + module

                if (testLine.length <= availableWidth && currentLine !== '') {
                    currentLine = testLine
                } else {
                    if (currentLine) {
                        console.log(`${spaces}   ${' '.repeat(maxLabelWidth)}  ${currentLine}`)
                    }
                    currentLine = module
                }
            })
            if (currentLine) {
                console.log(`${spaces}   ${' '.repeat(maxLabelWidth)}  ${currentLine}`)
            }
        }
    }

    // Format agents with smart wrapping
    if (agents.length > 0) {
        const label = 'Agents:'.padEnd(maxLabelWidth)
        const agentsText = agents.join(', ')
        const maxLineLength = 80
        const labelWidth = maxLabelWidth + 3
        const availableWidth = maxLineLength - labelWidth

        if (agentsText.length <= availableWidth) {
            console.log(`${spaces}   ${dim(label)} ${agentsText}`)
        } else {
            console.log(`${spaces}   ${dim(label)}`)
            let currentLine = ''
            agents.forEach((agent, index) => {
                const separator = index > 0 ? ', ' : ''
                const testLine = currentLine + separator + agent

                if (testLine.length <= availableWidth && currentLine !== '') {
                    currentLine = testLine
                } else {
                    if (currentLine) {
                        console.log(`${spaces}   ${' '.repeat(maxLabelWidth)}  ${currentLine}`)
                    }
                    currentLine = agent
                }
            })
            if (currentLine) {
                console.log(`${spaces}   ${' '.repeat(maxLabelWidth)}  ${currentLine}`)
            }
        }
    }

    console.log()
}

/**
 * Print a summary box with key-value pairs
 * @param {string} title - Summary title
 * @param {Object} items - Key-value pairs to display
 * @param {number} [indent=0] - Indentation
 */
export function printSummary(title, items, indent = 0) {
    const spaces = ' '.repeat(indent)
    const maxKeyWidth = Math.max(...Object.keys(items).map(k => k.length))

    console.log()
    console.log(`${spaces}${cyan.bold(title)}`)
    Object.entries(items).forEach(([key, value]) => {
        const keyText = `${key}:`.padEnd(maxKeyWidth + 1)
        console.log(`${spaces}  ${dim(keyText)} ${value}`)
    })
    console.log()
}
