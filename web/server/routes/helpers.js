#!/usr/bin/env bun
/**
 * Helper functions for wizard UI
 * Uses Nunjucks templates
 */

/**
 * Constants
 */
const SETUP_TYPES = {
    SIMPLE: 'simple',
    EXTENDED: 'extended',
    PRESETS: 'presets'
}

/**
 * Step definitions for simple setup flow
 * @type {StepDefinition[]}
 */
const SIMPLE_STEPS = [
    { num: 1, label: 'Project Info', route: 'project' },
    { num: 2, label: 'Editors', route: 'editors' },
    { num: 3, label: 'Review', route: 'review' }
]

/**
 * Step definitions for extended setup flow
 * @type {StepDefinition[]}
 */
const EXTENDED_STEPS = [
    { num: 1, label: 'Project Info', route: 'project' },
    { num: 2, label: 'Presets (Optional)', route: 'presets' },
    { num: 3, label: 'Frontend', route: 'frontend' },
    { num: 4, label: 'AI Agents', route: 'agents' },
    { num: 5, label: 'Editors & Tools', route: 'editors' },
    { num: 6, label: 'Advanced', route: 'advanced' },
    { num: 7, label: 'Review', route: 'review' }
]

/**
 * Step definitions for presets setup flow
 * @type {StepDefinition[]}
 */
const PRESETS_STEPS = [
    { num: 1, label: 'Project Info', route: 'project' },
    { num: 2, label: 'Select Preset', route: 'presets' },
    { num: 3, label: 'Review', route: 'review' }
]

/**
 * Step descriptions for simple setup flow
 * @type {Record<number, string>}
 */
const SIMPLE_STEP_DESCRIPTIONS = {
    1: 'Project name and description',
    2: 'Select editors and AI tools',
    3: 'Review and generate configuration'
}

/**
 * Step descriptions for extended setup flow
 * @type {Record<number, string>}
 */
const EXTENDED_STEP_DESCRIPTIONS = {
    1: 'Project name and description',
    2: 'Choose a preset or skip to customize',
    3: 'CSS and JavaScript frameworks',
    4: 'Select AI agents for specialized guidance',
    5: 'Editors and AI tools',
    6: 'Advanced options and framework',
    7: 'Review and generate configuration'
}

/**
 * Step descriptions for presets setup flow
 * @type {Record<number, string>}
 */
const PRESETS_STEP_DESCRIPTIONS = {
    1: 'Project name and description',
    2: 'Select project preset',
    3: 'Review and generate configuration'
}

/**
 * Step definition type
 * @typedef {Object} StepDefinition
 * @property {number} num - Step number
 * @property {string} label - Step label
 * @property {string} route - Step route name
 */

/**
 * Step data with state information
 * @typedef {Object} StepData
 * @property {number} num - Step number
 * @property {string} label - Step label
 * @property {string} route - Step route name
 * @property {string} description - Step description
 * @property {boolean} isActive - Whether step is currently active
 * @property {boolean} isCompleted - Whether step is completed
 * @property {boolean} isFuture - Whether step is in the future
 * @property {boolean} isClickable - Whether step can be navigated to
 */

/**
 * Progress indicator data
 * @typedef {Object} ProgressIndicatorData
 * @property {StepData[]} steps - Array of step data
 * @property {number} progressPercentage - Progress percentage (0-100)
 * @property {number} totalSteps - Total number of steps
 * @property {number} currentStep - Current step number
 * @property {string} setupType - Setup type ('simple' or 'extended')
 */

/**
 * Get step definitions for a setup type
 * @param {string} setupType - 'simple', 'extended', or 'presets'
 * @returns {StepDefinition[]} Step definitions
 */
export function getStepDefinitions(setupType) {
    if (setupType === SETUP_TYPES.SIMPLE) {
        return SIMPLE_STEPS
    } else if (setupType === SETUP_TYPES.PRESETS) {
        return PRESETS_STEPS
    }
    return EXTENDED_STEPS
}

/**
 * Get step descriptions for a setup type
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {Record<number, string>} Step descriptions by step number
 */
