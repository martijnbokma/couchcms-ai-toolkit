#!/usr/bin/env bun
/**
 * Setup Routes - Browser-based setup wizard
 * Uses Nunjucks templates with template inheritance
 */

import { Hono } from 'hono'
import { renderTemplateResponse, getSetupTypeFromQuery } from './helpers.js'

/**
 * Route paths
 */
const ROUTES = {
    ROOT: '/',
    TERMINAL: '/setup/terminal',
    WIZARD: '/setup/wizard'
}

/**
 * Template names
 */
const TEMPLATES = {
    WELCOME: 'setup/welcome.html',
    TERMINAL: 'setup/terminal.html',
    WIZARD: 'setup/wizard.html'
}

/**
 * Create setup routes
 * @param {string} projectDir - Project directory (for consistency with apiRoutes, reserved for future use)
 * @returns {Hono} Setup routes app
 */
export function setupRoutes(projectDir) {
    const app = new Hono()

    // Welcome page - choose between terminal and browser setup
    app.get(ROUTES.ROOT, async (c) => {
        return renderTemplateResponse(c, TEMPLATES.WELCOME)
    })

    // Terminal setup info page
    app.get(ROUTES.TERMINAL, async (c) => {
        return renderTemplateResponse(c, TEMPLATES.TERMINAL)
    })

    // Main wizard interface
    app.get(ROUTES.WIZARD, async (c) => {
        const setupType = getSetupTypeFromQuery(c.req.query())
        return renderTemplateResponse(c, TEMPLATES.WIZARD, { setupType })
    })

    return app
}
