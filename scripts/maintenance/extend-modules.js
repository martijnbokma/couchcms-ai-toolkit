#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Extend Modules Script
 *
 * Analyzes CouchCMS documentation and extends modules with relevant content.
 *
 * Usage:
 *   bun scripts/extend-modules.js [options]
 *
 * Options:
 *   --docs-path <path>    Path to CouchCMS-Documentation/src/content (default: ../CouchCMS-Documentation/src/content)
 *   --module <name>        Extend specific module only
 *   --dry-run             Show what would be done without making changes
 *   --analyze             Only analyze and show mapping, don't extend
 */

import matter from 'gray-matter'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { createInterface } from 'readline'
import { spawn } from 'child_process'
import { getToolkitRootCached } from '../lib/index.js'
import { getCouchCMSModules } from '../lib/option-organizer.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * Find module file path (searches in core/ and frontend/ subdirectories)
 * @param {string} moduleName - Module name
 * @returns {string|null} - Full path to module file or null if not found
 */
function findModulePath(moduleName) {
    const couchcmsModules = getCouchCMSModules()
    const subdir = couchcmsModules.includes(moduleName) ? 'core' : 'frontend'

    // Try subdirectory first
    const subdirPath = join(TOOLKIT_ROOT, 'modules', subdir, `${moduleName}.md`)
    if (existsSync(subdirPath)) {
        return subdirPath
    }

    // Fallback to root (legacy support)
    const rootPath = join(TOOLKIT_ROOT, 'modules', `${moduleName}.md`)
    if (existsSync(rootPath)) {
        return rootPath
    }

    return null
}

/**
 * Get module directory for creating new modules
 * @param {string} moduleName - Module name
 * @returns {string} - Subdirectory path (core/ or frontend/)
 */
function getModuleDirectory(moduleName) {
    const couchcmsModules = getCouchCMSModules()
    const subdir = couchcmsModules.includes(moduleName) ? 'core' : 'frontend'
    return join(TOOLKIT_ROOT, 'modules', subdir)
}

/**
 * Module mapping: Maps documentation topics to modules
 */
const MODULE_MAPPING = {
    'couchcms-core': {
        concepts: [
            'templates',
            'editable-regions',
            'variables',
            'variables-in-views',
            'views',
            'listing-pages',
            'cloned-pages',
            'tags',
            'setting-parameters',
        ],
        tags: [
            'template',
            'editable',
            'show',
            'if',
            'pages',
            'embed',
            'set',
            'get',
        ],
    },
    'databound-forms': {
        concepts: [
            'forms',
            'databound-forms',
        ],
        tags: [
            'form',
            'input',
            'fieldset',
        ],
    },
    // Potential new modules based on documentation
    'comments': {
        concepts: ['comments'],
        tags: ['comments', 'process_comment'],
        newModule: true,
    },
    'search': {
        concepts: ['search'],
        tags: ['search', 'search_form'],
        newModule: true,
    },
    'pagination': {
        concepts: ['pagination'],
        tags: ['paginator'],
        newModule: true,
    },
    'relationships': {
        concepts: ['relationships'],
        tags: ['related_pages', 'reverse_related_pages'],
        newModule: true,
    },
    'repeatable-regions': {
        concepts: ['repeatable-regions'],
        tags: ['repeatable', 'repeat', 'show_repeatable'],
        newModule: true,
    },
    'folders': {
        concepts: ['folders', 'nested-pages'],
        tags: ['folder', 'folders', 'nested_pages', 'dropdownfolders'],
        newModule: true,
    },
    'archives': {
        concepts: ['archives'],
        tags: ['archives'],
        newModule: true,
    },
    'users': {
        concepts: ['users'],
        tags: [],
        newModule: true,
    },
    'custom-routes': {
        concepts: [],
        tags: [],
        customRoutes: true,
        newModule: true,
    },
}

/**
 * Extract code examples from MDX content
 */
