#!/usr/bin/env bun
/**
 * Setup Routes - Browser-based setup wizard
 * Uses Nunjucks templates with template inheritance
 */

import { Hono } from 'hono'

/**
 * Constants
 */
const DEFAULT_SETUP_TYPE = 'simple'

/**
 * Create setup routes
 * @param {string} projectDir - Project directory
 * @returns {Hono} Setup routes app
 */
export function setupRoutes(projectDir) {
    const app = new Hono()

    // Welcome page - choose between terminal and browser setup
    app.get('/', async (c) => {
        const html = await c.renderTemplate('setup/welcome.html')
        return c.html(html)
    })

    // Terminal setup info page
    app.get('/setup/terminal', async (c) => {
        const html = await c.renderTemplate('setup/terminal.html')
        return c.html(html)
    })

    // Main wizard interface
    app.get('/setup/wizard', async (c) => {
        const setupType = c.req.query('type') || DEFAULT_SETUP_TYPE
        const html = await c.renderTemplate('setup/wizard.html', { setupType })
        return c.html(html)
    })

    return app
}
