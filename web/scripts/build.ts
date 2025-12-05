#!/usr/bin/env bun
/**
 * Build script for bundling JavaScript/TypeScript and CSS files
 * Compiles TypeScript files and bundles them using Bun's bundler
 * Uses Tailwind CSS CLI to compile CSS with custom styles and daisyUI
 */

import { existsSync, mkdirSync, statSync, rmSync } from 'fs'
import { join } from 'path'
import { $ } from 'bun'
import type { BundleConfig } from './types'

const WEB_DIR: string = import.meta.dir
const ASSETS_DIR: string = join(WEB_DIR, '..', 'assets')
const JS_SRC_DIR: string = join(ASSETS_DIR, 'js')
const CSS_SRC_DIR: string = join(ASSETS_DIR, 'css')
const PUBLIC_DIR: string = join(WEB_DIR, '..', 'public')
const DIST_DIR: string = join(PUBLIC_DIR, 'dist')
const JS_DIST_DIR: string = join(DIST_DIR, 'js')
const CSS_DIST_DIR: string = join(DIST_DIR, 'css')
const CSS_INPUT: string = join(CSS_SRC_DIR, 'input.css')
const CSS_OUTPUT: string = join(CSS_DIST_DIR, 'app.css')

/**
 * Get file path, preferring .ts over .js
 * @param basePath - Base path without extension
 * @returns Path to file if it exists, null otherwise
 */
function getFilePath(basePath: string): string | null {
    // Remove .js extension if present (entryBase might already have it)
    const cleanPath = basePath.replace(/\.js$/, '')

    // Try TypeScript first
    const tsPath = cleanPath + '.ts'
    if (existsSync(tsPath)) {
        return tsPath
    }

    // Fallback to JavaScript
    const jsPath = cleanPath + '.js'
    if (existsSync(jsPath)) {
        return jsPath
    }

    return null
}

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
// Note: TypeScript files (.ts) are preferred over JavaScript (.js)
const bundles: BundleConfig[] = [
    {
        name: 'wizard',
        entry: [
            // Core modules - must be loaded first
            join(JS_SRC_DIR, 'core', 'constants'),
            join(JS_SRC_DIR, 'core', 'dom'),
            join(JS_SRC_DIR, 'core', 'htmx'),
            // Type guards for safe window access
            join(JS_SRC_DIR, 'core', 'type-guards'),
            // Improved state management (new)
            join(JS_SRC_DIR, 'core', 'wizard-state-manager'),
            join(JS_SRC_DIR, 'core', 'state-indicator'),
            join(JS_SRC_DIR, 'core', 'form-state-sync'),
            // Centralized step configuration (DRY)
            join(JS_SRC_DIR, 'core', 'step-config'),
            // Unified validation system (DRY)
            join(JS_SRC_DIR, 'core', 'step-validator'),
            join(JS_SRC_DIR, 'core', 'wizard-navigation'),
            join(JS_SRC_DIR, 'core', 'wizard-init'),
            // Legacy state management (for backward compatibility)
            join(JS_SRC_DIR, 'core', 'state'),
            // Wizard modules (legacy - removed, backward compatibility in TypeScript modules)
            // join(JS_SRC_DIR, 'wizard', 'navigation'), // Removed - backward compat in wizard-navigation.ts
            // join(JS_SRC_DIR, 'wizard', 'form-restore'), // Removed - backward compat in form-state-sync.ts
            // join(JS_SRC_DIR, 'wizard', 'form-sync'), // Removed - backward compat in form-state-sync.ts
            join(JS_SRC_DIR, 'wizard', 'init'), // Still needed - uses legacy functions
            // Step modules
            join(JS_SRC_DIR, 'steps', 'advanced'),
            join(JS_SRC_DIR, 'steps', 'review')
        ],
        output: join(JS_DIST_DIR, 'wizard.js'),
        description: 'Wizard scripts bundle (improved version)'
    },
    {
        name: 'base',
        entry: [
            join(JS_SRC_DIR, 'base', 'back-button'),
            // Live reload client (development only, but included in build)
            join(JS_SRC_DIR, 'core', 'live-reload')
        ],
        output: join(JS_DIST_DIR, 'base.js'),
        description: 'Base scripts bundle'
    }
]

/**
 * Build Tailwind CSS
 */
