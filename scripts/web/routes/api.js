#!/usr/bin/env bun
/**
 * API Routes - Setup wizard API endpoints
 * Uses Nunjucks templates with new Simple/Extended flow
 */

import { Hono } from 'hono'
import { wrapStepWithProgress, getProgressIndicatorData, getPreviousStepRoute } from './helpers.js'
import { getCouchCMSModules, getCouchCMSAgents, getCompleteModules, getCompleteAgents, getMatchingAgents } from '../../lib/option-organizer.js'
import { getAvailableEditors } from '../../lib/prompts.js'
import { getToolkitRootCached } from '../../lib/paths.js'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Constants
 */
const SETUP_TYPES = {
    SIMPLE: 'simple',
    EXTENDED: 'extended'
}

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

/**
 * Parse array values from query parameters or form body
 * Handles both array format and multiple inputs with same name
 * When using parseBody({ all: true }), Hono returns arrays for fields with multiple values
 * @param {Object} data - Query parameters or form body
 * @param {string} key - Key to extract array values for
 * @returns {string[]} Array of unique values
 */
function parseArrayValue(data, key) {
    const values = []

    // When parseBody({ all: true }) is used, fields with multiple values are already arrays
    if (Array.isArray(data[key])) {
        const filtered = data[key].filter(v => v != null && v !== '' && v !== 'undefined')
        console.log(`[parseArrayValue] Found array for '${key}':`, filtered)
        return filtered
    }

    // Check if it's a single value
    if (data[key] != null && data[key] !== '' && data[key] !== 'undefined') {
        console.log(`[parseArrayValue] Found single value for '${key}':`, data[key])
        return [data[key]]
    }

    // Fallback: Collect all values with this key (handles edge cases)
    // Also handles keys like 'css[0]', 'css[1]', etc.
    for (const [k, v] of Object.entries(data)) {
        if (k === key || k.startsWith(`${key}[`) || k.startsWith(`${key}.`)) {
            if (v != null && v !== '' && v !== 'undefined') {
                // Handle both string and array values
                if (Array.isArray(v)) {
                    v.forEach(item => {
                        if (item != null && item !== '' && item !== 'undefined' && !values.includes(item)) {
                            values.push(item)
                        }
                    })
                } else if (!values.includes(v)) {
                    values.push(v)
                }
            }
        }
    }

    if (values.length > 0) {
        console.log(`[parseArrayValue] Collected ${values.length} values for '${key}' via fallback:`, values)
    } else {
        console.log(`[parseArrayValue] No values found for '${key}'`)
    }

    return values
}

/**
 * Create hidden form fields for state persistence
 * @param {Object} data - Data to create hidden fields from
 * @returns {Array<Object>} Array of hidden field objects
 */
