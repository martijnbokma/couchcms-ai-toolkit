#!/usr/bin/env bun
/**
 * Analyze module organization and suggest improvements
 *
 * Usage:
 *   bun scripts/analyze-modules.js [--no-prompt]
 *
 * Options:
 *   --no-prompt    Skip interactive prompts and just show analysis
 */

import matter from 'gray-matter'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createInterface } from 'readline'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MODULES_DIR = join(__dirname, '..', 'modules')

/**
 * Module categories
 */
const CATEGORIES = {
    core: {
        name: 'Core',
        description: 'Foundation modules (always required)',
        modules: ['couchcms-core'],
    },
    frontend: {
        name: 'Frontend',
        description: 'Frontend frameworks & tools',
        modules: ['tailwindcss', 'daisyui', 'alpinejs', 'typescript'],
    },
    content: {
        name: 'Content Management',
        description: 'Content organization and structure',
        modules: ['folders', 'archives', 'relationships', 'repeatable-regions'],
    },
    navigation: {
        name: 'Navigation & Discovery',
        description: 'Navigation, search, and routing',
        modules: ['search', 'pagination', 'custom-routes'],
    },
    'user-features': {
        name: 'User Features',
        description: 'User-related functionality',
        modules: ['users', 'comments'],
    },
    forms: {
        name: 'Forms',
        description: 'Form handling and CRUD',
        modules: ['databound-forms'],
    },
}

/**
 * Analyze a module file
 */
function analyzeModule(fileName) {
    const filePath = join(MODULES_DIR, fileName)
    if (!existsSync(filePath)) return null

    const content = readFileSync(filePath, 'utf8')
    const { data: meta, content: body } = matter(content)

    // Find category
    let category = 'uncategorized'
    for (const [catKey, catData] of Object.entries(CATEGORIES)) {
        const moduleId = meta.id || fileName.replace('.md', '')
        if (catData.modules.includes(moduleId)) {
            category = catKey
            break
        }
    }

    return {
        file: fileName,
        id: meta.id || fileName.replace('.md', ''),
        name: meta.name || fileName.replace('.md', ''),
        description: meta.description || '',
        category,
        hasDescription: Boolean(meta.description && meta.description.trim()),
        hasCategory: meta.category !== undefined,
        version: meta.version || 'unknown',
        requires: meta.requires || [],
        conflicts: meta.conflicts || [],
        contentLength: body.length,
        isEmpty: body.trim().length < 100,
    }
}

/**
 * Main analysis
 */
function analyze() {
    console.log('📊 Module Organization Analysis\n')
    console.log('='.repeat(60) + '\n')

    const files = readdirSync(MODULES_DIR)
        .filter(f => f.endsWith('.md') && f !== 'README.md')

    const modules = files.map(analyzeModule).filter(Boolean)

    // Group by category
    const byCategory = {}
    const uncategorized = []

    for (const module of modules) {
        if (module.category === 'uncategorized') {
            uncategorized.push(module)
        } else {
            if (!byCategory[module.category]) {
                byCategory[module.category] = []
            }
            byCategory[module.category].push(module)
        }
    }

    // Valid names that should not be flagged (official framework/brand names, Title Case)
    const validNames = [
        'daisyUI',           // Official name (lowercase 'd', uppercase 'UI')
        'TypeScript',        // Official name (camelCase)
        'TailwindCSS',       // Official name (camelCase)
        'CouchCMS Core',     // Brand name preservation
        'DataBound Forms',   // Technical term (camelCase)
        'Custom Routes',      // Title Case is correct
        'Repeatable Regions', // Title Case is correct
        'Alpine.js',         // Official name with dot
    ]

    // Issues
    const issues = {
        emptyDescriptions: modules.filter(m => !m.hasDescription),
        uncategorized: uncategorized,
        inconsistentNaming: modules.filter(m => {
            const name = m.name
            // Skip if it's a valid name
            if (validNames.includes(name)) {
                return false
            }
            // Check if it's simple Title Case (first letter uppercase, rest lowercase)
            const expected = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            return name !== expected
        }),
        emptyContent: modules.filter(m => m.isEmpty),
    }

    // Print results
    console.log('📋 Module Overview\n')
    console.log(`Total modules: ${modules.length}`)
    console.log(`Categories: ${Object.keys(byCategory).length}`)
    console.log(`Uncategorized: ${uncategorized.length}\n`)

    // Print by category
    console.log('📁 Modules by Category\n')
    for (const [catKey, catData] of Object.entries(CATEGORIES)) {
        const catModules = byCategory[catKey] || []
        if (catModules.length > 0) {
            console.log(`\n${catData.name} (${catData.description})`)
            console.log('-'.repeat(40))
            for (const module of catModules) {
                const status = module.hasDescription ? '✅' : '⚠️'
                // Check if name is valid (in whitelist or simple Title Case)
                const expected = module.name.charAt(0).toUpperCase() + module.name.slice(1).toLowerCase()
                const isValidName = validNames.includes(module.name) || module.name === expected
                const nameStatus = isValidName ? '✅' : '⚠️'
                console.log(`  ${status} ${nameStatus} ${module.name}`)
                if (!module.hasDescription) {
                    console.log(`     ⚠️  Missing description`)
                }
                if (!isValidName) {
                    console.log(`     ⚠️  Inconsistent naming: "${module.name}"`)
                }
            }
        }
    }

    // Print uncategorized
    if (uncategorized.length > 0) {
        console.log(`\n❌ Uncategorized Modules\n`)
        console.log('-'.repeat(40))
        for (const module of uncategorized) {
            console.log(`  ⚠️  ${module.name} (${module.id})`)
        }
    }

    // Print issues
    console.log('\n\n🔍 Issues Found\n')
    console.log('='.repeat(60) + '\n')

    if (issues.emptyDescriptions.length > 0) {
        console.log(`⚠️  Empty Descriptions (${issues.emptyDescriptions.length}):`)
        for (const module of issues.emptyDescriptions) {
            console.log(`   - ${module.name} (${module.id})`)
        }
        console.log()
    }

    if (issues.uncategorized.length > 0) {
        console.log(`⚠️  Uncategorized Modules (${issues.uncategorized.length}):`)
        for (const module of issues.uncategorized) {
            console.log(`   - ${module.name} (${module.id})`)
        }
        console.log()
    }

    if (issues.inconsistentNaming.length > 0) {
        console.log(`⚠️  Inconsistent Naming (${issues.inconsistentNaming.length}):`)
        for (const module of issues.inconsistentNaming) {
            console.log(`   - "${module.name}" should be "${module.name.charAt(0).toUpperCase() + module.name.slice(1).toLowerCase()}"`)
        }
        console.log()
    }

    if (issues.emptyContent.length > 0) {
        console.log(`⚠️  Empty/Incomplete Content (${issues.emptyContent.length}):`)
        for (const module of issues.emptyContent) {
            console.log(`   - ${module.name} (${module.contentLength} chars)`)
        }
        console.log()
    }

    // Recommendations
    console.log('\n💡 Recommendations\n')
    console.log('='.repeat(60) + '\n')

    if (issues.emptyDescriptions.length > 0) {
        console.log('1. Add descriptions to all modules')
        console.log('   Update frontmatter with meaningful descriptions\n')
    }

    if (issues.uncategorized.length > 0) {
        console.log('2. Categorize uncategorized modules')
        console.log('   Add category field to frontmatter\n')
    }

    if (issues.inconsistentNaming.length > 0) {
        console.log('3. Standardize module names')
        console.log('   Use Title Case for display names\n')
    }

    console.log('4. Update MODULES.md with category sections')
    console.log('5. Consider adding category metadata to sync script\n')

    // Summary
    const totalIssues =
        issues.emptyDescriptions.length +
        issues.uncategorized.length +
        issues.inconsistentNaming.length +
        issues.emptyContent.length

    console.log('\n' + '='.repeat(60))
    console.log(`\n📊 Summary: ${totalIssues} issues found across ${modules.length} modules\n`)

    if (totalIssues === 0) {
        console.log('✅ All modules are well organized!\n')
        return { modules, issues, totalIssues: 0 }
    } else {
        console.log('⚠️  Some improvements needed. See recommendations above.\n')
        return { modules, issues, totalIssues }
    }
}

