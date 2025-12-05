#!/usr/bin/env bun
/**
 * Setup Routes - Browser-based setup wizard
 * Uses Nunjucks templates with template inheritance
 */

import { Hono } from 'hono'
import { renderTemplateResponse, getSetupTypeFromQuery } from './helpers'
import type { HonoContext } from '../types'

/**
 * Route paths
 */
const ROUTES = {
    ROOT: '/',
    TERMINAL: '/setup/terminal',
    WIZARD: '/setup/wizard'
} as const

/**
 * Template names
 */
const TEMPLATES = {
    WELCOME: 'setup/welcome.html',
    TERMINAL: 'setup/terminal.html',
    WIZARD: 'setup/wizard.html'
} as const

/**
 * Create setup routes
 * @param projectDir - Project directory (for consistency with apiRoutes, reserved for future use)
 * @returns Setup routes app
 */
export function setupRoutes(projectDir: string): Hono {
    const app = new Hono()

    // Welcome page - choose between terminal and browser setup
    app.get(ROUTES.ROOT, async (c) => {
        return renderTemplateResponse(c as unknown as Parameters<typeof renderTemplateResponse>[0], TEMPLATES.WELCOME)
    })

    // Terminal setup info page
    app.get(ROUTES.TERMINAL, async (c) => {
        return renderTemplateResponse(c as unknown as Parameters<typeof renderTemplateResponse>[0], TEMPLATES.TERMINAL)
    })

    // Main wizard interface
    app.get(ROUTES.WIZARD, async (c) => {
        const setupType = getSetupTypeFromQuery(c.req.query() as Record<string, unknown>)
        return renderTemplateResponse(c as unknown as Parameters<typeof renderTemplateResponse>[0], TEMPLATES.WIZARD, { setupType })
    })

    return app
}