function createHiddenFields(data) {
    const fields = []
    if (data.projectName) fields.push({ name: 'projectName', value: data.projectName })
    if (data.projectDescription) fields.push({ name: 'projectDescription', value: data.projectDescription })
    if (data.setupType) fields.push({ name: 'setupType', value: data.setupType })
    if (data.css && Array.isArray(data.css)) {
        data.css.forEach(c => fields.push({ name: 'css', value: c }))
    }
    if (data.js && Array.isArray(data.js)) {
        data.js.forEach(j => fields.push({ name: 'js', value: j }))
    }
    // Handle editors - ensure it's an array and has values
    if (data.editors) {
        const editorsArray = Array.isArray(data.editors) ? data.editors : [data.editors]
        console.log('[createHiddenFields] Creating hidden fields for editors:', editorsArray)
        editorsArray.forEach(e => {
            if (e != null && e !== '' && e !== 'undefined') {
                fields.push({ name: 'editors', value: e })
            }
        })
        console.log('[createHiddenFields] Created', fields.filter(f => f.name === 'editors').length, 'editor hidden fields')
    } else {
        console.log('[createHiddenFields] No editors data provided')
    }
    // Advanced options
    if (data.framework === 'true') {
        fields.push({ name: 'framework', value: 'true' })
        if (data.framework_doctrine === 'true') fields.push({ name: 'framework_doctrine', value: 'true' })
        if (data.framework_directives === 'true') fields.push({ name: 'framework_directives', value: 'true' })
        if (data.framework_playbooks === 'true') fields.push({ name: 'framework_playbooks', value: 'true' })
        if (data.framework_enhancements === 'true') fields.push({ name: 'framework_enhancements', value: 'true' })
    }
    if (data.contextDir) fields.push({ name: 'contextDir', value: data.contextDir })
    return fields
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
            { id: FRONTEND_MODULES.CSS[0], name: 'TailwindCSS', description: 'Utility-first CSS framework', selected: selectedCss.includes(FRONTEND_MODULES.CSS[0]) },
            { id: FRONTEND_MODULES.CSS[1], name: 'daisyUI', description: 'Component library for TailwindCSS', selected: selectedCss.includes(FRONTEND_MODULES.CSS[1]) }
        ],
        js: [
            { id: FRONTEND_MODULES.JS[0], name: 'Alpine.js', description: 'Lightweight reactive JavaScript', selected: selectedJs.includes(FRONTEND_MODULES.JS[0]) },
            { id: FRONTEND_MODULES.JS[1], name: 'TypeScript', description: 'Type-safe JavaScript', selected: selectedJs.includes(FRONTEND_MODULES.JS[1]) }
        ]
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
 * Get default project values from query or body
 * @param {Object} queryOrBody - Query parameters or form body
 * @returns {Object} Default project values
 */
