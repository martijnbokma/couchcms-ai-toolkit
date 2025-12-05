#!/usr/bin/env bun
/**
 * Helper functions for wizard UI
 * Uses Nunjucks templates
 */

/**
 * Setup type constants
 */
export const SETUP_TYPES = {
    SIMPLE: 'simple',
    EXTENDED: 'extended',
    PRESETS: 'presets'
} as const

export type SetupType = typeof SETUP_TYPES[keyof typeof SETUP_TYPES]

/**
 * Step definition interface
 */
export interface StepDefinition {
    num: number
    label: string
    route: string
}

/**
 * Step data with state information
 */
export interface StepData {
    num: number
    label: string
    route: string
    description: string
    isActive: boolean
    isCompleted: boolean
    isFuture: boolean
    isClickable: boolean
}

/**
 * Progress indicator data
 */
export interface ProgressIndicatorData {
    steps: StepData[]
    progressPercentage: number
    totalSteps: number
    currentStep: number
    setupType: SetupType
}

/**
 * Step definitions for simple setup flow
 */
const SIMPLE_STEPS: StepDefinition[] = [
    { num: 1, label: 'Project Info', route: 'project' },
    { num: 2, label: 'Editors', route: 'editors' },
    { num: 3, label: 'Review', route: 'review' }
]

/**
 * Step definitions for extended setup flow
 */
