/**
 * Universal back button handler (fallback for non-wizard pages)
 * For wizard pages, use the centralized goBack() from wizard-scripts.js
 */
(function() {
    'use strict'

    const WIZARD_CONTENT_TARGET = '#wizard-content'
    const SWAP_METHOD = 'innerHTML'

    /**
     * Check if goBack is already defined (from wizard-scripts.js)
     * @returns {boolean} True if goBack exists
     */
    function isGoBackDefined() {
        return typeof window.goBack !== 'undefined'
    }

    /**
     * Collect form data from current form
     * @param {HTMLFormElement|null} form - Form element
     * @returns {Object} Form data object
     */
    function collectFormData(form) {
        if (!form) {
            return {}
        }

        const formData = {}
        const formDataObj = new FormData(form)

        for (const [key, value] of formDataObj.entries()) {
            formData[key] = value
        }

        return formData
    }

    /**
     * Navigate back using HTMX
     * @param {string} backRoute - Route to navigate back to
     * @param {Object} formData - Form data to send
     */
    function navigateWithHtmx(backRoute, formData) {
        if (typeof htmx === 'undefined') {
            console.warn('[Back Button] HTMX not available, falling back to browser history')
            history.back()
            return
        }

        try {
            htmx.ajax('POST', backRoute, {
                target: WIZARD_CONTENT_TARGET,
                swap: SWAP_METHOD,
                values: formData
            })
        } catch (error) {
            console.error('[Back Button] Error navigating with HTMX:', error)
            history.back()
        }
    }

    /**
     * Fallback goBack implementation for non-wizard pages
     * @param {string} backRoute - Route to navigate back to (optional)
     * @param {Object} formData - Form data to send (optional)
     */
    function createFallbackGoBack() {
        return function goBack(backRoute = null, formData = {}) {
            const form = document.querySelector('form')
            const collectedData = collectFormData(form)
            const mergedData = { ...collectedData, ...formData }

            if (backRoute) {
                navigateWithHtmx(backRoute, mergedData)
            } else {
                history.back()
            }
        }
    }

    /**
     * Initialize back button handler
     */
    function initializeBackButton() {
        if (isGoBackDefined()) {
            return
        }

        window.goBack = createFallbackGoBack()
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeBackButton)
        } else {
            initializeBackButton()
        }
    }

    runInitialization()
})();
