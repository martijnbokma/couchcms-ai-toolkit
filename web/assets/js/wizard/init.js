/**
 * Wizard initialization
 * Combines setup type initialization and wizard script initialization
 */
(function() {
    'use strict'

    // Prevent multiple executions
    if (window.__WIZARD_INIT_INITIALIZED__) {
        console.log('[Wizard Init] Already initialized, skipping re-execution')
        return
    }
    window.__WIZARD_INIT_INITIALIZED__ = true

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS || !window.WizardState) {
        console.error('[Wizard Init] Required dependencies not loaded')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const WizardState = window.WizardState

    const FIELD_NAMES = WIZARD_CONSTANTS.FIELD_NAMES
    const CHECKBOX_FIELDS = WIZARD_CONSTANTS.CHECKBOX_FIELDS
    const RADIO_SAVE_DELAY_MS = WIZARD_CONSTANTS.RADIO_SAVE_DELAY_MS
    const TYPE_PARAM_NAME = 'type'

    /**
     * Get setup type from URL parameters or default
     * @returns {string} Setup type ('simple' or 'extended')
     */
    function getSetupType() {
        try {
            const urlParams = new URLSearchParams(window.location.search)
            return urlParams.get(TYPE_PARAM_NAME) || WIZARD_CONFIG.DEFAULT_SETUP_TYPE
        } catch (error) {
            console.warn('[Wizard Init] Error parsing URL parameters:', error)
            return WIZARD_CONFIG.DEFAULT_SETUP_TYPE
        }
    }

    /**
     * Initialize wizard state with setup type
     * @param {string} setupType - Setup type to initialize
     */
    function initializeWizardState(setupType) {
        try {
            WizardState.update({ setupType })
        } catch (error) {
            console.error('[Wizard Init] Error initializing wizard state:', error)
        }
    }

    /**
     * Save form state before form submissions (both native and HTMX)
     * CRITICAL: This ensures state is always saved before any form submission
     * @param {HTMLFormElement} form - Form element
     */
    function saveFormStateBeforeSubmit(form) {
        if (!form || form.tagName !== 'FORM') return

        // Always collect and save current form state
        const formData = WizardState.collectFormData()
        WizardState.update(formData)
        console.log('[saveFormStateBeforeSubmit] Saved state before form submission:', formData)

        // If this is the generate form, ensure wizard state is included
        if (form.id === WIZARD_CONSTANTS.GENERATE_FORM_ID) {
            const stateInput = document.getElementById(WIZARD_CONSTANTS.WIZARD_STATE_INPUT_ID)
            if (stateInput) {
                try {
                    const completeState = WizardState.load()
                    stateInput.value = JSON.stringify(completeState)
                    console.log('[saveFormStateBeforeSubmit] Wizard state included in generate form:', completeState)
                } catch (error) {
                    console.error('[saveFormStateBeforeSubmit] Error serializing wizard state:', error)
                }
            }
        }
    }

    /**
     * Setup form submission handlers
     */
    function setupFormSubmissionHandlers() {
        // Listen for native form submit events (before HTMX intercepts)
        document.body.addEventListener('submit', function(event) {
            const form = event.target
            if (form?.tagName === 'FORM') {
                saveFormStateBeforeSubmit(form)
            }
        }, true) // Use capture phase to catch before HTMX

        // Listen for HTMX beforeRequest events
        document.body.addEventListener('htmx:beforeRequest', function(event) {
            console.log('[htmx:beforeRequest] Event triggered')
            const form = (event.detail && event.detail.elt) || null
            if (form) {
                saveFormStateBeforeSubmit(form)
            }
        })
    }

    /**
     * Bind step button click handlers
     * @param {HTMLElement} button - Button element
     */
    function bindStepButton(button) {
        const stepNum = parseInt(button.getAttribute('data-step'))
        const route = button.getAttribute('data-route')
        const closestEl = button.closest('[data-setup-type]')
        const closestType = closestEl ? closestEl.getAttribute('data-setup-type') : null
        const queryEl = document.querySelector('[data-setup-type]')
        const queryType = queryEl ? queryEl.getAttribute('data-setup-type') : null
        const setupType = closestType || queryType || 'extended'

        button.addEventListener('click', function(e) {
            e.preventDefault()
            e.stopPropagation()
            if (typeof window.navigateToStep === 'function') {
                window.navigateToStep(stepNum, route, setupType)
            }
        })
    }

    /**
     * Initialize step button handlers
     */
    function initializeStepButtons() {
        const stepButtons = document.querySelectorAll('[data-step][data-route]')
        stepButtons.forEach(bindStepButton)
    }

    /**
     * Save user input to state as they type (debounced)
     * Prevents losing input when HTMX swaps occur
     * CRITICAL: Also saves checkbox changes immediately to ensure selections are preserved
     */
    function setupInputSaving() {
        let saveTimeout = null
        const saveUserInput = () => {
            clearTimeout(saveTimeout)
            saveTimeout = setTimeout(() => {
                const formData = WizardState.collectFormData()
                WizardState.update(formData)
                console.log('[setupInputSaving] State saved:', formData)
            }, WIZARD_CONFIG.DEBOUNCE_DELAY)
        }

        // Save immediately for checkboxes (no debounce needed)
        const saveCheckboxState = () => {
            const formData = WizardState.collectFormData()
            WizardState.update(formData)
            console.log('[setupInputSaving] Checkbox state saved immediately:', formData)
        }

        /**
         * Check if target is a project field input
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if project field
         */
        const isProjectField = (target) => {
            return target && (target.name === FIELD_NAMES.PROJECT_NAME || target.name === FIELD_NAMES.PROJECT_DESCRIPTION)
        }

        /**
         * Check if target is a checkbox that should trigger save
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if checkbox field
         */
        const isCheckboxField = (target) => {
            return target && target.type === 'checkbox' &&
                (CHECKBOX_FIELDS.includes(target.name) ||
                 target.name === FIELD_NAMES.FRAMEWORK ||
                 target.name.startsWith('framework_'))
        }

        /**
         * Check if target is a preset radio button
         * @param {HTMLElement} target - Event target
         * @returns {boolean} True if preset radio
         */
        const isPresetRadio = (target) => {
            return target && target.type === 'radio' && target.name === FIELD_NAMES.PRESET
        }

        // Use event delegation for better performance
        // Listen for text input changes (debounced)
        document.body.addEventListener('input', function(event) {
            if (isProjectField(event.target)) {
                saveUserInput()
            }
        }, true) // Use capture phase to catch events early

        // CRITICAL: Listen for checkbox changes and save immediately
        // This ensures selections are preserved when navigating between steps
        document.body.addEventListener('change', function(event) {
            if (isCheckboxField(event.target) || isPresetRadio(event.target)) {
                saveCheckboxState()
            }
        }, true) // Use capture phase to catch events early

        // Also listen for click events on checkboxes and radio buttons (for better compatibility)
        document.body.addEventListener('click', function(event) {
            if (isCheckboxField(event.target) || isPresetRadio(event.target)) {
                // Small delay to ensure state is updated
                setTimeout(saveCheckboxState, RADIO_SAVE_DELAY_MS)
            }
        }, true) // Use capture phase to catch events early
    }

    /**
     * Initialize wizard on page load
     */
    function initializeWizard() {
        const setupType = getSetupType()
        initializeWizardState(setupType)
    }

    /**
     * Initialize wizard scripts on DOM ready
     */
    function initializeWizardScripts() {
        // Initialize setup type
        initializeWizard()

        // Re-bind step buttons after HTMX swaps
        document.body.addEventListener('htmx:afterSwap', initializeStepButtons)

        // Initial bind
        initializeStepButtons()

        // Initial restore on page load
        setTimeout(() => {
            WizardState.syncFromHiddenFields()
            if (typeof window.restoreFormSelections === 'function') {
                window.restoreFormSelections()
            }
        }, WIZARD_CONFIG.INITIAL_RESTORE_DELAY)

        // Setup input saving
        setupInputSaving()

        // Setup form submission handlers
        setupFormSubmissionHandlers()
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWizardScripts)
        } else {
            initializeWizardScripts()
        }
    }

    // ============================================================================
    // Helper Functions
    // ============================================================================

    /**
     * Editor selection helpers
     */
    window.selectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = true)
    }

    window.deselectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = false)
    }

    /**
     * Advanced step helpers
     */
    window.toggleInfo = function(infoId) {
        const infoBox = document.getElementById(infoId)
        if (infoBox) infoBox.classList.toggle('hidden')
    }

    window.updateFrameworkVisibility = function() {
        const checkbox = document.querySelector(`input[name="${FIELD_NAMES.FRAMEWORK}"]`)
        const options = document.getElementById('framework-options')
        if (checkbox && options) {
            options.classList.toggle('hidden', !checkbox.checked)
        }
    }

    window.handleAdvancedSubmit = function() {
        return true
    }

    runInitialization()
})();
