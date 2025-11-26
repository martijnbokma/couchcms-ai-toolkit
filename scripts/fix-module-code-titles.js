#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Fix Module Code Block Titles
 *
 * Automatically adds title attributes to code blocks in module files
 * based on context (headings, filenames in code, etc.)
 *
 * Usage:
 *   bun scripts/fix-module-code-titles.js
 *   bun scripts/fix-module-code-titles.js --dry-run
 *   bun scripts/fix-module-code-titles.js @modules/typescript.md
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TOOLKIT_ROOT = resolve(__dirname, '..')
const MODULES_DIR = join(TOOLKIT_ROOT, 'modules')

const DRY_RUN = process.argv.includes('--dry-run')
const SPECIFIC_FILE = process.argv.find((arg) => arg.startsWith('@modules/'))

/**
 * Extract filename from code content
 */
function extractFilename(code, language) {
    // Common patterns for filenames in code
    const patterns = [
        // PHP: masterpage="file.php", require_once('file.php')
        /(?:masterpage|require_once|include|include_once)\(?['"]([^'"]+\.(?:php|html|js|ts|json|css|yaml|yml))['"]\)?/i,
        // HTML: <cms:form masterpage="file.php">
        /masterpage\s*=\s*['"]([^'"]+\.(?:php|html))['"]/i,
        // Config files mentioned in headings or comments
        /(?:config|tsconfig|package|\.htaccess|webpack|vite|tailwind)\.(?:json|js|ts|php|config)/i,
        // File paths
        /['"]([^'"]+\.(?:php|html|js|ts|json|css|yaml|yml))['"]/,
    ]

    for (const pattern of patterns) {
        const match = code.match(pattern)
        if (match) {
            const filename = match[1] || match[0]
            // Clean up the filename
            return filename
                .replace(/['"]/g, '')
                .replace(/^.*\//, '') // Remove path
                .trim()
        }
    }

    // Language-specific defaults
    const defaults = {
        php: 'template.php',
        html: 'template.html',
        typescript: 'example.ts',
        javascript: 'example.js',
        json: 'config.json',
        css: 'styles.css',
        bash: 'command.sh',
        shell: 'command.sh',
    }

    return defaults[language] || 'example'
}

/**
 * Generate title from context
 */
function generateTitle(codeBlock, language, context) {
    const { previousHeading, code } = context

    // If heading contains a filename, use it
    if (previousHeading) {
        // Check if heading is exactly a filename (most common case)
        const headingTrimmed = previousHeading.trim()
        if (/^[a-z0-9_.-]+\.(?:php|html|js|ts|tsx|json|css|yaml|yml|config|md|sh|bash)$/i.test(headingTrimmed)) {
            return headingTrimmed
        }

        // Check if heading contains a filename
        const filenameMatch = previousHeading.match(
            /([a-z0-9_.-]+\.(?:php|html|js|ts|tsx|json|css|yaml|yml|config|md|sh|bash))/i
        )
        if (filenameMatch) {
            return filenameMatch[1]
        }
    }

    // Try to extract filename from code
    const filename = extractFilename(code, language)
    if (filename && filename !== 'example') {
        return filename
    }

    // Generate from heading context
    if (previousHeading) {
        // Convert heading to filename
        const heading = previousHeading
            .replace(/^#+\s*/, '') // Remove markdown
            .replace(/[^a-z0-9]+/gi, '-') // Replace special chars with hyphens
            .toLowerCase()
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

        // Add appropriate extension
        const extensions = {
            php: 'php',
            html: 'html',
            typescript: 'ts',
            javascript: 'js',
            json: 'json',
            css: 'css',
            bash: 'sh',
            shell: 'sh',
        }

        const ext = extensions[language] || 'txt'
        return `${heading}.${ext}`
    }

    // Fallback
    const defaults = {
        php: 'template.php',
        html: 'template.html',
        typescript: 'example.ts',
        javascript: 'example.js',
        json: 'config.json',
        css: 'styles.css',
        bash: 'command.sh',
        shell: 'command.sh',
    }

    return defaults[language] || 'example.txt'
}

/**
 * Fix code block titles in content
 */
function fixCodeBlockTitles(content) {
    const lines = content.split('\n')
    const result = []
    let i = 0
    let previousHeading = null

    while (i < lines.length) {
        const line = lines[i]

        // Track headings for context
        if (line.match(/^#{1,6}\s+/)) {
            previousHeading = line.replace(/^#+\s+/, '').trim()
            result.push(line)
            i++
            continue
        }

        // Check for code block start without title
        const codeBlockMatch = line.match(/^```(\w+)(?:\s+title="([^"]+)")?$/)
        if (codeBlockMatch && !codeBlockMatch[2]) {
            const language = codeBlockMatch[1]
            const codeBlockStart = i
            let codeBlockEnd = i + 1
            let codeContent = []

            // Find the end of the code block
            while (codeBlockEnd < lines.length && !lines[codeBlockEnd].match(/^```\s*$/)) {
                codeContent.push(lines[codeBlockEnd])
                codeBlockEnd++
            }

            const fullCode = codeContent.join('\n')
            const title = generateTitle(null, language, {
                previousHeading,
                code: fullCode,
            })

            // Add title to code block
            result.push(`\`\`\`${language} title="${title}"`)
            result.push(...codeContent)
            if (codeBlockEnd < lines.length) {
                result.push(lines[codeBlockEnd]) // Add closing ```
            }

            i = codeBlockEnd + 1
            continue
        }

        result.push(line)
        i++
    }

    return result.join('\n')
}

/**
 * Process a single module file
 */
function processModule(filePath) {
    const originalContent = readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content: body } = matter(originalContent)

    const fixedBody = fixCodeBlockTitles(body)

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
    console.log('🔧 CouchCMS AI Toolkit - Fix Module Code Block Titles\n')

    if (DRY_RUN) {
        console.log('🔍 DRY RUN MODE - No files will be modified\n')
    }

    if (!existsSync(MODULES_DIR)) {
        console.error(`❌ Modules directory not found: ${MODULES_DIR}\n`)
        process.exit(1)
    }

    let files = []

    if (SPECIFIC_FILE) {
        const fileName = SPECIFIC_FILE.replace('@modules/', '')
        const filePath = join(MODULES_DIR, fileName)
        if (existsSync(filePath)) {
            files = [filePath]
        } else {
            console.error(`❌ File not found: ${filePath}\n`)
            process.exit(1)
        }
    } else {
        // Get all module files
        files = readdirSync(MODULES_DIR)
            .filter((f) => f.endsWith('.md') && f !== 'README.md')
            .map((f) => join(MODULES_DIR, f))
            .sort()
    }

    console.log(`📚 Processing ${files.length} module(s)...\n`)

    let fixedCount = 0
    for (const file of files) {
        if (processModule(file)) {
            fixedCount++
        }
    }

    console.log('\n' + '='.repeat(60))
    if (DRY_RUN) {
        console.log(`\n🔍 Would fix ${fixedCount} of ${files.length} module(s)\n`)
    } else {
        console.log(`\n✅ Fixed ${fixedCount} of ${files.length} module(s)\n`)
    }

    if (fixedCount > 0 && !DRY_RUN) {
        console.log('💡 Run `bun scripts/validate-modules.js` to verify changes\n')
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