function extractCodeExamples(content) {
    const codeBlockRegex = /```(\w+)(?:\s+title="([^"]+)")?\n([\s\S]*?)```/g
    const examples = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
        const [, language, title, code] = match
        examples.push({
            language: language || 'text',
            title: title || 'Example',
            code: code.trim(),
        })
    }

    return examples
}

/**
 * Extract key patterns and rules from documentation
 */
function extractPatterns(content) {
    const patterns = []

    // Extract admonitions (:::note, :::tip, :::caution, :::danger)
    const admonitionRegex = /:::(note|tip|caution|danger)(?:\[([^\]]+)\])?\n([\s\S]*?):::/g
    let match
    while ((match = admonitionRegex.exec(content)) !== null) {
        const [, type, title, content] = match
        patterns.push({
            type: 'admonition',
            level: type === 'danger' ? 'critical' : type === 'caution' ? 'warning' : 'info',
            title: title || type,
            content: content.trim(),
        })
    }

    // Extract Steps components
    const stepsRegex = /<Steps>([\s\S]*?)<\/Steps>/g
    while ((match = stepsRegex.exec(content)) !== null) {
        patterns.push({
            type: 'steps',
            content: match[1].trim(),
        })
    }

    return patterns
}

/**
 * Convert documentation to module format
 */
function convertToModuleFormat(docContent, docMeta, examples, patterns) {
    let moduleContent = `---
id: ${docMeta.id || 'module'}
name: "${docMeta.title || 'Module'}"
version: "2.x"
description: "${docMeta.description || ''}"
required: false
requires: [couchcms-core]
conflicts: []
---

# ${docMeta.title || 'Module'}

${docMeta.description ? `> ${docMeta.description}\n` : ''}

`

    // Add patterns (admonitions converted to rules)
    if (patterns.length > 0) {
        moduleContent += `## Critical Rules\n\n`
        for (const pattern of patterns) {
            if (pattern.type === 'admonition' && pattern.level === 'critical') {
                moduleContent += `### 🚨 ${pattern.title}\n\n${pattern.content}\n\n`
            }
        }
        moduleContent += `\n`
    }

    // Add code examples
    if (examples.length > 0) {
        moduleContent += `## Code Examples\n\n`
        for (const example of examples) {
            moduleContent += `### ${example.title}\n\n`
            moduleContent += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`
        }
    }

    // Add main content (cleaned)
    const cleanedContent = docContent
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks (already extracted)
        .replace(/:::[^\n]*[\s\S]*?:::/g, '') // Remove admonitions (already extracted)
        .replace(/<Steps>[\s\S]*?<\/Steps>/g, '') // Remove Steps components
        .replace(/import[^;]+;/g, '') // Remove imports
        .replace(/<Image[^>]*\/>/g, '') // Remove images
        .trim()

    if (cleanedContent) {
        moduleContent += `## Patterns\n\n${cleanedContent}\n\n`
    }

    return moduleContent
}

/**
 * Find all MDX files in a directory recursively
 */
function findMdxFiles(dir, fileList = []) {
    if (!existsSync(dir)) {
        return fileList
    }

    const files = readdirSync(dir)

    for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)

        if (stat.isDirectory()) {
            findMdxFiles(filePath, fileList)
        } else if (file.endsWith('.mdx')) {
            fileList.push(filePath)
        }
    }

    return fileList
}

/**
 * Load documentation file
 */
function loadDocumentation(filePath) {
    try {
        const content = readFileSync(filePath, 'utf8')
        const { data: meta, content: body } = matter(content)
        return { meta, content: body, path: filePath }
    } catch (error) {
        console.warn(`⚠️  Failed to load ${filePath}: ${error.message}`)
        return null
    }
}

/**
 * Analyze documentation structure
 */
