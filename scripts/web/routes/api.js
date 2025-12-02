#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates with new Simple/Extended flow
 */

import { Hono } from 'hono'
import { wrapStepWithProgress, getProgressIndicatorData, getPreviousStepRoute } from './helpers.js'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents, getMatchingAgents } from '../../lib/option-organizer.js'
import { getAvailableEditors } from '../../lib/prompts.js'
import { listAvailableModules, listAvailableAgents } from '../../lib/module-loader.js'
import { getToolkitRootCached } from '../../lib/paths.js'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

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
    // SIMPLE PATH FLOW
    // ============================================

    // Get step content (project info) - detects setupType from query
    app.get('/setup/step/project', async (c) => {
        const setupType = c.req.query('setupType') || 'simple'
        const projectName = c.req.query('projectName') || 'my-project'
        const projectDescription = c.req.query('projectDescription') || 'A CouchCMS web application'

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            { setupType, projectName, projectDescription }
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c) => {
        const query = c.req.query()
        const projectName = query.projectName || 'my-project'
        const projectDescription = query.projectDescription || 'A CouchCMS web application'

        // Parse array parameters (for state persistence)
        const css = []
        const js = []

        Object.keys(query).forEach(key => {
            if (key === 'css' || key.startsWith('css[')) {
                const value = query[key]
                if (value && !css.includes(value)) css.push(value)
            } else if (key === 'js' || key.startsWith('js[')) {
                const value = query[key]
                if (value && !js.includes(value)) js.push(value)
            }
        })

        // Create frontend options with selected state
        const frontendOptions = {
            css: [
                { id: 'tailwindcss', name: 'TailwindCSS', description: 'Utility-first CSS framework', selected: css.includes('tailwindcss') },
                { id: 'daisyui', name: 'daisyUI', description: 'Component library for TailwindCSS', selected: css.includes('daisyui') }
            ],
            js: [
                { id: 'alpinejs', name: 'Alpine.js', description: 'Lightweight reactive JavaScript', selected: js.includes('alpinejs') },
                { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript', selected: js.includes('typescript') }
            ]
        }

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2,
            'steps/frontend.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css, js },
                frontendOptions,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' }
                ]
            }
        )
        return c.html(html)
    })

    // GET route for editors step (for back navigation) - Handles both simple and extended paths
    app.get('/setup/step/editors', async (c) => {
        const query = c.req.query()
        const projectName = query.projectName || 'my-project'
        const projectDescription = query.projectDescription || 'A CouchCMS web application'
        const setupType = query.setupType || 'simple'

        // Parse array parameters
        const css = []
        const js = []
        const editors = []

        Object.keys(query).forEach(key => {
            if (key === 'css' || key.startsWith('css[')) {
                const value = query[key]
                if (value && !css.includes(value)) css.push(value)
            } else if (key === 'js' || key.startsWith('js[')) {
                const value = query[key]
                if (value && !js.includes(value)) js.push(value)
            } else if (key === 'editors' || key.startsWith('editors[')) {
                const value = query[key]
                if (value && !editors.includes(value)) editors.push(value)
            }
        })

        const editorsList = getAvailableEditors()
        const popularEditors = editorsList
            .filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
            .map(e => ({ ...e, selected: editors.includes(e.id) }))
        const otherEditors = editorsList
            .filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))
            .map(e => ({ ...e, selected: editors.includes(e.id) }))

        const stepNumber = setupType === 'simple' ? 2 : 3
        const hiddenFields = [
            { name: 'projectName', value: projectName },
            { name: 'projectDescription', value: projectDescription },
            { name: 'setupType', value: setupType }
        ]

        // Add frontend data to hidden fields if extended
        if (setupType === 'extended') {
            css.forEach(c => hiddenFields.push({ name: 'css', value: c }))
            js.forEach(j => hiddenFields.push({ name: 'js', value: j }))
        }

        // Add editors to hidden fields
        editors.forEach(ed => hiddenFields.push({ name: 'editors', value: ed }))

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            stepNumber,
            'steps/editors.html',
            {
                setupType,
                projectName,
                projectDescription,
                frontend: { css, js },
                editors, // Pass editors array for state persistence
                popularEditors,
                otherEditors,
                hiddenFields
            }
        )
        return c.html(html)
    })

    // GET route for advanced step (for back navigation)
    app.get('/setup/step/advanced', async (c) => {
        const query = c.req.query()
        const projectName = query.projectName || 'my-project'
        const projectDescription = query.projectDescription || 'A CouchCMS web application'

        // Parse array parameters - collect all values with same key
        const css = []
        const js = []
        const editors = []

        Object.keys(query).forEach(key => {
            if (key === 'css' || key.startsWith('css[')) {
                const value = query[key]
                if (value && !css.includes(value)) css.push(value)
            } else if (key === 'js' || key.startsWith('js[')) {
                const value = query[key]
                if (value && !js.includes(value)) js.push(value)
            } else if (key === 'editors' || key.startsWith('editors[')) {
                const value = query[key]
                if (value && !editors.includes(value)) editors.push(value)
            }
        })

        // Parse framework config from query params
        const framework = query.framework === 'true'
        const frameworkConfig = framework ? {
            enabled: true,
            doctrine: query.framework_doctrine === 'true',
            directives: query.framework_directives === 'true',
            playbooks: query.framework_playbooks === 'true',
            enhancements: query.framework_enhancements === 'true'
        } : false

        const contextDir = query.contextDir || '.project/ai'

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4,
            'steps/advanced.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css, js },
                editors,
                framework: frameworkConfig,
                contextDir,
                hiddenFields: [
                    { name: 'projectName', value: projectName },
                    { name: 'projectDescription', value: projectDescription },
                    { name: 'setupType', value: 'extended' },
                    ...css.map(c => ({ name: 'css', value: c })),
                    ...js.map(j => ({ name: 'js', value: j })),
                    ...editors.map(ed => ({ name: 'editors', value: ed }))
                ]
            }
        )
        return c.html(html)
    })

    // Handle project info submission - routes based on setupType
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'simple'

        // Route to next step based on setup type
        if (setupType === 'simple') {
            // Simple: project → editors
            const editors = getAvailableEditors()
            const popularEditors = editors
                .filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
                .map(e => ({ ...e, selected: e.id === 'cursor' })) // Default cursor selected
            const otherEditors = editors
                .filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))
                .map(e => ({ ...e, selected: false }))

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                2,
                'steps/editors.html',
                {
                    setupType: 'simple',
                    projectName,
                    projectDescription,
                    editors: [], // Empty on first load
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
            // Extended: project → frontend
            // Create frontend options with default selected state
            const frontendOptions = {
                css: [
                    { id: 'tailwindcss', name: 'TailwindCSS', description: 'Utility-first CSS framework', selected: true },
                    { id: 'daisyui', name: 'daisyUI', description: 'Component library for TailwindCSS', selected: false }
                ],
                js: [
                    { id: 'alpinejs', name: 'Alpine.js', description: 'Lightweight reactive JavaScript', selected: true },
                    { id: 'typescript', name: 'TypeScript', description: 'Type-safe JavaScript', selected: false }
                ]
            }

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                2,
                'steps/frontend.html',
                {
                    setupType: 'extended',
                    projectName,
                    projectDescription,
                    frontend: { css: ['tailwindcss'], js: ['alpinejs'] },
                    frontendOptions,
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
    // EXTENDED PATH FLOW
    // ============================================

    // Handle frontend selection (Uitgebreid pad)
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'extended'

        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')

        // Next: editors & tools (combined step)
        const editors = getAvailableEditors()
        const popularEditors = editors
            .filter(e => ['cursor', 'claude', 'copilot'].includes(e.id))
            .map(e => ({ ...e, selected: e.id === 'cursor' })) // Default cursor selected
        const otherEditors = editors
            .filter(e => !['cursor', 'claude', 'copilot'].includes(e.id))
            .map(e => ({ ...e, selected: false }))

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3,
            'steps/editors.html',
            {
                setupType: 'extended',
                projectName,
                projectDescription,
                frontend: { css: cssFrameworks, js: jsFrameworks },
                editors: [], // Empty on first load
                popularEditors,
                otherEditors,
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

    // Handle editors & tools selection (both paths)
    app.post('/setup/step/editors', async (c) => {
        const body = await c.req.parseBody()
        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'simple'

        const selectedEditors = parseArrayValue(body, 'editors')
        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')

        if (setupType === 'simple') {
            // Simple: editors → review
            return c.html(await getReviewStep(c.renderTemplate, {
                setupType: 'simple',
                projectName,
                projectDescription,
                editors: selectedEditors,
                frontend: { css: [], js: [] },
                framework: false,
                contextDir: '.project/ai'
            }))
        } else {
            // Extended: editors → advanced
            const cssFrameworks = parseArrayValue(body, 'css')
            const jsFrameworks = parseArrayValue(body, 'js')

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                4,
                'steps/advanced.html',
                {
                    setupType: 'extended',
                    projectName,
                    projectDescription,
                    frontend: { css: cssFrameworks, js: jsFrameworks },
                    editors: selectedEditors,
                    hiddenFields: [
                        { name: 'projectName', value: projectName },
                        { name: 'projectDescription', value: projectDescription },
                        { name: 'setupType', value: 'extended' },
                        ...cssFrameworks.map(css => ({ name: 'css', value: css })),
                        ...jsFrameworks.map(js => ({ name: 'js', value: js })),
                        ...selectedEditors.map(ed => ({ name: 'editors', value: ed }))
                    ]
                }
            )
            return c.html(html)
        }
    })

    // Handle advanced options (Extended path only)
    app.post('/setup/step/advanced', async (c) => {
        try {
        const body = await c.req.parseBody()
            const projectName = body.projectName || 'my-project'
            const projectDescription = body.projectDescription || 'A CouchCMS web application'

        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')
        const editors = parseArrayValue(body, 'editors')
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
            editors,
            framework: frameworkConfig,
            contextDir
        }))
        } catch (error) {
            console.error('Error in /setup/step/advanced:', error)
            return c.html(`<div class="alert alert-error"><p>Error: ${error.message}</p></div>`, 500)
        }
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        const body = await c.req.parseBody()

        const projectName = body.projectName || 'my-project'
        const projectDescription = body.projectDescription || 'A CouchCMS web application'
        const setupType = body.setupType || 'simple'

        // Parse arrays from form data
        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')
        const editors = parseArrayValue(body, 'editors')

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

            // Combine all agents: CouchCMS + frontend
            const allAgents = getCompleteAgents(frontendAgents, [])

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
            const finalStep = setupType === 'simple' ? 3 : 5
            const progressData = getProgressIndicatorData(finalStep, setupType)
            const progressHtml = await c.renderTemplate('partials/progress-indicator.html', progressData)
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
 * Parse array values from form body
 * Handles both array format and multiple inputs with same name
 * Hono's parseBody() may return arrays or single values depending on form structure
 */
function parseArrayValue(body, key) {
    // Check if it's already an array
    if (Array.isArray(body[key])) {
        return body[key].filter(v => v != null && v !== '')
    }

    // Check if it's a single value
    if (body[key] != null && body[key] !== '') {
        return [body[key]]
    }

    // Collect all values with this key (handles multiple inputs with same name)
    // Also handles keys like 'css[0]', 'css[1]', etc.
    const values = []
    for (const [k, v] of Object.entries(body)) {
        if (k === key) {
            if (v != null && v !== '' && !values.includes(v)) {
                values.push(v)
            }
        } else if (k.startsWith(`${key}[`) || k.startsWith(`${key}.`)) {
            if (v != null && v !== '' && !values.includes(v)) {
                values.push(v)
            }
        }
    }

    return values
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
        editors = [],
        framework = false,
        contextDir = '.project/ai'
    } = data

    // Get CouchCMS modules/agents directly from toolkit directory
    // (standards.md doesn't exist yet during setup wizard)
    const toolkitPath = getToolkitRootCached()

    // Try to get from toolkit directory first
    let couchcmsModules = []
    let couchcmsAgents = []

    try {
        const frontendModuleNames = ['tailwindcss', 'daisyui', 'alpinejs', 'typescript']
        const frontendAgentNames = ['tailwindcss', 'alpinejs', 'typescript']

        // Scan modules/core/ directory (CouchCMS modules)
        const coreModulesDir = join(toolkitPath, 'modules', 'core')
        if (existsSync(coreModulesDir)) {
            const files = readdirSync(coreModulesDir)
            for (const file of files) {
                if (file.endsWith('.md') && !file.includes('README')) {
                    const moduleName = file.replace('.md', '')
                    if (!frontendModuleNames.includes(moduleName)) {
                        couchcmsModules.push(moduleName)
                    }
                }
            }
        }

        // Scan agents/core/ directory (CouchCMS agents)
        const coreAgentsDir = join(toolkitPath, 'agents', 'core')
        if (existsSync(coreAgentsDir)) {
            const files = readdirSync(coreAgentsDir)
            for (const file of files) {
                if (file.endsWith('.md') && !file.includes('README')) {
                    const agentName = file.replace('.md', '')
                    if (!frontendAgentNames.includes(agentName)) {
                        couchcmsAgents.push(agentName)
                    }
                }
            }
        }

        // Also check legacy flat structure for modules if core/ is empty
        if (couchcmsModules.length === 0) {
            const legacyModulesDir = join(toolkitPath, 'modules')
            if (existsSync(legacyModulesDir)) {
                const entries = readdirSync(legacyModulesDir)
                for (const entry of entries) {
                    const fullPath = join(legacyModulesDir, entry)
                    try {
                        const stat = statSync(fullPath)
                        if (stat.isFile() && entry.endsWith('.md') && !entry.includes('README')) {
                            const moduleName = entry.replace('.md', '')
                            if (!frontendModuleNames.includes(moduleName)) {
                                couchcmsModules.push(moduleName)
                            }
                        }
                    } catch (e) {
                        // Skip if we can't stat the file
                    }
                }
            }
        }

        // Also check legacy flat structure for agents if core/ is empty
        if (couchcmsAgents.length === 0) {
            const legacyAgentsDir = join(toolkitPath, 'agents')
            if (existsSync(legacyAgentsDir)) {
                const entries = readdirSync(legacyAgentsDir)
                for (const entry of entries) {
                    const fullPath = join(legacyAgentsDir, entry)
                    try {
                        const stat = statSync(fullPath)
                        if (stat.isFile() && entry.endsWith('.md') && !entry.includes('README')) {
                            const agentName = entry.replace('.md', '')
                            if (!frontendAgentNames.includes(agentName)) {
                                couchcmsAgents.push(agentName)
                            }
                        }
                    } catch (e) {
                        // Skip if we can't stat the file
                    }
                }
            }
        }

        // Sort and remove duplicates
        couchcmsModules = [...new Set(couchcmsModules)].sort()
        couchcmsAgents = [...new Set(couchcmsAgents)].sort()
    } catch (error) {
        console.warn(`⚠️  Failed to scan toolkit directory: ${error.message}`)
    }

    // Always fallback to hardcoded values if scanning found nothing
    // This ensures we always have something to show
    if (couchcmsModules.length === 0) {
        const fallbackModules = getCouchCMSModules()
        if (fallbackModules.length > 0) {
            couchcmsModules = fallbackModules
        }
    }
    if (couchcmsAgents.length === 0) {
        const fallbackAgents = getCouchCMSAgents()
        if (fallbackAgents.length > 0) {
            couchcmsAgents = fallbackAgents
        }
    }

    const finalStep = setupType === 'simple' ? 3 : 5

    return await wrapStepWithProgress(
        renderTemplate,
        finalStep,
        'steps/review.html',
        {
            setupType,
            projectName,
            projectDescription,
            frontend,
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
