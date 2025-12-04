#!/usr/bin/env bun
/**
 * Build script for bundling JavaScript and CSS files
 * Uses Bun's built-in bundler to combine and minify JS files
 * Uses Tailwind CSS CLI to compile CSS with custom styles and daisyUI
 */

import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { $ } from 'bun'

const WEB_DIR = import.meta.dir
const ASSETS_DIR = join(WEB_DIR, '..', 'assets')
const JS_SRC_DIR = join(ASSETS_DIR, 'js')
const CSS_SRC_DIR = join(ASSETS_DIR, 'css')
const PUBLIC_DIR = join(WEB_DIR, '..', 'public')
const DIST_DIR = join(PUBLIC_DIR, 'dist')
const JS_DIST_DIR = join(DIST_DIR, 'js')
const CSS_DIST_DIR = join(DIST_DIR, 'css')
const CSS_INPUT = join(CSS_SRC_DIR, 'input.css')
const CSS_OUTPUT = join(CSS_DIST_DIR, 'app.css')

// Ensure dist directories exist
if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true })
}
if (!existsSync(JS_DIST_DIR)) {
    mkdirSync(JS_DIST_DIR, { recursive: true })
}
if (!existsSync(CSS_DIST_DIR)) {
    mkdirSync(CSS_DIST_DIR, { recursive: true })
}

console.log('📦 Bundling JavaScript files...\n')

// Bundle configuration
const bundles = [
    {
        name: 'wizard',
        entry: [
            // Core modules - must be loaded first
            join(JS_SRC_DIR, 'core', 'constants.js'),
            join(JS_SRC_DIR, 'core', 'dom.js'),
            join(JS_SRC_DIR, 'core', 'htmx.js'),
            // Improved state management (new)
            join(JS_SRC_DIR, 'core', 'wizard-state-manager.js'),
            join(JS_SRC_DIR, 'core', 'form-state-sync.js'),
            join(JS_SRC_DIR, 'core', 'wizard-navigation.js'),
            join(JS_SRC_DIR, 'core', 'wizard-init.js'),
            // Legacy state management (for backward compatibility)
            join(JS_SRC_DIR, 'core', 'state.js'),
            // Wizard modules (legacy - kept for compatibility)
            join(JS_SRC_DIR, 'wizard', 'navigation.js'),
            join(JS_SRC_DIR, 'wizard', 'form-restore.js'),
            join(JS_SRC_DIR, 'wizard', 'form-sync.js'),
            join(JS_SRC_DIR, 'wizard', 'init.js'),
            // Step modules
            join(JS_SRC_DIR, 'steps', 'advanced.js'),
            join(JS_SRC_DIR, 'steps', 'review.js')
        ],
        output: join(JS_DIST_DIR, 'wizard.js'),
        description: 'Wizard scripts bundle (improved version)'
    },
    {
        name: 'base',
        entry: [
            join(JS_SRC_DIR, 'base', 'back-button.js'),
            // Live reload client (development only, but included in build)
            join(JS_SRC_DIR, 'core', 'live-reload.js')
        ],
        output: join(JS_DIST_DIR, 'base.js'),
        description: 'Base scripts bundle'
    }
]

// Tailwind CSS compilation
async function buildTailwindCSS() {
    console.log('\n🎨 Building Tailwind CSS v4...')

    if (!existsSync(CSS_INPUT)) {
        console.error(`❌ Error: CSS input file not found: ${CSS_INPUT}`)
        process.exit(1)
    }

    try {
        // Use Tailwind v4 CLI to compile CSS
        // Tailwind v4 uses @tailwindcss/cli and CSS-first configuration
        const result = await $`npx @tailwindcss/cli -i ${CSS_INPUT} -o ${CSS_OUTPUT} --minify`.quiet()

        if (result.exitCode !== 0) {
            throw new Error(`Tailwind CSS compilation failed with exit code ${result.exitCode}`)
        }

        const { statSync } = await import('fs')
        const stats = statSync(CSS_OUTPUT)
        const size = stats.size / 1024

        console.log(`✅ Tailwind CSS compiled: ${CSS_OUTPUT} (${size.toFixed(2)} KB)`)
    } catch (error) {
        console.error(`❌ Error building Tailwind CSS:`, error)
        process.exit(1)
    }
}

// Build each bundle
for (const bundle of bundles) {
    console.log(`🔨 Building ${bundle.name} bundle...`)

    try {
        // Read all entry files and combine them
        let combinedContent = ''

        for (const entryFile of bundle.entry) {
            if (!existsSync(entryFile)) {
                console.warn(`⚠️  Warning: Entry file not found: ${entryFile}`)
                continue
            }

            const content = await Bun.file(entryFile).text()
            const fileName = entryFile.split('/').pop()

            // Add separator comment
            combinedContent += `\n// === ${fileName} ===\n`

            // Add content
            combinedContent += content.trim()

            // Ensure proper separation between modules
            // IIFEs end with })(), so we need a semicolon and newline after
            if (!content.trim().endsWith(';')) {
                combinedContent += ';'
            }

            // Add double newline for clear separation
            combinedContent += '\n\n'
        }

        // Write combined content to output file
        await Bun.write(bundle.output, combinedContent)

        // Get file size using fs.statSync
        const { statSync } = await import('fs')
        const stats = statSync(bundle.output)
        const size = stats.size / 1024

        console.log(`✅ ${bundle.description}: ${bundle.output} (${size.toFixed(2)} KB)`)
    } catch (error) {
        console.error(`❌ Error building ${bundle.name} bundle:`, error)
        process.exit(1)
    }
}

// Build Tailwind CSS
await buildTailwindCSS()

console.log('\n✨ Build complete!')
console.log(`📁 JavaScript output: ${JS_DIST_DIR}`)
console.log(`📁 CSS output: ${CSS_DIST_DIR}`)
