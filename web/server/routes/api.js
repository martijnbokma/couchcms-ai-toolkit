#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates with new Simple/Extended flow
 */

import { Hono } from 'hono'
import {
    wrapStepWithProgress,
    getProgressIndicatorData,
    SETUP_TYPES
} from './helpers.js'
import {
    normalizeStringValue,
    normalizeEditorsArray,
    parseArrayValue,
    parseQueryParams
} from './utils.js'
import {
    getCouchCMSModules,
    getCouchCMSAgents,
    getCompleteModules,
    getCompleteAgents,
    getMatchingAgents,
    getFrontendAgents,
    getDevToolAgents
} from '../../../scripts/lib/option-organizer.js'
import { getAvailableEditors } from '../../../scripts/lib/prompts.js'
import { getToolkitRootCached } from '../../../scripts/lib/paths.js'
import { debug } from '../../../scripts/lib/logger.js'
import { loadPresets, getPreset } from '../../../scripts/lib/presets-loader.js'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const DEFAULT_PROJECT_NAME = 'my-project'
const DEFAULT_PROJECT_DESCRIPTION = 'A CouchCMS web application'
const DEFAULT_SETUP_TYPE = SETUP_TYPES.SIMPLE
const DEFAULT_CONTEXT_DIR = 'config/context'

const POPULAR_EDITOR_IDS = ['cursor', 'claude', 'copilot']
const DEFAULT_SELECTED_EDITOR = 'cursor'

const FRONTEND_MODULES = {
    CSS: ['tailwindcss', 'daisyui'],
    JS: ['alpinejs', 'typescript']
}

// Normalization functions are now imported from utils.js

/**
 * Parse framework configuration from request data
 * @param {Object} data - Query parameters or form body
 * @returns {Object|false} Framework config object or false if disabled
 */
function parseFrameworkConfig(data) {
    const framework = data.framework === 'true'
    if (!framework) {
        return false
    }

    return {
        enabled: true,
        doctrine: data.framework_doctrine === 'true',
        directives: data.framework_directives === 'true',
        playbooks: data.framework_playbooks === 'true',
        enhancements: data.framework_enhancements === 'true'
    }
}

/**
 * Parse form data from query or body
 * @param {Object} data - Query parameters or form body
 * @param {Object} options - Options
 * @param {string} [options.setupType] - Override setup type
 * @returns {Object} Parsed form data
 */
function parseFormData(data, options = {}) {
    const defaults = getProjectDefaults(data)
    if (options.setupType) {
        defaults.setupType = options.setupType
    }

    return {
        ...defaults,
        css: parseArrayValue(data, 'css'),
        js: parseArrayValue(data, 'js'),
        agents: parseArrayValue(data, 'agents'),
        editors: normalizeEditorsArray(parseArrayValue(data, 'editors')),
        framework: parseFrameworkConfig(data),
        // CRITICAL: Normalize preset to handle arrays and comma-separated values
        // Take first value if array, handle comma-separated strings, default to empty string
        preset: normalizeStringValue(data.preset, '', false),
        contextDir: data.contextDir || DEFAULT_CONTEXT_DIR
    }
}

/**
 * Create hidden form fields for state persistence
 * @param {Object} data - Data to create hidden fields from
 * @param {Object} options - Options
 * @param {boolean} [options.excludeProjectFields=false] - Exclude projectName and projectDescription (for project step)
 * @returns {Array<Object>} Array of hidden field objects
 */
