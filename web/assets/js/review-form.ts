/**
 * Review form submission handler
 * Ensures wizard state is included in form submission
 * This guarantees all selections are preserved even if hidden fields are incomplete
 */
(function() {
    'use strict'

    const GENERATE_FORM_ID = 'generate-form'
    const WIZARD_STATE_INPUT_ID = 'wizard-state-input'
    const WIZARD_CONTENT_ID = 'wizard-content'
    const INIT_DELAY_MS = 50

    /**
     * Get generate form element
     * @returns {HTMLFormElement | null} Generate form or null
     */
    function getGenerateForm(): HTMLFormElement | null {
        return document.getElementById(GENERATE_FORM_ID) as HTMLFormElement | null
    }

    /**
     * Get wizard state input element
     * @returns {HTMLInputElement | null} State input or null
     */
    function getWizardStateInput(): HTMLInputElement | null {
        return document.getElementById(WIZARD_STATE_INPUT_ID) as HTMLInputElement | null
    }

    /**
     * Check if WizardState is available
     * @returns {boolean} True if WizardState is available
     */
    function isWizardStateAvailable(): boolean {
        return typeof window.WizardState !== 'undefined' &&
               typeof (window.WizardState as WizardStateLegacy).collectFormData === 'function' &&
               typeof (window.WizardState as WizardStateLegacy).update === 'function' &&
               typeof (window.WizardState as WizardStateLegacy).load === 'function'
    }

    /**
     * Serialize wizard state to JSON string
     * @param {WizardState} state - Wizard state object
     * @returns {string | null} JSON string or null on error
     */
    function serializeState(state: Partial<WizardState> | null | undefined): string | null {
        if (!state || Object.keys(state).length === 0) {
            return null
        }

        try {
            return JSON.stringify(state)
        } catch (error) {
            console.error('[Review Form] Error serializing wizard state:', error)
            return null
        }
    }

    /**
     * Save and inject wizard state into form before submission
     */
    function saveAndInjectState(): void {
        if (!isWizardStateAvailable()) {
            console.warn('[Review Form] WizardState not available')
            return
        }

        try {
            const wizardState = window.WizardState as WizardStateLegacy
            const currentFormData = wizardState.collectFormData()
            wizardState.update(currentFormData)

            const completeState = wizardState.load()
            const stateInput = getWizardStateInput()

            if (!stateInput) {
                console.warn('[Review Form] Wizard state input not found')
                return
            }

            const serializedState = serializeState(completeState)
            if (serializedState) {
                stateInput.value = serializedState
                console.log('[Review Form] Wizard state included in submission:', completeState)
            }
        } catch (error) {
            console.error('[Review Form] Error saving wizard state:', error)
        }
    }

    /**
     * Check if event is for wizard content swap
     * @param {Event} event - HTMX event
     * @returns {boolean} True if event targets wizard content
     */
    function isWizardContentSwap(event: Event): boolean {
        const htmxEvent = event as CustomEvent
        const target = htmxEvent.detail?.target as HTMLElement | undefined
        const eventTarget = event.target as HTMLElement | undefined
        const targetId = target?.id || eventTarget?.id
        return targetId === WIZARD_CONTENT_ID
    }

    /**
     * Handle form submission (capture phase to run before HTMX)
     * @param {Event} event - Submit event
     */
    function handleFormSubmit(event: Event): void {
        const form = event.target as HTMLFormElement | null
        if (!form || form.id !== GENERATE_FORM_ID) {
            return
        }

        saveAndInjectState()
    }

    /**
     * Handle HTMX beforeRequest event
     * @param {Event} event - HTMX beforeRequest event
     */
    function handleHtmxBeforeRequest(event: Event): void {
        const htmxEvent = event as CustomEvent
        const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
        if (!form || form.id !== GENERATE_FORM_ID) {
            return
        }

        saveAndInjectState()
    }

    /**
     * Handle HTMX afterSwap event
     * @param {Event} event - HTMX afterSwap event
     */
    function handleHtmxSwap(event: Event): void {
        if (!isWizardContentSwap(event)) {
            return
        }

        setTimeout(initializeReviewForm, INIT_DELAY_MS)
    }

    /**
     * Setup form event listeners
     * @param {HTMLFormElement} form - Form element
     */
    function setupFormListeners(form: HTMLFormElement): void {
        // Use capture phase to run before HTMX processes the submit
        form.addEventListener('submit', handleFormSubmit, true)
        form.addEventListener('htmx:beforeRequest', handleHtmxBeforeRequest)
    }

    /**
     * Setup HTMX swap listener
     */
    function setupHtmxListener(): void {
        if (typeof window.htmx === 'undefined') {
            return
        }

        document.body.addEventListener('htmx:afterSwap', handleHtmxSwap)
    }

    /**
     * Initialize review form handlers
     */
    function initializeReviewForm(): void {
        const form = getGenerateForm()
        if (!form) {
            return
        }

        setupFormListeners(form)
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeReviewForm)
        } else {
            initializeReviewForm()
        }

        setupHtmxListener()
    }

    runInitialization()
})()
