/**
 * Centralized Step Configuration (DRY)
 * Single source of truth for all wizard step definitions
 * Used by: wizard-navigation.ts, server routes, progress indicator
 *
 * @module StepConfig
 */

/**
 * Step definition interface
 */
export interface StepDefinition {
    num: number
    route: string
    label: string
    description?: string
    required?: boolean
    validation?: string[]
    nextButtonLabel?: string
    component?: string
}

/**
 * Step configuration for all setup types
 */
export const STEP_CONFIG = {
    simple: [
        {
            num: 1,
            route: 'project',
            label: 'Project',
            description: 'Project name and description',
            required: true,
            validation: ['projectName'],
            nextButtonLabel: 'Next: Editors',
            component: 'project'
        },
        {
            num: 2,
            route: 'editors',
            label: 'Editors',
            description: 'Select editors and AI tools',
            required: false,
            nextButtonLabel: 'Next: Review',
            component: 'editors'
        },
        {
            num: 3,
            route: 'review',
            label: 'Review',
            description: 'Review and generate configuration',
            required: true,
            nextButtonLabel: 'Generate Configuration',
            component: 'review'
        }
    ] as StepDefinition[],

    extended: [
        {
            num: 1,
            route: 'project',
            label: 'Project',
            description: 'Project name and description',
            required: true,
            validation: ['projectName'],
            nextButtonLabel: 'Next: Presets (Optional)',
            component: 'project'
        },
        {
            num: 2,
            route: 'presets',
            label: 'Presets',
            description: 'Choose a preset or skip to customize',
            required: false,
            nextButtonLabel: 'Next: Frontend Frameworks',
            component: 'presets'
        },
        {
            num: 3,
            route: 'frontend',
            label: 'Frontend',
            description: 'CSS and JavaScript frameworks',
            required: false,
            nextButtonLabel: 'Next: AI Agents',
            component: 'frontend'
        },
        {
            num: 4,
            route: 'agents',
            label: 'Agents',
            description: 'Select AI agents for specialized guidance',
            required: false,
            nextButtonLabel: 'Next: Editors',
            component: 'agents'
        },
        {
            num: 5,
            route: 'editors',
            label: 'Editors',
            description: 'Editors and AI tools',
            required: false,
            nextButtonLabel: 'Next: Advanced Options',
            component: 'editors'
        },
        {
            num: 6,
            route: 'advanced',
            label: 'Advanced',
            description: 'Advanced options and framework',
            required: false,
            nextButtonLabel: 'Next: Review',
            component: 'advanced'
        },
        {
            num: 7,
            route: 'review',
            label: 'Review',
            description: 'Review and generate configuration',
            required: true,
            nextButtonLabel: 'Generate Configuration',
            component: 'review'
        }
    ] as StepDefinition[],

    presets: [
        {
            num: 1,
            route: 'project',
            label: 'Project',
            description: 'Project name and description',
            required: true,
            validation: ['projectName'],
            nextButtonLabel: 'Next: Select Preset',
            component: 'project'
        },
        {
            num: 2,
            route: 'presets',
            label: 'Select Preset',
            description: 'Select project preset',
            required: true,
            nextButtonLabel: 'Next: Review',
            component: 'presets'
        },
        {
            num: 3,
            route: 'review',
            label: 'Review',
            description: 'Review and generate configuration',
            required: true,
            nextButtonLabel: 'Generate Configuration',
            component: 'review'
        }
    ] as StepDefinition[]
} as const

/**
 * Get step definitions for a setup type
 * @param setupType - Setup type ('simple', 'extended', or 'presets')
 * @returns Step definitions array
 */
export function getStepDefinitions(setupType: 'simple' | 'extended' | 'presets'): StepDefinition[] {
    return STEP_CONFIG[setupType] || STEP_CONFIG.simple
}

/**
 * Get step definition by route
 * @param route - Step route name
 * @param setupType - Setup type
 * @returns Step definition or null
 */
export function getStepByRoute(route: string, setupType: 'simple' | 'extended' | 'presets'): StepDefinition | null {
    const steps = getStepDefinitions(setupType)
    return steps.find(step => step.route === route) || null
}

/**
 * Get step definition by number
 * @param stepNum - Step number
 * @param setupType - Setup type
 * @returns Step definition or null
 */
export function getStepByNumber(stepNum: number, setupType: 'simple' | 'extended' | 'presets'): StepDefinition | null {
    const steps = getStepDefinitions(setupType)
    return steps.find(step => step.num === stepNum) || null
}

/**
 * Get step descriptions as a record
 * @param setupType - Setup type
 * @returns Record of step number to description
 */
export function getStepDescriptions(setupType: 'simple' | 'extended' | 'presets'): Record<number, string> {
    const steps = getStepDefinitions(setupType)
    const descriptions: Record<number, string> = {}
    steps.forEach(step => {
        if (step.description) {
            descriptions[step.num] = step.description
        }
    })
    return descriptions
}

/**
 * Calculate progress percentage
 * @param currentStep - Current step number
 * @param setupType - Setup type
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(currentStep: number, setupType: 'simple' | 'extended' | 'presets'): number {
    const steps = getStepDefinitions(setupType)
    return Math.round((currentStep / steps.length) * 100)
}

/**
 * Get total number of steps
 * @param setupType - Setup type
 * @returns Total number of steps
 */
export function getTotalSteps(setupType: 'simple' | 'extended' | 'presets'): number {
    return getStepDefinitions(setupType).length
}

/**
 * Get next step
 * @param currentStepNum - Current step number
 * @param setupType - Setup type
 * @returns Next step definition or null
 */
export function getNextStep(currentStepNum: number, setupType: 'simple' | 'extended' | 'presets'): StepDefinition | null {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.num === currentStepNum)
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
        return steps[currentIndex + 1]
    }
    return null
}

/**
 * Get previous step
 * @param currentStepNum - Current step number
 * @param setupType - Setup type
 * @returns Previous step definition or null
 */
export function getPreviousStep(currentStepNum: number, setupType: 'simple' | 'extended' | 'presets'): StepDefinition | null {
    const steps = getStepDefinitions(setupType)
    const currentIndex = steps.findIndex(step => step.num === currentStepNum)
    if (currentIndex > 0) {
        return steps[currentIndex - 1]
    }
    return null
}

// Export for use in other modules (IIFE pattern for compatibility)
if (typeof window !== 'undefined') {
    (window as { StepConfig?: typeof STEP_CONFIG }).StepConfig = STEP_CONFIG
    ;(window as { getStepDefinitions?: typeof getStepDefinitions }).getStepDefinitions = getStepDefinitions
    ;(window as { getStepByRoute?: typeof getStepByRoute }).getStepByRoute = getStepByRoute
    ;(window as { getStepByNumber?: typeof getStepByNumber }).getStepByNumber = getStepByNumber
    ;(window as { getStepDescriptions?: typeof getStepDescriptions }).getStepDescriptions = getStepDescriptions
    ;(window as { calculateProgressPercentage?: typeof calculateProgressPercentage }).calculateProgressPercentage = calculateProgressPercentage
    ;(window as { getTotalSteps?: typeof getTotalSteps }).getTotalSteps = getTotalSteps
    ;(window as { getNextStep?: typeof getNextStep }).getNextStep = getNextStep
    ;(window as { getPreviousStep?: typeof getPreviousStep }).getPreviousStep = getPreviousStep
}