const EXTENDED_STEPS: StepDefinition[] = [
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
 */
const PRESETS_STEPS: StepDefinition[] = [
    { num: 1, label: 'Project Info', route: 'project' },
    { num: 2, label: 'Select Preset', route: 'presets' },
    { num: 3, label: 'Review', route: 'review' }
]

/**
 * Step descriptions for simple setup flow
 */
const SIMPLE_STEP_DESCRIPTIONS: Record<number, string> = {
    1: 'Project name and description',
    2: 'Select editors and AI tools',
    3: 'Review and generate configuration'
}

/**
 * Step descriptions for extended setup flow
 */
const EXTENDED_STEP_DESCRIPTIONS: Record<number, string> = {
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
 */
const PRESETS_STEP_DESCRIPTIONS: Record<number, string> = {
    1: 'Project name and description',
    2: 'Select project preset',
    3: 'Review and generate configuration'
}

/**
 * Get step definitions for a setup type
 * @param setupType - 'simple', 'extended', or 'presets'
 * @returns Step definitions
 */
export function getStepDefinitions(setupType: SetupType): StepDefinition[] {
    if (setupType === SETUP_TYPES.SIMPLE) {
        return SIMPLE_STEPS
    } else if (setupType === SETUP_TYPES.PRESETS) {
        return PRESETS_STEPS
    }
    return EXTENDED_STEPS
}

/**
 * Get step descriptions for a setup type
 * @param setupType - 'simple' or 'extended'
 * @returns Step descriptions by step number
 */
function getStepDescriptions(setupType: SetupType): Record<number, string> {
    if (setupType === SETUP_TYPES.SIMPLE) {
        return SIMPLE_STEP_DESCRIPTIONS
    } else if (setupType === SETUP_TYPES.PRESETS) {
        return PRESETS_STEP_DESCRIPTIONS
    }
    return EXTENDED_STEP_DESCRIPTIONS
}

/**
 * Calculate progress percentage
 * @param currentStep - Current step number
 * @param totalSteps - Total number of steps
 * @returns Progress percentage (0-100)
 */
function calculateProgressPercentage(currentStep: number, totalSteps: number): number {
    return Math.round((currentStep / totalSteps) * 100)
}

/**
 * Create step data with state information
 * @param step - Step definition
 * @param currentStep - Current step number
 * @param descriptions - Step descriptions by step number
 * @returns Step data with state
 */
function createStepData(
    step: StepDefinition,
    currentStep: number,
    descriptions: Record<number, string>
): StepData {
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
 * @param currentStep - Current step number
 * @param setupType - 'simple' or 'extended'
 * @returns Progress data with steps and percentage
 */
export function getProgressIndicatorData(
    currentStep: number,
    setupType: SetupType = SETUP_TYPES.SIMPLE
): ProgressIndicatorData {
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
 * @param currentRoute - Current route name
 * @param setupType - 'simple' or 'extended'
 * @returns Previous step route or null
 */
export function getPreviousStepRoute(
    currentRoute: string,
    setupType: SetupType = SETUP_TYPES.SIMPLE
): string | null {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.route === currentRoute)

    if (currentIndex > 0) {
        return steps[currentIndex - 1].route
    }

    return null
}

/**
 * Get next step route
 * @param currentRoute - Current route name
 * @param setupType - 'simple' or 'extended'
 * @returns Next step route or null
 */
export function getNextStepRoute(
    currentRoute: string,
    setupType: SetupType = SETUP_TYPES.SIMPLE
): string | null {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.route === currentRoute)

    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
        return steps[currentIndex + 1].route
    }

    return null
}

/**
 * Template render function type
 */
export type RenderTemplateFunction = (template: string, context?: Record<string, unknown>) => Promise<string>

/**
 * Generate step wrapper with progress indicator update
 * @param renderTemplate - Nunjucks render function
 * @param stepNumber - Current step number
 * @param stepTemplate - Step template name
 * @param stepContext - Step template context
 * @returns Complete HTML with progress indicator (using HTMX out-of-band swap)
 */
export async function wrapStepWithProgress(
    renderTemplate: RenderTemplateFunction,
    stepNumber: number,
    stepTemplate: string,
    stepContext: Record<string, unknown> = {}
): Promise<string> {
    try {
        const setupType = (stepContext.setupType as SetupType) || SETUP_TYPES.SIMPLE
        const progressData = getProgressIndicatorData(stepNumber, setupType)

        let progressHtml = ''
        try {
            progressHtml = await renderTemplate('partials/progress-indicator.html', progressData)
        } catch (progressError) {
            console.error('[wrapStepWithProgress] Error rendering progress indicator:', progressError)
            // Continue without progress indicator if it fails
            progressHtml = ''
        }

        let stepHtml = ''
        try {
            console.log('[wrapStepWithProgress] Rendering step template:', stepTemplate)
            console.log('[wrapStepWithProgress] Step context keys:', Object.keys(stepContext))
            stepHtml = await renderTemplate(stepTemplate, stepContext)
            console.log('[wrapStepWithProgress] Step template rendered successfully, length:', stepHtml.length)
        } catch (stepError) {
            console.error('[wrapStepWithProgress] Error rendering step template:', stepError)
            console.error('[wrapStepWithProgress] Step template:', stepTemplate)
            console.error('[wrapStepWithProgress] Step context keys:', Object.keys(stepContext))
            console.error('[wrapStepWithProgress] Step error name:', stepError instanceof Error ? stepError.name : 'Unknown')
            console.error('[wrapStepWithProgress] Step error message:', stepError instanceof Error ? stepError.message : 'Unknown')
            console.error('[wrapStepWithProgress] Step error stack:', stepError instanceof Error ? stepError.stack : 'No stack')
            throw stepError // Re-throw step template errors as they're critical
        }

        // HTMX will handle the out-of-band swap for the progress indicator
        // The content goes to #wizard-content, progress indicator goes to #progress-indicator
        return `${progressHtml}\n${stepHtml}`
    } catch (error) {
        console.error('[wrapStepWithProgress] Fatal error:', error)
        throw error
    }
}

/**
 * Render a template and return HTML response
 * @param c - Hono context with renderTemplate method
 * @param template - Template name
 * @param context - Template context
 * @returns HTML response
 */
export async function renderTemplateResponse(
    c: { renderTemplate: RenderTemplateFunction; html: (html: string, status?: number) => Response },
    template: string,
    context: Record<string, unknown> = {}
): Promise<Response> {
    try {
        const html = await c.renderTemplate(template, context)
        return c.html(html)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error rendering template ${template}:`, error)
        return c.html(
            `<div class="alert alert-error">
                <p>Error loading page. Please try again.</p>
                ${process.env.NODE_ENV === 'development' ? `<pre>${errorMessage}</pre>` : ''}
            </div>`,
            500
        )
    }
}

/**
 * Get setup type from query parameters with validation
 * @param query - Query parameters
 * @returns Validated setup type
 */
export function getSetupTypeFromQuery(query: Record<string, unknown>): SetupType {
    const SETUP_TYPE_PARAM = 'type'
    const setupType = query[SETUP_TYPE_PARAM]

    // Validate setup type
    if (setupType === SETUP_TYPES.SIMPLE || setupType === SETUP_TYPES.EXTENDED || setupType === SETUP_TYPES.PRESETS) {
        return setupType as SetupType
    }

    // Default to simple if invalid or missing
    return SETUP_TYPES.SIMPLE
}

