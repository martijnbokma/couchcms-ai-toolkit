#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Add Script to package.json
 *
 * Standalone script to add toolkit script to package.json
 * Safe: Only adds if it doesn't exist, preserves all existing scripts
 *
 * Usage:
 *   bun ai-toolkit-shared/scripts/add-toolkit-script.js
 *   bun ai-toolkit-shared/scripts/add-toolkit-script.js --path=./custom-path
 */

import { addToolkitScript, hasToolkitScript, getToolkitScript } from './lib/package-json-utils.js'
import { printSuccess, printInfo, printWarning, printError } from './lib/terminal.js'
import { detectToolkitPath } from './lib/toolkit-detector.js'

const projectDir = process.cwd()

// Parse command line arguments
const args = process.argv.slice(2)
let toolkitPath = './ai-toolkit-shared'

for (const arg of args) {
    if (arg.startsWith('--path=')) {
        toolkitPath = arg.split('=')[1]
    } else if (arg === '--help' || arg === '-h') {
        console.log(`
Add Toolkit Script to package.json

Usage:
  bun ai-toolkit-shared/scripts/add-toolkit-script.js [options]

Options:
  --path=<path>    Toolkit path (default: ./ai-toolkit-shared)
  --help, -h       Show this help message

What it does:
  - Adds "toolkit" script to your package.json
  - Only adds if it doesn't already exist
  - Preserves all existing scripts and settings
  - Safe to run multiple times

Example:
  bun ai-toolkit-shared/scripts/add-toolkit-script.js
  bun ai-toolkit-shared/scripts/add-toolkit-script.js --path=../my-toolkit

After running, you can use:
  bun run toolkit install
  bun run toolkit sync
  bun run toolkit health
`)
        process.exit(0)
    }
}

// Main execution
async function main() {
    console.log('\n' + '='.repeat(70))
    console.log('  Add Toolkit Script to package.json')
    console.log('='.repeat(70) + '\n')

    // Check if script already exists
    if (hasToolkitScript(projectDir)) {
        const existingScript = getToolkitScript(projectDir)
        printInfo('Toolkit script already exists in package.json')
        console.log(`   Current script: ${existingScript}`)
        console.log('\n✅ You can already use: bun run toolkit [command]')
        return
    }

    // Try to auto-detect toolkit path if not specified
    if (toolkitPath === './ai-toolkit-shared') {
        const detected = detectToolkitPath(projectDir)
        if (detected) {
            toolkitPath = detected
            printInfo(`Auto-detected toolkit path: ${toolkitPath}`)
        }
    }

    // Add the script
    printInfo(`Adding toolkit script with path: ${toolkitPath}`)
    const result = await addToolkitScript(projectDir, toolkitPath)

    if (result.added) {
        printSuccess(result.message)
        console.log(`   Script: ${result.script}`)
        console.log('\n✅ Success! Now you can use:')
        console.log('   • bun run toolkit install')
        console.log('   • bun run toolkit setup')
        console.log('   • bun run toolkit sync')
        console.log('   • bun run toolkit health')
        console.log('   • bun run toolkit [any-command]\n')
    } else {
        printWarning(result.message)
        if (result.error) {
            printError(`Error: ${result.error.message}`)
        }
    }
}

main().catch(error => {
    printError(`Fatal error: ${error.message}`)
    if (process.env.DEBUG) {
        console.error(error)
    }
    process.exit(1)
})
