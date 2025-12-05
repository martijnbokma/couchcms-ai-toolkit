#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates with new Simple/Extended flow
 *
 * Refactored to use extracted modules for better maintainability
 */

import { Hono } from 'hono'
import type { HonoContext } from '../types'
import {
    wrapStepWithProgress,
    getProgressIndicatorData,
    SETUP_TYPES,
    type SetupType,
    type RenderTemplateFunction
} from './helpers'
import {
    normalizeEditorsArray,
    parseQueryParams
} from './utils'
import {
    getCouchCMSModules,
    getCouchCMSAgents,
    getCompleteModules,
    getCompleteAgents,
    getMatchingAgents
} from '../../../scripts/lib/option-organizer.js'
import { getToolkitRootCached } from '../../../scripts/lib/paths.js'
import { debug } from '../../../scripts/lib/logger.js'
import { getPreset } from '../../../scripts/lib/presets-loader.js'

// Import extracted modules
import {
    parseFormData,
    createHiddenFields,
    normalizeProjectFields,
    normalizeBodyData,
    DEFAULT_PROJECT_NAME,
    DEFAULT_PROJECT_DESCRIPTION,
    DEFAULT_SETUP_TYPE,
    DEFAULT_CONTEXT_DIR
} from './data-processor'
import {
    loadModuleMetadata,
    loadAgentMetadata,
    groupByCategory,
    getCouchCMSItemsFromToolkit,
    scanMarkdownFiles
} from './metadata-loader'
import {
    renderSimpleEditorsStep,
    renderPresetsStep,
    renderExtendedFrontendStep,
    getReviewStep
} from './template-renderers'
import {
    createFrontendOptions,
    createAgentOptions,
    getEditorsGrouped,
    getModuleDescription,
    getAgentDescription,
    FRONTEND_MODULES,
    POPULAR_EDITOR_IDS,
    DEFAULT_SELECTED_EDITOR
} from './option-builders'
import type { FormData, ProjectConfig, FrameworkConfig } from '../types'

/**
 * Create API routes
 * @param projectDir - Project directory
 * @returns API routes app
 */