async function buildTailwindCSS(): Promise<void> {
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

        const stats = statSync(CSS_OUTPUT)
        const size = stats.size / 1024

        console.log(`✅ Tailwind CSS compiled: ${CSS_OUTPUT} (${size.toFixed(2)} KB)`)
    } catch (error) {
        console.error(`❌ Error building Tailwind CSS:`, error)
        process.exit(1)
    }
}

/**
 * Build a single bundle
 */
async function buildBundle(bundle: BundleConfig): Promise<void> {
    console.log(`🔨 Building ${bundle.name} bundle...`)

    try {
        // Resolve entry files (prefer .ts over .js)
        const resolvedEntries: string[] = []
        for (const entryBase of bundle.entry) {
            // entryBase already includes full path, just need to check .ts vs .js
            const filePath = getFilePath(entryBase)
            if (filePath) {
                resolvedEntries.push(filePath)
            } else {
                console.warn(`⚠️  Warning: Entry file not found: ${entryBase}.js or ${entryBase}.ts`)
            }
        }

        if (resolvedEntries.length === 0) {
            console.warn(`⚠️  Warning: No entry files found for ${bundle.name} bundle`)
            return
        }

        // Build bundle content
        let combinedContent = ''
        const tempDir = join(WEB_DIR, '.temp-build')

        // Create temp directory if needed for TypeScript compilation
        const needsTempDir = resolvedEntries.some((f: string) => f.endsWith('.ts'))
        if (needsTempDir && !existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true })
        }

        for (const entryFile of resolvedEntries) {
            const fileName = entryFile.split('/').pop() || entryFile
            const isTypeScript = entryFile.endsWith('.ts')

            // Add separator comment
            combinedContent += `\n// === ${fileName} ===\n`

            if (isTypeScript) {
                // Compile TypeScript to JavaScript using Bun.build
                // Use a unique temp file for each entry to avoid conflicts
                const tempOutput = join(tempDir, `${bundle.name}-${fileName.replace('.ts', '.js')}`)

                try {
                    const result = await Bun.build({
                        entrypoints: [entryFile],
                        outdir: tempDir,
                        target: 'browser',
                        format: 'iife',
                        minify: false,
                        sourcemap: 'none',
                        external: [] // Don't externalize anything - bundle everything
                    })

                    if (!result.success) {
                        console.error(`❌ Error compiling ${entryFile}:`)
                        result.logs.forEach((log) => console.error('  ', log))
                        throw new Error(`Failed to compile ${entryFile}`)
                    }

                    // Read the compiled output
                    if (result.outputs.length > 0) {
                        const compiledContent = await result.outputs[0].text()
                        combinedContent += compiledContent.trim()
                    } else {
                        // Fallback: try reading from temp file
                        if (existsSync(tempOutput)) {
                            const compiledContent = await Bun.file(tempOutput).text()
                            combinedContent += compiledContent.trim()
                        } else {
                            throw new Error(`No output file generated for ${entryFile}`)
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error processing TypeScript file ${entryFile}:`, error)
                    throw error
                }
            } else {
                // JavaScript file - read directly
                const content = await Bun.file(entryFile).text()
                combinedContent += content.trim()
            }

            // Ensure proper separation between modules
            if (!combinedContent.trim().endsWith(';')) {
                combinedContent += ';'
            }

            // Add double newline for clear separation
            combinedContent += '\n\n'
        }

        // Cleanup temp directory
        if (needsTempDir && existsSync(tempDir)) {
            rmSync(tempDir, { recursive: true, force: true })
        }

        // Write combined content to output file
        await Bun.write(bundle.output, combinedContent)

        // Get file size using fs.statSync
        const stats = statSync(bundle.output)
        const size = stats.size / 1024

        console.log(`✅ ${bundle.description}: ${bundle.output} (${size.toFixed(2)} KB)`)
    } catch (error) {
        console.error(`❌ Error building ${bundle.name} bundle:`, error)
        process.exit(1)
    }
}

// Build each bundle
for (const bundle of bundles) {
    await buildBundle(bundle)
}

// Build Tailwind CSS
await buildTailwindCSS()

console.log('\n✨ Build complete!')
console.log(`📁 JavaScript output: ${JS_DIST_DIR}`)
console.log(`📁 CSS output: ${CSS_DIST_DIR}`)
