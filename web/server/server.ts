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
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { setupRoutes } from './routes/setup'
import { apiRoutes } from './routes/api'
import { getToolkitRootCached } from '../../scripts/lib/paths.js'
import { createLiveReloadHandler, liveReloadManager, websocket } from './live-reload'

const TOOLKIT_ROOT = getToolkitRootCached()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure Nunjucks
const templatesPath = join(__dirname, '..', 'templates')
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
 * Server options
 */
export interface ServerOptions {
    port?: number
    projectDir?: string
}

/**
 * Render Nunjucks template
 * @param template - Template name (relative to templates directory)
 * @param context - Template context
 * @returns Rendered HTML
 */
export async function renderTemplate(
    template: string,
    context: Record<string, unknown> = {}
): Promise<string> {
    return new Promise((resolve, reject) => {
        env.render(template, context, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })
}

// Note: renderTemplate is made available via context in createApp middleware

/**
 * Create and configure Hono app
 * @param options - Server options
 * @returns Configured Hono app
 */
export function createApp(options: ServerOptions = {}): Hono {
    const { projectDir = process.cwd() } = options

    const app = new Hono()

    // Make renderTemplate available to route handlers via context
    app.use('*', async (c, next) => {
        ;(c as { renderTemplate: typeof renderTemplate }).renderTemplate = renderTemplate
        await next()
    })

    // Live reload WebSocket endpoint (enabled by default, disabled in production)
    // Enable live reload unless explicitly set to production
    const isProduction = process.env.NODE_ENV === 'production'
    if (!isProduction) {
        app.get('/_live-reload', createLiveReloadHandler())

        // Endpoint for triggering reload from watch script
        app.post('/_live-reload/trigger', async (c) => {
            const body = (await c.req.json().catch(() => ({}))) as { type?: string }
            const changeType = body.type || 'full'
            liveReloadManager.broadcastReload(changeType)
            return c.json({ success: true, clients: liveReloadManager.getClientCount() })
        })
    }

    // Serve static files from public directory
    const publicPath = join(__dirname, '..', 'public')
    app.get('/public/*', async (c) => {
        const filePath = c.req.path.replace('/public', '')
        const fullPath = join(publicPath, filePath)

        // Security: Ensure file is within public directory
        if (!fullPath.startsWith(publicPath)) {
            return c.text('Forbidden', 403)
        }

        // Check if file exists
        if (!existsSync(fullPath)) {
            return c.text('Not Found', 404)
        }

        try {
            const file = await readFile(fullPath)
            const ext = filePath.split('.').pop()?.toLowerCase()
            const contentType: Record<string, string> = {
                'js': 'application/javascript',
                'css': 'text/css',
                'html': 'text/html',
                'json': 'application/json',
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'svg': 'image/svg+xml',
                'ico': 'image/x-icon'
            }
            const mimeType = contentType[ext || ''] || 'application/octet-stream'

            return c.body(file, 200, {
                'Content-Type': mimeType
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error(`Error serving static file ${filePath}:`, errorMessage)
            return c.text('Internal Server Error', 500)
        }
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
 * Check if a port is available
 * @param port - Port number to check
 * @returns True if port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
    try {
        const server = Bun.serve({
            port,
            fetch: () => new Response('test'),
        })
        server.stop()
        return true
    } catch {
        return false
    }
}

/**
 * Find an available port starting from the given port
 * @param startPort - Starting port number
 * @param maxAttempts - Maximum number of ports to try
 * @returns Available port number
 */
async function findAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i
        if (await isPortAvailable(port)) {
            return port
        }
    }
    throw new Error(`Could not find an available port starting from ${startPort} (tried ${maxAttempts} ports)`)
}

/**
 * Start the web server
 * @param options - Server options
 */
export async function startServer(options: ServerOptions = {}): Promise<ReturnType<typeof Bun.serve>> {
    const { port: requestedPort = 3000, projectDir = process.cwd() } = options

    const app = createApp({ projectDir })

    // Check if requested port is available, find alternative if needed
    let port = requestedPort
    let portChanged = false

    if (!(await isPortAvailable(port))) {
        console.log(`⚠️  Port ${port} is already in use, trying to find an available port...`)
        try {
            port = await findAvailablePort(requestedPort)
            portChanged = true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to start server. Port ${requestedPort} is in use and could not find an available port. Try: bun toolkit serve --port=<different-port>. Error: ${errorMessage}`)
        }
    }

    // Start server on available port
    // Include websocket handler for live reload support
    const isProduction = process.env.NODE_ENV === 'production'
    const serverConfig: {
        port: number
        fetch: typeof app.fetch
        websocket?: typeof websocket
    } = {
        port,
        fetch: app.fetch,
    }

    // Only add websocket handler in development mode
    if (!isProduction) {
        serverConfig.websocket = websocket
    }

    const server = Bun.serve(serverConfig)

    console.log(`\n🚀 CouchCMS AI Toolkit - Web Setup Interface`)
    if (portChanged) {
        console.log(`📍 Port ${requestedPort} was in use, using port ${port} instead`)
    }
    console.log(`📍 Server running at: http://localhost:${port}`)
    console.log(`📂 Project directory: ${projectDir}`)
    if (process.env.NODE_ENV !== 'production') {
        console.log(`🔄 Live reload enabled`)
    }
    console.log(`\n💡 Open your browser and navigate to: http://localhost:${port}\n`)
    console.log(`Press Ctrl+C to stop the server\n`)

    return server
}

// Run server if executed directly
if (import.meta.main) {
    const port = parseInt(process.env.PORT || process.argv[2] || '3000', 10)
    startServer({ port }).catch(console.error)
}