function createHiddenFields(data, options = {}) {
    const fields = []
    const { excludeProjectFields = false } = options

    // Project info - EXCLUDE on project step (they have visible inputs)
    if (!excludeProjectFields) {
        if (data.projectName) {
            fields.push({ name: 'projectName', value: data.projectName })
        }
        if (data.projectDescription) {
            fields.push({ name: 'projectDescription', value: data.projectDescription })
        }
    }
    // setupType is always included (it's always a hidden field)
    if (data.setupType) {
        fields.push({ name: 'setupType', value: data.setupType })
    }

    // Frontend selections
    if (data.css && Array.isArray(data.css)) {
        data.css.forEach(c => fields.push({ name: 'css', value: c }))
    }
    if (data.js && Array.isArray(data.js)) {
        data.js.forEach(j => fields.push({ name: 'js', value: j }))
    }

    // Agents
    if (data.agents && Array.isArray(data.agents)) {
        data.agents.forEach(a => {
            if (a != null && a !== '' && a !== 'undefined') {
                fields.push({ name: 'agents', value: a })
            }
        })
    }

    // Editors
    if (data.editors && data.editors.length > 0) {
        data.editors.forEach(e => {
            if (e != null && e !== '' && e !== 'undefined') {
                fields.push({ name: 'editors', value: e })
            }
        })
    }

    // Framework options
    if (data.framework && data.framework !== false) {
        fields.push({ name: 'framework', value: 'true' })
        if (data.framework.doctrine) {
            fields.push({ name: 'framework_doctrine', value: 'true' })
        }
        if (data.framework.directives) {
            fields.push({ name: 'framework_directives', value: 'true' })
        }
        if (data.framework.playbooks) {
            fields.push({ name: 'framework_playbooks', value: 'true' })
        }
        if (data.framework.enhancements) {
            fields.push({ name: 'framework_enhancements', value: 'true' })
        }
    }

    // Preset
    if (data.preset) {
        fields.push({ name: 'preset', value: data.preset })
    }

    // Context directory
    if (data.contextDir) {
        fields.push({ name: 'contextDir', value: data.contextDir })
    }

    return fields
}

// normalizeStringValue is now imported from utils.js

/**
 * Get default project values from query or body
 * @param {Object} queryOrBody - Query parameters or form body
 * @returns {Object} Default project values
 */
function getProjectDefaults(queryOrBody) {
    return {
        // CRITICAL: preferLast=true for projectName/projectDescription because visible inputs come AFTER hidden fields
        // This ensures we get the value from the visible input, not from hidden fields
        projectName: normalizeStringValue(queryOrBody.projectName, DEFAULT_PROJECT_NAME, true),
        projectDescription: normalizeStringValue(queryOrBody.projectDescription, DEFAULT_PROJECT_DESCRIPTION, true),
        setupType: normalizeStringValue(queryOrBody.setupType, DEFAULT_SETUP_TYPE, false)
    }
}

/**
 * Create frontend options with selected state
 * @param {string[]} selectedCss - Selected CSS framework IDs
 * @param {string[]} selectedJs - Selected JS framework IDs
 * @returns {Object} Frontend options with selection state
 */
function createFrontendOptions(selectedCss = [], selectedJs = []) {
    return {
        css: [
            {
                id: FRONTEND_MODULES.CSS[0],
                name: 'TailwindCSS',
                description: 'Utility-first CSS framework',
                selected: selectedCss.includes(FRONTEND_MODULES.CSS[0])
            },
            {
                id: FRONTEND_MODULES.CSS[1],
                name: 'daisyUI',
                description: 'Component library for TailwindCSS',
                selected: selectedCss.includes(FRONTEND_MODULES.CSS[1])
            }
        ],
        js: [
            {
                id: FRONTEND_MODULES.JS[0],
                name: 'Alpine.js',
                description: 'Lightweight reactive JavaScript',
                selected: selectedJs.includes(FRONTEND_MODULES.JS[0])
            },
            {
                id: FRONTEND_MODULES.JS[1],
                name: 'TypeScript',
                description: 'Type-safe JavaScript',
                selected: selectedJs.includes(FRONTEND_MODULES.JS[1])
            }
        ]
    }
}

/**
 * Create agent options from selected agents
 * @param {string[]} selectedAgents - Array of selected agent IDs
 * @param {string[]} selectedFrontend - Array of selected frontend modules (for auto-selection)
 * @returns {Object} Agent options organized by category
 */
