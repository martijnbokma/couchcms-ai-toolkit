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
    getCouchCMSModules,
    getCouchCMSAgents,
    getCompleteModules,
    getCompleteAgents,
    getMatchingAgents
} from '../../lib/option-organizer.js'
import { getAvailableEditors } from '../../lib/prompts.js'
import { getToolkitRootCached } from '../../lib/paths.js'
import { debug } from '../../lib/logger.js'
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
        debug(`[parseArrayValue] Found array for '${key}':`, filtered)
        return filtered
    }

    // Check if it's a single value
    if (data[key] != null && data[key] !== '' && data[key] !== 'undefined') {
        debug(`[parseArrayValue] Found single value for '${key}':`, data[key])
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
        debug(`[parseArrayValue] No values found for '${key}'`)
    }

    return values
}

/**
 * Normalize editors to always be an array with UNIQUE values
 * CRITICAL: Removes duplicates to prevent showing duplicate badges
 * @param {string|string[]|undefined} editors - Editors value
 * @returns {string[]} Array of unique editor IDs
 */
function normalizeEditorsArray(editors) {
    let result = []

    if (Array.isArray(editors)) {
        result = editors.filter(e => e != null && e !== '' && e !== 'undefined')
    } else if (editors != null && editors !== '' && editors !== 'undefined') {
        result = [editors]
    }

    // CRITICAL: Remove duplicates using Set to ensure unique values
    return [...new Set(result)]
}

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
        editors: normalizeEditorsArray(parseArrayValue(data, 'editors')),
        framework: parseFrameworkConfig(data),
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

    // Context directory
    if (data.contextDir) {
        fields.push({ name: 'contextDir', value: data.contextDir })
    }

    return fields
}

/**
 * Normalize a value to a string, handling arrays from multiple form fields
 * When multiple hidden fields have the same name, parseBody({ all: true }) returns arrays
 * CRITICAL: For projectName/projectDescription, we want the LAST value (from visible input),
 * not the first (from hidden fields)
 * @param {string|string[]|undefined} value - Value to normalize
 * @param {string} defaultValue - Default value if value is empty
 * @param {boolean} preferLast - If true, take last value from array (for visible inputs), else take first
 * @returns {string} Normalized string value
 */