function getStepDescriptions(setupType) {
    if (setupType === SETUP_TYPES.SIMPLE) {
        return SIMPLE_STEP_DESCRIPTIONS
    }
    return EXTENDED_STEP_DESCRIPTIONS
}

/**
 * Calculate progress percentage
 * @param {number} currentStep - Current step number
 * @param {number} totalSteps - Total number of steps
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgressPercentage(currentStep, totalSteps) {
    return Math.round((currentStep / totalSteps) * 100)
}

/**
 * Create step data with state information
 * @param {StepDefinition} step - Step definition
 * @param {number} currentStep - Current step number
 * @param {Record<number, string>} descriptions - Step descriptions by step number
 * @returns {StepData} Step data with state
 */
function createStepData(step, currentStep, descriptions) {
    return {
        num: step.num,
        label: step.label,
        route: step.route,
        description: descriptions[step.num] || '',
        isActive: step.num === currentStep,
        isCompleted: step.num < currentStep,
        isFuture: step.num > currentStep,
        isClickable: true // All steps are clickable - users can navigate forward and backward freely
    }
}

/**
 * Generate progress indicator data for Nunjucks template
 * @param {number} currentStep - Current step number
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {ProgressIndicatorData} Progress data with steps and percentage
 */
export function getProgressIndicatorData(currentStep, setupType = SETUP_TYPES.SIMPLE) {
    const steps = getStepDefinitions(setupType)
    const totalSteps = steps.length
    const progressPercentage = calculateProgressPercentage(currentStep, totalSteps)
    const descriptions = getStepDescriptions(setupType)

    const stepsData = steps.map(step => createStepData(step, currentStep, descriptions))

    return {
        steps: stepsData,
        progressPercentage,
        totalSteps,
        currentStep,
        setupType
    }
}

/**
 * Get previous step route
 * @param {string} currentRoute - Current route name
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {string|null} Previous step route or null
 */
export function getPreviousStepRoute(currentRoute, setupType = SETUP_TYPES.SIMPLE) {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.route === currentRoute)

    if (currentIndex > 0) {
        return steps[currentIndex - 1].route
    }

    return null
}

/**
 * Get next step route
 * @param {string} currentRoute - Current route name
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {string|null} Next step route or null
 */
export function getNextStepRoute(currentRoute, setupType = SETUP_TYPES.SIMPLE) {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.route === currentRoute)

    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
        return steps[currentIndex + 1].route
    }

    return null
}

/**
 * Generate step wrapper with progress indicator update
 * @param {Function} renderTemplate - Nunjucks render function
 * @param {number} stepNumber - Current step number
 * @param {string} stepTemplate - Step template name
 * @param {Object} stepContext - Step template context
 * @returns {Promise<string>} Complete HTML with progress indicator (using HTMX out-of-band swap)
 */
export async function wrapStepWithProgress(renderTemplate, stepNumber, stepTemplate, stepContext = {}) {
    const setupType = stepContext.setupType || SETUP_TYPES.SIMPLE
    const progressData = getProgressIndicatorData(stepNumber, setupType)
    const progressHtml = await renderTemplate('partials/progress-indicator.html', progressData)
    const stepHtml = await renderTemplate(stepTemplate, stepContext)

    // HTMX will handle the out-of-band swap for the progress indicator
    // The content goes to #wizard-content, progress indicator goes to #progress-indicator
    return `${progressHtml}\n${stepHtml}`
}

/**
 * Render a template and return HTML response
 * @param {Object} c - Hono context
 * @param {string} template - Template name
 * @param {Object} context - Template context
 * @returns {Promise<Response>} HTML response
 */
export async function renderTemplateResponse(c, template, context = {}) {
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
export function getSetupTypeFromQuery(query) {
    const SETUP_TYPE_PARAM = 'type'
    const setupType = query[SETUP_TYPE_PARAM]

    // Validate setup type
    if (setupType === SETUP_TYPES.SIMPLE || setupType === SETUP_TYPES.EXTENDED) {
        return setupType
    }

    // Default to simple if invalid or missing
    return SETUP_TYPES.SIMPLE
}

/**
 * Export setup types for use in other modules
 */
export { SETUP_TYPES }
