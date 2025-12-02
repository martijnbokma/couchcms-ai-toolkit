#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates
 */

import { Hono } from 'hono'
import { wrapStepWithProgress, getProgressIndicatorData } from './helpers.js'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents } from '../../lib/option-organizer.js'
import { selectFrontendFrameworks } from '../../lib/frontend-selector.js'

/**
 * Create API routes
 * @param {string} projectDir - Project directory
 * @returns {Hono} API routes app
 */
export function apiRoutes(projectDir) {
    const app = new Hono()

    // Get available modules
    app.get('/setup/modules', (c) => {
        const couchcmsModules = getCouchCMSModules()
        const frontendModules = ['tailwindcss', 'daisyui', 'alpinejs', 'typescript']

        return c.json({
            couchcms: couchcmsModules.map(name => ({
                name,
                description: getModuleDescription(name),
                required: true
            })),
            frontend: frontendModules.map(name => ({
                name,
                description: getModuleDescription(name),
                required: false
            }))
        })
    })

    // Get available agents
    app.get('/setup/agents', (c) => {
        const couchcmsAgents = getCouchCMSAgents()

        return c.json({
            couchcms: couchcmsAgents.map(name => ({
                name,
                description: getAgentDescription(name),
                required: true
            }))
        })
    })

    // Get step content (project info)
    app.get('/setup/step/project', async (c) => {
        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            {}
        )
        return c.html(html)
    })

    // Handle project info submission
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2,
            'steps/complexity.html',
            { projectName, projectDescription }
        )
        return c.html(html)
    })

    // Handle complexity selection
    app.post('/setup/step/complexity', async (c) => {
        const body = await c.req.parseBody()
        const complexity = body.complexity || 'easy'
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'

        // Show frontend selection based on complexity
        if (complexity === 'easy') {
            // Skip frontend selection, go to review
            return c.html(await getReviewStep(c.renderTemplate, projectName, projectDescription, complexity, {
                css: ['tailwindcss'],
                js: ['alpinejs']
            }))
        }

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3,
            'steps/frontend.html',
            { projectName, projectDescription, complexity }
        )
        return c.html(html)
    })

    // Handle frontend selection
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const complexity = body.complexity || 'easy'

        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])

        return c.html(await getReviewStep(c.renderTemplate, projectName, projectDescription, complexity, {
            css: cssFrameworks,
            js: jsFrameworks
        }))
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        const body = await c.req.parseBody()

        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const complexity = body.complexity || 'easy'

        // Parse CSS and JS arrays from form data
        let cssFrameworks = []
        let jsFrameworks = []

        if (body.css) {
            cssFrameworks = Array.isArray(body.css) ? body.css : [body.css]
        }
        if (body.js) {
            jsFrameworks = Array.isArray(body.js) ? body.js : [body.js]
        }

        try {
            // Import required modules
            const { checkAndInstallDependencies } = await import('../../lib/dependency-checker.js')
            const { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents } = await import('../../lib/option-organizer.js')
            const { detectToolkitPath } = await import('../../lib/toolkit-detector.js')
            const { determineConfigPath, generateStandardsFile } = await import('../../lib/config-generator.js')
            const { runInitialSync } = await import('../../lib/sync-runner.js')
            const { getToolkitRootCached } = await import('../../lib/paths.js')

            const TOOLKIT_ROOT = getToolkitRootCached()

            // Step 1: Ensure dependencies
            await checkAndInstallDependencies(TOOLKIT_ROOT)

            // Step 2: Build module and agent lists
            const couchcmsModules = getCouchCMSModules()
            const couchcmsAgents = getCouchCMSAgents()
            const frontendModules = [...cssFrameworks, ...jsFrameworks]
            const allModules = getCompleteModules(frontendModules)
            const allAgents = getCompleteAgents([], [])

            // Step 3: Detect toolkit path
            const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'

            // Step 4: Determine config path
            const { configPath, configDir } = await determineConfigPath(projectDir, complexity === 'easy')

            // Step 5: Generate standards.md
            await generateStandardsFile({
                projectDir,
                configPath,
                configDir,
                projectName,
                projectDescription,
                toolkitPath,
                toolkitRoot: TOOLKIT_ROOT,
                selectedModules: allModules,
                selectedAgents: allAgents,
                selectedEditors: [],
                frameworkConfig: false
            })

            // Step 6: Run initial sync
            await runInitialSync(projectDir, TOOLKIT_ROOT)

            // Update progress to show completion (all steps completed)
            const progressSteps = getProgressIndicatorData(4)
            const progressHtml = await c.renderTemplate('partials/progress-indicator.html', { steps: progressSteps })
            const successHtml = await c.renderTemplate('steps/success.html', {})
            return c.html(progressHtml + '\n' + successHtml)
        } catch (error) {
            const errorHtml = await c.renderTemplate('steps/error.html', { errorMessage: error.message })
            return c.html(errorHtml)
        }
    })

    return app
}

/**
 * Get review step HTML using Nunjucks template
 */
async function getReviewStep(renderTemplate, projectName, projectDescription, complexity, frontend) {
    const couchcmsModules = getCouchCMSModules()
    const couchcmsAgents = getCouchCMSAgents()

    return await wrapStepWithProgress(
        renderTemplate,
        4,
        'steps/review.html',
        {
            projectName,
            projectDescription,
            complexity,
            frontend,
            couchcmsModules,
            couchcmsAgents
        }
    )
}

/**
 * Get module description
 */
function getModuleDescription(name) {
    const descriptions = {
        'tailwindcss': 'Utility-first CSS framework',
        'daisyui': 'Component library for TailwindCSS',
        'alpinejs': 'Lightweight reactive JavaScript',
        'typescript': 'Type-safe JavaScript'
    }
    return descriptions[name] || 'CouchCMS module'
}

/**
 * Get agent description
 */
function getAgentDescription(name) {
    return `AI agent for ${name}`
}
