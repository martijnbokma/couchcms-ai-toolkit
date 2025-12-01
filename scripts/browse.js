#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Interactive Module Browser
 *
 * Browse and select modules/agents interactively
 *
 * Usage:
 *   bun scripts/browse.js [--modules|--agents]
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import matter from 'gray-matter'
import { findConfigFile, resolveToolkitPath } from './utils/utils.js'
import { loadConfig } from './lib/config-loader.js'
import { getToolkitRootCached } from './lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()

// ANSI codes for terminal control
const CLEAR_SCREEN = '\x1b[2J\x1b[H'
const HIDE_CURSOR = '\x1b[?25l'
const SHOW_CURSOR = '\x1b[?25h'
const CLEAR_LINE = '\x1b[2K'

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m',
}

/**
 * Load available modules
 */
function loadAvailableModules(toolkitPath) {
    const modulesDir = join(toolkitPath, 'modules')
    const files = readdirSync(modulesDir).filter(f => f.endsWith('.md'))

    return files.map(file => {
        const content = readFileSync(join(modulesDir, file), 'utf8')
        const { data } = matter(content)
        const name = file.replace('.md', '')

        return {
            name,
            title: data.title || name,
            description: data.description || 'No description',
            category: data.category || 'other',
            dependencies: data.dependencies || []
        }
    }).sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Load available agents
 */
function loadAvailableAgents(toolkitPath) {
    const agentsDir = join(toolkitPath, 'agents')
    const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'))

    return files.map(file => {
        const content = readFileSync(join(agentsDir, file), 'utf8')
        const { data } = matter(content)
        const name = file.replace('.md', '')

        return {
            name,
            title: data.title || name,
            description: data.description || 'No description',
            category: data.category || 'other'
        }
    }).sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * Group items by category
 */
function groupByCategory(items) {
    const groups = {}

    for (const item of items) {
        const category = item.category || 'other'
        if (!groups[category]) {
            groups[category] = []
        }
        groups[category].push(item)
    }

    return groups
}

/**
 * Render the browser UI
 */
function render(items, selected, cursor, scroll, type) {
    const height = process.stdout.rows - 10
    const groups = groupByCategory(items)
    const categories = Object.keys(groups).sort()

    let output = CLEAR_SCREEN
    output += `${colors.bright}${colors.blue}📦 CouchCMS AI Toolkit - ${type === 'modules' ? 'Modules' : 'Agents'} Browser${colors.reset}\n\n`
    output += `${colors.dim}Use ↑↓ to navigate, Space to toggle, Enter to save, Q to quit${colors.reset}\n\n`

    let lineIndex = 0

    for (const category of categories) {
        const categoryItems = groups[category]

        // Category header
        if (lineIndex >= scroll && lineIndex < scroll + height) {
            output += `${colors.cyan}${category.toUpperCase()}${colors.reset}\n`
        }
        lineIndex++

        // Items in category
        for (const item of categoryItems) {
            if (lineIndex >= scroll && lineIndex < scroll + height) {
                const isSelected = selected.includes(item.name)
                const isCursor = lineIndex === cursor

                const checkbox = isSelected ? '[✓]' : '[ ]'
                const prefix = isCursor ? '→ ' : '  '
                const color = isCursor ? colors.bright : colors.reset
                const checkColor = isSelected ? colors.green : colors.gray

                output += `${prefix}${checkColor}${checkbox}${colors.reset} ${color}${item.title}${colors.reset}\n`

                if (isCursor) {
                    output += `    ${colors.dim}${item.description}${colors.reset}\n`

                    if (item.dependencies && item.dependencies.length > 0) {
                        output += `    ${colors.yellow}Requires: ${item.dependencies.join(', ')}${colors.reset}\n`
                    }
                }
            }
            lineIndex++
        }

        lineIndex++ // Empty line after category
    }

    // Footer
    output += `\n${colors.dim}Selected: ${selected.length}/${items.length}${colors.reset}\n`

    process.stdout.write(output)
}

/**
 * Interactive browser
 */
async function browse(type, toolkitPath, currentSelection) {
    const items = type === 'modules'
        ? loadAvailableModules(toolkitPath)
        : loadAvailableAgents(toolkitPath)

    let selected = [...currentSelection]
    let cursor = 0
    let scroll = 0
    const height = process.stdout.rows - 10

    // Setup terminal
    process.stdout.write(HIDE_CURSOR)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    // Initial render
    render(items, selected, cursor, scroll, type)

    return new Promise((resolve) => {
        process.stdin.on('data', (key) => {
            // Handle input
            if (key === '\u0003' || key === 'q' || key === 'Q') {
                // Ctrl+C or Q - quit without saving
                process.stdout.write(SHOW_CURSOR)
                process.stdin.setRawMode(false)
                process.stdin.pause()
                resolve(null)
                return
            }

            if (key === '\r') {
                // Enter - save and exit
                process.stdout.write(SHOW_CURSOR)
                process.stdin.setRawMode(false)
                process.stdin.pause()
                resolve(selected)
                return
            }

            if (key === '\u001b[A') {
                // Up arrow
                cursor = Math.max(0, cursor - 1)
                if (cursor < scroll) scroll = cursor
            } else if (key === '\u001b[B') {
                // Down arrow
                cursor = Math.min(items.length - 1, cursor + 1)
                if (cursor >= scroll + height) scroll = cursor - height + 1
            } else if (key === ' ') {
                // Space - toggle selection
                const item = items[cursor]
                const index = selected.indexOf(item.name)

                if (index >= 0) {
                    selected.splice(index, 1)
                } else {
                    selected.push(item.name)

                    // Auto-select dependencies
                    if (item.dependencies) {
                        for (const dep of item.dependencies) {
                            if (!selected.includes(dep)) {
                                selected.push(dep)
                            }
                        }
                    }
                }
            }

            // Re-render
            render(items, selected, cursor, scroll, type)
        })
    })
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2)
    const type = args.includes('--agents') ? 'agents' : 'modules'

    // Find project config
    const configPath = findConfigFile(process.cwd())

    if (!configPath) {
        console.error('❌ No configuration file found')
        console.log('Run: bun scripts/init.js')
        process.exit(1)
    }

    const projectDir = dirname(configPath)

    // Load current config
    const config = loadConfig(projectDir, TOOLKIT_ROOT)
    const currentSelection = type === 'modules'
        ? (config.modules || [])
        : (config.agents || [])

    console.log(`\n🔍 Loading ${type}...\n`)

    // Run browser
    const selected = await browse(type, TOOLKIT_ROOT, currentSelection)

    if (selected === null) {
        console.log('\n❌ Cancelled\n')
        process.exit(0)
    }

    // Update config file
    console.log(`\n✅ Selected ${selected.length} ${type}`)
    console.log(`\n💡 To apply changes, update your config file and run:`)
    console.log(`   bun scripts/sync.js\n`)

    // Display selected items
    console.log(`${type}:`)
    for (const name of selected.sort()) {
        console.log(`  - ${name}`)
    }
    console.log()
}

// Run
main().catch(error => {
    process.stdout.write(SHOW_CURSOR)
    console.error('\n❌ Error:', error.message)
    process.exit(1)
})