function analyzeDocumentation(docsPath) {
    console.log('📚 Analyzing documentation structure...\n')

    const conceptsDir = join(docsPath, 'docs', 'concepts')
    const tagsDir = join(docsPath, 'docs', 'tags-reference')
    const customRoutesDir = join(tagsDir, 'custom-routes')

    const analysis = {
        concepts: [],
        tags: [],
        customRoutes: [],
    }

    // Analyze concepts
    if (existsSync(conceptsDir)) {
        const conceptFiles = findMdxFiles(conceptsDir)
        for (const file of conceptFiles) {
            const doc = loadDocumentation(file)
            if (doc) {
                analysis.concepts.push({
                    file: file.replace(docsPath, ''),
                    title: doc.meta.title,
                    description: doc.meta.description,
                })
            }
        }
    }

    // Analyze tags
    if (existsSync(tagsDir)) {
        const tagFiles = findMdxFiles(tagsDir)
        for (const file of tagFiles) {
            // Skip subdirectories (we'll handle them separately)
            if (file.includes('/editable/') || file.includes('/custom-routes/')) {
                continue
            }
            const doc = loadDocumentation(file)
            if (doc) {
                analysis.tags.push({
                    file: file.replace(docsPath, ''),
                    title: doc.meta.title,
                    description: doc.meta.description,
                })
            }
        }
    }

    // Analyze custom routes
    if (existsSync(customRoutesDir)) {
        const routeFiles = findMdxFiles(customRoutesDir)
        for (const file of routeFiles) {
            const doc = loadDocumentation(file)
            if (doc) {
                analysis.customRoutes.push({
                    file: file.replace(docsPath, ''),
                    title: doc.meta.title,
                    description: doc.meta.description,
                })
            }
        }
    }

    return analysis
}

/**
 * Extend a module with documentation
 */
