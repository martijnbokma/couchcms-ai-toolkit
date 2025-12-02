#!/usr/bin/env bun
/**
 * Helper functions for wizard UI
 * Uses Nunjucks templates
 */

/**
 * Generate progress indicator data for Nunjucks template
 * @param {number} currentStep - Current step number (1-4)
 * @returns {Array} Steps data for template
 */
export function getProgressIndicatorData(currentStep) {
    const steps = [
        { num: 1, label: 'Project Info' },
        { num: 2, label: 'Complexity' },
        { num: 3, label: 'Frontend' },
        { num: 4, label: 'Review' }
    ]

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
 * Generate step wrapper with progress indicator update
 * @param {Function} renderTemplate - Nunjucks render function
 * @param {number} stepNumber - Current step number
 * @param {string} stepTemplate - Step template name
 * @param {Object} stepContext - Step template context
 * @returns {Promise<string>} Complete HTML with progress indicator (using HTMX out-of-band swap)
 */
export async function wrapStepWithProgress(renderTemplate, stepNumber, stepTemplate, stepContext = {}) {
    const progressSteps = getProgressIndicatorData(stepNumber)
    const progressHtml = await renderTemplate('partials/progress-indicator.html', { steps: progressSteps })
    const stepHtml = await renderTemplate(stepTemplate, stepContext)

    // HTMX will handle the out-of-band swap for the progress indicator
    // The content goes to #wizard-content, progress indicator goes to #progress-indicator
    return progressHtml + '\n' + stepHtml
}
