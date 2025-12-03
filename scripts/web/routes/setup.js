#!/usr/bin/env bun
/**
 * Setup Routes - Browser-based setup wizard
 * Uses Nunjucks templates with template inheritance
 */

import { Hono } from 'hono'
import { SETUP_TYPES } from './helpers.js'

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
 * Query parameter names
 */
const QUERY_PARAMS = {
    SETUP_TYPE: 'type'
}

/**
 * Render a template and return HTML response
 * @param {Object} c - Hono context
 * @param {string} template - Template name
 * @param {Object} context - Template context
 * @returns {Promise<Response>} HTML response
 */
async function renderTemplateResponse(c, template, context = {}) {
    try {
        const html = await c.renderTemplate(template, context)
        return c.html(html)
    } catch (error) {
        console.error(`Error rendering template ${template}:`, error)
        return c.html(
            `<div class="alert alert-error">
                <p>Error loading page. Please try again.</p>
                ${process.env.NODE_ENV === 'development' ? `<pre>${error.message}</pre>` : ''}
            </div>`,
            500
        )
    }
}

/**
 * Get setup type from query parameters with validation
 * @param {Object} query - Query parameters
 * @returns {string} Validated setup type
 */
function getSetupTypeFromQuery(query) {
    const setupType = query[QUERY_PARAMS.SETUP_TYPE]

    // Validate setup type
    if (setupType === SETUP_TYPES.SIMPLE || setupType === SETUP_TYPES.EXTENDED) {
        return setupType
    }

    // Default to simple if invalid or missing
    return SETUP_TYPES.SIMPLE
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