export function apiRoutes(projectDir: string): Hono {
    const app = new Hono()

    // Get available modules
    app.get('/setup/modules', (c) => {
        const couchcmsModules = getCouchCMSModules()
        const frontendModules = [...FRONTEND_MODULES.CSS, ...FRONTEND_MODULES.JS]

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

    // Get module details
    app.get('/setup/module/:name', (c) => {
        const { name } = c.req.param()
        const toolkitPath = getToolkitRootCached()
        const metadata = loadModuleMetadata(name, toolkitPath)

        if (!metadata || !metadata.name) {
            return c.json({ error: 'Module not found' }, 404)
        }

        return c.json(metadata)
    })

    // Get agent details
    app.get('/setup/agent/:name', (c) => {
        const { name } = c.req.param()
        const toolkitPath = getToolkitRootCached()
        const metadata = loadAgentMetadata(name, toolkitPath)

        if (!metadata || !metadata.name) {
            return c.json({ error: 'Agent not found' }, 404)
        }

        return c.json(metadata)
    })

    // Get all enriched items (all core modules and agents)
    app.get('/setup/couchcms-items', (c) => {
        const toolkitPath = getToolkitRootCached()
        const { couchcmsModules, couchcmsAgents } = getCouchCMSItemsFromToolkit(true, FRONTEND_MODULES) // allCore = true

        const enrichedModules = couchcmsModules.map(name => {
            const metadata = loadModuleMetadata(name, toolkitPath)
            return { name, ...metadata }
        })

        const enrichedAgents = couchcmsAgents.map(name => {
            const metadata = loadAgentMetadata(name, toolkitPath)
            return { name, ...metadata }
        })

        return c.json({
            modules: enrichedModules,
            agents: enrichedAgents,
            modulesByCategory: groupByCategory(enrichedModules),
            agentsByCategory: groupByCategory(enrichedAgents)
        })
    })

    // ============================================
    // SIMPLE PATH FLOW
    // ============================================

    // Get step content (project info) - detects setupType from query
    app.get('/setup/step/project', async (c: HonoContext) => {
        const queryParams = parseQueryParams(c.req.url)
        debug('[Project GET] Query params:', Object.keys(queryParams))
        debug('[Project GET] CSS from query:', queryParams.css)
        debug('[Project GET] JS from query:', queryParams.js)
        debug('[Project GET] Editors from query:', queryParams.editors)

        const formData = parseFormData(queryParams)

        debug('[Project GET] Parsed formData:', {
            css: formData.css,
            js: formData.js,
            editors: formData.editors,
            setupType: formData.setupType
        })

        // CRITICAL: Ensure projectName and projectDescription are always single values (no comma-separated duplicates)
        // This prevents displaying "my-project,my-project,my-projecttest" in the input field
        const normalizedFormData = normalizeProjectFields(formData)

        const hiddenFields = createHiddenFields(normalizedFormData, { excludeProjectFields: true })
        debug('[Project GET] Hidden fields created:', hiddenFields.map(f => ({ name: f.name, value: f.value })))

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            {
                ...normalizedFormData,
                // CRITICAL: Exclude projectName and projectDescription from hidden fields
                // because they have visible inputs on this step - prevents duplication
                hiddenFields
            }
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c: HonoContext) => {
        const queryParams = parseQueryParams(c.req.url)
        debug('[Frontend GET] Query params:', Object.keys(queryParams))
        debug('[Frontend GET] CSS from query:', queryParams.css)
        debug('[Frontend GET] JS from query:', queryParams.js)

        const formData = parseFormData(queryParams, { setupType: SETUP_TYPES.EXTENDED })

        debug('[Frontend GET] Parsed formData:', {
            css: formData.css,
            js: formData.js,
            setupType: formData.setupType
        })

        const frontendOptions = createFrontendOptions(formData.css, formData.js)
        debug('[Frontend GET] Frontend options:', {
            css: frontendOptions.css.map(o => ({ id: o.id, selected: o.selected })),
            js: frontendOptions.js.map(o => ({ id: o.id, selected: o.selected }))
        })

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3, // Step 3 for Extended flow (Project → Presets → Frontend)
            'steps/frontend.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                frontendOptions,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // GET route for editors step (for back navigation) - Handles both simple and extended paths
    app.get('/setup/step/editors', async (c: HonoContext) => {
        const formData = parseFormData(c.req.query() as Record<string, unknown>)

        // CRITICAL: Ensure editors array is normalized and has unique values
        // This handles cases where editors come from query params as arrays or comma-separated strings
        const normalizedEditors = normalizeEditorsArray(formData.editors)
        debug('[Editors GET] Query editors:', formData.editors)
        debug('[Editors GET] Normalized editors:', normalizedEditors)

        const { popular: popularEditors, other: otherEditors } = getEditorsGrouped(normalizedEditors)
        const stepNumber = formData.setupType === SETUP_TYPES.SIMPLE ? 2 : 5

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            stepNumber,
            'steps/editors.html',
            {
                ...formData,
                editors: normalizedEditors,  // Use normalized editors
                frontend: { css: formData.css, js: formData.js },
                popularEditors,
                otherEditors,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // GET route for presets step (Extended flow only - redirect Simple to editors)
    app.get('/setup/step/presets', async (c: HonoContext) => {
        // CRITICAL: Parse query params manually to handle multiple values with same name
        // Hono's c.req.query() may not handle multiple values correctly
        const queryParams = parseQueryParams(c.req.url)

        debug('[Presets GET] Query params:', Object.keys(queryParams))
        debug('[Presets GET] CSS from query:', queryParams.css)
        debug('[Presets GET] JS from query:', queryParams.js)
        debug('[Presets GET] Editors from query:', queryParams.editors)

        const formData = parseFormData(queryParams)

        debug('[Presets GET] Parsed formData:', {
            css: formData.css,
            js: formData.js,
            editors: formData.editors,
            setupType: formData.setupType
        })

        // Simple setup should not access presets - redirect to editors
        if (formData.setupType === SETUP_TYPES.SIMPLE) {
            return c.html(await renderSimpleEditorsStep(c.renderTemplate, formData))
        }

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2, // Step 2 for Extended flow
            'steps/presets.html',
            {
                setupType: formData.setupType,
                ...formData,
                preset: formData.preset || '',
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // GET route for advanced step (for back navigation)
    app.get('/setup/step/advanced', async (c: HonoContext) => {
        const queryParams = parseQueryParams(c.req.url)
        const formData = parseFormData(queryParams, { setupType: SETUP_TYPES.EXTENDED })

        debug('[Advanced GET] Query params:', Object.keys(queryParams))
        debug('[Advanced GET] Editors from query:', formData.editors)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            6, // Step 6: Advanced
            'steps/advanced.html',
            {
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                framework: formData.framework,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // Handle project info submission - routes based on setupType
    app.post('/setup/step/project', async (c: HonoContext) => {
        const body = await c.req.parseBody({ all: true })
        // CRITICAL: Normalize projectName and projectDescription to prevent duplication
        // When both visible input and hidden fields exist, parseBody creates arrays
        const normalizedBody = normalizeBodyData(body as Record<string, unknown>)
        const formData = parseFormData(normalizedBody)
        debug('[Project POST] Form data:', {
            setupType: formData.setupType,
            projectName: formData.projectName,
            projectDescription: formData.projectDescription
        })

        // Route based on setup type
        try {
            if (formData.setupType === SETUP_TYPES.SIMPLE) {
                // Simple: Project → Editors (skip presets)
                return c.html(await renderSimpleEditorsStep(c.renderTemplate, formData))
            } else {
                // Extended: Project → Presets
                const html = await renderPresetsStep(c.renderTemplate, formData)
                debug('[Project POST] Successfully rendered presets step')
                return c.html(html)
            }
        } catch (error) {
            console.error('[Project POST] Error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to load next step'
            return c.html(`<div class="alert alert-error"><p>Error: ${errorMessage}</p></div>`, 500)
        }
    })

    // ============================================
    // EXTENDED PATH FLOW
    // ============================================

    // Handle frontend selection (Extended path)
    app.post('/setup/step/frontend', async (c: HonoContext) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body as Record<string, unknown>, { setupType: SETUP_TYPES.EXTENDED })

        // Next: agents step
        const selectedFrontend = [...(formData.css || []), ...(formData.js || [])]
        const agentOptions = createAgentOptions([], selectedFrontend)
        const recommendedAgents = getMatchingAgents(selectedFrontend)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4, // Step 4: Agents
            'steps/agents.html',
            {
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                agentOptions,
                recommendedAgents,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // GET route for agents step (for back navigation)
    app.get('/setup/step/agents', async (c) => {
        const queryParams = parseQueryParams(c.req.url)
        const formData = parseFormData(queryParams, { setupType: SETUP_TYPES.EXTENDED })

        const selectedFrontend = [...(formData.css || []), ...(formData.js || [])]
        const agentOptions = createAgentOptions(formData.agents || [], selectedFrontend)
        const recommendedAgents = getMatchingAgents(selectedFrontend)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4, // Step 4: Agents
            'steps/agents.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                agentOptions,
                recommendedAgents,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // Handle agents selection (Extended path)
    app.post('/setup/step/agents', async (c: HonoContext) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body as Record<string, unknown>, { setupType: SETUP_TYPES.EXTENDED })

        // Next: editors & tools (combined step)
        const { popular: popularEditors, other: otherEditors } = getEditorsGrouped([])
        // Default cursor selected
        popularEditors.forEach(e => {
            if (e.id === DEFAULT_SELECTED_EDITOR) {
                e.selected = true
            }
        })

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            5, // Step 5: Editors (was step 4)
            'steps/editors.html',
            {
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                agents: formData.agents || [],
                popularEditors,
                otherEditors,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // Handle editors & tools selection (both paths)
    app.post('/setup/step/editors', async (c: HonoContext) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body as Record<string, unknown>)

        if (formData.setupType === SETUP_TYPES.SIMPLE) {
            // Simple: editors → review
            return c.html(await getReviewStep(c.renderTemplate, {
                ...formData,
                frontend: { css: [], js: [] },
                framework: false,
                contextDir: DEFAULT_CONTEXT_DIR,
                preset: formData.preset || '',
                presetData: null
            }))
        } else {
            // Extended: editors → advanced
            const html = await wrapStepWithProgress(
                c.renderTemplate,
                6, // Step 6: Advanced (was step 5)
                'steps/advanced.html',
                {
                    ...formData,
                    frontend: { css: formData.css, js: formData.js },
                    agents: formData.agents || [],
                    framework: formData.framework,
                    hiddenFields: createHiddenFields(formData)
                }
            )
            return c.html(html)
        }
    })

    // Handle presets selection (Extended flow only)
    app.post('/setup/step/presets', async (c) => {
        try {
            debug('[Presets POST] Starting presets submission')
            const body = await c.req.parseBody({ all: true })
            debug('[Presets POST] Body parsed:', Object.keys(body))
            debug('[Presets POST] Preset value:', body.preset)

            const formData = parseFormData(body as Record<string, unknown>)
            debug('[Presets POST] Form data parsed:', {
                setupType: formData.setupType,
                projectName: formData.projectName,
                css: formData.css,
                js: formData.js,
                preset: formData.preset
            })

            const presetKey = (body.preset as string) || ''

            // Presets POST is only for Extended flow
            // Simple setup should never reach this endpoint
            if (formData.setupType === SETUP_TYPES.SIMPLE) {
                debug('[Presets POST] Simple setup detected, redirecting to editors')
                // Redirect Simple setup to editors (should not happen, but safety check)
                return c.html(await renderSimpleEditorsStep(c.renderTemplate, {
                    ...formData,
                    preset: '' // No preset for Simple setup
                }))
            }

            debug('[Presets POST] Rendering extended frontend step')
            // Extended flow: presets → frontend
            const html = await renderExtendedFrontendStep(c.renderTemplate, {
                ...formData,
                preset: presetKey
            })
            debug('[Presets POST] Frontend step rendered successfully')
            return c.html(html)
        } catch (error) {
            console.error('[Presets POST] Error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to process presets selection'
            const errorStack = error instanceof Error ? error.stack : 'No stack trace available'
            const errorName = error instanceof Error ? error.name : 'Unknown'
            console.error('[Presets POST] Error name:', errorName)
            console.error('[Presets POST] Error stack:', errorStack)
            console.error('[Presets POST] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))

            // Return error response with more details (visible in browser)
            const errorHtml = `<div class="alert alert-error m-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 class="font-bold">Server Error (500)</h3>
                    <p class="text-sm mt-1">${errorMessage}</p>
                    <p class="text-xs mt-2 font-mono opacity-75">Error Type: ${errorName}</p>
                    <details class="mt-3">
                        <summary class="text-xs cursor-pointer font-semibold">Show Stack Trace</summary>
                        <pre class="text-xs mt-2 p-2 bg-base-200 rounded overflow-auto max-h-60">${errorStack}</pre>
                    </details>
                </div>
            </div>`
            return c.html(errorHtml, 500)
        }
    })

    // Handle advanced options (Extended path only)
    app.post('/setup/step/advanced', async (c: HonoContext) => {
        try {
            const body = await c.req.parseBody({ all: true })
            const formData = parseFormData(body as Record<string, unknown>, { setupType: SETUP_TYPES.EXTENDED })

            debug('[Advanced POST] Parsed form data:', {
                editors: formData.editors,
                framework: formData.framework,
                css: formData.css,
                js: formData.js
            })

            // Next: review
            return c.html(await getReviewStep(c.renderTemplate, formData))
        } catch (error) {
            console.error('[Advanced POST] Error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to process advanced options'
            return c.html(`<div class="alert alert-error"><p>Error: ${errorMessage}</p></div>`, 500)
        }
    })

    // Generate configuration
    app.post('/setup/generate', async (c: HonoContext) => {
        try {
            const body = await c.req.parseBody({ all: true })

            // CRITICAL: Merge wizard state from sessionStorage if provided
            // This ensures all selections are preserved even if hidden fields are incomplete
            let formData = parseFormData(body as Record<string, unknown>)

            if (body.wizardState) {
                try {
                    const wizardState = JSON.parse(body.wizardState as string) as Record<string, unknown>
                    debug('[Generate] Wizard state from client:', wizardState)

                    // Merge wizard state with form data, prioritizing form data but using state as fallback
                    formData = {
                        ...wizardState,
                        ...formData, // Form data takes precedence (most recent)
                        // Ensure arrays are properly merged
                        css: formData.css && formData.css.length > 0 ? formData.css : ((wizardState.css as string[]) || []),
                        js: formData.js && formData.js.length > 0 ? formData.js : ((wizardState.js as string[]) || []),
                        editors: formData.editors && formData.editors.length > 0 ? formData.editors : ((wizardState.editors as string[]) || []),
                        // Ensure project fields use form data if available, otherwise state
                        projectName: formData.projectName || (wizardState.projectName as string) || DEFAULT_PROJECT_NAME,
                        projectDescription: formData.projectDescription || (wizardState.projectDescription as string) || DEFAULT_PROJECT_DESCRIPTION,
                        setupType: formData.setupType || (wizardState.setupType as SetupType) || DEFAULT_SETUP_TYPE,
                        // Framework config: use form data if available, otherwise reconstruct from state
                        framework: formData.framework !== undefined ? formData.framework : (
                            wizardState.framework === 'true' ? {
                                enabled: true,
                                doctrine: wizardState.framework_doctrine === 'true',
                                directives: wizardState.framework_directives === 'true',
                                playbooks: wizardState.framework_playbooks === 'true',
                                enhancements: wizardState.framework_enhancements === 'true'
                            } : false
                        ),
                        preset: formData.preset || (wizardState.preset as string) || '',
                        contextDir: formData.contextDir || (wizardState.contextDir as string) || DEFAULT_CONTEXT_DIR
                    }

                    debug('[Generate] Merged form data with wizard state:', formData)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                    console.warn('[Generate] Failed to parse wizard state, using form data only:', errorMessage)
                    // Continue with form data only if state parsing fails
                }
            }

            // Validate required fields
            if (!formData.projectName || formData.projectName.trim() === '') {
                throw new Error('Project name is required')
            }

            // Handle presets mode (if preset selected)
            if (formData.preset && formData.preset !== '') {
                const preset = getPreset(formData.preset)
                if (!preset) {
                    throw new Error(`Preset "${formData.preset}" not found`)
                }

                // Extract modules from preset
                const cssModules = preset.modules.filter(m => ['tailwindcss', 'daisyui'].includes(m))
                const jsModules = preset.modules.filter(m => ['alpinejs', 'typescript'].includes(m))
                const couchcmsModules = preset.modules.filter(m => !['tailwindcss', 'daisyui', 'alpinejs', 'typescript'].includes(m))

                await generateConfiguration(projectDir, {
                    projectName: formData.projectName,
                    projectDescription: formData.projectDescription,
                    setupType: formData.setupType,
                    preset: formData.preset,
                    cssFrameworks: cssModules,
                    jsFrameworks: jsModules,
                    couchcmsModules: couchcmsModules,
                    couchcmsAgents: preset.agents || [],
                    editors: normalizeEditorsArray(formData.editors), // CRITICAL: Always normalize editors
                    frameworkConfig: preset.framework || false,
                    contextDir: formData.contextDir || (formData.setupType === SETUP_TYPES.SIMPLE ? '.project' : 'config/context')
                })
            } else {
                await generateConfiguration(projectDir, {
                    projectName: formData.projectName,
                    projectDescription: formData.projectDescription,
                    setupType: formData.setupType,
                    // For SIMPLE setup, ensure empty arrays (no frontend frameworks)
                    // For EXTENDED setup, use selected frameworks or empty if none selected
                    cssFrameworks: formData.setupType === SETUP_TYPES.SIMPLE ? [] : (formData.css || []),
                    jsFrameworks: formData.setupType === SETUP_TYPES.SIMPLE ? [] : (formData.js || []),
                    editors: normalizeEditorsArray(formData.editors), // CRITICAL: Always normalize editors
                    frameworkConfig: formData.setupType === SETUP_TYPES.SIMPLE || formData.framework === false
                        ? false
                        : {
                            doctrine: formData.framework?.doctrine || false,
                            directives: formData.framework?.directives || false,
                            playbooks: formData.framework?.playbooks || false,
                            enhancements: formData.framework?.enhancements || false
                        },
                    contextDir: formData.contextDir || (formData.setupType === SETUP_TYPES.SIMPLE ? '.project' : 'config/context')
                })
            }

            // Update progress to show completion
            const finalStep = formData.setupType === SETUP_TYPES.SIMPLE ? 3 : 7
            const progressData = getProgressIndicatorData(finalStep, formData.setupType)
            const progressHtml = await c.renderTemplate('partials/progress-indicator.html', progressData)
            const successHtml = await c.renderTemplate('steps/success.html', {})
            return c.html(progressHtml + '\n' + successHtml)
        } catch (error) {
            // Log error for debugging
            console.error('[Generate Configuration] Error:', error)

            // Provide user-friendly error message
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during configuration generation'
            const errorHtml = await c.renderTemplate('steps/error.html', { errorMessage })
            return c.html(errorHtml)
        }
    })

    /**
     * Generate project configuration
     * @param projectDir - Project directory
     * @param config - Configuration options
     * @returns Promise that resolves when configuration is generated
     */
    async function generateConfiguration(projectDir: string, config: ProjectConfig): Promise<void> {
        // Import required modules
        const { checkAndInstallDependencies } = await import('../../../scripts/lib/dependency-checker.js')
        const {
            getCouchCMSModules,
            getCouchCMSAgents,
            getCompleteModules,
            getCompleteAgents
        } = await import('../../../scripts/lib/option-organizer.js')
        const { detectToolkitPath } = await import('../../../scripts/lib/toolkit-detector.js')
        const { determineConfigPath, generateStandardsFile } = await import('../../../scripts/lib/config-generator.js')
        const { runInitialSync } = await import('../../../scripts/lib/sync-runner.js')
        const { getToolkitRootCached } = await import('../../../scripts/lib/paths.js')

        const TOOLKIT_ROOT = getToolkitRootCached()

        // Step 1: Ensure dependencies
        await checkAndInstallDependencies(TOOLKIT_ROOT)

        // Step 2: Build module and agent lists
        let allModules: string[]
        let allAgents: string[]

        if (config.preset && config.couchcmsModules && config.couchcmsAgents) {
            // For preset-based setup, use preset's modules and agents
            const presetModules = [
                ...(config.couchcmsModules || []),
                ...(config.cssFrameworks || []),
                ...(config.jsFrameworks || [])
            ]
            allModules = getCompleteModules(presetModules)
            allAgents = getCompleteAgents([], config.couchcmsAgents || [])
        } else {
            // For SIMPLE/EXTENDED setup, build from scratch
            const couchcmsModules = getCouchCMSModules()
            const couchcmsAgents = getCouchCMSAgents()

            // For SIMPLE setup, explicitly exclude frontend frameworks
            // For EXTENDED setup, use selected frameworks (or empty if none selected)
            const frontendModules = config.setupType === SETUP_TYPES.SIMPLE
                ? []
                : [...(config.cssFrameworks || []), ...(config.jsFrameworks || [])]
            allModules = getCompleteModules(frontendModules)

            // Get matching frontend agents for selected modules
            const frontendAgents = getMatchingAgents(frontendModules)

            // Combine all agents: CouchCMS + frontend
            allAgents = getCompleteAgents(frontendAgents, [])
        }

        // Step 3: Detect toolkit path
        const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'

        // Step 4: Determine config path
        const { configPath, configDir } = await determineConfigPath(
            projectDir,
            config.setupType === SETUP_TYPES.SIMPLE
        )

        // Step 5: Generate standards.md
        await generateStandardsFile({
            projectDir,
            configPath,
            configDir,
            projectName: config.projectName,
            projectDescription: config.projectDescription,
            toolkitPath,
            toolkitRoot: TOOLKIT_ROOT,
            selectedModules: allModules,
            selectedAgents: allAgents,
            selectedEditors: config.editors,
            frameworkConfig: config.frameworkConfig
        })

        // Step 6: Run initial sync
        await runInitialSync(projectDir, TOOLKIT_ROOT)
    }

    return app
}
