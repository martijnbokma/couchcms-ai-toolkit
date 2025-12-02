#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Web Server
 *
 * Browser-based setup interface using Hono + Nunjucks
 * Provides guided setup wizard for non-technical users
 */

import { Hono } from 'hono'
import nunjucks from 'nunjucks'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { setupRoutes } from './routes/setup.js'
import { apiRoutes } from './routes/api.js'
import { getToolkitRootCached } from '../lib/paths.js'

const TOOLKIT_ROOT = getToolkitRootCached()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure Nunjucks
const templatesPath = join(__dirname, 'templates')
const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(templatesPath, {
        noCache: process.env.NODE_ENV !== 'production',
        watch: false // Disable watch mode (requires chokidar)
    }),
    {
        autoescape: true,
        throwOnUndefined: false
    }
)

/**
 * Render Nunjucks template
 * @param {string} template - Template name (relative to templates directory)
 * @param {Object} context - Template context
 * @returns {Promise<string>} Rendered HTML
 */
export async function renderTemplate(template, context = {}) {
    return new Promise((resolve, reject) => {
        env.render(template, context, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })
}

// Make renderTemplate available globally for routes
global.renderTemplate = renderTemplate

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

    // Make renderTemplate available to route handlers via context
    app.use('*', async (c, next) => {
        c.renderTemplate = renderTemplate
        await next()
    })

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
 * Find an available port starting from the given port
 * @param {number} startPort - Starting port number
 * @param {number} maxAttempts - Maximum number of ports to try
 * @returns {Promise<number>} Available port number
 */
async function findAvailablePort(startPort, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i
        try {
            // Try to create a server on this port
            const testServer = Bun.serve({
                port,
                fetch: () => new Response('test'),
            })
            // If successful, stop it and return the port
            testServer.stop()
            return port
        } catch (error) {
            // Port is in use, try next one
            if (i === maxAttempts - 1) {
                throw new Error(`Could not find an available port starting from ${startPort}`)
            }
            continue
        }
    }
    throw new Error(`Could not find an available port starting from ${startPort}`)
}

/**
 * Start the web server
 * @param {Object} options - Server options
 * @param {number} options.port - Server port (default: 3000)
 * @param {string} options.projectDir - Project directory
 */
export async function startServer(options = {}) {
    const { port: requestedPort = 3000, projectDir = process.cwd() } = options

    const app = createApp({ projectDir })

    // Try to start server, find alternative port if needed
    let port = requestedPort
    let portChanged = false

    try {
        const server = Bun.serve({
            port,
            fetch: app.fetch,
        })

        console.log(`\n🚀 CouchCMS AI Toolkit - Web Setup Interface`)
        if (portChanged) {
            console.log(`📍 Port ${requestedPort} was in use, using port ${port} instead`)
        }
        console.log(`📍 Server running at: http://localhost:${port}`)
        console.log(`📂 Project directory: ${projectDir}`)
        console.log(`\n💡 Open your browser and navigate to: http://localhost:${port}\n`)
        console.log(`Press Ctrl+C to stop the server\n`)

        return server
    } catch (error) {
        // If port is in use, try to find an available port
        if (error.message.includes('address already in use') ||
            error.message.includes('EADDRINUSE') ||
            error.code === 'EADDRINUSE') {

            console.log(`⚠️  Port ${port} is already in use, trying to find an available port...`)

            try {
                port = await findAvailablePort(requestedPort)
                portChanged = true

                const server = Bun.serve({
                    port,
                    fetch: app.fetch,
                })

                console.log(`\n🚀 CouchCMS AI Toolkit - Web Setup Interface`)
                console.log(`📍 Port ${requestedPort} was in use, using port ${port} instead`)
                console.log(`📍 Server running at: http://localhost:${port}`)
                console.log(`📂 Project directory: ${projectDir}`)
                console.log(`\n💡 Open your browser and navigate to: http://localhost:${port}\n`)
                console.log(`Press Ctrl+C to stop the server\n`)

                return server
            } catch (findError) {
                throw new Error(`Failed to start server. Port ${requestedPort} is in use and could not find an available port. Try: bun toolkit serve --port=<different-port>`)
            }
        }
        throw error
    }
}

// Run server if executed directly
if (import.meta.main) {
    const port = parseInt(process.env.PORT || process.argv[2] || '3000', 10)
    startServer({ port }).catch(console.error)
}
