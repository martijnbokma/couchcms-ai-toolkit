#!/usr/bin/env bun
/**
 * Fix module issues: descriptions, naming, category metadata
 */

import matter from 'gray-matter'
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MODULES_DIR = join(__dirname, '..', 'modules')

/**
 * Module metadata with descriptions and categories
 */
const MODULE_METADATA = {
    'couchcms-core': {
        name: 'CouchCMS Core',
        description: 'Core CouchCMS patterns, templates, and security standards',
        category: 'core',
    },
    'tailwindcss': {
        name: 'TailwindCSS',
        description: 'TailwindCSS 4 patterns and best practices',
        category: 'frontend',
    },
    'daisyui': {
        name: 'daisyUI',
        description: 'daisyUI 5 components and theming',
        category: 'frontend',
    },
    'alpinejs': {
        name: 'Alpine.js',
        description: 'Alpine.js patterns and CouchCMS integration',
        category: 'frontend',
    },
    'typescript': {
        name: 'TypeScript',
        description: 'TypeScript standards and patterns',
        category: 'frontend',
    },
    'databound-forms': {
        name: 'DataBound Forms',
        description: 'CouchCMS DataBound Forms implementation patterns',
        category: 'forms',
    },
    'comments': {
        name: 'Comments',
        description: 'User comments with moderation and spam prevention',
        category: 'user-features',
    },
    'search': {
        name: 'Search',
        description: 'Search functionality with MySQL fulltext and relevance ranking',
        category: 'navigation',
    },
    'pagination': {
        name: 'Pagination',
        description: 'Pagination controls for pages, search results, and comments',
        category: 'navigation',
    },
    'relationships': {
        name: 'Relationships',
        description: 'Page relationships and related content patterns',
        category: 'content',
    },
    'repeatable-regions': {
        name: 'Repeatable Regions',
        description: 'Repeatable content blocks and dynamic regions',
        category: 'content',
    },
    'folders': {
        name: 'Folders',
        description: 'Content organization with virtual folders and nested pages',
        category: 'content',
    },
    'archives': {
        name: 'Archives',
        description: 'Archive views for time-based content organization',
        category: 'content',
    },
    'users': {
        name: 'Users',
        description: 'User management, access control, and authentication',
        category: 'user-features',
    },
    'custom-routes': {
        name: 'Custom Routes',
        description: 'Custom URL routing and clean URL patterns',
        category: 'navigation',
    },
}

/**
 * Fix a module file
 */
function fixModule(fileName, dryRun = false) {
    const filePath = join(MODULES_DIR, fileName)
    if (!existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${fileName}`)
        return false
    }

    const moduleId = fileName.replace('.md', '')
    const metadata = MODULE_METADATA[moduleId]

    if (!metadata) {
        console.warn(`⚠️  No metadata for: ${moduleId}`)
        return false
    }

    const content = readFileSync(filePath, 'utf8')
    const { data: meta, content: body } = matter(content)

    // Check what needs fixing
    const fixes = []
    if (!meta.description || meta.description.trim() === '') {
        fixes.push('description')
    }
    if (meta.name !== metadata.name) {
        fixes.push('name')
    }
    if (meta.category !== metadata.category) {
        fixes.push('category')
    }

    if (fixes.length === 0) {
        return false // Nothing to fix
    }

    if (dryRun) {
        console.log(`📝 ${moduleId}: would fix ${fixes.join(', ')}`)
        return true
    }

    // Update frontmatter
    const updatedMeta = {
        ...meta,
        id: meta.id || moduleId,
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        version: meta.version || '2.x',
        required: meta.required !== undefined ? meta.required : false,
        requires: meta.requires || (moduleId === 'couchcms-core' ? [] : ['couchcms-core']),
        conflicts: meta.conflicts || [],
    }

    // Reconstruct file
    const frontmatter = `---
id: ${updatedMeta.id}
name: "${updatedMeta.name}"
category: "${updatedMeta.category}"
version: "${updatedMeta.version}"
description: "${updatedMeta.description}"
required: ${updatedMeta.required}
requires: [${updatedMeta.requires.join(', ')}]
conflicts: [${updatedMeta.conflicts.join(', ')}]
---

`

    const newContent = frontmatter + body.trim() + '\n'
    writeFileSync(filePath, newContent)

    console.log(`✅ Fixed ${moduleId}: ${fixes.join(', ')}`)
    return true
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2)
    const dryRun = args.includes('--dry-run')

    console.log('🔧 Fix Modules\n')
    console.log('='.repeat(60) + '\n')

    if (dryRun) {
        console.log('🔍 Dry run mode - no files will be modified\n')
    }

    const files = readdirSync(MODULES_DIR)
        .filter(f => f.endsWith('.md') && f !== 'README.md')

    let fixed = 0
    let skipped = 0

    for (const file of files) {
        const result = fixModule(file, dryRun)
        if (result) {
            fixed++
        } else {
            skipped++
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`\n📊 Summary:`)
    console.log(`   Fixed: ${fixed}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${files.length}\n`)

    if (dryRun && fixed > 0) {
        console.log('💡 Run without --dry-run to apply fixes\n')
    }
}

main()
