#!/usr/bin/env bun
/**
 * Helper functions for wizard UI
 * Uses Nunjucks templates
 */

/**
 * Get step definitions for a setup type
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {Array} Step definitions
 */
export function getStepDefinitions(setupType) {
    if (setupType === 'simple') {
        return [
            { num: 1, label: 'Project Info', route: 'project' },
            { num: 2, label: 'Editors', route: 'editors' },
            { num: 3, label: 'Review', route: 'review' }
        ]
    } else {
        return [
            { num: 1, label: 'Project Info', route: 'project' },
            { num: 2, label: 'Frontend', route: 'frontend' },
            { num: 3, label: 'Dev Tools', route: 'devtools' },
            { num: 4, label: 'Editors', route: 'editors' },
            { num: 5, label: 'Advanced', route: 'advanced' },
            { num: 6, label: 'Review', route: 'review' }
        ]
    }
}

/**
 * Generate progress indicator data for Nunjucks template
 * @param {number} currentStep - Current step number
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {Array} Steps data for template
 */
export function getProgressIndicatorData(currentStep, setupType = 'simple') {
    const steps = getStepDefinitions(setupType)

    return steps.map((step) => {
        const isActive = step.num === currentStep
        const isCompleted = step.num < currentStep

        return {
            num: step.num,
            label: step.label,
            class: isActive ? 'step step-primary' : 'step',
            dataAttr: isCompleted ? 'data-completed="true"' : ''
        }
    })
}

/**
 * Get previous step route
 * @param {string} currentRoute - Current route name
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {string|null} Previous step route or null
 */
export function getPreviousStepRoute(currentRoute, setupType = 'simple') {
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
    const setupType = stepContext.setupType || 'simple'
    const progressSteps = getProgressIndicatorData(stepNumber, setupType)
    const progressHtml = await renderTemplate('partials/progress-indicator.html', { steps: progressSteps })
    const stepHtml = await renderTemplate(stepTemplate, stepContext)

    // HTMX will handle the out-of-band swap for the progress indicator
    // The content goes to #wizard-content, progress indicator goes to #progress-indicator
    return progressHtml + '\n' + stepHtml
}