function normalizeStringValue(value, defaultValue, preferLast = false) {
    if (!value) {
        return defaultValue
    }
    // If it's an array (from multiple form fields with same name)
    if (Array.isArray(value)) {
        // Filter out empty values
        const validValues = value.filter(v => v && v !== '' && v !== 'undefined' && v !== 'null')
        if (validValues.length === 0) {
            return defaultValue
        }
        // For project fields, prefer LAST value (visible input comes after hidden fields in form)
        // For other fields, prefer FIRST value (hidden fields are authoritative)
        return preferLast ? validValues[validValues.length - 1] : validValues[0]
    }
    // If it's already a string, ALWAYS split on comma and take appropriate part
    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) {
            return defaultValue
        }

        // If value contains commas, split and take appropriate part
        if (trimmed.includes(',')) {
            const parts = trimmed.split(',').map(p => p.trim()).filter(p => p)
            if (parts.length > 0) {
                // For project fields (preferLast=true), ALWAYS take last part (user's input)
                // For other fields, take first part
                return preferLast ? parts[parts.length - 1] : parts[0]
            }
            return defaultValue
        }

        return trimmed
    }
    return defaultValue
}

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
        const formData = parseFormData(c.req.query())

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

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            1,
            'steps/project.html',
            {
                ...formData,
                // CRITICAL: Exclude projectName and projectDescription from hidden fields
                // because they have visible inputs on this step - prevents duplication
                hiddenFields: createHiddenFields(formData, { excludeProjectFields: true })
            }
        )
        return c.html(html)
    })

    // GET route for frontend step (for back navigation)
    app.get('/setup/step/frontend', async (c) => {
        const formData = parseFormData(c.req.query(), { setupType: SETUP_TYPES.EXTENDED })

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            2,
            'steps/frontend.html',
            {
                setupType: SETUP_TYPES.EXTENDED,
                ...formData,
                frontend: { css: formData.css, js: formData.js },
                frontendOptions: createFrontendOptions(formData.css, formData.js),
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
        const stepNumber = formData.setupType === SETUP_TYPES.SIMPLE ? 2 : 3

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

    // GET route for advanced step (for back navigation)
    app.get('/setup/step/advanced', async (c) => {
        const formData = parseFormData(c.req.query(), { setupType: SETUP_TYPES.EXTENDED })

        debug('[Advanced GET] Query params:', Object.keys(c.req.query()))
        debug('[Advanced GET] Editors from query:', formData.editors)

        const html = await wrapStepWithProgress(
            c.renderTemplate,
            4,
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

        if (formData.setupType === SETUP_TYPES.SIMPLE) {
            return c.html(await renderSimpleEditorsStep(c.renderTemplate, formData))
        } else {
            return c.html(await renderExtendedFrontendStep(c.renderTemplate, formData))
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
            2,
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
            2,
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
            3,
            'steps/editors.html',
            {
                ...formData,
                frontend: { css: formData.css, js: formData.js },
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
                contextDir: DEFAULT_CONTEXT_DIR
            }))
        } else {
            // Extended: editors → advanced
            const html = await wrapStepWithProgress(
                c.renderTemplate,
                4,
                'steps/advanced.html',
                {
                    ...formData,
                    frontend: { css: formData.css, js: formData.js },
                    framework: formData.framework,
                    hiddenFields: createHiddenFields(formData)
                }
            )
            return c.html(html)
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
            console.error('Error in /setup/step/advanced:', error)
            return c.html(`<div class="alert alert-error"><p>Error: ${error.message}</p></div>`, 500)
        }
    })

    // Generate configuration
    app.post('/setup/generate', async (c) => {
        try {
            const body = await c.req.parseBody({ all: true })
            const formData = parseFormData(body)

            await generateConfiguration(projectDir, {
                projectName: formData.projectName,
                projectDescription: formData.projectDescription,
                setupType: formData.setupType,
                // For SIMPLE setup, ensure empty arrays (no frontend frameworks)
                // For EXTENDED setup, use selected frameworks or empty if none selected
                cssFrameworks: formData.setupType === SETUP_TYPES.SIMPLE ? [] : (formData.css || []),
                jsFrameworks: formData.setupType === SETUP_TYPES.SIMPLE ? [] : (formData.js || []),
                editors: formData.editors || [],
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

            // Update progress to show completion
            const finalStep = formData.setupType === SETUP_TYPES.SIMPLE ? 3 : 5
            const progressData = getProgressIndicatorData(finalStep, formData.setupType)
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
        const {
            getCouchCMSModules,
            getCouchCMSAgents,
            getCompleteModules,
            getCompleteAgents
        } = await import('../../lib/option-organizer.js')
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

        // For SIMPLE setup, explicitly exclude frontend frameworks
        // For EXTENDED setup, use selected frameworks (or empty if none selected)
        const frontendModules = config.setupType === SETUP_TYPES.SIMPLE
            ? []
            : [...(config.cssFrameworks || []), ...(config.jsFrameworks || [])]
        const allModules = getCompleteModules(frontendModules)

        // Get matching frontend agents for selected modules
        const frontendAgents = getMatchingAgents(frontendModules)

        // Combine all agents: CouchCMS + frontend
        const allAgents = getCompleteAgents(frontendAgents, [])

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
    const {
        setupType,
        projectName,
        projectDescription,
        frontend = { css: [], js: [] },
        editors = [],
        framework = false,
        contextDir = DEFAULT_CONTEXT_DIR
    } = data

    const editorsArray = normalizeEditorsArray(editors)
    debug('[Review Step] Editors array:', editorsArray)
    debug('[Review Step] Editors length:', editorsArray.length)

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
