#!/usr/bin/env bun
/**
 * Helper functions for wizard UI
 */

import { html } from 'hono/html'

/**
 * Generate progress indicator HTML for a specific step
 * @param {number} currentStep - Current step number (1-4)
 * @returns {string} HTML for progress indicator
 */
export function getProgressIndicator(currentStep) {
    const steps = [
        { num: 1, label: 'Project Info' },
        { num: 2, label: 'Complexity' },
        { num: 3, label: 'Frontend' },
        { num: 4, label: 'Review' }
    ]

    const stepsHtml = steps.map((step) => {
        const isActive = step.num === currentStep
        const isCompleted = step.num < currentStep
        const stepClass = isActive ? 'step step-primary' : (isCompleted ? 'step step-primary' : 'step')

        return `<div class="${stepClass}" id="step-${step.num}">${step.label}</div>`
    }).join('')

    return html`
<div class="steps steps-horizontal w-full mb-8" id="progress-indicator" hx-swap-oob="true">
    ${stepsHtml}
</div>
    `
}

/**
 * Generate badge HTML (properly rendered)
 * @param {string} text - Badge text
 * @param {string} variant - Badge variant (primary, secondary, accent, etc.)
 * @returns {string} HTML for badge
 */
export function renderBadge(text, variant = 'primary') {
    return `<span class="badge badge-${variant}">${text}</span>`
}

/**
 * Generate step wrapper with progress indicator update
 * @param {number} stepNumber - Current step number
 * @param {string} content - Step content HTML
 * @returns {string} Complete HTML with progress indicator (using HTMX out-of-band swap)
 */
export function wrapStepWithProgress(stepNumber, content) {
    const progressIndicator = getProgressIndicator(stepNumber)
    // HTMX will handle the out-of-band swap for the progress indicator
    // The content goes to #wizard-content, progress indicator goes to #progress-indicator
    return progressIndicator + '\n' + content
}
