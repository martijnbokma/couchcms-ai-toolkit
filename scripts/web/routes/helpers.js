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
            { num: 3, label: 'Editors & Tools', route: 'editors' },
            { num: 4, label: 'Advanced', route: 'advanced' },
            { num: 5, label: 'Review', route: 'review' }
        ]
    }
}

/**
 * Generate progress indicator data for Nunjucks template
 * @param {number} currentStep - Current step number
 * @param {string} setupType - 'simple' or 'extended'
 * @returns {Object} Progress data with steps and percentage
 */
export function getProgressIndicatorData(currentStep, setupType = 'simple') {
    const steps = getStepDefinitions(setupType)
    const totalSteps = steps.length
    // Progress should extend to the next step (not just current step)
    // For step 1 of 5: progress to step 2 = 1/4 = 25%
    // For step 2 of 5: progress to step 3 = 2/4 = 50%
    // Formula: (currentStep - 1) / (totalSteps - 1) * 100
    const progressPercentage = totalSteps === 1
        ? 100
        : Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)

    const stepDescriptions = {
        'simple': {
            1: 'Project name and description',
            2: 'Select editors and AI tools',
            3: 'Review and generate configuration'
        },
        'extended': {
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
            description: descriptions[step.num] || '',
            isActive,
            isCompleted,
            isFuture
        }
    })

    return {
        steps: stepsData,
        progressPercentage,
        totalSteps,
        currentStep
    }
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
    const progressData = getProgressIndicatorData(stepNumber, setupType)
    const progressHtml = await renderTemplate('partials/progress-indicator.html', progressData)
    const stepHtml = await renderTemplate(stepTemplate, stepContext)

    // HTMX will handle the out-of-band swap for the progress indicator
    // The content goes to #wizard-content, progress indicator goes to #progress-indicator
    return progressHtml + '\n' + stepHtml
}