function extendModule(moduleName, docsPath, dryRun = false) {
    const mapping = MODULE_MAPPING[moduleName]
    if (!mapping) {
        console.warn(`⚠️  No mapping found for module: ${moduleName}`)
        return false
    }

    console.log(`\n📦 Extending module: ${moduleName}`)

    const modulePath = findModulePath(moduleName) || join(getModuleDirectory(moduleName), `${moduleName}.md`)
    const existingModule = existsSync(modulePath)
        ? readFileSync(modulePath, 'utf8')
        : null

    let newContent = ''
    let addedSections = 0

    // Process concepts
    if (mapping.concepts && mapping.concepts.length > 0) {
        const conceptsDir = join(docsPath, 'docs', 'concepts')
        for (const conceptName of mapping.concepts) {
            const conceptFile = join(conceptsDir, `${conceptName}.mdx`)
            if (existsSync(conceptFile)) {
                const doc = loadDocumentation(conceptFile)
                if (doc) {
                    const examples = extractCodeExamples(doc.content)
                    const patterns = extractPatterns(doc.content)

                    if (examples.length > 0 || patterns.length > 0) {
                        newContent += `\n## ${doc.meta.title || conceptName}\n\n`
                        if (doc.meta.description) {
                            newContent += `${doc.meta.description}\n\n`
                        }

                        // Add critical patterns first
                        const criticalPatterns = patterns.filter(p => p.level === 'critical')
                        if (criticalPatterns.length > 0) {
                            newContent += `### Critical Rules\n\n`
                            for (const pattern of criticalPatterns) {
                                newContent += `**${pattern.title}**\n\n${pattern.content}\n\n`
                            }
                        }

                        // Add examples
                        if (examples.length > 0) {
                            for (const example of examples.slice(0, 3)) {
                                // Limit to 3 examples
                                newContent += `### ${example.title}\n\n`
                                newContent += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`
                            }
                        }

                        addedSections++
                    }
                }
            }
        }
    }

    // Process tags
    if (mapping.tags && mapping.tags.length > 0) {
        const tagsDir = join(docsPath, 'docs', 'tags-reference', 'core')
        for (const tagName of mapping.tags) {
            const tagFile = join(tagsDir, `${tagName}.mdx`)
            if (existsSync(tagFile)) {
                const doc = loadDocumentation(tagFile)
                if (doc) {
                    const examples = extractCodeExamples(doc.content)
                    if (examples.length > 0) {
                        newContent += `\n## ${doc.meta.title || tagName} Tag\n\n`
                        for (const example of examples.slice(0, 2)) {
                            // Limit to 2 examples per tag
                            newContent += `### ${example.title}\n\n`
                            newContent += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`
                        }
                        addedSections++
                    }
                }
            }
        }
    }

    // Process custom routes
    if (mapping.customRoutes) {
        const routesDir = join(docsPath, 'docs', 'tags-reference', 'custom-routes')
        if (existsSync(routesDir)) {
            const routeFiles = findMdxFiles(routesDir)
            newContent += `\n## Custom Routes\n\n`
            for (const routeFile of routeFiles.slice(0, 3)) {
                // Limit to 3 route docs
                const doc = loadDocumentation(routeFile)
                if (doc) {
                    const examples = extractCodeExamples(doc.content)
                    if (examples.length > 0) {
                        newContent += `### ${doc.meta.title || 'Route Example'}\n\n`
                        newContent += `\`\`\`php\n${examples[0].code}\n\`\`\`\n\n`
                        addedSections++
                    }
                }
            }
        }
    }

    if (newContent) {
        if (dryRun) {
            console.log(`\n📝 Would add ${addedSections} sections to ${moduleName}.md`)
            console.log(`\nPreview:\n${newContent.substring(0, 500)}...\n`)
        } else {
            if (existingModule) {
                // Append to existing module
                const updatedContent = existingModule + '\n---\n' + newContent
                writeFileSync(modulePath, updatedContent)
                console.log(`✅ Extended ${moduleName}.md with ${addedSections} sections`)
            } else {
                // Create new module
                const frontmatter = `---
id: ${moduleName}
name: "${mapping.name || moduleName}"
version: "2.x"
description: "${mapping.description || ''}"
required: false
requires: [couchcms-core]
conflicts: []
---

# ${mapping.name || moduleName}

${mapping.description || ''}

`
                writeFileSync(modulePath, frontmatter + newContent)
                console.log(`✅ Created new module: ${moduleName}.md`)
            }
        }
        return true
    } else {
        console.log(`⚠️  No new content found for ${moduleName}`)
        return false
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
 * Get list of new modules (not yet created)
 */
function getNewModules() {
    return Object.entries(MODULE_MAPPING)
        .filter(([name, mapping]) => {
            if (!mapping.newModule) return false
            const modulePath = join(TOOLKIT_ROOT, 'modules', `${name}.md`)
            return !existsSync(modulePath)
        })
        .map(([name]) => name)
}

/**
 * Show analysis and mapping
 */
function showAnalysis(docsPath) {
    const analysis = analyzeDocumentation(docsPath)

    console.log('\n📊 Documentation Analysis\n')
    console.log(`Concepts: ${analysis.concepts.length}`)
    console.log(`Tags: ${analysis.tags.length}`)
    console.log(`Custom Routes: ${analysis.customRoutes.length}`)

    console.log('\n📋 Module Mapping\n')
    for (const [moduleName, mapping] of Object.entries(MODULE_MAPPING)) {
        console.log(`\n${moduleName}:`)
        if (mapping.concepts && mapping.concepts.length > 0) {
            console.log(`  Concepts: ${mapping.concepts.join(', ')}`)
        }
        if (mapping.tags && mapping.tags.length > 0) {
            console.log(`  Tags: ${mapping.tags.join(', ')}`)
        }
        if (mapping.newModule) {
            const modulePath = findModulePath(moduleName)
            const exists = modulePath !== null
            console.log(`  ${exists ? '✅' : '⭐'} ${exists ? 'Module exists' : 'New module (not yet created)'}`)
        }
    }

    const newModules = getNewModules()

    if (newModules.length > 0) {
        console.log('\n💡 Potential New Modules:\n')
        newModules.forEach((name, index) => {
            console.log(`  ${index + 1}. ${name}`)
        })
        console.log(`\n  Total: ${newModules.length} new modules available`)
    } else {
        console.log('\n✅ All modules already exist\n')
    }

    return newModules
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2)
    const docsPathIndex = args.indexOf('--docs-path')
    const docsPath = docsPathIndex >= 0 && args[docsPathIndex + 1]
        ? resolve(args[docsPathIndex + 1])
        : resolve(TOOLKIT_ROOT, '..', 'CouchCMS-Documentation', 'src', 'content')

    const moduleIndex = args.indexOf('--module')
    const moduleName = moduleIndex >= 0 ? args[moduleIndex + 1] : null

    const dryRun = args.includes('--dry-run')
    const analyzeOnly = args.includes('--analyze')

    console.log('🔄 CouchCMS AI Toolkit - Extend Modules\n')
    console.log(`📁 Docs path: ${docsPath}`)

    if (!existsSync(docsPath)) {
        console.error(`❌ Documentation path not found: ${docsPath}`)
        console.log('\nUsage: bun scripts/extend-modules.js [--docs-path <path>] [--module <name>] [--dry-run] [--analyze]\n')
        process.exit(1)
    }

    if (analyzeOnly) {
        const newModules = showAnalysis(docsPath)

        if (newModules.length > 0) {
            console.log('\n' + '='.repeat(60))
            const answer = await prompt(`\n❓ Would you like to create all ${newModules.length} new modules? (y/n): `)

            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                console.log('\n📦 Creating all new modules...\n')
                let created = 0
                let skipped = 0

                for (const moduleName of newModules) {
                    const result = extendModule(moduleName, docsPath, false)
                    if (result) {
                        created++
                    } else {
                        skipped++
                    }
                }

                console.log(`\n✨ Done! Created ${created} modules, skipped ${skipped}`)

                if (created > 0) {
                    const syncAnswer = await prompt('\n❓ Would you like to sync to your project now? (y/n): ')
                    if (syncAnswer.toLowerCase() === 'y' || syncAnswer.toLowerCase() === 'yes') {
                        console.log('\n🔄 Running sync...\n')
                        try {
                            await new Promise((resolve, reject) => {
                                const syncProcess = spawn('bun', ['scripts/sync.js'], {
                                    cwd: TOOLKIT_ROOT,
                                    stdio: 'inherit',
                                    shell: true,
                                })

                                syncProcess.on('close', code => {
                                    if (code === 0) {
                                        console.log('\n✅ Sync completed successfully!\n')
                                        resolve()
                                    } else {
                                        console.log(`\n⚠️  Sync exited with code ${code}\n`)
                                        resolve() // Don't reject, just warn
                                    }
                                })

                                syncProcess.on('error', error => {
                                    console.warn(`\n⚠️  Could not run sync: ${error.message}`)
                                    console.log('   Run manually: bun scripts/sync.js\n')
                                    reject(error)
                                })
                            })
                        } catch (error) {
                            console.warn(`\n⚠️  Could not run sync automatically: ${error.message}`)
                            console.log('   Run manually: bun scripts/sync.js\n')
                        }
                    } else {
                        console.log('\n💡 Run sync manually when ready:')
                        console.log('   bun scripts/sync.js\n')
                    }
                }
            } else {
                console.log('\n💡 You can create modules individually with:')
                console.log(`   bun scripts/extend-modules.js --module <name>\n`)
            }
        }
        return
    }

    if (moduleName) {
        // Extend specific module
        extendModule(moduleName, docsPath, dryRun)
    } else {
        // Extend all modules
        console.log('\n📦 Extending all modules...\n')
        for (const moduleName of Object.keys(MODULE_MAPPING)) {
            extendModule(moduleName, docsPath, dryRun)
        }
    }

    console.log('\n✨ Done!\n')
}

main().catch(error => {
    console.error(`\n❌ Error: ${error.message}\n`)
    process.exit(1)
})
