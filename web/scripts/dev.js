#!/usr/bin/env bun
/**
 * Development script
 * Starts server with watch mode and live reload enabled
 * Combines server + watch + live reload in one command
 */

import { spawn } from 'child_process'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const WEB_DIR = __dirname
const SERVER_SCRIPT = join(WEB_DIR, '..', 'server', 'server.js')
const WATCH_SCRIPT = join(WEB_DIR, 'watch.js')

const port = parseInt(process.env.PORT || process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3000', 10)

console.log('🚀 Starting development server with live reload...\n')

// Start watch mode
console.log('📡 Starting watch mode...')
const watchProcess = spawn('bun', [WATCH_SCRIPT], {
    cwd: join(WEB_DIR, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        LIVE_RELOAD_SERVER: `http://localhost:${port}`
    }
})

// Give watch mode time to do initial build
await new Promise(resolve => setTimeout(resolve, 2000))

// Start server
console.log(`🌐 Starting server on port ${port}...`)
const serverProcess = spawn('bun', [SERVER_SCRIPT, port.toString()], {
    cwd: join(WEB_DIR, '..'),
    stdio: 'inherit',
    env: {
        ...process.env,
        NODE_ENV: 'development'
    }
})

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...')
    watchProcess.kill()
    serverProcess.kill()
    process.exit(0)
})

process.on('SIGTERM', () => {
    watchProcess.kill()
    serverProcess.kill()
    process.exit(0)
})

// Wait for processes
watchProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
        console.error(`Watch process exited with code ${code}`)
        serverProcess.kill()
        process.exit(code)
    }
})

serverProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
        console.error(`Server process exited with code ${code}`)
        watchProcess.kill()
        process.exit(code)
    }
})