/**
 * Prompt user for input
 */
function prompt(question) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close()
            resolve(answer.trim())
        })
    })
}

/**
 * Run fix-modules script
 */
async function runFixScript() {
    return new Promise((resolve, reject) => {
        const fixProcess = spawn('bun', ['scripts/fix-modules.js'], {
            cwd: join(__dirname, '..'),
            stdio: 'inherit',
            shell: true,
        })

        fixProcess.on('close', code => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`Fix script exited with code ${code}`))
            }
        })

        fixProcess.on('error', error => {
            reject(error)
        })
    })
}

/**
 * Run sync script
 */
async function runSyncScript() {
    return new Promise((resolve, reject) => {
        const syncProcess = spawn('bun', ['scripts/sync.js'], {
            cwd: join(__dirname, '..'),
            stdio: 'inherit',
            shell: true,
        })

        syncProcess.on('close', code => {
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`Sync script exited with code ${code}`))
            }
        })

        syncProcess.on('error', error => {
            reject(error)
        })
    })
}

/**
 * Main async function
 */
async function main() {
    const args = process.argv.slice(2)
    const noPrompt = args.includes('--no-prompt')

    const result = analyze()

    // If no issues, exit
    if (result.totalIssues === 0) {
        return
    }

    // If --no-prompt flag, skip interactive steps
    if (noPrompt) {
        return
    }

    // Show fixable issues
    const fixableIssues =
        result.issues.emptyDescriptions.length +
        result.issues.uncategorized.length +
        (result.issues.inconsistentNaming.length > 0 ? 1 : 0) // Can be fixed but some are intentional

    if (fixableIssues > 0) {
        console.log('\n' + '='.repeat(60))
        const answer = await prompt(`\n❓ Would you like to fix ${fixableIssues} fixable issues automatically? (y/n): `)

        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            console.log('\n🔧 Running fix-modules.js...\n')
            try {
                await runFixScript()
                console.log('\n✅ Fixes applied successfully!\n')

                // Ask about sync
                const syncAnswer = await prompt('❓ Would you like to sync to your project now? (y/n): ')
                if (syncAnswer.toLowerCase() === 'y' || syncAnswer.toLowerCase() === 'yes') {
                    console.log('\n🔄 Running sync...\n')
                    try {
                        await runSyncScript()
                        console.log('\n✅ Sync completed successfully!\n')
                    } catch (error) {
                        console.warn(`\n⚠️  Could not run sync: ${error.message}`)
                        console.log('   Run manually: bun scripts/sync.js\n')
                    }
                } else {
                    console.log('\n💡 Run sync manually when ready:')
                    console.log('   bun scripts/sync.js\n')
                }
            } catch (error) {
                console.error(`\n❌ Failed to run fix script: ${error.message}`)
                console.log('   Run manually: bun scripts/fix-modules.js\n')
            }
        } else {
            console.log('\n💡 You can fix issues manually with:')
            console.log('   bun scripts/fix-modules.js\n')
        }
    } else {
        console.log('\n💡 Some issues may require manual fixes.')
        console.log('   Review the recommendations above.\n')
    }
}

main().catch(error => {
    console.error(`\n❌ Error: ${error.message}\n`)
    process.exit(1)
})