function getProjectDefaults(queryOrBody) {
    return {
        projectName: queryOrBody.projectName || DEFAULT_PROJECT_NAME,
        projectDescription: queryOrBody.projectDescription || DEFAULT_PROJECT_DESCRIPTION,
        setupType: queryOrBody.setupType || DEFAULT_SETUP_TYPE
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
        const query = c.req.query()
        const defaults = getProjectDefaults(query)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            defaults
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c) => {
        const query = c.req.query()
        const defaults = getProjectDefaults(query)
        const css = parseArrayValue(query, 'css')
        const js = parseArrayValue(query, 'js')

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2,
            'steps/frontend.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...defaults,
                frontend: { css, js },
                frontendOptions: createFrontendOptions(css, js),
                hiddenFields: createHiddenFields({ ...defaults, setupType: SETUP_TYPES.EXTENDED })
            }
        )
        return c.html(html)
    })

    // GET route for editors step (for back navigation) - Handles both simple and extended paths
    app.get('/setup/step/editors', async (c) => {
        const query = c.req.query()
        const defaults = getProjectDefaults(query)
        const css = parseArrayValue(query, 'css')
        const js = parseArrayValue(query, 'js')
        const editors = parseArrayValue(query, 'editors')

        // Parse advanced options if present (for back navigation from advanced step)
        const framework = query.framework === 'true'
        const frameworkConfig = framework ? {
            enabled: true,
            doctrine: query.framework_doctrine === 'true',
            directives: query.framework_directives === 'true',
            playbooks: query.framework_playbooks === 'true',
            enhancements: query.framework_enhancements === 'true'
        } : false
        const contextDir = query.contextDir || DEFAULT_CONTEXT_DIR

        const { popular: popularEditors, other: otherEditors } = getEditorsGrouped(editors)
        const stepNumber = defaults.setupType === SETUP_TYPES.SIMPLE ? 2 : 3

        // Create hidden fields including advanced data if present
        const hiddenFieldsData = { ...defaults, css, js, editors }
        if (framework) {
            hiddenFieldsData.framework = 'true'
            if (frameworkConfig.doctrine) hiddenFieldsData.framework_doctrine = 'true'
            if (frameworkConfig.directives) hiddenFieldsData.framework_directives = 'true'
            if (frameworkConfig.playbooks) hiddenFieldsData.framework_playbooks = 'true'
            if (frameworkConfig.enhancements) hiddenFieldsData.framework_enhancements = 'true'
        }
        if (contextDir) hiddenFieldsData.contextDir = contextDir

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            stepNumber,
            'steps/editors.html',
            {
                ...defaults,
                frontend: { css, js },
                editors,
                popularEditors,
                otherEditors,
                hiddenFields: createHiddenFields(hiddenFieldsData)
            }
        )
        return c.html(html)
    })

    // GET route for advanced step (for back navigation)
    app.get('/setup/step/advanced', async (c) => {
        const query = c.req.query()
        const defaults = getProjectDefaults({ ...query, setupType: SETUP_TYPES.EXTENDED })
        const css = parseArrayValue(query, 'css')
        const js = parseArrayValue(query, 'js')
        const editors = parseArrayValue(query, 'editors')

        console.log('[Advanced GET] Query params:', Object.keys(query))
        console.log('[Advanced GET] Editors from query:', editors)

        // Parse framework config from query params
        const framework = query.framework === 'true'
        const frameworkConfig = framework ? {
            enabled: true,
            doctrine: query.framework_doctrine === 'true',
            directives: query.framework_directives === 'true',
            playbooks: query.framework_playbooks === 'true',
            enhancements: query.framework_enhancements === 'true'
        } : false

        const contextDir = query.contextDir || DEFAULT_CONTEXT_DIR

        // Ensure editors is an array
        const editorsArray = Array.isArray(editors) ? editors : (editors ? [editors] : [])
        console.log('[Advanced GET] Editors array for template:', editorsArray)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4,
            'steps/advanced.html',
            {
                ...defaults,
                frontend: { css, js },
                editors: editorsArray,
                framework: frameworkConfig,
                contextDir,
                hiddenFields: createHiddenFields({ ...defaults, css, js, editors: editorsArray })
            }
        )
        return c.html(html)
    })

    // Handle project info submission - routes based on setupType
    app.post('/setup/step/project', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const defaults = getProjectDefaults(body)

        // Route to next step based on setup type
        if (defaults.setupType === SETUP_TYPES.SIMPLE) {
            return c.html(await renderSimpleEditorsStep(c.renderTemplate, defaults))
        } else {
            return c.html(await renderExtendedFrontendStep(c.renderTemplate, defaults))
        }
    })

    /**
     * Render editors step for simple setup flow
     * @param {Function} renderTemplate - Template render function
     * @param {Object} defaults - Project defaults
     * @returns {Promise<string>} HTML content
     */
    async function renderSimpleEditorsStep(renderTemplate, defaults) {
        const editors = getAvailableEditors()
        const popularEditors = editors
            .filter(e => POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: e.id === DEFAULT_SELECTED_EDITOR }))
        const otherEditors = editors
            .filter(e => !POPULAR_EDITOR_IDS.includes(e.id))
            .map(e => ({ ...e, selected: false }))

        return await wrapStepWithProgress(
            renderTemplate,
            2,
            'steps/editors.html',
            {
                setupType: SETUP_TYPES.SIMPLE,
                ...defaults,
                editors: [], // Empty on first load
                popularEditors,
                otherEditors,
                hiddenFields: createHiddenFields(defaults)
            }
        )
    }

    /**
     * Render frontend step for extended setup flow
     * @param {Function} renderTemplate - Template render function
     * @param {Object} defaults - Project defaults
     * @returns {Promise<string>} HTML content
     */
    async function renderExtendedFrontendStep(renderTemplate, defaults) {
        const frontendOptions = createFrontendOptions(
            [FRONTEND_MODULES.CSS[0]], // Default: tailwindcss
            [FRONTEND_MODULES.JS[0]]  // Default: alpinejs
        )

        return await wrapStepWithProgress(
            renderTemplate,
            2,
            'steps/frontend.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...defaults,
                frontend: { css: [FRONTEND_MODULES.CSS[0]], js: [FRONTEND_MODULES.JS[0]] },
                frontendOptions,
                hiddenFields: createHiddenFields({ ...defaults, setupType: SETUP_TYPES.EXTENDED })
            }
        )
    }

    // ============================================
    // EXTENDED PATH FLOW
    // ============================================

    // Handle frontend selection (Extended path)
    app.post('/setup/step/frontend', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const defaults = getProjectDefaults({ ...body, setupType: SETUP_TYPES.EXTENDED })
        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')

        // Next: editors & tools (combined step)
        const { popular: popularEditors, other: otherEditors } = getEditorsGrouped([])
        // Default cursor selected
        popularEditors.forEach(e => {
            if (e.id === DEFAULT_SELECTED_EDITOR) e.selected = true
        })

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            3,
            'steps/editors.html',
            {
                ...defaults,
                frontend: { css: cssFrameworks, js: jsFrameworks },
                editors: [],
                popularEditors,
                otherEditors,
                hiddenFields: createHiddenFields({ ...defaults, css: cssFrameworks, js: jsFrameworks })
            }
        )
        return c.html(html)
    })

    // Handle editors & tools selection (both paths)
    app.post('/setup/step/editors', async (c) => {
        const body = await c.req.parseBody({ all: true })
        const defaults = getProjectDefaults(body)
        const selectedEditors = parseArrayValue(body, 'editors')
        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')

        if (defaults.setupType === SETUP_TYPES.SIMPLE) {
            // Simple: editors → review
            return c.html(await getReviewStep(c.renderTemplate, {
                ...defaults,
                editors: selectedEditors,
                frontend: { css: [], js: [] },
                framework: false,
                contextDir: DEFAULT_CONTEXT_DIR
            }))
        } else {
            // Extended: editors → advanced
            // Parse advanced options from hidden fields if present (for back navigation)
            const framework = body.framework === 'true'
            const frameworkConfig = framework ? {
                enabled: true,
                doctrine: body.framework_doctrine === 'true',
                directives: body.framework_directives === 'true',
                playbooks: body.framework_playbooks === 'true',
                enhancements: body.framework_enhancements === 'true'
            } : false
            const contextDir = body.contextDir || DEFAULT_CONTEXT_DIR

            // Ensure selectedEditors is an array
            const editorsArray = Array.isArray(selectedEditors) ? selectedEditors : (selectedEditors ? [selectedEditors] : [])
            console.log('[Editors POST] Selected editors array:', editorsArray)

            const html = await wrapStepWithProgress(
                c.renderTemplate,
                4,
                'steps/advanced.html',
                {
                    ...defaults,
                    frontend: { css: cssFrameworks, js: jsFrameworks },
                    editors: editorsArray,
                    framework: frameworkConfig,
                    contextDir,
                    hiddenFields: createHiddenFields({ ...defaults, css: cssFrameworks, js: jsFrameworks, editors: editorsArray })
                }
            )
            return c.html(html)
        }
    })

    // Handle advanced options (Extended path only)
    app.post('/setup/step/advanced', async (c) => {
        try {
            // Use 'all: true' to get all values for fields with same name (like multiple editors)
            const body = await c.req.parseBody({ all: true })
            const defaults = getProjectDefaults({ ...body, setupType: SETUP_TYPES.EXTENDED })
            const cssFrameworks = parseArrayValue(body, 'css')
            const jsFrameworks = parseArrayValue(body, 'js')

            // Debug: Log raw body data for editors
            console.log('[Advanced POST] Raw body.editors:', body.editors)
            console.log('[Advanced POST] Type of body.editors:', typeof body.editors)
            console.log('[Advanced POST] Is array?', Array.isArray(body.editors))
            console.log('[Advanced POST] All body keys:', Object.keys(body))
            console.log('[Advanced POST] All editor-related entries:', Object.entries(body).filter(([k]) => k.includes('editor')))

            // Parse editors - with parseBody({ all: true }), editors will be an array if multiple values exist
            let editors = parseArrayValue(body, 'editors')
            console.log('[Advanced POST] Parsed editors:', editors)
            console.log('[Advanced POST] Parsed editors type:', typeof editors)
            console.log('[Advanced POST] Parsed editors is array?', Array.isArray(editors))

            const framework = body.framework === 'true'
            const contextDir = body.contextDir || DEFAULT_CONTEXT_DIR

            const frameworkConfig = framework ? {
                enabled: true,
                doctrine: body.framework_doctrine === 'true',
                directives: body.framework_directives === 'true',
                playbooks: body.framework_playbooks === 'true',
                enhancements: body.framework_enhancements === 'true'
            } : false

            // Ensure editors is always an array
            let editorsArray = []
            if (Array.isArray(editors)) {
                editorsArray = editors.filter(e => e != null && e !== '' && e !== 'undefined')
            } else if (editors != null && editors !== '' && editors !== 'undefined') {
                editorsArray = [editors]
            }

            console.log('[Advanced POST] Final editors array for review step:', editorsArray)
            console.log('[Advanced POST] Final editors array length:', editorsArray.length)

            // Next: review
            return c.html(await getReviewStep(c.renderTemplate, {
                ...defaults,
                frontend: { css: cssFrameworks, js: jsFrameworks },
                editors: editorsArray,
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
        const body = await c.req.parseBody({ all: true })
        const defaults = getProjectDefaults(body)
        const cssFrameworks = parseArrayValue(body, 'css')
        const jsFrameworks = parseArrayValue(body, 'js')
        const editors = parseArrayValue(body, 'editors')

        // Parse framework config
        const frameworkConfig = body.framework === 'true' ? {
            doctrine: body.framework_doctrine === 'true',
            directives: body.framework_directives === 'true',
            playbooks: body.framework_playbooks === 'true',
            enhancements: body.framework_enhancements === 'true'
        } : false

        const contextDir = body.contextDir || DEFAULT_CONTEXT_DIR

        try {
            await generateConfiguration(projectDir, {
                ...defaults,
                cssFrameworks,
                jsFrameworks,
                editors,
                frameworkConfig,
                contextDir
            })

            // Update progress to show completion
            const finalStep = defaults.setupType === SETUP_TYPES.SIMPLE ? 3 : 5
            const progressData = getProgressIndicatorData(finalStep, defaults.setupType)
            const progressHtml = await c.renderTemplate('partials/progress-indicator.html', progressData)
            const successHtml = await c.renderTemplate('steps/success.html', {})
            return c.html(progressHtml + '\n' + successHtml)
        } catch (error) {
            const errorHtml = await c.renderTemplate('steps/error.html', { errorMessage: error.message })
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
        const frontendModules = [...config.cssFrameworks, ...config.jsFrameworks]
        const allModules = getCompleteModules(frontendModules)

        // Get matching frontend agents for selected modules
        const frontendAgents = getMatchingAgents(frontendModules)

        // Combine all agents: CouchCMS + frontend
        const allAgents = getCompleteAgents(frontendAgents, [])

        // Step 3: Detect toolkit path
        const toolkitPath = detectToolkitPath(projectDir) || './ai-toolkit-shared'

        // Step 4: Determine config path
        const { configPath, configDir } = await determineConfigPath(projectDir, config.setupType === SETUP_TYPES.SIMPLE)

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
    if (!existsSync(dirPath)) return files

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
        if (fallback.length > 0) couchcmsModules = fallback
    }
    if (couchcmsAgents.length === 0) {
        const fallback = getCouchCMSAgents()
        if (fallback.length > 0) couchcmsAgents = fallback
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
    const {
        setupType,
        projectName,
        projectDescription,
        frontend = { css: [], js: [] },
        editors = [],
        framework = false,
        contextDir = DEFAULT_CONTEXT_DIR
    } = data

    // Ensure editors is always an array
    const editorsArray = Array.isArray(editors) ? editors : (editors ? [editors] : [])
    console.log('[Review Step] Editors array:', editorsArray)
    console.log('[Review Step] Editors length:', editorsArray.length)

    const { couchcmsModules, couchcmsAgents } = getCouchCMSItemsFromToolkit()
    const finalStep = setupType === SETUP_TYPES.SIMPLE ? 3 : 5

    return await wrapStepWithProgress(
        renderTemplate,
        finalStep,
        'steps/review.html',
        {
            setupType,
            projectName,
            projectDescription,
            frontend,
            editors: editorsArray,
            framework,
            contextDir,
            couchcmsModules,
            couchcmsAgents
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
