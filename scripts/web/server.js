#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Web Server
 *
 * Browser-based setup interface using Hono
 * Provides guided setup wizard for non-technical users
 */

import { Hono } from 'hono'
import { setupRoutes } from './routes/setup.js'
import { apiRoutes } from './routes/api.js'
import { getToolkitRootCached } from '../lib/paths.js'

const TOOLKIT_ROOT = getToolkitRootCached()

/**
 * Create and configure Hono app
 * @param {Object} options - Server options
 * @param {number} options.port - Server port
 * @param {string} options.projectDir - Project directory
 * @returns {Hono} Configured Hono app
 */
export function createApp(options = {}) {
    const { projectDir = process.cwd() } = options

    const app = new Hono()

    // Setup routes
    app.route('/', setupRoutes(projectDir))

    // API routes
    app.route('/api', apiRoutes(projectDir))

    // Health check
    app.get('/health', (c) => {
        return c.json({
            status: 'ok',
            toolkit: 'couchcms-ai-toolkit',
            version: '1.5.0'
        })
    })

    return app
}

/**
 * Start the web server
 * @param {Object} options - Server options
 * @param {number} options.port - Server port (default: 3000)
 * @param {string} options.projectDir - Project directory
 */
export async function startServer(options = {}) {
    const { port = 3000, projectDir = process.cwd() } = options

    const app = createApp({ projectDir })

    const server = Bun.serve({
        port,
        fetch: app.fetch,
    })

    console.log(`\n🚀 CouchCMS AI Toolkit - Web Setup Interface`)
    console.log(`📍 Server running at: http://localhost:${port}`)
    console.log(`📂 Project directory: ${projectDir}`)
    console.log(`\n💡 Open your browser and navigate to: http://localhost:${port}/setup\n`)
    console.log(`Press Ctrl+C to stop the server\n`)

    return server
}

// Run server if executed directly
if (import.meta.main) {
    const port = parseInt(process.env.PORT || process.argv[2] || '3000', 10)
    startServer({ port }).catch(console.error)
}
