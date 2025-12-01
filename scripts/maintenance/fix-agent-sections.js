#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Fix Agent Section Names
 *
 * Standardizes section names in agent files:
 * - "Advanced Patterns" → "Deep Dive"
 * - Ensures consistent structure
 *
 * Usage:
 *   bun scripts/fix-agent-sections.js
 *   bun scripts/fix-agent-sections.js --dry-run
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import matter from 'gray-matter'
import { getToolkitRootCached } from '../lib/index.js'

const TOOLKIT_ROOT = getToolkitRootCached()
const AGENTS_DIR = join(TOOLKIT_ROOT, 'agents')

const DRY_RUN = process.argv.includes('--dry-run')

/**
 * Fix section names in content
 */
function fixSectionNames(content) {
    // Replace "Advanced Patterns" with "Deep Dive"
    let fixed = content.replace(/^## Advanced Patterns$/gm, '## Deep Dive')

    // Also handle with description text
    fixed = fixed.replace(/^## Advanced Patterns\s*$/gm, '## Deep Dive')

    return fixed
}

/**
 * Process a single agent file
 */
function processAgent(filePath) {
    const originalContent = readFileSync(filePath, 'utf-8')

    // Only process if file contains "Advanced Patterns"
    if (!originalContent.includes('## Advanced Patterns')) {
        return false
    }

    const { data: frontmatter, content: body } = matter(originalContent)

    const fixedBody = fixSectionNames(body)

    // Preserve original frontmatter format
    const frontmatterString = originalContent.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
    const fixedContent = `---\n${frontmatterString}\n---\n\n${fixedBody}`

    if (fixedContent !== originalContent) {
        if (!DRY_RUN) {
            writeFileSync(filePath, fixedContent, 'utf-8')
            console.log(`✅ Fixed: ${filePath.split('/').pop()}`)
        } else {
            console.log(`🔍 Would fix: ${filePath.split('/').pop()}`)
        }
        return true
    }

    return false
}

/**
 * Main function
 */
async function main() {
    console.log('🔧 CouchCMS AI Toolkit - Fix Agent Section Names\n')

    if (DRY_RUN) {
        console.log('🔍 DRY RUN MODE - No files will be modified\n')
    }

    if (!existsSync(AGENTS_DIR)) {
        console.error(`❌ Agents directory not found: ${AGENTS_DIR}\n`)
        process.exit(1)
    }

    // Get all agent files
    const files = readdirSync(AGENTS_DIR)
        .filter((f) => f.endsWith('.md') && f !== 'README.md')
        .map((f) => join(AGENTS_DIR, f))
        .sort()

    console.log(`📚 Processing ${files.length} agent(s)...\n`)

    let fixedCount = 0
    for (const file of files) {
        if (processAgent(file)) {
            fixedCount++
        }
    }

    console.log('\n' + '='.repeat(60))
    if (DRY_RUN) {
        console.log(`\n🔍 Would fix ${fixedCount} of ${files.length} agent(s)\n`)
    } else {
        console.log(`\n✅ Fixed ${fixedCount} of ${files.length} agent(s)\n`)
    }

    if (fixedCount > 0 && !DRY_RUN) {
        console.log('💡 Run `/refactor-agents` to verify changes\n')
    }
}

// Run
main().catch((error) => {
    console.error('❌ Error:', error.message)
    if (process.env.DEBUG) {
        console.error(error.stack)
    }
    process.exit(1)
})
