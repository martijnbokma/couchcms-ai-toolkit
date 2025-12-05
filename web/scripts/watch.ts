#!/usr/bin/env bun
/**
 * Watch script for development
 * Automatically rebuilds assets when files change
 * Optionally watches server files and restarts the server
 */

import { watch, existsSync } from 'fs'
import { join, relative } from 'path'
import { $ } from 'bun'
import type { WatchOptions, ChangeType } from './types'

const WEB_DIR: string = import.meta.dir
const WEB_ROOT: string = join(WEB_DIR, '..')
const ASSETS_DIR: string = join(WEB_ROOT, 'assets')
const JS_SRC_DIR: string = join(ASSETS_DIR, 'js')
const CSS_SRC_DIR: string = join(ASSETS_DIR, 'css')
const TEMPLATES_DIR: string = join(WEB_ROOT, 'templates')
const SERVER_DIR: string = join(WEB_ROOT, 'server')
const BUILD_SCRIPT: string = join(WEB_DIR, 'build.ts')

/**
 * Console color codes
 */
interface ColorCodes {
    reset: string
    bright: string
    dim: string
    green: string
    yellow: string
    blue: string
    magenta: string
    cyan: string
}

const colors: ColorCodes = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
}

type ColorKey = keyof ColorCodes

/**
 * Log a message with color and timestamp
 */
function log(message: string, color: ColorKey = 'reset'): void {
    const timestamp = new Date().toLocaleTimeString('nl-NL')
    console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`)
}

/**
 * Live reload response data
 */
interface LiveReloadResponse {
    clients?: number
    type?: string
}

// Track if build is in progress to prevent multiple simultaneous builds
let isBuilding: boolean = false
let buildTimeout: ReturnType<typeof setTimeout> | null = null

// Live reload server URL (can be configured via environment variable)
const LIVE_RELOAD_SERVER: string = process.env.LIVE_RELOAD_SERVER || 'http://localhost:3000'

/**
 * Trigger browser reload via live reload server
 * @param changeType - Type of change ('css', 'js', 'html', 'full')
 */
async function triggerBrowserReload(changeType: ChangeType = 'full'): Promise<void> {
    try {
        const response = await fetch(`${LIVE_RELOAD_SERVER}/_live-reload/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: changeType })
        })

        if (response.ok) {
            const data = (await response.json().catch(() => ({}))) as LiveReloadResponse
            if (data.clients && data.clients > 0) {
                log(`🔄 Browser reload triggered (${data.clients} client(s))`, 'green')
            }
        }
    } catch (error) {
        // Server might not be running, that's okay
        // log(`⚠️  Could not trigger browser reload: ${error.message}`, 'dim')
    }
}

/**
 * Debounced build function
 * Waits for file changes to settle before rebuilding
 * @param changeType - Type of change that triggered the build
 */
async function triggerBuild(changeType: ChangeType = 'full'): Promise<void> {
    if (buildTimeout) {
        clearTimeout(buildTimeout)
    }

    buildTimeout = setTimeout(async () => {
        if (isBuilding) {
            log('⚠️  Build already in progress, skipping...', 'yellow')
            return
        }

        isBuilding = true
        log('🔨 Rebuilding assets...', 'cyan')

        try {
            const result = await $`bun ${BUILD_SCRIPT}`.quiet()

            isBuilding = false
            if (result.exitCode === 0) {
                log('✅ Build complete!', 'green')
                // Trigger browser reload after successful build
                await triggerBrowserReload(changeType)
            } else {
                log(`❌ Build failed with exit code ${result.exitCode}`, 'yellow')
            }
        } catch (error) {
            isBuilding = false
            const errorMessage = error instanceof Error ? error.message : String(error)
            log(`❌ Build error: ${errorMessage}`, 'yellow')
        }
    }, 300) // 300ms debounce
}

/**
 * Watch callback function type
 */
type WatchCallback = (eventType: string, filename: string, filePath: string) => void

/**
 * Watch a directory recursively for file changes
 */
function watchDirectory(
    dir: string,
    label: string,
    callback: WatchCallback
): ReturnType<typeof watch> | null {
    if (!existsSync(dir)) {
        log(`⚠️  Directory does not exist: ${dir}`, 'yellow')
        return null
    }

    try {
        const watcher = watch(dir, { recursive: true }, (eventType: string, filename: string | null) => {
            if (!filename) return

            const filePath = join(dir, filename)
            const relativePath = relative(WEB_ROOT, filePath)

            // Ignore common non-source files
            if (
                filename.includes('node_modules') ||
                filename.includes('.git') ||
                filename.includes('dist') ||
                filename.includes('public') ||
                filename.endsWith('.md') ||
                filename.endsWith('.log')
            ) {
                return
            }

            log(`📝 ${label}: ${relativePath}`, 'dim')
            callback(eventType, filename, filePath)
        })

        log(`👀 Watching ${label}: ${relative(WEB_ROOT, dir)}`, 'blue')
        return watcher
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        log(`❌ Error watching ${label}: ${errorMessage}`, 'yellow')
        return null
    }
}

/**
 * Main watch function
 */
async function startWatch(options: WatchOptions = {}): Promise<void> {
    const { watchServer = false } = options

    log('🚀 Starting development watch mode...', 'bright')
    log('', 'reset')

    // Initial build
    log('🔨 Running initial build...', 'cyan')
    try {
        const result = await $`bun ${BUILD_SCRIPT}`.quiet()
        if (result.exitCode === 0) {
            log('✅ Initial build complete!', 'green')
        } else {
            log(`❌ Initial build failed with exit code ${result.exitCode}`, 'yellow')
            process.exit(1)
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        log(`❌ Initial build failed: ${errorMessage}`, 'yellow')
        process.exit(1)
    }

    log('', 'reset')
    log('📡 Watching for file changes...', 'bright')
    log('   Press Ctrl+C to stop', 'dim')
    log('', 'reset')

    // Watch JavaScript files
    watchDirectory(JS_SRC_DIR, 'JavaScript', () => {
        triggerBuild('js')
    })

    // Watch CSS files
    watchDirectory(CSS_SRC_DIR, 'CSS', () => {
        triggerBuild('css')
    })

    // Watch templates (for informational purposes, templates are reloaded by Nunjucks)
    if (watchServer) {
        watchDirectory(TEMPLATES_DIR, 'Templates', (eventType: string, filename: string) => {
            log(`📄 Template changed: ${filename}`, 'magenta')
            // Trigger browser reload for template changes
            triggerBrowserReload('html')
        })

        // Watch server files (would require server restart)
        watchDirectory(SERVER_DIR, 'Server', (eventType: string, filename: string) => {
            log(`⚙️  Server file changed: ${filename} (restart server manually)`, 'magenta')
        })
    } else {
        watchDirectory(TEMPLATES_DIR, 'Templates', (eventType: string, filename: string) => {
            log(`📄 Template changed: ${filename}`, 'magenta')
            // Trigger browser reload for template changes
            triggerBrowserReload('html')
        })
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        log('', 'reset')
        log('👋 Stopping watch mode...', 'yellow')
        process.exit(0)
    })

    process.on('SIGTERM', () => {
        log('', 'reset')
        log('👋 Stopping watch mode...', 'yellow')
        process.exit(0)
    })
}

// Parse command line arguments
const args: string[] = process.argv.slice(2)
const options: WatchOptions = {
    watchServer: args.includes('--server') || args.includes('-s')
}

// Start watching
startWatch(options).catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    log(`❌ Fatal error: ${errorMessage}`, 'yellow')
    console.error(error)
    process.exit(1)
})
