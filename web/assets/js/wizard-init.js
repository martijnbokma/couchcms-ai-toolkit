/**
 * Wizard initialization script
 * Stores setup type and initializes wizard state on page load
 */
(function() {
    'use strict'

    const DEFAULT_SETUP_TYPE = 'simple'
    const SETUP_TYPE_STORAGE_KEY = 'setupType'
    const TYPE_PARAM_NAME = 'type'

    /**
     * Get setup type from URL parameters or default
     * @returns {string} Setup type ('simple' or 'extended')
     */
    function getSetupType() {
        try {
            const urlParams = new URLSearchParams(window.location.search)
            return urlParams.get(TYPE_PARAM_NAME) || DEFAULT_SETUP_TYPE
        } catch (error) {
            console.warn('[Wizard Init] Error parsing URL parameters:', error)
            return DEFAULT_SETUP_TYPE
        }
    }

    /**
     * Store setup type in session storage
     * @param {string} setupType - Setup type to store
     */
    function storeSetupType(setupType) {
        try {
            sessionStorage.setItem(SETUP_TYPE_STORAGE_KEY, setupType)
        } catch (error) {
            console.warn('[Wizard Init] Error storing setup type:', error)
        }
    }

    /**
     * Initialize wizard state with setup type
     * @param {string} setupType - Setup type to initialize
     */
    function initializeWizardState(setupType) {
        if (typeof WizardState === 'undefined' || !WizardState.update) {
            console.warn('[Wizard Init] WizardState not available')
            return
        }

        try {
            WizardState.update({ setupType })
        } catch (error) {
            console.error('[Wizard Init] Error initializing wizard state:', error)
        }
    }

    /**
     * Initialize wizard on page load
     */
    function initializeWizard() {
        const setupType = getSetupType()
        storeSetupType(setupType)
        initializeWizardState(setupType)
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeWizard)
        } else {
            initializeWizard()
        }
    }

    runInitialization()
})()
