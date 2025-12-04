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
    function isGoBackDefined(): boolean {
        return typeof window.goBack !== 'undefined'
    }

    /**
     * Collect form data from current form
     * @param {HTMLFormElement | null} form - Form element
     * @returns {Record<string, string>} Form data object
     */
    function collectFormData(form: HTMLFormElement | null): Record<string, string> {
        if (!form) {
            return {}
        }

        const formData: Record<string, string> = {}
        const formDataObj = new FormData(form)

        for (const [key, value] of formDataObj.entries()) {
            formData[key] = String(value)
        }

        return formData
    }

    /**
     * Navigate back using HTMX
     * @param {string} backRoute - Route to navigate back to
     * @param {Record<string, string>} formData - Form data to send
     */
    function navigateWithHtmx(backRoute: string, formData: Record<string, string>): void {
        if (typeof window.htmx === 'undefined') {
            console.warn('[Back Button] HTMX not available, falling back to browser history')
            history.back()
            return
        }

        try {
            if (window.htmx && typeof window.htmx.ajax === 'function') {
                window.htmx.ajax('POST', backRoute, {
                    target: WIZARD_CONTENT_TARGET,
                    swap: SWAP_METHOD,
                    values: formData
                } as never)
            } else {
                console.warn('[Back Button] HTMX ajax method not available, falling back to browser history')
                history.back()
            }
        } catch (error) {
            console.error('[Back Button] Error navigating with HTMX:', error)
            history.back()
        }
    }

    /**
     * Fallback goBack implementation for non-wizard pages
     * @param {string | null} backRoute - Route to navigate back to (optional)
     * @param {Record<string, string>} formData - Form data to send (optional)
     */
    function createFallbackGoBack(): (backRoute?: string | null, formData?: Record<string, string>) => void {
        return function goBack(backRoute: string | null = null, formData: Record<string, string> = {}): void {
            const form = document.querySelector<HTMLFormElement>('form')
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
    function initializeBackButton(): void {
        if (isGoBackDefined()) {
            return
        }

        window.goBack = createFallbackGoBack()
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeBackButton)
        } else {
            initializeBackButton()
        }
    }

    runInitialization()
})()

