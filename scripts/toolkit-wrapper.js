#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Wrapper Script
 *
 * This script can be run from project root to execute toolkit commands
 * It automatically detects the toolkit location (ai-toolkit-shared submodule)
 *
 * Usage from project root:
 *   bun ai-toolkit-shared/scripts/toolkit-wrapper.js install
 *   bun ai-toolkit-shared/scripts/toolkit-wrapper.js setup
 *   etc.
 */

import { existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

// Get directory of this script
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to find toolkit.js relative to this wrapper
// This wrapper should be in ai-toolkit-shared/scripts/
const toolkitScript = join(__dirname, 'toolkit.js')

if (!existsSync(toolkitScript)) {
    console.error('❌ Error: Could not find toolkit.js')
    console.error(`   Expected at: ${toolkitScript}`)
    console.error('\n💡 Make sure you are running this from the project root:')
    console.error('   bun ai-toolkit-shared/scripts/toolkit-wrapper.js install')
    process.exit(1)
}

// Get all arguments (subcommand and options)
const args = process.argv.slice(2)

// Execute the actual toolkit script
const result = spawnSync('bun', [toolkitScript, ...args], {
    stdio: 'inherit',
    cwd: process.cwd() // Use project root as cwd
})

process.exit(result.status || 0)
