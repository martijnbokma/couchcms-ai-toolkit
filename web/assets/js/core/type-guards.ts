/**
 * Type Guards for Window Object Extensions
 * Ensures type safety when accessing window properties
 * Prevents runtime errors when dependencies are not loaded
 *
 * @module TypeGuards
 */

/**
 * Window interface with wizard extensions
 */
export interface WizardWindow extends Window {
    formStateSync?: {
        syncFormToState: (form: HTMLFormElement | null, immediate?: boolean) => void
        restoreStateToForm: (form: HTMLFormElement | null) => void
        setupFormListeners: (form: HTMLFormElement | null) => void
        cleanupFormListeners: (form: HTMLFormElement | null) => void
    }
    wizardStateManager?: {
        load: () => WizardState
        save: (state: Partial<WizardState>) => WizardState
        update: (updates: Partial<WizardState>) => WizardState
    }
    wizardNavigation?: {
        navigateToStep: (stepNum: number, route: string) => Promise<unknown>
        getCurrentStep: () => StepDefinition | null
        getNextStep: () => StepDefinition | null
        getPreviousStep: () => StepDefinition | null
    }
    StepConfig?: {
        simple: StepDefinition[]
        extended: StepDefinition[]
        presets: StepDefinition[]
    }
    HTMXUtils?: {
        htmxAjax: (method: string, url: string, options: unknown) => Promise<unknown>
    }
}

/**
 * Wizard state interface
 */
export interface WizardState {
    setupType: 'simple' | 'extended'
    currentStep?: number
    css?: string[]
    js?: string[]
    agents?: string[]
    editors?: string[]
    [key: string]: unknown
}

/**
 * Step definition interface
 */
export interface StepDefinition {
    num: number
    route: string
    label: string
    description?: string
}

/**
 * Type guard: Check if window has formStateSync
 */
export function hasFormStateSync(win: Window): win is WizardWindow {
    return (
        'formStateSync' in win &&
        win.formStateSync !== null &&
        win.formStateSync !== undefined &&
        typeof (win as WizardWindow).formStateSync?.syncFormToState === 'function'
    )
}

/**
 * Type guard: Check if window has wizardStateManager
 */
export function hasWizardStateManager(win: Window): win is WizardWindow {
    return (
        'wizardStateManager' in win &&
        win.wizardStateManager !== null &&
        win.wizardStateManager !== undefined &&
        typeof (win as WizardWindow).wizardStateManager?.load === 'function'
    )
}

/**
 * Type guard: Check if window has wizardNavigation
 */
export function hasWizardNavigation(win: Window): win is WizardWindow {
    return (
        'wizardNavigation' in win &&
        win.wizardNavigation !== null &&
        win.wizardNavigation !== undefined &&
        typeof (win as WizardWindow).wizardNavigation?.navigateToStep === 'function'
    )
}

/**
 * Type guard: Check if window has StepConfig
 */
export function hasStepConfig(win: Window): win is WizardWindow {
    return (
        'StepConfig' in win &&
        win.StepConfig !== null &&
        win.StepConfig !== undefined &&
        typeof (win as WizardWindow).StepConfig === 'object'
    )
}

/**
 * Type guard: Check if window has HTMXUtils
 */
export function hasHTMXUtils(win: Window): win is WizardWindow {
    return (
        'HTMXUtils' in win &&
        win.HTMXUtils !== null &&
        win.HTMXUtils !== undefined &&
        typeof (win as WizardWindow).HTMXUtils?.htmxAjax === 'function'
    )
}

/**
 * Safe access to formStateSync
 */
export function getFormStateSync(): WizardWindow['formStateSync'] {
    if (hasFormStateSync(window)) {
        return window.formStateSync
    }
    console.error('[TypeGuards] formStateSync not available')
    return undefined
}

/**
 * Safe access to wizardStateManager
 */
export function getWizardStateManager(): WizardWindow['wizardStateManager'] {
    if (hasWizardStateManager(window)) {
        return window.wizardStateManager
    }
    console.error('[TypeGuards] wizardStateManager not available')
    return undefined
}

/**
 * Safe access to wizardNavigation
 */
export function getWizardNavigation(): WizardWindow['wizardNavigation'] {
    if (hasWizardNavigation(window)) {
        return window.wizardNavigation
    }
    console.error('[TypeGuards] wizardNavigation not available')
    return undefined
}

/**
 * Safe access to StepConfig
 */
export function getStepConfig(): WizardWindow['StepConfig'] {
    if (hasStepConfig(window)) {
        return window.StepConfig
    }
    console.warn('[TypeGuards] StepConfig not available, using fallback')
    return undefined
}

/**
 * Safe access to HTMXUtils
 */
export function getHTMXUtils(): WizardWindow['HTMXUtils'] {
    if (hasHTMXUtils(window)) {
        return window.HTMXUtils
    }
    console.error('[TypeGuards] HTMXUtils not available')
    return undefined
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    ;(window as { TypeGuards?: typeof exports }).TypeGuards = {
        hasFormStateSync,
        hasWizardStateManager,
        hasWizardNavigation,
        hasStepConfig,
        hasHTMXUtils,
        getFormStateSync,
        getWizardStateManager,
        getWizardNavigation,
        getStepConfig,
        getHTMXUtils
    }
}
