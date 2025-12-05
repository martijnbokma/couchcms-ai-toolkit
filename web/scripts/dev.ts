#!/usr/bin/env bun
/**
 * Development script
 * Starts server with watch mode and live reload enabled
 * Combines server + watch + live reload in one command
 */

import { spawn, type ChildProcess } from 'child_process'
import { join } from 'path'

const WEB_DIR: string = import.meta.dir
const SERVER_SCRIPT: string = join(WEB_DIR, '..', 'server', 'server.ts')
const WATCH_SCRIPT: string = join(WEB_DIR, 'watch.ts')

const port: number = parseInt(
    process.env.PORT || process.argv.find((arg: string) => arg.startsWith('--port='))?.split('=')[1] || '3000',
    10
)

console.log('🚀 Starting development server with live reload...\n')

// Start watch mode
console.log('📡 Starting watch mode...')
const watchProcess: ChildProcess = spawn('bun', [WATCH_SCRIPT], {
    cwd: join(WEB_DIR, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        LIVE_RELOAD_SERVER: `http://localhost:${port}`
    }
})

// Give watch mode time to do initial build
await new Promise((resolve: (value: void) => void) => setTimeout(resolve, 2000))

// Start server
console.log(`🌐 Starting server on port ${port}...`)
const serverProcess: ChildProcess = spawn('bun', [SERVER_SCRIPT, port.toString()], {
    cwd: join(WEB_DIR, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        NODE_ENV: 'development'
    }
})

/**
 * Handle cleanup and shutdown
 */
function cleanup(): void {
    console.log('\n👋 Shutting down...')
    watchProcess.kill()
    serverProcess.kill()
    process.exit(0)
}

// Handle cleanup
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Wait for processes
watchProcess.on('exit', (code: number | null) => {
    if (code !== 0 && code !== null) {
        console.error(`Watch process exited with code ${code}`)
        serverProcess.kill()
        process.exit(code)
    }
})

serverProcess.on('exit', (code: number | null) => {
    if (code !== 0 && code !== null) {
        console.error(`Server process exited with code ${code}`)
        watchProcess.kill()
        process.exit(code)
    }
})