function createAgentOptions(selectedAgents = [], selectedFrontend = []) {
    const frontendAgents = getFrontendAgents()
    const devToolAgents = getDevToolAgents()

    // Auto-select agents matching selected frontend modules
    const autoSelectedAgents = getMatchingAgents(selectedFrontend)
    const allSelected = [...new Set([...selectedAgents, ...autoSelectedAgents])]

    // Helper to format agent name
    function formatAgentName(name) {
        return name
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return {
        frontend: frontendAgents.all.map(agent => ({
            id: agent.name,
            name: formatAgentName(agent.name),
            description: agent.description || getAgentDescription(agent.name),
            selected: allSelected.includes(agent.name)
        })),
        devTools: devToolAgents.map(agent => ({
            id: agent.name,
            name: formatAgentName(agent.name),
            description: agent.description || getAgentDescription(agent.name),
            selected: allSelected.includes(agent.name)
        }))
    }
}

/**
 * Get editors grouped by popularity
 * @param {string[]} selectedEditors - Array of selected editor IDs
 * @returns {Object} Grouped editors with popular and other categories
 */
function getEditorsGrouped(selectedEditors = []) {
    const allEditors = getAvailableEditors()

    return {
        popular: allEditors
            .filter(e => POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: selectedEditors.includes(e.id) })),
        other: allEditors
            .filter(e => !POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: selectedEditors.includes(e.id) }))
    }
}

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

    // ============================================
    // SIMPLE PATH FLOW
    // ============================================

    // Get step content (project info) - detects setupType from query
    app.get('/setup/step/project', async (c) => {
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
        if (formData.projectName && typeof formData.projectName === 'string' && formData.projectName.includes(',')) {
            const parts = formData.projectName.split(',').map(p => p.trim()).filter(p => p)
            formData.projectName = parts.length > 0 ? parts[parts.length - 1] : DEFAULT_PROJECT_NAME
        }
        if (formData.projectDescription && typeof formData.projectDescription === 'string' && formData.projectDescription.includes(',')) {
            const parts = formData.projectDescription.split(',').map(p => p.trim()).filter(p => p)
            formData.projectDescription = parts.length > 0 ? parts[parts.length - 1] : DEFAULT_PROJECT_DESCRIPTION
        }

        const hiddenFields = createHiddenFields(formData, { excludeProjectFields: true })
        debug('[Project GET] Hidden fields created:', hiddenFields.map(f => ({ name: f.name, value: f.value })))

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            {
                ...formData,
                // CRITICAL: Exclude projectName and projectDescription from hidden fields
                // because they have visible inputs on this step - prevents duplication
                hiddenFields
            }
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c) => {
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
    app.get('/setup/step/editors', async (c) => {
        const formData = parseFormData(c.req.query())

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
    app.get('/setup/step/presets', async (c) => {
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
    app.get('/setup/step/advanced', async (c) => {
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
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody({ all: true })
        // CRITICAL: Normalize projectName and projectDescription to prevent duplication
        // When both visible input and hidden fields exist, parseBody creates arrays
        if (Array.isArray(body.projectName)) {
            // Take the first non-empty value (visible input takes precedence)
            body.projectName = body.projectName.find(v => v && v !== '' && v !== 'undefined') || body.projectName[0]
        }
        if (Array.isArray(body.projectDescription)) {
            body.projectDescription = body.projectDescription.find(v => v && v !== '' && v !== 'undefined') || body.projectDescription[0]
        }
        const formData = parseFormData(body)
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
            const errorMessage = error.message || 'Failed to load next step'
            return c.html(`<div class="alert alert-error"><p>Error: ${errorMessage}</p></div>`, 500)
        }
    })

    /**
     * Render editors step for simple setup flow
     * @param {Function} renderTemplate - Template render function
     * @param {Object} formData - Parsed form data
     * @returns {Promise<string>} HTML content
     */
    async function renderSimpleEditorsStep(renderTemplate, formData) {
        const editors = getAvailableEditors()
        const popularEditors = editors
            .filter(e => POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: e.id === DEFAULT_SELECTED_EDITOR }))
        const otherEditors = editors
            .filter(e => !POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: false }))

        // Update selected state from form data
        const selectedEditors = formData.editors || []
        const popularWithSelection = popularEditors.map(e => ({
            ...e,
            selected: selectedEditors.includes(e.id)
        }))
        const otherWithSelection = otherEditors.map(e => ({
            ...e,
            selected: selectedEditors.includes(e.id)
        }))

        return await wrapStepWithProgress(
            renderTemplate,
            2, // Step 2 for Simple (Project → Editors)
            'steps/editors.html',
            {
                setupType: SETUP_TYPES.SIMPLE,
                ...formData,
                editors: selectedEditors,
                popularEditors: popularWithSelection,
                otherEditors: otherWithSelection,
                hiddenFields: createHiddenFields(formData)
            }
        )
    }

    /**
     * Render presets step (Extended flow only)
     * @param {Function} renderTemplate - Template render function
     * @param {Object} formData - Parsed form data
     * @returns {Promise<string>} HTML content
     */
    async function renderPresetsStep(renderTemplate, formData) {
        // Presets step is only for Extended flow
        if (formData.setupType === SETUP_TYPES.SIMPLE) {
            throw new Error('Presets step is not available for Simple setup')
        }

        const stepNumber = 2 // Step 2 for Extended flow
        debug('[renderPresetsStep] Rendering presets step:', {
            stepNumber,
            setupType: formData.setupType,
            projectName: formData.projectName
        })
        try {
            const html = await wrapStepWithProgress(
                renderTemplate,
                stepNumber,
                'steps/presets.html',
                {
                    setupType: formData.setupType,
                    ...formData,
                    hiddenFields: createHiddenFields(formData)
                }
            )
            debug('[renderPresetsStep] Successfully rendered presets step')
            return html
        } catch (error) {
            console.error('[renderPresetsStep] Error rendering presets step:', error)
            throw error
        }
    }

    /**
     * Render frontend step for extended setup flow
     * @param {Function} renderTemplate - Template render function
     * @param {Object} formData - Parsed form data
     * @returns {Promise<string>} HTML content
     */
    async function renderExtendedFrontendStep(renderTemplate, formData) {
        // Use defaults if not provided
        const css = formData.css.length > 0 ? formData.css : [FRONTEND_MODULES.CSS[0]]
        const js = formData.js.length > 0 ? formData.js : [FRONTEND_MODULES.JS[0]]

        const frontendOptions = createFrontendOptions(css, js)

        return await wrapStepWithProgress(
            renderTemplate,
            3, // Step 3 for Extended flow (Project → Presets → Frontend)
            'steps/frontend.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...formData,
                frontend: { css, js },
                frontendOptions,
                hiddenFields: createHiddenFields({
                    ...formData,
                    css,
                    js
                })
            }
        )
    }

    // ============================================
    // EXTENDED PATH FLOW
    // ============================================

    // Handle frontend selection (Extended path)
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body, { setupType: SETUP_TYPES.EXTENDED })

        // Next: agents step
        const selectedFrontend = [...(formData.css || []), ...(formData.js || [])]
        const agentOptions = createAgentOptions([], selectedFrontend)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4, // Step 4: Agents
            'steps/agents.html',
            {
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                agentOptions,
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

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4, // Step 4: Agents
            'steps/agents.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                agentOptions,
                hiddenFields: createHiddenFields(formData)
            }
        )
        return c.html(html)
    })

    // Handle agents selection (Extended path)
    app.post('/setup/step/agents', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body, { setupType: SETUP_TYPES.EXTENDED })

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
    app.post('/setup/step/editors', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const formData = parseFormData(body)

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
            const body = await c.req.parseBody({ all: true })
            const formData = parseFormData(body)
            const presetKey = body.preset || ''

            // Presets POST is only for Extended flow
            // Simple setup should never reach this endpoint
            if (formData.setupType === SETUP_TYPES.SIMPLE) {
                // Redirect Simple setup to editors (should not happen, but safety check)
                return c.html(await renderSimpleEditorsStep(c.renderTemplate, {
                    ...formData,
                    preset: '' // No preset for Simple setup
                }))
            }

            // Extended flow: presets → frontend
            return c.html(await renderExtendedFrontendStep(c.renderTemplate, {
                ...formData,
                preset: presetKey
            }))
        } catch (error) {
            console.error('[Presets POST] Error:', error)
            const errorMessage = error.message || 'Failed to process presets selection'
            return c.html(`<div class="alert alert-error"><p>Error: ${errorMessage}</p></div>`, 500)
        }
    })

    // Handle advanced options (Extended path only)
    app.post('/setup/step/advanced', async (c) => {
        try {
            const body = await c.req.parseBody({ all: true })
            const formData = parseFormData(body, { setupType: SETUP_TYPES.EXTENDED })

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
            const errorMessage = error.message || 'Failed to process advanced options'
            return c.html(`<div class="alert alert-error"><p>Error: ${errorMessage}</p></div>`, 500)
        }
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        try {
            const body = await c.req.parseBody({ all: true })

            // CRITICAL: Merge wizard state from sessionStorage if provided
            // This ensures all selections are preserved even if hidden fields are incomplete
            let formData = parseFormData(body)

            if (body.wizardState) {
                try {
                    const wizardState = JSON.parse(body.wizardState)
                    debug('[Generate] Wizard state from client:', wizardState)

                    // Merge wizard state with form data, prioritizing form data but using state as fallback
                    formData = {
                        ...wizardState,
                        ...formData, // Form data takes precedence (most recent)
                        // Ensure arrays are properly merged
                        css: formData.css && formData.css.length > 0 ? formData.css : (wizardState.css || []),
                        js: formData.js && formData.js.length > 0 ? formData.js : (wizardState.js || []),
                        editors: formData.editors && formData.editors.length > 0 ? formData.editors : (wizardState.editors || []),
                        // Ensure project fields use form data if available, otherwise state
                        projectName: formData.projectName || wizardState.projectName || DEFAULT_PROJECT_NAME,
                        projectDescription: formData.projectDescription || wizardState.projectDescription || DEFAULT_PROJECT_DESCRIPTION,
                        setupType: formData.setupType || wizardState.setupType || DEFAULT_SETUP_TYPE,
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
                        preset: formData.preset || wizardState.preset || '',
                        contextDir: formData.contextDir || wizardState.contextDir || DEFAULT_CONTEXT_DIR
                    }

                    debug('[Generate] Merged form data with wizard state:', formData)
                } catch (error) {
                    console.warn('[Generate] Failed to parse wizard state, using form data only:', error.message)
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
            const errorMessage = error.message || 'An unexpected error occurred during configuration generation'
            const errorHtml = await c.renderTemplate('steps/error.html', { errorMessage })
            return c.html(errorHtml)
        }
    })

    /**
     * Generate project configuration
     * @param {string} projectDir - Project directory
     * @param {Object} config - Configuration options
     * @returns {Promise<void>}
     */
    async function generateConfiguration(projectDir, config) {
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
        let allModules, allAgents

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

/**
 * Scan directory for markdown files (excluding README)
 * @param {string} dirPath - Directory path to scan
 * @param {string[]} excludeNames - Names to exclude from results
 * @returns {string[]} Array of file names (without .md extension)
 */
function scanMarkdownFiles(dirPath, excludeNames = []) {
    const files = []
    if (!existsSync(dirPath)) {
        return files
    }

    try {
        const entries = readdirSync(dirPath)
        for (const entry of entries) {
            const fullPath = join(dirPath, entry)
            try {
                const stat = statSync(fullPath)
                if (stat.isFile() && entry.endsWith('.md') && !entry.includes('README')) {
                    const name = entry.replace('.md', '')
                    if (!excludeNames.includes(name)) {
                        files.push(name)
                    }
                }
            } catch (e) {
                // Skip if we can't stat the file
            }
        }
    } catch (error) {
        console.warn(`⚠️  Failed to scan directory ${dirPath}: ${error.message}`)
    }

    return files
}

/**
 * Get CouchCMS modules and agents from toolkit directory
 * @returns {Object} Object with couchcmsModules and couchcmsAgents arrays
 */
function getCouchCMSItemsFromToolkit() {
    const toolkitPath = getToolkitRootCached()
    const frontendModuleNames = [...FRONTEND_MODULES.CSS, ...FRONTEND_MODULES.JS]
    const frontendAgentNames = [FRONTEND_MODULES.CSS[0], FRONTEND_MODULES.JS[0], FRONTEND_MODULES.JS[1]]

    let couchcmsModules = []
    let couchcmsAgents = []

    // Try core directory first
    const coreModulesDir = join(toolkitPath, 'modules', 'core')
    const coreAgentsDir = join(toolkitPath, 'agents', 'core')

    couchcmsModules = scanMarkdownFiles(coreModulesDir, frontendModuleNames)
    couchcmsAgents = scanMarkdownFiles(coreAgentsDir, frontendAgentNames)

    // Fallback to legacy flat structure if core/ is empty
    if (couchcmsModules.length === 0) {
        const legacyModulesDir = join(toolkitPath, 'modules')
        couchcmsModules = scanMarkdownFiles(legacyModulesDir, frontendModuleNames)
    }

    if (couchcmsAgents.length === 0) {
        const legacyAgentsDir = join(toolkitPath, 'agents')
        couchcmsAgents = scanMarkdownFiles(legacyAgentsDir, frontendAgentNames)
    }

    // Sort and remove duplicates
    couchcmsModules = [...new Set(couchcmsModules)].sort()
    couchcmsAgents = [...new Set(couchcmsAgents)].sort()

    // Fallback to hardcoded values if scanning found nothing
    if (couchcmsModules.length === 0) {
        const fallback = getCouchCMSModules()
        if (fallback.length > 0) {
            couchcmsModules = fallback
        }
    }
    if (couchcmsAgents.length === 0) {
        const fallback = getCouchCMSAgents()
        if (fallback.length > 0) {
            couchcmsAgents = fallback
        }
    }

    return { couchcmsModules, couchcmsAgents }
}

/**
 * Get review step HTML using Nunjucks template
 * @param {Function} renderTemplate - Template render function
 * @param {Object} data - Review step data
 * @returns {Promise<string>} HTML content
 */
async function getReviewStep(renderTemplate, data) {
    // CRITICAL: Ensure all fields have default values to prevent missing data
    const {
        setupType = data.setupType || DEFAULT_SETUP_TYPE,
        projectName = data.projectName || DEFAULT_PROJECT_NAME,
        projectDescription = data.projectDescription || DEFAULT_PROJECT_DESCRIPTION,
        frontend = { css: data.css || [], js: data.js || [] },
        editors = data.editors || [],
        framework = data.framework || false,
        contextDir = data.contextDir || DEFAULT_CONTEXT_DIR,
        preset = data.preset || '',
        presetData = data.presetData || null
    } = data

    // Ensure frontend object has arrays and remove duplicates
    const cssArray = Array.isArray(frontend.css) ? frontend.css : (Array.isArray(data.css) ? data.css : [])
    const jsArray = Array.isArray(frontend.js) ? frontend.js : (Array.isArray(data.js) ? data.js : [])

    // Remove duplicates from arrays
    const uniqueCss = [...new Set(cssArray)]
    const uniqueJs = [...new Set(jsArray)]

    const frontendData = {
        css: uniqueCss,
        js: uniqueJs
    }

    const editorsArray = normalizeEditorsArray(editors)
    debug('[Review Step] Complete data:', {
        setupType,
        projectName,
        projectDescription,
        frontend: frontendData,
        editors: editorsArray,
        framework,
        preset
    })
    debug('[Review Step] Editors array:', editorsArray)
    debug('[Review Step] Editors length:', editorsArray.length)
    debug('[Review Step] Preset:', preset)

    // Load preset data if preset key is provided but presetData is not
    let finalPresetData = presetData
    if (preset && preset !== '' && !presetData) {
        finalPresetData = getPreset(preset)
    }

    // For presets, use preset data if available, otherwise get from toolkit
    let couchcmsModules, couchcmsAgents
    // Get selected frontend frameworks to filter from agents
    const selectedFrontendFrameworks = [...uniqueCss, ...uniqueJs]

    if (preset && preset !== '' && finalPresetData && data.couchcmsModules && data.couchcmsAgents) {
        couchcmsModules = data.couchcmsModules
        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = data.couchcmsAgents.filter(agent => !selectedFrontendFrameworks.includes(agent))
    } else if (preset && preset !== '' && finalPresetData) {
        // Extract modules and agents from preset if not already provided
        const cssModules = finalPresetData.modules.filter(m => ['tailwindcss', 'daisyui'].includes(m))
        const jsModules = finalPresetData.modules.filter(m => ['alpinejs', 'typescript'].includes(m))
        couchcmsModules = finalPresetData.modules.filter(m => !['tailwindcss', 'daisyui', 'alpinejs', 'typescript'].includes(m))
        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = (finalPresetData.agents || []).filter(agent => !selectedFrontendFrameworks.includes(agent))
    } else {
        const items = getCouchCMSItemsFromToolkit()
        couchcmsModules = items.couchcmsModules

        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = items.couchcmsAgents.filter(agent => !selectedFrontendFrameworks.includes(agent))
    }

    const finalStep = setupType === SETUP_TYPES.SIMPLE ? 3 : 7

    return await wrapStepWithProgress(
        renderTemplate,
        finalStep,
        'steps/review.html',
        {
            setupType,
            projectName,
            projectDescription,
            frontend: frontendData, // Use normalized frontend data
            editors: editorsArray,
            framework,
            contextDir,
            couchcmsModules,
            couchcmsAgents,
            preset: preset || '',
            presetData: finalPresetData || null
        }
    )
}

/**
 * Get module description
 * @param {string} name - Module name
 * @returns {string} Module description
 */
function getModuleDescription(name) {
    const descriptions = {
        [FRONTEND_MODULES.CSS[0]]: 'Utility-first CSS framework',
        [FRONTEND_MODULES.CSS[1]]: 'Component library for TailwindCSS',
        [FRONTEND_MODULES.JS[0]]: 'Lightweight reactive JavaScript',
        [FRONTEND_MODULES.JS[1]]: 'Type-safe JavaScript'
    }
    return descriptions[name] || 'CouchCMS module'
}

/**
 * Get agent description
 * @param {string} name - Agent name
 * @returns {string} Agent description
 */
function getAgentDescription(name) {
    return `AI agent for ${name}`
}
