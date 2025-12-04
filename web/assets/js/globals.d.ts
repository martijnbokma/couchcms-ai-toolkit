/**
 * Global type definitions for window object
 * These types enable TypeScript support for the IIFE pattern used in this project
 */

// Wizard State Types
export interface WizardState {
    setupType: 'simple' | 'extended'
    projectName?: string
    projectDescription?: string
    preset?: string
    css?: string[]
    js?: string[]
    agents?: string[]
    editors?: string[]
    framework?: boolean | string
    framework_doctrine?: boolean | string
    framework_directives?: boolean | string
    framework_playbooks?: boolean | string
    framework_enhancements?: boolean | string
    contextDir?: string
    currentStep?: number
    completedSteps?: number[]
    lastUpdated?: number
    version?: string
}

// Wizard Config Types
export interface WizardConfig {
    STORAGE_KEY: string
    DEFAULT_PROJECT_NAME: string
    DEFAULT_PROJECT_DESCRIPTION: string
    DEFAULT_SETUP_TYPE: 'simple' | 'extended'
    DEBOUNCE_DELAY: number
    SYNC_DELAY: number
    INITIAL_RESTORE_DELAY: number
}

export interface WizardConstants {
    INVALID_VALUES: string[]
    FRAMEWORK_OPTIONS: string[]
    WIZARD_CONTENT_ID: string
    CHECKBOX_FIELDS: string[]
    CHECKBOX_CHECK_INTERVAL_MS: number
    SYNC_DELAY_MS: number
    WAIT_FOR_CHECKBOXES_TIMEOUT_MS: number
    RADIO_SAVE_DELAY_MS: number
    GENERATE_FORM_ID: string
    WIZARD_STATE_INPUT_ID: string
    SETUP_TYPES: {
        SIMPLE: 'simple'
        EXTENDED: 'extended'
    }
    FIELD_NAMES: {
        PROJECT_NAME: string
        PROJECT_DESCRIPTION: string
        SETUP_TYPE: string
        PRESET: string
        FRAMEWORK: string
        CONTEXT_DIR: string
    }
}

// Step Definition Types
export interface StepDefinition {
    num: number
    route: string
    label: string
}

// DOM Utils Types
export interface DOMUtils {
    isValidValue(value: string | null | undefined): boolean
    getVisibleInput(form: HTMLFormElement | null, name: string, type?: string | null): HTMLElement | null
    getHiddenInputs(form: HTMLFormElement | null, name: string): HTMLInputElement[]
    getCheckboxValues(form: HTMLFormElement | null, name: string, checkedOnly?: boolean): string[]
    normalizeProjectValue(value: string | string[] | null | undefined): string | null
}

// HTMX Utils Types
export interface HTMXUtils {
    isWizardContentTarget(event: Event): boolean
    isWizardContentSwap(event: Event): boolean
    isHtmxAvailable(): boolean
    htmxAjax(method: string, url: string, options?: Record<string, unknown>): Promise<unknown>
}

// Wizard State Manager Types
export interface WizardStateManager {
    storageKey: string
    stateVersion: string
    load(): WizardState
    save(state: WizardState): void
    update(updates: Partial<WizardState>): WizardState
    clear(): void
    validate(state: unknown): state is WizardState
    subscribe(listener: (state: WizardState) => void): () => void
    notify(state: WizardState): void
}

// Form State Sync Types
export interface FormStateSync {
    debounceDelay: number
    collectFormData(form: HTMLFormElement): WizardState
    applyStateToForm(form: HTMLFormElement, state: WizardState): void
    syncFormToState(form: HTMLFormElement, immediate?: boolean): void
    restoreStateToForm(form: HTMLFormElement): void
    setupFormListeners(form: HTMLFormElement): void
    cleanupFormListeners(form: HTMLFormElement): void
    cleanupAll(): void
}

// Wizard Navigation Types
export interface WizardNavigation {
    stepDefinitions: {
        simple: StepDefinition[]
        extended: StepDefinition[]
    }
    getCurrentStep(): StepDefinition | null
    getSteps(setupType: 'simple' | 'extended'): StepDefinition[]
    getNextStep(setupType: 'simple' | 'extended', currentStepNum: number): StepDefinition | null
    getPreviousStep(setupType: 'simple' | 'extended', currentStepNum: number): StepDefinition | null
    navigateToStep(stepNum: number, route: string, setupType?: 'simple' | 'extended'): void
}

// Wizard State (legacy) Types
export interface WizardStateLegacy {
    STORAGE_KEY: string
    save(state: WizardState): void
    load(): WizardState
    update(updates: Partial<WizardState>): WizardState
    clear(): void
    syncFromHiddenFields(): void
    collectFormData(): WizardState
    toURLParams(state?: Partial<WizardState>): URLSearchParams
}

// Global Window Interface
declare global {
    interface Window {
        // Config
        WIZARD_CONFIG: WizardConfig
        WIZARD_CONSTANTS: WizardConstants

        // Managers
        wizardStateManager: WizardStateManager
        formStateSync: FormStateSync
        wizardNavigation: WizardNavigation

        // Utils
        DOMUtils: DOMUtils
        HTMXUtils: HTMXUtils

        // State (legacy)
        WizardState: WizardStateLegacy

        // Legacy functions
        selectAllEditors?: () => void
        deselectAllEditors?: () => void
        toggleInfo?: (infoId: string, button?: HTMLElement) => void
        updateFrameworkVisibility?: () => void
        handleAdvancedSubmit?: (event: Event) => boolean
        editStep?: (button: HTMLElement) => void
        navigateToStep?: (stepNum: number, route: string, setupType: string) => void

        // Flags
        __WIZARD_INIT_V2_INITIALIZED__?: boolean
        __WIZARD_INIT_INITIALIZED__?: boolean

        // HTMX (external library)
        htmx?: {
            ajax: (method: string, url: string, options?: Record<string, unknown>) => Promise<unknown>
            [key: string]: unknown
        }
    }
}

export {}
