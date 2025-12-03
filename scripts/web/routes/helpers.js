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
    EXTENDED: 'extended'
}

/**
 * Step definition type
 * @typedef {Object} StepDefinition
 * @property {number} num - Step number
 * @property {string} label - Step label
 * @property {string} route - Step route name
 */

/**
 * Get step definitions for a setup type
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {StepDefinition[]} Step definitions
 */
export function getStepDefinitions(setupType) {
    if (setupType === SETUP_TYPES.SIMPLE) {
        return [
            { num: 1, label: 'Project Info', route: 'project' },
            { num: 2, label: 'Editors', route: 'editors' },
            { num: 3, label: 'Review', route: 'review' }
        ]
    } else {
        return [
            { num: 1, label: 'Project Info', route: 'project' },
            { num: 2, label: 'Frontend', route: 'frontend' },
            { num: 3, label: 'Editors & Tools', route: 'editors' },
            { num: 4, label: 'Advanced', route: 'advanced' },
            { num: 5, label: 'Review', route: 'review' }
        ]
    }
}

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
 * Generate progress indicator data for Nunjucks template
 * @param {number} currentStep - Current step number
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {ProgressIndicatorData} Progress data with steps and percentage
 */
export function getProgressIndicatorData(currentStep, setupType = SETUP_TYPES.SIMPLE) {
    const steps = getStepDefinitions(setupType)
    const totalSteps = steps.length
    const progressPercentage = Math.round((currentStep / totalSteps) * 100)

    const stepDescriptions = {
        [SETUP_TYPES.SIMPLE]: {
            1: 'Project name and description',
            2: 'Select editors and AI tools',
            3: 'Review and generate configuration'
        },
        [SETUP_TYPES.EXTENDED]: {
            1: 'Project name and description',
            2: 'CSS and JavaScript frameworks',
            3: 'Editors and AI tools',
            4: 'Advanced options and framework',
            5: 'Review and generate configuration'
        }
    }

    const descriptions = stepDescriptions[setupType] || {}

    const stepsData = steps.map((step) => {
        const isActive = step.num === currentStep
        const isCompleted = step.num < currentStep
        const isFuture = step.num > currentStep

        return {
            num: step.num,
            label: step.label,
            route: step.route,
            description: descriptions[step.num] || '',
            isActive,
            isCompleted,
            isFuture,
            isClickable: true // All steps are clickable - users can navigate forward and backward freely
        }
    })

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
    const currentIndex = steps.findIndex(s => s.route === currentRoute)

    if (currentIndex > 0) {
        return steps[currentIndex - 1].route
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
    return progressHtml + '\n' + stepHtml
}
