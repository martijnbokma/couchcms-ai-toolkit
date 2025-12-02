#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates with new Simpel/Uitgebreid flow
 */

import { Hono } from 'hono'
import { wrapStepWithProgress, getProgressIndicatorData, getPreviousStepRoute } from './helpers.js'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents, getMatchingAgents, getDevToolAgents } from '../../lib/option-organizer.js'
import { getAvailableEditors } from '../../lib/prompts.js'

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

    // ============================================
    // SIMPEL PAD FLOW
    // ============================================

    // Get step content (project info) - detects setupType from query
    app.get('/setup/step/project', async (c) => {
        const setupType = c.req.query('setupType') || 'simple'
        const projectName = c.req.query('projectName') || 'mijn-project'
        const projectDescription = c.req.query('projectDescription') || 'Een CouchCMS web applicatie'

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            { setupType, projectName, projectDescription }
        )
        return c.html(html)
    })

    // GET route for editors step (for back navigation)
    app.get('/setup/step/editors', async (c) => {
        const setupType = c.req.query('setupType') || 'simple'
        const projectName = c.req.query('projectName') || 'mijn-project'
        const projectDescription = c.req.query('projectDescription') || 'Een CouchCMS web applicatie'

        const editors = getAvailableEditors()
        const popularEditors = editors.filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
        const otherEditors = editors.filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))

        const stepNumber = setupType === 'simple' ? 2 : 4
        const html = await wrapStepWithProgress(
            c.renderTemplate,
            stepNumber,
            'steps/editors.html',
            {
                setupType,
                projectName,
                projectDescription,
                popularEditors,
                otherEditors,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: setupType }
                ]
            }
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c) => {
        const projectName = c.req.query('projectName') || 'mijn-project'
        const projectDescription = c.req.query('projectDescription') || 'Een CouchCMS web applicatie'

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2,
            'steps/frontend.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' }
                ]
            }
        )
        return c.html(html)
    })

    // GET route for devtools step (for back navigation)
    app.get('/setup/step/devtools', async (c) => {
        const projectName = c.req.query('projectName') || 'mijn-project'
        const projectDescription = c.req.query('projectDescription') || 'Een CouchCMS web applicatie'
        const css = c.req.query('css') ? (Array.isArray(c.req.query('css')) ? c.req.query('css') : [c.req.query('css')]) : []
        const js = c.req.query('js') ? (Array.isArray(c.req.query('js')) ? c.req.query('js') : [c.req.query('js')]) : []

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3,
            'steps/devtools.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css, js },
                devTools: getDevToolAgents().map(tool => ({
                    id: tool.name,
                    name: tool.name.charAt(0).toUpperCase() + tool.name.slice(1).replace(/-/g, ' '),
                    description: tool.description
                })),
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' },
                    ...css.map(c => ({ name: 'css', value: c })),
                    ...js.map(j => ({ name: 'js', value: j }))
                ]
            }
        )
        return c.html(html)
    })

    // GET route for advanced step (for back navigation)
    app.get('/setup/step/advanced', async (c) => {
        const query = c.req.query()
        const projectName = query.projectName || 'mijn-project'
        const projectDescription = query.projectDescription || 'Een CouchCMS web applicatie'

        // Parse array parameters
        const css = []
        const js = []
        const devTools = []
        const editors = []

        Object.keys(query).forEach(key => {
            if (key.startsWith('css[') || key === 'css') css.push(query[key])
            else if (key.startsWith('js[') || key === 'js') js.push(query[key])
            else if (key.startsWith('devtools[') || key === 'devtools') devTools.push(query[key])
            else if (key.startsWith('editors[') || key === 'editors') editors.push(query[key])
        })

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            5,
            'steps/advanced.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css, js },
                devTools,
                editors,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' },
                    ...css.map(c => ({ name: 'css', value: c })),
                    ...js.map(j => ({ name: 'js', value: j })),
                    ...devTools.map(dt => ({ name: 'devtools', value: dt })),
                    ...editors.map(ed => ({ name: 'editors', value: ed }))
                ]
            }
        )
        return c.html(html)
    })

    // Handle project info submission - routes based on setupType
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'mijn-project'
        const projectDescription = body.projectDescription || 'Een CouchCMS web applicatie'
        const setupType = body.setupType || 'simple'

        // Route to next step based on setup type
        if (setupType === 'simple') {
            // Simpel: project → editors
            const editors = getAvailableEditors()
            const popularEditors = editors.filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
            const otherEditors = editors.filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                2,
                'steps/editors.html',
                {
                    setupType: 'simple',
                    projectName,
                    projectDescription,
                    popularEditors,
                    otherEditors,
                    hiddenFields: [
                        { name: 'projectName', value: projectName },
                        { name: 'projectDescription', value: projectDescription },
                        { name: 'setupType', value: 'simple' }
                    ]
                }
            )
            return c.html(html)
        } else {
            // Uitgebreid: project → frontend
            const html = await wrapStepWithProgress(
                c.renderTemplate,
                2,
                'steps/frontend.html',
                {
                    setupType: 'extended',
                    projectName,
                    projectDescription,
                    hiddenFields: [
                        { name: 'projectName', value: projectName },
                        { name: 'projectDescription', value: projectDescription },
                        { name: 'setupType', value: 'extended' }
                    ]
                }
            )
            return c.html(html)
        }
    })

    // ============================================
    // UITGEBREID PAD FLOW
    // ============================================

    // Handle frontend selection (Uitgebreid pad)
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'extended'

        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])

        // Next: devtools
        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3,
            'steps/devtools.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css: cssFrameworks, js: jsFrameworks },
                devTools: getDevToolAgents().map(tool => ({
                    id: tool.name,
                    name: tool.name.charAt(0).toUpperCase() + tool.name.slice(1).replace(/-/g, ' '),
                    description: tool.description
                })),
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' },
                    ...cssFrameworks.map(css => ({ name: 'css', value: css })),
                    ...jsFrameworks.map(js => ({ name: 'js', value: js }))
                ]
            }
        )
        return c.html(html)
    })

    // Handle devtools selection (Uitgebreid pad)
    app.post('/setup/step/devtools', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'mijn-project'
        const projectDescription = body.projectDescription || 'Een CouchCMS web applicatie'
        const setupType = body.setupType || 'extended'

        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])
        const devTools = Array.isArray(body.devtools) ? body.devtools : (body.devtools ? [body.devtools] : [])

        // Next: editors
        const editors = getAvailableEditors()
        const popularEditors = editors.filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
        const otherEditors = editors.filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4,
            'steps/editors.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css: cssFrameworks, js: jsFrameworks },
                devTools,
                popularEditors,
                otherEditors,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' },
                    ...cssFrameworks.map(css => ({ name: 'css', value: css })),
                    ...jsFrameworks.map(js => ({ name: 'js', value: js })),
                    ...devTools.map(dt => ({ name: 'devtools', value: dt }))
                ]
            }
        )
        return c.html(html)
    })

    // Handle editors selection (both paths)
    app.post('/setup/step/editors', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'simple'

        const selectedEditors = Array.isArray(body.editors) ? body.editors : (body.editors ? [body.editors] : [])

        if (setupType === 'simple') {
            // Simpel: editors → review
            return c.html(await getReviewStep(c.renderTemplate, {
                setupType: 'simple',
                projectName,
                projectDescription,
                editors: selectedEditors,
                frontend: { css: [], js: [] },
                devTools: [],
                framework: false,
                contextDir: '.project/ai'
            }))
        } else {
            // Uitgebreid: editors → advanced
            const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
            const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])
            const devTools = Array.isArray(body.devtools) ? body.devtools : (body.devtools ? [body.devtools] : [])

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                5,
                'steps/advanced.html',
                {
                    setupType: 'extended',
                    projectName,
                    projectDescription,
                    frontend: { css: cssFrameworks, js: jsFrameworks },
                    devTools,
                    editors: selectedEditors,
                    hiddenFields: [
                        { name: 'projectName', value: projectName },
                        { name: 'projectDescription', value: projectDescription },
                        { name: 'setupType', value: 'extended' },
                        ...cssFrameworks.map(css => ({ name: 'css', value: css })),
                        ...jsFrameworks.map(js => ({ name: 'js', value: js })),
                        ...devTools.map(dt => ({ name: 'devtools', value: dt })),
                        ...selectedEditors.map(ed => ({ name: 'editors', value: ed }))
                    ]
                }
            )
            return c.html(html)
        }
    })

    // Handle advanced options (Uitgebreid pad only)
    app.post('/setup/step/advanced', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'mijn-project'
        const projectDescription = body.projectDescription || 'Een CouchCMS web applicatie'

        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])
        const devTools = Array.isArray(body.devtools) ? body.devtools : (body.devtools ? [body.devtools] : [])
        const editors = Array.isArray(body.editors) ? body.editors : (body.editors ? [body.editors] : [])
        const framework = body.framework === 'true'
        const frameworkDoctrine = body.framework_doctrine === 'true'
        const frameworkDirectives = body.framework_directives === 'true'
        const frameworkPlaybooks = body.framework_playbooks === 'true'
        const frameworkEnhancements = body.framework_enhancements === 'true'
        const contextDir = body.contextDir || '.project/ai'

        const frameworkConfig = framework ? {
            enabled: true,
            doctrine: frameworkDoctrine,
            directives: frameworkDirectives,
            playbooks: frameworkPlaybooks,
            enhancements: frameworkEnhancements
        } : false

        // Next: review
        return c.html(await getReviewStep(c.renderTemplate, {
            setupType: 'extended',
            projectName,
            projectDescription,
            frontend: { css: cssFrameworks, js: jsFrameworks },
            devTools,
            editors,
            framework: frameworkConfig,
            contextDir
        }))
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        const body = await c.req.parseBody()

        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'simple'

        // Parse arrays from form data
        const cssFrameworks = Array.isArray(body.css) ? body.css : (body.css ? [body.css] : [])
        const jsFrameworks = Array.isArray(body.js) ? body.js : (body.js ? [body.js] : [])
        const devTools = Array.isArray(body.devtools) ? body.devtools : (body.devtools ? [body.devtools] : [])
        const editors = Array.isArray(body.editors) ? body.editors : (body.editors ? [body.editors] : [])

        // Parse framework config
        let frameworkConfig = false
        if (body.framework === 'true') {
            frameworkConfig = {
                doctrine: body.framework_doctrine === 'true',
                directives: body.framework_directives === 'true',
                playbooks: body.framework_playbooks === 'true',
                enhancements: body.framework_enhancements === 'true'
            }
        }

        const contextDir = body.contextDir || '.project/ai'

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

            // Get matching frontend agents for selected modules
            const frontendAgents = getMatchingAgents(frontendModules)

            // Combine all agents: CouchCMS + frontend + devtools
            const allAgents = getCompleteAgents(frontendAgents, devTools)

            // Step 3: Detect toolkit path
            const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'

            // Step 4: Determine config path
            const { configPath, configDir } = await determineConfigPath(projectDir, setupType === 'simple')

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
                selectedEditors: editors,
                frameworkConfig: frameworkConfig
            })

            // Step 6: Run initial sync
            await runInitialSync(projectDir, TOOLKIT_ROOT)

            // Update progress to show completion
            const finalStep = setupType === 'simple' ? 3 : 6
            const progressSteps = getProgressIndicatorData(finalStep, setupType)
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
async function getReviewStep(renderTemplate, data) {
    const {
        setupType,
        projectName,
        projectDescription,
        frontend = { css: [], js: [] },
        devTools = [],
        editors = [],
        framework = false,
        contextDir = '.project/ai'
    } = data

    const couchcmsModules = getCouchCMSModules()
    const couchcmsAgents = getCouchCMSAgents()

    const finalStep = setupType === 'simple' ? 3 : 6

    return await wrapStepWithProgress(
        renderTemplate,
        finalStep,
        'steps/review.html',
        {
            setupType,
            projectName,
            projectDescription,
            frontend,
            devTools,
            editors,
            framework,
            contextDir,
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
